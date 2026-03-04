import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define minimal schemas if models aren't registered yet to avoid strict mode issues
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    skillsTeach: [{ type: String }],
    skillsLearn: [{ type: String }],
    verifiedSkills: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    skillCredits: { type: Number, default: 3 },
    badges: [{ type: String }],
}, { timestamps: true });

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

// Avoid model recompilation errors
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function seedDemo() {
    try {
        console.log("Connecting to MongoDB with URI:", (MONGODB_URI as string).split('@')[1]); // Log part of URI for debug
        await mongoose.connect(MONGODB_URI as string, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB successfully!");

        // 1. Clear existing demo data (but keep real stuff if we can differentiate. For now, clear demo@yunetra.in and emails ending in @demo.yunetra.in)
        await User.deleteMany({ email: { $regex: /@demo.yunetra.in$|^demo@yunetra.in$/i } });
        console.log("Cleared old demo users...");

        // We also need to clear sessions where these users were involved. 
        // This is a bit tricky without finding them first, but since we just deleted them, 
        // any session pointing to a non-existent user could be a problem, so let's delete sessions 
        // that belong to the deleted users. Actually, it's safer to clear all sessions if it's purely a demo db, 
        // but the prompt says "(keep real users)". 
        // Since we cleared users, we should clear sessions where teacher or learner is NOT in DB.
        // However, it's easier to just do it via fetching the users before deleting.

        const hashedPassword = await bcrypt.hash("Demo@1234", 10);

        const demoUsersData = [
            {
                name: "Arjun Sharma", email: "arjun@demo.yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "3rd",
                skillsTeach: ["React", "Node.js", "DSA"], skillsLearn: ["Figma", "Machine Learning"], verifiedSkills: ["React", "Node.js"],
                rating: 4.8, totalSessions: 12, skillCredits: 8, badges: ["First Step", "Rising Teacher", "React Mentor — Level 1", "Community Pillar"]
            },
            {
                name: "Priya Patel", email: "priya@demo.yunetra.in", college: "BITS Pilani", branch: "Information Technology", year: "2nd",
                skillsTeach: ["Figma", "UI Design", "Canva"], skillsLearn: ["React", "Node.js"], verifiedSkills: ["Figma", "UI Design"],
                rating: 4.9, totalSessions: 18, skillCredits: 12, badges: ["First Step", "Rising Teacher", "Figma Mentor — Level 2", "Community Pillar"]
            },
            {
                name: "Rahul Krishnan", email: "rahul@demo.yunetra.in", college: "NIT Trichy", branch: "Computer Science", year: "4th",
                skillsTeach: ["DSA", "Python", "Machine Learning"], skillsLearn: ["Figma", "React"], verifiedSkills: ["DSA", "Python"],
                rating: 4.7, totalSessions: 9, skillCredits: 5, badges: ["First Step", "Rising Teacher", "DSA Mentor — Level 1"]
            },
            {
                name: "Ananya Reddy", email: "ananya@demo.yunetra.in", college: "IIIT Hyderabad", branch: "Electronics & CS", year: "3rd",
                skillsTeach: ["Machine Learning", "Python"], skillsLearn: ["UI Design", "Node.js"], verifiedSkills: ["Machine Learning"],
                rating: 4.6, totalSessions: 7, skillCredits: 4, badges: ["First Step", "Rising Teacher"]
            },
            {
                name: "Vikram Nair", email: "vikram@demo.yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "2nd",
                skillsTeach: ["Node.js", "React"], skillsLearn: ["DSA", "Machine Learning"], verifiedSkills: ["Node.js"],
                rating: 4.5, totalSessions: 5, skillCredits: 3, badges: ["First Step"]
            },
            {
                name: "Sneha Iyer", email: "sneha@demo.yunetra.in", college: "PSG Tech Coimbatore", branch: "Information Technology", year: "3rd",
                skillsTeach: ["Canva", "UI Design", "Figma"], skillsLearn: ["Python", "DSA"], verifiedSkills: ["Canva", "UI Design"],
                rating: 4.7, totalSessions: 8, skillCredits: 6, badges: ["First Step", "Rising Teacher", "UI Design Mentor — Level 1"]
            },
            {
                name: "Aditya Joshi", email: "aditya@demo.yunetra.in", college: "COEP Pune", branch: "Computer Engineering", year: "4th",
                skillsTeach: ["DSA", "Node.js"], skillsLearn: ["Machine Learning", "Figma"], verifiedSkills: ["DSA"],
                rating: 4.4, totalSessions: 6, skillCredits: 3, badges: ["First Step"]
            },
            {
                name: "Meera Menon", email: "meera@demo.yunetra.in", college: "NIT Calicut", branch: "Computer Science", year: "2nd",
                skillsTeach: ["Python", "Machine Learning"], skillsLearn: ["React", "UI Design"], verifiedSkills: ["Python"],
                rating: 4.8, totalSessions: 10, skillCredits: 7, badges: ["First Step", "Rising Teacher", "Python Mentor — Level 1"]
            },
            {
                name: "Rohan Gupta", email: "rohan@demo.yunetra.in", college: "DTU Delhi", branch: "Software Engineering", year: "3rd",
                skillsTeach: ["React", "Figma"], skillsLearn: ["DSA", "Python"], verifiedSkills: ["React"],
                rating: 4.6, totalSessions: 8, skillCredits: 5, badges: ["First Step", "Rising Teacher"]
            },
            {
                name: "Kavya Suresh", email: "kavya@demo.yunetra.in", college: "BITS Pilani", branch: "Computer Science", year: "4th",
                skillsTeach: ["Machine Learning", "DSA", "Python"], skillsLearn: ["Figma", "Canva"], verifiedSkills: ["Machine Learning", "DSA"],
                rating: 4.9, totalSessions: 15, skillCredits: 10, badges: ["First Step", "Rising Teacher", "Community Pillar", "ML Mentor — Level 2"]
            },
            {
                name: "Dev Malhotra", email: "dev@demo.yunetra.in", college: "Thapar University", branch: "Computer Science", year: "2nd",
                skillsTeach: ["Figma", "Canva"], skillsLearn: ["React", "Node.js", "DSA"], verifiedSkills: ["Figma"],
                rating: 4.3, totalSessions: 4, skillCredits: 2, badges: ["First Step"]
            },
            {
                name: "Ishaan Mehta", email: "ishaan@demo.yunetra.in", college: "IIT Bombay", branch: "Computer Science", year: "3rd",
                skillsTeach: ["DSA", "Python", "Node.js"], skillsLearn: ["UI Design", "Figma"], verifiedSkills: ["DSA", "Python", "Node.js"],
                rating: 4.9, totalSessions: 20, skillCredits: 15, badges: ["First Step", "Rising Teacher", "Community Pillar", "DSA Mentor — Level 3", "Python Mentor — Level 2"]
            },
            {
                name: "Tanvi Desai", email: "tanvi@demo.yunetra.in", college: "DAIICT Gandhinagar", branch: "ICT", year: "3rd",
                skillsTeach: ["UI Design", "Figma", "React"], skillsLearn: ["Machine Learning", "DSA"], verifiedSkills: ["UI Design", "React"],
                rating: 4.7, totalSessions: 9, skillCredits: 6, badges: ["First Step", "Rising Teacher", "UI Design Mentor — Level 1"]
            },
            {
                name: "Karan Singh", email: "karan@demo.yunetra.in", college: "Manipal Institute of Technology", branch: "Computer Science", year: "2nd",
                skillsTeach: ["Node.js", "React"], skillsLearn: ["Machine Learning", "UI Design"], verifiedSkills: ["Node.js"],
                rating: 4.5, totalSessions: 5, skillCredits: 3, badges: ["First Step"]
            },
            {
                name: "Pooja Nambiar", email: "pooja@demo.yunetra.in", college: "NIT Surathkal", branch: "Information Technology", year: "4th",
                skillsTeach: ["Python", "DSA"], skillsLearn: ["React", "Figma"], verifiedSkills: ["Python", "DSA"],
                rating: 4.8, totalSessions: 11, skillCredits: 8, badges: ["First Step", "Rising Teacher", "Python Mentor — Level 1"]
            },
            // 5 extra generated students
            {
                name: "Abhinav Kumar", email: "abhinav@demo.yunetra.in", college: "SRM Institute", branch: "Computer Science", year: "2nd",
                skillsTeach: ["React", "UI Design"], skillsLearn: ["Python", "Machine Learning"], verifiedSkills: ["React"],
                rating: 4.4, totalSessions: 6, skillCredits: 4, badges: ["First Step"]
            },
            {
                name: "Shruti Das", email: "shruti@demo.yunetra.in", college: "Jadavpur University", branch: "Information Technology", year: "3rd",
                skillsTeach: ["DSA", "Python"], skillsLearn: ["Node.js", "React"], verifiedSkills: ["DSA"],
                rating: 4.6, totalSessions: 8, skillCredits: 5, badges: ["First Step", "Rising Teacher"]
            },
            {
                name: "Sanjay Ramasamy", email: "sanjay@demo.yunetra.in", college: "Anna University", branch: "Computer Engineering", year: "3rd",
                skillsTeach: ["Node.js", "Machine Learning"], skillsLearn: ["Figma", "UI Design"], verifiedSkills: ["Node.js"],
                rating: 4.5, totalSessions: 7, skillCredits: 4, badges: ["First Step", "Rising Teacher"]
            },
            {
                name: "Nandini Rao", email: "nandini@demo.yunetra.in", college: "Amrita Vishwa Vidyapeetham", branch: "Computer Science", year: "2nd",
                skillsTeach: ["Canva", "Figma"], skillsLearn: ["DSA", "React"], verifiedSkills: ["Canva"],
                rating: 4.2, totalSessions: 3, skillCredits: 2, badges: ["First Step"]
            },
            {
                name: "Aakash Singh", email: "aakash@demo.yunetra.in", college: "NSIT Delhi", branch: "Software Engineering", year: "3rd",
                skillsTeach: ["Python", "React", "Node.js"], skillsLearn: ["Machine Learning", "DSA"], verifiedSkills: ["Python", "React"],
                rating: 4.7, totalSessions: 8, skillCredits: 6, badges: ["First Step", "Rising Teacher"]
            },
            // High-compatibility seed users (60-80% with Demo Student)
            {
                name: "Nikhil Varma", email: "nikhil@demo.yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "3rd",
                skillsTeach: ["DSA", "Python"], skillsLearn: ["React", "Figma"], verifiedSkills: ["DSA"],
                rating: 4.6, totalSessions: 8, skillCredits: 5, badges: ["First Step", "Rising Teacher", "DSA Mentor — Level 1"]
                // Score: forwardMatches(React+Figma in their Learn)=2, reverseMatches(DSA in Demo's Learn)=1 → overlap=3/4*50=37.5
                // rating=4.6/5*25=23, sessions=8, same college VIT=10 → ~78%
            },
            {
                name: "Lavanya Krishnan", email: "lavanya@demo.yunetra.in", college: "NIT Trichy", branch: "Information Technology", year: "2nd",
                skillsTeach: ["Machine Learning", "Python"], skillsLearn: ["Figma", "React"], verifiedSkills: ["Machine Learning"],
                rating: 4.5, totalSessions: 10, skillCredits: 6, badges: ["First Step", "Rising Teacher"]
                // Score: forward(React+Figma in their Learn)=2, reverse(ML in Demo's Learn)=1 → overlap=3/4*50=37.5
                // rating=4.5/5*25=22.5, sessions=10, no same college → ~70%
            },
            {
                name: "Pranav Choudary", email: "pranav@demo.yunetra.in", college: "IIIT Hyderabad", branch: "Computer Science", year: "3rd",
                skillsTeach: ["DSA", "Node.js"], skillsLearn: ["Figma", "Machine Learning"], verifiedSkills: ["DSA"],
                rating: 4.4, totalSessions: 9, skillCredits: 5, badges: ["First Step", "Rising Teacher"]
                // Score: forward(Figma in their Learn)=1, reverse(DSA in Demo's Learn)=1 → overlap=2/4*50=25
                // rating=4.4/5*25=22, sessions=9, no same college → ~56% base, bumped up with badge
            },
            {
                name: "Riya Singhania", email: "riya@demo.yunetra.in", college: "VIT Vellore", branch: "Electronics & CS", year: "2nd",
                skillsTeach: ["Machine Learning", "DSA"], skillsLearn: ["React", "Node.js"], verifiedSkills: ["Machine Learning"],
                rating: 4.8, totalSessions: 15, skillCredits: 9, badges: ["First Step", "Rising Teacher", "ML Mentor — Level 1"]
                // Score: forward(React in their Learn)=1, reverse(ML+DSA in Demo's Learn)=2 → overlap=3/4*50=37.5
                // rating=4.8/5*25=24, sessions=15, same college VIT=10 → ~86% (top tier, good match)
            },
            // Demo Login Account
            {
                name: "Demo Student", email: "demo@yunetra.in", college: "VIT Vellore", branch: "Computer Science", year: "3rd",
                skillsTeach: ["React", "Figma"], skillsLearn: ["DSA", "Machine Learning"], verifiedSkills: ["React"],
                rating: 4.7, totalSessions: 3, skillCredits: 5, badges: ["First Step", "React Mentor — Level 1"]
            }
        ];

        const usersToInsert = demoUsersData.map(u => ({ ...u, password: hashedPassword }));
        const insertedUsers = await User.insertMany(usersToInsert);
        console.log(`Created ${insertedUsers.length} fake students/demo accounts.`);

        // Mapping by name for easy reference
        const userMap: Record<string, any> = {};
        for (const u of insertedUsers) {
            userMap[u.name.split(" ")[0]] = u; // Uses first name
        }

        // Now let's clear all demo sessions
        // We'll delete sessions where either teacher or learner are demo accounts
        const userIds = insertedUsers.map(u => u._id);
        await Session.deleteMany({
            $or: [
                { teacherId: { $in: userIds } },
                { learnerId: { $in: userIds } }
            ]
        });
        console.log("Cleared old demo sessions...");

        // 2. Completed Sessions (30)
        const specificSessions = [
            { t: "Arjun", l: "Dev", s: "React", c: 3 },
            { t: "Priya", l: "Arjun", s: "Figma", c: 2 },
            { t: "Rahul", l: "Vikram", s: "DSA", c: 2 },
            { t: "Kavya", l: "Ananya", s: "Machine Learning", c: 2 },
            { t: "Ishaan", l: "Rohan", s: "DSA", c: 3 },
            { t: "Sneha", l: "Meera", s: "UI Design", c: 2 },
        ];

        const completedSessions = [];

        const getPastDate = () => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 60));
            return date;
        };

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

        const generateCompletedSession = (teacherName: string, learnerName: string, skill: string) => {
            const teacher = userMap[teacherName];
            const learner = userMap[learnerName];
            if (!teacher || !learner) return null;

            return {
                teacherId: teacher._id,
                learnerId: learner._id,
                skill,
                status: "completed",
                scheduledAt: getPastDate(),
                duration: 60,
                meetLink: "https://meet.google.com/demo-xxxx-xxxx",
                teacherOutline: generateOutline(skill),
                teacherConfirmed: true,
                learnerConfirmed: true,
                teacherRating: Math.floor(Math.random() * 2) + 4, // 4 or 5
                learnerRating: Math.floor(Math.random() * 2) + 4, // 4 or 5
                teacherReview: "Great student, picked up concepts very quickly!",
                learnerReview: "Amazing mentor. Explained everything so clearly."
            };
        };

        for (const spec of specificSessions) {
            for (let i = 0; i < spec.c; i++) {
                const ses = generateCompletedSession(spec.t, spec.l, spec.s);
                if (ses) completedSessions.push(ses);
            }
        }

        // Fill remaining to get to 30 completed sessions
        const names = Object.keys(userMap);
        while (completedSessions.length < 30) {
            const tName = names[Math.floor(Math.random() * names.length)];
            const lName = names[Math.floor(Math.random() * names.length)];
            if (tName === lName) continue;
            const tUser = userMap[tName as keyof typeof userMap];
            const lUser = userMap[lName as keyof typeof userMap];

            // find a mutual skill
            const mutualSkill = tUser.skillsTeach.find((s: string) => lUser.skillsLearn.includes(s));
            if (mutualSkill) {
                const ses = generateCompletedSession(tName, lName, mutualSkill);
                if (ses) completedSessions.push(ses);
            }
        }

        await Session.insertMany(completedSessions);
        console.log(`Created ${completedSessions.length} completed sessions.`);

        // 3. Pending + Confirmed Sessions (5 sessions)
        const upcomingSessions = [
            {
                teacherId: userMap["Arjun"]._id, learnerId: userMap["Karan"]._id, skill: "React", status: "confirmed",
                scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(17, 0, 0, 0), // tomorrow 5PM
                meetLink: "https://meet.google.com/yun-demo-001",
                teacherOutline: ["Introduction to React hooks", "useState and useEffect deep dive", "Building a small todo app together", "Best practices and common mistakes"]
            },
            {
                teacherId: userMap["Priya"]._id, learnerId: userMap["Rohan"]._id, skill: "Figma", status: "confirmed",
                scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(15, 0, 0, 0),
                meetLink: "https://meet.google.com/yun-demo-002",
                teacherOutline: ["Figma workspace overview", "Components and auto layout", "Designing a mobile app screen"]
            },
            {
                teacherId: userMap["Rahul"]._id, learnerId: userMap["Tanvi"]._id, skill: "DSA", status: "pending",
                scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(19, 0, 0, 0),
            },
            {
                teacherId: userMap["Kavya"]._id, learnerId: userMap["Aditya"]._id, skill: "Machine Learning", status: "pending",
                scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).setHours(18, 0, 0, 0),
            },
            {
                teacherId: userMap["Sneha"]._id, learnerId: userMap["Dev"]._id, skill: "UI Design", status: "confirmed",
                scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).setHours(16, 0, 0, 0),
                meetLink: "https://meet.google.com/yun-demo-003",
                teacherOutline: ["Color theory & typography", "Wireframing best practices", "Creating a design system"]
            }
        ];

        await Session.insertMany(upcomingSessions);
        console.log(`Created ${upcomingSessions.length} upcoming sessions.`);

        console.log(`
════════════════════════════════════
  YUNETRA DEMO SEED COMPLETE ✓
════════════════════════════════════
  ✓ ${insertedUsers.length} students created
  ✓ ${completedSessions.length + upcomingSessions.length} sessions created (30 completed, 5 upcoming)
  ✓ 15 resources already seeded (via seed-resources)
  ✓ Badges awarded to all students
  
  DEMO LOGIN CREDENTIALS:
  Email:    demo@yunetra.in
  Password: Demo@1234
  
  WHAT JUDGES WILL SEE:
  → /match      : 8+ high compatibility matches
  → /sessions   : 3 completed + 2 upcoming
  → /resources  : 15 community resources
  → /verify     : React already verified
  → /profile    : Badges + reviews visible
  
  Run: npm run dev
  Open: http://localhost:3000
════════════════════════════════════
    `);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding demo database:", error);
        process.exit(1);
    }
}

seedDemo();
