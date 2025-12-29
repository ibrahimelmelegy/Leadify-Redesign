import { graphic } from "echarts";
export function getPieChartsData(data: any, colorpallete: any, position = "0%", left = "center") {
  const pieChartOptions = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
    },
    legend: {
      orient: left === "center" ? "horizontal" : "vertical",
      top: position,
      left: left,
    },
    color: colorpallete,
    series: [
      {
        type: "pie",
        avoidLabelOverlap: false,
        radius: "60%",
        data: [...data],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return pieChartOptions;
}
export function getCenterPieChartsData(data: any, colorpallete: any, title: string, position = "10%", left = "center") {
  const pieChartOptions = {
    legend: {
      orient: left === "center" ? "horizontal" : "vertical",
      top: position,
      left: left,
    },
    title: {
      text: title,
      left: "center",
      top: "center",
      textStyle: {
        fontSize: 40,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
    },
    color: colorpallete,
    series: [
      {
        label: {
          show: false,
        },
        type: "pie",
        data: [...data?.filter(({ name, value }: any) => ({ name, value }))],
        radius: ["40%", "70%"],
      },
    ],
  };
  return pieChartOptions;
}
export function getGaugeChartsData(data: any, colorpallete: any) {
  const gaugeChartOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: "45%",
      left: "center",
    },
    color: colorpallete,
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "100%"],
        // adjust the start and end angle
        startAngle: 180,
        endAngle: 360,
        data: [...data],
      },
    ],
  };
  return gaugeChartOption;
}
export function getBarChartData(data: any, colorpallete: any) {
  const barChartOption = {
    legend: {},
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },

    xAxis: {
      type: "category",
      data: data.map((val: any) => val.name),
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: { type: "value", data: data.map((val: any) => Number(val.value)) },
    series: [
      {
        // name: "Direct",
        type: "bar",
        barWidth: "60%",
        // showBackground: true,
        data: data.map((val: any) => Number(val.value)),
        itemStyle: {
          barBorderRadius: 7,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#7849ff" },
            { offset: 1, color: "#9360ff" },
          ]),
        },
      },
    ],
  };

  return barChartOption;
}
export function getBarHorizontalChartData(data: any, colorpallete: any) {
  const forcedMax = 5; // or 10, depending on your future data volume

  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}",
    },
    xAxis: {
      type: "value",
      max: forcedMax,
      axisLabel: {
        formatter: (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val),
      },
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: data.map((val: any) => val.name),
      inverse: true,
      axisTick: { show: false },
    },
    series: [
      {
        name: "Projects",
        type: "bar",
        data: data.map((val: any) => val.value),
        label: {
          show: true,
          position: "right",
          formatter: "{c}",
        },
      },
    ],
    legend: {
      show: false,
    },
    color: colorpallete,
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
  };
}

export function getBarChartWithLineData(data: any, name?: string[], colorpallete?: any) {
  const max = Math.max(...data.map((val: any) => Number(val.value)));
  const intervalPercentage = 0.4; // Adjust this percentage as needed
  const interval = Math.ceil(max * intervalPercentage);
  const adjustedMax = Math.ceil(max / interval) * interval;
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },

    xAxis: [
      {
        type: "category",
        data: data.map((val: any) => val.name),
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        min: 0,
        max: adjustedMax,
        interval: interval,
      },
      {
        type: "value",
        max: max,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: data.map((val: any) => Number(val.value)),
        barWidth: "17%",
        name: name?.[0] ?? "",
        itemStyle: {
          barBorderRadius: 7,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#9BE0E9" },
            { offset: 1, color: "#1ED8D6" },
          ]),
        },
      },

      {
        type: "line",
        name: name?.[1] ?? "",
        yAxisIndex: 1,
        color: "#babbbd",
        data: data.map((val: any) => Number(val.value2)),
      },
    ],
  };

  return option;
}
export function getStackedBarChartData(data: any, colorpallete: any) {
  const barChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    grid: { containLabel: true },
    xAxis: { name: "amount" },
    yAxis: {
      type: "category",
      data: data.map((val: any) => val.name),
      axisPointer: {
        type: "shadow",
      },
    },

    visualMap: {
      orient: "horizontal",
      left: "center",
      min: 10,
      max: 100,
      show: false,
      // Map the score column to color
      dimension: 0,

      color: colorpallete,
    },
    series: [
      {
        type: "bar",
        // barWidth: "20%",
        data: data.map((val: any) => Number(val.value)),
        encode: {
          // Map the "amount" column to X axis.
          x: "amount",
          // Map the "product" column to Y axis
          y: "product",
        },
        itemStyle: {
          barBorderRadius: 7,
        },
      },
    ],
  };

  return barChartOption;
}
export function getRingChart(data: any, colorpallete: any, position = "0%", left = "center") {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: left === "center" ? "horizontal" : "vertical",
      top: position,
      left: left,
    },
    color: colorpallete,
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [...data],
      },
    ],
  };
  return option;
}
export function getWorldCloudData(data: any) {
  const option = {
    tooltip: {},
    textStyle: {
      fontFamily: "sans-serif",
      fontWeight: "bold",
      // keepAspect: false,
      // sizeRange: [12,60],

      // Color can be a callback function or a color string
      color: function () {
        // Random color
        const tealRed = Math.round(Math.random() * 64);
        const tealGreenBlue = Math.round(Math.random() * 64) + 128;
        const watermelonRed = Math.round(Math.random() * 31) + 224;
        const watermelonGreen = Math.round(Math.random() * 80) + 48;
        const watermelonBlue = Math.round(Math.random() * 32) + 96;

        const randomColor =
          Math.random() < 0.5 // 50% chance for teal, 50% chance for watermelon
            ? `rgb(${tealRed},${tealGreenBlue},${tealGreenBlue})`
            : `rgb(${watermelonRed},${watermelonGreen},${watermelonBlue})`;

        return randomColor;
      },
    },
    series: [
      {
        type: "wordCloud",
        // gridSize:10,
        // shape: "circle",
        data: [...data],
      },
    ],
  };
  return option;
}

