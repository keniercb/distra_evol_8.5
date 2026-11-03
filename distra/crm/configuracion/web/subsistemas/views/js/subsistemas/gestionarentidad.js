Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestionarentidad', cargarInterfaz);
var viewport, btnModificar, btnAyuda, winFpSubsistema, winModSubsistema;
var stGridSubsistema, smGpSubsistema, gpSubsistema;

// function CargarInterfaz
function cargarInterfaz() {
// Botones btnAdicionar btnModificar btnEliminar btnAyuda	
    btnModificar = new Ext.Button({disabled: true, id: 'btnMod', iconCls: 'modificar', text: perfil.etiquetas.lbBtnModificar, handler: function() {
            winFpSubsistema('Mod');
        }});
    btnAyuda = new Ext.Button({/*disabled: true,*/ id: 'btnAyu', iconCls: 'ayuda', text: perfil.etiquetas.lbBtnAyuda});
// Store grid stGridImpuesto
    stGridSubsistema = new Ext.data.Store({
        url: 'cargarsubs',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "subsistema",
            id: "idsubsistema"
        },
        [{name: 'idsubsistema'},
            {name: 'idsubsistematext'},
            {name: 'idestado'},
            {name: 'idestadotext'},
            {name: 'idestructurasubsist'},
            {name: 'idestructuracomun'},
            {name: 'checked'},
            {name: 'cierremod', type: 'bool'}
        ]
                )
    });


    Ext.grid.CheckColumn = function(config) {
        Ext.apply(this, config);
        if (!this.id) {
            this.id = Ext.id();
        }
        this.renderer = this.renderer.createDelegate(this);
    };

    Ext.grid.CheckColumn.prototype = {
        init: function(grid) {
            this.grid = grid;
            this.grid.on('render', function() {
                var view = this.grid.getView();
                view.mainBody.on('mousedown', this.onMouseDown, this);
            }, this);
        },
        onMouseDown: function(e, t) {
            if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
                e.stopEvent();
                var index = this.grid.getView().findRowIndex(t);
                var record = this.grid.store.getAt(index);
                record.set(this.dataIndex, !record.data[this.dataIndex]);
            }
        },
        renderer: function(v, p, record) {
            p.css += ' x-grid3-check-col-td';
            return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
        }
    };

    stComboestado = new Ext.data.Store({
        url: 'cargarestados',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: "estado",
            id: "idestadoo"},
        [{name: 'idestado'},
            {name: 'idestadotext'}]
                )
    });


    comboestado = new Ext.form.ComboBox({
        tabIndex: 9,
        id: 'idestadoo',
        allowBlank: false,
        mode: 'local',
        triggerAction: 'all',
        fieldLabel: 'Estado',
        valueField: 'idestado',
        displayField: 'idestadotext',
        hiddenName: 'idestado',
        readOnly: true,
        store: stComboestado

    });
    //valueField: 'cierremod',
    check = new Ext.form.Checkbox({
        hiddenName: 'cierremod',
        name: 'cierremod',
        //id:'cierremod',	
        fieldLabel: perfil.etiquetas.lbcheck,
        triggerAction: 'all',
        anchor: '95%'
    });

    smGpSubsistema = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: On_RowClick
        }
    });
// Evento Selection Model grid rowselect
    function On_RowClick(sm, indiceFila, record) {
        rec = record;
    }
    ;
    smGpSubsistema.on('rowselect', function(smodel, rowIndex, keepExisting, record) {
        btnModificar.enable();
    }, this);


    var cierre = new Ext.grid.CheckColumn({
        header: 'Cierre',
        dataIndex: 'checked',
        width: 100,
        sortable: true
    });

