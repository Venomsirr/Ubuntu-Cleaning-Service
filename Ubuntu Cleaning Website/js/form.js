// Ubuntu Cleaning Service - Contact Form Handling

document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return;
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize form submission
    initFormSubmission();
});

// Form Validation
function initFormValidation() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear error on focus
        input.addEventListener('focus', function() {
            clearError(this);
        });
        
        // Real-time phone formatting
        if (input.type === 'tel') {
            input.addEventListener('input', function(e) {
                formatPhoneNumber(this);
            });
        }
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm(form);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.closest('.form-group').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    } else if (value) {
        // Specific validations based on field type
        switch (field.type) {
            case 'email':
                if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'tel':
                if (!isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
        }
        
        // Select validation
        if (field.tagName === 'SELECT' && value === '') {
            errorMessage = 'Please select a service';
            isValid = false;
        }
    }
    
    // Update error message
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = errorMessage ? 'block' : 'none';
    }
    
    // Update field styling
    if (!isValid) {
        field.classList.add('error');
        field.classList.remove('valid');
    } else if (value) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('error', 'valid');
    }
    
    return isValid;
}

// Clear Error
function clearError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.classList.remove('error');
}

// Email Validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone Validation (South African)
function isValidPhone(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Check if it starts with 0 or 27 (South Africa)
    if (digits.startsWith('0')) {
        // Cell: 10 digits total, Landline: 9-10 digits
        return digits.length >= 9 && digits.length <= 10;
    } else if (digits.startsWith('27')) {
        // Cell: 11 digits total, Landline: 10-11 digits
        return digits.length >= 10 && digits.length <= 11;
    }
    
    return false;
}

// Phone Number Formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
    // Format as 079 025 6695
        if (value.startsWith('0')) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = `${value.slice(0, 3)} ${value.slice(3)}`;
            } else {
                value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
            }
        } else if (value.startsWith('27')) {
            if (value.length <= 2) {
                value = value;
            } else if (value.length <= 5) {
                value = `${value.slice(0, 2)} ${value.slice(2)}`;
            } else if (value.length <= 8) {
                value = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
            } else {
                value = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8, 11)}`;
            }
        }
    }
    
    input.value = value;
}

// Form Submission
function initFormSubmission() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    // Store form data for persistence
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            localStorage.setItem(`ubuntu_form_${this.id}`, this.value);
        });
        
        // Load saved data
        const savedValue = localStorage.getItem(`ubuntu_form_${field.id}`);
        if (savedValue) {
            field.value = savedValue;
        }
    });
}

// Submit Form Data
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show temporary state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening email...';
    submitBtn.disabled = true;

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Build mailto link so the customer uses their own email client to send the request
    const to = 'floridamarket66@gmail.com';
    const subject = encodeURIComponent(`Quote Request from ${data.name || data.email || 'Website'}`);
    const bodyLines = [
        `Name: ${data.name || ''}`,
        `Phone: ${data.phone || ''}`,
        `Email: ${data.email || ''}`,
        `Service Needed: ${data.service || ''}`,
        `Message: ${data.message || ''}`
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

    // Open user's mail client
    window.location.href = mailto;

    // Show success locally and clear saved data (in case mail client does not close the page)
    setTimeout(() => {
        showSuccessMessage();
        form.reset();

        // Clear local storage
        form.querySelectorAll('input, select, textarea').forEach(field => {
            localStorage.removeItem(`ubuntu_form_${field.id}`);
        });

        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Redirect to thank you page after a short delay
        setTimeout(() => {
            window.location.href = 'thankyou.html';
        }, 1500);
    }, 700);
}

// Show Success Message
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    const form = document.getElementById('quoteForm');
    
    if (successMessage && form) {
        // Hide form
        form.style.display = 'none';
        
        // Show success message
        successMessage.style.display = 'block';
        
        // Add animation
        successMessage.classList.add('fade-in');
    }
}

// Reset Form (for success message)
window.resetForm = function() {
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('success-message');
    
    if (form && successMessage) {
        // Show form
        form.style.display = 'grid';
        
        // Hide success message
        successMessage.style.display = 'none';
        
        // Reset form fields
        form.reset();
        
        // Clear errors
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Clear field styling
        form.querySelectorAll('.error, .valid').forEach(field => {
            field.classList.remove('error', 'valid');
        });
    }
};

// Initialize on window load
window.addEventListener('load', function() {
    // Add character counter for textarea
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = messageField.value.length;
            counter.textContent = `${length}/500 characters`;
            
            if (length > 500) {
                counter.style.color = '#FF6B35';
            } else {
                counter.style.color = '#666';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
    
    // Add input masking for phone
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('keydown', function(e) {
            // Allow: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
                // Allow: Ctrl+A
                (e.keyCode === 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
});

// Service Type Suggestions
function initServiceSuggestions() {
    const serviceSelect = document.getElementById('service');
    if (!serviceSelect) return;
    
    // Add popular services as options if they don't exist
    const popularServices = [
        'Window Cleaning',
        'Carpet Cleaning',
        'Upholstery Cleaning',
        'Spring Cleaning',
        'Post-Construction Cleaning'
    ];
    
    popularServices.forEach(service => {
        let exists = false;
        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === service) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceSelect.appendChild(option);
        }
    });
}

// Initialize service suggestions
initServiceSuggestions();