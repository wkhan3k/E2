
export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#rover-readout",
)!;

// B1: Explicit command type
type Command = "Forward" | "Right";

// B2: Typed direction records
type DirectionRecord = {
  name: string;
  dx: number;
  dy: number;
};

const directions: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

const gridSize = 5;

let x = 2;
let y = 2;
let direction = 0;

// B3: Pending commands
const commandQueue: Command[] = [];

// B3: Queue-related HTML elements
const pendingList = document.querySelector<HTMLOListElement>(
  "#rover-pending",
)!;

const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

const runButton = document.querySelector<HTMLButtonElement>(
  "#rover-run",
)!;

const clearButton = document.querySelector<HTMLButtonElement>(
  "#rover-clear",
)!;

// Keep coordinates within the grid
function stayInBounds(value: number): number {
  return Math.max(0, Math.min(gridSize - 1, value));
}

// Draw the rover and grid
function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";

  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      ctx.strokeRect(
        10 + column * 56,
        10 + row * 56,
        56,
        56,
      );
    }
  }

  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);

  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  readout.textContent =
    `Position: (${x}, ${y}) · Facing: ${directions[direction].name}`;
}

// B1/B2: Execute a command using direction records
function executeCommand(command: Command) {
  if (command === "Forward") {
    const currentDirection = directions[direction];

    x = stayInBounds(x + currentDirection.dx);
    y = stayInBounds(y + currentDirection.dy);
  }

  if (command === "Right") {
    direction = (direction + 1) % directions.length;
  }

  drawRover();
}

// B3: Update the pending command display
function updateQueueDisplay() {
  // Remove old list items
  pendingList.replaceChildren();

  // Create one list item for each queued command
  for (const command of commandQueue) {
    const listItem = document.createElement("li");
    listItem.textContent = command;
    pendingList.appendChild(listItem);
  }

  // Enable buttons only when commands are pending
  const hasCommands = commandQueue.length > 0;

  runButton.disabled = !hasCommands;
  clearButton.disabled = !hasCommands;

  queueStatus.textContent = hasCommands
    ? `${commandQueue.length} command(s) pending`
    : "Empty · queue not implemented";
}

// B3: Add a command without moving the rover
function enqueueCommand(command: Command) {
  commandQueue.push(command);
  updateQueueDisplay();
}

// B3: Run commands in FIFO order
function runCommands() {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    executeCommand(command);
  }

  updateQueueDisplay();
}

// B3: Discard pending commands
function clearCommands() {
  commandQueue.length = 0;
  updateQueueDisplay();
}

// Forward now adds to the queue
document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick =
  () => {
    enqueueCommand("Forward");
  };

// Right now adds to the queue
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick =
  () => {
    enqueueCommand("Right");
  };

// Run executes queued commands
runButton.onclick = () => {
  runCommands();
};

// Clear discards queued commands
clearButton.onclick = () => {
  clearCommands();
};

// Reset restores rover and clears pending commands
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick =
  () => {
    x = 2;
    y = 2;
    direction = 0;

    clearCommands();
    drawRover();
  };

// Initial display
drawRover();
updateQueueDisplay();
