'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

const avatars = ['🧑‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '🧠', '📚'];

const questions = [
  {
    question: 'She ___ a student.',
    options: ['is', 'are', 'be'],
    answer: 'is',
    explanation: 'She is singular, so we use "is".'
  },
  {
    question: 'I ___ coffee every morning.',
    options: ['drink', 'drinks', 'am drinking'],
    answer: 'drink',
    explanation: 'This is a routine, so Present Simple is correct.'
  },
  {
    question: 'They ___ from Kazakhstan.',
    options: ['is', 'are', 'am'],
    answer: 'are',
    explanation: 'They is plural, so "are" is correct.'
  },
  {
    question: 'Yesterday I ___ to the cinema.',
    options: ['go', 'went', 'gone'],
    answer: 'went',
    explanation: 'Yesterday signals Past Simple.'
  },
  {
    question: 'There ___ two books.',
    options: ['is', 'are', 'was'],
    answer: 'are',
    explanation: 'Two books is plural.'
  },
  {
    question: 'We ___ dinner now.',
    options: ['have', 'are having', 'had'],
    answer: 'are having',
    explanation: '“Now” indicates Present Continuous.'
  },
  {
    question: 'I have lived here ___ 2020.',
    options: ['since', 'for', 'from'],
    answer: 'since',
    explanation: '“Since” is used with a starting point in time.'
  },
  {
    question: 'This task is ___ than that one.',
    options: ['difficult', 'more difficult', 'most difficult'],
    answer: 'more difficult',
    explanation: 'Comparison between two things requires comparative form.'
  },
  {
    question: 'You ___ wear a seatbelt.',
    options: ['must', 'can', 'might'],
    answer: 'must',
    explanation: 'This expresses obligation.'
  },
  {
    question: 'If I ___ time, I would travel.',
    options: ['have', 'had', 'will have'],
    answer: 'had',
    explanation: 'Second conditional uses Past Simple.'
  },
  {
    question: 'She ___ already finished.',
    options: ['has', 'have', 'had'],
    answer: 'has',
    explanation: 'Present Perfect with singular subject uses has.'
  },
  {
    question: 'The report ___ yesterday.',
    options: ['completed', 'was completed', 'completes'],
    answer: 'was completed',
    explanation: 'Passive voice is required.'
  },
  {
    question: 'He said he ___ tired.',
    options: ['is', 'was', 'has been'],
    answer: 'was',
    explanation: 'Reported speech backshifts tense.'
  },
  {
    question: 'By next year, I ___ here 5 years.',
    options: ['will work', 'will have worked', 'worked'],
    answer: 'will have worked',
    explanation: 'Future Perfect describes completed future duration.'
  },
  {
    question: 'Not only ___ late...',
    options: ['he was', 'was he', 'did he'],
    answer: 'was he',
    explanation: 'Negative inversion requires auxiliary before subject.'
  },
  {
    question: 'Rarely ___ such accuracy.',
    options: ['I see', 'do I see', 'see I'],
    answer: 'do I see',
    explanation: 'Rarely triggers inversion.'
  },
  {
    question: 'Had I known, I ___ differently.',
    options: ['would act', 'would have acted', 'acted'],
    answer: 'would have acted',
    explanation: 'Third conditional structure.'
  },
  {
    question: 'Scarcely ___ the lecture started...',
    options: ['had', 'has', 'did'],
    answer: 'had',
    explanation: 'Inversion with scarcely uses had.'
  }
];

export default function Page() {
  const [step, setStep] = useState('welcome');
  const [theme, setTheme] = useState<Theme>('light');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [review, setReview] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    avatar: '🧑‍🎓'
  });

  const [messages, setMessages] = useState([
    {
      role: 'Lumora',
      text: 'Welcome. Ask me about Present Simple and Present Continuous.'
    }
  ]);

useEffect(() => {
  const saved = localStorage.getItem('lumoraProfile');
  const completed = localStorage.getItem('lumoraCompleted');
  const savedTheme = localStorage.getItem('lumoraTheme');
  const savedLevel = localStorage.getItem('lumoraLevel');
  const savedScore = localStorage.getItem('lumoraScore');

  chatEndRef.current?.scrollIntoView({
    behavior: 'smooth'
  });

  if (savedTheme) {
    setTheme(savedTheme as Theme);
  }

  if (savedLevel) {
    setLevel(savedLevel);
  }

  if (savedScore) {
    setScore(Number(savedScore));
  }

  if (saved && completed === 'true') {
    setProfile(JSON.parse(saved));
    setStep('dashboard');
  } else {
    setStep('welcome');
  }
}, []);

