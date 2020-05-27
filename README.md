# demo-decorator

Conditionally replaces a class at runtime with another one. No dependencies.

## Use cases

* An enduser wants to access your mobile app/web app without creating an account or any access to the backend at all (demo mode playground)
* A developer wants to create a mobile app/web app prototype without real API/storage access (prototyping)
* A developer wants to create and configure different scenarios for UI testing (mocking)

## Installation

Install using npm:

```sh
npm install --save demo-decorator
```

Install using yarn:

```sh
yarn add demo-decorator
```

## Configuration

If you want to use decorators add the following to your tsconfig.json

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```

If you also use React Native you have to adjust your babel.config.js and install the plugins

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};
```

## Usage

```ts
function Demo(demoInstance: Object, isDemoEnabled: () => boolean)
```

The first parameter is the instance/object whose methods are called in case the demo mode is active.

The second parameter is a function that is called before each method call the determine if the demo mode is active or not.

If demo mode is active and a method from the original class is not specified in the demo instance then the original method is called.

### Example with decorator

Demo mode state is stored in a variable but you are free to use any other method (e.g call a custom function) to determine the state at runtime.

```ts
import Demo from 'demo-decorator';

let active = true;

class SampleApiMock {
    add(a: number, b: number): number {
        return 42;
    }
    doSomething(): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("Hello Demo!")
            }, 1500);
        })
    }
}

@Demo(new SampleApiMock(), () => active)
class SampleApi {
    add(a: number, b: number): number {
        return a + b;
    }
    doSomething(): Promise<string> {
        return Promise.resolve("Hello World!");
    }
    theone(): string {
        return "the one and only";
    }
}

(async () => {
    const sampleApi = new SampleApi();

    console.log('add', sampleApi.add(2, 3)); // add 42
    console.log('doSomething', await sampleApi.doSomething()); // doSomething Hello Demo!
    console.log('theone', sampleApi.theone()); // theone the one and only

    active = false;

    console.log('add', sampleApi.add(2, 3)); // add 5
    console.log('doSomething', await sampleApi.doSomething()); // doSomething Hello World!
    console.log('theone', sampleApi.theone()); // theone the one and only
  })();
```

### Example without decorator

```ts
// ...

// @Demo(new SampleApiMock(), () => active)
class SampleApiCls {
    add(a: number, b: number): number {
        return a + b;
    }
    doSomething(): Promise<string> {
        return Promise.resolve("Hello World!");
    }
    theone(): string {
        return "the one and only";
    }
}

const SampleApi = Demo(new SampleApiMock(), () => active)(SampleApiCls);
const sampleApi = new SampleApi();

// ...
```

See unit tests [`src/demo-decorator.spec.ts`](src/demo-decorator.spec.ts) for more examples.

## Caveats

If the second parameter is an async function then every method gets async too.

## Built With

* [Typescript](https://www.typescriptlang.org/) - TypeScript is a typed superset of JavaScript that compiles to plain JavaScript

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
