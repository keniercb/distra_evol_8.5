var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
Ext.QuickTips.init();
var treesel, treeselepecialidad, mensaje, ifmod = false;
var es_especialidad = null;
var isAsoc, node, datTipo = false;
var seleccionTipo = 0, seleccionDato = 0;
var bandera = 0;
var btngestrectorniveles = 0;
var mostrarasociacion = 0;
var aplicar, idtiponomnuevo, idpadre, ptbGestNom, actual, hijos = 1;
var accionEliminado = false;
UCID.portal.cargarEtiquetas('gestgruposnomencladores', cargarInterfaz);
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

// function CargarInterfaz
function cargarInterfaz() {

    filtrosgruposnomencladores = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }
        ]
    });

    // Botones btnAdd btnMod btnDel btnAyuda
    /*btnAdd = new Ext.Button({
     handler: function () {
     accionAdicionar();
     },
     disabled: false,
     id: 'btnAdd',
     iconCls: 'adicionar',
     tooltip: perfil.etiquetas.lbTtbtnAdd
     });
     
     btnAddGrup = new Ext.Button({
     handler: function () {
     winAdd.setTitle(perfil.etiquetas.lbTtbtnAddNomHijo);
     winAdd.on('beforeshow', function () {
     Ext.getCmp('denominacion').focus(true, 700);
     });
     winAdd.show();
     Ext.getCmp('idnomenclador').setValue(smGpGestNom.getSelected().data.id);
     datTipo = true;
     },
     disabled: true,
     id: 'btnAddGrup',
     iconCls: 'adicionar',
     tooltip: perfil.etiquetas.lbTtbtnAddNomHijo
     });*/

    btnAdicionar = new Ext.Toolbar.MenuButton({
        id: 'btnAdicionar',
        tooltip: {
            text: "Adicionar"//perfil.etiquetas.lbExportar
        },
        iconCls: 'adicionar',
        menu: {
            items: [{
                    handler: function () {
                        accionAdicionar();
                    },
                    disabled: false,
                    id: 'btnAdd',
                    iconCls: 'adicionar',
                    text: perfil.etiquetas.lbTtbtnAdd + ' <b>(Alt+I)</b>'
                }, {
                    handler: function () {
                        winAdd.setTitle(perfil.etiquetas.lbTtbtnAddNomHijo);
                        winAdd.on('beforeshow', function () {
                            Ext.getCmp('denominacion').focus(true, 700);
                        });
                        winAdd.show();
                        Ext.getCmp('idnomenclador').setValue(smGpGestNom.getSelected().data.id);
                        datTipo = true;
                    },
                    disabled: true,
                    id: 'btnAddGrup',
                    iconCls: 'adicionar',
                    text: perfil.etiquetas.lbTtbtnAddNomHijo
                }]
        }
    });

    btnMod = new Ext.Button({
        handler: function () {
            accionModificar();
        },
        disabled: true,
        id: 'btnMod',
        iconCls: 'modificar',
        tooltip: perfil.etiquetas.lbTtbtnMod + ' <b>(Alt+M)</b>'
    });
    btnDel = new Ext.Button({
        handler: function () {
            accionEliminar();
        },
        disabled: true,
        id: 'btnEli',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbTtbtnDel
    });
    btnExportar = new Ext.Button({
        handler: function () {
            accionExportar();
        },
        disabled: true,
        id: 'btnExportar',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbBtnExportar
    });
    btnGestRecNiv = new Ext.Button({
        iconCls: 'asociar',
        tooltip: perfil.etiquetas.lbBtnGestRecNiv + ' (<b>Ctrl+Alt+R</b>)',
        // text: perfil.etiquetas.lbBtnGestRecNiv,
        id: 'btnGestRecNiv',
        handler: function () {
            accionGestionarRectordeniveles();
            if (btngestrectorniveles == 0) {
                btngestrectorniveles = 1;
            } else {
                btngestrectorniveles = 0;
            }
            stGpGestNom.load();
        }
    });
    btnGestAsoc = new Ext.Button({
        iconCls: 'asociar',
        tooltip: perfil.etiquetas.lbTtbtnGestAsoc,
        // text: perfil.etiquetas.lbBtnGestAsoc,
        id: 'gestAsoc',
        handler: function () {
            accionGestionarAsociacion();
            btngestrectorniveles = 0;
            stGpGestNom.load();
        }
    });
    /*
     *Boton que permite mostras el panel de especialidades para asociar
     * nomencladores
     *@autor: Damian Oscar Falcon Borras,
     */
    btnGestAsocUAM = new Ext.Button({
        iconCls: 'asociar',
        hidden: false,
        tooltip: perfil.etiquetas.lbTtGestAsocEspec,
        //  text: perfil.etiquetas.lbGestAsocEspec,
        id: 'btnGestAsocUAM',
        handler: function () {
            btngestrectorniveles = 0;
            accionGestionarAsociacionEntidad();
        }
    });

    btnAyuda = new Ext.Toolbar.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        id: 'btnAyudaGrupoNomencladores',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtbtnAyu
    });

    btnLimpiar = new Ext.Button({
        // text: perfil.etiquetas.lbLimpiar,
        id: 'btntodos',
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        iconCls: 'limpiar',
        handler: function () {
            accionLimpiar();
        }
    });
    // formulario fpGestNom
    fpGestNom = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpGestNom',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        listeners: {
            render: function (f) {
                // btcolorcat.show();
            },
            clientvalidation: function (form, valid) {
                if (form.getForm().isValid()) {
                    if (ifmod) {
                        if (Ext.getCmp('denominacion').getValue() != vardenominacion || Ext.getCmp('descripcion').getValue() != vardescripcion) {
                            Ext.getCmp('btnaceptar').enable();
                            Ext.getCmp('btnaplicar').enable();
                        } else {
                            Ext.getCmp('btnaceptar').disable();
                            Ext.getCmp('btnaplicar').disable();
                        }
                    } else {
                        if (Ext.getCmp('denominacion').getValue() != "" && Ext.getCmp('descripcion').getValue() != "") {
                            Ext.getCmp('btnaceptar').enable();
                            Ext.getCmp('btnaplicar').enable();
                        } else {
                            Ext.getCmp('btnaceptar').disable();
                            Ext.getCmp('btnaplicar').disable();
                        }
                    }
                }

                if (!Ext.getCmp('btnaceptar').disabled) {
                    Ext.getCmp('denominacion').prevTab = 'btnaceptar';
                } else {
                    Ext.getCmp('denominacion').prevTab = 'btncancelar';
                }
            }
        },
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbdenominacion,
                                id: 'denominacion',
                                anchor: '95%',
                                allowBlank: false,
                                prevTab: 'btncancelar',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\.\_\-\d']* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\.\_\-\d']*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\.\_\-\d'])+$/,
                                maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ\.\_\-\d'])$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfa,
                                maxLength: 100,
                                maxLengthText: 'El tamaño máximo requerido es 100 caracteres.'
                                        // maxLengthText: perfil.etiquetas.lbBtnMax
                            }, {
                                xtype: 'hidden',
                                id: 'idnomenclador'
                            }, {
                                xtype: 'hidden',
                                id: 'parent'
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                fieldLabel: perfil.etiquetas.lbdescripcion,
                                regex: /^[a-zA-ZáíóúéñÁÉÍÓÚÑ-]*[a-zA-ZáíóúéñÁÉÍÓÚÑ_\s*\d*]*[a-zA-Záíóúé_ñÁÉÍÓÚÑ\d-]+$/,
                                maskRe: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
                                id: 'descripcion', maxLength: 255, maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
                                anchor: '100%'
                            }]
                    }]
            }]
    });
    // Store grid stGpGestNom
    stGpGestNom = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarTipoNom',
        listeners: {
            load: function () {
                // upColorCell();
                siexisteGestNomencladores();
            },
            beforeload: function () {
                var tipodato = 0;
                var idpadre = null;
                var idtiponom = null;
                var idgrupo = treesel;
                if (smGpGestNom.getSelected()) {
                    idpadre = smGpGestNom.getSelected().data.idreal;
                    tipodato = smGpGestNom.getSelected().data.tipo;
                    idtiponom = smGpGestNom.getSelected().data.idtiponomenclador;
                    hijos = 0;
                } else {
                    hijos = 1;
                }
                stGpGestNom.baseParams.es_especialidad = es_especialidad;
                stGpGestNom.baseParams.tipo = tipodato;
                stGpGestNom.baseParams.idreal = idpadre;
                stGpGestNom.baseParams.hijos = hijos;
                stGpGestNom.baseParams.idtiponom = idtiponom;
                // a;adir mostrar asociacion y bandera
                if (Ext.getCmp('ckasociado').getValue() == true) {
                    stGpGestNom.baseParams.listarAsoc = '';
                    stGpGestNom.baseParams.mostrarasociacion = 2;
                } else {
                    stGpGestNom.baseParams.mostrarasociacion = 3;
                    stGpGestNom.baseParams.listarAsoc = 'NOT';
                }
                stGpGestNom.baseParams.btngestionarrectorniv = btngestrectorniveles;
                stGpGestNom.baseParams.idespecialidad = treeselepecialidad;
                setTituloFiltrarNomencladores();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: 'total',
            id: 'id'
        }, [{
                name: 'id'
            }, {
                name: 'idreal'
            }, {
                name: 'tipo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, /*{
             name: 'color'
             },*/ {
                name: '_is_leaf'
            }, {
                name: '_parent'
            }, {
                name: 'idtiponomenclador'
            }, {
                name: 'iddatosnomenclador'
            }]
                )
    });
    // Selection Model grid smGpGestNom
    smGpGestNom = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (n, i, r) {
                idtiponomnuevo = r.data.idtiponomenclador;
                seleccionTipo = r.data.idtiponomenclador;
                seleccionDato = r.data.iddatosnomenclador;
                if (smGpGestNom.getSelected()) {
                    hijos = 0;
                    btnDel.enable();
                    Ext.getCmp('btnAddGrup').enable();

                } else {
                    hijos = 1;
                    btnDel.disable();
                    Ext.getCmp('btnAddGrup').disable();
                }
                vardenominacion = smGpGestNom.getSelected().data.denominacion;
                vardescripcion = smGpGestNom.getSelected().data.descripcion;
            }, rowdeselect: function (s, n, r) {
                if (smGpGestNom.getSelected()) {
                    Ext.getCmp('btnAddGrup').enable();
                    btnMod.enable();
                    btnDel.enable();
                    btnExportar.enable();
                } else {
                    Ext.getCmp('btnAddGrup').disable();
                    btnMod.disable();
                    btnDel.disable();
                    btnExportar.disable();
                }
            }
        }
    });
    ptbGestNom = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 20,
        store: stGpGestNom,
        displayInfo: true,
        id: 'pgTreeGrid',
        items: [btnLimpiar]
    });

    // Grid gestion gpGestNom
    gpGestNom = new Ext.ux.maximgb.treegrid.GridPanel({
        title: perfil.etiquetas.lbGrupNomencladores,
        region: 'center',
        plugins: filtrosgruposnomencladores,
        frame: true,
        master_column_id: 'expandir',
        stripeRows: true,
        root_title: perfil.etiquetas.lbGpRootTitle,
        autoExpandColumn: 'expandir',
        store: stGpGestNom,
        margins: '1 1 1 -4',
        sm: smGpGestNom,
        columns: [
            {
                id: 'expandir',
                header: perfil.etiquetas.lbdenominacion,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: perfil.etiquetas.lbdescripcion,
                sortable: true,
                width: 450,
                dataIndex: 'descripcion'
            }/*,
             {
             header: perfil.etiquetas.lbcolor,
             width: 90,
             dataIndex: ''
             }*/
        ],
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [],
        bbar: ptbGestNom,
        altKey: true,
        listeners: {
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                gpGestNom.getSelectionModel().selectRow(r);
                gpGestNom.md.showAt(e.getXY());
            },
            celldblclick: function () {
                if (!btnMod.hidden && !btnMod.disabled && !accionEliminado) {
                    accionModificar();
                }
            },
            load: function () {
                Ext.getCmp('btnAddGrup').disable();
            }
        }
    });

    //TreePanel
    trGestNom = new Ext.tree.TreePanel({
        autoScroll: true,
        margins: '1 1 1 1',
        region: 'west',
        title: perfil.etiquetas.lbComponentes,
        width: 205,
        hidden: true,
        collapsible: true,
        listeners: {
            click: function (n, e) {
                treesel = n.id;
                listarTipoNomAsoc();
            }
        },
        split: true,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Componentes',
            tipo: 0,
            expanded: true,
            id: '0'
        }),
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'listarGruposNom'
        })
    });

    /*
     *Tree panel que muestra las especialidades
     *@autor: Damian Oscar Falcon Borras,
     **/
    trGestEspecialidad = new Ext.tree.TreePanel({
        autoScroll: true,
        margins: '1 1 1 1',
        region: 'east',
        title: 'Especialidades',
        width: 220,
        hidden: true,
        collapsible: true,
        listeners: {
            click: function (n, e) {
                treeselepecialidad = n.id;
                listarTipoNomAsoc();
            }
        },
        tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las especialidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function () {
                    trGestEspecialidad.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las especialidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function () {
                    trGestEspecialidad.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las especialidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function () {
                    actualizararbol(trGestEspecialidad);
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar especialidad...',
                width: 110,
                id: 'idfiltroespecilaidad',
                listeners: {
                    specialkey: function (t, e) {
                        if (e.getKey() == '13') {
                            actualizararbol(trGestEspecialidad);
                        }
                    }
                }
            }],
        split: true,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Especialidad',
            tipo: 0,
            expanded: true,
            id: '0'
        }),
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'listarEspecialidades',
            listeners: {
                beforeload: function (tl, n) {
                    this.baseParams = {
                        valor: Ext.getCmp('idfiltroespecilaidad').getValue()
                    };
                }
            }
        })
    });
    // viewport de la plantilla
    vpGestNom = new Ext.Viewport({
        layout: 'fit',
        items: [{
                layout: 'border',
                items: [trGestNom, gpGestNom, trGestEspecialidad],
                tbar: [btnAdicionar, btnMod, btnDel, '-', btnExportar,
                    {
                        xtype: 'checkbox',
                        hidden: true,
                        id: 'ckasociado',
                        listeners: {
                            check: function (chb, checked) {
                                if (checked) {
                                    mostrarasociacion = 2;
                                    if (btngestrectorniveles == 1 /*&& idespecialidad != null*/) {
                                        Ext.getCmp('btndefinirrector').hide();
                                        Ext.getCmp('btneliminarasocrector').show();
                                        Ext.getCmp('btnasociar').hide();
                                        Ext.getCmp('btnquitarasociar').hide();
                                    } else {
                                        Ext.getCmp('btnasociar').hide();
                                        Ext.getCmp('btnquitarasociar').show();
                                    }
                                } else {
                                    mostrarasociacion = 3;
                                    if (btngestrectorniveles == 1) {
                                        Ext.getCmp('btndefinirrector').show();
                                        Ext.getCmp('btneliminarasocrector').hide();
                                        Ext.getCmp('btnasociar').hide();
                                        Ext.getCmp('btnquitarasociar').hide();
                                    } else {
                                        Ext.getCmp('btnasociar').show();
                                        Ext.getCmp('btnquitarasociar').hide();
                                    }
                                }
                                smGpGestNom.clearSelections();
                                listarTipoNomAsoc();
                            }
                        }
                    }, {
                        xtype: 'tbbutton',
                        hidden: true,
                        id: 'btnasociado',
                        text: perfil.etiquetas.lbMostrarAsociacion,
                        handler: function () {
                            if (Ext.getCmp('ckasociado').getValue() == true)
                                Ext.getCmp('ckasociado').setValue(false);
                            else
                                Ext.getCmp('ckasociado').setValue(true);
                        }
                    }/*, btnGestAsoc, btnGestAsocUAM, btnGestRecNiv*/, '->', btnAyuda]
            }]
    });

    //btnAdd.focus();
    stGpGestNom.load();
    // Evento Selection Model grid rowselect
    gpGestNom.getSelectionModel().on('rowselect', function (smodel, rowIndex, record) {
        btnMod.enable();
        btnDel.enable();
        btnExportar.enable();
    }, this);
    // Ventanas para formulario winFp(opcion)
    winAdd = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        width: 400,
        height: 220,
        items: fpGestNom,
        autoValidate: false,
        constrain: true,
        listeners: {
            'beforeshow': function () {
                Ext.getCmp('denominacion').focus(true, 500);
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                id: 'btncancelar',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function () {
                    fpGestNom.getForm().reset();
                    winAdd.hide();
                    seleccionTipo = 0;
                    seleccionDato = 0;
                    ifmod = false;
                }
            }, {
                iconCls: 'aplicar',
                id: 'btnaplicar',
                disabled: true,
                text: perfil.etiquetas.lbAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function () {
                    aplicar = 1;
                    AdicionarNomenclador();


                }
            }, {
                iconCls: 'aceptar',
                disabled: true,
                id: 'btnaceptar',
                nextTab: 'denominacion',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function () {
                    aplicar = 0;
                    (!ifmod) ? AdicionarNomenclador() : ModificarNomenclador();

                }
            }]
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'iI',
            alt: true,
            fn: function () {
                if (!Ext.getCmp('btnAdd').hidden && !Ext.getCmp('btnAdd').disabled && !accionEliminado)
                    accionAdicionar();
            }
        }, {
            key: 46,
            fn: function () {
                if (!btnDel.hidden && !btnDel.disabled && ventanasNoActivas() == true) {
                    accionEliminado = true;
                    accionEliminar();
                }
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function () {
                if (!btnMod.hidden && !btnMod.disabled && !accionEliminado) {
                    accionModificar();
                }
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function () {
                accionLimpiar();
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function () {
                // mostrarAyuda('Grupo de nomencladores');
            }
        }, {
            key: 'gG',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnGestAsoc.hidden && !btnGestAsoc.disabled)
                    accionGestionarAsociacion();
            }
        }, {
            key: 'eE',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnGestAsocUAM.hidden && !btnGestAsocUAM.disabled)
                    accionGestionarAsociacionEntidad();
            }
        }, {
            key: 'Rr',
            alt: true,
            fn: function () {
                if (btnGestRecNiv.enable()) {
                    accionGestionarRectordeniveles();
                    if (btngestrectorniveles == 0) {
                        btngestrectorniveles = 1;
                    } else {
                        btngestrectorniveles = 0;
                    }
                    stGpGestNom.load();
                }
            }
        }
    ]);
}// Endof cargarInterfaz
/**
 Permite insertar tipos de nomencladores y los datos de estos
 * @author Ariadna Rendón Artola
 **/
