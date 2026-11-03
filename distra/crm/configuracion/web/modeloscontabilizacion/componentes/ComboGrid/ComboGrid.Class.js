Ext.namespace('Ext.contabilidad.util');
Ext.contabilidad.util.ComboGrid = Ext.extend(Ext.Component,
        {
            maxHeight: 150,
            listHeight: 150,
            constructor: function(params)
            {
                if (params.store && params.displayField && params.valueField) {
                    var scope = this;
                    scope.simpleSelection = true;
                    scope.fieldLabel = 'Nombre';
                    scope.fnCreateNew = Ext.emptyFn;

                    scope.perfil = window.parent.perfil;
                    Ext.apply(this, params || {});

                    var pp = this.initialice.createInterceptor(function(scope) {
                        return scope.loadJs("/configuracion/comun/views/js/Ext.Cont.SearchField", 'SearchField');
                    });

                    pp(this);

                    scope.Combo = new Ext.contabilidad.util.UI.ComboGrid(scope, {
                        fieldLabel: scope.fieldLabel
                    });
                     scope.Combo.addEvents(
                            "ready",
                            "init"
                            );
                    Ext.contabilidad.util.ComboGrid.superclass.constructor.call(scope);
                    scope.initFunctions(scope);
                    scope.initializeEvents(scope);
                    //scope.Combo.fireEvent('ready', scope);
                    return scope.Combo;
//                    scope.btnAdd = new Ext.Button({
//                        id: 'btnAdd',
//                        icon: perfil.dirImg + 'adicionar.png',
//                        iconCls: 'btn',
//                        tooltip: 'Adicionar un nuevo elemento',
//                        text: 'Crear nuevo'
//                    });

//                    scope.loadJs("/configuracion/comun/views/js/Ext.Cont.SearchField", 'SearchField', scope);

                }
            },
            loadJs: function(jsSrc, id)
            {
                if (jsSrc !== null)
                {
                    var tagScript = document.createElement("script");
                    tagScript.setAttribute("type", "text/javascript");
                    tagScript.setAttribute("id", id);
                    tagScript.setAttribute("src", jsSrc + ".js");
                    Ext.DomQuery.selectNode("body").appendChild(tagScript);
                    console.log(Ext.get(tagScript));
                    while (!Ext.get(tagScript)){
                        // do nothing
                        console.log(Ext.get(id));
                    }
                    return true;
                }
            },
            initialice: function(scope) {
                console.log('12324');
                scope.btnAdd = new Ext.Button({
                    id: 'btnAdd',
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar un nuevo elemento',
                    text: 'Crear nuevo'
                });
                scope.sm = new Ext.grid.RowSelectionModel({
                    singleSelect: scope.simpleSelection
                });

                scope.grid = new Ext.grid.GridPanel({
                    store: scope.store,
                    sm: scope.sm,
                    border: false,
                    viewConfig: {forceFit:true},
                    loadMask: true,
                    //layout: 'fit',
                    //height: 200,
                    stripeRows: true,
                    autoExpandColumn: 'displayField',
                    columns: [
                        {
                            id: 'displayField',
                            header: '',
                            dataIndex: scope.displayField,
                            sortable: false,
                            hideable: false,
                            menuDisabled: true,
                            resizable: false
                        }],
                    tbar: [scope.tbCombo = new Ext.Toolbar({
                            items: [scope.sfBuscar = new Ext.Cont.SearchField({
                                    fnOnSearch: function() {
                                        //filterBy();
                                    },
                                    fnOnClear: function() {
                                        //filterBy();
                                    }
                                })]
                        })],
                    bbar: [scope.btnAdd]
                });
            },
            initializeEvents: function(scope)
            {
                scope.Combo.on({
                    expand: function(combo) {
                        scope.grid.setHeight(scope.listHeight);
                        console.log(scope.Combo.getSize());
                        scope.sfBuscar.setWidth(scope.Combo.getSize().width);
                        if (!scope.grid.rendered) {
                            scope.grid.render('datos');
                        }
                    }
                });
                scope.btnAdd.on({
                    click: function() {
                        if (typeof (scope.fnCreateNew) == 'function') {
                            scope.fnCreateNew.call(scope);
                        }
                    }
                });
                scope.sm.on({
                    rowdeselect: function(selectionModel, rowIndex, record) {
                        if (scope.simpleSelection) {
                            scope.Combo.reset();
                        } else {
                            if (!selectionModel.hasSelection()) {
                                scope.Combo.reset();
                            } else {
                                var selections = selectionModel.getSelections();
                                var arrayText = [];
                                var arrayID = [];

                                for (var i = 0; i < selections.length; i++) {
                                    arrayText.push(selections[i].get(scope.valueField));
                                    arrayID.push(selections[i].get(scope.displayField));
                                }
                                scope.Combo.setRawValue(arrayText.join(', '));
                                scope.Combo.setValue(arrayID.join(','));
                            }
                        }
                    },
                    rowselect: function(selectionModel, rowIndex, record) {
                        if (scope.simpleSelection) {
                            scope.Combo.setRawValue(record.get(scope.valueField));
                            scope.Combo.setValue(record.get(scope.displayField));
                            scope.Combo.collapse();
                            scope.Combo.fireEvent('select', scope.Combo, record, rowIndex);
                        } else {
                            var selections = selectionModel.getSelections();
                            var arrayText = [];
                            var arrayID = [];

                            for (var i = 0; i < selections.length; i++) {
                                arrayText.push(selections[i].get(scope.valueField));
                                arrayID.push(selections[i].get(scope.displayField));
                            }
                            scope.Combo.setRawValue(arrayText.join(', '));
                            scope.Combo.setValue(arrayID.join(','));
                        }
                    }
                });
            },
            initFunctions: function(scope) {
                scope.Combo.clearSelection = function() {
                    scope.sm.clearSelections();
                };

                scope.Combo.getSelection = function() {
                    if (scope.simpleSelection) {
                        return scope.sm.getSelected();
                    }
                    return scope.sm.getSelections();
                };

//                scope.buildGrid = function() {
//
//                    scope.sm = new Ext.grid.RowSelectionModel({
//                        singleSelect: scope.simpleSelection
//                    });
//
//                    scope.grid = new Ext.grid.GridPanel({
//                        store: scope.store,
//                        sm: scope.sm,
//                        border: false,
//                        loadMask: true,
//                        layout: 'fit',
//                        //height: 200,
//                        stripeRows: true,
//                        autoExpandColumn: 'displayField',
//                        columns: [
//                            {
//                                id: 'displayField',
//                                header: '',
//                                dataIndex: scope.displayField,
//                                sortable: false,
//                                hideable: false,
//                                menuDisabled: true,
//                                resizable: false
//                            }],
//                        tbar: [scope.tbCombo = new Ext.Toolbar({
//                                items: [scope.sfBuscar = new Ext.Cont.SearchField({
//                                        fnOnSearch: function() {
//                                            //filterBy();
//                                        },
//                                        fnOnClear: function() {
//                                            //filterBy();
//                                        }
//                                    })]
//                            })],
//                        bbar: [scope.btnAdd]
//                    });
//                    return scope.Combo;
//                };
            }
        });

