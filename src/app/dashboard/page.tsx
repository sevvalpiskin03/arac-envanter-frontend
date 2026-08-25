import { ArrowRight, CalendarDays, CarFront, CircleAlert, FileSpreadsheet, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { authenticatedBackendFetch } from "@/lib/authenticated-backend";
import { requireAdmin } from "@/lib/session";

async function getJson(path:string){const response=await authenticatedBackendFetch(path);return response?.ok?response.json():null;}

export default async function DashboardPage() {
  const [admin,vehicles,records,alerts]=await Promise.all([requireAdmin(),getJson("vehicles?page=1&limit=1"),getJson("service-records?page=1&limit=1"),getJson("maintenance-alerts")]);
  const vehicleCount=vehicles?.pagination?.total??0, recordCount=records?.summary?.total??0, totalCost=records?.summary?.totalCost??0, warningCount=alerts?.summary?.total??0;
  const date=new Intl.DateTimeFormat("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Istanbul"}).format(new Date());
  const firstName=admin.name.split(" ")[0];
  return <div className="dashboard-view">
    <section className="welcome-strip"><div><span className="eyebrow">Filo yönetimi</span><h1>Hoş geldin, {firstName}! Bugün nasılsın?</h1><p>Filonun güncel durumu ve yaklaşan işlemler burada.</p></div><time><CalendarDays/>{date}</time></section>
    <div className="dashboard-quick-actions"><Link className="primary-action" href="/dashboard/vehicles"><Plus/>Yeni Araç Ekle</Link><Link className="secondary-action" href="/dashboard/service-records"><Wrench/>Yeni Bakım / Tamir</Link><Link className="secondary-action" href="/dashboard/reports"><FileSpreadsheet/>Excel Raporu</Link></div>
    <section className="summary-grid"><article className="summary-card"><span className="summary-icon"><CarFront/></span><small>Toplam araç</small><strong>{vehicleCount.toLocaleString("tr-TR")} araç</strong><Link href="/dashboard/vehicles">Envanteri aç <ArrowRight/></Link></article><article className="summary-card"><span className="summary-icon warm"><Wrench/></span><small>Bakım ve tamir</small><strong>{recordCount.toLocaleString("tr-TR")} işlem</strong><p>Toplam maliyet {new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(totalCost)}</p></article><article className="summary-card"><span className="summary-icon danger"><CircleAlert/></span><small>Bakım uyarıları</small><strong>{warningCount.toLocaleString("tr-TR")} araç</strong><p>{alerts?.summary?.overdue??0} gecikmiş, {alerts?.summary?.approaching??0} yaklaşan bakım</p></article></section>
    <section className="dashboard-alerts"><header><div><h2>Bakım uyarıları</h2><p>Yaklaşan ve geciken bakımlar</p></div><Link href="/dashboard/maintenance-alerts">Tümünü gör <ArrowRight/></Link></header>{alerts?.data?.length?<div>{alerts.data.slice(0,4).map((alert:{vehicleId:string;plate:string;brand:string;model:string;status:"APPROACHING"|"OVERDUE";remainingMileage:number;nextMaintenanceMileage:number})=><article key={alert.vehicleId}><span className={`dashboard-alert-icon ${alert.status.toLowerCase()}`}><CarFront/></span><div><strong>{alert.plate}</strong><small>{alert.brand} {alert.model}</small></div><div className={`dashboard-alert-state ${alert.status.toLowerCase()}`}><b>{alert.status==="OVERDUE"?"Gecikti":"Yaklaşıyor"}</b><small>{alert.status==="OVERDUE"?`${Math.abs(alert.remainingMileage).toLocaleString("tr-TR")} km geçti`:`${alert.remainingMileage.toLocaleString("tr-TR")} km kaldı`}</small></div></article>)}</div>:<div className="dashboard-all-clear"><CircleAlert/><span><b>Yaklaşan bakım bulunmuyor</b><small>Tüm araçların bakım planı normal görünüyor.</small></span></div>}</section>
  </div>;
}
