import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/brand";
import { SignInForm } from "@/components/forms";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <section className="bg-ink-50">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div className="hidden lg:block">
          <Mark className="size-14" />
          <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.025em] text-aubergine-800 text-balance">Welcome back to Serwaa</h1>
          <p className="mt-4 max-w-md leading-7 text-ink-600">
            Track applications, review matched opportunities and follow every repayment, all in one place.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200 sm:p-8">
          <h2 className="text-2xl font-bold text-aubergine-800 lg:sr-only">Sign in</h2>
          <div className="mt-6 lg:mt-0">
            <SignInForm />
          </div>
          <p className="mt-6 text-center text-sm text-ink-600">
            New to Serwaa?{" "}
            <Link href="/businesses" className="font-semibold text-aubergine-500 hover:underline">
              Register a business
            </Link>{" "}
            or{" "}
            <Link href="/investors" className="font-semibold text-aubergine-500 hover:underline">
              become an investor
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
