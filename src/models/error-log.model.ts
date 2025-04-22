import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface IErrorLog extends Document {
  id: Types.ObjectId;
  method: string;
  url: string;
  params: object;
  body: object;
  headers: object;
  client_ip: string;
  duration: number;
  error: string;
  user_id: string;
  note?: string;
  created_at: Date;
}

const ErrorLogSchema: Schema<IErrorLog> = new mongoose.Schema(
  {
    method: String,
    url: String,
    params: Object,
    body: Object,
    headers: Object,
    client_ip: String,
    error: String,
    duration: Number,
    note: String,
    user_id: String,
  },
  {
    collection: "error_logs",
    timestamps: { createdAt: "created_at" },
  }
);

applyBaseSchemaOptions(ErrorLogSchema);
const ErrorLog = mongoose.model<IErrorLog>("ErrorLog", ErrorLogSchema);
export default ErrorLog;
