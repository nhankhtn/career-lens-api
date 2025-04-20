import { ISkill } from "src/models/skill.model";

export const skills: Partial<ISkill> & Pick<ISkill, "name">[] = [
  // 💻 Programming Languages
  { name: "JavaScript" },
  { name: "TypeScript" },
  { name: "Python" },
  { name: "Java" },
  { name: "C#" },
  { name: "C++" },
  { name: "Go" },
  { name: "Rust" },
  { name: "PHP" },
  { name: "Ruby" },
  { name: "Kotlin" },
  { name: "Swift" },
  { name: "Shell Script" },
  { name: "Perl" },
  { name: "R" },

  // 🌐 Frontend
  { name: "HTML" },
  { name: "CSS" },
  { name: "Sass" },
  { name: "Tailwind CSS" },
  { name: "ReactJS" },
  { name: "React" },
  { name: "NextJS" },
  { name: "VueJS" },
  { name: "NuxtJS" },
  { name: "Angular" },
  { name: "Bootstrap" },
  { name: "Adobe XD" },
  { name: "Nghiên cứu người dùng" },
  { name: "Prototyping" },
  { name: "Framer Motion" },
  { name: "Three.js" },
  { name: "Zustand" },
  { name: "Storybook" },
  { name: "Node.js" },

  // 🖥 Backend
  { name: "NodeJS" },
  { name: "ExpressJS" },
  { name: "NestJS" },
  { name: "Django" },
  { name: "Flask" },
  { name: "Spring Boot" },
  { name: "Laravel" },
  { name: "Ruby on Rails" },
  { name: "GraphQL" },
  { name: "Apollo Server" },
  { name: "Prisma" },
  { name: "tRPC" },

  // 🛢 Databases
  { name: "MongoDB" },
  { name: "PostgreSQL" },
  { name: "MySQL" },
  { name: "SQLite" },
  { name: "Redis" },
  { name: "Firebase" },
  { name: "ElasticSearch" },
  { name: "Neo4j" },

  // ☁ DevOps & Infrastructure
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "AWS" },
  { name: "Azure" },
  { name: "Google Cloud Platform" },
  { name: "Nginx" },
  { name: "CI/CD" },
  { name: "Terraform" },
  { name: "Ansible" },
  { name: "Prometheus" },
  { name: "Grafana" },

  // ⚙ Tools & Others
  { name: "Git" },
  { name: "GitHub" },
  { name: "Jira" },
  { name: "Figma" },
  { name: "Postman" },
  { name: "Linux" },
  { name: "VSCode" },

  // 📊 Data Science & AI
  { name: "Pandas" },
  { name: "NumPy" },
  { name: "Scikit-learn" },
  { name: "TensorFlow" },
  { name: "PyTorch" },
  { name: "Matplotlib" },
  { name: "Power BI" },
  { name: "Học máy" },
  { name: "Jupyter Notebook" },
  { name: "OpenCV" },
  { name: "LangChain" },
  { name: "Hugging Face Transformers" },

  // 🔐 Security
  { name: "JWT" },
  { name: "OAuth2" },
  { name: "SSL/TLS" },
  { name: "Bảo mật mạng" },
  { name: "Tường lửa" },
  { name: "SIEM" },
  { name: "Hack đạo đức" },
  { name: "Burp Suite" },
  { name: "Metasploit" },
  { name: "Wireshark" },

  // 📱 Mobile Dev
  { name: "React Native" },
  { name: "Flutter" },
  { name: "SwiftUI" },
  { name: "Android Studio" },
  { name: "Xcode" },

  // 🧪 Testing
  { name: "Jest" },
  { name: "Cypress" },
  { name: "Mocha" },
  { name: "Playwright" },
  { name: "TestCafe" },
  { name: "Testing Library" },
  { name: "K6" },

  // ⚙ Tools & Others
  { name: "Notion" },
  { name: "Slack" },
  { name: "ClickUp" },
  { name: "Confluence" },
  { name: "Chrome DevTools" },
  { name: "Zotero" },

  // IT Support Specialist
  { name: "Helpdesk" },
  { name: "Khắc phục sự cố" },
  { name: "Hỗ trợ khách hàng" },
  { name: "Mạng" },

  // Game Developer
  { name: "Unity" },
  { name: "Unreal Engine" },
  { name: "C#" },
  { name: "Mô hình 3D" },

  // Technical Writer
  { name: "Markdown" },
  { name: "Tài liệu API" },
  { name: "Viết" },
  { name: "Chú ý đến chi tiết" },

  // Network Administrator
  { name: "Tường lửa" },
  { name: "VPN" },
  { name: "Cisco" },

  // Digital Marketer
  { name: "SEO" },
  { name: "Google Analytics" },
  { name: "Mạng xã hội" },
  { name: "Tiếp thị qua email" },

  // Robotics Engineer
  { name: "C++" },
  { name: "ROS" },
  { name: "Cảm biến" },
  { name: "Hệ thống điều khiển" },

  // Computer Vision Engineer
  { name: "OpenCV" },
  { name: "Python" },
  { name: "Xử lý ảnh" },
  { name: "Học máy" },

  // Database Administrator
  { name: "SQL" },
  { name: "MySQL" },
  { name: "PostgreSQL" },
  { name: "Oracle" },

  // System Architect
  { name: "Thiết kế hệ thống" },
  { name: "Điện toán đám mây" },
  { name: "Mạng" },
  { name: "Tự động hóa" },

  // SEO Specialist
  { name: "Keyword Research" },

  // Network Engineer
  { name: "TCP/IP" },
  { name: "Routing" },
  { name: "Switching" },

  // Cloud Solutions Architect
  { name: "GCP" },
  { name: "Cloud Security" },

  // Artificial Intelligence Researcher
  { name: "Machine Learning" },
  { name: "Deep Learning" },
  { name: "Neural Networks" },

  // Content Strategist
  { name: "Content Strategy" },
  { name: "Writing" },
  { name: "Social Media" },

  // Marketing Manager
  { name: "Market Research" },
  { name: "Advertising" },
  { name: "Campaign Management" },
  { name: "Analytics" },

  // Legal Counsel
  { name: "Contract Law" },
  { name: "Legal Research" },
  { name: "Compliance" },
  { name: "Negotiation" },

  // Human Resources Manager
  { name: "Recruitment" },
  { name: "Employee Relations" },
  { name: "Performance Management" },
  { name: "HR Strategy" },

  // Financial Analyst
  { name: "Financial Modeling" },
  { name: "Excel" },
  { name: "Financial Analysis" },
  { name: "Investment Strategy" },

  // Operations Manager
  { name: "Logistics" },
  { name: "Supply Chain" },
  { name: "Operations Strategy" },

  // Agricultural Engineer
  { name: "Agricultural Systems" },
  { name: "Sustainability" },
  { name: "Engineering Design" },
  { name: "Soil Science" },

  // Marine Biologist
  { name: "Marine Ecology" },
  { name: "Field Research" },
  { name: "Oceanography" },
  { name: "Biology" },

  // Meteorologist
  { name: "Climate Modeling" },
  { name: "Data Analysis" },
  { name: "Meteorological Equipment" },
  { name: "Statistics" },

  // Biomedical Engineer
  { name: "Biomedical Devices" },
  { name: "Medical Imaging" },
  { name: "Bioinformatics" },
  { name: "CAD" },

  // Chartered Accountant
  { name: "Accounting" },
  { name: "Taxation" },
  { name: "Audit" },
  { name: "Financial Reporting" },

  // Clinical Psychologist
  { name: "Therapy" },
  { name: "Cognitive Behavioral Therapy" },
  { name: "Psychological Assessment" },
  { name: "Mental Health" },

  // Social Worker
  { name: "Counseling" },
  { name: "Social Services" },
  { name: "Crisis Management" },
  { name: "Advocacy" },

  // Event Planner
  { name: "Event Coordination" },
  { name: "Vendor Management" },
  { name: "Project Management" },
  { name: "Communication" },

  // Real Estate Agent
  { name: "Real Estate Law" },
  { name: "Property Management" },
  { name: "Sales" },

  // Chiropractor
  { name: "Chiropractic Care" },
  { name: "Musculoskeletal Assessment" },
  { name: "Patient Care" },
  { name: "Spinal Manipulation" },

  // Film Director
  { name: "Film Production" },
  { name: "Directing" },
  { name: "Scriptwriting" },
  { name: "Cinematography" },

  // Veterinarian
  { name: "Animal Care" },
  { name: "Surgery" },
  { name: "Veterinary Medicine" },
  { name: "Diagnostics" },

  // Dietitian
  { name: "Nutrition" },
  { name: "Health Education" },
  { name: "Diet Plans" },
  { name: "Medical Nutrition Therapy" },

  // Art Curator
  { name: "Art History" },
  { name: "Museum Management" },
  { name: "Exhibit Planning" },
  { name: "Curation" },

  // Speech-Language Pathologist
  { name: "Speech Therapy" },
  { name: "Language Development" },
  { name: "Swallowing Therapy" },

  // Astronomer
  { name: "Astronomy" },
  { name: "Physics" },
  { name: "Astrophysics" },
  { name: "Observational Skills" },

  // Interior Designer
  { name: "Space Planning" },
  { name: "CAD Software" },
  { name: "Color Theory" },
  { name: "Interior Decoration" },

  // Pilot
  { name: "Flight Training" },
  { name: "Navigation" },
  { name: "Air Traffic Control" },
  { name: "Aviation Safety" },

  // Forensic Scientist
  { name: "Crime Scene Investigation" },
  { name: "Lab Analysis" },
  { name: "Evidence Collection" },
  { name: "Criminal Justice" },

  // Park Ranger
  { name: "Environmental Conservation" },
  { name: "Wildlife Management" },
  { name: "Public Education" },
  { name: "First Aid" },

  // Fashion Designer
  { name: "Fashion Design" },
  { name: "Textile Knowledge" },
  { name: "Sewing" },
  { name: "Trend Analysis" },

  // Interpreter
  { name: "Language Proficiency" },
  { name: "Interpretation" },
  { name: "Cultural Knowledge" },
];
