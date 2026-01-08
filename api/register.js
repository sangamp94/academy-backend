import bcrypt from "bcryptjs";
import connectDB from "./db";
import Admin from "./models/Admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { academyName, adminName, email, password } = req.body;

    if (!academyName || !adminName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      academyName,
      adminName,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
