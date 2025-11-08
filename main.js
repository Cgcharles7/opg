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

function groupConjecturesByCategory(conjs) {
  const categories = {};

  conjs.forEach(c => {
    const subs = Array.isArray(c.subjects)
      ? c.subjects.map(x => String(x).trim()).filter(Boolean)
      : c.subjects
        ? String(c.subjects).split(',').map(x => x.trim()).filter(Boolean)
        : [];

    if (subs.length === 0) {
      (categories["UNCATEGORIZED"] ??= []).push(c);
      return;
    }

    subs.forEach(sub => {
      const cleanSub = sub.toUpperCase();
      (categories[cleanSub] ??= []).push(c);
    });
  });

  return categories;
}

function inferType(name) {
  const lower = name.toLowerCase();
  if (lower.includes('theorem')) return 'theorem';
  if (lower.includes('conjecture') || lower.includes('problem')) return 'conjecture';
  return 'definition';
}

function buildMenu(categories, parent) {
  Object.keys(categories).sort().forEach(cat => {
    // --- Category Header ---
    const catDiv = document.createElement('div');
    catDiv.classList.add('menu-category');
    catDiv.textContent = cat;
    catDiv.style.cursor = 'pointer';
    catDiv.style.fontWeight = 'bold';
    catDiv.style.marginTop = '8px';
    parent.appendChild(catDiv);

    // --- Container for the items (hidden by default) ---
    const listDiv = document.createElement('div');
    listDiv.classList.add('menu-list');
    listDiv.style.display = 'none';
    listDiv.style.paddingLeft = '15px';
    parent.appendChild(listDiv);

    // --- Toggle visibility when clicking the category ---
    catDiv.onclick = () => {
      listDiv.style.display = listDiv.style.display === 'none' ? 'block' : 'none';
    };

    // --- Group conjectures by inferred type (optional) ---
    const groups = { definition: [], theorem: [], conjecture: [] };
    categories[cat].forEach(c => {
      const t = inferType(c.name || c.title);
      groups[t].push(c);
    });

    // --- Render groups ---
    Object.entries(groups).forEach(([type, items]) => {
      if (items.length === 0) return;

      const typeHeader = document.createElement('div');
      typeHeader.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}s`;
      typeHeader.classList.add('menu-subtype');
      typeHeader.style.fontStyle = 'italic';
      typeHeader.style.marginTop = '5px';
      listDiv.appendChild(typeHeader);

      items.forEach(c => {
        const leaf = document.createElement('div');
        leaf.classList.add('menu-leaf');
        leaf.textContent = c.name || c.title;
        leaf.style.cursor = 'pointer';
        leaf.onclick = (e) => {
          e.stopPropagation(); // Don’t collapse when clicking inside
          showConjecture(c);
        };
        listDiv.appendChild(leaf);
      });
    });
  });
}

function showConjecture(c) {
  const content = document.getElementById('content');
  const link = c.link || '#';

  content.innerHTML = `
    <h2>${c.name}</h2>
    <p><h3>Detailed Explanation: </h3>${c.explained}</p>
    <p><h3>Shortened Explanation: </h3>${c.rephrased}</p>
    <p><h3>Implication Form</h3>${c.implication_form}</p>
    <p><h3>Originated By: </h3>${c.posed_by}</p>
    <p><h3>Solved By </h3>${c.solved_by}</p>
    <p><b>Terms:</b> ${c.terms}</p>
    <p>Related Conjectures: ${c.related_conjectures}</p>
    <p><h3>Wikipedia Link</h3><a href="${link}" target="_blank" rel="noopener noreferrer">${c.name}</a></p>
  `;
}


(async () => {
  const conjs = await loadData();
  const tree = groupConjecturesByCategory(conjs);
  console.log(tree);
  //  const tree = buildCategoryTree(conjs);
  
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  buildMenu(tree, menu);
})();
