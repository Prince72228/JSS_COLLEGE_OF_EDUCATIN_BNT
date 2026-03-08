// ===== ADMIN UTILITIES =====

// ===== AUTHENTICATION CHECK =====
function checkAuth() {
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ===== DATA STORAGE FUNCTIONS =====
function getMembers() {
    return JSON.parse(localStorage.getItem('members')) || [];
}

function setMembers(members) {
    localStorage.setItem('members', JSON.stringify(members));
}

function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

function setExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function getCollectionAmount() {
    return parseFloat(localStorage.getItem('collectionAmount')) || 0;
}

function setCollectionAmount(amount) {
    localStorage.setItem('collectionAmount', amount.toString());
}

// ===== DATA ANALYSIS =====
function analyzeData() {
    const members = getMembers();
    const expenses = getExpenses();
    const collectionAmount = getCollectionAmount();
    
    const paidMembers = members.filter(m => m.status === 'YES').length;
    const unpaidMembers = members.filter(m => m.status === 'NO').length;
    const totalCollected = paidMembers * collectionAmount;
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const balance = totalCollected - totalExpenses;
    
    return {
        totalMembers: members.length,
        paidMembers,
        unpaidMembers,
        totalCollected,
        totalExpenses,
        balance,
        collectionAmount
    };
}

// ===== NOTIFICATION FUNCTIONS =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 px-6 py-4 rounded-xl shadow-lg z-50 transform transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    gsap.from(notification, {
        x: 100,
        opacity: 0,
        duration: 0.3
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            onComplete: () => notification.remove()
        });
    }, 3000);
}

function showConfirm(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// ===== VALIDATION FUNCTIONS =====
function validateMemberName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Member name cannot be empty' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Member name must be at least 2 characters' };
    }
    return { valid: true };
}

function validateAmount(amount) {
    if (isNaN(amount)) {
        return { valid: false, message: 'Amount must be a number' };
    }
    if (amount <= 0) {
        return { valid: false, message: 'Amount must be greater than 0' };
    }
    return { valid: true };
}

function validateExpense(reason, amount) {
    const nameResult = validateMemberName(reason);
    if (!nameResult.valid) {
        return nameResult;
    }
    return validateAmount(amount);
}

// ===== ANIMATION FUNCTIONS =====
function animateSuccess(element) {
    gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        backgroundColor: 'rgb(34, 197, 94)',
        ease: 'power2.out'
    });
}

function animateError(element) {
    gsap.to(element, {
        x: [-5, 5, -5, 5, 0],
        duration: 0.4,
        backgroundColor: 'rgb(239, 68, 68)'
    });
    
    setTimeout(() => {
        gsap.to(element, {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            duration: 0.3
        });
    }, 400);
}

