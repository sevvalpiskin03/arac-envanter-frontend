"use client";

import { CalendarDays, ChevronLeft, ChevronRight, CircleDollarSign, Plus, Wrench, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { ServiceRecordListResponse, ServiceType } from "@/types/service-record";
import type { Company, Unit, Vehicle, VehicleListResponse } from "@/types/vehicle";

const emptyList: ServiceRecordListResponse = {
  data: [], summary: { total: 0, maintenanceCount: 0, repairCount: 0, totalCost: 0 },
  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
};

export function ServiceRecords() {
  const [records, setRecords] = useState(emptyList);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [type, setType] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { void fetch("/api/companies").then((r) => r.json()).then(setCompanies); }, []);
  const load = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({ page: String(page), limit: "20" });
    if (type) query.set("type", type);
    if (companyId) query.set("companyId", companyId);
    if (dateFrom) query.set("dateFrom", dateFrom);
    if (dateTo) query.set("dateTo", dateTo);
    try {
      const response = await fetch(`/api/service-records?${query}`);
      if (response.ok) setRecords(await response.json());
    } finally { setLoading(false); }
  }, [companyId, dateFrom, dateTo, page, type]);
  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load, refreshKey]);

  return <div className="inventory-view service-view">
    <header className="page-header">
      <div><span className="eyebrow">Filo yönetimi</span><h1>Bakım ve Tamir Kayıtları</h1><p>{records.summary.total} işlem kaydı ve maliyet takibi</p></div>
      <button className="primary-action" onClick={() => setModalOpen(true)}><Plus /> Yeni Kayıt Ekle</button>
    </header>

    <section className="service-summary">
      <Summary label="Tüm kayıtlar" value={records.summary.total.toLocaleString("tr-TR")} icon={<Wrench />} />
      <Summary label="Bakımlar" value={records.summary.maintenanceCount.toLocaleString("tr-TR")} accent="green" icon={<CalendarDays />} />
      <Summary label="Tamirler" value={records.summary.repairCount.toLocaleString("tr-TR")} accent="orange" icon={<Wrench />} />
      <Summary label="Toplam maliyet" value={formatMoney(records.summary.totalCost)} icon={<CircleDollarSign />} />
    </section>

    <section className="inventory-panel service-panel">
      <div className="filter-row service-filters">
        <Filter label="İşlem türü" value={type} onChange={(v) => { setType(v); setPage(1); }} options={[{value:"MAINTENANCE",label:"Bakım"},{value:"REPAIR",label:"Tamir"}]} />
        <Filter label="Şirket" value={companyId} onChange={(v) => { setCompanyId(v); setPage(1); }} options={companies.map((c) => ({value:c.id,label:c.name}))} />
        <label className="filter-select"><span>Başlangıç</span><input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} /></label>
        <label className="filter-select"><span>Bitiş</span><input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} /></label>
        <button className="clear-filter" onClick={() => { setType(""); setCompanyId(""); setDateFrom(""); setDateTo(""); setPage(1); }}>Temizle</button>
      </div>
      <div className="inventory-title-row"><div><h2>Tüm kayıtlar</h2><p>Son eklenen işlemler</p></div><span>{loading ? "Yükleniyor…" : `${records.pagination.total} kayıt`}</span></div>
      {records.data.length ? <>
        <div className="service-record-list">{records.data.map((record) => <article className={`service-record-card ${record.type.toLowerCase()}`} key={record.id}>
          <div className="record-top"><span className={`record-type ${record.type.toLowerCase()}`}>{record.type === "MAINTENANCE" ? "Bakım" : "Tamir"}</span><time>{new Date(record.serviceDate).toLocaleDateString("tr-TR")}</time><strong>{formatMoney(record.totalCost)}</strong></div>
          <div className="record-vehicle"><div><b>{record.vehicle.plate}</b><span>{record.vehicle.brand} {record.vehicle.model}</span></div><span>{record.mileageAtService.toLocaleString("tr-TR")} km</span></div>
          <h3>{record.performedWork}</h3>
          {record.replacedParts.length ? <p><b>Değişen parçalar:</b> {record.replacedParts.map((p) => p.name).join(", ")}</p> : null}
          <footer><span>{record.vehicle.company.name}</span><span>{record.vehicle.unit.name}</span>{record.provider ? <span>{record.provider}</span> : null}</footer>
        </article>)}</div>
        <div className="pagination"><span>{page} / {records.pagination.totalPages} sayfa</span><div><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft /></button><button disabled={page >= records.pagination.totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight /></button></div></div>
      </> : <div className="empty-state"><span><Wrench /></span><h3>{loading ? "Kayıtlar yükleniyor" : "Henüz kayıt yok"}</h3><p>İlk bakım veya tamir kaydını ekleyebilirsiniz.</p></div>}
    </section>
    {modalOpen ? <ServiceRecordModal onClose={() => setModalOpen(false)} onCreated={() => { setModalOpen(false); setRefreshKey((k) => k + 1); }} /> : null}
  </div>;
}

function Summary({ label, value, icon, accent = "blue" }: { label:string; value:string; icon:React.ReactNode; accent?:string }) {
  return <article className="service-summary-card"><span className={`summary-icon ${accent}`}>{icon}</span><small>{label}</small><strong>{value}</strong></article>;
}

