const Meetings = () => {
  const pastMeetings = [
    {
      title: "Discovery Call",
      date: "10 Jun 2026",
    },
    {
      title: "Design Review",
      date: "17 Jun 2026",
    },
    {
      title: "Progress Review",
      date: "24 Jun 2026",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Meetings
        </h1>

        <p className="text-slate-400 mt-1">
          View upcoming consultations and meeting history.
        </p>
      </div>

      {/* Upcoming Meeting */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-emerald-500/20
          via-[#111827]
          to-[#0B1020]
          p-8
        "
      >

        <div
          className="
            absolute
            top-0
            right-0
            h-52
            w-52
            rounded-full
            bg-emerald-500/20
            blur-3xl
          "
        />

        <div className="relative z-10">

          <span
            className="
              px-3 py-1
              rounded-full
              bg-emerald-500/15
              text-emerald-400
              text-sm
            "
          >
            Upcoming Meeting
          </span>

          <h2 className="text-4xl font-bold text-white mt-5">
            Project Progress Consultation
          </h2>

          <p className="text-slate-400 mt-3">
            Discuss development progress, feedback,
            milestones and next actions.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <div>
              <p className="text-slate-500 text-xs uppercase">
                Date
              </p>

              <p className="text-white mt-1">
                28 Jun 2026
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-xs uppercase">
                Time
              </p>

              <p className="text-white mt-1">
                2:00 PM EAT
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-xs uppercase">
                Duration
              </p>

              <p className="text-white mt-1">
                60 Minutes
              </p>
            </div>

          </div>

          <button
            className="
              mt-8
              px-6 py-3
              rounded-xl
              bg-emerald-500
              hover:bg-emerald-400
              text-black
              font-semibold
              transition
              cursor-pointer
            "
          >
            Join Meeting
          </button>

        </div>

      </div>

      {/* Agenda */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >

        <h2 className="text-lg font-semibold text-white mb-5">
          Meeting Agenda
        </h2>

        <div className="space-y-4">

          {[
            "Review completed milestones",
            "Discuss client feedback",
            "Approve next development phase",
            "Set upcoming deadlines",
          ].map((item, index) => (
            <div
              key={index}
              className="
                flex items-center gap-3
                p-4
                rounded-xl
                bg-white/5
              "
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <p className="text-slate-300">
                {item}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* Past Meetings */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          p-6
        "
      >

        <h2 className="text-lg font-semibold text-white mb-6">
          Meeting History
        </h2>

        <div className="space-y-5">

          {pastMeetings.map((meeting, index) => (
            <div
              key={index}
              className="
                flex items-center justify-between
                p-4
                rounded-xl
                bg-white/5
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    h-10 w-10
                    rounded-full
                    bg-emerald-500/15
                    flex items-center justify-center
                    text-emerald-400
                  "
                >
                  ✓
                </div>

                <div>
                  <p className="text-white">
                    {meeting.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {meeting.date}
                  </p>
                </div>

              </div>

              <button
                className="
                  px-4 py-2
                  rounded-lg
                  bg-white/5
                  text-slate-300
                  hover:bg-white/10
                  transition
                "
              >
                View Notes
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Meetings;