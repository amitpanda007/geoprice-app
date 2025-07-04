import { LandArea } from './types';
export declare const sampleLandAreas: LandArea[];
export declare class LandDataService {
    getAllLandAreas(): LandArea[];
    getLandAreaById(id: string): LandArea | undefined;
    getLandAreasByType(type: LandArea['type']): LandArea[];
    searchLandAreas(query: string): LandArea[];
}
//# sourceMappingURL=data.d.ts.map