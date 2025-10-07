import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Upload, User, FileText, Briefcase } from "lucide-react";
import MentorService from "@/services/mentor.service";
import { uploadImages } from "@/utils/cloudinary";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, name: "Thông tin cá nhân", icon: User },
  { id: 2, name: "Hồ sơ", icon: FileText },
  { id: 3, name: "Kinh nghiệm", icon: Briefcase },
];

// Validation schema for each step
const validationSchema = [
  Yup.object({
    full_name: Yup.string().required("Vui lòng nhập họ và tên"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
      .required("Vui lòng nhập mật khẩu"),
    phone: Yup.string().required("Vui lòng nhập số điện thoại"),
    job_title: Yup.string().required("Vui lòng nhập chức danh"),
    company: Yup.string().required("Vui lòng nhập công ty"),
    location: Yup.string().required("Vui lòng nhập vị trí"),
  }),
  Yup.object({
    category: Yup.string().required("Vui lòng chọn ngành"),
    skill: Yup.string().required("Vui lòng nhập kỹ năng"),
    bio: Yup.string().required("Vui lòng nhập giới thiệu bản thân"),
    current_position: Yup.string().required("Vui lòng nhập vị trí hiện tại"),
  }),
  Yup.object({
    price: Yup.number()
      .min(30000, "Giá tối thiểu là 30.000 VND/giờ")
      .required("Vui lòng nhập giá mỗi giờ"),
  }),
];

export const MentorApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false); // Thêm state để quản lý trạng thái upload

  const initialValues = {
    photo: null,
    full_name: "",
    email: "",
    password: "",
    phone: "",
    job_title: "",
    company: "",
    location: "",
    category: "",
    skill: "",
    bio: "",
    current_position: "",
    linkedin_url: "",
    personal_link_url: "",
    intro_video: "",
    featured_article: "",
    price: 30000,
  };

  const navigate = useNavigate(); // Initialize the navigate hook
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let avatar_url = "";
      if (values.photo) {
        const uploadedUrls = await uploadImages([values.photo], setUploading); // Sử dụng uploadImages
        avatar_url = uploadedUrls[0] || ""; // Lấy URL đầu tiên (vì chỉ upload 1 ảnh)
      }

      const mentorData = {
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        phone: values.phone,
        avatar_url,
        job_title: values.job_title,
        company: values.company,
        category: values.category,
        skill: values.skill,
        bio: values.bio,
        current_position: values.current_position,
        linkedin_url: values.linkedin_url,
        personal_link_url: values.personal_link_url,
        intro_video: values.intro_video,
        featured_article: values.featured_article,
        location: values.location,
        price: values.price,
      };

      await MentorService.register(mentorData);
      toast.success("Đăng ký thành công! Đang chờ duyệt.");
      resetForm();
      navigate("/mentor-apply/success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng ký");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = (validateForm, values, setTouched) => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        if (currentStep < 3) {
          setCurrentStep(currentStep + 1);
          setTouched({}); // Reset touched để tránh lỗi hiển thị khi quay lại
        }
      } else {
        setTouched(
          Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      }
    });
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-12 bg-white">
      <div className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Đăng ký làm Mentor</h1>
          <div className="flex items-center justify-center space-x-8 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${isCompleted ? "bg-[#2C3E50] text-white" : isActive ? "bg-[#F9C5D5] text-[#333] border-2 border-[#2C3E50]" : "bg-gray-200 text-gray-400"}`}
                  >
                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? "text-[#2C3E50]" : "text-gray-400"}`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute w-16 h-0.5 mt-6 ml-20 ${isCompleted ? "bg-[#2C3E50]" : "bg-gray-300"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema[currentStep - 1]}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, validateForm, setTouched, isSubmitting }) => (
            <Form className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-[#F9C5D5] border border-[#F5AFC4] rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-[#2C3E50] mt-2 flex-shrink-0" />
                      <div className="text-sm text-[#333]">
                        <p className="font-medium mb-2">Rất vui được gặp bạn!</p>
                        <p className="mb-2">
                          Điền thông tin trong form chỉ mất vài phút. Chúng tôi muốn tìm hiểu về nền tảng của bạn
                          và lý do bạn muốn trở thành Mentor. Hãy viết thật cá nhân, trực tiếp tới chúng tôi và mentee.
                          Không cần dùng thuật ngữ chuyên môn hay thư xin việc dài dòng.
                        </p>
                        <p>
                          Bằng việc gửi form, bạn đồng ý với quy tắc ứng xử và thỏa thuận Mentor, hãy đọc kỹ trước khi gửi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo" className="text-sm font-medium text-[#333]">
                      Ảnh đại diện
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {values.photo ? (
                          <img
                            src={URL.createObjectURL(values.photo)}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="photo"
                          accept="image/*"
                          onChange={(e) => setFieldValue("photo", e.target.files?.[0] || null)}
                          className="hidden"
                          disabled={uploading} // Vô hiệu hóa khi đang upload
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => document.getElementById("photo")?.click()}
                          disabled={uploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                              Đang tải...
                            </span>
                          ) : (
                            "Tải ảnh lên"
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Ảnh sẽ giúp mentee dễ dàng nhận diện bạn hơn.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-[#333]">
                      Họ và tên
                    </Label>
                    <Field
                      as={Input}
                      id="full_name"
                      name="full_name"
                      placeholder="Nhập họ và tên"
                    />
                    <ErrorMessage name="full_name" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">Ví dụ: Nguyễn Văn Khôi</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#333]">
                        Email
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Nhập email"
                      />
                      <ErrorMessage name="email" component="p" className="text-xs text-red-500" />
                      <p className="text-xs text-gray-500">Chúng tôi sẽ không chia sẻ email của bạn.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-[#333]">
                        Mật khẩu
                      </Label>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                      />
                      <ErrorMessage name="password" component="p" className="text-xs text-red-500" />
                      <p className="text-xs text-gray-500">Tối thiểu 8 ký tự, bao gồm chữ và số.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-[#333]">
                      Số điện thoại
                    </Label>
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                    />
                    <ErrorMessage name="phone" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">Ví dụ: +84 123 456 789</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job_title" className="text-sm font-medium text-[#333]">
                        Chức danh
                      </Label>
                      <Field
                        as={Input}
                        id="job_title"
                        name="job_title"
                        placeholder="Nhập chức danh"
                      />
                      <ErrorMessage name="job_title" component="p" className="text-xs text-red-500" />
                      <p className="text-xs text-gray-500">Ví dụ: Senior Developer, Product Manager...</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-[#333]">
                        Công ty
                      </Label>
                      <Field
                        as={Input}
                        id="company"
                        name="company"
                        placeholder="Nhập công ty"
                      />
                      <ErrorMessage name="company" component="p" className="text-xs text-red-500" />
                      <p className="text-xs text-gray-500">Ví dụ: FPT Software, Google...</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-[#333]">
                      Vị trí
                    </Label>
                    <Field
                      as={Input}
                      id="location"
                      name="location"
                      placeholder="Nhập vị trí của bạn"
                    />
                    <ErrorMessage name="location" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">Ví dụ: Hà Nội, Việt Nam</p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-[#333]">
                      Ngành
                    </Label>
                    <Field name="category">
                      {({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => setFieldValue("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngành" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">Kỹ thuật & Dữ liệu</SelectItem>
                            <SelectItem value="ux">UX & Thiết kế</SelectItem>
                            <SelectItem value="business">Kinh doanh & Quản lý</SelectItem>
                            <SelectItem value="product">Sản phẩm & Tiếp thị</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage name="category" component="p" className="text-xs text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skill" className="text-sm font-medium text-[#333]">
                      Kỹ năng
                    </Label>
                    <Field
                      as={Input}
                      id="skill"
                      name="skill"
                      placeholder="Nhập kỹ năng, cách nhau bằng dấu phẩy"
                    />
                    <ErrorMessage name="skill" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">
                      Danh sách các kỹ năng của bạn được phân cách bằng dấu phẩy (không quá 10).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-[#333]">
                      Giới thiệu bản thân
                    </Label>
                    <Field
                      as={Textarea}
                      id="bio"
                      name="bio"
                      placeholder="Giới thiệu về bạn"
                    />
                    <ErrorMessage name="bio" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">
                      Hãy cho chúng tôi và mentee biết về bạn. Viết ở ngôi thứ nhất, như đang trò chuyện trực tiếp.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current_position" className="text-sm font-medium text-[#333]">
                      Vị trí hiện tại
                    </Label>
                    <Field
                      as={Input}
                      id="current_position"
                      name="current_position"
                      placeholder="Nhập vị trí hiện tại"
                    />
                    <ErrorMessage name="current_position" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">Ví dụ: Lead Software Engineer tại FPT</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url" className="text-sm font-medium text-[#333]">
                        LinkedIn <span className="text-gray-400">(tùy chọn)</span>
                      </Label>
                      <Field
                        as={Input}
                        id="linkedin_url"
                        name="linkedin_url"
                        placeholder="Nhập URL LinkedIn"
                      />
                      <p className="text-xs text-gray-500">
                        Ví dụ: https://www.linkedin.com/in/username
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personal_link_url" className="text-sm font-medium text-[#333]">
                        Website cá nhân <span className="text-gray-400">(tùy chọn)</span>
                      </Label>
                      <Field
                        as={Input}
                        id="personal_link_url"
                        name="personal_link_url"
                        placeholder="Nhập URL website"
                      />
                      <p className="text-xs text-gray-500">Thêm blog, GitHub hoặc trang cá nhân khác</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-[#F9C5D5] border border-[#F5AFC4] rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-[#2C3E50] mt-2 flex-shrink-0" />
                      <div className="text-sm text-[#333]">
                        <p className="font-medium mb-2">Gần đến nơi rồi!</p>
                        <p className="mb-2">
                          Bạn chỉ còn một bước cuối cùng để trở thành người cố vấn và kết nối với các mentee trên toàn thế giới!
                        </p>
                        <p className="mb-2">
                          Trong bước này, hãy thể hiện những thành tựu của bạn và cách bạn có thể giúp đỡ người khác.
                          Nhiều lĩnh vực trong số này là tùy chọn, nhưng sẽ giúp chúng tôi có cái nhìn tốt hơn về công việc của bạn.
                        </p>
                        <p>
                          Chúng cũng giúp bạn khởi đầu thuận lợi khi bạn trở thành một người cố vấn.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="intro_video" className="text-sm font-medium text-gray-800">
                        Video giới thiệu <span className="text-gray-400">(tùy chọn)</span>
                      </Label>
                      <Field
                        as={Input}
                        id="intro_video"
                        name="intro_video"
                        placeholder="Nhập URL video"
                      />
                      <p className="text-xs text-gray-500">
                        Thêm một video trên YouTube hoặc ghi âm một video cho những mentee tương lai.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="featured_article" className="text-sm font-medium text-gray-800">
                        Bài viết nổi bật <span className="text-gray-400">(tùy chọn)</span>
                      </Label>
                      <Field
                        as={Input}
                        id="featured_article"
                        name="featured_article"
                        placeholder="Nhập URL bài viết"
                      />
                      <p className="text-xs text-gray-500">
                        Liên kết một buổi phỏng vấn/podcast/tác phẩm viết mà bạn tự hào.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-800">
                      Giá mỗi giờ
                    </Label>
                    <Field
                      as={Input}
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Nhập giá (VND/giờ)"
                      min="30000"
                    />
                    <ErrorMessage name="price" component="p" className="text-xs text-red-500" />
                    <p className="text-xs text-gray-500">Tối thiểu 30.000 VND/giờ</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    onClick={handleBackStep}
                    variant="outline"
                    className="px-6 py-2 border-gray-400 text-gray-700 hover:bg-gray-100"
                  >
                    Quay lại
                  </Button>
                ) : (
                  <div />
                )}
                <Button
                  type={currentStep === 3 ? "submit" : "button"}
                  onClick={(e) => {
                    if (currentStep < 3) {
                      e.preventDefault();
                      handleNextStep(validateForm, values, setTouched);
                    }
                  }}
                  className="px-6 py-2 text-white"
                  style={{ backgroundColor: "#2C3E50" }}
                  disabled={isSubmitting || uploading} // Vô hiệu hóa khi đang upload
                >
                  {currentStep === 3 ? "Gửi" : "Bước tiếp theo"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};