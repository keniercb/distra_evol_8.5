/*
 *  Aqui se han cambiado una cosas por: Jorge Luis Cuellar Mondeja
 **/
Ext.form.FileUploadField = Ext.extend(Ext.form.TextField, {
    /**
     * @cfg {String} buttonText The button text to display on the upload button (defaults to
     * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
     * value will be used instead if available.
     */
    buttonText: '',
    /**
     * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
     * text field (defaults to false).  If true, all inherited TextField members will still be available.
     */
    buttonOnly: false,
    /**
     * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
     * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
     */
    buttonOffset: 3,
    /**
     * @cfg {Object} buttonCfg A standard {@link Ext.Button} config object.
     */

    // private
    readOnly: true,
    /**
     * @hide
     * @method autoSize
     */
    autoSize: Ext.emptyFn,
    // private
    initComponent: function () {
        Ext.form.FileUploadField.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event fileselected
             * Fires when the underlying file input field's value has changed from the user
             * selecting a new file from the system file selection dialog.
             * @param {Ext.form.FileUploadField} this
             * @param {String} value The file value returned by the underlying file input field
             */
            'fileselected'
        );
    },
    // private
    onRender: function (ct, position) {
        Ext.form.FileUploadField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-file-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');

        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name || this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });

        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-text-icon' : '')
        }));

        if (this.buttonOnly) {
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
            this.el.setWidth(this.button.getEl().getWidth());
        }

        this.fileInput.on('change', function () {
            var v = this.fileInput.dom.value;
            this.setValue(v);
            this.fireEvent('fileselected', this, v);
        }, this);
    },
    // private
    getFileInputId: function () {
        return this.id + '-file';
    },
    // private
    onResize: function (w, h) {
        Ext.form.FileUploadField.superclass.onResize.call(this, w, h);

        this.wrap.setWidth(w);

        if (!this.buttonOnly) {
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },
    // private
    preFocus: Ext.emptyFn,
    // private
    getResizeEl: function () {
        return this.wrap;
    },
    // private
    getPositionEl: function () {
        return this.wrap;
    },
    // private
    alignErrorIcon: function () {
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    }

});
Ext.reg('fileupload', Ext.form.FileUploadField);

// vim: ts=4:sw=4:nu:fdc=4:nospell
/*global Ext */
/**
 * @class Ext.ux.grid.RowActions
 * @extends Ext.util.Observable
 *
 * RowActions plugin for Ext grid. Contains renderer for icons and fires events when an icon is clicked.
 * CSS rules from Ext.ux.RowActions.css are mandatory
 *
 * Important general information: Actions are identified by iconCls. Wherever an <i>action</i>
 * is referenced (event argument, callback argument), the iconCls of clicked icon is used.
 * In other words, action identifier === iconCls.
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      22. March 2008
 * @version   1.0
 * @revision  $Id: Ext.ux.grid.RowActions.js 747 2009-09-03 23:30:52Z jozo $
 *
 * @license Ext.ux.grid.RowActions is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * <p>License details: <a href="http://www.gnu.org/licenses/lgpl.html"
 * target="_blank">http://www.gnu.org/licenses/lgpl.html</a></p>
 *
 * @forum     29961
 * @demo      http://rowactions.extjs.eu
 * @download
 * <ul>
 * <li><a href="http://rowactions.extjs.eu/rowactions.tar.bz2">rowactions.tar.bz2</a></li>
 * <li><a href="http://rowactions.extjs.eu/rowactions.tar.gz">rowactions.tar.gz</a></li>
 * <li><a href="http://rowactions.extjs.eu/rowactions.zip">rowactions.zip</a></li>
 * </ul>
 *
 * @donate
 * <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
 * <input type="hidden" name="cmd" value="_s-xclick">
 * <input type="hidden" name="hosted_button_id" value="3430419">
 * <input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-butcc-donate.gif"
 * border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
 * <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
 * </form>
 */

Ext.ns('Ext.ux');
Ext.ns('Ext.ux.grid');

// add RegExp.escape if it has not been already added
if ('function' !== typeof RegExp.escape) {
    RegExp.escape = function (s) {
        if ('string' !== typeof s) {
            return s;
        }
        // Note: if pasting from forum, precede ]/\ with backslash manually
        return s.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
    }; // eo function escape
}

/**
 * Creates new RowActions plugin
 * @constructor
 * @param {Object} config A config object
 */
Ext.ux.grid.RowActions = function (config) {
    Ext.apply(this, config);

    // {{{
    this.addEvents(
        /**
         * @event beforeaction
         * Fires before action event. Return false to cancel the subsequent action event.
         * @param {Ext.grid.GridPanel} grid
         * @param {Ext.data.Record} record Record corresponding to row clicked
         * @param {String} action Identifies the action icon clicked. Equals to icon css class name.
         * @param {Integer} rowIndex Index of clicked grid row
         * @param {Integer} colIndex Index of clicked grid column that contains all action icons
         */
        'beforeaction'
        /**
         * @event action
         * Fires when icon is clicked
         * @param {Ext.grid.GridPanel} grid
         * @param {Ext.data.Record} record Record corresponding to row clicked
         * @param {String} action Identifies the action icon clicked. Equals to icon css class name.
         * @param {Integer} rowIndex Index of clicked grid row
         * @param {Integer} colIndex Index of clicked grid column that contains all action icons
         */
        , 'action'
        /**
         * @event beforegroupaction
         * Fires before group action event. Return false to cancel the subsequent groupaction event.
         * @param {Ext.grid.GridPanel} grid
         * @param {Array} records Array of records in this group
         * @param {String} action Identifies the action icon clicked. Equals to icon css class name.
         * @param {String} groupId Identifies the group clicked
         */
        , 'beforegroupaction'
        /**
         * @event groupaction
         * Fires when icon in a group header is clicked
         * @param {Ext.grid.GridPanel} grid
         * @param {Array} records Array of records in this group
         * @param {String} action Identifies the action icon clicked. Equals to icon css class name.
         * @param {String} groupId Identifies the group clicked
         */
        , 'groupaction'
    );
    // }}}

    // call parent
    Ext.ux.grid.RowActions.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.grid.RowActions, Ext.util.Observable, {
    // configuration options
    // {{{
    /**
     * @cfg {Array} actions Mandatory. Array of action configuration objects. The action
     * configuration object recognizes the following options:
     * <ul class="list">
     * <li style="list-style-position:outside">
     *   {Function} <b>callback</b> (optional). Function to call if the action icon is clicked.
     *   This function is called with same signature as action event and in its original scope.
     *   If you need to call it in different scope or with another signature use
     *   createCallback or createDelegate functions. Works for statically defined actions. Use
     *   callbacks configuration options for store bound actions.
     * </li>
     * <li style="list-style-position:outside">
     *   {Function} <b>cb</b> Shortcut for callback.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>iconIndex</b> Optional, however either iconIndex or iconCls must be
     *   configured. Field name of the field of the grid store record that contains
     *   css class of the icon to show. If configured, shown icons can vary depending
     *   of the value of this field.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>iconCls</b> CSS class of the icon to show. It is ignored if iconIndex is
     *   configured. Use this if you want static icons that are not base on the values in the record.
     * </li>
     * <li style="list-style-position:outside">
     *   {Boolean} <b>hide</b> Optional. True to hide this action while still have a space in
     *   the grid column allocated to it. IMO, it doesn't make too much sense, use hideIndex instead.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>hideIndex</b> Optional. Field name of the field of the grid store record that
     *   contains hide flag (falsie [null, '', 0, false, undefined] to show, anything else to hide).
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>qtipIndex</b> Optional. Field name of the field of the grid store record that
     *   contains tooltip text. If configured, the tooltip texts are taken from the store.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>tooltip</b> Optional. Tooltip text to use as icon tooltip. It is ignored if
     *   qtipIndex is configured. Use this if you want static tooltips that are not taken from the store.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>qtip</b> Synonym for tooltip
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>textIndex</b> Optional. Field name of the field of the grids store record
     *   that contains text to display on the right side of the icon. If configured, the text
     *   shown is taken from record.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>text</b> Optional. Text to display on the right side of the icon. Use this
     *   if you want static text that are not taken from record. Ignored if textIndex is set.
     * </li>
     * <li style="list-style-position:outside">
     *   {String} <b>style</b> Optional. Style to apply to action icon container.
     * </li>
     * </ul>
     */

    /**
     * @cfg {String} actionEvent Event to trigger actions, e.g. click, dblclick, mouseover (defaults to 'click')
     */
    actionEvent: 'click'
    /**
     * @cfg {Boolean} autoWidth true to calculate field width for iconic actions only (defaults to true).
     * If true, the width is calculated as {@link #widthSlope} * number of actions + {@link #widthIntercept}.
     */
    , autoWidth: true

    /**
     * @cfg {String} dataIndex - Do not touch!
     * @private
     */
    , dataIndex: ''

    /**
     * @cfg {Boolean} editable - Do not touch!
     * Must be false to prevent errors in editable grids
     */
    , editable: false

    /**
     * @cfg {Array} groupActions Array of action to use for group headers of grouping grids.
     * These actions support static icons, texts and tooltips same way as {@link #actions}. There is one
     * more action config option recognized:
     * <ul class="list">
     * <li style="list-style-position:outside">
     *   {String} <b>align</b> Set it to 'left' to place action icon next to the group header text.
     *   (defaults to undefined = icons are placed at the right side of the group header.
     * </li>
     * </ul>
     */

    /**
     * @cfg {Object} callbacks iconCls keyed object that contains callback functions. For example:
     * <pre>
     * callbacks:{
             * &nbsp;    'icon-open':function(...) {...}
             * &nbsp;   ,'icon-save':function(...) {...}
             * }
     * </pre>
     */

    /**
     * @cfg {String} header Actions column header
     */
    , header: ''

    /**
     * @cfg {Boolean} isColumn
     * Tell ColumnModel that we are column. Do not touch!
     * @private
     */
    , isColumn: true

    /**
     * @cfg {Boolean} keepSelection
     * Set it to true if you do not want action clicks to affect selected row(s) (defaults to false).
     * By default, when user clicks an action icon the clicked row is selected and the action events are fired.
     * If this option is true then the current selection is not affected, only the action events are fired.
     */
    , keepSelection: false

    /**
     * @cfg {Boolean} menuDisabled No sense to display header menu for this column
     * @private
     */
    , menuDisabled: true

    /**
     * @cfg {Boolean} sortable Usually it has no sense to sort by this column
     * @private
     */
    , sortable: false

    /**
     * @cfg {String} tplGroup Template for group actions
     * @private
     */
    , tplGroup: '<tpl for="actions">'
    + '<div class="ux-grow-action-item<tpl if="\'right\'===align"> ux-action-right</tpl> '
    + '{cls}" style="{style}" qtip="{qtip}">{text}</div>'
    + '</tpl>'

    /**
     * @cfg {String} tplRow Template for row actions
     * @private
     */
    , tplRow: '<div class="ux-row-action">'
    + '<tpl for="actions">'
    + '<div class="ux-row-action-item {cls} <tpl if="text">'
    + 'ux-row-action-text</tpl>" style="{hide}{style}" qtip="{qtip}">'
    + '<tpl if="text"><span qtip="{qtip}">{text}</span></tpl></div>'
    + '</tpl>'
    + '</div>'

    /**
     * @cfg {String} hideMode How to hide hidden icons. Valid values are: 'visibility' and 'display'
     * (defaluts to 'visibility'). If the mode is visibility the hidden icon is not visible but there
     * is still blank space occupied by the icon. In display mode, the visible icons are shifted taking
     * the space of the hidden icon.
     */
    , hideMode: 'visibility'

    /**
     * @cfg {Number} widthIntercept Constant used for auto-width calculation (defaults to 4).
     * See {@link #autoWidth} for explanation.
     */
    , widthIntercept: 4

    /**
     * @cfg {Number} widthSlope Constant used for auto-width calculation (defaults to 21).
     * See {@link #autoWidth} for explanation.
     */
    , widthSlope: 21
    // }}}

    // methods
    // {{{
    /**
     * Init function
     * @param {Ext.grid.GridPanel} grid Grid this plugin is in
     */
    , init: function (grid) {
        this.grid = grid;

        // the actions column must have an id for Ext 3.x
        this.id = this.id || Ext.id();

        // for Ext 3.x compatibility
        var lookup = grid.getColumnModel().lookup;
        delete(lookup[undefined]);
        lookup[this.id] = this;

        // {{{
        // setup template
        if (!this.tpl) {
            this.tpl = this.processActions(this.actions);

        } // eo template setup
        // }}}

        // calculate width
        if (this.autoWidth) {
            this.width = this.widthSlope * this.actions.length + this.widthIntercept;
            this.fixed = true;
        }

        // body click handler
        var view = grid.getView();
        var cfg = {scope: this};
        cfg[this.actionEvent] = this.onClick;
        grid.afterRender = grid.afterRender.createSequence(function () {
            view.mainBody.on(cfg);
            grid.on('destroy', this.purgeListeners, this);
        }, this);

        // setup renderer
        if (!this.renderer) {
            this.renderer = function (value, cell, record, row, col, store) {
                cell.css += (cell.css ? ' ' : '') + 'ux-row-action-cell';
                return this.tpl.apply(this.getData(value, cell, record, row, col, store));
            }.createDelegate(this);
        }

        // actions in grouping grids support
        if (view.groupTextTpl && this.groupActions) {
            view.interceptMouse = view.interceptMouse.createInterceptor(function (e) {
                if (e.getTarget('.ux-grow-action-item')) {
                    return false;
                }
            });
            view.groupTextTpl =
                '<div class="ux-grow-action-text">' + view.groupTextTpl + '</div>'
                + this.processActions(this.groupActions, this.tplGroup).apply()
            ;
        }

        // cancel click
        if (true === this.keepSelection) {
            grid.processEvent = grid.processEvent.createInterceptor(function (name, e) {
                if ('mousedown' === name) {
                    return !this.getAction(e);
                }
            }, this);
        }

    } // eo function init
    // }}}
    // {{{
    /**
     * Returns data to apply to template. Override this if needed.
     * @param {Mixed} value
     * @param {Object} cell object to set some attributes of the grid cell
     * @param {Ext.data.Record} record from which the data is extracted
     * @param {Number} row row index
     * @param {Number} col col index
     * @param {Ext.data.Store} store object from which the record is extracted
     * @return {Object} data to apply to template
     */
    , getData: function (value, cell, record, row, col, store) {
        return record.data || {};
    } // eo function getData
    // }}}
    // {{{
    /**
     * Processes actions configs and returns template.
     * @param {Array} actions
     * @param {String} template Optional. Template to use for one action item.
     * @return {String}
     * @private
     */
    , processActions: function (actions, template) {
        var acts = [];

        // actions loop
        Ext.each(actions, function (a, i) {
            // save callback
            if (a.iconCls && 'function' === typeof (a.callback || a.cb)) {
                this.callbacks = this.callbacks || {};
                this.callbacks[a.iconCls] = a.callback || a.cb;
            }

            // data for intermediate template
            var o = {
                cls: a.iconIndex ? '{' + a.iconIndex + '}' : (a.iconCls ? a.iconCls : '')
                , qtip: a.qtipIndex ? '{' + a.qtipIndex + '}' : (a.tooltip || a.qtip ? a.tooltip || a.qtip : '')
                , text: a.textIndex ? '{' + a.textIndex + '}' : (a.text ? a.text : '')
                , hide: a.hideIndex
                    ? '<tpl if="' + a.hideIndex + '">'
                + ('display' === this.hideMode ? 'display:none' : 'visibility:hidden') + ';</tpl>'
                    : (a.hide ? ('display' === this.hideMode ? 'display:none' : 'visibility:hidden;') : '')
                , align: a.align || 'right'
                , style: a.style ? a.style : ''
            };
            acts.push(o);

        }, this); // eo actions loop

        var xt = new Ext.XTemplate(template || this.tplRow);
        return new Ext.XTemplate(xt.apply({actions: acts}));

    } // eo function processActions
    // }}}
    , getAction: function (e) {
        var action = false;
        var t = e.getTarget('.ux-row-action-item');
        if (t) {
            action = t.className.replace(/ux-row-action-item /, '');
            if (action) {
                action = action.replace(/ ux-row-action-text/, '');
                action = action.trim();
            }
        }
        return action;
    } // eo function getAction
    // {{{
    /**
     * Grid body actionEvent event handler
     * @private
     */
    , onClick: function (e, target) {

        var view = this.grid.getView();

        // handle row action click
        var row = e.getTarget('.x-grid3-row');
        var col = view.findCellIndex(target.parentNode.parentNode);
        var action = this.getAction(e);

//		var t = e.getTarget('.ux-row-action-item');
//		if(t) {
//			action = this.getAction(t);
//			action = t.className.replace(/ux-row-action-item /, '');
//			if(action) {
//				action = action.replace(/ ux-row-action-text/, '');
//				action = action.trim();
//			}
//		}
        if (false !== row && false !== col && false !== action) {
            var record = this.grid.store.getAt(row.rowIndex);

            // call callback if any
            if (this.callbacks && 'function' === typeof this.callbacks[action]) {
                this.callbacks[action](this.grid, record, action, row.rowIndex, col);
            }

            // fire events
            if (true !== this.eventsSuspended && false === this.fireEvent('beforeaction', this.grid, record, action, row.rowIndex, col)) {
                return;
            }
            else if (true !== this.eventsSuspended) {
                this.fireEvent('action', this.grid, record, action, row.rowIndex, col);
            }

        }

        // handle group action click
        t = e.getTarget('.ux-grow-action-item');
        if (t) {
            // get groupId
            var group = view.findGroup(target);
            var groupId = group ? group.id.replace(/ext-gen[0-9]+-gp-/, '') : null;

            // get matching records
            var records;
            if (groupId) {
                var re = new RegExp(RegExp.escape(groupId));
                records = this.grid.store.queryBy(function (r) {
                    return r._groupId.match(re);
                });
                records = records ? records.items : [];
            }
            action = t.className.replace(/ux-grow-action-item (ux-action-right )*/, '');

            // call callback if any
            if ('function' === typeof this.callbacks[action]) {
                this.callbacks[action](this.grid, records, action, groupId);
            }

            // fire events
            if (true !== this.eventsSuspended && false === this.fireEvent('beforegroupaction', this.grid, records, action, groupId)) {
                return false;
            }
            this.fireEvent('groupaction', this.grid, records, action, groupId);
        }
    } // eo function onClick
    // }}}

});

// registre xtype
Ext.reg('rowactions', Ext.ux.grid.RowActions);

/**
 * @class Ext.ux.grid.RowEditor
 * @extends Ext.Panel
 * Plugin (ptype = 'roweditor') that adds the ability to rapidly edit full rows in a grid.
 * A validation mode may be enabled which uses AnchorTips to notify the user of all
 * validation errors at once.
 *
 * @ptype roweditor
 */
