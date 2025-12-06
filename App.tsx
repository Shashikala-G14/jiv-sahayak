import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  User, 
  Mic, 
  Home, 
  BookOpen, 
  Settings, 
  Play, 
  CheckCircle,
  WifiOff,
  Send,
  ArrowLeft,
  Award,
  ChevronRight,
  Smartphone,
  Apple
} from 'lucide-react';
import { Language, Persona, UserProfile, Module, ChatMessage } from './types';
import { TRANSLATIONS, MOCK_MODULES, PERSONA_CONFIG, LANDING_IMAGE } from './constants';
import { generateAssistantResponse } from './services/geminiService';
import AudioPlayerHelper from './components/AudioPlayerHelper';

// --- Helper to map string icon names to Lucide components if needed for dynamic modules ---
const IconMap: Record<string, React.ElementType> = {
  'Smartphone': Smartphone,
  'Apple': Apple,
  'Default': BookOpen
};

// --- Components ---

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex flex-col h-screen bg-black relative">
      <img 
        src={LANDING_IMAGE} 
        alt="Community Learning" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-16 p-6 text-center text-white">
        <div className="mb-8">
           <h1 className="text-5xl font-bold mb-2 tracking-tight">JivSahayak</h1>
           <p className="text-lg opacity-90 max-w-xs mx-auto">
             Solving real problems for families, education, and women empowerment.
           </p>
        </div>
        
        <button 
          onClick={onStart}
          className="w-full max-w-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <ChevronRight />
        </button>
        
        <div className="mt-8 text-sm opacity-70">
          Available in Hindi, Marathi & English
        </div>
      </div>
    </div>
  );
};

