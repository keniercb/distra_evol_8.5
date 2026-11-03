/**
 * Esta clase gestiona la configuracion de Facturacion
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
Ext.ns('Fact.conf');
/**
 *<Componente> Panel General
 */
Fact.conf.pGeneral = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var me = this;
        // Ext.apply(this,config);
        this.idioma = config.idioma;
        this.parentCmp = config.parentCmp;
        config.frame = true;
        config.region = 'center';
        config.border = false;
        config.name = 'panelGeneral';
        config.autoScroll = true;
        config.items = [me.getFrmDataGeneral()];
        this.listeners = {
            afterrender: function() {
                // me.stNumeroControl.load();
            },
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
        me.keyNav = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (me.activateTap) {
                        me.actionPanelGeneral("i");
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function() {
                    if (me.activateTap
                            && me.gRecargos
                            && me.gRecargos.getSelectionModel().hasSelection()
                            && me.parentCmp.tbConfFactura.getActiveTab().name == 'tabPanelGeneral') {
                        if (me.parentCmp.tbConfFactura.getActiveTab().getActiveTab().name == 'panelGeneral') {
                            me.actionPanelGeneral("d");
                        }
                    }
                }
            }
        ]);
        Fact.conf.pGeneral.superclass.constructor.call(this, config);
    },
    loadDays: function(length) {
        var days = []; //Crear array para los dias
        for (var i = 1; i < length; i++) {
            days.push([i, i]);
        }
        return days;
    },
    getPanelChxGeneral: function() {
        var me = this;
        this.chxFactPagoAnticipado = new Ext.form.Checkbox({
            name: 'pagoanticipado',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: this.idioma.lbChxPagoAnticipado
        });
        this.chxRealOrdenado = new Ext.form.Checkbox({
            name: 'entregarrealordenado',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: this.idioma.lbChxEntregarRealOrdenado
        });


        /*this.chxCompbOperAuto = new Ext.form.Checkbox({
         name: 'comprobanteoperacion',
         style: 'margin-left: -93px; margin-top:-15px',
         boxLabel: this.idioma.lbChxCompbOperAuto
         });*/
        this.chxUtilizarSerie = new Ext.form.Checkbox({
            name: 'utilizarserie',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: this.idioma.lbChxUtilizarSerie,
            inputValue: 0,
            listeners: {
                check: function(e, a) {
                    if (a == true) {
                        //me.chxFactSistema.inputValue = 1;
                        me.parentCmp.pSerieDocumento.getVistaPrincipal().enable();
                    } else {
                        //me.chxFactSistema.inputValue = 0;
                        me.parentCmp.pSerieDocumento.getVistaPrincipal().disable();
                    }
                }
            }
        });

        this.chxUtilizarVendedor = new Ext.form.Checkbox({
            name: 'utilizarvendedor',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Utilizar vendedor',
            inputValue: 0,
            listeners: {
                check: function(e, a) {
                    if (a == true) {
                        me.parentCmp.panelVendedor.enable();
                    } else {
                        me.parentCmp.panelVendedor.disable();
                    }
                }
            }
        });

        this.chxUtilizarFirma = new Ext.form.Checkbox({
            name: 'utilizarfirma',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: this.idioma.lbChxUtilizaFirma
        });
        
        this.chxModeloPreimpreso = new Ext.form.Checkbox({
            name: 'facturasistema',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: this.idioma.lbChxFacturaPreimpresa
        });

        this.chxPrecioCentral = new Ext.form.Checkbox({
            name: 'preciocentral',
            hidden: (!me.grantedAction('RCONFPRECIO')),
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Utilizar precio de costo centralizado'
        });

        this.rdCostoUno = new Ext.form.Radio({
            boxLabel: 'Mayor costo',
            name: 'tipopreciocentral',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('mayorcosto').setValue(true);
                    } else {
                        Ext.getCmp('mayorcosto').setValue(false);
                    }
                }
            }
        });

        this.rdCostoDos = new Ext.form.Radio({
            boxLabel: 'Costo promedio',
            name: 'tipopreciocentral',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('preciopromedio').setValue(true);
                    } else {
                        Ext.getCmp('preciopromedio').setValue(false);
                    }
                }
            }
        });

        this.rdCostoTres = new Ext.form.Radio({
            boxLabel: 'Menor costo',
            name: 'tipopreciocentral',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('menorcosto').setValue(true);
                    } else {
                        Ext.getCmp('menorcosto').setValue(false);
                    }
                }
            }
        });

        this.frmCostos = LOG.util.UIManager.initColumnForm({
            columnas: 3,
            padding: '0 0 0 2%',
            hidden: (!me.grantedAction('RCONFPRECIO')),
        });

        /*this.frmMedias.getColumn(1).getComponent(0).anchor = '90%';
        this.frmMedias.getColumn(1).getComponent(0).anchor = '90%';
*/
        this.frmCostos.addComponent(this.rdCostoUno);
        this.frmCostos.addComponent(this.rdCostoDos);
        this.frmCostos.addComponent(this.rdCostoTres);

        this.frmCostos.getColumn(0).columnWidth = 0.1;
        this.frmCostos.getColumn(1).columnWidth = 0.1;
        this.frmCostos.getColumn(2).columnWidth = 0.1;

        this.chxCompletarDist = new Ext.form.Checkbox({
            name: 'completardistribucion',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Facturar distribuci\xf3n completa'
        });
        this.chxFormapago = new Ext.form.Checkbox({
            name: 'utilizarformapago',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Utilizar forma de pago'
        });
        this.chxBeneficiario = new Ext.form.Checkbox({
            name: 'utilizarbeneficiario',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Utilizar beneficiario'
        });
        this.chxnumeroref= new Ext.form.Checkbox({
            name: 'utilizarnumeroref',
            style: 'margin-left: -93px; margin-top:-15px',
            boxLabel: 'Utilizar n\xfamero de oferta extendido'
        });
        this.stTasa = new Ext.data.Store({
            autoLoad: true,
            url: this.idioma.urlConffacturacion + 'cargartipostasa',
            reader: new Ext.data.JsonReader({
                    id: "idtipotasa",
                    root: "datos"
                },
                [
                    {name: 'idtipotasa'},
                    {name: 'nombretipotasa'}
                ]),
            listeners: {
                load: function(){
                    if(!!me.idtipotasa){
                        me.cmbTasa.setValue(me.idtipotasa);
                    }
                }
            }
        });

        this.cmbTasa = new LOG.util.ComboBox({
            store: this.stTasa,
            fieldLabel: me.idioma.flTipoTasa,
            hiddenName: 'idtipotasa',
            valueField: 'idtipotasa',
            displayField: 'nombretipotasa',
            editable: false,
            allowBlank: false,
            anchor: '20%',
            emptyText: this.idioma.cmbSeleccione,
            listeners: {
                'select': function () {
                    /*if (_this.fpConfiguracion.getForm().isValid() && _this.fpConfiguracion.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[1].disable();
                    }*/
                }
            }
        });

        this.cmbCBS = new LOG.util.LovCombo({
            fieldLabel: 'Cuenta bancaria',
            url: 'cargarCuentasBancarias',
            name: 'idcuentabancaria',
            valueField: 'idcuentabancaria',
            displayField: 'nrocuenta',
            allowBlank: false,
            editable: false,
            typeAhead: false,
            anchor: '20%',
            mode: 'local',
            emptyText: this.idioma.cmbSeleccione,
            autoLoad: false,
            getXType: function () {
                return 'combobox';
            }
        });
        me.idcuentabancaria = "";
        this.cmbCBS.getStore().on('load', function(st, rd, opt){
            if(rd.length > 0){
                me.cmbCBS.setValue(me.idcuentabancaria.substr(1,me.idcuentabancaria.length-2));
                var cuentas = me.idcuentabancaria.substr(1,me.idcuentabancaria.length-2).split(',');
                Ext.each(cuentas, function(cuenta){
                    me.cmbCBS.fireEvent('select', me.cmbCBS,
                        me.cmbCBS.getStore().getById(cuenta),
                        me.cmbCBS.getStore().indexOfId(cuenta));
                });
            }
        });

        this.cmbCBS.on('select', function(cmb, rd){
            me.cuentamonedasuministrador = new Array();
            var values = cmb.getCheckedValue().split(',');
            var storeValues = me.cmbCBS.getStore().reader.jsonData.datos;
            Ext.each(values, function(value){
                for(var i = 0; i < storeValues.length; i++){
                    if(storeValues[i].idcuentabancaria == value){
                        me.cuentamonedasuministrador.push({
                            idcuenta: value
                        });
                        break;
                    }
                }
            });
        });

        this.txtDirReporte = LOG.util.Prototipos.inputTexto({
            fieldLabel : 'Direcci&oacute;n del reporte',
            allowBlank : false,
            anchor: '20%',
            name : 'dirreporte'
        });

        this.cmbTipoFactura = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cbTipoFactura,
            emptyText: this.idioma.lbEmptyText,
            valueField: 'no',
            displayField: 'tfactura',
            name: 'tipofactura',
            store: new Ext.data.SimpleStore({
                fields: ['no', 'tfactura'],
                data: [
                    ['1', this.idioma.cbLbProductos],
                    ['2', this.idioma.cbLbServicios],
                    ['3', this.idioma.cbLbProductoServicio]
                ]
            })
        });
        this.fsCondicionGeneral = new Ext.form.FieldSet({
            title: "Condiciones de la factura"
        });
        this.fsCondicionGeneral.add(this.chxRealOrdenado);
//        this.fsCondicionGeneral.add(this.chxFactPagoAnticipado);
        this.fsCondicionGeneral.add(this.chxUtilizarSerie);
        this.fsCondicionGeneral.add(this.chxUtilizarVendedor);
        this.fsCondicionGeneral.add(this.chxUtilizarFirma);
        this.fsCondicionGeneral.add(this.chxModeloPreimpreso);
        this.fsCondicionGeneral.add(this.chxCompletarDist);
        this.fsCondicionGeneral.add(this.chxFormapago);
        this.fsCondicionGeneral.add(this.chxBeneficiario);
        this.fsCondicionGeneral.add(this.chxnumeroref);
        this.fsCondicionGeneral.add(this.chxPrecioCentral);

        this.cmbEstructuras = new LOG.util.ComboBox({
            fieldLabel: 'Usar matriz de precio',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            hiddenName: 'idestructura',
            minChars:3,
            resizable:true,
            anchor: '20%',
            autoLoad: false,
            hidden: (!me.grantedAction('RHeredarMatriz')) ? true : false,
        });

        this.cmbEstructuras.getStore().on('load', function(st, rd, opt){
            if(rd.length > 0){
                me.cmbEstructuras.setValue(me.idpadrematriz);
                me.cmbEstructuras.fireEvent('select', me.cmbEstructuras,
                    me.cmbEstructuras.getStore().getById(me.idpadrematriz),
                    me.cmbEstructuras.getStore().indexOfId(me.idpadrematriz));
                if (me.idpadrematriz) {
                    me.cmbEstructuras.setDisabled(true);
                }
            }
        });

        this.fsCondicionGeneral.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.cmbEstructuras
        });

        this.fsCondicionGeneral.add(this.frmCostos);

        this.fsCondicionGeneral.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.cmbTasa
        });

        this.fsCondicionGeneral.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.cmbCBS
        });

        this.fsCondicionGeneral.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 1%',
            items: this.txtDirReporte
        });

        this.txtMediaproducto = LOG.util.Prototipos.inputDecimal({
            fieldLabel : 'Media Productos',
            name : 'mediaproductos'
        });

        this.txtMediaservicio = LOG.util.Prototipos.inputDecimal({
            fieldLabel : 'Media Servicios',
            name : 'mediaservicios'
        });

        this.rdFormulaUno = new Ext.form.Radio({
            boxLabel: '(Costo * Media) + Margen comercial',
            name: 'formula',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('formulauno').setValue(true);
                    } else {
                        Ext.getCmp('formulauno').setValue(false);
                    }
                }
            }
        });

        this.rdFormulaDos = new Ext.form.Radio({
            boxLabel: '(Costo + Margen comercial) * Media',
            name: 'formula',
            listeners: {
                'check': function(_radio, checked) {
                    if (checked) {
                        Ext.getCmp('formulados').setValue(true);
                    } else {
                        Ext.getCmp('formulados').setValue(false);
                    }
                }
            }
        });

        this.frmMedias = LOG.util.UIManager.initColumnForm({
            columnas: 4,
            padding: '0.5% 0 0 1%'
        });

        this.frmMedias.addComponent(this.txtMediaproducto);
        this.frmMedias.addComponent(this.txtMediaservicio);
        this.frmMedias.addComponent(this.rdFormulaUno);
        this.frmMedias.addComponent(this.rdFormulaDos);
        this.frmMedias.getColumn(0).columnWidth = 0.2;
        this.frmMedias.getColumn(1).columnWidth = 0.2;
        this.frmMedias.getColumn(2).columnWidth = 0.3;
        this.frmMedias.getColumn(3).columnWidth = 0.3;

        this.frmMedias.getColumn(1).getComponent(0).anchor = '90%';
        this.frmMedias.getColumn(1).getComponent(0).anchor = '90%';

        this.fsCondicionGeneral.add({
            layout: 'form',
            labelAlign: 'top',
            padding: '0.5% 0 0 0.5%',
            width: 800,
            items: [this.frmMedias,{
                xtype: 'checkbox',
                hidden: true,
                id: 'formulauno',
                name: 'formulauno'
            }, {
                xtype: 'checkbox',
                hidden: true,
                id: 'formulados',
                name: 'formulados'
            }, {
                xtype: 'checkbox',
                hidden: true,
                id: 'mayorcosto',
                name: 'mayorcosto'
            }, {
                xtype: 'checkbox',
                hidden: true,
                id: 'menorcosto',
                name: 'menorcosto'
            }, {
                xtype: 'checkbox',
                hidden: true,
                id: 'preciopromedio',
                name: 'preciopromedio'
            }]
        });
        //this.fsCondicionGeneral.add(this.chxCompbOperAuto);
        this.pChxGeneral = LOG.util.UIManager.initPanel({
//            layout: 'column',
            layout: 'form',
            items: [
                {
//                    columnWidth: .50,
//                    layout: 'form',
                    items: [
//                        {
//                            layout: 'form',
//                            labelAlign: 'top',
//                            padding: '0 0 0 2%',
//                            items: this.cmbTipoFactura
//                        },
//                        this.chxRealOrdenado,
//                        this.chxFactPagoAnticipado,
//                        this.chxCompbOperAuto
                        this.fsCondicionGeneral
                    ]
                }//, {
//                    columnWidth: .50,
//                    layout: 'form',
//                    items: [this.chxCompbOperAuto]
//                }
            ]
        });
        return this.pChxGeneral;
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
    getFsPemitFactPendientes: function() {
        this.diasHabiles = new LOG.util.Prototipos.inputEntero({
            allowBlank: false,
            anchor: '90%',
            name: 'diashabiles',
            maxValue: 366,
            minValue: 1,
            minLengthText: this.idioma.lbMsgMinLongDays,
            fieldLabel: this.idioma.lbCmbDiasHabiles,
            maxText: this.idioma.lbMsgMaxLongDays
        });
        this.facturasPendientes = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCmbFacturasPendientes,
            allowBlank: false,
            emptyText: this.idioma.lbEmptyText,
            valueField: 'no',
            displayField: 'dias',
            name: 'facturaspendientes',
            store: new Ext.data.SimpleStore({
                fields: ['no', 'dias'],
                data: this.loadDays(31)
            })
        });
        this.fsPermitirFactPend = new Ext.form.FieldSet({
            autoHeight: true,
            checkboxToggle: true,
            checkboxName: 'permitirfactura',
            id: 'fsGenerarFactAutomatica',
            collapsed: true,
            title: this.idioma.titlePermitirFacturas,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .30,
                            layout: 'form',
                            labelAlign: 'top',
                            items: this.diasHabiles
                        }, {
                            columnWidth: .30,
                            layout: 'form',
                            labelAlign: 'top',
                            items: this.facturasPendientes
                        }
                    ]
                }
//                , {
//                    items: this.getFsCobroRecargos()
//                }
            ],
            listeners: {
                collapse: function(p) {
                    if (p.id == 'fsGenerarFactAutomatica') {
                        p.items.items[0].items.items[0].items.items[0].reset();
                        p.items.items[0].items.items[1].items.items[0].reset();
//                        p.items.items[1].items.items[0].collapse();
                    }
                }
            }
        });
        return;
        //return this.fsPermitirFactPend;
    },
    getFsNumeroControl: function() {
        var me = this;
        this.chxFactManuales = new Ext.form.Checkbox({
            boxLabel: me.idioma.lbChxFacturaM,
            hideLabel: true,
            name: 'factmanuales',
            inputValue: 0,
            listeners: {
                check: function(e, a) {

                }
            }
        });
        this.chxFactSistema = new Ext.form.Checkbox({
            boxLabel: me.idioma.lbChxFacturaS,
            hideLabel: true,
            name: 'factsistema',
            inputValue: 0,
            listeners: {
                check: function(e, a) {
                    if (a == true) {
                        me.chxFactSistema.inputValue = 1;
                      //  me.parentCmp.pRangosFacturasGeneradas.enable();
                    } else {
                        me.chxFactSistema.inputValue = 0;
                       // me.parentCmp.pRangosFacturasGeneradas.disable();
                    }
                }
            }
        });
        this.chxAnular = new Ext.form.Checkbox({
            boxLabel: me.idioma.lbChxAnular,
            hideLabel: true,
            name: 'anularnumerocontrol',
            inputValue: 0
        });
        this.fsNumeroControl = new Ext.form.FieldSet({
            autoHeight: true,
            checkboxToggle: true,
            checkboxName: 'permitirnumerocontrol',
            name: 'permitirnumerocontrol',
            collapsed: true,
            title: this.idioma.titleNumeroDeControl,
            items: [this.chxFactSistema, this.chxAnular],
            listeners: {
                collapse: function(p) {
                    if (me.parentCmp.pRangosFacturasManuales) {
                        me.parentCmp.pRangosFacturasManuales.disable();
                    }
                   // me.parentCmp.pRangosFacturasGeneradas.disable();
                },
                expand: function(p) {
                    if (me.chxFactManuales.inputValue) {
                        me.parentCmp.pRangosFacturasManuales.enable();
                    }
                    if (me.chxFactSistema.inputValue) {
                       // me.parentCmp.pRangosFacturasGeneradas.enable();
                    }
                }
            }
        });
        return this.fsNumeroControl;
    },
    createGridRecargo: function() {
        var me = this;
        this.chkProcentual = new Ext.ux.grid.CheckColumn({
            header: this.idioma.lbChxPorcentual,
            dataIndex: 'porcentual',
            width: 80,
            align: 'center',
            default: true,
            listeners: {
                click: function(chk, g, r, t) {
                    g.getSelectionModel().getSelected().set(chk.dataIndex, (g.getSelectionModel().getSelected().get(chk.dataIndex) == '') ? 1 : 0);
                }
            }
        });
        this.btnAddRecargo = LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.tlBtnAdicionarRecargo,
            handler: function() {
                me.actionPanelGeneral('i');
            }
        });
        this.btnDelRecargo = LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.tlBtnEliminarRecargo,
            disabled: true,
            handler: function() {
                me.actionPanelGeneral('d');
            }
        });
        this.smRecargo = LOG.util.UIManager.initSelectionModel(1);
        this.stRecargo = new Ext.data.Store({
            url: this.idioma.urlConffacturacion + 'cargarRecargos',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {name: 'idrecargo'},
                {name: 'valor'},
                {name: 'porcentual'},
                {name: 'new'}
            ]),
            listeners: {
                'beforeload': function(st, opts) {
                    st.initBaseParams.limit = me.gRecargos.getBottomToolbar().cbPageSize.getValue();
                }
            }
        });
        this.fnValorRecargo = function(v) {
            return parseFloat(v).toFixed(2);
        };
        this.cmRecargo = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: me.idioma.cmNo}),
            {
                header: this.idioma.lbValorRecargo,
                dataIndex: 'valor',
                id: 'valor',
                renderer: this.fnValorRecargo,
                editor: LOG.util.Prototipos.inputEntero({
                    allowBlank: false
                })
            }, this.chkProcentual
        ]);
        this.gRecargos = LOG.util.UIManager.initEditableGridPanel(this.cmRecargo, this.stRecargo, this.smRecargo, {nobbar: false});