Ext.ux.grid.RowEditor = Ext.extend(Ext.Panel, {
    floating: true,
    shadow: false,
    layout: 'hbox',
    cls: 'x-small-editor',
    buttonAlign: 'center',
    baseCls: 'x-row-editor',
    elements: 'header,footer,body',
    frameWidth: 5,
    buttonPad: 3,
    clicksToEdit: 'auto',
    monitorValid: true,
    focusDelay: 250,
    errorSummary: true,
    saveText: LOG.util.Idioma.lbBtnAceptar,
    cancelText: LOG.util.Idioma.lbBtnCancelar,
    commitChangesText: LOG.util.Idioma.msgErroresCommit,
    errorText: LOG.util.Idioma.lbErrores,
    defaults: {
        normalWidth: true
    },
    initComponent: function () {
        Ext.ux.grid.RowEditor.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event beforeedit
             * Fired before the row editor is activated.
             * If the listener returns <tt>false</tt> the editor will not be activated.
             * @param {Ext.ux.grid.RowEditor} roweditor This object
             * @param {Number} rowIndex The rowIndex of the row just edited
             */
            'beforeedit',
            /**
             * @event canceledit
             * Fired when the editor is cancelled.
             * @param {Ext.ux.grid.RowEditor} roweditor This object
             * @param {Boolean} forced True if the cancel button is pressed, false is the editor was invalid.
             */
            'canceledit',
            /**
             * @event validateedit
             * Fired after a row is edited and passes validation.
             * If the listener returns <tt>false</tt> changes to the record will not be set.
             * @param {Ext.ux.grid.RowEditor} roweditor This object
             * @param {Object} changes Object with changes made to the record.
             * @param {Ext.data.Record} r The Record that was edited.
             * @param {Number} rowIndex The rowIndex of the row just edited
             */
            'validateedit',
            /**
             * @event afteredit
             * Fired after a row is edited and passes validation.  This event is fired
             * after the store's update event is fired with this edit.
             * @param {Ext.ux.grid.RowEditor} roweditor This object
             * @param {Object} changes Object with changes made to the record.
             * @param {Ext.data.Record} r The Record that was edited.
             * @param {Number} rowIndex The rowIndex of the row just edited
             */
            'afteredit'
        );
    },
    init: function (grid) {
        this.grid = grid;
        this.ownerCt = grid;
        if (this.clicksToEdit === 2) {
            grid.on('rowdblclick', this.onRowDblClick, this);
        } else {
            grid.on('rowclick', this.onRowClick, this);
            if (Ext.isIE) {
                grid.on('rowdblclick', this.onRowDblClick, this);
            }
        }

        // stopEditing without saving when a record is removed from Store.
        grid.getStore().on('remove', function () {
            this.stopEditing(false);
        }, this);

        grid.on({
            scope: this,
            keydown: this.onGridKey,
            columnresize: this.verifyLayout,
            columnmove: this.refreshFields,
            reconfigure: this.refreshFields,
            beforedestroy: this.beforedestroy,
            destroy: this.destroy,
            bodyscroll: {
                buffer: 250,
                fn: this.positionButtons
            }
        });
        grid.rowEditor = this;
        var _this = this;
        grid.getSelectionModel().on({
            'beforerowselect': function (e) {
                if (_this.editing)
                    return false;
            }
        });
        grid.getColumnModel().on('hiddenchange', this.verifyLayout, this, {delay: 1});
        grid.getView().on('refresh', this.stopEditing.createDelegate(this, []));
    },
    beforedestroy: function () {
        this.stopMonitoring();
        this.grid.getStore().un('remove', this.onStoreRemove, this);
        this.stopEditing(false);
        Ext.destroy(this.btns, this.tooltip);
    },
    refreshFields: function () {
        this.initFields();
        this.verifyLayout();
    },
    isDirty: function () {
        var dirty;
        this.items.each(function (f) {
            if (String(this.values[f.id]) !== String(f.getValue())) {
                dirty = true;
                return false;
            }
        }, this);
        return dirty;
    },
    startEditing: function (rowIndex, doFocus) {
        if (this.editing && this.isDirty()) {
            this.showTooltip(this.commitChangesText);
            return;
        }
        if (Ext.isObject(rowIndex)) {
            rowIndex = this.grid.getStore().indexOf(rowIndex);
        }
        if (this.fireEvent('beforeedit', this, rowIndex) !== false) {
            this.editing = true;
            var g = this.grid, view = g.getView(),
                row = view.getRow(rowIndex);
            record = g.store.getAt(rowIndex);

            this.record = record;
            this.rowIndex = rowIndex;
            this.values = {};
            if (!this.rendered) {
                this.render(view.getEditorParent());
            }
            var w = Ext.fly(row).getWidth();
            this.setSize(w);
            if (!this.initialized) {
                this.initFields();
            }
            var cm = g.getColumnModel(), fields = this.items.items, f, val;
            for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                val = this.preEditValue(record, cm.getDataIndex(i));
                f = fields[i];
                f.setValue(val);
                this.values[f.id] = Ext.isEmpty(val) ? '' : val;
                f.enable();
                Ext.each(this.disabledFields, function (c) {
                    if (c == f.column.dataIndex) {
                        f.disable();
                    }
                });
            }
            this.verifyLayout(true);
            if (!this.isVisible()) {
                this.setPagePosition(Ext.fly(row).getXY());
            } else {
                this.el.setXY(Ext.fly(row).getXY(), {duration: 0.15});
            }
            if (!this.isVisible()) {
                this.show().doLayout();
            }
            if (doFocus !== false) {
                this.doFocus.defer(this.focusDelay, this);
            }
        }
    },
    stopEditing: function (saveChanges) {
        this.editing = false;
        if (!this.isVisible()) {
            return;
        }
        if (saveChanges === false || !this.isValid()) {
            this.hide();
            this.fireEvent('canceledit', this, saveChanges === false);
            return;
        }
        var changes = {},
            r = this.record,
            hasChange = false,
            cm = this.grid.colModel,
            fields = this.items.items;
        for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
            if (!cm.isHidden(i)) {
                var dindex = cm.getDataIndex(i);
                if (!Ext.isEmpty(dindex)) {
                    var oldValue = r.data[dindex],
                        value = this.postEditValue(fields[i].getValue(), oldValue, r, dindex);
                    if (String(oldValue) !== String(value)) {
                        changes[dindex] = value;
                        hasChange = true;
                    }
                }
            }
        }
        if (hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false) {
            r.beginEdit();
            Ext.iterate(changes, function (name, value) {
                r.set(name, value);
            });
            r.endEdit();
            this.fireEvent('afteredit', this, changes, r, this.rowIndex);
        } else {
            this.fireEvent('canceledit', this, false);
        }
        this.hide();
    },
    verifyLayout: function (force) {
        if (this.el && (this.isVisible() || force === true)) {
            var row = this.grid.getView().getRow(this.rowIndex);
            this.setSize(Ext.fly(row).getWidth(), Ext.isIE ? Ext.fly(row).getHeight() + 9 : undefined);
            var cm = this.grid.colModel, fields = this.items.items;
            for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                if (!cm.isHidden(i)) {
                    var adjust = 0;
                    if (i === (len - 1)) {
                        adjust += 3; // outer padding
                    } else {
                        adjust += 1;
                    }
                    fields[i].show();
                    fields[i].setWidth(cm.getColumnWidth(i) - adjust);
                } else {
                    fields[i].hide();
                }
            }
            this.doLayout();
            this.positionButtons();
        }
    },
    slideHide: function () {
        this.hide();
    },
    initFields: function () {
        var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
        this.removeAll(false);
        for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
            var c = cm.getColumnAt(i),
                ed = c.dataIndex != '' ? c.getEditor() : false;
            if (!ed) {
                ed = c.displayEditor || new Ext.form.DisplayField();
            }
            if (i == 0) {
                ed.margins = pm('0 1 2 1');
            } else if (i == len - 1) {
                ed.margins = pm('0 0 2 1');
            } else {
                if (Ext.isIE) {
                    ed.margins = pm('0 0 2 0');
                }
                else {
                    ed.margins = pm('0 1 2 0');
                }
            }
            ed.setWidth(cm.getColumnWidth(i));
            ed.column = c;
            if (ed.ownerCt !== this) {
                ed.on('focus', this.ensureVisible, this);
                ed.on('specialkey', this.onKey, this);
            }
            this.insert(i, ed);
        }
        this.initialized = true;
    },
    onKey: function (f, e) {
        if (e.getKey() === e.ENTER) {
            this.stopEditing(true);
            e.stopPropagation();
        }
    },
    onGridKey: function (e) {
        if (e.getKey() === e.ENTER && !this.isVisible()) {
            var r = this.grid.getSelectionModel().getSelected();
            if (r) {
                var index = this.grid.store.indexOf(r);
                this.startEditing(index);
                e.stopPropagation();
            }
        }
    },
    ensureVisible: function (editor) {
        if (this.isVisible()) {
            this.grid.getView().ensureVisible(this.rowIndex, this.grid.colModel.getIndexById(editor.column.id), true);
        }
    },
    onRowClick: function (g, rowIndex, e) {
        if (this.clicksToEdit == 'auto') {
            var li = this.lastClickIndex;
            this.lastClickIndex = rowIndex;
            if (li != rowIndex && !this.isVisible()) {
                return;
            }
        }
        this.startEditing(rowIndex, false);
        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
    },
    onRowDblClick: function (g, rowIndex, e) {
        this.startEditing(rowIndex, false);
        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
    },
    onRender: function () {
        Ext.ux.grid.RowEditor.superclass.onRender.apply(this, arguments);
        this.el.swallowEvent(['keydown', 'keyup', 'keypress']);
        this.btns = new Ext.Panel({
            baseCls: 'x-plain',
            cls: 'x-btns',
            elements: 'body',
            layout: 'table',
            width: (this.minButtonWidth * 2) + (this.frameWidth * 2) + (this.buttonPad * 4), // width must be specified for IE
            items: [
//                {
//                    ref: 'saveBtn',
//                    itemId: 'saveBtn',
//                    xtype: 'button',
//                    text: this.saveText,
//                    width: this.minButtonWidth,
//                    handler: this.stopEditing.createDelegate(this, [true])
//                }, {
//                    xtype: 'button',
//                    text: this.cancelText,
//                    width: this.minButtonWidth,
//                    handler: this.stopEditing.createDelegate(this, [false])
//                },
                LOG.util.Prototipos.botonCancelar({
                    width: this.minButtonWidth,
                    handler: this.stopEditing.createDelegate(this, [false])
                }),
                LOG.util.Prototipos.botonAceptar({
                    ref: 'saveBtn',
                    itemId: 'saveBtn',
                    width: this.minButtonWidth,
                    handler: this.stopEditing.createDelegate(this, [true])
                })]
        });
        this.btns.render(this.bwrap);
    },
    afterRender: function () {
        Ext.ux.grid.RowEditor.superclass.afterRender.apply(this, arguments);
        this.positionButtons();
        if (this.monitorValid) {
            this.startMonitoring();
        }
    },
    onShow: function () {
        if (this.monitorValid) {
            this.startMonitoring();
        }
        Ext.ux.grid.RowEditor.superclass.onShow.apply(this, arguments);
    },
    onHide: function () {
        Ext.ux.grid.RowEditor.superclass.onHide.apply(this, arguments);
        this.stopMonitoring();
        this.grid.getView().focusRow(this.rowIndex);
    },
    positionButtons: function () {
        if (this.btns) {
            var g = this.grid,
                h = this.el.dom.clientHeight,
                view = g.getView(),
                scroll = view.scroller.dom.scrollLeft,
                bw = this.btns.getWidth(),
                width = Math.min(g.getWidth(), g.getColumnModel().getTotalWidth());

            this.btns.el.shift({left: (width / 2) - (bw / 2) + scroll, top: h - 2, stopFx: true, duration: 0.2});
        }
    },
    // private
    preEditValue: function (r, field) {
        var value = r.data[field];
        return this.autoEncode && typeof value === 'string' ? Ext.util.Format.htmlDecode(value) : value;
    },
    // private
    postEditValue: function (value, originalValue, r, field) {
        return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
    },
    doFocus: function (pt) {
        if (this.isVisible()) {
            var index = 0,
                cm = this.grid.getColumnModel(),
                c;
            if (pt) {
                index = this.getTargetColumnIndex(pt);
            }
            for (var i = index || 0, len = cm.getColumnCount(); i < len; i++) {
                c = cm.getColumnAt(i);
                if (!c.hidden && c.getEditor()) {
                    c.getEditor().focus();
                    break;
                }
            }
        }
    },
    getTargetColumnIndex: function (pt) {
        var grid = this.grid,
            v = grid.view,
            x = pt.left,
            cms = grid.colModel.config,
            i = 0,
            match = false;
        for (var len = cms.length, c; c = cms[i]; i++) {
            if (!c.hidden) {
                if (Ext.fly(v.getHeaderCell(i)).getRegion().right >= x) {
                    match = i;
                    break;
                }
            }
        }
        return match;
    },
    startMonitoring: function () {
        if (!this.bound && this.monitorValid) {
            this.bound = true;
            Ext.TaskMgr.start({
                run: this.bindHandler,
                interval: this.monitorPoll || 200,
                scope: this
            });
        }
    },
    stopMonitoring: function () {
        this.bound = false;
        if (this.tooltip) {
            this.tooltip.hide();
        }
    },
    isValid: function () {
        var valid = true;
        this.items.each(function (f) {
            if (!f.isValid(true)) {
                valid = false;
                return false;
            }
        });
        return valid;
    },
    // private
    bindHandler: function () {
        if (!this.bound) {
            return false; // stops binding
        }
        var valid = this.isValid();
//        if (!valid && this.errorSummary) {
//            this.showTooltip(this.getErrorText().join(''));
//        }
        this.btns.saveBtn.setDisabled(!valid);
        this.fireEvent('validation', this, valid);
    },
    lastVisibleColumn: function () {
        var i = this.items.getCount() - 1,
            c;
        for (; i >= 0; i--) {
            c = this.items.items[i];
            if (!c.hidden) {
                return c;
            }
        }
    },
    showTooltip: function (msg) {
        var t = this.tooltip;
        if (!t) {
            t = this.tooltip = new Ext.ToolTip({
                maxWidth: 600,
                cls: 'errorTip',
                width: 300,
                title: this.errorText,
                autoHide: false,
                anchor: 'left',
                anchorToTarget: true,
                mouseOffset: [40, 0]
            });
        }
        var v = this.grid.getView(),
            top = parseInt(this.el.dom.style.top, 10),
            scroll = v.scroller.dom.scrollTop,
            h = this.el.getHeight();

        if (top + h >= scroll) {
            t.initTarget(this.lastVisibleColumn().getEl());
            if (!t.rendered) {
                t.show();
                t.hide();
            }
            t.body.update(msg);
            t.doAutoWidth(20);
            t.show();
        } else if (t.rendered) {
            t.hide();
        }
    },
    getErrorText: function () {
        var data = ['<ul>'];
        this.items.each(function (f) {
            if (!f.isValid(true)) {
                data.push('<li>', f.getActiveError(), '</li>');
            }
        });
        data.push('</ul>');
        return data;
    }
});
Ext.reg('roweditor', Ext.ux.grid.RowEditor);

Ext.ux.ScriptManager = Ext.extend(Ext.util.Observable, {
    // The timeout in seconds to be used for requests
    timeout: 30,
    /**
     * @private
     * Array which will hold the scripts
     */
    scripts: [],
    // Whether to cache the javascript files or not
    disableCaching: false,
    /**
     * @constructor
     *
     * Component constructor
     */
    constructor: function (config) {
        Ext.apply(this, config);

        // Call our superclass constructor to complete construction process.
        Ext.ux.ScriptManager.superclass.constructor.call(this, config)
    },
    /**
     * Accepts the config for loading Javascript files
     * @param {Object} o Config options
     */
    loadJs: function (o) {
        if (!o) {
            return;
        }

        if (o.debug) {
            this.addAsScript(o);
            return;
        }

        if (!Ext.isArray(o.scripts)) {
            o.scripts = [o.scripts];
        }

        o.url = o.scripts.shift();

        if (o.scripts.length == 0) {
            this._loadUrl(o);
        } else {
            o.scope = this;
            this._loadUrl(o, function () {
                this.loadJs(o);
            });
        }
    },
    /**
     * Loads the css files dynamically
     *
     * @param {Object} o Config options -
     * {Array} scripts Array of css file paths |
     * {String} id Any existing css file with this id will be overwritten by the new file |
     * {Function} callback Function to be called once the files are loaded |
     * {Object} scope On this scope the callback function will be called
     *
     * @returns void
     */
    loadCss: function (o) {
        var id = o.id || '';
        var file;

        if (!Ext.isArray(o.scripts)) {
            o.scripts = [o.scripts];
        }

        for (var i = 0; i < o.scripts.length; i++) {
            file = o.scripts[i];
            id = '' + Math.floor(Math.random() * 100);
            Ext.util.CSS.createStyleSheet('', id);
            Ext.util.CSS.swapStyleSheet(id, file);
        }

        if (o.callback && /*Ext.isFunction(o.callback)*/ typeof o.callback == 'function') {
            o.callback.createDelegate(o.scope || window).call();
        }
    },
    /**
     * Adds the JS and CSS files as respective tags in DOM. This feature is used in debug:true option
     * @param {Object} o Config options
     * @returns void
     */
    addAsScript: function (o) {
        var count = 0;
        var script;
        var files = o.scripts;
        if (!Ext.isArray(files)) {
            files = [files];
        }

        var head = document.getElementsByTagName('head')[0];

        Ext.each(files, function (file) {
            script = document.createElement('script');
            script.type = 'text/javascript';
            if (/*Ext.isFunction(o.callback)*/typeof o.callback == 'function') {
                script.onload = script.onreadystatechange = function () {
                    count++;
                    if (count == files.length) {
                        o.callback.call();
                    }
                }
            }
            script.src = file;
            head.appendChild(script);
        });
    },
    /**
     * @private
     *
     * Sends the AJAX request for loading the Javascript file
     * @param {String} url Url of the file to be loaded or the
     * config object with array of urls ans other config options
     *
     * @param {Function} callback Callback function which
     * will be called once all the files are loaded
     *
     * @returns Null
     */
    _loadUrl: function (url, callback) {
        var cfg, callerScope;

        // If
        if (typeof url == 'object') { // must be config object
            cfg = url;
            url = cfg.url;
            callback = callback || cfg.callback;
            callerScope = cfg.scope;
            if (typeof cfg.timeout != 'undefined') {
                this.timeout = cfg.timeout;
            }
            if (typeof cfg.disableCaching != 'undefined') {
                this.disableCaching = cfg.disableCaching;
            }
        }

        // If the url exists in the scripts array, then call the callback function
        // This works as an recursive function call for multiple files
        if (this.scripts[url]) {
            if (callback && Ext.isFunction(callback)) {
                callback.createDelegate(callerScope || window).call();
            }
            return null;
        }

        // Ajax request for loading the file
        Ext.Ajax.request({
            url: url,
            success: this.processSuccess,
            failure: this.processFailure,
            scope: this,
            timeout: (this.timeout * 1000),
            disableCaching: this.disableCaching,
            argument: {
                'url': url,
                'scope': callerScope || window,
                'callback': callback,
                'options': cfg
            }
        });

        return null;

    },
    /**
     * @private
     * Function will be called if Ajax loading of scripts are successfull
     * @param {Object} response Ajax response object which will contain the script file content
     * @returns void
     */
    processSuccess: function (response) {
        this.scripts[response.argument.url] = true;
        window.execScript ? window.execScript(response.responseText) : window
            .eval(response.responseText);
        if (response.argument.options.scripts.length == 0) {
        }
        if (typeof response.argument.callback == 'function') {
            response.argument.callback.call(response.argument.scope);
        }
    },
    /**
     * @private
     * Function will be called if Ajax loading of scripts fails. It shows an error alert
     * @param {Object} response Ajax response object which will contain the script file content
     * @returns void
     */
    processFailure: function (response) {
        Ext.MessageBox.show({
            title: 'Application Error',
            msg: 'Script library could not be loaded.',
            closable: false,
            icon: Ext.MessageBox.ERROR,
            minWidth: 200,
            buttons: Ext.Msg.OK
        });
        setTimeout(function () {
            Ext.MessageBox.hide();
        }, 2000);
    }
});

/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.grid');

