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

function buildCategoryTree(conjs) {
  const tree = {};

  conjs.forEach(c => {
    // Normalize keywords
    const cats = Array.isArray(${c.terms}))
      ? c.terms.map(x => x.trim()).filter(Boolean)
      : c.terms.toString().split(',').map(x => x.trim()).filter(Boolean);

    if (cats.length === 0) {
      if (!tree["Uncategorized"]) tree["Uncategorized"] = { __items: [] };
      tree["Uncategorized"].__items.push(c);
      return;
    }

    // Traverse/create the tree hierarchy
    let node = tree;
    cats.forEach((cat, idx) => {
      if (!node[cat]) node[cat] = {};

      if (idx === cats.length - 1) {
        // Only add __items at the leaf
        if (!node[cat].__items) node[cat].__items = [];
        node[cat].__items.push(c);
      } else {
        node = node[cat];
      }
    });
  });

  return tree;
}

function inferType(name) {
  const lower = name.toLowerCase();
  if (lower.includes('theorem')) return 'theorem';
  if (lower.includes('conjecture') || lower.includes('problem')) return 'conjecture';
  return 'definition';
}

function buildMenu(tree, parent) {
  Object.keys(tree).sort().forEach(cat => {
    if (cat === "__items") return;

    const div = document.createElement('div');
    div.classList.add('menu-item');
    div.textContent = cat;

    // Toggle open/close
    div.onclick = (e) => {
      e.stopPropagation();
      const next = div.nextElementSibling;
      if (next && next.classList.contains('submenu')) {
        next.style.display = next.style.display === 'none' ? 'block' : 'none';
      }
    };

    parent.appendChild(div);

    const submenu = document.createElement('div');
    submenu.classList.add('submenu');
    submenu.style.display = 'none';
    submenu.style.paddingLeft = '15px';
    parent.appendChild(submenu);

    // Recursively build child branches
    buildMenu(tree[cat], submenu);

    // --- Group items by inferred type ---
    const conjs = tree[cat].__items || [];
    const groups = { definition: [], theorem: [], conjecture: [] };

    conjs.forEach(c => {
      const t = inferType(c.name || c.title);
      groups[t].push(c);
    });

    Object.entries(groups).forEach(([type, items]) => {
      if (items.length === 0) return;

      const typeHeader = document.createElement('div');
      typeHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's';
      typeHeader.classList.add('menu-subtype');
      typeHeader.style.fontStyle = 'italic';
      typeHeader.style.marginTop = '5px';
      submenu.appendChild(typeHeader);

      const typeList = document.createElement('div');
      typeList.style.paddingLeft = '10px';
      submenu.appendChild(typeList);

      items.forEach(c => {
        const leaf = document.createElement('div');
        leaf.classList.add('menu-leaf');
        leaf.textContent = c.name || c.title;
        leaf.onclick = (e) => {
          e.stopPropagation();
          showConjecture(c);
        };
        typeList.appendChild(leaf);
      });
    });
  });
}

function showConjecture(c) {
  const content = document.getElementById('content');
  const link = c.link || '#';

  content.innerHTML = `
    <h2>${c.name}</h2>
    <p>${c.explained}</p>
    <p>${c.rephrased}</p>
    <p>${c.implication_form}</p>
    <p>${c.posed_by}</p>
    <p>${c.solved_by}</p>
    <p><b>Terms:</b> ${c.terms}</p>
    <p>Related Conjectures: ${c.related_conjectures}</p>
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
