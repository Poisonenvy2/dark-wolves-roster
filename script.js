const CLIENT_ID = "4232041d22064ebf8d047be3a36f0601";
const CLIENT_SECRET = "3lqEHSEheOLPsviieV2VdsyNqQ9serSG";

const GUILD_REALM = "tarren-mill";
const GUILD_NAME = "dark-wolves";

const roster = document.getElementById("roster");

async function getAccessToken() {

    const response = await fetch(
        "https://oauth.battle.net/token",
        {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        }
    );

    const data = await response.json();

    return data.access_token;
}

async function getGuildRoster(token) {

    const url =
        `https://eu.api.blizzard.com/data/wow/guild/${GUILD_REALM}/${GUILD_NAME}/roster?namespace=profile-eu&locale=en_GB&access_token=${token}`;

    const response = await fetch(url);

    return await response.json();
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

async function init() {

    try {

        const token = await getAccessToken();

        const guildData = await getGuildRoster(token);

        renderRoster(guildData.members);

    } catch (err) {

        console.error(err);

        roster.innerHTML =
            "<p style='padding:20px'>Failed to load roster.</p>";
    }
}

init();
