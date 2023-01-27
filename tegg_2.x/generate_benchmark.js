const fs = require('fs');
const path = require('path');
const os = require('os');

const pwd = __dirname;
const moduleDir = path.join(pwd, 'app/module');
const controllerDir = path.join(pwd, 'app/controller');

function writeFile(index) {
  const fileName = `FooService${index}.ts`;
  const file = `import { AccessLevel, ContextProto } from '@eggjs/tegg';

@ContextProto({
  accessLevel: AccessLevel.PUBLIC,
})
export class FooService${index} {
  hello() {
    //...
  }
}
`;
  fs.writeFileSync(path.join(moduleDir, fileName), file);
}

for (let i = 0; i < 10000; i++) {
  writeFile(i);
}


function generateController(count) {
  const importString = [];
  for (let i = 0; i < count; i++) {
    importString.push(`import { FooService${i} } from '../module/FooService${i}'`);
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
`import { HTTPController, HTTPMethod, HTTPMethodEnum, Inject, HTTPQuery } from '@eggjs/tegg';
${importString.join(os.EOL)}

@HTTPController()
export default class FooTeggController${count} {
${injectString.join(os.EOL)}

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/hello${count}',
  })
  async hello(@HTTPQuery() touch: string) {
    if (touch) {
${touchPropertyString.join(os.EOL)}
    }
    return 'hello, tegg ${count}';
  }
${callServiceFunction.join(os.EOL)}
}
`
  fs.writeFileSync(path.join(controllerDir, `FooTeggController${count}.ts`), template);
}

generateController(1);
generateController(10);
generateController(100);
generateController(1000);
generateController(10000);
