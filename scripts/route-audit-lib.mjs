export const routesByRole = {
  student: [
    "dashboard",
    "timetable",
    "courses",
    "results",
    "assignments",
    "attendance",
    "payments",
    "accommodation",
    "requests/transcript",
    "requests/proficiency",
    "requests/verification",
    "evaluation",
    "medicals",
    "feedback",
    "profile",
    "settings",
  ],
  lecturer: ["lecturer", "lecturer/courses", "lecturer/attendance"],
  bursar: ["bursar", "bursar/ledger", "bursar/fees"],
  ict: ["ict", "ict/users", "ict/audit"],
  vc: ["vc", "vc/approvals"],
  registrar: ["registrar"],
};

export const designStudyRoute = "designs";

export const routeSlug = (route) => route.replaceAll("/", "-");

export async function scanRoute(page, { kind = "portal" } = {}) {
  return page.evaluate((kind) => {
    const all = [...document.querySelectorAll("body *")];
    const isDesign = kind === "design";
    const specimenRoot = isDesign ? document.querySelector(".lab__stage") : null;

    const describe = (el) => {
      const id = el.id ? `#${el.id}` : "";
      const raw = typeof el.className === "string" ? el.className.trim() : "";
      const classes = raw
        ? "." + raw.split(/\s+/).slice(0, 4).join(".")
        : "";
      return `${el.tagName.toLowerCase()}${id}${classes}`;
    };

    const isVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return (
        rect.width > 2 &&
        rect.height > 2 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01
      );
    };

    const isSpecimen = (el) =>
      Boolean(specimenRoot && specimenRoot !== el && specimenRoot.contains(el));

    const alphaOf = (color) => {
      if (!color || color === "transparent") return 0;
      if (color.startsWith("rgba")) {
        const parts = color.slice(5, -1).split(",");
        return Number(parts[3] ?? 1);
      }
      const slash = color.match(/\/\s*([\d.]+)\s*\)/);
      if (slash) return Number(slash[1]);
      return 1;
    };

    const px = (value, rect) => {
      if (!value) return 0;
      if (value.endsWith("%")) {
        return (Number.parseFloat(value) / 100) * Math.min(rect.width, rect.height);
      }
      return Number.parseFloat(value) || 0;
    };

    const radii = (el, rect) => {
      const style = getComputedStyle(el);
      const values = [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ];
      return {
        raw: values,
        px: Math.max(...values.map((value) => px(value, rect))),
        circle: values.some((value) => value === "50%"),
        fullyRounded: values.some((value) => value === "999px" || value === "50%"),
      };
    };

    const gradients = [];
    const translucent = [];
    const glossy = [];
    const pillControls = [];
    const oversizedRadii = [];
    const specimenExcluded = [];

    for (const el of all) {
      if (!isVisible(el)) continue;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const node = describe(el);

      const inspectBackground = (pseudo) => {
        const pseudoStyle = getComputedStyle(el, pseudo);
        if (pseudo && pseudoStyle.content === "none") return;
        const image = pseudoStyle.backgroundImage;
        if (image && image.includes("gradient")) {
          gradients.push({ node, pseudo: pseudo || null, backgroundImage: image });
        }
      };

      inspectBackground(null);
      inspectBackground("::before");
      inspectBackground("::after");

      if (!isSpecimen(el) && rect.width * rect.height >= 600) {
        const alpha = alphaOf(style.backgroundColor);
        if (alpha > 0.02 && alpha < 0.99) {
          const fullViewportOverlay =
            (style.position === "fixed" || style.position === "absolute") &&
            rect.width >= window.innerWidth * 0.9 &&
            rect.height >= window.innerHeight * 0.9;
          if (!fullViewportOverlay && !/scrim|overlay/i.test(node)) {
            translucent.push({
              node,
              background: style.backgroundColor,
              alpha: Number(alpha.toFixed(2)),
              area: Math.round(rect.width * rect.height),
            });
          }
        }
      }

      const backdrop = style.backdropFilter || style.webkitBackdropFilter;
      if (!isSpecimen(el) && backdrop && backdrop !== "none") {
        glossy.push({ node, kind: "backdrop-filter", value: backdrop });
      }
      if (
        !isSpecimen(el) &&
        style.boxShadow !== "none" &&
        /rgba\(\s*255,\s*255,\s*255/i.test(style.boxShadow)
      ) {
        glossy.push({ node, kind: "inset-highlight", value: style.boxShadow });
      }

      if (isSpecimen(el)) {
        const radius = radii(el, rect);
        if (radius.px > 12 || radius.fullyRounded) specimenExcluded.push({ node });
        continue;
      }

      const area = rect.width * rect.height;
      const radius = radii(el, rect);
      const isControl = el.matches(
        "button, a, input, select, textarea, [role='button'], .pill, .btn, .seg__btn, .rowbtn, .tabbar__item, .card__link"
      );

      if (isControl && rect.width > 18 && rect.height > 12) {
        const isPill =
          radius.fullyRounded ||
          (radius.px >= rect.height / 2 - 1 && rect.width >= rect.height * 1.1);
        if (isPill) {
          pillControls.push({
            node,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            radius: radius.raw,
          });
        } else if (radius.px > 8) {
          oversizedRadii.push({
            node,
            kind: "control",
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            radius: radius.raw,
          });
        }
      } else if (area >= 5000 && radius.px > 12 && !radius.circle) {
        oversizedRadii.push({
          node,
          kind: "surface",
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          radius: radius.raw,
        });
      }
    }

    const navSelectors = [
      ".quadnav__tab",
      ".quadsubnav__link",
      ".tabbar__item",
      ".mobilebar__brand",
      ".mobilebar__sub",
      ".drawerlink",
      ".lab__tab b",
      ".lab__tab small",
      ".lab__device button",
      ".lab__barname",
      ".lab__barworld",
    ];
    const navTruncated = [];
    for (const el of document.querySelectorAll(navSelectors.join(","))) {
      if (!isVisible(el)) continue;
      if (el.scrollWidth > el.clientWidth + 1) {
        navTruncated.push({
          node: describe(el),
          text: el.textContent?.trim().slice(0, 80) ?? "",
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
        });
      }
    }

    const pageNode = document.querySelector(".page");
    const labNode = document.querySelector(".lab");
    const overflow = {
      document: Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth
      ) - window.innerWidth,
      page: pageNode ? pageNode.scrollWidth - pageNode.clientWidth : 0,
      lab: labNode ? labNode.scrollWidth - labNode.clientWidth : 0,
    };

    const rule = (selector, pseudo) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const style = getComputedStyle(el, pseudo);
      return {
        selector,
        pseudo: pseudo || null,
        content: style.content,
        width: style.width,
        height: style.height,
        background: style.backgroundColor,
        borderLeftWidth: style.borderLeftWidth,
        boxShadow: style.boxShadow,
      };
    };

    const eyebrowSelector = isDesign
      ? ".lab__kicker"
      : ".eyebrow, .student-hero__eyebrow";
    const headerSelector = isDesign
      ? ".lab__intro"
      : ".page__head, .workspace-hero, .page .hero, .student-hero";
    const cardTitleSelector = isDesign ? ".lab__barname" : ".card__title";

    const eyebrowRule = rule(eyebrowSelector, "::before");
    const sectionRule = headerSelector ? rule(headerSelector, "::after") : null;
    const cardTitles = [...document.querySelectorAll(cardTitleSelector)];
    const filterHeaders = isDesign
      ? []
      : [...document.querySelectorAll(".card__hd--filters")];
    const cardTitleDetails = {
      applicable: cardTitles.length > 0 || filterHeaders.length > 0,
      titles: cardTitles.map((el) => ({
        node: describe(el),
        borderLeftWidth: getComputedStyle(el).borderLeftWidth,
      })),
      filterHeaders: filterHeaders.map((el) => ({
        node: describe(el),
        ruleWidth: getComputedStyle(el, "::before").width,
      })),
    };
    cardTitleDetails.present =
      (!cardTitles.length ||
        cardTitleDetails.titles.every((item) => Number.parseFloat(item.borderLeftWidth) > 0)) &&
      (!filterHeaders.length ||
        cardTitleDetails.filterHeaders.every((item) => Number.parseFloat(item.ruleWidth) > 0));

    const pillSelector = isDesign ? ".lab__shipTag, .lab__notShipped" : ".pill";
    const pills = [...document.querySelectorAll(pillSelector)];
    const pillDetails = {
      applicable: pills.length > 0,
      pills: pills.map((el) => ({
        node: describe(el),
        boxShadow: getComputedStyle(el).boxShadow,
      })),
    };
    pillDetails.present =
      pills.length > 0 &&
      pillDetails.pills.every((item) => item.boxShadow !== "none" && item.boxShadow.includes("inset"));

    const footerNode = document.querySelector(isDesign ? ".lab__notes" : ".foot");
    const footerHairline = footerNode
      ? getComputedStyle(footerNode)[isDesign ? "borderBottomWidth" : "borderTopWidth"]
      : "0px";
    const navHairline = isDesign
      ? document.querySelector(".lab__bar")
        ? getComputedStyle(document.querySelector(".lab__bar")).borderBottomWidth
        : "0px"
      : [...document.querySelectorAll(".quadhead, .mobilebar")].some(
          (el) => Number.parseFloat(getComputedStyle(el).borderBottomWidth) > 0
        )
        ? "1px"
        : "0px";
    const cardNode = document.querySelector(isDesign ? ".lab__bar" : ".card__hd");
    const cardHairline = cardNode
      ? getComputedStyle(cardNode).borderBottomWidth
      : "0px";

    const detailMissing = [];
    const eyebrowPresent =
      eyebrowRule &&
      eyebrowRule.content !== "none" &&
      Number.parseFloat(eyebrowRule.width) > 0;
    if (!eyebrowPresent) detailMissing.push("eyebrow rule");
    if (
      !sectionRule ||
      sectionRule.content === "none" ||
      Number.parseFloat(sectionRule.width) <= 0
    ) {
      detailMissing.push("section rule");
    }
    if (cardTitleDetails.applicable && !cardTitleDetails.present) {
      detailMissing.push("card-title rule");
    }
    if (pillDetails.applicable && !pillDetails.present) {
      detailMissing.push("status-chip spine");
    }
    if (Number.parseFloat(footerHairline) <= 0) detailMissing.push("footer hairline");
    if (isDesign) {
      if (Number.parseFloat(cardHairline) <= 0) detailMissing.push("card hairline");
    } else if (Number.parseFloat(navHairline) <= 0) {
      detailMissing.push("nav hairline");
    }

    const clean =
      gradients.length === 0 &&
      translucent.length === 0 &&
      glossy.length === 0 &&
      pillControls.length === 0 &&
      oversizedRadii.length === 0 &&
      navTruncated.length === 0 &&
      Math.max(overflow.document, overflow.page, overflow.lab) <= 1 &&
      detailMissing.length === 0;

    return {
      title: document.title,
      hash: location.hash,
      clean,
      gradients: gradients.slice(0, 20),
      translucent: translucent.slice(0, 20),
      glossy: glossy.slice(0, 20),
      pillControls: pillControls.slice(0, 20),
      oversizedRadii: oversizedRadii.slice(0, 20),
      navTruncated: navTruncated.slice(0, 20),
      overflow,
      details: {
        eyebrowRule,
        sectionRule,
        cardTitleDetails,
        pillDetails,
        hairlines: {
          footer: footerHairline,
          nav: navHairline,
          card: cardHairline,
        },
        missing: detailMissing,
      },
      specimenExcluded: specimenExcluded.slice(0, 20),
    };
  }, kind);
}
