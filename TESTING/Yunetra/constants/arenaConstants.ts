// ===================================
// YUNETRA ARENA - COMPREHENSIVE CONSTANTS
// Supporting ALL skill categories across ALL domains
// ===================================

export const ARENA_CATEGORIES = {
  tech_development: {
    id: 'tech_development',
    label: 'Tech Development',
    icon: '💻',
    color: '#38bdf8',
    description: 'Coding, apps, websites, tools'
  },
  ui_ux_design: {
    id: 'ui_ux_design',
    label: 'UI/UX Design',
    icon: '🎨',
    color: '#a78bfa',
    description: 'Figma, wireframes, prototypes'
  },
  graphic_design: {
    id: 'graphic_design',
    label: 'Graphic Design',
    icon: '✏️',
    color: '#f472b6',
    description: 'Posters, logos, branding, illustrations'
  },
  video_editing: {
    id: 'video_editing',
    label: 'Video Editing',
    icon: '🎬',
    color: '#fb923c',
    description: 'Reels, short films, ads, documentaries'
  },
  vfx_motion: {
    id: 'vfx_motion',
    label: 'VFX & Motion',
    icon: '✨',
    color: '#e879f9',
    description: 'Visual effects, motion graphics, 3D animation'
  },
  content_writing: {
    id: 'content_writing',
    label: 'Content Writing',
    icon: '✍️',
    color: '#34d399',
    description: 'Articles, blogs, scripts, copywriting'
  },
  digital_marketing: {
    id: 'digital_marketing',
    label: 'Digital Marketing',
    icon: '📱',
    color: '#60a5fa',
    description: 'Campaigns, social media, SEO, ads'
  },
  music_production: {
    id: 'music_production',
    label: 'Music Production',
    icon: '🎵',
    color: '#f59e0b',
    description: 'Compositions, soundtracks, jingles'
  },
  photography: {
    id: 'photography',
    label: 'Photography',
    icon: '📸',
    color: '#a3e635',
    description: 'Photo essays, product photography, editing'
  },
  business_strategy: {
    id: 'business_strategy',
    label: 'Business Strategy',
    icon: '📈',
    color: '#2dd4bf',
    description: 'GTM, market research, business plans'
  },
  data_analytics: {
    id: 'data_analytics',
    label: 'Data Analytics',
    icon: '📊',
    color: '#818cf8',
    description: 'Dashboards, insights, reports'
  },
  social_impact: {
    id: 'social_impact',
    label: 'Social Impact',
    icon: '💚',
    color: '#00d4aa',
    description: 'Any skill applied to social good'
  }
} as const;

export const ALL_SKILL_TAGS = [
  // Tech
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
  'Flask', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Flutter', 'React Native',
  'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning',
  'Deep Learning', 'Data Science', 'Computer Vision', 'NLP', 'Blockchain',
  'Cybersecurity', 'System Design', 'DevOps', 'Unity', 'Game Development',
  'Embedded Systems', 'IoT', 'AR/VR Development',

  // Design
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Graphic Design',
  'Poster Design', 'Logo Design', 'Brand Identity', 'Illustration',
  'Typography', 'Color Theory', 'Print Design', 'Packaging Design',
  'Infographic Design', 'Social Media Design', 'Motion Graphics',
  '3D Design', 'Blender', 'Cinema 4D', 'Adobe Illustrator',
  'Adobe Photoshop', 'Adobe InDesign', 'Canva', 'Procreate',

  // Video & VFX
  'Video Editing', 'Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve',
  'After Effects', 'VFX', 'Color Grading', 'Sound Design', 
  '3D Animation', 'Character Animation', 'Visual Storytelling', 'Storyboarding',
  'Cinematography', 'Drone Footage', 'Short Film Making', 'Documentary',
  'YouTube Content', 'Instagram Reels', 'TikTok Editing', 'Subtitling',
  'Green Screen', 'Rotoscoping', 'Compositing', 'Blender 3D',

  // Content & Writing
  'Content Writing', 'Copywriting', 'Scriptwriting', 'Blog Writing',
  'Technical Writing', 'Creative Writing', 'Journalism', 'Proofreading',
  'SEO Writing', 'Social Media Captions', 'Email Marketing Copy',
  'Product Descriptions', 'UX Writing', 'Grant Writing', 'Resume Writing',

  // Marketing
  'Digital Marketing', 'Social Media Marketing', 'SEO', 'Google Ads',
  'Meta Ads', 'Email Marketing', 'Influencer Marketing', 'Content Strategy',
  'Brand Strategy', 'Market Research', 'Growth Hacking', 'Community Management',
  'Public Relations', 'Event Marketing', 'Affiliate Marketing',

  // Music & Audio
  'Music Production', 'Beat Making', 'Audio Editing', 
  'Mixing', 'Mastering', 'Jingle Creation', 'Podcast Production',
  'Voice Over', 'FL Studio', 'Ableton Live', 'Logic Pro', 'GarageBand',
  'Soundtrack Composition', 'Foley Art',

  // Photography
  'Photography', 'Photo Editing', 'Adobe Lightroom',
  'Product Photography', 'Portrait Photography', 'Event Photography',
  'Photo Retouching', 'Photo Essay', 'Street Photography',

  // Business
  'Product Management', 'Business Strategy', 'Market Analysis',
  'Financial Modeling', 'Startup Strategy', 'Go-To-Market Planning',
  'Operations Management', 'Agile', 'Scrum', 'Project Management',
  'Business Plan Writing', 'Pitch Deck Creation', 'Investment Analysis',

  // Data
  'Data Analysis', 'Excel', 'Power BI', 'Tableau', 'Google Analytics',
  'Data Visualization', 'SQL', 'Statistics', 'Research Methods',
  'Survey Design', 'Report Writing',
  
  // Additional cross-category skills
  'User Research', 'Prototyping', 'Instagram', 'Wireframing'
];

