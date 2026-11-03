Ext.ns('LOG.inv.operaciones');
LOG.inv.operaciones.calcularmaxmin.View = Ext.extend(LOG.util.UITemplate, {
    modoSeleccion: 3,
    urlBusquedaGridPrincipal: 'cargarGridPrincipal',
    dirController: '/logistica/inventario/operaciones/index.php/calcularmaxmin',
    idGridPrincipal: 'idproducto',
    busquedaBasica: true,
    concepto: "código o denominación",
    constructor: function (config) {
        var _this = this;
        this.autoLoad = false;
        this.cargainicial = config.cargainicial;
        this.idioma = LOG.inv.operaciones.calcularmaxmin.Idioma;
        LOG.inv.operaciones.calcularmaxmin.View.superclass.constructor.call(this, config);


    },
    init: function () {
        var _this = this;
        LOG.inv.operaciones.calcularmaxmin.View.superclass.init.call(this);
        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

            _this.panelNorte = new LOG.util.UIManager.initPanel({
                animCollapse: false,
                //collapsible: true,
                //collapsed: false,
                region: 'south',
                //region: 'north',
                layout: 'fit',
                height: 130,
                split: true,
                //width:900,
                frame: true,
                titleCollapse: false,
                collapseMode: 'mini'
            });
            _this.panelNorte.add(_this.getPanelSuperiorMio());
            _this.getPanelPrincipal().add(_this.panelNorte);


        });

    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.lbCodigo,
            dataIndex: 'codigo',
            width: 80,
            default: true,
            agrupador: false,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbDenominacion,
            dataIndex: 'denominacion',
            width: 150,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });

        this.addGridColumn({
            header: _this.idioma.lbUM,
            dataIndex: 'um',
            width: 50,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbLineaprod,
            dataIndex: 'lineaprod',
            width: 80,
            default: true,
            filter: {
                type: 'combo',
                dataIndex: 'lineaprod',
                valueField: 'idlineaprod',
                displayField: 'denominacion',
                // url: '/logistica/utiles/nomencladores/index.php/nomencladores/'
                url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomLineaProductoFarm&idnom=idlineaprod'
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbTipoDispensacion,
            dataIndex: 'idtipodispensacion',
            width: 100,
            default: true,
            renderer: function (value) {
                if (value == 1) {
                    return "Receta médica"
                }
                if (value == 2) {
                    return "Venta Liberada"
                }
                if (value == 3) {
                    return "Tarjeta control"
                }
                if (value == 4) {
                    return "Fórmula"
                }
                if (value == 5) {
                    return "Usufructo"
                }
                if (value == 6) {
                    return "Retrovirales"
                }
                if (value == 7) {
                    return "Pedido"
                }
            }
        });

        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.lbPrecioCosto,
            align: 'right',
            width: 70,
            dataIndex: 'precio'
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.lbPrecioVenta,
            align: 'right',
            width: 70,
            dataIndex: 'precioventa'
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.lbExistencia,
            align: 'right',
            width: 70,
            dataIndex: 'existencia'
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbDiasAbastecidos,
            dataIndex: 'diasabastecidos',
            width: 70,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.lbConsumo,
            dataIndex: 'consumo',
            align: 'right',
            width: 70,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbMinimoAntes,
            dataIndex: 'minimoantes',
            align: 'right',
            width: 80,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbMaximoAntes,
            dataIndex: 'maximoantes',
            align: 'right',
            width: 80,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbFondoFijoAntes,
            dataIndex: 'fondofijoantes',
            align: 'right',
            width: 90,
            default: true

        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbMinimo,
            dataIndex: 'minimo',
            align: 'right',
            width: 70,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbMaximo,
            dataIndex: 'maximo',
            align: 'right',
            width: 70,
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            header: _this.idioma.lbFondoFijo,
            dataIndex: 'fondofijo',
            align: 'right',
            width: 70,
            default: true

        }));

        this.addGridColumn({
            header: _this.idioma.lbAprobar,
            dataIndex: 'estado',
            width: 70,
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                }
            }
        });

        this.addGridColumn({
            header: _this.idioma.lbCalcular,
            dataIndex: 'calculado',
            width: 70,
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                }
            }
        });

        this.addGridColumn({
            dataIndex: 'idproducto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idcodificador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idprodcalculomaxmin',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idanalisis',
            default: false
        });

    },
    initDefaultButtons: function () {
        var _this = this;
        _this.botonAprobar = new LOG.util.Prototipos.botonAprobar({
            disabled: true,
            tooltip: this.idioma.ttAprobar,
            handler: function () {
                var recor = [];
                _this.idioma = LOG.inv.operaciones.calcularmaxmin.Idioma;
                mostrarMensaje(2, _this.idioma.msgConfirmacionAprobar, function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgAprobando, _this.idioma.msgEspere || '...');
                        Ext.each(_this.smGridPrincipal.selections.items, function (e) {
                            recor.push(e.data);
                        });

                        _this.aprobarMaxMin(recor, _this.formPanelSuperior.getForm().getValues());
                    }
                });
            }
        });
        _this.botonImprimir = new LOG.util.Prototipos.botonImprimir({
            disabled: false,
            handler: function () {

            }
        });
        _this.botonCalcular = new LOG.util.Prototipos.botonNuevo({
            disabled: true,
            text: "Calcular",
            iconCls: "calcular",
            tooltip: this.idioma.ttCalcular,
            handler: function () {
                var recor = [];
                _this.idioma = LOG.inv.operaciones.calcularmaxmin.Idioma;
                Ext.MessageBox.wait(_this.idioma.msgCalcular, _this.idioma.msgEspere || '...');
                Ext.each(_this.smGridPrincipal.selections.items, function (e) {
                    recor.push(e.data);
                });

                _this.getCalcularDatos(recor, _this.formPanelSuperior.getForm().getValues());
            }
        });

        _this.botonEliminar = new LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: 'Eliminar datos',
            handler: function () {
                var recor = [];
                _this.idioma = LOG.inv.operaciones.calcularmaxmin.Idioma;

                mostrarMensaje(2, _this.idioma.msgConfirmacionEliminar, function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
                        if (_this.smGridPrincipal.selections.items.length > 0) {
                            Ext.each(_this.smGridPrincipal.selections.items, function (e) {
                                recor.push(e.data.idproducto);
                            });
                            _this.getEliminarDatos(recor);
                        }
                    }
                });

            }
        });
        _this.botonAnalisis = new LOG.util.Prototipos.botonNuevo({
            disabled: false,
            text:'An\xe1lisis',
            iconCls: "abrirventana",
            tooltip: this.idioma.ttAnalisis,
            handler: function () {
                _this.winAnalisis = new LOG.inv.operaciones.winAnalisis({
                    idioma : _this.idioma,
                   // text: 'An\xe1lisis',
                });

                _this.winAnalisis.init();
                _this.winAnalisis.getVistaPrincipal().title     = 'Seleccionar an\xe1lisis';
                _this.winAnalisis.getVistaPrincipal().width     = 900;
                _this.winAnalisis.getVistaPrincipal().height    = 500;
                _this.winAnalisis.getVistaPrincipal().constrain = true;
                _this.winAnalisis.getVistaPrincipal().resizable = false;
                _this.winAnalisis.view();
            }
        });

        this.addToolbarButton(_this.botonCalcular);
        this.addToolbarButton(_this.botonEliminar);
        this.addToolbarButton(_this.botonAprobar);
        this.addToolbarButton(_this.botonImprimir);
        this.addToolbarButton('->');
        this.addToolbarButton(_this.botonAnalisis);

        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({}));

    },
    render: function () {
        var _this = this;
        var vista = LOG.inv.operaciones.calcularmaxmin.View.superclass.render.call(this);
        this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function (e) {

            if (e == 'beforeload') {
                // Ext.getBody().mask('Cargando...', 'x-mask-loading');
                if (_this.fieldProd.getValue()) {

                    _this.storePrincipal.baseParams = {
                        combo: true,
                        idcodificador: _this.fieldProd.getValue(),
                        fechainicio: new Date(_this.fieldFechaInicio.getValue()).format('d/m/Y'),
                        fechafin: new Date(_this.fieldFechaFin.getValue()).format('d/m/Y'),
                    };
                }
                if (_this.fieldLineaProd.getValue()) {
                    _this.storePrincipal.baseParams = {
                        combo: true,
                        idlineaprod: _this.fieldLineaProd.getValue(),
                        fechainicio: new Date(_this.fieldFechaInicio.getValue()).format('d/m/Y'),
                        fechafin: new Date(_this.fieldFechaFin.getValue()).format('d/m/Y'),
                    };
                }

            }
            if (e == 'load') {
                Ext.getBody().unmask();

                if (_this.storePrincipal.data.length == 0) {
                    mostrarMensaje(2, "No existen datos que mostrar.");
                }
                if (_this.fieldProd.getValue()) {
                    _this.storePrincipal.baseParams = {
                        combo: true,
                        idcodificador: _this.fieldProd.getValue()
                    };
                }
                if (_this.fieldLineaProd.getValue()) {
                    _this.storePrincipal.baseParams = {
                        combo: true,
                        idlineaprod: _this.fieldLineaProd.getValue()
                    };
                }
            }
        });

        this.getSmPrincipal().on('rowselect', function (sm) {

            if (sm.selections.length > 0) {
                Ext.each(sm.selections.items, function (e) {
                    if (_this.formPanelSuperior.getForm().isValid()) {
                        _this.botonCalcular.enable();
                        /*if (e.data.calculado == "") {
                            _this.botonCalcular.enable();
                        } else {
                            _this.botonCalcular.disable();
                        }*/
                    }

                    if (e.data.estado == 0 && e.data.calculado == 1) {
                        _this.botonAprobar.enable();
                        _this.botonEliminar.enable();
                    } else {
                        _this.botonAprobar.disable();

                    }
                    if (e.data.calculado == "" || e.data.calculado == 1) {
                        _this.botonEliminar.enable();
                    }
                    if (e.data.estado == 1) {
                        _this.botonEliminar.disable();
                    }
                });
            } else {
                _this.botonCalcular.disable();
                _this.botonEliminar.disable();
                _this.botonAprobar.disable();
            }
        });

        this.getSmPrincipal().on('rowdeselect', function (sm) {
            if (_this.getSmPrincipal().selections.length > 0) {
                Ext.each(_this.getSmPrincipal().selections.items, function (e) {

                    if (_this.formPanelSuperior.getForm().isValid()) {
                        if (e.data.calculado == "") {
                            _this.botonCalcular.enable();
                        } else {
                            _this.botonCalcular.disable();
                        }
                    }

                    if (e.data.estado == 0 && e.data.calculado == 1) {
                        _this.botonAprobar.enable();
                        _this.botonEliminar.enable();
                    } else {
                        _this.botonAprobar.disable();

                    }
                    if (e.data.calculado == "" || e.data.calculado == 1) {
                        _this.botonEliminar.enable();
                    }
                    if (e.data.estado == 1) {
                        _this.botonEliminar.disable();
                    }
                });
            } else {
                _this.botonCalcular.disable();
                _this.botonEliminar.disable();
                _this.botonAprobar.disable();
            }
        });

        return vista;
    },
    getFieldSuperior: function () {
        var _this = this;

        _this.fieldFechaInicio = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaInicio,
            allowBlank: false,
            format: 'd/m/Y',
            name: 'fechainicio',
            anchor: '80%',
            /*getValue : function(){
                var dat = this.parseDate(Ext.form.DateField.superclass.getValue.call(this));
                if(dat instanceof Date){
                    return dat.format(this.format);
                }
                return dat || "";
            }*/
        });

        _this.fieldFechaFin = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaFin,
            allowBlank: false,
            format: 'd/m/Y',
            name: 'fechafin',
            anchor: '80%',
           /* getValue : function(){
                var dat = this.parseDate(Ext.form.DateField.superclass.getValue.call(this));
                if(dat instanceof Date){
                    return dat.format(this.format);
                }
                return dat || "";
            }*/
        });

        _this.fieldFechaInicio.on('change', function (field, newValue) {
            _this.fieldFechaFin.setMinValue(newValue);
            _this.getSmPrincipal().clearSelections();
            if (field.getValue() && _this.fieldFechaFin.getValue()) {
                _this.fieldRangoDias.setValue(parseInt((_this.fieldFechaFin.getValue() - field.getValue()) / 86400000));
                _this.fieldProd.enable();
                _this.fieldLineaProd.enable();
                _this.fieldProd.getStore().load({
                    params:{
                        fechainicio: new Date(_this.fieldFechaInicio.getValue()).format('d/m/Y'),
                        fechafin: new Date(_this.fieldFechaFin.getValue()).format('d/m/Y'),
                    }
                });
                _this.fieldLineaProd.getStore().load();
            }
        });

        _this.fieldFechaFin.on('change', function (field, newValue) {
            _this.fieldFechaInicio.setMaxValue(newValue);
            _this.getSmPrincipal().clearSelections();
            if (field.getValue() && _this.fieldFechaInicio.getValue()) {
                _this.fieldRangoDias.setValue(parseInt((field.getValue() - _this.fieldFechaInicio.getValue()) / 86400000));
                _this.fieldProd.enable();
                _this.fieldLineaProd.enable();
                _this.fieldProd.getStore().load({
                    params:{
                        fechainicio: new Date(_this.fieldFechaInicio.getValue()).format('d/m/Y'),
                        fechafin: new Date(_this.fieldFechaFin.getValue()).format('d/m/Y'),
                    }
                });
                _this.fieldLineaProd.getStore().load();
            }
        });

        _this.fieldRangoDias = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'rangodia',
            format: 'd/m/Y',
            disabled: true,
            fieldLabel: this.idioma.lbRangoDias,
            autoCreate: true,
            allowBlank: true,
            enableKeyEvents: true
        });

        this.fieldProd = new LOG.util.ComboBox({
            url: 'cargarGridPrincipal',
            name: 'idcodificador',
            baseParams: {
                combo: 'true'
            },
            mode: 'local',
            hiddenName: 'denominacion',
            valueField: 'idcodificador',
            autoLoad: false,
            displayField: 'denominacion',
            fieldLabel: this.idioma.lbProductos,
            editable: true,
            typeAhead: true,
            disabled: true,
            allowBlank: false,
            selectOnFocus: true,
            emptyText: 'Seleccione...',
            anchor: '80%',
            listeners: {
                'select': function () {
                    _this.fieldLineaProd.reset();
                    _this.fieldLineaProd.allowBlank = true;
                    _this.getStorePrincipal().load();
                }, 'change': function () {
                    _this.fieldLineaProd.reset();
                    _this.fieldLineaProd.allowBlank = true;
                    _this.getStorePrincipal().load();
                }
            }
        });


        this.fieldLineaProd = new LOG.util.LovCombo({
            url: 'getCargarLineaProd',
            valueField: 'idlineaprod',
            hiddenName: 'idlineaprod',
            // name: 'denominacion',
            displayField: 'denominacion',
            mode: 'local',
            autoLoad: false,
            isCombo: true,
            disabled: true,
            allowBlank: false,
            fieldLabel: this.idioma.lbLineaprod,
            emptyText: 'Seleccione...',
            listeners: {
                'change': function () {
                    _this.fieldProd.reset();
                    _this.fieldProd.allowBlank = true;
                    _this.getStorePrincipal().load();
                }
            }
        });


        this.textarea = new Ext.form.TextArea({
            name: 'textarea',
            maxLength: 255
        });

        this.entradas = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'entradas',
            disabled: true,
            fieldLabel: this.idioma.lbEntradas,
            autoCreate: true,
            allowBlank: true,
            enableKeyEvents: true
        });

        this.consumo = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'consumo',
            disabled: true,
            fieldLabel: this.idioma.lbConsumo,
            autoCreate: true,
            allowBlank: true,
            enableKeyEvents: true
        });

        this.normasabasteci = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'normasabasteci',
            disabled: true,
            fieldLabel: this.idioma.lbNormasAbaste,
            autoCreate: true,
            value: _this.cargainicial.normabast,
            allowBlank: true,
            enableKeyEvents: true
        });

        return [
            _this.fieldFechaInicio,
            _this.fieldFechaFin,
            _this.fieldRangoDias,
            this.normasabasteci,
            this.fieldLineaProd,
            this.fieldProd
        ]

    },
    getPanelSuperiorMio: function () {
        var _this = this;
        this.getFieldSuperior = this.getFieldSuperior();
        var clsPanelTotal = LOG.util.UIManager.initColumnForm({
            columnas: 1,
            //width:500,
        });
       //clsPanelTotal.getColumn(0).columnWidth = 0.90;

        var clsPanelSuperiorCenter = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var clsPanelAux = LOG.util.UIManager.initColumnForm({
            columnas: 7
        });
       // clsPanelSuperiorCenter.getColumn(1).columnWidth = 0.18;

        clsPanelAux.addComponent(this.getFieldSuperior[0]);
        clsPanelAux.addComponent(this.getFieldSuperior[1]);
        clsPanelAux.addComponent(this.getFieldSuperior[2]);
        clsPanelAux.addComponent(this.getFieldSuperior[3]);
        clsPanelAux.addComponent(this.getFieldSuperior[4]);
        clsPanelAux.addComponent(this.getFieldSuperior[5]);
        clsPanelAux.addComponent({html: '<br><br><p style="font-size:12px;">' + 'Fecha del c\xe1lculo: ' + this.cargainicial.fechacontable + "</p></br></br>"});
       // clsPanelSuperiorCenter.addComponent(clsPanelAux);
        clsPanelTotal.addComponent(clsPanelAux);


        this.formPanelSuperior = LOG.util.UIManager.initForm({
            autoScroll: true,
            frame: true,
            region: 'center',
           // width:900,
            title: this.idioma.lbPeriodoAnalisis,
            items: [clsPanelTotal],

        });


        return this.formPanelSuperior;
    },
    getCalcularDatos: function (recor, recorForm) {

        var _this = this;
        Ext.Ajax.request({
            url: ' getCalcularDatos',
            params: {
                calcular: Ext.encode(recor),
                form: Ext.encode(recorForm),
                idcodificador: this.fieldProd.getValue(),
                idlineaprod: this.fieldLineaProd.getValue()
            },
            method: 'POST',
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    mostrarMensaje(2, "Los datos han sido calculados satisfactariamente");
                    _this.getStorePrincipal().reload()
                }
            }

        });
    },
    aprobarMaxMin: function (recor, recorForm) {

        var _this = this;
        Ext.Ajax.request({
            url: ' aprobarMaxMin',
            params: {
                //calcular: Ext.encode(recor),
                calcular: Ext.encode([]),
                form: Ext.encode(recorForm),
                idcodificador: this.fieldProd.getValue(),
                idlineaprod: this.fieldLineaProd.getValue()
            },
            method: 'POST',
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    mostrarMensaje(2, "Los datos han sido aprobados satisfactariamente");
                    _this.getStorePrincipal().reload()
                }
            }

        });
    },
    getEliminarDatos: function (recor) {

        var _this = this;
        Ext.Ajax.request({
            url: ' getEliminarDatos',
            params: {
                eliminar: Ext.encode(recor)
            },
            method: 'POST',
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    mostrarMensaje(2, "Los datos han sido eliminados satisfactariamente");
                    _this.getStorePrincipal().reload()
                }
            }

        });
    }
});

