Ext.ns('log.lb.auditoriadocumento');

LOG.lb.auditoriadocumento.View = Ext.extend(LOG.util.UITemplate, {
    usuarios: undefined,
    documentos: undefined,
    depositos: undefined,
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        this.modelo = new Log.lb.auditoriadocumento.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.cpDocumento;
        this.textBusquedaSimple = config.idioma.cgNroBusqueda;
        LOG.lb.auditoriadocumento.View.superclass.constructor.call(this, config);
        this.dirController = '/logistica/utiles/documento/index.php/auditoriadocumento';
        this.urlBusquedaGridPrincipal = 'devolverDocumentos';
        this.modoSeleccion = 1;
        this.autoShow = true;
        this.panelBotonesVisible = true;
    },
    init: function () {
        var _this = this;
        LOG.lb.auditoriadocumento.View.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            _this.getPanelPrincipal().add(_this.getPanelSur());
            _this.getGridPrincipal().getStore().on('load', function () {
                if (_this.getGridPrincipal().getStore().getCount() == 0) {
                    _this.panelSur.collapse();
                    _this.storeSur.removeAll();
                } else {
                    _this.documentos = _this.getGridPrincipal().getStore().reader.jsonData.documentos;
                }
            })
            _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(
                function (e) {
                    if (e == 'rowclick') {
                        if (_this.getSmPrincipal().getSelections().length > 0) {
                            _this.panelSur.expand();
                            _this.storeSur.load();
                        } else {
                            _this.panelSur.collapse();
                            _this.storeSur.removeAll();
                        }
                    }
                }
            );
            _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(
                function (e) {
                    if (e == 'rowselect') {
                        _this.panelSur.expand();
                        _this.storeSur.load();
                    }
                }
            );
            if (typeof _this.btnLote.controlFn == 'function') {
                _this.btnLote.controlFn.createDelegate(this, [_this.btnLote, this]).call();
            }
            if (typeof _this.btnNumerSerie.controlFn == 'function') {
                _this.btnNumerSerie.controlFn.createDelegate(this, [_this.btnNumerSerie, this]).call();
            }
            if (_this.btnPartida && typeof _this.btnPartida.controlFn == 'function') {
                _this.btnPartida.controlFn.createDelegate(this, [_this.btnPartida, this]).call();
            }
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNro,
            width: 120,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgNroReferencia,
            width: 120,
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgTdoc,
            width: 270,
            //dataIndex: 'iddoc',
            dataIndex: 'tipodoc',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgAno,
            width: 50,
            dataIndex: 'anno',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgfecha,
            width: 190,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 190,
            dataIndex: 'estado',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgProductos,
            width: 100,
            //dataIndex: 'cantproductos',
            dataIndex: 'cantprod',
            default: true/*,
            renderer: function(value, metaData, record, rowIndex, colIndex, store){
                if(record.json.abreviatura == 'entregaLog'){
                    return record.json.cantproductosdist;
                }
                return value;
            }*/
        });

        this.addGridColumn({
            header: this.idioma.cgUser,
            width: 100,
            dataIndex: 'idusuario',
            //dataIndex: 'creadopor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                // _this.usuarios = store.reader.jsonData.usuarios;
                var usuarios = new Array();
                usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });

        this.addGridColumn({
            header: this.idioma.cgAprobado,
            width: 100,
            dataIndex: 'aprobadopor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                //_this.usuarios = store.reader.jsonData.usuarios;
                if (record.data.idestado == 3) {
                    return _this.getUsuarioById(value);
                } else {
                    if (record.data.contabilizadopor != '' || (record.data.contabilizadopor == '' && record.data.idestado == 4)) {
                        return _this.getUsuarioById(value);
                    } else {
                        return '-';
                    }
                }

            }
        });

        this.addGridColumn({
            header: this.idioma.cgContabilizado,
            width: 100,
            dataIndex: 'aprobadopor',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                // _this.usuarios = store.reader.jsonData.usuarios;
                if (record.data.idestado == 4) {
                    if (record.data.contabilizadopor != '') {
                        return _this.getUsuarioById(record.data.contabilizadopor);
                    } else {
                        return _this.getUsuarioById(value)
                    }
                } else {
                    return '-';
                }
            }
        });

        this.addGridColumn({
            header: this.idioma.cgDeposito,
            width: 270,
            dataIndex: 'idestructuracomun',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                _this.depositos = store.reader.jsonData.depositos;

                if (record.json.abreviatura == 'entregaLog') {
                    value = record.json.idestructuracomun;
                } else {
                    if (record.json.iddeposito) {
                        value = record.json.iddeposito;
                    }
                }
                return _this.getDepositoById(value);
            }
        });

        this.addGridColumn({
            dataIndex: 'iddocumento'
        });

        this.addGridColumn({
            dataIndex: 'idestado'
        });

        this.addGridColumn({
            dataIndex: 'contabilizadopor'
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        /*this.addToolbarButton(
         LOG.util.Prototipos.botonImprimir({
         text: this.idioma.lbimprimirListado,
         isList: false,
         name: 'Auditoria listado',
         dirReport: '',
         handler: _this.onReport.createDelegate(this),
         controlFn: function (b, _caller) {
         if (_this.grantedAction('CT')) {
         b.show();
         } else {
         b.hide();
         }
         }
         }));
         this.addToolbarButton(
         LOG.util.Prototipos.botonImprimir({
         disabled: true,
         text: this.idioma.lbimprimirModelo,
         isList: false,
         name: 'Auditoria de Modelo',
         ddirReport '',
         handler: _this.onReport.createDelegate(this),
         controlFn: function (b, _caller) {
         if (_this.grantedAction('CT')) {
         b.show();
         b.disable();
         LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
         if (e == 'selectionchange') {
         if (this.getCount() == 1) {
         b.enable();
         } else {
         b.disable();
         }
         }
         }, 'imprimir');
         } else {
         b.hide();
         }
         }
         }));*/

        this.btnImprimirListado = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbimprimirListado,
            iconCls: 'imprimir',
            isList: true,
            dirReport: '/distra/logistica/inventario/auditoria/AuditoriaListado',
            handler: this.onReport.createDelegate(this)
        });

        this.btnImprimirModelo = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbimprimirModelo,
            iconCls: 'imprimir',
            isList: false,
            name: 'Auditoria de Modelo',
            dirReport: '',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                } else {
                    b.hide();
                }
            }
        });

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.lbBtnImprimir,
            text: this.idioma.lbBtnImprimir,
            iconCls: 'imprimir',
            menu: [this.btnImprimirListado, this.btnImprimirModelo]
        }));

        this.addToolbarButton("->");
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            text: '',
            tooltip: this.idioma.tBotonAyuda
        }));


    },
    getPanelSur: function () {
        var _this = this;
        this.btnLote = LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: _this.idioma.lbBtnLote,
            tooltip: _this.idioma.ttBtnLote,
            disabled: true,
            handler: function () {
                if (this.winLote == undefined) {
                    LOG.lb.lote.Loader.init(function () {
                        this.winLote = new LOG.lb.lote.View({
                            sm: _this.smGridSur,
                            iddeposito: _this.smGridSur.getSelected().json.idestructura,
                            ubicacion: true,
                            usaMonedas: true,
                            compraVenta: 2,
                            grantedAction: function (_p) {
                                return false;
                            },
                            cerrarFn: function () {

                            }
                        });
                        this.winLote.init();
                        this.winLote.view();
                    });
                } else {
                    this.winLote.view();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB') || _this.grantedAction('CT')) {
                    b.setVisible(true);
                    _this.smGridSur.fireEvent = _this.smGridSur.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (_this.getSmPrincipal().getSelected().json.abreviatura != 'transferenciareaLog' && _this.getSmPrincipal().getSelected().json.abreviatura != 'informediferenciaLog') {
                            if (_this.smGridSur.getSelections().length == 1) {
                                if (_this.smGridSur.getSelected().json.tienelote == 1)
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        });

        this.btnNumerSerie = LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: _this.idioma.lbBtnNoSerie,
            tooltip: _this.idioma.ttBtnNoSerie,
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    var winNroSerie = new LOG.lb.numeroserie.Salida({
                        idmovimiento: _this.smGridSur.getSelected().data.idmovimiento,
                        idestructura: _this.smGridSur.getSelected().json.idestructura,
                        iddeposito: (_this.getSmPrincipal().getSelected().data.iddeposito) ? _this.getSmPrincipal().getSelected().data.iddeposito : _this.getSmPrincipal().getSelected().data.idestructuracomun,
                        producto: _this.smGridSur.getSelected().data,
                        documento: _this.getSmPrincipal().getSelected().data,
                        salida: 1,
                        cerrarFn: function () {

                        }
                    });
                    winNroSerie.init();
                    winNroSerie.view();
                    winNroSerie.listaBotones.getItem(0).hide();
                    winNroSerie.listaBotones.getItem(1).hide();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB') || _this.grantedAction('CT')) {
                    b.setVisible(true);
                    _this.smGridSur.fireEvent = _this.smGridSur.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (
                            _this.getSmPrincipal().getSelected().json.abreviatura != 'inventariogLog'
                            && _this.getSmPrincipal().getSelected().json.abreviatura != 'transferenciareaLog'
                            && _this.getSmPrincipal().getSelected().json.abreviatura != 'informediferenciaLog'
                        ) {
                            if (_this.smGridSur.getSelections().length == 1) {
                                if (_this.smGridSur.getSelected().json.equipo == 1)
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        });
        var tbar = ['-', this.btnLote, this.btnNumerSerie];
        if (cmpArmamento == true) {
            this.btnPartida = LOG.util.UIManager.createBtn({
                iconCls: 'partida',
                text: _this.idioma.lbBtnMuniciones,
                tooltip: _this.idioma.ttBtnMuniciones,
                disabled: true,
                handler: function () {
                    var municiones = new LOG.inv.municiones.View({
                        idestructura: _this.smGridSur.getSelected().json.idestructura,
                        producto: _this.smGridSur.getSelected().data,
                        documento: _this.getSmPrincipal().getSelected().data,
                        salida: true,
                        fecha: fecha,
                        grantedAction: function (_p) {
                            return false;
                        },
                        cerrarFn: function () {

                        }
                    });
                    municiones.show();
                },
                controlFn: function (b, _caller) {
                    if (_this.grantedAction('RB') || _this.grantedAction('CT')) {
                        b.setVisible(true);
                        _this.smGridSur.fireEvent = _this.smGridSur.fireEvent.createSequence(function (e) {
                            b.disable();
                            if (_this.getSmPrincipal().getSelected().json.abreviatura != 'inventariogLog' && _this.getSmPrincipal().getSelected().json.abreviatura != 'informediferenciaLog') {
                                if (_this.smGridSur.getSelections().length == 1) {
                                    if (_this.smGridSur.getSelected().json.municion == 1)
                                        b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.setVisible(false);
                    }
                }
            });
            tbar = tbar.concat(this.btnPartida);
        }

        this.panelSur = LOG.util.UIManager.initPanel({
            region: 'south',
            title: _this.idioma.tMovimientos,
            border: true,
            layout: 'fit',
            collapsible: true,
            collapsed: true,
            split: true,
            tbar: tbar,
            listeners: {
                expand: function (p) {
                    p.setHeight(_this.getPanelPrincipal().getHeight() / 3);
                }
            }
        });
        this.pnGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });

        this.columnasSur = new LOG.util.List();
        this.columnasSur.add({
            dataIndex: 'idmovimiento'
        });
        this.columnasSur.add({
            dataIndex: 'idproducto'
        });
        this.columnasSur.add({
            header: _this.idioma.cmCodigo,
            dataIndex: 'codigo',
            default: true
        });
        this.columnasSur.add({
            header: _this.idioma.cmDenominacion,
            dataIndex: 'denominacion',
            width: 250,
            autoExpand: true,
            default: true
        });
        this.columnasSur.add({
            header: _this.idioma.cmCategoria,
            dataIndex: 'nomcategoria',
            default: true,
            width: 100
        });
        this.columnasSur.add({
            header: _this.idioma.cmUm,
            dataIndex: 'umedida',
            default: true,
            width: 40
        });
        this.columnasSur.add({
            header: _this.idioma.cmNacionalidad,
            dataIndex: 'nacionalidad',
            default: true,
            width: 200
        });
        this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cmCantidad,
            align: 'right',
            dataIndex: 'cantidad',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value == -1) {
                    return null;
                } else {
                    if (_this.getSmPrincipal().getSelected().json.abreviatura == 'informediferenciaLog') {
                        var cantDif = (record.json.cantidaddiferencia) ? record.json.cantidaddiferencia : 0;
                        var cantCalidad = (record.json.cantidadcalidad) ? record.json.cantidadcalidad : 0;
                        return parseFloat(cantDif) + parseFloat(cantCalidad);
                    } else {
                        return value;
                    }
                }
            }
        }));
        this.columnasSur.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmPrecio + ' ' + codigoContable,
            align: 'right',
            dataIndex: 'preciocontable',
            default: true,
            width: 100
        }));
        this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmImporte + ' ' + codigoContable,
            align: 'right',
            dataIndex: 'importe',
            default: true,
            width: 100
        }));
        if (alternativa) {
            this.columnasSur.add(LOG.util.Prototipos.columnaPrecio({
                header: _this.idioma.cmPrecio + ' ' + codigoAlternativa,
                align: 'right',
                dataIndex: 'precioalternativo',
                default: true,
                width: 100
            }));
            this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
                header: _this.idioma.cmImporte + ' ' + codigoAlternativa,
                align: 'right',
                dataIndex: 'importealternativo',
                default: true,
                width: 100
            }));
        }


        this.smGridSur = LOG.util.UIManager.initSelectionModel(3, true);

        var cls = LOG.util.UIManager.proccessColumns(this.columnasSur, this.smGridSur);
        this.cmGridSur = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridSur = Ext.data.Record.create(cls.fields);

        this.storeSur = new Ext.data.Store({
            //autoLoad: true,
            url: 'devolverMovimientos',
            reader: new Ext.data.JsonReader({
                id: "idmovimiento",
                root: "datos"
            }, this.recStGridSur),
            listeners: {}
        });

        this.storeSur.on({
            'beforeload': function () {
                _this.storeSur.baseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                _this.storeSur.initBaseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
            }
        });

        this.gpSur = LOG.util.UIManager.initGrid(this.cmGridSur, this.storeSur, this.smGridSur, {nobbar: false});

        this.pnGrid.add(this.gpSur);

        this.panelSur.add(this.pnGrid);

        return this.panelSur;
    },
    cargaInicial: function (_fn) {
        this.modelo.cargaInicial({
            url: '/logistica/utiles/documento/index.php/documentologistica/cargaInicial'
        }, _fn, this.idioma.msgCargaInicial);
    },
    view: function () {
        var _this = this;
        this.cargaInicial(function (r) {
            _this.usuarios = r[0].usuarios;
            LOG.lb.auditoriadocumento.View.superclass.view.call(_this);
        });
    },
    getUsuarioById: function (id) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].idusuario == id) {
                return this.usuarios[i].nombreusuario;
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
    getDepositoById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.depositos.length; i++) {
            if (_this.depositos[i].iddeposito == id) {
                return _this.depositos[i].deposito;
            }
        }
        return '-';
    },
    onReport: function (btn) {
        var _this = this;
        var deposito = '';
        Ext.each(_this.depositos, function (dep) {
            if (deposito == '') {
                deposito += dep.iddeposito;
            } else {
                deposito += ',' + dep.iddeposito;
            }
        });
        var depositos = (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue())
            ? '{' + _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() + '}'
            : '{' + deposito + '}'
        var has = _this.getGridPrincipal().getSelectionModel().hasSelection();

        var nrodoc = null;
        if (_this.panelBusquedaAvanzada.findByType('textfield')[0].getValue()) {
            nrodoc = _this.panelBusquedaAvanzada.findByType('textfield')[0].getValue();
        }  else if (_this.gridFilter.tfBusqueda.getValue()) {
            nrodoc = _this.gridFilter.tfBusqueda.getValue();
        }

        if (has) {
            var record = _this.getGridPrincipal().getSelectionModel().getSelected();
            this.control = new LOG.util.Report({
                reports: [
                    {
                        name: this.getTipoDocById(record.data.iddoc),
                        description: this.getTipoDocById(record.data.iddoc),
                        isList: btn.isList,
                        params: {
                            iddocumento: record.get("iddocumento") || null,
                            monedacontable: (monedacontable) ? monedacontable : null,
                            monedaalternativa: (monedaalternativa) ? monedaalternativa : null,
                            iddepositos: depositos,
                            iddeposito: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
                            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
                            nrodoc: nrodoc,
                            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
                            alias: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
                            abreviatura:record.json.abreviatura,
                            fecha: fecha
                        },
                        dirReport: (!btn.isList) ? this.getDirReport(record) : btn.dirReport
                    }
                ]
            });
            this.control.view();
        }
    },
    getDirReport: function (record) {
        var dual = '';
        if (alternativa) {
            dual = 'Dual';
        }
        if (record.json.abreviatura == 'aperturaLog') {
            return '/distra/logistica/inventario/entrada/apertura/Apertura' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'recepcionLog') {

            return '/distra/logistica/inventario/entrada/recepcion/Recepcion' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'informediferenciaLog') {

            return '/distra/logistica/inventario/entrada/diferencia/Diferencia' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'inventariogLog') {

            return '/distra/logistica/inventario/movimiento/hojainventario/HojaInventarioExModelo';

        } else if (record.json.abreviatura == 'valedev') {

            return '/distra/logistica/inventario/entrada/devolucion/ValeDevolucion' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'valeLog') {

            return '/distra/logistica/inventario/salida/salida/ValeEntrega' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'solEntrega') {

            return '/distra/logistica/inventario/salida/entrega/SolicitudEntrega' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'entregaLog') {

            return '/distra/logistica/distribucion/distribucion/DistribucionModelo';

        } else if (record.json.abreviatura == 'ajusteLog') {

            return '/distra/logistica/inventario/movimiento/ajuste/Ajuste' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'facturaLog') {

            return '/distra/logistica/facturacion/facturacion/Facturacion' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'conduceLog') {

            return '/distra/logistica/facturacion/facturacion/Facturacion' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'transferenciareaLog') {

            return '/distra/logistica/inventario/movimiento/transferencia/TransferenciaEntreAreas' + dual + 'Modelo';

        } else if (record.json.abreviatura == 'transferenciaLog') {
            var modelo = 'Transferencia' + (record.json.tipocliente == 1 ? 'Clientes' : 'Almacenes') + dual + 'Modelo'
            return '/distra/logistica/inventario/salida/salida/' + modelo;

        }else if (record.json.abreviatura == 'conciliacionLog') {
            return '/distra/logistica/inventario/salida/conciliacion/ConciliacionModelo';

        }
        return '/distra/logistica/inventario/auditoria/AuditoriaModelo';
    }
});
