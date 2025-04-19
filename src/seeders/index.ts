import configEnv from "src/config/env";
import mongoose from "mongoose";
import Skill, { ISkill } from "src/models/skill.model";
import { skills } from "./skill";
import Company from "src/models/company.model";
import { companies } from "./company";
import ExperienceLevel from "src/models/experience_level.model";
import { experienceLevels } from "./experience_level";
import Career from "src/models/career.model";
import { careers } from "./career";

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

const seedAll = async () => {
  try {
    await mongoose.connect(configEnv.DATABASE_URL);
    console.log("Connected to MongoDB");

    const skills = await seedSkill();
    await seedCompany();
    await seedExperienceLevel();
    await seedCareers(skills || []);
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
