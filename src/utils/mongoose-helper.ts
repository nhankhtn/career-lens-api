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
