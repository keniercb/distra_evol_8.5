LOG.farm.reenvase.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos,{
    listaGridColumnsOrigen: undefined,
    listaGridColumnsDestino: undefined,
    listaBotonesLotes: undefined,
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.farm.reenvase.Idioma);
        this.listaGridColumnsOrigen = new LOG.util.List();
        this.listaGridColumnsDestino = new LOG.util.List();
        this.listaBotonesLotes = new LOG.util.List();
        this.modelo = new LOG.farm.reenvase.Model({
            idioma: config.idioma
        });
        LOG.farm.reenvase.VentanaAdicionar.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.farm.reenvase.VentanaAdicionar.superclass.initDefaultButtons.call(this);

        this.listaBotonesLotes.add(LOG.util.Prototipos.botonAdicionar({
            disabled:true,
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.ttBtnAdicionarLote,
            handler: function() {
                _this.scope.showVentanaLote();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.record && _this.record.data.estado == 1 &&  this.gridDetalles.store.data.items.length == 0 && !_this.listaBotonesLotes.getItem(1).disabled
                        ) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }
                else  {
                    b.setVisible(false);
                }
            }
        }));

        this.listaBotonesLotes.add(LOG.util.Prototipos.botonEliminar({
            disabled:true,
            tooltip: _this.idioma.ttBtnEliminarLote,
            handler: function() {
                _this.eliminarLote();
                _this.listaBotonesLotes.getItem(1).setDisabled(true);

            },
            controlFn: function (b, _caller) {
                b.setVisible(true);
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    if (_this.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function(e) {
                                if (_this.smGridDetalles.getSelections() && _this.panelSuperior.findByType('textfield')[4].getValue() && _this.record.data.estado != '3') {
                                    b.enable();
                                    
                                } else {
                                    b.disable();
                                }
                        }, 'eliminarLote');
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
    },
    initDefaultColumns: function(config) {
        var _this = this;
        LOG.farm.reenvase.VentanaAdicionar.superclass.initDefaultColumns.call(this);

        this.listaGridColumnsOrigen.add({
            header: _this.idioma.cgNroLoteOrigen,
            width: 80,
            dataIndex: 'nrolote',
            default: false
        });

        this.listaGridColumnsOrigen.add({
            header: _this.idioma.cgFechaFabricacionOrigen,
            width: 120,
            dataIndex: 'fechafabricacion',
            default: true
        });

        this.listaGridColumnsOrigen.add({
            header: _this.idioma.cgFechaVencimientoOrigen,
            width: 120,
            dataIndex: 'fechavencimiento',
            default: true
        });

        this.listaGridColumnsOrigen.add({
            header: _this.idioma.cgExistencaOrigen,
            width: 120,
            dataIndex: 'existencia',
            default: true
        });

        this.listaGridColumnsOrigen.add({
            header: _this.idioma.cgDisponibleOrigen,
            width: 120,
            dataIndex: 'disponible',
            default: true
        });

        this.listaGridColumnsOrigen.add(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidadOrigen,
            dataIndex: 'cantorigen',
            align: 'right',
            width: 120,
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({value: 0}),
            renderer: function(_v, _mD, _r) {
                _r.data.cantorigen = _v || 0;
                return _r.data.cantorigen;
            }
        }));

        this.listaGridColumnsOrigen.add({
            header: _this.idioma.cgTotalReenvasar,
            dataIndex: 'dosisunitariareal',
            align: 'right',
            width: 120,
            default: true
        });

        this.listaGridColumnsOrigen.add({dataIndex: 'idlote'});

        this.listaGridColumnsOrigen.add({dataIndex: 'idlotereenvase'});

        this.listaGridColumnsOrigen.add({dataIndex: 'idproducto'});

        this.listaGridColumnsDestino.add({
            header: _this.idioma.cgNroLoteDestino,
            width: 80,
            dataIndex: 'nrolote',
            default: false
        });

        this.listaGridColumnsDestino.add({
            header: _this.idioma.cgFechaFabricacionDestino,
            width: 120,
            dataIndex: 'fechafabricacion',
            default: false
        });

        this.listaGridColumnsDestino.add({
            header: _this.idioma.cgFechaVencimientoDestino,
            width: 120,
            dataIndex: 'fechavencimiento',
            default: false
        });

        this.listaGridColumnsDestino.add({
            header: _this.idioma.cgExistencaDestino,
            width: 120,
            dataIndex: 'existencia',
            default: false
        });

        this.listaGridColumnsDestino.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgCantidadDestino,
            dataIndex: 'cantdestino',
            align: 'right',
            width: 120,
            default: false
        }));

        this.listaGridColumnsDestino.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgCantidadRealReenvasada,
            dataIndex: 'cantrealreenvasada',
            align: 'right',
            width: 150,
            default: false
        }));

        this.listaGridColumnsDestino.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgDiferenciasDestino,
            dataIndex: 'diferencia',
            align: 'right',
            width: 120,
            default: false
        }));
    },
    builComponent: function () {
        this.idioma = this.idioma || LOG.farm.reenvase.Idioma;
        var _this = this;

        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            height: '30%',
            frame: true
        });

        this.smGridDetalles = LOG.util.UIManager.initSelectionModel(2);

        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsOrigen);

        this.cmGridDetalles = new Ext.grid.ColumnModel(cls.columns);

        this.recStGridDetalles = Ext.data.Record.create(cls.fields);

        this.stGridDetalles = new Ext.data.Store({
            url: 'cargarLotesOrigen',
            reader: new Ext.data.JsonReader({
                id: 'idlotereenvase',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDetalles)
        });

        this.stGridDetalles.on({
            'beforeload': function () {
                _this.stGridDetalles.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.stGridDetalles.initBaseParams.origen = 1;
            }
        });

        this.stGridDetalles.fireEvent = this.stGridDetalles.fireEvent.createSequence(function (e) {
            if (e == 'load') {
                _this.smGridDetalles.clearSelections();
                _this.smGridDetalles.fireEvent('rowdeselect');
                if (_this.stGridDetalles.getTotalCount() > 0) {
                    _this.smGridDetalles.selectFirstRow();
                }
            }
        });

        this.gridDetalles = LOG.util.UIManager.initEditableGridPanel(this.cmGridDetalles, this.stGridDetalles, this.smGridDetalles, {
            expanded: cls.expanded,
            nobbar: false
        });

        this.panelLotesOrigen = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesLotes.getArray()
            }),
            layout: 'fit',
            items: [this.gridDetalles]
        });

        this.panelLotesOrigen.doLayout();

        this.smGridDestino = LOG.util.UIManager.initSelectionModel(2);

        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsDestino);

        this.cmGridDestino = new Ext.grid.ColumnModel(cls.columns);

        this.recStGridDestino = Ext.data.Record.create(cls.fields);

        this.stGridDestino = new Ext.data.Store({
            url: 'cargarLotesDestino',
            reader: new Ext.data.JsonReader({
                id: 'idlote',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDestino)
        });

        this.stGridDestino.on({
            'beforeload': function () {
                _this.stGridDestino.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.stGridDestino.initBaseParams.destino = 1;
            }
        });

        this.stGridDestino.fireEvent = this.stGridDestino.fireEvent.createSequence(function (e) {
            if (e == 'load') {
                _this.smGridDestino.clearSelections();
                _this.smGridDestino.fireEvent('rowdeselect');
                if (_this.stGridDestino.getTotalCount() > 0) {
                    _this.smGridDestino.selectFirstRow();
                }
            }
        });

        this.gridDestino = LOG.util.UIManager.initEditableGridPanel(this.cmGridDestino, this.stGridDestino, this.smGridDestino, {
            expanded: cls.expanded,
            nobbar: false
        });

        this.panelLotesDestino = new Ext.form.FieldSet({
            title: _this.idioma.tlGridLoteDestino,
            layout: 'fit',
            items: [this.gridDestino]
        });

        this.panelLotesGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.panelLotesGeneral.addComponent(this.panelLotesOrigen);

        this.panelLotesGeneral.addComponent(this.panelLotesDestino);

        this.panelProductos = LOG.util.UIManager.initPanel({
            region: 'center',
            frame: true,
            items: [this.panelLotesGeneral]
        });

        this.panelProductos.doLayout();

        this.panelProductos.on({
            resize: function() {
                var alto = _this.panelProductos.getHeight()-15;
               _this.panelLotesOrigen.setHeight(alto);
               _this.panelLotesDestino.setHeight(alto);
            }

        });

        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this,
            controlFn: function() {
                _this.controlFnGuardar(_this.btnSalvar);
            }
        });

        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true);

        this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.panelSuperior, this.panelProductos],
            buttons: [this.btnCerrar, this.btnSalvar]
        });

        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
    },
    init: function () {
        this.builComponent();
        this.started = true;

        this.gridDestino.on({
            'beforeedit': function (e) {
                if (this.stGridDestino.getTotalCount() > 0) {
                    e.cancel = true;
                }
            }
        });
    },
    onShowHandler: function() {
        this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.listaBotonesLotes.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.scope.listaBotonesProductoOrigen.each(function (b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.scope.listaBotonesProductoDestino.each(function (b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.habilitarElementosComponentes();
    },
    onRenderHandler: function() {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);        
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            _this.scope.limpiarCamposProducto(true, true);
            if (_this.stGridDetalles) {
                _this.stGridDetalles.removeAll();
                _this.gridDetalles.getView().refresh();
            }
            if (_this.stGridDestino) {
                _this.stGridDestino.removeAll();
                _this.gridDestino.getView().refresh();
            }
        }

        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    onResetHandler: function () {
        var _this = this.scope || this;

        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.record = null;
            _this.stGridDetalles.removeAll();
            _this.gridDetalles.getView().refresh();
            _this.setTitle(_this.idioma.tlVentanaAdicionarReenvase);
            _this.onShowHandler();
        }
    },
    salvarHandler: function (params) {
        var _this = this.scope || this;
        params = params || null;

        var _arraylotes = new Array();
        var sumLotes = 0;

        var datosLotes = _this.stGridDetalles.getModifiedRecords();

        _this.modelo.idproducto = (_this.scope.idproducto) ? _this.scope.idproducto : _this.scope.TfProducto.getValue();

        Ext.each(datosLotes, function (record) {
            sumLotes += record.data.cantorigen;
            _arraylotes.push({
                idlote: record.data.idlote,
                idlotereenvase: record.data.idlotereenvase,
                cantidadorigen: record.data.cantorigen,
                dosisunitariareal: record.data.cantorigen * _this.scope.TfDosisUnitaria.getValue(),
            });
            _this.scope.TfCantidad.setValue(sumLotes);
            _this.modelo.cantidad = sumLotes;
            _this.varificarCantidad(record.data.cantorigen);
        });  

        if (_this.stGridDetalles.getTotalCount() == 0 && _arraylotes.length == 0) {
            mostrarMensaje(1, _this.idioma.msgValidarLotes);
            return;
        }

        _this.modelo.idarea = _this.scope.cmbArea.getValue();
        _this.modelo.salvar({
            arrayLotes: Ext.encode(_arraylotes)
        }, function (r) {
            _this.tipoVentana = 2;
            if (_this.panelSuperior && _this.panelSuperior.record == null) {
                _this.panelSuperior.record = {};
                Ext.apply(_this.panelSuperior.record, {
                    data: {
                        iddocumento: r.iddocumento,
                        nrodoc: r.nro,
                        numeroref: r.numeroref,
                        fechacontable: r.fecha,
                        idarea: r.idarea,
                        estado: "1"
                    }
                    
                });
                

            } else {
                _this.panelSuperior.record.data = '1'; 
            }
            _this.cargarProductos(r);
            _this.getTitleDocumento(r.iddocumento);
            _this.listaBotonesVentana.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);

            _this.scope.listaBotonesProductoOrigen.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);

            _this.listaBotonesLotes.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);

            _this.scope.listaBotonesProductoDestino.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
            if (_this.record) {
                _this.record.data.estado = 2;
            } else {
                _this.record = {
                    data: {
                        iddocumento: r.iddocumento,
                        nrodoc: r.nro,
                        numeroref: r.numeroref,
                        fechacontable: r.fecha,
                        idarea: r.idarea,
                        estado: 2
                    }
                }
            }
        
            _this.habilitarElementosComponentes();
        });

        _this.stGridDetalles.commitChanges();
        _this.controlBtns();
    },
    cargarProductos: function (parametros) {
        var objParams = parametros || {};
        this.stGridDetalles.load(objParams);
    },
    cargarDestinos: function (parametros) {
        var objParams = parametros || {};
        this.stGridDestino.load(objParams);
    },
    prepareDocModify: function (d) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.cargarProductos();
            this.cargarDestinos();
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    onShow: function () {
        var _this = this;
        this.listaBotonesVentana.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaBotonesLotes.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.scope.listaBotonesProductoOrigen.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.scope.listaBotonesProductoDestino.each(function (b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);

        _this.gridDetalles.on('beforeedit' , function(e){
            if(_this.record && _this.record.data.estado != 1){
                e.cancel=true;
            }
        }); 
       
    },
    varificarCantidad: function (cantidad) {
        var _this = this;
        if (parseFloat(cantidad) == 0) {
            mostrarMensaje(3, _this.idioma.msgErrorCantidades);
        }
        return;
    },
    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    controlBtns:function(){
        var _this = this;
        _this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, _this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        }, _this);
        _this.listaBotonesLotes.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        _this.scope.listaBotonesProductoOrigen.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        _this.scope.listaBotonesProductoDestino.each(function (b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
    },
    eliminarLote: function () {
        var _this = this;
        var idlotes = new Array();

        var seleccion =  _this.smGridDetalles.getSelections();

        mostrarMensaje(2, _this.idioma.msgDeleteLotes, function (btn, text) {
            if (btn === 'ok') {
                var old = false;
                Ext.each(seleccion, function (s) {
                    _this.stGridDetalles.modified.remove(s);
                    if (s.data.idlotereenvase != "") {
                        old = true;
                        idlotes.push(s.data.idlotereenvase);
                    }
                });

                _this.stGridDetalles.remove(seleccion);
                if (old) {
                    _this.modelo.eliminarLotes({
                        idlotes: Ext.encode(idlotes)
                    }, function () {
                        _this.cargarProductos();
                    });
                }
                _this.listaBotonesLotes.getItem(0).setDisabled(false);
                _this.listaBotonesLotes.getItem(1).setDisabled(true);
            }
        });
        
    },
    
    //funcion que habilita o deshabilita elementos de la vista segun varias condiciones como el tipo de ventana actual o el estado del documento
    habilitarElementosComponentes: function() {
        var _this = this;
        var nrecord = null;
        if(this.record !=null){
            nrecord = this.record.data;
        }
        if(_this.panelSuperior.record != null){
            nrecord = _this.panelSuperior.record.data;
        }        
        if(nrecord){ 
        if((this.tipoVentana == '2' && nrecord.estado == '2')){
            this.scope.listaBotonesProductoDestino.getItem(0).setDisabled(true);
            this.scope.listaBotonesProductoDestino.getItem(1).setDisabled(true);
            this.panelSuperior.findByType('combo').forEach(element =>{element.setDisabled(true);});
            this.panelSuperior.findByType('textfield').forEach(element => {element.setDisabled(true);});
        }
            if (this.tipoVentana == '2' && nrecord.estado == '1') {
                this.scope.listaBotonesProductoOrigen.getItem(1).setDisabled(false);
                this.scope.listaBotonesProductoDestino.getItem(0).setDisabled(false);
                this.scope.listaBotonesProductoDestino.getItem(1).setDisabled(false);
                this.scope.listaBotonesProductoDestino.getItem(2).setDisabled(true);
                if(this.panelSuperior.findByType('textfield')[14].getValue()!= ''){
                    this.panelSuperior.findByType('textfield')[16].setDisabled(false);
                    this.scope.listaBotonesProductoDestino.getItem(2).setDisabled(false);
                }
                if(this.panelSuperior.findByType('textfield')[4].getValue()!= ''){
                    this.panelSuperior.findByType('textfield')[6].setDisabled(false);
                    this.scope.listaBotonesProductoOrigen.getItem(1).setDisabled(false);
                }else{
                    this.scope.listaBotonesProductoOrigen.getItem(0).setDisabled(false);
                    this.scope.listaBotonesProductoOrigen.getItem(1).setDisabled(true);
                }
                if (this.areaunica) {
                    this.panelSuperior.findByType('combo')[0].setDisabled(true);
                } else {
                    this.panelSuperior.findByType('combo')[0].setDisabled(false);
                }


            }
            if(this.tipoVentana == '2' && nrecord.estado == '3'){
                this.listaBotonesLotes.getItem(0).setDisabled(true);
                this.listaBotonesLotes.getItem(1).setDisabled(true);
                this.panelSuperior.findByType('combo').forEach(element =>{element.setDisabled(true);});
                this.panelSuperior.findByType('textfield').forEach(element => {element.setDisabled(true);});
            }
            this.doLayout();
            this.panelSuperior.setVisible(true);
            this.doLayout();
    }
    },
});

LOG.farm.reenvase.fnImprimirModelo = function (iddocumento, idioma, idestructuracomun) {
    var repo = new LOG.util.Report({
        reports: [
            {
                typeView: 3,
                isList: false,
                name: 'Vista principal',
                params: {
                    iddocumento: iddocumento,
                    idestructura: idestructuracomun
                },
                dirReport: '/distra/logistica/farmacia/reenvase/ReenvaseModelo'
            }
        ]
    }).view();
}