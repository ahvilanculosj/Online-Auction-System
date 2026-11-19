const adminUser = currentUser();
if (!adminUser || adminUser.role !== 'admin') {
    window.location.href = 'login.html';
}

function renderAdminUsers() {
    const users = DB.get('users').filter(u => u.role !== 'admin');
    const table = document.getElementById('userTable');

    table.innerHTML = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role === 'seller' ? 'Vendedor' : 'Comprador'}</td>
            <td>${statusBadge(u.status)}</td>
            <td>
                ${u.status === 'pending'
                    ? `<button class="btn btn-success" style="padding:0.4rem 0.8rem;font-size:0.85rem;"
                        onclick="approveUser('${u.id}')">Aprovar</button>`
                    : ''}
                ${u.status !== 'blocked'
                    ? `<button class="btn btn-danger" style="padding:0.4rem 0.8rem;font-size:0.85rem;"
                        onclick="blockUser('${u.id}')">Bloquear</button>`
                    : ''}
                ${u.role === 'seller'
                    ? `<button class="btn btn-danger" style="padding:0.4rem 0.8rem;font-size:0.85rem;"
                        onclick="deleteSeller('${u.id}')">Remover Vendedor</button>`
                    : ''}
            </td>
        </tr>
    `).join('');
}

function statusBadge(s) {
    if (s === 'pending') return '<span class="badge badge-pending">Pendente</span>';
    if (s === 'approved') return '<span class="badge badge-approved">Aprovado</span>';
    return '<span class="badge badge-blocked">Bloqueado</span>';
}

function approveUser(id) {
    const users = DB.get('users');
    const u = users.find(x => x.id === id);
    if (u) { u.status = 'approved'; DB.set('users', users); }
    showAlert('Utilizador aprovado.', 'success');
    renderAdminUsers();
    updateAdminStats();
}

function blockUser(id) {
    if (!confirm('Bloquear permanentemente este utilizador por fraude?')) return;
    const users = DB.get('users');
    const u = users.find(x => x.id === id);
    if (u) { u.status = 'blocked'; DB.set('users', users); }
    showAlert('Utilizador bloqueado.', 'success');
    renderAdminUsers();
    updateAdminStats();
}

function deleteSeller(id) {
    if (!confirm('Remover vendedor e todos os seus produtos?')) return;
    const users = DB.get('users');
    const seller = users.find(x => x.id === id);
    if (!seller) return;

    DB.set('users', users.filter(x => x.id !== id));
    DB.set('auctions', DB.get('auctions').filter(a => a.seller !== seller.name));
    showAlert('Vendedor e produtos removidos.', 'success');
    renderAdminUsers();
    updateAdminStats();
}

function renderComplaints() {
    const complaints = DB.get('complaints');
    const table = document.getElementById('complaintTable');
    if (complaints.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">Sem reclamações.</td></tr>';
        return;
    }
    table.innerHTML = complaints.map(c => `
        <tr>
            <td>${c.buyer}</td>
            <td>${c.seller}</td>
            <td>${c.reason}</td>
            <td>${new Date(c.date).toLocaleDateString('pt-PT')}</td>
        </tr>
    `).join('');
}

function updateAdminStats() {
    const users = DB.get('users');
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('pendingUsers').textContent = users.filter(u => u.status === 'pending').length;
    document.getElementById('blockedUsers').textContent = users.filter(u => u.status === 'blocked').length;
    document.getElementById('totalComplaints').textContent = DB.get('complaints').length;
}

renderAdminUsers();
renderComplaints();
updateAdminStats();