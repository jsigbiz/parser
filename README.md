# parser
a JavaScript module for parsing [jsig](https://github.com/jsigbiz/spec)

## install
```console
$ npm install jsig
```

## example

``` js
var parse = require('jsig')
var ast = parse('reduce: (array: Array, (accumulated: Any, elem: Any) => Any, seed: Any) => Any')
console.log(ast, null, 2)
{
  "type": "program",
  "statements": [
    {
      "type": "assignment",
      "identifier": "reduce",
      "typeExpression": {
        "type": "function",
        "args": [
          {
            "type": "typeLiteral",
            "name": "Array",
            "builtin": true,
            "label": "array",
            "optional": false
          },
          {
            "type": "function",
            "args": [
              {
                "type": "typeLiteral",
                "name": "Any",
                "builtin": true,
                "label": "accumulated",
                "optional": false
              },
              {
                "type": "typeLiteral",
                "name": "Any",
                "builtin": true,
                "label": "elem",
                "optional": false
              }
            ],
            "result": {
              "type": "typeLiteral",
              "name": "Any",
              "builtin": true,
              "label": null,
              "optional": false
            },
            "thisArg": null,
            "label": null,
            "optional": false
          },
          {
            "type": "typeLiteral",
            "name": "Any",
            "builtin": true,
            "label": "seed",
            "optional": false
          }
        ],
        "result": {
          "type": "typeLiteral",
          "name": "Any",
          "builtin": true,
          "label": null,
          "optional": false
        },
        "thisArg": null,
        "label": null,
        "optional": false
      }
    }
  ]
}
```

## license
see LICENSE
