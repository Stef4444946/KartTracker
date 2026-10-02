// ========================================
// KARTDAY BEREKENINGEN
// ========================================

// ========================================
// TIJD OPMAKEN
// ========================================

function formatTime(time) {
    if (
        time === null ||
        time === undefined ||
        isNaN(time)
    ) {
        return "—";
    }

    return Number(time).toFixed(3) + " s";
}


function formatShortTime(time) {
    if (
        time === null ||
        time === undefined ||
        isNaN(time)
    ) {
        return "—";
    }

    return Number(time).toFixed(3);
}


// ========================================
// PACE OPMAKEN
// ========================================

function formatPace(time) {
    if (
        time === null ||
        time === undefined ||
        isNaN(time)
    ) {
        return "—";
    }

    return Number(time).toFixed(1);
}


// ========================================
// TIJDVERSCHIL
// ========================================

function formatDifference(value) {
    if (
        value === null ||
        value === undefined ||
        isNaN(value)
    ) {
        return "—";
    }

    const rounded = Number(value).toFixed(3);

    if (value > 0) {
        return "+" + rounded + " s";
    }

    if (value < 0) {
        return rounded + " s";
    }

    return "0.000 s";
}


// ========================================
// UNIEKE KARTS
// ========================================

function getUniqueKarts(measurements) {

    const karts = [];

    measurements.forEach(measurement => {

        if (!karts.includes(measurement.kart)) {
            karts.push(measurement.kart);
        }

    });

    return karts;
}


// ========================================
// UNIEKE RIJDERS
// ========================================

function getUniqueDrivers(measurements) {

    const drivers = [];

    measurements.forEach(measurement => {

        if (!drivers.includes(measurement.rijder)) {
            drivers.push(measurement.rijder);
        }

    });

    return drivers;
}


// ========================================
// BESTE TIJD
// ========================================

function getBestTime(measurements) {

    if (!measurements.length) {
        return null;
    }

    const times =
        measurements
            .map(measurement =>
                Number(measurement.tijd)
            )
            .filter(time =>
                !isNaN(time)
            );

    if (!times.length) {
        return null;
    }

    return Math.min(...times);
}


// ========================================
// GEMIDDELDE TIJD
// ========================================

function getAverageTime(measurements) {

    if (!measurements.length) {
        return null;
    }

    const times =
        measurements
            .map(measurement =>
                Number(measurement.tijd)
            )
            .filter(time =>
                !isNaN(time)
            );

    if (!times.length) {
        return null;
    }

    const total =
        times.reduce(
            (sum, time) =>
                sum + time,
            0
        );

    return total / times.length;
}


// ========================================
// RIJDER-NIVEAU
// ========================================

function getLevelCorrection(niveau) {

    const level = Number(niveau);

    if (
        isNaN(level) ||
        level < 1 ||
        level > 10
    ) {
        return 0;
    }

    return (10 - level) * 0.03;
}


// ========================================
// GECORRIGEERDE TIJD
// ========================================

function getAdjustedTime(measurement) {

    const time =
        Number(
            measurement.tijd
        );

    const correction =
        getLevelCorrection(
            measurement.niveau
        );

    if (isNaN(time)) {
        return null;
    }

    return time - correction;
}


// ========================================
// GEMIDDELDE GECORRIGEERDE TIJD
// ========================================

function getAverageAdjustedTime(
    measurements
) {

    if (!measurements.length) {
        return null;
    }

    const adjustedTimes =
        measurements
            .map(measurement =>
                getAdjustedTime(
                    measurement
                )
            )
            .filter(time =>
                time !== null &&
                !isNaN(time)
            );

    if (!adjustedTimes.length) {
        return null;
    }

    const total =
        adjustedTimes.reduce(
            (sum, time) =>
                sum + time,
            0
        );

    return (
        total /
        adjustedTimes.length
    );
}


// ========================================
// RIJDER DATA
// ========================================

function getDriverStats(
    driverName,
    measurements
) {

    const driverMeasurements =
        measurements.filter(
            measurement =>
                measurement.rijder === driverName
        );

    if (!driverMeasurements.length) {
        return null;
    }

    const firstMeasurement =
        driverMeasurements[0];

    return {

        rijder: driverName,

        niveau:
            firstMeasurement.niveau,

        measurements:
            driverMeasurements,

        measurementCount:
            driverMeasurements.length,

        bestTime:
            getBestTime(
                driverMeasurements
            ),

        averageTime:
            getAverageTime(
                driverMeasurements
            )

    };
}


// ========================================
// RIJDERSTATISTIEKEN PER KART
// ========================================

function getKartDriverStats(
    kartMeasurements
) {

    const drivers =
        getUniqueDrivers(
            kartMeasurements
        );

    return drivers
        .map(driverName =>
            getDriverStats(
                driverName,
                kartMeasurements
            )
        )
        .filter(driver =>
            driver !== null
        );
}


// ========================================
// VERWACHTE PACE
// ========================================