Ext.ux.grid.ColumnHeaderGroup = Ext.extend(Ext.util.Observable, {
    constructor: function (config) {
        this.config = config;
    },
    init: function (grid) {
        Ext.applyIf(grid.colModel, this.config);
        Ext.apply(grid.getView(), this.viewConfig);
    },
    viewConfig: {
        initTemplates: function () {
            this.constructor.prototype.initTemplates.apply(this, arguments);
            var ts = this.templates || {};
            if (!ts.gcell) {
                ts.gcell = new Ext.XTemplate('<td class="x-grid3-hd x-grid3-gcell x-grid3-td-{id} ux-grid-hd-group-row-{row} {cls}" style="{style}">', '<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '', '{value}</div></td>');
            }
            this.templates = ts;
            this.hrowRe = new RegExp("ux-grid-hd-group-row-(\\d+)", "");
        },
        renderHeaders: function () {
            var ts = this.templates, headers = [], cm = this.cm, rows = cm.rows, tstyle = 'width:' + this.getTotalWidth() + ';';

            for (var row = 0, rlen = rows.length; row < rlen; row++) {
                var r = rows[row], cells = [];
                for (var i = 0, gcol = 0, len = r.length; i < len; i++) {
                    var group = r[i];
                    group.colspan = group.colspan || 1;
                    var id = this.getColumnId(group.dataIndex ? cm.findColumnIndex(group.dataIndex) : gcol), gs = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupStyle.call(this, group, gcol);
                    cells[i] = ts.gcell.apply({
                        cls: 'ux-grid-hd-group-cell',
                        id: id,
                        row: row,
                        style: 'width:' + gs.width + ';' + (gs.hidden ? 'display:none;' : '') + (group.align ? 'text-align:' + group.align + ';' : ''),
                        tooltip: group.tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + group.tooltip + '"' : '',
                        istyle: group.align == 'right' ? 'padding-right:16px' : '',
                        btn: this.grid.enableHdMenu && group.header,
                        value: group.header || '&nbsp;'
                    });
                    gcol += group.colspan;
                }
                headers[row] = ts.header.apply({
                    tstyle: tstyle,
                    cells: cells.join('')
                });
            }
            headers.push(this.constructor.prototype.renderHeaders.apply(this, arguments));
            return headers.join('');
        },
        onColumnWidthUpdated: function () {
            this.constructor.prototype.onColumnWidthUpdated.apply(this, arguments);
            Ext.ux.grid.ColumnHeaderGroup.prototype.updateGroupStyles.call(this);
        },
        onAllColumnWidthsUpdated: function () {
            this.constructor.prototype.onAllColumnWidthsUpdated.apply(this, arguments);
            Ext.ux.grid.ColumnHeaderGroup.prototype.updateGroupStyles.call(this);
        },
        onColumnHiddenUpdated: function () {
            this.constructor.prototype.onColumnHiddenUpdated.apply(this, arguments);
            Ext.ux.grid.ColumnHeaderGroup.prototype.updateGroupStyles.call(this);
        },
        getHeaderCell: function (index) {
            return this.mainHd.query(this.cellSelector)[index];
        },
        findHeaderCell: function (el) {
            return el ? this.fly(el).findParent('td.x-grid3-hd', this.cellSelectorDepth) : false;
        },
        findHeaderIndex: function (el) {
            var cell = this.findHeaderCell(el);
            return cell ? this.getCellIndex(cell) : false;
        },
        updateSortIcon: function (col, dir) {
            var sc = this.sortClasses, hds = this.mainHd.select(this.cellSelector).removeClass(sc);
            hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
        },
        handleHdDown: function (e, t) {
            var el = Ext.get(t);
            if (el.hasClass('x-grid3-hd-btn')) {
                e.stopEvent();
                var hd = this.findHeaderCell(t);
                Ext.fly(hd).addClass('x-grid3-hd-menu-open');
                var index = this.getCellIndex(hd);
                this.hdCtxIndex = index;
                var ms = this.hmenu.items, cm = this.cm;
                ms.get('asc').setDisabled(!cm.isSortable(index));
                ms.get('desc').setDisabled(!cm.isSortable(index));
                this.hmenu.on('hide', function () {
                    Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
                }, this, {
                    single: true
                });
                this.hmenu.show(t, 'tl-bl?');
            } else if (el.hasClass('ux-grid-hd-group-cell') || Ext.fly(t).up('.ux-grid-hd-group-cell')) {
                e.stopEvent();
            }
        },
        handleHdMove: function (e, t) {
            var hd = this.findHeaderCell(this.activeHdRef);
            if (hd && !this.headersDisabled && !Ext.fly(hd).hasClass('ux-grid-hd-group-cell')) {
                var hw = this.splitHandleWidth || 5, r = this.activeHdRegion, x = e.getPageX(), ss = hd.style, cur = '';
                if (this.grid.enableColumnResize !== false) {
                    if (x - r.left <= hw && this.cm.isResizable(this.activeHdIndex - 1)) {
                        cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'e-resize' : 'col-resize'; // col-resize
                        // not
                        // always
                        // supported
                    } else if (r.right - x <= (!this.activeHdBtn ? hw : 2) && this.cm.isResizable(this.activeHdIndex)) {
                        cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'w-resize' : 'col-resize';
                    }
                }
                ss.cursor = cur;
            }
        },
        handleHdOver: function (e, t) {
            var hd = this.findHeaderCell(t);
            if (hd && !this.headersDisabled) {
                this.activeHdRef = t;
                this.activeHdIndex = this.getCellIndex(hd);
                var fly = this.fly(hd);
                this.activeHdRegion = fly.getRegion();
                if (!(this.cm.isMenuDisabled(this.activeHdIndex) || fly.hasClass('ux-grid-hd-group-cell'))) {
                    fly.addClass('x-grid3-hd-over');
                    this.activeHdBtn = fly.child('.x-grid3-hd-btn');
                    if (this.activeHdBtn) {
                        this.activeHdBtn.dom.style.height = (hd.firstChild.offsetHeight - 1) + 'px';
                    }
                }
            }
        },
        handleHdOut: function (e, t) {
            var hd = this.findHeaderCell(t);
            if (hd && (!Ext.isIE || !e.within(hd, true))) {
                this.activeHdRef = null;
                this.fly(hd).removeClass('x-grid3-hd-over');
                hd.style.cursor = '';
            }
        },
        handleHdMenuClick: function (item) {
            var index = this.hdCtxIndex, cm = this.cm, ds = this.ds, id = item.getItemId();
            switch (id) {
                case 'asc':
                    ds.sort(cm.getDataIndex(index), 'ASC');
                    break;
                case 'desc':
                    ds.sort(cm.getDataIndex(index), 'DESC');
                    break;
                default:
                    if (id.substr(0, 6) == 'group-') {
                        var i = id.split('-'), row = parseInt(i[1], 10), col = parseInt(i[2], 10), r = this.cm.rows[row], group, gcol = 0;
                        for (var i = 0, len = r.length; i < len; i++) {
                            group = r[i];
                            if (col >= gcol && col < gcol + group.colspan) {
                                break;
                            }
                            gcol += group.colspan;
                        }
                        if (item.checked) {
                            var max = cm.getColumnsBy(this.isHideableColumn, this).length;
                            for (var i = gcol, len = gcol + group.colspan; i < len; i++) {
                                if (!cm.isHidden(i)) {
                                    max--;
                                }
                            }
                            if (max < 1) {
                                this.onDenyColumnHide();
                                return false;
                            }
                        }
                        for (var i = gcol, len = gcol + group.colspan; i < len; i++) {
                            if (cm.config[i].fixed !== true && cm.config[i].hideable !== false) {
                                cm.setHidden(i, item.checked);
                            }
                        }
                    } else if (id.substr(0, 4) == 'col-') {
                        index = cm.getIndexById(id.substr(4));
                        if (index != -1) {
                            if (item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1) {
                                this.onDenyColumnHide();
                                return false;
                            }
                            cm.setHidden(index, item.checked);
                        }
                    }
                    if (id.substr(0, 6) == 'group-' || id.substr(0, 4) == 'col-') {
                        item.checked = !item.checked;
                        if (item.menu) {
                            var updateChildren = function (menu) {
                                menu.items.each(function (childItem) {
                                    if (!childItem.disabled) {
                                        childItem.setChecked(item.checked, false);
                                        if (childItem.menu) {
                                            updateChildren(childItem.menu);
                                        }
                                    }
                                });
                            }
                            updateChildren(item.menu);
                        }
                        var parentMenu = item, parentItem;
                        while (parentMenu = parentMenu.parentMenu) {
                            if (!parentMenu.parentMenu || !(parentItem = parentMenu.parentMenu.items.get(parentMenu.getItemId())) || !parentItem.setChecked) {
                                break;
                            }
                            var checked = parentMenu.items.findIndexBy(function (m) {
                                    return m.checked;
                                }) >= 0;
                            parentItem.setChecked(checked, true);
                        }
                        item.checked = !item.checked;
                    }
            }
            return true;
        },
        beforeColMenuShow: function () {
            var cm = this.cm, rows = this.cm.rows;
            this.colMenu.removeAll();
            for (var col = 0, clen = cm.getColumnCount(); col < clen; col++) {
                var menu = this.colMenu, title = cm.getColumnHeader(col), text = [];
                if (cm.config[col].fixed !== true && cm.config[col].hideable !== false) {
                    for (var row = 0, rlen = rows.length; row < rlen; row++) {
                        var r = rows[row], group, gcol = 0;
                        for (var i = 0, len = r.length; i < len; i++) {
                            group = r[i];
                            if (col >= gcol && col < gcol + group.colspan) {
                                break;
                            }
                            gcol += group.colspan;
                        }
                        if (group && group.header) {
                            if (cm.hierarchicalColMenu) {
                                var gid = 'group-' + row + '-' + gcol,
                                    item = menu.items ? menu.getComponent(gid) : null,
                                    submenu = item ? item.menu : null;
                                if (!submenu) {
                                    submenu = new Ext.menu.Menu({
                                        itemId: gid
                                    });
                                    submenu.on("itemclick", this.handleHdMenuClick, this);
                                    var checked = false, disabled = true;
                                    for (var c = gcol, lc = gcol + group.colspan; c < lc; c++) {
                                        if (!cm.isHidden(c)) {
                                            checked = true;
                                        }
                                        if (cm.config[c].hideable !== false) {
                                            disabled = false;
                                        }
                                    }
                                    menu.add({
                                        itemId: gid,
                                        text: group.header,
                                        menu: submenu,
                                        hideOnClick: false,
                                        checked: checked,
                                        disabled: disabled
                                    });
                                }
                                menu = submenu;
                            } else {
                                text.push(group.header);
                            }
                        }
                    }
                    text.push(title);
                    menu.add(new Ext.menu.CheckItem({
                        itemId: "col-" + cm.getColumnId(col),
                        text: text.join(' '),
                        checked: !cm.isHidden(col),
                        hideOnClick: false,
                        disabled: cm.config[col].hideable === false
                    }));
                }
            }
        },
        afterRenderUI: function () {
            this.constructor.prototype.afterRenderUI.apply(this, arguments);
            Ext.apply(this.columnDrop, Ext.ux.grid.ColumnHeaderGroup.prototype.columnDropConfig);
            Ext.apply(this.splitZone, Ext.ux.grid.ColumnHeaderGroup.prototype.splitZoneConfig);
        }
    },
    splitZoneConfig: {
        allowHeaderDrag: function (e) {
            return !e.getTarget(null, null, true).hasClass('ux-grid-hd-group-cell');
        }
    },
    columnDropConfig: {
        getTargetFromEvent: function (e) {
            var t = Ext.lib.Event.getTarget(e);
            return this.view.findHeaderCell(t);
        },
        positionIndicator: function (h, n, e) {
            var data = Ext.ux.grid.ColumnHeaderGroup.prototype.getDragDropData.call(this, h, n, e);
            if (data === false) {
                return false;
            }
            var px = data.px + this.proxyOffsets[0];
            this.proxyTop.setLeftTop(px, data.r.top + this.proxyOffsets[1]);
            this.proxyTop.show();
            this.proxyBottom.setLeftTop(px, data.r.bottom);
            this.proxyBottom.show();
            return data.pt;
        },
        onNodeDrop: function (n, dd, e, data) {
            var h = data.header;
            if (h != n) {
                var d = Ext.ux.grid.ColumnHeaderGroup.prototype.getDragDropData.call(this, h, n, e);
                if (d === false) {
                    return false;
                }
                var cm = this.grid.colModel, right = d.oldIndex < d.newIndex, rows = cm.rows;
                for (var row = d.row, rlen = rows.length; row < rlen; row++) {
                    var r = rows[row], len = r.length, fromIx = 0, span = 1, toIx = len;
                    for (var i = 0, gcol = 0; i < len; i++) {
                        var group = r[i];
                        if (d.oldIndex >= gcol && d.oldIndex < gcol + group.colspan) {
                            fromIx = i;
                        }
                        if (d.oldIndex + d.colspan - 1 >= gcol && d.oldIndex + d.colspan - 1 < gcol + group.colspan) {
                            span = i - fromIx + 1;
                        }
                        if (d.newIndex >= gcol && d.newIndex < gcol + group.colspan) {
                            toIx = i;
                        }
                        gcol += group.colspan;
                    }
                    var groups = r.splice(fromIx, span);
                    rows[row] = r.splice(0, toIx - (right ? span : 0)).concat(groups).concat(r);
                }
                for (var c = 0; c < d.colspan; c++) {
                    var oldIx = d.oldIndex + (right ? 0 : c), newIx = d.newIndex + (right ? -1 : c);
                    cm.moveColumn(oldIx, newIx);
                    this.grid.fireEvent("columnmove", oldIx, newIx);
                }
                return true;
            }
            return false;
        }
    },
    getGroupStyle: function (group, gcol) {
        var width = 0, hidden = true;
        for (var i = gcol, len = gcol + group.colspan; i < len; i++) {
            if (!this.cm.isHidden(i)) {
                var cw = this.cm.getColumnWidth(i);
                if (typeof cw == 'number') {
                    width += cw;
                }
                hidden = false;
            }
        }
        return {
            width: (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? width : Math.max(width - this.borderWidth, 0)) + 'px',
            hidden: hidden
        };
    },
    updateGroupStyles: function (col) {
        var tables = this.mainHd.query('.x-grid3-header-offset > table'), tw = this.getTotalWidth(), rows = this.cm.rows;
        for (var row = 0; row < tables.length; row++) {
            tables[row].style.width = tw;
            if (row < rows.length) {
                var cells = tables[row].firstChild.firstChild.childNodes;
                for (var i = 0, gcol = 0; i < cells.length; i++) {
                    var group = rows[row][i];
                    if ((typeof col != 'number') || (col >= gcol && col < gcol + group.colspan)) {
                        var gs = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupStyle.call(this, group, gcol);
                        cells[i].style.width = gs.width;
                        cells[i].style.display = gs.hidden ? 'none' : '';
                    }
                    gcol += group.colspan;
                }
            }
        }
    },
    getGroupRowIndex: function (el) {
        if (el) {
            var m = el.className.match(this.hrowRe);
            if (m && m[1]) {
                return parseInt(m[1], 10);
            }
        }
        return this.cm.rows.length;
    },
    getGroupSpan: function (row, col) {
        if (row < 0) {
            return {
                col: 0,
                colspan: this.cm.getColumnCount()
            };
        }
        var r = this.cm.rows[row];
        if (r) {
            for (var i = 0, gcol = 0, len = r.length; i < len; i++) {
                var group = r[i];
                if (col >= gcol && col < gcol + group.colspan) {
                    return {
                        col: gcol,
                        colspan: group.colspan
                    };
                }
                gcol += group.colspan;
            }
            return {
                col: gcol,
                colspan: 0
            };
        }
        return {
            col: col,
            colspan: 1
        };
    },
    getDragDropData: function (h, n, e) {
        if (h.parentNode != n.parentNode) {
            return false;
        }
        var cm = this.grid.colModel, x = Ext.lib.Event.getPageX(e), r = Ext.lib.Dom.getRegion(n.firstChild), px, pt;
        if ((r.right - x) <= (r.right - r.left) / 2) {
            px = r.right + this.view.borderWidth;
            pt = "after";
        } else {
            px = r.left;
            pt = "before";
        }
        var oldIndex = this.view.getCellIndex(h), newIndex = this.view.getCellIndex(n);
        if (cm.isFixed(newIndex)) {
            return false;
        }
        var row = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupRowIndex.call(this.view, h),
            oldGroup = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row, oldIndex),
            newGroup = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row, newIndex),
            oldIndex = oldGroup.col;
        newIndex = newGroup.col + (pt == "after" ? newGroup.colspan : 0);
        if (newIndex >= oldGroup.col && newIndex <= oldGroup.col + oldGroup.colspan) {
            return false;
        }
        var parentGroup = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row - 1, oldIndex);
        if (newIndex < parentGroup.col || newIndex > parentGroup.col + parentGroup.colspan) {
            return false;
        }
        return {
            r: r,
            px: px,
            pt: pt,
            row: row,
            oldIndex: oldIndex,
            newIndex: newIndex,
            colspan: oldGroup.colspan
        };
    }
});
/*
 * Permite tener una fila expandible
 * @type @exp;Ext@call;extend
 */
