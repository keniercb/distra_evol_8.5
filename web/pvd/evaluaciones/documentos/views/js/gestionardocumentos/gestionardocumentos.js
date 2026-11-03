/**
 * @Created with NetBeans.
 * @Author: Eddy
 * @package PCI
 * @subpackage Wand
 * @Date: 09/08/2016
 * @Version:1.0
 */
Ext.ns("pci.gestionardocumentos");

pci.gestionardocumentos.windGestDoc = Ext.extend(Ext.Window, {
    width: 700,
    layout: 'border',
    height: 600,
    closeAction: 'close',
    modal: true,
    constrain: true,
    initComponent: function() {
        var self = this;
        this.accion = "ADD";

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function() {
                if (self.panelFormulario.collapsed == false) {
                    self.comboTipoDoc.clearValue();
                    self.fCreacion.reset();
                    self.panelDetallesXCalif.getStore().removeAll();
                    self.panelFormulario.toggleCollapse(true);
                    self.panelDocumentos.btnAdicionar.enable();
                    if (self.panelDocumentos.getSelectionModel().getSelections().length != 0) {
                        self.panelDocumentos.btnModificar.enable();
                        self.panelDocumentos.btnEliminar.enable();
                        self.panelDocumentos.btnAsociarDoc.enable();
                        if (self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentogestordocumental') != null &&
                                self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentogestordocumental') != '') {
                            self.panelDocumentos.btnVerDoc.enable();
                        }
                    }
                }
            }
        });
        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            disabled: true,
            handler: function() {

                var tipoDoc = self.comboTipoDoc.getValue();
                var fechaCreacion = self.fCreacion.getRawValue();
                var idpersona = self.idpersona;
                var valor = self.valor;
                var temp = self.panelDetallesXCalif.getStore();
                var arreglo = temp.data.items;

                var arrayTemp = new Array();
                Ext.each(arreglo, function(r) {
                    arrayTemp.push(r.data);
                });

                PVD.mostrarMascara('adicionarDocumento', 'Por favor espere...', 'Adicionando documento');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/adicionarDocumento',
                    method: 'POST',
                    params: {
                        tipoDoc: tipoDoc,
                        fechaCreacion: fechaCreacion,
                        idpersona: idpersona,
                        valor: valor,
                        arreglo: Ext.encode(arrayTemp)
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('adicionarDocumento');
                        if (responseData.success) {
                            Ext.MessageBox.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El documento ha sido adicionado satisfactoriamente.',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                        self.panelDocumentos.getStore().load({
                            params: {
                                idPersona: self.idpersona,
                                valor: self.valor,
                                start: 0,
                                limit: 15
                            }
                        });
                    }
                });

                self.comboTipoDoc.clearValue();
                self.fCreacion.reset();
                self.panelDetallesXCalif.getStore().removeAll();
            }
        });
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
            handler: function() {

                var url = '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/adicionarDocumento';
                var mascara = 'Adicionando documento';
                var mensaje = 'El documento ha sido adicionado satisfactoriamente.';
                var iddocpersona = null;
                if (self.accion == "MOD") {
                    url = '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/modificarDocumento';
                    mascara = 'Modificando documento';
                    mensaje = 'El documento ha sido modificado satisfactoriamente.';
                    iddocpersona = self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentopersona');
                }

                var tipoDoc = self.comboTipoDoc.getValue();
                var fechaCreacion = self.fCreacion.getRawValue();
                var idpersona = self.idpersona;
                var valor = self.valor;
                var temp = self.panelDetallesXCalif.getStore();
                var arreglo = temp.data.items;
                var arrayTemp = new Array();
                Ext.each(arreglo, function(r) {
                    arrayTemp.push(r.data);
                });

                PVD.mostrarMascara('adicionarDocumento', 'Por favor espere...', mascara);
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        tipoDoc: tipoDoc,
                        fechaCreacion: fechaCreacion,
                        idpersona: idpersona,
                        valor: valor,
                        arreglo: Ext.encode(arrayTemp),
                        idDocPers: iddocpersona
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('adicionarDocumento');
                        if (responseData.success) {
                            Ext.MessageBox.show({
                                title: 'Informaci&oacute;n',
                                msg: mensaje,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                        self.panelDocumentos.getStore().load({
                            params: {
                                idPersona: self.idpersona,
                                valor: self.valor,
                                start: 0,
                                limit: 15
                            }
                        });
                    }
                });

                self.comboTipoDoc.clearValue();
                self.fCreacion.reset();
                self.panelDetallesXCalif.getStore().removeAll();
                self.panelFormulario.toggleCollapse(true);

            }
        });

        this.panelDocumentos = new pci.gestionardocumentos.gpDocumentos({
            id: 'panelDocumentos',
            border: true,
            region: 'center',
            singleSelect: true,
            split: true,
            idpersona: self.idpersona,
            valor: self.valor
        });

        this.panelDetallesXCalif = new pci.gestionardocumentos.gpDetallesXCalificadores({
            title: 'Listado de detalles por calificadores por tipo de documento',
            id: 'panelDetallesXCalif',
            border: true,
            singleSelect: true,
            split: true,
            height: 180
        });

        this.storeTipoDoc = new Ext.data.Store({
            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarComboTipoDoc',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idtipodocumento"
            }, [{
                    name: 'idtipodocumento'
                }, {
                    name: 'denominacion'
                }]),
            listeners: {
                load: function() {
                    self.comboTipoDoc.enable();
                }
            }
        });
        this.comboTipoDoc = new Ext.form.ComboBox({
            id: 'comboTipoDoc',
            store: self.storeTipoDoc,
            displayField: 'denominacion',
            valueField: 'idtipodocumento',
            hiddenname: 'idtipodocumento',
            typeAhead: true,
            mode: 'local',
            anchor: '99%',
            triggerAction: 'all',
            fieldLabel: "Tipo de documento",
            enableKeyEvents: true,
            editable: true,
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            allowBlank: false,
            forceSelection: true,
            listeners: {
                select: function(combo, record, index) {
                    if (self.panelFormulario.getForm().isValid() && self.panelDetallesXCalif.getStore().getCount() != 0) {
                        self.btnAplicar.enable();
                        self.btnAceptar.enable();
                    } else {
                        self.btnAplicar.disable();
                        self.btnAceptar.disable();
                    }
                }
            }
        });
        this.storeTipoDoc.load();
        this.comboTipoDoc.store.on('load', function(st, r, op) {
            if (self.comboTipoDoc.getValue() != null && self.comboTipoDoc.getValue() != '') {
                self.comboTipoDoc.setValue(self.comboTipoDoc.getValue());
            }
        });

        this.fCreacion = new Ext.form.DateField({
            name: 'fCreacion',
            id: 'fCreacion',
            anchor: '100%',
            allowBlank: false,
            format: 'd/m/Y',
            fieldLabel: "Fecha de creaci&oacute;n",
            maxValue: new Date().format('d/m/Y'),
            maxText: 'La fecha tiene que ser inferior o igual a la fecha actual.',
            enableKeyEvents: true,
            listeners: {
                keypress: function() {
                    if (self.panelFormulario.getForm().isValid() && self.panelDetallesXCalif.getStore().getCount() != 0) {
                        self.btnAplicar.enable();
                        self.btnAceptar.enable();
                    } else {
                        self.btnAplicar.disable();
                        self.btnAceptar.disable();
                    }
                },
                valid: function() {
                    if (self.comboTipoDoc.isValid() && self.panelDetallesXCalif.getStore().getCount() != 0) {
                        self.btnAplicar.enable();
                        self.btnAceptar.enable();
                    } else {
                        self.btnAplicar.disable();
                        self.btnAceptar.disable();
                    }
                },
                invalid: function() {
                    self.btnAplicar.disable();
                    self.btnAceptar.disable();
                }
            }
        });

        this.pPanelUno = new Ext.Panel({
            layout: 'column',
            items: [{
                    layout: 'form',
                    border: false,
                    columnWidth: 0.5,
                    items: [self.comboTipoDoc]
                }, {
                    layout: 'form',
                    border: false,
                    columnWidth: 0.5,
                    items: [self.fCreacion]
                }]
        });
        this.pPanelDos = new Ext.Panel({
            layout: 'column',
            items: [{
                    layout: 'fit',
                    border: false,
                    columnWidth: 1,
                    items: [self.panelDetallesXCalif]
                }]
        });

        this.panelFormulario = new Ext.FormPanel({
            title: 'Adicionar documento',
            hideCollapseTool: true,
            id: 'panelFormulario',
            frame: true,
            labelAlign: 'top',
            region: 'south',
            width: '100%',
            layout: 'form',
            margins: '5 5 5 5',
            split: true,
            collapsible: true,
            collapseMode: 'mini',
            collapsed: false,
            height: 300,
            bbar: ['->', self.btnCancelar, self.btnAplicar, self.btnAceptar],
            items: [{
                    layout: 'column',
                    border: false,
                    items: [{
                            columnWidth: 1,
                            width: '100%',
                            height: 55,
                            layout: 'anchor',
                            items: [self.pPanelUno]
                        }, {
                            columnWidth: 1,
                            width: '100%',
                            height: 185,
                            layout: 'anchor',
                            items: [self.pPanelDos]
                        }]
                }]
        });

        self.panelDocumentos.getSelectionModel().on('selectionchange', function(ssm, indiceFila, record) {
            if (ssm.getSelections().length == 1) {
                if (self.panelFormulario.collapsed == true) {
                    self.panelDocumentos.btnModificar.enable();
                    self.panelDocumentos.btnEliminar.enable();
                    self.panelDocumentos.btnAsociarDoc.enable();
                    if (self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentogestordocumental') != null &&
                            self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentogestordocumental') != '') {
                        self.panelDocumentos.btnVerDoc.enable();
                    }
                } else {
                    self.comboTipoDoc.clearValue();
                    self.fCreacion.reset();
                    self.panelDetallesXCalif.getStore().removeAll();
                    var iddocpersona = self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentopersona');
                    var DetallesRecord = Ext.data.Record.create([
                        {name: 'iddetallesxcalif'},
                        {name: 'calificadores'},
                        {name: 'detalles'}
                    ]);
                    Ext.Ajax.request({
                        url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/obtenerDatosDocumento',
                        method: 'POST',
                        params: {
                            iddocpersona: iddocpersona
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            var datosSolicitud = responseData.datos;

                            self.comboTipoDoc.setValue(datosSolicitud[0].idtipodocumento);
                            self.fCreacion.setValue(datosSolicitud[0].fechacreacion);

                            //console.debug(datosSolicitud[0].arraycalif);

                            Ext.each(datosSolicitud[0].arraycalif, function(r) {
                                var myNewRecord = new DetallesRecord({
                                    iddetallesxcalif: r.idcalificadores,
                                    calificadores: r.denomcalificadores,
                                    detalles: r.detalles
                                });
                                self.panelDetallesXCalif.getStore().add(myNewRecord);
                            });


                        }
                    });
                }
            } else {
                self.panelDocumentos.btnModificar.disable();
                self.panelDocumentos.btnEliminar.disable();
                self.panelDocumentos.btnAsociarDoc.disable();
                self.panelDocumentos.btnVerDoc.disable();
            }
        });

        self.panelDocumentos.btnAdicionar.on('click', function() {
            self.panelFormulario.toggleCollapse(true);
            self.accion = "ADD";
            self.panelFormulario.setTitle('Adicionar documento');
            self.btnAplicar.show();
            self.panelDocumentos.btnAdicionar.disable();
            self.panelDocumentos.btnModificar.disable();
            self.panelDocumentos.btnEliminar.disable();
            self.panelDocumentos.btnAsociarDoc.disable();
            self.panelDocumentos.btnVerDoc.disable();
        });
        self.panelDocumentos.btnModificar.on('click', function() {
            self.panelFormulario.toggleCollapse(true);
            if (self.panelFormulario.collapsed == true) {
                var iddocpersona = self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentopersona');
                var DetallesRecord = Ext.data.Record.create([
                    {name: 'iddetallesxcalif'},
                    {name: 'calificadores'},
                    {name: 'detalles'}
                ]);
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/obtenerDatosDocumento',
                    method: 'POST',
                    params: {
                        iddocpersona: iddocpersona
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        var datosSolicitud = responseData.datos;

                        self.comboTipoDoc.setValue(datosSolicitud[0].idtipodocumento);
                        self.fCreacion.setValue(datosSolicitud[0].fechacreacion);

                        //console.debug(datosSolicitud[0].arraycalif);

                        Ext.each(datosSolicitud[0].arraycalif, function(r) {
                            var myNewRecord = new DetallesRecord({
                                iddetallesxcalif: r.idcalificadores,
                                calificadores: r.denomcalificadores,
                                detalles: r.detalles
                            });
                            self.panelDetallesXCalif.getStore().add(myNewRecord);
                        });


                    }
                });

            } else {
                self.comboTipoDoc.clearValue();
                self.fCreacion.reset();
                self.panelDetallesXCalif.getStore().removeAll();
            }
            self.accion = "MOD";
            self.panelFormulario.setTitle('Modificar documento');
            self.btnAplicar.hide();
            self.panelDocumentos.btnAdicionar.disable();
            self.panelDocumentos.btnModificar.disable();
            self.panelDocumentos.btnEliminar.disable();
            self.panelDocumentos.btnAsociarDoc.disable();
            self.panelDocumentos.btnVerDoc.disable();
        });

        self.panelDetallesXCalif.getStore().on('add', function() {
            if (self.panelFormulario.getForm().isValid()) {
                self.btnAplicar.enable();
                self.btnAceptar.enable();
            } else {
                self.btnAplicar.disable();
                self.btnAceptar.disable();
            }
        });

        self.panelDetallesXCalif.getStore().on('remove', function() {
            if (self.panelFormulario.getForm().isValid() && self.panelDetallesXCalif.getStore().getCount() != 0) {
                self.btnAplicar.enable();
                self.btnAceptar.enable();
            } else {
                self.btnAplicar.disable();
                self.btnAceptar.disable();
            }
        });

        this.items = [self.panelDocumentos, self.panelFormulario];

        pci.gestionardocumentos.windGestDoc.superclass.initComponent.call(this);
    }

});

