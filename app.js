'use strict';

const LOGIN_ENDPOINT = 'https://reqres.in/api/login';
const SIGNUP_ENDPOINT = 'https://reqres.in/api/register';

async function postJsonData(url = '', data = {}) {
	console.log(data);
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		// referrerPolicy: 'no-referrer',
		// credentials: 'include',
		body: JSON.stringify(data)
	});

	if (response.ok) {
		const jsonResponse = await response.json();
		return jsonResponse;
	} else
	throw new Error(`Unexpected response: ${response.statusText}`)
}


const validateForm = formEl => {

	const checkPassword = password => {
		let passed = false;
		for (let i=0; i<password.length; i++) {
		if (password[i] >='0' && password[i] <='9')
			passed = true;
		}
		return passed;
	}

	const invalidInputAlert = (el, text) => {
		if (el.nextElementSibling.nodeName !== 'P') {
			if (el.getAttribute('type') === 'checkbox')
				el = el.nextElementSibling;
			el.classList.add('error');
			el.insertAdjacentHTML('afterend', `<p class="error">${text}</p>`);
		}
		ok = false;
	}

	let ok = true;
	let email, password, confirmPassword, username, stayLoggedCheckbox, agreementCheckbox;
	if (formEl.getAttribute('id') === 'login-form') {
		email = formEl.querySelector('#login-email');
		password = formEl.querySelector('#login-password');
		stayLoggedCheckbox = formEl.querySelector('#login-stay-logged-in');
	} else {
		email = formEl.querySelector('#signup-email');
		password = formEl.querySelector('#signup-password');
		confirmPassword = formEl.querySelector('#signup-confirm-password');
		username = formEl.querySelector('#signup-username');
		stayLoggedCheckbox = formEl.querySelector('#signup-stay-logged-in');
		agreementCheckbox = formEl.querySelector('#signup-agreement');
	}

	if (password.value.length <6 || !checkPassword(password.value)) {
			if (formEl.getAttribute('id') === 'signup-form')
				invalidInputAlert(password, 'Invalid password, at least 6 characters and a number required');
			else
				invalidInputAlert(password, 'Invalid password entered');
	}

	if (formEl.getAttribute('id') === 'signup-form') {
	
		if (username.value.includes(' ')) {
			invalidInputAlert(username, 'No spaces are allowed');
		
		if (!agreementCheckbox.checked) {
				invalidInputAlert(agreementCheckbox, 'Need to accept the Agreement in order to register');
			}
		}
	
		if (confirmPassword.value !== password.value) {
			invalidInputAlert(confirmPassword, 'The passwords do not match');
		}
	}
	return ok;
}

const popupAlert = (type, text) => {
	const alertPopupBgWrapper = document.createElement('div');
	alertPopupBgWrapper.setAttribute('class', 'alert-popup-bg-wrapper flex-center');
	alertPopupBgWrapper.setAttribute('id', 'alert-popup-bg-wrapper');

	const alertPopup = document.createElement('div');
	alertPopup.setAttribute('class','alert-popup flex-center flex-column');
	alertPopup.setAttribute('id', 'alert-popup');
	alertPopupBgWrapper.appendChild(alertPopup);
	const alertPopupGifWrapper = document.createElement('div');
	alertPopupGifWrapper.setAttribute('class', 'popup-gif');
	alertPopup.appendChild(alertPopupGifWrapper);
	const alertPopupGif = document.createElement('img');
	if (type === 'success')
		alertPopupGif.setAttribute('src','img/success-icon-10.png');
	else
		alertPopupGif.setAttribute('src','img/error-failure-10382.png');
	alertPopupGifWrapper.appendChild(alertPopupGif);

	const popupText = document.createElement('div');
	popupText.setAttribute('class',`popup-text ${type}`);
	popupText.innerText = text;
	alertPopup.appendChild(popupText)

	document.querySelector('#body').appendChild(alertPopupBgWrapper);
	setTimeout(() => {
		alertPopupBgWrapper.style.animation = 'popup-animation 1s ease reverse'
		alertPopupBgWrapper.remove();
	}, 3000);
}

const App = () => {
	const registrationForm = document.getElementById('signup-form');
	const loginForm = document.getElementById('login-form');

	loginForm.addEventListener('submit', event => {
		event.preventDefault();
		
		if (validateForm(loginForm)) {
		}
	}, true);

	registrationForm.addEventListener('submit', event => {
		event.preventDefault();
	 	
		if (validateForm(registrationForm)) {
			postJsonData(SIGNUP_ENDPOINT, {
				"email": document.querySelector('#signup-email').value,
				"password": document.querySelector('#signup-password').value
			}).then(data => {
				popupAlert('success', 'Account registrated successfully');
			}).catch(error => {
				popupAlert('error', error);
			});
		}

	}, true);

}

window.addEventListener('DOMContentLoaded', () => {
	App();
}, false);