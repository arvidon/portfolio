
const container = document.querySelector("#projects");
const dialog = document.querySelector("#video-dialog");
const video = document.querySelector("#demo-video");

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function externalLink(label, url) {
  const link = document.createElement("a");

  link.className = "button";
  link.textContent = label;
  link.href = url;

  // External websites open in a new tab.
  if (!url.startsWith("mailto:")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  return link;
}

// --------------------------------------------------
// Project video dialog
// --------------------------------------------------

function openVideo(project) {
  document.querySelector("#video-title").textContent =
    project.title;

  document.querySelector("#video-error").hidden = true;

  // Hosted demos such as Loom can't play in a <video> element.
  if (project.embed) {
    video.hidden = true;

    const embed = document.createElement("iframe");
    embed.id = "demo-embed";
    embed.src = project.embed;
    embed.title = `${project.title} demo`;
    embed.allow = "autoplay; fullscreen; picture-in-picture";
    embed.allowFullscreen = true;
    video.after(embed);

    dialog.showModal();
    return;
  }

  video.hidden = false;
  document.querySelector("#video-download").href =
    project.video;

  video.src = project.video;

  dialog.showModal();
  video.play().catch(() => {});
}

// --------------------------------------------------
// Project cards
// --------------------------------------------------

if (container && Array.isArray(window.portfolioProjects)) {
  window.portfolioProjects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    const tags = document.createElement("div");
    tags.className = "project-tags";

    (project.technology || "")
      .split(" / ")
      .filter(Boolean)
      .forEach((technology) => {
        const tag = document.createElement("span");
        tag.textContent = technology;
        tags.append(tag);
      });

    const preview = document.createElement("button");
    preview.className = "video-preview";
    preview.type = "button";
    preview.setAttribute(
      "aria-label",
      `Watch ${project.title} demo`
    );

    let thumbnail;

    if (project.thumbnail) {
      thumbnail = document.createElement("img");
      thumbnail.src = project.thumbnail;
      thumbnail.alt = "";
      thumbnail.loading = "lazy";
    } else {
      thumbnail = document.createElement("video");
      thumbnail.src = `${project.video}#t=0.5`;
      thumbnail.muted = true;
      thumbnail.playsInline = true;
      thumbnail.preload = "metadata";
    }

    thumbnail.setAttribute("aria-hidden", "true");
    thumbnail.tabIndex = -1;

    const overlay = document.createElement("span");
    overlay.className = "video-overlay";
    overlay.textContent = "▶ Watch demo";

    preview.append(thumbnail, overlay);
    preview.addEventListener("click", () => openVideo(project));

    const links = document.createElement("div");
    links.className = "project-links";

    if (project.live) {
      links.append(externalLink("Website ↗", project.live));
    }

    if (project.source) {
      links.append(externalLink("GitHub ↗", project.source));
    }

    if (!project.live && !project.source) {
      links.append(externalLink("GitHub ↗", "https://github.com/arvidon"));
    }

    const demo = document.createElement("button");
    demo.className = "button";
    demo.type = "button";
    demo.textContent = "▶ Demo";
    demo.addEventListener("click", () => openVideo(project));

    links.append(demo);

    card.append(title, description, preview, tags, links);
    container.append(card);
  });
}

// --------------------------------------------------
// Hackathons
// --------------------------------------------------

const hackathonList = document.querySelector("#hackathon-list");

if (hackathonList && Array.isArray(window.portfolioHackathons)) {
  window.portfolioHackathons.forEach((item) => {
    const row = document.createElement("article");
    row.className = "hackathon-row";

    const mark = document.createElement("div");
    mark.className = "resume-mark";
    mark.textContent = item.name.slice(0, 1);

    const content = document.createElement("div");
    content.className = "resume-content";

    const date = document.createElement("span");
    date.className = "hackathon-date";
    date.textContent = item.date;

    const heading = document.createElement("h3");
    heading.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    content.append(date, heading, description);
    row.append(mark, content);
    hackathonList.append(row);
  });
}

// --------------------------------------------------
// Contact links
// --------------------------------------------------

// These URLs are defined here directly rather than relying
// on potentially outdated values from portfolio.js.

const contactLinks = {
  "linkedin-contact": {
    label: "LinkedIn ↗",
    url: "https://www.linkedin.com/in/shagun-songara-5016a7249/"
  },
  "email-contact": {
    label: "Email ↗",
    url: "mailto:songarashagun@gmail.com"
  },
  "x-contact": {
    label: "X ↗",
    url: "https://x.com/ShagunSongara"
  }
};

Object.entries(contactLinks).forEach(([id, contact]) => {
  const existingLink = document.getElementById(id);

  if (!existingLink) return;

  const link = externalLink(contact.label, contact.url);
  link.id = id;

  existingLink.replaceWith(link);
});

// --------------------------------------------------
// Video dialog controls
// --------------------------------------------------

const closeDialogButton = document.querySelector(".close-dialog");

if (closeDialogButton && dialog) {
  closeDialogButton.addEventListener("click", () => {
    dialog.close();
  });
}

if (dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();

      const outsideDialog =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (outsideDialog) {
        dialog.close();
      }
    }
  });

  dialog.addEventListener("close", () => {
    document.querySelector("#demo-embed")?.remove();

    if (!video) return;

    video.pause();
    video.removeAttribute("src");
    video.load();
  });
}

if (video) {
  video.addEventListener("error", () => {
    const errorMessage = document.querySelector("#video-error");

    if (errorMessage) {
      errorMessage.hidden = false;
    }
  });
}

// --------------------------------------------------
// Theme toggle
// --------------------------------------------------

const themeButton = document.querySelector(".theme-toggle");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (!themeButton) return;

  themeButton.innerHTML =
    theme === "dark"
      ? `<svg viewBox="0 0 24 24" aria-hidden="true">
           <path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>
         </svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true">
           <circle cx="12" cy="12" r="4"/>
           <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>
         </svg>`;

  themeButton.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`
  );
}

let savedTheme = "light";

try {
  savedTheme =
    localStorage.getItem("portfolio-theme") === "dark"
      ? "dark"
      : "light";
} catch {
  // Use light theme when local storage is unavailable.
}

setTheme(savedTheme);

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark";

    setTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // Theme still works for the current page session.
    }
  });
}

// --------------------------------------------------
// Footer year
// --------------------------------------------------

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

