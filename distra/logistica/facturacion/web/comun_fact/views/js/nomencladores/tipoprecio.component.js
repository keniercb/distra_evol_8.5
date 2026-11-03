/**
 * Created by Tony on 24/10/2014.
 */
Ext.ns('Ext.erp');

Ext.erp.tipoprecio = Ext.extend(Ext.erp.gridPanelNomenclador, {

    constructor: function(config) {
        var _this = this;
        config.codigo = false;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idtipoprecio';
        this.storeFields = [{
                name : 'pordefecto'
            },
            {
                name: 'tipo'
            }];

        this.columnsFields = [
            {
                dataIndex: 'pordefecto',
                header: _this.idioma.lbPorDefecto,
                width: 75,
                renderer: function (value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr ='ext:qtip="' +  _this.idioma.ttClmPorDefecto+ '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr ='ext:qtip="' +  _this.idioma.ttClmNoPorDefecto+ '"';
                    }
                }
            },
            {
                dataIndex: 'tipo',
                header: 'Tipo',
                width: 75,
                renderer: function (value, metaData) {
                    if (value == 1) {
                        return 'Productos';
                    } else if (value == 2) {
                        return 'Servicios';
                    } else {
                        return '';
                    }
                }
            }
        ];

        this.btnPordefecto = new Ext.Button({
            text: _this.idioma.lbPorDefecto,
            tooltip:_this.idioma.lbTipPorDefecto,
            iconCls: 'definir',
            disabled : true
        });

        this.tbarBtns = [
            _this.btnPordefecto
        ];

        this.btnPordefecto.on({
            'click':function(){
                _this.onBtnPordefectoClick();
            }
        });
        Ext.erp.tipoprecio.superclass.constructor.call(this, config);
    },
    activarBotones : function() {
        var _this = this;
        Ext.erp.tipoprecio.superclass.activarBotones.call(this);
        _this.btnPordefecto.disable();
        if(_this.selectionModeNomenclador.getCount() ==1 && _this.selectionModeNomenclador.getSelected().data.estado == 1
            && !_this.selectionModeNomenclador.getSelected().data.tipopreciopordefecto && _this.selectionModeNomenclador.getSelected().data.usarentidad){
            _this.btnPordefecto.enable();
        }
    },
    onBtnPordefectoClick : function() {
        var _this = this;
        mostrarMensaje(2, _this.idioma.msgPonerTipoprecioporDefecto, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.lbMsgPorDefectoNomenclador);
                Ext.Ajax.request({
                    url: 'tipopreciopordefecto',
                    params: {
                        idnom: _this.selectionModeNomenclador.getSelected().id
                    },
                    method: 'POST',
                    callback: function (o, s, r) {
                        Ext.getBody().unmask();
                        var dataResp = Ext.decode(r.responseText);
                        if (dataResp.success == false) {
                            mostrarMensaje(3, _this.idioma.msgErrorCategoriaporDefecto);
                        }else{
                            mostrarMensaje(1, _this.idioma.lbMsgUsarPorDefectoCorrecto);
                            _this.storeNomenclador.reload();
                        }
                    }
                });
            }
        });
    },
    initFormFields: function () {
        var _this = this;
        this.storecmbTipo = new Ext.data.SimpleStore({
            fields: ['idtipo', 'denom'],
            data: [[0, 'S/D'], [1, 'Productos'], [2, 'Servicios']]
        });
        this.cmbTipo= new Ext.form.ComboBox({
            store: this.storecmbTipo,
            fieldLabel: 'Tipo',
            displayField: 'denom',
            id: 'idtipo',
            valueField: 'idtipo',
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            hiddenName: 'tipo'
        });
        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: 1,
                layout: 'form',
                items: this.cmbTipo
            }]
        }];
    }
});