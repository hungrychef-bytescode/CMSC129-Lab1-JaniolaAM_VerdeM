export default function ConfirmModal({
  message,
  onConfirm,
  onClose,
}: {
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          width: 320,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 32, marginBottom: 10 }}>🗑️</div>

        <div
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: "#222",
            marginBottom: 8,
          }}
        >
          {message || "Delete?"}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#888",
            marginBottom: 20,
          }}
        >
          This action cannot be undone.
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "1.5px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: "#ff6b6b",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}