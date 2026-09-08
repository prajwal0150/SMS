const PHOTO_FALLBACK_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-rose-500",
];

/** Deterministic color per name so siblings stay distinct. */
const colorFor = (name: string): string => {
  let hash = 0;

  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) % 997;
  }

  return PHOTO_FALLBACK_COLORS[hash % PHOTO_FALLBACK_COLORS.length];
};

interface ChildAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-2xl",
} as const;

/** Circular avatar with a colored initial fallback. */
const ChildAvatar = ({
  name,
  photoUrl,
  size = "md",
}: ChildAvatarProps) => {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`flex ${SIZES[size]} shrink-0 items-center justify-center rounded-full font-bold text-white ${colorFor(name)}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

export default ChildAvatar;