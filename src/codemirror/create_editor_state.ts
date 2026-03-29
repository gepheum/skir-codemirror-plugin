import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { json as jsonExtension } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import { basicSetup } from "codemirror";
import { makeJsonTemplate } from "../json/to_json";
import type { Json, RecordDefinition, TypeDefinition } from "../json/types";
import { enterKeyHandler } from "./enter_key_handler";
import { jsonCompletion } from "./json_completion";
import { jsonLinter } from "./json_linter";
import { debouncedJsonParser } from "./json_state";
import { statusBar } from "./status_bar";

export type CreateEditorStateParams = {
  schema: TypeDefinition;
  readOnly?: true;
  json?: Json;
  theme?: "tokyo-night" | "tokyo-night-day" | CustomTheme;
};

export function createEditorState({
  schema,
  readOnly,
  json,
  theme,
}: CreateEditorStateParams): EditorState {
  const idToRecordDef: { [id: string]: RecordDefinition } = {};
  for (const record of schema.records) {
    idToRecordDef[record.id] = record;
  }
  const content = json ?? makeJsonTemplate(schema.type, idToRecordDef);

  switch (theme) {
    case undefined:
    case "tokyo-night": {
      theme = {
        backgroundColor: "#1a1b26",
        lighterBgColor: "#1f2335",
        borderColor: "#414868",
        foregroundColor: "#c0caf5",
        accentColor: "#7aa2f7",
        errorColor: "#f7768e",
        selectionColor: "#515c7e40",
        themeExtension: tokyoNight,
      };
      break;
    }
    case "tokyo-night-day": {
      theme = {
        backgroundColor: "#d5d6db",
        lighterBgColor: "#e1e2e7",
        borderColor: "#adb0bb",
        foregroundColor: "#3760bf",
        accentColor: "#2e7de9",
        errorColor: "#f52a65",
        selectionColor: "#3760bf33",
        themeExtension: tokyoNightDay,
      };
      break;
    }
  }

  return EditorState.create({
    doc: JSON.stringify(content, null, 2),
    extensions: [
      EditorState.readOnly.of(!!readOnly),
      readOnly ? [] : enterKeyHandler(schema),
      basicSetup,
      EditorState.languageData.of(() => [
        {
          closeBrackets: { before: ",]}" },
        },
      ]),
      closeBrackets(),
      theme.themeExtension ?? [],
      jsonExtension(),
      debouncedJsonParser(schema),
      linter(jsonLinter(readOnly ? "read-only" : "editable")),
      autocompletion({
        override: [jsonCompletion(schema)],
      }),
      lintGutter(),
      statusBar(),
      EditorView.theme({
        "&": {
          fontSize: "14px",
          height: "100%",
        },
        ".cm-scroller": {
          fontFamily: "'JetBrains Mono', monospace",
          overflow: "auto",
        },
        ".cm-lintRange-info": {
          backgroundImage: "none",
        },
        ".cm-lintRange-info:hover": {
          backgroundColor: theme.selectionColor,
        },
        ".cm-lintRange-error": {
          backgroundImage: "none",
          borderBottom: `3px solid ${theme.errorColor}`,
        },
        ".cm-tooltip-hover": {
          backgroundColor: theme.lighterBgColor,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: "4px",
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          fontSize: "14px",
          lineHeight: "1.4",
          color: theme.foregroundColor,
        },
        ".cm-tooltip.cm-tooltip-lint": {
          backgroundColor: theme.lighterBgColor,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: "4px",
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          fontSize: "14px", // Ensure consistency
          color: theme.foregroundColor,
        },
        ".cm-tooltip-lint .cm-diagnostic-error": {
          fontWeight: "bold",
          color: theme.errorColor,
        },
        ".cm-status-bar": {
          backgroundColor: theme.lighterBgColor,
          borderTopColor: theme.borderColor,
          color: theme.accentColor,
        },
        ".cm-diagnostic-textarea": {
          backgroundColor: theme.lighterBgColor,
          borderColor: theme.borderColor,
          color: theme.foregroundColor,
        },
        ".cm-diagnostic-textarea[readonly]": {
          backgroundColor: theme.backgroundColor,
        },
        ".cm-diagnostic-input": {
          backgroundColor: theme.lighterBgColor,
          borderColor: theme.borderColor,
          color: theme.foregroundColor,
        },
        ".cm-diagnostic-button": {
          backgroundColor: theme.lighterBgColor,
          borderColor: theme.borderColor,
          color: theme.foregroundColor,
        },
        ".cm-diagnostic-button:hover": {
          backgroundColor: theme.borderColor,
        },
        ".cm-diagnostic-error-message": {
          color: theme.errorColor,
        },
        ".diagnostic-row + .diagnostic-row": {
          borderTopColor: theme.borderColor,
        },
      }),
      EditorView.baseTheme({
        ".cm-lint-marker-info": {
          display: "none",
        },
        ".cm-status-bar": {
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "flex-end",
          padding: "4px 12px",
          borderTop: "1px solid",
          fontSize: "12px",
          height: "16px",
        },
        ".cm-status-bar-link": {
          textDecoration: "none",
          cursor: "pointer",
        },
        ".cm-status-bar-link:hover": {
          textDecoration: "underline",
        },
        ".cm-status-bar-link:hover ~ .cm-status-bar-link": {
          textDecoration: "underline",
        },
        ".cm-diagnostic-wrapper": {
          fontSize: "12px",
          lineHeight: "1.3",
          padding: "2px",
        },
        ".cm-diagnostic-controls": {
          marginTop: "4px",
          display: "flex",
          gap: "6px",
          alignItems: "center",
        },
        ".cm-diagnostic-label": {
          whiteSpace: "nowrap",
          fontWeight: "500",
          minWidth: "64px",
        },
        ".cm-diagnostic-textarea": {
          flex: "1",
          padding: "3px 6px",
          border: "1px solid",
          borderRadius: "3px",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          resize: "none",
          overflow: "auto",
          boxSizing: "border-box",
        },
        ".cm-diagnostic-textarea[readonly]": {
          cursor: "default",
        },
        ".cm-diagnostic-input": {
          padding: "3px 6px",
          border: "1px solid",
          borderRadius: "3px",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          boxSizing: "border-box",
          width: "100%",
        },
        ".cm-diagnostic-button": {
          padding: "3px 12px",
          border: "1px solid",
          borderRadius: "3px",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          cursor: "pointer",
          boxSizing: "border-box",
        },
        ".cm-diagnostic-button:active": {
          transform: "translateY(1px)",
        },
        ".cm-diagnostic-error-message": {
          fontSize: "11px",
          marginTop: "2px",
          fontWeight: "500",
        },
        ".cm-timestamp-field": {
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flex: "1",
        },
        ".cm-tooltip-lint .cm-diagnostic": {
          padding: "0",
          borderTop: "none",
          borderLeft: "none",
        },
        ".cm-tooltip-lint .cm-diagnostic-error": {
          borderLeft: "none",
          fontWeight: "bold",
        },
        ".cm-tooltip-lint .cm-diagnostic-info": {
          borderLeft: "none",
        },
        ".diagnostic-row + .diagnostic-row": {
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: "1px solid",
        },
      }),
    ],
  });
}

export interface CustomTheme {
  backgroundColor: string;
  lighterBgColor: string;
  borderColor: string;
  foregroundColor: string;
  accentColor: string;
  errorColor: string;
  selectionColor: string;
  themeExtension?: Extension;
}
