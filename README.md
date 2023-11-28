![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Code Tool for Editor.js

Code Tool for the [Editor.js](https://ifmo.su/editor) allows to include code examples in your articles.

![](assets/68747470733a2f2f636170656c6c612e706963732f38646630323266352d623464352d346433302d613532372d3261306566623633663239312e6a7067.jpeg)

## Installation

Get the package

```shell
yarn add @editorjs/code
```

Include module at your application

```javascript
import CodeTool from '@editorjs/code';
```

Optionally, you can load this tool from CDN [JsDelivr CDN](https://cdn.jsdelivr.net/npm/@editorjs/code@latest)

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    code: CodeTool,
  }

  ...
});
```

## Config Params

| Field       | Type     | Description                    |
| ----------- | -------- | -------------------------------|
| placeholder | `string` | Code Tool's placeholder string |

## Output data

This Tool returns code.

```json
{
    "type" : "code",
    "data" : {
        "code": "body {\n font-size: 14px;\n line-height: 16px;\n}",
    }
}
```

