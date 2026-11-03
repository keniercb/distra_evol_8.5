/**
 *  Jorge Luis Cuellar Mondeja
 *  24/07/2013
 */
Ext.ns('Ext.erp');

/*
 *  Implemetación del componente para la gestión del nomenclador naturaleza 
 */
Ext.erp.naturaleza = Ext.extend(Ext.erp.treePanelNomenclador, {
    constructor: function(config) {
        config.campoIdNomenclador = 'idnaturaleza';
        Ext.apply(this, config);
        this.codigo = true;
        this.alfanumerico = true;
        this.storeFields = [{
            name: 'codigocontable'
        },{
            name: 'fechainicio'
        }, {
            name: 'fechafin'
        }];
        this.columnsFields = [{
            header: 'C\xf3digo contable',
            dataIndex: 'codigocontable'
        },{
            header: 'Fecha inicio',
            dataIndex: 'fechainicio'
        }, {
            header: 'Fecha fin',
            dataIndex: 'fechafin'
        }];
        Ext.erp.naturaleza.superclass.constructor.call(this, arguments);
        this.btnHabilitar.purgeListeners();
        var _this = this;
        this.btnHabilitar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getCount() > 0) {
                    var idnomencladores = new Array();
                    /*mostrarMensaje(2, _this.idioma.lbMsgConfirmarHabilitar, function (btn) {
                        if (btn == 'ok') {

                        }
                    });*/
                    Ext.each(_this.selectionModeNomenclador.getSelections(), function (item) {
                        idnomencladores.push(item.id);
                    });
                    _this.onAceptarActivar(idnomencladores, function () {
                        _this.treeLoader.reload();
                    });

                }
            }
        });
    },
    initComponent: function() {
        var _this = this;
        Ext.erp.naturaleza.superclass.initComponent.call(this);
        this.treeAgrupacion = new LOG.lb.plugin.TreeAgrupaciones({
            idioma: this.idioma,
            scope: this,
            hidden: true
        });
        this.add(this.treeAgrupacion);
        this.tablameta = {
            esquema: 'mod_logmetadata',
            tabla: 'nom_tiponomenclador',
            columnaref: 'idnaturaleza'
        };
        this.selectionModeNomenclador.on({
            selectionchange: function() {
                if (this.getCount() == 1) {
                    _this.tablameta.datoref = this.getSelected().id;
                    _this.treeAgrupacion.show();
                    _this.treeAgrupacion.recargarTree(_this.tablameta);
                } else {
                    _this.treeAgrupacion.hide();
                }
                _this.doLayout();
            }
        });
    },
    initFormFields: function () {
        var _this = this;
        this.tfCodigoContable = LOG.util.Prototipos.inputTexto({
            name: 'codigocontable',
            anchor: '98%',
            fieldLabel: 'C\xf3digo contable'
        });
        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: 1,
                layout: 'form',
                items: this.tfCodigoContable
            }]
        }];
    }
});
