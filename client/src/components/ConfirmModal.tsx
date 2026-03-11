export default function ConfirmModal({
  message,
  confirmLabel = "Confirm",
  confirmColor = "#ff6b6b",
  onConfirm,
  onClose,
}: {
  message?: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          background: "#161b22",
          border: "1px solid #2a3441",
          borderRadius: 16,
          padding: 28,
          width: 320,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "#7d8fa0",
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>

        <div
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: "#e6edf3",
            marginBottom: 18,
          }}
        >
          {message || "Are you sure?"}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "1.5px solid #2a3441",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              color: "#7d8fa0",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "8px 22px",
              borderRadius: 10,
              border: "none",
              background: confirmColor,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}