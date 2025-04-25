export function parseCommand(commandString: string): { 
  command: string;
  args: string[];
  options: Record<string, string>;
} {
  const parts = commandString.trim().split(/\s+/);
  const command = parts[0] || '';
  const args: string[] = [];
  const options: Record<string, string> = {};
  
  // Simple parser that doesn't handle quotes or complex cases yet
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    if (part.startsWith('-')) {
      // Handle options (both -a and --option formats)
      const isLongOption = part.startsWith('--');
      const optionName = isLongOption ? part.slice(2) : part.slice(1);
      
      // Check if the next part is a value for this option
      if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        options[optionName] = parts[i + 1];
        i++; // Skip the next part as it's the value
      } else {
        // Flag without value
        options[optionName] = 'true';
      }
    } else {
      // Regular argument
      args.push(part);
    }
  }
  
  return { command, args, options };
}