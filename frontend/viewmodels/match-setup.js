// Gender button toggle
    const genderBtns = document.querySelectorAll('.gender-btn');
        let selectedGender = 'female';
        genderBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                genderBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedGender = this.getAttribute('data-value');
            });
        });
        // Default select Female
        document.querySelector('.gender-btn[data-value="female"]').classList.add('active');

        // Age slider
        const ageRange = document.getElementById('ageRange');
        const ageValue = document.getElementById('ageValue');
        ageRange.addEventListener('input', function() {
            if (this.value >= 50) {
                ageValue.textContent = '50+ Age';
            } else {
                ageValue.textContent = this.value + ' Age';
            }
        });
        // Form submit
        const form = document.getElementById('matchForm');
        const message = document.getElementById('formMessage');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            message.textContent = '';
            const btn = form.querySelector('.submit-btn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            setTimeout(() => {
                if (!selectedGender || !ageRange.value) {
                    message.textContent = 'Please select gender and age!';
                    message.style.color = '#e75480';
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa fa-arrow-right"></i>';
                } else {
                    message.textContent = 'Match preferences saved!';
                    message.style.color = '#2196f3';
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa fa-arrow-right"></i>';
                }
            }, 1000);
        });
