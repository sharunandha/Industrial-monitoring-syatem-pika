const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "12h"
  });

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: "Admin credentials not configured" });
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = { email: adminEmail, role: "admin" };
    const token = createToken(user);
    return res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    return res.status(403).json({ message: "User registration disabled" });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  res.json({ email: req.user.email, role: req.user.role });
};

module.exports = { login, register, me };
