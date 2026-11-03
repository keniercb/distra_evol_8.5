/**
 * Created by W-01223 on 23/01/15.
 */
Ext.ns('Ext.erp');

Ext.erp.marcaarmamento = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomMarcaarmamentoModel';
        this.campoIdNomenclador = 'idmarcaarmamento';
        config.codigo = false;
        this.formFields = [new Ext.erp.tecladoruso({config: config, principal: this})];
        this.storeFields = [{
            name : 'idelemento'
        }];

        this.storeElemento = new Ext.data.Store({
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            autoLoad: true,
            baseParams: {
                modelo: 'NomElemento',
                idnom: 'idelemento',
                entidad : true
            },
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                root: "datos",
                fields: [
                    {
                        name: 'idelemento'
                    },
                    {
                        name: 'denominacion'
                    }
                ]
            })
        });

        this.cmbElemento =new LOG.util.ComboBox({
            displayField: 'denominacion',
            store: _this.storeElemento,
            hiddenName: 'idelemento',
            editable: false,
            autoLoad: false,
            valueField: 'idelemento',
            emptyText: this.idioma.lbSeleccione
        });

        this.panelSuperior = new Ext.Panel({
            region: 'north',
            tbar:['->', new Ext.menu.TextItem({
                text: this.idioma.lbcmbElemento + ':'
            }), '', this.cmbElemento ]
        });


        Ext.erp.marcaarmamento.superclass.constructor.call(this, config);


        this.panelBotones.add(this.panelSuperior);
        this.panelBotones.setHeight(52);

        this.btnAdicionar.disable();
        this.cmbElemento.on({
            'select':function(combo, record, index){
                _this.onSelectElemento(record.id);
                _this.btnAdicionar.enable();
            }
        });


        _this.selectionModeNomenclador.fireEvent = _this.selectionModeNomenclador.fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                if(this.getSelected().data.denominacion == 'S/Datos'){
                    _this.btnModificar.disable();
                    _this.btnNoUsarEntidad.disable();
                    _this.btnUsarEntidad.disable();
                    _this.btnEliminar.disable();
                    if(this.getSelected().data.usarentidad){
                        _this.btnUsarEntidad.disable();
                    }else{
                        _this.btnUsarEntidad.enable();
                    }
                }
            }
        });

        _this.onBtnAdicionarClick = _this.onBtnAdicionarClick.createSequence(function() {
            Ext.apply(this.fpGestionarNomenclador.items.items[0], {regex : /^[\w\s\-\/ñÑ/áéíóúАБВГДЕЁЖЗЙКЛМИНОПРСТУФХЦЧШЩЪЭЮЯ]+$/});
        });
        _this.onBtnModificarClick = _this.onBtnModificarClick.createSequence(function() {
            Ext.apply(this.fpGestionarNomenclador.items.items[0], {regex : /^[\w\s\-\/ñÑ/áéíóúАБВГДЕЁЖЗЙКЛМИНОПРСТУФХЦЧШЩЪЭЮЯ]+$/});
        });
    },

    onSelectElemento : function(idelemento) {
        var _this = this;
        this.storeNomenclador.on({
            'beforeload': function () {
                _this.storeNomenclador.baseParams.idelemento = idelemento
            }
        });
        this.storeNomenclador.load();
    },

    onBtnAdicionarClick: function () {
        var _this = this;
        Ext.erp.marcaarmamento.superclass.onBtnAdicionarClick.call(this);
        this.fpGestionarNomenclador.getForm().on({
            'beforeaction': function (fp, action) {
                _this.fpGestionarNomenclador.getForm().baseParams = {
                    idelemento: _this.cmbElemento.getValue()
                }
            }
        });
    }
});