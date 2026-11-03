/**
 * @autor Jorge Luis Cuellar
 * @version 1.0
 * Para cargar los ficheros javaScript bajo demanda
 * @url : direccion del js
 * @callback : funcion que se ejecutar despues de agregar el js
 */
function loadScript(url, callback) {

	if (!document.getElementById(url)) {
		
		var script = document.createElement('script');
		script.id = url;

		if (script.readyState) { // IE
			script.onreadystatechange = function () {
				if (script.readyState === 'loaded' || script.readyState === 'complete') {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else { // Others
			script.onload = function() {
				callback();
			};
		}

		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);

	} else
		callback();
}
