/*
 * Componente Suplementos.
 *
 * @author Ing.Beatriz Selema Alvarez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores.Suplementos
 * @copyright XETID
 * @version 1.0
 */

Ext.ns("Pvd.MovimientosLaborales.Nomencladores.Suplementos");
Pvd.MovimientosLaborales.Nomencladores.Suplementos = Ext.extend(Ext.Panel, {
    layout: 'border',
    border: false,
    id: 'suplementos',
    title: 'Suplementos',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {

        //Variables
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaSuplementos',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarS,
            iconCls: 'adicionar',
            handler: function () {
                self.ventanaPlantilla.show();
                self.tpPlantilla.getSelectionModel().clearSelections();
                self.tpPlantilla.getRootNode().reload();
                self.tpPlantilla.expandAll();
            }.createDelegate(this)
        });

        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarS,
            iconCls: 'eliminar',
            handler: function () {
                deleteSuplemento();
            }.createDelegate(this)
        });


        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 140,
            name: 'tfbuscador'
        });

        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscar,
            iconCls: 'buscar',
            handler: function () {
                self.stSuplementos.load({params: {denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: this.idioma.BtnLimpiar,
            tooltip: this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function () {
                self.tfbuscar.reset();
                self.stSuplementos.load({params: {start: 0, limit: 15}});
            }.createDelegate(this)
        });
        this.stSuplementos = new Ext.data.Store({
            url: 'getSuplementos',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name: 'idsuplemento'}, {name: 'denominacion'}, {name: 'idplantilla'}, {name: 'tipoplantilla'}]
            ),
            listeners: {
                load: function (st) {
                    self.btnEliminar.disable();
                }
            }
        });

        this.stSuplementos.load({params: {start: 0, limit: 15}});


        //Listado de tipos de contrato.
        this.gpSuplementos = new Ext.grid.GridPanel({
            store: this.stSuplementos,
            border: false,
            loadMask: {msg: 'Cargando...'},
            tbar: [
                this.idioma.lbDenominacion + ':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar
            ],
            columns: [
                {
                    header: this.idioma.lbDenominacion,
                    width: 400,
                    dataIndex: 'denominacion'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stSuplementos,
                displayInfo: true
            }),
            keys: [
                {
                    key: 'i',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionar.disabled) {
                            self.btnAdicionar.handler();
                        }

                    }
                },
                {
                    key: 46,//Eliminar
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                }
            ]
        });

        this.gpSuplementos.getSelectionModel().on('rowselect', function (n) {
            self.btnEliminar.enable();
        }, this);

        this.panel2 = new Ext.Panel({
            layout: 'fit',
            region: 'north',
            border: false,
            tbar: [
                this.btnAdicionar,
                this.btnEliminar,
                '->', this.btnAyuda]
        });

        this.btnCerrar = new Ext.Button({
            iconCls: 'cerrar',
            tooltip: this.idioma.textToolTipCerrar,
            text: 'Cerrar',
            handler: function () {
                self.ventanaPlantilla.hide();
            }.createDelegate(this)
        });

        this.btnGuardar = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.btnGuard,
            handler: function () {
                guardarSuplemento('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            disabled: true,
            tooltip: this.idioma.lbBtnAplicar,
            text: 'Aplicar',
            handler: function () {
                guardarSuplemento('APL');
            }.createDelegate(this)
        });

        this.tlPlantilla = new Ext.tree.TreeLoader({
            dataUrl: 'getTiposPlantilla',
            baseParams: {idconfiguracion: 203},
            preloadChildren: false,
            listeners: {
                beforeload: function (treeLoader, node) {
                    if (node.attributes.hoja == true) {
                        treeLoader.baseParams.idtipoplantilla = node.attributes.id;
                    } else {
                        treeLoader.baseParams.idtipoplantilla = -1;
                    }
                }
            }
        });
        this.tpPlantilla = new Ext.tree.TreePanel({
            split: true,
            minSize: 175,
            maxSize: 350,
            margins: '0 0 5 5',
            cmargins: '0 5 5 5',
            width: 250,
            region: 'center',
            animate: true,
            autoScroll: true,
            loader: this.tlPlantilla,
            containerScroll: true,
            rootVisible: false,
            layout: 'fit',
            root: new Ext.tree.AsyncTreeNode({
                text: 'Raiz',
                id: 'root'
            }),
            listeners: {
                click: function (node) {
                    if (node.attributes.leaf == false) {
                        self.btnGuardar.disable();
                        self.btnAplicar.disable();
                    } else {
                        self.btnGuardar.enable();
                        self.btnAplicar.enable();
                    }
                }
            }
        });
        this.ventanaPlantilla = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            constrain: true,
            title: 'Asociar plantilla',
            width: 500,
            height: 400,
            items: [this.tpPlantilla],
            buttons: [
                this.btnCerrar,
                this.btnAplicar,
                this.btnGuardar,

            ],
            keys: [{
                key: 88,
                alt: true,
                ctrl: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCerrar.disabled) {
                        self.btnCerrar.handler();
                    }
                }
            },
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnGuardar.disabled) {
                            self.btnGuardar.handler();
                        }
                    }
                }]
        });


        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.gpSuplementos]
        });
        this.items = [this.panel2, this.panel];

        function guardarSuplemento(btn) {
            if (self.tpPlantilla.getSelectionModel().getSelectedNode()) {
                var idp = self.tpPlantilla.getSelectionModel().getSelectedNode().attributes.idplantilla;
                Ext.getBody().mask('Guardando suplemento...');
                Ext.Ajax.request({
                    url: 'guardarSuplemento',
                    params: {
                        idplantilla: idp
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == true) {

                            mostrarMensaje(1, 'El suplemento  ha sido adicionado satisfactoriamente.');
                            self.stSuplementos.reload();
                            if (btn == 'ACP') {
                                self.ventanaPlantilla.hide();
                            }


                        } else
                            mostrarMensaje(6, 'El suplemento que quiere adicionar ya existe.');
                    }
                });
            }
        }

        function deleteSuplemento() {
            var ids = new Array();
            var s = self.gpSuplementos.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idsuplemento);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el suplemento seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los suplementos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'deleteSuplemento',
                        params: {idsuplemento: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El suplemento seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los suplementos seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El suplemento ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los suplementos han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stSuplementos.reload();
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    }

                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.Nomencladores.Suplementos.superclass.initComponent.call(this);
    }
});