function getExpectedPace(
    measurements
) {

    if (!measurements.length) {
        return null;
    }

    const driverStats =
        getKartDriverStats(
            measurements
        );

    const bestTimes =
        driverStats
            .map(driver =>
                driver.bestTime
            )
            .filter(time =>
                time !== null &&
                !isNaN(time)
            );

    if (!bestTimes.length) {
        return null;
    }

    const total =
        bestTimes.reduce(
            (sum, time) =>
                sum + time,
            0
        );

    return (
        total /
        bestTimes.length
    );
}


// ========================================
// DATA VAN ÉÉN KART
// ========================================

function getKartStats(
    kartName,
    measurements
) {

    const kartMeasurements =
        measurements.filter(
            measurement =>
                measurement.kart === kartName
        );

    const drivers =
        getUniqueDrivers(
            kartMeasurements
        );

    return {

        kart: kartName,

        measurements:
            kartMeasurements,

        measurementCount:
            kartMeasurements.length,

        drivers:
            drivers,

        driverCount:
            drivers.length,

        bestTime:
            getBestTime(
                kartMeasurements
            ),

        averageTime:
            getAverageTime(
                kartMeasurements
            ),

        adjustedAverageTime:
            getAverageAdjustedTime(
                kartMeasurements
            ),

        expectedPace:
            getExpectedPace(
                kartMeasurements
            )

    };
}


// ========================================
// ALLE KARTEN
// ========================================

function getAllKartStats(
    measurements
) {

    const karts =
        getUniqueKarts(
            measurements
        );

    return karts.map(
        kartName =>
            getKartStats(
                kartName,
                measurements
            )
    );
}


// ========================================
// KART RANKING
// ========================================

function getKartRanking(
    measurements
) {

    const kartStats =
        getAllKartStats(
            measurements
        );

    return kartStats.sort(
        (a, b) => {

            if (
                a.adjustedAverageTime === null &&
                b.adjustedAverageTime === null
            ) {
                return 0;
            }

            if (
                a.adjustedAverageTime === null
            ) {
                return 1;
            }

            if (
                b.adjustedAverageTime === null
            ) {
                return -1;
            }

            return (
                a.adjustedAverageTime -
                b.adjustedAverageTime
            );

        }
    );
}


// ========================================
// KART SCORE
// ========================================
//
// Beste kart = 10.0
// Andere karts worden vergeleken
// met de beste kart.
//
// Voorbeeld:
//
// Beste kart: 41.000
// Kart 2:     41.500
//
// Kart 2 krijgt dan een iets lagere score.
//
// ========================================

function getKartScore(
    kart,
    ranking
) {

    if (
        !kart ||
        kart.adjustedAverageTime === null
    ) {
        return null;
    }

    if (!ranking.length) {
        return null;
    }


    // ====================================
    // BESTE KART BEPALEN
    // ====================================

    const bestKart =
        ranking.find(
            item =>
                item.adjustedAverageTime !== null
        );


    if (!bestKart) {
        return null;
    }


    const bestTime =
        bestKart.adjustedAverageTime;


    const kartTime =
        kart.adjustedAverageTime;


    if (
        bestTime === null ||
        kartTime === null
    ) {
        return null;
    }


    // ====================================
    // BASISSCORE
    // ====================================

    let score;


    if (kartTime <= bestTime) {

        score = 10;

    } else {

        const difference =
            kartTime - bestTime;

        score =
            10 - difference;

    }


    // ====================================
    // BETROUWBAARHEID
    // ====================================
    //
    // Hoe meer metingen, hoe betrouwbaarder
    // de score.
    //
    // 1 meting  = 50%
    // 2 metingen = 60%
    // 3 metingen = 70%
    // 4 metingen = 80%
    // 5 metingen = 90%
    // 6+ metingen = 100%
    //
    // ====================================

    const measurementCount =
        kart.measurementCount;


    let reliability;


    if (measurementCount <= 1) {

        reliability = 0.50;

    } else if (measurementCount === 2) {

        reliability = 0.60;

    } else if (measurementCount === 3) {

        reliability = 0.70;

    } else if (measurementCount === 4) {

        reliability = 0.80;

    } else if (measurementCount === 5) {

        reliability = 0.90;

    } else {

        reliability = 1.00;

    }


    // ====================================
    // SCORE RICHTING 5
    // ====================================
    //
    // Een kart met weinig metingen
    // wordt voorzichtig richting 5.0
    // getrokken.
    //
    // Hierdoor kan één snelle run
    // niet meteen alles bepalen.
    //
    // ====================================

    score =
        5 +
        (score - 5) *
        reliability;


    // ====================================
    // SCORE BEGRENZEN
    // ====================================

    return Math.max(
        0,
        Math.min(
            10,
            score
        )
    );

}


// ========================================
// ALLE KARTS MET SCORE
// ========================================

function getKartRankingWithScores(
    measurements
) {

    const ranking =
        getKartRanking(
            measurements
        );

    return ranking.map(
        kart => {

            return {

                ...kart,

                score:
                    getKartScore(
                        kart,
                        ranking
                    )

            };

        }
    );
}