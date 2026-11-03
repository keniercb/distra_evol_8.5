var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('formulanutricional', cargarInterfazFormulaNutricional);
var identidadselect;
var accionAprobarFormula = false;
var accionAcepAplic = "";
var comp_modificados = [];
var records_selecc_formulas, records_selecc_comp, rowIndex_fomrula, accionFormActv, actividadesNoNormadas, actividadesNormadas;
var offsetFormula = 0, offsetComponente = 0, offsetActividades = 0, offsetbtnLimpiarAddIndicadorSalida = 0;
var kcalActualizada = 0, accion = '';
function cargarInterfazFormulaNutricional() { 

    //Para el trabajo con las UM a partir de 'idumedida'
    stum = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/bpgestactividades/cargarunidadmedida',
        id: 'stum',
        reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idunidadmedida'
            },
            [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });
    stum.reload();
    //Fin del store UM

    //Para el trabajo con los usuarios a partir de 'idusuario'
    stUsuarios = new Ext.data.Store({
        url: 'cargarUsuarios',
        id: 'stUsuarios',
        reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idusuario'
            },
            [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });
    stUsuarios.reload();
    //Fin del store Usuarios

    //Para el trabajo con las agrupaciones a partir de 'idagrupacion'
    stAgrupaciones = new Ext.data.Store({
        url: 'cargarAgrupaciones',
        id: 'stAgrupaciones',
        reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idagrupacion'
            },
            [{
                name: 'idagrupacion'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });
    stAgrupaciones.reload();
    //Fin del store Agrupaciones

    tpEstructuraFormNutri = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 300

    });
    tpEstructuraFormNutri = tpEstructuraFormNutri.items.items[0];
    tpEstructuraFormNutri.getRootNode().expand();
    tpEstructuraFormNutri.addListener('click', function (node, event) {
        identidadselect = node.id;

        if(stFormulas){
            stFormulas.loadData({"data": [], "total": 0});
        }
        if (identidadselect != 'Estructuras') {
            pFormulas.enable();
            stFormulas.reload();
            btnAddFormula.enable();
        } else {
            pFormulas.disable();
            stFormulas.removeAll();
        }
    });
    pIzqEstructura = new Ext.Panel({
        title: perfil.etiquetas.lbEntidades,
        region: 'west',
        width: '20%',
        collapsible: true,
        layout: 'fit',
        items: [tpEstructuraFormNutri]
    });
    /*Panel de Formulas*/
    btnLimpiarGFormNut = new Ext.Toolbar.Button({
        id: 'idbtnLimpiarGFormNut',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar + ' <b>(Alt+L)<b>',
        disabled: false,
        handler: function () {
            //smFormulas.clearSelections();
            filtrosFormulas.clearFilters();
            //controlarBotonesFormula();
        }
    });
    cmFormulas = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        {
            id: 'denomFormNutri',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbTtFecha,
            dataIndex: 'fecha',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            dataIndex: 'idusuario',
            sortable: true,
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbEstado,
            tooltip: perfil.etiquetas.lbEstado,
            dataIndex: 'estado',
            sortable: true,
            renderer: crearEstado
        }, {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigoind',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbIndicador,
            tooltip: perfil.etiquetas.lbIndicador,
            dataIndex: 'denomindicador',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            dataIndex: 'idumedida',
            sortable: true,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'cantidadsalida',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbKcal,
            tooltip: perfil.etiquetas.lbKilocalorias,
            dataIndex: 'kcalformula',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbIngredientes,
            tooltip: perfil.etiquetas.lbIngredientes,
            dataIndex: 'normada',
            sortable: true,
            renderer: renderNormada
        }, {
            header: perfil.etiquetas.lbTipo,
            tooltip: perfil.etiquetas.lbTipo,
            dataIndex: 'tipoporciento',
            sortable: true,
            renderer: crearTipo
        }, {
            header: perfil.etiquetas.lbAgrupacion,
            tooltip: perfil.etiquetas.lbAgrupacion,
            dataIndex: 'idagrupacion',
            sortable: true,
            renderer: renderAgrupaciones
        }
    ]);
    smFormulas = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function (sm) {
                controlarBotonesFormula();
            }
        }
    });
    filtrosFormulas = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuarioFormulas',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'string',
                dataIndex: 'codigoind'
            }, {
                type: 'string',
                dataIndex: 'denomindicador'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaFormulas',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadsalida'
            }, {
                type: 'numeric',
                dataIndex: 'kcalformula'
            }, {
                type: 'list',
                dataIndex: 'normada',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'tipoporciento',
                options: [perfil.etiquetas.lbPorcentual, perfil.etiquetas.lbDirecta]
            }, {
                type: 'listado',
                dataIndex: 'idagrupacion',
                idcombo: 'idcbagrupacionFormulas',
                valueFieldcb: 'idagrupacion',
                displayFieldcb: 'denominacion',
                st: stAgrupaciones,
                autoload: false,
                mode: 'local'
            }
        ]
    });
    stFormulas = new Ext.data.Store({
        url: 'listarFormulasNutricionales',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idformula',
            totalProperty: 'total'
        }, [{
            name: 'idformula'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'fecha'
        }, {
            name: 'idusuario'
        }, {
            name: 'estado'
        }, {
            name: 'codigoind'
        }, {
            name: 'denomindicador'
        }, {
            name: 'idumedida'
        }, {
            name: 'cantidadsalida'
        }, {
            name: 'kcalformula'
        }, {
            name: 'normada'
        }, {
            name: 'tipoporciento'
        }, {
            name: 'idagrupacion'
        }
        ]),
        listeners: {
            beforeload: function (st, options) {
                st.baseParams.identidad = identidadselect;
                st.baseParams.start = offsetFormula;
                st.baseParams.global = chkGlobalGestionForm.getValue();
                cambiarTituloFiltrar(gridFormulas, filtrosFormulas, perfil.etiquetas.lbFormulas);
            },
            load: function (st, rec, opt) {
                if (st.getCount() == 0) {
                    mostrarMensaje(2, "No existen datos que mostrar" /*perfil.etiquetas.lbNoExistenDatos*/);
                }
                //BotonesFormula();
                //smFormulas.selectRow(rowIndex_fomrula);
            }
        }
    });
    pgFormulas = new Ext.PagingToolbar({
        store: stFormulas,
        id: 'idpgFormulas',
        displayInfo: true,
        items: ['-', btnLimpiarGFormNut],
        listeners: {
            beforechange: function (p, e) {
                offsetFormula = e.start;
            }
        }
    });
    gridFormulas = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbFormulas,
        autoExpandColumn: 'denomFormNutri',
        store: stFormulas,
        cm: cmFormulas,
        sm: smFormulas,
        plugins: filtrosFormulas,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        contextmenu: new Ext.menu.Menu({
            id: 'mdGridFormulas',
            items: [{
                text: perfil.etiquetas.lbAdicionarIngrediente,
                itemCls: 'x-menu-item icondistra-adicionar',
                iconCls: 'imagen-none',
                id: 'mAddNorma',
                handler: function () {
                    adicionarIndicadorTP();
                }
            }]
        }),
        bbar: pgFormulas,
        listeners: {
            rowcontextmenu: function (grid_this, row_index, event) {
                event.stopEvent();
                if (smFormulas.getSelected().data.estado != 1) {
                    if (grid_this.getSelectionModel().hasSelection()) {
                        grid_this.contextmenu.showAt(event.getXY());
                    }
                }
            }
        },
    });
    btnAddFormula = new Ext.Button({
        id: 'idbtnAddFormula',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionarFormula,
        disabled: true,
        handler: function () {
            wAddFormula('add');
        }
    });
    btnModFormula = new Ext.Button({
        id: 'idbtnModFormula',
        iconCls: 'modificar',
        tooltip: perfil.etiquetas.lbModificarFormula,
        disabled: true,
        handler: function () {
            wAddFormula('mod');
        }
    });
    btnAprobarFormula = new Ext.Button({
        id: 'idbtnAprobarFormula',
        iconCls: 'aprobar',
        tooltip: perfil.etiquetas.lbAprobarFormula,
        disabled: true,
        handler: function () {
            accionAprobarFormula = true;
            if (smFormulas.getSelections().length == 1) {
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarAprobarSingular, aprobarDesaprobarFormula);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarAprobarPlural, aprobarDesaprobarFormula);
            }
        }
    });
    btndesaprobarFormula = new Ext.Button({
        id: 'btndesaprobarFormula',
        iconCls: 'desaprobar',
        tooltip: perfil.etiquetas.lbDesaprobarFormula,
        disabled: true,
        handler: function () {
            if (smFormulas.getSelections().length == 1) {
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarDesaprobarSingular, aprobarDesaprobarFormula);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarDesaprobarPlural, aprobarDesaprobarFormula);
            }
        }
    });
    btnDelFormula = new Ext.Button({
        id: 'idbtnDelFormula',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminarFormula,
        disabled: true,
        handler: function () {
            if (smFormulas.getSelections().length == 1) {
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarSingular, eliminarFormula);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarPlural, eliminarFormula);
            }
        }
    });
    btnAsociarFormula = new Ext.Button({
        id: 'btnAsociarFormula',
        iconCls: 'asociar',
        tooltip: perfil.etiquetas.lbAsociarFormula,
        disabled: true,
        handler: function () {
            wAsociarFormulaActv('asociar');
        }
    });
    btnDesasociarFormula = new Ext.Button({
        id: 'btnDesasociarFormula',
        iconCls: 'deshacer',
        tooltip: perfil.etiquetas.lbDesasociarFormula,
        disabled: true,
        handler: function () {
            wAsociarFormulaActv('desasociar');
        }
    });
    chkGlobalGestionForm = new Ext.form.Checkbox({
        id: 'idchkGlobalGestionForm',
        align: 'right',
        boxLabel: perfil.etiquetas.lbGlobal,
        listeners: {
            check: function () {
                stFormulas.reload();
            }
        }
    });
    btnAyuGestForm = new Ext.Button({
        id: 'idbtnAyuGestForm',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbAyuda
    });
    pFormulas = new Ext.Panel({
        height: 450,
        layout: 'fit',
        split: true,
        region: 'center',
        disabled: true,
        tbar: [btnAddFormula, btnModFormula, btnDelFormula, btnAprobarFormula, btndesaprobarFormula, btnAsociarFormula, /*btnDesasociarFormula,*/ chkGlobalGestionForm, '->', btnAyuGestForm],
        items: [gridFormulas]
    });

    /*Panel de Componentes*/
    cmComponentes = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'denominacionComp',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            dataIndex: 'idumedida',
            sortable: true,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            dataIndex: 'precio',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'cantidad',
            sortable: true,
            align: 'right',
            renderer: crearToolTip,
            editable: false,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            })
        }, {
            header: perfil.etiquetas.lbPorciento,
            tooltip: perfil.etiquetas.lbPorciento,
            dataIndex: 'porciento',
            sortable: true,
            align: 'right',
            editable: false,
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            })
        }, {
            header: perfil.etiquetas.lbKcal,
            tooltip: perfil.etiquetas.lbKcal,
            dataIndex: 'kcal',
            sortable: true,
            align: 'right',
            renderer: decimalescantidad
        }, {
            header: perfil.etiquetas.lbGrasas,
            tooltip: perfil.etiquetas.lbGrasas,
            dataIndex: 'grasas',
            sortable: true,
            align: 'right',
            renderer: decimalescantidad
        }, {
            header: perfil.etiquetas.lbProteinas,
            tooltip: perfil.etiquetas.lbProteinas,
            dataIndex: 'proteinas',
            sortable: true,
            align: 'right',
            renderer: decimalescantidad
        }, {
            header: perfil.etiquetas.lbCarbohidratos,
            tooltip: perfil.etiquetas.lbCarbohidratos,
            dataIndex: 'carbohidratos',
            sortable: true,
            align: 'right',
            renderer: decimalescantidad
        }, {
            header: perfil.etiquetas.lbImporte,
            tooltip: perfil.etiquetas.lbImporte,
            dataIndex: 'importe',
            sortable: true,
            align: 'right',
            renderer: decimalesimporte
        }, {
            header: perfil.etiquetas.lbActivo,
            tooltip: perfil.etiquetas.lbActivo,
            dataIndex: 'estado',
            sortable: true,
            renderer: crearEstado
        }
    ]);
    filtrosComponentes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaComponentes',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'porciento'
            }, {
                type: 'numeric',
                dataIndex: 'kcal'
            }, {
                type: 'numeric',
                dataIndex: 'grasas'
            }, {
                type: 'numeric',
                dataIndex: 'proteinas'
            }, {
                type: 'numeric',
                dataIndex: 'carbohidratos'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }
        ]
    });
    cmComponentes.defaultSortable = true;
    smComponentes = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function (sm) {
                controlarBotonesComponentes();
            }
        }
    });
    stComponentes = new Ext.data.Store({
        url: 'listarComponentes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            importetotal: 'importetotal',
            kcaltotal: 'kcaltotal',
            grasastotal: 'grasastotal',
            proteinastotal: 'proteinastotal',
            carbohidratostotal: 'carbohidratostotal'
        }, [
            {
                name: 'idtablacalorica'
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
                name: 'cantidad'
            }, {
                name: 'porciento'
            }, {
                name: 'kcal'
            }, {
                name: 'grasas'
            }, {
                name: 'proteinas'
            }, {
                name: 'carbohidratos'
            }, {
                name: 'importe'
            }, {
                name: 'estado'
            }
        ]),
        listeners: {
            beforeload: function (st, options) {
                st.baseParams.idformula = smFormulas.getSelected().data.idformula;
                st.baseParams.start = offsetComponente;
                cambiarTituloFiltrar(gridComponentes, filtrosComponentes, '');
            },
            load: function (st, rec, opt) {
                comp_modificados = [];
                tfKcalTotal.setValue(st.reader.jsonData.kcaltotal);
                tfGrasasTotal.setValue(st.reader.jsonData.grasastotal);
                tfProteinasTotal.setValue(st.reader.jsonData.proteinastotal);
                tfCarbohidratosTotal.setValue(st.reader.jsonData.carbohidratostotal);
                tfImporteTotal.setValue(st.reader.jsonData.importetotal);
                controlarBotonesComponentes();
            }
        }
    });
    btnLimpiarComponentes = new Ext.Button({
        id: 'idbtnLimpiarComponentes',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar + ' <b>(Alt+L)<b>',
        disabled: false,
        handler: function () {
            filtrosComponentes.clearFilters();
            controlarBotonesComponentes();
        }
    });
    tfKcalTotal = new Ext.form.TextField({
        id: 'idtfKcalTotal',
        width: 100,
        disabled: true
    });
    tfGrasasTotal = new Ext.form.TextField({
        id: 'idtfGrasasTotal',
        width: 100,
        disabled: true
    });
    tfProteinasTotal = new Ext.form.TextField({
        id: 'idtfProteinasTotal',
        width: 100,
        disabled: true
    });
    tfCarbohidratosTotal = new Ext.form.TextField({
        id: 'idtfCarbohidratosTotal',
        width: 100,
        disabled: true
    });
    tfImporteTotal = new Ext.form.TextField({
        id: 'idtfImporteTotal',
        width: 100,
        disabled: true
    });
    pgComponentes = new Ext.PagingToolbar({
        store: stComponentes,
        id: 'idpgComponentes',
        displayInfo: true,
        items: ['-', btnLimpiarComponentes, {bodyStyle: 'marginLeft: 5px'},
            {
                xtype: 'tbtext',
                text: '<b>' + perfil.etiquetas.lbKcal + ': </b>'
            }, tfKcalTotal, {bodyStyle: 'marginLeft: 5px'},
            {
                xtype: 'tbtext',
                text: '<b>' + perfil.etiquetas.lbGrasas + ': </b>'
            }, tfGrasasTotal, {bodyStyle: 'marginLeft: 5px'},
            {
                xtype: 'tbtext',
                text: '<b>' + perfil.etiquetas.lbProteinas + ': </b>'
            }, tfProteinasTotal, {bodyStyle: 'marginLeft: 5px'},
            {
                xtype: 'tbtext',
                text: '<b>' + perfil.etiquetas.lbCarbohidratos + ': </b>'
            }, tfCarbohidratosTotal, {bodyStyle: 'marginLeft: 5px'},
            {xtype: 'tbtext', text: '<b>' + perfil.etiquetas.lbImporte + ': </b>'}, tfImporteTotal],
        listeners: {
            beforechange: function (p, e) {
                offsetComponente = e.start;
            }
        }
    });
    gridComponentes = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.lbIngredientes,
        autoExpandColumn: 'denominacionComp',
        store: stComponentes,
        cm: cmComponentes,
        plugins: filtrosComponentes,
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        sm: smComponentes,
        bbar: pgComponentes,
        listeners: {
            afteredit: function (sm) {
                comp_modificados.push({
                    data: sm.record.data
                })
            }
        }
    });
    btnAddComponente = new Ext.Button({
        id: 'idbtnAddComponente',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionarIngrediente,
        disabled: true,
        handler: function () {
            adicionarIndicadorTP();
        }
    });
    btnCalcular = new Ext.Button({
        id: 'idbtnCalcular',
        iconCls: 'calcular',
        tooltip: perfil.etiquetas.lbCalcular,
        disabled: true,
        handler: function () {
            accion = 'calc';
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarCalcular, guardarComponente);
        }
    });
    btnDelComponentes = new Ext.Button({
        id: 'idbtnDelComponentes',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbEliminarIngrediente,
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarIngrediente, eliminarComponente);
        }
    });
    pComponentes = new Ext.Panel({
        layout: 'fit',
        title: perfil.etiquetas.lbIngredientes,
        split: true,
        region: 'south',
        collapsible: true,
        collapsed: true,
        height: 300,
        titleCollapse: false,
        tbar: [btnAddComponente, btnCalcular, btnDelComponentes],
        items: [gridComponentes]
    });
    pDerecho = new Ext.Panel({
        layout: 'border',
        region: 'center',
        items: [pFormulas, pComponentes]
    });
    pGeneral = new Ext.Panel({
        layout: 'border',
        items: [pIzqEstructura, pDerecho]
    });
    myViewFormNutri = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral]
    });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearEstado(v, m) {
    if (v == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobado + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbDesaprobado + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderNormada(value, m) {
    if (value != 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobado + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbDesaprobado + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stum.data.items)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        }
}

function renderUsuarios(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stUsuarios.data.items)
        if (stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
}

function renderAgrupaciones(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stAgrupaciones.data.items)
        if (stAgrupaciones.data.items[i].data.idagrupacion == value) {
            m.attr = 'ext:qtip="' + stAgrupaciones.data.items[i].data.denominacion + '"';
            return stAgrupaciones.data.items[i].data.denominacion;
        }
}

