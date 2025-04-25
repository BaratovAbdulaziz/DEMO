// File System Types
export interface IFile {
  name: string;
  content: string;
  type: 'file';
  createdAt: Date;
  updatedAt: Date;
  permissions: string;
  owner: string;
  size: number;
}

export interface IDirectory {
  name: string;
  type: 'directory';
  createdAt: Date;
  updatedAt: Date;
  permissions: string;
  owner: string;
  children: Record<string, IFile | IDirectory>;
}

export type FileSystemEntry = IFile | IDirectory;

// Process Types
export interface IProcess {
  id: string;
  name: string;
  command: string;
  pid: number;
  status: 'running' | 'stopped' | 'finished';
  startTime: Date;
  endTime?: Date;
  output?: string;
}

// Command Types
export interface ICommand {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[], options: Record<string, string>) => Promise<string>;
}

// Terminal Types
export interface ITerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error';
}

// User Types
export interface IUser {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

// Theme Type
export type Theme = 'dark' | 'light';