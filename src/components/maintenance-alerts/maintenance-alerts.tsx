"use client";

import { AlertTriangle, Bell, CheckCircle2, Mail, Save, Send } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { MaintenanceAlertResponse } from "@/types/maintenance-alert";

const empty: MaintenanceAlertResponse = { data: [], summary: { total: 0, approaching: 0, overdue: 0 }, settings: { id: "", warningMileageThreshold: 1000, emailEnabled: true, recipientEmails: [] } };

export function MaintenanceAlerts() {
  const [result,setResult]=useState(empty); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [sending,setSending]=useState(false);
  const [threshold,setThreshold]=useState(1000); const [emails,setEmails]=useState(""); const [enabled,setEnabled]=useState(true); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);try{const response=await fetch("/api/maintenance-alerts");if(response.ok){const data:MaintenanceAlertResponse=await response.json();setResult(data);setThreshold(data.settings.warningMileageThreshold);setEmails(data.settings.recipientEmails.join(", "));setEnabled(data.settings.emailEnabled);}}finally{setLoading(false);}},[]);
  useEffect(()=>{const timer=setTimeout(()=>void load(),0);return()=>clearTimeout(timer);},[load]);
  async function save(event:FormEvent){event.preventDefault();setSaving(true);setError("");setMessage("");try{const recipientEmails=emails.split(/[;,\s]+/).map((v)=>v.trim()).filter(Boolean);const response=await fetch("/api/maintenance-alerts/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({warningMileageThreshold:threshold,emailEnabled:enabled,recipientEmails})});const body=await response.json();if(!response.ok)throw new Error(Array.isArray(body.message)?body.message.join(" "):body.message);setMessage("Bildirim ayarları kaydedildi.");await load();}catch(e){setError(e instanceof Error?e.message:"Ayarlar kaydedilemedi.");}finally{setSaving(false);}}
  async function sendEmails(){setSending(true);setError("");setMessage("");try{const response=await fetch("/api/maintenance-alerts/send-emails",{method:"POST"});const body=await response.json();if(!response.ok)throw new Error(Array.isArray(body.message)?body.message.join(" "):body.message);setMessage(`${body.sentRecipients} alıcıya bakım uyarısı gönderildi.`);}catch(e){setError(e instanceof Error?e.message:"E-postalar gönderilemedi.");}finally{setSending(false);}}
  return <div className="inventory-view alert-view">
    <header className="page-header"><div><span className="eyebrow">Filo yönetimi</span><h1>Bakım Uyarıları</h1><p>Yaklaşan ve geciken bakımları tek ekrandan takip edin.</p></div><button className="primary-action" disabled={sending||!result.summary.total} onClick={sendEmails}><Send />{sending?"Gönderiliyor…":"Uyarıları Gönder"}</button></header>
    <section className="alert-summary">
      <article><span className="alert-stat-icon"><Bell /></span><div><small>Toplam uyarı</small><strong>{result.summary.total}</strong></div></article>
      <article className="warm"><span className="alert-stat-icon"><AlertTriangle /></span><div><small>Yaklaşıyor</small><strong>{result.summary.approaching}</strong></div></article>
      <article className="danger"><span className="alert-stat-icon"><AlertTriangle /></span><div><small>Gecikmiş</small><strong>{result.summary.overdue}</strong></div></article>
    </section>
    <div className="alert-layout">
      <section className="inventory-panel alert-list-panel"><div className="inventory-title-row"><div><h2>Uyarı listesi</h2><p>{threshold.toLocaleString("tr-TR")} km eşiğine göre gösteriliyor</p></div><span>{loading?"Yükleniyor…":`${result.data.length} araç`}</span></div>
        {result.data.length?<div className="alert-list">{result.data.map((alert)=><article className={`alert-card ${alert.status.toLowerCase()}`} key={alert.vehicleId}><span className="alert-vehicle-icon"><AlertTriangle /></span><div className="alert-main"><div><strong>{alert.plate}</strong><span>{alert.brand} {alert.model}</span></div><p>{alert.company.name} · {alert.unit.name}</p></div><div className="alert-mileage"><strong>{alert.status==="OVERDUE"?`${Math.abs(alert.remainingMileage).toLocaleString("tr-TR")} km gecikti`:`${alert.remainingMileage.toLocaleString("tr-TR")} km kaldı`}</strong><small>{alert.currentMileage.toLocaleString("tr-TR")} / {alert.nextMaintenanceMileage.toLocaleString("tr-TR")} km</small></div></article>)}</div>:<div className="empty-state"><span><CheckCircle2 /></span><h3>Bakımı yaklaşan araç yok</h3><p>Filodaki tüm araçların bakım planı normal görünüyor.</p></div>}
      </section>
      <aside className="notification-settings"><header><span><Mail /></span><div><h2>E-posta Bildirimleri</h2><p>Uyarı alıcılarını ve kilometre eşiğini yönetin.</p></div></header><form onSubmit={save}>
        <label className="toggle-field"><span><b>E-posta gönderimi</b><small>Bakım uyarılarını e-postayla ilet</small></span><input type="checkbox" checked={enabled} onChange={(e)=>setEnabled(e.target.checked)} /></label>
        <label><span>Uyarı eşiği (km)</span><input type="number" min="100" max="10000" value={threshold} onChange={(e)=>setThreshold(Number(e.target.value))} /></label>
        <label><span>Alıcı e-posta adresleri</span><textarea rows={4} value={emails} onChange={(e)=>setEmails(e.target.value)} placeholder="ornek@firma.com, yonetici@firma.com" /><small>Birden fazla adresi virgülle ayırabilirsiniz.</small></label>
        {message?<p className="settings-success"><CheckCircle2 />{message}</p>:null}{error?<p className="form-error">{error}</p>:null}
        <button className="primary-action" disabled={saving}><Save />{saving?"Kaydediliyor…":"Ayarları Kaydet"}</button>
      </form></aside>
    </div>
  </div>;
}
