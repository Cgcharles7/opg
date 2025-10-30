document.addEventListener("DOMContentLoaded", async () => {
    const menu = document.getElementById("menu");
    const content = document.getElementById("content");

    // Fetch the static JSON file
    const response = await fetch("data/conjs.json");
    const conjectures = await response.json();
    console.log(conjectures);

    // Build a nested category structure
    const categoryTree = {};

    conjectures.forEach(c => {
        if (!c.categories) return;

        const cats = c.categories.split(",").map(s => s.trim());
        let node = categoryTree;

        cats.forEach((cat, i) => {
            if (!node[cat]) node[cat] = { __conjs: [] };
            if (i === cats.length - 1) {
                node[cat].__conjs.push(c);
            }
            node = node[cat];
        });
    });

    // Recursive function to build menu HTML
    function buildMenu(tree, parentEl) {
        Object.keys(tree).forEach(key => {
            if (key === "__conjs") return;

            const div = document.createElement("div");
            div.className = "menu-item";
            div.textContent = key;

            const subDiv = document.createElement("div");
            subDiv.className = "submenu";
            subDiv.style.display = "none";

            div.addEventListener("click", () => {
                subDiv.style.display = subDiv.style.display === "none" ? "block" : "none";
            });

            parentEl.appendChild(div);
            parentEl.appendChild(subDiv);

            // Recursively build submenus
            buildMenu(tree[key], subDiv);

            // Add leaf nodes (conjectures)
            tree[key].__conjs.forEach(conj => {
                const leaf = document.createElement("div");
                leaf.className = "menu-leaf";
                leaf.textContent = conj.title;
                leaf.addEventListener("click", () => showConjecture(conj));
                subDiv.appendChild(leaf);
            });
        });
    }

    function showConjecture(conj) {
        content.innerHTML = `
            <h2>${conj.title}</h2>
            <p><strong>Authors:</strong> ${conj.authors || "Unknown"}</p>
            <p><strong>Categories:</strong> ${conj.categories}</p>
            <p><strong>Difficulty:</strong> ${conj.difficulty || "N/A"}</p>
            <p><strong>Description:</strong><br>${conj.description}</p>
            <p><strong>References:</strong> ${conj.refs || "None"}</p>
            <p><strong>Keywords:</strong> ${conj.kwds || "None"}</p>
        `;
        if (window.MathJax) {
            MathJax.typesetPromise([content]);
        }
        window.location.hash = `#conj-${conj.id}`;
    }

    // Build the menu
    menu.innerHTML = "";
    buildMenu(categoryTree, menu);

    // Handle direct links via hash
    if (window.location.hash.startsWith("#conj-")) {
        const id = parseInt(window.location.hash.replace("#conj-", ""));
        const conj = conjectures.find(c => c.id === id);
        if (conj) showConjecture(conj);
    }
});
