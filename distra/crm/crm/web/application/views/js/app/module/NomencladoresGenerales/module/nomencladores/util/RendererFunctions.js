Ext.define('Nomencladores.util.RendererFunctions', {
    setIcon: function (value, metaData) {
        metaData.innerCls = "icondistra-" + value;
        metaData.tdAttr = 'data-qtip="' + value + '"';
    },
    setPorciento: function (value, metaData) {
        return Ext.util.Format.number(value, '000,00/i')+'%';
    }
});
