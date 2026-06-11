import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">

        <h1
          className="
            text-8xl md:text-9xl
            font-black
            bg-gradient-to-r
            from-purple-500
            to-violet-700
            bg-clip-text
            text-transparent
          "
        >
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        <p className="text-slate-400 mt-4">
          The page you're looking for doesn't exist,
          was moved, or the URL may be incorrect.
        </p>

        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-2
            mt-8
            px-6
            py-3
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-violet-700
            text-white
            font-medium
            hover:scale-105
            transition-all
            duration-300
          "
        >
          <FiArrowLeft />
          Back Home
        </Link>

      </div>
    </div>
  );
};

export default NotFound;



