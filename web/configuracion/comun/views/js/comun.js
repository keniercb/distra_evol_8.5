cargar_idioma_sistema = 'patrimonio';
//var cargar_idioma_sistema = 'es';

var ejercicio;
comun = function(config){
    var grid = config ;
    //typeof config=='object'? grid = config:grid = config.grid;
    return{
        QuitarColGrid:function(columns ){
            //grid = new Ext.grid.GridPanel()
            var cm = grid.colModel;
            //columns =[1,2,3];
            for(var i = 0;i<columns.length;i++){
                if(cm.config){
                    var colIndex = columns[i];
                    cm.setHidden(colIndex,true);
                }
            }
        }
    }
}

/**
 * configGrid - Función para configurar el column model de un grid
 *
 * @autor Alien Fernández Fuentes
 * @version 1.0
 * @param {Object}
 *            config GripPanel
 *
 * <code>
	  configGridDesgloseLote = new configGrid (gpRegDesgloseLote);
	  arrColumnasQuitar = [1,4,5];
	  arrColumnasMostrar = [2,3,8];
	  configGridListadoLote.modificarColumnModel(arrColumnasQuitar, arrColumnasMostrar);

	  arrColumnasEditar = [1,4,5];
	  arrColumnasDesabilitar = [2,3,8];
	  configGridListadoLote.modificarColumnModel(arrColumnasQuitar, arrColumnasMostrar);

 * </code>
 */

configGrid = function(config) {
    var grid = config;
    var colModel = grid.colModel;
    // Función para mostrar o esconder columnas de un grid
    this.modificarColumnModel = function(columnasQuitar, columnasMostrar) {
        if (colModel.config) {
            for (var i = 0; i < columnasQuitar.length; i++) {
                colModel.setHidden(columnasQuitar[i], true);
            }
            for (var i = 0; i < columnasMostrar.length; i++) {
                colModel.setHidden(columnasMostrar[i], false);
            }
        }
    }
    // Función para modificar los editores de un column model
    this.modificarEditores = function(arrColumnasEditar, arrColumnasDesabilitar) {
        if (colModel.config) {
            for (var i = 0; i < arrColumnasEditar.length; i++) {
                colModel.setEditable(arrColumnasEditar[i], true);
            }
            for (var i = 0; i < arrColumnasDesabilitar.length; i++) {
                colModel.setEditable(arrColumnasDesabilitar[i], false);
            }
        }
    }
}

/**
 * onLoadMask - Función para mostrar mascaras en la aplicación
 *
 * @autor Alien Fernández Fuentes
 * @param {String}
 *            message
 *
 * <code>
 onLoadMask ('Escribir mensaje');
 * </code>
 */
// Función para mostrar las mascaras de la aplicacion
onLoadMask = function(message) {
    message ? (lMask = new Ext.LoadMask(Ext.getBody(), {
        msg : message
    }), lMask.show()) : lMask.hide();
}

mostrarImagen = function(data) {
    if (data == 1)
        return "<img src='../../../../comun/views/images/yes.png' />";
    else if (data == 2)
        return "<img src='"+perfil.dirImg+"info.png'/>";
    else
        return "<img src='../../../../comun/views/images/no.png' />";
}
/**
 *
 * @autor David Hernandez
 */
fondoFilaSinUbicar = function(g){
    g.getView().getRowClass = function(record, index){
        return ((signo =='-' && record.data.sinubicar == 1) || (esDistribucionFactura && record.data.cantidad != record.data.cantidadordenada)) ? 'red-row' : '';
    };
}

/**
 *
 * @autor Javier González
 */
centerImagen = function(data) {
    if (data == 1)
        return '<img align="absmiddle" src="../../../../comun/views/images/yes.png" />';
    else
        return '<img align="absmiddle" src="../../../../comun/views/images/no.png" />';
}

// Función para seleccionar la primera fila de un grid
function SelPrimeraFilaGrid(gridpnl) {
    // if(gridp.rendered)
    gridpnl.getSelectionModel().selectFirstRow();
}
// ----------------------------------------

// Función para mostrar las mascaras de la aplicacion
onLoadMask = function (message){
    message ? (lMask = new Ext.LoadMask(Ext.getBody(),{
        msg:message
    }), lMask.show()) : lMask.hide();
}

cargarejercicio = function(){
    Ext.Ajax.request({
        url:'../../../../comun/index.php/comun/devolverejercicio',
        method:'post',
        callback:function(options,success,response)
        {
            ejercicio =	Ext.decode(response.responseText)	;
        }
    });

}
/**
 * convertirFormatoPrecio - Función para al cargar una columna de un grid
 * complete los 0
 *
 * @autor Alien Fernández Fuentes
 * @param {String}
 *            valor
 */
function convertirFormatoPrecio(valor) {
    if (valor) {
        // return '$'+val.toFixed(6);
        return valor.toFixed(6);
    } else
        return "0.000000";
}

/**
 * convertirFormatoImporte - Función para al cargar una columna de un grid
 * complete los 0
 *
 * @autor Alien Fernández Fuentes
 * @param {String}
 *            valor
 */
