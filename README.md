# hast-util-get-attribute

`getAttribute` and `hasAttribute` for [hast](https://github.com/syntax-tree/hast) `Element` type.

In hast, the values of the `properties` record may be, in addition to the intuitively reasonable `string`, `boolean`, `number`, and `(string | number)[]`, also `null` and `undefined` ([v2](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/hast/v2/index.d.ts)/[v3](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/hast/index.d.ts)). This is convenient when constructing a tree, but things get a bit complicated when you want to check for presence or obtain a string in a type-safe way.

Below are the results observed from the input/output of [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html). You can see that simply relying on truthy/falsy or using `String` does not yield correct results.

| `properties: `         | `toHtml(node)`             |
| ---------------------- | -------------------------- |
| `undefined` (v2)       | `<div></div>`              |
| `{}`                   | `<div></div>`              |
| `{ foo: true }`        | `<div foo></div>`          |
| `{ foo: false }`       | `<div></div>`              |
| `{ foo: 42 }`          | `<div foo="42"></div>`     |
| `{ foo: 0 }`           | `<div foo="0"></div>`      |
| `{ foo: "bar" }`       | `<div foo="bar"></div>`    |
| `{ foo: "" }`          | `<div foo=""></div>`       |
| `{ foo: [42, "bar"] }` | `<div foo="42 bar"></div>` |
| `{ foo: [] }`          | `<div foo=""></div>`       |
| `{ foo: null }`        | `<div></div>`              |
| `{ foo: undefined }`   | `<div></div>`              |
