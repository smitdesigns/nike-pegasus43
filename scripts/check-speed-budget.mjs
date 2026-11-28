import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const runnerDir = process.env.BUDGET_RUNNER_NODE_MODULES
  ? path.resolve(process.env.BUDGET_RUNNER_NODE_MODULES)
  : path.resolve(process.cwd(), "node_modules");

const playwrightPkg = fs.existsSync(path.join(runnerDir, "playwright"))
  ? "playwright"
  : "playwright-core";
const { chromium } = require(path.join(runnerDir, playwrightPkg));
const lighthouse = require(path.join(runnerDir, "lighthouse")).default || require(path.join(runnerDir, "lighthouse"));
const chromeLauncher = require(path.join(runnerDir, "chrome-launcher"));

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3000/pegasus-43";
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const CHROME_PATH = process.env.CHROME_PATH || undefined;

const budgetPath = path.resolve(process.cwd(), "speed-budget.json");
const budget = JSON.parse(fs.readFileSync(budgetPath, "utf8"));

const requiredKeys = [
  "performance_score_min",
  "size_grid_shift_px_max",
  "size_button_min_px",
];
const actualKeys = Object.keys(budget);
if (
  actualKeys.length !== requiredKeys.length ||
  !requiredKeys.every((k) => actualKeys.includes(k))
) {
  throw new Error(
    `speed-budget.json must contain exactly [${requiredKeys.join(", ")}], found [${actualKeys.join(", ")}]`,
  );
}

const extraHeaders = BYPASS_SECRET
  ? { "x-vercel-protection-bypass": BYPASS_SECRET }
  : undefined;

async function runLighthouseCheck() {
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH || chromium.executablePath(),
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  try {
    const result = await lighthouse(TARGET_URL, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance"],
      formFactor: "mobile",
      throttlingMethod: "simulate",
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        requestLatencyMs: 562.5,
        downloadThroughputKbps: 1474.56,
        uploadThroughputKbps: 675,
        cpuSlowdownMultiplier: 4,
      },
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 812,
        deviceScaleFactor: 3,
        disabled: false,
      },
      extraHeaders,
    });

    const lhr = result.lhr;
    const score = Math.round((lhr.categories.performance.score ?? 0) * 100);
    return {
      score,
      fcpMs: Math.round(lhr.audits["first-contentful-paint"]?.numericValue ?? 0),
      lcpMs: Math.round(lhr.audits["largest-contentful-paint"]?.numericValue ?? 0),
      tbtMs: Math.round(lhr.audits["total-blocking-time"]?.numericValue ?? 0),
      cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0,
    };
  } finally {
    await chrome.kill();
  }
}

async function runSlow4GDomCheck() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH || chromium.executablePath(),
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      extraHTTPHeaders: extraHeaders,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);

    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 562.5,
      downloadThroughput: (1474.56 * 1000) / 8,
      uploadThroughput: (675 * 1000) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.addInitScript(() => {
      window.__gridTops = [];
      window.__clsTotal = 0;

      const sample = () => {
        const grid = document.querySelector('[data-testid="size-grid"]');
        if (grid) {
          window.__gridTops.push(grid.getBoundingClientRect().top);
        }
      };

      const mo = new MutationObserver(sample);
      mo.observe(document, { childList: true, subtree: true });
      document.addEventListener("DOMContentLoaded", () => {
        sample();
        requestAnimationFrame(sample);
      });
      window.addEventListener("load", sample);

      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__clsTotal += entry.value;
          }
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.reload({ waitUntil: "load", timeout: 60000 });
    await page.waitForSelector('[data-testid="size-grid"]', { timeout: 30000 });
    await page.waitForFunction(() => {
      const img = document.querySelector('[data-testid="main-photo"]');
      return img && img.complete && img.naturalWidth > 0;
    });
    await page.waitForTimeout(300);

    const domResult = await page.evaluate(() => {
      const grid = document.querySelector('[data-testid="size-grid"]');
      if (grid) {
        window.__gridTops.push(grid.getBoundingClientRect().top);
      }
      const tops = window.__gridTops;
      const gridShiftPx = tops.length ? Math.max(...tops) - Math.min(...tops) : Infinity;

      const available = Array.from(document.querySelectorAll('[data-testid="size-button"]'));
      const soldOut = Array.from(document.querySelectorAll('[data-testid="size-button-sold-out"]'));
      const allButtons = [...available, ...soldOut];
      const smallestDimPx = allButtons.length
        ? Math.min(
            ...allButtons.map((b) => {
              const r = b.getBoundingClientRect();
              return Math.min(r.width, r.height);
            }),
          )
        : 0;

      return {
        watchedElements: {
          "size-grid": Boolean(grid),
          "size-button": available.length > 0,
          "size-button-sold-out": soldOut.length > 0,
          "main-photo": Boolean(document.querySelector('[data-testid="main-photo"]')),
          price: Boolean(document.querySelector('[data-testid="price"]')),
        },
        buttonCount: allButtons.length,
        gridShiftPx,
        cls: window.__clsTotal,
        smallestButtonDimPx: Math.round(smallestDimPx * 100) / 100,
      };
    });

    await context.close();
    return domResult;
  } finally {
    await browser.close();
  }
}

async function main() {
  const lh = await runLighthouseCheck();
  const dom = await runSlow4GDomCheck();

  const failures = [];
  if (lh.score < budget.performance_score_min) {
    failures.push(
      `performance_score_min failed: measured ${lh.score} < required ${budget.performance_score_min}`,
    );
  }
  if (dom.gridShiftPx > budget.size_grid_shift_px_max) {
    failures.push(
      `size_grid_shift_px_max failed: measured ${dom.gridShiftPx} px > allowed ${budget.size_grid_shift_px_max} px`,
    );
  }
  if (dom.smallestButtonDimPx < budget.size_button_min_px) {
    failures.push(
      `size_button_min_px failed: measured ${dom.smallestButtonDimPx} px < required ${budget.size_button_min_px} px`,
    );
  }
  for (const [id, present] of Object.entries(dom.watchedElements)) {
    if (!present) {
      failures.push(`watched element [data-testid="${id}"] is missing`);
    }
  }

  const report = { targetUrl: TARGET_URL, budget, lighthouse: lh, dom, failures };
  console.log(JSON.stringify(report, null, 2));

  if (process.env.GITHUB_STEP_SUMMARY) {
    const summaryLines = [
      `## Slow 4G Speed Budget Check (\`${TARGET_URL}\`)`,
      "",
      "| Budget Key | Required | Measured | Status |",
      "| --- | --- | --- | --- |",
      `| \`performance_score_min\` | >= ${budget.performance_score_min} | ${lh.score} (FCP ${lh.fcpMs} ms, LCP ${lh.lcpMs} ms, TBT ${lh.tbtMs} ms) | ${lh.score >= budget.performance_score_min ? "PASS" : "FAIL"} |`,
      `| \`size_grid_shift_px_max\` | <= ${budget.size_grid_shift_px_max} px | ${dom.gridShiftPx} px (CLS ${dom.cls}) | ${dom.gridShiftPx <= budget.size_grid_shift_px_max ? "PASS" : "FAIL"} |`,
      `| \`size_button_min_px\` | >= ${budget.size_button_min_px} px | ${dom.smallestButtonDimPx} px (${dom.buttonCount} buttons) | ${dom.smallestButtonDimPx >= budget.size_button_min_px ? "PASS" : "FAIL"} |`,
      "",
    ];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryLines.join("\n"));
  }

  if (failures.length > 0) {
    console.error("Speed budget check failed:\n- " + failures.join("\n- "));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
