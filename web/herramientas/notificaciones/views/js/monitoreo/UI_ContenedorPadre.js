Ext.ns("Ext.notificaciones.monitoreo");
Ext.notificaciones.monitoreo.UI_ContenedorPadre = Ext.extend(Ext.Panel, {    
    layout: 'border',
    minHeight: 600,
    initComponent: function() {
        var defaultParams  = {
            params:{
                start: 0,
                limit: 20
            }
        };
        this.documentKeyMap = new Ext.KeyMap(document, [{
            key : 'b',
            alt : true,
            ctrl: false,
            fn : function() {                
                this.centerPanel.items.items[0].buscarAvisosEnviadosPorFiltros();
            },
            scope: this
        },{
            key : 'l',
            alt : true,
            ctrl: false,
            fn : function() {                
                this.centerPanel.items.items[0].limpiarFiltro();
            },
            scope: this
        },{
            key : 'h',
            alt : true,
            ctrl: false,
            fn : this.showHelp.createDelegate(this),
            scope: this
        }]);
        this.contenedorIzq = new Ext.notificaciones.monitoreo.UI_ContenedorIzquierdo({
            region: 'west',
            collapsible: true, 
            minWidth: 400,
            width: 400,
            minHeight: 600,
            maxWidth: 600,
            split:true, 
            labels: this.labels,
            listeners:{
                'eventodespachadoseleccionado': function(ideventodespachado){
                    this.contenedorCentral.getGridListarAvisos().enable();
                    this.contenedorCentral.getPanelDetallesAviso().collapse();
                    var s = this.contenedorCentral.getGridListarAvisos().getStore();
                    s.baseParams.ideventodespachado = ideventodespachado;                     
                    s.load(defaultParams);
                },
                'eventodespachadodeseleccionado': function(){
                    this.contenedorCentral.getGridListarAvisos().setDisabled(false);
                    this.contenedorCentral.getPanelDetallesAviso().collapse();
                    var s = this.contenedorCentral.getGridListarAvisos().getStore();
                    s.baseParams.ideventodespachado = null;                     
                    s.load(defaultParams);                    
                },
                scope: this
            }
            });
            
        this.contenedorCentral = new Ext.notificaciones.monitoreo.UI_ContenedorCentral({
            region: 'center', 
            height: 600,
            minHeight: 600,
            docKeyMap : this.documentKeyMap,
            split:  true, 
            labels: this.labels
            });
        /*{
         xtype: 'button',
         disabled : false,
         id : 'btnAyuda',
         icon : perfil.dirImg + 'ayuda.png',
         iconCls : 'btn',
         nextTab : 'filtro-nombre-aviso',
         text : this.labels.lbBtnAyuda,
         tooltip : this.labels.toolAyuda,
         handler: this.showHelp.createDelegate(this),
         scope: this
         }*/
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            text: '<b>Ayuda</b>',
            disabled: false,
            toolTip: 'Ayuda <b>(Alt+H)</b>',
            icon: perfil.dirImg + 'ayuda.png',
            nextTab: 'btn-adicionar-aviso',
            menu: new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function () {
                            var title = 'Ayuda del monitoreo de avisos';
                            var referencia = 'monitoreoavisos';
                            help.show(title, referencia);
                        },
                        text: 'Ayuda',
                        id: 'btnAyuRel',
                        icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'btn',
                        tooltip: 'Ayuda del sistema'
                    },
                    {
                        text: 'Acerca de',
                        id: 'acercade',
                        icon: perfil.dirImg  + 'info.png',
                        iconCls: 'btn',
                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                        handler: function () {

                            var uri = "herramientas/notificaciones";
                            acercaDe.show(uri);
                        }}
                ]
            })

        });
        this.centerPanel = new Ext.Panel({
            layout: 'border',
            region: 'center', 
            minWidth: 300,
            height: 600,
            minHeight: 600,
            items: [new Ext.notificaciones.monitoreo.SentNotificationsSearchToolbar({
                region: 'north',
                labels: this.labels,
                gridReference: this.contenedorCentral.getGridListarAvisos()
            }), this.contenedorCentral],
            tbar: ['->',this.btnAyuda ]
        });
        this.items = [this.contenedorIzq, this.centerPanel];		
        Ext.notificaciones.monitoreo.UI_ContenedorPadre.superclass.initComponent.call(this);
    },
    getLeftCtn: function(){
        return this.contenedorIzq;
    },
    getCenterCtn: function(){
        return this.contenedorCentral;
    },
    showHelp: function(){        
        var title	= this.labels.ttHelp;
        var referencia	= 'monitoreoavisos';
        help.show(title, referencia);
    }
});