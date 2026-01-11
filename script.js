/* =========================
   NAVIGASI
========================= */
function showPage(id) {
  document.querySelectorAll("section").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
}

/* =========================
   DATA
========================= */
let nodes = JSON.parse(localStorage.getItem("nodes")) || [];

/* =========================
   SIMPAN
========================= */
function save() {
  localStorage.setItem("nodes", JSON.stringify(nodes));
}

/* =========================
   TAMBAH NODE
========================= */
document.getElementById("familyForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.toLowerCase();
  const parent = document.getElementById("parent").value || null;

  if (!name) return;

  let emoji = "👤";
  let color = "black";

  if (role.includes("ayah")) { emoji = "👨"; color = "red"; }
  if (role.includes("ibu"))  { emoji = "👩"; color = "blue"; }
  if (role.includes("anak")) { emoji = "👧"; color = "green"; }

  nodes.push({ name, emoji, color, parent });
  save();
  renderAll();
  e.target.reset();
});

/* =========================
   DELETE NODE + ANAKNYA
========================= */
function deleteNode(name) {
  nodes = nodes.filter(n => n.name !== name && n.parent !== name);
  save();
  renderAll();
}

/* =========================
   RENDER LIST (ATAS)
========================= */
function renderList() {
  let html = "<ul>";
  nodes.forEach(n => {
    html += `
      <li style="color:${n.color}">
        ${n.emoji} ${n.name}
        <span onclick="deleteNode('${n.name}')" style="cursor:pointer;color:red"> ❌</span>
      </li>`;
  });
  html += "</ul>";
  document.getElementById("list").innerHTML = html;
}

/* =========================
   RENDER TREE (POHON BENERAN)
========================= */
function renderTree(parent = null) {
  const children = nodes.filter(n => n.parent === parent);
  if (!children.length) return "";

  let html = "<ul>";
  children.forEach(n => {
    html += `
      <li>
        <span style="color:${n.color}">
          ${n.emoji} ${n.name}
          <span onclick="deleteNode('${n.name}')" style="cursor:pointer;color:red"> ❌</span>
        </span>
        ${renderTree(n.name)}
      </li>`;
  });
  html += "</ul>";
  return html;
}

/* =========================
   RENDER SEMUA
========================= */
function renderAll() {
  renderList();
  document.getElementById("tree").innerHTML = renderTree();
}

/* =========================
   INIT
========================= */
renderAll();
