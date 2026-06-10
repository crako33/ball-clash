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
    
    if (step.tool_calls) {
      step.tool_calls.forEach(call => {
        const argStr = JSON.stringify(call.args);
        if (argStr.includes('drawWreckerBall') || argStr.includes('updateWrecker')) {
          console.log(`Step ${step.step_index}: Tool: ${call.name}, Length: ${argStr.length}`);
        }
      });
    }
    
    // Check if the step has raw content (e.g. view_file outputs)
    if (content.includes('drawWreckerBall') || content.includes('updateWrecker')) {
      console.log(`Step ${step.step_index}: Content, Length: ${content.length}`);
    }
  } catch (err) {
  }
});
