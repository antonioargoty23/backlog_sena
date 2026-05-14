/* ═══════════════════════════════════════════════════════════════
   BACKLOG BUILDER · SENA
   app.js — Lógica principal de la aplicación
   ═══════════════════════════════════════════════════════════════ */

// ── Estado de la aplicación ──────────────────────────────────
const State = {
  proyecto: { ...AppData.proyecto },
  epicas: [...AppData.epicas],
  historias: [...AppData.historias],
  tareas: [...AppData.tareas],
  sidebarCollapsed: false,
  vistaActual: 'backlog',
  huSeleccionada: null
};

// ── Utilidades ───────────────────────────────────────────────
function $id(id) { return document.getElementById(id); }

function prioBadge(p) {
  if (!p) return '';
  const lower = p.toLowerCase();
  if (lower === 'alta')  return `<span class="badge badge-alta">Alta</span>`;
  if (lower === 'media') return `<span class="badge badge-media">Media</span>`;
  return `<span class="badge badge-baja">Baja</span>`;
}

function estadoBadge(e) {
  if (!e) return '';
  if (e === 'En progreso') return `<span class="badge badge-progreso">En progreso</span>`;
  if (e === 'Hecho')       return `<span class="badge badge-hecho">Hecho</span>`;
  return `<span class="badge badge-hacer">Por hacer</span>`;
}

