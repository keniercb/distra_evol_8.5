
var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('indicadoresuam', Cargar);
var filtronivel = false;
var fila = -1;
var fila1 = -1;
var recordsFallidos = [];
var flag1 = false, flag2 = false, flag3 = false, flag4 = false, flag5 = false;

function Cargar() {
    mymaska = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando configuración inicial'
    });
    mymaska.show();
    storeUM = new Ext.data.Store({
        url: 'cargarunidadmedida',
        reader: new Ext.data.JsonReader({
            id: 'stnaturaleza',
            root: 'data'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }]),
        autoLoad: true,
        listeners: {
            load: function(x, y, z) {
                flag1 = true;
                LlamaCarga();
            }
        }
    });
    storeFuenteEnergia = new Ext.data.Store({
        url: 'listarfuenteenergia',
        reader: new Ext.data.JsonReader({
            id: 'idfuenteenergia',
            root: 'data'
        }, [{
                name: 'idfuenteenergia'
            }, {
                name: 'denominacion'
            }]),
        autoLoad: true,
        listeners: {
            load: function(x, y, z) {
                flag2 = true;
                LlamaCarga();
            }
        }
    });
    //**************tipo depreciacion************
    sttipodepreciac = new Ext.data.Store({
        url: 'listartipodepreciac',
        reader: new Ext.data.JsonReader({
            id: 'idtipodepreciacion'
        }, [{
                name: 'idtipodepreciacion'
            }, {
                name: 'denominacion'
            }]),
        autoLoad: true,
        listeners: {
            load: function(x, y, z) {
                flag3 = true;
                LlamaCarga();
            }
        }
    });
    stnaturalezaind = new Ext.data.Store({
        url: 'listarnaturaleza',
        reader: new Ext.data.JsonReader({
            id: 'idnaturalezauam',
            root: 'data'
        }, [{
                name: 'idnaturalezauam'
            }, {
                name: 'denominacion'
            }]),
        autoLoad: true,
        listeners: {
            load: function(x, y, z) {
                flag4 = true;
                LlamaCarga();
            }
        }
    });
    stCmbNiveles = new Ext.data.Store({
        url: 'listarCmbNiveles',
        reader: new Ext.data.JsonReader({
            id: 'nivel',
            root: 'data'
        }, [{
                name: 'nivel'
            }, {
                name: 'nombre'
            }]),
        autoLoad: true,
        listeners: {
            load: function(x, y, z) {
                flag5 = true;
                LlamaCarga();
            }
        }
    });
}
function LlamaCarga() {
    if (flag1 && flag2 && flag3 && flag4 && flag5) {
        mymaska.hide();
        cargarInterfaz();
    }
}
function cargarInterfaz() {

    //************************FILTRO DEL GRID *******************************************************
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbEspere
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    Ext.grid.filter.String_adaptadoFilter.prototype.icon = perfil.dirImg + 'find.png';

    initaddindicador();

    filtrosind = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedida',
                st: storeUM,
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'nombreum'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'listado',
                dataIndex: 'idfuenteenergia',
                idcombo: 'cbfuenteenergia',
                st: storeFuenteEnergia,
                valueFieldcb: 'idfuenteenergia',
                displayFieldcb: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'consumoenergia'
            }, {
                type: 'listado',
                dataIndex: 'iddepreciacion',
                idcombo: 'cbtipodepreciac',
                st: sttipodepreciac,
                valueFieldcb: 'idtipodepreciacion',
                displayFieldcb: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'depreciacion'
            }, {
                type: 'numeric',
                dataIndex: 'capacidad'
            }, {
                type: 'numeric',
                dataIndex: 'seguro'
            }, {
                type: 'numeric',
                dataIndex: 'nivel'
            }]
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'iI',
            alt: true,
            fn: function() {

                AccionbtnAdicionar();
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function() {
                AccionbtnModificar();
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                Accionbtnlimpiar();
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function() {
            }
        }, {
            key: 'Gg',
            alt: true,
            fn: function() {
                modificarDatos();
            }
        }
    ]);
    btnAdicionar = new Ext.Button({
        handler: function() {
            AccionbtnAdicionar();

        },
        text: perfil.etiquetas.lbBtnAdicionar,
        tooltip: perfil.etiquetas.lbTtpAdicionar,
        disabled: false,
        id: 'btnAddind',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn'
    });

    btnModificar = new Ext.Button({
        handler: function() {
            AccionbtnModificar();
        },
        text: perfil.etiquetas.lbBtnModificar,
        tooltip: perfil.etiquetas.lbTtpModificar,
        id: 'btnMod',
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn'
    });

    btnGuardar = new Ext.Button({
        handler: function() {
            modificarDatos();
        },
        text: perfil.etiquetas.lbBtnGuardar,
        tooltip: perfil.etiquetas.lbTtpGuardar,
        id: 'btnGuard',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn'
    });

    btnlimpiar = new Ext.Button({
        handler: function() {
            Accionbtnlimpiar();

        },
        text: perfil.etiquetas.lbBtnLimpiar,
        tooltip: perfil.etiquetas.lbTtpLimpiar,
        disabled: false,
        id: 'btnlimpiar',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn'
    });

    btnAyuda = new Ext.Button({
        handler: function() {
        },
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtpAyuda,
        id: 'btnAyuda',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });



    cbnaturaleza = new Ext.form.ComboBox({
        id: 'cbnaturaleza',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: stnaturalezaind,
        valueField: 'idnaturalezauam',
        hiddenName: 'idnaturalezauam',
        displayField: 'denominacion',
        anchor: '100%',
        enableKeyEvents: true,
        mode: 'local',
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        listeners: {
            select: function() {
                ConfigurarColumnas1(gpindicadoresuam, cbnaturaleza);
                recargaNormal(stindicadoresuam);
            }
        }
    });

    cbnivel = new Ext.form.ComboBox({
        id: 'cbnivel',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: stCmbNiveles,
        valueField: 'nivel',
        hiddenName: 'nivel',
        displayField: 'nombre',
        anchor: '100%',
        mode: 'local',
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        listeners: {
            select: function() {
                recargaNormal(stindicadoresuam);
            }
        }
    });

    cbfuenteenergia = new Ext.form.ComboBox({
        id: 'cbfuenteenergia',
        store: storeFuenteEnergia,
        valueField: 'idfuenteenergia',
        hiddenName: 'idfuenteenergia',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all'
    });

    //*****************grid**************
    stindicadoresuam = new Ext.data.Store({
        url: 'listarIndicadores',
        method: 'POST',
        listeners: {
            beforeload: function(st) {

                stindicadoresuam.baseParams.naturaleza = cbnaturaleza.getValue();
                stindicadoresuam.baseParams.nivel = cbnivel.getValue();
            },
            load: function() {
                cambiarTituloFiltrarIndicadores();
                if (stindicadoresuam.getCount() == 0) {
                    if (filtrosind.getFiltrosActivos() == undefined || filtrosind.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');

                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }

            }
        },
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            id: 'idindicadoresuam',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo',
                mapping: 'NomIndicador.codigo'
            }, {
                name: 'denominacion',
                mapping: 'NomIndicador.denominacion'
            }, {
                name: 'idumedida',
                mapping: 'NomIndicador.idumedida'
            }, {
                name: 'precio',
                mapping: 'NomIndicador.precio'
            }, {
                name: 'idnaturalezauam'
            }, {
                name: 'idfuenteenergia'
            }, {
                name: 'consumoenergia'
            }, {
                name: 'idtipodepreciacion'
            }, {
                name: 'depreciacion'
            }, {
                name: 'capacidad'
            }, {
                name: 'seguro'
            }, {
                name: 'nivel'
            }, {
                name: 'iddepreciacion'
            }, {
                name: 'color'
            }
        ])
    });

    //***************chek**************
    checkindicadoresuam = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(th, f) {
                fila1 = f;
            }
        }
    });
    //****************************
    cmindicadoresuam = new Ext.grid.ColumnModel([checkindicadoresuam, {
            width: 100,
            header: 'Código',
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: 'Denominación',
            id: 'expandir',
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: 'UM',
            width: 100,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            width: 100,
            header: 'Precio',
            sortable: true,
            dataIndex: 'precio',
            renderer: crearToolTip
        }, {
            width: 100,
            header: 'Naturaleza',
            sortable: true,
            dataIndex: 'idnaturalezauam',
            renderer: renderNaturaleza

        }, {
            width: 100,
            header: 'Fuente de energía',
            sortable: true,
            hidden: true,
            dataIndex: 'idfuenteenergia',
            renderer: renderFuenteenergia,
            editor: cbfuenteenergia
        }, {
            width: 100,
            header: 'Valor de consumo',
            sortable: true,
            hidden: true,
            renderer: crearToolTip,
            dataIndex: 'consumoenergia',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                maxValue: 99999999999999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 100,
            header: 'Tipo de depreciación',
            sortable: true,
            hidden: true,
            renderer: renderTipoDepreciacion,
            dataIndex: 'iddepreciacion',
            editor: cbtipodepreciac
        }, {
            width: 100,
            header: 'Valor de depreciación',
            sortable: true,
            hidden: true,
            dataIndex: 'depreciacion',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                maxValue: 9999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 100,
            header: 'Capacidad que abarca',
            sortable: true,
            hidden: true,
            dataIndex: 'capacidad',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 5,
                maxValue: 9999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 100,
            header: 'Valor de seguro',
            sortable: true,
            hidden: true,
            dataIndex: 'seguro',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                maxValue: 99,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val <= 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 50,
            header: 'Color',
            sortable: true,
            hidden: true,
            dataIndex: 'color',
            align: 'center',
            renderer: rendercolor,
            editor: new Ext.form.TextField({
                id: 'tfcolor',
                listeners: {
                    focus: function(t) {
                        var xy = t.getPosition();
                        new Ext.menu.ColorMenu({
                            listeners: {
                                select: function(th, c) {
                                    gpindicadoresuam.getStore().getAt(fila1).data.color = c;
                                    gpindicadoresuam.getStore().getAt(fila1).commit();
                                }
                            }
                        }).showAt(xy);
                    }
                }
            })
        }]);

    smindicadoresuam = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    gpindicadoresuam = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: 'Cargando...'
        },
        id: 'gpindicadoresuam',
        title: 'Indicadores UAM',
        store: stindicadoresuam,
        plugins: filtrosind,
        frame: true,
        sm: checkindicadoresuam,
        cm: cmindicadoresuam,
        autoExpandColumn: 'expandir',
        height: 480,
        width: 750,
        margins: '2 2 2 2',
        anchor: '95%',
        md: new Ext.menu.Menu({
            id: 'menudescaracte',
            items: [{
                    text: 'Descaracterizar indicador(es)',
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    id: 'mndescaract',
                    handler: function() {
                        DescaracterizarIndicadores();
                    }
                }]
        }),
        tbar: [btnAdicionar, '-', btnModificar, '-', {
                xtype: 'tbtext',
                text: 'Nivel:',
                id: 'nivel'
            }, cbnivel, '-', {
                xtype: 'tbtext',
                text: 'Naturaleza:',
                id: 'naturaleza'
            }, cbnaturaleza, '->', btnlimpiar, btnAyuda],
        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: stindicadoresuam,
            displayInfo: true,
            items: ['-', btnGuardar]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        }
    });
    vpIndicadoresuam = new Ext.Viewport({
        layout: 'fit',
        id: 'vpIndicadoresuam',
        items: [gpindicadoresuam]
    });
    vpIndicadoresuam.show();
    recargaNormal(stindicadoresuam);
}
function DescaracterizarIndicadores() {
    mostrarMensaje(2, 'Está seguro que quiere descaracterizar el(los) indicador(es) seleccionado(s).', DescaracterizarIndicadoresSeleccionadas);
    function DescaracterizarIndicadoresSeleccionadas(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: 'Por favor espere...',
                msg: 'Descaracterizando el(los) indicador(es)',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6'
            });
            var recordsSel = gpindicadoresuam.getSelectionModel().getSelections(), indeliminar = [];
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++)
                    indeliminar.push(
                            recordsSel[i].data.idindicador
                            );
                Ext.Ajax.request({
                    url: 'descaracterizarIndicadores',
                    params: {
                        indicadores: Ext.encode(indeliminar)
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(1, 'El(los) indicador(es) ha(n) sido descaracterizado(s) satisfactoriamente.', function() {
                                recargaNormal(gpindicadoresuam.getStore());
                            });
                        } else {
                            if (responseData.mensaje != null)
                                mostrarMensaje(3, responseData.mensaje);
                            else
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                        }
                    }
                });
            }
        }
    }
}
function buscarRecord(idindicador) {
    var bandera = false;
    for (var i = 0; i < stcaracterizarind.getCount(); i++) {
        if (stcaracterizarind.getAt(i).data.idindicador == idindicador) {
            bandera = true;
            break;
        }
    }
    return bandera;
}
function CaracterizarIndicadores(grid) {
    Fila = Ext.data.Record.create([{
            name: 'idindicador',
            type: 'string'
        }, {
            name: 'denominacion',
            type: 'string'
        }, {
            name: 'codigo',
            type: 'string'
        }, {
            name: 'descripcion',
            type: 'string'
        }, {
            name: 'precio',
            type: 'string'
        }, {
            name: 'idumedida',
            type: 'string'
        }, {
            name: 'naturaleza',
            type: 'string'
        }]);
    var recordsSel = grid.getSelectionModel().getSelections();
    var naturaleza = '';

    if (recordsSel.length > 0) {
        if (cbnaturalezaind.getValue() != undefined) {
            naturaleza = cbnaturalezaind.getRawValue();
            Ext.getCmp('btnaplicarcaracter').enable();
            Ext.getCmp('btnaceptarcaracter').enable();
        }
        for (var i = 0; i < recordsSel.length; i++) {
            var p = new Fila({
                idindicador: recordsSel[i].data.idindicador,
                denominacion: recordsSel[i].data.denominacion,
                codigo: recordsSel[i].data.codigo,
                descripcion: recordsSel[i].data.denominacion,
                precio: recordsSel[i].data.precio,
                idumedida: recordsSel[i].data.idumedida,
                naturaleza: naturaleza
            });
            if (!buscarRecord(recordsSel[i].data.idindicador)) {
                stcaracterizarind.add(p);
            } else {
                Ext.MessageBox.show({
                    title: 'Error',
                    buttons: Ext.MessageBox.OK,
                    msg: 'El(los) indicador(es) que quiere adicionar ya existe(n).',
                    icon: Ext.MessageBox.ERROR
                });
            }
        }
    }

}
function ConfigurarColumnas1(grid, combo) {
    if (combo.getValue() == 1) {
        OcultarColumnas(grid, [6, 7, 8, 9, 10], true);
        EditarColumnas(grid, [6, 7, 8, 9, 10], false);
        OcultarColumnas(grid, [11, 12], false);
        EditarColumnas(grid, [11, 12], true);
    }
    else if (combo.getValue() == 2 || combo.getValue() == 6) {
        OcultarColumnas(grid, [6, 7, 8, 9, 10], false);
        EditarColumnas(grid, [6, 7, 8, 9, 10], true);
        OcultarColumnas(grid, [11, 12], true);
        EditarColumnas(grid, [11, 12], false);
    } else {
        OcultarColumnas(grid, [6, 7, 8, 9, 10, 11, 12], true);
        EditarColumnas(grid, [6, 7, 8, 9, 10, 11, 12], false);
    }
}
function ConfigurarColumnas2(grid, combo) {
    if (combo.getValue() == 1) {
        OcultarColumnas(grid, [5, 6, 7, 8, 9], true);
        EditarColumnas(grid, [5, 6, 7, 8, 9], false);
        OcultarColumnas(grid, [10, 11], false);
        EditarColumnas(grid, [10, 11], true);
    }
    else if (combo.getValue() == 2 || combo.getValue() == 6) {
        OcultarColumnas(grid, [5, 6, 7, 8, 9], false);
        EditarColumnas(grid, [5, 6, 7, 8, 9], true);
        OcultarColumnas(grid, [10, 11], true);
        EditarColumnas(grid, [10, 11], false);
    } else {
        OcultarColumnas(grid, [5, 6, 7, 8, 9, 10, 11], true);
        EditarColumnas(grid, [5, 6, 7, 8, 9, 10, 11], false);
    }
}
function OcultarColumnas(grid, array, valor) {
    for (i = 0; i < array.length; i++) {
        grid.getColumnModel().setHidden(array[i], valor);
    }
}
function EditarColumnas(grid, array, valor) {
    for (i = 0; i < array.length; i++) {
        grid.getColumnModel().setEditable(array[i], valor);
    }
}
function rendernivelarbol(val) {
    if (val == 1) {
        return 'Genérico'
    } else if (val == 2)
    {
        return 'Subgenérico'
    } else if (val == 3)
    {
        return 'Específico'
    } else if (val == 4)
    {
        return 'Surtido'
    }
    else
        return ''
}
function renderFuenteenergia(val) {
    if (val == 1) {
        return 'Diesel'
    } else if (val == 2)
    {
        return 'Electricidad'
    }
    else
        return ' '
}
function renderTipoDepreciacion(val) {
    return getRawValue(val, cbtipodepreciac);
}
function renderUM(value) {
    return getRawValue(value, Ext.getCmp('idcbunidadmedida'));
}
function renderNaturaleza(value) {
    return getRawValue(value, Ext.getCmp('cbnaturaleza'));
}
function getRawValue(v, cmb) {
    var arrid = (v != null) ? v.split(",") : '';
    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
        for (var j = 1; j < arrid.length; j++) {
            str += ((cmb.store.find(cmb.valueField, arrid[j]) != -1) ? ','
                    + cmb.store.getAt(cmb.store.find(cmb.valueField,
                    arrid[j])).data[cmb.displayField] : '');
        }
    }
    return str;
}
function AdicionarIndicadores(val) {
    var recordsEnviar = [];
    for (i = 0; i < gpcaracterizarind.getStore().getCount(); i++) {
        recordsEnviar.push(gpcaracterizarind.getStore().getAt(i).data);
    }
    var datonull = false;
    if (!Ext.isEmpty(recordsEnviar)) {
        Ext.each(recordsEnviar, function(record) {
            if (cbnaturalezaind.getValue() == 1) {
                if (record.seguro == null || record.color == null) {
                    datonull = true;
                    recordsFallidos.push(record);
                }
            } else if (cbnaturalezaind.getValue() == 2 || cbnaturalezaind.getValue() == 6) {
                if (record.idfuenteenergia == null || record.consumoenergia == null || record.idtipodepreciacion == null || record.idtipodepreciacion == "" ||
                        record.depreciacion == null || record.capacidad == null) {
                    datonull = true;
                    recordsFallidos.push(record);
                }
            }
        });
        if (datonull) {
            mostrarMensaje(1, 'Por favor verifique, existen campos obligatorios vacios.')
        } else {
            Ext.MessageBox.show({
                title: 'Por favor espere...',
                msg: 'Caracterizando indicador(es)',
                width: 250,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6'
            });
            Ext.Ajax.request({
                url: 'adicionarIndicadorsUAM',
                params: {
                    idnaturaleza: cbnaturalezaind.getValue(),
                    indicadores: Ext.encode(recordsEnviar)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 24) {
                        mostrarMensaje(1, 'El(los) indicador(es) ha(n) sido caracterizado satisfactoriamente.', function() {
                            if (!val) {
                                windaddindicadores.hide();
                                Ext.getCmp('btnaplicarcaracter').disable();
                                Ext.getCmp('btnaceptarcaracter').disable();

                            }
                            recargaNormal(stindicadoresuam);
                        })
                    } else {
                        mostrarMensaje(3, responseData.mensaje);
                    }
                }
            });
        }
    }
}
;
function rendercolor(val) {
    return '<span style="background-color: #' + val + ';">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '</span>';
}
function recargaNormal(val) {
    val.reload({
        params: {
            start: 0,
            limit: 25
        }
    });
}
function recargaNormal20(val) {
    val.reload({
        params: {
            start: 0,
            limit: 20
        }
    });
}
function modificarDatos(record) {
    recordsEnviar = [];
    for (i = 0; i < gpindicadoresuam.getStore().getCount(); i++) {
        recordsEnviar.push(gpindicadoresuam.getStore().getAt(i).data);
    }
    Ext.MessageBox.show({
        title: 'Por favor espere...',
        msg: 'Caracterizando indicador(es)',
        width: 250,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6'
    });
    Ext.Ajax.request({
        url: 'adicionarIndicadorsUAM',
        params: {
            idnaturaleza: cbnaturaleza.getValue(),
            indicadores: Ext.encode(recordsEnviar)
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 24) {
                mostrarMensaje(1, 'La(s) caracterización(es) ha(n) sido guardada(s) satisfactoriamente.', function() {
                    recargaNormal(stindicadoresuam);
                })
            } else {
                mostrarMensaje(3, responseData.mensaje);
            }
        }
    });
}
function  AccionbtnModificar() {
    if (!gpindicadoresuam.getSelectionModel().hasSelection()) {
        mostrarMensaje(1, 'Debe seleccionar al menos un indicador')
    } else {
        stcaracterizarind.removeAll();
        ConfigurarColumnas2(gpcaracterizarind, cbnaturalezaind);
        CaracterizarIndicadores(gpindicadoresuam);
        windaddindicadores.setTitle('Modificar indicador(es)');
        gpaddindicadores.hide();
        Ext.getCmp('btnaplicarcaracter').hide();
        cbnaturalezaind.reset();
        windaddindicadores.show();
    }
}


