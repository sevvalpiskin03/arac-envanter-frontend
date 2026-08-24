"use client";

import {
  Building2,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Company, MaintenanceStatus, Unit, VehicleListResponse } from "@/types/vehicle";

const emptyList: VehicleListResponse = {
  data: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
};

const statusLabels: Record<MaintenanceStatus, string> = {
  NORMAL: "Normal",
  APPROACHING: "Yaklaşıyor",
  OVERDUE: "Gecikmiş",
  NOT_PLANNED: "Planlanmadı",
};

export function VehicleInventory() {
  const [vehicles, setVehicles] = useState(emptyList);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [hgs, setHgs] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/companies").then((res) => res.json()).then((data: Company[]) => setCompanies(data));
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetch(`/api/companies/${companyId}/units`).then((res) => res.json()).then((data: Unit[]) => setUnits(data));
  }, [companyId]);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({ page: String(page), limit: "20" });
    if (search.trim()) query.set("search", search.trim());
    if (companyId) query.set("companyId", companyId);
    if (unitId) query.set("unitId", unitId);
    if (hgs) query.set("hasHgs", hgs);
    if (maintenance) query.set("maintenanceStatus", maintenance);

    try {
      const response = await fetch(`/api/vehicles?${query}`);
      if (response.ok) setVehicles((await response.json()) as VehicleListResponse);
    } finally {
      setLoading(false);
    }
  }, [companyId, hgs, maintenance, page, search, unitId]);

  useEffect(() => {
    const timer = setTimeout(() => void loadVehicles(), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadVehicles, refreshKey, search]);

  function clearFilters() {
    setSearch("");
    setCompanyId("");
    setUnitId("");
    setHgs("");
    setMaintenance("");
    setPage(1);
  }

  return (
    <div className="inventory-view">
      <header className="page-header">
        <div><span className="eyebrow">Filo yönetimi</span><h1>Araç Envanteri</h1><p>{vehicles.pagination.total} araç kayıtlı</p></div>
        <button className="primary-action" type="button" onClick={() => setModalOpen(true)}><Plus /> Yeni Araç Ekle</button>
      </header>

      <section className="inventory-panel">
        <div className="search-field"><Search aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Plaka, marka veya model ara…" aria-label="Araç ara" /></div>
        <div className="filter-row">
          <FilterSelect label="Şirket" value={companyId} onChange={(value) => { setCompanyId(value); setUnitId(""); setUnits([]); setPage(1); }} options={companies.map((item) => ({ value: item.id, label: item.name }))} />
          <FilterSelect label="Birim" value={unitId} onChange={(value) => { setUnitId(value); setPage(1); }} disabled={!companyId} options={units.map((item) => ({ value: item.id, label: item.name }))} />
          <FilterSelect label="HGS" value={hgs} onChange={(value) => { setHgs(value); setPage(1); }} options={[{ value: "true", label: "Var" }, { value: "false", label: "Yok" }]} />
          <FilterSelect label="Bakım durumu" value={maintenance} onChange={(value) => { setMaintenance(value); setPage(1); }} options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))} />
          <button className="clear-filter" type="button" onClick={clearFilters}><SlidersHorizontal /> Temizle</button>
        </div>

        <div className="inventory-title-row"><div><h2>Araç listesi</h2><p>Detayları görmek için araç kaydını seçin.</p></div><span>{loading ? "Yükleniyor…" : `${vehicles.pagination.total} kayıt`}</span></div>

        {vehicles.data.length ? (
          <>
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead><tr><th>Plaka / Araç</th><th>Şirket</th><th>Kullanan birim</th><th>HGS</th><th>Kilometre</th><th>Bakım durumu</th></tr></thead>
                <tbody>{vehicles.data.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td><strong>{vehicle.plate}</strong><small>{vehicle.brand} {vehicle.model} · {vehicle.modelYear}</small></td>
                    <td>{vehicle.company.name}</td><td>{vehicle.unit.name}</td>
                    <td><span className={`hgs-badge ${vehicle.hasHgs ? "yes" : "no"}`}>{vehicle.hasHgs ? "Var" : "Yok"}</span></td>
                    <td>{vehicle.currentMileage.toLocaleString("tr-TR")} km</td>
                    <td><MaintenanceBadge status={vehicle.maintenanceStatus} remaining={vehicle.remainingMaintenanceMileage} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="vehicle-card-list">{vehicles.data.map((vehicle) => (
              <article className="vehicle-mobile-card" key={vehicle.id}>
                <div className="vehicle-card-head"><span className="vehicle-card-icon"><CarFront /></span><div><strong>{vehicle.plate}</strong><small>{vehicle.brand} {vehicle.model}</small></div><MaintenanceBadge status={vehicle.maintenanceStatus} remaining={vehicle.remainingMaintenanceMileage} compact /></div>
                <div className="vehicle-card-facts"><span><Building2 />{vehicle.company.name}</span><span><Gauge />{vehicle.currentMileage.toLocaleString("tr-TR")} km</span></div>
              </article>
            ))}</div>
            <div className="pagination"><span>{vehicles.pagination.page} / {vehicles.pagination.totalPages} sayfa</span><div><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft /></button><button disabled={page >= vehicles.pagination.totalPages} onClick={() => setPage((value) => value + 1)}><ChevronRight /></button></div></div>
          </>
        ) : (
          <div className="empty-state"><span><CarFront /></span><h3>{loading ? "Araçlar yükleniyor" : "Araç bulunamadı"}</h3><p>{loading ? "Lütfen kısa süre bekleyin." : "Filtreleri temizleyin veya yeni bir araç ekleyin."}</p></div>
        )}
      </section>

      {modalOpen ? <VehicleModal companies={companies} onClose={() => setModalOpen(false)} onCreated={() => { setModalOpen(false); setRefreshKey((value) => value + 1); }} /> : null}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, disabled }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; disabled?: boolean }) {
  return <label className="filter-select"><span>{label}</span><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}><option value="">Tümü</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function MaintenanceBadge({ status, remaining, compact = false }: { status: MaintenanceStatus; remaining: number | null; compact?: boolean }) {
  const detail = remaining === null ? "" : remaining < 0 ? `${Math.abs(remaining).toLocaleString("tr-TR")} km geçti` : `${remaining.toLocaleString("tr-TR")} km kaldı`;
  return <span className={`maintenance-badge status-${status.toLowerCase()} ${compact ? "compact" : ""}`}><strong>{statusLabels[status]}</strong>{!compact && detail ? <small>{detail}</small> : null}</span>;
}

