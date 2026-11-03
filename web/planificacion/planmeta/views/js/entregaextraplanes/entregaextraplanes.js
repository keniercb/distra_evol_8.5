var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
var indicadores = [], eliminado = 0, tipos = '';
var campos_modificados = [];
UCID.portal.cargarEtiquetas('entregaextraplanes', cargarInterfaz);
var objci, titulo, titulo2, varadicionardoc = 0, identidadseleccionada, is_leaf, nombrentidadseleccionada, _parent, contaddind = false;
function cargarInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });
    mymask.show();
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function(options, success, response) {
            objci = Ext.decode(response.responseText);

            if (!objci.codMsg) {
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
                    for (i in acciones_reportes) {
                        objci.acciones[acciones_reportes[i].abreviatura] = true;
                    }
                    mymask.hide();
                });
            }
        }
    });
    btnAyudaEntregas = new Ext.Button({
        disabled: false,
        id: 'btnAyu',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbBtnAyuda,
        handler: function() {
            mostrarAyuda('Calculo de cobertura');
        }
    });
    btnAdicionarDoc = new Ext.Button({
        disabled: true,
        id: 'btnAdicionarDoc',
        icon: perfil.dirImg + 'adicionar.png',
        tooltip: 'Adicionar documento <b>(Alt+I)</b>',
        iconCls: 'btn',
        text: 'Ad<u>i</u>cionar',
        handler: function() {
            eliminado = 0;
            mymask.show();
            adicionarDocumento();
        }
    });
    btnEliminarDoc = new Ext.Button({
        disabled: true,
        id: 'btnEliminarDoc',
        icon: perfil.dirImg + 'eliminar.png',
        tooltip: 'Eliminar documento <b>(DEL)</b>',
        iconCls: 'btn',
        text: 'Eliminar',
        handler: function() {
            eliminado = 0;
            eliminarDocumento();
        }
    });


    mnAprobacionDoc = new Ext.Toolbar.MenuButton({
        text: 'Aprobación',
        id: 'mnAprobacionDoc',
        tooltip: {
            text: 'Aprobación'
        },
        icon: perfil.dirImg + 'area.png',
        iconCls: 'btn',
        menu: {
            items: [{
                    id: 'btnAprobarDoc',
                    icon: perfil.dirImg + 'aprobar.png',
                    iconCls: 'btn',
                    disabled: true,
                    text: 'Aprobar',
                    handler: function() {
                        eliminado = 0;
                        mymask.show();
                        aprobarDocumento(1);

                    }
                }, {
                    id: 'btnDesaprobarDoc',
                    icon: perfil.dirImg + 'desaprobar.png',
                    iconCls: 'btn',
                    text: 'Desaprobar',
                    disabled: true,
                    handler: function() {
                        eliminado = 0;
                        mymask.show();
                        aprobarDocumento(0);

                    }
                }]
        }
    });
    btnExportar = new Ext.Button({
        id: 'btnExportar',
        icon: perfil.dirImg + 'exportar.png',
        tooltip: 'Exportar documento<b>(Alt+E)</b>',
        iconCls: 'btn',
        disabled: true,
        text: 'Exportar',
        handler: function() {
            tipos = 'exportar';
            var identidad = identidadseleccionada;
            var datosdoc = [];
            var aprobacion = smgpEntrega.getSelected().data.aprobacion;
            var elabora = smgpEntrega.getSelected().data.elabora;
            var iddocumento = smgpEntrega.getSelected().data.iddocumento;
            var aprueba = smgpEntrega.getSelected().data.aprueba;
            var numero = smgpEntrega.getSelected().data.numero;
            var organismo = smgpEntrega.getSelected().data.organismo;
            var nombrentidad = nombrentidadseleccionada;
            var filtros = filtrosIndicadores.getFilterData();
            var win = window.open('exportarDocumento?' + '& filtros=' + Ext.encode(filtros) + '& aprobacion= ' + aprobacion + '& elabora= ' +
                    elabora + '& iddocumento= ' + iddocumento + '& aprueba= ' + aprueba + '& numero= ' + numero + '& organismo= ' +
                    organismo + '& nombrentidad= ' + nombrentidad + '& idejercicio= ' + cbEjercicio.getValue() + '& identidad= ' +
                    identidad + '& tipos= ' + tipos);
        }
    });
    mnVerDoc = new Ext.Toolbar.MenuButton({
        disabled: true,
        text: 'Ver documentos',
        id: 'mnVerDoc',
        tooltip: {
            text: 'Ver documentos'
        },
        icon: perfil.dirImg + 'ver.png',
        iconCls: 'btn',
        menu: {
            items: [{
                    id: 'btnDoc',
                    icon: perfil.dirImg + 'ver.png',
                    iconCls: 'btn',
                    text: 'Documentos',
                    handler: function() {
                        eliminado = 0;
                        stEntregas.reload();
                        gpEntrega.setTitle('Documentos ' + titulo2);

                    }
                },
                {
                    id: 'btnVerDocDel',
                    icon: perfil.dirImg + 'ver.png',
                    tooltip: 'Documentos eliminados',
                    iconCls: 'btn',
                    text: 'Documentos eliminados',
                    handler: function() {
                        btnAdicionarDoc.disable();
                        btnEliminarDoc.disable();
                        btnExportar.disable();
                        Ext.getCmp('btnAprobarDoc').disable();
                        Ext.getCmp('btnDesaprobarDoc').disable();
                        eliminado = 1;
                        stEntregas.reload();
                        gpEntrega.setTitle('Documentos eliminados ' + titulo2);
                    }
                }]
        }
    });


    btnLimpiarDoc = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarDoc',
        icon: perfil.dirImg + 'limpiar.png',
        tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
        iconCls: 'btn',
        text: 'Limpiar',
        handler: function() {
            eliminado = 0;
            filtrosEntregas.clearFilters();
        }
    });
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii',
            alt: true,
            fn: function() {
                if (!btnAdicionarDoc.hidden) {
                    if (!btnAdicionarDoc.disabled) {
                        mymask.show();
                        adicionarDocumento();
                    }

                }
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (!btnLimpiarDoc.hidden) {
                    if (!btnLimpiarDoc.disabled) {
                        eliminado = 0;
                        filtrosEntregas.clearFilters();
                    }
                }

            }

        }
        , {
            key: 'Hh',
            alt: true,
            fn: function() {
                if (!btnAyudaEntregas.hidden) {
                    if (!btnAyudaEntregas.disabled) {
                        mostrarAyuda('Calculo de cobertura');
                    }
                }

            }

        }, {
            key: 46,
            fn: function() {
                if (!btnEliminarDoc.hidden)
                    if (!btnEliminarDoc.disabled) {
                        eliminarDocumento();
                    }

            }
        }, {
            key: 'Ee',
            alt: true,
            fn: function() {
                if (!btnExportar.hidden) {
                    if (!btnExportar.disabled) {
                        tipos = 'exportar';
                        var identidad = identidadseleccionada;
                        var datosdoc = [];
                        var aprobacion = smgpEntrega.getSelected().data.aprobacion;
                        var elabora = smgpEntrega.getSelected().data.elabora;
                        var iddocumento = smgpEntrega.getSelected().data.iddocumento;
                        var aprueba = smgpEntrega.getSelected().data.aprueba;
                        var numero = smgpEntrega.getSelected().data.numero;
                        var organismo = smgpEntrega.getSelected().data.organismo;
                        var nombrentidad = nombrentidadseleccionada;
                        var filtros = filtrosIndicadores.getFilterData();
                        var win = window.open('exportarDocumento?' + '& filtros=' + Ext.encode(filtros) + '& aprobacion= ' + aprobacion + '& elabora= ' +
                                elabora + '& iddocumento= ' + iddocumento + '& aprueba= ' + aprueba + '& numero= ' + numero + '& organismo= ' +
                                organismo + '& nombrentidad= ' + nombrentidad + '& idejercicio= ' + cbEjercicio.getValue() + '& identidad= ' +
                                identidad + '& tipos= ' + tipos);
                    }
                }

            }

        }
    ]);
    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: false,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function(cb, rec, index) {
                if (identidadseleccionada != null) {
                    stEntregas.load({
                        params: {
                            idejercicio: cbEjercicio.getValue(),
                            limit: 20,
                            start: 0
                        }
                    });
                }
                mymask.hide();
            }
        }
    });
    tpEstructuraCobertura = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    tpEstructuraCobertura.btnBuscar.setText("");
    tpEstructuraCobertura.btnLimpiar.setText("");
    tpEstructuraCobertura = tpEstructuraCobertura.items.items[0];
    tpEstructuraCobertura.getRootNode().expand();
    tpEstructuraCobertura.region = 'west';
    tpEstructuraCobertura.width = 200;
    tpEstructuraCobertura.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            identidadseleccionada = n.id;
            nombrentidadseleccionada = n.text;
            is_leaf = n.leaf;
            _parent = n.attributes._parent;
            titulo = 'Documentos: ' + '(' + n.text + ')';
            titulo2 = '(' + n.text + ')';
            gpEntrega.setTitle(titulo);
            cbEjercicio.enable();
            mnVerDoc.enable();
            stEntregas.load({
                params: {
                    idejercicio: cbEjercicio.getValue(),
                    limit: 20,
                    start: 0
                }
            });
            if (is_leaf)
                btnAdicionarDoc.enable();
            else
                btnAdicionarDoc.disable();
        }
    });

    stEntregas = new Ext.data.Store({
        url: 'listarDocumento',
        listeners: {
            beforeload: function(st, opt) {
                stEntregas.removeAll();
                stEntregas.baseParams.identidad = identidadseleccionada;
                stEntregas.baseParams.hoja = is_leaf;
                stEntregas.baseParams.idejercicio = cbEjercicio.getValue();
                stEntregas.baseParams.eliminado = eliminado;
                stcbentidad.reload();
                stcbelabora.reload();
                stcbaprueba.reload();
                stcborganismo.reload();
                filtrosdocumento();

            },
            load: function() {
                if (filtrosEntregas.getFiltrosActivos().length > 0 && stEntregas.getCount() == 0)
                    mostrarMensaje(1, perfil.etiquetas.msgBuscar);
                storeDetallesInd.removeAll();
                if (varadicionardoc == 1) {

                    smgpEntrega.selectLastRow();
                }
                else
                    gridDetallesInd.collapse(true);


            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddocumento"
        },
        [{
                name: 'iddocumento'
            },
            {
                name: 'numero'
            },
            {
                name: 'elabora'
            }, {
                name: 'aprueba'
            }, {
                name: 'entidad'
            }, {
                name: 'cantidadind'
            },
            {
                name: 'organismo'
            },
            {
                name: 'idelabora'
            }, {
                name: 'idaprueba'
            },
            {
                name: 'idorganismo'
            }, {
                name: 'ejercicio'
            }, {
                name: 'aprobacion'
            }])
    });
    smgpEntrega = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(n, i, r) {
                if (smgpEntrega.hasSelection()) {
                    var selection = smgpEntrega.getSelections();
                    if (selection.length == 1) {
                        if (smgpEntrega.getSelected().data.cantidadind > 0)
                            Ext.getCmp('btnExportar').enable();
                        else
                            Ext.getCmp('btnExportar').disable();

                        if (smgpEntrega.getSelected().data.aprobacion == 0) {
                            Ext.getCmp('btnAdicionarIndDoc').enable();
                            Ext.getCmp('btnGuardar').enable();
                        }
                        else {
                            Ext.getCmp('btnAdicionarIndDoc').disable();
                            Ext.getCmp('btnGuardar').disable();
                            Ext.getCmp('btnEliminarIndDoc').disable();
                        }

                        storeDetallesInd.reload({
                            params: {
                                limit: 20,
                                start: 0
                            }
                        });
                        if (storeDetallesInd.getCount() > 0 || varadicionardoc == 1) {
                            gridDetallesInd.expand(true);
                        } else {
                            gridDetallesInd.collapse(true);
                        }

                        if (r.data.aprobacion > 0) {
                            contaddind = false;
                            Ext.getCmp('btnDesaprobarDoc').enable();
                            Ext.getCmp('btnAprobarDoc').disable();
                            Ext.getCmp('btnEliminarDoc').disable();
                        }
                        else {
                            contaddind = true;
                            Ext.getCmp('btnDesaprobarDoc').disable();
                            if (smgpEntrega.getSelected().data.cantidadind > 0)
                                Ext.getCmp('btnAprobarDoc').enable();
                            else
                                Ext.getCmp('btnAprobarDoc').disable();
                            Ext.getCmp('btnEliminarDoc').enable();
                        }


                    }
                    else {
                        Ext.getCmp('btnExportar').disable();
                        var contaprob = 0;
                        var contdesaprob = 0;
                        for (var i = 0; i < selection.length; i++) {
                            if (selection[i].data.aprobacion == 0)
                                contdesaprob += 1;
                            else
                                contaprob += 1;
                        }
                        if (contdesaprob == 0) {
                            Ext.getCmp('btnDesaprobarDoc').enable();
                            Ext.getCmp('btnAprobarDoc').disable();
                            Ext.getCmp('btnEliminarDoc').disable();

                        }

                        if (contaprob == 0) {
                            Ext.getCmp('btnDesaprobarDoc').disable();
                            Ext.getCmp('btnAprobarDoc').enable();
                            Ext.getCmp('btnEliminarDoc').enable();
                        }
                        if (contdesaprob != 0 && contaprob != 0) {
                            Ext.getCmp('btnDesaprobarDoc').enable();
                            Ext.getCmp('btnAprobarDoc').enable();
                            Ext.getCmp('btnEliminarDoc').enable();
                        }

                    }
                }
            },
            rowdeselect: function(s, n, r) {
                if (smgpEntrega.hasSelection()) {
                    var selection = smgpEntrega.getSelections();
                    if (selection.length == 1) {
                        if (smgpEntrega.getSelected().data.cantidadind > 0)
                            Ext.getCmp('btnExportar').enable();
                        else
                            Ext.getCmp('btnExportar').disable();

                        if (smgpEntrega.getSelected().data.aprobacion == 0) {
                            Ext.getCmp('btnAdicionarIndDoc').enable();
                            Ext.getCmp('btnGuardar').enable();
                        }
                        else {
                            Ext.getCmp('btnAdicionarIndDoc').disable();
                            Ext.getCmp('btnGuardar').disable();
                            Ext.getCmp('btnEliminarIndDoc').disable();
                        }

                        storeDetallesInd.reload({
                            params: {
                                limit: 20,
                                start: 0
                            }
                        });
                        if (storeDetallesInd.getCount() > 0 || varadicionardoc == 1) {
                            gridDetallesInd.expand(true);
                        } else {
                            gridDetallesInd.collapse(true);
                        }

                        if (r.data.aprobacion > 0) {
                            contaddind = false;
                            Ext.getCmp('btnDesaprobarDoc').enable();
                            Ext.getCmp('btnAprobarDoc').disable();
                            Ext.getCmp('btnEliminarDoc').disable();
                        }
                        else {
                            contaddind = true;
                            Ext.getCmp('btnDesaprobarDoc').disable();
                            if (smgpEntrega.getSelected().data.cantidadind > 0)
                                Ext.getCmp('btnAprobarDoc').enable();
                            else
                                Ext.getCmp('btnAprobarDoc').disable();
                            Ext.getCmp('btnEliminarDoc').enable();
                        }

                    }
                    else {
                        Ext.getCmp('btnExportar').disable();
                        var contaprob = 0;
                        var contdesaprob = 0;
                        for (var i = 0; i < selection.length; i++) {
                            if (selection[i].data.aprobacion == 0)
                                contdesaprob += 1;
                            else
                                contaprob += 1;
                        }
                        if (contdesaprob == 0) {
                            Ext.getCmp('btnDesaprobarDoc').enable();
                            Ext.getCmp('btnAprobarDoc').disable();
                            Ext.getCmp('btnEliminarDoc').disable();

                        }

                        if (contaprob == 0) {
                            Ext.getCmp('btnDesaprobarDoc').disable();
                            Ext.getCmp('btnAprobarDoc').enable();
                            Ext.getCmp('btnEliminarDoc').enable();
                        }
                        if (contdesaprob != 0 && contaprob != 0) {
                            Ext.getCmp('btnDesaprobarDoc').enable();
                            Ext.getCmp('btnAprobarDoc').enable();
                            Ext.getCmp('btnEliminarDoc').enable();
                        }

                    }
                }

            }
        }});
    cmEntregas = new Ext.grid.ColumnModel([
        {
            dataIndex: 'numero',
            header: perfil.etiquetas.lbnumero,
            sortable: true,
            align: 'center',
            width: 70,
            tooltip: perfil.etiquetas.lbnumero,
            renderer: crearToolTip
        },
        {
            dataIndex: 'ejercicio',
            header: perfil.etiquetas.lbejercicio,
            width: 100,
            align: 'left',
            hidden: true,
            sortable: true,
            tooltip: perfil.etiquetas.lbejercicio,
            renderer: crearToolTip

        },
        {
            dataIndex: 'entidad',
            header: 'Entidad',
            sortable: true,
            width: 100,
            align: 'left',
            tooltip: 'Entidad',
            renderer: crearToolTip
        },
        {
            dataIndex: 'elabora',
            header: perfil.etiquetas.lbelabora,
            sortable: true,
            width: 200,
            align: 'left',
            tooltip: perfil.etiquetas.lbelabora,
            renderer: crearToolTip
        },
        {
            dataIndex: 'aprueba',
            header: perfil.etiquetas.lbaprueba,
            sortable: true,
            width: 300,
            id: 'expand',
            tooltip: perfil.etiquetas.lbaprueba,
            renderer: crearToolTip
        },
        {
            dataIndex: 'aprobacion',
            header: perfil.etiquetas.lbaprobacion,
            width: 100,
            align: 'center',
            sortable: true,
            tooltip: perfil.etiquetas.lbaprobacion,
            renderer: modificarEstado

        },
        {
            dataIndex: 'organismo', id: 'organismo',
            header: perfil.etiquetas.lborganismo,
            width: 250,
            align: 'left',
            sortable: true,
            tooltip: perfil.etiquetas.lborganismo,
            renderer: crearToolTip

        }
        ,
        {
            dataIndex: 'cantidadind', id: 'cantidadind',
            header: 'Indicadores',
            width: 100,
            align: 'center',
            sortable: true,
            tooltip: 'Indicadores',
            hidden: true

        }
    ]);
    stcborganismo = new Ext.data.Store({
        url: 'listarEntidades',
        id: 'stcborganismo',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        },
        [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });
    stcbelabora = new Ext.data.Store({
        url: 'listarEntidades',
        id: 'stcbelabora',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        },
        [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });
    stcbentidad = new Ext.data.Store({
        url: 'listarEntidades',
        id: 'stcbentidad',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        },
        [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });
    stcbaprueba = new Ext.data.Store({
        url: 'listarEntidades',
        id: 'stcbaprueba',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        },
        [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });

    filtrosEntregas = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'numeric',
                dataIndex: 'numero'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadind'
            },
            {
                type: 'string',
                dataIndex: 'ejercicio'
            },
            {
                type: 'listado',
                dataIndex: 'entidad',
                idcombo: 'cbentidad',
                urlcb: 'listarEntidades',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stcbentidad,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            },
            {
                type: 'listado',
                dataIndex: 'elabora',
                idcombo: 'cbelabora',
                urlcb: 'listarEntidades',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stcbelabora,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            },
            {
                type: 'listado',
                dataIndex: 'aprueba',
                idcombo: 'cbaprueba',
                urlcb: 'listarEntidades',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stcbaprueba,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'boolean',
                dataIndex: 'aprobacion'
            },
            {
                type: 'listado',
                dataIndex: 'organismo',
                idcombo: 'cborganismo',
                urlcb: 'listarEntidades',
                valueFieldcb: 'identidad',
                displayFieldcb: 'denominacion',
                st: stcborganismo,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }]
    });


    gpEntrega = new Ext.grid.EditorGridPanel({
        title: 'Documentos',
        store: stEntregas,
        sm: smgpEntrega,
        region: 'center',
        height: 300,
        plugins: filtrosEntregas,
        autoExpandColumn: 'organismo',
        id: 'gpEntrega',
        autoExpand: true,
        cm: cmEntregas,
        loadMask: {
            store: stEntregas
        }, listeners: {
            click: function() {

            }
        },
        tbar: ['-', btnAdicionarDoc, '-', btnEliminarDoc, '-', mnAprobacionDoc, '-', mnVerDoc, '-', btnExportar], bbar: new Ext.PagingToolbar({
            id: 'paginado1', pageSize: 20,
            store: stEntregas,
            displayInfo: true,
            items: [btnLimpiarDoc]
        })
    });
    btnAdicionarIndDoc = new Ext.Button({
        id: 'btnAdicionarIndDoc',
        icon: perfil.dirImg + 'adicionar.png',
        tooltip: 'Adicionar indicador',
        iconCls: 'btn',
        disabled: true,
        text: 'Adicionar',
        handler: function() {
            adicionarInd();
        }
    });
    btnGuardar = new Ext.Button({
        disabled: true,
        id: 'btnGuardar',
        icon: perfil.dirImg + 'guardar.png',
        tooltip: 'Guardar los cambios',
        iconCls: 'btn',
        text: 'Guardar',
        handler: function() {
            mymask.show();
            actualizarCantidadInd(campos_modificados);

        }
    });
    btnEliminarIndDoc = new Ext.Button({
        disabled: true,
        id: 'btnEliminarIndDoc',
        icon: perfil.dirImg + 'eliminar.png',
        tooltip: 'Eliminar indicador',
        iconCls: 'btn',
        text: 'Eliminar',
        handler: function() {
            eliminarInd();
        }
    });
    btnLimpiarFiltrosIndicadores = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosIndicadores',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosIndicadores.clearFilters();
        }
    });
    stCmbViaAdq = new Ext.data.Store({
        url: 'listarViaAdq',
        id: 'stCmbViaAdq',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idviaadquisicion'
        },
        [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });
    stCmbOrgSat = new Ext.data.Store({
        url: 'listarOrgSat',
        id: 'stCmbOrgSat',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idorganosatisface'
        },
        [{
                name: 'idorganosatisface'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function() {
                flag6 = true;
            }
        }
    });

    stplan = new Ext.data.Store({
        url: 'listarModelos',
        id: 'stplan',
        autoload: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        },
        [{
                name: 'idmodelo'
            }, {
                name: 'denominacion'
            }])
    });

    filtrosIndicadores = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'plan',
                autoload: true,
                idcombo: 'idcbmodelogestnivactividad',
                urlcb: 'listarModelos',
                st: stplan,
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'denomviaadquisicion',
                idcombo: 'cbviaadquisicion',
                urlcb: 'listarViaAdq',
                valueFieldcb: 'idviaadquisicion',
                displayFieldcb: 'denominacion',
                st: stCmbViaAdq,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'listado',
                dataIndex: 'denomorgansatisface',
                idcombo: 'cborganosatisface',
                urlcb: 'listarOrgSat',
                valueFieldcb: 'idorganosatisface',
                displayFieldcb: 'denominacion',
                st: stCmbOrgSat,
                autoload: true,
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }]
    });
    storeDetallesInd = new Ext.data.Store({url: 'listarIndAsociadosaDoc',
        listeners: {
            beforeload: function() {
                tipos = 'listar';
                stCmbViaAdq.reload();
                stCmbOrgSat.reload();
                stplan.reload();
                storeDetallesInd.removeAll();
                storeDetallesInd.baseParams.iddocumento = smgpEntrega.getSelected().data.iddocumento;
                storeDetallesInd.baseParams.tipos = tipos;
            },
            load: function() {
                campos_modificados = [];
                if (storeDetallesInd.getCount() > 0 || varadicionardoc == 1) {
                    if (varadicionardoc == 1) {
                        varadicionardoc = 0;
                    }
                    gridDetallesInd.expand(true);
                } else {
                    gridDetallesInd.collapse(true);
                }

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        },
        [{name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'plan'
            }, {
                name: 'denominacion'
            }, {
                name: 'denomviaadquisicion'
            }, {
                name: 'denomorgansatisface'
            }, {
                name: 'necesidad'
            }, {
                name: 'importe'
            }, {
                name: 'idindicador'
            }]
                )
    });
    smgpDetallesInd = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(n, i, r) {
                if (smgpEntrega.hasSelection()) {
                    Ext.getCmp('btnEliminarIndDoc').enable();

                }
                else
                    Ext.getCmp('btnEliminarIndDoc').disable();
            },
            rowdeselect: function(s, n, r) {
                if (smgpEntrega.hasSelection()) {
                    Ext.getCmp('btnEliminarIndDoc').enable();

                }
                else
                    Ext.getCmp('btnEliminarIndDoc').disable();

            }

        }
    });
    gridDetallesInd = new Ext.grid.EditorGridPanel({
        store: storeDetallesInd,
        sm: smgpDetallesInd,
        region: 'south',
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        columns: [{
                id: 'codigo',
                header: "C&oacute;digo",
                width: 80,
                sortable: true,
                dataIndex: 'codigo'
            }, {
                header: "N&uacute;mero de pieza",
                width: 100,
                sortable: true,
                dataIndex: 'numeropieza',
                hidden: true,
                tooltip: 'Número de pieza',
                renderer: renderNopieza
            }, {
                id: 'plan',
                header: "Esfera",
                width: 80,
                sortable: true,
                dataIndex: 'plan',
                renderer: renderPlandirecto
            },
            {
                id: 'expandir',
                header: "Indicador",
                dataIndex: 'denominacion',
                tooltip: 'Indicador',
                renderer: crearToolTip,
                sortable: true
            }, {
                header: "V&iacute;a adquisición",
                width: 100,
                sortable: false,
                renderer: renderDenomviaadquisicion,
                dataIndex: 'denomviaadquisicion',
                tooltip: 'Vía de Adquisición'

            }, {
                header: "Órgano circulador",
                width: 100,
                sortable: false,
                renderer: renderOrgansatisface,
                dataIndex: 'denomorgansatisface',
                tooltip: 'Organo circulador'
            }, {
                id: 'necesidad',
                header: "Cantidad",
                width: 80,
                sortable: true, dataIndex: 'necesidad',
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    enableKeyEvents: true,
                    listeners: {
                        keypress: function(nf, e) {
                            if (e.getKey() == 100 || e.getKey() == 68) //d D
                                nf.setValue(0);
                        }
                    }
                })
            }, {
                id: 'importe',
                header: "Importe",
                width: 80,
                sortable: true,
                dataIndex: 'importe'
            }
        ],
        stripeRows: true,
        title: 'Indicadores',
        plugins: filtrosIndicadores,
        frame: true,
        height: 300,
        collapsible: true,
        collapsed: true,
        width: 800,
        tbar: [btnAdicionarIndDoc, '-', btnGuardar, '-', btnEliminarIndDoc],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeDetallesInd,
            displayInfo: true,
            items: [btnLimpiarFiltrosIndicadores, '-'],
            id: 'gridDetallesInd'
        }),
        listeners: {
            afteredit: function(sm) {
                campos_modificados[sm.row] = {
                    idindicador: sm.record.data.idindicador,
                    cantidad: sm.record.data.necesidad

                };

                Ext.getCmp('btnGuardar').enable();


            },
            validateedit: function(e) {
                campo = e.field;
                valor = e.value;
                ValidarOperacion(campo, valor, e);
            }
        }
    });

    panelDetalles = new Ext.FormPanel({
        frame: true,
        region: 'center',
        bodyStyle: 'padding:5px 5px 0',
        width: 800,
        height: 500,
        layout: 'border',
        items: [
            gpEntrega, gridDetallesInd]
    });


    pEntregas = new Ext.Panel({
        layout: 'border', height: 400,
        width: 600,
        tbar: ['Ejercicio:', cbEjercicio, '->', btnAyudaEntregas],
        items: [tpEstructuraCobertura, panelDetalles]

    });

    vpCalculoCovertura = new Ext.Viewport({
        layout: 'fit',
        id: 'vpCalculoCovertura',
        items: [pEntregas],
        listeners: {
            'afterlayout': function() {

                Ext.getCmp('btnAyu').focus();
            }

        }
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Hh',
            alt: true,
            fn: function() {
                if (!btnAyudaEntregas.hidden) {
                    if (!btnAyudaEntregas.disabled)
                        mostrarAyuda('Calculo de cobertura');
                }

            }
        }, {
            key: 'Ll', alt: true, fn: function() {
                if (!btnLimpiarFcob.hidden) {
                    if (!btnLimpiarFcob.disabled)
                        limpiarfiltrosCobertura();
                }
            }

        }

    ]);



}
function filtrosdocumento() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosEntregas.getFiltrosActivos() == undefined || filtrosEntregas.getFiltrosActivos().length == 0) {
        gpEntrega.setTitle(titulo);
    } else {
        for (i = 0; i < filtrosEntregas.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosEntregas.getFiltrosActivos()[i].dataIndex == "numero") {
                aux = 'número';
            } else if (filtrosEntregas.getFiltrosActivos()[i].dataIndex == "elabora") {
                aux = 'elabora';
            } else if (filtrosEntregas.getFiltrosActivos()[i].dataIndex == "aprueba") {//                 aux = 'aprueba';
            } else if (filtrosEntregas.getFiltrosActivos()[i].dataIndex == "ejercicio") {
                aux = 'ejercicio';
            }
            else if (filtrosEntregas.getFiltrosActivos()[i].dataIndex == "organismo") {//
                aux = 'organismo';
            } else if (filtrosEntregas.getFiltrosActivos()[i].dataIndex == "aprobacion") {
                aux = 'aprobación';
            }
            if (i == filtrosEntregas.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpEntrega.setTitle(titulo + ' filtrados por  : ' + filtrado_por);
        filtrado_por = "";
    }
}