const toggleTheme = () => {
  const next = theme === 'light' ? 'dark' : 'light';
  setTheme(next);
  localStorage.setItem('lumoraTheme', next);
};

  const handleAnswer = (option: string) => {
  const current = questions[index];

  setReview((prev) => [
    ...prev,
    {
      question: current.question,
      user: option,
      correct: current.answer,
      explanation: current.explanation
    }
  ]);

  let newScore = score;

  if (option === current.answer) {
    newScore++;
    setScore(newScore);
  }

  if (index < questions.length - 1) {
    setIndex(index + 1);
  } else {
    let lvl = '';

    if (newScore <= 3) lvl = 'Beginner';
    else if (newScore <= 6) lvl = 'Elementary';
    else if (newScore <= 9) lvl = 'Pre-Intermediate';
    else if (newScore <= 12) lvl = 'Intermediate';
    else if (newScore <= 15) lvl = 'Upper-Intermediate';
    else lvl = 'Advanced';

    setLevel(lvl);
    localStorage.setItem('lumoraLevel', lvl);
    localStorage.setItem('lumoraScore', String(newScore));
    setStep('result');
  }
};

  const saveProfile = () => {
    localStorage.setItem('lumoraProfile', JSON.stringify(profile));
    localStorage.setItem('lumoraCompleted', 'true');
    setStep('dashboard');
  };

  const sendMessage = () => {
  if (!input.trim()) return;

  const userMsg = input;
  const lower = userMsg.toLowerCase();

  setMessages((prev) => [...prev, { role: 'You', text: userMsg }]);
  setInput('');
  setIsTyping(true);

  setTimeout(() => {
    let reply = '';

    if (lower.includes('present simple')) {
      reply =
        'Present Simple is used for routines, habits, and general truths. Example: I study every day.';
    } else if (lower.includes('present continuous')) {
      reply =
        'Present Continuous describes actions happening right now. Example: I am studying now.';
    } else if (lower.includes('present perfect')) {
      reply =
        'Present Perfect connects past actions to the present. Example: I have finished my homework.';
    } else if (lower.includes('passive')) {
      reply =
        'Passive Voice focuses on the action, not the doer. Example: The report was completed yesterday.';
    } else if (lower.includes('conditional')) {
      reply =
        'Conditionals express possibilities and consequences. Example: If I had time, I would travel.';
    } else if (lower.includes('reported speech')) {
      reply =
        'Reported speech reports what someone said and often shifts tense backward.';
    } else if (lower.includes('modal')) {
      reply =
        'Modal verbs express ability, possibility, obligation, or advice: can, must, should.';
    } else if (lower.includes('article')) {
      reply =
        'Articles define nouns: a/an for general, the for specific reference.';
    } else if (lower.includes('difference')) {
      reply =
        'Grammar contrasts depend on context. Try specifying the two tenses you want to compare.';
    } else {
      reply =
        'Let’s stay within English Grammar in Use topics: tenses, passive voice, conditionals, modals, articles, and reported speech.';
    }

    setMessages((prev) => [...prev, { role: 'Lumora', text: reply }]);
    setIsTyping(false);
  }, 1200);
};

  const bg =
    theme === 'light'
      ? 'bg-[#F7F6F3] text-[#1F2937]'
      : 'bg-[#151515] text-white';

  const card = theme === 'light' ? 'bg-white' : 'bg-[#222222]';

  const progress = ((index + 1) / questions.length) * 100;

  const getStudyPath = () => {
  switch (level) {
    case 'Beginner':
      return [
        'Review Murphy Units 1–8',
        'Learn verb "to be" and pronouns',
        'Practice basic Present Simple'
      ];

    case 'Elementary':
      return [
        'Review Murphy Units 9–18',
        'Master Present Simple vs Continuous',
        'Build sentence structure accuracy'
      ];

    case 'Pre-Intermediate':
      return [
        'Review Murphy Units 19–32',
        'Practice question forms',
        'Strengthen tense recognition'
      ];

    case 'Intermediate':
      return [
        'Review Murphy Units 33–52',
        'Focus on contextual grammar usage',
        'Practice tense contrasts'
      ];

    case 'Upper-Intermediate':
      return [
        'Review Murphy Units 53–90',
        'Master passive structures',
        'Practice reported speech'
      ];

    case 'Advanced':
      return [
        'Review Murphy Units 91–145',
        'Practice inversion',
        'Refine stylistic precision'
      ];

    default:
      return [
        'Continue structured practice',
        'Reinforce weak grammar zones',
        'Build fluency through examples'
      ];
  }
};

  if (step === 'welcome') {
  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center transition-all duration-700`}>
      <div className={`${card} p-14 rounded-2xl w-[850px] shadow-xl text-center animate-fadeIn`}>

        <img
          src="/jts_logo_h.png"
          alt="JTS"
          className="w-28 h-auto mx-auto"
        />

        <h1 className="text-6xl font-black text-[#8FA58E] mt-8">
          Lumora
        </h1>

        <p className="text-2xl mt-4 font-semibold opacity-80">
          Adaptive English AI Tutor
        </p>

        <p className="mt-8 text-lg opacity-70 max-w-xl mx-auto">
          Personalized grammar assessment and book-grounded AI tutoring
          based on English Grammar in Use.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <div className="px-4 py-3 rounded-2xl bg-[#DCE7DD] font-bold">
            📚 Book-Grounded
          </div>

          <div className="px-4 py-3 rounded-2xl bg-[#EAE6F8] font-bold">
            🧠 Adaptive
          </div>

          <div className="px-4 py-3 rounded-2xl bg-[#F5E8E8] font-bold">
            ⚡ Personalized
          </div>
        </div>

        <button
          onClick={() => setStep('test')}
          className="mt-12 px-12 py-5 bg-[#8FA58E] text-white rounded-2xl text-xl font-bold hover:scale-105 transition-all"
        >
          Start Smart Assessment
        </button>
      </div>
    </div>
  );
}

  if (step === 'test') {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center transition-all duration-700`}>
        <div className={`${card} p-10 rounded-3xl w-[800px] shadow-xl`}>
          <h1 className="text-5xl font-black text-[#8FA58E]">
            Lumora Assessment
          </h1>

          <div className="w-full bg-gray-200 rounded-full h-4 mt-8">
            <div
              className="bg-[#8FA58E] h-4 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-8 text-2xl font-bold">
            {questions[index].question}
          </p>

          <div className="grid gap-4 mt-8">
            {questions[index].options.map((o) => (
              <button
                key={o}
                onClick={() => handleAnswer(o)}
                className="p-5 rounded-2xl border font-bold hover:scale-105 transition-all"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

if (step === 'result') {
  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center`}>
      <div className={`${card} p-12 rounded-3xl w-[900px] text-center`}>

        <div className="text-5xl animate-bounce">🎉</div>

        <h1 className="text-5xl font-black text-[#8FA58E] mt-6">
          Congratulations
        </h1>

        <p className="text-3xl font-bold mt-6">
          You are {level}
        </p>

        <p className="mt-4 text-xl">
          Score: {score}/18
        </p>

        <div className="mt-8 p-5 rounded-2xl bg-[#DCE7DD] text-left">
          <h3 className="font-bold text-xl">
            Recommended Study Path
          </h3>

          <ul className="mt-3 space-y-2">
            {getStudyPath().map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-left">
          <h2 className="text-2xl font-bold mb-6">
            Assessment Review
          </h2>

          <div className="space-y-4 max-h-[320px] overflow-y-auto">
            {review.map((r, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#F7F6F3]"
              >
                <p className="font-bold">{r.question}</p>

                <p className="text-red-500 mt-2">
                  Your answer: {r.user}
                </p>

                <p className="text-green-600">
                  Correct: {r.correct}
                </p>

                <p className="text-sm mt-2 opacity-70">
                  {r.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep('profile')}
          className="mt-8 px-8 py-4 bg-[#8FA58E] text-white rounded-2xl font-bold"
        >
          Complete Profile
        </button>

      </div>
    </div>
  );
}

  if (step === 'profile') {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className={`${card} p-10 rounded-3xl w-[650px]`}>
          <h1 className="text-4xl font-black text-[#8FA58E]">
            Complete Profile
          </h1>

          <div className="flex gap-4 mt-8 flex-wrap">
            {avatars.map((a) => (
              <button
                key={a}
                onClick={() => setProfile({ ...profile, avatar: a })}
                className="text-4xl hover:scale-125 transition-all"
              >
                {a}
              </button>
            ))}
          </div>

          <input
            placeholder="Name"
            className="w-full p-4 mt-6 rounded-2xl border"
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="w-full p-4 mt-4 rounded-2xl border"
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            className="w-full p-4 mt-4 rounded-2xl border"
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />

          <button
            onClick={() => {
              if (localStorage.getItem('lumoraCompleted')) {
                setStep('dashboard');
              } else {
                setStep('result');
              }
            }}
            className="w-full mt-4 p-4 rounded-2xl border font-bold hover:scale-105 transition-all"
          >
            Back
          </button>

          <button
            onClick={saveProfile}
            className="w-full mt-8 p-4 bg-[#8FA58E] text-white rounded-2xl font-bold"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className={`h-screen overflow-hidden ${bg} flex transition-all duration-700`}>
      <aside className={`${card} w-80 p-8 h-screen overflow-y-auto animate-fadeIn`}>
        <div className="flex items-center gap-4">
          <img
            src="/jts_logo_h.png"
            alt="JTS"
            className="w-16 h-auto"
          />

          <div className="text-5xl">{profile.avatar}</div>
        </div>

        <h1 className="text-5xl font-black text-[#8FA58E] mt-6">
          Lumora
        </h1>

        <p className="text-sm opacity-70 font-semibold">
          by Just To Study
        </p>

        <p className="mt-6 font-bold">{profile.name}</p>
        <p>{level}</p>
        <div className="mt-8 p-5 rounded-2xl bg-[#DCE7DD]/40">
          <h3 className="font-bold text-lg mb-4">
            Progress
          </h3>

          <div className="space-y-3">
            <p>Accuracy: {Math.round((score / 18) * 100)}%</p>
            <p>Completed Lessons: 8</p>
            <p>Study Streak: 4 days</p>
            <p>Current Level: {level}</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="mt-8 px-5 py-3 rounded-2xl bg-[#DCE7DD] text-black font-bold"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <button
          onClick={() => {
            localStorage.clear();

            setProfile({
              name: '',
              email: '',
              phone: '',
              gender: '',
              avatar: '🧑‍🎓'
            });

            setScore(0);
            setIndex(0);
            setLevel('');
            setReview([]);

            setMessages([
              {
                role: 'Lumora',
                text: 'Welcome. Ask me about Present Simple and Present Continuous.'
              }
            ]);

            setStep('welcome');
          }}

          className="mt-4 px-5 py-3 rounded-2xl bg-[#F5E8E8] text-black font-bold hover:scale-105 transition-all"
          >
            Reset Session
        </button>

        <button
          onClick={() => setStep('profile')}
          className="mt-4 px-5 py-3 rounded-2xl bg-[#DCE7DD] text-black font-bold hover:scale-105 transition-all"
        >
          Edit Profile
        </button>

        <div className="mt-10 p-5 rounded-2xl bg-[#DCE7DD]/40">
          <p className="font-bold">Learning Source</p>
          <p>English Grammar in Use</p>
          <p className="text-sm opacity-70">Raymond Murphy</p>
        </div>
      </aside>

      <main className="flex-1 p-10 flex flex-col h-screen overflow-hidden animate-fadeIn">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            'Present Tenses',
            'Passive Voice',
            'Conditionals',
            'Reported Speech'
          ].map((lesson) => (
            <button
              key={lesson}
              className="p-5 rounded-2xl bg-[#DCE7DD] font-bold hover:scale-105 transition-all"
              onClick={() => {
                const lessons: Record<string, string> = {
                  'Present Tenses':
                    'Present Simple is used for routines and facts. Present Continuous is used for actions happening now. Example: I study every day / I am studying now.',

                  'Passive Voice':
                    'Passive voice focuses on the action rather than the doer. Example: The report was completed yesterday.',

                  'Conditionals':
                    'Conditionals express possible situations and consequences. Example: If I study, I will pass. If I had more time, I would travel.',

                  'Reported Speech':
                    'Reported speech reports what someone said. Example: He said he was tired.'
                };

                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'You',
                    text: `Teach me ${lesson}`
                  }
                ]);

                setIsTyping(true);

                setTimeout(() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'Lumora',
                      text: lessons[lesson]
                    }
                  ]);

                  setIsTyping(false);
                }, 1000);
              }}
            >
              📘 {lesson}
            </button>
          ))}
        </div>

        <div className={`${card} rounded-3xl p-8 flex-1 overflow-y-auto max-h-[75vh]`}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-6 flex ${
                m.role === 'You' ? 'justify-end' : 'justify-start'
              }`}
  >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  m.role === 'You'
                  ? 'bg-[#8FA58E] text-white'
                  : 'bg-[#F3F4F6] text-black'
                }`}
    >
            <strong>{m.role}:</strong> {m.text}
            </div>
          </div>
          ))}

          <div ref={chatEndRef}></div>

          {isTyping && (
            <div className="animate-bounce">
              <div className="flex gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex gap-3 mt-4 flex-wrap">
            {[
              'Explain simpler',
              'Give examples',
              'Test me',
              'Compare tenses'
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 rounded-2xl bg-[#F3F4F6] text-sm font-semibold hover:scale-105 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-5 rounded-2xl border"
            placeholder="Ask about grammar..."
          />

          <button
            onClick={sendMessage}
            className="bg-[#8FA58E] text-white px-8 rounded-2xl font-bold"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}