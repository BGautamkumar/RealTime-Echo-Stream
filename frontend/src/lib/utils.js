export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatMessageDate(timestamp) {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Format time as HH:mm
  const timeLabel = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Check if message is from today
  if (messageDate.toDateString() === today.toDateString()) {
    return {
      showDateSeparator: false,
      timeLabel: timeLabel
    };
  }

  // Check if message is from yesterday
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return {
      showDateSeparator: true,
      dateLabel: "Yesterday",
      timeLabel: timeLabel
    };
  }

  // For other dates, format as "Apr 24, 2025"
  const dateLabel = messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: messageDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });

  return {
    showDateSeparator: true,
    dateLabel: dateLabel,
    timeLabel: timeLabel
  };
}

