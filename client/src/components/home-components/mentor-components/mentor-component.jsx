import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronDown, Crown, Trophy, Clipboard } from "lucide-react";
import { useState } from "react";

// Benefits data
const benefits = [
    "Join inspiring mentors & committed mentees",
    "Flexible schedule & pricing",
    "Connect with mentors across 90+ countries",
];

// Mentor reasons data
const mentorReasons = [
    {
        icon: Crown,
        title: "The top-paying mentorship network",
        description:
            "No pro bono work (unless you want to). No membership fees. Just 80% earnings, with $10M+ paid to mentors so far.",
    },
    {
        icon: Trophy,
        title: "Build your brand as an industry leader",
        description:
            "Join a trusted network shaping the future of tech, business, and more – while growing your reputation and expertise.",
    },
    {
        icon: Clipboard,
        title: "Flexible mentorship, real results",
        description:
            "Create a lasting impact through flexible, long-term mentorship, and sharpen your leadership in the process.",
    },
];

// FAQs data
const faqs = [
    {
        question: "How does this whole thing work?",
        answer:
            "Our platform connects experienced mentors with mentees seeking guidance. You create a profile, set your availability and rates, and mentees can book sessions with you. We handle payments, scheduling, and provide tools for effective mentoring sessions.",
    },
    {
        question: "How much time does it take?",
        answer:
            "It's completely flexible! You can dedicate as little as 1-2 hours per week or as much as you'd like. Most mentors start with 3-5 hours weekly and adjust based on their schedule and demand.",
    },
    {
        question: "What's expected from me?",
        answer:
            "We expect mentors to be professional, punctual, and genuinely invested in helping mentees grow. You'll need to maintain regular communication, provide constructive feedback, and share your expertise authentically.",
    },
    {
        question: "Who are the Mentees?",
        answer:
            "Our mentees come from diverse backgrounds - students, early-career professionals, career changers, and entrepreneurs. They're motivated individuals seeking guidance in areas like career development, skill building, and professional growth.",
    },
    {
        question: "How much money can I make?",
        answer:
            "Earnings vary based on your expertise, availability, and rates. Most mentors charge $30-150 per hour. Active mentors typically earn $500-3000+ monthly, with top mentors earning significantly more.",
    },
    {
        question: "How do you make money?",
        answer:
            "We take a small commission from each mentoring session (typically 10-20%) to maintain the platform, provide customer support, handle payments, and continuously improve our services.",
    },
    {
        question: "What other work can I take on?",
        answer:
            "Beyond one-on-one mentoring, you can offer group sessions, workshops, create courses, provide resume reviews, conduct mock interviews, or offer specialized consulting in your area of expertise.",
    },
];

export const HomeRegisterMentor = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const scrollToFAQ = () => {
        const faqSection = document.getElementById("faq-section");
        const offset = 80; // Adjust based on header height
        const y = faqSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <main>
            {/* Hero Section */}
            <section className="py-20 bg-[#F9C5D5]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-[#333333] leading-tight">
                                Share your expertise. Grow your skills. Make a difference.
                            </h2>
                            <p className="text-lg text-[#333333]/80 max-w-xl leading-relaxed">
                                Mentoring is a two-way street. Let us take care of the boring parts so you can
                                concentrate on personal and professional growth for both you and your mentees.
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
                                <Button
                                    size="lg"
                                    className="bg-[#2C3E50] hover:bg-[#1A2634] text-white px-6 shadow-lg transition"
                                >
                                    Become a mentor
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#F9C5D5] hover:text-[#2C3E50] px-6 transition"
                                    onClick={scrollToFAQ}
                                >
                                    Frequently Asked Questions
                                </Button>
                            </div>
                        </div>
                        {/* Right Mobile Mockup */}
                        <div className="relative flex justify-center lg:justify-end">
                            <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mobile-app-mockup-showing-mentoring-interface-aD4pt8qMaAcMg2Jeb08MLSwvwHxVEI.jpg"
                                alt="Mobile app mockup showing mentoring platform interface"
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
                        Why Mentor with MentorCruise?
                    </h2>
                    <p className="text-lg text-[#333333]/70 max-w-3xl mx-auto mb-12">
                        Where impact meets opportunity – and great mentors thrive.
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
                        {/* Left Column */}
                        <div className="text-center lg:text-left mb-12 lg:mb-0">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2C3E50] mb-4">
                                FAQs
                            </h2>
                            <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto lg:mx-0">
                                Can't find the answer you're looking for? Reach out to our{" "}
                                <span className="text-[#2C3E50] font-semibold cursor-pointer hover:underline">
                                    customer support team
                                </span>
                                .
                            </p>
                        </div>
                        {/* Right Column */}
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
            {/* Final Call To Action Section */}
            <section className="py-20 bg-[#F9C5D5]">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#333333] mb-6">
                        Ready to start your mentorship journey?
                    </h2>
                    <p className="text-lg text-[#333333]/80 mb-8 leading-relaxed">
                        Join thousands of mentors worldwide who are shaping the future while
                        growing their own skills and careers. Take the first step today!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-[#2C3E50] hover:bg-[#1A2634] text-white px-6 shadow-lg transition"
                        >
                            Become a mentor
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#F9C5D5] hover:text-[#2C3E50] px-6 transition"
                            onClick={scrollToFAQ}
                        >
                            Learn more in FAQs
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
};
