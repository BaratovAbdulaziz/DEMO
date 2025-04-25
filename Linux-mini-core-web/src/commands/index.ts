import { ICommand } from '../types';
import FileSystemService from '../services/FileSystemService';
import ProcessService from '../services/ProcessService';

const commands: Record<string, ICommand> = {
  ls: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [options] [directory]',
    execute: async (args, options) => {
      try {
        const path = args[0] || '.';
        const entries = FileSystemService.listDirectory(path);
        
        const showDetails = options.l === 'true';
        let output = '';
        
        if (showDetails) {
          entries.forEach(entry => {
            const date = entry.updatedAt.toLocaleString();
            if (entry.type === 'directory') {
              output += `drwxr-xr-x ${entry.owner} ${date} ${entry.name}/\n`;
            } else {
              output += `${entry.permissions} ${entry.owner} ${date} ${entry.name} (${entry.size} bytes)\n`;
            }
          });
        } else {
          const directoryNames = entries
            .filter(e => e.type === 'directory')
            .map(e => e.name + '/');
          
          const fileNames = entries
            .filter(e => e.type === 'file')
            .map(e => e.name);
          
          output = [...directoryNames, ...fileNames].join('  ');
        }
        
        return output || 'Directory is empty';
      } catch (error) {
        if (error instanceof Error) {
          return `ls: ${error.message}`;
        }
        return 'ls: An error occurred';
      }
    }
  },
  
  cd: {
    name: 'cd',
    description: 'Change the current directory',
    usage: 'cd [directory]',
    execute: async (args) => {
      const path = args[0] || '/home/user';
      
      const success = FileSystemService.changeDirectory(path);
      if (!success) {
        return `cd: ${path}: No such directory`;
      }
      
      return '';
    }
  },
  
  pwd: {
    name: 'pwd',
    description: 'Print name of current/working directory',
    usage: 'pwd',
    execute: async () => {
      return FileSystemService.getCurrentPath();
    }
  },
  
  mkdir: {
    name: 'mkdir',
    description: 'Create a directory',
    usage: 'mkdir [options] directory',
    execute: async (args) => {
      if (!args.length) {
        return 'mkdir: missing operand';
      }
      
      const dirName = args[0];
      const success = FileSystemService.createDirectory(dirName);
      
      if (!success) {
        return `mkdir: cannot create directory '${dirName}': File exists`;
      }
      
      return '';
    }
  },
  
  touch: {
    name: 'touch',
    description: 'Create an empty file',
    usage: 'touch file',
    execute: async (args) => {
      if (!args.length) {
        return 'touch: missing file operand';
      }
      
      const fileName = args[0];
      const success = FileSystemService.createFile(fileName, '');
      
      return '';
    }
  },
  
  cat: {
    name: 'cat',
    description: 'Concatenate files and print on the standard output',
    usage: 'cat [file]',
    execute: async (args) => {
      if (!args.length) {
        return 'cat: missing file operand';
      }
      
      const fileName = args[0];
      const file = FileSystemService.getFile(fileName);
      
      if (!file) {
        return `cat: ${fileName}: No such file`;
      }
      
      return file.content;
    }
  },
  
  rm: {
    name: 'rm',
    description: 'Remove files or directories',
    usage: 'rm [options] file',
    execute: async (args, options) => {
      if (!args.length) {
        return 'rm: missing operand';
      }
      
      const name = args[0];
      const recursive = options.r === 'true' || options.recursive === 'true';
      
      const success = FileSystemService.removeEntry(name, recursive);
      
      if (!success) {
        if (!recursive) {
          return `rm: cannot remove '${name}': Is a directory or not empty`;
        }
        return `rm: cannot remove '${name}': No such file or directory`;
      }
      
      return '';
    }
  },
  
  echo: {
    name: 'echo',
    description: 'Display a line of text',
    usage: 'echo [string]',
    execute: async (args) => {
      return args.join(' ');
    }
  },
  
  ps: {
    name: 'ps',
    description: 'Report process status',
    usage: 'ps [options]',
    execute: async (args, options) => {
      const processes = ProcessService.getAllProcesses();
      
      let output = 'PID\tSTATUS\tTIME\tCOMMAND\n';
      
      processes.forEach(proc => {
        const startTime = proc.startTime.toLocaleTimeString();
        output += `${proc.pid}\t${proc.status}\t${startTime}\t${proc.command}\n`;
      });
      
      return output;
    }
  },
  
  kill: {
    name: 'kill',
    description: 'Kill a process',
    usage: 'kill [pid]',
    execute: async (args) => {
      if (!args.length) {
        return 'kill: missing pid operand';
      }
      
      const pid = parseInt(args[0], 10);
      if (isNaN(pid)) {
        return 'kill: invalid pid';
      }
      
      const process = ProcessService.getProcessByPid(pid);
      if (!process) {
        return `kill: (${pid}) - No such process`;
      }
      
      // Don't allow killing system processes
      if (process.name.startsWith('system')) {
        return `kill: (${pid}) - Permission denied`;
      }
      
      const success = ProcessService.killProcess(process.id);
      
      return '';
    }
  },
  
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    usage: 'clear',
    execute: async () => {
      // The actual clearing is handled in the Terminal component
      return '__CLEAR__';
    }
  },
  
  help: {
    name: 'help',
    description: 'Display information about builtin commands',
    usage: 'help [command]',
    execute: async (args) => {
      if (args.length) {
        const commandName = args[0];
        const command = commands[commandName];
        
        if (!command) {
          return `help: no help topics match '${commandName}'`;
        }
        
        return `${command.name} - ${command.description}\n\nUsage: ${command.usage}`;
      }
      
      let output = 'Available commands:\n\n';
      
      Object.values(commands).forEach(cmd => {
        output += `${cmd.name.padEnd(10)} - ${cmd.description}\n`;
      });
      
      output += '\nType "help [command]" for more information about a specific command.';
      
      return output;
    }
  }
};

export default commands;