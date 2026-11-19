function renderSellerProducts() {
    const user = currentUser();
    const table = document.getElementById('productTable');
    if (!table || !user) return;

    const auctions = DB.get('auctions').filter(a => a.seller === user.name);

    if (auctions.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">Nenhum produto.</td></tr>';
        return;
    }

    table.innerHTML = auctions.map(a => `
        <tr>
            <td>${a.title}</td>
            <td>${formatAOA(a.currentPrice)}</td>
            <td>${a.endTime > Date.now()
                ? '<span class="badge badge-approved">Ativo</span>'
                : '<span class="badge badge-blocked">Encerrado</span>'}</td>
            <td>
                <button class="btn btn-secondary" style="padding:0.4rem 0.8rem;font-size:0.85rem;"
                    onclick="editProduct('${a.id}')">Editar</button>
                <button class="btn btn-danger" style="padding:0.4rem 0.8rem;font-size:0.85rem;"
                    onclick="deleteProduct('${a.id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    const auctions = DB.get('auctions');
    const a = auctions.find(x => x.id === id);
    if (!a) return;
    const newPrice = prompt('Novo preço inicial:', a.startPrice);
    if (newPrice === null) return;
    const newTitle = prompt('Novo título:', a.title);
    if (newTitle === null) return;
    a.startPrice = Number(newPrice) || a.startPrice;
    a.currentPrice = Math.max(a.currentPrice, a.startPrice);
    a.title = newTitle || a.title;
    DB.set('auctions', auctions);
    showAlert('Produto atualizado.', 'success');
    renderSellerProducts();
}

function deleteProduct(id) {
    if (!confirm('Eliminar este produto?')) return;
    const auctions = DB.get('auctions').filter(a => a.id !== id);
    DB.set('auctions', auctions);
    showAlert('Produto eliminado.', 'success');
    renderSellerProducts();
}

const productForm = document.getElementById('productForm');
if (productForm) {
    const user = currentUser();
    if (!user || user.role !== 'seller') {
        window.location.href = 'login.html';
    } else if (user.status !== 'approved') {
        document.getElementById('alert').className = 'alert alert-error show';
        document.getElementById('alert').textContent = 'Aguarde aprovação do administrador.';
        productForm.style.display = 'none';
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const auctions = DB.get('auctions');
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const startPrice = Number(document.getElementById('startPrice').value);
        const duration = Number(document.getElementById('duration').value);

        auctions.push({
            id: 'a-' + Date.now(),
            title, description, startPrice, currentPrice: startPrice,
            endTime: Date.now() + duration * 3600000,
            seller: user.name, bids: [], image: '📦'
        });
        DB.set('auctions', auctions);
        showAlert('Produto adicionado!', 'success');
        productForm.reset();
        renderSellerProducts();
    });

    renderSellerProducts();
}