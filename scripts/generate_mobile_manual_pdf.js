const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Read institutional logo and convert to base64
const logoPath = path.join(__dirname, '../apps/mobile/assets/logo-colegio.png');
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  const logoBuffer = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>BiliAPP Mobile — Manual de Vistas y Funcionalidades</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      line-height: 1.45;
      font-size: 13px;
    }

    .page {
      width: 210mm;
      height: 297mm;
      padding: 18mm 18mm 16mm 18mm;
      position: relative;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* TOP HEADER & FOOTER ON CONTENT PAGES */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1.5px solid #E2E8F0;
      margin-bottom: 14px;
    }

    .page-header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .page-header-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .page-header-title {
      font-size: 13px;
      font-weight: 800;
      color: #008C45;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .page-header-subtitle {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
    }

    .page-header-badge {
      background: #E8F7EE;
      color: #005F2E;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid #A7F3D0;
    }

    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid #E2E8F0;
      font-size: 10px;
      color: #94A3B8;
      font-weight: 600;
    }

    .page-footer-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* PORTADA */
    .cover-page {
      background: linear-gradient(145deg, #005F2E 0%, #008C45 55%, #1A73E8 100%);
      color: #FFFFFF;
      padding: 24mm 22mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-top-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cover-pill {
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }

    .cover-pill-red {
      background: rgba(205, 33, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.4);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .cover-hero-center {
      text-align: center;
      margin: auto 0;
    }

    .cover-logo-circle {
      width: 125px;
      height: 125px;
      background: #FFFFFF;
      border-radius: 50%;
      margin: 0 auto 24px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
      border: 4px solid rgba(255, 255, 255, 0.7);
    }

    .cover-logo-img {
      width: 90px;
      height: 90px;
      object-fit: contain;
    }

    .cover-app-title {
      font-size: 42px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.1;
      margin-bottom: 8px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    }

    .cover-app-subtitle {
      font-size: 18px;
      font-weight: 600;
      color: #E2E8F0;
      margin-bottom: 22px;
      max-width: 580px;
      margin-left: auto;
      margin-right: auto;
    }

    .cover-highlight-card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 16px;
      padding: 16px 24px;
      max-width: 540px;
      margin: 0 auto;
      text-align: left;
    }

    .cover-highlight-title {
      font-size: 12px;
      font-weight: 800;
      color: #FEF08A;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cover-highlight-desc {
      font-size: 12px;
      line-height: 1.45;
      color: #F8FAFC;
    }

    .cover-bottom-meta {
      background: rgba(0, 0, 0, 0.22);
      border-radius: 14px;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .cover-meta-col h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94A3B8;
      margin-bottom: 3px;
    }

    .cover-meta-col p {
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
    }

    /* GENERAL LAYOUT FOR SCREEN SHOWCASE PAGES */
    .screen-page-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 20px;
      align-items: start;
      flex: 1;
    }

    /* SMARTPHONE MOCKUP */
    .phone-mockup {
      width: 236px;
      height: 480px;
      background: #FFFFFF;
      border-radius: 36px;
      border: 8px solid #1E293B;
      box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .phone-island {
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 76px;
      height: 16px;
      background: #0F172A;
      border-radius: 20px;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;
    }

    .phone-camera-lens {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0284C7;
      opacity: 0.7;
    }

    .phone-sensor {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #334155;
    }

    .phone-status-bar {
      height: 28px;
      padding: 6px 12px 0 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      font-weight: 700;
      color: #FFFFFF;
      z-index: 40;
    }

    .phone-screen-body {
      flex: 1;
      overflow: hidden;
      background: #F4F7FC;
      display: flex;
      flex-direction: column;
    }

    .phone-home-indicator {
      width: 80px;
      height: 4px;
      background: #94A3B8;
      border-radius: 2px;
      margin: 4px auto 3px auto;
    }

    /* MINI PHONE COMPONENTS */
    .mini-hero-banner {
      background: #008C45;
      color: #FFFFFF;
      padding: 10px 10px 12px 10px;
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
      box-shadow: 0 4px 8px rgba(0, 140, 69, 0.18);
    }

    .mini-hero-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .mini-hero-title {
      font-size: 11px;
      font-weight: 800;
    }

    .mini-hero-sub {
      font-size: 8px;
      color: #D1FAE5;
      font-weight: 500;
    }

    .mini-carousel {
      display: flex;
      gap: 6px;
      margin-top: 6px;
    }

    .mini-child-chip {
      background: #FFFFFF;
      color: #0F172A;
      border-radius: 8px;
      padding: 4px 6px;
      flex: 1;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }

    .mini-child-chip.active {
      border: 1.5px solid #005F2E;
      background: #F0FDF4;
    }

    .mini-child-avatar {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #008C45;
      color: #FFFFFF;
      font-size: 8px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mini-child-info {
      line-height: 1.1;
    }

    .mini-child-name {
      font-size: 8px;
      font-weight: 800;
    }

    .mini-child-level {
      font-size: 6.5px;
      color: #64748B;
    }

    .mini-card {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 8px;
      margin: 6px 8px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
      border: 1px solid #E2E8F0;
    }

    .mini-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .mini-card-title {
      font-size: 9px;
      font-weight: 800;
      color: #0F172A;
    }

    .mini-card-badge {
      font-size: 7px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 999px;
    }

    .badge-green { background: #DCFCE7; color: #166534; }
    .badge-blue { background: #DBEAFE; color: #1E40AF; }
    .badge-coral { background: #FFE4E6; color: #9F1239; }
    .badge-amber { background: #FEF3C7; color: #92400E; }

    /* PHONE BOTTOM TAB BAR */
    .mini-tabbar {
      height: 38px;
      background: #FFFFFF;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 4px;
    }

    .mini-tab-item {
      text-align: center;
      color: #94A3B8;
      font-size: 7px;
      font-weight: 700;
      line-height: 1.1;
    }

    .mini-tab-item.active {
      color: #008C45;
    }

    .mini-tab-icon {
      font-size: 11px;
      margin-bottom: 1px;
    }

    /* RIGHT CONTENT PANEL (ANALYSIS & CAPABILITIES) */
    .view-content-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .view-badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .view-number-pill {
      background: #008C45;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .view-route-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      background: #F1F5F9;
      color: #475569;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid #CBD5E1;
      font-weight: 700;
    }

    .view-main-title {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.4px;
      line-height: 1.2;
    }

    .view-lead-desc {
      font-size: 12px;
      color: #475569;
      line-height: 1.5;
    }

    .capabilities-box {
      background: #F8FAFC;
      border-radius: 12px;
      border: 1.5px solid #E2E8F0;
      padding: 12px 14px;
    }

    .capabilities-box-title {
      font-size: 11px;
      font-weight: 800;
      color: #005F2E;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cap-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cap-list li {
      display: flex;
      align-items: start;
      gap: 8px;
      font-size: 11.5px;
      color: #1E293B;
      line-height: 1.4;
    }

    .cap-icon {
      color: #008C45;
      font-weight: 800;
      font-size: 12px;
      line-height: 1.2;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .highlight-change-banner {
      background: #FEF9C3;
      border-left: 4px solid #CA8A04;
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .highlight-change-badge {
      font-size: 9.5px;
      font-weight: 800;
      color: #854D0E;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .highlight-change-text {
      font-size: 11px;
      color: #713F12;
      line-height: 1.4;
    }

    .value-prop-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .value-prop-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 8px 10px;
    }

    .value-prop-card h5 {
      font-size: 10.5px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 2px;
    }

    .value-prop-card p {
      font-size: 10px;
      color: #64748B;
      line-height: 1.35;
    }

    /* MATRIZ RESUMEN TABLE */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin: 10px 0;
    }

    .summary-table th {
      background: #005F2E;
      color: #FFFFFF;
      text-align: left;
      padding: 8px 10px;
      font-weight: 800;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .summary-table th:first-child { border-top-left-radius: 6px; }
    .summary-table th:last-child { border-top-right-radius: 6px; }

    .summary-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #E2E8F0;
      color: #334155;
    }

    .summary-table tr:nth-child(even) td {
      background: #F8FAFC;
    }

    .summary-table tr:hover td {
      background: #F0FDF4;
    }

    .tech-stack-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 8px 0;
    }

    .tech-badge {
      background: #F1F5F9;
      color: #0F172A;
      border: 1px solid #CBD5E1;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- PÁGINA 1: PORTADA INSTITUCIONAL                                            -->
  <!-- ========================================================================= -->
  <div class="page cover-page">
    <div class="cover-top-badge-row">
      <div class="cover-pill">Instituto República de Italia · Entre Ríos</div>
      <div class="cover-pill-red">Nomenclatura Oficial: Notas Parciales</div>
    </div>

    <div class="cover-hero-center">
      <div class="cover-logo-circle">
        <img src="${logoBase64}" class="cover-logo-img" alt="Escudo Oficial Colegio">
      </div>
      <h1 class="cover-app-title">BiliAPP Mobile</h1>
      <p class="cover-app-subtitle">
        Manual Integral de Funcionalidades, Arquitectura de Pantallas y Guía de Uso del Ecosistema Escolar para Familias
      </p>

      <div class="cover-highlight-card">
        <div class="cover-highlight-title">
          <span>★</span> Actualización Curricular 2026
        </div>
        <p class="cover-highlight-desc">
          Este documento detalla todas las capacidades de la aplicación móvil institucional, incorporando el cambio oficial de nomenclatura: la antigua sección de <strong>Calificaciones y Boletines</strong> pasa a denominarse de manera unificada <strong>"Notas Parciales"</strong> tanto en el Tablero de Inicio como en el Centro de Archivos y Documentación.
        </p>
      </div>
    </div>

    <div class="cover-bottom-meta">
      <div class="cover-meta-col">
        <h4>Plataforma</h4>
        <p>iOS / Android (Expo 58)</p>
      </div>
      <div class="cover-meta-col">
        <h4>Nivel Educativo</h4>
        <p>Inicial, Primario y Secundario</p>
      </div>
      <div class="cover-meta-col">
        <h4>Edición</h4>
        <p>Noviembre 2026 · Versión 2.0</p>
      </div>
      <div class="cover-meta-col">
        <h4>Destinatarios</h4>
        <p>Familias y Comunidad Educativa</p>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 2: INTRODUCCIÓN GENERAL Y CAMBIO DE NOMENCLATURA                    -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">BiliAPP Mobile · Visión General</div>
            <div class="page-header-subtitle">Instituto República de Italia — Plataforma Institucional</div>
          </div>
        </div>
        <div class="page-header-badge">Ecosistema Bilingüe</div>
      </div>

      <div style="margin-bottom: 16px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 6px;">
          Arquitectura Mobile y Experiencia de la Familia
        </h2>
        <p style="font-size: 12.5px; color: #475569; line-height: 1.55;">
          <strong>BiliAPP Mobile</strong> es la aplicación nativa multiplataforma (iOS y Android) desarrollada especialmente para los padres, madres y tutores del Instituto República de Italia. Diseñada bajo un concepto humanizado, cálido y bicultural (enlazando los colores y valores de Italia y Argentina), unifica en una sola herramienta la seguridad en la salida, el seguimiento pedagógico diario, la justificación de inasistencias y la firma digital vinculante.
        </p>
      </div>

      <!-- BANNER DE CAMBIO DE NOMENCLATURA: NOTAS PARCIALES -->
      <div style="background: #F0FDF4; border: 2px solid #008C45; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <div style="font-size: 13px; font-weight: 800; color: #005F2E; display: flex; align-items: center; gap: 8px;">
            <span style="background: #008C45; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px;">✓</span>
            Actualización Normativa: Transición a "Notas Parciales"
          </div>
          <span style="background: #DCFCE7; color: #166534; font-size: 9.5px; font-weight: 800; padding: 2px 8px; border-radius: 999px;">APLICADO EN v2.0</span>
        </div>
        <p style="font-size: 12px; color: #14532D; line-height: 1.5; margin-bottom: 8px;">
          Conforme a las directivas de las autoridades pedagógicas y al reglamento institucional de evaluación continua, <strong>se ha discontinuado el uso de los términos "Boletines" y "Calificaciones"</strong> en favor de la denominación unificada y procesual <strong>"Notas Parciales"</strong>.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: #FFFFFF; border-radius: 8px; padding: 8px 10px; border: 1px solid #BBF7D0;">
            <div style="font-size: 10px; font-weight: 800; color: #991B1B; text-transform: uppercase;">Antes (Obsoleto)</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">• Sección "Calificaciones y Boletines"<br>• Botón "Ver boletines"<br>• Filtro "Boletines" en Archivos<br>• "Boletín Calificaciones 1° Ciclo"</div>
          </div>
          <div style="background: #FFFFFF; border-radius: 8px; padding: 8px 10px; border: 1px solid #008C45;">
            <div style="font-size: 10px; font-weight: 800; color: #005F2E; text-transform: uppercase;">Ahora (Vigente en BiliAPP)</div>
            <div style="font-size: 11px; color: #005F2E; font-weight: 600; margin-top: 2px;">• Sección <strong>"Notas Parciales"</strong><br>• Botón <strong>"Ver notas parciales"</strong><br>• Filtro <strong>"Notas Parciales"</strong><br>• <strong>"Notas Parciales 1° Ciclo"</strong></div>
          </div>
        </div>
      </div>

      <!-- CARACTERÍSTICAS PILAR DE LA APP -->
      <h3 style="font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">Pilares Fundamentales del Sistema</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px;">
          <div style="font-size: 12px; font-weight: 800; color: #008C45; margin-bottom: 3px;">1. Multi-Hijo Inteligente (Switch sin Relog)</div>
          <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Un carrusel táctil superior permite alternar al instante entre hijos en diferentes niveles (ej. Mateo en Nivel Inicial y Sofía en Primaria). Toda la app adapta su contexto al alumno activo.</p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px;">
          <div style="font-size: 12px; font-weight: 800; color: #1A73E8; margin-bottom: 3px;">2. Salida Escolar con QR Dinámico</div>
          <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Token de seguridad que caduca y se regenera automáticamente cada 60 segundos. Impide la suplantación por capturas de pantalla y agiliza el despacho en puerta.</p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px;">
          <div style="font-size: 12px; font-weight: 800; color: #854D0E; margin-bottom: 3px;">3. Firma Digital con PIN de 6 Dígitos</div>
          <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Consentimiento legal y formal para salidas educativas, campamentos y trámites sin necesidad de imprimir hojas de papel ni cuadernos físicos.</p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px;">
          <div style="font-size: 12px; font-weight: 800; color: #9F1239; margin-bottom: 3px;">4. Bitácora de Jardín en Tiempo Real</div>
          <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Seguimiento diario de ingesta alimenticia, higiene, cambios de pañales, horas de siesta y humor para salas maternales y de infantes.</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 2 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 3: PANTALLA 1 — INICIO / TABLERO PRINCIPAL (HomeScreen)             -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vista 01 · Inicio / Tablero Principal</div>
            <div class="page-header-subtitle">HomeScreen.tsx — Dashboard Unificado para la Familia</div>
          </div>
        </div>
        <div class="page-header-badge">Vista Principal</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: HOME -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <!-- STATUS BAR -->
          <div class="phone-status-bar" style="background: #008C45;">
            <span>08:15</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <!-- SCREEN BODY -->
          <div class="phone-screen-body">
            <!-- HERO WAVE -->
            <div class="mini-hero-banner">
              <div class="mini-hero-top">
                <div>
                  <div class="mini-hero-title">¡Hola, Familia López! 👋</div>
                  <div class="mini-hero-sub">Colegio República de Italia</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">🔔</div>
              </div>

              <!-- CAROUSEL DE HIJOS -->
              <div class="mini-carousel">
                <div class="mini-child-chip active">
                  <div class="mini-child-avatar">M</div>
                  <div class="mini-child-info">
                    <div class="mini-child-name">Mateo</div>
                    <div class="mini-child-level">Sala de 4</div>
                  </div>
                </div>
                <div class="mini-child-chip">
                  <div class="mini-child-avatar" style="background: #1A73E8;">S</div>
                  <div class="mini-child-info">
                    <div class="mini-child-name">Sofía</div>
                    <div class="mini-child-level">4° Grado B</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TARJETA ASISTENCIA DE HOY -->
            <div class="mini-card" style="margin-top: -6px;">
              <div class="mini-card-header">
                <div class="mini-card-title">Asistencia de Hoy</div>
                <span class="mini-card-badge badge-green">Presente ✓</span>
              </div>
              <div style="font-size: 7.5px; color: #64748B;">Ingreso registrado a las 07:55 hs por molinete facial.</div>
            </div>

            <!-- SECCIÓN NOTAS PARCIALES (ACTUALIZADA) -->
            <div class="mini-card" style="border-left: 3px solid #008C45;">
              <div class="mini-card-header">
                <div class="mini-card-title" style="color: #005F2E;">Notas Parciales</div>
                <span style="font-size: 7px; color: #008C45; font-weight: 800;">Ver notas →</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3px;">
                <div>
                  <div style="font-size: 8px; font-weight: 800;">🇮🇹 Lingua Italiana</div>
                  <div style="font-size: 6.8px; color: #64748B;">Examen trimestral oral</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 10px; font-weight: 800; color: #008C45;">9.8</div>
                  <div style="font-size: 6px; font-weight: 700; color: #166534;">Sobresaliente</div>
                </div>
              </div>
            </div>

            <!-- ACCESOS RÁPIDOS -->
            <div style="padding: 0 8px; margin-top: 2px;">
              <div style="font-size: 8px; font-weight: 800; color: #64748B; margin-bottom: 4px;">ACCESOS RÁPIDOS</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                <div style="background: white; border-radius: 6px; padding: 4px; text-align: center; font-size: 7px; font-weight: 700; border: 1px solid #E2E8F0;">
                  <div style="font-size: 11px;">📅</div>Asistencia
                </div>
                <div style="background: white; border-radius: 6px; padding: 4px; text-align: center; font-size: 7px; font-weight: 700; border: 1px solid #E2E8F0;">
                  <div style="font-size: 11px;">🛡️</div>Retiro QR
                </div>
                <div style="background: white; border-radius: 6px; padding: 4px; text-align: center; font-size: 7px; font-weight: 700; border: 1px solid #E2E8F0;">
                  <div style="font-size: 11px;">📁</div>Archivos
                </div>
              </div>
            </div>

            <!-- COMUNICADO DESTACADO -->
            <div class="mini-card" style="border-left: 3px solid #CD212A; margin-top: 6px;">
              <div style="font-size: 7px; font-weight: 800; color: #9F1239;">AVISO IMPORTANTE</div>
              <div style="font-size: 7.5px; font-weight: 800; color: #0F172A; margin-top: 1px;">Salida Didáctica Museo Provincial</div>
              <div style="font-size: 6.8px; color: #64748B;">Se requiere firma digital antes del viernes.</div>
            </div>
          </div>

          <!-- MINI BOTTOM TABS -->
          <div class="mini-tabbar">
            <div class="mini-tab-item active"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLA PRINCIPAL</span>
            <span class="view-route-code">apps/mobile/src/screens/HomeScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Centro de Control y Monitoreo Diario</h3>
          <p class="view-lead-desc">
            Es la puerta de entrada de la aplicación. Sintetiza en tiempo real toda la información crítica del día escolar para que los tutores no tengan que buscar en múltiples menús.
          </p>

          <div class="highlight-change-banner">
            <div class="highlight-change-badge">★ Cambio Realizado: Notas Parciales</div>
            <div class="highlight-change-text">
              La sección central ha sido actualizada de <em>"Calificaciones y Boletines"</em> a <strong>"Notas Parciales"</strong> con el botón interactivo <strong>"Ver notas parciales"</strong> que redirige al historial completo en Archivos.
            </div>
          </div>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>⚡</span> Todo lo que puede hacer la familia en esta vista
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Conmutar entre hijos al instante:</strong> Con un solo toque en el carrusel de estudiantes, la app adapta calificaciones, presentismo y avisos al hijo seleccionado sin cerrar sesión.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Verificación de Presentismo en Vivo:</strong> Conexión con el sistema de molinetes y control facial escolar; confirma al padre el horario exacto en que su hijo ingresó a la institución.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Monitoreo de Notas Parciales:</strong> Vista de las últimas evaluaciones cargadas por los docentes con distinción curricular bicultural (banderas 🇮🇹 para asignaturas italianas y 🇦🇷 para las del currículum oficial argentino).</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Bandeja de Accesos Directos:</strong> Saltos rápidos con un solo toque hacia Asistencia, Salida Segura (QR), Cuaderno de Nivel Inicial y Mensajería.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Alertas de Comunicados Críticos:</strong> Tarjetas con borde rojo/ámbar para circularizaciones que requieren firma urgente o aviso de suspensión de actividades por clima.</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 3 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 4: PANTALLA 2 — CONTROL DE ASISTENCIA Y PUNTUALIDAD                 -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vista 02 · Control de Asistencia y Puntualidad</div>
            <div class="page-header-subtitle">AttendanceScreen.tsx — Registro Oficial y Justificaciones</div>
          </div>
        </div>
        <div class="page-header-badge">Gestión de Presentismo</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: ATTENDANCE -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <div class="phone-status-bar" style="background: #005F2E;">
            <span>08:16</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <div class="phone-screen-body">
            <!-- HEADER VERDE OSCURO -->
            <div style="background: #005F2E; color: white; padding: 10px 10px 14px 10px; border-bottom-left-radius: 18px; border-bottom-right-radius: 18px;">
              <div style="font-size: 11px; font-weight: 800;">Asistencia Escolar</div>
              <div style="font-size: 8px; color: #A7F3D0;">Sofía López · 4° Grado "B"</div>

              <!-- BANNER MÉTRICO -->
              <div style="background: rgba(255,255,255,0.12); border-radius: 10px; padding: 8px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 7px; text-transform: uppercase; color: #D1FAE5;">Faltas Acumuladas</div>
                  <div style="font-size: 16px; font-weight: 800; color: #FFFFFF;">1.75 <span style="font-size: 9px; font-weight: 500;">/ 15 máx</span></div>
                </div>
                <div style="background: #DCFCE7; color: #166534; font-size: 8px; font-weight: 800; padding: 3px 8px; border-radius: 999px;">
                  Regular ✓
                </div>
              </div>
            </div>

            <!-- REGISTROS HISTÓRICOS -->
            <div style="padding: 8px 8px 0 8px; font-size: 8px; font-weight: 800; color: #64748B;">HISTORIAL DE NOVEDADES</div>

            <div class="mini-card" style="border-left: 3px solid #EAB308;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">Tardanza (08:25 hs)</div>
                <span class="mini-card-badge badge-amber">+0.25 falta</span>
              </div>
              <div style="font-size: 7px; color: #64748B;">28 de Octubre, 2026</div>
              <div style="font-size: 6.8px; color: #94A3B8; margin-top: 2px;">Ingreso demorado registrado en recepción.</div>
            </div>

            <div class="mini-card" style="border-left: 3px solid #16A34A;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">Inasistencia Justificada</div>
                <span class="mini-card-badge badge-green">Aprobada ✓</span>
              </div>
              <div style="font-size: 7px; color: #64748B;">15 de Octubre, 2026 (+1.0 falta)</div>
              <div style="font-size: 6.8px; color: #166534; margin-top: 2px;">Certificado Pediatra presentado y verificado.</div>
            </div>

            <div class="mini-card" style="border-left: 3px solid #1A73E8;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">Retiro Anticipado (11:30 hs)</div>
                <span class="mini-card-badge badge-blue">En Revisión</span>
              </div>
              <div style="font-size: 7px; color: #64748B;">02 de Octubre, 2026 (+0.5 falta)</div>
              <div style="font-size: 6.8px; color: #1E40AF; margin-top: 2px;">Certificado Odontológico en Preceptoría.</div>
            </div>

            <!-- BOTÓN JUSTIFICAR -->
            <div style="padding: 4px 8px;">
              <div style="background: #008C45; color: white; text-align: center; padding: 6px; border-radius: 8px; font-size: 8px; font-weight: 800; box-shadow: 0 2px 4px rgba(0,140,69,0.25);">
                + Cargar Certificado Médico
              </div>
            </div>
          </div>

          <div class="mini-tabbar">
            <div class="mini-tab-item"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLA 02</span>
            <span class="view-route-code">apps/mobile/src/screens/AttendanceScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Seguimiento de Presentismo y Justificaciones</h3>
          <p class="view-lead-desc">
            Gestiona la asistencia formal según la normativa educativa provincial. Permite auditar en tiempo real el cómputo de inasistencias fraccionarias y justificar faltas desde el celular.
          </p>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>⚡</span> Capacidades Operativas de la Pantalla
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Cómputo Fraccionario Oficial:</strong> Registra con total precisión según el reglamento:
                  <br>• <strong>0.25 de falta:</strong> Llegadas tarde (tardanzas).
                  <br>• <strong>0.50 de falta:</strong> Retiros anticipados o media jornada.
                  <br>• <strong>1.00 de falta:</strong> Inasistencia a jornada completa.
                </div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Semáforo de Regularidad Escolar:</strong> Avisa preventivamente cuando el alumno se acerca al límite legal de 15 faltas anuales para evitar la pérdida de regularidad.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Carga Digital de Certificados Médicos:</strong> El tutor presiona <em>"Cargar Certificado"</em>, toma una fotografía del comprobante médico o selecciona un PDF y lo envía con observaciones directo a la terminal de Preceptoría.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Trazabilidad de Estados:</strong> Cada inasistencia exhibe su estado de auditoría en vivo (<em>Pendiente de Revisión</em>, <em>Aprobado</em> o <em>Rechazado con motivo</em>).</div>
              </li>
            </ul>
          </div>

          <div class="value-prop-grid">
            <div class="value-prop-card">
              <h5>Para la Familia</h5>
              <p>Elimina el riesgo de certificados perdidos en la mochila y brinda certeza matemática sobre las faltas reales.</p>
            </div>
            <div class="value-prop-card">
              <h5>Para la Escuela</h5>
              <p>Preceptoría valida certificados con un clic, sincronizando las planillas oficiales sin transcripción manual.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 4 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 5: PANTALLA 3 — SEGURIDAD Y RETIRO DE ALUMNOS (PickupScreen)        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vista 03 · Seguridad y Retiro de Alumnos</div>
            <div class="page-header-subtitle">PickupScreen.tsx — Sistema de Salida Segura con QR Dinámico</div>
          </div>
        </div>
        <div class="page-header-badge">Seguridad Escolar</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: PICKUP -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <div class="phone-status-bar" style="background: #008C45;">
            <span>12:28</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>98%</span>
            </div>
          </div>

          <div class="phone-screen-body">
            <div class="mini-hero-banner" style="padding-bottom: 8px;">
              <div class="mini-hero-title">Salida y Retiro Seguro</div>
              <div class="mini-hero-sub">Pase Electrónico de Puerta</div>
            </div>

            <!-- TARJETA QR DINÁMICO -->
            <div class="mini-card" style="text-align: center; margin-top: -6px; border: 2px solid #008C45;">
              <div style="font-size: 7.5px; font-weight: 800; color: #005F2E; text-transform: uppercase;">Código QR Dinámico</div>
              <div style="font-size: 6.5px; color: #64748B; margin-bottom: 4px;">Rotación de seguridad en pantalla</div>

              <!-- SIMULACIÓN QR BOX -->
              <div style="width: 86px; height: 86px; margin: 0 auto; background: #0F172A; border-radius: 8px; padding: 4px; display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="background: white; width: 100%; height: 100%; border-radius: 6px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; padding: 3px;">
                  <div style="background: black;"></div><div style="background: black;"></div><div style="background: white;"></div><div style="background: black;"></div>
                  <div style="background: black;"></div><div style="background: white;"></div><div style="background: black;"></div><div style="background: black;"></div>
                  <div style="background: white;"></div><div style="background: black;"></div><div style="background: black;"></div><div style="background: white;"></div>
                  <div style="background: black;"></div><div style="background: white;"></div><div style="background: black;"></div><div style="background: black;"></div>
                </div>
              </div>

              <!-- CONTADOR REGRESIVO -->
              <div style="margin-top: 5px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span style="font-size: 7px; color: #64748B;">Caduca en:</span>
                <span style="background: #FEF3C7; color: #92400E; font-size: 7.5px; font-weight: 800; padding: 1px 6px; border-radius: 999px;">48 seg ⏱</span>
              </div>
            </div>

            <!-- ADULTOS AUTORIZADOS -->
            <div style="padding: 2px 8px; font-size: 7.5px; font-weight: 800; color: #64748B;">PERSONAS AUTORIZADAS (PADRÓN)</div>

            <div class="mini-card" style="padding: 5px 8px; margin: 3px 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-size: 11px;">👩</span>
                  <div>
                    <div style="font-size: 7.5px; font-weight: 800;">Laura Gómez (Madre)</div>
                    <div style="font-size: 6.5px; color: #64748B;">DNI: 34.567.890</div>
                  </div>
                </div>
                <span class="mini-card-badge badge-green">Permanente</span>
              </div>
            </div>

            <div class="mini-card" style="padding: 5px 8px; margin: 3px 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-size: 11px;">👴</span>
                  <div>
                    <div style="font-size: 7.5px; font-weight: 800;">Beatriz Rossi (Abuela)</div>
                    <div style="font-size: 6.5px; color: #64748B;">DNI: 14.890.123</div>
                  </div>
                </div>
                <span class="mini-card-badge badge-blue">Habilitada</span>
              </div>
            </div>

            <!-- BOTONES RÁPIDOS -->
            <div style="padding: 4px 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
              <div style="background: #1A73E8; color: white; text-align: center; padding: 4px; border-radius: 6px; font-size: 7px; font-weight: 800;">
                + Autorizar Tercero
              </div>
              <div style="background: #FEF3C7; color: #92400E; text-align: center; padding: 4px; border-radius: 6px; font-size: 7px; font-weight: 800; border: 1px solid #FCD34D;">
                ⏳ Demora 15 min
              </div>
            </div>
          </div>

          <div class="mini-tabbar">
            <div class="mini-tab-item"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item active"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLA 03</span>
            <span class="view-route-code">apps/mobile/src/screens/PickupScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Ecosistema de Salida y Retiro Blindado</h3>
          <p class="view-lead-desc">
            Brinda la máxima seguridad física a la salida escolar, garantizando que ningún alumno abandone el predio educativo sin autorización fehaciente de sus tutores legales.
          </p>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>⚡</span> Capacidades Operativas de la Pantalla
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Código QR Dinámico Anti-Fraude:</strong> Se actualiza cada 60 segundos con un token criptográfico efímero. Si alguien envía una captura de pantalla por WhatsApp, el código ya estará vencido al momento de llegar a la puerta del colegio.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Padrón de Adultos Habilitados:</strong> Muestra la nómina de personas aprobadas permanentemente para retirar al alumno (padres, abuelos, tíos o transportistas escolares), detallando DNI y teléfono.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Autorización Eventual Express:</strong> Ante cualquier imprevisto familiar, el tutor puede cargar una autorización para un tercero (ej. el padre de un compañero) ingresando Nombre, DNI y parentesco en segundos.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Botón de Aviso de Demora ("Llego en 15 min"):</strong> Notifica en tiempo real a la guardia y a los preceptores del patio para resguardar y acompañar al niño con total tranquilidad.</div>
              </li>
            </ul>
          </div>

          <div class="value-prop-grid">
            <div class="value-prop-card">
              <h5>Agilidad en la Salida</h5>
              <p>El personal de guardia escanea con pistola o tablet institucional y despacha en menos de 4 segundos por alumno.</p>
            </div>
            <div class="value-prop-card">
              <h5>Registro de Auditoría</h5>
              <p>Queda asentado exactamente qué adulto retiró al menor, a qué hora exacta y qué preceptor autorizó la salida.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 5 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 6: PANTALLA 4 — CUADERNO DE NIVEL INICIAL / BITÁCORA JARDÍN        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vista 04 · Cuaderno de Nivel Inicial (Jardín)</div>
            <div class="page-header-subtitle">KindergartenScreen.tsx — Bitácora Diaria Pedagógica y de Bienestar</div>
          </div>
        </div>
        <div class="page-header-badge">Salas de 2, 3, 4 y 5 Años</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: JARDÍN -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <div class="phone-status-bar" style="background: #008C45;">
            <span>13:40</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>95%</span>
            </div>
          </div>

          <div class="phone-screen-body">
            <div class="mini-hero-banner" style="padding-bottom: 8px;">
              <div class="mini-hero-title">Bitácora de Hoy 🧸</div>
              <div class="mini-hero-sub">Mateo López · Sala de 4 Años</div>
            </div>

            <!-- MOMENTO 1: INGRESO -->
            <div class="mini-card" style="margin-top: -6px; border-left: 3px solid #10B981;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">🚪 Ingreso al Jardín (08:00 hs)</div>
                <span class="mini-card-badge badge-green">Puntual</span>
              </div>
              <div style="font-size: 7px; color: #15803D; font-weight: 700;">😊 Estado: Alegre y muy participativo</div>
              <div style="font-size: 6.5px; color: #64748B;">Docente a cargo: Seño Valentina</div>
            </div>

            <!-- MOMENTO 2: COLACIÓN -->
            <div class="mini-card" style="border-left: 3px solid #F59E0B;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">🍎 Colación de la Mañana (09:45 hs)</div>
              </div>
              <div style="font-size: 7px; color: #475569;">Frutas frescas y galletitas de avena.</div>
              <div style="background: #FEF3C7; color: #92400E; font-size: 6.8px; font-weight: 800; padding: 2px 5px; border-radius: 4px; margin-top: 3px; display: inline-block;">
                Ingesta: Comió TODO ⭐
              </div>
            </div>

            <!-- MOMENTO 3: HIGIENE Y PAÑALES -->
            <div class="mini-card" style="border-left: 3px solid #0EA5E9;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">🧷 Higiene & Mudas (11:00 hs)</div>
              </div>
              <div style="display: flex; gap: 4px; margin-top: 2px;">
                <span style="background: #E0F2FE; color: #0369A1; font-size: 6.5px; font-weight: 700; padding: 1px 4px; border-radius: 4px;">11:00 hs · Húmedo (Cambiado)</span>
                <span style="background: #DCFCE7; color: #166534; font-size: 6.5px; font-weight: 700; padding: 1px 4px; border-radius: 4px;">13:30 hs · Limpio</span>
              </div>
            </div>

            <!-- MOMENTO 4: ALMUERZO -->
            <div class="mini-card" style="border-left: 3px solid #8B5CF6;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">🍲 Almuerzo Bicultural (12:15 hs)</div>
              </div>
              <div style="font-size: 7px; color: #475569;">Polenta cremosa con bolognesa casera.</div>
              <div style="background: #EDE9FE; color: #6D28D9; font-size: 6.8px; font-weight: 800; padding: 2px 5px; border-radius: 4px; margin-top: 3px; display: inline-block;">
                Ingesta: Comió la mitad
              </div>
            </div>
          </div>

          <div class="mini-tabbar">
            <div class="mini-tab-item"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLA 04</span>
            <span class="view-route-code">apps/mobile/src/screens/KindergartenScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Cuaderno Digital de Maternal e Inicial</h3>
          <p class="view-lead-desc">
            Sustituye por completo el tradicional cuaderno de comunicaciones en papel para niños de nivel inicial, brindando a las familias una ventana transparente y en tiempo real a la jornada de su hijo.
          </p>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>⚡</span> Capacidades Operativas de la Pantalla
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Línea de Tiempo Cronológica:</strong> Registra cada momento significativo del día (entrada, colación, siesta, almuerzo y juego al aire libre).</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Monitoreo Nutricional e Ingesta:</strong> Informa el menú servido y la proporción consumida por el menor (<em>Comió Todo</em>, <em>Comió la mitad</em> o <em>No quiso comer</em>), fundamental para detectar indisposiciones tempranas.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Control de Mudas e Higiene:</strong> Reporta horarios de cambio de pañal, estado (húmedo, limpio o deposición) e incidentes de muda de ropa.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Observaciones Pedagógicas y Emocionales:</strong> La maestra o auxiliar consigna el estado anímico del niño y su interacción en los talleres biculturales de italiano y expresión artística.</div>
              </li>
            </ul>
          </div>

          <div class="value-prop-grid">
            <div class="value-prop-card">
              <h5>Tranquilidad para los Padres</h5>
              <p>Los padres que trabajan pueden revisar en cualquier momento del mediodía cómo almorzó y cómo se siente su hijo.</p>
            </div>
            <div class="value-prop-card">
              <h5>Carga Rápida para la Docente</h5>
              <p>Interfaz optimizada para maestras jardineras que permite registrar novedades en grupo con un solo toque.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 6 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 7: PANTALLA 5 — CENTRO DE DOCUMENTACIÓN Y NOTAS PARCIALES          -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vista 05 · Archivos, Notas Parciales y Firma Digital</div>
            <div class="page-header-subtitle">FilesScreen.tsx — Documentación Institucional y Consentimientos</div>
          </div>
        </div>
        <div class="page-header-badge">Documentación Oficial</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: FILES -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <div class="phone-status-bar" style="background: #008C45;">
            <span>10:45</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <div class="phone-screen-body">
            <div class="mini-hero-banner" style="padding-bottom: 8px;">
              <div class="mini-hero-title">Archivos y Documentos</div>
              <div class="mini-hero-sub">Notas Parciales, circulares y trámites</div>
            </div>

            <!-- FILTRO DE CATEGORÍAS (ACTUALIZADO CON NOTAS PARCIALES) -->
            <div style="display: flex; gap: 4px; padding: 6px 8px; overflow: hidden; background: white; border-bottom: 1px solid #E2E8F0;">
              <span style="font-size: 7px; font-weight: 800; background: #008C45; color: white; padding: 2px 6px; border-radius: 999px;">Todos</span>
              <span style="font-size: 7px; font-weight: 800; background: #F1F5F9; color: #005F2E; padding: 2px 6px; border-radius: 999px; border: 1px solid #A7F3D0;">Notas Parciales</span>
              <span style="font-size: 7px; font-weight: 700; background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 999px;">Autorizaciones</span>
            </div>

            <!-- ACCIÓN REQUERIDA (FIRMA DIGITAL) -->
            <div class="mini-card" style="border: 1.5px solid #CD212A; background: #FFF1F2; margin-top: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 6.8px; font-weight: 800; background: #CD212A; color: white; padding: 1px 4px; border-radius: 3px;">FIRMA PENDIENTE</span>
                <span style="font-size: 6.5px; color: #9F1239; font-weight: 700;">Vence en 48 hs</span>
              </div>
              <div style="font-size: 8px; font-weight: 800; color: #0F172A; margin-top: 2px;">Salida Didáctica: Museo Provincial</div>
              <div style="font-size: 6.8px; color: #475569;">Mateo López · Sala de 4 Años</div>
              <div style="background: #CD212A; color: white; text-align: center; font-size: 7px; font-weight: 800; padding: 3px; border-radius: 5px; margin-top: 4px;">
                ✍ Firmar con PIN
              </div>
            </div>

            <!-- SECCIÓN: NOTAS PARCIALES E INFORMES EVALUATIVOS (ACTUALIZADA) -->
            <div style="padding: 2px 8px 0 8px; font-size: 7.5px; font-weight: 800; color: #005F2E;">NOTAS PARCIALES E INFORMES</div>

            <div class="mini-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 7.8px; font-weight: 800; color: #0F172A;">Notas Parciales 1° Ciclo</div>
                  <div style="font-size: 6.5px; color: #64748B;">Sofía López · 4° Grado "B" (2.4 MB)</div>
                </div>
                <span class="mini-card-badge badge-blue">PDF Oficial</span>
              </div>
              <div style="display: flex; gap: 4px; margin-top: 4px;">
                <div style="background: #F1F5F9; color: #475569; font-size: 6.5px; font-weight: 700; padding: 2px 5px; border-radius: 4px; flex: 1; text-align: center;">Vista Previa</div>
                <div style="background: #008C45; color: white; font-size: 6.5px; font-weight: 700; padding: 2px 5px; border-radius: 4px; flex: 1; text-align: center;">Descargar</div>
              </div>
            </div>

            <!-- SUBIR DOCUMENTACIÓN -->
            <div style="padding: 2px 8px;">
              <div style="background: #F0FDF4; border: 1px dashed #008C45; border-radius: 8px; padding: 5px; text-align: center;">
                <div style="font-size: 7px; font-weight: 800; color: #005F2E;">¿Enviar constancias o fichas médicas?</div>
                <div style="font-size: 6.5px; color: #166534;">Toma foto o adjunta tu comprobante aquí.</div>
              </div>
            </div>
          </div>

          <div class="mini-tabbar">
            <div class="mini-tab-item"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item active"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLA 05</span>
            <span class="view-route-code">apps/mobile/src/screens/FilesScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Repositorio de Notas Parciales y Firma Digital</h3>
          <p class="view-lead-desc">
            Centraliza la documentación escolar, el repositorio histórico de rendimiento académico bajo el nuevo estándar de <strong>Notas Parciales</strong> y el motor de firma digital segura.
          </p>

          <div class="highlight-change-banner">
            <div class="highlight-change-badge">★ Cambio Realizado: Nomenclatura en Documentos</div>
            <div class="highlight-change-text">
              La categoría de archivos y los reportes de rendimiento fueron actualizados: ahora se titulan <strong>"Notas Parciales 1° Ciclo"</strong> y el chip de filtrado lleva la etiqueta <strong>"Notas Parciales"</strong> en lugar de "Boletines".
            </div>
          </div>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>⚡</span> Capacidades Operativas de la Pantalla
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Descarga y Visualización de Notas Parciales:</strong> Descarga directa en PDF con sello de agua institucional y firma digital de la dirección para validez en traslados y trámites.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Firma Digital con PIN de Tutor:</strong> Para autorizaciones de salidas pedagógicas, los tutores ingresan su PIN personal de 6 dígitos. La app estampa fecha, hora e ID criptográfico del firmante.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Filtro Multicategoría:</strong> Segmentación instantánea por <em>Todos</em>, <em>Notas Parciales</em>, <em>Autorizaciones</em>, <em>Circulares</em> y <em>Fichas Médicas</em>.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Carga de Documentos desde la Cámara:</strong> Permite enviar fotos de aptos físicos, fichas de salud o certificados bucodentales directo a la secretaría del colegio.</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 7 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 8: PANTALLA 6 — MENSAJERÍA ESCOLAR Y COMUNICACIÓN DIRECTA           -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vista 06 · Mensajería Escolar Directa y Segura</div>
            <div class="page-header-subtitle">MessagesScreen.tsx — Canales Oficiales sin Grupos Caóticos</div>
          </div>
        </div>
        <div class="page-header-badge">Comunicación Institucional</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: MESSAGES -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <div class="phone-status-bar" style="background: #008C45;">
            <span>11:15</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <div class="phone-screen-body">
            <div class="mini-hero-banner" style="padding-bottom: 8px;">
              <div class="mini-hero-title">Mensajes Escolares 💬</div>
              <div class="mini-hero-sub">Canales directos y confidenciales</div>
            </div>

            <!-- CHIP FILTRO -->
            <div style="display: flex; gap: 4px; padding: 6px 8px; background: white; border-bottom: 1px solid #E2E8F0;">
              <span style="font-size: 7px; font-weight: 800; background: #008C45; color: white; padding: 2px 6px; border-radius: 999px;">Todos</span>
              <span style="font-size: 7px; font-weight: 700; background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 999px;">Mateo</span>
              <span style="font-size: 7px; font-weight: 700; background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 999px;">Sofía</span>
            </div>

            <!-- HILO 1: SEÑO VALENTINA -->
            <div class="mini-card" style="border-left: 3px solid #008C45; margin-top: 6px;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">Seño Valentina · Sala de 4</div>
                <span style="background: #CD212A; color: white; font-size: 6.5px; font-weight: 800; padding: 1px 4px; border-radius: 999px;">2</span>
              </div>
              <div style="font-size: 7px; font-weight: 700; color: #0F172A;">Taller bicultural y témperas</div>
              <div style="font-size: 6.5px; color: #64748B; margin-top: 1px;">"¡Hola familia! Les comparto que Mateo participó cantando en italiano..."</div>
              <div style="font-size: 6px; color: #94A3B8; margin-top: 3px; text-align: right;">12:45 PM</div>
            </div>

            <!-- HILO 2: PROF CARLOS -->
            <div class="mini-card" style="border-left: 3px solid #1A73E8;">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">Prof. Carlos · Ed. Física</div>
                <span style="font-size: 6.5px; color: #64748B;">Ayer</span>
              </div>
              <div style="font-size: 7px; font-weight: 700; color: #0F172A;">Ficha médica de natación</div>
              <div style="font-size: 6.5px; color: #64748B; margin-top: 1px;">"Recibido el apto de Sofía. Queda habilitada para el torneo de natación."</div>
            </div>

            <!-- HILO 3: GABINETE PSICOPEDAGÓGICO -->
            <div class="mini-card">
              <div class="mini-card-header">
                <div style="font-size: 8px; font-weight: 800;">Gabinete Psicopedagógico</div>
                <span style="font-size: 6.5px; color: #64748B;">20 Oct</span>
              </div>
              <div style="font-size: 7px; font-weight: 700; color: #0F172A;">Devolución de entrevista familiar</div>
              <div style="font-size: 6.5px; color: #64748B; margin-top: 1px;">"Agradecemos su presencia en la reunión trimestral de seguimiento..."</div>
            </div>

            <!-- BOTÓN REDACTAR -->
            <div style="padding: 4px 8px; margin-top: 4px;">
              <div style="background: #008C45; color: white; text-align: center; padding: 6px; border-radius: 8px; font-size: 7.5px; font-weight: 800;">
                ✏️ Nuevo Mensaje Institucional
              </div>
            </div>
          </div>

          <div class="mini-tabbar">
            <div class="mini-tab-item"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item active"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLA 06</span>
            <span class="view-route-code">apps/mobile/src/screens/MessagesScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Comunicación Directa, Privada y Respetuosa</h3>
          <p class="view-lead-desc">
            Sustituye los caóticos e invasivos grupos de WhatsApp por canales institucionales seguros, protegiendo la privacidad del número telefónico de docentes y familias.
          </p>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>⚡</span> Capacidades Operativas de la Pantalla
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Canales Específicos por Rol:</strong> La familia se comunica con el interlocutor exacto según la necesidad:
                  <br>• <strong>Docente de Sala/Grado:</strong> Asuntos pedagógicos cotidianos.
                  <br>• <strong>Profesores Especiales:</strong> Educación Física, Música, Italiano y Arte.
                  <br>• <strong>Gabinete de Orientación:</strong> Acompañamiento psicopedagógico confidencial.
                  <br>• <strong>Secretaría y Administración:</strong> Consultas arancelarias y constancias.
                </div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Privacidad Total de Datos:</strong> Ni los docentes ni los padres exponen sus teléfonos particulares. Todas las conversaciones están encriptadas y respaldadas en los servidores institucionales.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Horarios de Descanso y Desconexión:</strong> El sistema respeta el derecho a la desconexión del cuerpo docente; los mensajes enviados fuera de horario quedan en cola para ser leídos al día hábil siguiente.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Trazabilidad de Respuestas:</strong> Alertas con globo rojo para mensajes no leídos y confirmación de recepción.</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 8 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 9: PANTALLA 7 Y 8 — GALERÍA Y COMUNICACIONES INSTITUCIONALES        -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Vistas 07 y 08 · Galería Protegida y Comunicaciones</div>
            <div class="page-header-subtitle">GalleryScreen.tsx & CommunicationsScreen.tsx — Vida Institucional</div>
          </div>
        </div>
        <div class="page-header-badge">Comunidad & Eventos</div>
      </div>

      <div class="screen-page-grid">
        <!-- SMARTPHONE MOCKUP: GALLERY -->
        <div class="phone-mockup">
          <div class="phone-island">
            <div class="phone-sensor"></div>
            <div class="phone-camera-lens"></div>
          </div>

          <div class="phone-status-bar" style="background: #008C45;">
            <span>15:30</span>
            <div style="display: flex; gap: 4px; font-size: 8px;">
              <span>5G</span>
              <span>90%</span>
            </div>
          </div>

          <div class="phone-screen-body">
            <div class="mini-hero-banner" style="padding-bottom: 8px;">
              <div class="mini-hero-title">Galería Institucional 📷</div>
              <div class="mini-hero-sub">Fotos protegidas y eventos escolares</div>
            </div>

            <!-- CHIPS EVENTOS -->
            <div style="display: flex; gap: 4px; padding: 6px 8px; background: white; border-bottom: 1px solid #E2E8F0;">
              <span style="font-size: 7px; font-weight: 800; background: #008C45; color: white; padding: 2px 6px; border-radius: 999px;">Todas</span>
              <span style="font-size: 7px; font-weight: 700; background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 999px;">Actos</span>
              <span style="font-size: 7px; font-weight: 700; background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 999px;">Deportes</span>
            </div>

            <!-- ÁLBUM 1 DESTACADO -->
            <div class="mini-card" style="margin-top: 6px; padding: 6px;">
              <div style="height: 60px; background: linear-gradient(135deg, #008C45, #1A73E8); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                🎭
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <div style="font-size: 8px; font-weight: 800; color: #0F172A;">Festa della Repubblica 🇮🇹</div>
                <span class="mini-card-badge badge-green">34 Fotos</span>
              </div>
              <div style="font-size: 6.5px; color: #64748B;">Acto conmemorativo y danzas típicas.</div>
            </div>

            <!-- ÁLBUM 2 -->
            <div class="mini-card" style="padding: 6px;">
              <div style="height: 50px; background: linear-gradient(135deg, #3898EC, #0284C7); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                🔬
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <div style="font-size: 8px; font-weight: 800; color: #0F172A;">Feria Bilingüe de Ciencias</div>
                <span class="mini-card-badge badge-blue">28 Fotos</span>
              </div>
              <div style="font-size: 6.5px; color: #64748B;">Proyectos de 4° Grado "B".</div>
            </div>

            <div style="padding: 4px 8px;">
              <div style="background: #1A73E8; color: white; text-align: center; padding: 5px; border-radius: 6px; font-size: 7px; font-weight: 800;">
                ⬇️ Descargar Álbum en Alta Resolución
              </div>
            </div>
          </div>

          <div class="mini-tabbar">
            <div class="mini-tab-item"><div class="mini-tab-icon">🏠</div>Inicio</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">💬</div>Mensajes</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">📁</div>Archivos</div>
            <div class="mini-tab-item active"><div class="mini-tab-icon">📷</div>Galería</div>
            <div class="mini-tab-item"><div class="mini-tab-icon">🛡️</div>Seguridad</div>
          </div>
          <div class="phone-home-indicator"></div>
        </div>

        <!-- RIGHT DETAIL COLUMN -->
        <div class="view-content-col">
          <div class="view-badge-row">
            <span class="view-number-pill">PANTALLAS 07 Y 08</span>
            <span class="view-route-code">GalleryScreen.tsx & CommunicationsScreen.tsx</span>
          </div>

          <h3 class="view-main-title">Galería Segura y Comunicaciones Circulares</h3>
          <p class="view-lead-desc">
            Espacio de conexión con la vida escolar cotidiana y canal de circulares formales con constancia de lectura para las familias.
          </p>

          <div class="capabilities-box">
            <div class="capabilities-box-title">
              <span>📷</span> Capacidades de la Galería Escolar
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Privacidad Estricta de Menores:</strong> Las fotografías están protegidas dentro de la red del colegio; no son públicas ni indexables en motores de búsqueda de internet.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Segmentación por Curso y Nivel:</strong> Los padres de Nivel Inicial acceden a los álbumes de su sala, y los de Primaria a sus actos correspondientes.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Descarga Segura en HD:</strong> Opción para guardar las fotos del anuario o actos escolares en alta resolución para el recuerdo familiar.</div>
              </li>
            </ul>
          </div>

          <div class="capabilities-box" style="margin-top: 4px;">
            <div class="capabilities-box-title" style="color: #1A73E8;">
              <span>📢</span> Capacidades de Comunicaciones Oficiales
            </div>
            <ul class="cap-list">
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Circulares con Acuse de Recibo:</strong> La dirección sabe exactamente qué porcentaje de familias leyó la comunicación oficial.</div>
              </li>
              <li>
                <span class="cap-icon">✔</span>
                <div><strong>Filtro de Prioridad Institucional:</strong> Avisos urgentes fijados al tope de pantalla con confirmación requerida.</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 9 de 10</span>
      </div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PÁGINA 10: MATRIZ RESUMEN DE FUNCIONALIDADES Y FICHA TÉCNICA               -->
  <!-- ========================================================================= -->
  <div class="page">
    <div>
      <div class="page-header">
        <div class="page-header-brand">
          <img src="${logoBase64}" class="page-header-logo" alt="Logo">
          <div>
            <div class="page-header-title">Matriz de Capacidades y Especificaciones Técnicas</div>
            <div class="page-header-subtitle">Resumen Ejecutivo para Autoridades y Equipo de Desarrollo</div>
          </div>
        </div>
        <div class="page-header-badge">Ficha Técnica v2.0</div>
      </div>

      <div style="margin-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">
          Matriz de Capacidades por Perfil de Alumno
        </h3>
        <p style="font-size: 11.5px; color: #64748B;">
          BiliAPP adapta su interfaz de forma inteligente dependiendo de si el alumno seleccionado asiste a Nivel Inicial (Jardín) o a Nivel Primario / Secundario:
        </p>

        <table class="summary-table">
          <thead>
            <tr>
              <th style="width: 28%;">Funcionalidad</th>
              <th style="width: 24%;">Nivel Inicial (Jardín)</th>
              <th style="width: 28%;">Primaria y Secundaria</th>
              <th style="width: 20%;">Módulo Mobile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Notas Parciales</strong></td>
              <td>Informes Cualitativos Bimestrales</td>
              <td><strong>Notas Parciales y Escala Numérica</strong></td>
              <td><code>HomeScreen / FilesScreen</code></td>
            </tr>
            <tr>
              <td><strong>Salida Segura (QR)</strong></td>
              <td>QR Dinámico + Padrón Adultos</td>
              <td>QR Dinámico + Salida Autónoma</td>
              <td><code>PickupScreen</code></td>
            </tr>
            <tr>
              <td><strong>Presentismo y Faltas</strong></td>
              <td>Cómputo Fraccionario + Justificación</td>
              <td>Cómputo Fraccionario + Alerta 15 Faltas</td>
              <td><code>AttendanceScreen</code></td>
            </tr>
            <tr>
              <td><strong>Bitácora Diaria</strong></td>
              <td>Comidas, Higiene, Siesta y Humor</td>
              <td>Horarios de Talleres y Materias</td>
              <td><code>KindergartenScreen</code></td>
            </tr>
            <tr>
              <td><strong>Firma Digital (PIN)</strong></td>
              <td>Salidas de Plaza y Paseos</td>
              <td>Campamentos y Salidas de Estudio</td>
              <td><code>FilesScreen</code></td>
            </tr>
            <tr>
              <td><strong>Mensajería Oficial</strong></td>
              <td>Seño de Sala y Auxiliares</td>
              <td>Docente de Grado, Preceptores, Profs.</td>
              <td><code>MessagesScreen</code></td>
            </tr>
            <tr>
              <td><strong>Galería Protegida</strong></td>
              <td>Álbumes cerrados por Sala</td>
              <td>Torneos, Actos y Proyectos</td>
              <td><code>GalleryScreen</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- FICHA TÉCNICA -->
      <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 12px 14px; margin-bottom: 12px;">
        <h4 style="font-size: 12px; font-weight: 800; color: #005F2E; text-transform: uppercase; margin-bottom: 6px;">
          Ficha Técnica de la Solución Mobile
        </h4>
        <div class="tech-stack-badge-row">
          <span class="tech-badge">React Native 0.88</span>
          <span class="tech-badge">Expo SDK 58</span>
          <span class="tech-badge">TypeScript 5.7</span>
          <span class="tech-badge">Turbo Monorepo</span>
          <span class="tech-badge">React Navigation v7</span>
          <span class="tech-badge">Vector Icons 15</span>
          <span class="tech-badge">Safe Area Context</span>
        </div>
        <p style="font-size: 11px; color: #475569; line-height: 1.45; margin-top: 6px;">
          La aplicación móvil está construida sobre una arquitectura desacoplada que comparte tipos y validadores a través de los paquetes compartidos <code>@biliapp/shared-types</code> y <code>@biliapp/validators</code>, asegurando que las reglas de negocio de notas, asistencia y retiros coincidan exactamente entre la app de los padres y el portal web docente y administrativo.
        </p>
      </div>

      <!-- CONCLUSIÓN Y FIRMA INSTITUCIONAL -->
      <div style="border-top: 1.5px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11.5px; font-weight: 800; color: #0F172A;">Instituto República de Italia — Entre Ríos, Argentina</div>
          <div style="font-size: 10px; color: #64748B;">Proyecto BiliAPP · Transformación Digital Escolar 2026</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10.5px; font-weight: 800; color: #008C45;">Documento Oficial Aprobado</div>
          <div style="font-size: 9.5px; color: #94A3B8;">Nomenclatura: Notas Parciales</div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div>Manual de Vistas y Funcionalidades · BiliAPP Mobile</div>
      <div class="page-footer-right">
        <span>Página 10 de 10</span>
      </div>
    </div>
  </div>

</body>
</html>
`;

// Write HTML
const htmlFilePath = path.join(__dirname, '../BiliAPP_Mobile_Manual_Vistas.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML preview generated at:', htmlFilePath);

// Compile PDF via Edge/Chrome headless
const pdfFilePath = path.join(__dirname, '../BiliAPP_Mobile_Manual_Vistas_y_Funcionalidades.pdf');
const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'edge-pdf-profile');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserExe = fs.existsSync(edgePath) ? edgePath : chromePath;

console.log('Compiling PDF using browser:', browserExe);

const cmd = `"${browserExe}" --headless=new --disable-gpu --user-data-dir="${tempProfile}" --print-to-pdf="${pdfFilePath}" --no-pdf-header-footer "${htmlFilePath}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfFilePath)) {
    const stats = fs.statSync(pdfFilePath);
    console.log('PDF generated successfully! Size: ' + (stats.size / 1024).toFixed(1) + ' KB at: ' + pdfFilePath);
  } else {
    console.error('PDF file was not created.');
  }
} catch (err) {
  console.error('Error generating PDF:', err.message);
}
