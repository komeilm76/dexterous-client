type AttrValue = string | number | boolean | undefined;

type Attributes = Record<string, AttrValue>;

type MetaTag = {
  name: "meta";
  attrs: {
    charset?: string;
    name?: string;
    content?: string;
    httpEquiv?: string;
    property?: string;
    [key: string]: AttrValue;
  };
};

type LinkTag = {
  name: "link";
  attrs: {
    rel: string;
    href: string;
    type?: string;
    sizes?: string;
    media?: string;
    crossorigin?: string;
    [key: string]: AttrValue;
  };
};

type TitleTag = {
  name: "title";
  content: string;
};

type ScriptTag = {
  name: "script";
  attrs?: {
    src?: string;
    type?: "module" | "text/javascript";
    async?: boolean;
    defer?: boolean;
    crossorigin?: string;
    nonce?: string;
    [key: string]: AttrValue;
  };
  content?: string;
};

type StyleTag = {
  name: "style";
  attrs?: {
    media?: string;
    nonce?: string;
    [key: string]: AttrValue;
  };
  content: string;
};

type HeadTag = MetaTag | LinkTag | TitleTag | ScriptTag | StyleTag;

const getDedupeKey = (tag: HeadTag): string | null => {
  if (tag.name === "meta") {
    const a = tag.attrs;
    if (!a) return null;

    if (a.charset) return "meta:charset";
    if (a.name) return `meta:name:${a.name}`;
    if (a.property) return `meta:property:${a.property}`;
    if (a.httpEquiv) return `meta:httpEquiv:${a.httpEquiv}`;
  }

  if (tag.name === "link") {
    const a = tag.attrs;
    if (!a) return null;
    return `link:${a.rel}:${a.href}`;
  }

  if (tag.name === "title") {
    return "title";
  }

  return null;
};

const dedupeHeadTags = (tags: HeadTag[]): HeadTag[] => {
  const map = new Map<string, HeadTag>();
  const result: HeadTag[] = [];

  for (const tag of tags) {
    const key = getDedupeKey(tag);

    if (!key) {
      result.push(tag);
      continue;
    }

    // last one wins
    map.set(key, tag);
  }

  // keep original order except replaced duplicates
  const usedKeys = new Set<string>();

  for (const tag of tags) {
    const key = getDedupeKey(tag);

    if (!key) continue;
    if (usedKeys.has(key)) continue;

    const finalTag = map.get(key);
    if (finalTag) {
      result.push(finalTag);
      usedKeys.add(key);
    }
  }

  return result;
};

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderAttrs = (attrs?: Attributes): string => {
  if (!attrs) return "";

  return Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== false)
    .map(([k, v]) =>
      v === true ? ` ${k}` : ` ${k}="${escapeHtml(String(v))}"`
    )
    .join("");
};

const renderHeadToString = (tags: HeadTag[]): string => {
  const deduped = dedupeHeadTags(tags);

  return deduped
    .map((tag) => {
      switch (tag.name) {
        case "meta":
        case "link":
          return `<${tag.name}${renderAttrs(tag.attrs)} />`;

        case "title":
          return `<title>${escapeHtml(tag.content)}</title>`;

        case "script":
          return `<script${renderAttrs(tag.attrs)}>${
            tag.content ?? ""
          }</script>`;

        case "style":
          return `<style${renderAttrs(tag.attrs)}>${tag.content}</style>`;
      }
    })
    .join("\n");
};

const makeHead = (config: HeadTag[]) => {
  return config;
};

export default { renderHeadToString, makeHead };
