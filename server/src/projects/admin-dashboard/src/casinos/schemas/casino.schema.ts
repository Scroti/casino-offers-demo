import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CasinoDocument = Casino & Document;

@Schema({ timestamps: true })
export class Casino {
  // General Information
  @Prop({ required: true })
  name: string; // Brand name

  @Prop()
  founded?: string; // Date when casino was founded (e.g., "10/18/2018")

  @Prop()
  url?: string; // Website URL

  @Prop()
  facebook?: string; // Facebook page URL

  @Prop({ type: [String], default: [] })
  advantages?: string[]; // List of advantages/features as text (from "List of advantages")

  @Prop()
  affiliateSoftware?: string; // e.g., "Mate Affiliates"

  @Prop()
  license?: string; // e.g., "ANJOUAN"

  @Prop()
  owner?: string; // Company owner (e.g., "NovaForge LTD")

  @Prop()
  companyAddress?: string; // Full company address including registration number

  @Prop({ type: [String], default: [] })
  accessibility?: string[]; // e.g., ["Desktop", "mobile"]

  @Prop({ default: false })
  mobileApplication?: boolean; // Has mobile app (YES/NO)

  @Prop({ type: [String], default: [] })
  siteLanguages?: string[]; // Website languages (from "Site language")

  @Prop({ type: [String], default: [] })
  currencies?: string[]; // Supported currencies (from "Currency")

  @Prop({ type: [String], default: [] })
  restrictedCountries?: string[]; // Countries where casino is restricted

  @Prop({ type: [String], default: [] })
  availableCountries?: string[]; // Countries where casino is available

  @Prop()
  wagering?: string; // Wagering requirement, e.g., "x40"

  @Prop()
  partners?: string; // Partners information (e.g., "iGate")

  @Prop()
  version?: string; // Version info (e.g., "V3")

  // Display/UI fields
  @Prop()
  logo?: string;

  @Prop()
  image?: string;

  @Prop()
  safetyIndex?: number;

  @Prop()
  countryFlag?: string;

  @Prop()
  countryCode?: string;

  // Features/Pros & Cons (for display)
  @Prop({
    type: [
      {
        type: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
        text: { type: String, required: true },
      },
    ],
    default: [],
  })
  features?: Array<{
    type: 'positive' | 'negative' | 'neutral';
    text: string;
  }>;

  // Games Information
  @Prop({ type: [String], default: [] })
  gameProviders?: string[]; // List of game providers

  @Prop()
  gamesAmount?: string; // e.g., "3000+"

  @Prop()
  slotGames?: string; // e.g., "2000+"

  @Prop()
  jackpotGames?: string; // e.g., "75+"

  @Prop()
  videoPokerGames?: string; // e.g., "60+"

  @Prop()
  scratchGames?: string; // e.g., "10"

  @Prop()
  bingoGames?: string; // e.g., "10"

  @Prop()
  liveGamesAmount?: string; // e.g., "100+"

  @Prop({ default: false })
  sportsBetting?: boolean; // Has sports betting (N/A means false)

  @Prop({ default: false })
  liveBetting?: boolean; // Has live betting (N/A means false)

  @Prop({ default: false })
  virtualSportsBetting?: boolean; // Has virtual sports betting (N/A means false)

  // Available games (for display)
  @Prop({
    type: [
      {
        name: { type: String, required: true },
        icon: { type: String },
        available: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  availableGames?: Array<{
    name: string;
    icon?: string;
    available: boolean;
  }>;

  // Payment Information
  @Prop({ type: [String], default: [] })
  depositMethods?: string[]; // List of deposit methods

  @Prop({ type: [String], default: [] })
  withdrawalMethods?: string[]; // List of withdrawal methods

  @Prop()
  minimalDeposit?: string; // e.g., "10EUR" (from "Minimal deposit amount")

  @Prop()
  minimalPayout?: string; // e.g., "10EUR" (from "Minimal payout")

  @Prop()
  maxWithdrawalLimitPerMonth?: string; // e.g., "7 000 EUR per month to 20 000 EUR per month (depends on player status)"

  @Prop()
  withdrawalTime?: string; // e.g., "3 business days"

  @Prop({ default: false })
  withdrawWithActiveBonus?: boolean; // Can withdraw with active bonus (NO means false)

  @Prop()
  withdrawFees?: string; // Fee information (e.g., "Only in exceptional cases (i.e. wagering req. not met)")

  // Payment methods (for display)
  @Prop({
    type: [
      {
        name: { type: String, required: true },
      },
    ],
    default: [],
  })
  paymentMethods?: Array<{
    name: string;
  }>;

  // Support Information
  @Prop()
  workingHours?: string; // e.g., "24 / 7"

  @Prop()
  contactInfo?: string; // Email and phone (e.g., "support@zetcasino.com | tel: +35627780669")

  @Prop({ type: [String], default: [] })
  liveChatLanguages?: string[]; // Languages available in live chat (from "Live-Chat available languages")

  @Prop({ type: [String], default: [] })
  phoneLanguages?: string[]; // Languages available via phone (from "Phone available languages")

  @Prop({ type: [String], default: [] })
  emailLanguages?: string[]; // Languages available via email (from "E-Mail available languages")

  @Prop()
  averageContactTime?: string; // e.g., "Instant livechat" (from "Average contact time via chat")

  // Languages (for display - consolidated)
  @Prop({ type: [String], default: [] })
  websiteLanguages?: string[]; // Website languages (same as siteLanguages)

  @Prop({ type: [String], default: [] })
  customerSupportLanguages?: string[]; // Customer support languages

  // Bonus Information (Display)
  @Prop()
  bonusText?: string; // Main bonus text (for display)

  @Prop()
  bonusSubtext?: string; // Bonus subtext (for display)

  @Prop({ default: false })
  isExclusive?: boolean;

  // Actions
  @Prop()
  visitUrl?: string; // Visit casino URL

  @Prop()
  reviewUrl?: string; // Review page URL
}

export const CasinoSchema = SchemaFactory.createForClass(Casino);
