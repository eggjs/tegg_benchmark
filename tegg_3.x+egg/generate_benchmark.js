const fs = require('fs');
const path = require('path');
const os = require('os');

const pwd = __dirname;
const moduleDir = path.join(pwd, 'app/module');
const controllerDir = path.join(pwd, 'app/controller');

function writeFile(index) {
  const fileName = `FooService${index}.ts`;
  const file = `import { AccessLevel, SingletonProto } from '@eggjs/tegg';

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC,
})
export class FooService${index} {
  hello() {
    /// ...
  }
}
`;
  fs.writeFileSync(path.join(moduleDir, fileName), file);
}

for (let i = 0; i < 10000; i++) {
  writeFile(i);
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
writeRouter([1, 10, 100, 1000, 10000]);

function generateController(count) {
  const template =
    `const { Controller } = require('egg');
  const { BarService${count} } = require('../module/BarService${count}')

module.exports = class EggController1 extends Controller {
  async hello() {
    if (this.ctx.query.touch) {
      await this.app.module.fooService.barService${count}.hello(true);
    } else {
      await this.app.module.fooService.barService${count}.hello(false);
    }
    this.ctx.body = 'hello,egg${count}';
  }
};
`;
  fs.writeFileSync(path.join(controllerDir, `egg_controller_${count}.js`), template);
}

generateController(1);
generateController(10);
generateController(100);
generateController(1000);
generateController(10000);

function generateBarService(count) {
  const importString = [];
  for (let i = 0; i < count; i++) {
    importString.push(`import { FooService${i} } from './FooService${i}'`);
  }

  const injectString = [];
  for (let i = 0; i < count; i++) {
    injectString.push(`  @Inject() readonly fooService${i}: FooService${i};`);
  }

  const touchPropertyString = [];

  const callServiceFunction = [];
  const callServiceLimit = 100;
  const callServiceFunctionCount = Math.ceil(count / callServiceLimit);
  for (let i = 0; i < callServiceFunctionCount; i++) {
    touchPropertyString.push(`    this._callService${i}()`)
  }
  let start = 0;
  let end = callServiceLimit;
  for (let i = 0; i < callServiceFunctionCount; i++) {
    const func = [];
    func.push(`  _callService${i}() {`);
    for (let j = start; j < Math.min(end, count); j++) {
      func.push(`    this.fooService${j}.hello()`);
    }
    func.push(`  }`);
    start += callServiceLimit;
    end += callServiceLimit;
    callServiceFunction.push(func.join(os.EOL));
  }

  const template =
`import { SingletonProto, Inject, AccessLevel } from '@eggjs/tegg';
${importString.join(os.EOL)}

@SingletonProto({
  accessLevel: AccessLevel.PUBLIC,
})
export default class BarService${count} {
${injectString.join(os.EOL)}

  async hello(touch: boolean) {
    if (touch) {
${touchPropertyString.join(os.EOL)}
    }
    return 'hello, tegg ${count}';
  }
${callServiceFunction.join(os.EOL)}
}
`
  fs.writeFileSync(path.join(moduleDir, `BarService${count}.ts`), template);
}

generateBarService(1);
generateBarService(10);
generateBarService(100);
generateBarService(1000);
generateBarService(10000);