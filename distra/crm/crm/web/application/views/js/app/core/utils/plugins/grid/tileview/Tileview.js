/**
 * @class Ext.ux.grid.feature.Tileview
 * @extends Ext.grid.feature.Feature
 *
 * @author Harald Hanek (c) 2011-2012
 * adapted for Ext's 4.2.x version:  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 *
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('CRM.core.utils.plugins.grid.tileview.Tileview', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.tileview',
    metaTableTplOrig: null, // stores the original template
    viewMode: null,
    defaultviewMode: 'tiles',
    viewTpls: {},
    defaultViewTpl: {
        medium: [
            '<tpl if="view.tileViewFeature.viewMode==\'medium\'">',
            '{%',
                'console.log(values.view.tileViewFeature.viewMode, "medium");',
                'var dataRowCls = values.recordIndex === -1 ? "" : " ' + Ext.baseCSSPrefix + 'grid-data-row";',
                'var columnValues = values.view.tileViewFeature.getColumnValues(values.columns, values.record);',
            '%}',
            '<tr role="row" {[values.rowId ? ("id=\\"" + values.rowId + "\\"") : ""]} ',
                'data-boundView="{view.id}" ',
                'data-recordId="{record.internalId}" ',
                'data-recordIndex="{recordIndex}" ',
                'class="tileview {[values.itemClasses.join(" ")]} {[values.rowClasses.join(" ")]}{[dataRowCls]}" ',
                '{rowAttr:attributes} tabIndex="-1">',
                '<td role="gridcell" class="{tdCls} x-grid-tdx ux-explorerview-medium-icon-row" {tdAttr} id="{[Ext.id()]}">',
                    '<table class="x-grid-row-table">',
                        '<tbody>',
                            '<tr>',
                               //aki hay que poner un iconClas para el icono
                                '<td class="x-grid-col x-grid-cell ux-explorerview-icon" style="background: url(&quot;thumbnails/medium_4d8f3b2d98a60f8e0a00004b.jpg&quot;) no-repeat scroll 50% 100% transparent;">',
                                '</td>',
                            '</tr>',
                            '<tr>',
                                '<td class="x-grid-col x-grid-cell">',
                                    '<div {unselectableAttr} class="x-grid-cell-inner">{[columnValues.name]}</div>',
                                '</td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                '</td>',
            '</tr>',
            '<tpl else>',
            '{% console.log(values.view.tileViewFeature.viewMode, "NOT medium"); %}',
            '{%this.nextTpl.applyOut(values, out, parent);%}',
            '</tpl>',
            {
                priority: 0
            }
        ],

        tiles: [
            '<tpl if="view.tileViewFeature.viewMode==\'tiles\'">',
            '{%',
            'console.log(values.view.tileViewFeature.viewMode, "tiles");',
            'var dataRowCls = values.recordIndex === -1 ? "" : " ' + Ext.baseCSSPrefix + 'grid-data-row";',
            'var columnValues = values.view.tileViewFeature.getColumnValues(values.columns, values.record);',
            '%}',
            '<tr role="row" {[values.rowId ? ("id=\\"" + values.rowId + "\\"") : ""]} ',
                'data-boundView="{view.id}" ',
                'data-recordId="{record.internalId}" ',
                'data-recordIndex="{recordIndex}" ',
                'class="tileview {[values.itemClasses.join(" ")]} {[values.rowClasses.join(" ")]}{[dataRowCls]}" ',
                '{rowAttr:attributes} tabIndex="-1">',
                '<td role="gridcell" class="{tdCls} x-grid-td ux-explorerview-detailed-icon-row" {tdAttr} id="{[Ext.id()]}">',
                    '<table class="x-grid-row-table">',
                        '<tbody>',
                            '<tr>',
                                //aki hay que poner un iconClas para el icono
                                '<td class="x-grid-col x-grid-cell ux-explorerview-icon" style="background: url(&quot;thumbnails/medium_4d8f3b2d98a60f8e0a00004b.jpg&quot;) no-repeat scroll 50% 50% transparent;">',
                                '</td>',
                                '<td class="x-grid-col x-grid-cell">',
                                    '<div class="x-grid-cell-inner" unselectable="on">{[columnValues.name]}<br><span>{[columnValues.cuisine]}</span></div>',
                                '</td>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                '</td>',
            '</tr>',
            '<tpl else>',
            '{% console.log(values.view.tileViewFeature.viewMode, "NOT tiles"); %}',
            '{%this.nextTpl.applyOut(values, out, parent);%}',
            '</tpl>',
            {
                priority: 0
            }
        ]
    },

    init: function (grid) {
        this.createCss();

        var me = this,
            view = me.view;

        //grid.view.tableTpl.html = grid.view.tableTpl.html.replace(/ class=\"(.*?)\" border/, ' class="$1 tileview" border');
        grid.view.tableTpl.html = grid.view.tableTpl.html.replace(/\{\[view.renderColumnSizer\(out\)\]\}/, '');

        view.tileViewFeature = me;

        Ext.Object.each(this.viewTpls, function (key, rowTpl) {
            view.addRowTpl(new Ext.XTemplate(rowTpl));
        })


        me.callParent(arguments);
    },

    getColumnValues: function (columns, record) {
        var columnValues = {};
        Ext.each(columns, function (column) {
            var key = column.dataIndex,
                value = record.data[column.dataIndex];

            columnValues[key] = value;
        });
        return columnValues;
    },

    getRowBody: function (values, viewMode) {
        if (this.viewTpls[viewMode]) {
            return this.viewTpls[viewMode];
        }
    },

    setView: function (mode) {
        var me = this;

        if (me.viewMode != mode) {
            me.viewMode = mode;
            me.view.refresh();
        }
    },

    createCss: function () {
        var style = document.createElement('style');
        style.innerHTML = ".x-grid-table .tileview .x-grid-row-alt{background-color: transparent;} " +
        ".x-grid-table .tileview .x-grid-row-table {table-layout: fixed;} " +
        ".x-grid-table .x-grid-row.tileview {float: left;margin: 8px 0 0 8px;display: inline-block;} " +
        ".x-grid-table .tileview .x-grid-cell {border: none;background: transparent;} " +
        ".x-grid-table .tileview .x-grid-col {border: none;} " +
            /* MEDIUM VIEW */
        ".ux-explorerview-medium-icon-row {width: 114px;height: 125px;float: left;border: none;padding: 1px;} " +
        ".x-grid-table.thumbnails .x-grid-row-over .ux-explorerview-medium-icon-row {border: 1px solid #dddddd;padding: 0px;background: #efefef;} " +
        ".ux-explorerview-medium-icon-row .x-grid-row-table {width: 100%;} " +
        ".ux-explorerview-medium-icon-row .x-grid-row-table td {text-align: center;} " +
        ".ux-explorerview-medium-icon-row .x-grid-row-table td.ux-explorerview-icon {height: 100px;text-align: center;vertical-align: bottom;} " +
            /* TILE VIEW */
        ".ux-explorerview-detailed-icon-row {width: 200px;height: 56px;float: left;padding: 1px;border: 0px solid #FFF;}" +
        ".x-grid-table.thumbnails .x-grid-row-over .ux-explorerview-detailed-icon-row {border: 1px solid #dddddd;padding: 0px;background: #efefef;} " +
        ".ux-explorerview-detailed-icon-row .x-grid-row-table {width: 100%;} .ux-explorerview-detailed-icon-row .x-grid-row-table td{vertical-align: bottom;} " +
        ".ux-explorerview-detailed-icon-row .x-grid-row-table td.ux-explorerview-icon {width: 56px;height: 50px;text-align: center;vertical-align: middle;} " +
        ".ux-explorerview-detailed-icon-row .x-grid-row-table td span {color: #aaaaaa;}";
        document.body.appendChild(style);
    }
});