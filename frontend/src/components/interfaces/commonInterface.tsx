export interface Notification {
  _id: string;
  user_id: string; // admin or sender
  assignedUserId: string; // recipient
  taskId: string; // related task
  message: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;   // optional — allows custom width
  heightClass?: string;  // optional — allows custom height
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  members?: string[];
}

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => void;
  mode: "create" | "edit";
  project?: Project | null;
}

export interface TaskActivity {
  _id?: string;
  user: string;
  action: string;
  timestamp: Date;
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  projectId?: string;
  assignee?: string;
  status: "pending" | "inprogress" | "completed";
  priority: "Low" | "Medium" | "High";
  deadline?: Date | null;
  activityLog?: TaskActivity[];
}

export interface TaskProps {
  tasks: Task[];
  onCreateTask?: () => void;
  onTaskClick: (task: Task) => void;
  hideCreateButton?: boolean; // 👈 optional, for user view
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  mode: "create" | "edit";
  task?: Task | null;
  readOnlyFields?: boolean; // true for user (view-only mode)
}

