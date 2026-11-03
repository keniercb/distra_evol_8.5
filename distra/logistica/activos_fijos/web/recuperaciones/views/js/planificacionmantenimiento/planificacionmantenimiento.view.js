Ext.ns('Log.aft.rcp');

Log.aft.rcp.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.rcp.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/planificacionmantenimiento';
        this.urlBusquedaGridPrincipal = 'cargarPlanificacion';
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.busquedaAvanzada = true;
        this.height = 900;
        Log.aft.rcp.View.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCmCodigo,
            dataIndex: 'codigo',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;

    },
    getPanelContenido: function () {
        var _this = this;
        var comboMedio = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            displayField: 'descripcionmarcamodelo',
            fieldLabel: this.idioma.lbMedio,
            valueField: 'idindicador',
            mode: 'remote',
            queryParam: 'criterio',
            listeners: {
                'select': function (cb, rec) {
                    var vista = new Log.aft.rcp.Plantilla({});
                    vista.init();
                    Ext.Ajax.request({
                        url: '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento/cargarPlanificaciones',
                        method: 'POST',
                        params: {idindicador: rec.data.idindicador},
                        callback: function (o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            var idsplanif = new Array();
                            if (resp.success) {
                                for (var i = 0; i < resp.cantidad; i++) {
                                    idsplanif.push(resp.datos[i]['idplanificacionmantenimiento']);
                                    vista.addGridColumn(
                                        {
                                            header: resp.datos[i]['periodo'] + ' / ' + resp.datos[i]['recursoconsumido'],
                                            width: 110,
                                            dataIndex: resp.datos[i]['idplanificacionmantenimiento'],
                                            renderer: function (value, metaData) {
                                                if (value == 1) {
                                                    metaData.css = 'icondistra-aceptar verde';
                                                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmSi + '"';
                                                } else {
                                                    metaData.css = 'icondistra-aceptar rojo';
                                                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNo + '"';
                                                }
                                                return '';
                                            }
                                        }
                                    )
                                }

                                pContenido.removeAll();
                                pContenido.add(vista.view());
                                pContenido.doLayout();
                                vista.getStorePrincipal().on({
                                    'beforeload': function (st, obj) {
                                        Ext.apply(obj.params, {idplanificacionmantenimiento: Ext.encode(idsplanif)});
                                    }
                                });
                                vista.getStorePrincipal().load();
                                if (s) {

                                }
                            } else {
                            }
                        }.createDelegate(this)
                    });

                }
            },
            pageSize: 15,
            minChar: 2,
            resizable: true,
            minListWidth: 300
        });
        comboMedio.store.on('beforeload', function (st, obj) {
            Ext.apply(obj.params, {explotacion: 1});
        });
        var ii = limit = 2;

        var panelMedio = LOG.util.UIManager.initPanel({
            region: 'north',
            frame: true,
            tbar: [new Ext.form.Label({html: 'Medio: '}), ' ', comboMedio]
        });

        var pContenido = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'fit',
            cls: "background-image:url(fondo.jpg) !important; ",
            height: 900,
            frame: true,
            items: [LOG.util.UIManager.initPanel({
                id: 'idPanelContenido',
                bodyStyle: 'background-image:url(/logistica/activos_fijos/recuperaciones/views/images/fondo.jpg)'
            })]
        });

        return LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'border',
            cls: "background-image:url(fondo.jpg) !important; ",
            frame: true,
            items: [panelMedio, pContenido]
        })
    }
});

