import React, { useState, useEffect } from "react";

const STORAGE_KEY = "attendency_groups";

function App() {
  const [groups, setGroups] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (e) {
      console.error("Failed to load from localStorage", e);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [editingGroup, setEditingGroup] = useState(null); // null: 新規, object: 編集

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [groups]);

  const openNewModal = () => {
    setEditingGroup(null);
    setGroupName("");
    setMemberCount("");
    setIsModalOpen(true);
  };

  const openEditModal = (group, e) => {
    e.stopPropagation(); // カードクリックのトグルを止める
    setEditingGroup(group);
    setGroupName(group.name);
    setMemberCount(String(group.count));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddOrUpdateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim() || memberCount === "") return;

    const countNum = Number(memberCount);

    if (editingGroup) {
      // ✏️ 編集モード
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: groupName.trim(), count: countNum }
            : g
        )
      );
    } else {
      // 🆕 新規登録
      const newGroup = {
        id: Date.now(),
        name: groupName.trim(),
        count: countNum,
        status: countNum === 0 ? "unknown" : "pending",
      };
      setGroups((prev) => [...prev, newGroup]);
    }

    closeModal();
  };

  const toggleStatus = (id) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status:
                g.status === "pending"
                  ? "ok"
                  : g.status === "ok"
                  ? "pending"
                  : g.status, // unknown はそのままにしてもいいし、好みに応じて変更
            }
          : g
      )
    );
  };

  const deleteGroup = (id, e) => {
    e.stopPropagation(); // カードクリックのトグルを止める
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "#ff9800"; // 橙
    if (status === "ok") return "#4caf50"; // 緑
    if (status === "unknown") return "#9c27b0"; // 紫（参加不明）
    return "#ccc";
  };

  const handleResetAll = () => {
    if (!window.confirm("本当に全ての集団を削除しますか？")) return;

    setGroups([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "未確定（タップで出席）";
    if (status === "ok") return "出席";
    if (status === "unknown") return "参加不明";
    return "不明";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "16px 4vw",
        boxSizing: "border-box",
        background: "#f5f5f5",
      }}
    >
      {/* 中央寄せ + 最大幅コンテナ */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        {/* ヘッダー行（タイトル + ボタン） */}
      <div
         style={{
           display: "flex",
           alignItems: "center",
           justifyContent: "space-between",
           gap: "12px",
           flexWrap: "wrap",
           marginBottom: "16px",
         }}
       >
         <h1 style={{ margin: 0 }}>出欠管理</h1>

         <div
           style={{
             display: "flex",
             gap: "8px",
             flexWrap: "wrap",
           }}
         >
           <button
             onClick={handleResetAll}
             style={{
               padding: "8px 12px",
               borderRadius: "999px",
               border: "none",
               cursor: "pointer",
               fontSize: "13px",
               background: "#ffebee",
               color: "#c62828",
             }}
           >
             全体リセット
           </button>

           <button
             onClick={openNewModal}
             style={{
               padding: "8px 16px",
               borderRadius: "999px",
               border: "none",
               cursor: "pointer",
               fontSize: "14px",
               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
               background: "#ffffff",
             }}
           >
             ＋ 集団を追加
           </button>
         </div>
       </div>

        {/* カードグリッド */}
        <div
          className="group-grid"
          style={{
            marginTop: "8px",
          }}
        >
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => toggleStatus(group.id)}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                cursor: "pointer",
                borderLeft: `8px solid ${getStatusColor(group.status)}`,
                transition: "transform 0.08s ease, box-shadow 0.08s ease",
                position: "relative",
              }}
            >
              {/* 右上の操作ボタン */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 4,
                }}
              >
                <button
                  onClick={(e) => openEditModal(group, e)}
                  style={{
                    padding: "2px 6px",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "11px",
                    cursor: "pointer",
                    background: "#eeeeee",
                  }}
                >
                  編集
                </button>
                <button
                  onClick={(e) => deleteGroup(group.id, e)}
                  style={{
                    padding: "2px 6px",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "11px",
                    cursor: "pointer",
                    background: "#ffebee",
                    color: "#c62828",
                  }}
                >
                  削除
                </button>
              </div>

              <div style={{ fontWeight: 600, paddingRight: "70px" }}>
                {group.name}
              </div>
              <div style={{ fontSize: "13px", color: "#555" }}>
                人数: {group.count} 名
              </div>
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  color: getStatusColor(group.status),
                }}
              >
                状態: {getStatusLabel(group.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              width: "min(420px, 90vw)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
              {editingGroup ? "集団を編集" : "集団を登録"}
            </h2>
            <form
              onSubmit={handleAddOrUpdateGroup}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <label style={{ fontSize: "14px" }}>
                集団名
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  style={{
                    marginTop: "4px",
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              <label style={{ fontSize: "14px" }}>
                人数
                <input
                  type="number"
                  min="0"
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
                  style={{
                    marginTop: "4px",
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "13px",
                    cursor: "pointer",
                    background: "#eee",
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "13px",
                    cursor: "pointer",
                    background: "#1976d2",
                    color: "#fff",
                  }}
                >
                  {editingGroup ? "更新" : "登録"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
