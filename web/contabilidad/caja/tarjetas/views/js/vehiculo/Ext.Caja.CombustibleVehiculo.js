/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Caja.CombustibleVehiculo
 * @extends Ext.Viewport
 */
Ext.namespace('Ext.Caja.CombustibleVehiculo');
Ext.Caja.CombustibleVehiculo = Ext.extend(Ext.Viewport, {
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
                Ext.MessageBox.hide();
                var idioma = Ext.decode(response.responseText);
                var perfil = window.parent.perfil;

                params.btnAyudaVehiculo = new Ext.Button({
                    id: 'btnAyudaVehiculo',
                    text: idioma.lbbtnayuda,
                    tooltip: idioma.tooltipayuda,
                    iconCls: 'ayuda'
                });

                params.btnAdicionarCom = new Ext.Button({
                    id: 'btnAdicionarCom',
                    text: idioma.lbAdicionar,
                    tooltip: idioma.tooltipAdicionarCom,
                    iconCls: 'adicionar'
                });

                params.btnAdicionarVeh = new Ext.Button({
                    id: 'btnAdicionarVeh',
                    text: idioma.lbAdicionar,
                    tooltip: idioma.tooltipAdicionarVeh,
                    iconCls: 'adicionar',
                    disabled: true
                });

                params.btnModificarCom = new Ext.Button({
                    id: 'btnModificarCom',
                    text: idioma.lbModificar,
                    tooltip: idioma.tooltipModificarCom,
                    iconCls: 'modificar',
                    disabled: true
                });

                params.btnModificarVeh = new Ext.Button({
                    id: 'btnModificarVeh',
                    text: idioma.lbModificar,
                    tooltip: idioma.tooltipModificarVeh,
                    iconCls: 'modificar',
                    disabled: true
                });

                params.btnEliminarCom = new Ext.Button({
                    id: 'btnEliminarCom',
                    text: idioma.lbEliminar,
                    tooltip: idioma.tooltipEliminarCom,
                    iconCls: 'eliminar',
                    disabled: true
                });

                params.btnEliminarVeh = new Ext.Button({
                    id: 'btnEliminarVeh',
                    text: idioma.lbEliminar,
                    tooltip: idioma.tooltipEliminarVeh,
                    iconCls: 'eliminar',
                    disabled: true
                });
                
                params.btnAyuda = new Ext.Button({
                    id: 'btnAyudaComVeh',
                    text: idioma.lbbtnayuda,
                    tooltip: idioma.tooltipayuda,
                    iconCls: 'ayuda'
                });

                params.gpGestCombustible = new Ext.grid.GridPanel({
                    store: params.stCombustible = new Ext.data.Store({
                        url: 'loadCombustible',
                        reader: new Ext.data.JsonReader({
                            root: 'datos'
                        }, [
                            {name: 'idcombustible'},
                            {name: 'denominacion'},
                            {name: 'precio'},
                            {name: 'enuso'}
                        ])
                    }),
                    sm: params.smCombustible = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    }),
                    loadMask: true,
                    stripeRows: true,
                    region: 'center',
                    autoExpandColumn: 'denominacion',
                    columns: [
                        {
                            id: 'denominacion',
                            header: idioma.headerDenomCom,
                            sortable: true,
                            width: 150,
                            dataIndex: 'denominacion'
                        }, {
                            header: idioma.headerPrecio,
                            sortable: true,
                            width: 140,
                            dataIndex: 'precio',
                            align: 'right',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                return '<span style="color:green;">' + formatoMonedaABS(value) + '</span>';
                            }
                        }, {
                            header: idioma.headerEnUso,
                            sortable: false,
                            width: 65,
                            dataIndex: 'enuso',
                            align: 'center',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                if (value) {
                                    metadata.attr = 'ext:qtip="<p>' + idioma.tooltipEnUsoCom + '</p>"';
                                    metadata.css = 'icondistra-multiplicar';
                                }
                                else {
                                    metadata.attr = 'ext:qtip="<p>' + idioma.tooltipSinUsoCom + '</p>"';
                                    metadata.css = 'icondistra-cero rojo';
                                }
                            }
                        }
                    ],
                    tbar: [params.btnAdicionarCom, params.btnModificarCom, params.btnEliminarCom],
                    bbar: new Ext.Cont.PagingToolbar({
                        pageSize: 100,
                        store: params.stCombustible,
                        displayInfo: true,
                        displayMsg: 'Resultados de {0} - {1} de {2}',
                        emptyMsg: "No hay resultados para mostrar."
                    }),
                });

                params.gpGestVehiculo = new Ext.grid.GridPanel({
                    store: params.stVehiculo = new Ext.data.Store({
                        url: 'loadVehiculo',
                        reader: new Ext.data.JsonReader({
                            root: 'datos'
                        }, [
                            {name: 'idvehiculo'},
                            {name: 'denominacion'},
                            {name: 'matricula'},
                            {name: 'idtrabajdorresponsable'},
                            {name: 'responsable'},
                            {name: 'idcentrocosto'},
                            {name: 'centrocosto'},
                            {name: 'idcombustible'},
                            {name: 'enuso'}
                        ])
                    }),
                    sm: params.smVehiculo = new Ext.grid.RowSelectionModel({
                        singleSelect: false
                    }),
                    loadMask: true,
                    stripeRows: true,
                    region: 'center',
//                    autoExpandColumn: 'denominacion',
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [
                        {
                            id: 'denominacion',
                            header: idioma.headerDenomVeh,
                            sortable: true,
                            width: 300,
                            dataIndex: 'denominacion'
                        }, {
                            header: idioma.headerMatricula,
                            sortable: true,
                            width: 120,
                            dataIndex: 'matricula',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                return '<span style="color:red;font-weight:bold;">' + value + '</span>';
                            }
                        }, {
                            header: idioma.headerResponsable,
                            sortable: true,
                            width: 250,
                            dataIndex: 'responsable',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                return '<span style="font-style:italic;font-weight:bold;">' + value + '</span>';
                            }
                        }, {
                            header: idioma.headerCentroCosto,
                            sortable: true,
                            width: 300,
                            dataIndex: 'centrocosto'
                        }, {
                            header: idioma.headerEnUso,
                            sortable: false,
                            width: 65,
                            dataIndex: 'enuso',
                            align: 'center',
                            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                if (value) {
                                    metadata.attr = 'ext:qtip="<p>' + idioma.tooltipEnUsoVeh + '</p>"';
                                    metadata.css = 'icondistra-uno';
                                }
                                else {
                                    metadata.attr = 'ext:qtip="<p>' + idioma.tooltipSinUsoVeh + '</p>"';
                                    metadata.css = 'icondistra-cero rojo';
                                }
                            }
                        }
                    ],
                    tbar: [params.btnAdicionarVeh, params.btnModificarVeh, params.btnEliminarVeh],
                    bbar: new Ext.Cont.PagingToolbar({
                        pageSize: 100,
                        store: params.stVehiculo,
                        displayInfo: true,
                        displayMsg: 'Resultados de {0} - {1} de {2}',
                        emptyMsg: "No hay resultados para mostrar."
                    }),
                });

                Ext.apply(this, params);
                Ext.apply(this, {
                    layout: 'fit',
                    items: [{
                            layout: 'border',
                            border: false,
                            tbar: ['->', params.btnAyuda],
                            items: [
                                {
                                    title: idioma.titleGestCombustible,
                                    region: 'west',
                                    border: false,
                                    width: 530,
                                    frame: true,
                                    split: true,
                                    layout: 'border',
                                    items: [params.gpGestCombustible]
                                },
                                {
                                    title: idioma.titleGestVehiculo,
                                    region: 'center',
                                    border: false,
                                    frame: true,
                                    layout: 'border',
                                    items: [params.gpGestVehiculo]
                                }
                            ]
                        }]
                });

                Ext.Caja.CombustibleVehiculo.superclass.constructor.call(this);

                //Inicializa todos los eventos del componente
                this.inicializarEventos(perfil, idioma);

                //Mapa de teclas
                this.globalKeyMap = new Ext.KeyMap(Ext.getBody());
                this.globalKeyMap.accessKey = function(key, handler, scope) {
                    var h = function(n, e) {
                        e.preventDefault();
                        handler.call(scope || this, n, e);
                    };
                    this.on(key, h, scope);
                };

                //Mapa de teclas del combustible
                this.globalKeyMap.accessKey({
                    key: 'i',
                    alt: true
                }, function() {
                    if (!this.btnAdicionarCom.disabled) {
                        this.showWindowCombustible(idioma, perfil, 'adicionar');
                    }
                }, this);

                this.globalKeyMap.accessKey({
                    key: 'm',
                    alt: true
                }, function() {
                    if (!this.btnModificarCom.disabled) {
                        this.showWindowCombustible(idioma, perfil, 'modificar');
                    }
                }, this);

                this.globalKeyMap.accessKey({
                    key: Ext.EventObject.DELETE,
                    alt: true
                }, function() {
                    if (!this.btnEliminarCom.disabled) {
                        this.deleteCombustible(idioma);
                    }
                }, this);

                //Mapa de teclas del vehículo
                this.globalKeyMap.accessKey({
                    key: 'i',
                    shift: true
                }, function() {
                    if (!this.btnAdicionarVeh.disabled) {
                        this.showWindowVehiculo(idioma, perfil, 'adicionar');
                    }
                }, this);

                this.globalKeyMap.accessKey({
                    key: 'm',
                    shift: true
                }, function() {
                    if (!this.btnModificarVeh.disabled) {
                        this.showWindowVehiculo(idioma, perfil, 'modificar');
                    }
                }, this);

                this.globalKeyMap.accessKey({
                    key: Ext.EventObject.DELETE,
                    shift: true
                }, function() {
                    if (!this.btnEliminarVeh.disabled) {
                        this.deleteVehiculo(idioma);
                    }
                }, this);

                //Mandar a cargar los stores de los grid
                this.stCombustible.load();
                this.btnAdicionarCom.focus(true, 1000);
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

        this.btnAdicionarCom.on({
            scope: this,
            click: function() {
                this.showWindowCombustible(idioma, perfil, 'adicionar');
            }
        });

        this.btnModificarCom.on({
            scope: this,
            click: function() {
                this.showWindowCombustible(idioma, perfil, 'modificar');
            }
        });

        this.btnEliminarCom.on({
            scope: this,
            click: function() {
                this.deleteCombustible(idioma);
            }
        });

        this.btnAdicionarVeh.on({
            scope: this,
            click: function() {
                this.showWindowVehiculo(idioma, perfil, 'adicionar');
            }
        });

        this.btnModificarVeh.on({
            scope: this,
            click: function() {
                this.showWindowVehiculo(idioma, perfil, 'modificar');
            }
        });

        this.btnEliminarVeh.on({
            scope: this,
            click: function() {
                this.deleteVehiculo(idioma);
            }
        });

        this.smCombustible.on({
            scope: this,
            rowselect: function(selmodel, rowIndex, record) {
                this.rowClickCombustible();
            },
            rowdeselect: function(selmodel, rowIndex, record) {
                this.rowClickCombustible();
            }
        });

        this.gpGestCombustible.on({
            scope: this,
            rowdblclick: function(grid, rowIndex, event) {
                this.smCombustible.clearSelections();
                this.smCombustible.selectRow(rowIndex);

                this.loadVehiculo();
            },
            rowclick: function(grid, rowIndex, event) {
            }
        });

        this.stCombustible.on({
            scope: this,
            load: function() {
                this.btnModificarCom.disable();
                this.btnEliminarCom.disable();
                this.btnAdicionarVeh.disable();
                
                this.stVehiculo.removeAll();
            }
        });

        this.smVehiculo.on({
            scope: this,
            rowselect: function(selmodel, rowIndex, record) {
                this.rowClickVehiculo();
            },
            rowdeselect: function(selmodel, rowIndex, record) {
                this.rowClickVehiculo();
            }
        });

        this.gpGestVehiculo.on({
            scope: this,
            rowclick: function(grid, rowIndex, event) {
            }
        });

        this.stVehiculo.on({
            scope: this,
            clear: function(store) {
                this.btnModificarVeh.disable();
                this.btnEliminarVeh.disable();
            },
            beforeload: function(store) {
                var idcombustible = this.smCombustible.getSelected().data.idcombustible;
                store.baseParams.idcombustible = idcombustible;
            },
            load: function(store, records, options) {
                this.btnModificarVeh.disable();
                this.btnEliminarVeh.disable();

                this.changeUsoByCantidaddeVehiculo();
            }
        });
    },
    loadVehiculo: function() {
        this.stVehiculo.load();
    },
    showWindowCombustible: function(idioma, perfil, accion) {
        var paramsMod = null;
        if (accion == 'modificar') {
            var paramsMod = this.smCombustible.getSelected().data;
        }

        new Ext.Caja.WindowAddModCombustible({
            id: 'wincombustible',
            idioma: idioma,
            perfil: perfil,
            accion: accion,
            paramsMod: paramsMod,
            globalKeyMap: this.globalKeyMap,
            stCombustible: this.stCombustible
        });
    },
    showWindowVehiculo: function(idioma, perfil, accion) {
        var paramsMod = null;
        if (accion == 'modificar') {
            var paramsMod = this.smVehiculo.getSelected().data;
        }

        new Ext.Caja.WindowAddModVehiculo({
            id: 'winvehiculo',
            idioma: idioma,
            perfil: perfil,
            accion: accion,
            paramsMod: paramsMod,
            globalKeyMap: this.globalKeyMap,
            stVehiculo: this.stVehiculo,
            idcombustible: this.smCombustible.getSelected().data.idcombustible
        });
    },
    rowClickCombustible: function() {
        var cantselected = this.smCombustible.getSelections().length;
        if (cantselected === 0) {
            this.stVehiculo.removeAll();

            this.btnModificarCom.disable();
            this.btnEliminarCom.disable();
            this.btnAdicionarVeh.disable();
        }
        else if (cantselected === 1) {
            this.btnModificarCom.enable();
            this.btnEliminarCom.enable();
            this.btnAdicionarVeh.enable();

            var selected = this.smCombustible.getSelected().data;
            if (selected.idcombustible != this.idcombustibleTemp) {
                this.stVehiculo.removeAll();
                this.idcombustibleTemp = selected.idcombustible;
            }
        }
        else {
            this.stVehiculo.removeAll();

            this.btnModificarCom.disable();
            this.btnEliminarCom.enable();
            this.btnAdicionarVeh.disable();
        }

        //Validar el uso del combustible, activa o desactiva el boton eliminar si esta en uso o no
        this.validateTheUseCombustible();
    },
    validateTheUseCombustible: function() {
        var seleccionados = this.smCombustible.getSelections();

        var cont = 0;
        for (var i = 0, long = seleccionados.length; i < long; i++) {
            if (seleccionados[i].data.enuso == true) {
                cont++;
                break;
            }
        }
        if (cont === 0 && seleccionados.length != 0) {
            this.btnEliminarCom.enable();
        }
        else {
            this.btnEliminarCom.disable();
        }
    },
    rowClickVehiculo: function() {
        var cantselected = this.smVehiculo.getSelections().length;

        if (cantselected === 0) {
            this.btnModificarVeh.disable();
            this.btnEliminarVeh.disable();
        }
        else if (cantselected === 1) {
            this.btnModificarVeh.enable();
            this.btnEliminarVeh.enable();
        }
        else {
            this.btnModificarVeh.disable();
            this.btnEliminarVeh.enable();
        }

        //Validar el uso del vehículo por el componente tarjeta de caja
        this.validateTheUseVehiculo();
    },
    validateTheUseVehiculo: function() {
        var seleccionados = this.smVehiculo.getSelections();

        var cont = 0;
        for (var i = 0, long = seleccionados.length; i < long; i++) {
            if (seleccionados[i].data.enuso) {
                cont++;
                break;
            }
        }
        if (cont === 0 && seleccionados.length != 0) {
            this.btnEliminarVeh.enable();
        }
        else {
            this.btnEliminarVeh.disable();
        }
    },
    deleteCombustible: function(idioma) {
        this.globalKeyMap.disable();
        mostrarMensaje(2, idioma.msgPreguntaEliminarCom, function(btn) {
            if (btn == 'ok') {
                this.onloadMessageBox(idioma.titleEliminando, idioma.msgEspere);

                var seleccionados = this.smCombustible.getSelections();
                var cantseleccionados = seleccionados.length;
                var idseliminar = new Array();
                for (var i = 0; i < cantseleccionados; i++) {
                    idseliminar.push(seleccionados[i].data.idcombustible);
                }

                Ext.Ajax.request({
                    method: "POST",
                    url: "deleteCombustible",
                    params: {
                        idseliminar: Ext.encode(idseliminar)
                    },
                    scope: this,
                    callback: function(options, success, response)
                    {
                        Ext.MessageBox.hide();
                        this.globalKeyMap.enable();
                        var res = Ext.decode(response.responseText);

                        if (res.success) {
                            var msgSuccess = (cantseleccionados > 1) ? idioma.msgEliminarSuccessManyCom : idioma.msgEliminarSuccessOneCom;
                            mostrarMensaje(1, msgSuccess);
                            this.stCombustible.reload();
                        } else {
                            mostrarMensaje(1, idioma.msgDelNoCombusEntidad);
                        }
                    }
                });
            }
            else {
                this.globalKeyMap.enable();
            }
        }.bind(this));
    },
    deleteVehiculo: function(idioma) {
        this.globalKeyMap.disable();
        mostrarMensaje(2, idioma.msgPreguntaEliminarVeh, function(btn) {
            if (btn == 'ok') {
                this.onloadMessageBox(idioma.titleEliminando, idioma.msgEspere);

                var seleccionados = this.smVehiculo.getSelections();
                var cantseleccionados = seleccionados.length;
                var idseliminar = new Array();
                for (var i = 0; i < cantseleccionados; i++) {
                    idseliminar.push(seleccionados[i].data.idvehiculo);
                }

                Ext.Ajax.request({
                    method: "POST",
                    url: "deleteVehiculo",
                    params: {
                        idseliminar: Ext.encode(idseliminar)
                    },
                    scope: this,
                    callback: function(options, success, response)
                    {
                        Ext.MessageBox.hide();
                        this.globalKeyMap.enable();
                        var res = Ext.decode(response.responseText);

                        if (res.success) {
                            var msgSuccess = (cantseleccionados > 1) ? idioma.msgEliminarSuccessManyVeh : idioma.msgEliminarSuccessOneVeh;
                            mostrarMensaje(1, msgSuccess);

                            this.stVehiculo.reload();
                        }
                    }
                });
            }
            else {
                this.globalKeyMap.enable();
            }
        }.bind(this));
    },
    changeUsoByCantidaddeVehiculo: function() {
        var combustibleSeleccionado = this.smCombustible.getSelected();
        if (!Ext.isEmpty(combustibleSeleccionado)) {

            if (this.stVehiculo.getCount() > 0) {
                combustibleSeleccionado.set('enuso', true);
                this.btnEliminarCom.disable();
            }
            else {
                combustibleSeleccionado.set('enuso', false);
                this.btnEliminarCom.enable();
            }
            combustibleSeleccionado.commit();
        }
    }
});


//Inicializando la vista.
Ext.QuickTips.init();

new Ext.Caja.CombustibleVehiculo({
});