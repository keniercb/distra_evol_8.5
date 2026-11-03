Ext.ns('Std.base.grid');
Std.base.grid.RowEditor = Ext.extend(Ext.Panel, {
    floating: true,
    shadow: false,
    layout: 'fit',
    buttonAlign: 'center',
    baseCls: 'x-grid-row-editor',
    elements: 'header,footer,body',
    frameWidth: 5,
    buttonPad: 3,
    clicksToEdit: 'auto',
    monitorValid: true,
    focusDelay: 1000,
    errorSummary: true,
    defaults: {
        normalWidth: true
    },
    initComponent: function() {
        this.saveChanges = this.saveChanges ? this.saveChanges : false;
        Std.base.grid.RowEditor.superclass.initComponent.call(this);
        this.addEvents(
                /**
                 * @event beforeedit
                 * Fired before the row editor is activated.
                 * If the listener returns <tt>false</tt> the editor will not be activated.
                 * @param {Std.base.grid.RowEditor} roweditor This object
                 * @param {Number} rowIndex The rowIndex of the row just edited
                 */
                'beforeedit',
                /**
                 * @event validateedit
                 * Fired after a row is edited and passes validation.
                 * If the listener returns <tt>false</tt> changes to the record will not be set.
                 * @param {Std.base.grid.RowEditor} roweditor This object
                 * @param {Object} changes Object with changes made to the record.
                 * @param {Ext.data.Record} r The Record that was edited.
                 * @param {Number} rowIndex The rowIndex of the row just edited
                 */
                'validateedit',
                /**
                 * @event afteredit
                 * Fired after a row is edited and passes validation.  This event is fired
                 * after the store's update event is fired with this edit.
                 * @param {Std.base.grid.RowEditor} roweditor This object
                 * @param {Object} changes Object with changes made to the record.
                 * @param {Ext.data.Record} r The Record that was edited.
                 * @param {Number} rowIndex The rowIndex of the row just edited
                 */
                'afteredit',
                /**
                 * @event editorready
                 * Fired after a row is edited and sow the editor form.  This event is fired
                 * after the editor is show.
                 * @param {Std.base.grid.RowEditor} roweditor This object
                 */
                'editorready'
                );
    },
    init: function(grid) {
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
        grid.getStore().on('remove', function() {
            if (!this.removing) {
                this.stopEditing(false);
            }
            this.removing = false;
        }, this);

        grid.on({
            scope: this,
            keydown: this.onGridKey,
            columnresize: this.verifyLayout,
            columnmove: this.refreshFields,
            reconfigure: this.refreshFields,
            destroy: this.destroy,
            bodyscroll: {
                buffer: 250,
                fn: this.positionButtons
            }
        });
        grid.getColumnModel().on('hiddenchange', this.verifyLayout, this, {
            delay: 1
        });
        grid.getView().on('refresh', this.stopEditing.createDelegate(this, []));
        grid.getStore().on('beforeload',function(){
            if (!this.removing) {
                this.stopEditing(false);
            }
            this.removing = false;
        },this);
    },
    refreshFields: function() {
        this.initFields();
        this.verifyLayout();
    },
    isDirty: function() {
        var dirty, fields = this.items.items, len = this.items.items.length;
        for (var i = 0; i < len; i++) {
            var f = fields[i];
            var f_obj = f.field;
            var value = String((f_obj instanceof Ext.form.DateField) ? f_obj.getRawValue() : f.getValue());
            if (String(this.values[f.id]) !== value) {
                dirty = true;
                return false;
            }
        }
        return dirty;
    },
    startEditing: function(rowIndex, doFocus) {
        if (this.editing && this.isDirty()) {
            this.showTooltip('You need to commit or cancel your changes');
            return;
        }
        this.editing = true;
        if (typeof rowIndex == 'object') {
            rowIndex = this.grid.getStore().indexOf(rowIndex);
        }
        if (this.fireEvent('beforeedit', this, rowIndex) !== false) {
            var g = this.grid, view = g.getView();
            var row = view.getRow(rowIndex);
            var record = g.store.getAt(rowIndex);
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

            this.verifyLayout(true);
            if (!this.isVisible()) {
                this.setPagePosition(Ext.fly(row).getXY());
            } else {
                this.el.setXY(Ext.fly(row).getXY(), {
                    duration: 0.15
                });
            }
            if (!this.isVisible()) {
                this.show().doLayout();
            }
            if (doFocus !== false) {
                this.doFocus.defer(this.focusDelay, this);
            }
            for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                val = this.preEditValue(record, cm.getDataIndex(i));
                f = fields[i];
                f.setValue(val);
                this.values[f.id] = val || '';
            }
            this.fireEvent('editorready', this, rowIndex);
        }
    },
    stopEditing: function(saveChanges) {
        this.editing = false;
        var changes = {}, r = this.record, hasChange = true;
        if (!this.isVisible()) {
            return;
        }
        if (saveChanges === false || !this.isValid()) {
            if (r.is_new) {
                this.removing = true;
                this.grid.store.remove(r);
                this.fireEvent('cancelarEdicion');
            }
            this.hide();
            return;
        }
        var cm = this.grid.colModel, fields = this.items.items;
        /*for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
            if (!cm.isHidden(i)) {
                var dindex = cm.getDataIndex(i);
                if (!Ext.isEmpty(dindex)) {
                    var oldValue = r.data[dindex];

                    var f_obj = fields[i].field;
                    var val = String((f_obj instanceof Ext.form.DateField) ? f_obj.getRawValue() : fields[i].getValue());

                    var value = this.postEditValue(val, oldValue, r, dindex);
                    if (String(oldValue) !== String(value)) {
                        changes[dindex] = value;
                        hasChange = true;
                    }
                }
            }
        }*/
        if (saveChanges && hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false) {
            r.beginEdit();
            for (var k in changes) {
                if (changes.hasOwnProperty(k)) {
                    r.set(k, changes[k]);
                }
            }
            r.endEdit();
            this.fireEvent('afteredit', this, changes, r, this.rowIndex);
            r.is_new = false;
        }
        this.hide();
    },
    verifyLayout: function(force) {
        if (this.el && (this.isVisible() || force === true)) {
            var row = this.grid.getView().getRow(this.rowIndex);
            this.setSize(Ext.fly(row).getWidth(), Ext.fly(row).getHeight() + 3);
            var cm = this.grid.colModel, fields = this.items.items;
            var next = 0;
            var len = cm.getColumnCount();
            for (var i = 0; i < len; i++) {
                if (!cm.isHidden(i)) {
                    var adjust = 0;
                    if (i === 0) {
                        adjust += 0; // outer padding
                    }
                    if (i === (len - 1)) {
                        adjust += 3; // outer padding
                    } else {
                        adjust += 1;
                    }
                    fields[i].show();

                    fields[i].setSize(cm.getColumnWidth(i) - adjust, Ext.fly(row).getHeight());
                    fields[i].getEl().setLeftTop(next, 0);
                    next = next + cm.getColumnWidth(i);


                    //fields[i].field.setWidth(cm.getColumnWidth(i) - adjust);
                    //fields[i].field.setPosition(cm.getColumnWidth(i) - adjust, 0);                  

                } else {
                    fields[i].hide();
                }
            }
            this.doLayout();
            this.positionButtons();
        }
    },
    slideHide: function() {
        this.hide();
    },
    removeAll: function(autoDestroy) {
        for (var i = 0; i < this.items.items.length; i++) {
            this.remove(this.items.items[i], autoDestroy);
        }
        return true;
    },
    getColumnAt: function(cm, index) {
        if (cm && cm.getColumnId(index) !== undefined && cm.getColumnId(index) !== null) {
            return cm.getColumnById(cm.getColumnId(index));
        }
        return null;
    },
    getEditor: function(col) {
        if (col && col.editor) {
            return col.editor;
        }
        return null;
    },
    enableColumnEditor: function(index) {
        var editorField = this.getCellEditor(index);
        if (editorField) {
            if (editorField.field && editorField.field.enable)
                editorField.field.enable();
            editorField.enable();
            return true;
        }
        return false;
    },
    disableColumnEditor: function(index) {
        var editorField = this.getCellEditor(index);
        if (editorField) {
            if (editorField.field && editorField.field.disable)
                editorField.field.disable();
            editorField.disable();
            return true;
        }
        return false;
    },
    initFields: function() {
        var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
        this.removeAll(false);
        for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
            var c = this.getColumnAt(cm, i);
            var ed = this.getEditor(c);
            if (!ed) {
                ed = c.displayEditor || new Ext.form.Field({
                    hidden: true
                });
            }
            if (i == 0) {
                ed.margins = pm('0 1 2 1');
            } else if (i == len - 1) {
                ed.margins = pm('0 0 2 1');
            } else {
                ed.margins = pm('0 1 2');
            }
            ed.setSize(cm.getColumnWidth(i), 50);
            ed.column = c;
            if (ed.ownerCt !== this) {
                ed.on('focus', this.ensureVisible, this);
                ed.on('specialkey', this.onKey, this);
            }
            this.insert(i, ed);
        }
        this.initialized = true;
    },
    onKey: function(f, e) {
        if (e.getKey() === e.ENTER) {
            this.stopEditing(true);
            e.stopPropagation();
        }
    },
    onGridKey: function(e) {
        if (e.getKey() === e.ENTER && !this.isVisible()) {
            var r = this.grid.getSelectionModel().getSelected();
            if (r) {
                var index = this.grid.store.indexOf(r);
                this.startEditing(index);
                e.stopPropagation();
            }
        }
    },
    ensureVisible: function(editor) {
        if (this.isVisible()) {
            this.grid.getView().ensureVisible(this.rowIndex, this.grid.colModel.getIndexById(editor.column.id), true);
        }
    },
    onRowClick: function(g, rowIndex, e) {
        /*if(!this.saveChanges)
         this.clearInvalid();*/
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
    onRowDblClick: function(g, rowIndex, e) {
        /*if(!this.saveChanges)
         this.clearInvalid();*/
        this.startEditing(rowIndex, false);
        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
    },
    clearInvalid: function() {
        var store = this.grid.store;
        for (var i = 0; i < store.getTotalCount(); i++) {
            var rec = store.getAt(i);
            if (rec.is_new && rec.is_valid === false) {
                this.grid.store.remove(rec);
            }
        }
        return true;
    },
    onRender: function() {
        Std.base.grid.RowEditor.superclass.onRender.apply(this, arguments);
        this.el.swallowEvent(['keydown', 'keyup', 'keypress']);
        if (this.editDetails) {
            this.array_button = [
                {
                    ref: 'saveBtn',
                    itemId: 'saveBtn',
                    xtype: 'button',
                    tooltip: this.tooltip || 'Guardar',
                    iconCls: 'btn',
                    icon: perfil.dirImg + 'guardar.png',
                    text: this.saveText || 'Guardar',
                    width: this.minButtonWidth,
                    handler: this.stopEditing.createDelegate(this, [true])
                }, {
                    xtype: 'button',
                    iconCls: 'btn',
                    icon: perfil.dirImg + 'cancelar.png',
                    text: this.cancelText || 'Cancelar',
                    width: this.minButtonWidth,
                    tooltip: this.tooltip || 'Cancelar',
                    handler:  this.stopEditing.createDelegate(this, [false])
                }, {
                    xtype: 'button',
                    iconCls: 'btn',
                    icon: '/std/std_base/comun/recursos/images/iconos/editar_detalles.png',
                    text: 'Detalle',
                    tooltip: this.tooltip || 'Detalle',
                    width: this.minButtonWidth,
                    handler: function() {
                        this.stopEditing(false);
                        this.fireEvent('editDetails',this.record);
                    }.createDelegate(this)
                }
            ];
        }
        else {
            this.array_button = [
                {
                    ref: 'saveBtn',
                    itemId: 'saveBtn',
                    xtype: 'button',
                    iconCls: 'btn',
                    icon: perfil.dirImg + 'guardar.png',
                    text: this.saveText || 'Guardar',
                    tooltip: this.tooltip || 'Guardar',
                    width: this.minButtonWidth,
                    handler: this.stopEditing.createDelegate(this, [true])
                }, {
                    xtype: 'button',
                    iconCls: 'btn',
                    icon: perfil.dirImg + 'cancelar.png',
                    text: this.cancelText || 'Cancelar',
                    tooltip: this.tooltip || 'Cancelar',
                    width: this.minButtonWidth,
                    handler: this.stopEditing.createDelegate(this, [false])
                }
            ];
        }
        this.btns = new Ext.Panel({
            //cls: 'x-btns',
            baseCls: 'x-gridrow',
            layout: 'table',
            width: (this.editDetails) ? (this.minButtonWidth * 2.5) + (this.frameWidth * 3) + (this.buttonPad * 4) : (this.minButtonWidth * 1.7) + (this.frameWidth * 2) + (this.buttonPad * 4), // width must be specified for IE
            items: this.array_button
        });
        this.btns.render(this.bwrap);
    },
    afterRender: function() {
        Std.base.grid.RowEditor.superclass.afterRender.apply(this, arguments);
        this.positionButtons();
        if (this.monitorValid) {
            this.startMonitoring();
        }
    },
    onShow: function() {
        if (this.monitorValid) {
            this.startMonitoring();
        }
        Std.base.grid.RowEditor.superclass.onShow.apply(this, arguments);
    },
    onHide: function() {
        Std.base.grid.RowEditor.superclass.onHide.apply(this, arguments);
        this.stopMonitoring();
        this.grid.getView().focusRow(this.rowIndex);
    },
    positionButtons: function() {
        if (this.btns) {
            var h = this.el.dom.clientHeight;
            var view = this.grid.getView();
            var scroll = view.scroller.dom.scrollLeft;
            var width = view.mainBody.getWidth();
            var bw = this.btns.getSize();
            this.btns.el.shift({
                left: (width / 2) - (bw.width / 2) + scroll,
                top: h - 2,
                stopFx: true,
                duration: 0.2
            });
        }
    },
    // private
    preEditValue: function(r, field) {
        var value = r.data[field];
        return this.autoEncode && typeof value === 'string' ? Ext.util.Format.htmlDecode(value) : value;
    },
    // private
    postEditValue: function(value, originalValue, r, field) {
        return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
    },
    doFocus: function(pt) {
        if (this.isVisible()) {
            var index = 0;
            if (pt) {
                index = this.getTargetColumnIndex(pt);
            }
            var cm = this.grid.getColumnModel();
            for (var i = index || 0, len = cm.getColumnCount(); i < len; i++) {
                var c = this.getColumnAt(cm, i);
                if (!c.hidden && this.getEditor(c)) {
                    this.getEditor(c).focus();
                    break;
                }
            }
        }
    },
    getTargetColumnIndex: function(pt) {
        var grid = this.grid, v = grid.view;
        var x = pt.left;
        var cms = grid.colModel.config;
        var i = 0, match = false;
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
    startMonitoring: function() {
        if (!this.bound && this.monitorValid) {
            this.bound = true;
            Ext.TaskMgr.start({
                run: this.bindHandler,
                interval: this.monitorPoll || 200,
                scope: this
            });
        }
    },
    stopMonitoring: function() {
        this.bound = false;
        if (this.tooltip) {
            this.tooltip.hide();
        }
    },
    isValid: function() {
        var valid = true, fields = this.items.items, len = this.items.items.length;
        for (var i = 0; i < len; i++) {
            var f = fields[i];
            if (f && f.isValid && !f.isValid()) {
                valid = false;
                break;
            } else if (f.field && !f.field.isValid()) {
                valid = false;
                break;
            }
        }
        return valid;
    },
    // private
    bindHandler: function() {
        if (!this.bound) {
            return false; // stops binding
        }
        var valid = this.isValid();
        if (!valid && this.errorSummary) {
            //this.showTooltip(this.getErrorText().join(''));
        }
        this.btns.items.items[0].setDisabled(!valid);
        this.fireEvent('validation', this, valid);
    },
    showTooltip: function(msg) {
        var t = this.tooltip;
        if (!t) {
            t = this.tooltip = new Ext.ToolTip({
                maxWidth: 600,
                cls: 'errorTip',
                width: 300,
                title: 'Errors',
                autoHide: false,
                anchor: 'left',
                anchorToTarget: true,
                mouseOffset: [40, 0]
            });
        }
        t.initTarget(this.items.last().getEl());
        if (!t.rendered) {
            t.show();
            t.hide();
        }
        t.body.update(msg);
        t.doAutoWidth();
        t.show();
    },
    getErrorText: function() {
        var data = ['<ul>'], fields = this.items.items, len = this.items.items.length;
        for (var i = 0; i < len; i++) {
            var f = fields[i];
            if (f && f.isValid && !f.isValid(true)) {
                data.push('<li>', f.activeError, '</li>');
            } else if (f.field && !f.field.isValid(true)) {
                data.push('<li>', f.field.activeError, '</li>');
            }
        }
        data.push('</ul>');
        return data;
    },
    setCellValue: function(colIndex, value) {
        var cm = this.grid.getColumnModel();
        if (this.record) {
            this.record.set(colIndex, value);
            for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                var c = this.getColumnAt(cm, i);
                if (c.dataIndex == colIndex) {
                    var ed = this.getEditor(c);
                    if (ed) {
                        ed.setValue(value);
                    }
                }
            }
        }
    },
    getCellEditor: function(colIndex) {
        var cm = this.grid.getColumnModel();
        for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
            var c = this.getColumnAt(cm, i);
            if (c.dataIndex == colIndex) {
                return this.getEditor(c);
            }
        }
    },
    insertRow: function(index, rec, saveChange) {
        if (this.grid.store) {
            this.stopEditing(saveChange);
            rec.is_new = true;
            this.grid.store.insert(index, rec);
            this.grid.getView().refresh();
            this.grid.getSelectionModel().selectRow(index);
            this.startEditing(index);
            this.fireEvent('init_edition', this, index, rec);
            return true;
        }
        return false;
    },
    addRow: function(rec, saveChange) {
        if (this.grid.store) {
            var pos = this.grid.store.getTotalCount();
            return this.insertRow(pos, rec, saveChange);
        }
        return false;
    },
    addFirstRow: function(rec, saveChange) {
        return this.insertRow(0, rec, saveChange);
    }
});
Ext.reg('roweditor', Std.base.grid.RowEditor);