pci.gestionardocumentos.gpDocumentos = Ext.extend(Ext.grid.GridPanel, {
    split: true,
    stripeRows: true,
    loadMask: true,
    initComponent: function() {
        var _this = this;

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<div style="word-wrap:break-word;margin-left:20px;"><b>Detalles</b>:</br></b>{detalles}</p></div>'),
            enableCaching: false
        });

        this.store = new Ext.data.Store({
            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarDocumentos',
            reader: new Ext.data.JsonReader({
                totalProperty: 'quantity',
                root: 'data',
                id: 'iddocumentopersona'
            }, [
                {name: 'iddocumentopersona'},
                {name: 'fechacreacion'},
                {name: 'detalles'},
                {name: 'tipodocumento'},
                {name: 'calificadores'},
                {name: 'iddocumentogestordocumental'},
                {name: 'nombredocumento'}
            ])
        });
        this.store.load({
            params: {
                idPersona: _this.idpersona,
                valor: _this.valor,
                start: 0,
                limit: 15
            }
        });

        this.cm = new Ext.grid.ColumnModel([_this.expander,
            {
                hidden: true,
                dataIndex: 'iddocumentopersona',
                hideable: false
            }, {
                hidden: true,
                dataIndex: 'iddocumentogestordocumental',
                hideable: false
            }, {
                header: 'Tipo de documento',
                dataIndex: 'tipodocumento',
                width: 120,
                sortable: true
            }, {
                header: 'Fecha de creaci&oacute;n',
                dataIndex: 'fechacreacion',
                width: 110,
                sortable: true
            }, {
                header: 'Calificador(es)',
                dataIndex: 'calificadores',
                width: 270,
                sortable: true
            }, {
                header: 'Nombre del documento',
                dataIndex: 'nombredocumento',
                width: 150,
                sortable: true
            }
        ]);

        this.btnAdicionar = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar documento <b>(Alt+I)</b>',
            id: 'btnAdicionar' + _this.id,
            iconCls: 'adicionar',
            handler: function() {

            }
        });
        this.btnModificar = new Ext.Button({
            text: '<u>M</u>odificar',
            tooltip: 'Modificar documento <b>(Alt+M)</b>',
            id: 'btnModificar' + _this.id,
            iconCls: 'modificar',
            disabled: true,
            handler: function() {

            }
        });
        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            tooltip: 'Eliminar documento <b>(DEL)</b>',
            id: 'btnEliminar' + _this.id,
            iconCls: 'eliminar',
            disabled: true,
            handler: function() {
                mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea eliminar el documento seleccionado?', function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        PVD.mostrarMascara('eliminarDocumento', 'Por favor espere...', 'Eliminando documento');
                        Ext.Ajax.request({
                            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/eliminarDocumento',
                            method: 'POST',
                            params: {
                                idDocumento: _this.getSelectionModel().getSelected().get('iddocumentopersona')
                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('eliminarDocumento');
                                if (responseData.success) {
                                    Ext.MessageBox.show({
                                        title: 'Informaci&oacute;n',
                                        msg: 'El documento ha sido eliminado satisfactoriamente.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                    _this.store.load({
                                        params: {
                                            idPersona: _this.idpersona,
                                            valor: _this.valor,
                                            start: 0,
                                            limit: 15
                                        }
                                    });
                                }
                            }
                        });
                        _this.btnEliminar.focus();
                    } else {
                        _this.btnEliminar.focus();
                    }
                });
            }
        });

       /* this.btnAsociarDoc = new Ext.Button({
            text: 'Asociar documento',
            tooltip: 'Asociar documento',
            id: 'btnAsociarDoc' + _this.id,
            iconCls: 'asociar',
            disabled: true,
            handler: function() {
                var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();

                PVD.mostrarMascara('cargarEspacioTrabajo', 'Por favor espere...', 'Cargando espacio de trabajo');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarEspacioTrabajo',
                    method: 'POST',
                    params: {},
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('cargarEspacioTrabajo');
                        if (responseData.success) {
                            if (responseData.workspace != null) {
                                objetoContenido.inicializarComponente(true, responseData.workspace);
                            } else {
                                mostrarMensaje(8, 'Error interno al obtener el espacio de trabajo.');
                            }
                        }
                    }
                });

                var temp = true;
                objetoContenido.on('obtenerContenidoOK', function() {
                    if (temp) {
                        objetoContenido.winContenido.setTitle('Gestor documental');
                        //Oculto el boton Aplicar porque no hace falta:
                        objetoContenido.winContenido.buttons[1].hide();
                        //Cambio la seleccion para que sea unica:
                        objetoContenido.winContenido.items.items[0].items.items[1].items.items[1].getSelectionModel().singleSelect = true;
                        //Cambio el handler al boton cancelar para que no dispare el evento 'nodeSelected':
                        objetoContenido.winContenido.buttons[0].setHandler(function() {
                            objetoContenido.winContenido.destroy();
                        });
                        objetoContenido.winContenido.show();
                        temp = false;
                    }
                });
                objetoContenido.on("obtenerContenidoEx", function() {
                    mostrarMensaje(8, 'Error interno al obtener los archivos del servidor.');
                });
                objetoContenido.on("nodeSelected", function(node) {
                    var iddocpersona = _this.getSelectionModel().getSelected().get('iddocumentopersona');
                    if (node[0] != undefined) {
                        var idgestdoc = node[0].id;
                        PVD.mostrarMascara('asociarDocumento', 'Por favor espere...', 'Asociando documento');
                        Ext.Ajax.request({
                            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/asociarDocumento',
                            method: 'POST',
                            params: {
                                iddocpersona: iddocpersona,
                                idgestdoc: idgestdoc
                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('asociarDocumento');
                                if (responseData.success) {
                                    Ext.MessageBox.show({
                                        title: 'Informaci&oacute;n',
                                        msg: 'El documento ha sido asociado satisfactoriamente.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                                _this.getStore().load({
                                    params: {
                                        idPersona: _this.idpersona,
                                        valor: _this.valor,
                                        start: 0,
                                        limit: 15
                                    }
                                });
                            }
                        });
                    } else {
                        mostrarMensaje(6, 'Debe escoger un documento.');
                    }
                });

            }
        });

        this.btnVerDoc = new Ext.Button({
            text: 'Ver documento',
            tooltip: 'Asociar documento',
            id: 'btnVerDoc' + _this.id,
            iconCls: 'ver',
            disabled: true,
            handler: function() {
                var iddocumentogestordocumental = _this.getSelectionModel().getSelected().get('iddocumentogestordocumental');
                PVD.mostrarMascara('verDocumento', 'Por favor espere...', 'Cargando documento');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/verDocumento',
                    method: 'POST',
                    params: {
                        iddocumentogestordocumental: iddocumentogestordocumental
                    },
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('verDocumento');
                        if (responseData.success == 1) {
                            window.open(responseData.url);
                        }
                    }
                });
            }
        });*/
        this.btnAsociarDoc = new Ext.Button({
            text: 'Asociar documento',
            tooltip: 'Asociar documento',
            id: 'btnAsociarDoc' + _this.id,
            iconCls: 'asociar',
            disabled: true,
            handler: function()
            {
                var iddocpersona = (_this.idpersona) ? _this.idpersona : _this.getSelectionModel().getSelected().get('iddocumentopersona');
                var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
                PVD.mostrarMascara('cargarEspacioTrabajo', 'Por favor espere...', 'Cargando espacio de trabajo');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarEspacioTrabajo',
                    method: 'POST',
                    params: {id: iddocpersona},
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('cargarEspacioTrabajo');
                        if (responseData.success) {
                            if (responseData.workspace != null) {
                                objetoContenido.inicializarComponente(true, responseData.workspace);
                            } else {
                                mostrarMensaje(8, 'Error interno al obtener el espacio de trabajo.');
                            }
                        }
                    }
                });
                var temp = true;
                objetoContenido.on('obtenerContenidoOK', function()
                {
                    if (temp) {
                        objetoContenido.winContenido.setTitle('Gestor documental');
                        //Oculto el boton Aplicar porque no hace falta:
                        objetoContenido.winContenido.buttons[1].hide();
                        //Cambio la seleccion para que sea unica:
                        objetoContenido.winContenido.items.items[0].items.items[1].items.items[1].getSelectionModel().singleSelect = true;
                        //Cambio el handler al boton cancelar para que no dispare el evento 'nodeSelected':
                        objetoContenido.winContenido.buttons[0].setHandler(function()
                        {
                            objetoContenido.winContenido.destroy();
                        });
                        objetoContenido.winContenido.show();
                        temp = false;
                    }
                });
                objetoContenido.on("obtenerContenidoEx", function()
                {
                    mostrarMensaje(8, 'Error interno al obtener los archivos del servidor.');
                });
                objetoContenido.on("nodeSelected", function(node)
                {
                    var iddocpersona = _this.getSelectionModel().getSelected().get('iddocumentopersona');
                    if (node[0] != undefined) {
                        var idgestdoc = node[0].id;
                        PVD.mostrarMascara('asociarDocumento', 'Por favor espere...', 'Asociando documento');
                        Ext.Ajax.request({
                            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/asociarDocumento',
                            method: 'POST',
                            params: {
                                iddocpersona: iddocpersona, idgestdoc: idgestdoc
                            },
                            callback: function(options, success, response)
                            {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('asociarDocumento');
                                if (responseData.success) {
                                    Ext.MessageBox.show({
                                        title: 'Informaci&oacute;n',
                                        msg: 'El documento ha sido asociado satisfactoriamente.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                                _this.getStore().load({
                                    params: {
                                        idPersona: _this.idpersona,valor:_this.valor, start: 0, limit: 15
                                    }
                                });
                            }
                        });
                    } else {
                        mostrarMensaje(6, 'Debe escoger un documento.');
                    }
                });
            }
        });
        this.btnVerDoc = new Ext.Button({
            text: 'Ver documento',
            tooltip: 'Asociar documento',
            id: 'btnVerDoc' + _this.id,
            iconCls: 'ver',
            disabled: true,
            handler: function()
            {
                var iddocumentogestordocumental = _this.getSelectionModel().getSelected().get('iddocumentogestordocumental');
                PVD.mostrarMascara('verDocumento', 'Por favor espere...', 'Cargando documento');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/verDocumento',
                    method: 'POST',
                    params: {
                        iddocumentogestordocumental: iddocumentogestordocumental
                    },
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('verDocumento');
                        if (responseData.success == 1) {
                            window.open(responseData.url);
                        }
                    }
                });
            }
        });

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.plugins = this.expander;

        var qtip = null;

        _this.on('mouseover', function(e) {
            var t = e.getTarget();
            var v = this.getView();
            var rowIndex = v.findRowIndex(t);

            if (rowIndex !== false) {
                var rec = this.getStore().getAt(rowIndex);

                var detalles = '<div style="word-wrap:break-word;margin-left:5px;"><b>Detalles</b>:</br></b>' + rec.get('detalles') + '</p></div>';

                qtip = new Ext.ToolTip({
                    target: t,
                    autoWidth: false,
                    maxWidth: 500,
                    minWidth: 40,
                    html: detalles,
                    trackMouse: true
                });
            }
        }, this);

        this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnAsociarDoc, this.btnVerDoc];

        this.bbar = new Ext.PagingToolbar({
            store: _this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} - {1} de {2} ',
            emptyMsg: 'No existen datos que mostrar.',
            pageSize: 15
        });

        this.documentKeyMap = new Ext.KeyMap(document, [{
                key: 46,
                fn: function() {
                    if (!_this.btnEliminar.disabled) {
                        _this.btnEliminar.handler();
                    }
                }
            }, {
                key: 'm',
                alt: true,
                fn: function() {
                    if (!_this.btnModificar.disabled) {
                        _this.btnModificar.fireEvent('click');
                    }
                }
            }, {
                key: 'i',
                alt: true,
                fn: function() {
                    if (!_this.btnAdicionar.disabled) {
                        _this.btnAdicionar.fireEvent('click');
                    }
                }
            }
        ]);

        pci.gestionardocumentos.gpDocumentos.superclass.initComponent.call(this);

    }

});

