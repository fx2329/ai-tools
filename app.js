/* ---- AI Tool Suite - All tools JS ---- */

/* ---- Router ---- */
const TOOLS = {
  home: { title: "AI Tool Suite", render: renderHome },
  summarizer: { title: "Summarizer", render: renderSummarizer },
  grammar: { title: "Grammar", render: renderGrammar },
  keywords: { title: "Keywords", render: renderKeywords },
  readability: { title: "Readability", render: renderReadability },
  wordcloud: { title: "Word Cloud", render: renderWordCloud },
  password: { title: "Password", render: renderPassword },
  unit: { title: "Converter", render: renderUnit },
  percentage: { title: "Percentage", render: renderPercentage },
};

function showHome() { TOOLS.home.render(document.getElementById("app")); }
function showTool(id) { TOOLS[id].render(document.getElementById("app")); }
document.addEventListener("DOMContentLoaded", showHome);

/* ---- Home ---- */
function renderHome(el) {
  el.innerHTML =
    '<div class="hero"><h1>Free Smart Online Tools</h1><p>AI-powered tools in your browser. No signups, private.</p></div>' +
    '<div class="grid">' +
    card("summarizer", "T", "rgba(59,130,246,.15)", "#60a5fa", "Text Summarizer", "Extract key sentences from any text") +
    card("grammar", "Aa", "rgba(34,197,94,.15)", "#4ade80", "Grammar Checker", "Find common grammar issues") +
    card("keywords", "#", "rgba(168,85,247,.15)", "#a78bfa", "Keyword Analyzer", "Word frequency and density") +
    card("readability", "Aa", "rgba(236,72,153,.15)", "#f472b6", "Readability Scorer", "Flesch-Kincaid metrics") +
    card("wordcloud", "W", "rgba(251,191,36,.15)", "#fbbf24", "Word Cloud", "Visualize word frequency") +
    card("password", "P", "rgba(239,68,68,.15)", "#ef4444", "Password Checker", "Strength analysis" ) +
    card("unit", "U", "rgba(14,165,233,.15)", "#38bdf8", "Unit Converter", "Length, weight, temperature") +
    card("percentage", "%", "rgba(250,204,21,.15)", "#facc15", "Percentage Calc", "Quick calculations and tips") +
    "</div>";
}

function card(id, icon, bg, color, title, desc) {
  return '<div class="card" onclick="showTool(\'' + id + '\')"><div class="card-icon" style="background:' + bg + ';color:' + color + '">' + icon + '</div><h2>' + title + '</h2><p>' + desc + '</p></div>';
}

/* ---- Back button helper ---- */
function backBtn() { return '<button class="back-btn" onclick="showHome()">&#8592; All Tools</button>'; }
function toolWrap(h2, desc, body) {
  return '<div class="tool-page">' + backBtn() + '<h2>' + h2 + '</h2><p style="font-size:12px;color:#64748b;margin-bottom:10px">' + desc + '</p>' + body + '</div>';
}

/* ---- Text Summarizer ---- */
function renderSummarizer(el) {
  el.innerHTML = toolWrap("Text Summarizer", "Extractive summarization - picks the most important sentences.",
    '<textarea id="sum-input" placeholder="Paste text here..." rows="8"></textarea>' +
    '<div style="display:flex;gap:8px;align-items:center;margin:10px 0"><span style="font-size:12px;color:#64748b">Length:</span><input type="range" id="sum-ratio" min="1" max="5" value="3" style="accent-color:#3b82f6;flex:1"><span id="sum-label" style="font-size:12px;color:#94a3b8">Medium</span></div>' +
    '<button class="btn btn-primary" onclick="doSummarize()">Summarize</button>' +
    '<div id="sum-result" class="result" style="display:none"></div>');
  document.getElementById("sum-ratio").oninput = function(e) {
    document.getElementById("sum-label").textContent = ["Very Short","Short","Medium","Long","Full"][e.target.value-1];
  };
}

