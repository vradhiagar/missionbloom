#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ================= SATELLITE LINKED LIST ================= */

struct Satellite {
    char name[50];
    int norad_id;
    float inclination;
    float mean_motion;
    float eccentricity;

    struct Satellite *next;
};

struct Satellite *head = NULL;

void insertSatellite(char name[], int id, float inclination,
                     float mean_motion, float eccentricity) {

    struct Satellite *newNode;

    newNode = (struct Satellite *)malloc(sizeof(struct Satellite));

    strcpy(newNode->name, name);
    newNode->norad_id = id;
    newNode->inclination = inclination;
    newNode->mean_motion = mean_motion;
    newNode->eccentricity = eccentricity;

    newNode->next = head;
    head = newNode;
}

void displaySatellites() {

    struct Satellite *temp = head;

    printf("\n========== SATELLITE LINKED LIST ==========\n");

    while (temp != NULL) {

        printf("\nSatellite Name : %s", temp->name);
        printf("\nNORAD ID       : %d", temp->norad_id);
        printf("\nInclination    : %.4f", temp->inclination);
        printf("\nMean Motion    : %.8f", temp->mean_motion);
        printf("\nEccentricity   : %.8f\n", temp->eccentricity);

        temp = temp->next;
    }
}


/* ================= SATELLITE CSV DATA ================= */

void loadSatelliteFromCSV() {

    FILE *file;
    char line[1024];

    printf("\nLoading satellite data from local satellite.csv...\n");

    file = fopen("satellite.csv", "r");

    if (file == NULL) {
        printf("Error opening satellite.csv\n");
        printf("Make sure satellite.csv is in the same folder as main.c\n");
        return;
    }

    /* Skip CSV header */
    fgets(line, sizeof(line), file);

    int count = 0;

    while (fgets(line, sizeof(line), file) != NULL) {

        char *token;

        char name[50] = "";
        float mean_motion = 0;
        float eccentricity = 0;
        float inclination = 0;
        int norad_id = 0;

        int field = 0;

        token = strtok(line, ",");

        while (token != NULL) {

            /* Remove newline from last field */
            token[strcspn(token, "\r\n")] = '\0';

            switch (field) {

                case 0:
                    strcpy(name, token);
                    break;

                case 3:
                    mean_motion = atof(token);
                    break;

                case 4:
                    eccentricity = atof(token);
                    break;

                case 5:
                    inclination = atof(token);
                    break;

                case 11:
                    norad_id = atoi(token);
                    break;
            }

            field++;
            token = strtok(NULL, ",");
        }

        if (norad_id != 0) {

            insertSatellite(
                name,
                norad_id,
                inclination,
                mean_motion,
                eccentricity
            );

            count++;
        }
    }

    fclose(file);

    printf("\n%d satellites loaded successfully!\n", count);
}
/* ================= QUEUE ================= */

#define MAX 5

char queue[MAX][50];

int front = -1;
int rear = -1;

void enqueue(char data[]) {

    if (rear == MAX - 1) {

        printf("\nQueue Overflow\n");
        return;
    }

    if (front == -1)
        front = 0;

    rear++;

    strcpy(queue[rear], data);
}

void dequeue() {

    if (front == -1 || front > rear) {

        printf("\nQueue Underflow\n");
        return;
    }

    printf("\nTransmitted Packet: %s", queue[front]);

    front++;
}

void displayQueue() {

    int i;

    printf("\n\n========== TRANSMISSION QUEUE ==========\n");

    if (front == -1 || front > rear) {

        printf("Queue is empty\n");
        return;
    }

    for (i = front; i <= rear; i++) {

        printf("%d. %s\n", i - front + 1, queue[i]);
    }
}

void createTransmissionQueue() {

    struct Satellite *temp = head;
    char packet[50];

    printf("\nCreating transmission packets...\n");

    while (temp != NULL && rear < 2) {

        sprintf(packet, "%d - Telemetry", temp->norad_id);

        enqueue(packet);

        temp = temp->next;
    }

    printf("Satellite packets added to Queue.\n");
}

/* ================= PRIORITY QUEUE ================= */

struct Packet {
    char data[50];
    int priority;
};

struct Packet priorityQueue[10];
int priorityCount = 0;

void addPriorityPacket(char data[], int priority) {

    if (priorityCount == 10) {
        printf("\nPriority Queue Full\n");
        return;
    }

    strcpy(priorityQueue[priorityCount].data, data);
    priorityQueue[priorityCount].priority = priority;

    priorityCount++;
}

