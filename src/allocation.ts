
export {};

const canvas = document.querySelector<HTMLCanvasElement>(
  "#allocation-canvas",
)!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const totalCrew = 6;
const suppliesPerProducer = 3;

type ShiftResult = {
  assignedToSupplies: number;
  totalCrew: number;
  production: number;
  consumption: number;
  balance: number;
};

// A3: Typed record describing a report row
type SupplyReportRow = {
  label: string;
  value: number;
  color: string;
};

let assignedToSupplies = 2;

// A1/A2: Calculate supplies independently of rendering
function calculateSupplies(assigned: number): ShiftResult {
  const production = assigned * suppliesPerProducer;
  const consumption = totalCrew;
  const balance = production - consumption;

  return {
    assignedToSupplies: assigned,
    totalCrew,
    production,
    consumption,
    balance,
  };
}

// A3: Build ordered display records from A2 results
function createSupplyReportRows(
  result: ShiftResult,
): SupplyReportRow[] {
  return [
    {
      label: "Production",
      value: result.production,
      color: "#27766b",
    },
    {
      label: "Consumption",
      value: result.consumption,
      color: "#a44d23",
    },
  ];
}

// Draw canvas using the calculated shift result
function drawAllocationCanvas(result: ShiftResult) {
  const {
    assignedToSupplies,
    totalCrew,
  } = result;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw crew members
  for (let crewIndex = 0; crewIndex < totalCrew; crewIndex++) {
    ctx.fillStyle =
      crewIndex < assignedToSupplies ? "#27766b" : "#c9d2c9";

    ctx.fillRect(18 + crewIndex * 45, 16, 36, 36);

    ctx.fillStyle =
      crewIndex < assignedToSupplies ? "#ffffff" : "#233e43";

    ctx.font = "16px system-ui";
    ctx.fillText(
      String(crewIndex + 1),
      31 + crewIndex * 45,
      40,
    );
  }

  // Draw crew assignment label
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";

  ctx.fillText(
    `Producers: ${assignedToSupplies} / ${totalCrew}`,
    18,
    76,
  );

  // A3: Render report rows using one loop
  const rows = createSupplyReportRows(result);

  rows.forEach((row, index) => {
    const labelY = 102 + index * 52;
    const barY = 110 + index * 52;

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${row.value}`, 18, labelY);

    ctx.fillStyle = row.color;
    ctx.fillRect(18, barY, row.value * 14, 20);
  });
}

// A2: HTML uses the same calculated results
function updateAllocationReadout(result: ShiftResult) {
  readout.textContent =
    `Assigned: ${result.assignedToSupplies}/${result.totalCrew} · ` +
    `Production: ${result.production} · ` +
    `Consumption: ${result.consumption} · ` +
    `Balance: ${result.balance > 0 ? "+" : ""}${result.balance}`;
}

// Update both displays using one calculation
function updateAllocationDisplay() {
  const result = calculateSupplies(assignedToSupplies);

  drawAllocationCanvas(result);
  updateAllocationReadout(result);
}

// Decrease assigned crew
document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick =
  () => {
    assignedToSupplies = Math.max(0, assignedToSupplies - 1);
    updateAllocationDisplay();
  };

// Increase assigned crew
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick =
  () => {
    assignedToSupplies = Math.min(
      totalCrew,
      assignedToSupplies + 1,
    );
    updateAllocationDisplay();
  };

// Reset allocation
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = 2;
    updateAllocationDisplay();
  };

// Initial display
updateAllocationDisplay();
