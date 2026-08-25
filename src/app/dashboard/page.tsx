import { ArrowRight, CarFront, CircleAlert, FileSpreadsheet, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { authenticatedBackendFetch } from "@/lib/authenticated-backend";

async function getJson(path:string){const response=await authenticatedBackendFetch(path);return response?.ok?response.json():null;}

export default async function DashboardPage() {
  const [vehicles,records,alerts]=await Promise.all([getJson("vehicles?page=1&limit=1"),getJson("service-records?page=1&limit=1"),getJson("maintenance-alerts")]);
  const vehicleCount=vehicles?.pagination?.total??0, recordCount=records?.summary?.total??0, totalCost=records?.summary?.totalCost??0, warningCount=alerts?.summary?.total??0;
  return <div className="dashboard-view"><header className="page-header"><div><span className="eyebrow">Filo yönetimi</span><h1>Kontrol Paneli</h1><p>Filonuzun güncel durumuna hızlıca göz atın.</p></div><Link className="primary-action" href="/dashboard/vehicles"><Plus/>Yeni Araç Ekle</Link></header>
    <section className="summary-grid"><article className="summary-card"><span className="summary-icon"><CarFront/></span><small>Toplam araç</small><strong>{vehicleCount.toLocaleString("tr-TR")} araç</strong><Link href="/dashboard/vehicles">Envanteri aç <ArrowRight/></Link></article><article className="summary-card"><span className="summary-icon warm"><Wrench/></span><small>Bakım ve tamir</small><strong>{recordCount.toLocaleString("tr-TR")} işlem</strong><p>Toplam maliyet {new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY"}).format(totalCost)}</p><Link href="/dashboard/service-records">Kayıtları aç <ArrowRight/></Link></article><article className="summary-card"><span className="summary-icon danger"><CircleAlert/></span><small>Bakım uyarıları</small><strong>{warningCount.toLocaleString("tr-TR")} araç</strong><p>{alerts?.summary?.overdue??0} gecikmiş, {alerts?.summary?.approaching??0} yaklaşan bakım</p><Link href="/dashboard/maintenance-alerts">Uyarıları aç <ArrowRight/></Link></article></section>
    <section className="dashboard-banner"><div><span>GÜNCEL FİLO RAPORU</span><h2>Tüm kayıtlar tek dosyada.</h2><p>Araç envanterini, bakım ve tamir geçmişini Excel olarak indirin.</p></div><Link href="/dashboard/reports"><FileSpreadsheet/>Raporlara Git <ArrowRight/></Link></section></div>;
}
