Ext.define('ConfContratacion.view.ConfArchivoPHP', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confarchivophp',
    layout: 'border',
    frame: true,
    border: false,
    trackResetOnLoad: true,
    title: 'Editar fichero de configuración',
    defaults: {
        style: 'margin:5px 5px;',
        bodyStyle: 'background:#DFE9F6;padding:5px;',
        border: false
    },
    fieldDefaults: {labelAlign: 'top'},
    initComponent: function () {
        var self = this;

        this.pFileCompartimentacion = Ext.create('ConfContratacion.view.TabFileConfiguracion');

        this.items = [this.pFileCompartimentacion];

        this.callParent();
    }
});
