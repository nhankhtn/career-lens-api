import configEnv from "src/config/env";
import mongoose from "mongoose";
import Skill, { ISkill } from "src/models/skill.model";
import { skills } from "./skill";
import Company, { ICompany } from "src/models/company.model";
import { companies } from "./company";
import ExperienceLevel, {
  IExperienceLevel,
} from "src/models/experience_level.model";
import { experienceLevels } from "./experience_level";
import Career from "src/models/career.model";
import { careers } from "./career";
import JobPosting from "src/models/job-postings.model";
import { jobPostings } from "./job-postings";
import Topic from "src/models/topic.model";
import { ObjectId } from "mongodb";
import { topics } from "./topics";
import CareerHistory from "src/models/career-history.model";
import { careerHistories } from "./career_history";

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

const seedCareers = async (skills: Omit<ISkill, "id">[], topics: any[]) => {
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

      const topicId = topics.find((topic) => topic.title === career.name)?._id;

      return {
        ...career,
        topic_id: topicId,
        skills: skillIds,
      };
    });

    const careersCreated = await Career.insertMany(data);
    console.log(`Created ${careersCreated.length} new careers`);
    return careersCreated;
  } catch (error) {
    console.error("Error seeding careers:", error);
    return null;
  }
};

const seedJobPostings = async (
  skills: Omit<ISkill, "id">[],
  companies: any[],
  experienceLevels: any[],
  careers: any[]
) => {
  try {
    await JobPosting.deleteMany({});
    console.log("Deleted existing job postings");

    const data = jobPostings.map((jobPosting) => {
      // Map skill names to real skill IDs from the database
      const skillIds = jobPosting.skills
        ? jobPosting.skills
            .map((skillName: string) => {
              // Find the actual skill ID from the database
              const skill = skills.find((s) => s.name === skillName);
              return skill ? skill._id : null;
            })
            .filter(Boolean)
        : [];

      // Find position from careers in database
      const positionObject = careers.find(
        (c) => c.name === jobPosting.position
      );

      // Find yof from experience levels
      const yofObject = experienceLevels.find(
        (e) => e.title === jobPosting.yof
      );

      // Find company with matching name
      const company = companies.find((c) => c.name === jobPosting.company_id);

      // Use company._id as ObjectId reference instead of string name
      return {
        ...jobPosting,
        position: positionObject?._id || null,
        yof: yofObject?._id || null,
        company_id: company ? company._id : null,
        skills: skillIds,
      };
    });

    // Filter out any entries with null company_id
    const validData = data.filter((item) => item.company_id !== null);

    const createdJobPostings = await JobPosting.insertMany(validData);
    console.log(`Created ${createdJobPostings.length} new job postings`);
    return createdJobPostings;
  } catch (error) {
    console.error("Error seeding job postings:", error);
    return null;
  }
};

const seedTopics = async (skills: any[]) => {
  try {
    await Topic.deleteMany({});
    console.log("Deleted existing topics");

    const data = topics.map((topic) => {
      // const newData = {
      //   ...topic,
      //   created_at: new Date(topic.created_at.$date),
      //   updated_at: new Date(topic.updated_at.$date),
      //   deleted_at: topic.deleted_at ? new Date(topic.deleted_at.$date) : null,
      //   _id: new ObjectId(topic._id.$oid),
      //   parent_id: topic.parent_id ? new ObjectId(topic.parent_id?.$oid) : null,
      //   resources: topic.resources.map((r) => ({
      //     ...r,
      //     _id: new ObjectId(r._id.$oid),
      //   })),
      //   deleted_by: topic.deleted_by
      //     ? new ObjectId(topic.deleted_by.$oid)
      //     : null,
      // };
      if (topic.level !== 1) {
        return topic;
      }
      const skillIds = skills
        .map((s) => skills.find((skill) => skill.name === s)?._id)
        .filter(Boolean);
      return {
        ...topic,
        skills: skillIds,
      };
    });
    const topicCreated = await Topic.insertMany(data);
    console.log(`Created ${topicCreated.length} new topic`);
    return topicCreated;
  } catch (error) {
    console.error("Error seeding topics:", error);
    return null;
  }
};

const seedCareerHistory = async (careers: any[]) => {
  try {
    await CareerHistory.deleteMany({});
    console.log("Deleted existing careers");

    const data = careerHistories.map((careerHistory) => {
      const career = careers.find((c) => c.name === careerHistory.job_title);
      return {
        ...careerHistory,
        career_id: career ? career._id : null,
      };
    });

    const careerCreated = await CareerHistory.insertMany(data);
    console.log(`Created ${careerCreated.length} new career history`);
    return careerCreated;
  } catch (error) {
    console.error("Error seeding career history:", error);
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
    const topics = await seedTopics(skills || []);
    const careers = await seedCareers(skills || [], topics || []);
    await seedCareerHistory(careers || []);
    await seedJobPostings(
      skills || [],
      companies || [],
      experienceLevels || [],
      careers || []
    );
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
