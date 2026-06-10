const fs = require('fs');
const readline = require('readline');

const logFile = 'C:\\Users\\Kent\\.gemini\\antigravity\\brain\\4ff69bd6-3c96-45d1-aa0f-0de73df1efa3\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logFile),
  output: process.stdout,
  terminal: false
});

let out = '';

rl.on('line', (line) => {
  try {
    const step = JSON.parse(line);
    const indices = [8070, 8077, 8207, 8916];
    if (indices.includes(step.step_index)) {
      out += `--- STEP INDEX: ${step.step_index} ---\n`;
      out += JSON.stringify(step, null, 2) + '\n\n';
    }
  } catch (err) {}
});

rl.on('close', () => {
  fs.writeFileSync('output_steps.txt', out, 'utf-8');
  console.log('Saved output_steps.txt');
});
