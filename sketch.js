let flowers = [
  { name: "Rose", img: null, buttonImg: null },
  { name: "Sunflower", img: null, buttonImg: null },
  { name: "Lily", img: null, buttonImg: null },
  { name: "Yellow Lily", img: null, buttonImg: null },
  { name: "Blue", img: null, buttonImg: null },
  { name: "Purple", img: null, buttonImg: null },
  { name: "Bird", img: null, buttonImg: null },
];

let selectedFlower = null;
let bouquet = [];
let removedBouquet = []; // To keep track of removed flowers
let message = "Enter your message here"; // Placeholder text
let customFont; // Variable to hold the loaded font
let input; // Text input field
let bgColor = "#1D467B"; // Default background color
let petaLetterImg; // Declare a variable to hold the image
let colorButtons = []; // Array to store color buttons
let clickSound; // Variable to hold the click sound effect
let saveSound; // Variable to hold the save sound effect

function preload() {
  flowers[0].img = loadImage("rose.png");
  flowers[1].img = loadImage("sunflower.png");
  flowers[2].img = loadImage("lily.png");
  flowers[3].img = loadImage("yellow lily.png");
  flowers[4].img = loadImage("blue.png");
  flowers[5].img = loadImage("purple.png");
  flowers[6].img = loadImage("bird.png");
  flowers[6].img = loadImage("bird.png");
  petaLetterImg = loadImage("petaletter.png");

  flowers[0].buttonImg = loadImage("rose_button.png");
  flowers[1].buttonImg = loadImage("sunflower_button.png");
  flowers[2].buttonImg = loadImage("lily_button.png");
  flowers[3].buttonImg = loadImage("yellow lily_button.png");
  flowers[4].buttonImg = loadImage("blue_button.png");
  flowers[5].buttonImg = loadImage("purple_button.png");
  flowers[6].buttonImg = loadImage("bird_button.png");

  customFont = loadFont("BillieJames-YzDn8.otf");
  clickSound = loadSound("click.wav"); // Load the click sound
  saveSound = loadSound("save.wav"); // Load the save sound
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor);
  createUI();
  positionColorButtons(); // Position color buttons initially
}

function draw() {
  background(bgColor);

  // Center position
  const centerX = width / 2;

  // Shape dimensions
  const shapeWidth = 500;
  const shapeHeight = 700;
  const shapeX = centerX - shapeWidth / 2;
  const shapeY = 100;

  // Draw the main shape (centered horizontally)
  fill("#e4ccba");
  noStroke();
  beginShape();
  vertex(shapeX, shapeY);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY);
  endShape(CLOSE);
  
  // Draw the flower selection images
  drawFlowerSelection();

  // Draw rectangle for flower arrangement (centered horizontally)
  noFill();
  noStroke();
  rect(shapeX, shapeY, shapeWidth + 40, shapeHeight);

  // Draw bouquet
  bouquet.forEach((flower, index) => {
    const drawX = shapeX + flower.relativeX;
    const drawY = shapeY + flower.relativeY + sin(frameCount * 0.1 + index) * 5; // Increase speed
    image(flower.img, drawX - 82.5, drawY, 165, 525);
  });

  // Draw lower rectangle (centered horizontally and attached to the bottom of the main shape)
  fill("#e4ccba");
  noStroke();
  const lowerRectHeight = 170;
  const lowerRectY = shapeY + shapeHeight - lowerRectHeight;
  beginShape();
  vertex(shapeX, lowerRectY);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, lowerRectY);
  endShape(CLOSE);

  // Draw the petaletter.png image
  if (petaLetterImg) {
    const imgWidth = 400; // Adjust this value as needed
    const imgHeight = 1400; // Adjust this value as needed
    const imgX = centerX - imgWidth / 2;
    const imgY = lowerRectY - imgHeight + 807;
    image(petaLetterImg, imgX, imgY, imgWidth, imgHeight);
  }

  // Calculate center of the lower rectangle for the message
  const lowerRectCenterY = shapeY + shapeHeight - lowerRectHeight / 2;

  // Draw message in the middle of the lower rectangle
  fill("#000000");
  textFont(customFont);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(message || "Enter your message here", centerX, lowerRectCenterY);

  // Check if the placeholder text is clicked
  if (mouseIsPressed) {
    let textX = centerX - textWidth(message) / 2;
    let textY = lowerRectCenterY - textSize() / 2;
    if (
      mouseX > textX &&
      mouseX < textX + textWidth(message) &&
      mouseY > textY &&
      mouseY < textY + textSize()
    ) {
      input.elt.focus(); // Focus the text input field
    }
  }
}

