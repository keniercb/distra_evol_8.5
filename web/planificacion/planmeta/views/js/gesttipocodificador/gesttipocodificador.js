var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gesttipocodificador', cargaInicial);
Ext.QuickTips.init();
Ext.override(Ext.Button, {
    setTooltip: function (b, a) {
        if (this.rendered) {

            var btnEl = this.el.child(this.buttonSelector);
            if (typeof b == 'object') {
                Ext.QuickTips.register(Ext.apply({
                    target: btnEl.id
                }, b));
                this.tooltip = b
            } else {
                btnEl.dom[this.tooltipType] = b
            }
        } else {
            this.tooltip = b
        }
        return this
    }
});

var treesel, treeselepecialidad, mensaje, ifmod = false, modf = false, faltadatos = false, accionAdd = false;
var es_especialidad = null, isAsoc, aplicar, idpadre, accionAR = "", esCB, id = null, flag1 = false, flag2 = false, flag3 = false, flagind = false, anode, nivelarbol, idtipocod, vstart, objci;
//objci = {};
var iddelet, idind, filtrosIndicadores;
var eliminando = 0;
var contAsociados = 0;
var contNoAsociados = 0;
var habilitarAsociarInd = false;
var habilitarAsociarCodif = false;

// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas
var winAsociarcodif;
var stGpCodificadores;

function validarCentroB() {
    Ext.Ajax.request({
        url: 'ValidarCentro',
        callback: function (options, success, response) {
            esCB = response.responseText;
        }
    });
}