//        this.gRecargos.plugins.push(this.chkProcentual);
        this.gRecargos.setHeight(300);
        this.gRecargos.getSelectionModel().addListener('selectionchange', function(sm) {
            var selections = sm.getSelections();
            me.btnDelRecargo.setDisabled((selections.length > 0) ? false : true);
        });
        var tbarRecargo = this.gRecargos.getTopToolbar();
        tbarRecargo.add([this.btnAddRecargo, this.btnDelRecargo]);
        this.gRecargos.autoExpandColumn = 'valor';
        return this.gRecargos;
    },
    actionPanelGeneral: function(flags) {
        var me = this;
        if (flags === "i") {
            me.gRecargos.stopEditing();
            me.gRecargos.getStore().insert(0, new Ext.data.Record({
                valor: 0,
                porcentual: false,
                new : true
            }));
            me.gRecargos.startEditing(0, 0);
        } else if (flags === "d") {
            mostrarMensaje(2, me.idioma.confirmarEliminarRecargo, function(ok) {
                if (ok === "ok") {
                    if (me.smRecargo.hasSelection()) {
                        if (me.smRecargo.getSelected().get('new')) {
                            me.stRecargo.remove(me.smRecargo.getSelected());
                            mostrarMensaje(1, me.idioma.msgConfirmarEliminarRecargo);
                        } else {
                            Ext.Ajax.request({
                                url: me.idioma.urlConffacturacion + 'eliminarRecargo',
                                method: 'post',
                                params: {
                                    idrecargo: me.smRecargo.getSelected().get('idrecargo')
                                },
                                callback: function(conf, opts, response) {
                                    var responseText = Ext.decode(response.responseText);
                                    me.stRecargo.remove(me.smRecargo.getSelected());
                                    if (responseText.success) {
                                        mostrarMensaje(1, me.idioma.msgConfirmarEliminarRecargo);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    },
    getFsCobroRecargos: function() {
        this.fsCobroRecargo = new Ext.form.FieldSet({
            checkboxToggle: true,
            checkboxName: 'cobrorecargo',
            collapsed: true,
            autoHeight: true,
            title: this.idioma.titleCobroDeRecargos,
            items: this.createGridRecargo()
        });
        return this.fsCobroRecargo;
    },
    getFrmDataGeneral: function() {
        this.frmGeneral = LOG.util.UIManager.initForm({
            trackResetOnLoad: true,
            autoScroll: true,
            items: [
                LOG.util.UIManager.initPanel({
                    layout: 'form',
                    style: 'margin-bottom: 10px',
                    items: this.getPanelChxGeneral()
                }),
                //this.getFsNumeroControl()//,
                //this.getFsPemitFactPendientes()
            ]
        });
        return this.frmGeneral;
    }
});
/**
 *<Componente> Panel Desglose de precio
 */
Fact.conf.pDesglosePrecio = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var me = this;
        this.idioma = config.idioma;
        this.relacionador = config.relacionador;
        config.frame = true;
        config.border = false;
        config.region = 'center';
        config.name = 'panelDesglosePrecio';
        this.cmbTipoPrecio = config.cmbTipoPrecio;
        config.items = [me.getFrmDesglose()];
        Fact.conf.pDesglosePrecio.superclass.constructor.call(this, config);
    },
    createCmbTipoPrecio: function() {
        var me = this;
        this.cmbTipoPrecio.addListener('select', function(cmb, rd) {
            me.relacionador.stGridIzquierdo.on({
                'beforeload': function() {
                    me.relacionador.stGridIzquierdo.baseParams.tipoP = rd.data.idtipoprecio;
                }
            });
            me.relacionador.stGridDerecho.on({
                'beforeload': function() {
                    me.relacionador.stGridDerecho.baseParams.tipoP = rd.data.idtipoprecio;
                }
            });
            me.relacionador.stGridIzquierdo.load({
                params: {
                    tipoP: rd.data.idtipoprecio
                }
            });
            me.relacionador.stGridDerecho.load({
                params: {
                    tipoP: rd.data.idtipoprecio
                }
            });
        });
        return new Ext.form.FieldSet({
            layout: 'form',
            items: this.cmbTipoPrecio
        });
    },
    getFrmDesglose: function() {
        this.frmDesglose = LOG.util.UIManager.initForm({
            items: [this.createCmbTipoPrecio(), this.relacionador]
        });
        return this.frmDesglose;
    }
});
/**
 * <Componente> Panel Cliente por Tipo precio
 */
Fact.conf.pClienteTipoPrecio = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var me = this;
        this.idioma = config.idioma;
        this.relacionador = config.relacionador;
        config.name = 'pClienteTipoPrecio';
        //this.cmbCliente = config.cmbCliente;
        this.cmbTipoprecio = config.cmbTipoprecio;
        config.items = this.createFrmDesglose();
        Fact.conf.pClienteTipoPrecio.superclass.constructor.call(this, config);
    },
    createCmbTipoPrecio: function () {
        var me = this;
        this.cmbTipoprecio.addListener('select', function (cmb, rd) {
            me.relacionador.stGridIzquierdo.on({
                'beforeload': function() {
                    me.relacionador.stGridIzquierdo.baseParams.idtipopreciocl = rd.data.idtipoprecio;
                }
            });
            me.relacionador.stGridDerecho.on({
                'beforeload': function() {
                    me.relacionador.stGridDerecho.baseParams.idtipopreciocl = rd.data.idtipoprecio;
                }
            });
            me.relacionador.stGridIzquierdo.load({
                params: {
                    idtipopreciocl: rd.data.idtipoprecio
                }
            });
            me.relacionador.stGridDerecho.load({
                params: {
                    idtipopreciocl: rd.data.idtipoprecio
                }
            });
        });
        return new Ext.form.FieldSet({
            layout: 'form',
            region: 'north',
            height: 50,
            items: this.cmbTipoprecio
        });
    },
    createCmbCliente: function() {
        var me = this;
        this.cmbCliente.addListener('select', function(cmb, rd) {
            me.relacionador.stGridIzquierdo.load({
                params: {
                    idcliente: rd.data.idclientesproveedores
                }
            });
            me.relacionador.stGridDerecho.load({
                params: {
                    idcliente: rd.data.idclientesproveedores
                }
            });
        });
        return new Ext.form.FieldSet({
            layout: 'form',
            items: this.cmbCliente
        });
    },
    createFrmDesglose: function() {
        this.frmDesglose = LOG.util.UIManager.initForm({
            region: 'center',
            layout: 'border',
            items: [/*this.createCmbCliente()*/this.createCmbTipoPrecio(), this.relacionador]
        });
        return this.frmDesglose;
    }
});

Fact.conf.pClienteMoneda = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.cmbFsNorth = config.cmbTipoPrecio
        this.idioma = config.idioma;
        this.items = [this.createGrid()];
        this.gdCenter.getStore().addListener('beforeload', function(st) {
            if (_this.cmbFsNorth.isDirty()) {
                st.initBaseParams.idtipoprecio = _this.cmbFsNorth.getValue();
            }
        });
        Fact.conf.pClienteMoneda.superclass.constructor.call(this, config);
    },
    createNorte: function(){
        var _this = this;
        this.columnForm = new LOG.util.ColumnForm({columnas:4});
        this.columnForm.addComponent(this.cmbFsNorth);
        this.fsNorth = new Ext.form.FieldSet({
            autoHeight: true,
            region: 'north',
            frame: true,
            items: [this.columnForm]
        });
        this.cmbFsNorth.addListener('select', function(cmb, rd) {
            _this.gdCenter.getStore().load()
        });
        return this.fsNorth;
    },
    createGrid: function(){
        var _this = this;
        this.pGdList = new Fact.conf.gridGeneral({
            idioma: _this.idioma,
            gridEditable:true,
            gdPrincipal: true,
            ttBtnBuscar: this.ttBtnBuscar,
            textBusquedaSimple: this.textBusquedaSimple,
            url: 'cargarClientePrecio',
            initColumnsMatriz: function() {
                this.addGridColumn({
                    dataIndex: 'idclientesproveedores'
                });
                this.addGridColumn({
                    dataIndex: 'idmoneda'
                });
                this.addGridColumn({
                    dataIndex: 'redondear'
                });
                this.addGridColumn({
                    dataIndex: 'idclientemoneda'
                });
                this.addGridColumn({
                    dataIndex: 'idclienteredondeo'
                });
                this.addGridColumn({
                    dataIndex: 'idclientemedia'
                });
                this.addGridColumn({
                    header: 'Cliente',
                    dataIndex: 'text',
                    width: 500,
                    default: true
                });
                this.addGridColumn({
                    header: 'Facturar moneda',
                    dataIndex: 'moneda',
                    editable: true,
                    width: 100,
                    hidden: (idmonedaalternativa) ?false:true,
                    filter : {
                      type : 'combo',
                      store : new Ext.data.SimpleStore({
                          fields: ['idmoneda', 'moneda'],
                          data: [['-1','No configurado'],[idmoneda, moneda], [idmonedaalternativa, monedaalternativa]]
                      }),
                      valueField : 'idmoneda',
                      displayField: 'moneda',
                      dataIndex : 'moneda',
                  },
                    editor: _this.createCmbMoneda(),
                    renderer: function(v, m, rd) {
                        var monedas = this.editor.getStore().data.items;
                        if (v) {
                            if (this.editor.isDirty()) {
                                for (var i = 0; i < monedas.length; i++) {
                                    if (monedas[i].data.idmoneda == this.editor.getValue()) {
                                        rd.set('idmoneda', this.editor.getValue());
                                        return monedas[i].data.moneda;
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < monedas.length; i++) {
                            if (monedas[i].data.idmoneda == rd.data.idmoneda) {
                                return monedas[i].data.moneda;
                            }
                        }
                        return '';
                    }
                });
                this.addGridColumn({
                    header: 'Tasa',
                    dataIndex: 'media',
                    editable: true,
                    width: 120,
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function(t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                });
                this.addGridColumn({
                    header: 'Redondear d\xe9cima superior',
                    dataIndex: 'texto',
                    editable: true,
                    width: 150,
                    filter : {
                        type : 'combo',
                        store : new Ext.data.SimpleStore({
                            fields: ['redondear', 'texto'],
                            data: [['-1','No'],['1', 'Si']]
                        }),
                        valueField : 'redondear',
                        displayField: 'texto',
                        dataIndex : 'texto',
                    },
                    editor: _this.createCmbRedondeo(),
                    renderer: function(v, m, rd) {
                        if (v) {
                            if (this.editor.isDirty()) {
                                rd.set('redondear', this.editor.getValue());
                                if (v == 1)
                                    m.css = 'icondistra-aceptar verde';
                                else
                                    m.css = 'icondistra-aceptar rojo';
                                //return (v == 1) ? 'Si' : 'No';
                            }
                        }
                        if (rd.data.redondear == 1)
                            m.css = 'icondistra-aceptar verde';
                        else
                            m.css = 'icondistra-aceptar rojo';
                        //return (rd.data.redondear == 1) ? 'Si' : 'No';
                    }
                });
            }
        });
        this.pGdList.init();
        this.pGdList.clicksToEdit = 1;
        this.pGdList.getPanelBusqueda().setColumns(2);
        this.pList = this.pGdList.view();
        this.pList.add(this.createNorte());
        this.doLayout();
        this.gdCenter = this.pGdList.getGridPrincipal();
        this.pGdList.getPanelBusqueda().autoScroll = true;
        return this.pList;
    },
    createCmbMoneda: function() {
        var storecmbMoneda = new Ext.data.SimpleStore({
            fields: ['idmoneda', 'moneda'],
            data: [[-1,'S/D'],[idmoneda, moneda], [idmonedaalternativa, monedaalternativa]]
        });
        var cmbMonedas = new Ext.form.ComboBox({
            store: storecmbMoneda,
            fieldLabel: 'Moneda',
            displayField: 'moneda',
            id: 'idmoneda',
            valueField: 'idmoneda',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'idmoneda'
        });
        return cmbMonedas;
    },
    createCmbRedondeo: function() {
        var storecmbredondeo = new Ext.data.SimpleStore({
            fields: ['redondear', 'texto'],
            data: [[-1,'No'],[1, 'Si']]
        });
        var cmbRedondeo = new Ext.form.ComboBox({
            store: storecmbredondeo,
            fieldLabel: 'Redondear',
            displayField: 'texto',
            id: 'redondear',
            valueField: 'redondear',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'redondear'
        });
        return cmbRedondeo;
    }
});

Fact.conf.pNaturalezaMedia = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.cmbFsNorth = config.cmbTipoPrecio
        this.idioma = config.idioma;
        this.items = [this.createGrid()];
        this.gdCenter.getStore().addListener('beforeload', function(st) {
            if (_this.cmbFsNorth.isDirty()) {
                st.initBaseParams.idtipoprecio = _this.cmbFsNorth.getValue();
            }
        });
        Fact.conf.pNaturalezaMedia.superclass.constructor.call(this, config);
    },
    createNorte: function(){
        var _this = this;
        this.columnForm = new LOG.util.ColumnForm({columnas:4});
        this.columnForm.addComponent(this.cmbFsNorth);
        this.fsNorth = new Ext.form.FieldSet({
            autoHeight: true,
            region: 'north',
            frame: true,
            items: [this.columnForm]
        });
        this.cmbFsNorth.addListener('select', function(cmb, rd) {
            _this.gdCenter.getStore().load()
        });
        return this.fsNorth;
    },
    createGrid: function(){
        var _this = this;
        this.pGdList = new Fact.conf.gridGeneral({
            idioma: _this.idioma,
            gridEditable:true,
            gdPrincipal: true,
            ttBtnBuscar: this.ttBtnBuscar,
            textBusquedaSimple: this.textBusquedaSimple,
            url: 'cargarNaturalezaMedia',
            initColumnsMatriz: function() {
                this.addGridColumn({
                    dataIndex: 'idnaturalezamedia'
                });
                this.addGridColumn({
                    dataIndex: 'idnaturaleza'
                });
                this.addGridColumn({
                    header: 'Naturaleza',
                    dataIndex: 'codigo',
                    width: 500,
                    default: true
                });
                this.addGridColumn({
                    header: 'Tasa',
                    dataIndex: 'media',
                    editable: true,
                    width: 120,
                    align: 'right',
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function(t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                });
            }
        });
        this.pGdList.init();
        this.pGdList.clicksToEdit = 1;
        this.pGdList.getPanelBusqueda().setColumns(2);
        this.pList = this.pGdList.view();
        this.pList.add(this.createNorte());
        this.doLayout();
        this.gdCenter = this.pGdList.getGridPrincipal();
        this.pGdList.getPanelBusqueda().autoScroll = true;
        return this.pList;
    }
});

Fact.conf.pNaturalezaSectorMedia = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.cmbFsNorth = config.cmbTipoPrecio
        this.idioma = config.idioma;
        this.items = [this.createGrid()];
        this.gdCenter.getStore().addListener('beforeload', function(st) {
            if (_this.cmbFsNorth.isDirty()) {
                st.initBaseParams.idtipoprecio = _this.cmbFsNorth.getValue();
                st.initBaseParams.idsector = _this.cmbSector.getValue();
            }
        });
        Fact.conf.pNaturalezaSectorMedia.superclass.constructor.call(this, config);
    },
    createNorte: function(){
        var _this = this;
        this.cmbSector = new LOG.util.ComboBox({
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
        this.columnForm = new LOG.util.ColumnForm({columnas:4});
        this.columnForm.addComponent(this.cmbFsNorth);
        this.columnForm.addComponent(this.cmbSector);
        this.fsNorth = new Ext.form.FieldSet({
            autoHeight: true,
            region: 'north',
            frame: true,
            items: [this.columnForm]
        });
        this.cmbFsNorth.addListener('select', function(cmb, rd) {
            if (_this.cmbSector.getValue()) {
                _this.gdCenter.getStore().load();
            }
        });
        this.cmbSector.addListener('select', function(cmb, rd) {
            if (_this.cmbFsNorth.getValue()) {
                _this.gdCenter.getStore().load();
            }
        });
        return this.fsNorth;
    },
    createGrid: function(){
        var _this = this;
        this.pGdList = new Fact.conf.gridGeneral({
            idioma: _this.idioma,
            gridEditable:true,
            gdPrincipal: true,
            ttBtnBuscar: this.ttBtnBuscar,
            textBusquedaSimple: this.textBusquedaSimple,
            url: 'cargarSectorMedia',
            initColumnsMatriz: function() {
                this.addGridColumn({
                    dataIndex: 'idsectormedia'
                });
                this.addGridColumn({
                    dataIndex: 'idnaturaleza'
                });
                this.addGridColumn({
                    header: 'Naturaleza',
                    dataIndex: 'codigo',
                    width: 500,
                    default: true
                });
                this.addGridColumn({
                    header: 'Tasa',
                    dataIndex: 'media',
                    editable: true,
                    width: 120,
                    align: 'right',
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function(t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                });
            }
        });
        this.pGdList.init();
        this.pGdList.clicksToEdit = 1;
        this.pGdList.getPanelBusqueda().setColumns(2);
        this.pList = this.pGdList.view();
        this.pList.add(this.createNorte());
        this.doLayout();
        this.gdCenter = this.pGdList.getGridPrincipal();
        this.pGdList.getPanelBusqueda().autoScroll = true;
        return this.pList;
    }
});

Fact.conf.pVendedor = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.disabled = true;
        this.idioma = config.idioma;
        this.items = [this.createGrid()];
        this.gdCenter.getStore().addListener('beforeload', function(st) {
        });
        Fact.conf.pVendedor.superclass.constructor.call(this, config);
        _this.listeners = {
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
        this.gdCenter.getStore().load();
    },
    createGrid: function(){
        var _this = this;
        this.btnAddVendedor = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.btnAdicionarPI, tooltip: 'Adicionar vendedor',
            handler: function() {
                _this.showWinAddVendedor("add");
            }
        });
        this.btnDelVendedor = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.lbBtnEliminar,
            disabled: true,
            tooltip: 'Eliminar vendedor',
            handler: function() {
                if (_this.pGdList.getGridPrincipal().getSelectionModel().hasSelection()) {
                    mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar la(s) configuraci\xf3n(es) seleccionada(s)\x3f', function(ok) {
                        if (ok === "ok") {
                            _this.delVendedor();
                        }

                    });
                }
            },
            controlFn: function(b, cl){
                _this.pGdList.getGridPrincipal().getSelectionModel().fireEvent = _this.pGdList.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    b.disable();
                    if (_this.pGdList.getGridPrincipal().getSelectionModel().getSelections().length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        this.pGdList = new Fact.conf.gridGeneral({
            idioma: _this.idioma,
            gridEditable:true,
            gdPrincipal: true,
            ttBtnBuscar: this.ttBtnBuscar,
            textBusquedaSimple: this.textBusquedaSimple,
            url: 'cargarVendedores',
            initColumnsMatriz: function() {
                this.addGridColumn({
                    dataIndex: 'idpersona'
                });
                this.addGridColumn({
                    header: 'Cliente',
                    dataIndex: 'nombreapellidos',
                    width: 500,
                    default: true
                });
            }
        });
        this.pGdList.init();
        this.pGdList.getPanelBusqueda().setColumns(2);
        this.pGdList.addToolbarButton(this.btnAddVendedor);
        this.pGdList.addToolbarButton(this.btnDelVendedor);
        this.pList = this.pGdList.view();
        this.doLayout();
        this.gdCenter = this.pGdList.getGridPrincipal();
        this.pGdList.getPanelBusqueda().autoScroll = true;
        return this.pList;
    },
    delVendedor: function() {
        var _this = this;
        var records = _this.pGdList.getGridPrincipal().getSelectionModel().getSelections();
        var ids = Array();
        Ext.each(records, function(r){
            ids.push(r.data.idpersona);
        });
        Ext.MessageBox.wait('Eliminando vendedor', 'Espere' || '...');
        Ext.Ajax.request({
            url: _this.idioma.urlConffacturacion + 'actionsConcepto',
            method: 'POST',
            params: {
                ids: Ext.encode(ids),
                util: Ext.encode({
                    domain: 'ConfVendedor',
                    primaryKey: 'idpersona'
                }),
                actions: 'del',
                idconcepto: 'idpersona'
            },
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                Ext.MessageBox.hide();
                if (resp.success) {
                    mostrarMensaje(1, 'Los datos han sido eliminados satisfactoriamente');
                    _this.pGdList.getStorePrincipal().load();
                } else {
                    mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                }
            }
        });
    },
    showWinAddVendedor: function() {
        var _this = this;
        var title = 'Adicionar vendedor';
        var ventanaVendedor = new Fact.conf.addConceptos({
            //idclientesproveedores: Ext.encode(idclientes),
            concepto: 'persona',
            dataIndexPrincipal: 'nombreapellidos',
            util: {
                titleadd: 'Listado de personas',
                domain: 'ConfVendedor',
                primaryKey: 'idpersona'
            },
            idioma: _this.idioma,
            gpParent: _this.gpParent,
            urlBusquedaGridPrincipal: 'cargarConcepto'
        });
        ventanaVendedor.init();

        ventanaVendedor.getVistaPrincipal().title = 'Listado de vendedores';
        ventanaVendedor.view();
        ventanaVendedor.getGridPrincipal().getStore().load();
        var botonAceptar = ventanaVendedor.getVistaPrincipal().listaBotones.getItem(2);
        botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
            var records = ventanaVendedor.getGridPrincipal().getSelectionModel().getSelections();
            var ids = Array();
            Ext.each(records, function(r){
                ids.push(r.data.idpersona);
            });
            Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
            Ext.Ajax.request({
                url: _this.idioma.urlConffacturacion + 'actionsConcepto',
                method: 'POST',
                params: {
                    ids: Ext.encode(ids),
                    util: Ext.encode({
                        domain: 'ConfVendedor',
                        primaryKey: 'idpersona'
                    }),
                    actions: 'add',
                    idconcepto: 'idpersona'
                },
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                        _this.pGdList.getStorePrincipal().load();
                    } else {
                        mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                    }
                }
            });
        });
    }
});
/**
 *<Componente> Panel Matriz de precio
 */
