// backend/controller/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Mentor = require('../models/mentor.model');
const { OAuth2Client } = require('google-auth-library');
const { signAccessToken, signRefreshToken } = require('../middleware/auth.middleware');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { sendMail } = require('../utils/mailer');
const crypto = require('crypto');
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const sanitize = (doc) => {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  delete o.password_hash;
  delete o.verification_token; // ẩn token khỏi response
  return o;
};

// helpers ký token
function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '15m',
  });
}
function signRefresh(payload) {
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES || '30d',
  });
}

// ========== ĐĂNG KÝ VỚI EMAIL VERIFICATION ==========
exports.register = async (req, res, next) => {
  try {
    const { email, password, full_name, phone, role: roleRaw, avatar_url } = req.body || {};

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'email, password, full_name là bắt buộc' });
    }

    // check tồn tại trước
    const q = [{ email: String(email).toLowerCase().trim() }];
    if (phone) q.push({ phone: String(phone).trim() });
    const existed = await User.findOne({ $or: q });
    if (existed) {
      return res.status(409).json({ message: 'Email/phone đã tồn tại' });
    }

    // Chỉ cho phép 2 role: MENTEE (default) hoặc MENTOR
    const normalizedRole = String(roleRaw || '').toUpperCase();
    const role = normalizedRole === 'MENTOR' ? 'MENTOR' : 'MENTEE';

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // ✅ Tạo token xác thực email (32 bytes hex = 64 ký tự)
    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

    const userDoc = await User.create({
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone).trim() : undefined,
      password_hash,
      full_name: String(full_name).trim(),
      avatar_url: avatar_url || undefined,
      role,
      status: 'PENDING', // ✅ Tài khoản ở trạng thái PENDING cho đến khi verify
      provider: 'local',
      email_verified: false,
      verification_token,
      verification_expires,
    });

    // Nếu là mentor thì đảm bảo có record mentors tương ứng
    if (role === 'MENTOR') {
      await Mentor.findOneAndUpdate(
        { user_id: userDoc._id },
        {
          user_id: userDoc._id,
          job_title: '',
          company: '',
          category: '',
          skill: '',
          bio: '',
          current_position: '',
          linkedin_url: '',
          personal_link_url: '',
          intro_video: '',
          featured_article: '',
          question: {},
          cv_img: '',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // ✅ Gửi email xác thực
    const appName = process.env.APP_NAME || 'MentorHub';
    const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${verification_token}`;

    try {
      await sendMail({
        to: userDoc.email,
        subject: `[${appName}] Xác thực tài khoản của bạn`,
        html: buildVerificationMailTemplate({
          full_name: userDoc.full_name,
          appName,
          verifyUrl,
        }),
      });
    } catch (mailError) {
      console.error('Lỗi gửi email xác thực:', mailError);
      // Vẫn tạo tài khoản thành công, chỉ log lỗi email
    }

    const user = sanitize(userDoc);
    // Nếu muốn cho login ngay, uncomment phần dưới
    /*
    const accessToken = signAccess({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    const refreshToken = signRefresh({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    */

    return res.status(201).json({
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user,
      // accessToken, // bỏ comment nếu muốn cho login trước khi verify
      // refreshToken,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Email/phone đã tồn tại' });
    }
    next(err);
  }
};

// ========== XÁC THỰC EMAIL ==========
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query || req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token xác thực không hợp lệ' });
    }

    // Tìm user với token và chưa hết hạn
    const user = await User.findOne({
      verification_token: token,
      verification_expires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại.',
      });
    }

    // ✅ Cập nhật trạng thái
    user.email_verified = true;
    user.status = 'ACTIVE';
    user.verification_token = undefined;
    user.verification_expires = undefined;
    await user.save();

    // Tạo token để user login ngay
    const accessToken = signAccess({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    const refreshToken = signRefresh({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const userSafe = sanitize(user);

    return res.json({
      message: 'Xác thực email thành công!',
      user: userSafe,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ========== GỬI LẠI EMAIL XÁC THỰC ==========
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
      email_verified: false,
      provider: 'local',
    });

    if (!user) {
      // Không tiết lộ thông tin user
      return res.json({
        message: 'Nếu email tồn tại và chưa xác thực, email mới đã được gửi.',
      });
    }

    // Tạo token mới
    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verification_token = verification_token;
    user.verification_expires = verification_expires;
    await user.save();

    // Gửi email
    const appName = process.env.APP_NAME || 'MentorHub';
    const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${verification_token}`;

    try {
      await sendMail({
        to: user.email,
        subject: `[${appName}] Xác thực tài khoản của bạn`,
        html: buildVerificationMailTemplate({
          full_name: user.full_name,
          appName,
          verifyUrl,
        }),
      });
    } catch (mailError) {
      console.error('Lỗi gửi email xác thực:', mailError);
      return res.status(500).json({ message: 'Không thể gửi email. Vui lòng thử lại.' });
    }

    return res.json({
      message: 'Nếu email tồn tại và chưa xác thực, email mới đã được gửi.',
    });
  } catch (err) {
    next(err);
  }
};

// ========== LOGIN (Kiểm tra email_verified) ==========
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email, password là bắt buộc' });
    }

    const userDoc = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userDoc) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    const ok = await bcrypt.compare(password, userDoc.password_hash);
    if (!ok) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });

    // ✅ Kiểm tra email đã xác thực chưa (chỉ với local provider)
    if (userDoc.provider === 'local' && !userDoc.email_verified) {
      return res.status(403).json({
        message: 'Vui lòng xác thực email trước khi đăng nhập.',
        email_verified: false,
      });
    }

    const user = sanitize(userDoc);

    const accessToken = signAccess({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });
    const refreshToken = signRefresh({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return res.json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

// ========== REFRESH TOKEN ==========
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ message: 'Thiếu refreshToken' });

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token không hợp lệ/đã hết hạn' });
    }

    const accessToken = signAccess({
      id: payload.id,
      role: payload.role,
      email: payload.email,
    });

    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// ========== LOGIN WITH GOOGLE ==========
exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: 'Missing id_token' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = (payload.email || '').toLowerCase();
    const full_name = payload.name || email.split('@')[0];
    const avatar_url = payload.picture || '';

    if (!email) {
      return res.status(400).json({ message: 'Google token không có email' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPwd = 'google:' + payload.sub;
      const password_hash = await bcrypt.hash(randomPwd, SALT_ROUNDS);

      user = await User.create({
        email,
        password_hash,
        full_name,
        avatar_url,
        role: 'MENTEE',
        status: 'ACTIVE',
        email_verified: true, // Google đã verify
        provider: 'google',
      });
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const { password_hash, ...userSafe } = user.toObject();

    return res.json({
      user: userSafe,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ========== FORGOT PASSWORD ==========
const lastRequestAt = new Map();
const THROTTLE_MS = 5 * 60 * 1000;

exports.forgotPassword = async (req, res) => {
  try {
    const emailRaw = String(req.body.email || '').trim().toLowerCase();
    if (!emailRaw) return res.status(400).json({ ok: false, error: 'Missing email' });

    const now = Date.now();
    const last = lastRequestAt.get(emailRaw) || 0;
    if (now - last < THROTTLE_MS) {
      const waitSec = Math.ceil((THROTTLE_MS - (now - last)) / 1000);
      return res.status(429).json({ ok: false, error: `Vui lòng thử lại sau ${waitSec}s` });
    }

    const user = await User.findOne({ email: emailRaw, role: 'MENTEE', status: { $ne: 'BANNED' } });

    if (!user) {
      lastRequestAt.set(emailRaw, now);
      return res.json({ ok: true, message: 'Nếu email hợp lệ, mật khẩu mới đã được gửi.' });
    }

    const newPlainPassword = generateStrongPassword(12);
    const password_hash = await bcrypt.hash(newPlainPassword, 12);

    user.password_hash = password_hash;
    user.provider = 'local';
    await user.save();

    const appName = process.env.APP_NAME || 'MentorHub';
    const loginUrl = process.env.APP_LOGIN_URL || '#';

    await sendMail({
      to: emailRaw,
      subject: `[${appName}] Mật khẩu mới của bạn`,
      html: buildResetMailTemplate({
        full_name: user.full_name || 'Bạn',
        appName,
        email: user.email,
        newPassword: newPlainPassword,
        loginUrl,
      }),
    });

    lastRequestAt.set(emailRaw, now);
    return res.json({ ok: true, message: 'Nếu email hợp lệ, mật khẩu mới đã được gửi.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
};

// ========== HELPER FUNCTIONS ==========
function generateStrongPassword(length = 12) {
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.?';
  const all = lowers + uppers + digits + symbols;

  const pick = (set) => set[crypto.randomInt(0, set.length)];
  let pwd = pick(lowers) + pick(uppers) + pick(digits) + pick(symbols);
  for (let i = pwd.length; i < length; i++) pwd += pick(all);
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
}

function buildVerificationMailTemplate({ full_name, appName, verifyUrl }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;max-width:600px;margin:0 auto">
    <div style="background:#4CAF50;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="margin:0">${escapeHtml(appName)}</h1>
    </div>
    <div style="background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px">
      <h2 style="color:#333">Xin chào ${escapeHtml(full_name)}!</h2>
      <p style="color:#666;font-size:16px">
        Cảm ơn bạn đã đăng ký tài khoản tại <b>${escapeHtml(appName)}</b>.
      </p>
      <p style="color:#666;font-size:16px">
        Vui lòng nhấn vào nút bên dưới để xác thực email và kích hoạt tài khoản:
      </p>
      <div style="text-align:center;margin:30px 0">
        <a href="${verifyUrl}" 
           style="background:#4CAF50;color:white;padding:14px 28px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold">
          Xác thực tài khoản
        </a>
      </div>
      <p style="color:#999;font-size:14px">
        Hoặc copy link sau vào trình duyệt:<br>
        <span style="color:#4CAF50;word-break:break-all">${verifyUrl}</span>
      </p>
      <p style="color:#999;font-size:14px;margin-top:30px">
        Link này sẽ hết hạn sau 24 giờ.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:30px 0">
      <p style="color:#999;font-size:12px">
        Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
      </p>
    </div>
  </div>
  `;
}

function buildResetMailTemplate({ full_name, appName, email, newPassword, loginUrl }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
    <h2>${escapeHtml(appName)} - Mật khẩu mới</h2>
    <p>Xin chào ${escapeHtml(full_name)},</p>
    <p>Bạn (hoặc ai đó) vừa yêu cầu cấp lại mật khẩu cho tài khoản <b>${escapeHtml(email)}</b>.</p>
    <p>Mật khẩu mới của bạn là:</p>
    <div style="padding:12px 16px;background:#f6f8fa;border:1px solid #eaecef;border-radius:6px;font-weight:bold;display:inline-block">
      ${escapeHtml(newPassword)}
    </div>
    <p>Vui lòng đăng nhập và đổi mật khẩu ngay để đảm bảo an toàn.</p>
    <p><a href="${loginUrl}" target="_blank" rel="noopener">Đăng nhập ngay</a></p>
    <hr />
    <p style="font-size:12px;color:#666">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
  </div>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}