// Select all required elements
const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

// Special characters/operators
const specialChars = ["%", "*", "/", "-", "+", "="];

// Variable to store the current input expression
let output = "";

/**
 * Function to process calculator operations
 * @param {string} btnValue - Value of the clicked button
 */
const calculate = (btnValue) => {
  if (btnValue === "=" && output !== "") {
    try {
      // Convert % to '/100' for calculation
      output = eval(output.replace("%", "/100")).toString();
    } catch (err) {
      output = "Error";
    }
  } else if (btnValue === "AC") {
    // Clear all input
    output = "";
  } else if (btnValue === "DEL") {
    // Remove last character
    output = output.slice(0, -1);
  } else {
    // Prevent two consecutive special characters
    if (
      specialChars.includes(btnValue) &&
      specialChars.includes(output.slice(-1))
    )
      return;

    output += btnValue;
  }

  // Display updated output
  display.value = output;
};

// Add click event listeners to all buttons
buttons.forEach((button) =>
  button.addEventListener("click", (e) =>
    calculate(e.target.dataset.value)
  )
);

// Optional: Add keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Allow digits, operators, Enter, Backspace
  if (
    (!isNaN(key) || specialChars.includes(key) || key === ".") &&
    key !== " "
  ) {
    calculate(key === "Enter" ? "=" : key);
  } else if (key === "Backspace") {
    calculate("DEL");
  } else if (key.toLowerCase() === "c") {
    calculate("AC");
  }
});
