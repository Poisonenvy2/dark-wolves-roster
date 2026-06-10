const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRi9Ru-QPb3sPlWmGZHt7iX2Ds3c7C3Gj43RB0dDKImpzW6Ln2ZCxHro9CPFfzOMKU_KA5SgltXwj-_/pub?output=csv";

let rosterData = [];

async function loadRoster() {

    const response = await fetch(CSV_URL);
    const csv = await response.text();

    parseCSV(csv);

    renderRoster();
}

function parseCSV(csv) {

    const rows = [];
    let currentRow = [];
    let currentValue = "";
    let inQuotes = false;

    for (let i = 0; i < csv.length; i++) {

        const char = csv[i];

        if (char === '"') {

            inQuotes = !inQuotes;

        } else if (char === ',' && !inQuotes) {

            currentRow.push(currentValue);
            currentValue = "";

        } else if ((char === '\n' || char === '\r') && !inQuotes) {

            if (currentValue !== "" || currentRow.length > 0) {

                currentRow.push(currentValue);
                rows.push(currentRow);

                currentRow = [];
                currentValue = "";
            }

        } else {

            currentValue += char;
        }
    }

    if (currentValue !== "" || currentRow.length > 0) {

        currentRow.push(currentValue);
        rows.push(currentRow);
    }

    const headers = rows[1];

    rosterData = rows
        .slice(2)
        .filter(row => row.length > 5)
        .map(row => {

            let obj = {};

            headers.forEach((header, index) => {

                obj[header.trim()] =
                    row[index]
                        ? row[index].trim()
                        : "";
            });

            return obj;
        });
}

function renderRoster() {

    const search =
        document.getElementById("search")
            .value
            .toLowerCase();

    const sort =
        document.getElementById("sortBy")
            .value;

    let filtered =
        rosterData.filter(player =>
            player.Name.toLowerCase()
                .includes(search)
        );

    switch(sort) {

        case "name":
            filtered.sort((a,b)=>
                a.Name.localeCompare(b.Name)
            );
            break;

        case "ilevel":
            filtered.sort((a,b)=>
                Number(b.Ilevel) -
                Number(a.Ilevel)
            );
            break;

        case "mplus":
            filtered.sort((a,b)=>
                Number(b["M+"]) -
                Number(a["M+"])
            );
            break;

        case "achievement":
            filtered.sort((a,b)=>
                Number(b.Achievement) -
                Number(a.Achievement)
            );
            break;

        default:
            filtered.sort((a,b)=>
                a["Guild Rank"]
                    .localeCompare(
                        b["Guild Rank"]
                    )
            );
    }

    document.getElementById(
        "memberCount"
    ).innerHTML =
        `🐺 ${filtered.length} members found`;

    const tbody =
        document.getElementById(
            "rosterBody"
        );

    tbody.innerHTML = "";
    
    filtered.forEach(player => {

        tbody.innerHTML += `
            <tr>

                <td>
                    <div class="character-name">
                        ${player.Name}
                    </div>

                    <div class="character-spec">
                        ${player.Spec} ${player.Class}
                    </div>
                </td>

                <td class="rank">
    ${player["Guild Rank"].replace(/^\d+\.\s*/, "")}
</td>

                <td>
                    ${player.Level}
                </td>

                <td class="role">
                    ${player.Role}
                </td>

                <td class="ilvl">
                    ${player.Ilevel}
                </td>

                <td class="mplus">
                    ${player["M+"] || "-"}
                </td>

                <td>
                    ${player.Achievement}
                </td>

                <td>
                    ${player.Date}
                </td>

            </tr>
        `;
    });
}

document.getElementById("search")
    .addEventListener(
        "input",
        renderRoster
    );

document.getElementById("sortBy")
    .addEventListener(
        "change",
        renderRoster
    );

loadRoster();