Fact.conf.pMatriz = Ext.extend(LOG.util.Panel, {
    columnSouth: [],
    constructor: function(config) {
        var me = this;
        this.ttBtnBuscar = config.ttBtnBuscar;
        this.textBusquedaSimple = config.textBusquedaSimple;
        this.copiarTodos = config.copiarTodos || null;
        this.borrarTodos = config.borrarTodos || null;
        this.actualizarPrecios = config.actualizarPrecios || null;
        this.servicio = config.servicio || null;
        Ext.apply(this, config);
        if(this.copiarTodos){
            if(!this.servicio){
                this.cbNaturalezas = new LOG.util.ComboBox({
                    fieldLabel: this.idioma.lbNaturaleza,
                    url: me.idioma.urlConffacturacion + 'obtenerNaturaleza',
                    name: 'idnaturaleza',
                    valueField: 'idnaturaleza',
                    disabled: true,
                    displayField: 'codigo',
                    selectOnlyLeaf: true
                });
            } else {
                this.cbClasificacion = new LOG.util.ComboBox({
                    fieldLabel: this.idioma.lbClasificacion,
                    url: me.idioma.urlConffacturacion + 'obtenerClasificacion',
                    name: 'idclasificacioncontable',
                    valueField: 'idclasificacioncontable',
                    disabled: true,
                    displayField: 'denominacion',
                    selectOnlyLeaf: true
                });
            }
            this.btnCopiarPrecio = LOG.util.UIManager.createBtn({
              text: this.idioma.btnCopiar,
              tooltip: this.idioma.ttCopiarPrecio,
              iconCls: 'copiar',
              disabled: true,
              width: '20px',
              minWidth: '20',
              style: {
                  marginTop: '17px'
              },
              handler: function() {
                  mostrarMensaje(2, me.idioma.reproducirConfirmar, function(btn, text){
                      if(btn == 'ok'){
                          Ext.MessageBox.wait('Guardando precios', 'Espere' || '...');
                          Ext.Ajax.request({
                              url: me.idioma.urlConffacturacion + 'reproducirPrecio',
                              method: 'post',
                              params: {
                                  idtipoprecio: me.cmbFsNorth.getValue(),
                                  idmatrizprecio: me.gdCenter.getSelectionModel().getSelected().data.idmatrizprecio,
                                  tipo: me.gdCenter.getSelectionModel().getSelected().data.tipo,
                                  idnaturaleza: (!me.servicio) ? me.cbNaturalezas.getValue() || null : me.cbClasificacion.getValue() || null
                              },
                              success: function(r) {
                                  Ext.MessageBox.hide();
                                  var s = Ext.decode(r.responseText);
                                  if (s.success == true) {
                                      //me.gdEditable.getGridPrincipal().getStore().removeAll();
                                      mostrarMensaje(1, 'Los precios han sido guardados satisfactoriamente.')
                                      me.gdCenter.getStore().reload();
                                  }
                              }
                          });
                      }
                  })
              },
              controlFn: function(b, cl){
                  me.gdCenter.getSelectionModel().fireEvent = me.gdCenter.getSelectionModel().fireEvent.createSequence(function (e) {
                      b.disable();
                      if (me.gdCenter.getSelectionModel().getSelections().length == 1) {
                          if(me.gdCenter.getSelectionModel().getSelected().data.idmatrizprecio){
                              b.enable();
                              if (!me.servicio) {
                                  me.cbNaturalezas.enable();
                              } else {
                                  me.cbClasificacion.enable();
                              }
                          }
                      } else {
                          b.disable();
                          if (!me.servicio) {
                              me.cbNaturalezas.disable();
                          } else {
                              me.cbClasificacion.disable();
                          }
                      }
                  });
                  me.gdCenter.getStore().fireEvent = me.gdCenter.getStore().fireEvent.createSequence(function (e) {
                      b.disable();
                      if (me.gdCenter.getSelectionModel().getSelections().length == 1) {
                          if(me.gdCenter.getSelectionModel().getSelected().data.idmatrizprecio){
                              b.enable();
                              if (!me.servicio) {
                                  me.cbNaturalezas.enable();
                              } else {
                                  me.cbClasificacion.enable();
                              }
                          }
                      } else {
                          b.disable();
                          if (!me.servicio) {
                              me.cbNaturalezas.disable();
                          } else {
                              me.cbClasificacion.disable();
                          }
                      }
                  });
              }
          });
        }
        if (this.borrarTodos) {
            this.btnBorrarPrecio = LOG.util.UIManager.createBtn({
                text: this.idioma.btnBorrar,
                tooltip: this.idioma.ttBorrarPrecio,
                iconCls: 'borrar',
                disabled: true,
                width: '30px',
                minWidth: '20',
                style: {
                    marginTop: '17px'
                },
                handler: function() {
                    mostrarMensaje(2, me.idioma.borrarConfirmar, function(btn, text){
                        if(btn == 'ok'){
                            Ext.MessageBox.wait('Borrando precios', 'Espere' || '...');
                            Ext.Ajax.request({
                                url: me.idioma.urlConffacturacion + 'borrarPrecio',
                                method: 'post',
                                params: {
                                    idtipoprecio: me.cmbFsNorth.getValue(),
                                    tipo: (!me.servicio) ? 1 : 2/*me.gdCenter.getSelectionModel().getSelected().data.tipo*/,
                                    idnaturaleza: (!me.servicio) ? me.cbNaturalezas.getValue() || null : me.cbClasificacion.getValue() || null
                                },
                                success: function(r) {
                                    Ext.MessageBox.hide();
                                    var s = Ext.decode(r.responseText);
                                    if (s.success == true) {
                                        //me.gdEditable.getGridPrincipal().getStore().removeAll();
                                        mostrarMensaje(1, 'Los precios han sido borrados satisfactoriamente.')
                                        me.gdCenter.getStore().reload();
                                    }
                                }
                            });
                        }
                    })
                },
                controlFn: function(b, cl){
                    /*me.cbNaturalezas.fireEvent = me.cbNaturalezas.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (me.cbNaturalezas.getValue() && me.cmbTipoPrecio.getValue()) {
                          b.enable();  
                        }
                    });*/
                    
                    me.cmbTipoPrecio.fireEvent = me.cmbTipoPrecio.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (/*me.cbNaturalezas.getValue() && */me.cmbTipoPrecio.getValue()) {
                          b.enable();  
                        }
                    });
                }
            });
        }

        if (this.actualizarPrecios) {
            this.fechaActualizado = new Ext.form.DateField({
                fieldLabel: 'Actualizado',
                name: 'fechaupdate',
                editable: false,
                disabled: true,
                format: 'd/m/Y',
                value: fechaupdate
            });
            this.btnActualizaPrecio = LOG.util.UIManager.createBtn({
                text: 'Actualizar precio',
                tooltip: 'Actualizar precio de costo centralizado',
                iconCls: 'actualizar',
                disabled: true,
                width: '35px',
                minWidth: '20',
                style: {
                    marginTop: '17px'
                },
                handler: function() {
                    mostrarMensaje(2, me.idioma.actualizarConfirmar, function(btn, text){
                        if(btn == 'ok'){
                            Ext.MessageBox.wait('Actualizando precios', 'Espere' || '...');
                            Ext.Ajax.request({
                                url: me.idioma.urlConffacturacion + 'actualizarPrecios',
                                method: 'post',
                                params: {
                                    idindicador: (me.gdCenter.getSelectionModel().hasSelection()) ? me.gdCenter.getSelectionModel().getSelected().data.idindicador : null,
                                    idnaturaleza: me.cbNaturalezas.getValue() || null
                                },
                                success: function(r) {
                                    Ext.MessageBox.hide();
                                    var s = Ext.decode(r.responseText);
                                    if (s.success == true) {
                                        //me.gdEditable.getGridPrincipal().getStore().removeAll();
                                        mostrarMensaje(1, 'Los precios han sido actualizados satisfactoriamente.')
                                    }
                                }
                            });
                        }
                    })
                },
                controlFn: function(b, cl){
                    /*me.cbNaturalezas.fireEvent = me.cbNaturalezas.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (me.cbNaturalezas.getValue() && me.cmbTipoPrecio.getValue()) {
                          b.enable();
                        }
                    });*/

                    me.cmbTipoPrecio.fireEvent = me.cmbTipoPrecio.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (/*me.cbNaturalezas.getValue() && */me.cmbTipoPrecio.getValue()) {
                            b.enable();
                        }
                    });
                }
            });
        }
        this.btnImportar = LOG.util.UIManager.createBtn({
            text: 'Importar',
            tooltip: 'Importar precios por catalogo',
            iconCls: 'importar',
            //disabled: true,
            width: '30px',
            minWidth: '20',
            style: {
                marginTop: '17px'
            },
            handler: function() {
                var win = new LOG.lb.importar.View({
                    class: 'ConfFacturacionModel',
                    params: {idtipoprecio: me.cmbTipoPrecio.getValue()},
                    fn: function(r) {
                        me.gdCenter.getStore().load();
                        mostrarMensaje(1, 'Importados '+r.importados+' de '+r.total+' c\xf3digos');
                    }
                });
                win.show();
            },
            controlFn: function(b, cl){
                /*me.cbNaturalezas.fireEvent = me.cbNaturalezas.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (me.cbNaturalezas.getValue() && me.cmbTipoPrecio.getValue()) {
                      b.enable();
                    }
                });*/

                me.cmbTipoPrecio.fireEvent = me.cmbTipoPrecio.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (/*me.cbNaturalezas.getValue() && */me.cmbTipoPrecio.getValue()) {
                        b.enable();
                    }
                });
            }
        });
        
        this.cmbFsNorth = config.cmbTipoPrecio;
        this.cmbOrigen = config.cmbOrigen || null;
        this.cmbDestino = config.cmbDestino || null;
        this.dfVigencia = config.dfVigencia || null;
        this.items = [this.createGdCenter()];
        this.gdCenter.getStore().addListener('beforeload', function(st) {
            if (me.cmbFsNorth.isDirty()) {
                st.initBaseParams.idtipoprecio = me.cmbFsNorth.getValue();
            }
            if (me.cmbOrigen && me.cmbOrigen.isDirty()) {
                st.initBaseParams.idorigen = me.cmbOrigen.getValue();
            }
            if (me.cmbDestino && me.cmbDestino.isDirty()) {
                st.initBaseParams.iddestino = me.cmbDestino.getValue();
            }
            if (me.dfVigencia && me.dfVigencia.isDirty()) {
                st.initBaseParams.fechavigencia = me.dfVigencia.getValue().format('d/m/Y');
            }
        });
        this.listeners = {
            afterrender: function() {
                // me.stNumeroControl.load();
            },
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
        this.selectionChangeInCenter();
        me.keyNav = new Ext.KeyMap(Ext.getDoc(), []);

        //this.tbar = [this.btnCopiarPrecio];
        Fact.conf.pMatriz.superclass.constructor.call(this, config);
        if(me.copiarTodos){
           me.btnCopiarPrecio.controlFn.createDelegate(this, [me.btnCopiarPrecio, this]).call(); 
        }
        if(me.borrarTodos){
           me.btnBorrarPrecio.controlFn.createDelegate(this, [me.btnBorrarPrecio, this]).call();
        }
        if(me.actualizarPrecios){
           me.btnActualizaPrecio.controlFn.createDelegate(this, [me.btnActualizaPrecio, this]).call();
        }
    },
    createFsNorth: function() {
        var me = this;
        this.cmbFsNorth.addListener('select', function(cmb, rd) {
            if (me.cmbOrigen && me.cmbDestino && me.dfVigencia){
                if(me.cmbOrigen.getValue() && me.cmbDestino.getValue() && me.dfVigencia.getValue()){
                    me.setColumnsGdCenter();
                }
            }else{
                me.setColumnsGdCenter();
            }
        });
        if(me.cmbOrigen && me.cmbDestino && me.dfVigencia){
            this.cmbOrigen.addListener('select', function(cmb, rd) {
                if (me.cmbFsNorth && me.cmbDestino && me.dfVigencia){
                    if(me.cmbFsNorth.isValid() && me.cmbDestino.isValid() && me.dfVigencia.isValid()){
                        me.setColumnsGdCenter();
                    }
                }
            });
            this.cmbDestino.addListener('select', function(cmb, rd) {
                if (me.cmbFsNorth && me.cmbOrigen && me.dfVigencia){
                    if(me.cmbFsNorth.isValid() && me.cmbOrigen.isValid() && me.dfVigencia.isValid()){
                        me.setColumnsGdCenter();
                    }
                }
            });
            this.dfVigencia.addListener('select', function(df, dt) {
                if (me.cmbFsNorth && me.cmbOrigen && me.cmbDestino){
                    if(me.cmbFsNorth.isValid() && me.cmbOrigen.isValid() && me.cmbDestino.isValid()){
                        me.setColumnsGdCenter();
                    }
                }
            });
        }
        if(this.cmbOrigen){
            this.columnForm = new LOG.util.ColumnForm({columnas:6});
        }else{
            this.columnForm = new LOG.util.ColumnForm({columnas:4});
        }
        this.columnForm.addComponent(this.cmbFsNorth);
        if(this.cmbOrigen){
            this.columnForm.addComponent(this.cmbOrigen);
        }
        if(this.cmbDestino){
            this.columnForm.addComponent(this.cmbDestino);
        }
        if(this.dfVigencia){
            this.columnForm.addComponent(this.dfVigencia);
        }
        if(me.copiarTodos){
            if (!this.servicio) {
                this.columnForm.addComponent((!this.servicio) ? this.cbNaturalezas : this.cbClasificacion);
                this.columnFormBtn = new LOG.util.ColumnForm({columnas:3});
                this.columnFormBtn.addComponent(this.btnCopiarPrecio);
                this.columnFormBtn.addComponent(this.btnBorrarPrecio);
                this.columnFormBtn.addComponent(this.btnActualizaPrecio);
                this.columnForm.addComponent(this.columnFormBtn);
                this.columnFormBtnAct = new LOG.util.ColumnForm({columnas:3});
                this.columnFormBtnAct.addComponent(new Ext.form.Label({text: ''}));
                this.columnFormBtnAct.addComponent(this.fechaActualizado);
                this.columnFormBtnAct.addComponent(this.btnImportar);
                this.columnForm.addComponent(this.columnFormBtnAct);
            } else {
                this.columnForm.addComponent((!this.servicio) ? this.cbNaturalezas : this.cbClasificacion);
                this.columnFormBtn = new LOG.util.ColumnForm({columnas:3});
                this.columnFormBtn.addComponent(this.btnCopiarPrecio);
                this.columnFormBtn.addComponent(this.btnBorrarPrecio);
                this.columnFormBtn.addComponent(this.btnImportar);
                this.columnForm.addComponent(this.columnFormBtn);


            }
        }
	if(!this.cmbOrigen){
	        this.columnForm.getColumn(0).columnWidth = 0.2;
         if(me.borrarTodos){
             this.columnFormBtn.getColumn(0).columnWidth = 0.33;
             this.columnFormBtn.getColumn(1).columnWidth = 0.33;
             //this.columnForm.getColumn(2).getComponent(0).anchor = '90%';
             if (!me.servicio) {
                 this.columnFormBtnAct.getColumn(0).columnWidth = 0.6;
                 this.columnFormBtnAct.getColumn(1).columnWidth = 0.4;
                 this.columnFormBtnAct.getColumn(0).getComponent(0).anchor = '90%';
             }

             //this.columnFormBtn.getColumn(1).getComponent(0).anchor = '20%';             
         }                 
         else if(me.copiarTodos){
             this.columnForm.getColumn(1).columnWidth = 0.2;
             this.columnForm.getColumn(2).columnWidth = 0.085;
             this.columnForm.getColumn(2).getComponent(0).anchor = '20%';
         }
         /*if(me.borrarTodos){
            this.columnForm.getColumn(3).columnWidth = 0.085;
            this.columnForm.getColumn(3).getComponent(0).anchor = '20%';
         }*/
	}else{
        if(me.copiarTodos){
          this.columnForm.getColumn(4).columnWidth = 0.085;
          this.columnForm.getColumn(4).getComponent(0).anchor = '20%';
        }
        /*if(me.borrarTodos){
            this.columnForm.getColumn(5).columnWidth = 0.085;
            this.columnForm.getColumn(5).getComponent(0).anchor = '20%';
        }*/
    }
	
        
        this.fsNorth = new Ext.form.FieldSet({
            autoHeight: true,
            region: 'north',
            frame: true,
            items: [this.columnForm]
        });
        return this.fsNorth;
    },
    createGdCenter: function() {
        var me = this;
        this.pGdList = new Fact.conf.gridGeneral({
            idioma: this.idioma,
            gdPrincipal: true,
            ttBtnBuscar: this.ttBtnBuscar,
            textBusquedaSimple: this.textBusquedaSimple,
            url: 'cargarListadoMatriz',
            servicio: this.servicio
        });
        this.pGdList.init();
        this.pGdList.clicksToEdit = 1;
        this.pGdList.getPanelBusqueda().setColumns(2);
        this.pList = this.pGdList.view();
        this.pList.add(this.createFsNorth());
        this.pList.add(this.createGdSouth());
        this.doLayout();
        this.gdCenter = this.pGdList.getGridPrincipal();
        this.gdCenter.getSelectionModel().on({
           'selectionchange': function(e){
               if(this.getCount() == 1){
                   me.cbUM.getStore().removeAll();
                   me.cbUM.getStore().load({
                       params: {
                           idindicador: this.getSelected().json.idindicador
                       },
                       callback: function () {
                           me.cargado = true;
                       }
                   });
               }
           }
        });
        this.pGdList.getPanelBusqueda().autoScroll = true;
        this.pGdList.getPanelBusqueda().buttons[2].setHandler(function() {
            var items = me.pGdList.getPanelBusqueda().getForm().items.items,
                    filtrer = {};
            for (var i = 0; i < items.length; i++) {
                if (items[i].isDirty()) {
                    filtrer[items[i].hiddenName] = items[i].getValue();
                }
            }
            me.gdCenter.getStore().load({
                params: filtrer/*,
                 callback: me.fireStoreEvent*/
            });
        });
        this.pGdList.getPanelBusqueda().buttons[1].setHandler(function() {
            me.pGdList.getPanelBusqueda().getForm().reset();
            me.gdCenter.getStore().load({
                params: {
                    start: 0,
                    idtipoprecio: me.cmbFsNorth.getValue(),
                    idorigen: (me.cmbOrigen) ? me.cmbOrigen.getValue() : null,
                    iddestino: (me.cmbDestino) ? me.cmbDestino.getValue() : null,
                    fechavigencia: (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null,
                    limit: me.gdCenter.getBottomToolbar().pageSize
                }
            });
        });
        return this.pList;
    },
    createGdSouth: function() {
        var me = this;
        var gdSouth = this.initGridEditableBySelection({
            servicio: me.servicio,
            tipoPrecio: this.cmbFsNorth.getValue(),
            idorigen: (me.cmbOrigen) ? me.cmbOrigen.getValue() : null,
            iddestino: (me.cmbDestino) ? me.cmbDestino.getValue() : null,
            fechavigencia: (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null,
            url: 'cargarDatosPorSeleccionMatriz'
        });
        this.pGdSouth = LOG.util.UIManager.initPanel({
            layout: 'border',
            region: 'south',
            anchor: '100%',
            height: 180,
            disabled: true,
            items: gdSouth
        });
        var cln = this.gdEditable.getGridPrincipal().getColumnModel().config;
        for (var i = 0; i < cln.length; i++) {
            this.columnSouth.push(cln[i]);
        }
        return this.pGdSouth;
    },
    fireStoreEvent: function(rd) {
        var me = this;
        if (rd.length == 0) {
            mostrarMensaje(1, me.idioma.msgNoDatos);
        }
    },
    createTrcmbNaturaleza: function() {
        var _this = this;
        _this.tpNaturaleza = new Ext.tree.TreePanel({
            rootVisible: false,
            loader: new Ext.tree.TreeLoader({
                dataUrl: this.idioma.urlConffacturacion + 'obtenerNaturaleza',
                preloadChildren: true
            }),
            border: false,
            autoScroll: true,
            root: new Ext.tree.AsyncTreeNode({
                id: '0',
                expanded: true,
                animate: false
            })
        });
        _this.trcmbNaturaleza = new Ext.components.TreeComboBox({
            allowBlank: false,
            resizable: true,
            emptyText: this.idioma.lbEmptyText,
            hiddenName: 'idnaturaleza',
            fieldLabel: this.idioma.lbNaturaleza,
            dataUrl: this.idioma.urlConffacturacion + 'obtenerNaturaleza',
            listWidth: 300,
            treeConfig: _this.tpNaturaleza
        });
        return _this.trcmbNaturaleza;
    },
    createTrcmbMarcaModelo: function() {
        var _this = this;
        _this.tpMarcaModelo = new Ext.tree.TreePanel({
            rootVisible: false,
            loader: new Ext.tree.TreeLoader({
                dataUrl: this.idioma.urlConffacturacion + 'obtenerMarcaModelo',
                preloadChildren: true
            }),
            border: false,
            autoScroll: true,
            root: new Ext.tree.AsyncTreeNode({
                id: '0',
                expanded: true,
                animate: false
            })
        });
        _this.trcmbMarcaModelo = new Ext.components.TreeComboBox({
            allowBlank: false,
            resizable: true,
            emptyText: this.idioma.lbEmptyText,
            hiddenName: 'idnaturaleza',
            fieldLabel: this.idioma.lbMarcaModelo,
            dataUrl: this.idioma.urlConffacturacion + 'obtenerMarcaModelo',
            listWidth: 300,
            treeConfig: _this.tpMarcaModelo
        });
        return _this.trcmbMarcaModelo;
    },
    createPnFind: function() {
        var me = this;
        this.cmbCategoria = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCategoria,
            displayField: 'denominacion',
            valueField: 'idpadre',
            hiddenName: 'idpadre',
            emptyText: this.idioma.lbEmptyText,
            allowBlank: true,
            url: this.idioma.urlConffacturacion + 'obtenerCategoriaSubcategoria',
            listeners: {
                select: function(cmb, rd) {
                    if (me.cmbSubCategoria.isDirty()) {
                        me.cmbSubCategoria.reset();
                    }
                    me.cmbSubCategoria.getStore().reload({
                        params: {
                            idpadre: rd.data.idpadre
                        },
                        callback: function(rd) {
                            me.cmbSubCategoria.setDisabled(
                                    (rd.length > 0) ? false : true
                                    );
                        }
                    });
                }
            }
        });
        this.cmbCategoria.getStore().addListener('beforeload', function(st) {
            st.initBaseParams.nivel = 1;
        });
        this.cmbSubCategoria = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbSubcategoria,
            displayField: 'denominacion',
            valueField: 'idindicador',
            hiddenName: 'idindicador',
            emptyText: this.idioma.lbEmptyText,
            disabled: true,
            url: this.idioma.urlConffacturacion + 'obtenerCategoriaSubcategoria',
        });
        this.cmbGrupo = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbGrupo,
            displayField: 'denominacion',
            valueField: 'idgruposubgrupo',
            hiddenName: 'idgruposubgrupo',
            emptyText: this.idioma.lbEmptyText,
            pageSize: 10,
            mode: 'remote',
            url: this.idioma.urlConffacturacion + 'obtenerGruposHojas'
        });
        this.treecmbMarcaModelo = this.createTrcmbMarcaModelo();
        this.treecmbNaturaleza = this.createTrcmbNaturaleza();
        return [
            this.treecmbNaturaleza,
            this.cmbCategoria,
            this.cmbSubCategoria,
            this.cmbGrupo,
            this.treecmbMarcaModelo
        ];
    },
    setColumnsGdCenter: function() {
        var me = this;
        this.valor_aplicar_todos = 0;
        Ext.Ajax.request({
            url: this.idioma.urlConffacturacion + 'cargarColumnaSegunMatriz',
            method: 'post',
            params: {
                tipoP: this.cmbFsNorth.getValue(),
                columns: 1,
                grid: 'der'
            },
            callback: function(o, s, r) {
                var cm = me.gdEditable.getGridPrincipal().getColumnModel().config, cmEditable = [], colm = '';
                for (var i = 0; i < 4; i++) {
                    cmEditable.push(cm[i]);
                }
                var rd = Ext.decode(r.responseText),
                        lastCmEditable = me.gdEditable.getGridPrincipal().getColumnModel().config.pop(),
                        fdEditable = me.createFieldsEditable(),
                        cmGeneral = me.createNewColumnModelGridGeneral(me.idioma, true);
                me.checkColumnPrecioProm = new Ext.ux.grid.CheckColumn({
                    header: (!me.servicio) ? me.idioma.cmPrecioProm : me.idioma.cmCobrarMat,
                    dataIndex: (!me.servicio) ? 'preciopromedio' : 'cobromateriales',
                    width: 100,
                    align: 'center',
                    rowSelection: true,
                    value: false
                });
                me.checkColumnPrecioProm.addListener('cellclick', function(e, record, rowIndex, colIndex) {
                    if (record.get('preciopromedio') || record.get('cobromateriales') || record.get('bi')) {
                        if (parseInt(record.get('tipo')) === 1) {
                            //me.pGdSouth.disable();
                            var records = me.gdEditable.getGridPrincipal().getStore();
                            for(var k = 0; k < records.data.items.length; k++){
                                var record = records.getAt(k);
                                record.set('precio', 0);
                                me.getPrecioVentaTarifa({
                                    grid: me.gdEditable.getGridPrincipal(),
                                    record: record
                                });
                            }
                            me.gdEditable.getGridPrincipal().getColumnModel().setEditable(me.gdEditable.getGridPrincipal().getColumnModel().findColumnIndex('precio'), false);
                        } else {
                            me.gdEditable.getGridPrincipal().getColumnModel().setHidden(me.gdEditable.getGridPrincipal().getColumnModel().findColumnIndex('cobromateriales'), false);
                        }
                        //me.pGdSouth.items.items[0].getColumnModel().setEditable(me.pGdSouth.items.items[0].getColumnModel().getIndexById('precio'), false);
                    } else {
                        if (parseInt(record.get('tipo')) === 1) {
                            //me.pGdSouth.enable();
                            me.gdEditable.getGridPrincipal().getColumnModel().setEditable(me.gdEditable.getGridPrincipal().getColumnModel().findColumnIndex('precio'), true);
                        } else {
                            me.gdEditable.getGridPrincipal().getColumnModel().setHidden(me.gdEditable.getGridPrincipal().getColumnModel().findColumnIndex('cobromateriales'), true);
                        }
                        // me.pGdSouth.items.items[0].getColumnModel().setEditable(me.pGdSouth.items.items[0].getColumnModel().getIndexById('precio'), true);
                    }
                });
                me.checkColumnBaseImp = new Ext.ux.grid.CheckColumn({
                    header: 'BI',
                    dataIndex: 'bi',
                    hidden: (!me.servicio) ? false : true,
                    width: 100,
                    align: 'center',
                    rowSelection: true,
                    value: false
                });
                var fdGeneral = [{name: 'text'},{name: 'umedida'},{name: (!me.servicio) ? 'naturaleza' : 'clasificacion'},{name:'idunidadmedida'},{name:'configurado'}], plugins = [];
                cmGeneral.push(me.checkColumnPrecioProm);
                cmGeneral.push(me.checkColumnBaseImp);
                plugins.push(me.checkColumnPrecioProm);
                plugins.push(me.checkColumnBaseImp);
                fdGeneral.push({name: 'tipo'});
                fdGeneral.push({name: (!me.servicio) ? 'preciopromedio' : 'cobromateriales'});
                fdGeneral.push({name: 'bi'});
                fdGeneral.push({name: 'idindicador'});
                fdGeneral.push({name: 'idmatrizprecio'});
                for (var i = 0; i < rd.datos.length; i++) {
                    var str = rd.datos[i].denominacion.split('.').join('');
                    if (rd.datos[i].conformaprecio == 1) {
                        var c = new Ext.ux.grid.CheckColumn({
                            header: me.idioma.hdEvent + rd.datos[i].denominacion,
                            dataIndex: str.toLowerCase(),
                            width: 120,
                            dinamico: true,
                            default: true,
                            value: rd.datos[i].idcuentadesgloseprecio,
                            idcuentadesgloseprecio: rd.datos[i].idcuentadesgloseprecio,
                            idcategoriaprecio: rd.datos[i].idcategoriaprecio,
                            idcategoriaprecioentidad: rd.datos[i].idcategoriaprecioentidad,
                            listeners: {
                                cellclick: function(e, rd, row, col) {
                                    //me.gdCenter.getSelectionModel().getSelected().set(this.dataIndex, (me.gdCenter.getSelectionModel().getSelected().get(this.dataIndex) == '') ? 1 : 0);
                                    var gdSouth = me.gdEditable.getGridPrincipal(),
                                            cGdSouth = gdSouth.getColumnModel().config,
                                            records = gdSouth.getStore(),
                                            cmGdSouth = gdSouth.getColumnModel();
                                    if (records) {
                                        for (var i = 0; i < cGdSouth.length; i++) {
                                            if (cGdSouth[i].dataIndex == this.dataIndex) {
                                                var value = 0;
                                                if (me.gdCenter.getSelectionModel().getSelected().get(this.dataIndex) != 0) {
                                                    cmGdSouth.setEditable(i, false);
                                                    for (var k = 0; k < records.data.items.length; k++) {
                                                        var record = records.getAt(k);
                                                        //if ((record.get(this.dataIndex) == 0) || (record.get(this.dataIndex) == 0.00)) {
                                                        record.set(this.dataIndex, value);
                                                        me.getPrecioVentaTarifa({
                                                            grid: gdSouth,
                                                            record: record
                                                        });
                                                        /*} else {
                                                            record[this.dataIndex] = record.get(this.dataIndex);
                                                        }*/
                                                    }
                                                } else {
                                                    for (var k = 0; k < records.data.items.length; k++) {
                                                        var record = records.getAt(k);
                                                        value = (record.data[this.dataIndex]) ? record.data[this.dataIndex] : 0;
                                                        var editable = true;
                                                        if(cGdSouth[i].aplicartodos == '1'){
                                                            value = cGdSouth[i].valorAplicarTodos;
                                                            editable = false;
                                                        }
                                                        //delete record[this.dataIndex];
                                                        //record.commit();
                                                        record.set(this.dataIndex, value);

                                                        me.getPrecioVentaTarifa({
                                                            grid: gdSouth,
                                                            record: record
                                                        });
                                                    }
                                                    cmGdSouth.setEditable(i, editable);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        cmGeneral.push(c);
                        plugins.push(c);
                        fdGeneral.push({name: str.toLowerCase()});
                    }
                    me.decimalPrecision = (rd.datos[i].porciento == 1) ? 2 : 6;
                    if (rd.datos[i].aplicartodos == '1') {
                        me.valor_aplicar_todos = rd.datos[i].valor;
                        colm = str.toLowerCase();
                    }
                    cmEditable.push(new Ext.grid.Column({
                        header: rd.datos[i].denominacion,
                        dataIndex: str.toLowerCase(),
                        width: 100,
                        default: true,
                        dinamico: true,
                        categoria: 'categoria',
                        align: 'right',
                        editable: true,
                        idcuentadesgloseprecio: rd.datos[i].idcuentadesgloseprecio,
                        idcategoriaprecio: rd.datos[i].idcategoriaprecio,
                        idcategoriaprecioentidad: rd.datos[i].idcategoriaprecioentidad,
                        value: rd.datos[i].idcuentadesgloseprecio,
                        concepto: rd.datos[i].concepto,
                        signo: rd.datos[i].concepto,
                        porcentual: rd.datos[i].porciento,
                        aplicartodos: rd.datos[i].aplicartodos,
                        valorAplicarTodos: rd.datos[i].valor,
                        porciento: rd.datos[i].porciento,
                        conformaprecio: rd.datos[i].conformaprecio,
                        moneda: rd.datos[i].moneda,
                        renderer: function(v, m, rd) {
                            //var value = this.porcentual == "1" ? parseFloat(v).toFixed(2) + '%' : parseFloat(v).toFixed(6);
                            var value = (v) ? v : 0;
                            if(me.gdCenter.getSelectionModel().getSelected().get(this.dataIndex) != '1' ){
                                value = this.porcentual == "1" ? parseFloat(value).toFixed(2) + '%' : parseFloat(value).toFixed(2);
                            }
                            //if (v > 0) {
                            //}
                            /* else if (this.aplicartodos == "1") {
                             value = this.porcentual == "1" ? parseFloat(this.valorAplicarTodos).toFixed(2) + '%' : parseFloat(this.valorAplicarTodos).toFixed(6);
                             }*/
                            return value;
                        },
                        editor: new LOG.util.Prototipos.inputDecimal({
                            allowBlank: false,
                            minLength: me.idioma.lbMinLengthNumber,
                            minLengthText: me.idioma.lbMsgMinLongNumber,
                            maxLength: me.idioma.lbMaxLengthCode,
                            allowDecimals: me,
                            decimalPrecision: me.decimalPrecision,
                            decimalSeparator: '.', //
                            maxLengthText: me.idioma.lbMsgMaxLongNumber,
                            listeners: {
                                focus: function(t) {
                                    t.selectText(0, t.getValue().length);
                                }
                            }
                        })
                    }));
                    fdEditable.push({name: 'cobromateriales'});
                    fdEditable.push({name: str.toLowerCase()});
                }
                lastCmEditable.renderer = function(v, m, rd) {
                    if (v == 0) {
                        var precioventa = 0;
                        return parseFloat(precioventa).toFixed(2);
                    }
                    return parseFloat(v).toFixed(2);
                };
                cmEditable.push(lastCmEditable);
                var stGdGeneral = new Ext.data.Store({
                    url: me.idioma.urlConffacturacion + 'cargarListadoMatriz',
                    listeners: {
                        beforeLoad: function(st) {
                            if (me.cmbFsNorth.getValue() != "") {
                                st.initBaseParams.idtipoprecio = me.cmbFsNorth.getValue();
                                st.initBaseParams.idorigen = (me.cmbOrigen) ? me.cmbOrigen.getValue() : null;
                                st.initBaseParams.iddestino = (me.cmbDestino) ? me.cmbDestino.getValue() : null;
                                st.initBaseParams.fechavigencia = (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null;
                                st.initBaseParams.servicio = me.servicio;

                                st.baseParams.idtipoprecio = me.cmbFsNorth.getValue();
                                st.baseParams.idorigen = (me.cmbOrigen) ? me.cmbOrigen.getValue() : null;
                                st.baseParams.iddestino = (me.cmbDestino) ? me.cmbDestino.getValue() : null;
                                st.baseParams.fechavigencia = (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null;
                                st.baseParams.servicio = me.servicio;
                            }
                        },
                        load: function(st, rd) {
                            if (!me.gdCenter.getSelectionModel().hasSelection()) {
                                me.pGdSouth.disable();
                            }
                            me.fireStoreEvent(rd);
                        }
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        totalProperty: 'cantidad'
                    }, fdGeneral)
                });
                var stEditable = new Ext.data.Store({
                    url: me.idioma.urlConffacturacion + 'cargarDatosPorSeleccionMatriz',
                    listeners: {
                        beforeLoad: function(st) {
                            var selections = me.gdCenter.getSelectionModel().getSelected();
                            st.initBaseParams.idmatrizprecio = (selections.json.idmatrizprecio) ? selections.json.idmatrizprecio : -1;
                            st.initBaseParams.identificador = (selections.json.idindicador) ? selections.json.idindicador : selections.json.idservicio;
                            st.initBaseParams.idtipoprecio = me.cmbFsNorth.getValue();
                            st.initBaseParams.idorigen = (me.cmbOrigen) ? me.cmbOrigen.getValue() : null;
                            st.initBaseParams.iddestino = (me.cmbDestino) ? me.cmbDestino.getValue() : null;
                            st.initBaseParams.fechavigencia = (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null;

                            st.baseParams.idmatrizprecio = (selections.json.idmatrizprecio) ? selections.json.idmatrizprecio : -1;
                            st.baseParams.identificador = (selections.json.idindicador) ? selections.json.idindicador : selections.json.idservicio;
                            st.baseParams.idtipoprecio = me.cmbFsNorth.getValue();
                            st.baseParams.idorigen = (me.cmbOrigen) ? me.cmbOrigen.getValue() : null;
                            st.baseParams.iddestino = (me.cmbDestino) ? me.cmbDestino.getValue() : null;
                            st.baseParams.fechavigencia = (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null;
                        },
                        load: function(st, rd) {
                            for (var i = 0; i < rd.length; i++) {
                                rd[i].beginEdit();
                              //  rd[i].set(colm, me.valor_aplicar_todos);
                                rd[i].endEdit();
                            }
                        }
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        totalProperty: 'cantidad'
                    }, fdEditable)
                });
                me.gdEditable.getGridPrincipal().reconfigure(stEditable, new Ext.grid.ColumnModel(cmEditable));
                me.gdEditable.getGridPrincipal().getBottomToolbar().bindStore(stEditable);
//                Ext.each(plugins, function (p) {
//                    me.gdCenter.plugins.push(p);
//                });
                me.gdCenter.reconfigure(stGdGeneral, new Ext.grid.ColumnModel(cmGeneral));
                var bbarCenter = me.gdCenter.getBottomToolbar();
                bbarCenter.bindStore(stGdGeneral);
                me.gdCenter.getStore().load({
                    params: {
                        start: 0,
                        limit: bbarCenter.pageSize,
                        idtipoprecio: me.cmbFsNorth.getValue(),
                        servicio: me.servicio
                    }
                });
                //me.gdCenter.autoExpandColumn = 'text';
                var tbar = me.gdCenter.getTopToolbar().items.items;
                tbar[1].on('keyup', function(txt, e) {
                    if (e.getKey() === 13) {
                        var values = {
                            start: 0,
                            limit: bbarCenter.pageSize
                        };
                        if (tbar[1].isDirty()) {
                            values.criterio = tbar[1].getValue();
                        }
                        if (me.cmbFsNorth.isDirty()) {
                            values.idtipoprecio = me.cmbFsNorth.getValue();
                        }
                        if(tbar[1].getValue().length > 0){
                            me.gdCenter.getStore().reload({
                                params: values,
                                callback: function () {
                                    tbar[1].focus(false, 100);
                                    if (me.gdCenter.getStore().getCount() > 0) {
                                        me.gdCenter.getSelectionModel().selectFirstRow();
                                    }
                                }
                            });
                        }
                    }
                });
                tbar[3].setHandler(function() {
                    var values = {
                        start: 0,
                        limit: bbarCenter.pageSize
                    };
                    if (tbar[1].isDirty()) {
                        values.criterio = tbar[1].getValue();
                    }
                    if (me.cmbFsNorth.isDirty()) {
                        values.idtipoprecio = me.cmbFsNorth.getValue();
                    }
                    if (tbar[1].getValue().length > 0) {
                        me.gdCenter.getStore().reload({
                            params: values,
                            callback: function () {
                                tbar[1].focus(false, 100);
                                if (me.gdCenter.getStore().getCount() > 0) {
                                    me.gdCenter.getSelectionModel().selectFirstRow();
                                }
                            }
                        });
                    }
                });
                tbar[5].setHandler(function() {
                    tbar[1].reset();
                    me.gdCenter.getStore().reload({
                        params: {
                            start: 0,
                            limit: bbarCenter.pageSize,
                            idtipoprecio: me.cmbFsNorth.getValue()
                        }
                    });
                });
            }
        });
    },
    tbarGdSouth: function() {
        var me = this;
        var tbarGdSouth = me.pGdSouth.items.items[0].getTopToolbar();
        tbarGdSouth.items.items[0].on('click', function() {
            tbarGdSouth.items.items[0].setHandler(function() {
                var gdSouth = me.pGdSouth.items.items[0];
                gdSouth.stopEditing();
                var columns = gdSouth.getColumnModel().config,
                        cm = gdSouth.getColumnModel(),
                        smGdCenter = me.gdCenter.getSelectionModel().getSelected().data,
                        newData = {};
                for (var i = 1; i < columns.length; i++) {
                    if (columns[i].dataIndex == 'idmoneda') {
                        newData[columns[i].dataIndex] = '';
                    } else {
                        newData[columns[i].dataIndex] = 0;
                    }
                }
                for (var j in smGdCenter) {
                    for (var i = 1; i < columns.length; i++) {
                        if (columns[i].dinamico && j == columns[i].dataIndex) {
                            cm.setEditable(i, smGdCenter[j] == 0 ? true : false);
                        }
                    }
                }
                gdSouth.getStore().insert(0, new Ext.data.Record(newData));
                gdSouth.startEditing(0, 0);
                this.setDisabled(true);
            });
        });
    },
    selectionChangeInCenter: function() {
        var me = this;
        me.gdCenter.getSelectionModel().fireEvent = me.gdCenter.getSelectionModel().fireEvent.createSequence(function(e) {
            var selections = me.gdCenter.getSelectionModel().getSelections();
            if (e == 'rowselect') {
                if (selections.length == 1) {
                    me.pGdSouth.setDisabled(/*selections[0].get('preciopromedio') ? true : */false);
                    if (me.servicio) {
                        me.gdEditable.getGridPrincipal().getColumnModel().setHidden(me.gdEditable.getGridPrincipal().getColumnModel().findColumnIndex('cobromateriales'), (selections[0].data.cobromateriales == "") ? true : false);
                    }
                    me.gdEditable.getGridPrincipal().getStore().load({
                        params: {
                            idmatrizprecio: (selections[0].get('idmatrizprecio')) ? selections[0].get('idmatrizprecio') : -1,
                            identificador: selections[0].get('idindicador'),
                            idtipoprecio: me.cmbFsNorth.getValue(),
                            idorigen: (me.cmbOrigen) ? me.cmbOrigen.getValue() : null,
                            iddestino: (me.cmbDestino) ? me.cmbDestino.getValue() : null,
                            fechavigencia: (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null
                        },
                        callback: function(rd) {
                            var tbar = me.gdEditable.getPanelPrincipal().items.items[0].getTopToolbar();
                            //tbar.items.items[1].setDisabled((rd.length > 0) ? true : false);
                            me.getPrecioVentaTarifa({
                                grid: me.gdEditable.getGridPrincipal(),
                                record: me.gdEditable.getGridPrincipal().getStore().getAt(0)
                            });
                            me.gdEditable.getGridPrincipal().getStore().commitChanges();
                        }
                    });
                } else {
                    me.pGdSouth.disable();
                    me.gdEditable.getGridPrincipal().getStore().removeAll();
                }
            } else if (e == 'rowdeselect') {
                if (!me.gdCenter.getSelectionModel().hasSelection()) {
                    me.pGdSouth.disable();
                    me.gdEditable.getGridPrincipal().getStore().removeAll();
                }
                me.pGdSouth.disable();
                me.gdEditable.getGridPrincipal().getStore().removeAll();
            }
        });
    },
    getDatasMatrizDePrecios: function() {
        var me = this;
        var selectionModel = me.gdCenter.getSelectionModel(), flag = true;
        if (selectionModel.hasSelection()) {
            var matrizGeneralDatas = me.getDatasMatrizGeneral();
            var matrizPreciosDatas = me.getDatasMatrizPrecios();
            for (var i = 0; i < matrizGeneralDatas.length; i++) {
                if (matrizGeneralDatas[i].idindicador == matrizPreciosDatas.idindicador
                    && matrizGeneralDatas[i].idmatrizprecio == matrizPreciosDatas.idmatrizprecio
                ) {
                    matrizGeneralDatas[i].matrizPreciosDatas = matrizPreciosDatas;
                    flag = false;
                }

            }
            return {
                idtipoprecio: me.cmbFsNorth.getValue(),
                idorigen: (me.cmbOrigen) ? me.cmbOrigen.getValue() : null,
                iddestino: (me.cmbDestino) ? me.cmbDestino.getValue() : null,
                fechavigencia: (me.dfVigencia && me.dfVigencia.getValue()) ? me.dfVigencia.getValue().format('d/m/Y') : null,
                idmatrizprecio: selectionModel.getSelected().data.idmatrizprecio,
                idindicador: selectionModel.getSelected().data.idindicador,
                matrizGeneralDatas: matrizGeneralDatas,
                matrizPreciosDatas: (flag) ? matrizPreciosDatas : ""
            };
        } else {
            return false;
        }
    },
    getDatasMatrizGeneral: function() {
        var me = this;
        var columnModel = me.gdCenter.getColumnModel(),
                modificados = me.gdCenter.getStore().getModifiedRecords(),
                retorno = new Array();
        Ext.each(modificados, function(recd) {
            var add = new Array();
            var del = new Array();
            if (recd.dirty) {
                for (var i = 0; i < columnModel.config.length; i++) {
                    if (columnModel.config[i].dinamico) {
                        var dataIndex = columnModel.config[i].dataIndex;
                        if (typeof (recd.modified[dataIndex]) != 'undefined') {
                            if (parseInt(recd.data[dataIndex]) === 1 || recd.data[dataIndex] === true) {
                                add.push(columnModel.config[i].value);
                            } else {
                                del.push(columnModel.config[i].value);
                            }
                        }
                    }
                }
                if ((add.length > 0) || (del.length > 0) ||
                    (typeof (recd.modified['preciopromedio']) != 'undefined') ||
                    (typeof (recd.modified['bi']) != 'undefined') ||
                    (typeof (recd.modified['cobromateriales']) != 'undefined') ||
                    (typeof (recd.modified['umedida']) != 'undefined')) {
                    var obj = {
                        idindicador: recd.get('idindicador'),
                        idmatrizprecio: recd.get('idmatrizprecio'),
                        idumedida: recd.get('idunidadmedida'),
                        preciopromedio: (!me.servicio) ? recd.get('preciopromedio') : recd.get('cobromateriales'),
                        bi: recd.get('bi'),
                        add: add,
                        del: del
                    };
                    retorno.push(obj);
                }
            }
        });
        return (retorno.length > 0) ? retorno : false;
    },
    getDatasMatrizPrecios: function() {//aki
        var me = this;
        var selectionModelCenter = me.gdCenter.getSelectionModel();
        var records = me.gdEditable.getGridPrincipal().getStore().getModifiedRecords(); //Guarda las tuplas modificadas o adicionadas del grid
        if (records.length > 0) {
            var arrayDatas = new Array();
            var columnModel = me.gdEditable.getGridPrincipal().getColumnModel();
            Ext.each(records, function(record) {
                var columnDinamicaDatas = new Array();
                for (var i = 0; i < columnModel.config.length; i++) {
                    var columnConfig = columnModel.config[i];
                    if (columnConfig.dinamico && columnConfig.conformaprecio == 1) {
                        columnDinamicaDatas.push({
                            'idcuentadesgloseprecio': columnConfig.idcuentadesgloseprecio,
                            'porciento': columnConfig.porciento,
                            'valor': parseFloat(record.get(columnConfig.dataIndex)),
                            'concepto': columnConfig.concepto
                        });
                    }
                }
                arrayDatas.push({
                    //idmatrizprecio: selectionModelCenter.getSelected().data.idmatrizprecio,
                    //idindicador: selectionModelCenter.getSelected().data.idindicador,
                    idmatrizpreciodualidadmonetaria: record.get('idmatrizpreciodualidadmonetaria'),
                    idmoneda: record.get('idmoneda'),
                    precio: parseFloat(record.get('precio')),
                    columnDinamicaDatas: columnDinamicaDatas,
                    precioventa: parseFloat(record.get('precioventa'))
                })

            });
            return arrayDatas;/*{
             idmatrizprecio: selectionModelCenter.getSelected().data.idmatrizprecio,
             idindicador: selectionModelCenter.getSelected().data.idindicador,
             dualidad: arrayDatas
             };*/
        } else {
            return false;
        }
    },
    initGridEditableBySelection: function(config) {
        var me = this;
        this.tipoPrecio = config.tipoPrecio;
        this.gdEditable = new Fact.conf.gridGeneral({
            idioma: this.idioma,
            gdPrincipal: false,
            gdCenter: this.gdCenter,
            servicio: this.servicio,
            tipoPrecio: this.cmbFsNorth.getValue(),
            url: 'cargarDatosPorSeleccionMatriz',
            modoSeleccion: 2
        });
        this.gdEditable.init();
        this.gridEditableBySelection = this.gdEditable.view();
        this.gdEditable.getSmPrincipal().on('selectionchange', function(sm) {
            var selections = sm.getSelections(),
                tbar = me.gdEditable.getPanelPrincipal().items.items[0].getTopToolbar();
            tbar.items.items[2].setDisabled((selections.length > 0) ? false : true);
        });
        this.gdEditable.getGridPrincipal().addListener('afteredit', function(e) {
            if (me.gdEditable.getSmPrincipal().hasSelection()) {
                me.getPrecioVentaTarifa(e);
            }
        });
        /*this.gdEditable.getGridPrincipal().addListener('afteredit', function(e) {
            if (me.gdEditable.getSmPrincipal().hasSelection()) {
                me.getPrecioVentaTarifa(e);
            }
        });*/
        this.gdEditable.getGridPrincipal().addListener('beforeedit', function(e) {
            var columns = me.gdEditable.getGridPrincipal().getColumnModel().config;
            for (var i = 1; i < columns.length; i++) {
                if (/*columns[i].dinamico && */e.field == columns[i].dataIndex) {
                    if(columns[i].moneda != e.record.data.idmoneda && columns[i].moneda != undefined){
                        e.cancel = true;
                        break;
                    }
                    if (me.gdCenter.getSelectionModel().getSelected().data[e.field] == 1) {
                        e.cancel = true;
                        break;
                    }
                }
            }
        });
        this.gdEditable.getPanelSuperior().getTopToolbar().items.get(1).setHandler(function() {
            var gdSouth = me.gdEditable.getGridPrincipal();
            gdSouth.stopEditing();
            //aki
            var columns = gdSouth.getColumnModel().config,
                    cm = gdSouth.getColumnModel(),
                    smGdCenter = me.gdCenter.getSelectionModel().getSelected().data,
                    newData = {};
            var valoresAdicionados = me.gdEditable.getGridPrincipal().getStore().data.items;
            var monedas = me.gdEditable.cmbMoneda.getStore().data.items;
            var seleccione = false;
            for(var k = 0; k < monedas.length; k++){
                var esta = false;
                for(var p = 0; p < valoresAdicionados.length; p++){
                    if(valoresAdicionados[p].data.idmoneda == monedas[k].data.idmoneda){
                        esta = true;
                    }
                }
                if(!esta){
                    me.gdEditable.cmbMoneda.setValue(monedas[k].data.idmoneda);
                    seleccione = true;
                    break;
                }
            }
            if(!seleccione){
                mostrarMensaje(1, me.idioma.msgNoMonedas);
                return;
            }
            for (var i = 1; i < columns.length; i++) {
                newData[columns[i].dataIndex] = columns[i].dataIndex == 'idmoneda'
                        ? me.gdEditable.cmbMoneda.getValue()
                        : ((columns[i].aplicartodos == 1 && ((columns[i].moneda == '')||(columns[i].moneda == me.gdEditable.cmbMoneda.getValue()))) ? columns[i].valorAplicarTodos : 0);
            }
            for (var j in smGdCenter) {
                for (var i = 1; i < columns.length; i++) {
                    if (columns[i].dinamico && j == columns[i].dataIndex) {
                        cm.setEditable(i, smGdCenter[j] == 0 ? true : false);
                    }
                }
            }
            gdSouth.getStore().insert(0, new Ext.data.Record(newData));
            gdSouth.startEditing(0, 0);
            //this.setDisabled(true);

        });
        this.gdEditable.getPanelSuperior().getTopToolbar().items.get(2).setHandler(function() {
            var selection = me.gdEditable.getSmPrincipal().getSelections();
            if (me.gdEditable.getSmPrincipal().hasSelection()) {
                var datos = new Array();
                Ext.each(selection, function(sel) {
                    if (sel.json) {
                        datos.push({
                            idmatrizpreciodualidadmonetaria: sel.json.idmatrizpreciodualidadmonetaria,
                            idtipoprecio: me.tipoPrecio
                        });
                    }
                });
                mostrarMensaje(2, (!me.servicio) ? me.idioma.msgConfirmacionPS : me.idioma.msgConfirmacionTS, function(btn) {
                    if (btn == 'ok') {
                        if (datos.length > 0) {
                            Ext.Ajax.request({
                                url: me.idioma.urlConffacturacion + 'eliminarDatosPorSeleccionMatriz',
                                method: 'post',
                                params: {
                                    datos: Ext.encode(datos)
                                },
                                success: function(r) {
                                    var s = Ext.decode(r.responseText);
                                    if (s.success == true) {
                                        //me.gdEditable.getGridPrincipal().getStore().removeAll();
                                        me.gdEditable.getGridPrincipal().getStore().reload();
                                        me.gdEditable.getGridPrincipal().getStore().rejectChanges();
                                    }
                                }
                            });
                        }
                        else {
                            //me.gdEditable.getGridPrincipal().getStore().removeAll();
                        }
                        mostrarMensaje(1, (!me.servicio) ? me.idioma.msgEliminadoPS : me.idioma.msgEliminadoTS);
                        me.gdEditable.getPanelSuperior().getTopToolbar().items.get(1).enable();
                    }
                });
            }
        });
        return this.gridEditableBySelection;
    },
    createFieldsEditable: function() {
        return [
            {name: 'idmatrizpreciodualidadmonetaria'},
            {name: 'codigoiso'},
            {name: 'idmoneda'},
            {name: 'precio'},
            {name: 'precioventa'}
        ];
    },
    createNewColumnModelGridGeneral: function(no) {
        var me = this;
        this.cbUM = new LOG.util.ComboBox({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
            name: 'idunidadmedida',
            valueField: 'idunidadmedida',
            displayField: 'abreviaturaunidadmedida',
            selectOnlyLeaf: true,
            autoLoad: false
        });
        this.column = [];
        if (no)
            this.column.push(new Ext.grid.RowNumberer({header: me.idioma.cmNo}));
        this.column.push({
            header: 'Configurado',
            dataIndex: 'texto',
            width: 80,
            filter : {
                type : 'combo',
                store : new Ext.data.SimpleStore({
                    fields: ['configurado', 'texto'],
                    data: [['-1','No'],['1', 'Si']]
                }),
                valueField : 'configurado',
                displayField: 'texto',
                dataIndex : 'texto',
            },
            renderer: function(v, m, rd) {
                if (rd.data.configurado == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        });
        this.column.push({
            header: this.idioma.cmCodDesc,
            dataIndex: 'text',
            id: 'text',
            width: 500,
            default: true
        });
        this.column.push({
            header: this.idioma.cmUnidadMedida,
            dataIndex: 'umedida',
            id: 'um',
            width: 50,
            default: true,
            editor: me.cbUM,
            renderer: function (_v, _mD, _r) {
                if (me.cargado) {
                    _r.data.idunidadmedida = Ext.isNumber(parseInt(_v)) ? _v : _r.json.idunidadmedida;
                    var record = this.editor.getStore().getById(_r.data.idunidadmedida);
                }
                return record ? record.data.abreviaturaunidadmedida : _r.data.umedida;
            }

        });
        if (!me.servicio) {
            this.column.push({
                header: this.idioma.cmNaturaleza,
                dataIndex: 'naturaleza',
                id: 'naturaleza',
                width: 100,
                default: true,
                filter : {
                    type : 'combo',
                    url : me.idioma.urlConffacturacion + 'obtenerNaturaleza',
                    valueField : 'idnaturaleza',
                    displayField: 'codigo',
                    dataIndex : 'naturaleza',
                }
            });
        } else {
            this.column.push({
                header: this.idioma.lbClasificacion,
                dataIndex: 'clasificacion',
                id: 'clasificacion',
                width: 100,
                default: true,
                filter : {
                    type : 'combo',
                    url : me.idioma.urlConffacturacion + 'obtenerClasificacion',
                    valueField : 'idclasificacioncontable',
                    displayField: 'denominacion',
                    dataIndex : 'clasificacion',
                }
            });
        }
        this.column.push({
            dataIndex: 'idunidadmedida',
            hidden: true
        });
        this.column.push({
            dataIndex: 'configurado',
            hidden: true
        });
        return this.column;
    },
    recuperacionDinamicaValoresIniciales: function(parametros) {
        for (var i = 0; i < parametros.columnModel.config.length; i++) {
            if (parametros.columnModel.config[i].dinamico && parametros.columnModel.config[i].conformaprecio == 1) {
                if (parametros.columnModel.config[i].editable == true) {
                    if (parametros.columnModel.config[i].concepto == '-') {
                        var dataIndex = parametros.columnModel.config[i].dataIndex;
                        if ((parametros.record.get(dataIndex) != 0) || (parametros.record.get(dataIndex) != "")) {
                            parametros.record.set(dataIndex, 0);

                        }
                    }
                }
            }
        }
    },
    /** Metodo que obtiene las sumas de los conceptos negativo**/
    getValoresCategoriasNegativas: function(parametros) {
        var negativas = 0;
        for (var i = 0; i < parametros.columnModel.config.length; i++) {
            if (parametros.columnModel.config[i].dinamico && parametros.columnModel.config[i].conformaprecio == 1) {
                if (parametros.columnModel.config[i].editable == true) {
                    if (parametros.columnModel.config[i].concepto == '-') {
                        if(parametros.columnModel.config[i].porciento != '1'){
                            var dataIndex = parametros.columnModel.config[i].dataIndex;
                            if (parametros.record && (typeof (parametros.record.get(dataIndex)) != 'undefined')) {
                                if ((parametros.record.get(dataIndex) != 0) || (parametros.record.get(dataIndex) != "")) {
                                    negativas += parametros.record.get(dataIndex);
                                }
                            }
                        } else {
                            var dataIndex = parametros.columnModel.config[i].dataIndex;
                            if (parametros.record && (typeof (parametros.record.get(dataIndex)) != 'undefined')) {
                                if ((parametros.record.get(dataIndex) != 0) || (parametros.record.get(dataIndex) != "")) {
                                    negativas += parametros.record.get('precio') * parametros.record.get(dataIndex) / 100;
                                }
                            }
                        }
                    }
                }
            }
        }
        return negativas;
    },
    /** Metodo que obtiene las sumas de las categoria que no son porcentual**/
    getValoresCategoriasNoPorcentuales: function(parametros) {
        var _this = this;
        var smGdCenter = _this.gdCenter.getSelectionModel().getSelected().data;
        var porcentualNo = 0;
        for (var i = 0; i < parametros.columnModel.config.length; i++) {
            if (parametros.columnModel.config[i].dinamico && parametros.columnModel.config[i].conformaprecio == 1) {
                if (parametros.columnModel.config[i].editable == true || parametros.columnModel.config[i].aplicartodos == 1) {
                    var dataIndex = parametros.columnModel.config[i].dataIndex;
                    if ((typeof (parametros.record.get(dataIndex)) != 'undefined') && smGdCenter[dataIndex] != '1') {
                        if ((parametros.record.get(dataIndex) != 0) || (parametros.record.get(dataIndex) != "") || (parametros.record.get(dataIndex) != null)) {
                            if (parametros.columnModel.config[i].porciento != '1') {
                                var num = parametros.record.get(dataIndex) != '' ? parametros.record.get(dataIndex) : 0;
                                if (parametros.columnModel.config[i].concepto == '+') {
                                    porcentualNo = parseFloat(porcentualNo) + parseFloat(num);
                                } else {
                                    porcentualNo = parseFloat(porcentualNo) - parseFloat(num);
                                }
                            }
                        }
                    }
                }
            }
        }
        return porcentualNo;
    },
    /** Metodo que obtiene las sumas de las categoria que son porcentual**/
    getValoresCategoriasPorcentuales: function(parametros) {
        var _this = this;
        var porcentualSi = 0;
        var precio = parseFloat(parametros.precio);
        var smGdCenter = _this.gdCenter.getSelectionModel().getSelected().data;
        for (var i = 0; i < parametros.columnModel.config.length; i++) {
            if (parametros.columnModel.config[i].dinamico && parametros.columnModel.config[i].conformaprecio == 1) {
                if (parametros.columnModel.config[i].editable == true || parametros.columnModel.config[i].aplicartodos == 1) {
                    var dataIndex = parametros.columnModel.config[i].dataIndex;
                    if ((typeof (parametros.record.get(dataIndex)) != 'undefined') && smGdCenter[dataIndex] != '1') {
                        if ((parametros.record.get(dataIndex) != 0) || (parametros.record.get(dataIndex) != "") || (parametros.record.get(dataIndex) != null)) {
                            if (parametros.columnModel.config[i].porciento == '1') {
                                var num = parametros.record.get(dataIndex) != '' ? parametros.record.get(dataIndex) : 0;
                                var value = (parseFloat(num) / 100) * precio;
                                if (parametros.columnModel.config[i].concepto == '+') {
                                    porcentualSi += value;
                                } else {
                                    porcentualSi -= value;
                                }
                            }

                        }
                    }
                }
            }
        }
        return porcentualSi;
    },
    getValoresAplicarTodos: function(parametros) {
        var aplicarTodos = 0;
        var precio = parseFloat(parametros.precio);
        for (var i = 0; i < parametros.columnModel.config.length; i++) {
            if (parametros.columnModel.config[i].dinamico) {
                var dataIndex = parametros.columnModel.config[i].dataIndex;
                if ((typeof (parametros.record.get(dataIndex)) != 'undefined')) {
                    if ((parametros.record.get(dataIndex) != 0) || (parametros.record.get(dataIndex) != "") || (parametros.record.get(dataIndex) != null)) {
                        if (parametros.columnModel.config[i].aplicartodos == '1') {
                            var num = parametros.columnModel.config[i].valorAplicarTodos;
                            if (parametros.columnModel.config[i].porciento == '1') {
                                var value = (parseFloat(num) / 100) * precio;
                                if (parametros.columnModel.config[i].concepto == '+') {
                                    aplicarTodos = parseFloat(aplicarTodos) + parseFloat(value);
                                } else {
                                    aplicarTodos = parseFloat(aplicarTodos) - parseFloat(value);
                                }
                            } else {
                                if (parametros.columnModel.config[i].concepto == '+') {
                                    aplicarTodos = parseFloat(aplicarTodos) + parseFloat(num);
                                } else {
                                    aplicarTodos = parseFloat(aplicarTodos) - parseFloat(num);
                                }
                            }
                        }
                    }
                }
            }
        }
        return aplicarTodos;
    },
    getPrecioVentaTarifa: function(e) {
        var _this = this;
        var columnModel = e.grid.getColumnModel();
        var precio_inicial = (e.record) ? parseFloat(e.record.data.precio) : 0;
        var precio = (e.record) ? parseFloat(e.record.data.precio) : 0;
        var parametros = {
            columnModel: columnModel,
            record: e.record
        };

        var negativas = this.getValoresCategoriasNegativas(parametros);
        if (precio_inicial > 0) {
            if (negativas < precio_inicial) {
                /*var aplicarTodos = this.getValoresAplicarTodos(parametros);
                 precio += aplicarTodos;*/
                parametros.precio = precio;
                var porcentualSi = this.getValoresCategoriasPorcentuales(parametros);
                precio += porcentualSi;
                var porcentualNo = this.getValoresCategoriasNoPorcentuales(parametros);
                precio += porcentualNo;
                if (parseInt(_this.gdCenter.getSelectionModel().getSelected().get('tipo')) == 2) {
                    var cobroMateriales = (parseFloat(e.record.get('cobromateriales'))) ? parseFloat(e.record.get('cobromateriales')) : 0;
                    precio += cobroMateriales;
                }
                e.record.set('precioventa', precio);

            } else {
                this.recuperacionDinamicaValoresIniciales(parametros);
                mostrarMensaje(1, _this.idioma.msgCantidadEntrada);
            }
        }else{
            if(e.record)
                e.record.set('precioventa', 0);
        }
    }
});
/**
 *<Componente> Panel Serie del documento
 */
Fact.conf.pSerieDocumento = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var me = this;
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.concepto = config.idioma.btnBuscarSerieDocumento;
        this.urlBusquedaGridPrincipal = config.idioma.urlConffacturacion + 'cargarSerieDocumento';
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        Fact.conf.pSerieDocumento.superclass.constructor.call(this, config);
        me.getVistaPrincipal().listeners = {
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
        me.keyNav = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (me.getVistaPrincipal().isVisible()) {
                        me.showWinSerieDocumento('add');
                    }
                }
            }, {
                key: "mM", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (me.getVistaPrincipal().isVisible()) {
                        me.showWinSerieDocumento('mod');
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function() {
                    if (me.getVistaPrincipal().isVisible()) {
                        me.deleteSerieDocumento();
                    }
                }
            }
        ]);
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: 'Estado',
            width: 55,
            dataIndex: 'estado',
            align: 'center',
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="Habilitado"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="Deshabilitado"';
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.lbDenominacion,
            //autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'tipodocumento',
            header: this.idioma.lbTipoDocumento,
            width: 200
        });
        this.addGridColumn({
            dataIndex: 'nrodocumentoinicial',
            header: this.idioma.lbHeaderInicial,
            width: 200
        });
        this.addGridColumn({
            header: 'Fecha inicio',
            dataIndex: 'fechainicio'
        })
        ;this.addGridColumn({
            header: 'Fecha fin',
            dataIndex: 'fechafin'
        });

        this.addGridColumn({
            dataIndex: 'idseriedocumento'
        });
        this.addGridColumn({
            dataIndex: 'idseriedocentidad'
        });
    },
    initDefaultButtons: function() {
        var me = this;
        this.btnHabilitar = new Ext.Button({
            text: 'Habilitar',
            tooltip: 'Habilitar serie',
            iconCls: 'habilitar',
            disabled: true,
            handler: function() {
                me.habilitarSerie(true);
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('CT') || me.grantedAction('RSeries')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(this.getCount() == 1 && this.getSelected().data.estado == 0));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.btnDeshabilitar = new Ext.Button({
            text: 'Deshabilitar',
            tooltip: 'Deshabilitar serie',
            iconCls: 'deshabilitar',
            disabled: true,
            handler: function() {
                me.habilitarSerie(false);
            },
            controlFn: function (b, _caller) {
                if (me.grantedAction('CT') || me.grantedAction('RSeries')) {
                    b.setVisible(true);
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(this.getCount() == 1 && this.getSelected().data.estado == 1));
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.lbTtBtnAdicionarSerieDocumento,
            handler: function() {
                me.showWinSerieDocumento('add');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            tooltip: this.idioma.lbTtBtnModificarSerieDocumento,
            disabled: true,
            handler: function() {
                me.showWinSerieDocumento('mod');
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.lbTtBtnEliminarSerieDocumento,
            disabled: true,
            handler: function() {
                me.deleteSerieDocumento();
            }
        }));
        this.addToolbarButton(this.btnHabilitar);
        this.addToolbarButton(this.btnDeshabilitar);
    },
    habilitarSerie: function(habilitar) {
        var _this = this;
        var estado = (habilitar) ? 1 : 0;
        var texthabilitar = (habilitar) ? 'habilitar' : 'deshabilitar';
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea '+texthabilitar+' la(s) serie(s) seleccionada(s)\x3f', function(btn) {
            if (btn === 'ok') {
                Ext.MessageBox.wait(((habilitar) ? 'Habilitando serie(s)' : 'Deshabilitando serie(s)'), 'Espere' || '...');
                var idseriedocumentos = _this.getSmPrincipal().getSelections(), seleccionados = [];
                for (var i = 0; i < idseriedocumentos.length; i++) {
                    seleccionados.push(idseriedocumentos[i].data.idseriedocumento);
                }
                Ext.Ajax.request({
                    url: _this.idioma.urlConffacturacion + 'habilitarSeries',
                    method: 'POST',
                    params: {
                        ids: Ext.encode(seleccionados),
                        estado: estado
                    },
                    callback: function(o, s, r) {
                        _this.getGridPrincipal().getStore().reload();
                        Ext.MessageBox.hide();
                        /*var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, me.idioma.msgSerieDocumentoEliminado);
                            me.getStorePrincipal().reload();
                        } else {
                            mostrarMensaje(1, me.idioma.msgErrorSerieDocumentoEliminar);
                        }*/
                    }
                });
            }
        });
    },
    deleteSerieDocumento: function() {
        var me = this;
        mostrarMensaje(2, me.idioma.msgSerieDocumentoConfirmarEliminar, function(btn) {
            if (btn === 'ok') {
                var idseriedocumentos = me.getSmPrincipal().getSelections(), eliminados = [];
                for (var i = 0; i < idseriedocumentos.length; i++) {
                    eliminados.push(idseriedocumentos[i].data.idseriedocentidad);
                }
                Ext.Ajax.request({
                    url: me.idioma.urlConffacturacion + 'actionsSerieDocumento',
                    method: 'POST',
                    params: {
                        eliminados: Ext.encode(eliminados),
                        action: 'del'
                    },
                    callback: function(o, s, r) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, me.idioma.msgSerieDocumentoEliminado);
                            me.getStorePrincipal().reload();
                        } else {
                            mostrarMensaje(1, me.idioma.msgErrorSerieDocumentoEliminar);
                        }
                    }
                });
            }
        });
    },
    showWinSerieDocumento: function(action) {
        var title = action === 'add' ? this.idioma.ttpAdicionarSerieDocumento : this.idioma.ttpModificarSerieDocumento, me = this;
        this.wSerieDocumento = new Fact.conf.wSerieDocumento({
            idioma: this.idioma,
            action: action,
            title: title,
            st: me.getStorePrincipal(),
            data: this.getSmPrincipal().getSelected() ? this.getSmPrincipal().getSelected().data : ''
        });
        this.wSerieDocumento.show();
    },
    render: function() {
        var p = Fact.conf.pSerieDocumento.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'rowdeselect') {
                me.listaBotones.getItem(1).disable();
                me.listaBotones.getItem(2).disable();
            } else if (e == 'rowselect') {
                me.listaBotones.getItem(1).enable();
                me.listaBotones.getItem(2).enable();
            }
        }, 'RCRUDSERIEDOCUMENTO');
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e, st, rd) {
            if (e == 'load' && rd.length == 0) {
                me.listaBotones.getItem(1).disable();
                me.listaBotones.getItem(2).disable();
            }
        }, 'CARGARSERIEDOCUMENTO');
        if (typeof me.btnHabilitar.controlFn == 'function') {
            me.btnHabilitar.controlFn.createDelegate(this, [me.btnHabilitar, this]).call();
        }
        if (typeof me.btnDeshabilitar.controlFn == 'function') {
            me.btnDeshabilitar.controlFn.createDelegate(this, [me.btnDeshabilitar, this]).call();
        }
        return p;
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
/**
 *Configuracion reporte ventas
 */
Fact.conf.ReporteVentas = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        this.idioma = config.idioma;
        var me = this;
        this.idestructuracomun = config.idconfiguracion;
        this.frame = true;
        this.layout = {
            type:'vbox',
            align:'stretch'
        };
        config.name = 'panelReporteVentas';
        config.items = [this.createGdCenter(), this.createGdSouth()];
        this.listeners = {
            afterrender: function() {
                me.stReporte.load();
            },
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
        me.keyNav = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (me.activateTap) {
                        //me.fnRangosGenerados("i");
                    }
                }
            }, {
                key: "mM", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (me.activateTap) {
                        //me.fnRangosGenerados("m");
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function() {
                    if (me.activateTap) {
                        //me.fnRangosGenerados("d");
                    }
                }
            }
        ]);
        Fact.conf.ReporteVentas.superclass.constructor.call(this, config);
        me.btnModReporte.controlFn.createDelegate(this, [me.btnModReporte, this]).call();
        me.btnDelReporte.controlFn.createDelegate(this, [me.btnDelReporte, this]).call();
    },
    fnRangosGenerados: function(flags, ctrl) {
        /*var me = this;
        if (flags === "i") {
            if (!me.gNumeroControl.disabled && ctrl) {
                if (!me.winNumeroControl || me.winNumeroControl.hidden) {
                    me.initwinNumeroControlComponent(me.idioma.lbBtnAdicionar, false);
                }
            } else {
                if (!me.winPuestoTrabajo || me.winPuestoTrabajo.hidden) {
                    me.initwinPuestoTrabajoComponent(me.idioma.lbBtnAdicionar, false);
                }
            }
        } else if (flags === "m") {
            if (!me.gNumeroControl.disabled && ctrl) {
                if (!me.winNumeroControl || me.winNumeroControl.hidden) {
                    me.initwinNumeroControlComponent(me.idioma.lbBtnModificar, true);
                }
            } else {
                if (!me.winPuestoTrabajo || me.winPuestoTrabajo.hidden) {
                    me.initwinPuestoTrabajoComponent(me.idioma.lbBtnModificar, true);
                }
            }
        } else if (flags === "d") {
            if (!me.gNumeroControl.disabled && ctrl) {
                if (me.smNumeroControl.hasSelection()) {
                    mostrarMensaje(2, me.idioma.confirmarEliminarSecPT, function(ok) {
                        if (ok === "ok") {
                            if (me.smNumeroControl.getSelected().json) {
                                me.delNumeroControl();
                            }
                        }
                    });
                }
            } else {
                if (me.smPuestoTrabajo.hasSelection()) {
                    mostrarMensaje(2, me.idioma.confirmarEliminarPuestoPT, function(ok) {
                        if (ok === "ok") {
                            if (me.smPuestoTrabajo.getSelected().json) {
                                me.delPuestoTrabajo();
                            }
                        }
                    });
                }
            }
        }*/
    },
    createGdSouth: function() {
        _this = this;
        this.pCentrocosto = new Fact.conf.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Centros de costo',
            concepto: 'centrocosto',
            util: {
                titleadd: 'Centros de costo',
                domain: 'DatReportecentrocosto',
                primaryKey: 'idreportecentro'
            },
            idioma: this.idioma
        });
        this.pServicios = new Fact.conf.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Servicios',
            concepto: 'servicio',
            util: {
                titleadd: 'Servicios',
                domain: 'DatReporteservicio',
                primaryKey: 'idreporteservicio'
            },
            idioma: this.idioma
        });
        this.pDepositos = new Fact.conf.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            title: 'Dep\xf3sitos',
            concepto: 'deposito',
            util: {
                titleadd: 'Dep\xf3sitos',
                domain: 'DatReportedeposito',
                primaryKey: 'idreportedeposito'
            },
            idioma: this.idioma
        });
        this.pOperacion = new Fact.conf.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            concepto: 'operacion',
            util: {
                titleadd: 'Operaciones',
                domain: 'DatReporteoperacion',
                primaryKey: 'idreporteoperacion'
            },
            title: 'Operaciones',
            idioma: this.idioma
        });
        this.pNaturaleza = new Fact.conf.panelGridGeneral({
            parentCmp: this,
            gpParent: _this.gReporte,
            concepto: 'naturaleza',
            util: {
                titleadd: 'Naturalezas',
                domain: 'DatReportenaturaleza',
                primaryKey: 'idreportenaturaleza'
            },
            title: 'Naturalezas',
            idioma: this.idioma
        });
        return {
            xtype: 'panel',
            flex: 1,
            //height: 250,
            layout: 'hbox',
            layoutConfig: {
                align:'stretch'
            },
            items: [_this.pCentrocosto, _this.pServicios, _this.pDepositos, _this.pOperacion, _this.pNaturaleza]
        };
    },
    createGdCenter: function() {
        var me = this;
        this.btnAddReporte = LOG.util.Prototipos.botonAdicionar({
            text: me.idioma.btnAdicionarPI, tooltip: 'Adicionar configuraci\xf3n',
            handler: function() {
                me.showWinAddReporte("add");
            }
        });
        this.btnModReporte = LOG.util.Prototipos.botonModificar({
            text: me.idioma.btnModificarPI,
            disabled: true,
            tooltip: 'Modificar configuraci\xf3n',
            handler: function() {
                me.showWinAddReporte("mod");
            },
            controlFn: function(b, cl){
                me.smReporte.fireEvent = me.smReporte.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (me.smReporte.getSelections().length == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        this.btnDelReporte = LOG.util.Prototipos.botonEliminar({
            text: me.idioma.lbBtnEliminar,
            disabled: true,
            tooltip: 'Eliminar configuraci\xf3n',
            handler: function() {
                if (me.smReporte.hasSelection()) {
                    mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar la(s) configuraci\xf3n(es) seleccionada(s)\x3f', function(ok) {
                        if (ok === "ok") {
                            me.delReporte();
                        }

                    });
                }
            },
            controlFn: function(b, cl){
                me.smReporte.fireEvent = me.smReporte.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (me.smReporte.getSelections().length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        /*this.activarReporte = LOG.util.UIManager.createBtn({
            text: me.idioma.lbBtnActivarRango,
            tooltip: 'Activar reporte',
            iconCls: 'activar',
            handler: function() {
                //me.activarDesactivar(1);
            },
            //disabled: true
        });*/
        /*this.desactivarReporte = LOG.util.UIManager.createBtn({
            text: me.idioma.lbBtnDesActivarRango,
            tooltip: 'Desactivar reporte',
            iconCls: 'activar rojo',
            hidden: true,
            handler: function() {
                //me.activarDesactivar(0);
            },
            //disabled: true
        });*/
        this.smReporte = LOG.util.UIManager.initSelectionModel(2);

        this.stReporte = new Ext.data.Store({
            url: this.idioma.urlConffacturacion + 'cargarReporteVenta',
            reader: new Ext.data.JsonReader({
                id: 'idreporteventa',
                root: 'datos', totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idreporteventa'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'activo'
                    },
                    {
                        name: 'idconfiguracion'
                    },
                    {
                        name: 'agrupacion'
                    },
                    {
                        name: 'orden'
                    }
                ]
            }),
            listeners: {
                'beforeload': function(st, opts) {
                    st.initBaseParams.idestructuracomun = me.parentCmp.idconfiguracion;
                    st.initBaseParams.limit = me.gReporte.getBottomToolbar().cbPageSize.getValue();
                },
                'load': function(thisstore, objeto) {
                    //Ext.getBody().unmask();
                }
            }
        });
        this.cmReporte = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: me.idioma.cmNo}),
            {
                dataIndex: 'denominacion',
                header: this.idioma.lbDenominacion,
                sortable: true,
                width: 120,
                id: 'denominacion'
            },{
                dataIndex: 'agrupacion',
                header: 'Agrupaci\xf3n',
                width: 400
            },{
                dataIndex: 'orden',
                header: 'Prioridad',
                width: 100
            }/*,
            {
                dataIndex: 'activo',
                header: 'Activo',
                sortable: true,
                width: 80,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }*/
        ]);
        this.gReporte = LOG.util.UIManager.initEditableGridPanel(
            this.cmReporte, this.stReporte, this.smReporte, {nobbar: false}
        );
        /*this.gPuestoTrabajo.getSelectionModel().addListener('selectionchange', function(sm) {
         var selections = sm.getSelections();
         me.btnDelPuestoTrabajo.setDisabled((selections.length > 0) ? false : true);
         });*/
        this.gReporte.getTopToolbar().add([this.btnAddReporte, this.btnModReporte, this.btnDelReporte/*, this.activarReporte, this.desactivarReporte*/]);
        this.gReporte.flex = 1;
        this.gReporte.title = 'Reportes de ventas';
            this.gReporte.autoExpandColumn = 'denominacion';
            //this.gReporte.region = 'center';
        return this.gReporte;
    },
    showWinAddReporte: function(action) {
        var _this = this;
        var title = action === 'add' ? 'Adicionar reporte de ventas' : 'Modificar reporte de ventas';
        this.wReporteVentas = new Fact.conf.wReporteVentas({
            idioma: this.idioma,
            action: action,
            title: title,
            st: _this.stReporte,
            data: _this.smReporte.getSelected() ? _this.smReporte.getSelected().data : ''
        });
        this.wReporteVentas.show();
    },
    delReporte: function(){
        var _this = this;
        var seleccion = _this.smReporte.getSelections();
        var ids = Array();
        Ext.each(seleccion, function(r){
            ids.push(r.data.idreporteventa);
        });
        Ext.Ajax.request({
            url: _this.idioma.urlConffacturacion + 'actionsReporteVenta',
            method: 'post',
            params: {
                actions: 'del',
                idreporteventa: Ext.encode(ids)
            },
            callback: function(conf, opts, response) {
                var responseText = Ext.decode(response.responseText);
                if (responseText.success) {
                    mostrarMensaje(1, 'La(s) configuraci\xf3n(es) ha(n) sido eliminada(s) satisfactoriamente');
                    _this.stReporte.reload();

                } else {

                }
            }
        });
    },
    initwinPuestoTrabajoComponent: function(idioma, flags) {
        /*var me = this;
        this.tfDenominacion = new Ext.form.TextArea({
            fieldLabel: this.idioma.cmDesc,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%',
            regex: LOG.util.Regex.cadena,
            maxLength: 255,
            minLength: 2,
            regexText: this.idioma.lbMsgAlfaNumericos,
            enableKeyEvents: true,
            maxLengthText: this.idioma.lbMsgMaxLongTextPuesto,
            listeners: {
                keyup: function(obj) {
                    if (obj.isDirty() && obj.isValid()) {
                        me.winPuestoTrabajo.listaBotones.getItem(2).enable();
                        me.winPuestoTrabajo.listaBotones.getItem(1).enable();
                    } else {
                        me.winPuestoTrabajo.listaBotones.getItem(2).disable();
                        me.winPuestoTrabajo.listaBotones.getItem(1).disable();
                    }
                }
            }
        });
        //Definiendo el campo de texto fecha desde
        this.dfDateBegin = new Ext.form.DateField({
            fieldLabel: me.idioma.lbFechaInicio,
            format: 'd/m/Y',
            altFormats: 'dmy',
            anchor: '95%',
            editable: false,
            endDateField: 'dfDateEnd',
            id: 'dfDateBegin',
            name: 'fechainicio',
            maskRe: /[\d\/]/,
            enableKeyEvents: true,
            vtype: 'daterange',
            listeners: {
                keyup: function(obj) {
                    if (obj.isDirty() && obj.isValid()) {
                        me.winPuestoTrabajo.listaBotones.getItem(1).enable();
                        me.winPuestoTrabajo.listaBotones.getItem(2).enable();
                    } else {
                        me.winPuestoTrabajo.listaBotones.getItem(1).disable();
                        me.winPuestoTrabajo.listaBotones.getItem(2).disable();
                    }
                }
            }
        });
        //Definiendo el campo de texto fecha hasta
        this.dfDateEnd = new Ext.form.DateField({
            fieldLabel: me.idioma.lbFechaFin,
            format: 'd/m/Y',
            altFormats: 'dmy',
            anchor: '95%',
            editable: false,
            startDateField: 'dfDateBegin',
            id: 'dfDateEnd',
            name: 'fechafin',
            maskRe: /[\d\/]/,
            enableKeyEvents: true,
            vtype: 'daterange',
            listeners: {
                keyup: function(obj) {
                    if (obj.isDirty() && obj.isValid()) {
                        me.winPuestoTrabajo.listaBotones.getItem(1).enable();
                        me.winPuestoTrabajo.listaBotones.getItem(2).enable();
                    } else {
                        me.winPuestoTrabajo.listaBotones.getItem(1).disable();
                        me.winPuestoTrabajo.listaBotones.getItem(2).disable();
                    }
                }
            }
        });
        this.fsRangoFecha = new Ext.form.FieldSet({
            autoHeight: true,
            title: this.idioma.lbHeaderRangoFecha
        });
        this.clsFsRangoFecha = LOG.util.UIManager.initColumnForm(2);
        this.clsFsRangoFecha.addComponent(this.dfDateBegin);
        this.clsFsRangoFecha.addComponent(this.dfDateEnd);
        this.fsRangoFecha.add(this.clsFsRangoFecha);
        this.fpPuestoTrabajo = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            region: 'center',
            items: [this.tfDenominacion, this.fsRangoFecha],
            trackResetOnLoad: true
        });

        this.winPuestoTrabajo = new LOG.util.Window({
            title: idioma + me.idioma.lbtitle2,
            width: 300,
            height: 270,
            layout: 'border',
            items: [this.fpPuestoTrabajo],
            aceptarFn: this.addPuestoTrabajo,
            usarAplicar: !flags,
            onCancelarHandler: function() {
                this.scope.destroy();
            },
            onAceptarHandler: function() {
                me.addPuestoTrabajo(true);
            },
            onAplicarHandler: function() {
                me.addPuestoTrabajo(false);
            },
            onCloseHandler: function(p) {
                p.destroy();
            }
        });
        if (flags) {
            this.fpPuestoTrabajo.getForm().loadRecord(me.gPuestoTrabajo.getSelectionModel().getSelected());
        }
        this.winPuestoTrabajo.listaBotones.getItem(1).disable();
        this.winPuestoTrabajo.listaBotones.getItem(2).disable();
        this.winPuestoTrabajo.show();*/
    },
    initwinNumeroControlComponent: function(idioma, flags) {
        /*var me = this;
        this.tfNumeroInicio = LOG.util.Prototipos.inputTexto({
            fieldLabel: me.idioma.lbHeaderInicio,
            name: 'nroinicio',
            anchor: '95%',
            maskRe: /[0-9'.-]$/,
            maxLength: 11,
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                keyup: function(txt) {
                    if ((txt.isValid() && txt.isDirty() && me.tfNumeroFin.isValid() && me.tfNumeroFin.isDirty()) || (flags && txt.isValid() && txt.isDirty())) {
                        me.winNumeroControl.listaBotones.getItem(2).enable();
                        if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
                            me.winNumeroControl.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.winNumeroControl.listaBotones.getItem(2).disable();
                        if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
                            me.winNumeroControl.listaBotones.getItem(1).disable();
                        }
                    }
                }
            },
            plugins: [
                new Ext.ux.InputTextMask({
                    mask: '99-99999999',
                    clearInvalid: false
                })
            ]
        });
        this.tfNumeroFin = LOG.util.Prototipos.inputTexto({
            fieldLabel: me.idioma.lbHeaderFinal,
            maskRe: /[0-9'.-]$/,
            allowBlank: false,
            name: 'nrofin',
            anchor: '95%',
            enableKeyEvents: true,
            listeners: {
                keyup: function(txt) {
                    if ((txt.isValid() && txt.isDirty() && me.tfNumeroInicio.isValid() && me.tfNumeroInicio.isDirty()) || (flags && txt.isValid() && txt.isDirty())) {
                        me.winNumeroControl.listaBotones.getItem(2).enable();
                        if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
                            me.winNumeroControl.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.winNumeroControl.listaBotones.getItem(2).disable();
                        if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
                            me.winNumeroControl.listaBotones.getItem(1).disable();
                        }
                    }
                }
            },
            plugins: [
                new Ext.ux.InputTextMask({
                    mask: '99-99999999',
                    clearInvalid: false
                })
            ]
        });
        this.fpNumeroControl = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            region: 'center',
            items: [this.tfNumeroInicio, this.tfNumeroFin]
        });
        if (flags) {
            var record = me.gNumeroControl.getSelectionModel().getSelected();
            this.fpNumeroControl.getForm().loadRecord(new Ext.data.Record({
                nroinicio: record.data.nrocontrolinicial,
                nrofin: record.data.nrocontrolfinal
            }));
        }
        this.winNumeroControl = new LOG.util.Window({
            title: idioma + me.idioma.lbtitle3,
            width: 300,
            height: 200,
            layout: 'border',
            items: [this.fpNumeroControl],
            usarAplicar: !flags,
            aceptarFn: this.addNumeroControl,
            onCancelarHandler: function() {
                me.winNumeroControl.destroy();
            },
            onAceptarHandler: function() {
                me.addNumeroControl(true);
            },
            onAplicarHandler: function() {
                me.addNumeroControl(false);
            },
            onCloseHandler: function(p) {
                me.winNumeroControl.destroy();
            }
        });
        this.winNumeroControl.listaBotones.getItem(2).disable();
        this.winNumeroControl.listaBotones.getItem(1).disable();
        this.winNumeroControl.show();*/
    },
    actionNumeroControl: function(flags) {
        /*var me = this;
        if (flags) {
            if (me.gNumeroControl.collapsed) {
                me.gNumeroControl.expand();
                me.gNumeroControl.enable();
            } else {
                me.gNumeroControl.enable();
                me.gNumeroControl.getStore().load();
            }
        } else {
            me.gNumeroControl.collapse();
            me.gNumeroControl.disable();
        }*/
    },
    addPuestoTrabajo: function(flags) {
        /*var _this = this;
        if (_this.isValidPuestoTrabajo()) {
            var params = _this.fpPuestoTrabajo.getForm().getValues();
            params.actionModel = (_this.winPuestoTrabajo.usarAplicar) ? 'add' : 'up';
            params.idpuestotrabajo = (!_this.winPuestoTrabajo.usarAplicar) ? _this.smPuestoTrabajo.getSelected().get('idpuestotrabajo') : '';
            params.idestructuracomun = _this.parentCmp.idconfiguracion;
            params.domain = _this.parentCmp.domain;
            _this.stPuestoTrabajo.reload({
                params: params,
                callback: function(conf, opts, response) {
                    if (response) {
                        var _this_idioma_msgOKAdicionar = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgOKAdicionarPuestoImp : _this.idioma.msgOKModificarPuestoImp;
                        mostrarMensaje(1, _this_idioma_msgOKAdicionar);
                        if (_this.win && !_this.win.hidden)
                            _this.fpPuestoTrabajo.getForm().reset();
                        if (flags)
                            _this.winPuestoTrabajo.close();
                    } else {
                        if (_this.stPuestoTrabajo.reader.jsonData.codigoMsg === 3) {
                            var _this_idioma_msgErrorAdicionar = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgExistePuestoPT : _this.idioma.msgModExistePuestoPT;
                            mostrarMensaje(1, _this_idioma_msgErrorAdicionar); //mensaje error
                        } else {
                            var _this_idioma_msgErrorAdicionarSecc = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgErrorAdicionarSecNumControl : _this.idioma.msgErrorModificarPuestoImp;
                            mostrarMensaje(1, _this.idioma.msgErrorAdicionarSecNumControl); //mensaje error
                        }
                    }
                }
            });
        }*/
    },
    delPuestoTrabajo: function() {
        /*var me = this;
        var me = this;
        var params = {};
        params.actionModel = 'del';
        params.domain = me.domain;
        params.idestructuracomun = me.idconfiguracion;
        var records = me.smPuestoTrabajo.getSelections();
        var idpuestotrabajoArray = new Array();
        for (var i = 0; i < records.length; i++) {
            idpuestotrabajoArray.push(records[i].get('idpuestotrabajo'));
        }
        params.idpuestotrabajo = Ext.encode(idpuestotrabajoArray);
        me.stPuestoTrabajo.reload({
            params: params,
            callback: function(conf, opts, response) {
                if (response) {
                    mostrarMensaje(1, me.idioma.msgEliminadoPuestoPT);
                } else {
//                    if (me.stPuestoTrabajo.reader.jsonData.codigoMsg === 3) {
                    mostrarMensaje(1, me.idioma.msgEliminarPuestoEnUso); //mensaje error
                }
                /!*else {
                 mostrarMensaje(1, me.idioma.msgErrorAdicionarSecNumControl); //mensaje error
                 }*!/
//                }
                me.smPuestoTrabajo.fireEvent('rowdeselect');
            }
        });*/
    },
    addNumeroControl: function(flags) {
        /*var _this = this;
        if (_this.isValidNumeroControl()) {
            var params = _this.fpNumeroControl.getForm().getValues();
            params.actionModel = (_this.winNumeroControl.usarAplicar) ? 'add' : 'up';
            params.idrango = (!_this.winNumeroControl.usarAplicar) ? _this.smNumeroControl.getSelected().get('idrango') : '';
            params.idpuestotrabajo = _this.smPuestoTrabajo.getSelected().get('idpuestotrabajo');
            params.idestructuracomun = _this.parentCmp.idconfiguracion;
            params.domain = _this.parentCmp.domain;

            Ext.Ajax.request({
                url: _this.idioma.urlConffacturacion + 'crudSecuenciaNumeroControl',
                method: 'post',
                params: params,
                callback: function(conf, opts, response) {
                    var responseText = Ext.decode(response.responseText);
                    if (responseText.success) {
                        var _this_idioma_msgOKAdicionar = (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgOKAdicionarSecControl : _this.idioma.msgOKModificarSecNumControl;
                        mostrarMensaje(1, _this_idioma_msgOKAdicionar);
                        _this.stNumeroControl.reload();
                        _this.fpNumeroControl.getForm().reset();
                        if (flags) {
                            _this.winNumeroControl.close();
                        }
                    } else {
                        mostrarMensaje(1, (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgDatosExisteRangoNC : _this.idioma.msgErrorNumeroControl);
                    }
                }
            });
        }*/
    },
    delNumeroControl: function() {
        /*var me = this;
        var params = {};
        params.actionModel = 'del';
        params.domain = me.domain;
        params.idestructuracomun = me.idconfiguracion;
        var records = me.smNumeroControl.getSelections();
        var idsecuenciapuestotrabajoArray = new Array();
        for (var i = 0; i < records.length; i++) {
            idsecuenciapuestotrabajoArray.push(records[i].get('idsecuenciapuestotrabajo'));
        }
        params.idsecuenciapuestotrabajo = Ext.encode(idsecuenciapuestotrabajoArray);
        me.stNumeroControl.reload({
            params: params,
            callback: function(conf, opts, response) {
                if (response) {
                    mostrarMensaje(1, me.idioma.msgEliminadoRango);
                } else {
                    mostrarMensaje(1, me.idioma.msgErrorEliminarSecNumControl); //mensaje error
                }
                me.smNumeroControl.fireEvent('rowdeselect');
            }
        });*/
    },
    isValidNumeroControl: function() {
        /*var _this = this;
        if (_this.fpNumeroControl.getForm().isValid()) {
            var values = _this.fpNumeroControl.getForm().getValues();
            var cIniArray = values.nroinicio.split("-");
            var cFinArray = values.nrofin.split("-");
            var vInicioUno = parseInt(cIniArray[0]);
            var vFinUno = parseInt(cFinArray[0]);
            var vInicioSec = parseInt(cIniArray[1]);
            var vFinSec = parseInt(cFinArray[1]);
            if (vInicioUno > vFinUno) {
                return false;
                mostrarMensaje(1, _this.idioma.msgNumeroControlInicioMenorFin); //mensaje error
            } else if (vInicioUno === vFinUno) {
                if (vInicioSec <= vFinSec) {
                    return true;
                } else if (vInicioSec > vFinSec) {
                    return false;
                    mostrarMensaje(1, _this.idioma.msgNumeroControlInicioMenorFin); //mensaje error
                }
            } else {
                return false;
                mostrarMensaje(1, _this.idioma.msgNumeroControlInicioFormatoFin); //mensaje error
            }
        } else {
            return false;
            mostrarMensaje(1, _this.idioma.msgDatosVacios); //mensaje error
        }
        return true;*/
    },
    isValidPuestoTrabajo: function() {
        /*var _this = this;
        if (_this.fpPuestoTrabajo.getForm().isValid()) {
            return true;
        } else {
            mostrarMensaje(1, _this.idioma.lbMsgCampoIvalido); //mensaje error
            return false;
        }*/
    },
    fireStoreEvent: function(rd) {
        /*  var me = this;
         if (rd.length == 0) {
         mostrarMensaje(1, me.idioma.msgNoDatos);
         }*/
    }
});