Ext.ux.grid.RowExpander = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Boolean} expandOnEnter
     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
     * key is pressed (defaults to <tt>true</tt>).
     */
    expandOnEnter: true,
    /**
     * @cfg {Boolean} expandOnDblClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnDblClick: true,
    header: '',
    width: 20,
    sortable: false,
    fixed: true,
    hideable: false,
    menuDisabled: true,
    dataIndex: '',
    id: 'expander',
    lazyRender: true,
    enableCaching: true,
    constructor: function (config) {
        Ext.apply(this, config);

        this.addEvents({
            /**
             * @event beforeexpand
             * Fires before the row expands. Have the listener return false to prevent the row from expanding.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            beforeexpand: true,
            /**
             * @event expand
             * Fires after the row expands.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            expand: true,
            /**
             * @event beforecollapse
             * Fires before the row collapses. Have the listener return false to prevent the row from collapsing.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            beforecollapse: true,
            /**
             * @event collapse
             * Fires after the row collapses.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            collapse: true
        });

        Ext.ux.grid.RowExpander.superclass.constructor.call(this);

        if (this.tpl) {
            if (typeof this.tpl == 'string') {
                this.tpl = new Ext.Template(this.tpl);
            }
            this.tpl.compile();
        }

        this.state = {};
        this.bodyContent = {};
    },
    getRowClass: function (record, rowIndex, p, ds) {
        p.cols = p.cols - 1;
        var content = this.bodyContent[record.id];
        if (!content && !this.lazyRender) {
            content = this.getBodyContent(record, rowIndex);
        }
        if (content) {
            p.body = content;
        }
        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
    },
    init: function (grid) {
        this.grid = grid;

        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);

        view.enableRowBody = true;


        grid.on('render', this.onRender, this);
        grid.on('destroy', this.onDestroy, this);
    },
    // @private
    onRender: function () {
        var grid = this.grid;
        var mainBody = grid.getView().mainBody;
        mainBody.on('mousedown', this.onMouseDown, this, {delegate: '.x-grid3-row-expander'});
        if (this.expandOnEnter) {
            this.keyNav = new Ext.KeyNav(this.grid.getGridEl(), {
                'enter': this.onEnter,
                scope: this
            });
        }
        if (this.expandOnDblClick) {
            grid.on('rowdblclick', this.onRowDblClick, this);
        }
    },
    // @private    
    onDestroy: function () {
        if (this.keyNav) {
            this.keyNav.disable();
            delete this.keyNav;
        }
        /*
         * A majority of the time, the plugin will be destroyed along with the grid,
         * which means the mainBody won't be available. On the off chance that the plugin
         * isn't destroyed with the grid, take care of removing the listener.
         */
        var mainBody = this.grid.getView().mainBody;
        if (mainBody) {
            mainBody.un('mousedown', this.onMouseDown, this);
        }
    },
    // @private
    onRowDblClick: function (grid, rowIdx, e) {
        this.toggleRow(rowIdx);
    },
    onEnter: function (e) {
        var g = this.grid;
        var sm = g.getSelectionModel();
        var sels = sm.getSelections();
        for (var i = 0, len = sels.length; i < len; i++) {
            var rowIdx = g.getStore().indexOf(sels[i]);
            this.toggleRow(rowIdx);
        }
    },
    getBodyContent: function (record, index) {
        if (!this.enableCaching) {
            return this.tpl.apply(record.data);
        }
        var content = this.bodyContent[record.id];
        if (!content) {
            content = this.tpl.apply(record.data);
            this.bodyContent[record.id] = content;
        }
        return content;
    },
    onMouseDown: function (e, t) {
        e.stopEvent();
        var row = e.getTarget('.x-grid3-row');
        this.toggleRow(row);
    },
    renderer: function (v, p, record) {
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>';
    },
    beforeExpand: function (record, body, rowIndex) {
        if (this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false) {
            if (this.tpl && this.lazyRender) {
                body.innerHTML = this.getBodyContent(record, rowIndex);
            }
            return true;
        } else {
            return false;
        }
    },
    toggleRow: function (row) {
        if (typeof row == 'number') {
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },
    expandRow: function (row) {
        if (typeof row == 'number') {
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if (this.beforeExpand(record, body, row.rowIndex)) {
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
    },
    collapseRow: function (row) {
        if (typeof row == 'number') {
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if (this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false) {
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex);
        }
    }
});

Ext.reg('rowexpander', Ext.ux.grid.RowExpander);

//backwards compat
Ext.grid.RowExpander = Ext.ux.grid.RowExpander;

// vim: ts=4:sw=4:nu:fdc=4:nospell
/*global Ext */
/**
 * @class Ext.form.LovCombo
 * @extends Ext.form.ComboBox
 *
 * Simple list of values Combo
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @version   1.3
 * @date      <ul>
 * <li>16. April 2008</li>
 * <li>2. February 2009</li>
 * </ul>
 * @revision  $Id: Ext.form.LovCombo.js 733 2009-06-26 07:29:07Z jozo $
 *
 * @license Ext.form.LovCombo.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * <p>License details: <a href="http://www.gnu.org/licenses/lgpl.html"
 * target="_blank">http://www.gnu.org/licenses/lgpl.html</a></p>
 *
 * @forum     32692
 * @demo      http://lovcombo.extjs.eu
 * @download
 * <ul>
 * <li><a href="http://lovcombo.extjs.eu/lovcombo.tar.bz2">lovcombo.tar.bz2</a></li>
 * <li><a href="http://lovcombo.extjs.eu/lovcombo.tar.gz">lovcombo.tar.gz</a></li>
 * <li><a href="http://lovcombo.extjs.eu/lovcombo.zip">lovcombo.zip</a></li>
 * </ul>
 *
 * @donate
 * <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
 * <input type="hidden" name="cmd" value="_s-xclick">
 * <input type="hidden" name="hosted_button_id" value="3430419">
 * <input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-butcc-donate.gif"
 * border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
 * <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
 * </form>
 */

// Check RegExp.escape dependency
if ('function' !== typeof RegExp.escape) {
    throw('RegExp.escape function is missing. Include Ext.ux.util.js file.');
}


/**
 * Creates new LovCombo
 * @constructor
 * @param {Object} config A config object
 */
Ext.form.LovCombo = Ext.extend(Ext.form.ComboBox, {
    // {{{
    // configuration options
    /**
     * @cfg {String} checkField Name of field used to store checked state.
     * It is automatically added to existing fields.
     * (defaults to "checked" - change it only if it collides with your normal field)
     */
    checkField: 'checked'

    /**
     * @cfg {String} separator Separator to use between values and texts (defaults to "," (comma))
     */
    , separator: ','

    /**
     * @cfg {String/Array} tpl Template for items.
     * Change it only if you know what you are doing.
     */
    // }}}
    // {{{
    , constructor: function (config) {
        config = config || {};
        config.listeners = config.listeners || {};
        Ext.applyIf(config.listeners, {
            scope: this
            , beforequery: this.onBeforeQuery
            , blur: this.onRealBlur
        });
        Ext.form.LovCombo.superclass.constructor.call(this, config);
    } // eo function constructor
    // }}}
    // {{{
    , initComponent: function () {

        // template with checkbox
        if (!this.tpl) {
            this.tpl =
                '<tpl for=".">'
                + '<div class="x-combo-list-item">'
                + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
                + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
                + '{[values.' + this.checkField + '?"checked":"unchecked"' + ']}">'
                + '<div class="ux-lovcombo-item-text">{' + (this.displayField || 'text') + ':htmlEncode}</div>'
                + '</div>'
                + '</tpl>'
            ;
        }

        // call parent
        Ext.form.LovCombo.superclass.initComponent.apply(this, arguments);

        // remove selection from input field
        this.onLoad = this.onLoad.createSequence(function () {
            if (this.el) {
                var v = this.el.dom.value;
                this.el.dom.value = '';
                this.el.dom.value = v;
            }
        });

    } // eo function initComponent
    // }}}
    // {{{
    /**
     * Disables default tab key bahavior
     * @private
     */
    , initEvents: function () {
        Ext.form.LovCombo.superclass.initEvents.apply(this, arguments);

        // disable default tab handling - does no good
        this.keyNav.tab = false;

    } // eo function initEvents
    // }}}
    // {{{
    /**
     * Clears value
     */
    , clearValue: function () {
        this.value = '';
        this.setRawValue(this.value);
        this.store.clearFilter();
        this.store.each(function (r) {
            r.set(this.checkField, false);
        }, this);
        if (this.hiddenField) {
            this.hiddenField.value = '';
        }
        this.applyEmptyText();
    } // eo function clearValue
    // }}}
    // {{{
    /**
     * @return {String} separator (plus space) separated list of selected displayFields
     * @private
     */
    , getCheckedDisplay: function () {
        var re = new RegExp(this.separator, "g");
        return this.getCheckedValue(this.displayField).replace(re, this.separator + ' ');
    } // eo function getCheckedDisplay
    // }}}
    // {{{
    /**
     * @return {String} separator separated list of selected valueFields
     * @private
     */
    , getCheckedValue: function (field) {
        field = field || this.valueField;
        var c = [];

        // store may be filtered so get all records
        var snapshot = this.store.snapshot || this.store.data;

        snapshot.each(function (r) {
            if (r.get(this.checkField)) {
                c.push(r.get(field));
            }
        }, this);

        return c.join(this.separator);
    } // eo function getCheckedValue
    // }}}
    // {{{
    /**
     * beforequery event handler - handles multiple selections
     * @param {Object} qe query event
     * @private
     */
    , onBeforeQuery: function (qe) {
        qe.query = qe.query.replace(new RegExp(RegExp.escape(this.getCheckedDisplay()) + '[ ' + this.separator + ']*'), '');
    } // eo function onBeforeQuery
    // }}}
    // {{{
    /**
     * blur event handler - runs only when real blur event is fired
     * @private
     */
    , onRealBlur: function () {
        this.list.hide();
        var rv = this.getRawValue();
        var rva = rv.split(new RegExp(RegExp.escape(this.separator) + ' *'));
        var va = [];
        var snapshot = this.store.snapshot || this.store.data;

        // iterate through raw values and records and check/uncheck items
        Ext.each(rva, function (v) {
            snapshot.each(function (r) {
                if (v === r.get(this.displayField)) {
                    va.push(r.get(this.valueField));
                }
            }, this);
        }, this);
        this.setValue(va.join(this.separator));
        this.store.clearFilter();
    } // eo function onRealBlur
    // }}}
    // {{{
    /**
     * Combo's onSelect override
     * @private
     * @param {Ext.data.Record} record record that has been selected in the list
     * @param {Number} index index of selected (clicked) record
     */
    , onSelect: function (record, index) {
        if (this.fireEvent('beforeselect', this, record, index) !== false) {

            // toggle checked field
            record.set(this.checkField, !record.get(this.checkField));

            // display full list
            if (this.store.isFiltered()) {
                this.doQuery(this.allQuery);
            }

            // set (update) value and fire event
            this.setValue(this.getCheckedValue());
            this.fireEvent('select', this, record, index);
        }
    } // eo function onSelect
    // }}}
    // {{{
    /**
     * Sets the value of the LovCombo. The passed value can by a falsie (null, false, empty string), in
     * which case the combo value is cleared or separator separated string of values, e.g. '3,5,6'.
     * @param {Mixed} v value
     */
    , setValue: function (v) {
        if (v) {
            v = '' + v;
            if (this.valueField) {
                this.store.clearFilter();
                this.store.each(function (r) {
                    var checked = !(!v.match(
                            '(^|' + this.separator + ')' + RegExp.escape(r.get(this.valueField))
                            + '(' + this.separator + '|$)'))
                        ;

                    r.set(this.checkField, checked);
                }, this);
                this.value = this.getCheckedValue();
                this.setRawValue(this.getCheckedDisplay());
                if (this.hiddenField) {
                    this.hiddenField.value = this.value;
                }
            }
            else {
                this.value = v;
                this.setRawValue(v);
                if (this.hiddenField) {
                    this.hiddenField.value = v;
                }
            }
            if (this.el) {
                this.el.removeClass(this.emptyClass);
            }
        }
        else {
            this.clearValue();
        }
    } // eo function setValue
    // }}}
    // {{{
    /**
     * Selects all items
     */
    , selectAll: function () {
        this.store.each(function (record) {
            // toggle checked field
            record.set(this.checkField, true);
        }, this);

        //display full list
        this.doQuery(this.allQuery);
        this.setValue(this.getCheckedValue());
    } // eo full selectAll
    // }}}
    // {{{
    /**
     * Deselects all items. Synonym for clearValue
     */
    , deselectAll: function () {
        this.clearValue();
    } // eo full deselectAll 
    // }}}

}); // eo extend

// register xtype
Ext.reg('lovcombo', Ext.form.LovCombo);

Ext.namespace('Ext.ux.maximgb');
/**
 * This class shouldn't be created directly use NestedSetStore or AdjacencyListStore instead.
 *
 * @abstract
 */
Ext.ux.maximgb.AbstractTreeStore = Ext.extend(Ext.data.Store,
    {
        /**
         * @cfg {String} is_leaf_field_name Record leaf flag field name.
         */
        leaf_field_name: '_is_leaf',
        /**
         * Current page offset.
         *
         * @access private
         */
        page_offset: 0,
        /**
         * Current active node.
         *
         * @access private
         */
        active_node: null,
        /**
         * @constructor
         */
        constructor: function (config) {
            Ext.ux.maximgb.AbstractTreeStore.superclass.constructor.call(this, config);

            if (!this.paramNames.active_node) {
                this.paramNames.active_node = 'anode';
            }

            this.addEvents(
                /**
                 * @event beforeexpandnode
                 * Fires before node expand. Return false to cancel operation.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'beforeexpandnode',
                /**
                 * @event expandnode
                 * Fires after node expand.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'expandnode',
                /**
                 * @event expandnodefailed
                 * Fires when expand node operation is failed.
                 * param {AbstractTreeStore} this
                 * param {id} Record id
                 * param {Record} Record, may be undefined
                 */
                'expandnodefailed',
                /**
                 * @event beforecollapsenode
                 * Fires before node collapse. Return false to cancel operation.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'beforecollapsenode',
                /**
                 * @event collapsenode
                 * Fires after node collapse.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'collapsenode',
                /**
                 * @event beforeactivenodechange
                 * Fires before active node change. Return false to cancel operation.
                 * param {AbstractTreeStore} this
                 * param {Record} old active node record
                 * param {Record} new active node record
                 */
                'beforeactivenodechange',
                /**
                 * @event activenodechange
                 * Fires after active node change.
                 * param {AbstractTreeStore} this
                 * param {Record} old active node record
                 * param {Record} new active node record
                 */
                'activenodechange'
            );
        },
        // Store methods.
        // -----------------------------------------------------------------------------------------------
        /**
         * Removes record and all its descendants.
         *
         * @access public
         * @param {Record} record Record to remove.
         */
        remove: function (record) {
            // ----- Modification start
            if (record === this.active_node) {
                this.setActiveNode(null);
            }
            this.removeNodeDescendants(record);
            // ----- End of modification
            Ext.ux.maximgb.AbstractTreeStore.superclass.remove.call(this, record);
        },
        /**
         * Removes node descendants.
         *
         * @access private
         */
        removeNodeDescendants: function (rc) {
            var i, len, children = this.getNodeChildren(rc);
            for (i = 0, len = children.length; i < len; i++) {
                this.remove(children[i]);
            }
        },
        /**
         * Loads current active record data.
         */
        load: function (options) {
            if (options) {
                if (options.params) {
                    if (options.params[this.paramNames.active_node] === undefined) {
                        options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
                    }
                }
                else {
                    options.params = {};
                    options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
                }
            }
            else {
                options = {params: {}};
                options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
            }

            if (options.params[this.paramNames.active_node] !== null) {
                options.add = true;
            }

            return Ext.ux.maximgb.AbstractTreeStore.superclass.load.call(this, options);
        },
        /**
         * Called as a callback by the Reader during load operation.
         *
         * @access private
         */
        loadRecords: function (o, options, success) {
            if (!o || success === false) {
                if (success !== false) {
                    this.fireEvent("load", this, [], options);
                }
                if (options.callback) {
                    options.callback.call(options.scope || this, [], options, false);
                }
                return;
            }

            var r = o.records, t = o.totalRecords || r.length,
                page_offset = this.getPageOffsetFromOptions(options),
                loaded_node_id = this.getLoadedNodeIdFromOptions(options),
                loaded_node, i, len, prev_record, record, idx, updated, self = this;

            if (!options || options.add !== true/* || loaded_node_id === null*/) {
                if (this.pruneModifiedRecords) {
                    this.modified = [];
                }
                for (var i = 0, len = r.length; i < len; i++) {
                    r[i].join(this);
                }
                if (this.snapshot) {
                    this.data = this.snapshot;
                    delete this.snapshot;
                }
                this.data.clear();
                this.data.addAll(r);
                this.page_offset = page_offset;
                this.totalLength = t;
                this.applySort();
                this.fireEvent("datachanged", this);
            }
            else {
                if (loaded_node_id) {
                    loaded_node = this.getById(loaded_node_id);
                }
                if (loaded_node) {
                    this.setNodeLoaded(loaded_node, true);
                    this.setNodeChildrenOffset(loaded_node, page_offset);
                    this.setNodeChildrenTotalCount(loaded_node, Math.max(t, r.length));
                    this.removeNodeDescendants(loaded_node);
                }
                this.suspendEvents();
                updated = {};
                for (i = 0, len = r.length; i < len; i++) {
                    record = r[i];
                    idx = this.indexOfId(record.id);
                    if (idx == -1) {
                        updated[record.id] = false;
                        this.add(record);
                    }
                    else {
                        updated[record.id] = true;
                        prev_record = this.getAt(idx);
                        prev_record.reject();
                        prev_record.data = record.data;
                        r[i] = prev_record;
                    }
                }
                this.applySort();
                this.resumeEvents();

                r.sort(function (r1, r2) {
                    var idx1 = self.data.indexOf(r1),
                        idx2 = self.data.indexOf(r2),
                        result;

                    if (idx1 > idx2) {
                        result = 1;
                    }
                    else {
                        result = -1;
                    }
                    return result;
                });

                for (i = 0, len = r.length; i < len; i++) {
                    record = r[i];
                    if (updated[record.id] == true) {
                        this.fireEvent('update', this, record, Ext.data.Record.COMMIT);
                    }
                    else {
                        this.fireEvent("add", this, [record], this.data.indexOf(record));
                    }
                }
            }
            this.fireEvent("load", this, r, options);
            if (options.callback) {
                options.callback.call(options.scope || this, r, options, true);
            }
        },
        /**
         * Sort the Records.
         *
         * @access public
         */
        sort: function (fieldName, dir) {
            if (this.remoteSort) {
                this.setActiveNode(null);
                if (this.lastOptions) {
                    this.lastOptions.add = false;
                    if (this.lastOptions.params) {
                        this.lastOptions.params[this.paramNames.active_node] = null;
                    }
                }
            }

            return Ext.ux.maximgb.AbstractTreeStore.superclass.sort.call(this, fieldName, dir);
        },
        /**
         * Applyes current sort method.
         *
         * @access private
         */
        applySort: function () {
            if (this.sortInfo && !this.remoteSort) {
                var s = this.sortInfo, f = s.field;
                this.sortData(f, s.direction);
            }
            // ----- Modification start
            else {
                this.applyTreeSort();
            }
            // ----- End of modification
        },
        /**
         * Sorts data according to sort params and then applyes tree sorting.
         *
         * @access private
         */
        sortData: function (f, direction) {
            direction = direction || 'ASC';
            var st = this.fields.get(f).sortType;
            var fn = function (r1, r2) {
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(direction, fn);
            if (this.snapshot && this.snapshot != this.data) {
                this.snapshot.sort(direction, fn);
            }
            // ----- Modification start
            this.applyTreeSort();
            // ----- End of modification
        },
        // Tree support methods.
        // -----------------------------------------------------------------------------------------------

        /**
         * Sorts store data with respect to nodes parent-child relation. Every child node will be
         * positioned after its parent.
         *
         * @access public
         */
        applyTreeSort: function () {
            var i, len, temp,
                rec, records = [],
                roots = this.getRootNodes();

            // Sorting data
            for (i = 0, len = roots.length; i < len; i++) {
                rec = roots[i];
                records.push(rec);
                this.collectNodeChildrenTreeSorted(records, rec);
            }

            if (records.length > 0) {
                this.data.clear();
                this.data.addAll(records);
            }

            // Sorting the snapshot if one present.
            if (this.snapshot && this.snapshot !== this.data) {
                temp = this.data;
                this.data = this.snapshot;
                this.snapshot = null;
                this.applyTreeSort();
                this.snapshot = this.data;
                this.data = temp;
            }
        },
        /**
         * Recusively collects rec descendants and adds them to records[] array.
         *
         * @access private
         * @param {Record[]} records
         * @param {Record} rec
         */
        collectNodeChildrenTreeSorted: function (records, rec) {
            var i, len,
                child,
                children = this.getNodeChildren(rec);

            for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                records.push(child);
                this.collectNodeChildrenTreeSorted(records, child);
            }
        },
        /**
         * Returns current active node.
         *
         * @access public
         * @return {Record}
         */
        getActiveNode: function () {
            return this.active_node;
        },
        /**
         * Sets active node.
         *
         * @access public
         * @param {Record} rc Record to set active.
         */
        setActiveNode: function (rc) {
            if (this.active_node !== rc) {
                if (rc) {
                    if (this.data.indexOf(rc) != -1) {
                        if (this.fireEvent('beforeactivenodechange', this, this.active_node, rc) !== false) {
                            this.active_node = rc;
                            this.fireEvent('activenodechange', this, this.active_node, rc);
                        }
                    }
                    else {
                        throw "Given record is not from the store.";
                    }
                }
                else {
                    if (this.fireEvent('beforeactivenodechange', this, this.active_node, rc) !== false) {
                        this.active_node = rc;
                        this.fireEvent('activenodechange', this, this.active_node, rc);
                    }
                }
            }
        },
        /**
         * Returns true if node is expanded.
         *
         * @access public
         * @param {Record} rc
         */
        isExpandedNode: function (rc) {
            return rc.ux_maximgb_tg_expanded === true;
        },
        /**
         * Sets node expanded flag.
         *
         * @access private
         */
        setNodeExpanded: function (rc, value) {
            rc.ux_maximgb_tg_expanded = value;
        },
        /**
         * Returns true if node's ancestors are all expanded - node is visible.
         *
         * @access public
         * @param {Record} rc
         */
        isVisibleNode: function (rc) {
            var i, len,
                ancestors = this.getNodeAncestors(rc),
                result = true;

            for (i = 0, len = ancestors.length; i < len; i++) {
                result = result && this.isExpandedNode(ancestors[i]);
                if (!result) {
                    break;
                }
            }

            return result;
        },
        /**
         * Returns true if node is a leaf.
         *
         * @access public
         * @return {Boolean}
         */
        isLeafNode: function (rc) {
            return rc.get(this.leaf_field_name) == true;
        },
        /**
         * Returns true if node was loaded.
         *
         * @access public
         * @return {Boolean}
         */
        isLoadedNode: function (rc) {
            var result;

            if (rc.ux_maximgb_tg_loaded !== undefined) {
                result = rc.ux_maximgb_tg_loaded;
            }
            else if (this.isLeafNode(rc) || this.hasChildNodes(rc)) {
                result = true;
            }
            else {
                result = false;
            }

            return result;
        },
        /**
         * Sets node loaded state.
         *
         * @access private
         * @param {Record} rc
         * @param {Boolean} value
         */
        setNodeLoaded: function (rc, value) {
            rc.ux_maximgb_tg_loaded = value;
        },
        /**
         * Returns node's children offset.
         *
         * @access public
         * @param {Record} rc
         * @return {Integer}
         */
        getNodeChildrenOffset: function (rc) {
            return rc.ux_maximgb_tg_offset || 0;
        },
        /**
         * Sets node's children offset.
         *
         * @access private
         * @param {Record} rc
         * @parma {Integer} value
         */
        setNodeChildrenOffset: function (rc, value) {
            rc.ux_maximgb_tg_offset = value;
        },
        /**
         * Returns node's children total count
         *
         * @access public
         * @param {Record} rc
         * @return {Integer}
         */
        getNodeChildrenTotalCount: function (rc) {
            return rc.ux_maximgb_tg_total || 0;
        },
        /**
         * Sets node's children total count.
         *
         * @access private
         * @param {Record} rc
         * @param {Integer} value
         */
        setNodeChildrenTotalCount: function (rc, value) {
            rc.ux_maximgb_tg_total = value;
        },
        /**
         * Collapses node.
         *
         * @access public
         * @param {Record} rc
         * @param {Record} rc Node to collapse.
         */
        collapseNode: function (rc) {
            if (
                this.isExpandedNode(rc) &&
                this.fireEvent('beforecollapsenode', this, rc) !== false
            ) {
                this.setNodeExpanded(rc, false);
                this.fireEvent('collapsenode', this, rc);
            }
        },
        /**
         * Expands node.
         *
         * @access public
         * @param {Record} rc
         */
        expandNode: function (rc) {
            var params;

            if (
                !this.isExpandedNode(rc) &&
                this.fireEvent('beforeexpandnode', this, rc) !== false
            ) {
                // If node is already loaded then expanding now.
                if (this.isLoadedNode(rc)) {
                    this.setNodeExpanded(rc, true);
                    this.fireEvent('expandnode', this, rc);
                }
                // If node isn't loaded yet then expanding after load.
                else {
                    params = {};
                    params[this.paramNames.active_node] = rc.id;
                    this.load({
                        add: true,
                        params: params,
                        callback: this.expandNodeCallback,
                        scope: this
                    });
                }
            }
        },
        /**
         * @access private
         */
        expandNodeCallback: function (r, options, success) {
            var rc = this.getById(options.params[this.paramNames.active_node]);

            if (success && rc) {
                this.setNodeExpanded(rc, true);
                this.fireEvent('expandnode', this, rc);
            }
            else {
                this.fireEvent('expandnodefailed', this, options.params[this.paramNames.active_node], rc);
            }
        },
        /**
         * Expands all nodes.
         *
         * @access public
         */
        expandAll: function () {
            var r, i, len, records = this.data.getRange();
            this.suspendEvents();
            for (i = 0, len = records.length; i < len; i++) {
                r = records[i];
                if (!this.isExpandedNode(r)) {
                    this.expandNode(r);
                }
            }
            this.resumeEvents();
            this.fireEvent('datachanged', this);
        },
        /**
         * Collapses all nodes.
         *
         * @access public
         */
        collapseAll: function () {
            var r, i, len, records = this.data.getRange();

            this.suspendEvents();
            for (i = 0, len = records.length; i < len; i++) {
                r = records[i];
                if (this.isExpandedNode(r)) {
                    this.collapseNode(r);
                }
            }
            this.resumeEvents();
            this.fireEvent('datachanged', this);
        },
        /**
         * Returns loaded node id from the load options.
         *
         * @access public
         */
        getLoadedNodeIdFromOptions: function (options) {
            var result = null;
            if (options && options.params && options.params[this.paramNames.active_node]) {
                result = options.params[this.paramNames.active_node];
            }
            return result;
        },
        /**
         * Returns start offset from the load options.
         */
        getPageOffsetFromOptions: function (options) {
            var result = 0;
            if (options && options.params && options.params[this.paramNames.start]) {
                result = parseInt(options.params[this.paramNames.start], 10);
                if (isNaN(result)) {
                    result = 0;
                }
            }
            return result;
        },
        // Public
        hasNextSiblingNode: function (rc) {
            return this.getNodeNextSibling(rc) !== null;
        },
        // Public
        hasPrevSiblingNode: function (rc) {
            return this.getNodePrevSibling(rc) !== null;
        },
        // Public
        hasChildNodes: function (rc) {
            return this.getNodeChildrenCount(rc) > 0;
        },
        // Public
        getNodeAncestors: function (rc) {
            var ancestors = [],
                parent;

            parent = this.getNodeParent(rc);
            while (parent) {
                ancestors.push(parent);
                parent = this.getNodeParent(parent);
            }
            return ancestors;
        },
        // Public
        getNodeChildrenCount: function (rc) {
            return this.getNodeChildren(rc).length;
        },
        // Public
        getNodeNextSibling: function (rc) {
            var siblings,
                parent,
                index,
                result = null;

            parent = this.getNodeParent(rc);
            if (parent) {
                siblings = this.getNodeChildren(parent);
            }
            else {
                siblings = this.getRootNodes();
            }

            index = siblings.indexOf(rc);

            if (index < siblings.length - 1) {
                result = siblings[index + 1];
            }

            return result;
        },
        // Public
        getNodePrevSibling: function (rc) {
            var siblings,
                parent,
                index,
                result = null;

            parent = this.getNodeParent(rc);
            if (parent) {
                siblings = this.getNodeChildren(parent);
            }
            else {
                siblings = this.getRootNodes();
            }

            index = siblings.indexOf(rc);
            if (index > 0) {
                result = siblings[index - 1];
            }

            return result;
        },
        // Abstract tree support methods.
        // -----------------------------------------------------------------------------------------------

        // Public - Abstract
        getRootNodes: function () {
            throw 'Abstract method call';
        },
        // Public - Abstract
        getNodeDepth: function (rc) {
            throw 'Abstract method call';
        },
        // Public - Abstract
        getNodeParent: function (rc) {
            throw 'Abstract method call';
        },
        // Public - Abstract
        getNodeChildren: function (rc) {
            throw 'Abstract method call';
        },
        // Public - Abstract
        addToNode: function (parent, child) {
            throw 'Abstract method call';
        },
        // Public - Abstract
        removeFromNode: function (parent, child) {
            throw 'Abstract method call';
        },
        // Paging support methods.
        // -----------------------------------------------------------------------------------------------
        /**
         * Returns top level node page offset.
         *
         * @access public
         * @return {Integer}
         */
        getPageOffset: function () {
            return this.page_offset;
        },
        /**
         * Returns active node page offset.
         *
         * @access public
         * @return {Integer}
         */
        getActiveNodePageOffset: function () {
            var result;

            if (this.active_node) {
                result = this.getNodeChildrenOffset(this.active_node);
            }
            else {
                result = this.getPageOffset();
            }

            return result;
        },
        /**
         * Returns active node children count.
         *
         * @access public
         * @return {Integer}
         */
        getActiveNodeCount: function () {
            var result;

            if (this.active_node) {
                result = this.getNodeChildrenCount(this.active_node);
            }
            else {
                result = this.getRootNodes().length;
            }

            return result;
        },
        /**
         * Returns active node total children count.
         *
         * @access public
         * @return {Integer}
         */
        getActiveNodeTotalCount: function () {
            var result;

            if (this.active_node) {
                result = this.getNodeChildrenTotalCount(this.active_node);
            }
            else {
                result = this.getTotalCount();
            }

            return result;
        }
    });

/**
 * Tree store for adjacency list tree representation.
 */
Ext.ux.maximgb.AdjacencyListStore = Ext.extend(Ext.ux.maximgb.AbstractTreeStore,
    {
        /**
         * @cfg {String} parent_id_field_name Record parent id field name.
         */
        parent_id_field_name: '_parent',
        getRootNodes: function () {
            var i,
                len,
                result = [],
                records = this.data.getRange();

            for (i = 0, len = records.length; i < len; i++) {
                if (records[i].get(this.parent_id_field_name) == null) {
                    result.push(records[i]);
                }
            }

            return result;
        },
        getNodeDepth: function (rc) {
            return this.getNodeAncestors(rc).length;
        },
        getNodeParent: function (rc) {
            return this.getById(rc.get(this.parent_id_field_name));
        },
        getNodeChildren: function (rc) {
            var i,
                len,
                result = [],
                records = this.data.getRange();

            for (i = 0, len = records.length; i < len; i++) {
                if (records[i].get(this.parent_id_field_name) == rc.id) {
                    result.push(records[i]);
                }
            }

            return result;
        },
        addToNode: function (parent, child) {
            child.set(this.parent_id_field_name, parent.id);
            this.addSorted(child);
        },
        removeFromNode: function (parent, child) {
            this.remove(child);
        }
    });

Ext.reg('Ext.ux.maximgb.AdjacencyListStore', Ext.ux.maximgb.AdjacencyListStore);

/**
 * Tree store for nested set tree representation.
 */
Ext.ux.maximgb.NestedSetStore = Ext.extend(Ext.ux.maximgb.AbstractTreeStore,
    {
        /**
         * @cfg {String} left_field_name Record NS-left bound field name.
         */
        left_field_name: '_lft',
        /**
         * @cfg {String} right_field_name Record NS-right bound field name.
         */
        right_field_name: '_rgt',
        /**
         * @cfg {String} level_field_name Record NS-level field name.
         */
        level_field_name: '_level',
        /**
         * @cfg {Number} root_node_level Root node level.
         */
        root_node_level: 1,
        getRootNodes: function () {
            var i,
                len,
                result = [],
                records = this.data.getRange();

            for (i = 0, len = records.length; i < len; i++) {
                if (records[i].get(this.level_field_name) == this.root_node_level) {
                    result.push(records[i]);
                }
            }

            return result;
        },
        getNodeDepth: function (rc) {
            return rc.get(this.level_field_name) - this.root_node_level;
        },
        getNodeParent: function (rc) {
            var result = null,
                rec, records = this.data.getRange(),
                i, len,
                lft, r_lft,
                rgt, r_rgt,
                level, r_level;

            lft = rc.get(this.left_field_name);
            rgt = rc.get(this.right_field_name);
            level = rc.get(this.level_field_name);

            for (i = 0, len = records.length; i < len; i++) {
                rec = records[i];
                r_lft = rec.get(this.left_field_name);
                r_rgt = rec.get(this.right_field_name);
                r_level = rec.get(this.level_field_name);

                if (
                    r_level == level - 1 &&
                    r_lft < lft &&
                    r_rgt > rgt
                ) {
                    result = rec;
                    break;
                }
            }

            return result;
        },
        getNodeChildren: function (rc) {
            var lft, r_lft,
                rgt, r_rgt,
                level, r_level,
                records, rec,
                result = [];

            records = this.data.getRange();

            lft = rc.get(this.left_field_name);
            rgt = rc.get(this.right_field_name);
            level = rc.get(this.level_field_name);

            for (i = 0, len = records.length; i < len; i++) {
                rec = records[i];
                r_lft = rec.get(this.left_field_name);
                r_rgt = rec.get(this.right_field_name);
                r_level = rec.get(this.level_field_name);

                if (
                    r_level == level + 1 &&
                    r_lft > lft &&
                    r_rgt < rgt
                ) {
                    result.push(rec);
                }
            }

            return result;
        }
    });

Ext.ux.maximgb.GridView = Ext.extend(Ext.grid.GridView,
    {
        expanded_icon_class: 'ux-maximgb-tg-elbow-minus',
        last_expanded_icon_class: 'ux-maximgb-tg-elbow-end-minus',
        collapsed_icon_class: 'ux-maximgb-tg-elbow-plus',
        last_collapsed_icon_class: 'ux-maximgb-tg-elbow-end-plus',
        skip_width_update_class: 'ux-maximgb-tg-skip-width-update',
        // private - overriden
        initTemplates: function () {
            var ts = this.templates || {};

            if (!ts.row) {
                ts.row = new Ext.Template(
                    '<div class="x-grid3-row ux-maximgb-tg-level-{level} {alt}" style="{tstyle} {display_style}">',
                    '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody>',
                    '<tr>{cells}</tr>',
                    (
                        this.enableRowBody ?
                        '<tr class="x-grid3-row-body-tr" style="{bodyStyle}">' +
                        '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">' +
                        '<div class="x-grid3-row-body">{body}</div>' +
                        '</td>' +
                        '</tr>'
                            :
                            ''
                    ),
                    '</tbody>',
                    '</table>',
                    '</div>'
                );
            }

            if (!ts.mastercell) {
                ts.mastercell = new Ext.Template(
                    '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
                    '<div class="ux-maximgb-tg-mastercell-wrap">', // This is for editor to place itself right
                    '{treeui}',
                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
                    '</div>',
                    '</td>'
                );
            }

            if (!ts.treeui) {
                ts.treeui = new Ext.Template(
                    '<div class="ux-maximgb-tg-uiwrap" style="width: {wrap_width}px">',
                    '{elbow_line}',
                    '<div style="left: {left}px" class="{cls}">&#160;</div>',
                    '</div>'
                );
            }

            if (!ts.elbow_line) {
                ts.elbow_line = new Ext.Template(
                    '<div style="left: {left}px" class="{cls}">&#160;</div>'
                );
            }

            this.templates = ts;
            Ext.ux.maximgb.GridView.superclass.initTemplates.call(this);
        },
        // Private - Overriden
        doRender: function (cs, rs, ds, startRow, colCount, stripe) {
            var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
            var tstyle = 'width:' + this.getTotalWidth() + ';';
            // buffers
            var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
            for (var j = 0, len = rs.length; j < len; j++) {
                r = rs[j];
                cb = [];
                var rowIndex = (j + startRow);

                var row_render_res = this.renderRow(r, rowIndex, colCount, ds, this.cm.getTotalWidth());

                if (row_render_res === false) {
                    for (var i = 0; i < colCount; i++) {
                        c = cs[i];
                        p.id = c.id;
                        p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                        p.attr = p.cellAttr = "";
                        p.value = c.renderer.call(c.scope, r.data[c.name], p, r, rowIndex, i, ds);
                        p.style = c.style;
                        if (Ext.isEmpty(p.value)) {
                            p.value = "&#160;";
                        }
                        if (this.markDirty && r.dirty && typeof r.modified[c.name] !== 'undefined') {
                            p.css += ' x-grid3-dirty-cell';
                        }
                        // ----- Modification start
                        if (c.id == this.grid.master_column_id) {
                            p.treeui = this.renderCellTreeUI(r, ds);
                            ct = ts.mastercell;
                        }
                        else {
                            ct = ts.cell;
                        }
                        // ----- End of modification
                        cb[cb.length] = ct.apply(p);
                    }
                }
                else {
                    cb.push(row_render_res);
                }

                var alt = [];
                if (stripe && ((rowIndex + 1) % 2 == 0)) {
                    alt[0] = "x-grid3-row-alt";
                }
                if (r.dirty) {
                    alt[1] = " x-grid3-dirty-row";
                }
                rp.cols = colCount;
                if (this.getRowClass) {
                    alt[2] = this.getRowClass(r, rowIndex, rp, ds);
                }
                rp.alt = alt.join(" ");
                rp.cells = cb.join("");
                // ----- Modification start
                if (!ds.isVisibleNode(r)) {
                    rp.display_style = 'display: none;';
                }
                else {
                    rp.display_style = '';
                }
                rp.level = ds.getNodeDepth(r);
                // ----- End of modification
                buf[buf.length] = rt.apply(rp);
            }
            return buf.join("");
        },
        renderCellTreeUI: function (record, store) {
            var tpl = this.templates.treeui,
                line_tpl = this.templates.elbow_line,
                tpl_data = {},
                rec, parent,
                depth = level = store.getNodeDepth(record);

            tpl_data.wrap_width = (depth + 1) * 16;
            if (level > 0) {
                tpl_data.elbow_line = '';
                rec = record;
                left = 0;
                while (level--) {
                    parent = store.getNodeParent(rec);
                    if (parent) {
                        if (store.hasNextSiblingNode(parent)) {
                            tpl_data.elbow_line =
                                line_tpl.apply({
                                    left: level * 16,
                                    cls: 'ux-maximgb-tg-elbow-line'
                                }) +
                                tpl_data.elbow_line;
                        }
                        else {
                            tpl_data.elbow_line =
                                line_tpl.apply({
                                    left: level * 16,
                                    cls: 'ux-maximgb-tg-elbow-empty'
                                }) +
                                tpl_data.elbow_line;
                        }
                    }
                    else {
                        throw [
                            "Tree inconsistency can't get level ",
                            level + 1,
                            " node(id=", rec.id, ") parent."
                        ].join("");
                    }
                    rec = parent;
                }
            }
            if (store.isLeafNode(record)) {
                if (store.hasNextSiblingNode(record)) {
                    tpl_data.cls = 'ux-maximgb-tg-elbow';
                }
                else {
                    tpl_data.cls = 'ux-maximgb-tg-elbow-end';
                }
            }
            else {
                tpl_data.cls = 'ux-maximgb-tg-elbow-active ';
                if (store.isExpandedNode(record)) {
                    if (store.hasNextSiblingNode(record)) {
                        tpl_data.cls += this.expanded_icon_class;
                    }
                    else {
                        tpl_data.cls += this.last_expanded_icon_class;
                    }
                }
                else {
                    if (store.hasNextSiblingNode(record)) {
                        tpl_data.cls += this.collapsed_icon_class;
                    }
                    else {
                        tpl_data.cls += this.last_collapsed_icon_class;
                    }
                }
            }
            tpl_data.left = 1 + depth * 16;

            return tpl.apply(tpl_data);
        },
        // Template method
        renderRow: function (record, index, col_count, ds, total_width) {
            return false;
        },
        // private - overriden
        afterRender: function () {
            Ext.ux.maximgb.GridView.superclass.afterRender.call(this);
            this.updateAllColumnWidths();
        },
        // private - overriden to support missing column td's case, if row is rendered by renderRow()
        // method.
        updateAllColumnWidths: function () {
            var tw = this.getTotalWidth(),
                clen = this.cm.getColumnCount(),
                ws = [],
                len,
                i;
            for (i = 0; i < clen; i++) {
                ws[i] = this.getColumnWidth(i);
            }
            this.innerHd.firstChild.style.width = this.getOffsetWidth();
            this.innerHd.firstChild.firstChild.style.width = tw;
            this.mainBody.dom.style.width = tw;
            for (i = 0; i < clen; i++) {
                var hd = this.getHeaderCell(i);
                hd.style.width = ws[i];
            }

            var ns = this.getRows(), row, trow;
            for (i = 0, len = ns.length; i < len; i++) {
                row = ns[i];
                row.style.width = tw;
                if (row.firstChild) {
                    row.firstChild.style.width = tw;
                    trow = row.firstChild.rows[0];
                    for (var j = 0; j < clen && j < trow.childNodes.length; j++) {
                        if (!Ext.fly(trow.childNodes[j]).hasClass(this.skip_width_update_class)) {
                            trow.childNodes[j].style.width = ws[j];
                        }
                    }
                }
            }

            this.onAllColumnWidthsUpdated(ws, tw);
        },
        // private - overriden to support missing column td's case, if row is rendered by renderRow()
        // method.
        updateColumnWidth: function (col, width) {
            var w = this.getColumnWidth(col);
            var tw = this.getTotalWidth();
            this.innerHd.firstChild.style.width = this.getOffsetWidth();
            this.innerHd.firstChild.firstChild.style.width = tw;
            this.mainBody.dom.style.width = tw;
            var hd = this.getHeaderCell(col);
            hd.style.width = w;

            var ns = this.getRows(), row;
            for (var i = 0, len = ns.length; i < len; i++) {
                row = ns[i];
                row.style.width = tw;
                if (row.firstChild) {
                    row.firstChild.style.width = tw;
                    if (col < row.firstChild.rows[0].childNodes.length) {
                        if (!Ext.fly(row.firstChild.rows[0].childNodes[col]).hasClass(this.skip_width_update_class)) {
                            row.firstChild.rows[0].childNodes[col].style.width = w;
                        }
                    }
                }
            }

            this.onColumnWidthUpdated(col, w, tw);
        },
        // private - overriden to support missing column td's case, if row is rendered by renderRow()
        // method.
        updateColumnHidden: function (col, hidden) {
            var tw = this.getTotalWidth();
            this.innerHd.firstChild.style.width = this.getOffsetWidth();
            this.innerHd.firstChild.firstChild.style.width = tw;
            this.mainBody.dom.style.width = tw;
            var display = hidden ? 'none' : '';

            var hd = this.getHeaderCell(col);
            hd.style.display = display;

            var ns = this.getRows(), row, cell;
            for (var i = 0, len = ns.length; i < len; i++) {
                row = ns[i];
                row.style.width = tw;
                if (row.firstChild) {
                    row.firstChild.style.width = tw;
                    if (col < row.firstChild.rows[0].childNodes.length) {
                        if (!Ext.fly(row.firstChild.rows[0].childNodes[col]).hasClass(this.skip_width_update_class)) {
                            row.firstChild.rows[0].childNodes[col].style.display = display;
                        }
                    }
                }
            }

            this.onColumnHiddenUpdated(col, hidden, tw);
            delete this.lastViewWidth; // force recalc
            this.layout();
        },
        // private - overriden to skip hidden rows processing.
        processRows: function (startRow, skipStripe) {
            var processed_cnt = 0;

            if (this.ds.getCount() < 1) {
                return;
            }
            skipStripe = !this.grid.stripeRows; //skipStripe || !this.grid.stripeRows;
            startRow = startRow || 0;
            var rows = this.getRows();
            var processed_cnt = 0;

            Ext.each(rows, function (row, idx) {
                row.rowIndex = idx;
                row.className = row.className.replace(this.rowClsRe, ' ');
                if (row.style.display != 'none') {
                    if (!skipStripe && ((processed_cnt + 1) % 2 === 0)) {
                        row.className += ' x-grid3-row-alt';
                    }
                    processed_cnt++;
                }
            }, this);

            Ext.fly(rows[0]).addClass(this.firstRowCls);
            Ext.fly(rows[rows.length - 1]).addClass(this.lastRowCls);
        },
        ensureVisible: function (row, col, hscroll) {
            var ancestors, record = this.ds.getAt(row);

            if (!this.ds.isVisibleNode(record)) {
                ancestors = this.ds.getNodeAncestors(record);
                while (ancestors.length > 0) {
                    record = ancestors.shift();
                    if (!this.ds.isExpandedNode(record)) {
                        this.ds.expandNode(record);
                    }
                }
            }

            return Ext.ux.maximgb.GridView.superclass.ensureVisible.call(this, row, col, hscroll);
        },
        // Private
        expandRow: function (record, skip_process) {
            var ds = this.ds,
                i, len, row, pmel, children, index, child_index;
            if (typeof record == 'number') {
                index = record;
                record = ds.getAt(index);
            }
            else {
                index = ds.indexOf(record);
            }

            skip_process = skip_process || false;

            row = this.getRow(index);
            pmel = Ext.fly(row).child('.ux-maximgb-tg-elbow-active');
            if (pmel) {
                if (ds.hasNextSiblingNode(record)) {
                    pmel.removeClass(this.collapsed_icon_class);
                    pmel.removeClass(this.last_collapsed_icon_class);
                    pmel.addClass(this.expanded_icon_class);
                }
                else {
                    pmel.removeClass(this.collapsed_icon_class);
                    pmel.removeClass(this.last_collapsed_icon_class);
                    pmel.addClass(this.last_expanded_icon_class);
                }
            }
            if (ds.isVisibleNode(record)) {
                children = ds.getNodeChildren(record);
                for (i = 0, len = children.length; i < len; i++) {
                    child_index = ds.indexOf(children[i]);
                    row = this.getRow(child_index);
                    row.style.display = 'block';
                    if (ds.isExpandedNode(children[i])) {
                        this.expandRow(child_index, true);
                    }
                }
            }
            if (!skip_process) {
                this.processRows(0);
            }
            //this.updateAllColumnWidths();
        },
        collapseRow: function (record, skip_process) {
            var ds = this.ds,
                i, len, children, row, index, child_index;

            if (typeof record == 'number') {
                index = record;
                record = ds.getAt(index);
            }
            else {
                index = ds.indexOf(record);
            }

            skip_process = skip_process || false;

            row = this.getRow(index);
            pmel = Ext.fly(row).child('.ux-maximgb-tg-elbow-active');
            if (pmel) {
                if (ds.hasNextSiblingNode(record)) {
                    pmel.removeClass(this.expanded_icon_class);
                    pmel.removeClass(this.last_expanded_icon_class);
                    pmel.addClass(this.collapsed_icon_class);
                }
                else {
                    pmel.removeClass(this.expanded_icon_class);
                    pmel.removeClass(this.last_expanded_icon_class);
                    pmel.addClass(this.last_collapsed_icon_class);
                }
            }
            children = ds.getNodeChildren(record);
            for (i = 0, len = children.length; i < len; i++) {
                child_index = ds.indexOf(children[i]);
                row = this.getRow(child_index);
                if (row.style.display != 'none') {
                    row.style.display = 'none';
                    this.collapseRow(child_index, true);
                }
            }
            if (!skip_process) {
                this.processRows(0);
            }
            //this.updateAllColumnWidths();
        },
        /**
         * @access private
         */
        initData: function (ds, cm) {
            Ext.ux.maximgb.GridView.superclass.initData.call(this, ds, cm);
            if (this.ds) {
                this.ds.un('expandnode', this.onStoreExpandNode, this);
                this.ds.un('collapsenode', this.onStoreCollapseNode, this);
            }
            if (ds) {
                ds.on('expandnode', this.onStoreExpandNode, this);
                ds.on('collapsenode', this.onStoreCollapseNode, this);
            }
        },
        onLoad: function (store, records, options) {
            var ridx;

            if (
                options &&
                options.params &&
                (
                    options.params[store.paramNames.active_node] === null ||
                    store.indexOfId(options.params[store.paramNames.active_node]) == -1
                )
            ) {
                Ext.ux.maximgb.GridView.superclass.onLoad.call(this, store, records, options);
            }
        },
        onAdd: function (ds, records, index) {
            Ext.ux.maximgb.GridView.superclass.onAdd.call(this, ds, records, index);
            if (this.mainWrap) {
                //this.updateAllColumnWidths();
                this.processRows(0);
                this.grid.view.refresh();
            }
        },
        onRemove: function (ds, record, index, isUpdate) {
            Ext.ux.maximgb.GridView.superclass.onRemove.call(this, ds, record, index, isUpdate);
            if (isUpdate !== true) {
                if (this.mainWrap) {
                    //this.updateAllColumnWidths();
                    this.processRows(0);
                    this.grid.view.refresh();
                }
            }
        },
        onUpdate: function (ds, record) {
            Ext.ux.maximgb.GridView.superclass.onUpdate.call(this, ds, record);
            if (this.mainWrap) {
                //this.updateAllColumnWidths();
                this.processRows(0);
                this.grid.view.refresh();
            }
        },
        onStoreExpandNode: function (store, rc) {
            this.expandRow(rc);
        },
        onStoreCollapseNode: function (store, rc) {
            this.collapseRow(rc);
        },
        // private
        getOffsetWidth: function () {
            return (this.cm.getTotalWidth() + this.getScrollOffset()) + 'px';
        },

        // private
        getScrollOffset: function () {
            return Ext.num(this.scrollOffset, 4);
        },

    });

Ext.ux.maximgb.GridPanel = Ext.extend(Ext.grid.GridPanel,
    {
        /**
         * @cfg {String|Integer} master_column_id Master column id. Master column cells are nested.
         * Master column cell values are used to build breadcrumbs.
         */
        master_column_id: 0,
        /**
         * @cfg {Stirng} TreeGrid panel custom class.
         */
        tg_cls: 'ux-maximgb-tg-panel',
        // Private
        initComponent: function () {
            this.initComponentPreOverride();
            Ext.ux.maximgb.GridPanel.superclass.initComponent.call(this);
            this.getSelectionModel().on('selectionchange', this.onTreeGridSelectionChange, this);
            this.initComponentPostOverride();
        },
        initComponentPreOverride: Ext.emptyFn,
        initComponentPostOverride: Ext.emptyFn,
        // Private
        onRender: function (ct, position) {
            Ext.ux.maximgb.GridPanel.superclass.onRender.call(this, ct, position);
            this.el.addClass(this.tg_cls);
        },
        /**
         * Returns view instance.
         *
         * @access private
         * @return {GridView}
         */
        getView: function () {
            if (!this.view) {
                this.view = new Ext.ux.maximgb.GridView(this.viewConfig);
            }
            return this.view;
        },
        /**
         * @access private
         */
        onClick: function (e) {
            var target = e.getTarget(),
                view = this.getView(),
                row = view.findRowIndex(target),
                store = this.getStore(),
                sm = this.getSelectionModel(),
                record, record_id, do_default = true;

            // Row click
            if (row !== false) {
                if (Ext.fly(target).hasClass('ux-maximgb-tg-elbow-active')) {
                    record = store.getAt(row);
                    if (store.isExpandedNode(record)) {
                        store.collapseNode(record);
                    }
                    else {
                        store.expandNode(record);
                    }
                    do_default = false;
                }
            }

            if (do_default) {
                Ext.ux.maximgb.GridPanel.superclass.onClick.call(this, e);
            }
        },
        /**
         * @access private
         */
        onMouseDown: function (e) {
            var target = e.getTarget();

            if (!Ext.fly(target).hasClass('ux-maximgb-tg-elbow-active')) {
                Ext.ux.maximgb.GridPanel.superclass.onMouseDown.call(this, e);
            }
        },
        /**
         * @access private
         */
        onTreeGridSelectionChange: function (sm, selection) {
            var record, ancestors, store = this.getStore();
            // Row selection model
            if (sm.getSelected) {
                record = sm.getSelected();
                store.setActiveNode(record);
            }
            // Cell selection model
            else if (sm.getSelectedCell && selection) {
                record = selection.record;
                store.setActiveNode(record);
            }

            // Ensuring that selected node is visible.
            if (record) {
                if (!store.isVisibleNode(record)) {
                    ancestors = store.getNodeAncestors(record);
                    while (ancestors.length > 0) {
                        store.expandNode(ancestors.pop());
                    }
                }
            }
        }
    });

Ext.ux.maximgb.EditorGridPanel = Ext.extend(Ext.grid.EditorGridPanel,
    {
        /**
         * @cfg {String|Integer} master_column_id Master column id. Master column cells are nested.
         * Master column cell values are used to build breadcrumbs.
         */
        master_column_id: 0,
        // Private
        initComponent: function () {
            this.initComponentPreOverride();

            Ext.ux.maximgb.EditorGridPanel.superclass.initComponent.call(this);

            this.getSelectionModel().on(
                'selectionchange',
                this.onTreeGridSelectionChange,
                this
            );

            this.initComponentPostOverride();
        },
        initComponentPreOverride: Ext.emptyFn,
        initComponentPostOverride: Ext.emptyFn,
        // Private
        onRender: function (ct, position) {
            Ext.ux.maximgb.EditorGridPanel.superclass.onRender.call(this, ct, position);
            this.el.addClass('ux-maximgb-tg-panel');
        },
        /**
         * Returns view instance.
         *
         * @access private
         * @return {GridView}
         */
        getView: function () {
            if (!this.view) {
                this.view = new Ext.ux.maximgb.GridView(this.viewConfig);
            }
            return this.view;
        },
        /**
         * @access private
         */
        onClick: function (e) {
            var target = e.getTarget(),
                view = this.getView(),
                row = view.findRowIndex(target),
                store = this.getStore(),
                sm = this.getSelectionModel(),
                record, record_id, do_default = true;

            // Row click
            if (row !== false) {
                if (Ext.fly(target).hasClass('ux-maximgb-tg-elbow-active')) {
                    record = store.getAt(row);
                    if (store.isExpandedNode(record)) {
                        store.collapseNode(record);
                    }
                    else {
                        store.expandNode(record);
                    }
                    do_default = false;
                }
            }

            if (do_default) {
                Ext.ux.maximgb.EditorGridPanel.superclass.onClick.call(this, e);
            }
        },
        /**
         * @access private
         */
        onMouseDown: function (e) {
            var target = e.getTarget();

            if (!Ext.fly(target).hasClass('ux-maximgb-tg-elbow-active')) {
                Ext.ux.maximgb.EditorGridPanel.superclass.onMouseDown.call(this, e);
            }
        },
        /**
         * @access private
         */
        onTreeGridSelectionChange: function (sm, selection) {
            var record, ancestors, store = this.getStore();
            // Row selection model
            if (sm.getSelected) {
                record = sm.getSelected();
                store.setActiveNode(record);
            }
            // Cell selection model
            else if (sm.getSelectedCell && selection) {
                record = selection.record;
                store.setActiveNode(record);
            }

            // Ensuring that selected node is visible.
            if (record) {
                if (!store.isVisibleNode(record)) {
                    ancestors = store.getNodeAncestors(record);
                    while (ancestors.length > 0) {
                        store.expandNode(ancestors.pop());
                    }
                }
            }
        }
    });

/**
 * Paging toolbar for work this AbstractTreeStore.
 */
Ext.ux.maximgb.PagingToolbar = Ext.extend(Ext.PagingToolbar,
    {
        onRender: function (ct, position) {
            Ext.ux.maximgb.PagingToolbar.superclass.onRender.call(this, ct, position);
            this.updateUI();
        },
        getPageData: function () {
            var total = 0, cursor = 0;
            if (this.store) {
                cursor = this.store.getActiveNodePageOffset();
                total = this.store.getActiveNodeTotalCount();
            }
            return {
                total: total,
                activePage: Math.ceil((cursor + this.pageSize) / this.pageSize),
                pages: total < this.pageSize ? 1 : Math.ceil(total / this.pageSize)
            };
        },
        updateInfo: function () {
            var count = 0, cursor = 0, total = 0, msg;
            if (this.displayItem) {
                if (this.store) {
                    cursor = this.store.getActiveNodePageOffset();
                    count = this.store.getActiveNodeCount();
                    total = this.store.getActiveNodeTotalCount();
                }
                msg = count == 0 ?
                    this.emptyMsg
                    :
                    String.format(
                        this.displayMsg,
                        cursor + 1, cursor + count, total
                    );
                this.displayItem.setText(msg);
            }
        },
        updateUI: function () {
            var d = this.getPageData(), ap = d.activePage, ps = d.pages;

            this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
            this.inputItem.setValue(ap);

            this.first.setDisabled(ap == 1);
            this.prev.setDisabled(ap == 1);
            this.next.setDisabled(ap == ps);
            this.last.setDisabled(ap == ps);
            this.refresh.enable();
            this.updateInfo();
        },
        bindStore: function (store, initial) {
            if (!initial && this.store) {
                this.store.un('activenodechange', this.onStoreActiveNodeChange, this);
            }
            if (store) {
                store.on('activenodechange', this.onStoreActiveNodeChange, this);
            }
            Ext.ux.maximgb.PagingToolbar.superclass.bindStore.call(this, store, initial);
        },
        beforeLoad: function (store, options) {
            var paramNames = this.getParams();

            Ext.ux.maximgb.PagingToolbar.superclass.beforeLoad.call(this, store, options);

            if (options && options.params) {
                if (options.params[paramNames.start] === undefined) {
                    options.params[paramNames.start] = 0;
                }
                if (options.params[paramNames.limit] === undefined) {
                    options.params[paramNames.limit] = this.pageSize;
                }
            }
        },
        /**
         * Move to the first page, has the same effect as clicking the 'first' button.
         */
        moveFirst: function () {
            this.doLoad(0);
        },
        /**
         * Move to the previous page, has the same effect as clicking the 'previous' button.
         */
        movePrevious: function () {
            var store = this.store,
                cursor = store ? store.getActiveNodePageOffset() : 0;

            this.doLoad(Math.max(0, cursor - this.pageSize));
        },
        /**
         * Move to the next page, has the same effect as clicking the 'next' button.
         */
        moveNext: function () {
            var store = this.store,
                cursor = store ? store.getActiveNodePageOffset() : 0;

            this.doLoad(cursor + this.pageSize);
        },
        /**
         * Move to the last page, has the same effect as clicking the 'last' button.
         */
        moveLast: function () {
            var store = this.store,
                cursor = store ? store.getActiveNodePageOffset() : 0,
                total = store ? store.getActiveNodeTotalCount() : 0,
                extra = total % this.pageSize;

            this.doLoad(extra ? (total - extra) : total - this.pageSize);
        },
        onStoreActiveNodeChange: function (store, old_rec, new_rec) {
            if (this.rendered) {
                this.updateUI();
            }
        }
    });
//
//Ext.reg('Ext.ux.maximgb.GridPanel', Ext.ux.maximgb.GridPanel);
//Ext.reg('Ext.ux.maximgb.EditorGridPanel', Ext.ux.maximgb.EditorGridPanel);
//Ext.reg('Ext.ux.maximgb.PagingToolbar', Ext.ux.maximgb.PagingToolbar);

/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Ext.ux.grid');

Ext.ux.grid.LockingGridView = Ext.extend(Ext.grid.GridView, {
    lockText: 'Bloquear',
    unlockText: 'Desbloquear',
    rowBorderWidth: 1,
    lockedBorderWidth: 1,
    /*
     * This option ensures that height between the rows is synchronized
     * between the locked and unlocked sides. This option only needs to be used
     * when the row heights aren't predictable.
     */
    syncHeights: false,
    initTemplates: function () {
        var ts = this.templates || {};

        if (!ts.masterTpl) {
            ts.masterTpl = new Ext.Template(
                '<div class="x-grid3" hidefocus="true">',
                '<div class="x-grid3-locked">',
                '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{lstyle}">{lockedHeader}</div></div><div class="x-clear"></div></div>',
                '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{lstyle}">{lockedBody}</div><div class="x-grid3-scroll-spacer"></div></div>',
                '</div>',
                '<div class="x-grid3-viewport x-grid3-unlocked">',
                '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>',
                '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
                '</div>',
                '<div class="x-grid3-resize-marker">&#160;</div>',
                '<div class="x-grid3-resize-proxy">&#160;</div>',
                '</div>'
            );
        }

        this.templates = ts;

        Ext.ux.grid.LockingGridView.superclass.initTemplates.call(this);
    },
    getEditorParent: function (ed) {
        return this.el.dom;
    },
    initElements: function () {
        var el = Ext.get(this.grid.getGridEl().dom.firstChild),
            lockedWrap = el.child('div.x-grid3-locked'),
            lockedHd = lockedWrap.child('div.x-grid3-header'),
            lockedScroller = lockedWrap.child('div.x-grid3-scroller'),
            mainWrap = el.child('div.x-grid3-viewport'),
            mainHd = mainWrap.child('div.x-grid3-header'),
            scroller = mainWrap.child('div.x-grid3-scroller');

        if (this.grid.hideHeaders) {
            lockedHd.setDisplayed(false);
            mainHd.setDisplayed(false);
        }

        if (this.forceFit) {
            scroller.setStyle('overflow-x', 'hidden');
        }

        Ext.apply(this, {
            el: el,
            mainWrap: mainWrap,
            mainHd: mainHd,
            innerHd: mainHd.dom.firstChild,
            scroller: scroller,
            mainBody: scroller.child('div.x-grid3-body'),
            focusEl: scroller.child('a'),
            resizeMarker: el.child('div.x-grid3-resize-marker'),
            resizeProxy: el.child('div.x-grid3-resize-proxy'),
            lockedWrap: lockedWrap,
            lockedHd: lockedHd,
            lockedScroller: lockedScroller,
            lockedBody: lockedScroller.child('div.x-grid3-body'),
            lockedInnerHd: lockedHd.child('div.x-grid3-header-inner', true)
        });

        this.focusEl.swallowEvent('click', true);
    },
    getLockedRows: function () {
        return this.hasRows() ? this.lockedBody.dom.childNodes : [];
    },
    getLockedRow: function (row) {
        return this.getLockedRows()[row];
    },
    getCell: function (row, col) {
        var lockedLen = this.cm.getLockedCount();
        if (col < lockedLen) {
            return this.getLockedRow(row).getElementsByTagName('td')[col];
        }
        return Ext.ux.grid.LockingGridView.superclass.getCell.call(this, row, col - lockedLen);
    },
    getHeaderCell: function (index) {
        var lockedLen = this.cm.getLockedCount();
        if (index < lockedLen) {
            return this.lockedHd.dom.getElementsByTagName('td')[index];
        }
        return Ext.ux.grid.LockingGridView.superclass.getHeaderCell.call(this, index - lockedLen);
    },
    addRowClass: function (row, cls) {
        var lockedRow = this.getLockedRow(row);
        if (lockedRow) {
            this.fly(lockedRow).addClass(cls);
        }
        Ext.ux.grid.LockingGridView.superclass.addRowClass.call(this, row, cls);
    },
    removeRowClass: function (row, cls) {
        var lockedRow = this.getLockedRow(row);
        if (lockedRow) {
            this.fly(lockedRow).removeClass(cls);
        }
        Ext.ux.grid.LockingGridView.superclass.removeRowClass.call(this, row, cls);
    },
    removeRow: function (row) {
        Ext.removeNode(this.getLockedRow(row));
        Ext.ux.grid.LockingGridView.superclass.removeRow.call(this, row);
    },
    removeRows: function (firstRow, lastRow) {
        var lockedBody = this.lockedBody.dom,
            rowIndex = firstRow;
        for (; rowIndex <= lastRow; rowIndex++) {
            Ext.removeNode(lockedBody.childNodes[firstRow]);
        }
        Ext.ux.grid.LockingGridView.superclass.removeRows.call(this, firstRow, lastRow);
    },
    syncScroll: function (e) {
        this.lockedScroller.dom.scrollTop = this.scroller.dom.scrollTop;
        Ext.ux.grid.LockingGridView.superclass.syncScroll.call(this, e);
    },
    updateSortIcon: function (col, dir) {
        var sortClasses = this.sortClasses,
            lockedHeaders = this.lockedHd.select('td').removeClass(sortClasses),
            headers = this.mainHd.select('td').removeClass(sortClasses),
            lockedLen = this.cm.getLockedCount(),
            cls = sortClasses[dir == 'DESC' ? 1 : 0];

        if (col < lockedLen) {
            lockedHeaders.item(col).addClass(cls);
        } else {
            headers.item(col - lockedLen).addClass(cls);
        }
    },
    updateAllColumnWidths: function () {
        var tw = this.getTotalWidth(),
            clen = this.cm.getColumnCount(),
            lw = this.getLockedWidth(),
            llen = this.cm.getLockedCount(),
            ws = [], len, i;
        this.updateLockedWidth();
        for (i = 0; i < clen; i++) {
            ws[i] = this.getColumnWidth(i);
            var hd = this.getHeaderCell(i);
            hd.style.width = ws[i];
        }
        var lns = this.getLockedRows(), ns = this.getRows(), row, trow, j;
        for (i = 0, len = ns.length; i < len; i++) {
            row = lns[i];
            row.style.width = lw;
            if (row.firstChild) {
                row.firstChild.style.width = lw;
                trow = row.firstChild.rows[0];
                for (j = 0; j < llen; j++) {
                    trow.childNodes[j].style.width = ws[j];
                }
            }
            row = ns[i];
            row.style.width = tw;
            if (row.firstChild) {
                row.firstChild.style.width = tw;
                trow = row.firstChild.rows[0];
                for (j = llen; j < clen; j++) {
                    trow.childNodes[j - llen].style.width = ws[j];
                }
            }
        }
        this.onAllColumnWidthsUpdated(ws, tw);
        this.syncHeaderHeight();
    },
    updateColumnWidth: function (col, width) {
        var w = this.getColumnWidth(col),
            llen = this.cm.getLockedCount(),
            ns, rw, c, row;
        this.updateLockedWidth();
        if (col < llen) {
            ns = this.getLockedRows();
            rw = this.getLockedWidth();
            c = col;
        } else {
            ns = this.getRows();
            rw = this.getTotalWidth();
            c = col - llen;
        }
        var hd = this.getHeaderCell(col);
        hd.style.width = w;
        for (var i = 0, len = ns.length; i < len; i++) {
            row = ns[i];
            row.style.width = rw;
            if (row.firstChild) {
                row.firstChild.style.width = rw;
                row.firstChild.rows[0].childNodes[c].style.width = w;
            }
        }
        this.onColumnWidthUpdated(col, w, this.getTotalWidth());
        this.syncHeaderHeight();
    },
    updateColumnHidden: function (col, hidden) {
        var llen = this.cm.getLockedCount(),
            ns, rw, c, row,
            display = hidden ? 'none' : '';
        this.updateLockedWidth();
        if (col < llen) {
            ns = this.getLockedRows();
            rw = this.getLockedWidth();
            c = col;
        } else {
            ns = this.getRows();
            rw = this.getTotalWidth();
            c = col - llen;
        }
        var hd = this.getHeaderCell(col);
        hd.style.display = display;
        for (var i = 0, len = ns.length; i < len; i++) {
            row = ns[i];
            row.style.width = rw;
            if (row.firstChild) {
                row.firstChild.style.width = rw;
                row.firstChild.rows[0].childNodes[c].style.display = display;
            }
        }
        this.onColumnHiddenUpdated(col, hidden, this.getTotalWidth());
        delete this.lastViewWidth;
        this.layout();
    },
    doRender: function (cs, rs, ds, startRow, colCount, stripe) {
        var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1,
            tstyle = 'width:' + this.getTotalWidth() + ';',
            lstyle = 'width:' + this.getLockedWidth() + ';',
            buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r;
        for (var j = 0, len = rs.length; j < len; j++) {
            r = rs[j];
            cb = [];
            lcb = [];
            var rowIndex = (j + startRow);
            for (var i = 0; i < colCount; i++) {
                c = cs[i];
                p.id = c.id;
                p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) +
                    (this.cm.config[i].cellCls ? ' ' + this.cm.config[i].cellCls : '');
                p.attr = p.cellAttr = '';
                p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                p.style = c.style;
                if (Ext.isEmpty(p.value)) {
                    p.value = '&#160;';
                }
                if (this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])) {
                    p.css += ' x-grid3-dirty-cell';
                }
                if (c.locked) {
                    lcb[lcb.length] = ct.apply(p);
                } else {
                    cb[cb.length] = ct.apply(p);
                }
            }
            var alt = [];
            if (stripe && ((rowIndex + 1) % 2 === 0)) {
                alt[0] = 'x-grid3-row-alt';
            }
            if (r.dirty) {
                alt[1] = ' x-grid3-dirty-row';
            }
            rp.cols = colCount;
            if (this.getRowClass) {
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
            }
            rp.alt = alt.join(' ');
            rp.cells = cb.join('');
            rp.tstyle = tstyle;
            buf[buf.length] = rt.apply(rp);
            rp.cells = lcb.join('');
            rp.tstyle = lstyle;
            lbuf[lbuf.length] = rt.apply(rp);
        }
        return [buf.join(''), lbuf.join('')];
    },
    processRows: function (startRow, skipStripe) {
        if (!this.ds || this.ds.getCount() < 1) {
            return;
        }
        var rows = this.getRows(),
            lrows = this.getLockedRows(),
            row, lrow;
        skipStripe = skipStripe || !this.grid.stripeRows;
        startRow = startRow || 0;
        for (var i = 0, len = rows.length; i < len; ++i) {
            row = rows[i];
            lrow = lrows[i];
            row.rowIndex = i;
            lrow.rowIndex = i;
            if (!skipStripe) {
                row.className = row.className.replace(this.rowClsRe, ' ');
                lrow.className = lrow.className.replace(this.rowClsRe, ' ');
                if ((i + 1) % 2 === 0) {
                    row.className += ' x-grid3-row-alt';
                    lrow.className += ' x-grid3-row-alt';
                }
            }
            this.syncRowHeights(row, lrow);
        }
        if (startRow === 0) {
            Ext.fly(rows[0]).addClass(this.firstRowCls);
            Ext.fly(lrows[0]).addClass(this.firstRowCls);
        }
        Ext.fly(rows[rows.length - 1]).addClass(this.lastRowCls);
        Ext.fly(lrows[lrows.length - 1]).addClass(this.lastRowCls);
    },
    syncRowHeights: function (row1, row2) {
        if (this.syncHeights) {
            var el1 = Ext.get(row1),
                el2 = Ext.get(row2),
                h1 = el1.getHeight(),
                h2 = el2.getHeight();

            if (h1 > h2) {
                el2.setHeight(h1);
            } else if (h2 > h1) {
                el1.setHeight(h2);
            }
        }
    },
    afterRender: function () {
        if (!this.ds || !this.cm) {
            return;
        }
        var bd = this.renderRows() || ['&#160;', '&#160;'];
        this.mainBody.dom.innerHTML = bd[0];
        this.lockedBody.dom.innerHTML = bd[1];
        this.processRows(0, true);
        if (this.deferEmptyText !== true) {
            this.applyEmptyText();
        }
        this.grid.fireEvent('viewready', this.grid);
    },
    renderUI: function () {
        var templates = this.templates,
            header = this.renderHeaders(),
            body = templates.body.apply({rows: '&#160;'});

        return templates.masterTpl.apply({
            body: body,
            header: header[0],
            ostyle: 'width:' + this.getOffsetWidth() + ';',
            bstyle: 'width:' + this.getTotalWidth() + ';',
            lockedBody: body,
            lockedHeader: header[1],
            lstyle: 'width:' + this.getLockedWidth() + ';'
        });
    },
    afterRenderUI: function () {
        var g = this.grid;
        this.initElements();
        Ext.fly(this.innerHd).on('click', this.handleHdDown, this);
        Ext.fly(this.lockedInnerHd).on('click', this.handleHdDown, this);
        this.mainHd.on({
            scope: this,
            mouseover: this.handleHdOver,
            mouseout: this.handleHdOut,
            mousemove: this.handleHdMove
        });
        this.lockedHd.on({
            scope: this,
            mouseover: this.handleHdOver,
            mouseout: this.handleHdOut,
            mousemove: this.handleHdMove
        });
        this.scroller.on('scroll', this.syncScroll, this);
        if (g.enableColumnResize !== false) {
            this.splitZone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
            this.splitZone.setOuterHandleElId(Ext.id(this.lockedHd.dom));
            this.splitZone.setOuterHandleElId(Ext.id(this.mainHd.dom));
        }
        if (g.enableColumnMove) {
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
            this.columnDrag.setOuterHandleElId(Ext.id(this.lockedInnerHd));
            this.columnDrag.setOuterHandleElId(Ext.id(this.innerHd));
            this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
        }
        if (g.enableHdMenu !== false) {
            this.hmenu = new Ext.menu.Menu({id: g.id + '-hctx'});
            this.hmenu.add(
                {itemId: 'asc', text: this.sortAscText, cls: 'xg-hmenu-sort-asc'},
                {itemId: 'desc', text: this.sortDescText, cls: 'xg-hmenu-sort-desc'}
            );
            if (this.grid.enableColLock !== false) {
                this.hmenu.add('-',
                    {itemId: 'lock', text: this.lockText, cls: 'xg-hmenu-lock'},
                    {itemId: 'unlock', text: this.unlockText, cls: 'xg-hmenu-unlock'}
                );
            }
            if (g.enableColumnHide !== false) {
                this.colMenu = new Ext.menu.Menu({id: g.id + '-hcols-menu'});
                this.colMenu.on({
                    scope: this,
                    beforeshow: this.beforeColMenuShow,
                    itemclick: this.handleHdMenuClick
                });
                this.hmenu.add('-', {
                    itemId: 'columns',
                    hideOnClick: false,
                    text: this.columnsText,
                    menu: this.colMenu,
                    iconCls: 'x-cols-icon'
                });
            }
            this.hmenu.on('itemclick', this.handleHdMenuClick, this);
        }
        if (g.trackMouseOver) {
            this.mainBody.on({
                scope: this,
                mouseover: this.onRowOver,
                mouseout: this.onRowOut
            });
            this.lockedBody.on({
                scope: this,
                mouseover: this.onRowOver,
                mouseout: this.onRowOut
            });
        }

        if (g.enableDragDrop || g.enableDrag) {
            this.dragZone = new Ext.grid.GridDragZone(g, {
                ddGroup: g.ddGroup || 'GridDD'
            });
        }
        this.updateHeaderSortState();
    },
    layout: function () {
        if (!this.mainBody) {
            return;
        }
        var g = this.grid;
        var c = g.getGridEl();
        var csize = c.getSize(true);
        var vw = csize.width;
        if (!g.hideHeaders && (vw < 20 || csize.height < 20)) {
            return;
        }
        this.syncHeaderHeight();
        if (g.autoHeight) {
            this.scroller.dom.style.overflow = 'visible';
            this.lockedScroller.dom.style.overflow = 'visible';
            if (Ext.isWebKit) {
                this.scroller.dom.style.position = 'static';
                this.lockedScroller.dom.style.position = 'static';
            }
        } else {
            this.el.setSize(csize.width, csize.height);
            var hdHeight = this.mainHd.getHeight();
            var vh = csize.height - (hdHeight);
        }
        this.updateLockedWidth();
        if (this.forceFit) {
            if (this.lastViewWidth != vw) {
                this.fitColumns(false, false);
                this.lastViewWidth = vw;
            }
        } else {
            this.autoExpand();
            this.syncHeaderScroll();
        }
        this.onLayout(vw, vh);
    },
    getOffsetWidth: function () {
        return (this.cm.getTotalWidth() - this.cm.getTotalLockedWidth() + this.getScrollOffset()) + 'px';
    },
    renderHeaders: function () {
        var cm = this.cm,
            ts = this.templates,
            ct = ts.hcell,
            cb = [], lcb = [],
            p = {},
            len = cm.getColumnCount(),
            last = len - 1;
        for (var i = 0; i < len; i++) {
            p.id = cm.getColumnId(i);
            p.value = cm.getColumnHeader(i) || '';
            p.style = this.getColumnStyle(i, true);
            p.tooltip = this.getColumnTooltip(i);
            p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) +
                (cm.config[i].headerCls ? ' ' + cm.config[i].headerCls : '');
            if (cm.config[i].align == 'right') {
                p.istyle = 'padding-right:16px';
            } else {
                delete p.istyle;
            }
            if (cm.isLocked(i)) {
                lcb[lcb.length] = ct.apply(p);
            } else {
                cb[cb.length] = ct.apply(p);
            }
        }
        return [ts.header.apply({cells: cb.join(''), tstyle: 'width:' + this.getTotalWidth() + ';'}),
            ts.header.apply({cells: lcb.join(''), tstyle: 'width:' + this.getLockedWidth() + ';'})];
    },
    updateHeaders: function () {
        var hd = this.renderHeaders();
        this.innerHd.firstChild.innerHTML = hd[0];
        this.innerHd.firstChild.style.width = this.getOffsetWidth();
        this.innerHd.firstChild.firstChild.style.width = this.getTotalWidth();
        this.lockedInnerHd.firstChild.innerHTML = hd[1];
        var lw = this.getLockedWidth();
        this.lockedInnerHd.firstChild.style.width = lw;
        this.lockedInnerHd.firstChild.firstChild.style.width = lw;
    },
    getResolvedXY: function (resolved) {
        if (!resolved) {
            return null;
        }
        var c = resolved.cell, r = resolved.row;
        return c ? Ext.fly(c).getXY() : [this.scroller.getX(), Ext.fly(r).getY()];
    },
    syncFocusEl: function (row, col, hscroll) {
        Ext.ux.grid.LockingGridView.superclass.syncFocusEl.call(this, row, col, col < this.cm.getLockedCount() ? false : hscroll);
    },
    ensureVisible: function (row, col, hscroll) {
        return Ext.ux.grid.LockingGridView.superclass.ensureVisible.call(this, row, col, col < this.cm.getLockedCount() ? false : hscroll);
    },
    insertRows: function (dm, firstRow, lastRow, isUpdate) {
        var last = dm.getCount() - 1;
        if (!isUpdate && firstRow === 0 && lastRow >= last) {
            this.refresh();
        } else {
            if (!isUpdate) {
                this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
            }
            var html = this.renderRows(firstRow, lastRow),
                before = this.getRow(firstRow);
            if (before) {
                if (firstRow === 0) {
                    this.removeRowClass(0, this.firstRowCls);
                }
                Ext.DomHelper.insertHtml('beforeBegin', before, html[0]);
                before = this.getLockedRow(firstRow);
                Ext.DomHelper.insertHtml('beforeBegin', before, html[1]);
            } else {
                this.removeRowClass(last - 1, this.lastRowCls);
                Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html[0]);
                Ext.DomHelper.insertHtml('beforeEnd', this.lockedBody.dom, html[1]);
            }
            if (!isUpdate) {
                this.fireEvent('rowsinserted', this, firstRow, lastRow);
                this.processRows(firstRow);
            } else if (firstRow === 0 || firstRow >= last) {
                this.addRowClass(firstRow, firstRow === 0 ? this.firstRowCls : this.lastRowCls);
            }
        }
        this.syncFocusEl(firstRow);
    },
    getColumnStyle: function (col, isHeader) {
        var style = !isHeader ? this.cm.config[col].cellStyle || this.cm.config[col].css || '' : this.cm.config[col].headerStyle || '';
        style += 'width:' + this.getColumnWidth(col) + ';';
        if (this.cm.isHidden(col)) {
            style += 'display:none;';
        }
        var align = this.cm.config[col].align;
        if (align) {
            style += 'text-align:' + align + ';';
        }
        return style;
    },
    getLockedWidth: function () {
        return this.cm.getTotalLockedWidth() + 'px';
    },
    getTotalWidth: function () {
        return (this.cm.getTotalWidth() - this.cm.getTotalLockedWidth()) + 'px';
    },
    getColumnData: function () {
        var cs = [], cm = this.cm, colCount = cm.getColumnCount();
        for (var i = 0; i < colCount; i++) {
            var name = cm.getDataIndex(i);
            cs[i] = {
                name: (!Ext.isDefined(name) ? this.ds.fields.get(i).name : name),
                renderer: cm.getRenderer(i),
                scope: cm.getRendererScope(i),
                id: cm.getColumnId(i),
                style: this.getColumnStyle(i),
                locked: cm.isLocked(i)
            };
        }
        return cs;
    },
    renderBody: function () {
        var markup = this.renderRows() || ['&#160;', '&#160;'];
        return [this.templates.body.apply({rows: markup[0]}), this.templates.body.apply({rows: markup[1]})];
    },
    refreshRow: function (record) {
        var store = this.ds,
            colCount = this.cm.getColumnCount(),
            columns = this.getColumnData(),
            last = colCount - 1,
            cls = ['x-grid3-row'],
            rowParams = {
                tstyle: String.format("width: {0};", this.getTotalWidth())
            },
            lockedRowParams = {
                tstyle: String.format("width: {0};", this.getLockedWidth())
            },
            colBuffer = [],
            lockedColBuffer = [],
            cellTpl = this.templates.cell,
            rowIndex,
            row,
            lockedRow,
            column,
            meta,
            css,
            i;

        if (Ext.isNumber(record)) {
            rowIndex = record;
            record = store.getAt(rowIndex);
        } else {
            rowIndex = store.indexOf(record);
        }

        if (!record || rowIndex < 0) {
            return;
        }

        for (i = 0; i < colCount; i++) {
            column = columns[i];

            if (i == 0) {
                css = 'x-grid3-cell-first';
            } else {
                css = (i == last) ? 'x-grid3-cell-last ' : '';
            }

            meta = {
                id: column.id,
                style: column.style,
                css: css,
                attr: "",
                cellAttr: ""
            };

            meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);

            if (Ext.isEmpty(meta.value)) {
                meta.value = ' ';
            }

            if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                meta.css += ' x-grid3-dirty-cell';
            }

            if (column.locked) {
                lockedColBuffer[i] = cellTpl.apply(meta);
            } else {
                colBuffer[i] = cellTpl.apply(meta);
            }
        }

        row = this.getRow(rowIndex);
        row.className = '';
        lockedRow = this.getLockedRow(rowIndex);
        lockedRow.className = '';

        if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0)) {
            cls.push('x-grid3-row-alt');
        }

        if (this.getRowClass) {
            rowParams.cols = colCount;
            cls.push(this.getRowClass(record, rowIndex, rowParams, store));
        }

        // Unlocked rows
        this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
        rowParams.cells = colBuffer.join("");
        row.innerHTML = this.templates.rowInner.apply(rowParams);

        // Locked rows
        this.fly(lockedRow).addClass(cls).setStyle(lockedRowParams.tstyle);
        lockedRowParams.cells = lockedColBuffer.join("");
        lockedRow.innerHTML = this.templates.rowInner.apply(lockedRowParams);
        lockedRow.rowIndex = rowIndex;
        this.syncRowHeights(row, lockedRow);
        this.fireEvent('rowupdated', this, rowIndex, record);
    },
    refresh: function (headersToo) {
        this.fireEvent('beforerefresh', this);
        this.grid.stopEditing(true);
        var result = this.renderBody();
        this.mainBody.update(result[0]).setWidth(this.getTotalWidth());
        this.lockedBody.update(result[1]).setWidth(this.getLockedWidth());
        if (headersToo === true) {
            this.updateHeaders();
            this.updateHeaderSortState();
        }
        this.processRows(0, true);
        this.layout();
        this.applyEmptyText();
        this.fireEvent('refresh', this);
    },
    onDenyColumnLock: function () {

    },
    initData: function (ds, cm) {
        if (this.cm) {
            this.cm.un('columnlockchange', this.onColumnLock, this);
        }
        Ext.ux.grid.LockingGridView.superclass.initData.call(this, ds, cm);
        if (this.cm) {
            this.cm.on('columnlockchange', this.onColumnLock, this);
        }
    },
    onColumnLock: function () {
        this.refresh(true);
    },
    handleHdMenuClick: function (item) {
        var index = this.hdCtxIndex,
            cm = this.cm,
            id = item.getItemId(),
            llen = cm.getLockedCount();
        switch (id) {
            case 'lock':
                if (cm.getColumnCount(true) <= llen + 1) {
                    this.onDenyColumnLock();
                    return undefined;
                }
                cm.setLocked(index, true, llen != index);
                if (llen != index) {
                    cm.moveColumn(index, llen);
                    this.grid.fireEvent('columnmove', index, llen);
                }
                break;
            case 'unlock':
                if (llen - 1 != index) {
                    cm.setLocked(index, false, true);
                    cm.moveColumn(index, llen - 1);
                    this.grid.fireEvent('columnmove', index, llen - 1);
                } else {
                    cm.setLocked(index, false);
                }
                break;
            default:
                return Ext.ux.grid.LockingGridView.superclass.handleHdMenuClick.call(this, item);
        }
        return true;
    },
    handleHdDown: function (e, t) {
        Ext.ux.grid.LockingGridView.superclass.handleHdDown.call(this, e, t);
        if (this.grid.enableColLock !== false) {
            if (Ext.fly(t).hasClass('x-grid3-hd-btn')) {
                var hd = this.findHeaderCell(t),
                    index = this.getCellIndex(hd),
                    ms = this.hmenu.items, cm = this.cm;
                ms.get('lock').setDisabled(cm.isLocked(index));
                ms.get('unlock').setDisabled(!cm.isLocked(index));
            }
        }
    },
    syncHeaderHeight: function () {
        var hrow = Ext.fly(this.innerHd).child('tr', true),
            lhrow = Ext.fly(this.lockedInnerHd).child('tr', true);

        hrow.style.height = 'auto';
        lhrow.style.height = 'auto';
        var hd = hrow.offsetHeight,
            lhd = lhrow.offsetHeight,
            height = Math.max(lhd, hd) + 'px';

        hrow.style.height = height;
        lhrow.style.height = height;

    },
    updateLockedWidth: function () {
        var lw = this.cm.getTotalLockedWidth(),
            tw = this.cm.getTotalWidth() - lw,
            csize = this.grid.getGridEl().getSize(true),
            lp = Ext.isBorderBox ? 0 : this.lockedBorderWidth,
            rp = Ext.isBorderBox ? 0 : this.rowBorderWidth,
            vw = Math.max(csize.width - lw - lp - rp, 0) + 'px',
            so = this.getScrollOffset();
        if (!this.grid.autoHeight) {
            var vh = Math.max(csize.height - this.mainHd.getHeight(), 0) + 'px';
            this.lockedScroller.dom.style.height = vh;
            this.scroller.dom.style.height = vh;
        }
        this.lockedWrap.dom.style.width = (lw + rp) + 'px';
        this.scroller.dom.style.width = vw;
        this.mainWrap.dom.style.left = (lw + lp + rp) + 'px';
        if (this.innerHd) {
            this.lockedInnerHd.firstChild.style.width = lw + 'px';
            this.lockedInnerHd.firstChild.firstChild.style.width = lw + 'px';
            this.innerHd.style.width = vw;
            this.innerHd.firstChild.style.width = (tw + rp + so) + 'px';
            this.innerHd.firstChild.firstChild.style.width = tw + 'px';
        }
        if (this.mainBody) {
            this.lockedBody.dom.style.width = (lw + rp) + 'px';
            this.mainBody.dom.style.width = (tw + rp) + 'px';
        }
    }
});

