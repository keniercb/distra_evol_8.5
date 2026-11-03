Ext.define('Solicitud.view.WinDetalles', {
    extend: 'Ext.window.Window',
    alias: 'widget.scp_windetalle',
    margin: false,
    width: 600,
    maxHeight: 500,
    closable : true,
    closeAction: 'hide',
    modal: true,
    resizable : false,
    bodyStyle: {
        padding: '10px',
        background: 'white'
    },
    bodyCls: 'detallessolicitud',
    autoScroll: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.lbBtnDetalles;

        me.buttons = [{
            text: me.etiquetas.lbTabClose,
            iconCls: 'icondistra-cerrar',
            tooltip: me.etiquetas.qtipClose,
            action: 'cerrar',
            handler: function(){
                me.close();
            }
        }];

        me.containerGeneral = Ext.create('Ext.container.Container',{
            cls: 'detallessolicitud-general',
            tpl: me.getTemplateGeneral(),
            data: []
        });

        me.items = [me.containerGeneral];
        me.callParent();
    },
    show:function(record){
        var me = this,
            data = record.getData();


        this.containerGeneral.update(data);
       
        this.callParent();
        
        this.center();
    },
    getTemplateGeneral: function(){
        var me = this;

        return new Ext.XTemplate(
            '<div>',
                '<div class="solicitudneogico-block solicitudneogico-allrow">',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbNombre+':</label><span>{nombre}</span>',
                    '</div>',
                '</div>',
                '<div class="solicitudneogico-block solicitudneogico-allrow">',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbDireccion+':</label><span>{direccion}</span>',
                    '</div>',
                '</div>',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbPais+':</label><span>{nombredpapais}</span>',
                    '</div>',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbCodigoPostal+':</label><span>{codigopostal}</span>',
                    '</div>',
                '</div>',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbCiudad+':</label><span>{nombredpaciudad}</span>',
                    '</div>',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbCorreo+':</label><span>{correo}</span>',
                    '</div>',
                '</div>',
                '<div class="solicitudneogico-block">',
                    '<div class="solicitudneogico-item">',
                        '<label>'+me.etiquetas.lbTelefono+':</label><span>{telefono}</span>',
                    '</div>',
                '</div>',
            '</div>'
        );
    }
});
