function formatNumber(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1000)
    return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
  return Number(n)
    .toFixed(6)
    .replace(/\.?(0+)$/, "");
}

function getFloat(id) {
  const str = document.getElementById(id).value;
  if (str === null || str === undefined || str === "") return null;
  const v = parseFloat(str);
  return isNaN(v) ? null : v;
}

function show(elId, html, isError) {
  const el = document.getElementById(elId);
  el.style.display = "block";
  el.innerHTML = isError ? `<span class="err">${html}</span>` : html;
}

// --- Soil functions ---
function calcMassLoss() {
  const flow = getFloat("flow");
  const conc = getFloat("concentration");
  if (flow === null || conc === null) {
    show(
      "soilResult",
      "Please enter both Flow and Concentration to calculate mass loss.",
      true
    );
    return;
  }
  const mass = flow * conc;
  document.getElementById("massloss").value = Number(mass.toFixed(6));
  show(
    "soilResult",
    `<div>Mass loss = <strong>${formatNumber(
      mass
    )} kg/hr</strong><br><small>Computed as ${formatNumber(
      flow
    )} m³/hr × ${formatNumber(conc)} kg/m³</small></div>`
  );
}

function calcConcentration() {
  const flow = getFloat("flow");
  const mass = getFloat("massloss");
  if (flow === null || mass === null) {
    show(
      "soilResult",
      "Please enter both Flow and Mass loss to calculate concentration.",
      true
    );
    return;
  }
  if (flow === 0) {
    show(
      "soilResult",
      "Flow must be non-zero to calculate concentration.",
      true
    );
    return;
  }
  const conc = mass / flow;
  document.getElementById("concentration").value = Number(conc.toFixed(6));
  show(
    "soilResult",
    `<div>Concentration = <strong>${formatNumber(
      conc
    )} kg/m³</strong><br><small>Computed as ${formatNumber(
      mass
    )} kg/hr ÷ ${formatNumber(flow)} m³/hr</small></div>`
  );
}

function calcFlow() {
  const conc = getFloat("concentration");
  const mass = getFloat("massloss");
  if (conc === null || mass === null) {
    show(
      "soilResult",
      "Please enter both Concentration and Mass loss to calculate flow.",
      true
    );
    return;
  }
  if (conc === 0) {
    show(
      "soilResult",
      "Concentration must be non-zero to calculate flow.",
      true
    );
    return;
  }
  const flow = mass / conc;
  document.getElementById("flow").value = Number(flow.toFixed(6));
  show(
    "soilResult",
    `<div>Flow = <strong>${formatNumber(
      flow
    )} m³/hr</strong><br><small>Computed as ${formatNumber(
      mass
    )} kg/hr ÷ ${formatNumber(conc)} kg/m³</small></div>`
  );
}

// --- Runoff functions ---
function calcRunoffVolume() {
  const area = getFloat("area");
  const intensity = getFloat("intensity");
  const coeff = getFloat("coeff");
  if (area === null || intensity === null) {
    show(
      "runoffResult",
      "Please enter Area and Rainfall Intensity to calculate runoff volume.",
      true
    );
    return;
  }
  const c = coeff === null ? 1 : coeff;
  const runoff = area * intensity * c;
  document.getElementById("runoff").value = Number(runoff.toFixed(6));
  show(
    "runoffResult",
    `<div>Runoff ≈ <strong>${formatNumber(
      runoff
    )} m³/hr</strong><br><small>${formatNumber(area)} m² × ${formatNumber(
      intensity
    )} m/hr × ${c}</small></div>`
  );
}

function calcAreaForRunoff() {
  const runoff = getFloat("runoff");
  const intensity = getFloat("intensity");
  if (runoff === null || intensity === null) {
    show(
      "runoffResult",
      "Please enter Runoff volume and Rainfall Intensity to calculate required area.",
      true
    );
    return;
  }
  const coeff = getFloat("coeff") || 1;
  if (intensity === 0) {
    show(
      "runoffResult",
      "Rainfall intensity must be non-zero to calculate area.",
      true
    );
    return;
  }
  const area = runoff / (intensity * coeff);
  document.getElementById("area").value = Number(area.toFixed(6));
  show(
    "runoffResult",
    `<div>Required area ≈ <strong>${formatNumber(
      area
    )} m²</strong><br><small>Computed as ${formatNumber(
      runoff
    )} m³/hr ÷ (${formatNumber(intensity)} m/hr × ${coeff})</small></div>`
  );
}

function calcIntensityFromRunoff() {
  const runoff = getFloat("runoff");
  const area = getFloat("area");
  if (runoff === null || area === null) {
    show(
      "runoffResult",
      "Please enter Runoff volume and Area to calculate rainfall intensity.",
      true
    );
    return;
  }
  const coeff = getFloat("coeff") || 1;
  if (area === 0) {
    show("runoffResult", "Area must be non-zero to calculate intensity.", true);
    return;
  }
  const intensity = runoff / (area * coeff);
  document.getElementById("intensity").value = Number(intensity.toFixed(6));
  show(
    "runoffResult",
    `<div>Intensity ≈ <strong>${formatNumber(
      intensity
    )} m/hr</strong><br><small>Computed as ${formatNumber(
      runoff
    )} m³/hr ÷ (${formatNumber(area)} m² × ${coeff})</small></div>`
  );
}

// --- UI helpers ---
function clearSoilInputs() {
  document.getElementById("flow").value = "";
  document.getElementById("concentration").value = "";
  document.getElementById("massloss").value = "";
  document.getElementById("soilResult").style.display = "none";
}
function clearRunoffInputs() {
  document.getElementById("area").value = "";
  document.getElementById("intensity").value = "";
  document.getElementById("runoff").value = "";
  document.getElementById("coeff").value = "";
  document.getElementById("runoffResult").style.display = "none";
}
function clearAll() {
  clearSoilInputs();
  clearRunoffInputs();
}

function exampleValues() {
  document.getElementById("flow").value = 0.5; // m3/hr
  document.getElementById("concentration").value = 120; // kg/m3
  document.getElementById("massloss").value = "";
  document.getElementById("area").value = 100; // m2
  document.getElementById("intensity").value = 0.01; // m/hr (10 mm/hr)
  document.getElementById("coeff").value = 0.8;
  document.getElementById("soilResult").style.display = "none";
  document.getElementById("runoffResult").style.display = "none";
}

// allow Enter to calculate sensible default action
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    // if focus inside soil inputs, try to calculate mass loss if possible, otherwise concentration
    const active = document.activeElement.id;
    if (["flow", "concentration", "massloss"].includes(active)) calcMassLoss();
    if (["area", "intensity", "runoff", "coeff"].includes(active))
      calcRunoffVolume();
  }
});
