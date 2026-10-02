// ========================================
// KARTDAY APP
// ========================================


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupMeasurementForm();

        setupBackButton();

        updateDashboard();

        renderKarts();

    }
);


// ========================================
// NAVIGATIE
// ========================================

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            "[data-page]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.page
                );

            }
        );

    });

}


function showPage(pageId) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(page => {

        page.classList.remove(
            "active"
        );

    });


    const selectedPage =
        document.getElementById(
            pageId
        );


    if (selectedPage) {

        selectedPage.classList.add(
            "active"
        );

    }


    const navButtons =
        document.querySelectorAll(
            ".nav-button"
        );


    navButtons.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    const activeButton =
        document.querySelector(
            `.nav-button[data-page="${pageId}"]`
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }

}


// ========================================
// METING TOEVOEGEN
// ========================================

function setupMeasurementForm() {

    const form =
        document.getElementById(
            "measurement-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const kart =
                document
                    .getElementById("kart")
                    .value
                    .trim();


            const rijder =
                document
                    .getElementById("rijder")
                    .value
                    .trim();


            const niveau =
                Number(
                    document
                        .getElementById("niveau")
                        .value
                );


            const tijd =
                Number(
                    document
                        .getElementById("tijd")
                        .value
                );


            const notitie =
                document
                    .getElementById("notitie")
                    .value
                    .trim();


            if (
                !kart ||
                !rijder ||
                !niveau ||
                !tijd
            ) {

                alert(
                    "Vul alle verplichte velden in."
                );

                return;

            }


            const measurement = {

                id: Date.now(),

                kart: kart,

                rijder: rijder,

                niveau: niveau,

                tijd: tijd,

                notitie: notitie,

                datum:
                    new Date().toISOString()

            };


            addMeasurement(
                measurement
            );


            form.reset();


            updateDashboard();

            renderKarts();


            showPage(
                "dashboard"
            );

        }
    );

}


// ========================================
// RESULTAAT VERWIJDEREN
// ========================================

function deleteMeasurement(
    measurementId
) {

    const measurements =
        getMeasurements();


    const measurement =
        measurements.find(
            item =>
                String(item.id) ===
                String(measurementId)
        );


    if (!measurement) {

        alert(
            "Deze meting kon niet worden gevonden."
        );

        return;

    }


    const confirmed =
        confirm(
            `Weet je zeker dat je deze meting wilt verwijderen?\n\n` +
            `${measurement.kart} - ${measurement.rijder} - ${formatTime(measurement.tijd)}`
        );


    if (!confirmed) {

        return;

    }


    const newMeasurements =
        measurements.filter(
            item =>
                String(item.id) !==
                String(measurementId)
        );


    const database =
        getDatabase();


    database.measurements =
        newMeasurements;


    saveDatabase(
        database
    );


    updateDashboard();

    renderKarts();


    // Als we op de detailpagina zitten,
    // de huidige kart opnieuw openen.
    const detailPage =
        document.getElementById(
            "kart-detail"
        );


    if (
        detailPage &&
        detailPage.classList.contains("active")
    ) {

        const currentTitle =
            detailPage.querySelector(
                ".page-heading h1"
            );


        if (currentTitle) {

            showKartDetails(
                currentTitle.textContent.trim()
            );

        }

    }

}


// ========================================
// KART VERWIJDEREN
// ========================================

