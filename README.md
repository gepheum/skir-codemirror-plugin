# skir-codemirror-plugin

This library provides a CodeMirror-based JSON editor for Skir values.
It helps users edit Skir request/response payloads in a human-readable JSON form while preserving schema-aware guidance and validation.

Demo: `npx skir-studio-demo`

## What It Provides

- A ready-to-use `createEditorState(...)` factory for CodeMirror.
- Schema-driven JSON template generation (when no JSON value is provided).
- JSON validation and lint diagnostics.
- In-editor hints and completions informed by the Skir type schema.
- Read-only mode support for response viewing.
- Built-in theme support:
	- `tokyo-night`
	- `tokyo-night-day`
	- custom theme object

## Install

```sh
npm install skir-codemirror-plugin
```

## Public API

The package root exports:

- `createEditorState`
- `CreateEditorStateParams` (type)
- `CustomTheme` (type)
- `Json` (type)

## Usage

```ts
import { EditorView } from "@codemirror/view";
import {
	createEditorState,
	type CreateEditorStateParams,
} from "skir-codemirror-plugin";

const params: CreateEditorStateParams = {
	schema: {
		type: { kind: "primitive", value: "string" },
		records: [],
	},
	// Optional:
	// readOnly: true,
	// json: "hello",
	// theme: "tokyo-night-day",
};

const state = createEditorState(params);

new EditorView({
	state,
	parent: document.getElementById("editor")!,
});
```

## createEditorState Parameters

```ts
{
	schema: TypeDefinition,
	readOnly?: true,
	json?: Json,
	theme?: "tokyo-night" | "tokyo-night-day" | CustomTheme,
}
```

Behavior:

- `schema` is required and drives validation/completion.
- If `json` is omitted, a JSON template is generated from the schema.
- `readOnly: true` enables non-editable mode.
- `theme` defaults to `tokyo-night`.

## Local Dev Flow

This repository includes a minimal local dev page for previewing the editor state produced by `createEditorState`.

### Run It

```sh
npm run dev
```

This does three things:

1. Builds TypeScript sources into `dist/`.
2. Builds the dev entry point from `dev/main.ts` into `dev-dist/main.js`.
3. Starts `web-dev-server` and opens `/dev/index.html`.

Dev URL:

```text
http://localhost:8080/dev/index.html
```

### Dev Files

- `dev/index.html`: minimal host page containing only `#editor` and module import.
- `dev/main.ts`: creates `EditorView` with `createEditorState(...)`.
- `dev-dist/main.js`: generated browser output from `dev/main.ts`.

To try your own schema/JSON inputs, edit `dev/main.ts` and change the `params` object.

### Auto Rebuild and Reload

`npm run dev` watches both:

- `src/**/*.ts` -> rebuilds the library into `dist/`
- `dev/**/*.ts` -> rebuilds the dev entry into `dev-dist/`

`web-dev-server --watch` reloads the page when served files change.

### Dev-Only Note

This flow is for local development only.

- Dev sources are in `dev/`.
- Dev compiled output is in `dev-dist/`.
- Package distribution uses `dist/` as the runtime entrypoint.
