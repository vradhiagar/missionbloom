# 🌸 MissionBloom

### 🛰️ Satellite Mission & DSA Intelligence System

**MissionBloom** is an interactive satellite mission management and communication dashboard developed as a **Data Structures & Algorithms mini-project**.

It combines fundamental DSA concepts with a simulated satellite communication environment, providing a visual way to understand how data structures and algorithms can be applied to real-world systems.

---

## ✨ Highlights

🛰️ **Satellite Management**
Manage and visualize satellite information and telemetry data.

📡 **Telemetry Queue**
Simulate the transmission of satellite packets using queue-based processing.

⚡ **Priority Transmission**
Process critical packets before lower-priority packets using a Priority Queue.

🌐 **Communication Network**
Represent satellite and ground-station connections using Graphs.

🔍 **BFS Network Traversal**
Explore communication paths using Breadth-First Search.

🌸 **Bloom Filter**
Perform fast probabilistic membership checking for transmission packets.

📋 **Event History**
Track mission events using a Stack-based history system.

📊 **Interactive Dashboard**
Monitor the simulated mission through a visual web interface.

---

# 🧠 Data Structures & Algorithms

MissionBloom demonstrates several fundamental Data Structures and Algorithms:

| Data Structure / Algorithm | Application                              |
| -------------------------- | ---------------------------------------- |
| 🔗 **Linked List**         | Dynamic satellite information management |
| 📥 **Queue**               | FIFO telemetry packet transmission       |
| 📚 **Stack**               | Mission event history                    |
| ⚡ **Priority Queue**       | Priority-based packet transmission       |
| 🌐 **Graph**               | Satellite communication network          |
| 🔍 **BFS**                 | Communication network traversal          |
| 🌸 **Bloom Filter**        | Fast probabilistic membership checking   |

---

# 🌸 Bloom Filter

MissionBloom uses a **Bloom Filter** for fast probabilistic membership checking of satellite transmission packets.

A Bloom Filter is a **space-efficient probabilistic data structure** that determines whether an element may be present in a set.

It uses:

* A bit array
* Multiple hash functions
* Insert operations
* Membership checking

### How It Works

```text
                    Packet
                       │
                       ▼
              ┌─────────────────┐
              │  Hash Functions │
              └────────┬────────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
           Hash 1    Hash 2    Hash 3
             │         │         │
             ▼         ▼         ▼
          Bit Index Bit Index Bit Index
             │         │         │
             └─────────┼─────────┘
                       ▼
                   Bit Array
```

When a packet is inserted, multiple hash functions generate positions in the bit array, and those positions are set to `1`.

### Membership Checking

```text
Packet
  │
  ▼
Hash Functions
  │
  ▼
Check Bit Positions
  │
  ├── Any bit = 0 ──► ❌ Definitely Not Present
  │
  └── All bits = 1 ─► ⚠️ Possibly Present
```

A Bloom Filter has an important property:

> **False positives are possible, but false negatives are not.**

Therefore:

* **Not Present** → definitely not present
* **Possibly Present** → may be present and can be verified using the original data structure

### Why It Is Used

MissionBloom uses the Bloom Filter to demonstrate:

* ⚡ Fast membership checking
* 💾 Efficient memory usage
* 📡 Quick packet screening
* 🔎 Probabilistic membership detection
* 📈 Efficient handling of large packet sets

### Complexity

| Operation | Complexity |
| --------- | ---------: |
| Insert    |       O(k) |
| Search    |       O(k) |
| Space     |       O(m) |

where `k` is the number of hash functions and `m` is the size of the bit array.

---

# 🖥️ MissionBloom Dashboard

The MissionBloom dashboard provides a centralized interface for monitoring the simulated satellite mission.

### Dashboard Modules

* 🛰️ Satellite Count
* 🏢 Ground Station Count
* 📡 Telemetry Transmission Queue
* ❤️ Mission Health
* 📈 Satellite Telemetry
* 🌐 Communication Network Map
* ⚙️ DSA Engine Status
* 🌸 Bloom Filter Interface
* ⚡ Priority Queue
* 📋 Mission Event Log

---

# 🏗️ System Overview

```text
                    ┌──────────────────────┐
                    │  MissionBloom        │
                    │     Dashboard       │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Satellite Data     Mission Data      Telemetry
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      DSA Engine      │
                    ├──────────────────────┤
                    │ Linked List           │
                    │ Queue                 │
                    │ Stack                 │
                    │ Priority Queue        │
                    │ Graph                 │
                    │ BFS                   │
                    │ Bloom Filter          │
                    └──────────┬───────────┘
                               │
                               ▼
                  Satellite Communication
                         Network
```

---

# 📁 Project Structure

```text
MissionBloom/
│
├── dashboard/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── satellite.csv
│   └── mission_data.json
│
├── main.c
├── README.md
└── .gitignore
```

### Dashboard Files

| File                | Purpose                 |
| ------------------- | ----------------------- |
| `index.html`        | Dashboard structure     |
| `style.css`         | Dashboard styling       |
| `script.js`         | Dashboard functionality |
| `satellite.csv`     | Satellite dataset       |
| `mission_data.json` | Mission information     |

### DSA Implementation

`main.c` contains the core Data Structures and Algorithms implementation.

---

# ⚙️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Data

* CSV
* JSON

### Core Programming

* C
* Data Structures
* Algorithms

---

# 🚀 Running MissionBloom Locally

### 1. Clone the repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

### 2. Navigate to the dashboard

```bash
cd MissionBloom/dashboard
```

### 3. Start a local server

```bash
python3 -m http.server 8000
```

### 4. Open the dashboard

Visit:

```text
http://localhost:8000
```

---

# 🌐 Live Demo

🚀 **MissionBloom Dashboard**

🔗 **Live Website:** https://missionbloom.vercel.app

---

# 🎯 Project Objectives

* Apply Data Structures and Algorithms to a practical scenario.
* Simulate satellite communication and mission management.
* Visualize DSA operations through an interactive dashboard.
* Demonstrate queue, stack, linked list, graph, and priority queue concepts.
* Demonstrate BFS traversal in a communication network.
* Apply a Bloom Filter for probabilistic membership checking.
* Connect theoretical DSA concepts with a real-world-inspired application.

---

# 📚 Learning Outcomes

Through MissionBloom, the project demonstrates:

* Practical implementation of Data Structures
* Algorithmic problem solving
* Graph traversal
* Priority-based processing
* Probabilistic data structures
* CSV and JSON data handling
* Frontend dashboard development
* Integration of DSA concepts into a practical application

---

# 👥 Project

**MissionBloom**
Data Structures & Algorithms Mini Project

> *Exploring Data Structures, Algorithms & Satellite Intelligence.* 🌸🛰️

---

## 📜 License

This project was developed for **academic and educational purposes**.