// function CargarInterfaz
function cargarInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando,
        removeMask: false
    });
    filtrostipocodif = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'codigo'
            }
        ]
    });
    /* colorMenu = new Ext.menu.ColorMenu({
     listeners: {
     select: function(p, c) {
     Ext.getCmp('color').setValue(c);
     Ext.get('color').applyStyles('border:2px solid #' + c);
     }
     }
     });
     colorMenu2 = new Ext.menu.ColorMenu({
     listeners: {
     select: function(p, c) {
     Ext.getCmp('color2').setValue(c);
     Ext.get('color2').applyStyles('border:2px solid #' + c);
     }
     }
     });
     
     btcolorcodif = new Ext.Button({
     id: 'btcolorcodif',
     icon: perfil.dirImg + 'paletacolor.png',
     iconCls: 'btn',
     listeners: {
     click: function(b, e) {
     e.stopEvent();
     var xy = e.getXY();
     colorMenu.showAt(xy);
     },
     change: function(field, newValue, oldValue) {
     modf = true;
     }
     }
     });
     btcolorcodif2 = new Ext.Button({
     id: 'btcolorcodif2',
     icon: perfil.dirImg + 'paletacolor.png',
     iconCls: 'btn',
     listeners: {
     click: function(b, e) {
     e.stopEvent();
     var xy = e.getXY();
     colorMenu2.showAt(xy);
     }
     }
     });*/

    // Botones btnAdd btnMod btnDel btnAyuda
    btnAdd = new Ext.Button({
        handler: function () {
            accionAR = "add";
            accionAdd = true;
            accionAdicionar();
        },
        disabled: false,
        id: 'btnAddcodif',
        iconCls: 'adicionar',
        tooltip: 'Adicionar tipo de codificador <b>(Alt+I)</b>'
    });
    btnMod = new Ext.Button({
        handler: function () {
            accionAR = "mod";
            accionModificar();
        },
        id: 'btnModcodif',
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar tipo de codificador <b>(Alt+M)</b>'
    });
    btnDel = new Ext.Button({
        disabled: true,
        id: 'btnElimcodif',
        iconCls: 'eliminar',
        tooltip: 'Eliminar tipo de codificador <b>(DEL)</b>',
        handler: function () {
            accionAR = "del";
            accionEliminar();
        }
    });
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        id: 'btnAyucodif',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtbtnAyu
    });
    btnLimpiar = new Ext.Button({
        id: 'btnlimpiarcodif',
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        iconCls: 'limpiar',
        handler: function () {
            accionLimpiar();
        }
    });
    btnLimpiarInd = new Ext.Button({
        id: 'btnlimpiarInd',
        tooltip: perfil.etiquetas.lbTtBtnLimpInd,
        iconCls: 'limpiar',
        handler: function () {
            filtrosIndicadores.clearFilters();
            checkCAsociarcodif.clearSelections();
            cbFiltrarNivel.reset();
            cbFiltrarNivel.clearValue();
        }
    });
    btnlimpiarCodificadores = new Ext.Button({
        id: 'btnlimpiarCodificadores',
        tooltip: perfil.etiquetas.lbTtBtnLimpCod,
        iconCls: 'limpiar',
        handler: function () {
            filtrosCodificadores.clearFilters();
        }
    });
    btnAsoc = new Ext.Button({
        id: 'btnAsoc',
        iconCls: 'asociar',
        disabled: true,
        tooltip: perfil.etiquetas.lbttbtnAsoc,
        handler: function () {
            ValidarAsociacion();
        }
    });
    btnDesasociar = new Ext.Button({
        iconCls: 'deshacer',
        disabled: true,
        tooltip: perfil.etiquetas.lbttbtnDesa,
        id: 'btnDesasociar',
        handler: function () {
            elimarAsociacion();
        }
    });
    btnAyudaCod_Ind = new Ext.Button({
        disabled: false,
        id: 'btnAyudaCod_Ind',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
        iconCls: 'ayuda',
        handler: function () {
        }
    });
    btnAsociar = new Ext.Button({
        tooltip: perfil.etiquetas.lbTtbtnAsociar,
        iconCls: 'asociar',
        id: 'btnAsociar',
        handler: function () {
            if (!flag3)
                mymask.show();
            stGpCodificadores.removeAll();
            cbtipoCodificador.reset();
            winAsociarcodif.show();
        }
    });
    btnExportar = new Ext.Button({
        disabled: false,
        id: 'btnExportar',
        iconCls: 'exportar',
        tooltip: 'Exportar todos los codificadores <b>(Alt+E)</b>',
        handler: function () {
            filtros = [];
            for (var i = 0; i < filtrostipocodif.filters.items.length; i++) {
                if (filtrostipocodif.filters.items[i].active) {
                    var args = new Object();
                    args['type'] = filtrostipocodif.filters.items[i].type;
                    args['value'] = filtrostipocodif.filters.items[i].getValue();
                    var data = new Object();
                    data['data'] = args;
                    data['field'] = filtrostipocodif.filters.items[i].dataIndex;
                    filtros.push(data);
                }
            }
            if (smGpGestcodif.getSelected() != undefined && smGpGestcodif.getSelected()._parent == null)
                anode = smGpGestcodif.getSelected().id;
            var win = window.open('exportar?filtros=' + Ext.encode(filtros) /*+ '&anode=' + anode*/);
            anode = null;
        }
    });
    /* btnExportarIndAsoc = new Ext.Button({
     disabled: true,
     id: 'btnExportarIndAsoc',
     // icon: perfil.dirImg + 'exportar.png',
     iconCls: 'exportar',
     tooltip: perfil.etiquetas.lbTtbtnExportarIndAsoc,
     // text: perfil.etiquetas.btnExportarIndAsoc,
     handler: function() {
     filtros = [];
     for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
     if (filtrosIndicadores.filters.items[i].active) {
     var args = new Object();
     args['type'] = filtrosIndicadores.filters.items[i].type;
     args['value'] = filtrosIndicadores.filters.items[i].getValue();
     var data = new Object();
     data['data'] = args;
     data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
     filtros.push(data);
     }
     }
     var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + cbFiltrarNivel.getValue() + '&asociado=' + 1 + '&rector=' + objci.entidadrectora);
     }
     });
     btnExportarIndNoAsoc = new Ext.Button({
     disabled: true,
     id: 'btnExportarIndNoAsoc',
     //icon: perfil.dirImg + 'exportar.png',
     iconCls: 'exportar',
     tooltip: perfil.etiquetas.lbTtbtnExportarIndNoAsoc,
     // text: perfil.etiquetas.btnExportarIndNoAsoc,
     handler: function() {
     filtros = [];
     for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
     if (filtrosIndicadores.filters.items[i].active) {
     var args = new Object();
     args['type'] = filtrosIndicadores.filters.items[i].type;
     args['value'] = filtrosIndicadores.filters.items[i].getValue();
     var data = new Object();
     data['data'] = args;
     data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
     filtros.push(data);
     }
     }
     var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + cbFiltrarNivel.getValue() + '&asociado=' + 2 + '&rector=' + objci.entidadrectora);
     }
     });
     btnExportarInd = new Ext.Button({
     disabled: true,
     id: 'btnExportarInd',
     //icon: perfil.dirImg + 'exportar.png',
     iconCls: 'exportar',
     tooltip: perfil.etiquetas.lbTtbtnExportarInd,
     // text: perfil.etiquetas.btnExportarInd,
     handler: function() {
     filtros = [];
     for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
     if (filtrosIndicadores.filters.items[i].active) {
     var args = new Object();
     args['type'] = filtrosIndicadores.filters.items[i].type;
     args['value'] = filtrosIndicadores.filters.items[i].getValue();
     var data = new Object();
     data['data'] = args;
     data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
     filtros.push(data);
     }
     }
     var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + cbFiltrarNivel.getValue() + '&asociado=' + 3 + '&rector=' + objci.entidadrectora);
     }
     });*/

    /*if (!objci.entidadrectora) {
     btnAdd.disable();
     btnMod.disable();
     btnDel.disable();
     }*/
    stformatos = new Ext.data.Store({
        url: 'listarFormatos',
        id: 'stformatos',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idformato'
        },
                [{
                        name: 'idformato'
                    }, {
                        name: 'nombre'
                    }, {
                        name: 'descripcion'
                    }, {
                        name: 'separador'
                    }, {
                        name: 'version'
                    }, {
                        name: 'idestructuracomun'
                    }, {
                        name: 'nivelpais'
                    }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
                flag1 = true;
                mymask.hide();
            }
        }
    });
    stum = new Ext.data.Store({
        url: 'listarUm',
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
                flag2 = true;
                mymask.hide();
            }
        }
    });
    cbformatos = new Ext.form.ComboBox({
        fieldLabel: perfil.etiquetas.lbformato,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        displayField: 'nombre',
        id: 'cbformatos',
        valueField: 'idformato',
        store: stformatos,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idformato',
        triggerAction: 'all',
        editable: false,
        anchor: '100%',
        mode: 'local'
    });
    cbum = new Ext.form.ComboBox({
        fieldLabel: perfil.etiquetas.lbUm,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        displayField: 'denominacionunidadmedida',
        id: 'cbum',
        allowBlank: false,
        valueField: 'idunidadmedida',
        store: stum,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'um',
        triggerAction: 'all',
        editable: false,
        listWidth: 190,
        anchor: '95%',
        mode: 'local'
    });
    //********Combo Niveles Indicadores********
    stniveles = new Ext.data.SimpleStore({
        fields: ['idnivel', 'denominacion'],
        data: [[1, 'Genérico'], [2, 'Subgérico'], [3, 'Específico'], [4, 'Surtido']]
    });
    cbFiltrarNivel = new Ext.form.ComboBox({
        id: 'cbFiltrarNivel',
        emptyText: perfil.etiquetas.lbNivel1,
        loadingText: 'Cargando...',
        store: stniveles,
        valueField: 'idnivel',
        width: 140,
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'local',
        listWidth: 250,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function () {
                stGpAsociarcodif.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        }
    });
    denominacion = new Ext.form.TextField({
        xtype: 'textfield',
        fieldLabel: perfil.etiquetas.lbdenominacion,
        id: 'denominacion',
        allowBlank: false,
        prevTab: 'btncancelar',
        anchor: '100%',
        maxLength: 250,
        maxLengthText: 'El tamaño máximo requerido es 250 caracteres.',
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
        regexText: perfil.etiquetas.lbMsgSoloALfa
    });
    // formulario fpGestcodif
    fpGestcodif = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpGestcodif',
        frame: true,
        autoHeight: true,
        bodyStyle: 'padding:5px 5px 0',
        listeners: {
            render: function (f) {
                //  btcolorcodif.show();
            },
            clientvalidation: function (form, valid) {

                if (form.getForm().isValid()) {
                    if (accionAdd) {
                        if (Ext.getCmp('denominacion').getValue() != "" && Ext.getCmp('cbformatos').getValue() != "") {
                            Ext.getCmp('btnaceptar').enable();
                            Ext.getCmp('btnaplicar').enable();
                        } else {
                            Ext.getCmp('btnaceptar').disable();
                            Ext.getCmp('btnaplicar').disable();
                        }

                    } else {
                        if (Ext.getCmp('denominacion').getValue() != valordenominacioncodificador
                                || Ext.getCmp('cbformatos').getValue() != valorformato
                                || Ext.getCmp('descripcion').getValue() != valordescripcion) {
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
                        items: [denominacion]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [cbformatos]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                id: 'descripcion',
                                maxLength: 250,
                                blankText: 'El tamaño máximo requerido es 250 caracteres.',
                                anchor: '100%'
                            }]
                    }]
            }]
    });
    codigo1 = new Ext.form.TextField({
        xtype: 'textfield',
        fieldLabel: perfil.etiquetas.lbCodigo,
        id: 'codigo',
        allowBlank: false,
        anchor: '95%',
        prevTab: 'btncancelardatos',
        maxLength: 19,
        maxLengthText: perfil.etiquetas.lbCantDigtos,
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        regex: /^([0-9]+ ?[0-9]*)+$/,
        regexText: "Solo admite números positivos."
    });
    //***************datos codificador*********
    fpdatoscodif = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpdatoscodif',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        listeners: {
            render: function (f) {
                //   btcolorcodif2.show();
            },
            clientvalidation: function (fm, valid) {

                if (accionAdd) {
                    if (fm.getForm().isValid() && Ext.getCmp('codigo').getValue() != ""
                            && Ext.getCmp('denominacion1').getValue() != ""
                            && Ext.getCmp('cbum').getValue() != "") {
                        Ext.getCmp('btnaplicardatos').enable();
                        Ext.getCmp('btnaceptardatos').enable();
                    } else {
                        Ext.getCmp('btnaplicardatos').disable();
                        Ext.getCmp('btnaceptardatos').disable();
                    }
                } else {
                    if (fm.getForm().isValid() && (Ext.getCmp('codigo').getValue() != valorcodigo
                            || Ext.getCmp('denominacion1').getValue() != valordenominacioncodificador
                            || Ext.getCmp('cbum').getValue() != valorum
                            || Ext.getCmp('descripcion1').getValue() != valordescripcion)) {

                        Ext.getCmp('btnaplicardatos').enable();
                        Ext.getCmp('btnaceptardatos').enable();
                    } else {
                        Ext.getCmp('btnaplicardatos').disable();
                        Ext.getCmp('btnaceptardatos').disable();
                    }
                }

                if (!Ext.getCmp('btnaceptardatos').disabled) {
                    Ext.getCmp('codigo').prevTab = 'btnaceptardatos';
                } else {
                    Ext.getCmp('codigo').prevTab = 'btncancelardatos';
                }
            }
        },
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .4,
                        layout: 'form',
                        items: [codigo1]
                    }, {
                        columnWidth: .6,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbdenominacion,
                                id: 'denominacion1',
                                maxLength: 250,
                                allowBlank: false,
                                maxLengthText: 'El tamaño máximo requerido es 250 caracteres.',
                                anchor: '95%',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
                                maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfa
                            }]
                    }, {
                        columnWidth: .4,
                        layout: 'form',
                        items: [cbum]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                id: 'descripcion1',
                                anchor: '100%'
                            }]
                    }]
            }]
    });

    windatoscodif = new Ext.Window({
        title: ' Adicionar datos del codificador',
        modal: true,
        constrain: true,
        closeAction: 'hide',
        layout: 'fit',
        width: 450,
        height: 270,
        autoValidate: false,
        items: fpdatoscodif,
        buttons: [{
                iconCls: 'cancelar',
                id: 'btncancelardatos',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function () {
                    fpdatoscodif.getForm().reset();
                    windatoscodif.hide();
                }
            }, {
                iconCls: 'aplicar',
                disabled: true,
                id: 'btnaplicardatos',
                text: perfil.etiquetas.lbAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function () {
                    aplicar = true;
                    accionAdd = false;
                    adicionar();
                }
            }, {
                iconCls: 'aceptar',
                disabled: true,
                id: 'btnaceptardatos',
                nextTab: 'denominacion1',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function () {
                    aplicar = false;
                    accionAdd = false;
                    adicionar();
                }
            }]
    })
    // Store grid stGpGestcodif
    stGpGestcodif = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listar',
        listeners: {
            load: function (st, rec, opt) {
                // upColorCell();
                if (!flag1 || !flag2) {
                    stformatos.reload();
                    stum.reload();
                    sttipoCodificador.reload();
                    Ext.getCmp('cbFiltroCB').store.reload();
                }
                if (stGpGestcodif.getCount() == 0) {
                    if (filtrostipocodif.getFiltrosActivos() == undefined || filtrostipocodif.getFiltrosActivos().length == 0) {
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
            },
            beforeload: function () {
                stGpGestcodif.baseParams.es_especialidad = es_especialidad;
                setTituloFiltrarcodif();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: 'total',
            id: 'id'
        }, [{
                name: 'id'
            }, {
                name: 'idtipocodificador'
            }, {
                name: 'idformato'
            }, {
                name: 'idumedida'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'color'
            }, {
                name: '_is_leaf'
            }, {
                name: '_parent'
            }]
                )
    });
    // Selection Model grid smGpGestcodif
    smGpGestcodif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (obj, i, r) {
                if (smGpGestcodif.getSelected().data._parent == null) {
                    Ext.getCmp('btnaddih').show();
                    Ext.getCmp('btnModcodif').setTooltip(new Ext.ToolTip({title: "Modificar tipo de codificador <b>(Alt+M)</b>"}), true);
                    //Ext.getCmp('btnModcodifsel').setTooltip(new Ext.ToolTip({title: "Modificar tipo de codificador <b>(Alt+M)</b>"}), true);
                    Ext.getCmp('btnElimcodif').setTooltip(new Ext.ToolTip({title: "Eliminar tipo de codificador <b>(DEL)</b>"}), true);
                } else {
                    Ext.getCmp('btnaddih').hide();
                    Ext.getCmp('btnModcodif').setTooltip(new Ext.ToolTip({title: "Modificar datos del tipo de codificador <b>(Alt+M)</b>"}), true);
                    //Ext.getCmp('btnModcodifsel').setTooltip(new Ext.ToolTip({title: "Modificar datos del tipo de codificador <b>(Alt+M)</b>"}), true);
                    Ext.getCmp('btnElimcodif').setTooltip(new Ext.ToolTip({title: "Eliminar datos del tipo de codificador <b>(DEL)</b>"}), true);
                }
                if (objci.entidadrectora) {
                    btnMod.enable();
                    btnDel.enable();
                }
                if (smGpGestcodif.getCount() == 1) {
                    btnMod.enable();
                } else {
                    btnMod.disable();
                }
                valorcodigo = obj.getSelected().data.codigo;
                valordenominacioncodificador = obj.getSelected().data.denominacion;
                valorum = obj.getSelected().data.idumedida;
                valordescripcion = obj.getSelected().data.descripcion;
                valorformato = obj.getSelected().data.idformato;
            },
            rowdeselect: function (obj, i, r) {
                btnMod.disable();
                btnDel.disable();
            }
        }
    });
    cmGestcodif = new Ext.grid.ColumnModel({
        columns: [{
                header: perfil.etiquetas.lbCodigo,
                sortable: true,
                dataIndex: 'codigo',
                tooltip: 'Código',
                // renderer: Rendercodigo,
                width: 120
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbdenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                tooltip: 'Denominación'//,
                        // renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                sortable: true,
                width: 450,
                dataIndex: 'descripcion',
                tooltip: 'Descrpición'//,
                        // renderer: crearToolTip
            }]
    });
    // Grid gestion gpGestcodif
    gpGestcodif = new Ext.ux.maximgb.treegrid.GridPanel({
        plugins: filtrostipocodif,
        region: 'center',
        frame: true,
        master_column_id: 'expandir',
        stripeRows: true,
        title: 'Codificadores',
        root_title: 'Tipo codificador',
        autoExpandColumn: 'expandir',
        store: stGpGestcodif,
        margins: '1 1 1 -4',
        sm: smGpGestcodif,
        cm: cmGestcodif,
        /*columns: [{
         header: perfil.etiquetas.lbCodigo,
         sortable: true,
         dataIndex: 'codigo',
         tooltip: 'Código',
         // renderer: Rendercodigo,
         width: 120
         }, {
         id: 'expandir',
         header: perfil.etiquetas.lbdenominacion,
         sortable: true,
         dataIndex: 'denominacion',
         tooltip: 'Denominación'//,
         // renderer: crearToolTip
         }, {
         header: perfil.etiquetas.lbDescripcion,
         sortable: true,
         width: 450,
         dataIndex: 'descripcion',
         tooltip: 'Descrpición'//,
         // renderer: crearToolTip
         }/*, {
         header: perfil.etiquetas.lbcolor,
         width: 90,
         tooltip: 'Color',
         dataIndex: ''
         }/],*/
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [],
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: stGpGestcodif,
            displayInfo: true,
            items: [btnLimpiar],
            id: 'TreeGridcodif'
        }),
        md: new Ext.menu.Menu({
            id: 'submenu',
            items: [{
                    text: perfil.etiquetas.lbAddCod,
                    itemCls: 'x-menu-item icondistra-adicionar',
                    iconCls: 'imagen-none',
                    id: 'btnaddih',
                    hidden: true,
                    handler: function () {
                        ifmod = false;
                        if (!flag2)
                            mymask.show();
                        windatoscodif.on('beforeshow', function () {
                            codigo1.focus(true, 500);
                        });
                        windatoscodif.show();
                        windatoscodif.setTitle('Adicionar datos del tipo de codificador');
                        accionAdd = true;
                        Ext.getCmp('btnaplicardatos').show();
                        // Ext.get('color2').applyStyles('border:1px solid #C0C0C0');
                    }
                }, {
                    handler: function () {
                        accionAR = "mod";
                        accionModificar();
                    },
                    text: perfil.etiquetas.lbBtnModificar,
                    id: 'btnModcodifsel',
                    // icon: perfil.dirImg + 'modificar.png',
                    // disabled: true,
                    itemCls: 'x-menu-item icondistra-modificar',
                    iconCls: 'imagen-none',
                    tooltip: 'Modificar tipo de codificador <b>(Alt+M)</b>'
                }, {
                    handler: function () {

                    },
                    text: 'Eliminar',
                    id: 'mdEliminarCodif',
                    // icon: perfil.dirImg + 'modificar.png',
                    // disabled: true,
                    itemCls: 'x-menu-item icondistra-eliminar',
                    iconCls: 'imagen-none',
                    tooltip: 'Eliminar tipo de codificador'
                }]
        }),
        listeners: {
            rowcontextmenu: function (g, r, e) {
                if (gpGestcodif.getSelectionModel().getSelections().length == 1 && smGpGestcodif.getSelected().data._parent == null) {
                    Ext.getCmp('btnaddih').show();
                } else {
                    Ext.getCmp('btnaddih').hide();
                }

                e.stopEvent();
                if (objci.entidadrectora) {
                    gpGestcodif.getSelectionModel().selectRow(r);
                    if (!smGpGestcodif.getSelected().data.dty)
                        gpGestcodif.md.showAt(e.getXY());
                }
            },
            celldblclick: function () {

            }

        }
    });

    sttipoCodificador = new Ext.data.Store({
        url: 'listarTipoCodificadores',
        listeners: {
            load: function () {
                flag3 = true;
                mymask.hide();
            },
            beforeload: function () {
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idtipocodificador',
            root: 'data'
        }, [{
                name: 'idtipocodificador'
            }, {
                name: 'denominacion'
            }])
    });

    cbtipoCodificador = new Ext.form.ComboBox({
        id: 'cbtipoCodificador',
        emptyText: 'Seleccione...',
        loadingText: 'Cargando...',
        store: sttipoCodificador,
        valueField: 'idtipocodificador',
        width: 140,
        displayField: 'denominacion',
        anchor: '95%',
        mode: 'local',
        listWidth: 250,
        typeAhead: true,
        editable: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function () {
                cbFiltrarNivel.setValue(stniveles.data.items[0].data.idnivel);
                GpAsociarcodif.enable();
                //btnExportarIndAsoc.enable();
                // btnExportarIndNoAsoc.enable();
                //btnExportarInd.enable();
                Ext.getCmp('mnexportarDocAsoc').enable();
                idtipocod = cbtipoCodificador.getValue();
                checkCAsociarcodif.clearSelections();
                stGpAsociarcodif.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
                stGpCodificadores.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        }
    });
    vpGesttipocodificador = new Ext.Viewport({
        layout: 'fit',
        items: {
            layout: 'fit',
            tbar: [btnAdd, '-', btnMod, '-', btnDel, '-', btnExportar, '-', btnAsociar, /*'-',cbtipoCodificador,*/ '->', btnAyuda],
            items: [gpGestcodif],
            listeners: {
                'afterlayout': function () {
                    Ext.getCmp('btnAyucodif').focus();
                }
            }
        }
    })

    stGpGestcodif.load();
    winAddcodif = new Ext.Window({
        modal: true,
        constrain: true,
        closeAction: 'hide',
        layout: 'fit',
        width: 400,
        autoHeight: true,
        autoValidate: false,
        items: fpGestcodif,
        buttons: [{
                iconCls: 'cancelar',
                id: 'btncancelar',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function () {
                    fpGestcodif.getForm().reset();
                    winAddcodif.hide();
                }
            }, {
                iconCls: 'aplicar',
                id: 'btnaplicar',
                disabled: true,
                text: perfil.etiquetas.lbAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function () {
                    aplicar = true;
                    adicionar();
                }
            }, {
                iconCls: 'aceptar',
                disabled: true,
                id: 'btnaceptar',
                nextTab: 'denominacion',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function () {
                    aplicar = false;
                    adicionar();
                }
            }]
    });

    //*****************A partir de aqui, Interfaz de Asociar indicador*********************
    //*******************Filtros GpAsociarcodif ************************
    filtrosIndicadores = new Ext.grid.GridFilters({
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
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'numeropieza',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'denodatoscodif'
            }, {
                type: 'boolean',
                dataIndex: 'idtipocodificador'
            }, {
                type: 'listado',
                dataIndex: 'denocentrobalance',
                idcombo: 'cbFiltroCB',
                urlcb: 'listarCentroBalance',
                idstore: 'stcbFiltroCb',
                valueFieldcb: 'identidaddatosnomenclador',
                displayFieldcb: 'denom',
                width: 200,
                autoload: false,
                mode: 'local'
            }]
    });
    //*******************Filtros GpCodificadores ************************

    filtrosCodificadores = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: ['SI', 'NO']
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'cbFiltroUM',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }]
    });

    // Store grid stGpAsociarcodif
    stGpAsociarcodif = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarIndicadores',
        listeners: {
            load: function () {
                flagind = true;
                siexisteIndicadores();
            },
            beforeload: function () {
                stGpAsociarcodif.baseParams.anode = (GpAsociarcodif.getSelectionModel().hasSelection()) ? GpAsociarcodif.getSelectionModel().getSelected().data.idindicador : anode;
                anode = null;
                stGpAsociarcodif.baseParams.nivelarbol = cbFiltrarNivel.getValue();
                stGpAsociarcodif.baseParams.rector = objci.entidadrectora;
                stGpAsociarcodif.baseParams.idtipocodif = cbtipoCodificador.getValue();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: 'total',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'codigocodificador'
            }, {
                name: 'numeropieza'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }, {
                name: 'idpadre'
            }, {
                name: 'idarbol'
            }, {
                name: 'nivelarbol'
            }, {
                name: 'denominacion'
            }, {
                name: 'denocentrobalance'
            }, {
                name: 'denodatoscodif'
            }, {
                name: 'denomcodificador'
            }, {
                name: 'idtipocodificador'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'asociado'
            }, {
                name: 'asoc'
            }])
    });
    checkCAsociarcodif = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, i, r) {
                validar();
                Habilitarbtn();
            },
            rowdeselect: function (sm, i, r) {
                validar();
                Habilitarbtn();
            }
        }
    });
    cmcheckCAsociarcodif = new Ext.grid.ColumnModel([
        checkCAsociarcodif, {
            header: 'Código',
            id: 'codigo',
            width: 60,
            sortable: true,
            dataIndex: 'codigo',
            tooltip: 'Código del indicador',
            renderer: crearToolTip
        }, {
            header: 'No pieza',
            width: 60,
            sortable: false,
            dataIndex: 'numeropieza',
            renderer: renderNopieza,
            tooltip: 'Número de pieza'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbdenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            tooltip: 'Denominación del indicador',
            renderer: crearToolTip
        }, {
            header: 'Centro de balance',
            sortable: true,
            width: 120,
            dataIndex: 'denocentrobalance',
            tooltip: 'Centro de balance del indicador',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: 'Dato',
            sortable: true,
            width: 60,
            dataIndex: 'denodatoscodif',
            renderer: Denodatoscodif,
            tooltip: 'Dato del codificador',
            hidden: true
        }, {
            header: 'Asociado',
            sortable: true,
            width: 60,
            dataIndex: 'idtipocodificador',
            renderer: RenderAsociado
        }]);

    menuExportar = new Ext.menu.Menu({
        items: [{
                id: 'btnExportarIndAsoc',
                text: 'Exportar indicadores asociados',
                tooltip: perfil.etiquetas.lbTtbtnExportarIndAsoc,
                iconCls: 'exportar',
                handler: function () {
                    filtros = [];
                    for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
                        if (filtrosIndicadores.filters.items[i].active) {
                            var args = new Object();
                            args['type'] = filtrosIndicadores.filters.items[i].type;
                            args['value'] = filtrosIndicadores.filters.items[i].getValue();
                            var data = new Object();
                            data['data'] = args;
                            data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
                            filtros.push(data);
                        }
                    }
                    var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + cbFiltrarNivel.getValue() + '&asociado=' + 1 + '&rector=' + objci.entidadrectora);
                }
            }, {
                id: 'btnExportarIndNoAsoc',
                text: 'Exportar indicadores no asociados',
                tooltip: perfil.etiquetas.lbTtbtnExportarIndNoAsoc,
                iconCls: 'exportar',
                handler: function () {
                    filtros = [];
                    for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
                        if (filtrosIndicadores.filters.items[i].active) {
                            var args = new Object();
                            args['type'] = filtrosIndicadores.filters.items[i].type;
                            args['value'] = filtrosIndicadores.filters.items[i].getValue();
                            var data = new Object();
                            data['data'] = args;
                            data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
                            filtros.push(data);
                        }
                    }
                    var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + cbFiltrarNivel.getValue() + '&asociado=' + 2 + '&rector=' + objci.entidadrectora);
                }
            }, {
                id: 'btnExportarInd',
                text: 'Exportar indicadores',
                tooltip: perfil.etiquetas.lbTtbtnExportarInd,
                iconCls: 'exportar',
                handler: function () {
                    filtros = [];
                    for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
                        if (filtrosIndicadores.filters.items[i].active) {
                            var args = new Object();
                            args['type'] = filtrosIndicadores.filters.items[i].type;
                            args['value'] = filtrosIndicadores.filters.items[i].getValue();
                            var data = new Object();
                            data['data'] = args;
                            data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
                            filtros.push(data);
                        }
                    }
                    var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + cbFiltrarNivel.getValue() + '&asociado=' + 3 + '&rector=' + objci.entidadrectora);
                }
            }]
    });

    mnexportar = new Ext.Button({
        id: 'mnexportarDocAsoc',
        disabled: true,
        tooltip: {
            text: 'Exportar Documentos'
        },
        iconCls: 'exportar',
        menu: menuExportar
    });

    /**
     * menu del click derecho del grid
     */
    menuIndicadores = new Ext.menu.Menu({
        id: 'menuIndicadores',
        //disabled: true,
        listeners: {},
        items: [{
                text: 'Asociar',
                iconCls: 'asociar',
                id: 'mdAsociarIndicador',
                tooltip: 'Asociar indicadores',
                handler: function () {

                }
            }, {
                text: 'Desasociar',
                iconCls: 'deshacer',
                id: 'mdDesasociarIndicador',
                tooltip: 'Desasociar indicadores',
                handler: function () {

                }
            }]
    });

    // Grid gestion gpGestcodif
    GpAsociarcodif = new Ext.grid.GridPanel/*Ext.ux.maximgb.treegrid.GridPanel*/({
        title: ' Indicadores',
        plugins: filtrosIndicadores,
        collapsible: true,
        collapsed: true,
        disabled: true,
        master_column_id: 'codigo',
        stripeRows: true,
        //root_title: 'Indicador',
        autoExpandColumn: 'expandir',
        store: stGpAsociarcodif,
        region: 'west',
        height: 425,
        width: 450,
        margins: '2 2 2 2',
        anchor: '95%',
        sm: checkCAsociarcodif,
        cm: cmcheckCAsociarcodif,
        //md: menuIndicadores,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: ['-', {
                xtype: 'tbtext',
                text: 'Nivel:'
            }, cbFiltrarNivel, '->', '-', btnAsoc, '-', btnDesasociar, '-', mnexportar],
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: stGpAsociarcodif,
            displayInfo: true,
            items: [btnLimpiarInd],
            id: 'GpAsociarcodif'
        }),
        listeners: {
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        }
    });

    //*************Store de codificadores ....GpCodificadores
    stGpCodificadores = new Ext.data.Store({
        url: 'listarDatosCodificador',
        enableKeyEvents: true,
        listeners: {
            beforeload: function () {
                stGpCodificadores.baseParams.idpadre = cbtipoCodificador.getValue();
            },
            load: function () {
                GpAsociarcodif.expand(true);
                siexisteCodificadores();
                if (stGpCodificadores.getCount() == 0) {
                    if (filtrosCodificadores.getFiltrosActivos() == undefined || filtrosCodificadores.getFiltrosActivos().length == 0) {
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }

                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddatoscodificador'
        }, [
            {
                name: 'iddatoscodificador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'color'
            }
        ])
    });

    checkCCodificadores = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (obj, i, r) {
                Habilitarbtn();
            },
            rowdeselect: function (obj, i, r) {
                Habilitarbtn();
            }
        }
    });

    cmcheckCCodificadores = new Ext.grid.ColumnModel([
        {
            width: 80,
            header: 'C&oacute;digo',
            dataIndex: 'codigo',
            tooltip: 'Código',
            sortable: true,
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: 'Denominaci&oacute;n',
            dataIndex: 'denominacion',
            sortable: true,
            tooltip: 'Denominación',
            renderer: crearToolTip
        }, {
            width: 55,
            header: 'UM',
            sortable: true,
            dataIndex: 'idumedida',
            renderer: RenderUm,
            tooltip: 'Unidad de medida'
        }]);

    GpCodificadores = new Ext.grid.GridPanel({
        plugins: filtrosCodificadores,
        title: 'Codificadores',
        id: 'GpCodificadores',
        store: stGpCodificadores,
        sm: checkCCodificadores,
        cm: cmcheckCCodificadores,
        region: 'center',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        height: 425,
        width: 450,
        margins: '2 2 2 2',
        anchor: '95%',
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: ['-', {
                xtype: 'tbtext',
                text: "Tipo:"
            }, cbtipoCodificador],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpCodificadores,
            displayInfo: true,
            items: [btnlimpiarCodificadores],
            id: 'pGpCodificadores'
        })
    });

    pGesAsociarcodif = new Ext.Panel({
        id: 'pGesAsociarcodif',
        height: 450,
        autoWidth: true,
        layout: 'border',
        //tbar: [btnExportarIndAsoc, '-', btnExportarIndNoAsoc, '-', btnExportarInd],
        items: [GpAsociarcodif, GpCodificadores]
    });

    winAsociarcodif = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        items: pGesAsociarcodif,
        width: 920,
        height: 515,
        title: 'Gestionar asociación de codificadores',
        buttons: [{
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: 'Cerrar',
                tooltip: perfil.etiquetas.lbttbtnCerrar,
                handler: function () {
                    //btnExportarInd.disable();
                    //btnExportarIndAsoc.disable();
                    // btnExportarIndNoAsoc.disable();
                    GpAsociarcodif.collapse(true);
                    Ext.getCmp('mnexportarDocAsoc').disable();
                    stGpAsociarcodif.removeAll();
                    cbFiltrarNivel.clearValue();
                    winAsociarcodif.hide();
                }
            }],
        listeners: {
            beforehide: function () {
                //btnExportarInd.disable();
                // btnExportarIndAsoc.disable();
                // btnExportarIndNoAsoc.disable();
                Ext.getCmp('mnexportarDocAsoc').disable();
                btnAsoc.disable();
            }
        }
    });

    //-----------------Fin Interfaz de Asociar indicador-----------------------------

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'iI',
            alt: true,
            fn: function () {
                if (!btnAdd.hidden && !btnAdd.disabled && eliminando == 0 && !winAddcodif.isVisible())
                    accionAdicionar();
            }
        }, {
            key: 46,
            fn: function () {
                if ((!btnDel.hidden && !btnDel.disabled && !winAsociarcodif.isVisible()) && !winAddcodif.isVisible())
                    accionEliminar();
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function () {
                if (!btnMod.hidden && !btnMod.disabled && eliminando == 0)
                    accionModificar();
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
                // mostrarAyuda('Correlacionador de productos');
            }
        }, {
            key: 'Ee',
            alt: true,
            ctrl: false,
            shift: false,
            fn: function () {
                filtros = [];
                for (var i = 0; i < filtrostipocodif.filters.items.length; i++) {
                    if (filtrostipocodif.filters.items[i].active) {
                        var args = new Object();
                        args['type'] = filtrostipocodif.filters.items[i].type;
                        args['value'] = filtrostipocodif.filters.items[i].getValue();
                        var data = new Object();
                        data['data'] = args;
                        data['field'] = filtrostipocodif.filters.items[i].dataIndex;
                        filtros.push(data);
                    }
                }
                if (smGpGestcodif.getSelected() != undefined && smGpGestcodif.getSelected()._parent == null)
                    anode = smGpGestcodif.getSelected().id;
                var win = window.open('exportar?filtros=' + Ext.encode(filtros) + '&anode=' + anode);
                anode = null;
            }
        }, {
            key: 'Ee',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!Ext.getCmp('btnExportarIndAsoc').hidden && Ext.getCmp('btnExportarIndAsoc').disable())
                    filtros = [];
                for (var i = 0; i < filtrosIndicadores.filters.items.length; i++) {
                    if (filtrosIndicadores.filters.items[i].active) {
                        var args = new Object();
                        args['type'] = filtrosIndicadores.filters.items[i].type;
                        args['value'] = filtrosIndicadores.filters.items[i].getValue();
                        var data = new Object();
                        data['data'] = args;
                        data['field'] = filtrosIndicadores.filters.items[i].dataIndex;
                        filtros.push(data);
                    }
                }
                var win = window.open('exportarindasoc?filtros=' + Ext.encode(filtros) + '&idtipocodif=' + cbtipoCodificador.getValue() + '&nivelarbol=' + 4 + '&asociado=' + 1 + '&rector=' + objci.entidadrectora);
            }
        }
    ]);
    Ext.Ajax.request({
        url: 'ValidarCentro',
        callback: function (options, success, response) {
            if (response.responseText == 'false') {// organo cb
                btnAsociar.disable();
            } else {
                btnAsociar.enable();
            }
        }
    });
}

