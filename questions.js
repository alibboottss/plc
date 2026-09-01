/* =====================================================================
   ملف بنك الأسئلة (questions.js)
   هذا هو الملف الوحيد الذي يحتاج تعديله لإنشاء اختبار جديد بنفس الشكل.
   لا تلمس ملف الـ HTML إطلاقًا — فقط عدّل القيم والأسئلة هنا.
   =====================================================================
   1) EXAM_CONFIG: عنوان الاختبار، اسم القسم، مدة الوقت، ومفتاح الحفظ.
      - غيّر storageKey عند إنشاء اختبار جديد حتى لا يتعارض تخزينه محليًا
        (localStorage) مع اختبار قديم محفوظ بنفس المتصفح.

   2) QUESTIONS: مصفوفة الأسئلة. كل سؤال كائن (object) من خمسة أنواع:
        - "mcq"    : اختيار من متعدد  -> {type:"mcq", q:"نص السؤال", options:[...], correct: index}
        - "tf"     : صح/خطأ          -> {type:"tf",  q:"نص السؤال", options:["True","False"], correct: index}
        - "match"  : توصيل/مطابقة   -> {type:"match", q:"نص السؤال", left:[...], right:[...]}
                      (يقابل left[i] عنصر right[i] في ترتيب الإجابة الصحيحة)
        - "fill"   : إكمال فراغ      -> {type:"fill", q:"نص فيه ______ مكان الفراغ", answer:"الإجابة الصحيحة"}
                      (مدعوم بالكامل في ملف الـ HTML: حقل إدخال نصي + زر "Check
                       answer"، تتم مقارنة القيمة بـ answer بعد trim() و
                       toLowerCase(). لا يُحتسب ضمن نظام الاختيارات (radio).)
        - "notice" : تنبيه نصي فقط، لا يُحتسب كسؤال ولا يملك إجابة ->
                      {type:"notice", text:"نص التنبيه"}
                      (مدعوم في ملف الـ HTML: يظهر كصندوق تنبيه أصفر بدون رقم
                       سؤال وبدون أزرار اختيار وبدون تصحيح، ولا يُحتسب ضمن
                       العدّاد الكلي للأسئلة (Answered / Total).)

   ملاحظة على الترتيب: يعرض ملف الـ HTML الأسئلة بنفس ترتيبها في هذه المصفوفة.
   الترتيب الحالي: أسئلة "fill" أولاً، ثم أسئلة "mcq"/"tf" (وضمنها تنبيه
   الأسئلة الأربعة غير المؤكدة في مكانه الأصلي قبلها)، ثم أسئلة "match" في
   النهاية. لتغيير الترتيب لاختبار جديد، يكفي إعادة ترتيب عناصر المصفوفة.

   3) AR: قاموس ترجمة عربي اختياري. مفتاح كل سطر هو النص الإنجليزي الحرفي
      (نص السؤال أو نص الخيار)، وقيمته الترجمة العربية. إن لم يوجد نص
      داخل AR، تظهر زر الترجمة 🌐 ويعرض النص الإنجليزي كما هو (fallback
      تلقائي داخل دالة tr() الموجودة في ملف القالب) — لذا الترجمة اختيارية
      تمامًا وليست شرطًا لعمل الاختبار.
      ملاحظة: أسئلة PLC أدناه لا تملك ترجمة عربية حاليًا (القاموس فارغ)
      لأن المصدر الأصلي (الملف المصحح) كان بالإنجليزية فقط. الاختبار يعمل
      بشكل طبيعي بدونها (fallback للإنجليزية)؛ أخبرني إن رغبت أن أضيف
      ترجمة عربية لكل الأسئلة.
   ===================================================================== */

/* ======================= EXAM CONFIG ======================= */
/* غيّر هذه القيم لتخصيص الاختبار بالكامل دون الحاجة لتعديل ملف الـ HTML */
const EXAM_CONFIG = {
  pageTitle: "PLC - اختبار",
  brandHtml: '<span class="brand-icon">📋</span> PLC &nbsp;|&nbsp; Programmable Logic Controller اختبار',
  footerText: "MU | جامعة المشرق",
  durationHours: 2,
  durationMinutes: 30,
  storageKey: "plc_exam_state_v1"
};

/* ======================= DATA ======================= */
/* type: "mcq" | "tf" | "match" | "fill" | "notice"
   For mcq/tf: options[], correctIndex
   For match: left[], right[] (shuffled pool of right-side answers), correctMap (index of left -> index into right options as displayed)
   For fill: q (with ______ placeholder), answer (string, compared case-insensitively)
   For notice: text (informational only, no answer)

   ترتيب المصفوفة أدناه: fill -> (mcq/tf بما فيها تنبيه الأسئلة الأربعة
   غير المؤكدة) -> match
*/

