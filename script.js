const roster = document.getElementById("roster");

let allMembers = [];

const rankNames = {
    0: "Alpha",
    1: "Beta",
    2: "Beauwolf",
    3: "Werewolf",
    4: "Wolf",
    5: "Wolf Alt",
    6: "Juvenile",
    7: "Cub",
    8: "MiA",
    9: "Pup"
};

const rankColours = {
    0: "#ffcc00", // Alpha
    1: "#ff8800", // Beta
    2: "#66ccff", // Beauwolf
    3: "#66ff66", // Werewolf
    4: "#ffffff", // Wolf
    5: "#cccccc", // Wolf Alt
    6: "#99ff99", // Juvenile
    7: "#99ccff", // Cub
    8: "#ff6666", // MiA
    9: "#dddddd"  // Pup
};

const WORKER_URL =
    "https://dark-wolves-api.lowesfamily.workers.dev";

async function loadRoster() {

    try {

        const response = await fetch(WORKER_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP Error ${response.status}`
            );
        }

        const guildData = await response.json();

        allMembers = guildData.members;

        renderRoster(allMembers);

    } catch (err) {

        console.error(err);

        roster.innerHTML = `
            <div style="padding:20px;">
                Failed to load roster.<br><br>
                ${err.message}
            </div>
        `;
    }
}

function renderRoster(members) {

    roster.innerHTML = "";

    const searchText =
        document.getElementById("search")
            .value
            .toLowerCase();

    const sortBy =
        document.getElementById("sortBy")
            .value;

    let filteredMembers = members.filter(member => {

        return member.character.name
            .toLowerCase()
            .includes(searchText);

    });

    if (sortBy === "name") {

        filteredMembers.sort((a, b) =>
            a.character.name.localeCompare(
                b.character.name
            )
        );

    } else if (sortBy === "rank") {

        filteredMembers.sort((a, b) =>
            a.rank - b.rank
        );

    }

    filteredMembers.forEach(member => {

        const character = member.character;

        const card = document.createElement("div");

        card.className = "member-card";

        card.innerHTML = `

            <div class="member-info">

                <div class="member-name">
    <a
        href="https://worldofwarcraft.blizzard.com/en-gb/character/eu/${character.realm.slug}/${character.name.toLowerCase()}"
        target="_blank"
        style="color:inherit;text-decoration:none;"
    >
        ${character.name}
    </a>
</div>

                <div
    class="member-rank"
    style="color:${rankColours[member.rank] || '#ffffff'}"
>
    ${rankNames[member.rank] || `Rank ${member.rank}`}
</div>

                <div class="member-stats">
                    <span>Level ${character.level}</span>
                    <span>${character.realm.slug}</span>
                </div>

            </div>

        `;

        roster.appendChild(card);
    });
}

document.getElementById("search")
    .addEventListener("input", () => {
        renderRoster(allMembers);
    });

document.getElementById("sortBy")
    .addEventListener("change", () => {
        renderRoster(allMembers);
    });

loadRoster();
