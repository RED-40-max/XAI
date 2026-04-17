import { useMemo, useState } from "react";
import "./App.css";

const BLOG_TEXT = `Under the Hood of AI Agents: When Automation Goes Wrong
Make this hook better 
Inside the brain of our AI overlords 


Question
How can we help average people navigate communication and technology in the age of AI agents?

Audience: 
Everyday tech users (students, young professionals, general consumers) who interact but don’t fully understand AI tools 

Purpose
The purpose of this project is to help users understand how AI agents function, why they fail, and how those failures can impact real-world decisions. Instead of only explaining risks, this project aims to make users experience them through interactive simulation, while also providing actionable strategies for safer use.

Section 1: Landing page (hook) 

[Visual: iMessage screen → typing bubbles → messages become robotic chatbot response]
	Pick between interactive or plain text version 
To make the project accessible to multiple audiences, I designed both an interactive mode and a text-based reading mode. This allows users to choose the format that best fits their needs while still accessing the same research, explanations, and conclusions.

[Sound: subtle notification ping → distortion]
[img1][img2]
I was texting him one day and I noticed his messages started to look strange, and he was responding unusually fast, with too good grammar, and too consistently. 
So I decided to test it a little. 
[Visual: typing bubbles for test message → instant robotic output of long message]
[img3] 
I realized I wasn't talking to my dad anymore, I was talking to a robot. 
My Dad replaced himself with an AI chatbot. 
—--- 
This isn’t just my story
It reflects a world where AI is already embedded into everyday life. With “one in six people globally” using generative AI and spending projected to exceed $2.5 trillion by 2026, adoption is accelerating faster than most users can fully understand (Microsoft, 2025; Gartner, 2026).
But as these systems scale, so do the risks. “80% of organizations” report AI systems performing unauthorized actions, often without clear oversight (Cyber Magazine, 2026).

AI agents, systems that can interpret tasks, use tools, and act on their own, are now managing finances, automating workflows, and making decisions for users (CBA, 2026; Anthropic, 2025). They operate as continuous loops of planning, memory, and action, adapting over time (Weng, 2023; Shinn et al., 2023).

But they don’t fail in obvious ways.

So the challenge is understanding when it’s going wrong.

This project asks: How can everyday users recognize, understand, and safely navigate AI agents before those systems fail?
Section 2: What is an AI Agent? 
An AI agent is a system that can interpret tasks, break them into steps, use external tools, and take action in the real world. To understand how these systems fail, and how to use them safely, you first need to understand how they work internally.

Modern AI agents operate as an iterative loop of planning, memory, tool use, and reflection, where each component continuously influences the next (Weng, 2023). In more advanced systems, this loop includes self-correction mechanisms, where the agent evaluates its own outputs and updates its behavior over time (Shinn et al., 2023).

This structure is what makes AI agents powerful.
But it is also what makes them risky.

Because these systems rely on multiple interacting components, errors are not isolated. 
A mistake in planning, memory, or reasoning can propagate through the system, compounding into larger failures while the agent continues acting with confidence (Shinn et al., 2023). This helps explain why real world incidents (such as unauthorized actions or unintended outputs) can occur even without direct attacks, especially as these systems operate at increasing scale and autonomy (Cyber Magazine, 2026; IBM, 2025).

Interactive part 1: Building your agent 
[instruction: drag components into the system, hover over them to see what they do, drop them down and connect them to other components ] 

[Brain]
What it is:  The central decision-maker. It interprets the task, chooses actions, and coordinates every other component.
Why it matters: The brain determines what the agent does. If it misinterprets a task, everything downstream is affected.
Risk: Agents can act confidently on incorrect interpretations, especially when reasoning is multi-step and not externally verified (Shinn et al., 2023).
Analogy: A manager giving instructions—if they misunderstand the assignment, the whole team follows the wrong plan.
Connections:
Receives → Memory, Tools
Directs → Planning, Tools
Updated by → Reflection

[Planning]
What it is: Breaks a goal into smaller steps so the agent can act systematically.
Why it matters: Planning enables complex tasks—but also introduces multiple points where errors can occur.
Risk: A flawed plan doesn’t just fail once—it cascades across every step that follows.
Analogy: Planning a road trip—one wrong route affects every stop afterward.
Connections:
Controlled by → Brain
Updated by → Reflection
Uses → Memory

[Memory]
What it is: Stores and retrieves information (short-term context + long-term external data).
Why it matters: Memory allows agents to build on past steps instead of starting from scratch.
Risk: Incorrect or outdated memory can reinforce bad decisions, causing the system to repeat or amplify mistakes over time (Weng, 2023).
Real-world link: This is why AI systems can reuse incorrect information across actions, contributing to unintended outcomes like data exposure (Cyber Magazine, 2026).
Analogy: Using notes during a test—helpful if correct, dangerous if wrong.
Connections:
Accessed by → Brain, Planning
Updated by → Tools, Reflection 


[Tools]
What it is: External capabilities (APIs, search, code execution, financial systems).
Why it matters: Tools allow agents to act in the real world—not just generate text.
Risk: As agents gain access to real systems, mistakes become real consequences (e.g., financial actions, data access) (CBA, 2026).
Real-world link: This is what enables “agentic payments” and automated decision-making, where AI acts on behalf of users.
Analogy: A student with a calculator, internet, and lab equipment—powerful, but easy to misuse.
Connections:
Called by → Brain
Feeds results to → Memory, Brain

[Reflection]
What it is: Allows the agent to evaluate past actions and adjust future behavior.
Why it matters: This is what makes agents adaptive instead of static.
Risk (important): Reflection can fail. Agents may generate incorrect self-feedback, leading to worse decisions over time—what researchers call “hallucinatory reflection” (Shinn et al., 2023).
This is critical: The system thinks it is improving—even when it is not.
Analogy: Checking your work—but convincing yourself the wrong answer is correct.
Connections:
Feeds into → Brain, Planning
Updates → Memory

Together this creates a loop 
Together, these components form a continuous loop:
Plan → Act (Tools) → Store (Memory) → Reflect → Update
This loop defines how modern AI agents operate (Weng, 2023)


[img4] 
[img5] 
[img 6] 
Citation: https://lilianweng.github.io/posts/2023-06-23-agent/

This loop is what makes AI agents powerful, but also what makes them risky.
Because these systems rely on multiple interacting components, errors are not isolated. A mistake in planning, memory, or reasoning can propagate through the loop, compounding over time. What begins as a small error can escalate into a larger failure as the system continues acting on flawed assumptions (Shinn et al., 2023).
This helps explain why real-world issues, such as unauthorized actions or unintended decisions, can occur even without direct attacks, especially as these systems operate with increasing autonomy (Cyber Magazine, 2026; IBM, 2025).

Section 3: Defend the Agent 
[Visual: Screen glitches → “BUG DETECTED”]
[Sound: alarm / distortion]

Interactive part 2: Bug system → like HAL 9000 (2001 space odyssey) 
[Prompt injection] 
The agent is being manipulated by external input—following instructions it should not trust (Weng, 2023).
Because AI agents rely on natural language, malicious or irrelevant instructions can override the original task if inputs are not properly separated or validated.
Impact on system:
Follows the wrong goal
Ignores original instructions
Produces unsafe or unintended outputs
Real-world significance: This is how attackers can exploit AI systems—by embedding hidden instructions in emails, documents, or websites, causing agents to leak data or take unintended actions (IBM, 2025; Cyber Magazine, 2026).
Defense tactics:
Filter and validate inputs before processing
Separate system instructions from user-provided data
Constrain planning steps to stay aligned with the original goal
For users: Not all AI outputs are trustworthy—especially when the system is interacting with external data.


[internal agent dysfunction] 
HAL - 2001 space odyssey reference 
“This agent isn’t broken by the outside world… it’s breaking itself.”(Weng, 2023)
The agent is critiquing itself, but its critique is a lie." Even with a self-correction loop, agents can suffer from "hallucinatory reflections"—where they realize they made a mistake but invent a fake reason why, leading to an even worse decision in the next step (Shinn et al., 2023).
 Agents rely on multi-step reasoning (planning, memory, reflection), but they don’t always verify themselves. Small mistakes can compound across steps, and without proper reflection, the agent continues with high confidence even when it’s wrong.
Impact on system: The agent drifts off-task, makes inconsistent decisions, and continues executing flawed reasoning without realizing it.
Defense tactics:
(85%) Use reflection (self-checking) to catch mistakes early
(80%) Break tasks into smaller steps to reduce compounding errors
(70%) Restart or reset when behavior becomes unstable 
[img7] 
[Autonomy Overreach] 
“This agent isn’t just thinking… it’s acting without enough control.”(Weng, 2023)
 Agents can plan and execute actions using tools, but without strict limits, they may take actions that go beyond their intended scope. As autonomy increases, so does the risk of unintended or harmful behavior. 
Impact on system: The agent may execute actions it wasn’t supposed to, misuse tools, or cause unintended consequences in real systems.
Defense tactics:
(90%) Limit permissions (restrict what actions the agent can take)
(85%) Require human approval for critical actions
(75%) Add constraints to planning and execution steps


[Final bug: system overconfidence]
This cannot be fixed  
Plays ‘open the pod door HAL’ 
[img8]
Mini game to access kill switch: table tennis for 2 (first computer game ever
This reflects how small reasoning errors can compound across iterative agent loops, eventually leading to unrecoverable system states (Weng, 2023).
Section 4: call to action 
[visual: bugs and their real world translation] 
Average users can navigate AI agents more safely by understanding how these systems plan, remember, and act; by recognizing common failure modes; and by keeping humans in control of important decisions.

Together, these sources show that the risk of agentic AI is not just external attacks, but also how these systems are designed and used, where autonomy, scale, and lack of oversight create new vulnerabilities (CBA, 2026; McAfee, 2025; IBM, 2025).
You may be tempted to integrate AI agents into your own life—and honestly, that makes sense. They can write your emails, manage your schedule, automate tasks, and even make financial decisions. 
“One in six people globally use generative AI” (Microsoft, 2025).
AI agents are powerful because they reduce effort, increase speed, and make complex tasks accessible. They can help with productivity, organization, and even decision-making. But as we’ve seen, that convenience comes with trade-offs. These systems are being adopted faster than the safeguards needed to support them, and
“80% of organizations report unauthorized AI actions” (Cyber Magazine, 2026).
But the goal isn’t to ban them, but to use them with awareness.

Agentic AI is shifting its tools more quickly than humans can track. Experts predict a shift toward “AI vs. AI” environments, where autonomous systems act and adapt faster than humans can respond (N2K, 2025) 
This creates a world where:
You are not always in control
You may not fully understand what the system is doing
And when something goes wrong, responsibility is unclear

What you can do: 
Limiting What the Agent Can Do  Just because an AI can do something doesn’t mean it should. Don’t give full access to sensitive systems (banking, email, files) Treat AI like a junior assistant, not an autonomous decision-maker (Consumer Bankers Association, 2026)
Strategies like limiting permissions and isolating agent actions are recommended in modern AI security frameworks (OWASP,
Stay in the Loop: Don't fully automate important decisions. Review outputs before acting on them Double-check anything involving money, identity, or communication 
Know When to Stop Using It: If something feels off → pause, Don’t keep iterating blindly, Restart or step in manually 

This is about control.
We are moving from tools that respond → to systems that act.
 From software that executes → to agents that decide.

Using AI agents today is a lot like handing over the keys to your house.
Except now, those keys can:
Move on their own
Learn from their environment
And decide which doors to open
The question isn’t:
“Should we use AI?”
It’s:
“How much control are we willing to give up—and do we even realize when we’ve lost it?”

Lilian Weng — LLM Powered Autonomous Agents
Blog post (2023)
https://lilianweng.github.io/posts/2023-06-23-agent/
Consumer Bankers Association — Agentic AI Payments: Navigating Consumer Protection
White paper (2026)
https://consumerbankers.com/wp-content/uploads/2026/01/CBA-Agentic-Symposium-White-Paper-2026-01v2.pdf
Anthropic — Labor Market Impacts of Generative AI and Agentic Systems
Research report (2025)
https://www.anthropic.com/research/labor-market-impacts
Microsoft — Global AI Adoption Report
Industry report (2025)
https://www.microsoft.com/en-us/corporate-responsibility/topics/ai-economy-institute/reports/global-ai-adoption-2025/
Cyber Magazine — The Risk of Agentic AI Systems
Article (2026)
https://cybermagazine.com/news/the-risk-of-agentic-the-story-of-metas-ai-agent-data-leak
IBM Technology (Jeff Crume) — Cybersecurity Trends in 2026: Shadow AI, Quantum & Deepfakes
YouTube video (2025)
https://www.youtube.com/watch?v=2jU-mLMV8Vw
N2K / The CyberWire — Cybersecurity Predictions for 2026
Industry analysis (2025)
https://thecyberwire.com/stories/5a2a9536820742d9afc5be71e4002eab/looking-ahead-cybersecurity-predictions-for-2026


Shinn, N., Labash, B., & Gopinath, A. (2023). Reflexion: Language agents with verbal reinforcement learning. arXiv preprint arXiv:2303.11366. https://arxiv.org/pdf/2303.11366

This is based on the Reflexion architecture, which allows the agent to use "linguistic feedback" to improve itself. Instead of just failing, the agent writes a summary of its mistake, stores it in memory, and treats it as a hint for the next try (Shinn et al., 2023).
Like: Realizing you missed a turn on a road trip, and instead of just driving in circles, you stop to note why you missed it so you don’t repeat the error at the next junction.
Connects to: Feeds "Self-Reflection" text back into the Brain to influence the next Planning step.
To provide an academically rigorous explanation of agent architecture, I utilized Shinn et al.’s (2023) 'Reflexion' framework. While industry reports focus on the results of AI, Shinn et al. explain the internal mechanism of the 'Reasoning-Acting' loop. By incorporating their concept of verbal reinforcement into my interactive simulator, I allow the audience to see exactly how an agent attempts to 'think' through a problem and, crucially, how that self-correction process can fail when the agent's internal feedback becomes decoupled from reality.`;

