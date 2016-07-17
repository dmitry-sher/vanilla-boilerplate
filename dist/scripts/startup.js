// settings
var settings = {
	connectionTimeout: 15000,
	slideTime: 8000,
	url: '/form',
	method: 'POST',
	failedMessage: 'connection failed'
}

// compat
function detectBrowsers() {
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		$('html').addClass('safari');
	}

	if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) ) {
		$('html').addClass('mobileSafari');
	}

	if (navigator.userAgent.match(/iPad/i)) {
		$('html').addClass('iPad');
	}

	if (navigator.userAgent.match(/iPhone/i)) {
		$('html').addClass('iPhone');
	}

	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
		$('html').addClass('firefox');
	}

	if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
		$('html').addClass('android');
	}

	if (!!window.chrome && !!window.chrome.webstore) {
		$('html').addClass('chrome');
	}

	if (Function('/*@cc_on return document.documentMode===10@*/')())
		$('html').addClass('ie10');

	if (!!window.MSInputMethodContext && !!document.documentMode)
		$('html').addClass('ie11')
}

function isDevice() {
	return isIpad() || isIphone() || isAndroid();
}

function isIpad() {
	return $('html').hasClass('iPad');
}

function isAndroid() {
	return $('html').hasClass('android');
}

function isIphone() {
	return $('html').hasClass('iPhone');
}

function ipadOrient() {
	$(document).ready(function() {
		window.addEventListener('orientationchange', function(e) {
				onOrient();
		});
	});
}

function onOrient(initial) {
	var $w = $(window);
	var wdth = $w.width(), hght = $w.height();
	if (window.orientation == 90 || window.orientation == -90 || wdth >= hght)
		$('html').addClass('landscape').removeClass('portrait');
	else
		$('html').removeClass('landscape').addClass('portrait');
	setTimeout(function() {
		if (reinitSlick && !initial)
			reinitSlick();
	}, 50);
}

function prepareBrowsers() {
	if (isDevice()) {
		var h = $(window).height(), w = $(window).width();
		$('.slide').css('height', h + 'px').css('width', w + 'px');
		$('.bg').css('height', h + 'px').css('width', w + 'px');
		$('.popup, .popupvideo').css('height', h + 'px').css('width', w + 'px');
		$('.form').css('height', h*0.95 + 'px').css('width', w + 'px').css('padding-top', h*0.05 + 'px');
		return;
	}
	onResize();
}

function startup() {
	detectBrowsers();
	ipadOrient();
	onOrient(true);
	prepareBrowsers();
	startSlick(0, true);
	$('.popup').on('click', onPopupClick);
	$('.popupvideo').on('click', onVideoPopupClick);
	$(window).on('resize', onResize);
	$('.bg01').waitForImages(function() {
	    preloaded('bg1');
	}, prl2, true);
	$('.bg02').waitForImages(function() {
	    preloaded('bg2');
	}, prl2, true);
}

var $w = $(window);
function onResize() {
	if (isDevice())
		return;
	var h = $w.height(), w = $w.width();

}

startup();

// form

// login block
var $msg = $('.msg'), phs = {};
function setPlaceHolder(cls, val) {
	var $inp = $('input.' + cls), inp = $inp[0], ph = true, phV = val;
	phs[cls] = ph;

	function onKeyUp(e) {
		ph = e.target.value == '';
		phs[cls] = ph;
	}

	function onBlur(e) {
		if (ph) {
			if (isDevice()) {
				e.target.value = phV;
				return;
			}
			$inp.addClass('transit').css('color', 'rgba(0,0,0,0)');
			e.target.value = phV;
			setTimeout(function() {
				$inp.css('color', '');
				setTimeout(function() {
					$inp.removeClass('transit');
				}, 100);
			}, 10);
		}
	}

	function onFocus(e) {
		if (ph) {
			if (isDevice()) {
				e.target.value = '';
				return;
			}
			$inp.addClass('transit');
			setTimeout(function() {
				$inp.css('color', 'rgba(0,0,0,0)');
				setTimeout(function() {
					e.target.value = '';
					$inp.removeClass('transit');
					setTimeout(function(){
						$inp.css('color', '');
					}, 0);
				}, 100);
			}, 0);
		}
			// e.target.value = '';
	}

	$inp.on('keyup', onKeyUp);
	$inp.on('blur', onBlur);
	$inp.on('focus', onFocus);
	onBlur({target: inp});
	$inp.on('change', onKeyUp);
}
// setPlaceHolder('name', 'ваше имя');
// var hrefph = 'ссылка на видео выступления';
// if (isIphone() || isIphone())
// 	hrefph = 'ссылка на видео';
// setPlaceHolder('href', hrefph);
// setPlaceHolder('email', 'email');


function showMsg(err, msg) {
	setVisualLoadingState(false);
	$msg.removeClass('hidden').html(msg);
	if (err)
		$msg.addClass('error');
	else
		$msg.removeClass('error');
}

// function showForm() {
// 	pauseSlick();
// 	fadeInPopup('form');
// 	return false;
// }

// function closeForm() {
// 	unpauseSlick();
// 	fadeOutPopup('form');
// }

var xhr;
$('#email').on('submit', function() {

	var name = document.forms['mailform'].elements['name'];
	if (!name.value || phs['name']) {
		document.forms['mailform'].elements['name'].focus();
		return false;
	}

	var href = document.forms['mailform'].elements['href'];
	if (!href.value || phs['href']) {
		document.forms['mailform'].elements['href'].focus();
		return false;
	}

	var email = document.forms['mailform'].elements['email'];
	if (!email.value || phs['email']) {
		document.forms['mailform'].elements['email'].focus();
		return false;
	}


	if (xhr) {
		xhr.abort();
		xhr = false;
	}
	setVisualLoadingState(true);

	setTimeout(function() {
		xhr = $.ajax({
			success: onSuccess,
			error: onError,
			data: {
				email: email.value,
				href: href.value,
				name: name.value,
				'form-name': 'mailform'
			},
			dataType: 'json',
			method: settings.method,
			timeout: settings.connectionTimeout,
			url: settings.url,
			async: true
		});
	}, 50);
	return false;
});

function setVisualLoadingState(state) {
	if (state) {
		$('input.submit').addClass('hidden');
		$('.loader').removeClass('hidden');
	} else {
		$('input.submit').removeClass('hidden');
		$('.loader').addClass('hidden');
	}
}

function onSuccess(data) {
	showMsg(data.err, data.text);
}

function onError(data) {
	showMsg(true, settings.failedMessage);
}