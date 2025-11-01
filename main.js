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

async function getCounter(uuid) {
  const res = await fetch(`http://localhost:3000/counters/${uuid}`);
  if (!res.ok) return { id: uuid, count: 0 }; // fallback
  return res.json();
}

async function incrementCounter(uuid) {
  const counter = await getCounter(uuid);
  const newCount = (counter.count || 0) + 1;

  await fetch(`http://localhost:3000/counters/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count: newCount })
  });

  return newCount;
}

// Build a hierarchical tree structure from comma-separated categories
function buildCategoryTree(conjs) {
  const tree = {};

  conjs.forEach(c => {
    const cats = c.kwds.toString().split(',').map(x => x.trim()).filter(Boolean);
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
  // Sort category names alphabetically (ignore __items)
  const categories = Object.keys(tree)
    .filter(k => k !== "__items")
    .sort((a, b) => a.localeCompare(b));

  categories.forEach(cat => {
    const div = document.createElement('div');
    div.classList.add('menu-item');
    div.textContent = cat;

    // Toggle submenu visibility on click
    div.onclick = (e) => {
      e.stopPropagation();
      const next = div.nextElementSibling;
      if (next && next.classList.contains('submenu')) {
        next.style.display = next.style.display === 'none' ? 'block' : 'none';
      }
    };

    parent.appendChild(div);

    // Create submenu container
    const submenu = document.createElement('div');
    submenu.classList.add('submenu');
    submenu.style.display = 'none';
    submenu.style.paddingLeft = '15px';
    parent.appendChild(submenu);

    // Recursively build child categories
    buildMenu(tree[cat], submenu);

    // Sort conjectures alphabetically by name
    const conjs = (tree[cat].__items || []).sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    // Add conjecture leaves
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

async function showConjecture(c) {
  const content = document.getElementById('content');
  const link = c.link || '#';
  const count = await incrementCounter(c.uuid);

  content.innerHTML = `
    <h2>${c.name}</h2>
    <p><b>Views:</b> ${count}</p>
    <p>${c.summary}</p>
    <p><b>Keywords:</b> ${c.kwds}</p>
    <p><a href="${link}" target="_blank" rel="noopener noreferrer">${c.name}</a></p>
  `;
}


(async () => {
  const conjs = await loadData();
  const tree = buildCategoryTree(conjs);
  
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  buildMenu(tree, menu);
})();
