Utilidades.Cmp.Cmpgestordocumental = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.panel;
    this.objetoContenido;
    this.iddocumento = [];
    this.idnodoselec;
    this.BarraProgreso = new BarraEstado();

    this.CrearPanelGestorDoc = function () {
        _this.objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
        _this.objetoContenido.inicializarComponente(true);
        _this.panel = _this.objetoContenido.contenedorPanelCentral;


        this.pBuscarActividades = new Ext.Panel({
            layout: 'fit',
            width: 300,
            margins: '3 3 3 3',
            items: [_this.panel]

        });
        this.btnCancelarCrudAct = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            hidden: false,
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.winAsociarDoc.destroy();

            }
        });
        this.btnAceptarCrudAct = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            id: 'btacepact1',
            tooltip: 'Guardar datos y cerrar ventana',
            hidden: false,
            handler: function () {
                console.log(_this.objetoContenido.panelCentral.items.items[0]);
                console.log(_this.objetoContenido.panelCentral.items.items[1].getSelectionModel().getSelected());
                _this.iddocumento = _this.objetoContenido.panelCentral.items.items[1].getSelectionModel().getSelected();
                _this.GuardarIddocumento();
                _this.winAsociarDoc.destroy();
            }
        });
        this.btnAplicarCrudAct = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.iddocumento = _this.objetoContenido.panelCentral.items.items[1].getSelectionModel().getSelected();
                _this.GuardarIddocumento();
            }
        });
        this.winAsociarDoc = new Ext.Window({
            frame: true,
            renderTo: Ext.getBody(),
            height: 500,
            layout: 'border',
            modal: true,
            autoShow: false,
            closeAction: 'destroy',
            layout: 'fit',
            title: 'Asociar documentos',
            width: 840,
            buttons: [_this.btnCancelarCrudAct, _this.btnAplicarCrudAct, _this.btnAceptarCrudAct],
            items: [_this.pBuscarActividades],
            listeners: {
                destroy: function (win) {
                    Ext.getCmp('vpGestionContenido').destroy();

                }
            }
        });
        _this.winAsociarDoc.show();
    };
    this.CrearGridDocAsociados = function (accion, idselected) {

        this.btnAsociar = new Ext.Button({
            handler: function () {
                _this.CrearPanelGestorDoc();
            },
            //disabled: false,
            disabled: (accion == 'Ver datos del') ? true : false,
            iconCls: 'adicionar',
            id: 'btnAsociar',
            nextTab: 'btnEliminarAsoc',
            tooltip: 'Asociar documento',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });
        this.btnEliminarAsoc = new Ext.Button({
            handler: function () {
                _this.EliminarDocAsociados(idselected);
            },
            disabled: true,
            iconCls: 'eliminar',
            id: 'btnEliminarAsoc',
            nextTab: 'btncanc',
            prevTab: 'btnAsociar',
            tooltip: 'Eliminar asociación del documento',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });
        _this.stgdocumental = new Ext.data.Store({
            autoLoad: (accion == 'Modificar') ? true : false,
            url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/cargarDocumentosAsociados',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }, {
                name: 'icono'
            }, {
                name: 'fechaCreacion'
            }, {
                name: 'fechaModificacion'
            }, {
                name: 'datosbd'
            }
            ]),
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idelemento = idselected;
                }
            }
        });
        _this.smggestordocumental = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.btnEliminarAsoc.enable();
                    _this.idnodoselec = record.data.id;
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.btnEliminarAsoc.disable();
                }
            }
        });
        _this.pggestordocumental = new Ext.PagingToolbar({
            pageSize: 1000,
            store: _this.stgdocumental,
            displayInfo: true
        });
        _this.ggestorDocumental = new Ext.grid.GridPanel({
            region: 'center',
            layout: 'fit',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando contenidos asociados...'
            },
            store: _this.stgdocumental,
            height: 150,
            sm: _this.smggestordocumental,
            tbar: [_this.btnAsociar, ' ', _this.btnEliminarAsoc],
            bbar: _this.pggestordocumental,
            columns: [_this.smggestordocumental,
                /*{
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    hidden: true,
                    dataIndex: 'datosbd'
                },*/ {
                    id: 'expandir',
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 350,
                    renderer: MostrarImagenTipoElemento
                }, {
                    header: "Fecha de creaci&oacute;n",
                    sortable: true,
                    dataIndex: 'fechaCreacion',
                    width: 130
                }, {
                    header: "&Uacute;ltima modificaci&oacute;n",
                    sortable: true,
                    dataIndex: 'fechaModificacion',
                    width: 130
                }
            ],
            listeners: {
                rowdblclick: function (grid, indiceFila, record) {
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/abrirDocumento',
                        params: {
                            idnodoselect: _this.idnodoselec
                        },
                        callback: function (options, success, response) {
                            var tituloarchivo = Ext.decode(response.responseText);
                            window.open(tituloarchivo);
                        }
                    });
                }
            }
        });
        //Panel auxiliar para que me salgan las teclas calientes
        _this.gestorDocumental = new Ext.Panel(
            {
                layout: 'border',
                items: [_this.ggestorDocumental],
                height: 250,
                usarKeymap: true,
                botonesKeymap: [_this.btnAsociar, _this.btnEliminarAsoc]
            });
        return _this.gestorDocumental;
        //return _this.ggestorDocumental;
    };
    this.GuardarIddocumento = function () {
        var arraydocument = [];
        // for (var i = 0; i < _this.iddocumento.length; i++) {
        var document = {
            iddocument: _this.iddocumento.id,
            denominacion: _this.iddocumento.data.texto,
            icono: _this.iddocumento.data.imagen2,
            fechaCreacion: _this.iddocumento.data.fechaCreacion,
            fechaModificacion: _this.iddocumento.data.fechaModificacion,
            datosbd: 0
        };
        arraydocument.push(document);
        //}
        this.ListardocumentosPostGuardar(arraydocument);
    };
    this.ListardocumentosPostGuardar = function (documents) {
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'id'
            }, {
                name: 'denominacion'
            }, {
                name: 'icono'
            }, {
                name: 'fechaCreacion'
            }, {
                name: 'fechaModificacion'
            }, {
                name: 'datosbd'
            }
        ]);

        for (var i = 0; i < documents.length; i++) {
            var myNewRecord = new TopicRecord(
                {
                    id: documents[i].iddocument,
                    denominacion: documents[i].denominacion,
                    icono: documents[i].icono,
                    fechaCreacion: documents[i].fechaCreacion,
                    fechaModificacion: documents[i].fechaModificacion,
                    datosbd: documents[i].datosbd
                });
            _this.stgdocumental.add(myNewRecord);
        }
    };

    this.ObtenerDocumentos = function () {
        var arraydocumentos = [];
        var documents = _this.stgdocumental.getRange();
        if (documents.length > 0) {
            for (var i = 0; i < documents.length; i++) {
                var documentos = {
                    id: documents[i].data.id
                };
                arraydocumentos.push(documentos);
            }
        }
        return arraydocumentos;
    };

    this.EliminarDocAsociados = function (idselected) {
        var arraydocumentos = [];
        var selections = _this.smggestordocumental.getSelections();
        for (var i = 0; i < selections.length; i++) {
            if (selections[i].data.datosbd == 1) {
                arraydocumentos.push(selections[i].data.id);
            }
        }
        var mensaje = '', mensajemascara = '';
        if (arraydocumentos.length > 1) {
            mensaje = '¿Est&aacute; seguro que quiere eliminar las asociaciones seleccionadas?';
            mensajemascara = 'Eliminando asociaciones';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar la asociaci&oacute;n seleccionada?';
            mensajemascara = 'Eliminando asociaci&oacute;n';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                for (var i = 0; i < selections.length; i++) {
                    _this.stgdocumental.remove(selections[i]);
                }
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestordocumental/eliminarAsociadionDoc',
                    params: {
                        idnodoselect: Ext.encode(arraydocumentos),
                        idelemento: idselected
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.resp == 1) {
                            var mensajeconfirmacion = '';
                            if (arraydocumentos.length > 1)
                                mensajeconfirmacion = 'Las asociaciones han sido eliminadas satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'La asociaci&oacute;n ha sido eliminada satisfactoriamente.';
                            mostrarMensaje(1, mensajeconfirmacion);
                        }
                        if (responseData.mensaje == 4) {
                            var mensajeconfirmacion2 = '';
                            if (arraydocumentos.length > 1)
                                mensajeconfirmacion2 = 'Los documentos que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'El documento que usted quiere eliminar ya no se encuentra en los registros.';

                            mostrarMensaje(1, mensajeconfirmacion2, function () {
                                _this.stgdocumental.reload();
                            });
                        }
                    }
                });
            } else {
                if (_this.smggestordocumental.hasSelection()) {
                    _this.smggestordocumental.clearSelections();
                }
            }
        });
    };

    function MostrarImagenTipoElemento(valor, m, rec) {
        return '<span><img src="' + rec.data.icono + '" width = 16px height = 16px >' + ' ' + valor + '</span>';
    }

    function replaceAll(text, busca, reemplaza) {
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca, reemplaza);
        return text;
    }


};
