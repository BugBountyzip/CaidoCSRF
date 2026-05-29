import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUNDLE = path.join(ROOT, "dist", "frontend", "script.js");
const OUT_DIR = path.join(ROOT, "qa-output", "csrf-pocs");

class StubElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.parentNode = undefined;
    this.style = {};
    this.className = "";
    this.textContent = "";
    this.innerHTML = "";
    this.value = "";
    this.type = "";
    this.checked = false;
    this.onclick = undefined;
    this.classList = {
      toggle: (className, force) => {
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        if (force) {
          classes.add(className);
        } else {
          classes.delete(className);
        }
        this.className = Array.from(classes).join(" ");
      },
    };
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  addEventListener() {}

  remove() {
    if (!this.parentNode) {
      return;
    }

    this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = undefined;
  }

  replaceWith(replacement) {
    if (!this.parentNode) {
      return;
    }

    const index = this.parentNode.children.indexOf(this);
    if (index !== -1) {
      replacement.parentNode = this.parentNode;
      this.parentNode.children[index] = replacement;
      this.parentNode = undefined;
    }
  }
}

const documentStub = {
  head: new StubElement("head"),
  body: new StubElement("body"),
  createElement: (tagName) => new StubElement(tagName),
  createTextNode: (text) => {
    const node = new StubElement("#text");
    node.textContent = text;
    return node;
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};

globalThis.document = documentStub;
globalThis.window = { open: () => {} };
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { clipboard: { writeText: async () => {} } },
});

if (typeof globalThis.btoa !== "function") {
  globalThis.btoa = (value) => Buffer.from(value, "binary").toString("base64");
}

const samples = [
  {
    name: "get-query",
    isTls: true,
    expectedValues: {
      q: "nm",
      FORM: "ANAB01",
      source: "chrome.ob",
    },
    raw: [
      "GET /search?q=nm&cvid=72e4f8ef79f447468e25374928c1351f&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOdIBBzM3N2owajeoAgCwAgA&FORM=ANAB01&PC=U531&source=chrome.ob HTTP/1.1",
      "Host: www.bing.com",
      "User-Agent: Mozilla/5.0",
      "",
      "",
    ].join("\r\n"),
  },
  {
    name: "post-form",
    isTls: true,
    expectedValues: {
      email: "qa+csrf@example.test",
      csrf_mode: "standard",
      notify: "true",
    },
    raw: [
      "POST /account/email HTTP/1.1",
      "Host: app.example.test",
      "Content-Type: application/x-www-form-urlencoded",
      "",
      "email=qa%2Bcsrf%40example.test&csrf_mode=standard&notify=true",
    ].join("\r\n"),
  },
  {
    name: "post-json",
    isTls: true,
    expectedValues: {
      displayName: "QA User",
      newsletter: "true",
      settings: "{&quot;theme&quot;:&quot;dark&quot;,&quot;density&quot;:&quot;compact&quot;}",
    },
    raw: [
      "POST /api/profile HTTP/1.1",
      "Host: api.example.test",
      "Content-Type: application/json",
      "",
      '{"displayName":"QA User","newsletter":true,"settings":{"theme":"dark","density":"compact"}}',
    ].join("\r\n"),
  },
  {
    name: "put-form-with-query",
    isTls: true,
    expectedValues: {
      role: "reviewer",
      active: "true",
    },
    raw: [
      "PUT /api/users/42?audit=true HTTP/1.1",
      "Host: admin.example.test",
      "Content-Type: application/x-www-form-urlencoded",
      "",
      "role=reviewer&active=true",
    ].join("\r\n"),
  },
  {
    name: "post-multipart",
    isTls: true,
    expectedValues: {
      title: "Quarterly report",
      visibility: "private",
    },
    raw: [
      "POST /upload HTTP/1.1",
      "Host: files.example.test",
      "Content-Type: multipart/form-data; boundary=----QaBoundary",
      "",
      "------QaBoundary",
      'Content-Disposition: form-data; name="title"',
      "",
      "Quarterly report",
      "------QaBoundary",
      'Content-Disposition: form-data; name="visibility"',
      "",
      "private",
      "------QaBoundary--",
    ].join("\r\n"),
  },
  {
    name: "post-text-plain",
    isTls: false,
    expectedValues: {
      action: "update",
      enabled: "true",
    },
    raw: [
      "POST /settings HTTP/1.1",
      "Host: local.example.test:8080",
      "Content-Type: text/plain",
      "",
      "action=update",
      "enabled=true",
    ].join("\r\n"),
  },
];

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function requestLine(raw) {
  return raw.split(/\r?\n/)[0] ?? "";
}