function crearTipo(v, m) {
    if (v == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbPorcentual + '"';
        return perfil.etiquetas.lbPorcentual;
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbDirecta + '"';
        return perfil.etiquetas.lbDirecta;
    }
}

function wAddFormula(accion) {


    var txfDenominacion = new Ext.form.TextField({
        id: 'idtxfDenominacion',
        anchor: '100%',
        align: 'right',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        allowBlank: false
    });
    var txfDescripcion = new Ext.form.TextArea({
        id: 'idtxfDescripcion',
        anchor: '100%',
        align: 'right',
        fieldLabel: perfil.etiquetas.lbDescripcion
    });
    var nfCalorias = new Ext.form.NumberField({
        id: 'idnfCalorias',
        anchor: '100%',
        align: 'right',
        fieldLabel: perfil.etiquetas.lbKcalTotal
    });
    var cbAgrupacion = new Ext.form.ComboBox({
        fieldLabel: perfil.etiquetas.lbAgrupacion,
        id: 'idcbAgrupacion',
        store: stAgrupaciones,
        displayField: 'denominacion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        valueField: 'idagrupacion',
        value: '',
        emptyText: perfil.etiquetas.lbSeleccionar,
        allowBlank: false,
        anchor: '95%',
        listeners: {
            select: function (cb, record, index) {
            }
        }
    });
    /*GridPanel pa el indicador de salidas adicionado*/

    btnAddIndicadorSalida = new Ext.Button({
        id: 'idbtnAddIndicadorSalida',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionarIndSalida,
        handler: function () {
            adicionarIndicadorSalida(stIndicadorSalida);
        }
    });
    btnElimIndicadorSalida = new Ext.Button({
        id: 'idbtnElimIndicadorSalida',
        iconCls: 'eliminar',
        tooltip: 'Eliminar',
        handler: function () {
            mostrarMensaje(2, "¿Está seguro que desea eliminar el indicador de salida seleccionado?", eliminarIndSalida);
        }
    });

    filtrosIndicadorSalida = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaIndicadorSalida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadsalida'
            }
        ]
    });
    cmIndicadorSalida = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'denominacionIndicSalida',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            dataIndex: 'idumedida',
            sortable: true,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'cantidadsalida',
            sortable: true,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                maxValue: 100000
            }),
            renderer: crearToolTip
        }
    ]);
    smIndicadorSalida = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, num, rec) {
                btnElimIndicadorSalida.enable();
            },
            rowdeselect: function (sm, num, rec) {
                btnElimIndicadorSalida.disable();
            }
        }
    });
    stIndicadorSalida = new Ext.data.Store({
        url: 'cargarIndicadorSalidad',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [
            {
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'denomum'
            }, {
                name: 'cantidadsalida'
            }, {
                name: 'idumedida'
            }
        ]),
        listeners: {
            beforeload: function (st, options) {
                st.baseParams.idformula = smFormulas.getSelected().data.idformula;
            },
            load: function (st, rec, opt) {
                if (st.getCount() == 0) {
                    mostrarMensaje(2, perfil.etiquetas.lbNoExistenDatos);
                }
            }
        }
    });
    gridIndicSalida = new Ext.grid.EditorGridPanel({
        autoExpandColumn: 'denominacionIndicSalida',
        height: 100,
        plugins: filtrosIndicadorSalida,
        store: stIndicadorSalida,
        cm: cmIndicadorSalida,
        sm: smIndicadorSalida,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [btnAddIndicadorSalida, btnElimIndicadorSalida]
    });
    fpFormNutri = new Ext.FormPanel({
        frame: true,
        labelAlign: 'top',
        autoValidate: false,
        items: [txfDenominacion, txfDescripcion,
            {
                layout: 'column',
                items: [{
                    columnWidth: .7,
                    layout: 'form',
                    items: [cbAgrupacion]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [nfCalorias]
                }]
            }, gridIndicSalida
        ]
    });
    btnCancelarFormNutri = new Ext.Button({
        text: perfil.etiquetas.lbCancelar,
        disabled: false,
        id: 'idbtnCancelarFormNutri',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        handler: function () {
            fpFormNutri.getForm().reset();
            wFormNutri.destroy();
        }
    });
    btnAplicarFormNutri = new Ext.Button({
        text: perfil.etiquetas.lbAplicar,
        disabled: true,
        id: 'idbtnAplicarFormNutri',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardarSinCerrar,
        handler: function () {
            accionAcepAplic = "aplicar";
            adicionarFormulaNutri(stIndicadorSalida, smFormulas, accion);
        }
    });
    btnAceptarFormNutri = new Ext.Button({
        text: perfil.etiquetas.lbAceptar,
        disabled: true,
        id: 'idbtnAceptarFormNutri',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        handler: function () {
            accionAcepAplic = "aceptar";
            adicionarFormulaNutri(stIndicadorSalida, smFormulas, accion);
        }
    });



    wFormNutri = new Ext.Window({
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        items: fpFormNutri,
        resizable: false,
        width: 500,
        height: 360,
        listeners: {
            beforeshow: function () {
                if (accion == 'add') {
                    smFormulas.clearSelections();
                    btnAplicarFormNutri.show();
                    wFormNutri.setTitle(perfil.etiquetas.lbAdicionarFormula);
                    Ext.getCmp('idnfCalorias').enable();
                } else {
                    if (smFormulas.getSelected().data.tipoporciento == 0) {
                        Ext.getCmp('idnfCalorias').disable();
                    }
                    Ext.getCmp('idtxfDenominacion').setValue(smFormulas.getSelected().data.denominacion);
                    Ext.getCmp('idtxfDescripcion').setValue(smFormulas.getSelected().data.descripcion);
                    Ext.getCmp('idcbAgrupacion').setValue(smFormulas.getSelected().data.idagrupacion);
                    Ext.getCmp('idnfCalorias').setValue(smFormulas.getSelected().data.kcalformula);
                    stIndicadorSalida.load();
                    btnAplicarFormNutri.hide();
                    nfCalorias.regex = /^([1-9]+ ?[0-9]*)+$/;
                    nfCalorias.regexText = "Solo admite números enteros positivos entre 1 y 99999999.";
                    nfCalorias.allowBlank = false;
                    wFormNutri.setTitle(perfil.etiquetas.lbModificarFormula);
                }
            }
        },
        buttons: [btnCancelarFormNutri, btnAplicarFormNutri, btnAceptarFormNutri]
    });
    wFormNutri.show();



}

