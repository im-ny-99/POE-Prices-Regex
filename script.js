/**
 * Generates an exact Regex pattern matching an integer range between min and max.
 * @param {number} min - Lower bound
 * @param {number} max - Upper bound
 * @returns {string} Formatted Regex pattern
 */
function generateRangeRegex(min, max) {
  if (min > max) [min, max] = [max, min];
  if (min === max) return min.toString();

  const patterns = [];

  function rangeToRegex(a, b) {
    if (a > b) return;
    if (a === b) {
      patterns.push(a.toString());
      return;
    }

    const aStr = a.toString();
    const bStr = b.toString();

    if (aStr.length !== bStr.length) {
      const nextPower = Math.pow(10, aStr.length);
      rangeToRegex(a, nextPower - 1);
      rangeToRegex(nextPower, b);
      return;
    }

    if (aStr.length === 1) {
      patterns.push(`[${a}-${b}]`);
      return;
    }

    if (aStr[0] === bStr[0]) {
      if (aStr[1] === '0' && bStr[1] === '9') {
        patterns.push(`${aStr[0]}[0-9]`);
      } else if (aStr[1] === bStr[1]) {
        patterns.push(`${aStr[0]}${aStr[1]}`);
      } else {
        patterns.push(`${aStr[0]}[${aStr[1]}-${bStr[1]}]`);
      }
      return;
    }

    if (aStr[1] !== '0') {
      const subEnd = parseInt(aStr[0] + '9');
      rangeToRegex(a, subEnd);
      rangeToRegex(subEnd + 1, b);
      return;
    }

    if (bStr[1] !== '9') {
      const subStart = parseInt(bStr[0] + '0');
      rangeToRegex(a, subStart - 1);
      rangeToRegex(subStart, b);
      return;
    }

    patterns.push(`[${aStr[0]}-${bStr[0]}][0-9]`);
  }

  rangeToRegex(min, max);

  return patterns.length === 1 ? patterns[0] : `(${patterns.join('|')})`;
}

/**
 * Reads UI inputs and updates the output Regex string.
 */
function updateRegex() {
  const min = parseInt(document.getElementById('min').value) || 0;
  const max = parseInt(document.getElementById('max').value) || 0;
  const currency = document.getElementById('currency').value;

  if (min < 0 || max < 0) {
    document.getElementById('output').innerText = "Values must be greater than or equal to 0";
    return;
  }

  const numPattern = generateRangeRegex(min, max);
  const finalRegex = `\"\\s${numPattern} ${currency}\"`;

  document.getElementById('output').innerText = finalRegex;
}

/**
 * Copies the generated Regex to the user's clipboard and handles visual feedback.
 */
function copyRegex() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text);
  
  const btn = document.querySelector('.btn-copy');
  btn.innerText = "Copied!";
  setTimeout(() => btn.innerText = "Copy Regex", 1500);
}

// Attach event listeners for real-time updates
document.getElementById('min').addEventListener('input', updateRegex);
document.getElementById('max').addEventListener('input', updateRegex);
document.getElementById('currency').addEventListener('change', updateRegex);

// Initial trigger on page load
updateRegex();
