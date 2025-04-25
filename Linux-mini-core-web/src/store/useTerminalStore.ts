import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ITerminalLine } from '../types';
import { parseCommand } from '../utils/parseCommand';
import commands from '../commands';
import FileSystemService from '../services/FileSystemService';

interface TerminalState {
  lines: ITerminalLine[];
  commandHistory: string[];
  historyIndex: number;
  currentInput: string;
  
  addLine: (content: string, type: 'input' | 'output' | 'error') => void;
  executeCommand: (commandString: string) => Promise<void>;
  clearTerminal: () => void;
  setCurrentInput: (input: string) => void;
  navigateHistory: (direction: 'up' | 'down') => void;
  resetTerminal: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: [
    {
      id: uuidv4(),
      content: 'Welcome to Mini Core Web! Type "help" for a list of commands.',
      type: 'output'
    }
  ],
  commandHistory: [],
  historyIndex: -1,
  currentInput: '',
  
  addLine: (content, type) => {
    set(state => ({
      lines: [...state.lines, { id: uuidv4(), content, type }]
    }));
  },
  
  executeCommand: async (commandString) => {
    if (!commandString.trim()) return;
    
    const { command, args, options } = parseCommand(commandString);
    
    // Add command to history
    set(state => {
      const newHistory = [
        commandString,
        ...state.commandHistory.filter(cmd => cmd !== commandString)
      ].slice(0, 50); // Keep only last 50 commands
      
      return {
        commandHistory: newHistory,
        historyIndex: -1
      };
    });
    
    // Add command to terminal
    get().addLine(`${FileSystemService.getCurrentPath()} $ ${commandString}`, 'input');
    
    // Handle built-in commands
    const cmdHandler = commands[command];
    
    if (!cmdHandler) {
      get().addLine(`${command}: command not found`, 'error');
      return;
    }
    
    try {
      const output = await cmdHandler.execute(args, options);
      
      if (output === '__CLEAR__') {
        get().clearTerminal();
      } else if (output) {
        get().addLine(output, 'output');
      }
    } catch (error) {
      if (error instanceof Error) {
        get().addLine(`${command}: ${error.message}`, 'error');
      } else {
        get().addLine(`${command}: An error occurred`, 'error');
      }
    }
  },
  
  clearTerminal: () => {
    set({ lines: [] });
  },
  
  setCurrentInput: (input) => {
    set({ currentInput: input });
  },
  
  navigateHistory: (direction) => {
    set(state => {
      const { commandHistory, historyIndex } = state;
      
      if (commandHistory.length === 0) return state;
      
      let newIndex = historyIndex;
      
      if (direction === 'up') {
        newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      } else {
        newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      }
      
      const newInput = newIndex >= 0 ? commandHistory[newIndex] : '';
      
      return {
        historyIndex: newIndex,
        currentInput: newInput
      };
    });
  },
  
  resetTerminal: () => {
    set({
      lines: [
        {
          id: uuidv4(),
          content: 'Welcome to Mini Core Web! Type "help" for a list of commands.',
          type: 'output'
        }
      ],
      commandHistory: [],
      historyIndex: -1,
      currentInput: ''
    });
  }
}));