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

interface BonusData {
  title?: string;
  description?: string;
  price?: string | number;
  rating?: number;
  type?: string;
  image?: string;
  href?: string;
}

interface BonusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BonusData | null;
  onSubmit: (data: {
    title: string;
    description: string;
    price: string | number;
    rating: number;
    type: string;
    image: string;
    href?: string;
  }) => void;
}

export function BonusFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: BonusFormModalProps) {
  const [title, setTitle] = React.useState(initialData?.title ?? '');
  const [description, setDescription] = React.useState(initialData?.description ?? '');
  const [price, setPrice] = React.useState(initialData?.price ?? '');
  const [rating, setRating] = React.useState(initialData?.rating ?? 0);
  const [type, setType] = React.useState(initialData?.type ?? '');
  const [image, setImage] = React.useState(initialData?.image ?? '');
  const [href, setHref] = React.useState(initialData?.href ?? '');

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
      setPrice(initialData.price ?? '');
      setRating(initialData.rating ?? 0);
      setType(initialData.type ?? '');
      setImage(initialData.image ?? '');
      setHref(initialData.href ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onSubmit({ title, description, price, rating, type, image, href });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Bonus' : 'Add Bonus'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bonus-title">Title</Label>
            <Input id="bonus-title" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-desc">Description</Label>
            <Textarea id="bonus-desc" required value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-price">Price</Label>
            <Input id="bonus-price" required value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-rating">Rating</Label>
            <Input id="bonus-rating" type="number" min={0} max={5} required value={rating} onChange={e => setRating(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="bonus-type">Type</Label>
            <Input id="bonus-type" required value={type} onChange={e => setType(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-img">Image URL</Label>
            <Input id="bonus-img" required value={image} onChange={e => setImage(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-link">Link (optional)</Label>
            <Input id="bonus-link" value={href} onChange={e => setHref(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit">{initialData ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
