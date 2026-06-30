import { FiCheckCircle, FiX } from "react-icons/fi";

const AuthPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed right-5 top-5 z-[9999] w-[calc(100%-40px)] max-w-sm">
      <div className="rounded-2xl border border-green-500/20 bg-[#07110b] p-4 text-green-100 shadow-[0_0_45px_rgba(34,197,94,.16)]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-400">
            <FiCheckCircle />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">
              Success
            </p>

            <p className="mt-1 text-sm text-green-100/80">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-green-100/70 hover:bg-white/10 hover:text-white"
          >
            <FiX />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;