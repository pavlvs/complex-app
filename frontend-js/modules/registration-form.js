export default class RegistrationForm {
    constructor() {
        this.allFields = document.querySelectorAll('#registration-form .form-control')
        this.insertValidationElements()
        this.username = document.querySelector('#username-register')
        this.username.previousValue = ''
        this.events()
    }

    // Events
    events() {
        this.username.addEventListener('keyup', () => {
            this.isDifferent(this.username, this.usernameHandler)
        })

    }

    // Methods
    insertValidationElements() {
        this.allFields.forEach(function (el) {
            el.insertAdjacentHTML('afterend', '<div class="alert alert-danger small liveValidateMessage"></div>')
        })
    }

    isDifferent(el, handler) {
        if (el.previousValue != el.value) {
            handler.call(this)
        }
        el.previousValue = el.value
    }

    usernameHandler() {
        this.username.errors = false
        clearTimeout(this.username.timer)
        this.usernameImmediately()
        this.username.timer = setTimeout(() => this.usernameAfterDelay(), 750);
    }

    usernameImmediately() {
        if (this.username.value != '' && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
            this.showValidationError(this.username, 'Username can only contain letters and numbers.')
        }

        if (this.username.value.length > 30) {
            this.showValidationError(this.username, 'Username cannot be longer than 30 characters.')
        }

        if (!this.username.errors) {
            this.hideValidationError(this.username)
        }
    }

    usernameAfterDelay() {
        if (this.username.value.length < 3) {
            this.showValidationError(this.username, 'Username must be at least 3 characters long.')
        }
    }

    hideValidationError(el) {
        el.nextElementSibling.classList.remove('liveValidateMessage--visible')
    }

    showValidationError(el, message) {
        el.nextElementSibling.innerHTML = message
        el.nextElementSibling.classList.add('liveValidateMessage--visible')
        el.errors = true

    }
}