const QUESTIONS = [
// ================= أسئلة إكمال الفراغ (Fill in the blank) =================
{type:"fill", q:"In PLC programming, ______ is used for Boolean type data representing on/off values.", answer:"Bool"},
{type:"fill", q:"______ isolation is a key advantage of electromagnetic control circuits, providing safety between control and load circuits.", answer:"Electrical"},
{type:"fill", q:"The three main buses in a PLC are the data bus, ______ bus, and control bus.", answer:"address"},
{type:"fill", q:"In the binary number system, the two digits used are 0 and ______.", answer:"1"},
{type:"fill", q:"A ______ switch uses two strips of different metals bonded together to detect temperature changes.", answer:"bimetallic"},
{type:"fill", q:"The ______ is the part of the CPU that performs data manipulation and logic operations such as AND and OR.", answer:"ALU"},
{type:"fill", q:"______ is the term used for the group of bits constituting some information in a PLC.", answer:"Byte"},
{type:"fill", q:"______ output modules send out a varying current or voltage signal, unlike discrete outputs which are simply ON/OFF.", answer:"Analog"},
{type:"fill", q:"A ______ is a pulse-driven motor that changes angular position in steps.", answer:"stepper motor"},
{type:"fill", q:"The two's complement of a binary number is obtained by adding ______ to the one's complement.", answer:"1"},
{type:"fill", q:"A ______ is an electrically operated switch that uses a low-power signal to control a high-power circuit.", answer:"relay"},
{type:"fill", q:"In a PLC, the ______ memory is used for the user's program.", answer:"RAM"},
{type:"fill", q:"A ______ switch has its contacts open in the absence of mechanical input and closes when mechanical input is applied.", answer:"normally open"},
{type:"fill", q:"A ______ is a directional control valve with 5 ports and 2 positions commonly used in pneumatic systems.", answer:"5/2-way valve"},
{type:"fill", q:"The ______ effect is the physical phenomenon where a temperature gradient in a conductor creates a voltage, used in thermocouples.", answer:"Seebeck"},
{type:"fill", q:"The hexadecimal number 1D in binary is ______.", answer:"00011101"},
{type:"fill", q:"A ______ is a control device that automatically opens or closes an electrical circuit when a specific fluid or gas pressure threshold is reached.", answer:"pressure switch"},
{type:"fill", q:"In signed binary numbers, the most significant bit is used to indicate the ______ of the number.", answer:"sign"},
{type:"fill", q:"The binary number 11010110 in octal is ______.", answer:"326"},
{type:"fill", q:"A ______ is a sensor that measures mechanical deformation by converting physical force into a proportional change in electrical resistance.", answer:"strain gauge"},

// ================= أسئلة الاختيار من متعدد وصح/خطأ (MCQ / True-False) =================
{type:"mcq", q:"Which number system is commonly used for input and output addresses in PLCs?", options:["Hexadecimal","Decimal","Binary","Octal"], correct:3},
{type:"mcq", q:"The one's complement of the binary number 101101 is:", options:["010011","010010","101101","110110"], correct:1},
{type:"tf", q:"The system bus is used for communications between the input/output ports and the input/output unit.", options:["True","False"], correct:0},
{type:"mcq", q:"Which type of motor produces rotation in steps for each digital pulse received?", options:["Brushless DC motor","AC motor","Stepper motor","DC motor"], correct:2},
{type:"mcq", q:"What is the denary equivalent of the binary number 11111?", options:["63","31","15","32"], correct:1},
{type:"tf", q:"Relay output modules are faster than solid-state output modules.", options:["True","False"], correct:1},
{type:"mcq", q:"Which of the following is NOT a typical control system task?", options:["Generate random outputs","Maintain some variable constant","Follow some prescribed change","Control a sequence of events"], correct:0},
{type:"mcq", q:"Which type of sensor uses eddy currents to detect metallic objects?", options:["Reed switch","Inductive proximity switch","Capacitive proximity switch","Photoelectric sensor"], correct:1},
{type:"mcq", q:"In a 2/2-way valve, what do the numbers represent?", options:["2 ports and 2 solenoids","None of the above","2 ports and 2 positions","2 positions and 2 pressures"], correct:2},
{type:"tf", q:"The hexadecimal system uses digits 0-9 and letters A-F, making it a base-12 system.", options:["True","False"], correct:1},
{type:"mcq", q:"A solenoid is best described as:", options:["An output device that converts electrical signals into physical movement","A communication protocol","An input device that detects temperature","A memory storage device"], correct:0},
{type:"mcq", q:"What does the term \"interposing relay\" refer to?", options:["A relay used for analog signals","A relay inside the PLC","A relay placed between the output point and the load to switch higher current","A relay used for communication"], correct:2},
{type:"mcq", q:"What is the range of unsigned 16-bit integer numbers in PLCs?", options:["0 to 32767","-65535 to +65535","-32768 to +32767","0 to 65535"], correct:3},
{type:"tf", q:"A solenoid valve is an input device that sends signals to the PLC.", options:["True","False"], correct:1},
{type:"mcq", q:"Which of the following is a type of photoelectric sensor configuration?", options:["Diffuse","Through-beam","Retroreflective","All of the above"], correct:3},
{type:"mcq", q:"Which memory type is used for permanent storage of the operating system in a PLC?", options:["RAM","ROM","Cache","EPROM"], correct:1},
{type:"tf", q:"Analog output modules send out a varying current or voltage signal.", options:["True","False"], correct:0},
{type:"mcq", q:"The term \"PWM\" in motor control stands for:", options:["Programmable Wave Module","Power Wave Modulation","Power Width Management","Pulse Width Modulation"], correct:3},
{type:"tf", q:"In binary arithmetic, 1 + 1 = 10.", options:["True","False"], correct:0},
{type:"mcq", q:"What voltage is commonly used for PLC solenoid valves?", options:["12V AC","48V AC","5V DC","24V DC"], correct:3},
{type:"mcq", q:"A 5/2-way directional control valve has:", options:["2 ports and 5 positions","None of the above","5 positions and 2 ports","5 ports and 2 positions"], correct:3},
{type:"tf", q:"A Normally Open (NO) contact is closed when the relay is de-energized.", options:["True","False"], correct:1},
{type:"tf", q:"A relay and a switch both operate in exactly the same way and require manual intervention to open or close a circuit.", options:["True","False"], correct:1},
{type:"tf", q:"Thermocouples work based on the Seebeck effect, where a temperature gradient in a conductor creates a voltage.", options:["True","False"], correct:0},
{type:"mcq", q:"In the binary number 1010, what is the most significant bit (MSB)?", options:["None of the above","1","Both 1 and 0","0"], correct:1},
{type:"tf", q:"In the binary system, the least significant bit (LSB) is the bit at the left-hand end of the number.", options:["True","False"], correct:1},
{type:"mcq", q:"What type of output uses a transistor to switch current through an external circuit?", options:["Triac output","Analog output","Relay output","Transistor output"], correct:3},
{type:"mcq", q:"What is the hexadecimal equivalent of the decimal number 156?", options:["A6","9C","156","9B"], correct:1},
{type:"tf", q:"A PLC (Programmable Logic Controller) is a specialized digital computer used in industrial automation to control and monitor various machines and processes.", options:["True","False"], correct:0},
{type:"tf", q:"Electromagnetic Control Circuits (ECC) use high-voltage signals to control low-power loads.", options:["True","False"], correct:1},
{type:"mcq", q:"What is the octal equivalent of the binary number 100111010?", options:["232","462","476","472"], correct:3},
{type:"tf", q:"A double-acting cylinder uses fluid to push the piston in both directions.", options:["True","False"], correct:0},
{type:"mcq", q:"A Resistance Temperature Detector (RTD) works by:", options:["Generating light with temperature","Changing electrical resistance with temperature","Generating voltage from temperature differences","Changing capacitance with temperature"], correct:1},
{type:"tf", q:"The octal number system is based on 8 digits: 0, 1, 2, 3, 4, 5, 6, 7.", options:["True","False"], correct:0},
{type:"mcq", q:"Which of the following is a disadvantage of electromagnetic relays?", options:["They can switch multiple contacts simultaneously","They have limited mechanical lifespan","They provide electrical isolation","They have high tolerance to voltage spikes"], correct:1},
{type:"mcq", q:"What does PLC stand for?", options:["Programmable Logic Computer","Programmable Linear Controller","Process Logic Controller","Programmable Logic Controller"], correct:3},
{type:"tf", q:"The two's complement of a binary number is obtained by changing all 1s to 0s and all 0s to 1s.", options:["True","False"], correct:1},
{type:"mcq", q:"What is the function of the address bus in a PLC?", options:["Carry addresses of memory locations","Provide power to the CPU","Carry data used in processing","Carry control signals"], correct:0},
{type:"mcq", q:"In PLC operation ______ retrieves the data into an output module.", options:["Input scan","None of the above","Program scan","Output scan"], correct:3},
{type:"mcq", q:"In which control system feedback is available?", options:["Close-loop","None of the above","Open-loop","Both A and D"], correct:0},
{type:"mcq", q:"In PLC the user can write the programs with the help of ______.", options:["Sensing devices","Programming devices","None of the above","Optical isolation"], correct:1},
{type:"mcq", q:"What are the types of programmable logic controllers?", options:["Fixed and Modular PLC","Modular, uniform PLC","Fixed, uniform PLC","None of the above"], correct:0},
{type:"mcq", q:"Relays is a ______ device.", options:["Mechanical devices","Electromechanical devices","None of the above","Electrical devices"], correct:1},
{type:"mcq", q:"Relays are used in ______.", options:["None of the above","Refrigerators","Water heaters","All of the above","Washing machines"], correct:3},
{type:"mcq", q:"Which one is the oldest programming language?", options:["Structured text programming","Function block diagram","Ladder logic","None of the above"], correct:2},
{type:"mcq", q:"The ladder logic in PLC consists of.", options:["Logic gates","Relay contacts and coils","Relays","Functional blocks"], correct:1},
{type:"mcq", q:"In PLC operation ______ checks the status at the input side.", options:["Input scan","Output scan","None of the above","Program scan"], correct:0},
{type:"mcq", q:"What are the elements of ladder logic?", options:["Normally open (contact)","Normally Close (contact)","None of the above","Both of the above"], correct:3},
{type:"mcq", q:"Which one is the correct sequence for PLC operation?", options:["Self-test, input scan, logic scan, output scan","None of the above","Self-test, input scan, output scan, logic scan","Self-test, logic scan, output scan, input scan"], correct:0},
{type:"mcq", q:"What is the standard form of IEC?", options:["None of the above","International Electrotechnical Commission","International Electrical Commission"], correct:1},
{type:"mcq", q:"What is the standard form of FBD?", options:["None of the above","First Block Diagram","Functional Block Division","Functional Block Diagram"], correct:3},
{type:"mcq", q:"Before PLC's was created many industries used ______.", options:["Resistors","None of the above","Capacitors","Relays"], correct:3},
{type:"mcq", q:"In modular type PLC, the PLC's are classified into ______.", options:["Triac output PLC","Relay output PLC","Transistor output PLC","All of the above"], correct:3},
{type:"mcq", q:"Which mode accepts signals from sensors?", options:["Both","Input module","None of the above","Output modular"], correct:1},
{type:"mcq", q:"______ are the components that are required to change or create a program.", options:["Connector cable","All of the above","Programming software","PLC, programming device"], correct:1},
{type:"mcq", q:"What are the components that are used to make relay ______.", options:["All of the above","Armature","Spring","Electromagnet"], correct:0},
{type:"mcq", q:"What are the components that make the programmable logic controller work?", options:["Power supply","Input and output module","All of the above","CPU"], correct:2},
{type:"mcq", q:"The system that is used to direct, regulate or command itself.", options:["Both A and D","Control system","Open-loop","Close-loop"], correct:1},
{type:"mcq", q:"The PLC's can be programmed in.", options:["Instruction list, Functional block diagram","All of the above","Ladder logic, structured text","Sequential function chart"], correct:1},
{type:"mcq", q:"How many operation steps does the programmable logic controller have?", options:["Three","Four","One","Two"], correct:1},
{type:"mcq", q:"The standard form of PLC is ______.", options:["Pressure Load Controller","None of the above","Programmable Logic Controller","Programmable Load Controller"], correct:2},
{type:"notice", text:"⚠️ الأسئلة الأربعة التالية إجاباتها غير مؤكدة نصياً من المصادر المرفقة (Lec1–Lec10) — الإجابة المذكورة هي استنتاج منطقي غير موثّق حرفياً، يُنصح بمراجعتها يدويًا مع المحاضر أو المرجع الأصلي قبل الاعتماد عليها."},
{type:"mcq", q:"Which of the following is NOT a type of output module?", options:["Analog","Digital encoder","Discrete","Specialty"], correct:1},
{type:"mcq", q:"What does the term \"sinking\" refer to in PLC I/O?", options:["Current flows out of the module","Current flows into the module","The module is isolated","None of the above"], correct:1},
{type:"mcq", q:"In the water level storage tank, the manual mode program controls the water level by monitoring the switch input.", options:["High sensor switch","None of the above","Both","Low sensor switch"], correct:3},
{type:"mcq", q:"The programmable logic controllers are classified into ______ according to physical size in modular type PLC.", options:["Nano PLC, Mini PLC, Macro PLC","None of the above","Micro PLC, Nano PLC","Mini PLC, Micro PLC"], correct:2},

// ================= أسئلة المطابقة (Matching) =================
{type:"match", q:"Match the following terms with their definitions:",
 left:[
   "RTD",
   "PLC",
   "Thermocouple",
   "Reed Switch",
   "RAM",
   "Cylinder",
   "Potentiometer",
   "Encoder",
   "Octal",
   "Ladder Diagram",
   "Solenoid",
   "LVDT",
   "Binary",
   "ECC",
   "Hexadecimal"
 ],
 right:[
   "Changes resistance with temperature",
   "Programmable Logic Controller",
   "Measures temperature using Seebeck effect",
   "Opens or closes based on magnetic field",
   "Memory for user program",
   "Device that converts fluid power into linear motion",
   "Variable resistor with moving contact",
   "Converts mechanical motion into electrical signals",
   "Base-8 number system",
   "PLC programming language",
   "Converts electrical signal to physical movement",
   "Converts linear motion to electrical",
   "Base-2 number system",
   "Electromagnetic Control Circuit",
   "Based on 16 digits/symbols"
 ]
}
];

