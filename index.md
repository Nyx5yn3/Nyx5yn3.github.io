---
layout: portada
---

# // Whoami

Realmente no soy nadie, solo un random de internet, me gusta mucho la ciberseguridad y la privacidad, cosa que parece un taboo hoy en dia, pero estoy bien convencido de que no es nada raro luchar por un derecho. 

Entender cómo piensan los atacantes, cómo explotan las vulnerabilidades y cómo operan bajo la superficie es la única forma real de construir sistemas resilientes. Este espacio está dedicado a documentar mi aprendizaje: **romper para entender, y entender para proteger.**

---

## // Writeups

Testing for future writeups

<ul>
  {% for post in site.posts %}
    <li>
      <span>[{{ post.date | date: "%Y-%m-%d" }}]</span> — 
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

---