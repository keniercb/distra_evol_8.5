Ext.define('GestionContratoImportacion.view.GestorDocumental.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.gestordocwindowimportacion',
    height: 500,
    width: 850,
    modal: true,
    maximizable: true,
    frame: false,
    initComponent: function () {
        this.idiframe = "iframegestordoc";
        this.etiquetas = LangMgr.getLang(this);
        this.html = '<iframe id="' + this.idiframe + '" style="border: none;" src= "/crm/contratacion/index.php/gestordocumental/gestordocumental" width="100%" height="100%"></iframe>';
        this.callParent();
        this.initEvents();
    },
    initEvents: function () {
        var me = this;
        this.on({
            show: function () {
                this.mask = new Ext.LoadMask(this.body, {msg: this.etiquetas.msgLoading});
                this.mask.show();

                document.getElementById(this.idiframe).onload = function () {
                    me.mask.hide();
                };
            }
        });
    }
});