function AdicionarNomenclador() {
    if (datTipo == false) {
        seleccionTipo = 0;
    }
    //Ext.getCmp('idnomenclador').setValue(smGpGestNom.getSelected().data.id);
    if (fpGestNom.getForm().isValid()) {
        //  if (Ext.getCmp('color').getValue()) {
        Ext.getCmp('denominacion').focus();
        fpGestNom.getForm().submit({
            url: 'adicionarNom',
            waitMsg: perfil.etiquetas.msgEspere,
            params: {
                // color: Ext.getCmp('color').getValue(),
                hijos: hijos,
                idtiponomenclador: seleccionTipo,
                iddatonomenclador: seleccionDato
            },
            failure: function (form, action) {
                if (action.result.codMsgA == 1) {
                    if (aplicar == 1) {
                        //  Ext.getCmp('color').reset();
                        Ext.getCmp('denominacion').reset();
                        Ext.getCmp('descripcion').reset();
                    } else {
                        smGpGestNom.clearSelections();
                        winAdd.hide();
                        seleccionTipo = 0;
                        seleccionDato = 0;
                        datTipo = false;
                    }
                    mensaje = perfil.etiquetas.msgAdicionado;
                    fpGestNom.getForm().reset();
                    mostrarMensaje(action.result.codMsgA, mensaje);
                    var idtiponomenclador = (gpGestNom.getSelectionModel().getSelected()) ? gpGestNom.getSelectionModel().getSelected().json.idtiponomenclador : 0;
                    AccionesPostGestion('adicionar', action.result.codMsgA, idtiponomenclador);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.msgDenominacion);
                }
                Ext.getCmp('btnaplicar').disable();
                Ext.getCmp('btnaceptar').disable();
                btnMod.disable();
                btnDel.disable();

            }
        });
        /* } else
         mostrarMensaje(1, perfil.etiquetas.msgColor);*/
    } else {
        if (/*!Ext.getCmp('color').getValue() ||*/ !Ext.getCmp('denominacion').getValue() || !Ext.getCmp('descripcion').getValue())
            mostrarMensaje(1, perfil.etiquetas.msgColor);
        else
            mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }
}
/**
 Permite modificar tipos de nomencladores y los datos de estos    dependiendo
 del valor de la variable "parent", definida como items del formulario fpGestNom.
 * @author Ariadna Rendón Artola
 **/