function adicionarIndicadorSalida(stIndicadorSalida) {
    filtrosAddIndicadorSalida = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddIndicadorSalida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }
        ]
    });
    cmAddIndicadorSalida = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'denominacionIndicSeleccionar',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            sortable: true,
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            dataIndex: 'idumedida',
            sortable: true,
            renderer: renderUM
        }
    ]);
    smAddIndicadorSalida = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, num, rec) {
                btnAceptarAddIndicadorSalida.enable();
            },
            rowdeselect: function (sm, num, rec) {
                btnAceptarAddIndicadorSalida.disable();
            }
        }
    });
    stAddIndicadorSalida = new Ext.data.Store({
        url: 'listarIndicadores',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [
            {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }
        ]),
        listeners: {
            beforeload: function (_this, options) {
                cambiarTituloFiltrar(gpAddIndicadorSalida, filtrosAddIndicadorSalida, 'Indicadores');
                stAddIndicadorSalida.baseParams.start = offsetbtnLimpiarAddIndicadorSalida;
            }
        }
    });
    btnLimpiarAddIndicadorSalida = new Ext.Toolbar.Button({
        id: 'btnLimpiarAddIndicadorSalida',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosAddIndicadorSalida.clearFilters();
        }
    });
    gpAddIndicadorSalida = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.lbIndicadores,
        autoExpandColumn: 'denominacionIndicSeleccionar',
        plugins: filtrosAddIndicadorSalida,
        store: stAddIndicadorSalida,
        cm: cmAddIndicadorSalida,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        sm: smAddIndicadorSalida,
        listeners: {
            celldblclick: function () {
                addindicadorSal(stIndicadorSalida, smAddIndicadorSalida);
                wAddIndicadorSalida.destroy();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stAddIndicadorSalida,
            displayInfo: true,
            items: ['-', btnLimpiarAddIndicadorSalida],
            listeners: {
                beforechange: function (p, e) {
                    offsetbtnLimpiarAddIndicadorSalida = e.start;
                }
            }
        }),
    });
    pAddIndicadorSalida = new Ext.Panel({
        frame: true,
        layout: 'fit',
        items: [gpAddIndicadorSalida]
    });
    btnCancelarAddIndicadorSalida = new Ext.Button({
        text: perfil.etiquetas.lbCancelar,
        disabled: false,
        id: 'idbtnCancelarIndicaSalida',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        handler: function () {
            wAddIndicadorSalida.destroy();
        }
    });
    btnAceptarAddIndicadorSalida = new Ext.Button({
        text: perfil.etiquetas.lbAceptar,
        disabled: true,
        id: 'idbtnAceptarIndicaSalida',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        handler: function () {
            addindicadorSal(stIndicadorSalida, smAddIndicadorSalida);
            wAddIndicadorSalida.destroy();
        }
    });
    wAddIndicadorSalida = new Ext.Window({
        title: perfil.etiquetas.lbSeleccionarIndSalida,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        items: pAddIndicadorSalida,
        resizable: false,
        width: 500,
        height: 300,
        listeners: {
            beforeshow: function () {
                stAddIndicadorSalida.load();
            }
        },
        buttons: [btnCancelarAddIndicadorSalida, btnAceptarAddIndicadorSalida]
    });
    wAddIndicadorSalida.show();
}

