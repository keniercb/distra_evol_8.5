Ext.ns('Ext.erp.balancecontable');
Ext.erp.balancecontable = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/balancecontable';
        config.urlBusquedaGridPrincipal = 'cargarDatosPrincipales';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        config.idioma = {};

        Ext.erp.balancecontable.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.balancecontable.Idioma);
        _this.concepto = '';
        _this.textBusquedaSimple = ''/*this.idioma.txtBusquedaSimple*/;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgCuenta,
            width: 250,
            dataIndex: 'concatctax',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValotContable,
            width: 120,
            dataIndex: 'saldo',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValorInventario,
            align: 'right',
            width: 120,
            dataIndex: 'valorinv',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Diferencia',
            align: 'right',
            width: 120,
            dataIndex: 'diff',
            default: true
        }));
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function() {
                _this.getReportes(_this);
            },
            controlFn: function(b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function(e) {
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

        this.addToolbarButton(new LOG.util.Prototipos.botonGeneral({
            text: 'Movimientos por clasificaci\xf3n',
            handler: function() {
                var frmBusqueda = new LOG.util.ColumnForm({
                    columnas: 3,
                    region: 'center',
                    frame: true
                });

                frmBusqueda.addComponent(new Ext.erp.comboNomenclador({
                    controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                    modelo: 'NomClasificacioncontablelog',
                    idnom: 'idclasificacioncontable',
                    name: 'denominacion',
                    autoCargar: true,
                    allowBlank: false,
                    fieldLabel: 'Clasificacion contable'
                }));
                frmBusqueda.addComponent(new Ext.form.DateField({
                    fieldLabel: 'Desde',
                    format: 'd/m/Y',
                    width: 150,
                    name: 'fechaini',
                    editable: false,
                    allowBlank: false,
                    maxValue: new Date(),
                }));
                frmBusqueda.addComponent(new Ext.form.DateField({
                    fieldLabel: 'Hasta',
                    format: 'd/m/Y',
                    width: 150,
                    name: 'fechafin',
                    editable: false,
                    allowBlank: false,
                    maxValue: new Date(),
                }));
                var formularioBusqueda = LOG.util.UIManager.initForm({
                    items: [frmBusqueda],
                    layout: 'border',
                    border: false,
                    region: 'center'
                });
                var win = new LOG.util.Window({
                    usarAplicar: false,
                    cerrarAceptar: true,
                    height: 150,
                    width: 450,
                    resizable: false,
                    autoValidate: true,
                    title: 'Filtros',
                    aceptarFn: function() {
                        var params = formularioBusqueda.getForm().getValues();
                        params.idestructura = idEntidad;
                        var tipoReportes = new LOG.util.Report({
                            reports: [{
                                    dirReport: '/distra/logistica/inventario/recuperaciones/MovimientosCuentaModelo',
                                    name: 'MovimientosCuentaModelo',
                                    isList: true,
                                    params: params
                                }]
                        });
                        tipoReportes.view();
                    },
                    items: [formularioBusqueda]

                });
                win.show();
            }
        }));
        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: 'Guardar balance contable',
            handler: this.guardarBalance,
            scope: this,
            disabled: true,
            controlFn: function(b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function(e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        });
        this.btonHistorialBalance = LOG.util.UIManager.createBtn({
            iconCls: 'estado',
            text: 'Historial de balance contable',
            tooltip:'Historial de balance contable',
            isContextual: true,
            handler: function () {
                var winHistorialBalance = new Ext.erp.balancecontable.winHistorialBalance({
                    _parent: _this,
                    idioma: _this.idioma
                });
                winHistorialBalance.init();
                _this.vistawinHistorialBalance = winHistorialBalance.view();
                _this.vistawinHistorialBalance.show();
            }
        });

        this.addToolbarButton(this.btnSalvar);
        this.addToolbarButton( this.btonHistorialBalance);
        /*this.comboDepositos = new LOG.util.LovCombo({
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
         this.addToolbarButton(this.comboDepositos);*/
        this.dfFecha = new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfFecha,
            format: 'm/d/Y',
            width: 150,
            name: 'fechadocorigen',
            editable: false,
            maxValue: new Date(),
        });

         this.dfFecha.on({
             'select' : function(_df){
                 _this.storePrincipal.reload({
                     params: {
                         fecha: _this.dfFecha.getValue().format('d/m/Y')
                     }
                 });
             }
         });
        this.addToolbarButton("->");
        this.addToolbarButton("Fecha de cierre");
        this.addToolbarButton("-");
        this.addToolbarButton(this.dfFecha);
        /*this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonBuscar({
            handler: function() {
                _this.storePrincipal.reload({
                    params: {
                        fecha: _this.dfFecha.getValue().format('d/m/Y')
                    }
                });
            }
        }));*/
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idbalancecontable'}));


    },
    render: function(config) {
        var render = Ext.erp.balancecontable.superclass.render.call(this, config);
        var _this = this;
          _this.onLoadMask('Cargando...');

          this.getStorePrincipal().on({
      
            load:function(st,obj){
                 _this.onUnMask();
              
            }
          
        });

        return render;

    },
    onLoadMask: function(msg) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msg});
        myMask.show();
    },
    onUnMask: function() {
       var myMask = new Ext.LoadMask(Ext.getBody());
       myMask.hide();
    },
    getReportes: function(data) {
        var _this = this;

        var tipoReportes = new LOG.util.Report({
            reports: [{
                    dirReport: '/distra/logistica/inventario/recuperaciones/BalanceContableModelo',
                    name: 'BalanceContableModelo',
                    isList: true,
                    params: {
                        idestructura: idEntidad,
                        fechafin: ((_this.dfFecha.getValue()) ? _this.dfFecha.getValue().format('d/m/Y') : null)
                    }
                }]
        });
        tipoReportes.view();
    },
    guardarBalance: function (params) {
        var _this = this;
        _this.arrayCuentas = new Array();
        var selecciones = _this.scope.getGridPrincipal().getStore().data.items;
        Ext.MessageBox.wait('Guardando datos', 'Por favor espere...' || '...');
       
        if (selecciones.length > 0 ) {
        Ext.each(selecciones, function(dat) {
            _this.arrayCuentas.push({
                entidad:dat.json.entidad,
                idcuenta:dat.json.idcuenta,
                cuenta:dat.json.concatctax,
                valorcontable:dat.json.saldo,
                valorinventario:dat.json.valorinv,
                diferencia:dat.json.diff
                
            }) ;            
           })
        }
        console.info(_this.arrayCuentas)
           var params = params || {
             arrayCuentas: Ext.encode(_this.arrayCuentas)
           };

        Ext.Ajax.request({
            url: '/logistica/inventario/recuperaciones/index.php/balancecontable/adicionarBalance',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, 'El balance ha sido guardado satisfactoriamente');
                }
            }
        });
    },
    getDepositos: function() {
        var _this = this;
        _this.entidades = [];
        _this.entidadesCheck = _this.comboDepositos.getCheckedValue();
        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
        }
        var value = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades + '}';
        return "'" + value + "'";
    },
    getCriterio: function() {
        return this.denominacion.getValue() || null;
    },
    botonBuscar: function() {
        if (this.denominacion.isDirty() || this.dias.isDirty()) {
            var _this = this;
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load({
                params: {
                    valor: _this.dias.getValue(),
                    denominacion: _this.denominacion.getValue()
                }
            });
        }
    },
    customTriggerClear: function() {
        if (this.denominacion.isDirty() || this.dias.isDirty()) {
            var _this = this;
            _this.dias.reset();
            _this.denominacion.reset();

            _this.storePrincipal.on('beforeload', function(store) {
                store.baseParams = {
                    idestructura: idEntidad,
                    valor: 0,
                    denominacion: null,
                    start: 0,
                    limit: null
                };
            });
            _this.getStorePrincipal().load();
        }
    }

});