function ModificarNomenclador() {
    //var color = gpGestNom.getSelectionModel().getSelected().json.color;
    //var denom = gpGestNom.getSelectionModel().getSelected().json.denominacion;
    //var descrip = gpGestNom.getSelectionModel().getSelected().json.descripcion;
    if (fpGestNom.getForm().isValid()) {
        // if (/*Ext.getCmp('color').getValue() != color ||*/ Ext.getCmp('denominacion').getValue() != denom || Ext.getCmp('descripcion').getValue() != descrip) {
        fpGestNom.getForm().submit({
            url: 'modificarNom',
            waitMsg: perfil.etiquetas.msModificando,
            params: {
                //color: Ext.getCmp('color').getValue()
                descripcion: Ext.getCmp('descripcion').getValue(),
                denominacion: Ext.getCmp('denominacion').getValue()
            },
            failure: function (form, action) {
                if (action.result.codMsgM == 1) {
                    mensaje = perfil.etiquetas.msgModificado;
                    fpGestNom.getForm().reset();
                    winAdd.hide();
                    btnMod.disable();
                    btnDel.disable();
                    btnExportar.disable();
                    ifmod = false;
                    mostrarMensaje(action.result.codMsgM, mensaje)
                    var idtiponomenclador = (gpGestNom.getSelectionModel().getSelected()) ? gpGestNom.getSelectionModel().getSelected().json.idtiponomenclador : 0;
                    AccionesPostGestion(accion = 'modificar', action.result.codMsg, idtiponomenclador);
                } else {
                    if (action.result.codMsgM == 3) {
                        mostrarMensaje(1, perfil.etiquetas.msgTipoNomEnUso);
                        fpGestNom.getForm().reset();
                        winAdd.hide();
                    } else {
                        mensaje = perfil.etiquetas.msgDenominacion;
                        mostrarMensaje(1, mensaje);
                    }
                }
            }
        });
        /* } else {
         mostrarMensaje(1, 'Debe realizar al menos una modificación.');
         }*/
    } else {
        if (/*!Ext.getCmp('color').getValue() ||*/ !Ext.getCmp('denominacion').getValue() || !Ext.getCmp('descripcion').getValue())
            mostrarMensaje(1, perfil.etiquetas.msgColor);
        else
            mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }
}
/**
 Permite eliminar tipos de nomencladores y los datos de estos dependiendo
 del valor de la variable "parent", definida como items del formulario "fpGestNom".
 * @author Ariadna Rendón Artola
 **/
