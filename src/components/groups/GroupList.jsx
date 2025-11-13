import { useState, useEffect, useRef } from "react";

export default function GroupList({ onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const listRef = useRef(null);
  const renameInputRef = useRef(null);

  // Load groups on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/groups")
      .then((res) => res.json())
      .then(setGroups)
      .catch((err) => console.error("Failed to load groups:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!listRef.current) return;
      if (!listRef.current.contains(e.target)) {
        setMenuOpenId(null);
        setEditingId(null);
        setShowInput(false);
        setEditingName("");
        setNewGroupName("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [editingId]);

  // Add new group
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName }),
      });
      if (res.ok) {
        const created = await res.json();
        setGroups([...groups, created]);
        setNewGroupName("");
        setShowInput(false);
      }
    } catch (err) {
      console.error("Error adding group:", err);
    }
  };

  // Delete group
  const handleDelete = async (id) => {
    if (!confirm("Delete this group?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGroups(groups.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error("Error deleting group:", err);
    }
  };

  // Rename group
  const handleRename = async (id) => {
    const name = editingName.trim();
    if (!name) return;

    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ id, name }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        console.error("Rename failed:", res.status, msg);
        alert(`Rename failed (${res.status}): ${msg || "unknown error"}`);
        return;
      }
      setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error("Error renaming group:", err);
      alert("Network error while renaming group.");
    }
  };

  return (
    <div ref={listRef} className="mt-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-black text-lg">
            folder_open
          </span>
          <h2 className="font-cormorant text-slate-700">Categories</h2>
        </div>

        <button
          className="text-purple-400 text-sm hover:underline"
          onClick={() => setShowInput(!showInput)}
        >
          + New
        </button>
      </div>

      {/* Add new group input */}
      {showInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddGroup();
              }
            }}
            className="flex-1 rounded-lg bg-white/20 p-2 text-sm border border-white/20"
            placeholder="Enter the name"
          />
          <button
            onClick={handleAddGroup}
            className="px-2 py-2 rounded-xl bg-purple-400/100 text-white text-sm font-medium
             hover:bg-purple-600 hover:shadow-sm active:scale-[0.98] transition-all"
          >
            Add
          </button>
        </div>
      )}

      {/* Group list */}
      <ul className="space-y-1">
        {groups.map((g) => (
          <li
            key={g.id}
            className="group flex justify-between items-center px-2 py-1 rounded-md hover:bg-purple-100/40 text-slate-700 transition-all"
          >
            {editingId === g.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  ref={renameInputRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleRename(g.id);
                    } else if (e.key === "Escape") {
                      setEditingId(null);
                    }
                  }}
                  className="flex-1 bg-white/80 border border-purple-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-purple-300"
                />

                <button
                  onClick={() => {
                    console.log("Saving rename", { id: g.id, editingName });
                    handleRename(g.id);
                  }}
                  className="text-green-600 text-xs font-medium hover:underline"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => onSelectGroup(g.id)}
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-black">
                    category
                  </span>
                  <span>{g.name}</span>
                </div>

                {/* Context Menu (3 dots) */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === g.id ? null : g.id)
                    }
                    className="material-symbols-outlined text-gray-500 hover:text-purple-700 text-lg"
                  >
                    more_vert
                  </button>

                  {menuOpenId === g.id && (
                    <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                      <button
                        onClick={() => {
                          setEditingId(g.id);
                          setEditingName(g.name);
                          setMenuOpenId(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-purple-50"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