function addindicadorSal(stIndicSal, smAddIndicadorSalida) {
    newR = new Ext.data.Record({
        idindicador: smAddIndicadorSalida.getSelected().data.idindicador,
        codigo: smAddIndicadorSalida.getSelected().data.codigo,
        denominacion: smAddIndicadorSalida.getSelected().data.denominacion,
        descripcion: smAddIndicadorSalida.getSelected().data.descripcion,
        idumedida: smAddIndicadorSalida.getSelected().data.idumedida,
        cantidadsalida: 0
    });
    stIndicSal.removeAll();
    stIndicSal.add(newR);
    wAddIndicadorSalida.destroy();
}

function adicionarFormulaNutri(stIndicSali, smForm, accion) {
    ind = stIndicSali.data.items[0].data;
    if (accion == 'mod') {
        idformula = smForm.getSelected().data.idformula;
    } else {
        idformula = "";
    }

    var barraEstado = Ext.MessageBox.show({
        msg: perfil.etiquetas.lbAdicionandoFormula,
        title: perfil.etiquetas.msgEspere,
        width: 300,
        wait: true,
        modal: true
    });
    Ext.Ajax.request({
        url: 'adicionarFormulasNutricionales',
        params: {
            idformula: idformula,
            identidad: identidadselect,
            denominacion: Ext.getCmp('idtxfDenominacion').getValue(),
            descripcion: Ext.getCmp('idtxfDescripcion').getValue(),
            idindicadorsalida: ind.idindicador,
            cantidadsalida: ind.cantidadsalida,
            idagrupacion: Ext.getCmp('idcbAgrupacion').getValue(),
            tipoporciento: Ext.getCmp('idnfCalorias').getValue() ? 1 : 0,
            kcalformula: Ext.getCmp('idnfCalorias').getValue() ? Ext.getCmp('idnfCalorias').getValue() : 0,
            estado: 0
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData) {
                stFormulas.reload();
                kcalActualizada = Ext.getCmp('idnfCalorias').getValue() ? Ext.getCmp('idnfCalorias').getValue() : 0;
                if (accion == 'mod') {
                    guardarComponente('ok');
                    mostrarMensaje(2, perfil.etiquetas.msgFormulaModificadaOk);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgFormulaAdicionadaOk);
                }

                if (accionAcepAplic == "aplicar") {
                    fpFormNutri.getForm().reset();
                    stIndicadorSalida.removeAll();
                } else {
                    wFormNutri.destroy();
                }
                accionAcepAplic = "";
            } else {
                if (accion == 'mod') {
                    mostrarMensaje(2, perfil.etiquetas.msgFormulaModificadaNoOk);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgFormulaAdicionadaNoOk);
                }
            }
            barraEstado.hide();
        }
    });
}

