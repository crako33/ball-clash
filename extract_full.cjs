const fs = require('fs');
const readline = require('readline');

const logFile = 'C:\\Users\\Kent\\.gemini\\antigravity\\brain\\4ff69bd6-3c96-45d1-aa0f-0de73df1efa3\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logFile),
  output: process.stdout,
  terminal: false
});

let drawWreckerFileContent = '';
let updateWreckerFileContent = '';

function cleanCode(str) {
  if (str.startsWith('"') && str.endsWith('"')) {
    try {
      str = JSON.parse(str);
    } catch(e) {}
  }
  // Replace escaped newlines and double quotes
  let cleaned = str.replace(/\\n/g, '\n')
                   .replace(/\\"/g, '"')
                   .replace(/\\'/g, "'")
                   .replace(/\\\\/g, '\\');
  return cleaned;
}

rl.on('line', (line) => {
  try {
    const step = JSON.parse(line);
    if (step.tool_calls) {
      step.tool_calls.forEach(call => {
        if (call.name === 'replace_file_content' || call.name === 'write_to_file') {
          const targetFile = call.args.TargetFile || '';
          if (targetFile.includes('App.jsx')) {
            const content = call.args.ReplacementContent || call.args.CodeContent || '';
            if (content.includes('const drawWreckerBall') && !content.includes('readline')) {
              drawWreckerFileContent = content;
            }
            if (content.includes('const updateWrecker') && !content.includes('readline')) {
              updateWreckerFileContent = content;
            }
          }
        }
      });
    }
  } catch (err) {
  }
});

rl.on('close', () => {
  if (drawWreckerFileContent) {
    fs.writeFileSync('drawWrecker.txt', cleanCode(drawWreckerFileContent));
    console.log('Saved drawWrecker.txt');
  }
  if (updateWreckerFileContent) {
    fs.writeFileSync('updateWrecker.txt', cleanCode(updateWreckerFileContent));
    console.log('Saved updateWrecker.txt');
  }
  console.log('Done extraction!');
});
