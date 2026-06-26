import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import api from "../../Service/axios";
import { DashboardSkeleton } from "../Skeleton/Skeleton";

const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return "You are not logged in or your session expired.";
  if (err.response?.status === 403) return "This account is not allowed to view meetings.";
  if (err.code === "ERR_NETWORK") return "Cannot connect to the backend. Make sure the server is running on port 3000.";
  return "Something went wrong while loading your meetings.";
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No date set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateValue) => {
  if (!dateValue) return "No time set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid time";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyles = (status) => {
  if (status === "Completed") {
    return "bg-green-500/15 text-green-400";
  }

  if (status === "Cancelled") {
    return "bg-red-500/15 text-red-400";
  }

  return "bg-yellow-500/15 text-yellow-400";
};

const getStatusIcon = (status) => {
  if (status === "Completed") return <FiCheckCircle />;
  if (status === "Cancelled") return <FiXCircle />;
  return <FiClock />;
};

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/client/allMeetings")
      .then((res) => {
        if (cancelled) return;

        const data = res.data?.meetings;

        if (Array.isArray(data)) {
          setMeetings(data);
        } else {
          setMeetings([]);
          setPageError("Backend response did not include a meetings array.");
        }
      })
      .catch((err) => {
        if (cancelled) return;

        console.log(err);
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

  const meetingData = useMemo(() => {
    const scheduled = meetings.filter(
      (meeting) => meeting.status === "Scheduled"
    );

    const completed = meetings.filter(
      (meeting) => meeting.status === "Completed"
    );

    const cancelled = meetings.filter(
      (meeting) => meeting.status === "Cancelled"
    );

    const nextMeeting = scheduled
      .slice()
      .sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate))[0];

    const history = meetings
      .filter((meeting) => meeting.status !== "Scheduled")
      .slice()
      .sort((a, b) => new Date(b.meetingDate) - new Date(a.meetingDate));

    return {
      scheduled,
      completed,
      cancelled,
      nextMeeting,
      history,
    };
  }, [meetings]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-red-900/20 bg-black/40 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(220,38,38,.08)]">
        <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-red-700/10 blur-[100px]" />

        <div className="relative">
          <p className="text-red-400 text-xs uppercase tracking-[0.35em] mb-3">
            Meeting Schedule
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Meetings
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            View scheduled consultations, meeting details and past meeting history.
          </p>
        </div>
      </section>

      {pageError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5 flex gap-3 text-red-200">
          <FiAlertTriangle className="mt-1 shrink-0" />

          <div>
            <p className="font-medium">
              Could not load meetings
            </p>

            <p className="text-sm text-red-200/80 mt-1">
              {pageError}
            </p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Meetings"
          value={meetings.length}
          icon={<FiCalendar />}
        />

        <StatCard
          label="Scheduled"
          value={meetingData.scheduled.length}
          icon={<FiClock />}
        />

        <StatCard
          label="Completed"
          value={meetingData.completed.length}
          icon={<FiCheckCircle />}
        />

        <StatCard
          label="Cancelled"
          value={meetingData.cancelled.length}
          icon={<FiXCircle />}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Upcoming Meetings
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Scheduled meetings arranged by the admin team
              </p>
            </div>

            <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FiCalendar />
            </div>
          </div>

          <div className="space-y-4">
            {!pageError && meetingData.scheduled.length === 0 ? (
              <p className="text-gray-400">
                No upcoming meetings scheduled.
              </p>
            ) : (
              meetingData.scheduled.map((meeting) => (
                <MeetingCard key={meeting._id} meeting={meeting} />
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
                Closest scheduled session
              </p>
            </div>

            <FiClock className="text-red-400" />
          </div>

          {meetingData.nextMeeting ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 p-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-400 text-xs">
                <FiClock />
                Scheduled
              </span>

              <h3 className="text-white font-semibold mt-5">
                {meetingData.nextMeeting.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {meetingData.nextMeeting.description || "No description provided."}
              </p>

              <div className="space-y-3 mt-5">
                <DetailLine
                  icon={<FiCalendar />}
                  label="Date"
                  value={formatDate(meetingData.nextMeeting.meetingDate)}
                />

                <DetailLine
                  icon={<FiClock />}
                  label="Time"
                  value={formatTime(meetingData.nextMeeting.meetingDate)}
                />

                <DetailLine
                  icon={<FiMapPin />}
                  label="Venue"
                  value={meetingData.nextMeeting.venue || "No venue provided"}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              No next meeting available.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-red-900/20 bg-black/35 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(220,38,38,.06)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Meeting History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Completed and cancelled meetings
            </p>
          </div>

          <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <FiCheckCircle />
          </div>
        </div>

        <div className="space-y-4">
          {!pageError && meetingData.history.length === 0 ? (
            <p className="text-gray-400">
              No meeting history available yet.
            </p>
          ) : (
            meetingData.history.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const MeetingCard = ({ meeting }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] p-5 hover:bg-red-600/[0.06] hover:border-red-500/30 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <FiCalendar />
          </div>

          <div>
            <h3 className="text-white font-semibold">
              {meeting.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              {meeting.description || "No description provided."}
            </p>

            {meeting.createdBy && (
              <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                <FiUser className="text-red-400" />
                Created by {meeting.createdBy.name || meeting.createdBy.email}
              </p>
            )}
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getStatusStyles(meeting.status)}`}
        >
          {getStatusIcon(meeting.status)}
          {meeting.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <InfoBlock
          label="Date"
          value={formatDate(meeting.meetingDate)}
          icon={<FiCalendar />}
        />

        <InfoBlock
          label="Time"
          value={formatTime(meeting.meetingDate)}
          icon={<FiClock />}
        />

        <InfoBlock
          label="Venue"
          value={meeting.venue || "No venue provided"}
          icon={<FiMapPin />}
        />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-white/[0.04] backdrop-blur-xl p-5 hover:border-red-500/30 hover:bg-red-600/[0.06] transition-all">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
          {icon}
        </div>

        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Total
        </span>
      </div>

      <h2 className="text-3xl font-bold text-white mt-5">
        {value}
      </h2>

      <p className="text-gray-400 text-sm mt-1">
        {label}
      </p>
    </div>
  );
};

const InfoBlock = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-red-900/20 bg-black/25 p-4">
      <div className="flex items-center gap-2 text-red-400">
        {icon}

        <p className="text-xs uppercase tracking-widest text-gray-500">
          {label}
        </p>
      </div>

      <p className="text-white text-sm mt-3">
        {value}
      </p>
    </div>
  );
};

const DetailLine = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-red-400 mt-0.5">
        {icon}
      </span>

      <div>
        <p className="text-gray-500">
          {label}
        </p>

        <p className="text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Meetings;