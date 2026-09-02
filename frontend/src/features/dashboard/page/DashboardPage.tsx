import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { logoutThunk } from "../../auth/redux/authThunk";
import { selectIsAuthenticated, selectUser } from "../../auth/redux/authSelector";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const user = useSelector((state: RootState) => selectUser(state));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold text-indigo-600">DASHBOARD</p>
        <h1 className="mt-2 text-3xl font-bold">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}</h1>
        <p className="mt-3 text-slate-600">You are signed in successfully.</p>
        <button
          type="button"
          onClick={() => dispatch(logoutThunk())}
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          Sign out
        </button>
      </section>
    </main>
  );
};

export default DashboardPage;