Fact.conf.panelGridGeneral = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        this.idioma = config.idioma;
        var me = this;
        this.parent = config.parent;
        this.gpParent = config.gpParent;
        this.flex = 1;
        this.layout = 'border';
        this.margins = '0 1 0 1';
        this.concepto = config.concepto;
        this.util = config.util;
        config.items = [this.createGdCenter()];

        Fact.conf.panelGridGeneral.superclass.constructor.call(this, config);
        me.btnAdd.controlFn.createDelegate(this, [me.btnAdd, this]).call();
        me.btnDel.controlFn.createDelegate(this, [me.btnDel, this]).call();
    },
    createGdCenter: function() {
        var me = this;
        this.btnAdd = LOG.util.Prototipos.botonAdicionar({
            text: me.idioma.btnAdicionarPI, tooltip: 'Adicionar '+me.concepto,
            disabled: true,
            handler: function() {
                var ventanaConcepto = new Fact.conf.addConceptos({
                    //idclientesproveedores: Ext.encode(idclientes),
                    concepto: me.concepto,
                    util: me.util,
                    idioma: me.idioma,
                    gpParent: me.gpParent,
                    urlBusquedaGridPrincipal: 'cargarConcepto'
                });
                ventanaConcepto.init();

                ventanaConcepto.getVistaPrincipal().title = me.util.titleadd;
                ventanaConcepto.view();
                ventanaConcepto.getGridPrincipal().store.load();
                var botonAceptar = ventanaConcepto.getVistaPrincipal().listaBotones.getItem(2);
                var botonAplicar = ventanaConcepto.getVistaPrincipal().listaBotones.getItem(1);
                botonAceptar.handler = botonAplicar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaConcepto.getGridPrincipal().getSelectionModel().getSelections();
                    var ids = Array();
                    Ext.each(records, function(r){
                        ids.push(r.data['id'+me.concepto]);
                    });
                    Ext.Ajax.request({
                        url: me.idioma.urlConffacturacion + 'actionsConcepto',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(ids),
                            util: Ext.encode(me.util),
                            actions: 'add',
                            idconcepto: 'id'+me.concepto,
                            idreporteventa: me.gpParent.getSelectionModel().getSelected().data.idreporteventa
                        },
                        callback: function(o, s, r) {
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                mostrarMensaje(1, me.action === 'mod' ? 'Los datos han sido modificados satisfactoriamente' : 'Los datos han sido guardados satisfactoriamente');
                                ventanaConcepto.getGridPrincipal().getStore().reload();
                                me.stConcepto.reload();
                            } else {
                                mostrarMensaje(1, me.action === 'mod' ? 'Los datos no fueron guardados' : 'Los datos no fueron guardados');
                            }
                        }
                    });
                });
            },
            controlFn: function(b, cl){
                me.gpParent.getSelectionModel().fireEvent = me.gpParent.getSelectionModel().fireEvent.createSequence(function (e) {
                    b.disable();
                    if (me.gpParent.getSelectionModel().getSelections().length == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                    if(e == 'selectionchange' && me.gpParent.getSelectionModel().getSelections().length == 1){
                        me.stConcepto.load();
                    }
                });
            }
        });
        this.btnDel = LOG.util.Prototipos.botonEliminar({
            text: me.idioma.lbBtnEliminar,
            disabled: true,
            tooltip: 'Eliminar '+me.concepto,
            handler: function() {
                var seleccion = me.smConcepto.getSelections();
                var ids = Array();
                Ext.each(seleccion, function(r){
                    ids.push(r.data[me.util.primaryKey]);
                });
                Ext.Ajax.request({
                    url: me.idioma.urlConffacturacion + 'actionsConcepto',
                    method: 'POST',
                    params: {
                        ids: Ext.encode(ids),
                        util: Ext.encode(me.util),
                        actions: 'del'
                    },
                    callback: function(o, s, r) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, me.action === 'mod' ? 'Los datos han sido eliminados satisfactoriamente' : 'Los datos han sido eliminados satisfactoriamente');
                            me.stConcepto.reload();
                        } else {
                            mostrarMensaje(1, me.action === 'mod' ? 'Los datos no pudieron ser eliminados' : 'Los datos no pudieron ser eliminados');
                        }
                    }
                });
            },
            controlFn: function(b, cl){
                me.smConcepto.fireEvent = me.smConcepto.fireEvent.createSequence(function (e) {
                    b.disable();
                    if (me.smConcepto.getSelections().length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });
        this.smConcepto = LOG.util.UIManager.initSelectionModel(2);

        this.stConcepto = new Ext.data.Store({
            url: this.idioma.urlConffacturacion + 'cargarConcepto',
            reader: new Ext.data.JsonReader({
                id: 'idreporte'+((me.concepto == 'centrocosto') ? 'centro' : me.concepto),
                root: 'datos', totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idreporte'+((me.concepto == 'centrocosto') ? 'centro' : me.concepto)
                    },
                    {
                        name: 'denominacion'
                    }
                ]
            }),
            listeners: {
                'beforeload': function(st, opts) {
                    st.initBaseParams.util = Ext.encode(me.util);
                    st.initBaseParams.concepto = me.concepto;
                    st.initBaseParams.idreporteventa = me.gpParent.getSelectionModel().getSelected().data.idreporteventa;
                    st.initBaseParams.limit = me.gConcepto.getBottomToolbar().cbPageSize.getValue();
                },
                'load': function(thisstore, objeto) {
                    //Ext.getBody().unmask();
                }
            }
        });
        this.cmConcepto = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: me.idioma.cmNo}),
            {
                dataIndex: 'denominacion',
                header: this.idioma.lbDenominacion,
                sortable: true,
                width: 120,
                id: 'denominacion'
            }
        ]);
        this.gConcepto = LOG.util.UIManager.initEditableGridPanel(
            this.cmConcepto, this.stConcepto, this.smConcepto, {nobbar: false}
        );
        /*this.gPuestoTrabajo.getSelectionModel().addListener('selectionchange', function(sm) {
         var selections = sm.getSelections();
         me.btnDelPuestoTrabajo.setDisabled((selections.length > 0) ? false : true);
         });*/
        this.gConcepto.getTopToolbar().add([this.btnAdd, this.btnDel]);
        this.gConcepto.title = me.concepto;
        //this.gConcepto.height = 250;
            this.gConcepto.autoExpandColumn = 'denominacion';
            this.gConcepto.region = 'center';
        return this.gConcepto;
    },
    addPuestoTrabajo: function(flags) {
        /*var _this = this;
        if (_this.isValidPuestoTrabajo()) {
            var params = _this.fpPuestoTrabajo.getForm().getValues();
            params.actionModel = (_this.winPuestoTrabajo.usarAplicar) ? 'add' : 'up';
            params.idpuestotrabajo = (!_this.winPuestoTrabajo.usarAplicar) ? _this.smPuestoTrabajo.getSelected().get('idpuestotrabajo') : '';
            params.idestructuracomun = _this.parentCmp.idconfiguracion;
            params.domain = _this.parentCmp.domain;
            _this.stPuestoTrabajo.reload({
                params: params,
                callback: function(conf, opts, response) {
                    if (response) {
                        var _this_idioma_msgOKAdicionar = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgOKAdicionarPuestoImp : _this.idioma.msgOKModificarPuestoImp;
                        mostrarMensaje(1, _this_idioma_msgOKAdicionar);
                        if (_this.win && !_this.win.hidden)
                            _this.fpPuestoTrabajo.getForm().reset();
                        if (flags)
                            _this.winPuestoTrabajo.close();
                    } else {
                        if (_this.stPuestoTrabajo.reader.jsonData.codigoMsg === 3) {
                            var _this_idioma_msgErrorAdicionar = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgExistePuestoPT : _this.idioma.msgModExistePuestoPT;
                            mostrarMensaje(1, _this_idioma_msgErrorAdicionar); //mensaje error
                        } else {
                            var _this_idioma_msgErrorAdicionarSecc = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgErrorAdicionarSecNumControl : _this.idioma.msgErrorModificarPuestoImp;
                            mostrarMensaje(1, _this.idioma.msgErrorAdicionarSecNumControl); //mensaje error
                        }
                    }
                }
            });
        }*/
    },
    delPuestoTrabajo: function() {
        /*var me = this;
        var me = this;
        var params = {};
        params.actionModel = 'del';
        params.domain = me.domain;
        params.idestructuracomun = me.idconfiguracion;
        var records = me.smPuestoTrabajo.getSelections();
        var idpuestotrabajoArray = new Array();
        for (var i = 0; i < records.length; i++) {
            idpuestotrabajoArray.push(records[i].get('idpuestotrabajo'));
        }
        params.idpuestotrabajo = Ext.encode(idpuestotrabajoArray);
        me.stPuestoTrabajo.reload({
            params: params,
            callback: function(conf, opts, response) {
                if (response) {
                    mostrarMensaje(1, me.idioma.msgEliminadoPuestoPT);
                } else {
//                    if (me.stPuestoTrabajo.reader.jsonData.codigoMsg === 3) {
                    mostrarMensaje(1, me.idioma.msgEliminarPuestoEnUso); //mensaje error
                }
                /!*else {
                 mostrarMensaje(1, me.idioma.msgErrorAdicionarSecNumControl); //mensaje error
                 }*!/
//                }
                me.smPuestoTrabajo.fireEvent('rowdeselect');
            }
        });*/
    },
    addNumeroControl: function(flags) {
        /*var _this = this;
        if (_this.isValidNumeroControl()) {
            var params = _this.fpNumeroControl.getForm().getValues();
            params.actionModel = (_this.winNumeroControl.usarAplicar) ? 'add' : 'up';
            params.idrango = (!_this.winNumeroControl.usarAplicar) ? _this.smNumeroControl.getSelected().get('idrango') : '';
            params.idpuestotrabajo = _this.smPuestoTrabajo.getSelected().get('idpuestotrabajo');
            params.idestructuracomun = _this.parentCmp.idconfiguracion;
            params.domain = _this.parentCmp.domain;

            Ext.Ajax.request({
                url: _this.idioma.urlConffacturacion + 'crudSecuenciaNumeroControl',
                method: 'post',
                params: params,
                callback: function(conf, opts, response) {
                    var responseText = Ext.decode(response.responseText);
                    if (responseText.success) {
                        var _this_idioma_msgOKAdicionar = (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgOKAdicionarSecControl : _this.idioma.msgOKModificarSecNumControl;
                        mostrarMensaje(1, _this_idioma_msgOKAdicionar);
                        _this.stNumeroControl.reload();
                        _this.fpNumeroControl.getForm().reset();
                        if (flags) {
                            _this.winNumeroControl.close();
                        }
                    } else {
                        mostrarMensaje(1, (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgDatosExisteRangoNC : _this.idioma.msgErrorNumeroControl);
                    }
                }
            });
        }*/
    },
    delNumeroControl: function() {
        /*var me = this;
        var params = {};
        params.actionModel = 'del';
        params.domain = me.domain;
        params.idestructuracomun = me.idconfiguracion;
        var records = me.smNumeroControl.getSelections();
        var idsecuenciapuestotrabajoArray = new Array();
        for (var i = 0; i < records.length; i++) {
            idsecuenciapuestotrabajoArray.push(records[i].get('idsecuenciapuestotrabajo'));
        }
        params.idsecuenciapuestotrabajo = Ext.encode(idsecuenciapuestotrabajoArray);
        me.stNumeroControl.reload({
            params: params,
            callback: function(conf, opts, response) {
                if (response) {
                    mostrarMensaje(1, me.idioma.msgEliminadoRango);
                } else {
                    mostrarMensaje(1, me.idioma.msgErrorEliminarSecNumControl); //mensaje error
                }
                me.smNumeroControl.fireEvent('rowdeselect');
            }
        });*/
    }
});

