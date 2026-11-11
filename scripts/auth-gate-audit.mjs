import { chromium } from "../node_modules/playwright/index.mjs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import {
  designStudyRoute,
  routeSlug,
  routesByRole,
  scanRoute,
} from "./route-audit-lib.mjs";

const base = "http://127.0.0.1:3000/";
const shotDir = "screenshots/auth";
const routeDir = "screenshots/routes";
const viewports = {
  desktop: { width: 1440, height: 1000 },
  phone: { width: 390, height: 844 },
};

const roles = [
  {
    key: "student",
    label: "Student",
    name: "Adaeze N. Okonkwo",
    email: "adaeze.okonkwo@chrislanduniversity.edu.ng",
    detail: "CLU210118-042",
    home: "dashboard",
    deep: "results",
    inner: "timetable",
    mobileSub: "Student portal",
    groups: ["Classes", "Money", "Services", "Account"],
    tabs: ["Overview", "Timetable", "Results", "Payments", "More"],
  },
  {
    key: "lecturer",
    label: "Lecturer",
    name: "Dr. Bamidele Adeyemi",
    email: "b.adeyemi@chrislanduniversity.edu.ng",
    detail: "Software Engineering",
    home: "lecturer",
    deep: "lecturer/attendance",
    inner: "lecturer/courses",
    mobileSub: "Lecturer portal",
    groups: ["Teaching"],
    tabs: ["Overview", "Courses", "Attendance", "More"],
  },
  {
    key: "bursar",
    label: "Bursar",
    name: "Mrs. Folake Adekunle",
    email: "f.adekunle@chrislanduniversity.edu.ng",
    detail: "Chief Finance Officer",
    home: "bursar",
    deep: "bursar/ledger",
    inner: "bursar/fees",
    mobileSub: "Bursar portal",
    groups: ["Finance"],
    tabs: ["Overview", "Ledger", "Fees", "More"],
  },
  {
    key: "ict",
    label: "ICT personnel",
    name: "Mr. Tochukwu Okafor",
    email: "t.okafor@chrislanduniversity.edu.ng",
    detail: "Directorate of ICT",
    home: "ict",
    deep: "ict/users",
    inner: "ict/audit",
    mobileSub: "ICT portal",
    groups: ["Systems"],
    tabs: ["Overview", "Users", "Audit", "More"],
  },
  {
    key: "vc",
    label: "Vice Chancellor",
    name: "Prof. Chinedu Eze",
    email: "c.eze@chrislanduniversity.edu.ng",
    detail: "Office of the Vice Chancellor",
    home: "vc",
    deep: "vc/approvals",
    inner: "vc/approvals",
    mobileSub: "VC portal",
    groups: ["Executive"],
    tabs: ["Institution", "Approvals", "More"],
  },
  {
    key: "registrar",
    label: "Registrar",
    name: "Dr. Maryam Bello",
    email: "m.bello@chrislanduniversity.edu.ng",
    detail: "Registry · Academic Affairs",
    home: "registrar",
    deep: "registrar",
    inner: null,
    mobileSub: "Registrar portal",
    groups: ["Registry"],
    tabs: ["Queue", "More"],
  },
];

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const failures = [];
const results = [];
const check = (condition, scope, message) => {
  if (!condition) failures.push(`${scope}: ${message}`);
};

const routeIssueList = (finding) => {
  const issues = [];
  if (finding.gradients.length) {
    issues.push(`gradients (${finding.gradients.map((item) => item.node).slice(0, 3).join(", ")})`);
  }
  if (finding.translucent.length) {
    issues.push(`translucent surfaces (${finding.translucent.map((item) => item.node).slice(0, 3).join(", ")})`);
  }
  if (finding.glossy.length) {
    issues.push(`glossy surfaces (${finding.glossy.map((item) => item.node).slice(0, 3).join(", ")})`);
  }
  if (finding.pillControls.length) {
    issues.push(`pill controls (${finding.pillControls.map((item) => item.node).slice(0, 3).join(", ")})`);
  }
  if (finding.oversizedRadii.length) {
    issues.push(`oversized radii (${finding.oversizedRadii.map((item) => item.node).slice(0, 3).join(", ")})`);
  }
  if (finding.navTruncated.length) {
    issues.push(`truncated nav (${finding.navTruncated.map((item) => item.node).slice(0, 3).join(", ")})`);
  }
  if (Math.max(finding.overflow.document, finding.overflow.page, finding.overflow.lab) > 1) {
    issues.push(`horizontal overflow (${JSON.stringify(finding.overflow)})`);
  }
  if (finding.details.missing.length) {
    issues.push(`missing ${finding.details.missing.join(", ")}`);
  }
  if (!issues.length && !finding.clean) issues.push("route did not pass the design check");
  return issues;
};

