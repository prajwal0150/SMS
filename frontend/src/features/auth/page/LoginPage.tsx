import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { loginThunk } from "../redux/authThunk";
import { isAdminEmail } from "../services/authService";


const getPostLoginPath = (
  email?: string | null
): string =>
  isAdminEmail(email)
    ? "/admin/dashboard"
    : "/dashboard";


const LoginPage = () => {

  const navigate = useNavigate();

  const {
    user,
    login,
    loading,
    error,
    isAuthenticated,
    clearError,
  } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);


  useEffect(() => {

    if (isAuthenticated) {
      navigate(getPostLoginPath(user?.email));
    }

  }, [isAuthenticated, user?.email, navigate]);


  useEffect(() => {

    if (error) {
      toast.error(error);
      clearError();
    }

  }, [error, clearError]);


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    const result = await login({
      email: email.trim(),
      password,
      rememberMe,
    });


    if (loginThunk.fulfilled.match(result)) {

      toast.success("Welcome back!");

      navigate(
        getPostLoginPath(
          result.payload?.user?.email
        )
      );

    }

  };


  return (
    <main className="min-h-screen bg-[#F7F8FC]">

      {/* Background decoration */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      </div>


      {/* Header */}

      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">

            <GraduationCap size={22} />

          </div>

          <div>

            <p className="font-bold tracking-tight text-slate-950">
              EduManage
            </p>

            <p className="text-[11px] text-slate-400">
              School Management
            </p>

          </div>

        </Link>


        <Link
          to="/"
          className="hidden text-sm font-medium text-slate-500 hover:text-slate-900 sm:block"
        >
          Back to website
        </Link>

      </header>


      {/* Content */}

      <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 pb-10">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-[1fr_0.9fr]">


          {/* FORM */}

          <div className="px-6 py-10 sm:px-10 lg:px-14 lg:py-14">

            <div className="mx-auto max-w-md">

              <div className="mb-8">

                <p className="mb-3 text-sm font-semibold text-indigo-600">
                  WELCOME BACK
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Sign in to your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Manage your school activities from one
                  simple and secure platform.
                </p>

              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="group relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

                  </div>

                </div>


                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </Link>

                  </div>


                  <div className="group relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>


                {/* Remember me */}

                <label
                  htmlFor="rememberMe"
                  className="flex cursor-pointer select-none items-center gap-2.5"
                >

                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
                  />

                  <span className="text-sm font-medium text-slate-600">
                    Remember me
                  </span>

                </label>


                {/* Login */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* Demo admin credentials */}
              <div className="mt-6 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Demo admin login
                </p>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Username:{" "}
                  <span className="font-semibold text-slate-800">
                    schoolAdmin@gmail.com
                  </span>
                  <br />
                  Password:{" "}
                  <span className="font-semibold text-slate-800">
                    admin123@
                  </span>
                </p>
              </div>


              <p className="mt-8 text-center text-sm text-slate-500">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Create account
                </Link>

              </p>

            </div>

          </div>


          {/* BRAND */}

          <div className="relative hidden overflow-hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-2xl" />

            <div className="relative z-10">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-300 ring-1 ring-white/10">

                <GraduationCap size={25} />

              </div>


              <p className="mb-4 mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                One platform
              </p>


              <h2 className="max-w-sm text-4xl font-bold leading-tight text-white">

                Everything your school needs,

                <span className="text-indigo-300">
                  {" "}in one place.
                </span>

              </h2>


              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">

                Manage students, teachers, attendance,
                academics and school operations from
                one beautiful platform.

              </p>

            </div>


            <div className="relative z-10 space-y-4">

              {[
                "Manage students and teachers",
                "Track attendance and academics",
                "Keep your school organized",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2
                    size={18}
                    className="text-indigo-300"
                  />

                  <span className="text-sm text-slate-300">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};


export default LoginPage;