function accionAdicionar() {
    // map.disable();
    if (!flag1)
        mymask.show();
    ifmod = false;
    winAddcodif.setTitle('Adicionar tipo de codificador');

    Ext.getCmp('btnaplicar').show();

    fpGestcodif.getForm().reset();
    winAddcodif.on('beforeshow', function () {
        denominacion.focus(true, 500);
    });
    winAddcodif.show('btnAdd');
    smGpGestcodif.clearSelections();
    // Ext.get('color').applyStyles('border:1px solid #C0C0C0');

}

function accionModificar() {
    if (gpGestcodif.getSelectionModel().getSelected() != undefined) {
        id = gpGestcodif.getSelectionModel().getSelected().id;
        if (gpGestcodif.getSelectionModel().getSelected().data._parent == null) {
            winAddcodif.setTitle('Modificar tipo de codificador');
            Ext.getCmp('btnaplicar').hide();
            winAddcodif.show('btnMod');
            ifmod = true;
            // valcolor = gpGestcodif.getSelectionModel().getSelected().data.color;
            // Ext.getCmp('color').setValue(valcolor);
            // Ext.get('color').applyStyles('border:2px solid #' + valcolor);
            Ext.getCmp('denominacion').setValue(gpGestcodif.getSelectionModel().getSelected().data.denominacion);
            Ext.getCmp('descripcion').setValue(gpGestcodif.getSelectionModel().getSelected().data.descripcion);
            cbformatos.setValue(gpGestcodif.getSelectionModel().getSelected().data.idformato);
        } else {
            windatoscodif.setTitle('Modificar datos del codificador');
            Ext.getCmp('btnaplicardatos').hide();
            windatoscodif.show('btnMod');
            ifmod = true;
            //valcolor = gpGestcodif.getSelectionModel().getSelected().data.color;
            // Ext.getCmp('color2').setValue(valcolor);
            // Ext.get('color2').applyStyles('border:2px solid #' + valcolor);
            Ext.getCmp('codigo').setValue(gpGestcodif.getSelectionModel().getSelected().data.codigo);
            Ext.getCmp('denominacion1').setValue(gpGestcodif.getSelectionModel().getSelected().data.denominacion);
            Ext.getCmp('descripcion1').setValue(gpGestcodif.getSelectionModel().getSelected().data.descripcion);
            cbum.setValue(gpGestcodif.getSelectionModel().getSelected().data.idumedida);
        }
    } else {
        mostrarMensaje(1, 'Debe seleccionar al menos un codificador.');
    }
}