const Onboarding = ({ 
  onComplete 
}: { 
  onComplete: (p: UserProfile) => void 
}) => {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [persona, setPersona] = useState<Persona>(Persona.WOMAN);

  const languages = [
    { code: Language.ENGLISH, label: 'English', native: 'English' },
    { code: Language.HINDI, label: 'Hindi', native: 'हिन्दी' },
    { code: Language.MARATHI, label: 'Marathi', native: 'मराठी' },
  ];

  const personas = [
    { code: Persona.CHILD, label: 'Child', icon: '👶' },
    { code: Persona.WOMAN, label: 'Woman', icon: '👩' },
    { code: Persona.MAN, label: 'Man', icon: '👨' },
    { code: Persona.ELDER, label: 'Elder', icon: '👴' },
  ];

  if (step === 1) {
    return (
      <div className="flex flex-col h-screen bg-orange-50 items-center justify-center p-6 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-orange-900">Namaste! 🙏</h1>
          <p className="text-gray-600">Choose your language</p>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setStep(2);
              }}
              className="w-full bg-white border-2 border-orange-100 hover:border-orange-500 rounded-xl p-6 shadow-sm flex items-center justify-between transition-all transform hover:scale-102"
            >
              <span className="text-xl font-bold text-gray-800">{l.native}</span>
              <span className="text-gray-400">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-orange-50 items-center justify-center p-6 space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-orange-900 text-center">
        {TRANSLATIONS[lang].whoAreYou}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {personas.map((p) => (
          <button
            key={p.code}
            onClick={() => {
              setPersona(p.code);
              onComplete({ name: 'User', language: lang, persona: p.code });
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm bg-white border-2 hover:border-orange-500 transition-all`}
          >
            <span className="text-5xl mb-3">{p.icon}</span>
            <span className="font-semibold text-gray-700">
              {p.code === Persona.WOMAN && TRANSLATIONS[lang].imWoman}
              {p.code === Persona.CHILD && TRANSLATIONS[lang].imChild}
              {p.code === Persona.MAN && TRANSLATIONS[lang].imMan}
              {p.code === Persona.ELDER && TRANSLATIONS[lang].imElder}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const VoiceAssistant = ({ 
  user, 
  onBack 
}: { 
  user: UserProfile; 
  onBack: () => void 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [inputStr, setInputStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = user.language === Language.ENGLISH ? "Namaste! I am here to help. Ask me anything." 
        : user.language === Language.HINDI ? "नमस्ते! मैं मदद के लिए यहाँ हूँ। कुछ भी पूछें।"
        : "नमस्कार! मी मदतीसाठी येथे आहे. काहीही विचारा.";
      setMessages([{ id: 'init', role: 'model', text: greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInputStr('');
    setIsLoading(true);

    const response = await generateAssistantResponse(text, user.language, user.persona);
    
    setIsLoading(false);
    const aiMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response.text,
      audioData: response.audioBase64
    };
    
    setMessages(prev => [...prev, aiMsg]);
    if (response.audioBase64) {
      setCurrentAudio(response.audioBase64);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser. Please type.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = user.language === Language.ENGLISH ? 'en-IN' 
      : user.language === Language.HINDI ? 'hi-IN' 
      : 'mr-IN';
    
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputStr(transcript);
      handleSend(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className={`p-4 ${PERSONA_CONFIG[user.persona].color} shadow-sm flex items-center gap-3`}>
        <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10">
          <ArrowLeft size={24} className={PERSONA_CONFIG[user.persona].text} />
        </button>
        <div className="flex flex-col">
          <h2 className={`text-xl font-bold ${PERSONA_CONFIG[user.persona].text}`}>JivSahayak</h2>
          <span className="text-xs opacity-75 text-black">Gemini Powered</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-orange-500 text-white rounded-br-none' 
                : 'bg-white shadow-sm border border-gray-100 rounded-bl-none text-gray-800'
            }`}>
              <p className="text-lg leading-relaxed">{msg.text}</p>
              {msg.role === 'model' && msg.audioData && (
                 <button 
                  onClick={() => setCurrentAudio(msg.audioData)}
                  className="mt-2 text-orange-600 flex items-center gap-2 text-sm font-semibold bg-orange-50 px-3 py-1 rounded-full"
                 >
                   <Play size={16} fill="currentColor" /> Listen Again
                 </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center gap-3">
        <button 
          onClick={toggleListening}
          className={`p-4 rounded-full transition-colors ${
            isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'
          }`}
        >
          <Mic size={28} />
        </button>
        
        {/* INPUT VISIBILITY FIX: Forced bg-gray-100 and text-gray-900 to ensure high contrast */}
        <input 
          type="text" 
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputStr)}
          placeholder={TRANSLATIONS[user.language].askSahayak}
          className="flex-1 bg-gray-100 rounded-full px-6 py-3 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          style={{ color: '#111827' }} 
        />
        
        <button 
          onClick={() => handleSend(inputStr)}
          disabled={!inputStr.trim() || isLoading}
          className="p-3 bg-orange-600 text-white rounded-full disabled:opacity-50 hover:bg-orange-700"
        >
          <Send size={24} />
        </button>
      </div>

      <AudioPlayerHelper audioBase64={currentAudio} onEnded={() => setCurrentAudio(undefined)} />
    </div>
  );
};

const QuizComponent = ({ 
  module, 
  user, 
  onComplete 
}: { 
  module: Module, 
  user: UserProfile, 
  onComplete: () => void 
}) => {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  
  if (!module.quizData) return null;

  const currentQ = module.quizData[qIndex];
  const isLast = qIndex === module.quizData.length - 1;

  const handleSubmit = () => {
    if (selected === null) return;
    if (selected === currentQ.correctIndex) {
      setFeedback('correct');
      // Auto advance
      setTimeout(() => {
        if (isLast) {
          onComplete();
        } else {
          setQIndex(prev => prev + 1);
          setSelected(null);
          setFeedback('none');
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="p-6">
       <div className="mb-6">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">{TRANSLATIONS[user.language].quizTime}</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">{module.title[user.language]}</h2>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
             <div 
               className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
               style={{ width: `${((qIndex) / module.quizData.length) * 100}%` }}
             />
          </div>
       </div>

       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
         <h3 className="text-xl font-medium text-gray-800 mb-6">
            {currentQ.question[user.language]}
         </h3>

         <div className="space-y-3">
           {currentQ.options[user.language].map((opt, idx) => (
             <button
                key={idx}
                onClick={() => {
                  setSelected(idx);
                  setFeedback('none');
                }}
                disabled={feedback === 'correct'}
                className={`w-full p-4 rounded-xl text-left font-medium border-2 transition-all ${
                  selected === idx 
                    ? 'border-orange-500 bg-orange-50 text-orange-900' 
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
             >
               {opt}
             </button>
           ))}
         </div>
       </div>

       {feedback !== 'none' && (
         <div className={`p-4 rounded-xl mb-6 text-center font-bold text-lg animate-bounce ${
           feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
         }`}>
           {feedback === 'correct' ? TRANSLATIONS[user.language].correct : TRANSLATIONS[user.language].incorrect}
         </div>
       )}

       <button
         onClick={handleSubmit}
         disabled={selected === null}
         className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
           selected !== null ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-300'
         }`}
       >
         {feedback === 'correct' ? (isLast ? TRANSLATIONS[user.language].finish : TRANSLATIONS[user.language].next) : TRANSLATIONS[user.language].submit}
       </button>
    </div>
  );
};

const ModuleViewer = ({ module, user, onBack, onMarkComplete }: { module: Module, user: UserProfile, onBack: () => void, onMarkComplete: (id: string) => void }) => {
    
    if (module.type === 'quiz') {
      return (
        <div className="flex flex-col h-screen bg-gray-50">
           <div className="bg-white p-4 shadow-sm flex items-center gap-3">
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <h2 className="font-bold text-lg text-gray-800 truncate">{module.title[user.language]}</h2>
           </div>
           <div className="flex-1 overflow-y-auto">
              <QuizComponent 
                module={module} 
                user={user} 
                onComplete={() => {
                  onMarkComplete(module.id);
                  onBack();
                }} 
              />
           </div>
        </div>
      );
    }

    return (
        <div className="flex flex-col h-screen bg-white">
             <div className="relative h-64 bg-gray-900">
                 {/* Simulated Video Player */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                        <Play size={40} className="text-white ml-2" fill="white" />
                    </div>
                 </div>
                 <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
                     <ArrowLeft />
                 </button>
                 <div className="absolute bottom-4 left-4 text-white">
                     <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                         {module.category}
                     </span>
                 </div>
             </div>

             <div className="p-6 flex-1 overflow-y-auto">
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{module.title[user.language]}</h1>
                 <p className="text-xl text-gray-600 mb-6">{module.description[user.language]}</p>
                 
                 {module.content && (
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8">
                        <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                           <BookOpen size={20} />
                           Lesson Content
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-800">
                            {module.content[user.language]}
                        </p>
                    </div>
                 )}

                 <button 
                   onClick={() => {
                     onMarkComplete(module.id);
                     onBack();
                   }}
                   className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl text-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                 >
                     <CheckCircle />
                     {TRANSLATIONS[user.language].completed}
                 </button>
             </div>
        </div>
    )
}

function App() {
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard' | 'assistant' | 'module'>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES);

  // Progress Stats
  const completedCount = modules.filter(m => m.isCompleted).length;
  const totalCount = modules.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleMarkComplete = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, isCompleted: true } : m));
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('onboarding')} />;
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={(u) => {
      setUser(u);
      setView('dashboard');
    }} />;
  }

  // Safety check for user
  if (!user) return null;

  const translations = TRANSLATIONS[user.language];
  const theme = PERSONA_CONFIG[user.persona];

  if (view === 'assistant') {
    return <VoiceAssistant user={user} onBack={() => setView('dashboard')} />;
  }

  if (view === 'module' && selectedModule) {
      return (
        <ModuleViewer 
          module={selectedModule} 
          user={user} 
          onBack={() => setView('dashboard')} 
          onMarkComplete={handleMarkComplete}
        />
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className={`px-6 py-6 ${theme.color} rounded-b-[3rem] shadow-sm relative transition-colors duration-500`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${theme.text}`}>
               {user.name === 'User' ? translations.welcome : `Namaste, ${user.name}`}
            </h1>
            <p className="text-gray-600 text-sm opacity-80 mt-1">
               {isOffline ? <span className="flex items-center gap-1 text-red-600 font-bold"><WifiOff size={14}/> {translations.offline}</span> : 'Online'}
            </p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl border-2 border-white/50">
             {user.persona === Persona.CHILD ? '👶' : 
              user.persona === Persona.WOMAN ? '👩' : 
              user.persona === Persona.ELDER ? '👴' : '👨'}
          </div>
        </div>

        {/* Progress Bar in Header */}
        <div className="bg-white/60 p-4 rounded-2xl mb-6 backdrop-blur-sm">
           <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>{translations.myProgress}</span>
              <span>{progressPercent}%</span>
           </div>
           <div className="h-3 bg-white rounded-full overflow-hidden">
              <div 
                className={`h-full ${theme.accent} transition-all duration-1000 ease-out`} 
                style={{ width: `${progressPercent}%` }} 
              />
           </div>
        </div>

        {/* Big AI Assistant Button (FAB style in Header) */}
        <button 
          onClick={() => setView('assistant')}
          className="absolute -bottom-8 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-transform active:scale-95 flex items-center gap-2 pr-6 z-10"
        >
          <Mic size={24} />
          <span className="font-bold text-lg">{translations.askSahayak}</span>
        </button>
      </header>

      {/* Main Content - Grid of Modules */}
      <main className="flex-1 px-6 pt-12 pb-24 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{translations.dashboard}</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {modules.map((module) => {
             // Resolve Icon
             // We use a safe resolver pattern to avoid rendering errors if IconMap doesn't have the key
             let ModuleIcon: React.ElementType = BookOpen; // Default
             
             if (typeof module.icon === 'string') {
                if (IconMap[module.icon]) {
                    ModuleIcon = IconMap[module.icon];
                } else if (module.icon.length <= 2) {
                     // It's likely an emoji
                     ModuleIcon = (() => <span className="text-2xl">{module.icon}</span>) as unknown as React.ElementType;
                }
             }

             return (
             <button
               key={module.id}
               onClick={() => {
                   setSelectedModule(module);
                   setView('module');
               }}
               className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-left transition-all hover:shadow-md active:scale-[0.98] relative overflow-hidden"
             >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${module.isCompleted ? 'bg-green-100' : 'bg-gray-50'}`}>
                    {module.isCompleted ? <CheckCircle size={32} className="text-green-600" /> : <ModuleIcon size={28} className="text-gray-700" />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        module.type === 'quiz' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {module.type === 'quiz' ? 'Quiz' : 'Lesson'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                        {module.title[user.language]}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-snug">
                        {module.description[user.language]}
                    </p>
                </div>
             </button>
          )}}
        </div>

        {/* Extra Card for Mindset Stories */}
        <div className="mt-6">
             <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden transform hover:scale-[1.02] transition-transform">
                <div className="relative z-10">
                    <h3 className="font-bold text-xl mb-1">{translations.mindset}</h3>
                    <p className="opacity-90 text-sm">Listen to stories that inspire.</p>
                </div>
                <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 text-white" />
             </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-white border-t py-3 px-6 fixed bottom-0 w-full flex justify-between items-center text-gray-400 z-50">
          <button className="flex flex-col items-center gap-1 text-orange-600">
              <Home size={24} />
              <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-orange-600">
              <BookOpen size={24} />
              <span className="text-xs font-medium">Learn</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-orange-600">
              <Award size={24} />
              <span className="text-xs font-medium">Rewards</span>
          </button>
      </nav>
    </div>
  );
}

export default App;