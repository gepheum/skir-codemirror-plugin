import { EditorView } from "@codemirror/view";
import { createEditorState, } from "../dist/codemirror/create_editor_state.js";
const editorRoot = document.getElementById("editor");
if (!editorRoot) {
    throw new Error("Missing #editor element");
}
// Replace this object with your own createEditorState params.
const params = {
    schema: {
        type: { kind: "primitive", value: "string" },
        records: [],
    },
    theme: "tokyo-night-day",
};
new EditorView({
    state: createEditorState(params),
    parent: editorRoot,
});
//# sourceMappingURL=main.js.map