void displayPriorityQueue() {

    int i, j;
    struct Packet temp;

    /* Sort by priority: 1 = HIGH, 2 = MEDIUM, 3 = LOW */

    for (i = 0; i < priorityCount - 1; i++) {

        for (j = i + 1; j < priorityCount; j++) {

            if (priorityQueue[i].priority >
                priorityQueue[j].priority) {

                temp = priorityQueue[i];
                priorityQueue[i] = priorityQueue[j];
                priorityQueue[j] = temp;
            }
        }
    }

    printf("\n========== PRIORITY TRANSMISSION QUEUE ==========\n");

    for (i = 0; i < priorityCount; i++) {

        printf("%d. %s - ", i + 1, priorityQueue[i].data);

        if (priorityQueue[i].priority == 1)
            printf("HIGH\n");

        else if (priorityQueue[i].priority == 2)
            printf("MEDIUM\n");

        else
            printf("LOW\n");
    }
}

void transmitPriorityPacket() {

    if (priorityCount == 0) {
        printf("\nNo packets available.\n");
        return;
    }

    printf("\nTransmitting: %s\n",
           priorityQueue[0].data);

    printf("Priority: ");

    if (priorityQueue[0].priority == 1)
        printf("HIGH\n");

    else if (priorityQueue[0].priority == 2)
        printf("MEDIUM\n");

    else
        printf("LOW\n");

    /* Shift remaining packets */

    for (int i = 0; i < priorityCount - 1; i++) {
        priorityQueue[i] = priorityQueue[i + 1];
    }

    priorityCount--;
}

/* ================= STACK ================= */

#define STACK_SIZE 10

char stack[STACK_SIZE][50];

int top = -1;

void push(char data[]) {

    if (top == STACK_SIZE - 1) {

        printf("\nStack Overflow\n");
        return;
    }

    top++;

    strcpy(stack[top], data);
}

void pop() {

    if (top == -1) {

        printf("\nStack Underflow\n");
        return;
    }

    printf("\nLatest Event Removed: %s", stack[top]);

    top--;
}

void displayStack() {

    int i;

    printf("\n\n========== EVENT STACK ==========\n");

    for (i = top; i >= 0; i--) {

        printf("%s\n", stack[i]);
    }
}

void createEventStack() {

    struct Satellite *temp = head;
    char event[50];

    printf("\nCreating satellite event history...\n");

    while (temp != NULL && top < STACK_SIZE - 1) {

        sprintf(event, "Telemetry received - %d", temp->norad_id);

        push(event);

        temp = temp->next;
    }

    printf("Satellite events added to Stack.\n");
}

/* ================= GRAPH ================= */

#define V 5

char stations[V][40] = {

    "Satellite",
    "Mumbai Ground Station",
    "Delhi Ground Station",
    "Bangalore Ground Station",
    "Pune Ground Station"
};

int graph[V][V] = {0};

void addEdge(int a, int b) {

    graph[a][b] = 1;
    graph[b][a] = 1;
}

void displayGraph() {

    int i, j;

    printf("\n\n========== COMMUNICATION GRAPH ==========\n");

    for (i = 0; i < V; i++) {

        printf("%s -> ", stations[i]);

        for (j = 0; j < V; j++) {

            if (graph[i][j] == 1) {

                printf("%s, ", stations[j]);
            }
        }

        printf("\n");
    }
}


/* ================= BFS ================= */

void BFS(int start) {

    int visited[V] = {0};

    int bfsQueue[V];

    int frontBFS = 0;
    int rearBFS = 0;

    int current;
    int i;

    visited[start] = 1;

    bfsQueue[rearBFS++] = start;

    printf("\n\n========== BFS NETWORK TRAVERSAL ==========\n");

    while (frontBFS < rearBFS) {

        current = bfsQueue[frontBFS++];

        printf("%s -> ", stations[current]);

        for (i = 0; i < V; i++) {

            if (graph[current][i] == 1 &&
                visited[i] == 0) {

                visited[i] = 1;

                bfsQueue[rearBFS++] = i;
            }
        }
    }

    printf("END\n");
}


/* ================= SEARCHING ================= */

void searchSatellite(int id) {

    struct Satellite *temp = head;

    while (temp != NULL) {

        if (temp->norad_id == id) {

            printf("\n\n========== SEARCH RESULT ==========\n");

            printf("Satellite Found!\n");
            printf("Name     : %s\n", temp->name);
            printf("NORAD ID : %d\n", temp->norad_id);

            return;
        }

        temp = temp->next;
    }

    printf("\nSatellite not found.\n");
}


/* ================= SORTING ================= */

