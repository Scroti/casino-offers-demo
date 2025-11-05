import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './controllers/contact.controller';
import { ContactService } from './services/contact.service';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { CommonsModule } from '@offers/commons';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contact.name,
        schema: ContactSchema,
      },
    ]),
    CommonsModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}

