import { ObjectId } from "mongodb";

export const transformObject = (_: any, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
};

export const applyBaseSchemaOptions = (schema: any) => {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: transformObject,
  });

  schema.set("toObject", {
    virtuals: true,
    versionKey: false,
    transform: transformObject,
  });
};

export const cloneWithNewObjectIds = (topics: any[]) => {
  const oldToNewIdMap = new Map<string, ObjectId>();

  const getNewObjectId = (oldId: string) => {
    if (!oldToNewIdMap.has(oldId)) {
      oldToNewIdMap.set(oldId, new ObjectId());
    }
    return oldToNewIdMap.get(oldId);
  };

  const clonedTopics = topics.map((topic) => {
    const oldTopicId = topic._id.$oid;
    const newTopicId = getNewObjectId(oldTopicId);

    const newResources = (topic.resources || []).map((res: any) => ({
      ...res,
      _id: getNewObjectId(res._id.$oid),
    }));

    return {
      ...topic,
      _id: newTopicId,
      parent_id: topic.parent_id ? getNewObjectId(topic.parent_id.$oid) : null,
      created_at: new Date(topic.created_at.$date),
      updated_at: new Date(topic.updated_at.$date),
      deleted_at: topic.deleted_at ? new Date(topic.deleted_at.$date) : null,
      deleted_by: topic.deleted_by ? new ObjectId(topic.deleted_by.$oid) : null,
      resources: newResources,
    };
  });

  return clonedTopics;
};
