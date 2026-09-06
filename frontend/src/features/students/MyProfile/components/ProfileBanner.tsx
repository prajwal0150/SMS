/** Graduation cap resting on a stack of books. */
const GradIllustration = () => (
  <svg
    viewBox="0 0 96 84"
    className="h-20 w-auto"
    aria-hidden="true"
  >
    {/* Books */}
    <rect x="12" y="62" width="72" height="12" rx="4" fill="#fb923c" />
    <rect x="18" y="50" width="62" height="12" rx="4" fill="#0ea5e9" />
    <rect x="15" y="38" width="66" height="12" rx="4" fill="#10b981" />
    <line x1="20" y1="68" x2="76" y2="68" stroke="#ffffff" strokeWidth="1.4" opacity="0.55" />
    <line x1="26" y1="56" x2="72" y2="56" stroke="#ffffff" strokeWidth="1.4" opacity="0.55" />
    <line x1="23" y1="44" x2="73" y2="44" stroke="#ffffff" strokeWidth="1.4" opacity="0.55" />

    {/* Mortarboard */}
    <polygon points="48,6 86,22 48,38 10,22" fill="#312e81" />
    <path
      d="M32 27 v12 c0 5 7 9 16 9 s16 -4 16 -9 V27 l-16 7 Z"
      fill="#4338ca"
    />
    <line
      x1="84"
      y1="23"
      x2="84"
      y2="40"
      stroke="#312e81"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <circle cx="84" cy="43" r="3.2" fill="#f59e0b" />
  </svg>
);

/**
 * Light-blue page banner with the page title and a
 * graduation illustration on the right.
 */
const ProfileBanner = () => (
  <section className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-white px-6 py-6 sm:px-8 sm:py-7">
    <div className="relative z-10 max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Student Profile
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        View and manage your personal information
      </p>
    </div>

    <div
      className="pointer-events-none absolute inset-y-0 right-8 hidden items-center sm:flex"
      aria-hidden="true"
    >
      <GradIllustration />
    </div>
  </section>
);

export default ProfileBanner;
