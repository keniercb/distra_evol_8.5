Ext.ns('Ext.erp');

Ext.erp.tipoareat = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idnomtipoarea';

        this.storeFields = [{
                name: 'idtipoareaentidad'
            }];


        this.relacionadorBtn = new Ext.Button({
            text: _this.idioma.lbBtnRelaciones,
            tooltip: _this.idioma.lbTtBtnRelaciones,
            iconCls: 'diferenciaconbanco',
            disabled: true
        });

        this.tbarBtns = [
            _this.relacionadorBtn
        ];

        this.relacionadorBtn.on({
            'click': function() {
                _this.onBtnRelacionadorClick();
            }
        });

        this.bussinesModel = 'NomTipoareatModel';
        Ext.erp.tipoareat.superclass.constructor.call(this, config);
    },
    activarBotones: function() {
        var _this = this;
        Ext.erp.tipoareat.superclass.activarBotones.call(this);
        _this.relacionadorBtn.disable();
        if (_this.selectionModeNomenclador.getCount() > 0 && _this.selectionModeNomenclador.getSelected().data.usarentidad && _this.selectionModeNomenclador.getSelected().data.estado == 1) {
            _this.relacionadorBtn.enable();
        }
    },
    onBtnAdicionarClick: function() {
        Ext.erp.tipoareat.superclass.onBtnAdicionarClick.call(this);
        this.fpGestionarNomenclador.setWidth(400);
    },
 
    /***
     * TODO Falta solamente implementar el aceptar, hacer un submit al formulacion y pasar como parametro los adicionados y los eliminados de los relaciones
     **/
    onBtnRelacionadorClick: function() {
        var _this = this;

        this.btnCancelarRelaciones = new Ext.Button({
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            iconCls: 'cancelar',
            handler: function() {
                _this.winRelacionador.close();
            }
        });

        this.btnAceptarRelaciones = new Ext.Button({
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptar,
            iconCls: 'aceptar',
            handler: function() {
                if (_this.relacionadorOperaciones.getTotalCount() == 0) {
                    mostrarMensaje(3, 'Seleccionar operaciones');
                    return;
                }
                if (_this.relacionadorNaturalezas.getTotalCount() == 0) {
                    mostrarMensaje(3, 'Seleccionar naturalezas');
                    return;
                }
					
                _this.fpRelacionador.getForm().submit({
                    url: 'insertarnomenclador',
                    waitMsg: _this.idioma.lbMsgSalvandoRelacionador,
                    method: 'POST',
                    params: {
                        naturalezas_adicionadas: _this.relacionadorNaturalezas.adicionados.join(','),
                        naturalezas_eliminadas: _this.relacionadorNaturalezas.eliminados.join(','),
                        operaciones_eliminadas: _this.relacionadorOperaciones.eliminados.join(','),
                        operaciones_adicionadas: _this.relacionadorOperaciones.adicionados.join(','),
                        idtipoareaentidad: _this.selectionModeNomenclador.getSelected().data.idtipoareaentidad,
                        bussines: 'NomTipoareaoperacionestModel'
                    },
                    success: function(form, action) {
                        mostrarMensaje(1, 'todo ok');
                        _this.winRelacionador.close();
                    },
                    failure: function(form, action) {
                        if (action.result.etiqueta)
                            mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                    }
                });


            }
        });

        this.winRelacionador = new Ext.Window({
            modal: true,
            closeAction: 'close',
            resizable: false,
            title: _this.idioma.lbTtBtnR, //Relacionar \xe1reas, operaciones y tipos de productos
            width: 815,
            height: 475,
            buttons: [
                this.btnCancelarRelaciones,
                this.btnAceptarRelaciones
            ]
        });
// es aki el problema
        this.relacionadorOperaciones = new Ext.erp.relacionador({
            height: 200,
            modeloIzq: 'DatOperacionCont',
            idIzq: 'idoperacion',
            valorCampo: 1,
            campoIdNomenclador: 'idnomtipoareaentidad',
            bussinesModelIzq: 'NomTipoareaoperacionestModel',
            bussinesModelDer: 'NomTipoareaoperacionestModel',
            modeloDer: 'NomTipoareaoperacionesT',
            idDer: 'idnomtipoareaentidad',
            tituloIzq: 'Operaciones',
            tituloDer: 'Operaciones asociadas'
        });

        this.relacionadorNaturalezas = new Ext.erp.relacionador({
            height: 200,
            modeloIzq: 'NomNaturaleza',
            idIzq: 'idnaturaleza',
            valorCampo: 1,
            bussinesModelIzq: 'NomTipoareatipoproductotModel',
            bussinesModelDer: 'NomTipoareatipoproductotModel',
            campoIdNomenclador: 'idtipoareaentidad',
            modeloDer: 'NomTipoareatipoproductoT',
            idDer: 'idtipoareaentidad',
            tituloIzq: 'Naturalezas',
            tituloDer: 'Naturalezas asociadas'
        });

        this.relacionadorOperaciones.setValorCampo(_this.selectionModeNomenclador.getSelected().data.idtipoareaentidad);
        this.relacionadorNaturalezas.setValorCampo(_this.selectionModeNomenclador.getSelected().data.idtipoareaentidad);

        this.relacionadorOperaciones.loadDatos();
        this.relacionadorNaturalezas.loadDatos();
        this.fpRelacionador = new Ext.form.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            items: [{
                    xtype: 'hidden',
                    name: 'idtipoareaentidad'
                }, _this.relacionadorOperaciones, _this.relacionadorNaturalezas]
        });

        this.winRelacionador.add(this.fpRelacionador);
        this.winRelacionador.show();
        this.fpRelacionador.getForm().loadRecord(_this.selectionModeNomenclador.getSelected());
    }
});