pci.gestionardocumentos.gpDetallesXCalificadores = Ext.extend(Ext.grid.GridPanel, {
    split: true,
    stripeRows: true,
    loadMask: true,
    initComponent: function() {
        var _this = this;

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<div style="word-wrap:break-word;margin-left:15px;"><b>Detalles</b>:</b>&nbsp;{detalles}</p></div>'),
            enableCaching: false
        });

        this.store = new Ext.data.Store({
            url: '',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                totalProperty: 'quantity',
                root: 'data',
                id: 'iddetallesxcalif'
            }, [
                {name: 'iddetallesxcalif'},
                {name: 'calificadores'},
                {name: 'detalles'}
            ])
        });

        var DetallesRecord = Ext.data.Record.create([
            {name: 'iddetallesxcalif'},
            {name: 'calificadores'},
            {name: 'detalles'}
        ]);

        this.cm = new Ext.grid.ColumnModel([_this.expander,
            {
                hidden: true,
                dataIndex: 'iddetallesxcalif',
                hideable: false
            }, {
                header: 'Calificadores',
                dataIndex: 'calificadores',
                width: 550,
                sortable: true
            }
        ]);

        this.btnAdicionar = new Ext.Button({
            text: 'Adicionar',
            tooltip: 'Adicionar detalles por calificadores',
            id: 'btnAdicionar' + _this.id,
            iconCls: 'adicionar',
            handler: function() {
                this.winGestDetallesXCalif = new pci.gestionardocumentos.windGestDetPorCal({
                    title: 'Adicionar detalles por calificadores'
                });
                this.winGestDetallesXCalif.show();

                this.winGestDetallesXCalif.on('btnaceptarpresionado', function(idcalificadores, denomcalificadores, detalles) {
                    var myNewRecord = new DetallesRecord({
                        iddetallesxcalif: idcalificadores,
                        calificadores: denomcalificadores,
                        detalles: detalles
                    });
                    _this.store.add(myNewRecord);
                });
            }
        });
        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            tooltip: 'Eliminar detalles por calificadores',
            id: 'btnEliminar' + _this.id,
            iconCls: 'eliminar',
            disabled: true,
            handler: function() {
                Ext.each(_this.getSelectionModel().getSelections(), function(r) {
                    _this.store.remove(r);
                });
            }
        });

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: false});
        this.sm.on("selectionchange", function(ssm, indiceFila, record) {
            if (ssm.getSelections().length != 0) {
                _this.btnEliminar.enable();
            } else {
                _this.btnEliminar.disable();
            }
        });

        this.plugins = this.expander;

        var qtip = null;

        _this.on('mouseover', function(e) {
            var t = e.getTarget();
            var v = this.getView();
            var rowIndex = v.findRowIndex(t);

            if (rowIndex !== false) {
                var rec = this.getStore().getAt(rowIndex);

                var detalles = '<div style="word-wrap:break-word;margin-left:5px;"><b>Detalles</b>:</b>&nbsp;' + rec.get('detalles') + '</p></div>';

                qtip = new Ext.ToolTip({
                    target: t,
                    autoWidth: false,
                    maxWidth: 500,
                    minWidth: 40,
                    html: detalles,
                    trackMouse: true
                });
            }
        }, this);

        this.tbar = [this.btnAdicionar, this.btnEliminar];

        pci.gestionardocumentos.gpDetallesXCalificadores.superclass.initComponent.call(this);

    }

});

