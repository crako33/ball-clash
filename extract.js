const fs = require('fs');
const readline = require('readline');

const logFile = 'C:\\Users\\Kent\\.gemini\\antigravity\\brain\\4ff69bd6-3c96-45d1-aa0f-0de73df1efa3\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logFile),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const step = JSON.parse(line);
    const content = step.content || '';
    
    // Check if the model or tool output contains large chunks of Wrecker code
    if (content.includes('const drawWreckerBall') || content.includes('const updateWrecker')) {
      console.log('--- STEP INDEX:', step.step_index, 'TYPE:', step.type, '---');
      console.log(content.substring(0, 1000));
      console.log('=====================================\n');
    }

    // Check inside tool calls args as well
    if (step.tool_calls) {
      step.tool_calls.forEach(call => {
        const argsStr = JSON.stringify(call.args);
        if (argsStr.includes('drawWreckerBall') || argsStr.includes('updateWrecker')) {
          console.log('--- TOOL CALL STEP INDEX:', step.step_index, 'TOOL:', call.name, '---');
          // If write_to_file or replace_file_content contains code, print it
          if (call.args.ReplacementContent) {
            console.log('REPLACEMENT CONTENT:');
            console.log(call.args.ReplacementContent.substring(0, 1500));
          } else if (call.args.CodeContent) {
            console.log('CODE CONTENT:');
            console.log(call.args.CodeContent.substring(0, 1500));
          } else {
            console.log('ARGS:', argsStr.substring(0, 800));
          }
          console.log('=====================================\n');
        }
      });
    }
  } catch (err) {
    // Ignore invalid JSON lines
  }
});
