# A User-Driven Collection of Open Research Problems

A collaborative archive and exploration of open mathematical problems.  
There has been a lot of talk on social media, message boards and across the internet looking for open research problems. Wikipedia originated such a collection. This project is based on content taken from Wikipedia, but housed in GitHib to have a community-driven approach.

---

## About This Project

Having a space for mathematicians, students, and researchers to access and explore conjectures across diverse mathematical fields is an interest that has been expressed across social media, message boards, and the internet in general. 

This repository seeks to answer this interest by creating a safe, public, and collaborative space where open problems can live, grow, and connect.

---

## Project Goals

1. **Collect** conjectures and their metadata are stored them in a structured format (`.json`)
2. **Provide Access** through static, interactive web pages (via GitHub Pages)
3. **Encourage Collaboration** by allowing anyone to improve definitions, structure, additional references, additional conjectures
4. **Explore Connections** among conjectures using modern data science tools

---

## Community Expansion

This repository is a work in progress, and it can evolve in many directions:


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
  "head": "G is a 3-connected graph", 
  "prev_conjs": [],
  "cntr": 0
}```

## Explanation of JSON Fields

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

The Wikipedia articles are under a Creative Commons liscense. Because this information originates from Wikipedia, we will also be running a Creative Commons lisense. 

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
