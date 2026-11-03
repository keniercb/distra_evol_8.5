Ext.apply(Ext.form.field.VTypes, {
    daterange: function(val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up('form').down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up('form').down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
            * Always return true since we're only using this vtype to set the
            * min/max allowed values (these are tested for after the vtype test)
            */
        return true;
    },

    daterangeText: 'Start date must be less than end date',

});

Ext.tip.QuickTipManager.init();

Ext.define('RecupClientesProveedores.view.WinBusquedaAvanzada', {
    extend: 'Ext.window.Window',
    alias: 'widget.winbusquedaavanzada',
    width: 200,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable : false,
    border: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.titleWinBusquedaAvanzada;
        
        var storeOperaFecha = Ext.create('Ext.data.ArrayStore',{
            fields: ['tipooperacion', 'denominacion'],
            data : [
                [1, me.etiquetas.lbIgual],
                [2, me.etiquetas.lbDeferente],
                [3, me.etiquetas.lbMayor],
                [4, me.etiquetas.lbMenor],
                [5, me.etiquetas.lbRango]
            ]
        });

        me.items = {
            xtype: 'form',
             bodyStyle : {
                padding: '5px 10px 10px 10px',
                background: '#DFE9F6'
            },
            fieldDefaults: {labelAlign: 'top', anchor: '100%'},
            items: [{
                xtype: 'combobox',
                fieldLabel: me.etiquetas.lbOperacion,
                store: storeOperaFecha,
                valueField: 'tipooperacion',
                displayField: 'denominacion',
                hiddenName: 'tipooperacion',
                triggerAction: 'all',
                forceSelection: true,
                name: 'tipooperacion',
                mode: 'local',
                emptyText: me.etiquetas.lbEmptyText,
                allowBlank: false,
                blankText: me.etiquetas.vBlankText,
                value: 5
            },{
                xtype: 'datefield',
                fieldLabel: me.etiquetas.lbFechaInicio,
                name: 'fechainicio',
                allowBlank: false,
                format:'d/m/Y',
                invalidText: me.etiquetas.errorFormatoFecha,
                blankText: me.etiquetas.vBlankText,
            },{
                xtype: 'datefield',
                fieldLabel: me.etiquetas.lbFechaFin,
                name: 'fechafin',
                format:'d/m/Y',
                invalidText: me.etiquetas.errorFormatoFecha,
                allowBlank: false,
                blankText: me.etiquetas.vBlankText,
            }]
        };

        me.buttons = [{
            text: me.etiquetas.lbBtnCancel,
            iconCls: 'icondistra-cancelar',
            tooltip: me.etiquetas.qtipCancel,
            action: 'cancelar'
        },{
            text: me.etiquetas.lbBtnBuscar,
            iconCls: 'icondistra-buscar',
            tooltip: me.etiquetas.qtipBuscar,
            action: 'buscar'
        }];

        me.callParent();
    }
});
