// backend/controller/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // ĐẢM BẢO đúng đường dẫn/tên file
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
  return o;
};

// helpers ký token (không phụ thuộc middleware)
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

exports.register = async (req, res, next) => {
  try {
    const { email, password, full_name, phone } = req.body || {};

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'email, password, full_name là bắt buộc' });
    }

    // check tồn tại trước
    const q = [{ email: email.toLowerCase().trim() }];
    if (phone) q.push({ phone: String(phone).trim() });
    const existed = await User.findOne({ $or: q });
    if (existed) {
      return res.status(409).json({ message: 'Email/phone đã tồn tại' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const userDoc = await User.create({
      email: email.toLowerCase().trim(),
      phone: phone ? String(phone).trim() : undefined,
      password_hash,
      full_name: full_name.trim(),
      role: 'MENTEE',
      status: 'PENDING',
    });

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

    return res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    // duplicate key
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Email/phone đã tồn tại' });
    }
    next(err);
  }
};

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

    const userDoc = await User.create({
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone).trim() : undefined,
      password_hash,
      full_name: String(full_name).trim(),
      avatar_url: avatar_url || undefined,
      role,                          // <-- nhận role từ body (MENTOR / MENTEE)
      status: role === 'MENTOR' ? 'ACTIVE' : 'PENDING', // tuỳ logic của bạn
      provider: 'local',
      email_verified: false,
    });

    // Nếu là mentor thì đảm bảo có record mentors tương ứng
    if (role === 'MENTOR') {
      await Mentor.findOneAndUpdate(
        { user_id: userDoc._id },
        {
          user_id: userDoc._id,
          // có thể set default field ở đây nếu muốn
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

    return res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Email/phone đã tồn tại' });
    }
    next(err);
  }
};

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

exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { id_token } = req.body; // từ FE gửi { id_token }
    if (!id_token) {
      return res.status(400).json({ message: 'Missing id_token' });
    }

    // Verify id_token với Google
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // email, name, picture, sub, ...
    const email = (payload.email || '').toLowerCase();
    const full_name = payload.name || email.split('@')[0];
    const avatar_url = payload.picture || '';

    if (!email) {
      return res.status(400).json({ message: 'Google token không có email' });
    }

    // Tìm user theo email
    let user = await User.findOne({ email });

    // Nếu chưa có thì tạo mới (provider = 'google')
    if (!user) {
      const randomPwd = 'google:' + payload.sub; // hoặc crypto.randomBytes(16).toString('hex')
      const password_hash = await bcrypt.hash(randomPwd, SALT_ROUNDS);

      user = await User.create({
        email,
        password_hash,
        full_name,
        avatar_url,
        role: 'MENTEE',          // mặc định mentee (tuỳ hệ thống của bạn)
        status: 'ACTIVE',        // hoặc PENDING tuỳ logic
        email_verified: true,    // Google đã verify email
        provider: 'google',      // thêm field này trong schema nếu có
      });
    }

    // Trả tokens
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

    // Ẩn password trả về client
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

    // chỉ áp dụng cho MENTEE, không bị BAN
    const user = await User.findOne({ email: emailRaw, role: 'MENTEE', status: { $ne: 'BANNED' } });

    // Không tiết lộ sự tồn tại của email
    if (!user) {
      lastRequestAt.set(emailRaw, now);
      return res.json({ ok: true, message: 'Nếu email hợp lệ, mật khẩu mới đã được gửi.' });
    }

    // tạo mật khẩu mới (12 ký tự mạnh) & hash
    const newPlainPassword = generateStrongPassword(12);
    const password_hash = await bcrypt.hash(newPlainPassword, 12);

    user.password_hash = password_hash;
    user.provider = 'local';
    await user.save();

    const appName = process.env.APP_NAME || 'MentorHub';
    const loginUrl = process.env.APP_LOGIN_URL || '#';

    // gửi mail qua Gmail OAuth2 (utils/mailer.js của bạn)
    await sendMail({
      to: emailRaw,
      subject: `[${appName}] Mật khẩu mới của bạn`,
      html: buildResetMailTemplate({
        full_name: user.full_name || 'Bạn',
        appName,
        email: user.email,
        newPassword: newPlainPassword,
        loginUrl
      })
    });

    lastRequestAt.set(emailRaw, now);
    return res.json({ ok: true, message: 'Nếu email hợp lệ, mật khẩu mới đã được gửi.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
};

// ========== helpers ==========
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
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}