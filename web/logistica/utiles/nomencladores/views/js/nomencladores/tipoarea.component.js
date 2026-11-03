Ext.ns('Ext.erp');

Ext.erp.tipoarea = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idnomtipoarea';

        /*se desabilito Tipo de Operacion */
       /* this.columnsFields = [{
                dataIndex: 'tipooperacion',
                header: _this.idioma.lbTipoOper,
                width: 260,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        return _this.idioma.lbConsumo;

                    } else {
                        return _this.idioma.lbFactura;

                    }
            }
        }];*/

        

        this.storeFields = [{
            name : 'extensionfechavencimiento'
        },{
            name : 'nacionalexportacion'
        },/*{
            name : 'tipooperacion'
        },*/{
            name : 'capacidad'
        },{
            name : 'producto'
        },{
            name : 'um'
        },{
            name : 'idtipoareaentidad'
        }];

        this.storeNacional = new Ext.data.SimpleStore({
            fields : ['tiponacional', 'valornacional'],
            data : [
                ['Nacional 1', 1],
                ['Nacional 2', 2],
                ['Nacional 3', 3],
                ['Nacional 4', 4],
                ['Nacional 5', 5],
                ['Nacional 6', 6],
                ['Nacional 7', 7]
            ]});


        this.relacionadorBtn = new Ext.Button({
            text: _this.idioma.lbBtnRelaciones,
            tooltip: _this.idioma.lbTtBtnRelaciones,
            iconCls: 'diferenciaconbanco',
            disabled : true
        });

        this.tbarBtns = [
            _this.relacionadorBtn
        ];

        this.relacionadorBtn.on({
            'click':function(){
                _this.onBtnRelacionadorClick();
            }
        });

        this.bussinesModel = 'NomTipoareaModel';
        Ext.erp.tipocalidad.superclass.constructor.call(this, config);
    },

    activarBotones : function() {
        var _this = this;
        Ext.erp.tipocalidad.superclass.activarBotones.call(this);
        _this.relacionadorBtn.disable();
        if(_this.selectionModeNomenclador.getCount() > 0 && _this.selectionModeNomenclador.getSelected().data.usarentidad && _this.selectionModeNomenclador.getSelected().data.estado == 1){
            _this.relacionadorBtn.enable();
        }
    },

    onBtnAdicionarClick : function () {
        Ext.erp.tipocalidad.superclass.onBtnAdicionarClick.call(this);
        this.fpGestionarNomenclador.setWidth(400);
    },

    onBtnModificarClick : function() {
        var _this = this;
        Ext.erp.tipocalidad.superclass.onBtnModificarClick.call(this);

    },

    /***
     * TODO Falta solamente implementar el aceptar, hacer un submit al formulacion y pasar como parametro los adicionados y los eliminados de los relaciones
     **/
    onBtnRelacionadorClick : function() {
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
                if(_this.relacionadorOperaciones.getTotalCount() == 0 ){
                    mostrarMensaje(3,'Debe seleccionar al menos una operación.');
                    return;
                }
                if(_this.relacionadorNaturalezas.getTotalCount() == 0){
                    mostrarMensaje(3,'Debe seleccionar al menos una naturaleza.');
                    return;
                }
                Ext.getBody().mask('Guardando datos', 'x-mask-loading');
                _this.fpRelacionador.getForm().submit({
                    url : 'insertarnomenclador',
                    waitMsg: _this.idioma.lbMsgSalvandoRelacionador,
                    method: 'POST',
                    params: {
                        naturalezas_adicionadas: _this.relacionadorNaturalezas.adicionados.join(','),
                        naturalezas_eliminadas: _this.relacionadorNaturalezas.eliminados.join(','),
                        operaciones_eliminadas: _this.relacionadorOperaciones.eliminados.join(','),
                        operaciones_adicionadas: _this.relacionadorOperaciones.adicionados.join(','),
                        idtipoareaentidad : _this.selectionModeNomenclador.getSelected().data.idtipoareaentidad,
                        bussines : 'NomTipoareaoperacionesModel'
                    },
                    success: function(form, action) {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, 'Los datos han sido salvados satisfactoriamente.');
                        _this.winRelacionador.close();
                    },
                    failure: function(form, action) {
                        Ext.getBody().unmask();
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
            width: 1006,
            height: 475,
            buttons: [
                this.btnCancelarRelaciones,
                this.btnAceptarRelaciones
            ]
        });

        this.relacionadorOperaciones = new Ext.erp.relacionador({
            height: 200,
            modeloIzq:'DatOperacionCont',
            idIzq:'idnomoperaciones',
            valorCampo : 1,
            campoIdNomenclador : 'idnomtipoareaentidad',
            bussinesModelIzq : 'NomTipoareaoperacionesModel',
            bussinesModelDer : 'NomTipoareaoperacionesModel',
            modeloDer:'NomTipoareaoperaciones',
            idDer:'idnomtipoareaentidad',
            tituloIzq:'Operaciones',
            tituloDer:'Operaciones asociadas'
        });

        this.relacionadorNaturalezas = new Ext.erp.relacionador({
            height: 200,
            modeloIzq:'NomNaturaleza',
            idIzq:'idnaturaleza',
            valorCampo : 1,
            bussinesModelIzq : 'NomTipoareatipoproductoModel',
            bussinesModelDer : 'NomTipoareatipoproductoModel',
            campoIdNomenclador : 'idtipoareaentidad',
            modeloDer:'NomTipoareatipoproducto',
            idDer:'idtipoareaentidad',
            tituloIzq:'Naturalezas',
            tituloDer:'Naturalezas asociadas'
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
                xtype : 'hidden',
                name : 'idtipoareaentidad'
            },_this.relacionadorOperaciones, _this.relacionadorNaturalezas]
        });

        this.winRelacionador.add(this.fpRelacionador);
        this.winRelacionador.show();
        this.fpRelacionador.getForm().loadRecord(_this.selectionModeNomenclador.getSelected());
    }
    /*se desabilito Tipo de Operacion */
    /*initFormFields: function() {
        var _this = this;
        this.formFields = [new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbTipoOper,
            anchor : '99%',
            allowBlank:false,
            valueField: 'tipooperacion',
            hiddenName: 'tipooperacion',
            displayField: 'operacion',
            store: new Ext.data.SimpleStore({
                fields: ['tipooperacion', 'operacion'],
                data: [
                    [0, _this.idioma.lbFactura],
                    [1, _this.idioma.lbConsumo]
                    
                ]
            })
        })];
        
    }*/
});
