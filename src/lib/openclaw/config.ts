// OpenClaw SSH Bridge Configuration
// Note: For passwordless SSH, ensure your key is added to the VPS

export const OPENCLAW_CONFIG = {
  // SSH Connection
  host: process.env.EC2_HOST || '52.64.169.254',
  username: process.env.EC2_USER || 'ubuntu',
  
  // OpenClaw paths on VPS
  openclawPath: '/home/ubuntu/.npm-global/bin/openclaw',
  workspacePath: '/home/ubuntu/.openclaw/workspace',
  
  // Connection settings
  timeoutMs: 30000,
  maxRetries: 3,
  retryDelayMs: 1000,
} as const;

// Validate configuration
export function validateConfig(): { valid: boolean; error?: string } {
  if (!OPENCLAW_CONFIG.host) {
    return { valid: false, error: 'EC2_HOST not configured' };
  }
  if (!OPENCLAW_CONFIG.username) {
    return { valid: false, error: 'EC2_USER not configured' };
  }
  return { valid: true };
}
