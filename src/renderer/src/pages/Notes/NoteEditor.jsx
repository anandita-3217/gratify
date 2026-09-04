// // TODO: use regex to see if the typed text is a list and appropriately give a dialog box to turn the text into a list. also spaces arent list values we need to take care of that too

// import { useEditor, EditorContent } from '@tiptap/react'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'
// import StarterKit from '@tiptap/starter-kit'
// import { useEffect } from 'react'
// import { ActionIcon, Group, Divider } from '@mantine/core'
// import { ListTodo, Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, X } from 'lucide-react'

// import {
//   Bold,
//   Italic,
//   Strikethrough,
//   Code,
//   List,
//   ListOrdered,
//   Quote,
//   Heading1,
//   Heading2,
//   Heading3
// } from 'lucide-react'
// import PropTypes from 'prop-types'

// export default function NoteEditor({ content, onChange, editable }) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       TaskList,
//       TaskItem.configure({
//         nested: true
//       })
//     ],
//     content,
//     editable,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML())
//     }
//   })

//   useEffect(() => {
//     if (editor) {
//       editor.setEditable(editable)
//     }
//   }, [editor, editable])

//   useEffect(() => {
//     if (editor) {
//       editor.commands.setContent(content || '')
//     }
//   }, [editor, content])

//   return (
//     <div>
//       {/* toolbar — only shows when editable */}
//       {editable && editor && (
//         <Group
//           gap="xs"
//           mb="sm"
//           p="xs"
//           style={{
//             border: '1px solid var(--mantine-color-default-border)',
//             borderRadius: 8,
//             flexWrap: 'wrap'
//           }}
//         >
//           <ActionIcon
//             variant={editor.isActive('bold') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleBold().run()}
//           >
//             <Bold size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('italic') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//           >
//             <Italic size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('strike') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleStrike().run()}
//           >
//             <Strikethrough size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('code') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleCode().run()}
//           >
//             <Code size={14} />
//           </ActionIcon>

//           <Divider orientation="vertical" />

//           <ActionIcon
//             variant={editor.isActive('heading', { level: 1 }) ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           >
//             <Heading1 size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('heading', { level: 2 }) ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           >
//             <Heading2 size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('heading', { level: 3 }) ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           >
//             <Heading3 size={14} />
//           </ActionIcon>

//           <Divider orientation="vertical" />

//           <ActionIcon
//             variant={editor.isActive('bulletList') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//           >
//             <List size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('orderedList') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           >
//             <ListOrdered size={14} />
//           </ActionIcon>

//           <ActionIcon
//             variant={editor.isActive('blockquote') ? 'filled' : 'subtle'}
//             color="gray"
//             size="sm"
//             onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           >
//             <Quote size={14} />
//           </ActionIcon>
//           <ActionIcon
//             variant={editor.isActive('taskList') ? 'filled' : 'subtle'}
//             size="sm"
//             onClick={() => editor.chain().focus().toggleTaskList().run()}
//           >
//             <ListTodo size={14} />
//           </ActionIcon>
//         </Group>
//       )}

//       {/* editor content */}
//       <EditorContent editor={editor} />
//     </div>
//   )
// }
// NoteEditor.propTypes = {
//   content: PropTypes.array,
//   onChange: PropTypes.bool,
//   editable: PropTypes.bool
// }
// // TODO: redo this and the changes arent getting reflected even if i have italicized or bolded the text it is not showing up. snd save is triggering the editmodal to open

import { useEditor, EditorContent } from '@tiptap/react'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { ActionIcon, Group, Divider, Button, Text } from '@mantine/core'
import {
  ListTodo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  X
} from 'lucide-react'

const LIST_PATTERNS = [/^[-*•]\s+.+/m, /^\d+\.\s+.+/m, /^[a-z]\)\s+.+/m]

function looksLikeList(text) {
  const lines = text.split('\n').filter((l) => l.trim() !== '')
  if (lines.length < 2) return false
  return LIST_PATTERNS.some((pattern) => lines.filter((l) => pattern.test(l)).length >= 2)
}

function convertToChecklist(editor) {
  const text = editor.getText()
  const lines = text
    .split('\n')
    .map((l) =>
      l
        .replace(/^[-*•]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^[a-z]\)\s+/, '')
        .trim()
    )
    .filter((l) => l !== '')
  const html = `<ul data-type="taskList">${lines
    .map((l) => `<li data-type="taskItem" data-checked="false"><p>${l}</p></li>`)
    .join('')}</ul>`
  editor.commands.setContent(html)
}

function convertToBulletList(editor) {
  const text = editor.getText()
  const lines = text
    .split('\n')
    .map((l) =>
      l
        .replace(/^[-*•]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^[a-z]\)\s+/, '')
        .trim()
    )
    .filter((l) => l !== '')
  const html = `<ul>${lines.map((l) => `<li><p>${l}</p></li>`).join('')}</ul>`
  editor.commands.setContent(html)
}

export default function NoteEditor({ content, onChange, editable }) {
  const [showListPrompt, setShowListPrompt] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem.configure({ nested: true })],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      onChange(html)
      if (
        looksLikeList(text) &&
        !editor.isActive('bulletList') &&
        !editor.isActive('taskList') &&
        !editor.isActive('orderedList')
      ) {
        setShowListPrompt(true)
      } else {
        setShowListPrompt(false)
      }
    }
  })

  useEffect(() => {
    if (editor) editor.setEditable(editable)
  }, [editor, editable])

  useEffect(() => {
    if (editor) editor.commands.setContent(content || '')
  }, [editor, content])

  return (
    <div>
      {editable && editor && (
        <Group
          gap="xs"
          mb="sm"
          p="xs"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: 8,
            flexWrap: 'wrap'
          }}
        >
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
          <ActionIcon
            variant={editor.isActive('taskList') ? 'filled' : 'subtle'}
            color="gray"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodo size={14} />
          </ActionIcon>
        </Group>
      )}

      {/* list detection prompt */}
      {showListPrompt && editable && (
        <Group
          gap="xs"
          p="xs"
          mb="xs"
          style={{
            borderRadius: 8,
            border: '1px solid var(--mantine-color-default-border)',
            background: 'var(--mantine-color-default-hover)'
          }}
        >
          <Text size="xs" c="dimmed" style={{ flex: 1 }}>
            Looks like a list — convert it?
          </Text>
          <Button
            size="xs"
            variant="light"
            color="pink"
            onClick={() => {
              convertToChecklist(editor)
              setShowListPrompt(false)
            }}
          >
            Checklist
          </Button>
          <Button
            size="xs"
            variant="light"
            color="gray"
            onClick={() => {
              convertToBulletList(editor)
              setShowListPrompt(false)
            }}
          >
            Bullet List
          </Button>
          <ActionIcon
            size="xs"
            variant="subtle"
            color="gray"
            onClick={() => setShowListPrompt(false)}
          >
            <X size={12} />
          </ActionIcon>
        </Group>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
