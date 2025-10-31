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
import { Bold, Italic, Underline } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type SectionVal = { value?: string; subtitle?: string; content?: string };

interface BonusData {
  title?: string;
  description?: string;
  price?: string | number;
  rating?: number;
  type?: string;
  image?: string;
  href?: string;
  customSections?: Array<{ title: string; content: string; subtitle?: string }>;
  isExclusive?: boolean;
  casinoName?: string;
  casinoLogo?: string;
  casinoImage?: string;
  safetyIndex?: number;
  countryFlag?: string;
  countryCode?: string;
  promoCode?: string;
  bonusInstructions?: string;
  reviewLink?: string;
  wageringRequirement?: SectionVal;
  bonusValue?: SectionVal;
  maxBet?: SectionVal;
  expiration?: SectionVal;
  claimSpeed?: SectionVal;
  termsConditions?: SectionVal;
}

interface BonusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BonusData | null;
  onSubmit: (data: {
    title: string;
    description: { title?: string; subtitle?: string; content?: string };
    price: string | number;
    rating: number;
    type: string;
    image: string;
    href?: string;
    customSections?: Array<{ title: string; content: string; subtitle?: string }>;
    isExclusive?: boolean;
    casinoName?: string;
    casinoLogo?: string;
    casinoImage?: string;
    safetyIndex?: number;
    countryFlag?: string;
    countryCode?: string;
    promoCode?: string;
    bonusInstructions?: string;
    reviewLink?: string;
    wageringRequirement?: SectionVal;
    bonusValue?: SectionVal;
    maxBet?: SectionVal;
    expiration?: SectionVal;
    claimSpeed?: SectionVal;
    termsConditions?: SectionVal;
  }) => void;
}

