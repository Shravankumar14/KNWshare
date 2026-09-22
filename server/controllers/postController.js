import Post from '../models/Post.js';
import TeacherProfile from '../models/TeacherProfile.js';

export const getPublicPosts = async (req, res, next) => {
  try {
    const { goal, tag } = req.query;

    const filter = { published: true };
    if (goal) filter.goalSlug = goal;
    if (tag) filter.tags = { $in: [tag] };

    const posts = await Post.find(filter)
      .populate('createdBy', 'name email avatar role bio')
      .sort({ createdAt: -1 })
      .limit(50);

    // Enrich author details with TeacherProfile if present
    const enriched = await Promise.all(posts.map(async (p) => {
      const pObj = p.toObject();
      if (p.createdBy?._id) {
        const teacherProfile = await TeacherProfile.findOne({ userId: p.createdBy._id });
        pObj.authorProfile = teacherProfile ? {
          headline: teacherProfile.headline,
          qualification: teacherProfile.qualification,
          subjects: teacherProfile.subjects,
          rating: teacherProfile.rating || null,
        } : null;
      }
      return pObj;
    }));

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'name email avatar role');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, text, imageUrl, externalLink, tags, goalSlug, published = true } = req.body;

    if (!title || !text) {
      return res.status(400).json({ success: false, message: 'Title and body text are required to publish a post' });
    }

    const post = await Post.create({
      createdBy: req.user._id,
      title,
      text,
      imageUrl: imageUrl || '',
      externalLink: externalLink || { url: '', title: '' },
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      goalSlug: goalSlug || '',
      published: published !== false,
      likesCount: 0,
      discussionsCount: 0,
    });

    res.status(201).json({ success: true, data: post, message: 'Post published successfully!' });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    const allowed = ['title', 'text', 'imageUrl', 'externalLink', 'tags', 'goalSlug', 'published'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'tags' && typeof req.body[key] === 'string') {
          post.tags = req.body[key].split(',').map(t => t.trim());
        } else {
          post[key] = req.body[key];
        }
      }
    });

    await post.save();
    res.json({ success: true, data: post, message: 'Post updated successfully!' });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: post._id });
    res.json({ success: true, message: 'Post deleted successfully!' });
  } catch (err) {
    next(err);
  }
};
