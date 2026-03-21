"use client";

import { useState } from "react";
import { login, signup } from "@/app/actions/auth";
import { useFormStatus } from "react-dom";

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-slate-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {pending ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
    </button>
  );
}

type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export default function AdminAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [result, setResult] = useState<ActionResult>(null);

  async function clientAction(formData: FormData) {
    setResult(null);
    const action = isLogin ? login : signup;
    const res = await action(formData);
    if (res) setResult(res);
  }

  function fieldError(field: string) {
    return result?.fieldErrors?.[field]?.[0];
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800 p-8 shadow-xl ring-1 ring-slate-700">
        <div className="text-center">
          <img
            src="https://meals28.com/wp-content/uploads/2025/11/meals28-logo1.png"
            alt="Meals28"
            className="mx-auto h-10 object-contain brightness-0 invert"
          />
          <p className="mt-2 text-sm text-slate-400">
            {isLogin
              ? "Admin Portal — Sign in to continue"
              : "Admin Portal — Create your account"}
          </p>
        </div>

        <form action={clientAction} className="mt-8 space-y-6">
          <input type="hidden" name="role" value="ADMIN" />

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-slate-300"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="mt-2 block w-full rounded-md border-0 bg-slate-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6 px-3"
                    />
                    {fieldError("firstName") && (
                      <p className="mt-1 text-xs text-red-400">
                        {fieldError("firstName")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="mt-2 block w-full rounded-md border-0 bg-slate-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6 px-3"
                    />
                    {fieldError("lastName") && (
                      <p className="mt-1 text-xs text-red-400">
                        {fieldError("lastName")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Phone{" "}
                    <span className="text-slate-500 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-2 block w-full rounded-md border-0 bg-slate-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6 px-3"
                  />
                  {fieldError("phone") && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldError("phone")}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 block w-full rounded-md border-0 bg-slate-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6 px-3"
              />
              {fieldError("email") && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldError("email")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="mt-2 block w-full rounded-md border-0 bg-slate-700 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-400 sm:text-sm sm:leading-6 px-3"
              />
              {fieldError("password") && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldError("password")}
                </p>
              )}
            </div>
          </div>

          {result?.error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <p className="text-sm text-red-300">{result.error}</p>
            </div>
          )}

          <SubmitButton isLogin={isLogin} />
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setResult(null);
            }}
            className="text-sm font-semibold text-slate-400 hover:text-slate-300 transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
