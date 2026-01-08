import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getData } from "./jsonbin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const db = await getData();
    const admin = db.admins.find(a => a.email === email);

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        academyName: admin.academyName,
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}