function accionEliminar() {
    var aux = smGpGestcodif.getSelections();
    if (aux[0].data._parent == null) {
        if (aux.length > 1) {
            var mensaje = perfil.etiquetas.msgSegEliminarP;
        } else {
            var mensaje = perfil.etiquetas.msgSegEliminarr;
        }
    } else {
        if (aux.length > 1) {
            var mensaje = perfil.etiquetas.msgSegEliminarPDatos;
        } else {
            var mensaje = perfil.etiquetas.msgSegEliminarrDatos;
        }
    }
    eliminando = 1;
    mostrarMensaje(2, mensaje, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {

            if (gpGestcodif.getSelectionModel().getSelected() != undefined) {
                mymask.show();
                var arreglo = [];
                for (pos in aux) {
                    if (aux[pos].id) {
                        arreglo.push([aux[pos].id, aux[pos].data._parent]);
                    }
                }
                Ext.Ajax.request({
                    url: 'eliminar',
                    params: {
                        id: Ext.encode(arreglo)
                    },
                    callback: function (options, success, response) {
                        mymask.hide();
                        eliminando = 0;
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgE == 1) {
                            if (aux[0].data._parent == null) {
                                if (aux.length == 1) {
                                    mostrarMensaje(1, "El codificador ha sido eliminado satisfactoriamente.");
                                } else {
                                    mostrarMensaje(1, "Los codificadores han sido eliminados satisfactoriamente.");
                                }

                            } else {
                                if (aux.length == 1) {
                                    mostrarMensaje(1, "El dato del tipo de codificador ha sido eliminado satisfactoriamente.");
                                } else {
                                    mostrarMensaje(1, "Los datos de los tipos de codificadores han sido eliminados satisfactoriamente.");
                                }
                            }
                            sttipoCodificador.reload();
                        } else
                            mostrarMensaje(1, perfil.etiquetas.msgErrorAction);
                        var rec = stGpGestcodif.getById(smGpGestcodif.getSelected().data.id);


                        stGpGestcodif.reload({
                            params: {
                                anode: null,
                                start: 0,
                                limit: 20
                            },
                            callback: function () {
                                if (rec.data._is_leaf == true && rec.data._parent != null) {
                                    var recparent = stGpGestcodif.getById(rec.data._parent);
                                    stGpGestcodif.collapseNode(recparent);
                                    stGpGestcodif.setNodeLoaded(recparent, false);
                                    stGpGestcodif.expandNode(recparent);
                                }
                            }
                        });

                    }
                });
            } else {
                mostrarMensaje(1, perfil.etiquetas.msgCondEliminar);
            }
            btnMod.disable();
            btnDel.disable();
        } else {
            eliminando = 0;
        }
    }
}