function drawFlowerSelection() {
  const buttonSize = 100; // Increased size for the flower buttons
  const buttonSpacing = 20;
  const startX = buttonSpacing;
  const startY = buttonSpacing;

  flowers.forEach((flower, index) => {
    const x = startX + buttonSize / 2;
    const y = startY + index * (buttonSize + buttonSpacing) + buttonSize / 2;

    const aspectRatio = flower.buttonImg.width / flower.buttonImg.height;
    const buttonHeight = buttonSize;
    const buttonWidth = buttonHeight * aspectRatio;

    image(
      flower.buttonImg,
      x - buttonWidth / 2,
      y - buttonHeight / 2,
      buttonWidth,
      buttonHeight
    ); // Maintain aspect ratio

    if (selectedFlower && selectedFlower.name === flower.name) {
      stroke(255);
      strokeWeight(2);
      noFill();
      ellipse(x, y, buttonSize + 0, buttonSize + 0); // Highlight selected flower
    }
  });
}

function createUI() {
  // Message input
  input = createInput("");
  input.position(10, height + 60);
  input.size(200);
  input.attribute("placeholder", "Enter your message here"); // Set the placeholder text
  input.input(() => {
    message = input.value();
  });

  // Save button
  let saveButton = createButton("Save Bouquet");
  saveButton.position(220, height + 60);
  saveButton.mousePressed(saveBouquet);

  // Undo button
  let undoButton = createButton("Undo");
  undoButton.position(330, height + 60);
  undoButton.mousePressed(undo);

  // Clear All button
  let clearAllButton = createButton("Clear All");
  clearAllButton.position(390, height + 60);
  clearAllButton.mousePressed(clearAll);

  // Background color buttons
  let colors = ["#1D467B", "#FF5733", "#296634", "#3357FF", "#F8F88F"];
  colors.forEach((color, index) => {
    let colorButton = createButton("");
    colorButton.size(30, 30);
    colorButton.style("background-color", color);
    colorButton.mousePressed(() => changeBackgroundColor(color));
    colorButtons.push(colorButton); // Add button to array
  });

  // Position the color buttons
  positionColorButtons();
}

function positionColorButtons() {
  colorButtons.forEach((button, index) => {
    button.position(windowWidth - 50, 50 + index * 40);
  });
}

function changeBackgroundColor(color) {
  bgColor = color;
}

function selectFlower(flower) {
  selectedFlower = flower;
}

function mousePressed() {
  const buttonSize = 80;
  const buttonSpacing = 30;
  const startX = buttonSpacing;
  const startY = buttonSpacing;

  // Check if a flower selection image is clicked
  flowers.forEach((flower, index) => {
    const x = startX + buttonSize / 2;
    const y = startY + index * (buttonSize + buttonSpacing) + buttonSize / 2;

    let d = dist(mouseX, mouseY, x, y);
    if (d < buttonSize / 2) {
      selectFlower(flower);
    }
  });

  // Add flower to the bouquet if within the specified area
  const centerX = width / 2;
  const shapeWidth = 570;
  const shapeHeight = 700;
  const shapeX = centerX - shapeWidth / 2;
  const shapeY = 40;

  if (
    selectedFlower &&
    mouseX > shapeX &&
    mouseX < shapeX + shapeWidth + 40 &&
    mouseY > shapeY &&
    mouseY < shapeY + shapeHeight
  ) {
    // Calculate the position relative to the centered shape
    const relativeX = mouseX - shapeX;
    const relativeY = mouseY - shapeY;

    bouquet.push({
      relativeX: relativeX,
      relativeY: relativeY,
      img: selectedFlower.img,
    });
    removedBouquet = []; // Clear redo stack on new addition

    clickSound.play(); // Play the click sound
  }
}

function undo() {
  if (bouquet.length > 0) {
    let removed = bouquet.pop();
    removedBouquet.push(removed);
    redrawCanvas(); // Redraw canvas after undo
  }
}

function clearAll() {
  bouquet = []; // Clear all flowers from the bouquet
  removedBouquet = []; // Clear the redo stack
  redrawCanvas(); // Redraw canvas after clearing all
}

