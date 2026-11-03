Ext.ns('Ext.reccomplejas');
Ext.reccomplejas.TabGestCampo = Ext.extend(Ext.Panel, {
    title: 'Gestionar campos',
    tabTip: 'Gestionar campos de la configuraci&oacute;n <b>(Alt+1)</b>',
    layout: 'border',
    initComponent: function() {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.tpMetadato = new Ext.reccomplejas.CmpMetadato({
            region: 'west',
            config: this.config,
            collapsible: true,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            parent: this,
            ddGroup: 'tree2tree',
            enableDrag: true,
            dragConfig:{}
        });

        this.tpSelectores = new Ext.reccomplejas.CmpSelectores({
            config: this.config,
            region: 'center',
            margins: '5 0 5 0',
            parent: this,
            ddGroup: 'tree2tree',
            enableDrop: true,
            ddAppendOnly:false,
            dropConfig: {
                allowContainerDrop:true,
                onNodeDrop:function(n, ddSource, e, data){
                    if (ddSource.dragData.node.isLeaf()){
                        var arr = new Array();
                        arr.push(ddSource.dragData.node);
                        self.tpSelectores.adicionarCampos(arr, n.node);
                        return true;
                    }
                },
                notifyOver: function(ddSource, e, data) {
                    nodoMetadato = ddSource.dragData.node;
                    if (nodoMetadato.isLeaf()){
                        return Ext.dd.DropTarget.prototype.dropAllowed;
                    }else{
                        return Ext.dd.DropTarget.prototype.dropNotAllowed;
                    }
                }
            }
        });

        this.pConfigField = new Ext.reccomplejas.CmpConfigField({
            config: this.config,
            width: 380,
            minSize: 200,
            maxSize: 500,
            collapsible: true,
            split: true,
            region: 'east',
            margins: '5 5 5 0',
            cmargins: '5 5 5 5'
        });

        this.tpSelectores.getSelectionModel().on('selectionchange', function(sm, node) {
            this.pConfigField.updateFieldConfig(node);
        }, this);
		
        this.pConfigField.on('fieldConfigSaved', function(node) {
            var nodoPadre = node.parentNode;
            this.tpSelectores.getLoader().load(nodoPadre);
            nodoPadre.expand(false, true);
            this.pConfigField.updateFieldConfig(null);
        }, this);
		
        this.items = [this.tpMetadato, this.tpSelectores, this.pConfigField];
		
        Ext.reccomplejas.TabGestCampo.superclass.initComponent.call(this);
    }
});