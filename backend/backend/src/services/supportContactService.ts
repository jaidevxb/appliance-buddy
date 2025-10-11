import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../config/database';
import { supportContacts } from '../models/schema';
import { SupportContactData, SupportContactUpdateData } from '../types/api';

export class SupportContactService {
  constructor(private db: Database) {}

  async getSupportContactsByApplianceId(applianceId: string) {
    return await this.db.query.supportContacts.findMany({
      where: eq(supportContacts.applianceId, applianceId),
      orderBy: [desc(supportContacts.createdAt)],
    });
  }

  async getSupportContactById(applianceId: string, contactId: string) {
    return await this.db.query.supportContacts.findFirst({
      where: and(
        eq(supportContacts.id, contactId),
        eq(supportContacts.applianceId, applianceId)
      ),
    });
  }

  async createSupportContact(applianceId: string, data: SupportContactData) {
    const [contact] = await this.db
      .insert(supportContacts)
      .values({
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        website: data.website,
        notes: data.notes,
        applianceId,
        updatedAt: new Date(),
      })
      .returning();

    return contact;
  }

  async updateSupportContact(applianceId: string, contactId: string, data: SupportContactUpdateData) {
    const updateData: any = { updatedAt: new Date() };
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const [contact] = await this.db
      .update(supportContacts)
      .set(updateData)
      .where(and(
        eq(supportContacts.id, contactId),
        eq(supportContacts.applianceId, applianceId)
      ))
      .returning();

    return contact || null;
  }

  async deleteSupportContact(applianceId: string, contactId: string) {
    const [deleted] = await this.db
      .delete(supportContacts)
      .where(and(
        eq(supportContacts.id, contactId),
        eq(supportContacts.applianceId, applianceId)
      ))
      .returning();

    return !!deleted;
  }
}