function accionLimpiar() {
    smGpGestcodif.clearSelections();
    filtrostipocodif.clearFilters();
}

function setTituloFiltrarcodif() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrostipocodif.getFiltrosActivos() == undefined || filtrostipocodif.getFiltrosActivos().length == 0) {
        gpGestcodif.setTitle(perfil.etiquetas.lbtipocodif);
    } else {
        for (i = 0; i < filtrostipocodif.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrostipocodif.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbdenominacion;
            } else if (filtrostipocodif.getFiltrosActivos()[i].dataIndex == "descripcion") {
                aux = perfil.etiquetas.lbDescripcion;
            }
            if (i == filtrostipocodif.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpGestcodif.setTitle(perfil.etiquetas.lbFiltradoPorTip + filtrado_por);
        filtrado_por = "";
    }
}

function upCell() {
    for (var i = 0; i < stGpGestcodif.getCount(); i++) {
        Ext.get(gpGestcodif.getView().getCell(i, 3)).applyStyles('background-color:' + stGpGestcodif.getAt(i).data.color);
    }
}

function adicionar() {
    if (gpGestcodif.getSelectionModel().getSelected() != undefined) {
        idpadre = smGpGestcodif.getSelected().data.id;
    }
    /* if (accionAR == "mod" && modf == false) {
     mostrarMensaje(1, 'Debe realizar al menos una modificación.');
     } else {*/
    if (winAddcodif.isVisible() && fpGestcodif.getForm().isValid()) {
        mymask.show();
        fpGestcodif.getForm().submit({
            url: 'adicionar',
            params: {
                mod: ifmod,
                id: id
            },
            failure: function (form, action) {
                mymask.hide();
                if (action.result.codMsgA == 1) {
                    if (ifmod) {
                        //var color = gpGestcodif.getSelectionModel().getSelected().json.color;
                        var denom = gpGestcodif.getSelectionModel().getSelected().json.denominacion;
                        var descrip = gpGestcodif.getSelectionModel().getSelected().json.descripcion;
                        var formato = gpGestcodif.getSelectionModel().getSelected().json.idformato;
                        mostrarMensaje(1, perfil.etiquetas.msgCodModificar);
                        recarga();
                        if (!aplicar)
                            winAddcodif.hide();
                    } else {
                        if (!aplicar)
                            winAddcodif.hide();
                        else
                            fpGestcodif.getForm().reset();
                        mostrarMensaje(1, perfil.etiquetas.msgCodInsertar);
                        recarga();
                    }
                } else if (action.result.codMsgA == 2) {
                    mostrarMensaje(1, perfil.etiquetas.msgErrorAdicionar);
                }
            }
        });
    } else if (windatoscodif.isVisible() && fpdatoscodif.getForm().isValid()) {
        mymask.show();
        fpdatoscodif.getForm().submit({
            url: 'adicionar',
            params: {
                mod: ifmod,
                id: id,
                idpadre: idpadre,
                anode: smGpGestcodif.getSelected().data._parent
            },
            failure: function (form, action) {
                mymask.hide();
                if (action.result.codMsgA == 1) {
                    if (ifmod) {
                        //var color = gpGestcodif.getSelectionModel().getSelected().json.color;
                        /*  var denom = gpGestcodif.getSelectionModel().getSelected().json.denominacion;
                         var descrip = gpGestcodif.getSelectionModel().getSelected().json.descripcion;
                         var codigo = gpGestcodif.getSelectionModel().getSelected().json.codigo;
                         var cbumedida = gpGestcodif.getSelectionModel().getSelected().json.idumedida;
                         
                         if (cbum.getValue() != cbumedida || Ext.getCmp('codigo').getValue() != codigo
                         || Ext.getCmp('denominacion1').getValue() != denom
                         || Ext.getCmp('descripcion1').getValue() != descrip) {*/
                        mostrarMensaje(1, perfil.etiquetas.msgDatCodModificar);
                        sttipoCodificador.reload();
                        stGpGestcodif.reload({
                            params: {
                                anode: smGpGestcodif.getSelected().data._parent
                            }
                        });
                        if (!aplicar) {
                            fpdatoscodif.getForm().reset();
                            windatoscodif.hide();
                        }

                        /*} else {
                         mostrarMensaje(1, 'Debe realizar al menos una modificación.');
                         }*/
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgDatCodInsertar);
                        sttipoCodificador.reload()
                        stGpGestcodif.reload({
                            params: {
                                anode: smGpGestcodif.getSelected().data._parent
                            }
                        });
                        if (!aplicar) {
                            fpdatoscodif.getForm().reset();
                            windatoscodif.hide();
                        } else {
                            fpdatoscodif.getForm().reset();
                        }
                    }

                } else if (action.result.codMsgA == 2) {
                    mostrarMensaje(1, perfil.etiquetas.msgAlertInsertar);
                    if (!aplicar) {
                        fpdatoscodif.getForm().reset();
                        windatoscodif.hide();
                    }
                } else if (action.result.codMsgA == 3) {
                    mostrarMensaje(1, perfil.etiquetas.msgAlertInsertar);
                    if (!aplicar) {
                        fpdatoscodif.getForm().reset();
                        windatoscodif.hide();
                    }
                }


            }
        });

    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
        if (!aplicar) {
            fpdatoscodif.getForm().reset();
            windatoscodif.hide();
        }
    }
    // }
    accionAR = "";
    //modf = false;

}
function recarga() {
    sttipoCodificador.reload();
    stGpGestcodif.reload({
        params: {
            anode: null
        }
    });
}
function Aprobacion(val, metaData) {
    if (val != null)
        metaData.css = 'icondistra-true verde';
    //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    else
        metaData.css = 'icondistra-false rojo';
    //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
}

