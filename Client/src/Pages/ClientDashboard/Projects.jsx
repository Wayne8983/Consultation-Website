const Projects = () => {
  const milestones = [
    {
      title: "Discovery & Planning",
      status: "completed",
    },
    {
      title: "UI/UX Design",
      status: "completed",
    },
    {
      title: "Frontend Development",
      status: "active",
    },
    {
      title: "Testing",
      status: "pending",
    },
    {
      title: "Deployment",
      status: "pending",
    },
  ];

  const deliverables = [
    {
      title: "Project Requirements",
      done: true,
    },
    {
      title: "Wireframes",
      done: true,
    },
    {
      title: "UI Design System",
      done: true,
    },
    {
      title: "Frontend Build",
      done: false,
    },
    {
      title: "Production Deployment",
      done: false,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Hero Card */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-purple-600/20
          via-[#111827]
          to-[#0B1020]
          p-8
        "
      >

        <div
          className="
            absolute
            right-0
            top-0
            h-52
            w-52
            rounded-full
            bg-purple-500/20
            blur-3xl
          "
        />

        <div className="relative z-10">

          <div className="flex flex-wrap items-center gap-3">

            <span
              className="
                px-3 py-1
                rounded-full
                bg-green-500/15
                text-green-400
                text-sm
              "
            >
              In Progress
            </span>

            <span
              className="
                px-3 py-1
                rounded-full
                bg-purple-500/15
                text-purple-300
                text-sm
              "
            >
              Client Portal
            </span>

          </div>

          <h1
            className="
              text-4xl
              font-bold
              text-white
              mt-4
            "
          >
            Consultancy Management Platform
          </h1>

          <p
            className="
              text-slate-400
              max-w-2xl
              mt-3
            "
          >
            Building a modern client-facing platform
            with project tracking, payments,
            documents and consultation management.
          </p>

        </div>

      </div>

      {/* Stats */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        {[
          {
            title: "Progress",
            value: "65%",
          },
          {
            title: "Deadline",
            value: "28 Jun",
          },
          {
            title: "Milestones",
            value: "3 / 5",
          },
          {
            title: "Deliverables",
            value: "3 / 5",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-5
              hover:border-purple-500/30
              transition
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-widest
                text-slate-500
              "
            >
              {card.title}
            </p>

            <h2
              className="
                text-3xl
                font-bold
                text-white
                mt-3
              "
            >
              {card.value}
            </h2>
          </div>
        ))}

      </div>

      {/* Progress */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >

        <div className="flex justify-between mb-4">

          <h2
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            Overall Progress
          </h2>

          <span className="text-purple-400">
            65%
          </span>

        </div>

        <div
          className="
            h-4
            rounded-full
            bg-white/5
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              w-[65%]
              rounded-full
              bg-gradient-to-r
              from-purple-500
              via-violet-500
              to-fuchsia-500
            "
          />

        </div>

      </div>

      {/* Bottom Grid */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* Milestones */}
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            p-6
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              text-white
              mb-6
            "
          >
            Project Milestones
          </h2>

          <div className="space-y-5">

            {milestones.map((item, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      h-3
                      w-3
                      rounded-full
                      ${
                        item.status === "completed"
                          ? "bg-green-400"
                          : item.status === "active"
                          ? "bg-purple-500"
                          : "bg-slate-600"
                      }
                    `}
                  />

                  <span className="text-slate-300">
                    {item.title}
                  </span>

                </div>

                <span
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  {item.status}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Deliverables */}
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            p-6
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              text-white
              mb-6
            "
          >
            Deliverables
          </h2>

          <div className="space-y-4">

            {deliverables.map((item, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-xl
                  bg-white/5
                "
              >

                <span className="text-slate-300">
                  {item.title}
                </span>

                <span
                  className={
                    item.done
                      ? "text-green-400"
                      : "text-slate-500"
                  }
                >
                  {item.done ? "✓" : "○"}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Projects;