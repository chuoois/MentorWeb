import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, Mail, Phone, Save, Briefcase } from "lucide-react";
import MenteeService from "@/services/mentee.service";

export const MenteeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gpa: "",
    job_title: "",
    experience: "",
    motivation: "",
  });

  // Fetch mentee profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await MenteeService.getProfile();
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          gpa: data.gpa != null ? data.gpa.toString() : "",
          job_title: data.job_title || "",
          experience: data.experience || "",
          motivation: data.motivation || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedData = {
        ...formData,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      };
      const response = await MenteeService.updateProfile(updatedData);
      setProfile(response.mentee);
      setIsEditing(false);
      toast.success(response.message || "Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-40 space-y-2">
        <Spinner className="w-7 h-7" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500 text-xs">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  // Empty profile
  if (!profile) {
    return (
      <div className="text-center py-5 bg-white rounded-md shadow-sm border border-gray-200 mt-2">
        <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium" style={{ color: "#333333" }}>
          Không tìm thấy thông tin hồ sơ
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ
        </p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="max-w-[90vw] mx-auto p-2">
      {/* Header */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md" style={{ backgroundColor: "#F9C5D5" }}>
              <User className="w-4 h-4" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#333333" }}>
                Hồ sơ của bạn
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Xem và quản lý thông tin cá nhân của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-2">
          <div
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
              profile.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {profile.status === "ACTIVE" ? "Hoạt động" : profile.status}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="mt-0.5 w-full p-1.5 border border-gray-300 rounded-md text-sm"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <div className="mt-0.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-gray-100 text-gray-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Số điện thoại
                </label>
                <div className="mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Công việc hiện tại</label>
                <div className="mt-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-gray-500" />
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                    placeholder="Nhập công việc hiện tại"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Điểm GPA</label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  className="mt-0.5 w-full p-1.5 border border-gray-300 rounded-md text-sm"
                  placeholder="Nhập điểm GPA"
                  step="0.01"
                  min="0"
                  max="4"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Kinh nghiệm</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-0.5 w-full p-1.5 border border-gray-300 rounded-md text-sm"
                rows="3"
                placeholder="Nhập kinh nghiệm của bạn"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Động lực học tập</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                className="mt-0.5 w-full p-1.5 border border-gray-300 rounded-md text-sm"
                rows="3"
                placeholder="Nhập động lực học tập"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={toggleEditMode}
                className="text-white hover:opacity-90 text-xs px-2"
                style={{ backgroundColor: "#6B7280" }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="text-white hover:opacity-90 text-xs px-2"
                style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
              >
                {saving ? (
                  <>
                    <Spinner className="w-3 h-3 mr-1" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-1" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Họ và tên</label>
                <p className="text-sm font-medium mt-0.5" style={{ color: "#333333" }}>
                  {profile.full_name || "Chưa cung cấp"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <div className="mt-0.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-500" />
                  <p className="text-sm" style={{ color: "#333333" }}>
                    {profile.email || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Số điện thoại</label>
                <div className="mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-500" />
                  <p className="text-sm" style={{ color: "#333333" }}>
                    {profile.phone || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Công việc hiện tại</label>
                <div className="mt-0.5 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-gray-500" />
                  <p className="text-sm" style={{ color: "#333333" }}>
                    {profile.job_title || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Điểm GPA</label>
                <p className="text-sm mt-0.5" style={{ color: "#333333" }}>
                  {profile.gpa != null ? profile.gpa.toFixed(2) : "Chưa cung cấp"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Kinh nghiệm</label>
              <p className="text-sm mt-0.5 bg-gray-50 p-2 rounded-md" style={{ color: "#333333" }}>
                {profile.experience || "Chưa cung cấp"}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Động lực học tập</label>
              <p className="text-sm mt-0.5 bg-gray-50 p-2 rounded-md" style={{ color: "#333333" }}>
                {profile.motivation || "Chưa cung cấp"}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={toggleEditMode}
                className="text-white hover:opacity-90 text-xs px-2"
                style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};