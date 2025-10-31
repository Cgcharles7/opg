# Open Problem Garden — Revived

A collaborative archive and exploration of open mathematical problems.
Inspired by the original Open Problem Garden, this project aims to preserve, modernize, and extend its vision through open, community-driven development.

## About This Project

The Open Problem Garden has long served as a valuable reference for mathematicians, students, and researchers looking to explore conjectures across diverse mathematical fields.
However, over time, the original site became vulnerable and inactive, leaving much of its content at risk.

This repository seeks to revitalize that spirit, creating a safe, public, and collaborative space where open problems can live, grow, and connect.

## Project Goals

1. Preserve the original conjectures and their metadata in a clean, structured format (.json / .csv)
2. Provide Access through static, interactive web pages (via GitHub Pages)
3. Encourage Collaboration by allowing anyone to improve definitions, structure, or data
4. Explore Connections among conjectures using modern data science tools

Beyond preservation, one goal is to extend the original Open Problem Garden into a living mathematical ecosystem.

# Community Expansion

This repository itself is a work in progress, and it can evolve in many directions:

- (Potential) Definitions & Backgrounds
Build a shared Definitions section to help beginners readers understand each conjecture and its context.
- Algorithmic Exploration
Integrate computational tools that reveal structure and relationships among problems:
 - PageRank — study influence and citation networks
 - Topic Modeling (LDA, BERT, etc.) — cluster conjectures by shared assumptions or research themes
 - Future Algorithms — the repo should stay flexible to incorporate new analytical methods
- Interactive Research Tools
Encourage the development of visualizations, searchable interfaces, and hierarchical graphs that display how conjectures relate through hypotheses or dependencies.

# Collaboration Philosophy
This project follows a public moderation model:

- Anyone may propose edits or new content via pull requests
- Changes are reviewed openly by the community
- Scripts, visualizations, and tools can be shared and improved collaboratively


The goal is a transparent, secure, and evolving hub where mathematics and computation meet.

# Technical Overview
- Frontend: Pure HTML, CSS, JavaScript
- Data: JSON format (converted from original MySQL/CSV structure)
- Visualization: Tree-based menu for categories, dynamic content view for conjectures
- Rendering: MathJax for LaTeX-style mathematical expressions
- Hosting: GitHub Pages (static site)

# Contributing
We welcome pull requests that:
- Improve data accuracy or formatting
- Add definitions, explanations, or references
- Enhance the visualization and user interface
- Introduce new analytical tools or algorithms

To contribute:
1. Fork the repository
2. Make your changes
3. Submit a pull request describing your contribution

## Structure

Each conjecture is stored as a JSON or Markdown file with fields like:

```json
{
  "id": 101,
  "title": "Chords of longest cycles",
  "authors": ["Thomassen"],
  "categories": ["Graph Theory", "Basic GT", "Cycles"],
  "difficulty": "★★★",
  "description": "If G is a 3-connected graph, every longest cycle in G has a chord.",
  "refs": ["Some relevant paper or arXiv link"],
  "kwds": ["chord", "cycle", "connectivity"],
  "is_open": true,
  "head": "Graph Theory",
  "prev_conjs": []
}```


# Licensing & Attribution
This project is under a Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license.
Attribution:
Original concept and data courtesy of Open Problem Garden (founded by Dominic van der Zypen and Robert Šámal).


# Future Directions
- Integration of community moderation mechanisms (GitHub Discussions or Wiki)
- Linking conjectures through shared hypotheses and assumption graphs
- Incorporating machine learning insights into problem clustering
- Adding cross-references between related conjectures and open questions



# Contact
If you were involved in the original Open Problem Garden project, or would like to collaborate on its modern continuation, please get in touch via GitHub or email.

