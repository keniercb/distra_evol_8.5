/**
 * Fichero que contiene el objeto ColumnTree para mostrar las causas.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CausaefectoTreeColumn = ExtExtend.Class({
    $extend: Ext.tree.ColumnTree,
    rootVisible: false,
    autoScroll: true,
    //border: false,    
    useArrows: true, 
    frame: true,
    cls: 'x-toolbar',
    initComponent: function() {
        var _this = this;

        _this.title = _this.idioma.titleColumnTree;

        _this.columns = [
            {hidden: true, dataIndex: 'idcategoria'},
            {header: _this.idioma.textDenomCausa, width: 550, dataIndex: 'denominacion'}
        ];     

        _this.root = new Ext.tree.TreeNode({
            type: 'root'
        }); 
        
        _this.on('click', function(node, e) {
            var tbar = _this.instanceTbar; 
            tbar[1].enable();
            tbar[2].enable();
        });      

        Planificacion.Integracion.CausaefectoTreeColumn.superclass.initComponent.call(Ext.apply(_this, arguments));
    }
});
Ext.reg('Planificacion.Integracion.CausaefectoTreeColumn', Planificacion.Integracion.CausaefectoTreeColumn);

