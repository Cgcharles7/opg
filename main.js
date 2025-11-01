async function loadConjectures() {
  const manifestResponse = await fetch('manifest.json');
  const files = await manifestResponse.json();

  const conjectures = [];

  for (const file of files) {
    const response = await fetch('conjectures/${file}');
    const data = await response.json();
    conjectures.push(data);
    console.log("data = " + data);
  }

  console.log(conjectures);

  buildTree(conjectures);
}

// Build the category tree dynamically
function buildTree(conjectures) {
  const treeContainer = document.getElementById('tree');
  treeContainer.innerHTML = '';

  const categories = {};

  // Group conjectures by category
  conjectures.forEach(c => {
    (c.categories || []).forEach(cat => {
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(c);
    });
  });

  // Build HTML
  for (const cat in categories) {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';
    catDiv.innerHTML = `<strong>${cat}</strong>`;
    
    const list = document.createElement('ul');

    categories[cat].forEach(c => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = c.title;
      link.addEventListener('click', () => displayConjecture(c));
      item.appendChild(link);
      list.appendChild(item);
    });

    catDiv.appendChild(list);
    treeContainer.appendChild(catDiv);
  }
}

// Display a conjecture when clicked
function displayConjecture(c) {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2>${c.title}</h2>
    <p><strong>Authors:</strong> ${c.authors ? c.authors.join(', ') : 'Unknown'}</p>
    <p><strong>Categories:</strong> ${(c.categories || []).join(', ')}</p>
    <p><strong>Difficulty:</strong> ${c.difficulty ?? '—'}</p>
    <p>${c.description}</p>
    <p><strong>References:</strong></p>
    <ul>${(c.refs || []).map(r => `<li><a href="${r}" target="_blank">${r}</a></li>`).join('')}</ul>
  `;

  if (window.MathJax) MathJax.typesetPromise();
}

document.addEventListener('DOMContentLoaded', loadConjectures);
