const cron = require("node-cron");
const Meeting = require('../Models/Meetings/Meeting.model');

const autoCompleteMeetings = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {

      const now = new Date();

      const result = await Meeting.updateMany(
        {
          meetingDate: { $lt: now },
          status: "Scheduled"
        },
        {
          $set: {
            status: "Completed"
          }
        }
      );

      console.log(
        `Auto-completed ${result.modifiedCount} meetings`
      );

    } catch (err) {
      console.error(
        "Meeting Cron Error:",
        err
      );
    }
  });
};

module.exports = autoCompleteMeetings;