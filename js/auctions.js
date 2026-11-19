// Seed auctions de demonstração
(function seedAuctions() {
    if (DB.get('auctions').length === 0) {
        const demo = [
            { id: 'a1', title: 'Portátil Dell XPS', description: 'i7, 16GB RAM, SSD 512GB', startPrice: 80000, currentPrice: 80000, endTime: Date.now() + 86400000, seller: 'Loja Tech', bids: [], image: '💻' },
            { id: 'a2', title: 'iPhone 14 Pro', description: '128GB, estado como novo', startPrice: 50000, currentPrice: 55000, endTime: Date.now() + 172800000, seller: 'Mobile Store', bids: [{ user: 'João', value: 55000 }], image: '📱' },
            { id: 'a3', title: 'Bicicleta BTT', description: 'Quadro alumínio, 21 velocidades', startPrice: 30000, currentPrice: 30000, endTime: Date.now() + 43200000, seller: 'BikeShop', bids: [], image: '🚴' },
            { id: 'a4', title: 'Relógio Rolex', description: 'Modelo clássico autêntico', startPrice: 250000, currentPrice: 260000, endTime: Date.now() + 259200000, seller: 'LuxTime', bids: [{ user: 'Maria', value: 260000 }], image: '⌚' }
        ];
        DB.set('auctions', demo);
    }
})();

function formatAOA(v) {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(v);
}

function timeLeft(endTime) {
    const diff = endTime - Date.now();
    if (diff <= 0) return 'Encerrado';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
}

function renderAuctions(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const auctions = DB.get('auctions');
    const user = currentUser();

    container.innerHTML = auctions.map(a => `
        <div class="auction-card">
            <div class="card-image">${a.image || '📦'}</div>
            <div class="card-body">
                <h3>${a.title}</h3>
                <p style="color:#666;font-size:0.9rem;">${a.description}</p>
                <div class="price">${formatAOA(a.currentPrice)}</div>
                <div class="timer">⏱️ ${timeLeft(a.endTime)}</div>
                <p style="font-size:0.85rem;color:#888;margin-bottom:0.8rem;">
                    Vendedor: ${a.seller} | ${a.bids.length} licitações
                </p>
                ${user && user.role === 'customer' && user.status === 'approved'
                    ? `<button class="btn btn-primary" onclick="placeBid('${a.id}')">Licitar</button>`
                    : `<button class="btn btn-secondary" disabled>Requer verificação</button>`}
            </div>
        </div>
    `).join('');
}

function placeBid(id) {
    const user = currentUser();
    if (!user) { window.location.href = 'login.html'; return; }
    if (user.status !== 'approved') return showAlert('Perfil não verificado pelo admin.', 'error');

    const auctions = DB.get('auctions');
    const a = auctions.find(x => x.id === id);
    if (!a || a.endTime < Date.now()) return showAlert('Leilão encerrado.', 'error');

    const input = prompt(`Valor da licitação (atual: ${formatAOA(a.currentPrice)}):`);
    if (!input) return;
    const value = Number(input);
    if (isNaN(value) || value <= a.currentPrice) {
        return showAlert('Licitação deve ser superior ao valor atual.', 'error');
    }

    a.currentPrice = value;
    a.bids.push({ user: user.name, value, date: Date.now() });
    DB.set('auctions', auctions);
    showAlert('Licitação registada com sucesso!', 'success');
    renderAuctions('auctionList');
}

function updateDashboardStats() {
    const user = currentUser();
    if (!user || !document.getElementById('userName')) return;
    document.getElementById('userName').textContent = user.name;

    const auctions = DB.get('auctions');
    document.getElementById('totalAuctions').textContent = auctions.length;
    document.getElementById('myBids').textContent =
        auctions.reduce((c, a) => c + a.bids.filter(b => b.user === user.name).length, 0);
    const complaints = DB.get('complaints').filter(c => c.buyer === user.name);
    document.getElementById('myComplaints').textContent = complaints.length;
}

document.addEventListener('DOMContentLoaded', () => {
    const user = currentUser();
    if (document.getElementById('userName') && !user) {
        window.location.href = 'login.html';
        return;
    }
    renderAuctions('auctionList');
    updateDashboardStats();
});