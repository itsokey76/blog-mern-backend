import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  const activeSort = req.query.activeSort;
  const tagToFind = req.params.tag;
  try {
    console.log(req.params);
    console.log(tagToFind);

    const query = PostModel.find();

    if (tagToFind) {
      query.where('tags').in([tagToFind]);
    }
    const posts = await query
      .sort(activeSort === '0' ? { viewsCount: +1 } : { viewsCount: -1 })
      .populate({
        path: 'user',
        select: 'fullName avatarUrl',
      })
      .exec();

    if (posts) {
      res.json({ posts });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((item) => item.tags)
      .flat()
      .slice(0, 5);

    if (posts) {
      res.json({ tags });
    }
  } catch (error) {
    res.status(500).json({
      mes: 'Не получилось запросить теги',
    });
  }
};
export const getLastComments = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({
        path: 'comments.user',
        select: 'fullName avatarUrl',
      })
      .limit(5)
      .exec();

    const comments = posts
      .map((item) => item.comments)
      .flat()
      .slice(0, 5);

    if (posts) {
      res.json({ comments });
    }
  } catch (error) {
    res.status(500).json({
      mes: 'Не получилось запросить комментарии',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate('user')
      .populate({
        path: 'comments.user',
        select: 'fullName avatarUrl',
      })
      .exec();

    if (!post) {
      return res.status(404).json({ mes: 'Статья не найдена' });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({
      mes: 'Статья не найдена',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findOneAndDelete({
      _id: id,
    })
      .populate('user')
      .exec();

    if (post) {
      return res.json({ mes: `Статья "${post.title}" была успешно удалена`, id });
    }
  } catch (error) {
    res.status(500).json({
      mes: 'Статья не найдена либо уже удалена',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      comments: [],
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      mes: 'Не удалось создать статью',
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await PostModel.findOneAndUpdate(
      {
        _id: blogId,
      },
      {
        $push: {
          comments: {
            text: req.body.text,
            user: req.userId,
          },
        },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate({
        path: 'comments.user',
        select: 'fullName avatarUrl',
      })
      .exec();

    if (blog) {
      return res.json(blog.comments);
    } else {
      return res.json({ mes: 'no' });
    }
  } catch (error) {}
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
      },
    );

    if (!post) {
      return res.status(404).json({
        mes: 'Статья не найдена',
      });
    }

    res.json({
      mes: `Статья была успешно обновлена`,
    });
  } catch (error) {
    res.status(500).json({
      mes: 'Нe удалось обновить статью',
    });
  }
};
