/**
 * Componente gestionar formulas o expresiones matematicas
 *
 * @extends Ext.Window
 * @autor Yadir Martinez Vergara
 * @autor Javier Rodriguez Lopez
 * @version 2.1
 */
Ext.ns('Ext.pvd.persona.formula');
Ext.QuickTips.init();
Ext.pvd.persona.formula.Utils = function ()
{
    return {
        loadMask: function (msj, cmp)
        {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function ()
        {
            this.lMask.hide();
        }
    }
};
var utils = new Ext.pvd.persona.formula.Utils();
Ext.QuickTips.init();
Ext.pvd.persona.formula.winEditorExpresionesEvalSel = Ext.extend(Ext.Window, {
    layout: (this.layout ? this.layout : 'border'),
    idCmp: this.idCmp,
    width: (this.width ? this.width : 900),
    height: (this.height ? this.height : 550),
    closeAction: 'destroy',
    closable: true,
    modal: true,
    maximizable: true,
    plain: false,
    idexpresionmatematica: (this.idexpresionmatematica ? this.idexpresionmatematica : -1),
    mostrarCondicionales: (this.mostrarCondicionales ? this.mostrarCondicionales : -1),
    hideFieldDenom: this.hideFieldDenom || false,
    listeners: {
        show: function (v)
        {
            this.stIndicadores.loadData(this.indicadores);
            if (this.idexpresionmatematica != -1) {
                Ext.Ajax.request({
                    url: '/pvd/comun/index.php/expresionmatematicacomp/cargarexpresionmatematica',
                    method: 'POST',
                    params: {
                        idexpresionmatematica: this.idexpresionmatematica
                    },
                    callback: function (options, success, response)
                    {
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
                                }
                                else {
                                    valorMostrarInd = this.buscarIndicador(elem.idindicador);
                                    if (valorMostrarInd != -1) {
                                        this.AdicionarElemento(elem.tipoelemento, elem.elemento, valorMostrarInd);
                                    } else {
                                        cantindFaltan++;
                                    }
                                }
                            /* if (elem.tipoelemento == 6) {
                                    valorMostrarInd = this.buscarIndicador(elem.idindicador);
                                    if (valorMostrarInd != -1) {
                                        this.AdicionarElemento(elem.tipoelemento, elem.elemento, valorMostrarInd);
                                    } else {
                                        cantindFaltan++;
                                    }
                                } else {
                                    this.AdicionarElemento(elem.tipoelemento, elem.elemento, elem.valormostrar);
                                }*/
                            }
                            if (cantindFaltan != 0) {
                                mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica a editar  contiene indicadores que no exiten en los indicadores actuales.');
                            }
                            /*Para mostrar los tooltips de los indicadores*/
                            this.MostrarToolTip();
                        }
                    }.createDelegate(this)
                });
            }

//            this.taExpresionformula.focus();
        }
    },
    initComponent: function ()
    {
        /*Arreglo que contiene los elementos de la expresion matematica*/
        this.arrElementos = new Array();
        this.arrElementosMostrar = new Array();
        this.arrElementosMostrarConFormato = new Array();
        this.arrElementosCalcular = new Array();
        /*Objeto que contine los elementos de una expreion matematica
         Tipos : 1 - Numero, 2 - Funcion, 3 - Operador, 4 - Parentesis abierto, 5 - Parentesis cerrado, 6 - Indicador, 7 - Escala cualitativa
         */
        this.Elemento = function (ptipo, pvalor, pvalormostrar, pvalormostrarconformato, pidelemento)
        {
            this.idelemento = pidelemento;
            this.tipo = ptipo;
            this.valor = pvalor;
            this.valormostrar = pvalormostrar;
            this.valormostrarconformato = pvalormostrarconformato;
            this.setIdElemento = function (idelemento)
            {
                this.idelemento = idelemento;
            };
            this.cambiarValor = function (nuevoValor)
            {
                this.valor = nuevoValor;
            };
            this.cambiarValorMostrar = function (nuevoValorMostrar)
            {
                this.valormostrar = nuevoValorMostrar;
            };
            this.cambiarValorMostrarConFormato = function (nuevoValorMostrarConFormato)
            {
                this.valormostrarconformato = nuevoValorMostrarConFormato;
            };
        };
        this.stEscala = new Ext.data.SimpleStore({
            sortInfo: {field: 'idvalor', direction: 'ASC'},
            fields: [
                //En el caso de las escalas cualitativas aqui se almacena el peso del valor cualitativo segun la escala
                {name: 'idvalor'},
                {name: 'denom'}
            ]
        });
        this.smEscala = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpEscala = new Ext.grid.EditorGridPanel({
            title: 'Valores de la escala',
            store: this.stEscala,
            region: 'south',
            margins: '5 0 0 0',
            cmargins: '5 0 5 0',
            collapsible: true,
            height: 150,

            columns: [
                new Ext.grid.RowNumberer(),
                {header: 'Valor', dataIndex: 'denom'}
            ],
            sm: this.smEscala,
            viewConfig: {
                forceFit: true
            },
            listeners: {
                rowdblclick: function (Grid, rowIndex, e)
                {
                    var recIndicador = this.stEscala.getAt(rowIndex);
                    this.AdicionarElemento(7, recIndicador.data.idvalor, recIndicador.data.denom);
                }.createDelegate(this)
            }
        });
        this.stIndicadores = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({}, [
                {name: 'idindicador'},
                {name: 'denominacion'},
                {name: 'values'}
            ]),
            sortInfo: {field: 'denominacion', direction: 'ASC'}
        });
        this.smIndicadores = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm)
                {
                    this.stEscala.removeAll();
                    if (sm.hasSelection()) {
                        this.stEscala.loadData(sm.getSelected().get('values'));
                    }
                }.createDelegate(this)
            }
        });
        this.gpIndicadores = new Ext.grid.EditorGridPanel({
            title: 'Indicadores',
            store: this.stIndicadores,
            region: 'center',
            viewConfig: {
                forceFit: true
            },
            columns: [
                {header: 'Denominaci&oacute;n', dataIndex: 'denominacion', sortable: true, renderer: function (v)
                {
                    return '<font color="800000">' + v + '</font>';
                }}
            ],
            sm: this.smIndicadores,
            listeners: {
                rowdblclick: function (Grid, rowIndex, e)
                {
                    var recIndicador = this.stIndicadores.getAt(rowIndex);
                    this.AdicionarElemento(6, 'I' + recIndicador.data.idindicador, recIndicador.data.denominacion);
                }.createDelegate(this)
            }
        });
        this.pIndicadoresEscalas = new Ext.Panel({
            region: 'west',
            layout: 'border',
            margins: '5 0 5 5',
            width: 450,
            border: false,
            items: [this.gpIndicadores, this.gpEscala]
        });
        this.tpl = new Ext.Template('<p style="body{margin:0;padding:3px;height:98%;cursor:link;}">{0}</p>');
        this.ValidarExpresion = function ()
        {
            var a = new Array();
            for (var i = 0; i < this.arrElementos.length; i++) {
                if (this.arrElementos[i].tipo == 6) {
                    a.push(31);
                } else {
                    a.push(this.arrElementos[i].valor);
                }
            }
            try {
                var exp = a.join(' ');
                exp += ';'
                eval(exp);
                return true;
            } catch (error) {
                return false;
            }
        };
        this.btnValidar = new Ext.Button({
            iconCls: 'validar',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/validar.png',
            text: 'Validar',
            tooltip: 'Valida si la expresi&oacute;n esta sint&aacute;cticamente correcta (<b>Alt+V</b>)',
            handler: function ()
            {
                if (this.ValidarExpresion()) {
                    mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica ha sido validada satifactoriamente.');
                } else {
                    mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica contiene errores.');
                }
            }.createDelegate(this)
        });
        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/limpiar.png',
            text: 'Limpiar',
            tooltip: 'Limpia el editor de expresiones (<b>Alt+L</b>)',
            handler: function ()
            {
                this.LimpiarExpresion();
            }.createDelegate(this)
        });
        this.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/ayuda.png',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            handler: function ()
            {
				var title = 'Ayuda del editor de expresiones matem&aacute;ticas';
				var referencia = '';
				help.show(title,referencia);
            }
        });

        /*Panel contenedor del area de edicion de la formula*/
        this.taExpresionformula = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            height: 300,
            title: 'Expresi&oacute;n matem&aacute;tica',
            tbar: [this.btnValidar, this.btnLimpiar, '->', this.btnAyuda],
            bodyStyle: 'body{margin:0;padding:3px;height:98%;cursor:link;}'
        });
        //Numeros
        this.btnuno = new Ext.Button({text: '<font color="0000FF">1</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '1', '1');
        }.createDelegate(this)});
        this.btndos = new Ext.Button({text: '<font color="0000FF">2</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '2', '2');
        }.createDelegate(this)});
        this.btntres = new Ext.Button({text: '<font color="0000FF">3</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '3', '3');
        }.createDelegate(this)});
        this.btncuatro = new Ext.Button({text: '<font color="0000FF">4</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '4', '4');
        }.createDelegate(this)});
        this.btncinco = new Ext.Button({text: '<font color="0000FF">5</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '5', '5');
        }.createDelegate(this)});
        this.btnseis = new Ext.Button({text: '<font color="0000FF">6</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '6', '6');
        }.createDelegate(this)});
        this.btnsiete = new Ext.Button({text: '<font color="0000FF">7</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '7', '7');
        }.createDelegate(this)});
        this.btnocho = new Ext.Button({text: '<font color="0000FF">8</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '8', '8');
        }.createDelegate(this)});
        this.btnnueve = new Ext.Button({text: '<font color="0000FF">9</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '9', '9');
        }.createDelegate(this)});
        this.btncero = new Ext.Button({text: '<font color="0000FF">0</font>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '0', '0');
        }.createDelegate(this)});
        this.btnpunto = new Ext.Button({text: '<b>.</b>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(1, '.', '.');
        }.createDelegate(this)});
        this.btnborrarnumero = new Ext.Button({text: '<b>L</b>', tooltip: 'Retroceder', width: 35, height: 30, handler: function ()
        {
            this.ExtraerElemento();
        }.createDelegate(this)});
        //Operadores
        this.btnsuma = new Ext.Button({text: '+', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '+', '+');
        }.createDelegate(this)});
        this.btnresta = new Ext.Button({text: '-', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '-', '-');
        }.createDelegate(this)});
        this.btnmayor = new Ext.Button({text: '>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '>', '>');
        }.createDelegate(this)});
        this.btnmayorigual = new Ext.Button({text: '>=', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '>=', '>=');
        }.createDelegate(this)});
        this.btnproducto = new Ext.Button({text: '*', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '*', '*');
        }.createDelegate(this)});
        this.btndivision = new Ext.Button({text: '/', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '/', '/');
        }.createDelegate(this)});
        this.btnmenor = new Ext.Button({text: '<', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '<', '<');
        }.createDelegate(this)});
        this.btnmenorigual = new Ext.Button({text: '<=', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '<=', '<=');
        }.createDelegate(this)});
        this.btnigual = new Ext.Button({text: '==', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '==', '==');
        }.createDelegate(this)});
        this.btni = new Ext.Button({text: 'Y', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '&&', 'Y');
        }.createDelegate(this)});
        this.btno = new Ext.Button({text: 'O', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '||', 'O');
        }.createDelegate(this)});
        this.btndistinto = new Ext.Button({text: '<>', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(3, '!=', '<>');
        }.createDelegate(this)});
        this.btnpa = new Ext.Button({text: '(..', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(4, '(', '(');
        }.createDelegate(this)});
        this.btnpc = new Ext.Button({text: '..)', width: 35, height: 30, handler: function ()
        {
            this.AdicionarElemento(5, ')', ')');
        }.createDelegate(this)});
        this.btnfsuma = new Ext.Button({text: 'SU', width: 35, height: 30, handler: function ()
        {
            this.SumaryPromediarIndicadores(1);
        }.createDelegate(this)
            /*iconCls:'btn', icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/sumatoria.png'*/
        });
        this.btnfpromedio = new Ext.Button({text: 'PR', width: 35, height: 30, handler: function ()
        {
            this.SumaryPromediarIndicadores(2);
        }.createDelegate(this)
        });
        /*Funcion que muestra la interfaz para sumar indicadores*/
        this.SumaryPromediarIndicadores = function (essuma)
        {
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
                store: stsumaIndicadores,
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
                buttons: [
                    {iconCls: 'cancelar',
                        //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/cancelar.png',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        handler: function ()
                        {
                            winsumaIndicadores.close();
                        }
                    },
                    {iconCls: 'aceptar',
                        //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/aceptar.png',
                        text: 'Aceptar',
                        tooltip: 'Aceptar',
                        handler: function ()
                        {
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
        this.reccbFunciones = [
            {name: 'idfuncion'},
            {name: 'denom'},
            {name: 'descripcion'}
        ];
        this.datoscbFunciones = [
            [1, 'Todas', 'Todas'],
            [2, 'Exponenciales', 'Exponenciales'],
            [3, 'Trigonometricas', 'Trigonometricas'],
            [4, 'Otras', 'Otras']
        ];
        this.stcbFunciones = new Ext.data.SimpleStore({
            fields: this.reccbFunciones
        });
        this.cbFunciones = new Ext.form.ComboBox({
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
                select: function (combo, record, index)
                {
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
        this.recgridFunciones = [
            {name: 'idfuncion'},
            {name: 'denom'},
            {name: 'descripcion'},
            {name: 'id'},
            {name: 'todas'},
            {name: 'cantidadparametros'}
        ];
        this.stgridFunciones = new Ext.data.SimpleStore({
            fields: this.recgridFunciones
        });
        this.stgridFunciones.loadData(this.arrFunciones, true);
        this.smgridFunciones = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indice, record)
                {

                }
            }
        });
        //Grid panel funciones
        this.gpgridFunciones = new Ext.grid.GridPanel({

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
            ],
            listeners: {
                rowdblclick: function (Grid, rowIndex, e)
                {

                }
            }
        });

        /*Condicionales*/
        this.btnsi = new Ext.Button({text: 'SI', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(7, 'SI_', 'SI');
        }.createDelegate(this)
        });
        this.btnentonces = new Ext.Button({text: 'ENTONCES', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(7, 'ENTONCES', 'ENTONCES');
        }.createDelegate(this)
        });
        this.btnsino = new Ext.Button({text: 'SINO', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(7, 'SINO', 'SINO');
        }.createDelegate(this)
        });
        this.btnlla = new Ext.Button({text: '{', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(8, '{', '{');
        }.createDelegate(this)
        });
        this.btnllc = new Ext.Button({text: '}', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(9, '}', '}');
        }.createDelegate(this)
        });
        this.btndevolver = new Ext.Button({text: 'DEVOLVER', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(10, 'DEVOLVER', 'DEVOLVER');
        }.createDelegate(this)
        });
        this.btncoma = new Ext.Button({text: ';', width: 35, height: 30, handler: function() {
            this.AdicionarElemento(11, ';', ';');
        }.createDelegate(this)
        });

        this.panelCondicionales = (this.mostrarCondicionales == 1 ?
        {layout: 'form', columnWidth: 0.29, border: true, xtype: 'fieldset', title: 'Condiciones', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
            defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
            items: [
                {layout: 'table', border: false, width:180, layoutConfig: {columns: 3},
                    items: [
                        {items: this.btnentonces},
                        {items: this.btnsi},
                        {items: this.btnllc},
                        {items: this.btndevolver},
                        {items: this.btnsino},
                        {items: this.btnlla},
                        {items: this.btncoma}
                    ]
                }
            ]
        }
            : {layout: 'form', columnWidth: 0.04, border: false, items: [{html: '&nbsp;', border: false, frame: false}]});

        /*Panel contenedor de los operadores y operandos*/
        this.pOperadores = new Ext.FormPanel({
            margins: '5 0 0 0',
            region: 'south',
            height: 150,
            title: 'Operadores',
            frame: true,
            items: [
                {layout: 'column', border: false, bodyStyle: 'padding: 0px 5px 10px 0px',
                    items: [
                        {layout: 'form', columnWidth: 0.29, border: true, xtype: 'fieldset', title: 'N&uacute;meros', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
                            defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
                            items: [
                                {layout: 'table', border: false, layoutConfig: {columns: 3, bodyStyle: 'padding: 5px 5px 5px 5px'},
                                    items: [
                                        {items: this.btnuno},
                                        {items: this.btndos},
                                        {items: this.btntres},
                                        {items: this.btncuatro},
                                        {items: this.btncinco},
                                        {items: this.btnseis},
                                        {items: this.btnsiete},
                                        {items: this.btnocho},
                                        {items: this.btnnueve},
                                        {items: this.btnpunto},
                                        {items: this.btncero},
                                        {items: this.btnborrarnumero}
                                    ]
                                }
                            ]
                        }, //fin de Numeros
                        {layout: 'form', columnWidth: 0.04, border: false, items: [
                            {html: '&nbsp;', border: false, frame: false}
                        ]},
                        {layout: 'form', columnWidth: 0.29, border: true, xtype: 'fieldset', title: 'Operadores', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
                            defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
                            items: [
                                {layout: 'table', border: false, layoutConfig: {columns: 4},
                                    items: [
                                        {items: this.btndivision},
                                        {items: this.btnmayor},
                                        {items: this.btnpa},
                                        {items: this.btnpc},
                                        {items: this.btnproducto},
                                        {items: this.btnmenor},
                                        {items: this.btnigual},
                                        {items: this.btndistinto},
                                        {items: this.btnresta},
                                        {items: this.btni},
                                        {items: this.btnmayorigual},
                                        {items: this.btnmenorigual},
                                        {items: this.btnsuma},
                                        {items: this.btno},
                                        {items: this.btnfsuma},
                                        {items: this.btnfpromedio}
                                    ]
                                }
                            ]
                        }, //fin de Operadores
                        {layout: 'form', columnWidth: 0.04, border: false, items: [
                            {html: '&nbsp;', border: false, frame: false}
                        ]},
                        {layout: 'form', columnWidth: 0.28, border: true, xtype: 'fieldset', title: 'Funciones', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
                            defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
                            items: [
                                {layout: 'table', border: false, layoutConfig: {columns: 1},
                                    items: [
                                        {items: this.cbFunciones},
                                        {items: this.gpgridFunciones}
                                    ]
                                }
                            ]
                        }, //fin de Funciones
                        {layout: 'form', columnWidth: 0.04, border: false, items: [
                            {html: '&nbsp;', border: false, frame: false}
                        ]},this.panelCondicionales
                        /*{layout: 'form', columnWidth: 0.29, border: true, xtype: 'fieldset', title: 'Condiciones', style: '-moz-border-radius:5px', autoHeight: true, autoWidth: true,
                            defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
                            items: [
                                {layout: 'table', border: false, width:180, layoutConfig: {columns: 3},
                                    items: [
                                        {items: this.btnentonces},
                                        {items: this.btnsi},
                                        {items: this.btnllc},
                                        {items: this.btndevolver},
                                        {items: this.btnsino},
                                        {items: this.btnlla},
                                        {items: this.btncoma}
                                    ]
                                }
                            ]
                        },*/ //fin de Condiciones
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
            width: 700,
            minSize: 550,
            maxSize: 700,
            split: true,
            items: [this.taExpresionformula, this.pOperadores]
        });
        this.tfdenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            regex: /(^([a-zA-ZáéíóúñüÑ ])+([a-zA-ZáéíóúñüÑ\d]*))$/,
            anchor: '99%',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.'
        });
        this.fpDenominacion = new Ext.FormPanel({
            frame: true,
            region: 'north',
            layout: 'form',
            height: 40,
            margins: '5 5 0 5',
            hidden: this.hideFieldDenom,
            items: [this.tfdenominacion]
        });
        this.ToolTipMostrarDetalles = function (tipo, idelem, valormostrar)
        {
            var t = parseInt(tipo);
            if (tipo === 6) {
                var ttp = new Ext.ToolTip({
                    target: idelem,
                    html: valormostrar,
                    title: 'Indicador o variable',
                    autoHide: true,
                    trackMouse: true
                });
            }
        };
        /*Funcion que muestra la exresion de la formula en el area de edicion*/
        this.MostrarExpresionMatematica = function ()
        {
//            this.taExpresionformula.setValue(this.arrElementosMostrar.join(' '));
            var v = new Array();
            v[0] = this.arrElementosMostrarConFormato.join(' ');
            this.taExpresionformula.body.update('');
            this.tpl.overwrite(this.taExpresionformula.body, v);
        }.createDelegate(this);
        this.tmpCantIdElemento = 0;
        /*Funcion que adiciona un elemento en la exresion de la formula*/
        this.AdicionarElemento = function (tipo, valor, valormostrar)
        {
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
                }
                else {
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
        //Funcion que extrae el ultimo elemento de la expresion matematica
        this.ExtraerElemento = function ()
        {
            if (this.arrElementos.length > 0) {
                this.arrElementos.pop();
                this.arrElementosMostrar.pop();
                this.arrElementosMostrarConFormato.pop();
                this.arrElementosCalcular.pop();
            }
            this.MostrarExpresionMatematica();
            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();
        }.createDelegate(this);
        /*Funcion que elimina el ultimo elemento de la expresion matematica*/
        this.EliminarElemento = function ()
        {
            if (this.arrElementos.length > 0) {
                this.arrElementos.pop();
                this.arrElementosMostrar.pop();
                this.arrElementosCalcular.pop();
            }
            this.MostrarExpresionMatematica();
//            this.taExpresionformula.focus();
        }.createDelegate(this);
        this.MostrarToolTip = function ()
        {
            /*Para mostrar los tooltips de los indicadores*/
            for (var i = 0; i < this.arrElementos.length; i++) {
                if (this.arrElementos[i].tipo == 6) {
                    this.ToolTipMostrarDetalles(6, this.arrElementos[i].idelemento, this.arrElementos[i].valormostrar);
                }
            }
            Ext.QuickTips.init();
        }

        window.SeleccionarIndicador = function (idindicador, idelemento)
        {
            document.getElementById(idelemento).classList.add('color');
            var pos = this.stIndicadores.find('idindicador', idindicador);
            if (pos != -1)
                this.gpIndicadores.getSelectionModel().selectRow(pos);
        }.createDelegate(this);
        //Funcion que elimina el elemento indicado de la expresion matematica
        window.EliminarElemento = function (idelemento)
        {
            if (idelemento) {
                for (var i = 0; i < this.arrElementos.length; i++) {
                    if (this.arrElementos[i].idelemento == idelemento) {
                        this.arrElementos.splice(i, 1);
                        this.arrElementosMostrar.splice(i, 1);
                        this.arrElementosMostrarConFormato.splice(i, 1);
                        this.arrElementosCalcular.splice(i, 1);
                        break;
                    }
                }
//Para actualizar la expresion matematica
                this.MostrarExpresionMatematica();
                //Para mostrar los tooltips de los indicadores
                this.MostrarToolTip();
            }
        }.createDelegate(this);
        this.FormatearValorMostrar = function (tipo, valormostrar, idelemento, idindicador)
        {
            var t = parseInt(tipo);
            switch (t) {
                case 1:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');><font color="0000FF">' + valormostrar + '</font><a/>';
                    break;
                }
                case 2:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 3:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 4:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 5:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 6:
                {
                    return '<a id="' + idelemento
                        + '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\'); onClick=window.SeleccionarIndicador(\'' + idindicador + '\',\'' + idelemento + '\');><font color="800000">' + valormostrar + '</font><a/>';
                    break;
                }
                case 7:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');><font color="green">' + valormostrar + '</font><a/>';
                    break;
                }
                default:
                {
                    return valormostrar;
                }
            }
        };

			 var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
		key: 'im',
		alt: true,
		stopEvent: true,
		handler: function(k, e) {
			switch(k) {
				case 73:{ //i para adicionar comision
						console.info('dfsdfasd');
						this.btnValidar.handler();
					break;
				}
				case 77:{ //m para modificar
						 this.btnLimpiar.handler();
					break;
				}
			}
		}
	}]);

        /*Funcion que limpia toda la expresion matematica*/
        this.LimpiarExpresion = function ()
        {
            delete this.arrElementos;
            delete this.arrElementosMostrar;
            delete this.arrElementosMostrarConFormato;
            delete this.arrElementosCalcular;
            this.arrElementos = new Array();
            this.arrElementosMostrar = new Array();
            this.arrElementosMostrarConFormato = new Array();
            this.arrElementosCalcular = new Array();
            this.MostrarExpresionMatematica();
            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();
        }.createDelegate(this);
        /*Propiedades de la ventana*/
        this.btnCerrar = new Ext.Button({
            iconCls: 'cerrar',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/cerrar.png',
            text: 'Cerrar',
            tooltip: 'Cerrar',
            handler: function ()
            {
                this.close();
            }.createDelegate(this)
        });

		var self = this;
		var map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key:'v',
                alt:true,
                fn:function(){
                    self.btnValidar.handler();
                }
            },{
                key:'l',
                alt:true,
                fn:function(){
                    self.btnLimpiar.handler();
                }
            },{
                key:'h',
                alt:true,
                fn:function(){
                    self.btnAyuda.handler();
                }
            }
        ]);

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/guardar.png',
            text: 'Guardar',
            tooltip: 'Guardar',
            handler: function ()
            {
                //Pregunta si el campo esta visible y esta validado
                if(!this.hideFieldDenom  && !this.tfdenominacion.isValid()) {
                    return;
                }
                PVD.mostrarMascara('mskloadingind', 'Espere...', 'Guardando expresión matemática');
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
                        PVD.ocultarMascara('mskloadingind');
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
            }.createDelegate(this)
        });
        this.title = 'Editor de expresiones matem&aacute;ticas';
        this.items = [this.fpDenominacion, this.pIndicadoresEscalas, this.pContenedor];
        this.buttons = [this.btnCerrar, this.btnGuardar];
        Ext.pvd.persona.formula.winEditorExpresionesEvalSel.superclass.initComponent.call(this);
    },
    buscarIndicador: function (idindicador)
    {
        for (var i = 0; i < this.indicadores.length; i++) {
            if (this.indicadores[i][0] == idindicador)
                return this.indicadores[i][1];
        }
        return -1;
    },
    obtenerID: function ()
    {
        return this.idexpresionmatematica;
    }
});

