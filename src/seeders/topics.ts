import { cloneWithNewObjectIds } from "src/utils/mongoose-helper";
import { topicDevops, topicsDesign, topicsFrontend } from "./topics_1";
import { topicBA, topicsCyber, topicsPM } from "./topics_2";
import { topicsCloud, topicsAIE, topicMAD } from "./topics_3";
import { topicsQAE, topicsBl, topicITS } from "./topics_4";

export const topics = [
  ...cloneWithNewObjectIds(topicsFrontend),
  ...cloneWithNewObjectIds(topicsDesign),
  ...cloneWithNewObjectIds(topicDevops),
  ...cloneWithNewObjectIds(topicsCyber),
  ...cloneWithNewObjectIds(topicsPM),
  ...cloneWithNewObjectIds(topicBA),
  ...cloneWithNewObjectIds(topicsCloud),
  ...cloneWithNewObjectIds(topicsAIE),
  ...cloneWithNewObjectIds(topicMAD),
  ...cloneWithNewObjectIds(topicsQAE),
  ...cloneWithNewObjectIds(topicsBl),
  ...cloneWithNewObjectIds(topicITS),
];
