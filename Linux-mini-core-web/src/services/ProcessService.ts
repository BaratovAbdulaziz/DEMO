import { IProcess } from '../types';
import { v4 as uuidv4 } from 'uuid';

class ProcessService {
  private processes: IProcess[] = [];
  private nextPid: number = 1;
  
  constructor() {
    // Start a system process
    this.startProcess('system', 'init', 'System initialization process');
  }
  
  public startProcess(name: string, command: string, output: string = ''): IProcess {
    const process: IProcess = {
      id: uuidv4(),
      name,
      command,
      pid: this.nextPid++,
      status: 'running',
      startTime: new Date(),
      output
    };
    
    this.processes.push(process);
    return process;
  }
  
  public getAllProcesses(): IProcess[] {
    return [...this.processes];
  }
  
  public getRunningProcesses(): IProcess[] {
    return this.processes.filter(p => p.status === 'running');
  }
  
  public getProcessById(id: string): IProcess | undefined {
    return this.processes.find(p => p.id === id);
  }
  
  public getProcessByPid(pid: number): IProcess | undefined {
    return this.processes.find(p => p.pid === pid);
  }
  
  public stopProcess(id: string): boolean {
    const process = this.getProcessById(id);
    if (!process) return false;
    
    process.status = 'stopped';
    return true;
  }
  
  public killProcess(id: string): boolean {
    const index = this.processes.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    const process = this.processes[index];
    process.status = 'finished';
    process.endTime = new Date();
    
    // Only system processes stay in the list
    if (!process.name.startsWith('system')) {
      this.processes.splice(index, 1);
    }
    
    return true;
  }
  
  public updateProcessOutput(id: string, output: string): boolean {
    const process = this.getProcessById(id);
    if (!process) return false;
    
    process.output = process.output ? process.output + '\n' + output : output;
    return true;
  }
  
  public clearProcesses(): void {
    // Keep only system processes
    this.processes = this.processes.filter(p => p.name.startsWith('system'));
  }
}

export default new ProcessService();