import { projects } from "./Data/Data";

const AdminProjects = () => {

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Projects
      </h1>

      <div className="grid gap-4">

        {projects.map((project, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex justify-between mb-4">

              <h3 className="text-white font-medium">
                {project.name}
              </h3>

              <span className="text-cyan-400">
                {project.progress}
              </span>

            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: project.progress }}
              />
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminProjects;