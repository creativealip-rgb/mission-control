import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'mission-control.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo',
    agent_id TEXT,
    project_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    model TEXT,
    device TEXT,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    cron_expression TEXT,
    color TEXT DEFAULT '#5E6AD2',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    file_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default data if empty
const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
if (taskCount.count === 0) {
  // Default tasks
  db.prepare(`INSERT INTO tasks (title, status, agent_id) VALUES 
    ('Data Preprocessing', 'todo', 'A'),
    ('Feature Engineering', 'in_progress', 'B'),
    ('Model Training Setup', 'review', 'A'),
    ('Deploy to Production', 'done', 'C')`).run();

  // Default projects
  db.prepare(`INSERT INTO projects (name, description, progress) VALUES 
    ('AI Extension for School', 'Build AI extension for educational purposes', 35),
    ('Internal Knowledge Base', 'Create internal KB system', 60)`).run();

  // Default agents
  db.prepare(`INSERT INTO agents (name, role, model, device, parent_id) VALUES 
    ('Henry', 'Leader', 'GPT-4', 'Mac Studio', NULL),
    ('Charlie', 'Engineer', 'Qwen', 'Mac Studio', 1),
    ('Ralph', 'Assistant', 'ChatGPT', 'Cloud', 1),
    ('Violet', 'Researcher', 'Claude', 'Cloud', 1)`).run();

  // Default schedules
  db.prepare(`INSERT INTO schedules (title, cron_expression, color) VALUES 
    ('Daily Sync', '0 9 * * *', '#10B981'),
    ('Weekly Report', '0 18 * * 5', '#3B82F6'),
    ('Code Review', '0 14 * * 1-5', '#F59E0B')`).run();

  // Default documents
  db.prepare(`INSERT INTO documents (title, content, category, file_type) VALUES 
    ('Q1 Planning', 'Quarter 1 planning document', 'Planning', 'doc'),
    ('Newsletter Draft', 'Content for upcoming edition', 'Newsletter', 'doc'),
    ('API Documentation', 'API reference guide', 'Code', 'md')`).run();

  // Default memories
  db.prepare(`INSERT INTO memories (content, category, tags) VALUES 
    ('Idea: Build autonomous agent network', 'Idea', 'ai,automation'),
    ('Meeting with team about Q1 goals', 'Meeting', 'planning,team'),
    ('Reflection on automation success', 'Reflection', 'learning')`).run();

  // Default mission
  db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES ('mission', 'Build an autonomous organization of AI agents that do work for me and produce value 24/7')`).run();
}

export default db;

export type Task = {
  id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  agent_id: string;
  project_id: number | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  created_at: string;
};

export type Agent = {
  id: number;
  name: string;
  role: string;
  model: string;
  device: string;
  parent_id: number | null;
};

export type Activity = {
  id: number;
  agent_id: string;
  action: string;
  details: string;
  timestamp: string;
};

export type Schedule = {
  id: number;
  title: string;
  cron_expression: string;
  color: string;
  created_at: string;
};

export type Document = {
  id: number;
  title: string;
  content: string;
  category: string;
  file_type: string;
  created_at: string;
};

export type Memory = {
  id: number;
  content: string;
  category: 'Idea' | 'Meeting' | 'Reflection';
  tags: string;
  created_at: string;
};
