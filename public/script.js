(function() {
    const BASE_URL = '/api';
    const APIKEY = 'hanz';

    const emailSend = document.getElementById('emailSend');
    const sendBtn = document.getElementById('sendBtn');
    const sendResponse = document.getElementById('sendResponse');

    const emailVerify = document.getElementById('emailVerify');
    const linkVerify = document.getElementById('linkVerify');
    const passwordInput = document.getElementById('passwordInput');
    const verifyBtn = document.getElementById('verifyBtn');
    const verifyResponse = document.getElementById('verifyResponse');

    const statusIndicator = document.getElementById('statusIndicator');

    function showResponse(element, message, type = 'info') {
        element.style.display = 'block';
        element.textContent = message;
        element.className = 'response-box';
        if (type === 'error') {
            element.classList.add('error');
        } else if (type === 'success') {
            element.classList.add('success');
        }
    }

    function clearResponse(element) {
        element.style.display = 'none';
        element.textContent = '';
        element.className = 'response-box';
    }

    function setLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<span class="loader"></span> Memproses...';
            statusIndicator.textContent = 'Loading...';
            statusIndicator.style.color = '#009900';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.textContent;
            statusIndicator.textContent = '';
            statusIndicator.style.color = '#000000';
        }
    }

    sendBtn.dataset.originalText = sendBtn.innerHTML;
    verifyBtn.dataset.originalText = verifyBtn.innerHTML;

    sendBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = emailSend.value.trim();
        if (!email) {
            showResponse(sendResponse, 'Harap masukkan email.', 'error');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showResponse(sendResponse, 'Format email tidak valid.', 'error');
            return;
        }

        clearResponse(sendResponse);
        setLoading(sendBtn, true);

        try {
            const url = `${BASE_URL}/send?email=${encodeURIComponent(email)}&apikey=${APIKEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok && data.status === true) {
                showResponse(sendResponse, 
                    `${data.message || 'Link verifikasi terkirim.'}\nEmail: ${data.data?.email || email}`,
                    'success'
                );
            } else {
                const errMsg = data.message || data.error || 'Gagal mengirim link.';
                showResponse(sendResponse, `${errMsg}`, 'error');
            }
        } catch (error) {
            showResponse(sendResponse, `Error jaringan: ${error.message}`, 'error');
        } finally {
            setLoading(sendBtn, false);
        }
    });

    verifyBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = emailVerify.value.trim();
        const link = linkVerify.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            showResponse(verifyResponse, 'Harap masukkan email.', 'error');
            return;
        }
        if (!link) {
            showResponse(verifyResponse, 'Harap masukkan link verifikasi.', 'error');
            return;
        }
        if (!password) {
            showResponse(verifyResponse, 'Harap masukkan password.', 'error');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showResponse(verifyResponse, 'Format email tidak valid.', 'error');
            return;
        }

        if (password !== 'buat_akun_amprem_byhanzcode') {
            showResponse(verifyResponse, 'Password salah!', 'error');
            return;
        }

        clearResponse(verifyResponse);
        setLoading(verifyBtn, true);

        try {
            const url = `${BASE_URL}/verify?email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}&apikey=${APIKEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok && data.status === true) {
                let msg = `${data.message || 'Verifikasi berhasil.'}`;
                if (data.data) {
                    msg += `\nEmail: ${data.data.email || '-'}`;
                    msg += `\nTipe: ${data.data.type || '-'}`;
                    msg += `\nDurasi: ${data.data.duration || '-'}`;
                }
                showResponse(verifyResponse, msg, 'success');
            } else {
                if (response.status === 500) {
                    showResponse(verifyResponse, `Server mengalami kesalahan (500). Pastikan link & email benar.\nPesan: ${data.message || 'Internal Server Error'}`, 'error');
                } else {
                    const errMsg = data.message || data.error || 'Verifikasi gagal.';
                    showResponse(verifyResponse, `${errMsg}`, 'error');
                }
            }
        } catch (error) {
            showResponse(verifyResponse, `Error jaringan: ${error.message}`, 'error');
        } finally {
            setLoading(verifyBtn, false);
        }
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = {
        generate: document.getElementById('page-generate'),
        informasi: document.getElementById('page-informasi'),
        developer: document.getElementById('page-developer')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            Object.keys(pages).forEach(key => {
                pages[key].classList.remove('active');
            });
            pages[page].classList.add('active');
        });
    });
})();