function eliminarNomenclador() {
    rowselected = smGpGestNom.getSelected().data;
    mostrarMensaje(2, perfil.etiquetas.msgSegEliminar, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            var bandera = Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: perfil.etiquetas.msgEliminando,
                width: 250,
                wait: true,
                progress: true,
                closable: false
            });

            Ext.Ajax.request({
                url: 'eliminarNom',
                params: {
                    idnom: rowselected.id,
                    parent: rowselected._parent,
                    iddatos: rowselected.iddatosnomenclador
                },
                callback: function (options, success, response) {
                    accionEliminado = false;
                    var responseData = Ext.decode(response.responseText);
                    switch (responseData.codE) {
                        case 1:
                            mensaje = perfil.etiquetas.msgEliminado;
                            break;
                        case 23503:
                            mensaje = perfil.etiquetas.msgElimAsociado;
                            responseData.codE = 1;
                            break;
                        case 2:
                            mensaje = perfil.etiquetas.msgDatosNomEnUso;
                            responseData.codE = 1;
                            break;
                        default:
                            mensaje = perfil.etiquetas.msgErrorAction;
                            break;
                    }
                    bandera.hide();
                    mostrarMensaje(responseData.codE, mensaje);
                    smGpGestNom.clearSelections();
                    btnMod.disable();
                    btnDel.disable();
                    btnExportar.disable();
                    var gp = gpGestNom.getSelectionModel();
                    AccionesPostGestion('eliminar', gp, rowselected);
                }
            });
        } else {
            accionEliminado = false;
        }
    }
}
/**
 Permite definir los colores de los tipos de nomencladores y los datos de estos
 del el treegrid "gpGestNom".
 * @author Ariadna Rendón Artola
 **/
