import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-cyan-300 neon-text">404</h1>
        <p className="text-lg text-cyan-500/80 mb-4">Route not found</p>
        <a href="/" className="text-cyan-300 underline hover:text-cyan-200">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
