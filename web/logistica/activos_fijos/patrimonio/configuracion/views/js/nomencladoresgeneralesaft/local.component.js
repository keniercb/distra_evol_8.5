

/**
 *  @author Rajiv Rondon Padilla
 *  28/02/2015
 */



Ext.erp.nomlocal = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idlocal';
        Ext.apply(this, config);
        this.codigo = false;    

        _this.columnsFields = [
            {
                header: _this.idioma.lbClave,
                dataIndex: 'clave',
                width: 850
            }
        ];
        
       _this.storeFields = [
            {
                name: 'clave'
            },
            {
                name: 'clave'
            }
        ];

        var clave = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbClave,          
            anchor: '98%',                 
            id: 'clave',
            allowBlank:false,
            maxLength: 255,
            maxLengthText: _this.idioma.lbTxtMaxLgth255,
            regex: /^([a-zA-Z0-9\s������������?]+ ?[a-zA-Z0-9\s������������?]*)+$/,
            maskRe: /^([a-zA-Z0-9\s������������?]+?[a-zA-Z0-9\s������������?]*)+$/,
            regexText: 'Este valor es incorrecto.'        
        });

        _this.formFields = [clave];
        Ext.erp.nomlocal.superclass.constructor.apply(this, arguments);
    }
});