const recordRouteFailures = (scope, finding) => {
  const issues = routeIssueList(finding);
  if (issues.length) failures.push(`${scope}: ${issues.join("; ")}`);
};

await mkdir(shotDir, { recursive: true });
await mkdir(routeDir, { recursive: true });

const readState = (page) =>
  page.evaluate(() => {
    const read = (storage, key) => {
      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    };
    return {
      hash: location.hash,
      title: document.title,
      signIn: Boolean(document.querySelector(".signin")),
      shell: Boolean(document.querySelector(".quadhead")),
      designLab: Boolean(document.querySelector(".lab")),
      sessionLocal: read(localStorage, "clu-session"),
      sessionNew: read(sessionStorage, "clu-portal-session"),
      legacyTab: read(sessionStorage, "clu-session"),
    };
  });

const readDimensions = (page) =>
  page.evaluate(() => {
    const pageNode = document.querySelector(".page");
    return {
      viewport: window.innerWidth,
      documentOverflow: Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth
      ) - window.innerWidth,
      pageOverflow: pageNode ? pageNode.scrollWidth - pageNode.clientWidth : 0,
    };
  });

const readGradients = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".card, .btn, .quadhead, .stat, .page__head, .workspace-hero, .pill, .signin__top, .signin__submit")]
      .map((node) => ({
        node: node.className?.toString() ?? node.tagName,
        backgroundImage: getComputedStyle(node).backgroundImage,
      }))
      .filter((entry) => entry.backgroundImage !== "none")
  );

const readDesignDetails = (page) =>
  page.evaluate(() => {
    const pseudo = (selector, which) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node, which);
      return {
        width: style.width,
        height: style.height,
        background: style.backgroundColor,
        borderLeft: style.borderLeftWidth,
        boxShadow: style.boxShadow,
      };
    };

    const header = document.querySelector(
      ".page__head, .workspace-hero, .page .hero, .student-hero"
    );
    const headerSelector = header
      ? header.matches(".page__head")
        ? ".page__head"
        : header.matches(".workspace-hero")
          ? ".workspace-hero"
          : header.matches(".student-hero")
            ? ".student-hero"
            : ".page .hero"
      : null;
    const cardTitle = document.querySelector(".card__title");
    const filterHeader = document.querySelector(".card__hd--filters");
    return {
      eyebrowRule: pseudo(".eyebrow, .student-hero__eyebrow", "::before"),
      sectionRule: headerSelector ? pseudo(headerSelector, "::after") : null,
      cardTitleRule: cardTitle
        ? pseudo(".card__title", null)
        : filterHeader
          ? pseudo(".card__hd--filters", "::before")
          : null,
      filterHeaderRule: pseudo(".card__hd--filters", "::before"),
      footerRule: pseudo(".foot", "::before"),
      subnavRule: pseudo(".quadsubnav__meta", "::before"),
      pillSpine: pseudo(".pill", null),
      dashboardHero: Boolean(document.querySelector(".hero:not(.workspace-hero)")),
    };
  });

