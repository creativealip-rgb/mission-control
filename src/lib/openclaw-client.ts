import WebSocket from 'ws';

// ─── Types ───────────────────────────────────────────────────────

export interface OpenClawMessage {
    id: string;
    type: string;
    tool?: {
        name: string;
        parameters: Record<string, unknown>;
    };
    auth?: {
        token: string;
    };
}

export interface OpenClawResponse {
    id: string;
    type: string;
    status: string;
    data: Record<string, unknown>;
    error?: string;
}

export interface OpenClawAgent {
    agentId: string;
    name: string;
    desc?: string;
    allowedModels?: string[];
    runtimeDefaults?: Record<string, unknown>;
}

export interface OpenClawSession {
    sessionKey: string;
    agentId: string;
    kind: string;
    activeMinutes?: number;
    lastActivity?: string;
}

export interface OpenClawCronJob {
    key: string;
    schedule: string;
    agentId: string;
    prompt: string;
    enabled?: boolean;
}

// ─── Config ──────────────────────────────────────────────────────

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_TOKEN || '';

// ─── Helpers ─────────────────────────────────────────────────────

let msgCounter = 0;
function nextId(): string {
    return `mc-${Date.now()}-${++msgCounter}`;
}

/**
 * Send a single RPC call to the OpenClaw Gateway and wait for the response.
 * Opens a fresh WS connection per call (simple but safe for server-side API routes).
 */
export async function rpc(
    toolName: string,
    parameters: Record<string, unknown> = {},
    timeoutMs = 10_000
): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
        const id = nextId();
        const timer = setTimeout(() => {
            try { ws.close(); } catch { }
            reject(new Error(`OpenClaw RPC timeout: ${toolName}`));
        }, timeoutMs);

        let ws: WebSocket;
        try {
            ws = new WebSocket(GATEWAY_URL, {
                headers: {
                    'X-Gateway-Token': GATEWAY_TOKEN,
                    'X-Account': 'default',
                },
            });
        } catch (err) {
            clearTimeout(timer);
            reject(err);
            return;
        }

        ws.on('message', (raw) => {
            try {
                const data = JSON.parse(raw.toString()) as any;

                // Handle connection challenge
                if (data.type === 'event' && data.event === 'connect.challenge') {
                    const nonce = data.payload?.nonce;
                    if (!nonce) {
                        clearTimeout(timer);
                        reject(new Error('Gateway connect challenge missing nonce'));
                        return;
                    }

                    // Send connect message with full schema
                    const connectMsg = {
                        minProtocol: 3,
                        maxProtocol: 3,
                        client: {
                            id: 'cli',
                            version: '1.0.0',
                            platform: process.platform,
                            mode: 'cli',
                        },
                        role: 'operator',
                        scopes: ['operator.read', 'operator.write', 'operator.admin'],
                        auth: {
                            token: GATEWAY_TOKEN,
                        },
                    };
                    ws.send(JSON.stringify(connectMsg));

                    // Send req message after short delay
                    setTimeout(() => {
                        const msg = {
                            type: 'req',
                            id,
                            method: toolName,
                            params: parameters,
                        };
                        ws.send(JSON.stringify(msg));
                    }, 100);
                    return;
                }

                // Handle response
                if (data.type === 'res' && data.id === id) {
                    clearTimeout(timer);
                    ws.close();
                    
                    if (data.ok) {
                        resolve(data.payload);
                    } else {
                        reject(new Error(data.error?.message || 'Gateway request failed'));
                    }
                }
            } catch { }
        });

        ws.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}

// ─── Public API ──────────────────────────────────────────────────

/** List all configured agents */
export async function agentsList(): Promise<OpenClawAgent[]> {
    const resp = await rpc('agents.list');
    return (resp?.agents as OpenClawAgent[]) || [];
}

/** List active sessions */
export async function sessionsList(opts?: {
    kinds?: string[];
    activeMinutes?: number;
    limit?: number;
}): Promise<OpenClawSession[]> {
    const resp = await rpc('sessions.list', {
        kinds: opts?.kinds || ['subagent', 'acp'],
        activeMinutes: opts?.activeMinutes ?? 5,
        limit: opts?.limit ?? 20,
    });
    return (resp?.sessions as OpenClawSession[]) || [];
}

/** Get chat history for a session */
export async function sessionsHistory(sessionKey: string, limit = 50) {
    const resp = await rpc('sessions.history', {
        sessionKey,
        limit,
        includeTools: true,
    });
    return resp;
}

/** Send a message to a session (used for Ping) */
export async function sessionsSend(
    sessionKey: string,
    message: string,
    timeoutSeconds = 5
) {
    const resp = await rpc('sessions.send', {
        sessionKey,
        message,
        timeoutSeconds,
    });
    return resp;
}

/** List cron jobs */
export async function cronList(): Promise<OpenClawCronJob[]> {
    const resp = await rpc('cron.list');
    return (resp?.jobs as OpenClawCronJob[]) || [];
}

/** Get gateway health/status */
export async function gatewayStatus() {
    const resp = await rpc('status');
    return resp;
}

/** Get gateway health check */
export async function gatewayHealth() {
    const resp = await rpc('health');
    return resp;
}

/** List subagents with recent activity */
export async function subagentsList(recentMinutes = 1) {
    const resp = await rpc('subagents', {
        action: 'list',
        recentMinutes,
    });
    return resp;
}

/** Steer/pause a subagent */
export async function subagentsSteer(target: string, message: string) {
    const resp = await rpc('subagents', {
        action: 'steer',
        target,
        message,
    });
    return resp;
}

/** Kill a process/session */
export async function processKill(sessionId: string) {
    const resp = await rpc('process', {
        action: 'kill',
        sessionId,
    });
    return resp;
}

/** Check if gateway is configured (has token) */
export function isConfigured(): boolean {
    return GATEWAY_TOKEN.length > 0 && GATEWAY_TOKEN !== 'REPLACE_WITH_YOUR_GATEWAY_TOKEN';
}
