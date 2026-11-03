/**
 * @include "gestionarAvisos/GestionarAvisos.js"
 * @include "gestionarEventos/GestionarEventos.js"
 * @class ConfigurarAvisos
 * @extends Ext.Viewport
 */

ConfigurarAvisos = Ext.extend(Ext.Viewport, {
    layout: 'border',
    initComponent: function() { 
        this.documentKeyMap = new Ext.KeyMap(document, [{
            key : 'i',
            alt : true,
            ctrl: false,
            fn : function() {                
                this.getEventGrid().MostrarEventos(true, null);
            },
            scope: this
        },{
            key : 'm',
            alt : true,
            ctrl: false,
            fn : function() {                 
                var record = this.getEventGrid().getSelectionModel().getSelected();
                this.getEventGrid().MostrarEventos(false, record);
            },
            scope: this
        },{
            key : 46, 
            alt: false,
            ctrl: false,
            fn : function() {                 
                var store = this.getEventGrid().getStore();
                var record = this.getEventGrid().getSelectionModel().getSelected();
                this.getEventGrid().Eliminar(store, record);    
            },
            scope: this
        },{
            key : 'a',             
            ctrl: false,
            alt: true,
            fn : function() {
                var store = this.getEventGrid().getStore();
                var record = this.getEventGrid().getSelectionModel().getSelected();
                this.getEventGrid().Activar(store, record);
            },
            scope: this
        },{
            key : 'h', 
            alt: true, 
            ctrl: false,
            fn : function() { 
                        var title = this.labels.ttHelp;
                        var referencia = 'notificaciones/configurar';
                        help.show(title, referencia);
            },
            scope: this
        },{
            key : 'i', 
            alt: true,            
            ctrl: true,
            fn : function() {                 
                if(this.getEventGrid().getSelectionModel().hasSelection()){
                    this.getNotificationGrid().MostrarAvisos(true, null);
                }                
            },
            scope: this
        },{
            key : 'm', 
            alt: true,            
            ctrl: true,
            fn : function() {                 
                var rec = this.getNotificationGrid().getSelectionModel().getSelected();                
                this.getNotificationGrid().MostrarAvisos(false, rec);
            },
            scope: this
        },{
            key : 46, 
            alt: false,
            ctrl: true,
            fn : function() {                 
                var store = this.getNotificationGrid().getStore();
                var rec = this.getNotificationGrid().getSelectionModel().getSelected();                 
                this.getNotificationGrid().Eliminar(store, rec);
            },
            scope: this
        }]);
        this.items = [{
            region: 'north', 
            docKeyMap: this.documentKeyMap,
            viewConfig:{
                forceFit:true
            },
            labels: this.labels,
            split: true, 
            xtype: 'gestionarEventos.listarEventos',
            listeners:{
                eventchange: function(){
                    this.getEventGrid().enableAll(false);
                    this.getNotificationGrid().enableAll(false, false);
                    this.getNotificationGrid().getStore().baseParams.idevento = null;
                    this.getNotificationGrid().getStore().load({
                        params: {
                            start: 0,
                            limit: 10
                        }
                    });
                },
                scope: this
            }
        },{
            region: 'center',   
            docKeyMap: this.documentKeyMap,
            split: true,
            labels: this.labels,
            viewConfig:{
                forceFit:true
            },
            xtype: 'gestionarAvisos.listarAvisos'
        }
        ];   
        ConfigurarAvisos.superclass.initComponent.call(this); 
        var sm =  this.items.items[0].getSelectionModel();
        sm.on("rowselect",function(sm, rowIndex, record){  
            this.items.items[0].idevento = record.data.idevento;     		
            this.items.items[1].idevento = this.items.items[0].idevento;       		
            this.items.items[1].enableAll(true, false);
            this.items.items[1].getStore().baseParams.idevento = this.items.items[1].idevento;
            this.items.items[1].getStore().load({
                params: {
                    start: 0,
                    limit: 10
                }
            });
        }, this);
        sm.on('rowdeselect', function(sm, rowIndex, record){
            this.items.items[1].enableAll(false, false);
            this.items.items[1].getStore().baseParams.idevento = null;
            this.items.items[1].getStore().load({
                params: {
                    start: 0,
                    limit: 10
                }
            });
        }, this);                
    },
    add_Events : function(){
        this.mostrarEditarEvents();
    },
    mostrarEditarEvents : function(){
        this.winEditarEvents ? this.winEditarEvents.show() : this.winEditarEvents = new Editar_Events();
        this.winEditarEvents.show();
    },
    mostrarEditarAvisos :function(){
        this.winEditarAvisos ? this.winEditarAvisos.show() : this.winEditarAvisos = new Editar_Avisos();
        this.winEditarAvisos.show();
    },
    getEventGrid: function(){
        return this.items.items[0];
    },
    getNotificationGrid: function(){
        return this.items.items[1];
    }
});
