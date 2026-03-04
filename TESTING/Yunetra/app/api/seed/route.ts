import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Define schemas for models that may not be imported
const SessionSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed', 'disputed', 'cancelled'], default: 'pending' },
    scheduledAt: { type: Date },
    meetLink: { type: String },
    duration: { type: Number, default: 60 },
    teacherOutline: [{ type: String }],
    teacherConfirmed: { type: Boolean, default: false },
    learnerConfirmed: { type: Boolean, default: false },
    teacherRating: { type: Number },
    learnerRating: { type: Number },
    teacherReview: { type: String },
    learnerReview: { type: String },
}, { timestamps: true });

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, maxlength: 200 },
    url: { type: String, required: true },
    type: { type: String, enum: ["course", "article", "notes", "internship", "roadmap", "tool"], required: true },
    skill: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saveCount: { type: Number, default: 0 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const QuestionSchema = new mongoose.Schema({
    skill: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const ArenaChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    organization: { type: String, required: true },
    orgLogo: String,
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    skillsRequired: [String],
    prizeType: { type: String, required: true },
    prizeAmount: Number,
    internshipDetails: String,
    deadline: { type: Date, required: true },
    allowSolo: { type: Boolean, default: true },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 1 },
    status: { type: String, default: 'active' },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ArenaSubmission' }],
    totalSubmissions: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
const ArenaChallenge = mongoose.models.ArenaChallenge || mongoose.model('ArenaChallenge', ArenaChallengeSchema);

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const hashedPassword = await bcrypt.hash("Demo@1234", 10);

        // ===== 1. SEED USERS =====
        await User.deleteMany({ email: { $regex: /@demo\.yunetra\.in$|^demo@yunetra\.in$/i } });

        const demoUsersData = [
            { name: "Arjun Sharma", email: "arjun@demo.yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "3rd Year", skillsTeach: ["React", "Node.js", "Next.js", "DSA"], skillsLearn: ["Python", "Machine Learning"], verifiedSkills: ["React", "Node.js", "Next.js"], rating: 4.8, totalSessions: 12, skillCredits: 8, badges: ["First Step", "Rising Teacher", "React Mentor — Level 1", "Community Pillar"] },
            { name: "Priya Patel", email: "priya@demo.yunetra.in", college: "BITS Pilani", branch: "Information Technology", year: "2nd Year", skillsTeach: ["Figma", "UI Design", "Canva"], skillsLearn: ["React", "Python", "Node.js"], verifiedSkills: ["Figma", "UI Design"], rating: 4.9, totalSessions: 18, skillCredits: 12, badges: ["First Step", "Rising Teacher", "Figma Mentor — Level 2", "Community Pillar"] },
            { name: "Rahul Krishnan", email: "rahul@demo.yunetra.in", college: "NIT Trichy", branch: "Computer Science", year: "4th Year", skillsTeach: ["DSA", "Python", "Machine Learning"], skillsLearn: ["Figma", "React"], verifiedSkills: ["DSA", "Python"], rating: 4.7, totalSessions: 9, skillCredits: 5, badges: ["First Step", "Rising Teacher", "DSA Mentor — Level 1"] },
            { name: "Ananya Reddy", email: "ananya@demo.yunetra.in", college: "IIIT Hyderabad", branch: "Electronics & CS", year: "3rd Year", skillsTeach: ["Machine Learning", "Python"], skillsLearn: ["UI Design", "Node.js"], verifiedSkills: ["Machine Learning"], rating: 4.6, totalSessions: 7, skillCredits: 4, badges: ["First Step", "Rising Teacher"] },
            { name: "Vikram Nair", email: "vikram@demo.yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "2nd Year", skillsTeach: ["Node.js", "Next.js", "React"], skillsLearn: ["Python", "DSA", "Machine Learning"], verifiedSkills: ["Node.js", "Next.js"], rating: 4.5, totalSessions: 5, skillCredits: 3, badges: ["First Step"] },
            { name: "Sneha Iyer", email: "sneha@demo.yunetra.in", college: "PSG Tech Coimbatore", branch: "Information Technology", year: "3rd Year", skillsTeach: ["Canva", "UI Design", "Figma"], skillsLearn: ["Python", "DSA"], verifiedSkills: ["Canva", "UI Design"], rating: 4.7, totalSessions: 8, skillCredits: 6, badges: ["First Step", "Rising Teacher", "UI Design Mentor — Level 1"] },
            { name: "Aditya Joshi", email: "aditya@demo.yunetra.in", college: "COEP Pune", branch: "Computer Engineering", year: "4th Year", skillsTeach: ["DSA", "Node.js"], skillsLearn: ["Machine Learning", "Figma"], verifiedSkills: ["DSA"], rating: 4.4, totalSessions: 6, skillCredits: 3, badges: ["First Step"] },
            { name: "Meera Menon", email: "meera@demo.yunetra.in", college: "NIT Calicut", branch: "Computer Science", year: "2nd Year", skillsTeach: ["Python", "Machine Learning"], skillsLearn: ["React", "UI Design"], verifiedSkills: ["Python"], rating: 4.8, totalSessions: 10, skillCredits: 7, badges: ["First Step", "Rising Teacher", "Python Mentor — Level 1"] },
            { name: "Rohan Gupta", email: "rohan@demo.yunetra.in", college: "DTU Delhi", branch: "Software Engineering", year: "3rd Year", skillsTeach: ["React", "Figma"], skillsLearn: ["DSA", "Python"], verifiedSkills: ["React"], rating: 4.6, totalSessions: 8, skillCredits: 5, badges: ["First Step", "Rising Teacher"] },
            { name: "Kavya Suresh", email: "kavya@demo.yunetra.in", college: "BITS Pilani", branch: "Computer Science", year: "4th Year", skillsTeach: ["Machine Learning", "DSA", "Python", "Next.js"], skillsLearn: ["React", "Figma", "Canva"], verifiedSkills: ["Machine Learning", "DSA", "Next.js"], rating: 4.9, totalSessions: 15, skillCredits: 10, badges: ["First Step", "Rising Teacher", "Community Pillar", "ML Mentor — Level 2"] },
            { name: "Dev Malhotra", email: "dev@demo.yunetra.in", college: "Thapar University", branch: "Computer Science", year: "2nd Year", skillsTeach: ["Figma", "Canva"], skillsLearn: ["React", "Node.js", "DSA"], verifiedSkills: ["Figma"], rating: 4.3, totalSessions: 4, skillCredits: 2, badges: ["First Step"] },
            { name: "Ishaan Mehta", email: "ishaan@demo.yunetra.in", college: "IIT Bombay", branch: "Computer Science", year: "3rd Year", skillsTeach: ["DSA", "Python", "Node.js", "Next.js"], skillsLearn: ["React", "UI Design", "Figma"], verifiedSkills: ["DSA", "Python", "Node.js", "Next.js"], rating: 4.9, totalSessions: 20, skillCredits: 15, badges: ["First Step", "Rising Teacher", "Community Pillar", "DSA Mentor — Level 3", "Python Mentor — Level 2"] },
            { name: "Tanvi Desai", email: "tanvi@demo.yunetra.in", college: "DAIICT Gandhinagar", branch: "ICT", year: "3rd Year", skillsTeach: ["UI Design", "Figma", "React", "Next.js"], skillsLearn: ["Python", "Machine Learning", "DSA"], verifiedSkills: ["UI Design", "React", "Next.js"], rating: 4.7, totalSessions: 9, skillCredits: 6, badges: ["First Step", "Rising Teacher", "UI Design Mentor — Level 1"] },
            { name: "Karan Singh", email: "karan@demo.yunetra.in", college: "Manipal Institute of Technology", branch: "Computer Science", year: "2nd Year", skillsTeach: ["Node.js", "Next.js", "React"], skillsLearn: ["Python", "Machine Learning", "UI Design"], verifiedSkills: ["Node.js", "Next.js"], rating: 4.5, totalSessions: 5, skillCredits: 3, badges: ["First Step"] },
            { name: "Pooja Nambiar", email: "pooja@demo.yunetra.in", college: "NIT Surathkal", branch: "Information Technology", year: "4th Year", skillsTeach: ["Python", "DSA"], skillsLearn: ["React", "Figma"], verifiedSkills: ["Python", "DSA"], rating: 4.8, totalSessions: 11, skillCredits: 8, badges: ["First Step", "Rising Teacher", "Python Mentor — Level 1"] },
            { name: "Abhinav Kumar", email: "abhinav@demo.yunetra.in", college: "SRM Institute", branch: "Computer Science", year: "2nd Year", skillsTeach: ["React", "UI Design"], skillsLearn: ["Python", "Machine Learning"], verifiedSkills: ["React"], rating: 4.4, totalSessions: 6, skillCredits: 4, badges: ["First Step"] },
            { name: "Shruti Das", email: "shruti@demo.yunetra.in", college: "Jadavpur University", branch: "Information Technology", year: "3rd Year", skillsTeach: ["DSA", "Python"], skillsLearn: ["Node.js", "React"], verifiedSkills: ["DSA"], rating: 4.6, totalSessions: 8, skillCredits: 5, badges: ["First Step", "Rising Teacher"] },
            { name: "Sanjay Ramasamy", email: "sanjay@demo.yunetra.in", college: "Anna University", branch: "Computer Engineering", year: "3rd Year", skillsTeach: ["Node.js", "Next.js", "Machine Learning"], skillsLearn: ["React", "Python", "Figma"], verifiedSkills: ["Node.js", "Next.js"], rating: 4.5, totalSessions: 7, skillCredits: 4, badges: ["First Step", "Rising Teacher"] },
            { name: "Nandini Rao", email: "nandini@demo.yunetra.in", college: "Amrita Vishwa Vidyapeetham", branch: "Computer Science", year: "2nd Year", skillsTeach: ["Canva", "Figma"], skillsLearn: ["DSA", "React"], verifiedSkills: ["Canva"], rating: 4.2, totalSessions: 3, skillCredits: 2, badges: ["First Step"] },
            { name: "Aakash Singh", email: "aakash@demo.yunetra.in", college: "NSIT Delhi", branch: "Software Engineering", year: "3rd Year", skillsTeach: ["Python", "React", "Node.js", "Next.js"], skillsLearn: ["Machine Learning", "DSA"], verifiedSkills: ["Python", "React", "Next.js"], rating: 4.7, totalSessions: 8, skillCredits: 6, badges: ["First Step", "Rising Teacher"] },
            { name: "Demo Student", email: "demo@yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "3rd Year", skillsTeach: ["React", "Figma"], skillsLearn: ["DSA", "Machine Learning"], verifiedSkills: ["React"], rating: 4.7, totalSessions: 3, skillCredits: 5, badges: ["First Step", "React Mentor — Level 1"] },
        ];

        const usersToInsert = demoUsersData.map(u => ({ ...u, password: hashedPassword }));
        const insertedUsers = await User.insertMany(usersToInsert);
        console.log(`Seed: Created ${insertedUsers.length} demo users`);

        const userMap: Record<string, any> = {};
        for (const u of insertedUsers) {
            userMap[u.name.split(" ")[0]] = u;
        }

        // ===== 2. SEED SESSIONS =====
        const userIds = insertedUsers.map((u: any) => u._id);
        await Session.deleteMany({ $or: [{ teacherId: { $in: userIds } }, { learnerId: { $in: userIds } }] });

        const generateOutline = (skill: string) => {
            const outlines: Record<string, string[]> = {
                "React": ["Component lifecycle", "State management with Hooks", "Context API overview"],
                "DSA": ["Array & String manipulation", "Two-pointer techniques", "Dynamic Programming approaches"],
                "Figma": ["Auto-layout fundamentals", "Prototyping flows", "Component variants"],
                "Machine Learning": ["Data preprocessing", "Model training & validation", "Regression models"],
                "UI Design": ["Color theory & typography", "Wireframing best practices", "Creating a design system"],
                "Python": ["Generators & iterators", "OOP principles", "List comprehensions"],
                "Node.js": ["Express architecture", "Middleware and routing", "Connecting to MongoDB"],
                "Canva": ["Creating brand kits", "Social media templates", "Presentation layouts"]
            };
            return outlines[skill] || ["Introduction to the topic", "Deep dive into core concepts", "Q&A and troubleshooting"];
        };

        const getPastDate = () => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 60));
            return date;
        };

        const generateCompletedSession = (teacherName: string, learnerName: string, skill: string) => {
            const teacher = userMap[teacherName];
            const learner = userMap[learnerName];
            if (!teacher || !learner) return null;
            return {
                teacherId: teacher._id, learnerId: learner._id, skill, status: "completed",
                scheduledAt: getPastDate(), duration: 60, meetLink: "https://meet.google.com/demo-xxxx-xxxx",
                teacherOutline: generateOutline(skill), teacherConfirmed: true, learnerConfirmed: true,
                teacherRating: Math.floor(Math.random() * 2) + 4, learnerRating: Math.floor(Math.random() * 2) + 4,
                teacherReview: "Great student, picked up concepts very quickly!",
                learnerReview: "Amazing mentor. Explained everything so clearly."
            };
        };

        const specificSessions = [
            { t: "Arjun", l: "Dev", s: "React", c: 3 },
            { t: "Priya", l: "Arjun", s: "Figma", c: 2 },
            { t: "Rahul", l: "Vikram", s: "DSA", c: 2 },
            { t: "Kavya", l: "Ananya", s: "Machine Learning", c: 2 },
            { t: "Ishaan", l: "Rohan", s: "DSA", c: 3 },
            { t: "Sneha", l: "Meera", s: "UI Design", c: 2 },
        ];

        const completedSessions: any[] = [];
        for (const spec of specificSessions) {
            for (let i = 0; i < spec.c; i++) {
                const ses = generateCompletedSession(spec.t, spec.l, spec.s);
                if (ses) completedSessions.push(ses);
            }
        }

        const names = Object.keys(userMap);
        while (completedSessions.length < 30) {
            const tName = names[Math.floor(Math.random() * names.length)];
            const lName = names[Math.floor(Math.random() * names.length)];
            if (tName === lName) continue;
            const tUser = userMap[tName];
            const lUser = userMap[lName];
            const mutualSkill = tUser.skillsTeach?.find((s: string) => lUser.skillsLearn?.includes(s));
            if (mutualSkill) {
                const ses = generateCompletedSession(tName, lName, mutualSkill);
                if (ses) completedSessions.push(ses);
            }
        }

        await Session.insertMany(completedSessions);

        const upcomingSessions = [
            { teacherId: userMap["Arjun"]._id, learnerId: userMap["Karan"]._id, skill: "React", status: "confirmed", scheduledAt: new Date(Date.now() + 1 * 86400000), meetLink: "https://meet.google.com/yun-demo-001", teacherOutline: ["Introduction to React hooks", "useState and useEffect deep dive", "Building a small todo app together"] },
            { teacherId: userMap["Priya"]._id, learnerId: userMap["Rohan"]._id, skill: "Figma", status: "confirmed", scheduledAt: new Date(Date.now() + 2 * 86400000), meetLink: "https://meet.google.com/yun-demo-002", teacherOutline: ["Figma workspace overview", "Components and auto layout", "Designing a mobile app screen"] },
            { teacherId: userMap["Rahul"]._id, learnerId: userMap["Tanvi"]._id, skill: "DSA", status: "pending", scheduledAt: new Date(Date.now() + 3 * 86400000) },
            { teacherId: userMap["Kavya"]._id, learnerId: userMap["Aditya"]._id, skill: "Machine Learning", status: "pending", scheduledAt: new Date(Date.now() + 4 * 86400000) },
            { teacherId: userMap["Sneha"]._id, learnerId: userMap["Dev"]._id, skill: "UI Design", status: "confirmed", scheduledAt: new Date(Date.now() + 5 * 86400000), meetLink: "https://meet.google.com/yun-demo-003", teacherOutline: ["Color theory & typography", "Wireframing best practices", "Creating a design system"] },
        ];
        await Session.insertMany(upcomingSessions);
        console.log(`Seed: Created ${completedSessions.length + upcomingSessions.length} sessions`);

        // ===== 3. SEED RESOURCES =====
        await Resource.deleteMany({});
        const sampleResources = [
            { title: "Complete React Tutorial 2026", description: "The definitive guide to modern React including Hooks, Server Components, and Next.js 14.", url: "https://youtube.com", type: "course", skill: "React", verified: true, upvoteCount: 142, saveCount: 89 },
            { title: "React Context vs Redux", description: "A deep dive comparing state management libraries.", url: "https://freecodecamp.org", type: "article", skill: "React", verified: false, upvoteCount: 45, saveCount: 12 },
            { title: "Figma UI Kit & Wireframes", description: "Personal component library for rapid wireframing. Free to duplicate.", url: "https://figma.com/community", type: "tool", skill: "Figma", verified: true, upvoteCount: 320, saveCount: 410 },
            { title: "Auto-Layout Mastery", description: "Build responsive components that scale flawlessly across devices.", url: "https://youtube.com", type: "course", skill: "Figma", verified: false, upvoteCount: 88, saveCount: 65 },
            { title: "Top 50 LeetCode Questions", description: "The most frequently asked Data Structure questions.", url: "https://leetcode.com/discuss", type: "notes", skill: "DSA", verified: true, upvoteCount: 890, saveCount: 950 },
            { title: "Graph Theory Algorithms", description: "Comprehensive notes on Dijkstra, BFS, and DFS with animated examples.", url: "https://medium.com", type: "article", skill: "DSA", verified: false, upvoteCount: 56, saveCount: 80 },
            { title: "Backend Developer Roadmap", description: "Step-by-step visual roadmap from Internet basics to scaling Node apps.", url: "https://roadmap.sh/backend", type: "roadmap", skill: "Node.js", verified: true, upvoteCount: 450, saveCount: 600 },
            { title: "Building a REST API with Express", description: "Guide to routing, middleware, and database connections.", url: "https://dev.to", type: "article", skill: "Node.js", verified: false, upvoteCount: 34, saveCount: 22 },
            { title: "Python for Data Science", description: "Full 12-hour course covering Pandas, NumPy, and Matplotlib.", url: "https://youtube.com", type: "course", skill: "Python", verified: true, upvoteCount: 210, saveCount: 175 },
            { title: "Python Clean Code Cheatsheet", description: "Quick reference for writing pythonic, maintainable code.", url: "https://github.com", type: "notes", skill: "Python", verified: false, upvoteCount: 110, saveCount: 140 },
            { title: "Machine Learning Concepts Explained", description: "Visualizing gradient descent and backpropagation.", url: "https://towardsdatascience.com", type: "article", skill: "Machine Learning", verified: true, upvoteCount: 156, saveCount: 180 },
            { title: "Summer ML Research Intern", description: "Application link for Google DeepMind summer intake.", url: "https://careers.google.com", type: "internship", skill: "Machine Learning", verified: true, upvoteCount: 500, saveCount: 300 },
            { title: "Ultimate Canva Font Pairings", description: "Curated font combinations for professional designs.", url: "https://canva.com", type: "notes", skill: "Canva", verified: false, upvoteCount: 24, saveCount: 55 },
            { title: "Color Theory for Developers", description: "How to pick accessible, beautiful color palettes.", url: "https://css-tricks.com", type: "article", skill: "UI Design", verified: true, upvoteCount: 310, saveCount: 420 },
            { title: "Inspiring SaaS Landing Pages", description: "Updated swipe file of the best UI patterns in production.", url: "https://godly.website", type: "tool", skill: "UI Design", verified: false, upvoteCount: 290, saveCount: 315 },
        ];

        const users = insertedUsers.slice(0, 3);
        const resourcesToInsert = sampleResources.map((res, index) => ({
            ...res,
            uploadedBy: users[index % users.length]._id,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        }));
        await Resource.insertMany(resourcesToInsert);
        console.log(`Seed: Created ${resourcesToInsert.length} resources`);

        // ===== 4. SEED QUESTIONS =====
        await Question.deleteMany({});
        const questionsData = [
            { skill: 'React', question: 'What is the purpose of useState?', options: ['Manage side effects', 'Manage local component state', 'Fetch data from APIs', 'Route between pages'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'React', question: 'Which hook is best for DOM manipulation?', options: ['useEffect', 'useMemo', 'useRef', 'useCallback'], correctAnswer: 2, difficulty: 'medium' },
            { skill: 'React', question: 'What does a React context provider do?', options: ['Passes data deeply throughout the tree', 'Renders children directly', 'Provides an isolated CSS scope', 'Stores data persistently'], correctAnswer: 0, difficulty: 'easy' },
            { skill: 'React', question: 'How do you prevent unnecessary re-renders?', options: ['React.memo', 'return false', 'shouldUpdate', 'ComponentDidMount'], correctAnswer: 0, difficulty: 'medium' },
            { skill: 'React', question: 'What does useEffect do with empty dependency array []?', options: ['Runs on every render', 'Runs only on mount', 'Runs when any prop changes', 'Never runs'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Figma', question: 'What shortcut groups selected elements?', options: ['Ctrl/Cmd + G', 'Ctrl/Cmd + J', 'Shift + G', 'Alt + G'], correctAnswer: 0, difficulty: 'easy' },
            { skill: 'Figma', question: 'Auto Layout is used primarily for:', options: ['Creating illustrations', 'Adding animation', 'Creating responsive layouts', 'Exporting assets'], correctAnswer: 2, difficulty: 'medium' },
            { skill: 'Figma', question: 'What does creating a Component do?', options: ['Saves to cloud', 'Creates reusable master element', 'Converts vector to raster', 'Exports as CSS'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Figma', question: 'Which tool draws custom vector shapes?', options: ['Frame Tool', 'Slice Tool', 'Pen Tool', 'Hand Tool'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'Figma', question: 'What links specific colors across a project?', options: ['Color Variants', 'Local Styles', 'Paint Buckets', 'Fill Overrides'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'DSA', question: 'Time complexity of searching in a balanced BST?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'DSA', question: 'Which data structure uses LIFO?', options: ['Queue', 'Linked List', 'Stack', 'Tree'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'DSA', question: 'Worst-case space complexity of QuickSort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 2, difficulty: 'hard' },
            { skill: 'DSA', question: 'Which traversal visits BST nodes in ascending order?', options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'DSA', question: 'What algorithm finds shortest path in weighted graph?', options: ['DFS', 'BFS', 'Dijkstras', 'Kruskals'], correctAnswer: 2, difficulty: 'medium' },
            { skill: 'Node.js', question: 'What engine powers Node.js?', options: ['SpiderMonkey', 'V8', 'Chakra', 'JavaScriptCore'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Node.js', question: 'How does Node.js handle async operations?', options: ['Multi-threading', 'Event Loop', 'Web Workers', 'Mutex Locks'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'Node.js', question: 'Which module creates a web server?', options: ['fs', 'path', 'http', 'url'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'Node.js', question: 'What does npm stand for?', options: ['Node Package Manager', 'New Project Maker', 'Node Program Module', 'Non-blocking Package Manager'], correctAnswer: 0, difficulty: 'easy' },
            { skill: 'Node.js', question: 'Purpose of module.exports?', options: ['Install a package', 'Expose code to other files', 'Import a file', 'Start the server'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'Python', question: 'Correct way to create a function?', options: ['function my_func():', 'create my_func():', 'def my_func():', 'void my_func():'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'Python', question: 'Which collection is ordered and changeable?', options: ['Tuple', 'List', 'Set', 'Dictionary'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Python', question: 'What does __init__ do?', options: ['Imports a module', 'Starts a loop', 'Initializes an object', 'Deletes an object'], correctAnswer: 2, difficulty: 'medium' },
            { skill: 'Python', question: 'What is a lambda function?', options: ['Large code block', 'Small anonymous function', 'Core module', 'Built-in loop'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'Python', question: 'Keyword for error handling?', options: ['catch', 'except', 'error', 'throw'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Machine Learning', question: 'What is supervised learning?', options: ['Training without labels', 'Training on labeled data', 'A robot learning to walk', 'Querying a database'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Machine Learning', question: 'What is overfitting?', options: ['Model too simple', 'Memorized training data', 'Too much memory', 'Not enough data'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'Machine Learning', question: 'Best metric for imbalanced classification?', options: ['Accuracy', 'F1-Score', 'MSE', 'R-squared'], correctAnswer: 1, difficulty: 'hard' },
            { skill: 'Machine Learning', question: 'Common use of clustering algorithms?', options: ['Predicting prices', 'Translating text', 'Customer segmentation', 'Object detection'], correctAnswer: 2, difficulty: 'medium' },
            { skill: 'Machine Learning', question: 'What does CNN stand for?', options: ['Central Neural Network', 'Convolutional Neural Network', 'Computer Node Network', 'Complex Native Network'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Canva', question: 'What is a Brand Kit used for?', options: ['Uploading videos', 'Storing colors, fonts, logos', 'Hiring designers', 'Publishing websites'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'Canva', question: 'How to remove image background?', options: ['Background Remover', 'Eraser tool', 'Layer mask', 'Magic wand'], correctAnswer: 0, difficulty: 'easy' },
            { skill: 'Canva', question: 'Feature to change dimensions instantly?', options: ['Crop tool', 'Magic Resize', 'Ruler tool', 'Aspect Ratio lock'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'Canva', question: 'Which is NOT a Canva export format?', options: ['PNG', 'PDF Print', 'PSD', 'MP4 Video'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'Canva', question: 'What is grouping used for?', options: ['Organize folders', 'Move elements together', 'Combine layers', 'Invite members'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'UI Design', question: 'What does UI stand for?', options: ['User Internet', 'Universal Interface', 'User Interface', 'Unique Integration'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'UI Design', question: 'Color mode for screen designs?', options: ['CMYK', 'Grayscale', 'RGB', 'Pantone'], correctAnswer: 2, difficulty: 'easy' },
            { skill: 'UI Design', question: 'Purpose of whitespace?', options: ['Save file size', 'Improve readability', 'Hide messages', 'Client preference'], correctAnswer: 1, difficulty: 'medium' },
            { skill: 'UI Design', question: 'What is typography?', options: ['Layout of images', 'Art of arranging type', 'Psychology of color', 'Spacing of columns'], correctAnswer: 1, difficulty: 'easy' },
            { skill: 'UI Design', question: 'What is a wireframe?', options: ['High-fidelity mockup', 'Coded prototype', 'Low-fidelity structural outline', 'Vector illustration'], correctAnswer: 2, difficulty: 'medium' },
        ];
        await Question.insertMany(questionsData);
        console.log(`Seed: Created ${questionsData.length} questions`);

        // ===== 5. SEED ARENA =====
        await ArenaChallenge.deleteMany({});
        const arenaChallenges = [
            { title: "Build a Real-Time Collaborative Code Editor", description: "Create a full-stack web application similar to Google Docs but for code.", organization: "EduTech Startup", orgLogo: "💻", category: "tech_development", difficulty: "advanced", skillsRequired: ["React", "Node.js", "WebSockets", "System Design"], prizeType: "internship", internshipDetails: "6 month paid internship ₹20,000/month + PPO", deadline: new Date(Date.now() + 45 * 86400000), allowSolo: false, minTeamSize: 2, maxTeamSize: 5 },
            { title: "Redesign the IRCTC Mobile App UX", description: "Redesign the complete IRCTC booking flow for mobile using modern UX principles.", organization: "DesignFirst Agency", orgLogo: "🎨", category: "ui_ux_design", difficulty: "intermediate", skillsRequired: ["UI/UX Design", "Figma", "User Research", "Prototyping"], prizeType: "cash", prizeAmount: 12000, deadline: new Date(Date.now() + 20 * 86400000), allowSolo: true },
            { title: "Create Brand Identity for Sustainable Fashion Startup", description: "Create a complete brand identity including logo, color palette, typography, and templates.", organization: "GreenThread Co.", orgLogo: "♻️", category: "graphic_design", difficulty: "beginner", skillsRequired: ["Graphic Design", "Logo Design", "Brand Identity"], prizeType: "both", prizeAmount: 8000, internshipDetails: "1 month remote internship as brand designer", deadline: new Date(Date.now() + 18 * 86400000), allowSolo: true },
            { title: "Edit a 90-Second Brand Film for a Local NGO", description: "Edit raw footage into a powerful 90-second brand film.", organization: "HopeFoundation India", orgLogo: "🎬", category: "video_editing", difficulty: "intermediate", skillsRequired: ["Video Editing", "Adobe Premiere Pro", "Color Grading"], prizeType: "cash", prizeAmount: 10000, deadline: new Date(Date.now() + 22 * 86400000), allowSolo: true },
            { title: "Create a 30-Second VFX Product Advertisement", description: "Create a VFX-heavy advertisement for wireless earphones.", organization: "NovaSpark Products", orgLogo: "✨", category: "vfx_motion", difficulty: "advanced", skillsRequired: ["After Effects", "VFX", "Motion Graphics"], prizeType: "both", prizeAmount: 18000, internshipDetails: "2 month paid internship", deadline: new Date(Date.now() + 35 * 86400000), allowSolo: true },
            { title: "Write 5-Part Email Campaign for EdTech Startup", description: "Write a 5-part email welcome sequence for course platform launch.", organization: "LearnSphere", orgLogo: "✍️", category: "content_writing", difficulty: "beginner", skillsRequired: ["Copywriting", "Email Marketing Copy", "Content Writing"], prizeType: "cash", prizeAmount: 6000, deadline: new Date(Date.now() + 14 * 86400000), allowSolo: true },
            { title: "Build 30-Day Social Media Growth Strategy", description: "Create complete 30-day social media strategy for artisan coffee shop.", organization: "BrewLocal Coffee", orgLogo: "☕", category: "digital_marketing", difficulty: "beginner", skillsRequired: ["Social Media Marketing", "Content Strategy", "Canva"], prizeType: "cash", prizeAmount: 7000, deadline: new Date(Date.now() + 16 * 86400000), allowSolo: true },
            { title: "Compose Background Score for Short Film", description: "Compose a 60-second emotional background score for a train journey scene.", organization: "IndieFilm Collective", orgLogo: "🎵", category: "music_production", difficulty: "intermediate", skillsRequired: ["Music Production", "Soundtrack Composition", "Mixing"], prizeType: "cash", prizeAmount: 8000, deadline: new Date(Date.now() + 28 * 86400000), allowSolo: true },
            { title: "Photo Essay on Street Food Culture", description: "Create a 15-20 photo essay documenting street food in your city.", organization: "Zomato Stories", orgLogo: "📸", category: "photography", difficulty: "beginner", skillsRequired: ["Photography", "Photo Editing", "Visual Storytelling"], prizeType: "both", prizeAmount: 9000, internshipDetails: "1 month content creator internship at Zomato", deadline: new Date(Date.now() + 21 * 86400000), allowSolo: true },
            { title: "Go-To-Market Plan for Tier 3 City Expansion", description: "Create complete go-to-market strategy for expanding to 50 tier-3 cities.", organization: "LocalMart", orgLogo: "🛒", category: "business_strategy", difficulty: "intermediate", skillsRequired: ["Business Strategy", "Market Research", "Pitch Deck Creation"], prizeType: "cash", prizeAmount: 15000, deadline: new Date(Date.now() + 30 * 86400000), allowSolo: true },
            { title: "Analyze IPL Data to Predict Match Outcomes", description: "Build a predictive model using IPL match data from 2008-2024.", organization: "SportsBuzz Analytics", orgLogo: "📊", category: "data_analytics", difficulty: "intermediate", skillsRequired: ["Python", "Data Analysis", "Machine Learning", "Data Visualization"], prizeType: "cash", prizeAmount: 12000, deadline: new Date(Date.now() + 25 * 86400000), allowSolo: true },
            { title: "Mental Health Awareness Campaign for Colleges", description: "Create Instagram posts, video, and resource card for mental health awareness.", organization: "iCall Psychology", orgLogo: "💚", category: "social_impact", difficulty: "beginner", skillsRequired: ["Graphic Design", "Content Writing", "Social Media Marketing"], prizeType: "both", prizeAmount: 10000, internshipDetails: "Volunteer ambassador role with certificate", deadline: new Date(Date.now() + 20 * 86400000), allowSolo: false, minTeamSize: 2, maxTeamSize: 4 },
            { title: "Design and Animate College Fest Promo Video", description: "Create a 2-minute motion graphics promo for TechFest.", organization: "TechFest IIT Bombay", orgLogo: "🎪", category: "vfx_motion", difficulty: "intermediate", skillsRequired: ["Motion Graphics", "After Effects", "Graphic Design"], prizeType: "cash", prizeAmount: 20000, deadline: new Date(Date.now() + 40 * 86400000), allowSolo: false, minTeamSize: 2, maxTeamSize: 3 },
            { title: "Build Crop Disease Detection App for Farmers", description: "Build a mobile-friendly web app that detects crop diseases from photos.", organization: "GreenIndia NGO", orgLogo: "🌱", category: "social_impact", difficulty: "intermediate", skillsRequired: ["Machine Learning", "Python", "React Native"], prizeType: "both", prizeAmount: 15000, internshipDetails: "3 month internship ₹8,000 stipend", deadline: new Date(Date.now() + 35 * 86400000), allowSolo: false, minTeamSize: 2, maxTeamSize: 5 },
        ];
        await ArenaChallenge.insertMany(arenaChallenges);
        console.log(`Seed: Created ${arenaChallenges.length} arena challenges`);

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully!',
            data: {
                users: insertedUsers.length,
                sessions: completedSessions.length + upcomingSessions.length,
                resources: resourcesToInsert.length,
                questions: questionsData.length,
                arenaChallenges: arenaChallenges.length,
            },
            demoLogin: { email: "demo@yunetra.in", password: "Demo@1234" }
        });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ message: 'Seed failed', error: error.message }, { status: 500 });
    }
}
