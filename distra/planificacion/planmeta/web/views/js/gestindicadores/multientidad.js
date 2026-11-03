/***	TreePanel	***/
trEnt = new Ext.tree.TreePanel({
    autoScroll: true,
    height: 200,
    layout: 'fit',
    border: false,
    listeners: {click: function(n) {
            if (n.id != 0) {
                gpGest.setVisible(true);
                trEnt.getSelectionModel().select(n);
                smGpGest.clearSelections();
                stGpGest.reload({params: {start: 0, limit: 20}});
            }
            else {
                gpGest.setVisible(false);
            }
        }},
    root: new Ext.tree.AsyncTreeNode({
        text: 'Entidades',
        tipo: 0,
        id: '0'
    }),
    loader: new Ext.tree.TreeLoader({
        dataUrl: 'cargarentidades'
    })
});
/***	Panel	***/
pMultiEnt = new Ext.Panel({
    title: 'Amed',
    id: 'pMultiEnt',
    region: 'west',
    listeners: {show: function(tp) {
            trEnt.getRootNode().expand();
        }},
    width: 200,
    hidden: true,
    split: true,
    layout: 'fit',
    items: trEnt
});