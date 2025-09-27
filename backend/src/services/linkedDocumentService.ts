import { eq, and, desc } from 'drizzle-orm';
import { Database } from '../config/database';
import { linkedDocuments } from '../models/schema';
import { LinkedDocumentData, LinkedDocumentUpdateData } from '../types/api';

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
        title: data.title,
        url: data.url,
        applianceId,
        updatedAt: new Date(),
      })
      .returning();

    return document;
  }

  async updateLinkedDocument(applianceId: string, documentId: string, data: LinkedDocumentUpdateData) {
    const updateData: any = { updatedAt: new Date() };
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.url !== undefined) updateData.url = data.url;

    const [document] = await this.db
      .update(linkedDocuments)
      .set(updateData)
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