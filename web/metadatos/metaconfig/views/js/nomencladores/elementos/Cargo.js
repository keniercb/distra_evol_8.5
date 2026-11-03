var stCargo, formFiltroCargo;
var paramCargo = new Array();
paramCargo.push(7);
var searchFiltroCargo = function () {
    var form = formFiltroCargo.getForm();
    var grupocomplejidad = Ext.getCmp('filtroHiddenIdGrupoComplejidad_cargo').getValue();
    var denominacion = Ext.getCmp('filtroDenominacion_cargo').getValue();
    var abreviatura = Ext.getCmp('filtroAbreviatura_cargo').getValue();
    if (grupocomplejidad != '' || denominacion != '' || abreviatura != '') {
        if (form.isValid()) {
            var params = new Array();
            params.push(7);
            params.push(form.getValues());
            stCargo.reload({
                params  : {
                    start     : 0,
                    limit     : 15,
                    clase     : 'cargo',
                    parametros: Ext.encode(params)
                },
                callback: function (a) {
                    if (a.length == 0) {
                        Secodena.ocultarMascara('cargaini');
                        mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.");
                        Secodena.ocultarMascara('cargaini');
                        // formFiltroCargo.getForm().reset();
                        // stCargo.reload({params: {start: 0, limit: 15}});
                    }
                }
            })
        }
    } else {
        mostrarMensaje(6, "No se ha introducido ningún criterio de búsqueda.");
    }
}

