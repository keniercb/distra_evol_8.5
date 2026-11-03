Ext.ns('Ext.LOG.RegNumOperativo');

Ext.LOG.RegNumOperativo.RegistroActivoService = Ext.extend(Ext.Panel, {
    regOperativo: undefined,
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.RegistroActivoService.superclass.constructor.call(this, config);
        this.on({
            render: function() {
                Ext.MessageBox.wait(LOG.util.Idioma.init().msgCargaInicial, LOG.util.Idioma.init().msgEspere);
                this.getEl().on('load', function() {
                    Ext.MessageBox.hide();                    
                    _this.regOperativo = _this.getEl().dom.contentWindow;
                });
            }
        });
    },
    initComponent: function() {
        Ext.LOG.RegNumOperativo.RegistroActivoService.superclass.initComponent.call(this);
        Ext.apply(this, {
            region: 'center',
            autoEl: {
                tag: 'iframe',
                frameborder: '0',
                src: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/gestregoperativo',
                id: idFuncionalidadActivo,
                style: 'height: 100%; width: 100%; border: none;'
            }

        });
    }
});