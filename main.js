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
    // Normalize subjects (array or comma-separated string)
    const subs = Array.isArray(c.subjects)
      ? c.subjects.map(x => String(x).trim().toUpperCase()).filter(Boolean)
      : c.subjects
        ? String(c.subjects).split(',').map(x => x.trim()).filter(Boolean)
        : [];

    // If no subjects, assign to 'Uncategorized'
    if (subs.length === 0) {
      if (!categories["Uncategorized"]) categories["Uncategorized"] = [];
      categories["Uncategorized"].push(c);
      return;
    }

    // Add conjecture under all relevant subjects
    subs.forEach(sub => {
      const cleanSub = String(sub).trim();
      if (!categories[cleanSub]) categories[cleanSub] = [];
      categories[cleanSub].push(c);
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
  // Sort categories alphabetically
  Object.keys(categories).sort().forEach(cat => {
    // Create a category header
    const catDiv = document.createElement('div');
    catDiv.classList.add('menu-category');
    catDiv.textContent = cat;
    parent.appendChild(catDiv);

    // Create container for conjecture items
    const listDiv = document.createElement('div');
    listDiv.classList.add('menu-list');
    listDiv.style.paddingLeft = '15px';
    parent.appendChild(listDiv);

    // Group conjectures by inferred type (optional)
    const groups = { definition: [], theorem: [], conjecture: [] };

    categories[cat].forEach(c => {
      const t = inferType(c.name || c.title);
      groups[t].push(c);
    });

    // Render each group (Definition, Theorem, Conjecture)
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
        leaf.onclick = (e) => {
          e.stopPropagation();
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
    <p><h2>Detailed Explanation: </h2>${c.explained}</p>
    <p><h2>Shortened Explanation: </h2>${c.rephrased}</p>
    <p><h2>Implication Form</h2>${c.implication_form}</p>
    <p><h2>Originated By: </h2>${c.posed_by}</p>
    <p><h2>Solved By </h2>${c.solved_by}</p>
    <p><b>Terms:</b> ${c.terms}</p>
    <p>Related Conjectures: ${c.related_conjectures}</p>
    <p><a href="${link}" target="_blank" rel="noopener noreferrer">${c.name}</a></p>
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
