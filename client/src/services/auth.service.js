import api from "@/lib/axios";

/**
 * AuthService: Cung cấp các hàm đăng ký / đăng nhập / xác thực Google / refresh / quên mật khẩu
 * Toàn bộ request đều hướng tới /auth/... tương ứng với backend.
 */
const AuthService = {
  /**
   * Đăng ký tài khoản
   * @param {Object} data - { email, password, full_name, phone?, role?, avatar_url? }
   */
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Đăng nhập thông thường
   * @param {Object} data - { email, password }
   */
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Đăng nhập bằng Google OAuth2
   * @param {string} id_token - token lấy từ Google API (googleClient.signIn())
   */
  loginWithGoogle: async (id_token) => {
    const res = await api.post("/auth/google", { id_token });
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Refresh access token bằng refreshToken lưu trong localStorage
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Missing refresh token");
    const res = await api.post("/auth/refresh", { refreshToken });
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    return res.data;
  },

  /**
   * Gửi yêu cầu quên mật khẩu
   * @param {string} email - Email người dùng
   */
  forgotPassword: async (email) => {
    const res = await api.post("/auth/forgot", { email });
    return res.data;
  },

  /**
   * Đăng xuất - xoá token và thông tin người dùng khỏi localStorage
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  /**
   * Lấy thông tin người dùng hiện tại từ localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Kiểm tra người dùng hiện tại và quyền (role)
   * @param {string[]} roles - danh sách vai trò cho phép (ví dụ ['ADMIN', 'MENTOR'])
   * @returns {boolean}
   */
  hasRole: (roles = []) => {
    const user = AuthService.getCurrentUser();
    return user && roles.includes(user.role);
  },

  /**
   * Kiểm tra xem đã đăng nhập chưa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  },
};

export default AuthService;
