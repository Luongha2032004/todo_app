import React, { useEffect, useState } from "react";
import API from "../utils/api";
import NoteItem from "../components/NoteItem";

export default function TodoPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(null); // note being edited
  const [err, setErr] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await API.get("/notes");
      setNotes(res.data.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      setErr("Không thể lấy danh sách notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (editing) {
        const res = await API.put(`/notes/${editing._id}`, { title });
        setNotes((prev) => prev.map(n => n._id === res.data._id ? res.data : n));
        setEditing(null);
      } else {
        const res = await API.post("/notes", { title });
        setNotes(prev => [res.data, ...prev]);
      }
      setTitle("");
    } catch (error) {
      setErr("Lỗi khi lưu note");
    }
  };

  const handleEdit = (note) => {
    setEditing(note);
    setTitle(note.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (note) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await API.delete(`/notes/${note._id}`);
      setNotes(prev => prev.filter(n => n._id !== note._id));
    } catch (error) {
      setErr("Xóa thất bại");
    }
  };

  const handleToggle = async (note) => {
    try {
      const res = await API.put(`/notes/${note._id}`, { completed: !note.completed });
      setNotes(prev => prev.map(n => n._id === res.data._id ? res.data : n));
    } catch (error) {
      setErr("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div>
      <div className="card" style={{marginBottom:12}}>
        <h3>{editing ? "Sửa note" : "Tạo note mới"}</h3>
        <form className="form" onSubmit={handleCreateOrUpdate}>
          <input className="input" placeholder="Viết ghi chú..." value={title} onChange={e=>setTitle(e.target.value)} />
          <div style={{display:"flex", gap:8}}>
            <button className="btn-block" style={{flex:1}}>{editing ? "Cập nhật" : "Thêm"}</button>
            {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setTitle(""); }}>Hủy</button>}
          </div>
        </form>
        {err && <div style={{color:"var(--danger)", marginTop:8}}>{err}</div>}
      </div>

      <div className="card">
        <h3>Danh sách ghi chú</h3>
        {loading ? (
          <div className="small">Đang tải...</div>
        ) : notes.length === 0 ? (
          <div className="empty">Chưa có ghi chú nào. Thêm ngay!</div>
        ) : (
          <div className="note-list">
            {notes.map(note => (
              <NoteItem
                key={note._id}
                note={note}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
