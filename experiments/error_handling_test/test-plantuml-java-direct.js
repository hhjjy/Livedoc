const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== 直接用 Java 調用 PlantUML.jar 測試 ===\n');

const testDir = path.join(__dirname, 'test-files');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// 找到 node-plantuml 裡的 plantuml.jar
const plantumlJar = path.join(__dirname, 'node_modules', 'node-plantuml', 'vendor', 'plantuml.jar');

console.log('PlantUML JAR 位置:', plantumlJar);
console.log('JAR 是否存在:', fs.existsSync(plantumlJar));
console.log('');

// Test 1: Valid PlantUML
console.log('Test 1: 正確的 PlantUML (用 -failfast2)');
const validUML = `@startuml
Alice -> Bob: Hello
Bob -> Alice: Hi
@enduml`;

const validFile = path.join(testDir, 'valid.puml');
fs.writeFileSync(validFile, validUML);

const test1 = spawn('java', [
  '-jar', plantumlJar,
  '-failfast2',  // 關鍵參數！
  '-tpng',
  '-pipe'
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

test1.stdin.write(validUML);
test1.stdin.end();

let validStdout = [];
let validStderr = [];

test1.stdout.on('data', (data) => {
  validStdout.push(data);
});

test1.stderr.on('data', (data) => {
  validStderr.push(data);
});

test1.on('close', (code) => {
  console.log('   Exit code:', code);
  console.log('   Stdout size:', Buffer.concat(validStdout).length, 'bytes');
  console.log('   Stderr size:', Buffer.concat(validStderr).length, 'bytes');
  if (validStderr.length > 0) {
    console.log('   Stderr:', Buffer.concat(validStderr).toString());
  }
  console.log('');

  // Test 2: Invalid PlantUML
  console.log('Test 2: 錯誤的 PlantUML (用 -failfast2)');
  const invalidUML = `@startuml
Alice -> Bob: Hello
COMPLETELY WRONG SYNTAX!!!
Random text
@enduml`;

  const test2 = spawn('java', [
    '-jar', plantumlJar,
    '-failfast2',  // 先檢查，有錯誤不生成圖
    '-tpng',
    '-pipe'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  test2.stdin.write(invalidUML);
  test2.stdin.end();

  let invalidStdout = [];
  let invalidStderr = [];

  test2.stdout.on('data', (data) => {
    invalidStdout.push(data);
  });

  test2.stderr.on('data', (data) => {
    invalidStderr.push(data);
  });

  test2.on('close', (code) => {
    console.log('   Exit code:', code);
    console.log('   Stdout size:', Buffer.concat(invalidStdout).length, 'bytes');
    console.log('   Stderr size:', Buffer.concat(invalidStderr).length, 'bytes');
    if (invalidStderr.length > 0) {
      console.log('   Stderr:', Buffer.concat(invalidStderr).toString());
    }
    console.log('');

    // Conclusion
    console.log('=== 結論 ===');
    if (code !== 0) {
      console.log('✅ SUCCESS: 可以透過 exit code 檢測錯誤！');
      console.log('');
      console.log('實作方式：');
      console.log('1. 使用 -failfast2 參數');
      console.log('2. 檢查 child process 的 exit code');
      console.log('3. Exit code !== 0 → 返回自訂錯誤圖');
      console.log('4. Exit code === 0 → 返回生成的圖片');
      console.log('');
      console.log('優點：');
      console.log('- 不會生成錯誤圖片');
      console.log('- stderr 可能包含詳細錯誤訊息');
      console.log('- 可以完全控制錯誤處理');
    } else {
      console.log('⚠️  測試失敗，需要其他方案');
    }
  });
});