function methodFromRaw(raw) {
  return requestLine(raw).split(/\s+/)[0] ?? "GET";
}

function targetFromRaw(raw) {
  return requestLine(raw).match(/^\S+\s+(\S+)\s+HTTP/i)?.[1] ?? "/";
}

function hostFromRaw(raw) {
  return raw.match(/^Host:\s*([^\r\n]+)/im)?.[1]?.trim() ?? "";
}

function requestContextFromRaw(raw, isTls) {
  const hostHeader = hostFromRaw(raw);
  const [host, portText] = hostHeader.split(":");
  const target = targetFromRaw(raw);
  const queryIndex = target.indexOf("?");
  return {
    type: "RequestContext",
    request: {
      host,
      port: portText ? Number(portText) : (isTls ? 443 : 80),
      path: queryIndex === -1 ? target : target.slice(0, queryIndex),
      query: queryIndex === -1 ? "" : target.slice(queryIndex + 1),
      isTls,
      raw,
    },
    selection: "",
  };
}

function walk(element, predicate, results = []) {
  if (predicate(element)) {
    results.push(element);
  }
  for (const child of element.children ?? []) {
    walk(child, predicate, results);
  }
  return results;
}

function findByClass(root, className) {
  return walk(root, (element) => element.className.split(/\s+/).includes(className));
}

function extractInputs(html) {
  const values = new Map();
  const inputRe = /<input[^>]+type="hidden"[^>]+>/gi;
  const attrRe = /\s(name|value)="([^"]*)"/gi;
  for (const input of html.match(inputRe) ?? []) {
    const attrs = {};
    for (const [, key, value] of input.matchAll(attrRe)) {
      attrs[key] = value;
    }
    if (attrs.name !== undefined) {
      values.set(attrs.name, attrs.value ?? "");
    }
  }
  return values;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

if (!fs.existsSync(BUNDLE)) {
  throw new Error("Build the plugin first: node scripts/clean.js && corepack pnpm@9.15.9 -r build && node scripts/pack.js");
}

const { init } = await import(pathToFileURL(BUNDLE).href);
const registeredCommands = new Map();

await init({
  commands: {
    register: (id, command) => registeredCommands.set(id, command),
  },
  menu: {
    registerItem: () => {},
  },
  window: {
    showToast: () => {},
  },
  graphql: {
    request: async () => ({ request: undefined }),
  },
});

const command = registeredCommands.get("generate-csrf-poc");
assert(command, "generate-csrf-poc command was not registered");

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const summary = [];

for (const sample of samples) {
  documentStub.body.children = [];
  await command.run(requestContextFromRaw(sample.raw, sample.isTls));

  const buttons = findByClass(documentStub.body, "csrf-technique");
  assert(buttons.length === 10, `${sample.name}: expected 10 technique buttons, got ${buttons.length}`);

  const sampleDir = path.join(OUT_DIR, sample.name);
  fs.mkdirSync(sampleDir, { recursive: true });

  const generated = [];
  const params = {};

  for (const button of buttons) {
    button.onclick();
    const editor = findByClass(documentStub.body, "csrf-code-editor").at(-1);
    const targetLine = findByClass(documentStub.body, "csrf-target-line").at(-1);
    assert(editor?.value, `${sample.name}/${button.textContent}: no generated PoC`);
    assert(!editor.value.includes("undefined"), `${sample.name}/${button.textContent}: PoC contains undefined`);

    if (button.textContent === "Standard HTML Form") {
      const hiddenInputs = extractInputs(editor.value);
      for (const [name, value] of Object.entries(sample.expectedValues)) {
        assert(hiddenInputs.get(name) === value, `${sample.name}: expected ${name}=${value}, got ${hiddenInputs.get(name)}`);
        params[name] = value;
      }
      if (methodFromRaw(sample.raw).toUpperCase() === "GET") {
        assert(!targetLine.textContent.includes("?"), `${sample.name}: GET target URL should not duplicate query params`);
      }
    }

    const extension = button.textContent === "SVG-based CSRF" ? "svg" : "html";
    const filename = `${slug(button.textContent)}.${extension}`;
    fs.writeFileSync(path.join(sampleDir, filename), editor.value);
    generated.push(filename);
  }

  summary.push({
    sample: sample.name,
    method: methodFromRaw(sample.raw),
    targetUrl: findByClass(documentStub.body, "csrf-target-line").at(-1)?.textContent.replace(/^Target URL:\s*/, ""),
    params,
    generated,
  });
}

fs.writeFileSync(path.join(OUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));

console.log(`Generated ${summary.reduce((count, item) => count + item.generated.length, 0)} PoCs`);
console.log(OUT_DIR);
