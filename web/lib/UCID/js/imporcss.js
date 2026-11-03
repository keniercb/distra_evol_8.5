/*
 * Componente portal de aplicaciones
 *
 * Elemento base del portal donde se difine una funcion paar incluir CSS.
 *
 * @author Dionisdel Ponce Santana
 * @package Portal
 * @subpackage Portal
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */

function importarCSS(dirCSS){
	var css_style = document.createElement("link");
	css_style.setAttribute("rel", "stylesheet");
	css_style.setAttribute("type", "text/css");
	css_style.setAttribute("href", dirCSS);
	document.getElementsByTagName("head")[0].appendChild(css_style);
}

function importarJS(dirJS){
	var js_file = document.createElement("script");
	js_file.setAttribute("type", "text/javascript");
	js_file.setAttribute("src", dirJS);
	document.getElementsByTagName("head")[0].appendChild(js_file);
}