function RenderAsociado(val, metaData) {
    metaData.attr = 'ext:qtip="' + val + '"';
    aux = val.split(',');
    if (val == idtipocod) {
        metaData.css = 'icondistra-true verde';
    } else {
        metaData.css = 'icondistra-false rojo';
    }
    //metaData.css = 'icondistra-true verde';
    /* for (i in aux) {
     if (aux[i] == idtipocod) {
     metaData.css = 'icondistra-true verde';
     
     } else {
     metaData.css = 'icondistra-false rojo';
     
     }
     }*/
    //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
}

function renderNopieza(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == "" || val == null)
        return '-';
    else
        return val;
}

function Rendercodigo(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == null || value == undefined || value == '')
        return '<center> - </center>';
    else
        return value;
}

function RenderUm(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stum.data.items)
        if (stum.data.items[i].data.idunidadmedida == value)
            return stum.data.items[i].data.denominacionunidadmedida;
}

function Denodatoscodif(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    return '<center> - </center>';
}

function cargaInicial() {
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function (options, success, response) {
            objci = Ext.decode(response.responseText);
            if (!objci.codMsg) {
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
                    for (i in acciones_reportes) {
                        objci.acciones[acciones_reportes[i].abreviatura] = true;
                    }
                    cargarInterfaz();
                })
            } else if (objci.codMsg == 21) {
                mostrarMensaje(1, 'No existe formato de indicadores')
                cargarInterfaz();
            } else {
                mostrarMensaje(3, 'error')
                cargarInterfaz();
            }
        }
    });
}

