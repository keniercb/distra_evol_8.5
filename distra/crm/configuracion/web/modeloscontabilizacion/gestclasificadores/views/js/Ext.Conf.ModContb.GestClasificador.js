/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.ModContb.GestClasificador
 * @extends Ext.Viewport
 */
Ext.namespace('Ext.Conf.ModContb.GestClasificador');
Ext.Conf.ModContb.GestClasificador = Ext.extend(Ext.Viewport, {
    //Properties and Variables
    idsubsistema: -1,
    //Functions
    constructor: function(params) {
        //idioma del sistema
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';
        this.onloadMessageBox(title,text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            scope: this,
            callback: function(options, success, response)
            {
                var idioma = Ext.decode(response.responseText);
                var perfil = window.parent.perfil;

                params.btnaddclasificador = new Ext.Button({
                    id: 'btnaddclasificador',
                    text: idioma.lbbtnaddclasificador,
                    iconCls: 'adicionar',
                    tooltip: idioma.tooltipbtnaddclasif,
                    hidden:true
                });

                //esto es una prueba pa lo de carlos
                params.pruebaRpt = new Ext.Button({
                    id: 'pruebacmp',
                    text: 'Rpt',
                    iconCls: 'adicionar',
                    handler: function(){
                        var pp = new Ext.Report.windows({
                            jrxmldirectory: '/configuracion/reportejasper/reportes/'
                        });
                    }
                });

                params.btndelclasificador = new Ext.Button({
                    id: 'btndelclasificador',
                    text: idioma.lbtndelclasificador,
                    hidden: true,
                    disabled:true,
                    iconCls: 'eliminar',
                    tooltip: idioma.tooltipbtndelclasificador
                });

                params.ayuda = new Ext.Button({
                    id: 'btnAyudaClasificadoresContables',
                    text: idioma.lbbtnayuda,
                    tooltip: idioma.tooltipayuda,
                    iconCls: 'ayuda'
                });

                params.tabsubsistemas = new Ext.Conf.ModContb.Tabpanel({
                    idsubsistema: params.idsubsistema,
                    perfil: perfil,
                    idioma: idioma,
                    idComponente: 2,
                    region: 'center'
                });

                params.gridcamposinfo = new Ext.Conf.ModContb.GestModeloGrid({
                    identificador: 'grid' + params.idsubsistema,
                    idComponente: 3,
                    perfil: perfil,
                    idioma: idioma
                });

                params.panelcamposinfo = new Ext.Panel({
                    title: idioma.titlecampcontables,
                    layout: 'fit',
                    region: 'south',
                    height: 200,
                    collapsible: true,
                    collapsed: true,
                    animCollapse: true,
                    items: [params.gridcamposinfo]
                });

                //Panel que contiene todo el componente
                params.panel = new Ext.Panel({
                    id: 'paneltabclasificadores',
                    layout: 'border',
                    border: false,
                    tbar: [
                        params.btnaddclasificador,
                        params.btndelclasificador,
                        //params.pruebaRpt, // quitar este que es una prueba de carlos
                        '->',
                        new Ext.CmbOrganos({
                            idioma: idioma,
                            scope: this,
                            gridStore: null,
                            tabsubsistemas: params.tabsubsistemas
                        }),
                        params.ayuda
                    ],
                    items: [
                        params.tabsubsistemas,
                        params.panelcamposinfo
                    ]
                });

                Ext.apply(this, params);
                Ext.apply(this, {
                    layout: 'fit',
                    items: [params.panel]
                });

                Ext.Conf.ModContb.GestClasificador.superclass.constructor.call(this);

                //Keymap necesario para el trabajo con las teclas rápidas
                this.mapaTeclas = new Ext.KeyMap(this.getEl(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function() {
                            if (this.tabsubsistemas.getActiveTab()) {
                                this.mapaTeclas.disable();

                                var gridActivo = this.tabsubsistemas.getActiveTab().items.items[0];
                                var idsubsistema = this.tabsubsistemas.getActiveTab().getId().split(' ')[1];

                                //Propiedades necesarias para poder mostrar la ventana
                                var id = 'winadd';
                                var animateTarget = 'btnaddclasificador';
                                var accion = 'adicionar';
                                var gridactivo = gridActivo;
                                var objconf = {
                                    idclasificador: '',
                                    idsubsistema: idsubsistema,
                                    idestructuracomun: '',
                                    nombre: '',
                                    descripcion: '',
                                    referenciaclase: '',
                                    ruta: ''
                                };
                                this.addmodClasificadores(id, animateTarget, accion, gridactivo, objconf, idioma);
                            }
                        }
                    }, {
                        key: "m",
                        alt: true,
                        scope: this,
                        fn: function() {
                            if (this.tabsubsistemas.getActiveTab()) {
                                var gridActivo = this.tabsubsistemas.getActiveTab().items.items[0];
                                var selmodel = gridActivo.getSelectionModel();
                                var seleccionados = selmodel.getSelections();

                                if (seleccionados.length === 1) {
                                    this.mapaTeclas.disable();

                                    var record = seleccionados[0];
                                    var id = 'winmod';
                                    var animateTarget = gridActivo.getId();
                                    var accion = 'modificar';
                                    var gridactivo = gridActivo;
                                    var objconf = {
                                        idclasificador: record.data.idclasificador,
                                        idsubsistema: record.data.idsubsistema,
                                        idestructuracomun: record.data.idestructuracomun,
                                        nombre: record.data.nombre,
                                        descripcion: record.data.descripcion,
                                        referenciaclase: record.data.referenciaclase,
                                        ruta: record.data.rutafichero
                                    };
                                    this.addmodClasificadores(id, animateTarget, accion, gridactivo, objconf, idioma);
                                }
                            }
                        }
                    },{
                        key: "b",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var filter = this.getGridSeleccionado().sf;
                            if (filter.getValue()) {
                                filter.onTrigger2Click();
                            } else {
                                filter.focus();
                            }
                        }
                    },{
                        key: "l",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var filter = this.getGridSeleccionado().sf;
                            if (filter.getValue()) {
                                filter.onTrigger1Click();
                            }
                        }
                    },{
                        key: Ext.EventObject.DELETE,
                        scope: this,
                        fn: function() {
                            if (this.tabsubsistemas.getActiveTab()) {
                                var gridActivo = this.tabsubsistemas.getActiveTab().items.items[0];
                                var selmodel = gridActivo.getSelectionModel();
                                var seleccionados = selmodel.getSelections();
                                var mensaje = '';

                                if (seleccionados.length === 1) {
                                    mensaje = idioma.msgEliminarClasificador2;
                                }
                                else if (seleccionados.length > 1) {
                                    mensaje = idioma.msgEliminarClasificador4;
                                }

                                if (seleccionados.length >= 1) {
                                    this.mapaTeclas.disable();

                                    mostrarMensaje(2, mensaje, function(btn) {
                                        if (btn === 'ok') {
                                            this.gridcamposinfo.getStore().removeAll();
                                            this.panelcamposinfo.collapse();

                                            var clasificadores = new Array();
                                            for (var i = 0; i < seleccionados.length; i++) {
                                                clasificadores.push(seleccionados[i].data.idclasificador);
                                            }
                                            this.eliminarClasificadores(clasificadores, idioma, gridActivo);
                                        }
                                        else {
                                            this.mapaTeclas.enable();
                                        }

                                    }.bind(this));
                                }
                            }
                        }
                    }
                ]);

                //bloquear la seleccion del grid que muestra la información
                //de los campos contables
                this.gridcamposinfo.getSelectionModel().lock();

                //Inicializa todos los eventos del componente
                this.inicializarEventos(perfil, idioma);

                //Se termina la carga del componente y se cierra la máscara
                Ext.MessageBox.hide();

                actionValidate.validate(function(){
                    this.tabsubsistemas.createItems();
                },this);
            }
        });
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait:true,
            waitConfig: {interval:300},
            progress: true,
            closable: false
        });
    },
    inicializarEventos: function(perfil, idioma) {
        //btn Adicionar clasificador
        this.btnaddclasificador.on('click', function() {
            this.mapaTeclas.disable();
            //Variable que almacena el grid activo dentro del tab activo
            var gridActivo = this.tabsubsistemas.getActiveTab().items.items[0];
            var idsubsistema = this.tabsubsistemas.getActiveTab().getId().split(' ')[1];

            //Propiedades necesarias para poder mostrar la ventana
            var id = 'winadd';
            var animateTarget = 'btnaddclasificador';
            var accion = 'adicionar';
            var gridactivo = gridActivo;
            var objconf = {
                idclasificador: '',
                idsubsistema: idsubsistema,
                idestructuracomun: '',
                nombre: '',
                descripcion: '',
                referenciaclase: '',
                ruta: ''
            };
            this.addmodClasificadores(id, animateTarget, accion, gridactivo, objconf, idioma);
        }, this);

        //btn Eliminar clasificador
        this.btndelclasificador.on('click', function() {
            this.mapaTeclas.disable();
            var mensaje = idioma.msgEliminarClasificador3;
            mensaje += idioma.msgEliminarClasificador4;
            mostrarMensaje(2, mensaje, function(btn) {
                if (btn === 'ok') {
                    this.gridcamposinfo.getStore().removeAll();
                    this.panelcamposinfo.collapse();

                    var gridActivo = this.tabsubsistemas.getActiveTab().items.items[0];
                    var selmodel = gridActivo.getSelectionModel();
                    var seleccionados = selmodel.getSelections();
                    var clasificadores = new Array();
                    for (var i = 0; i < seleccionados.length; i++) {
                        clasificadores.push(seleccionados[i].data.idclasificador);
                    }
                    this.eliminarClasificadores(clasificadores, idioma, gridActivo);
                }
                else {
                    this.mapaTeclas.enable();                                        
                }
            }.bind(this));
        }, this);

        this.tabsubsistemas.on('beforetabchange', function(tabpanel, newtab, currentTab) {
            this.gridcamposinfo.getStore().removeAll();
            this.panelcamposinfo.collapse();
        }, this);

        this.tabsubsistemas.on('nosubsist', function() {
           Ext.getCmp('btnaddclasificador').setDisabled(true);
           Ext.getCmp('btndelclasificador').setDisabled(true);
        }, this);

        this.tabsubsistemas.on('endload', function(tabpanel) {
            //Refresca la vista del viewport, necesario para que el pagin toolbar salga bien
            this.doLayout();

            //Poniéndole el evento rowaction a los gris pertenecientes
            //a los tabs
            for (var i = 0; i < tabpanel.items.items.length; i++) {
                var gridtab = tabpanel.items.items[i].items.items[0];
                var selmodel = gridtab.getSelectionModel();
                gridtab.on('rowaction', function(grid, record, action, rowIndex, colIndex, e) {
                    switch (action) {
                        case 'modificar':
                            this.mapaTeclas.disable();
                            var id = 'winmod';
                            var animateTarget = grid.getId();
                            var accion = 'modificar';
                            var gridactivo = grid;
                            var objconf = {
                                idclasificador: record.data.idclasificador,
                                idsubsistema: record.data.idsubsistema,
                                idestructuracomun: record.data.idestructuracomun,
                                nombre: record.data.nombre,
                                descripcion: record.data.descripcion,
                                referenciaclase: record.data.referenciaclase,
                                ruta: record.data.rutafichero
                            };
                            this.addmodClasificadores(id, animateTarget, accion, gridactivo, objconf, idioma);
                            break;
                        case 'eliminar':
                            this.mapaTeclas.disable();
                            var mensaje = idioma.msgEliminarClasificador1;
                            mensaje += idioma.msgEliminarClasificador2;
                            mostrarMensaje(2, mensaje, function(btn) {
                                if (btn === 'ok') {
                                    this.gridcamposinfo.getStore().removeAll();
                                    this.panelcamposinfo.collapse();

                                    var clasificador = new Array(record.data.idclasificador);
                                    this.eliminarClasificadores(clasificador, idioma, grid);
                                }
                                else {
                                    this.mapaTeclas.enable();                                    
                                }
                            }.bind(this));
                            break;
                    }
                }, this);

                //Evento para cargar el grid de de la información acerca de los campos
                //asociados con el clasificador seleccionado
                gridtab.on('rowclick', function(grid, rowIndex, e) {
                    this.mostrarInfCamposByClasificador(this.gridcamposinfo, grid.getSelectionModel(), idioma, 'rowclick');
                }, this);

                gridtab.getStore().on('load', function() {
                    this.btnaddclasificador.focus();
                    this.mostrarInfCamposByClasificador(this.gridcamposinfo, gridtab.getSelectionModel(), idioma, 'load');
                }, this);

                //Evento del selection model del grid de cada tab
                selmodel.on({
                    scope: this,
                    rowselect: function(selmodel, rowIndex, record) {
                        if (selmodel.getCount() >= 1) {
                            this.btndelclasificador.enable();
                        }
                        this.mostrarInfCamposByClasificador(this.gridcamposinfo, selmodel, idioma, 'rowselect');
                    },
                    rowdeselect: function(selmodel, rowIndex, record) {
                        if (selmodel.getCount() < 1) {
                            this.btndelclasificador.disable();
                        }
                        this.mostrarInfCamposByClasificador(this.gridcamposinfo, selmodel, idioma, 'rowdeselect');
                    }
                });
            }

            Ext.EventManager.on(this.el, 'keydown', function (e) {
                if (e.getKey() == Ext.EventObject.TAB) {
                    var target = e.getTarget();
                    while (target && target.nodeType === 1 && target !== document.body) {
                        var cmp = Ext.getCmp(target.id);
                        if (cmp && (cmp.text == 'Cancelar' || cmp.text == 'Cancel')) {
                            var dialog = Ext.MessageBox.getDialog(),
                                btncancel = dialog.buttons[3],
                                btnacept = dialog.buttons[0];
                            if(cmp.id == btncancel.id){
                                e.preventDefault();
                                btnacept.focus();
                            }
                            break;
                        }
                        target = target.parentNode;
                    }
                }
            },this);

            Ext.getCmp('btnaddclasificador').setDisabled(false);
        }, this);
    },
    //Función necesaria para esconder y mostrar el panel que tiene el grid
    //que muestra la informacion de los campos contables por cada clasificador
    mostrarInfCamposByClasificador: function(gridcamposinfo, selmodel, idioma, event) {
        var clasificadorsel = selmodel.getSelections();
        if (event === 'rowclick' || event === 'load') {
            if (clasificadorsel.length > 1 || clasificadorsel.length === 0) {
                gridcamposinfo.getStore().removeAll();
                this.panelcamposinfo.collapse(true);
            }
        }
        else if (event === 'rowdeselect' || event === 'rowselect') {
            if (clasificadorsel.length === 1) {
                if (this.panelcamposinfo.collapsed) {
                    this.panelcamposinfo.expand(true);
                }
                var myMask = new Ext.LoadMask(gridcamposinfo.getEl(), {msg: idioma.msgCargando});
                myMask.show();
                gridcamposinfo.getStore().removeAll();
                gridcamposinfo.getStore().load({
                    scope: this,
                    params: {
                        idclasificador: clasificadorsel[0].data.idclasificador
                    },
                    callback: function(record, options, success) {
                        if (selmodel.getSelections().length > 1 || selmodel.getSelections().length === 0) {
                            gridcamposinfo.getStore().removeAll();
                        }
                        myMask.hide();
                    }
                });
            }
        }
    },
    //Función necesaria para adicionar o modificar el clasificador
    addmodClasificadores: function(id, animateTarget, accion, gridactivo, objconf, idioma) {
        new Ext.Conf.ModContb.WindowAdicionar({
            id: id,
            animateTarget: animateTarget,
            accion: accion,
            idclasificador: objconf.idclasificador,
            idsubsistema: objconf.idsubsistema,
            idestructuracomun: objconf.idestructuracomun,
            nombre: objconf.nombre,
            descripcion: objconf.descripcion,
            referenciaclase: objconf.referenciaclase,
            ruta: objconf.ruta,
            listeners: {
                scope: this,
                'close': function() {
                    this.btnaddclasificador.focus();
                    this.mapaTeclas.enable();

                    var myMask = new Ext.LoadMask(gridactivo.getEl(), idioma.msgCargando);
                    myMask.show();
                    gridactivo.getStore().reload({
                        callback: function() {
                            myMask.hide();
                        }
                    });
                },
                'show': function() {
                    this.gridcamposinfo.getStore().removeAll();
                    this.panelcamposinfo.collapse();
                }
            }
        });
    },
    //Función necesaria para poder eliminar uno o varios clasificadores
    eliminarClasificadores: function(arrclasificadores, idioma, gridtab) {
        this.onloadMessageBox(idioma.msgEspere , arrclasificadores.length ==1? idioma.msgEliminando : idioma.msgEliminandos);
        var msgdelSuccess = (arrclasificadores.length > 1) ? idioma.msgDelSuccessClasificadorMany
                : idioma.msgDelSuccessClasificadorOne;
        //Llamada ajax para eliminar
        Ext.Ajax.request({
            method: "POST",
            url: "del",
            scope: this,
            params: {
                ids: Ext.encode(arrclasificadores)
            },
            callback: function(options, success, response) {
                this.mapaTeclas.enable();
                Ext.MessageBox.hide();
                var respuesta = Ext.decode(response.responseText);
                //Si no hay errores
                if (respuesta.errors.length === 0) {
                    mostrarMensaje(1, msgdelSuccess);
                    var myMask = new Ext.LoadMask(gridtab.getEl(), idioma.msgCargando);
                    myMask.show();
                    gridtab.getStore().reload({
                        scope: this,
                        callback: function() {
                            //Esconder el btn eliminar
                            this.btndelclasificador.disable();
                            myMask.hide();
                        }
                    });
                }
                else {
                    this.mostrarErrores(respuesta.errors, gridtab, idioma);
                }
            }
        });
    },
    //Función necesaria para mostrar los errores que hayan existido
    //durante el proceso de eliminado del clasificador
    mostrarErrores: function(errors, gridtab, idioma) {
        var textoMensajeError ='';
        // var textoMensaje = (errors.length === 1) ? idioma.msgErrorOne
        //         : idioma.msgErrorMany;
        // textoMensaje += '<br/><br/><br/>';
        var store = gridtab.getStore();
        for (var i = 0; i < errors.length; i++) {
            var index = store.find('idclasificador', errors[i].id);
            var nombre = store.getAt(index).data.nombre;
            if (errors[i].code === 7 && errors[i].errorcmp === 'clasificador') {
                textoMensaje += idioma.errorClasificador1.replace(/<#>/g, nombre);
            }
            else if (errors[i].code === 6 && errors[i].errorcmp === 'clasificador') {
                textoMensaje += idioma.errorClasificador2.replace(/<#>/g, nombre);
            }
            else if (errors[i].code === 4 && errors[i].errorcmp === 'clasificador') {
                textoMensaje += idioma.errorClasificador3.replace(/<#>/g, nombre);
            }
        }
        //Accion necesaria para cuando haya error pero que la cantidad de estos
        //sea menor que la cantidad de clasificadores seleccionados a eliminarse
        //se recargue el grid, si no pasa esto no es necesario recargar el grid
        //porque los errores son iguales a los clasificadores seleccionados
        var seleccionados = gridtab.getSelectionModel().getSelections();
        mostrarMensaje(3, textoMensaje, function() {
            if (seleccionados.length > 1 && errors.length < seleccionados.length) {
                var myMask = new Ext.LoadMask(gridtab.getEl(), idioma.msgCargando);
                myMask.show();
                gridtab.getStore().reload({
                    callback: function() {
                        myMask.hide();
                    }
                });
            }
        });
    },
    //Retorna el el grid actualmente activo.
    getGridSeleccionado:function(){
        var idactivetab = this.tabsubsistemas.getActiveTab().id;
        var idsubsistema = -2
        if (idactivetab != -2) {
            idsubsistema = idactivetab.substring(4);
        }
        return Ext.getCmp('grid' + idsubsistema);
    }
});


//Inicializando la vista.
Ext.QuickTips.init();

new Ext.Conf.ModContb.GestClasificador({
    idsubsistema: 0
});