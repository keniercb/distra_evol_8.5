Ext.ns('LOG.lb.comprobante');
LOG.lb.comprobante.View = Ext.extend(LOG.util.UITemplate, {
    /**
     *
     * @type type
     */
    usuarios: undefined,
    /**
     *
     */
    modoSeleccion : comprobantesMultiples == true ? 3:1,
    /**
     * Tipo de documento.
     */
    tipoDoc: undefined,
    busquedaAvanzada: true,
    btnGenerar : null,
    subsistema: null,
    /**
     * @param {object} config
     * @returns {undefined}
     */

    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.lb.comprobante.Idioma, LOG.util.Idioma);
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.autoSelect = false;
        this.concepto = "documento";
        this.urlBusquedaGridPrincipal = 'cargarDocumentosContabilizados';
        this.modelo = new LOG.lb.comprobante.Model({
            idioma: config.idioma
        });
        this.idayuda = config.idayuda || '';
        LOG.lb.comprobante.View.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        LOG.lb.producto.View.superclass.init.call(this);
        if (_this.busquedaAvanzada) {
            this.getPanelBusqueda().setColumns(1);
            var comboDeposito = new LOG.util.ComboBox({
                url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos',
                hiddenName: 'idestructura',
                autoLoad: false,
                valueField: 'id',
                displayField: 'text',
                fieldLabel: 'Depositos'
            });
            comboDeposito.store.baseParams.idtipo = -1;
            comboDeposito.store.load();


            var cmbTipoDocumento = new LOG.util.ComboBox({
                fieldLabel: 'Tipo de documento',
                editable: false,
                url: 'obtenerTipoDocumento',
                hiddenName: 'iddoc',
                valueField: 'iddoc',
                displayField: 'denominacion'
            });

            var frmDepTipDoc = new LOG.util.ColumnForm(2);
            frmDepTipDoc.addComponent(comboDeposito);
            frmDepTipDoc.addComponent(cmbTipoDocumento);
            this.addFilterComponent(frmDepTipDoc);
            var cmbEstado = new LOG.util.ComboBox({
                fieldLabel: 'Estado',
                hiddenName: 'estado',
                valueField: 'idestado',
                displayField: 'estado',
                editable: false,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idestado', 'estado'],
                    data: [
                        [4, LOG.lb.documento.Estado[4]],
                        [7, LOG.lb.documento.Estado[7]]
                    ]
                })
            });
            var frmEstado = new LOG.util.ColumnForm(2);
            frmEstado.addComponent(cmbEstado);
            frmEstado.getColumn(0).columnWidth = 1;
            frmEstado.getColumn(0).getComponent(0).anchor = '99%';
            this.addFilterComponent(frmEstado);
            var desde = new Ext.form.DateField({
                fieldLabel: 'Desde',
                name: 'desde',
                vtype: 'daterange',
                id: 'desde',
                endDateField: 'hasta'
            });
            var hasta = new Ext.form.DateField({
                fieldLabel: 'Hasta',
                name: 'hasta',
                vtype: 'daterange',
                id: 'hasta',
                startDateField: 'desde'
            });
            var frmFecha = new LOG.util.ColumnForm(2);
            var frmFechaRango = new LOG.util.ColumnForm(2);
            frmFechaRango.addComponent(desde);
            frmFechaRango.addComponent(hasta);
            frmFecha.addComponent(new Ext.form.FieldSet({
                title: 'Rango de fecha',
                anchor: '100%',
                items: [frmFechaRango]
            }));
            frmFecha.getColumn(0).columnWidth = 1;
            frmFecha.getColumn(0).getComponent(0).anchor = '99%';
            this.addFilterComponent(frmFecha);
        }
    },
    generarComprobante: function (anticipos) {
            var _this = this;
            let selections = _this.getSmPrincipal().getSelections();
            let iddeposito = (selections[0].data.idestructuracomun) ? selections[0].data.idestructuracomun : selections[0].json.iddeposito;
        Ext.getBody().mask('Generando comprobante de operaciones.');
        _this.modelo.contabilizar({
            idestructuracomun: iddeposito,
            anticipos: (anticipos)?Ext.encode(anticipos):null
        }, function (o, s, r) {
            Ext.getBody().unmask();
            var rData = Ext.decode(r.responseText);
            var comprobante = rData.comprobante;
            Ext.Cont.Comprobante.init(comprobante.idsubsistema, comprobante.detalle,
                comprobante.descripcion, comprobante.fechaContable, comprobante.dataComprobante, 
                comprobante.idtipocomprobante, 1, 1, undefined, undefined, undefined, 
                undefined, undefined, undefined, iddeposito)
                .onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                    if (idComprobante) {
                        _this.modelo.actualizarDocumentos(idComprobante, numComprobante, fechaComprobante,r.documentosContabilizados,anticipos);
                    }
                }).onClose(function () {

            }).onShow(function () {
                Ext.getBody().unmask();
            });
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(_this.btnGenerar = LOG.util.UIManager.createBtn({
            text: this.idioma.lbPostear,
            tooltip: this.idioma.ttPostear,
            iconCls: 'liquidar',
            handler: function () {

                if (
                    (typeof cobropagoanticipo === 'undefined' || cobropagoanticipo == false) ||
                    (_this.subsistema != LOG.util.Subsistemas.facturacion && _this.subsistema != LOG.util.Subsistemas.inventario)
                ) {
                    _this.generarComprobante();
                } else {
                    Ext.getBody().mask('Generando comprobante de operaciones.');
                    Ext.Ajax.request({
                        url: '/logistica/utiles/comprobante/index.php/comprobante/' + 'cargarAnticiposCliente',
                        method: 'post',
                        params: {
                            iddocumento: Ext.encode(_this.modelo.getSelectedId())
                        },
                        success: function(rp) {
                            Ext.getBody().unmask();
                            var values = Ext.decode(rp.responseText);
                            if (values.datos.length > 0) {
                                var ventanaAnticipo = new LOG.lb.comprobante.anticipos({
                                    //idclientesproveedores: Ext.encode(idclientes),
                                    idioma: _this.idioma,
                                    importeTotal: values.importeTotal,
                                    gpParent: _this,
                                    urlBusquedaGridPrincipal: 'cargarAnticiposCliente',
                                    anticipos: values.datos
                                });
                                ventanaAnticipo.init();
                                ventanaAnticipo.getVistaPrincipal().title = 'Anticipos';
                                ventanaAnticipo.getPanelSuperior().onRender = ventanaAnticipo.getPanelSuperior().onRender.createSequence(function () {
                                    ventanaAnticipo.getPanelSuperior().add(ventanaAnticipo.createPanelImporte());
                                    ventanaAnticipo.getPanelSuperior().doLayout();
                                });
                                ventanaAnticipo.getPanelSuperior().setVisible(true);
                                ventanaAnticipo.view();
                                var btnAceptar = ventanaAnticipo.getVistaPrincipal().listaBotones.getItem(2);
                                btnAceptar.handler = ventanaAnticipo.getVistaPrincipal().listaBotones.getItem(2).handler.createSequence(function (e) {
                                    var liquidAnticipo = [];
                                    var suma = 0;
                                    var genera = true;
                                    Ext.each(ventanaAnticipo.getStorePrincipal().data.items, function(ant) {
                                        if (ant.data.importe > 0) {
                                            liquidAnticipo.push(ant.data);
                                            suma += ant.data.importe;
                                            if (ant.data.importe > ant.data.pendiente) {
                                                genera = false;
                                            }
                                        }
                                    });
                                    if (suma <= values.importeTotal && genera) {
                                        _this.generarComprobante(liquidAnticipo);
                                    } else {
                                        mostrarMensaje(3, 'El importe excede el total del documento');
                                    }
                                });
                            } else {
                                _this.generarComprobante();
                            }
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                        }
                    }
                });
                _caller.onGridDobleClick = function () {
                    b.handler(b)
                }
            }
        }));
		
		this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Anular comprobante',
            tooltip: 'Anular el comprobante para la operaci\xf3n seleccionada',
            iconCls: 'cancelar',
            handler: function () {
                mostrarMensaje(2,"¿Est&aacute; seguro que desea anular el comprobante seleccionado?", function(btn){
                    if(btn == 'ok'){
                        Ext.getBody().mask('Anular comprobante de operaciones');
                        _this.modelo.anular({
                            idestructuracomun: _this.idDeposito
                        }, function (o, s, r) {
                            Ext.getBody().unmask();
                        });
                    }
                });
                
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RAnularCO')) {
                    b.show();
                } else {
                    b.hide();
                }
                b.disable();
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        b.disable();
                        if (this.hasSelection()) {
                            b.enable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: LOG.util.Idioma.lbBtnAyuda,
            tooltip: LOG.util.Idioma.ttBtnAyuda,
            iconCls: 'ayuda',
            id: this.idayuda
        }));

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });

        this.addGridColumn({
            dataIndex: 'idestructuracomun'
        });

        this.addGridColumn({
            header: this.idioma.cgNroDocumento,
            width: 90,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreacion,
            width: 100,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipoDoc,
            width: 150,
            dataIndex: 'iddoc',
            default: true,
            renderer: function (_value) {
                return _this.getNombreDoc(_value);
            }
        });


        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 70,
            dataIndex: 'estado',
            default: true,
            renderer: function (_value) {
                return _value == 7 ? LOG.lb.documento.Estado[LOG.lb.documento.Estado.CANCEL] : (_value == 3) ? LOG.lb.documento.Estado[LOG.lb.documento.Estado.APROB] : LOG.lb.documento.Estado[LOG.lb.documento.Estado.CONT];
            }
        });

        this.addGridColumn({
            header: this.idioma.cgPD,
            width: 230,
            dataIndex: 'cliente',
            default: true,
            autoExpand: true,
        });

        this.addGridColumn({
            header: this.idioma.cgOperacion,
            width: 350,
            dataIndex: 'operacion',
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte + ' ' + codigoContable,
            width: 110,
            align: 'right',
            dataIndex: 'importetotal',
            default: true
        }));

        if (alternativa) {
            this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                header: this.idioma.cgImporte + ' ' + codigoAlternativa,
                width: 110,
                align: 'right',
                dataIndex: 'importetotalalt',
                default: true
            }));
        }

        this.addGridColumn({
            header: this.idioma.cgDeposito,
            width: 190,
            align: 'right',
            dataIndex: 'deposito',
            default: true,
        });

        this.addGridColumn({
            header: this.idioma.cgCreadoPor,
            width: 90,
            dataIndex: 'idusuario',
            default: true,
            renderer: function (v) {
                return _this.getUsuarioById(v);
            }
        });
    },
    cargaInicial: function (_fn) {
        this.modelo.cargaInicial({
            url: '/logistica/utiles/documento/index.php/documentologistica/cargaInicial',
            cargando: this.idioma.msgCargaInicial
        }, _fn);
    },
    view: function () {
        var _this = this;
        this.cargaInicial(function (r) {

            _this.usuarios = r[0].usuarios;
            _this.tipoDoc = r[0].iddocs;
            LOG.lb.comprobante.View.superclass.view.call(_this);
        });
    },
    /**
     *
     * @param {type} id
     * @returns {Anonym$0@arr;usuarios@pro;nombreusuario|String}
     */
    getUsuarioById: function (id) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].idusuario == id) {
                return this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    getNombreDoc: function (_value) {

        for (var i = 0; i < this.tipoDoc.length; i++) {
            if (this.tipoDoc[i].iddoc == _value) {
                return this.tipoDoc[i].denominacion;
            }
        }
        return '-';
    },
    render: function () {
        var render = LOG.lb.comprobante.View.superclass.render.call(this);
        var _this = this;

        this.getStorePrincipal().on({
            load: function () {
                if (typeof _this.colorFilaFn == 'function') {
                    this.each(function (d, index) {
                        var css = _this.colorFilaFn.createDelegate(this, [d]).call();
                        Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass(css);
                    });
                }
            }
        });
        this.getStorePrincipal().load();
        return render;
    },
    colorFilaFn: function (d) {
        return d.data.estado == 7 ? 'redrow-text' : '';
    }
});

