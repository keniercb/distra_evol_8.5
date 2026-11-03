Ext.define('GestionClienteProveedor.controller.Main', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'main', selector: 'gcpmain'}
    ],

    init: function () {
        this.baseUrl = '/configuracion/clientesyproveedores/index.php/clientesyproveedores/clientesyproveedores';
        this.getLang();
        this.listen({
            component: {
                gcpmain: {
                    render: this.onRender
                }
            }
        });
    },
    onRender: function (panel) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerIdfuncionalidad'}, this),
            params: {
                url: me.baseUrl
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                    me.idfuncionalidad = response.idfuncionalidad;

                if (success && me.idfuncionalidad) {
                    me.createIframe(panel, me.idfuncionalidad);
                }
            }
        });
    },
    createIframe: function (panel, idfuncionalidad) {
        panel.add(Ext.create('Ext.panel.Panel', {
            border: false,
            frame: false,
            html: '<iframe id="' + idfuncionalidad + '" style="border: none;" src= "' + this.baseUrl + '" width="100%" height="100%"></iframe>'
        }));
    }
});