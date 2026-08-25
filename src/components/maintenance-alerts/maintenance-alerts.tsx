"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MailCheck,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MaintenanceAlert, MaintenanceAlertResponse } from "@/types/maintenance-alert";

const PAGE_SIZE = 6;
const empty: MaintenanceAlertResponse = {
  data: [],
  allMaintenance: [],
  summary: { total: 0, approaching: 0, overdue: 0 },
};

export function MaintenanceAlerts() {
  const [result, setResult] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [overduePage, setOverduePage] = useState(1);
  const [plannedPage, setPlannedPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/maintenance-alerts");
      if (response.ok) {
        const data = await response.json();
        setResult({
          ...data,
          data: data.data ?? [],
          allMaintenance: data.allMaintenance ?? data.data ?? [],
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("tr-TR");
    return result.allMaintenance.filter(
      (alert) =>
        !term ||
        [alert.plate, alert.brand, alert.model, alert.company.name, alert.unit.name].some((value) =>
          value.toLocaleLowerCase("tr-TR").includes(term),
        ),
    );
  }, [result.allMaintenance, search]);

  const overdue = filtered.filter((alert) => alert.remainingMileage < 0);
  const planned = filtered.filter((alert) => alert.remainingMileage >= 0);

  return (
    <div className="inventory-view alert-view">
      <header className="page-header">
        <div>
          <span className="eyebrow">Filo yönetimi</span>
          <h1>Bakım Planı</h1>
          <p>Geciken ve planlanan bakımları ayrı listelerde takip edin.</p>
        </div>
        <span className="automatic-mail-note">
          <MailCheck /> Uyarılar yönetici e-postasına otomatik gönderilir
        </span>
      </header>

      <section className="alert-summary">
        <article>
          <span className="alert-stat-icon"><Bell /></span>
          <div><small>Kritik uyarı</small><strong>{result.summary.total}</strong></div>
        </article>
        <article className="warm">
          <span className="alert-stat-icon"><AlertTriangle /></span>
          <div><small>Yaklaşıyor</small><strong>{result.summary.approaching}</strong></div>
        </article>
        <article className="danger">
          <span className="alert-stat-icon"><AlertTriangle /></span>
          <div><small>Gecikmiş</small><strong>{result.summary.overdue}</strong></div>
        </article>
      </section>

      <div className="maintenance-search">
        <Search />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setOverduePage(1);
            setPlannedPage(1);
          }}
          placeholder="Plaka, araç, şirket veya birim ara…"
          aria-label="Bakım planında ara"
        />
      </div>

      <MaintenanceList
        title="Gecikmiş Bakımlar"
        description="Bakım kilometresi geçmiş araçlar"
        items={overdue}
        page={overduePage}
        setPage={setOverduePage}
        danger
        loading={loading}
      />
      <MaintenanceList
        title="Planlanan Bakımlar"
        description="En yakın bakım kilometresinden en uzağa doğru"
        items={planned}
        page={plannedPage}
        setPage={setPlannedPage}
        loading={loading}
      />
    </div>
  );
}

function MaintenanceList({
  title,
  description,
  items,
  page,
  setPage,
  danger = false,
  loading,
}: {
  title: string;
  description: string;
  items: MaintenanceAlert[];
  page: number;
  setPage: (page: number) => void;
  danger?: boolean;
  loading: boolean;
}) {
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <section className={`inventory-panel maintenance-section ${danger ? "overdue-section" : "planned-section"}`}>
      <div className="inventory-title-row">
        <div><h2>{title}</h2><p>{description}</p></div>
        <span>{loading ? "Yükleniyor…" : `${items.length} araç`}</span>
      </div>
      {visible.length ? (
        <div className="alert-list">
          {visible.map((alert, index) => (
            <MaintenanceRow
              alert={alert}
              key={alert.vehicleId}
              order={(current - 1) * PAGE_SIZE + index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-all-clear">
          <CheckCircle2 />
          <span>
            <b>{danger ? "Gecikmiş bakım bulunmuyor" : "Planlanmış bakım bulunmuyor"}</b>
            <small>Arama veya bakım planına uygun araç bulunmuyor.</small>
          </span>
        </div>
      )}
      <div className="pagination maintenance-pagination">
        <span>{current} / {pages} sayfa</span>
        <div>
          <button disabled={current <= 1} onClick={() => setPage(current - 1)} aria-label="Önceki sayfa">
            <ChevronLeft />
          </button>
          <button disabled={current >= pages} onClick={() => setPage(current + 1)} aria-label="Sonraki sayfa">
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

function MaintenanceRow({ alert, order }: { alert: MaintenanceAlert; order: number }) {
  return (
    <article className={`alert-card ${alert.remainingMileage < 0 ? "overdue" : "approaching"}`}>
      <span className="maintenance-order">{order}</span>
      <div className="alert-main">
        <div><strong>{alert.plate}</strong><span>{alert.brand} {alert.model}</span></div>
        <p>{alert.company.name} · {alert.unit.name}</p>
      </div>
      <div className={`dashboard-alert-state ${alert.remainingMileage < 0 ? "overdue" : "approaching"}`}>
        <b>{alert.remainingMileage < 0 ? "Gecikti" : "Planlandı"}</b>
        <small>
          {alert.remainingMileage < 0
            ? `${Math.abs(alert.remainingMileage).toLocaleString("tr-TR")} km geçti`
            : `${alert.remainingMileage.toLocaleString("tr-TR")} km kaldı`}
          {` · Hedef ${alert.nextMaintenanceMileage.toLocaleString("tr-TR")} km`}
        </small>
      </div>
    </article>
  );
}
