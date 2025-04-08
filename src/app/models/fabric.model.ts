import { DocumentReference, Timestamp } from 'firebase/firestore';

export class Fabric {
  constructor(init?: Partial<Fabric>) {
    Object.assign(this, init);
  }
  id: string;
  lastUpdated: Timestamp;
  fiberRefs: DocumentReference<any>[];
  materialRef: DocumentReference;
  fabricPatternRef: DocumentReference;
  colorRefs: DocumentReference<any>[];
  width: number;
  length: number;
  scrap: boolean;
  sourceRef: DocumentReference;
  price: number;
  purchaseDate: Date;
  public get yardage(): number {
    return Math.floor(this.length / 36);
  }
  public get inches(): number {
    return this.length % 36;
  }
}
