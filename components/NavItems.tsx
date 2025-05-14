import React, { useState } from 'react';
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router';
import { TbLogout2 } from "react-icons/tb";
import { ChevronLast, ChevronFirst } from "lucide-react";

import { sidebarItems } from '~/constants';
import { cn } from '~/lib/utils';

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = {
    name: 'John Doe',
    email: 'johndoe123@gmail.com',
    image: '/images/david.webp',
  }
  const [expanded, setExpand] = useState(true);

  return (
    <section className="nav-items">
      <div className="nav-header">
        <Link to="/" className="link-logo">
          <img src="/icons/logo.svg" alt="Logo" className="size-[30px]" />
          <h1 className="">Tourvista</h1>
        </Link>

        <button
          title="Hide"
          className="btn-toggle cursor-pointer p-2 rounded-xl bg-gray-50 hover:bg-blue-100 lg:hidden"
          onClick={handleClick}
        >
          {expanded ? (
            <ChevronFirst className="size-6" />
          ) : (
            <ChevronLast className="size-6" />
          )}
        </button>
      </div>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink key={id} to={href}>
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-sky-500 !text-white hover:bg-blue-500": isActive,
                    "hover:bg-sky-100 hover:!text-indigo-800 !text-gray-100":
                      !isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className="size-4 md:size-6 lol"
                  />
                  <span className="mt-0.5">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <div className="flex items-center gap-2">
            <img
              src={user?.image || "/images/david.webp"}
              alt={user?.name || "John Doe"}
              className="rounded-full w-10 h-10"
            />
            <article>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </article>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => {
              console.log("Logout");
            }}
          >
            <TbLogout2 title="Log out" className="size-7 md:mt-1" />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
