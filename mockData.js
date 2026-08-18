const initialWarehouses = [
  { id: 'wh-north', name: 'North Hub', region: 'North', capacity: 1000, x: 200, y: 120, costPerKm: 1.0 },
  { id: 'wh-south', name: 'South Terminal', region: 'South', capacity: 1500, x: 250, y: 380, costPerKm: 1.2 },
  { id: 'wh-east', name: 'East Station', region: 'East', capacity: 800, x: 480, y: 180, costPerKm: 1.1 },
  { id: 'wh-west', name: 'West Depot', region: 'West', capacity: 1200, x: 100, y: 280, costPerKm: 0.9 }
];

const initialItems = [
  {
    sku: 'SKU-NEON-01',
    name: 'Neon Tube Lights',
    barcode: '789012345601',
    stocks: { 'wh-north': 400, 'wh-south': 100, 'wh-east': 50, 'wh-west': 20 },
    expirationDate: '2026-07-25',
    supplierId: 'sup-lumen',
    category: 'Electronics'
  },
  {
    sku: 'SKU-CRYO-02',
    name: 'Cryo Coolant Gel',
    barcode: '789012345602',
    stocks: { 'wh-north': 10, 'wh-south': 600, 'wh-east': 10, 'wh-west': 800 },
    expirationDate: '2026-06-25', // very close!
    supplierId: 'sup-chem',
    category: 'Chemicals'
  },
  {
    sku: 'SKU-SPRK-03',
    name: 'Spark Plug X100',
    barcode: '789012345603',
    stocks: { 'wh-north': 150, 'wh-south': 150, 'wh-east': 150, 'wh-west': 150 },
    expirationDate: '2027-12-01',
    supplierId: 'sup-auto',
    category: 'Automotive'
  },
  {
    sku: 'SKU-ALUM-04',
    name: 'Aluminum Bracket C',
    barcode: '789012345604',
    stocks: { 'wh-north': 30, 'wh-south': 40, 'wh-east': 500, 'wh-west': 10 },
    expirationDate: '2028-03-15',
    supplierId: 'sup-auto',
    category: 'Hardware'
  },
  {
    sku: 'SKU-GLOW-05',
    name: 'Glow-in-Dark Paint',
    barcode: '789012345605',
    stocks: { 'wh-north': 80, 'wh-south': 0, 'wh-east': 90, 'wh-west': 15 },
    expirationDate: '2026-10-10',
    supplierId: 'sup-chem',
    category: 'Chemicals'
  },
  {
    sku: 'SKU-LED-06',
    name: 'LED Driver Board',
    barcode: '789012345606',
    stocks: { 'wh-north': 500, 'wh-south': 300, 'wh-east': 0, 'wh-west': 0 },
    expirationDate: '2026-06-12', // extremely close!
    supplierId: 'sup-lumen',
    category: 'Electronics'
  }
];

const initialSuppliers = [
  { id: 'sup-lumen', name: 'LumenCorp Industries', moq: 200, deliveryLimit: 1000, leadTime: 5, contact: 'orders@lumencorp.com' },
  { id: 'sup-chem', name: 'CryoChem Biotech', moq: 100, deliveryLimit: 500, leadTime: 12, contact: 'safety@cryochem.com' },
  { id: 'sup-auto', name: 'AutoLink Logistics', moq: 50, deliveryLimit: 2000, leadTime: 3, contact: 'supply@autolink.com' }
];

const initialOrders = [
  { id: 'ord-1001', customerName: 'Apex Electrics', region: 'North', sku: 'SKU-NEON-01', quantity: 50, timestamp: '2026-06-09T08:30:00Z', status: 'Pending' },
  { id: 'ord-1002', customerName: 'Stellar Auto', region: 'East', sku: 'SKU-ALUM-04', quantity: 120, timestamp: '2026-06-09T09:15:00Z', status: 'Pending' },
  { id: 'ord-1003', customerName: 'BioCold Labs', region: 'South', sku: 'SKU-CRYO-02', quantity: 200, timestamp: '2026-06-09T10:00:00Z', status: 'Pending' },
  { id: 'ord-1004', customerName: 'Volt Repairs', region: 'West', sku: 'SKU-LED-06', quantity: 80, timestamp: '2026-06-09T11:45:00Z', status: 'Pending' }
];

const initialHistory = [
  {
    id: 'hist-001',
    timestamp: '2026-06-09T07:00:00Z',
    sku: 'SKU-NEON-01',
    warehouseId: 'wh-north',
    actionType: 'Manual Edit',
    qtyChanged: 50,
    prevStock: 350,
    newStock: 400,
    undoable: true
  },
  {
    id: 'hist-002',
    timestamp: '2026-06-09T07:30:00Z',
    sku: 'SKU-CRYO-02',
    warehouseId: 'wh-south',
    actionType: 'Transfer',
    qtyChanged: -100,
    prevStock: 700,
    newStock: 600,
    undoable: true
  }
];

// Warehouse-to-Warehouse connection distances (for route planning)
const transferRoutes = [
  { from: 'wh-north', to: 'wh-east', distance: 350 },
  { from: 'wh-north', to: 'wh-west', distance: 200 },
  { from: 'wh-west', to: 'wh-south', distance: 280 },
  { from: 'wh-east', to: 'wh-south', distance: 310 },
  { from: 'wh-north', to: 'wh-south', distance: 500 } // Direct but long route
];

window.initialWarehouses = initialWarehouses;
window.initialItems = initialItems;
window.initialSuppliers = initialSuppliers;
window.initialOrders = initialOrders;
window.initialHistory = initialHistory;
window.transferRoutes = transferRoutes;

export {
  initialWarehouses,
  initialItems,
  initialSuppliers,
  initialOrders,
  initialHistory,
  transferRoutes
};
