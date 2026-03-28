# Dev Flow

This repository includes a minimal local dev page for previewing a CodeMirror editor created with `createEditorState`.

## Run it

```sh
npm run dev
```

This does three things:

1. Builds the TypeScript sources into `dist/`.
2. Builds the dev entry point from `dev/main.ts` into `dev-dist/main.js`.
3. Starts `web-dev-server` and opens `/dev/index.html`.

The dev page is served at:

```text
http://localhost:8080/dev/index.html
```

## Files involved

- `dev/index.html`: minimal HTML page with only an `#editor` container and a module script.
- `dev/main.ts`: creates an `EditorView` using `createEditorState(...)`.
- `dev-dist/main.js`: generated output for the browser from `dev/main.ts`.

## Set your own params

The dev entry point intentionally uses a placeholder params object.

Edit `dev/main.ts` and replace:

```ts
const params = {
  schema: {
    type: { kind: "primitive", value: "string" },
    records: [],
  },
};
```

with whatever you want to pass to `createEditorState(params)`.

## Automatic rebuild and reload

`npm run dev` watches both:

- `src/**/*.ts`, rebuilding the library into `dist/`
- `dev/**/*.ts`, rebuilding the dev entry into `dev-dist/`

`web-dev-server --watch` then reloads the page when the served output changes, so edits to either the library TypeScript or the dev entry TypeScript are picked up automatically.

## Why this is dev-only

This flow is not intended for distribution.

- The dev files live under `dev/`, not `src/`.
- The TypeScript build only compiles `src/**/*.ts` into `dist/`.
- The local preview uses the built module from `dist/codemirror/create_editor_state.js`, while the dev entry itself is compiled into `dev-dist/`. Neither `dev/` nor `dev-dist/` is part of the package build output.
- The package `files` list in `package.json` only publishes `dist/skir-studio-standalone.js`, `src/`, and `README.md`.

## Minimal HTML

The dev page is intentionally minimal. If you need more controls for debugging, add them to `dev/index.html` or `dev/main.ts` without affecting the distributable package.
