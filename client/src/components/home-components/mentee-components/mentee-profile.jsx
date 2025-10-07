import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, Mail, Phone, Save } from "lucide-react";
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
    experience: "",
    motivation: "",
  });

  // 🔹 Fetch mentee profile
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
          experience: data.experience || "",
          motivation: data.motivation || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Không tải được thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Update profile
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

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner className="w-12 h-12" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  // 🔹 Empty profile
  if (!profile) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-lg font-medium" style={{ color: "#333333" }}>
          Không tìm thấy thông tin hồ sơ
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ
        </p>
      </div>
    );
  }

  // 🔹 Main UI
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F9C5D5" }}>
              <User className="w-6 h-6" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
                Hồ sơ của bạn
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Xem và quản lý thông tin cá nhân của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Điểm GPA</label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập điểm GPA"
                  step="0.01"
                  min="0"
                  max="4"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Kinh nghiệm</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Nhập kinh nghiệm của bạn"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Động lực học tập</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Nhập động lực học tập"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={toggleEditMode}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: "#6B7280" }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
              >
                {saving ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                <p className="text-base font-medium mt-1" style={{ color: "#333333" }}>
                  {profile.full_name || "Chưa cung cấp"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-base" style={{ color: "#333333" }}>
                    {profile.email || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="text-base" style={{ color: "#333333" }}>
                    {profile.phone || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Điểm GPA</label>
                <p className="text-base" style={{ color: "#333333" }}>
                  {profile.gpa != null ? profile.gpa.toFixed(2) : "Chưa cung cấp"}
                </p>
              </div>
            </div>

            {profile.experience && (
              <div>
                <label className="text-sm font-medium text-gray-500">Kinh nghiệm</label>
                <p className="text-base mt-1 bg-gray-50 p-3 rounded-lg" style={{ color: "#333333" }}>
                  {profile.experience}
                </p>
              </div>
            )}

            {profile.motivation && (
              <div>
                <label className="text-sm font-medium text-gray-500">Động lực học tập</label>
                <p className="text-base mt-1 bg-gray-50 p-3 rounded-lg" style={{ color: "#333333" }}>
                  {profile.motivation}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={toggleEditMode}
                className="text-white hover:opacity-90"
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
