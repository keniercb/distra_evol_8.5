
var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('nomencladoresuam', cargarInterfaz);

function cargarInterfaz() {
    initaddnomenclador();
    //***********************para el grid gestionar nomencladores********************************
    stespecialidadnom = new Ext.data.Store({
        url: 'listarEspecialidades',
        reader: new Ext.data.JsonReader({
            id: 'idespecialidad',
            root: 'data'
        }, [{
                name: 'idespecialidad'
            }, {
                name: 'denespecialidad'
            }])
    });

    cbEspecialidadnom = new Ext.form.ComboBox({
        id: 'cbespecialidadnom',
        emptyText: 'Seleccione la especialidad',
        store: stespecialidadnom,
        valueField: 'idespecialidad',
        displayField: 'denespecialidad',
        anchor: '95%',
        mode: 'remote',
        allowBlank: false,
        editable: false,
        triggerAction: 'all',
        fieldLabel: 'Especialidad',
        enableKeyEvents: true,
        listeners: {
            select: function() {
            }
        }
    });
    //*******************botones**********************************************
    btnAdicionarnom = new Ext.Button({
        handler: function() {
            winaddnomenclador.show();
        },
        text: 'Adicionar',
        tooltip: 'Adicionar nomencladores',
        disabled: false,
        id: 'btnAdicionarnom',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn'
    });
    btnModificarnom = new Ext.Button({
        handler: function() {
        },
        text: 'Modificar',
        tooltip: 'Modificar nomencladores',
        disabled: true,
        id: 'btnModificarnom',
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn'
    });
    btnEliminarnom = new Ext.Button({
        handler: function() {
        },
        text: 'Eliminar',
        tooltip: 'Eliminar nomencladores',
        disabled: true,
        id: 'btnEliminarnom',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn'
    });
    btnBuscar = new Ext.Button({
        handler: function() {
        },
        text: 'Buscar',
        tooltip: 'Buscar',
        id: 'btnBuscar',
        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'btn'
    });
    btnLimpiar = new Ext.Button({
        handler: function() {
        },
        text: 'Limpiar',
        tooltip: 'Limpiar',
        id: 'btnLimpiar',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn'
    });
    btnAyuda = new Ext.Button({
        handler: function() {
        },
        text: 'Ayuda',
        tooltip: 'Ayuda',
        disabled: false,
        id: 'btnAyuda',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });


    // **************grid gest nomencladores******************************
    cmGpNomencladores = new Ext.grid.ColumnModel([
        {
            header: 'Denominación',
            id: 'expandirnom',
            dataIndex: 'denomnomenc',
            sortable: true,
            width: 200,
            editor: new Ext.form.TextField({})
        }, {
            header: 'Descripción',
            dataIndex: 'descripnomenc',
            sortable: true,
            width: 300,
            editor: new Ext.form.TextField({})
        }]);

    stGpNomencladores = new Ext.data.Store({
        url: 'listarNomencladores',
        listeners: {
            beforeload: function(st) {
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "id"
        }, [{
                name: 'id'
            }, {
                name: 'denomnomenc'
            }, {
                name: 'descripnomenc'
            }])
    });

    smGpNomencladores = new Ext.grid.RowSelectionModel({});

    gpNomencladores = new Ext.grid.EditorGridPanel({
        store: stGpNomencladores,
        sm: smGpNomencladores,
        cm: cmGpNomencladores,
        region: 'north',
        split: true,
        heigth: 400,
        autoExpandColumn: 'expandirnom',
        clicksToEdit: 2,
        frame: true,
        loadMask: {
            store: stGpNomencladores
        },
        md: new Ext.menu.Menu({
            id: 'menunom',
            items: [{
                    text: 'Adicionar datos',
                    tooltip: 'Adicionar datos',
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'btnaddnomenc',
                    handler: function() {
                        winadddatos.show();
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        },
        tbar: [btnAdicionarnom, btnModificarnom, btnEliminarnom, '-', '->', cbEspecialidadnom, btnBuscar, btnLimpiar, btnAyuda],
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stGpNomencladores,
            displayInfo: true
        })
    });
    //************************Grid panel datos de nomencladores******************************
    // Colum Model grid Datos nomencladores
    cmGpDatosNomencladores = new Ext.grid.ColumnModel([
        {
            header: "Denominación",
            sortable: true,
            id: 'expandirdatnomenc',
            dataIndex: 'denomdatosnomenc',
            editor: new Ext.form.TextField({})
        }, {
            header: "Descripción",
            sortable: true,
            width: 300,
            dataIndex: 'descripdatosnomenc',
            editor: new Ext.form.TextField({})
        }, {
            header: "ID",
            sortable: true,
            width: 100,
            hidden: true,
            dataIndex: 'id',
            editor: new Ext.form.TextField({})
        }]);


    stGpDatosNomencladores = new Ext.data.Store({
        url: 'listarDatosNomencladores',
        listeners: {},
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "id"
        }, [{
                name: 'id'
            }, {
                name: 'denomdatosnomenc'
            }, {
                name: 'descripdatosnomenc'
            }])
    });
    stGpDatosNomencladores.reload();
    // Selection Model grid smGpGestAtributos
    smGpDatosNomencladores = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    // Grid 
    gpDatosNomencladores = new Ext.grid.EditorGridPanel({
        frame: true,
        title: 'Datos Nomencladores',
        autoExpandColumn: 'expandirdatnomenc',
        store: stGpDatosNomencladores,
        region: 'center',
        height: 100,
        sm: smGpDatosNomencladores,
        cm: cmGpDatosNomencladores,
        md: new Ext.menu.Menu({
            id: 'menudatnomenc',
            items: [{
                    text: 'Modificar Datos',
                    tooltip: 'Modificar datos',
                    icon: perfil.dirImg + 'modificar.png',
                    iconCls: 'btn',
                    id: 'btnmoddatos',
                    handler: function() {
                    }
                }, {
                    text: 'Eliminar Datos',
                    tooltip: 'Eliminar datos',
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    id: 'btnelimdatos',
                    handler: function() {
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stGpDatosNomencladores,
            displayInfo: true
        })

    });

    panelnomencladores = new Ext.Panel({
        layout: 'fit',
        id: 'panelnomencladores',
        title: 'Nomencladores',
        collapsible: true,
        collapsed: false,
        titleCollapse: true,
        height: 400,
        region: 'north',
        split: true,
        listeners: {
            beforecollapse: function() {
                if (smGpNomencladores.getSelected() != undefined)
                    gpDatosNomencladores.setTitle('Nomencladores - ' + smGpNomencladores.getSelected().data.denomnomenc);
            },
            beforeexpand: function() {
                gpDatosNomencladores.setTitle('Datos de Nomencladores');
            }
        },
        items: [gpNomencladores]
    });

    paneldatosnomenc = new Ext.Panel({
        layout: 'fit',
        id: 'paneldatosnomenc',
        region: 'center',
        height: 100,
        items: [gpDatosNomencladores]
    });

    panelGeneral1 = new Ext.Panel({
        layout: 'border',
        id: 'panelGeneral1',
        items: [paneldatosnomenc, panelnomencladores]
    });

    // viewport de la plantilla
    vpNomencladores = new Ext.Viewport({
        layout: 'fit',
        items: [panelGeneral1]
    });

    stGpNomencladores.load();
    // Evento Selection Model grid rowselect
    gpNomencladores.getSelectionModel().on('rowselect', function(smodel, rowIndex, rc) {
        gpDatosNomencladores.expand();
        gpDatosNomencladores.getStore().reload({
            params: {
                id: rc.data.id
            }
        });
    }, this);
    smGpNomencladores.on('selectionchange', function(sm) {
        if (smGpNomencladores.getSelected()) {
            btnModificarnom.enable();
            btnEliminarnom.enable();
        }
        else {
        }
    }, this);

}// Endof cargarInterfaz

