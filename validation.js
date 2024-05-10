import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Недостаточно символов для пароля').isLength({ min: 5 }),
  body('fullName', 'Недостаточно символов для полного имени').isLength({ min: 3 }),
  body('avatarUrl', 'Обьект не является ссылкой').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Недостаточно символов для пароля').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Недостаточно символов для заголовка').isLength({ min: 5 }).isString(),
  body('text', 'Недостаточно кол-во текста').isLength({ min: 5 }).isString(),
  body('tags', 'Неверный формат тегов').optional().isArray(),
  body('imageUrl', 'Недостаточно символов для юрл картинки').optional().isString(),
];
