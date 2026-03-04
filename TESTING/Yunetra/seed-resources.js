require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// User schema mock for the script
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    college: String
});

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, maxlength: 200 },
    url: { type: String, required: true },
    type: {
        type: String,
        enum: ["course", "article", "notes", "internship", "roadmap", "tool"],
        required: true,
    },
    skill: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saveCount: { type: Number, default: 0 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);

const sampleResources = [
    { title: "Complete React Tutorial 2026", description: "The definitive guide to modern React including Hooks, Server Components, and Next.js 14.", url: "https://youtube.com", type: "course", skill: "React", verified: true, upvoteCount: 142, saveCount: 89 },
    { title: "React Context vs Redux", description: "A deep dive comparing state management libraries to help you choose the right tool.", url: "https://freecodecamp.org", type: "article", skill: "React", verified: false, upvoteCount: 45, saveCount: 12 },
    { title: "Figma UI Kit & Wireframes", description: "My personal component library for rapid wireframing. Free to duplicate.", url: "https://figma.com/community", type: "tool", skill: "Figma", verified: true, upvoteCount: 320, saveCount: 410 },
    { title: "Auto-Layout Mastery", description: "Learn how to build responsive components that scale flawlessly across devices.", url: "https://youtube.com", type: "course", skill: "Figma", verified: false, upvoteCount: 88, saveCount: 65 },
    { title: "Top 50 LeetCode Questions", description: "The definitive compilation of the most frequently asked Data Structure questions.", url: "https://leetcode.com/discuss", type: "notes", skill: "DSA", verified: true, upvoteCount: 890, saveCount: 950 },
    { title: "Graph Theory Algorithms", description: "Comprehensive notes breaking down Dijkstra, BFS, and DFS with animated examples.", url: "https://medium.com", type: "article", skill: "DSA", verified: false, upvoteCount: 56, saveCount: 80 },
    { title: "Backend Developer Roadmap", description: "Step-by-step visual roadmap guiding you from Internet basics through scaling Node applications.", url: "https://roadmap.sh/backend", type: "roadmap", skill: "Node.js", verified: true, upvoteCount: 450, saveCount: 600 },
    { title: "Building a REST API with Express", description: "A simple, easy-to-follow guide to routing, middleware, and database connections.", url: "https://dev.to", type: "article", skill: "Node.js", verified: false, upvoteCount: 34, saveCount: 22 },
    { title: "Python for Data Science", description: "Full 12-hour course covering Pandas, NumPy, and Matplotlib fundamentals.", url: "https://youtube.com", type: "course", skill: "Python", verified: true, upvoteCount: 210, saveCount: 175 },
    { title: "Python Clean Code Cheatsheet", description: "Quick reference for writing pythonic, maintainable code avoiding anti-patterns.", url: "https://github.com", type: "notes", skill: "Python", verified: false, upvoteCount: 110, saveCount: 140 },
    { title: "Machine Learning Concepts Explained", description: "Visualizing complex ML theories like gradient descent and backpropagation.", url: "https://towardsdatascience.com", type: "article", skill: "Machine Learning", verified: true, upvoteCount: 156, saveCount: 180 },
    { title: "Summer ML Research Intern", description: "Direct application link for the upcoming summer intake at Google DeepMind.", url: "https://careers.google.com", type: "internship", skill: "Machine Learning", verified: true, upvoteCount: 500, saveCount: 300 },
    { title: "Ultimate Canva Font Pairings", description: "A highly curated list of font combinations that guarantee professional designs.", url: "https://canva.com", type: "notes", skill: "Canva", verified: false, upvoteCount: 24, saveCount: 55 },
    { title: "Color Theory for Developers", description: "Bridging the gap between code and design: how to pick accessible, beautiful color palettes.", url: "https://css-tricks.com", type: "article", skill: "UI Design", verified: true, upvoteCount: 310, saveCount: 420 },
    { title: "Inspiring SaaS Landing Pages", description: "A continuously updated swipe file of the best UI patterns currently in production.", url: "https://godly.website", type: "tool", skill: "UI Design", verified: false, upvoteCount: 290, saveCount: 315 },
];

async function seedResources() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for Resource Seeding.");

        // Clean out old resources to prevent clutter
        await Resource.deleteMany({});
        console.log("Cleared existing resources.");

        // We need users to associate the resources with. We'll grab the first 3 users in the DB
        const users = await User.find().limit(3);
        if (users.length === 0) {
            console.error("No users found in database. Run the auth/session seeder first.");
            process.exit(1);
        }

        const resourcesToInsert = sampleResources.map((res, index) => {
            // Distribute randomly among the first few users
            const randomUser = users[index % users.length];
            return {
                ...res,
                uploadedBy: randomUser._id,
                // generate some random past dates
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            };
        });

        await Resource.insertMany(resourcesToInsert);
        console.log(`✅ Successfully seeded ${resourcesToInsert.length} resources!`);

    } catch (err) {
        console.error("Seeding Failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

seedResources();
