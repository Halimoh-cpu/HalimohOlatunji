import "./style.css";

// 1. Fetch JSON Configuration
async function initPortfolio() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error("Could not load data.json");

    const data = await res.json();
    populateUI(data);
  } catch (error) {
    console.error(error);
    document.getElementById("hero-title").innerText =
      "Error Loading Portfolio.";
    document.getElementById("hero-p1").innerText =
      "Please ensure data.json is present in the public folder and is properly formatted JSON.";
  }
}

// 2. DOM Manipulation based on JSON
function populateUI(data) {
  // Personal Info
  document.getElementById("nav-name").innerText = data.personal.name;
  document.getElementById("hero-title").innerText = data.personal.title;
  document.getElementById("hero-subtitle").innerText = data.personal.subtitle;
  document.getElementById("hero-p1").innerText = data.personal.about_p1;
  document.getElementById("hero-p2").innerText = data.personal.about_p2;

  // Buttons
  document.getElementById("btn-cv").href = data.personal.cv_link;
  document.getElementById("btn-linkedin").href = data.personal.linkedin_link;

  // Skills
  const skillsContainer = document.getElementById("skills-container");
  data.skills.forEach((skill) => {
    skillsContainer.innerHTML += `
      <div class="space-y-2">
        <div class="flex justify-between text-sm font-medium text-slate-700">
          <span>${skill.name}</span>
          <span>${skill.percentage}%</span>
        </div>
        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-slate-800 rounded-full transition-all duration-1000 ease-out" style="width: 0%;" data-width="${skill.percentage}%"></div>
        </div>
      </div>
    `;
  });

  // Expertise Tags
  const tagsContainer = document.getElementById("tags-container");
  data.expertise_tags.forEach((tag) => {
    tagsContainer.innerHTML += `
      <span class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-slate-700">${tag}</span>
    `;
  });

  // Projects
  const projectsContainer = document.getElementById("projects-container");
  data.projects.forEach((project) => {
    let imageBlock = "";

    // If they provided a URL, show the image, otherwise show the placeholder gray box
    if (project.image_url && project.image_url.trim() !== "") {
      imageBlock = `<div class="w-full h-48 bg-slate-100 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                       <img src="${project.image_url}" alt="${project.image_placeholder}" class="w-full h-full object-cover"/>
                    </div>`;
    } else {
      imageBlock = `<div class="w-full h-48 bg-slate-100 rounded-xl mb-5 flex items-center justify-center overflow-hidden relative">
            <svg class="w-8 h-8 text-slate-400 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span class="text-xs text-slate-500 font-medium z-10 mt-12 bg-white/80 px-2 py-1 rounded">Placeholder: ${project.image_placeholder}</span>
          </div>`;
    }

    const tagsHtml = project.tags
      .map(
        (t) =>
          `<span class="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">${t}</span>`,
      )
      .join("");

    projectsContainer.innerHTML += `
      <a href="${project.link}" class="group block p-5 bg-white rounded-2xl border border-gray-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col">
          ${imageBlock}
          <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">${project.title}</h3>
          <p class="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">${project.description}</p>
          <div class="flex gap-2 flex-wrap">
            ${tagsHtml}
          </div>
      </a>
    `;
  });

  // Platforms
  const platformsContainer = document.getElementById("platforms-container");
  data.platforms.forEach((platform) => {
    platformsContainer.innerHTML += `
      <a href="${platform.link}" target="_blank" class="group flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-sm transition-all min-w-[140px]">
        ${platform.icon_svg}
        <span class="text-sm font-medium text-slate-800">${platform.name}</span>
      </a>
    `;
  });

  // Achievements
  const achievementsContainer = document.getElementById(
    "achievements-container",
  );
  data.achievements.forEach((ach) => {
    let linkHtml =
      ach.link_url && ach.link_url !== ""
        ? `<a href="${ach.link_url}" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">${ach.link_text}</a>`
        : "";

    achievementsContainer.innerHTML += `
      <div class="relative pl-8 md:pl-10">
        <div class="absolute w-3 h-3 bg-slate-900 rounded-full -left-[6.5px] top-1.5 border-4 border-white"></div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">${ach.title}</h3>
        <p class="text-sm text-gray-500 mb-3">${ach.issuer}</p>
        <p class="text-sm text-gray-600 leading-relaxed mb-4">${ach.description}</p>
        ${linkHtml}
      </div>
    `;
  });

  // Footer
  document.getElementById("footer-text").innerHTML =
    `&copy; ${data.footer.year} ${data.footer.name}. All rights reserved.`;

  // Mini animation trick for skills
  setTimeout(() => {
    document
      .querySelectorAll("#skills-container .bg-slate-800")
      .forEach((el) => {
        el.style.width = el.getAttribute("data-width");
      });
  }, 100);
}

// 3. Start App
initPortfolio();
