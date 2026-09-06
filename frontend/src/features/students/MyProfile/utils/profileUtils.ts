export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Dates arrive as "YYYY-MM-DD" (date columns) or ISO stamps;
 * render them like "15 Jun 2023" and fail soft to the raw value.
 */
export const formatDate = (value: string | null): string => {
  if (!value) {
    return "-";
  }

  const date = value.includes("T")
    ? new Date(value)
    : new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const composeFullName = (
  firstName: string,
  middleName: string | null,
  lastName: string
): string =>
  [firstName, middleName ?? "", lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