function ValidarAsociacion() {
    mymask.show();
    ind = checkCAsociarcodif.getSelections();
    vind = [];
    for (i = 0; i < ind.length; i++) {
        if (ind[i].data.idtipocodificador != idtipocod) {
            aux = [ind[i].id, ind[i].data.idarbol, ind[i].data.ordenizq, ind[i].data.ordender];
            vind.push(aux);
        }
    }
    Ext.Ajax.request({
        url: 'validarAsociacion',
        params: {
            indicadores: Ext.encode(vind),
            idtipoc: idtipocod
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg != 23)
                Asociar();
            else {
                iddelet = responseData.iddatoscod;
                idind = responseData.idindicador;
                Ext.MessageBox.confirm('Confirm', 'Existen , quiere actualizarlos?', accion);
            }
        }
    });
}

function accion(btn) {
    if (btn == 'yes')
        Asociar();
}

function Asociar() {
    if (GpAsociarcodif.getSelectionModel().getSelected() != undefined && GpCodificadores.getSelectionModel().getSelected() != undefined) {
        mymask.show();
        ind = checkCAsociarcodif.getSelections();
        cod = checkCCodificadores.getSelected();
        vind = [];
        for (i = 0; i < ind.length; i++) {
            if (ind[i].data.idtipocodificador != idtipocod) {
                aux = [ind[i].id, ind[i].data.idarbol, ind[i].data.ordenizq, ind[i].data.ordender];
                vind.push(aux);
            }
        }
        Ext.Ajax.request({
            url: 'asociar',
            params: {
                indicadores: Ext.encode(vind),
                iddatcodificador: cod.id,
                accion: 'asociar',
                idtipoc: idtipocod,
                iddelet: Ext.encode(iddelet),
                idind: Ext.encode(idind)
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    if (ind.length == 1) {
                        mostrarMensaje(1, 'El indicador ha sido asociado satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'Los indicadores han sido asociados satisfactoriamente.');
                    }
                    if (checkCAsociarcodif.getSelected().data.nivelarbol > 1) {
                        anode = null;//checkCAsociarcodif.getSelected().data.idpadre;
                        checkCAsociarcodif.clearSelections();
                        //stGpAsociarcodif.removeAll();
                        stGpAsociarcodif.reload({
                            params: {
                                anode: anode
                            }
                        });
                    } else {
                        checkCAsociarcodif.clearSelections();
                        stGpAsociarcodif.load({
                            params: {
                                anode: anode
                            }
                        });
                    }
                }
            }
        });
    } else
        mostrarMensaje(3, 'Debe seleccionar al menos un indicador y un codificador')
}