function eliminarIndSalida(btn_pres) {
    if (btn_pres == 'ok') {
        wFormNutri.fireEvent('gridEvent');
        stIndicadorSalida.removeAll();
        btnElimIndicadorSalida.disable();
    }
}

function adicionarIndicadorTP() {
    filtrosAddComponentes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddComponentes',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'kcal'
            }, {
                type: 'numeric',
                dataIndex: 'grasas'
            }, {
                type: 'numeric',
                dataIndex: 'proteinas'
            }, {
                type: 'numeric',
                dataIndex: 'carbohidratos'
            }
        ]
    });
    cmAddComponentes = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'iddenominacionIndicSeleccionarTP',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            hidden: true,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            dataIndex: 'idumedida',
            sortable: true,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            dataIndex: 'precio',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'cantidad',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbKcal,
            tooltip: perfil.etiquetas.lbKcal,
            dataIndex: 'kcal',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbGrasas,
            tooltip: perfil.etiquetas.lbGrasas,
            dataIndex: 'grasas',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbProteinas,
            tooltip: perfil.etiquetas.lbProteinas,
            dataIndex: 'proteinas',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCarbohidratos,
            tooltip: perfil.etiquetas.lbCarbohidratos,
            dataIndex: 'carbohidratos',
            sortable: true,
            align: 'right',
            renderer: crearToolTip
        }
    ]);
    smAddComponentes = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, num, rec) {
                btnAceptarAddComponentes.enable();
            },
            rowdeselect: function (sm, num, rec) {
                btnAceptarAddComponentes.disable();
            }
        }
    });
    stAddComponentes = new Ext.data.Store({
        url: 'listarComponentesFormulasNutri',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
            name: 'idtablacalorica'
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
            name: 'cantidad'
        }, {
            name: 'kcal'
        }, {
            name: 'grasas'
        }, {
            name: 'proteinas'
        }, {
            name: 'carbohidratos'
        }
        ]),
        listeners: {
            beforeload: function (st, options) {
                st.baseParams.identidad = identidadselect;
                st.baseParams.idformula = smFormulas.getSelected().data.idformula;
                idtablacalorica = "";
                for (var i = 0; i < stComponentes.data.items.length; i++) {
                    if (idtablacalorica == "") {
                        idtablacalorica = stComponentes.data.items[i].data.idtablacalorica;
                    } else {
                        idtablacalorica = idtablacalorica + "," + stComponentes.data.items[i].data.idtablacalorica;
                    }
                }
                st.baseParams.idtablacalorica = idtablacalorica;
                st.baseParams.start = 0;
                st.baseParams.limit = pgAddComponentes.pageSize;
                cambiarTituloFiltrar(gpAddComponentes, filtrosAddComponentes, perfil.etiquetas.lbIndTablaCalorica);
            },
            load: function (st, rec, opt) {
                if (st.getCount() == 0) {
                    mostrarMensaje(2, perfil.etiquetas.lblbNoExistenDatos);
                }
            }
        }
    });
    btnLimpiarAddComponentes = new Ext.Button({
        id: 'idbtnLimpiarIndicSeleccionarTP',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar + ' <b>(Alt+L)<b>',
        disabled: false,
        handler: function () {
            smAddComponentes.clearSelections();
//            gpAddComponentes.getStore().reload();
            filtrosAddComponentes.clearFilters();
        }
    });
    pgAddComponentes = new Ext.PagingToolbar({
        store: stAddComponentes,
        id: 'idpgAddComponentes',
        displayInfo: true,
        items: ['-', btnLimpiarAddComponentes]
    });
    gpAddComponentes = new Ext.grid.EditorGridPanel({
        title: perfil.etiquetas.lbAdicionarIngrediente,
        autoExpandColumn: 'iddenominacionIndicSeleccionarTP',
        plugins: filtrosAddComponentes,
        store: stAddComponentes,
        cm: cmAddComponentes,
        sm: smAddComponentes,
        bbar: pgAddComponentes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        listeners: {
            celldblclick: function () {
                addindicadorTP(stComponentes, smAddComponentes);
                wAddComponentes.destroy();
            }
        }
    });
    pAddComponentes = new Ext.Panel({
        frame: true,
        layout: 'fit',
        items: [gpAddComponentes]
    });
    btnCancelarAddComponentes = new Ext.Button({
        text: perfil.etiquetas.lbCancelar,
        disabled: false,
        id: 'idbtnCancelarIndicaSalida',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        handler: function () {
            wAddComponentes.destroy();
        }
    });
    btnAceptarAddComponentes = new Ext.Button({
        text: perfil.etiquetas.lbAceptar,
        disabled: true,
        id: 'idbtnAceptarIndicaSalida',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        handler: function () {
            addindicadorTP(stComponentes, smAddComponentes);
            wAddComponentes.destroy();
        }
    });
    wAddComponentes = new Ext.Window({
        title: perfil.etiquetas.lbAdicionarIngredienteTablaCalorica,
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        items: pAddComponentes,
        resizable: false,
        width: 1000,
        height: 580,
        listeners: {
            beforeshow: function () {
                stAddComponentes.load();
            }
        },
        buttons: [btnCancelarAddComponentes, btnAceptarAddComponentes]
    });
    wAddComponentes.show();
}

