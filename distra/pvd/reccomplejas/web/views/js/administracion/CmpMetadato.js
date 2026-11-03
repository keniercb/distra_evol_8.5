Ext.ns('Ext.reccomplejas');
Ext.reccomplejas.CmpMetadato = Ext.extend(Ext.tree.TreePanel, {
    title:'Metadato',
    width: 250,
    minSize: 175,
    maxSize: 400,
    split: true,
    autoScroll: true,
    containerScroll: true,
    animate: true,
    root: {
        text: 'Base de datos', 
        animate: false,
        expanded: true,
        iconCls: 'database'
    },
    initComponent: function() {
        var self = this;

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: '/reccomplejas/index.php/administracion/getMetadato',
            preloadChildren: false,
            baseParams: {
                type: ''
            },
            listeners: {
                beforeload: function(tloader, node, response) {
                    tloader.baseParams.servidor = self.config.get('servidor');
                    tloader.baseParams.puerto = self.config.get('puerto');
                    tloader.baseParams.usuario = self.config.get('usuario');
                    tloader.baseParams.contrasena = self.config.get('contrasena');
                    tloader.baseParams.basedato = self.config.get('basedato');
                    tloader.baseParams.type = node.attributes.type;
                    tloader.baseParams.text = node.attributes.text;

                    if (node.attributes.type == 'table') {
                        tloader.baseParams.schema = node.attributes.schema;
                    } else {
                        tloader.baseParams.schema = '';
                    }
                }
            }
        });

        Ext.reccomplejas.CmpMetadato.superclass.initComponent.call(this);
    }
});
