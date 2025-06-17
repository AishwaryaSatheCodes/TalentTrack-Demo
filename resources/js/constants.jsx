export const PROJECT_STATUS_CLASS_MAP = {
  pending: "bg-fuchsia-500", // Fuchsia for pending (urgent or waiting)
  in_progress: "bg-fuchsia-400", // fuchsia for in-progress (active, ongoing)
  completed: "bg-fuchsia-300", // Indigo for completed (finished, stable)
};

export const PROJECT_STATUS_TEXT_MAP = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export const TASK_STATUS_CLASS_MAP = {
  pending: "bg-purple-600", // Fuchsia for pending (needs attention)
  in_progress: "bg-purple-500", // purple for in-progress (active, ongoing)
  send_for_approval: "bg-purple-400", // Violet for send_for_approval (awaiting review)
  completed: "bg-purple-300", // Indigo for completed (finalized)
};

export const TASK_STATUS_TEXT_MAP = {
  pending: "Pending",
  in_progress: "In Progress",
  send_for_approval: "Sent for Approval",
  completed: "Completed",
};

export const TASK_PRIORITY_CLASS_MAP = {
  low: "bg-fuchsia-300", // Indigo for low priority
  medium: "bg-fuchsia-400", // Violet for medium priority
  high: "bg-fuchsia-500", // Dark fuchsia for high priority (urgent)
};

export const TASK_PRIORITY_TEXT_MAP = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
