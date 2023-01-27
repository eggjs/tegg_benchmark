const fs = require('fs');
const path = require('path');
const os = require('os');

const pwd = __dirname;
const moduleDir = path.join(pwd, 'app/service');
const controllerDir = path.join(pwd, 'app/controller');

function writeFile(index) {
  const fileName = `egg_service_${index}.js`;
  const file = `const { Service } = require('egg');

module.exports = class EggService${index} extends Service {
  hello() {
    // ...
  }
}
`;
  fs.writeFileSync(path.join(moduleDir, fileName), file);
}

function writeRouter(counts) {
  const routerString = [];
  for (let i = 0; i < counts.length; i++) {
    const count = counts[i];
    routerString.push(`  app.get('/hello${count}', controller.eggController_${count}.hello);`);
  }

  const template =
`module.exports = function (app) {
  const { controller } = app;
${routerString.join(os.EOL)}
};
`;
  fs.writeFileSync(path.join(pwd, 'app/router.js'), template);
}

for (let i = 0; i < 10000; i++) {
  writeFile(i);
}


function generateController(count) {
  const touchString = [];

  const callServiceFunction = [];
  const callServiceLimit = 100;
  const callServiceFunctionCount = Math.ceil(count / callServiceLimit);
  for (let i = 0; i < callServiceFunctionCount; i++) {
    touchString.push(`    this._callService${i}()`)
  }
  let start = 0;
  let end = callServiceLimit;
  for (let i = 0; i < callServiceFunctionCount; i++) {
    const func = [];
    func.push(`  _callService${i}() {`);
    for (let j = start; j < Math.min(end, count); j++) {
      func.push(`    this.ctx.service.eggService_${i}.hello();`);
    }
    func.push(`  }`);
    start += callServiceLimit;
    end += callServiceLimit;
    callServiceFunction.push(func.join(os.EOL));
  }

  const template =
    `const { Controller } = require('egg');

module.exports = class EggController1 extends Controller {
  async hello() {
  if (this.ctx.query.touch) {
${touchString.join(os.EOL)}
  }
    this.ctx.body = 'hello,egg${count}';
  }
${callServiceFunction.join(os.EOL)}
}
`;
  fs.writeFileSync(path.join(controllerDir, `egg_controller_${count}.js`), template);
}

generateController(1);
generateController(10);
generateController(100);
generateController(1000);
generateController(10000);
writeRouter([1, 10, 100, 1000, 10000]);