function addindicadorTP(stComponentes, smAddComponentes) {
    seleccion = smAddComponentes.getSelections();
    for (var i = 0; i < seleccion.length; i++) {
        newRCompo = new Ext.data.Record({
            idtablacalorica: seleccion[i].data.idtablacalorica,
            codigo: seleccion[i].data.codigo,
            denominacion: seleccion[i].data.denominacion,
            descripcion: seleccion[i].data.descripcion,
            idumedida: seleccion[i].data.idumedida,
            precio: seleccion[i].data.precio,
            cantidad: 0,
            porciento: 0,
            kcal: 0,
            grasas: 0,
            proteinas: 0,
            carbohidratos: 0,
            importe: 0,
            estado: 0
        });
        stComponentes.add(newRCompo);
    }

    pComponentes.expand(true);
    controlarBotonesComponentes();
    wAddComponentes.destroy();
}

function eliminarFormula(btn) {

    if (btn == 'ok') {
        selections = smFormulas.getSelections();
        idformulas = Array();
        for (var i = 0; i < selections.length; i++) {
            if (selections[i].data.estado == 0) {
                idformulas.push(selections[i].data.idformula);
            }
        }

        if (idformulas.length != 0) {
            Ext.Ajax.request({
                url: "eliminarFormulasNutricionales",
                params: {
                    idformula: Ext.encode(idformulas)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (selections.length == 1) {
                            mostrarMensaje(2, perfil.etiquetas.msgFormulaEliminadaSingularOk);
                        } else {
                            mostrarMensaje(2, perfil.etiquetas.msgFormulaEliminadaPluralOk);
                        }
                        rowIndex_fomrula = -1;
                        stFormulas.reload();
                        stComponentes.reload();
                    } else {
                        if (selections.length == 1) {
                            mostrarMensaje(2, perfil.etiquetas.msgFormulaEliminadaSingularNoOk);
                        } else {
                            mostrarMensaje(2, perfil.etiquetas.msgFormulaEliminadaPluralNoOk);
                        }
                    }
                }
            });
        } else {
            mostrarMensaje(2, perfil.etiquetas.msgFormulaEliminadaPluralNoOkPorActivas);
        }
    }

}

function guardarComponente(btn) {
    if (btn == 'ok') {
        var arraytablac = [];
        if (comp_modificados.length == 0) {
            if (accion == 'calc') {
                kcalActualizada = smFormulas.getSelected().data.kcalformula;
                accion = '';
            }
            if (smFormulas.getSelected().data.tipoporciento == 1) {
                for (var i = 0; i < stComponentes.data.items.length; i++) {
                    arraytablac.push({
                        idtablacalorica: stComponentes.data.items[i].data.idtablacalorica,
                        porciento: stComponentes.data.items[i].data.porciento,
                        kcalformula: kcalActualizada,
                        cantidad: stComponentes.data.items[i].data.cantidad
                    });
                }
            }
        } else {
            for (var i = 0; i < comp_modificados.length; i++) {
                arraytablac.push({
                    idtablacalorica: comp_modificados[i].data.idtablacalorica,
                    porciento: comp_modificados[i].data.porciento,
                    kcalformula: smFormulas.getSelected().data.kcalformula,
                    cantidad: comp_modificados[i].data.cantidad
                });
            }
        }

        var barraEstado = Ext.MessageBox.show({
            msg: perfil.etiquetas.msgCalculandoValores,
            title: perfil.etiquetas.msgEspere,
            width: 300,
            wait: true,
            modal: true
        });
        Ext.Ajax.request({
            url: "adicionarNormaAFormula",
            params: {
                idformula: smFormulas.getSelected().data.idformula,
                arraytablac: Ext.encode(arraytablac)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData) {
                    mostrarMensaje(2, perfil.etiquetas.msgCalculoRealizadoOk);
                    stFormulas.reload();
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgCalculoRealizadoNoOk);
                }
                //smFormulas.selectRecords(records_selecc_formulas, true);
                //smFormulas.selectRow(rowIndex_fomrula, true);
                arraytablac = [];
                comp_modificados = [];
                barraEstado.hide();
            }
        });
    }
}

