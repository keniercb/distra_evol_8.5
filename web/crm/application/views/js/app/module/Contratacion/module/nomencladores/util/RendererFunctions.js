Ext.define('Nomencladores.util.RendererFunctions', {
    setIcon: function (value, metaData) {
        metaData.innerCls = "icondistra-" + value;
        metaData.tdAttr = 'data-qtip="' + value + '"';
    }
});