function Filter({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[]}) {
  return <label className="filter-select"><span>{label}</span><select value={value} onChange={(e)=>onChange(e.target.value)}><option value="">Tümü</option>{options.map((o)=><option value={o.value} key={o.value}>{o.label}</option>)}</select></label>;
}

function ServiceRecordModal({onClose,onCreated}:{onClose:()=>void;onCreated:()=>void}) {
  const [vehicles,setVehicles]=useState<Vehicle[]>([]);
  const [companyId,setCompanyId]=useState(""); const [unitId,setUnitId]=useState(""); const [vehicleId,setVehicleId]=useState("");
  const [type,setType]=useState<ServiceType>("MAINTENANCE"); const [parts,setParts]=useState<string[]>([""]);
  const [error,setError]=useState(""); const [saving,setSaving]=useState(false);
  useEffect(()=>{ void fetch("/api/vehicles?limit=100").then((r)=>r.json()).then((r:VehicleListResponse)=>setVehicles(r.data)); },[]);
  const companies = Array.from(new Map(vehicles.map((v)=>[v.company.id,v.company])).values());
  const units = Array.from(new Map(vehicles.filter((v)=>v.companyId===companyId).map((v)=>[v.unit.id,v.unit])).values()) as Unit[];
  const shownVehicles=vehicles.filter((v)=>(!companyId||v.companyId===companyId)&&(!unitId||v.unitId===unitId));
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setSaving(true);setError("");const data=new FormData(event.currentTarget);const body={vehicleId,type,serviceDate:data.get("serviceDate"),mileageAtService:Number(data.get("mileage")),performedWork:data.get("work"),provider:data.get("provider")||undefined,totalCost:Number(data.get("cost")),note:data.get("note")||undefined,nextMaintenanceMileage:data.get("nextMileage")?Number(data.get("nextMileage")):undefined,replacedParts:parts.filter((p)=>p.trim()).map((name)=>({name}))};try{const response=await fetch("/api/service-records",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!response.ok){const result=await response.json();throw new Error(Array.isArray(result.message)?result.message.join(" "):result.message);}onCreated();}catch(e){setError(e instanceof Error?e.message:"Kayıt eklenemedi.");}finally{setSaving(false);}}
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><section className="vehicle-modal"><header><div><span className="eyebrow">Yeni işlem</span><h2>Bakım / Tamir Kaydı</h2><p>Yapılan işlemi ve masraf bilgisini kaydedin.</p></div><button onClick={onClose}><X /></button></header><form onSubmit={submit}>
    <div className="form-section"><h3>Araç ve işlem</h3><div className="vehicle-form-grid">
      <label><span>Şirket</span><select required value={companyId} onChange={(e)=>{setCompanyId(e.target.value);setUnitId("");setVehicleId("");}}><option value="">Seçiniz</option>{companies.map((c)=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
      <label><span>Birim</span><select required value={unitId} onChange={(e)=>{setUnitId(e.target.value);setVehicleId("");}}><option value="">Seçiniz</option>{units.map((u)=><option value={u.id} key={u.id}>{u.name}</option>)}</select></label>
      <label><span>Araç</span><select required value={vehicleId} onChange={(e)=>setVehicleId(e.target.value)}><option value="">Plaka seçiniz</option>{shownVehicles.map((v)=><option value={v.id} key={v.id}>{v.plate} · {v.brand} {v.model}</option>)}</select></label>
      <label><span>İşlem türü</span><select value={type} onChange={(e)=>setType(e.target.value as ServiceType)}><option value="MAINTENANCE">Bakım</option><option value="REPAIR">Tamir</option></select></label>
      <label><span>İşlem tarihi</span><input required name="serviceDate" type="date" defaultValue={new Date().toISOString().slice(0,10)} /></label>
      <label><span>İşlem kilometresi</span><input required min="0" name="mileage" type="number" /></label>
    </div></div>
    <div className="form-section"><h3>İşlem detayları</h3><div className="vehicle-form-grid">
      <label className="full-field"><span>Yapılan işlemler</span><textarea required rows={3} name="work" placeholder="Örn. Yağ ve filtre değişimi" /></label>
      <label><span>Servis / Usta</span><input name="provider" placeholder="Servis adı" /></label><label><span>Toplam maliyet (₺)</span><input required min="0" step="0.01" name="cost" type="number" /></label>
      <label><span>Sonraki bakım kilometresi</span><input min="1" name="nextMileage" type="number" /></label><label><span>Not</span><input name="note" placeholder="İsteğe bağlı" /></label>
    </div></div>
    <div className="form-section"><h3>Değişen parçalar</h3><div className="part-list">{parts.map((part,index)=><div key={index}><input value={part} onChange={(e)=>setParts((list)=>list.map((p,i)=>i===index?e.target.value:p))} placeholder="Parça adı" />{parts.length>1?<button type="button" onClick={()=>setParts((list)=>list.filter((_,i)=>i!==index))}><X /></button>:null}</div>)}<button className="add-part" type="button" onClick={()=>setParts((p)=>[...p,""])}><Plus /> Parça ekle</button></div></div>
    {error?<p className="form-error">{error}</p>:null}<footer><button className="secondary-action" type="button" onClick={onClose}>Vazgeç</button><button className="primary-action" disabled={saving}>{saving?"Kaydediliyor…":"Kaydı Oluştur"}</button></footer>
  </form></section></div>;
}

function formatMoney(value:number){return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:2}).format(value);}
