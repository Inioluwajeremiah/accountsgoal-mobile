function isLeapYear(year) {
  // A leap year is divisible by 4, but not by 100 unless it is also divisible by 400
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

const getDaysInMonth = () => {
  const currentMonth = new Date().getMonth();
  if (currentMonth == 0) {
    return 31;
  }
  if (currentMonth == 1) {
    if (getDaysInYear(new Date().getFullYear() === 366)) {
      return 29;
    } else {
      return 28;
    }
  }
  if (currentMonth == 2) {
    return 31;
  }
  if (currentMonth == 3) {
    return 30;
  }
  if (currentMonth == 4) {
    return 31;
  }
  if (currentMonth == 5) {
    return 30;
  }
  if (currentMonth == 6) {
    return 31;
  }
  if (currentMonth == 7) {
    return 31;
  }
  if (currentMonth == 8) {
    return 30;
  }
  if (currentMonth == 9) {
    return 31;
  }
  if (currentMonth == 10) {
    return 30;
  }
  if (currentMonth == 11) {
    return 31;
  }

  //   January - 31 days
  // February - 28 or 29 days (depending on leap year)
  // March - 31 days
  // April - 30 days
  // May - 31 days
  // June - 30 days
  // July - 31 days
  // August - 31 days
  // September - 30 days
  // October - 31 days
  // November - 30 days
  // December - 31 days
};

export const getTimeRemaining = (date) => {
  const recentTime = new Date().getTime();
  const inputTime = new Date(date).getTime();
  const timeDifference = recentTime - inputTime;

  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;
  const millisecondsPerMonth = millisecondsPerDay * 30;
  const millisecondsPerYear = millisecondsPerDay * 365;

  // Calculate time difference in terms of days, hours, minutes, months, and years
  const minute = Math.floor(
    (timeDifference % millisecondsPerHour) / millisecondsPerMinute
  );
  const hour = Math.floor(
    (timeDifference % millisecondsPerDay) / millisecondsPerHour
  );
  const day = Math.floor(timeDifference / millisecondsPerDay);

  const month = Math.floor(timeDifference / millisecondsPerMonth);
  const year = Math.floor(timeDifference / millisecondsPerYear);

  // const minute = new Date(timeDifference).getMinutes();
  // const hour = new Date(timeDifference).getHours();
  // const day = new Date(timeDifference).getDay();
  // const month = new Date(timeDifference).getMonth();
  // const year = new Date(timeDifference).getFullYear();

  if (!year && !month && !day && !hour && minute) {
    return `${minute} mins ago`;
  } else if (!year && !month && !day && hour) {
    return `${hour} hrs ago`;
  } else if (!year && !month && day) {
    return `${day} days ago`;
  } else if (!year && month) {
    return `${month} months ago`;
  } else if (year) {
    return `${year} years ago`;
  } else {
    return "";
  }

  // return [
  //   `${minute} mins ago`,
  //   `${hour} hrs ago`,
  //   `${day} days ago`,
  //   `${month} months ago`,
  //   `${year} years ago`,
  // ];
};

export const getDateRemaining = (date) => {
  const recentTime = new Date().getTime();
  const inputTime = new Date(date).getTime();
  const timeDifference = inputTime - recentTime;

  console.log("recentTime ===> ", timeDifference);
  const daysInAYear = getDaysInYear(new Date().getFullYear());

  console.log("daysInAYear ==> ", daysInAYear);

  console.log("get month ==> ", new Date().getMonth());

  const totalSeconds = Math.floor(timeDifference / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  // Calculate the remaining time components
  const years = Math.floor(totalDays / daysInAYear);
  const months = Math.floor((totalDays % 365) / getDaysInMonth()); // Assuming a month has 30 days
  const remainingWeeks = totalDays % 7;
  const remainingDays = totalDays % 30;
  const remainingHours = totalHours % 24;
  const remainingMinutes = totalMinutes % 60;
  const remainingSeconds = totalSeconds % 60;

  if (years) {
    return `${years} years ${months} months ${remainingWeeks} ${remainingDays} days ${remainingHours} hours ${remainingMinutes} mins`;
  }
  if (months) {
    return `${months} months ${remainingWeeks} weeks ${remainingDays} days ${remainingHours} hours ${remainingMinutes} mins`;
  }
  if (remainingWeeks) {
    return `${remainingWeeks} weeks ${remainingDays} days ${remainingHours} hours ${remainingMinutes} mins`;
  }
  if (remainingDays) {
    return `${remainingDays} days ${remainingHours} hours ${remainingMinutes} mins`;
  }
  if (remainingHours) {
    return `${remainingHours} hours ${remainingMinutes} mins`;
  }
  if (remainingMinutes) {
    return `${remainingMinutes} mins`;
  }
};
