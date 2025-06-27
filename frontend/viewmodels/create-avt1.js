const form = document.getElementById('profileForm');
        const message = document.getElementById('formMessage');
        const avatarInput = document.getElementById('avatarInput');
        const avatarImg = document.querySelector('.avatar-upload img');
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    avatarImg.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
