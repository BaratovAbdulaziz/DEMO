import { IDirectory, IFile, FileSystemEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

class FileSystemService {
  private rootFs: IDirectory;
  private currentPath: string[] = [];
  private defaultPermissions = 'rwxr-xr-x';
  private defaultOwner = 'user';
  
  constructor() {
    this.rootFs = this.createInitialFileSystem();
  }
  
  private createInitialFileSystem(): IDirectory {
    const now = new Date();
    
    // Create standard Linux directories
    const root: IDirectory = {
      name: '/',
      type: 'directory',
      createdAt: now,
      updatedAt: now,
      permissions: this.defaultPermissions,
      owner: 'root',
      children: {}
    };
    
    // Add standard directories
    const standardDirs = [
      'bin', 'etc', 'home', 'tmp', 'usr', 'var'
    ];
    
    standardDirs.forEach(dir => {
      root.children[dir] = {
        name: dir,
        type: 'directory',
        createdAt: now,
        updatedAt: now,
        permissions: this.defaultPermissions,
        owner: 'root',
        children: {}
      };
    });
    
    // Add user home directory
    (root.children['home'] as IDirectory).children['user'] = {
      name: 'user',
      type: 'directory',
      createdAt: now,
      updatedAt: now,
      permissions: this.defaultPermissions,
      owner: this.defaultOwner,
      children: {}
    };
    
    // Add a welcome file
    const userHomeDir = (root.children['home'] as IDirectory).children['user'] as IDirectory;
    userHomeDir.children['welcome.txt'] = {
      name: 'welcome.txt',
      type: 'file',
      content: 'Welcome to Mini Core Web!\nType "help" to see available commands.',
      createdAt: now,
      updatedAt: now,
      permissions: 'rw-r--r--',
      owner: this.defaultOwner,
      size: 62
    };
    
    return root;
  }
  
  public getCurrentPath(): string {
    return '/' + this.currentPath.join('/');
  }
  
  public getCurrentPathAsArray(): string[] {
    return [...this.currentPath];
  }
  
  public changeDirectory(path: string): boolean {
    if (path === '/') {
      this.currentPath = [];
      return true;
    }
    
    if (path === '..') {
      if (this.currentPath.length > 0) {
        this.currentPath.pop();
        return true;
      }
      return true; // Already at root
    }
    
    if (path === '.') {
      return true; // Stay in current directory
    }
    
    // Handle absolute paths
    if (path.startsWith('/')) {
      const parts = path.split('/').filter(Boolean);
      let current = this.rootFs;
      
      for (const part of parts) {
        if (part === '.' || part === '') continue;
        if (part === '..') {
          parts.splice(parts.indexOf(part) - 1, 2);
          continue;
        }
        
        const child = current.children[part];
        if (!child || child.type !== 'directory') {
          return false; // Path not found or not a directory
        }
        current = child as IDirectory;
      }
      
      this.currentPath = parts;
      return true;
    }
    
    // Handle relative paths
    const parts = path.split('/').filter(Boolean);
    let current = this.getCurrentDirectory();
    
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (this.currentPath.length > 0) {
          this.currentPath.pop();
        }
        current = this.getCurrentDirectory();
        continue;
      }
      
      const child = current.children[part];
      if (!child || child.type !== 'directory') {
        return false; // Path not found or not a directory
      }
      
      this.currentPath.push(part);
      current = child as IDirectory;
    }
    
    return true;
  }
  
  public getCurrentDirectory(): IDirectory {
    let current = this.rootFs;
    
    for (const part of this.currentPath) {
      const child = current.children[part];
      if (!child || child.type !== 'directory') {
        // This shouldn't happen if path management is correct
        throw new Error(`Invalid path: /${this.currentPath.join('/')}`);
      }
      current = child as IDirectory;
    }
    
    return current;
  }
  
  public listDirectory(path?: string): FileSystemEntry[] {
    let targetDir: IDirectory;
    
    if (!path || path === '.') {
      targetDir = this.getCurrentDirectory();
    } else if (path === '..') {
      const pathCopy = [...this.currentPath];
      if (pathCopy.length > 0) {
        pathCopy.pop();
      }
      
      targetDir = this.getDirectoryFromPath(pathCopy);
    } else if (path.startsWith('/')) {
      // Absolute path
      const parts = path.split('/').filter(Boolean);
      targetDir = this.getDirectoryFromPath(parts);
    } else {
      // Relative path
      const parts = [...this.currentPath, ...path.split('/').filter(Boolean)];
      targetDir = this.getDirectoryFromPath(parts);
    }
    
    return Object.values(targetDir.children);
  }
  
  private getDirectoryFromPath(pathParts: string[]): IDirectory {
    let current = this.rootFs;
    
    for (const part of pathParts) {
      if (part === '.' || part === '') continue;
      if (part === '..') {
        pathParts.splice(pathParts.indexOf(part) - 1, 2);
        continue;
      }
      
      const child = current.children[part];
      if (!child || child.type !== 'directory') {
        throw new Error(`Directory not found: /${pathParts.join('/')}`);
      }
      current = child as IDirectory;
    }
    
    return current;
  }
  
  public createDirectory(name: string): boolean {
    const current = this.getCurrentDirectory();
    
    if (current.children[name]) {
      return false; // Already exists
    }
    
    const now = new Date();
    current.children[name] = {
      name,
      type: 'directory',
      createdAt: now,
      updatedAt: now,
      permissions: this.defaultPermissions,
      owner: this.defaultOwner,
      children: {}
    };
    
    return true;
  }
  
  public createFile(name: string, content: string = ''): boolean {
    const current = this.getCurrentDirectory();
    
    if (current.children[name]) {
      // If it's a file, update it
      if (current.children[name].type === 'file') {
        const file = current.children[name] as IFile;
        file.content = content;
        file.updatedAt = new Date();
        file.size = content.length;
        return true;
      }
      return false; // It's a directory
    }
    
    const now = new Date();
    current.children[name] = {
      name,
      type: 'file',
      content,
      createdAt: now,
      updatedAt: now,
      permissions: 'rw-r--r--',
      owner: this.defaultOwner,
      size: content.length
    };
    
    return true;
  }
  
  public getFile(path: string): IFile | null {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    
    if (!fileName) return null;
    
    let dirPath: string[];
    
    if (path.startsWith('/')) {
      dirPath = parts;
    } else {
      dirPath = [...this.currentPath, ...parts];
    }
    
    try {
      const dir = this.getDirectoryFromPath(dirPath);
      const file = dir.children[fileName];
      
      if (!file || file.type !== 'file') {
        return null;
      }
      
      return file as IFile;
    } catch (error) {
      return null;
    }
  }
  
  public removeEntry(name: string, recursive: boolean = false): boolean {
    const current = this.getCurrentDirectory();
    
    if (!current.children[name]) {
      return false; // Doesn't exist
    }
    
    const entry = current.children[name];
    
    if (entry.type === 'directory' && !recursive) {
      const dir = entry as IDirectory;
      if (Object.keys(dir.children).length > 0) {
        return false; // Directory not empty and not recursive
      }
    }
    
    delete current.children[name];
    return true;
  }
  
  public getFileSystem(): IDirectory {
    return this.rootFs;
  }
  
  public loadFileSystem(serializedFs: string): void {
    try {
      this.rootFs = JSON.parse(serializedFs);
      this.currentPath = []; // Reset to root
    } catch (error) {
      console.error('Failed to load file system:', error);
    }
  }
  
  public serializeFileSystem(): string {
    return JSON.stringify(this.rootFs);
  }
  
  public resetFileSystem(): void {
    this.rootFs = this.createInitialFileSystem();
    this.currentPath = [];
  }
}

export default new FileSystemService();