function eliminarComponente(btn) {
    if (btn == 'ok') {
        var arraytablac = [];
        var recordsSel = [];
        var recordsSel = smComponentes.getSelections();
        for (var i = 0; i < recordsSel.length; i++) {
            arraytablac.push(recordsSel[i].data.idtablacalorica);
        }

        Ext.Ajax.request({
            url: "eliminarNormaAFormula",
            params: {
                idformula: smFormulas.getSelected().data.idformula,
                arrayidtablac: Ext.encode(arraytablac)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData) {
                    mostrarMensaje(2, perfil.etiquetas.msgIngredientesEliminadosPluralOk);
                    stComponentes.reload();
                    stFormulas.reload();
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgIngredientesEliminadosPluralNoOk);
                }
                arraytablac = [];
                recordsSel = [];
            }
        });
    }
}
function eliminarComponente(btn) {
    if (btn == 'ok') {
        var arraytablac = [];
        var recordsSel = [];
        var recordsSel = smComponentes.getSelections();
        for (var i = 0; i < recordsSel.length; i++) {
            arraytablac.push(recordsSel[i].data.idtablacalorica);
        }

        Ext.Ajax.request({
            url: "eliminarNormaAFormula",
            params: {
                idformula: smFormulas.getSelected().data.idformula,
                arrayidtablac: Ext.encode(arraytablac)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData) {
                    mostrarMensaje(2, perfil.etiquetas.msgIngredientesEliminadosPluralOk);
                    stComponentes.reload();
                    stFormulas.reload();
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgIngredientesEliminadosPluralNoOk);
                }
                arraytablac = [];
                recordsSel = [];
            }
        });
    }
}

function aprobarDesaprobarFormula() {
    var formulasestado = [];
    var selecciones = smFormulas.getSelections();
    if (accionAprobarFormula) {
        for (var i = 0; i < selecciones.length; i++) {
            if (selecciones[i].data.estado == 0 && selecciones[i].data.normada != 0) {
                //if (selecciones[i].data.tipoporciento == 1) {
                //busco que todos los ingredientes estén completos
                {
                    formulasestado.push({
                        idformula: selecciones[i].data.idformula,
                        tipoporciento: selecciones[i].data.tipoporciento,
                        estado: 1
                    });
                }
            }
        }
    } else {
        for (var i = 0; i < selecciones.length; i++) {
            if (selecciones[i].data.estado == 1) {
                formulasestado.push({
                    idformula: selecciones[i].data.idformula,
                    tipoporciento: selecciones[i].data.tipoporciento,
                    estado: 0
                });
            }
        }
    }

    Ext.Ajax.request({
        url: "cambiarestadoFormulasNutricionales",
        params: {
            arrayestadoformulas: Ext.encode(formulasestado)
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (accionAprobarFormula) {
                if (responseData) {
                    if (smFormulas.getSelections().length == 1) {
                        mostrarMensaje(2, perfil.etiquetas.msgFormulaAprobadaSingularOk);
                    } else {
                        mostrarMensaje(2, perfil.etiquetas.msgFormulaAprobadaPluralOk);
                    }
                    stFormulas.reload();
                } else {
                    if (smFormulas.getSelections().length == 1) {
                        mostrarMensaje(2, perfil.etiquetas.msgOperacionNoRealizada);
                    } else {
                        mostrarMensaje(2, perfil.etiquetas.msgOperacionNoRealizada);
                    }
                }
            } else {
                if (responseData) {
                    if (smFormulas.getSelections().length == 1) {
                        mostrarMensaje(2, perfil.etiquetas.msgFormulaDesaprobadaSingularOk);
                    } else {
                        mostrarMensaje(2, perfil.etiquetas.msgFormulaDesaprobadaPluralOk);
                    }
                    stFormulas.reload();
                } else {
                    if (smFormulas.getSelections().length == 1) {
                        mostrarMensaje(2, perfil.etiquetas.msgOperacionNoRealizada);
                    } else {
                        mostrarMensaje(2, perfil.etiquetas.msgOperacionNoRealizada);
                    }
                }
            }
            accionAprobarFormula = false;
        }
    });
}

function decimalesimporte(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return parseFloat(val).toFixed(6);
}

function decimalescantidad(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return parseFloat(val).toFixed(6);
}

function controlarBotonesComponentes() {
    //Desconfiguro por defecto
    Ext.getCmp('idbtnAddComponente').disable();
    Ext.getCmp('idbtnCalcular').disable();
    Ext.getCmp('idbtnDelComponentes').disable();
    //pComponentes.collapse(true);
    //Si solo selecciono una fórmula
    if (smFormulas.getSelections().length == 1) {
        //Si la fórmula está normada
        if (smFormulas.getSelected().data.normada != 0) {
            //Despliego el panel de los componentes
            pComponentes.expand(true);
            //Si está desaprobado
            if (smFormulas.getSelected().data.estado != 1) {
                camposEditables();
                //Permito adicionar
                Ext.getCmp('idbtnAddComponente').enable();
                //Si tengo componentes (aunque estén filtrados)...
                if (stComponentes.getCount() > 0 || filtrosComponentes.getFiltrosActivos().length > 0) {
                    //Permito calcular.
                    Ext.getCmp('idbtnCalcular').enable();
                }
            }
            //Si tengo algún componente seleccionado
            if (smComponentes.getSelections().length > 0) {
                //Permito eliminar
                Ext.getCmp('idbtnDelComponentes').enable();
            }
        } else {
            //La fórmula no está normada, pero...
            //Si tengo elementos recién añadidos
            if (stComponentes.getCount() > 0) {
                pComponentes.expand(true);
                camposEditables();
                //Permito adicionar
                Ext.getCmp('idbtnAddComponente').enable();
                //Permito calcular
                Ext.getCmp('idbtnCalcular').enable();
                //Si tengo algún componente seleccionado
                if (smComponentes.getSelections().length > 0) {
                    //Permito eliminar
                    Ext.getCmp('idbtnDelComponentes').enable();
                }
            } else {
                pComponentes.collapse(true);
            }
        }
    } else {
        pComponentes.collapse(true);
    }
}

function controlarBotonesFormula() {
    Ext.getCmp('idbtnModFormula').disable();
    Ext.getCmp('idbtnDelFormula').disable();
    Ext.getCmp('idbtnAprobarFormula').disable();
    Ext.getCmp('btndesaprobarFormula').disable();
    Ext.getCmp('btnAsociarFormula').disable();
    Ext.getCmp('btnDesasociarFormula').disable();

    if (smFormulas.getSelections().length == 1) {
        if (smFormulas.getSelected().data.normada != 0) {
            stComponentes.load();
            if (smFormulas.getSelected().data.estado == 1) {
                Ext.getCmp('btndesaprobarFormula').enable();
                Ext.getCmp('btnAsociarFormula').enable();
            } else {
                Ext.getCmp('idbtnModFormula').enable();
                Ext.getCmp('idbtnDelFormula').enable();
                Ext.getCmp('idbtnAprobarFormula').enable();
            }
        } else {
            Ext.getCmp('idbtnModFormula').enable();
            Ext.getCmp('idbtnDelFormula').enable();
            stComponentes.removeAll();
            controlarBotonesComponentes();
        }
    } else {
        Ext.getCmp('idbtnDelFormula').enable();
        Ext.getCmp('idbtnAprobarFormula').enable();
        Ext.getCmp('btndesaprobarFormula').enable();
        stComponentes.removeAll();
        controlarBotonesComponentes();
    }
}