Fact.conf.addConceptos = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        this.dirController = '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.concepto = config.concepto;
        this.busquedaBasica = true;
        this.dataIndexPrincipal = config.dataIndexPrincipal;
        this.util = config.util;
        this.gpParent = config.gpParent;
        config = Ext.apply(_this, config);
        Fact.conf.addConceptos.superclass.constructor.call(this, config);

    },
    init: function () {
        var _this = this;
        Fact.conf.addConceptos.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 350;
        //_this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    aceptarFn: function(){
        console.info('aceptar');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id'+_this.concepto
        });
        this.addGridColumn({
            header: _this.idioma.lbDenominacion,
            width: 200,
            dataIndex: (_this.dataIndexPrincipal) ? _this.dataIndexPrincipal : 'denominacion',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var p = Fact.conf.addConceptos.superclass.render.call(this);
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount()> 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }else{
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                /*st.initBaseParams.tipocliente = _this.tipocliente;
                st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;*/
                st.initBaseParams.concepto = _this.concepto;
                st.initBaseParams.util = Ext.encode(_this.util);
                st.initBaseParams.all = 1;
                
                if (_this.concepto != 'persona')
                  st.initBaseParams.idreporteventa = _this.gpParent.getSelectionModel().getSelected().data.idreporteventa;
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});
/**
 *<Componente> Panel Operaciones
 */