export const SUBMISSION_TYPES = {
  tech_development: {
    required: ['githubLink'],
    optional: ['liveLink', 'videoDemo', 'pdfReport'],
    labels: {
      githubLink: 'GitHub Repository Link',
      liveLink: 'Live Demo URL',
      videoDemo: 'Demo Video (YouTube/Loom)',
      pdfReport: 'Documentation PDF Link'
    }
  },

  ui_ux_design: {
    required: ['figmaLink'],
    optional: ['videoWalkthrough', 'pdfCaseStudy', 'prototypeLink'],
    labels: {
      figmaLink: 'Figma File Link (view access required)',
      videoWalkthrough: 'Walkthrough Video (YouTube/Loom)',
      pdfCaseStudy: 'Case Study PDF Link',
      prototypeLink: 'Interactive Prototype Link'
    }
  },

  graphic_design: {
    required: ['driveLink'],
    optional: ['behanceLink', 'pdfPresentation', 'videoPresentation'],
    labels: {
      driveLink: 'Google Drive / Dropbox Link (images/files)',
      behanceLink: 'Behance / Portfolio Link',
      pdfPresentation: 'Presentation PDF Link',
      videoPresentation: 'Process Video (optional)'
    }
  },

  video_editing: {
    required: ['videoLink'],
    optional: ['driveLink', 'scriptLink', 'description'],
    labels: {
      videoLink: 'Final Video Link (YouTube / Vimeo / Drive)',
      driveLink: 'Project Files (optional)',
      scriptLink: 'Script / Storyboard Link',
      description: 'Brief description of your approach'
    }
  },

  vfx_motion: {
    required: ['videoLink'],
    optional: ['driveLink', 'behanceLink', 'breakdownVideo'],
    labels: {
      videoLink: 'Final Output Video (YouTube / Vimeo / Drive)',
      driveLink: 'Project Files Link',
      behanceLink: 'Behance / ArtStation Portfolio',
      breakdownVideo: 'VFX Breakdown Video (optional)'
    }
  },

  content_writing: {
    required: ['documentLink'],
    optional: ['additionalLinks', 'pdfVersion'],
    labels: {
      documentLink: 'Google Doc / Medium / Blog Link',
      additionalLinks: 'Additional References',
      pdfVersion: 'PDF Version Link'
    }
  },

  digital_marketing: {
    required: ['presentationLink'],
    optional: ['campaignLinks', 'analyticsScreenshots', 'videoPresentation'],
    labels: {
      presentationLink: 'Strategy Presentation (Google Slides / PDF)',
      campaignLinks: 'Campaign / Ad Links',
      analyticsScreenshots: 'Analytics Screenshots (Drive)',
      videoPresentation: 'Pitch Video (optional)'
    }
  },

  music_production: {
    required: ['audioLink'],
    optional: ['videoLink', 'projectFiles', 'description'],
    labels: {
      audioLink: 'Audio Link (SoundCloud / Drive / YouTube)',
      videoLink: 'Music Video or Visualizer (optional)',
      projectFiles: 'Project Files Link (optional)',
      description: 'Production notes and approach'
    }
  },

  photography: {
    required: ['driveLink'],
    optional: ['behanceLink', 'videoSlideshow', 'editingProcess'],
    labels: {
      driveLink: 'Photos Drive Link (Google Drive / Flickr)',
      behanceLink: 'Behance / Portfolio Link',
      videoSlideshow: 'Photo Slideshow Video (optional)',
      editingProcess: 'Editing Process Video (optional)'
    }
  },

  business_strategy: {
    required: ['presentationLink'],
    optional: ['videoPitch', 'spreadsheetLink', 'additionalDocs'],
    labels: {
      presentationLink: 'Pitch Deck / Strategy Doc (Google Slides / PDF)',
      videoPitch: 'Video Pitch (YouTube / Loom)',
      spreadsheetLink: 'Financial Model / Data (Google Sheets)',
      additionalDocs: 'Supporting Documents'
    }
  },

  data_analytics: {
    required: ['dashboardLink'],
    optional: ['githubLink', 'videoWalkthrough', 'reportLink'],
    labels: {
      dashboardLink: 'Dashboard Link (Tableau / Power BI / Colab)',
      githubLink: 'Code Repository',
      videoWalkthrough: 'Dashboard Walkthrough Video',
      reportLink: 'Full Report PDF'
    }
  },

  social_impact: {
    required: ['presentationLink'],
    optional: ['videoLink', 'githubLink', 'driveLink'],
    labels: {
      presentationLink: 'Project Presentation Link',
      videoLink: 'Demo / Documentary Video',
      githubLink: 'Code Repository (if technical)',
      driveLink: 'Supporting Materials'
    }
  }
} as const;

export const DIFFICULTY_LABELS = {
  beginner: {
    label: 'Beginner',
    color: '#34d399',
    description: 'Perfect for those starting out'
  },
  intermediate: {
    label: 'Intermediate',
    color: '#f59e0b',
    description: 'Requires some experience'
  },
  advanced: {
    label: 'Advanced',
    color: '#f43f5e',
    description: 'For experienced practitioners'
  }
} as const;

export const PRIZE_TYPE_LABELS = {
  cash: 'Cash Prize',
  internship: 'Internship Opportunity',
  both: 'Cash + Internship'
} as const;

export type ArenaCategoryId = keyof typeof ARENA_CATEGORIES;
export type SubmissionTypeId = keyof typeof SUBMISSION_TYPES;
export type DifficultyLevel = keyof typeof DIFFICULTY_LABELS;
export type PrizeType = keyof typeof PRIZE_TYPE_LABELS;