function convertirFormatoImporte(valor) {
    //alert('llll');
    if (valor) {
        // return '$'+val.toFixed(2);
        return valor.toFixed(2);
    } else
        return "0.00";
}

/**
 * @autor Javier Glez
 * Funcion que retorna la exprecion regular
 * @version 1.0
 */

function numeroComa(entero,centenas,decimas){
    if(centenas > 0 && decimas > 0)
        //return '/(^(([0-9]){1,' + entero +  '})$)|(^((([0-9]){1,' + centenas + '})(([.]){1})(([0-9]){1,' + decimas + '}))$)/';
        return eval('/(^(([0-9]){1,' + entero +  '})$)|(^((([0-9]){1,' + centenas + '})(([.]){1})(([0-9]){1,' + decimas + '}))$)/');
    else
        //return  '/(^(([0-9]){1,' + entero +  '})$)/';
        return  eval('/(^(([0-9]){1,' + entero +  '})$)/');
}

/**
 * @autor Javier Glez
 * @params float valor , int decimas a redondear
 * @version 1.0
 */
function redondeo(val,decimas){
    var fact = Math.pow(10, decimas);
    return Math.round(val * fact) / fact;
}

/**
 * @autor Javier Glez, Lester
 * @version 1.0
 * */
function validarFiltroCombo(st,cb,campo,texto){
    if(st.getCount() <= 0){
        cb.setRawValue(texto);
        cb.lastQuery = texto;
        //if(!st.isFiltered())
        st.filter(campo,texto);
    }
    else{
        texto = cb.lastQuery;
    }
    return texto;
}
/**
 * @autor Javier Glez
 * @version 1.0
 * */
function validarCantidadCaracteres(t,cantTDig,event,edit){
    var key = event.getCharCode();
    var flag = false;
    if(!t.hasListener('specialkey'))
        t.addListener('specialkey', function(){
            if(!event.TAB)
                event.stopEvent();
        });
    valueText = String(t.getValue());
    if (key == 32) {
        if (valueText.length == 0) {
            flag = true;
            event.stopEvent();
        }
    }
    if (flag == false) {
        if (valueText.length == cantTDig) {
			var selectionStart = document.getElementById(t.id).selectionStart;
			var selectionEnd = document.getElementById(t.id).selectionEnd;
			var textoSeleccionado = document.getElementById(t.id).value.substring(selectionStart, selectionEnd);
            if (key != 8 && key != 9 && textoSeleccionado.length == 0 && key != 39 && key != 37)
                event.stopEvent();
        }
    }
}

/**
 * @autor Javier Glez
 * @version 1.0
 * */
function validarExprecionesRegulares(tf,e,tipo){
    var exp = '';
    switch(tipo){
        case 1:{
            exp = /\b[a-zA-Z][a-zA-Z0-9]/;
            if(!exp.test(tf.container.dom.firstChild.value)){
                if(tf.container.dom.firstChild.value.length == 0){
                    if(e.getCharCode() >= 48 && e.getCharCode() <= 57){
                        e.stopEvent();
                    }
                }
            }
    }
}
}

function  getLimiteSegunResolucion(grid){
    var heightTotal  = grid.container.getBox().height;
    var limiteFilas  = Math.floor(heightTotal / 20) - 8;
    return limiteFilas;
}


/**
 * @author: Jorge Luis Cuellar Mondeja.
 * @class: Year 1.2.
 * @return: Un año. 15/04/2011
 */

// Función para mostrar las mascaras de la aplicacion
onLoadMask = function (message){
    message ? (lMask = new Ext.LoadMask(Ext.getBody(),{
        msg:message
    }), lMask.show()) : lMask.hide();
}