function camposEditables() {
    if (smFormulas.getSelected().data.tipoporciento == 0) {
        cmComponentes.setEditable(cmComponentes.findColumnIndex('cantidad'), true);
        cmComponentes.setEditable(cmComponentes.findColumnIndex('porciento'), false);
    } else {
        cmComponentes.setEditable(cmComponentes.findColumnIndex('cantidad'), false);
        cmComponentes.setEditable(cmComponentes.findColumnIndex('porciento'), true);
    }
}

function wAsociarFormulaActv(accion) {
    cmActv = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'denominacionActv',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            sortable: true,
            renderer: crearToolTip
        }
    ]);
    smActv = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, num, rec) {

            },
            rowdeselect: function (sm, num, rec) {
            }
        }
    });
    btnLimpiarFormActv = new Ext.Toolbar.Button({
        id: 'idbtnLimpiarFormActv',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar + ' <b>(Alt+L)<b>',
        disabled: false,
        handler: function () {
            smActv.clearSelections();
            gridActv.getStore().reload();
        }
    });
    stActv = new Ext.data.Store({
        url: 'listarActividades',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [
            {
                name: 'idactividad'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'descripcion'
            }
        ]),
        listeners: {
            beforeload: function (st, options) {
                st.baseParams.idformula = smFormulas.getSelected().data.idformula;
                st.baseParams.start = offsetActividades;
                if (accion == 'asociar') {
                    st.baseParams.asociardesa = 1;
                } else {
                    st.baseParams.asociardesa = 0;
                }
            },
            load: function (st, rec, opt) {
                if (st.getCount() == 0) {
                    mostrarMensaje(2, perfil.etiquetas.lbNoExistenDatos);
                }
            }
        }
    });
    pgActv = new Ext.PagingToolbar({
        store: stActv,
        id: 'idpgFormActv',
        displayInfo: true,
        items: ['-', btnLimpiarFormActv],
        listeners: {
            beforechange: function (p, e) {
                offsetActividades = e.start;
            }
        }
    });
    gridActv = new Ext.grid.EditorGridPanel({
        autoExpandColumn: 'denominacionActv',
        store: stActv,
        cm: cmActv,
        sm: smActv,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: pgActv
    });
    btnCancelarActv = new Ext.Button({
        text: perfil.etiquetas.lbCancelar,
        disabled: false,
        id: 'idbtnCancelarFormActv',
        iconCls: 'cancelar',
        tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        handler: function () {
            fpActv.getForm().reset();
            wActv.destroy();
        }
    });
    btnAceptarActv = new Ext.Button({
        text: perfil.etiquetas.lbAceptar,
        disabled: true,
        id: 'idbtnAceptarFormActv',
        iconCls: 'aceptar',
        tooltip: perfil.etiquetas.msgGuardaryCerrar,
        handler: function () {
            if (accion == "asociar") {
                comprobarActividad(smActv);
            } else {
                desasociarFormulaActividad();
            }
        }
    });
    fpActv = new Ext.form.FormPanel({
        frame: true,
        labelAlign: 'top',
        autoValidate: false,
        layout: 'fit',
        items: [gridActv],
        listeners: {
            clientvalidation: function () {
                /*if(smFormActv.getSelections()[0] != undefined){
                 Ext.getCmp('idbtnAceptarFormActv').enable();
                 }
                 Ext.getCmp('idbtnAceptarFormActv').disable();
                 }*/
            }
        }
    });
    wActv = new Ext.Window({
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        items: fpActv,
        resizable: false,
        width: 750,
        height: 500,
        listeners: {
            beforeshow: function () {
                stActv.reload();
                accionFormActv = accion;
                if (accion == 'asociar') {
                    wActv.setTitle(perfil.etiquetas.lbAsociarFormulasActividades);
                } else {
                    wActv.setTitle(perfil.etiquetas.lbDesasociarFormulasActividades);
                }
            }
        },
        buttons: [btnCancelarActv, btnAceptarActv]
    });
    wActv.show();
}

function comprobarActividad(smActv) {
    var actividadesComprobar = [];
    var selecciones = smActv.getSelections();
    for (var i = 0; i < selecciones.length; i++) {
        actividadesComprobar.push(selecciones[i].data.idactividad);
    }

    Ext.Ajax.request({
        url: "comprobarActividad",
        params: {
            idactividades: Ext.encode(actividadesComprobar)
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.normada) {
                wActv.destroy();
                if (selecciones.length == 1) {
                    mostrarMensaje(2, perfil.etiquetas.msgConfirmarActividadNormadaSingular, asociarFormulaActividad);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgConfirmarActividadNormadaPlural, asociarFormulaActividad);
                }
                actividadesNoNormadas = responseData.actividadesNoNormadas;
                actividadesNormadas = responseData.actividadesNormadas;
            } else {
                wActv.destroy();
                actividadesNoNormadas = responseData.actividadesNoNormadas;
                actividadesNormadas = responseData.actividadesNormadas;
                asociarFormulaActividad('ok');
            }
        }
    });
}

function asociarFormulaActividad(btn) {
    if (btn == 'ok') {
        var barraEstado = Ext.MessageBox.show({
            msg: perfil.etiquetas.msgAsociandoFormula,
            title: perfil.etiquetas.msgEspere,
            width: 300,
            wait: true,
            modal: true
        });
        Ext.Ajax.request({
            url: "cambiarAsociacionFormulaActividad",
            params: {
                idformula: smFormulas.getSelected().data.idformula,
                normadas: Ext.encode(actividadesNormadas),
                nonormadas: Ext.encode(actividadesNoNormadas),
                accion: accionFormActv
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (smActv.getSelections().length == 1) {
                    mostrarMensaje(2, perfil.etiquetas.msgActividadAsociadaSingularOk);
                } else {
                    mostrarMensaje(2, perfil.etiquetas.msgActividadAsociadaPluralOk);
                }
                wActv.destroy();
                barraEstado.hide();
            }
        });
    }
}

function desasociarFormulaActividad() {
    var actividades = [];
    var selecciones = smActv.getSelections();
    for (var i = 0; i < selecciones.length; i++) {
        actividades.push(selecciones[i].data.idactividad);
    }

    var barraEstado = Ext.MessageBox.show({
        msg: perfil.etiquetas.lbDesasociandoFormula,
        title: perfil.etiquetas.msgEspere,
        width: 300,
        wait: true,
        modal: true
    });
    Ext.Ajax.request({
        url: "cambiarAsociacionFormulaActividad",
        params: {
            idformula: smFormulas.getSelected().data.idformula,
            actividadesdesa: Ext.encode(actividades),
            accion: accionFormActv
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (smActv.getSelections().length == 1) {
                mostrarMensaje(2, perfil.etiquetas.msgActividadDesasociadaSingularOk);
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgActividadDesasociadaPluralOk);
            }
            wActv.destroy();
            barraEstado.hide();
        }
    });
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + '<i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function eventoGrid(){

}