Ext.ux.grid.LockingColumnModel = Ext.extend(Ext.grid.ColumnModel, {
    /**
     * Returns true if the given column index is currently locked
     * @param {Number} colIndex The column index
     * @return {Boolean} True if the column is locked
     */
    isLocked: function (colIndex) {
        return this.config[colIndex].locked === true;
    },
    /**
     * Locks or unlocks a given column
     * @param {Number} colIndex The column index
     * @param {Boolean} value True to lock, false to unlock
     * @param {Boolean} suppressEvent Pass false to cause the columnlockchange event not to fire
     */
    setLocked: function (colIndex, value, suppressEvent) {
        if (this.isLocked(colIndex) == value) {
            return;
        }
        this.config[colIndex].locked = value;
        if (!suppressEvent) {
            this.fireEvent('columnlockchange', this, colIndex, value);
        }
    },
    /**
     * Returns the total width of all locked columns
     * @return {Number} The width of all locked columns
     */
    getTotalLockedWidth: function () {
        var totalWidth = 0;
        for (var i = 0, len = this.config.length; i < len; i++) {
            if (this.isLocked(i) && !this.isHidden(i)) {
                totalWidth += this.getColumnWidth(i);
            }
        }

        return totalWidth;
    },
    /**
     * Returns the total number of locked columns
     * @return {Number} The number of locked columns
     */
    getLockedCount: function () {
        var len = this.config.length;

        for (var i = 0; i < len; i++) {
            if (!this.isLocked(i)) {
                return i;
            }
        }

        //if we get to this point all of the columns are locked so we return the total
        return len;
    },
    /**
     * Moves a column from one position to another
     * @param {Number} oldIndex The current column index
     * @param {Number} newIndex The destination column index
     */
    moveColumn: function (oldIndex, newIndex) {
        var oldLocked = this.isLocked(oldIndex),
            newLocked = this.isLocked(newIndex);

        if (oldIndex < newIndex && oldLocked && !newLocked) {
            this.setLocked(oldIndex, false, true);
        } else if (oldIndex > newIndex && !oldLocked && newLocked) {
            this.setLocked(oldIndex, true, true);
        }

        Ext.ux.grid.LockingColumnModel.superclass.moveColumn.apply(this, arguments);
    }
});

