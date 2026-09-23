import React from 'react';

import {
  Link,
  Outlet,
  useLocation,
} from 'react-router-dom';

import {
  LayoutDashboard,
  BookOpen,
  Database,
  FileText,
  Megaphone,
  BookMarked,
  Building2,
  LogOut,
  Home,
  PhoneCall,
  Info,
  Images,
} from 'lucide-react';

import { useLibrary } from '../../context/LibraryContext';

export default function AdminLayout() {
  const { user, logout } = useLibrary();

  const location = useLocation();

  const links = [
    [
      '/admin',
      'Dashboard',
      LayoutDashboard,
    ],

    [
      '/admin/homepage',
      'Homepage',
      Home,
    ],

    [
      '/admin/about',
      'About Page',
      Info,
    ],

    [
      '/admin/books',
      'Catalogue',
      BookOpen,
    ],

    [
      '/admin/resources',
      'E-Resources',
      Database,
    ],

    [
      '/admin/papers',
      'Question Papers',
      FileText,
    ],

    [
      '/admin/publications',
      'Publications',
      BookMarked,
    ],

    [
      '/admin/announcements',
      "What's New",
      Megaphone,
    ],

    [
      '/admin/departments',
      'Departments',
      Building2,
    ],

    [
      '/admin/contacts',
      'Contacts',
      PhoneCall,
    ],

    [
      '/admin/facilities',
      'Facilities',
      Images,
    ],
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="portal">

      <aside className="portal-side">

        <Link
          to="/"
          className="portal-brand"
        >
          <span className="portal-brand-title">
            Shri Guru Gobind Singhji
          </span>

          <span>
            Institute of Engineering &amp;
            Technology
            <br />
            Central Library · Nanded
          </span>
        </Link>

        <div className="portal-user">
          <div className="avatar">
            A
          </div>

          <div>
            <b>
              {user?.name ||
                'Library Admin'}
            </b>

            <span>
              Content administrator
            </span>
          </div>
        </div>

        <nav>
          {links.map(
            ([to, label, Icon]) => (
              <Link
                key={to}
                to={to}
                className={
                  location.pathname === to
                    ? 'active'
                    : ''
                }
              >
                <Icon size={18} />

                {label}
              </Link>
            )
          )}
        </nav>

        <button
          className="logout-link"
          onClick={handleLogout}
        >
          <LogOut size={18} />

          Sign out
        </button>

      </aside>

      <section className="portal-main">

        <div className="portal-top">
          <span>
            Secure library content management
          </span>

          <Link to="/">
            View public website ↗
          </Link>
        </div>

        <Outlet />

      </section>

    </div>
  );
}