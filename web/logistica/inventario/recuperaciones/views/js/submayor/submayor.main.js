Ext.ns('LOG.inv.submayor');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.inv.submayor.Idioma, LOG.util.Idioma);
    var vistaSubmayor = new LOG.inv.submayor.View({
        busquedaAvanzada: true,
        acciones: acciones_reportes,
        idioma: idioma
    });
    vistaSubmayor.attachPlugin(new LOG.lb.plugin.ComboDepositos({}, 1));
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.MostrarTarjetaPlugin());
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.RestablecerDisponible());
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.RestablecerUbicacion());
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.RestablecerSubmayor());
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.DesactivarTarjeta());

// vistaSubmayor.attachPlugin(new LOG.inv.submayor.ExistenciaPorAreaPlugin());
//vistaSubmayor.attachPlugin(new LOG.inv.submayor.UbicacionPorAreaPlugin());
//vistaSubmayor.attachPlugin(new LOG.inv.submayor.MovimientosEspecificacionProductoPlugin());
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.MovimientosProductoPlugin());
    vistaSubmayor.attachPlugin(new LOG.inv.submayor.DisponibleProductoPlugin());
    var datosContables = window.DATOS_CONTABLES || false;
    if(datosContables == true){
        vistaSubmayor.attachPlugin(new LOG.lb.plugin.DatosContables());
    }  
//vistaSubmayor.attachPlugin(new LOG.inv.submayor.NumeroSeriePlugin());
//vistaSubmayor.attachPlugin(new LOG.lb.producto.BarcodeReader());

    vistaSubmayor.init();
