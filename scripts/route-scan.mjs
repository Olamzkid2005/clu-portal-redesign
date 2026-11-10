import { chromium } from "../node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import {
  designStudyRoute,
  routeSlug,
  routesByRole,
  scanRoute,
} from "./route-audit-lib.mjs";

const base = "http://127.0.0.1:3000/";
const outputDir = "screenshots/routes";
const capture = process.env.CAPTURE_ROUTES === "1";
const output = process.env.ROUTE_OUTPUT ?? `${outputDir}/findings.json`;
const viewports = {
  desktop: { width: 1440, height: 1000 },
  phone: { width: 390, height: 844 },
};

const roles = [
  { key: "student", label: "Student", home: "dashboard", deep: "results" },
  { key: "lecturer", label: "Lecturer", home: "lecturer", deep: "lecturer/attendance" },
  { key: "bursar", label: "Bursar", home: "bursar", deep: "bursar/ledger" },
  { key: "ict", label: "ICT personnel", home: "ict", deep: "ict/users" },
  { key: "vc", label: "Vice Chancellor", home: "vc", deep: "vc/approvals" },
  { key: "registrar", label: "Registrar", home: "registrar", deep: "registrar" },
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });

const signIn = async (page, role) => {
  await page.goto(`${base}#/${role.deep}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".signin", { timeout: 10000 });
  await page.waitForFunction(() => location.hash === "#/signin");
  await page.locator(".signin__role", { hasText: role.label }).click();
  await page.locator(".signin__submit").click();
  await page.waitForSelector(".quadhead", { state: "attached", timeout: 10000 });
  await page.waitForFunction((home) => location.hash === `#/${home}`, role.home);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(180);
};

const scanAtRoute = async (page, { roleKey, route, viewportName }) => {
  await page.evaluate((nextRoute) => {
    window.location.hash = `#/${nextRoute}`;
  }, route);
  await page.waitForFunction((nextRoute) => location.hash === `#/${nextRoute}`, route);
  await page.waitForTimeout(170);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector(".page")?.scrollTo(0, 0);
  });
  const finding = await scanRoute(page, {
    kind: route === designStudyRoute ? "design" : "portal",
  });
  let screenshot = null;
  if (capture) {
    const suffix = viewportName === "desktop" ? "1440" : "390";
    screenshot = `${outputDir}/${roleKey}-${routeSlug(route)}-${suffix}.png`;
    await page.screenshot({ path: screenshot, fullPage: false });
  }
  return { role: roleKey, route, viewport: viewportName, ...finding, screenshot };
};

const roleResults = [];
for (const role of roles) {
  const context = await browser.newContext({ viewport: viewports.desktop });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await signIn(page, role);
  const checks = [];
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(160);
    for (const route of routesByRole[role.key]) {
      checks.push(await scanAtRoute(page, { roleKey: role.key, route, viewportName }));
    }
  }
  roleResults.push({
    role: role.key,
    routes: routesByRole[role.key],
    checks,
    consoleErrors,
  });
  await context.close();
}

const designContext = await browser.newContext({ viewport: viewports.desktop });
const designPage = await designContext.newPage();
await signIn(designPage, roles[0]);
const designChecks = [];
for (const [viewportName, viewport] of Object.entries(viewports)) {
  await designPage.setViewportSize(viewport);
  await designPage.waitForTimeout(160);
  designChecks.push(
    await scanAtRoute(designPage, {
      roleKey: "global",
      route: designStudyRoute,
      viewportName,
    })
  );
}
await designContext.close();
await browser.close();

const allChecks = [...roleResults.flatMap((role) => role.checks), ...designChecks];
const clean = allChecks.filter((check) => check.clean);
const failed = allChecks.filter((check) => !check.clean);
const summary = {
  scannedAt: new Date().toISOString(),
  base,
  capture,
  routeInventory: {
    counts: {
      student: routesByRole.student.length,
      lecturer: routesByRole.lecturer.length,
      bursar: routesByRole.bursar.length,
      ict: routesByRole.ict.length,
      vc: routesByRole.vc.length,
      registrar: routesByRole.registrar.length,
      designStudy: 1,
      total: allChecks.length / 2,
    },
    roleChecks: roleResults.map((role) => ({
      role: role.role,
      routeCount: role.routes.length,
      clean: role.checks.filter((check) => check.clean).length,
      total: role.checks.length,
      consoleErrors: role.consoleErrors,
    })),
  },
  designStudy: designChecks,
  roles: roleResults,
  summary: {
    totalChecks: allChecks.length,
    cleanChecks: clean.length,
    failedChecks: failed.length,
    cleanRoutes: [...new Set(clean.map((check) => `${check.role}:${check.route}`))].length,
    failedRoutes: [...new Set(failed.map((check) => `${check.role}:${check.route}`))],
  },
  failedChecks: failed,
  allChecks,
};

await mkdir(outputDir, { recursive: true });
await writeFile(output, JSON.stringify(summary, null, 2));
console.log(
  JSON.stringify(
    {
      output,
      capture,
      summary: summary.summary,
      roleChecks: summary.routeInventory.roleChecks,
      designStudy: designChecks.map((check) => ({
        viewport: check.viewport,
        clean: check.clean,
        gradients: check.gradients.length,
        translucent: check.translucent.length,
        glossy: check.glossy.length,
        pills: check.pillControls.length,
        oversized: check.oversizedRadii.length,
        truncated: check.navTruncated.length,
        overflow: check.overflow,
        missing: check.details.missing,
        specimenExcluded: check.specimenExcluded.length,
      })),
      failedChecks: failed.map((check) => ({
        role: check.role,
        route: check.route,
        viewport: check.viewport,
        gradients: check.gradients,
        translucent: check.translucent,
        glossy: check.glossy,
        pillControls: check.pillControls,
        oversizedRadii: check.oversizedRadii,
        navTruncated: check.navTruncated,
        overflow: check.overflow,
        missing: check.details.missing,
      })),
    },
    null,
    2
  )
);
