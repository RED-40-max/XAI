function showBug(type) {
    const output = document.getElementById("bug-output");

    const bugs = {
      prompt: `
        <h2>Prompt Injection</h2>
        <p>This happens when external input manipulates the agent.</p>
        <ul>
          <li>The system follows the wrong objective</li>
          <li>It ignores original instructions</li>
          <li>It may produce unsafe outputs</li>
        </ul>
      `,
      internal: `
        <h2>Internal Agent Dysfunction</h2>
        <p>This happens when the system starts failing internally instead of being attacked from outside.</p>
        <ul>
          <li>The agent drifts off task</li>
          <li>It makes inconsistent decisions</li>
          <li>It continues with confidence even when wrong</li>
        </ul>
      `,
      autonomy: `
        <h2>Autonomy Overreach</h2>
        <p>This happens when the agent acts beyond what the user intended.</p>
        <ul>
          <li>It performs actions it should not</li>
          <li>It misuses tools</li>
          <li>It causes real-world consequences</li>
        </ul>
      `
    };

    output.innerHTML = bugs[type];
  }