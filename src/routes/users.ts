import { Router, Request, Response } from 'express';
import User from '../models/user';
import Company from '../models/company';
import { validate } from '../middlewares/validation';
import { userSchema } from '../schemas/user';

const router = Router();

//TODO: Consider as one of the user authentication method in the future
router.post('/signup', validate(userSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const newUser = new User({ email });
  newUser.setPassword(password);
  await newUser.save();

  return res.status(201).json({
    message: 'User created successfully',
    data: {
      userId: newUser._id,
    },
  });
});

router.post('/signin', validate(userSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  const result = user?.validatePassword(password);

  if (result) {
    return res.status(201).json({
      message: 'User sign in successfully',
      data: {
        userId: user._id,
      },
    });
  } else {
    return res.status(401).json({
      message: 'Invalid password',
    });
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  return res.status(200).json({
    message: 'Successfully fetched user',
    data: {
      email: user?.email,
      id: user?._id,
    },
  });
});

router.get('/:userId/companies', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const companies = await Company.find({ userId });

  return res.status(200).json({
    message: 'Successfully fetched companies belongs to user',
    data: companies,
  });
});

export default router;

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'test@example.com'
 *               password:
 *                 type: string
 *                 example: 'mypassword123'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *       400:
 *         description: Invalid input
 *
 * /api/users/signin:
 *   post:
 *     summary: Authenticate a user and sign in
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'test@example.com'
 *               password:
 *                 type: string
 *                 example: 'mypassword123'
 *     responses:
 *       201:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid password
 *
 * /api/users/{userId}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     id:
 *                       type: string
 *       404:
 *         description: User not found
 *
 * /api/users/{userId}/companies:
 *   get:
 *     summary: Get all companies belonging to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched companies belonging to user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 */
