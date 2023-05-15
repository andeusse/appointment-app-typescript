import moment from 'moment';

export const getDoctorAvailableAppointsments = (
  date: Date,
  currentAppointments: string[]
) => {
  const allDates = getDates(date);
  const availableDates: string[] = [];
  allDates.push(...currentAppointments);

  allDates.forEach((date) => {
    if (allDates.filter((d) => d === date).length === 1) {
      availableDates.push(date);
    }
  });

  return availableDates;
};

function getDates(date: Date) {
  var dateArray = new Array();
  const startDate = moment(date);
  const stopDate = moment(date);
  startDate.add(7, 'hours');
  stopDate.add(17, 'hours');

  while (startDate < stopDate) {
    dateArray.push(startDate.toISOString());
    startDate.add(30, 'minutes');
  }
  return dateArray;
}
