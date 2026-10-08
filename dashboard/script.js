// ============================================================
// SOMAIYASAT — AUTONOMOUS MISSION CONTROL
// Main Dashboard JavaScript
// ============================================================


// ============================================================
// 1. MAP SETUP
// ============================================================

const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(map);


// ============================================================
// 2. GROUND STATIONS
// ============================================================

let groundStations = [
    {
        name: "Mumbai Ground Station",
        lat: 19.0760,
        lon: 72.8777
    },
    {
        name: "Delhi Ground Station",
        lat: 28.6139,
        lon: 77.2090
    },
    {
        name: "Bangalore Ground Station",
        lat: 12.9716,
        lon: 77.5946
    }
];

let stationMarkers = [];
let stationLines = [];


// ============================================================
// 3. UPDATE GROUND STATION COUNT
// ============================================================

function updateGroundStationCount() {

    const countElement =
        document.getElementById("groundStationCount");

    if (countElement) {
        countElement.textContent = groundStations.length;
    }
}


// ============================================================
// 4. DRAW GROUND NETWORK
// ============================================================

function drawGroundNetwork() {

    // Remove old markers
    stationMarkers.forEach(marker => {
        map.removeLayer(marker);
    });

    // Remove old communication lines
    stationLines.forEach(line => {
        map.removeLayer(line);
    });

    stationMarkers = [];
    stationLines = [];


    // Add station markers
    groundStations.forEach(station => {

        const marker = L.marker([
            station.lat,
            station.lon
        ])
        .addTo(map)
        .bindPopup(
            `<b>${station.name}</b><br>Ground Station`
        );

        stationMarkers.push(marker);
    });


    // Draw communication links
    for (
        let i = 0;
        i < groundStations.length - 1;
        i++
    ) {

        const line = L.polyline(
            [
                [
                    groundStations[i].lat,
                    groundStations[i].lon
                ],
                [
                    groundStations[i + 1].lat,
                    groundStations[i + 1].lon
                ]
            ],
            {
                weight: 2
            }
        ).addTo(map);

        stationLines.push(line);
    }


    // Update station list
    updateStationList();

    // IMPORTANT:
    // Update number at top of dashboard
    updateGroundStationCount();
}


// ============================================================
// 5. DISPLAY STATION LIST
// ============================================================

function updateStationList() {

    const list =
        document.getElementById("stationList");

    if (!list) {
        return;
    }


    list.innerHTML = `

        <div class="station-count">
            NETWORK NODES: ${groundStations.length}
        </div>

    `;


    groundStations.forEach((station, index) => {

        list.innerHTML += `

            <div class="station-item">

                <div>
                    <strong>${station.name}</strong>

                    <small>
                        ${station.lat.toFixed(4)},
                        ${station.lon.toFixed(4)}
                    </small>
                </div>

                <button
                    onclick="removeGroundStation(${index})">
                    REMOVE
                </button>

            </div>

        `;
    });
}


// ============================================================
// 6. ADD GROUND STATION
// ============================================================

async function addGroundStation() {

    const input =
        document.getElementById("stationInput");

    const result =
        document.getElementById("stationResult");

    const city =
        input.value.trim();


    if (city === "") {

        result.innerHTML =
            "⚠️ Please enter a city.";

        return;
    }


    result.innerHTML =
        "🔄 Searching city...";


    try {

        const url =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response =
            await fetch(url);

        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            result.innerHTML =
                "❌ City not found.";

            return;
        }


        const location =
            data.results[0];


        const stationName =
            `${location.name} Ground Station`;


        // Check duplicate
        const alreadyExists =
            groundStations.some(
                station =>
                    station.name.toLowerCase() ===
                    stationName.toLowerCase()
            );


        if (alreadyExists) {

            result.innerHTML =
                "⚠️ This station already exists.";

            return;
        }


        // Add new station
        groundStations.push({

            name: stationName,

            lat: location.latitude,

            lon: location.longitude

        });


        // Redraw everything
        drawGroundNetwork();


        // Move map to new station
        map.setView(
            [
                location.latitude,
                location.longitude
            ],
            6
        );


        result.innerHTML =
            `✅ ${stationName} added to network.`;


        // Clear input
        input.value = "";


        // Add event
        addEvent(
            `${stationName} added to communication network`
        );

    }

    catch (error) {

        console.error(error);

        result.innerHTML =
            "❌ Unable to find city.";

    }
}


