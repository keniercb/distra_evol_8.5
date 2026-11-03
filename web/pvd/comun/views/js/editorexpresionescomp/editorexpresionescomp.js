/**
 Uso:Componente gestionar formular o expresiones matematicas
 
 * ---------------------------------------------
 
 * 23 de Mayo de  2016  | Persona
 * 21 de Agosto de 2018 | Modificacion con mejoras de usabilidad
 *
 
 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Capital Humano - Ing. Yadir Martinez Vergara
 * @version 1.5.0
 */


Ext.ns('Ext.pvd.persona.formula');
Ext.QuickTips.init();
Ext.pvd.persona.formula.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    };
};
var utils = new Ext.pvd.persona.formula.Utils();
Ext.QuickTips.init();

/*Componente panelBuscarpersona*/
Ext.pvd.persona.formula.winEditorExpresiones = Ext.extend(Ext.Window, {
    layout: (this.layout ? this.layout : 'border'),
    idCmp: this.idCmp,
    width: (this.width ? this.width : 910),
    height: (this.height ? this.height : 600),
    closeAction: 'destroy',
    closable: true,
    modal: true,
    plain: false,
    idexpresionmatematica: (this.idexpresionmatematica ? this.idexpresionmatematica : -1),
    indicadores: (this.indicadores ? this.indicadores : []),
    agrupado: (this.agrupado ? this.agrupado : -1),
    campoagrupar: (this.campoagrupar ? this.campoagrupar : ''),
    mostrarFunciones: (this.mostrarFunciones ? this.mostrarFunciones : 1),
    operadoresMostrar: (this.operadoresMostrar ? this.operadoresMostrar : new Array()),
    mostrarCondicionales: (this.mostrarCondicionales ? this.mostrarCondicionales : -1),
    mostrarDenominacion: (this.mostrarDenominacion ? this.mostrarDenominacion : true),
    listeners: {
        show: function (v) { 
            this.stIndicadores.loadData(this.indicadores);
            if (this.idexpresionmatematica != -1) {
                Ext.Ajax.request({
                    url: '/pvd/comun/index.php/expresionmatematicacomp/cargarexpresionmatematica',
                    method: 'POST',
                    params: {
                        idexpresionmatematica: this.idexpresionmatematica
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        this.tfdenominacion.setValue(respuesta.denominacion);
                        if (respuesta.elementos.length > 0) {
                            var cantindFaltan = 0;
                            var vMostrar = null;
                            var valorMostrarInd = -1;
                            for (var i = 0; i < respuesta.elementos.length; i++) {
                                var elem = respuesta.elementos[i];
                                if (elem.tipoelemento != 6) {
                                    if (elem.elemento == '||')
                                        vMostrar = 'O';
                                    else if (elem.elemento == '&&')
                                        vMostrar = 'Y';
                                    else if (elem.elemento == '!=')
                                        vMostrar = '<>';
                                    else if (elem.elemento == 'IF_')
                                        vMostrar = 'SI';
                                    else if (elem.elemento == 'ENTONCES')
                                        vMostrar = 'ENTONCES';
                                    else if (elem.elemento == 'SINO')
                                        vMostrar = 'SINO';
                                    else if (elem.elemento == 'return')
                                        vMostrar = 'DEVOLVER';
                                    else
                                        vMostrar = elem.elemento;
                                    this.AdicionarElemento(elem.tipoelemento, elem.elemento, vMostrar);
                                } else {
                                    valorMostrarInd = this.buscarIndicador(elem.idindicador);
                                    if (valorMostrarInd != -1) {
                                        this.AdicionarElemento(elem.tipoelemento, elem.elemento, valorMostrarInd);
                                    } else {
                                        cantindFaltan++;
                                    }
                                }
                            }
                            if (cantindFaltan != 0) {
                                mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica a editar  contiene indicadores que no existen en los indicadores actuales.');
                            }
                            /*Para mostrar los tooltips de los indicadores*/
                            this.MostrarToolTip();
                        }
                    }.createDelegate(this)
                });
            }

        }
    },
    initComponent: function () {
        var _this = this;
        this.mascara = null;
        /*Arreglo que contiene los elementos de la expresion matemtica*/
        this.arrElementos = new Array();
        this.arrElementosMostrar = new Array();
        this.arrElementosMostrarConFormato = new Array();
        this.arrElementosCalcular = new Array();
        this.posicionInsertar = -1;
        this.adicionandoNumero = -1;

        /*Objeto que contine los elementos de una expreion matematica
         Tipos : 1 - Numero, 2 - Funcion, 3 - Operador, 4 - Parentesis abierto, 5 - Parentesis cerrado, 6 - Indicador
         7 - Condicionales, 8 - Llave abierta, 9 - Llave cerrada, 10 - Devolver, 
         */
        this.Elemento = function (ptipo, pvalor, pvalormostrar, pvalormostrarconformato, pidelemento) {
            this.idelemento = pidelemento;
            this.tipo = ptipo;
            this.valor = pvalor;
            this.valormostrar = pvalormostrar;
            this.valormostrarconformato = pvalormostrarconformato;
            this.setIdElemento = function (idelemento) {
                this.idelemento = idelemento;
            };
            this.cambiarValor = function (nuevoValor) {
                this.valor = nuevoValor;
            };
            this.cambiarValorMostrar = function (nuevoValorMostrar) {
                this.valormostrar = nuevoValorMostrar;
            };
            this.cambiarValorMostrarConFormato = function (nuevoValorMostrarConFormato) {
                this.valormostrarconformato = nuevoValorMostrarConFormato;
            };
        };


        /*****************************************************************************************************************************************************************************/

        this.camposStore = new Array();
        this.camposStore[0] = {name: 'idindicador'};
        this.camposStore[1] = {name: 'denominacion'};

        this.camposColumnas = new Array();
        this.camposColumnas[0] = new Ext.grid.RowNumberer();
        this.camposColumnas[1] = {header: 'Idindicador', dataIndex: 'idindicador', width: 100, hidden: true};
        this.camposColumnas[2] = {header: 'Denominaci&oacute;n', dataIndex: 'denominacion', width: 320, renderer: function (v) {
                return '<font color="800000">' + v + '</font>';
            }};

        this.stIndicadores = null;
        if (this.agrupado == 1) {
            this.camposStore[2] = {name: this.campoagrupar};
            this.camposColumnas[3] = {header: this.campoagrupar, dataIndex: this.campoagrupar, width: 100, hidden: true};

            this.stIndicadores = new Ext.data.GroupingStore({
                reader: new Ext.data.ArrayReader({}, this.camposStore),
                sortInfo: {field: 'denominacion', direction: "ASC"},
                groupField: this.campoagrupar
            });
        } else {
            this.stIndicadores = new Ext.data.Store({
                reader: new Ext.data.ArrayReader({}, this.camposStore),
                sortInfo: {field: 'denominacion', direction: "ASC"}
            });

        }

        /*GridPanel para los indicadores*/
        this.smIndicadores = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpIndicadores = null;
        if (this.agrupado == 1) {
            this.gpIndicadores = new Ext.grid.EditorGridPanel({
                title: 'Indicadores',
                store: this.stIndicadores, //le asignamos la fuente de datos
                region: 'west',
                width: 350,
                margins: '5 5 5 5',
                columns: this.camposColumnas,
                view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
                sm: this.smIndicadores,
                listeners: {
                    rowdblclick: function (Grid, rowIndex, e) {
                        var recIndicador = this.stIndicadores.getAt(rowIndex);
                        if (this.posicionInsertar == -1) {
                            this.AdicionarElemento(6, 'I' + recIndicador.data.idindicador, recIndicador.data.denominacion);
                        } else {
                            this.InsertarElemento(this.posicionInsertar, 6, 'I' + recIndicador.data.idindicador, recIndicador.data.denominacion);
                        }
                    }.createDelegate(this)
                }
            });
        } else {
            this.gpIndicadores = new Ext.grid.EditorGridPanel({
                title: 'Indicadores',
                store: this.stIndicadores, //le asignamos la fuente de datos
                region: 'west',
                width: 350,
                margins: '5 5 5 5',
                columns: this.camposColumnas,
                sm: this.smIndicadores,
                listeners: {
                    rowdblclick: function (Grid, rowIndex, e) {
                        var recIndicador = this.stIndicadores.getAt(rowIndex);
                        if (this.posicionInsertar == -1) {
                            this.AdicionarElemento(6, 'I' + recIndicador.data.idindicador, recIndicador.data.denominacion);
                        } else {
                            this.InsertarElemento(this.posicionInsertar, 6, 'I' + recIndicador.data.idindicador, recIndicador.data.denominacion);
                        }

                    }.createDelegate(this)
                }
            });
        }

        /******************************************************************************************************************************************************************************/
        this.tpl = new Ext.Template('<p style="body{margin:0;padding:3px;height:98%;cursor:link;}">{0}</p>');

        this.btnValidar = new Ext.Button({
            iconCls: 'validar',
            text: 'Validar',
            tooltip: 'Valida si la expresi&oacute;n esta sint&aacute;cticamente correcta(<b>Alt+V</b>)',
            handler: function () {
                this.mascara = new Ext.LoadMask(_this.body, {msg: "Validando expresión matemática..."})
                this.mascara.show();
                Ext.Ajax.request({
                    url: '/pvd/comun/index.php/expresionmatematicacomp/validarexpresionmatematica',
                    method: 'POST',
                    params: {
                        expresionacalcular: this.arrElementosCalcular.join(' '),
                        elementos: Ext.encode(this.arrElementos)
                    },
                    callback: function (options, success, response) {
                        this.mascara.hide();
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 1) {
                            mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica ha sido validada satifactoriamente.');
                        } else {
                            mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica contiene errores.');
                        }
                    }.createDelegate(this)
                });
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar el editor de expresiones(<b>Alt+L</b>)',
            handler: function () {
                this.LimpiarExpresion();
            }.createDelegate(this)
        });

        this.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad(<b>Alt+H</b>)',
            handler: function () {
                var title = 'Ayuda del editor de expresiones matem&aacute;ticas';
                var referencia = '';
                help.show(title, referencia);
            }
        });

        /*Panel contenedor del area de edicion de la formula*/
        this.taExpresionformula = new Ext.Panel({
            region: 'north',
            layout: 'fit',
            height: 300,
            autoScroll: true,
            title: 'Expresi&oacute;n matem&aacute;tica',
            tbar: [this.btnValidar, this.btnLimpiar, '->', this.btnAyuda],
            bodyStyle: 'body{margin:0;padding:3px;height:98%;cursor:link;}'
        });

        this.MostrarToolTip = function () {
            /*Para mostrar los tooltips de los indicadores*/
            for (var i = 0; i < this.arrElementos.length; i++) {
                if (this.arrElementos[i].tipo == 6) {
                    this.ToolTipMostrarDetalles(6, this.arrElementos[i].idelemento, this.arrElementos[i].valormostrar);
                }
            }
            Ext.QuickTips.init();
        }

        window.SeleccionarIndicador = function (idindicador) {
            var pos = this.stIndicadores.find('idindicador', idindicador);
            if (pos != -1)
                this.gpIndicadores.getSelectionModel().selectRow(pos);
        }.createDelegate(this);

        window.CambiarElemento = function (pidelemento) {
            this.posicionInsertar = window.EliminarElemento(pidelemento);
            this.adicionandoNumero = -1;
            //Para actualizar la expresion matematica
            this.MostrarExpresionMatematica();
        }.createDelegate(this);

        window.InsertarDelante = function (pidelemento) {
            this.posicionInsertar = -1;
            if (pidelemento) {
                for (var i = 0; i < this.arrElementos.length; i++) {
                    if (this.arrElementos[i].idelemento == pidelemento) {
                        this.posicionInsertar = i;
                        this.adicionandoNumero = -1;
                        break;
                    }
                }
            }
        }.createDelegate(this);

        //Funcion que elimina el elemento indicado de la expresion matematica
        window.EliminarElemento = function (idelemento) {
            var posicion = -1;
            if (idelemento) {
                for (var i = 0; i < this.arrElementos.length; i++) {
                    if (this.arrElementos[i].idelemento == idelemento) {
                        this.arrElementos.splice(i, 1);
                        this.arrElementosMostrar.splice(i, 1);
                        this.arrElementosMostrarConFormato.splice(i, 1);
                        this.arrElementosCalcular.splice(i, 1);
                        posicion = i;
                        break;
                    }
                }
                //Para actualizar la expresion matematica
                this.MostrarExpresionMatematica();

                //Para mostrar los tooltips de los indicadores
                this.MostrarToolTip();
                return posicion;
            }
        }.createDelegate(this);

        this.menuFormula = new Ext.menu.Menu({
            id: 'menuFormula',
            items: [
                {
                    text: 'Cambiar',
                    handler: function () {
                        window.CambiarElemento(this.idelementoMenu);
                    }.createDelegate(this)
                },
                {
                    text: 'Eliminar',
                    handler: function () {
                        window.EliminarElemento(this.idelementoMenu);
                    }.createDelegate(this)
                },
                {
                    text: 'Insertar',
                    handler: function () {
                        window.InsertarDelante(this.idelementoMenu);
                    }.createDelegate(this)
                }]
        });

        this.idelementoMenu = null;

        window.MostrarMenu = function (pidelemento) {
            var el = Ext.get(pidelemento);
            this.idelementoMenu = pidelemento;
            this.menuFormula.show(el);
        }.createDelegate(this);

//<font color="800000">' + valormostrar + '</font>


        this.FormatearValorMostrar = function (tipo, valormostrar, idelemento, idindicador) {
            var t = parseInt(tipo);
            switch (t) {
                case 1:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                            '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');><font color="0000FF">' + valormostrar + '</font><a/>';
                    break;
                }
                case 2:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                            '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 3:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                            '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 4:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                            '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 5:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                            '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 6:
                {
                    return '<a id="' + idelemento
                            + '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 7:
                {
                    return '</br><a id="' + idelemento
                            + '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');><b>' + valormostrar + '</b><a/></br>';
                    break;
                }
                case 8:
                {
                    return '<a id="' + idelemento
                            + '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '</a></br>';
                    break;
                }
                case 9:
                {
                    return '</br><a id="' + idelemento
                            + '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '</a>';
                    break;
                }
                case 10:
                {
                    return '<a id="' + idelemento
                            + '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '</a>';
                    break;
                }
                case 11:
                {
                    return '<a id="' + idelemento
                            + '" href=# onClick=window.MostrarMenu(\'' + idelemento + '\');>' + valormostrar + '</a>';
                    break;
                }
                default:
                {
                    return valormostrar;
                }
            }
        };

        //Numeros
        this.btnuno = new Ext.Button({text: '<font color="0000FF">1</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '1', '1');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '1', '1');
                }
            }.createDelegate(this)});
        this.btndos = new Ext.Button({text: '<font color="0000FF">2</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '2', '2');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '2', '2');
                }
            }.createDelegate(this)});
        this.btntres = new Ext.Button({text: '<font color="0000FF">3</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '3', '3');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '3', '3');
                }
            }.createDelegate(this)});
        this.btncuatro = new Ext.Button({text: '<font color="0000FF">4</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '4', '4');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '4', '4');
                }
            }.createDelegate(this)});
        this.btncinco = new Ext.Button({text: '<font color="0000FF">5</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '5', '5');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '5', '5');
                }
            }.createDelegate(this)});
        this.btnseis = new Ext.Button({text: '<font color="0000FF">6</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '6', '6');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '6', '6');
                }
            }.createDelegate(this)});
        this.btnsiete = new Ext.Button({text: '<font color="0000FF">7</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '7', '7');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '7', '7');
                }
            }.createDelegate(this)});
        this.btnocho = new Ext.Button({text: '<font color="0000FF">8</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '8', '8');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '8', '8');
                }
            }.createDelegate(this)});
        this.btnnueve = new Ext.Button({text: '<font color="0000FF">9</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '9', '9');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '9', '9');
                }
            }.createDelegate(this)});
        this.btncero = new Ext.Button({text: '<font color="0000FF">0</font>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '0', '0');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '0', '0');
                }
            }.createDelegate(this)});
        this.btnpunto = new Ext.Button({text: '<b>.</b>', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(1, '.', '.');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 1, '.', '.');
                }
            }.createDelegate(this)});
        this.btnborrarnumero = new Ext.Button({text: '<b>L</b>', tooltip: 'Retroceder', width: 35, height: 30, handler: function () {
                this.ExtraerElemento();
            }.createDelegate(this)});

        //Operadores
        this.btnsuma = new Ext.Button({text: '+', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '+', '+');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '+', '+');
                }
            }.createDelegate(this)});
        this.btnresta = new Ext.Button({text: '-', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '-', '-');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '-', '-');
                }
            }.createDelegate(this)});
        this.btnmayor = new Ext.Button({text: '>', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '>', '>');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '>', '>');
                }
            }.createDelegate(this)});
        this.btnmayorigual = new Ext.Button({text: '>=', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '>=', '>=');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '>=', '>=');
                }
            }.createDelegate(this)});
        this.btnproducto = new Ext.Button({text: '*', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '*', '*');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '*', '*');
                }
            }.createDelegate(this)});
        this.btndivision = new Ext.Button({text: '/', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '/', '/');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '/', '/');
                }
            }.createDelegate(this)});
        this.btnmenor = new Ext.Button({text: '<', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '<', '<');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '<', '<');
                }
            }.createDelegate(this)});
        this.btnmenorigual = new Ext.Button({text: '<=', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '<=', '<=');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '<=', '<=');
                }
            }.createDelegate(this)});
        this.btnigual = new Ext.Button({text: '==', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '==', '==');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '==', '==');
                }
            }.createDelegate(this)});
        this.btni = new Ext.Button({text: 'Y', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '&&', 'Y');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '&&', 'Y');
                }
            }.createDelegate(this)});
        this.btno = new Ext.Button({text: 'O', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '||', 'O');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '||', 'O');
                }
            }.createDelegate(this)});
        this.btndistinto = new Ext.Button({text: '<>', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(3, '!=', '<>');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 3, '!=', '<>');
                }
            }.createDelegate(this)});
        this.btnpa = new Ext.Button({text: '(.', width: 35, height: 30, hidden: true, bodyStyle: 'padding: 3px 3px 3px 3px', handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(4, '(', '(');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 4, '(', '(');
                }
            }.createDelegate(this)});
        this.btnpc = new Ext.Button({text: '.)', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(5, ')', ')');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 5, ')', ')');
                }
            }.createDelegate(this)});

        this.btnfsuma = new Ext.Button({text: 'S', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.SumaryPromediarIndicadores(1);
                } else {
                    mostrarMensaje(3, 'No se puede aplicar la sumatoria.');
                }
                
            }.createDelegate(this)
        });
        this.btnfpromedio = new Ext.Button({text: 'P', width: 35, height: 30, hidden: true, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.SumaryPromediarIndicadores(2);
                } else {
                    mostrarMensaje(3, 'No se puede aplicar el promedio.');
                }
            }.createDelegate(this)
        });

        /*Condicionales*/
        this.btnsi = new Ext.Button({text: 'SI', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(7, 'SI_', 'SI');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 7, 'SI_', 'SI');
                }
            }.createDelegate(this)
        });
        this.btnentonces = new Ext.Button({text: 'ENTONCES', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(7, 'ENTONCES', 'ENTONCES');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 7, 'ENTONCES', 'ENTONCES');
                }
            }.createDelegate(this)
        });
        this.btnsino = new Ext.Button({text: 'SINO', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(7, 'SINO', 'SINO');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 7, 'SINO', 'SINO');
                }
            }.createDelegate(this)
        });
        this.btnlla = new Ext.Button({text: '{', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(8, '{', '{');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 8, '{', '{');
                }
            }.createDelegate(this)
        });
        this.btnllc = new Ext.Button({text: '}', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(9, '}', '}');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 9, '}', '}');
                }
            }.createDelegate(this)
        });
        this.btndevolver = new Ext.Button({text: 'DEVOLVER', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(10, 'DEVOLVER', 'DEVOLVER');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 10, 'DEVOLVER', 'DEVOLVER');
                }
            }.createDelegate(this)
        });
        this.btncoma = new Ext.Button({text: ';', width: 35, height: 30, handler: function () {
                if (this.posicionInsertar == -1) {
                    this.AdicionarElemento(11, ';', ';');
                } else {
                    this.InsertarElemento(this.posicionInsertar, 11, ';', ';');
                }
            }.createDelegate(this)
        });

        /*Funcion que muestra la interfaz para sumar indicadores*/
        this.SumaryPromediarIndicadores = function (essuma) {
            var stsumaIndicadores = new Ext.data.SimpleStore({
                fields: [
                    {name: 'idindicador'},
                    {name: 'denominacion'}
                ]
            });
            stsumaIndicadores.loadData(this.indicadores);

            var smsumaIndicadores = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            });
            var gpsumaIndicadores = new Ext.grid.EditorGridPanel({
                store: stsumaIndicadores, //le asignamos la fuente de datos
                region: 'west',
                width: 300,
                layout: 'fit',
                columns: [
                    smsumaIndicadores,
                    {header: 'Idindicador', dataIndex: 'idindicador', width: 100, hidden: true},
                    {header: 'Denominaci&oacute;n', dataIndex: 'denominacion', width: 300}
                ],
                sm: smsumaIndicadores
            });

            var winsumaIndicadores = new Ext.Window({
                title: (essuma == 1 ? 'Sumar indicadores' : 'Promediar indicadores'),
                layout: 'fit',
                width: 350,
                height: 300,
                closeAction: 'destroy',
                closable: true,
                plain: false,
                modal: true,
                items: [gpsumaIndicadores],
                buttons: [{iconCls: 'cancelar',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winsumaIndicadores.close();
                        }
                    }, {iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: 'Aceptar',
                        handler: function () {
                            var arregloInd = smsumaIndicadores.getSelections();
                            if (arregloInd.length > 1) {
                                this.AdicionarElemento(4, '(', '(');
                                for (var i = 0; i < arregloInd.length; i++) {
                                    if (i == (arregloInd.length - 1))
                                        this.AdicionarElemento(6, 'I' + arregloInd[i].data.idindicador, arregloInd[i].data.denominacion);
                                    else {
                                        this.AdicionarElemento(6, 'I' + arregloInd[i].data.idindicador, arregloInd[i].data.denominacion);
                                        this.AdicionarElemento(3, '+', '+');
                                    }
                                }
                                this.AdicionarElemento(5, ')', ')');
                                if (essuma != 1) {
                                    this.AdicionarElemento(3, '/', '/');
                                    this.AdicionarElemento(1, arregloInd.length, arregloInd.length);
                                }
                                winsumaIndicadores.close();
                            } else
                                mostrarMensaje(1, 'Debe seleccionar m&aacute;s de 1 indicador.');

                        }.createDelegate(this)
                    }
                ]
            });
            winsumaIndicadores.show();

        };


        //Funciones
        this.reccbFunciones = [{name: 'idfuncion'}, {name: 'denom'}, {name: 'descripcion'}];
        this.datoscbFunciones = [[1, 'Todas', 'Todas'],
            [2, 'Exponenciales', 'Exponenciales'],
            [3, 'Trigonometricas', 'Trigonometricas'],
            [4, 'Otras', 'Otras']];
        this.stcbFunciones = new Ext.data.SimpleStore({
            fields: this.reccbFunciones
        });

        this.cbFunciones = new Ext.form.ComboBox({
            id: 'cbFunciones',
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{denom}</div></tpl>',
            store: this.stcbFunciones,
            displayField: 'denom',
            hiddenName: 'idfuncion',
            valueField: 'idfuncion',
            triggerAction: 'all',
            mode: 'local',
            typeAhead: true,
            forceSelection: true,
            editable: false,
            allowBlank: true,
            selectOnFocus: true,
            anchor: '90%',
            msgTarget: 'qtip',
            listeners: {
                select: function (combo, record, index) {
                    if (record.get('idfuncion') == 1)
                        this.stgridFunciones.filter('todas', '1');
                    else
                        this.stgridFunciones.filter('idfuncion', record.get('idfuncion'));
                }.createDelegate(this)
            }
        });
        this.stcbFunciones.loadData(this.datoscbFunciones);
        this.cbFunciones.setValue(1);

        this.arrFunciones = [
            [3, 'sin', '', 1, 1, 1],
            [3, 'asin', '', 2, 1, 1],
            [3, 'asinh', '', 3, 1, 1],
            [3, 'cos', '', 4, 1, 1],
            [3, 'acos', '', 5, 1, 1],
            [3, 'acosh', '', 6, 1, 1],
            [3, 'tan', '', 7, 1, 1],
            [3, 'atan', '', 8, 1, 1],
            [3, 'atanh', '', 9, 1, 1],
            [4, 'ceil', '', 10, 1, 1],
            [2, 'exp', '', 11, 1, 1],
            [4, 'floor', '', 12, 1, 1],
            [2, 'log', '', 13, 1, 2],
            [2, 'pow', '', 14, 1, 2],
            [4, 'sqrt', '', 15, 1, 1]
        ];
        this.recgridFunciones = [{name: 'idfuncion'}, {name: 'denom'}, {name: 'descripcion'}, {name: 'id'}, {name: 'todas'}, {name: 'cantidadparametros'}];

        this.stgridFunciones = new Ext.data.SimpleStore({
            fields: this.recgridFunciones
        });
        this.stgridFunciones.loadData(this.arrFunciones, true);
        this.smgridFunciones = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indice, record) {

                }
            }
        });
        //Grid panel funciones
        this.gpgridFunciones = new Ext.grid.GridPanel({
            id: 'gpgridFunciones',
            store: this.stgridFunciones,
            frame: false,
            borders: false,
            autoScroll: true,
            iconCls: 'icon-grid',
            hideHeaders: true,
            height: 65,
            width: '100%',
            sm: this.smgridFunciones,
            columns: [
                {width: 50, hidden: true, dataIndex: 'idfuncion'},
                {header: '', width: 140, dataIndex: 'denom'}
            ]
        });

        this.panelFunciones = (this.mostrarFunciones == 1 ?
                {layout: 'form', columnWidth: 0.31, border: true, xtype: 'fieldset', title: 'Funciones', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
                    defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
                    items: [
                        {layout: 'table', border: false, layoutConfig: {columns: 1},
                            items: [{items: this.cbFunciones}, {items: this.gpgridFunciones}]
                        }
                    ]
                } : {layout: 'form', columnWidth: 0.04, border: false, items: [{html: '&nbsp;', border: false, frame: false}]});

        this.devolverBtnOperador = function (texto) {
            switch (texto) {
                case '+':
                {
                    return this.btnsuma;
                    break;
                }
                case '-':
                {
                    return this.btnresta;
                    break;
                }
                case '*':
                {
                    return this.btnproducto;
                    break;
                }
                case '/':
                {
                    return this.btndivision;
                    break;
                }
                case 'pa':
                {
                    return this.btnpa;
                    break;
                }
                case 'pc':
                {
                    return this.btnpc;
                    break;
                }
                case 's':
                {
                    return this.btnfsuma;
                    break;
                }
                case 'p':
                {
                    return this.btnfpromedio;
                    break;
                }
                case '<':
                {
                    return this.btnmenor;
                    break;
                }
                case '<=':
                {
                    return this.btnmenorigual;
                    break;
                }
                case '>':
                {
                    return this.btnmayor;
                    break;
                }
                case '>=':
                {
                    return this.btnmayorigual;
                    break;
                }
                case '=':
                {
                    return this.btnigual;
                    break;
                }
                case '<>':
                {
                    return this.btndistinto;
                    break;
                }
                case 'y':
                {
                    return this.btni;
                    break;
                }
                case 'o':
                {
                    return this.btno;
                    break;
                }
            }
            return null;
        }.createDelegate(this);

        this.activarTodosbtn = function () {
            this.btnfpromedio.show();
            this.btnfsuma.show();
            this.btnpc.show();
            this.btnpa.show();
            this.btndivision.show();
            this.btnproducto.show();
            this.btnresta.show();
            this.btnsuma.show();
            this.btnmenor.show();
            this.btnmenorigual.show();
            this.btnmayor.show();
            this.btnmayorigual.show();
            this.btnigual.show();
            this.btndistinto.show();
            this.btni.show();
            this.btno.show();
        }.createDelegate(this);

        this.col1Operador = new Array();
        this.col2Operador = new Array();
        this.col3Operador = new Array();
        this.col4Operador = new Array();

        if (this.operadoresMostrar.length > 0) {
            var cantidadXcol = parseInt(Math.floor(this.operadoresMostrar.length / 4));
            var resto = (this.operadoresMostrar.length % 4);

            for (var i = 0; i < this.operadoresMostrar.length; i++) {
                var btn = this.devolverBtnOperador(this.operadoresMostrar[i]);
                if (btn) {
                    btn.show();
                }
            }
        } else {
            this.activarTodosbtn();
        }

        this.panelOperadores = {layout: 'border', columnWidth: 0.31, border: true, xtype: 'fieldset', title: 'Operadores', style: '-moz-border-radius:5px', height: 125, width: 150,
            items: [
                {layout: 'column', border: false, region: 'center', defaults: {bodyStyle: 'padding: 3px 3px 3px 3px'},
                    items: [
                        {layout: 'form', columnWidth: 0.24, border: false, items: [this.btndivision, this.btnpa, this.btnigual, this.btnmayorigual]},
                        {layout: 'form', columnWidth: 0.01, border: false, items: [{html: '&nbsp;', border: false, frame: false}]},
                        {layout: 'form', columnWidth: 0.24, border: false, items: [this.btnproducto, this.btnpc, this.btndistinto, this.btnmenorigual]},
                        {layout: 'form', columnWidth: 0.01, border: false, items: [{html: '&nbsp;', border: false, frame: false}]},
                        {layout: 'form', columnWidth: 0.24, border: false, items: [this.btnresta, this.btnfsuma, this.btnmayor, this.btni]},
                        {layout: 'form', columnWidth: 0.01, border: false, items: [{html: '&nbsp;', border: false, frame: false}]},
                        {layout: 'form', columnWidth: 0.24, border: false, items: [this.btnsuma, this.btnfpromedio, this.btnmenor, this.btno]}
                    ]
                }
            ]
        };

        this.panelCondicionales = (this.mostrarCondicionales == 1 ?
                {layout: 'border', columnWidth: 0.31, border: true, xtype: 'fieldset', title: 'Condicionales', style: '-moz-border-radius:5px', height: 190, width: 60,
                    items: [
                        {layout: 'column', border: false, region: 'center', defaults: {bodyStyle: 'padding: 3px 3px 3px 3px'},
                            items: [{layout: 'form', columnWidth: 0.99, border: false, items: [this.btnsi, this.btnentonces, this.btnsino, this.btnlla, this.btnllc, this.btndevolver, this.btncoma]}]
                        }
                    ]
                }
        : {layout: 'form', columnWidth: 0.04, border: false, items: [{html: '&nbsp;', border: false, frame: false}]});



        /*Panel contenedor de los operadores y operandos*/
        this.pOperadores = new Ext.FormPanel({
            region: 'center',
            margins: '5 0 0 0',
            layout: 'fit',
            title: 'Operadores',
            frame: true,
            autoScroll: true,
            items: [
                {layout: 'column', border: false,
                    items: [
                        {layout: 'form', columnWidth: 0.25, border: true, xtype: 'fieldset', title: 'N&uacute;meros', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
                            defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
                            items: [{layout: 'table', border: false, layoutConfig: {columns: 3, bodyStyle: 'padding: 5px 5px 5px 5px'},
                                    items: [{items: this.btnuno}, {items: this.btndos}, {items: this.btntres}, {items: this.btncuatro},
                                        {items: this.btncinco}, {items: this.btnseis}, {items: this.btnsiete}, {items: this.btnocho},
                                        {items: this.btnnueve}, {items: this.btnpunto}, {items: this.btncero}, {items: this.btnborrarnumero}
                                    ]
                                }
                            ]
                        }, //fin de Numeros
                        {layout: 'form', columnWidth: 0.04, border: false, items: [{html: '&nbsp;', border: false, frame: false}]},
                        this.panelOperadores, //fin de Operadores
                        {layout: 'form', columnWidth: 0.04, border: false, items: [{html: '&nbsp;', border: false, frame: false}]},
                        this.panelFunciones,
                        {layout: 'form', columnWidth: 0.04, border: false, items: [{html: '&nbsp;', border: false, frame: false}]},
                        this.panelCondicionales
                    ]
                }
            ]
        });

        /*Panel contenedor del area de edicion de la formula y los operadores y operandos*/
        this.pContenedor = new Ext.Panel({
            region: 'center',
            margins: '5 5 5 0',
            layout: 'border',
            border: false,
            items: [this.taExpresionformula, this.pOperadores]
        });

        this.tfdenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            regex: /(^([a-zA-ZáéíóúñüÑ ])+([a-zA-ZáéíóúñüÑ\d]*))$/,
            anchor: '99%',
            allowBlank: (!this.mostrarDenominacion),
            hidden: (!this.mostrarDenominacion),
            blankText: 'Este campo es obligatorio.'
        });

        this.fpDenominacion = new Ext.FormPanel({
            frame: true,
            region: 'north',
            layout: 'form',
            hidden: (!this.mostrarDenominacion),
            height: 40,
            margins: '5 5 0 5',
            items: [this.tfdenominacion]
        });


        /******************************************************************************************************************************************************************************/

        this.ToolTipMostrarDetalles = function (tipo, idelem, valormostrar) {
            var tt = parseInt(tipo);
            if (tipo === 6) {
                var tt = new Ext.ToolTip({
                    target: idelem,
                    html: valormostrar,
                    title: 'Indicador o variable',
                    autoHide: true,
                    trackMouse: true
                });
            }
        };

        /*Funcion que muestra la exresion de la formula en el area de edicion*/
        this.MostrarExpresionMatematica = function () {
            var v = new Array();
            v[0] = this.arrElementosMostrarConFormato.join(' ');
            this.taExpresionformula.body.update('');
            this.tpl.overwrite(this.taExpresionformula.body, v);
        }.createDelegate(this);

        this.tmpCantIdElemento = 0;
        /*Funcion que adiciona un elemento en la exresion de la formula*/
        this.AdicionarElemento = function (tipo, valor, valormostrar) {
            var nuevoElemento = null;
            var idindicador = null;
            if (tipo === 6) {
                idindicador = valor.substr(1);
            }
            var idelemento = 'Elemento-' + this.tmpCantIdElemento++;
            if (this.arrElementos.length > 0) {
                if (tipo == 1) {
                    if (this.arrElementos[this.arrElementos.length - 1].tipo == 1) {
                        this.arrElementos[this.arrElementos.length - 1].setIdElemento(idelemento);
                        this.arrElementos[this.arrElementos.length - 1].cambiarValor(this.arrElementos[this.arrElementos.length - 1].valor + valor);
                        this.arrElementos[this.arrElementos.length - 1].cambiarValorMostrar(this.arrElementos[this.arrElementos.length - 1].valormostrar + valormostrar);
                        this.arrElementos[this.arrElementos.length - 1].cambiarValorMostrarConFormato(this.FormatearValorMostrar(tipo, this.arrElementos[this.arrElementos.length - 1].valormostrar, idelemento, idindicador));
                        this.arrElementosMostrar[this.arrElementosMostrar.length - 1] = this.arrElementos[this.arrElementos.length - 1].valormostrar;
                        this.arrElementosMostrarConFormato[this.arrElementosMostrarConFormato.length - 1] = this.arrElementos[this.arrElementos.length - 1].valormostrarconformato;
                        this.arrElementosCalcular[this.arrElementosCalcular.length - 1] = this.arrElementos[this.arrElementos.length - 1].valor;

                    } else {
                        nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                    }
                } else {
                    nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                }

                if (this.arrElementos[this.arrElementos.length - 1].tipo == 1 && tipo == 1) {
                } else {
                    this.arrElementos.push(nuevoElemento);
                    this.arrElementosMostrar.push(valormostrar);
                    this.arrElementosMostrarConFormato.push(this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                    this.arrElementosCalcular.push(valor);
                }
            } else {
                nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                this.arrElementos.push(nuevoElemento);
                this.arrElementosMostrar.push(valormostrar);
                this.arrElementosMostrarConFormato.push(this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                this.arrElementosCalcular.push(valor);
            }
            this.MostrarExpresionMatematica();

            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();

        }.createDelegate(this);

        /*Funcion que adiciona un elemento en la exresion de la formula*/
        this.InsertarElemento = function (posicion, tipo, valor, valormostrar) {
            var nuevoElemento = null;
            var idindicador = null;
            if (tipo === 6) {
                idindicador = valor.substr(1);
            }

            if (posicion >= this.arrElementos.length - 1) {
                this.posicionInsertar = -1;
                this.AdicionarElemento(tipo, valor, valormostrar);
                return;
            }

            var idelemento = 'Elemento-' + this.tmpCantIdElemento++;
            if (this.arrElementos.length > 0) {
                /*console.log(posicion);
                 console.log(this.arrElementos[posicion]);
                 console.log(this.arrElementos);*/
                if (tipo == 1) {
                    this.adicionandoNumero = 1;
                    if (this.arrElementos[posicion].tipo == 1) {
                        //this.arrElementos[posicion].setIdElemento(idelemento);
                        this.arrElementos[posicion].cambiarValor(this.arrElementos[posicion].valor + valor);
                        this.arrElementos[posicion].cambiarValorMostrar(this.arrElementos[posicion].valormostrar + valormostrar);
                        this.arrElementos[posicion].cambiarValorMostrarConFormato(this.FormatearValorMostrar(tipo, this.arrElementos[posicion].valormostrar, this.arrElementos[posicion].idelemento, idindicador));
                        this.arrElementosMostrar[posicion] = this.arrElementos[posicion].valormostrar;
                        this.arrElementosMostrarConFormato[posicion] = this.arrElementos[posicion].valormostrarconformato;
                        this.arrElementosCalcular[posicion] = this.arrElementos[posicion].valor;

                    } else {
                        nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                    }
                } else {
                    if (this.adicionandoNumero == 1) {
                        this.adicionandoNumero = -1;
                        this.posicionInsertar = -1;
                        this.AdicionarElemento(tipo, valor, valormostrar);
                        return;
                    } else {
                        nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                    }
                }

                if (this.arrElementos[posicion].tipo == 1 && tipo == 1) {

                } else if (tipo == 1) {
                    this.arrElementos.splice(posicion, 0, nuevoElemento);
                    this.arrElementosMostrar.splice(posicion, 0, valormostrar);
                    this.arrElementosMostrarConFormato.splice(posicion, 0, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                    this.arrElementosCalcular.splice(posicion, 0, valor);
                } else {
                    this.arrElementos.splice(posicion, 0, nuevoElemento);
                    this.arrElementosMostrar.splice(posicion, 0, valormostrar);
                    this.arrElementosMostrarConFormato.splice(posicion, 0, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                    this.arrElementosCalcular.splice(posicion, 0, valor);
                    this.posicionInsertar = -1;
                }
            } else {
                nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                this.arrElementos.splice(posicion, 0, nuevoElemento);
                this.arrElementosMostrar.splice(posicion, 0, valormostrar);
                this.arrElementosMostrarConFormato.splice(posicion, 0, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                this.arrElementosCalcular.splice(posicion, 0, valor);
                this.posicionInsertar = -1;
            }
            this.MostrarExpresionMatematica();

            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();

        }.createDelegate(this);

        //Funcion que extrae el ultimo elemento de la expresion matematica
        this.ExtraerElemento = function () {
            if (this.arrElementos.length > 0) {
                this.arrElementos.pop();
                this.arrElementosMostrar.pop();
                this.arrElementosMostrarConFormato.pop();
                this.arrElementosCalcular.pop();
            }else if (this.arrElementos.length == 1){
                this.LimpiarExpresion();
            }
            this.MostrarExpresionMatematica();

            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();
        }.createDelegate(this);

        /*Funcion que limpia toda la expresion matematica*/
        this.LimpiarExpresion = function () {
            delete this.arrElementos;
            delete this.arrElementosMostrar;
            delete this.arrElementosMostrarConFormato;
            delete this.arrElementosCalcular;
            this.arrElementos = new Array();
            this.arrElementosMostrar = new Array();
            this.arrElementosMostrarConFormato = new Array();
            this.arrElementosCalcular = new Array();
            this.posicionInsertar = -1;
            this.adicionandoNumero = -1;
            this.MostrarExpresionMatematica();
            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();
        }.createDelegate(this);

        /*Propiedades de la ventana*/
        this.btnCerrar = new Ext.Button({
            iconCls: 'cerrar',
            //icon: '/pvd/comun/views/js/editorexpresionescomp/cerrar.png',
            text: 'Cerrar',
            tooltip: 'Cerrar',
            handler: function () {
                this.close();
            }.createDelegate(this)
        });

        var self = this;
        var map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'v',
                alt: true,
                fn: function () {
                    self.btnValidar.handler();
                }
            }, {
                key: 'l',
                alt: true,
                fn: function () {
                    self.btnLimpiar.handler();
                }
            }, {
                key: 'h',
                alt: true,
                fn: function () {
                    self.btnAyuda.handler();
                }
            }
        ]);

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            //icon: '/pvd/comun/views/js/editorexpresionescomp/guardar.png',
            text: 'Guardar',
            tooltip: 'Guardar',
            handler: function () {
                /*if (this.fpDenominacion.getForm().isValid()) {*/
                this.mascara = new Ext.LoadMask(_this.body, {msg: "Validando expresión matemática..."})
                this.mascara.show();
                Ext.Ajax.request({
                    url: '/pvd/comun/index.php/expresionmatematicacomp/validarexpresionmatematica',
                    method: 'POST',
                    params: {
                        expresionacalcular: this.arrElementosCalcular.join(' '),
                        elementos: Ext.encode(this.arrElementos)
                    },
                    callback: function (options, success, response) {
                        this.mascara.hide();
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 1) {
                            this.mascara = new Ext.LoadMask(_this.body, {msg: "Guardando expresión matemática..."})
                            this.mascara.show();
                            Ext.Ajax.request({
                                url: '/pvd/comun/index.php/expresionmatematicacomp/guardarexpresionmatematica',
                                method: 'POST',
                                params: {
                                    idexpresionmatematica: this.idexpresionmatematica,
                                    denominacion: this.tfdenominacion.getValue(),
                                    expresionamostrar: this.arrElementosMostrar.join(' '),
                                    expresionamostrarconformato: this.arrElementosMostrarConFormato.join(' '),
                                    expresionacalcular: this.arrElementosCalcular.join(' '),
                                    elementos: Ext.encode(this.arrElementos)
                                },
                                callback: function (options, success, response) {
                                    this.mascara.hide();
                                    var respuesta = Ext.decode(response.responseText);
                                    mostrarMensaje(respuesta.codigo, respuesta.mensaje);
                                    this.idexpresionmatematica = respuesta.idexpresionmatematica;
                                    var aux = {
                                        idexpresionmatematica: this.idexpresionmatematica,
                                        denom: this.tfdenominacion.getValue(),
                                        elementosMostrar: this.arrElementosMostrar.join(' '),
                                        elementosMostrarFormato: this.arrElementosMostrar.join(' '),
                                    };
                                    this.fireEvent('expresionsalvada', aux);
                                }.createDelegate(this)
                            });
                        } else {
                            mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica contiene errores.');
                        }
                    }.createDelegate(this)
                });


                /*}*/
            }.createDelegate(this)
        });

        this.title = 'Editor de expresiones matem&aacute;ticas';
        this.items = [this.fpDenominacion, this.gpIndicadores, this.pContenedor];
        this.buttons = [this.btnCerrar, this.btnGuardar];
        Ext.pvd.persona.formula.winEditorExpresiones.superclass.initComponent.call(this);
    },
    buscarIndicador: function (idindicador) {
        for (var i = 0; i < this.indicadores.length; i++) {
            if (this.indicadores[i][0] == idindicador)
                return this.indicadores[i][1];
        }
        return -1;
    },
    obtenerID: function () {
        return this.idexpresionmatematica;
    }
});