/* Arabic translations keyed by exact English text (question / option strings).
   Falls back to the original English string if no translation exists (still functional). */
const AR = {
// ---- Fill in the blank ----
"In PLC programming, ______ is used for Boolean type data representing on/off values.":"في برمجة الـ PLC، يُستخدم ______ لنوع البيانات المنطقية (Boolean) الذي يمثل قيم التشغيل/الإيقاف.",
"Bool":"Bool",
"______ isolation is a key advantage of electromagnetic control circuits, providing safety between control and load circuits.":"العزل ______ هو ميزة رئيسية لدوائر التحكم الكهرومغناطيسية، حيث يوفر أمانًا بين دائرة التحكم ودائرة الحمل.",
"Electrical":"Electrical",
"The three main buses in a PLC are the data bus, ______ bus, and control bus.":"النواقل (buses) الثلاثة الرئيسية في الـ PLC هي ناقل البيانات، وناقل ______، وناقل التحكم.",
"address":"address",
"In the binary number system, the two digits used are 0 and ______.":"في نظام الأعداد الثنائي، الرقمان المستخدمان هما 0 و ______.",
"1":"1",
"A ______ switch uses two strips of different metals bonded together to detect temperature changes.":"يستخدم المفتاح ______ شريطين من معدنين مختلفين مرتبطين معًا لاكتشاف تغيرات درجة الحرارة.",
"bimetallic":"bimetallic",
"The ______ is the part of the CPU that performs data manipulation and logic operations such as AND and OR.":"الـ ______ هو الجزء من المعالج (CPU) الذي يقوم بمعالجة البيانات وعمليات المنطق مثل AND و OR.",
"ALU":"ALU",
"______ is the term used for the group of bits constituting some information in a PLC.":"______ هو المصطلح المستخدم لمجموعة البتات (bits) التي تشكل معلومة ما في الـ PLC.",
"Byte":"Byte",
"______ output modules send out a varying current or voltage signal, unlike discrete outputs which are simply ON/OFF.":"وحدات الخرج ______ ترسل إشارة تيار أو جهد متغيرة، بخلاف الخرج المتقطع (discrete) الذي يكون فقط تشغيل/إيقاف.",
"Analog":"Analog",
"A ______ is a pulse-driven motor that changes angular position in steps.":"الـ ______ هو محرك يعمل بالنبضات ويغيّر موضعه الزاوي على شكل خطوات.",
"stepper motor":"stepper motor",
"The two's complement of a binary number is obtained by adding ______ to the one's complement.":"يتم الحصول على متمم الاثنين (two's complement) لعدد ثنائي بإضافة ______ إلى متمم الواحد.",
"A ______ is an electrically operated switch that uses a low-power signal to control a high-power circuit.":"الـ ______ هو مفتاح يعمل كهربائيًا ويستخدم إشارة منخفضة القدرة للتحكم في دائرة عالية القدرة.",
"relay":"relay",
"In a PLC, the ______ memory is used for the user's program.":"في الـ PLC، تُستخدم ذاكرة ______ لتخزين برنامج المستخدم.",
"RAM":"RAM",
"A ______ switch has its contacts open in the absence of mechanical input and closes when mechanical input is applied.":"المفتاح ______ تكون أطرافه مفتوحة في حال عدم وجود إدخال ميكانيكي، وتُغلق عند تطبيق الإدخال الميكانيكي.",
"normally open":"normally open",
"A ______ is a directional control valve with 5 ports and 2 positions commonly used in pneumatic systems.":"الـ ______ هو صمام تحكم اتجاهي له 5 منافذ ووضعين، يُستخدم عادة في الأنظمة الهوائية (pneumatic).",
"5/2-way valve":"5/2-way valve",
"The ______ effect is the physical phenomenon where a temperature gradient in a conductor creates a voltage, used in thermocouples.":"تأثير ______ هو الظاهرة الفيزيائية التي يؤدي فيها تدرج درجة الحرارة في موصل إلى توليد جهد كهربائي، ويُستخدم في المزدوجات الحرارية (thermocouples).",
"Seebeck":"Seebeck",
"The hexadecimal number 1D in binary is ______.":"العدد السداسي عشري 1D بالنظام الثنائي هو ______.",
"00011101":"00011101",
"A ______ is a control device that automatically opens or closes an electrical circuit when a specific fluid or gas pressure threshold is reached.":"الـ ______ هو جهاز تحكم يفتح أو يغلق دائرة كهربائية تلقائيًا عند بلوغ عتبة معينة من ضغط سائل أو غاز.",
"pressure switch":"pressure switch",
"In signed binary numbers, the most significant bit is used to indicate the ______ of the number.":"في الأعداد الثنائية ذات الإشارة، تُستخدم البتة الأكثر أهمية (MSB) للدلالة على ______ العدد.",
"sign":"sign",
"The binary number 11010110 in octal is ______.":"العدد الثنائي 11010110 بالنظام الثماني هو ______.",
"326":"326",
"A ______ is a sensor that measures mechanical deformation by converting physical force into a proportional change in electrical resistance.":"الـ ______ هو مستشعر يقيس التشوه الميكانيكي عن طريق تحويل القوة الفيزيائية إلى تغيّر متناسب في المقاومة الكهربائية.",
"strain gauge":"strain gauge",

// ---- MCQ / True-False ----
"Which number system is commonly used for input and output addresses in PLCs?":"ما نظام الأعداد الشائع استخدامه لعناوين الدخل والخرج في أجهزة الـ PLC؟",
"Hexadecimal":"سداسي عشري (Hexadecimal)",
"Decimal":"عشري (Decimal)",
"Binary":"ثنائي (Binary)",
"Octal":"ثماني (Octal)",
"The one's complement of the binary number 101101 is:":"متمم الواحد (one's complement) للعدد الثنائي 101101 هو:",
"010011":"010011","010010":"010010","101101":"101101","110110":"110110",
"The system bus is used for communications between the input/output ports and the input/output unit.":"يُستخدم ناقل النظام (system bus) للاتصال بين منافذ الدخل/الخرج ووحدة الدخل/الخرج.",
"True":"صح","False":"خطأ",
"Which type of motor produces rotation in steps for each digital pulse received?":"أي نوع من المحركات ينتج دورانًا على شكل خطوات مقابل كل نبضة رقمية يستقبلها؟",
"Brushless DC motor":"محرك تيار مستمر بدون فرش (Brushless DC)","AC motor":"محرك تيار متردد (AC)","Stepper motor":"محرك خطوي (Stepper)","DC motor":"محرك تيار مستمر (DC)",
"What is the denary equivalent of the binary number 11111?":"ما المكافئ العشري للعدد الثنائي 11111؟",
"63":"63","31":"31","15":"15","32":"32",
"Relay output modules are faster than solid-state output modules.":"وحدات الخرج ذات المرحل (Relay) أسرع من وحدات الخرج ذات الحالة الصلبة (Solid-state).",
"Which of the following is NOT a typical control system task?":"أي مما يلي ليس من المهام النموذجية لنظام التحكم؟",
"Generate random outputs":"توليد مخرجات عشوائية","Maintain some variable constant":"إبقاء متغير ما ثابتًا","Follow some prescribed change":"اتباع تغيّر محدد مسبقًا","Control a sequence of events":"التحكم في تسلسل الأحداث",
"Which type of sensor uses eddy currents to detect metallic objects?":"أي نوع من المستشعرات يستخدم التيارات الدوامية (eddy currents) للكشف عن الأجسام المعدنية؟",
"Reed switch":"مفتاح قصبي (Reed switch)","Inductive proximity switch":"مفتاح قرب حثي (Inductive proximity)","Capacitive proximity switch":"مفتاح قرب سعوي (Capacitive proximity)","Photoelectric sensor":"مستشعر ضوئي (Photoelectric)",
"In a 2/2-way valve, what do the numbers represent?":"في صمام 2/2، ماذا يمثل الرقمان؟",
"2 ports and 2 solenoids":"منفذان وملفان لولبيان","None of the above":"لا شيء مما سبق","2 ports and 2 positions":"منفذان ووضعان","2 positions and 2 pressures":"وضعان وضغطان",
"The hexadecimal system uses digits 0-9 and letters A-F, making it a base-12 system.":"يستخدم النظام السداسي عشري الأرقام 0-9 والحروف A-F، مما يجعله نظامًا أساسه 12.",
"A solenoid is best described as:":"يوصف الملف اللولبي (solenoid) بأنه:",
"An output device that converts electrical signals into physical movement":"جهاز خرج يحوّل الإشارات الكهربائية إلى حركة فيزيائية","A communication protocol":"بروتوكول اتصال","An input device that detects temperature":"جهاز دخل يكتشف درجة الحرارة","A memory storage device":"جهاز تخزين ذاكرة",
"What does the term \"interposing relay\" refer to?":"إلى ماذا يشير مصطلح \"المرحل الوسيط\" (interposing relay)؟",
"A relay used for analog signals":"مرحل يُستخدم للإشارات التناظرية","A relay inside the PLC":"مرحل داخل الـ PLC","A relay placed between the output point and the load to switch higher current":"مرحل يوضع بين نقطة الخرج والحمل لتبديل تيار أعلى","A relay used for communication":"مرحل يُستخدم للاتصالات",
"What is the range of unsigned 16-bit integer numbers in PLCs?":"ما مدى الأعداد الصحيحة غير الموقّعة ذات 16 بت في أجهزة الـ PLC؟",
"0 to 32767":"0 إلى 32767","-65535 to +65535":"-65535 إلى +65535","-32768 to +32767":"-32768 إلى +32767","0 to 65535":"0 إلى 65535",
"A solenoid valve is an input device that sends signals to the PLC.":"الصمام اللولبي (solenoid valve) هو جهاز دخل يرسل إشارات إلى الـ PLC.",
"Which of the following is a type of photoelectric sensor configuration?":"أي مما يلي يُعد نوعًا من تهيئة المستشعر الضوئي؟",
"Diffuse":"انتشاري (Diffuse)","Through-beam":"شعاع نافذ (Through-beam)","Retroreflective":"عاكس رجعي (Retroreflective)","All of the above":"كل ما سبق",
"Which memory type is used for permanent storage of the operating system in a PLC?":"أي نوع ذاكرة يُستخدم للتخزين الدائم لنظام التشغيل في الـ PLC؟",
"ROM":"ROM","Cache":"ذاكرة تخزين مؤقت (Cache)","EPROM":"EPROM",
"Analog output modules send out a varying current or voltage signal.":"ترسل وحدات الخرج التناظري (Analog) إشارة تيار أو جهد متغيرة.",
"The term \"PWM\" in motor control stands for:":"مصطلح \"PWM\" في التحكم بالمحركات يرمز إلى:",
"Programmable Wave Module":"وحدة موجة قابلة للبرمجة","Power Wave Modulation":"تضمين الموجة الكهربائية","Power Width Management":"إدارة عرض القدرة","Pulse Width Modulation":"تضمين عرض النبضة (PWM)",
"In binary arithmetic, 1 + 1 = 10.":"في الحساب الثنائي، 1 + 1 = 10.",
"What voltage is commonly used for PLC solenoid valves?":"ما الجهد الشائع استخدامه لصمامات الـ PLC اللولبية؟",
"12V AC":"12 فولت متردد","48V AC":"48 فولت متردد","5V DC":"5 فولت مستمر","24V DC":"24 فولت مستمر",
"A 5/2-way directional control valve has:":"صمام التحكم الاتجاهي 5/2 يحتوي على:",
"2 ports and 5 positions":"منفذان و5 أوضاع","5 positions and 2 ports":"5 أوضاع ومنفذان","5 ports and 2 positions":"5 منافذ ووضعان",
"A Normally Open (NO) contact is closed when the relay is de-energized.":"التماس المفتوح طبيعيًا (NO) يكون مغلقًا عندما يكون المرحل غير مُنشّط.",
"A relay and a switch both operate in exactly the same way and require manual intervention to open or close a circuit.":"يعمل المرحل والمفتاح بنفس الطريقة تمامًا ويتطلبان تدخلًا يدويًا لفتح أو إغلاق الدائرة.",
"Thermocouples work based on the Seebeck effect, where a temperature gradient in a conductor creates a voltage.":"تعمل المزدوجات الحرارية (Thermocouples) بناءً على تأثير سيبك، حيث يولّد تدرج درجة الحرارة في الموصل جهدًا كهربائيًا.",
"In the binary number 1010, what is the most significant bit (MSB)?":"في العدد الثنائي 1010، ما البتة الأكثر أهمية (MSB)؟",
"0":"0",
"Both 1 and 0":"كل من 1 و0",
"In the binary system, the least significant bit (LSB) is the bit at the left-hand end of the number.":"في النظام الثنائي، البتة الأقل أهمية (LSB) هي البتة الموجودة في الطرف الأيسر من العدد.",
"What type of output uses a transistor to switch current through an external circuit?":"أي نوع من الخرج يستخدم الترانزستور لتبديل التيار عبر دائرة خارجية؟",
"Triac output":"خرج ترياك (Triac)","Analog output":"خرج تناظري (Analog)","Relay output":"خرج مرحل (Relay)","Transistor output":"خرج ترانزستور (Transistor)",
"What is the hexadecimal equivalent of the decimal number 156?":"ما المكافئ السداسي عشري للعدد العشري 156؟",
"A6":"A6","9C":"9C","156":"156","9B":"9B",
"A PLC (Programmable Logic Controller) is a specialized digital computer used in industrial automation to control and monitor various machines and processes.":"الـ PLC (وحدة التحكم المنطقي القابلة للبرمجة) هو حاسوب رقمي متخصص يُستخدم في الأتمتة الصناعية للتحكم بمختلف الآلات والعمليات ومراقبتها.",
"Electromagnetic Control Circuits (ECC) use high-voltage signals to control low-power loads.":"تستخدم دوائر التحكم الكهرومغناطيسية (ECC) إشارات عالية الجهد للتحكم في أحمال منخفضة القدرة.",
"What is the octal equivalent of the binary number 100111010?":"ما المكافئ الثماني للعدد الثنائي 100111010؟",
"232":"232","462":"462","476":"476","472":"472",
"A double-acting cylinder uses fluid to push the piston in both directions.":"الأسطوانة ثنائية الفعل تستخدم السائل لدفع المكبس في كلا الاتجاهين.",
"A Resistance Temperature Detector (RTD) works by:":"يعمل كاشف درجة الحرارة المقاوم (RTD) عن طريق:",
"Generating light with temperature":"توليد ضوء مع تغير درجة الحرارة","Changing electrical resistance with temperature":"تغيير المقاومة الكهربائية مع درجة الحرارة","Generating voltage from temperature differences":"توليد جهد من فروق درجة الحرارة","Changing capacitance with temperature":"تغيير السعة الكهربائية مع درجة الحرارة",
"The octal number system is based on 8 digits: 0, 1, 2, 3, 4, 5, 6, 7.":"يعتمد نظام الأعداد الثماني على 8 أرقام: 0، 1، 2، 3، 4، 5، 6، 7.",
"Which of the following is a disadvantage of electromagnetic relays?":"أي مما يلي يُعد عيبًا للمرحلات الكهرومغناطيسية؟",
"They can switch multiple contacts simultaneously":"يمكنها تبديل عدة تماسات في آن واحد","They have limited mechanical lifespan":"لها عمر ميكانيكي محدود","They provide electrical isolation":"توفر عزلًا كهربائيًا","They have high tolerance to voltage spikes":"لها تحمل عالٍ لطفرات الجهد",
"What does PLC stand for?":"ماذا يرمز اختصار PLC؟",
"Programmable Logic Computer":"حاسوب منطقي قابل للبرمجة","Programmable Linear Controller":"وحدة تحكم خطية قابلة للبرمجة","Process Logic Controller":"وحدة تحكم منطقي للعمليات","Programmable Logic Controller":"وحدة تحكم منطقي قابلة للبرمجة",
"The two's complement of a binary number is obtained by changing all 1s to 0s and all 0s to 1s.":"يتم الحصول على متمم الاثنين لعدد ثنائي بتغيير جميع الآحاد إلى أصفار وجميع الأصفار إلى آحاد.",
"What is the function of the address bus in a PLC?":"ما وظيفة ناقل العناوين (address bus) في الـ PLC؟",
"Carry addresses of memory locations":"نقل عناوين مواقع الذاكرة","Provide power to the CPU":"توفير الطاقة للمعالج","Carry data used in processing":"نقل البيانات المستخدمة في المعالجة","Carry control signals":"نقل إشارات التحكم",
"In PLC operation ______ retrieves the data into an output module.":"في عملية الـ PLC، تقوم ______ باسترجاع البيانات إلى وحدة الخرج.",
"Input scan":"مسح الدخل (Input scan)","Program scan":"مسح البرنامج (Program scan)","Output scan":"مسح الخرج (Output scan)",
"In which control system feedback is available?":"في أي نظام تحكم تتوفر التغذية الراجعة (feedback)؟",
"Close-loop":"حلقة مغلقة (Closed-loop)","Open-loop":"حلقة مفتوحة (Open-loop)","Both A and D":"كل من A و D",
"In PLC the user can write the programs with the help of ______.":"في الـ PLC، يمكن للمستخدم كتابة البرامج بمساعدة ______.",
"Sensing devices":"أجهزة استشعار","Programming devices":"أجهزة برمجة","Optical isolation":"عزل ضوئي",
"What are the types of programmable logic controllers?":"ما أنواع وحدات التحكم المنطقي القابلة للبرمجة؟",
"Fixed and Modular PLC":"PLC ثابت ومعياري (Modular)","Modular, uniform PLC":"PLC معياري وموحّد","Fixed, uniform PLC":"PLC ثابت وموحّد",
"Relays is a ______ device.":"المرحلات هي جهاز ______.",
"Mechanical devices":"جهاز ميكانيكي","Electromechanical devices":"جهاز كهروميكانيكي","Electrical devices":"جهاز كهربائي",
"Relays are used in ______.":"تُستخدم المرحلات في ______.",
"Refrigerators":"الثلاجات","Water heaters":"سخانات المياه","Washing machines":"الغسالات",
"Which one is the oldest programming language?":"أي مما يلي هو أقدم لغة برمجة؟",
"Structured text programming":"البرمجة النصية المهيكلة (Structured Text)","Function block diagram":"مخطط كتل الدالة (FBD)","Ladder logic":"منطق السلم (Ladder Logic)",
"The ladder logic in PLC consists of.":"يتكون منطق السلم (Ladder Logic) في الـ PLC من.",
"Logic gates":"بوابات منطقية","Relay contacts and coils":"تماسات وملفات المرحلات","Relays":"مرحلات","Functional blocks":"كتل وظيفية",
"In PLC operation ______ checks the status at the input side.":"في عملية الـ PLC، تتحقق ______ من الحالة عند جانب الدخل.",
"What are the elements of ladder logic?":"ما عناصر منطق السلم (Ladder Logic)؟",
"Normally open (contact)":"تماس مفتوح طبيعيًا (NO)","Normally Close (contact)":"تماس مغلق طبيعيًا (NC)","Both of the above":"كلاهما معًا",
"Which one is the correct sequence for PLC operation?":"ما التسلسل الصحيح لعملية الـ PLC؟",
"Self-test, input scan, logic scan, output scan":"اختبار ذاتي، مسح دخل، مسح منطق، مسح خرج","Self-test, input scan, output scan, logic scan":"اختبار ذاتي، مسح دخل، مسح خرج، مسح منطق","Self-test, logic scan, output scan, input scan":"اختبار ذاتي، مسح منطق، مسح خرج، مسح دخل",
"What is the standard form of IEC?":"ما الصيغة القياسية لاختصار IEC؟",
"International Electrotechnical Commission":"اللجنة الكهروتقنية الدولية","International Electrical Commission":"اللجنة الكهربائية الدولية",
"What is the standard form of FBD?":"ما الصيغة القياسية لاختصار FBD؟",
"First Block Diagram":"مخطط الكتلة الأولى","Functional Block Division":"تقسيم الكتلة الوظيفية","Functional Block Diagram":"مخطط الكتلة الوظيفية",
"Before PLC's was created many industries used ______.":"قبل ابتكار الـ PLC، استخدمت العديد من الصناعات ______.",
"Resistors":"مقاومات","Capacitors":"مكثفات",
"In modular type PLC, the PLC's are classified into ______.":"في نوع الـ PLC المعياري (Modular)، تُصنَّف وحدات التحكم إلى ______.",
"Triac output PLC":"PLC خرج ترياك","Relay output PLC":"PLC خرج مرحل","Transistor output PLC":"PLC خرج ترانزستور",
"Which mode accepts signals from sensors?":"أي وضع يستقبل الإشارات من المستشعرات؟",
"Both":"كلاهما","Input module":"وحدة الدخل","Output modular":"وحدة الخرج",
"______ are the components that are required to change or create a program.":"______ هي المكونات المطلوبة لتغيير أو إنشاء برنامج.",
"Connector cable":"كابل توصيل","Programming software":"برنامج البرمجة","PLC, programming device":"جهاز الـ PLC وجهاز البرمجة",
"What are the components that are used to make relay ______.":"ما المكونات المستخدمة لصنع المرحل ______.",
"Armature":"الصمام المتحرك (Armature)","Spring":"نابض (Spring)","Electromagnet":"مغناطيس كهربائي (Electromagnet)",
"What are the components that make the programmable logic controller work?":"ما المكونات التي تجعل وحدة التحكم المنطقي القابلة للبرمجة تعمل؟",
"Power supply":"مصدر الطاقة","Input and output module":"وحدة الدخل والخرج","CPU":"المعالج (CPU)",
"The system that is used to direct, regulate or command itself.":"النظام الذي يُستخدم لتوجيه أو تنظيم أو التحكم بنفسه.",
"Control system":"نظام تحكم",
"The PLC's can be programmed in.":"يمكن برمجة أجهزة الـ PLC باستخدام.",
"Instruction list, Functional block diagram":"قائمة التعليمات، مخطط الكتلة الوظيفية","Ladder logic, structured text":"منطق السلم، النص المهيكل","Sequential function chart":"مخطط الدالة المتسلسلة (SFC)",
"How many operation steps does the programmable logic controller have?":"كم عدد خطوات التشغيل التي تمتلكها وحدة التحكم المنطقي القابلة للبرمجة؟",
"Three":"ثلاثة","Four":"أربعة","One":"واحد","Two":"اثنان",
"The standard form of PLC is ______.":"الصيغة القياسية لاختصار PLC هي ______.",
"Pressure Load Controller":"وحدة تحكم بحمل الضغط","Programmable Load Controller":"وحدة تحكم بالحمل قابلة للبرمجة",
"Which of the following is NOT a type of output module?":"أي مما يلي ليس نوعًا من وحدات الخرج؟",
"Digital encoder":"مشفر رقمي (Digital encoder)","Discrete":"متقطع (Discrete)","Specialty":"متخصص (Specialty)",
"What does the term \"sinking\" refer to in PLC I/O?":"إلى ماذا يشير مصطلح \"sinking\" في دخل/خرج الـ PLC؟",
"Current flows out of the module":"يتدفق التيار خارج الوحدة","Current flows into the module":"يتدفق التيار داخل الوحدة","The module is isolated":"الوحدة معزولة",
"In the water level storage tank, the manual mode program controls the water level by monitoring the switch input.":"في خزان تخزين مستوى الماء، يتحكم برنامج الوضع اليدوي بمستوى الماء عن طريق مراقبة دخل المفتاح.",
"High sensor switch":"مفتاح مستشعر عالي","Low sensor switch":"مفتاح مستشعر منخفض",
"The programmable logic controllers are classified into ______ according to physical size in modular type PLC.":"تُصنَّف وحدات التحكم المنطقي القابلة للبرمجة إلى ______ حسب الحجم الفيزيائي في نوع الـ PLC المعياري.",
"Nano PLC, Mini PLC, Macro PLC":"PLC نانو، PLC صغير، PLC كبير","Micro PLC, Nano PLC":"PLC دقيق، PLC نانو","Mini PLC, Micro PLC":"PLC صغير، PLC دقيق",

// ---- Matching ----
"Match the following terms with their definitions:":"طابق المصطلحات التالية مع تعريفاتها:",
"RTD":"RTD","PLC":"PLC","Thermocouple":"مزدوجة حرارية (Thermocouple)","Reed Switch":"مفتاح قصبي (Reed Switch)",
"Cylinder":"أسطوانة (Cylinder)","Potentiometer":"جهد متغير (Potentiometer)","Encoder":"مشفر (Encoder)",
"Ladder Diagram":"مخطط السلم (Ladder Diagram)","Solenoid":"ملف لولبي (Solenoid)","LVDT":"LVDT","ECC":"ECC",

"Changes resistance with temperature":"يغيّر المقاومة مع درجة الحرارة",
"Measures temperature using Seebeck effect":"يقيس درجة الحرارة باستخدام تأثير سيبك",
"Opens or closes based on magnetic field":"يفتح أو يغلق بناءً على المجال المغناطيسي",
"Memory for user program":"ذاكرة لبرنامج المستخدم",
"Device that converts fluid power into linear motion":"جهاز يحوّل قدرة السائل إلى حركة خطية",
"Variable resistor with moving contact":"مقاومة متغيرة بتماس متحرك",
"Converts mechanical motion into electrical signals":"يحوّل الحركة الميكانيكية إلى إشارات كهربائية",
"Base-8 number system":"نظام أعداد أساسه 8",
"PLC programming language":"لغة برمجة الـ PLC",
"Converts electrical signal to physical movement":"يحوّل الإشارة الكهربائية إلى حركة فيزيائية",
"Converts linear motion to electrical":"يحوّل الحركة الخطية إلى إشارة كهربائية",
"Base-2 number system":"نظام أعداد أساسه 2",
"Electromagnetic Control Circuit":"دائرة تحكم كهرومغناطيسية",
"Based on 16 digits/symbols":"يعتمد على 16 رقمًا/رمزًا"
};
