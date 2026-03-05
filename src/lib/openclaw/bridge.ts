import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { OPENCLAW_CONFIG, validateConfig } from './config';

const execAsync = promisify(exec);

// Types
export interface SpawnAgentParams {
  agentName: string;
  task: string;
  model?: string;
}

export interface AgentSession {
  sessionId: string;
  agentName: string;
  status: 'running' | 'completed' | 'error';
  createdAt: string;
}

export interface BridgeResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  command?: string;
}

/**
 * OpenClaw SSH Bridge
 * Execute OpenClaw CLI commands via SSH connection to VPS
 */
export class OpenClawBridge {
  private config = OPENCLAW_CONFIG;

  /**
   * Execute SSH command with retry logic
   */
  private async execSSH(
    command: string,
    retries = this.config.maxRetries
  ): Promise<BridgeResult> {
    const validation = validateConfig();
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const sshCommand = `ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 ${this.config.username}@${this.config.host} "${command.replace(/"/g, '\\"')}"`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { stdout, stderr } = await execAsync(sshCommand, {
          timeout: this.config.timeoutMs,
          maxBuffer: 1024 * 1024, // 1MB buffer
        });

        if (stderr && stderr.includes('Connection timed out')) {
          throw new Error('SSH connection timed out - check network/firewall');
        }

        if (stderr && !stdout) {
          throw new Error(stderr);
        }

        // Parse JSON response
        let data: any;
        try {
          data = JSON.parse(stdout);
        } catch {
          // Return raw output if not JSON
          data = stdout.trim();
        }

        return {
          success: true,
          data,
          command: sshCommand,
        };
      } catch (error: any) {
        const errorMsg = error.message || String(error);
        
        // Don't retry on certain errors
        if (
          errorMsg.includes('Permission denied') ||
          errorMsg.includes('Could not resolve hostname') ||
          errorMsg.includes('No such file or directory') ||
          errorMsg.includes('Connection timed out')
        ) {
          return {
            success: false,
            error: `SSH Error: ${errorMsg}`,
            command: sshCommand,
          };
        }

        // Last attempt failed
        if (attempt === retries) {
          return {
            success: false,
            error: `Failed after ${retries} attempts: ${errorMsg}`,
            command: sshCommand,
          };
        }

        // Wait before retry
        await this.delay(this.config.retryDelayMs * attempt);
      }
    }

    return {
      success: false,
      error: 'Unknown error',
      command: sshCommand,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ─── Agent Management ────────────────────────────────────────────

  /**
   * Spawn a new agent with a task
   */
  async spawnAgent(params: SpawnAgentParams): Promise<BridgeResult<AgentSession>> {
    const { agentName, task, model = 'qwen3.5-plus' } = params;
    
    // Escape special characters in task
    const escapedTask = task.replace(/"/g, '\\"').replace(/\n/g, ' ');
    
    const command = `${this.config.openclawPath} agent --label "${agentName}" --model "${model}" "${escapedTask}"`;
    
    const result = await this.execSSH(command);
    
    if (!result.success) {
      return result;
    }

    // Parse agent spawn result
    const sessionId = this.extractSessionId(result.data);
    
    return {
      success: true,
      data: {
        sessionId: sessionId || 'unknown',
        agentName,
        status: 'running',
        createdAt: new Date().toISOString(),
      },
    };
  }

  /**
   * List active agents/sessions
   */
  async listAgents(): Promise<BridgeResult<any[]>> {
    const command = `${this.config.openclawPath} status --json`;
    const result = await this.execSSH(command);

    if (!result.success) {
      return result;
    }

    // Extract sessions from status
    const sessions = result.data?.sessions?.recent || result.data?.recent || [];
    
    return {
      success: true,
      data: sessions.map((s: any) => ({
        sessionId: s.key || s.sessionId,
        agentId: s.agentId,
        kind: s.kind,
        status: s.abortedLastRun ? 'error' : 'running',
        updatedAt: s.updatedAt,
        model: s.model,
        tokens: {
          input: s.inputTokens,
          output: s.outputTokens,
          total: s.totalTokens,
        },
      })),
    };
  }

  /**
   * Send message to an agent session
   */
  async sendToAgent(sessionKey: string, message: string): Promise<BridgeResult> {
    const escapedMessage = message.replace(/"/g, '\\"');
    const command = `${this.config.openclawPath} sessions send "${sessionKey}" "${escapedMessage}"`;
    
    return await this.execSSH(command);
  }

  /**
   * Get agent/session status
   */
  async getAgentStatus(sessionKey: string): Promise<BridgeResult> {
    const command = `${this.config.openclawPath} sessions status "${sessionKey}" --json`;
    return await this.execSSH(command);
  }

  /**
   * Pause/stop an agent
   */
  async pauseAgent(sessionKey: string): Promise<BridgeResult> {
    // Try to send pause command or kill the session
    const command = `${this.config.openclawPath} sessions abort "${sessionKey}"`;
    return await this.execSSH(command);
  }

  /**
   * Kill a session
   */
  async killSession(sessionId: string): Promise<BridgeResult> {
    const command = `${this.config.openclawPath} process kill "${sessionId}"`;
    return await this.execSSH(command);
  }

  // ─── Gateway Status ──────────────────────────────────────────────

  /**
   * Get OpenClaw gateway status
   */
  async getGatewayStatus(): Promise<BridgeResult> {
    const command = `${this.config.openclawPath} status --json`;
    return await this.execSSH(command);
  }

  /**
   * Get health check
   */
  async healthCheck(): Promise<BridgeResult<{ healthy: boolean; sessions: number; agents: number }>> {
    const result = await this.getGatewayStatus();
    
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: {
        healthy: true,
        sessions: result.data?.sessions?.count || 0,
        agents: result.data?.heartbeat?.agents?.length || 0,
      },
    };
  }

  // ─── Workspace & Files ───────────────────────────────────────────

  /**
   * List workspace files
   */
  async listWorkspace(path: string = ''): Promise<BridgeResult<string[]>> {
    const fullPath = path 
      ? `${this.config.workspacePath}/${path}`
      : this.config.workspacePath;
    
    const command = `ls -la "${fullPath}"`;
    return await this.execSSH(command);
  }

  /**
   * Read file from workspace
   */
  async readWorkspaceFile(filePath: string): Promise<BridgeResult<string>> {
    const fullPath = `${this.config.workspacePath}/${filePath}`;
    const command = `cat "${fullPath}"`;
    return await this.execSSH(command);
  }

  // ─── Helper Methods ──────────────────────────────────────────────

  private extractSessionId(data: any): string | null {
    if (typeof data === 'string') {
      // Try to extract from output text
      const match = data.match(/session[\s:]+([a-z0-9:-]+)/i);
      return match ? match[1] : null;
    }
    return data?.sessionId || data?.key || null;
  }
}

// Export singleton instance
export const openclawBridge = new OpenClawBridge();
