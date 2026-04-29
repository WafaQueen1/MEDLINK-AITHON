import { NavLink } from 'react-router-dom';

export const Sidebar = ({ links, title, description, topContent, bottomContent }) => (
  <aside className="sidebar">
    <div>
      <p className="sidebar-eyebrow">Pharmatec</p>
      <h1>{title}</h1>
      <p className="sidebar-copy">
        {description || 'Medical operations, prescriptions, and pharmacy inventory in one secure workspace.'}
      </p>
      {topContent}
    </div>

    <div className="sidebar-bottom">
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      {bottomContent}
    </div>
  </aside>
);
