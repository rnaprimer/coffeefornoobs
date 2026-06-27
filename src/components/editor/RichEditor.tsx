'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import CharacterCount from '@tiptap/extension-character-count';
import { ProductEmbed } from './extensions/ProductEmbed';
import { BeanEmbed } from './extensions/BeanEmbed';
import { ComparisonEmbed } from './extensions/ComparisonEmbed';
import { Callout } from './extensions/CalloutEmbed';
import { EditorToolbar } from './EditorToolbar';

interface RichEditorProps {
  initialContent?: any;
  onChange: (json: any) => void;
  draftKey?: string;
}

export function RichEditor({ initialContent, onChange, draftKey }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Youtube,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      ProductEmbed,
      BeanEmbed,
      ComparisonEmbed,
      Callout,
      CharacterCount,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
      if (draftKey) {
        localStorage.setItem(`tiptap-draft-${draftKey}`, JSON.stringify(json));
      }
    },
  });

  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (draftKey) {
      const savedDraft = localStorage.getItem(`tiptap-draft-${draftKey}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          // Simple heuristic to see if initialContent is effectively empty
          const isInitialEmpty = !initialContent || (initialContent.content && initialContent.content.length === 1 && !initialContent.content[0].content);
          if (isInitialEmpty) {
             if (confirm('We found an unsaved draft. Would you like to restore it?')) {
               editor.commands.setContent(parsed);
             } else {
               localStorage.removeItem(`tiptap-draft-${draftKey}`);
             }
          }
        } catch(e) {
          console.error('Error parsing draft', e);
        }
      }
    }
  }, [editor, draftKey, initialContent]);


  return (
    <div className="flex flex-col w-full h-[800px] border-4 border-brand-dark bg-brand-white shadow-[8px_8px_0px_#111111]">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text bg-gray-50" onClick={() => editor?.commands.focus()}>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8 bg-brand-white min-h-full border-x-4 border-brand-dark shadow-[8px_0_0_#111111]">
          <EditorContent editor={editor} className="min-h-[500px] focus:outline-none prose max-w-none" />
        </div>
      </div>

      <div className="border-t-4 border-brand-dark bg-brand-white p-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
        <div>
          {editor.storage.characterCount.words()} words
        </div>
        <div>
          {Math.ceil(editor.storage.characterCount.words() / 200)} min read
        </div>
      </div>
    </div>
  );
}
