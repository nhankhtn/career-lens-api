import { IJobPosting } from "src/models/job-postings.model";
import mongoose from "mongoose";

// Generate company ObjectIds for the sample data
const generateObjectId = () => new mongoose.Types.ObjectId();
const companyIds = Array(6).fill(null).map(() => generateObjectId());

export const jobPostings = [
  {
    job_title: "Senior Frontend Developer",
    salary_min: 2500,
    salary_max: 4000,
    company_id: companyIds[0],
    job_description: "We are looking for a Senior Frontend Developer with expertise in React and TypeScript to join our growing team. You will be responsible for building and maintaining user interfaces for our web applications.",
    position: "Software Engineer", // query from career.ts
    yof: "Senior", // query from experience_level.ts
    date_posted: new Date("2023-09-15"),
    skills: ["JavaScript", "TypeScript", "ReactJS"],
  },
  {
    job_title: "Full Stack Developer",
    salary_min: 2000,
    salary_max: 3500,
    company_id: companyIds[1],
    job_description: "Join our dynamic team as a Full Stack Developer. You'll work on both frontend and backend development, helping us build scalable and responsive web applications.",
    position: "Full Stack Developer", // query from career.ts
    yof: "Mid-level", // query from experience_level.ts
    date_posted: new Date("2023-10-05"),
    skills: ["TypeScript", "ReactJS", "NodeJS", "MongoDB"],
  },
  {
    job_title: "DevOps Engineer",
    salary_min: 3000,
    salary_max: 4500,
    company_id: companyIds[2],
    job_description: "We're seeking an experienced DevOps Engineer to help us improve our CI/CD pipeline and infrastructure. You'll work with Docker, Kubernetes, and cloud platforms to ensure smooth deployments and system reliability.",
    position: "DevOps Engineer", // query from career.ts 
    yof: "Senior", // query from experience_level.ts
    date_posted: new Date("2023-11-20"),
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
  },
  {
    job_title: "Junior Backend Developer",
    salary_min: 1500,
    salary_max: 2200,
    company_id: companyIds[3], 
    job_description: "Great opportunity for a Junior Backend Developer to join our team. You'll be working with Node.js and Express to build RESTful APIs and microservices.",
    position: "Software Engineer", // query from career.ts
    yof: "Junior", // query from experience_level.ts
    date_posted: new Date("2023-12-01"),
    skills: ["JavaScript", "NodeJS", "ExpressJS"],
  },
  {
    job_title: "Machine Learning Engineer",
    salary_min: 3500,
    salary_max: 5000,
    company_id: companyIds[4],
    job_description: "Join our AI team as a Machine Learning Engineer. You'll be working on cutting-edge ML models to solve real-world problems in our products.",
    position: "AI Engineer", // query from career.ts
    yof: "Senior", // query from experience_level.ts
    date_posted: new Date("2023-10-25"),
    skills: ["Python", "Pandas", "NumPy", "Scikit-learn"],
  },
  {
    job_title: "React Native Developer",
    salary_min: 2200,
    salary_max: 3800,
    company_id: companyIds[5],
    job_description: "We are looking for a React Native Developer to build and maintain cross-platform mobile applications. You should have experience with React Native and mobile app development.",
    position: "Mobile App Developer", // query from career.ts
    yof: "Mid-level", // query from experience_level.ts
    date_posted: new Date("2023-11-05"),
    skills: ["JavaScript", "ReactJS", "React Native"],
  },
  {
    job_title: "QA Engineer",
    salary_min: 1800,
    salary_max: 2800,
    company_id: companyIds[1],
    job_description: "Join our QA team to ensure the quality of our software products. You'll be responsible for designing and implementing test cases, automated testing, and identifying bugs.",
    position: "QA Engineer", // query from career.ts
    yof: "Mid-level", // query from experience_level.ts
    date_posted: new Date("2023-09-28"),
    skills: ["Jest", "Cypress", "Testing Library"],
  },
  {
    job_title: "Data Engineer",
    salary_min: 2600,
    salary_max: 4200,
    company_id: companyIds[0],
    job_description: "We're seeking a Data Engineer to help us build and maintain our data pipelines and infrastructure. You'll work with big data technologies and ensure data quality and availability.",
    position: "Data Scientist", // query from career.ts
    yof: "Senior", // query from experience_level.ts
    date_posted: new Date("2023-10-15"),
    skills: ["Python", "MongoDB", "PostgreSQL", "Redis"],
  },
  {
    job_title: "Intern Frontend Developer",
    salary_min: 800,
    salary_max: 1200,
    company_id: companyIds[3],
    job_description: "Great opportunity for students or recent graduates to gain real-world experience in frontend development. You'll be mentored by senior developers while working on real projects.",
    position: "Software Engineer", // query from career.ts
    yof: "Intern", // query from experience_level.ts
    date_posted: new Date("2023-12-10"),
    skills: ["JavaScript", "HTML", "CSS"],
  },
  {
    job_title: "Technical Lead",
    salary_min: 4000,
    salary_max: 6000,
    company_id: companyIds[4],
    job_description: "We're looking for a Technical Lead to oversee our development team and projects. You'll be responsible for technical decision-making, mentoring team members, and ensuring project success.",
    position: "Software Engineer", // query from career.ts
    yof: "Lead", // query from experience_level.ts
    date_posted: new Date("2023-09-20"),
    skills: ["TypeScript", "ReactJS", "ExpressJS", "Git"],
  },
];
