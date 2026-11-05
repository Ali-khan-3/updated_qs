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
      slug: "pinnacle",
      name: "Pinnacle",
      status: "Taking shape",
      type: "",
      location: "",
      image: "assets/img/skyline-glass.jpg",
      imageAlt: "Glass towers rising against a blue sky",
      summary: "A signature venture shaped around light, proportion and permanence.",
      lead: "Pinnacle is a signature QS Realty venture — conceived to stand apart, and built to last for generations.",
      body: [
        "Every decision on Pinnacle is made with the long view in mind: honest materials, generous light and a plan that works as well on the hundredth day as on the first.",
        "From feasibility and approvals through to construction and handover, the project is delivered entirely in-house by the QS Realty team — one point of accountability, from the first drawing to the final key.",
      ],
      gallery: [
        { src: "assets/img/resi-tower-b.jpg", alt: "Residential facade with balconies" },
        { src: "assets/img/interior-living.jpg", alt: "Bright, contemporary living room" },
        { src: "assets/img/glass-pavilion.jpg", alt: "Glass-walled living space opening to a terrace" },
      ],
    },
    {
      slug: "bismillah-restaurant",
      name: "Bismillah Restaurant",
      status: "Taking shape",
      type: "Commercial building",
      location: "JVPD, Juhu",
      image: "assets/img/commercial-facade.jpg",
      imageAlt: "Geometric modern commercial facade",
      summary: "A commercial address in JVPD, built for hospitality, footfall and longevity.",
      lead: "A commercial building in the heart of JVPD — designed around the people who will dine, work and gather in it.",
      body: [
        "Hospitality buildings live or die by the details: circulation, services, acoustics and a facade that draws people in. Bismillah Restaurant is planned around all of them from the outset.",
        "QS Realty manages the project end-to-end — approvals, structure, services and finishes — so the building opens on time and performs for years after.",
      ],
      gallery: [
        { src: "assets/img/facade-detail.jpg", alt: "Detail of a modern building facade" },
        { src: "assets/img/interior-lounge.jpg", alt: "Warm lounge interior" },
        { src: "assets/img/office-interior.jpg", alt: "Modern interior corridor" },
      ],
    },
    {
      slug: "land-avenue",
      name: "Land Avenue",
      status: "Taking shape",
      type: "",
      location: "Bazar",
      image: "assets/img/facade-detail.jpg",
      imageAlt: "Modern building facade against a deep blue sky",
      summary: "A considered new address, planned for the way the neighbourhood lives and grows.",
      lead: "Land Avenue brings a considered new address to its neighbourhood — planned for how people actually live, move and grow.",
      body: [
        "Good development starts with the street. Land Avenue is shaped by its surroundings — access, light and the life of the neighbourhood — before a single floor plate is drawn.",
        "With design, approvals and construction handled under one roof, QS Realty keeps the project on budget, on schedule and true to its original intent.",
      ],
      gallery: [
        { src: "assets/img/brick-apartments.jpg", alt: "Residential apartment block" },
        { src: "assets/img/interior-hall.jpg", alt: "Contemporary living room with natural light" },
        { src: "assets/img/blueprint.jpg", alt: "Architect drafting building plans" },
      ],
    },
    {
      slug: "carter-road",
      name: "Carter Road",
      status: "Taking shape",
      type: "Residential",
      location: "Bandra (W)",
      image: "assets/img/resi-tower-a.jpg",
      imageAlt: "Residential building rising against the sky",
      summary: "Residences on Bandra's Carter Road — one of Mumbai's most loved addresses.",
      lead: "Homes on Carter Road, Bandra — an address that needs no introduction, and deserves a building to match.",
      body: [
        "Carter Road is defined by its promenade, its sea breeze and its sense of community. The residences are planned to make the most of the setting while giving every home privacy and calm.",
        "Delivered entirely by the QS Realty team, the project carries our full integrated process — from feasibility and approvals to construction, quality assurance and turnkey handover.",
      ],
      gallery: [
        { src: "assets/img/mumbai-marine-drive.jpg", alt: "Mumbai seafront promenade" },
        { src: "assets/img/interior-living.jpg", alt: "Bright, contemporary living room" },
        { src: "assets/img/villa-facade.jpg", alt: "Modern residential facade at dusk" },
      ],
    },
  ],

  // shared by every featured project page: what QS Realty handles on each venture
  process: [
    { title: "Feasibility & approvals", text: "Site assessment, planning and statutory approvals handled in-house." },
    { title: "Design coordination", text: "Architects, structural and services consultants resolved into one design." },
    { title: "Construction management", text: "Disciplined execution led by our own project heads and site teams." },
    { title: "Turnkey handover", text: "Quality-checked at every stage and handed over complete, on time." },
  ],

  completed: [
    { name: "Noor Manzil", desc: "Residential building" },
    { name: "Kumar Sadan", desc: "Residential building" },
    { name: "Nawaz Manzil", desc: "Mixed-use building · Kurla (W)" },
    { name: "Pazbaan", desc: "Completed building" },
    { name: "Nasreen Apartment", desc: "Residential apartments" },
    { name: "Hamid House", desc: "Private residence" },
    { name: "Gulistaan", desc: "Completed building" },
    { name: "Naheed Apartment", desc: "Residential apartments" },
    { name: "Survey Estate", desc: "Completed development" },
    { name: "Gausiya Masjid", desc: "Place of worship" },
    { name: "Parveen Villa", desc: "Private villa" },
    { name: "Shaheen Villa", desc: "Private villa" },
    { name: "Sanjari", desc: "Completed building" },
    { name: "Salim House", desc: "Private residence" },
    { name: "Shahid Manzil", desc: "Residential building" },
    { name: "Jainam Heights", desc: "Residential building" },
    { name: "Dadamiya Chawl Building", desc: "Residential building" },
    { name: "Suleman Building", desc: "Residential complex · Wings A–D" },
    { name: "Balaji", desc: "Completed building" },
    { name: "Nishat Nawas", desc: "Residential building" },
  ],
};