function limpiarfiltrosCobertura() {

    if (gpEntrega.getStore().getCount() >= 0 && (filtrosEntregas.getFiltrosActivos()[0] != undefined || filtrosEntregas.getFiltrosActivos().length != 0)) {
        filtrosEntregas.clearFilters();

    } else if (filtrosEntregas.getFiltrosActivos()[0] == undefined || filtrosEntregas.getFiltrosActivos().length == 0) {
        mostrarMensaje(1, 'No existen elementos filtrados.');
    }
}

function mostrarAyuda(referencia, title) {
    var title = perfil.etiquetas.lbTituloAyudaCalculoCobertura;
    var referencia = 'calculocobertura2';
    help.show(title, referencia);
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function modificarEstado(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + "Si" + '"';
        m.css = 'icondistra-true verde';
        //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    }
    else {
        m.attr = 'ext:qtip="' + "No" + '"';
        //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    }
}

function gestionarPermiso() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue()
        },
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            mymask.hide();
        }
    });
}


function  eliminarInd() {
    mostrarMensaje(2, '¿Está seguro que quiere eliminar el(los) indicador(es) seleccionado(s)?', eliminarI);
}

function eliminarI(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        var rowsselecteddelind = [];
        if (gridDetallesInd.getSelectionModel().hasSelection()) {
            var selectiondeli = gridDetallesInd.getSelectionModel().getSelections();
            for (var i = 0; i < selectiondeli.length; i++) {
                rowsselecteddelind.push(selectiondeli[i].data.idindicador);
            }
        }
        Ext.Ajax.request({
            url: 'eliminarIndicadorDoc',
            params: {
                iddocumento: smgpEntrega.getSelected().data.iddocumento,
                idindicador: Ext.encode(rowsselecteddelind)
            },
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 21)
                    mostrarMensaje(1, 'El(Los) indicador(es) ha(n) sido eliminado(s) satisfactoriamente.');
                gridDetallesInd.getStore().reload();
            }
        });
    }
}

