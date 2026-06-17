import { meetings } from "./Data/Data";
const AdminMeetings = () => {


  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Meetings
      </h1>

      <div className="grid gap-4">

        {meetings.map((meeting, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-white/10 bg-white/5"
          >
            <h3 className="text-white font-medium">
              {meeting.client}
            </h3>

            <p className="text-slate-400 mt-2">
              {meeting.date}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminMeetings;