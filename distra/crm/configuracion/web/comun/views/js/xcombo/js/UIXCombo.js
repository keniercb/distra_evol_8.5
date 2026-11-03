if (!Ext.CONT)
    Ext.namespace('Ext.CONT');
Ext.CONT.UIXCombo = Ext.extend(Ext.form.ComboBox,
        {
            chainSelection: false,
            countSelectedBeforeFilter: 0,
            perfil: window.parent.perfil,
            constructor: function(properties, params)
            {
                this.addEvents("selected");
                Ext.applyIf(properties, {
                    editable: false,
                    id: 'cbx' + params.identificador,
                    fieldLabel: params.displayText,
                    forceSelection: true,
                    contador: params.contador,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    enableKeyEvents: true,
                    anchor: '100%',
                    selectedClass: '',
                    store: new Ext.data.SimpleStore({
                        fields: [],
                        data: [[]]
                    }),
                    onSelect: Ext.emptyFn,
                    lazyRender: true,
                    tpl: "<div id=xcombo" + params.identificador + " style=\"height:auto; !important; \"><div id=xcombo1" + params.identificador + " style=\"height:auto !important; overflow:auto;\"></div><div id=xcombo2" + params.identificador + " style=\"height:25px !important; overflow:auto;\"></div></div>",
                    fSelect: {
                        values: new Array(),
                        valuesLoaded: new Array(),
                        display: new Array(),
                        index: new Array()
                    },
                    listeners: {
                        expand: function()
                        {
                            if (!Ext.getCmp('pnlContenedor' + params.identificador).rendered)
                                Ext.getCmp('pnlContenedor' + params.identificador).render('xcombo1' + params.identificador);
                            else
                            if (this.getValue().length == 0)
                                Ext.getCmp('gp' + params.identificador).getSelectionModel().clearSelections();

                            div2 = document.getElementById('xcombo2' + params.identificador);
                            if (this.storeLength > 14 && this.storeLength != undefined)
                            {
                                if (Ext.getCmp('tbBuscar' + params.identificador) != undefined)
                                {
                                    if (!Ext.getCmp('tbBuscar' + params.identificador).rendered || !div2.hasChildNodes())
                                        this.fGetFindToolBar(this, params).render('xcombo2' + params.identificador);
                                } else
                                    this.fGetFindToolBar(this, params).render('xcombo2' + params.identificador);
                            } else
                            {
//                                if (div2.hasChildNodes())
//                                    div2.removeChild(div2.lastChild);
                            }
                        },
                        blur: function() {
                            if (this.isExpanded())
                                this.collapse();
                        },
                        keypress: function(textField, e) {
                            if (this.isExpanded())
                            {
                                switch (e.getKey())
                                {
                                    case 38 :
                                        {
                                            sm = Ext.getCmp('gp' + params.identificador).getSelectionModel();
                                            if (sm.hasSelection() && !sm.hasNext() && sm.hasPrevious())
                                                sm.selectPrevious();
                                        }
                                        break;
                                    case 40:
                                        {
                                            sm = Ext.getCmp('gp' + params.identificador).getSelectionModel();
                                            if (sm.hasSelection())
                                            {
                                                if (sm.hasNext())
                                                    sm.selectNext();
                                            } else
                                                sm.selectFirstRow();
                                        }
                                        break;
                                    case 13:
                                        {
                                            this.collapse();
                                            this.focus();
                                        }
                                }
                            }
                        },
                        render: function(component)
                        {
                            var scope = this;
                            component.getEl().on('mouseover', function()
                            {
                                cbxComponente = Ext.getCmp('cbx' + params.identificador);
                                if (cbxComponente.getRawValue().length > 0 && !cbxComponente.isExpanded() && cbxComponente.isValid())
                                    scope.fToolTipShow(cbxComponente, cbxComponente.getRawValue());
                            });
                            if (params.contador)
                                scope.fireEvent("selected", params.contador);
                        }
                    }
                });
                this.content = new Ext.CONT.UIXCombo.pnlContenedor(this, params);
                return Ext.CONT.UIXCombo.superclass.constructor.call(this, properties);
            },
            fGetFindToolBar: function(scope, params)
            {
                return new Ext.Toolbar({
                    autoHeight: true,
                    id: 'tbBuscar' + params.identificador,
                    frame: true,
                    anchor: '100%',
                    items: [new Ext.CONT.SearchField(scope, {
                            id: 'tfBuscar' + params.identificador,
                            uniqueId: params.identificador,
                            store: Ext.getCmp('gp' + params.identificador).getStore(),
                            width: Ext.getCmp('cbx' + params.identificador).getSize().width + 10
                        })]
                });
            },
            fAceptoBusqueda: function(component, params)
            {
                Ext.getCmp('gp' + params.identificador).getStore().filter('codigo', Ext.getCmp('tfBuscar' + params.identificador).getValue(), false, false);
            },
            fToolTipShow: function(component, text)
            {
                if (!component.ttp)
                    component.ttp = new Ext.ToolTip({
                        target: component.getEl(),
                        autoHeight: true,
                        autoWidth: true,
                        autoHide: true,
                        maxWidth: 150,
                        anchor: 'left',
                        title: text,
                        trackMouse: true
                    });
                else
                    component.ttp.setTitle(text);
            },
            fIsDirty: function(list)
            {
                if (list.length == this.fSelect.valuesLoaded.length)
                {
                    for (i = 0; i < list.length; i++)
                        if (list[i] != this.fSelect.valuesLoaded[i])
                            return true;
                    return false;
                }
                return true;
            }
        });

