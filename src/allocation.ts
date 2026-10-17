export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const totalCrew = 6;
const suppliesPerProducer = 3;

let assignedToSupplies = 2;

// Calculate supplies for the current shift
function calculateSupplies(assigned: number) {
  const production = assigned * suppliesPerProducer;
  const consumption = totalCrew;
  const balance = production - consumption;

  return { production, consumption, balance };
}

// Update the canvas and HTML readout
function updateAllocationDisplay() {
  const { production, consumption, balance } = calculateSupplies(
    assignedToSupplies,
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the six crew members
  for (let crewIndex = 0; crewIndex < totalCrew; crewIndex++) {
    ctx.fillStyle = crewIndex < assignedToSupplies ? "#27766b" : "#c9d2c9";

    ctx.fillRect(18 + crewIndex * 45, 16, 36, 36);

    ctx.fillStyle = crewIndex < assignedToSupplies ? "#ffffff" : "#233e43";

    ctx.font = "16px system-ui";
    ctx.fillText(String(crewIndex + 1), 31 + crewIndex * 45, 40);
  }

  // Show crew assignments
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${assignedToSupplies} / ${totalCrew}`,
    18,
    76,
  );

  // Show production
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);

  // Show consumption
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);

  // Update the HTML readout
  readout.textContent = `Assigned: ${assignedToSupplies}/${totalCrew} · ` +
    `Production: ${production} · ` +
    `Consumption: ${consumption} · ` +
    `Balance: ${balance > 0 ? "+" : ""}${balance}`;
}

// Decrease crew assigned to supplies
document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedToSupplies = Math.max(0, assignedToSupplies - 1);
  updateAllocationDisplay();
};

// Increase crew assigned to supplies
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedToSupplies = Math.min(
    totalCrew,
    assignedToSupplies + 1,
  );
  updateAllocationDisplay();
};

// Reset to two assigned crew members
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = 2;
    updateAllocationDisplay();
  };

// Initial display
updateAllocationDisplay();
