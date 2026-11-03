Ext.define('Modules.view.Main', {
    extend: 'Ext.form.Panel',
    alias: 'widget.gestmodules',
    requires: ['Ext.ux.form.field.ToggleSlide'],
    frame: true,
    border: false,
    closable: true,
    bodyPadding: 10,
    layout: 'fit',
    trackResetOnLoad: true,
    //bodyStyle: 'background:#DFE9F6;',

    initComponent: function() {
        this.getLang();
        this.title = this.etiquetas.moduleName;

        this.html = '<div id="contenedor"><div class="loader-inner line-spin-fade-loader">' +
            '<div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>' +
            '</div></div>' +
            '<p id="info">' + this.etiquetas.lbGetingConfig + '</p>'

        this.buttons = [
            {
                text: this.etiquetas.lbSave,
                tooltip: this.etiquetas.qtipApply,
                iconCls: 'guardar',
                disabled: true,
                action: 'apply',
                hidden: true
            },
            {
                text: this.etiquetas.lbBtnCancel,
                tooltip: this.etiquetas.qtipCancel,
                iconCls: 'cancelar',
                action: 'cancel',
                hidden: true
            }
        ];

        this.callParent();
    }
});
