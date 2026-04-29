import { asyncHandler } from '../utils/asyncHandler.js';
import { getCurrentUser, loginUser, signupUser } from '../services/authService.js';

export const signup = asyncHandler(async (req, res) => {
  const result = await signupUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  res.json({ user });
});
