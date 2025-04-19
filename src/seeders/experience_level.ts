import { IExperienceLevel } from "src/models/experience_level.model";

export const experienceLevels: Partial<IExperienceLevel>[] = [
  {
    title: "Intern",
    yof_min: 0,
    yof_max: 0,
  },
  {
    title: "Fresher",
    yof_min: 0,
    yof_max: 1,
  },
  {
    title: "Junior",
    yof_min: 1,
    yof_max: 3,
  },
  {
    title: "Mid-level",
    yof_min: 3,
    yof_max: 5,
  },
  {
    title: "Senior",
    yof_min: 5,
    yof_max: 8,
  },
  {
    title: "Lead",
    yof_min: 8,
    yof_max: 12,
  },
  {
    title: "Principal/Expert",
    yof_min: 12, // Không có yof_max => mở rộng không giới hạn
  },
];
