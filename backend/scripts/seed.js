const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const Step = require('../models/Step');
const Resource = require('../models/Resource');
const Question = require('../models/Question');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Roadmap.deleteMany({});
        await Step.deleteMany({});
        await Resource.deleteMany({});
        await Question.deleteMany({});

        // Create admin user
        const admin = await User.create({
            name: 'المدير',
            email: process.env.ADMIN_EMAIL || 'admin@roadmap.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123456',
            role: 'admin'
        });
        console.log(`✅ Admin created: ${admin.email}`);

        // ---- MATH ROADMAP ----
        const mathRoadmap = await Roadmap.create({
            title: 'الرياضيات',
            titleEn: 'Mathematics',
            description: 'تعلم الرياضيات من الأساسيات حتى التفاضل والتكامل',
            icon: '📐',
            color: '#6c5ce7',
            colorSecondary: '#a29bfe',
            gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            order: 1,
            createdBy: admin._id
        });

        const mathStepsData = [
            { title: 'الأساسيات والأعداد', description: 'تعلم أنظمة الأعداد، العمليات الحسابية الأساسية، الكسور، والنسب المئوية.', order: 1 },
            { title: 'الجبر الأساسي', description: 'تعلم المتغيرات، المعادلات من الدرجة الأولى والثانية، وحل أنظمة المعادلات.', order: 2 },
            { title: 'الهندسة', description: 'تعلم الأشكال الهندسية، المساحات، الحجوم، ونظرية فيثاغورس.', order: 3 },
            { title: 'حساب المثلثات', description: 'تعلم الدوال المثلثية، المتطابقات المثلثية، وتطبيقاتها.', order: 4 },
            { title: 'التفاضل والتكامل', description: 'تعلم النهايات، الاشتقاق، التكامل وتطبيقاتهما.', order: 5 }
        ];

        const mathResources = [
            [
                { title: 'أساسيات الرياضيات - الأعداد والعمليات', url: 'https://www.khanacademy.org/math/arithmetic', type: 'course', platform: 'Khan Academy' },
                { title: 'الكسور والنسب المئوية بسهولة', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'video', platform: 'YouTube' }
            ],
            [
                { title: 'مقدمة في الجبر', url: 'https://www.khanacademy.org/math/algebra', type: 'course', platform: 'Khan Academy' },
                { title: 'حل المعادلات من الدرجة الثانية', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'video', platform: 'YouTube' }
            ],
            [
                { title: 'أساسيات الهندسة', url: 'https://www.khanacademy.org/math/geometry', type: 'course', platform: 'Khan Academy' },
                { title: 'نظرية فيثاغورس', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'video', platform: 'YouTube' }
            ],
            [
                { title: 'مقدمة في حساب المثلثات', url: 'https://www.khanacademy.org/math/trigonometry', type: 'course', platform: 'Khan Academy' }
            ],
            [
                { title: 'التفاضل والتكامل للمبتدئين', url: 'https://www.khanacademy.org/math/calculus-1', type: 'course', platform: 'Khan Academy' }
            ]
        ];

        const mathQuestions = [
            [
                { question: 'ما هو ناتج 15 × 4 ÷ 2؟', options: ['20', '30', '40', '60'], correct: 1 },
                { question: 'ما هو الكسر المكافئ لـ 0.75؟', options: ['1/2', '2/3', '3/4', '4/5'], correct: 2 },
                { question: 'ما هي النسبة المئوية لـ 3 من 12؟', options: ['20%', '25%', '30%', '35%'], correct: 1 }
            ],
            [
                { question: 'إذا كانت 2x + 6 = 20، فما قيمة x؟', options: ['5', '7', '8', '10'], correct: 1 },
                { question: 'ما هو حل المعادلة x² = 49؟', options: ['x = 7', 'x = ±7', 'x = -7', 'x = 49'], correct: 1 },
                { question: 'ما هي قيمة 3(x + 2) إذا كانت x = 4؟', options: ['14', '18', '12', '10'], correct: 1 }
            ],
            [
                { question: 'ما هي مساحة مستطيل بطول 8 وعرض 5؟', options: ['26', '40', '13', '35'], correct: 1 },
                { question: 'في مثلث قائم الزاوية، إذا كانت الأضلاع 3 و 4، فما هو الوتر؟', options: ['6', '7', '5', '8'], correct: 2 },
                { question: 'ما هو محيط دائرة نصف قطرها 7؟', options: ['44', '22', '154', '36'], correct: 0 }
            ],
            [
                { question: 'ما هي قيمة sin(90°)؟', options: ['0', '1', '-1', '0.5'], correct: 1 },
                { question: 'ما هي قيمة cos(0°)؟', options: ['0', '-1', '1', '0.5'], correct: 2 },
                { question: 'ما هي قيمة tan(45°)؟', options: ['0', '1', '√2', '√3'], correct: 1 }
            ],
            [
                { question: 'ما هو مشتق الدالة f(x) = x²؟', options: ['x', '2x', '2x²', 'x²'], correct: 1 },
                { question: 'ما هو تكامل 2x؟', options: ['x²', 'x² + C', '2x²', '2x² + C'], correct: 1 },
                { question: 'ما هي نهاية (x² - 1)/(x - 1) عندما x→1؟', options: ['0', '1', '2', 'غير موجودة'], correct: 2 }
            ]
        ];

        for (let i = 0; i < mathStepsData.length; i++) {
            const step = await Step.create({ ...mathStepsData[i], roadmap: mathRoadmap._id, createdBy: admin._id });
            for (const r of mathResources[i]) {
                await Resource.create({ ...r, step: step._id, createdBy: admin._id });
            }
            for (let j = 0; j < mathQuestions[i].length; j++) {
                await Question.create({ ...mathQuestions[i][j], step: step._id, order: j, createdBy: admin._id });
            }
        }
        console.log('✅ Math roadmap seeded');

        // ---- GERMAN ROADMAP ----
        const germanRoadmap = await Roadmap.create({
            title: 'اللغة الألمانية',
            titleEn: 'German Language',
            description: 'تعلم اللغة الألمانية من الصفر حتى المحادثة والكتابة',
            icon: '🇩🇪',
            color: '#00cec9',
            colorSecondary: '#55efc4',
            gradient: 'linear-gradient(135deg, #00cec9, #55efc4)',
            order: 2,
            createdBy: admin._id
        });

        const germanStepsData = [
            { title: 'الحروف والنطق', description: 'تعلم الأبجدية الألمانية وقواعد النطق الصحيح والأصوات الخاصة.', order: 1 },
            { title: 'القواعد الأساسية', description: 'تعلم تركيب الجملة، الضمائر الشخصية، تصريف الأفعال في المضارع.', order: 2 },
            { title: 'المفردات الأساسية', description: 'تعلم أهم 500 كلمة ألمانية شائعة.', order: 3 },
            { title: 'المحادثة والحوار', description: 'تعلم التعبيرات اليومية والمحادثات البسيطة.', order: 4 },
            { title: 'القراءة والكتابة', description: 'تطوير مهارات القراءة والكتابة - نصوص بسيطة وكتابة رسائل.', order: 5 }
        ];

        const germanQuestions = [
            [
                { question: 'كم عدد حروف الأبجدية الألمانية (مع الحروف الخاصة)؟', options: ['26', '28', '30', '32'], correct: 2 },
                { question: 'ما هو الحرف "ß" يُنطق مثل؟', options: ['ss', 'sz', 'tz', 'zs'], correct: 0 },
                { question: 'كيف يُنطق الحرف "W" في الألمانية؟', options: ['واو', 'فاو', 'فيه', 'فاي'], correct: 1 }
            ],
            [
                { question: 'ما هو ترتيب الجملة الأساسية في الألمانية؟', options: ['فاعل - مفعول - فعل', 'فعل - فاعل - مفعول', 'فاعل - فعل - مفعول', 'مفعول - فعل - فاعل'], correct: 2 },
                { question: 'ما هي أداة التعريف المذكر في الألمانية؟', options: ['die', 'das', 'der', 'den'], correct: 2 },
                { question: 'كيف نصرف الفعل "sein" مع "ich"؟', options: ['ist', 'bin', 'bist', 'sind'], correct: 1 }
            ],
            [
                { question: 'ما معنى كلمة "Danke" بالعربية؟', options: ['مرحباً', 'شكراً', 'وداعاً', 'من فضلك'], correct: 1 },
                { question: 'ما هي الترجمة الألمانية لكلمة "ماء"؟', options: ['Milch', 'Saft', 'Wasser', 'Tee'], correct: 2 },
                { question: 'ما معنى "Guten Morgen"؟', options: ['مساء الخير', 'صباح الخير', 'تصبح على خير', 'مرحباً'], correct: 1 }
            ],
            [
                { question: 'كيف تقول "اسمي أحمد" بالألمانية؟', options: ['Ich heiße Ahmad', 'Ich bin Ahmad', 'Mein Name Ahmad', 'كلا A و B صحيح'], correct: 3 },
                { question: 'ما معنى "Wie geht es Ihnen?"', options: ['من أين أنت؟', 'كم عمرك؟', 'كيف حالك؟', 'ما اسمك؟'], correct: 2 },
                { question: 'كيف تطلب الفاتورة في المطعم؟', options: ['Die Speisekarte, bitte', 'Die Rechnung, bitte', 'Ein Wasser, bitte', 'Entschuldigung'], correct: 1 }
            ],
            [
                { question: 'ما هي صيغة البداية الرسمية للرسالة الألمانية؟', options: ['Hallo', 'Lieber/Liebe', 'Sehr geehrte/r', 'Hi'], correct: 2 },
                { question: 'ما معنى "Ich lese gern Bücher"؟', options: ['أنا أكتب كتباً', 'أحب قراءة الكتب', 'أشتري الكتب', 'أبحث عن كتب'], correct: 1 },
                { question: 'كيف نختم رسالة رسمية بالألمانية؟', options: ['Tschüss', 'Bis bald', 'Mit freundlichen Grüßen', 'Ciao'], correct: 2 }
            ]
        ];

        for (let i = 0; i < germanStepsData.length; i++) {
            const step = await Step.create({ ...germanStepsData[i], roadmap: germanRoadmap._id, createdBy: admin._id });
            await Resource.create({ title: 'موارد تعليمية ألمانية', url: 'https://www.duolingo.com/course/de/en/', type: 'course', platform: 'Duolingo', step: step._id, createdBy: admin._id });
            for (let j = 0; j < germanQuestions[i].length; j++) {
                await Question.create({ ...germanQuestions[i][j], step: step._id, order: j, createdBy: admin._id });
            }
        }
        console.log('✅ German roadmap seeded');

        console.log('\n🎉 Database seeded successfully!');
        console.log(`Admin login: ${process.env.ADMIN_EMAIL || 'admin@roadmap.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
};

seedData();
