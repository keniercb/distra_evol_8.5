/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.</p>
 * <p><b>Note. As of ExtJS 3.3 this no longer has to be configured as a plugin of the GridPanel.</b></p>
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
var grid = Ext.create('Ext.grid.Panel', {
    ...
    columns: [{
           text: 'Foo',
           ...
        },{
           xtype: 'checkcolumn',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
        }
    ]
    ...
});
 * </code></pre>
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Conf.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    constructor: function() {

        var cssPrefix = Ext.baseCSSPrefix, cls = [cssPrefix + 'grid-checkheader-checked'];
        cls.push(cssPrefix + 'grid-checkheader');
        this.renderTpl =
            '<div id="{id}-titleContainer" class="' + Ext.baseCSSPrefix + 'column-header-inner">' +
            '<div id="{id}-checkboxContainer" class="' + cls.join(' ') + '">&#160;</div>'+
            '<span id="{id}-textEl" class="' + Ext.baseCSSPrefix + 'column-header-text">' +
            '{text}' +
            '</span>' +
            '<tpl if="!values.menuDisabled">'+
            '<div id="{id}-triggerEl" class="' + Ext.baseCSSPrefix + 'column-header-trigger"></div>'+
            '</tpl>' +
            '</div>';
        this.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    initComponent: function() {
        var me = this;
        if (me.flex) {
            me.minWidth = me.minWidth || Ext.grid.plugin.HeaderResizer.prototype.minColWidth;
        }
        else {
            me.minWidth = me.width;
        }
        if (!me.triStateSort) {
            me.possibleSortStates.length = 2;
        }
        me.isGroupHeader = false;
        me.sortable = false;
        me.resizable = false;
        me.hideable = false;
        me.align = 'center';
        me.menuDisabled = true;

        me.addChildEls('titleContainer', 'checkboxContainer');
        me.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = this.dataIndex,
                checked = !record.get(dataIndex);
                
            record.set(dataIndex, checked);
            this.fireEvent('checkchange', this, recordIndex, checked);
            // cancel selection.
            return false;
        }
        else {

            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    },
    onElClick: function(e, t) {
        if(t.id == this.checkboxContainer.id){
            this.onHeaderClick(this.ownerCt.view,e,t);
        }
        this.callParent(arguments);
    },
    afterRender: function(me,e){
        var store = this.ownerCt.view.store;
        me = this;
        if(store) {
            store.on('load', function (store, records,success,opt,e) {
                var flag = true;
                for (var i = 0; i < store.data.length && flag; i++) {
                    var record = store.getAt(i), dataIndex = me.dataIndex;
                    if (!record.get(dataIndex)) {
                        flag = false;
                    }
                }
                var cssPrefix = Ext.baseCSSPrefix;
                var check = me.checkboxContainer.dom;
                if (!flag) {
                    check.setAttribute('class', cssPrefix + 'grid-checkheader');
                }else{
                    check.setAttribute('class',cssPrefix + 'grid-checkheader ' + cssPrefix + 'grid-checkheader-checked');
                }
            });
        }
        this.callParent(arguments);
    },
    onHeaderClick: function(gridView, e, t) {
        var dq = Ext.DomQuery;
        var cssPrefix = Ext.baseCSSPrefix, cls = cssPrefix + 'grid-checkheader-checked';
        cls = dq.is(t,'div.'+cls);
        if(cls){
            t.setAttribute('class',cssPrefix + 'grid-checkheader');
            this.changeSelect(gridView.ownerCt,false);
        }else{
            t.setAttribute('class',cssPrefix + 'grid-checkheader ' + cssPrefix + 'grid-checkheader-checked');
            this.changeSelect(gridView.ownerCt,true);
        }
    },
    changeSelect:function(grid,checked){
        var store = grid.getStore();
        for(var i = 0;i < store.data.length;i++){
            var record = store.getAt(i), dataIndex = this.dataIndex;
            if(record.get(dataIndex) != checked){
                record.set(dataIndex, checked);
                this.fireEvent('checkchange', this, i, checked);
            }
        }
    }

});