function construirCargo(idTab) {
    stCargo = new Ext.data.Store({
        url       : 'mostrarValores',
        remoteSort: true,
        reader    : new Ext.data.JsonReader({
            root         : 'datos',
            totalProperty: 'cant'
        }, [
            {name: 'id'},
            {name: 'idnomcargo'},
            {name: 'idcondicion'},
            {name: 'condicion'},
            {name: 'idgrupocomplejidad'},
            {name: 'grupocomplejidad'},
            {name: 'idnormajuridica'},
            {name: 'normajuridica'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'facultado'},
            {name: 'actual'},
            {name: 'visible'},
            {name: 'fechainicio'},
            {name: 'fechafin'}
        ]),
        listeners : {
            beforeload: function (store, param) {
                param = myBeforeLoad(param, "filtroDenominacion_cargo", "filtroHiddenIdGrupoComplejidad_cargo", formFiltroCargo, 7, paramCargo, 'cargo')
                return param;
            },
            load      : function () {
                Secodena.ocultarMascara('cargaini');
                Ext.getCmp('filtroDenominacion_cargo').focus(false, 10);
            }
        }
    })
    var storeFiltroGrupoComplejidad = new Ext.data.Store({
        url       : 'mostrarValores',
        autoLoad  : true,
        baseParams: {
            clase  : 'grupo_domain',
            accion : 'dameTodosVisiblesInCargo',
            salario: true
        },
        reader    : new Ext.data.JsonReader({
            root: "datos"
        }, [
            {name: 'idgrupocomplejidad'},
            {name: 'denominacion'}
        ])
    })
    formFiltroCargo = new Ext.FormPanel({
        layout     : 'column',
        region     : 'north',
        cls        : 'x-toolbar',
        height     : 90,
        frame      : true,
        defaults   : {
            layout     : 'form',
            border     : false,
            labelAlign : 'top',
            labelWidth : 50,
            buttonAlign: 'right'
        },
        bodyBorder : false,
        border     : false,
        autoScroll : true,
        hideBorders: true,
        keys       : [
            {
                key: Ext.EventObject.ENTER,
                fn : function () {
                    searchFiltroCargo();
                }
            },
            {
                key: 'b',
                alt: true,
                fn : function () {
                    searchFiltroCargo();
                }
            }, {
                key: 'l',
                alt: true,
                fn : function () {
                    limpiar();
                }
            }
        ],
        items      : [
            {
                layout     : 'form',
                columnWidth: .2,
                items      : [
                    {
                        xtype         : 'combo2',
                        anchor        : '85%',
                        editable      : false,
                        name          : 'grupocomplejidad',
                        id            : 'filtroGrupoComplejidad_cargo',
                        autoCreate    : true,
                        store         : storeFiltroGrupoComplejidad,
                        mode          : 'local',
                        forceSelection: true,
                        enableQtip    : true,
                        allowBlank    : true,
                        fieldLabel    : "Grupo de escalar",
                        displayField  : 'denominacion',
                        valueField    : 'denominacion',
                        hiddenName    : 'grupocomplejidad',
                        emptyText     : "Criterio a buscar...",
                        triggerAction : 'all',
                        handler       : function () {
                            this.store.removeAll();
                            this.store.load();
                            Ext.getCmp('filtroHiddenIdGrupoComplejidad_cargo').setValue('');
                        },
                        listeners     : {
                            select: function (combo, record) {
                                Ext.getCmp('filtroHiddenIdGrupoComplejidad_cargo').setValue(record.data.idgrupocomplejidad);
                                if (Ext.getCmp('filtroAbreviatura_cargo').getValue() != ''
                                    || Ext.getCmp('filtroDenominacion_cargo').getValue() != ''
                                    || Ext.getCmp('filtroGrupoComplejidad_cargo').getValue() != '') {
                                    Ext.getCmp('btnAllA').enable();
                                    Ext.getCmp('btnBuscar').enable();
                                } else {
                                    Ext.getCmp('btnAllA').disable();
                                    Ext.getCmp('btnBuscar').disable();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'hidden',
                        name : 'idgrupocomplejidad',
                        id   : 'filtroHiddenIdGrupoComplejidad_cargo'
                    }
                ]
            },
            {
                layout     : 'form',
                columnWidth: .2,
                items      : [
                    {
                        xtype          : 'textfield',
                        anchor         : '85%',
                        name           : 'denominacion',
                        id             : 'filtroDenominacion_cargo',
                        fieldLabel     : 'Denominación',
                        maxLength      : 255,
                        emptyText      : "Criterio a buscar...",
                        enableKeyEvents: true,
                        listeners      : {
                            keyup: function () {
                                if (Ext.getCmp('filtroAbreviatura_cargo').getValue() != ''
                                    || Ext.getCmp('filtroDenominacion_cargo').getValue() != ''
                                    || Ext.getCmp('filtroGrupoComplejidad_cargo').getValue() != '') {
                                    Ext.getCmp('btnAllA').enable();
                                    Ext.getCmp('btnBuscar').enable();
                                } else {
                                    Ext.getCmp('btnAllA').disable();
                                    Ext.getCmp('btnBuscar').disable();
                                }
                            }
                        }
                    }
                ]
            },
            {
                layout     : 'form',
                columnWidth: .2,
                items      : [
                    {
                        xtype          : 'textfield',
                        anchor         : '85%',
                        name           : 'abreviatura',
                        id             : 'filtroAbreviatura_cargo',
                        fieldLabel     : 'Abreviatura',
                        emptyText      : "Criterio a buscar...",
                        enableKeyEvents: true,
                        listeners      : {
                            keyup: function () {
                                if (Ext.getCmp('filtroAbreviatura_cargo').getValue() != ''
                                    || Ext.getCmp('filtroDenominacion_cargo').getValue() != ''
                                    || Ext.getCmp('filtroGrupoComplejidad_cargo').getValue() != '') {
                                    Ext.getCmp('btnAllA').enable();
                                    Ext.getCmp('btnBuscar').enable();
                                } else {
                                    Ext.getCmp('btnAllA').disable();
                                    Ext.getCmp('btnBuscar').disable();
                                }
                            }
                        }
                    }
                ]
            },
            {
                columnWidth: '35px', bodyStyle: 'padding:19px 20px 0 0;', layout: 'form', items: [
                {
                    xtype   : 'button',
                    tooltip : "Buscar cargo salarial <b>(Alt+L)</b>",
                    text    : '<u>B</u>uscar',
                    //icon    : perfil.dirImg + 'buscar.png',
                    id      : 'btnBuscar',
                    iconCls : 'buscar',
                    disabled: true,
                    handler : function () {

                        searchFiltroCargo();
                    }
                }
            ]
            },
            {
                columnWidth: '35px', bodyStyle: 'padding:19px 0 0 0;', layout: 'form', items: [
                {
                    xtype   : 'button',
                    tooltip : "Limpiar filtros <b>(Alt+L)</b>",
                    text    : '<u>L</u>impiar',
                    id      : 'btnAllA',
                    //icon    : perfil.dirImg + 'limpiar.png',
                    iconCls : 'limpiar',
                    disabled: true,
                    handler : function () {
                        limpiar();
                    }
                }
            ]
            }
        ]
    });

    function limpiar() {
        Ext.getCmp('btnAllA').disable();
        Ext.getCmp('btnBuscar').disable();
        formFiltroCargo.getForm().reset();
        stCargo.reload({params: {start: 0, limit: 15}});
    }

    var panelGestion = new Nomenclador.Panel.Gestion({
        id               : idTab,
        title            : 'Cargo',
        name             : 'cargo',
        clase            : 'cargo',
        elemento         : 'cargo',
        idTipoNomenclador: 7,
        mensajeEvento    : 'el cargo seleccionado',
        mensajeCargando  : 'del cargo',
        store            : stCargo,
        formFiltro       : formFiltroCargo,
        onBuscar         : searchFiltroCargo,
        idFoco           : 'filtroDenominacion_cargo',
        columns          : [
            {
                dataIndex: 'orden',
                header   : "Orden",
                sortable : true,
                width    : Go.Column.Config.Width('orden'),
                hidden   : true
            },
            {
                dataIndex: 'grupocomplejidad',
                header   : "Grupo de escala",
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('denominacion')
            },
            {
                id       : 'denominacion',
                dataIndex: 'denominacion',
                header   : "Denominación",
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('denominacioncargo')
            },
            {
                dataIndex: 'abreviatura',
                header   : 'Abreviatura',
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura')
            },
            {
                dataIndex: 'condicion',
                header   : "Condición",
                renderer : Go.Column.Render.changeValorCondicion,
                width    : Go.Column.Config.Width('actual'),
                align    : 'center'
            }, {
                dataIndex: 'facultado',
                header   : "Facultado",
                sortable : true,
                renderer : changeValor,
                width    : configuracion('actual'),
                align    : 'center'
            },
            {
                dataIndex: 'normajuridica',
                header   : "Norma juridica",
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura')
            },
            {
                dataIndex: 'fechainicio',
                header   : 'Fecha inicio',
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura'),
                align    : 'center'
            },
            {
                dataIndex: 'fechafin',
                header   : 'Fecha fin',
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura'),
                align    : 'center'
            },
            {
                dataIndex: 'actual',
                header   : "Actual",
                sortable : false,
                renderer : Go.Column.Render.changeValor,
                width    : Go.Column.Config.Width('actual'),
                align    : 'center'
            },
            {
                dataIndex: 'visible',
                header   : "Visible",
                sortable : false,
                renderer : Go.Column.Render.changeValor,
                width    : Go.Column.Config.Width('visible'),
                align    : 'center'
            }
        ]
    })
    return panelGestion;
}