function deleteKart(
    kartName
) {

    const measurements =
        getMeasurements();


    const kartMeasurements =
        measurements.filter(
            measurement =>
                measurement.kart ===
                kartName
        );


    if (!kartMeasurements.length) {

        alert(
            "Deze kart bestaat niet meer."
        );

        return;

    }


    const confirmed =
        confirm(
            `Weet je zeker dat je kart "${kartName}" wilt verwijderen?\n\n` +
            `Hiermee worden ook alle ${kartMeasurements.length} meting(en) van deze kart verwijderd.`
        );


    if (!confirmed) {

        return;

    }


    const newMeasurements =
        measurements.filter(
            measurement =>
                measurement.kart !==
                kartName
        );


    const database =
        getDatabase();


    database.measurements =
        newMeasurements;


    saveDatabase(
        database
    );


    updateDashboard();

    renderKarts();


    showPage(
        "karts"
    );

}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    const measurements =
        getMeasurements();


    const karts =
        getUniqueKarts(
            measurements
        );


    const drivers =
        getUniqueDrivers(
            measurements
        );


    const bestTime =
        getBestTime(
            measurements
        );


    const statKarts =
        document.getElementById(
            "stat-karts"
        );


    if (statKarts) {

        statKarts.textContent =
            karts.length;

    }


    const statMetingen =
        document.getElementById(
            "stat-metingen"
        );


    if (statMetingen) {

        statMetingen.textContent =
            measurements.length;

    }


    const statRijders =
        document.getElementById(
            "stat-rijders"
        );


    if (statRijders) {

        statRijders.textContent =
            drivers.length;

    }


    const statBeste =
        document.getElementById(
            "stat-beste"
        );


    if (statBeste) {

        statBeste.textContent =
            bestTime !== null
                ? formatTime(bestTime)
                : "—";

    }


    renderDashboardRanking();

}


// ========================================
// DASHBOARD RANKING
// ========================================

function renderDashboardRanking() {

    const measurements =
        getMeasurements();


    const container =
        document.getElementById(
            "dashboard-ranking"
        );


    if (!container) {
        return;
    }


    if (!measurements.length) {

        container.innerHTML = `

            <div class="empty-icon">
                🏁
            </div>

            <h3>
                Nog geen metingen
            </h3>

            <p>
                Voeg je eerste kartmeting toe
                om hier de ranking te zien.
            </p>

            <button
                class="primary-button"
                data-page="metingen"
            >
                Eerste meting toevoegen
            </button>

        `;


        const button =
            container.querySelector(
                "[data-page]"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    showPage(
                        "metingen"
                    );

                }
            );

        }


        return;

    }


    const ranking =
        getKartRankingWithScores(
            measurements
        );


    let html = `

        <div class="ranking-list">

            <div class="ranking-header">

                <span>#</span>

                <span>Kart</span>

                <span>Score</span>

                <span>Beste</span>

                <span>Runs</span>

            </div>

    `;


    ranking.forEach(
        (kart, index) => {

            html += `

                <div
                    class="ranking-row"
                    data-kart="${escapeHtml(
                        kart.kart
                    )}"
                >

                    <span class="ranking-position">
                        ${index + 1}
                    </span>

                    <span class="ranking-kart">
                        ${escapeHtml(
                            kart.kart
                        )}
                    </span>

                    <span>
                        ${
                            kart.score !== null
                                ? kart.score.toFixed(1)
                                : "—"
                        }
                    </span>

                    <span>
                        ${formatShortTime(
                            kart.bestTime
                        )}
                    </span>

                    <span>
                        ${kart.measurementCount}
                    </span>

                </div>

            `;

        }
    );


    html += `

        </div>

    `;


    container.innerHTML =
        html;


    const rows =
        container.querySelectorAll(
            ".ranking-row"
        );


    rows.forEach(row => {

        row.addEventListener(
            "click",
            () => {

                showKartDetails(
                    row.dataset.kart
                );

            }
        );

    });

}


// ========================================
// KARTS
// ========================================