LOG.lb.comprobante.anticipos = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.autoLoad = false;
        //this.dirController = '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        config.bbarVisible = false;
        this.gpParent = config.gpParent;
        this.gridEditable = true;
        this.anticipos = config.anticipos;
        this.importeTotal = config.importeTotal;
        config = Ext.apply(_this, config);
        LOG.lb.comprobante.anticipos.superclass.constructor.call(this, config);



    },
    createPanelImporte: function() {
        var _this = this;
        this.lbEfectivoinicio = new Ext.form.Label({
            text: 'Importe: ',
            style: 'color:green;padding-right: 2px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        _this.lbEfectivoinicio.setText('Importe: ' + Ext.util.Format.number(_this.importeTotal, '0,000.00'));
        return {
            border: false,
            tbar: ['-','->',_this.lbEfectivoinicio]

        };
    },
    init: function () {
        var _this = this;
        LOG.lb.comprobante.anticipos.superclass.init.call(this);
        _this.getVistaPrincipal().width = 530;
        _this.getVistaPrincipal().height = 350;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).enable();


    },
    aceptarFn: function(){
        console.info('aceptar');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idanticipo'
        });
        this.addGridColumn({
            dataIndex: 'idcuenta'
        });
        this.addGridColumn({
            header: 'N\xfamero',
            width: 100,
            dataIndex: 'numerodocumento',
            default: true
        });
        this.addGridColumn({
            header: 'Fecha',
            width: 80,
            dataIndex: 'fechacreacion',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Importe pendiente',
            width: 150,
            dataIndex: 'pendiente',
            default: true,
            align: 'right'
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Importe',
            width: 100,
            dataIndex: 'importe',
            default: true,
            align: 'right',
            editor: new LOG.util.Prototipos.inputDecimal({
                allowBlank: false,
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
    },
    render: function () {
        var _this = this;
        var p = LOG.lb.comprobante.anticipos.superclass.render.call(this);
        this.anticipoRecord = Ext.data.Record.create([
            {name: 'idanticipo'},
            {name: 'idcuenta'},
            {name: 'numerodocumento'},
            {name: 'fechacreacion'},
            {name: 'pendiente'},
            {name: 'importe'}
        ]);

        Ext.each(_this.anticipos, function(antAux) {
            antAux.importe = 0;
            var ant = new _this.anticipoRecord(antAux);
            _this.getStorePrincipal().add(ant);
        });
        _this.getGridPrincipal().on({
            'afteredit': function (st) {
                var habilitar = true;
                var importeResta = 0;
                Ext.each(_this.getStorePrincipal().data.items, function(ant) {
                    importeResta += (!isNaN(ant.data.importe) ? ant.data.importe : 0);
                    if (ant.data.importe > ant.data.pendiente) {
                        habilitar = false;
                    }
                });
                if (importeResta <= _this.importeTotal) {
                    _this.lbEfectivoinicio.setText('Importe: ' + Ext.util.Format.number(_this.importeTotal - importeResta, '0,000.00'));
                    if (habilitar) {
                        _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                    } else {
                        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                    }
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }

            }
        });
        return p;
    }
});