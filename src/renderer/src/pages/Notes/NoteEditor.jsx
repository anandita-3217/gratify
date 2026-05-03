// import { useEditor, EditorContent  } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import { BubbleMenu } from '@tiptap/extension-bubble-menu'

// import { useEffect } from "react"

// export default function NoteEditor({ content, onChange, editable }) {
//     const editor = useEditor({
//         extensions: [StarterKit],
//         content,
//         editable,
//         onUpdate: ({ editor }) => {
//             onChange(editor.getText())
//         }
//     })

//     useEffect(() => {
//         if(editor && content !== editor.getText()){
//             editor.commands.setContent(content)
//         }
//     },[content])
    
//     useEffect(() => {
//         if(editor){
//             editor.setEditable(editable)
//         }
//     },[editor, editable])

//     return (
       

// // inside return
// <>
//   {editor && (
//     <BubbleMenu editor={editor}>
//       <div className="flex gap-1 bg-white rounded-lg shadow-lg p-1 border">
//         <button onClick={() => editor.chain().focus().toggleBold().run()}
//           className={editor.isActive('bold') ? 'bg-gray-200 rounded px-2 py-1 text-sm font-bold' : 'px-2 py-1 text-sm font-bold'}>
//           B
//         </button>
//         <button onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={editor.isActive('italic') ? 'bg-gray-200 rounded px-2 py-1 text-sm italic' : 'px-2 py-1 text-sm italic'}>
//           I
//         </button>
//         <button onClick={() => editor.chain().focus().toggleStrike().run()}
//           className='px-2 py-1 text-sm line-through'>
//           S
//         </button>
//         <button onClick={() => editor.chain().focus().toggleCode().run()}
//           className='px-2 py-1 text-sm font-mono'>
//           {'<>'}
//         </button>
//       </div>
//     </BubbleMenu>
//   )}
//   <EditorContent editor={editor} />
// </>
//     );
// }
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { ActionIcon, Group, Divider } from '@mantine/core'
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3 } from 'lucide-react'

export default function NoteEditor({ content, onChange, editable }) {

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
  }, [editor, editable])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content])

  return (
    <div>
      {/* toolbar — only shows when editable */}
      {editable && editor && (
        <Group gap="xs" mb="sm" p="xs" style={{ 
          border: '1px solid var(--mantine-color-default-border)', 
          borderRadius: 8,
          flexWrap: 'wrap'
        }}>
          <ActionIcon
            variant={editor.isActive('bold') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('italic') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('strike') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('code') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code size={14} />
          </ActionIcon>

          <Divider orientation="vertical" />

          <ActionIcon
            variant={editor.isActive('heading', { level: 1 }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('heading', { level: 2 }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('heading', { level: 3 }) ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 size={14} />
          </ActionIcon>

          <Divider orientation="vertical" />

          <ActionIcon
            variant={editor.isActive('bulletList') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('orderedList') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={14} />
          </ActionIcon>

          <ActionIcon
            variant={editor.isActive('blockquote') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={14} />
          </ActionIcon>
        </Group>
      )}

      {/* editor content */}
      <EditorContent editor={editor} />
    </div>
  )
}
// TODO: redo this and the changes arent getting reflected even if i have italicized or bolded the text it is not showing up. snd save is triggering the editmodal to open