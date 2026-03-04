import { Client, SFTPWrapper } from 'ssh2';
import path from 'path';
import fs from 'fs';

const EC2_HOST = process.env.EC2_HOST || '52.64.169.254';
const EC2_USER = process.env.EC2_USER || 'ubuntu';
const EC2_KEY_PATH = process.env.EC2_KEY_PATH || '';
const WORKSPACE_PATH = process.env.OPENCLAW_WORKSPACE_PATH || '/home/ubuntu/.openclaw/workspace';

interface FileInfo {
    name: string;
    path: string;
    size: number;
    isDirectory: boolean;
    modifiedAt: Date;
}

function getPrivateKey(): string | undefined {
    if (!EC2_KEY_PATH) return undefined;
    const resolved = path.resolve(EC2_KEY_PATH);
    if (fs.existsSync(resolved)) {
        return fs.readFileSync(resolved, 'utf-8');
    }
    // Maybe the key is stored directly as env var content
    if (EC2_KEY_PATH.startsWith('-----BEGIN')) {
        return EC2_KEY_PATH;
    }
    return undefined;
}

function getConnection(): Promise<Client> {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const privateKey = getPrivateKey();

        conn.on('ready', () => resolve(conn));
        conn.on('error', (err) => reject(err));

        conn.connect({
            host: EC2_HOST,
            port: 22,
            username: EC2_USER,
            ...(privateKey ? { privateKey } : {}),
        });
    });
}

function getSftp(conn: Client): Promise<SFTPWrapper> {
    return new Promise((resolve, reject) => {
        conn.sftp((err, sftp) => {
            if (err) reject(err);
            else resolve(sftp);
        });
    });
}

/** List files in a directory on the VPS */
export async function listFiles(dirPath?: string): Promise<FileInfo[]> {
    const targetDir = dirPath || WORKSPACE_PATH;
    const conn = await getConnection();
    const sftp = await getSftp(conn);

    return new Promise((resolve, reject) => {
        sftp.readdir(targetDir, (err, list) => {
            conn.end();
            if (err) {
                reject(err);
                return;
            }
            const files: FileInfo[] = list.map((item) => ({
                name: item.filename,
                path: path.posix.join(targetDir, item.filename),
                size: item.attrs.size,
                isDirectory: (item.attrs.mode! & 0o40000) !== 0,
                modifiedAt: new Date(item.attrs.mtime * 1000),
            }));
            resolve(files);
        });
    });
}

/** Read a file from the VPS */
export async function readFile(filePath: string): Promise<string> {
    const conn = await getConnection();
    const sftp = await getSftp(conn);

    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        const stream = sftp.createReadStream(filePath);
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
            conn.end();
            resolve(Buffer.concat(chunks).toString('utf-8'));
        });
        stream.on('error', (err: Error) => {
            conn.end();
            reject(err);
        });
    });
}

/** Check if SSH is configured */
export function isSSHConfigured(): boolean {
    const key = getPrivateKey();
    return !!EC2_HOST && !!EC2_USER && !!key;
}

/** List workspace files (in the OpenClaw workspace) */
export async function listWorkspaceFiles(subdir?: string): Promise<FileInfo[]> {
    const dir = subdir ? path.posix.join(WORKSPACE_PATH, subdir) : WORKSPACE_PATH;
    return listFiles(dir);
}

/** Read a workspace file */
export async function readWorkspaceFile(relativePath: string): Promise<string> {
    const fullPath = path.posix.join(WORKSPACE_PATH, relativePath);
    return readFile(fullPath);
}
