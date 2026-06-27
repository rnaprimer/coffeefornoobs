'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLearnArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    if (!supabase) return;
    const anySupabase: any = supabase;
    const { data, error } = await anySupabase
      .from('learn_articles')
      .select('id, title, slug, status, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!supabase) return;
    const title = window.prompt('Enter article title:');
    if (!title) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const anySupabase: any = supabase;
    const { data, error } = await anySupabase
      .from('learn_articles')
      .insert([{ title, slug, status: 'draft', content_json: { type: 'doc', content: [{ type: 'paragraph' }] } }])
      .select()
      .single();

    if (error) {
      alert('Error creating article: ' + error.message);
    } else if (data) {
      router.push(`/admin/learn/${data.id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    const anySupabase: any = supabase;
    await anySupabase.from('learn_articles').delete().eq('id', id);
    fetchArticles();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-black text-4xl uppercase tracking-widest text-brand-dark">Learn Articles</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
        >
          <Plus size={20} />
          New Article
        </button>
      </div>

      <div className="bg-brand-white border-4 border-brand-dark shadow-[8px_8px_0px_#111111]">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center font-bold text-gray-500 uppercase tracking-widest">
            No articles found. Create one!
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b-4 border-brand-dark bg-gray-50">
              <tr>
                <th className="p-4 font-bold uppercase tracking-widest text-brand-dark">Title</th>
                <th className="p-4 font-bold uppercase tracking-widest text-brand-dark">Status</th>
                <th className="p-4 font-bold uppercase tracking-widest text-brand-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr key={article.id} className={index !== articles.length - 1 ? "border-b-2 border-brand-dark" : ""}>
                  <td className="p-4 font-bold">{article.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold uppercase tracking-widest border-2 border-brand-dark ${article.status === 'published' ? 'bg-brand-lime' : 'bg-gray-200'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/learn/${article.id}`}
                      className="p-2 border-2 border-brand-dark hover:bg-brand-pink hover:text-white transition-colors rounded-full"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 border-2 border-brand-dark hover:bg-red-500 hover:text-white transition-colors rounded-full text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
