import moment from "moment";

export const makeInventoryData = () => {
  const products = [
    {
      name:
        "Lorem Ipsum Dolor Sit Amet Sodi Kiul Sckf Qoas Lorem Ipsum Dolor Sit Amet Sodi Kiul Sckf Qoas Lorem Ipsum Dolor Sit  Lorem Ipsum Dolor SitLorem Ipsum Dolor SitLorem Ipsum Dolor SitLorem Ipsum Dolor Sit",
      description: "High-quality ceramic brake pads for smooth braking.",
      photo: "brake_pads.jpg",
      uniqueCode: "BP-001",
      price: 45.99,
      quantityRemaining: 20,
      quantitySold: 80,
      partNumber: "BPX-1234",
      status: "available",
    },
    {
      name: "Brake Pads",
      description: "High-quality ceramic brake pads for smooth braking.",
      photo: "brake_pads.jpg",
      uniqueCode: "BP-001",
      price: 45.99,
      quantityRemaining: 20,
      quantitySold: 80,
      partNumber: "BPX-1234",
      status: "available",
    },
    {
      name: "Oil Filter",
      description: "Durable oil filter for better engine performance.",
      photo: "oil_filter.jpg",
      uniqueCode: "OF-002",
      price: 12.49,
      quantityRemaining: 0,
      quantitySold: 150,
      partNumber: "OFX-5678",
      status: "out_of_stock",
    },
    {
      name: "Air Filter",
      description: "Premium air filter to improve airflow and fuel efficiency.",
      photo: "air_filter.jpg",
      uniqueCode: "AF-003",
      price: 18.99,
      quantityRemaining: 4,
      quantitySold: 100,
      partNumber: "AFX-3456",
      status: "low",
    },
    {
      name: "Spark Plug",
      description: "Long-lasting spark plug for optimal engine ignition.",
      photo: "spark_plug.jpg",
      uniqueCode: "SP-004",
      price: 7.99,
      quantityRemaining: 60,
      quantitySold: 200,
      partNumber: "SPX-7890",
      status: "available",
    },
    {
      name: "Alternator",
      description:
        "High-performance alternator for efficient power generation.",
      photo: "alternator.jpg",
      uniqueCode: "AL-005",
      price: 149.99,
      quantityRemaining: 10,
      quantitySold: 40,
      partNumber: "ALX-9876",
      status: "low",
    },
    {
      name: "Battery",
      description: "12V car battery with extended lifespan.",
      photo: "battery.jpg",
      uniqueCode: "BT-006",
      price: 89.99,
      quantityRemaining: 15,
      quantitySold: 55,
      partNumber: "BTX-6543",
      status: "available",
    },
    {
      name: "Radiator",
      description: "Heavy-duty radiator for optimal engine cooling.",
      photo: "radiator.jpg",
      uniqueCode: "RD-007",
      price: 129.99,
      quantityRemaining: 12,
      quantitySold: 30,
      partNumber: "RDX-3210",
      status: "low",
    },
    {
      name: "Fuel Pump",
      description: "Electric fuel pump for consistent fuel delivery.",
      photo: "fuel_pump.jpg",
      uniqueCode: "FP-008",
      price: 99.99,
      quantityRemaining: 25,
      quantitySold: 75,
      partNumber: "FPX-1122",
      status: "available",
    },
    {
      name: "Timing Belt",
      description: "Durable timing belt for engine synchronization.",
      photo: "timing_belt.jpg",
      uniqueCode: "TB-009",
      price: 59.99,
      quantityRemaining: 18,
      quantitySold: 42,
      partNumber: "TBX-3344",
      status: "available",
    },
    {
      name: "Headlights",
      description: "LED headlights for enhanced visibility at night.",
      photo: "headlights.jpg",
      uniqueCode: "HL-010",
      price: 74.99,
      quantityRemaining: 22,
      quantitySold: 65,
      partNumber: "HLX-5566",
      status: "available",
    },
  ];

  for (let i = 11; i <= 50; i++) {
    const quantityRemaining = Math.floor(Math.random() * 50);
    products.push({
      name: `Product ${i + 1}`,
      description: `Description for Product ${i + 1}`,
      photo: `https://via.placeholder.com/150`,
      uniqueCode: `CODE-${1000 + i}`,
      price: Number((Math.random() * 100).toFixed(2)),
      quantityRemaining,
      quantitySold: Math.floor(Math.random() * 100),
      partNumber: `PART-${i + 1}`,
      status:
        quantityRemaining < 10
          ? "low"
          : Math.random() > 0.2
          ? "available"
          : "low",
    });
  }

  return products;
};

