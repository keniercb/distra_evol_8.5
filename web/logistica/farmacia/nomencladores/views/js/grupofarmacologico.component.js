Ext.ns('Ext.erp');

/*
 *  Implemetación del componente para la gestión del nomenclador naturaleza 
 */
Ext.erp.grupofarmacologico = Ext.extend(Ext.erp.treePanelNomenclador, {
    constructor: function(config) {
        config.campoIdNomenclador = 'idgrupofm';
        Ext.apply(this, config);

        this.codigo = true;
        this.storeFields = [{
            name: 'fechainicio'
        }, {
            name: 'fechafin'
        }];
        this.columnsFields = [{
            header: 'Fecha inicio',
            dataIndex: 'fechainicio'
        }, {
            header: 'Fecha fin',
            dataIndex: 'fechafin'
        }];
        Ext.erp.grupofarmacologico.superclass.constructor.call(this, arguments);
        this.btnHabilitar.purgeListeners();
        var _this = this;

        this.btnHabilitar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getCount() > 0) {
                    var idnomencladores = new Array();
                    Ext.each(_this.selectionModeNomenclador.getSelections(), function(item) {
                        idnomencladores.push(item.id);
                    });
                    _this.onAceptarActivar(idnomencladores, function() {
                        _this.treeLoader.reload();
                    });

                }
            }
        });

        this.selectionModeNomenclador.on({
            'rowselect': function (sm, index, rec) {
                _this.idnodo = rec.data.idpadre == rec.id ? 0 : rec.data.idpadre;
                _this.codigopadre = rec.data.codigo;
                _this.activarBotones();
            },
            'rowdeselect': function (sm, index, rec) {
                _this.idnodo = 0;
                _this.codigopadre = null;
                _this.activarBotones();
            }
        });

        _this.treeLoader.on({
            'load': function(st, recs) {
                _this.codigopadre = null;
                if (_this.buscar && recs.length == 0) {
                    mostrarMensaje(1, _this.idioma.lbSindatosBuscar);
                }
            }
        })
    },

    onAceptarEliminar: function (idnomencladores, _fn, msgp, msgr, msge) {//msgp, msge y msgr se utiliza en casos como marca modelo
        var _this = this;
        _this.hotKeyActive = true;
        mostrarMensaje(2, (msgp) ? msgp : _this.idioma.lbMsgConfirmarEliminar, function (btn) {
            if (btn == 'ok') {
                _this.codigopadre = null;
                Ext.MessageBox.wait(_this.idioma.lbMsgEliminandoNomenclador, "Por favor espere..." || '...');
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarnomenclador',
                    params: {
                        idnom: Ext.encode(idnomencladores),
                        pkid: _this.campoIdNomenclador,
                        modelo: _this.modelo,
                        bussines: _this.bussinesModel
                    },
                    method: 'POST',
                    callback: function (o, s, r) {
                        var dataResp = Ext.decode(r.responseText);
                        Ext.MessageBox.hide();
                        if (dataResp.success) {
                            mostrarMensaje(1, (msgr) ? msgr : _this.idioma.lbMsgNomencladorEliminado);

                            if (typeof _fn == 'function') {
                                _fn.call();
                            }
                        } else {
                            mostrarMensaje(3, (msge) ? msge : _this.idioma.lbMsgErrorEliminado);
                        }
                        _this.focus();
                    }
                });
            }
            _this.hotKeyActive = false;
            _this.focus();
        });
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

        if (_this.codigopadre != null && tempFp.items.items[0].getValue() != tempFp.items.items[0].originalValue && tempFp.items.items[0].originalValue != _this.codigopadre) {
            tempFp.items.items[0].setValue(_this.codigopadre +""+tempFp.items.items[0].getValue())
        }

        if (modificar ) {
            var idforma = _this.selectionModeNomenclador.selections.items[0].data.idforma;
            var idpadre = _this.selectionModeNomenclador.selections.items[0].data.idpadre;
            if (tempFp.items.items[0].getValue().length == 2 && idforma != idpadre) {
                tempFp.items.items[0].setValue(_this.codigopadre.charAt(0)+""+ _this.codigopadre.charAt(1)+""+tempFp.items.items[0].getValue());
            }
        }


        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST', params: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel
            },
            success: function (form, action) {
                _this.codigopadre = null;
                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function (form, action) {
                tempFp.items.items[0].setValue(tempFp.items.items[0].originalValue);
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