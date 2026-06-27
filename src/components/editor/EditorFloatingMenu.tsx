'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import { 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  ShoppingBag,
  Coffee,
  Scale,
  Info
} from 'lucide-react';

interface EditorFloatingMenuProps {
  editor: Editor;
  onOpenProductPicker: () => void;
  onOpenBeanPicker: () => void;
  onOpenComparisonPicker: () => void;
  onOpenMediaPicker: () => void;
}

export function EditorFloatingMenu({ 
  editor,
  onOpenProductPicker,
  onOpenBeanPicker,
  onOpenComparisonPicker,
  onOpenMediaPicker
}: EditorFloatingMenuProps) {
  if (!editor) return null;

  return (
    <FloatingMenu 
      editor={editor} 
      // @ts-ignore
      tippyOptions={{ duration: 100, placement: 'right-start' }}
      className="flex flex-col bg-[#1a1a1a] border border-white/10 shadow-xl rounded overflow-hidden z-50 w-48"
    >
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-white/5 bg-[#141414]">
        Insert block
      </div>
      
      <div className="max-h-64 overflow-y-auto py-1">
        <MenuButton 
          icon={<Heading2 size={16} />} 
          label="Heading 2" 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        />
        <MenuButton 
          icon={<Heading3 size={16} />} 
          label="Heading 3" 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        />
        <MenuButton 
          icon={<List size={16} />} 
          label="Bullet List" 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
        />
        <MenuButton 
          icon={<ListOrdered size={16} />} 
          label="Ordered List" 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        />
        <MenuButton 
          icon={<Quote size={16} />} 
          label="Quote" 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        />
        <MenuButton 
          icon={<Info size={16} className="text-blue-500" />} 
          label="Info Callout" 
          onClick={() => editor.chain().focus().toggleCallout({ intent: 'info' }).run()} 
        />
        
        <div className="h-px bg-white/10 my-1 mx-2" />
        
        <MenuButton 
          icon={<ImageIcon size={16} />} 
          label="Image" 
          onClick={onOpenMediaPicker} 
        />
        <MenuButton 
          icon={<Video size={16} />} 
          label="YouTube" 
          onClick={() => {
            const url = window.prompt('YouTube URL');
            if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }} 
        />
        <MenuButton 
          icon={<TableIcon size={16} />} 
          label="Table" 
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
        />
        
        <div className="h-px bg-white/10 my-1 mx-2" />
        
        <MenuButton 
          icon={<ShoppingBag size={16} />} 
          label="Product Embed" 
          onClick={onOpenProductPicker} 
        />
        <MenuButton 
          icon={<Coffee size={16} />} 
          label="Bean Embed" 
          onClick={onOpenBeanPicker} 
        />
        <MenuButton 
          icon={<Scale size={16} />} 
          label="Comparison Embed" 
          onClick={onOpenComparisonPicker} 
        />
      </div>
    </FloatingMenu>
  );
}

function MenuButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors text-gray-200"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </button>
  );
}
