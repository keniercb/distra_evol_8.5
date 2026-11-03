var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('reporteenmarcamiento', cargarAccionesP);
objci = {};
objci.acciones = [];
var primero_vad = false;
var mymask = new Ext.LoadMask(Ext.getBody(), {
    msg: "Cargando ..."
});

function cargarAccionesP() {
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        cargarInterfaz();
    });
}

function cargarInterfaz() {
    tfimportetotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'tfimportetotal',
        width: 100,
        align: 'right',
        disabled: false,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000'
    });

    stCbtotalEnm = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, 'Enmarcamiento Plan'],
            [2, 'Enmarcamiento Real'],
            [3, 'Diferencia'],
            [4, 'Enmarcamiento Plan Vía'],
            [5, 'Enmarcamiento Real Vía'],
            [6, 'Diferencia Vía']

        ]
    });
    CbtotalEnm = new Ext.form.ComboBox({
        value: 1,
        store: stCbtotalEnm,
        displayField: 'denominacion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 150,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                if (CbtotalEnm.getValue() == 1) {
                    tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totalplan);
                } else if (CbtotalEnm.getValue() == 2) {
                    tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totalreal);
                } else if (CbtotalEnm.getValue() == 3) {
                    tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totaldiferencia);
                }
                else if (CbtotalEnm.getValue() == 4) {
                    tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totalplanv);
                }
                else if (CbtotalEnm.getValue() == 5) {
                    tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totalrealv);
                }
                else if (CbtotalEnm.getValue() == 6) {
                    tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totaldiferenciav);
                }
            }

        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (!btnLimpiarFiltrosComportamiento.hidden) {
                    if (!btnLimpiarFiltrosComportamiento.disabled)
                        limpiarfiltrosComportamiento();
                }

            }

        },
        {
            key: 'Ee',
            alt: true,
            fn: function() {
                filtros = filtrosComportamiento.getFilterData();
                var win = window.open('exportarOD?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue());

            }


        }

    ]);
    
     this.btnAyudaEnmarcamiento = new Ext.Button({
            id: 'btnAyudaEnmarcamiento',
           // icon: perfil.dirImg + 'ayuda.png',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            iconCls: 'ayuda',
           // text: 'Ayuda'
        });

    btnExportarComportamiento = new Ext.Button({
        id: 'btnExportarComportamiento',
       // icon: perfil.dirImg + 'exportar.png',
        tooltip: perfil.etiquetas.lbTtBtnExportar,
        iconCls: 'exportar',
      //  text: perfil.etiquetas.lbBtnExportar,
        handler: function() {
            filtros = filtrosComportamiento.getFilterData();
          var idpadre=  stGpComportamiento.reader.jsonData.data[0].idpadre;
            var win = window.open('exportarOD?filtros=' + Ext.encode(filtros) + '& idejercicio=' + cbEjercicio.getValue()+'& idpadre='+idpadre);
        }
    });
    btnLimpiarFiltrosComportamiento = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosComportamiento',
      //  icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function() {
            limpiarfiltrosComportamiento();
        }
    });

    jrstGpComportamiento = new Ext.data.JsonReader({
        totalProperty: 'total',
        totalplan: 'totalplan',
        totalreal: 'totalreal',
        totaldiferencia: 'totaldiferencia',
        root: "data"
    }, [{
            name: 'denominacionentidadpadre'
        }, {
            name: 'denominacionentidad'
        }, {
            name: 'denominacioncb'
        }, {
            name: 'enmarcamientoplan'
        }, {
            name: 'enmarcamientoreal'
        }, {
            name: 'diferencia'
        }, {
            name: 'enmarcamientoplanv'
        }
        , {
            name: 'denominacionvia'
        }, {
            name: 'enmarcamientorealv'
        }, {
            name: 'diferenciav'
        }, {
            name: 'totalplan'
        }, {
            name: 'totalreal'
        }, {
            name: 'totaldiferencia'
        }
    ]);

    stGpComportamiento = new Ext.data.Store({
        url: 'listarComportamiento',
        listeners: {
            load: function() {

                tfimportetotal.setValue(stGpComportamiento.reader.jsonData.totalplan);

                siexisteComportamientoFiltrado();
                if (stGpComportamiento.reader.jsonData.sobrepasado == 1)
                    mostrarMensaje(1, 'Existen entidades cuyo enmarcamiento real es mayor que el planificado.');
            },
            beforeload: function() {
                this.baseParams.idejercicio = cbEjercicio.getValue();
            }
        },
        reader: jrstGpComportamiento
    });

    cmComportamiento = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbEntidadP,
            dataIndex: 'denominacionentidadpadre',
            sortable: true,
            width: 200,
            align: 'left',
            tooltip: perfil.etiquetas.lbEntidadP,
            renderer: crearToolTipPadre
        },
        {
            header: perfil.etiquetas.lbEntidad,
            dataIndex: 'denominacionentidad',
            sortable: true,
            align: 'left',
            width: 200,
            tooltip: perfil.etiquetas.lbEntidad,
            renderer: crearToolTipPadre
        },
        {
            header: perfil.etiquetas.lbCB,
            dataIndex: 'denominacioncb',
            sortable: true,
            align: 'left',
            width: 200,
            tooltip: perfil.etiquetas.lbCB,
            renderer: crearToolTipPadre
        }, {
            header: perfil.etiquetas.lbEnmarcamientoPlan,
            dataIndex: 'enmarcamientoplan',
            sortable: true,
            align: 'right',
            width: 150,
            tooltip: perfil.etiquetas.lbEnmarcamientoPlan,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEnmarcamientoReal,
            dataIndex: 'enmarcamientoreal',
            sortable: true,
            align: 'right',
            width: 150,
            tooltip: perfil.etiquetas.lbEnmarcamientoReal,
            renderer: crearToolTip
        }, {
            id: 'idcmComportamiento',
            header: perfil.etiquetas.lbDiferencia,
            dataIndex: 'diferencia',
            sortable: true,
            align: 'right',
            width: 150,
            tooltip: perfil.etiquetas.lbDiferencia,
            renderer: crearToolTip
        }
        , {
            header: perfil.etiquetas.lbVia,
            dataIndex: 'denominacionvia',
            sortable: true,
            width: 200,
            align: 'left',
            tooltip: perfil.etiquetas.lbVia,
            renderer: crearToolTipPadre
        }, {
            header: perfil.etiquetas.lbEnmarcamientoPlanV,
            dataIndex: 'enmarcamientoplanv',
            sortable: true,
            align: 'right',
            width: 150,
            tooltip: perfil.etiquetas.lbEnmarcamientoPlanV,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbEnmarcamientoRealV,
            dataIndex: 'enmarcamientorealv',
            sortable: true,
            align: 'right',
            width: 150,
            tooltip: perfil.etiquetas.lbEnmarcamientoRealV,
            renderer: crearToolTip
        }, {
            id: 'idcmViaAdq',
            header: perfil.etiquetas.lbDiferenciaV,
            dataIndex: 'diferenciav',
            sortable: true,
            align: 'right',
            width: 150,
            tooltip: perfil.etiquetas.lbDiferenciaV,
            renderer: crearToolTip
        }
    ]);

    smGpComportamiento = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    stCmblistarEntidad = new Ext.data.Store({
        id: 'stCmblistarEntidad',
        url: 'cargarEntidades',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'text'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });
    stCmblistarEspecialidad = new Ext.data.Store({
        id: 'stCmblistarEspecialidad',
        url: 'cargarEntidadesPadre',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'id'
            }, {
                name: 'text'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });
    stCmblistarCentro = new Ext.data.Store({
        id: 'stCmblistarCentro',
        url: 'listarCentroBalanceEnmarcado',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idorgano'
            }, {
                name: 'denominacion'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });
    stCmblistarViaAdq = new Ext.data.Store({
        id: 'stCmblistarViaAdq',
        url: 'listarFiltrosViaAdq',
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }]),
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function() {
            }
        }
    });
    filtrosComportamiento = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'denominacionentidadpadre',
                idcombo: 'cbfiltroespecialidades',
                urlcb: 'cargarEntidadesPadre',
                valueFieldcb: 'text',
                displayFieldcb: 'text',
                idstore: 'stCmblistarEspecialidad',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'listado',
                dataIndex: 'denominacionentidad',
                idcombo: 'cbfiltroentidades',
                urlcb: 'cargarEntidades',
                valueFieldcb: 'text',
                displayFieldcb: 'text',
                idstore: 'stCmblistarEntidad',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'
            }, {
                type: 'listado',
                dataIndex: 'denominacioncb',
                idcombo: 'cbplandirectofiltro',
                urlcb: 'listarCentroBalanceEnmarcado',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                idstore: 'stCmblistarCentro',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientoplan'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientoreal'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }
            ,
            {
                type: 'listado',
                dataIndex: 'denominacionvia',
                idcombo: 'cbfiltroViaAdq',
                urlcb: 'listarFiltrosViaAdq',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                idstore: 'stCmblistarViaAdq',
                mode: 'local',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientoplanv'
            }, {
                type: 'numeric',
                dataIndex: 'enmarcamientorealv'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciav'
            }]
    });

    gpComportamiento = new Ext.grid.EditorGridPanel({
        id: 'gpComportamiento',
        autoExpandColumn: 'idcmComportamiento',
        title: perfil.etiquetas.lbComportamiento,
        store: stGpComportamiento,
        margins: '2 2 2 -4',
        plugins: filtrosComportamiento,
        clicksToEdit: 2,
        sm: smGpComportamiento,
        cm: cmComportamiento,
        loadMask: {
            msg: perfil.etiquetas.lbEspere
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptComportamiento',
            store: stGpComportamiento,
            displayInfo: true,
            items: ['-', btnLimpiarFiltrosComportamiento, '-', CbtotalEnm, {
                    xtype: 'tbtext',
                    text: '&nbsp;&nbsp;<b>' + 'Total:&nbsp;' + '</b>'
                }, tfimportetotal]
        })

    });

    panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'card',
        activeItem: 0,
        id: 'panelGeneral',
        tbar: ['Ejercicio:', ejercicio('pcomportamiento'), '-', btnExportarComportamiento,'->',btnAyudaEnmarcamiento],
        items: [gpComportamiento]
    });



    //Implementacion de teclas calientes
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function() {

                if (!btnLimpiarFiltrosComportamiento.hidden) {
                    if (!btnLimpiarFiltrosComportamiento.disabled)
                        limpiarfiltrosComportamiento();
                }


            }

        }

    ]);

    tpdatos = new Ext.Panel({
        region: 'center',
        border: false,
        layout: 'fit',
        items: [panelGeneral]
    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'fit',
            items: [tpdatos]
        })
    });


    function siexisteComportamientoFiltrado() {
        if (filtrosComportamiento.getFiltrosActivos().length > 0 && stGpComportamiento.getCount() == 0)
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
    }

    function ejercicio(ctab) {
        stCbejercicio = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
            autoLoad: true,
            listeners: {
                load: function(t, n, e) {
                    cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                    gpComportamiento.getStore().reload({
                        params: {
                            limit: 20,
                            start: 0
                        }
                    });
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
            id: 'cbEjercicio' + ctab,
            store: stCbejercicio,
            valueField: 'idejercicio',
            hiddenName: 'idejercicio',
            displayField: 'ejercicio',
            mode: 'local',
            allowBlank: true,
            typeAhead: true,
            editable: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            loadingText: 'Cargando...',
            width: 180,
            listeners: {
                select: function(cb, rec, index) {
                    gpComportamiento.getStore().reload({
                        params: {
                            limit: 20,
                            start: 0
                        }
                    });

                }

            }
        });
        return cbEjercicio;
    }
}
// fin de cargar interfaz

function crearToolTipPadre(v, m, t, g) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function limpiarfiltrosComportamiento() {
    control = 0;
    smGpComportamiento.clearSelections(true);
    if (!smGpComportamiento.getSelected())
        filtrosComportamiento.clearFilters();
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}