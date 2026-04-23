function showInfo(part) {
    const output = document.getElementById("output");

    const info = {
      planning: `
        <h2>Planning</h2>
        <p>Planning breaks a goal into smaller steps so the agent can act systematically.</p>
        <p><strong>Analogy:</strong> Like writing a recipe before cooking. If one step is wrong, the rest of the process can go wrong too.</p>
      `,
      tools: `
        <h2>Tools</h2>
        <p>Tools let the agent act beyond text generation, like using APIs, files, search, or other systems.</p>
        <p><strong>Analogy:</strong> Like giving someone your phone, keys, and credit card to run errands for you.</p>
      `,
      memory: `
        <h2>Memory</h2>
        <p>Memory stores and retrieves context so the agent can build on past steps.</p>
        <p><strong>Analogy:</strong> Like a notebook the system keeps referring back to, even if something in it is wrong.</p>
      `,
      reflection: `
        <h2>Reflection</h2>
        <p>Reflection helps the agent review past actions and adjust future behavior.</p>
        <p><strong>Analogy:</strong> Like checking your test after finishing, except sometimes you incorrectly convince yourself your wrong answers are right.</p>
      `
    };

    output.innerHTML = info[part];
  }