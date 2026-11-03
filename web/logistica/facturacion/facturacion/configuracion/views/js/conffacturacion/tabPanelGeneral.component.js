/**
 * Esta clase gestiona la configuracion de Facturacion
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
Ext.ns('Ext.erp');
Ext.erp.conffacturacion = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    constructor: function(config) {
        var _this = this;
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this.idioma = config.idioma;
        config.frame = true;
        config.layout = 'border';
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({
            text: _this.idioma.btnAyuda,
            tooltip: _this.idioma.toolAyuda,
            id: 'ayudaConfFacturacion'
        }));// de los botones Guardar y Ayuda
        config.items = this.getItems();
        config.buttons = this.getButtons();
        config.listeners = {
            show: function() {
                this.getConfigurationByEntity();
            }
        };
        _this.keyNav = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "gG", // or 
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    _this.createDataToSend();
                }
            },
            {
                key: "hH", // or 
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    alert('help');
                }
            }
        ]);
        Ext.erp.conffacturacion.superclass.constructor.call(this, config);
    },
    addToolbarButtonPanel: function(b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addButtonPanel: function(b, f) {
        this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
    },
    getItems: function() {
        this.panelBotones = LOG.util.UIManager.initPanel({
            region: 'north',
            tbar: ['->', this.listaBotonesVentanaToolbar.getArray()]
        });
	
	var items = [];
	if (melfi == true){
		items =	[
                //this.getTabPanelGeneral(),
                this.getPanelDesglosePrecio(),
                this.getPanelClienteTipoPrecio(),
                //this.getPanelMatrizPrecio(),
                this.getPanelMatrizTarifa()
            ];
	}else{
		items =	[
                this.getTabPanelGeneral(),
                this.getPanelDesglosePrecio(),
                this.getPanelClienteTipoPrecio(),
                this.getPanelClienteMoneda(),
                this.getPanelNaturaleza(),
                this.getPanelSectorNaturaleza(),
                //this.getPanelVendedor(),
                this.getPanelMatrizPrecio(),
                this.getPanelMatrizTarifa()
            ];
	}

        this.tbConfFactura = new Ext.TabPanel({
            activeTab: 0,
            region: 'center',
            border: false,
            items: items
        });
        return [this.panelBotones, this.tbConfFactura];
    },
    createCmbTipoPrecio: function(todos = false, tipo=false) {
        var _this = this;
        this.cmbTipoPrecio = new Ext.erp.comboNomenclador({
            controller: /*(todos || tipo) ? */this.idioma.urlConffacturacion /*: '/logistica/utiles/nomencladores/index.php/nomencladores/'*/,
            modelo: 'NomTipoprecio',
            idnom: 'idtipoprecio',
            name: 'denominacion',
            anchor: '50%',
            allowBlank: false,
            editable: false,
            emptyText: this.idioma.cmbSeleccione,
            fieldLabel: this.idioma.cbTipoPrecio,
            triggerAction: 'all'
        });
        if (tipo) {
            this.cmbTipoPrecio.getStore().load({params:{tipo:tipo,nomenclador: (todos) ? null : 1}});
        } else {
            this.cmbTipoPrecio.getStore().load({params:{nomenclador: (todos) ? null : 1}});
        }
        return this.cmbTipoPrecio;
    },
    createCmbCliente: function(etiqueta = this.idioma.lbCliente) {
        this.cmbCliente = new LOG.util.ComboBox({
            fieldLabel: etiqueta,
            anchor: '50%',
            autoLoad: false,
            allowBlank: false,
            url: this.idioma.urlConffacturacion + 'cargarClientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            loadingText: this.idioma.msgCargandoDatos,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 20,
            minChars: 0,
            mode: 'remote'
        });
        return this.cmbCliente;
    },
    createCmbPuerto: function(etiqueta) {
        var cmbPuerto = new LOG.util.ComboBox({
            fieldLabel: etiqueta,
            anchor: '50%',
            //autoLoad: false,
            allowBlank: false,
            url: this.idioma.urlConffacturacion + 'getPuertos',
            valueField: 'idestructuraop',
            displayField: 'denominacion',
            loadingText: this.idioma.msgCargandoDatos,
            triggerAction: 'all',
            enableQtip: true,
            /*pageSize: 20,
            minChars: 0,
            mode: 'remote'*/
        });
        return cmbPuerto;
    },
    createRelacionadorClienteprecio: function() {
        var _this = this;
        this.arrayDer = [], this.arrayIzq = [];
        var me = this, newcolumstoreder = [
                {
                    name: 'idclientetipoprecio'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'new'
                }
            ],
            newcolumstoreizq = [
                {
                    name: 'idclientetipoprecio'
                }, {
                    name: 'new'
                }
            ];
        this.relacionadorCP = new Ext.erp.relacionador({
            //height: 400,
            buscar: true,
            conceptoBusqueda: 'Denominaci\xf3n',
            pageSize: 30,
            defaultController: this.idioma.urlConffacturacion,
            //modeloIzq: 'NomTipoprecio',
            idIzq: 'idclientesproveedores',
            region: 'center',
            valorCampo: 0,
            storeFieldsDer: newcolumstoreder,
            storeFieldsIzq: newcolumstoreizq,
            campoIdNomenclador: 'idtipoprecio',
            //modeloDer: 'DatTipoprecioentidad',
            idDer: 'idclientesproveedores',
            tituloIzq: this.idioma.titleTipoPrecioSelect,
            tituloDer: this.idioma.titleTipoPrecioAsocioado,
            todosFn:'pasarTodos',
            createToolBarIzq: function(_parent) {
                _parent.cmbSectorIzq = new LOG.util.ComboBox({
                    fieldLabel: 'Sector',
                    autoLoad: true,
                    url: _this.idioma.urlConffacturacion + 'cargarSector',
                    hiddenName: 'idsector',
                    valueField: 'idsector',
                    displayField: 'denominacion',
                    //loadingText: this.idioma.msgCargandoDatos,
                    triggerAction: 'all',
                    enableQtip: true
                });
                _parent.textBuscarIzq = LOG.util.Prototipos.inputTexto({
                    enableKeyEvents: true,
                    emptyText: (_parent.conceptoBusqueda) ? _parent.conceptoBusqueda : ''
                });
                return new Ext.Toolbar({
                    items:[
                        new Ext.form.Label({text: 'Sector:'}),
                        '&nbsp',
                        _parent.cmbSectorIzq,
                        '-',
                        _parent.textBuscarIzq,
                        '-',
                        LOG.util.Prototipos.botonBuscar({
                            handler: function(){
                                _parent.stGridIzquierdo.load()
                            }
                        }),
                        '-',
                        LOG.util.Prototipos.botonLimpiar({
                            handler:function(){
                                _parent.textBuscarIzq.reset();
                                _parent.cmbSectorIzq.reset();
                                _parent.stGridIzquierdo.reload();
                            }
                        })
                    ]
                });
            },
            createToolBarDer: function(_parent) {
                _parent.cmbSectorDer = new LOG.util.ComboBox({
                    fieldLabel: 'Sector',
                    autoLoad: true,
                    url: _this.idioma.urlConffacturacion + 'cargarSector',
                    hiddenName: 'idsector',
                    valueField: 'idsector',
                    displayField: 'denominacion',
                    //loadingText: this.idioma.msgCargandoDatos,
                    triggerAction: 'all',
                    enableQtip: true
                });
                _parent.textBuscarDer = LOG.util.Prototipos.inputTexto({
                    enableKeyEvents: true,
                    emptyText: (_parent.conceptoBusqueda) ? _parent.conceptoBusqueda : ''
                });
                return new Ext.Toolbar({
                    items:[
                        new Ext.form.Label({text: 'Sector:'}),
                        '&nbsp',
                        _parent.cmbSectorDer,
                        '-',
                        _parent.textBuscarDer,
                        '-',
                        LOG.util.Prototipos.botonBuscar({
                            handler: function(){
                                _parent.stGridDerecho.load()
                            }
                        }),
                        '-',
                        LOG.util.Prototipos.botonLimpiar({
                            handler:function(){
                                _parent.textBuscarDer.reset();
                                _parent.cmbSectorDer.reset();
                                _parent.stGridDerecho.reload();
                            }
                        })
                    ]
                });
            },
            onStIzqBeforeLoad: function() {
                var _t = this;
                var baseParams = {
                    modelo: _t.modeloIzq,
                    idnom: _t.idIzq,
                    bussines: _t.bussinesModelIzq,
                    adicionados: _t.adicionados.length > 0 ? _t.adicionados.join(',') : '',
                    filtroOr: _t.eliminados.length > 0 ? _t.eliminados.join(',') : '',
                    grid: 'izq',
                    filtroBq: (_t.buscar) ? _t.textBuscarIzq.getValue() : null,
                    idsector: _t.cmbSectorIzq.getValue() || null
                };

                var filtro = new Array();
                baseParams.filtro = Ext.encode(filtro);
                if (_t.valorCampo > 0) {
                    var obj = {
                        signo: 'not in,select',
                        modelo: _t.modeloDer
                    };
                    obj[_t.campoIdNomenclador] = _t.valorCampo;
                    filtro.push(obj);
                    baseParams.filtro = Ext.encode(filtro);
                }

                return baseParams;
            },
            onStDerBeforeLoad: function() {
                var _t = this;
                var baseParams = {
                    modelo: _t.modeloIzq,
                    idnom: _t.idIzq,
                    bussines: _t.bussinesModelDer,
                    join: 'm.' + _t.modeloDer + ' t',
                    eliminados: _t.eliminados.length > 0 ? _t.eliminados.join(',') : '',
                    filtroOr: _t.adicionados.length > 0 ? _t.adicionados.join(',') : '',
                    grid: 'der',
                    filtroBq: (_t.buscar) ? _t.textBuscarDer.getValue() : null,
                    idsector: _t.cmbSectorDer.getValue() || null
                };
                var filtro = new Array();

                if (_this.valorCampo > 0) {
                    var obj = {
                        signo: '= ?'
                    };
                    obj[_t.idDer] = _t.valorCampo;
                    filtro.push(obj);
                    baseParams.filtro = Ext.encode(filtro);
                } else {
                    var obj = {
                        signo: '= ?'
                    };
                    obj[_t.idDer] = -1;
                    filtro.push(obj);
                    baseParams.filtro = Ext.encode(filtro);
                }
                return baseParams;
            }
        });
        //this.relacionadorCP.gridIzquierdo.getBottomToolbar().hide();
        //this.relacionadorCP.gridDerecho.getBottomToolbar().hide();
        this.relacionadorCP.gridDerecho.getStore().addListener('load', function (st, rd) {
            me.relacionadorCP.adicionados.length = 0;
        });
        this.relacionadorCP.gridIzquierdo.getStore().addListener('load', function (st, rd) {
            me.relacionadorCP.eliminados.length = 0;
        });
        //this.relacionadorCP.height = 400;
        this.relacionadorCP.panelOperaciones.bodyStyle = 'margin:50px 4px';
        return this.relacionadorCP;
    },
    createCmbCuentaActiva: function() {
        return new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomClasificacioncontablelog',
            idnom: 'idclasificacioncontable',
            name: 'denominacion',
            bussines: 'NomClasificacioncontableFactModel',
            autoCargar: true,
            //allowBlank: false
        });
    },
    createRelacionador: function() {
        this.arrayDer = [], this.arrayIzq = [];
        var me = this, newcolumstoreder = [
            {
                name: 'idcuentadesgloseprecio'
            }, {
                name: 'descripcion'
            }, {
                name: 'porciento'
            }, {
                name: 'idcuenta'
            }, {
                name: 'new'
            }
        ],
                newcolumstoreizq = [
                    {
                        name: 'idcuentadesgloseprecio'
                    }, {
                        name: 'new'
                    }, {
                        name: 'porciento'
                    }
                ],
                newcolumnas = [
                    {
                        header: this.idioma.headerCuenta,
                        dataIndex: 'descripcion',
                        editable: true,
                        width: 150,
                        editor: this.createCmbCuentaActiva(),
                        renderer: function(v, m, rd) {
                            var cuentas = this.editor.getStore().data.items;
                            if (v) {
                                if (this.editor.isDirty()) {
                                    for (var i = 0; i < cuentas.length; i++) {
                                        if (cuentas[i].data.idclasificacioncontable == this.editor.getValue()) {
                                            rd.set('idcuenta', this.editor.getValue());
                                            return cuentas[i].data.denominacion;
                                        }
                                    }
                                }
                            }
                            for (var i = 0; i < cuentas.length; i++) {
                                if (cuentas[i].data.idclasificacioncontable == rd.data.idcuenta) {
                                    return cuentas[i].data.denominacion;
                                }
                            }
                            return '';
                        }
                    }
                ];
        ;
        this.relacionador = new Ext.erp.relacionador({
            height: 400,
            defaultController: this.idioma.urlConffacturacion,
            modeloIzq: 'NomCategoriaprecio',
            idIzq: 'idcategoriaprecio',
            valorCampo: 0,
            columnsFieldsDer: newcolumnas,
            storeFieldsDer: newcolumstoreder,
            storeFieldsIzq: newcolumstoreizq,
            campoIdNomenclador: 'idcategoriaprecio',
            modeloDer: 'DatCategoriaprecioentidad',
            idDer: 'idcategoriaprecio',
            tituloIzq: this.idioma.titleDesgPrecioSelect,
            tituloDer: this.idioma.titleDesgPrecioAsocioado
        });
        this.relacionador.gridDerecho.getStore().addListener('load', function(st, rd) {
            me.relacionador.adicionados.length = 0;
        });
        this.relacionador.gridIzquierdo.getStore().addListener('load', function(st, rd) {
            me.relacionador.eliminados.length = 0;
        });
        this.relacionador.height = 400;
        return this.relacionador;
    },
    getPanelPrincipal: function() {
        var _this = this;
        this.pGeneral = new Fact.conf.pGeneral({
            title: this.idioma.tbPanelPrincipal,
            parentCmp: this,
            idconfiguracion: this.idconfiguracion,
            idioma: this.idioma,
            disabled: (_this.grantedAction('RPRINCIPAL') || _this.grantedAction('CT')) ? false : true
        });
        return this.pGeneral;
    },
    getPanelRangosFacturasManuales: function() {
        var _this = this;
        this.pRangosFacturasManuales = new Fact.conf.pRangosFacturasManuales({
            title: this.idioma.tbPanelRangosFacturasManuales,
            parentCmp: this,
            idconfiguracion: this.idconfiguracion,
            idioma: this.idioma
        });
        return this.pRangosFacturasManuales;
    },
    getPanelSerieDocumento: function() {
        var _this = this;
        this.pSerieDocumento = new Fact.conf.pSerieDocumento({
            parentCmp: this,
            idconfiguracion: this.idconfiguracion,
            idioma: this.idioma
        });
        this.pSerieDocumento.init();
        this.pSerieDocumento.getVistaPrincipal().setTitle(this.idioma.tbPanelSerieDocumento);
        this.pSerieDocumento.getVistaPrincipal().disable();
        return this.pSerieDocumento.view();
    },
    getPanelReporteVentas: function() {
        var _this = this;
        this.pReporteVentas = new Fact.conf.ReporteVentas({
            title: 'Reporte ventas',
            parentCmp: this,
            idconfiguracion: this.idconfiguracion,
            idioma: this.idioma,
            disabled: (_this.grantedAction('RVENTAS') || _this.grantedAction('CT')) ? false : true
        });
        //this.pReporteVentas.getVistaPrincipal().setTitle('Reporte ventas');
        return this.pReporteVentas;
    },
    getPanelOperaciones: function() {
        var _this = this;
        this.pOperaciones = new Fact.conf.pOperaciones({
            parentCmp: this,
            idconfiguracion: this.idconfiguracion,
            idioma: this.idioma
        });
        this.pOperaciones.init();
        this.pOperaciones.getVistaPrincipal().setTitle(this.idioma.tbPanelOperaciones);
        if (_this.grantedAction('ROPERACIONES') || _this.grantedAction('CT')) {
            this.pOperaciones.getVistaPrincipal().enable();
        } else {
            this.pOperaciones.getVistaPrincipal().disable();
        }
        return this.pOperaciones.view();
    },
    getPanelPagoElectronico: function() {
        var _this = this;
        this.pPagoElectronico = new Fact.conf.pPagoElectronico({
            parentCmp: this,
            idconfiguracion: this.idconfiguracion,
            idioma: this.idioma
        });
        this.pPagoElectronico.init();
        this.pPagoElectronico.getVistaPrincipal().setTitle('Pago electr\xf3nico');
        this.pPagoElectronico.getVistaPrincipal().id = 'pagoelectronico';
        if (_this.grantedAction('RPAGOELECTRONICO')) {
            this.pPagoElectronico.getVistaPrincipal().enable();
        } else {
            this.pPagoElectronico.getVistaPrincipal().disable();
        }
        return this.pPagoElectronico.view();
    },
    getTabPanelGeneral: function() {
        var me = this;
        this.tpGeneral = new Ext.TabPanel({
            title: this.idioma.tbPanelG,
            activeTab: 0,
            name: 'tabPanelGeneral',
            region: 'center',
            border: false,
            items: [
                this.getPanelPrincipal(),
                this.getPanelOperaciones(),
                this.getPanelVendedor(),
                this.getPanelSerieDocumento(),
                //this.getPanelRangosFacturasGeneradas(),
                this.getPanelReporteVentas(),
                this.getPanelPagoElectronico()
            ],
            listeners: {
                tabchange: function(tb, p) {
                    if (p.title === me.idioma.tbPanelSerieDocumento) {
                        me.pSerieDocumento.getStorePrincipal().load();
                    }
                }
            }
        });
        return this.tpGeneral;
    },
    getPanelDesglosePrecio: function() {
        var _this = this;
        this.pDesglosePrecio = new Fact.conf.pDesglosePrecio({
            title: this.idioma.titlePanelCuentasPrecios,
            cmbTipoPrecio: this.createCmbTipoPrecio(),
            idioma: this.idioma,
            relacionador: this.createRelacionador(),
            disabled: (_this.grantedAction('RDESGLOSEPRECIO') || _this.grantedAction('CT')) ? false : true
        });
        return this.pDesglosePrecio;
    },
    getPanelClienteTipoPrecio: function() {
        var _this = this;
        this.pClienteTipoPrecio = new Fact.conf.pClienteTipoPrecio({
            idioma: this.idioma,
            frame: true,
            layout: 'border',
            //cmbCliente: this.createCmbCliente(),
            cmbTipoprecio: this.createCmbTipoPrecio(),
            title: this.idioma.titleClienteTipoPrecio,
            relacionador: this.createRelacionadorClienteprecio(),
            disabled: (_this.grantedAction('RCLIENTEPRECIO') || _this.grantedAction('CT')) ? false : true
        });
        return this.pClienteTipoPrecio;
    },
    getPanelClienteMoneda: function() {
        var _this = this;
        this.panelMonedas = new Fact.conf.pClienteMoneda({
            idioma: this.idioma,
            cmbTipoPrecio: this.createCmbTipoPrecio(true),
            title: this.idioma.titleClienteMoneda,
            layout: 'border',
            name: 'panelMonedas',
            disabled: (_this.grantedAction('RCLIENTEMONEDA') || _this.grantedAction('CT')) ? false : true
        });
        return this.panelMonedas;
    },
    getPanelNaturaleza: function() {
        var _this = this;
        this.panelNaturalezamedia = new Fact.conf.pNaturalezaMedia({
            idioma: this.idioma,
            cmbTipoPrecio: this.createCmbTipoPrecio(true),
            title: 'Naturaleza tasa',
            layout: 'border',
            name: 'panelNaturalezamedia',
            disabled: (_this.grantedAction('RCLIENTEMONEDA') || _this.grantedAction('CT')) ? false : true
        });
        return this.panelNaturalezamedia;
    },
    getPanelSectorNaturaleza: function() {
        var _this = this;
        this.panelSectormedia = new Fact.conf.pNaturalezaSectorMedia({
            idioma: this.idioma,
            cmbTipoPrecio: this.createCmbTipoPrecio(true),
            title: 'Sector tasa',
            layout: 'border',
            name: 'panelSectormedia',
            disabled: (_this.grantedAction('RCLIENTEMONEDA') || _this.grantedAction('CT')) ? false : true
        });
        return this.panelSectormedia;
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
    getPanelVendedor: function() {
        this.panelVendedor = new Fact.conf.pVendedor({
            idioma: this.idioma,
            title: 'Vendedores',
            layout: 'border',
            name: 'panelVendedor',
        });
        this.panelVendedor.disable();
        return this.panelVendedor;
    },
    getPanelMatrizPrecio: function() {
        var _this = this;
        this.pMatrizPrecio = new Fact.conf.pMatriz({
            idioma: this.idioma,
            ttBtnBuscar: this.idioma.ttBtnBuscarMatrizPrecio,
            textBusquedaSimple: this.idioma.ttMatrizPrecio,
            cmbTipoPrecio: this.createCmbTipoPrecio(false, 1),
            layout: 'border',
            frame: true,
            servicio: false,
            name: 'panelMatrizPrecio',
            title: this.idioma.titleMatrizPrecio,
            copiarTodos: true,
            borrarTodos: true,
            actualizarPrecios: true,
            disabled: (_this.grantedAction('RMATRIZPRECIO') || _this.grantedAction('CT')) ? false : true
        });
        return this.pMatrizPrecio;
    },
    getPanelMatrizTarifa: function() {
        var _this = this;
    	var config = {
            idioma: this.idioma,
            ttBtnBuscar: this.idioma.ttBtnBuscarMatrizTarifa,
            textBusquedaSimple: this.idioma.ttMatrizTarifa,
            cmbTipoPrecio: this.createCmbTipoPrecio(false, 2),
            layout: 'border',
            frame: true,
            servicio: true,
            name: 'panelMatrizTarifa',
            title: this.idioma.titleMatrizTarifa,
            copiarTodos: true,
            borrarTodos: true,
            disabled: (_this.grantedAction('RMATRIZTARIFA') || _this.grantedAction('CT')) ? false : true
        }
        if(melfi == true){
            config.cmbOrigen = this.createCmbPuerto('Origen');
                config.cmbDestino = this.createCmbPuerto('Destino');
                config.dfVigencia =  new Ext.form.DateField({
                    fieldLabel: 'Fecha vigencia',
                    name: 'fechavigencia',
                    format: 'd/m/Y',
                    allowBlank: false
                });
        }
        this.pMatrizTarifa = new Fact.conf.pMatriz(config);
        return this.pMatrizTarifa;
    },
    getTbar: function() {
        var btnAyuda = new LOG.util.Prototipos.botonAyuda({
            config: this.idioma
        });
        return ['->', btnAyuda];
    },
    getButtons: function() {
        var me = this;
        this.btnSalvar = new LOG.util.Prototipos.botonGuardar({
            text: this.idioma.btnAceptarTD,
            tooltip: this.idioma.toolAceptarTD  + '</br>' + '(<b>Alt+G</b>)',
            handler: function() {
                me.createDataToSend();
            }
        });
        return [this.btnSalvar];
    },
    getConfigurationByEntity: function() {
        var me = this;
        if(this.pGeneral){
            Ext.getBody().mask(me.idioma.msgCargandoDatos, 'x-mask-loading');
            this.pGeneral.frmGeneral.getForm().load({
                url: this.idioma.urlConffacturacion + 'cargarConfiguracion',
                method: 'post',
                success: function(frm, action) {
                    var configuration = action.result.datos;
                    me.loadAllData(frm, configuration);
                    Ext.getBody().unmask();
                },
                failure: function(frm, action) {
                    var configuration = action.result.datos;
                    me.loadAllData(frm, configuration);
                    Ext.getBody().unmask();
                }
            });
        }
    },
    loadAllData: function(frm, configuration) {
        //---Tab General----
        var data = {}, me = this;
        if (configuration) {
            this.idconfiguracion = configuration.idestructuracomun;
            //data.tipofactura = configuration.tipofactura;
            if ((configuration.pagoanticipado == 1)) {
                data.pagoanticipado = true;
            }
            if ((configuration.entregarrealordenado == 1)) {
                data.entregarrealordenado = true;
            }
            if ((configuration.utilizarserie == 1)) {
                data.utilizarserie = true;
            }
            if ((configuration.utilizarvendedor == 1)) {
                data.utilizarvendedor = true;
            }
            if ((configuration.preciocentral == 1)) {
                data.preciocentral = true;
            }
            if ((configuration.completardistribucion == 1)) {
                data.completardistribucion = true;
            }
            if ((configuration.utilizarformapago == 1)) {
                data.utilizarformapago = true;
            }
            if ((configuration.utilizarbeneficiario == 1)) {
                data.utilizarbeneficiario = true;
            }
            if ((configuration.utilizarnumeroref == 1)) {
                data.utilizarnumeroref = true;
            }
            if ((configuration.utilizarfirma == 1)) {
                data.utilizarfirma = true;
            }
            if ((configuration.facturasistema == 1)) {
                data.facturasistema = true;
            }
            if ((configuration.comprobanteoperacion == 1)) {
                data.comprobanteoperacion = true;
            }
            if (!!configuration.idtipotasa) {
                this.idtipotasa = configuration.idtipotasa;
                data.idtipotasa = configuration.idtipotasa;
            }
            if (!!configuration.idcuenta) {
                this.pGeneral.idcuentabancaria = configuration.idcuenta;
                //data.idcuentabancaria = configuration.idcuenta;
            }
            this.pGeneral.cmbCBS.getStore().load();
            if (!!configuration.idpadrematriz) {
                this.pGeneral.idpadrematriz = configuration.idpadrematriz;
                //data.idcuentabancaria = configuration.idcuenta;
            }
            this.pGeneral.cmbEstructuras.getStore().load();
            if (configuration.permitirfactura == 1) {
                /*this.pGeneral.fsPermitirFactPend.toggleCollapse();
                data.facturaspendientes = configuration.facturaspendientes;
                data.diashabiles = configuration.diashabiles;*/
//                if (configuration.cobrorecargo == 1) {
//                    this.pGeneral.fsCobroRecargo.toggleCollapse();
//                    this.pGeneral.gRecargos.getStore().load();
//                }
            }
            if(this.pGeneral){
                if (configuration.permitirnumerocontrol == 1) {
                    //this.pGeneral.fsNumeroControl.toggleCollapse();
                    this.pGeneral.chxAnular.setValue((configuration.anularnumerocontrol === "0" ? false : true))
                    this.pGeneral.chxFactSistema.setValue((configuration.factsistema === "0" ? false : true))
                    this.pGeneral.chxFactManuales.setValue((configuration.factmanuales === "0" ? false : true))
                }
            }
            data.dirreporte = configuration.dirreporte;
            data.mediaproductos = configuration.mediaproductos;
            data.mediaservicios = configuration.mediaservicios;
            if(configuration.formula == 1) {
                this.pGeneral.rdFormulaUno.setValue(true);
            } else {
                this.pGeneral.rdFormulaDos.setValue(true);
            }
            if(configuration.tipopreciocentral == 0) {
                this.pGeneral.rdCostoDos.setValue(true);
            } else if (configuration.tipopreciocentral == 1) {
                this.pGeneral.rdCostoUno.setValue(true);
            } else {
                this.pGeneral.rdCostoTres.setValue(true);
            }
            frm.loadRecord(new Ext.data.Record(data));
        }else {
            this.pGeneral.cmbCBS.getStore().load();
        }
    },
    createDataToSend: function() {
        var _this = this;
        this.data = {};
        var a = this.tbConfFactura.getActiveTab(), me = this;
        switch (a.name) {
            case 'tabPanelGeneral':
                {
                    var p = a.getActiveTab();
                    if (p.getId() == 'pagoelectronico'){
                        var confpagos = this.pPagoElectronico.getStorePrincipal().getModifiedRecords();
                        
                        if (confpagos.length > 0) {
                            var pagos = new Array();
                            Ext.each(confpagos, function(record) {
                                pagos.push(record.data);
                            });
                            this.data.pagos = Ext.encode(pagos);
                        }
                        if (confpagos.length > 0) {
                            this.sentDataToController(this.data);
                        } 
                    }else{
                        
                        var general = false;
                        if (p.name == 'panelGeneral') {
                            if ((p.frmGeneral.getForm().isDirty()
                                    /*|| p.gRecargos.getStore().getModifiedRecords().length > 0*/) || (this.validate())) {
                                var frmGeneral = p.frmGeneral.getForm(),
                                        values = frmGeneral.getValues(), flag = true;
                                this.data = {
                                    panelGeneral: 1,
                                    dirreporte: values.dirreporte,
                                    mediaproductos: values.mediaproductos,
                                    mediaservicios: values.mediaservicios,
                                    formula: (values.formulauno) ? 1 : 2,
                                    tipopreciocentral: (values.mayorcosto) ? 1 : ((values.menorcosto) ? 2 : 0),
                                    pagoanticipado: values.pagoanticipado ? 1 : 0,
                                    entregarrealordenado: values.entregarrealordenado ? 1 : 0,
                                    utilizarserie: values.utilizarserie ? 1 : 0,
                                    utilizarvendedor: values.utilizarvendedor ? 1 : 0,
                                    preciocentral: values.preciocentral ? 1 : 0,
                                    completardistribucion: values.completardistribucion ? 1 : 0,
                                    utilizarformapago: values.utilizarformapago ? 1 : 0,
                                    utilizarbeneficiario: values.utilizarbeneficiario ? 1 : 0,
                                    utilizarnumeroref : values.utilizarnumeroref ? 1 :0,
                                    utilizarfirma: values.utilizarfirma ? 1 : 0,
                                    facturasistema: values.facturasistema ? 1 : 0,
                                    comprobanteoperacion: values.comprobanteoperacion ? 1 : 0,
                                    cobrorecargo: values.cobrorecargo == "on" ? 1 : 0,
                                    permitirfactura: values.permitirfactura ? 1 : 0,
                                    //tipofactura: this.pGeneral.cmbTipoFactura.getValue(),
                                    permitirnumerocontrol: values.permitirnumerocontrol === "on" ? 1 : 0
                                };
                                if(values.idestructura && !!values.idestructura){
                                    this.data.idpadrematriz = values.idestructura;
                                }
                                if(values.idtipotasa && !!values.idtipotasa){
                                    this.data.idtipotasa = values.idtipotasa;
                                }
                                if(p.cuentamonedasuministrador && p.cuentamonedasuministrador.length > 0){
                                    this.data.idcuenta = Ext.encode(p.cuentamonedasuministrador);
                                }
                                if (this.data.permitirnumerocontrol === 1) {
                                    this.data.anularnumerocontrol = (values.anularnumerocontrol && values.anularnumerocontrol != null && values.anularnumerocontrol === "0") ? 1 : 0;
                                    this.data.factmanuales = (values.factmanuales && values.factmanuales != null && values.factmanuales === "0") ? 1 : 0;
                                    this.data.factsistema = (values.factsistema && values.factsistema != null && values.factsistema === "0") ? 1 : 0;
                                } else {
                                    this.data.anularnumerocontrol = 0;
                                    this.data.factmanuales = 0;
                                    this.data.factsistema = 0;
                                }
                                if (values.diashabiles && values.diashabiles != null) {
                                    this.data.diashabiles = values.diashabiles;
                                }
                                if (values.facturaspendientes
                                        && values.facturaspendientes != '[--Seleccione--]') {
                                    this.data.facturaspendientes = values.facturaspendientes;
                                }
                                /*if (this.pGeneral.gRecargos.getStore().data.items.length > 0) {
                                    var modified = this.pGeneral.gRecargos.getStore().data.items,
                                            array = [];
                                    for (var i = 0; i < modified.length; i++) {
                                        var value = modified[i].data;
                                        for (var j in value) {
                                            if (j == 'valor' && value[j] == '0.00') {
                                                flag = false;
                                            }
                                        }
                                        array.push(value);
                                    }
                                    this.data.recargos = Ext.encode(array);
                                }*/
                                if (frmGeneral.isValid() && flag) {
                                    general = true;
                                } else {
                                    if (!this.pGeneral.diasHabiles.isValid()) {
                                        this.pGeneral.diasHabiles.markInvalid();
                                    }
                                    if (!this.pGeneral.facturasPendientes.isValid()) {
                                        this.pGeneral.facturasPendientes.markInvalid();
                                    }
                                    mostrarMensaje(1, this.idioma.lbMsgCampoIvalido);
                                }
                            }
                        }
                        var operacionesMod = this.pOperaciones.getStorePrincipal().getModifiedRecords();
                        if (operacionesMod.length > 0) {
                            var operaciones = new Array();
                            Ext.each(operacionesMod, function(record) {
                                operaciones.push(record.data);
                            });
                            this.data.operaciones = Ext.encode(operaciones);
                        }
                        if (operacionesMod.length > 0 || general) {
                            this.sentDataToController(this.data);
                        }
                    }
                }
                break;
            case 'panelDesglosePrecio':
                {
                    this.data.relacionador = 1;
                    this.data.tipoP = this.pDesglosePrecio.cmbTipoPrecio.getValue();
                    if (this.relacionador.eliminados.length > 0) {
                        mostrarMensaje(2, this.idioma.lbMsgConfirmarNoUsar, function(btn) {
                            if (btn == 'ok') {
                                me.data.deleted = Ext.encode(me.relacionador.eliminados);
                                if (me.relacionador.adicionados.length > 0)
                                    me.data.added = Ext.encode(me.relacionador.adicionados);
                                me.sentDataToController(me.data);
                            }
                            else if (btn == 'cancel') {
                                if (me.relacionador.adicionados.length > 0) {
                                    me.data.added = Ext.encode(me.relacionador.adicionados);
                                    me.sentDataToController(me.data);
                                }
                            }
                        });
                    } else if (this.relacionador.adicionados.length > 0) {
                        var modificados = this.relacionador.stGridDerecho.data.items, cuentasAdded = [], adicionar = true;
                        for (var i = 0; i < modificados.length; i++) {
                            /*if(modificados[i].data.idcuenta == undefined){
                                adicionar = false;
                                break;
                            }*/
                            for (var j = 0; j < this.relacionador.adicionados.length; j++) {
                                if (modificados[i].data.idcategoriaprecio == this.relacionador.adicionados[j]) {
                                    cuentasAdded.push({
                                        idcategoriaprecio: this.relacionador.adicionados[j],
                                        idcuenta: modificados[i].data.idcuenta
                                    });
                                }
                            }
                        }
                        if (adicionar) {
                            me.data.added = Ext.encode(cuentasAdded);
                            this.sentDataToController(me.data);
                        } else {
                            mostrarMensaje(1, this.idioma.msgErrorDesglosePrecio);
                        }
                    } else if (this.relacionador.stGridDerecho.getModifiedRecords().length > 0) {
                        var modificados = this.relacionador.stGridDerecho.getModifiedRecords(), cuentas = [], adicionar = true;
                        for (var i = 0; i < modificados.length; i++) {
                            if (modificados[i].data.idcuenta != undefined) {
                                cuentas.push({
                                    idcuentadesgloseprecio: modificados[i].data.idcuentadesgloseprecio,
                                    idcuenta: modificados[i].data.idcuenta
                                });
                            } else {
                                adicionar = false;
                                break;
                            }
                        }
                        if (adicionar) {
                            me.data.added = Ext.encode(cuentas);
                            me.data.actionMod = 'modCuentas';
                            this.sentDataToController(me.data);
                        } else {
                            mostrarMensaje(1, this.idioma.msgErrorDesglosePrecio);
                        }
                    }
                }
                break;
            case 'pClienteTipoPrecio':
                {
                    this.data.relacionadorCP = 1;
                    this.data.idtipoprecio = this.pClienteTipoPrecio.cmbTipoprecio.getValue();
                    if (this.relacionadorCP.eliminados.length > 0) {
                        mostrarMensaje(2, this.idioma.lbMsgConfirmarNoUsar1, function(btn) {
                            if (btn == 'ok') {
                                me.data.deleted = Ext.encode(me.relacionadorCP.eliminados);
                                if(me.relacionadorCP.eliminadosTodos){
                                    me.data.eliminadosTodos = 1;
                                    if(me.relacionadorCP.cmbSectorDer.getValue()) {
                                        me.data.sectordel = me.relacionadorCP.cmbSectorDer.getValue();
                                    }
                                }
                                if (me.relacionadorCP.adicionados.length > 0)
                                    me.data.added = Ext.encode(me.relacionadorCP.adicionados);
                                me.sentDataToController(me.data);
                            }
                            else if (btn == 'cancel') {
                                if (me.relacionadorCP.adicionados.length > 0) {
                                    me.data.added = Ext.encode(me.relacionadorCP.adicionados);
                                    me.sentDataToController(me.data);
                                }
                            }
                        });
                    }
                    else if (this.relacionadorCP.adicionados.length > 0) {
                        me.data.added = Ext.encode(this.relacionadorCP.adicionados);
                        if(this.relacionadorCP.adicionadosTodos){
                            me.data.adicionadosTodos = 1;
                            if(me.relacionadorCP.cmbSectorIzq.getValue()) {
                                me.data.sectoradd = me.relacionadorCP.cmbSectorIzq.getValue();
                            }
                        }
                        this.sentDataToController(me.data);
                    }
                }
                break;
            case 'panelMatrizPrecio':
                {
                    this.getDataMatrizAux(this.data, this.pMatrizPrecio.cmbFsNorth, this.pMatrizPrecio);
                }
                break;
            case 'panelMatrizTarifa':
                {
                    this.getDataMatrizAux(this.data, this.pMatrizTarifa.cmbFsNorth, this.pMatrizTarifa);
                }
                break;
            case 'panelMonedas':
            {
                var mod = this.panelMonedas.gdCenter.getStore().getModifiedRecords();
                var enviar = [];
                Ext.each(mod, function(r){
                    var obj = {
                        idcliente: r.data.idclientesproveedores,
                        idmoneda: r.data.idmoneda,
                        idtipoprecio: me.panelMonedas.cmbFsNorth.getValue(),
                        idclientemoneda: r.data.idclientemoneda || null,
                        idclienteredondeo: r.data.idclienteredondeo || null,
                        redondear: r.data.redondear || null,
                        idclientemedia: r.data.idclientemedia || null,
                        media: r.data.media
                    };
                    enviar.push(obj);
                });
                this.data.panelMonedas = 1;
                this.data.clientes = Ext.encode(enviar);
                this.sentDataToController(this.data);
            }
                break;
            case 'panelNaturalezamedia':
            {
                var mod = this.panelNaturalezamedia.gdCenter.getStore().getModifiedRecords();
                var enviar = [];
                Ext.each(mod, function(r){
                    var obj = {
                        idnaturaleza: r.data.idnaturaleza,
                        idtipoprecio: me.panelNaturalezamedia.cmbFsNorth.getValue(),
                        idnaturalezamedia: r.data.idnaturalezamedia || null,
                        media: r.data.media
                    };
                    enviar.push(obj);
                });
                this.data.panelNaturalezamedia = 1;
                this.data.naturalezas = Ext.encode(enviar);
                this.sentDataToController(this.data);
            }
                break;
            case 'panelSectormedia':
            {
                var mod = this.panelSectormedia.gdCenter.getStore().getModifiedRecords();
                var enviar = [];
                Ext.each(mod, function(r){
                    var obj = {
                        idnaturaleza: r.data.idnaturaleza,
                        idtipoprecio: me.panelSectormedia.cmbFsNorth.getValue(),
                        idsector: me.panelSectormedia.cmbSector.getValue(),
                        idsectormedia: r.data.idsectormedia || null,
                        media: r.data.media
                    };
                    enviar.push(obj);
                });
                this.data.panelSectormedia = 1;
                this.data.naturalezas = Ext.encode(enviar);
                this.sentDataToController(this.data);
            }
                break;
        }
    },
    getDataMatrizAux: function(data, cmb, pMatriz, cmbOrigen, cmbDestino) {
        var me = this;
        if(cmbOrigen && cmbDestino){
            if (cmb.isDirty() || cmbOrigen.isDirty() || cmbDestino.isDirty()) {
                this.values = pMatriz.getDatasMatrizDePrecios();
                if (this.values) {
                    if (this.values.matrizGeneralDatas || this.values.matrizPreciosDatas) {
                        data.values = Ext.encode(this.values);
                        data.panelMatrizPrecio = 1;
                        this.sentDataToController(data);
                    } else {
                        mostrarMensaje(1, me.idioma.msgErrorDatosNoRegistrado);
                    }
                } else {
                    mostrarMensaje(1, me.idioma.msgSelecionarFila);
                }
            }
        }else{
            if (cmb.isDirty()) {
                this.values = pMatriz.getDatasMatrizDePrecios();
                if (this.values) {
                    if (this.values.matrizGeneralDatas || this.values.matrizPreciosDatas) {
                        data.values = Ext.encode(this.values);
                        data.panelMatrizPrecio = 1;
                        this.sentDataToController(data);
                    } else {
                        mostrarMensaje(1, me.idioma.msgErrorDatosNoRegistrado);
                    }
                } else {
                    mostrarMensaje(1, me.idioma.msgSelecionarFila);
                }
            }
        }
    },
    sentDataToController: function(pGeneral) {
        var me = this;
        if (this.validate()) {
            Ext.getBody().mask(this.idioma.tbContenidomsgGuardando, 'x-mask-loading');
            Ext.Ajax.request({
                url: this.idioma.urlConffacturacion + 'guardarConfiguracion',
                method: 'post',
                params: pGeneral,
                callback: function(options, success, response) {
                    var responseText = Ext.decode(response.responseText);
                    Ext.getBody().unmask();
                    var a = me.tbConfFactura.getActiveTab();
                    if (a.name == 'tabPanelGeneral') {
                        var p = a.getActiveTab();
                        if (p.getId() == 'pagoelectronico') {
                            me.pPagoElectronico.getStorePrincipal().reload();
                        }
                    }
                    else if (a.name == 'panelDesglosePrecio') {
                        if (!responseText.success) {
                            if (responseText.codigoMsg === 2) {
                                mostrarMensaje(1, me.idioma.noeliminar);
                            }
                        }
                        me.relacionador.gridDerecho.getStore().load({
                            params: {
                                tipoP: me.pDesglosePrecio.cmbTipoPrecio.getValue()
                            }
                        });
                        me.relacionador.gridIzquierdo.getStore().load({
                            params: {
                                tipoP: me.pDesglosePrecio.cmbTipoPrecio.getValue()
                            }
                        });

                    }
                    else if (a.name == 'pClienteTipoPrecio') {
                        if (!responseText.success) {
                            if (responseText.codigoMsg === 2) {
                                mostrarMensaje(1, me.idioma.noeliminar);
                            }
                        }
                        me.relacionadorCP.gridDerecho.getStore().reload(/*{
                            params: {
                                idtipopreciocl: me.pClienteTipoPrecio.cmbTipoprecio.getValue()
                            }
                        }*/);
                        me.relacionadorCP.gridIzquierdo.getStore().reload(/*{
                            params: {
                                idtipopreciocl: me.pClienteTipoPrecio.cmbTipoprecio.getValue()
                            }
                        }*/);

                    }
                    else if (a.name == 'panelMatrizPrecio') {
                        me.pMatrizPrecio.gdCenter.getStore().reload({
                            callback: function() {
                                me.pMatrizPrecio.gdEditable.getGridPrincipal().getStore().load();
                            }
                        });
                        me.pMatrizPrecio.gdEditable.getGridPrincipal().getStore().commitChanges();
                        me.pMatrizPrecio.gdCenter.getStore().commitChanges();
                    }
                    else if (a.name == 'panelMatrizTarifa') {
                        me.pMatrizTarifa.gdCenter.getStore().reload({
                            callback: function() {
                                me.pMatrizTarifa.gdEditable.getGridPrincipal().getStore().load();
                            }
                        });
                        me.pMatrizTarifa.gdEditable.getGridPrincipal().getStore().commitChanges();
                        me.pMatrizTarifa.gdCenter.getStore().commitChanges();
                    }
                    else if(a.name == 'panelMonedas'){
                        me.panelMonedas.gdCenter.getStore().reload();
                        me.panelMonedas.gdCenter.getStore().commitChanges();
                    } else if(a.name == 'panelNaturalezamedia'){
                        me.panelNaturalezamedia.gdCenter.getStore().reload();
                        me.panelNaturalezamedia.gdCenter.getStore().commitChanges();
                    } else if(a.name == 'panelSectormedia'){
                        me.panelSectormedia.gdCenter.getStore().reload();
                        me.panelSectormedia.gdCenter.getStore().commitChanges();
                    }
                    mostrarMensaje(1, me.idioma.msgGuardarConfiguracionTD);
                    if (pGeneral.operaciones) {
                        mostrarMensaje(1, me.idioma.msgGuardarConfiguracionTD);
                        me.pOperaciones.getGridPrincipal().getStore().load();
                        me.pOperaciones.getGridPrincipal().getStore().commitChanges();
                    }
                },
                failure: function(response, opts) {
                    var responseText = Ext.decode(response.responseText);
                    var a = me.tbConfFactura.getActiveTab();
                    if (a.name == 'panelDesglosePrecio') {
                        if (responseText.codigoMsg === 2) {
                            mostrarMensaje(1, me.idioma.noeliminar);
                        }
                    } else if (a.name == 'pClienteTipoPrecio') {
                        if (responseText.codigoMsg === 2) {
                            mostrarMensaje(1, me.idioma.noeliminar);
                        }
                    }
                }
            });
        }
        else
            mostrarMensaje(1, this.idioma.msgDatosVaciosOIncorrectos);
    },
    validate: function() {
        var validate = true;
        /*if (this.pGeneral.fsPermitirFactPend.isVisible() && !this.pGeneral.fsPermitirFactPend.collapsed) {
            if (!this.pGeneral.diasHabiles.isValid()) {
                validate = false;
                this.pGeneral.diasHabiles.markInvalid();
            }
            if (!this.pGeneral.facturasPendientes.isValid()) {
                validate = false;
                this.pGeneral.facturasPendientes.markInvalid();
            }
        }*/
        return validate;
    },
    compareByType: function(a) {
        var c = [];
        for (var i = 0; i < a.length / 2; i++) {
            for (var j = a.length / 2; j < a.length; j++) {
                if (a[i] != a[j]) {
                    c.push(a[i]);
                }
            }
        }
        return c;
    }
});