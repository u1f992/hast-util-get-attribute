import { hasAttribute, getAttribute } from "./index.js";

import type * as hast from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import assert from "node:assert";
import test from "node:test";

const DIV = {
  type: "element" as const,
  tagName: "div" as const,
  children: [] as hast.ElementContent[],
};

// FIXME: remove this test for hast@3
test("without properties (v2) => null", () => {
  const e = { ...DIV };
  assert.strictEqual(toHtml(e), "<div></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), false);
  assert.strictEqual(getAttribute(e, "foo"), null);
});

// FIXME: remove this test for hast@3
test("properties: undefined (v2) => null", () => {
  const e = { ...DIV, properties: undefined };
  assert.strictEqual(toHtml(e), "<div></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), false);
  assert.strictEqual(getAttribute(e, "foo"), null);
});

test('does not contain "foo" => null', () => {
  const e = { ...DIV, properties: {} };
  assert.strictEqual(toHtml(e), "<div></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), false);
  assert.strictEqual(getAttribute(e, "foo"), null);
});

test('true => ""', () => {
  const e = { ...DIV, properties: { foo: true } };
  assert.strictEqual(toHtml(e), "<div foo></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "");
});

test("false => null", () => {
  const e = { ...DIV, properties: { foo: false } };
  assert.strictEqual(toHtml(e), "<div></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), false);
  assert.strictEqual(getAttribute(e, "foo"), null);
});

test('42 => "42"', () => {
  const e = { ...DIV, properties: { foo: 42 } };
  assert.strictEqual(toHtml(e), '<div foo="42"></div>', "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "42");
});

test('0 => "0"', () => {
  const e = { ...DIV, properties: { foo: 0 } };
  assert.strictEqual(toHtml(e), '<div foo="0"></div>', "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "0");
});

test('"bar" => "bar"', () => {
  const e = { ...DIV, properties: { foo: "bar" } };
  assert.strictEqual(toHtml(e), '<div foo="bar"></div>', "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "bar");
});

test('"" => ""', () => {
  const e = { ...DIV, properties: { foo: "" } };
  assert.strictEqual(toHtml(e), '<div foo=""></div>', "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "");
});

test('[42, "bar"] => "42 bar"', () => {
  const e = { ...DIV, properties: { foo: [42, "bar"] } };
  assert.strictEqual(toHtml(e), '<div foo="42 bar"></div>', "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "42 bar");
});

test('[] => ""', () => {
  const e = { ...DIV, properties: { foo: [] } };
  assert.strictEqual(toHtml(e), '<div foo=""></div>', "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), true);
  assert.strictEqual(getAttribute(e, "foo"), "");
});

test("null => null", () => {
  const e = { ...DIV, properties: { foo: null } };
  assert.strictEqual(toHtml(e), "<div></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), false);
  assert.strictEqual(getAttribute(e, "foo"), null);
});

test("undefined => null", () => {
  const e = { ...DIV, properties: { foo: undefined } };
  assert.strictEqual(toHtml(e), "<div></div>", "prerequisite");
  assert.strictEqual(hasAttribute(e, "foo"), false);
  assert.strictEqual(getAttribute(e, "foo"), null);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deleteProperty(obj: any, key: PropertyKey) {
  delete obj[key];
  return obj;
}

test("prerequisites: all notations are converted to string with fromHtml", () => {
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml("<div foo></div>", { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { foo: "" },
      children: [],
    },
  );
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml("<div foo=42></div>", { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { foo: "42" },
      children: [],
    },
  );
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div foo=""></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { foo: "" },
      children: [],
    },
  );
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div foo="42 bar"></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { foo: "42 bar" },
      children: [],
    },
  );
});

test("class => className mapping", () => {
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div class="a"></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { className: ["a"] },
      children: [],
    },
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { className: "a" } }),
    '<div class="a"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { className: ["a"] } }),
    '<div class="a"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { className: "a b" } }),
    '<div class="a b"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { className: ["a", "b"] } }),
    '<div class="a b"></div>',
    "prerequisite",
  );

  assert.strictEqual(
    getAttribute({ ...DIV, properties: { className: "a" } }, "class"),
    "a",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { className: ["a"] } }, "class"),
    "a",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { className: "a b" } }, "class"),
    "a b",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { className: ["a", "b"] } }, "class"),
    "a b",
  );
});

test("comma-separated attribute such as accept", () => {
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div accept="a,b"></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { accept: ["a", "b"] },
      children: [],
    },
    "prerequisite",
  );
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div accept="a, b"></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { accept: ["a", "b"] },
      children: [],
    },
    "prerequisite",
  );
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div accept="a b"></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { accept: ["a b"] },
      children: [],
    },
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { accept: "a" } }),
    '<div accept="a"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { accept: ["a"] } }),
    '<div accept="a"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { accept: "a b" } }),
    '<div accept="a b"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { accept: ["a", "b"] } }),
    '<div accept="a, b"></div>',
    "prerequisite",
  );

  assert.strictEqual(
    getAttribute({ ...DIV, properties: { accept: "a" } }, "accept"),
    "a",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { accept: ["a"] } }, "accept"),
    "a",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { accept: "a b" } }, "accept"),
    "a b",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { accept: ["a", "b"] } }, "accept"),
    "a, b",
  );
});

test('toHtml also accept "data-foo"', () => {
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div data-foo="a b"></div>', { fragment: true }).children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      properties: { dataFoo: "a b" },
      children: [],
    },
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { dataFoo: "a b" } }),
    '<div data-foo="a b"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { "data-foo": "a b" } }),
    '<div data-foo="a b"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { dataFoo: "a", "data-foo": "b" } }),
    '<div data-foo="a" data-foo="b"></div>',
    "prerequisite",
  );
  assert.strictEqual(
    toHtml({ ...DIV, properties: { "data-foo": "b", dataFoo: "a" } }),
    '<div data-foo="b" data-foo="a"></div>',
    "prerequisite",
  );
  assert.deepStrictEqual(
    deleteProperty(
      fromHtml('<div data-foo="a" data-foo="b"></div>', { fragment: true })
        .children[0],
      "position",
    ),
    {
      type: "element",
      tagName: "div",
      // the “first-come-first-served” approach matches the original DOM API behavior.
      properties: { dataFoo: "a" },
      children: [],
    },
    "prerequisite",
  );

  assert.strictEqual(
    getAttribute({ ...DIV, properties: { dataFoo: "a" } }, "data-foo"),
    "a",
  );
  assert.strictEqual(
    getAttribute({ ...DIV, properties: { "data-foo": "a" } }, "data-foo"),
    "a",
  );
  assert.strictEqual(
    getAttribute(
      { ...DIV, properties: { dataFoo: "a", "data-foo": "b" } },
      "data-foo",
    ),
    "a",
  );
  assert.strictEqual(
    getAttribute(
      { ...DIV, properties: { "data-foo": "b", dataFoo: "a" } },
      "data-foo",
    ),
    "b",
  );
});