function adicionarInd() {
    btnLimpiarIndicadores = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarIndicadores',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosInd.clearFilters();

        }
    });
    stCmbUM = new Ext.data.Store({
        url: 'cargarUM',
        autoLoad: true,
        listeners: {
            load: function() {
                flag5 = true;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    filtrosInd = new Ext.grid.GridFilters({
        id: 'filtrosInd',
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'denomorgansatisface'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciomlc'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'cbFiltroUM',
                urlcb: 'cargarUM',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stCmbUM,
                autoload: true,
                mode: 'local'
            }, ]
    });
    storeGpInd = new Ext.data.Store({
        url: 'listarIndicadoresAddDoc',
        listeners: {
            beforeload: function() {
                storeGpInd.removeAll();
                storeGpInd.baseParams.idejercicio = cbEjercicio.getValue();
                storeGpInd.baseParams.iddocumento = smgpEntrega.getSelected().data.iddocumento;
                stCmbUM.reload();
            }
        },
        baseParams: {
            start: 0,
            limit: 20
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        },
        [{
                name: 'codigo'
            },
            {
                name: 'idindicador'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'umedida'
            }, {
                name: 'precio'
            }, {
                name: 'preciomlc'
            }]
                )
    });
    checkColumngridInd = new Ext.grid.CheckboxSelectionModel({singleSelect: false
    });
    cmgridInd = new Ext.grid.ColumnModel([
        checkColumngridInd,
        {
            id: 'codigo',
            header: "C&oacute;digo",
            width: 80,
            sortable: true,
            dataIndex: 'codigo'
        },
        {
            id: 'expandir',
            width: 130,
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            tooltip: 'Indicador', renderer: crearToolTip, sortable: true
        }, {
            id: 'expandir',
            header: "Descripci&oacute;n",
            dataIndex: 'descripcion',
            width: 130,
            tooltip: 'Indicador',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: "N&uacute;mero de pieza",
            width: 100,
            sortable: true,
            hidden: true,
            dataIndex: 'numeropieza',
            tooltip: 'Número de pieza',
            renderer: renderNopieza
        }, {
            header: "Unidad de medida",
            width: 120,
            sortable: true,
            dataIndex: 'umedida',
            tooltip: 'Unidad de Medida',
            renderer: crearToolTip
        }, {
            id: 'precio',
            header: "Precio",
            width: 80,
            sortable: true,
            dataIndex: 'precio'
        }, {
            id: 'preciomlc',
            header: "Precio MLC",
            width: 80,
            sortable: true,
            dataIndex: 'preciomlc'
        }]);

    smgridInd = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    gridInd = new Ext.grid.GridPanel({
        store: storeGpInd,
        sm: checkColumngridInd,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        cm: cmgridInd,
        stripeRows: true,
        title: 'Indicadores',
        frame: true,
        autoExpand: true,
        autoExpandColumn: 'preciomlc',
        height: 100,
        width: 790,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeGpInd,
            displayInfo: true,
            items: [btnLimpiarIndicadores, '-'],
            id: 'gridInd'}),
        plugins: filtrosInd
    });

    panelInd = new Ext.FormPanel({
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        width: 800,
        height: 500,
        layout: 'fit',
        items: [
            gridInd
        ]
    });
    winAddDoc = new Ext.Window({
        modal: true,
        id: 'winAddDoc', title: 'Adicionar indicador',
        layout: 'fit',
        width: 800,
        constrain: true,
        height: 550,
        closeAction: 'destroy',
        items: panelInd,
        resizable: false,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                id: 'idcancel',
                tooltip: 'Cerrar ventana sin guardar los datos (Alt+X)',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function() {
                    winAddDoc.destroy();
                }
            }, {icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                //disabled: true, 
                tooltip: 'Guardar datos y cerrar ventana (Enter)',
                id: 'btnaceptaraddnorma',
                text: "Aceptar",
                handler: function() {
                    adicionarIndADoc();
                    winAddDoc.destroy();
                }
            }]
    });
    winAddDoc.show();
    storeGpInd.load();
}
function adicionarIndADoc() {
    mymask.show();
    var rowsselectedadd = [];
    if (checkColumngridInd.hasSelection()) {
        var selectionadd = checkColumngridInd.getSelections();
        for (var i = 0; i < selectionadd.length; i++) {
            rowsselectedadd.push(selectionadd[i].data.idindicador);
        }
    }
    Ext.Ajax.request({
        url: 'addIndicadoresADoc',
        params: {
            iddocumento: smgpEntrega.getSelected().data.iddocumento,
            idindicadores: Ext.encode(rowsselectedadd)
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 21) {
                mostrarMensaje(1, 'El(Los) indicador(es) ha(n) sido adicionado(s) satisfactoriamente.');
            }
            gridDetallesInd.getStore().removeAll();
            gridDetallesInd.getStore().reload({params: {
                    start: 0,
                    limit: 20

                }});
            gridInd.getStore().removeAll();
            gridInd.getStore().reload({params: {
                    start: 0,
                    limit: 20

                }});
        }
    });
}
function renderDenomviaadquisicion(value) {
    if (value == null)
        return '-';
    else
        return value;
}
function renderOrgansatisface(value) {
    if (value == null)
        return '-';
    else
        return value;
}
function renderPlandirecto(val, x, rec) {
    if (val == null)
        return '-';
    else
        return rec.data.denmodelo;
}
function renderNopieza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == "" || value == null)
        return '-';
    else
        return value;
}
function adicionarDocumento() {
    Ext.Ajax.request({
        url: 'insertarDocumento',
        params: {
            identidad: identidadseleccionada,
            identidadpadre: _parent,
            idejercicio: cbEjercicio.getValue()
        },
        callback: function(options, success, response) {
            mymask.hide();
            varadicionardoc = 1;
            var total = gpEntrega.getStore().getTotalCount();
            var extra = total % Ext.getCmp('paginado1').pageSize;
            var lastStart = extra ? (total - extra) : total - Ext.getCmp('paginado1').pageSize;
            Ext.getCmp('paginado1').doLoad(lastStart);
        }
    });
}
function aprobarDocumento(aprobacion) {
    var rowsselected = [];
    if (smgpEntrega.hasSelection()) {
        var selection = smgpEntrega.getSelections();
        for (var i = 0; i < selection.length; i++) {
            if (aprobacion == 0) {
                if (selection[i].data.aprobacion != 0) {
                    rowsselected.push(selection[i].id);
                }
            }
            else {
                if (selection[i].data.aprobacion == 0) {
                    rowsselected.push(selection[i].id);
                }
            }
        }
    }

    Ext.Ajax.request({
        url: 'gestionarAprobacion',
        params: {
            arrayiddocumentos: Ext.encode(rowsselected),
            aprobacion: aprobacion
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                if (aprobacion == 1)
                    mostrarMensaje(1, 'El(Los) documento(s) ha(n) sido aprobado(s) satisfactoriamente.');
                else
                    mostrarMensaje(1, 'El(Los) documento(s) ha(n) sido desaprobado(s) satisfactoriamente.')
            }
            gpEntrega.getStore().reload();
        }
    });
}
function  eliminarDocumento() {
    mostrarMensaje(2, '¿Está seguro que quiere eliminar el(los) documento(s) seleccionado(s)?', eliminar);
}
function eliminar(btnPresionado) {
    if (btnPresionado == 'ok') {
        mymask.show();
        var rowsselecteddel = [];
        if (smgpEntrega.hasSelection()) {
            var selectiondel = smgpEntrega.getSelections();
            for (var i = 0; i < selectiondel.length; i++) {
                if (selectiondel[i].data.aprobacion == 0) {
                    rowsselecteddel.push(selectiondel[i].id);
                }

            }
        }
        Ext.Ajax.request({
            url: 'eliminarDocumento',
            params: {
                arrayiddocumentos: Ext.encode(rowsselecteddel)
            },
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 21)
                    mostrarMensaje(1, 'El(Los) documento(s) ha(n) sido eliminado(s) satisfactoriamente.');
                gpEntrega.getStore().reload();
            }
        });
    }
}
function actualizararbolCobertura(arbol, valor) {

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
function ValidarOperacion(campo, valor, sm) {

    if (campo == 'ajuste' && valor < 0 && (-1 * valor) > sm.record.data.nivelactividad) {

        Ext.MessageBox.show({
            title: 'Información',
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgAjusteIncorrecto,
            icon: Ext.MessageBox.INFO
        });
        sm.cancel = true;
    }

}
function actualizarCantidadInd(campos_modificados) {


    if (campos_modificados.length > 0) {

        Ext.Ajax.request({
            url: 'actualizarCantidadInd',
            params: {
                indicadores: Ext.encode(campos_modificados),
                iddocumento: smgpEntrega.getSelected().data.iddocumento
            },
            callback: function(options, success, response) {
                mymask.hide();

                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 3) {
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                }
                if (responseData.codMsgE == 1) {
                    mostrarMensaje(1, 'El(Los) valor(es) insertados sobre lo(s) indicador(es) seleccionado(s) ha(n) sido guardado(s) satisfactoriamente.');
                    gridDetallesInd.getStore().reload();
                }
            }
        });
    } else {
        mymask.hide();
        mostrarMensaje(1, 'Debe modificar al menos un indicador.');
    }
    campos_modificados = [];
}