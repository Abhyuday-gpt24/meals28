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
      className="flex w-full justify-center rounded-md bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {pending ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
    </button>
  );
}

type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export default function CustomerAuthPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
        <div className="text-center">
          <img
            src="https://meals28.com/wp-content/uploads/2025/11/meals28-logo1.png"
            alt="Meals28"
            className="mx-auto h-10 object-contain"
          />
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "Welcome back! Please sign in."
              : "Create your account."}
          </p>
        </div>

        <form action={clientAction} className="mt-8 space-y-6">
          <input type="hidden" name="role" value="CUSTOMER" />

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-900"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                    />
                    {fieldError("firstName") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("firstName")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                    />
                    {fieldError("lastName") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("lastName")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Phone{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                  {fieldError("phone") && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldError("phone")}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              {fieldError("email") && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldError("email")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
              {fieldError("password") && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldError("password")}
                </p>
              )}
            </div>
          </div>

          {result?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{result.error}</p>
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
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
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
