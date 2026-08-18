import { 
  initialWarehouses, 
  initialItems, 
  initialSuppliers, 
  initialOrders, 
  initialHistory 
} from './mockData.js';

import { renderDashboard } from './components/dashboard.js';
import { renderInventory } from './components/inventory.js';
import { renderBarcodeFinder } from './components/barcode.js';
import { renderHistory } from './components/history.js';
import { renderOrders } from './components/orders.js';
import { renderSupplierHub } from './components/suppliers.js';
import { renderLogistics } from './components/logistics.js';

class App {
  constructor() {
    this.state = {
      warehouses: [],
      items: [],
      suppliers: [],
      orders: [],
      history: [],
      notifications: [],
      activeTab: 'dashboard',
      inventoryUiState: null,
      barcodeUiState: null,
      logisticsUiState: null
    };

    this.init();
  }

  init() {
    // Load state from localStorage or seed data
    this.state.warehouses = this.loadFromStorage('wh_data', initialWarehouses);
    this.state.items = this.loadFromStorage('items_data', initialItems);
    this.state.suppliers = this.loadFromStorage('suppliers_data', initialSuppliers);
    this.state.orders = this.loadFromStorage('orders_data', initialOrders);
    this.state.history = this.loadFromStorage('history_data', initialHistory);
    this.state.notifications = this.loadFromStorage('notifications_data', [
      { id: 'notif-1', message: 'Warehouse Control Panel initialized online.', type: 'success', timestamp: new Date().toISOString() }
    ]);

    // Setup DOM bindings
    this.container = document.getElementById('active-view-container');
    this.toastContainer = document.getElementById('toast-container');
    this.notifList = document.getElementById('notifications-list');
    this.notifBadge = document.getElementById('notification-badge');
    this.orderBadge = document.getElementById('order-badge');
    this.notifBell = document.querySelector('.bell-icon-wrapper');
    this.notifPanel = document.getElementById('notifications-panel');
    this.clearNotifBtn = document.getElementById('clear-notifications');
    this.topbarSearch = document.getElementById('topbar-barcode-search');

    this.bindEvents();
    this.startClock();
    this.updateBadges();
    this.render();
  }

