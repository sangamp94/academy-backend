import bcrypt from "bcryptjs";
import { getData, updateData } from "./jsonbin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { academyName, adminName, email, password } = req.body;

    if (!academyName || !adminName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const db = await getData();
    db.admins = db.admins || [];

    const exists = db.admins.find(a => a.email === email);
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.admins.push({
      id: Date.now().toString(),
      academyName,
      adminName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    await updateData(db);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully"
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}
