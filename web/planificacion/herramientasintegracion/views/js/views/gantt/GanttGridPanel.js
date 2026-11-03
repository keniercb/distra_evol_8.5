Planificacion.Integracion.GanttGridPanel = ExtExtend.Class({
    $extend: Ext.grid.GridPanel,
    region: 'center',    
    frame: true,
    stripeRows: true,
    autoExpandColumn: 'tarea',    
    cls: 'x-toolbar',
    initComponent: function() {
        var _this = this;
        
        _this.title = _this.etiquetas.titleListaTarea;
        
        var record = new Ext.data.Record.create([
            {name: 'idtareagantt'},
            {name: 'idestudiogantt'},
            {name: 'idpadre'},
            {name: 'denominacion'},
            {name: 'descripcion'},
            {name: 'duraciontarea'},
            {name: 'porcientocumplimiento'},
            {name: 'fechaini'},
            {name: 'fechafin'},
            {name: 'predecesora'},
            {name: 'idunidadtiempo'},
            {name: 'unidadtiempo'}
        ]);        

        _this.store = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + 'gantt/obtenerTarea',
            reader: new Ext.data.JsonReader({
                root: 'root',
                totalProperty: 'cantidad_filas'
            }, record)
        });
        
        _this.colModel = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),            
            {id: 'tarea', header: _this.etiquetas.headerTarea, dataIndex: 'denominacion', sortable: true},
            {header: _this.etiquetas.headerDuracion, width: 200, dataIndex: 'duraciontarea', sortable: true,
                renderer: function(val, md, record) {                    
                    return val + " " + record.get('unidadtiempo');
                }},
            {
                header: 'Porcentaje de cumplimiento',
                width: 150,
                align: 'center',
                dataIndex: 'porcientocumplimiento',
                sortable: true,
                renderer: function(val, md, record) {
                    return val + " %";
                }},
            {header: _this.etiquetas.headerFechaInicio, width: 200, dataIndex: 'fechaini', sortable: true},
            {header: _this.etiquetas.headerFechaFin, width: 200, dataIndex: 'fechafin', sortable: true},
            {header: _this.etiquetas.headerPredecesora, width: 450, dataIndex: 'predecesora', sortable: true,
                renderer: function(val, md, record) {
                    if (record.get('idtareagantt') === record.get('idpadre')) {
                        return '';
                    } else {
                        return val;
                    }
                }}
        ]);
        
        _this.selModel = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(selModel, rowIndex, record) {
                    var ganttComponent = _this.ownerCt;
                    ganttComponent.getTopToolbar().items.get(1).enable();
                    ganttComponent.getTopToolbar().items.get(2).enable();
                },
                rowdeselect: function(selModel, rowIndex, record) {
                    var ganttComponent = _this.ownerCt;
                    ganttComponent.getTopToolbar().items.get(1).disable();
                    ganttComponent.getTopToolbar().items.get(2).disable();
                }
            }
        }); 
        
        _this.store.on('beforeload', function() {
            Secodena.mostrarMascara('listarTarea', '', 'Cargando...');
        });
        
        _this.store.on('load', function() {
            Secodena.ocultarMascara('listarTarea');
        });
        
        Planificacion.Integracion.GanttGridPanel.superclass.initComponent.call(Ext.apply(_this, arguments));
    }
});
Ext.reg('Planificacion.Integracion.GanttGridPanel', Planificacion.Integracion.GanttGridPanel);