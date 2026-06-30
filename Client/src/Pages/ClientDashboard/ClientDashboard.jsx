import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view this dashboard.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  return "Something went wrong while loading your dashboard.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No date set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatActivityDate = (dateValue) => {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
};

const ClientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.get("/client/profile"),
      api.get("/client/getClientProjects"),
      api.get("/client/allMeetings"),
    ])
      .then(([profileRes, projectsRes, meetingsRes]) => {
        if (cancelled) return;

        setProfile(profileRes.data?.user || null);
        setProjects(projectsRes.data?.clientProjects || []);
        setMeetings(meetingsRes.data?.meetings || []);
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
        setProfile(null);
        setProjects([]);
        setMeetings([]);
        setPageError(getErrorMessage(err));
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const dashboard = useMemo(() => {
    const activeProjects = projects.filter(
      (project) => project.status === "Active"
    );

    const completedProjects = projects.filter(
      (project) => project.status === "Completed"
    );

    const scheduledMeetings = meetings.filter(
      (meeting) => meeting.status === "Scheduled"
    );

    const nextMeeting = scheduledMeetings
      .slice()
      .sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate))[0];

    const averageProgress =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce(
              (total, project) => total + (project.progress || 0),
              0
            ) / projects.length
          );

    return {
      activeProjects,
      completedProjects,
      scheduledMeetings,
      nextMeeting,
      averageProgress,
    };
  }, [projects, meetings]);

  const recentActivities = useMemo(() => {
    return [
      ...projects.map((project) => ({
        id: `project-${project._id}`,
        title: project.title,
        detail: `Project is ${project.status || "Active"} at ${project.progress || 0}% progress.`,
        date: project.updatedAt || project.createdAt,
        icon: <FiFolder />,
      })),

      ...meetings.map((meeting) => ({
        id: `meeting-${meeting._id}`,
        title: meeting.title,
        detail: `${meeting.status} meeting on ${formatDate(meeting.meetingDate)}.`,
        date: meeting.updatedAt || meeting.createdAt,
        icon: <FiCalendar />,
      })),
    ]
      .filter((activity) => activity.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [projects, meetings]);

  if (loading) return <DashboardSkeleton />;

  const stats = [
    {
      title: "Projects",
      value: projects.length,
      detail: `${dashboard.activeProjects.length} active`,
      icon: <FiFolder />,
    },
    {
      title: "Progress",
      value: `${dashboard.averageProgress}%`,
      detail: "Average completion",
      icon: <FiTrendingUp />,
    },
    {
      title: "Meetings",
      value: meetings.length,
      detail: `${dashboard.scheduledMeetings.length} scheduled`,
      icon: <FiCalendar />,
    },
    {
      title: "Completed",
      value: dashboard.completedProjects.length,
      detail: "Finished projects",
      icon: <FiCheckCircle />,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
              Client Overview
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
              Welcome Back, {profile?.name || "Client"}
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Track your projects, upcoming meetings and account activity from one place.
            </p>
          </div>

          <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <FiUser />
              </div>

              <div>
                <p className="text-white font-medium">
                  {profile?.company || "Client Account"}
                </p>

                <p className="text-gray-500 text-sm">
                  {profile?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">
              Could not load dashboard
            </p>

            <p className="text-sm text-red-200/80 mt-1">
              {pageError}
            </p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-red-900/20 bg-white/[0.04] backdrop-blur-xl p-5 hover:border-red-500/30 hover:bg-red-600/[0.06] transition-all shadow-[0_0_25px_rgba(220,38,38,.04)]"
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                {item.icon}
              </div>

              <span className="text-xs text-gray-500 uppercase tracking-widest">
                Total
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white mt-5">
              {item.value}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {item.title}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              {item.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Project Progress
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current project status and completion
              </p>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiTrendingUp />
            </div>
          </div>

          <div className="space-y-5">
            {projects.length === 0 ? (
              <p className="text-gray-400">
                No projects have been assigned yet.
              </p>
            ) : (
              projects.map((project) => (
                <div key={project._id}>
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <div>
                      <p className="text-gray-200 text-sm">
                        {project.title}
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        Deadline: {formatDate(project.deadline)}
                      </p>
                    </div>

                    <span className="text-red-400 font-semibold">
                      {project.progress || 0}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Next Meeting
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Upcoming schedule
              </p>
            </div>

            <FiClock className="text-red-400" />
          </div>

          {dashboard.nextMeeting ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
              <p className="text-white font-semibold">
                {dashboard.nextMeeting.title}
              </p>

              <p className="text-gray-400 text-sm mt-2">
                {dashboard.nextMeeting.description || "No description provided."}
              </p>

              <p className="text-red-300 text-sm mt-4">
                {formatDate(dashboard.nextMeeting.meetingDate)}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {dashboard.nextMeeting.venue || "No venue provided"}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">
              No upcoming meetings scheduled.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Recent Activity
        </h2>

        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-gray-400">
              No recent activity available yet.
            </p>
          ) : (
            recentActivities.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-2xl bg-white/[0.04] border border-red-900/20 p-4"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  {item.icon}
                </div>

                <div>
                  <p className="text-white text-sm">
                    {item.title}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {item.detail}
                  </p>

                  <p className="text-red-300 text-xs mt-2">
                    {formatActivityDate(item.date)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;