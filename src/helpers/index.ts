import moment from "moment";
import numeral from "numeral";
const apiURL = process.env.REACT_APP_API_BASE_URL;

export const chartDataNumberFormater = (number: number) => {
  if (number > 1000000000) {
    return (number / 1000000000).toString() + "B";
  } else if (number > 1000000) {
    return (number / 1000000).toString() + "M";
  } else if (number > 1000) {
    return (number / 1000).toString() + "K";
  } else if (number === 0) {
    return "";
  } else {
    return number.toString();
  }
};

export const chartDataDayFormatted = (day: string) => {
  return day;
  // switch (day) {
  //   case "Monday":
  //     return "Mon";
  //   case "Tuesday":
  //     return "Tue";
  //   case "Wednesday":
  //     return "Wed";
  //   case "Thursday":
  //     return "Thu";
  //   case "Friday":
  //     return "Fri";
  //   case "Saturday":
  //     return "Sat";
  //   case "Sunday":
  //     return "Sun";
  //   default:
  //     return "";
  // }
};

export const formatAmount = (amount: number) =>
  `₱${numeral(amount).format("0,0.00")}`;

export const formatNumber = (amount: number) => numeral(amount).format("0,0");

export const sortPercentageData = (data: any, order = "desc") => {
  return [...data].sort((a, b) =>
    order === "asc" ? a.percentage - b.percentage : b.percentage - a.percentage
  );
};

export const formatDate = (date: any, format?: string) =>
  moment(date).format(format ?? "M/D/YYYY h:mm A");

export const getImageUrl = (image: string) => {
  return `${apiURL}${image}`;
}