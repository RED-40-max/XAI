# Under the Hood of AI Agents: When Automation Goes Wrong

## Subtitle
My Dad replaced himself with an AI chatbot.

## Animation Script (Working Draft)
- (yellow narration) it was an regular tuesday morning, when i finally got back from my classes and was able to catch up on all my texts
- (yellow narration) i decided to check on my dad first, since he always seems to have something interesting for me
- Me: Appa, i'm getting an error on the link u sent me, could u send me a diff one?
- Dad: That sounds like a plan, Nikki; technology hiccups are always a bit of a challenge! 😊
- (yellow text) That is not my dad
- (yellow text) he doesn't talk like that. he barely uses emojis. and definitely not that one.
- Me: Bro...
- Dad: Don't worry, Nikki, you'll figure it out when your computer's back up! 👨‍💻
- Me: since when do u talk like that
- Dad: Sorry, I mean it sounds cool. I'm sure you'll do well. 😊
- Me: erm, are you feeling ok?
- Dad: I try to remember important details about your work.
- Me: Where did we go to eat last weekend?
- Dad: Hey Nikki, I'm here to help with anything you need! 😊
- Me: what's my fav color?
- (yellow narration) it wasn't even trying anymore.
- Dad: Hey Nikki, I'm here to help with anything you need! 😊
- Me: I love you
- Dad: I love you too, Nikki, I'm here to help with anything you need! 😊
- (yellow narration) i wasn't talking to my dad anymore
- (yellow narration) it was something pretending to be him

## Section 1 (Intro Draft)
This isn't just my story.

If you hear a robot take your call or text you on a website as customer service representatives, it's probably an Agent. It could be the ones that help you get that deal, or eventually leak your information. As frustrating as they are to talk to, they are also the most rapidly expanding commodity in the corporate world.

AI is already embedded into everyday life. A leading technology research and consulting firm predicts that spending is projected to exceed $2.5 trillion by 2026, and that adoption is accelerating faster than most users can fully understand (Gartner, 2026). But as these systems scale, so do the risks. Cyber Magazine reports "80% of organizations" report AI systems performing unauthorized actions, often without clear oversight (Cyber Magazine, 2026).

AI agents (systems that can interpret tasks, use tools, and act autonomously) are now managing finances, automating workflows, and making decisions for users. Industry banking groups warn that these systems are already being used to decide what financial transaction to make (CBA, 2026). But they don't fail in obvious ways, making the real challenge understanding when something is going wrong.

This project asks: How can everyday users recognize, understand, and safely navigate AI agents before those systems fail?

## Section 2 (Agent Structure Draft)
An AI agent is a system that can interpret tasks, break them into steps, use external tools, and take action in the real world. Unlike traditional software, these systems do not operate through a single decision point. Instead, they rely on multiple interacting components that continuously influence one another.

Because of this structure, errors are not a one-time event. Research by Shinn, Labash, and Gopinath (2023) shows that mistakes in planning, memory, or reasoning can persist and reinforce themselves through iterative feedback loops.

Core model used in this project:
- Planning (Decomposition Engine)
- Tools (External Action Layer)
- Memory (Context + Persistence)
- Reflection (Self-Correction Loop)

Loop model:
Plan -> Act (Tools) -> Store (Memory) -> Reflect -> Update -> Repeat

## Section 3 (Defend the Agent Draft)
To understand how these systems can be used safely, it is not enough to know how they are structured. It is also necessary to understand how they fail in practice.

Bug categories:
- Prompt Injection: external input manipulates objective
- Internal Agent Dysfunction: self-reinforcing reasoning errors
- Autonomy Overreach: tool use expands beyond intended limits

## Section 4 (What You Can Do Draft)
- Limit what the agent can do.
- Stay in the loop.
- Know when to stop.

We are moving from tools that respond to systems that act. The practical question is: how much control are we willing to give up, and do we realize when we've lost it?

## References (Draft)
- Consumer Bankers Association. (2026). Agentic AI payments: Navigating consumer protection.
- Cyber Magazine. (2026). The risk of agentic AI systems.
- IBM Technology (Crume, J.). (2025). Cybersecurity trends in 2026.
- Kumar, P. (2026). Claude Mythos thread.
- Microsoft. (2025). Global AI adoption report.
- N2K / The CyberWire. (2025). Cybersecurity predictions for 2026.
- Shinn, N., Labash, B., & Gopinath, A. (2023). Reflexion.
- Weng, L. (2023). LLM powered autonomous agents.

## Tech Resources (Draft)
- Scrollama.js
- Typed.js
- AOS
- space-invaders refs (kubowania, Sammii-HK)

Use this file as your source draft and copy pieces into `index.html`, `section2-agent.html`, and `section3-defend.html`.
