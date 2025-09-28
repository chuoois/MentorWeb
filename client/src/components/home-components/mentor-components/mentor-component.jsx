import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronDown, Crown, Trophy, Clipboard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Lợi ích
const benefits = [
    "Kết nối với những người cố vấn truyền cảm hứng & mentee đầy nhiệt huyết",
    "Lịch trình & chi phí linh hoạt",
    "Gặp gỡ mentor từ nhiều ngành nghề khác nhau",
];

// Lý do trở thành Mentor
const mentorReasons = [
    {
        icon: Crown,
        title: "Mạng lưới cố vấn có thu nhập cao hàng đầu",
        description:
            "Không cần làm việc miễn phí (trừ khi bạn muốn). Không phí thành viên. Bạn nhận 80% thu nhập.",
    },
    {
        icon: Trophy,
        title: "Xây dựng thương hiệu cá nhân như một chuyên gia",
        description:
            "Tham gia mạng lưới uy tín định hình tương lai của công nghệ, kinh doanh và nhiều lĩnh vực khác – đồng thời nâng cao danh tiếng và chuyên môn của bạn.",
    },
    {
        icon: Clipboard,
        title: "Cố vấn linh hoạt, kết quả thực tế",
        description:
            "Tạo ra tác động lâu dài thông qua mentorship linh hoạt, dài hạn – đồng thời rèn luyện kỹ năng lãnh đạo của chính bạn.",
    },
];

// Câu hỏi thường gặp
const faqs = [
    {
        question: "Chương trình hoạt động như thế nào?",
        answer:
            "Nền tảng của chúng tôi kết nối mentor có kinh nghiệm với mentee đang tìm kiếm sự hướng dẫn. Bạn tạo hồ sơ, đặt lịch khả dụng và mức giá, mentee có thể đặt buổi với bạn. Chúng tôi xử lý thanh toán, lịch hẹn và cung cấp công cụ hỗ trợ cho buổi cố vấn.",
    },
    {
        question: "Tôi cần dành bao nhiêu thời gian?",
        answer:
            "Hoàn toàn linh hoạt! Bạn có thể dành chỉ 1–2 giờ mỗi tuần hoặc nhiều hơn tùy thích. Phần lớn mentor bắt đầu với 3–5 giờ/tuần và điều chỉnh theo lịch trình cũng như nhu cầu.",
    },
    {
        question: "Tôi cần đáp ứng những gì?",
        answer:
            "Chúng tôi mong đợi mentor chuyên nghiệp, đúng giờ và thực sự quan tâm đến sự phát triển của mentee. Bạn cần duy trì giao tiếp thường xuyên, đưa ra phản hồi xây dựng và chia sẻ chuyên môn một cách chân thành.",
    },
    {
        question: "Ai là Mentee?",
        answer:
            "Mentee đến từ nhiều nền tảng khác nhau – sinh viên, người mới đi làm, người muốn chuyển ngành và doanh nhân. Họ là những người có động lực, tìm kiếm sự hướng dẫn trong phát triển sự nghiệp, nâng cao kỹ năng và phát triển cá nhân.",
    },
    {
        question: "Tôi có thể kiếm bao nhiêu tiền?",
        answer:
            "Thu nhập phụ thuộc vào chuyên môn, lịch rảnh và mức giá của bạn. Hầu hết mentor tính từ $30–150/giờ. Mentor tích cực thường kiếm $500–3000+ mỗi tháng, những mentor hàng đầu còn nhiều hơn nữa.",
    },
    {
        question: "Nền tảng kiếm tiền bằng cách nào?",
        answer:
            "Chúng tôi thu một khoản hoa hồng nhỏ từ mỗi buổi cố vấn (thường 10–20%) để duy trì nền tảng, cung cấp hỗ trợ khách hàng, xử lý thanh toán và liên tục cải thiện dịch vụ.",
    },
    {
        question: "Tôi có thể làm thêm công việc nào khác?",
        answer:
            "Ngoài cố vấn 1–1, bạn có thể mở lớp nhóm, workshop, tạo khóa học, hỗ trợ viết CV, phỏng vấn thử, hoặc tư vấn chuyên sâu trong lĩnh vực của mình.",
    },
];

