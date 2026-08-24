import { ArrowRight, CarFront, CircleAlert, Plus, Wrench } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="dashboard-view">
      <header className="page-header">
        <div><span className="eyebrow">Filo yönetimi</span><h1>Kontrol Paneli</h1><p>Filonuzun güncel durumuna hızlıca göz atın.</p></div>
        <Link className="primary-action" href="/dashboard/vehicles"><Plus /> Yeni Araç Ekle</Link>
      </header>
      <section className="summary-grid">
        <article className="summary-card"><span className="summary-icon"><CarFront /></span><small>Envanter</small><strong>Araç kayıtları hazır</strong><Link href="/dashboard/vehicles">Envanteri aç <ArrowRight /></Link></article>
        <article className="summary-card"><span className="summary-icon warm"><Wrench /></span><small>Sıradaki özellik</small><strong>Bakım ve tamir</strong><p>Araç envanterinden sonra eklenecek.</p></article>
        <article className="summary-card"><span className="summary-icon danger"><CircleAlert /></span><small>Bakım uyarıları</small><strong>Kilometre bazlı</strong><p>Yaklaşan bakımlar otomatik hesaplanır.</p></article>
      </section>
      <section className="dashboard-banner"><div><span>ARAÇ ENVANTERİ</span><h2>İlk feature kullanıma hazır.</h2><p>Araçları görüntüleyin, filtreleyin ve yeni araç ekleyin.</p></div><Link href="/dashboard/vehicles">Araç Envanterine Git <ArrowRight /></Link></section>
    </div>
  );
}
