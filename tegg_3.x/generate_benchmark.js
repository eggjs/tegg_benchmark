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
  async hello() {
    /// ...
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
  for (let i = 0; i < count; i++) {
    touchPropertyString.push(`    this.fooService${i}.hello()`)
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
}
`
  fs.writeFileSync(path.join(controllerDir, `FooTeggController${count}.ts`), template);
}

generateController(1);
generateController(10);
generateController(100);
generateController(1000);
generateController(10000);