Ext.ns('Ext.pvd.formula');

Ext.pvd.formula.PanelEditorExpresionesEvalSel = Ext.extend(Ext.Panel, {
    layout: 'border',
    border: false,
    hideFieldDenom: this.hideFieldDenom || false,
    initComponent: function ()
    {

        /**
         * Arreglos que contienen la expresion matematica
         * @type {Array}
         */
        this.arrElementos = new Array();
        this.arrElementosMostrar = new Array();
        this.arrElementosMostrarConFormato = new Array();
        this.arrElementosCalcular = new Array();

        this.tmpCantIdElemento = 0;

        /**
         * Objeto que contine los elementos de una expreion matematica
         * @param ptipo Tipos : 1 - Numero, 2 - Funcion, 3 - Operador, 4 - Parentesis abierto, 5 - Parentesis cerrado, 6 - Indicador, 7 - Escala cualitativa
         * @param pvalor
         * @param pvalormostrar
         * @param pvalormostrarconformato
         * @param pidelemento
         * @constructor
         */
        this.Elemento = function (ptipo, pvalor, pvalormostrar, pvalormostrarconformato, pidelemento)
        {
            this.idelemento = pidelemento;
            this.tipo = ptipo;
            this.valor = pvalor;
            this.valormostrar = pvalormostrar;
            this.valormostrarconformato = pvalormostrarconformato;

            /**
             * Funcion para cambiar el id del elemento
             * @param idelemento
             */
            this.setIdElemento = function (idelemento)
            {
                this.idelemento = idelemento;
            };

            /**
             * Funcion para cambiar el valor del elemento Ej: Cuando el elemento es un numero se concatenan todos los
             * numero que le siguen consecutivamente
             * @param nuevoValor
             */
            this.cambiarValor = function (nuevoValor)
            {
                this.valor = nuevoValor;
            };

            /**
             * Funcion para cambiar el valor que se muesta en el visor que no admitan html del elemento
             * @param nuevoValorMostrar
             */
            this.cambiarValorMostrar = function (nuevoValorMostrar)
            {
                this.valormostrar = nuevoValorMostrar;
            };

            /**
             * Funcion para cambiar el valor que se muesta en el editor de expresiones matematicas con formato html
             * @param nuevoValorMostrarConFormato
             */
            this.cambiarValorMostrarConFormato = function (nuevoValorMostrarConFormato)
            {
                this.valormostrarconformato = nuevoValorMostrarConFormato;
            };
        };

//-------------------------Panel de Indicadores-----------------------------------------------------------------------//

        //--------------Grid de Indicadores--------------//
        /**
         * Store del grid de Indicadores
         * @type {Ext.data.Store}
         */
        this.stIndicadores = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({}, [
                {name: 'idindicador'},
                {name: 'denominacion'},
                {name: 'values'}
            ]),
            sortInfo: {field: 'denominacion', direction: 'ASC'}
        });

        /**
         * Selector del grid de Indicadores
         * @type {Ext.grid.RowSelectionModel}
         */
        this.smIndicadores = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm)
                {
                    this.stEscala.removeAll();
                    if (sm.hasSelection()) {
                        this.stEscala.loadData(sm.getSelected().get('values'));
                    }
                }.createDelegate(this)
            }
        });

        /**
         * ColumnModel del grid de Indicadores
         * @type {Array}
         */
        this.cmIndicadores = [
            {header: this.idioma.colDenominacion, dataIndex: 'denominacion', sortable: true, renderer: function (v)
            {
                return '<font color="800000">' + v + '</font>';
            }}
        ];

        /**
         * Grid de Indicadores
         * @type {Ext.grid.EditorGridPanel}
         */
        this.gpIndicadores = new Ext.grid.EditorGridPanel({
            title: this.idioma.gpIndicadoresTitulo,
            store: this.stIndicadores,
            region: 'center',
            viewConfig: {
                forceFit: true
            },
            columns: this.cmIndicadores,
            sm: this.smIndicadores,
            listeners: {
                rowdblclick: function (grid, rowIndex)
                {
                    var recIndicador = this.stIndicadores.getAt(rowIndex);
                    this.AdicionarElemento(6, 'I' + recIndicador.data.idindicador, recIndicador.data.denominacion);
                }.createDelegate(this)
            }
        });

        //-------------Grid de Valores de escala----------//
        /**
         * Store del grid de escalas
         * @type {Ext.data.SimpleStore}
         */
        this.stEscala = new Ext.data.SimpleStore({
            sortInfo: {field: 'idvalor', direction: 'ASC'},
            fields: [
                //En el caso de las escalas cualitativas aqui se almacena el peso del valor cualitativo segun la escala
                {name: 'idvalor'},
                {name: 'denom'}
            ]
        });

        /**
         * Selector del grid de escalas
         * @type {Ext.grid.RowSelectionModel}
         */
        this.smEscala = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        /**
         * ColumnModel del grid de escala
         * @type {Array}
         */
        this.cmEscala = [
            new Ext.grid.RowNumberer(),
            {header: this.idioma.colValor, dataIndex: 'denom'}
        ]

        /**
         * Grid de escalas
         * @type {Ext.grid.EditorGridPanel}
         */
        this.gpEscala = new Ext.grid.EditorGridPanel({
            title: this.idioma.gpEscalaTitulo,
            store: this.stEscala,
            region: 'south',
            margins: '5 0 0 0',
            cmargins: '5 0 5 0',
            collapsible: true,
            height: 150,
            columns: this.cmEscala,
            sm: this.smEscala,
            viewConfig: {
                forceFit: true
            },
            listeners: {
                rowdblclick: function (Grid, rowIndex, e)
                {
                    var recIndicador = this.stEscala.getAt(rowIndex);
                    this.AdicionarElemento(7, recIndicador.data.idvalor, recIndicador.data.denom);
                }.createDelegate(this)
            }
        });

        /**
         * Panel contenedor de los indicadores y sus escalas
         * @type {Ext.Panel}
         */
        this.pIndicadoresEscalas = new Ext.Panel({
            region: 'west',
            layout: 'border',
            margins: '5 0 5 5',
            border: false,
            width: 220,
            minSize: 220,
            maxSize: 300,
            collapsible: true,
            collapseMode: 'mini',
            split: true,
            items: [this.gpIndicadores, this.gpEscala]
        });

