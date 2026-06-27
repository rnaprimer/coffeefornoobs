'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RichEditor } from '@/components/editor/RichEditor';
import { Loader2, Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { updateRecord } from '@/actions/admin';

export default function AdminLearnArticleEditor({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    setLoading(true);
    if (!supabase) return;
    const anySupabase: any = supabase;
    const { data, error } = await anySupabase
      .from('learn_articles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!error && data) {
      setArticle(data);
      setContent((data as any).content_json || '');
    } else {
      router.push('/admin/learn');
    }
    setLoading(false);
  };

  const handleSave = async (status: 'draft' | 'published' = article.status) => {
    if (!supabase) return;
    setSaving(true);
    
    const { success, error } = await updateRecord('learn_articles', params.id, {
      content_json: content,
      status: status
    }, []);

    if (!success) {
      alert('Error saving article: ' + error);
    } else {
      setArticle({ ...article, status, content_json: content });
    }
    setSaving(false);
  };

  // Implement basic auto-save every 30 seconds if content changes
  useEffect(() => {
    if (!article || !content) return;
    
    const delay = setTimeout(() => {
      if (JSON.stringify(content) !== JSON.stringify(article.content_json)) {
        handleSave(article.status);
      }
    }, 5000); // 5 seconds debounce for saving draft
    
    return () => clearTimeout(delay);
  }, [content]);

  if (loading || !article) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-pink" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b-4 border-brand-dark bg-brand-white">
        <div className="flex items-center gap-4">
          <Link href="/admin/learn" className="p-2 border-2 border-brand-dark rounded-full hover:bg-brand-pink hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-black text-xl uppercase tracking-widest">{article.title}</h1>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
              <span className={`px-2 py-0.5 border-2 border-brand-dark ${article.status === 'published' ? 'bg-brand-lime text-brand-dark' : 'bg-gray-200'}`}>
                {article.status}
              </span>
              {saving && <span className="flex items-center gap-1 text-brand-pink"><Loader2 size={12} className="animate-spin"/> Saving...</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-widest border-2 border-brand-dark hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          
          {article.status === 'draft' ? (
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-2 border-brand-dark hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              Publish
            </button>
          ) : (
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-brand-dark font-black uppercase tracking-widest border-2 border-brand-dark hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden bg-gray-100 p-4 sm:p-8">
        {showPreview ? (
          <div className="w-full max-w-4xl mx-auto bg-brand-white border-4 border-brand-dark shadow-[8px_8px_0px_#111111] p-8 h-full overflow-y-auto">
            <h1 className="text-4xl font-black uppercase tracking-widest mb-8 border-b-4 border-brand-dark pb-4">{article.title}</h1>
            <ContentRenderer content={content} />
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
            <RichEditor 
              initialContent={content} 
              onChange={setContent}
              draftKey={`learn-${article?.id || 'new'}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
