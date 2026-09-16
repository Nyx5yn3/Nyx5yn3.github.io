---
layout: default
title: "Personal"
---
## // Seccion: Personal

### Mi opinion de la privacidad, la IA y el futuro de la automatizacion

<ul>
  {% for post in site.categories.personal-blogs %}
    <li>
      <span>[{{ post.date | date: "%Y-%m-%d" }}]</span> — 
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

---

### Maquinas Virtuales 🖥️

*[Por definir]*

---

### Hardening 🔒

*[Por definir]*

---

<br>
<a href="/">[ Volver al Inicio ]</a>