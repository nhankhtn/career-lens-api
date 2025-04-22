import SkillService from "src/services/skill.service";
import { NextFunction, Request, Response } from "express";

class SkillController {
  async getSkills(_: Request, res: Response, next: NextFunction) {
    try {
      const skills = await SkillService.getSkills();
      res.json(skills);
    } catch (error) {
      next(error);
    }
  }
}

export default new SkillController();
