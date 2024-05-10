import express from 'express';
import mongoose from 'mongoose';

import checkAuth from './utils/checkAuth.js';

import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
import { PostController, UserController } from './controllers/index.js';

import cors from 'cors';

import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
  .connect(
    'mongodb+srv://itsokey086:Kolan3121@cluster0.xuiy6bw.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => console.log('DB Ok'))
  .catch((err) => console.log(err));

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ mes: 'Все отлично!', url: `/uploads/${req.file.originalname}` });
});

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/posts/', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts/', PostController.getAll);
app.get('/posts/tags/:tag', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/comments', PostController.getLastComments);

app.post('/comments/:id', checkAuth, PostController.createComment);

app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  postCreateValidation,
  handleValidationErrors,
  checkAuth,
  PostController.update,
);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('err');
  }

  console.log('Server OK');
});
