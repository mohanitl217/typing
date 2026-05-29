/* ============================================================
   Catalog of all sections, sub-sections and items
   Mirrors the screenshots provided by the user.
   ============================================================ */

const CATALOG = [
  // ================== ENGLISH TYPING ==================
  {
    section: "English Typing",
    icon: "⌨",
    color: "primary",
    groups: [{
      title: null,
      items: [
        { id:"en-learn",   title:"Learn Typing",  iconText:"ABC", color:"accent",
          target:"learn.html?lang=en&layout=qwerty" },
        { id:"en-tests",   title:"Take Tests",    iconText:"ABC", color:"info",
          target:"practice.html?exam=ssc-en" },
        { id:"en-numbers", title:"Number Typing", iconText:"123", color:"accent",
          target:"learn.html?lang=en&layout=qwerty&mode=numbers" },
      ]
    }]
  },

  // ================== HINDI - KRUTIDEV / DEVLYS ==================
  {
    section: "Hindi Typing - KrutiDev & DevLys Font",
    icon: "अ",
    color: "danger",
    groups: [{
      title: null,
      items: [
        { id:"krutidev-learn", title:"Learn Typing", iconText:"अ ब", color:"danger",
          target:"learn.html?lang=hi&layout=krutidev", hindi: true },
        { id:"krutidev-tests", title:"Take Tests",   iconText:"अ ब", color:"danger",
          target:"practice.html?exam=ssc-hi&layout=krutidev", hindi: true },
      ]
    }]
  },

  // ================== HINDI - MANGAL UNICODE ==================
  {
    section: "Hindi Typing - Mangal Unicode Font",
    icon: "अ",
    color: "purple",
    groups: [
      {
        title: "Remington GAIL Layout",
        items: [
          { id:"mangal-gail-learn", title:"Learn Typing", iconText:"अ ब", color:"purple",
            target:"learn.html?lang=hi&layout=remington-gail", hindi: true },
          { id:"mangal-gail-test",  title:"Take Test",    iconText:"अ ब", color:"purple",
            target:"practice.html?exam=ssc-hi&layout=remington-gail", hindi: true },
        ]
      },
      {
        title: "INSCRIPT Layout",
        items: [
          { id:"mangal-inscript-learn", title:"Learn Typing", iconText:"अ ब", color:"info",
            target:"learn.html?lang=hi&layout=inscript", hindi: true },
          { id:"mangal-inscript-test",  title:"Take Test",    iconText:"अ ब", color:"info",
            target:"practice.html?exam=ssc-hi&layout=inscript", hindi: true },
        ]
      },
      {
        title: "Remington CBI Layout",
        items: [
          { id:"mangal-cbi-learn", title:"Learn Typing", iconText:"अ ब", color:"teal",
            target:"learn.html?lang=hi&layout=remington-cbi", hindi: true },
          { id:"mangal-cbi-test",  title:"Take Test",    iconText:"अ ब", color:"teal",
            target:"practice.html?exam=ssc-hi&layout=remington-cbi", hindi: true },
        ]
      }
    ]
  },

  // ================== COMMON EXAM PATTERN ==================
  {
    section: "Common Exam Pattern",
    icon: "🎯",
    color: "indigo",
    groups: [{
      title: "All Exams (General Pattern)",
      note: "Usable for: Civil Courts Bihar / Jharkhand, KVS, Kolkata HC, BSF, CRPF, CISF, UPSC, Junior Assistant, Judicial Assistant, SSC and all exams. Change settings to match your exam.",
      items: [
        { id:"common-en",   title:"English Test",          iconText:"ALL", color:"danger",
          target:"exam.html?pattern=common-en" },
        { id:"common-hi-k", title:"Hindi - Krutidev/Devlys", iconText:"ALL", color:"danger",
          target:"exam.html?pattern=common-hi-krutidev" },
        { id:"common-hi-m", title:"Hindi - Mangal Font",     iconText:"ALL", color:"danger",
          target:"exam.html?pattern=common-hi-mangal" },
      ]
    }]
  },

  // ================== ALL INDIA EXAMS ==================
  {
    section: "All India Level Exams",
    icon: "🇮🇳",
    color: "primary",
    groups: [
      {
        title: "SSC CGL/CHSL",
        items: [
          { id:"ssc-en", title:"SSC English Test", iconText:"SSC", color:"danger",
            target:"exam.html?pattern=ssc-en" },
          { id:"ssc-hi", title:"SSC Hindi Test",   iconText:"SSC", color:"danger",
            target:"exam.html?pattern=ssc-hi" },
        ]
      },
      {
        title: "BSF/CAPF HCM",
        items: [
          { id:"bsf-en", title:"English Test", iconText:"BSF", color:"accent",
            target:"exam.html?pattern=bsf-en" },
          { id:"bsf-hi", title:"Hindi Test",   iconText:"BSF", color:"accent",
            target:"exam.html?pattern=bsf-hi" },
        ]
      },
      {
        title: "RRB NTPC",
        items: [
          { id:"ntpc-en", title:"NTPC English Test", iconText:"RRB", color:"danger",
            target:"exam.html?pattern=ntpc-en" },
          { id:"ntpc-hi", title:"NTPC Hindi Test",   iconText:"RRB", color:"danger",
            target:"exam.html?pattern=ntpc-hi" },
        ]
      }
    ]
  },

  // ================== RAJASTHAN ==================
  {
    section: "Rajasthan Exams",
    icon: "🏛",
    color: "accent",
    groups: [
      {
        title: "Raj. High Court",
        items: [
          { id:"raj-hc-exam", title:"Exam Mode HC",        iconText:"⌨", color:"info",
            target:"exam.html?pattern=raj-hc" },
          { id:"raj-hc-jja",  title:"Raj. High Court SA/LDC(JJA)", iconText:"RHC", color:"danger",
            target:"exam.html?pattern=raj-hc-jja" },
          { id:"raj-hc-steno",title:"Raj High Court - Steno", iconText:"RHC", color:"danger",
            target:"exam.html?pattern=raj-hc-steno" },
        ]
      },
      {
        title: "RSMSSB Exams",
        items: [
          { id:"rssb-ldc", title:"RSSB LDC 2024 Pattern", iconText:"LDC", color:"primary",
            target:"exam.html?pattern=rssb-ldc" },
          { id:"rssb-ia",  title:"RSSB IA 2024 Pattern",  iconText:"IA",  color:"primary",
            target:"exam.html?pattern=rssb-ia" },
        ]
      },
      {
        title: "Word & Excel Efficiency",
        items: [
          { id:"word-eff",  title:"Word Efficiency",       iconText:"W", color:"info",
            target:"exam.html?pattern=word-efficiency" },
          { id:"excel-eff", title:"Excel Efficiency",      iconText:"X", color:"success",
            target:"exam.html?pattern=excel-efficiency" },
          { id:"word-eff-new",title:"Word Efficiency (New)", iconText:"W+", color:"info",
            target:"exam.html?pattern=word-efficiency-new" },
        ]
      },
      {
        title: "Linewise Pattern",
        items: [
          { id:"line-ia", title:"Linewise IA 2013, RPSC LDC, Electricity Boards, Assam Rifles",
            iconText:"≡", color:"accent", target:"exam.html?pattern=linewise" },
        ]
      }
    ]
  },

  // ================== UTTAR PRADESH ==================
  {
    section: "Uttar Pradesh Exams",
    icon: "🏛",
    color: "info",
    groups: [
      {
        title: "UPSSSC",
        items: [
          { id:"upsssc-en",   title:"English Test",   iconText:"UP", color:"info",
            target:"exam.html?pattern=upsssc-en" },
          { id:"upsssc-kd",   title:"Hindi - KrutiDev", iconText:"UP", color:"info",
            target:"exam.html?pattern=upsssc-krutidev" },
          { id:"upsssc-ins",  title:"Hindi - INSCRIPT", iconText:"UP", color:"info",
            target:"exam.html?pattern=upsssc-inscript" },
        ]
      },
      {
        title: "UP Police ASI/SI/Comp. Operator",
        items: [
          { id:"uppol-en", title:"English Test", iconText:"UPP", color:"primary",
            target:"exam.html?pattern=uppol-en" },
          { id:"uppol-hi", title:"Hindi Test",   iconText:"UPP", color:"primary",
            target:"exam.html?pattern=uppol-hi" },
        ]
      },
      {
        title: "UPPCL",
        items: [
          { id:"uppcl-en", title:"English Test", iconText:"UPPCL", color:"accent",
            target:"exam.html?pattern=uppcl-en" },
          { id:"uppcl-hi", title:"Hindi Test",   iconText:"UPPCL", color:"accent",
            target:"exam.html?pattern=uppcl-hi" },
        ]
      },
      {
        title: "Allahabad High Court Group-C / ARO / RO",
        items: [
          { id:"ahc-en",   title:"English",        iconText:"AHC", color:"info",
            target:"exam.html?pattern=ahc-en" },
          { id:"ahc-hi",   title:"Hindi",          iconText:"AHC", color:"info",
            target:"exam.html?pattern=ahc-hi" },
          { id:"ahc-legal",title:"AHC Legal Matter", iconText:"AHC", color:"info",
            target:"exam.html?pattern=ahc-legal" },
        ]
      }
    ]
  },

  // ================== MADHYA PRADESH ==================
  {
    section: "Madhya Pradesh Exams",
    icon: "🏛",
    color: "success",
    groups: [
      {
        title: "MP Police",
        items: [
          { id:"mppol-en", title:"English Test", iconText:"MPP", color:"success",
            target:"exam.html?pattern=mppol-en" },
          { id:"mppol-hi", title:"Hindi Test",   iconText:"MPP", color:"success",
            target:"exam.html?pattern=mppol-hi" },
        ]
      },
      {
        title: "CPCT Exam",
        items: [
          { id:"cpct-en", title:"CPCT English Test", iconText:"CPCT", color:"info",
            target:"exam.html?pattern=cpct-en" },
          { id:"cpct-hi", title:"CPCT Hindi Test",   iconText:"CPCT", color:"info",
            target:"exam.html?pattern=cpct-hi" },
        ]
      },
      {
        title: "MP High Court Exam",
        items: [
          { id:"mphc-en",   title:"MP High Court English",  iconText:"MPHC", color:"danger",
            target:"exam.html?pattern=mphc-en" },
          { id:"mphc-hi",   title:"MP High Court Hindi",    iconText:"MPHC", color:"danger",
            target:"exam.html?pattern=mphc-hi" },
          { id:"mphc-audio",title:"MPHC Direct Audio Test", iconText:"🎧", color:"primary",
            target:"exam.html?pattern=mphc-audio" },
        ]
      }
    ]
  },

  // ================== BIHAR / JHARKHAND ==================
  {
    section: "Bihar Exams",
    icon: "🏛",
    color: "danger",
    groups: [{
      title: "BELTRON Bihar",
      items: [
        { id:"beltron-en", title:"BELTRON English", iconText:"BLT", color:"danger",
          target:"exam.html?pattern=beltron-en" },
        { id:"beltron-hi", title:"BELTRON Hindi",   iconText:"BLT", color:"danger",
          target:"exam.html?pattern=beltron-hi" },
      ]
    }]
  },
  {
    section: "Jharkhand Exams",
    icon: "🏛",
    color: "info",
    groups: [{
      title: "Jharkhand High Court",
      items: [
        { id:"jhar-en", title:"English Test", iconText:"JHC", color:"info",
          target:"exam.html?pattern=jhar-en" },
        { id:"jhar-hi", title:"Hindi Test",   iconText:"JHC", color:"info",
          target:"exam.html?pattern=jhar-hi" },
      ]
    }]
  },

  // ================== GUJARAT ==================
  {
    section: "Gujarat Exams",
    icon: "🏛",
    color: "purple",
    groups: [{
      title: "Gujarat HC Exam",
      items: [
        { id:"guj-en", title:"English",         iconText:"GHC", color:"purple",
          target:"exam.html?pattern=guj-en" },
        { id:"guj-gj", title:"ગુજરાતી Typing",   iconText:"GHC", color:"purple",
          target:"exam.html?pattern=guj-gj", hindi: true },
      ]
    }]
  },

  // ================== MAHARASHTRA ==================
  {
    section: "Maharashtra Exams",
    icon: "🏛",
    color: "accent",
    groups: [
      {
        title: "MPSC Exam",
        items: [
          { id:"mpsc-en", title:"MPSC English", iconText:"MPSC", color:"danger",
            target:"exam.html?pattern=mpsc-en" },
          { id:"mpsc-mr", title:"MPSC Marathi", iconText:"MPSC", color:"danger",
            target:"exam.html?pattern=mpsc-mr", hindi: true },
        ]
      },
      {
        title: "Bombay High Court",
        items: [
          { id:"bhc-en", title:"English",          iconText:"BHC", color:"info",
            target:"exam.html?pattern=bhc-en" },
          { id:"bhc-mr", title:"Marathi Krutidev", iconText:"BHC", color:"info",
            target:"exam.html?pattern=bhc-mr-krutidev", hindi: true },
        ]
      }
    ]
  },

  // ================== EXAM SPECIFIC TOOLS ==================
  {
    section: "Exam Specific Tools",
    icon: "🛠",
    color: "teal",
    groups: [{
      title: "Court Legal Matter",
      items: [
        { id:"court-ahc",   title:"Allahabad High Court", iconText:"AHC", color:"info",
          target:"practice.html?exam=court-en&type=ahc" },
        { id:"court-supreme",title:"Supreme Court Judgements", iconText:"SC", color:"danger",
          target:"practice.html?exam=court-en&type=supreme" },
      ]
    }]
  }
];

