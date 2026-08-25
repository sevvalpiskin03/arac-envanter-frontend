export interface MaintenanceAlert {
  vehicleId: string; plate: string; brand: string; model: string;
  currentMileage: number; nextMaintenanceMileage: number; remainingMileage: number;
  status: "APPROACHING" | "OVERDUE";
  company: { id: string; name: string }; unit: { id: string; name: string };
}
export interface NotificationSettings { id: string; warningMileageThreshold: number; emailEnabled: boolean; recipientEmails: string[] }
export interface MaintenanceAlertResponse {
  data: MaintenanceAlert[];
  allMaintenance: MaintenanceAlert[];
  summary: { total: number; approaching: number; overdue: number };
}