void sortSatellites() {

    struct Satellite *i;
    struct Satellite *j;

    char tempName[50];

    int tempID;

    float tempInclination;
    float tempMeanMotion;
    float tempEccentricity;

    for (i = head; i != NULL; i = i->next) {

        for (j = i->next; j != NULL; j = j->next) {

            if (i->inclination > j->inclination) {

                strcpy(tempName, i->name);
                strcpy(i->name, j->name);
                strcpy(j->name, tempName);

                tempID = i->norad_id;
                i->norad_id = j->norad_id;
                j->norad_id = tempID;

                tempInclination = i->inclination;
                i->inclination = j->inclination;
                j->inclination = tempInclination;

                tempMeanMotion = i->mean_motion;
                i->mean_motion = j->mean_motion;
                j->mean_motion = tempMeanMotion;

                tempEccentricity = i->eccentricity;
                i->eccentricity = j->eccentricity;
                j->eccentricity = tempEccentricity;
            }
        }
    }
}

void showMenu() {

    printf("\n========== SOMAIYASAT MISSION CONTROL ==========\n");

    printf("\n1. Display Satellites\n");
    printf("2. Search Satellite\n");
    printf("3. Sort Satellites\n");
    printf("4. Show Transmission Queue\n");
    printf("5. Process Transmission\n");
    printf("6. Show Event History\n");
    printf("7. Remove Latest Event\n");
    printf("8. Show Communication Graph\n");
    printf("9. BFS Network Traversal\n");
    printf("10. Show Priority Queue\n");
    printf("11. Transmit Highest Priority Packet\n");
    printf("12. Show DSA Implementation\n");
    printf("13. Bloom Filter\n");
    printf("14. Exit\n");

    printf("\nEnter your choice: ");
}


void searchMenu() {

    int id;

    printf("\nEnter NORAD ID to search: ");
    scanf("%d", &id);

    searchSatellite(id);
}

void displayDSAImplementation()
{
    printf("\n========== DSA IMPLEMENTATION ==========\n");

    printf("\n1. Linked List");
    printf("  -> Stores satellite records\n");

    printf("2. Queue");
    printf("        -> Manages transmission packets\n");

    printf("3. Stack");
    printf("        -> Stores event history\n");

    printf("4. Priority Queue");
    printf(" -> Prioritizes important data\n");

    printf("5. Graph");
    printf("         -> Represents communication network\n");

    printf("6. BFS");
    printf("           -> Traverses communication network\n");

    printf("7. Searching");
    printf("     -> Searches satellite using NORAD ID\n");

    printf("8. Sorting");
    printf("       -> Sorts satellites by inclination\n");

    printf("\n========================================\n");
}

/* ================= BLOOM FILTER ================= */

#define BLOOM_SIZE 50

int bloomFilter[BLOOM_SIZE] = {0};


/* Hash Function 1 */
int hash1(char data[])
{
    int hash = 0;
    int i;

    for (i = 0; data[i] != '\0'; i++)
    {
        hash = (hash + data[i]) % BLOOM_SIZE;
    }

    return hash;
}


/* Hash Function 2 */
int hash2(char data[])
{
    int hash = 0;
    int i;

    for (i = 0; data[i] != '\0'; i++)
    {
        hash = (hash * 31 + data[i]) % BLOOM_SIZE;
    }

    return hash;
}


/* Hash Function 3 */
int hash3(char data[])
{
    int hash = 0;
    int i;

    for (i = 0; data[i] != '\0'; i++)
    {
        hash = (hash * 17 + data[i]) % BLOOM_SIZE;
    }

    return hash;
}


/* Add data to Bloom Filter */
void bloomInsert(char data[])
{
    int h1 = hash1(data);
    int h2 = hash2(data);
    int h3 = hash3(data);

    bloomFilter[h1] = 1;
    bloomFilter[h2] = 1;
    bloomFilter[h3] = 1;
}


/* Search data in Bloom Filter */
int bloomSearch(char data[])
{
    int h1 = hash1(data);
    int h2 = hash2(data);
    int h3 = hash3(data);

    if (bloomFilter[h1] == 1 &&
        bloomFilter[h2] == 1 &&
        bloomFilter[h3] == 1)
    {
        return 1;
    }

    return 0;
}


/* Display Bloom Filter */
void displayBloomFilter()
{
    int i;

    printf("\n========== BLOOM FILTER ==========\n");

    for (i = 0; i < BLOOM_SIZE; i++)
    {
        printf("%d ", bloomFilter[i]);
    }

    printf("\n==================================\n");
}


