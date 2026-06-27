'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  List, 
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  Table as TableIcon,
  ShoppingBag,
  Coffee,
  Scale,
  Info,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { MediaPickerModal } from '../admin/media/MediaPicker';
import { ProductSelectorModal } from './selectors/ProductSelectorModal';
import { BeanSelectorModal } from './selectors/BeanSelectorModal';
import { ComparisonSelectorModal } from './selectors/ComparisonSelectorModal';
import { EditorFloatingMenu } from './EditorFloatingMenu';
import { EditorTemplates } from './templates';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const supabase = createClient();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaActiveFolder, setMediaActiveFolder] = useState('all');

  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showBeanPicker, setShowBeanPicker] = useState(false);
  const [showComparisonPicker, setShowComparisonPicker] = useState(false);

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    if (!supabase) return;
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (data) {
      setMediaList(data);
    }
    setLoadingMedia(false);
  };

  const handleMediaConfirm = () => {
    if (selectedMediaId) {
      const mediaItem = mediaList.find(m => m.id === selectedMediaId);
      if (mediaItem) {
        editor.chain().focus().setImage({ src: mediaItem.url, alt: mediaItem.alt_text }).run();
      }
    }
    setShowMediaPicker(false);
    setSelectedMediaId(null);
  };

  const handleProductConfirm = (productId: string) => {
    editor.chain().focus().setProductEmbed({ id: productId }).run();
    setShowProductPicker(false);
  };

  const handleBeanConfirm = (beanId: string) => {
    editor.chain().focus().setBeanEmbed({ id: beanId }).run();
    setShowBeanPicker(false);
  };

  const handleComparisonConfirm = (product1Id: string, product2Id: string) => {
    editor.chain().focus().setComparisonEmbed({ product1_id: product1Id, product2_id: product2Id }).run();
    setShowComparisonPicker(false);
  };

  useEffect(() => {
    if (showMediaPicker && mediaList.length === 0) {
      fetchMediaList();
    }
  }, [showMediaPicker]);

  const applyTemplate = (templateKey: string) => {
    if (templateKey && EditorTemplates[templateKey as keyof typeof EditorTemplates]) {
      if (confirm('Applying a template will overwrite current content. Proceed?')) {
        editor.commands.setContent(EditorTemplates[templateKey as keyof typeof EditorTemplates]);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#1a1a1a] border-b border-white/10">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold size={16} />}
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic size={16} />}
        title="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<Strikethrough size={16} />}
        title="Strikethrough"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<Code size={16} />}
        title="Code"
      />
      
      <div className="w-px h-6 bg-white/10 mx-1" />
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 size={16} />}
        title="Heading 2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<Heading3 size={16} />}
        title="Heading 3"
      />
      
      <div className="w-px h-6 bg-white/10 mx-1" />

      <select 
        onChange={(e) => {
          applyTemplate(e.target.value);
          e.target.value = '';
        }}
        className="bg-transparent text-gray-300 text-sm outline-none border border-white/20 rounded px-2 py-1 hover:border-white/40"
      >
        <option value="" disabled selected>Templates...</option>
        <option value="blank">Blank</option>
        <option value="guide">Guide Template</option>
        <option value="comparison">Comparison Template</option>
      </select>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List size={16} />}
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered size={16} />}
        title="Ordered List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<Quote size={16} />}
        title="Quote"
      />
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCallout({ intent: 'info' }).run()}
        isActive={editor.isActive('callout', { intent: 'info' })}
        icon={<Info size={16} className="text-blue-500" />}
        title="Info Callout"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCallout({ intent: 'warning' }).run()}
        isActive={editor.isActive('callout', { intent: 'warning' })}
        icon={<AlertTriangle size={16} className="text-red-500" />}
        title="Warning Callout"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCallout({ intent: 'tip' }).run()}
        isActive={editor.isActive('callout', { intent: 'tip' })}
        icon={<Lightbulb size={16} className="text-green-500" />}
        title="Tip Callout"
      />

      <div className="w-px h-6 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => {
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        isActive={editor.isActive('link')}
        icon={<LinkIcon size={16} />}
        title="Link"
      />
      <ToolbarButton
        onClick={() => setShowMediaPicker(true)}
        icon={<ImageIcon size={16} />}
        title="Image"
      />
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('YouTube URL');
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }
        }}
        icon={<Video size={16} />}
        title="YouTube"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        icon={<TableIcon size={16} />}
        title="Table"
      />

      <div className="w-px h-6 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => setShowProductPicker(true)}
        icon={<ShoppingBag size={16} />}
        title="Insert Product"
      />
      <ToolbarButton
        onClick={() => setShowBeanPicker(true)}
        icon={<Coffee size={16} />}
        title="Insert Bean"
      />
      <ToolbarButton
        onClick={() => setShowComparisonPicker(true)}
        icon={<Scale size={16} />}
        title="Insert Comparison"
      />

      <div className="flex-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        icon={<Undo size={16} />}
        title="Undo"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        icon={<Redo size={16} />}
        title="Redo"
      />

      <MediaPickerModal 
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onConfirm={handleMediaConfirm}
        selectedId={selectedMediaId}
        setSelectedId={setSelectedMediaId}
        folder="all"
        media={mediaList}
        fetchMedia={fetchMediaList}
        loading={loadingMedia}
        search={mediaSearch}
        setSearch={setMediaSearch}
        activeFolder={mediaActiveFolder}
        setActiveFolder={setMediaActiveFolder}
      />

      <ProductSelectorModal
        isOpen={showProductPicker}
        onClose={() => setShowProductPicker(false)}
        onConfirm={handleProductConfirm}
      />

      <BeanSelectorModal
        isOpen={showBeanPicker}
        onClose={() => setShowBeanPicker(false)}
        onConfirm={handleBeanConfirm}
      />

      <ComparisonSelectorModal
        isOpen={showComparisonPicker}
        onClose={() => setShowComparisonPicker(false)}
        onConfirm={handleComparisonConfirm}
      />

      <EditorFloatingMenu 
        editor={editor}
        onOpenMediaPicker={() => setShowMediaPicker(true)}
        onOpenProductPicker={() => setShowProductPicker(true)}
        onOpenBeanPicker={() => setShowBeanPicker(true)}
        onOpenComparisonPicker={() => setShowComparisonPicker(true)}
      />
    </div>
  );
}

function ToolbarButton({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  icon, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive 
          ? 'bg-amber-500/20 text-amber-500' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
}