Ext.ns('LOG.grid');

LOG.grid.CheckColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

LOG.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.addEvents('checkcolumn');
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.dataIndex = this.dataIndex;
            record.set(this.dataIndex, record.data[this.dataIndex] == 0 ? true : false);
			if (!this.grid.getSelectionModel().isSelected(index)) {
                this.grid.getSelectionModel().selectRow(index);
            }			
            this.grid.fireEvent('checkcolumn', record);
            return record;
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v == 1 ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};

Ext.grid.CheckColumn = LOG.grid.CheckColumn;/*Manteniendo la compatibilidad hacia atras*/

/*********************************************
 * Sobreescribiendo los componentes de extjs
 *********************************************/
Ext.override(Ext.PagingToolbar, {
    initComponent: Ext.PagingToolbar.prototype.initComponent.createInterceptor(function () {
        this.displayMsg = this.special ? this.displayMsg : LOG.util.Idioma.msgResultados;
        this.emptyMsg = this.special ? this.emptyMsg : LOG.util.Idioma.msgNoMostrarResultados;
    })
});
Ext.Ajax.handleResponse = function (response) {
    this.transId = false;
    var options = response.argument.options;
    response.argument = options ? options.argument : null;
    if (options.success) {
        options.success.call(options.scope, response, options);
    }
    if (options.callback) {
        options.callback.call(options.scope, options, true, response);
    }
    this.fireEvent("requestcomplete", this, response, options);
}
Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        if (val) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = typeof field.startDateField == 'object' ? field.startDateField : Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                if (start.getValue()) {
                    var dateIni = field.parseDate(start.getValue());
                    field.setMinValue(dateIni);
                }
                this.dateRangeMax = date;
                start.validate();
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = typeof field.endDateField == 'object' ? field.endDateField : Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                if (end.getValue()) {
                    var dateFin = field.parseDate(end.getValue());
                    field.setMaxValue(dateFin);
                }
                this.dateRangeMin = date;
                end.validate();
            }
            return true;
        }
    }
});
/**
 *
 */
