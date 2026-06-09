const roster = document.getElementById("roster");

async function loadRoster() {

    const response = await fetch(
        "https://dark-wolves-api.lowesfamily.workers.dev"
    );

    const guildData = await response.json();

    renderRoster(guildData.members);
}

function renderRoster(members) {

    roster.innerHTML = "";

    members.forEach(member => {

        const name = member.character.name;
        const level = member.character.level;
        const realm = member.character.realm.slug;
        const rank = member.rank;

        const card = document.createElement("div");

        card.className = "member-card";

        card.innerHTML = `
            <div class="member-info">

                <div class="member-name">
                    ${name}
                </div>

                <div class="member-rank">
                    Rank ${rank}
                </div>

                <div class="member-stats">
                    <span>Level ${level}</span>
                    <span>${realm}</span>
                </div>

            </div>
        `;

        roster.appendChild(card);
    });
}

loadRoster();