//-------------------------Formulario de denominacion-----------------------------------------------------------------//
        /**
         * TextField para definir el nombre de la expresion matematica
         * @type {Ext.form.TextField}
         */
        this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: this.idioma.lbDenominacion,
            regex: /(^([a-zA-ZáéíóúñüÑ ])+([a-zA-ZáéíóúñüÑ\d]*))$/,
            anchor: '99%',
            allowBlank: false,
            blankText: this.idioma.lbCampoObligatorio
        });

        /**
         * Panel para mostrar el campo de denominacion
         * @type {Ext.FormPanel}
         */
        this.fpDenominacion = new Ext.FormPanel({
            frame: true,
            region: 'north',
            layout: 'form',
            height: 40,
            margins: '5 5 0 5',
            hidden: this.hideFieldDenom,
            items: [this.tfDenominacion]
        });

//------------------------Contenedor de Operadores y visor de expresiones---------------------------------------------//

        //----------Panel de Operadores -------------//

        //----------Numeros del panel----------------//
        this.btnuno = new Ext.Button({
            text: '<font color="0000FF">1</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '1', '1');
            }.createDelegate(this)
        });
        this.btndos = new Ext.Button({
            text: '<font color="0000FF">2</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '2', '2');
            }.createDelegate(this)
        });
        this.btntres = new Ext.Button({
            text: '<font color="0000FF">3</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '3', '3');
            }.createDelegate(this)
        });
        this.btncuatro = new Ext.Button({
            text: '<font color="0000FF">4</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '4', '4');
            }.createDelegate(this)
        });
        this.btncinco = new Ext.Button({
            text: '<font color="0000FF">5</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '5', '5');
            }.createDelegate(this)
        });
        this.btnseis = new Ext.Button({
            text: '<font color="0000FF">6</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '6', '6');
            }.createDelegate(this)
        });
        this.btnsiete = new Ext.Button({
            text: '<font color="0000FF">7</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '7', '7');
            }.createDelegate(this)
        });
        this.btnocho = new Ext.Button({
            text: '<font color="0000FF">8</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '8', '8');
            }.createDelegate(this)
        });
        this.btnnueve = new Ext.Button({
            text: '<font color="0000FF">9</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '9', '9');
            }.createDelegate(this)
        });
        this.btncero = new Ext.Button({
            text: '<font color="0000FF">0</font>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '0', '0');
            }.createDelegate(this)
        });
        this.btnpunto = new Ext.Button({
            text: '<b>.</b>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(1, '.', '.');
            }.createDelegate(this)
        });
        this.btnborrarnumero = new Ext.Button({
            text: '<b>L</b>',
            tooltip: this.idioma.tlpRetroceder,
            width: 35,
            height: 30,
            handler: function ()
            {
                this.ExtraerElemento();
            }.createDelegate(this)
        });

        //----------Operadores----------------------//
        this.btnsuma = new Ext.Button({
            text: '+',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '+', '+');
            }.createDelegate(this)
        });
        this.btnresta = new Ext.Button({
            text: '-',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '-', '-');
            }.createDelegate(this)
        });
        this.btnmayor = new Ext.Button({
            text: '>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '>', '>');
            }.createDelegate(this)
        });
        this.btnmayorigual = new Ext.Button({
            text: '>=',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '>=', '>=');
            }.createDelegate(this)
        });
        this.btnproducto = new Ext.Button({
            text: '*',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '*', '*');
            }.createDelegate(this)
        });
        this.btndivision = new Ext.Button({
            text: '/',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '/', '/');
            }.createDelegate(this)
        });
        this.btnmenor = new Ext.Button({
            text: '<',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '<', '<');
            }.createDelegate(this)
        });
        this.btnmenorigual = new Ext.Button({
            text: '<=',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '<=', '<=');
            }.createDelegate(this)
        });
        this.btnigual = new Ext.Button({
            text: '==',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '==', '==');
            }.createDelegate(this)
        });
        this.btni = new Ext.Button({
            text: 'Y',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '&&', 'Y');
            }.createDelegate(this)
        });
        this.btno = new Ext.Button({
            text: 'O',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '||', 'O');
            }.createDelegate(this)
        });
        this.btndistinto = new Ext.Button({
            text: '<>',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(3, '!=', '<>');
            }.createDelegate(this)
        });
        this.btnpa = new Ext.Button({
            text: '(..',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(4, '(', '(');
            }.createDelegate(this)
        });
        this.btnpc = new Ext.Button({
            text: '..)',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.AdicionarElemento(5, ')', ')');
            }.createDelegate(this)
        });
        this.btnfsuma = new Ext.Button({
            text: 'SU',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.SumaryPromediarIndicadores(1);
            }.createDelegate(this)
        });
        this.btnfpromedio = new Ext.Button({
            text: 'PR',
            width: 35,
            height: 30,
            handler: function ()
            {
                this.SumaryPromediarIndicadores(2);
            }.createDelegate(this)
        });

        //------Funciones--------------------------//
        /**
         * Store de comboBox de funciones
         * @type {Ext.data.SimpleStore}
         */
        this.stcbFunciones = new Ext.data.SimpleStore({
            fields: [
                {name: 'idfuncion'},
                {name: 'denom'},
                {name: 'descripcion'}
            ],
            data: [
                [1, 'Todas', 'Todas'],
                [2, 'Exponenciales', 'Exponenciales'],
                [3, 'Trigonometricas', 'Trigonometricas'],
                [4, 'Otras', 'Otras']
            ]
        });

        /**
         * ComboBox de funciones
         * @type {Ext.form.ComboBox}
         */
        this.cbFunciones = new Ext.form.ComboBox({
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
                select: function (combo, record, index)
                {
                    if (record.get('idfuncion') == 1) {
                        this.stgridFunciones.filter('todas', '1');
                    } else {
                        this.stgridFunciones.filter('idfuncion', record.get('idfuncion'));
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Store del grid de funciones
         * @type {Ext.data.SimpleStore}
         */
        this.stgridFunciones = new Ext.data.SimpleStore({
            fields: [
                {name: 'idfuncion'},
                {name: 'denom'},
                {name: 'descripcion'},
                {name: 'id'},
                {name: 'todas'},
                {name: 'cantidadparametros'}
            ],
            data: [
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
            ]
        });

        /**
         * Selector del grid de funciones
         * @type {Ext.grid.RowSelectionModel}
         */
        this.smgridFunciones = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indice, record)
                {

                }
            }
        });

        /**
         * Grid de funciones matematicas
         * @type {Ext.grid.GridPanel}
         */
        this.gpgridFunciones = new Ext.grid.GridPanel({
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
            ],
            listeners: {
                rowdblclick: function (Grid, rowIndex, e)
                {

                }
            }
        });

        /**
         * Panel de Operadores
         * @type {Ext.FormPanel}
         */
        this.pOperadores = new Ext.FormPanel({
            margins: '5 0 0 0',
            region: 'south',
            height: 150,
            title: this.idioma.pOperadoresTitulo,
            frame: true,
            items: [
                {layout: 'column', border: false, bodyStyle: 'padding: 0px 5px 10px 0px',
                    items: [
                        {
                            layout: 'form',
                            columnWidth: 0.29,
                            border: true,
                            xtype: 'fieldset',
                            title: this.idioma.lbNumerons,
                            style: '-moz-border-radius:5px',
                            autoHeight: true,
                            autoWidth: true,
                            defaults: {
                                bodyStyle: 'padding: 5px 5px 5px 5px'
                            },
                            items: [
                                {
                                    layout: 'table',
                                    border: false,
                                    layoutConfig: {
                                        columns: 3,
                                        bodyStyle: 'padding: 5px 5px 5px 5px'
                                    },
                                    items: [
                                        {items: this.btnuno},
                                        {items: this.btndos},
                                        {items: this.btntres},
                                        {items: this.btncuatro},
                                        {items: this.btncinco},
                                        {items: this.btnseis},
                                        {items: this.btnsiete},
                                        {items: this.btnocho},
                                        {items: this.btnnueve},
                                        {items: this.btnpunto},
                                        {items: this.btncero},
                                        {items: this.btnborrarnumero}
                                    ]
                                }
                            ]
                        }, //fin de Numeros
                        {
                            layout: 'form',
                            columnWidth: 0.04,
                            border: false,
                            items: [
                                {
                                    html: '&nbsp;',
                                    border: false,
                                    frame: false
                                }
                            ]
                        }, //Separador
                        {
                            layout: 'form',
                            columnWidth: 0.29,
                            border: true,
                            xtype: 'fieldset',
                            title: this.idioma.lbOperadores,
                            style: '-moz-border-radius:5px',
                            autoHeight: true,
                            autoWidth: true,
                            defaults: {
                                bodyStyle: 'padding: 5px 5px 5px 5px'
                            },
                            items: [
                                {
                                    layout: 'table',
                                    border: false,
                                    layoutConfig: {
                                        columns: 4
                                    },
                                    items: [
                                        {items: this.btndivision},
                                        {items: this.btnmayor},
                                        {items: this.btnpa},
                                        {items: this.btnpc},
                                        {items: this.btnproducto},
                                        {items: this.btnmenor},
                                        {items: this.btnigual},
                                        {items: this.btndistinto},
                                        {items: this.btnresta},
                                        {items: this.btni},
                                        {items: this.btnmayorigual},
                                        {items: this.btnmenorigual},
                                        {items: this.btnsuma},
                                        {items: this.btno},
                                        {items: this.btnfsuma},
                                        {items: this.btnfpromedio}
                                    ]
                                }
                            ]
                        }, //fin de Operadores
                        {
                            layout: 'form',
                            columnWidth: 0.04,
                            border: false,
                            items: [
                                {
                                    html: '&nbsp;',
                                    border: false,
                                    frame: false
                                }
                            ]
                        }, //Separador
                        {
                            layout: 'form',
                            columnWidth: 0.28,
                            border: true,
                            xtype: 'fieldset',
                            title: this.idioma.lbFunciones,
                            style: '-moz-border-radius:5px',
                            autoHeight: true,
                            autoWidth: true,
                            defaults: {
                                bodyStyle: 'padding: 5px 5px 5px 5px'
                            },
                            items: [
                                {
                                    layout: 'table',
                                    border: false,
                                    layoutConfig: {
                                        columns: 1
                                    },
                                    items: [
                                        {items: this.cbFunciones},
                                        {items: this.gpgridFunciones}
                                    ]
                                }
                            ]
                        }//fin de Funciones
                    ]
                }
            ]
        });

        //----------Visor de expresiones-------------//
        /**
         * Boton para validar la sintaxis de la expresion
         * @type {Ext.Button}
         */

        this.btnValidar = new Ext.Button({
            iconCls: 'validar',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/validar.png',
            text: this.idioma.btnValidar,
            tooltip: this.idioma.tlpValidar,
            handler: function ()
            {
                if (this.ValidarExpresion()) {
                    mostrarMensaje(1, this.idioma.msgExpresion_OK);
                } else {
                    mostrarMensaje(3, this.idioma.msgExpresion_MAl);
                }
            }.createDelegate(this)
        });

        /**
         * Boton para limpiar el editor de expresiones
         * @type {Ext.Button}
         */
        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/limpiar.png',
            text: this.idioma.btnLimpiar,
            tooltip: this.idioma.tlpLimpiar,
            handler: function ()
            {
                this.LimpiarExpresion();
            }.createDelegate(this)
        });

        /**
         * Boton para mostrar la ayuda de componente de expresiones
         * @type {Ext.Button}
         */
        this.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/ayuda.png',
            text: this.idioma.btnAyuda,
            tooltip: this.idioma.tlpAyuda,
            handler: function ()
            {
            }
        });
        /**
         * Panel de Visualizar y editar las expresiones
         * @type {Ext.Panel}
         */
        this.taExpresionformula = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            height: 300,
            title: this.idioma.pEditorExpresiones,
            tbar: [this.btnValidar, this.btnLimpiar, '->', this.btnAyuda],
            bodyStyle: 'body{margin:0;padding:3px;height:98%;cursor:link;}'
        });

        /**
         * Panel contenedor del visor de expresiones y el panel de operadores
         * @type {Ext.Panel}
         */
        this.pContenedor = new Ext.Panel({
            region: 'center',
            margins: '5 5 5 0',
            layout: 'border',
            border: false,
            items: [this.taExpresionformula, this.pOperadores]
        });

        /**
         * Function para adicionar el nuevo elemento a la expresion matematica
         * @type {Function}
         */
        this.AdicionarElemento = function (tipo, valor, valormostrar)
        {
            var nuevoElemento = null;
            var idindicador = null;
            if (tipo === 6) {
                idindicador = valor.substr(1);
            }
            var idelemento = 'Elemento-' + this.tmpCantIdElemento++;
            if (this.arrElementos.length > 0) {
                //Para el caso que el elemento que se este adicionado se un numero
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
                if (!Ext.isEmpty(nuevoElemento)) {
                    this.arrElementos.push(nuevoElemento);
                    this.arrElementosMostrar.push(valormostrar);
                    this.arrElementosMostrarConFormato.push(this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                    this.arrElementosCalcular.push(valor);
                }
            } else {//Para el caso que el arrelgo de expresiones matematicas este vacio.
                nuevoElemento = new this.Elemento(tipo, valor, valormostrar, this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador), idelemento);
                this.arrElementos.push(nuevoElemento);
                this.arrElementosMostrar.push(valormostrar);
                this.arrElementosMostrarConFormato.push(this.FormatearValorMostrar(tipo, valormostrar, idelemento, idindicador));
                this.arrElementosCalcular.push(valor);
            }

            this.MostrarExpresionMatematica(); //Para mostar la expresion matematica
            this.MostrarToolTip();//Para mostrar los tooltips de los indicadores
        }.createDelegate(this);

        /**
         * Funcion para transformar el valor a mostar en html
         *
         * @param tipo
         * @param valormostrar
         * @param idelemento
         * @param idindicador
         * @returns {*}
         * @constructor
         */
        this.FormatearValorMostrar = function (tipo, valormostrar, idelemento, idindicador)
        {
            var t = parseInt(tipo);
            switch (t) {
                case 1:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');><font color="0000FF">' + valormostrar + '</font><a/>';
                    break;
                }
                case 2:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 3:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 4:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 5:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');>' + valormostrar + '<a/>';
                    break;
                }
                case 6:
                {
                    return '<a id="' + idelemento
                        + '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\'); onClick=window.SeleccionarIndicador(\'' + idindicador + '\');><font color="800000">' + valormostrar + '</font><a/>';
                    break;
                }
                case 7:
                {
                    return '<a style="text-decoration:none;" id="' + idelemento +
                        '" href=# onDblClick=window.EliminarElemento(\'' + idelemento + '\');><font color="green">' + valormostrar + '</font><a/>';
                    break;
                }
                default:
                {
                    return valormostrar;
                }
            }
        };

        /**
         * Funcion para asignar a cada elemento de la expresion su tooltip
         * @constructor
         */
        this.MostrarToolTip = function ()
        {
            //Para mostrar los tooltips de los indicadores
            Ext.each(this.arrElementos, function (arr)
            {
                if (arr.tipo == 6) {
                    this.ToolTipMostrarDetalles(6, arr.idelemento, arr.valormostrar);
                }
            }, this);
            Ext.QuickTips.init();
        }

        /**
         * Funcion que crea el tooltip del elemento
         * @param tipo
         * @param idelem
         * @param valormostrar
         * @constructor
         */
        this.ToolTipMostrarDetalles = function (tipo, idelem, valormostrar)
        {
            var t = parseInt(tipo);
            if (tipo === 6) {
                var ttp = new Ext.ToolTip({
                    target: idelem,
                    html: valormostrar,
                    title: this.idioma.lbToolTip,
                    autoHide: true,
                    trackMouse: true
                });
            }
        };

        /**
         * Template para mostrar la expresion matematica
         * @type {Ext.Template}
         */
        this.tpl = new Ext.Template('<p style="body{margin:0;padding:3px;height:98%;cursor:link;}">{0}</p>');

        /**
         * Funcion para representar la expresion matematica en el editor.
         * @type {Function}
         */
        this.MostrarExpresionMatematica = function ()
        {
            var v = new Array();
            v[0] = this.arrElementosMostrarConFormato.join(' ');
            this.taExpresionformula.body.update('');
            this.tpl.overwrite(this.taExpresionformula.body, v);
            this.fireEvent('cambioToActualizar', this.ValidarExpresion());
        }.createDelegate(this);

        /**
         * Funcion para reflejar el origen del elemento que esta seleccionado en la expresion
         * @type {Function}
         */
        window.SeleccionarIndicador = function (idindicador)
        {
            //document.getElementById
            var pos = this.stIndicadores.find('idindicador', idindicador);
            if (pos != -1) {
                this.gpIndicadores.getSelectionModel().selectRow(pos);
            }
        }.createDelegate(this);

        /**
         * Funcion para eliminar el elemento de la expresion matematica
         * @type {Function}
         */
        window.EliminarElemento = function (idelemento)
        {
            if (!Ext.isEmpty(idelemento)) {
                for (var i = 0; i < this.arrElementos.length; i++) {
                    if (this.arrElementos[i].idelemento == idelemento) {
                        this.arrElementos.splice(i, 1);
                        this.arrElementosMostrar.splice(i, 1);
                        this.arrElementosMostrarConFormato.splice(i, 1);
                        this.arrElementosCalcular.splice(i, 1);
                        break;
                    }
                }
                //Para actualizar la expresion matematica
                this.MostrarExpresionMatematica();
                //Para mostrar los tooltips de los indicadores
                this.MostrarToolTip();
            }
        }.createDelegate(this);

        /**
         * Funcion para extraer el ultimo elemento de la expresion matematica
         * @type {Function}
         */
        this.ExtraerElemento = function ()
        {
            if (this.arrElementos.length > 0) {
                this.arrElementos.pop();
                this.arrElementosMostrar.pop();
                this.arrElementosMostrarConFormato.pop();
                this.arrElementosCalcular.pop();
            }
            this.MostrarExpresionMatematica();
            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();
        }.createDelegate(this);

        /**
         * Funcion para limpiar la expresion matematica
         * @type {Function}
         */
        this.LimpiarExpresion = function ()
        {
            delete this.arrElementos;
            delete this.arrElementosMostrar;
            delete this.arrElementosMostrarConFormato;
            delete this.arrElementosCalcular;
            this.arrElementos = new Array();
            this.arrElementosMostrar = new Array();
            this.arrElementosMostrarConFormato = new Array();
            this.arrElementosCalcular = new Array();
            this.MostrarExpresionMatematica();
            /*Para mostrar los tooltips de los indicadores*/
            this.MostrarToolTip();
        }.createDelegate(this);

        this.SumaryPromediarIndicadores = function (essuma)
        {
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
                store: stsumaIndicadores,
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
                buttons: [
                    {iconCls: 'cancelar',
                        //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/cancelar.png',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        handler: function ()
                        {
                            winsumaIndicadores.close();
                        }
                    },
                    {iconCls: 'aceptar',
                        //icon: '/pvd/comun/views/js/editorexpresionesevalselcomp/aceptar.png',
                        text: 'Aceptar',
                        tooltip: 'Aceptar',
                        handler: function ()
                        {
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

		/*var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
		key: 'vl',
		alt: true,
		stopEvent: true,
		handler: function(k, e) {
			switch(k) {
				case 86:{ //i para adicionar comision
						//alert('dfsdfasd');
						this.btnValidar.handler();
					break;
				}
				case 76:{ //m para modificar
						 this.btnLimpiar.handler();
					break;
				}
			}
		}
	}]);*/

//---------------------------FIN--------------------------------------------------------------------------------------//
        this.items = [this.fpDenominacion, this.pIndicadoresEscalas, this.pContenedor];

        Ext.pvd.formula.PanelEditorExpresionesEvalSel.superclass.initComponent.call(this);
    }.createInterceptor(function ()
        {
            this.idioma = Ext.idioma.es.comun.EditorExpresionesEvalSel;
        }),

    /**
     * Funcion para cargar el store de indicadores
     *
     * @param array arrIndicadores
     */
    cargarIndicadores: function (arrIndicadores)
    {
        this.stIndicadores.removeAll();
        if (!Ext.isEmpty(arrIndicadores) && Ext.isArray(arrIndicadores)) {
            this.indicadores = arrIndicadores;
            this.stIndicadores.loadData(arrIndicadores);
        }
    },

    /**
     * Funcion para validar si la expresion esta sintacticamente correcta
     * @returns {boolean}
     * @constructor
     */
    ValidarExpresion: function ()
    {
        var a = ['var x,y;'];
        var long = this.arrElementos.length;
        if (long > 1) {
            for (var i = 0; i < long; i++) {
                if (this.arrElementos[i].tipo == 6) {
                    a.push('x');
                } else if (this.arrElementos[i].tipo == 7) {
                    a.push('y');
                } else {
                    a.push(this.arrElementos[i].valor);
                }
            }
        } else {
            return false;
        }
        try {
            var exp = a.join(' ');
            exp += ';'
            eval(exp);
            return true;
        } catch (Error) {
            return false;
        }
    },

    getExpresionMatematica: function ()
    {
        var arr = [{
            'denominacion': this.tfDenominacion.getValue(),
            'expresionamostrar': this.arrElementosMostrar.join(' '),
            'expresionamostrarconformato': this.arrElementosMostrarConFormato.join(' '),
            'expresionacalcular': this.arrElementosCalcular.join(' '),
            'elementos': this.arrElementos
        }];
        return arr;
    }

});