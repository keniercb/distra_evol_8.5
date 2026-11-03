
Ext.ns('LOG.fac.administrar');
LOG.fac.administrar.winregistrarentrada = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    constructor: function(config) {
        this.busquedaBasica = true;
        this.gridEditable = existeInv ? false : true;
        this.autoLoad = false;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa';
        this.urlBusquedaGridPrincipal = 'cargarGridprincipal';
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = existeInv ? 3 : 1;
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.administrar.winregistrarentrada.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.administrar.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa/'
        });
        this.getVistaPrincipal().title = this.idioma.lbBtnRegistrarEntrada;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 500;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function() {
        var me = this;
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            autoExpand: true,
            dataIndex: 'text',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 100,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            width: 150,
            dataIndex: 'precio',
            default: true,
            renderer: function(v) {
                return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 150,
            dataIndex: 'cantidad',
            default: true,
            renderer: function(v) {
                if (me.gridEditable)
                    return v ? parseInt(v) : parseInt("0");
                return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idumedida'
        });
        this.addGridColumn({
            dataIndex: 'precioventa'
        });
        this.addGridColumn({
            dataIndex: 'importetotal'
        });
    },
    initDefaultButtons: function() {
        var me = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                var rdModified = existeInv ? me.getSmPrincipal().getSelections() : me.getStorePrincipal().getModifiedRecords(), _productos = [];
                Ext.each(rdModified, function(rec) {
                    rec.data.idestructura = me.idarea;
                    _productos.push(rec.data);
                });
                me.modelo.salvar({
                    datos: Ext.encode(_productos)
                }, function(r) {
                    me.getVistaPrincipal().close();
                    me._parent.getStorePrincipal().reload();
                });
            }}
        );
    },
    render: function() {
        var vista = LOG.fac.administrar.winregistrarentrada.superclass.render.call(this), me = this;
        this.getGridPrincipal().getBottomToolbar().cbPageSize.setValue(20);
        this.getStorePrincipal().load({
            params: {
                existeInv: existeInv,
                idseleccionados: Ext.encode(me.idseleccionados),
                iddeposito: me.idarea
            }
        });
        if (this.gridEditable) {
            var posCln = this.getGridPrincipal().getColumnModel().config.length - 1;
            this.getGridPrincipal().getColumnModel().setEditor(posCln, LOG.util.Prototipos.inputEntero({}));
        }
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e == 'load') {
                me.getStorePrincipal().initBaseParams.iddeposito = me.idarea;
                me.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(me.idseleccionados);
                me.getStorePrincipal().initBaseParams.existeInv = existeInv;
                if (me.getStorePrincipal().data.items.length > 0 && !me.gridEditable) {
                    me.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'afterEdit', function(e) {
            me.getVistaPrincipal().listaBotones.getItem(2).enable();
        });
        return vista;
    }
});

LOG.fac.administrar.cambiarPrecio = Ext.extend(LOG.util.Window, {
    listaBotones: undefined,
    constructor: function(config) {
        LOG.util.UIManager.apply(this, config);
        this.width = 650;
        this.height = 250;
        this.resizable = false;
        this.usarAplicar = false;
        LOG.fac.administrar.cambiarPrecio.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.administrar.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa/'
        });
    },
    initComponent: function() {
        var me = this;
        LOG.fac.administrar.cambiarPrecio.superclass.initComponent.call(this);
        this.setTitle(this.idioma.tlVentanaCambiarPrecio);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                me.modelo.salvar(
                        {
                            idproducto: me.producto.data.idproducto,
                            precioanterior: me.producto.data.precio,
                            precionuevo: me.tfPrecioNuevo.getValue(),
                            observaciones: me.txtObservaciones.getValue()
                        },
                function() {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                }
                );
            }
        });
        this.tfProducto = new LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.tfCodigoDenom,
            name: 'coddenominacion',
            editable: 'false',
            allowBlank: false,
            disabled: true
        });
        this.tfPrecioAnterior = new LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.tfPrecioAnterior,
            name: 'precioanterior',
            editable: 'false',
            allowBlank: false,
            disabled: true
        });
        this.tfPrecioNuevo = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: this.idioma.tfPrecioNuevo,
            decimalPrecision: 2,
            name: 'precionuevo',
            editable: 'false',
            allowBlank: false,
            disabled: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function(num) {
                    if (num.isDirty() && num.isValid() && num.getValue() > 0) {
                        me.listaBotones.getItem(2).enable();
                    } else {
                        me.listaBotones.getItem(2).disable();
                    }
                }
            }
        });
        this.txtObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.tfObservaciones,
            name: 'observaciones',
            anchor: '100%'
        });
        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        clsSuperior.addComponent(this.tfProducto);
        clsSuperior.addComponent(this.tfPrecioAnterior);
        clsSuperior.addComponent(this.tfPrecioNuevo);
        var fsProducto = new Ext.form.FieldSet({
            items: [clsSuperior]
        });
        this.frmCambiarPrecio = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [fsProducto, this.txtObservaciones]
        });
        this.add(this.frmCambiarPrecio);
        this.filloutFrm();
    },
    filloutFrm: function() {
        this.frmCambiarPrecio.getForm().loadRecord(
                new Ext.data.Record({
                    coddenominacion: this.producto.data.text,
                    precioanterior: parseFloat(this.producto.data.precio).toFixed(2)
                })
                );
    }
});