  loadFromStorage(key, defaultValue) {
    const data = localStorage.getItem(`saas_wh_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }

  saveState() {
    localStorage.setItem('saas_wh_wh_data', JSON.stringify(this.state.warehouses));
    localStorage.setItem('saas_wh_items_data', JSON.stringify(this.state.items));
    localStorage.setItem('saas_wh_suppliers_data', JSON.stringify(this.state.suppliers));
    localStorage.setItem('saas_wh_orders_data', JSON.stringify(this.state.orders));
    localStorage.setItem('saas_wh_history_data', JSON.stringify(this.state.history));
    localStorage.setItem('saas_wh_notifications_data', JSON.stringify(this.state.notifications));
    
    this.updateBadges();
  }

  bindEvents() {
    // Sidebar Navigation Tabs
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Top Bar Quick Search
    this.topbarSearch.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
          // Direct to barcode finder
          this.state.barcodeUiState = {
            scannedCode: query,
            isScanning: false,
            matchResult: null
          };
          this.switchTab('barcode');
          // Trigger the simulation search immediately in the barcode view
          const tabBtn = document.querySelector(`[data-code="${query}"]`);
          if (tabBtn) {
            tabBtn.click();
          } else {
            // Find and search manually
            const manualSearchField = document.getElementById('barcode-manual-input');
            if (manualSearchField) {
              manualSearchField.value = query;
              // Trigger enter
              const event = new KeyboardEvent('keyup', { key: 'Enter' });
              manualSearchField.dispatchEvent(event);
            }
          }
          e.target.value = ''; // Clear topbar search
        }
      }
    });

    // Notifications Toggle
    this.notifBell.addEventListener('click', (e) => {
      e.stopPropagation();
      this.notifPanel.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!this.notifPanel.contains(e.target) && e.target !== this.notifBell) {
        this.notifPanel.classList.remove('active');
      }
    });

    // Clear notifications
    this.clearNotifBtn.addEventListener('click', () => {
      this.state.notifications = [];
      this.saveState();
      this.renderNotificationsList();
      this.showToast('All notifications cleared.', 'info');
    });
  }

  startClock() {
    const clockEl = document.getElementById('system-clock');
    const updateTime = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  updateBadges() {
    // Update Pending Order Badge
    const pendingCount = this.state.orders.filter(o => o.status === 'Pending').length;
    this.orderBadge.textContent = pendingCount;
    this.orderBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';

    // Update Notification Badge
    const notifCount = this.state.notifications.length;
    this.notifBadge.textContent = notifCount;
    this.notifBadge.style.display = notifCount > 0 ? 'inline-block' : 'none';

    this.renderNotificationsList();
  }

  renderNotificationsList() {
    if (this.state.notifications.length === 0) {
      this.notifList.innerHTML = `<div class="empty-notifications">No new messages</div>`;
      return;
    }

    this.notifList.innerHTML = this.state.notifications.map(n => `
      <div class="notification-item alert-${n.type || 'info'}">
        <div>${n.message}</div>
        <span class="time">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `).join('');
  }

  addNotification(message, type = 'info') {
    const notif = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date().toISOString()
    };
    
    // Add to start of list
    this.state.notifications.unshift(notif);
    // Limit to 20 notifications
    if (this.state.notifications.length > 20) {
      this.state.notifications.pop();
    }

    this.saveState();
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);

    // Fade and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  switchTab(tabName) {
    this.state.activeTab = tabName;
    
    // Update navigation active styles
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.render();
  }

  // Stock Adjustment Action
  adjustStock(sku, warehouseId, changeQty, actionType = 'Manual Edit') {
    const item = this.state.items.find(i => i.sku === sku);
    if (!item) return;

    const prevStock = item.stocks[warehouseId] || 0;
    const newStock = prevStock + changeQty;

    if (newStock < 0) {
      this.showToast('Stock count cannot be negative.', 'danger');
      return;
    }

    // Set stock
    item.stocks[warehouseId] = newStock;

    // Log to history ledger
    const logId = `hist-${Math.floor(Math.random() * 90000) + 10000}`;
    this.state.history.push({
      id: logId,
      timestamp: new Date().toISOString(),
      sku,
      warehouseId,
      actionType,
      qtyChanged: changeQty,
      prevStock,
      newStock,
      undoable: true
    });

    this.saveState();
    this.showToast(`Stock updated for ${item.name} (${sku})`, 'success');
    this.addNotification(`Stock adjusted for ${sku}: ${changeQty > 0 ? '+' : ''}${changeQty} units`, 'info');
    
    this.render();
  }

  // Undo transaction Action
  undoChange(logId) {
    const log = this.state.history.find(h => h.id === logId);
    if (!log) {
      this.showToast('Transaction log not found.', 'danger');
      return;
    }

    if (!log.undoable) {
      this.showToast('This transaction has already been undone.', 'warning');
      return;
    }

    const item = this.state.items.find(i => i.sku === log.sku);
    if (!item) {
      this.showToast('Item associated with this transaction no longer exists.', 'danger');
      return;
    }

    const currentStock = item.stocks[log.warehouseId] || 0;
    
    // Check if reversion would make stock negative
    // e.g., if we added stock before (+qtyChanged), undo will subtract it (-qtyChanged).
    // if current stock is less than what we added, it would go negative.
    const reversionQty = -log.qtyChanged;
    if (currentStock + reversionQty < 0) {
      this.showToast(`Cannot undo: Reversion would cause negative stock (${currentStock} currently, reversion needs ${reversionQty}).`, 'danger');
      return;
    }

    // Revert stock
    const prevStock = currentStock;
    const newStock = currentStock + reversionQty;
    item.stocks[log.warehouseId] = newStock;

    // Mark log as undone (non-undoable)
    log.undoable = false;

    // Log the undo action itself in history
    this.state.history.push({
      id: `hist-${Math.floor(Math.random() * 90000) + 10000}`,
      timestamp: new Date().toISOString(),
      sku: log.sku,
      warehouseId: log.warehouseId,
      actionType: 'Undo',
      qtyChanged: reversionQty,
      prevStock,
      newStock,
      undoable: false // Undos themselves cannot be undone to prevent complexity
    });

    this.saveState();
    this.showToast(`Successfully undid transaction ${logId}. Stock reverted.`, 'success');
    this.addNotification(`Undo applied to transaction: reverted ${reversionQty > 0 ? '+' : ''}${reversionQty} units for ${log.sku}`, 'warning');
    
    this.render();
  }

  render() {
    const actions = {
      showToast: (msg, type) => this.showToast(msg, type),
      addNotification: (msg, type) => this.addNotification(msg, type),
      saveState: () => this.saveState(),
      renderActiveTab: () => this.render(),
      switchTab: (tab) => this.switchTab(tab),
      adjustStock: (sku, wh, qty, type) => this.adjustStock(sku, wh, qty, type),
      undoChange: (logId) => this.undoChange(logId)
    };

    switch (this.state.activeTab) {
      case 'dashboard':
        renderDashboard(this.container, this.state, actions);
        break;
      case 'inventory':
        renderInventory(this.container, this.state, actions);
        break;
      case 'barcode':
        renderBarcodeFinder(this.container, this.state, actions);
        break;
      case 'history':
        renderHistory(this.container, this.state, actions);
        break;
      case 'orders':
        renderOrders(this.container, this.state, actions);
        break;
      case 'suppliers':
        renderSupplierHub(this.container, this.state, actions);
        break;
      case 'logistics':
        renderLogistics(this.container, this.state, actions);
        break;
      default:
        this.container.innerHTML = `<h2>View not found</h2>`;
    }
  }
}

// Instantiate App on document load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