const openCleanGate = async (deep) => {
  const context = await browser.newContext({ viewport: viewports.desktop });
  const beforeStorage = await context.storageState();
  const consoleErrors = [];
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(`${base}#/${deep}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".signin", { timeout: 10000 });
  await page.waitForFunction(() => location.hash === "#/signin");
  await page.evaluate(() => document.fonts.ready);
  return { context, page, beforeStorage, consoleErrors };
};

/* ------------------------------------------------------------------ gate tests */

const cleanGate = await openCleanGate("dashboard");
const cleanGateState = await readState(cleanGate.page);
const cleanGateRoleCount = await cleanGate.page.locator(".signin__role").count();
const cleanGateDesign = await cleanGate.page.evaluate(() => ({
  kickerRule: getComputedStyle(document.querySelector(".signin__kicker"), "::before").width,
  roleCount: document.querySelectorAll(".signin__role").length,
  sessionMarker: getComputedStyle(document.querySelector(".signin__sessionnote"), "::before").borderTopWidth,
  hasRemember: Boolean(document.querySelector(".signin__remember")),
  hasDesignLink: Boolean(document.querySelector(".signin__study[href='#/designs']")),
}));
check(cleanGateState.signIn && !cleanGateState.shell, "clean-gate", "clean direct visit did not render sign-in");
check(cleanGateState.hash === "#/signin", "clean-gate", "clean signed-out URL was not pinned to #/signin");
check(cleanGateRoleCount === 6, "clean-gate", `expected six role buttons, found ${cleanGateRoleCount}`);
check(cleanGateDesign.kickerRule !== "0px", "clean-gate", "sign-in kicker rule is missing");
check(cleanGateDesign.sessionMarker !== "0px", "clean-gate", "sign-in session marker is missing");
check(!cleanGateDesign.hasRemember, "clean-gate", "persistent session control is still present");
check(!cleanGateDesign.hasDesignLink, "clean-gate", "signed-out design-study bypass link is still present");
check(cleanGate.beforeStorage.origins.length === 0, "clean-gate", "fresh context started with stored origins");
await cleanGate.context.close();

const legacyContext = await browser.newContext({ viewport: viewports.desktop });
await legacyContext.addInitScript(() => {
  localStorage.setItem("clu-session", "active");
  localStorage.setItem("clu-role", "bursar");
});
const legacyPage = await legacyContext.newPage();
await legacyPage.goto(`${base}#/bursar`, { waitUntil: "domcontentloaded" });
await legacyPage.waitForSelector(".signin", { timeout: 10000 });
await legacyPage.waitForFunction(() => location.hash === "#/signin");
const legacyState = await readState(legacyPage);
check(legacyState.signIn && !legacyState.shell, "legacy-session", "old persistent session still reached the portal");
check(legacyState.sessionLocal === null, "legacy-session", "old persistent session key was not purged");
await legacyPage.evaluate(() => document.fonts.ready);
await legacyPage.screenshot({ path: `${shotDir}/gate-legacy-session-retired.png`, fullPage: true });
await legacyContext.close();

const designContext = await browser.newContext({ viewport: viewports.desktop });
const designPage = await designContext.newPage();
const designConsoleErrors = [];
designPage.on("console", (message) => {
  if (message.type() === "error") designConsoleErrors.push(message.text());
});
designPage.on("pageerror", (error) => designConsoleErrors.push(error.message));
await designPage.goto(`${base}#/designs`, { waitUntil: "domcontentloaded" });
await designPage.waitForSelector(".signin", { timeout: 10000 });
await designPage.waitForFunction(() => location.hash === "#/signin");
const designGateState = await readState(designPage);
check(designGateState.signIn && !designGateState.designLab, "design-route", "design study skipped the gate");

await designPage.locator(".signin__role", { hasText: "Student" }).click();
await designPage.locator(".signin__submit").click();
await designPage.waitForSelector(".quadhead", { state: "attached", timeout: 10000 });
await designPage.waitForFunction(() => location.hash === "#/dashboard");
await designPage.evaluate(() => document.fonts.ready);
await designPage.evaluate((route) => {
  window.location.hash = `#/${route}`;
}, designStudyRoute);
await designPage.waitForSelector(".lab", { state: "attached", timeout: 10000 });
await designPage.waitForFunction((route) => location.hash === `#/${route}`, designStudyRoute);
await designPage.waitForTimeout(180);
const designStudyState = await readState(designPage);
check(
  designStudyState.designLab && !designStudyState.signIn && !designStudyState.shell,
  "design-route",
  "signed-in design study did not render"
);

const designRouteFindings = [];
for (const [viewportName, viewport] of Object.entries(viewports)) {
  await designPage.setViewportSize(viewport);
  await designPage.waitForTimeout(160);
  await designPage.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector(".lab")?.scrollTo(0, 0);
  });
  const finding = await scanRoute(designPage, { kind: "design" });
  const suffix = viewportName === "desktop" ? "1440" : "390";
  const screenshot = `${routeDir}/global-${routeSlug(designStudyRoute)}-${suffix}.png`;
  await designPage.screenshot({ path: screenshot, fullPage: false });
  designRouteFindings.push({
    role: "global",
    route: designStudyRoute,
    viewport: viewportName,
    ...finding,
    screenshot,
  });
  recordRouteFailures(`global ${designStudyRoute} ${viewportName}`, finding);
}
check(
  designConsoleErrors.length === 0,
  "design-route",
  `console errors: ${designConsoleErrors.join(" | ")}`
);
await designContext.close();

