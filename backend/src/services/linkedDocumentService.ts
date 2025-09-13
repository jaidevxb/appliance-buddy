import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../config/database.js';
import { linkedDocuments } from '../models/schema.js';
import { LinkedDocumentData, LinkedDocumentUpdateData } from '../types/api.js';

export class LinkedDocumentService {
  constructor(private db: Database) {}

  async getLinkedDocumentsByApplianceId(applianceId: string) {
    return await this.db.query.linkedDocuments.findMany({
      where: eq(linkedDocuments.applianceId, applianceId),
      orderBy: [desc(linkedDocuments.createdAt)],
    });
  }

  async getLinkedDocumentById(applianceId: string, documentId: string) {
    return await this.db.query.linkedDocuments.findFirst({
      where: and(
        eq(linkedDocuments.id, documentId),
        eq(linkedDocuments.applianceId, applianceId)
      ),
    });
  }

  async createLinkedDocument(applianceId: string, data: LinkedDocumentData) {
    const [document] = await this.db
      .insert(linkedDocuments)
      .values({
        ...data,
        applianceId,
        updatedAt: new Date(),
      })
      .returning();

    return document;
  }

  async updateLinkedDocument(applianceId: string, documentId: string, data: LinkedDocumentUpdateData) {
    const [document] = await this.db
      .update(linkedDocuments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(
        eq(linkedDocuments.id, documentId),
        eq(linkedDocuments.applianceId, applianceId)
      ))
      .returning();

    return document || null;
  }

  async deleteLinkedDocument(applianceId: string, documentId: string) {
    const [deleted] = await this.db
      .delete(linkedDocuments)
      .where(and(
        eq(linkedDocuments.id, documentId),
        eq(linkedDocuments.applianceId, applianceId)
      ))
      .returning();

    return !!deleted;
  }
}