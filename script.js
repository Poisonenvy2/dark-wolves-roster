const ROSTER_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJaRDHCytwmA2_Wo6Y71CL8anXRCRBGYjlkleoFkHiISJOiL3cd-t-zp7G9KkaWQqE5ykRJjGS8Y-/pub?gid=1275702952&single=true&output=csv";

let rosterData = [];

let currentSort = "rank";
let sortAscending = true;

async function loadRoster() {

    try {

        const response =
            await fetch(ROSTER_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const csv =
            await response.text();

        parseCSV(csv);

        renderRoster();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "memberCount"
        ).innerHTML =
            "Failed to load roster";
    }
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

        } else if (
            char === "," &&
            !inQuotes
        ) {

            currentRow.push(currentValue);
            currentValue = "";

        } else if (
            (char === "\n" || char === "\r") &&
            !inQuotes
        ) {

            if (
                currentValue !== "" ||
                currentRow.length > 0
            ) {

                currentRow.push(currentValue);
                rows.push(currentRow);

                currentRow = [];
                currentValue = "";
            }

        } else {

            currentValue += char;
        }
    }

    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(currentValue);
        rows.push(currentRow);
    }

    const headers = rows[1];

    rosterData = rows
        .slice(2)
        .filter(row => row.length > 5)
        .map(row => {

            const obj = {};

            headers.forEach(
                (header, index) => {

                    obj[
                        header.trim()
                    ] = row[index]
                        ? row[index].trim()
                        : "";
                }
            );

            return obj;
        });
}

function updateSortArrows() {

    document
        .querySelectorAll(
            "th[data-sort]"
        )
        .forEach(header => {

            const sortType =
                header.dataset.sort;

            const cleanText =
                header.textContent
                    .replace(" ▲", "")
                    .replace(" ▼", "");

            header.textContent =
                cleanText;

            if (
                sortType === currentSort
            ) {

                header.textContent +=
                    sortAscending
                        ? " ▲"
                        : " ▼";
            }
        });
}

function renderRoster() {

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    let filtered =
        rosterData.filter(player =>
            (player.Name || "")
                .toLowerCase()
                .includes(search)
        );

    switch(currentSort) {

        case "name":
            filtered.sort((a,b)=>
                (a.Name || "")
                    .localeCompare(
                        b.Name || ""
                    )
            );
            break;

        case "rank":
            filtered.sort((a,b)=>
                (a["Guild Rank"] || "")
                    .localeCompare(
                        b["Guild Rank"] || ""
                    )
            );
            break;

        case "level":
            filtered.sort((a,b)=>
                Number(b.Level || 0) -
                Number(a.Level || 0)
            );
            break;

        case "ilevel":
            filtered.sort((a,b)=>
                Number(
                    b["iLvL (Equipped)"] ||
                    b["iLvL"] ||
                    0
                ) -
                Number(
                    a["iLvL (Equipped)"] ||
                    a["iLvL"] ||
                    0
                )
            );
            break;

        case "mplus":
            filtered.sort((a,b)=>
                Number(
                    b["M+ Rating"] || 0
                ) -
                Number(
                    a["M+ Rating"] || 0
                )
            );
            break;

        case "pvp":
            filtered.sort((a,b)=>
                Number(
                    b["PvP Rating"] || 0
                ) -
                Number(
                    a["PvP Rating"] || 0
                )
            );
            break;

        case "honor":
            filtered.sort((a,b)=>
                Number(
                    b["Honor Level"] || 0
                ) -
                Number(
                    a["Honor Level"] || 0
                )
            );
            break;

        case "raid":
            filtered.sort((a,b)=>
                (a["Progress"] || "")
                    .localeCompare(
                        b["Progress"] || ""
                    )
            );
            break;

        case "achievements":
            filtered.sort((a,b)=>
                Number(
                    b["Achievement"] || 0
                ) -
                Number(
                    a["Achievement"] || 0
                )
            );
            break;
    }

    if (!sortAscending) {
        filtered.reverse();
    }

    updateSortArrows();

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

        const rank =
            (player["Guild Rank"] || "")
                .replace(
                    /^\d+\.\s*/,
                    ""
                );

        tbody.innerHTML += `
            <tr>

                <td>
                    <div class="character-name">
                        ${player.Name || ""}
                    </div>

                    <div class="character-spec">
                        ${player.Spec || ""}
                        ${player.Class || ""}
                    </div>
                </td>

                <td class="rank">
                    ${rank}
                </td>

                <td>
                    ${player.Level || "-"}
                </td>

                <td class="ilvl">
                    ${player["iLvL (Equipped)"] || player["iLvL"] || "-"}
                </td>

                <td class="mplus">
                    ${player["M+ Rating"] || "-"}
                </td>

                <td>
                    ${player["PvP Rating"] || "-"}
                </td>

                <td>
                    ${player["Honor Level"] || "-"}
                </td>

                <td>
                    ${player["Progress"] || "-"}
                </td>

                <td>
                    ${player["Achievement"] || "-"}
                </td>

            </tr>
        `;
    });
}

document
    .getElementById("search")
    .addEventListener(
        "input",
        renderRoster
    );

document
    .querySelectorAll(
        "th[data-sort]"
    )
    .forEach(header => {

        header.addEventListener(
            "click",
            () => {

                const newSort =
                    header.dataset.sort;

                if (
                    currentSort === newSort
                ) {

                    sortAscending =
                        !sortAscending;

                } else {

                    currentSort =
                        newSort;

                    sortAscending =
                        true;
                }

                renderRoster();
            }
        );
    });

loadRoster();

const backToTop =
    document.getElementById(
        "backToTop"
    );

window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 400
        ) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );
        }
    }
);

backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);
