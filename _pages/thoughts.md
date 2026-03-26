---
layout: default
permalink: /thoughts/
title: some thoughts
nav: true
nav_order: 3
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
---

<div class="post">

<p class="blog-intro">
  Writing whatever I find worth saying.
</p>

<ul class="post-list" style="list-style: none; padding: 0;margin-top: 0;">
  {% if page.pagination.enabled %}
    {% assign postlist = paginator.posts %}
  {% else %}
    {% assign postlist = site.posts %}
  {% endif %}

  {% assign current_year = "" %}

  {% for post in postlist %}
  {% assign year = post.date | date: "%Y" %}
  {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}

  {% if year != current_year %}
    {% assign current_year = year %}
    <li style="list-style: none; margin-top: 1.5rem; margin-bottom: 0.5rem;">
      <span class="burgundy" style="font-size: 0.85em; letter-spacing: 0.05em;">{{ year }}</span>
    </li>
  {% endif %}

  <li style="margin-bottom: 1.8rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--global-divider-color);">
    <h3 style="margin-bottom: 0.2rem;">
      <a class="post-title" href="{{ post.url | relative_url }}" style="text-decoration: none;">{{ post.title }}</a>
    </h3>
    <p style="color: var(--global-text-color-light); font-size: 0.85em; margin-bottom: 0.4rem;">
      {{ post.date | date: '%B %d, %Y' }} &nbsp;·&nbsp; {{ read_time }} min read
    </p>
    {% if post.description %}
    <p style="margin: 0;">{{ post.description }}</p>
    {% endif %}
  </li>
  {% endfor %}
</ul>

{% if page.pagination.enabled %}
<div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; font-size: 0.9em;">

  {% assign total = paginator.total_pages %}
  {% assign current = paginator.page %}

  <a href="{{ '/thoughts/' | relative_url }}" style="color: var(--global-theme-color);">&laquo;</a>

  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | relative_url }}" style="color: var(--global-theme-color);">&#8249;</a>
  {% endif %}

  {% for i in (1..total) %}
    {% assign diff = i | minus: current %}
    {% if diff < 0 %}{% assign diff = 0 | minus: diff %}{% endif %}
    {% if diff <= 2 %}
      {% if i == current %}
        <strong style="color: var(--global-theme-color);">{{ i }}</strong>
      {% else %}
        <a href="{% if i == 1 %}{{ '/thoughts/' | relative_url }}{% else %}{{ '/thoughts/page/' | append: i | relative_url }}{% endif %}" style="color: var(--global-theme-color);">{{ i }}</a>
      {% endif %}
    {% elsif diff == 3 %}
      <span style="color: var(--global-text-color-light);">...</span>
    {% endif %}
  {% endfor %}

  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | relative_url }}" style="color: var(--global-theme-color);">&#8250;</a>
  {% endif %}

  <a href="{{ '/thoughts/page/' | append: total | relative_url }}" style="color: var(--global-theme-color);">&raquo;</a>

</div>
{% endif %}

</div>
