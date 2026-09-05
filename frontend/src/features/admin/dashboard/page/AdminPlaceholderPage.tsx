import { Link, useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

import { adminNavGroups } from "../../../../layouts/AdminLayout/navConfig";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";


const formatTitle = (value: string): string =>
  value
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");


const AdminPlaceholderPage = () => {
  const { pathname } = useLocation();

  const segment =
    pathname.split("/").filter(Boolean)[1] ?? "dashboard";

  const group = adminNavGroups.find(
    (item) => item.id === segment
  );

  const title =
    group?.label ?? formatTitle(segment);


  return (
    <>
      <PageHeader
        title={title}
        description="This module is under construction."
      />

      <Card className="flex flex-col items-center gap-4 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Construction size={26} />
        </div>

        <div>
          <p className="text-base font-semibold text-slate-900">
            {title} module coming soon
          </p>
          <p className="mt-1 text-sm text-slate-500">
            We are actively building this section. Please check
            back shortly.
          </p>
        </div>

                <Link
          to="/admin/dashboard"
          className="mt-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </Card>
    </>
  );
};

export default AdminPlaceholderPage;