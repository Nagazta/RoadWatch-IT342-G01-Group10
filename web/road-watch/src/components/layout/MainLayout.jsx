// MainLayout.jsx
import './MainLayout.css';

const MainLayout = ({ children, sidebar, header }) => {
  return (
    <div className="main-layout">
      {sidebar}
      <div className="main-content">
        {header}
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
