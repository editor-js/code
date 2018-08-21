![](https://badgen.net/badge/CodeX%20Editor/v2.0/blue)

# Code Tool for CodeX Editor

Code Tool for the [CodeX Editor](https://ifmo.su/editor) allows to include code examples in your articles.

![](https://capella.pics/77cc593f-0384-4df2-b9d1-d9c7d6d96b7d.jpg/cover/eff2f5)

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev codex.editor.code
```

Include module at your application

```javascript
const CodeTool = require('codex.editor.code');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/codex.editor.code).

`https://cdn.jsdelivr.net/npm/codex.editor.code@2.0.0`

Require this script on a page with CodeX Editor.

```html
<script src="..."></script>
```

## Usage

Add a new Tool to the `tools` property of the CodeX Editor initial config.

```javascript
var editor = CodexEditor({
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

