import { IOpenaiCareer, IOpenaiCareerGuidance } from "src/common/types";
import configEnv from "src/config/env";
import axios from "axios";
import { cleanText } from "src/utils/string-helper";

class OpenaiService {
  async generateCareerDescription(
    query: IOpenaiCareer
  ): Promise<IOpenaiCareerGuidance> {
    // const response = await axios.post(
    //   `${configEnv.OPENAI_SERVICE}/career/guidance`,
    //   {
    //     params: query,
    //     headers: {
    //       "x-api-key": configEnv.X_API_KEY,
    //     },
    //   }
    // );
    // return response.data;
    const guidance =
      '1. Phân tích chênh lệch: Dựa trên hồ sơ của bạn và yêu cầu công việc mục tiêu, bạn cần học thêm kỹ năng và kiến thức về "Machine Learning", "Deep Learning", "Natural Language Processing" hoặc "Computer Vision". Bạn cũng cần kinh nghiệm và hiểu biết sâu hơn về lĩnh vực Trí tuệ nhân tạo (AI).\n\n2. Con đường học tập: Tôi khuyên bạn nên tham gia các khóa học liên quan đến AI như "Machine Learning" và "Deep Learning" trên các trang web như Coursera, edX hoặc Udemy. Đồng thời, bạn cũng nên học Python, ngôn ngữ lập trình phổ biến trong lĩnh vực AI. Đối với "Natural Language Processing" và "Computer Vision", có các khóa học chuyên sâu trên Coursera và Udemy. Ngoài ra, việc đạt chứng chỉ trong các khóa học này cũng sẽ cung cấp cho bạn ưu thế cạnh tranh khi tìm việc.\n\n3. Thời gian: Dựa trên mức độ tập trung và thời gian dành cho việc học, mất khoảng 1-2 năm để chuyển đổi sang vai trò mục tiêu. Điều này bao gồm thời gian để hoàn thành các khóa học, đạt chứng chỉ và có được kinh nghiệm thực tế qua các dự án.\n\n4. Con đường thay thế: Để giúp bạn tiến dần đến mục tiêu, bạn có thể xem xét các vị trí khác như "Data Analyst" hoặc "Machine Learning Engineer" làm bước đệm. Các vị trí này sẽ cho phép bạn áp dụng những kiến thức bạn đã học và tiếp tục phát triển kỹ năng trong lĩnh vực AI.';
    return {
      status: "success",
      guidance: cleanText(guidance),
      message: null,
      relevant_jobs_count: 0,
    };
  }
}

export default new OpenaiService();
