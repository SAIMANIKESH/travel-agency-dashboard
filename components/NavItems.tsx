import React from "react";
import {
  Link,
  NavLink,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router";
import { TbLogout2, TbChevronLeftPipe } from "react-icons/tb";

import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";
import { logoutUser } from "~/appwrite/auth";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = useLoaderData();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <section className="nav-items">
      <div className="nav-header">
        <Link to="/" className="link-logo">
          <img src="/icons/logo.svg" alt="Logo" className="size-[30px]" />
          <h1 className="">Tourvista</h1>
        </Link>

        <button
          title="Close"
          className="cursor-pointer p-2 rounded-xl bg-gray-50 lg:hidden effects"
          onClick={handleClick}
        >
          <TbChevronLeftPipe className="size-6" />
        </button>
      </div>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, Icon, label }) => (
            <NavLink key={id} to={href}>
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-blue-500 !text-white hover:bg-blue-600": isActive,
                    effects: !isActive,
                  })}
                  onClick={handleClick}
                >
                  <Icon className="size-4 md:size-6" />
                  <span className="mt-0.5">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <div className="flex items-center gap-2">
            <img
              src={user?.imageUrl || "/images/david.webp"}
              alt={user?.name || "John Doe"}
              title={user?.name}
              className="rounded-full w-10 h-10"
              referrerPolicy="no-referrer"
            />
            <article>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </article>
          </div>

          <button
            className="cursor-pointer text-gray-100 hover:text-black"
            onClick={handleLogOut}
          >
            <TbLogout2 title="Log out" className="size-6 md:mt-1" />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
