// OpenClaw SSH Bridge - Main exports

export { OPENCLAW_CONFIG, validateConfig } from './config';
export { 
  OpenClawBridge, 
  openclawBridge,
  type SpawnAgentParams,
  type AgentSession,
  type BridgeResult,
} from './bridge';