function animateTableRow(row) {
    gsap.from(row, {
        x: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
}

function animateStatCard(card) {
    gsap.from(card, {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        delay: Math.random() * 0.2,
        ease: 'back.out(1.7)'
    });
}

function animateModal(modal) {
    gsap.from(modal.querySelector('.glass-card'), {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: 'back.out(1.7)'
    });
}

// ===== FORMATTING FUNCTIONS =====
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function formatPercent(value, total) {
    return ((value / total) * 100).toFixed(2) + '%';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ===== TABLE MANAGEMENT =====
function sortTable(tableBody, column, ascending = true) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue = a.querySelector(`td:nth-child(${column})`).textContent;
        let bValue = b.querySelector(`td:nth-child(${column})`).textContent;
        
        // Remove currency symbol and commas for numeric comparison
        if (aValue.includes('₹')) {
            aValue = parseInt(aValue.replace(/[₹,]/g, ''));
            bValue = parseInt(bValue.replace(/[₹,]/g, ''));
        }
        
        if (ascending) {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    rows.forEach(row => tableBody.appendChild(row));
}

// ===== SEARCH FUNCTIONALITY =====
function searchMembers(query) {
    const members = getMembers();
    const lowerQuery = query.toLowerCase();
    
    return members.filter(member => 
        member.name.toLowerCase().includes(lowerQuery) ||
        member.id.toString().includes(lowerQuery)
    );
}

function searchExpenses(query) {
    const expenses = getExpenses();
    const lowerQuery = query.toLowerCase();
    
    return expenses.filter(expense => 
        expense.reason.toLowerCase().includes(lowerQuery) ||
        expense.date.includes(lowerQuery) ||
        expense.amount.toString().includes(lowerQuery)
    );
}

// ===== EXPORT FUNCTIONS =====
function exportMembersToCSV() {
    const members = getMembers();
    const csv = 'ID,Name,Status,Amount\n' +
        members.map(m => `${m.id},"${m.name}",${m.status},${m.amount}`).join('\n');
    
    downloadCSV(csv, 'members.csv');
}

function exportExpensesToCSV() {
    const expenses = getExpenses();
    const csv = 'Date,Reason,Amount\n' +
        expenses.map(e => `${e.date},"${e.reason}",${e.amount}`).join('\n');
    
    downloadCSV(csv, 'expenses.csv');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ===== BACKUP & RESTORE =====
function createBackup() {
    const backup = {
        members: getMembers(),
        expenses: getExpenses(),
        collectionAmount: getCollectionAmount(),
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function restoreBackup(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const backup = JSON.parse(event.target.result);
            
            if (backup.members && backup.expenses) {
                setMembers(backup.members);
                setExpenses(backup.expenses);
                if (backup.collectionAmount) {
                    setCollectionAmount(backup.collectionAmount);
                }
                
                showNotification('Backup restored successfully!', 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                throw new Error('Invalid backup format');
            }
        } catch (error) {
            showNotification('Failed to restore backup. Invalid file format.', 'error');
        }
    };
    reader.readAsText(file);
}

// ===== BULK OPERATIONS =====
function bulkUpdateStatus(memberIds, newStatus) {
    const members = getMembers();
    const collectionAmount = getCollectionAmount();
    
    memberIds.forEach(id => {
        const member = members.find(m => m.id === id);
        if (member) {
            member.status = newStatus;
            member.amount = newStatus === 'YES' ? collectionAmount : 0;
        }
    });
    
    setMembers(members);
    showNotification(`${memberIds.length} members updated successfully!`, 'success');
}

function bulkDeleteExpenses(indices) {
    let expenses = getExpenses();
    
    // Sort indices in descending order to avoid shifting issues
    indices.sort((a, b) => b - a);
    
    indices.forEach(index => {
        if (index >= 0 && index < expenses.length) {
            expenses.splice(index, 1);
        }
    });
    
    setExpenses(expenses);
    showNotification(`${indices.length} expenses deleted successfully!`, 'success');
}

// ===== STATISTICS CALCULATIONS =====
function calculatePaymentTrend() {
    const expenses = getExpenses();
    const monthlyData = {};
    
    expenses.forEach(expense => {
        const month = expense.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        monthlyData[month] += expense.amount;
    });
    
    return monthlyData;
}

function calculateTopExpenses(count = 5) {
    const expenses = getExpenses();
    
    return [...expenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, count);
}

// ===== REAL-TIME UPDATES =====
function setupRealtimeUpdates(callback) {
    let lastMembersHash = JSON.stringify(getMembers());
    let lastExpensesHash = JSON.stringify(getExpenses());
    
    setInterval(() => {
        const currentMembersHash = JSON.stringify(getMembers());
        const currentExpensesHash = JSON.stringify(getExpenses());
        
        if (currentMembersHash !== lastMembersHash || 
            currentExpensesHash !== lastExpensesHash) {
            
            lastMembersHash = currentMembersHash;
            lastExpensesHash = currentExpensesHash;
            
            if (callback) callback();
        }
    }, 2000);
}

// ===== EXPOSE TO GLOBAL =====
window.checkAuth = checkAuth;
window.showNotification = showNotification;
window.showConfirm = showConfirm;
window.validateMemberName = validateMemberName;
window.validateAmount = validateAmount;
window.validateExpense = validateExpense;
window.animateSuccess = animateSuccess;
window.animateError = animateError;
window.formatCurrency = formatCurrency;
window.formatPercent = formatPercent;
window.formatDate = formatDate;
window.createBackup = createBackup;
window.restoreBackup = restoreBackup;
window.calculatePaymentTrend = calculatePaymentTrend;
window.calculateTopExpenses = calculateTopExpenses;
window.setupRealtimeUpdates = setupRealtimeUpdates;