// ============================================================
// 7. REMOVE GROUND STATION
// ============================================================

function removeGroundStation(index) {

    // Don't allow removing every station
    if (groundStations.length <= 1) {

        alert(
            "At least one ground station must remain."
        );

        return;
    }


    const removedStation =
        groundStations[index].name;


    groundStations.splice(index, 1);


    // Redraw network
    drawGroundNetwork();


    // Show message
    const result =
        document.getElementById("stationResult");

    if (result) {

        result.innerHTML =
            `🗑️ ${removedStation} removed.`;
    }


    addEvent(
        `${removedStation} removed from network`
    );
}


// ============================================================
// 8. INITIAL DRAW
// ============================================================

drawGroundNetwork();


// ============================================================
// 9. SATELLITE DATA — LOCAL MISSION DATASET
// ============================================================

let satellites = [];

async function loadSatellites() {

    const tableBody =
        document.getElementById(
            "satelliteTableBody"
        );

    const satelliteBox =
        document.getElementById(
            "satellites"
        );


    if (satelliteBox) {

        satelliteBox.innerHTML =
            "Loading satellite data...";
    }


    try {

        const response = await fetch("satellite.csv");

        if (!response.ok) {
            throw new Error("satellite.csv not found");
}

        const csvText =
            await response.text();

        satellites =
            parseSatelliteCSV(csvText);


        console.log(
            "Satellite dataset loaded:",
            satellites
        );


        // Update satellite count
        const count =
            document.getElementById(
                "satelliteCount"
            );


        if (count) {

            count.textContent =
                satellites.length;
        }


        displaySatelliteTable();


        if (satelliteBox) {

            satelliteBox.innerHTML =
                `${satellites.length} satellite objects loaded from local mission dataset`;
        }

    }

    catch (error) {

        console.error(
            "Satellite API error:",
            error
        );


        if (satelliteBox) {

            satelliteBox.innerHTML =
                "❌ Unable to load satellite data.";
        }
    }
}

function parseSatelliteCSV(csvText) {

    const lines = csvText.trim().split("\n");

    if (lines.length <= 1) {
        return [];
    }

    const result = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {

        const line = lines[i].trim();

        if (!line) {
            continue;
        }

        const fields = parseCSVLine(line);

        if (fields.length < 12) {
            continue;
        }

        result.push({

            OBJECT_NAME: fields[0],

            MEAN_MOTION: parseFloat(fields[3]),

            ECCENTRICITY: parseFloat(fields[4]),

            INCLINATION: parseFloat(fields[5]),

            NORAD_CAT_ID: fields[11]

        });
    }

    return result;
}

function parseCSVLine(line) {

    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

        const char = line[i];

        if (char === '"') {

            insideQuotes = !insideQuotes;

        } else if (char === "," && !insideQuotes) {

            result.push(current.trim());
            current = "";

        } else {

            current += char;
        }
    }

    result.push(current.trim());

    return result;
}


// ============================================================
// 10. DISPLAY SATELLITE TABLE
// ============================================================

