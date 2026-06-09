const roster = document.getElementById("roster");

let allMembers = [];

// CHANGE THIS TO YOUR ACTUAL WORKER URL
const WORKER_URL =
    "https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev";

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
                    ${character.name}
                </div>

                <div class="member-rank">
                    Rank ${member.rank}
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
