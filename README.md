# Open Problem Garden — Revived

A collaborative archive and exploration of open mathematical problems.  
Inspired by the original *Open Problem Garden*, this project aims to preserve, modernize, and extend its vision through open, community-driven development.

---

## About This Project

The Open Problem Garden has long served as a valuable reference for mathematicians, students, and researchers exploring conjectures across diverse mathematical fields.  
Over time, however, the original site became vulnerable and inactive, leaving much of its content at risk.

This repository seeks to **revitalize that spirit**, creating a safe, public, and collaborative space where open problems can live, grow, and connect.

---

## Project Goals

1. **Preserve** the original conjectures and their metadata in a clean, structured format (`.json` / `.csv`)
2. **Provide Access** through static, interactive web pages (via GitHub Pages)
3. **Encourage Collaboration** by allowing anyone to improve definitions, structure, or data
4. **Explore Connections** among conjectures using modern data science tools

Beyond preservation, one goal is to extend the original *Open Problem Garden* into a **living mathematical ecosystem**.

---

## Community Expansion

This repository is a work in progress, and it can evolve in many directions:

### Definitions & Backgrounds
Build a shared *Definitions* section to help new readers understand each conjecture and its context.

### Algorithmic Exploration
Integrate computational tools that reveal structure and relationships among problems:
- **PageRank** — study influence and citation networks  
- **Topic Modeling (LDA, BERT, etc.)** — cluster conjectures by shared assumptions or research themes  
- **Future Algorithms** — keep the repo flexible to incorporate new analytical methods  

### Interactive Research Tools
Encourage the development of visualizations, searchable interfaces, and hierarchical graphs that display how conjectures relate through hypotheses or dependencies.

---

## Collaboration Philosophy

This project follows a **public moderation model**:

- Anyone may propose edits or new content via pull requests  
- Changes are reviewed openly by the community  
- Scripts, visualizations, and tools can be shared and improved collaboratively  

The goal is a transparent, secure, and evolving hub where mathematics and computation meet.

---

## Technical Overview

- **Frontend:** Pure HTML, CSS, JavaScript  
- **Data:** JSON format (converted from original MySQL/CSV structure)  
- **Visualization:** Tree-based menu for categories, dynamic content view for conjectures  
- **Rendering:** MathJax for LaTeX-style mathematical expressions  
- **Hosting:** GitHub Pages (static site)  

---

## Contributing

We welcome pull requests that:
- Improve data accuracy or formatting  
- Add definitions, explanations, or references  
- Enhance the visualization and user interface  
- Introduce new analytical tools or algorithms  

### To contribute:
1. Fork the repository  
2. Make your changes  
3. Submit a pull request describing your contribution  

---

## Structure

Each conjecture is stored as a JSON or Markdown file with fields like:

```json
{
  "id": 101,
  "title": "Chords of longest cycles",
  "authors": ["Thomassen"],
  "categories": ["Graph Theory", "Basic GT", "Cycles"],
  "difficulty": 3,
  "description": "If G is a 3-connected graph, every longest cycle in G has a chord.",
  "refs": ["Some relevant paper or arXiv link"],
  "kwds": ["chord", "cycle", "connectivity"],
  "is_open": true,
  "head": "Graph Theory",
  "prev_conjs": [],
  "cntr": 0
}

# Explanation of JSON Fields

id: Unique identifier for the conjecture
title: Name of the conjecture
authors: Originator(s) of the conjecture
categories: Array of topic strings
difficulty: Numeric scale (0–4). While difficulty is subjective, popularity or research activity could serve as a proxy metric.
refs: Array of references or arXiv links
kwds: Array of keywords
is_open: Boolean value, true if the problem remains unsolved
head: If a conjecture is expressed as an implication P → Q, this field represents P
prev_conjs: Tracks which conjectures users visit before this one, enabling PageRank-style linkage
cntr: Popularity counter tracking engagement over time

# Licensing & Attribution

The original Open Problem Garden made its content publicly accessible but did not specify a license.
This project therefore operates under a good-faith fair-use preservation model for educational and research purposes.

If the original creators or maintainers wish to clarify licensing or ownership, this repository will comply and coordinate accordingly.

All new contributions here are released under
Creative Commons Attribution–ShareAlike 4.0 International (CC BY-SA 4.0).

Original concept and data courtesy of
Dominic van der Zypen and Robert Šámal (founders of Open Problem Garden).

# Future Directions
- Community moderation via GitHub Discussions or Wiki
- Linking conjectures through shared hypotheses and dependency graphs
- Incorporating machine learning insights into problem clustering
- Adding cross-references between related conjectures and open questions

# Contact

If you were involved in the original Open Problem Garden project,
or would like to collaborate on its modern continuation,
please reach out via GitHub or email.