Ext.namespace('Ext.CONT.UIXCombo');
Ext.CONT.UIXCombo.pnlContenedor = Ext.extend(Ext.Panel,
        {
            constructor: function(scope, params)
            {
                scope.btnSeleccion = new Ext.Button({
                    icon: '/configuracion/comun/images/seleccion.png',
                    iconCls: 'btn',
                    tooltip: 'Seleccionar todos',
                    disabled: true,
                    handler: function() {
                        Ext.getCmp('gp' + params.identificador).getSelectionModel().selectAll();
                        this.hide();
                        scope.btnCancelarSeleccion.show();
                    }
                });

                scope.btnCancelarSeleccion = new Ext.Button({
                    icon: '/configuracion/comun/images/cancelarseleccion.png',
                    iconCls: 'btn',
                    tooltip: 'Descartar selecci&oacute;n',
                    hidden: true,
                    handler: function() {
                        Ext.getCmp('gp' + params.identificador).getSelectionModel().clearSelections();
                        this.hide();
                        scope.btnSeleccion.show();
                    }
                });

                Ext.applyIf(this, {
                    id: 'pnlContenedor' + params.identificador,
                    border: false,
                    hiddenTbar: false,
                    hideBorders: true,
                    bodyBorder: false,
                    frame: false,
                    layout: 'fit',
                    autoHeight: true,
                    autoWidth: true,
                    tbar: (params.tbar != undefined) ? [scope.btnSeleccion, scope.btnCancelarSeleccion, params.tbar] : [scope.btnSeleccion, scope.btnCancelarSeleccion],
                    items: [new Ext.ux.maximgb.treegrid.GridPanel({
                            id: 'gp' + params.identificador,
                            master_column_id: 'expandir',
                            autoExpandColumn: 'expandir',
                            stripeRows: false,
                            layout: 'fit',
                            height: 200,
                            loadMask: {
                                msg: 'Cargando ...'
                            },
                            fLoadMask: function(body, msg) {
                                Ext.apply(this, {
                                    msg: msg
                                });
                                return new Ext.LoadMask(body, this);
                            },
                            store: new Ext.ux.maximgb.treegrid.AdjacencyListStore({
                                id: 'st' + params.identificador,
                                url: params.url,
                                baseParams: params.baseParams,
                                autoLoad: params.autoLoad,
                                listeners: {
                                    load: function(store, records, options) {
                                        div2 = document.getElementById('xcombo2' + params.identificador);
                                        scope.storeLength = store.data.length;
                                        if (scope.storeLength > 0)
                                        {
                                            scope.btnSeleccion.enable();
                                            scope.btnSeleccion.show();
                                            scope.btnCancelarSeleccion.hide();
                                        } else
                                        {
                                            scope.btnSeleccion.hide();
                                            scope.btnCancelarSeleccion.hide();
                                        }

                                        if (scope.storeLength <= 14 && div2 != undefined)
                                        {
//                                            if (div2.hasChildNodes())
//                                                div2.removeChild(div2.lastChild);
                                        } else
                                        if (scope.storeLength > 14 && div2 != undefined)
                                        {
                                            if (!div2.hasChildNodes())
                                                scope.fGetFindToolBar(scope, params).render('xcombo2' + params.identificador);
                                        }
                                        Ext.getCmp('pnlContenedor' + params.identificador).syncSize();
                                    }
                                },
                                reader: params.reader
                            }),
                            selModel: new Ext.grid.RowSelectionModel({
                                id: 'sm' + params.identificador,
                                singleSelect: params.singleSelect,
                                listeners: {
                                    beforerowselect: function(selectionModel, rowIndex, keepExisting, record) {

                                        if (!keepExisting && scope.countSelectedBeforeFilter == 0)
                                            _scope.fClearSelect(Ext.getCmp('cbx' + params.identificador));
                                    },
                                    rowselect: function(selectionModel, rowIndex, record) {

                                        _scope.fDisplaySelect(params.identificador, true, record, rowIndex);

                                        if (selectionModel.getCount() == record.store.getCount()) {
                                            scope.btnCancelarSeleccion.show();
                                            scope.btnSeleccion.hide();
                                        }
                                    },
                                    rowdeselect: function(selectionModel, rowIndex, record) {
                                        scope.btnCancelarSeleccion.hide();
                                        scope.btnSeleccion.show();
                                        _scope.fDisplaySelect(params.identificador, false, record);
                                    }
                                },
                                selectRowsByValues: function(values)
                                {
                                    records = new Array();
                                    for (i = 0; i < values.length; i ++)
                                        records.push(Ext.getCmp('gp' + params.identificador).getStore().getById(values[i]));
                                    this.selectRecords(records, true);
                                }
                            }),
                            columns: [{
                                    id: 'expandir',
                                    header: " ",
                                    dataIndex: 'text',
                                    sortable: true
                                }],
                            listeners: {
                                render: function(component)
                                {
                                    component.getEl().on('mouseover', function(e, t)
                                    {
                                        if (component.view.findRowIndex(t) !== false && Ext.getCmp('cbx' + params.identificador).isValid())
                                        {
                                            gpComponente = Ext.getCmp('gp' + params.identificador);
                                            scope.fToolTipShow(gpComponente, gpComponente.getStore().getAt(component.view.findRowIndex(t)).data.text);
                                        }
                                    });
                                    if (scope.hiddenTbar) {
                                        Ext.getCmp('pnlContenedor' + params.identificador).getTopToolbar().destroy();
                                    }
                                },
                                rowdblclick: function()
                                {
                                    Ext.getCmp('cbx' + params.identificador).collapse();
                                },
                                keypress: function(e) {
                                    if (e.getKey() == 27 || e.getKey() == 13)
                                    {
                                        Ext.getCmp('cbx' + params.identificador).collapse();
                                        Ext.getCmp('cbx' + params.identificador).focus();
                                    }
                                }
                            }
                        })]
                });
                var _scope = this;
                return Ext.CONT.UIXCombo.pnlContenedor.superclass.constructor.call(this);
            },
            fSelecionarTodo: function(identificador)
            {
                btnSeleccion = Ext.getCmp('btnSelect' + identificador);
                gpComponente = Ext.getCmp('gp' + identificador);
                smComponente = gpComponente.getSelectionModel();
                cbxComponente = Ext.getCmp('cbx' + identificador);
                if (btnSeleccion.getText() == 'Seleccionar todos' && !this.chainSelection)
                {
                    btnSeleccion.setText('Descartar selección');
                    btnSeleccion.disable();
                    this.chainSelection = true;
                    stComponente = gpComponente.getStore();
                    stCount = stComponente.getCount();
                    for (var i = 0; i < stCount; i++)
                    {
                        smComponente.selectRow(i, true);
                        if (i + 1 == stCount)
                        {
                            this.chainSelection = false;
                            btnSeleccion.enable();
                        }
                    }
                } else
                {
                    btnSeleccion.setText('Seleccionar todos');
                    smComponente.clearSelections();

                    cbxComponente.fSelect.values = new Array();
                    cbxComponente.fSelect.display = new Array();
                    cbxComponente.fSelect.index = new Array();

                    cbxComponente.clearValue();
                }
                cbxComponente.focus(true);
            },
            fDisplaySelect: function(identificador, flag, record, rowIndex)
            {
                cbxComponente = Ext.getCmp('cbx' + identificador);
                if (flag)
                    this.fCopySelect(cbxComponente, record, rowIndex);
                else
                {
                    index = cbxComponente.fSelect.values.indexOf(record.id);
                    this.fDeletedSelect(cbxComponente, index);
                }
                cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
            },
            fCopySelect: function(component, record, index)
            {
                if (cbxComponente.fSelect.values.indexOf(record.id) < 0)
                {
                    component.fSelect.display.push(record.data.codigo);
                    component.fSelect.values.push(record.id);
                    component.fSelect.index.push(index);
                }
            },
            fDeletedSelect: function(component, index)
            {
                component.fSelect.display.splice(index, 1);
                component.fSelect.values.splice(index, 1);
                component.fSelect.index.splice(index, 1);
                component.setValue(component.fSelect.display.join(", "));
            },
            fClearSelect: function(component)
            {
                component.fSelect.values = new Array();
                component.fSelect.display = new Array();
                component.fSelect.index = new Array();
                component.clearValue();
            },
            fValueExist: function(list, value)
            {
                for (i = 0; i < list.length; i++)
                    if (list[i] == value)
                        return i;
                return -1;
            }
        });

