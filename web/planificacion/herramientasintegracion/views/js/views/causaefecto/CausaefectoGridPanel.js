/**
 * Fichero que contiene el objeto GridPanel para mostrar las categorias.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CausaefectoGridPanel = ExtExtend.Class({
    $extend: Ext.grid.GridPanel,    
    //border: false,  
    frame: true,
    cls: 'x-toolbar',
    initComponent: function() {
        var _this = this; 
        
        _this.title = _this.idioma.titleGridPanel;
        
        var columnModel = new Ext.grid.ColumnModel([
            {hidden: true, dataIndex: 'idcategoria'},
            {hidden: true, dataIndex: 'idefecto'},
            {header: _this.idioma.textDenomCategoria, dataIndex: 'denominacion', width: 550, 
                renderer: function(val) {return '<span style="color:#1F94ED">' + val + '</span>';}}
        ]);
        
        var selectionModel = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners : {
                rowselect: function(sm, rowIndex, r) {
                    _this.instanceTbar[1].enable(); 
                    _this.instanceTbar[2].enable();
                },
                rowdeselect: function(sm, rowIndex, record) {
                    _this.instanceTbar[1].disable(); 
                    _this.instanceTbar[2].disable();
                }
            }
        });
        
        var recordCategoria = Ext.data.Record.create([
            {name: 'idcategoria'},
            {name: 'idefecto'},
            {name: 'denominacion'},
            {name: 'leaf'}
        ]);
        
        var storeCategoria = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo +'causaefecto/obtenerCategoria',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'total'
            }, recordCategoria)
        });       
        
        _this.store = storeCategoria;
        
        _this.colModel = columnModel;
        
        _this.selModel = selectionModel;  
        
        _this.bbar = new Ext.PagingToolbar({
            pageSize: 18,
            displayInfo: true,            
            store: _this.getStore()            
        });  
        
        _this.store.on('beforeload', function(cmp, options) {            
            Secodena.mostrarMascara('loadGridPanel', '', '');            
            cmp.baseParams = {                
                objeto: Ext.encode(_this.instanceTreePanel.objDatEfecto.get())
            };          
        });
        
        _this.store.on('load', function(cmp, records, options ) {
            Secodena.ocultarMascara('loadGridPanel');
        });
        
        Planificacion.Integracion.CausaefectoGridPanel.superclass.initComponent.call(Ext.apply(_this, arguments));
    }
});
Ext.reg('Planificacion.Integracion.CausaefectoGridPanel', Planificacion.Integracion.CausaefectoGridPanel);


