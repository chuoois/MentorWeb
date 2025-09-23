import { Facebook, Instagram, Twitter, Linkedin, Youtube, GraduationCap } from "lucide-react";

const footerLinks = {
  Nền_tảng: [
    "Tìm Mentor",
    "Đặt buổi học",
    "Trở thành Mentor",
    "Mentorship cho Doanh nghiệp",
    "Cảm nhận học viên",
  ],
  Tài_nguyên: [
    "Bản tin",
    "Sách",
    "Ưu đãi",
    "Mẫu tài liệu",
    "Lộ trình nghề nghiệp",
    "Blog",
  ],
  Công_ty: [
    "Về chúng tôi",
    "Case Study",
    "Chương trình đối tác",
    "Quy tắc ứng xử",
    "Chính sách bảo mật",
    "DMCA",
  ],
  Khám_phá: [
    "Công ty",
    "Chuyên gia bán thời gian",
    "Dịch vụ & Đào tạo",
    "Lãnh đạo bán thời gian",
  ],
  Hỗ_trợ: ["FAQ", "Liên hệ"],
};

export const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] text-[#333333] pt-16 pb-8 border-t border-[#F9C5D5]/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 text-center md:text-left">
          {/* Logo và mô tả */}
          <div className="space-y-5">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 bg-[#F9C5D5] rounded-xl flex items-center justify-center shadow">
                <GraduationCap className="w-6 h-6 text-[#2C3E50]" />
              </div>
              <span className="text-xl font-bold text-[#2C3E50]">
                MentorHub
              </span>
            </div>
            <p className="text-[#333333]/80 max-w-sm mx-auto md:mx-0 text-sm leading-relaxed">
              Nơi đáng tin cậy để tìm kiếm các mentor & chuyên gia trong ngành, giúp bạn phát triển sự nghiệp.
            </p>
            {/* Mạng xã hội */}
            <div className="flex space-x-4 justify-center md:justify-start pt-4">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 text-[#333333] hover:text-[#F9C5D5] hover:scale-110 transition-all" />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 text-[#333333] hover:text-[#F9C5D5] hover:scale-110 transition-all" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5 text-[#333333] hover:text-[#F9C5D5] hover:scale-110 transition-all" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-[#333333] hover:text-[#F9C5D5] hover:scale-110 transition-all" />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5 text-[#333333] hover:text-[#F9C5D5] hover:scale-110 transition-all" />
              </a>
            </div>
          </div>

          {/* Các link trong footer */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold text-lg text-[#333333] tracking-wide">
                {category.replace("_", " ")}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm text-[#333333]/80 hover:text-[#F9C5D5] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ghi chú dưới cùng */}
        <div className="text-center mt-12 text-sm text-[#333333]/70">
          © {new Date().getFullYear()} MentorHub. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};