Ext.override(Ext.Button, {
    initComponent: Ext.Button.prototype.initComponent.createInterceptor(function () {
        if (this.seguridad) {
            this.hidden = true;
        }

        if (typeof this.setTooltip == 'function') {
            LOG.util.UIManager.encadenaFn(this, 'setTooltip', function (t) {
                this.tooltip = t;
            });
        } else {
            this.setTooltip = function (t) {
                this.tooltip = t;
            };
        }
    }),
    getPosition: function (local) {
        var el = this.getPositionEl();
        if (local === true) {
            return [el.getLeft(true), el.getTop(true)];
        }
        return this.xy || el.getXY();
    },
    getPositionEl: function () {
        return this.positionEl || this.el;
    },
});
Ext.override(Ext.data.Store, {
    initBaseParams: {}
});
/**
 *
 */
Ext.override(Ext.form.FormPanel,{
    initComponent: Ext.form.FormPanel.prototype.initComponent.createSequence(function () {
        this.tabManaged = false;
        this.tabIterator = new LOG.util.TabIterator();
    }),
    getIterator: function () {
        return this.tabIterator;
    },
    setIterator: function (it) {
        this.tabIterator = it;
    }/*,
    render: Ext.form.FormPanel.prototype.render.createSequence(function () {
        var basicForm = this.getForm();
        var flag = false, _this = this;
        basicForm.items.each(function (f) {
            //f.isVisible()
            if (!f.disabled && flag == false) {
                f.on('render', function () {
                    f.focus(false, 200);
                });
                flag = true;
            }
            if (_this.tabManaged == false) {
                _this.tabIterator.add(f);
                LOG.util.UIManager.encadenaFn(f, 'fireEvent', function (e) {
                    if (e == 'focus') {
                        _this.tabIterator.focus(f);
                    }
                });
            }
        });
        _this.tabIterator.order();
        var mapCmp = this.mapCmp || this;
        if (_this.tabManaged == false) {
            if (typeof this.findParentWindow == 'function' && this.findParentWindow(this) != null) {
                Ext.each(this.findParentWindow(this).buttons, function (b) {
                    _this.tabIterator.add(b);
                });
                mapCmp = this.findParentWindow(this);
            }
        }
        this.tabManaged = true;
        mapCmp.getKeyMap().addBinding({
            key: '\t',
            shift: false,
            ctrl: false,
            fn: function () {
                _this.tabIterator.next();
            }
        });
        mapCmp.getKeyMap().addBinding({
            key: '\t',
            shift: true,
            ctrl: false,
            fn: function () {
                _this.tabIterator.previous();
            }
        });
    })*/
});
/**
 *
 */
Ext.override(Ext.BoxComponent, {
    render: Ext.BoxComponent.prototype.render.createInterceptor(function () {
        if (LOG.util.UIManager.isTabulable(this)) {
            LOG.util.TabController.push(this);
            LOG.util.tabcontroller.add(this);
            LOG.util.tabcontroller.order();
        }
    })
});
/**
 *
 */
Ext.override(Ext.form.NumberField, {
    initComponent: Ext.BoxComponent.prototype.initComponent.createInterceptor(function () {
        this.maxLengthText = (this.maxLength == 1) ? this.maxLengthText1Digit : this.maxLengthText;
    })
});

/*Ext.override(Ext.grid.RowSelectionModel, {
 seleccion : undefined,
 constructor: Ext.grid.RowSelectionModel.prototype.constructor.createInterceptor(function(config) {
 var _this = this;
 this.seleccion = new LOG.util.List();
 if (this.singleSelect !== true) {
 LOG.util.UIManager.encadenaFn(this, 'selectRow', function(index) {
 var r = _this.grid.store.getAt(index);
 var pos = _this.seleccion.getPosByField('id', r.id);
 if (pos == -1) {
 _this.seleccion.add(r);
 }
 });
 LOG.util.UIManager.encadenaFn(this, 'deselectRow', function(index) {
 var r = _this.grid.store.getAt(index);
 var pos = _this.seleccion.getPosByField('id', r.id);
 if (pos != -1) {
 _this.seleccion.delete(pos);
 }
 });
 this.getSelections = function() {
 if (this.singleSelect !== true) {
 return this.seleccion.getArray();
 } else {
 return Ext.grid.RowSelectionModel.prototype.getSelections();
 }
 };
 this.hasSelection = function() {
 if (this.singleSelect !== true) {
 return this.seleccion.count() > 0;
 } else {
 return Ext.grid.RowSelectionModel.prototype.hasSelection();
 }
 };
 }
 })

 });*/
/*******************************************
 * Sobreescribiendo los componentes de extjs
 *******************************************/
Ext.override(Ext.PagingToolbar, {
    bindRenderListener: function () {
    }
});


/**
 * @class Ext.ux.grid.RowActions
 * @extends Ext.util.Observable
 * A GridPanel plugin that enables dynamic column calculations and a dynamically
 * updated grouped summary row.
 */

Ext.ns('Ext.ux.grid');

Ext.ux.grid.GroupSummary = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Function} summaryRenderer Renderer example:<pre><code>
     summaryRenderer: function(v, params, data){
	    return ((v === 0 || v > 1) ? '(' + v +' Tasks)' : '(1 Task)');
	},
     * </code></pre>
     */
    /**
     * @cfg {String} summaryType (Optional) The type of
     * calculation to be used for the column.  For options available see
     * {Example #Calculations}.
     */
    summaryType: undefined,
    constructor: function (config) {
        Ext.apply(this, config);
        Ext.ux.grid.GroupSummary.superclass.constructor.call(this);
    },
    init: function (grid) {
        this.grid = grid;
        var v = this.view = grid.getView();
        v.doGroupEnd = this.doGroupEnd.createDelegate(this);

        v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
        v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
        v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
        v.afterMethod('onUpdate', this.doUpdate, this);
        v.afterMethod('onRemove', this.doRemove, this);

        if (!this.rowTpl) {
            this.rowTpl = new Ext.Template(
                '<div class="x-grid3-summary-row" style="{tstyle}">',
                '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                '<tbody><tr>{cells}</tr></tbody>',
                '</table></div>'
            );
            this.rowTpl.disableFormats = true;
        }
        this.rowTpl.compile();

        if (!this.cellTpl) {
            this.cellTpl = new Ext.Template(
                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
                "</td>"
            );
            this.cellTpl.disableFormats = true;
        }
        this.cellTpl.compile();
    },

    /**
     * Toggle the display of the summary row on/off
     * @param {Boolean} visible <tt>true</tt> to show the summary, <tt>false</tt> to hide the summary.
     */
    toggleSummaries: function (visible) {
        var el = this.grid.getGridEl();
        if (el) {
            if (visible === undefined) {
                visible = el.hasClass('x-grid-hide-summary');
            }
            el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
        }
    },

    renderSummary: function (o, cs) {
        cs = cs || this.view.getColumnData();
        var cfg = this.grid.getColumnModel().config,
            buf = [], c, p = {}, cf, last = cs.length - 1;
        for (var i = 0, len = cs.length; i < len; i++) {
            c = cs[i];
            cf = cfg[i];
            p.id = c.id;
            p.style = c.style;
            p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            if (cf.summaryType || cf.summaryRenderer) {
                p.value = (cf.summaryRenderer || c.renderer)(o.data[c.name], p, o);
            } else {
                p.value = '';
            }
            if (p.value == undefined || p.value === "") p.value = "&#160;";
            buf[buf.length] = this.cellTpl.apply(p);
        }

        return this.rowTpl.apply({
            tstyle: 'width:' + this.view.getTotalWidth() + ';',
            cells: buf.join('')
        });
    },

    /**
     * @private
     * @param {Object} rs
     * @param {Object} cs
     */
    calculate: function (rs, cs) {
        var data = {}, r, c, cfg = this.grid.getColumnModel().config, cf;
        for (var j = 0, jlen = rs.length; j < jlen; j++) {
            r = rs[j];
            for (var i = 0, len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                if (cf.summaryType) {
                    data[c.name] = Ext.ux.grid.GroupSummary.Calculations[cf.summaryType](data[c.name] || 0, r, c.name, data);
                }
            }
        }
        return data;
    },

    doGroupEnd: function (buf, g, cs, ds, colCount) {
        var data = this.calculate(g.rs, cs);
        buf.push('</div>', this.renderSummary({data: data}, cs), '</div>');
    },

    doWidth: function (col, w, tw) {
        if (!this.isGrouped()) {
            return;
        }
        var gs = this.view.getGroups(),
            len = gs.length,
            i = 0,
            s;
        for (; i < len; ++i) {
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.width = w;
        }
    },

    doAllWidths: function (ws, tw) {
        if (!this.isGrouped()) {
            return;
        }
        var gs = this.view.getGroups(),
            len = gs.length,
            i = 0,
            j,
            s,
            cells,
            wlen = ws.length;

        for (; i < len; i++) {
            console.info(gs[i].childNodes);
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for (j = 0; j < wlen; j++) {
                cells[j].style.width = ws[j];
            }
        }
    },

    doHidden: function (col, hidden, tw) {
        if (this.isGrouped()) {
            return;
        }
        var gs = this.view.getGroups(),
            len = gs.length,
            i = 0,
            s,
            display = hidden ? 'none' : '';
        for (; i < len; i++) {
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        }
    },

    isGrouped: function () {
        return !Ext.isEmpty(this.grid.getStore().groupField);
    },

    // Note: requires that all (or the first) record in the
    // group share the same group value. Returns false if the group
    // could not be found.
    refreshSummary: function (groupValue) {
        return this.refreshSummaryById(this.view.getGroupId(groupValue));
    },

    getSummaryNode: function (gid) {
        var g = Ext.fly(gid, '_gsummary');
        if (g) {
            return g.down('.x-grid3-summary-row', true);
        }
        return null;
    },

    refreshSummaryById: function (gid) {
        var g = Ext.getDom(gid);
        if (!g) {
            return false;
        }
        var rs = [];
        this.grid.getStore().each(function (r) {
            if (r._groupId == gid) {
                rs[rs.length] = r;
            }
        });
        var cs = this.view.getColumnData(),
            data = this.calculate(rs, cs),
            markup = this.renderSummary({data: data}, cs),
            existing = this.getSummaryNode(gid);

        if (existing) {
            g.removeChild(existing);
        }
        Ext.DomHelper.append(g, markup);
        return true;
    },

    doUpdate: function (ds, record) {
        this.refreshSummaryById(record._groupId);
    },

    doRemove: function (ds, record, index, isUpdate) {
        if (!isUpdate) {
            this.refreshSummaryById(record._groupId);
        }
    },
    /**
     * Show a message in the summary row.
     * <pre><code>
     grid.on('afteredit', function(){
	    var groupValue = 'Ext Forms: Field Anchoring';
	    summary.showSummaryMsg(groupValue, 'Updating Summary...');
	});
     * </code></pre>
     * @param {String} groupValue
     * @param {String} msg Text to use as innerHTML for the summary row.
     */
    showSummaryMsg: function (groupValue, msg) {
        var gid = this.view.getGroupId(groupValue),
            node = this.getSummaryNode(gid);
        if (node) {
            node.innerHTML = '<div class="x-grid3-summary-msg">' + msg + '</div>';
        }
    }
});

//backwards compat
Ext.grid.GroupSummary = Ext.ux.grid.GroupSummary;

/**
 * Calculation types for summary row:</p><div class="mdetail-params"><ul>
 * <li><b><tt>sum</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>count</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>max</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>min</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>average</tt></b> : <div class="sub-desc"></div></li>
 * </ul></div>
 * <p>Custom calculations may be implemented.  An example of
 * custom <code>summaryType=totalCost</code>:</p><pre><code>
 // define a custom summary function
 Ext.ux.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field){
	    return v + (record.data.estimate * record.data.rate);
};
 * </code></pre>
 * @property Calculations
 */

Ext.ux.grid.GroupSummary.Calculations = {
    'sum': function (v, record, field) {
        return v + (record.data[field] || 0);
    },

    'count': function (v, record, field, data) {
        return data[field + 'count'] ? ++data[field + 'count'] : (data[field + 'count'] = 1);
    },

    'max': function (v, record, field, data) {
        var v = record.data[field];
        var max = data[field + 'max'] === undefined ? (data[field + 'max'] = v) : data[field + 'max'];
        return v > max ? (data[field + 'max'] = v) : max;
    },

    'min': function (v, record, field, data) {
        var v = record.data[field];
        var min = data[field + 'min'] === undefined ? (data[field + 'min'] = v) : data[field + 'min'];
        return v < min ? (data[field + 'min'] = v) : min;
    },

    'average': function (v, record, field, data) {
        var c = data[field + 'count'] ? ++data[field + 'count'] : (data[field + 'count'] = 1);
        var t = (data[field + 'total'] = ((data[field + 'total'] || 0) + (record.data[field] || 0)));
        return t === 0 ? 0 : t / c;
    }
};
Ext.grid.GroupSummary.Calculations = Ext.ux.grid.GroupSummary.Calculations;

/**
 * @class Ext.ux.grid.HybridSummary
 * @extends Ext.ux.grid.GroupSummary
 * Adds capability to specify the summary data for the group via json as illustrated here:
 * <pre><code>
 {
    data: [
        {
        projectId: 100,     project: 'House',
            taskId:    112, description: 'Paint',
        estimate:    6,        rate:     150,
        due:'06/24/2007'
        },
        ...
    ],

    summaryData: {
    'House': {
            description: 14, estimate: 9,
                   rate: 99, due: new Date(2009, 6, 29),
                   cost: 999
    }
    }
}
 * </code></pre>
 *
 */
