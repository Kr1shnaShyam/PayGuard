import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const router = Router();

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) { next(err); }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, u.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: u._id, role: u.role, email: u.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: '2h' });

    res.json({ success: true, token });
  } catch (err) { next(err); }
});

export default router;