Fact.conf.pOperaciones = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var me = this;
        this.busquedaBasica = false;
        this.gridEditable = true;
        this.concepto = config.idioma.btnBuscarSerieDocumento;
        this.urlBusquedaGridPrincipal = config.idioma.urlConffacturacion + 'cargarOperaciones';
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        Fact.conf.pOperaciones.superclass.constructor.call(this, config);
        me.getVistaPrincipal().listeners = {
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
    },
    initDefaultColumns: function() {
        var _this = this;
        this.cmbSubsistemas = new LOG.util.ComboBox({
            url: this.idioma.urlConffacturacion + 'cargarSubsistemas',
            hiddenName: 'idsubsistema',
            valueField: 'idsubsistema',
            displayField: 'denominacion',
            enableKeyEvents: true,
            autoLoad: true,
            editable: false,
            listeners: {
                select: function(cmb, rd) {
                    Fact.conf.subsistema = rd;
                }
            }
        });
        this.cmbCondicionPago = new LOG.util.ComboBox({
            url: this.idioma.urlConffacturacion + 'getCondicionPago',
            hiddenName: 'idterminodepago',
            valueField: 'idterminodepago',
            displayField: 'nombre',
            enableKeyEvents: true,
            autoLoad: true,
            editable: false,
            listeners: {
                select: function(cmb, rd) {
                    Fact.conf.condicionpago = rd;
                }
            }
        });
        this.storecmbcobropago = new Ext.data.SimpleStore({
            fields: ['cobropago', 'texto'],
            data: [[-1,'No'],[1, 'Si']]
        });
        this.storecmbcomprobante = new Ext.data.SimpleStore({
            fields: ['comprobante', 'textocomp'],
            data: [[-1,'No'],[1, 'Si']]
        });
        this.storecmbventamayorista = new Ext.data.SimpleStore({
            fields: ['vm', 'texto'],
            data: [[-1,'No'],[1, 'Si']]
        });
        this.storecmbexterior = new Ext.data.SimpleStore({
            fields: ['pagoexterior', 'texto'],
            data: [[-1,'No'],[1, 'Si']]
        });
        this.storecmbpreciocero = new Ext.data.SimpleStore({
            fields: ['preciocero', 'texto'],
            data: [[-1,'No'],[1, 'Si']]
        });
        this.cmbCobropago = new Ext.form.ComboBox({
            store: _this.storecmbcobropago,
            displayField: 'texto',
            id: 'cobropago',
            valueField: 'cobropago',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'cobropago'
        });
        this.cmbComprobante = new Ext.form.ComboBox({
            store: _this.storecmbcomprobante,
            displayField: 'textocomp',
            id: 'comprobante',
            valueField: 'comprobante',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'comprobante'
        });
        this.cmbVM = new Ext.form.ComboBox({
            store: _this.storecmbventamayorista,
            displayField: 'texto',
            id: 'vm',
            valueField: 'vm',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'vm'
        });
        this.cmbPagoExterior = new Ext.form.ComboBox({
            store: _this.storecmbexterior,
            displayField: 'texto',
            id: 'pagoexterior',
            valueField: 'pagoexterior',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'pagoexterior'
        });
        this.cmbPrecioCero = new Ext.form.ComboBox({
            store: _this.storecmbpreciocero,
            displayField: 'texto',
            id: 'preciocero',
            valueField: 'preciocero',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'preciocero'
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.lbOperacion,
            autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'subsistema',
            header: this.idioma.lbSubsistema,
            width: 200,
            editable: true,
            editor: this.cmbSubsistemas,
            renderer: function(v, m, rd) {
                var subsistemas = this.editor.getStore().data.items;
                if (v) {
                    if (this.editor.isDirty()) {
                        for (var i = 0; i < subsistemas.length; i++) {
                            if (subsistemas[i].data.idsubsistema == this.editor.getValue()) {
                                rd.set('idsubsistema', this.editor.getValue());
                                rd.set('subsistema', subsistemas[i].data.denominacion);
                                this.editor.reset();
                                return subsistemas[i].data.denominacion;
                            }
                        }
                    }
                }
                return v;
            }
        });
        this.addGridColumn({
            dataIndex: 'condicionpago',
            header: 'Condici\xf3n de pago',
            width: 200,
            editable: true,
            editor: this.cmbCondicionPago,
            renderer: function(v, m, rd) {
                var condiciones = this.editor.getStore().data.items;
                if (v) {
                    if (this.editor.isDirty()) {
                        for (var i = 0; i < condiciones.length; i++) {
                            if (condiciones[i].data.idterminodepago == this.editor.getValue()) {
                                rd.set('idcondicionpago', this.editor.getValue());
                                rd.set('condicionpago', condiciones[i].data.nombre);
                                this.editor.reset();
                                return condiciones[i].data.nombre;
                            }
                        }
                    }
                }
                return v;
            }
        });

        this.addGridColumn({
            dataIndex: 'texto',
            header: 'Genera obligaciones',
            width: 200,
            editable: true,
            editor: _this.cmbCobropago,
            hidden: (!_this.grantedAction('RGENERACC')),
            renderer: function(v, m, rd) {
                if (v) {
                    if (this.editor.isDirty()) {
                        rd.set('cobropago', this.editor.getValue());
                        if (v == 1)
                            m.css = 'icondistra-aceptar verde';
                        else
                            m.css = 'icondistra-aceptar rojo';
                        //return (v == 1) ? 'Si' : 'No';
                    }
                }
                if (rd.data.cobropago == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
                //return (rd.data.redondear == 1) ? 'Si' : 'No';
            }
        });
        this.addGridColumn({
            dataIndex: 'textocomp',
            header: 'Comprobante al contabilizar',
            width: 200,
            editable: true,
            editor: _this.cmbComprobante,
            hidden: (!_this.grantedAction('RGENERACOMP')),
            renderer: function(v, m, rd) {
                if (v) {
                    if (this.editor.isDirty()) {
                        rd.set('comprobante', this.editor.getValue());
                        if (v == 1)
                            m.css = 'icondistra-aceptar verde';
                        else
                            m.css = 'icondistra-aceptar rojo';
                        //return (v == 1) ? 'Si' : 'No';
                    }
                }
                if (rd.data.comprobante == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
                //return (rd.data.redondear == 1) ? 'Si' : 'No';
            }
        });
        this.addGridColumn({
            dataIndex: 'textovm',
            header: 'Ventas mayoristas',
            width: 200,
            editable: true,
            editor: _this.cmbVM,
            //hidden: (!_this.grantedAction('RGENERACC')),
            renderer: function(v, m, rd) {
                if (v) {
                    if (this.editor.isDirty()) {
                        rd.set('vm', this.editor.getValue());
                        if (v == 1)
                            m.css = 'icondistra-aceptar verde';
                        else
                            m.css = 'icondistra-aceptar rojo';
                        //return (v == 1) ? 'Si' : 'No';
                    }
                }
                if (rd.data.vm == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
                //return (rd.data.redondear == 1) ? 'Si' : 'No';
            }
        });
        this.addGridColumn({
            dataIndex: 'textopagoexterior',
            header: 'Pago del exterior',
            width: 200,
            editable: true,
            editor: _this.cmbPagoExterior,
            hidden: (!_this.grantedAction('RPAGOEXT')),
            renderer: function(v, m, rd) {
                if (v) {
                    if (this.editor.isDirty()) {
                        rd.set('pagoexterior', this.editor.getValue());
                        if (v == 1)
                            m.css = 'icondistra-aceptar verde';
                        else
                            m.css = 'icondistra-aceptar rojo';
                        //return (v == 1) ? 'Si' : 'No';
                    }
                }
                if (rd.data.pagoexterior == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
                //return (rd.data.redondear == 1) ? 'Si' : 'No';
            }
        });
        this.addGridColumn({
            dataIndex: 'textopreciocero',
            header: 'Facturar con precio cero',
            width: 200,
            editable: true,
            editor: _this.cmbPrecioCero,
            //hidden: (!_this.grantedAction('RPRECIOCERO')),
            renderer: function(v, m, rd) {
                if (v) {
                    if (this.editor.isDirty()) {
                        rd.set('preciocero', this.editor.getValue());
                        if (v == 1)
                            m.css = 'icondistra-aceptar verde';
                        else
                            m.css = 'icondistra-aceptar rojo';
                        //return (v == 1) ? 'Si' : 'No';
                    }
                }
                if (rd.data.preciocero == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
                //return (rd.data.redondear == 1) ? 'Si' : 'No';
            }
        });
        this.addGridColumn({
            dataIndex: 'idsubsistema'
        });
        this.addGridColumn({
            dataIndex: 'idcondicionpago'
        });
        this.addGridColumn({
            dataIndex: 'idnomoperaciones'
        });
        this.addGridColumn({
            dataIndex: 'cobropago'
        });
        this.addGridColumn({
            dataIndex: 'comprobante'
        });
        this.addGridColumn({
            dataIndex: 'vm'
        });
        this.addGridColumn({
            dataIndex: 'pagoexterior'
        });
        this.addGridColumn({
            dataIndex: 'preciocero'
        });
        this.addGridColumn({
            dataIndex: 'idoperacionsubsistema'
        });
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
    render: function() {
        var _this = this;
        var p = Fact.conf.pOperaciones.superclass.render.call(this), me = this;
        /*LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
         if (e == 'rowdeselect') {
         me.listaBotones.getItem(1).disable();
         me.listaBotones.getItem(2).disable();
         } else if (e == 'rowselect') {
         me.listaBotones.getItem(1).enable();
         me.listaBotones.getItem(2).enable();
         }
         }, 'RCRUDSERIEDOCUMENTO');*/
        /*LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function(e, rd) {
            if (e == 'afteredit') {
                rd.record.data.subsistema = Fact.conf.subsistema.data.denominacion;
                rd.record.data.idsubsistema = Fact.conf.subsistema.data.idsubsistema;
                _this.getGridPrincipal().getView().refresh();
            }
        });*/
        return p;
    }
});
/**
 *<Componente> Panel Rangos para Facturas Manuales
 */
Fact.conf.pRangosFacturasManuales = Ext.extend(LOG.util.Panel, {
    constructor: function(config) {
        this.idestructuracomun = config.idconfiguracion;
        this.idioma = config.idioma;
        var me = this;
        me.layout = 'fit';
        me.domain = 'DatSecnrocontrolautomatico';
        config.name = 'panelRangosFacturasManuales';
        config.items = [this.createGdCenter()];
        this.listeners = {
            afterrender: function() {
                me.stNumeroControl.load();
            },
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
        me.keyNav = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (me.activateTap) {
                        if (!me.winNumeroControl || me.winNumeroControl.hidden) {
                            me.initWinNumeroControlComponent(me.idioma.lbBtnAdicionar, false);
                        }
                    }
                }
            }, {
                key: "mM", // or
                ctrl: false,
                shift: false, alt: true,
                fn: function() {
                    if (me.activateTap) {
                        if (!me.winNumeroControl || me.winNumeroControl.hidden) {
                            me.initWinNumeroControlComponent(me.idioma.lbBtnAdicionar, true);
                        }
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function() {
                    if (me.activateTap) {
                        if (me.smNumeroControl.hasSelection()) {
                            mostrarMensaje(2, me.idioma.confirmarEliminarNrofactControl, function(ok) {
                                if (ok === "ok") {
                                    me.delNumeroControl();
                                }

                            });
                        }
                    }
                }
            }
        ]);
        Fact.conf.pRangosFacturasManuales.superclass.constructor.call(this, config);
    },
    createGdCenter: function() {
        var me = this;
        this.btnAddNumeroControl = LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnAdicionar,
            tooltip: me.idioma.toolAdicionarRF,
            handler: function() {
                if (!me.winNumeroControl || me.winNumeroControl.hidden) {
                    me.initWinNumeroControlComponent(me.idioma.lbBtnAdicionar, false);
                }
            }
        });
        this.btnModNumeroControl = LOG.util.Prototipos.botonModificar({
            text: this.idioma.lbBtnModificar,
            tooltip: this.idioma.toolModificarRF,
            disabled: true,
            handler: function() {
                if (!me.winNumeroControl || me.winNumeroControl.hidden) {
                    me.initWinNumeroControlComponent(me.idioma.lbBtnModificar, true);
                }
            }
        });
        this.btnDelNumeroControl = LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnEliminar,
            tooltip: me.idioma.toolEliminarRF,
            disabled: true,
            handler: function() {
                if (me.smNumeroControl.hasSelection()) {
                    mostrarMensaje(2, me.idioma.confirmarEliminarNrofactControl, function(ok) {
                        if (ok === "ok") {
                            me.delNumeroControl();
                        }

                    });
                }
            }
        });
        this.smNumeroControl = LOG.util.UIManager.initSelectionModel(2);
        this.smNumeroControl.on('rowselect', function(sm) {
            if ((me.smNumeroControl.getSelections().length === 1)) {
                me.btnModNumeroControl.enable();
            } else {
                me.btnModNumeroControl.disable();
            }

            me.btnDelNumeroControl.enable();
        });
        this.smNumeroControl.on('rowdeselect', function(sm) {
            if (me.smNumeroControl.getSelections().length === 0) {
                me.btnModNumeroControl.disable();
                me.btnDelNumeroControl.disable();
            } else if ((me.smNumeroControl.getSelections())) {
                if (me.smNumeroControl.getSelections().length === 1) {
                    me.btnModNumeroControl.enable();
                } else {
                    me.btnModNumeroControl.disable();
                }
                me.btnDelNumeroControl.enable();
            }
        });
        this.stNumeroControl = new Ext.data.Store({
            url: this.idioma.urlConffacturacion + 'crudNumeroControl',
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idsecuencianumerocontrol',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idsecuencianumerocontrol'
                    },
                    {
                        name: 'nrofacturainicio'
                    },
                    {
                        name: 'nrofacturafinal'
                    },
                    {
                        name: 'nrocontrolinicial'
                    },
                    {
                        name: 'nrocontrolfinal'
                    },
                    {
                        name: 'idconfiguracion'
                    }
                ]
            }),
            listeners: {
                'beforeload': function(st, opts) {
                    st.initBaseParams.idestructuracomun = me.parentCmp.idconfiguracion;
                    st.initBaseParams.actionModel = "load";
                    st.initBaseParams.domain = me.parentCmp.domain;
                    st.initBaseParams.limit = me.gNumeroControl.getBottomToolbar().cbPageSize.getValue();
                },
                'load': function(thisstore, objeto) {
                    //Ext.getBody().unmask();
                }
            }
        });
        this.cmNumeroControl = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({header: me.idioma.cmNo}),
            {
                dataIndex: 'nrofacturainicio',
                header: this.idioma.lbHeaderNoFactInicio,
                sortable: true,
                width: 120,
                id: 'nrofacturainicio'
            },
            {
                dataIndex: 'nrofacturafinal',
                header: this.idioma.lbHeaderNoFactFinal,
                width: 120,
                sortable: true,
                id: 'nrofacturafinal'
            },
            {
                dataIndex: 'nrocontrolinicial',
                header: this.idioma.lbHeaderNoControlInicial,
                width: 120,
                sortable: true,
                id: 'nrocontrolinicial'
            },
            {
                dataIndex: 'nrocontrolfinal',
                header: this.idioma.lbHeaderNoControlFinal,
                width: 120,
                sortable: true,
                id: 'nrocontrolfinal'
            }
        ]);
        this.gNumeroControl = LOG.util.UIManager.initEditableGridPanel(
                this.cmNumeroControl, this.stNumeroControl, this.smNumeroControl, {nobbar: false});
        this.gNumeroControl.setHeight(300);
        this.gNumeroControl.getTopToolbar().add([this.btnAddNumeroControl, this.btnModNumeroControl, this.btnDelNumeroControl]);
        this.gNumeroControl.autoExpandColumn = 'nrofacturainicio';
        return this.gNumeroControl;
    },
    initWinNumeroControlComponent: function(idioma, flags) {
        var me = this;
        this.tfFacturaNumeroInicio = {
            xtype: 'textfield',
            fieldLabel: me.idioma.lbHeaderInicio,
            name: 'nrofacturainicio',
            anchor: '95%',
            maxLength: 10,
            maxLengthText: me.idioma.lbMsgMaxLongNumberO,
            maskRe: /^[0-9]/,
            regex: /^[0-9]/,
            allowBlank: false
        };
        this.tfFacturaNumeroFin = {
            xtype: 'textfield',
            fieldLabel: me.idioma.lbHeaderFinal,
            name: 'nrofacturafinal',
            anchor: '95%',
            maskRe: /^[0-9]/,
            maxLength: 10,
            maxLengthText: me.idioma.lbMsgMaxLongNumberO,
            allowBlank: false,
            regex: /^[0-9]/
        };
        this.tfControlNumeroInicio = {
            xtype: 'textfield',
            fieldLabel: me.idioma.lbHeaderInicio,
            name: 'nrocontrolinicial',
            anchor: '95%',
            maskRe: /[0-9'.-]$/,
            //regex: /^[0-9]/,
            allowBlank: false,
            plugins: [new Ext.ux.InputTextMask({
                    mask: '99-99999999',
                    clearInvalid: false
                })
            ]
        };
        this.tfControlNumeroFin = {
            xtype: 'textfield',
            fieldLabel: me.idioma.lbHeaderFinal,
            name: 'nrocontrolfinal',
            maskRe: /[0-9'.-]$/,
            //regex: /^[0-9]/,
            allowBlank: false,
            anchor: '95%',
            plugins: [new Ext.ux.InputTextMask({
                    mask: '99-99999999',
                    clearInvalid: false
                })]
        };
        this.fsFacturaNumero = {
            xtype: 'fieldset',
            autoHeight: true,
            title: me.idioma.titleNumeroDeFactura,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfFacturaNumeroInicio]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfFacturaNumeroFin]
                        }
                    ]
                }
            ]
        };
        this.fsControlNumero = {
            xtype: 'fieldset',
            autoHeight: true,
            title: me.idioma.titleNumeroDeControl,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfControlNumeroInicio]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfControlNumeroFin]
                        }]
                }
            ]
        };
        this.fpNumeroControl = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            region: 'center',
            items: [this.fsFacturaNumero, this.fsControlNumero]
        });
        if (flags) {
            this.fpNumeroControl.getForm().loadRecord(me.gNumeroControl.getSelectionModel().getSelected());
        }
        this.winNumeroControl = new LOG.util.Window({
            title: idioma + me.idioma.titleRango,
            width: 380,
            height: 270,
            layout: 'border',
            parentCmp: me,
            items: [this.fpNumeroControl],
            aceptarFn: this.addNumeroControl,
            usarAplicar: !flags,
            onCancelarHandler: function() {
                this.scope.destroy();
            },
            onAceptarHandler: function() {
                me.addNumeroControl(true);
            },
            onAplicarHandler: function() {
                me.addNumeroControl(false);
            },
            onCloseHandler: function(p) {
                p.destroy();
            }
        });
        this.winNumeroControl.show();
    },
    addNumeroControl: function(flags) {
        var _this = this;
        if (_this.isValid()) {
            var params = _this.fpNumeroControl.getForm().getValues();
            params.actionModel = (_this.winNumeroControl.usarAplicar) ? 'add' : 'up';
            params.idsecuencianumerocontrol = (!_this.winNumeroControl.usarAplicar) ? _this.smNumeroControl.getSelected().get('idsecuencianumerocontrol') : '';
            params.idestructuracomun = _this.parentCmp.idconfiguracion;
            params.domain = _this.parentCmp.domain;
            _this.stNumeroControl.reload({
                params: params,
                callback: function(conf, opts, response) {
                    if (response) {
                        var _this_idioma_msgOKAdicionar = (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgOKAdicionarSecNumControl : _this.idioma.msgOKModificarSecNumControl2;
                        mostrarMensaje(1, _this_idioma_msgOKAdicionar);
                        if (_this.winNumeroControl && !_this.winNumeroControl.hidden) {
                            _this.fpNumeroControl.getForm().reset();
                        }
                        if (flags) {
                            _this.winNumeroControl.close();
                        }
                    } else {
                        if (_this.stNumeroControl.reader.jsonData.codigoMsg === 3) {
                            var _this_idioma_msgErrorAdicionar = (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgDatosExisteRango : _this.idioma.msgDatosExisteRangoMod;
                            mostrarMensaje(1, _this_idioma_msgErrorAdicionar); //mensaje error
                        } else {
                            var _this_idioma_msgErrorAdicionarSecc = (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgErrorAdicionarSecNumControl : _this.idioma.msgErrorModificarSecNumControl;
                            mostrarMensaje(1, _this_idioma_msgErrorAdicionarSecc); //mensaje error
                        }
                    }
                }
            });
        }
    },
    delNumeroControl: function() {
        var me = this;
        var params = {};
        params.actionModel = 'del';
        params.domain = me.domain;
        params.idestructuracomun = me.idconfiguracion;
        var records = me.smNumeroControl.getSelections();
        var idsecuencianumerocontrolArray = new Array();
        for (var i = 0; i < records.length; i++) {
            idsecuencianumerocontrolArray.push(records[i].get('idsecuencianumerocontrol'));
        }
        params.idsecuencianumerocontrol = Ext.encode(idsecuencianumerocontrolArray);
        me.stNumeroControl.reload({
            params: params,
            callback: function(conf, opts, response) {
                if (response) {
                    mostrarMensaje(1, me.idioma.msgOKEliminarSecNumControl);
                } else {
//                    if (me.stNumeroControl.reader.jsonData.codigoMsg === 1) {
//                        mostrarMensaje(1, me.idioma.msgEliminadoNrofactControl + '</br>' + me.stNumeroControl.reader.jsonData.rango);
//                    } else {
                    mostrarMensaje(1, me.idioma.msgEliminadoNrofactControlNo); //mensaje error
//                    }
                }
                me.smNumeroControl.fireEvent('rowdeselect');
            }
        });
    },
    isValid: function() {
        var _this = this;
        if (_this.fpNumeroControl.getForm().isValid()) {
            var values = _this.fpNumeroControl.getForm().getValues();
            var factlini = parseInt(values.nrofacturainicio);
            var factfin = parseInt(values.nrofacturafinal); //qqq
            var controliniValue = values.nrocontrolinicial;
            var controlfinValue = values.nrocontrolfinal;
            var controliniArray = controliniValue.split("-");
            var controlfinArray = controlfinValue.split("-");
            var controlini = parseInt(controliniArray[0]);
            var controlfin = parseInt(controlfinArray[0]);
            var controliniComp = parseInt(controliniArray[1]);
            var controlfinComp = parseInt(controlfinArray[1]);
            if (controlini === controlfin) {
                if ((factlini <= factfin) && (controliniComp <= controlfinComp)) {
                    return true;
                } else if (controliniComp > controlfinComp) {
                    mostrarMensaje(1, _this.idioma.msgNumeroControlInicioMenorFin); //mensaje error
                    return false;
                }
            } else {
                mostrarMensaje(1, _this.idioma.msgNumeroControlInicioFormatoFin); //mensaje error
                return false;
            }
            if (factlini > factfin) {
                mostrarMensaje(1, _this.idioma.msgNumeroFactInicioMenorFin); //mensaje error
                return false;
            }
        } else {
            mostrarMensaje(1, _this.idioma.msgDatosVaciosOIncorrectos); //mensaje error
            return false;
        }
        return true;
    }, fireStoreEvent: function(rd) {
        var me = this;
        if (rd.length === 0) {
            mostrarMensaje(1, me.idioma.msgNoDatos);
        }
    }
});
/**
 *<Componente> Panel Rangos para Facturas Generadas por el Sistema
 */
// Fact.conf.pRangosFacturasGeneradas = Ext.extend(LOG.util.Panel, {
//     constructor: function(config) {
//         this.idioma = config.idioma;
//         var me = this;
//         this.idestructuracomun = config.idconfiguracion;
//         this.disabled = true;
//         config.hidden = true;
//         this.layout = 'border';
//         config.name = 'panelRangosFacturasGeneradas';
//         config.items = [this.createGdCenter(), this.createGdSouth()];
//         this.listeners = {
//             afterrender: function() {
//                 me.stPuestoTrabajo.load();
//             },
//             activate: function(panel) {
//                 panel.activateTap = true;
//             },
//             deactivate: function(panel) {
//                 panel.activateTap = false;
//             }
//         };
//         me.keyNav = new Ext.KeyMap(Ext.getDoc(), [
//             {
//                 key: "iI", // or
//                 ctrl: false,
//                 shift: false,
//                 alt: true,
//                 fn: function() {
//                     if (me.activateTap) {
//                         me.fnRangosGenerados("i");
//                     }
//                 }
//             }, {
//                 key: "mM", // or
//                 ctrl: false,
//                 shift: false,
//                 alt: true,
//                 fn: function() {
//                     if (me.activateTap) {
//                         me.fnRangosGenerados("m");
//                     }
//                 }
//             }, {
//                 key: Ext.EventObject.DELETE,
//                 fn: function() {
//                     if (me.activateTap) {
//                         me.fnRangosGenerados("d");
//                     }
//                 }
//             },
//             {
//                 key: "iI", // or
//                 ctrl: true,
//                 shift: false,
//                 alt: true,
//                 fn: function() {
//                     if (me.activateTap) {
//                         me.fnRangosGenerados("i", true);
//                     }
//                 }
//             }, {
//                 key: "mM", // or
//                 ctrl: true,
//                 shift: false,
//                 alt: true,
//                 fn: function() {
//                     if (me.activateTap) {
//                         me.fnRangosGenerados("m", true);
//                     }
//                 }
//             }, {
//                 key: "dD", // or
//                 ctrl: true,
//                 shift: false,
//                 alt: true,
//                 fn: function() {
//                     if (me.activateTap) {
//                         me.fnRangosGenerados("d", true);
//                     }
//                 }
//             }
//         ]);
//         Fact.conf.pRangosFacturasGeneradas.superclass.constructor.call(this, config);
//     },
//     fnRangosGenerados: function(flags, ctrl) {
//         var me = this;
//         if (flags === "i") {
//             if (!me.gNumeroControl.disabled && ctrl) {
//                 if (!me.winNumeroControl || me.winNumeroControl.hidden) {
//                     me.initwinNumeroControlComponent(me.idioma.lbBtnAdicionar, false);
//                 }
//             } else {
//                 if (!me.winPuestoTrabajo || me.winPuestoTrabajo.hidden) {
//                     me.initwinPuestoTrabajoComponent(me.idioma.lbBtnAdicionar, false);
//                 }
//             }
//         } else if (flags === "m") {
//             if (!me.gNumeroControl.disabled && ctrl) {
//                 if (!me.winNumeroControl || me.winNumeroControl.hidden) {
//                     me.initwinNumeroControlComponent(me.idioma.lbBtnModificar, true);
//                 }
//             } else {
//                 if (!me.winPuestoTrabajo || me.winPuestoTrabajo.hidden) {
//                     me.initwinPuestoTrabajoComponent(me.idioma.lbBtnModificar, true);
//                 }
//             }
//         } else if (flags === "d") {
//             if (!me.gNumeroControl.disabled && ctrl) {
//                 if (me.smNumeroControl.hasSelection()) {
//                     mostrarMensaje(2, me.idioma.confirmarEliminarSecPT, function(ok) {
//                         if (ok === "ok") {
//                             if (me.smNumeroControl.getSelected().json) {
//                                 me.delNumeroControl();
//                             }
//                         }
//                     });
//                 }
//             } else {
//                 if (me.smPuestoTrabajo.hasSelection()) {
//                     mostrarMensaje(2, me.idioma.confirmarEliminarPuestoPT, function(ok) {
//                         if (ok === "ok") {
//                             if (me.smPuestoTrabajo.getSelected().json) {
//                                 me.delPuestoTrabajo();
//                             }
//                         }
//                     });
//                 }
//             }
//         }
//     },
//     createGdSouth: function() {
//         var me = this;
//         this.btnAddNumeroControl = LOG.util.Prototipos.botonAdicionar({
//             text: me.idioma.btnAdicionarNC, tooltip: me.idioma.toolAdicionarNC,
//             handler: function() {
//                 me.fnRangosGenerados("i", true);
//             }
//         });
//         this.btnModNumeroControl = LOG.util.Prototipos.botonModificar({
//             text: me.idioma.btnModificarNC,
//             disabled: true,
//             tooltip: me.idioma.toolModificarNC,
//             handler: function() {
//                 me.fnRangosGenerados("m", true);
//             }
//         });
//         this.btnDelNumeroControl = LOG.util.Prototipos.botonEliminar({
//             text: me.idioma.lbBtnEliminar,
//             disabled: true,
//             tooltip: me.idioma.toolEliminarNC,
//             handler: function() {
//                 mostrarMensaje(2, me.idioma.confirmarEliminarSecPT, function(ok) {
//                     if (ok === "ok") {
//                         if (me.smNumeroControl.getSelected().json) {
//                             var rangos = Array();
//                             var seleccion = me.smNumeroControl.getSelections();
//                             Ext.each(seleccion, function(sel) {
//                                 rangos.push(sel.json.idrango);
//                             });
//                             Ext.Ajax.request({
//                                 url: me.idioma.urlConffacturacion + 'eliminarSecPuestoTrabajo',
//                                 method: 'post',
//                                 params: {
//                                     rangos: Ext.encode(rangos)
//                                 },
//                                 callback: function(conf, opts, response) {
//                                     var responseText = Ext.decode(response.responseText);
//                                     if (responseText.success) {
//                                         mostrarMensaje(1, me.idioma.msgOKEliminarSecNumControl);
//                                         me.stNumeroControl.reload();
//                                     }
//                                 }
//                             });
//                         }
//                     }
//                 });
//                 //me.fnRangosGenerados("d", true);
//             }
//         });
//         this.activarRango = LOG.util.UIManager.createBtn({
//             text: me.idioma.lbBtnActivarRango,
//             tooltip: me.idioma.lbTtActivarRangoBtn,
//             iconCls: 'activar',
//             handler: function() {
//                 me.activarDesactivar(1);
//             },
//             disabled: true
//         });
//         this.desactivarRango = LOG.util.UIManager.createBtn({
//             text: me.idioma.lbBtnDesActivarRango,
//             tooltip: me.idioma.lbTtDesActivarRangoBtn,
//             iconCls: 'activar rojo',
//             hidden: true,
//             handler: function() {
//                 me.activarDesactivar(0);
//             },
//             disabled: true
//         });
//         this.smNumeroControl = LOG.util.UIManager.initSelectionModel(2);
//         LOG.util.UIManager.encadenaFn(this.smNumeroControl, 'fireEvent', function(e, sm) {
//             if (e === 'selectionchange') {
//                 var rd = sm.getSelections();
//                 if (rd.length === 1) {
//                     me.btnModNumeroControl.setDisabled(rd[0].data.activo == 0 ? false : true);
//                 } else {
//                     me.btnModNumeroControl.disable();
//                 }
//                 if (rd.length > 0) {
//                     var flagActivo = true;
//                     var flagDes = true;
//                     for (var i = 0, len = rd.length; i < len; i++) {
//                         if (rd[i].data.activo == 1) {
//                             flagActivo = false;
//                         } else {
//                             flagDes = false;
//                         }
//                     }
//                     if (flagActivo && !flagDes) {
//                         me.btnDelNumeroControl.enable();
//                         me.desactivarRango.setVisible(false);
//                         me.desactivarRango.disable();
//                         me.activarRango.setVisible(true);
//                         me.activarRango.enable();
//                     } else if (!flagActivo && flagDes) {
//                         me.btnDelNumeroControl.disable();
//                         me.desactivarRango.setVisible(true);
//                         me.desactivarRango.enable();
//                         me.activarRango.setVisible(false);
//                         me.activarRango.disable();
//                     } else {
//                         me.desactivarRango.setVisible(false);
//                         me.activarRango.setVisible(true);
//                         me.activarRango.disable();
//                         me.btnDelNumeroControl.disable();
//                     }
//                 } else {
//                     me.desactivarRango.setVisible(false);
//                     me.activarRango.setVisible(true);
//                     me.activarRango.disable();
//                     me.btnDelNumeroControl.disable();
//                 }
//             }
//         }, 'CNTRLBTN');
//         this.stNumeroControl = new Ext.data.Store({
//             url: this.idioma.urlConffacturacion + 'cargarSecPorIdPuesto',
//             reader: new Ext.data.JsonReader({
//                 id: 'idsecuenciapuestotrabajo',
//                 root: 'datos',
//                 totalProperty: 'cantidad',
//                 fields: [
//                     {
//                         name: 'idpuestotrabajorango'
//                     },
//                     {
//                         name: 'idpuestotrabajo'
//                     },
//                     {
//                         name: 'idrango'
//                     },
//                     {
//                         name: 'nrocontrolinicial'
//                     },
//                     {
//                         name: 'nrocontrolfinal'
//                     },
//                     {
//                         name: 'activo'
//                     }
//                 ]
//             }),
//             listeners: {
//                 'beforeload': function(st, opts) {
//                     st.initBaseParams.idestructuracomun = me.parentCmp.idconfiguracion;
//                     st.initBaseParams.idpuestotrabajo = me.smPuestoTrabajo.getSelected().get('idpuestotrabajo');
//                     st.initBaseParams.actionModel = "";
//                     st.initBaseParams.domain = me.domain;
//                     st.initBaseParams.limit = me.gNumeroControl.getBottomToolbar().cbPageSize.getValue();
//                 },
//                 'load': function(thisstore, objeto) {
//                     //Ext.getBody().unmask();
//                 }
//             }
//         });
//         this.cmNumeroControl = new Ext.grid.ColumnModel([
//             new Ext.grid.RowNumberer({header: me.idioma.cmNo}),
//             {
//                 dataIndex: 'nrocontrolinicial',
//                 header: this.idioma.lbHeaderInicio,
//                 width: 120,
//                 sortable: true,
//                 id: 'nroinicio'
//             },
//             {
//                 dataIndex: 'nrocontrolfinal',
//                 header: this.idioma.lbHeaderFinal,
//                 width: 120,
//                 sortable: true,
//                 id: 'nrofin'
//             },
//             {
//                 dataIndex: 'activo',
//                 header: this.idioma.lbHeaderActivoColum,
//                 width: 100,
//                 renderer: function(value, metaData) {
//                     if (value == 1) {
//                         metaData.css = 'activo';
//                     } else {
//                         metaData.css = 'inactivo';
//                     }
//                 }
//             }
//         ]);
//         this.gNumeroControl = LOG.util.UIManager.initEditableGridPanel(
//                 this.cmNumeroControl, this.stNumeroControl, this.smNumeroControl, {nobbar: false}
//         );
//         this.gNumeroControl.on('expand', function(gp) {
//             me.stNumeroControl.load();
//         });
//         /*this.gNumeroControl.getSelectionModel().addListener('selectionchange', function(sm) {
//          var selections = sm.getSelections();
//          me.btnDelNumeroControl.setDisabled((selections.length > 0) ? false : true);
//          });*/
//         this.gNumeroControl.getTopToolbar().add([this.btnAddNumeroControl, this.btnModNumeroControl, this.btnDelNumeroControl, this.activarRango, this.desactivarRango]);
//         this.gNumeroControl.setHeight(250);
//         this.gNumeroControl.title = this.idioma.lbtitle1,
//                 this.gNumeroControl.autoExpandColumn = 'nroinicio',
//                 this.gNumeroControl.region = 'south',
//                 this.gNumeroControl.collapsible = true,
//                 this.gNumeroControl.collapsed = true,
//                 this.gNumeroControl.border = false,
//                 this.gNumeroControl.disabled = true,
//                 this.gNumeroControl.split = true,
//                 this.gNumeroControl.collapseMode = 'mini';
//         return this.gNumeroControl;
//     },
//     activarDesactivar: function(activo) {
//         var _this = this;
//         var mensaje = (activo == 1) ? _this.idioma.lbMsgActivarConfirmarRango : _this.idioma.lbMsgDesactivarConfirmarRango;
//         mostrarMensaje(2, mensaje, function(btn) {
//             if (btn === 'ok') {
//                 var rangos = Array();
//                 var seleccion = _this.smNumeroControl.getSelections();
//                 Ext.each(seleccion, function(sel) {
//                     rangos.push(sel.json.idrango);
//                 });
//                 Ext.Ajax.request({
//                     url: _this.idioma.urlConffacturacion + 'activarrango',
//                     method: 'post',
//                     params: {
//                         idnom: Ext.encode(rangos),
//                         manual: 0,
//                         activo: activo
//                     },
//                     callback: function(conf, opts, response) {
//                         var responseText = Ext.decode(response.responseText);
//                         if (responseText.success) {
//                             mostrarMensaje(1, (activo == 1) ? _this.idioma.lbMsgActivarRango : _this.idioma.lbMsgDesactivarRango);
//                             _this.stNumeroControl.reload();
//                         }
//                     }
//                 });
//             }
//         });

//     },
//     createGdCenter: function() {
//         var me = this;
//         this.btnAddPuestoTrabajo = LOG.util.Prototipos.botonAdicionar({
//             text: me.idioma.btnAdicionarPI, tooltip: me.idioma.toolAdicionarPI,
//             handler: function() {
//                 me.fnRangosGenerados("i");
//             }
//         });
//         this.btnModPuestoTrabajo = LOG.util.Prototipos.botonModificar({
//             text: me.idioma.btnModificarPI,
//             disabled: true,
//             tooltip: me.idioma.toolModificarPI,
//             handler: function() {
//                 me.fnRangosGenerados("m");
//             }
//         });
//         this.btnDelPuestoTrabajo = LOG.util.Prototipos.botonEliminar({
//             text: me.idioma.lbBtnEliminar,
//             disabled: true,
//             tooltip: me.idioma.toolEliminarPI,
//             handler: function() {
//                 me.fnRangosGenerados("d");
//             }
//         });
//         this.smPuestoTrabajo = LOG.util.UIManager.initSelectionModel(2);
//         this.smPuestoTrabajo.on('rowselect', function(sm) {
//             if ((me.smPuestoTrabajo.getSelections().length === 1)) {
//                 me.btnModPuestoTrabajo.enable();
//                 me.actionNumeroControl(true);
//             } else {
//                 me.actionNumeroControl(false);
//                 me.btnModPuestoTrabajo.disable();
//                 me.stNumeroControl.removeAll();
//             }
//             me.btnDelPuestoTrabajo.enable();
//         });
//         this.smPuestoTrabajo.on('rowdeselect', function(sm) {
//             if ((!me.smPuestoTrabajo.hasSelection())) {
//                 me.btnModPuestoTrabajo.disable();
//                 me.btnDelPuestoTrabajo.disable();
//                 me.gNumeroControl.disable();
//                 me.stNumeroControl.removeAll();
//             } else {
//                 if (me.smPuestoTrabajo.getSelections().length === 1) {
//                     me.btnModPuestoTrabajo.enable();
//                     me.actionNumeroControl(true);
//                 } else {
//                     me.btnModPuestoTrabajo.disable();
//                     me.actionNumeroControl(false);
//                     me.stNumeroControl.removeAll();
//                 }
//                 me.btnDelPuestoTrabajo.enable();
//             }
//         });
//         this.stPuestoTrabajo = new Ext.data.Store({
//             url: this.idioma.urlConffacturacion + 'crudPuestoTrabajo',
//             reader: new Ext.data.JsonReader({
//                 id: 'idpuestotrabajo',
//                 root: 'datos', totalProperty: 'cantidad',
//                 fields: [
//                     {
//                         name: 'idpuestotrabajo'
//                     },
//                     {
//                         name: 'denominacion'
//                     },
//                     {
//                         name: 'fechainicio'
//                     },
//                     {
//                         name: 'fechafin'
//                     },
//                     {
//                         name: 'idconfiguracion'
//                     }
//                 ]
//             }),
//             listeners: {
//                 'beforeload': function(st, opts) {
//                     st.initBaseParams.idestructuracomun = me.parentCmp.idconfiguracion;
//                     st.initBaseParams.actionModel = "";
//                     st.initBaseParams.domain = me.domain;
//                     st.initBaseParams.limit = me.gPuestoTrabajo.getBottomToolbar().cbPageSize.getValue();
//                 },
//                 'load': function(thisstore, objeto) {
//                     //Ext.getBody().unmask();
//                 }
//             }
//         });
//         this.cmPuestoTrabajo = new Ext.grid.ColumnModel([
//             new Ext.grid.RowNumberer({header: me.idioma.cmNo}),
//             {
//                 dataIndex: 'denominacion',
//                 header: this.idioma.lbDenominacion,
//                 sortable: true,
//                 width: 120,
//                 id: 'denominacion'
//             },
//             {
//                 dataIndex: 'fechainicio',
//                 header: this.idioma.lbFechaInicio,
//                 sortable: true,
//                 width: 120
//             },
//             {
//                 dataIndex: 'fechafin',
//                 header: this.idioma.lbFechaFin,
//                 sortable: true,
//                 width: 120
//             }
//         ]);
//         this.gPuestoTrabajo = LOG.util.UIManager.initEditableGridPanel(
//                 this.cmPuestoTrabajo, this.stPuestoTrabajo, this.smPuestoTrabajo, {nobbar: false}
//         );
//         /*this.gPuestoTrabajo.getSelectionModel().addListener('selectionchange', function(sm) {
//          var selections = sm.getSelections();
//          me.btnDelPuestoTrabajo.setDisabled((selections.length > 0) ? false : true);
//          });*/
//         this.gPuestoTrabajo.getTopToolbar().add([this.btnAddPuestoTrabajo, this.btnModPuestoTrabajo, this.btnDelPuestoTrabajo]);
//         this.gPuestoTrabajo.setHeight(250);
//         this.gPuestoTrabajo.title = this.idioma.lbtitle1,
//                 this.gPuestoTrabajo.autoExpandColumn = 'denominacion',
//                 this.gPuestoTrabajo.region = 'center';
//         return this.gPuestoTrabajo;
//     },
//     initwinPuestoTrabajoComponent: function(idioma, flags) {
//         var me = this;
//         this.tfDenominacion = new Ext.form.TextArea({
//             fieldLabel: this.idioma.cmDesc,
//             name: 'denominacion',
//             allowBlank: false,
//             anchor: '100%',
//             regex: LOG.util.Regex.cadena,
//             maxLength: 255,
//             minLength: 2,
//             regexText: this.idioma.lbMsgAlfaNumericos,
//             enableKeyEvents: true,
//             maxLengthText: this.idioma.lbMsgMaxLongTextPuesto,
//             listeners: {
//                 keyup: function(obj) {
//                     if (obj.isDirty() && obj.isValid()) {
//                         me.winPuestoTrabajo.listaBotones.getItem(2).enable();
//                         me.winPuestoTrabajo.listaBotones.getItem(1).enable();
//                     } else {
//                         me.winPuestoTrabajo.listaBotones.getItem(2).disable();
//                         me.winPuestoTrabajo.listaBotones.getItem(1).disable();
//                     }
//                 }
//             }
//         });
//         //Definiendo el campo de texto fecha desde
//         this.dfDateBegin = new Ext.form.DateField({
//             fieldLabel: me.idioma.lbFechaInicio,
//             format: 'd/m/Y',
//             altFormats: 'dmy',
//             anchor: '95%',
//             editable: false,
//             endDateField: 'dfDateEnd',
//             id: 'dfDateBegin',
//             name: 'fechainicio',
//             maskRe: /[\d\/]/,
//             enableKeyEvents: true,
//             vtype: 'daterange',
//             listeners: {
//                 keyup: function(obj) {
//                     if (obj.isDirty() && obj.isValid()) {
//                         me.winPuestoTrabajo.listaBotones.getItem(1).enable();
//                         me.winPuestoTrabajo.listaBotones.getItem(2).enable();
//                     } else {
//                         me.winPuestoTrabajo.listaBotones.getItem(1).disable();
//                         me.winPuestoTrabajo.listaBotones.getItem(2).disable();
//                     }
//                 }
//             }
//         });
//         //Definiendo el campo de texto fecha hasta
//         this.dfDateEnd = new Ext.form.DateField({
//             fieldLabel: me.idioma.lbFechaFin,
//             format: 'd/m/Y',
//             altFormats: 'dmy',
//             anchor: '95%',
//             editable: false,
//             startDateField: 'dfDateBegin',
//             id: 'dfDateEnd',
//             name: 'fechafin',
//             maskRe: /[\d\/]/,
//             enableKeyEvents: true,
//             vtype: 'daterange',
//             listeners: {
//                 keyup: function(obj) {
//                     if (obj.isDirty() && obj.isValid()) {
//                         me.winPuestoTrabajo.listaBotones.getItem(1).enable();
//                         me.winPuestoTrabajo.listaBotones.getItem(2).enable();
//                     } else {
//                         me.winPuestoTrabajo.listaBotones.getItem(1).disable();
//                         me.winPuestoTrabajo.listaBotones.getItem(2).disable();
//                     }
//                 }
//             }
//         });
//         this.fsRangoFecha = new Ext.form.FieldSet({
//             autoHeight: true,
//             title: this.idioma.lbHeaderRangoFecha
//         });
//         this.clsFsRangoFecha = LOG.util.UIManager.initColumnForm(2);
//         this.clsFsRangoFecha.addComponent(this.dfDateBegin);
//         this.clsFsRangoFecha.addComponent(this.dfDateEnd);
//         this.fsRangoFecha.add(this.clsFsRangoFecha);
//         this.fpPuestoTrabajo = LOG.util.UIManager.initForm({
//             frame: true,
//             labelAlign: 'top',
//             bodyStyle: 'padding:5px 5px 0',
//             region: 'center',
//             items: [this.tfDenominacion, this.fsRangoFecha],
//             trackResetOnLoad: true
//         });

//         this.winPuestoTrabajo = new LOG.util.Window({
//             title: idioma + me.idioma.lbtitle2,
//             width: 300,
//             height: 270,
//             layout: 'border',
//             items: [this.fpPuestoTrabajo],
//             aceptarFn: this.addPuestoTrabajo,
//             usarAplicar: !flags,
//             onCancelarHandler: function() {
//                 this.scope.destroy();
//             },
//             onAceptarHandler: function() {
//                 me.addPuestoTrabajo(true);
//             },
//             onAplicarHandler: function() {
//                 me.addPuestoTrabajo(false);
//             },
//             onCloseHandler: function(p) {
//                 p.destroy();
//             }
//         });
//         if (flags) {
//             this.fpPuestoTrabajo.getForm().loadRecord(me.gPuestoTrabajo.getSelectionModel().getSelected());
//         }
//         this.winPuestoTrabajo.listaBotones.getItem(1).disable();
//         this.winPuestoTrabajo.listaBotones.getItem(2).disable();
//         this.winPuestoTrabajo.show();
//     },
//     initwinNumeroControlComponent: function(idioma, flags) {
//         var me = this;
//         this.tfNumeroInicio = LOG.util.Prototipos.inputTexto({
//             fieldLabel: me.idioma.lbHeaderInicio,
//             name: 'nroinicio',
//             anchor: '95%',
//             maskRe: /[0-9'.-]$/,
//             maxLength: 11,
//             allowBlank: false,
//             enableKeyEvents: true,
//             listeners: {
//                 keyup: function(txt) {
//                     if ((txt.isValid() && txt.isDirty() && me.tfNumeroFin.isValid() && me.tfNumeroFin.isDirty()) || (flags && txt.isValid() && txt.isDirty())) {
//                         me.winNumeroControl.listaBotones.getItem(2).enable();
//                         if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
//                             me.winNumeroControl.listaBotones.getItem(1).enable();
//                         }
//                     } else {
//                         me.winNumeroControl.listaBotones.getItem(2).disable();
//                         if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
//                             me.winNumeroControl.listaBotones.getItem(1).disable();
//                         }
//                     }
//                 }
//             },
//             plugins: [
//                 new Ext.ux.InputTextMask({
//                     mask: '99-99999999',
//                     clearInvalid: false
//                 })
//             ]
//         });
//         this.tfNumeroFin = LOG.util.Prototipos.inputTexto({
//             fieldLabel: me.idioma.lbHeaderFinal,
//             maskRe: /[0-9'.-]$/,
//             allowBlank: false,
//             name: 'nrofin',
//             anchor: '95%',
//             enableKeyEvents: true,
//             listeners: {
//                 keyup: function(txt) {
//                     if ((txt.isValid() && txt.isDirty() && me.tfNumeroInicio.isValid() && me.tfNumeroInicio.isDirty()) || (flags && txt.isValid() && txt.isDirty())) {
//                         me.winNumeroControl.listaBotones.getItem(2).enable();
//                         if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
//                             me.winNumeroControl.listaBotones.getItem(1).enable();
//                         }
//                     } else {
//                         me.winNumeroControl.listaBotones.getItem(2).disable();
//                         if (me.winNumeroControl.listaBotones.getItem(1).isVisible()) {
//                             me.winNumeroControl.listaBotones.getItem(1).disable();
//                         }
//                     }
//                 }
//             },
//             plugins: [
//                 new Ext.ux.InputTextMask({
//                     mask: '99-99999999',
//                     clearInvalid: false
//                 })
//             ]
//         });
//         this.fpNumeroControl = new Ext.FormPanel({
//             labelAlign: 'top',
//             frame: true,
//             bodyStyle: 'padding:5px 5px 0',
//             region: 'center',
//             items: [this.tfNumeroInicio, this.tfNumeroFin]
//         });
//         if (flags) {
//             var record = me.gNumeroControl.getSelectionModel().getSelected();
//             this.fpNumeroControl.getForm().loadRecord(new Ext.data.Record({
//                 nroinicio: record.data.nrocontrolinicial,
//                 nrofin: record.data.nrocontrolfinal
//             }));
//         }
//         this.winNumeroControl = new LOG.util.Window({
//             title: idioma + me.idioma.lbtitle3,
//             width: 300,
//             height: 200,
//             layout: 'border',
//             items: [this.fpNumeroControl],
//             usarAplicar: !flags,
//             aceptarFn: this.addNumeroControl,
//             onCancelarHandler: function() {
//                 me.winNumeroControl.destroy();
//             },
//             onAceptarHandler: function() {
//                 me.addNumeroControl(true);
//             },
//             onAplicarHandler: function() {
//                 me.addNumeroControl(false);
//             },
//             onCloseHandler: function(p) {
//                 me.winNumeroControl.destroy();
//             }
//         });
//         this.winNumeroControl.listaBotones.getItem(2).disable();
//         this.winNumeroControl.listaBotones.getItem(1).disable();
//         this.winNumeroControl.show();
//     },
//     actionNumeroControl: function(flags) {
//         var me = this;
//         if (flags) {
//             if (me.gNumeroControl.collapsed) {
//                 me.gNumeroControl.expand();
//                 me.gNumeroControl.enable();
//             } else {
//                 me.gNumeroControl.enable();
//                 me.gNumeroControl.getStore().load();
//             }
//         } else {
//             me.gNumeroControl.collapse();
//             me.gNumeroControl.disable();
//         }
//     },
//     addPuestoTrabajo: function(flags) {
//         var _this = this;
//         if (_this.isValidPuestoTrabajo()) {
//             var params = _this.fpPuestoTrabajo.getForm().getValues();
//             params.actionModel = (_this.winPuestoTrabajo.usarAplicar) ? 'add' : 'up';
//             params.idpuestotrabajo = (!_this.winPuestoTrabajo.usarAplicar) ? _this.smPuestoTrabajo.getSelected().get('idpuestotrabajo') : '';
//             params.idestructuracomun = _this.parentCmp.idconfiguracion;
//             params.domain = _this.parentCmp.domain;
//             _this.stPuestoTrabajo.reload({
//                 params: params,
//                 callback: function(conf, opts, response) {
//                     if (response) {
//                         var _this_idioma_msgOKAdicionar = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgOKAdicionarPuestoImp : _this.idioma.msgOKModificarPuestoImp;
//                         mostrarMensaje(1, _this_idioma_msgOKAdicionar);
//                         if (_this.win && !_this.win.hidden)
//                             _this.fpPuestoTrabajo.getForm().reset();
//                         if (flags)
//                             _this.winPuestoTrabajo.close();
//                     } else {
//                         if (_this.stPuestoTrabajo.reader.jsonData.codigoMsg === 3) {
//                             var _this_idioma_msgErrorAdicionar = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgExistePuestoPT : _this.idioma.msgModExistePuestoPT;
//                             mostrarMensaje(1, _this_idioma_msgErrorAdicionar); //mensaje error
//                         } else {
//                             var _this_idioma_msgErrorAdicionarSecc = (_this.winPuestoTrabajo.usarAplicar) ? _this.idioma.msgErrorAdicionarSecNumControl : _this.idioma.msgErrorModificarPuestoImp;
//                             mostrarMensaje(1, _this.idioma.msgErrorAdicionarSecNumControl); //mensaje error
//                         }
//                     }
//                 }
//             });
//         }
//     },
//     delPuestoTrabajo: function() {
//         var me = this;
//         var me = this;
//         var params = {};
//         params.actionModel = 'del';
//         params.domain = me.domain;
//         params.idestructuracomun = me.idconfiguracion;
//         var records = me.smPuestoTrabajo.getSelections();
//         var idpuestotrabajoArray = new Array();
//         for (var i = 0; i < records.length; i++) {
//             idpuestotrabajoArray.push(records[i].get('idpuestotrabajo'));
//         }
//         params.idpuestotrabajo = Ext.encode(idpuestotrabajoArray);
//         me.stPuestoTrabajo.reload({
//             params: params,
//             callback: function(conf, opts, response) {
//                 if (response) {
//                     mostrarMensaje(1, me.idioma.msgEliminadoPuestoPT);
//                 } else {
// //                    if (me.stPuestoTrabajo.reader.jsonData.codigoMsg === 3) {
//                     mostrarMensaje(1, me.idioma.msgEliminarPuestoEnUso); //mensaje error
//                 }
//                 /*else {
//                  mostrarMensaje(1, me.idioma.msgErrorAdicionarSecNumControl); //mensaje error
//                  }*/
// //                }
//                 me.smPuestoTrabajo.fireEvent('rowdeselect');
//             }
//         });
//     },
//     addNumeroControl: function(flags) {
//         var _this = this;
//         if (_this.isValidNumeroControl()) {
//             var params = _this.fpNumeroControl.getForm().getValues();
//             params.actionModel = (_this.winNumeroControl.usarAplicar) ? 'add' : 'up';
//             params.idrango = (!_this.winNumeroControl.usarAplicar) ? _this.smNumeroControl.getSelected().get('idrango') : '';
//             params.idpuestotrabajo = _this.smPuestoTrabajo.getSelected().get('idpuestotrabajo');
//             params.idestructuracomun = _this.parentCmp.idconfiguracion;
//             params.domain = _this.parentCmp.domain;

//             Ext.Ajax.request({
//                 url: _this.idioma.urlConffacturacion + 'crudSecuenciaNumeroControl',
//                 method: 'post',
//                 params: params,
//                 callback: function(conf, opts, response) {
//                     var responseText = Ext.decode(response.responseText);
//                     if (responseText.success) {
//                         var _this_idioma_msgOKAdicionar = (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgOKAdicionarSecControl : _this.idioma.msgOKModificarSecNumControl;
//                         mostrarMensaje(1, _this_idioma_msgOKAdicionar);
//                         _this.stNumeroControl.reload();
//                         _this.fpNumeroControl.getForm().reset();
//                         if (flags) {
//                             _this.winNumeroControl.close();
//                         }
//                     } else {
//                         mostrarMensaje(1, (_this.winNumeroControl.usarAplicar) ? _this.idioma.msgDatosExisteRangoNC : _this.idioma.msgErrorNumeroControl);
//                     }
//                 }
//             });
//         }
//     },
//     delNumeroControl: function() {
//         var me = this;
//         var params = {};
//         params.actionModel = 'del';
//         params.domain = me.domain;
//         params.idestructuracomun = me.idconfiguracion;
//         var records = me.smNumeroControl.getSelections();
//         var idsecuenciapuestotrabajoArray = new Array();
//         for (var i = 0; i < records.length; i++) {
//             idsecuenciapuestotrabajoArray.push(records[i].get('idsecuenciapuestotrabajo'));
//         }
//         params.idsecuenciapuestotrabajo = Ext.encode(idsecuenciapuestotrabajoArray);
//         me.stNumeroControl.reload({
//             params: params,
//             callback: function(conf, opts, response) {
//                 if (response) {
//                     mostrarMensaje(1, me.idioma.msgEliminadoRango);
//                 } else {
//                     mostrarMensaje(1, me.idioma.msgErrorEliminarSecNumControl); //mensaje error
//                 }
//                 me.smNumeroControl.fireEvent('rowdeselect');
//             }
//         });
//     },
//     isValidNumeroControl: function() {
//         var _this = this;
//         if (_this.fpNumeroControl.getForm().isValid()) {
//             var values = _this.fpNumeroControl.getForm().getValues();
//             var cIniArray = values.nroinicio.split("-");
//             var cFinArray = values.nrofin.split("-");
//             var vInicioUno = parseInt(cIniArray[0]);
//             var vFinUno = parseInt(cFinArray[0]);
//             var vInicioSec = parseInt(cIniArray[1]);
//             var vFinSec = parseInt(cFinArray[1]);
//             if (vInicioUno > vFinUno) {
//                 return false;
//                 mostrarMensaje(1, _this.idioma.msgNumeroControlInicioMenorFin); //mensaje error
//             } else if (vInicioUno === vFinUno) {
//                 if (vInicioSec <= vFinSec) {
//                     return true;
//                 } else if (vInicioSec > vFinSec) {
//                     return false;
//                     mostrarMensaje(1, _this.idioma.msgNumeroControlInicioMenorFin); //mensaje error
//                 }
//             } else {
//                 return false;
//                 mostrarMensaje(1, _this.idioma.msgNumeroControlInicioFormatoFin); //mensaje error
//             }
//         } else {
//             return false;
//             mostrarMensaje(1, _this.idioma.msgDatosVacios); //mensaje error
//         }
//         return true;
//     },
//     isValidPuestoTrabajo: function() {
//         var _this = this;
//         if (_this.fpPuestoTrabajo.getForm().isValid()) {
//             return true;
//         } else {
//             mostrarMensaje(1, _this.idioma.lbMsgCampoIvalido); //mensaje error
//             return false;
//         }
//     },
//     fireStoreEvent: function(rd) {
//         /*  var me = this;
//          if (rd.length == 0) {
//          mostrarMensaje(1, me.idioma.msgNoDatos);
//          }*/
//     }
// });
/**
 *<Componente> Grid general
 */
Fact.conf.gridGeneral = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.idioma = config.idioma;
        config.concepto = config.ttBtnBuscar;
        if (config.servicio) {
            this.servicio = config.servicio || null;
        }
        config.urlBusquedaGridPrincipal = this.idioma.urlConffacturacion + config.url;
        if (config.gdPrincipal) {
            this.busquedaBasica = true;
            this.busquedaAvanzada = true;
            this.formaVisualizacion = 'panel';
            this.modoSeleccion = 2;
            this.gridEditable = true;
            this.autoLoad = false;
        } else {
            this.busquedaBasica = false;
            this.formaVisualizacion = 'panel';
            this.modoSeleccion = 1;
            this.gridEditable = true;
            this.autoLoad = false;
        }
        this.gdPrincipal = config.gdPrincipal;
        Fact.conf.gridGeneral.superclass.constructor.call(this, config);
    },
    initDefaults: function() {
        if (this.gdPrincipal) {
            this.initColumnsMatriz();
        } else {
            this.initColumnsSelection();
            this.initButtonsSelection();
        }
    },
    initColumnsMatriz: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'configurado'
        });
        this.addGridColumn({
            header: 'Configurado',
            dataIndex: 'texto',
            width: 80,
            filter : {
                type : 'combo',
                store : new Ext.data.SimpleStore({
                    fields: ['configurado', 'texto'],
                    data: [['-1','No'],['1', 'Si']]
                }),
                valueField : 'configurado',
                displayField: 'texto',
                dataIndex : 'texto',
            },
            renderer: function(v, m, rd) {
                if (rd.data.configurado == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        });
        this.addGridColumn({
            header: this.idioma.cmCodDesc,
            dataIndex: 'text',
            width: 500,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cmUnidadMedida,
            dataIndex: 'umedida',
            width: 50,
            default: true
        });
        if (!_this.servicio) {
            this.addGridColumn({
                header: this.idioma.cmNaturaleza,
                dataIndex: 'naturaleza',
                width: 100,
                default: true,
                filter : {
                    type : 'combo',
                    url : _this.idioma.urlConffacturacion + 'obtenerNaturaleza',
                    valueField : 'idnaturaleza',
                    displayField: 'text',
                    dataIndex : 'naturaleza',
                }
            });
        } else {
            this.addGridColumn({
                header: this.idioma.lbClasificacion,
                dataIndex: 'clasificacion',
                width: 100,
                default: true,
                filter : {
                    type : 'combo',
                    url : _this.idioma.urlConffacturacion + 'obtenerClasificacion',
                    valueField : 'idclasificacioncontable',
                    displayField: 'denominacion',
                    dataIndex : 'clasificacion',
                }
            });
        }
        this.addGridColumn({
            dataIndex: 'idunidadmedida',
            hidden: true
        });
    },
    initButtonsSelection: function() {
        var me = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: (!this.servicio) ? this.idioma.ttpAdicionarPrecio : this.idioma.ttpAdicionarTarifa,
            handler: function() {
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: (!me.servicio) ? this.idioma.ttpEliminarPrecio : this.idioma.ttpEliminarTarifa,
            handler: function() {
            }
        }));
    },
    initColumnsSelection: function() {
        var me = this;
        this.cmbMoneda = new LOG.util.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{nombremoneda}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            url: this.idioma.urlConffacturacion + 'cargarTipoMonedas'
        });
        function getDescripcionMoneda(idmoneda) {
            var items = me.cmbMoneda.getStore().data.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].data.idmoneda == idmoneda) {
                    return items[i].data.codigoiso;
                }
            }
            return null;
        }

        this.fnMoneda = function(v, i, d) {
            if (v) {
                return getDescripcionMoneda(d.data.idmoneda);
            }
            return '';
        };
        this.fnPrecioVenta = function(v) {
            if (v) {
                return parseFloat(v).toFixed(2);
            }
            return parseFloat(0).toFixed(2);
        };
        this.fnPrecioBase = function(v) {
            if (v) {
                return parseFloat(v).toFixed(2);
            }
            return parseFloat(0).toFixed(2);
        };
        this.cmbMoneda = new LOG.util.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{nombremoneda}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            store: new Ext.data.Store({
                url: this.idioma.urlConffacturacion + 'cargarTipoMonedas',
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad'
                }, [
                    {name: 'codigoiso'},
                    {name: 'idmoneda'},
                    {name: 'nombremoneda'}
                ])
            })
        });
        this.cmbMoneda.getStore().load();
        this.addGridColumn({
            header: this.idioma.cmMoneda,
            dataIndex: 'idmoneda',
            width: 200,
            renderer: this.fnMoneda,
            editor: this.cmbMoneda
        });
        this.addGridColumn({
            header: this.idioma.cmCobroMateriales,
            dataIndex: 'cobromateriales',
            align: 'right',
            hidden: true,
            hideable: false,
            sortable: true,
            renderer: this.fnPrecioBase,
            width: 150
        });
        this.addGridColumn({
            header: (this.servicio) ? this.idioma.cmTarifa : this.idioma.cmPrecio,
            dataIndex: 'precio',
            align: 'right',
            width: 100,
            categoria: 'categoria',
            renderer: this.fnPrecioBase,
            editor: new LOG.util.Prototipos.inputDecimal({
                allowBlank: false,
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        });
        this.addGridColumn({
            header: (this.servicio) ? this.idioma.cmTarifaVenta : this.idioma.cmPVenta2,
            dataIndex: 'precioventa',
            align: 'right',
            renderer: this.fnPrecioVenta,
            width: 100
        });
        this.addGridColumn({
            dataIndex: 'idmatrizpreciodualidadmonetaria'
        });
        this.addGridColumn({
            dataIndex: 'codigoiso'
        });
    }
});
/**
 *<Componente> Ventana serie del documento
 */
