export interface FabricModel {
    fiber: string;
    material: string;
    pattern: string;
    color: string;
    source: string;
    width: number;
    length: number;
    lengthType: 'yd.' | 'in.';
    scrap: boolean;
}