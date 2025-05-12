import React from 'react';
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router';
import { sidebarItems } from '~/constants';
import { cn } from '~/lib/utils';

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = {
    name: 'John Doe',
    email: 'johndoe1234@gmail.com',
    image: '/images/david.webp',
  }

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/icons/logo.svg" alt="Logo" className="size-[30px]" />
        <h1 className="">Tourvista</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink
              key={id}
              to={href}
              // className={({ isActive }) =>
              //   `flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`
              // }
            >
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-10 size-0 group-hover:invert 
                      ${isActive ? "brightness-0 invert" : "text-dark-200"}`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <img
            src={user?.image || "/images/david.webp"}
            alt={user?.name || "John Doe"}
            className="rounded-full w-10 h-10"
          />
          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>

          <button
            className="cursor-pointer"
            onClick={() => {
              console.log("Logout");
            }}
          >
            <img src="/icons/logout.svg" alt="Logout" className="size-6" />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
