export function formatChatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 60) {
        return `${diffMinutes} min ago`;
    }

    if (diffHours < 24) {
        return `${diffHours} h ago`;
    }


    if (diffDays <= 2) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    if (diffDays <= 7) {
        return date.toLocaleString("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }

    if (diffWeeks <= 3) {
        return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    }

    if (diffMonths < 12) {
        return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    }

    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}