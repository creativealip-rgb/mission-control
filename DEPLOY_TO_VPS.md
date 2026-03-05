# Deploy Mission Control to VPS

Karena SSH dari Windows Anda ke VPS terblok, deploy saja aplikasi ke VPS.

## Langkah 1: Upload Code ke VPS

```bash
# Di terminal Windows/WSL yang bisa SSH
scp -r . ubuntu@52.64.169.254:~/mission-control
ssh ubuntu@52.64.169.254
```

## Langkah 2: Install Dependencies di VPS

```bash
cd ~/mission-control
npm install
```

## Langkah 3: Setup .env.local di VPS

```bash
cat > .env.local << 'ENVEOF'
EC2_HOST=localhost
EC2_USER=ubuntu
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_TOKEN=c8e8990089f94cfad286b6da901d10d065c8bc7f57a40fc8
ENVEOF
```

## Langkah 4: Run di VPS

```bash
npm run dev -- --hostname 0.0.0.0
```

## Langkah 5: Akses dari Browser

Buka: `http://52.64.169.254:3000`

Aplikasi akan langsung connected ke OpenClaw Gateway karena satu server!
