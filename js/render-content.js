(function () {
  const content = window.portfolioContent || {};
  const site = content.site || {};
  const navigation = content.navigation || [];
  const projects = content.projects || [];
  const experiences = content.experiences || [];
  const education = content.education || [];
  const certifications = content.certifications || [];
  const skillGroups = content.skills || [];
  const socialLinks = content.socialLinks || [];

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const formatDateToken = (value) => {
    if (!value) return "";
    if (/^\d{4}$/.test(value)) return value;

    const date = new Date(`${value}-01T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    })
      .format(date)
      .toUpperCase();
  };

  const formatRange = (item) => {
    if (item.displayDate) return item.displayDate;

    const start = formatDateToken(item.startDate);
    const end = item.current ? "PRESENT" : formatDateToken(item.endDate);

    if (start && end) return `${start} – ${end}`;
    if (start) return start;
    if (end) return end;
    return "";
  };

  const joinLines = (items) =>
    items.map((value) => `• ${escapeHtml(value)}`).join("<br /><br />");

  const renderNavigation = () => {
    const navPill = document.querySelector(".nav-pill");
    if (!navPill || !navigation.length) return;

    const indicator = navPill.querySelector(".nav-indicator");
    navPill.querySelectorAll(".nav-link").forEach((link) => link.remove());

    navigation.forEach((item) => {
      const link = document.createElement("a");
      link.href = `#${item.id}`;
      link.className = `nav-link${item.active ? " active" : ""}`;
      link.dataset.section = item.id;
      link.innerHTML = `
        <i class="${escapeHtml(item.iconClass)} nav-icon"></i>
        <span class="nav-label">${escapeHtml(item.label)}</span>
      `;
      navPill.appendChild(link);
    });
  };

  const renderExperience = (container, items) => {
    if (!container || !items.length) return;

    const line =
      container.querySelector(".timeline-line") ||
      document.createElement("div");
    if (!container.querySelector(".timeline-line")) {
      line.className = "timeline-line";
      line.innerHTML = '<div class="timeline-progress"></div>';
      container.appendChild(line);
    }

    items.forEach((item, index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const bullets = item.responsibilities?.length
        ? joinLines(item.responsibilities)
        : "";

      const timelineItem = document.createElement("div");
      timelineItem.className = `timeline-item ${side}`;
      timelineItem.innerHTML = `
        <div class="timeline-number">${String(index + 1).padStart(2, "0")}</div>
        <div class="timeline-content">
          <div class="project-tag">${escapeHtml(item.company)}</div>
          <h3>${escapeHtml(item.role)}</h3>
          ${bullets ? `<p style="text-align: left; padding: 10px 0">${bullets}</p>` : ""}
        </div>
        <div class="timeline-date">${escapeHtml(formatRange(item))}</div>
        <div class="timeline-dot"></div>
      `;
      container.appendChild(timelineItem);
    });
  };

  const renderEducation = (container, items) => {
    if (!container || !items.length) return;

    items.forEach((item, index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const achievements = item.achievements?.length
        ? joinLines(item.achievements)
        : "";
      const location = item.location ? escapeHtml(item.location) : "";

      const timelineItem = document.createElement("div");
      timelineItem.className = `timeline-item ${side}`;
      timelineItem.innerHTML = `
        <div class="timeline-number">${String(index + 1).padStart(2, "0")}</div>
        <div class="timeline-content">
          <div class="project-tag">${escapeHtml(item.institution || "Education")}</div>
          <h3>${escapeHtml(item.degree || "")}</h3>
          ${location ? `<p style="text-align: left; padding: 10px 0">${location}</p>` : ""}
          ${item.description ? `<p style="text-align: left; padding: 10px 0">${escapeHtml(item.description)}</p>` : ""}
          ${achievements ? `<p style="text-align: left; padding: 10px 0">${achievements}</p>` : ""}
        </div>
        <div class="timeline-date">${escapeHtml(formatRange(item))}</div>
        <div class="timeline-dot"></div>
      `;
      container.appendChild(timelineItem);
    });
  };

  const renderProjects = (container, items) => {
    if (!container || !items.length) return;

    container.innerHTML = items
      .map((project) => {
        const technologyList = project.technologies?.length
          ? escapeHtml(project.technologies.join(", "))
          : "";
        const highlightList = project.highlights?.length
          ? escapeHtml(project.highlights.join(", "))
          : "";
        const buttons = Object.values(project.links || {})
          .filter((link) => link && link.url)
          .map(
            (link) => `
              <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="project-btn primary-btn">
                <i class="${escapeHtml(link.iconClass)}"></i> ${escapeHtml(link.label)}
              </a>
            `,
          )
          .join("");

        return `
          <article class="experience-card">
            <div class="experience-date">${escapeHtml(project.badge || project.category || "")}</div>
            <div class="project-tag" style="display: inline-block; width: max-content">${escapeHtml(project.category || project.title)}</div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            ${buttons ? `<div class="project-links-wrapper">${buttons}</div>` : ""}
            ${technologyList || highlightList ? `<div class="project-meta" style="margin-top: 1rem; font-size: 0.85rem; line-height: 1.7; color: #d5d8e3;">${technologyList ? `<strong>Technologies:</strong> ${technologyList}` : ""}${technologyList && highlightList ? "<br />" : ""}${highlightList ? `<strong>Highlights:</strong> ${highlightList}` : ""}</div>` : ""}
          </article>
        `;
      })
      .join("");
  };

  const renderSkills = (filtersContainer, gridContainer, groups) => {
    if (!filtersContainer || !gridContainer || !groups.length) return;

    filtersContainer.innerHTML = [
      '<button class="filter-btn active" data-filter="all">All</button>',
      ...groups.map(
        (group) =>
          `<button class="filter-btn" data-filter="${escapeHtml(group.id)}">${escapeHtml(group.label)}</button>`,
      ),
    ].join("");

    gridContainer.innerHTML = groups
      .flatMap((group) =>
        group.items.map((item) => {
          const iconStyle = item.iconStyle
            ? ` style="${escapeHtml(item.iconStyle)}"`
            : "";
          return `
            <div class="skill-card" data-category="${escapeHtml(group.id)}">
              <i class="${escapeHtml(item.iconClass)}"${iconStyle}></i>
              <span>${escapeHtml(item.name)}</span>
            </div>
          `;
        }),
      )
      .join("");
  };

  const renderCertifications = (container, items) => {
    if (!container || !items.length) return;

    container.innerHTML = items
      .map((cert) => {
        const badgeStyle = `background: linear-gradient(135deg, ${cert.accentFrom || "#7c3aed"}, ${cert.accentTo || "#0ea5e9"}); color: #fff; font-size: 1rem; font-weight: 700; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: center;`;
        const overlay = cert.credentialUrl
          ? `
            <div class="cert-overlay">
              <a href="${escapeHtml(cert.credentialUrl)}" target="_blank" rel="noopener noreferrer" class="cert-overlay-link">
                <span>View Credential</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          `
          : "";

        return `
          <article class="cert-item">
            <div class="cert-img-wrapper" style="${badgeStyle}">
              ${cert.logo ? `<img src="${escapeHtml(cert.logo)}" alt="${escapeHtml(cert.name)}" />` : escapeHtml(cert.badgeText || cert.issuer || cert.name)}
              ${overlay}
            </div>
            <div class="cert-info">
              <h3>${escapeHtml(cert.name)}</h3>
              <p>${escapeHtml(cert.description || "")}</p>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const renderProfiles = (container, items) => {
    if (!container || !items.length) return;

    container.innerHTML = items
      .filter((item) => item.profile)
      .map((item) => {
        const target = item.target || "_blank";
        const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
        const targetAttr = target ? ` target="${escapeHtml(target)}"` : "";
        return `
          <a href="${escapeHtml(item.url)}"${targetAttr}${rel} class="profile-card">
            <div class="profile-icon">
              <i class="${escapeHtml(item.iconClass)}"></i>
            </div>
            <div class="profile-info">
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.profileLabel || "Open")}</p>
            </div>
          </a>
        `;
      })
      .join("");
  };

  const renderFooterNav = (container, items) => {
    if (!container || !items.length) return;

    container.innerHTML = items
      .map(
        (item) =>
          `<li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`,
      )
      .join("");
  };

  const renderFooterSocials = (container, items) => {
    if (!container || !items.length) return;

    container.innerHTML = items
      .filter((item) => item.footer)
      .map((item) => {
        const target = item.target || "_blank";
        const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
        const targetAttr = target ? ` target="${escapeHtml(target)}"` : "";
        return `
          <a href="${escapeHtml(item.url)}"${targetAttr}${rel} class="social-link ${escapeHtml(item.accentClass || "")}">
            <i class="${escapeHtml(item.iconClass)}"></i>
          </a>
        `;
      })
      .join("");
  };

  renderNavigation();
  renderExperience(document.getElementById("experienceTimeline"), experiences);
  renderEducation(document.getElementById("educationTimeline"), education);
  renderProjects(document.getElementById("projectsGrid"), projects);
  renderSkills(
    document.getElementById("skillFilters"),
    document.getElementById("skillGrid"),
    skillGroups,
  );
  renderCertifications(document.getElementById("certGrid"), certifications);
  renderProfiles(document.getElementById("profilesGrid"), socialLinks);
  renderFooterNav(document.getElementById("footerNavLinks"), navigation);
  renderFooterSocials(document.getElementById("footerSocials"), socialLinks);
})();
