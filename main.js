// Load all conjectures listed in manifest.json
async function loadData() {
  const manifestResponse = await fetch('manifest.json');
  const files = await manifestResponse.json();

  const results = [];
  for (const file of files) {
    const res = await fetch(`conjectures/${file}`);
    const data = await res.json();
    results.push(data);
  }

  return results;
}

// Build a hierarchical tree structure from comma-separated categories
function buildCategoryTree(conjs) {
  const tree = {};

  conjs.forEach(c => {
    const cats = c.kwds.toString().split(',').map(x => x.trim()).filter(Boolean);
    console.log(cats);
    let node = tree;

    cats.forEach(cat => {
      if (!node[cat]) node[cat] = { __items: [] };
      node = node[cat];
    });
    
    node.__items.push(c);
  });

  return tree;
}

function buildMenu(tree, parent) {
  Object.keys(tree).forEach(cat => {
    if (cat === "__items") return;

    const div = document.createElement('div');
    div.classList.add('menu-item');
    div.textContent = cat;

    // Add toggle functionality
    div.onclick = (e) => {
      e.stopPropagation();
      const next = div.nextElementSibling;
      if (next && next.classList.contains('submenu')) {
        next.style.display = next.style.display === 'none' ? 'block' : 'none';
      }
    };

    parent.appendChild(div);

    // Submenu container
    const submenu = document.createElement('div');
    submenu.classList.add('submenu');
    submenu.style.display = 'none';
    submenu.style.paddingLeft = '15px';
    parent.appendChild(submenu);

    // Recursively build children
    buildMenu(tree[cat], submenu);

    // Add conjectures under this branch
    const conjs = tree[cat].__items || [];
    conjs.forEach(c => {
      const leaf = document.createElement('div');
      leaf.classList.add('menu-leaf');
      leaf.textContent = c.name;
      leaf.onclick = (e) => {
        e.stopPropagation();
        showConjecture(c);
      };
      submenu.appendChild(leaf);
    });
  });
}

function showConjecture(c) {
  const content = document.getElementById('content');
  console.log(c.name);
  content.innerHTML = `
    <h2>${c.name}</h2>
    <p><b>Author(s):</b> ${c.authors}</p>
    <p><b>Difficulty:</b> ${c.difficulty || 'N/A'}</p>
    <p>${c.description}</p>
    <p><b>Keywords:</b> ${c.kwds}</p>
  `;
}

(async () => {
  const conjs = await loadData();
  const tree = buildCategoryTree(conjs);
  alert("tree = " + tree);
  
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  buildMenu(tree, menu);
})();
