const lines = [
    {
      type: "narration",
      text: "it was a regular tuesday morning, when i finally got back from my classes and was able to catch up on all my texts"
    },
    {
      type: "narration",
      text: "i decided to check on my dad first, since he always seems to have something interesting for me!"
    },
    {
      type: "me",
      text: "Appa, i’m getting an error on the link u sent me, could u send me a diff one?"
    },
    {
      type: "dad",
      text: "That sounds like a plan, Nikki; technology hiccups are always a bit of a challenge! 😊"
    },
    {
      type: "narration",
      text: "That is not my dad"
    },
    {
      type: "narration",
      text: "he doesn’t talk like that. he barely uses emojis. and definitely not that one."
    },
    {
      type: "me",
      text: "Bro…"
    },
    {
      type: "dad",
      text: "Don't worry, Nikki, you'll figure it out when your computer's back up! 👨‍💻"
    },
    {
      type: "me",
      text: "since when do u talk like that"
    },
    {
      type: "dad",
      text: "Sorry, I mean it sounds cool. I’m sure you’ll do well. 😊"
    },
    {
      type: "me",
      text: "erm, are you feeling ok?"
    },
    {
      type: "dad",
      text: "I try to remember important details about your work."
    },
    {
      type: "me",
      text: "Where did we go to eat last weekend?"
    },
    {
      type: "dad",
      text: "Hey Nikki, I'm here to help with anything you need! 😊"
    },
    {
      type: "me",
      text: "what’s my fav color?"
    },
    {
      type: "narration",
      text: "it wasn’t even trying anymore."
    },
    {
      type: "dad",
      text: "Hey Nikki, I'm here to help with anything you need! 😊"
    },
    {
      type: "me",
      text: "I love you"
    },
    {
      type: "dad",
      text: "I love you too, Nikki, I'm here to help with anything you need! 😊"
    },
    {
      type: "narration",
      text: "i wasn’t talking to my dad anymore"
    },
    {
      type: "narration",
      text: "it was something pretending to be him"
    }
  ];

  const chat = document.getElementById("chat");

  lines.forEach((line, i) => {
    const bubble = document.createElement("div");
    bubble.className = `msg ${line.type}`;
    bubble.textContent = line.text;
    bubble.style.animationDelay = `${i * 1.15}s`;
    chat.appendChild(bubble);
  });

  lines.forEach((line, i) => {
    setTimeout(() => {
      const bubble = document.createElement("div");
      bubble.className = `msg ${line.type}`;
      bubble.textContent = line.text;
      chat.appendChild(bubble);
      chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
    }, i * 1150);
  });