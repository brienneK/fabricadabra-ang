import { Source } from '@models/source.model';

export interface SourceServiceInterface {
  getUserSources(userId: string): void;
  addSource(userId: string, source: Partial<Source>): Promise<any>;
  updateSource(
    userId: string,
    sourceId: string,
    source: Partial<Source>
  ): Promise<void>;
  deleteSource(userId: string, sourceId: string): Promise<void>;
}
