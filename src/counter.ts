export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

// C1: Shared shield snapshot
type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missingCharge: number;
};

const shieldCapacity = 10;

let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

// C2: EventTarget announces shield changes
const shieldEvents = new EventTarget();
const shieldChangedEvent = "shield-changed";

// C1: Create a snapshot without DOM or canvas access
function getShieldSnapshot(): ShieldSnapshot {
  return {
    charge: count,
    capacity: shieldCapacity,
    missingCharge: shieldCapacity - count,
  };
}

// Permanent HUD renderer
function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snapshot.capacity; i++) {
    ctx.fillStyle = i < snapshot.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(
    `${snapshot.charge} / ${snapshot.capacity} shield`,
    12,
    100,
  );

  readout.textContent =
    `Shield charge: ${snapshot.charge} / ${snapshot.capacity}`;
}

// Inspector diagnostic
function updateStats(snapshot: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

// Inspector renderer
function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;

  panel.textContent = `Shield charge: ${snapshot.charge} · ` +
    `Missing charge: ${snapshot.missingCharge}`;
}

// C2: Change model state and announce the change
function setCount(next: number) {
  const bounded = Math.max(0, Math.min(shieldCapacity, next));

  // Unchanged values must not announce an event
  if (bounded === count) return;

  count = bounded;

  // Notify listeners that shield state changed
  shieldEvents.dispatchEvent(new Event(shieldChangedEvent));

  // C2: Inspector still uses its direct update path
  if (panel) {
    updateStats(getShieldSnapshot());
  }
}

// C2: Permanent HUD listens for model changes
shieldEvents.addEventListener(shieldChangedEvent, () => {
  drawMeter(getShieldSnapshot());
});

// Shield takes damage
document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};

// Shield recharges
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};

// Reset shield
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};

// Open inspector
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;

  panel = document.createElement("p");
  host.append(panel);

  // Initial rendering is not a delivery
  renderStats(getShieldSnapshot());
};

// Close inspector
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;

  panel.remove();
  panel = null;
};

// Initial HUD rendering
drawMeter(getShieldSnapshot());
