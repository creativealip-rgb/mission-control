@echo off
echo Starting SSH Tunnel to OpenClaw Gateway...
echo.
echo Server: 52.64.169.254
echo Port: 18789 (local) -> 18789 (VPS)
echo.
echo Keep this window open while using Mission Control!
echo.
ssh -o ConnectTimeout=30 -o ServerAliveInterval=15 -L 18789:127.0.0.1:18789 ubuntu@52.64.169.254 -N
pause
