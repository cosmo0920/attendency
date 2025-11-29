import React, { useState } from "react";

function App() {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberCount, setMemberCount] = useState("");

  const openModal = () => {
    setGroupName("");
    setMemberCount("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim() || memberCount === "") return;

    const newGroup = {
      id: Date.now(),
      name: groupName.trim(),
      count: Number(memberCount),
      status: Number(memberCount) === 0 ? "unknown" : "pending",
    };

    setGroups((prev) => [...prev, newGroup]);
    closeModal();
  };

  const toggleStatus = (id) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "pending" ? "ok" : "pending" }
          : g
      )
    );
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "#ff9800"; // 橙
    if (status === "ok") return "#4caf50";      // 緑
    if (status === "unknown") return "#9c27b0"; // 紫（参加不明）
    return "#ccc";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "system-ui, sans-serif",
        padding: "16px 4vw",
        boxSizing: "border-box",
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

          <button
            onClick={openModal}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              background: "#ffffff",
            }}
          >
            ＋ 集団を追加
          </button>
        </div>

        {/* カードグリッド */}
        <div
          style={{
            marginTop: "8px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
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
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                cursor: "pointer",
                borderLeft: `8px solid ${getStatusColor(group.status)}`,
                transition: "transform 0.08s ease, box-shadow 0.08s ease",
              }}
            >
              <div style={{ fontWeight: 600 }}>{group.name}</div>
              <div style={{ fontSize: "13px", color: "#555" }}>
                人数: {group.count} 名
              </div>
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                        color:
                          group.status === "pending"
                            ? "#ff9800"
                            : group.status === "ok"
                            ? "#4caf50"
                            : "#9c27b0",
                  }}
              >
                状態:{" "}
                  {
                      group.status === "pending"
                          ? "未確定（タップで出席）"
                          : group.status === "ok"
                          ? "出席"
                          : "参加不明"
                  }
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
              width: "min(420px, 90vw)", // 画面幅に応じて縮む
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
              集団を登録
            </h2>
            <form
              onSubmit={handleAddGroup}
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
                  登録
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
