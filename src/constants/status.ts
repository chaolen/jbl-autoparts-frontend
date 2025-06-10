export const productStatus = [
  {
    label: "All Status",
    value: "",
  },
  {
    label: "Available",
    value: "available",
  },
  {
    label: "Low in Stock",
    value: "low_in_stock",
  },
  {
    label: "Out of Stock",
    value: "out_of_stock",
  },
];

export const transactionStatus = [
  {
    label: "All Status",
    value: "",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Reserved",
    value: "reserved",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
  {
    label: "Returned",
    value: "returned",
  },
];

export const statusStyles: any = {
  completed: {
    text: "text-primary-green",
    bg: "bg-primary-lightGreen",
    dot: "bg-primary-green",
  },
  cancelled: {
    text: "text-primary-red",
    bg: "bg-primary-lightRed",
    dot: "bg-primary-red",
  },
  returned: {
    text: "text-primary-grapes",
    bg: "bg-primary-lightGrapes",
    dot: "bg-primary-grapes",
  },
  reserved: {
    text: "text-primary-yellow",
    bg: "bg-primary-lightYellow",
    dot: "bg-primary-yellow",
  },
};

export const userStatusStyles = {
  active: {
    text: "text-primary-green",
    bg: "bg-primary-lightGreen",
    dot: "bg-primary-green",
  },
  inactive: {
    text: "text-primary-red",
    bg: "bg-primary-lightRed",
    dot: "bg-primary-red",
  },
};
