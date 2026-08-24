export type ServiceType = "MAINTENANCE" | "REPAIR";

export interface ServiceRecord {
  id: string;
  type: ServiceType;
  serviceDate: string;
  mileageAtService: number;
  performedWork: string;
  provider: string | null;
  totalCost: number;
  note: string | null;
  nextMaintenanceMileage: number | null;
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    company: { id: string; name: string };
    unit: { id: string; name: string };
  };
  replacedParts: { id: string; name: string; note: string | null }[];
}

export interface ServiceRecordListResponse {
  data: ServiceRecord[];
  summary: { total: number; maintenanceCount: number; repairCount: number; totalCost: number };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
