# vue-composite-loader
> A webpack loader for transforming .vue files into .js Vue composable components. Vue-composite-loader works in tandem
with vue-loader to allow you to easily share your Vue components across services with the vue-composite plugin.

## Installation
```bash
npm i --save-dev vue-composite-loader
```

## Getting Started
Vue-composite-loader is intended to be used in tandem with vue-loader, generating self-executing JS modules from .vue files. The JS modules can be requested by other Vue applications using the **vue-composite** plugin. 

1. Once installed, add vue-composite-loader to your webpack.config.js file:
```javscript
// Webpack > 2.0.x
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
          },
          {
            loader: 'vue-composite-loader',
            options: {
              path: path.resolve(__dirname, 'path/to/output/'),
            },
          },
        ],
      }
    ]
  }
},
```
2. Run webpack.
3. Compose your Vue applications by sharing links to the js modules with **vue-composite**.

## Example
#### Input
```html
<template>
  <div class="app">{{msg}}</div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        msg: 'Hello Vue!',
      };
    },
  };
</script>

<style>
.app {
  background-color: #eee;
}
</style>
```
#### Output
```javascript
(function() {
	return{
    name: 'app',
    data() {
      return {
        msg: 'Hello Vue!',
      };
    },
    template: `<div class="app">{{msg}}</div>`,
    _injectCss: `.app {
      background-color: #eee;
    }`,
};
})();
```

## Limitations
Currently, vue-composite-loader does not support any template or style pre-processors such as Jade or Sass.
These are planned enhancements.

## Development Setup

``` bash
npm install
npm lint
npm run test
```