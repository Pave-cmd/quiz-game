import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BackToMenu = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/")}
      className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur-md hover:bg-white/20"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Menu
    </motion.button>
  );
};

export default BackToMenu;