export const HomeRegisterMentor = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const scrollToFAQ = () => {
        const faqSection = document.getElementById("faq-section");
        if (faqSection) {
            const offset = 80;
            const y = faqSection.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <main>
            {/* Hero Section */}
            <section className="py-20 bg-[#F9C5D5]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Nội dung bên trái */}
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-[#333333] leading-tight">
                                Chia sẻ chuyên môn. Phát triển kỹ năng. Tạo sự khác biệt.
                            </h2>
                            <p className="text-lg text-[#333333]/80 max-w-xl leading-relaxed">
                                MentorHub là con đường hai chiều. Hãy để chúng tôi xử lý những phần phức tạp
                                để bạn tập trung vào sự phát triển cá nhân và nghề nghiệp – cho cả bạn và mentee.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="w-7 h-7 bg-[#2C3E50] rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-[#333333] text-base">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/mentor-apply">
                                    <Button
                                        size="lg"
                                        className="bg-[#2C3E50] hover:bg-[#1A2634] text-white px-6 shadow-lg transition"
                                    >
                                        Trở thành Mentor
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#F9C5D5] hover:text-[#2C3E50] px-6 transition"
                                    onClick={scrollToFAQ}
                                >
                                    Câu hỏi thường gặp
                                </Button>
                            </div>
                        </div>
                        {/* Ảnh mockup bên phải */}
                        <div className="relative flex justify-center lg:justify-end">
                            <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mobile-app-mockup-showing-mentoring-interface-aD4pt8qMaAcMg2Jeb08MLSwvwHxVEI.jpg"
                                alt="Ứng dụng cố vấn trên di động"
                                className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-2xl shadow-xl object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Mentor Section */}
            <section className="py-16 bg-[#FDF7F9]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2C3E50] mb-6">
                        Vì sao nên cố vấn cùng MentorHub?
                    </h2>
                    <p className="text-lg text-[#333333]/70 max-w-3xl mx-auto mb-12">
                        Nơi tác động gặp cơ hội – và nơi mentor xuất sắc tỏa sáng.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {mentorReasons.map((reason, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-[#2C3E50]/10 hover:border-[#2C3E50]/20 hover:shadow-lg transition-shadow duration-200"
                            >
                                <reason.icon className="w-10 h-10 text-[#2C3E50] mb-4 mx-auto sm:mx-0" />
                                <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">
                                    {reason.title}
                                </h3>
                                <p className="text-[#333333]/80 leading-relaxed text-base">
                                    {reason.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq-section" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-[2fr_3fr] gap-12">
                        {/* Cột trái */}
                        <div className="text-center lg:text-left mb-12 lg:mb-0">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2C3E50] mb-4">
                                Câu hỏi thường gặp
                            </h2>
                            <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto lg:mx-0">
                                Không tìm thấy câu trả lời bạn cần? Hãy liên hệ với{" "}
                                <span className="text-[#2C3E50] font-semibold cursor-pointer hover:underline">
                                    đội ngũ hỗ trợ khách hàng
                                </span>
                                .
                            </p>
                        </div>
                        {/* Cột phải */}
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg border border-[#2C3E50]/20 overflow-hidden transition-all duration-200 hover:shadow-md hover:bg-[#F9C5D5]/20"
                                >
                                    <button
                                        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#2C3E50] focus:ring-opacity-50"
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <span className="text-lg font-medium text-[#333333] pr-4">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-[#2C3E50] transition-transform duration-200 ${openFAQ === index ? "transform rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    {openFAQ === index && (
                                        <div className="px-6 pb-5">
                                            <div className="pt-2 border-t border-[#2C3E50]/20">
                                                <p className="text-[#333333]/80 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-[#F9C5D5]">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#333333] mb-6">
                        Sẵn sàng bắt đầu hành trình mentorship của bạn?
                    </h2>
                    <p className="text-lg text-[#333333]/80 mb-8 leading-relaxed">
                        Tham gia cùng hàng ngàn mentor toàn cầu – những người đang định hình tương lai
                        đồng thời phát triển kỹ năng và sự nghiệp của chính mình. Hãy bắt đầu ngay hôm nay!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/mentor-apply">
                            <Button
                                size="lg"
                                className="bg-[#2C3E50] hover:bg-[#1A2634] text-white px-6 shadow-lg transition"
                            >
                                Trở thành Mentor
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#F9C5D5] hover:text-[#2C3E50] px-6 transition"
                            onClick={scrollToFAQ}
                        >
                            Tìm hiểu thêm trong FAQs
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
};
