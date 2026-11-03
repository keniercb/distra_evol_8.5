Ext.ns('Ext.erp');

Ext.erp.nomubicaciontall = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
     idproducto: undefined,
    constructor: function (config) {
        var _this = this;
        this.bussinesModel = 'NomUbicaciontallModel';
        this.campoIdNomenclador = 'idubicaciontall';
        config.codigo = false;
        config.usarFecha = true; 
        this.storeFields = [{
            name: 'inicial'
        }, {
            name: 'final'
        }];
        
        // this.columnsFields = [{
        //     dataIndex: 'cuenta',
        //     header:'Cuenta contable',
        //     width: 260
        // }];
        this.columnsFields = [
            {
                dataIndex: 'inicial',
                header: 'Ubicación inicial',
                width: 95,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="' + 'Ubicación inicial' + '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip="' + 'Ubicación inicial' + '"';
                    }
                }
            },
            {
                dataIndex: 'final',
                header: 'Ubicación final',
                width: 95,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="' + 'Ubicación final' + '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip="' + 'Ubicación final' + '"';
                    }
                }
            }
        ];
        Ext.erp.nomubicaciontall.superclass.constructor.call(this, config);
    },
    initFormFields: function() {
        var _this = this;
     
        //  this.formFields = [
        // ];


        
    }
});