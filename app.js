(function () {
  const displayEl = document.getElementById('display');

  let current = '0';
  let accumulator = null; // number or null
  let pendingOp = null; // '+', '-', '*', '/' or null
  let justEvaluated = false;

  function updateDisplay() {
    displayEl.textContent = formatForDisplay(current);
  }

  function formatForDisplay(valueStr) {
    // Our UI shows comma as decimal separator
    return valueStr.replace('.', ',');
  }

  function parseFromDisplay(valueStr) {
    // Accept comma input by converting to dot for math
    return parseFloat(valueStr.replace(',', '.'));
  }

  function inputDigit(digit) {
    if (justEvaluated) {
      current = '0';
      justEvaluated = false;
    }
    if (current === '0') {
      current = String(digit);
    } else {
      current += String(digit);
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (justEvaluated) {
      current = '0';
      justEvaluated = false;
    }
    if (!current.includes('.')) {
      current += '.';
    }
    updateDisplay();
  }

  function setOperation(op) {
    const currentNum = parseFromDisplay(current);
    if (accumulator === null) {
      accumulator = currentNum;
    } else if (!justEvaluated && pendingOp) {
      accumulator = compute(accumulator, currentNum, pendingOp);
    }
    pendingOp = op;
    justEvaluated = false;
    current = '0';
    updateDisplay();
  }

  function compute(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function equals() {
    if (pendingOp === null || accumulator === null) {
      justEvaluated = true;
      updateDisplay();
      return;
    }
    const result = compute(accumulator, parseFromDisplay(current), pendingOp);
    current = String(result);
    accumulator = null;
    pendingOp = null;
    justEvaluated = true;
    updateDisplay();
  }

  function allClear() {
    current = '0';
    accumulator = null;
    pendingOp = null;
    justEvaluated = false;
    updateDisplay();
  }

  function negate() {
    const num = parseFromDisplay(current);
    current = String(-num);
    updateDisplay();
  }

  function percent() {
    const num = parseFromDisplay(current);
    current = String(num / 100);
    updateDisplay();
  }

  function handleClick(e) {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    const digit = t.getAttribute('data-digit');
    const op = t.getAttribute('data-op');
    const action = t.getAttribute('data-action');

    if (digit !== null) {
      inputDigit(digit);
      return;
    }
    if (op !== null) {
      setOperation(op);
      return;
    }
    if (action === 'decimal') {
      inputDecimal();
      return;
    }
    if (action === 'ac') {
      allClear();
      return;
    }
    if (action === 'negate') {
      negate();
      return;
    }
    if (action === 'percent') {
      percent();
      return;
    }
    if (action === 'equals') {
      equals();
      return;
    }
  }

  document.querySelector('.keyboard').addEventListener('click', handleClick);

  // Initialize
  updateDisplay();
})();
