import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    ok: "bg-emerald-500/20 text-emerald-200",
    warning: "bg-amber-500/20 text-amber-200",
    danger: "bg-red-500/20 text-red-200"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
