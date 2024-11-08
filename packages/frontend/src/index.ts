const PLUGIN_PATH = "/cursor-pen";
let isPenMode = false;
let tempCanvas = null;
let tempCtx = null;
let currentTool = 'pen';
let currentColor = '#FF0000';
let currentSize = 2;
let isDrawing = false;
let startX, startY, endX, endY;
let blurOverlays = [];

const injectStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .cursor-pen-toolbar {
      background-color: #2c2a35;
      border-radius: 5px;
      padding: 10px;
      display: flex;
      gap: 10px;
      display: none;
    }

    .cursor-pen-toolbar button,
    .cursor-pen-toolbar input,
    .cursor-pen-toolbar select {
      background-color: #a0213e;
      color: white;
      border: none;
      padding: 5px 10px;
      margin: 0;
      border-radius: 3px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .cursor-pen-toolbar button:hover,
    .cursor-pen-toolbar input:hover,
    .cursor-pen-toolbar select:hover {
      background-color: #b52c4c;
    }

    .cursor-pen-toolbar input[type="color"] {
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .cursor-pen-toolbar input[type="number"] {
      width: 50px;
    }

    .cursor-pen-instructions {
      position: relative;
      top: 50%;
      left: 31%;
      transform: translate(-50%, -50%);
      font-family: Arial, sans-serif;
      text-align: center;
      user-select: none;
      background-color: rgba(44, 42, 53, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      max-width: 600px;
      margin: auto;
    }

    .cursor-pen-instructions h1 {
      margin-bottom: 15px;
      color: #a0213e;
    }

    .cursor-pen-instructions p {
      margin: 10px 0;
      font-size: 16px;
    }

    .cursor-pen-instructions a {
      color: #7289da;
      text-decoration: none;
      pointer-events: auto;
    }

    .cursor-pen-instructions a:hover {
      text-decoration: underline;
    }

    .blur-overlay {
      position: absolute;
      backdrop-filter: blur(5px);
      pointer-events: none;
    }

    .drawing-image {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 2147483647;
    }
  `;
  document.head.appendChild(style);
};

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2147483646'; // below the blur overlays and drawings
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return canvas;
};

const initializeDrawing = () => {
  tempCanvas = createCanvas();
  tempCtx = tempCanvas.getContext('2d');
  updateDrawingStyle(tempCtx);
  document.body.appendChild(tempCanvas);
};

const updateDrawingStyle = (context) => {
  context.strokeStyle = currentColor;
  context.lineWidth = currentSize;
  context.lineCap = 'round';
};

const startDrawing = (e) => {
  if (!isPenMode) return;
  isDrawing = true;
  const rect = tempCanvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  if (currentTool === 'pen') {
    tempCtx.beginPath();
    tempCtx.moveTo(startX, startY);
  }
};

const draw = (e) => {
  if (!isDrawing || !isPenMode) return;
  const rect = tempCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  endX = x;
  endY = y;

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  switch (currentTool) {
    case 'pen':
      tempCtx.lineTo(x, y);
      tempCtx.stroke();
      break;
    case 'circle':
      drawCircle(tempCtx, startX, startY, x, y);
      break;
    case 'square':
      drawSquare(tempCtx, startX, startY, x, y);
      break;
    case 'blur':
      const rectX = Math.min(startX, x);
      const rectY = Math.min(startY, y);
      const rectWidth = Math.abs(x - startX);
      const rectHeight = Math.abs(y - startY);
      tempCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; 
      tempCtx.lineWidth = 1;
      tempCtx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      break;
  }
};

const stopDrawing = () => {
  if (!isDrawing) return;
  isDrawing = false;

  if (currentTool === 'blur') {
    const rectX = Math.min(startX, endX);
    const rectY = Math.min(startY, endY);
    const rectWidth = Math.abs(endX - startX);
    const rectHeight = Math.abs(endY - startY);

    const blurDiv = document.createElement('div');
    blurDiv.className = 'blur-overlay';
    blurDiv.style.left = `${rectX}px`;
    blurDiv.style.top = `${rectY}px`;
    blurDiv.style.width = `${rectWidth}px`;
    blurDiv.style.height = `${rectHeight}px`;
    blurDiv.style.zIndex = '2147483647'; // above the canvas
    document.body.appendChild(blurDiv);
    blurOverlays.push(blurDiv);
  } else {
    // create an image element to display the drawing
    const img = new Image();
    img.src = tempCanvas.toDataURL();
    img.className = 'drawing-image';
    document.body.appendChild(img);
  }

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
};

const drawCircle = (context, startX, startY, endX, endY) => {
  const radius = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  context.beginPath();
  context.arc(startX, startY, radius, 0, Math.PI * 2);
  context.stroke();
};

const drawSquare = (context, startX, startY, endX, endY) => {
  const width = endX - startX;
  const height = endY - startY;
  context.strokeRect(startX, startY, width, height);
};

const clearCanvas = () => {
  // remove all drawings
  const images = document.querySelectorAll('.drawing-image');
  images.forEach((img) => img.remove());

  // remove all blur overlays
  blurOverlays.forEach((overlay) => overlay.remove());
  blurOverlays = [];

  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
};

const togglePenMode = () => {
  isPenMode = !isPenMode;
  document.body.style.cursor = isPenMode ? 'crosshair' : 'default';
  updateToolbarState();
  if (isPenMode) {
    tempCanvas.style.pointerEvents = 'auto';
  } else {
    tempCanvas.style.pointerEvents = 'none';
  }
};

const createToolbar = () => {
  const toolbar = document.createElement('div');
  toolbar.className = 'cursor-pen-toolbar';
  toolbar.style.position = 'fixed';
  toolbar.style.top = '10px';
  toolbar.style.right = '10px';
  toolbar.style.zIndex = '2147483648';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.onclick = togglePenMode;

  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear';
  clearButton.onclick = clearCanvas;

  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.value = currentColor;
  colorPicker.onchange = (e) => {
    currentColor = e.target.value;
    updateDrawingStyle(tempCtx);
  };

  const sizeInput = document.createElement('input');
  sizeInput.type = 'number';
  sizeInput.min = '1';
  sizeInput.max = '50';
  sizeInput.value = currentSize;
  sizeInput.onchange = (e) => {
    currentSize = parseInt(e.target.value);
    updateDrawingStyle(tempCtx);
  };

  const toolSelect = document.createElement('select');
  ['pen', 'circle', 'square', 'blur'].forEach((tool) => {
    const option = document.createElement('option');
    option.value = tool;
    option.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
    toolSelect.appendChild(option);
  });
  toolSelect.onchange = (e) => {
    currentTool = e.target.value;
    if (currentTool === 'blur') {
      colorPicker.disabled = true;
    } else {
      colorPicker.disabled = false;
    }
    // fix: update drawing style when tool changes
    updateDrawingStyle(tempCtx);
  };

  toolbar.appendChild(closeButton);
  toolbar.appendChild(clearButton);
  toolbar.appendChild(colorPicker);
  toolbar.appendChild(sizeInput);
  toolbar.appendChild(toolSelect);

  return toolbar;
};

const updateToolbarState = () => {
  const toolbar = document.querySelector('.cursor-pen-toolbar');
  if (toolbar) {
    toolbar.style.display = isPenMode ? 'block' : 'none';
  }
};

const createPage = (sdk) => {
  injectStyles();
  initializeDrawing();
  const toolbar = createToolbar();
  document.body.appendChild(toolbar);

  const instructionsDiv = document.createElement('div');
  instructionsDiv.className = 'cursor-pen-instructions';
  instructionsDiv.innerHTML = `
    <h1>Screen Drawing Plugin</h1>
    <p>This plugin allows you to draw on the screen.</p>
    <p><strong>How to Activate:</strong></p>
    <ul>
      <li>Press <strong>F12</strong> to toggle the drawing mode on and off.</li>
      <li>Use the toolbar at the top-right corner to select tools, colors, and sizes.</li>
      <li>Press <strong>F12</strong> again or click the <strong>Close</strong> button to deactivate the drawing mode.</li>
    </ul>
    <p>If you need any help, join our <a href="#" id="discord-link">Discord server</a>.</p>
    <p>Follow me on <a href="#" id="X-link">X</a>.</p>
  `;

  instructionsDiv.querySelector('#discord-link').addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof __CAIDO_DESKTOP__ !== 'undefined' && __CAIDO_DESKTOP__.openInBrowser) {
      __CAIDO_DESKTOP__.openInBrowser('https://links.caido.io/www-discord');
    } else {
      window.open('https://links.caido.io/www-discord', '_blank', 'noopener,noreferrer');
    }
  });

  instructionsDiv.querySelector('#X-link').addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof __CAIDO_DESKTOP__ !== 'undefined' && __CAIDO_DESKTOP__.openInBrowser) {
      __CAIDO_DESKTOP__.openInBrowser('https://x.com/Tur24Tur');
    } else {
      window.open('https://x.com/Tur24Tur', '_blank', 'noopener,noreferrer');
    }
  });

  window.addEventListener('resize', () => {
    tempCanvas.width = window.innerWidth;
    tempCanvas.height = window.innerHeight;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
      e.preventDefault();
      togglePenMode();
    }
  });

  tempCanvas.addEventListener('mousedown', startDrawing);
  tempCanvas.addEventListener('mousemove', draw);
  tempCanvas.addEventListener('mouseup', stopDrawing);
  tempCanvas.addEventListener('mouseout', stopDrawing);

  sdk.navigation.addPage(PLUGIN_PATH, {
    body: instructionsDiv,
  });
};

export const init = (sdk) => {
  createPage(sdk);
  sdk.sidebar.registerItem('Screen Drawing', PLUGIN_PATH, {
    icon: 'fas fa-pen',
  });
};