/* ============================================================
   Lesson catalogue used by learn.html
   ============================================================ */
const LESSONS = {
  // English QWERTY (touch-typing progression)
  "en|qwerty": [
    { name: "Lesson 1 - Home Row (asdf jkl;)", text:"asdf jkl; asdf jkl; aas ssd ddf ffj jjk kkl ll; sad lad fad ask jak lak;" },
    { name: "Lesson 2 - Home Row Words",        text:"a sad lad; a fall; ask all; alas a flask; a salad; ask a lass; a glad lad;" },
    { name: "Lesson 3 - Top Row (eiruwq)",      text:"we re er ie iu ui ow we re er it is we are it was we were it is a write" },
    { name: "Lesson 4 - Bottom Row (vbn,m.)",   text:"can van man ban tan ran more came name vain main rain bank tank, sank." },
    { name: "Lesson 5 - All Letters",           text:"the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs." },
    { name: "Lesson 6 - Capitals & Punctuation",text:"India is a great country. New Delhi is the capital. We celebrate Republic Day on 26th January." },
    { name: "Lesson 7 - Numbers Row",           text:"1234 5678 90 1029 3847 56789 the year 2024 has 366 days. call 911 in emergency." },
    { name: "Lesson 8 - Symbols",               text:"@john said: \"hello!\" cost = $25.50 + 10% tax. email me @ user@site.com #typing" },
    { name: "Lesson 9 - Practice Paragraph",    text:"Practice makes a man perfect. The more you practice the better you become. Sit straight, place your fingers on the home row keys and look at the screen, not at the keyboard." },
    { name: "Lesson 10 - Speed Drill",          text:"if you can think you can do you can be then you will go where you want to go and become what you want to become so keep on practicing." }
  ],

  // English Numbers / Numpad
  "en|qwerty|numbers": [
    { name: "Numbers 1-5",   text:"1111 2222 3333 4444 5555 12345 11223 22334 33445 44556" },
    { name: "Numbers 6-0",   text:"6666 7777 8888 9999 0000 67890 56789 78901 89012 90123" },
    { name: "Mixed numbers", text:"1029 3847 5678 1234 5678 9012 3456 7890 2468 1357 9876" },
    { name: "Phone numbers", text:"011-2345-6789  +91 98765 43210  022-1122-3344  044 5566 7788  080 9988 6655" },
    { name: "Currency",      text:"Rs. 1,250 Rs. 35,000 Rs. 1,25,000 Rs. 5,00,000 USD 1,000.50 EUR 2,345.75" },
    { name: "Dates",         text:"01/01/2024 15/08/1947 26/01/1950 02/10/1869 14/04/1891 23/03/1931 25/12/2023" }
  ],

  // Hindi - Krutidev (Devanagari shown via Mangal/Noto)
  "hi|krutidev": [
    { name:"पाठ 1 - मूल अक्षर (कख)", text:"क का कि की कु कू के कै को कौ कं कः कक कक कक" },
    { name:"पाठ 2 - मात्राएँ",        text:"आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः का कि की कु कू के कै को" },
    { name:"पाठ 3 - व्यंजन",          text:"क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह" },
    { name:"पाठ 4 - शब्द",            text:"कमल कलम कागज कान काम काज कब कह क्या कौन किसे" },
    { name:"पाठ 5 - वाक्य",           text:"राम घर जाता है। सीता गीत गाती है। बच्चे खेल रहे हैं। माँ भोजन बनाती है।" },
    { name:"पाठ 6 - अनुच्छेद",        text:"भारत हमारा देश है। यहाँ अनेक भाषाएँ बोली जाती हैं। हमें अपने देश पर गर्व है। हम सब एक हैं।" }
  ],

  // Hindi - Inscript
  "hi|inscript": [
    { name:"पाठ 1 - होम पंक्ति",       text:"क म न व ल स ि ो ् ु क का कि की कु कू के कै" },
    { name:"पाठ 2 - व्यंजन ऊपरी पंक्ति",text:"त द क प र च ह ज ख ट छ ब अ ज्ञ" },
    { name:"पाठ 3 - शब्दाभ्यास",       text:"कमल कलम काम कान कब कहाँ कौन क्या किसका कितना" },
    { name:"पाठ 4 - संयुक्ताक्षर",      text:"क्ष त्र ज्ञ श्र द्व प्र क्र स्व स्व त्व ध्व स्थ स्थान" },
    { name:"पाठ 5 - वाक्य",            text:"मेरा भारत महान है। मैं भारतीय हूँ। हमारा देश सबसे प्यारा है।" }
  ],

  // Hindi - Remington Gail
  "hi|remington-gail": [
    { name:"पाठ 1 - मूल अक्षर",        text:"क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध" },
    { name:"पाठ 2 - शब्द",            text:"कमल कलम कागज काम काज कान कब क्या कौन" },
    { name:"पाठ 3 - मात्राएँ",        text:"का कि की कु कू के कै को कौ कं कः कक" },
    { name:"पाठ 4 - वाक्य",           text:"राम सीता के साथ वन को गए। उन्होंने अनेक कष्ट सहे।" }
  ],

  // Hindi - Remington CBI
  "hi|remington-cbi": [
    { name:"पाठ 1 - मूल अक्षर",        text:"क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न" },
    { name:"पाठ 2 - शब्द",            text:"राम लक्ष्मण भरत शत्रुघ्न दशरथ कौशल्या सुमित्रा" },
    { name:"पाठ 3 - वाक्य",           text:"न्यायालय में सत्य की विजय होती है। न्याय हमेशा देर से मिलता है किंतु अवश्य मिलता है।" }
  ]
};