const getRandomDate = (start: any, end: any) => {
  return moment(start + Math.random() * (end - start)).format("YYYY-MM-DD");
};

const generateRandomDate = () =>
  getRandomDate(
    moment()
      .subtract(1, "year")
      .valueOf(), // 1 year ago
    moment().valueOf() // Today
  );

export const makeSalesChartData = () => {
  return [
    {
      day: "Monday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
    {
      day: "Tuesday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
    {
      day: "Wednesday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
    {
      day: "Thursday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
    {
      day: "Friday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
    {
      day: "Saturday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
    {
      day: "Sunday",
      amount: Math.floor(Math.random() * 4900001) + 100000,
    },
  ];
};

export const generateRandomPercentageData = (count: number) => {
  return Array.from({ length: count }, () => ({
    category: "Tire",
    percentage: parseFloat((Math.random() * (99.99 - 50) + 50).toFixed(1)),
  }));
};

export const recentTransactions = [
  {
    id: 1,
    customer: "John Doe",
    amount: 120,
    quantity: 5,
    status: "completed",
    payment_method: "cash",
    date: generateRandomDate(),
    sales_person: "Maria",
  },
  {
    id: 2,
    product: "Brake Pads",
    productId: "P-00234",
    customer: "Jane Smith",
    amount: 80,
    quantity: 23,
    status: "reserved",
    payment_method: "credit",
    date: generateRandomDate(),
    sales_person: "Mark",
  },
  {
    id: 3,
    product: "Oil Filter",
    productId: "P-00345",
    customer: "Michael Brown",
    amount: 30,
    quantity: 52,
    status: "cancelled",
    payment_method: "credit",
    date: generateRandomDate(),
    sales_person: "Maria",
  },
  {
    id: 4,
    product: "Battery",
    productId: "P-00456",
    customer: "Emily Johnson",
    amount: 150,
    quantity: 23,
    status: "returned",
    payment_method: "cash",
    date: generateRandomDate(),
    sales_person: "Maria",
  },
  {
    id: 5,
    product: "Air Filter",
    productId: "P-00567",
    customer: "Chris Wilson",
    amount: 25,
    quantity: 12,
    status: "cancelled",
    payment_method: "credit",
    date: generateRandomDate(),
    sales_person: "Maria",
  },
  {
    id: 6,
    product: "Headlight",
    productId: "P-00678",
    customer: "Olivia Davis",
    amount: 50,
    quantity: 15,
    status: "reserved",
    payment_method: "credit",
    date: generateRandomDate(),
    sales_person: "Mark",
  },
];

export const generateDummyCategories = (count = 10) => {
  const categoryNames = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Groceries",
    "Automotive",
    "Health",
  ];

  return Array.from({ length: count }, (_, index) => {
    const randomIndex = Math.floor(Math.random() * categoryNames.length);
    const name = categoryNames[randomIndex];

    return {
      id: `cat-${index + 1}`,
      name,
      description: `Category for ${name.toLowerCase()} products`,
      // image: `/images/${name.toLowerCase()}.png`,
      // parentId:
      //   Math.random() > 0.7
      //     ? `cat-${Math.floor(Math.random() * index) + 1}`
      //     : null, // Some categories may be subcategories
      // status: Math.random() > 0.2 ? "active" : "inactive", // 80% active, 20% inactive
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sortOrder: index + 1,
    };
  });
};
