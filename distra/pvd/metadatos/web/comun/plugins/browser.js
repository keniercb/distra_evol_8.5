var browser = {
		name          : (navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)[1]).toLowerCase() || false,
		codeVersion   : navigator.appVersion,
		system        : navigator.platform.toLowerCase(),
		code          : navigator.appCodeName,
		cookiesEnabled: navigator.cookieEnabled
}