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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { COMMON_LANGUAGES } from '@/lib/constants/languages';
import { COMMON_GAME_PROVIDERS } from '@/lib/constants/game-providers';
import { COMMON_GAME_TYPES } from '@/lib/constants/game-types';
import { generateCasinoGuruUrl } from '@/app/lib/constants/games';
import type { Game } from '@/app/lib/data-access/models/game.model';

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Game | null;
  onSubmit: (data: Partial<Game>) => void;
}

export function GameFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: GameFormModalProps) {
  const [gameId, setGameId] = React.useState(initialData?.gameId ?? '');
  const [title, setTitle] = React.useState(initialData?.title ?? '');
  const [casinoGuruIdentifier, setCasinoGuruIdentifier] = React.useState(
    initialData?.casinoGuruIdentifier ?? ''
  );
  const [embedUrl, setEmbedUrl] = React.useState(initialData?.embedUrl ?? '');
  const [thumbnail, setThumbnail] = React.useState(initialData?.thumbnail ?? '');
  const [category, setCategory] = React.useState(initialData?.category ?? '');
  const [provider, setProvider] = React.useState(initialData?.provider ?? '');
  const [description, setDescription] = React.useState(initialData?.description ?? '');
  const [isActive, setIsActive] = React.useState(initialData?.isActive ?? true);

  React.useEffect(() => {
    if (initialData) {
      setGameId(initialData.gameId ?? '');
      setTitle(initialData.title ?? '');
      setCasinoGuruIdentifier(initialData.casinoGuruIdentifier ?? '');
      setEmbedUrl(initialData.embedUrl ?? '');
      setThumbnail(initialData.thumbnail ?? '');
      setCategory(initialData.category ?? '');
      setProvider(initialData.provider ?? '');
      setDescription(initialData.description ?? '');
      setIsActive(initialData.isActive ?? true);
    } else {
      // Reset form
      setGameId('');
      setTitle('');
      setCasinoGuruIdentifier('');
      setEmbedUrl('');
      setThumbnail('');
      setCategory('');
      setProvider('');
      setDescription('');
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Generate embedUrl from casinoGuruIdentifier if not provided
    let finalEmbedUrl = embedUrl;
    if (!finalEmbedUrl && casinoGuruIdentifier) {
      finalEmbedUrl = generateCasinoGuruUrl(casinoGuruIdentifier);
    }

    onSubmit({
      gameId,
      title,
      casinoGuruIdentifier,
      embedUrl: finalEmbedUrl,
      thumbnail,
      category,
      provider,
      description,
      isActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Game' : 'Add New Game'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gameId">Game ID *</Label>
              <Input
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="e.g., juicy-fruits"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Juicy Fruits"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_GAME_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Select value={provider} onValueChange={setProvider} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_GAME_PROVIDERS.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="casinoGuruIdentifier">Casino Guru Identifier</Label>
              <Input
                id="casinoGuruIdentifier"
                value={casinoGuruIdentifier}
                onChange={(e) => setCasinoGuruIdentifier(e.target.value)}
                placeholder="e.g., c2b5d09f-b90c-4da5-a5ee-7389ee980bd6"
              />
              <p className="text-xs text-muted-foreground">
                If provided, embedUrl will be auto-generated
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="embedUrl">Embed URL</Label>
              <Input
                id="embedUrl"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://casino.guru/embedGame?identifier=..."
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from Casino Guru Identifier
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Game description..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (visible to users)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Game</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