const AGENT_COMPONENTS = ["Brain", "Planning", "Memory", "Tools", "Reflection"];

const BUG_CARDS = [
  {
    key: "prompt-injection",
    title: "Prompt injection",
    body: "The agent is being manipulated by external input and can follow instructions it should not trust."
  },
  {
    key: "internal-agent-dysfunction",
    title: "internal agent dysfunction",
    body: "The agent self-corrects incorrectly, compounds mistakes, and keeps running with confidence."
  },
  {
    key: "autonomy-overreach",
    title: "autonomy overreach",
    body: "The agent acts beyond intended limits when permissions and approval boundaries are weak."
  }
];

function App() {
  const [mode, setMode] = useState("interactive");
  const [selectedAgentParts, setSelectedAgentParts] = useState([]);
  const [openBugCards, setOpenBugCards] = useState({});

  const sectionHeadings = useMemo(
    () =>
      BLOG_TEXT.split("\n")
        .filter((line) => line.startsWith("Section "))
        .map((title, index) => ({ id: `section-${index + 1}`, title })),
    []
  );

  const togglePart = (part) => {
    setSelectedAgentParts((prev) =>
      prev.includes(part) ? prev.filter((item) => item !== part) : [...prev, part]
    );
  };

  const toggleBugCard = (key) => {
    setOpenBugCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="page">
      <section className="block header-block">
        <p className="eyebrow">Student Multimodal Project Rough Cut</p>
        <h1>Single-Page Blog Mockup</h1>
      </section>

      <section className="block mode-block">
        <h2>View Mode</h2>
        <div className="mode-controls">
          <button
            type="button"
            className={mode === "interactive" ? "mode-btn is-active" : "mode-btn"}
            onClick={() => setMode("interactive")}
          >
            Interactive Mode
          </button>
          <button
            type="button"
            className={mode === "plain" ? "mode-btn is-active" : "mode-btn"}
            onClick={() => setMode("plain")}
          >
            Plain Text Mode
          </button>
        </div>
      </section>

      <div className="content-layout">
        {sectionHeadings.length > 0 ? (
          <aside className="block nav-block">
            <h2>Quick Nav</h2>
            <ul>
              {sectionHeadings.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <section className="block text-block">
          <h2>Project Text (Verbatim)</h2>
          <div className="verbatim-frame">
            {sectionHeadings.map((section) => (
              <span key={section.id} id={section.id} className="section-anchor" aria-hidden="true" />
            ))}
            <pre className="verbatim-text">{BLOG_TEXT}</pre>
          </div>
        </section>
      </div>

      {mode === "interactive" ? (
        <section className="interactive-zone">
          <div className="block panel-block">
            <h2>Agent Builder (Mock)</h2>
            <div className="chip-grid">
              {AGENT_COMPONENTS.map((part) => (
                <button
                  key={part}
                  type="button"
                  className={selectedAgentParts.includes(part) ? "chip is-selected" : "chip"}
                  onClick={() => togglePart(part)}
                >
                  {part}
                </button>
              ))}
            </div>
            <p className="panel-note">
              Selected components:{" "}
              {selectedAgentParts.length > 0 ? selectedAgentParts.join(", ") : "none"}
            </p>
          </div>

          <div className="block panel-block">
            <h2>Bug Cards (Mock)</h2>
            <div className="bug-list">
              {BUG_CARDS.map((bug) => (
                <article key={bug.key} className="bug-card">
                  <button type="button" className="bug-trigger" onClick={() => toggleBugCard(bug.key)}>
                    {bug.title}
                  </button>
                  {openBugCards[bug.key] ? <p>{bug.body}</p> : null}
                </article>
              ))}
              <article className="bug-card is-disabled">
                <button type="button" disabled className="bug-trigger">
                  Final bug: system overconfidence
                </button>
              </article>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default App;