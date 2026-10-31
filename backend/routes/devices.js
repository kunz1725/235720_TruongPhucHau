const router = require('express').Router();
const mongoose = require('mongoose');
const Device = require('../models/Device');

const checkId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id)
    ? next()
    : res.status(400).json({ message: 'ID không hợp lệ' });

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/devices  và  GET /api/devices?search=projector
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const search = (req.query.search || '').trim();
    if (search) {
      const re = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ deviceId: re }, { name: re }, { deviceType: re }, { room: re }];
    }
    res.json(await Device.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

// GET /api/devices/:id
router.get('/:id', checkId, async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(device);
  } catch (e) { next(e); }
});

// POST /api/devices
router.post('/', async (req, res, next) => {
  try {
    const exists = await Device.findOne({ deviceId: String(req.body.deviceId || '').trim() });
    if (exists) return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });
    res.status(201).json(await Device.create(req.body));
  } catch (e) { next(e); }
});

// PUT /api/devices/:id
router.put('/:id', checkId, async (req, res, next) => {
  try {
    if (req.body.deviceId) {
      const dup = await Device.findOne({
        deviceId: String(req.body.deviceId).trim(),
        _id: { $ne: req.params.id },
      });
      if (dup) return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });
    }
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(device);
  } catch (e) { next(e); }
});

// DELETE /api/devices/:id
router.delete('/:id', checkId, async (req, res, next) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json({ message: 'Đã xóa thiết bị' });
  } catch (e) { next(e); }
});

module.exports = router;