Ext.CONT.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    validationEvent: false,
    validateOnBlur: false,
    selectOnFocus: true,
    trigger1Class: 'x-form-clear-trigger',
    trigger2Class: 'x-form-search-trigger',
    hideTrigger1: true,
    maskRe: /[0-9.-/|_]$/,
//    style: 'text-align:right',
    width: 180,
    hasSearch: false,
    emptyText: 'Criterio a buscar...',
    constructor: function(scope, params) {
        Ext.apply(this, params);
        Ext.CONT.SearchField.superclass.constructor.call(this, params);
//        this.on('specialkey', function(f, e) {
//            if (e.getKey() == e.ENTER) {
//                this.onTrigger2Click(scope);
//            }
//        }, this);


        this.on({
            specialkey: {
                fn: function(f, e) {
                    if (e.getKey() == e.ENTER || e.getKey() == 13) {
                        this.onTrigger2Click(scope);
                    }
                    if (e.getKey() == e.ESC || e.getKey() == 27) {
                        this.onTrigger1Click(scope);
                        f.triggerBlur();
                    }
                }

            }
        });









    },
    onTrigger1Click: function() {
        if (this.hasSearch) {
            this.reset();
            this.el.dom.value = '';
            this.store.clearFilter();
            if (this.uniqueId != undefined)
                Ext.getCmp('gp' + this.uniqueId).getSelectionModel().selectRowsByValues(Ext.getCmp('cbx' + this.uniqueId).fSelect.values)
            this.triggers[0].hide();
            this.hasSearch = false;
        }
        this.blur();
        this.triggerBlur();
    },
    onTrigger2Click: function(scope) {
        var v = this.getRawValue();
        if (v.length < 1) {
            this.onTrigger1Click();
            return;
        }
        if (this.uniqueId != undefined)
            scope.countSelectedBeforeFilter = Ext.getCmp('gp' + this.uniqueId).getSelectionModel().getSelections().length;
        this.store.filter('codigo', v, false, false);
        this.hasSearch = true;
        this.triggers[0].show();
    }
});