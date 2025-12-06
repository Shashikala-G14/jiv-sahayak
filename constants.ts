import { Language, Module, Persona } from './types';
import { 
  Heart, 
  Briefcase, 
  Smile, 
  Users
} from 'lucide-react';

// Using an image depicting Indian women/community empowerment/education
export const LANDING_IMAGE = "https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=1000&auto=format&fit=crop";

export const TRANSLATIONS = {
  [Language.ENGLISH]: {
    getStarted: "Get Started",
    appTagline: "Empowering Lives, One Step at a Time",
    welcome: "Welcome to JivSahayak",
    selectLang: "Select Language",
    whoAreYou: "Who are you?",
    imChild: "I am a Child",
    imWoman: "I am a Woman",
    imMan: "I am a Man",
    imElder: "I am an Elder",
    dashboard: "My Path",
    askSahayak: "Ask Sahayak",
    listening: "Listening...",
    speakNow: "Tap to Speak",
    offline: "Offline Mode",
    myProgress: "Your Progress",
    start: "Start Learning",
    completed: "Completed",
    mindset: "Mindset Stories",
    emergency: "Emergency Help",
    quizTime: "Quiz Time",
    submit: "Submit",
    correct: "Correct! 🎉",
    incorrect: "Try Again",
    next: "Next",
    finish: "Finish",
  },
  [Language.HINDI]: {
    getStarted: "शुरू करें",
    appTagline: "जीवन को सशक्त बनाना, एक कदम",
    welcome: "जीवसहायक में आपका स्वागत है",
    selectLang: "भाषा चुनें",
    whoAreYou: "आप कौन हैं?",
    imChild: "मैं बच्चा हूँ",
    imWoman: "मैं एक महिला हूँ",
    imMan: "मैं एक पुरुष हूँ",
    imElder: "मैं बुजुर्ग हूँ",
    dashboard: "मेरा रास्ता",
    askSahayak: "सहायक से पूछें",
    listening: "सुन रहा हूँ...",
    speakNow: "बोलने के लिए टैप करें",
    offline: "ऑफलाइन मोड",
    myProgress: "आपकी प्रगति",
    start: "सीखना शुरू करें",
    completed: "पूर्ण",
    mindset: "प्रेरक कहानियाँ",
    emergency: "आपातकालीन मदद",
    quizTime: "प्रश्नोत्तरी समय",
    submit: "जमा करें",
    correct: "सही! 🎉",
    incorrect: "पुनः प्रयास करें",
    next: "अगला",
    finish: "समाप्त",
  },
  [Language.MARATHI]: {
    getStarted: "सुरू करा",
    appTagline: "आयुष्य सक्षम करणे, एकेक पाऊल",
    welcome: "जीवसहायक मध्ये आपले स्वागत आहे",
    selectLang: "भाषा निवडा",
    whoAreYou: "तुम्ही कोण आहात?",
    imChild: "मी मूल आहे",
    imWoman: "मी एक महिला आहे",
    imMan: "मी एक पुरुष आहे",
    imElder: "मी ज्येष्ठ आहे",
    dashboard: "माझा मार्ग",
    askSahayak: "सहायकला विचारा",
    listening: "ऐकत आहे...",
    speakNow: "बोलण्यासाठी टॅप करा",
    offline: "ऑफलाइन मोड",
    myProgress: "तुमची प्रगती",
    start: "शिकणे सुरू करा",
    completed: "पूर्ण",
    mindset: "प्रेरक कथा",
    emergency: "आपत्कालीन मदत",
    quizTime: "प्रश्नोमंजुषा वेळ",
    submit: "सबमिट करा",
    correct: "बरोबर! 🎉",
    incorrect: "पुन्हा प्रयत्न करा",
    next: "पुढील",
    finish: "समाप्त",
  }
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    category: 'health',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "Basic Hygiene",
      [Language.HINDI]: "बुनियादी स्वच्छता",
      [Language.MARATHI]: "मूलभूत स्वच्छता"
    },
    description: {
      [Language.ENGLISH]: "Keep yourself and family safe from diseases.",
      [Language.HINDI]: "स्वयं और परिवार को बीमारियों से सुरक्षित रखें।",
      [Language.MARATHI]: "स्वतःला आणि कुटुंबाला आजारांपासून सुरक्षित ठेवा."
    },
    icon: '🧼',
    content: {
      [Language.ENGLISH]: "Wash hands with soap for 20 seconds. Keep water covered. Clean your surroundings daily to prevent mosquitoes.",
      [Language.HINDI]: "20 सेकंड तक साबुन से हाथ धोएं। पानी को ढक कर रखें। मच्छरों से बचने के लिए अपने आसपास की सफाई रोज करें।",
      [Language.MARATHI]: "20 सेकंद साबणाने हात धुवा. पाणी झाकून ठेवा. डास होऊ नयेत म्हणून दररोज परिसर स्वच्छ ठेवा."
    },
    isCompleted: true,
  },
  {
    id: 'm2',
    category: 'finance',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "Saving Money",
      [Language.HINDI]: "पैसे की बचत",
      [Language.MARATHI]: "पैसे वाचवणे"
    },
    description: {
      [Language.ENGLISH]: "How to open a Jan Dhan bank account.",
      [Language.HINDI]: "जन धन बैंक खाता कैसे खोलें।",
      [Language.MARATHI]: "जन धन बँक खाते कसे उघडावे."
    },
    icon: '💰',
    content: {
      [Language.ENGLISH]: "Go to the nearest bank with your Aadhaar card. It is free. This account gives you insurance and direct benefit transfers.",
      [Language.HINDI]: "अपने आधार कार्ड के साथ निकटतम बैंक जाएं। यह मुफ़्त है। यह खाता आपको बीमा और प्रत्यक्ष लाभ हस्तांतरण देता है।",
      [Language.MARATHI]: "तुमच्या आधार कार्डसह जवळच्या बँकेत जा. हे मोफत आहे. हे खाते तुम्हाला विमा आणि थेट लाभ हस्तांतरण देते."
    },
    isCompleted: false,
  },
  {
    id: 'm3',
    category: 'skills',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "Tailoring Basics",
      [Language.HINDI]: "सिलाई की मूल बातें",
      [Language.MARATHI]: "शिवणकामाची मूलतत्त्वे"
    },
    description: {
      [Language.ENGLISH]: "Earn money from home by stitching.",
      [Language.HINDI]: "सिलाई करके घर से पैसे कमाएं।",
      [Language.MARATHI]: "शिवणकाम करून घरबसल्या पैसे कमवा."
    },
    icon: '🧵',
    content: {
      [Language.ENGLISH]: "Learn to thread a needle and do a running stitch. Keep your needle and thread box away from children.",
      [Language.HINDI]: "सुई में धागा डालना और कच्चा टांका लगाना सीखें। अपनी सुई और धागे के डिब्बे को बच्चों से दूर रखें।",
      [Language.MARATHI]: "सुईमध्ये धागा ओवणे आणि धावदोरा घालणे शिका. तुमची सुई आणि दोऱ्याचा डबा मुलांपासून दूर ठेवा."
    },
    isCompleted: false,
  },
  {
    id: 'm4',
    category: 'legal',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "Women's Rights",
      [Language.HINDI]: "महिलाओं के अधिकार",
      [Language.MARATHI]: "महिलांचे अधिकार"
    },
    description: {
      [Language.ENGLISH]: "Know your legal protections against violence.",
      [Language.HINDI]: "हिंसा के खिलाफ अपनी कानूनी सुरक्षा को जानें।",
      [Language.MARATHI]: "हिंसेविरुद्ध तुमचे कायदेशीर संरक्षण जाणून घ्या."
    },
    icon: '⚖️',
    content: {
      [Language.ENGLISH]: "Domestic violence is a crime. You have the right to live with dignity. Dial 1091 for women's helpline.",
      [Language.HINDI]: "घरेलू हिंसा एक अपराध है। आपको सम्मान के साथ जीने का अधिकार है। महिला हेल्पलाइन के लिए 1091 डायल करें।",
      [Language.MARATHI]: "घरगुती हिंसाचार हा गुन्हा आहे. तुम्हाला सन्मानाने जगण्याचा अधिकार आहे. महिला हेल्पलाइनसाठी १०९१ डायल करा."
    },
    isCompleted: false,
  },
  {
    id: 'm5',
    category: 'skills',
    type: 'quiz',
    title: {
      [Language.ENGLISH]: "Shop Math Check",
      [Language.HINDI]: "दुकान का हिसाब",
      [Language.MARATHI]: "दुकानाचा हिशोब"
    },
    description: {
      [Language.ENGLISH]: "Test your calculation skills for market.",
      [Language.HINDI]: "बाजार के लिए अपने हिसाब की जांच करें।",
      [Language.MARATHI]: "बाजारासाठी तुमचे हिशोब तपासा."
    },
    icon: '🧮',
    isCompleted: false,
    quizData: [
      {
        question: {
          [Language.ENGLISH]: "If you buy vegetables for ₹20 and give ₹50, how much money should you get back?",
          [Language.HINDI]: "यदि आप ₹20 की सब्जियां खरीदते हैं और ₹50 देते हैं, तो आपको कितने पैसे वापस मिलने चाहिए?",
          [Language.MARATHI]: "जर तुम्ही ₹२० च्या भाज्या घेतल्या आणि ₹५० दिले, तर तुम्हाला किती पैसे परत मिळाले पाहिजेत?"
        },
        options: {
          [Language.ENGLISH]: ["₹20", "₹30", "₹10"],
          [Language.HINDI]: ["₹20", "₹30", "₹10"],
          [Language.MARATHI]: ["₹२०", "₹३०", "₹१०"],
        },
        correctIndex: 1
      },
      {
        question: {
          [Language.ENGLISH]: "What is 10 + 15?",
          [Language.HINDI]: "10 + 15 कितना होता है?",
          [Language.MARATHI]: "१० + १५ किती होतात?"
        },
        options: {
          [Language.ENGLISH]: ["25", "20", "35"],
          [Language.HINDI]: ["25", "20", "35"],
          [Language.MARATHI]: ["२५", "२०", "३५"],
        },
        correctIndex: 0
      }
    ]
  },
  {
    id: 'm6',
    category: 'legal',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "PM Awas Yojana",
      [Language.HINDI]: "पीएम आवास योजना",
      [Language.MARATHI]: "पीएम आवास योजना"
    },
    description: {
      [Language.ENGLISH]: "Scheme for building your own house.",
      [Language.HINDI]: "अपना घर बनाने की योजना।",
      [Language.MARATHI]: "स्वतःचे घर बांधण्यासाठी योजना."
    },
    icon: '🏠',
    content: {
      [Language.ENGLISH]: "The government gives money to build pucca houses. The woman of the house must be a co-owner. Apply at your Gram Panchayat.",
      [Language.HINDI]: "सरकार पक्का घर बनाने के लिए पैसा देती है। घर की महिला का सह-मालिक होना अनिवार्य है। अपनी ग्राम पंचायत में आवेदन करें।",
      [Language.MARATHI]: "पक्के घर बांधण्यासाठी सरकार पैसे देते. घरातील महिलेने सह-मालक असणे आवश्यक आहे. तुमच्या ग्रामपंचायतीमध्ये अर्ज करा."
    },
    isCompleted: false,
  },
  {
    id: 'm7',
    category: 'skills',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "UPI Payments",
      [Language.HINDI]: "यूपीआई भुगतान",
      [Language.MARATHI]: "UPI देयके"
    },
    description: {
      [Language.ENGLISH]: "How to send money safely using phone.",
      [Language.HINDI]: "फोन का उपयोग करके सुरक्षित रूप से पैसे कैसे भेजें।",
      [Language.MARATHI]: "फोन वापरून सुरक्षितपणे पैसे कसे पाठवायचे."
    },
    icon: 'Smartphone',
    content: {
      [Language.ENGLISH]: "Do not share your UPI PIN with anyone. Always check the name before sending money. Use a screen lock on your phone.",
      [Language.HINDI]: "अपना यूपीआई पिन किसी के साथ साझा न करें। पैसे भेजने से पहले हमेशा नाम की जांच करें। अपने फोन पर स्क्रीन लॉक का प्रयोग करें।",
      [Language.MARATHI]: "तुमचा UPI पिन कोणाशीही शेअर करू नका. पैसे पाठवण्यापूर्वी नेहमी नाव तपासा. तुमच्या फोनवर स्क्रीन लॉक वापरा."
    },
    isCompleted: false,
  },
  {
    id: 'm8',
    category: 'health',
    type: 'lesson',
    title: {
      [Language.ENGLISH]: "Nutrition Basics",
      [Language.HINDI]: "पोषण की मूल बातें",
      [Language.MARATHI]: "पोषणाची मूलतत्त्वे"
    },
    description: {
      [Language.ENGLISH]: "Eating right for less money.",
      [Language.HINDI]: "कम पैसे में सही भोजन।",
      [Language.MARATHI]: "कमी पैशात योग्य आहार."
    },
    icon: 'Apple',
    content: {
      [Language.ENGLISH]: "Eat pulses (daal) and green vegetables daily. Jaggery (gud) and peanuts are cheap and very healthy for iron.",
      [Language.HINDI]: "रोज दाल और हरी सब्जियां खाएं। गुड़ और मूंगफली सस्ती हैं और आयरन के लिए बहुत सेहतमंद हैं।",
      [Language.MARATHI]: "दररोज डाळ आणि हिरव्या भाज्या खा. गूळ आणि शेंगदाणे स्वस्त आहेत आणि लोहासाठी खूप आरोग्यदायी आहेत."
    },
    isCompleted: false,
  }
];

export const PERSONA_CONFIG = {
  [Persona.CHILD]: { color: 'bg-yellow-100', text: 'text-yellow-900', icon: Smile, accent: 'bg-yellow-500' },
  [Persona.WOMAN]: { color: 'bg-pink-100', text: 'text-pink-900', icon: Heart, accent: 'bg-pink-500' },
  [Persona.MAN]: { color: 'bg-blue-100', text: 'text-blue-900', icon: Briefcase, accent: 'bg-blue-500' },
  [Persona.ELDER]: { color: 'bg-emerald-100', text: 'text-emerald-900', icon: Users, accent: 'bg-emerald-500' },
};