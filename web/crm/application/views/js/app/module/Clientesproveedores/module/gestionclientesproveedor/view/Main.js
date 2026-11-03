Ext.define('GestionClienteProveedor.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gcpmain',
    closable: true,
    layout:'fit',
    border:false,
    frame:true,
    margins:'0 0 0 0',
    initComponent: function () {
        this.getLang();
        this.title = this.etiquetas.moduleName;
        window.UCID = window.parent.UCID;
        window.MyDesktop = window.parent.MyDesktop;
        this.html = '<div id="contenedor"><div class="loader-inner line-spin-fade-loader">' +
        '<div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>' +
        '</div></div>';
        this.callParent();
    }
});