/*function upColorCell() {
 for (var i = 0; i < stGpGestNom.getCount(); i++) {
 Ext.get(gpGestNom.getView().getCell(i, 2)).applyStyles('background-color:' + stGpGestNom.getAt(i).data.color);
 }
 }*/
/**
 Permite definir busqueda de los tipos de nomencladores y los datos de estos
 del el treegrid "gpGestNom" dependiendo de los criterios "color y denominacion".
 * @author Ariadna Rendón Artola
 **/
function activarbusqueda() {
    smGpGestNom.clearSelections();
    stGpGestNom.load({
        params: {
            //color: Ext.getCmp('tfcolor').getValue(),
            idgrupo: treesel,
            listarAsoc: (!Ext.getCmp('ckasociado').getValue()) ? 'NOT' : ''
        }
    });
}
/**
 Permite listar los tipos de nomencladores asociados a grupos de nomencladores
 dependiendo del id de grupo selecciondo.
 * @author Ariadna Rendón Artola
 **/
function listarTipoNomAsoc() {
    smGpGestNom.clearSelections();
    stGpGestNom.load({
        params: {
            idespecialidad: treeselepecialidad,
            idgrupo: treesel,
            listarAsoc: (!Ext.getCmp('ckasociado').getValue()) ? 'NOT' : ''

        }
    });
}


/**
 Permite asociar o desasociar tipos de nomencladores y grupos de nomencladores
 dependiendo del id de grupo e id de tipo de nomencladors selecciondos y de la bandera "isAsoc".
 * @author Ariadna Rendón Artola
 **/
function asociarTipoNom(isAsoc) {
    Ext.getBody().mask(perfil.etiquetas.lbCargando);
    Ext.Ajax.request({
        url: 'gestAsocTipoNom',
        params: {
            asociar: isAsoc,
            idgrupo: treesel,
            idnomenclador: smGpGestNom.getSelected().data.idtiponomenclador,
            idespecialidad: treeselepecialidad,
            es_especialidad: es_especialidad
        },
        callback: function (options, success, response) {
            Ext.getBody().unmask();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                if (isAsoc)
                    mensaje = perfil.etiquetas.msgAsociado;
                else
                    mensaje = perfil.etiquetas.msgDAsociado;
            } else if (responseData.codMsgE == 2)
                mensaje = perfil.etiquetas.msgEAsociado;
            else if (responseData.codMsgE == 22)
                mensaje = perfil.etiquetas.msgComponentAction;
            else
                mensaje = perfil.etiquetas.msgErrorAction;
            mostrarMensaje(responseData.codMsg, mensaje, listarTipoNomAsoc());
            smGpGestNom.clearSelections();

        }
    });
}

//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyuda;
//    var referencia = 'gruponomencladores';
//    help.show(title, referencia);
//}

function accionAdicionar() {
    winAdd.setTitle(perfil.etiquetas.lbTtbtnAdd);
    Ext.getCmp('btnaplicar').show();
    fpGestNom.getForm().reset();
    winAdd.on('beforeshow', function () {
        Ext.getCmp('denominacion').focus(true, 700);
    });
    winAdd.show('btnAdd');
    // Ext.get('color').applyStyles('border:1px solid #C0C0C0');
    datTipo = false;
}

