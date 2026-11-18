const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
    const user = currentUser();
    if (!user) window.location.href = 'login.html';

    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const complaints = DB.get('complaints');
        complaints.push({
            id: 'c-' + Date.now(),
            buyer: user.name,
            seller: document.getElementById('seller').value.trim(),
            product: document.getElementById('product').value.trim(),
            reason: document.getElementById('reason').value.trim(),
            date: Date.now()
        });
        DB.set('complaints', complaints);
        showAlert('Reclamação enviada ao administrador.', 'success');
        complaintForm.reset();
    });
}