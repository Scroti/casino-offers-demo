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
import { MultiSelect } from '@/components/ui/multi-select';
import { COMMON_LANGUAGES } from '@/lib/constants/languages';
import { COMMON_CURRENCIES } from '@/lib/constants/currencies';
import { COMMON_PAYMENT_METHODS } from '@/lib/constants/payment-methods';
import { COMMON_GAME_PROVIDERS } from '@/lib/constants/game-providers';
import { COMMON_GAME_TYPES } from '@/lib/constants/game-types';
import { COMMON_COUNTRIES } from '@/lib/constants/countries';
import type { Casino } from '@/app/lib/data-access/models/casino.model';

interface CasinoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Casino | null;
  onSubmit: (data: Partial<Casino>) => void;
}

export function CasinoFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: CasinoFormModalProps) {
  // Basic Information
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [founded, setFounded] = React.useState(initialData?.founded ?? '');
  const [url, setUrl] = React.useState(initialData?.url ?? '');
  const [facebook, setFacebook] = React.useState(initialData?.facebook ?? '');
  const [logo, setLogo] = React.useState(initialData?.logo ?? '');
  const [image, setImage] = React.useState(initialData?.image ?? '');
  const [safetyIndex, setSafetyIndex] = React.useState<number | undefined>(initialData?.safetyIndex ?? undefined);
  const [countryFlag, setCountryFlag] = React.useState(initialData?.countryFlag ?? '');
  const [countryCode, setCountryCode] = React.useState(initialData?.countryCode ?? '');
  const [bonusText, setBonusText] = React.useState(initialData?.bonusText ?? '');
  const [bonusSubtext, setBonusSubtext] = React.useState(initialData?.bonusSubtext ?? '');
  const [isExclusive, setIsExclusive] = React.useState(initialData?.isExclusive ?? false);
  const [visitUrl, setVisitUrl] = React.useState(initialData?.visitUrl ?? '');
  
  // Company Information
  const [affiliateSoftware, setAffiliateSoftware] = React.useState(initialData?.affiliateSoftware ?? '');
  const [license, setLicense] = React.useState(initialData?.license ?? '');
  const [owner, setOwner] = React.useState(initialData?.owner ?? '');
  const [companyAddress, setCompanyAddress] = React.useState(initialData?.companyAddress ?? '');
  const [wagering, setWagering] = React.useState(initialData?.wagering ?? '');
  const [partners, setPartners] = React.useState(initialData?.partners ?? '');
  const [version, setVersion] = React.useState(initialData?.version ?? '');
  
  // Features - strip _id when loading from initialData
  const [features, setFeatures] = React.useState<Array<{ type: 'positive' | 'negative' | 'neutral'; text: string }>>(
    initialData?.features ? initialData.features.map(({ _id, ...feature }: any) => feature) : []
  );
  const [advantages, setAdvantages] = React.useState<string[]>(initialData?.advantages ?? []);
  
  // Accessibility & Mobile
  const [accessibility, setAccessibility] = React.useState<string[]>(initialData?.accessibility ?? []);
  const [mobileApplication, setMobileApplication] = React.useState(initialData?.mobileApplication ?? false);
  
  // Countries
  const [restrictedCountries, setRestrictedCountries] = React.useState<string[]>(initialData?.restrictedCountries ?? []);
  const [availableCountries, setAvailableCountries] = React.useState<string[]>(initialData?.availableCountries ?? []);
  
  // Languages - using MultiSelect
  const [websiteLanguages, setWebsiteLanguages] = React.useState<string[]>(initialData?.websiteLanguages ?? []);
  const [liveChatLanguages, setLiveChatLanguages] = React.useState<string[]>(initialData?.liveChatLanguages ?? []);
  const [customerSupportLanguages, setCustomerSupportLanguages] = React.useState<string[]>(initialData?.customerSupportLanguages ?? []);
  const [siteLanguages, setSiteLanguages] = React.useState<string[]>(initialData?.siteLanguages ?? []);
  const [phoneLanguages, setPhoneLanguages] = React.useState<string[]>(initialData?.phoneLanguages ?? []);
  const [emailLanguages, setEmailLanguages] = React.useState<string[]>(initialData?.emailLanguages ?? []);
  
  // Currencies - using MultiSelect
  const [currencies, setCurrencies] = React.useState<string[]>(initialData?.currencies ?? []);
  
  // Payment methods - using MultiSelect
  const [paymentMethods, setPaymentMethods] = React.useState<string[]>(
    initialData?.paymentMethods?.map(pm => pm.name) ?? []
  );
  const [depositMethods, setDepositMethods] = React.useState<string[]>(initialData?.depositMethods ?? []);
  const [withdrawalMethods, setWithdrawalMethods] = React.useState<string[]>(initialData?.withdrawalMethods ?? []);
  
  // Payment Details
  const [minimalDeposit, setMinimalDeposit] = React.useState(initialData?.minimalDeposit ?? '');
  const [minimalPayout, setMinimalPayout] = React.useState(initialData?.minimalPayout ?? '');
  const [maxWithdrawalLimitPerMonth, setMaxWithdrawalLimitPerMonth] = React.useState(initialData?.maxWithdrawalLimitPerMonth ?? '');
  const [withdrawalTime, setWithdrawalTime] = React.useState(initialData?.withdrawalTime ?? '');
  const [withdrawWithActiveBonus, setWithdrawWithActiveBonus] = React.useState(initialData?.withdrawWithActiveBonus ?? false);
  const [withdrawFees, setWithdrawFees] = React.useState(initialData?.withdrawFees ?? '');
  
  // Game providers - using MultiSelect
  const [gameProviders, setGameProviders] = React.useState<string[]>(initialData?.gameProviders ?? []);
  
  // Games Information
  const [gamesAmount, setGamesAmount] = React.useState(initialData?.gamesAmount ?? '');
  const [slotGames, setSlotGames] = React.useState(initialData?.slotGames ?? '');
  const [jackpotGames, setJackpotGames] = React.useState(initialData?.jackpotGames ?? '');
  const [videoPokerGames, setVideoPokerGames] = React.useState(initialData?.videoPokerGames ?? '');
  const [scratchGames, setScratchGames] = React.useState(initialData?.scratchGames ?? '');
  const [bingoGames, setBingoGames] = React.useState(initialData?.bingoGames ?? '');
  const [liveGamesAmount, setLiveGamesAmount] = React.useState(initialData?.liveGamesAmount ?? '');
  const [sportsBetting, setSportsBetting] = React.useState(initialData?.sportsBetting ?? false);
  const [liveBetting, setLiveBetting] = React.useState(initialData?.liveBetting ?? false);
  const [virtualSportsBetting, setVirtualSportsBetting] = React.useState(initialData?.virtualSportsBetting ?? false);
  
  // Available games (for display)
  const [availableGames, setAvailableGames] = React.useState<Array<{ name: string; icon?: string; available: boolean }>>(
    initialData?.availableGames ? initialData.availableGames.map(({ _id, ...game }: any) => game) : []
  );
  
  // Support Information
  const [workingHours, setWorkingHours] = React.useState(initialData?.workingHours ?? '');
  const [contactInfo, setContactInfo] = React.useState(initialData?.contactInfo ?? '');
  const [averageContactTime, setAverageContactTime] = React.useState(initialData?.averageContactTime ?? '');

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '');
      setFounded(initialData.founded ?? '');
      setUrl(initialData.url ?? '');
      setFacebook(initialData.facebook ?? '');
      setLogo(initialData.logo ?? '');
      setImage(initialData.image ?? '');
      setSafetyIndex(initialData.safetyIndex ?? undefined);
      setCountryFlag(initialData.countryFlag ?? '');
      setCountryCode(initialData.countryCode ?? '');
      setBonusText(initialData.bonusText ?? '');
      setBonusSubtext(initialData.bonusSubtext ?? '');
      setIsExclusive(initialData.isExclusive ?? false);
      setVisitUrl(initialData.visitUrl ?? '');
      setAffiliateSoftware(initialData.affiliateSoftware ?? '');
      setLicense(initialData.license ?? '');
      setOwner(initialData.owner ?? '');
      setCompanyAddress(initialData.companyAddress ?? '');
      setWagering(initialData.wagering ?? '');
      setPartners(initialData.partners ?? '');
      setVersion(initialData.version ?? '');
      setFeatures(initialData.features ? initialData.features.map(({ _id, ...feature }: any) => feature) : []);
      setAdvantages(initialData.advantages ?? []);
      setAccessibility(initialData.accessibility ?? []);
      setMobileApplication(initialData.mobileApplication ?? false);
      setRestrictedCountries(initialData.restrictedCountries ?? []);
      setAvailableCountries(initialData.availableCountries ?? []);
      setWebsiteLanguages(initialData.websiteLanguages ?? []);
      setLiveChatLanguages(initialData.liveChatLanguages ?? []);
      setCustomerSupportLanguages(initialData.customerSupportLanguages ?? []);
      setSiteLanguages(initialData.siteLanguages ?? []);
      setPhoneLanguages(initialData.phoneLanguages ?? []);
      setEmailLanguages(initialData.emailLanguages ?? []);
      setCurrencies(initialData.currencies ?? []);
      setPaymentMethods(initialData.paymentMethods?.map(pm => pm.name) ?? []);
      setDepositMethods(initialData.depositMethods ?? []);
      setWithdrawalMethods(initialData.withdrawalMethods ?? []);
      setMinimalDeposit(initialData.minimalDeposit ?? '');
      setMinimalPayout(initialData.minimalPayout ?? '');
      setMaxWithdrawalLimitPerMonth(initialData.maxWithdrawalLimitPerMonth ?? '');
      setWithdrawalTime(initialData.withdrawalTime ?? '');
      setWithdrawWithActiveBonus(initialData.withdrawWithActiveBonus ?? false);
      setWithdrawFees(initialData.withdrawFees ?? '');
      setGameProviders(initialData.gameProviders ?? []);
      setGamesAmount(initialData.gamesAmount ?? '');
      setSlotGames(initialData.slotGames ?? '');
      setJackpotGames(initialData.jackpotGames ?? '');
      setVideoPokerGames(initialData.videoPokerGames ?? '');
      setScratchGames(initialData.scratchGames ?? '');
      setBingoGames(initialData.bingoGames ?? '');
      setLiveGamesAmount(initialData.liveGamesAmount ?? '');
      setSportsBetting(initialData.sportsBetting ?? false);
      setLiveBetting(initialData.liveBetting ?? false);
      setVirtualSportsBetting(initialData.virtualSportsBetting ?? false);
      setAvailableGames(initialData.availableGames ? initialData.availableGames.map(({ _id, ...game }: any) => game) : []);
      setWorkingHours(initialData.workingHours ?? '');
      setContactInfo(initialData.contactInfo ?? '');
      setAverageContactTime(initialData.averageContactTime ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      founded,
      url,
      facebook,
      logo,
      image,
      safetyIndex,
      countryFlag,
      countryCode,
      bonusText,
      bonusSubtext,
      isExclusive,
      visitUrl,
      affiliateSoftware,
      license,
      owner,
      companyAddress,
      wagering,
      partners,
      version,
      // Strip _id from features before sending to API
      features: features.map(({ _id, ...feature }: any) => feature),
      advantages,
      accessibility,
      mobileApplication,
      restrictedCountries,
      availableCountries,
      websiteLanguages,
      liveChatLanguages,
      customerSupportLanguages,
      siteLanguages,
      phoneLanguages,
      emailLanguages,
      currencies,
      paymentMethods: paymentMethods.map(name => ({ name })),
      depositMethods,
      withdrawalMethods,
      minimalDeposit,
      minimalPayout,
      maxWithdrawalLimitPerMonth,
      withdrawalTime,
      withdrawWithActiveBonus,
      withdrawFees,
      gameProviders,
      gamesAmount,
      slotGames,
      jackpotGames,
      videoPokerGames,
      scratchGames,
      bingoGames,
      liveGamesAmount,
      sportsBetting,
      liveBetting,
      virtualSportsBetting,
      availableGames: availableGames.map(({ _id, ...game }) => game),
      workingHours,
      contactInfo,
      averageContactTime,
    });
  };

  const addFeature = () => {
    setFeatures([...features, { type: 'positive', text: '' }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: 'type' | 'text', value: string | 'positive' | 'negative' | 'neutral') => {
    setFeatures(features.map((f, i) => i === index ? { ...f, [field]: value } : f));
  };

  const addAdvantage = () => {
    setAdvantages([...advantages, '']);
  };

  const removeAdvantage = (index: number) => {
    setAdvantages(advantages.filter((_, i) => i !== index));
  };

  const updateAdvantage = (index: number, value: string) => {
    setAdvantages(advantages.map((a, i) => i === index ? value : a));
  };

  const addGame = () => {
    const gameTypes = COMMON_GAME_TYPES.filter(gt => !availableGames.some(ag => ag.name === gt));
    if (gameTypes.length > 0) {
      setAvailableGames([...availableGames, { name: gameTypes[0], available: true }]);
    }
  };

  const removeGame = (index: number) => {
    setAvailableGames(availableGames.filter((_, i) => i !== index));
  };

  const toggleGameAvailability = (index: number) => {
    setAvailableGames(availableGames.map((g, i) => i === index ? { ...g, available: !g.available } : g));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-5xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Casino' : 'Add Casino'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div>
              <Label htmlFor="casino-name">Name *</Label>
              <Input id="casino-name" required value={name} onChange={e => setName(e.target.value)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="founded">Founded</Label>
                <Input id="founded" value={founded} onChange={e => setFounded(e.target.value)} placeholder="e.g., 10/18/2018" />
              </div>
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input id="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input id="facebook" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label htmlFor="visit-url">Visit URL</Label>
                <Input id="visit-url" value={visitUrl} onChange={e => setVisitUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="casino-logo">Logo URL</Label>
                <Input id="casino-logo" value={logo} onChange={e => setLogo(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="casino-image">Image URL</Label>
                <Input id="casino-image" value={image} onChange={e => setImage(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="safety-index">Safety Index</Label>
                <Input id="safety-index" type="number" step="0.1" value={safetyIndex ?? ''} onChange={e => setSafetyIndex(e.target.value ? Number(e.target.value) : undefined)} />
              </div>
              <div>
                <Label htmlFor="country-flag">Country Flag</Label>
                <Input id="country-flag" value={countryFlag} onChange={e => setCountryFlag(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="country-code">Country Code</Label>
                <Input id="country-code" value={countryCode} onChange={e => setCountryCode(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="bonus-text">Bonus Text</Label>
              <Input id="bonus-text" value={bonusText} onChange={e => setBonusText(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bonus-subtext">Bonus Subtext</Label>
              <Input id="bonus-subtext" value={bonusSubtext} onChange={e => setBonusSubtext(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="is-exclusive" checked={isExclusive} onCheckedChange={(checked) => setIsExclusive(checked === true)} />
              <Label htmlFor="is-exclusive">Exclusive</Label>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" value={owner} onChange={e => setOwner(e.target.value)} placeholder="e.g., NovaForge LTD" />
              </div>
              <div>
                <Label htmlFor="license">License</Label>
                <Input id="license" value={license} onChange={e => setLicense(e.target.value)} placeholder="e.g., ANJOUAN" />
              </div>
            </div>
            <div>
              <Label htmlFor="company-address">Company Address</Label>
              <Textarea id="company-address" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="affiliate-software">Affiliate Software</Label>
                <Input id="affiliate-software" value={affiliateSoftware} onChange={e => setAffiliateSoftware(e.target.value)} placeholder="e.g., Mate Affiliates" />
              </div>
              <div>
                <Label htmlFor="partners">Partners</Label>
                <Input id="partners" value={partners} onChange={e => setPartners(e.target.value)} placeholder="e.g., iGate" />
              </div>
              <div>
                <Label htmlFor="version">Version</Label>
                <Input id="version" value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g., V3" />
              </div>
            </div>
            <div>
              <Label htmlFor="wagering">Wagering</Label>
              <Input id="wagering" value={wagering} onChange={e => setWagering(e.target.value)} placeholder="e.g., x40" />
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Accessibility</h3>
            <div>
              <Label>Accessibility</Label>
              <MultiSelect
                options={['Desktop', 'Mobile', 'Tablet']}
                selected={accessibility}
                onChange={setAccessibility}
                placeholder="Select accessibility options..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="mobile-application" checked={mobileApplication} onCheckedChange={(checked) => setMobileApplication(checked === true)} />
              <Label htmlFor="mobile-application">Has Mobile Application</Label>
            </div>
          </div>

          {/* Countries */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Countries</h3>
            <div>
              <Label>Restricted Countries</Label>
              <MultiSelect
                options={COMMON_COUNTRIES}
                selected={restrictedCountries}
                onChange={setRestrictedCountries}
                placeholder="Select restricted countries..."
              />
            </div>
            <div>
              <Label>Available Countries</Label>
              <MultiSelect
                options={COMMON_COUNTRIES}
                selected={availableCountries}
                onChange={setAvailableCountries}
                placeholder="Select available countries..."
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Languages</h3>
            <div>
              <Label>Website Languages</Label>
              <MultiSelect
                options={COMMON_LANGUAGES}
                selected={websiteLanguages}
                onChange={setWebsiteLanguages}
                placeholder="Select website languages..."
              />
            </div>
            <div>
              <Label>Site Languages</Label>
              <MultiSelect
                options={COMMON_LANGUAGES}
                selected={siteLanguages}
                onChange={setSiteLanguages}
                placeholder="Select site languages..."
              />
            </div>
            <div>
              <Label>Live Chat Languages</Label>
              <MultiSelect
                options={COMMON_LANGUAGES}
                selected={liveChatLanguages}
                onChange={setLiveChatLanguages}
                placeholder="Select live chat languages..."
              />
            </div>
            <div>
              <Label>Customer Support Languages</Label>
              <MultiSelect
                options={COMMON_LANGUAGES}
                selected={customerSupportLanguages}
                onChange={setCustomerSupportLanguages}
                placeholder="Select customer support languages..."
              />
            </div>
            <div>
              <Label>Phone Languages</Label>
              <MultiSelect
                options={COMMON_LANGUAGES}
                selected={phoneLanguages}
                onChange={setPhoneLanguages}
                placeholder="Select phone languages..."
              />
            </div>
            <div>
              <Label>Email Languages</Label>
              <MultiSelect
                options={COMMON_LANGUAGES}
                selected={emailLanguages}
                onChange={setEmailLanguages}
                placeholder="Select email languages..."
              />
            </div>
          </div>

          {/* Currencies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Currencies</h3>
            <div>
              <Label>Supported Currencies</Label>
              <MultiSelect
                options={COMMON_CURRENCIES}
                selected={currencies}
                onChange={setCurrencies}
                placeholder="Select currencies..."
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <div>
              <Label>Payment Methods (Display)</Label>
              <MultiSelect
                options={COMMON_PAYMENT_METHODS}
                selected={paymentMethods}
                onChange={setPaymentMethods}
                placeholder="Select payment methods..."
              />
            </div>
            <div>
              <Label>Deposit Methods</Label>
              <MultiSelect
                options={COMMON_PAYMENT_METHODS}
                selected={depositMethods}
                onChange={setDepositMethods}
                placeholder="Select deposit methods..."
              />
            </div>
            <div>
              <Label>Withdrawal Methods</Label>
              <MultiSelect
                options={COMMON_PAYMENT_METHODS}
                selected={withdrawalMethods}
                onChange={setWithdrawalMethods}
                placeholder="Select withdrawal methods..."
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minimal-deposit">Minimal Deposit</Label>
                <Input id="minimal-deposit" value={minimalDeposit} onChange={e => setMinimalDeposit(e.target.value)} placeholder="e.g., 10EUR" />
              </div>
              <div>
                <Label htmlFor="minimal-payout">Minimal Payout</Label>
                <Input id="minimal-payout" value={minimalPayout} onChange={e => setMinimalPayout(e.target.value)} placeholder="e.g., 10EUR" />
              </div>
            </div>
            <div>
              <Label htmlFor="max-withdrawal-limit">Max Withdrawal Limit Per Month</Label>
              <Textarea id="max-withdrawal-limit" value={maxWithdrawalLimitPerMonth} onChange={e => setMaxWithdrawalLimitPerMonth(e.target.value)} rows={2} placeholder="e.g., 7 000 EUR per month to 20 000 EUR per month" />
            </div>
            <div>
              <Label htmlFor="withdrawal-time">Withdrawal Time</Label>
              <Input id="withdrawal-time" value={withdrawalTime} onChange={e => setWithdrawalTime(e.target.value)} placeholder="e.g., 3 business days" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="withdraw-with-active-bonus" checked={withdrawWithActiveBonus} onCheckedChange={(checked) => setWithdrawWithActiveBonus(checked === true)} />
              <Label htmlFor="withdraw-with-active-bonus">Can Withdraw With Active Bonus</Label>
            </div>
            <div>
              <Label htmlFor="withdraw-fees">Withdraw Fees</Label>
              <Textarea id="withdraw-fees" value={withdrawFees} onChange={e => setWithdrawFees(e.target.value)} rows={2} placeholder="e.g., Only in exceptional cases" />
            </div>
          </div>

          {/* Game Providers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Game Providers</h3>
            <div>
              <Label>Game Providers</Label>
              <MultiSelect
                options={COMMON_GAME_PROVIDERS}
                selected={gameProviders}
                onChange={setGameProviders}
                placeholder="Select game providers..."
              />
            </div>
          </div>

          {/* Games Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Games Information</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="games-amount">Games Amount</Label>
                <Input id="games-amount" value={gamesAmount} onChange={e => setGamesAmount(e.target.value)} placeholder="e.g., 3000+" />
              </div>
              <div>
                <Label htmlFor="slot-games">Slot Games</Label>
                <Input id="slot-games" value={slotGames} onChange={e => setSlotGames(e.target.value)} placeholder="e.g., 2000+" />
              </div>
              <div>
                <Label htmlFor="jackpot-games">Jackpot Games</Label>
                <Input id="jackpot-games" value={jackpotGames} onChange={e => setJackpotGames(e.target.value)} placeholder="e.g., 75+" />
              </div>
              <div>
                <Label htmlFor="video-poker-games">Video Poker Games</Label>
                <Input id="video-poker-games" value={videoPokerGames} onChange={e => setVideoPokerGames(e.target.value)} placeholder="e.g., 60+" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="scratch-games">Scratch Games</Label>
                <Input id="scratch-games" value={scratchGames} onChange={e => setScratchGames(e.target.value)} placeholder="e.g., 10" />
              </div>
              <div>
                <Label htmlFor="bingo-games">Bingo Games</Label>
                <Input id="bingo-games" value={bingoGames} onChange={e => setBingoGames(e.target.value)} placeholder="e.g., 10" />
              </div>
              <div>
                <Label htmlFor="live-games-amount">Live Games Amount</Label>
                <Input id="live-games-amount" value={liveGamesAmount} onChange={e => setLiveGamesAmount(e.target.value)} placeholder="e.g., 100+" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="sports-betting" checked={sportsBetting} onCheckedChange={(checked) => setSportsBetting(checked === true)} />
                <Label htmlFor="sports-betting">Sports Betting</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="live-betting" checked={liveBetting} onCheckedChange={(checked) => setLiveBetting(checked === true)} />
                <Label htmlFor="live-betting">Live Betting</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="virtual-sports-betting" checked={virtualSportsBetting} onCheckedChange={(checked) => setVirtualSportsBetting(checked === true)} />
                <Label htmlFor="virtual-sports-betting">Virtual Sports Betting</Label>
              </div>
            </div>
          </div>

          {/* Available Games */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Games</h3>
            {availableGames.map((game, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input 
                  value={game.name} 
                  onChange={e => setAvailableGames(availableGames.map((g, i) => i === index ? { ...g, name: e.target.value } : g))} 
                  placeholder="Game name" 
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={game.available} 
                    onCheckedChange={() => toggleGameAvailability(index)} 
                    id={`game-${index}`}
                  />
                  <Label htmlFor={`game-${index}`} className="text-sm">Available</Label>
                </div>
                <Button type="button" variant="outline" onClick={() => removeGame(index)}>Remove</Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={addGame}>Add Game</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  const newGames = COMMON_GAME_TYPES
                    .filter(gt => !availableGames.some(ag => ag.name === gt))
                    .slice(0, 5)
                    .map(gt => ({ name: gt, available: true }));
                  setAvailableGames([...availableGames, ...newGames]);
                }}
              >
                Add Common Games
              </Button>
            </div>
          </div>

          {/* Support Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support Information</h3>
            <div>
              <Label htmlFor="working-hours">Working Hours</Label>
              <Input id="working-hours" value={workingHours} onChange={e => setWorkingHours(e.target.value)} placeholder="e.g., 24 / 7" />
            </div>
            <div>
              <Label htmlFor="contact-info">Contact Info</Label>
              <Textarea id="contact-info" value={contactInfo} onChange={e => setContactInfo(e.target.value)} rows={2} placeholder="e.g., support@zetcasino.com | tel: +35627780669" />
            </div>
            <div>
              <Label htmlFor="average-contact-time">Average Contact Time</Label>
              <Input id="average-contact-time" value={averageContactTime} onChange={e => setAverageContactTime(e.target.value)} placeholder="e.g., Instant livechat" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <select 
                  value={feature.type} 
                  onChange={e => updateFeature(index, 'type', e.target.value as 'positive' | 'negative' | 'neutral')}
                  className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                </select>
                <Input 
                  value={feature.text} 
                  onChange={e => updateFeature(index, 'text', e.target.value)} 
                  placeholder="Feature text" 
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => removeFeature(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFeature}>Add Feature</Button>
          </div>

          {/* Advantages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advantages</h3>
            {advantages.map((advantage, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  value={advantage} 
                  onChange={e => updateAdvantage(index, e.target.value)} 
                  placeholder="Advantage text" 
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => removeAdvantage(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAdvantage}>Add Advantage</Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
