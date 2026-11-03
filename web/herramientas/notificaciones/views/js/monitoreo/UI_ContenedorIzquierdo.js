Ext.ns("Ext.notificaciones.monitoreo");
/**
 * @class Ext.notificaciones.monitoreo.ListarEventosDespachados
 * @extends Ext.grid.GridPanel
 * @namespace Ext.notificaciones.monitoreo
 * @description Lista los eventos que se han despachado
 */
Ext.notificaciones.monitoreo.ListarEventosDespachados = Ext.extend(Ext.grid.GridPanel, {        
    id: 'grid-listar-eventosdespachados',
    iconCls: 'icon-grid',
    autoExpandColumn: 'fecha-evento-dispatched',
    viewConfig: {
        forceFit:true
    },    
    initComponent: function(){ 
        this.selModel =   new Ext.grid.RowSelectionModel({
            singleSelect:   true
        });
        var expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><b> ' + this.labels.lbDetails + ': </b> <p>{detalles}</p></p><br>'
                )
        });
        this.plugins = expander;     
        var successFailureImg = function(success){                
            return '<img src="' + perfil.dirImg + (Util.str2Boolean(success) ? 'validaryaceptar' : 'cerrar') + '.png"/>';
        };
        var EventRecordType =  Ext.data.Record.create([            
        {
            name: 'ideventodespachado', 
            mapping: 'ideventodespachado'
        },{
            name: 'nombre', 
            mapping: 'nombre'
        },{
            name: 'fecha', 
            mapping: 'fecha'
        },{
            name: 'sender', 
            mapping: 'sender'
        },{
            name: 'exito', 
            mapping: 'exito'
        },{
            name: 'detalles', 
            mapping: 'detalles'
        }
        ]);
        this.store = new Ext.data.GroupingStore({
            url: 'listareventosdespachados',            
            remoteSort: true,            
            sortInfo: {
                field: 'fecha', 
                direction: 'DESC'
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'total'
            }, EventRecordType),
            groupField: 'nombre'
        });
        this.view = new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{[values.rs[0].data["nombre"]]} ({[values.rs.length]} {[values.rs.length > 1 ? "' + this.labels.lbTimes + '":"' + this.labels.lbOneTime + '"]})'        
        });
        this.columns = [expander, {            
            dataIndex: 'nombre',
            header: this.labels.lbEventName,               
            sortable: false,
            width: 150
        },{            
            dataIndex: 'sender',
            header: this.labels.lbSender,               
            sortable: false,
            width: 130
        },{
            dataIndex: 'fecha',
            id: 'fecha-evento-dispatched',
            header: this.labels.lbDate,               
            sortable: true                
        },{
            dataIndex: 'exito',
            header:   this.labels.lbSuccess, 
            renderer: successFailureImg,
            sortable: true,
            width: 30
        }];
        this.bbar = new Ext.PagingToolbar({
            pageSize:       20,
            store:          this.store,
            displayInfo:    true,
            displayMsg:     this.labels.displayMsg,
            emptyMsg:       this.labels.emptyMsg
        });    
        this.store.load({
            params:{
                start: 0,
                limit: 20
            }
        });
        Ext.notificaciones.monitoreo.ListarEventosDespachados.superclass.initComponent.call(this);                
    }
});

Ext.notificaciones.monitoreo.UI_ContenedorIzquierdo = Ext.extend(Ext.Panel, {
    width: 320,    
    layout:"fit",  
    cls:'x-toolbar',
    minHeight: 600,
    initComponent: function() { 
        this.title = this.labels.pDispatchedEvents;
        this.listarEventosDespachados = new Ext.notificaciones.monitoreo.ListarEventosDespachados({
            labels: this.labels            
        });   
        this.listarEventosDespachados.getStore().on('load', function(){
            this.fireEvent('eventodespachadodeseleccionado');
        }, this);
        this.listarEventosDespachados.getSelectionModel().on('rowselect', function(sm, ri, r){
            this.fireEvent('eventodespachadoseleccionado', r.data.ideventodespachado);
        }, this);
        this.listarEventosDespachados.getSelectionModel().on('rowdeselect', function(sm, ri, r){
            this.fireEvent('eventodespachadodeseleccionado');
        }, this);
        this.items = [this.listarEventosDespachados];
        Ext.notificaciones.monitoreo.UI_ContenedorIzquierdo.superclass.initComponent.call(this);		
    },
    getGridListarEventos: function(){
        return this.listarEventosDespachados;
    }
});