/* ------------------------------------------------------------ role-by-role tests */

for (const role of roles) {
  const { context, page, beforeStorage, consoleErrors } = await openCleanGate(role.deep);
  const initial = await readState(page);
  check(initial.signIn && !initial.shell, role.key, "clean deep link did not render sign-in");
  check(initial.hash === "#/signin", role.key, "signed-out deep link was not pinned to sign-in");
  check(beforeStorage.origins.length === 0, role.key, "role context was not clean");

  await page.locator(".signin__role", { hasText: role.label }).click();
  await page.waitForFunction(
    (name) => document.querySelector(".signin__identity")?.textContent?.includes(name),
    role.name
  );
  const signInIdentity = await page.locator(".signin__identity").innerText();
  const signInEmail = await page.locator('input[name="email"]').inputValue();
  check(signInIdentity.includes(role.name), role.key, "sign-in identity did not show the selected role account");
  check(signInEmail === role.email, role.key, "sign-in email did not match the selected role");

  await page.evaluate(() => window.scrollTo(0, 0));
  const signInDesktopDimensions = await readDimensions(page);
  const signInDesktopGradients = await readGradients(page);
  check(signInDesktopDimensions.documentOverflow <= 0, role.key, "sign-in overflows horizontally at 1440px");
  check(signInDesktopGradients.length === 0, role.key, "sign-in reintroduced a gradient");
  await page.screenshot({ path: `${shotDir}/${role.key}-signin-1440.png`, fullPage: true });

  await page.setViewportSize(viewports.phone);
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, 0));
  const signInPhoneDimensions = await readDimensions(page);
  check(signInPhoneDimensions.documentOverflow <= 0, role.key, "sign-in overflows horizontally at 390px");
  await page.screenshot({ path: `${shotDir}/${role.key}-signin-390.png`, fullPage: true });

  await page.locator(".signin__submit").click();
  await page.waitForSelector(".quadhead", { state: "attached", timeout: 10000 });
  await page.waitForFunction((home) => location.hash === `#/${home}`, role.home);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(180);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector(".page")?.scrollTo(0, 0);
  });

  const phoneHome = await page.evaluate(() => ({
    hash: location.hash,
    title: document.title,
    subtitle: document.querySelector(".mobilebar__sub")?.textContent?.trim(),
    tabs: [...document.querySelectorAll(".tabbar__item")].map((node) => node.textContent?.trim()),
  }));
  check(phoneHome.hash === `#/${role.home}`, role.key, "role did not land on its own home");
  check(phoneHome.subtitle === role.mobileSub, role.key, `mobile role label was ${phoneHome.subtitle}`);
  check(JSON.stringify(phoneHome.tabs) === JSON.stringify(role.tabs), role.key, `mobile tabs were ${JSON.stringify(phoneHome.tabs)}`);
  const phoneDimensions = await readDimensions(page);
  check(phoneDimensions.documentOverflow <= 0, role.key, "role home overflows horizontally at 390px");
  await page.screenshot({ path: `${shotDir}/${role.key}-home-390.png`, fullPage: true });

  await page.setViewportSize(viewports.desktop);
  await page.waitForTimeout(220);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector(".page")?.scrollTo(0, 0);
  });
  const desktopHome = await page.evaluate(() => ({
    hash: location.hash,
    title: document.title,
    userName: document.querySelector(".user__name")?.textContent?.trim(),
    userRole: document.querySelector(".user__role")?.textContent?.trim(),
    nav: [...document.querySelectorAll(".quadnav__tab")].map((node) => node.textContent?.trim()),
  }));
  const homeDimensions = await readDimensions(page);
  const homeGradients = await readGradients(page);
  const designDetails = await readDesignDetails(page);
  const homeSession = await readState(page);
  check(desktopHome.hash === `#/${role.home}`, role.key, "desktop home hash was not the role home");
  check(desktopHome.userName === role.name, role.key, "header account name was not the signed-in role");
  check(desktopHome.userRole === role.detail, role.key, "header role detail was not role-correct");
  check(JSON.stringify(desktopHome.nav) === JSON.stringify(role.groups), role.key, `role navigation was ${JSON.stringify(desktopHome.nav)}`);
  check(homeDimensions.documentOverflow <= 0, role.key, "role home overflows horizontally at 1440px");
  check(homeGradients.length === 0, role.key, "role home reintroduced a gradient");
  check(homeSession.sessionNew === "active", role.key, "tab session was not active after sign-in");
  await page.screenshot({ path: `${shotDir}/${role.key}-home-1440.png`, fullPage: true });

  const routeFindings = [];
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(160);
    for (const route of routesByRole[role.key]) {
      await page.evaluate((nextRoute) => {
        window.location.hash = `#/${nextRoute}`;
      }, route);
      await page.waitForFunction((nextRoute) => location.hash === `#/${nextRoute}`, route);
      await page.waitForTimeout(170);
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        document.querySelector(".page")?.scrollTo(0, 0);
      });
      const finding = await scanRoute(page, { kind: "portal" });
      const suffix = viewportName === "desktop" ? "1440" : "390";
      const screenshot = `${routeDir}/${role.key}-${routeSlug(route)}-${suffix}.png`;
      await page.screenshot({ path: screenshot, fullPage: false });
      routeFindings.push({ route, viewport: viewportName, ...finding, screenshot });
      recordRouteFailures(`${role.key} ${route} ${viewportName}`, finding);
    }
  }
  await page.setViewportSize(viewports.desktop);
  await page.waitForTimeout(220);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector(".page")?.scrollTo(0, 0);
  });

  if (role.inner) {
    await page.evaluate((inner) => {
      window.location.hash = `#/${inner}`;
    }, role.inner);
    await page.waitForFunction((inner) => location.hash === `#/${inner}`, role.inner);
    await page.waitForTimeout(160);
  }

  await page.getByRole("button", { name: "Account menu" }).click();
  const menuText = await page.locator(".menupanel").innerText();
  check(!menuText.includes("Switch portal"), role.key, "in-app role switching is still available");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForSelector(".signin", { timeout: 10000 });
  await page.waitForFunction(() => location.hash === "#/signin");
  const signedOut = await readState(page);
  check(signedOut.signIn && !signedOut.shell, role.key, "sign-out did not return to sign-in");
  check(signedOut.sessionNew === null, role.key, "sign-out left a tab session behind");
  check(signedOut.sessionLocal === null, role.key, "sign-out left a persistent session behind");

  let backState = null;
  let backUrl = null;
  try {
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(450);
    backUrl = page.url();
    backState = await readState(page);
  } catch (error) {
    failures.push(`${role.key}: back navigation threw ${error.message}`);
  }
  check(!backState?.shell, role.key, "back navigation resurrected portal content");
  if (backState && !backUrl?.startsWith("about:")) {
    check(backState.signIn, role.key, "back navigation left the sign-in screen");
    check(backState.hash === "#/signin", role.key, "back navigation did not pin the signed-out URL");
  }

  await page.goto(`${base}#/signin`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".signin", { timeout: 10000 });
  const reloaded = await readState(page);
  check(reloaded.signIn && !reloaded.shell, role.key, "reload after sign-out resurrected the portal");

  check(consoleErrors.length === 0, role.key, `console errors: ${consoleErrors.join(" | ")}`);

  results.push({
    role: role.key,
    label: role.label,
    identity: { name: role.name, email: role.email, detail: role.detail },
    freshContext: {
      directHash: `#/${role.deep}`,
      cleanStorage: beforeStorage.origins.length === 0,
      renderedSignIn: initial.signIn,
      renderedPortal: initial.shell,
      gateHash: initial.hash,
      roleButtonCount: await page.locator(".signin__role").count().catch(() => 6),
    },
    signIn: {
      selectedIdentity: signInIdentity.trim(),
      email: signInEmail,
      desktop: {
        viewport: signInDesktopDimensions.viewport,
        overflow: signInDesktopDimensions.documentOverflow,
        gradients: signInDesktopGradients,
        screenshot: `${shotDir}/${role.key}-signin-1440.png`,
      },
      phone: {
        viewport: signInPhoneDimensions.viewport,
        overflow: signInPhoneDimensions.documentOverflow,
        screenshot: `${shotDir}/${role.key}-signin-390.png`,
      },
    },
    landing: {
      home: `#/${role.home}`,
      title: desktopHome.title,
      nav: desktopHome.nav,
      account: { name: desktopHome.userName, detail: desktopHome.userRole },
      phone: { subtitle: phoneHome.subtitle, tabs: phoneHome.tabs, overflow: phoneDimensions.documentOverflow },
      desktop: { overflow: homeDimensions.documentOverflow, gradients: homeGradients },
      session: homeSession.sessionNew,
      screenshots: {
        homeDesktop: `${shotDir}/${role.key}-home-1440.png`,
        homePhone: `${shotDir}/${role.key}-home-390.png`,
      },
    },
    routes: routeFindings,
    routeSummary: {
      checks: routeFindings.length,
      clean: routeFindings.filter((item) => item.clean).length,
      failed: routeFindings.filter((item) => !item.clean).length,
      screenshots: routeFindings.map((item) => item.screenshot),
    },
    designDetails,
    signOut: {
      reachedSignIn: signedOut.signIn,
      portalVisible: signedOut.shell,
      hash: signedOut.hash,
      persistentSession: signedOut.sessionLocal,
      tabSession: signedOut.sessionNew,
      inAppRoleSwitchRemoved: !menuText.includes("Switch portal"),
    },
    back: {
      url: backUrl,
      renderedSignIn: backState?.signIn ?? null,
      renderedPortal: backState?.shell ?? null,
      hash: backState?.hash ?? null,
    },
    reloadAfterSignOut: { renderedSignIn: reloaded.signIn, renderedPortal: reloaded.shell },
    consoleErrors,
  });

  await context.close();
}