function accionModificar() {
    winAdd.on('beforeshow', function () {
        Ext.getCmp('denominacion').focus(true, 700);
    });
    if (gpGestNom.getSelectionModel().getSelected() != undefined) {
        winAdd.setTitle(perfil.etiquetas.lbSetTwinModificar);
        if (gpGestNom.getSelectionModel().getSelected().data.idtiponomenclador != gpGestNom.getSelectionModel().getSelected().data.idreal) {
            winAdd.setTitle(perfil.etiquetas.lbSetTwinModificarDato);
        }
        Ext.getCmp('btnaplicar').hide();
        winAdd.show('btnMod');
        ifmod = true;
        // valcolor = gpGestNom.getSelectionModel().getSelected().data.color;
        // Ext.getCmp('color').setValue(valcolor);
        // Ext.get('color').applyStyles('border:2px solid #' + valcolor);
        Ext.getCmp('parent').setValue(smGpGestNom.getSelected().data._parent);
        Ext.getCmp('idnomenclador').setValue(gpGestNom.getSelectionModel().getSelected().data.idreal);
        Ext.getCmp('denominacion').setValue(gpGestNom.getSelectionModel().getSelected().data.denominacion);
        Ext.getCmp('descripcion').setValue(gpGestNom.getSelectionModel().getSelected().data.descripcion);
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgDebeSeleccionar);
    }
}

function accionEliminar() {
    if (gpGestNom.getSelectionModel().getSelected() != undefined) {
        eliminarNomenclador();
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgDebeSeleccionar);
    }
}

function accionGestionarAsociacion() {

    if (trGestNom.isVisible()) {
        es_especialidad = null;
        trGestNom.hide();
        trGestNom.getSelectionModel().clearSelections();
        Ext.getCmp('btnaddih').show();
        Ext.getCmp('ckasociado').setValue(false);
        Ext.getCmp('btnasociar').hide();
        Ext.getCmp('btnquitarasociar').hide();
        trGestNom.getSelectionModel().clearSelections();
        smGpGestNom.clearSelections();
        Ext.getCmp('ckasociado').reset();
        Ext.getCmp('ckasociado').disable();
        Ext.getCmp('ckasociado').hide();
        Ext.getCmp('btnasociado').hide();
        Ext.getCmp('btndefinirrector').hide();
        Ext.getCmp('btneliminarasocrector').hide();
        stGpGestNom.reload();
        Ext.getCmp('btnAdd').show();
        btnMod.show();
        btnDel.show();
        btnExportar.show();
        Ext.getCmp('btnGestAsocUAM').enable();
        Ext.getCmp('btnGestRecNiv').enable();
    } else {
        trGestEspecialidad.hide();
        es_especialidad = 0;
        trGestNom.show();
        Ext.getCmp('btnaddih').hide();
        Ext.getCmp('ckasociado').setValue(true);
        Ext.getCmp('ckasociado').enable();
        Ext.getCmp('ckasociado').show();
        Ext.getCmp('btnasociado').show();

        Ext.getCmp('btnAdd').hide();
        btnMod.hide();
        btnDel.hide();
        btnExportar.hide();
        Ext.getCmp('btnGestAsocUAM').disable();
        Ext.getCmp('btnGestRecNiv').disable();
    }
    vpGestNom.doLayout();
}
function accionGestionarAsociacionEntidad() {
    if (trGestEspecialidad.isVisible()) {
        es_especialidad = null;
        trGestEspecialidad.hide();
        trGestEspecialidad.getSelectionModel().clearSelections();
        Ext.getCmp('btnaddih').show();
        Ext.getCmp('ckasociado').setValue(false);
        Ext.getCmp('btnasociar').hide();
        Ext.getCmp('btnquitarasociar').hide();
        trGestEspecialidad.getSelectionModel().clearSelections();
        smGpGestNom.clearSelections();
        Ext.getCmp('ckasociado').reset();
        Ext.getCmp('ckasociado').disable();
        Ext.getCmp('ckasociado').hide();
        Ext.getCmp('btnasociado').hide();
        Ext.getCmp('btndefinirrector').hide();
        Ext.getCmp('btneliminarasocrector').hide();
        Ext.getCmp('gestAsoc').enable();
        Ext.getCmp('btnGestRecNiv').enable();
        stGpGestNom.reload();
        Ext.getCmp('btnAdd').show();
        btnMod.show();
        btnDel.show();
        btnExportar.show();
    } else {
        trGestNom.hide();
        es_especialidad = 1;
        trGestEspecialidad.show();
        Ext.getCmp('btnaddih').hide();
        Ext.getCmp('ckasociado').setValue(true);
        Ext.getCmp('ckasociado').enable();
        Ext.getCmp('ckasociado').show();
        Ext.getCmp('btnasociado').show();
        Ext.getCmp('gestAsoc').disable();
        Ext.getCmp('btnGestRecNiv').disable();
        Ext.getCmp('btnAdd').hide();
        btnMod.hide();
        btnDel.hide();
        btnExportar.hide();
    }

    vpGestNom.doLayout();
    stGpGestNom.load();
}

function accionExportar() {
    if (gpGestNom.getSelectionModel().getSelected() != undefined) {
        var win = window.open('exportar?idreal=' + gpGestNom.getSelectionModel().getSelected().data.idreal
                + '&dennomenclador=' + gpGestNom.getSelectionModel().getSelected().data.denominacion);
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgDebeSeleccionar);
    }
}

function listarNomCNAsocEsp() {
    smGpGestNom.clearSelections();
    stGpGestNom.load({
        params: {
            idespecialidad: treeselepecialidad,
            idgrupo: treesel,
            listarAsoc: (!Ext.getCmp('ckasociado').getValue()) ? 'NOT' : ''
        }
    });
}

