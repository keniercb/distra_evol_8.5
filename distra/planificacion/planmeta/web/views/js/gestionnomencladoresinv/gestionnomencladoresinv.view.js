Ext.ns('Gestionar.Nomenclador.Inversiones');
var perfil = window.parent.UCID.portal.perfil;
Gestionar.Nomenclador.Inversiones.Vista = {
    init: function(idioma, modelo) {
        _this = this;

        _this.treePanelNomenclador = new Ext.tree.TreePanel({
            title: idioma.tlNomencladores,
            border: true,
            region: 'west',
            split: true,
            width: 215,
            height: 300,
            collapsible: true,
            rootVisible: true,
            loader: modelo.loaderTreeNomencladores,
            tbar: [{
                    iconCls: 'icon-expand-all',
                    tooltip: 'Expandir',
                    icon: perfil.dirImg + 'expand-all.gif',
                    handler: function() {
                        Gestionar.Nomenclador.Inversiones.Vista.treePanelNomenclador.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: 'Colapsar',
                    icon: perfil.dirImg + 'collapse-all.gif',
                    handler: function() {
                        Gestionar.Nomenclador.Inversiones.Vista.treePanelNomenclador.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: 'Refrescar todas las entidades',
                    icon: perfil.dirImg + 'table_refresh.png',
                    handler: function() {
                        Gestionar.Nomenclador.Inversiones.Vista.treePanelNomenclador.root.reload();
                    }
                }, '-', {
                    xtype: 'textfield',
                    emptyText: 'Filtrar entidad...',
                    width: 110,
                    id: 'idfiltroent',
                    listeners: {
                        specialkey: function(t, e) {
                            if (e.getKey() == '13') {
                                actualizarArbol(Gestionar.Nomenclador.Inversiones.Vista.treePanelNomenclador);
                            }
                        }
                    }
                }
            ],
            root: {
                text: 'Nomencladores',
                expanded: true,
                id: '0'
            }
        });


        _this.btnAyudaNomenclador = new Ext.Button({
            text: idioma.btnAyuda,
            tooltip: 'Muestra la Ayuda <b> (Alt+A)</b>',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            id: "idbtnAyudaN"
        });

        _this.btnEliminarNomenclador = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: 'Eliminar dato <b> (DEL)</b>',
            disabled: true,
            iconCls: 'eliminar'
        });

        _this.btnAdicionarNomenclador = new Ext.Button({
            text: idioma.btnAdicionar,
            id: 'btnAdd',
            tooltip: 'Adicionar dato <b> (Alt+I)</b>',
            disabled: true,
            iconCls: 'adicionar'
        });



        _this.filtrosnomen = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'string',
                    dataIndex: 'color'
                }, {
                    type: 'list',
                    dataIndex: 'uso',
                    options: ['Si', 'No']
                }
            ]
        });
        _this.btnLimpiarNomenclador = new Ext.Button({
            text: idioma.btnLimpiar,
            id: 'btnLimpiar',
            icon: perfil.dirImg + 'limpiar.png',
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
            iconCls: 'limpiar'
        });
        _this.pagingBar_gestionar_Nomenclador = new Ext.PagingToolbar({
            pageSize: 20,
            width: screen.width - 240,
            store: modelo.store_gestionar_inversiones,
            displayInfo: true,
            items: ['-', _this.btnLimpiarNomenclador]

        });

        _this.gridNomenclador = new Ext.grid.GridPanel({
            title: "Datos del nomenclador",
            region: 'center',
            height: 550,
            border: false,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            loadMask: {
                msg: 'Cargando...'
            },
            plugins: _this.filtrosnomen,
            store: modelo.store_gestionar_inversiones,
            columns: [
                {header: idioma.tlDenom, tooltip: 'Denominación', dataIndex: "denominacion", sortable: true, width: 300, renderer: crearToolTip},
                {header: idioma.tlDescripcion, tooltip: 'Descripción', sortable: true, dataIndex: 'descripcion', width: 300, renderer: crearToolTip},
                {header: idioma.tlColor, tooltip: 'Color', sortable: true, hidden: true, dataIndex: '', width: 300},
                {header: idioma.tlEnUso, tooltip: 'En uso', dataIndex: "uso", sortable: true, width: 300, renderer: enUso}],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'pNomen',
                store: modelo.store_gestionar_inversiones,
                displayInfo: true,
                items: ['-', _this.btnLimpiarNomenclador]
            })

        });

        _this.selModel = new Ext.tree.MultiSelectionModel({});

        _this.treeDatosNomencl = new Ext.tree.TreePanel({
            border: true,
            region: 'west',
            split: true,
            width: 360,
            height: 245,
            autoScroll: true,
            selModel: _this.selModel,
            loader: modelo.loaderDatosNomencl,
            root: {
                text: 'Tipo inversión programa',
                expanded: true,
                id: '0'
            }
        });


        _this.formulario_nomenclador = new Ext.form.FormPanel({
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            width: 380,
            height: 310,
            frame: false,
            items: [_this.treeDatosNomencl]
        });

        _this.panel_nomenclador = new Ext.Panel({
            title: "Datos de nomencladores",
            items: [_this.formulario_nomenclador]
        });

        _this.btn_aceptar_nomenclador = new Ext.Button({
            text: idioma.btnAceptar,
            tooltip: 'Guardar datos y cerrar la ventana',
            iconCls: 'aceptar',
            disabled: true
        });

        _this.btn_aplicar_nomenclador = new Ext.Button({
            text: idioma.btnAplicar,
            tooltip: 'Guardar datos y limpiar campos',
            iconCls: 'aplicar',
            disabled: true
        });

        _this.btn_cancelar_nomenclador = new Ext.Button({
            text: idioma.btnCancelar,
            tooltip: 'Cerrar ventana sin guardar datos',
            iconCls: 'cancelar'

        });


        _this.window_nomenclador = new Ext.Window({
            title: idioma.vtAddNomen,
            modal: true,
            width: 380,
            autoHeight: true,
            closeAction: 'hide',
            frame: true,
            items: [_this.panel_nomenclador],
            buttons: [_this.btn_cancelar_nomenclador, _this.btn_aplicar_nomenclador, _this.btn_aceptar_nomenclador]
        });


        _this.panel_grid_Nomenclador = new Ext.Panel({
            layout: 'border',
            region: 'center',
            tbar: [_this.btnAdicionarNomenclador, _this.btnEliminarNomenclador, '->', _this.btnAyudaNomenclador],
            items: [_this.gridNomenclador]
        });

        _this.panel_general = new Ext.Panel({
            layout: 'border',
            border: false,
            bodyStyle: 'padding:5px 5px 0',
            items: _this.panel_grid_Nomenclador
        });


        _this.view_port = new Ext.Viewport({
            layout: 'border',
            items: [_this.treePanelNomenclador,
                {
                    layout: 'card',
                    id: 'viewport',
                    activeItem: 0,
                    region: 'center',
                    items: [_this.panel_general]
                }]
        });

        //crear los tooltips de los grid
        function crearToolTip(v, m) {
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }

        function enUso(val, m) {

            if (val == 1) {
                m.attr = 'ext:qtip="' + "Si" + '"';
                return '<center><span><img src=' + perfil.dirImg + 'tick.png' + '></center>';
            } else {
                m.attr = 'ext:qtip="' + "No" + '"';
                return '<center><span><img src=' + perfil.dirImg + 'cross.png' + '></center>';
            }
        }




    }


};

function actualizarArbol(arbol, valor) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
                params: {
                    valor: valor
                }
            });
        }
    } else
        arbol.root.reload({
            params: {
                valor: valor
            }
        });
}

function mostrarAyuda(referencia, title) {
    var title = 'Ayuda';
    var referencia = 'nomencladorInv';
    help.show(title, referencia);
}