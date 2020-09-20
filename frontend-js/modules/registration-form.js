import axios from 'axios'

export default class RegistrationForm {
    constructor() {
        this.form = document.querySelector('#registration-form')
        this.allFields = document.querySelectorAll('#registration-form .form-control')
        this.insertValidationElements()
        this.username = document.querySelector('#username-register')
        this.username.previousValue = ''
        this.email = document.querySelector('#email-register')
        this.email.previousValue = ''
        this.password = document.querySelector('#password-register')
        this.password.previousValue = ''
        this.username.isUnique = false
        this.email.isUnique = false
        this.events()
    }

    // Events
    events() {
        this.form.addEventListener('submit', e => {
            e.preventDefault()
            this.formSubmitHandler()
        })
        this.username.addEventListener('keyup', () => {
            this.isDifferent(this.username, this.usernameHandler)
        })
        this.email.addEventListener('keyup', () => {
            this.isDifferent(this.email, this.emailHandler)
        })
        this.password.addEventListener('keyup', () => {
            this.isDifferent(this.password, this.passwordHandler)
        })
        this.username.addEventListener('blur', () => {
            this.isDifferent(this.username, this.usernameHandler)
        })
        this.email.addEventListener('blur', () => {
            this.isDifferent(this.email, this.emailHandler)
        })
        this.password.addEventListener('blur', () => {
            this.isDifferent(this.password, this.passwordHandler)
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

        if (!this.username.errors) {
            axios.post('/doesUsernameExist', {
                username: this.username.value
            }).then((response) => {
                if (response.data) {
                    this.showValidationError(this.username, 'That username is already taken.')
                    this.username.isUnique = false
                } else {
                    this.username.isUnique = true
                }
            }).catch(() => {
                console.log('Please try again later.')
            })
        }
    }

    emailHandler() {
        this.email.errors = false
        clearTimeout(this.email.timer)
        this.email.timer = setTimeout(() => this.emailAfterDelay(), 900);
    }



    emailAfterDelay() {
        if (!/^\S+@\S+$/.test(this.email.value)) {
            this.showValidationError(this.email, 'Plese provide a valid email address.')
        }

        if (!this.email.errors) {
            axios.post('/doesEmailExist', {
                email: this.email.value
            }).then((response) => {
                if (response.data) {
                    this.showValidationError(this.email, 'That email is already taken.')
                    this.email.isUnique = false
                } else {
                    this.email.isUnique = true
                    this.hideValidationError(this.email)
                }
            }).catch(() => {
                console.log('Please try again later.')
            })
        }
    }

    passwordHandler() {
        this.password.errors = false
        clearTimeout(this.password.timer)
        this.passwordImmediately()
        this.password.timer = setTimeout(() => this.passwordAfterDelay(), 750);
    }

    passwordImmediately() {
        if (this.password.value.length > 50) {
            this.showValidationError(this.password, 'password cannot be longer than 50 characters.')
        }

        if (!this.password.errors) {
            this.hideValidationError(this.password)
        }
    }

    passwordAfterDelay() {
        if (this.password.value.length < 12) {
            this.showValidationError(this.password, 'Password must be at least 12 characters long.')
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

    formSubmitHandler() {
        this.usernameImmediately()
        this.usernameAfterDelay()
        this.emailAfterDelay()
        this.passwordImmediately()
        this.passwordAfterDelay()

        if (
            this.username.isUnique
            && this.email.isUnique
            && !this.username.errors
            && !this.email.errors
            && !this.password.errors
        ) {
            this.form.submit()
        }
    }
}
