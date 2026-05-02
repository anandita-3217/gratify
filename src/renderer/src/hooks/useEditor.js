import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
export default function useEditor({ content, onChange, onDelete }){
    const editor = useEditor({ extensions: StarterKit, content: note.body})
    return (
        <EditorContent editor={editor} />
    );
}