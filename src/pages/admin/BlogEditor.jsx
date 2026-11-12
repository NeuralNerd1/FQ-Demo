import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, Eye, ArrowLeft, Bold, Italic, List, ListOrdered, Heading2, Heading3 } from 'lucide-react';
import { posts } from '../../lib/db';

const schema = z.object({
  title: z.string().min(3, 'Title required'),
  slug: z.string().min(3, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  author_name: z.string().optional(),
  tags: z.string().optional(),
  cover_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_published: z.boolean(),
});

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`tiptap-toolbar-btn ${active ? 'bg-surface-200 text-surface-900' : ''}`}
    >
      {children}
    </button>
  );
}

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const { data: post } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data } = await posts.getById(id);
      return data;
    },
    enabled: !isNew,
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', slug: '', author_name: '', tags: '', cover_image_url: '', is_published: false },
  });

  const title = watch('title');
  useEffect(() => {
    if (isNew && title) {
      setValue('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [title, isNew, setValue]);

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: { attributes: { class: 'ProseMirror' } },
  });

  useEffect(() => {
    if (post && editor) {
      setValue('title', post.title || '');
      setValue('slug', post.slug || '');
      setValue('author_name', post.author_name || '');
      setValue('tags', (post.tags || []).join(', '));
      setValue('is_published', !!post.is_published);
      setValue('cover_image_url', post.cover_image_url || '');
      editor.commands.setContent(post.content || post.body || '');
    }
  }, [post, editor, setValue]);

  const qc = useQueryClient();

  const saveMut = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        cover_image_url: data.cover_image_url || null,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        content: editor?.getHTML() || '',
        published_at: data.is_published ? new Date().toISOString() : null,
      };
      if (isNew) return posts.create(payload);
      return posts.update(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      navigate('/admin/blog');
    },
  });

  const onSubmit = (data) => saveMut.mutate(data);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/blog')} className="p-2 rounded-lg hover:bg-surface-100">
          <ArrowLeft className="h-4 w-4 text-surface-600" />
        </button>
        <h1 className="text-xl font-bold text-surface-900">{isNew ? 'New post' : 'Edit post'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-6 space-y-4">
          <div className="form-group">
            <label className="label label-required">Title</label>
            <input {...register('title')} className="input text-lg" placeholder="Your post title" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label label-required">Slug</label>
              <input {...register('slug')} className="input font-mono text-sm" placeholder="post-slug-here" />
              {errors.slug && <p className="form-error">{errors.slug.message}</p>}
            </div>
            <div className="form-group">
              <label className="label">Author name</label>
              <input {...register('author_name')} className="input" placeholder="Arjun Mehta" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Tags <span className="text-surface-400 font-normal">(comma-separated)</span></label>
            <input {...register('tags')} className="input" placeholder="DPDPA, AI, Compliance" />
          </div>
          <div className="form-group">
            <label className="label">Cover Image URL</label>
            <input {...register('cover_image_url')} className="input" placeholder="https://…/image.jpg" />
            <p className="text-xs text-surface-400 mt-1">Optional. Shown as the card header on the Insights page.</p>
          </div>
        </div>

        {/* Editor */}
        <div className="card overflow-hidden">
          {editor && (
            <div className="tiptap-toolbar">
              <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                <Bold className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                <Italic className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-surface-200 mx-0.5" />
              <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
                <Heading2 className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
                <Heading3 className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-surface-200 mx-0.5" />
              <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                <List className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
                <ListOrdered className="h-4 w-4" />
              </ToolbarBtn>
            </div>
          )}
          <div className="tiptap-editor p-5">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer */}
        <div className="card p-5 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Controller
              name="is_published"
              control={control}
              render={({ field }) => (
                <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4 rounded border-surface-300 text-brand-600" />
              )}
            />
            <span className="text-sm text-surface-700">Publish immediately</span>
          </label>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/admin/blog')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saveMut.isPending} className="btn-primary">
              <Save className="h-4 w-4" /> {saveMut.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
