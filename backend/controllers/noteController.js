const Note = require("../models/Note");

exports.getNotes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error('Error in getNotes:', err);
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = new Note({ user: req.user.id, title: req.body.title });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: "Không tìm thấy ghi chú" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ msg: "Không tìm thấy ghi chú" });
    res.json({ msg: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};
