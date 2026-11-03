/**
 * Created by Yhon on 26/04/2024.
 */
Ext.ns('Ext.erp');

Ext.erp.pos = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        var _this = this;
        config.codigo = true;
        this.cajas = new LOG.util.List();
        this.campoIdNomenclador = 'idpos';
        this.bussinesModel = 'ConfiguracionpuntoventaModel';

        Ext.apply(this, config);

        this.storeFields = [{
            name: 'idabo'
        }, {
            name: 'chapilla'
        }, {
            name: 'idtipocaja'
        }, {
            name: 'caja'
        }];

        this.columnsFields = [{
            header: _this.idioma.lbCmIdabo,
            dataIndex: 'idabo',
            width: 95
        },{
            header: _this.idioma.lbCmChapilla,
            dataIndex: 'chapilla',
            width: 95
        },{
            header: _this.idioma.lbCmCaja,
            dataIndex: 'caja',
            width: 150
        }];


        Ext.erp.pos.superclass.constructor.call(this, config);
    },
    /*nitComponent: function(){
        var _this = this;
        Ext.erp.pos.superclass.initComponent.call(this);


        this.storeNomenclador.on({
            'load': function(st, records, options) {
                _this.storeNomenclador.baseParams.idestructuracomun = (_this.idEntidad) ? _this.idEntidad: null;
                if (records.length > 0) {
                    if (_this.rowSelect)
                        _this.selectionModeNomenclador.selectRow(_this.rowSelect);
                    else
                        _this.selectionModeNomenclador.selectFirstRow();

                } else {
                    if (_this.buscar)
                        mostrarMensaje(1, _this.idioma.lbSindatosBuscar);

                    _this.rowSelect = false;
                }
            }
        });

        this.storeNomenclador.load({
            params: {
                start: 0,
                idestructuracomun: (_this.idEntidad) ? _this.idEntidad: null
            }
        });
    },*/
    initFormFields: function(){
        var _this = this;

        this.txtIdabo = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbCmbIdabo,
            name: 'idabo',
            allowBlank: false,
            enableKeyEvents: true,
            regex: LOG.util.Regex.digito,
            regexText: _this.idioma.msgExpreAlfaNumRegexText,
            minLength: 1,
            maxLength: 12,
            maxLengthText: _this.idioma.msgErrortext,
            anchor: '95%'
        });

        this.txtChapilla = new LOG.util.Prototipos.inputTexto({
            fieldLabel: _this.idioma.lbCmbChapilla,
            name: 'chapilla',
            allowBlank: false,
            enableKeyEvents: true,
            regex: LOG.util.Regex.digito,
            regexText: _this.idioma.msgExpreAlfaNumRegexText,
            minLength: 1,
            maxLength: 12,
            maxLengthText: _this.idioma.msgErrortext,
            anchor: '95%'
        });

        this.comboCaja = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCmbCaja,
            editable: false,
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarCajas',
            hiddenName: 'caja',
            valueField: 'caja',
            displayField: 'caja',
            typeAhead: true,
            editable: false,
            triggerAction: 'all',
            height: 29,
            anchor: '98%',
            allowBlank: false,
            resizable: true,
            enableQtip: true,
            autoLoad:true,
            listeners : {
                select: function(cmb, rd){
                    Ext.getCmp('idhddenomcaja').setValue(rd.json.idtipocaja);
                }
            }
        });

        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: 0.5,
                layout: 'form',
                items: this.txtIdabo
            }, {
                columnWidth: 0.5,
                layout: 'form',
                items: this.txtChapilla
            }, {
                columnWidth: 1,
                layout: 'form',
                items: this.comboCaja
            }, {
                xtype : 'hidden',
                name : 'idtipocaja',
                id : 'idhddenomcaja'
            }]
        }];
    }
});