function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function cambiarTituloFiltrarIndicadores() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosind.getFiltrosActivos() == undefined
            || filtrosind.getFiltrosActivos().length == 0) {
        gpindicadoresuam.setTitle('Indicadores UAM');
    } else {
        for (i = 0; i < filtrosind.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosind.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = 'Código';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = 'Denominación';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "idumedida") {
                aux = 'UM';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = 'Precio';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "idfuenteenergia") {
                aux = 'Fuente de energía';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "consumoenergia") {
                aux = 'Valor de consumo';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "iddepreciacion") {
                aux = 'Tipo de depreciación';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "depreciacion") {
                aux = 'Valor de depreciación';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "capacidad") {
                aux = 'Capacidad que abarca';
            } else if (filtrosind.getFiltrosActivos()[i].dataIndex == "seguro") {
                aux = 'Valor de seguro';
            }
            else {
                aux = 'Color';
            }
            if (i == filtrosind.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        gpindicadoresuam.setTitle('Indicadores UAM <i>- Filtrado por: '
                + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function AccionbtnAdicionar() {
    windaddindicadores.setTitle('Adicionar indicador(es)');
    gpaddindicadores.show();
    Ext.getCmp('btnaplicarcaracter').disable();
    Ext.getCmp('btnaceptarcaracter').disable();
    ConfigurarColumnas2(gpcaracterizarind, cbnaturalezaind);
    windaddindicadores.show();
    gpaddindicadores.getSelectionModel().clearSelections();
    filtrosindicadores.clearFilters();
    recargaNormal20(staddindocadores);
    Ext.getCmp('btnaplicarcaracter').show()
    cbnaturalezaind.reset();
    gpaddindicadores.expand();
    stcaracterizarind.removeAll();
}
function  Accionbtnlimpiar() {
    cbnaturaleza.reset(),
            cbnivel.reset(),
            filtrosind.clearFilters();
    recargaNormal(stindicadoresuam)
    OcultarColumnas(gpindicadoresuam, [6, 7, 8, 9, 10, 11, 12], true);
    EditarColumnas(gpindicadoresuam, [6, 7, 8, 9, 10, 11, 12], false);
}
  