const QUESTIONS = [
  {
    id: 1,
    difficulty: "easy",
    text: "What does the shikigami Round Deer (Madoka) do?",
    type: "open",
    placeholder: "Describe its ability...",
    check: (ans) => /heal|positive|RCT|reverse|counter|negate|neutral/i.test(ans)
  },
  {
    id: 2,
    difficulty: "easy",
    text: "How long did Gojo take to kill all the transfigured humans in the Shibuya incident (after the 0.2s domain)?",
    type: "open",
    placeholder: "Time in seconds...",
    check: (ans) => /299|300|just under 300|almost 300/i.test(ans)
  },
  {
    id: 3,
    difficulty: "easy",
    text: "What is the name of Jogo’s Domain Expansion?",
    type: "open",
    placeholder: "Domain name...",
    check: (ans) => /coffin.*iron.*mountain|gaikan.*tecchisen|iron mountain/i.test(ans)
  },
  {
    id: 4,
    difficulty: "easy",
    text: "Red (Gojo’s technique) uses:",
    type: "choice",
    options: ["A. RCT (Reverse Cursed Technique)", "B. CTR (Cursed Technique Reversal)"],
    correct: 1
  },
  {
    id: 5,
    difficulty: "medium",
    text: "In what episode is the song AIZO played? (Season 3 OP by King Gnu)",
    type: "audio",
    audioNote: "AIZO — King Gnu (JJK Season 3 Opening)",
    check: (ans) => /season 3|s3|culling game|episode 1|premiere|first episode/i.test(ans)
  },
  {
    id: 6,
    difficulty: "medium",
    text: "What is Kusakabe’s cursed technique? (Open-ended)",
    type: "open",
    placeholder: "He has... or none...",
    check: (ans) => /none|no innate|no technique|doesn't have|does not have|new shadow|simple domain|batto/i.test(ans)
  },
  {
    id: 7,
    difficulty: "medium",
    text: "What is the name of Maki’s most famous cursed tool (the three-section staff)?",
    type: "open",
    placeholder: "Tool name...",
    check: (ans) => /playful cloud|yuun|yūn/i.test(ans)
  },
  {
    id: 8,
    difficulty: "medium",
    text: "What is the name of Inumaki’s cursed speech markings?",
    type: "open",
    placeholder: "Seal name...",
    check: (ans) => /snake.*fang|serpent.*fang|snake eyes|fangs seal/i.test(ans)
  },
  {
    id: 9,
    difficulty: "medium",
    text: "What is the name of Yuki Tsukumo’s shikigami / cursed spirit medium?",
    type: "open",
    placeholder: "Name of the shikigami...",
    check: (ans) => /garuda/i.test(ans)
  },
  {
    id: 10,
    difficulty: "medium",
    text: "How many years of cursed energy did Mechamaru’s Ultimate Mechamaru Mode: Absolute have stored at the start of the fight against Mahito?",
    type: "open",
    placeholder: "Number of years...",
    check: (ans) => /17|seventeen/i.test(ans)
  },
  {
    id: 11,
    difficulty: "hard",
    text: "True or False: Kusakabe is the only Grade 1 sorcerer with no innate technique.",
    type: "tf",
    correct: true
  },
  {
    id: 12,
    difficulty: "hard",
    text: "True or False: Round Deer can heal allies and neutralize opponent cursed energy with positive energy.",
    type: "tf",
    correct: true
  },
  {
    id: 13,
    difficulty: "hard",
    text: "True or False: Gojo’s 0.2 second Unlimited Void permanently brain-damaged all the civilians on the platform.",
    type: "tf",
    correct: false
  },
  {
    id: 14,
    difficulty: "hard",
    text: "Name three people who have used (or owned) the cursed tool Playful Cloud.",
    type: "names",
    required: 3,
    check: (ans) => {
      const lower = ans.toLowerCase();
      const hits = [/toji/, /geto/, /maki/, /gojo/].filter(r => r.test(lower));
      return hits.length >= 3;
    }
  },
  {
    id: 15,
    difficulty: "hard",
    text: "What race is Maru (from Jujutsu Kaisen Modulo) from?",
    type: "open",
    placeholder: "Alien race...",
    check: (ans) => /simurian|rumelian|rumelia/i.test(ans)
  },
  {
    id: 16,
    difficulty: "obscure",
    text: "According to Gege Akutami, what do Sukuna’s fingers taste like?",
    type: "open",
    placeholder: "Taste...",
    check: (ans) => /soap/i.test(ans)
  },
  {
    id: 17,
    difficulty: "obscure",
    text: "Nanami’s maternal grandfather is from which country?",
    type: "open",
    placeholder: "Country...",
    check: (ans) => /denmark|danish/i.test(ans)
  },
  {
    id: 18,
    difficulty: "obscure",
    text: "True or False: Yuki Tsukumo was once a Star Plasma Vessel candidate.",
    type: "tf",
    correct: true
  },
  {
    id: 19,
    difficulty: "obscure",
    text: "True or False: Mechamaru Mode: Absolute’s Miracle Cannon consumes two years of cursed energy per blast.",
    type: "tf",
    correct: true
  }
];

