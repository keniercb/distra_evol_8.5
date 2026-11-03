Ext.erp.actividad = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        
        var _this = this;
        config.campoIdNomenclador = 'idactividad';
        Ext.apply(this, config);
        this.codigo = false;
        this.bussinesModel = 'ActividadMedioModel';

        _this.columnsFields = [
            {
                header: _this.idioma.lbTipoactividad,
                dataIndex: 'descripciontc',
                width: 140

            }
        ];

        _this.storeFields = [
            {
                name: 'descripciontc'
            },
            {
                name: 'iddepreciacion'
            }
        ];

      
        Ext.erp.actividad.superclass.constructor.apply(this, arguments);
    },
    initFormFields: function() {
        var _this = this;
          RecordCombo = new Ext.data.Record.create([
            {
                name: 'descripcion',
                mapping: 'descripcion'
            },
            {
                name: 'iddepreciacion',
                mapping: 'iddepreciacion'

            }
        ]);

        var storedepreciacion = new Ext.data.Store({
            url: '/logistica/activos_fijos/configuracion/index.php/nomactividad/cargardepreciacion',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                //root: 'datos',
                id: 'iddepreciacion'
            }, RecordCombo)
        });

        var combito = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbTipoactividad,
            hiddenName: 'descripciontc',
            anchor: '98%',
            editable: false,
            store: storedepreciacion,
            valueField: 'iddepreciacion',
            displayField: 'descripcion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            emptyText: _this.idioma.lbMsgSeleccionarCombo,
            selectOnFocus: true,
            listeners: {
                'select': function (c, r, i) {
                    Ext.getCmp('hdiddepreciacion').setValue(c.getValue());
                }
            }
        });

        _this.formFields = [combito, {
            xtype: 'hidden',
            name: 'iddepreciacion',
            id: 'hdiddepreciacion'
        }];
        
    }
});