import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model";
import { connectDB } from "../config/database";

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create sample user with profile data
    const user = new User({
      name: "Nhân Duy",
      email: "nhanduy@gm.com",
      password: "hashed_password_here", // In real scenario, you'd hash this
      phone: "(123) 456-7890",
      photo_url: "https://example.com/profile-photo.jpg",
      role: "user",
      year: 3,
      school: "Trường đại học Công Nghệ Thông Tin ĐHQG TPHCM",
      address: "99 Washington Ave. Manchester, Kentucky 99",
      bio: "Tôi đang là sinh viên năm 3 tại trường đại học Công Nghệ Thông Tin ĐHQG TPHCM. Có niềm đam mê cháy bỏng với ngành công nghệ thông tin, tôi có châm ngôn sống là :",
      quote: "Khi lương chưa ngàn đô thì không ngừng bỏ cuộc",
      social_media: {
        facebook: "Ngô Nguyễn Duy Nhân",
        instagram: "awish"
      },
      analytics: {
        weeklyViews: {
          w1: 65,
          w2: 40,
          w3: 25,
          w4: 70
        },
        totalViews: 200,
        totalStars: 100,
        totalSearches: 70
      },
      courses: [
        {
          id: new mongoose.Types.ObjectId().toString(),
          title: "UX UI Designer",
          description: "Lộ trình để trở thành một designer chuyên nghiệp bắt đầu từ con số 0. Với lộ trình chuyên nghiệp, bám sát với công việc thực tế giúp bạn để đang học tập.",
          icon: "https://example.com/ux-icon.png",
          progress: 60
        },
        {
          id: new mongoose.Types.ObjectId().toString(),
          title: "Backend Developer",
          description: "Lộ trình để trở thành một backend developer chuyên nghiệp bắt đầu từ con số 0. Với lộ trình chuyên nghiệp, bám sát với công việc thực tế giúp bạn để đang học tập.",
          icon: "https://example.com/backend-icon.png",
          progress: 45
        },
        {
          id: new mongoose.Types.ObjectId().toString(),
          title: "Data Analyst",
          description: "Lộ trình để trở thành một data analyst chuyên nghiệp bắt đầu từ con số 0. Với lộ trình chuyên nghiệp, bám sát với công việc thực tế giúp bạn để đang học tập.",
          icon: "https://example.com/data-icon.png",
          progress: 30
        }
      ]
    });
    
    await user.save();
    
    console.log("Sample user profile created successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedUsers(); 