//funcion que regula asociacion y desasociacion de un nomenclador asociado al componente calculo de niveles a una especialidad
function asociarNomCNAEsp(isAsoc) {
    Ext.getBody().mask(perfil.etiquetas.lbCargando);
    var tipodato = 0;
    if (smGpGestNom.getSelected()) {
        tipodato = smGpGestNom.getSelected().data.tipo;
    }
    Ext.Ajax.request({
        url: 'asociarTipoNomCNEsp',
        params: {
            asociar: isAsoc,
            idgrupo: treesel,
            idnomenclador: (smGpGestNom.getSelected().data.tipo == 1) ? smGpGestNom.getSelected().data.idreal : smGpGestNom.getSelected().data.idtiponomenclador,
            idespecialidad: treeselepecialidad,
            es_especialidad: es_especialidad


        }, callback: function (options, success, response) {
            Ext.getBody().unmask();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgE == 1) {
                if (isAsoc)
                    mensaje = perfil.etiquetas.msgAsociado;
                else
                    mensaje = perfil.etiquetas.msgDAsociado;
            } else if (responseData.codMsgE == 2)
                mensaje = perfil.etiquetas.msgEAsociado;
            else if (responseData.codMsgE == 22)
                mensaje = perfil.etiquetas.msgErrorActionCN;
            else
                mensaje = perfil.etiquetas.msgErrorAction;
            mostrarMensaje(1, mensaje, listarNomCNAsocEsp());
            smGpGestNom.clearSelections();

        }
    });
}

function accionGestionarRectordeniveles() {
    if (trGestEspecialidad.isVisible()) {
        es_especialidad = null;
        trGestEspecialidad.hide();
        trGestEspecialidad.getSelectionModel().clearSelections();
        Ext.getCmp('btnaddih').show();
        Ext.getCmp('ckasociado').setValue(false);
        Ext.getCmp('btnasociar').hide();
        Ext.getCmp('btnquitarasociar').hide();
        trGestEspecialidad.getSelectionModel().clearSelections();
        smGpGestNom.clearSelections();
        Ext.getCmp('ckasociado').reset();
        Ext.getCmp('ckasociado').disable();
        Ext.getCmp('ckasociado').hide();
        Ext.getCmp('btnasociado').hide();
        Ext.getCmp('btnquitarasociar').hide();
        Ext.getCmp('btndefinirrector').hide();
        Ext.getCmp('gestAsoc').enable();
        Ext.getCmp('btnGestAsocUAM').enable();
        stGpGestNom.reload();
        Ext.getCmp('btnAdd').show();
        btnMod.show();
        btnDel.show();
        btnExportar.show();

    } else {
        trGestNom.hide();
        es_especialidad = 1;

        trGestEspecialidad.show();
        Ext.getCmp('btnaddih').hide();
        Ext.getCmp('ckasociado').setValue(true);
        Ext.getCmp('ckasociado').enable();
        Ext.getCmp('ckasociado').show();
        Ext.getCmp('btnasociado').show();
        Ext.getCmp('btnasociar').hide();
        Ext.getCmp('btnquitarasociar').hide();
        Ext.getCmp('btneliminarasocrector').show();
        Ext.getCmp('gestAsoc').disable();
        Ext.getCmp('btnGestAsocUAM').disable();
        Ext.getCmp('btnAdd').hide();
        btnMod.hide();
        btnDel.hide();
        btnExportar.hide();
    }

    vpGestNom.doLayout();
    stGpGestNom.load();
}

function accionLimpiar() {

    smGpGestNom.clearSelections();
    filtrosgruposnomencladores.clearFilters();
    stGpGestNom.load();

}
function setTituloFiltrarNomencladores() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosgruposnomencladores.getFiltrosActivos() == undefined || filtrosgruposnomencladores.getFiltrosActivos().length == 0) {
        gpGestNom.setTitle(perfil.etiquetas.lbGrupNomencladores);
    } else {
        for (i = 0; i < filtrosgruposnomencladores.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosgruposnomencladores.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbdenominacion;
            } else if (filtrosgruposnomencladores.getFiltrosActivos()[i].dataIndex == "descripcion") {//
                aux = perfil.etiquetas.lbdescripcion;
            }
            if (i == filtrosgruposnomencladores.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpGestNom.setTitle(perfil.etiquetas.lbFiltradoPorTip + filtrado_por);
        filtrado_por = "";
    }
}
;

function siexisteGestNomencladores() {
    if (filtrosgruposnomencladores.getFiltrosActivos().length > 0 && stGpGestNom.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);

}

function reutilizarDato() {
    crearVentanaReutilizar();
}

