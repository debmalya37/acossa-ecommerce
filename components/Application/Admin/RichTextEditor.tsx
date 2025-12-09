"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    content: value,

    extensions: [
      Paragraph,
      Text,

      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),

      Heading.configure({
        levels: [1, 2, 3],
      }),

      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-6",
        },
      }),

      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-6",
        },
      }),

      ListItem,
    ],

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="h-[350px] rounded-xl border bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const btn = (active?: boolean) =>
    `
      p-2 rounded-lg transition
      ${active
        ? "bg-black text-white dark:bg-white dark:text-black"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}
    `;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </button>

        <div className="w-px mx-2 bg-gray-300 dark:bg-gray-600" />

        <button
          type="button"
          className={btn(editor.isActive("heading", { level: 1 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={16} />
        </button>

        <button
          type="button"
          className={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          className={btn(editor.isActive("heading", { level: 3 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px mx-2 bg-gray-300 dark:bg-gray-600" />

        <button
          type="button"
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </button>

        <button
          type="button"
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="
          px-5 py-4 min-h-[350px]
          focus:outline-none
          text-gray-900 dark:text-gray-100

          [&_h1]:text-3xl
          [&_h2]:text-2xl
          [&_h3]:text-xl
          [&_h1]:font-serif
          [&_h2]:font-serif
          [&_h3]:font-serif
          [&_h1]:font-semibold
          [&_h2]:font-semibold
          [&_h3]:font-semibold

          [&_p]:leading-relaxed
          [&_ul]:list-disc
          [&_ol]:list-decimal
          [&_li]:ml-6
        "
      />
    </div>
  );
}
