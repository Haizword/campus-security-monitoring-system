const reports = [
  { id: "CW-1084", title: "Lighting outage reported", detail: "Wayfinding & infrastructure", category: "Infrastructure issue", zone: "Central quadrant", time: "Today, 2:42 PM", priority: "Moderate", status: "Under review" },
  { id: "CW-1083", title: "Safety concern near walkway", detail: "Pedestrian safety", category: "Safety concern", zone: "North quadrant", time: "Today, 1:18 PM", priority: "Urgent", status: "In progress" },
  { id: "CW-1082", title: "Damaged sign reported", detail: "Wayfinding & infrastructure", category: "Infrastructure issue", zone: "South quadrant", time: "Today, 12:05 PM", priority: "Low", status: "Resolved" },
  { id: "CW-1081", title: "Unfamiliar activity noted", detail: "Community observation", category: "Suspicious activity", zone: "Central quadrant", time: "Today, 10:34 AM", priority: "Moderate", status: "Under review" },
  { id: "CW-1080", title: "Path obstruction reported", detail: "Accessibility concern", category: "Infrastructure issue", zone: "East quadrant", time: "Yesterday, 4:51 PM", priority: "Low", status: "Resolved" },
  { id: "CW-1079", title: "Request for safe-walk support", detail: "General safety", category: "Safety concern", zone: "Central quadrant", time: "Yesterday, 3:20 PM", priority: "Moderate", status: "In progress" },
  { id: "CW-1078", title: "Unusual noise reported", detail: "Community observation", category: "Other", zone: "North quadrant", time: "Yesterday, 11:07 AM", priority: "Low", status: "Resolved" },
  { id: "CW-1077", title: "Broken outdoor fixture", detail: "Wayfinding & infrastructure", category: "Infrastructure issue", zone: "South quadrant", time: "Mon, 9:26 AM", priority: "Moderate", status: "Resolved" }
];

const categoryStyles = {
  "Safety concern": "symbol-urgent",
  "Infrastructure issue": "symbol-moderate",
  "Suspicious activity": "symbol-urgent",
  Other: "symbol-low"
};
const icons = {
  "Safety concern": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2.1h16a1.4 1.4 0 0 0 1.2-2.1L12 3Z"/><path d="M12 9v4m0 3h.01"/></svg>',
  "Infrastructure issue": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a5 5 0 0 0-6.6 6.6L3 18l3 3 5.1-5.1a5 5 0 0 0 6.6-6.6l-3 3-3-3 3-3Z"/></svg>',
  "Suspicious activity": '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v4m0 3h.01"/></svg>',
  Other: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></svg>'
};

const recentList = document.querySelector("#recent-list");
const incidentRows = document.querySelector("#incident-rows");
const emptyState = document.querySelector("#empty-state");
const tableCount = document.querySelector("#table-count");
const dialog = document.querySelector("#report-dialog");
const toast = document.querySelector("#toast");
let activeStatus = "all";
let searchTerm = "";
let toastTimer;

function renderRecent() {
  recentList.innerHTML = reports.slice(0, 4).map((report) => `
    <div class="activity-row">
      <span class="activity-symbol ${categoryStyles[report.category]}">${icons[report.category]}</span>
      <span class="activity-copy"><strong>${escapeHtml(report.title)}</strong><small>${escapeHtml(report.zone)} · ${escapeHtml(report.priority)} priority</small></span>
      <span class="activity-time">${escapeHtml(report.time.replace("Today, ", ""))}</span>
    </div>`).join("");
}

function renderIncidents() {
  const filtered = reports.filter((report) => {
    const matchesStatus = activeStatus === "all" || report.status === activeStatus;
    const searchable = `${report.id} ${report.title} ${report.detail} ${report.category} ${report.zone} ${report.status}`.toLowerCase();
    return matchesStatus && searchable.includes(searchTerm.toLowerCase());
  });
  incidentRows.innerHTML = filtered.map((report) => `
    <tr>
      <td><div class="report-title-cell"><span class="report-type-icon ${categoryStyles[report.category]}">${icons[report.category]}</span><span><strong>${escapeHtml(report.title)}</strong><small>${escapeHtml(report.id)} · ${escapeHtml(report.detail)}</small></span></div></td>
      <td>${escapeHtml(report.category)}</td>
      <td>${escapeHtml(report.zone)}</td>
      <td>${escapeHtml(report.time)}</td>
      <td><span class="priority priority-${report.priority.toLowerCase()}">${escapeHtml(report.priority)}</span></td>
      <td><span class="status-badge ${statusClass(report.status)}">${escapeHtml(report.status)}</span></td>
      <td><span class="row-menu" aria-hidden="true">···</span></td>
    </tr>`).join("");
  emptyState.hidden = filtered.length !== 0;
  tableCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? "report" : "reports"}${filtered.length ? " · fictional demo data" : ""}`;
  document.querySelector("#count-all").textContent = String(reports.length).padStart(2, "0");
  document.querySelector("#nav-count").textContent = String(reports.length).padStart(2, "0");
  const awaiting = reports.filter((report) => report.status === "Under review").length;
  document.querySelector("#metric-review").textContent = String(awaiting).padStart(2, "0");
}

function statusClass(status) {
  if (status === "Under review") return "status-review";
  if (status === "In progress") return "status-progress";
  return "status-resolved";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function setView(name) {
  const target = document.querySelector(`#view-${name}`);
  if (!target) return;
  document.querySelectorAll(".view").forEach((view) => {
    const active = view === target;
    view.hidden = !active;
    view.classList.toggle("active", active);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name && button.classList.contains("nav-link"));
  });
  const titles = { dashboard: "Overview", incidents: "Incident reports", map: "Campus map", analytics: "Analytics", about: "About this demo" };
  document.querySelector("#breadcrumb-current").textContent = titles[name] || titles.dashboard;
  document.querySelector("#sidebar").classList.remove("open");
  document.querySelector("#mobile-menu").setAttribute("aria-expanded", "false");
  history.replaceState(null, "", `#${name}`);
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-open-report]").forEach((button) => {
  button.addEventListener("click", () => dialog.showModal());
});
document.querySelectorAll("[data-close-report]").forEach((button) => {
  button.addEventListener("click", () => dialog.close());
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#report-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const category = String(formData.get("category"));
  const description = String(formData.get("description")).trim();
  const zone = String(formData.get("zone"));
  const priority = String(formData.get("priority"));
  const now = new Date();
  const time = `Today, ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  const id = `CW-${1085 + reports.filter((report) => report.id.startsWith("CW-")).length - 8}`;
  reports.unshift({
    id,
    title: description,
    detail: "User-submitted demo example",
    category,
    zone,
    time,
    priority,
    status: "Under review"
  });
  renderRecent();
  renderIncidents();
  form.reset();
  dialog.close();
  setView("incidents");
  showToast("Sample report added to this page only. It has not been sent.");
});

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeStatus = button.dataset.status;
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    renderIncidents();
  });
});
document.querySelector("#incident-search").addEventListener("input", (event) => {
  searchTerm = event.currentTarget.value.trim();
  renderIncidents();
});
document.querySelector("#mobile-menu").addEventListener("click", (event) => {
  const sidebar = document.querySelector("#sidebar");
  const isOpen = sidebar.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en", {
  weekday: "short", month: "short", day: "numeric", year: "numeric"
}).format(new Date());
renderRecent();
renderIncidents();
const initialView = window.location.hash.slice(1);
if (["dashboard", "incidents", "map", "analytics", "about"].includes(initialView)) setView(initialView);