function redrawCanvas() {
  background(bgColor);

  const centerX = width / 2;
  const shapeWidth = 570;
  const shapeHeight = 700;
  const shapeX = centerX - shapeWidth / 2;
  const shapeY = 40;

  // Draw the main shape
  fill("#e4ccba");
  noStroke();
  beginShape();
  vertex(shapeX, shapeY);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY);
  endShape(CLOSE);

  // Draw bouquet
  bouquet.forEach((flower, index) => {
    const drawX = shapeX + flower.relativeX;
    const drawY = shapeY + flower.relativeY + sin(frameCount * 0.1 + index) * 5; // Increase speed
    image(flower.img, drawX - 82.5, drawY, 165, 525);
  });

  // Draw lower rectangle
  fill("#e4ccba");
  noStroke();
  const lowerRectHeight = 200;
  const lowerRectY = shapeY + shapeHeight - lowerRectHeight;
  beginShape();
  vertex(shapeX, lowerRectY);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, lowerRectY);
  endShape(CLOSE);

  // Draw the petaletter.png image
  if (petaLetterImg) {
    const imgWidth = 400; // Adjust this value as needed
    const imgHeight = 1400; // Adjust this value as needed
    const imgX = centerX - imgWidth / 2;
    const imgY = lowerRectY - imgHeight + 807;
    image(petaLetterImg, imgX, imgY, imgWidth, imgHeight);
  }

  // Draw message
  const lowerRectCenterY = lowerRectY + lowerRectHeight / 2;
  fill("#000000");
  textFont(customFont);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(message || "Enter your message here", centerX, lowerRectCenterY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redrawCanvas();
  positionColorButtons(); // Reposition color buttons
}

function saveBouquet() {
  // Play the save sound
  saveSound.play();

  // Create a temporary canvas
  let tempCanvas = createGraphics(540, 800);

  // Calculate the area to crop
  const tempCanvasWidth = 540;
  const tempCanvasHeight = 800;
  const lowerRectHeight = 170;
  const shapeWidth = 500;
  const shapeHeight = 800;
  const centerX = tempCanvasWidth / 2;

  // Draw the main shape on the temporary canvas
  tempCanvas.background(bgColor);
  tempCanvas.fill("#e4ccba");
  tempCanvas.noStroke();
  tempCanvas.beginShape();
  tempCanvas.vertex(0, 0);
  tempCanvas.vertex(0, shapeHeight);
  tempCanvas.vertex(40, shapeHeight);
  tempCanvas.vertex(40, 35);
  tempCanvas.vertex(shapeWidth, 35);
  tempCanvas.vertex(shapeWidth, shapeHeight);
  tempCanvas.vertex(shapeWidth + 40, shapeHeight);
  tempCanvas.vertex(shapeWidth + 40, 0);
  tempCanvas.endShape(CLOSE);

  // Draw bouquet on the temporary canvas
  bouquet.forEach((flower, index) => {
    const drawX = flower.relativeX;
    const drawY = flower.relativeY + sin(frameCount * 0.1 + index) * 5;
    tempCanvas.image(flower.img, drawX - 82.5, drawY, 165, 525);
  });


  // Draw lower rectangle
  tempCanvas.fill("#e4ccba");
  tempCanvas.noStroke();
  tempCanvas.beginShape();
  tempCanvas.vertex(0, shapeHeight - lowerRectHeight);
  tempCanvas.vertex(0, shapeHeight);
  tempCanvas.vertex(shapeWidth + 40, shapeHeight);
  tempCanvas.vertex(shapeWidth + 40, shapeHeight - lowerRectHeight);
  tempCanvas.endShape(CLOSE);
  
  // Draw the petaletter.png image
  if (petaLetterImg) {
    const imgWidth = 400;
    const imgHeight = 1400;
    const imgX = centerX - imgWidth / 2;
    const imgY = shapeHeight - lowerRectHeight - imgHeight + 807;
    tempCanvas.image(petaLetterImg, imgX, imgY, imgWidth, imgHeight);
  }

  // Draw message
  const lowerRectCenterY = shapeHeight - lowerRectHeight / 2;
  tempCanvas.fill("#000000");
  tempCanvas.textFont(customFont);
  tempCanvas.textSize(40);
  tempCanvas.textAlign(CENTER, CENTER);
  tempCanvas.text(
    message || "Enter your message here",
    tempCanvas.width / 2,
    lowerRectCenterY
  );

  // Save the temporary canvas
  save(tempCanvas, "bouquet.png");
}
