export function getStatusText(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "blocked":
      return "Blocked";
    default:
      return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-yellow-500";
    case "blocked":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("en-US", options);
}

export function getDaysSince(date: string): number {
  return Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}
