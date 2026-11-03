Ext.ns('GestionContratoImportacion.view.GestorDocumental');
Ext.onReady(function () {
    window.parent.UCID.portal = {};
    window.parent.UCID.portal.perfil = {};
    new GestionContratoImportacion.view.GestorDocumental.MainPanel();
});

GestionContratoImportacion.view.GestorDocumental.MainPanel = Ext.extend(Ext.Viewport, {
    layout:'fit',
    constructor: function (params) {
        Ext.Ajax.request({
            method: "POST",
            url: "/crm/contratacion/index.php/gestordocumental/getEspacioTrabajo",
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if(response.idnodo){
                    this.createBody(response.idnodo);
                    GestionContratoImportacion.view.GestorDocumental.MainPanel.superclass.constructor.call(this, params);
                    this.initEvents();
                }
            }
        });
    },
    createBody:function(idnodo){
        this.contenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
        this.contenido.inicializarComponente(true, idnodo);
        this.items = {
            xtype: 'panel',
            items: [this.contenido.barra2PC,this.contenido.barra1PC,this.contenido.panelCentral]
        };
    },
    initEvents:function(){
        this.on({
            resize: this.setDimentions
        });
        this.contenido.on({
            scope:this,
            obtenerContenidoOK: this.setDimentions
        })
    },
    setDimentions:function(){
        this.contenido.panelCentral.getComponent(1).setHeight(this.container.dom.clientHeight);
        this.contenido.panelCentral.getComponent(1).setWidth(this.container.dom.clientWidth);
        this.doLayout();
    }
});
