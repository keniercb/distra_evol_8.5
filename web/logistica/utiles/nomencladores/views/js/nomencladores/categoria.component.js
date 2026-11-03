Ext.ns('Ext.erp');

Ext.erp.categoria = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        config.codigo = false;
        Ext.apply(this, config);
        this.bussinesModel = 'NomCategoriasproductoModel';
        this.campoIdNomenclador = 'idcategoria';

        this.storeFields = [{
            name : 'categoriapordefecto'
        }];

        this.columnsFields = [
            {
                dataIndex: 'categoriapordefecto',
                header: _this.idioma.lbPorDefecto,
                width: 75,
                renderer: function (value, metaData) {
                    if (value) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr ='ext:qtip="' +  _this.idioma.ttClmPorDefecto+ '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr ='ext:qtip="' +  _this.idioma.ttClmNoPorDefecto+ '"';
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

        this.bussinesModel = 'NomCategoriasproductoModel';
        Ext.erp.categoria.superclass.constructor.call(this, config);
    },

    activarBotones : function() {
        var _this = this;
        Ext.erp.categoria.superclass.activarBotones.call(this);
        _this.btnPordefecto.disable();
        if(_this.selectionModeNomenclador.getCount() ==1 && _this.selectionModeNomenclador.getSelected().data.estado == 1
            && !_this.selectionModeNomenclador.getSelected().data.categoriapordefecto && _this.selectionModeNomenclador.getSelected().data.usarentidad){
            _this.btnPordefecto.enable();
        }
    },

    onBtnPordefectoClick : function() {
        var _this = this;
        mostrarMensaje(2, _this.idioma.msgPonerCategoriaporDefecto, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.lbMsgPorDefectoNomenclador);
                Ext.Ajax.request({
                    url: 'categoriapordefecto',
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
    }

});