function showToast(msg) {
  const t = $id('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function openModal(id) { $id(id).classList.add('open'); }
function closeModal(id) { $id(id).classList.remove('open'); }

function spTotal(epicaId) {
  return State.historias
    .filter(h => h.epicaId === epicaId)
    .reduce((s, h) => s + (parseInt(h.sp) || 0), 0);
}

// ── Sidebar toggle ───────────────────────────────────────────
function toggleSidebar() {
  State.sidebarCollapsed = !State.sidebarCollapsed;
  const sidebar = $id('app-sidebar');
  const brand   = $id('header-brand');
  sidebar.classList.toggle('collapsed', State.sidebarCollapsed);
  brand.classList.toggle('collapsed', State.sidebarCollapsed);
}

// ── Render Sidebar ───────────────────────────────────────────
function renderSidebar() {
  const container = $id('sidebar-body');
  container.innerHTML = State.epicas.map(ep => {
    const hus = State.historias.filter(h => h.epicaId === ep.id);
    return `
      <div class="sidebar-epica">
        <div class="sidebar-epica-header" onclick="toggleEpicaSidebar('${ep.id}')">
          <span class="epica-badge-sm">${ep.id}</span>
          <span class="sidebar-epica-name">${ep.titulo}</span>
          <span class="sidebar-epica-count">${hus.length}</span>
          <span class="sidebar-chevron open" id="schev-${ep.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
        <div class="sidebar-hu-list open" id="shu-${ep.id}">
          ${hus.map(h => `
            <div class="sidebar-hu-item ${State.huSeleccionada === h.id ? 'selected' : ''}"
                 onclick="editarHU('${h.id}')">
              <span class="hu-badge-sm">${h.id}</span>
              <span class="hu-preview-text">Como ${h.rol}, ${h.deseo.substring(0, 50)}…</span>
            </div>
          `).join('')}
          <button class="sidebar-add-hu" onclick="abrirModalHUEnEpica('${ep.id}')">+ Historia</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML += `
    <button class="sidebar-add-epica" onclick="abrirModalEpica()">+ Agregar épica</button>
  `;
}

function toggleEpicaSidebar(id) {
  const list = $id('shu-' + id);
  const chev = $id('schev-' + id);
  list.classList.toggle('open');
  chev.classList.toggle('open');
}

// ── Render Backlog principal ─────────────────────────────────
function renderBacklog() {
  // Actualizar subheader
  $id('inp-proyecto').value = State.proyecto.nombre;
  $id('inp-dueno').value = State.proyecto.dueno;

  // Stats
  const totalHU = State.historias.length;
  const totalSP = State.historias.reduce((s, h) => s + (parseInt(h.sp) || 0), 0);
  const sprints  = [...new Set(State.historias.map(h => h.sprint).filter(Boolean))].length;

  $id('stat-epicas').textContent   = State.epicas.length;
  $id('stat-historias').textContent = totalHU;
  $id('stat-sp').textContent       = totalSP;
  $id('stat-sprints').textContent  = sprints;

  // Tablas de épicas
  const container = $id('backlog-tables');
  container.innerHTML = State.epicas.map(ep => {
    const hus = State.historias.filter(h => h.epicaId === ep.id);
    const sp  = spTotal(ep.id);
    return `
      <div class="epica-section">
        <div class="epica-section-header">
          <span class="epica-badge-main">${ep.id}</span>
          <span class="epica-section-title">${ep.titulo}</span>
          <div class="epica-meta">
            <span class="epica-hu-count">${hus.length} historia${hus.length !== 1 ? 's' : ''}</span>
            <span class="epica-sp-total">${sp} SP</span>
          </div>
        </div>
        ${hus.length > 0 ? `
          <div class="hu-table-wrap">
            <table class="hu-table">
              <thead>
                <tr>
                  <th style="width:56px">ID</th>
                  <th style="min-width:240px">Historia de usuario</th>
                  <th style="min-width:200px">Criterios de aceptación (resumen)</th>
                  <th style="width:80px">Prioridad</th>
                  <th style="width:44px">SP</th>
                  <th style="width:64px">Sprint</th>
                  <th style="width:100px">Estado</th>
                  <th style="width:100px">Responsable</th>
                  <th style="width:36px"></th>
                </tr>
              </thead>
              <tbody>
                ${hus.map(h => {
                  const criteriosList = (h.criterios || '').split('\n')
                    .filter(l => l.trim())
                    .slice(0, 3)
                    .map(l => `<li>${l.trim()}</li>`)
                    .join('');
                  return `
                    <tr>
                      <td class="td-hu-id">${h.id}</td>
                      <td class="td-hu-story">
                        <div class="td-hu-rol">Como ${h.rol},</div>
                        <div class="td-hu-deseo">${h.deseo}</div>
                      </td>
                      <td class="td-hu-criterios"><ul>${criteriosList}</ul></td>
                      <td>${prioBadge(h.prioridad)}</td>
                      <td><span class="badge-sp">${h.sp || '—'}</span></td>
                      <td>${h.sprint ? `<span class="badge-sprint">S${h.sprint}</span>` : '—'}</td>
                      <td>${estadoBadge(h.estado)}</td>
                      <td style="font-size:12px;color:var(--text-secondary)">${h.responsable || '—'}</td>
                      <td>
                        <div class="row-actions">
                          <button class="row-menu-btn" onclick="editarHU('${h.id}')" title="Editar">⋮</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty-epica">Sin historias. <a href="#" onclick="abrirModalHUEnEpica('${ep.id}'); return false;" style="color:var(--sena-green)">Agregar la primera</a></div>`}
      </div>
    `;
  }).join('');
}

// ── Render vista Tareas ──────────────────────────────────────
function renderHUSelector() {
  const list = $id('hu-selector-list');
  list.innerHTML = State.historias.map(h => {
    const ep = State.epicas.find(e => e.id === h.epicaId);
    return `
      <div class="hu-selector-item ${State.huSeleccionada === h.id ? 'selected' : ''}"
           onclick="seleccionarHU('${h.id}')">
        <div class="hu-sel-id">${h.id}</div>
        <div class="hu-sel-name">${h.nombre}</div>
        <div class="hu-sel-epica">${ep ? ep.id + ' · ' + ep.titulo.substring(0, 28) + '…' : ''}</div>
      </div>
    `;
  }).join('');
}

function seleccionarHU(id) {
  State.huSeleccionada = id;
  renderHUSelector();
  renderTareasContent();
}

function renderTareasContent() {
  const content = $id('tareas-main-content');
  if (!State.huSeleccionada) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">⚙️</div>
        <h3>Selecciona una historia de usuario</h3>
        <p>Verás aquí las tareas asociadas y podrás agregar nuevas.</p>
      </div>`;
    return;
  }
  const hu = State.historias.find(h => h.id === State.huSeleccionada);
  const tareasHU = State.tareas.filter(t => t.huId === State.huSeleccionada);

  content.innerHTML = `
    <div class="tareas-header-card">
      <div>
        <h2><span style="color:var(--sena-green);font-family:var(--font-mono)">${hu.id}</span> · ${hu.nombre}</h2>
        <p>Como ${hu.rol} · Épica: ${hu.epicaId} · ${tareasHU.length} tarea(s)</p>
      </div>
      <button class="btn-header btn-epica" onclick="abrirModalTarea()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Tarea
      </button>
    </div>
    ${tareasHU.length === 0
      ? `<div class="empty-state"><div class="es-icon">📋</div><h3>Sin tareas aún</h3><p>Agrega la primera tarea para esta historia.</p></div>`
      : tareasHU.map(t => `
          <div class="tarea-card">
            <div class="tarea-card-head">
              <span class="tarea-id-badge">${t.id}</span>
              <span class="tarea-nombre">${t.nombre}</span>
              <span class="${t.tipo.includes('RNF') ? 'badge-rnf' : 'badge-rf'}">${t.tipo}</span>
              <button class="row-menu-btn" onclick="eliminarTarea('${t.id}')" title="Eliminar" style="color:var(--priority-alta-text)">✕</button>
            </div>
            <div class="tarea-card-body">
              <div class="tarea-field">
                <div class="tf-label">Responsable</div>
                <div class="tf-val">${t.responsable || '—'}</div>
              </div>
              <div class="tarea-field">
                <div class="tf-label">Estimación</div>
                <div class="tf-val">${t.estimacion ? t.estimacion + ' día(s)' : '—'}</div>
              </div>
              <div class="tarea-field">
                <div class="tf-label">Prioridad</div>
                <div class="tf-val">${t.prioridad}</div>
              </div>
              <div class="tarea-field-full">
                <div class="tf-label">Avance · ${t.estado || 0}%
                  ${t.dependencias ? `<span style="margin-left:12px;color:var(--text-muted)">Depende de: <strong>${t.dependencias}</strong></span>` : ''}
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${t.estado || 0}%"></div>
                </div>
              </div>
            </div>
          </div>
        `).join('')
    }
  `;
}

// ── Switch vistas ────────────────────────────────────────────
function switchVista(v) {
  State.vistaActual = v;
  document.querySelectorAll('.nav-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && v === 'backlog') || (i === 1 && v === 'tareas'));
  });
  $id('view-backlog').classList.toggle('active', v === 'backlog');
  $id('view-tareas').classList.toggle('active', v === 'tareas');
  if (v === 'tareas') { renderHUSelector(); renderTareasContent(); }
}

// ── Modales Épica ────────────────────────────────────────────
function abrirModalEpica() {
  $id('m-ep-id').value    = `EP0${State.epicas.length + 1}`;
  $id('m-ep-titulo').value = '';
  $id('m-ep-rol').value    = '';
  $id('m-ep-deseo').value  = '';
  $id('m-ep-para').value   = '';
  openModal('modal-epica');
}

function guardarEpica() {
  const ep = {
    id:     $id('m-ep-id').value.trim(),
    titulo: $id('m-ep-titulo').value.trim(),
    rol:    $id('m-ep-rol').value.trim(),
    deseo:  $id('m-ep-deseo').value.trim(),
    para:   $id('m-ep-para').value.trim()
  };
  if (!ep.id || !ep.titulo) { alert('El ID y el título son obligatorios.'); return; }
  if (State.epicas.find(e => e.id === ep.id)) { alert('Ya existe una épica con ese ID.'); return; }
  State.epicas.push(ep);
  closeModal('modal-epica');
  renderAll();
  showToast('✔ Épica ' + ep.id + ' creada');
}

// ── Modales Historia ─────────────────────────────────────────
function poblarSelectEpicas(selectId, valorDefecto) {
  const sel = $id(selectId);
  sel.innerHTML = State.epicas.map(e =>
    `<option value="${e.id}" ${e.id === valorDefecto ? 'selected' : ''}>${e.id} · ${e.titulo}</option>`
  ).join('');
}

function abrirModalHU() {
  poblarSelectEpicas('m-hu-epica', null);
  $id('m-hu-id').value     = `H${String(State.historias.length + 1).padStart(2, '0')}`;
  $id('m-hu-nombre').value = $id('m-hu-rol').value = $id('m-hu-deseo').value =
  $id('m-hu-para').value   = $id('m-hu-criterios').value = $id('m-hu-responsable').value =
  $id('m-hu-comentarios').value = '';
  $id('m-hu-prioridad').value = 'Alta';
  $id('m-hu-sp').value     = '3';
  $id('m-hu-sprint').value = '1';
  $id('m-hu-estado').value = 'Por hacer';
  openModal('modal-hu');
}

function abrirModalHUEnEpica(epicaId) {
  abrirModalHU();
  poblarSelectEpicas('m-hu-epica', epicaId);
}

function editarHU(id) {
  const h = State.historias.find(x => x.id === id);
  if (!h) return;
  poblarSelectEpicas('m-hu-epica', h.epicaId);
  $id('m-hu-id').value          = h.id;
  $id('m-hu-nombre').value      = h.nombre;
  $id('m-hu-rol').value         = h.rol;
  $id('m-hu-deseo').value       = h.deseo;
  $id('m-hu-para').value        = h.para;
  $id('m-hu-criterios').value   = h.criterios;
  $id('m-hu-prioridad').value   = h.prioridad;
  $id('m-hu-sp').value          = h.sp;
  $id('m-hu-sprint').value      = h.sprint;
  $id('m-hu-estado').value      = h.estado;
  $id('m-hu-responsable').value = h.responsable;
  $id('m-hu-comentarios').value = h.comentarios;
  // Marcar edición
  $id('modal-hu').dataset.editId = id;
  openModal('modal-hu');
}

function guardarHU() {
  const editId = $id('modal-hu').dataset.editId;
  const hu = {
    id:           $id('m-hu-id').value.trim(),
    epicaId:      $id('m-hu-epica').value,
    nombre:       $id('m-hu-nombre').value.trim(),
    rol:          $id('m-hu-rol').value.trim(),
    deseo:        $id('m-hu-deseo').value.trim(),
    para:         $id('m-hu-para').value.trim(),
    criterios:    $id('m-hu-criterios').value.trim(),
    prioridad:    $id('m-hu-prioridad').value,
    sp:           $id('m-hu-sp').value,
    sprint:       $id('m-hu-sprint').value,
    estado:       $id('m-hu-estado').value,
    responsable:  $id('m-hu-responsable').value.trim(),
    comentarios:  $id('m-hu-comentarios').value.trim()
  };
  if (!hu.id || !hu.nombre) { alert('El ID y el nombre son obligatorios.'); return; }
  if (editId) {
    State.historias = State.historias.map(x => x.id === editId ? hu : x);
    delete $id('modal-hu').dataset.editId;
    showToast('✔ Historia ' + hu.id + ' actualizada');
  } else {
    if (State.historias.find(x => x.id === hu.id)) { alert('Ya existe una historia con ese ID.'); return; }
    State.historias.push(hu);
    showToast('✔ Historia ' + hu.id + ' creada');
  }
  closeModal('modal-hu');
  renderAll();
}

// ── Modales Tarea ────────────────────────────────────────────
function abrirModalTarea() {
  if (!State.huSeleccionada) return;
  $id('m-tr-id').value    = `TR${String(State.tareas.length + 1).padStart(2, '0')}`;
  $id('m-tr-nombre').value = $id('m-tr-resp').value = $id('m-tr-dep').value = $id('m-tr-condicion').value = '';
  $id('m-tr-tipo').value   = 'RF';
  $id('m-tr-est').value    = '';
  $id('m-tr-prio').value   = 'ALTA';
  $id('m-tr-estado').value = '0';
  openModal('modal-tarea');
}

function guardarTarea() {
  const t = {
    id:          $id('m-tr-id').value.trim(),
    huId:        State.huSeleccionada,
    nombre:      $id('m-tr-nombre').value.trim(),
    tipo:        $id('m-tr-tipo').value,
    estimacion:  $id('m-tr-est').value,
    responsable: $id('m-tr-resp').value.trim(),
    dependencias:$id('m-tr-dep').value.trim(),
    prioridad:   $id('m-tr-prio').value,
    estado:      $id('m-tr-estado').value || '0',
    condicion:   $id('m-tr-condicion').value.trim()
  };
  if (!t.id || !t.nombre) { alert('El ID y el nombre son obligatorios.'); return; }
  State.tareas.push(t);
  closeModal('modal-tarea');
  renderTareasContent();
  showToast('✔ Tarea ' + t.id + ' agregada');
}

function eliminarTarea(id) {
  if (!confirm('¿Eliminar tarea ' + id + '?')) return;
  State.tareas = State.tareas.filter(t => t.id !== id);
  renderTareasContent();
  showToast('Tarea ' + id + ' eliminada');
}

// ── Edición inline proyecto ──────────────────────────────────
function syncProyecto() {
  State.proyecto.nombre = $id('inp-proyecto').value;
  State.proyecto.dueno  = $id('inp-dueno').value;
}

// ── Exportar Excel ───────────────────────────────────────────
function exportarExcel() {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Product Backlog
  const rows1 = [
    ['', '', 'Backlog del Producto'],
    ['', 'Nombre del Proyecto:', State.proyecto.nombre],
    ['', 'Dueño del Producto', State.proyecto.dueno],
    [],
    ['', 'EPICA', '', '', '', 'HISTORIA DE USUARIO', '', '', '', '', 'OTROS DATOS', '', '', '', '', '', ''],
    ['', 'ID Epica', 'Titulo de la Epica', 'Como (Rol)', 'Deseo…', 'Para…',
     'ID Historia de Usuario', 'Nombre de Historia', 'Como (Rol)…', 'Deseo….', 'Para….',
     'Criterios de Aceptación', 'Prioridad', 'Estimación (Story Points)',
     'Dependencias', 'Sprint', 'Estado', 'Comentarios']
  ];
  State.epicas.forEach(ep => {
    const hus = State.historias.filter(h => h.epicaId === ep.id);
    hus.forEach((h, i) => {
      if (i === 0) {
        rows1.push(['', ep.id, ep.titulo, ep.rol, ep.deseo, ep.para,
          h.id, h.nombre, h.rol, h.deseo, h.para,
          h.criterios, h.prioridad, h.sp, '', h.sprint, h.estado, h.comentarios]);
      } else {
        rows1.push(['', '', '', '', '', '',
          h.id, h.nombre, h.rol, h.deseo, h.para,
          h.criterios, h.prioridad, h.sp, '', h.sprint, h.estado, h.comentarios]);
      }
    });
    if (hus.length === 0) {
      rows1.push(['', ep.id, ep.titulo, ep.rol, ep.deseo, ep.para, '', '', '', '', '', '', '', '', '', '', '', '']);
    }
  });

  const ws1 = XLSX.utils.aoa_to_sheet(rows1);
  ws1['!cols'] = [
    {wch:3},{wch:8},{wch:38},{wch:28},{wch:45},{wch:45},
    {wch:8},{wch:35},{wch:22},{wch:38},{wch:38},
    {wch:55},{wch:10},{wch:10},{wch:14},{wch:7},{wch:12},{wch:30}
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Product Backlog');

  // Hoja 2: Tareas
  const rows2 = [
    ['Id Tarea', 'ID Historia', 'Tarea', 'Tipo de Tarea (RF/RNF)',
     'Estimación (días)', 'Responsable', 'Dependencias (ID)', 'Prioridad',
     'Estado (%)', 'Condición de aprobación', 'Aprobado', 'Miembro que lo especificó']
  ];
  State.tareas.forEach(t => {
    rows2.push([t.id, t.huId, t.nombre, t.tipo, t.estimacion,
                t.responsable, t.dependencias, t.prioridad, t.estado + '%', t.condicion, '', '']);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(rows2);
  ws2['!cols'] = [
    {wch:8},{wch:8},{wch:42},{wch:16},{wch:14},{wch:18},
    {wch:16},{wch:10},{wch:10},{wch:40},{wch:10},{wch:22}
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Tareas por historias');

  const fname = 'Backlog_' + State.proyecto.nombre.replace(/[^a-z0-9]/gi, '_').substring(0, 28) + '.xlsx';
  XLSX.writeFile(wb, fname);
  showToast('⬇ Archivo Excel descargado');
}

// ── Render global ────────────────────────────────────────────
function renderAll() {
  renderSidebar();
  renderBacklog();
  if (State.vistaActual === 'tareas') {
    renderHUSelector();
    renderTareasContent();
  }
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Cerrar modales al hacer click fuera
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => {
      if (e.target === o) o.classList.remove('open');
    });
  });

  // Sync proyecto al editar
  $id('inp-proyecto').addEventListener('input', syncProyecto);
  $id('inp-dueno').addEventListener('input', syncProyecto);

  renderAll();
});
