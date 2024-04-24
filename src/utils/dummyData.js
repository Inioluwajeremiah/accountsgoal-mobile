import isEmpty from "lodash/isEmpty";
export const toggleData = [
  {
    title: "Pending",
  },
  {
    title: "Completed",
  },
];

export const priorityData = [
  {
    title: "None",
    value: "",
  },
  {
    title: "High priority",
    value: "High priority",
  },
  {
    title: "Medium priority",
    value: "Medium priority",
  },
  {
    title: "Low priority",
    value: "Low priority",
  },
];

export const companyTypeData = [
  "Technology",
  "Marketing Agency",
  "Event Management",
  "Educational",
  "Healthcare",
  "Consulting Firm",
  "Financial Services",
  "Nonprofit Organization",
  "Retail Business",
  "Hospitality Industry",
  "Real Estate Agency",
];

export const companySizeData = [
  "1 - 20",
  "20 - 50",
  "50 - 100",
  "100 -  above",
];

export const supportData = [
  {
    id: 1,
    title: "How do I import data from Excel into the app?",
    value: ["Instruction 1", "Instruction 2", "Instruction 3", "Instruction 4"],
  },
  {
    id: 2,
    title: "Can I sync my existing calendar with the app's calendar?",
    value: [
      "Calendar Instruction 1",
      "Calendar Instruction 2",
      "Calendar Instruction 3",
      "Calendar Instruction 4",
    ],
  },
  {
    id: 3,
    title:
      "What are the limitations of the free version compared to the premium version?",
    value: ["Limitations 1", "Limitations 2", "Limitations 3", "Limitations 4"],
  },
  {
    id: 4,
    title: "How do i Sign up on the app?",
    value: [
      "",
      // "Sign up Instruction 1",
      // "Sign up Instruction 2",
      // "Sign up Instruction 3",
      // "Sign up Instruction 4",
    ],
  },

  {
    id: 5,
    title: " Are there any tutorials or guides for new users?",
    value: ["Tutorials 1", "Tutorials 2", "Tutorials 3", "Tutorials 4"],
  },
];

export const chatData = [
  {
    user: "admin",
    message:
      "Hi Kitsbase, Let me know you need help and you can ask us any questions.",
    time: "08:20 AM",
  },
  {
    user: "user",
    message: "How to create an account goal account?",
    time: "08:21 AM",
  },
  {
    user: "admin",
    message: "Open the account goal app to get started and follow the steps.",
    time: "08:22 AM",
  },
];

// JavaScript version of getting today's date
const today = new Date().toISOString().split("T")[0];

// JavaScript version of the getPastDate function
function getPastDate(numberOfDays) {
  return new Date(Date.now() - 864e5 * numberOfDays)
    .toISOString()
    .split("T")[0];
}

// JavaScript version of the getFutureDates function
function getFutureDates(numberOfDays) {
  const array = [];
  for (let index = 1; index <= numberOfDays; index++) {
    let d = Date.now();
    if (index > 8) {
      // set dates on the next month
      const newMonth = new Date(d).getMonth() + 1;
      d = new Date(d).setMonth(newMonth);
    }
    const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
    const dateString = date.toISOString().split("T")[0];
    array.push(dateString);
  }
  return array;
}

// JavaScript version of getting future dates
const fastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [fastDate, today].concat(futureDates);

export const agendaItems = [
  {
    title: dates[0],
    data: [
      {
        id: 1,
        hour: "12am",
        duration: "1h",
        title: "First Yoga",
        mode: "manual",
      },
    ],
  },
  {
    title: dates[1],
    data: [
      {
        id: 2,
        hour: "4pm",
        duration: "1h",
        title: "Pilates ABC",
        mode: "manual",
      },
      {
        id: 3,
        hour: "5pm",
        duration: "1h",
        title: "Vinyasa Yoga",
        mode: "manual",
      },
    ],
  },
  {
    title: dates[2],
    data: [
      {
        id: 4,
        hour: "1pm",
        duration: "1h",
        title: "Ashtanga Yoga",
        mode: "ai",
      },
      {
        id: 5,
        hour: "2pm",
        duration: "1h",
        title: "Deep Stretches",
        mode: "ai",
      },
      { id: 6, hour: "3pm", duration: "1h", title: "Private Yoga", mode: "ai" },
    ],
  },

  {
    title: dates[3],
    data: [
      {
        id: 7,
        hour: "12am",
        duration: "1h",
        title: "Ashtanga Yoga",
        mode: "ai",
      },
    ],
  },
  {
    title: dates[4],
    data: [{}],
  },
  {
    title: dates[5],
    data: [
      {
        id: 8,
        hour: "9pm",
        duration: "1h",
        title: "Middle Yoga",
        mode: "manual",
      },
      { id: 9, hour: "10pm", duration: "1h", title: "Ashtanga", mode: "ai" },
      { id: 10, hour: "11pm", duration: "1h", title: "TRX", mode: "manual" },
      {
        id: 11,
        hour: "12pm",
        duration: "1h",
        title: "Running Group",
        mode: "ai",
      },
    ],
  },
  {
    title: dates[6],
    data: [
      {
        id: 12,
        hour: "12am",
        duration: "1h",
        title: "Ashtanga Yoga",
        mode: "ai",
      },
    ],
  },
  {
    title: dates[7],
    data: [{}],
  },
  {
    title: dates[8],
    data: [
      {
        id: 13,
        hour: "9pm",
        duration: "1h",
        title: "Pilates Reformer",
        mode: "ai",
      },
      {
        id: 14,
        hour: "10pm",
        duration: "1h",
        title: "Ashtanga",
        mode: "manual",
      },
      { id: 15, hour: "11pm", duration: "1h", title: "TRX", mode: "manual" },
      {
        id: 16,
        hour: "12pm",
        duration: "1h",
        title: "Running Group",
        mode: "ai",
      },
    ],
  },
  {
    title: dates[9],
    data: [
      {
        id: 17,
        hour: "1pm",
        duration: "1h",
        title: "Ashtanga Yoga",
        mode: "ai",
      },
      {
        id: 18,
        hour: "2pm",
        duration: "1h",
        title: "Deep Stretches",
        mode: "manual",
      },
      {
        id: 19,
        hour: "3pm",
        duration: "1h",
        title: "Private Yoga",
        mode: "ai",
      },
    ],
    mode: "manual",
  },
  {
    title: dates[10],
    data: [
      { id: 20, hour: "12am", duration: "1h", title: "Last Yoga", mode: "ai" },
    ],
  },
  {
    title: dates[11],
    data: [
      {
        id: 21,
        hour: "1pm",
        duration: "1h",
        title: "Ashtanga Yoga",
        mode: "manual",
      },
      {
        id: 22,
        hour: "2pm",
        duration: "1h",
        title: "Deep Stretches",
        mode: "manual",
      },
      {
        id: 23,
        hour: "3pm",
        duration: "1h",
        title: "Private Yoga",
        mode: "ai",
      },
    ],
  },
  {
    title: dates[12],
    data: [
      { id: 23, hour: "12am", duration: "1h", title: "Last Yoga", mode: "ai" },
    ],
  },
  {
    title: dates[13],
    data: [
      {
        id: 24,
        hour: "12am",
        duration: "1h",
        title: "Last Yoga",
        mode: "manual",
      },
    ],
  },
];

// JavaScript version of the getMarkedDates function
export function getMarkedDates() {
  const marked = {};

  agendaItems.forEach((item) => {
    // NOTE: only mark dates with data
    if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
      marked[item.title] = { marked: true };
    } else {
      marked[item.title] = { disabled: true };
    }
  });
  return marked;
}
