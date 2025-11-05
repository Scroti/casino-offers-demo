import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact.schema';
import { CreateContactDto } from '../dtos/create-contact.dto';
import { EmailService } from '@offers/commons';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private readonly supportEmail: string;

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    this.supportEmail = this.configService.get<string>('SUPPORT_EMAIL') || 'support@playwiseguru.com';
  }

  async createContact(createContactDto: CreateContactDto, userId?: string): Promise<Contact & { _id: any }> {
    const contact = await this.contactModel.create({
      ...createContactDto,
      userId,
    });

    // Send notification email to support (non-blocking)
    this.sendSupportNotification(contact as any).catch((error) => {
      console.error('Failed to send support notification email:', error);
    });

    return contact as Contact & { _id: any };
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).lean();
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact as Contact;
  }

  async markAsRead(id: string): Promise<Contact> {
    return this.contactModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).lean();
  }

  async markAsResolved(id: string, response?: string): Promise<Contact> {
    return this.contactModel.findByIdAndUpdate(
      id,
      {
        isResolved: true,
        response,
        respondedAt: new Date(),
      },
      { new: true }
    ).lean();
  }

  private async sendSupportNotification(contact: Contact): Promise<void> {
    const categoryLabels: Record<string, string> = {
      general: 'General Inquiry',
      technical: 'Technical Support',
      billing: 'Billing Question',
      account: 'Account Issue',
      feedback: 'Feedback',
      other: 'Other',
    };

    const subject = `New Contact Form Submission: ${contact.subject}`;
    const message = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Category:</strong> ${categoryLabels[contact.category] || contact.category}</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e9ecef;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${contact.message}</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e9ecef;" />
      <p><em>Submitted on ${(contact as any).createdAt ? new Date((contact as any).createdAt).toLocaleString() : new Date().toLocaleString()}</em></p>
    `;

    try {
      await this.emailService.sendCustomEmail(
        this.supportEmail,
        subject,
        message,
      );
    } catch (error) {
      console.error('Failed to send support notification:', error);
      // Don't throw - contact was already saved
    }
  }
}

