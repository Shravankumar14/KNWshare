import Story from '../models/Story.js';
import TeacherProfile from '../models/TeacherProfile.js';

export const getPublicStories = async (req, res, next) => {
  try {
    const now = new Date();

    // Query published and non-expired stories
    const stories = await Story.find({
      published: true,
      expiresAt: { $gt: now }
    })
      .populate('createdBy', 'name email avatar role bio')
      .sort({ createdAt: -1 })
      .limit(30);

    // Enrich with TeacherProfile details
    const enriched = await Promise.all(stories.map(async (s) => {
      const sObj = s.toObject();
      if (s.createdBy?._id) {
        const teacherProfile = await TeacherProfile.findOne({ userId: s.createdBy._id });
        sObj.authorProfile = teacherProfile ? {
          headline: teacherProfile.headline,
          qualification: teacherProfile.qualification,
          subjects: teacherProfile.subjects,
        } : null;
      }
      return sObj;
    }));

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const getMyStories = async (req, res, next) => {
  try {
    const stories = await Story.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: stories.length, data: stories });
  } catch (err) {
    next(err);
  }
};

export const createStory = async (req, res, next) => {
  try {
    const { mediaUrl, mediaType = 'image', title, text, badge = 'SPARK', isLive = false, slotAction, externalLink, expiresHours = 24 } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ success: false, message: 'Media URL is required to publish a story spark' });
    }

    const expiresAt = new Date(Date.now() + (Number(expiresHours) || 24) * 60 * 60 * 1000);

    const story = await Story.create({
      createdBy: req.user._id,
      mediaUrl,
      mediaType: mediaType === 'video' ? 'video' : 'image',
      title: title || '',
      text: text || '',
      badge: badge || 'SPARK',
      isLive: !!isLive,
      slotAction: slotAction || 'Book 1-on-1 Slot',
      externalLink: externalLink || { url: '', title: '' },
      published: true,
      expiresAt,
    });

    res.status(201).json({ success: true, data: story, message: 'Story spark posted successfully!' });
  } catch (err) {
    next(err);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    if (story.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this story' });
    }

    await Story.deleteOne({ _id: story._id });
    res.json({ success: true, message: 'Story deleted successfully!' });
  } catch (err) {
    next(err);
  }
};
