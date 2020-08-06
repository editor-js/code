![](https://badgen.net/badge/@Editorjs-code/v2.0/blue) [![](https://data.jsdelivr.com/v1/package/npm/@itech-indrustries/code/badge)](https://www.jsdelivr.com/package/npm/@itech-indrustries/code)

# Code Tool for Editor.js

Code Tool for the [Editor.js](https://ifmo.su/editor) allows to include code examples in your articles.

![Screenshot from 2020-08-07 00-59-31](https://user-images.githubusercontent.com/55910733/89574223-6cee7300-d849-11ea-8ff5-a49154911e3e.png)

## Installation

### Install via NPM

Get the package

```shell
npm i @itech-indrustries/code
```

Include module at your application

```javascript
const CodeTool = require('@itech-indrustries/code');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@itech-indrustries/code).

`https://cdn.jsdelivr.net/npm/@editorjs/code@3.0.0`

Require this script on a page with Editor.js.

```html
<script src="https://cdn.jsdelivr.net/npm/@itech-indrustries/code@latest"></script>
```

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

