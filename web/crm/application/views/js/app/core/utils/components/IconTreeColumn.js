Ext.define('Ext.ux.IconTreeColumn', {
    extend: 'Ext.tree.Column',
    alias: 'widget.icontreecolumn',

    innerCls: Ext.baseCSSPrefix + 'grid-cell-inner-icontreecolumn',

    initComponent: function () {
        var styleLeaf = document.createElement('style');

        styleLeaf.innerHTML = ".x-grid-cell-inner [class*='icondistra-']:before" +
        "{margin-right : 0px !important;}" +
        ".x-grid-cell-inner-icontreecolumn {padding: 3px 6px 0px 0px !important;}";

        document.body.appendChild(styleLeaf);

        this.cellTpl = [
            '<tpl for="lines">',
            '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
            '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"/>',
            '</tpl>',
            '<img src="{blankUrl}" class="{childCls} {elbowCls}-img {elbowCls}',
            '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>"/>',
            '<tpl if="checked !== null">',
            '<input type="button" role="checkbox" <tpl if="checked">aria-checked="true" </tpl>',
            'class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
            '</tpl>',
            '<span class="{childCls} {iconCls}" style="font-size:12px"/>',
            '<tpl if="href">',
            '<a href="{href}" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
            '<tpl else>',
            '<span class="{textCls} {childCls}">{value}</span>',
            '</tpl>'
        ];

        this.callParent();
    }
});