function displaySatelliteTable() {

    const tableBody =
        document.getElementById(
            "satelliteTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    satellites
        .slice(0, 20)
        .forEach((satellite, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>
                    ${satellite.OBJECT_NAME || "Unknown"}
                </td>

                <td>
                    ${satellite.NORAD_CAT_ID || "-"}
                </td>

                <td>
                    ${
                        satellite.INCLINATION !== undefined
                            ? Number(
                                satellite.INCLINATION
                              ).toFixed(2)
                            : "-"
                    }
                </td>

                <td>
                    ${
                        satellite.MEAN_MOTION !== undefined
                            ? Number(
                                satellite.MEAN_MOTION
                              ).toFixed(4)
                            : "-"
                    }
                </td>

            `;


            tableBody.appendChild(row);

        });
}


// ============================================================
// 11. SATELLITE SEARCH
// ============================================================

function filterSatellites() {

    const input =
        document.getElementById(
            "satelliteSearch"
        );


    if (!input) {
        return;
    }


    const search =
        input.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#satelliteTableBody tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();


        if (text.includes(search)) {

            row.style.display = "";

        } else {

            row.style.display = "none";
        }

    });
}


// ============================================================
// 12. LOCATION + WEATHER SEARCH
// ============================================================

async function searchLocation() {

    const input =
        document.getElementById(
            "locationInput"
        );


    const result =
        document.getElementById(
            "locationResult"
        );


    if (!input || !result) {
        return;
    }


    const city =
        input.value.trim();


    if (city === "") {

        result.innerHTML =
            "⚠️ Enter a location.";

        return;
    }


    result.innerHTML =
        "🔄 Searching...";


    try {

        // Geocoding API
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const geoResponse =
            await fetch(geoURL);


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            result.innerHTML =
                "❌ Location not found.";

            return;
        }


        const location =
            geoData.results[0];


        const lat =
            location.latitude;


        const lon =
            location.longitude;


        // Weather API
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;


        const weatherResponse =
            await fetch(weatherURL);


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        // Move map
        map.setView(
            [lat, lon],
            8
        );


        // Add temporary marker
        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(
                `<b>${location.name}</b><br>
                 Temperature: ${current.temperature_2m}°C`
            )
            .openPopup();


        result.innerHTML = `

            <strong>${location.name}</strong>

            <br>

            🌡️ Temperature:
            ${current.temperature_2m}°C

            <br>

            💧 Humidity:
            ${current.relative_humidity_2m}%

            <br>

            💨 Wind:
            ${current.wind_speed_10m} km/h

        `;

    }

    catch (error) {

        console.error(error);

        result.innerHTML =
            "❌ Unable to load location data.";
    }
}


// ============================================================
// 13. QUEUE
// ============================================================

let transmissionQueue = [];


function addToQueue(packet) {

    transmissionQueue.push(packet);

    updateQueueDisplay();
}


function updateQueueDisplay() {

    const queueElement =
        document.getElementById(
            "transmissionQueue"
        );


    if (!queueElement) {
        return;
    }


    if (transmissionQueue.length === 0) {

        queueElement.innerHTML =
            "Queue Empty";

        return;
    }


    queueElement.innerHTML =
        transmissionQueue
            .map(
                (packet, index) =>
                    `${index + 1}. ${packet}`
            )
            .join("<br>");
}


// ============================================================
// 14. EVENT STACK
// ============================================================

let eventStack = [];


function addEvent(message) {

    eventStack.push(message);

    updateEventLog();
}


function updateEventLog() {

    const log =
        document.getElementById(
            "eventLog"
        );


    if (!log) {
        return;
    }


    if (eventStack.length === 0) {

        log.innerHTML =
            "No mission events.";

        return;
    }


    log.innerHTML =
        eventStack
            .slice()
            .reverse()
            .map(
                event =>
                    `<div class="event">
                        ${event}
                    </div>`
            )
            .join("");
}


// ============================================================
// 15. PRIORITY QUEUE
// ============================================================

let priorityQueue = [];


function addPriorityPacket(
    packet,
    priority
) {

    priorityQueue.push({

        packet: packet,

        priority: priority

    });


    priorityQueue.sort(
        (a, b) =>
            a.priority - b.priority
    );


    displayPriorityQueue();
}

function displayPriorityQueue() {

    const element =
        document.getElementById("priorityQueue");

    if (!element) {
        return;
    }

    if (priorityQueue.length === 0) {

        element.innerHTML =
            "Priority Queue Empty";

        return;
    }

    element.innerHTML =
        priorityQueue
            .map(item => {

                let label = "LOW";

                if (item.priority === 1) {
                    label = "HIGH";
                }
                else if (item.priority === 2) {
                    label = "MEDIUM";
                }

                return `
                    <div class="priority-packet">
                        <span>${item.packet}</span>
                        <strong>${label}</strong>
                    </div>
                `;

            })
            .join("");
}


function transmitHighestPriorityPacket() {

    if (priorityQueue.length === 0) {

        alert(
            "Priority queue is empty."
        );

        return;
    }


    const packet =
        priorityQueue.shift();


    displayPriorityQueue();


    addEvent(
        `Priority packet transmitted: ${packet.packet}`
    );
}


// ============================================================
// 16. BFS — DYNAMIC GROUND NETWORK
// ============================================================

function runBFS() {

    if (groundStations.length === 0) {

        document.getElementById("bfsResult").textContent =
            "No ground stations available.";

        return;
    }


    // Create dynamic graph
    const graph = {};


    // Satellite connected to every ground station
    graph["Satellite"] =
        groundStations.map(
            station => station.name
        );


    // Every ground station connected to Satellite
    groundStations.forEach(
        station => {

            graph[station.name] = [
                "Satellite"
            ];

        }
    );


    // BFS Queue
    const queue = ["Satellite"];

    const visited = new Set();

    const traversal = [];


    visited.add("Satellite");


    // BFS traversal
    while (queue.length > 0) {

        const current =
            queue.shift();


        traversal.push(current);


        const neighbours =
            graph[current] || [];


        neighbours.forEach(
            neighbour => {

                if (!visited.has(neighbour)) {

                    visited.add(neighbour);

                    queue.push(neighbour);
                }

            }
        );
    }


    // Show BFS result inside dashboard
    document.getElementById("bfsResult").textContent =
        "BFS: " + traversal.join(" → ");


    console.log(
        "BFS Traversal:",
        traversal
    );


    // Add event to mission log
    addEvent(
        "BFS network traversal completed"
    );
}


// ============================================================
// 17. BLOOM FILTER
// ============================================================

const BLOOM_SIZE = 50;

let bloomFilter =
    new Array(BLOOM_SIZE).fill(0);


// Hash 1
function hash1(data) {

    let hash = 0;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        hash =
            (
                hash +
                data.charCodeAt(i)
            ) % BLOOM_SIZE;
    }


    return hash;
}


// Hash 2
function hash2(data) {

    let hash = 0;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        hash =
            (
                hash * 31 +
                data.charCodeAt(i)
            ) % BLOOM_SIZE;
    }


    return hash;
}


// Hash 3
function hash3(data) {

    let hash = 0;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        hash =
            (
                hash * 17 +
                data.charCodeAt(i)
            ) % BLOOM_SIZE;
    }


    return hash;
}


// Add packet
function bloomAdd() {

    const input =
        document.getElementById("bloomInput");

    const result =
        document.getElementById("bloomResult");

    const packet =
        input.value.trim();

    if (packet === "") {

        result.innerHTML =
            "⚠️ Enter a packet ID.";

        return;
    }

    const h1 = hash1(packet);
    const h2 = hash2(packet);
    const h3 = hash3(packet);

    // Set 3 hash positions to 1
    bloomFilter[h1] = 1;
    bloomFilter[h2] = 1;
    bloomFilter[h3] = 1;

    result.innerHTML = `

        ✅ Packet added.

        <br><br>

        <strong>Packet:</strong> ${packet}

        <br>

        <strong>Hash positions:</strong>
        ${h1}, ${h2}, ${h3}

        <br>

        <strong>3 bits activated in 50-bit array.</strong>

    `;

    // Refresh visual bit array
    displayBloomBits();

    // Add event to mission log
    addEvent(
        `Bloom Filter: ${packet} added`
    );
}
// Check packet
function bloomCheck() {

    const input =
        document.getElementById("bloomInput");

    const result =
        document.getElementById("bloomResult");

    const packet =
        input.value.trim();

    if (packet === "") {

        result.innerHTML =
            "⚠️ Enter a packet ID.";

        return;
    }

    const h1 = hash1(packet);
    const h2 = hash2(packet);
    const h3 = hash3(packet);

    if (
        bloomFilter[h1] === 1 &&
        bloomFilter[h2] === 1 &&
        bloomFilter[h3] === 1
    ) {

        result.innerHTML = `

            🟡 <strong>POSSIBLY PRESENT</strong>

            <br><br>

            Packet:
            ${packet}

            <br>

            Hash positions:
            ${h1}, ${h2}, ${h3}

            <br><br>

            All 3 bits are set.

            <br>

            ⚠️ A false positive is possible.

        `;

    } else {

        result.innerHTML = `

            🟢 <strong>DEFINITELY NOT PRESENT</strong>

            <br><br>

            Packet:
            ${packet}

            <br>

            Hash positions:
            ${h1}, ${h2}, ${h3}

            <br><br>

            At least one required bit is 0.

            <br>

            ✓ Packet is not in the filter.

        `;
    }

    displayBloomBits();

    addEvent(
        `Bloom Filter: ${packet} checked`
    );
}

// Display Bloom Filter
function displayBloomBits() {

    const container =
        document.getElementById(
            "bloomBits"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    bloomFilter.forEach(
        (bit, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "bloom-bit";


            if (bit === 1) {

                element.classList.add(
                    "active"
                );
            }


            element.textContent =
                index;


            container.appendChild(
                element
            );

        }
    );
}


// ============================================================
// 18. LOAD INITIAL DATA
// ============================================================

loadSatellites();

displayBloomBits();


// ============================================================
// 19. DEMO QUEUE DATA
// ============================================================

addToQueue(
    "TELEMETRY_101"
);

addToQueue(
    "IMAGE_201"
);

addToQueue(
    "COMMAND_301"
);


// ============================================================
// 20. DEMO PRIORITY QUEUE
// ============================================================

addPriorityPacket(
    "EMERGENCY_ALERT",
    1
);

addPriorityPacket(
    "TELEMETRY_DATA",
    2
);

addPriorityPacket(
    "ROUTINE_IMAGE_DATA",
    3
);

addPriorityPacket(
    "CRITICAL_SYSTEM_STATUS",
    1
);


// ============================================================
// 21. DEMO BLOOM FILTER DATA
// ============================================================

bloomFilter = new Array(
    BLOOM_SIZE
).fill(0);


bloomAddDemo("TELEMETRY_101");
bloomAddDemo("TELEMETRY_102");
bloomAddDemo("IMAGE_201");
bloomAddDemo("COMMAND_301");
bloomAddDemo("ALERT_401");


function bloomAddDemo(packet) {

    bloomFilter[hash1(packet)] = 1;

    bloomFilter[hash2(packet)] = 1;

    bloomFilter[hash3(packet)] = 1;
}


displayBloomBits();


// ============================================================
// 22. INITIAL EVENT
// ============================================================

addEvent(
    "SomaiyaSat Mission Control initialized"
);

addEvent(
    "Ground communication network online"
);

addEvent(
    "Local satellite mission dataset loaded"
);

addEvent(
    "Bloom Filter packet screening active"
);

async function loadMissionData() {
    try {
        const response = await fetch("mission_data.json");

        if (!response.ok) {
            throw new Error("mission_data.json not found");
        }

        const data = await response.json();

        document.getElementById("satelliteCount").textContent = data.satellites;

        document.getElementById("linkedListNodes").textContent =
        data.satellites;

        document.getElementById("queueCount").textContent =
        data.queue;

        document.getElementById("queueNodes").textContent =
        data.queue;
        
        const queueElement =
        document.getElementById("transmissionQueue");

        if (queueElement && data.queuePackets) {

            queueElement.innerHTML =
            data.queuePackets
            .map(packet => `<div>${packet}</div>`)
            .join("");
}

        document.getElementById("priorityQueuePackets").textContent =
        data.priorityPackets;

        document.getElementById("stackEvents").textContent =
        data.events;

        console.log("C DSA Mission Data:", data);

    } catch (error) {
        console.error("Mission data error:", error);
    }
}

loadMissionData();

function processTransmission() {

    const queueElement = document.getElementById("transmissionQueue");
    const queueCountElement = document.getElementById("queueCount");

    if (!queueElement) {
        return;
    }

    const packets = Array.from(queueElement.children);

    if (packets.length === 0) {
        alert("Transmission Queue is empty.");
        return;
    }

    const processedPacket = packets[0].textContent;

    packets[0].remove();

    if (queueCountElement) {
        const currentCount = parseInt(queueCountElement.textContent) || 0;

        if (currentCount > 0) {
            queueCountElement.textContent = currentCount - 1;
        }
    }

    alert("Transmission processed: " + processedPacket);
}