// ===== Storage helpers =====
const DB = {
    get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Seed admin if not exists
(function seedAdmin() {
    const users = DB.get('users');
    if (!users.find(u => u.role === 'admin')) {
        users.push({
            id: 'admin-1',
            name: 'Administrador',
            email: 'admin@auction.com',
            password: 'admin123',
            role: 'admin',
            status: 'approved'
        });
        DB.set('users', users);
    }
})();

function showAlert(msg, type = 'success') {
    const el = document.getElementById('alert');
    if (!el) return alert(msg);
    el.className = `alert alert-${type} show`;
    el.textContent = msg;
    setTimeout(() => el.classList.remove('show'), 4000);
}

function currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===== Registo =====
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const license = document.getElementById('license').value.trim();
        const pan = document.getElementById('pan').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        const users = DB.get('users');
        if (users.find(u => u.email === email)) {
            return showAlert('Este email já está registado.', 'error');
        }

        const newUser = {
            id: 'u-' + Date.now(),
            name, email, license, pan, password, role,
            status: 'pending' // precisa aprovação do admin
        };
        users.push(newUser);
        DB.set('users', users);

        showAlert('Registo efetuado! Aguarde aprovação do administrador.', 'success');
        registerForm.reset();
        setTimeout(() => window.location.href = 'login.html', 2000);
    });
}

// ===== Login =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        const users = DB.get('users');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) return showAlert('Credenciais inválidas.', 'error');
        if (user.status === 'blocked') return showAlert('Conta bloqueada por fraude.', 'error');
        if (user.status === 'pending') return showAlert('Conta aguarda aprovação do admin.', 'error');

        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('Login com sucesso!', 'success');

        setTimeout(() => {
            if (user.role === 'admin') window.location.href = 'admin.html';
            else if (user.role === 'seller') window.location.href = 'seller.html';
            else window.location.href = 'dashboard.html';
        }, 800);
    });
}