import React from "react";

export default function NoteItem({ note, onToggle, onEdit, onDelete }) {
  return (
    <div className="note-item">
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <input type="checkbox" checked={note.completed} onChange={() => onToggle(note)} />
        <div>
          <div className="note-title" style={{textDecoration: note.completed ? "line-through" : "none"}}>
            {note.title}
          </div>
          <div className="note-meta">{new Date(note.createdAt).toLocaleString()}</div>
        </div>
      </div>

      <div className="controls">
        <button className="icon-btn btn-edit" title="Sửa" onClick={() => onEdit(note)}>✏️</button>
        <button className="icon-btn btn-delete" title="Xóa" onClick={() => onDelete(note)}>🗑️</button>
      </div>
    </div>
  );
}