//--------------------------busqueda avanzada
    vistaSubmayor.getPanelBusqueda().setColumns(1);
    var fpProductos = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var codigo = LOG.util.Prototipos.inputEntero({
        fieldLabel: idioma.taCodigo,
        name: 'codigo',
        maxLength: 19,
        minLength: 2
    });
    var codigoProv = LOG.util.Prototipos.inputTexto({
        fieldLabel: (typeof esminfar !== 'undefined' && esminfar) ? idioma.taNroPieza : idioma.taCodigoProveedor,
        name: 'codigoproveedor',
        hidden: (typeof confArmamento !== 'undefined' && confArmamento) ? true : false,
        maxLength: 19,
        minLength: 2
    });
    var denomAvanzada = new Ext.form.TextField({
        fieldLabel: idioma.taDenominacion,
        name: 'denominacion',
        maxLength: 255,
        minLength: 2
    });
    var tipoProd = new LOG.util.ComboBox({
        fieldLabel: idioma.lbTipoProducto,
        valueField: 'tipoproducto',
        displayField: 'tipoprod',
        hiddenName: 'tipoproducto',
        editable: false,
        triggerAction: 'all',
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['tipoproducto', 'tipoprod'],
            data: [
                [1, 'Equipo'],
                [0, 'No Equipo']
            ]
        })
    });
    var cbNatura = new Ext.erp.comboNomenclador({
        fieldLabel: idioma.lbNaturaleza,
        controller: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/',
        modelo: 'NomNaturaleza',
        idnom: 'idnaturaleza',
        name: 'naturaleza',
        autoCargar: true,
        start: 0,
        pageSize: 3
    });//---combobox Naturaleza
    var cbCategoria = new Ext.erp.comboNomenclador({
        fieldLabel: idioma.taCategoria,
        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        modelo: 'NomCategoriasproducto',
        idnom: 'idcategoria',
        name: 'categoria',
        autoCargar: true
    });
    var cbMarca = new LOG.util.ComboBox({
        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
        name: 'idmarca',
        valueField: 'idmarca',
        displayField: 'denominacion',
        autoLoad: true,
        autoSelect: false,
        descField: 'desc',
        fieldLabel: 'Marca',
        selectOnFocus: true,
        forceSelection: true,
        mode: 'remote',
        minChars: 0,
        listWidth: 300,
        //pageSize: 20,
        isCombo: true
    });

    var cbModelo = new LOG.util.ComboBox({
        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
        name: 'idmodelo',
        valueField: 'idmodelo',
        displayField: 'denominacion',
        autoLoad: true,
        autoSelect: false,
        descField: 'desc',
        fieldLabel: 'Modelo',
        selectOnFocus: true,
        forceSelection: true,
        mode: 'remote',
        minChars: 0,
        listWidth: 300,
        //pageSize: 20,
        isCombo: true
    });

    var cbClasificacionCont = new Ext.erp.comboNomenclador({
        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        modelo: 'NomClasificacioncontablelog',
        idnom: 'idclasificacioncontable',
        name: 'denominacion',
        autoCargar: true,
        fieldLabel: idioma.lbClasificacion
    });//---combobox Clasificacion contable
    var tcUbicacion = new LOG.util.TreeCombo({
        fieldLabel: idioma.lbEstrucUbica,
        hiddenName: 'idarea',
        url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
        emptyText: idioma.lbEmptyText,
        node: 0
    });
    var disponib = new Ext.form.Checkbox({
        boxLabel: idioma.cbxDisponibilidad,
        name: 'condisponible',
        listeners: {
            'check': function(cmp, checked) {
                if (checked) {
                    cmp.checked = true;
                } else {
                    vistaSubmayor.panelBusquedaAvanzada.parametros.condisponible = false;
                }
            }
        }
    });
    var exist = new Ext.form.Checkbox({
        boxLabel: idioma.cbxExistencia,
        name: 'conexistencia',
        listeners: {
            'check': function(cmp, checked) {
                if (checked) {
                    cmp.checked = true;
                } else {
                    vistaSubmayor.panelBusquedaAvanzada.parametros.conexistencia = false;
                }
            }
        }
    });
    vistaSubmayor.addFilterComponent(fpProductos);
    vistaSubmayor.addFilterComponent(new Ext.form.FieldSet({
        title: idioma.tlProd,
        items: [fpProductos]
    }));
    var fpMovimientos = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var criterio = new LOG.util.ComboBox({
        fieldLabel: idioma.cbxCriterio,
        valueField: 'criterioavan',
        displayField: 'descripcion',
        hiddenName: 'criterioavan',
        editable: false,
        triggerAction: 'all',
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['criterioavan', 'descripcion'],
            data: [
                [1, 'Menor que'],
                [2, 'Igual a'],
                [3, 'Mayor que']
            ]
        })
    });
    var cant = LOG.util.Prototipos.inputEntero({
        fieldLabel: idioma.lbCantidad,
        name: 'cantidad',
        maxLength: 19,
        minLength: 1
    });
    var desde = new Ext.form.DateField({
        fieldLabel: idioma.lbDfDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desdeSub',
        endDateField: 'hastaSub',
        editable: false
    });
    var hasta = new Ext.form.DateField({
        fieldLabel: idioma.lbDfHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hastaSub',
        startDateField: 'desdeSub',
        editable: false
    });

    fpProductos.addComponent(codigo);
    fpProductos.addComponent(codigoProv);
    fpProductos.addComponent(denomAvanzada);
    fpProductos.addComponent(tipoProd);
    fpProductos.addComponent(cbNatura);
    fpProductos.addComponent(cbCategoria);
    fpProductos.addComponent(cbMarca);
    fpProductos.addComponent(cbModelo);
    fpProductos.addComponent(cbClasificacionCont);
    fpProductos.addComponent(tcUbicacion);
    fpProductos.addComponent(disponib);
    fpProductos.addComponent(exist);
    fpMovimientos.addComponent(criterio);
    fpMovimientos.addComponent(cant);
    fpMovimientos.addComponent(desde);
    fpMovimientos.addComponent(hasta);

    vistaSubmayor.addFilterComponent(fpMovimientos);
    vistaSubmayor.addFilterComponent(new Ext.form.FieldSet({
        title: idioma.tlMov,
        items: [fpMovimientos]
    }));
    vistaSubmayor.render = vistaSubmayor.render.createSequence(function () {
        vistaSubmayor.getPanelSuperior().comboDeposito.fireEvent = vistaSubmayor.getPanelSuperior().comboDeposito.fireEvent.createSequence(function (e, iddposito) {
            if ('valuechange' == e) {
                tcUbicacion.setBaseNode({_node: iddposito});
            }
        })
    });
    var desdeR = new Ext.form.DateField({
        fieldLabel: vistaSubmayor.idioma.lbDfDesde,
        name: 'desdeR',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desdeR',
        endDateField: 'hastaR',
        editable: false
    });
    var hastaR = new Ext.form.DateField({
        fieldLabel: vistaSubmayor.idioma.lbDfHasta,
        name: 'hastaR',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hastaR',
        startDateField: 'desdeR',
        editable: false
    });
    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    cls.addComponent(desdeR);

    cls.addComponent(hastaR);
    var formularioImprimir = LOG.util.UIManager.initPanel({
        layout: 'form',
        frame: true,
        labelAlign: 'top',
        items: [cls]
    });
    vistaSubmayor.insertToolbarButton(LOG.util.Prototipos.botonImprimir({
        text: vistaSubmayor.idioma.lbBtnImprimirReporte,
        tooltip: vistaSubmayor.idioma.ttImprimirReporte,
        disabled: true,
     text: 'Imprimir',
        tooltip: 'Imprimir',
        menu: [
        new Ext.menu.Item({
        iconCls: 'icondistra-imprimir',
        text: 'Imprimir listado de productos',
        handler: function () {
            var _this = this;
            _this.fechainicio = (desde.getValue()) ? desde.getValue().format('d/m/Y') : null;
            _this.fechafin = (hasta.getValue()) ? hasta.getValue().format('d/m/Y') : null;
            v_url_report = (farmacia != 1) ? '/distra/logistica/inventario/recuperaciones/SubmayorInventario/SubmayorInventario' + ((alternativa) ? 'Dual' : '') : '/distra/logistica/farmacia/recuperaciones/SubmayorInventario';
            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: v_url_report,
                        name: 'SumbayorInventario',
                        isList: true,
                        params: {
                            iddeposito: vistaSubmayor.idDeposito || null,
                            criterio: vistaSubmayor.getGridPrincipal().toolbars[0].items.items[1].getValue() || null,
                            codigo: codigo.getValue() || null,
                            codigoproveedor: codigoProv.getValue() || null,
                            denominacion: denomAvanzada.getValue() || null,
                            tipoproducto: tipoProd.getValue() || null,
                            idnaturaleza: cbNatura.getValue() || null,
                            categoria: cbCategoria.getValue() || null,
                            idclasifcontable: cbClasificacionCont.getValue() || null,
                            idestructuraubic: tcUbicacion.getValue() || null,
                            disponibiliad: (disponib.checked) ? 1 : null,
                            existencia: (exist.checked) ? 1 : null,
                            criterioavan: criterio.getValue() || null,
                            cantidadmov: cant.getValue() || null,
                            fechainicio: (desde.getValue()) ? desde.getValue().format('d/m/Y') : null,
                            fechafin: (hasta.getValue()) ? hasta.getValue().format('d/m/Y') : null,
                            start: 0,
                            limit: null,
                            monedaalternativa: monedaalternativa ? monedaalternativa : null,
                            monedacontable: monedacontable ? monedacontable : null,
                            idmarca: cbMarca.getValue() || null,
                            idmodelo: cbModelo.getValue() || null
                        }
                    }
                ]
            });
            this.tipoReportes.view();
        },
  }),
    new Ext.menu.Item({
        
        text: 'Movimiento del Inventario',
        tooltip: 'Imprimir Movimiento del Inventario',
        isList: false,
        name: 'MovimientoInventario',
        iconCls: 'icondistra-imprimir',
        handler: function(){
            var winReporte = new Ext.Window({
                title: 'Imprimir Movimiento del Inventario',
                closeAction: 'hide',
                constrain: true,
                width: 400,
                heigth: 400,
                modal: true,
                items: [formularioImprimir],
                buttons: [{
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    iconCls: 'cerrar',
                    handler: function () {
                        winReporte.hide();
                        desdeR.setValue("");
                        hastaR.setValue("");
                    }
                }, {
                    text: 'Imprimir',
                    tooltip: 'Imprimir reporte',
                    isList: false,
                    iconCls: 'icondistra-imprimir',
                    name: 'Imprimir',
                    handler: function () {
                        var tipoReportes = new LOG.util.Report({ 
                            reports: [
                                {
                                    dirReport: '/distra/logistica/inventario/recuperaciones/SubmayorInventario/MovimientosInventario',
                                    name: 'MovimientoInventario',
                                    isList: false,
                                    
                                    params: {
                                        fechainicio: (desdeR.getValue()) ? desdeR.getValue().format('d/m/Y') : null,
                                        fechafin: (hastaR.getValue()) ? hastaR.getValue().format('d/m/Y') : null,
                                        iddeposito:vistaSubmayor.idDeposito || null, 
                                        disponibiliad: (disponib.checked) ? 1 : null,
                                        existencia: (exist.checked) ? 1 : null,
                                        codigo: codigo.getValue() || null,
                                        codigoProv:codigoProv.getValue() || null,
                                        denominacion:denomAvanzada.getValue() || null,
                                        tipoprod:tipoProd.getValue() || null, 
                                        naturaleza:cbNatura.getValue() || null,
                                        categoria:cbCategoria.getValue() || null,
                                        clasificacionCont:cbClasificacionCont.getValue() || null,
                                        ubicacion:tcUbicacion.getValue() || null,
                                        criterio:criterio .getValue() || null,
                                        cant:cant.getValue() || null,
                                        desde: (desde.getValue())? desde.getValue().format('d/m/Y') : null,
                                        hasta:(hasta.getValue())? hasta.getValue().format('d/m/Y') : null,
                                         
                                    }
                                   
                                }
                            ]
                        });
                        tipoReportes.view();
                        winReporte.hide();
                        desdeR.setValue("");
                        hastaR.setValue("");
                    }
                }]
                
            });
            winReporte.show();
        }, 
    })],
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
    }), 2);
    vistaSubmayor.insertToolbarButton(LOG.util.Prototipos.botonGeneral({
        text: 'Exportar movimientos',
        tooltip: 'Exportar movimientos del periodo',
        iconCls: 'exportar',
        disabled: false,
        handler: function () {
            var _this = this;
            Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
            Ext.Ajax.request({
                url: 'cargarconsumoproductos',
                method: 'POST',
                params: {
                    iddeposito: vistaSubmayor.idDeposito || null,
                    criterio: vistaSubmayor.getGridPrincipal().toolbars[0].items.items[1].getValue() || null,
                    codigo: codigo.getValue() || null,
                    codigoproveedor: codigoProv.getValue() || null,
                    denominacion: denomAvanzada.getValue() || null,
                    tipoproducto: tipoProd.getValue() || null,
                    idnaturaleza: cbNatura.getValue() || null,
                    categoria: cbCategoria.getValue() || null,
                    idclasificacioncontable: cbClasificacionCont.getValue() || null,
                    idarea: tcUbicacion.getValue() || null,
                    condisponible: (disponib.checked) ? 1 : null,
                    conexistencia: (exist.checked) ? 1 : null,
                    criterioavan: criterio.getValue() || null,
                    cantidad: cant.getValue() || null,
                    desde: (desde.getValue()) ? desde.getValue().format('m/d/Y') : null,
                    hasta: (hasta.getValue()) ? hasta.getValue().format('m/d/Y') : null,
                    start: 0,
                    limit: 30000,
                    idmonedaalternativa: monedaalternativa ? monedaalternativa : null,
                    idmonedacontable: monedacontable ? monedacontable : null,
                    idmarca: cbMarca.getValue() || null,
                    idmodelo: cbModelo.getValue() || null,
                },
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                    window.open(resp.dirFichero, 'ventana', wCfg);
                }.createDelegate(_this)
            });
        }
    }), 2);
    vistaSubmayor.insertToolbarButton(new LOG.util.Prototipos.botonGeneral({
        text: 'Movimientos por clasificaci\xf3n',
        tooltip: 'Imprimir movimientos del período por clasificaci\xf3n contable',
        handler: function () {
            var frmBusqueda = new LOG.util.ColumnForm({
                columnas : 3,
                region : 'center',
                frame : true
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
                format : 'd/m/Y',
                width : 150,
                name: 'fechaini',
                editable: false,
                allowBlank: false,
                maxValue: new Date(),
            }));
            frmBusqueda.addComponent(new Ext.form.DateField({
                fieldLabel: 'Hasta',
                format : 'd/m/Y',
                width : 150,
                name: 'fechafin',
                editable: false,
                allowBlank: false,
                maxValue: new Date(),

            }));
            var formularioBusqueda = LOG.util.UIManager.initForm({
                items: [frmBusqueda],
                layout : 'border',
                border : false,
                region : 'center'
            });
            var win = new LOG.util.Window({
                usarAplicar : false,
                cerrarAceptar : false,
                height : 150,
                width : 450,
                resizable :false,
                autoValidate : true,
                title : 'Filtros',
                aceptarFn : function(){
                    var params = formularioBusqueda.getForm().getValues();
                    params.idalmacen = vistaSubmayor.idDeposito;
                    var tipoReportes = new LOG.util.Report({
                        reports: [{
                              dirReport: '/distra/logistica/inventario/recuperaciones/MovimientosPeriodoModel',
                              name: 'MovimientosPeriodoModel',
                              isList: true,
                              params: params
                        }]
                    });
                    tipoReportes.view();
                },
                items : [formularioBusqueda]
                
            });
            win.show();
        }
    }), 2);
    vistaSubmayor.insertToolbarButton(LOG.util.Prototipos.botonGeneral({
        text: LOG.inv.submayor.Idioma.lbBtnCierre,
        tooltip: LOG.inv.submayor.Idioma.lbBtnCierre,
        iconCls : 'periodo',
        menu : [LOG.util.UIManager.createMenuItem({
            text: LOG.inv.submayor.Idioma.lbBtnCierreDia,
            tooltip: LOG.inv.submayor.Idioma.ttBtnCierreDia,
            iconCls: 'cierrediario',
            handler: function () {
                var _this = this;
                mostrarMensaje(2, LOG.inv.submayor.Idioma.msgCerrarDia, function (btn) {
                    if (btn == 'ok') {
                        var smModel = new LOG.inv.submayor.Model({
                            idioma: LOG.inv.submayor.Idioma
                        });
                        smModel.cerrarDiaAlmacen({
                            iddeposito: vistaSubmayor.idDeposito
                        }, function () {
                            vistaSubmayor.getStorePrincipal().reload();
                        });
                    }
                });
            },
            controlFn: function (b, __caller) {
                if (__caller.grantedAction('RCAlm')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }),
            LOG.util.UIManager.createMenuItem({
                    text: LOG.inv.submayor.Idioma.lbBtnCerrarAlm,
                    tooltip: LOG.inv.submayor.Idioma.ttBtnCerrarAlm,
                    iconCls: 'apagar',
                    handler: function () {
                        var _this = this;
                        mostrarMensaje(2, LOG.inv.submayor.Idioma.msgCerrarAlm, function (btn) {
                            if (btn == 'ok') {
                                var smModel = new LOG.inv.submayor.Model({
                                    idioma: LOG.inv.submayor.Idioma
                                });
                                smModel.cerrarAlmacen({
                                    iddeposito: vistaSubmayor.idDeposito
                                }, function () {
                                    _this.disable();
                                });
                            }
                        });
                    },
                    controlFn: function (b, __caller) {
                        if (__caller.grantedAction('RCAlm')) {
                            b.setVisible(true);
                        } else {
                            b.setVisible(false);
                        }
                    }
                })
        ],
        controlFn: function (b, __caller) {
            b.disable();
            __caller.comboDeposito = LOG.util.UIManager.encadenaFn(__caller.comboDeposito, 'fireEvent', function (e, value) {
                if (e == 'valuechange') {
                    b.disable();
                    if (value == null) {
                        return;
                    }
                    //var comboRec = this.getStore().getById(value);
                    if (this.data.estado == 2) {
                        b.enable();
                    }
                }
            });
        }
    }), 2);
    vistaSubmayor.insertToolbarButton(new LOG.util.Prototipos.botonGeneral({
        text: 'Gastos',
        tooltip: 'Imprimir vales de entrega del período',
        handler: function () {
            var frmBusqueda = new LOG.util.ColumnForm({
                columnas : 2,
                region : 'center',
                frame : true
            });
            frmBusqueda.addComponent(new Ext.form.DateField({
                fieldLabel: 'Desde',
                format : 'd/m/Y',
                width : 150,
                name: 'fechaini',
                editable: false,
                allowBlank: false,
                maxValue: new Date(),
            }));
            frmBusqueda.addComponent(new Ext.form.DateField({
                fieldLabel: 'Hasta',
                format : 'd/m/Y',
                width : 150,
                name: 'fechafin',
                editable: false,
                allowBlank: false,
                maxValue: new Date(),

            }));
            var formularioBusqueda = LOG.util.UIManager.initForm({
                items: [frmBusqueda],
                layout : 'border',
                border : false,
                region : 'center'
            });
            var win = new LOG.util.Window({
                usarAplicar : false,
                cerrarAceptar : false,
                height : 150,
                width : 450,
                resizable :false,
                autoValidate : true,
                title : 'Filtros',
                aceptarFn : function(){
                    var _this = this;
                    var params = formularioBusqueda.getForm().getValues();
                    params.idalmacen = vistaSubmayor.idDeposito;
                    Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                    Ext.Ajax.request({
                        url: 'exportargastos',
                        method: 'POST',
                        params: params,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                            window.open(resp.dirFichero, 'ventana', wCfg);
                        }.createDelegate(_this)
                    });
                },
                cancelarFn: function () {
                    var _this = this;
                    _this.close()
                },
                items : [formularioBusqueda]

            });
            win.show();
        }
    }), 2);

  vistaSubmayor.insertToolbarButton(LOG.util.Prototipos.botonGeneral({
        text: 'Test EZN',
        iconCls: 'apagar',
        handler: function () {
            var winQR = new LOG.lb.Enzona.QRView({
                aceptarFn: function () {
                },
                socpeFn: vistaSubmayor
            });
            winQR.show();
            winQR.loadQrPayment(/*Monto*/'0.10', /*Moneda*/'cup',/*Detalles de la factura*/ 'Detalle de la factura', /*puede ser vacio*/'provari',/*consumerKey*/ 'izrei8omUU75rEZ3oH3Za5B76qUa', /*consumerSecret*/'fDEfY3LzrOKLxuOpH_CqmQXajEwa');
        },
        controlFn: function (b, __caller) {
            b.setVisible(true)
        }
    }), 2);

    vistaSubmayor.view();

})




