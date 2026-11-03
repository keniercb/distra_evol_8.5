Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpMetadatoRegUnico = Ext.extend(Ext.tree.TreePanel, {
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
                    tloader.baseParams.servidor = '10.12.170.102';
                    tloader.baseParams.puerto = '5432';
                    tloader.baseParams.usuario = 'zeolides';
                    tloader.baseParams.contrasena = '20024114340201298346 11550504209581049503 74725448906263473676';
                    tloader.baseParams.basedato = 'distra-ch';
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

        Pvd.Maestro.Configuraciones.CmpMetadatoRegUnico.superclass.initComponent.call(this);
    }
});
