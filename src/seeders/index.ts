import configEnv from "src/config/env";
import mongoose from "mongoose";
import Skill, { ISkill } from "src/models/skill.model";
import { skills } from "./skill";
import Company, { ICompany } from "src/models/company.model";
import { companies } from "./company";
import ExperienceLevel, { IExperienceLevel } from "src/models/experience_level.model";
import { experienceLevels } from "./experience_level";
import Career from "src/models/career.model";
import { careers } from "./career";
import JobPosting from "src/models/job-postings.model";
import { jobPostings } from "./job-postings";

const seedSkill = async () => {
  try {
    await Skill.deleteMany({});
    console.log("Deleted existing skills");

    const createdSkills = await Skill.insertMany(skills);
    console.log(`Created ${createdSkills.length} new skills`);
    return createdSkills;
  } catch (error) {
    console.error("Error seeding skills:", error);
    return null;
  }
};
const seedCompany = async () => {
  try {
    await Company.deleteMany({});
    console.log("Deleted existing campanies");

    const createdCompanies = await Company.insertMany(companies);
    console.log(`Created ${createdCompanies.length} new campanies`);
    return createdCompanies;
  } catch (error) {
    console.error("Error seeding campanies:", error);
    return null;
  }
};
const seedExperienceLevel = async () => {
  try {
    await ExperienceLevel.deleteMany({});
    console.log("Deleted existing experince levels");

    const createdCompanies = await ExperienceLevel.insertMany(experienceLevels);
    console.log(`Created ${createdCompanies.length} new experince levels`);
    return createdCompanies;
  } catch (error) {
    console.error("Error seeding experince levels:", error);
    return null;
  }
};

const seedCareers = async (skills: Omit<ISkill, "id">[]) => {
  try {
    await Career.deleteMany({});
    console.log("Deleted existing careers");

    const data = careers.map((career) => {
      const skillIds = (career.skills || [])
        .map((skillName) => {
          const skill = skills.find((skill) => skill.name === skillName);
          return skill ? skill._id : null;
        })
        .filter(Boolean);

      return {
        ...career,
        skills: skillIds,
      };
    });

    const createdCompanies = await Career.insertMany(data);
    console.log(`Created ${createdCompanies.length} new careers`);
    return createdCompanies;
  } catch (error) {
    console.error("Error seeding careers:", error);
    return null;
  }
};

const seedJobPostings = async (
  skills: Omit<ISkill, "id">[],
  companies: any[],
  experienceLevels: any[]
) => {
  try {
    await JobPosting.deleteMany({});
    console.log("Deleted existing job postings");

    // First fetch all careers from the database to match against position names
    const dbCareers = await Career.find({});
    
    const data = jobPostings.map((jobPosting) => {
      // Map skill names to real skill IDs from the database
      const skillIds = jobPosting.skills
        ? jobPosting.skills.map((skillName: string) => {
            // Find the actual skill ID from the database
            const skill = skills.find((s) => s.name === skillName);
            return skill ? skill._id : null;
          })
          .filter(Boolean)
        : [];

      // Find position from careers in database
      const positionObject = dbCareers.find((c) => c.name === jobPosting.position);
      
      // Find yof from experience levels
      const yofObject = experienceLevels.find((e) => e.title === jobPosting.yof);
      
      // Find company with matching name
      const company = companies.find((c) => c.name === jobPosting.company_id);

      // Use company_id directly as a string name
      return {
        ...jobPosting,
        position: positionObject?._id || null,
        yof: yofObject?._id || null,
        company_id: company ? company.name : jobPosting.company_id,
        skills: skillIds,
      };
    });

    const createdJobPostings = await JobPosting.insertMany(data);
    console.log(`Created ${createdJobPostings.length} new job postings`);
    return createdJobPostings;
  } catch (error) {
    console.error("Error seeding job postings:", error);
    return null;
  }
};

const seedAll = async () => {
  try {
    await mongoose.connect(configEnv.DATABASE_URL);
    console.log("Connected to MongoDB");

    const skills = await seedSkill();
    const companies = await seedCompany();
    const experienceLevels = await seedExperienceLevel();
    await seedCareers(skills || []);
    await seedJobPostings(skills || [], companies || [], experienceLevels || []);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};
seedAll()
  .then(() => {
    console.log("Seeding completed");
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
  });