function validar() {
    ind = checkCAsociarcodif.getSelections();
    cod = checkCCodificadores.getSelected();
    contAsociados = 0;
    contNoAsociados = 0;
    check = false;
    for (i = 0; i < ind.length; i++) {
        if (ind[i].data.idtipocodificador == idtipocod) {
            check = true;
            contAsociados++;
            //break;
        } else {
            contNoAsociados++;
        }
    }
    if (check) {
        btnAsoc.disable();
        return true;
    } else if (cod != undefined && ((contAsociados == 0 && contNoAsociados != 0) || (contAsociados != 0 && contNoAsociados == 0))) {
        btnAsoc.enable();
        return false;
    }
    if (checkCAsociarcodif.getSelected() != undefined && checkCCodificadores.getSelected() != undefined) {
        btnDesasociar.disable();
    } else {
        btnDesasociar.enable();
    }

}

function elimarAsociacion() {
    if (GpAsociarcodif.getSelectionModel().getSelected() != undefined) {
        mymask.show();
        ind = checkCAsociarcodif.getSelections();
        vind = [];
        for (i = 0; i < ind.length; i++) {
            if (ind[i].data.asociado != null) {
                aux = [ind[i].id, ind[i].data.idarbol, ind[i].data.ordenizq, ind[i].data.ordender];
                vind.push(aux);
            }
        }
        Ext.Ajax.request({
            url: 'asociar',
            params: {
                indicadores: Ext.encode(vind),
                idtipoc: idtipocod,
                accion: 'delasociacion'
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    if (ind.length == 1) {
                        mostrarMensaje(1, 'El indicador ha sido desasociado satisfactoriamente.');
                    } else {
                        mostrarMensaje(1, 'Los indicadores han sido desasociados satisfactoriamente.');
                    }
                    if (checkCAsociarcodif.getSelected().data.nivelarbol > 1) {
                        anode = checkCAsociarcodif.getSelected().data.idpadre;
                        checkCAsociarcodif.clearSelections();
                        stGpAsociarcodif.reload({
                            params: {
                                anode: anode
                            }
                        });
                        //stGpAsociarcodif.reload();
                    } else {
                        checkCAsociarcodif.clearSelections();
                        stGpAsociarcodif.reload();
                    }
                }
            }
        });
    }
}

function Habilitarbtn(sm) {
    if (checkCCodificadores.getSelected() != undefined && checkCAsociarcodif.getSelected() != undefined && checkCAsociarcodif.getSelected().data.idtipocodificador == "" && ((contAsociados == 0 && contNoAsociados != 0) || (contAsociados != 0 && contNoAsociados == 0))) {
        btnAsoc.enable();
        btnDesasociar.disable();
    } else if (checkCCodificadores.getSelected() != undefined && checkCAsociarcodif.getSelected() != undefined && checkCAsociarcodif.getSelected().data.idtipocodificador != "") {
        btnAsoc.disable();
        btnDesasociar.enable();
    } else if (checkCAsociarcodif.getSelected() != undefined) {
        if (checkCAsociarcodif.getSelected().data.idtipocodificador != "" && checkCAsociarcodif.getSelected() != undefined && checkCCodificadores.getSelected() != undefined) {
            btnAsoc.disable();
            btnDesasociar.enable();
        } else {
            btnAsoc.disable();
            btnDesasociar.disable();
        }
        if (checkCAsociarcodif.getSelected().data.idtipocodificador == "" && checkCCodificadores.getSelected() != undefined && ((contAsociados == 0 && contNoAsociados != 0) || (contAsociados != 0 && contNoAsociados == 0))) {
            btnAsoc.enable();
            btnDesasociar.disable();
        }
    } else {
        btnAsoc.disable();
        btnDesasociar.disable();
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function siexisteIndicadores() {
    if (filtrosIndicadores.getFiltrosActivos().length > 0 && stGpAsociarcodif.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function siexisteCodificadores() {
    if (filtrosCodificadores.getFiltrosActivos().length > 0 && stGpCodificadores.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

//function mostrarAyuda(referencia, title) {
//    var title = 'Correlacionador de productos';
//    var referencia = 'Correlacionador';
//    help.show(title, referencia);
//}


