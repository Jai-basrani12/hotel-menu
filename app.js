/**
 * ============================================================================
 * HOTEL GRAND XENIA - DIGITAL MENU APPLICATION LOGIC
 * ============================================================================
 * Vanilla JavaScript:
 * - Dynamic rendering from menu-data.js
 * - Table / Room URL parameter parsing (?table=5, ?room=204)
 * - In-memory cart with responsive steppers (+ / -)
 * - Slide-up order drawer with bill summary & 5% GST calculation
 * - Itemized WhatsApp order generation for kitchen & room service
 * - Category navigation & scroll-spy synchronization
 * - Dietary filters (All, Pure Veg, Non-Veg, Chef's Specials) & instant search
 * - XSS escaping for safe HTML rendering
 * ============================================================================
 */

(function () {
    'use strict';

    // Global Application State
    const state = {
        cart: {}, // { [dishId]: { dish: DishObject, count: number } }
        currentFilter: 'all', // 'all' | 'veg' | 'non-veg' | 'special'
        searchQuery: '',
        tableNumber: null,
        roomNumber: null,
        activeCategory: null,
        isManualScroll: false
    };

    /**
     * Escape special HTML characters to prevent XSS.
     * @param {*} value
     * @returns {string}
     */
    function escapeHTML(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Parse URL query parameters for Table or Room numbers.
     * Examples supported: ?table=5, ?tbl=12, ?room=204, ?rm=305
     */
    function parseLocationParams() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const table = urlParams.get('table') || urlParams.get('tbl') || urlParams.get('t');
            const room = urlParams.get('room') || urlParams.get('rm') || urlParams.get('r');

            if (table) state.tableNumber = table.trim();
            if (room) state.roomNumber = room.trim();
        } catch (e) {
            console.warn('Could not parse URL location parameters', e);
        }
    }

    /**
     * Render Hotel Header Information, Call & WhatsApp links.
     */
    function renderHotelInfo() {
        if (typeof RESTAURANT === 'undefined') {
            console.error('RESTAURANT configuration object missing in menu-data.js');
            return;
        }

        // Restaurant Names & Taglines
        const nameEl = document.getElementById('restaurantName');
        const taglineEl = document.getElementById('restaurantTagline');
        const announcementEl = document.getElementById('announcementText');
        const addressEl = document.getElementById('restaurantAddress');
        const footerYear = document.getElementById('footerYear');

        if (nameEl) nameEl.textContent = RESTAURANT.name;
        if (taglineEl) taglineEl.textContent = RESTAURANT.tagline;
        if (announcementEl && RESTAURANT.announcement) announcementEl.textContent = RESTAURANT.announcement;
        if (addressEl && RESTAURANT.address) {
            addressEl.innerHTML = `<i class="fa-solid fa-location-dot text-gold-500"></i> ${escapeHTML(RESTAURANT.address)}`;
        }
        if (footerYear) footerYear.textContent = new Date().getFullYear();

        // Phone & WhatsApp Actions
        const callBtn = document.getElementById('callReceptionBtn');
        const waHelpdeskBtn = document.getElementById('whatsappHelpdeskBtn');

        const cleanPhone = (RESTAURANT.phone || '').replace(/[^0-9+]/g, '');
        if (callBtn) callBtn.setAttribute('href', cleanPhone ? `tel:${cleanPhone}` : '#');

        const cleanWA = (RESTAURANT.whatsapp || '').replace(/[^0-9]/g, '');
        if (waHelpdeskBtn) {
            const welcomeMsg = encodeURIComponent(`Hello ${RESTAURANT.name}, I need assistance with room service.`);
            waHelpdeskBtn.setAttribute('href', cleanWA ? `https://wa.me/${cleanWA}?text=${welcomeMsg}` : '#');
        }

        // Render Room / Table Badge & Pre-fill inputs
        setupLocationContext();
    }

    /**
     * Setup location badge in header and prefill delivery details in the drawer.
     */
    function setupLocationContext() {
        const badge = document.getElementById('locationBadge');
        const badgeText = document.getElementById('locationBadgeText');
        const roomInput = document.getElementById('roomNumberInput');
        const locLabel = document.getElementById('locationLabel');
        const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');

        let titlePrefix = '';

        if (state.roomNumber && state.tableNumber) {
            const label = `Room ${state.roomNumber} • Table ${state.tableNumber}`;
            if (badgeText) badgeText.textContent = label;
            if (badge) badge.classList.remove('hidden');
            if (roomInput) roomInput.value = `Room ${state.roomNumber}, Table ${state.tableNumber}`;
            titlePrefix = `${label} | `;
        } else if (state.roomNumber) {
            const label = `Room ${state.roomNumber}`;
            if (badgeText) badgeText.textContent = label;
            if (badge) badge.classList.remove('hidden');
            if (roomInput) roomInput.value = state.roomNumber;
            titlePrefix = `${label} | `;

            // Select Room Service radio
            orderTypeRadios.forEach(r => {
                if (r.value === 'Room Service') r.checked = true;
            });
            if (locLabel) locLabel.innerHTML = `Room Number <span class="text-rose-600">*</span>`;
        } else if (state.tableNumber) {
            const label = `Table ${state.tableNumber}`;
            if (badgeText) badgeText.textContent = label;
            if (badge) badge.classList.remove('hidden');
            if (roomInput) {
                roomInput.value = state.tableNumber;
                roomInput.placeholder = "e.g. Table 5";
            }
            titlePrefix = `${label} | `;

            // Select Dine-in Table radio
            orderTypeRadios.forEach(r => {
                if (r.value === 'Restaurant Table') r.checked = true;
            });
            if (locLabel) locLabel.innerHTML = `Table Number <span class="text-rose-600">*</span>`;
        }

        if (titlePrefix) {
            document.title = `${titlePrefix}${RESTAURANT.name} - Digital Menu & Room Service`;
        }
    }

    /**
     * Render Category Navigation Tabs in sticky bar.
     */
    function renderCategoryNav() {
        const nav = document.getElementById('categoryNav');
        if (!nav || typeof MENU === 'undefined') return;

        nav.innerHTML = MENU.map((cat, idx) => `
            <a href="#cat-${escapeHTML(cat.id)}" 
               id="tab-cat-${escapeHTML(cat.id)}" 
               class="category-tab ${idx === 0 ? 'active-cat' : ''} px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-white/80 hover:bg-white text-maroon border border-gold-500/30 transition-all flex items-center gap-1.5 shadow-sm">
                <span>${escapeHTML(cat.name)}</span>
                <span class="bg-cream-200 text-maroon text-[10px] px-1.5 py-0.2 rounded-full font-bold">${cat.dishes ? cat.dishes.length : 0}</span>
            </a>
        `).join('');

        // Attach click handler for smooth scrolling
        nav.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = tab.getAttribute('href').substring(1);
                const section = document.getElementById(targetId);
                if (section) {
                    state.isManualScroll = true;
                    highlightCategoryTab(targetId.replace('cat-', ''));
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { state.isManualScroll = false; }, 600);
                }
            });
        });
    }

    /**
     * Highlight active category tab and scroll tab pill into view.
     * @param {string} categoryId
     */
    function highlightCategoryTab(categoryId) {
        state.activeCategory = categoryId;
        const tabs = document.querySelectorAll('.category-tab');
        let activeTab = null;

        tabs.forEach(tab => {
            const matches = tab.id === `tab-cat-${categoryId}`;
            tab.classList.toggle('active-cat', matches);
            if (matches) activeTab = tab;
        });

        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    /**
     * Render Menu Categories and Dishes with Stepper Buttons.
     */
    function renderMenu() {
        const container = document.getElementById('menuContainer');
        const emptyState = document.getElementById('emptyState');
        if (!container || typeof MENU === 'undefined') return;

        container.innerHTML = '';
        let totalVisibleDishes = 0;
        const q = state.searchQuery.toLowerCase().trim();

        MENU.forEach(cat => {
            const filteredDishes = (cat.dishes || []).filter(dish => {
                // Dietary filter check
                if (state.currentFilter === 'veg' && !dish.veg) return false;
                if (state.currentFilter === 'non-veg' && dish.veg) return false;
                if (state.currentFilter === 'special' && !dish.special) return false;

                // Search query check
                if (q !== '') {
                    const matchName = (dish.name || '').toLowerCase().includes(q);
                    const matchDesc = (dish.description || '').toLowerCase().includes(q);
                    const matchCat = (cat.name || '').toLowerCase().includes(q);
                    return matchName || matchDesc || matchCat;
                }
                return true;
            });

            if (filteredDishes.length > 0) {
                totalVisibleDishes += filteredDishes.length;

                const catSection = document.createElement('section');
                catSection.id = `cat-${escapeHTML(cat.id)}`;
                catSection.className = 'scroll-mt-section';
                catSection.dataset.categoryId = cat.id;

                catSection.innerHTML = `
                    <div class="flex items-center gap-3 mb-4">
                        <h2 class="font-serif text-xl sm:text-2xl font-bold text-maroon tracking-wide">${escapeHTML(cat.name)}</h2>
                        <div class="h-0.5 flex-1 bg-gradient-to-r from-gold-500/40 to-transparent"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${filteredDishes.map(dish => createDishCardHTML(dish)).join('')}
                    </div>
                `;
                container.appendChild(catSection);
            }
        });

        // Toggle empty state
        if (totalVisibleDishes === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
        } else {
            if (emptyState) emptyState.classList.add('hidden');
        }

        // Attach event delegation for Add / Stepper buttons
        bindDishCardEvents();
    }

    /**
     * Generate HTML for a single dish card.
     * @param {Object} dish
     * @returns {string} HTML string
     */
    function createDishCardHTML(dish) {
        const count = state.cart[dish.id] ? state.cart[dish.id].count : 0;
        const isVeg = Boolean(dish.veg);
        const isSpecial = Boolean(dish.special);

        // Indian FSSAI symbol
        const fssaiSymbol = isVeg
            ? `<span class="w-4 h-4 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5" title="Pure Vegetarian" aria-label="Pure Vegetarian">
                   <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
               </span>`
            : `<span class="w-4 h-4 rounded-sm border border-rose-600 flex items-center justify-center p-0.5" title="Non-Vegetarian" aria-label="Non-Vegetarian">
                   <span class="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-rose-600"></span>
               </span>`;

        // Chef's special badge
        const specialBadge = isSpecial
            ? `<span class="bg-gradient-to-r from-amber-500 to-gold-500 text-maroon-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                   <i class="fa-solid fa-star text-[9px]"></i> Chef's Special
               </span>`
            : '';

        return `
            <div class="bg-white rounded-2xl p-4 border border-gold-500/20 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group" id="card-${escapeHTML(dish.id)}">
                <div>
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                        <div class="flex items-center gap-2">
                            ${fssaiSymbol}
                            <h3 class="font-bold text-gray-900 text-base sm:text-lg tracking-tight group-hover:text-maroon transition-colors">${escapeHTML(dish.name)}</h3>
                        </div>
                        ${specialBadge}
                    </div>
                    <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">${escapeHTML(dish.description)}</p>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                    <div class="text-base font-bold text-maroon font-serif">
                        ₹${Number(dish.price).toLocaleString('en-IN')}
                    </div>

                    <!-- Stepper / Add Button Container -->
                    <div id="btn-container-${escapeHTML(dish.id)}">
                        ${renderStepperHTML(dish.id, count)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Stepper Button HTML generator.
     * @param {string} dishId
     * @param {number} count
     * @returns {string}
     */
    function renderStepperHTML(dishId, count) {
        if (count === 0) {
            return `
                <button type="button" data-action="add" data-id="${escapeHTML(dishId)}" class="bg-cream-100 hover:bg-maroon hover:text-gold-400 text-maroon border border-maroon/30 text-xs font-bold px-4 py-1.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-1.5 min-h-[36px]">
                    <i class="fa-solid fa-plus text-[10px]"></i> ADD
                </button>
            `;
        } else {
            return `
                <div class="flex items-center bg-maroon text-gold-400 rounded-xl overflow-hidden shadow-md text-xs font-bold border border-gold-500/40 min-h-[36px]">
                    <button type="button" data-action="decrement" data-id="${escapeHTML(dishId)}" class="px-3 py-1.5 hover:bg-maroon-900 transition-colors active:scale-90" aria-label="Decrease quantity">
                        <i class="fa-solid fa-minus text-[10px]"></i>
                    </button>
                    <span class="px-2 py-1 text-white min-w-[24px] text-center">${count}</span>
                    <button type="button" data-action="increment" data-id="${escapeHTML(dishId)}" class="px-3 py-1.5 hover:bg-maroon-900 transition-colors active:scale-90" aria-label="Increase quantity">
                        <i class="fa-solid fa-plus text-[10px]"></i>
                    </button>
                </div>
            `;
        }
    }

    /**
     * Bind click events for all Add & Stepper buttons in the dish list.
     */
    function bindDishCardEvents() {
        const container = document.getElementById('menuContainer');
        if (!container) return;

        container.onclick = (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const dishId = btn.dataset.id;

            if (action === 'add') {
                addToCart(dishId);
            } else if (action === 'increment') {
                incrementCart(dishId);
            } else if (action === 'decrement') {
                decrementCart(dishId);
            }
        };
    }

    /**
     * Find dish by ID from MENU.
     * @param {string} id
     * @returns {Object|null}
     */
    function findDishById(id) {
        if (typeof MENU === 'undefined') return null;
        for (const cat of MENU) {
            const found = (cat.dishes || []).find(d => d.id === id);
            if (found) return found;
        }
        return null;
    }

    /**
     * Add dish to cart.
     * @param {string} dishId
     */
    function addToCart(dishId) {
        const dish = findDishById(dishId);
        if (!dish) return;

        if (state.cart[dishId]) {
            state.cart[dishId].count++;
        } else {
            state.cart[dishId] = { dish, count: 1 };
        }

        showToast(`Added ${dish.name} to order`);
        updateCartState();
    }

    /**
     * Increment dish count.
     * @param {string} dishId
     */
    function incrementCart(dishId) {
        if (state.cart[dishId]) {
            state.cart[dishId].count++;
            updateCartState();
        }
    }

    /**
     * Decrement dish count.
     * @param {string} dishId
     */
    function decrementCart(dishId) {
        if (state.cart[dishId]) {
            state.cart[dishId].count--;
            if (state.cart[dishId].count <= 0) {
                delete state.cart[dishId];
            }
            updateCartState();
        }
    }

    /**
     * Update cart state, bottom floating bar, drawer, and dish steppers.
     */
    function updateCartState() {
        // Update dish steppers across menu
        updateDishCardButtons();

        // Calculate totals
        let totalItems = 0;
        let subtotal = 0;

        for (const key in state.cart) {
            totalItems += state.cart[key].count;
            subtotal += state.cart[key].dish.price * state.cart[key].count;
        }

        // Update Bottom Cart Bar
        const cartBadge = document.getElementById('cartBadgeCount');
        const cartBarTotal = document.getElementById('cartBarTotal');
        const cartBar = document.getElementById('cartBar');

        if (cartBadge) cartBadge.textContent = totalItems;
        if (cartBarTotal) cartBarTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

        if (cartBar) {
            if (totalItems > 0) {
                cartBar.classList.remove('translate-y-full');
            } else {
                cartBar.classList.add('translate-y-full');
                closeDrawer();
            }
        }

        // Update Drawer Content
        renderDrawerItems(subtotal);
    }

    /**
     * Update individual stepper buttons in the menu cards.
     */
    function updateDishCardButtons() {
        if (typeof MENU === 'undefined') return;
        for (const cat of MENU) {
            (cat.dishes || []).forEach(dish => {
                const container = document.getElementById(`btn-container-${dish.id}`);
                if (container) {
                    const count = state.cart[dish.id] ? state.cart[dish.id].count : 0;
                    container.innerHTML = renderStepperHTML(dish.id, count);
                }
            });
        }
    }

    /**
     * Render items inside the slide-up cart drawer.
     * @param {number} subtotal
     */
    function renderDrawerItems(subtotal) {
        const list = document.getElementById('cartItemsList');
        const summarySubtotal = document.getElementById('summarySubtotal');
        const summaryTax = document.getElementById('summaryTax');
        const summaryGrandTotal = document.getElementById('summaryGrandTotal');

        if (!list) return;

        list.innerHTML = '';
        const keys = Object.keys(state.cart);

        if (keys.length === 0) {
            list.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Your order cart is empty.</p>`;
        } else {
            keys.forEach(key => {
                const item = state.cart[key];
                const itemTotal = item.dish.price * item.count;
                const vegDot = item.dish.veg
                    ? `<span class="text-emerald-600 text-[10px]">●</span>`
                    : `<span class="text-rose-600 text-[10px]">●</span>`;

                const itemEl = document.createElement('div');
                itemEl.className = 'py-2.5 flex items-center justify-between gap-3 text-xs';
                itemEl.innerHTML = `
                    <div class="flex-1 pr-2">
                        <div class="font-semibold text-gray-800 flex items-center gap-1.5">
                            ${vegDot}
                            <span>${escapeHTML(item.dish.name)}</span>
                        </div>
                        <div class="text-[11px] text-gray-500">₹${Number(item.dish.price).toLocaleString('en-IN')} × ${item.count}</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center bg-cream-200 text-maroon rounded-lg border border-maroon/20 font-bold overflow-hidden">
                            <button type="button" data-drawer-action="dec" data-id="${escapeHTML(item.dish.id)}" class="px-2.5 py-1 hover:bg-cream-300 transition-colors" aria-label="Decrease quantity">-</button>
                            <span class="px-2 py-0.5 text-gray-800 min-w-[20px] text-center">${item.count}</span>
                            <button type="button" data-drawer-action="inc" data-id="${escapeHTML(item.dish.id)}" class="px-2.5 py-1 hover:bg-cream-300 transition-colors" aria-label="Increase quantity">+</button>
                        </div>
                        <div class="font-bold text-maroon w-14 text-right">₹${itemTotal.toLocaleString('en-IN')}</div>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }

        // 5% GST Calculation
        const taxRate = RESTAURANT && RESTAURANT.taxPercent ? RESTAURANT.taxPercent / 100 : 0.05;
        const tax = Math.round(subtotal * taxRate);
        const grandTotal = subtotal + tax;

        if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        if (summaryTax) summaryTax.textContent = `₹${tax.toLocaleString('en-IN')}`;
        if (summaryGrandTotal) summaryGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    }

    /**
     * Open Slide-up Cart Drawer.
     */
    function openDrawer() {
        const drawer = document.getElementById('cartDrawer');
        if (!drawer) return;

        drawer.classList.remove('pointer-events-none', 'opacity-0');
        const content = drawer.querySelector('.drawer-content');
        if (content) content.classList.remove('translate-y-full');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close Slide-up Cart Drawer.
     */
    function closeDrawer() {
        const drawer = document.getElementById('cartDrawer');
        if (!drawer) return;

        const content = drawer.querySelector('.drawer-content');
        if (content) content.classList.add('translate-y-full');
        drawer.classList.add('opacity-0');

        setTimeout(() => {
            drawer.classList.add('pointer-events-none');
            document.body.style.overflow = '';
        }, 300);
    }

    /**
     * Show Toast Notification.
     * @param {string} msg
     */
    function showToast(msg) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        if (!toast || !toastMsg) return;

        toastMsg.textContent = msg;
        toast.classList.remove('-translate-y-16', 'opacity-0', 'pointer-events-none');
        toast.classList.add('translate-y-0', 'opacity-100');

        if (state.toastTimeout) clearTimeout(state.toastTimeout);
        state.toastTimeout = setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('-translate-y-16', 'opacity-0', 'pointer-events-none');
        }, 2200);
    }

    /**
     * Scroll Spy for Category Tabs.
     */
    function initScrollSpy() {
        window.addEventListener('scroll', () => {
            if (state.isManualScroll) return;

            const sections = document.querySelectorAll('.scroll-mt-section');
            const scrollPos = window.scrollY + 160;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.offsetTop <= scrollPos) {
                    const catId = section.dataset.categoryId;
                    if (catId && catId !== state.activeCategory) {
                        highlightCategoryTab(catId);
                    }
                    break;
                }
            }
        }, { passive: true });
    }

    /**
     * Handle WhatsApp Checkout & Message Formatting.
     */
    function handleWhatsAppCheckout() {
        const roomInput = document.getElementById('roomNumberInput');
        const errorMsg = document.getElementById('roomErrorMsg');
        const guestNameInput = document.getElementById('guestNameInput');
        const notesInput = document.getElementById('cookingNotesInput');

        const roomNo = roomInput ? roomInput.value.trim() : '';
        if (!roomNo) {
            if (errorMsg) errorMsg.classList.remove('hidden');
            if (roomInput) roomInput.focus();
            return;
        } else {
            if (errorMsg) errorMsg.classList.add('hidden');
        }

        const guestName = guestNameInput && guestNameInput.value.trim() ? guestNameInput.value.trim() : 'Guest';
        const selectedOrderTypeEl = document.querySelector('input[name="orderType"]:checked');
        const orderType = selectedOrderTypeEl ? selectedOrderTypeEl.value : 'Room Service';
        const notes = notesInput ? notesInput.value.trim() : '';

        // Validate items in cart
        const keys = Object.keys(state.cart);
        if (keys.length === 0) {
            showToast('Your cart is empty');
            return;
        }

        let subtotal = 0;
        let itemLines = [];

        keys.forEach(key => {
            const item = state.cart[key];
            const cost = item.dish.price * item.count;
            subtotal += cost;
            const vegSymbol = item.dish.veg ? '🟢' : '🔴';
            itemLines.push(`${vegSymbol} *${item.count}x* ${item.dish.name} - ₹${cost}`);
        });

        const taxRate = RESTAURANT && RESTAURANT.taxPercent ? RESTAURANT.taxPercent / 100 : 0.05;
        const tax = Math.round(subtotal * taxRate);
        const grandTotal = subtotal + tax;

        // Build itemized WhatsApp template
        let message = `*NEW ${orderType.toUpperCase()} ORDER*\n`;
        message += `🏨 *${RESTAURANT.name}*\n`;
        message += `--------------------------------\n`;
        message += `📍 *Service:* ${orderType}\n`;
        message += `🚪 *${orderType === 'Room Service' ? 'Room No' : 'Table No'}:* ${roomNo}\n`;
        message += `👤 *Guest Name:* ${guestName}\n`;
        message += `--------------------------------\n`;
        message += `*ORDER ITEMS:*\n`;
        message += itemLines.join('\n') + `\n`;
        message += `--------------------------------\n`;
        message += `*Subtotal:* ₹${subtotal}\n`;
        message += `*GST (5%):* ₹${tax}\n`;
        message += `💰 *Grand Total:* *₹${grandTotal}*\n`;
        message += `--------------------------------\n`;

        if (notes) {
            message += `📝 *Cooking Notes:* ${notes}\n`;
            message += `--------------------------------\n`;
        }

        message += `Please confirm order receipt and estimated delivery time. Thank you!`;

        const waNumber = (RESTAURANT.whatsapp || '').replace(/[^0-9]/g, '');
        const encodedText = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

        window.open(whatsappUrl, '_blank');
    }

    /**
     * Setup DOM Event Listeners.
     */
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                if (clearSearchBtn) {
                    clearSearchBtn.classList.toggle('hidden', state.searchQuery.length === 0);
                }
                renderMenu();
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                state.searchQuery = '';
                clearSearchBtn.classList.add('hidden');
                renderMenu();
            });
        }

        // Dietary Filter Buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-maroon', 'text-gold-400', 'border-gold-500/50');
                    b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
                });

                btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
                btn.classList.add('bg-maroon', 'text-gold-400', 'border-gold-500/50');

                state.currentFilter = btn.dataset.filter;
                renderMenu();
            });
        });

        // Reset Filter Buttons
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                state.searchQuery = '';
                state.currentFilter = 'all';
                if (searchInput) searchInput.value = '';
                if (clearSearchBtn) clearSearchBtn.classList.add('hidden');

                filterBtns.forEach(b => {
                    b.classList.remove('bg-maroon', 'text-gold-400', 'border-gold-500/50');
                    b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
                });
                const allBtn = document.querySelector('[data-filter="all"]');
                if (allBtn) {
                    allBtn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
                    allBtn.classList.add('bg-maroon', 'text-gold-400', 'border-gold-500/50');
                }
                renderMenu();
            });
        }

        // Order Type Radios Toggle (Room Service vs Restaurant Table)
        document.querySelectorAll('input[name="orderType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const locLabel = document.getElementById('locationLabel');
                const roomInput = document.getElementById('roomNumberInput');
                if (!locLabel || !roomInput) return;

                if (e.target.value === 'Room Service') {
                    locLabel.innerHTML = `Room Number <span class="text-rose-600">*</span>`;
                    roomInput.placeholder = "e.g. 204";
                } else {
                    locLabel.innerHTML = `Table Number <span class="text-rose-600">*</span>`;
                    roomInput.placeholder = "e.g. Table 5";
                }
            });
        });

        // Drawer Controls
        const openCartBtn = document.getElementById('openCartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const cartItemsList = document.getElementById('cartItemsList');

        if (openCartBtn) openCartBtn.addEventListener('click', openDrawer);
        if (closeCartBtn) closeCartBtn.addEventListener('click', closeDrawer);
        if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

        // Steppers inside Drawer delegation
        if (cartItemsList) {
            cartItemsList.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-drawer-action]');
                if (!btn) return;

                const action = btn.dataset.drawerAction;
                const dishId = btn.dataset.id;

                if (action === 'inc') {
                    incrementCart(dishId);
                } else if (action === 'dec') {
                    decrementCart(dishId);
                }
            });
        }

        // WhatsApp Checkout
        const sendWhatsAppBtn = document.getElementById('sendWhatsAppOrderBtn');
        if (sendWhatsAppBtn) {
            sendWhatsAppBtn.addEventListener('click', handleWhatsAppCheckout);
        }
    }

    /**
     * Application Initialization
     */
    function init() {
        parseLocationParams();
        renderHotelInfo();
        renderCategoryNav();
        renderMenu();
        setupEventListeners();
        initScrollSpy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
