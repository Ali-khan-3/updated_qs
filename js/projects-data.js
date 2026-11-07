/* =========================================================
   QS REALTY — project content
   The single place to edit projects. The home page and
   project.html both render from this file.

   featured  → large cards on the home page, each with its own
               page at project.html?p=<slug>
   completed → the compact "completed works" list
   Leave a field out (or set it to "") and it is simply not shown.
   ========================================================= */
window.QS_PROJECTS = {
  featured: [
    {
      "slug": "pinnacle",
      "name": "Pinnacle",
      "status": "Taking shape",
      "type": "",
      "location": "Kurla West, Mumbai",
      "image": "assets/client/projects/Pinnacle, Kurla west.png",
      "imageAlt": "Pinnacle, Kurla West — architectural rendering at dusk",
      "summary": "A signature venture shaped around light, proportion and permanence.",
      "lead": "Pinnacle is a signature QS Realty venture — conceived to stand apart, and built to last for generations.",
      "body": [
        "Every decision on Pinnacle is made with the long view in mind: honest materials, generous light and a plan that works as well on the hundredth day as on the first.",
        "From feasibility and approvals through to construction and handover, the project is delivered entirely in-house by the QS Realty team — one point of accountability, from the first drawing to the final key."
      ],
      "gallery": [
        {
          "src": "assets/client/projects/Pinnacle, Kurla west.png",
          "alt": "Pinnacle, Kurla West — architectural rendering at dusk",
          "width": 1506,
          "height": 1045
        }
      ],
      "imageWidth": 1506,
      "imageHeight": 1045
    },
    {
      "slug": "bismillah-restaurant",
      "name": "Bismillah Restaurant",
      "status": "Taking shape",
      "type": "Commercial building",
      "location": "JVPD, Juhu",
      "image": "assets/client/projects/bismillah/cleaned/front-day-clean.png",
      "imageAlt": "Bismillah Restaurant — front elevation in daylight",
      "summary": "A commercial address in JVPD, built for hospitality, footfall and longevity.",
      "lead": "A commercial building in the heart of JVPD — designed around the people who will dine, work and gather in it.",
      "body": [
        "Hospitality buildings live or die by the details: circulation, services, acoustics and a facade that draws people in. Bismillah Restaurant is planned around all of them from the outset.",
        "QS Realty manages the project end-to-end — approvals, structure, services and finishes — so the building opens on time and performs for years after."
      ],
      "gallery": [
        {
          "src": "assets/client/projects/bismillah/cleaned/front-day-clean.png",
          "alt": "Bismillah Restaurant — front elevation in daylight",
          "width": 1254,
          "height": 1254
        },
        {
          "src": "assets/client/projects/bismillah/cleaned/side-day-clean.png",
          "alt": "Bismillah Restaurant — side elevation in daylight",
          "width": 1254,
          "height": 1254
        },
        {
          "src": "assets/client/projects/bismillah/cleaned/aerial-clean.png",
          "alt": "Bismillah Restaurant — aerial view",
          "width": 1402,
          "height": 1122
        },
        {
          "src": "assets/client/projects/bismillah/cleaned/front-night-clean.png",
          "alt": "Bismillah Restaurant — front elevation at night",
          "width": 1254,
          "height": 1254
        },
        {
          "src": "assets/client/projects/bismillah/cleaned/side-night-clean.png",
          "alt": "Bismillah Restaurant — side elevation at night",
          "width": 1254,
          "height": 1254
        }
      ],
      "imageWidth": 1254,
      "imageHeight": 1254
    },
    {
      "slug": "land-avenue",
      "name": "Lands Avenue",
      "status": "Taking shape",
      "type": "",
      "location": "Bazaar Road, Mumbai",
      "image": "assets/client/projects/Lands Avenue at Dusk.png",
      "imageAlt": "Lands Avenue, Bazaar Road — architectural rendering at dusk",
      "summary": "A considered new address, planned for the way the neighbourhood lives and grows.",
      "lead": "Lands Avenue brings a considered new address to its neighbourhood — planned for how people actually live, move and grow.",
      "body": [
        "Good development starts with the street. Lands Avenue is shaped by its surroundings — access, light and the life of the neighbourhood — before a single floor plate is drawn.",
        "With design, approvals and construction handled under one roof, QS Realty keeps the project on budget, on schedule and true to its original intent."
      ],
      "gallery": [
        {
          "src": "assets/client/projects/Lands Avenue at Dusk.png",
          "alt": "Lands Avenue, Bazaar Road — architectural rendering at dusk",
          "width": 1122,
          "height": 1402
        }
      ],
      "imageWidth": 1122,
      "imageHeight": 1402
    },
    {
      "slug": "carter-road",
      "name": "Makka Heights",
      "status": "Taking shape",
      "type": "Residential",
      "location": "Carter Road, Bandra West, Mumbai",
      "image": "assets/client/projects/makka heights, Carter road, Bandra West.jpeg",
      "imageAlt": "Makka Heights, Carter Road — daytime architectural rendering",
      "summary": "Residences on Bandra's Carter Road — one of Mumbai's most loved addresses.",
      "lead": "Makka Heights brings new homes to Carter Road, Bandra West — an address that deserves a building to match.",
      "body": [
        "Carter Road is defined by its promenade, its sea breeze and its sense of community. The residences are planned to make the most of the setting while giving every home privacy and calm.",
        "Delivered entirely by the QS Realty team, the project carries our full integrated process — from feasibility and approvals to construction, quality assurance and turnkey handover."
      ],
      "gallery": [
        {
          "src": "assets/client/projects/makka heights, Carter road, Bandra West.jpeg",
          "alt": "Makka Heights, Carter Road — daytime architectural rendering",
          "width": 1280,
          "height": 1280
        }
      ],
      "imageWidth": 1280,
      "imageHeight": 1280
    }
  ],  // shared by every featured project page: what QS Realty handles on each venture
  process: [
    { title: "Feasibility & approvals", text: "Site assessment, planning and statutory approvals handled in-house." },
    { title: "Design coordination", text: "Architects, structural and services consultants resolved into one design." },
    { title: "Construction management", text: "Disciplined execution led by our own project heads and site teams." },
    { title: "Turnkey handover", text: "Quality-checked at every stage and handed over complete, on time." },
  ],

  completed: [
    { name: "Noor Manzil", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Kumar Sadan", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Nawaz Manzil", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Pazbaan", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Nasreen Apartment", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Hamid House", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Gulistaan", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Naheed Apartment", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Survey Estate", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Gausiya Masjid", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Parveen Villa", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Shaheen Villa", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Sanjari", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Salim House", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Shahid Manzil", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Jainam Heights", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Dadamiya Chawl Building", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Suleman Building", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Balaji", desc: "G+3 floors · Kurla, Mumbai" },
    { name: "Nishat Nawas", desc: "G+3 floors · Kurla, Mumbai" },
  ],
};
