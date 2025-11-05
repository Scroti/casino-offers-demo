'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import type { Guide } from '@/app/lib/data-access/configs/guides.config';
import { useGetAllGuidesQuery } from '@/app/lib/data-access/configs/guides.config';

interface GuideFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Guide | null;
  onSubmit: (data: Partial<Guide>) => void;
}

export function GuideFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: GuideFormModalProps) {
  const { data: allGuides = [] } = useGetAllGuidesQuery({ published: false });
  
  const [title, setTitle] = React.useState(initialData?.title ?? '');
  const [slug, setSlug] = React.useState(initialData?.slug ?? '');
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt ?? '');
  const [content, setContent] = React.useState(initialData?.content ?? '');
  const [tags, setTags] = React.useState<string[]>(initialData?.tags ?? []);
  const [categories, setCategories] = React.useState<string[]>(initialData?.categories ?? []);
  const [featuredImage, setFeaturedImage] = React.useState(initialData?.featuredImage ?? '');
  const [isPublished, setIsPublished] = React.useState(initialData?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = React.useState(initialData?.isFeatured ?? false);
  const [author, setAuthor] = React.useState(initialData?.author ?? '');
  const [publishedAt, setPublishedAt] = React.useState(
    initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : ''
  );
  const [seoTitle, setSeoTitle] = React.useState(initialData?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = React.useState(initialData?.seoDescription ?? '');
  const [relatedGuides, setRelatedGuides] = React.useState<string[]>(
    initialData?.relatedGuides ?? []
  );

  const [tagInput, setTagInput] = React.useState('');

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '');
      setSlug(initialData.slug ?? '');
      setExcerpt(initialData.excerpt ?? '');
      setContent(initialData.content ?? '');
      setTags(initialData.tags ?? []);
      setCategories(initialData.categories ?? []);
      setFeaturedImage(initialData.featuredImage ?? '');
      setIsPublished(initialData.isPublished ?? false);
      setIsFeatured(initialData.isFeatured ?? false);
      setAuthor(initialData.author ?? '');
      setPublishedAt(
        initialData.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : ''
      );
      setSeoTitle(initialData.seoTitle ?? '');
      setSeoDescription(initialData.seoDescription ?? '');
      setRelatedGuides(initialData.relatedGuides ?? []);
    } else {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setTags([]);
      setCategories([]);
      setFeaturedImage('');
      setIsPublished(false);
      setIsFeatured(false);
      setAuthor('');
      setPublishedAt('');
      setSeoTitle('');
      setSeoDescription('');
      setRelatedGuides([]);
    }
  }, [initialData, isOpen]);

  // Auto-generate slug from title
  React.useEffect(() => {
    if (!initialData && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, initialData]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted:', { title, slug, content });
    
    // Validate required fields
    if (!title || !slug || !content) {
      console.error('Missing required fields:', { title, slug, content });
      alert('Please fill in all required fields: Title, Slug, and Content');
      return;
    }

    const formData = {
      title,
      slug,
      excerpt,
      content,
      tags,
      categories,
      featuredImage,
      isPublished,
      isFeatured,
      author,
      publishedAt: publishedAt || undefined,
      seoTitle,
      seoDescription,
      relatedGuides,
    };

    console.log('Calling onSubmit with data:', formData);

    try {
      await onSubmit(formData);
      console.log('onSubmit completed successfully');
    } catch (error) {
      console.error('Error submitting guide form:', error);
      alert('Failed to save guide. Please check the console for details.');
    }
  };

  const availableGuides = allGuides.filter((g) => g._id !== initialData?._id);

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      onClose();
    }
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(e) => {
          // Prevent closing on escape during form submission
          if (e.defaultPrevented) return;
        }}
        onPointerDownOutside={(e) => {
          // Prevent closing on outside click during form submission
          if (e.defaultPrevented) return;
        }}
      >
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Guide' : 'Create New Guide'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Short description for preview..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              required
              placeholder="Main content (HTML or Markdown supported)..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter to add tag"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categories</Label>
              <MultiSelect
                options={['Casino Basics', 'Bonus Guides', 'Game Strategies', 'Payment Guides', 'Safety Guides']}
                selected={categories}
                onChange={setCategories}
                placeholder="Select categories..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                id="publishedAt"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Related Guides</Label>
            <MultiSelect
              options={availableGuides.map((g) => `${g.title} (${g.slug})`)}
              selected={relatedGuides.map((id) => {
                const guide = availableGuides.find((g) => g._id === id);
                return guide ? `${guide.title} (${guide.slug})` : '';
              }).filter(Boolean)}
              onChange={(selected) => {
                const selectedIds = availableGuides
                  .filter((g) => selected.some((s) => s.includes(g.title)))
                  .map((g) => g._id!)
                  .filter(Boolean);
                setRelatedGuides(selectedIds);
              }}
              placeholder="Select related guides..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublished"
                checked={isPublished}
                onCheckedChange={(checked) => setIsPublished(checked === true)}
              />
              <Label htmlFor="isPublished" className="cursor-pointer">
                Published
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(checked === true)}
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured (show on homepage)
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO meta title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                placeholder="SEO meta description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Guide</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

