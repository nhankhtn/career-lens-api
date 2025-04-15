import { IErrorLog } from "src/models/error-log.model";
import ErrorLog from "src/models/error-log.model";

class LoggerService {
  async logError(error: Omit<IErrorLog, "_id" | "created_at">) {
    try {
      const errorLog = new ErrorLog({
        method: error.method,
        url: error.url,
        params: error.params,
        body: error.body,
        headers: error.headers,
        client_ip: error.client_ip,
        duration: error.duration,
        user_id: error.user_id,
      });
      await errorLog.save();
    } catch (error) {
      console.error("Error logging:", error);
    }
  }
}

export default new LoggerService();
