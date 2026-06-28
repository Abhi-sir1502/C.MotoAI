(function () {
  // ===== Read userId from the embed script tag =====
  const script = document.currentScript;
  const userId = script?.dataset?.userId;
  const theme = "dark";
  let assistantConfig = null;
  let hasGreeted = false;

  // Global States for Continuous Flow
  let isListening = false;
  let aiReplying = false;
  let recognition = null;

  // ===== Load assistant.css (must be in /public folder) =====
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://motoai.onrender.com/assistant.css";
  document.head.appendChild(link);

  // ===== Build the popup chat window =====
  const popup = document.createElement("div");
  popup.className = `moto-popup theme-${theme}`;
  popup.style.display = "none";

  popup.innerHTML = `
    <div class="moto-overlay"></div>
    <div class="moto-content">
      <div class="moto-top">
        <div class="moto-orb-wrap">
          <div class="moto-orb-glow"></div>
          <div class="moto-orb"></div>
        </div>
        <h2 class="moto-title">Hello! I'm Moto AI</h2>
        <p class="moto-sub">
          Your smart voice assistant.
          <br/>
          Ask anything about your website.
        </p>
        <div class="moto-status">Tap button to speak</div>
        <div class="moto-wave">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
        <div class="moto-user-text"></div>
        <div class="moto-ai-text"></div>
      </div>
      <div class="moto-bottom">
        <button class="moto-mic">
          <img src="https://motoai.onrender.com/mic.svg" alt="mic" class="moto-mic-icon" />
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // ===== Floating toggle button =====
  const button = document.createElement("button");
  button.className = `moto-btn theme-${theme}`;
  button.innerHTML = <img src="./logo.jpeg" alt="logo" />;
  document.body.appendChild(button);

  // ===== Grab popup elements for voice interaction =====
  const status = popup.querySelector(".moto-status");
  const wave = popup.querySelector(".moto-wave");
  const userText = popup.querySelector(".moto-user-text");
  const aiText = popup.querySelector(".moto-ai-text");
  const mic = popup.querySelector(".moto-mic");

  // ===== Text-to-Speech: makes the assistant "talk" =====
  const speak = (text) => {
    window.speechSynthesis.cancel();
    aiReplying = true; // AI bolna shuru kar raha hai

    aiText.innerHTML = text;
    status.innerHTML = "AI Speaking...";
    wave.style.opacity = "1";
    mic.classList.add("moto-mic-speaking");

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    // ===== Speech Synthesis End Handler =====
    speech.onend = () => {
      aiReplying = false; // AI bolna khatam kar chuka hai
      
      if (isListening && recognition) {
        status.innerText = "Listening instantly...";
        wave.style.opacity = "1";
        
        try {
          recognition.stop(); 
          setTimeout(() => {
            if (isListening && !aiReplying) recognition.start();
          }, 300);
        } catch (e) {
          // Safe bypass
        }
      } else {
        status.innerText = "Tap button to Speak";
        wave.style.opacity = "0";
      }
    };

    window.speechSynthesis.speak(speech);
  }; // 🚀 Fixed: Ab speak function perfectly close ho gaya hai

  // ===== Toggle popup open/close + greet on first open =====
  let open = false;
  button.onclick = () => {
    open = !open;
    popup.style.display = open ? "flex" : "none";

    if (open && !hasGreeted && assistantConfig) {
      hasGreeted = true;
      const greeting = `Hello, I'm ${assistantConfig.assistantName || "Moto AI"}. How can I help you?`;
      speak(greeting); 
    } else if (!open) {
      isListening = false;
      aiReplying = false;
      window.speechSynthesis.cancel();
      if (recognition) recognition.stop();
      status.innerText = "Tap button to Speak";
      wave.style.opacity = "0";
    }
  };

  // ===== Fetch this user's assistant config =====
  const loadAssistant = async () => {
    try {
      if (!userId) {
        console.error("Moto AI Error: data-user-id attribute is missing from script tag!");
        return;
      }
      const res = await fetch(`https://c-motoaiserver.onrender.com/api/assistant/config/${userId}`);
      const data = await res.json();

      if (data?.user) {
        assistantConfig = data.user;
        applyConfig();

        if (open && !hasGreeted) {
          hasGreeted = true;
          const greeting = `Hello, I'm ${assistantConfig.assistantName || "Moto AI"}. How can I help you?`;
          speak(greeting);
        } 
      }
    } catch (error) { 
      console.log("Assistant Load Error:", error);
    }
  };

  // ===== Apply fetched theme / business name into the popup =====
  const applyConfig = () => {
    if (!assistantConfig) return;

    popup.className = `moto-popup theme-${assistantConfig.theme || "dark"}`;
    button.className = `moto-btn theme-${assistantConfig.theme || "dark"}`;

    const title = popup.querySelector(".moto-title");
    title.innerHTML = `Hello! I'm ${assistantConfig.assistantName || "Moto AI"}`;

    const subTitle = popup.querySelector(".moto-sub");
    subTitle.innerHTML = `
      Welcome to ${assistantConfig.businessName || "our website"}.
      <br/>
      Ask anything about your website.`;
  };

  loadAssistant();

  // ===== Speech-to-Text: Continuous listening setup =====
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";       
    recognition.continuous = true;  
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    mic.onclick = () => {
      if (isListening) {
        isListening = false;
        aiReplying = false;
        window.speechSynthesis.cancel();
        recognition.stop();
        status.innerText = "Tap button to Speak";
        wave.style.opacity = "0";
        mic.style.background = ""; 
      } else {
        isListening = true;
        aiText.innerText = "";
        userText.innerText = "";
        wave.style.opacity = "1";
        status.innerText = "Listening...";
        recognition.start();
      }
    };

    recognition.onresult = (e) => {
      if (aiReplying) return;

      const lastResultIndex = e.results.length - 1;
      const text = e.results[lastResultIndex][0].transcript;
      
      if (!text.trim()) return;

      userText.innerText = "You: " + text;
      recognition.stop();

      (async () => {
        try {
          status.innerText = "Thinking...";

          if (!userId) {
            speak("User configuration missing.");
            status.innerText = "Config Error";
            return;
          }

          const res = await fetch(`https://c-motoaiserver.onrender.com/api/assistant/ask`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: text,
              userId: userId,
              currentPath: window.location.pathname
            })
          });

          const data = await res.json();

          if (res.ok && data.success) {
            if (data.action === "navigate") {
              speak(data.response);
              isListening = false; 
              setTimeout(() => {
                window.location.href = data.path;
              }, 1500);
            } else {
              speak(data.response);
            }
          } else {
            speak(data.message || "Response error, please check your settings.");
            status.innerText = "Error occurred";
          }

        } catch (error) {
          console.log(error);
          speak("AI Server Error");
          status.innerText = "Server Error";
        }
      })();
    };

    // ===== Recognition End Handler =====
    recognition.onend = () => {
      if (isListening && !aiReplying) {
        setTimeout(() => {
          try {
            if (isListening && !aiReplying) recognition.start();
          } catch (e) {
            // Safe bypass
          }
        }, 300);
      }
    };

    recognition.onerror = (event) => {
      console.log("Speech Error:", event.error);
      if (isListening && !aiReplying) {
        status.innerText = "Listening instantly...";
      }
    };

  } else {
    status.innerText = "Speech Recognition not supported";
  }
})();