function doSummarize() {
  var t = document.getElementById("sum-input").value;
  var r = [0.1, 0.2, 0.3, 0.5, 0.8][document.getElementById("sum-ratio").value - 1];
  var e = document.getElementById("sum-result");
  if (!t.trim()) { e.style.display = "block"; e.innerHTML = "Enter text."; return; }
  var s = t.match(/[^.!?]+[.!?]+/g) || [t];
  if (s.length <= 2) { e.style.display = "block"; e.textContent = t; return; }
  var words = t.toLowerCase().match(/\b\w+\b/g) || [];
  var freq = {};
  words.forEach(function(w) { if (w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  s.forEach(function(x, i) {
    var sw = x.toLowerCase().match(/\b\w+\b/g) || [];
    s[i] = { text: x.trim(), score: sw.reduce(function(a, b) { return a + (freq[b] || 0); }, 0) / Math.max(1, sw.length) };
  });
  s.sort(function(a, b) { return b.score - a.score; });
  var c = Math.max(1, Math.floor(s.length * r));
  var sel = s.slice(0, c);
  sel.sort(function(a, b) { return t.indexOf(a.text) - t.indexOf(b.text); });
  e.style.display = "block";
  e.innerHTML = "<strong>Summary (" + c + " sentences):</strong><br><br>" + sel.map(function(x) { return x.text; }).join(" ") +
    "<br><br><span style=font-size:10px;color:#475569>Original: " + t.split(/[.!?]+/).filter(Boolean).length + " sentences to " + c + " (" + Math.round(r * 100) + "%)</span>";
}

/* ---- Grammar Checker ---- */
function renderGrammar(el) {
  el.innerHTML = toolWrap("Grammar Checker", "Checks common English grammar patterns.",
    '<textarea id="gram-input" placeholder="Type text to check..." rows="8"></textarea>' +
    '<button class="btn btn-primary" style="margin-top:10px" onclick="doGrammar()">Check</button>' +
    '<div id="gram-result" class="result" style="display:none"></div>');
}

function doGrammar() {
  var t = document.getElementById("gram-input").value;
  var e = document.getElementById("gram-result");
  if (!t.trim()) { e.style.display = "block"; e.innerHTML = "Enter text."; return; }
  var checks = [
    { re: /\bi am\b/gi, fix: "I am" },
    { re: /\bdont\b/gi, fix: "don't" },
    { re: /\bcant\b/gi, fix: "can't" },
    { re: /\bwont\b/gi, fix: "won't" },
    { re: /\b(its)\s+(a|the|my|your|his|her|our|their|very|not|going|been|really)/gi, fix: "it's" },
    { re: /\b(your)\s+(going|welcome|right|wrong|not|very|really)/gi, fix: "you're" },
    { re: /\b(their)\s+(going|coming|not|very|really|been)\b/gi, fix: "they're" },
    { re: /\bwould of\b/gi, fix: "would have" },
    { re: /\bcould of\b/gi, fix: "could have" },
    { re: /\bshould of\b/gi, fix: "should have" },
    { re: /\s{2,}/g, fix: " " },
  ];
  var issues = [];
  checks.forEach(function(c) {
    var m, re = new RegExp(c.re.source, c.re.flags);
    while ((m = re.exec(t)) !== null) {
      issues.push({ text: m[0], fix: c.fix.replace(/\$(\d)/g, function(_, n) { return m[n] || ""; }), idx: m.index });
      if (!c.re.flags.includes("g")) break;
    }
  });
  e.style.display = "block";
  if (issues.length === 0) {
    e.innerHTML = '<span style="color:#34d399">No issues found!</span>';
  } else {
    e.innerHTML = "<strong>" + issues.length + " issue(s):</strong><br><br>" +
      issues.map(function(i) { return '<span style="color:#f87171">"' + i.text + '"</span> to <span style="color:#34d399">"' + i.fix + '"</span>'; }).join("<br>");
  }
}

/* ---- Keyword Analyzer ---- */
function renderKeywords(el) {
  el.innerHTML = toolWrap("Keyword Analyzer", "Analyze word frequency and density.",
    '<textarea id="kw-input" placeholder="Paste content..." rows="8"></textarea>' +
    '<button class="btn btn-primary" style="margin-top:10px" onclick="doKeywords()">Analyze</button>' +
    '<div id="kw-result" class="result" style="display:none"></div>');
}

function doKeywords() {
  var t = document.getElementById("kw-input").value;
  var e = document.getElementById("kw-result");
  if (!t.trim()) { e.style.display = "block"; e.innerHTML = "Enter text."; return; }
  var words = t.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  var stop = new Set(["the","and","that","have","for","not","with","you","this","but","his","from","they","she","will","would","there","their","what","out","about","who","get","which","when","make","can","like","time","just","him","know","take","people","into","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","been","all"]);
  var freq = {};
  words.forEach(function(w) { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  var sorted = Object.entries(freq).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 30);
  var total = words.filter(function(w) { return !stop.has(w); }).length;
  e.style.display = "block";
  e.innerHTML = "<strong>Words: " + words.length + " | Significant: " + total + " | Unique: " + Object.keys(freq).length + "</strong><br><br>" +
    sorted.map(function(x, i) {
      return '<span class="stat">#' + (i + 1) + " " + x[0] + ' <span style="color:#60a5fa">' + x[1] + "</span> (" + (x[1] / Math.max(1, total) * 100).toFixed(1) + "%)</span>";
    }).join("");
}

/* ---- Readability Scorer ---- */
function renderReadability(el) {
  el.innerHTML = toolWrap("Readability Scorer", "Flesch-Kincaid Grade Level and Reading Ease.",
    '<textarea id="read-input" placeholder="Paste text..." rows="8"></textarea>' +
    '<button class="btn btn-primary" style="margin-top:10px" onclick="doReadability()">Score</button>' +
    '<div id="read-result" class="result" style="display:none"></div>');
}

function countSyllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  var m = w.match(/[aeiouy]+/g), c = m ? m.length : 1;
  if (w.endsWith("e")) c--;
  if (w.endsWith("le") && w.length > 3 && !/[aeiouy]/.test(w[w.length-3])) c++;
  return Math.max(1, c);
}

function doReadability() {
  var t = document.getElementById("read-input").value;
  var e = document.getElementById("read-result");
  if (!t.trim()) { e.style.display = "block"; e.innerHTML = "Enter text."; return; }
  var s = t.split(/[.!?]+/).filter(function(x) { return x.trim(); });
  var w = t.match(/\b\w+\b/g) || [];
  var sy = w.reduce(function(a, x) { return a + countSyllables(x); }, 0);
  var ch = t.replace(/\s/g, "").length;
  var fk = 206.835 - 1.015 * (w.length / s.length) - 84.6 * (sy / w.length);
  var ari = 4.71 * (ch / w.length) + 0.5 * (w.length / s.length) - 21.43;
  var gl = fk < 0 ? 18 : 0.39 * (w.length / s.length) + 11.8 * (sy / w.length) - 15.59;
  var ease = fk > 90 ? "Very Easy" : fk > 80 ? "Easy" : fk > 70 ? "Fairly Easy" : fk > 60 ? "Standard" : fk > 50 ? "Fairly Difficult" : fk > 30 ? "Difficult" : "Very Confusing";
  e.style.display = "block";
  e.innerHTML = "<strong>Reading Ease:</strong> " + fk.toFixed(1) + " (" + ease + ")<br>" +
    "<strong>Grade Level:</strong> " + (gl < 1 ? "Kindergarten" : gl > 18 ? "College+" : "Grade " + Math.round(gl)) + "<br>" +
    "<strong>ARI:</strong> " + (ari < 1 ? "KG" : ari > 18 ? "College+" : "Grade " + Math.round(ari)) + "<br><br>" +
    "Words: " + w.length + " | Sentences: " + s.length + " | Syllables: " + sy;
}

/* ---- Word Cloud ---- */
function renderWordCloud(el) {
  el.innerHTML = toolWrap("Word Cloud", "Visual word frequency display.",
    '<textarea id="wc-input" placeholder="Paste text..." rows="6"></textarea>' +
    '<button class="btn btn-primary" style="margin-top:10px" onclick="doWordCloud()">Generate</button>' +
    '<div id="wc-result"></div>');
}

function doWordCloud() {
  var t = document.getElementById("wc-input").value;
  var c = document.getElementById("wc-result");
  if (!t.trim()) { c.innerHTML = ""; return; }
  var words = t.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  var stop = new Set(["the","and","that","have","for","not","with","you","this","but","his","from","they","she","will","would","there","their","what","out","about","who","get","which","when","make","can","like","time","just","him","know","take","people","into","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","been","all"]);
  var freq = {};
  words.forEach(function(w) { if (!stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  var sorted = Object.entries(freq).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 60);
  if (!sorted.length) { c.innerHTML = ""; return; }
  var max = sorted[0][1], min = sorted[sorted.length - 1][1];
  var colors = ["#60a5fa","#a78bfa","#f472b6","#4ade80","#fbbf24","#38bdf8","#fb923c","#a3e635","#f87171","#c084fc"];
  var h = sorted.map(function(x, i) {
    var sz = 12 + ((x[1] - min) / Math.max(1, max - min)) * 32;
    return '<span style="display:inline-block;padding:2px 6px;font-size:' + Math.round(sz) + 'px;color:' + colors[i % 10] + ';font-weight:500" title="' + x[1] + 'x">' + x[0] + '</span>';
  }).join("");
  c.innerHTML = '<div style="margin-top:12px;padding:16px;background:#0f172a;border:1px solid #1e293b;border-radius:6px;line-height:1.8;text-align:center">' + h + '</div>';
}

/* ---- Password Checker ---- */
function renderPassword(el) {
  el.innerHTML = toolWrap("Password Strength", "Check strength locally. Nothing is sent anywhere.",
    '<input type="text" id="pw-input" placeholder="Type a password..." style="font-family:monospace;font-size:16px;letter-spacing:2px" oninput="doPassword()">' +
    '<div class="strength-bar" id="pw-bar"></div>' +
    '<div id="pw-result" style="margin-top:8px;font-size:12px;color:#64748b"></div>');
}

function doPassword() {
  var p = document.getElementById("pw-input").value;
  var b = document.getElementById("pw-bar");
  var r = document.getElementById("pw-result");
  if (!p) { b.style.width = "0"; r.textContent = ""; return; }
  var s = 0, c = [];
  p.length >= 8 ? s++ : c.push("Too short (8+)");
  p.length >= 12 ? s++ : c.push("");
  /[A-Z]/.test(p) ? s++ : c.push("Add uppercase");
  /[a-z]/.test(p) ? s++ : c.push("Add lowercase");
  /[0-9]/.test(p) ? s++ : c.push("Add numbers");
  /[^a-zA-Z0-9]/.test(p) ? s++ : c.push("Add special chars");
  /(.)\1{2,}/.test(p) ? c.push("Repeated chars detected") : s++;
  var pct = Math.min(100, (s / 7) * 100);
  b.style.width = pct + "%";
  b.style.background = ["#ef4444", "#f97316", "#facc15", "#4ade80"][pct > 75 ? 3 : pct > 50 ? 2 : pct > 25 ? 1 : 0];
  var label = pct > 75 ? "Strong" : pct > 50 ? "Moderate" : pct > 25 ? "Weak" : "Very Weak";
  r.innerHTML = "<strong>Score: " + s + "/7</strong> | " + label + "<br>" +
    c.filter(function(x) { return x; }).map(function(x) {
      return x.includes("Add") || x.includes("Too") || x.includes("Repeated") ? '<span style="color:#f87171">X ' + x + "</span>" : '<span style="color:#34d399">OK</span>';
    }).join("<br>");
}

/* ---- Unit Converter ---- */
function renderUnit(el) {
  el.innerHTML = toolWrap("Unit Converter", "Convert between common units.",
    '<div style="display:flex;gap:8px;align-items:center;margin:12px 0;flex-wrap:wrap">' +
    '<input type="number" id="uc-val" value="1" style="width:100px" oninput="doUnit()">' +
    '<select id="uc-from" onchange="doUnit()"><option value="m">Meters</option><option value="km">Kilometers</option><option value="cm">Centimeters</option><option value="in">Inches</option><option value="ft">Feet</option><option value="mi">Miles</option><option value="kg">Kilograms</option><option value="g">Grams</option><option value="lb">Pounds</option><option value="oz">Ounces</option><option value="c">Celsius</option><option value="f">Fahrenheit</option></select>' +
    '<span>=</span>' +
    '<span id="uc-result" style="font-size:16px;font-weight:700;color:#60a5fa">3.28 ft</span></div>');
  setTimeout(doUnit, 100);
}

function doUnit() {
  var v = parseFloat(document.getElementById("uc-val").value) || 0;
  var f = document.getElementById("uc-from").value;
  var o = document.getElementById("uc-result");
  var toM = { m: 1, km: 1000, cm: 0.01, in: 0.0254, ft: 0.3048, mi: 1609.34 };
  var toKg = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 };
  if (f in toM) { var b = v * toM[f]; o.textContent = b.toFixed(2) + " m | " + (b * 3.28084).toFixed(2) + " ft | " + (b * 39.3701).toFixed(2) + " in"; }
  else if (f in toKg) { var k = v * toKg[f]; o.textContent = k.toFixed(2) + " kg | " + (k * 2.20462).toFixed(2) + " lb"; }
  else if (f === "c") o.textContent = ((v * 9 / 5) + 32).toFixed(1) + " F";
  else o.textContent = ((v - 32) * 5 / 9).toFixed(1) + " C";
}

/* ---- Percentage Calculator ---- */
function renderPercentage(el) {
  el.innerHTML = toolWrap("Percentage Calculator", "Quick percentage calculations.",
    '<div class="tab-nav"><button class="active" onclick="setPcMode(0)">% of Number</button><button onclick="setPcMode(1)">% Change</button><button onclick="setPcMode(2)">Tip</button></div><div id="pc-content"></div>');
  window._pcMode = 0;
  renderPcContent();
}

function setPcMode(m) {
  window._pcMode = m;
  document.querySelectorAll(".tab-nav button").forEach(function(b, i) { b.className = i === m ? "active" : ""; });
  renderPcContent();
}

function renderPcContent() {
  var c = document.getElementById("pc-content"), m = window._pcMode;
  if (m === 0) {
    c.innerHTML = '<div style="display:flex;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap"><input type="number" id="pcn-val" placeholder="Percent" style="width:100px" oninput="doPc()"><span>% of</span><input type="number" id="pcn-base" placeholder="Number" style="width:100px" oninput="doPc()"><span>=</span><span id="pcn-result" style="font-size:18px;font-weight:700;color:#60a5fa">0</span></div>';
  } else if (m === 1) {
    c.innerHTML = '<div style="display:flex;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap"><span>From</span><input type="number" id="pcc-from" placeholder="Old" style="width:100px" oninput="doPcChange()"><span>to</span><input type="number" id="pcc-to" placeholder="New" style="width:100px" oninput="doPcChange()"><span>=</span><span id="pcc-result" style="font-size:18px;font-weight:700;color:#60a5fa">0%</span></div>';
  } else {
    c.innerHTML = '<div style="display:flex;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap"><span>Bill:</span><input type="number" id="tip-bill" placeholder="Amount" style="width:100px" oninput="doTip()"><span>Tip:</span><input type="number" id="tip-pct" value="15" style="width:70px" oninput="doTip()"><span>% =</span><span id="tip-result" style="font-size:18px;font-weight:700;color:#60a5fa">$0.00</span></div>';
  }
}

function doPc() { var v = parseFloat(document.getElementById("pcn-val").value) || 0, b = parseFloat(document.getElementById("pcn-base").value) || 0; document.getElementById("pcn-result").textContent = (b * v / 100).toFixed(2); }
function doPcChange() { var f = parseFloat(document.getElementById("pcc-from").value) || 0, t = parseFloat(document.getElementById("pcc-to").value) || 0; document.getElementById("pcc-result").textContent = f ? ((t - f) / f * 100).toFixed(1) + "%" : "0%"; }
function doTip() { var b = parseFloat(document.getElementById("tip-bill").value) || 0, p = parseFloat(document.getElementById("tip-pct").value) || 0, t = b * p / 100; document.getElementById("tip-result").textContent = "$" + (b + t).toFixed(2) + " (tip $" + t.toFixed(2) + ")"; }
