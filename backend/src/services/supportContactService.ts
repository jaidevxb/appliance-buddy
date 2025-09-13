import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../config/database.js';
import { supportContacts } from '../models/schema.js';
import { SupportContactData, SupportContactUpdateData } from '../types/api.js';

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
        ...data,
        applianceId,
        updatedAt: new Date(),
      })
      .returning();

    return contact;
  }

  async updateSupportContact(applianceId: string, contactId: string, data: SupportContactUpdateData) {
    const [contact] = await this.db
      .update(supportContacts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
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