function crearVentanaReutilizar() {


    stGpGestNomReutilizar = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarTipoNom',
        baseParams: {
            start: 0,
            limit: 20
        },
        listeners: {
            load: function () {
                smGpGestNomReutilizar.clearSelections();
                // upColorCellReutilizar();
                siexisteGestNomencladores();
            },
            beforeload: function () {
                var tipodato = 0;
                var idpadre = null;
                if (smGpGestNomReutilizar.getSelected()) {
                    idpadre = smGpGestNomReutilizar.getSelected().data.idreal;
                    tipodato = smGpGestNomReutilizar.getSelected().data.tipo;
                }
                stGpGestNomReutilizar.baseParams.es_especialidad = es_especialidad;
                stGpGestNomReutilizar.baseParams.tipo = tipodato;
                stGpGestNomReutilizar.baseParams.idreal = idpadre;
                stGpGestNomReutilizar.baseParams.idtipoalistar = gpGestNom.getSelectionModel().getSelected().data.idtiponomenclador;
                setTituloFiltrarNomencladores();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: 'total',
            id: 'id'
        }, [{
                name: 'id'
            }, {
                name: 'idreal'
            }, {
                name: 'tipo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, /*{
             name: 'color'
             },*/ {
                name: '_is_leaf'
            }, {
                name: '_parent'
            }, {
                name: 'idtiponomenclador'
            }, {
                name: 'hijos'
            }]
                )
    });
    // Selection Model grid smGpGestNom
    smGpGestNomReutilizar = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (n, i, r) {
            }
        }


    });


    gpGestNomReutilizar = new Ext.ux.maximgb.treegrid.GridPanel({
        title: perfil.etiquetas.lbGrupNomencladores,
        plugins: filtrosgruposnomencladores,
        frame: true,
        master_column_id: 'newexpandir',
        stripeRows: true,
        root_title: perfil.etiquetas.lbGpRootTitle,
        store: stGpGestNomReutilizar,
        margins: '1 1 1 -4',
        sm: smGpGestNomReutilizar,
        columns: [
            {
                id: 'newexpandir',
                header: perfil.etiquetas.lbdenominacion,
                sortable: true,
                dataIndex: 'denominacion'
            },
            {
                header: perfil.etiquetas.lbdescripcion,
                sortable: true,
                width: 450,
                dataIndex: 'descripcion'
            }/*,
             {
             header: perfil.etiquetas.lbcolor,
             width: 90,
             dataIndex: ''
             }*/
        ],
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [],
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: stGpGestNomReutilizar,
            displayInfo: true,
            id: 'newpgTreeGrid'
        })


    });


    winReutilizar = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        width: 700,
        height: 620,
        constrain: true,
        items: gpGestNomReutilizar,
        buttons: [{
                //  icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function () {

                    winReutilizar.destroy();
                }
            }, {
                //  icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'aplicar',
                id: 'btnaplicar',
                text: perfil.etiquetas.lbAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function () {


                }
            }, {
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function () {
                    winReutilizar.destroy();
                }
            }]
    });
    stGpGestNomReutilizar.load();
    winReutilizar.show();
}

/*function upColorCellReutilizar() {
 for (var i = 0; i < stGpGestNomReutilizar.getCount(); i++) {
 Ext.get(gpGestNomReutilizar.getView().getCell(i, 2)).applyStyles('background-color:' + stGpGestNomReutilizar.getAt(i).data.color);
 }
 }*/
function actualizararbol(arbol, valor) {

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
function ventanasNoActivas() {
    if (!winAdd.isVisible())
        return true;
    else {
        return false;
    }
}

///////*****//////******//////********////////********////////********/////////
function AccionesPostGestion(accion, respuesta, hijo) {
    switch (accion) {
        case 'adicionar':
            if (respuesta == 1) {
                if (hijo) {
                    var rec = gpGestNom.getSelectionModel().getSelected();
                    if (rec.data._is_leaf == true && rec.data._parent == null) {
                        gpGestNom.getSelectionModel().clearSelections();
                        var start = (ptbGestNom.getPageData().activePage - 1) * (20);
                        gpGestNom.getStore().reload({
                            params: {
                                anode: null,
                                start: start
                            }
                        });
                    }
                    if (rec.data._is_leaf == true && rec.data._parent != null) {
                        var recparent = gpGestNom.getStore().getById(rec.data._parent);
                        var arrayrec = [];
                        arrayrec.push(recparent);
                        gpGestNom.getStore().setNodeLoaded(recparent, false);
                        gpGestNom.getSelectionModel().selectRecords(arrayrec);
                        gpGestNom.getStore().expandNode(recparent);
                        gpGestNom.getStore().reload();
                        /*var arrayrecBase = [];
                         arrayrecBase.push(rec);
                         gpGestNom.getSelectionModel().selectRecords(arrayrecBase);*/

                    }
                    if (rec.data._is_leaf == false) {
                        gpGestNom.getStore().setNodeLoaded(rec, false);
                        gpGestNom.getStore().expandNode(rec);
                        gpGestNom.getStore().reload();
                    }
                } else {
                    var start = (ptbGestNom.getPageData().activePage - 1) * (20);
                    gpGestNom.getSelectionModel().clearSelections();
                    gpGestNom.getStore().reload({
                        params: {
                            anode: null,
                            start: start
                        }
                    });
                }
            }
            break;
        case 'modificar':
            var rec = gpGestNom.getSelectionModel().getSelected();
            if (rec.data._parent != null) {
                var recparent = gpGestNom.getStore().getById(rec.data._parent);
                var arrayrec = [];
                arrayrec.push(recparent);
                gpGestNom.getStore().setNodeLoaded(recparent, false);
                gpGestNom.getSelectionModel().selectRecords(arrayrec);
                gpGestNom.getStore().expandNode(recparent);
                gpGestNom.getStore().reload();
            }
            if (rec.data._parent == null) {
                anode = gpGestNom.getSelectionModel().getSelected().data._parent;
                gpGestNom.getSelectionModel().clearSelections();
                var start = (ptbGestNom.getPageData().activePage - 1) * (20);
                stGpGestNom.reload({
                    params: {
                        anode: null,
                        start: start
                    }
                });
            }
            break;
        case 'eliminar':
            var rec = hijo;
            if (rec._parent != null) {
                var start = (ptbGestNom.getPageData().activePage - 1) * (20);
                stGpGestNom.reload({
                    params: {
                        anode: null,
                        start: start
                    }
                });
            }
            if (rec._parent == null) {
                anode = hijo._parent;
                var start = (ptbGestNom.getPageData().activePage - 1) * (20);
                stGpGestNom.reload({
                    params: {
                        anode: null,
                        start: start
                    }
                });
            }
            break;
    }
}



