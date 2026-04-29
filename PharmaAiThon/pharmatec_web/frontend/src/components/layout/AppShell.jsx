import { Sidebar } from './Sidebar';

export const AppShell = ({ title, links, actions, children, sidebarDescription, sidebarTopContent, sidebarBottomContent }) => (
  <div className="app-shell">
    <Sidebar
      title={title}
      links={links}
      description={sidebarDescription}
      topContent={sidebarTopContent}
      bottomContent={sidebarBottomContent}
    />
    <main className="app-content">
      <header className="page-header">
        <div>
          <p className="section-label">Dashboard</p>
          <h2>{title}</h2>
        </div>
        <div className="header-actions">{actions}</div>
      </header>
      {children}
    </main>
  </div>
);