Ext.erp.balancecontable.winHistorialBalance = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    constructor: function (config) {
        config.autoLoad = false;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/balancecontable';
        config.urlBusquedaGridPrincipal = 'cargarHistorialBalance';
        config.modoSeleccion = 1;
        config.busquedaAvanzada = true;
        config.autoSelect = false;
        //config.idioma = Log.tall.balancecuadreproceso.Idioma;
        config.formaVisualizacion = 'ventana';
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        config.record = config.record;
        Ext.erp.balancecontable.winHistorialBalance.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Cuenta',
            width: 180,
            dataIndex: 'concatcta',
            default: true
        });

        this.addGridColumn({
            header: 'Descripcion',
            width: 180,
            hidden:true,
            dataIndex: 'cuenta',
            default: true,
            width:300
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Valor contable',
            width: 100,
            dataIndex: 'valorcontable',
            default: true,
            align: "right"
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Valor inventario',
            width: 100,
            dataIndex: 'valorinventario',
            default: true,
            align: "right"
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Diferencia',
            width: 100,
            dataIndex: 'diferencia',
            default: true,
            align: "right"
        }));

        this.addGridColumn({
            header: 'Fecha',
            width: 100,
            dataIndex: 'fecha',
            default: true
        });

        this.addGridColumn({
            header: 'Usuario',
            width: 100,
            dataIndex: 'nombreusuario',
            default: true
        });

        this.addGridColumn({dataIndex: 'identidad'});

        this.addGridColumn({dataIndex: 'idcuenta'});

    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            disabled: true,
            tooltip: 'Imprimir historial de balance contable',
            handler: function() {
                console.info(_this)
                    this.tipoReportes = new LOG.util.Report({
                        reports: [{
                            dirReport: '/distra/logistica/inventario/recuperaciones/HistorialBalanceContable',
                            isList:true,
                            params: {
                                fechainicio:(_this.FechaDesdeBA.getValue())?_this.FechaDesdeBA.getValue():null,
                                fechafin:(_this.FechaHastaBA.getValue())?_this.FechaHastaBA.getValue():null
                            }
                        }]
                    });
                    this.tipoReportes.view();
            },
            controlFn: function(b, _this) {
                _this.getGridPrincipal().store.fireEvent = _this.getGridPrincipal().store.fireEvent.createSequence(function(e) {
                    if (e == 'load') {
                        if (_this.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
    },
    init: function () {
        var _this = this;
        Ext.erp.balancecontable.winHistorialBalance.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {


        });

        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
       this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },
    render: function () {
        var _this = this;
        var render =  Ext.erp.balancecontable.winHistorialBalance.superclass.render.call(this);

        this.getStorePrincipal().load();
        return render;
    },
    view:function(){
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
     
        var clsFsRangoFechaPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        var clsFsRFInternoPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.FechaDesdeBA = new Ext.form.DateField({
            fieldLabel: 'Desde',
            name: 'desdeBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeBA',
            endDateField: 'hastaBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaDesdeBA);

        this.FechaHastaBA = new Ext.form.DateField({
            fieldLabel: 'Hasta',
            name: 'hastaBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaBA',
            startDateField: 'desdeBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaHastaBA);

        clsFsRangoFechaPeriodo.addComponent(
            new Ext.form.FieldSet({
                title: 'Rango de fecha',
                items: clsFsRFInternoPeriodo,
            })
        );
        _this.addFilterComponent(clsFsRangoFechaPeriodo);
        var view =Ext.erp.balancecontable.winHistorialBalance.superclass.view.call(this);
       return view;
    }
});