Ext.ux.grid.HybridSummary = Ext.extend(Ext.ux.grid.GroupSummary, {
    /**
     * @private
     * @param {Object} rs
     * @param {Object} cs
     */
    calculate: function (rs, cs) {
        var gcol = this.view.getGroupField(),
            gvalue = rs[0].data[gcol],
            gdata = this.getSummaryData(gvalue);
        return gdata || Ext.ux.grid.HybridSummary.superclass.calculate.call(this, rs, cs);
    },

    /**
     * <pre><code>
     grid.on('afteredit', function(){
	    var groupValue = 'Ext Forms: Field Anchoring';
    summary.showSummaryMsg(groupValue, 'Updating Summary...');
    setTimeout(function(){ // simulate server call
	        // HybridSummary class implements updateSummaryData
	        summary.updateSummaryData(groupValue,
	            // create data object based on configured dataIndex
	            {description: 22, estimate: 888, rate: 888, due: new Date(), cost: 8});
	    }, 2000);
	});
     * </code></pre>
     * @param {String} groupValue
     * @param {Object} data data object
     * @param {Boolean} skipRefresh (Optional) Defaults to false
     */
    updateSummaryData: function (groupValue, data, skipRefresh) {
        var json = this.grid.getStore().reader.jsonData;
        if (!json.summaryData) {
            json.summaryData = {};
        }
        json.summaryData[groupValue] = data;
        if (!skipRefresh) {
            this.refreshSummary(groupValue);
        }
    },

    /**
     * Returns the summaryData for the specified groupValue or null.
     * @param {String} groupValue
     * @return {Object} summaryData
     */
    getSummaryData: function (groupValue) {
        var reader = this.grid.getStore().reader,
            json = reader.jsonData,
            fields = reader.recordType.prototype.fields,
            v;

        if (json && json.summaryData) {
            v = json.summaryData[groupValue];
            if (v) {
                return reader.extractValues(v, fields.items, fields.length);
            }
        }
        return null;
    }
});

//backwards compat
Ext.grid.HybridSummary = Ext.ux.grid.HybridSummary;

/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.ux.Spinner
 * @extends Ext.util.Observable
 * Creates a Spinner control utilized by Ext.ux.form.SpinnerField
 */
Ext.ux.Spinner = Ext.extend(Ext.util.Observable, {
    incrementValue: 1,
    alternateIncrementValue: 5,
    triggerClass: 'x-form-spinner-trigger',
    splitterClass: 'x-form-spinner-splitter',
    alternateKey: Ext.EventObject.shiftKey,
    defaultValue: 0,
    accelerate: false,

    constructor: function(config){
        Ext.ux.Spinner.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        this.mimicing = false;
    },

    init: function(field){
        this.field = field;

        field.afterMethod('onRender', this.doRender, this);
        field.afterMethod('onEnable', this.doEnable, this);
        field.afterMethod('onDisable', this.doDisable, this);
        field.afterMethod('afterRender', this.doAfterRender, this);
        field.afterMethod('onResize', this.doResize, this);
        field.afterMethod('onFocus', this.doFocus, this);
        field.beforeMethod('onDestroy', this.doDestroy, this);
    },

    doRender: function(ct, position){
        var el = this.el = this.field.getEl();
        var f = this.field;

        if (!f.wrap) {
            f.wrap = this.wrap = el.wrap({
                cls: "x-form-field-wrap"
            });
        }
        else {
            this.wrap = f.wrap.addClass('x-form-field-wrap');
        }

        this.trigger = this.wrap.createChild({
            tag: "img",
            src: Ext.BLANK_IMAGE_URL,
            cls: "x-form-trigger " + this.triggerClass
        });

        if (!f.width) {
            this.wrap.setWidth(el.getWidth() + this.trigger.getWidth());
        }

        this.splitter = this.wrap.createChild({
            tag: 'div',
            cls: this.splitterClass,
            style: 'width:13px; height:2px;'
        });
        this.splitter.setRight((Ext.isIE) ? 1 : 2).setTop(10).show();

        this.proxy = this.trigger.createProxy('', this.splitter, true);
        this.proxy.addClass("x-form-spinner-proxy");
        this.proxy.setStyle('left', '0px');
        this.proxy.setSize(14, 1);
        this.proxy.hide();
        this.dd = new Ext.dd.DDProxy(this.splitter.dom.id, "SpinnerDrag", {
            dragElId: this.proxy.id
        });

        this.initTrigger();
        this.initSpinner();
    },

    doAfterRender: function(){
        var y;
        if (Ext.isIE && this.el.getY() != (y = this.trigger.getY())) {
            this.el.position();
            this.el.setY(y);
        }
    },

    doEnable: function(){
        if (this.wrap) {
            this.disabled = false;
            this.wrap.removeClass(this.field.disabledClass);
        }
    },

    doDisable: function(){
        if (this.wrap) {
            this.disabled = true;
            this.wrap.addClass(this.field.disabledClass);
            this.el.removeClass(this.field.disabledClass);
        }
    },

    doResize: function(w, h){
        if (typeof w == 'number') {
            this.el.setWidth(w - this.trigger.getWidth());
        }
        this.wrap.setWidth(this.el.getWidth() + this.trigger.getWidth());
    },

    doFocus: function(){
        if (!this.mimicing) {
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
                delay: 10
            });
            this.el.on('keydown', this.checkTab, this);
        }
    },

    // private
    checkTab: function(e){
        if (e.getKey() == e.TAB) {
            this.triggerBlur();
        }
    },

    // private
    mimicBlur: function(e){
        if (!this.wrap.contains(e.target) && this.field.validateBlur(e)) {
            this.triggerBlur();
        }
    },

    // private
    triggerBlur: function(){
        this.mimicing = false;
        Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        this.el.un("keydown", this.checkTab, this);
        this.field.beforeBlur();
        this.wrap.removeClass('x-trigger-wrap-focus');
        this.field.onBlur.call(this.field);
    },

    initTrigger: function(){
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

    initSpinner: function(){
        this.field.addEvents({
            'spin': true,
            'spinup': true,
            'spindown': true
        });

        this.keyNav = new Ext.KeyNav(this.el, {
            "up": function(e){
                e.preventDefault();
                this.onSpinUp();
            },

            "down": function(e){
                e.preventDefault();
                this.onSpinDown();
            },

            "pageUp": function(e){
                e.preventDefault();
                this.onSpinUpAlternate();
            },

            "pageDown": function(e){
                e.preventDefault();
                this.onSpinDownAlternate();
            },

            scope: this
        });

        this.repeater = new Ext.util.ClickRepeater(this.trigger, {
            accelerate: this.accelerate
        });
        this.field.mon(this.repeater, "click", this.onTriggerClick, this, {
            preventDefault: true
        });

        this.field.mon(this.trigger, {
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            mousemove: this.onMouseMove,
            mousedown: this.onMouseDown,
            mouseup: this.onMouseUp,
            scope: this,
            preventDefault: true
        });

        this.field.mon(this.wrap, "mousewheel", this.handleMouseWheel, this);

        this.dd.setXConstraint(0, 0, 10)
        this.dd.setYConstraint(1500, 1500, 10);
        this.dd.endDrag = this.endDrag.createDelegate(this);
        this.dd.startDrag = this.startDrag.createDelegate(this);
        this.dd.onDrag = this.onDrag.createDelegate(this);
    },

    onMouseOver: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        this.tmpHoverClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-overup' : 'x-form-spinner-overdown';
        this.trigger.addClass(this.tmpHoverClass);
    },

    //private
    onMouseOut: function(){
        this.trigger.removeClass(this.tmpHoverClass);
    },

    //private
    onMouseMove: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        if (((Ext.EventObject.getPageY() > middle) && this.tmpHoverClass == "x-form-spinner-overup") ||
            ((Ext.EventObject.getPageY() < middle) && this.tmpHoverClass == "x-form-spinner-overdown")) {
        }
    },

    //private
    onMouseDown: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        this.tmpClickClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-clickup' : 'x-form-spinner-clickdown';
        this.trigger.addClass(this.tmpClickClass);
    },

    //private
    onMouseUp: function(){
        this.trigger.removeClass(this.tmpClickClass);
    },

    //private
    onTriggerClick: function(){
        if (this.disabled || this.el.dom.readOnly) {
            return;
        }
        var middle = this.getMiddle();
        var ud = (Ext.EventObject.getPageY() < middle) ? 'Up' : 'Down';
        this['onSpin' + ud]();
    },

    //private
    getMiddle: function(){
        var t = this.trigger.getTop();
        var h = this.trigger.getHeight();
        var middle = t + (h / 2);
        return middle;
    },

    //private
    //checks if control is allowed to spin
    isSpinnable: function(){
        if (this.disabled || this.el.dom.readOnly) {
            Ext.EventObject.preventDefault(); //prevent scrolling when disabled/readonly
            return false;
        }
        return true;
    },

    handleMouseWheel: function(e){
        //disable scrolling when not focused
        if (this.wrap.hasClass('x-trigger-wrap-focus') == false) {
            return;
        }

        var delta = e.getWheelDelta();
        if (delta > 0) {
            this.onSpinUp();
            e.stopEvent();
        }
        else
        if (delta < 0) {
            this.onSpinDown();
            e.stopEvent();
        }
    },

    //private
    startDrag: function(){
        this.proxy.show();
        this._previousY = Ext.fly(this.dd.getDragEl()).getTop();
    },

    //private
    endDrag: function(){
        this.proxy.hide();
    },

    //private
    onDrag: function(){
        if (this.disabled) {
            return;
        }
        var y = Ext.fly(this.dd.getDragEl()).getTop();
        var ud = '';

        if (this._previousY > y) {
            ud = 'Up';
        } //up
        if (this._previousY < y) {
            ud = 'Down';
        } //down
        if (ud != '') {
            this['onSpin' + ud]();
        }

        this._previousY = y;
    },

    //private
    onSpinUp: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        if (Ext.EventObject.shiftKey == true) {
            this.onSpinUpAlternate();
            return;
        }
        else {
            this.spin(false, false);
        }
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spinup", this);
    },

    //private
    onSpinDown: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        if (Ext.EventObject.shiftKey == true) {
            this.onSpinDownAlternate();
            return;
        }
        else {
            this.spin(true, false);
        }
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spindown", this);
    },

    //private
    onSpinUpAlternate: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        this.spin(false, true);
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spinup", this);
    },

    //private
    onSpinDownAlternate: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        this.spin(true, true);
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spindown", this);
    },

    spin: function(down, alternate){
        var v = parseFloat(this.field.getValue());
        var incr = (alternate == true) ? this.alternateIncrementValue : this.incrementValue;
        (down == true) ? v -= incr : v += incr;

        v = (isNaN(v)) ? this.defaultValue : v;
        v = this.fixBoundries(v);
        this.field.setRawValue(v);
    },

    fixBoundries: function(value){
        var v = value;

        if (this.field.minValue != undefined && v < this.field.minValue) {
            v = this.field.minValue;
        }
        if (this.field.maxValue != undefined && v > this.field.maxValue) {
            v = this.field.maxValue;
        }

        return this.fixPrecision(v);
    },

    // private
    fixPrecision: function(value){
        var nan = isNaN(value);
        if (!this.field.allowDecimals || this.field.decimalPrecision == -1 || nan || !value) {
            return nan ? '' : value;
        }
        return parseFloat(parseFloat(value).toFixed(this.field.decimalPrecision));
    },

    doDestroy: function(){
        if (this.trigger) {
            this.trigger.remove();
        }
        if (this.wrap) {
            this.wrap.remove();
            delete this.field.wrap;
        }

        if (this.splitter) {
            this.splitter.remove();
        }

        if (this.dd) {
            this.dd.unreg();
            this.dd = null;
        }

        if (this.proxy) {
            this.proxy.remove();
        }

        if (this.repeater) {
            this.repeater.purgeListeners();
        }
        if (this.mimicing){
            Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        }
    }
});

//backwards compat
Ext.form.Spinner = Ext.ux.Spinner;

/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.ux.Spinner
 * @extends Ext.util.Observable
 * Creates a Spinner control utilized by Ext.ux.form.SpinnerField
 */
Ext.ux.Spinner = Ext.extend(Ext.util.Observable, {
    incrementValue: 1,
    alternateIncrementValue: 5,
    triggerClass: 'x-form-spinner-trigger',
    splitterClass: 'x-form-spinner-splitter',
    alternateKey: Ext.EventObject.shiftKey,
    defaultValue: 0,
    accelerate: false,

    constructor: function(config){
        Ext.ux.Spinner.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        this.mimicing = false;
    },

    init: function(field){
        this.field = field;

        field.afterMethod('onRender', this.doRender, this);
        field.afterMethod('onEnable', this.doEnable, this);
        field.afterMethod('onDisable', this.doDisable, this);
        field.afterMethod('afterRender', this.doAfterRender, this);
        field.afterMethod('onResize', this.doResize, this);
        field.afterMethod('onFocus', this.doFocus, this);
        field.beforeMethod('onDestroy', this.doDestroy, this);
    },

    doRender: function(ct, position){
        var el = this.el = this.field.getEl();
        var f = this.field;

        if (!f.wrap) {
            f.wrap = this.wrap = el.wrap({
                cls: "x-form-field-wrap"
            });
        }
        else {
            this.wrap = f.wrap.addClass('x-form-field-wrap');
        }

        this.trigger = this.wrap.createChild({
            tag: "img",
            src: Ext.BLANK_IMAGE_URL,
            cls: "x-form-trigger " + this.triggerClass
        });

        if (!f.width) {
            this.wrap.setWidth(el.getWidth() + this.trigger.getWidth());
        }

        this.splitter = this.wrap.createChild({
            tag: 'div',
            cls: this.splitterClass,
            style: 'width:13px; height:2px;'
        });
        this.splitter.setRight((Ext.isIE) ? 1 : 2).setTop(10).show();

        this.proxy = this.trigger.createProxy('', this.splitter, true);
        this.proxy.addClass("x-form-spinner-proxy");
        this.proxy.setStyle('left', '0px');
        this.proxy.setSize(14, 1);
        this.proxy.hide();
        this.dd = new Ext.dd.DDProxy(this.splitter.dom.id, "SpinnerDrag", {
            dragElId: this.proxy.id
        });

        this.initTrigger();
        this.initSpinner();
    },

    doAfterRender: function(){
        var y;
        if (Ext.isIE && this.el.getY() != (y = this.trigger.getY())) {
            this.el.position();
            this.el.setY(y);
        }
    },

    doEnable: function(){
        if (this.wrap) {
            this.disabled = false;
            this.wrap.removeClass(this.field.disabledClass);
        }
    },

    doDisable: function(){
        if (this.wrap) {
            this.disabled = true;
            this.wrap.addClass(this.field.disabledClass);
            this.el.removeClass(this.field.disabledClass);
        }
    },

    doResize: function(w, h){
        if (typeof w == 'number') {
            this.el.setWidth(w - this.trigger.getWidth());
        }
        this.wrap.setWidth(this.el.getWidth() + this.trigger.getWidth());
    },

    doFocus: function(){
        if (!this.mimicing) {
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
                delay: 10
            });
            this.el.on('keydown', this.checkTab, this);
        }
    },

    // private
    checkTab: function(e){
        if (e.getKey() == e.TAB) {
            this.triggerBlur();
        }
    },

    // private
    mimicBlur: function(e){
        if (!this.wrap.contains(e.target) && this.field.validateBlur(e)) {
            this.triggerBlur();
        }
    },

    // private
    triggerBlur: function(){
        this.mimicing = false;
        Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        this.el.un("keydown", this.checkTab, this);
        this.field.beforeBlur();
        this.wrap.removeClass('x-trigger-wrap-focus');
        this.field.onBlur.call(this.field);
    },

    initTrigger: function(){
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

    initSpinner: function(){
        this.field.addEvents({
            'spin': true,
            'spinup': true,
            'spindown': true
        });

        this.keyNav = new Ext.KeyNav(this.el, {
            "up": function(e){
                e.preventDefault();
                this.onSpinUp();
            },

            "down": function(e){
                e.preventDefault();
                this.onSpinDown();
            },

            "pageUp": function(e){
                e.preventDefault();
                this.onSpinUpAlternate();
            },

            "pageDown": function(e){
                e.preventDefault();
                this.onSpinDownAlternate();
            },

            scope: this
        });

        this.repeater = new Ext.util.ClickRepeater(this.trigger, {
            accelerate: this.accelerate
        });
        this.field.mon(this.repeater, "click", this.onTriggerClick, this, {
            preventDefault: true
        });

        this.field.mon(this.trigger, {
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            mousemove: this.onMouseMove,
            mousedown: this.onMouseDown,
            mouseup: this.onMouseUp,
            scope: this,
            preventDefault: true
        });

        this.field.mon(this.wrap, "mousewheel", this.handleMouseWheel, this);

        this.dd.setXConstraint(0, 0, 10)
        this.dd.setYConstraint(1500, 1500, 10);
        this.dd.endDrag = this.endDrag.createDelegate(this);
        this.dd.startDrag = this.startDrag.createDelegate(this);
        this.dd.onDrag = this.onDrag.createDelegate(this);
    },

    onMouseOver: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        this.tmpHoverClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-overup' : 'x-form-spinner-overdown';
        this.trigger.addClass(this.tmpHoverClass);
    },

    //private
    onMouseOut: function(){
        this.trigger.removeClass(this.tmpHoverClass);
    },

    //private
    onMouseMove: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        if (((Ext.EventObject.getPageY() > middle) && this.tmpHoverClass == "x-form-spinner-overup") ||
            ((Ext.EventObject.getPageY() < middle) && this.tmpHoverClass == "x-form-spinner-overdown")) {
        }
    },

    //private
    onMouseDown: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        this.tmpClickClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-clickup' : 'x-form-spinner-clickdown';
        this.trigger.addClass(this.tmpClickClass);
    },

    //private
    onMouseUp: function(){
        this.trigger.removeClass(this.tmpClickClass);
    },

    //private
    onTriggerClick: function(){
        if (this.disabled || this.el.dom.readOnly) {
            return;
        }
        var middle = this.getMiddle();
        var ud = (Ext.EventObject.getPageY() < middle) ? 'Up' : 'Down';
        this['onSpin' + ud]();
    },

    //private
    getMiddle: function(){
        var t = this.trigger.getTop();
        var h = this.trigger.getHeight();
        var middle = t + (h / 2);
        return middle;
    },

    //private
    //checks if control is allowed to spin
    isSpinnable: function(){
        if (this.disabled || this.el.dom.readOnly) {
            Ext.EventObject.preventDefault(); //prevent scrolling when disabled/readonly
            return false;
        }
        return true;
    },

    handleMouseWheel: function(e){
        //disable scrolling when not focused
        if (this.wrap.hasClass('x-trigger-wrap-focus') == false) {
            return;
        }

        var delta = e.getWheelDelta();
        if (delta > 0) {
            this.onSpinUp();
            e.stopEvent();
        }
        else
        if (delta < 0) {
            this.onSpinDown();
            e.stopEvent();
        }
    },

    //private
    startDrag: function(){
        this.proxy.show();
        this._previousY = Ext.fly(this.dd.getDragEl()).getTop();
    },

    //private
    endDrag: function(){
        this.proxy.hide();
    },

    //private
    onDrag: function(){
        if (this.disabled) {
            return;
        }
        var y = Ext.fly(this.dd.getDragEl()).getTop();
        var ud = '';

        if (this._previousY > y) {
            ud = 'Up';
        } //up
        if (this._previousY < y) {
            ud = 'Down';
        } //down
        if (ud != '') {
            this['onSpin' + ud]();
        }

        this._previousY = y;
    },

    //private
    onSpinUp: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        if (Ext.EventObject.shiftKey == true) {
            this.onSpinUpAlternate();
            return;
        }
        else {
            this.spin(false, false);
        }
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spinup", this);
    },

    //private
    onSpinDown: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        if (Ext.EventObject.shiftKey == true) {
            this.onSpinDownAlternate();
            return;
        }
        else {
            this.spin(true, false);
        }
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spindown", this);
    },

    //private
    onSpinUpAlternate: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        this.spin(false, true);
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spinup", this);
    },

    //private
    onSpinDownAlternate: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        this.spin(true, true);
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spindown", this);
    },

    spin: function(down, alternate){
        var v = parseFloat(this.field.getValue());
        var incr = (alternate == true) ? this.alternateIncrementValue : this.incrementValue;
        (down == true) ? v -= incr : v += incr;

        v = (isNaN(v)) ? this.defaultValue : v;
        v = this.fixBoundries(v);
        this.field.setRawValue(v);
    },

    fixBoundries: function(value){
        var v = value;

        if (this.field.minValue != undefined && v < this.field.minValue) {
            v = this.field.minValue;
        }
        if (this.field.maxValue != undefined && v > this.field.maxValue) {
            v = this.field.maxValue;
        }

        return this.fixPrecision(v);
    },

    // private
    fixPrecision: function(value){
        var nan = isNaN(value);
        if (!this.field.allowDecimals || this.field.decimalPrecision == -1 || nan || !value) {
            return nan ? '' : value;
        }
        return parseFloat(parseFloat(value).toFixed(this.field.decimalPrecision));
    },

    doDestroy: function(){
        if (this.trigger) {
            this.trigger.remove();
        }
        if (this.wrap) {
            this.wrap.remove();
            delete this.field.wrap;
        }

        if (this.splitter) {
            this.splitter.remove();
        }

        if (this.dd) {
            this.dd.unreg();
            this.dd = null;
        }

        if (this.proxy) {
            this.proxy.remove();
        }

        if (this.repeater) {
            this.repeater.purgeListeners();
        }
        if (this.mimicing){
            Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        }
    }
});

//backwards compat
Ext.form.Spinner = Ext.ux.Spinner;

/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.form');

/**
 * @class Ext.ux.form.SpinnerField
 * @extends Ext.form.NumberField
 * Creates a field utilizing Ext.ux.Spinner
 * @xtype spinnerfield
 */
Ext.ux.form.SpinnerField = Ext.extend(Ext.form.NumberField, {
    actionMode: 'wrap',
    deferHeight: true,
    autoSize: Ext.emptyFn,
    onBlur: Ext.emptyFn,
    adjustSize: Ext.BoxComponent.prototype.adjustSize,

    constructor: function(config) {
        var spinnerConfig = Ext.copyTo({}, config, 'incrementValue,alternateIncrementValue,accelerate,defaultValue,triggerClass,splitterClass');

        var spl = this.spinner = new Ext.ux.Spinner(spinnerConfig);

        var plugins = config.plugins
            ? (Ext.isArray(config.plugins)
                ? config.plugins.push(spl)
                : [config.plugins, spl])
            : spl;

        Ext.ux.form.SpinnerField.superclass.constructor.call(this, Ext.apply(config, {plugins: plugins}));
    },

    // private
    getResizeEl: function(){
        return this.wrap;
    },

    // private
    getPositionEl: function(){
        return this.wrap;
    },

    // private
    alignErrorIcon: function(){
        if (this.wrap) {
            this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
        }
    },

    validateBlur: function(){
        return true;
    }
});

Ext.reg('spinnerfield', Ext.ux.form.SpinnerField);

//backwards compat
Ext.form.SpinnerField = Ext.ux.form.SpinnerField;
