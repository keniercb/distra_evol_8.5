Ext.namespace('Ext.UITraspasoAvanzadoDuo');

Ext.UITraspasoAvanzadoDuo = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnTraspAvanzadoCerrar = new Ext.Button({
            id: 'btnTraspAvanzadoCerrar',
            text: scope.etiquetas.lbBtnCerrar,
            tooltip: scope.etiquetas.lbBtnCerrar,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnTraspAceptar = new Ext.Button({
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.lbBtnAceptar,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            scope: this
        });
        scope.btnBuscar = new Ext.Button({
            text: scope.etiquetas.lbBtnBuscar.replace('<u>', '').replace('</u>', ''),
            tooltip: scope.etiquetas.tooltipBuscar,
//            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'buscar',
            disabled: true,
            scope: this
        });

        scope.tfSearchLeftGrid = new Ext.form.TextField({
            emptyText: scope.etiquetas.lbBuscar + '...',
            id: 'tfSearchLeftGrid',
            enableKeyEvents: true,
            disabled: true
        });

        scope.tfSearchRightGrid = new Ext.form.TextField({
            emptyText: scope.etiquetas.lbBuscar + '...',
            id: 'tfSearchRightGrid',
            enableKeyEvents: true,
            disabled: true
        });

        scope.btnAgregarTodos = new Ext.Toolbar.Button({
            text: scope.etiquetas.lbAddAll,
            tooltip: scope.etiquetas.tooltipAddAll,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            style: 'margin:0 15 0 0',
            scope: this
        });

        scope.btnRemoveTodos = new Ext.Toolbar.Button({
            text: scope.etiquetas.lbRemoveAll,
            tooltip: scope.etiquetas.tooltipRemoveAll,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            style: 'margin:0 15 0 0',
            scope: this
        });

        scope.lbdisponibles = new Ext.Toolbar.TextItem({
            text: scope.etiquetas.lbCantDisponibles.replace('<#>', '0'),
            style: 'margin:0 0 0 20'
        });

        scope.lbseleccionados = new Ext.Toolbar.TextItem({
            text: scope.etiquetas.lbCantSeleccionados.replace('<#>', '0'),
            style: 'margin:0 0 0 20'
        });

        scope.cbTraspEntidadO = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccione,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbOrigen,
            validator: function() {
                var selOrig = Ext.getCmp('cbxEntidadO').fSelect.values;
                var selDest = Ext.getCmp('cbxEntidadD').fSelect.values;
                if (selOrig.length > 0) {
                    for (var i = 0; i < selOrig.length; i++) {
                        if (selDest.indexOf(selOrig[i]) !== -1) {
                            return selOrig.length === 1 ? scope.etiquetas.msgErrorOequalD : scope.etiquetas.msgErrorOequalDPlusOne.replace("<#>", Ext.getCmp('cbxEntidadO').fSelect.display[i]);
                        }
                    }
                }
                return true;
            }
        }, {
            identificador: 'EntidadO',
            displayText: 'Entidad',
            url: 'loadTreeEntidades',
            autoLoad: false,
//            singleSelect: true,
            reader: scope.jrEntidadO = new Ext.data.JsonReader({
                id: 'idestructuracomun',
                root: 'tree'
            }, [{
                    name: '_parent',
                    mapping: 'idestructuraepadre'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idestructurae'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'idestructuraepadre'
                }, {
                    name: 'codigo',
                    mapping: 'codigoestructura'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'ordender'
                }])
        });

        scope.cbTraspEntidadD = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccione,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbDestino,
            validator: function() {
                var selOrig = Ext.getCmp('cbxEntidadO').fSelect.values;
                var selDest = Ext.getCmp('cbxEntidadD').fSelect.values;
                if (selDest.length > 0) {
                    if (selOrig.indexOf(selDest[0]) !== -1) {
                        return scope.etiquetas.msgErrorDequalO;
                    }
                }
                return true;
            }
        }, {
            identificador: 'EntidadD',
            displayText: 'Entidad',
            url: 'loadTreeEntidades',
            autoLoad: true,
            singleSelect: true,
            reader: scope.jrEntidadD = new Ext.data.JsonReader({
                id: 'idestructuracomun',
                root: 'tree'
            }, [{
                    name: '_parent',
                    mapping: 'idestructuraepadre'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idestructurae'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'idestructuraepadre'
                }, {
                    name: 'codigo',
                    mapping: 'codigoestructura'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'ordender'
                }])
        });

        scope.cbTraspCliente = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbTraspCliente',
            store: scope.stTraspCliente,
            fieldLabel: scope.etiquetas.lbCliente,
            allowBlank: false,
            displayField: 'nombrecliente',
            tpl: '<tpl for="."><div ext:qtip="{nombrecliente}" class="x-combo-list-item">{nombrecliente}</div></tpl>',
            valueField: 'idcliente',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            emptyText: scope.etiquetas.lbSeleccione,
            selectOnFocus: true,
            resizable: true,
            anchor: '100%'
        });

        scope.smLeftGrid = new Ext.grid.RowSelectionModel({
//            singleSelect: true
        });

        scope.smRightGrid = new Ext.grid.RowSelectionModel({
//            singleSelect: true
        });

        scope.leftColModel = new Ext.grid.ColumnModel([
            {id: 'name', header: scope.etiquetas.lbNumDocumento, width: 160, sortable: true, dataIndex: 'numero'},
            {header: scope.etiquetas.lbCuenta, width: 50, sortable: true, dataIndex: 'text'},
            {hidden: true, hideable: false, header: scope.etiquetas.lbEntidad.toUpperCase(), sortable: true, dataIndex: 'estructuracomun'},
            {header: scope.etiquetas.lbImporte, width: 50, sortable: true, dataIndex: 'importemb', align: 'right', renderer: formatoMonedaABS},
            {hidden: true, hideable: false, dataIndex: 'idderechouobligacion', id: 'idderechouobligacion'},
            {hideable: false, menuDisabled: true, id: 'action', header: "", width: 8, align: 'center', renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                    return scope.createActionColumn(value, metadata, record, rowIndex, colIndex, store);
                }}
        ]);

        scope.leftGrid = new Ext.grid.GridPanel({
            id: 'leftGrid',
            enableDragDrop: true,
            //ddText: "{0} fila(s) seleccionada(s)",
            ddGroup: 'leftGridDDGroup',
            autoScroll: true,
            frame: false,
            region: 'center',
            loadMask: true,
            border: false,
            height: 300,
            width: Ext.lib.Dom.getViewWidth() / 2 - 10,
            sm: scope.smLeftGrid,
            store: scope.stLeftGrid,
            viewConfig: {
                forceFit: true
            },
            cm: scope.colModelL = scope.leftColModel,
            tbar: scope.leftbar = new Ext.Toolbar({
                items: [scope.tfSearchLeftGrid, '-', scope.lbdisponibles, '->', scope.btnAgregarTodos]
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                ShowGroupName: true,
                enableNoGroup: false,
                enableGropingMenu: false,
                hideGroupedColumn: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
            })
        });

        scope.rightColModel = new Ext.grid.ColumnModel([
            {id: 'name', header: scope.etiquetas.lbNumDocumento, width: 160, sortable: true, dataIndex: 'numero'},
            {header: scope.etiquetas.lbCuenta, width: 50, sortable: true, dataIndex: 'text'},
            {hidden: true, hideable: false, header: scope.etiquetas.lbEntidad.toUpperCase(), sortable: true, dataIndex: 'estructuracomun'},
            {header: scope.etiquetas.lbImporte, width: 50, sortable: true, dataIndex: 'importemb', align: 'right', renderer: formatoMonedaABS},
            {hidden: true, hideable: false, dataIndex: 'idderechouobligacion', id: 'idderechouobligacion'},
            {hideable: false, menuDisabled: true, id: 'action', header: "", width: 8, align: 'center', renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                    return scope.createDelActionColumn(value, metadata, record, rowIndex, colIndex, store);
                }}
        ]);

        scope.rightGrid = new Ext.grid.GridPanel({
            id: 'rightGrid',
            enableDragDrop: true,
            //ddText: "{0} fila(s) seleccionada(s)",
            ddGroup: 'rightGridDDGroup',
            autoScroll: true,
            frame: false,
            region: 'east',
            border: false,
            width: Ext.lib.Dom.getViewWidth() / 2 - 10,
            height: 300,
            sm: scope.smRightGrid,
            store: scope.stRightGrid,
            viewConfig: {
                forceFit: true
            },
            cm: scope.colModelR = scope.rightColModel,
            tbar: scope.rightbar = new Ext.Toolbar({
                items: [scope.tfSearchRightGrid, '-', scope.lbseleccionados, '->', scope.btnRemoveTodos]
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                ShowGroupName: true,
                enableNoGroup: false,
                enableGropingMenu: false,
                hideGroupedColumn: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
            })
        });

        scope.fpTraspDuo = new Ext.form.FormPanel({
            frame: true,
            border: false,
            id: 'fpTraspDuo',
            layout: 'border',
            region: 'center',
            labelAlign: 'left',
            items: [{
                    region: 'north',
                    id: 'pTop',
                    labelAlign: 'top',
                    layout: 'column',
                    style: 'margin:10 0 0 0',
                    autoHeight: true,
                    items: [{
                            columnWidth: .35,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: [scope.cbTraspEntidadO]
                        }, {
                            columnWidth: .35,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: [scope.cbTraspEntidadD]
                        }, {
                            columnWidth: .3,
                            layout: 'form',
                            style: 'margin:0 0 0 10',
                            items: [scope.cbTraspCliente]
                        }, {
                            style: 'margin:18 10 0 10',
                            items: [scope.btnBuscar]
                        }]
                }, {
                    id: 'pDown',
                    region: 'center',
                    layout: 'border',
                    style: 'margin:20 5 0 5',
                    border: true,
                    items: [{
                            layout: 'fit',
                            region: 'center',
                            items: [scope.leftGrid]
                        }, {
                            layout: 'fit',
                            region: 'east',
                            style: 'margin:0 0 0 5',
                            items: [scope.rightGrid]
                        }]
                }]
        });

        Ext.apply(this, {
            modal: true,
            id: 'winTrasp',
            frame: true,
            border: false,
            resizable: false,
            layout: 'border',
            defaultButton: 'btnTraspAvanzadoCerrar',
            closable: false,
            title: scope.etiquetas.tTraspaso,
            items: [scope.fpTraspDuo],
            buttons: [scope.btnTraspAvanzadoCerrar, scope.btnTraspAceptar]
        });

        return Ext.UITraspasoAvanzadoDuo.superclass.constructor.call(this);
    }
});