pci.gestionardocumentos.windGestDetPorCal = Ext.extend(Ext.Window, {
    width: 600,
    layout: 'border',
    height: 350,
    closeAction: 'close',
    modal: true,
    constrain: true,
    initComponent: function() {
        var self = this;

        this.storeCalificadores = new Ext.data.Store({
            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarComboCalificadores',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant',
                id: "idcalificador"
            }, [{
                    name: 'idcalificador'
                }, {
                    name: 'denominacion'
                }]),
            listeners: {
                load: function() {
                    self.comboCalificadores.enable();
                }
            }
        });
        this.storeCalificadores.load();

        this.comboCalificadores = new Ext.form.MultiComboSelect({
            id: 'comboCalificadores',
            fieldLabel: 'Calificador(es)',
            name: 'comboCalificadores',
            hideOnSelect: false,
            anchor: '100%',
            store: self.storeCalificadores,
            triggerAction: 'all',
            valueField: 'idcalificador',
            displayField: 'denominacion',
            mode: 'local',
            editable: false,
            allowBlank: false,
            listeners: {
                select: function(combo, record, index) {
                    if (self.panelFormulario.getForm().isValid()) {
                        self.btnAceptar.enable();
                    } else {
                        self.btnAceptar.disable();
                    }
                }
            }
        });

        this.taDetalles = new Ext.form.TextArea({
            name: 'detalles',
            id: 'taDetallesOtro',
            fieldLabel: "Detalles",
            anchor: '100%',
            height: 180,
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function() {
                    if (self.panelFormulario.getForm().isValid()) {
                        self.btnAceptar.enable();
                    } else {
                        self.btnAceptar.disable();
                    }
                }
            }
        });

        this.panelFormulario = new Ext.FormPanel({
            id: 'panelFormularioDos',
            frame: true,
            labelAlign: 'top',
            region: 'center',
            width: '100%',
            layout: 'form',
            split: true,
            items: [{
                    layout: 'column',
                    border: false,
                    items: [{
                            columnWidth: 1,
                            width: '100%',
                            height: 60,
                            layout: 'form',
                            items: [self.comboCalificadores]
                        }, {
                            columnWidth: 1,
                            width: '100%',
                            height: 235,
                            layout: 'form',
                            items: [self.taDetalles]
                        }]
                }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function() {
                self.close();
            }
        });
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: false,
            handler: function() {
                var idcalificadores = self.comboCalificadores.getValue();
                var denomcalificadores = self.comboCalificadores.getRawValue();
                var detalles = self.taDetalles.getValue();
                self.fireEvent('btnaceptarpresionado', idcalificadores, denomcalificadores, detalles);
                self.close();
            }
        });

        this.items = [self.panelFormulario];

        this.buttons = [self.btnCancelar, self.btnAceptar];

        pci.gestionardocumentos.windGestDetPorCal.superclass.initComponent.call(this);
    }

});