const STORAGE_KEY = "jjkQuiz_v1_completed";
const ANSWERS_KEY = "jjkQuiz_v1_answers";

let current = 0;
let answers = [];

function loadState() {
  const done = localStorage.getItem(STORAGE_KEY);
  if (done === "true") {
    showResults(true);
    return true;
  }
  const saved = localStorage.getItem(ANSWERS_KEY);
  if (saved) {
    try {
      answers = JSON.parse(saved);
      current = answers.length;
    } catch(e) {}
  }
  return false;
}

function saveProgress() {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

function renderQuestion() {
  if (current >= QUESTIONS.length) {
    finishQuiz();
    return;
  }
  const q = QUESTIONS[current];
  const container = document.getElementById("quiz-container");
  const pct = (current / QUESTIONS.length) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";

  let html = `<div class="question-card">
    <div class="difficulty diff-${q.difficulty}">${q.difficulty.toUpperCase()}</div>
    <div class="q-text">${q.text}</div>`;

  if (q.type === "audio") {
    html += `
      <div class="audio-bar">
        <button class="play-btn" onclick="window.open('https://www.youtube.com/results?search_query=AIZO+King+Gnu+Jujutsu+Kaisen+OP', '_blank')">▶</button>
        <div class="track"><div class="fill"></div></div>
        <div class="time">${q.audioNote}</div>
      </div>
      <div class="open-input">
        <input type="text" id="ans" placeholder="Your answer (e.g. Season 3 Episode 1)..." autocomplete="off">
      </div>`;
  } else if (q.type === "choice") {
    html += `<div class="options">`;
    q.options.forEach((opt, i) => {
      html += `<button type="button" data-i="${i}" onclick="selectChoice(${i})">${opt}</button>`;
    });
    html += `</div>`;
  } else if (q.type === "tf") {
    html += `<div class="options">
      <button type="button" data-i="true" onclick="selectTF(true)">True</button>
      <button type="button" data-i="false" onclick="selectTF(false)">False</button>
    </div>`;
  } else if (q.type === "names") {
    html += `<div class="open-input">
      <textarea id="ans" placeholder="Name three people (separated by commas or spaces)..."></textarea>
    </div>`;
  } else {
    html += `<div class="open-input">
      <input type="text" id="ans" placeholder="${q.placeholder || 'Your answer...'}" autocomplete="off">
    </div>`;
  }

  html += `<button class="next-btn" onclick="nextQuestion()">Next</button></div>`;
  container.innerHTML = html;
}

function selectChoice(i) {
  document.querySelectorAll(".options button").forEach(b => b.classList.remove("selected"));
  document.querySelector(`.options button[data-i="${i}"]`).classList.add("selected");
  answers[current] = i;
}

function selectTF(val) {
  document.querySelectorAll(".options button").forEach(b => b.classList.remove("selected"));
  document.querySelector(`.options button[data-i="${val}"]`).classList.add("selected");
  answers[current] = val;
}

function nextQuestion() {
  const q = QUESTIONS[current];
  let val = "";
  if (q.type === "choice") {
    if (answers[current] === undefined) {
      alert("Pick an option.");
      return;
    }
    val = answers[current];
  } else if (q.type === "tf") {
    if (answers[current] === undefined) {
      alert("Pick True or False.");
      return;
    }
    val = answers[current];
  } else {
    const input = document.getElementById("ans");
    val = (input?.value || "").trim();
    if (!val) {
      alert("Answer something.");
      return;
    }
    answers[current] = val;
  }
  saveProgress();
  current++;
  renderQuestion();
}

function finishQuiz() {
  localStorage.setItem(STORAGE_KEY, "true");
  localStorage.removeItem(ANSWERS_KEY);
  showResults(false);
}

function showResults(fromStorage) {
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("progress-bar").classList.add("hidden");
  const screen = document.getElementById("result-screen");
  screen.classList.remove("hidden");

  let score = 0;
  if (!fromStorage && answers.length === QUESTIONS.length) {
    QUESTIONS.forEach((q, i) => {
      if (q.type === "choice") {
        if (answers[i] === q.correct) score++;
      } else if (q.type === "tf") {
        if (answers[i] === q.correct) score++;
      } else if (q.check && typeof answers[i] === "string") {
        if (q.check(answers[i])) score++;
      }
    });
  }

  document.getElementById("score-text").innerHTML =
    fromStorage
      ? "You already completed this test on this browser.<br><strong>Score is sealed forever.</strong>"
      : `You scored <strong>${score}</strong> / ${QUESTIONS.length}.`;

  document.getElementById("progress-fill").style.width = "100%";
}

// Init
if (!loadState()) {
  renderQuestion();
}
