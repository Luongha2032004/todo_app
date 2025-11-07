const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecretkey";

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Register payload:', req.body);
  if (!username || !password)
    return res.status(400).json({ msg: "Thiếu username hoặc password" });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ msg: "Username đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
  // populate an email placeholder in case the DB has an existing unique index on `email`
  const placeholderEmail = `${username}-${Date.now()}@noemail.local`;
  const user = new User({ username, password: hashedPassword, email: placeholderEmail });
    await user.save();

    res.status(201).json({ msg: "Đăng ký thành công" });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: "Thiếu username hoặc password" });

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Tài khoản không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Mật khẩu không đúng" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Lỗi server" });
  }
};