// Grid gestion Impuesto gpImpuesto
    gpSubsistema = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbTitGestionarEntidad,
        frame: true,
        iconCls: 'icon-grid',
        autoExpandColumn: 'expandir',
        store: stGridSubsistema,
        loadMask: {store: stGridSubsistema},
        viewConfig: {forceFit:true},
        margins: '2 2 2 -4',
        sm: smGpSubsistema,
        columns: [
            {hidden: true, hideable: false, dataIndex: 'idsubsistema'},
            {id: 'expandir', header: perfil.etiquetas.lbsubsistema, width: 100, dataIndex: 'idsubsistematext', sortable: true},
            {header: perfil.etiquetas.lbestado, width: 200, dataIndex: 'idestadotext', sortable: true},
            cierre,
            {hidden: true, hideable: false, dataIndex: 'idestructuracomun'},
            {hidden: true, hideable: false, dataIndex: 'cierremod'},
            {hidden: true, hideable: false, dataIndex: 'idestado'}
        ],
        tbar: [btnModificar, btnAyuda],
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stGridSubsistema,
            displayInfo: true
        })
    });
// viewport de la plantilla
    vpSubsistema = new Ext.Viewport({
        layout: 'fit',
        items: gpSubsistema
    });
// formulario fpImpuesto
    fpSubsistema = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        height: 300,
        autoScroll: true,
        width: 'auto',
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: '.5',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbsubsistema,
                                id: 'idsubsistematext',
                                readOnly: true
                            }, check
                        ]
                    }, {
                        columnWidth: '.5',
                        layout: 'form',
                        items: [comboestado]
                    }, {
                        xtype: 'hidden',
                        name: 'idsubsistema',
                        hiddenName: 'idsubsistema'
                    },
                    {
                        xtype: 'hidden',
                        name: 'idestructurasubsist',
                        hiddenName: 'idestructurasubsist'
                    },
                    {
                        xtype: 'hidden',
                        name: 'idestructuracomun',
                        hiddenName: 'idestructuracomun'
                    }

                ]
            }

        ],
        reader: new Ext.data.JsonReader({
            root: "subsistema",
            id: "idsubsistema"
        },
        [{name: 'idsubsistema'},
            {name: 'idsubsistematext'},
            {name: 'idestado'},
            {name: 'idestadotext'},
            {name: 'idestructurasubsist'},
            {name: 'checked'},
            {name: 'cierremod'},
            {name: 'idestructuracomun'}]
                )

    });

// Ventanas para formulario winFpImpuesto(opcion)  winModImpuesto
    function winFpSubsistema(opcion) {
        switch (opcion) {
            case 'Mod':
                {
                    fpSubsistema.getForm().reset();
                    if (!winModSubsistema) {
                        winModSubsistema = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
                            title: perfil.etiquetas.lbTitModificarImpuesto, width: 400, height: 200,
                            buttons: [{iconCls: 'cancelar',
                                    text: perfil.etiquetas.lbBtnCancelar,
                                    handler: function() {
                                        winModSubsistema.hide();
                                    }
                                }, {iconCls: 'aceptar',
                                    text: perfil.etiquetas.lbBtnAceptar,
                                    handler: function() {
                                        modificarSubsistema()
                                    }
                                }]
                        });
                    }
                    fpSubsistema.getForm().reset();
                    winModSubsistema.add(fpSubsistema);
                    winModSubsistema.doLayout();
                    winModSubsistema.show();
                    //fpSubsistema.getForm().load({success:function(){},waitMsg:'Cargando datos del subsistema...',url:'cargarmod',params:{idestructurasubsist:smGpSubsistema.getSelected().id}});
                    fpSubsistema.getForm().loadRecord(smGpSubsistema.getSelected());
                    Ext.Ajax.request({
                        url: 'check',
                        params: {idestructurasubsist: smGpSubsistema.getSelected().id},
                        callback: function(options, success, response) {
                            if (Ext.decode(response.responseText) == 1)
                            {
                                check.disable();
                            }
                            else
                                check.enable();
                        }
                    });

                }
                break;
        }
    }
// Cargo el grid de Subsistemas
    stGridSubsistema.load({params: {start: 0, limit: 10}});
}// Endof cargarInterfaz

// function modificarSubsistema
function modificarSubsistema() {
    if (fpSubsistema.getForm().isValid()) {
        fpSubsistema.getForm().submit({
            url: 'modificar',
            waitMsg: perfil.etiquetas.lbTitMsgModificandoU,
            failure: function(form, action) {
                if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                    gpSubsistema.getStore().reload();
                    btnModificar.disable();
                    winModSubsistema.hide();
                }
            }
        });
    } else
        mostrarMensaje(1, perfil.etiquetas.lbTitMsgCamposInc);



}