Log.aft.rcp.Plantilla = Ext.extend(LOG.util.UITemplate, {
    aplicarCumplimiento: false,
    regNumerico: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.rcp.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/planificacionmantenimiento';
        this.urlBusquedaGridPrincipal = 'cargarPlanificaciones';
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.formaVisualizacion = 'panel';
        this.busquedaAvanzada = true;
        this.gridEditable = (config.aplicarCumplimiento) ? config.aplicarCumplimiento : false;
        Log.aft.rcp.Plantilla.superclass.constructor.call(this, config);
        if (this.aplicarCumplimiento) {
            this.modelo = new Log.aft.rcp.ModeloPlanfMant({idioma: this.idioma});
        }
        if (this.formaVisualizacion = 'ventana') {
            this.getVistaPrincipal().setWidth(config.width);
            this.getVistaPrincipal().setHeight(config.height);
            this.getVistaPrincipal().setTitle(config.title);
        }
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idconfactividadsistemamedio',
            hidden: true
        });
        this.addGridColumn({
            header: 'Actividad | ( Per\xedodo / Recurso consumido )',
            width: 300,
            dataIndex: 'denominacion'
        });
        this.addGridColumn({
            header: 'Sistema',
            width: 100,
            hidden: true,
            dataIndex: 'sistema',
            agrupador: true
        });
    },
    render: function(){
        var _this = this;
        var vista = Log.aft.rcp.Plantilla.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function(st,obj){
                obj.params.cumplimientomanual =  _this.grantedAction('RCumplimientoMant');
            }
        });
        return vista;
    },
    init: function () {
        Log.aft.rcp.Plantilla.superclass.init.call(this);
        if(this.grantedAction('RCumplimientoMant')){
            this.panelDatos();
        }
    },
    panelDatos: function () {
        var _this = this;
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        this.comboPlanificacion = new LOG.util.ComboBox({
            fieldLabel: 'Planificación',
            displayField: 'denominacion',
            valueField: 'idplanificacionmantenimiento',
            allowBlank: false,
            mode: 'local'
        });
        this.fechaMantenimiento = new Ext.form.DateField({
            fieldLabel: 'Fecha',
            name: 'fecha',
            vtype: 'daterange',
            allowBlank: false,
            editable: false,
        });
        this.costo = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Costo'
        });
        this.nroFactura = new LOG.util.Prototipos.inputEntero({
            fieldLabel: 'Nro. Factura'
        });
        cls1.addComponent(this.comboPlanificacion);
        cls1.addComponent(this.fechaMantenimiento);
        cls1.addComponent(this.costo);
        cls1.addComponent(this.nroFactura);
        this.btnGuardar = new LOG.util.Prototipos.botonGuardar({
            handler: function () {
                var params = {
                    idplanificacionmantenimiento: _this.comboPlanificacion.getValue(),
                    fecha: _this.fechaMantenimiento.getValue(),
                    costo: _this.costo.getValue(),
                    nrofactura: _this.nroFactura.getValue(),
                    idregnumerico: _this.regNumerico.data.idregnumerico
                }
                _this.modelo.realizarMantenimiento(params);
            }
        });
        this.btnDeshacer = new LOG.util.Prototipos.botonEliminar({
            disable:true,
            handler: function () {
                var params = {
                    idplanificacionmantenimiento: _this.comboPlanificacion.getValue(),
                    fecha: _this.fechaMantenimiento.getValue(),
                    costo: _this.costo.getValue(),
                    nrofactura: _this.nroFactura.getValue(),
                    idregnumerico: _this.regNumerico.data.idregnumerico
                };
                _this.modelo.deshacerMantenimiento(params);
            },
            controlFn: function(b, _caller) {
                b.disable();
                    _caller.comboPlanificacion.fireEvent = _caller.comboPlanificacion.fireEvent.createSequence(function(e, obj) {
                        if (e == 'select' ) {
                            if(obj.record.json[obj.record.data.idplanificacionmantenimiento] == 1)
                                b.enable();
                            else b.disable();
                        }
                    });
            }
        });
        _this.panelFormulario = new LOG.util.UIManager.initPanel({
            region: 'center',
            autoHeight: true,
            frame: true,
            items: [cls1],
            bbar: ['->',this.btnDeshacer, this.btnGuardar]
        });
        _this.formulario = LOG.util.UIManager.initForm({
            items: [_this.panelFormulario],
            region: 'center'
        });
        _this.getPanelSuperior().add(_this.formulario);
        _this.getPanelSuperior().autoHeight = true;
        this.modelo.bindForm(_this.formulario);
        this.modelo.addActionButton(this.btnGuardar);
    }
});
Log.aft.rcp.ModeloPlanfMant = Ext.extend(LOG.util.Model, {
    /**
     * Lista de los productos del documento
     * @type type
     */
    constructor: function (config) {
        this.listaProductos = new LOG.util.List();
        config.urlcontroler = '/logistica/activos_fijos/recuperaciones/index.php/planificacionmantenimiento';
        config.urlAccionGuardar = 'realizarMantenimiento';
        config.urlAccionEliminar = 'deshacerMantenimiento';

        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idconfactividadsistemamedio',
            primary: true
        });
        config.fields.push({
            name: 'idplanificacionmantenimiento'
        });
        Log.aft.rcp.ModeloPlanfMant.superclass.constructor.call(this, config);
    },
    realizarMantenimiento: function (parametros, _fn, _fnFail, msgMostrar) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            //objSubmit.data = Ext.encode(objSubmit);
            Ext.Ajax.request({
                url: this.urlController + this.urlAccionGuardar,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgObjetoSalvado);
                            if (this.st) {
                                this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnFail == 'function') {
                            _fnFail.createDelegate(this, [resp]).call();
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    },
    deshacerMantenimiento: function (parametros, _fn, _fnFail, msgMostrar) {
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            //objSubmit.data = Ext.encode(objSubmit);
            Ext.Ajax.request({
                url: this.urlController + this.urlAccionEliminar,
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    this.apply(resp);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, msgMostrar || this.idioma.lbMsgObjetoSalvado);
                            if (this.st) {
                                this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnFail == 'function') {
                            _fnFail.createDelegate(this, [resp]).call();
                        }
                    }
                    this.setDefaulFormValues();
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    }

});
