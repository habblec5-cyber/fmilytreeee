let selectedId = null;

let family = {
  id: 1,
  name: "Kamu",
  parents: [],
  partners: [],
  children: []
};

function newPerson(name) {
  return {
    id: Date.now(),
    name,
    parents: [],
    partners: [],
    children: []
  };
}

/* FIND */
function findPerson(root, id) {
  if (root.id === id) return root;
  for (let c of root.children) {
    const found = findPerson(c, id);
    if (found) return found;
  }
  return null;
}

/* RENDER */
function renderTree() {
  const tree = document.getElementById("familyTree");
  tree.innerHTML = "";
  tree.appendChild(renderNode(family));
}

function renderNode(person) {
  const li = document.createElement("li");

  const wrap = document.createElement("div");
  wrap.className = "node-wrapper";

  const box = document.createElement("div");
  box.className = "person";
  if (person.parents.length === 0) box.classList.add("parent");
  if (person.children.length > 0) box.classList.add("self");
  if (person.parents.length > 0 && person.children.length === 0) box.classList.add("child");
  if (person.id === selectedId) box.classList.add("selected");

  box.innerText = person.name;
  box.onclick = () => {
    selectedId = person.id;
    renderTree();
  };

  wrap.appendChild(box);

  /* PARTNER */
  person.partners.forEach(p => {
    const pBox = document.createElement("div");
    pBox.className = "person partner";
    pBox.innerText = p.name;
    pBox.onclick = () => {
      selectedId = p.id;
      renderTree();
    };
    wrap.appendChild(pBox);
  });

  li.appendChild(wrap);

  if (person.children.length > 0) {
    const ul = document.createElement("ul");
    person.children.forEach(c => ul.appendChild(renderNode(c)));
    li.appendChild(ul);
  }

  return li;
}

/* ADD */
function addPerson() {
  const name = document.getElementById("name").value;
  const type = document.getElementById("relation").value;
  if (!name || !selectedId) return alert("Pilih orang & isi nama");

  const target = findPerson(family, selectedId);
  const p = newPerson(name);

  if (type === "parent") {
    p.children.push(target);
    target.parents.push(p);
    family = p;
  }

  if (type === "child") {
    target.children.push(p);
    p.parents.push(target);
  }

  if (type === "sibling") {
    if (!target.parents[0]) return alert("Sibling harus punya parent");
    target.parents[0].children.push(p);
    p.parents.push(target.parents[0]);
  }

  if (type === "partner") {
    target.partners.push(p);
    p.partners.push(target);
  }

  document.getElementById("name").value = "";
  renderTree();
}

/* DELETE */
function deletePerson() {
  if (!selectedId || selectedId === family.id)
    return alert("Tidak bisa menghapus root");

  function remove(node) {
    node.children = node.children.filter(c => c.id !== selectedId);
    node.children.forEach(remove);
  }

  remove(family);
  selectedId = null;
  renderTree();
}

renderTree();