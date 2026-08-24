export type MaintenanceStatus = "NORMAL" | "APPROACHING" | "OVERDUE" | "NOT_PLANNED";

export interface Company { id: string; name: string }
export interface Unit { id: string; name: string; companyId: string }

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  vehicleType: string;
  currentMileage: number;
  ownerType: "PERSON" | "COMPANY";
  registeredOwner: string;
  companyId: string;
  unitId: string;
  hasHgs: boolean;
  lastMaintenanceMileage: number | null;
  nextMaintenanceMileage: number | null;
  note: string | null;
  company: Pick<Company, "id" | "name">;
  unit: Pick<Unit, "id" | "name">;
  maintenanceStatus: MaintenanceStatus;
  remainingMaintenanceMileage: number | null;
}

export interface VehicleListResponse {
  data: Vehicle[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
