Ext.ns('Ext.erp.naturalezaventas');
Ext.erp.naturalezaventas = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this = this;
        this.frame = true;
        config.autoScroll = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.naturalezaventas.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonVer({
            tooltip: _this.idioma.ttBtnImprimir,
            handler: function () {
                _this.gdProducto.getStorePrincipal().load();
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_this.dfDesde, 'fireEvent', function (e) {
                    if (_this.dfHasta.getValue()!= "" && _this.dfDesde.getValue()!= "") {
                        b.enable();
                    } else {
                        b.disable();
                    }

                }, 'FECHADESDE');
                LOG.util.UIManager.encadenaFn(_this.dfHasta, 'fireEvent', function (e) {
                    if (_this.dfDesde.getValue()!= "" && _this.dfHasta.getValue()!= "") {
                        b.enable();
                    } else {
                        b.disable();
                    }

                }, 'FECHAHASTA');
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.btnLimpiar();
                    }
                }/*,
                {
                    alt: true,
                    key: 'p',
                    fn: function () {
                        _this.getReportes(_this)

                    }
                }*/
            ]);
        /*this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idnaturalezaventas'}));*/
        this.clsCriterioBusqueda = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 4
        });
        this.fsCriterioBusqueda = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: 'Criterios',
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            region: 'north',
            items: [this.clsCriterioBusqueda]
        });
        /*this.cmbReporte = new LOG.util.LovCombo({
            fieldLabel: 'Reporte',
            url:'getReportes',
            name:'idreporteventa',
            displayField : 'denominacion',
            valueField : 'idreporteventa',
            minChars:3,
            resizable:true
        });
        this.clsCriterioBusqueda.addComponent(this.cmbReporte);*/
        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdedoc',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeNat',
            endDateField: 'hastaNat',
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastadoc',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaNat',
            startDateField: 'desdeNat',
            editable: false
        });
        this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);
        this.cmbEstructuras = new LOG.util.LovCombo({
            fieldLabel: 'Entidades',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            minChars:3,
            resizable:true,
            hidden: (!_this.grantedAction('REntidades')) ? true : false
        });
        this.comboOperaciones = new LOG.util.LovCombo({ //---combobox Tipo de producto
            fieldLabel: 'Operaciones',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'subsistema',
            editable: false,
            url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarSubsistemas',
            listeners: {
                select: function(cmb, rd) {
                    _this.idsubsistema = rd.json.idsubsistema;
                }
            }
        });
        this.clsCriterioBusqueda.addComponent(this.clsFecha);
        this.clsCriterioBusqueda.addComponent(this.cmbEstructuras);
        this.clsCriterioBusqueda.addComponent(this.comboOperaciones);
        /*this.chxDesglosar = new Ext.form.Checkbox({
            name: 'desglose',
            style: 'margin-left: 15px; margin-top:-15px',
            boxLabel: 'Desglosar por cliente',
            inputValue: 0,
            listeners: {
                check: function(e, a) {
                    
                }
            }
        });
        this.clsCriterioBusqueda.addComponent(this.chxDesglosar);*/
        this.fsCriterioBusqueda.add(this.clsCriterioBusqueda);


        /*--------------Fieldset Productos-----------------*/
        this.fsProducto = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecProducto,
            region: 'center',
            autoScroll: true,
            height: 500
        });
        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p>{facturas}</p>'
            )
        });
        this.gdProducto = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            type: 'productos',
            tltWinAdd: this.idioma.ttWinAddProductos,
            header: this.idioma.gcProducto,
            ttBtnAdd: this.idioma.ttAddProduct,
            ttBtnDel: this.idioma.ttElimProduct,
            idItem:'productonat',
            layout: 'border',
            autoScroll: true,
            bbarVisible: true,
            region: 'center',
            expander: expander,
            urlBusquedaGridPrincipal: 'cargarProductosNaturaleza'
        });


        this.gdProducto.init();
        this.fsProducto.add(this.gdProducto.view());

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2,
            layout: 'border',
            autoScroll: true,
            region: 'center'
        });

        this.clsGeneral.addComponent(this.fsCriterioBusqueda);
        this.clsGeneral.addComponent(this.fsProducto);

        this.clsGeneral.getColumn(0).columnWidth = 1;
        this.clsGeneral.getColumn(1).columnWidth = 1;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentralVentas',
            region: 'center',
            layout: 'border',
            style: '-moz-border-radius:20px',
            autoScroll: true,
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentral
        ];


        Ext.erp.naturalezaventas.superclass.constructor.call(this, config);
        _this.gdProducto.getStorePrincipal().on('beforeload', function(st) {
            st.initBaseParams.idestructura = (_this.cmbEstructuras && _this.cmbEstructuras.getValue()) ? _this.cmbEstructuras.getValue() : idEntidad;
            st.initBaseParams.desde = _this.dfDesde.getValue().format('d-m-Y');
            st.initBaseParams.hasta = _this.dfHasta.getValue().format('d-m-Y');
            st.initBaseParams.idoperacion = (_this.comboOperaciones && _this.comboOperaciones.getValue()) ? _this.comboOperaciones.getValue() : null;
        });
        this.listaBotonesVentanaToolbar.each(function(b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));

    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfDesde.setValue(null);
        _this.dfHasta.setValue(null);
        _this.dfDesde.setMaxValue(null);
        _this.dfHasta.setMinValue(null);
        _this.cmbEstructuras.reset();
        _this.comboOperaciones.reset();
        _this.gdProducto.getStorePrincipal().removeAll();
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    }

});