function renderKarts() {

    const measurements =
        getMeasurements();


    const container =
        document.getElementById(
            "karts-list"
        );


    if (!container) {
        return;
    }


    if (!measurements.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🏎️
                </div>

                <h3>
                    Nog geen karts
                </h3>

                <p>
                    Voeg een meting toe om
                    automatisch een kart aan te maken.
                </p>

            </div>

        `;

        return;

    }


    const kartStats =
        getKartRankingWithScores(
            measurements
        );


    container.innerHTML =
        "";


    kartStats.forEach(
        (kart, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "kart-card";


            card.innerHTML = `

                <p class="eyebrow">
                    #${index + 1}
                </p>

                <h3>
                    ${escapeHtml(
                        kart.kart
                    )}
                </h3>

                <div class="kart-card-stats">

                    <div class="kart-stat">

                        <span>
                            Score
                        </span>

                        <strong>
                            ${
                                kart.score !== null
                                    ? kart.score.toFixed(1)
                                    : "—"
                            }
                        </strong>

                    </div>


                    <div class="kart-stat">

                        <span>
                            Metingen
                        </span>

                        <strong>
                            ${kart.measurementCount}
                        </strong>

                    </div>


                    <div class="kart-stat">

                        <span>
                            Rijders
                        </span>

                        <strong>
                            ${kart.driverCount}
                        </strong>

                    </div>


                    <div class="kart-stat">

                        <span>
                            Beste tijd
                        </span>

                        <strong>
                            ${formatTime(
                                kart.bestTime
                            )}
                        </strong>

                    </div>


                    <div class="kart-stat">

                        <span>
                            Pace
                        </span>

                        <strong>
                            ${
                                typeof formatPace === "function"
                                    ? formatPace(
                                        kart.expectedPace
                                    )
                                    : formatShortTime(
                                        kart.expectedPace
                                    )
                            }
                        </strong>

                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    showKartDetails(
                        kart.kart
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ========================================
// KART DETAILS
// ========================================

function showKartDetails(
    kartName
) {

    const measurements =
        getMeasurements();


    const kartMeasurements =
        measurements.filter(
            measurement =>
                measurement.kart ===
                kartName
        );


    const kartStats =
        getKartStats(
            kartName,
            measurements
        );


    const driverStats =
        getKartDriverStats(
            kartMeasurements
        );


    const pace =
        kartStats.expectedPace;


    const container =
        document.getElementById(
            "kart-detail-content"
        );


    if (!container) {
        return;
    }


    // ====================================
    // RIJDER TABEL
    // ====================================

    let driverRows = "";


    driverStats.forEach(
        driver => {

            const difference =
                driver.bestTime -
                pace;


            let differenceClass =
                "difference-neutral";


            if (difference < 0) {

                differenceClass =
                    "difference-faster";

            }


            if (difference > 0) {

                differenceClass =
                    "difference-slower";

            }


            driverRows += `

                <div class="driver-row">

                    <span class="driver-name">

                        ${escapeHtml(
                            driver.rijder
                        )}

                    </span>

                    <span>

                        ${driver.niveau}/10

                    </span>

                    <strong>

                        ${formatShortTime(
                            driver.bestTime
                        )}

                    </strong>

                    <span>

                        ${formatShortTime(
                            driver.averageTime
                        )}

                    </span>

                    <strong
                        class="${differenceClass}"
                    >

                        ${formatDifference(
                            difference
                        )}

                    </strong>

                </div>

            `;

        }
    );


    // ====================================
    // METINGEN
    // ====================================

    let measurementsHtml =
        "";


    kartMeasurements
        .slice()
        .sort(
            (a, b) =>
                Number(a.tijd) -
                Number(b.tijd)
        )
        .forEach(
            measurement => {

                measurementsHtml += `

                    <div class="measurement-row">

                        <span>

                            ${escapeHtml(
                                measurement.rijder
                            )}

                        </span>


                        <span>

                            ${measurement.niveau}/10

                        </span>


                        <strong>

                            ${formatTime(
                                measurement.tijd
                            )}

                        </strong>


                        <button
                            type="button"
                            class="delete-button measurement-delete-button"
                            data-measurement-id="${measurement.id}"
                        >
                            🗑️
                        </button>

                    </div>

                `;

            }
        );


    // ====================================
    // SCORE VAN DEZE KART
    // ====================================

    const ranking =
        getKartRankingWithScores(
            measurements
        );


    const currentKart =
        ranking.find(
            kart =>
                kart.kart === kartName
        );


    const kartScore =
        currentKart &&
        currentKart.score !== null
            ? currentKart.score.toFixed(1)
            : "—";


    // ====================================
    // PAGINA
    // ====================================

    container.innerHTML = `

        <div class="page-heading">

            <p class="eyebrow">
                KART DETAILS
            </p>


            <h1>
                ${escapeHtml(
                    kartName
                )}
            </h1>


            <p>
                Overzicht van alle prestaties
                met deze kart.
            </p>


            <button
                type="button"
                class="delete-button delete-kart-button"
                id="delete-kart-button"
            >
                🗑️ Kart verwijderen
            </button>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <span class="stat-label">
                    Ranking
                </span>

                <strong>
                    ${getKartPosition(
                        kartName,
                        measurements
                    )}
                </strong>

            </div>


            <div class="stat-card">

                <span class="stat-label">
                    Score
                </span>

                <strong>
                    ${kartScore}
                </strong>

            </div>


            <div class="stat-card">

                <span class="stat-label">
                    Beste tijd
                </span>

                <strong>
                    ${formatTime(
                        kartStats.bestTime
                    )}
                </strong>

            </div>


            <div class="stat-card">

                <span class="stat-label">
                    Verwachte pace
                </span>

                <strong>
                    ${
                        typeof formatPace === "function"
                            ? formatPace(pace)
                            : formatShortTime(pace)
                    }
                </strong>

            </div>

        </div>


        <div class="section-card">

            <div class="section-header">

                <div>

                    <p class="eyebrow">
                        RIJDERS
                    </p>

                    <h2>
                        Vergelijking
                    </h2>

                </div>

            </div>


            <div class="pace-info">

                <span>
                    Verwachte pace
                </span>

                <strong>
                    ${
                        typeof formatPace === "function"
                            ? formatPace(pace)
                            : formatShortTime(pace)
                    } s
                </strong>

            </div>


            <div class="driver-table">

                <div class="driver-row driver-header">

                    <span>
                        Rijder
                    </span>

                    <span>
                        Niveau
                    </span>

                    <span>
                        Beste
                    </span>

                    <span>
                        Gemiddeld
                    </span>

                    <span>
                        Verschil
                    </span>

                </div>


                ${driverRows}

            </div>

        </div>


        <div class="section-card">

            <div class="section-header">

                <div>

                    <p class="eyebrow">
                        ALLE METINGEN
                    </p>

                    <h2>
                        Tijden
                    </h2>

                </div>

            </div>


            <div class="measurements-list">

                ${measurementsHtml}

            </div>

        </div>

    `;


    // ====================================
    // KART VERWIJDEREN
    // ====================================

    const deleteKartButton =
        document.getElementById(
            "delete-kart-button"
        );


    if (deleteKartButton) {

        deleteKartButton.addEventListener(
            "click",
            () => {

                deleteKart(
                    kartName
                );

            }
        );

    }


    // ====================================
    // METINGEN VERWIJDEREN
    // ====================================

    const deleteButtons =
        container.querySelectorAll(
            ".measurement-delete-button"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                deleteMeasurement(
                    button.dataset.measurementId
                );

            }
        );

    });


    showPage(
        "kart-detail"
    );

}


// ========================================
// KART POSITIE
// ========================================

function getKartPosition(
    kartName,
    measurements
) {

    const ranking =
        getKartRanking(
            measurements
        );


    const index =
        ranking.findIndex(
            kart =>
                kart.kart === kartName
        );


    if (index === -1) {

        return "—";

    }


    return "#" + (index + 1);

}


// ========================================
// TERUGKNOP
// ========================================

function setupBackButton() {

    const button =
        document.getElementById(
            "back-to-karts"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            showPage(
                "karts"
            );

        }
    );

}


// ========================================
// HTML VEILIG MAKEN
// ========================================

function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}

