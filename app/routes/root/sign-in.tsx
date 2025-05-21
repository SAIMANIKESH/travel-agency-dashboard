import React from "react";
import { Link, redirect } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import Dashboard from "./../admin/dashboard";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user.$id) return redirect("/");
  } catch (e) {
    console.log("Error fetching user data", e);
  }
}

const signIn = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img src="/icons/logo.svg" alt="Logo" className="size-[30px]" />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourvista</h1>
          </header>

          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Admin Dashboard Login
            </h2>
            <p className="p-16-regular text-gray-100 text-center !leading-7">
              Sign in with Google to explore the world with us and discover
              amazing travel experiences.
            </p>
          </article>

          <ButtonComponent
            type="button"
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            onClick={loginWithGoogle}
          >
            <img src="/icons/google.svg" alt="Google" className="size-5" />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};

export default signIn;
