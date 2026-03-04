// ============================================
// ROADMAP DATA - Learning Roadmaps
// ============================================

export const roadmaps = [
  {
    id: 'math',
    title: 'الرياضيات',
    titleEn: 'Mathematics',
    description: 'تعلم الرياضيات من الأساسيات حتى التفاضل والتكامل',
    icon: '📐',
    color: '#6c5ce7',
    colorSecondary: '#a29bfe',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    steps: [
      {
        id: 'math-1',
        order: 1,
        title: 'الأساسيات والأعداد',
        description: 'تعلم أنظمة الأعداد، العمليات الحسابية الأساسية، الكسور، والنسب المئوية. هذه هي اللبنة الأولى لفهم الرياضيات.',
        resources: [
          {
            type: 'video',
            title: 'أساسيات الرياضيات - الأعداد والعمليات',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'الكسور والنسب المئوية بسهولة',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'شرح شامل للأعداد الصحيحة والعشرية',
            url: 'https://www.khanacademy.org/math/arithmetic',
            platform: 'Khan Academy'
          }
        ],
        quiz: [
          {
            question: 'ما هو ناتج 15 × 4 ÷ 2؟',
            options: ['20', '30', '40', '60'],
            correct: 1
          },
          {
            question: 'ما هو الكسر المكافئ لـ 0.75؟',
            options: ['1/2', '2/3', '3/4', '4/5'],
            correct: 2
          },
          {
            question: 'ما هي النسبة المئوية لـ 3 من 12؟',
            options: ['20%', '25%', '30%', '35%'],
            correct: 1
          }
        ]
      },
      {
        id: 'math-2',
        order: 2,
        title: 'الجبر الأساسي',
        description: 'تعلم المتغيرات، المعادلات من الدرجة الأولى والثانية، وحل أنظمة المعادلات. الجبر هو لغة الرياضيات.',
        resources: [
          {
            type: 'video',
            title: 'مقدمة في الجبر - المتغيرات والمعادلات',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'حل المعادلات من الدرجة الثانية',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'الجبر خطوة بخطوة',
            url: 'https://www.khanacademy.org/math/algebra',
            platform: 'Khan Academy'
          }
        ],
        quiz: [
          {
            question: 'إذا كانت 2x + 6 = 20، فما قيمة x؟',
            options: ['5', '7', '8', '10'],
            correct: 1
          },
          {
            question: 'ما هو حل المعادلة x² = 49؟',
            options: ['x = 7', 'x = ±7', 'x = -7', 'x = 49'],
            correct: 1
          },
          {
            question: 'ما هي قيمة 3(x + 2) إذا كانت x = 4؟',
            options: ['14', '18', '12', '10'],
            correct: 1
          }
        ]
      },
      {
        id: 'math-3',
        order: 3,
        title: 'الهندسة',
        description: 'تعلم الأشكال الهندسية، المساحات، الحجوم، نظرية فيثاغورس، والتحويلات الهندسية.',
        resources: [
          {
            type: 'video',
            title: 'أساسيات الهندسة - الأشكال والمساحات',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'نظرية فيثاغورس وتطبيقاتها',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'الهندسة الفراغية والأبعاد',
            url: 'https://www.khanacademy.org/math/geometry',
            platform: 'Khan Academy'
          }
        ],
        quiz: [
          {
            question: 'ما هي مساحة مستطيل بطول 8 وعرض 5؟',
            options: ['26', '40', '13', '35'],
            correct: 1
          },
          {
            question: 'في مثلث قائم الزاوية، إذا كانت الأضلاع 3 و 4، فما هو الوتر؟',
            options: ['6', '7', '5', '8'],
            correct: 2
          },
          {
            question: 'ما هو محيط دائرة نصف قطرها 7؟ (π ≈ 22/7)',
            options: ['44', '22', '154', '36'],
            correct: 0
          }
        ]
      },
      {
        id: 'math-4',
        order: 4,
        title: 'حساب المثلثات',
        description: 'تعلم الدوال المثلثية (جيب، جيب تمام، ظل)، المتطابقات المثلثية، وتطبيقاتها العملية.',
        resources: [
          {
            type: 'video',
            title: 'مقدمة في حساب المثلثات',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'الدوال المثلثية وتطبيقاتها',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'حساب المثلثات من الصفر',
            url: 'https://www.khanacademy.org/math/trigonometry',
            platform: 'Khan Academy'
          }
        ],
        quiz: [
          {
            question: 'ما هي قيمة sin(90°)؟',
            options: ['0', '1', '-1', '0.5'],
            correct: 1
          },
          {
            question: 'ما هي قيمة cos(0°)؟',
            options: ['0', '-1', '1', '0.5'],
            correct: 2
          },
          {
            question: 'ما هي قيمة tan(45°)؟',
            options: ['0', '1', '√2', '√3'],
            correct: 1
          }
        ]
      },
      {
        id: 'math-5',
        order: 5,
        title: 'التفاضل والتكامل',
        description: 'تعلم مفهوم النهايات، الاشتقاق، التكامل، وتطبيقاتهما في حساب المساحات والسرعات.',
        resources: [
          {
            type: 'video',
            title: 'مقدمة في التفاضل - النهايات والاشتقاق',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'التكامل وتطبيقاته',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'التفاضل والتكامل للمبتدئين',
            url: 'https://www.khanacademy.org/math/calculus-1',
            platform: 'Khan Academy'
          }
        ],
        quiz: [
          {
            question: 'ما هو مشتق الدالة f(x) = x²؟',
            options: ['x', '2x', '2x²', 'x²'],
            correct: 1
          },
          {
            question: 'ما هو تكامل 2x؟',
            options: ['x²', 'x² + C', '2x²', '2x² + C'],
            correct: 1
          },
          {
            question: 'ما هي نهاية (x² - 1)/(x - 1) عندما x→1؟',
            options: ['0', '1', '2', 'غير موجودة'],
            correct: 2
          }
        ]
      }
    ]
  },
  {
    id: 'german',
    title: 'اللغة الألمانية',
    titleEn: 'German Language',
    description: 'تعلم اللغة الألمانية من الصفر حتى المحادثة والكتابة',
    icon: '🇩🇪',
    color: '#00cec9',
    colorSecondary: '#55efc4',
    gradient: 'linear-gradient(135deg, #00cec9, #55efc4)',
    steps: [
      {
        id: 'german-1',
        order: 1,
        title: 'الحروف والنطق',
        description: 'تعلم الأبجدية الألمانية (Das Alphabet)، قواعد النطق الصحيح، والأصوات الخاصة مثل ä, ö, ü, ß.',
        resources: [
          {
            type: 'video',
            title: 'الأبجدية الألمانية - Das deutsche Alphabet',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'النطق الصحيح للحروف الألمانية',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'دليل النطق الألماني الشامل',
            url: 'https://www.duolingo.com/course/de/en/Learn-German',
            platform: 'Duolingo'
          }
        ],
        quiz: [
          {
            question: 'كم عدد حروف الأبجدية الألمانية (مع الحروف الخاصة)؟',
            options: ['26', '28', '30', '32'],
            correct: 2
          },
          {
            question: 'ما هو الحرف الألماني الذي يُنطق مثل "إس تسيت"؟',
            options: ['ä', 'ö', 'ü', 'ß'],
            correct: 3
          },
          {
            question: 'كيف يُنطق الحرف "W" في الألمانية؟',
            options: ['واو', 'فاو', 'فيه', 'فاي'],
            correct: 1
          }
        ]
      },
      {
        id: 'german-2',
        order: 2,
        title: 'القواعد الأساسية',
        description: 'تعلم تركيب الجملة الألمانية، الضمائر الشخصية، تصريف الأفعال في المضارع، وأدوات التعريف والتنكير.',
        resources: [
          {
            type: 'video',
            title: 'تركيب الجملة الألمانية - Satzbau',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'تصريف الأفعال الألمانية في المضارع',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'القواعد الألمانية الأساسية',
            url: 'https://www.goethe.de/de/spr/ueb.html',
            platform: 'Goethe Institut'
          }
        ],
        quiz: [
          {
            question: 'ما هو ترتيب الجملة الأساسية في الألمانية؟',
            options: [
              'فاعل - مفعول - فعل',
              'فعل - فاعل - مفعول',
              'فاعل - فعل - مفعول',
              'مفعول - فعل - فاعل'
            ],
            correct: 2
          },
          {
            question: 'ما هي أداة التعريف المذكر في الألمانية؟',
            options: ['die', 'das', 'der', 'den'],
            correct: 2
          },
          {
            question: 'كيف نصرف الفعل "sein" مع "ich"؟',
            options: ['ist', 'bin', 'bist', 'sind'],
            correct: 1
          }
        ]
      },
      {
        id: 'german-3',
        order: 3,
        title: 'المفردات الأساسية',
        description: 'تعلم أهم 500 كلمة ألمانية شائعة: الأرقام، الألوان، الأيام، العائلة، الطعام، والأماكن.',
        resources: [
          {
            type: 'video',
            title: 'أهم 100 كلمة ألمانية للمبتدئين',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'المفردات الألمانية - الحياة اليومية',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'قائمة المفردات الأساسية A1',
            url: 'https://www.goethe.de/de/spr/ueb.html',
            platform: 'Goethe Institut'
          }
        ],
        quiz: [
          {
            question: 'ما معنى كلمة "Danke" بالعربية؟',
            options: ['مرحباً', 'شكراً', 'وداعاً', 'من فضلك'],
            correct: 1
          },
          {
            question: 'ما هي الترجمة الألمانية لكلمة "ماء"؟',
            options: ['Milch', 'Saft', 'Wasser', 'Tee'],
            correct: 2
          },
          {
            question: 'ما معنى "Guten Morgen"؟',
            options: ['مساء الخير', 'صباح الخير', 'تصبح على خير', 'مرحباً'],
            correct: 1
          }
        ]
      },
      {
        id: 'german-4',
        order: 4,
        title: 'المحادثة والحوار',
        description: 'تعلم التعبيرات اليومية، كيفية التعريف بالنفس، طلب الطعام، السؤال عن الاتجاهات، والمحادثات البسيطة.',
        resources: [
          {
            type: 'video',
            title: 'محادثات ألمانية للمبتدئين',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'التعريف بالنفس بالألمانية - Sich vorstellen',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'عبارات المحادثة اليومية',
            url: 'https://www.duolingo.com/course/de/en/Learn-German',
            platform: 'Duolingo'
          }
        ],
        quiz: [
          {
            question: 'كيف تقول "اسمي أحمد" بالألمانية؟',
            options: [
              'Ich heiße Ahmad',
              'Ich bin Ahmad',
              'Mein Name Ahmad',
              'كلا الخيارين A و B صحيح'
            ],
            correct: 3
          },
          {
            question: 'ما معنى "Wie geht es Ihnen?"',
            options: ['من أين أنت؟', 'كم عمرك؟', 'كيف حالك؟', 'ما اسمك؟'],
            correct: 2
          },
          {
            question: 'كيف تطلب الفاتورة في المطعم؟',
            options: [
              'Die Speisekarte, bitte',
              'Die Rechnung, bitte',
              'Ein Wasser, bitte',
              'Entschuldigung'
            ],
            correct: 1
          }
        ]
      },
      {
        id: 'german-5',
        order: 5,
        title: 'القراءة والكتابة',
        description: 'تطوير مهارات القراءة والكتابة: قراءة نصوص بسيطة، كتابة رسائل وإيميلات، وفهم القصص القصيرة.',
        resources: [
          {
            type: 'video',
            title: 'تعلم القراءة بالألمانية - نصوص بسيطة',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'video',
            title: 'كيف تكتب رسالة بالألمانية',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'YouTube'
          },
          {
            type: 'article',
            title: 'نصوص ألمانية للمبتدئين مع الترجمة',
            url: 'https://www.goethe.de/de/spr/ueb.html',
            platform: 'Goethe Institut'
          }
        ],
        quiz: [
          {
            question: 'ما هي صيغة البداية الرسمية للرسالة بالألمانية؟',
            options: [
              'Hallo',
              'Lieber/Liebe',
              'Sehr geehrte/r',
              'Hi'
            ],
            correct: 2
          },
          {
            question: 'ما معنى "Ich lese gern Bücher"؟',
            options: [
              'أنا أكتب كتباً',
              'أحب قراءة الكتب',
              'أشتري الكتب',
              'أبحث عن كتب'
            ],
            correct: 1
          },
          {
            question: 'كيف نختم رسالة رسمية بالألمانية؟',
            options: [
              'Tschüss',
              'Bis bald',
              'Mit freundlichen Grüßen',
              'Ciao'
            ],
            correct: 2
          }
        ]
      }
    ]
  }
];

export const getRoadmapById = (id) => {
  return roadmaps.find(r => r.id === id);
};

export const getStepById = (roadmapId, stepId) => {
  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) return null;
  return roadmap.steps.find(s => s.id === stepId);
};
