/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.lineaproductofarm = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        _this.campoIdNomenclador = 'idlineaprod';
        config.codigo = true;

        _this.columnsFields = [{
            header: "Droga/Explosivo",
            dataIndex: 'drogaexplo',
            width: 140,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        }];

        _this.storeFields = [{
            name: 'drogaexplo'
        }];

        this.chDrogaExplo = new Ext.form.Checkbox ({
            boxLabel: "Droga/Explosivo",
            name: 'drogaexplo',
            labelSeparator: '',
            inputValue: 1
        });

        _this.formFields = [this.chDrogaExplo];
        
        Ext.erp.lineaproductofarm.superclass.constructor.call(this, config);
    },
    onBtnAceptarClick: function (modificar, _fn, msgerr) {

        var _this = this;
        var msgWait = (modificar == true) ? _this.idioma.lbMsgWaitModificado : _this.idioma.lbMsgWaitAdicionado;
        var url = _this.urlController + ((modificar == false) ? 'insertarnomenclador' : 'modificarnomenclador');
        var tempFp = _this.fpGestionarNomenclador.getForm();


        if (!tempFp.isValid()) {
            mostrarMensaje(3, _this.idioma.lbMsgCamposInvalidos);
            return;
        }
        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST', params: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel,
                drogaexplo: (tempFp.items.items[5].getValue()) ? 1 : 0
            },
            success: function (form, action) {

                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function (form, action) {
                if (action.result.codigoRes && action.result.codigoMsg == '1') {
                    mostrarMensaje(1, (msgerr) ? msgerr : _this.idioma[action.result.codigoRes]);
                } else if (action.result.codigoRes && action.result.codigoMsg == '3') {
                    mostrarMensaje(1, _this.idioma[action.result.codigoRes]);

                } else {
                    mostrarMensaje(1, (modificar == true) ? _this.idioma.msjModDescexist : _this.idioma.msjAddDescexist);
                }
            }
        });
    },
});