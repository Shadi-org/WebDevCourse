document.addEventListener("DOMContentLoaded", () => {
  pageLoaded();
});

let txt1;
let txt2;
let btn;
let lblRes;

function pageLoaded() {
  txt1 = document.getElementById("txt1");
  txt2 = document.querySelector("#txt2");
  btn = document.getElementById("btnCalc");
  btn.addEventListener("click", () => {
    calculate();
  });

  // validate on input events
  if (txt1) txt1.addEventListener("input", () => validateAndMark(txt1));
  if (txt2) txt2.addEventListener("input", () => validateAndMark(txt2));
  lblRes = document.getElementById("lblRes");

  const btn2 = document.getElementById("btn2");
  if (btn2)
    btn2.addEventListener("click", () => {
      print("btn2 clicked :" + btn2.id + "|" + btn2.innerText);
    });
}

function calculate() {
  // validate inputs
  const valid1 = validateAndMark(txt1);
  const valid2 = validateAndMark(txt2);

  if (!valid1 || !valid2) {
    lblRes.innerText = "Invalid input";
    print("Calculation aborted: invalid input", true);
    return;
  }

  let txt1Text = txt1.value;
  let num1 = parseFloat(txt1Text);

  let txt2Text = txt2.value;
  let num2 = parseFloat(txt2Text);

  let op = document.getElementById("dropdown").value;

  switch (op) {
    case "+":
      res = num1 + num2;
      break;
    case "-":
      res = num1 - num2;
      break;
    case "*":
      res = num1 * num2;
      break;
    case "/":
      res = num1 / num2;
      break;
    default:
      res = NaN;
  }

  lblRes.innerText = res;

  print(`Calculated: ${num1} ${op} ${num2} = ${res}`, true);
}

// =============================================
// VALIDATION HELPERS
// =============================================
function isNumberString(s) {
  if (typeof s !== "string") return false;
  s = s.trim();
  if (s.length === 0) return false;
  return /^[-+]?\d+(\.\d+)?$/.test(s);
}

function validateAndMark(el) {
  if (!el) return false;
  const val = el.value;
  const ok = isNumberString(val);
  el.classList.remove("is-valid", "is-invalid");
  if (ok) el.classList.add("is-valid");
  else el.classList.add("is-invalid");
  return ok;
}
// =============================================
// HELPER: PRINT TO TEXTAREA
// =============================================
function print(msg, append = false) {
  const ta = document.getElementById("output");
  if (ta) {
    if (append) ta.value += "\n" + msg;
    else ta.value = msg;
  } else console.log(msg);
}

// =============================================
// STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// =============================================
function demoNative() {
  let out = "=== STEP 1: NATIVE TYPES ===\n";

  // String
  const s = "Hello World";
  out += "\n[String] s = " + s;
  out += "\nLength: " + s.length;
  out += "\nUpper: " + s.toUpperCase();

  // Number
  const n = 42;
  out += "\n\n[Number] n = " + n;

  // Boolean
  const b = true;
  out += "\n\n[Boolean] b = " + b;

  // Date
  const d = new Date();
  out += "\n\n[Date] now = " + d.toISOString();

  // Array
  const arr = [1, 2, 3, 4];
  out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
  out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
  out += "\nMap x2 → " + arr.map((x) => x * 2).join(", ");

  // Functions as variables
  const add = function (a, b) {
    return a + b;
  };
  out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

  // Callback
  function calc(a, b, fn) {
    return fn(a, b);
  }
  const result = calc(10, 20, (x, y) => x + y);
  out += "\n[Callback] calc(10,20, x+y ) = " + result;

  print(out);
}
