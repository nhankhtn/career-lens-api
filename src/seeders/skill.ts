import mongoose, { Types } from "mongoose";
import configEnv from "src/config/env";
import Skill, { ISkill } from "src/models/skill.model";

const skills: Partial<ISkill>[] = [
  // 💻 Programming Languages
  { _id: new Types.ObjectId(), name: "JavaScript" },
  { _id: new Types.ObjectId(), name: "TypeScript" },
  { _id: new Types.ObjectId(), name: "Python" },
  { _id: new Types.ObjectId(), name: "Java" },
  { _id: new Types.ObjectId(), name: "C#" },
  { _id: new Types.ObjectId(), name: "C++" },
  { _id: new Types.ObjectId(), name: "Go" },
  { _id: new Types.ObjectId(), name: "Rust" },
  { _id: new Types.ObjectId(), name: "PHP" },
  { _id: new Types.ObjectId(), name: "Ruby" },
  { _id: new Types.ObjectId(), name: "Kotlin" },
  { _id: new Types.ObjectId(), name: "Swift" },

  // 🌐 Frontend
  { _id: new Types.ObjectId(), name: "HTML" },
  { _id: new Types.ObjectId(), name: "CSS" },
  { _id: new Types.ObjectId(), name: "Sass" },
  { _id: new Types.ObjectId(), name: "Tailwind CSS" },
  { _id: new Types.ObjectId(), name: "ReactJS" },
  { _id: new Types.ObjectId(), name: "NextJS" },
  { _id: new Types.ObjectId(), name: "VueJS" },
  { _id: new Types.ObjectId(), name: "NuxtJS" },
  { _id: new Types.ObjectId(), name: "Angular" },
  { _id: new Types.ObjectId(), name: "Bootstrap" },

  // 🖥 Backend
  { _id: new Types.ObjectId(), name: "NodeJS" },
  { _id: new Types.ObjectId(), name: "ExpressJS" },
  { _id: new Types.ObjectId(), name: "NestJS" },
  { _id: new Types.ObjectId(), name: "Django" },
  { _id: new Types.ObjectId(), name: "Flask" },
  { _id: new Types.ObjectId(), name: "Spring Boot" },
  { _id: new Types.ObjectId(), name: "Laravel" },
  { _id: new Types.ObjectId(), name: "Ruby on Rails" },

  // 🛢 Databases
  { _id: new Types.ObjectId(), name: "MongoDB" },
  { _id: new Types.ObjectId(), name: "PostgreSQL" },
  { _id: new Types.ObjectId(), name: "MySQL" },
  { _id: new Types.ObjectId(), name: "SQLite" },
  { _id: new Types.ObjectId(), name: "Redis" },
  { _id: new Types.ObjectId(), name: "Firebase" },

  // ☁ DevOps & Infrastructure
  { _id: new Types.ObjectId(), name: "Docker" },
  { _id: new Types.ObjectId(), name: "Kubernetes" },
  { _id: new Types.ObjectId(), name: "AWS" },
  { _id: new Types.ObjectId(), name: "Azure" },
  { _id: new Types.ObjectId(), name: "Google Cloud Platform" },
  { _id: new Types.ObjectId(), name: "Nginx" },
  { _id: new Types.ObjectId(), name: "CI/CD" },

  // ⚙ Tools & Others
  { _id: new Types.ObjectId(), name: "Git" },
  { _id: new Types.ObjectId(), name: "GitHub" },
  { _id: new Types.ObjectId(), name: "Jira" },
  { _id: new Types.ObjectId(), name: "Figma" },
  { _id: new Types.ObjectId(), name: "Postman" },
  { _id: new Types.ObjectId(), name: "Linux" },
  { _id: new Types.ObjectId(), name: "VSCode" },

  // 📊 Data Science & AI
  { _id: new Types.ObjectId(), name: "Pandas" },
  { _id: new Types.ObjectId(), name: "NumPy" },
  { _id: new Types.ObjectId(), name: "Scikit-learn" },
  { _id: new Types.ObjectId(), name: "TensorFlow" },
  { _id: new Types.ObjectId(), name: "PyTorch" },
  { _id: new Types.ObjectId(), name: "Matplotlib" },
  { _id: new Types.ObjectId(), name: "Power BI" },

  // 🔐 Security
  { _id: new Types.ObjectId(), name: "JWT" },
  { _id: new Types.ObjectId(), name: "OAuth2" },
  { _id: new Types.ObjectId(), name: "SSL/TLS" },

  // 📱 Mobile Dev
  { _id: new Types.ObjectId(), name: "React Native" },
  { _id: new Types.ObjectId(), name: "Flutter" },
  { _id: new Types.ObjectId(), name: "SwiftUI" },

  // 🧪 Testing
  { _id: new Types.ObjectId(), name: "Jest" },
  { _id: new Types.ObjectId(), name: "Cypress" },
  { _id: new Types.ObjectId(), name: "Mocha" },
  { _id: new Types.ObjectId(), name: "Playwright" },
];
const seed = async () => {
  try {
    // Connect to database
    await mongoose.connect(configEnv.DATABASE_URL);
    console.log("Connected to MongoDB");

    // Delete existing accessories
    await Skill.deleteMany({});
    console.log("Deleted existing skills");

    // Insert new accessories
    const createdSkills = await Skill.insertMany(skills);
    console.log(`Created ${createdSkills.length} new skills`);

    console.log("Skill seeding completed successfully");
  } catch (error) {
    console.error("Error seeding skills:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
};

// Run seeder
seed();