LOG.fac.administrar.regDevolucion = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    constructor: function(config) {
        this.autoLoad = false;
        this.gridEditable = true;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa';
        this.urlBusquedaGridPrincipal = 'cargaProductosVendidos';
        this.formaVisualizacion = 'ventana';
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacion;
        LOG.fac.administrar.regDevolucion.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.administrar.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/administrarpuntoventa/'
        });
        this.getVistaPrincipal().width = 900;
        this.getVistaPrincipal().height = 500;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().title = this.idioma.lbBtnDevolucion;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.tfCodigoDenom,
            width: 200,
            dataIndex: 'text',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadVendida,
            width: 150,
            dataIndex: 'cantidadvendida',
            default: true,
            renderer: function(v) {
                if (v)
                    return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 150,
            dataIndex: 'importe',
            default: true,
            renderer: function(v, m, rd) {
                var importe = parseFloat(rd.data.precio).toFixed(2) * parseFloat(rd.data.cantidadvendida).toFixed(2);
                return parseFloat(importe).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCantidadDevolver,
            width: 150,
            dataIndex: 'cantidaddevolver',
            default: true,
            editor: LOG.util.Prototipos.inputEntero({}),
            renderer: function(v, m, rd) {
                if (v)
                    return (v <= rd.data.cantidadvendida) ? parseFloat(v).toFixed(2) : parseFloat(0).toFixed(2);
                return parseFloat(0).toFixed(2);
            }
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'precio'
        });
        this.addGridColumn({
            dataIndex: 'recargo'
        });
        this.addGridColumn({
            dataIndex: 'descuento'
        });
    },
    init: function() {
        LOG.fac.administrar.regDevolucion.superclass.init.call(this);
        var me = this;
        this.txtDevolucion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbMotivoDevolucion,
            name: 'motivodevolucion',
            allowBlank: false,
            maxLength: 255,
            minLength: 2,
            minLengthText: this.idioma.ttLongitudMinima,
            anchor: '100%',
            maxRe: LOG.util.Regex.cadena,
            regex: LOG.util.Regex.cadena
        });
        this.frmRegistarDevolucion = LOG.util.UIManager.initForm({
            frame: true,
            region: 'north',
            labelAlign: 'top',
            height: 100
        });
        this.frmRegistarDevolucion.add(this.txtDevolucion);
        this.getVistaPrincipal().onRender = this.getVistaPrincipal().onRender.createSequence(function() {
            me.getVistaPrincipal().add(me.frmRegistarDevolucion);
        });
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            text: this.idioma.lbBtnAceptar,
            tooltip: this.idioma.ttBtnAceptar,
            disabled: true,
            iconCls: 'aceptar',
            key: {
                key: 13
            },
            handler: function() {
                var params = me.getDataGeneral();
                if (params && me.frmRegistarDevolucion.getForm().isValid()) {
                    me.modelo.devolucion(
                            params,
                            function() {
                                me.devolucion = {};
                                me.getVistaPrincipal().close();
                                me._parent.getStorePrincipal().reload();
                            }
                    );
                }
            }
        });
        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: this.idioma.tlListadoProductos
        });
    },
    render: function() {
        var p = LOG.fac.administrar.regDevolucion.superclass.render.call(this), me = this;
        var params = {
            idventas: this._parent.getSmPrincipal().getSelected().data.idventas
        };
        if (existeInv === 0) {
            params.prodareas = 1;
        }
        this.getStorePrincipal().load({
            params: params
        });
        LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function(e, rd) {
            if (e == 'afteredit'
                    && rd.record.get('cantidadvendida') >= rd.record.get('cantidaddevolver')
                    && rd.record.get('cantidaddevolver') > 0) {
                me.getVistaPrincipal().listaBotones.getItem(2).enable();
            }
        });
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e, rd) {
            if (e == 'beforeload') {
                this.initBaseParams.idventas = this._parent.getSmPrincipal().getSelected().data.idventas;
                this.baseParams.idventas = this._parent.getSmPrincipal().getSelected().data.idventas;
                if (existeInv === 0) {
                    this.initBaseParams.prodareas = 1;
                    this.baseParams.prodareas = 1;
                }
            }
        });
        return p;
    },
    getDataGeneral: function() {
        var products = this.getStorePrincipal().getModifiedRecords(),
                prodDevueltos = [], efectivodevuelto = 0;
        this.devolucion = {
            motivodevolucion: this.txtDevolucion.getValue(),
            idventas: this._parent.getSmPrincipal().getSelected().data.idventas
        };
        for (var i = 0; i < products.length; i++) {
            var prod = products[i].data;
            var importetotal = parseFloat(prod.precio).toFixed(2) * parseFloat(prod.cantidadvendida).toFixed(2);
            if (prod.cantidadvendida >= prod.cantidaddevolver && prod.cantidaddevolver > 0) {
                efectivodevuelto = parseFloat(efectivodevuelto) + (parseFloat(prod.cantidaddevolver) * parseFloat(prod.precio))
                prodDevueltos.push({
                    idproducto: prod.idproducto,
                    cantidadcomprada: parseFloat(prod.cantidadvendida).toFixed(2),
                    precioventa: parseFloat(prod.precio).toFixed(2),
                    recargo: parseFloat(prod.recargo).toFixed(2),
                    descuento: parseFloat(prod.descuento).toFixed(2),
                    importe: parseFloat(importetotal).toFixed(2),
                    cantidaddevolver: parseFloat(prod.cantidaddevolver).toFixed(2)
                });
            }
        }
        this.devolucion.productos = Ext.encode(prodDevueltos);
        this.devolucion.totalefectdevuelto = efectivodevuelto;
        return (prodDevueltos.length > 0) ? this.devolucion : false;
    }
});