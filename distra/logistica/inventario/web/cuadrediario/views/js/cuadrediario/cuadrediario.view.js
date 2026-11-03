Ext.apply(Ext.form.VTypes, {
    validarRangoFecha : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        return true;
    }
});


Ext.ns('LOG.inv.cuadrediario');

/**
 * Plantilla tipo ViewPort para gestion de transferencia entre areas.
 * @type LOG.util.UITemplate
 */
LOG.inv.cuadrediario.View = Ext.extend(LOG.lb.documento.View, {
    name: 'cuadrediario',
    cantSign: 3,
    winMod: false,
    signDetails: {
        1: 'Elaborado',
        2: 'Aprobado',
        3: 'Contabilizado'
    },
    dirReport: '/logistica/inventario/cuadrediario/',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        config.urlBusquedaGridPrincipal = 'cargarCuadresRealizados';
        config.modoSeleccion = 1;
        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        config.model = new LOG.inv.cuadrediario.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.concepto;
        LOG.inv.cuadrediario.View.superclass.constructor.call(this, config);
        this.winGestionarDocumento = new LOG.inv.cuadrediario.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            maximized: true,
            title: this.idioma.tlAdicionar,
            width: 750,
            acciones:this.acciones
        });
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        var _this = this;
        LOG.inv.cuadrediario.View.superclass.init.call(this);
       // this.initPanelSuperior();
        //this.initPanelInferior();
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function () {
                var _self = _this.winGestionarDocumento;
                _self.modelo.salvar({/*idestructuracomun: _this.idDeposito*/}, function (r) {
                    /* if (_self.modelo.listaProductos.count()) {
                        _self.cargarProductos();
                    } */
                    _self.tipoVentana = 2;
                    if (_self.record == null) {
                        _self.record = {};
                        Ext.apply(_self.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1",
                                cantproductos: r.cantproductos
                            }
                        });
                    }
                    _this.habilitarElementos();
                    _self.getTitleDocumento(r.iddocumento);
                    _self.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _self);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_self, [b, _self]).call();
                        }
                    }, _self);
                });
            },
            beforeEditProducto: function (o) {
                o.cancel = true;
            },
            beforeLoadProductos: function () {
               /*  _this.winGestionarDocumento.stGridDetalles.baseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.winGestionarDocumento.stGridDetalles.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.winGestionarDocumento.stGridDetalles.baseParams.idarea = (_this.modelo.idareaorigen) ? _this.modelo.idareaorigen : -1;
                _this.winGestionarDocumento.stGridDetalles.initBaseParams.idarea = (_this.modelo.idareaorigen) ? _this.modelo.idareaorigen : -1;
                 */
            },
            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!_this.winGestionarDocumento.record
                    || (nuevo && _this.winGestionarDocumento.record.data.estado != '3')
                    || (!nuevo && _this.winGestionarDocumento.record.data.estado == '1')
                    )
                ) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
    },
    initVentanaGestion: function (d, tipoVentana, noCargar) {
        this.winMod = false;
        if (!this.winGestionarDocumento.isInit()) {
            this.winGestionarDocumento.init();
            if (this.winGestionarDocumento.formularioGeneral != null) {
                this.winGestionarDocumento.addPanelSuperior(this.winGestionarDocumento.formularioGeneral);
            }
            if (this.formularioSur != null) {
                this.winGestionarDocumento.addPanel(this.formularioSur);
            }
            if (this.formularioEste != null) {
                this.winGestionarDocumento.addPanel(this.formularioEste);
            }
            if (this.formularioOeste != null) {
                this.winGestionarDocumento.addPanel(this.formularioOeste);
            }
        }
        this.winGestionarDocumento.tipoVentana = tipoVentana || 1;
        
        if (d) {
            this.winMod = true;
            this.winGestionarDocumento.prepareDocModify(d, noCargar);
        } else {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
            this.winGestionarDocumento.fromularioGestion.getForm().loadRecord({data: {}});
            //this.winGestionarDocumento.gridProductosG.idtarjetamedicamento = undefined;
        }
        this.winGestionarDocumento.show();
        this.winGestionarDocumento.maximize();
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        var _this = this;
        LOG.inv.cuadrediario.View.superclass.initDefaultButtons.call(this);
        // Bloque de botones de la interfaz principal.
        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(0).handler.createSequence(function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });
        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function () {
            _this.habilitarElementos();
        });

        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                _this.modelo.eliminarCierreDiario({idcierrediario: 
                    _this.getSmPrincipal().getSelections()[0].data.idcierrediario}, function () {
                        _this.gpPrincipal.store.load();
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelections()[0].data.estado == 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminar');
                } else {
                    b.setVisible(false);
                }
            }
        });

        


        LOG.util.UIManager.apply(this.listaBotones.getItem(3), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        this.winGestionarDocumento.onResetHandler = this.winGestionarDocumento.onResetHandler.createSequence(function (e) {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });


        this.listaBotones.getItem(9).id = 'idcierrediario';

        // Fin del bloque de botones.


        // Bloque de botones del panel superior de la interfaz de adicionar.
        /* LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminar,
            disabled: true,
            handler: function () {
                _this.modelo.eliminar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }); */

        /* LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        //var btnProducto = ;
        this.insertToolbarButtonProductos(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnProducto,
            tooltip: this.idioma.ttBtnProducto,
            iconCls: 'producto',
            disabled: true,
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1')) &&
                    _this.modelo.basicForm && _this.modelo.basicForm.isValid()) {
                    return false;
                }
                return true;
            },
            handler: function () {
                var _p = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        idarea: _this.modelo.idareaorigen || _this.winGestionarDocumento.cbAreaOrigen.getValue(),
                        iddocumento: _this.modelo.iddocumento || -1,
                        tipoproducto: "[1, 4]"
                    }
                });
                _p.postSalvar = _p.postSalvar.createSequence(function (r) {
                    _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                    _p.getStorePrincipal().initBaseParams.iddocumento = _this.modelo.iddocumento;
                    _p.reiniciarBusqueda();
                    _this.habilitarElementos();
                });
                _p.init();

                var vistaProductos = _p.view();
                _p.tipoProducto.disable();
                vistaProductos.show();
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }), 0); */
        //this.modelo.addActionButton(btnProducto, true);

        /*LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(1), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0 && (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1')) {
                                    b.enable();
                                } else {
                                    b.disable();
                                    _this.formularioSur.collapse();
                                }
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }); */
        // Fin del bloque de botones.
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        //LOG.inv.cuadrediario.View.superclass.initDefaultColumns.call(this);
        this.addGridColumn({
            header: this.idioma.lbDep,
            width: 350,
            dataIndex: 'deposito',
            default: true
        });

        /* this.addGridColumn({
            header: this.idioma.lbDfFecha,
            width: 90,
            align: 'center',
            dataIndex: 'fecha',
            default: true
        }); */

        this.addGridColumn({
            header: this.idioma.lbEstado,
            width: 90,
            dataIndex: 'estado',
            align: 'center',
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cerrado.png" height=16 width=16 /></center>';
                } else if(value == 2){
                    return '<center><img src="/lib/ExtJS/temas/default/images/iconos/bloqueado.png" height=16 width=16 /></center>';
                }else {
                    return '<center><img src="/lib/ExtJS/temas/default/images/iconos/abierto.png" height=16 width=16 /></center>';
                }
            }
        });

        this.addGridColumn({
            header: 'Fecha cierre',
            width: 90,
            align: 'center',
            dataIndex: 'fechacierre',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbSaldoIni,
            width: 110,
            align: 'right',
            dataIndex: 'importeinicial',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });

        this.addGridColumn({
            header: this.idioma.lbSaldoFin,
            width: 110,
            align: 'right',
            dataIndex: 'importefinal',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });

        this.addGridColumn({
            header: this.idioma.lbSaldoCont,
            width: 110,
            align: 'right',
            dataIndex: 'saldocont',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        }); 

        this.addGridColumn({
            header: this.idioma.lbDifSaldo,
            width: 110,
            align: 'right',
            dataIndex: 'diferencia',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        }); 

        this.addGridColumn({
            header: this.idioma.lbEsApertura,
            width: 110,
            align: 'center',
            dataIndex: 'apertura',
            default: true,
            renderer: function (value, metaData) {
                metaData.css = (value == 1) ? 'icondistra-aceptar verde' : 'icondistra-cerrar rojo';
                metaData.attr = (value == 1) ? 'ext:qtip="Si"' : 'ext:qtip="No"';
            }
        }); 
        this.addGridColumn({dataIndex: 'idcierrediario'});
        this.addGridColumn({dataIndex: 'fechaactual'});
        this.addGridColumn({dataIndex: 'proxfecha'});
        this.addGridColumn({dataIndex: 'iddeposito'});
    },
    /**
     * Programa los eventos y devuelve la vista principal.
     * @returns {vistaPrincipal}
     */
    render: function () {
        var _this = this;
        this.getPanelBusqueda().setColumns(1);

        var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

    //Elementos de la busqueda avanzada

        this.cbDeposito =  new LOG.util.SelectorTF({
            fieldLabel :_this.idioma.lbDep,
            title :_this.idioma.lbcbDeposito,
            emptyText: _this.idioma.lbSeleccione,
            url: 'cargarDepositosCerrados',
            controller : '/logistica/inventario/cuadrediario/index.php/cuadrediario',
            valueField : 'iddeposito',
            displayField : 'almacen',
            hiddenName : 'iddeposito',
            //autoLoad: true,
            anchor:'80%',
            columns : [
                {
                    header : _this.idioma.lbDep,
                    dataIndex : 'almacen',
                    width : 280,
                    autoExpand : true
                },{
                    dataIndex : 'iddeposito'
                }
            ],
            listeners: {
            }
        });
        
        this.cmbEstado = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbEstado,
            hiddenName: 'estado',
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [0, "S/D"],
                    [1, "Abierto"],
                    [2, "Cerrado"],
                    [3, "Bloqueado"]
                ]
            }),
            valueField: 'idestado',
            displayField: 'estado',
            editable: true
        });
        
        this.cmbDiferencia = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCriterio,
            hiddenName: 'criterio',
            store: new Ext.data.SimpleStore({
                fields: ['idcriterio', 'criterio'],
                data: [
                    ['=', "Saldo contable = Saldo final"],
                    ['>', "Saldo contable > Saldo final"],
                    ['<', "Saldo contable < Saldo final"]
                ]
            }),
            valueField: 'idcriterio',
            displayField: 'criterio',
            editable: true
        });

        fpDatosBusqueda.addComponent(this.cmbEstado);
        fpDatosBusqueda.addComponent(this.cbDeposito);
        fpDatosBusqueda.addComponent(this.cmbDiferencia);

        /* fpDatosBusqueda.addComponent(this.cmbUsuarioCreadoPor = new LOG.lb.documento.ComboUsuarios({
            fieldLabel: _this.idioma.lbCreadoPor,
            hiddenName: 'creadopor',
            alias: 'transferenciaLog',
            subsistema: 10
        }));

        fpDatosBusqueda.addComponent(this.cmbUsuarioAprobadoPor = new LOG.lb.documento.ComboUsuarios({
            fieldLabel: _this.idioma.lbAprobadoPor,
            hiddenName: 'aprobadopor',
            alias: 'transferenciaLog',
            subsistema: 10
        })); */

        var fpFechas = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.dfFechaInicio = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDesde,
            name: 'desde',
            vtype: 'daterange',
            id: 'desde',
            endDateField: 'hasta',
            editable: false
        });
        this.dfFechaFin =  new Ext.form.DateField({
            fieldLabel: _this.idioma.lbHasta,
            name: 'hasta',
            vtype: 'daterange',
            id: 'hasta',
            startDateField: 'desde',
            editable: false
        });

        fpFechas.addComponent(this.dfFechaInicio);
        fpFechas.addComponent(this.dfFechaFin);

        _this.addFilterComponent(fpDatosBusqueda);
        _this.addFilterComponent(new Ext.form.FieldSet({
            title: _this.idioma.tlRangoFecha,
            items: [fpFechas]
        }));
        var render = LOG.inv.cuadrediario.View.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().load();
        return render;
    },
    /**
     * Resetea los datos de entrada de transferencia de movimientos.
     * @param {String} nombre
     * @param {Bollean} seleccionado
     * @returns {undefined}
     */
    resetearDatos: function (nombre, seleccionado) {
        Ext.each(this[nombre].find('campo', true), function (item) {
            item.reset();
            item.setDisabled(!seleccionado);
        });
        Ext.each(this[nombre].getBottomToolbar().find('btn', true), function (b) {
            b.disable();
        });
    },
    /**
     * Habilita o deshabilita los botones.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            if (!this.record || this.record.data.estado == '1') {
                if (item.obs) {
                    item.enable();
                } else {
                    item.setDisabled(this.record && parseInt(this.record.data.cantproductos) > 0);
                }
            } else {
                item.disable();
            }
        }, this.winGestionarDocumento);
    },
    /**
     *
     * @returns {undefined}
     */
    /* handlerEliminarMov: function () {
        var _scope = this;
        var _parent = this.scope;
        var idmovimientos = new Array();
        Ext.each(_scope.smGridDetalles.getSelections(), function (rec) {
            idmovimientos.push(rec.id);
        });
        _scope.modelo.eliminarMovimientos(idmovimientos, function (r) {
            Ext.apply(_scope.record.data, {cantproductos: r.cantproductos});
            _scope.stGridDetalles.reload();
            _parent.habilitarElementos();
        });
    }, */
    /**
     * Carga los datos para realizar las transferencias.
     * @param {Object} datos
     * @returns {undefined}
     */
    /* cargarDatosUbicacion: function (datos, origen, ambos) {
        var elementos = document.getElementsByTagName('lb');
        for (var i = 0; i < elementos.length; i++) {
            if (origen || ambos) {
                if (elementos[i].getAttribute('class') == 'existenciaorigen') {
                    elementos[i].innerHTML = parseFloat(datos.cantidad) || '-';
                }
                if (elementos[i].getAttribute('class') == 'disponibleorigen') {
                    elementos[i].innerHTML = parseFloat(datos.disponible) || '-';
                }
            }
            if (!origen || ambos) {
                if (elementos[i].getAttribute('class') == 'existenciadestino') {
                    elementos[i].innerHTML = parseFloat(datos.cantidad) || '-';
                }
                if (elementos[i].getAttribute('class') == 'disponibledestino') {
                    elementos[i].innerHTML = parseFloat(datos.disponible) || '-';
                }
            }
        }
    }, */
    /**
     * Genera el reporte de especificado de la transferencia entre areas.
     * @param {type} btn
     * @returns {undefined}
     */
    /*getParamsReport:function (record, btn) {
      //  console.info(record.data);
      //  console.info(this.getStorePrincipal().baseParams);
        return btn.isList ? {
        idestado: this.cmbEstado.getValue() || null,
        //tipotransferencia: this.cmbTipoTranferencia.getValue() || null,
        areaorigen: this.cmbAreaOrigen.getValue() || null,
        areadestino: this.cmbAreaDestino.getValue() || null,
        fechainicio: this.dfFechaInicio.getValue() ? this.dfFechaInicio.getValue().format('d/m/Y') : null,
        fechafin: this.dfFechaFin.getValue() ? this.dfFechaFin.getValue().format('d/m/Y') : null,
        creadopor: this.cmbUsuarioCreadoPor.getValue() || null,
        aprobadopor: this.cmbUsuarioAprobadoPor.getValue() || null
        } : {
            iddocumento: record.get("iddocumento")
        };
    }*/
});
