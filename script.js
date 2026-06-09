const members = [
  {
    name: "Fenris",
    class: "warrior",
    rank: "Guild Master",
    ilvl: 528,
    rio: 3120,
    image: "https://render.worldofwarcraft.com/eu/character/tarren-mill/1/placeholder.jpg"
  },
  {
    name: "Lunara",
    class: "mage",
    rank: "Officer",
    ilvl: 524,
    rio: 2950,
    image: "https://render.worldofwarcraft.com/eu/character/tarren-mill/2/placeholder.jpg"
  },
  {
    name: "Nyx",
    class: "demon-hunter",
    rank: "Raider",
    ilvl: 521,
    rio: 2804,
    image: "https://render.worldofwarcraft.com/eu/character/tarren-mill/3/placeholder.jpg"
  }
];

const roster = document.getElementById("roster");
const search = document.getElementById("search");
const classFilter = document.getElementById("classFilter");

const classNames = [...new Set(members.map(m => m.class))];

classNames.forEach(c => {
  const option = document.createElement("option");
  option.value = c;
  option.textContent = c;
  classFilter.appendChild(option);
});

function renderRoster() {

  const term = search.value.toLowerCase();
  const filter = classFilter.value;

  roster.innerHTML = "";

  members
    .filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(term);

      const matchesClass =
        filter === "all" || member.class === filter;

      return matchesSearch && matchesClass;
    })
    .forEach(member => {

      const card = document.createElement("div");
      card.className = "member-card";

      card.innerHTML = `
        <div class="member-top"
             style="background-image:url('${member.image}')">

          <div class="class-badge ${member.class}">
            ${member.class.replace("-", " ")}
          </div>
        </div>

        <div class="member-info">

          <div class="member-name">
            ${member.name}
          </div>

          <div class="member-rank">
            ${member.rank}
          </div>

          <div class="member-stats">
            <span>iLvl ${member.ilvl}</span>
            <span>${member.rio} IO</span>
          </div>

          <div class="member-links">
            <a href="#">Armory</a>
            <a href="#">Raider.IO</a>
          </div>

        </div>
      `;

      roster.appendChild(card);
    });
}

search.addEventListener("input", renderRoster);
classFilter.addEventListener("change", renderRoster);

renderRoster();