LOG.inv.operaciones.winAnalisis = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.busquedaBasica = true;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.autoLoad = true;
        // this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        this.urlBusquedaGridPrincipal = 'cargarAnalisis';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.operaciones.calcularmaxmin.Idioma);
       // this.concepto = 'this.idioma.tlBtnBuscar';
       // this.idproducto = config.idproducto;
       // this.idtransfinterna = config.idtransfinterna;
        LOG.inv.operaciones.winAnalisis.superclass.constructor.call(this, config);


    },
    initDefaultColumns: function() {
        var _this = this;
        //console.info(_this.gridFilter);
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });

        this.addGridColumn({
            dataIndex: 'fechainicio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            hidden: true
        });

        this.addGridColumn({
            dataIndex: 'nroregistro',
            header: this.idioma.nroRegistro,
            width: 120,
            autoExpand: true,
            filter: {
                type: 'string',
                dataIndex: 'nroregistro'
            }
        });
        this.addGridColumn({
            dataIndex: 'fechacalculo',
            header: this.idioma.nroFechaCalculo,
            width: 120
        });
        this.addGridColumn({
            header: _this.idioma.lbLineaprod + "/Producto",
            dataIndex: 'lineaprod',
            width: 150,
            default: true,
            filter: {
                type: 'combo',
                dataIndex: 'lineaprod',
                valueField: 'idlineaprod',
                displayField: 'denominacion',
                // url: '/logistica/utiles/nomencladores/index.php/nomencladores/'
                url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomLineaProductoFarm&idnom=idlineaprod'
            }
        });


    },
    initDefaultButtons: function (){

        this.vistaPrincipal.listaBotones.getItem(1).hide();
       // this.vistaPrincipal.listaBotones.getItem(2).hide();

        this.botonNuevo = new LOG.util.Prototipos.botonNuevo({
            disabled: false,
            text:'Nuevo',
            iconCls: "nuevo",
            tooltip: 'Nuevo',
            handler: function () {

            }
        });
        this.botonAbrir = new LOG.util.Prototipos.botonAbrir({
            disabled: false,
            tooltip: 'abrir',
            handler: function () {

            }
        });

        //this.addToolbarButton(this.botonNuevo);
       // this.addToolbarButton(this.botonAbrir);
    },


    render:function() {
        var _this = this;
        var vista = LOG.inv.operaciones.winAnalisis.superclass.render.call(this);
        _this.fieldFechaInicioAnalisis = new Ext.form.DateField({
            //fieldLabel: this.idioma.lbFechaInicio,
            allowBlank: false,
            format: 'd/m/Y',
            name: 'fechainicio',
            anchor: '80%',
            listeners:{
                'change': function(field, newValue, oldValue){
                    if (field.getValue() && _this.fieldFechaFinAnalisis.getValue()) {
                        _this.getStorePrincipal().load();
                    }
                }
            }
        });
        _this.fieldFechaFinAnalisis = new Ext.form.DateField({
            //fieldLabel: this.idioma.lbFechaFin,
            allowBlank: false,
            format: 'd/m/Y',
            name: 'fechafin',
            anchor: '80%',
            listeners:{
                'change': function(field, newValue, oldValue){
                    if (field.getValue() && _this.fieldFechaInicioAnalisis.getValue()) {
                    _this.getStorePrincipal().load();
                    }
                }
            }
        });


        _this.gridFilter.tfBusqueda.setVisible(false);
        _this.gridFilter.btnLimpiar.handler = function () {
            var scope = _this.gridFilter;
            if (scope.btnLimpiar.disabled) {
                return;
            }
            fieldFechaFinAnalisis.reset();
            fieldFechaInicioAnalisis.reset();
            var params = {};
            Ext.apply(params, scope.store.limitParams);
            params.criterio = '';
            scope.store.filtrado = false;

        };

        _this.getGridPrincipal().getTopToolbar().insert(0,{
            xtype: 'tbtext',
            text: LOG.inv.operaciones.calcularmaxmin.Idioma.lbFechaInicio
        });
        _this.getGridPrincipal().getTopToolbar().insert(1, _this.fieldFechaInicioAnalisis);

        _this.getGridPrincipal().getTopToolbar().insert(2,{
            xtype: 'tbtext',
            text: LOG.inv.operaciones.calcularmaxmin.Idioma.lbFechaFin
        });
        _this.getGridPrincipal().getTopToolbar().insert(3, _this.fieldFechaFinAnalisis);
        _this.getVistaPrincipal().doLayout();



       /* _this.getStorePrincipal().on({
            beforeload:function (st, obj) {
                obj.params.activo = 1;
                if (_this.idproducto) {
                    obj.params.idproducto = _this.idproducto;
                }
                if (_this.idtransfinterna) {
                    obj.params.idtransfinterna = _this.idtransfinterna;
                }
                obj.params.excluir = Ext.encode(_this.excluir);
                // obj.params.idcodificador = _this.idcodificador;
            }
        });

        this.getSmPrincipal().on(
            'rowselect', function (sm, index) {
                var record = sm.getSelections();
                var enusoselect = record[0].data.enuso;
                Ext.each(record, function(e){
                    if (e.data.enuso != enusoselect) {
                        sm.clearSelections();
                        sm.selectRecords([e]);
                        enusoselect = e.data.enuso;
                    }
                });

                if (record.length >= 1 && enusoselect == 0){
                    _this.vistaPrincipal.listaBotones.getItem(1).enable();
                    _this.vistaPrincipal.listaBotones.getItem(2).enable();
                }
                if (record.length == 0 && enusoselect == 1) {
                    _this.vistaPrincipal.listaBotones.getItem(1).disable();
                    _this.vistaPrincipal.listaBotones.getItem(2).disable();
                }

            });

        this.getSmPrincipal().on(
            'rowdeselect', function (sm, index) {
                var record = sm.getSelections();

                if (record.length == 0) {
                    _this.vistaPrincipal.listaBotones.getItem(1).disable();
                    _this.vistaPrincipal.listaBotones.getItem(2).disable();
                }

            });
        _this.getStorePrincipal().load();*/


        return vista;
    }
});