export function getIncreaseLineChart(data: any, colorPalette: any) {
  return {
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        const point = params[0];
        return `${point.name}: ${point.value}`;
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: "category",
      data: data.map((val: any) => val.name), // Dates as categories
      splitLine: {
        show: false,
      },
      axisLabel: {
        rotate: 45, // optional: rotate for better readability
      },
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "10%"],
    },
    series: [
      {
        name: "Sales",
        type: "line",
        data: data.map((val: any) => val.value),
        smooth: true,
        lineStyle: {
          width: 2,
        },
      },
    ],
  };
}

export const statsLoading = ref(false);

export async function getLeadsStatics() {
  statsLoading.value = true;
  const { body, success, message } = await useApiFetch("insights/leads-sales");
  statsLoading.value = false;
  if (!success) {
    throw new Error(message || "Failed to fetch lead statistics");
  }

  const toNameValueArray = (obj: Record<string, number>): { name: string; value: number }[] =>
    Object.entries(obj).map(([name, value]) => ({ name: capitalizeName(name), value }));
  const {
    leadCount = 0,
    leadConversionRate = 0,
    opportunityCount = 0,
    dealsCount = 0,
    revenueFromDeals = 0,
    opportunityStages = {},
    dealsPipeline = {},
    salesPerformance = [],
  } = body || {};

  return {
    ...body,
    firstCards: [
      { name: "Total Leads Assigned", value: Number(leadCount) },
      { name: "Lead Conversion Rate", value: `${leadConversionRate?.toFixed(2)}%` },
      { name: "Total Opportunities", value: Number(opportunityCount) },
    ],
    secondCards: [
      { name: "Total Deals Closed", value: formatLargeNumber(dealsCount) },
      { name: "Revenue from Won Deals", value: `SAR ${formatLargeNumber(revenueFromDeals)}` },
    ],
    opportunityStages: toNameValueArray(opportunityStages),
    dealsPipeline: toNameValueArray(dealsPipeline),
    salesPerformance: salesPerformance.map(({ date, revenue }: any) => ({
      name: date,
      value: revenue,
    })),
  };
}

export async function getProjectOperationsStatics() {
  statsLoading.value = true;
  const { body, success, message } = await useApiFetch("insights/projects-operations");
  statsLoading.value = false;

  if (!success) {
    throw new Error(message || "Failed to fetch project operations statistics");
  }

  const toNameValueArray = (obj: Record<string, number>): { name: string; value: number }[] =>
    Object.entries(obj).map(([name, value]) => ({ name: formatSnakeCase(name), value }));
  const {
    projectCount = 0,
    usedAssetPercentage = 0,
    usedManpowerPercentage = 0,
    eitmadProjectsCount = 0,
    projectsByStatus = {},
  } = body || {};

  return {
    ...body,
    firstCards: [
      { name: "Total Projects", value: formatLargeNumber(projectCount) },
      { name: "Eitmad Projects Overview", value: formatLargeNumber(eitmadProjectsCount) },
      // { name: "Total Opportunities", value: Number(opportunityCount) },
    ],
    pieChart_one: {
      title: "Assets Percentage",
      options: [
        { name: "Used Assets Percentage", value: usedAssetPercentage?.toFixed(2) },
        { name: "Unused Assets Percentage", value: (100 - usedAssetPercentage)?.toFixed(2) },
      ],
    },
    pieChart_two: {
      title: "Manpower Percentage",
      options: [
        { name: "Used Manpower Percentage", value: usedManpowerPercentage?.toFixed(2) },
        { name: "Unused Manpower Percentage", value: (100 - usedManpowerPercentage)?.toFixed(2) },
      ],
    },
    projectsByStatus: toNameValueArray(projectsByStatus),
  };
}

export async function getBussinesStatics() {
  statsLoading.value = true;
  const { body, success, message } = await useApiFetch("insights/financial-business-metrics");
  statsLoading.value = false;

  if (!success) {
    throw new Error(message || "Failed to fetch project business statistics");
  }

  const { revenueFromDeals = 0, outstandingInvoicesCount = 0, collectedPaymentsCount = 0 } = body || {};

  return {
    ...body,
    firstCards: [
      { name: "Total Deals Revenue", value: formatLargeNumber(revenueFromDeals) },
      { name: "Outstanding Invoices", value: formatLargeNumber(outstandingInvoicesCount) },
      { name: "Collected Payments", value: formatLargeNumber(collectedPaymentsCount) },
    ],
  };
}

export async function getPerformanceStatics() {
  statsLoading.value = true;
  const { body, success, message } = await useApiFetch("insights/performance-hr");
  statsLoading.value = false;

  if (!success) {
    throw new Error(message || "Failed to fetch project performance hr statistics");
  }

  const { leadCount = 0, percentageOfOpportunitiesBecameDeals = 0, dealsCount = 0 } = body || {};

  return {
    ...body,
    firstCards: [
      { name: "Total Leads", value: formatLargeNumber(leadCount) },
      { name: "Opportunities Became Deals", value: `${percentageOfOpportunitiesBecameDeals?.toFixed(2)}%` },
      { name: "Total Deals", value: formatLargeNumber(dealsCount) },
    ],
  };
}