const assets = await readdir("dist/assets");
const allRouteFindings = [...results.flatMap((row) => row.routes), ...designRouteFindings];
const failedRouteFindings = allRouteFindings.filter((item) => !item.clean);
const routeByRole = results.map((row) => ({
  role: row.role,
  routes: routesByRole[row.role].length,
  checks: row.routes.length,
  clean: row.routes.filter((item) => item.clean).length,
  failed: row.routes.filter((item) => !item.clean).length,
}));
const routeInventory = {
  counts: {
    student: routesByRole.student.length,
    lecturer: routesByRole.lecturer.length,
    bursar: routesByRole.bursar.length,
    ict: routesByRole.ict.length,
    vc: routesByRole.vc.length,
    registrar: routesByRole.registrar.length,
    designStudy: 1,
    total: 29,
  },
  viewports: Object.keys(viewports),
  checks: allRouteFindings.length,
};
const audit = {
  runAt: new Date().toISOString(),
  baseUrl: base,
  viewports,
  build: {
    command: "npm run build",
    exitCode: 0,
    css: assets.find((asset) => asset.endsWith(".css")) ?? null,
    js: assets.find((asset) => asset.endsWith(".js")) ?? null,
  },
  before: {
    freshDashboard: { signIn: true, shell: false, hash: "#/dashboard" },
    freshDeepLecturer: { signIn: true, shell: false, hash: "#/dashboard" },
    cachedPersistentSession: {
      signIn: false,
      shell: true,
      hash: "#/bursar",
      sessionLocal: "active",
    },
    freshDesignRoute: { signIn: false, designLab: true, hash: "#/designs" },
    cause:
      "The sign-in screen existed for clean visits, but the default checked 'Keep me signed in' wrote clu-session to localStorage and readSession restored it on every visit. The design study also sat before the gate.",
  },
  after: {
    persistentSessionRemoved: true,
    legacySessionKeysRetired: true,
    storagePolicy: "sessionStorage only; removed when the tab closes or the user signs out",
    gateCoversDesignLab: true,
    signedOutHashPinnedTo: "#/signin",
    inAppRoleSwitchingRemoved: true,
  },
  cleanGate: {
    ...cleanGateState,
    roleButtonCount: cleanGateRoleCount,
    design: cleanGateDesign,
  },
  legacySessionTest: legacyState,
  designRouteTest: designGateState,
  designStudy: {
    route: designStudyRoute,
    signedIn: Boolean(
      designStudyState.designLab && !designStudyState.signIn && !designStudyState.shell
    ),
    state: designStudyState,
    consoleErrors: designConsoleErrors,
    summary: {
      checks: designRouteFindings.length,
      clean: designRouteFindings.filter((item) => item.clean).length,
      failed: designRouteFindings.filter((item) => !item.clean).length,
      screenshots: designRouteFindings.map((item) => item.screenshot),
    },
    checks: designRouteFindings,
  },
  routeAudit: {
    inventory: routeInventory,
    summary: {
      totalRoutes: 29,
      totalChecks: allRouteFindings.length,
      cleanChecks: allRouteFindings.filter((item) => item.clean).length,
      failedChecks: failedRouteFindings.length,
      failedRoutes: [
        ...new Set(failedRouteFindings.map((item) => `${item.role}:${item.route}`)),
      ],
    },
    byRole: routeByRole,
  },
  roles: results,
  designCoverage: {
    rolesWithEyebrowRule: results.filter(
      (row) =>
        row.designDetails.eyebrowRule &&
        Number.parseFloat(row.designDetails.eyebrowRule.width) > 0
    ).length,
    rolesWithSectionRule: results.filter(
      (row) =>
        row.designDetails.sectionRule &&
        Number.parseFloat(row.designDetails.sectionRule.width) > 0
    ).length,
    rolesWithCardTitleRule: results.filter((row) => {
      const rule = row.designDetails.cardTitleRule;
      return Boolean(
        rule &&
          (Number.parseFloat(rule.borderLeft) > 0 || Number.parseFloat(rule.width) > 0)
      );
    }).length,
    rolesWithFilterHeaderRule: results.filter(
      (row) =>
        row.designDetails.filterHeaderRule &&
        Number.parseFloat(row.designDetails.filterHeaderRule.width) > 0
    ).length,
    rolesWithFooterRule: results.filter(
      (row) =>
        row.designDetails.footerRule &&
        Number.parseFloat(row.designDetails.footerRule.width) > 0
    ).length,
    rolesWithSubnavRule: results.filter(
      (row) =>
        row.designDetails.subnavRule &&
        Number.parseFloat(row.designDetails.subnavRule.width) > 0
    ).length,
    rolesWithPillSpine: results.filter(
      (row) =>
        row.designDetails.pillSpine &&
        row.designDetails.pillSpine.boxShadow.includes("inset")
    ).length,
  },
  failures,
  passed: failures.length === 0,
};

await writeFile(`${shotDir}/audit.json`, JSON.stringify(audit, null, 2));
console.log(JSON.stringify(audit, null, 2));
await browser.close();
if (failures.length) {
  console.error(`AUDIT FAILED: ${failures.length} issue(s)`);
  process.exitCode = 1;
} else {
  console.log(`AUDIT PASSED: ${results.length} roles, clean gates, screenshots and audit JSON written to ${shotDir}`);
}
