// ========================================
// KARTDAY DATABASE
// ========================================

const STORAGE_KEY = "kartday_data";


function getDatabase() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {

        return {
            measurements: []
        };

    }

    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error("Database kon niet worden geladen:", error);

        return {
            measurements: []
        };

    }

}


function saveDatabase(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


function getMeasurements() {

    const database = getDatabase();

    return database.measurements || [];

}


function addMeasurement(measurement) {

    const database = getDatabase();

    database.measurements.push(measurement);

    saveDatabase(database);

}


function clearDatabase() {

    localStorage.removeItem(STORAGE_KEY);

}