Ext.override(Ext.form.Field, {
    /*markInvalid: function(msg) {
        if (!this.rendered || this.preventMark) { // not rendered
            return;
        }
        msg = msg || this.invalidText;
        var mt = null;
        if (mt) {
            mt.mark(this, msg);
        } else if (this.msgTarget) {
            this.el.addClass(this.invalidClass);
            var t = Ext.getDom(this.msgTarget);
            if (t) {
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
            }
        }
        this.activeError = msg;
        this.fireEvent('invalid', this, msg);
    },*/
    render: Ext.form.Field.prototype.render.createInterceptor(function() {
        var _this = this;
        this.on('render', function() {
            this.getEl().on('click', function() {
                _this.fireEvent('click', _this);
                _this.fireEvent('dofocus', _this);
            });
            this.getEl().on('dbclick', function() {
                _this.fireEvent('dbclick', _this);
                _this.fireEvent('dofocus', _this);
            });
            this.outing = false;
            this.getEl().on('keydown', function(evt) {
                if (evt.getKey() == Ext.EventObject.TAB) {
                    _this.outing = true;
                }
            });
            this.getEl().on('keyup', function(evt) {
                if (_this.outing === false && evt.getKey() == Ext.EventObject.TAB) {
                    this.outing = false;
                    _this.fireEvent('dofocus', _this);
                }
            });
        });
    })
});

Ext.override(Ext.ToolTip, {
    doAutoWidth: function() {
        var bw = this.body.getTextWidth();
        if (this.title) {
            bw = Math.max(bw, this.header.child('span').getTextWidth(this.title));
        }
        bw += this.getFrameWidth() + (this.closable ? 20 : 0) + this.body.getPadding("lr") + 20;
        this.setWidth(bw.constrain(this.minWidth, this.maxWidth));

        // IE7 repaint bug on initial show
        if (Ext.isIE7 && !this.repainted) {
            this.el.repaint();
            this.repainted = true;
        }
    }
});