/* ============================================================
   Test paragraphs grouped by exam pattern
   ============================================================ */
const EXAM_PATTERNS = {
  "common-en": {
    name: "Common English Pattern",
    duration: 600, words: 300, lang: "en",
    paragraphs: [
      "On a certain occasion, many years ago, the north wind and the sun were unable to agree as to which of them had the greater strength. At last they came to the decision that they would put their strength to the test. It was agreed between them to try their strength upon a strong young man who was at the time walking from his farm to a town some distance away. Their object was to get the man's coat off. The north wind had a heavy fall of rain. The wind, however, did not take off the man's coat; instead it had the effect of making him draw the coat very close to his body to keep himself warm and dry. Then the sun came out and tried to make the poor man as warm as possible. It was not long before he was feeling too much warm in his heavy coat, and he took it off and sat down under some trees to rest.",
      "Education is the most powerful weapon which we can use to change the world. The function of education is to teach one to think intensively and to think critically. Intelligence plus character is the goal of true education. The roots of education are bitter, but the fruit is sweet. An investment in knowledge pays the best interest. Education is not the filling of a pail, but the lighting of a fire."
    ]
  },
  "common-hi-krutidev": {
    name: "Common Hindi Pattern (KrutiDev)",
    duration: 600, words: 250, lang: "hi",
    paragraphs: [
      "हमारा देश महान स्त्रियों और पुरुषों का देश है जिन्होंने देश के लिए ऐसे आदर्श कार्य किए हैं जिन्हें भारतवासी सदा याद रखेंगे। कई महापुरुषों ने हमारी आजादी की लड़ाई में अपना तन-मन-धन परिवार सब कुछ अर्पण कर दिया।"
    ]
  },
  "common-hi-mangal": {
    name: "Common Hindi Pattern (Mangal)",
    duration: 600, words: 250, lang: "hi",
    paragraphs: [
      "विज्ञान और प्रौद्योगिकी ने मानव जीवन को पूरी तरह से बदल दिया है। आज हम कुछ ही सेकेंड में दुनिया के किसी भी कोने में संदेश भेज सकते हैं।"
    ]
  },
  "ssc-en": {
    name: "SSC CGL/CHSL English", duration: 600, words: 300, lang: "en",
    paragraphs: [
      "Honesty is one of the most important virtues a person can have. An honest person is trusted and respected by everyone in society. Honesty means speaking the truth and being truthful in dealings with others. It is the foundation of strong relationships, both personal and professional."
    ]
  },
  "ssc-hi": {
    name: "SSC CGL/CHSL Hindi", duration: 600, words: 270, lang: "hi",
    paragraphs: [
      "चार महीने बाद यह पाया गया कि जिन नौजवानों को चलना-फिरना और खड़े रहना था, उनके खून में चीनी और लिपिड, यानी चर्बी का स्तर सबसे बेहतर था।"
    ]
  },
  "ntpc-en": {
    name: "RRB NTPC English", duration: 600, words: 300, lang: "en",
    paragraphs: [
      "Mankind has taken another important step in its exploration of the universe with the imaging of a span of faraway worlds in long lost time by the James Webb Space Telescope, which peers into time and space like no human eye or machine has done till now."
    ]
  },
  "ntpc-hi": {
    name: "RRB NTPC Hindi", duration: 600, words: 270, lang: "hi",
    paragraphs: [
      "भारतीय रेल विश्व का चौथा सबसे बड़ा रेल नेटवर्क है। प्रतिदिन लाखों यात्री इसमें सफर करते हैं और हजारों टन माल का परिवहन होता है।"
    ]
  },
  "bsf-en": {
    name: "BSF/CAPF HCM English", duration: 600, words: 250, lang: "en",
    paragraphs: [
      "The Border Security Force is the world's largest border guarding force. It is responsible for protecting the borders of India during peacetime and preventing trans-border crimes."
    ]
  },
  "bsf-hi": {
    name: "BSF/CAPF HCM Hindi", duration: 600, words: 250, lang: "hi",
    paragraphs: [
      "सीमा सुरक्षा बल भारत की सीमाओं की रक्षा करने वाला विश्व का सबसे बड़ा सीमा सुरक्षा बल है।"
    ]
  },
  "ahc-legal": {
    name: "AHC Legal Matter", duration: 600, words: 300, lang: "en",
    paragraphs: [
      "HIGH COURT OF JUDICATURE AT ALLAHABAD, LUCKNOW BENCH Court No. - 14 A.F.R. Case :- CRIMINAL APPEAL No. - 116 of 2021 Appellant :- Mewa Lal Bhargav Respondent :- State Of U.P. & Ors. The appellant has preferred this appeal under Section 14-A(2) of Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989."
    ]
  },
  "raj-hc": {
    name: "Rajasthan High Court", duration: 600, words: 250, lang: "hi",
    paragraphs: [
      "राजस्थान उच्च न्यायालय की स्थापना 29 अगस्त 1949 को हुई थी। इसका मुख्य पीठ जोधपुर में स्थित है तथा एक खंडपीठ जयपुर में है।"
    ]
  },
  "raj-hc-jja": {
    name: "Rajasthan HC SA/LDC(JJA)", duration: 600, words: 250, lang: "hi",
    paragraphs: ["राजस्थान उच्च न्यायालय कनिष्ठ न्यायिक सहायक की परीक्षा में हिंदी टंकण का बहुत महत्व है। उम्मीदवारों को 25 शब्द प्रति मिनट की गति से टंकण करना होता है।"]
  },
  "raj-hc-steno": {
    name: "Rajasthan HC Stenographer", duration: 600, words: 350, lang: "hi",
    paragraphs: ["आशुलिपिक की भूमिका न्यायालय में अत्यंत महत्वपूर्ण है। उन्हें कार्यवाही को शीघ्रता से दर्ज करना होता है। टंकण की गति 40 शब्द प्रति मिनट होनी चाहिए।"]
  },
  "rssb-ldc": {
    name: "RSSB LDC 2024", duration: 600, words: 250, lang: "en",
    paragraphs: ["The Rajasthan Subordinate and Ministerial Services Selection Board conducts the Lower Division Clerk examination. The typing test is a qualifying stage of the recruitment process."]
  },
  "rssb-ia": {
    name: "RSSB IA 2024", duration: 600, words: 250, lang: "en",
    paragraphs: ["Informatics Assistant requires good typing speed in both English and Hindi. The candidate must be familiar with computer fundamentals and word processing."]
  },
  "word-efficiency": {
    name: "Word Efficiency Test", duration: 600, words: 250, lang: "en",
    paragraphs: ["This test evaluates the candidate's proficiency in Microsoft Word. Tasks include formatting, mail merge, table operations, and document protection."]
  },
  "word-efficiency-new": {
    name: "Word Efficiency (New Pattern)", duration: 600, words: 250, lang: "en",
    paragraphs: ["The new word efficiency pattern emphasises practical skills - inserting headers, footers, page numbers, footnotes, references and creating professional documents."]
  },
  "excel-efficiency": {
    name: "Excel Efficiency Test", duration: 600, words: 250, lang: "en",
    paragraphs: ["Excel efficiency tests evaluate spreadsheet skills - formulas, functions, pivot tables, charts, conditional formatting, sorting, filtering and data analysis."]
  },
  "linewise": {
    name: "Linewise Pattern (RPSC LDC)", duration: 600, words: 200, lang: "en",
    paragraphs: ["Each line is treated as a unit. Errors are counted per line and overall accuracy is calculated by line, not by character. Speed and accuracy both matter."]
  },
  "upsssc-en": {
    name: "UPSSSC English", duration: 600, words: 250, lang: "en",
    paragraphs: ["The Uttar Pradesh Subordinate Services Selection Commission conducts examinations for Group C posts. Typing speed is mandatory for clerical positions."]
  },
  "upsssc-krutidev": {
    name: "UPSSSC Hindi (KrutiDev)", duration: 600, words: 230, lang: "hi",
    paragraphs: ["उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग द्वारा विभिन्न पदों के लिए परीक्षा आयोजित की जाती है। हिंदी टंकण परीक्षा अनिवार्य है।"]
  },
  "upsssc-inscript": {
    name: "UPSSSC Hindi (INSCRIPT)", duration: 600, words: 230, lang: "hi",
    paragraphs: ["इंस्क्रिप्ट लेआउट यूनिकोड हिंदी टंकण के लिए मानक है। यह सीखने में आसान है क्योंकि इसमें वर्णों को ध्वन्यात्मक क्रम में रखा गया है।"]
  },
  "uppol-en": {
    name: "UP Police English", duration: 600, words: 250, lang: "en",
    paragraphs: ["Uttar Pradesh Police is one of the largest state police forces in India. Recruitment of computer operators requires both English and Hindi typing proficiency."]
  },
  "uppol-hi": {
    name: "UP Police Hindi", duration: 600, words: 230, lang: "hi",
    paragraphs: ["उत्तर प्रदेश पुलिस विभाग में कंप्यूटर ऑपरेटर के पदों पर भर्ती के लिए हिंदी टंकण की गति आवश्यक है। मानक गति 25 शब्द प्रति मिनट है।"]
  },
  "uppcl-en": {
    name: "UPPCL English", duration: 600, words: 250, lang: "en",
    paragraphs: ["The UP Power Corporation Limited recruits Office Assistants and Stenographers through a written test followed by typing speed evaluation."]
  },
  "uppcl-hi": {
    name: "UPPCL Hindi", duration: 600, words: 230, lang: "hi",
    paragraphs: ["उत्तर प्रदेश पावर कारपोरेशन लिमिटेड में लिपिक एवं आशुलिपिक के पदों पर भर्ती लिखित परीक्षा एवं टंकण परीक्षा के माध्यम से होती है।"]
  },
  "ahc-en": {
    name: "Allahabad High Court English", duration: 600, words: 280, lang: "en",
    paragraphs: ["The High Court of Judicature at Allahabad is one of the oldest high courts in India. The court was established on 17 March 1866 with its principal seat at Allahabad."]
  },
  "ahc-hi": {
    name: "Allahabad High Court Hindi", duration: 600, words: 250, lang: "hi",
    paragraphs: ["इलाहाबाद उच्च न्यायालय भारत के सबसे पुराने उच्च न्यायालयों में से एक है। इसकी स्थापना 17 मार्च 1866 को हुई थी। इसका मुख्य पीठ प्रयागराज में स्थित है।"]
  },
  "mppol-en": {
    name: "MP Police English", duration: 600, words: 250, lang: "en",
    paragraphs: ["The Madhya Pradesh Police is the law enforcement agency for the state of Madhya Pradesh. The headquarters is in Bhopal, the capital of the state."]
  },
  "mppol-hi": {
    name: "MP Police Hindi", duration: 600, words: 230, lang: "hi",
    paragraphs: ["मध्य प्रदेश पुलिस राज्य की कानून प्रवर्तन एजेंसी है। इसका मुख्यालय राज्य की राजधानी भोपाल में स्थित है।"]
  },
  "cpct-en": {
    name: "CPCT English", duration: 600, words: 250, lang: "en",
    paragraphs: ["The Computer Proficiency Certification Test is conducted by Madhya Pradesh Agency for Promotion of Information Technology. It tests computer awareness, English and Hindi typing."]
  },
  "cpct-hi": {
    name: "CPCT Hindi", duration: 600, words: 230, lang: "hi",
    paragraphs: ["कंप्यूटर प्रवीणता प्रमाणन परीक्षा का आयोजन मध्य प्रदेश सूचना प्रौद्योगिकी संवर्धन एजेंसी द्वारा किया जाता है।"]
  },
  "mphc-en": {
    name: "MP High Court English", duration: 600, words: 280, lang: "en",
    paragraphs: ["The High Court of Madhya Pradesh has its principal seat at Jabalpur and benches at Indore and Gwalior. The recruitment for staff positions includes a typing test."]
  },
  "mphc-hi": {
    name: "MP High Court Hindi", duration: 600, words: 250, lang: "hi",
    paragraphs: ["मध्य प्रदेश उच्च न्यायालय का मुख्य पीठ जबलपुर में स्थित है तथा इंदौर एवं ग्वालियर में खंडपीठ हैं।"]
  },
  "mphc-audio": {
    name: "MP High Court Direct Audio", duration: 600, words: 250, lang: "en",
    paragraphs: ["This is a direct audio test where the candidate listens to a passage and types it. It evaluates listening skills along with typing accuracy and speed."]
  },
  "beltron-en": {
    name: "BELTRON English", duration: 600, words: 250, lang: "en",
    paragraphs: ["Bihar State Electronics Development Corporation Limited (BELTRON) recruits computer operators and data entry operators through written and typing tests."]
  },
  "beltron-hi": {
    name: "BELTRON Hindi", duration: 600, words: 230, lang: "hi",
    paragraphs: ["बिहार राज्य इलेक्ट्रॉनिक्स विकास निगम लिमिटेड कंप्यूटर ऑपरेटर एवं डेटा एंट्री ऑपरेटर के पदों पर भर्ती के लिए परीक्षा आयोजित करता है।"]
  },
  "jhar-en": {
    name: "Jharkhand HC English", duration: 600, words: 280, lang: "en",
    paragraphs: ["The Jharkhand High Court was established in 2000 when Jharkhand was carved out of Bihar. It is located in Ranchi, the capital of the state."]
  },
  "jhar-hi": {
    name: "Jharkhand HC Hindi", duration: 600, words: 250, lang: "hi",
    paragraphs: ["झारखंड उच्च न्यायालय की स्थापना सन् 2000 में हुई थी जब बिहार से अलग होकर झारखंड एक नया राज्य बना।"]
  },
  "guj-en": {
    name: "Gujarat HC English", duration: 600, words: 280, lang: "en",
    paragraphs: ["The Gujarat High Court is the high court of the state of Gujarat. It came into existence on 1 May 1960 after the bifurcation of Bombay State."]
  },
  "guj-gj": {
    name: "Gujarat HC Gujarati", duration: 600, words: 250, lang: "hi",
    paragraphs: ["ગુજરાત હાઈકોર્ટ ગુજરાત રાજ્યની ઉચ્ચ ન્યાયાલય છે. તેની સ્થાપના 1 મે 1960 ના રોજ થઈ હતી."]
  },
  "mpsc-en": {
    name: "MPSC English", duration: 600, words: 280, lang: "en",
    paragraphs: ["The Maharashtra Public Service Commission conducts examinations for various state government posts. Typing speed is required for clerical positions."]
  },
  "mpsc-mr": {
    name: "MPSC Marathi", duration: 600, words: 250, lang: "hi",
    paragraphs: ["महाराष्ट्र लोकसेवा आयोग राज्य सरकारच्या विविध पदांसाठी परीक्षा घेते. लिपिक पदांसाठी टंकलेखनाची गती आवश्यक आहे."]
  },
  "bhc-en": {
    name: "Bombay HC English", duration: 600, words: 280, lang: "en",
    paragraphs: ["The Bombay High Court is one of the oldest high courts in India. It was established under the Letters Patent of 26 June 1862. Its principal seat is in Mumbai."]
  },
  "bhc-mr-krutidev": {
    name: "Bombay HC Marathi (KrutiDev)", duration: 600, words: 250, lang: "hi",
    paragraphs: ["मुंबई उच्च न्यायालय हे भारतातील सर्वात जुन्या उच्च न्यायालयांपैकी एक आहे. त्याची स्थापना 26 जून 1862 च्या पत्र-पेटंटाद्वारे झाली."]
  }
};

window.CATALOG = CATALOG;
window.LESSONS = LESSONS;
window.EXAM_PATTERNS = EXAM_PATTERNS;
