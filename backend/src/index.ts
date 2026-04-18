import express from 'express';
import cors from 'cors';
import { Role } from './types/express';
import { authenticate, authorize } from './middleware/rbac';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes

/**
 * GET /profile: Accessible to any authenticated user.
 */
app.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'Profile data retrieved successfully.',
    user: req.user,
  });
});

/**
 * POST /content: Accessible only to ADMIN and EDITOR.
 */
app.post('/content', authenticate, authorize([Role.ADMIN, Role.EDITOR]), (req, res) => {
  res.json({
    message: 'Content created successfully.',
    data: req.body,
  });
});

/**
 * DELETE /system: Accessible only to ADMIN.
 */
app.delete('/system', authenticate, authorize([Role.ADMIN]), (req, res) => {
  res.json({
    message: 'System resource deleted.',
  });
});


app.get('/', (req, res) => {
  res.send('RBAC API is running. Try /profile with a Bearer token.');
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