export function BonusFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: BonusFormModalProps) {
  const descRef = React.useRef<HTMLTextAreaElement | null>(null);
  const mandatoryRefs = React.useRef<Array<HTMLTextAreaElement | null>>([]);
  const customRefs = React.useRef<Array<HTMLTextAreaElement | null>>([]);

  const wrapSelectionWithTag = (
    ref: HTMLTextAreaElement | null,
    currentValue: string,
    setValue: (v: string) => void,
    tag: 'b' | 'i' | 'u'
  ) => {
    if (!ref) return;
    const start = ref.selectionStart ?? 0;
    const end = ref.selectionEnd ?? 0;
    const before = currentValue.slice(0, start);
    const selected = currentValue.slice(start, end);
    const after = currentValue.slice(end);
    const open = `<${tag}>`;
    const close = `</${tag}>`;
    const next = `${before}${open}${selected || ''}${close}${after}`;
    setValue(next);
    // restore focus
    setTimeout(() => {
      ref.focus();
    }, 0);
  };
  const [title, setTitle] = React.useState(initialData?.title ?? '');
  const [description, setDescription] = React.useState(initialData?.description ?? '');
  const [price, setPrice] = React.useState(initialData?.price ?? '');
  const [rating, setRating] = React.useState(initialData?.rating ?? 0);
  const [type, setType] = React.useState(initialData?.type ?? '');
  const [image, setImage] = React.useState(initialData?.image ?? '');
  const [href, setHref] = React.useState(initialData?.href ?? '');
  const [customSections, setCustomSections] = React.useState<Array<{ title: string; content: string; subtitle?: string; icon?: string }>>(initialData?.customSections ?? []);
  const [isExclusive, setIsExclusive] = React.useState(initialData?.isExclusive ?? false);
  const [casinoName, setCasinoName] = React.useState(initialData?.casinoName ?? '');
  const [casinoLogo, setCasinoLogo] = React.useState(initialData?.casinoLogo ?? '');
  const [casinoImage, setCasinoImage] = React.useState(initialData?.casinoImage ?? '');
  const [safetyIndex, setSafetyIndex] = React.useState<number | undefined>(initialData?.safetyIndex ?? undefined);
  const [countryFlag, setCountryFlag] = React.useState(initialData?.countryFlag ?? '');
  const [countryCode, setCountryCode] = React.useState(initialData?.countryCode ?? '');
  const [promoCode, setPromoCode] = React.useState(initialData?.promoCode ?? '');
  const [bonusInstructions, setBonusInstructions] = React.useState(initialData?.bonusInstructions ?? '');
  const [reviewLink, setReviewLink] = React.useState(initialData?.reviewLink ?? '');
  const [wageringRequirement, setWageringRequirement] = React.useState<SectionVal>(initialData?.wageringRequirement ? { value: (initialData.wageringRequirement as any).value ?? (initialData.wageringRequirement as any).title ?? '', subtitle: initialData.wageringRequirement.subtitle ?? '', content: (initialData.wageringRequirement as any).content ?? (initialData.wageringRequirement as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
  const [bonusValueSec, setBonusValueSec] = React.useState<SectionVal>(initialData?.bonusValue ? { value: (initialData.bonusValue as any).value ?? (initialData.bonusValue as any).title ?? '', subtitle: initialData.bonusValue.subtitle ?? '', content: (initialData.bonusValue as any).content ?? (initialData.bonusValue as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
  const [maxBetSec, setMaxBetSec] = React.useState<SectionVal>(initialData?.maxBet ? { value: (initialData.maxBet as any).value ?? (initialData.maxBet as any).title ?? '', subtitle: initialData.maxBet.subtitle ?? '', content: (initialData.maxBet as any).content ?? (initialData.maxBet as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
  const [expirationSec, setExpirationSec] = React.useState<SectionVal>(initialData?.expiration ? { value: (initialData.expiration as any).value ?? (initialData.expiration as any).title ?? '', subtitle: initialData.expiration.subtitle ?? '', content: (initialData.expiration as any).content ?? (initialData.expiration as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
  const [claimSpeedSec, setClaimSpeedSec] = React.useState<SectionVal>(initialData?.claimSpeed ? { value: (initialData.claimSpeed as any).value ?? (initialData.claimSpeed as any).title ?? '', subtitle: initialData.claimSpeed.subtitle ?? '', content: (initialData.claimSpeed as any).content ?? (initialData.claimSpeed as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
  const [termsConditionsSec, setTermsConditionsSec] = React.useState<SectionVal>(initialData?.termsConditions ? { value: (initialData.termsConditions as any).value ?? (initialData.termsConditions as any).title ?? '', subtitle: initialData.termsConditions.subtitle ?? '', content: (initialData.termsConditions as any).content ?? (initialData.termsConditions as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
  // Add state management for bonusDescription (title, subtitle, content)
  const [bonusDescription, setBonusDescription] = React.useState<{ title?: string; subtitle?: string; content?: string }>(typeof initialData?.description === 'string' ? { content: initialData.description } : initialData?.description ?? { title: '', subtitle: '', content: '' });

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
      setPrice(initialData.price ?? '');
      setRating(initialData.rating ?? 0);
      setType(initialData.type ?? '');
      setImage(initialData.image ?? '');
      setHref(initialData.href ?? '');
      setCustomSections(initialData.customSections ?? []);
      setIsExclusive(initialData.isExclusive ?? false);
      setCasinoName(initialData.casinoName ?? '');
      setCasinoLogo(initialData.casinoLogo ?? '');
      setCasinoImage(initialData.casinoImage ?? '');
      setSafetyIndex(initialData.safetyIndex ?? undefined);
      setCountryFlag(initialData.countryFlag ?? '');
      setCountryCode(initialData.countryCode ?? '');
      setPromoCode(initialData.promoCode ?? '');
      setBonusInstructions(initialData.bonusInstructions ?? '');
      setReviewLink(initialData.reviewLink ?? '');
      setWageringRequirement(initialData.wageringRequirement ? { value: (initialData.wageringRequirement as any).value ?? (initialData.wageringRequirement as any).title ?? '', subtitle: initialData.wageringRequirement.subtitle ?? '', content: (initialData.wageringRequirement as any).content ?? (initialData.wageringRequirement as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
      setBonusValueSec(initialData.bonusValue ? { value: (initialData.bonusValue as any).value ?? (initialData.bonusValue as any).title ?? '', subtitle: initialData.bonusValue.subtitle ?? '', content: (initialData.bonusValue as any).content ?? (initialData.bonusValue as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
      setMaxBetSec(initialData.maxBet ? { value: (initialData.maxBet as any).value ?? (initialData.maxBet as any).title ?? '', subtitle: initialData.maxBet.subtitle ?? '', content: (initialData.maxBet as any).content ?? (initialData.maxBet as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
      setExpirationSec(initialData.expiration ? { value: (initialData.expiration as any).value ?? (initialData.expiration as any).title ?? '', subtitle: initialData.expiration.subtitle ?? '', content: (initialData.expiration as any).content ?? (initialData.expiration as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
      setClaimSpeedSec(initialData.claimSpeed ? { value: (initialData.claimSpeed as any).value ?? (initialData.claimSpeed as any).title ?? '', subtitle: initialData.claimSpeed.subtitle ?? '', content: (initialData.claimSpeed as any).content ?? (initialData.claimSpeed as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
      setTermsConditionsSec(initialData.termsConditions ? { value: (initialData.termsConditions as any).value ?? (initialData.termsConditions as any).title ?? '', subtitle: initialData.termsConditions.subtitle ?? '', content: (initialData.termsConditions as any).content ?? (initialData.termsConditions as any).expandedContent ?? '' } : { value: '', subtitle: '', content: '' });
      // For backwards compatibility, if description was a string, upgrade it to content
      if (typeof initialData.description === 'string') {
        setBonusDescription({ content: initialData.description });
      }
    }
  }, [initialData]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onSubmit({
      title,
      description: bonusDescription,
      price,
      rating,
      type,
      image,
      href,
      customSections,
      isExclusive,
      casinoName,
      casinoLogo,
      casinoImage,
      safetyIndex,
      countryFlag,
      countryCode,
      promoCode,
      bonusInstructions,
      reviewLink,
      wageringRequirement,
      bonusValue: bonusValueSec,
      maxBet: maxBetSec,
      expiration: expirationSec,
      claimSpeed: claimSpeedSec,
      termsConditions: termsConditionsSec,
    });
  };

  const addSection = () => {
    setCustomSections((prev) => [...prev, { title: '', content: '', subtitle: '', icon: '' }]);
  };

  const removeSection = (index: number) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: 'title' | 'subtitle' | 'content' | 'icon', value: string) => {
    setCustomSections((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Bonus' : 'Add Bonus'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bonus-title" className="mb-2 ml-2 block">Title</Label>
            <Input id="bonus-title" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-desc-title" className="mb-2 ml-2 block">Description Title</Label>
            <Input id="bonus-desc-title" value={bonusDescription.title ?? ''} onChange={e => setBonusDescription(d => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="bonus-desc-subtitle" className="mb-2 ml-2 block">Description Subtitle</Label>
            <Input id="bonus-desc-subtitle" value={bonusDescription.subtitle ?? ''} onChange={e => setBonusDescription(d => ({ ...d, subtitle: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="bonus-desc-content" className="mb-2 ml-2 block">Description Content</Label>
            <div className="inline-flex items-center gap-1 mb-1 rounded-md border border-border bg-muted/40 px-2 py-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Bold"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => wrapSelectionWithTag(descRef.current, bonusDescription.content || '', (val) => setBonusDescription(d => ({ ...d, content: val })), 'b')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Italic"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => wrapSelectionWithTag(descRef.current, bonusDescription.content || '', (val) => setBonusDescription(d => ({ ...d, content: val })), 'i')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Underline"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => wrapSelectionWithTag(descRef.current, bonusDescription.content || '', (val) => setBonusDescription(d => ({ ...d, content: val })), 'u')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
            <Textarea id="bonus-desc-content" ref={descRef} required value={bonusDescription.content ?? ''} onChange={e => setBonusDescription(d => ({ ...d, content: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="bonus-price" className="mb-2 ml-2 block">Price</Label>
            <Input id="bonus-price" required value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-rating" className="mb-2 ml-2 block">Rating</Label>
            <Input id="bonus-rating" type="number" min={0} max={5} step="0.1" required value={rating} onChange={e => setRating(Number(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="bonus-type" className="mb-2 ml-2 block">Type</Label>
            <Input id="bonus-type" required value={type} onChange={e => setType(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-img" className="mb-2 ml-2 block">Image URL</Label>
            <Input id="bonus-img" required value={image} onChange={e => setImage(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="bonus-link" className="mb-2 ml-2 block">Link (optional)</Label>
            <Input id="bonus-link" value={href} onChange={e => setHref(e.target.value)} />
          </div>
          {/* Display settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input id="is-exclusive" type="checkbox" checked={isExclusive} onChange={e => setIsExclusive(e.target.checked)} />
              <Label htmlFor="is-exclusive" className="mb-2 ml-2 block">Exclusive</Label>
            </div>
            <div>
              <Label htmlFor="casino-name" className="mb-2 ml-2 block">Casino Name</Label>
              <Input id="casino-name" value={casinoName} onChange={e => setCasinoName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="casino-logo" className="mb-2 ml-2 block">Casino Logo URL</Label>
              <Input id="casino-logo" value={casinoLogo} onChange={e => setCasinoLogo(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="casino-image" className="mb-2 ml-2 block">Casino Image URL</Label>
              <Input id="casino-image" value={casinoImage} onChange={e => setCasinoImage(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="safety-index" className="mb-2 ml-2 block">Safety Index</Label>
              <Input id="safety-index" type="number" value={safetyIndex ?? ''} onChange={e => setSafetyIndex(e.target.value === '' ? undefined : Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="country-flag" className="mb-2 ml-2 block">Country Flag (emoji)</Label>
              <Input id="country-flag" value={countryFlag} onChange={e => setCountryFlag(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="country-code" className="mb-2 ml-2 block">Country Code</Label>
              <Input id="country-code" value={countryCode} onChange={e => setCountryCode(e.target.value)} />
            </div>
          </div>

          {/* Promo & Review */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-code" className="mb-2 ml-2 block">Promo Code</Label>
              <Input id="promo-code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="review-link" className="mb-2 ml-2 block">Review Link</Label>
              <Input id="review-link" value={reviewLink} onChange={e => setReviewLink(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bonus-instructions" className="mb-2 ml-2 block">Bonus Instructions</Label>
              <Textarea id="bonus-instructions" value={bonusInstructions} onChange={e => setBonusInstructions(e.target.value)} />
            </div>
          </div>

          {/* Mandatory Sections */}
          <div className="space-y-3">
            <div className="text-sm font-semibold">Mandatory Sections</div>
            {[{ key: 'wageringRequirement', state: wageringRequirement, setter: setWageringRequirement, label: 'Wagering Requirements' },
              { key: 'bonusValue', state: bonusValueSec, setter: setBonusValueSec, label: 'Bonus Value' },
              { key: 'maxBet', state: maxBetSec, setter: setMaxBetSec, label: 'Max Bet' },
              { key: 'expiration', state: expirationSec, setter: setExpirationSec, label: 'Expiration' },
              { key: 'claimSpeed', state: claimSpeedSec, setter: setClaimSpeedSec, label: 'Claim Speed' },
              { key: 'termsConditions', state: termsConditionsSec, setter: setTermsConditionsSec, label: 'Terms & Conditions' }
            ].map((sec, idx) => (
              <div key={idx} className="border rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="mb-2 ml-2 block">{sec.label} Value</Label>
                  <Input value={sec.state.value} onChange={e => sec.setter({ ...sec.state, value: e.target.value })} placeholder={sec.label === 'Bonus Value' ? '€40' : sec.label === 'Max Bet' ? '€2' : ''} />
                </div>
                <div>
                  <Label className="mb-2 ml-2 block">Subtitle (optional)</Label>
                  <Input value={sec.state.subtitle ?? ''} onChange={e => sec.setter({ ...sec.state, subtitle: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2 ml-2 block">Description</Label>
                  <div className="inline-flex items-center gap-1 mb-1 rounded-md border border-border bg-muted/40 px-2 py-1">
                    <Button type="button" variant="ghost" size="icon" aria-label="Bold" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => wrapSelectionWithTag(mandatoryRefs.current[idx] || null, sec.state.content || '', (v) => sec.setter({ ...sec.state, content: v }), 'b')}>
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Italic" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => wrapSelectionWithTag(mandatoryRefs.current[idx] || null, sec.state.content || '', (v) => sec.setter({ ...sec.state, content: v }), 'i')}>
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Underline" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => wrapSelectionWithTag(mandatoryRefs.current[idx] || null, sec.state.content || '', (v) => sec.setter({ ...sec.state, content: v }), 'u')}>
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea ref={(el) => { mandatoryRefs.current[idx] = el }} value={sec.state.content} onChange={e => sec.setter({ ...sec.state, content: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="mb-2 ml-2 block">Custom Sections</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>Add Section</Button>
            </div>
            {customSections.map((section, idx) => (
              <div key={idx} className="border rounded-md p-3 space-y-3">
                <div>
                  <Label htmlFor={`sec-title-${idx}`} className="mb-2 ml-2 block">Title</Label>
                  <Input id={`sec-title-${idx}`} value={section.title} onChange={(e) => updateSection(idx, 'title', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`sec-sub-${idx}`} className="mb-2 ml-2 block">Subtitle (optional)</Label>
                  <Input id={`sec-sub-${idx}`} value={section.subtitle ?? ''} onChange={(e) => updateSection(idx, 'subtitle', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor={`sec-icon-${idx}`} className="mb-2 ml-2 block">Icon (lucide name, e.g., Gift)</Label>
                  <Input id={`sec-icon-${idx}`} value={section.icon ?? ''} onChange={(e) => updateSection(idx, 'icon', e.target.value)} />
                  <p className="text-xs text-muted-foreground mt-1">
                    To browse icon names, visit{' '}
                    <a
                      href="https://lucide.dev/icons"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Lucide icons
                    </a>.
                  </p>
                </div>
                <div>
                  <Label htmlFor={`sec-content-${idx}`} className="mb-2 ml-2 block">Content</Label>
                  <div className="inline-flex items-center gap-1 mb-1 rounded-md border border-border bg-muted/40 px-2 py-1">
                    <Button type="button" variant="ghost" size="icon" aria-label="Bold" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => wrapSelectionWithTag(customRefs.current[idx] || null, section.content || '', (v) => updateSection(idx, 'content', v), 'b')}>
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Italic" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => wrapSelectionWithTag(customRefs.current[idx] || null, section.content || '', (v) => updateSection(idx, 'content', v), 'i')}>
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Underline" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => wrapSelectionWithTag(customRefs.current[idx] || null, section.content || '', (v) => updateSection(idx, 'content', v), 'u')}>
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea id={`sec-content-${idx}`} ref={(el) => { customRefs.current[idx] = el }} value={section.content} onChange={(e) => updateSection(idx, 'content', e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeSection(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">{initialData ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
