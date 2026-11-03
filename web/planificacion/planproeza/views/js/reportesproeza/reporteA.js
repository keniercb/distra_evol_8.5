function cargarReporteA() {
    stEjerciciosA = new Ext.data.Store({
        url: 'cargarEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                cbEjercicioA.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbEjercicioA = new Ext.form.ComboBox({
        id: 'cbEjercicioA',
        store: stEjerciciosA,
        fieldLabel: perfil.etiquetas.lbEjercicios,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        autoWidth: true,
        listeners: {
            select: function (cb, rec, index) {
                controlarObjetosReporteA();
            }
        }
    });

    stPeriodoA = new Ext.data.Store({
        url: 'cargarPeriodos',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                //cbPeriodoA.setValue(t.reader.jsonData.data[].idejercicio);
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbPeriodoA = new Ext.form.ComboBox({
        id: 'cbPeriodoA',
        store: stPeriodoA,
        fieldLabel: perfil.etiquetas.lbPeriodos,
        valueField: 'uridatosnomenclador',
        hiddenName: 'uridatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: false,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        autoWidth: true,
        listeners: {
            select: function (cb, rec, index) {
                cbColumnasA.clearValue();
                if (cbPeriodoA.getValue() != undefined && cbPeriodoA.getValue() != null && cbPeriodoA.getValue() != '') {
                    stColumnasA.reload();
                    cbColumnasA.enable();
                    //stIndicadorA.reload();
                } else {
                    cbColumnasA.disable();
                }
                controlarObjetosReporteA();
            }
        }
    });

    stCumplimiento = new Ext.data.SimpleStore({
        id: 'stCumplimiento',
        fields: [{
                name: 'idcumplimiento'
            }, {
                name: 'denominacion'
            }],
        data: [['1', perfil.etiquetas.lbSobrecumplimiento], ['2', perfil.etiquetas.lbAtraso]]
    });
    cbCumplimiento = new Ext.form.ComboBox({
        id: 'cbCumplimiento',
        store: stCumplimiento,
        fieldLabel: perfil.etiquetas.lbCumplimiento,
        valueField: 'idcumplimiento',
        hiddenName: 'idcumplimiento',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: false,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        autoWidth: true/*,
         listeners: {
         select: function (cb, rec, index) {
         cbColumnasA.clearValue();
         if (cbPeriodoA.getValue() != undefined && cbPeriodoA.getValue() != null && cbPeriodoA.getValue() != '') {
         stColumnasA.reload();
         cbColumnasA.enable();
         //stIndicadorA.reload();
         } else {
         cbColumnasA.disable();
         }
         controlarObjetosReporteA();
         }
         }*/
    });
    stColumnasA = new Ext.data.Store({
        url: 'cargarColumnasPorPeriodo',
        listeners: {
            beforeload: function () {
                stColumnasA.baseParams.uridatosnomenclador = cbPeriodoA.getValue();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbColumnasA = new Ext.ux.form.LovCombo({
        id: 'cbColumnasA',
        store: stColumnasA,
        fieldLabel: perfil.etiquetas.lbColumnas,
        valueField: 'uridatosnomenclador',
        hiddenName: 'uridatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: true,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        autoWidth: true,
        listeners: {
            change: function (cb, new_value, old_value) {
                controlarObjetosReporteA();
            }
        }
    });

    stEntidadesUIMA = new Ext.data.Store({
        url: 'cargarEntidadesUIM',
        autoLoad: true,
        listeners: {
            beforeload: function () {

            },
            load: function (t, n, e) {

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    cbEntidadesUIMA = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesUIMA',
        store: stEntidadesUIMA,
        fieldLabel: perfil.etiquetas.lbEntidadesUIM,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%',
        listeners: {
            select: function (cb, rec, index) {
                //stIndicadorA.reload();
            }
        }
    });
    cbEntidadesUIMA.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesUIMA.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stEntidadesClientesA = new Ext.data.Store({
        url: 'cargarEntidadesClientes',
        autoLoad: true,
        listeners: {
            beforeload: function () {

            },
            load: function (t, n, e) {

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    cbEntidadesClientesA = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesClientesA',
        store: stEntidadesClientesA,
        fieldLabel: perfil.etiquetas.lbClientes,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%',
        listeners: {
            select: function (cb, rec, index) {
                //stIndicadorA.reload();
            }
        }
    });
    cbEntidadesClientesA.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesClientesA.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stProgramasA = new Ext.data.Store({
        url: 'cargarProgramas',
        autoLoad: true,
        listeners: {
            beforeload: function () {

            },
            load: function (t, n, e) {

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbProgramasA = new Ext.ux.form.LovCombo({
        id: 'cbProgramasA',
        store: stProgramasA,
        fieldLabel: perfil.etiquetas.lbProgramas,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%',
        listeners: {
            select: function (cb, rec, index) {
                //stIndicadorA.reload();
            }
        }
    });
    cbProgramasA.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasA.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosA = new Ext.data.Store({
        url: 'cargarDestinos',
        autoLoad: true,
        listeners: {
            beforeload: function () {

            },
            load: function (t, n, e) {

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbDestinosA = new Ext.ux.form.LovCombo({
        id: 'cbDestinosA',
        store: stDestinosA,
        fieldLabel: perfil.etiquetas.lbDestinos,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%',
        listeners: {
            select: function (cb, rec, index) {
                //stIndicadorA.reload();
            }
        }
    });
    cbDestinosA.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosA.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    checkSmIndicadorA = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                controlarObjetosReporteA();
            },
            rowdeselect: function (sm, indiceFila, record) {
                controlarObjetosReporteA();
            }
        }
    });
    filtrosIndicadorA = new Ext.grid.GridFilters({
        filters: [{
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
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaA',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }]
    });
    cmIndicadorA = new Ext.grid.ColumnModel([checkSmIndicadorA, {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTipDenom
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }
    ]);
    stIndicadorA = new Ext.data.Store({
        url: 'listarIndicadoresControlados',
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpIndicadorA, filtrosIndicadorA, perfil.etiquetas.lbIndicadores);
                /*beforeloadstIndicadorA = true;                 
                 entidadesSelectIdA = cbEntidadesA.getCheckedValue().split(',');
                 if (cbEntidadesA.getCheckedValue().split(',')[0] != '') {
                 entidadesA = entidadesSelectIdA[0];
                 for (var i = 1; i < entidadesSelectIdA.length; i++) {
                 entidadesA = entidadesA + ',' + entidadesSelectIdA[i];
                 }
                 } else {
                 entidadesA = "";
                 for (i in stEntidadesA.data.items) {
                 if (stEntidadesA.data.items[i].data) {
                 if (i == 0)
                 entidadesA = stEntidadesA.data.items[i].data.identidad;
                 else
                 entidadesA = entidadesA + ',' + stEntidadesA.data.items[i].data.identidad;
                 }
                 }
                 }
                 stIndicadorA.baseParams.organismos = entidadesA;
                 stIndicadorA.baseParams.idejercicio = cbEjercicioA.getValue();
                 stIndicadorA.baseParams.idcategoria = scopeglobal.nodoCatA.id;*/
            },
            load: function () {
                if (beforeloadstIndicadorA) {
                    if (stIndicadorA.getCount() == 0) {
                        if (filtrosIndicadorA.getFiltrosActivos().length > 0) {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                        } else {
                            mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                        }
                    }
                }
                controlarObjetosReporteA();
                beforeloadstIndicadorA = false;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'idnaturaleza'
            }])
    });
// Grid panel para los elementos
    btnLimpiarIndicadorA = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarInd',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosIndicadorA.clearFilters();
        }
    });
    gpIndicadorA = new Ext.grid.GridPanel({
        id: 'gpIndicadorA',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stIndicadorA,
        plugins: filtrosIndicadorA,
        sm: checkSmIndicadorA,
        cm: cmIndicadorA,
        region: 'center',
        title: perfil.etiquetas.lbIndicadores,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        bbar: new Ext.PagingToolbar({
            store: stIndicadorA,
            displayInfo: true,
            items: ['-', btnLimpiarIndicadorA],
            listeners: {
                beforechange: function (p, e) {
                    IndicadorA = e.start;
                }
            }
        })
    });
    pgpIndicadorA = new Ext.Panel({
        id: 'pgpIndicadorA',
        height: 350,
        layout: 'fit',
        disabled: false,
        items: [gpIndicadorA]
    });

    btnAceptarA = new Ext.Button({
        disabled: true,
        id: 'btnAceptarA',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbObtener,
        tooltip: perfil.etiquetas.lbObtenerReporte,
        handler: function () {
            columnasA = [];
            if (cbColumnasA.getCheckedValue().split(',')[0] != '') {
                columnasSelectId = cbColumnasA.getCheckedValue().split(',');
                columnasSelectDenom = cbColumnasA.getRawValue().split(',');
                for (var i = 0; i < columnasSelectId.length; i++) {
                    columnasA.push({
                        uridatosnomenclador: columnasSelectId[i],
                        denominacion: columnasSelectDenom[i]
                    });
                }
            } else {
                for (i in stColumnasA.data.items) {
                    if (stColumnasA.data.items[i].data) {
                        columnasA.push({
                            uridatosnomenclador: stColumnasA.data.items[i].data.uridatosnomenclador,
                            denominacion: stColumnasA.data.items[i].data.denominacion
                        });
                    }
                }
            }

            /*indicadoresSelectA = checkSmIndicadorA.getSelections();
             contadorIndSeleccionados = 1;
             indicadoresA = indicadoresSelectA[0].data.idindicador;
             for (var i = 1; i < indicadoresSelectA.length; i++) {
             contadorIndSeleccionados++;
             indicadoresA = indicadoresA + ',' + indicadoresSelectA[i].data.idindicador;
             }
             denominacionIndSel = "2";
             if (contadorIndSeleccionados == 1)
             denominacionIndSel = indicadoresSelectA[0].data.denominacion;*/

            entidadesSelectIdUIMA = cbEntidadesUIMA.getCheckedValue().split(',');
            if (cbEntidadesUIMA.getCheckedValue().split(',')[0] != '') {
                entidadesUIMA = entidadesSelectIdUIMA[0];
                for (var i = 1; i < entidadesSelectIdUIMA.length; i++) {
                    entidadesUIMA = entidadesUIMA + ',' + entidadesSelectIdUIMA[i];
                }
            } else {
                entidadesUIMA = "";
                for (i in stEntidadesUIMA.data.items) {
                    if (stEntidadesUIMA.data.items[i].data) {
                        if (i == 0)
                            entidadesUIMA = stEntidadesUIMA.data.items[i].data.identidad;
                        else
                            entidadesUIMA = entidadesUIMA + ',' + stEntidadesUIMA.data.items[i].data.identidad;
                    }
                }
            }

            entidadesSelectIdClientesA = cbEntidadesClientesA.getCheckedValue().split(',');
            if (cbEntidadesClientesA.getCheckedValue().split(',')[0] != '') {
                entidadesClientesA = entidadesSelectIdClientesA[0];
                for (var i = 1; i < entidadesSelectIdClientesA.length; i++) {
                    entidadesClientesA = entidadesClientesA + ',' + entidadesSelectIdClientesA[i];
                }
            } else {
                entidadesClientesA = "";
                for (i in stEntidadesClientesA.data.items) {
                    if (stEntidadesClientesA.data.items[i].data) {
                        if (i == 0)
                            entidadesClientesA = stEntidadesClientesA.data.items[i].data.identidad;
                        else
                            entidadesClientesA = entidadesClientesA + ',' + stEntidadesClientesA.data.items[i].data.identidad;
                    }
                }
            }

            programasA = [];
            if (cbProgramasA.getCheckedValue().split(',')[0] != '') {
                programasSelectId = cbProgramasA.getCheckedValue().split(',');
                programasSelectDenom = cbProgramasA.getRawValue().split(',');
                for (var i = 0; i < programasSelectId.length; i++) {
                    programasA.push({
                        iddatosnomenclador: programasSelectId[i],
                        denominacion: programasSelectDenom[i]
                    });
                }
            } else {
                for (i in stProgramasA.data.items) {
                    if (stProgramasA.data.items[i].data) {
                        programasA.push({
                            iddatosnomenclador: stProgramasA.data.items[i].data.iddatosnomenclador,
                            denominacion: stProgramasA.data.items[i].data.denominacion
                        });
                    }
                }
            }

            destinosA = [];
            if (cbDestinosA.getCheckedValue().split(',')[0] != '') {
                destinosSelectId = cbDestinosA.getCheckedValue().split(',');
                destinosSelectDenom = cbDestinosA.getRawValue().split(',');
                for (var i = 0; i < destinosSelectId.length; i++) {
                    destinosA.push({
                        iddatosnomenclador: destinosSelectId[i],
                        denominacion: destinosSelectDenom[i]
                    });
                }
            } else {
                for (i in stDestinosA.data.items) {
                    if (stDestinosA.data.items[i].data) {
                        destinosA.push({
                            iddatosnomenclador: stDestinosA.data.items[i].data.iddatosnomenclador,
                            denominacion: stDestinosA.data.items[i].data.denominacion
                        });
                    }
                }
            }

            window.open('exportarReporte?idejercicio=' + cbEjercicioA.getValue() +
                    '&denoejercicio=' + cbEjercicioA.getRawValue() +
                    //
                    '&idperiodo=' + stPeriodoA.data.items[0].data.idtiponomenclador +
                    '&uriperiodo=' + cbPeriodoA.getValue() +
                    '&denoperiodo=' + cbPeriodoA.getRawValue() +
                    '&idcumplimiento=' + cbCumplimiento.getValue() +
                    //
                    '&columnas=' + Ext.encode(columnasA) +
                    //
                    '&entidadesUIM=' + entidadesUIMA +
                    //
                    '&clientes=' + entidadesClientesA +
                    //
                    '&programas=' + Ext.encode(programasA) +
                    //
                    '&destinos=' + Ext.encode(destinosA) //+
                    //
                    //'&idindicadores=' + indicadoresA
                    );
        }
    });

    fpContenedorA = new Ext.FormPanel({
        id: 'fpContenedorA',
        frame: true,
        items: [{
                xtype: 'fieldset',
                title: perfil.etiquetas.lbDatosGenerales,
                collapsible: true,
                autoHeight: true,
                items: [{
                        layout: 'column',
                        items: [{
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbEjercicioA]
                            }, {
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbPeriodoA]
                            }, {
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbColumnasA]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbEntidadesUIMA]
                            }
                            , {
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbEntidadesClientesA]
                            }
                            , {
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbCumplimiento]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbProgramasA]
                            }, {
                                columnWidth: 0.3,
                                layout: 'form',
                                items: [cbDestinosA]
                            }
                        ]
                    }/*, {
                     layout: 'column',
                     items: [{
                     columnWidth: 1,
                     layout: 'form',
                     items: [pgpIndicadorA]
                     }
                     ]
                     }*/
                ]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: 0.2,
                        layout: 'form',
                        items: [btnAceptarA]
                    }
                ]
            }]
    });

    pContenedorA = new Ext.Panel({
        layout: 'fit',
        items: [fpContenedorA]
    });

    function controlarObjetosReporteA() {
        btnAceptarA.disable();
        if (cbEjercicioA.getValue() != undefined && cbEjercicioA.getValue() != null && cbEjercicioA.getValue() != '')
            if (cbPeriodoA.getValue() != undefined && cbPeriodoA.getValue() != null && cbPeriodoA.getValue() != '')
                btnAceptarA.enable();
    }

}
