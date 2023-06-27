import moment from 'moment';

const disableDates = (date: moment.Moment) => {
  const day = date.day();
  const validInterval = moment().add(2, 'month');

  if (day === 0 || day === 6 || date > validInterval) {
    return true;
  }
  return false;
};

export default disableDates;
