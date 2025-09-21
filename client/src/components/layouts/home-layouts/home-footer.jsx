import { Facebook, Instagram, Twitter, Linkedin, Youtube, GraduationCap } from "lucide-react";

const footerLinks = {
  Platform: [
    "Browse Mentors",
    "Book a Session",
    "Become a Mentor",
    "Mentorship for Teams",
    "Testimonials",
  ],
  Resources: [
    "Newsletter",
    "Books",
    "Perks",
    "Templates",
    "Career Paths",
    "Blog",
  ],
  Company: [
    "About",
    "Case Studies",
    "Partner Program",
    "Code of Conduct",
    "Privacy Policy",
    "DMCA",
  ],
  Explore: [
    "Companies",
    "Fractional Executives",
    "Services & Training",
    "Part-Time Experts",
  ],
  Support: ["FAQ", "Contact"],
};

export const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] text-[#333333] pt-16 pb-8 border-t border-[#F9C5D5]/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 text-center md:text-left">
          {/* Logo and Description */}
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
              Your trusted source to find highly-vetted mentors & industry
              professionals to move your career ahead.
            </p>
            {/* Social Media Icons */}
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

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold text-lg text-[#333333] tracking-wide">
                {category}
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

        {/* Bottom Note */}
        <div className="text-center mt-12 text-sm text-[#333333]/70">
          © {new Date().getFullYear()} MentorHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
