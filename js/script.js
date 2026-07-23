(function () {
  "use strict";

  const config = window.INVITATION_CONFIG || {};
  const type = String(config.eventType || "wedding").toLowerCase() === "birthday" ? "birthday" : "wedding";
  const event = Object.assign({}, config[type] || {});
  const images = Object.assign({}, config.images || {}, event.images || {});
  const theme = event.theme || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const has = (value) => value !== undefined && value !== null && String(value).trim() !== "";
  const query = new URLSearchParams(window.location.search);
  const guestSlug = getGuestSlug();
  let guestName = "Dear Guest";
  let openedSessionKey = "";
  let rsvpStorageKey = "";
  const eventStart = new Date(`${config.eventDate || ""}T${config.startTime || "00:00"}`);
  const eventEnd = new Date(`${config.eventDate || ""}T${config.endTime || config.startTime || "23:59"}`);
  let ambientAudio = null;
  let youtubeMusic = null;
  const labels = {
    wedding: {
      eventLabel: "Wedding Invitation",
      welcomeKicker: "With joyful hearts",
      welcomeTitle: "A celebration of love",
      storyKicker: "Our Story",
      storyTitle: "How forever began",
      detailsTitle: "Join us as we say yes to forever",
      countdownTitle: "Until the day",
      galleryTitle: "Frames of the celebration",
      programTitle: "Wedding Program",
      rsvpTitle: "Celebrate with us"
    },
    birthday: {
      eventLabel: "Birthday Invitation",
      welcomeKicker: "With grateful hearts",
      welcomeTitle: "A celebration of life",
      storyKicker: "Her Story",
      storyTitle: "Sixty years of beautiful memories",
      detailsTitle: "An evening arranged with love",
      countdownTitle: "Until the celebration",
      galleryTitle: "The Celebrant",
      programTitle: "Birthday Program",
      rsvpTitle: "Celebrate this milestone with us"
    }
  }[type];

  function text(path) {
    const values = {
      names: event.names,
      openingTitle: config.openingTitle,
      guestName,
      subtitle: event.subtitle,
      introMessage: event.introMessage,
      eventLabel: labels.eventLabel,
      welcomeKicker: labels.welcomeKicker,
      welcomeTitle: labels.welcomeTitle,
      storyKicker: labels.storyKicker,
      storyTitle: labels.storyTitle,
      detailsTitle: labels.detailsTitle,
      countdownTitle: labels.countdownTitle,
      galleryTitle: labels.galleryTitle,
      videoTitle: event.mainTitle || event.names,
      programTitle: labels.programTitle,
      rsvpTitle: labels.rsvpTitle,
      rsvpInstructions: config.rsvpInstructions,
      rsvpDeadline: has(config.rsvpDeadline) ? `Please respond by ${formatDate(config.rsvpDeadline)}.` : "",
      giftTitle: event.gift && event.gift.title,
      giftMessage: event.gift && event.gift.message,
      hashtag: event.hashtag,
      footerNames: event.names,
      footerMessage: config.footerMessage,
      credit: config.credit,
      displayDate: formatDate(config.eventDate)
    };
    return values[path] || "";
  }

  async function init() {
    guestName = await resolveGuestName();
    updateGuestStorageKeys();
    applyTheme();
    fillText();
    setupGuestNameFit();
    fillMeta();
    resetLocalRsvpIfNeeded();
    setupOpening();
    renderHero();
    renderStory();
    renderDetails();
    renderCountdown();
    renderRsvpTracker();
    renderGallery();
    renderPhotoBreaks();
    renderVideo();
    renderProgram();
    renderRsvp();
    renderGift();
    renderGuestGuide();
    setupMusic();
    setupNav();
    setupReveals();
    addStructuredData();
    hideEmptySections();
  }

  function applyTheme() {
    const root = document.documentElement;
    const map = {
      primaryColor: "--primary",
      secondaryColor: "--secondary",
      accentColor: "--accent",
      textColor: "--text",
      backgroundColor: "--bg",
      headingFont: "--heading-font",
      bodyFont: "--body-font",
      borderRadius: "--radius",
      overlayOpacity: "--overlay-opacity",
      sectionSpacing: "--section-spacing"
    };
    Object.keys(map).forEach((key) => has(theme[key]) && root.style.setProperty(map[key], theme[key]));
    if (has(images.background)) root.style.setProperty("--texture-image", `url("../${images.background}")`);
    root.style.setProperty("--hero-position-desktop", images.heroPositionDesktop || "center center");
    root.style.setProperty("--hero-position-mobile", images.heroPositionMobile || "center center");
  }

  function fillText() {
    $$("[data-text]").forEach((node) => {
      if (node.dataset.text === "guestName") {
        node.innerHTML = guestGreetingHtml(text(node.dataset.text));
      } else {
        node.textContent = text(node.dataset.text);
      }
      if (!has(node.textContent)) node.hidden = true;
    });
    $$("[data-opening-name]").forEach((node) => {
      node.innerHTML = openingNameHtml(event.names);
      if (!has(node.textContent)) node.hidden = true;
    });
    $$("[data-html]").forEach((node) => {
      const html = event[node.dataset.html] || "";
      node.innerHTML = html;
      if (!has(html)) node.hidden = true;
    });
  }

  function openingNameHtml(value) {
    const name = String(value || "").trim();
    const match = name.match(/^(.+?)\s+(\d+(?:st|nd|rd|th)\s+Birthday)$/i);
    if (!match) return escapeHtml(name);
    return `<span class="opening__name-main">${escapeHtml(match[1])}</span><span class="opening__name-sub">sixtieth birthday</span>`;
  }

  function guestGreetingHtml(value) {
    const greeting = String(value || "").trim();
    const match = greeting.match(/^dear\s+(.+)$/i);
    if (!match) return `<span class="opening__guest-name">${escapeHtml(greeting)}</span>`;
    return `<span class="opening__guest-stack"><span class="opening__guest-kicker">Dear</span><span class="opening__guest-name">${escapeHtml(match[1])}</span></span>`;
  }

  function setupGuestNameFit() {
    const fit = () => $$(".opening__guest-line").forEach(fitGuestName);
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fit, 120);
    });
  }

  function fitGuestName(line) {
    const name = $(".opening__guest-name", line);
    if (!name) return;
    name.style.fontSize = "";
    requestAnimationFrame(() => {
      const lineStyle = getComputedStyle(line);
      const available = line.clientWidth - parseFloat(lineStyle.paddingLeft) - parseFloat(lineStyle.paddingRight);
      const current = parseFloat(getComputedStyle(name).fontSize);
      if (!available || !current || name.scrollWidth <= available) return;
      const next = Math.max(21, current * (available / name.scrollWidth) * 0.96);
      name.style.fontSize = `${next.toFixed(2)}px`;
    });
  }

  function fillMeta() {
    const seo = Object.assign({}, config.seo || {}, event.seo || {});
    document.title = seo.pageTitle || `${event.names || "Invitation"} | ${event.mainTitle || ""}`;
    setMeta("description", seo.description || event.subtitle);
    setMeta("theme-color", seo.themeColor || theme.accentColor);
    setMeta("og:title", seo.ogTitle || event.names, true);
    setMeta("og:description", seo.ogDescription || event.subtitle, true);
    setMeta("og:image", absoluteUrl(seo.ogImage || images.hero), true);
  }

  function setMeta(name, content, property) {
    if (!has(content)) return;
    const attr = property ? "property" : "name";
    const node = document.querySelector(`meta[${attr}="${name}"]`);
    if (node) node.setAttribute("content", content);
  }

  function setupOpening() {
    const opening = $("#openingScreen");
    const panel = $(".opening__panel", opening);
    if (query.has("resetInvite")) {
      sessionStorage.removeItem(openedSessionKey);
      sessionStorage.removeItem("musicPlaying");
    }
    const opened = sessionStorage.getItem(openedSessionKey) === "true";
    if (!config.enableOpeningScreen || opened) {
      opening.hidden = true;
      return;
    }
    opening.hidden = false;
    opening.classList.add("is-invitation-step");
    if (panel) panel.hidden = false;
    $("[data-bg='hero']", opening).style.backgroundImage = `url("${images.profile || images.hero || ""}")`;
    $("#openInvitation").addEventListener("click", () => {
      sessionStorage.setItem(openedSessionKey, "true");
      opening.classList.add("is-leaving");
      opening.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: "ease" }).onfinish = () => {
        opening.hidden = true;
        showInvitationFromTop();
      };
    });
  }

  function showInvitationFromTop() {
    if (window.location.hash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    const hero = $("#home");
    if (hero) hero.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }

  function renderHero() {
    $("#heroImage").src = images.hero || "";
    $("#heroImage").alt = `${event.names || "Event"} hero image`;
    if (has(images.mobileHero)) $("#heroMobileSource").srcset = images.mobileHero;
    $("#profilePhoto").src = images.profile || images.hero || "";
    $("#profilePhoto").alt = `${event.names || "Event"} portrait`;
  }

  function renderStory() {
    const wrap = $("#storyTimeline");
    (event.storyTimeline || []).forEach((item) => {
      wrap.insertAdjacentHTML("beforeend", `<div class="timeline__item"><span class="timeline__year">${escapeHtml(item.year)}</span><span>${escapeHtml(item.text)}</span></div>`);
    });
  }

  function renderDetails() {
    const timeText = `${formatTime(config.startTime)}${has(config.endTime) ? ` - ${formatTime(config.endTime)}` : ""}`;
    const details = [
      { eyebrow: "Celebration", title: event.names, text: event.subtitle, feature: true },
      { eyebrow: "Date and Time", title: formatDate(config.eventDate), text: timeText, highlightText: true },
      { eyebrow: "Venue", title: config.venueName, text: config.venueAddress },
      { eyebrow: "Motif", title: "Black and Silver" },
      { eyebrow: "Attire", title: event.dressCode, text: "A classic black and silver evening." },
      { eyebrow: "RSVP", title: has(config.rsvpDeadline) ? `Until ${formatDate(config.rsvpDeadline)}` : "", text: config.rsvpInstructions }
    ].filter((item) => has(item.title) || has(item.text) || (item.rules && item.rules.length));
    $("#detailsGrid").innerHTML = details.map((item) => {
      const rules = (item.rules || []).map((rule) => `<li>${escapeHtml(rule)}</li>`).join("");
      return `<article class="detail-card${item.feature ? " detail-card--feature" : ""}${item.highlightText ? " detail-card--time" : ""}"><span>${escapeHtml(item.eyebrow)}</span><strong>${escapeHtml(item.title || "")}</strong>${has(item.text) ? `<p>${escapeHtml(item.text)}</p>` : ""}${rules ? `<ul>${rules}</ul>` : ""}</article>`;
    }).join("");
    setLink("#detailsRsvpButton", config.rsvpLink);
  }

  function renderCountdown() {
    const grid = $("#countdownGrid");
    const passed = $("#eventPassed");
    const render = () => {
      const diff = eventStart.getTime() - Date.now();
      if (!Number.isFinite(diff) || diff <= 0) {
        grid.hidden = true;
        passed.hidden = false;
        passed.textContent = config.passedMessage || "Thank you for celebrating with us.";
        return;
      }
      const parts = [
        ["Days", Math.floor(diff / 86400000)],
        ["Hours", Math.floor(diff / 3600000) % 24],
        ["Minutes", Math.floor(diff / 60000) % 60],
        ["Seconds", Math.floor(diff / 1000) % 60]
      ];
      grid.innerHTML = parts.map(([label, value]) => `<div class="countdown-unit"><strong>${String(value).padStart(2, "0")}</strong><span>${label}</span></div>`).join("");
    };
    render();
    setInterval(render, 1000);
  }

  function renderRsvpTracker() {
    const tracker = config.rsvpTracker || {};
    if (!tracker.enabled) return hide("#rsvpTracker");

    const grid = $("#trackerGrid");
    const note = $("#trackerNote");
    let current = trackerData(tracker);

    const render = (data) => {
      const accepted = toCount(data.accepted);
      const declined = toCount(data.declined);
      const total = Math.max(toCount(data.totalGuests), accepted + declined);
      const pending = Math.max(total - accepted - declined, 0);
      const responded = accepted + declined;
      const items = [
        ["Accepted", accepted],
        [data.pendingLabel || "Not Yet Responded", pending],
        ["Declined", declined]
      ];

      grid.innerHTML = items.map(([label, value]) => {
        const percent = total ? Math.round((value / total) * 100) : 0;
        return `
          <article class="tracker-card">
            <strong>${String(value).padStart(2, "0")}</strong>
            <span>${escapeHtml(label)}</span>
            <div class="tracker-bar" aria-hidden="true"><i style="width: ${percent}%"></i></div>
            <small>${percent}% invited</small>
          </article>
        `;
      }).join("");

      note.textContent = `${responded} of ${total} guests have responded. ${data.note || ""}`.trim();
    };

    const refresh = async () => {
      const trackerUrl = tracker.appsScriptUrl || tracker.apiUrl;
      if (safeUrl(trackerUrl)) {
        try {
          current = Object.assign({}, current, await fetchJsonp(trackerUrl, { action: "stats" }));
        } catch (error) {}
      }
      render(current);
    };

    refresh();
    setInterval(refresh, Math.max(toCount(tracker.refreshSeconds), 5) * 1000);
  }

  function renderGallery() {
    const gallery = uniqueGalleryItems(images.gallery || []);
    const grid = $("#galleryGrid");
    let active = 0;
    const galleryRoom = $("#galleryRoom");
    const galleryRoomClose = $("#galleryRoomClose");
    const galleryEnter = $("#galleryEnter");
    const galleryPreviewImage = $("#galleryPreviewImage");
    const lightbox = $("#lightbox");
    const lightboxCounter = $("#lightboxCounter");
    const lightboxTrack = $("#lightboxTrack");
    const closeButton = $("#lightboxClose");
    if (galleryPreviewImage && gallery[0]) {
      galleryPreviewImage.src = gallery[0].src;
      galleryPreviewImage.alt = gallery[0].alt || gallery[0].caption || "Gallery preview";
    }
    grid.innerHTML = gallery.map((item, index) => `<button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="Open image ${index + 1}"><img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt || item.caption || "Gallery image")}" loading="lazy"></button>`).join("");
    lightboxTrack.innerHTML = gallery.map((item, index) => `
      <figure class="lightbox__slide" data-lightbox-slide="${index}">
        <img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt || item.caption || "Gallery image")}" loading="lazy">
        ${has(item.caption) ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
      </figure>
    `).join("");
    const updateCounter = () => {
      if (lightboxCounter) lightboxCounter.textContent = gallery.length ? `${active + 1} / ${gallery.length}` : "";
    };
    const scrollToActive = () => {
      if (!gallery.length) return;
      const slide = lightboxTrack.querySelector(`[data-lightbox-slide="${active}"]`);
      if (!slide) return;
      lightboxTrack.scrollTo({
        left: slide.offsetLeft,
        behavior: "smooth"
      });
      updateCounter();
    };
    const goTo = (index) => {
      if (!gallery.length) return;
      active = (index + gallery.length) % gallery.length;
      scrollToActive();
    };
    const open = (index) => {
      if (!gallery.length) return;
      active = (index + gallery.length) % gallery.length;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      requestAnimationFrame(() => {
        scrollToActive();
        lightboxTrack.focus({ preventScroll: true });
      });
    };
    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      closeButton.blur();
    };
    const openGalleryRoom = () => {
      if (!gallery.length) return;
      galleryRoom.hidden = false;
      document.body.classList.add("gallery-room-open");
      galleryRoomClose.focus({ preventScroll: true });
    };
    const closeGalleryRoom = () => {
      galleryRoom.hidden = true;
      document.body.classList.remove("gallery-room-open");
      galleryEnter.focus({ preventScroll: true });
    };
    galleryEnter.addEventListener("click", openGalleryRoom);
    galleryRoomClose.addEventListener("click", closeGalleryRoom);
    grid.addEventListener("click", (eventClick) => {
      const button = eventClick.target.closest("[data-gallery-index]");
      if (button) open(Number(button.dataset.galleryIndex));
    });
    document.addEventListener("click", (eventClick) => {
      const trigger = eventClick.target.closest("[data-gallery-index]");
      if (trigger && !grid.contains(trigger)) open(Number(trigger.dataset.galleryIndex));
      if (eventClick.target === lightbox) close();
      if (eventClick.target === galleryRoom) closeGalleryRoom();
    });
    document.addEventListener("keydown", (eventKey) => {
      const trigger = eventKey.target.closest && eventKey.target.closest("[data-gallery-index]");
      if (trigger && (eventKey.key === "Enter" || eventKey.key === " ")) {
        eventKey.preventDefault();
        open(Number(trigger.dataset.galleryIndex));
      }
    });
    closeButton.addEventListener("click", close);
    $("#lightboxPrev").addEventListener("click", () => {
      goTo(active - 1);
    });
    $("#lightboxNext").addEventListener("click", () => {
      goTo(active + 1);
    });
    document.addEventListener("keydown", (eventKey) => {
      if (lightbox.hidden) return;
      if (eventKey.key === "Escape") {
        eventKey.preventDefault();
        close();
      }
      if (eventKey.key === "ArrowLeft") {
        goTo(active - 1);
      }
      if (eventKey.key === "ArrowRight") {
        goTo(active + 1);
      }
    });
    document.addEventListener("keydown", (eventKey) => {
      if (eventKey.defaultPrevented) return;
      if (galleryRoom.hidden || !lightbox.hidden) return;
      if (eventKey.key === "Escape") closeGalleryRoom();
    });
    let startX = 0;
    lightbox.addEventListener("touchstart", (eventTouch) => { startX = eventTouch.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (eventTouch) => {
      const delta = eventTouch.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) {
        goTo(active + (delta < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  function uniqueGalleryItems(items) {
    const seen = new Set();
    return items.filter((item) => {
      const src = item && item.src ? String(item.src).trim() : "";
      if (!src || seen.has(src)) return false;
      seen.add(src);
      return true;
    });
  }

  function renderPhotoBreaks() {
    const gallery = images.gallery || [];
    const photoBreaks = images.photoBreaks || [];
    const strips = $$("[data-photo-strip]");
    if (!gallery.length && !photoBreaks.length) {
      strips.forEach((strip) => { strip.hidden = true; });
      return;
    }
    strips.forEach((strip) => {
      const offset = Number(strip.dataset.photoStrip || 0);
      const customBreak = Array.isArray(photoBreaks[offset]) ? photoBreaks[offset] : null;
      const source = customBreak && customBreak.length ? customBreak : gallery;
      if (!source.length) {
        strip.hidden = true;
        return;
      }
      const start = customBreak ? 0 : offset;
      const selection = [0, 1, 2].map((step) => source[(start + step) % source.length]);
      strip.innerHTML = `
        <div class="photo-break__track reveal">
          ${selection.map((item, index) => `
            <figure class="photo-break__item photo-break__item--${index + 1}"${gallery.findIndex((galleryItem) => galleryItem.src === item.src) >= 0 ? ` role="button" tabindex="0" data-gallery-index="${gallery.findIndex((galleryItem) => galleryItem.src === item.src)}" aria-label="Open celebration photo ${gallery.findIndex((galleryItem) => galleryItem.src === item.src) + 1}"` : ""}>
              <img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt || item.caption || "Celebration photo")}" loading="lazy">
              ${has(item.caption) ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
            </figure>
          `).join("")}
        </div>
      `;
    });
  }

  function renderVideo() {
    const url = config.videoUrl;
    const frame = $("#videoFrame");
    if (!safeUrl(url)) return hide("#videoSection");
    const embed = videoEmbed(url);
    if (!embed) return hide("#videoSection");
    frame.innerHTML = embed;
  }

  function renderProgram() {
    const items = event.program || [];
    $("#programList").innerHTML = items.map((item) => `<div class="program-item"><time>${escapeHtml(item.time || "")}</time><strong>${escapeHtml(item.title || "")}</strong></div>`).join("");
  }

  function renderRsvp() {
    setLink("#rsvpButton", config.rsvpLink);
    setupRsvpFlow();
    const contacts = [
      ["Contact Person", config.contactPerson],
      ["Phone", config.contactNumber ? `<a href="tel:${escapeAttr(config.contactNumber)}">${escapeHtml(config.contactNumber)}</a>` : ""],
      ["Email", config.email ? `<a href="mailto:${escapeAttr(config.email)}">${escapeHtml(config.email)}</a>` : ""]
    ].filter((item) => has(item[1]));
    if (contacts.length) {
      $("#contactCard").innerHTML = contacts.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong>${value}</p>`).join("");
    } else {
      hide("#contactCard");
    }
    if (safeUrl(config.googleFormEmbedUrl)) {
      $("#formWrap").innerHTML = `<iframe title="RSVP form" src="${escapeAttr(config.googleFormEmbedUrl)}" loading="lazy"></iframe>`;
    }
  }

  function renderGift() {
    const gift = event.gift || {};
    if (!gift.enabled) return hide("#giftSection");
    $("#giftDetails").innerHTML = gift.details || "";
    $("#giftToggle").addEventListener("click", () => {
      const details = $("#giftDetails");
      details.hidden = !details.hidden;
      $("#giftToggle").textContent = details.hidden ? "View Gift Details" : "Hide Gift Details";
    });
  }

  function renderGuestGuide() {
    const guide = event.guestGuide || {};
    const rsvpText = has(guide.rsvpNote)
      ? guide.rsvpNote
      : config.rsvpInstructions;
    const guestRules = event.guestRules || [];
    const cards = [
      { title: "Kindly note", rules: guestRules, wide: true },
      { title: "Snap & Share", text: guide.snapShare, accent: event.hashtag },
      { title: "RSVP", text: rsvpText, link: { label: "RSVP Now", href: config.rsvpLink, primary: true } },
      { title: guide.locationTitle || "Location Guide", text: [config.venueName, config.venueAddress].filter(Boolean).join(" - "), link: { label: "Open Location", href: config.googleMapsLink }, locationPreview: true }
    ].filter((card) => has(card.title) && (has(card.text) || (card.rules && card.rules.length) || has(card.accent) || (card.link && safeUrl(card.link.href))));

    $("#guideGrid").innerHTML = cards.map((card) => `
      <article class="guide-card${card.wide ? " guide-card--wide" : ""}">
        <h3>${escapeHtml(card.title)}</h3>
        ${has(card.text) ? `<p>${escapeHtml(card.text)}</p>` : ""}
        ${(card.rules || []).length ? `<ul>${card.rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>` : ""}
        ${has(card.accent) ? `<strong>${escapeHtml(card.accent)}</strong>` : ""}
        ${card.link && safeUrl(card.link.href) ? `<a class="guide-link${card.link.primary ? " guide-link--primary" : ""}"${card.link.primary ? " data-rsvp-action" : ""} href="${escapeAttr(card.link.href)}" target="_blank" rel="noreferrer">${escapeHtml(card.link.label)}</a>` : ""}
        ${card.locationPreview ? `
          <div class="location-preview" aria-label="Location preview">
            <iframe title="${escapeAttr(config.venueName || "Event venue")} map" src="${escapeAttr(googleMapsEmbedUrl())}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="location-preview__copy">
              <span>${escapeHtml(config.venueName || "Event venue")}</span>
              <small>${escapeHtml(config.venueAddress || "Location details")}</small>
            </div>
          </div>
        ` : ""}
      </article>
    `).join("");

    const faqs = event.faqs || [];
    $("#faqList").innerHTML = faqs.map((item) => `
      <details class="faq-item">
        <summary>${escapeHtml(item.question)}</summary>
        <p>${escapeHtml(item.answer)}</p>
      </details>
    `).join("");
    if (!cards.length && !faqs.length) hide("#guestGuide");
  }

  function setupRsvpFlow() {
    const flow = $("#rsvpFlow");
    const confirmation = $("#rsvpConfirmation");
    if (!flow) return;

    const state = {
      guest: cleanGuestDisplayName(guestName),
      attendance: "accepts",
      guestCount: "1",
      message: "",
      contact: ""
    };

    const showFlow = (eventClick) => {
      if (eventClick) eventClick.preventDefault();
      if (confirmation) confirmation.hidden = true;
      flow.hidden = false;
      renderWelcome();
      flow.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const renderWelcome = () => {
      flow.innerHTML = `
        <article class="rsvp-card">
          <p class="eyebrow">RSVP</p>
          <h3>We're so excited to celebrate with you!</h3>
          <p>Please take a moment to confirm your attendance. This will only take about a minute.</p>
          <button class="btn rsvp-next" type="button" data-rsvp-screen="form">Continue</button>
        </article>
      `;
    };

    const renderForm = () => {
      flow.innerHTML = `
        <article class="rsvp-card">
          <p class="eyebrow">Guest Information</p>
          <h3>Welcome,<br>${escapeHtml(state.guest)}</h3>
          <p>We're delighted to have you as our honored guests. No need to enter your name.</p>

          <div class="rsvp-field">
            <label>Attendance</label>
            <div class="choice-row" role="group" aria-label="Attendance">
              <button class="choice is-selected" type="button" data-attendance="accepts">Joyfully Accepts</button>
              <button class="choice" type="button" data-attendance="declines">Regretfully Declines</button>
            </div>
          </div>

          <div class="rsvp-field" data-attending-only>
            <label>How many guests are attending?</label>
            <div class="choice-row choice-row--compact" role="group" aria-label="Guest count">
              ${[1, 2, 3].map((count) => `<button class="choice${state.guestCount === String(count) ? " is-selected" : ""}" type="button" data-count="${count}">${count}</button>`).join("")}
            </div>
          </div>

          <div class="rsvp-field">
            <label for="birthdayMessage">Message for the Celebrant</label>
            <textarea id="birthdayMessage" rows="5" placeholder="Happy Birthday Teacher!&#10;&#10;May God bless you always.">${escapeHtml(state.message)}</textarea>
          </div>

          <div class="rsvp-field">
            <label for="contactNumber">Contact Number <span>(optional)</span></label>
            <input id="contactNumber" type="tel" value="${escapeAttr(state.contact)}" placeholder="Only if necessary">
          </div>

          <div class="rsvp-actions">
            <button class="btn btn--ghost rsvp-back" type="button" data-rsvp-screen="welcome">Back</button>
            <button class="btn rsvp-review" type="button" data-rsvp-screen="review">Review RSVP</button>
          </div>
        </article>
      `;
      syncAttendanceUi();
      $$("[data-attendance]", flow).forEach((button) => button.addEventListener("click", () => {
        state.attendance = button.dataset.attendance;
        syncAttendanceUi();
      }));
      $$("[data-count]", flow).forEach((button) => button.addEventListener("click", () => {
        state.guestCount = button.dataset.count;
        $$("[data-count]", flow).forEach((item) => item.classList.toggle("is-selected", item === button));
      }));
    };

    const syncAttendanceUi = () => {
      $$("[data-attendance]", flow).forEach((button) => button.classList.toggle("is-selected", button.dataset.attendance === state.attendance));
      const countField = $("[data-attending-only]", flow);
      if (countField) countField.hidden = state.attendance === "declines";
    };

    const renderReview = () => {
      const attendanceLabel = state.attendance === "accepts" ? "Accepts with pleasure" : "Regretfully declines";
      flow.innerHTML = `
        <article class="rsvp-card">
          <p class="eyebrow">Please Review Your RSVP</p>
          <h3>Almost done</h3>
          <div class="review-list">
            <p><span>Guest</span><strong>${escapeHtml(state.guest)}</strong></p>
            <p><span>Attendance</span><strong>${escapeHtml(attendanceLabel)}</strong></p>
            ${state.attendance === "accepts" ? `<p><span>Guests Attending</span><strong>${escapeHtml(state.guestCount)}</strong></p>` : ""}
            <p><span>Birthday Message</span><strong>${escapeHtml(state.message || "No message added")}</strong></p>
            ${has(state.contact) ? `<p><span>Contact Number</span><strong>${escapeHtml(state.contact)}</strong></p>` : ""}
          </div>
          <div class="rsvp-actions">
            <button class="btn btn--ghost rsvp-edit" type="button" data-rsvp-screen="form">Edit</button>
            <button class="btn rsvp-submit" type="button" data-rsvp-screen="submit">Submit RSVP</button>
          </div>
        </article>
      `;
    };

    const submitRsvp = async () => {
      const submitted = Object.assign({}, state, {
        eventName: event.names || "",
        submittedAt: new Date().toISOString(),
        guestLink: cleanShareUrl()
      });
      localStorage.setItem(rsvpStorageKey, JSON.stringify(submitted));
      await sendRsvpToSheet(submitted);
      renderThankYou();
      renderRsvpTracker();
    };

    const renderThankYou = () => {
      const copy = config.rsvpConfirmation || {};
      flow.innerHTML = `
        <article class="rsvp-card rsvp-card--thanks">
          <div class="rsvp-sparkle" aria-hidden="true">\uD83C\uDF89</div>
        <strong>${escapeHtml(copy.title || "Thank You!")}</strong>
          <p>${escapeHtml(copy.message || "Your RSVP has been received. We're truly grateful you'll be celebrating this special milestone with us. We look forward to sharing laughter, memories, and a wonderful evening together.")}</p>
          <small>${escapeHtml(copy.datePrefix || "See you on")}</small>
          <time>${escapeHtml(formatDate(config.eventDate))}</time>
        </article>
      `;
      flow.hidden = false;
      flow.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    ["#rsvpButton", "#detailsRsvpButton"].forEach((selector) => {
      const button = $(selector);
      if (button) button.addEventListener("click", showFlow);
    });
    document.addEventListener("click", (eventClick) => {
      const link = eventClick.target.closest("[data-rsvp-action]");
      if (link) showFlow(eventClick);
    });
    flow.addEventListener("click", (eventClick) => {
      const button = eventClick.target.closest("[data-rsvp-screen]");
      if (!button) return;
      const screen = button.dataset.rsvpScreen;
      if (screen === "welcome") renderWelcome();
      if (screen === "form") renderForm();
      if (screen === "review") {
        const messageField = $("#birthdayMessage", flow);
        const contactField = $("#contactNumber", flow);
        state.message = messageField ? messageField.value.trim() : "";
        state.contact = contactField ? contactField.value.trim() : "";
        renderReview();
      }
      if (screen === "submit") submitRsvp();
      flow.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function youtubeVideoId(url) {
    if (!safeUrl(url)) return "";
    try {
      const parsed = new URL(url, location.href);
      if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "").split("/")[0];
      if (parsed.hostname.includes("youtube.com")) {
        if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || "";
        if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] || "";
        return parsed.searchParams.get("v") || "";
      }
    } catch (error) {}
    return "";
  }

  function setupMusic() {
    const audio = $("#bgMusic");
    const toggle = $("#musicToggle");
    const hasMusicFile = safeUrl(config.backgroundMusicUrl);
    const hasGeneratedMusic = config.useGeneratedBackgroundMusic === true;
    if (!hasMusicFile && !hasGeneratedMusic) return;
    if (hasMusicFile && !youtubeVideoId(config.backgroundMusicUrl)) audio.src = config.backgroundMusicUrl;
    toggle.hidden = false;
    sessionStorage.setItem("musicPlaying", "false");
    setMusicButtonState(false);
    toggle.addEventListener("click", () => {
      isMusicPlaying() ? pauseMusic() : startMusic();
      toggle.blur();
      updateMusicScrollState();
    });
    updateMusicScrollState();
    window.addEventListener("scroll", updateMusicScrollState, { passive: true });
  }

  function updateMusicScrollState() {
    const toggle = $("#musicToggle");
    if (!toggle) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    toggle.classList.toggle("is-soft", scrollTop > 24);
  }

  async function startMusic() {
    const audio = $("#bgMusic");
    const youtubeId = youtubeVideoId(config.backgroundMusicUrl);
    const hasMusicFile = audio && audio.src;
    try {
      if (youtubeId) startYoutubeMusic(youtubeId);
      else if (hasMusicFile) await audio.play();
      else startGeneratedMusic();
      sessionStorage.setItem("musicPlaying", "true");
      setMusicButtonState(true);
      updateMusicScrollState();
    } catch (error) {
      sessionStorage.setItem("musicPlaying", "false");
      setMusicButtonState(false);
      updateMusicScrollState();
    }
  }

  function pauseMusic() {
    const audio = $("#bgMusic");
    if (audio && audio.src) audio.pause();
    pauseYoutubeMusic();
    stopGeneratedMusic();
    sessionStorage.setItem("musicPlaying", "false");
    setMusicButtonState(false);
    updateMusicScrollState();
  }

  function isMusicPlaying() {
    const audio = $("#bgMusic");
    if (audio && audio.src) return !audio.paused;
    if (youtubeMusic && youtubeMusic.isPlaying) return true;
    return ambientAudio && ambientAudio.isPlaying;
  }

  function setMusicButtonState(isPlaying) {
    const toggle = $("#musicToggle");
    if (!toggle) return;
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    const label = $(".music-toggle__label", toggle);
    if (label) label.textContent = isPlaying ? "Music is playing" : "Play music";
  }

  function startYoutubeMusic(videoId) {
    if (!youtubeMusic || !youtubeMusic.frame) {
      const frame = document.createElement("iframe");
      const params = new URLSearchParams({
        autoplay: "1",
        controls: "0",
        disablekb: "1",
        enablejsapi: "1",
        loop: "1",
        modestbranding: "1",
        playsinline: "1",
        playlist: videoId,
        rel: "0"
      });
      if (location.origin && location.origin !== "null") params.set("origin", location.origin);
      frame.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
      frame.title = "Background music";
      frame.allow = "autoplay; encrypted-media";
      frame.setAttribute("aria-hidden", "true");
      Object.assign(frame.style, {
        border: "0",
        height: "1px",
        opacity: "0",
        pointerEvents: "none",
        position: "fixed",
        right: "0",
        top: "0",
        width: "1px"
      });
      document.body.appendChild(frame);
      youtubeMusic = { frame, isPlaying: true };
      return;
    }
    youtubeMusic.frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
    youtubeMusic.isPlaying = true;
  }

  function pauseYoutubeMusic() {
    if (!youtubeMusic || !youtubeMusic.frame) return;
    youtubeMusic.frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
    youtubeMusic.isPlaying = false;
  }

  function startGeneratedMusic() {
    if (ambientAudio && ambientAudio.isPlaying) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = ambientAudio && ambientAudio.context ? ambientAudio.context : new AudioContext();
    const master = context.createGain();
    const delay = context.createDelay();
    const feedback = context.createGain();
    const filter = context.createBiquadFilter();
    const notes = [261.63, 329.63, 392.0, 523.25];
    const oscillators = notes.map((frequency, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = index % 2 ? "sine" : "triangle";
      osc.frequency.value = frequency / (index === 3 ? 2 : 1);
      gain.gain.value = 0.018;
      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      return osc;
    });
    filter.type = "lowpass";
    filter.frequency.value = 900;
    delay.delayTime.value = 0.45;
    feedback.gain.value = 0.18;
    master.gain.value = 0.16;
    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);
    master.connect(context.destination);
    ambientAudio = { context, oscillators, master, isPlaying: true };
  }

  function stopGeneratedMusic() {
    if (!ambientAudio || !ambientAudio.isPlaying) return;
    const fade = ambientAudio.context.currentTime + 0.35;
    ambientAudio.master.gain.linearRampToValueAtTime(0, fade);
    setTimeout(() => {
      ambientAudio.oscillators.forEach((osc) => {
        try { osc.stop(); } catch (error) {}
      });
      ambientAudio.isPlaying = false;
    }, 450);
  }

  function setupNav() {
    const nav = $(".floating-nav");
    $("#navToggle").addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      $("#navToggle").setAttribute("aria-expanded", String(open));
    });
    $$(".floating-nav a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      $("#navToggle").setAttribute("aria-expanded", "false");
    }));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$(".floating-nav a").forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ["home", "story", "details", "gallery", "program", "rsvp"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function setupReveals() {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
    }, { threshold: 0.14 });
    $$(".reveal").forEach((node, index) => {
      node.style.setProperty("--reveal-index", String(index % 4));
      observer.observe(node);
    });
  }

  function hideEmptySections() {
    if (!(images.gallery || []).length) hide("#gallery");
    if (!(event.program || []).length) hide("#program");
    if (!has(config.rsvpLink) && !has(config.contactPerson) && !has(config.email) && !has(config.contactNumber)) hide("#rsvp");
    $$(".optional").forEach((section) => {
      if (!section.textContent.trim() && !section.querySelector("iframe, video, img")) section.hidden = true;
    });
  }

  function googleCalendarUrl() {
    const dates = `${calendarStamp(eventStart)}/${calendarStamp(eventEnd)}`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.names || "Event",
      dates,
      details: event.subtitle || "",
      location: [config.venueName, config.venueAddress].filter(Boolean).join(", ")
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function downloadIcs() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Moumeants and Frames//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@moumeants-and-frames`,
      `DTSTAMP:${calendarStamp(new Date())}`,
      `DTSTART:${calendarStamp(eventStart)}`,
      `DTEND:${calendarStamp(eventEnd)}`,
      `SUMMARY:${icsText(event.names || "Event")}`,
      `DESCRIPTION:${icsText(event.subtitle || "")}`,
      `LOCATION:${icsText([config.venueName, config.venueAddress].filter(Boolean).join(", "))}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const link = document.createElement("a");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    link.href = url;
    link.download = `${(event.names || "event").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function addStructuredData() {
    const data = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.names,
      description: event.subtitle,
      startDate: `${config.eventDate}T${config.startTime}`,
      endDate: `${config.eventDate}T${config.endTime}`,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: config.venueName, address: config.venueAddress },
      image: [absoluteUrl(images.hero)].filter(Boolean)
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function videoEmbed(url) {
    if (/youtube\.com|youtu\.be/.test(url)) {
      const id = url.includes("youtu.be/") ? url.split("youtu.be/")[1].split(/[?&]/)[0] : new URL(url).searchParams.get("v");
      return id ? `<iframe title="Event video" src="https://www.youtube.com/embed/${escapeAttr(id)}" allowfullscreen loading="lazy"></iframe>` : "";
    }
    if (/vimeo\.com/.test(url)) {
      const id = url.split("/").filter(Boolean).pop();
      return id ? `<iframe title="Event video" src="https://player.vimeo.com/video/${escapeAttr(id)}" allowfullscreen loading="lazy"></iframe>` : "";
    }
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return `<video src="${escapeAttr(url)}" controls playsinline></video>`;
    return "";
  }

  function setLink(selector, url) {
    const node = $(selector);
    if (!node) return;
    if (safeUrl(url)) node.href = url;
    else node.hidden = true;
  }

  function googleMapsEmbedUrl() {
    const query = [config.venueName, config.venueAddress].filter(Boolean).join(", ");
    return `https://www.google.com/maps?q=${encodeURIComponent(query || config.googleMapsLink || "")}&output=embed`;
  }

  function getGuestName() {
    const rawName = query.get("to") || query.get("name") || config.guestName || "Guest";
    const cleanName = String(rawName).replace(/\+/g, " ").replace(/\s+/g, " ").trim();
    if (!cleanName) return "Dear Guest";
    return /^dear\s/i.test(cleanName) ? cleanName : `Dear ${cleanName}`;
  }

  function cleanGuestDisplayName(value) {
    return String(value || "Guest").replace(/^dear\s+/i, "").trim() || "Guest";
  }

  function getGuestSlug() {
    return String(query.get("guest") || "").replace(/\+/g, " ").trim();
  }

  async function resolveGuestName() {
    if (!has(guestSlug)) return getGuestName();
    const tracker = config.rsvpTracker || {};
    const trackerUrl = tracker.appsScriptUrl || tracker.apiUrl;
    if (!safeUrl(trackerUrl)) return "Dear Guest";
    try {
      let data = await fetchJsonp(trackerUrl, { action: "guest", slug: guestSlug }, 4800);
      if (!(data && data.ok && has(data.displayName))) {
        data = await fetchJsonp(trackerUrl, { action: "guest", guest: guestSlug }, 3200);
      }
      const displayName = data && data.ok && has(data.displayName) ? String(data.displayName).trim() : "";
      return displayName ? `Dear ${displayName}` : "Dear Guest";
    } catch (error) {
      return "Dear Guest";
    }
  }

  function updateGuestStorageKeys() {
    const keySource = guestSlug || cleanGuestDisplayName(guestName) || "guest";
    openedSessionKey = `invitationOpened:${keySource.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "default"}`;
    rsvpStorageKey = `rsvpResponse:v2:${openedSessionKey}`;
  }

  function cleanShareUrl() {
    const url = new URL(location.href);
    url.hash = "";
    url.searchParams.delete("resetInvite");
    url.searchParams.delete("resetRsvp");
    return url.href;
  }

  function resetLocalRsvpIfNeeded() {
    if (!query.has("resetRsvp")) return;
    localStorage.removeItem(rsvpStorageKey);
    localStorage.removeItem(`rsvpResponse:${openedSessionKey}`);
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("rsvpResponse:")) localStorage.removeItem(key);
    });
  }

  function hide(selector) {
    const node = $(selector);
    if (node) node.hidden = true;
  }

  function safeUrl(url) {
    if (!has(url)) return false;
    if (/^(assets\/|\.\/|\.\.\/|\/)/.test(url)) return true;
    try {
      const parsed = new URL(url);
      return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol);
    } catch (error) {
      return false;
    }
  }

  async function sendRsvpToSheet(payload) {
    const tracker = config.rsvpTracker || {};
    const url = tracker.appsScriptUrl || tracker.submitUrl || tracker.apiUrl;
    if (!safeUrl(url)) return;
    const body = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => body.append(key, value == null ? "" : String(value)));
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body
      });
    } catch (error) {}
  }

  function fetchJsonp(url, params = {}, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const callbackName = `rsvpStats_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const requestUrl = new URL(url, location.href);
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error("Google Sheet lookup timed out"));
      }, timeoutMs);
      Object.entries(params).forEach(([key, value]) => requestUrl.searchParams.set(key, value));
      requestUrl.searchParams.set("callback", callbackName);
      const cleanup = () => {
        window.clearTimeout(timeout);
        delete window[callbackName];
        script.remove();
      };
      window[callbackName] = (data) => {
        cleanup();
        resolve(data || {});
      };
      script.onerror = () => {
        cleanup();
        reject(new Error("Unable to load RSVP tracker"));
      };
      script.src = requestUrl.href;
      document.head.appendChild(script);
    });
  }

  function trackerData(tracker) {
    const data = {
      totalGuests: tracker.totalGuests,
      accepted: tracker.accepted,
      declined: tracker.declined,
      pendingLabel: tracker.pendingLabel,
      note: tracker.note
    };
    try {
      const saved = JSON.parse(localStorage.getItem(rsvpStorageKey) || "null");
      if (saved && saved.attendance === "accepts") data.accepted = toCount(data.accepted) + Math.max(toCount(saved.guestCount), 1);
      if (saved && saved.attendance === "declines") data.declined = toCount(data.declined) + 1;
    } catch (error) {}
    return data;
  }

  function toCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
  }

  function shouldStayOnPage(url) {
    if (!safeUrl(url)) return true;
    try {
      const parsed = new URL(url, location.href);
      return parsed.hostname === "example.com" || parsed.href === location.href || parsed.hash === "#";
    } catch (error) {
      return true;
    }
  }

  function absoluteUrl(url) {
    if (!has(url)) return "";
    try { return new URL(url, location.href).href; } catch (error) { return url; }
  }

  function formatDate(dateString) {
    if (!has(dateString)) return "";
    const date = new Date(`${dateString}T00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  function formatTime(timeString) {
    if (!has(timeString)) return "";
    const date = new Date(`2000-01-01T${timeString}`);
    return Number.isNaN(date.getTime()) ? timeString : date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function calendarStamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function icsText(value) {
    return String(value || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
