# Tayyab Attiq | Portfolio Website

This portfolio has been personalized for Tayyab Attiq, a Software Engineer and FAST-NUCES graduate focused on full-stack development and AI-powered applications.

## Overview

The project preserves the original polished layout, responsive behavior, and animation system while updating the content to reflect Tayyab Attiq's professional profile, technology stack, projects, and experience.

The portfolio content is now split into data modules under `data/` and rendered into the existing UI shells by `js/render-content.js`. Projects, experience, education, certifications, skills, navigation, and social/profile links are all generated from structured arrays instead of hardcoded section markup.

## Content Structure

- `data/index.js` - shared site metadata, including hero typing words.
- `data/navigation.js` - floating nav and footer section links.
- `data/projects.js` - featured project cards.
- `data/experience.js` - experience timeline entries.
- `data/education.js` - education timeline entries.
- `data/certifications.js` - certification cards.
- `data/skills.js` - skill filters and skill cards.
- `data/socialLinks.js` - profile cards and footer social links.
- `js/render-content.js` - maps the data into the existing DOM containers.

## Technologies

- HTML5, CSS3, and JavaScript
- Three.js and GSAP for the 3D animated background and motion effects
- Vercel serverless contact form integration
- Responsive portfolio design

## Profile

Tayyab Attiq

- Professional Title: Software Engineer | Full-Stack Developer | AI Engineer
- Location: Rawalpindi, Pakistan
- Email: attiqtayyab543@gmail.com
- LinkedIn: https://www.linkedin.com/in/tayyab-attiq
- GitHub: https://github.com/Tayyab765
- Portfolio: https://tayyab765.github.io/my-portfolio/

## Notes

- The portfolio is designed to keep the original aesthetic while representing Tayyab Attiq accurately.
- Replace resume and profile assets with personal files when final deployment assets are ready.
- Contact form submissions rely on the configured environment variables for email delivery.
- Add or remove portfolio content by editing the data arrays in `data/` only; the renderer updates the UI automatically.
