# Mission Control - AI-Powered Project Management System

## Overview
- **Project Name:** Mission Control
- **Type:** Web Application (Next.js)
- **Core Functionality:** AI-powered project management with autonomous agents, kanban boards, calendar, document management, and gamified virtual office
- **Target Users:** Individual entrepreneurs, small teams, AI hobbyists

## Tech Stack
- Next.js 14 (App Router)
- SQLite (better-sqlite3)
- Tailwind CSS
- TypeScript
- OpenClaw integration

## UI/UX Specification

### Layout Structure
- **Sidebar Navigation:** Left sidebar with 7 module icons (Task Board, Kalender, Projects, Tim, Memories, Docs, Virtual Office)
- **Main Content Area:** Dynamic content based on selected module
- **Header:** Module title + action buttons

### Visual Design
- **Color Palette:**
  - Background: #0D0D0D (dark), #FFFFFF (light)
  - Primary: #5E6AD2 (indigo)
  - Secondary: #2A2A2A (dark gray)
  - Accent: #10B981 (emerald green for success)
  - Warning: #F59E0B (amber)
  - Error: #EF4444 (red)
  - Text Primary: #FFFFFF (dark), #1F2937 (light)
  - Text Secondary: #9CA3AF

- **Typography:**
  - Font: Inter, system-ui
  - Headings: 24px (h1), 20px (h2), 16px (h3)
  - Body: 14px
  - Small: 12px

- **Spacing:** 4px base unit (4, 8, 12, 16, 24, 32, 48)

- **Border Radius:** 6px (small), 8px (medium), 12px (large)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Module Specifications

### Module 1: Task Board (Priority)

**Kanban Columns:**
- To Do (gray)
- In Progress (blue)
- Review (yellow)
- Done (green)

**Task Cards:**
- Title (bold, 14px)
- Agent avatar/initials (circular, 24px)
- Drag-and-drop functionality

**Activity Feed:**
- Real-time log panel on right side
- Timestamp format: "HH:MM:SS AM/PM"
- Format: "[Time] - AI Agent [Letter] [action]"

### Module 2: Kalender

**Weekly View:**
- 7-day columns with day names
- Time slots (optional)
- Color-coded schedule blocks

### Module 3: Projects

**Project List:**
- Project name
- Progress bar (horizontal, percentage)
- Task count

### Module 4: Tim & Misi

**Mission Statement:**
- Large text box at top
- Editable inline

**Org Chart:**
- Tree structure
- Root: Main agent
- Branches: Subordinate agents
- Each node: name, role, model/device

### Module 5: Memories

**Timeline View:**
- Date column (left)
- Journal entries (right)
- Category colors:
  - Idea: Green (#10B981)
  - Meeting: Blue (#3B82F6)
  - Reflection: Yellow (#F59E0B)

### Module 6: Docs

**Search Bar:**
- Full-width search at top

**Filter Chips:**
- Newsletter (red)
- Code (blue)
- Planning (purple)
- Images (yellow)
- All (gray)

**Document Grid:**
- Card layout
- File icon, title, snippet, category, timestamp

### Module 7: Virtual Office

**2D Pixel Art:**
- Isometric view
- Office rooms with desks
- AI agent avatars at workstations
- Interactive elements (water dispenser, etc.)

---

## Database Schema (SQLite)

```sql
-- Tasks
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo',
  agent_id TEXT,
  project_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents
CREATE TABLE agents (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  model TEXT,
  device TEXT,
  parent_id INTEGER,
  FOREIGN KEY (parent_id) REFERENCES agents(id)
);

-- Activities
CREATE TABLE activities (
  id INTEGER PRIMARY KEY,
  agent_id TEXT,
  action TEXT NOT NULL,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Schedules
CREATE TABLE schedules (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  cron_expression TEXT,
  color TEXT DEFAULT '#5E6AD2',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  file_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Memories/Journal
CREATE TABLE memories (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mission Statement
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

---

## Acceptance Criteria

1. ✅ All 7 modules accessible from sidebar
2. ✅ Task Board: Drag-and-drop works between columns
3. ✅ Activity Feed: Shows real-time updates
4. ✅ Calendar: Weekly view with schedule blocks
5. ✅ Projects: List with progress bars
6. ✅ Tim: Org chart with editable mission
7. ✅ Memories: Timeline with category colors
8. ✅ Docs: Search and filter functionality
9. ✅ Virtual Office: Pixel art office visualization
10. ✅ Dark mode by default
11. ✅ SQLite persistence works
