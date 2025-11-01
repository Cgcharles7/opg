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

(async () => {
  const conjs = await loadData();  // now defined
  const tree = buildCategoryTree(conjs);

  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  buildMenu(tree, menu);
})();


// ----------------------------
// menu.js
// ----------------------------

// Build a hierarchical tree structure from categories (string or array)
function buildCategoryTree(conjs) {
  const tree = {};

  conjs.forEach(c => {
    // Normalize categories
    const cats = Array.isArray(c.categories)
      ? c.categories
      : (c.categories || '').split(',').map(x => x.trim()).filter(Boolean);

    let node = tree;

    cats.forEach(cat => {
      if (!node[cat]) node[cat] = { __items: [] };
      node = node[cat];
    });

    node.__items.push(c);
  });

  return tree;
}

// Recursively build the collapsible category menu
function buildMenu(tree, parent) {
  Object.keys(tree).forEach(cat => {
    if (cat === "__items") return;

    const div = document.createElement('div');
    div.classList.add('menu-item');
    div.textContent = cat;

    // Toggle submenu visibility
    div.onclick = (e) => {
      e.stopPropagation();
      const next = div.nextElementSibling;
      if (next && next.classList.contains('submenu')) {
        next.style.display = next.style.display === 'none' ? 'block' : 'none';
      }
    };

    parent.appendChild(div);

    // Create submenu
    const submenu = document.createElement('div');
    submenu.classList.add('submenu');
    submenu.style.display = 'none';
    submenu.style.paddingLeft = '15px';
    parent.appendChild(submenu);

    // Recursively build children
    buildMenu(tree[cat], submenu);

    // Add conjecture links under this branch
    const conjs = tree[cat].__items || [];
    conjs.forEach(c => {
      const leaf = document.createElement('div');
      leaf.classList.add('menu-leaf');
      leaf.textContent = c.title;
      leaf.onclick = (e) => {
        e.stopPropagation();
        showConjecture(c);
      };
      submenu.appendChild(leaf);
    });
  });
}

// Display conjecture details in the content area
function showConjecture(c) {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>${c.title}</h2>
    <p><strong>Author(s):</strong> ${Array.isArray(c.authors) ? c.authors.join(', ') : c.authors || 'Unknown'}</p>
    <p><strong>Categories:</strong> ${Array.isArray(c.categories) ? c.categories.join(', ') : c.categories}</p>
    <p><strong>Difficulty:</strong> ${c.difficulty ?? 'N/A'}</p>
    <p>${c.description || ''}</p>
    <p><strong>Keywords:</strong> ${Array.isArray(c.kwds) ? c.kwds.join(', ') : c.kwds || ''}</p>
  `;

  // Support MathJax rendering if available
  if (window.MathJax) MathJax.typesetPromise();
}

// Initialize the menu once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (!window.conjectures || !Array.isArray(window.conjectures)) {
    console.error("No conjectures found in memory (expected window.conjectures).");
    return;
  }

  const menu = document.getElementById('menu');
  if (!menu) {
    console.error("Menu element not found in the DOM.");
    return;
  }

  const tree = buildCategoryTree(window.conjectures);
  menu.innerHTML = '';
  buildMenu(tree, menu);
});
