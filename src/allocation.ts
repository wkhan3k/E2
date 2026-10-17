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

// A2: Explicit type for calculated shift results
type ShiftResult = {
  assignedToSupplies: number;
  totalCrew: number;
  production: number;
  consumption: number;
  balance: number;
};

let assignedToSupplies = 2;

// Calculate shift results independently of the canvas and HTML
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

// A2: Canvas consumes the calculated shift result
function drawAllocationCanvas(result: ShiftResult) {
  const {
    assignedToSupplies,
    totalCrew,
    production,
    consumption,
  } = result;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all six crew members
  for (let crewIndex = 0; crewIndex < totalCrew; crewIndex++) {
    ctx.fillStyle = crewIndex < assignedToSupplies ? "#27766b" : "#c9d2c9";

    ctx.fillRect(18 + crewIndex * 45, 16, 36, 36);

    ctx.fillStyle = crewIndex < assignedToSupplies ? "#ffffff" : "#233e43";

    ctx.font = "16px system-ui";
    ctx.fillText(
      String(crewIndex + 1),
      31 + crewIndex * 45,
      40,
    );
  }

  // Draw assigned crew count
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${assignedToSupplies} / ${totalCrew}`,
    18,
    76,
  );

  // Draw production
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);

  // Draw consumption
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
}

// A2: HTML readout consumes the same shift result
function updateAllocationReadout(result: ShiftResult) {
  readout.textContent =
    `Assigned: ${result.assignedToSupplies}/${result.totalCrew} · ` +
    `Production: ${result.production} · ` +
    `Consumption: ${result.consumption} · ` +
    `Balance: ${result.balance > 0 ? "+" : ""}${result.balance}`;
}

// Calculate once and send the same result to both renderers
function updateAllocationDisplay() {
  const result = calculateSupplies(assignedToSupplies);

  drawAllocationCanvas(result);
  updateAllocationReadout(result);
}

// Decrease assigned crew
document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedToSupplies = Math.max(0, assignedToSupplies - 1);
  updateAllocationDisplay();
};

// Increase assigned crew
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedToSupplies = Math.min(
    totalCrew,
    assignedToSupplies + 1,
  );
  updateAllocationDisplay();
};

// Reset crew allocation
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = 2;
    updateAllocationDisplay();
  };

// Initial display
updateAllocationDisplay();