/* Bloom Filter Demo */
void bloomFilterDemo()
{
    char packet[50];

    /* Sample mission packets */

    bloomInsert("TELEMETRY_101");
    bloomInsert("TELEMETRY_102");
    bloomInsert("IMAGE_201");
    bloomInsert("COMMAND_301");
    bloomInsert("ALERT_401");

    printf("\n========== BLOOM FILTER ==========\n");

    printf("\nStored mission packets:");
    printf("\nTELEMETRY_101");
    printf("\nTELEMETRY_102");
    printf("\nIMAGE_201");
    printf("\nCOMMAND_301");
    printf("\nALERT_401");

    printf("\n\nEnter packet ID to check: ");
    scanf("%s", packet);

    if (bloomSearch(packet))
    {
        printf("\nResult: Packet MAY exist.");
        printf("\nBloom Filter: POSSIBLY PRESENT\n");
    }
    else
    {
        printf("\nResult: Packet definitely does NOT exist.");
        printf("\nBloom Filter: NOT PRESENT\n");
    }

    displayBloomFilter();
}

void generateMissionData() {
    FILE *file;
    struct Satellite *temp;
    int satelliteCount = 0;
    int i;

    temp = head;

    while (temp != NULL) {
        satelliteCount++;
        temp = temp->next;
    }

    file = fopen("dashboard/mission_data.json", "w");

    if (file == NULL) {
        printf("\nError: Could not create mission_data.json\n");
        return;
    }

    fprintf(file, "{\n");

    /* Linked List */
    fprintf(file, "  \"satellites\": %d,\n", satelliteCount);

    /* Queue count */
    int queueCount = 0;

    if (front != -1 && front <= rear) {
        queueCount = rear - front + 1;
    }

    fprintf(file, "  \"queue\": %d,\n", queueCount);

    /* Actual Queue packets */
    fprintf(file, "  \"queuePackets\": [");

    if (front != -1 && front <= rear) {

        for (i = front; i <= rear; i++) {

            fprintf(file, "\"%s\"", queue[i]);

            if (i < rear) {
                fprintf(file, ", ");
            }
        }
    }

    fprintf(file, "],\n");

    /* Stack */
    fprintf(file, "  \"events\": %d,\n", top + 1);

    /* Priority Queue */
    fprintf(file, "  \"priorityPackets\": %d\n", priorityCount);

    fprintf(file, "}\n");

    fclose(file);

    printf("\nMission data exported to dashboard/mission_data.json\n");
}

/* ================= MAIN ================= */

int main() {

    int choice;

    printf("\n");
    printf("============================================\n");
    printf("       SOMAIYASAT AUTONOMOUS SYSTEM        \n");
    printf("============================================\n");

    /* ---------- LOAD REAL CELESTRAK DATA ---------- */

    loadSatelliteFromCSV();

    /* ---------- CREATE COMMUNICATION GRAPH ---------- */

    addEdge(0, 1);
    addEdge(0, 2);
    addEdge(0, 3);

    addEdge(1, 4);
    addEdge(2, 4);

    /* ---------- CREATE QUEUE ---------- */

    createTransmissionQueue();

    /* ---------- CREATE STACK ---------- */

    createEventStack();
    /* ---------- PRIORITY DATA ---------- */

    addPriorityPacket("Emergency Alert", 1);
    addPriorityPacket("Telemetry Data", 2);
    addPriorityPacket("Routine Image Data", 3);
    addPriorityPacket("Critical System Status", 1);
    generateMissionData();

    /* ---------- MENU ---------- */

    do {

        showMenu();

        scanf("%d", &choice);

        switch (choice) {

            case 1:

                displaySatellites();

                break;


            case 2:

                searchMenu();

                break;


            case 3:

                sortSatellites();

                printf("\nSatellites sorted by inclination.\n");

                displaySatellites();

                break;


            case 4:

                displayQueue();

                break;


            case 5:

                dequeue();

                break;


            case 6:

                displayStack();

                break;


            case 7:

                pop();

                break;


            case 8:

                displayGraph();

                break;


            case 9:

                BFS(0);

                break;


            case 10:

                displayPriorityQueue();

                break;


            case 11:

                transmitPriorityPacket();

                break;
             
            case 12:
                displayDSAImplementation();
                break;

            case 13:
                bloomFilterDemo();
                break;

            case 14:

                printf("\nExiting SomaiyaSat Mission Control...\n");

                break;

            default:

                printf("\nInvalid choice. Please try again.\n");
        }

    } while (choice != 14);


    printf("\n============================================\n");
    printf("       PROGRAM TERMINATED SUCCESSFULLY     \n");
    printf("============================================\n");

    return 0;
}