function VehicleModal({ companies, onClose, onCreated }: { companies: Company[]; onClose: () => void; onCreated: () => void }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    fetch(`/api/companies/${companyId}/units`).then((res) => res.json()).then((data: Unit[]) => setUnits(data));
  }, [companyId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    const numberOrUndefined = (name: string) => form.get(name) ? Number(form.get(name)) : undefined;
    const body = {
      plate: form.get("plate"), brand: form.get("brand"), model: form.get("model"), modelYear: Number(form.get("modelYear")), vehicleType: form.get("vehicleType"), currentMileage: Number(form.get("currentMileage")), ownerType: form.get("ownerType"), registeredOwner: form.get("registeredOwner"), companyId: form.get("companyId"), unitId: form.get("unitId"), hasHgs: form.get("hasHgs") === "true", lastMaintenanceMileage: numberOrUndefined("lastMaintenanceMileage"), nextMaintenanceMileage: numberOrUndefined("nextMaintenanceMileage"), note: form.get("note") || undefined,
    };
    try {
      const response = await fetch("/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = (await response.json()) as { message?: string | string[] };
      if (!response.ok) { setError(Array.isArray(result.message) ? result.message[0] : result.message ?? "Araç kaydedilemedi."); return; }
      onCreated();
    } catch { setError("Sunucuya ulaşılamadı."); } finally { setSaving(false); }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="vehicle-modal" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title">
        <header><div><span className="eyebrow">Araç envanteri</span><h2 id="vehicle-modal-title">Yeni Araç Ekle</h2><p>Araç ve bakım bilgilerini eksiksiz girin.</p></div><button type="button" onClick={onClose} aria-label="Pencereyi kapat"><X /></button></header>
        <form onSubmit={submit}>
          <div className="form-section"><h3>Araç özellikleri</h3><div className="vehicle-form-grid">
            <Field label="Plaka" name="plate" placeholder="34 ABC 123" required />
            <Field label="Marka" name="brand" placeholder="Ford" required />
            <Field label="Model" name="model" placeholder="Transit" required />
            <Field label="Model yılı" name="modelYear" type="number" placeholder="2022" required />
            <Field label="Araç türü" name="vehicleType" placeholder="Hafif Ticari" required />
            <Field label="Güncel kilometre" name="currentMileage" type="number" placeholder="84200" required />
          </div></div>
          <div className="form-section"><h3>Sahiplik ve kullanım</h3><div className="vehicle-form-grid">
            <label><span>Araç sahibi türü</span><select name="ownerType" required><option value="COMPANY">Şirket</option><option value="PERSON">Kişi</option></select></label>
            <Field label="Ruhsat sahibi kişi veya şirket" name="registeredOwner" required />
            <label><span>Bağlı olduğu şirket</span><select name="companyId" value={companyId} onChange={(e) => { setCompanyId(e.target.value); setUnits([]); }} required><option value="">Şirket seçin</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
            <label><span>Aracı kullanan birim</span><select name="unitId" required disabled={!companyId}><option value="">Birim seçin</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label>
            <label><span>HGS durumu</span><select name="hasHgs" required><option value="true">Var</option><option value="false">Yok</option></select></label>
          </div></div>
          <div className="form-section"><h3>Bakım bilgileri</h3><div className="vehicle-form-grid"><Field label="Son bakım kilometresi" name="lastMaintenanceMileage" type="number" /><Field label="Sonraki bakım kilometresi" name="nextMaintenanceMileage" type="number" /><label className="full-field"><span>Açıklama / not</span><textarea name="note" rows={3} /></label></div></div>
          {error ? <p className="form-error">{error}</p> : null}
          <footer><button type="button" className="secondary-action" onClick={onClose}>İptal</button><button className="primary-action" disabled={saving}>{saving ? "Kaydediliyor…" : "Aracı Kaydet"}</button></footer>
        </form>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return <label><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} min={type === "number" ? 0 : undefined} /></label>;
}