Ext.form.Year = Ext.extend(Ext.form.ComboBox, {
    triggerClass : "x-form-date-trigger",
    defaultAutoCreate : {
        tag : "input",
        type : "text",
        size : "10",
        autocomplete : "off"
    },
    constructor : function(parametros) {

        var myself = this;

        var fecha = new Date();
        var hoy = fecha.getFullYear();

        var textButton = (typeof(parametros.textButton) != 'undefined')
        ? parametros.textButton
        : 'Actual';

        var minimo = (typeof(parametros.minimo) != 'number')
        ? 1000
        : parametros.minimo + 15;
        var maximo = (typeof(parametros.maximo) != 'number')
        ? 99999
        : parametros.maximo;
        var anno = (typeof(parametros.anno) != 'number')
        ? hoy
        : parametros.anno;
        var titulo = (typeof(parametros.titulo) != 'undefined')
        ? parametros.titulo
        : 'A&ntilde;os';

        if (anno > maximo)
            anno = maximo;

        myself.botonAnnoActual = new Ext.Button({
            text : textButton,
            handler : function() {
                setCmpJLCMAnno(hoy);
            }
        });

        /**
		 * Asignacion de atributos al componente
		 */

        var combo = new Ext.form.ComboBox();

        for (var propiedades in combo) {
            if (propiedades != 'defaultAutoCreate'
                && propiedades != 'triggerClass'
                && propiedades != 'constructor')
                myself[propiedades] = combo[propiedades];
        }

        for (var propiedades in parametros) {

            if ('minimo' != propiedades && 'maximo' != propiedades
                && 'anno' != propiedades && 'titulo' != propiedades
                && 'textButton' != propiedades) {
            }
            myself[propiedades] = parametros[propiedades];
        }

        myself.store = new Ext.data.SimpleStore({
            fields : ['valor'],
            data : [[1]]
        });

        myself.listWidth = 140;
        myself.typeAhead = true;
        myself.mode = 'local';
        myself.forceSelection = true;
        myself.triggerAction = 'all';
        myself.emptyText = '';
        myself.selectOnFocus = true;
        myself.tpl = resultTpl(anno);
        myself.regex = /[0-9]/;
        myself.maskRe = /[0-9]/;
        myself.editable = false;
        myself.on({
            'expand' : function(componente) {

                var valor = myself.getValue();
                valor = (valor.length == 4) ? valor : anno - 1;

                if (document.getElementById('celda' + valor)) {
                    marcar(valor);
                } else {
                    document.getElementById('tableroJLCMfecha').innerHTML = moverFechas(valor);
                    marcar(valor);
                }

                myself.botonAnnoActual.render('button' + myself.id);

                function marcar(valor) {
                    if (valor.length == 4) {
                        for (var i = parseInt(anno) - 1; i >= parseInt(anno)
                            - 16; i--) {
                            document.getElementById('celda' + i).style.backgroundColor = 'white';
                            document.getElementById('celda' + i).style.borderColor = 'white';
                            document.getElementById('celda' + i).style.fontWeight = 'normal';
                        }
                        pintar();
                    } else
                        pintar();

                    function pintar() {
                        document.getElementById('celda' + valor).style.backgroundColor = '#D5E2F1';
                        document.getElementById('celda' + valor).style.borderColor = '#8DB2E3';
                        document.getElementById('celda' + valor).style.fontWeight = 'bold';
                    }
                }
            }
        });

        /**
		 * Funcionalidades del componente
		 */

        function moverFechas(panno) {

            panno = parseInt(panno) - 15;

            var str = '';
            for (var i = 0; i < 4; i++) {
                str += '<tr>';
                for (var j = 0; j < 4; j++) {
                    str += '<td id="celda'
                    + panno
                    + '"style="width: 30px; border-style: solid; border-width: 1px; border-color: white; background-color: white;" onmouseout="afueraJLCM(this)" onmousemove="arribaJLCM(this)"><div id="'
                    + panno + '" onClick="setCmpJLCMAnno(this.id);">';
                    str += panno;
                    str += '</div></td>';
                    panno++;
                }
                str += '</tr>';
            }
            anno = panno;
            return str;
        }

        function resultTpl(panno) {

            return new Ext.XTemplate(template());

            function template() {
                var str = '<tpl for=".">'
                + '<table cellspacing="0">'
                + '<tr height="25">'
                + '<td onClick="setPaginaJLCMatras('
                + anno
                + ')" class="x-date-left"><a href="#" title="">&#160;</a></td>'
                + '<td class="x-date-middle" align="center" style="font: normal 11px tahoma, arial, helvetica, sans-serif;">'
                + titulo
                + '</td>'
                + '<td onClick="setPaginaJLCMadelante('
                + anno
                + ')" class="x-date-right"><a href="#" title="">&#160;</a></td>'
                + '</tr>'
                + '</table>'
                + '<table cellspacing="2" id="tableroJLCMfecha" style="color: black;font: 11px arial,helvetica,tahoma,sans-serif; text-align: center; text-decoration: none; overflow: hidden; cursor: pointer;" height="80" cellspacing="3">'
                str += moverFechas(anno);
                str += '</table>'
                + '<table cellspacing="0" width="100%"><tr><td class="x-date-bottom">'
                + '<div align="center" id="button' + myself.id
                + '"></div>' + '</td></tr> </table>' + '</tpl>';

                return str;
            }
        }

        setCmpJLCMAnno = function(id) {
            myself.setValue(id);
            myself.collapse();
        };

        setPaginaJLCMadelante = function() {
            var newanno = parseInt(anno) + 15;

            if (parseInt(newanno) > parseInt(maximo)) {
                newanno = maximo;
            };

            document.getElementById('tableroJLCMfecha').innerHTML = moverFechas(newanno);
        }

        setPaginaJLCMatras = function() {
            var newanno = parseInt(anno) - 17;

            if (parseInt(newanno) < parseInt(minimo)) {
                newanno = minimo;
            };
            document.getElementById('tableroJLCMfecha').innerHTML = moverFechas(newanno);
        }

        arribaJLCM = function(componente) {
            componente.style.backgroundColor = '#D5E2F1';
        }

        afueraJLCM = function(componente) {

            var valor = myself.getValue();
            var valor = (valor.length > 0) ? valor : anno - 1;

            if (componente.id != 'celda' + valor) {
                componente.style.backgroundColor = 'white';
                componente.style.borderColor = 'white';
                componente.style.fontWeight = 'normal';
            }
        }

        return myself;
    }
});
