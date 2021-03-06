import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

import User from "../database/userModel.js";
import tokenModel from "../database/tokenModel.js";

const router = express.Router();

// gelen kayıt istekleri buraya gelecek
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists)
      return res
        .status(400)
        .json({ message: "Bu emaile sahip bir kullanıcı mevcut" });

    if (password != confirmPassword)
      return res.status(400).json({ message: "Şifreler eşleşmiyor" });

    // password, 'salt'. salt parametresi sayısı ne akdar yükselirse hashlenmiş password daha güçlü oluyor
    // ama o zamanda daha yavaş bir süreç oluyor azalırsa da hash süresi kısa oluyor ama güvenlik azalıyor
    // default olarak 10 veriyoruz.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name: `${firstName} ${lastName}`,
      password: hashedPassword,
    });

    // local storage de saklanır.
    const accessToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        // Access tokene 3 dakika limit veriyoruz.
        expiresIn: "3m",
      }
    );

    // database de saklanacak,
    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    await tokenModel.create({
      userId: user._id,
      refreshToken: refreshToken,
    });

    res.status(200).json({ user, accessToken });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res
        .status(404)
        .json({ message: "Giriş bilgilerinizi kontrol edip tekrar deneyin" });

    const accessToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3m" }
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    await tokenModel.findOneAndUpdate(
      { userId: user._id },
      { refreshToken: refreshToken },
      { new: true }
    );

    res.status(200).json({ user, accessToken });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/logout/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await tokenModel.findOneAndUpdate(
      {
        userId: id,
      },
      { refreshToken: null },
      // güncellenmiş elemanı döndürmek için new:true kullandık.
      { new: true }
    );
    res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
