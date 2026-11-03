/**
 *@Author: Ing. Daymel Machado Cabrera
 *@Modifier: Ing. Osvaldo Manuel Gonzalez Ortiz
 *@Name: dibujarOrganigrama
 *@Tipo: Object
 *@Description: Dibujar el organigrama a partir de la estructura seleccionada en el gestionar reporte.
 **/
Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
var arbol = [] //Guarda los elementos seleccionados del arbol de estructura
var organigrama = ""; //Es el objeto que contiene todos los nodos que se muestran visualmente y el responsable de de contener los nuevos
var contenedorOrganigrama = "";
var ventanaOrganigrama = "";
var estiloOrganigrama;
var proyecto;
/**
 * El metodo es el encargado de construir todo el panel visual para el organigrama,
 * incluyendo estilos. botones y el  nodo primario.
 * @param arrnodo Arreglo de nodos seleccionados en el arbol de estructura del gestionar reporte
 */
function dibujarOrganigrama(title, idproyecto, arrnodo, xml, horizontal)
{
		proyecto = idproyecto;
		arbol = arrnodo;    //arreglo de los elementos seleccionados en el arbol de estructura
		ventanaOrganigrama = new Reporte.ventana({
				id: 'ventanaOrganigrama'
		});   //se crea la ventana del organigrama
		var panelOrganigrama = new Reporte.panel;   //se crea el panel contenedorOrganigrama
		ventanaOrganigrama.setTitle(title ? title : 'Organigrama'); //se annade el titulo de la ventana
		/*Se le annade al panel contenedorOrganigrama las capas con sus identificadores correspondientes para
		 * la captura de los estilos de los mismos*/
		panelOrganigrama.html = '<div id="principal"></div>'
		panelOrganigrama.html += '<div id="canvasOrganigrama" style="z-index:1;position:absolute;' + 'overflow:hidden;top:35px;right:5px;width:160px;height:120px;' + 'background:transparent;border-style:solid;border-color:lightgray;"></div>';
		/*se le annaden posteriormente los componentes al panel, botones y leyenda*/
		panelOrganigrama.add({
				tbar: [{
						xtype  : 'button', text: '', id: 'zoomin', iconCls: 'ampliarimagen', //								icon   : '/metadatos/comun/recursos/iconos/organigrama/zoom_in.png',
						tooltip: 'Acercar <b>(+)</b>', handler: function ()
						{
								zoomOrganigrama('in')
						}
				}, {
						xtype  : 'button', text: '', id: 'zoomout', iconCls: 'reducirimagen', //								icon   : '/metadatos/comun/recursos/iconos/organigrama/zoom_out.png',
						tooltip: 'Alejar <b>(-)</b>', handler: function ()
						{
								zoomOrganigrama('out')
						}
				}, {
						xtype  : 'button', text: '', id: 'atual', iconCls: 'actual', //								icon   : '/metadatos/comun/recursos/iconos/organigrama/view_1_1.png',
						tooltip: 'Vista actual <b>(Alt+V)</b>', handler: function ()
						{
								zoomOrganigrama('actual', organigrama)
						}
				}, {
						xtype  : 'button', text: '', id: 'print', iconCls: 'imprimir', //								icon   :  perfil.dirImg + "imprimir.png",
						tooltip: 'Imprimir <b>(Alt+P)</b>', handler: function ()
						{
								imprimirOrganigrama()
						}
				}, {
						xtype  : 'button', text: '', id: 'save', hidden: (xml != null || proyecto != 0), iconCls: 'guardar', //								icon   : perfil.dirImg + 'guardar.png',
						tooltip: "Guardar organigrama <b>(Alt+G)</b>", handler: function ()
						{
								salvarOrganigrama();
						}
				}]
		});
		ventanaOrganigrama.add(panelOrganigrama);   //se le annade a la ventana el panel con sus elementos
		ventanaOrganigrama.show();  //se muestra la ventana
		// Comprobar si el navegador es soportado
		new Ext.KeyMap("ventanaOrganigrama", [{
				key: "g", alt: true, fn: function ()
				{
						if (proyecto == 0) {
								salvarOrganigrama();
						}
				}
		}, {
				key: "p", alt: true, fn: function ()
				{
						imprimirOrganigrama();
				}
		}, {
				key: Ext.EventObject.NUM_PLUS, fn: function ()
				{
						zoomOrganigrama('in');
				}
		}, {
				key: Ext.EventObject.NUM_MINUS, fn: function ()
				{
						zoomOrganigrama('out');
				}
		}, {
				key: 'v', alt: true, fn: function ()
				{
						zoomOrganigrama('actual');
				}
		}]);
		if (!mxClient.isBrowserSupported()) {
				mostrarMensaje(3, "Navegador web no soportado.")
		} else {
				contenedorOrganigrama = document.getElementById('principal');  //se captura la capa principal
				/*se establecen los estilos css de dicha capa*/
				contenedorOrganigrama.style.position = 'absolute';
				contenedorOrganigrama.style.overflow = 'hidden';
				contenedorOrganigrama.style.left = '-300px';
				contenedorOrganigrama.style.top = '35px';
				contenedorOrganigrama.style.right = '0px';
				contenedorOrganigrama.style.bottom = '0px';
				// Crea el div que contendra el panel de navageción situado en parte superior derecha del navegador.
				var divNavegacion = document.getElementById('canvasOrganigrama');
				// Crea el oragnigrama dentro del contenedorOrganigrama declarado
				organigrama = new mxGraph(contenedorOrganigrama);
				// Crea el panel de navegación para del oraganigrama.
				var panelNavegacion = new mxOutline(organigrama, divNavegacion);
				// Disables tooltips on touch devices
				//        organigrama.setTooltips(!mxClient.IS_TOUCH);
				organigrama.setTooltips(!mxClient.IS_TOUCH);
				//Desabilita el menu del click derecho.
				mxEvent.disableContextMenu(contenedorOrganigrama);
				// Estilos para la apariencia de las celdas organigrama.
				var estiloOrganigrama = organigrama.getStylesheet().getDefaultVertexStyle();
				estiloOrganigrama[mxConstants.STYLE_SHAPE] = 'label';
				estiloOrganigrama[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
				estiloOrganigrama[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
				estiloOrganigrama[mxConstants.STYLE_SPACING_LEFT] = 65;
				estiloOrganigrama[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
				estiloOrganigrama[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
				estiloOrganigrama[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';//'#adc5ff'
				estiloOrganigrama[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
				estiloOrganigrama[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
				estiloOrganigrama[mxConstants.STYLE_FONTSIZE] = '12';
				estiloOrganigrama[mxConstants.STYLE_FONTSTYLE] = '1';
				estiloOrganigrama[mxConstants.STYLE_SHADOW] = '1';
				estiloOrganigrama[mxConstants.STYLE_ROUNDED] = '1';
				estiloOrganigrama[mxConstants.STYLE_GLASS] = '1';
				estiloOrganigrama[mxConstants.STYLE_IMAGE] = null;
				estiloOrganigrama[mxConstants.STYLE_INDICATOR_IMAGE] = null;
				estiloOrganigrama[mxConstants.STYLE_IMAGE_WIDTH] = '55';
				estiloOrganigrama[mxConstants.STYLE_IMAGE_HEIGHT] = '55';
				// Estilos para la apariencia de las lineas conectoras.
				var estiloOrganigrama = organigrama.getStylesheet().getDefaultEdgeStyle();
				estiloOrganigrama[mxConstants.STYLE_ROUNDED] = true;
				estiloOrganigrama[mxConstants.STYLE_STROKEWIDTH] = 3;
				estiloOrganigrama[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
				// Permite cambiar automaticamente el tamaño despues de esditar la celda.
				organigrama.setCellsMovable(true);
				organigrama.setAutoSizeCells(true);
				organigrama.setPanning(true);
				organigrama.panningHandler.useLeftButtonForPanning = true;
				// Muestra un popupmenu cuando el usuario hace clic en una celda
				// (con el botón izquierdo del ratón), pero no seleccionan
				// la celda cuando se visualiza el menú emergente
				organigrama.panningHandler.selectOnPopup = false;
				// Detener los eventos en la teclas Esc y Enter.
				var teclaFunciones = new mxKeyHandler(organigrama);
				// Cambia los valores por defecto de las flechas y vertices.
				//				estiloOrganigrama = organigrama.getStylesheet().getDefaultEdgeStyle();
				estiloOrganigrama[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
				//				estiloOrganigrama = organigrama.getStylesheet().getDefaultVertexStyle();
				estiloOrganigrama[mxConstants.STYLE_SPACING] = 8;
				/* Permite la distribución automática en el gráfico
				 * y se instala un diseño de árbol de todos los grupos de hijos
				 * quienes están siendo cambiados, agregados o eliminados.
				 **/
				var capa = new mxCompactTreeLayout(organigrama, horizontal);
				/*Orientacion del organigrama*/
				capa.useBoundingBox = false;
				capa.levelDistance = 40;
				capa.nodeDistance = 16;
				/*Permite el diseño para mover las células
				 *a pesar de que las células no son móviles en el gráfico
				 **/
				capa.isVertexMovable = function (cell)
				{
						return true;
				};
				var capaMgr = new mxLayoutManager(organigrama);
				capaMgr.getLayout = function (cell)
				{
						if (cell.getChildCount() > 0) {
								return capa;
						}
				};
				//				// Instala un controlador popupmenu con la función local (véase más adelante).
				organigrama.panningHandler.factoryMethod = function (menu, cell, evt)
				{
						//return createPopupMenu(organigrama, menu, cell, evt);
				};
				// Arreglo para el tamaño preferido mal
				var tamannoCelda = organigrama.getPreferredSizeForCell;
				organigrama.getPreferredSizeForCell = function (cell)
				{
						var resultado = tamannoCelda.apply(this, arguments);
						if (resultado != null) {
								resultado.width = Math.max(120, resultado.width - 20);
						}
						return resultado;
				};
				// Obtiene la matriz por defecto para la inserción de nuevas células.
				// Este suele ser el primer hijo de la raíz (es decir, la capa 0).
				if (xml == null) {
						try {
								var padre = organigrama.getDefaultParent();
								// Añade el vértice de la raíz del árbol.
								organigrama.setEnabled(false);
								organigrama.getModel().beginUpdate();
								if (arbol.length > 0) {
										pintarSeleccionDeEstructura(padre);
								} else {
										addNodoPadre(padre);
								}
						} finally {
								// Actualiza la visualización
								organigrama.getModel().endUpdate();
						}
				} else {
						cargarOrganigrama(xml);
				}
		}
}
/**
 * Funcion auxiliar que retorna la existencia de un identificador en un arreglo dado
 * @param lista Arreglo de elementos donde se desea buscar el identificador
 * @param id Identificador a buscar
 * @param tipo Valor logico que especifica si el arreglo es de identificadores u objetos con esa propiedad
 */
function buscarPadreEnArreglo(lista, id, tipo)
{
		for (var i = 0; i < lista.length; i++) {
				if (tipo) {
						/*si es un simple arreglo de identificadores*/
						if (lista[i] == id) {
								/*si el identificador en la lista es igual al id en cuestion*/
								return i; //retorna la posicion del elemento
						}
				} else {
						if (lista[i].id == id) {
								return i;
						}
				}
		}
		focoVentana();
		return -1; //de no encontrar ninguna coincidencia retorna -1
}
/**
 * Funcion encargada de pintar recursivamente todos los hijos de los nodos hijos encontrados en la lista
 * de seleccion, dado un padre.
 * @param padre Nodo padre que buscara los hijos posteriores en el arreglo de seleccion
 * @param i Posicion a partir de donde debe comenzar a buscar en el arreglo
 * @param model Modelo del organigrama, necesario para crear los nuevos vertices
 * @return si el valor de i es igual a la longitud del arbol, retorna ese mismo valor
 *         si i es igual a la longitud -1 del arbol y el elemento de esa posicion tiene como padre, al nodo en cuestion, retorna el valor obtenido de su llamada recursiva en i+1
 *              si no tiene tiene como padre al nodo, retorna esa misma posicion
 *         si es menor que la longitud - 1 y en el recorrido por el arreglo donde el nodo en la posicion en cuestion tiene como padre al nodo insertado
 *              y ese valor es menor que la longitud donde en esa misma posicion es que se encuentra su nodo hijo, retorna esa posicion -1
 *              sino retorna el valor obtenido.
 *         en caso de ser mayor o igual a la longitud, se retorna dicho valor.
 *         si logra terminar el recorrido por todos los elementos del arbol, retorna entonces la longitud del arbol.
 */
function addHijosLista(padre, i, model)
{
		if (i == arbol.length) {
				/*si la posicion i es igual a la longitud del arbol*/
				addHijosNodo(padre, true, false); //annadir todos los hijos restantes del nodo
				return i; //retorna la longitud del arbol
		} else {
				if (i == arbol.length - 1) {
						/*si es igual a la longitud -1 del arbol*/
						if (arbol[i].idpadre == padre.id) {
								/*si el identificador del padre del elemento del arbol en i es igual a la del identificador
								 * del padre en cuestion*/
								var cantidad = '';
								if (arbol[i].cantidad != null) {
										cantidad = ' [' + arbol[i].cantidad + '|' + arbol[i].cantidad_real + ']'
								}
								var text = arbol[i].denom + cantidad; //se captura la denominacion del elemento
								var id = arbol[i].id;   //se captura su identificador
								var tipo = arbol[i].idconcepto; //se captura el tipo de estructura que es
								var image = arbol[i].icono;
								var image2 = image.substr(0, image.indexOf(";"));
								var data = image2.substr(image2.indexOf('data:image/') + 11, image2.length);
								var img = image.slice(image.indexOf('base64,'), image.length) + '~' + data;
								var icon = "image=" + img;  //direccion del icono de dicha estructura
								/*Se crea el nodo hijo con su padre por defecto (DefaultParent), su texto y su icono*/
								var hijo = organigrama.insertVertex(organigrama.getDefaultParent(), null, text, null, null, null, null, icon);
								/*se annade el identificador del nodo, no se le pasa por parametro
								 porque sufre transformaciones*/
								hijo.setId(id);
								var geometry = model.getGeometry(hijo);
								// Actualiza las dimensiones del grafico por los nuevos hijos
								var size = organigrama.getPreferredSizeForCell(hijo);
								geometry.width = size.width;
								geometry.height = size.height;
								/* Adiciona los vertices entre los existentes
								 *tomando de manera automatica las propiedades del padre
								 **/
								var vertice = organigrama.insertEdge(organigrama.getDefaultParent(), null, '', padre, hijo);
								vertice.setId(id);
								vertice.geometry.x = 1;
								vertice.geometry.y = 0;
								vertice.geometry.offset = new mxPoint(0, -20);
								tieneHijos(arbol[i], hijo, true, false); //se busca si tiene hijos para annadirle los elementos restantes
								/*retorna el valor de la llamada recursiva del hijo en i+1
								 * donde busca en los elementos que queda de la lista del arbol cual de ellos es hijo de dicho nodo
								 * para pintarlo con su dependencia*/
								return addHijosLista(hijo, i + 1);
						} else {
								addHijosNodo(padre, true, false); //annade todos los hijos restantes del nodo padre en cuestion
								return i; //retorna la posicion i
						}
				} else {
						/*de no ser igual a la longitud - 1, recorre los elementos desde la posicion i, para pintar
						 * sus hijos que quedan en el arreglo en caso de encontrar alguno*/
						for (i; i < arbol.length; i++) {
								if (arbol[i].idpadre == padre.id) {
										var cantidad = '';
										if (arbol[i].cantidad != null) {
												cantidad = ' [' + arbol[i].cantidad + ']'
										}
										var text = arbol[i].denom + cantidad;
										var id = arbol[i].id;
										var tipo = arbol[i].idconcepto;
										var image = arbol[i].icono;
										var image2 = image.substr(0, image.indexOf(";"));
										var data = image2.substr(image2.indexOf('data:image/') + 11, image2.length);
										var img = image.slice(image.indexOf('base64,'), image.length) + '~' + data;
										var icon = "image=" + img;  //direccion del icono de dicha estructura
										var hijo = organigrama.insertVertex(organigrama.getDefaultParent(), null, text, null, null, null, null, icon);
										hijo.setId(id);
										var geometry = model.getGeometry(hijo);
										var size = organigrama.getPreferredSizeForCell(hijo);
										geometry.width = size.width;
										geometry.height = size.height;
										var vertice = organigrama.insertEdge(organigrama.getDefaultParent(), null, '', padre, hijo);
										vertice.setId(id);
										vertice.geometry.x = 1;
										vertice.geometry.y = 0;
										vertice.geometry.offset = new mxPoint(0, -20);
										tieneHijos(arbol[i], hijo, false, false);
										/*annade los hijos restantes en el arreglo del nodo padre en cuestion*/
										var j = addHijosLista(hijo, i + 1, model);
										if (j < arbol.length) {
												/*si el valor obtenido de la recursividad es menos que la longitud del arbol
												 * es que no termino de annadir todos los elementos*/
												if (arbol[j].idpadre == padre.id) {
														/*si el identificador del padre, del elemento que esta en esa posicion es
														 * igual a la del padre en cuestion*/
														i = j - 1; //actualiza i en dicha posicion -1 para retomarel recorrido desde esa posicion
												} else {
														return j; //retorna el valor obtenido
												}
										} else {
												return j; //retorna el valor obtenido
										}
								} else {
										addHijosNodo(padre, true, false);  //annade todos los hijos restantes del nodo padre en cuestion
										return i;   //retorna la posicion i
								}
						}
						return arbol.length;    //retorna la longitud del arbol
				}
		}
		focoVentana();
}
/**
 * Funcion encargada de pintar los elementos seleccionados en el arbol de estructura. Pinta el primer nodo obtenido
 * y a partir de ahi, busca recursivamente los restantes hijos, determinando si el organigrama es de solo
 * un nivel de estructura para poder pintarlo o si no cumple esta condicion para informarselo al usuario.
 */
function pintarSeleccionDeEstructura()
{
		//Pintar el primer nodo
		var cantidad = '';
		if (arbol[0].cantidad != null) {
				cantidad = ' [' + arbol[0].cantidad + ']'
		}
		var text = arbol[0].denom + cantidad;  //se captura la denominacion del primer elemento del arreglo de seleccion
		var id = arbol[0].id;   //se captura el identificador del primer elemento
		var tipo = arbol[0].idconcepto; //se captura el tipo de estructura que es el elemento
		var image = arbol[0].icono;
		var image2 = image.substr(0, image.indexOf(";"));
		var data = image2.substr(image2.indexOf('data:image/') + 11, image2.length);
		var img = image.slice(image.indexOf('base64,'), image.length) + '~' + data;
		var icon = "image=" + img;  //direccion del icono de dicha estructuravar
		var w = organigrama.container.offsetWidth;  //se captura la dimension del contenedorOrganigrama del organigrama
		/*se crea el nodo padre con el primer elemento y sus dimensiones por defecto*/
		var vpadre = organigrama.insertVertex(organigrama.getDefaultParent(), id, text, w / 2 - 30, 20, 140, 60, icon);
		var model = organigrama.getModel();
		model.getGeometry(vpadre);
		// Actualiza las dimensiones del grafico por el nuevo nodos
		organigrama.updateCellSize(vpadre);
		tieneHijos(arbol[0], vpadre, false, true);    //se determina si tiene hijos para annadirle los elementos restantes
		var r = addHijosLista(vpadre, 1, organigrama.getModel());   //se annaden los hijos restantes de la lista de seleccion
		if (r != arbol.length) {
				/*si el valor obtenido no es igual a la longitud es que no se annadieron todos los hijos
				 * se muestra un mensaje de error y se cierra la ventana*/
				mostrarMensaje(1, "El Organigrama no admite dos niveles estructurales", function ()
				{
						$pdf, $table, $config, $datos, $proyecto
						ventanaOrganigrama.close();
				});
		}
		focoVentana();
}
/**
 * Se encarga de annadir al nodo primario del organigrama
 * @param padre Es el padre por defecto, necesario para comenzar a adicionar nuevos nodos (DefaultParent)
 **/
function addNodoPadre(padre)
{
		/**se realiza la llamada al metodo correspondiente que se encarga de buscar el nodo padre total
		 * de las estructuras, en caso de no haber seleccionado nada en el arbol
		 **/
		Secodena.mostrarMascara('carganodos', '', 'Cargando raiz del organigrama...');
		Ext.Ajax.request({
				url: 'buscarPadreTotal', method: 'POST', callback: function (options, success, response)
				{
						Secodena.ocultarMascara('carganodos');
						var responseData = Ext.decode(response.responseText);   //recibe los valores del padre
						var cantidad = '';
						if (responseData[0].cantidad != null) {
								cantidad = ' [' + responseData[0].cantidad + ']'
						}
						var text = responseData[0].text + cantidad;    //se captura la denominacion del elemento
						var id = responseData[0].id;    //identificador
						var tipo = responseData[0].idconcepto;  //tipo de estructura
						var image = responseData[0].iconoorganigrama;
						var image2 = image.substr(0, image.indexOf(";"));
						var data = image2.substr(image2.indexOf('data:image/') + 11, image2.length);
						var image2 = image.substr(0, image.indexOf(";"));
						var data = image2.substr(image2.indexOf('data:image/') + 11, image2.length);
						var img = image.slice(image.indexOf('base64,'), image.length) + '~' + data;
						var icon = "image=" + img;  //direccion del icono de dicha estructura/*dimension del contenedorOrganigrama del organigrama para determinar su posicion central*/
						var w = organigrama.container.offsetWidth;
						/*se crea el nodo padre con sus dimensiones por defecto, su texto y su icono*/
						var vpadre = organigrama.insertVertex(padre, id, text, w / 2 - 30, 20, 140, 60, icon);
						var model = organigrama.getModel();
						var geometry = model.getGeometry(vpadre);   //se captura las nuevas geometria del modelo del organigrama
						// Actualiza las dimensiones del grafico por los nuevos hijos
						organigrama.updateCellSize(vpadre); //se actualiza la dimension del nodo luego de annadir todos sus elementos
						construirOrganigrama(vpadre, false, true, responseData[0]);  //se visualiza el nodo siendo padre sin ser hoja
						focoVentana();
				}
		});
}
/**
 * Adiciona todos los nodos hijos del nodo seleccionado. Es responsable de annadir tanto los hijos inmediatos o toda la estructura
 * a partir del nodo en cuestion.
 * @param nodo Es el nodo del que se desean adicionar todos sus hijos
 * @param all Valor logico que indica si el usuario ha seleccionado expandir sobre el nodo seleccionado
 */
function addHijosNodo(nodo, all, btn)
{
		if (btn) {
				var model = organigrama.getModel(); //modelo del organigrama
				var padre = organigrama.getDefaultParent(); //padre por defecto inicial
				model.beginUpdate();    //comenzar la actualizacion de los elementos del modelo
				try {
						/*Llamada al metodo dameHijos con el identificador del nodo que retorna un arreglo
						 * de objetos de todos los hijos del cual es padre*/
						Secodena.mostrarMascara('carganodos', '', 'Cargando nuevos elementos...');
						Ext.Ajax.request({
								url        : 'dameHijos', method: 'POST', params: {
										idpadre   : nodo.getId(),   //identificador del nodo
										idproyecto: proyecto
								}, callback: function (options, success, response)
								{
										Secodena.ocultarMascara('carganodos');
										var responseData = Ext.decode(response.responseText);   //arreglo de hijos
										var t = organigrama.getChildEdges(padre);   //obtiene todos los vertices annadidos hasta el momento
										var ids = [];   //arreglo de identificadores
										for (var i = 0; i < t.length; i++) {
												ids.push(t[i].getId()); //adiciona todos los identificadores de los vertices annadidos
										}
										for (var i = 0; i < responseData.length; i++) {
												var existe = false; //existe en los elementos almacenados en el arreglo de identificadores ids
												var cantidad = '';
												if (responseData[i].cantidad != null) {
														cantidad = ' [' + responseData[i].cantidad + '|' + responseData[i].cantidad_real + ']'
												}
												var idestado = responseData[i].estado;
												var text = responseData[i].text + cantidad;    //captura la denominacion del hijo en i
												var id = responseData[i].id;    //captura el identificador del hijo en i
												for (var j = 0; j < ids.length; j++) {
														if (ids[j] == id) {
																/*comprueba si el hijo se encuentra en el arreglo de identificadores ids*/
																existe = true;
																break;
														}
												}
												if (!existe) {
														/*si el identificador no existe*/
														var tipo = responseData[i].idconcepto;  //captura el tipo de elemento que es el
														var image = responseData[i].iconoorganigrama;
														var image2 = image.substr(0, image.indexOf(";"));
														var data = image2.substr(image2.indexOf('data:image/') + 11, image2.length);
														var img = image.slice(image.indexOf('base64,'), image.length) + '~' + data;
														var icon = "image=" + img;  //direccion del icono de dicha estructura
														/*crea el nodo hijo con el texto del elemento y su icono annadiendolo a su padre por defecto del organigrama*/
														var hijo = organigrama.insertVertex(padre, null, text, null, null, null, null, icon);
														hijo.setId(id); //se le annade su identificador, no se le pasa por parametros porque lo transforma
														ids.push(id);   //se annade al arreglo de los identificadores que se van almacenando
														var geometry = model.getGeometry(hijo); //se obtiene las dimensiones que debe tener el nodo
														var size = organigrama.getPreferredSizeForCell(hijo);// Actualiza las dimensiones del grafico por los nuevos hijos
														geometry.width = size.width;
														geometry.height = size.height;
														/* Adiciona los vertices entre los existentes, con su nodo padre real y el mismo
														 *tomando de manera automatica las propiedades del padre
														 **/
														var vertice = organigrama.insertEdge(padre, null, '', nodo, hijo);
														vertice.setId(id);  //se le inserta el identificador al vertice, no se le pasa por param porque lo transforma
														/*Configura el texto la posicion del texto del vertice en el lugar deseado*/
														vertice.geometry.x = 1;
														vertice.geometry.y = 0;
														vertice.geometry.offset = new mxPoint(0, -20);
														tieneHijos(responseData[i], hijo, all, false); //se comprueba que tiene hijos para annadirle los elementos restantes
												}
										}
								}
						});
				} finally {
						model.endUpdate();
				}
		}
		focoVentana();
};/**
 * Se encarga de obtener la cantidad de hijos que posee un nodo para la posterior adicion de los botones de adicion en caso
 * de tener alguno
 * @param hijo Es el nodo hijo que se encuentra en construccion
 * @param all
 * @param isPadre Valor logico que indica si el nodo es padre total (el primero) el cual no puede ser cerrado
 * @return retorna un valor logico verdadero en caso de tener hijos
 */
function tieneHijos(nodo, hijo, all, isPadre)
{
		/* se hace un llamado al metodo dameHijosPadre con el identificador del nodo para obtener la cantidad
		 * de hijos que posee
		 **/
		if (!nodo.leaf) {
				/*si la cantidad de hijos es mayor que 0*/
				construirOrganigrama(hijo, false, isPadre, nodo); //dibuja el nodo (no es hoja)
		} else {
				construirOrganigrama(hijo, true, isPadre, nodo);  //se contruye el nodo siendo hoja
		}
		focoVentana();
}
/**
 * Encargado de adicionar los nuevos nodos, asi como la inclusion de los
 * botones de adicion, eliminacion y expancion de cada nodo estructural
 * @param nodo Es el nodo que se desea adicionar al organigrama
 * @param hoja Valor logico que indica que el nodo en cuestion no tiene hijos
 * @param isPadre
 */
function construirOrganigrama(nodo, hoja, isPadre, datos)
{
		var dirImgEstado = ''
		switch (parseInt(datos.estado)) {
				case 1:
						dirImgEstado = '/metadatos/comun/recursos/iconos/organigrama/adicionado.png';
						break;
				case 2:
						dirImgEstado = '/metadatos/comun/recursos/iconos/organigrama/modificado.png';
						break;
				case 3:
						dirImgEstado = '/metadatos/comun/recursos/iconos/organigrama/eliminado.png';
						break;
		}
		if (dirImgEstado != '') {
				var overlay = new mxCellOverlay(new mxImage(dirImgEstado, 81, 68), 'Estado');  //crea el icono de estado
				overlay.cursor = 'hand';    //cursor de mano sobre el icono
				overlay.offset = new mxPoint(28, 26);    //posicion del icono
				overlay.align = mxConstants.ALIGN_LEFT;    //alienacion del icono
				overlay.verticalAlign = mxConstants.ALIGN_TOP;  //alineacion vertical del boton
				organigrama.addCellOverlay(nodo, overlay);  //annade el nuevo icono
		}
		if (!hoja) {
				/*si no es hoja, o sea que tiene hijos*/
				var overlay = new mxCellOverlay(new mxImage('/metadatos/comun/recursos/iconos/organigrama/add.png', 24, 24), 'Adicionar hijos');   //se crea el boton de +
				overlay.tooltip = 'Adicionar hijo';
				overlay.cursor = 'hand';    //cursor de mano sobre el boton
				//				overlay.offset = new mxPoint(-25, 0);   //posicion del boton
				overlay.offset = new mxPoint(0, 0);   //posicion del boton
				overlay.align = mxConstants.ALIGN_CENTER;   //alineacion
				overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt)
				{ //evento del boton
						addHijosNodo(nodo, false, true); //adiciona sus hijos inmediatos solamente
				}));
				organigrama.addCellOverlay(nodo, overlay); //annade el nuevo boton al nodo creado
		}
		///Esto es para eliminar nodo
		if (!isPadre) {
				/*si no es el primer nodo*/
				var overlay = new mxCellOverlay(new mxImage('/metadatos/comun/recursos/iconos/organigrama/close.png', 30, 30), 'Cerrar');  //crea el boton de cerrar
				overlay.cursor = 'hand';    //cursor de mano sobre el boton
				overlay.offset = new mxPoint(-4, 8);    //posicion del boton
				overlay.align = mxConstants.ALIGN_RIGHT;    //alienacion del boton
				overlay.verticalAlign = mxConstants.ALIGN_TOP;  //alineacion vertical del boton
				overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt)
				{  //evento del boton
						eliminarSubNodos(nodo);    //eliminar el nodo del organigrama
				}));
				organigrama.addCellOverlay(nodo, overlay);  //annade el nuevo boton
		}
		focoVentana();
};/**
 * Encargado de eliminar el nodo seleccionado a partir de sus vertices, asi como todos los subnodos asociados al mismo
 * @param nodo Es el nodo que se desea eliminar del organigrama
 */
function eliminarSubNodos(nodo)
{
		var cells = []; //arreglo que almacenara los vertices
		organigrama.traverse(nodo, true, function (vertex)
		{ //busca en los elementos del organigrama el vertice del nodo
				cells.push(vertex); //almacena el vertice del nodo encontrado
				return true;
		});
		organigrama.removeCells(cells); //elimina los vertices seleccionados
		focoVentana();
};/**
 * Encargado de ajustar el organigrama, a traves de la escala del mismo
 * @param tipo Especifica que boton accionado, si el zoom in, out o actual
 */
function zoomOrganigrama(tipo)
{
		if (organigrama) { //si ya existe
				switch (tipo) {
						case 'in':
								organigrama.zoomIn(); //acerca el organigrama
								break;
						case 'out':
								organigrama.zoomOut(); //aleja el organigrama
								break;
						case 'actual':
								organigrama.zoomActual(); //lo pone por defecto
								break;
				}
		}
		focoVentana();
}
/**
 * Se encarga de la creacion de una vista previa de impresion del organigrama creado, a partir de la cantidad de hojas
 * deseadas por el usuario
 */
function ventanaImprimir()
{
		var wOrganigrama = new Ext.Window({
				title      : 'Imprimir', modal: true, height: 150, width: 300, layout: 'fit', items: [{
						xtype   : 'form', id: 'formulario', monitorValid: true, labelAlign: 'top', frame: true, listeners: {
								'clientvalidation': function (_form, _valid)
								{
										if (_valid) {
												Ext.getCmp('aceptar').enable();
										} else {
												Ext.getCmp('aceptar').disable();
										}
								}
						}, items: [{
								xtype        : 'numberfield',
								fieldLabel   : 'Inserte la cantidad de páginas',
								id           : 'cantidad',
								prevTab      : 'aceptar',
								nextTab      : 'btnCancelar',
								vtype        : 'vtnumeroReales',
								value        : 1,
								maxLength    : 2,
								maxLengthText: 'El tamaño m&aacute;ximo requerido es de 2 d&iacute;gitos',
								allowBlank   : false,
								name         : 'cantidad',
								anchor       : '98%'
						}]
				}], buttons: [{
						text   : 'Cancelar',
						id     : 'btnCancelar',
						prevTab: 'cantidad',
						nextTab: 'aceptar',
						iconCls: 'Cancelar',
						tooltip: "Cerrar ventana sin guardar los datos",
						handler: function ()
						{
								wOrganigrama.destroy();
						}
				}, {
						text    : 'Aceptar',
						iconCls : 'aceptar',
						disabled: true,
						id      : 'aceptar',
						prevTab : 'btnCancelar',
						nextTab : 'cantidad',
						tooltip : "Guardar datos y cerrar ventana",
						handler : function ()
						{
								if (Ext.getCmp('formulario').getForm().isValid()) {
										/*se captura el valor de la escala del organigrama necesario para que se
										 *pueda visualizar completamente en la cantidad de paginas insertadas
										 **/
										var cantidad = Ext.getCmp('cantidad').getValue()
										var scale = mxUtils.getScaleForPageCount(cantidad, organigrama) - 0.1;
										/*se le resta un minimo valor a la escala para que no pegue tanto el organigrama a los bordes*/
										/**Se crea la ventana de la vista previa con el organigrama el el valor
										 * de la escala obtenido
										 **/
										var preview = new mxPrintPreview(organigrama, scale);
										preview.open(); //abre la ventana
										wOrganigrama.destroy();
								}
						}
				}]
		});
		return wOrganigrama
}
function imprimirOrganigrama()
{

		/* captura el numero de paginas insertadas por el usuario */
		var win = ventanaImprimir();
		win.show();
		focoVentana();
}
/**
 *La funcion se encarga de devolver la direccion del icono correspondiente
 * a los tipo de elementos recogidos de la base de datos
 * @param tipo Tipo de concepto asociado en la base de datos [1-7]
 * @return retorna la direccion del icono segun el concepto obtenido
 */
function buscarIconosTipo(tipo)
{
		var dir = ''; //almacena la direccion del icon.
		switch (tipo) {
				case '1':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/organo.png';
						break;
				case '2':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/agrupacion.png';
						break;
				case '3':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/entidad.png';
						break;
				case '4':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/organizacion.png';
						break;
				case '5':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/organo_interno.png';
						break;
				case '6':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/agrupacion_interna.png';
						break;
				case '7':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/cargo_civil.png';
						break;
				case '8':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/noformal.png';
						break;
				case '9':
						dir = 'image=/metadatos/comun/recursos/iconos/organigrama/medio.png';
						break;
		}
		focoVentana();
		return dir;
}
/**
 * Funcion que recoge el xml del organigrama y lo guarda en una archivo
 * fisico en la plataforma
 */
function salvarOrganigrama()
{
		var encoder = new mxCodec();
		var node = encoder.encode(organigrama.getModel());
		var xml = mxUtils.getPrettyXml(node);
		var formulario = new Ext.FormPanel({
				labelAlign   : 'top', frame: true, monitorValid: true, items: [{
						xtype     : 'textfield',
						fieldLabel: 'Nombre del organigrama',
						anchor    : '98%',
						maxLength : 100,
						nextTab   : 'btn_Cancel_saveOrganigrama',
						prevTab   : 'btn_Guargar_saveOrganigrama',
						allowBlank: false,
						vtype     : 'vtdenominaciones',
						id        : 'nameOrganigrama'
				}], listeners: {
						'clientvalidation': function (_form, _valid)
						{
								if (_valid) {
										Ext.getCmp('btn_Guargar_saveOrganigrama').enable();
										Ext.getCmp('btn_Cancel_saveOrganigrama').nextTab = 'btn_Guargar_saveOrganigrama';
										Ext.getCmp('nameOrganigrama').prevTab = 'btn_Guargar_saveOrganigrama';
								} else {
										Ext.getCmp('btn_Guargar_saveOrganigrama').disable();
										Ext.getCmp('btn_Cancel_saveOrganigrama').nextTab = 'nameOrganigrama';
										Ext.getCmp('nameOrganigrama').prevTab = 'btn_Cancel_saveOrganigrama';
								}
						}
				}
		});
		var winSalvar = new Ext.Window({
				title     : 'Guardar organigrama',
				id        : 'ventanaGuardar',
				modal     : true,
				layout    : 'fit',
				width     : 250,
				height    : 130,
				labelAlign: 'top',
				resizable : false,
				draggable : false,
				frame     : true,
				listeners : {
						destroy: function ()
						{
								focoVentana();
						}
				},
				items     : [formulario],
				buttons   : [{
						text   : 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						iconCls: 'cancelar',
						nextTab: 'btn_Guargar_saveOrganigrama',
						prevTab: 'nameOrganigrama',
						id     : 'btn_Cancel_saveOrganigrama',
						handler: function ()
						{
								winSalvar.destroy();
								focoVentana();
						}
				}, {
						text    : 'Guardar',
						id      : 'guardar',
						disabled: true,
						nextTab : 'nameOrganigrama',
						prevTab : 'btn_Cancel_saveOrganigrama',
						tooltip : 'Guardar datos del organigrama',
						iconCls : 'guardar',
						id      : 'btn_Guargar_saveOrganigrama',
						handler : function ()
						{
								if (formulario.getForm().isValid()) {
										var text = Ext.getCmp('nameOrganigrama').getValue();
										if (text != '') {
												Secodena.mostrarMascara('cargaini', "Por favor espere...", "Guardando datos del organigrama.");
												Ext.Ajax.request({
														url        : 'guardarOrganigrama', params: {
																xml: xml, nombre: text
														}, callback: function (options, success, response)
														{
																Secodena.ocultarMascara('cargaini');
																responseData = Ext.decode(response.responseText);
																var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
																var msg = responseData.mensaje;
																mostrarMensaje(codMsg, msg);
																if (codMsg == 1) {
																		winSalvar.destroy();
																		focoVentana();
																}
														}
												})
										}
								} else {
										mostrarMensaje(6, "Existen campos obligatorios vacíos o datos incorrectos.")
								}
						}
				}]
		})
		winSalvar.show();
		Ext.getCmp('nameOrganigrama').focus(false, 10);
}
/**
 * Funcion encargada de decodificar el xml recuperado y pintarlo
 * nuevamente en el organmigrama
 * @param xml
 */
function cargarOrganigrama(xml)
{
		/*organigrama.getModel().getCell(id)*/
		var doc = mxUtils.parseXml(xml);
		var codec = new mxCodec(doc);
		var cell = codec.decodeCell(doc.documentElement.childNodes[1]);
		var parent = organigrama.getDefaultParent();
		Secodena.mostrarMascara('carganodos', '', 'Recuperando datos del organigrama..');
		organigrama.model.beginUpdate();
		try {
				var nodos = cell.value.childNodes;
				var nodo = codec.decodeCell(nodos[2]);
				/*nodosCreados.push(*/
				pintarNodo(nodo, parent, true)/*)*/;
				var idNodos = [];
				for (var i = 4; i < nodos.length; i += 4) {
						var nodo = codec.decodeCell(nodos[i]);
						if (nodo.visible) {
								idNodos.push(nodo.id);
						}
				}
				Ext.Ajax.request({
						url        : 'buscarIdPadre', method: 'POST', params: {
								id: Ext.encode(idNodos)
						}, callback: function (options, success, response)
						{
								Secodena.ocultarMascara('carganodos');
								var responseData = Ext.decode(response.responseText);   //recibe el id del padre
								if (responseData) {
										for (var i = 4; i < nodos.length; i += 4) {
												var nodo = codec.decodeCell(nodos[i]);
												if (nodo.visible) {
														var nodoPadre = organigrama.getModel().getCell(responseData[nodo.id].idpadre);
														if (nodoPadre != undefined) {
																pintarNodo(nodo, nodoPadre, false);
														}
												}
										}
								}
						}
				});
		} finally {
				organigrama.model.endUpdate();
		}
		focoVentana();
}
/**
 * Funcion encargada de pintar los elementos del organigrama cargado
 * pasandole los datos correspondientes y su nodo padre
 * */
function pintarNodo(nodo, padre, esPadre)
{
		var text = nodo.value;  //se captura la denominacion del primer elemento del arreglo de seleccion
		var id = nodo.id;   //se captura el identificador del primer elemento
		var icon = nodo.style;  //se busca la direccion del icono de dicha estructura
		var w = organigrama.container.offsetWidth;  //se captura la dimension del contenedorOrganigrama del organigrama
		var nuevoNodo = null;
		if (esPadre) {
				/*se crea el nodo padre con el primer elemento y sus dimensiones por defecto*/
				nuevoNodo = organigrama.insertVertex(organigrama.getDefaultParent(), id, text, w / 2 - 30, 20, 140, 60, icon);
				nuevoNodo.setId(id);
				var model = organigrama.getModel();
				model.getGeometry(nuevoNodo);
				// Actualiza las dimensiones del grafico por el nuevo nodos
				organigrama.updateCellSize(nuevoNodo);
		} else {
				nuevoNodo = organigrama.insertVertex(organigrama.getDefaultParent(), id, text, null, null, null, null, icon);
				nuevoNodo.setId(id);
				var geometry = organigrama.getModel().getGeometry(nuevoNodo);
				var size = organigrama.getPreferredSizeForCell(nuevoNodo);
				geometry.width = size.width;
				geometry.height = size.height;
				var vertice = organigrama.insertEdge(organigrama.getDefaultParent(), id + 'v', '', padre, nuevoNodo);
				vertice.setId(id + 'v');
				vertice.geometry.x = 1;
				vertice.geometry.y = 0;
				vertice.geometry.offset = new mxPoint(0, -20);
		}
		construirOrganigrama(nuevoNodo, true, true, nodo);
		focoVentana();
		return nuevoNodo;
}
function focoVentana()
{
		ventanaOrganigrama.focus(false, 10);
}