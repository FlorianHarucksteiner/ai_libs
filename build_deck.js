const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaFire, FaLayerGroup, FaCubes, FaBrain, FaBalanceScale, FaBolt,
  FaProjectDiagram, FaImage, FaCheckCircle, FaTimesCircle, FaCog,
  FaChartLine, FaTable, FaThLarge, FaLightbulb, FaCode, FaArrowRight,
  FaDatabase, FaRobot, FaServer
} = require("react-icons/fa");

// ---------- Palette (tech / deep-learning) ----------
const NAVY   = "0E1633";  // background dark
const NAVY2  = "1A2348";  // panel dark
const INK    = "1B2333";  // body text on light
const SLATE  = "5B6B86";  // muted
const TEAL   = "13B5A6";  // accent primary
const MINT   = "5EEAD4";  // accent light
const AMBER  = "F4A23C";  // accent secondary (PyTorch-ish)
const CORAL  = "EF5E6B";  // accent tertiary (Keras red-ish)
const ICE    = "CFE3FF";  // light blue text on dark
const LIGHT  = "F4F7FB";  // light bg
const WHITE  = "FFFFFF";
const CARD   = "FFFFFF";

const HFONT = "Trebuchet MS";
const BFONT = "Calibri";

async function iconPng(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

const makeShadow = () => ({ type: "outer", color: "0A0F22", blur: 9, offset: 3, angle: 90, opacity: 0.18 });

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
const PW = 13.3, PH = 7.5;
pres.author = "Florian Harucksteiner";
pres.title = "Deep-Learning-Frameworks im Vergleich";

// helper: section header for light slides
function lightHeader(slide, kicker, title, icons) {
  slide.background = { color: LIGHT };
  slide.addText(kicker.toUpperCase(), {
    x: 0.7, y: 0.45, w: 10, h: 0.3, fontFace: BFONT, fontSize: 12,
    color: TEAL, bold: true, charSpacing: 3, margin: 0,
  });
  slide.addText(title, {
    x: 0.7, y: 0.74, w: 11.9, h: 0.7, fontFace: HFONT, fontSize: 30,
    color: INK, bold: true, margin: 0,
  });
}

(async () => {
  // Pre-render icons
  const ic = {
    fire:   await iconPng(FaFire, "#" + AMBER),
    layers: await iconPng(FaLayerGroup, "#" + TEAL),
    cubes:  await iconPng(FaCubes, "#" + CORAL),
    brain:  await iconPng(FaBrain, "#" + MINT),
    scale:  await iconPng(FaBalanceScale, "#" + MINT),
    bolt:   await iconPng(FaBolt, "#" + MINT),
    proj:   await iconPng(FaProjectDiagram, "#" + MINT),
    img:    await iconPng(FaImage, "#" + MINT),
    db:     await iconPng(FaDatabase, "#" + MINT),
    check:  await iconPng(FaCheckCircle, "#" + TEAL),
    cross:  await iconPng(FaTimesCircle, "#" + CORAL),
    cog:    await iconPng(FaCog, "#" + TEAL),
    chart:  await iconPng(FaChartLine, "#" + TEAL),
    table:  await iconPng(FaTable, "#" + TEAL),
    grid:   await iconPng(FaThLarge, "#" + TEAL),
    bulb:   await iconPng(FaLightbulb, "#" + AMBER),
    code:   await iconPng(FaCode, "#" + TEAL),
    arrow:  await iconPng(FaArrowRight, "#" + TEAL),
    robot:  await iconPng(FaRobot, "#" + MINT),
    server: await iconPng(FaServer, "#" + MINT),
    checkW: await iconPng(FaCheckCircle, "#" + MINT),
  };

  // ============ SLIDE 1: TITLE ============
  {
    const s = pres.addSlide();
    s.background = { color: NAVY };
    // decorative dots grid (neuron-ish) on right
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 4; c++) {
        const col = [TEAL, MINT, AMBER, CORAL][(r + c) % 4];
        s.addShape(pres.shapes.OVAL, {
          x: 9.7 + c * 0.85, y: 1.0 + r * 1.0, w: 0.16, h: 0.16,
          fill: { color: col, transparency: 35 }, line: { type: "none" },
        });
      }
    }
    // connecting lines (subtle)
    s.addShape(pres.shapes.LINE, { x: 9.86, y: 1.08, w: 2.55, h: 3.0, line: { color: TEAL, width: 0.75, transparency: 70 }, flipV: true });
    s.addShape(pres.shapes.LINE, { x: 9.86, y: 1.08, w: 2.55, h: 3.0, line: { color: AMBER, width: 0.75, transparency: 70 } });

    s.addText("DEEP LEARNING · FRAMEWORK-ANALYSE", {
      x: 0.8, y: 1.55, w: 9, h: 0.4, fontFace: BFONT, fontSize: 14,
      color: MINT, bold: true, charSpacing: 4, margin: 0,
    });
    s.addText("Deep-Learning-Frameworks\nim Vergleich", {
      x: 0.8, y: 2.0, w: 9, h: 1.8, fontFace: HFONT, fontSize: 46,
      color: WHITE, bold: true, lineSpacingMultiple: 1.0, margin: 0,
    });
    s.addText([
      { text: "PyTorch", options: { color: AMBER, bold: true } },
      { text: "   ·   ", options: { color: SLATE } },
      { text: "TensorFlow", options: { color: TEAL, bold: true } },
      { text: "   ·   ", options: { color: SLATE } },
      { text: "Keras", options: { color: CORAL, bold: true } },
    ], { x: 0.8, y: 3.95, w: 9, h: 0.5, fontFace: HFONT, fontSize: 22, margin: 0 });
    s.addText("MNIST  ·  Fashion-MNIST  ·  CIFAR-10  —  Aufbau, Abstraktion & Ergebnisse", {
      x: 0.8, y: 4.55, w: 9, h: 0.4, fontFace: BFONT, fontSize: 15, color: ICE, margin: 0,
    });
    s.addShape(pres.shapes.LINE, { x: 0.82, y: 5.25, w: 3.2, h: 0, line: { color: TEAL, width: 2 } });
    s.addText("Florian Harucksteiner  ·  4AHITS  ·  SWE-Abschlussprojekt", {
      x: 0.8, y: 5.45, w: 9, h: 0.4, fontFace: BFONT, fontSize: 13, color: SLATE, margin: 0,
    });
  }

  // ============ SLIDE 2: AGENDA ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Überblick", "Worum es geht");
    const items = [
      [ic.brain, "Grundbegriffe", "Tensor, Optimizer, Loss, Epoche, Batch-Size, Accuracy"],
      [ic.cubes, "Die drei Frameworks", "PyTorch, TensorFlow & Keras im direkten Vergleich"],
      [ic.code, "Abstraktionsebenen", "Manuelle Trainingsschleife vs. fit() / evaluate()"],
      [ic.table, "Fashion-MNIST", "Gleiche Architektur, drei Frameworks — Accuracy ~87 %"],
      [ic.grid, "CIFAR-10 & CNNs", "Warum Faltungsnetze Farbbilder besser lösen"],
      [ic.bulb, "Erkenntnisse", "Grenzen der Modelle & Verbesserungsansätze"],
    ];
    const cw = 5.75, ch = 1.42, gx = 0.7, gy = 1.7;
    items.forEach((it, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = gx + col * (cw + 0.4), y = gy + row * (ch + 0.28);
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.09, h: ch, fill: { color: TEAL }, line: { type: "none" } });
      // icon in circle
      s.addShape(pres.shapes.OVAL, { x: x + 0.38, y: y + (ch - 0.82) / 2, w: 0.82, h: 0.82, fill: { color: "E5F6F3" }, line: { type: "none" } });
      s.addImage({ data: it[0], x: x + 0.59, y: y + (ch - 0.82) / 2 + 0.21, w: 0.4, h: 0.4 });
      // faint number top-right
      s.addText(String(i + 1).padStart(2, "0"), { x: x + cw - 1.15, y: y + 0.12, w: 1.0, h: 0.6, fontFace: HFONT, fontSize: 26, color: "EAF0F7", bold: true, align: "right", valign: "top", margin: 0 });
      s.addText(it[1], { x: x + 1.45, y: y + 0.32, w: cw - 2.5, h: 0.4, fontFace: HFONT, fontSize: 17, color: INK, bold: true, margin: 0 });
      s.addText(it[2], { x: x + 1.45, y: y + 0.74, w: cw - 1.7, h: 0.55, fontFace: BFONT, fontSize: 12.5, color: SLATE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 3: GRUNDBEGRIFFE ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Grundlagen", "Die wichtigsten Begriffe");
    const terms = [
      [ic.cubes, "Tensor", "Zentrale, beliebig-dimensionale Datenstruktur, in der die Frameworks rechnen."],
      [ic.cog, "Optimizer", "Algorithmus, der den Loss minimiert (z. B. Adam, SGD)."],
      [ic.scale, "Loss-Funktion", "Misst, wie falsch die Vorhersage ist — wird minimiert."],
      [ic.proj, "Epoche", "Ein vollständiger Durchlauf durch den gesamten Trainingsdatensatz."],
      [ic.layers, "Batch-Size", "Anzahl der Trainingsbeispiele, die in einem Schritt zusammengefasst werden."],
      [ic.chart, "Accuracy", "Anteil korrekter Vorhersagen auf ungesehenen Testdaten."],
    ];
    const cw = 3.78, ch = 1.95, gx = 0.7, gy = 1.65;
    terms.forEach((t, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = gx + col * (cw + 0.33), y = gy + row * (ch + 0.32);
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.OVAL, { x: x + 0.32, y: y + 0.32, w: 0.7, h: 0.7, fill: { color: "E5F6F3" }, line: { type: "none" } });
      s.addImage({ data: t[0], x: x + 0.48, y: y + 0.48, w: 0.38, h: 0.38 });
      s.addText(t[1], { x: x + 0.32, y: y + 1.12, w: cw - 0.6, h: 0.38, fontFace: HFONT, fontSize: 18, color: INK, bold: true, margin: 0 });
      s.addText(t[2], { x: x + 0.32, y: y + 1.5, w: cw - 0.55, h: 0.42, fontFace: BFONT, fontSize: 11.5, color: SLATE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 4: THREE FRAMEWORKS ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Die Werkzeuge", "Drei Frameworks, ein Ökosystem");
    const cols = [
      { name: "PyTorch", color: AMBER, tint: "FDEFD9", icon: ic.fire,
        tag: "Low-Level Framework",
        pts: ["Entwicklung von Neural-Nets mit Tensoren", "Explizite, sichtbare Trainingsschleife", "Volle Kontrolle über jeden Schritt"] },
      { name: "TensorFlow", color: TEAL, tint: "DAF3F0", icon: ic.layers,
        tag: "Umfassendes Framework",
        pts: ["Open-Source-Framework für Machine Learning", "Stellt Tensoren & Low-Level-Funktionen bereit", "Basis, auf der Keras aufsetzt"] },
      { name: "Keras", color: CORAL, tint: "FBE0E2", icon: ic.cubes,
        tag: "High-Level API",
        pts: ["Entwicklerfreundliche Schicht über TensorFlow", "Modelle aus fertigen Bausteinen", "Sehr kompakter Code"] },
    ];
    const cw = 3.85, gx = 0.72, gy = 1.7, ch = 4.55;
    cols.forEach((c, i) => {
      const x = gx + i * (cw + 0.35);
      s.addShape(pres.shapes.RECTANGLE, { x, y: gy, w: cw, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y: gy, w: cw, h: 0.14, fill: { color: c.color }, line: { type: "none" } });
      s.addShape(pres.shapes.OVAL, { x: x + 0.4, y: gy + 0.45, w: 0.95, h: 0.95, fill: { color: c.tint }, line: { type: "none" } });
      s.addImage({ data: c.icon, x: x + 0.64, y: gy + 0.69, w: 0.47, h: 0.47 });
      s.addText(c.name, { x: x + 0.4, y: gy + 1.55, w: cw - 0.8, h: 0.45, fontFace: HFONT, fontSize: 23, color: INK, bold: true, margin: 0 });
      s.addText(c.tag.toUpperCase(), { x: x + 0.4, y: gy + 2.0, w: cw - 0.8, h: 0.3, fontFace: BFONT, fontSize: 11, color: c.color, bold: true, charSpacing: 2, margin: 0 });
      s.addText(c.pts.map((p, k) => ({ text: p, options: { bullet: { code: "2022", indent: 14 }, breakLine: true, paraSpaceAfter: 8 } })),
        { x: x + 0.4, y: gy + 2.5, w: cw - 0.7, h: 1.9, fontFace: BFONT, fontSize: 12.5, color: "3C485C", margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 5: PYTORCH MNIST ANATOMY ============
  {
    const s = pres.addSlide();
    lightHeader(s, "PyTorch im Detail", "Anatomie des MNIST-Modells");
    // left: code-style panel
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.7, w: 5.65, h: 4.55, fill: { color: NAVY }, line: { type: "none" }, shadow: makeShadow() });
    s.addText("model.py", { x: 0.95, y: 1.9, w: 5, h: 0.3, fontFace: "Consolas", fontSize: 12, color: SLATE, margin: 0 });
    s.addText([
      { text: "class ", options: { color: CORAL } },
      { text: "NeuralNet", options: { color: MINT } },
      { text: "(nn.Module):", options: { color: ICE, breakLine: true } },
      { text: "    flatten = nn.Flatten()", options: { color: ICE, breakLine: true } },
      { text: "    fc1 = nn.Linear(28*28, 128)", options: { color: ICE, breakLine: true } },
      { text: "    relu = nn.ReLU()", options: { color: ICE, breakLine: true } },
      { text: "    fc2 = nn.Linear(128, 10)", options: { color: ICE, breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "outputs = model(images)", options: { color: AMBER, breakLine: true } },
      { text: "loss = criterion(outputs, labels)", options: { color: AMBER, breakLine: true } },
      { text: "optimizer.zero_grad()", options: { color: WHITE, breakLine: true } },
      { text: "loss.backward()", options: { color: WHITE, breakLine: true } },
      { text: "optimizer.step()", options: { color: WHITE } },
    ], { x: 0.95, y: 2.25, w: 5.2, h: 3.9, fontFace: "Consolas", fontSize: 13, paraSpaceAfter: 4, margin: 0, valign: "top" });

    // right: 4 mapped explanations
    const steps = [
      ["Modell-Definition", "Klasse erbt von nn.Module; Schichten in __init__, Datenfluss in forward()."],
      ["Forward Pass", "outputs = model(images) ruft intern forward() auf."],
      ["Loss-Berechnung", "criterion = nn.CrossEntropyLoss() vergleicht Vorhersage & Label."],
      ["Gewichts-Update", "backward() bildet Gradienten, optimizer.step() passt Gewichte an."],
    ];
    const rx = 6.7, rw = 5.9, rh = 1.0, ry = 1.7;
    steps.forEach((st, i) => {
      const y = ry + i * (rh + 0.16);
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: rw, h: rh, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.OVAL, { x: rx + 0.25, y: y + 0.26, w: 0.48, h: 0.48, fill: { color: TEAL }, line: { type: "none" } });
      s.addText(String(i + 1), { x: rx + 0.25, y: y + 0.26, w: 0.48, h: 0.48, fontFace: HFONT, fontSize: 17, color: WHITE, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(st[0], { x: rx + 0.95, y: y + 0.15, w: rw - 1.2, h: 0.34, fontFace: HFONT, fontSize: 15.5, color: INK, bold: true, margin: 0 });
      s.addText(st[1], { x: rx + 0.95, y: y + 0.49, w: rw - 1.2, h: 0.46, fontFace: BFONT, fontSize: 11.5, color: SLATE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 6: NUMPY VS PYTORCH ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Was nimmt das Framework ab?", "Selbst programmieren vs. PyTorch");
    const colW = 5.85, gy = 1.75, ch = 4.5;
    // left: NumPy (manual)
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: gy, w: colW, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: gy, w: colW, h: 0.62, fill: { color: "FBE0E2" }, line: { type: "none" } });
    s.addImage({ data: ic.cross, x: 0.92, y: gy + 0.16, w: 0.32, h: 0.32 });
    s.addText("Reine NumPy-Implementierung", { x: 1.32, y: gy + 0.13, w: colW - 0.8, h: 0.38, fontFace: HFONT, fontSize: 15.5, color: "8A2A33", bold: true, margin: 0 });
    s.addText([
      "Forward Pass: Matrixmultiplikation + Bias manuell",
      "Backpropagation: Ableitungen & Kettenregel selbst",
      "Update-Logik: W = W − lr · dW",
      "Aktivierungen (ReLU, Softmax) + ihre Ableitungen",
      "Loss-Formel (Cross-Entropy) + Ableitung",
      "Batching: Daten selbst auswählen & iterieren",
    ].map(t => ({ text: t, options: { bullet: { code: "2022", indent: 16 }, breakLine: true, paraSpaceAfter: 9, color: CORAL } })),
      { x: 0.95, y: gy + 0.85, w: colW - 0.55, h: 3.5, fontFace: BFONT, fontSize: 13, color: "3C485C", margin: 0, valign: "top" });

    // right: PyTorch (automatic)
    const rx = 6.75;
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: gy, w: colW, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: gy, w: colW, h: 0.62, fill: { color: "DAF3F0" }, line: { type: "none" } });
    s.addImage({ data: ic.check, x: rx + 0.22, y: gy + 0.16, w: 0.32, h: 0.32 });
    s.addText("Das übernimmt PyTorch", { x: rx + 0.62, y: gy + 0.13, w: colW - 0.8, h: 0.38, fontFace: HFONT, fontSize: 15.5, color: "0C6E64", bold: true, margin: 0 });
    s.addText([
      "Autograd: Gradienten automatisch via loss.backward()",
      "Fertige Layer & Funktionen (nn.Linear, nn.ReLU)",
      "Loss-Funktionen (nn.CrossEntropyLoss)",
      "Optimizer (Adam, SGD) über optimizer.step()",
      "Datenpipeline: DataLoader, Shuffling, Transforms",
      "GPU-Beschleunigung mit to(device)",
    ].map(t => ({ text: t, options: { bullet: { code: "2022", indent: 16 }, breakLine: true, paraSpaceAfter: 9, color: TEAL } })),
      { x: rx + 0.25, y: gy + 0.85, w: colW - 0.55, h: 3.5, fontFace: BFONT, fontSize: 13, color: "3C485C", margin: 0, valign: "top" });
  }

  // ============ SLIDE 7: TENSORFLOW / KERAS HIGH-LEVEL ============
  {
    const s = pres.addSlide();
    lightHeader(s, "TensorFlow & Keras", "Drei Methoden statt einer Schleife");
    const cards = [
      [ic.layers, "compile()", "Konfiguriert das Training: Optimizer, Loss-Funktion und Metriken (z. B. accuracy) werden festgelegt."],
      [ic.cog, "fit()", "Führt das komplette Training aus — Batch-Iteration, Forward Pass, Loss, Backprop und Updates in einem Aufruf."],
      [ic.chart, "evaluate()", "Testet das fertige Modell auf ungesehenen Daten: reiner Forward Pass, berechnet Loss & Accuracy."],
    ];
    const cw = 3.85, gx = 0.72, gy = 1.75, ch = 2.95;
    cards.forEach((c, i) => {
      const x = gx + i * (cw + 0.35);
      s.addShape(pres.shapes.RECTANGLE, { x, y: gy, w: cw, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: gy + 0.38, w: 0.78, h: 0.78, fill: { color: "E5F6F3" }, line: { type: "none" } });
      s.addImage({ data: c[0], x: x + 0.54, y: gy + 0.57, w: 0.4, h: 0.4 });
      s.addText(c[1], { x: x + 0.35, y: gy + 1.3, w: cw - 0.7, h: 0.42, fontFace: "Consolas", fontSize: 20, color: TEAL, bold: true, margin: 0 });
      s.addText(c[2], { x: x + 0.35, y: gy + 1.78, w: cw - 0.6, h: 1.0, fontFace: BFONT, fontSize: 12.5, color: SLATE, margin: 0, valign: "top" });
    });
    // bottom takeaway band
    s.addShape(pres.shapes.RECTANGLE, { x: 0.72, y: 5.05, w: 11.86, h: 1.15, fill: { color: NAVY }, line: { type: "none" }, shadow: makeShadow() });
    s.addImage({ data: ic.bulb, x: 1.05, y: 5.42, w: 0.45, h: 0.45 });
    s.addText([
      { text: "Kürzer, aber weniger sichtbar.  ", options: { color: MINT, bold: true } },
      { text: "fit() verbirgt Data-Loop, Forward Pass, zero_grad(), backward(), step() und die Trennung train/eval — in PyTorch alles explizit.", options: { color: ICE } },
    ], { x: 1.7, y: 5.2, w: 10.6, h: 0.85, fontFace: BFONT, fontSize: 14, valign: "middle", margin: 0 });
  }

  // ============ SLIDE 8: FASHION-MNIST RESULTS ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Teil 5 · Fashion-MNIST", "Gleiche Architektur, drei Frameworks");
    // chart
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.7, w: 6.3, h: 4.5, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
    s.addText("Test-Accuracy (%) · 1 Hidden Layer, 128 Units, 5 Epochen, Adam", { x: 0.95, y: 1.9, w: 5.9, h: 0.5, fontFace: BFONT, fontSize: 12.5, color: SLATE, margin: 0 });
    s.addChart(pres.charts.BAR, [{
      name: "Accuracy", labels: ["PyTorch", "TensorFlow", "Keras"], values: [87.5, 87.2, 87.6],
    }], {
      x: 0.85, y: 2.45, w: 6.0, h: 3.55, barDir: "col",
      chartColors: [AMBER, TEAL, CORAL], chartArea: { fill: { color: "FFFFFF" } },
      valAxisMinVal: 80, valAxisMaxVal: 90, valAxisMajorUnit: 2,
      catAxisLabelColor: INK, catAxisLabelFontSize: 12, catAxisLabelFontBold: true,
      valAxisLabelColor: SLATE, valAxisLabelFontSize: 10,
      valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
      showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontBold: true, dataLabelFontSize: 12, dataLabelFormatCode: "0.0",
      showLegend: false, showTitle: false, barGapWidthPct: 60,
    });
    // right: key findings
    const rx = 7.3;
    const facts = [
      ["Schwieriger als MNIST", "Kleidungsstücke haben subtilere Merkmale als klare Ziffern."],
      ["Accuracy sinkt", "Statt >97 % (MNIST) nur ~85–88 %."],
      ["Verwechslungen", "T-Shirt ↔ Pullover ↔ Shirt; Coat ↔ Pullover."],
      ["Ursache", "Flatten ignoriert die 2D-Struktur des Bildes."],
    ];
    const rw = 5.3, rh = 1.0, ry = 1.7;
    facts.forEach((f, i) => {
      const y = ry + i * (rh + 0.16);
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: rw, h: rh, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: 0.09, h: rh, fill: { color: CORAL }, line: { type: "none" } });
      s.addText(f[0], { x: rx + 0.32, y: y + 0.15, w: rw - 0.6, h: 0.34, fontFace: HFONT, fontSize: 15, color: INK, bold: true, margin: 0 });
      s.addText(f[1], { x: rx + 0.32, y: y + 0.49, w: rw - 0.55, h: 0.46, fontFace: BFONT, fontSize: 12, color: SLATE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 9: CIFAR-10 RESULTS ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Teil 6 · CIFAR-10", "Farbbilder mit kleinen CNNs");
    s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.7, w: 6.3, h: 4.5, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
    s.addText("Test-Accuracy (%) · CNN, 2 Conv-Lagen, 10 Epochen, Batch 64, Adam", { x: 0.95, y: 1.9, w: 5.9, h: 0.5, fontFace: BFONT, fontSize: 12.5, color: SLATE, margin: 0 });
    s.addChart(pres.charts.BAR, [{
      name: "Accuracy", labels: ["PyTorch", "TensorFlow", "Keras"], values: [72.08, 71.49, 69.39],
    }], {
      x: 0.85, y: 2.45, w: 6.0, h: 3.55, barDir: "col",
      chartColors: [AMBER, TEAL, CORAL], chartArea: { fill: { color: "FFFFFF" } },
      valAxisMinVal: 60, valAxisMaxVal: 80, valAxisMajorUnit: 5,
      catAxisLabelColor: INK, catAxisLabelFontSize: 12, catAxisLabelFontBold: true,
      valAxisLabelColor: SLATE, valAxisLabelFontSize: 10,
      valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" },
      showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontBold: true, dataLabelFontSize: 12, dataLabelFormatCode: "0.0",
      showLegend: false, showTitle: false, barGapWidthPct: 60,
    });
    const rx = 7.3;
    const facts = [
      ["Echte Fotos", "Hintergrund, Beleuchtung, Pose — große Varianz je Klasse."],
      ["3072 statt 784 Werte", "32×32×3 (RGB) ist fast 4× größer als ein MNIST-Bild."],
      ["~65–75 % erreicht", "Solide Lernübung, aber weit von SoTA (>95 %)."],
      ["3 Kanäle = mehr Aufwand", "Mehr Parameter, Rechenzeit & Speicher als bei Graustufen."],
    ];
    const rw = 5.3, rh = 1.0, ry = 1.7;
    facts.forEach((f, i) => {
      const y = ry + i * (rh + 0.16);
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: rw, h: rh, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x: rx, y, w: 0.09, h: rh, fill: { color: TEAL }, line: { type: "none" } });
      s.addText(f[0], { x: rx + 0.32, y: y + 0.15, w: rw - 0.6, h: 0.34, fontFace: HFONT, fontSize: 15, color: INK, bold: true, margin: 0 });
      s.addText(f[1], { x: rx + 0.32, y: y + 0.49, w: rw - 0.55, h: 0.46, fontFace: BFONT, fontSize: 12, color: SLATE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 10: WHY CNNs ============
  {
    const s = pres.addSlide();
    s.background = { color: NAVY };
    s.addText("WARUM CNNS?", { x: 0.8, y: 0.65, w: 8, h: 0.35, fontFace: BFONT, fontSize: 13, color: MINT, bold: true, charSpacing: 4, margin: 0 });
    s.addText("Warum Faltungsnetze Bilder besser lösen", { x: 0.8, y: 1.0, w: 11.5, h: 0.7, fontFace: HFONT, fontSize: 30, color: WHITE, bold: true, margin: 0 });
    const items = [
      [ic.grid, "Räumliche Struktur", "Faltungen betrachten lokale Bildausschnitte und erkennen Kanten, Ecken & Muster — Dense-Netze sehen jeden Pixel isoliert."],
      [ic.layers, "Parameter-Sharing", "Ein Filter gleitet über das ganze Bild, statt für jede Position eigene Gewichte zu lernen — drastisch weniger Parameter."],
      [ic.arrow, "Translationsinvarianz", "Ein Objekt wird erkannt, egal an welcher Stelle im Bild es sich befindet."],
      [ic.proj, "Hierarchie", "Frühe Schichten lernen einfache Kanten, spätere zunehmend komplexe Formen."],
    ];
    const cw = 5.8, ch = 2.0, gx = 0.8, gy = 2.05;
    items.forEach((it, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = gx + col * (cw + 0.4), y = gy + row * (ch + 0.3);
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: NAVY2 }, line: { color: "2A3766", width: 1 } });
      s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.35, w: 0.78, h: 0.78, fill: { color: "11204A" }, line: { type: "none" } });
      s.addImage({ data: it[0], x: x + 0.54, y: y + 0.54, w: 0.4, h: 0.4 });
      s.addText(it[1], { x: x + 1.35, y: y + 0.36, w: cw - 1.6, h: 0.4, fontFace: HFONT, fontSize: 18, color: WHITE, bold: true, margin: 0 });
      s.addText(it[2], { x: x + 1.35, y: y + 0.82, w: cw - 1.6, h: 1.0, fontFace: BFONT, fontSize: 12.5, color: ICE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 11: IMPROVEMENTS ============
  {
    const s = pres.addSlide();
    lightHeader(s, "Ausblick", "Wie ließe sich mehr herausholen?");
    const ideas = [
      [ic.grid, "CNNs einsetzen", "Conv2D + Pooling erhalten die 2D-Struktur → bei Fashion-MNIST sofort >90 %."],
      [ic.layers, "Tiefere Netze", "Mehr Conv-Schichten & Neuronen — skaliert besser als reine Dense-Netze."],
      [ic.scale, "Regularisierung", "Dropout & Batch-Normalization gegen Overfitting, bessere Generalisierung."],
      [ic.cubes, "Data Augmentation", "Spiegeln, Verschieben, Zuschneiden macht das Modell robuster."],
      [ic.cog, "LR-Scheduling", "Lernrate über die Zeit absenken; Training mit Early Stopping."],
      [ic.robot, "Transfer Learning", "Vortrainiertes Netz (z. B. ResNet) als Basis nutzen."],
    ];
    const cw = 3.78, ch = 1.95, gx = 0.7, gy = 1.65;
    ideas.forEach((t, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = gx + col * (cw + 0.33), y = gy + row * (ch + 0.32);
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: CARD }, line: { type: "none" }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.1, fill: { color: TEAL }, line: { type: "none" } });
      s.addShape(pres.shapes.OVAL, { x: x + 0.32, y: y + 0.36, w: 0.66, h: 0.66, fill: { color: "E5F6F3" }, line: { type: "none" } });
      s.addImage({ data: t[0], x: x + 0.47, y: y + 0.51, w: 0.36, h: 0.36 });
      s.addText(t[1], { x: x + 1.12, y: y + 0.42, w: cw - 1.3, h: 0.5, fontFace: HFONT, fontSize: 16, color: INK, bold: true, margin: 0, valign: "middle" });
      s.addText(t[2], { x: x + 0.32, y: y + 1.12, w: cw - 0.55, h: 0.75, fontFace: BFONT, fontSize: 11.5, color: SLATE, margin: 0, valign: "top" });
    });
  }

  // ============ SLIDE 12: CONCLUSION ============
  {
    const s = pres.addSlide();
    s.background = { color: NAVY };
    s.addText("FAZIT", { x: 0.8, y: 0.85, w: 8, h: 0.35, fontFace: BFONT, fontSize: 13, color: MINT, bold: true, charSpacing: 4, margin: 0 });
    s.addText("Was die Analyse zeigt", { x: 0.8, y: 1.2, w: 11.5, h: 0.7, fontFace: HFONT, fontSize: 32, color: WHITE, bold: true, margin: 0 });

    const takeaways = [
      [ic.code, "Abstraktion ist ein Trade-off", "PyTorch zeigt jeden Schritt und gibt Kontrolle; Keras/TF kapseln alles in fit() — kürzer, aber undurchsichtiger."],
      [ic.checkW, "Gleiche Architektur, gleiche Leistung", "Alle drei Frameworks liefern nahezu identische Accuracy (~87 % Fashion-MNIST, ~70 % CIFAR-10) — die Wahl ist Geschmackssache."],
      [ic.grid, "Die Architektur entscheidet", "Nicht das Framework, sondern der Modelltyp zählt: CNNs schlagen Dense-Netze bei Bildern deutlich."],
    ];
    const y0 = 2.35, rh = 1.25;
    takeaways.forEach((t, i) => {
      const y = y0 + i * (rh + 0.2);
      s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 11.7, h: rh, fill: { color: NAVY2 }, line: { color: "2A3766", width: 1 } });
      s.addShape(pres.shapes.OVAL, { x: 1.15, y: y + 0.3, w: 0.66, h: 0.66, fill: { color: "11204A" }, line: { type: "none" } });
      s.addImage({ data: t[0], x: 1.3, y: y + 0.45, w: 0.36, h: 0.36 });
      s.addText(t[1], { x: 2.1, y: y + 0.2, w: 10.1, h: 0.42, fontFace: HFONT, fontSize: 18, color: WHITE, bold: true, margin: 0 });
      s.addText(t[2], { x: 2.1, y: y + 0.62, w: 10.1, h: 0.55, fontFace: BFONT, fontSize: 13, color: ICE, margin: 0, valign: "top" });
    });
    s.addText("Danke für die Aufmerksamkeit.", { x: 0.8, y: 6.85, w: 11, h: 0.4, fontFace: HFONT, fontSize: 15, color: MINT, italic: true, bold: true, margin: 0 });
  }

  await pres.writeFile({ fileName: "C:/code/ai_libs/ai_libs/DL-Frameworks-Vergleich.pptx" });
  console.log("written");
})();
