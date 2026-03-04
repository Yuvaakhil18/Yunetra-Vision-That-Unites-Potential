const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const QuestionSchema = new mongoose.Schema({
    skill: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const questionsData = [
    // React
    { skill: 'React', question: 'What is the purpose of useState?', options: ['Manage side effects', 'Manage local component state', 'Fetch data from APIs', 'Route between pages'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'React', question: 'Which hook is best for DOM manipulation?', options: ['useEffect', 'useMemo', 'useRef', 'useCallback'], correctAnswer: 2, difficulty: 'medium' },
    { skill: 'React', question: 'What does a React context provider do?', options: ['Passes data deeply throughout the tree', 'Renders children directly', 'Provides an isolated CSS scope', 'Stores data persistently'], correctAnswer: 0, difficulty: 'easy' },
    { skill: 'React', question: 'How do you prevent a component from re-rendering unecessarily?', options: ['React.memo', 'return false', 'shouldUpdate', 'ComponentDidMount'], correctAnswer: 0, difficulty: 'medium' },
    { skill: 'React', question: 'What does useEffect do when the dependency array is empty []?', options: ['Runs on every render', 'Runs only on the first render (mount)', 'Runs when any prop changes', 'Never runs'], correctAnswer: 1, difficulty: 'easy' },

    // Figma
    { skill: 'Figma', question: 'What shortcut groups selected elements in Figma?', options: ['Ctrl/Cmd + G', 'Ctrl/Cmd + J', 'Shift + G', 'Alt + G'], correctAnswer: 0, difficulty: 'easy' },
    { skill: 'Figma', question: 'Auto Layout is used primarily for:', options: ['Creating vector illustrations', 'Adding animation to prototypes', 'Creating responsive and structured layouts', 'Exporting assets automatically'], correctAnswer: 2, difficulty: 'medium' },
    { skill: 'Figma', question: 'What does creating a Component do?', options: ['Saves the file to the cloud', 'Creates a reusable master element', 'Converts vector to raster', 'Exports the element as CSS'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'Figma', question: 'Which tool is used to draw custom vector shapes?', options: ['Frame Tool', 'Slice Tool', 'Pen Tool', 'Hand Tool'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'Figma', question: 'What feature allows you to link specific colors across a project?', options: ['Color Variants', 'Local Styles', 'Paint Buckets', 'Fill Overrides'], correctAnswer: 1, difficulty: 'medium' },

    // DSA
    { skill: 'DSA', question: 'What is the time complexity of searching in a balanced Binary Search Tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'DSA', question: 'Which data structure uses LIFO (Last In First Out)?', options: ['Queue', 'Linked List', 'Stack', 'Tree'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'DSA', question: 'What is the worst-case space complexity of QuickSort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 2, difficulty: 'hard' },
    { skill: 'DSA', question: 'Which traversal visits BST nodes in ascending order?', options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], correctAnswer: 1, difficulty: 'medium' },
    { skill: 'DSA', question: 'What algorithm finds the shortest path in a weighted graph?', options: ['Depth First Search', 'Breadth First Search', 'Dijkstras Algorithm', 'Kruskals Algorithm'], correctAnswer: 2, difficulty: 'medium' },

    // Node.js
    { skill: 'Node.js', question: 'What engine powers Node.js?', options: ['SpiderMonkey', 'V8', 'Chakra', 'JavaScriptCore'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'Node.js', question: 'How does Node.js handle asynchronous operations?', options: ['Multi-threading', 'Event Loop', 'Web Workers', 'Mutex Locks'], correctAnswer: 1, difficulty: 'medium' },
    { skill: 'Node.js', question: 'Which core module is used to create a web server?', options: ['fs', 'path', 'http', 'url'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'Node.js', question: 'What does npm stand for?', options: ['Node Package Manager', 'New Project Maker', 'Node Program Module', 'Non-blocking Package Manager'], correctAnswer: 0, difficulty: 'easy' },
    { skill: 'Node.js', question: 'What is the purpose of module.exports?', options: ['To install a package', 'To expose code to other files', 'To import a file', 'To start the server'], correctAnswer: 1, difficulty: 'medium' },

    // Python
    { skill: 'Python', question: 'What is the correct way to create a function in Python?', options: ['function my_func():', 'create my_func():', 'def my_func():', 'void my_func():'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'Python', question: 'Which data collection is ordered and changeable?', options: ['Tuple', 'List', 'Set', 'Dictionary'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'Python', question: 'What does the __init__ method do?', options: ['Imports a module', 'Starts a loop', 'Initializes an object (constructor)', 'Deletes an object'], correctAnswer: 2, difficulty: 'medium' },
    { skill: 'Python', question: 'What is a lambda function?', options: ['A large block of code', 'A small anonymous function', 'A core module', 'A built-in loop'], correctAnswer: 1, difficulty: 'medium' },
    { skill: 'Python', question: 'Which keyword is used for error handling?', options: ['catch', 'except', 'error', 'throw'], correctAnswer: 1, difficulty: 'easy' },

    // Machine Learning
    { skill: 'Machine Learning', question: 'What is supervised learning?', options: ['Training without labels', 'Training on labeled data', 'A robot learning to walk', 'Querying a database'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'Machine Learning', question: 'What problem does overfitting describe?', options: ['Model is too simple', 'Model memorized training data and fails on new data', 'Training took too much memory', 'Not enough data was provided'], correctAnswer: 1, difficulty: 'medium' },
    { skill: 'Machine Learning', question: 'Which metric is best for imbalanced classification?', options: ['Accuracy', 'F1-Score', 'Mean Squared Error', 'R-squared'], correctAnswer: 1, difficulty: 'hard' },
    { skill: 'Machine Learning', question: 'What is a common use case for clustering algorithms?', options: ['Predicting house prices', 'Translating text', 'Customer segmentation', 'Object detection in images'], correctAnswer: 2, difficulty: 'medium' },
    { skill: 'Machine Learning', question: 'What does CNN stand for in deep learning?', options: ['Central Neural Network', 'Convolutional Neural Network', 'Computer Node Network', 'Complex Native Network'], correctAnswer: 1, difficulty: 'easy' },

    // Canva
    { skill: 'Canva', question: 'What is a Brand Kit in Canva used for?', options: ['Uploading videos', 'Storing specific colors, fonts, and logos', 'Hiring designers', 'Publishing websites'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'Canva', question: 'How can you remove the background from an image?', options: ['Background Remover tool', 'Eraser tool', 'Layer mask', 'Magic wand tool'], correctAnswer: 0, difficulty: 'easy' },
    { skill: 'Canva', question: 'What feature allows you to change dimensions instantly?', options: ['Crop tool', 'Magic Resize', 'Ruler tool', 'Aspect Ratio lock'], correctAnswer: 1, difficulty: 'medium' },
    { skill: 'Canva', question: 'Which of these is NOT a Canva export format?', options: ['PNG', 'PDF Print', 'PSD', 'MP4 Video'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'Canva', question: 'What is grouping used for?', options: ['To organize files in folders', 'To move multiple elements together as one', 'To combine layers into an image', 'To invite team members'], correctAnswer: 1, difficulty: 'easy' },

    // UI Design
    { skill: 'UI Design', question: 'What does UI stand for?', options: ['User Internet', 'Universal Interface', 'User Interface', 'Unique Integration'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'UI Design', question: 'Which color mode should be used for screen designs?', options: ['CMYK', 'Grayscale', 'RGB', 'Pantone'], correctAnswer: 2, difficulty: 'easy' },
    { skill: 'UI Design', question: 'What is the purpose of whitespace (negative space)?', options: ['To save file size', 'To improve readability and focus', 'To hide secret messages', 'Because clients like it'], correctAnswer: 1, difficulty: 'medium' },
    { skill: 'UI Design', question: 'What is typography?', options: ['The layout of images', 'The art and technique of arranging type', 'The psychology of color', 'The spacing of grid columns'], correctAnswer: 1, difficulty: 'easy' },
    { skill: 'UI Design', question: 'What is a wireframe?', options: ['A high-fidelity mockup', 'A coded prototype', 'A low-fidelity structural outline of a layout', 'A vector illustration'], correctAnswer: 2, difficulty: 'medium' }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        await Question.deleteMany({});
        console.log('Cleared existing questions');

        const result = await Question.insertMany(questionsData);
        console.log(`Inserted ${result.length} questions successfully`);

    } catch (err) {
        console.error('Seed Error:', err);
    } finally {
        mongoose.disconnect();
    }
}

seed();
