Ext.ns('Ext.erp.precioventa');
Ext.erp.precioventa = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this = this;
        this.frame = true;
        config.autoScroll = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.precioventa.Idioma);
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
                b.enable();
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
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
        this.clsCriterioBusquedaPV = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 5
        });
        this.fsCriterioBusquedaPV = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: 'Criterios',
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            region: 'north',
            items: [this.clsCriterioBusquedaPV]
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
        this.clsCriterioBusquedaPV.addComponent(this.cmbReporte);*/

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
        this.comboDepositos = new LOG.util.ComboBox({//---combobox Tipo de producto
            fieldLabel: _this.idioma.cbDepositos,
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            resizable: true,
        });
        this.cmbTipoPrecio = new Ext.erp.comboNomenclador({
            fieldLabel: 'Tipo de precio',
            controller: /*(todos || tipo) ? */'/logistica/utiles/nomencladores/index.php/nomencladores/' /*: '/logistica/utiles/nomencladores/index.php/nomencladores/'*/,
            modelo: 'NomTipoprecio',
            idnom: 'idtipoprecio',
            name: 'denominacion',
            anchor: '50%',
            editable: false,
            triggerAction: 'all'
        });
        this.cmbTipoPrecio.getStore().load();
        this.comboMoneda = new LOG.util.ComboBox({
            fieldLabel: 'Moneda',
            tpl: '<tpl for="."><div ext:qtip="{nombremoneda}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargarTipoMonedas'
        });
        this.cmbSector = new LOG.util.ComboBox({
            fieldLabel: 'Sector',
            autoLoad: true,
            url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargarSector',
            hiddenName: 'idsector',
            valueField: 'idsector',
            displayField: 'denominacion',
            //loadingText: this.idioma.msgCargandoDatos,
            triggerAction: 'all',
            enableQtip: true
        });
        this.clsCriterioBusquedaPV.addComponent(this.cmbEstructuras);
        this.clsCriterioBusquedaPV.addComponent(this.comboDepositos);
        this.clsCriterioBusquedaPV.addComponent(this.cmbTipoPrecio);
        this.clsCriterioBusquedaPV.addComponent(this.comboMoneda);
        this.clsCriterioBusquedaPV.addComponent(this.cmbSector);
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
        this.clsCriterioBusquedaPV.addComponent(this.chxDesglosar);*/
        this.fsCriterioBusquedaPV.add(this.clsCriterioBusquedaPV);


        /*--------------Fieldset Productos-----------------*/
        this.fsProducto = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecProducto,
            region: 'center',
            autoScroll: true,
            height: 500
        });
        this.gdProducto = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            type: 'productospv',
            tltWinAdd: this.idioma.ttWinAddProductos,
            header: this.idioma.gcProducto,
            ttBtnAdd: this.idioma.ttAddProduct,
            ttBtnDel: this.idioma.ttElimProduct,
            idItem:'productopv',
            layout: 'border',
            autoScroll: true,
            bbarVisible: true,
            region: 'center',
            urlBusquedaGridPrincipal: 'cargarProductosPrecios'
        });


        this.gdProducto.init();
        this.fsProducto.add(this.gdProducto.view());

        this.clsGeneralPV = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2,
            layout: 'border',
            autoScroll: true,
            region: 'center'
        });

        this.clsGeneralPV.addComponent(this.fsCriterioBusquedaPV);
        this.clsGeneralPV.addComponent(this.fsProducto);

        this.clsGeneralPV.getColumn(0).columnWidth = 1;
        this.clsGeneralPV.getColumn(1).columnWidth = 1;
        this.clsGeneralPV.anchor = '101.3%';

        this.fpCentralPV = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentralVentas',
            region: 'center',
            layout: 'border',
            style: '-moz-border-radius:20px',
            autoScroll: true,
            items: [this.clsGeneralPV]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentralPV
        ];


        Ext.erp.precioventa.superclass.constructor.call(this, config);
        _this.gdProducto.getStorePrincipal().on('beforeload', function(st) {
            st.initBaseParams.idtipoprecio = (_this.cmbTipoPrecio && _this.cmbTipoPrecio.getValue()) ? _this.cmbTipoPrecio.getValue() : -1;
            st.initBaseParams.iddeposito = (_this.comboDepositos && _this.comboDepositos.getValue()) ? _this.comboDepositos.getValue() : -1;
            st.initBaseParams.idmoneda = (_this.comboMoneda && _this.comboMoneda.getValue()) ? _this.comboMoneda.getValue() : null;
            st.initBaseParams.idsector = (_this.cmbSector && _this.cmbSector.getValue()) ? _this.cmbSector.getValue() : null;
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
        _this.cmbEstructuras.reset();
        _this.cmbTipoPrecio.reset();
        _this.comboDepositos.reset();
        _this.comboMoneda.reset();
        _this.cmbSector.reset();
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
    },
    getReportes: function (_this) {
        var _this = this;
        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/PreciosVenta',
                    isList: true,
                    name: 'PreciosVenta',
                    params: {
                        idtipoprecio: (_this.cmbTipoPrecio && _this.cmbTipoPrecio.getValue()) ? _this.cmbTipoPrecio.getValue() : -1,
                        iddeposito: (_this.comboDepositos && _this.comboDepositos.getValue()) ? _this.comboDepositos.getValue() : -1,
                        idmoneda:(_this.comboMoneda && _this.comboMoneda.getValue()) ? _this.comboMoneda.getValue() : null,
                        idsector: (_this.cmbSector && _this.cmbSector.getValue()) ? _this.cmbSector.getValue() : null,
                        idestructura: idEntidad
                    }

                }
            ]
        });
        this.tipoReportes.view();
    }

});