Fact.conf.wSerieDocumento = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        this.usarAplicar = config.action == 'add' ? true : false;
        Fact.conf.wSerieDocumento.superclass.constructor.call(this, config);
        if (this.action == 'mod') {
            this.cargarDatos(this.data);
        }
    },
    initComponent: function() {
        var me = this;
        var fecha = new Date();
        if (!this.idFechaInicio) {
            this.idFechaInicio = fecha.getTime() + 'desdeserie';
            this.idFechaFin = fecha.getTime() + 'hastaserie';
        }
        Fact.conf.wSerieDocumento.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            disabled: true
        });
        this.setSize(400, 250);
        this.frmSerieDocumento = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center'
        });
        this.txtDenominacion = LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.tfDesc,
            allowBlank: false,
            maxLength: 5,
            minLength: 2,
            minLengthText: this.idioma.lbMsgMinLongDescripcion,
            regexText: this.idioma.lbMsgAlfaNumericos,
            regex: LOG.util.Regex.cadena,
            maxLengthText: this.idioma.lbMsgMaxLongDescripcion,
            name: 'denominacion',
            enableKeyEvents: true,
            selectOnFocus: true,  
            listeners: {
                keyup: function(txt) {
                    if (me.action == 'mod' && txt.isValid() && txt.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                            && txt.isDirty()
                            && me.txtNroInicial.isValid()
                            && me.txtNroInicial.isDirty()
                            && me.cmbTipoDocumento.isValid()
                            && me.cmbTipoDocumento.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.txtDenominacion.focus(true,100);
        this.txtNroInicial = LOG.util.Prototipos.inputEntero({
            fieldLabel: this.idioma.lbHeaderInicial,
            allowBlank: false,
            name: 'nroinicial',
            enableKeyEvents: true,
            listeners: {
                keyup: function(txt) {
                    if (me.action == 'mod' && txt.isValid() && txt.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                            && txt.isDirty()
                            && me.txtDenominacion.isValid()
                            && me.txtDenominacion.isDirty()
                            && me.cmbTipoDocumento.isValid()
                            && me.cmbTipoDocumento.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.cmbTipoDocumento = new LOG.util.ComboBox({
            anchor: '98%',
            allowBlank: false,
            url: this.idioma.urlConffacturacion + 'cargarTipoDocumentoSerie',
            valueField: 'iddoc',
            displayField: 'denominacion',
            emptyText: this.idioma.tiplbConcepto,
            fieldLabel: this.idioma.lbTipoDocumento,
            name: 'iddocumento',
            listeners: {
                select: function(cmb) {
                    if (me.action == 'mod' && cmb.isValid() && cmb.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (cmb.isValid()
                            && cmb.isDirty()
                            && me.txtDenominacion.isValid()
                            && me.txtDenominacion.isDirty()
                            && me.txtNroInicial.isValid()
                            && me.txtNroInicial.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.frmFechaRango = new LOG.util.ColumnForm(3);
        /*this.desdeSerie = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio',
            name: 'fechainicio',
            vtype: 'daterange',
            id: 'desdeserie',
            endDateField: 'hastaserie'
        });
        this.hastaSerie = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            name: 'fechafin',
            vtype: 'daterange',
            id: 'hastaserie',
            startDateField: 'desdeserie'
        });*/
        this.frmSerieDocumento.add(this.txtDenominacion);
        this.frmSerieDocumento.add(this.cmbTipoDocumento);
        this.frmSerieDocumento.add(new Ext.form.FieldSet({
            //autoWidth: true,
            style: '-moz-border-radius:5px',
            autoHeight: true,
            layout: 'column',
            anchor: '98%',
            items: [
                {
                    columnWidth: .3,
                    layout: 'form',
                    items: [
                        this.txtNroInicial
                    ]
                },
                {
                    columnWidth: .35,
                    layout: 'form',
                    items: [
                        {
                            fieldLabel: 'Fecha inicio',
                            name: 'fechainicio',
                            xtype: 'datefield',
                            vtype: 'daterange',
                            id: me.idFechaInicio,
                            endDateField: me.idFechaFin,
                            anchor: '95%',
                            format: 'd/m/Y',
                            listeners: {
                                change: function(dt) {
                                    if (me.action == 'mod' && dt.isValid() && dt.isDirty()) {
                                        me.listaBotones.getItem(2).enable();
                                        return;
                                    }
                                    if (dt.isValid()
                                        && dt.isDirty()
                                        && me.txtDenominacion.isValid()
                                        && me.txtDenominacion.isDirty()
                                        && me.cmbTipoDocumento.isValid()
                                        && me.cmbTipoDocumento.isDirty()) {
                                        me.listaBotones.getItem(2).enable();
                                        if (me.listaBotones.getItem(1).isVisible()) {
                                            me.listaBotones.getItem(1).enable();
                                        }
                                    } else {
                                        me.listaBotones.getItem(2).disable();
                                        if (me.listaBotones.getItem(1).isVisible()) {
                                            me.listaBotones.getItem(1).disable();
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    columnWidth: .35,
                    layout: 'form',
                    items: [
                        {
                            fieldLabel: 'Fecha fin',
                            name: 'fechafin',
                            xtype: 'datefield',
                            vtype: 'daterange',
                            id: me.idFechaFin,
                            startDateField: me.idFechaInicio,
                            anchor: '95%',
                            format: 'd/m/Y',
                            mode: 'local',
                            listeners: {
                                change: function(dt) {
                                    if (me.action == 'mod' && dt.isValid() && dt.isDirty()) {
                                        me.listaBotones.getItem(2).enable();
                                        return;
                                    }
                                    if (dt.isValid()
                                        && dt.isDirty()
                                        && me.txtDenominacion.isValid()
                                        && me.txtDenominacion.isDirty()
                                        && me.cmbTipoDocumento.isValid()
                                        && me.cmbTipoDocumento.isDirty()) {
                                        me.listaBotones.getItem(2).enable();
                                        if (me.listaBotones.getItem(1).isVisible()) {
                                            me.listaBotones.getItem(1).enable();
                                        }
                                    } else {
                                        me.listaBotones.getItem(2).disable();
                                        if (me.listaBotones.getItem(1).isVisible()) {
                                            me.listaBotones.getItem(1).disable();
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }));
        /*this.frmFechaRango.addComponent(this.txtNroInicial);
        this.frmFechaRango.addComponent(this.desdeSerie);
        this.frmFechaRango.addComponent(this.hastaSerie);*/

        this.add(this.frmSerieDocumento);
    },
    aceptarFn: function(btn) {
        var me = this;
        /*if(me.listaBotones.getItem(1).disabled || me.listaBotones.getItem(2).disabled)
            return;*/
        
        var params = {
            actions: this.action
        };
        if (this.txtDenominacion.isDirty() && this.txtDenominacion.isValid()) {
            params.denominacion = this.txtDenominacion.getValue();
        }
        if (this.txtNroInicial.isDirty() && this.txtNroInicial.isValid()) {
            params.nrodocumentoinicial = this.txtNroInicial.getValue();
        }
        if (this.cmbTipoDocumento.isDirty() && this.cmbTipoDocumento.isValid()) {
            params.iddoc = this.cmbTipoDocumento.getValue();
        }
        if (Ext.getCmp(me.idFechaInicio).isDirty() && Ext.getCmp(me.idFechaInicio).isValid()) {
            params.fechainicio = Ext.getCmp(me.idFechaInicio).getValue();
        }
        if (Ext.getCmp(me.idFechaFin).isDirty() && Ext.getCmp(me.idFechaFin).isValid()) {
            params.fechafin = Ext.getCmp(me.idFechaFin).getValue();
        }
        if (this.action === 'mod') {
            params.idseriedocumento = this.data.idseriedocumento;
            params.idseriedocentidad = this.data.idseriedocentidad;
        }
        Ext.Ajax.request({
            url: this.idioma.urlConffacturacion + 'actionsSerieDocumento',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, me.action === 'mod' ? me.idioma.msgSerieDocumentoModificado : me.idioma.msgSerieDocumentoAdicionado);
                    me.st.reload();
                } else if (resp.enuso) {
                    mostrarMensaje(1, me.idioma.lbMsgNroinicialEnUso);
                } else {
                    mostrarMensaje(1, me.action === 'mod'  ? me.idioma.lbMsgNroinicialNoModificado : me.idioma.lbMsgNroinicialNoAdicionado);
                }
            }
        });
        
        if (btn === 'ok') {
            me.close();
        } else {
            me.frmSerieDocumento.getForm().reset();
            me.listaBotones.getItem(1).disable();
            me.listaBotones.getItem(2).disable();
        }
        
    },
    cargarDatos: function(data) {
        this.frmSerieDocumento.getForm().loadRecord(
                new Ext.data.Record({
                    denominacion: data.denominacion,
                    nroinicial: data.nrodocumentoinicial,
                    iddocumento: data.tipodocumento,
                    fechainicio: data.fechainicio,
                    fechafin: data.fechafin
                })
                );
    }
});

/**
 *<Componente> Ventana serie del documento
 */
Fact.conf.wReporteVentas = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        this.usarAplicar = config.action == 'add' ? true : false;
        Fact.conf.wReporteVentas.superclass.constructor.call(this, config);
        if (this.action == 'mod') {
            this.cargarDatos(this.data);
        }
    },
    initComponent: function() {
        var me = this;
        Fact.conf.wReporteVentas.superclass.initComponent.call(this);
        this.setSize(400, 250);
        this.frmReporteVentas = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center'
        });
        this.txtDenominacion = LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.tfDesc,
            allowBlank: false,
            maxLength: 50,
            minLength: 2,
            minLengthText: this.idioma.lbMsgMinLongDescripcion,
            regexText: this.idioma.lbMsgAlfaNumericos,
            regex: LOG.util.Regex.cadena,
            maxLengthText: this.idioma.lbMsgMaxLongDescripcion,
            name: 'denominacion',
            enableKeyEvents: true,
            selectOnFocus: true,
            listeners: {
                keyup: function(txt) {
                    if (me.action == 'mod' && txt.isValid() && txt.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                        && txt.isDirty()
                        ) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.txtDenominacion.focus(true,100);
        this.frmReporteVentas.add(this.txtDenominacion);
        this.txtOrden = LOG.util.Prototipos.inputEntero({
            fieldLabel: 'Prioridad',
            allowBlank: false,
            name: 'orden',
            enableKeyEvents: true,
            listeners: {
                keyup: function(txt) {
                    if (me.action == 'mod' && txt.isValid() && txt.isDirty()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                        && txt.isDirty()
                        ) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.frmReporteVentas.add(this.txtOrden);
        this.stAgrupacion = new Ext.data.Store({
            autoLoad: true,
            url: this.idioma.urlConffacturacion + 'cargaragrupacion',
            reader: new Ext.data.JsonReader({
                    id: "agrupacion",
                    root: "datos"
                },
                [
                    {name: 'agrupacion'}
                ])
        });
        this.cmbAgrupacion = new LOG.util.ComboBox({
            store: this.stAgrupacion,
            fieldLabel: 'Agrupaci\xf3n',
            hiddenName: 'agrupacion',
            valueField: 'agrupacion',
            displayField: 'agrupacion',
            editable: true,
            forceSelection: false,
            emptyText: 'Seleccione o edite',
            enableKeyEvents: true,
            listeners: {
                keyup: function(txt) {
                    if (me.action == 'mod' && txt.isValid()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                        ) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                },
                select: function(txt){
                  if (me.action == 'mod' && txt.isValid()) {
                        me.listaBotones.getItem(2).enable();
                        return;
                    }
                    if (txt.isValid()
                        ) {
                        me.listaBotones.getItem(2).enable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).enable();
                        }
                    } else {
                        me.listaBotones.getItem(2).disable();
                        if (me.listaBotones.getItem(1).isVisible()) {
                            me.listaBotones.getItem(1).disable();
                        }
                    }
                }
            }
        });
        this.frmReporteVentas.add(this.cmbAgrupacion);
        this.add(this.frmReporteVentas);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                me.salvarDatos('ok');
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            disabled: true,
            handler: function() {
                me.salvarDatos('apply');
            }
        });
    },
    salvarDatos: function(btn) {
        var me = this;
        if (this.action == 'add')
            if(me.listaBotones.getItem(1).disabled || me.listaBotones.getItem(2).disabled)
                return;
        else
            if(me.listaBotones.getItem(2).disabled)
                return;

        var params = {
            actions: this.action
        };
        if (this.txtDenominacion.isDirty() && this.txtDenominacion.isValid()) {
            params.denominacion = this.txtDenominacion.getValue();
        }
        if (this.txtOrden.isDirty() && this.txtOrden.isValid()) {
            params.orden = this.txtOrden.getValue();
        }
        if (this.cmbAgrupacion.isDirty() && this.cmbAgrupacion.isValid()) {
            params.agrupacion = this.cmbAgrupacion.getValue();
        }
        if (this.action === 'mod') {
            params.idreporteventa = this.data.idreporteventa;
        }
        Ext.Ajax.request({
            url: this.idioma.urlConffacturacion + 'actionsReporteVenta',
            method: 'POST',
            params: params,
            callback: function(o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    mostrarMensaje(1, me.action === 'mod' ? 'La configuraci\xf3n del reporte ha sido modificada satisfactoriamente' : 'La configuraci\xf3n del reporte ha sido adicionada satisfactoriamente');
                    me.st.reload();
                } else {
                    mostrarMensaje(1, me.action === 'mod' ? 'No se pudo modificar' : 'No se pudo adicionar');
                }
            }
        });

        if (btn === 'ok') {
            me.close();
        } else {
            me.frmReporteVentas.getForm().reset();
            me.listaBotones.getItem(1).disable();
            me.listaBotones.getItem(2).disable();
        }

    },
    cargarDatos: function(data) {
        this.frmReporteVentas.getForm().loadRecord(
            new Ext.data.Record({
                denominacion: data.denominacion,
                agrupacion: data.agrupacion,
                orden: data.orden
            })
        );
    }
});


/**
 *<Componente> Panel Operaciones
 */
 Fact.conf.pPagoElectronico = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var me = this;
        this.busquedaBasica = false;
        this.gridEditable = true;
        this.idGridPrincipal = 'idpagoelectronico'
        //this.concepto = config.idioma.btnBuscarSerieDocumento;
        this.urlBusquedaGridPrincipal = config.idioma.urlConffacturacion + 'cargarPagoElectronico';
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        Fact.conf.pPagoElectronico.superclass.constructor.call(this, config);
        console.info(this);

        me.getVistaPrincipal().listeners = {
            activate: function(panel) {
                panel.activateTap = true;
            },
            deactivate: function(panel) {
                panel.activateTap = false;
            }
        };
    },
    initDefaultColumns: function() {
        var _this = this;
        
        this.txtConsumerKey = LOG.util.Prototipos.inputTexto({
            fieldLabel : 'ConsumerKey',
            //inputType: 'password',
            name : 'consumerkey'
        });

        this.txtConsumerSecret = LOG.util.Prototipos.inputTexto({
            fieldLabel : 'ConsumerSecret',
            //inputType: 'password',
            name : 'consumersecret'
        });

        this.addGridColumn({
            dataIndex: 'codigoiso',
            header: 'Moneda',
            width: 100
        });
        this.addGridColumn({
            dataIndex: 'consumerkey',
            header: 'ConsumerKey',
            width: 200,
            editable: true,
            editor: this.txtConsumerKey,
            renderer: function(v, m, rd) {
                return v;
            }
        });
        this.addGridColumn({
            dataIndex: 'consumersecret',
            header: 'ConsumerSecret',
            width: 200,
            editable: true,
            editor: this.txtConsumerSecret,
            renderer: function(v, m, rd) {
                /*var subsistemas = this.editor.getStore().data.items;
                if (v) {
                    if (this.editor.isDirty()) {
                        for (var i = 0; i < subsistemas.length; i++) {
                            if (subsistemas[i].data.idsubsistema == this.editor.getValue()) {
                                rd.set('idsubsistema', this.editor.getValue());
                                rd.set('subsistema', subsistemas[i].data.denominacion);
                                this.editor.reset();
                                return subsistemas[i].data.denominacion;
                            }
                        }
                    }
                }*/
                return v;
            }
        });

        this.addGridColumn({
            dataIndex: 'idmoneda'
        });
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
    render: function() {
        var _this = this;
        var p = Fact.conf.pPagoElectronico.superclass.render.call(this), me = this;
        /* LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            console.info(e);
            if (e == 'beforeload') {
                this.initBaseParams.ispagoelectronico = 1;
            }
        }); */
        return p;
    }
});