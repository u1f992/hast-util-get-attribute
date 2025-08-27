import type * as hast from "hast";
import { find, html } from "property-information";

export function getAttribute(
  element: Readonly<hast.Element>,
  qualifiedName: string,
): string | null {
  const { property: propertyName, commaSeparated } = find(html, qualifiedName);
  const props = (element.properties ?? {}) as NonNullable<
    hast.Element["properties"]
  >;
  const vRaw = props[qualifiedName];
  const vProp = props[propertyName];
  const v =
    vRaw === undefined && vProp === undefined
      ? undefined
      : vRaw === undefined
        ? vProp
        : vProp === undefined
          ? vRaw
          : (() => {
              const keys: string[] = [];
              for (const k in props) {
                keys.push(k);
              }
              const idxRaw = keys.indexOf(qualifiedName);
              const idxProp = keys.indexOf(propertyName);
              return props[
                idxProp !== -1 && idxRaw !== -1
                  ? idxProp <= idxRaw
                    ? propertyName
                    : qualifiedName
                  : propertyName
              ];
            })();

  if (v === false || v == null) return null;
  if (v === true) return "";
  if (Array.isArray(v))
    return v.map((x) => String(x)).join(commaSeparated ? ", " : " ");
  return String(v);
}

export function hasAttribute(
  element: Readonly<hast.Element>,
  qualifiedName: string,
): boolean {
  return getAttribute(element, qualifiedName) !== null;
}
