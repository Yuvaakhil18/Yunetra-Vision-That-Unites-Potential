const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define the schema inline since we can't import TypeScript models directly in Node.js
const ArenaChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    organization: { type: String, required: true },
    orgLogo: String,
    category: {
        type: String,
        required: true,
        enum: [
            'tech_development', 'ui_ux_design', 'graphic_design', 'video_editing',
            'vfx_motion', 'content_writing', 'digital_marketing', 'music_production',
            'photography', 'business_strategy', 'data_analytics', 'social_impact'
        ]
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    skillsRequired: [String],
    prizeType: {
        type: String,
        required: true,
        enum: ['cash', 'internship', 'both']
    },
    prizeAmount: Number,
    internshipDetails: String,
    deadline: { type: Date, required: true },
    allowSolo: { type: Boolean, default: true },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ArenaSubmission' }],
    totalSubmissions: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const ArenaChallenge = mongoose.models.ArenaChallenge || mongoose.model('ArenaChallenge', ArenaChallengeSchema);

const arenaChallenges = [
  // TECH
  {
    title: "Build a Real-Time Collaborative Code Editor",
    description: "Create a full-stack web application similar to Google Docs but for code. Must support real-time collaboration where multiple users can edit the same file simultaneously. Must include syntax highlighting, cursor tracking, and a live chat feature. Bonus points for version history and code execution.",
    organization: "EduTech Startup",
    orgLogo: "💻",
    category: "tech_development",
    difficulty: "advanced",
    skillsRequired: ["React", "Node.js", "WebSockets", "System Design"],
    prizeType: "internship",
    internshipDetails: "6 month paid internship ₹20,000/month + PPO opportunity",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    allowSolo: false,
    minTeamSize: 2,
    maxTeamSize: 5
  },

  // UI/UX
  {
    title: "Redesign the IRCTC Mobile App UX",
    description: "IRCTC is one of the most used but most frustrating apps in India. Redesign the complete booking flow for mobile — from search to payment — using modern UX principles. Submit a complete Figma prototype with user research backing your decisions.",
    organization: "DesignFirst Agency",
    orgLogo: "🎨",
    category: "ui_ux_design",
    difficulty: "intermediate",
    skillsRequired: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
    prizeType: "cash",
    prizeAmount: 12000,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // GRAPHIC DESIGN
  {
    title: "Create Brand Identity for a Sustainable Fashion Startup",
    description: "GreenThread is a new sustainable fashion brand targeting Indian college students. Create a complete brand identity including logo, color palette, typography, business card, and Instagram post templates. The brand must feel modern, eco-conscious, and youth-friendly.",
    organization: "GreenThread Co.",
    orgLogo: "♻️",
    category: "graphic_design",
    difficulty: "beginner",
    skillsRequired: ["Graphic Design", "Logo Design", "Brand Identity", "Adobe Illustrator"],
    prizeType: "both",
    prizeAmount: 8000,
    internshipDetails: "1 month remote internship as brand designer",
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // VIDEO EDITING
  {
    title: "Edit a 90-Second Brand Film for a Local NGO",
    description: "HopeFoundation runs education programs for underprivileged children. We have raw footage from our recent annual event — 45 minutes of unedited clips. Edit it into a powerful 90-second brand film that tells our story, moves viewers emotionally, and works on Instagram and YouTube. Raw footage will be shared via Drive after application.",
    organization: "HopeFoundation India",
    orgLogo: "🎬",
    category: "video_editing",
    difficulty: "intermediate",
    skillsRequired: ["Video Editing", "Adobe Premiere Pro", "Color Grading", "Sound Design"],
    prizeType: "cash",
    prizeAmount: 10000,
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // VFX
  {
    title: "Create a 30-Second VFX Product Advertisement",
    description: "Create a stunning 30-second VFX-heavy advertisement for NovaSpark's new wireless earphones. Must include product reveal animation, particle effects, dynamic typography, and cinematic color grading. Product images and logo assets will be provided after application.",
    organization: "NovaSpark Products",
    orgLogo: "✨",
    category: "vfx_motion",
    difficulty: "advanced",
    skillsRequired: ["After Effects", "VFX", "Motion Graphics", "Color Grading"],
    prizeType: "both",
    prizeAmount: 18000,
    internshipDetails: "2 month paid internship at NovaSpark creative studio",
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // CONTENT WRITING
  {
    title: "Write a 5-Part Email Campaign for EdTech Startup",
    description: "LearnSphere is launching a new course platform. Write a 5-part email welcome sequence that takes a new user from signup to their first course purchase. Each email must have a subject line, preview text, and full body copy. Focus on conversion, not just information.",
    organization: "LearnSphere",
    orgLogo: "✍️",
    category: "content_writing",
    difficulty: "beginner",
    skillsRequired: ["Copywriting", "Email Marketing Copy", "Content Writing"],
    prizeType: "cash",
    prizeAmount: 6000,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // DIGITAL MARKETING
  {
    title: "Build a 30-Day Social Media Growth Strategy",
    description: "BrewLocal is a single-outlet artisan coffee shop in Bangalore trying to build an Instagram following. Create a complete 30-day social media strategy including content calendar, post templates (designed in Canva), caption style guide, hashtag strategy, and engagement tactics. Target: grow from 200 to 1000 followers in 30 days.",
    organization: "BrewLocal Coffee",
    orgLogo: "☕",
    category: "digital_marketing",
    difficulty: "beginner",
    skillsRequired: ["Social Media Marketing", "Content Strategy", "Canva", "Instagram"],
    prizeType: "cash",
    prizeAmount: 7000,
    deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // MUSIC PRODUCTION
  {
    title: "Compose a 60-Second Background Score for Short Film",
    description: "IndieFilm Collective is producing a 10-minute short film about a student's last day before leaving their hometown. Compose a 60-second emotional background score that works for the final scene — a train journey away from home. The scene has no dialogue. Only the music tells the story. Reference scene will be shared after application.",
    organization: "IndieFilm Collective",
    orgLogo: "🎵",
    category: "music_production",
    difficulty: "intermediate",
    skillsRequired: ["Music Production", "Soundtrack Composition", "Mixing", "Mastering"],
    prizeType: "cash",
    prizeAmount: 8000,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // PHOTOGRAPHY
  {
    title: "Create a Photo Essay on Street Food Culture in Your City",
    description: "Zomato is creating a visual content series called Street Stories — celebrating India's street food culture. Create a 15-20 photo essay documenting street food in your city. Must tell a story, not just show food. We want the vendors, the customers, the chaos, the love. Submit with edited photos and 50-word captions per image.",
    organization: "Zomato Stories",
    orgLogo: "📸",
    category: "photography",
    difficulty: "beginner",
    skillsRequired: ["Photography", "Photo Editing", "Adobe Lightroom", "Visual Storytelling"],
    prizeType: "both",
    prizeAmount: 9000,
    internshipDetails: "1 month content creator internship at Zomato",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // BUSINESS STRATEGY
  {
    title: "Build a Go-To-Market Plan for Tier 3 City Expansion",
    description: "LocalMart is expanding to 50 tier-3 cities in the next 12 months. Create a complete go-to-market strategy including market research, customer personas, competitive analysis, pricing strategy, distribution channels, marketing plan, and a 90-day launch roadmap. Present as a professional slide deck with a supporting financial model.",
    organization: "LocalMart",
    orgLogo: "🛒",
    category: "business_strategy",
    difficulty: "intermediate",
    skillsRequired: ["Business Strategy", "Market Research", "Go-To-Market Planning", "Pitch Deck Creation"],
    prizeType: "cash",
    prizeAmount: 15000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // DATA ANALYTICS
  {
    title: "Analyze IPL Data to Predict Match Outcomes",
    description: "Using publicly available IPL match data from 2008-2024, build a predictive model that can forecast match outcomes based on team composition, venue, toss result, and recent form. Create an interactive dashboard showing key insights and model predictions. Accuracy above 70% qualifies for finalist round.",
    organization: "SportsBuzz Analytics",
    orgLogo: "📊",
    category: "data_analytics",
    difficulty: "intermediate",
    skillsRequired: ["Python", "Data Analysis", "Machine Learning", "Data Visualization"],
    prizeType: "cash",
    prizeAmount: 12000,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    allowSolo: true
  },

  // SOCIAL IMPACT - MIXED SKILLS
  {
    title: "Create Awareness Campaign for Mental Health in Colleges",
    description: "1 in 3 Indian college students experience anxiety or depression but less than 5% seek help. Create a complete awareness campaign including Instagram posts series (10 posts), one 60-second awareness video, and a shareable digital resource card. The campaign must reduce stigma and encourage help-seeking without being preachy.",
    organization: "iCall Psychology",
    orgLogo: "💚",
    category: "social_impact",
    difficulty: "beginner",
    skillsRequired: ["Graphic Design", "Content Writing", "Social Media Marketing", "Video Editing"],
    prizeType: "both",
    prizeAmount: 10000,
    internshipDetails: "Volunteer ambassador role with certificate",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    allowSolo: false,
    minTeamSize: 2,
    maxTeamSize: 4
  },

  // CROSS-SKILL DESIGN + VIDEO
  {
    title: "Design and Animate a College Fest Promo Video",
    description: "TechFest needs a 2-minute promo video for their annual technical festival. Create a full motion graphics promo that builds excitement, communicates key event details, and works on YouTube, Instagram, and the main stage screen. Must include animated typography, transitions, and original motion graphics. No live footage required — pure design and animation.",
    organization: "TechFest IIT Bombay",
    orgLogo: "🎪",
    category: "vfx_motion",
    difficulty: "intermediate",
    skillsRequired: ["Motion Graphics", "After Effects", "Graphic Design", "Adobe Illustrator"],
    prizeType: "cash",
    prizeAmount: 20000,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    allowSolo: false,
    minTeamSize: 2,
    maxTeamSize: 3
  },

  // CONTENT + MARKETING COMBO
  {
    title: "Write and Design a Complete Brand Magazine Issue",
    description: "Myntra Studio is launching a digital brand magazine targeting Indian college fashion enthusiasts. Create one complete issue — 12-15 pages — covering fashion trends, student style features, and brand stories. Must include cover design, editorial layout, typography system, and original written content. Submit as PDF and individual page images.",
    organization: "Myntra Studio",
    orgLogo: "👗",
    category: "graphic_design",
    difficulty: "advanced",
    skillsRequired: ["Graphic Design", "Content Writing", "Adobe InDesign", "Typography", "Photography"],
    prizeType: "both",
    prizeAmount: 22000,
    internshipDetails: "3 month content design internship at Myntra",
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    allowSolo: false,
    minTeamSize: 2,
    maxTeamSize: 4
  },

  // TECH + SOCIAL IMPACT
  {
    title: "Build a Crop Disease Detection App for Farmers",
    description: "Millions of Indian farmers lose crops every year due to undetected diseases. Build a mobile-friendly web app that uses image recognition to detect crop diseases from photos. Must work on low-end Android devices with poor connectivity. Include a farmer-friendly UI in at least one regional language.",
    organization: "GreenIndia NGO",
    orgLogo: "🌱",
    category: "social_impact",
    difficulty: "intermediate",
    skillsRequired: ["Machine Learning", "Python", "React Native", "Flask"],
    prizeType: "both",
    prizeAmount: 15000,
    internshipDetails: "3 month internship at GreenIndia ₹8,000 stipend",
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    allowSolo: false,
    minTeamSize: 2,
    maxTeamSize: 5
  }
];

async function seedArenaChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing challenges (optional)
    const deleteResult = await ArenaChallenge.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing challenges`);

    // Insert new challenges
    const result = await ArenaChallenge.insertMany(arenaChallenges);
    console.log(`✅ Successfully seeded ${result.length} arena challenges`);

    // Display summary
    console.log('\n📊 Category Distribution:');
    const categoryCounts = result.reduce((acc, challenge) => {
      acc[challenge.category] = (acc[challenge.category] || 0) + 1;
      return acc;
    }, {});
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    mongoose.connection.close();
    console.log('\n✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding arena challenges:', error);
    process.exit(1);
  }
}

seedArenaChallenges();
