/**
 Vista principal Gestionar documentos de lecturas del medidor
 Autor: Danilo Milán Araujo
 **/
Ext.ns('Logistica.lecturamedidor');

Logistica.lecturamedidor.VistaPrincipal = function(idioma, modelo) {
    var self = this;
    /**---------------------SelectionModel ---record seleccionado-------**/
    this.documento = new Ext.grid.RowSelectionModel({singleSelect: false});

    /**-----------Documento seleccionado----------------------------------**/
    this.documentoSelecionado = function() {
        return this.documento.getSelected();
    };
    /**-------------Botones para la busqueda de documentos-----------------------------**/
    this.btnBuscar = new Ext.Button({
        disabled: true,
        iconCls: 'btn',
        icon: perfil.dirImg + 'buscar.png',
        text: idioma.lbBtnBuscar,
        tooltip: idioma.tooltipBuscar
    });
    this.btnBusquedaAvanzada = new Ext.Button({
        iconCls: 'btn',
        icon: perfil.dirImg + 'buscaravanzada.png',
        text: idioma.lbBtnBusquedaAvanzada,
        tooltip: idioma.tooltipBusquedaAvanz
    });
    this.btnLimpiar = new Ext.Button({
        iconCls: 'btn',
        icon: perfil.dirImg + 'limpiar.png',
        text: idioma.lbBtnLimpiar,
        tooltip: idioma.tooltipLimpiar
    });


    this.comboStatus = new Ext.form.ComboBox({
        emptyText: idioma.comboVacio,
        editable: false,
        store: modelo.storeStatus,
        valueField: 'idstatus',
        displayField: 'status',
        hiddenName: 'idstatus',
        forceSelection: true,
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        listeners: {
            'specialkey': function(cmp, e) {
                if (e.getKey() == Ext.EventObject.ENTER) {
                    self.buscar();
                }
            }
        }
    });
    this.buscarNumero = new Ext.form.NumberField({
        width: 80,
        enableKeyEvents: true,
        allowNegative: false,
        maxLength: 10,
        listeners: {
            'specialkey': function(cmp, e) {
                if (e.getKey() == Ext.EventObject.ENTER) {
                    self.buscar();
                }
            }
        }
    });
    this.buscarAnno = new Ext.form.NumberField({
        width: 80,
        enableKeyEvents: true,
        allowNegative: false,
        maxLength: 4,
        listeners: {
            'specialkey': function(cmp, e) {
                if (e.getKey() == Ext.EventObject.ENTER) {
                    self.buscar();
                }
            }
        }
    });
    /**------------formatear la fecha---------------------**/
    var formatoFecha = function(val) {
        return Ext.util.Format.date(val, 'd/m/Y');
    };
    this.setNombre = function(v) {
        return v + " " + idioma.lbCliente;
    };

    /**------------Grid para listar los documentos----------------------------**/
    this.listado = new Ext.grid.GridPanel({
        cls: 'x-toolbar',
        region: 'center',
        autoExpandColumn: 'estado',
        sm: this.documento,
        store: modelo.listadoDocumentos,
        loadMask: {
            store: modelo.listadoDocumentos,
            msg: idioma.textCargandoDocs
        },
        columns: [
            new Ext.grid.RowNumberer({header: idioma.lbnum, width: 30, aling: 'center'}),
            {header: idioma.lbnumDoc, width: 100, dataIndex: 'nrodoc', align: 'center'},
            {
                header: idioma.lbCliente,
                width: 180,
                dataIndex: 'clientes',
                id: 'clientes' /*, renderer: self.setNombre*/
            },
            {header: idioma.lbServicios, width: 250, dataIndex: 'servicio', id: 'servicio'},
            {header: idioma.lbAnno, width: 80, dataIndex: 'anno'},
            {header: idioma.lbFecha, width: 100, dataIndex: 'fechacontable', renderer: formatoFecha},
            {header: idioma.lbStatus, width: 120, dataIndex: 'estado', id: 'estado'},
            {hidden: true, hideable: false, dataIndex: 'idestado'},
            {hidden: true, hideable: false, dataIndex: 'idproducto'},
            {hidden: true, hideable: false, dataIndex: 'idindicador'},
            {hidden: true, hideable: false, dataIndex: 'precio'},
            {hidden: true, hideable: false, dataIndex: 'idservicio'},
            {hidden: true, hideable: false, dataIndex: 'iddocumento'}
        ],
        tbar: [new Ext.Toolbar.TextItem(idioma.lbnumDoc + ':'), this.buscarNumero, new Ext.Toolbar.TextItem(idioma.lbAnno + ':'), this.buscarAnno, new Ext.Toolbar.TextItem(idioma.lbStatus + ':'), this.comboStatus, this.btnBuscar, this.btnBusquedaAvanzada, this.btnLimpiar],
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: modelo.listadoDocumentos,
            displayInfo: true
        })
    });

    modelo.storeStatus.load();

    /**----------Botonnes del toolbar------------------------------**/
    this.btnAdicionar = new Ext.Button({
        text: idioma.lbBtnAdicionar,
        tooltip: idioma.tooltipAdicDoc,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn'
    });
    this.btnModificar = new Ext.Button({
        disabled: true,
        text: idioma.lbBtnModificar,
        tooltip: idioma.tooltipModDoc,
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn'
    });
    this.btnEliminar = new Ext.Button({
        disabled: true,
        text: idioma.lbBtnEliminar,
        tooltip: idioma.tooltipElimDoc,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn'
    });
    this.btnLecturas = new Ext.Button({
        disabled: true,
        iconCls: 'btn',
        icon: perfil.dirImg + 'detalles.png',
        text: idioma.lbBtnLecturas,
        tooltip: idioma.tooltipLecDoc
    });
    this.btnConfirmar = new Ext.Button({
        disabled: true,
        iconCls: 'btn',
        icon: perfil.dirImg + 'confirmar.png',
        text: idioma.lbBtnConfirmar,
        tooltip: idioma.tooltipConfirDoc
    });
    this.btnAprobar = new Ext.Button({
        disabled: true,
        iconCls: 'btn',
        icon: perfil.dirImg + 'aprobar.png',
        text: idioma.lbBtnFacturar,
        tooltip: idioma.tooltipAprobarDoc
    });
    this.btnAnularStatus = new Ext.Button({
        disabled: true,
        iconCls: 'btn',
        icon: perfil.dirImg + 'cancelarestado.png',
        text: idioma.lbBtnAnularStatus,
        tooltip: idioma.tooltipAnulStatDoc
    });
    this.btnImprimirmodelo = new Ext.Button({
        disabled: true,
        iconCls: 'btn',
        icon: perfil.dirImg + 'imprimir.png',
        text: idioma.lbBtnImprimirModelo,
        tooltip: idioma.tooltipImpModeloDoc
    });
    this.btnImprimirlistado = new Ext.Button({
        iconCls: 'btn',
        icon: perfil.dirImg + 'imprimir.png',
        text: idioma.lbBtnImprimirListado,
        tooltip: idioma.tooltipImpListadoDoc,
        handler: function() {
            var params = {};
            if (self.buscarNumero.getValue().length > 0)
                params.nrodoc = self.buscarNumero.getValue();
            if (self.buscarAnno.getValue().length > 0)
                params.anno = self.buscarAnno.getValue();
            if (self.comboStatus.getValue() != null)
                params.estado = self.comboStatus.getValue();

            var report = new Ext.erp.LogisticaReport({});
            report.showReport('generarlistadofacturas', params)
        }
    });
    this.btnAyuda = new Ext.Button({
        iconCls: 'btn',
        icon: perfil.dirImg + 'ayuda.png',
        text: idioma.lbBtnAyuda,
        tooltip: idioma.tooltipAyuda
    });


    /**--------------Toolbar con los botones---------------------------------------**/
    this.Tb = new Ext.Toolbar({
        items: [
            this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnLecturas, this.btnConfirmar, this.btnAprobar, this.btnAnularStatus,
            this.btnImprimirlistado, '->', this.btnAyuda
        ]
    });

    /**-----------Panel que contiene los elementos -----------------------------**/
    this.panel = new Ext.Panel({
        layout: 'border',
        items: [
            {
                xtype: 'panel',
                layout: 'form',
                region: 'north',
                autoHeight: true,
                items: [this.Tb],
                listeners: {
                    'render': function(th) {
                        self.panel.getEl().mask(idioma.textCargando, 'x-mask-loading');

                    }
                }
            },
            this.listado
        ]
    });

    /**---------Viewport gestionar documentos lecturas del medidor--------------------**/
    this.viewport = new Ext.Viewport({
        layout: 'fit',
        items: [this.panel]
    });

    /**-----------Cambiar estado de los botones-------------------------------------**/
    this.cambiarEstadoBtn = function(record) {
        if (record) {
            if (record.data.idestado == "1") {
                this.btnModificar.setDisabled(false);
                this.btnConfirmar.setDisabled(false);
                this.btnEliminar.setDisabled(false);
            } else {
                this.btnModificar.setDisabled(true);
                this.btnConfirmar.setDisabled(true);
                this.btnEliminar.setDisabled(true);
            }
            if (record.data.idestado == "2") {
                this.btnAnularStatus.setDisabled(false);
                this.btnAprobar.setDisabled(false);
            } else {
                this.btnAnularStatus.setDisabled(true);
                this.btnAprobar.setDisabled(true);
            }
            this.btnLecturas.setDisabled(false);
            this.btnImprimirmodelo.setDisabled(false);
        } else {
            this.btnModificar.setDisabled(true);
            this.btnEliminar.setDisabled(true);
            this.btnConfirmar.setDisabled(true);
            this.btnAnularStatus.setDisabled(true);
            this.btnAprobar.setDisabled(true);
            this.btnImprimirmodelo.setDisabled(true);
            this.btnLecturas.setDisabled(true);
        }
        this.btnImprimirlistado.setDisabled(false);
    };
    /**---------------Eliminar Documento---------------**/
    this.eliminarDocumento = function() {
        var msgs = [idioma.msgEliminarDoc, idioma.msgDocEliminado, idioma.msgErrorEliminandoDoc, idioma.msgEliminando];
        this.enviar('eliminarDocumento', msgs);
    };
    /**----------------Confirmar un documento----------------------------------**/
    this.confirmar = function(iddocumento, vistaLecturas) {
        var msgs = [idioma.msgConfirmarDoc, idioma.msgDocConfirmado, idioma.msgErrorConfirmandoDoc, idioma.msgConfirmando];
        this.enviar('confirmarDocumento', msgs, iddocumento, vistaLecturas);
    };
    /**----------------Aprobar un documento----------------------------------**/
    this.aprobar = function() {
        var msgs = [idioma.msgAprobarDoc, idioma.msgDocAprobado, idioma.msgErrorAprobandoDoc, idioma.msgErrorDocExistente, idioma.msgAprobando, idioma.msgErrorNoServicioConOperacion, idioma.msgErrorNoServicioConfigurado];
        this.enviar('aprobarDocumento', msgs);
    };
    /**----------------Anular status de un documento----------------------------------**/
    this.anularStatus = function(iddocumento, vistaLecturas) {
        var msgs = [idioma.msgAnularStatusDoc, idioma.msgStatusDocAnulado, idioma.msgErrorAnulandoStatusDoc, idioma.msgAnulandoStatus];
        this.enviar('anularStatusDocumento', msgs, iddocumento, vistaLecturas);
    };
    /**----------------Anular un documento----------------------------------**/
    this.anularDocumento = function(iddocumento, vistaLecturas) {
        var msgs = [idioma.msgAnularDoc, idioma.msgDocAnulado, idioma.msgErrorAnulandoDoc, idioma.msgAnulando];
        this.enviar('anularDocumento', msgs, iddocumento, vistaLecturas);
    };
    /**----------------peticion Ajax para ejecular las funciones(eliminar, aprobar, confirmar, anular, anular status)------------------**/
    this.enviar = function(url, msgs, iddocumento, vistaLecturas, idservicio) {
        var params = {};
        params.iddocumento = iddocumento ? iddocumento : this.documentoSelecionado().data.iddocumento;
        params.idservicio = idservicio ? idservicio : this.documentoSelecionado().data.idservicio;
        params.fechacontable = Ext.util.Format.date(this.documentoSelecionado().data.fechacontable, 'm/d/Y');
        if (url == 'confirmarDocumento') {
            Ext.Ajax.request({
                url: 'obtenerClienteSinLecturas',
                method: 'POST',
                params: params,
                callback: function(options, success, response) {
                    var result = Ext.decode(response.responseText);
                    if (result.nocliente == true) {
                        mostrarMensaje(1, idioma.msgDocSinCliente);
                    } else if (result.clientesinlectura == true) {
                        mostrarMensaje(1, idioma.msgDocSinLectura);
                    } else if (result.sinlectura == true) {
                        var arrayClientes = result.idclientes;
                        params.idmedicioncliente = Ext.encode(arrayClientes);
                        var msg = [idioma.msgDocClienteNoTieneLectura, idioma.msgLecEliminada, idioma.msgErrorEliminandoMed, idioma.msgEliminandoMed];
                        self.enviarDoc(params, 'eliminarClienteSinLectura', msg, iddocumento, vistaLecturas);
                    } else
                        self.enviarDoc(params, url, msgs, iddocumento, vistaLecturas);
                }
            });
        } else
            self.enviarDoc(params, url, msgs, iddocumento, vistaLecturas);

    };

    this.enviarDoc = function(params, url, msgs, iddocumento, vistaLecturas) {
        var msg = msgs[3];
        mostrarMensaje(2, msgs[0], function(btnPresionado) {
            if (btnPresionado == 'ok') {
                if (url == 'aprobarDocumento') {
                    msg = msgs[4];
                    var arr = self.documento.getSelections();
                    var iddocuments = new Array();
                    Ext.each(arr, function(recods, index) {
                        if (recods.get('idestado') == "2") {
                            iddocuments.push({
                                iddocumento: recods.get('iddocumento'),
                                idservicio: recods.get('idservicio')
                            });
                        }
                    });
                    params.iddocuments = Ext.encode(iddocuments);
                } else if (url == 'eliminarDocumento') {
                    var arr = self.documento.getSelections();
                    var iddocuments = new Array();
                    Ext.each(arr, function(recods, index) {
                        iddocuments.push({
                            iddocumento: recods.get('iddocumento'),
                            idservicio: recods.get('idservicio')
                        });
                    });
                    params.iddocuments = Ext.encode(iddocuments);

                }

                self.viewport.getEl().mask(msg, 'x-mask-loading');
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: params,
                    callback: function(options, success, response) {
                        self.desbloqueardoc();
                        self.viewport.getEl().unmask();
                        var result = Ext.decode(response.responseText);
                        if (result.success == true) {
                            if (vistaLecturas) {
                                vistaLecturas.actualizarEstadoBotones(result.idestado);
                                vistaLecturas.listadoLecturas.reload();
                            }
                            self.cargar();
                            mostrarMensaje(1, msgs[1]);
                        } else if (result.success == false && result.msg == 'errorAproDoc') {
                            mostrarMensaje(1, msgs[2]); //mensaje error							
                        } else {
                            if (result.cod == 1) {
                                mostrarMensaje(1, msgs[5]); //mensaje error
                            } else if (result.cod == 3) {
                                mostrarMensaje(1, msgs[6]); //mensaje error
                            } else {
                                mostrarMensaje(1, msgs[2]); //mensaje error
                            }
                        }
                    }
                });
            } else
                self.desbloqueardoc();
        });
    };

    /**-------------Cargar el grid de documentos con los parametros existentes--------------------**/
    this.cargar = function(params) {
        var params = (params) ? params : {};
        params.start = 0;
        params.limit = 10;
        modelo.listadoDocumentos.load({
            params: params
        });
    };
    /**--------------Buscar documentos ----------------------------------------------**/
    this.buscar = function() {
        var params = (params) ? params : {};
        params.start = 0;
        params.limit = 10;
        params.numero = this.buscarNumero.getValue();
        params.anno = this.buscarAnno.getValue();
        params.idstatus = this.comboStatus.getValue();
        modelo.listadoDocumentos.load({
            params: params,
            callback: function() {
                if (modelo.listadoDocumentos.getCount() == 0)
                    mostrarMensaje(1, idioma.msgNoExisteDatos);
            }
        });

    };
    /**---------------Limpiar los campos de busqueda y cargar todos los documentos-------------------------**/
    this.limpiar = function() {
        this.buscarAnno.reset();
        this.buscarNumero.reset();
        this.comboStatus.reset();
        this.btnBuscar.setDisabled(true);
        this.cargar();
    };
    /**---------------Busqueda avanzada----------------------------------------**/
    this.busquedaAvanzada = function(params) {
        var params = (params) ? params : {};
        params.start = 0;
        params.limit = 10;
        modelo.listadoDocumentos.load({
            params: params,
            callback: function() {
                if (modelo.listadoDocumentos.getCount() == 0)
                    mostrarMensaje(1, idioma.msgNoExisteDatos);
            }
        });
    };

    this.adicionarPrimerRecord = function() {
        RecordStatus = Ext.data.Record.create(modelo.storeStatus.fields.items);
        r = new RecordStatus({});
        r.data.idstatus = null;
        r.data.status = idioma.comboVacio;
        modelo.storeStatus.insert(0, r);
    };

    //Saber si en un array de records si existe un valor
    this.existsValue = function(records, value) {
        var flags = false;
        for (var i = 0; i < records.length; i++) {
            if (records[i].get('idestado') == value) {
                flags = true;
                break
            }
        }
        return flags;
    };

    /**-----------Des/Habilitar boton buscar------------------------------------**/
    this.cambiarEstadoBtnBuscar = function() {
        var estado = self.buscarNumero.getValue() || self.buscarAnno.getValue() || self.comboStatus.getValue() ? false : true;
        self.btnBuscar.setDisabled(estado);
    };


    /**-----------------Eventos------------------------------------------------**/
    this.btnAdicionar.on('click', function() {
        var mod = false;
        var obj = new Logistica.lecturamedidor.VistaAMDocLectura(idioma, modelo, this, mod);
        obj.mostrar();
    }, this);
    this.btnModificar.on('click', function() {
        this.verificarBloqueoNoventana(function() {
            var mod = true;
            var docSelected = self.documentoSelecionado();
            var obj = new Logistica.lecturamedidor.VistaAMDocLectura(idioma, modelo, self, mod, docSelected);
            obj.mostrar();
        })
    }, this);

    this.btnEliminar.on('click', function() {
        this.verificarBloqueoNoventana(function() {
            self.eliminarDocumento();
        })
    }, this);

    this.btnLecturas.on('click', function() {
        this.verificarBloqueoNoventana(function() {
            var documento = self.documentoSelecionado();
            var obj = new Logistica.lecturamedidor.VistaLecturas(idioma, modelo, documento, self);
            obj.mostrar();
        })
    }, this);
    this.btnConfirmar.on('click', function() {
        this.verificarBloqueoNoventana(function() {
            var documento = self.documentoSelecionado();
            var vistaLecturas = new Logistica.lecturamedidor.VistaLecturas(idioma, modelo, documento, self);
            self.confirmar(documento.data.iddocumento, vistaLecturas);
        })
    }, this);
    this.btnAprobar.on('click', function() {
        this.verificarBloqueoNoventana(function() {
            self.aprobar();
        })
    }, this);
    this.btnAnularStatus.on('click', function() {
        this.verificarBloqueoNoventana(function() {
            self.anularStatus();
        });
    }, this);
    this.btnImprimirmodelo.on('click', function() {
        this.imprimirDocumento();
    }, this);
    this.btnAyuda.on('click', function() {
        var title = 'Ayuda del componente gestionar lecturas al medidor';
        var referencia = 'Logistica/Facturacion/Gestionar_lecturas';
        help.show(title, referencia);
    }, this);
    this.btnBuscar.on('click', function() {
        this.buscar();
    }, this);
    this.btnBusquedaAvanzada.on('click', function() {
        var busquedaAvanz = new Logistica.lecturamedidor.VistaBADocLectura(idioma, modelo, this);
        busquedaAvanz.mostrar();
    }, this);
    this.btnLimpiar.on('click', function() {
        this.limpiar();
    }, this);
    this.documento.on('rowselect', function(th, index, record) {
        var records = th.getSelections();
        if (records.length > 1) {
            if ((self.existsValue(records, "1"))) {
                this.btnModificar.setDisabled(false);
                this.btnConfirmar.setDisabled(false);
            } else {
                this.btnModificar.setDisabled(true);
                this.btnConfirmar.setDisabled(true);
            }
            if ((self.existsValue(records, "2"))) {
                this.btnAnularStatus.setDisabled(false);
                this.btnAprobar.setDisabled(false);
            } else {
                this.btnAnularStatus.setDisabled(true);
                this.btnAprobar.setDisabled(true);
            }
            if ((self.existsValue(records, "1"))) {
                this.btnEliminar.setDisabled(true);
            } else {
                this.btnEliminar.setDisabled(false);
            }
            this.btnModificar.setDisabled(true);
            this.btnConfirmar.setDisabled(true);
            this.btnAnularStatus.setDisabled(true);
            this.btnImprimirmodelo.setDisabled(true);
            this.btnLecturas.setDisabled(true);
        } else {
            this.cambiarEstadoBtn(record);
        }
    }, this);
    this.documento.on('rowdeselect', function() {
        this.btnEliminar.disable();
    }, this);
    modelo.listadoDocumentos.on('load', function(st, records, opt) {
        this.cambiarEstadoBtn();
    }, this);

    modelo.storeStatus.on('load', function() {
        self.adicionarPrimerRecord();
        self.panel.getEl().unmask();
        self.cargar();
    });
    this.buscarAnno.on('keyup', self.cambiarEstadoBtnBuscar);
    this.buscarNumero.on('keyup', self.cambiarEstadoBtnBuscar);
    this.comboStatus.on('select', self.cambiarEstadoBtnBuscar);
    this.desbloquearCdoc = function() {
        var _this = this;
        if (!_this.cerrar) {
            Ext.Ajax.request({
                url: '../gestfacturacion/desbloqueardoc',
                method: 'POST',
                params: {
                    cerrar: 1
                },
                callback: function(options, success, response) {
                    self.cerrar = true;
                    window.parent.Ext.getCmp('win' + window.frameElement.id).close();

                }
            });
            return false;
        } else
            return true;
    };
    this.desbloqueardoc = function() {
        var _this = this;
        Ext.Ajax.request({
            url: '../gestfacturacion/desbloqueardoc',
            method: 'POST',
            params: {
                iddocumento: self.documentoSelecionado().data.iddocumento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
            }
        });
    };
    this.verificarBloqueoNoventana = function(opcion) {
        var _this = this;
        Ext.Ajax.request({
            url: '../gestfacturacion/verificarbloqueo',
            method: 'POST',
            params: {
                iddocumento: _this.documentoSelecionado().data.iddocumento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (!responseData.codMsg) {
                    opcion();
                }
            }

        });
    }

    window.parent.Ext.getCmp('win' + window.frameElement.id).on({
        beforeclose: function() {
            return self.desbloquearCdoc();
        }
    });
};
