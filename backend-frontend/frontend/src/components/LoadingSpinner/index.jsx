import React from "react"

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <h1 style={{ marginBottom: "20px", color: "#4b5563" }}>Loading...</h1> */}
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #e5e7eb",
          borderTop: "5px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
