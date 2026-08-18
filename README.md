SaaS Warehouse Splitter

1. Project Title
SaaS Warehouse Splitter

2. Problem Statement
The SaaS Warehouse Splitter is designed to manage inventory stored across multiple warehouses. The system tracks products, customer orders, stock changes, supplier rules, expiration dates, and warehouse transfers. It helps businesses reduce storage problems, avoid stock shortages, and minimize transportation costs.

3. Objectives
Maintain a master list of products and warehouse stock.
Record and undo incorrect stock changes.
Process customer orders in submission order.
Search products quickly using barcodes.
Sort products according to expiration dates.
Manage supplier rules centrally.
Find low-cost transfer routes between warehouses.
Balance stock levels across warehouses.

4. System Overview
The system consists of several modules:

Master Item List
Stock Change History
Order Queue
Barcode Search
Expiration Date Sorter
Supplier Rule Hub
Transfer Route Planner
Stock Level Balancer

5. Data Structures and Algorithms Used
Feature	Data Structure / Algorithm
Master Item List	Array / Hash Table
Undo Stock Changes	Stack
Order Line-Up	Queue
Barcode Finder	Hash Table
Expiration Date Sorter	Min-Heap / Sorting
Supplier Rule Hub	Hash Map
Cheap Transfer Route	Graph + Dijkstra's Algorithm
Stock Level Balancer	Greedy Algorithm

6. Implementation Approach
a. Master Item List
Each SKU stores information such as:

SKU ID
Product name
Barcode
Quantity
Warehouse location
Expiration date
A hash table provides fast product lookup.

b. Undo Stock Changes
Every stock modification is stored in a stack. The most recent change is removed first, following the LIFO (Last In, First Out) principle.

c. Order Line-Up
Incoming orders are stored in a queue. Orders are processed in the same order in which they were received using FIFO (First In, First Out).

d. Barcode Finder
A hash table maps each barcode to its corresponding product. This allows very fast searching.

e. Expiration Date Sorter
Products are sorted by expiration date so that items expiring soon can be handled first. A min-heap can efficiently provide the earliest expiration date.

f. Supplier Rule Hub
Supplier information and delivery restrictions are stored using a hash map. Inventory modules can access these rules when planning purchases or transfers.

g. Cheap Transfer Route
Warehouses are represented as vertices in a graph and transportation costs as edge weights. Dijkstra's algorithm can find the lowest-cost route between warehouses.

h. Stock Level Balancer
The system compares stock levels between warehouses and identifies warehouses with excess and shortage. A greedy approach can transfer available excess stock to shortage locations.

7. Time and Space Complexity
Operation	Time Complexity
Hash table search	O(1) average
Stack push/pop	O(1)
Queue insertion/removal	O(1)
Sorting expiration dates	O(n log n)
Min-heap insertion/removal	O(log n)
Dijkstra's Algorithm	O((V + E) log V)
Stock balancing	O(n log n) approximately
The space complexity is approximately O(n + V + E), where n is the number of inventory records, V is the number of warehouses, and E is the number of warehouse connections.

8. Execution Steps
Start the warehouse management system.
Add products and their warehouse details.
Store stock quantities in the master inventory.
Add incoming customer orders to the queue.
Search products using their barcode.
Sort products by expiration date.
Record every stock modification in the history stack.
Apply supplier rules during inventory operations.
Calculate the cheapest warehouse transfer route.
Balance excess and shortage stock between warehouses.
Display updated inventory and order information.

9. Sample Input and Output
Sample Input:

SKU: P101
Product: Laptop
Barcode: 890123456
Warehouse: W1
Quantity: 50
Expiration: 2027-03-15
Order: O101 → P101 → Quantity 5

Sample Output:

Product Found: Laptop
Available Stock: 50
Order Added: O101
Order Status: Processing
Remaining Stock: 45

Cheapest Transfer:
W1 → W2
Transportation Cost: ₹500

Stock Balance:
W1 Excess: 20
W2 Shortage: 15
Transfer Recommended: 15 units

10. Screenshots
Screenshots can be added for:

Main dashboard
Master item list
Order queue
Barcode search
Expiration sorter
Supplier rules
Transfer route
Stock balancing results

11. Results and Observations
The system provides an organized method for managing inventory across multiple warehouses. Hash tables make product searches fast, stacks provide safe undo functionality, queues maintain order processing, and graph algorithms help reduce transportation costs.

12. Advantages
Fast product searching.
Easy stock correction.
Proper order processing.
Better expiration management.
Centralized supplier information.
Reduced transportation cost.
Improved stock distribution.
Suitable for large warehouse networks.

13. Conclusion
The SaaS Warehouse Splitter combines important data structures and algorithms to create an efficient warehouse management system. By using stacks, queues, hash tables, heaps, graphs, and greedy algorithms, the system can manage inventory, orders, transfers, and supplier rules effectively while improving overall warehouse efficiency.
