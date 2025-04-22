import Skill from "src/models/skill.model";

class SkillService {
  async getSkills() {
    try {
      const skills = await Skill.find().select("id name");
      console.log("Get skills successfully");
      return skills;
    } catch (error) {
      throw error;
    }
  }
}

export default new SkillService();
