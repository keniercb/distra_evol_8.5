/*
 * Componente Costos.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.SST.Gestionaraccidentes');
Pvd.SST.Gestionaraccidentes.PanelCostos = Ext.extend(Ext.Panel, {
    layout: 'fit',
    border: false,
    id: 'PanelCostos',
    title: 'Costos',
    region: 'center',
    height: 500,
    initComponent: function() {
        var self = this;
        var objselect, accion;

        //Fuente de datos del listado de costos.
        this.stCostos = new Ext.data.Store({
            url: 'getCostos',
            reader: new Ext.data.JsonReader(
                    {root: "datos", id: "idaccidentecosto", totalProperty: "cantidad"},
            [
                {name: 'idaccidentecosto'},
                {name: 'denominacion'},
                {name: 'importe'},
                {name: 'fregistro'}
            ]
                    ),
            listeners: {
                load: function(st, data) {
                    self.btnEliminarCosto.disable();
                    self.btnModificarCosto.disable();
                    if (data.length == 0) {
                        self.btnVerCosto.disable();
                        if (self.sfBuscarCosto.getValue() == '') {
                            mostrarMensaje(1, "No existen datos que mostrar.");
                        } else {
                            mostrarMensaje(1, "No existen datos que se correspondan con el criterio de búsqueda especificado.");
                        }
                    } else {
                        self.btnVerCosto.enable();
                        var total = 0;
                        self.stCostos.each(function(rec){
                            total += parseInt(rec.data.importe);
                        });
                        var recordTotal = new Ext.data.Record({
                            idaccidentecosto: 0,
                            denominacion: 'Total',
                            fregistro: null,
                            importe: total + '.00'
                        });
                        self.stCostos.add(recordTotal);
                    }
                }
            }
        });

        this.sfBuscarCosto = new Ext.app.SearchField({
            store: self.stCostos,
            emptyText: 'Criterio de búsqueda',
            toolTipTrigger1: self.idioma.lbBtnLimpiar,
            toolTipTrigger2: self.idioma.lbBtnBuscarCos
        });

        this.smselect = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        //Listado de costos.
        this.gpCostos = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            store: self.stCostos,
            loadMask: {msg: 'Cargando...'},
            sm: this.smselect,
            columns: [this.smselect,
                {
                    header: 'Denominaci&oacute;n',
                    width: 400,
                    dataIndex: 'denominacion',
                    align: 'left',
                    renderer: renderTotal
                }, {
                    header: 'Importe',
                    width: 150,
                    dataIndex: 'importe',
                    align: 'right',
                    renderer: renderTotal
                }, {
                    header: 'Fecha de registro',
                    width: 150,
                    dataIndex: 'fregistro',
                    align: 'center',
                    renderer: renderTotal
                }
            ]
        });

        function renderTotal(val, metaData, record) {
            if(val != null && record.data.idaccidentecosto == 0) {
                metaData.attr = "style='background-color: #C8C8C8';";
                return '<span><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

        self.gpCostos.getSelectionModel().on('rowselect', function(s) {
            objselect = self.gpCostos.getSelectionModel().getSelected().data;
            if (self.gpCostos.getSelectionModel().getSelections().length > 1) {
                self.btnModificarCosto.disable();
            } else {
                self.btnModificarCosto.enable();
            }
            self.btnEliminarCosto.enable();
        });

        self.gpCostos.getSelectionModel().on('rowdeselect', function() {
            if (self.gpCostos.getSelectionModel().getSelections().length == 1) {
                self.btnModificarCosto.enable();
            } else if (self.gpCostos.getSelectionModel().getSelections().length == 0) {
                self.btnEliminarCosto.disable();
                self.btnModificarCosto.disable();
            }
        });

        this.btnAdicionarCosto = new Ext.Button({
            id: 'btnAdicionarCosto',
            text: self.idioma.BtnAdicionar,
            disabled: true,
            hidden: true,
            tooltip: self.idioma.lbBtnAdicionarCosto,
            iconCls: 'adicionar',
            handler: function() {
                accion = 'add';
                self.windCosto.setTitle('Adicionar costo');
                self.windCosto.show();
                self.btnAplicarCosto.show();
            }
        });

        //Boton para modificar.
        this.btnModificarCosto = new Ext.Button({
            id: 'btnModificarCosto',
            text: self.idioma.BtnModificar,
            disabled: true,
            hidden: true,
            tooltip: self.idioma.lbBtnModificarCosto,
            iconCls: 'modificar',
            handler: function() {
                accion = 'mod';
                self.windCosto.setTitle('Modificar costo');
                self.windCosto.show();
                self.btnAplicarCosto.hide();
                self.tfDenom.setValue(objselect.denominacion);
                self.nfImporte.setValue(objselect.importe);
            }
        });

        this.btnEliminarCosto = new Ext.Button({
            id: 'btnEliminarCosto',
            text: self.idioma.BtnEliminar,
            disabled: true,
            hidden: true,
            tooltip: self.idioma.lbBtnEliminarCosto,
            iconCls: 'eliminar',
            handler: function() {
                eliminar();
            }
        });

        //Botón para exportar los costos en pdf.
        this.btnVerCosto = new Ext.Button({
            text: self.idioma.lbBtnVer,
            tooltip: self.idioma.ttBtnVerCos,
            disabled: true,
            iconCls: 'ver',
            handler: function() {
                var params;
                params = Ext.urlEncode({
                    idaccidente: self.idaccidente
                });
                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Costos',
                    width: 800,
                    height: 500,
                    id: 'wincos',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrain: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                                    '/pvd/sst/accidente/index.php/gestionaraccidentes/generarCostos?' + params
                        }
                    }
                }).show();
                Ext.getCmp('wincos').maximize();

                PVD.mostrarMascara('cos01', 'Por favor espere...', 'Generando listado de costos.');
                document.getElementById(idIframe).onload = function() {
                    PVD.ocultarMascara('cos01');
                };
            }
        });

        this.tbar = [this.btnAdicionarCosto, this.btnModificarCosto, this.btnEliminarCosto, this.btnVerCosto, '-', 'Buscar costos: ', this.sfBuscarCosto];

        this.items = [this.gpCostos];

        this.btnAceptCosto = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.lbtnAceptar,
            tooltip: this.idioma.textToolTipAceptar,
            handler: function()
            {
                guardarCosto('ACP');
            }
        });

        this.btnAplicarCosto = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: self.idioma.textToolTipAplicar,
            text: self.idioma.lbtnAplicar,
            handler: function()
            {
                guardarCosto('APL');
            }
        });

        this.btnCancelCosto = new Ext.Button({
            iconCls: 'cancelar',
            text: this.idioma.lbtnCancelar,
            tooltip: this.idioma.textToolTipCancelar,
            handler: function()
            {
                self.windCosto.hide();
                self.tfDenom.reset();
                self.nfImporte.reset();
            }
        });
        
        this.tfDenom = new Ext.form.TextField({
            id: 'tfDenom',
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank : false,
            hiddenname: 'denominacion',
            name: 'denominacion',
            anchor: '100%',
            maxLength: 250
        });
        
        this.nfImporte = new Ext.form.NumberField({
            id: 'nfImporte',
            fieldLabel: 'Importe',
            allowBlank : false,
            hiddenname: 'importe',
            name: 'importe',
            anchor: '100%',
            maxLength: 10,
            allowNegative: false,
            decimalPrecision: 2
        });

        this.fCosto = new Ext.form.FormPanel({
            frame: true,
            bodyStyle: 'padding: 3px 3px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [this.tfDenom, this.nfImporte]
        });

        this.windCosto = new Ext.Window({
            layout: 'fit',
            constrain: true,
            title: 'Adicionar costo',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 350,
            height: 185,
            maximizable: false,
            items: [this.fCosto],
            buttons: [this.btnCancelCosto, this.btnAplicarCosto, this.btnAceptCosto],
            keys: [{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function() {
                        if (!self.btnCancelCosto.disabled) {
                            self.btnCancelCosto.handler();
                        }
                    }
                }, {
                    key: 13,
                    stopEvent: true,
                    fn: function() {
                        if (!self.btnAceptCosto.disabled) {
                            self.btnAceptCosto.handler();
                        }
                    }
                }, {
                    key: 'p',
                    ctrl: true,
                    alt: true,
                    stopEvent: true,
                    fn: function() {
                        if (!self.btnAplicarCosto.disabled) {
                            self.btnAplicarCosto.handler();
                        }
                    }
                }]
        });

        function guardarCosto(btn) {
            Ext.Ajax.request({
                url: (accion == 'add') ? 'addCosto' : 'updateCosto',
                params: {
                    idaccidentecosto: (accion == 'mod') ? objselect.idaccidentecosto : -1,
                    idaccidente: self.idaccidente,
                    denominacion: self.tfDenom.getValue(),
                    importe: self.nfImporte.getValue()
                },
                success: function(r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData == 1) {
                        if (accion == 'add') {
                            mostrarMensaje(1, self.idioma.msgAddCosSucces);
                        } else {
                            mostrarMensaje(1, self.idioma.msgModCosSucces);
                        }
                    } else {
                        mostrarMensaje(6, self.idioma.msgError);
                    }
                    if (btn == 'ACP') {
                        self.windCosto.hide();
                    }
                    self.fCosto.getForm().reset();
                    self.stCostos.reload();
                }
            });
        }

        function eliminar() {
            var per = self.gpCostos.getSelectionModel().getSelections();
            var mens = self.idioma.msgCosDeletepreg1;
            if (per.length > 1) {
                mens = self.idioma.msgCosDeletepreg2;
            }
            mostrarMensaje(2, mens, function(btnPresionado) {
                var res = new Array();
                for (i = 0; i < per.length; i++) {
                    res.push(per[i].data.idaccidentecosto);
                }
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.msgDeleting);
                    Ext.Ajax.request({
                        url: 'deleteCosto',
                        params: {costos: Ext.encode(res)},
                        callback: function() {
                            Ext.getBody().unmask();
                        },
                        success: function(r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                mens = self.idioma.msgCosDeleteFail1;
                                if (per.length > 1) {
                                    mens = self.idioma.msgCosDeleteFail2;
                                }
                                mostrarMensaje(6, mens);
                            } else {
                                mens = self.idioma.msgCosDeleteSucces1;
                                if (per.length > 1) {
                                    mens = self.idioma.msgCosDeleteSucces2;
                                }
                                mostrarMensaje(1, mens);
                            }
                            self.stCostos.reload();
                            self.gpCostos.getSelectionModel().clearSelections();
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
                fn: function() {
                    if (!self.btnAdicionarCosto.disabled) {
                        self.btnAdicionarCosto.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function() {
                    if (!self.btnModificarCosto.disabled) {
                        self.btnModificarCosto.handler();
                    }

                }
            },
            {
                key: 46, //Eliminar
                //stopEvent: true,
                fn: function() {
                    if (!self.btnEliminarCosto.disabled) {
                        self.btnEliminarCosto.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function() {
                    if (!self.sfBuscarCosto.getValue() != '') {
                        self.sfBuscarCosto.onTrigger2Click();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function() {
                    if (!self.sfBuscarCosto.getValue() != '') {
                        self.sfBuscarCosto.onTrigger1Click();
                    }
                }
            }];

        Pvd.SST.Gestionaraccidentes.PanelCostos.superclass.initComponent.call(this);
    }
});
