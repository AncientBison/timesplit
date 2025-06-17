export const TASK_COLORS = ["#FF6B6B", "#FF9F1C", "#FFD166", "#06D6A0", "#1B9AAA", "#118AB2", "#073B4C", "#EF476F", "#8338EC", "#3A86FF",
"#FFBE0B", "#FB5607", "#FF006E", "#3A0CA3", "#4361EE", "#4CC9F0", "#06AED5", "#6A4C93", "#9D4EDD", "#F15BB5",
"#00BBF9", "#00F5D4", "#9B5DE5", "#FEE440", "#F95738", "#43AA8B", "#90BE6D", "#F3722C", "#277DA1", "#A1C181",
"#2EC4B6", "#E71D36", "#FFB5A7", "#B5E48C", "#48CAE4", "#52796F", "#8D99AE", "#BFC0C0", "#6C757D", "#343A40"] as const;

export type Color = typeof TASK_COLORS[number];