/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.GestDesagregacionPresup
 * @extends Ext.Viewport
 */
Ext.namespace('Ext.Cont.GestDesagregacionPresup');
Ext.Cont.GestDesagregacionPresup = Ext.extend(Ext.Viewport, {
    //Properties and Variables
    //Functions
    constructor: function(params) {
        //idioma del sistema
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';
        this.onloadMessageBox(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            scope: this,
            callback: function(options, success, response)
            {
                var idioma = Ext.decode(response.responseText);
                var perfil = window.parent.perfil;

                params.lbDescripcion = new Ext.form.Label({
                    id: 'lbDescripcion',
                    style: 'font-size:13px;font-weight:bold;',
                    text: idioma.textLabel
                });

                params.btnAyudaDesagregacionPresup = new Ext.Button({
                    id: 'btnAyudaDesagregacionPresup',
                    text: idioma.lbbtnayuda,
                    tooltip: idioma.tooltipayuda,
                    iconCls: 'ayuda'
                });

                params.btnAdicionar = new Ext.Button({
                    id: 'btnAdicionar',
                    text: idioma.lbAceptar,
                    tooltip: idioma.tooltipAceptar,
                    iconCls: 'adicionar',
                    hidden: true
                });

                params.btnModificar = new Ext.Button({
                    id: 'btnModificar',
                    text: idioma.lbModificar,
                    tooltip: idioma.tooltipModificar,
                    iconCls: 'modificar',
                    disabled: true,
                    hidden: true
                });

                params.btnEliminar = new Ext.Button({
                    id: 'btnEliminar',
                    text: idioma.lbEliminar,
                    tooltip: idioma.tooltipEliminar,
                    iconCls: 'modificar',
                    disabled: true,
                    hidden: true
                });

                params.cbEjercicio = new Ext.form.ComboBox({
                    id: 'cbEjercicio',
                    anchor: '100%',
                    fieldLabel: idioma.lbEjercicio,
                    allowBlank: false,
                    forceSelection: true,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    enableKeyEvents: true,
                    editable: false,
                    store: params.stEjercicio = new Ext.data.JsonStore({
                        url: 'cargarEjercicios',
                        root: 'datos',
                        fields: [
                            {
                                name: 'idejercicio'
                            }, {
                                name: 'nombre'
                            }
                        ],
                        sortInfo: {
                            field: 'idejercicio',
                            direction: 'ASC'
                        }
                    }),
                    valueField: 'idejercicio',
                    displayField: 'nombre'
                });

                params.gpDesagregacion = new Ext.grid.GridPanel({
                    id: 'gpDesagregacion',
                    stripeRows: true,
                    store: new Ext.data.Store({
                        reader: new Ext.data.JsonReader({
                            id: 'readerDesagregacion'
                        },
                        []
                                )
                    }),
                    columns: [],
                    sm: new Ext.grid.RowSelectionModel({singleSelect: false}),
                    frame: false,
                    header: true,
                    region: 'center',
                    border: false,
                    tbar: [params.btnAdicionar, params.btnModificar, params.btnEliminar]
                });

                Ext.apply(this, params);
                Ext.apply(this, {
                    layout: 'fit',
                    items: [{
                            layout: 'border',
                            items: [
                                {
                                    region: 'center',
                                    layout: 'border',
                                    border: false,
                                    tbar: [params.lbDescripcion, ' ', '-', params.cbEjercicio, '->', params.btnAyudaDesagregacionPresup],
                                    items: [params.gpDesagregacion]
                                }
                            ]
                        }]
                });

                Ext.Cont.GestDesagregacionPresup.superclass.constructor.call(this);

                //Keymap necesario para el trabajo con las teclas rápidas
                this.mapaTeclas = new Ext.KeyMap(this.getEl(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function() {
                        }
                    }, {
                        key: "m",
                        alt: true,
                        scope: this,
                        fn: function() {
                        }
                    }, {
                        key: Ext.EventObject.DELETE,
                        scope: this,
                        fn: function() {
                        }
                    }
                ]);

                //Inicializa todos los eventos del componente
                this.inicializarEventos(perfil, idioma);

                params.stEjercicio.load({
                    callback: function() {
                        //Se termina la carga del componente y se cierra la máscara
                        Ext.MessageBox.hide();
                    }
                });
            }
        });
    },
    onloadMessageBox: function(agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    inicializarEventos: function(perfil, idioma) {

        this.cbEjercicio.on({
            scope: this,
            select: function(combo, record, index) {
                this.reconfigurarGrid(record.data.idejercicio, record.data.nombre, idioma);
            }
        });

        this.gpDesagregacion.on({
            scope: this,
            rowclick: function(grid, rowIndex, event) {
                var seleccionados = grid.getSelectionModel().getSelections();
                var cant = seleccionados.length;

                if (cant === 0) {
                    this.btnModificar.disable();
                    this.btnEliminar.disable();
                }
                else if (cant === 1) {
                    this.btnModificar.enable();
                    this.btnEliminar.enable();
                }
                else {
                    this.btnModificar.disable();
                    this.btnEliminar.enable();
                }
            }
        });

        this.gpDesagregacion.getSelectionModel().on({
            scope: this,
            rowselect: function(selmodel, rowIndex, record) {

            },
            rowdeselect: function(selmodel, rowIndex, record) {

            }
        });

        this.btnAdicionar.on({
            scope: this,
            click: function(button, event) {
                this.showWindow('adicionar', perfil, idioma, this.cbEjercicio.getValue(), this.cbEjercicio.getRawValue());
            }
        });

        this.btnModificar.on({
            scope: this,
            click: function(button, event) {
                this.showWindow('modificar', perfil, idioma, this.cbEjercicio.getValue(), this.cbEjercicio.getRawValue());
            }
        });

        this.btnEliminar.on({
            scope: this,
            click: function(button, event) {
                this.eliminarDesagregacion(idioma, this.cbEjercicio.getValue(), this.cbEjercicio.getRawValue());
            }
        });

    },
    reconfigurarGrid: function(idejercicio, nombreejercicio, idioma) {
        var myMask = new Ext.LoadMask(this.gpDesagregacion.getEl(), {msg: idioma.msgCargando});
        myMask.show();

        this.gpDesagregacion.setTitle(idioma.titleGrdiDesagregacion + nombreejercicio);

        Ext.Ajax.request({
            method: "POST",
            url: "loadGeneralData",
            params: {
                idejercicio: idejercicio,
                nombreejercicio: nombreejercicio
            },
            scope: this,
            callback: function(options, success, response)
            {

                var responseData = Ext.decode(response.responseText);
                var periodos = responseData.periodos;
                var datosStore = responseData.datosStore;

                //Creando el colum model
                var arrcolumnas = new Array();
                arrcolumnas.push({header: idioma.headerNivel, width: 150, dataIndex: 'nombreformato', align: 'left'});
                arrcolumnas.push({header: idioma.headerCuenta, width: 300, dataIndex: 'cuenta', align: 'left'});
                arrcolumnas.push({header: idioma.headerPlanTotal, width: 120, dataIndex: 'saldototal', align: 'right'});

                var arrfieldsstore = new Array();
                arrfieldsstore.push({name: 'idparteformato'});
                arrfieldsstore.push({name: 'nombreformato'});
                arrfieldsstore.push({name: 'idcuenta'});
                arrfieldsstore.push({name: 'cuenta'});
                arrfieldsstore.push({name: 'saldototal'});
                arrfieldsstore.push({name: 'iddesagregacionpresupejercicio'});
                arrfieldsstore.push({name: 'idejercicio'});
                arrfieldsstore.push({name: 'idestructuracomun'});

                for (var i = 0, long = periodos.length; i < long; i++) {
                    //Column Model
                    arrcolumnas.push({header: periodos[i].nombre, width: 110, dataIndex: 'saldo' + periodos[i].nombre + nombreejercicio, align: 'right'});

                    //Store
                    arrfieldsstore.push({name: 'saldo' + periodos[i].nombre + nombreejercicio});
                }

                //Creando el Colunm Model
                var columnmodel = new Ext.grid.ColumnModel(arrcolumnas);
                //Creando el Store
                var store = new Ext.data.Store({
//                    sortInfo: {field: 'orden', direction: "ASC"},
                    reader: new Ext.data.JsonReader({
                        id: 'iddesagregacionpresupejercicio',
                        root: 'datos',
                        totalProperty: 'cant'
                    },
                    arrfieldsstore)
                });

                store.loadData(datosStore);
                this.gpDesagregacion.reconfigure(store, columnmodel);

                this.btnAdicionar.show();
                this.btnModificar.show();
                this.btnEliminar.show();
                
                this.btnModificar.setDisabled(true);
                this.btnEliminar.setDisabled(true);
                this.gpDesagregacion.getSelectionModel().clearSelections();

                myMask.hide();
            }
        });
    },
    showWindow: function(accion, perfil, idioma, idejercicio, nombreejercicio) {
        var paramsMod = {};
        if (accion == 'modificar') {
            var paramsMod = this.gpDesagregacion.getSelectionModel().getSelected().data;
        }
        new Ext.Cont.WindowAddModDesagregacionPresup({
            id: 'winAddModDesagregacion',
            accion: accion,
            perfil: perfil,
            idioma: idioma,
            idejercicio: idejercicio,
            nombreejercicio: nombreejercicio,
            paramsMod: paramsMod,
            storeDesagregacion: this.gpDesagregacion.getStore()
        }).on({
            scope: this,
            close: function() {
                this.reconfigurarGrid(idejercicio, nombreejercicio, idioma);
            }
        });
    },
    eliminarDesagregacion: function(idioma, idejercicio, nombreejercicio) {
        var seleccionados = this.gpDesagregacion.getSelectionModel().getSelections();
        var msgPregunta = (seleccionados.length > 1) ? idioma.msgPreguntaEliminarMany : idioma.msgPreguntaEliminarOne;
        mostrarMensaje(2, msgPregunta, function(btn) {
            if (btn == 'ok') {
                var idsseleccionados = new Array();
                for (var i = 0, long = seleccionados.length; i < long; i++) {
                    idsseleccionados.push(seleccionados[i].data.iddesagregacionpresupejercicio);
                }

                this.onloadMessageBox(idioma.msgEliminando, idioma.msgEspere);

                Ext.Ajax.request({
                    method: "POST",
                    url: "delDesagregacion",
                    params: {
                        idsseleccionados: Ext.encode(idsseleccionados)
                    },
                    scope: this,
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        
                        if(responseData.success) {
                            var msgEliminadoSuccess = (seleccionados.length > 1) ? idioma.msgEliminadoSuccessMany : idioma.msgEliminadoSuccessOne;
                            
                            mostrarMensaje(1, msgEliminadoSuccess);
                            this.reconfigurarGrid(idejercicio, nombreejercicio, idioma);
                        }

                        Ext.MessageBox.hide();
                    }
                });
            }
        }.bind(this));
    }
});


//Inicializando la vista.
Ext.QuickTips.init();

new Ext.Cont.GestDesagregacionPresup({
});