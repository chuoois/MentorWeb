const MentorChat = require('../models/mentorChat.model');
const MentorOrder = require('../models/mentorOrder.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

//  CREATE
// body: { order_id, sender_id, receiver_id, message, message_type }
exports.create = async (req, res) => {
  try {
    const { order_id, sender_id, receiver_id, message, message_type } = req.body;

    if (!order_id || !sender_id || !receiver_id || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    if (![order_id, sender_id, receiver_id].every(isObjectId)) {
      return res.status(400).json({ ok: false, error: 'Invalid ID format' });
    }

    const order = await MentorOrder.findById(order_id);
    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });

    const sender = await User.findById(sender_id);
    const receiver = await User.findById(receiver_id);
    if (!sender || !receiver) return res.status(404).json({ ok: false, error: 'Sender or receiver not found' });

    // Chỉ những người trong order mới được nhắn
    if (![order.mentor_id.toString(), order.mentee_id.toString()].includes(sender_id)) {
      return res.status(403).json({ ok: false, error: 'Sender not in this order' });
    }

    const chat = await MentorChat.create({
      order_id,
      sender_id,
      receiver_id,
      message,
      message_type: message_type || 'TEXT'
    });

    return res.status(201).json({ ok: true, data: chat });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  LIST - lấy tin nhắn theo order_id
exports.list = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isObjectId(orderId)) return res.status(400).json({ ok: false, error: 'Invalid orderId' });

    const chats = await MentorChat.find({ order_id: orderId })
      .populate('sender_id', 'full_name avatar_url role')
      .populate('receiver_id', 'full_name avatar_url role')
      .sort({ created_at: 1 });

    return res.json({ ok: true, data: chats });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// GET ONE - xem 1 tin nhắn
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const chat = await MentorChat.findById(id)
      .populate('sender_id', 'full_name')
      .populate('receiver_id', 'full_name');

    if (!chat) return res.status(404).json({ ok: false, error: 'Chat not found' });

    return res.json({ ok: true, data: chat });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  UPDATE (chỉ người gửi hoặc admin được sửa)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    if (!message) return res.status(400).json({ ok: false, error: 'Message required' });

    const chat = await MentorChat.findById(id);
    if (!chat) return res.status(404).json({ ok: false, error: 'Chat not found' });

    if (req.user?.role !== 'ADMIN' && chat.sender_id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    chat.message = message;
    await chat.save();

    return res.json({ ok: true, data: chat });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  DELETE (admin hoặc người gửi)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const chat = await MentorChat.findById(id);
    if (!chat) return res.status(404).json({ ok: false, error: 'Chat not found' });

    if (req.user?.role !== 'ADMIN' && chat.sender_id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    await chat.deleteOne();
    return res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
