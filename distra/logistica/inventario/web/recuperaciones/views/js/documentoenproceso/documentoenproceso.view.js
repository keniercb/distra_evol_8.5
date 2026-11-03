Ext.ns('Ext.erp.documentoenproceso');
Ext.erp.documentoenproceso = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/documentoenproceso';
        config.urlBusquedaGridPrincipal = 'getDocumentosPorEstado';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        config.busquedaAvanzada = true;
        config.idioma = {};
        Ext.erp.documentoenproceso.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.inv.DocumentoenProceso.Idioma);
        _this.concepto = this.idioma.documentos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
        _this.criterio = null;

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({
            header: this.idioma.cgNumDocumento,
            width: 120,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNumReferencia,
            width: 120,
            dataIndex: 'numeroref',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipo,
            width: 200,
            //dataIndex: 'iddoc',
            dataIndex: 'tipodoc',
            default: true/*,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                _this.documentos = store.reader.jsonData.documentos;
                return _this.getTipoDocById(value);
            }*/
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 90,
            dataIndex: 'estado',
            default: true/*,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }*/
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreacion,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUsuario,
            width: 120,
            //dataIndex: 'idusuario',
            dataIndex: 'nombreusuario',
            default: true/*,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }*/
        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.getReportes(_this);
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));

        this.comboDepositos = new LOG.util.LovCombo({
            mode: 'remote',
            url: _this.dirController + '/cargardepositos',
            displayField: 'deposito',
            valueField: 'iddeposito',
            autoLoad: false
        });
        this.lbDeposito = new Ext.form.Label({
            text: _this.idioma.lbDeposito
        });
        this.addToolbarButton("->");
        this.addToolbarButton(this.lbDeposito);
        this.addToolbarButton(" ");
        this.addToolbarButton(this.comboDepositos);
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idDocEnProceso'}));

    },
    init: function () {
        var _this = this;
        Ext.erp.documentoenproceso.superclass.init.call(this);
        _this.entidades = [];
        _this.entidadesCheck = _this.listaBotones.getItem(4).getCheckedValue();
        this.comboDepositos.store.load({
            callback: function () {
                for (var i = 0; i < _this.listaBotones.getItem(4).store.data.items.length; i++) {
                    _this.entidades.push(_this.listaBotones.getItem(4).store.data.items[i].data.iddeposito);
                }
                //var a = _this.entidadesCheck ? _this.entidadesCheck : _this.entidades;
                var a = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: a,
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });

                _this.getStorePrincipal().load()
            }

        });
        this.comboDepositos.on({
            'select': function () {
                _this.entidades = [];
                /*_this.entidadesCheck=[];*/
                /*for(var i=0; i < _this.listaBotones.getItem(4).store.data.items.length; i++) {
                    if (_this.listaBotones.getItem(4).view.store.data.items[i].data.checked) {
                        _this.entidadesCheck.push(_this.listaBotones.getItem(4).view.store.data.items[i].data.iddeposito);
                    }
                }*/
                _this.entidadesCheck = _this.listaBotones.getItem(4).getCheckedValue();
                for (var i = 0; i < _this.listaBotones.getItem(4).store.data.items.length; i++) {
                    _this.entidades.push(_this.listaBotones.getItem(4).store.data.items[i].data.iddeposito);
                }
                var a = _this.entidadesCheck ? _this.entidadesCheck : _this.entidades;
                //var a = _this.entidadesCheck ? '+_this.entidadesCheck+' : '{'+_this.entidades.join()+'}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: Ext.encode(_this.entidadesCheck),
                        //idestructura: a,
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });
                _this.getStorePrincipal().load()
            }
        })
        /*this.comboDepositos.getStore().on({
            'load': function (st, records, opts) {
                for (var i = 0; i < st.getCount(); i++) {
                    _this.entidades.push(records[i].get('iddeposito'));
                }
                var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });

                _this.getStorePrincipal().load()
            }
        });
        this.comboDepositos.getStore().load();
        this.comboDepositos.on({
            'select': function (cb,record) {
                _this.entidades = [];
                _this.entidadesCheck = cb.getCheckedValue();
                for (var i = 0; i < cb.store.getCount(); i++) {
                    _this.entidades.push(cb.store.data.items[i].id);
                }
                var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: Ext.encode(ents),
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });
                _this.getStorePrincipal().load()
            }
        })*/

    },
    render: function () {
        var _this = this;
        var render = Ext.erp.documentoenproceso.superclass.render.call(this);

        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            criterio: (_this.criterio) ? _this.criterio : null
        });
        return render;
    },
    getUsuarioById: function (id) {
        var _this = this;

        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    getTipoDocById: function (id) {
        var _this = this;

        for (var i = 0; i < _this.documentos.length; i++) {
            if (_this.documentos[i].iddoc == id) {
                return _this.documentos[i].denominacion;
            }
        }
        return '-';
    },
    view: function () {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var clsGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        _this.comboUsuario = new LOG.lb.documento.ComboUsuarios({
            fieldLabel: this.idioma.lbCbCreadoPor,
            campo: 'idusuario',
            alias: 'aperturaLog',
            subsistema: 10,
            hiddenName: 'idusuario'
        });
        _this.estado = new LOG.util.ComboBox({
            name: 'estado',
            fieldLabel: this.idioma.lbCbEstado,
            mode: 'local',
            forceSelection: true,
            valueField: 'idestado',
            displayField: 'estado',
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, this.idioma.textCbElaboracion],
                    [2, this.idioma.textCbPreparado]
                ]
            }),
            width: 200
        });
        _this.desde = new Ext.form.DateField({
            name: 'desde',
            fieldLabel: this.idioma.lbDfDesde,
            width: 200,
            format: 'd/m/Y',
            editable: false,
            id: 'desde',
            vtype: 'daterange',
            endDateField: 'hasta',
            /*listeners: {
                'select': function (campo, value) {
                    _this.hasta.setMinValue(campo.getValue());
                }
            }*/
        });
        _this.hasta = new Ext.form.DateField({
            name: 'hasta',
            fieldLabel: this.idioma.lbDfHasta,
            width: 200,
            format: 'd/m/Y',
            editable: false,
            id: 'hasta',
            vtype: 'daterange',
            startDateField: 'desde',
            /*listeners: {
                'select': function (campo, value) {
                    _this.desde.setMaxValue(campo.getValue());
                }
            }*/
        });
        _this.desde.endDateField = _this.hasta.id; //-------validacion de fecha
        _this.hasta.startDateField = _this.desde.id;
        //this.desde.endDateField = this.hasta;

        cls.addComponent(_this.comboUsuario);
        cls.addComponent(_this.estado);
        cls.addComponent(_this.desde);
        cls.addComponent(_this.hasta);

        clsGeneral.addComponent(cls);
        /*clsGeneral.addComponent(
            new LOG.lb.documento.ComboTipoDocumento({
                 fieldLabel: this.idioma.lbCbTipo,
                 //subsistema: 10,
                 hiddenName: 'iddoc'

            })
        );*/
        clsGeneral.addComponent(new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbTipo,
            editable: false,
            url: '/logistica/inventario/recuperaciones/index.php/documentoenproceso/cargarTipoDocumento',
            hiddenName: 'iddoc',
            name: 'iddoc',
            valueField: 'iddoc',
            displayField: 'denominacion'
        }));

        _this.addFilterComponent(clsGeneral);
        var p = Ext.erp.documentoenproceso.superclass.view.call(this);
        this.gridFilter.btnLimpiar.on({
            'click': function () {
                /*_this.comboDepositos.reset();
                for (var i=0; i < _this.comboDepositos.store.data.items.length; i++) {
                    _this.comboDepositos.store.data.items[i].set('checked',false);
                }
                _this.getStorePrincipal().reload();*/
                _this.comboDepositos.reset();
                for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
                    _this.comboDepositos.store.data.items[i].set('checked', false);
                }

                _this.storePrincipal.on('beforeload', function (store) {
                    store.baseParams = {
                        idestructura: '{}',
                        fechainicio: null,
                        fechafin: null,
                        criterio: null,
                        start: 0,
                        limit: null
                    };
                });

                for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
                    _this.entidades.push(_this.comboDepositos.store.data.items[i].id);
                }
                var ents = '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function (store) {
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        criterio: null,
                        limit: null,
                        valor: 0
                    };
                });

                _this.getStorePrincipal().load();
            }
        });
        return p;
    },
    getReportes: function (data) {
        var _this = this;
        var estado = _this.getPanelBusqueda().items.items[0].form.items.items[2].getValue();
        var desde = _this.getPanelBusqueda().items.items[0].form.items.items[1].getValue();
        var hasta = _this.getPanelBusqueda().items.items[0].form.items.items[3].getValue();
        var depositos = '';
        _this.entidadesCheck = [];
        _this.entidades = [];

        if (this.comboDepositos.view) {
            for (var i = 0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if (_this.entidadesCheck.length > 0) {
                depositos = "{" + _this.entidadesCheck.join() + "}";
            } else {
                depositos = "{" + _this.entidades.join() + "}";
            }
        } else {
            for (var i = 0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            depositos = "{" + _this.entidades.join() + "}";
        }
        var criterioBusqueda = (this.getGridPrincipal().toolbars[0].items.items[1].getValue()) ? this.getGridPrincipal().toolbars[0].items.items[1].getValue() : null;
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/DocumentosEnProceso',
                    name: 'DocumentosEnProceso',
                    isList: true,
                    params: {
                        arraydeposito: depositos ? depositos : null,
                        criterio: criterioBusqueda ? criterioBusqueda : null,
                        estadodocumento: (estado) ? ('{' + estado + '}') : '{1,2}',
                        tipodocumento: _this.getPanelBusqueda().items.items[0].form.items.items[4].getValue() ? _this.getPanelBusqueda().items.items[0].form.items.items[4].getValue() : null,
                        creadopor: _this.getPanelBusqueda().items.items[0].form.items.items[0].getValue() ? _this.getPanelBusqueda().items.items[0].form.items.items[0].getValue() : null,
                        fechainicio: (desde) ? desde : null,
                        fechafin: (hasta) ? hasta : null,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema ? _this.storePrincipal.reader.jsonData.idsubsistema : null
                    }
                }
            ]
        });
        this.tipoReportes.view();

    }

});
