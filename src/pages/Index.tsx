import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          {/* Theme toggle button */}
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>

          {/* TODO: replace everything here with the actual app! */}
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-slate-400 dark:text-slate-500"
              viewBox="0 0 50 50"
            >
              <circle
                className="opacity-30"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
              />
              <circle
                className="text-slate-600 dark:text-slate-400"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset="75"
              />
            </svg>
            Generating your app...
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-md">
            Watch the chat on the left for updates that might need your
            attention to finish generating
          </p>
        </div>
      </div>
      <div
        className="flex flex-col relative mt-5 min-h-[100px] p-5"
        style={{ maxWidth: 1200 }}
      >
        <section className="flex flex-col relative mt-5 min-h-[100px] p-5 w-full self-stretch flex-grow max-w-[1200px] mx-auto" />
      </div>
    </>
  );
};

export default Index;
