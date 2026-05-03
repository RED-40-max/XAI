# XAI Interactive Blog

https://red-40-max.github.io/XAI/

Interactive AI explainer built with plain HTML, CSS, and JavaScript.  
The project combines narrative scroll sections with two interactive modules:
- **Section 2:** an interactive agent-system diagram (`section2-agent.html` + `section2.js`)
- **Section 3:** an embedded Space Invaders-style defense game (`section3-defend.html` embedding `SpaceInvaders/index.html?embed=1`)

## Project Flow

0. Hero / Hook (chat-story opening)  
1. Exigence + research question  
2. What is an AI agent  
3. How agent systems work (interactive architecture walkthrough)  
4. Where things break (defense game / bug rounds)  
5. Real-world consequences  
6. User control / call to action  
7. References + technical resources + methodology

## Tech Stack

- **Core:** HTML, CSS, JavaScript (no framework/build step)
- **Animation/UI libs:** AOS (Animate on Scroll)
- **Scroll/media support:** Scrollama and Typed.js are loaded on `index.html`
- **Custom visuals:** `starfield.js` canvas background system
- **Custom interactions:** `hook.js` (main page behavior), `section2.js` (agent diagram logic)
- **Embedded game module:** `SpaceInvaders/` (forked/adapted clone, embedded into Section 3)

## Current Structure

```text
XAI/
├── index.html
├── style.css
├── hook.js
├── starfield.js
├── section2-agent.html
├── section2.js
├── section3-defend.html
├── reference-page.html
├── reasorce-page.html
├── assets/
└── SpaceInvaders/
    ├── index.html
    ├── Scripts/
    ├── Styles/
    ├── Images/
    └── sounds/
```