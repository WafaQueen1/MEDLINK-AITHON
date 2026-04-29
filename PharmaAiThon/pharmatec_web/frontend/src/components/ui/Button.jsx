export const Button = ({ children, variant = 'primary', ...props }) => (
  <button className={`button ${variant}`} {...props}>
    {children}
  </button>
);
