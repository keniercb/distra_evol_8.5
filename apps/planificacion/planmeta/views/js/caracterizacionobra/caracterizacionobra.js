/*caracterizacionobra.js
 * Vista para caracterizar las Obras
 * @author: Dernys Méndez Montero
 * @package: Plataforma Integral de Planificacion
 * @subpackage: 
 * @copyright: 
 * @version: 1.0-0
 */

var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
//***************variables****************
var gpObra;
var btnAdicionar, btnEliminar, btnAyuda, btnLimpiar;
var cbProv, cbProg, cbInvDir, cbInvPrinc, cbOrg, cbFFin;
var filtrosObra, stGpObra, tPEntidades, cmGpObras;
var idRootNode = null, identidadselected = null;
var idEstructuraPadre, entidades_productoras;
//Cargar la funcion inicial
UCID.portal.cargarEtiquetas('caracterizacionobra', cargarInterfaz);
objci = {};
objci.acciones = [];


function cargarInterfaz() {


    //Creo mi espacio de trabajo
    Ext.namespace('Ext.caracterizacionobra');

    //Declarar Las funciones


    Ext.caracterizacionobra.dameValueField = function(store, value, campoDispField, campoValueF) {

        for (var i = 0; i < store.getCount(); i++)
            if (eval('store.getRange(0,store.getCount()-1)[i].data.' + campoDispField) == value)
                return eval('store.getRange(0,store.getCount()-1)[i].data.' + campoValueF);
        return ((value != null && value != '')) ? value : '<div style="text-align: center;background-color:cyan;">PENDIENTE</div>';

    };

    Ext.caracterizacionobra.setTituloFiltrar = function(panel) {
        var filtrado_por = "";
        var sep = "/";
        if (filtrosObra.getFiltrosActivos() == undefined || filtrosObra.getFiltrosActivos().length == 0) {
            panel.setTitle(perfil.etiquetas.titObra);
        } else {
            for (i = 0; i < filtrosObra.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtrosObra.getFiltrosActivos()[i].dataIndex == "den") {//
                    aux = perfil.etiquetas.lbDenominacion;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "cod") {//
                    aux = perfil.etiquetas.lbCodigo;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "ffin") {//
                    aux = perfil.etiquetas.lbFF;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "invp") {//
                    aux = perfil.etiquetas.lbInvPrinc;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "invd") {
                    aux = perfil.etiquetas.lbInvDirect;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "orgc") {
                    aux = perfil.etiquetas.lbOrgConst;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "prog") {
                    aux = perfil.etiquetas.lbPrograma;
                } else if (filtrosObra.getFiltrosActivos()[i].dataIndex == "prov") {
                    aux = perfil.etiquetas.lbProvincia;
                }

                if (i == filtrosObra.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            panel.setTitle(perfil.etiquetas.titObra + ' / ' + perfil.etiquetas.lbFiltradoPor + filtrado_por);
            filtrado_por = "";
        }
    };
    //LIMPIAR FILTROS
    function limpiarFiltros() {
        if (gpObra.getStore().getCount() > 0) {
            stGpObra.removeAll();
        }
        else
        {
            Ext.MessageBox.show({
                title: 'Información',
                buttons: Ext.MessageBox.OK,
                msg: 'No existen elementos listados.',
                icon: Ext.MessageBox.INFO
            });
        }
    }

    //********** Inicio del GridPanel de Obras **********
    Ext.caracterizacionobra.gpObras = Ext.extend(Ext.grid.EditorGridPanel, {
        initComponent: function() {
            var self = this;
            self.id = 'GPanel';
            self.title = perfil.etiquetas.titObra;


            //Boton para Adicionar una Obra a Caracterizar
            btnAdicionar = new Ext.Button({
                text: perfil.etiquetas.lbBtnAdicionar1,
                tooltip: perfil.etiquetas.lbBtnAdicionar + '  <b>(Alt+I)</b>',
                disabled: true,
                id: 'btnAdicionar',
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                handler: function() {


                    self.adicionarObra();

                    Ext.getBody().mask(perfil.etiquetas.msgEspere);
                }
            });

            //Boton para Eliminar una Obra a Caracterizar
            btnEliminar = new Ext.Button({
                text: perfil.etiquetas.lbBtnEliminar1,
                tooltip: perfil.etiquetas.lbBtnEliminar + '  <b>(DEL)</b>',
                disabled: true,
                id: 'btnEliminar',
                icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'btn',
                handler: function() {
                    self.eliminarObra();
                }
            });

            //Boton para Guardar las Obras Modificadas o Adicionadas
            btnGuardar = new Ext.Button({
                text: perfil.etiquetas.lbBtnGuardar,
                icon: perfil.dirImg + 'guardar.png',
                iconCls: 'btn',
                tooltip: perfil.etiquetas.lbBtnGuardar + '  <b>(Alt+G)</b>',
                handler: function() {
                    self.adicionarObra(1);
                }
            });

            //Boton Limpiar Flitros
            btnLimpiar = new Ext.Button({
                text: perfil.etiquetas.lbBtnLimpiar,
                tooltip: perfil.etiquetas.lbTtBtnLimpiar,
                icon: perfil.dirImg + 'limpiar.png',
                iconCls: 'btn',
                handler: function() {
                    limpiarFiltros();
                }

            });


            //Bara superior del GridPanel
            self.tbar = [btnAdicionar, btnEliminar, btnGuardar];


            //*********Inicio del Store del GridPanel de Obra
            stGpObra = new Ext.data.Store({
                url: 'listarObras',
                listeners: {
                    beforeload: function(st) {
                        this.baseParams.filtros = Ext.encode(filtrosObra.getFilterData());
                        this.baseParams.start = 0;
                        st.commitChanges();
                        Ext.caracterizacionobra.setTituloFiltrar(self);
                    },
                    load: function() {
                        if (stGpObra.getCount() == 0) {
                            stGpObra.removeAll();

                        }
                        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
                    }
                },
                reader: new Ext.data.JsonReader({
                    totalProperty: "total",
                    root: "data",
                    id: "idobra"
                }, [{
                        name: 'idobra'
                    }, {
                        name: 'ident'
                    },
                    {
                        name: 'cod'
                    },
                    {
                        name: 'den'
                    },
                    {
                        name: 'desc'
                    },
                    {
                        name: 'invp'
                    },
                    {
                        name: 'invd'
                    },
                    {
                        name: 'orgc'
                    },
                    {
                        name: 'prog'
                    },
                    {
                        name: 'prov'
                    },
                    {
                        name: 'ffin'
                    },
                    {
                        name: 'obj'
                    },
                    {
                        name: 'muestra'
                    },
                    {
                        name: 'fecha'
                    }
                ])
            });
            //##########Fin del Store del GridPanel de Obra


            //******** ComboBox para editar en el ColumnModel
            cbOrg = new Ext.ux.form.LovCombo({
                displayField: 'denominacionnom',
                valueField: 'iddatosnomenclador',
                triggerAction: 'all',
                readOnly: true,
                minListWidth: 200,
                mode: 'local',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: new Ext.data.Store({
                    url: 'listarNomenclador',
                    autoLoad: true,
                    baseParams: {
                        t: 'organoconstructor'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'data'
                    }, [{
                            name: 'denominacionnom'
                        }, {
                            name: 'iddatosnomenclador'
                        }])
                })
            });

            cbInvPrinc = new Ext.ux.form.LovCombo({
                displayField: 'denominacionnom',
                valueField: 'iddatosnomenclador',
                triggerAction: 'all',
                readOnly: true,
                minListWidth: 200,
                mode: 'local',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: new Ext.data.Store({
                    url: 'listarNomenclador',
                    autoLoad: true,
                    baseParams: {
                        t: 'inversionistaprincipal'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'data'
                    }, [{
                            name: 'denominacionnom'
                        }, {
                            name: 'iddatosnomenclador'
                        }])
                })
            });

            cbInvDir = new Ext.ux.form.LovCombo({
                displayField: 'denominacionnom',
                valueField: 'iddatosnomenclador',
                triggerAction: 'all',
                readOnly: true,
                minListWidth: 200,
                mode: 'local',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: new Ext.data.Store({
                    url: 'listarNomenclador',
                    autoLoad: true,
                    baseParams: {
                        t: 'inversionistadirecto'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'data'
                    }, [{
                            name: 'denominacionnom'
                        }, {
                            name: 'iddatosnomenclador'
                        }])
                })
            });

            cbFFin = new Ext.ux.form.LovCombo({
                displayField: 'denominacionnom',
                valueField: 'iddatosnomenclador',
                triggerAction: 'all',
                readOnly: true,
                minListWidth: 200,
                mode: 'local',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: new Ext.data.Store({
                    url: 'listarNomenclador',
                    autoLoad: true,
                    baseParams: {
                        t: 'fuentefinanciamiento'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'data'
                    }, [{
                            name: 'denominacionnom'
                        }, {
                            name: 'iddatosnomenclador'
                        }])
                })
            });

            cbProg = new Ext.form.ComboBox({
                displayField: 'denominacionnom',
                valueField: 'iddatosnomenclador',
                triggerAction: 'all',
                readOnly: true,
                minListWidth: 200,
                mode: 'local',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: new Ext.data.Store({
                    url: 'listarNomenclador',
                    autoLoad: true,
                    baseParams: {
                        t: 'programa'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'data'
                    }, [{
                            name: 'denominacionnom'
                        }, {
                            name: 'iddatosnomenclador'
                        }])
                })
            });

            cbProv = new Ext.form.ComboBox({
                displayField: 'denominacionnom',
                valueField: 'iddatosnomenclador',
                triggerAction: 'all',
                readOnly: true,
                minListWidth: 200,
                mode: 'local',
                emptyText: perfil.etiquetas.lbSeleccione,
                store: new Ext.data.Store({
                    url: 'listarNomenclador',
                    autoLoad: true,
                    listeners: {
                        load: function() {
                            Ext.getBody().unmask();
                            stGpObra.load({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                        }
                    },
                    baseParams: {
                        t: 'provincia'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'data'
                    }, [{
                            name: 'denominacionnom'
                        }, {
                            name: 'iddatosnomenclador'
                        }])
                })
            });
            //******** Fin de ComboBox para editar en el ColumnModel



            //ColumnModel de Obras
            cmGpObras = new Ext.grid.ColumnModel([
                {
                    header: perfil.etiquetas.lbCodigo,
                    renderer: function(v) {
                        return (v != null && v != '') ? v : '<div style="text-align: center;background-color:cyan;">PENDIENTE</div>';
                    },
                    dataIndex: 'cod',
                    tooltip: 'Código',
                    renderer:crearToolTip,
                            sortable: true,
                    editor: new Ext.form.TextField({
                        width: 100,
                        maskRe: /^[0-9]+$/,
                        regex: /^[0-9]+$/
                    })
                }, {
                    header: perfil.etiquetas.lbDenominacion,
                    dataIndex: 'den',
                    tooltip: 'Denominación',
                    renderer: crearToolTip,
                    sortable: true,
                    width: 150
                }, {
                    header: perfil.etiquetas.lbDescripcion,
                    tooltip: 'Descripción',
                    renderer: function(v, m) {
                        m.attr = 'ext:qtip="' + v + '"';
                        return (v != null && v != '') ? v : '<div style="text-align: center;background-color:cyan;">PENDIENTE</div>';
                    },
                    dataIndex: 'desc',
                    width: 150,
                    editor: new Ext.form.TextField({})
                }, {
                    header: perfil.etiquetas.lbFF,
                    renderer: self.getRawValue,
                    dataIndex: 'ffin',
                    tooltip: 'Fuente de Financiamiento',
                    renderer:crearToolTip,
                            sortable: true,
                    width: 150,
                    editor: cbFFin
                }, {
                    header: perfil.etiquetas.lbInvPrinc,
                    renderer: self.getRawValue,
                    sortable: true,
                    tooltip: 'Inversionista Principal',
                    dataIndex: 'invp',
                    width: 150,
                    editor: cbInvPrinc
                }, {
                    header: perfil.etiquetas.lbInvDirect,
                    renderer: self.getRawValue,
                    dataIndex: 'invd',
                    tooltip: 'Inversionista Directo',
                    sortable: true,
                    width: 150,
                    editor: cbInvDir
                }, {
                    header: perfil.etiquetas.lbOrgConst,
                    renderer: self.getRawValue,
                    sortable: true,
                    tooltip: 'Órgano Constructor',
                    dataIndex: 'orgc',
                    width: 150,
                    editor: cbOrg
                }, {
                    header: perfil.etiquetas.lbPrograma,
                    renderer: self.getRawValue,
                    dataIndex: 'prog',
                    tooltip: 'Programa',
                    sortable: true,
                    width: 150,
                    editor: cbProg
                }, {
                    header: perfil.etiquetas.lbProvincia,
                    renderer: self.getRawValueProv,
                    dataIndex: 'prov',
                    tooltip: 'Provincia',
                    sortable: true,
                    width: 150,
                    editor: cbProv
                }, {
                    header: perfil.etiquetas.lbObjFisico,
                    dataIndex: 'obj',
                    tooltip: 'Objeto Físico',
                    editor: new Ext.form.TextArea({}),
                    renderer: function(v) {
                        return (v != null && v != '') ? v : '<div style="text-align: center;background-color:cyan;">PENDIENTE</div>';
                    }
                }]);
            self.cm = cmGpObras;
            //Fin del ColumnModel de Obras


            //*********Inicio Filtros de GridPanel Obras
            Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
            filtrosObra = new Ext.grid.GridFilters({
                filters: [
                    {
                        type: 'string',
                        dataIndex: 'cod'
                    },
                    {
                        type: 'string',
                        dataIndex: 'den'
                    },
                    {
                        type: 'string',
                        dataIndex: 'desc'
                    },
                    {
                        type: 'listado',
                        dataIndex: 'invp',
                        idcombo: 'idcmbinvp',
                        urlcb: 'listarNomencladorInvPrincipal',
                        idstore: 'idstinvp',
                        valueFieldcb: 'iddatosnomenclador',
                        displayFieldcb: 'denominacionnom'

                    },
                    {
                        type: 'listado',
                        dataIndex: 'invd',
                        idcombo: 'idcmbinvd',
                        urlcb: 'listarNomencladorInvDirecto',
                        idstore: 'idstinvd',
                        valueFieldcb: 'iddatosnomenclador',
                        displayFieldcb: 'denominacionnom'
                    },
                    {
                        type: 'listado',
                        dataIndex: 'orgc',
                        idcombo: 'idcmborgc',
                        urlcb: 'listarNomencladorOrgano',
                        idstore: 'idstorgc',
                        valueFieldcb: 'iddatosnomenclador',
                        displayFieldcb: 'denominacionnom'
                    },
                    {
                        type: 'listado',
                        dataIndex: 'prog',
                        idcombo: 'idcmbprog',
                        urlcb: 'listarNomencladorPrograma',
                        idstore: 'idstprog',
                        valueFieldcb: 'iddatosnomenclador',
                        displayFieldcb: 'denominacionnom'
                    },
                    {
                        type: 'listado',
                        dataIndex: 'prov',
                        idcombo: 'idcmbprov',
                        urlcb: 'listarNomencladorProvincia',
                        idstore: 'idstprov',
                        valueFieldcb: 'iddatosnomenclador',
                        displayFieldcb: 'denominacionnom'
                    },
                    {
                        type: 'listado',
                        dataIndex: 'ffin',
                        idcombo: 'idcmbffin',
                        urlcb: 'listarNomencladorFFinanciamiento',
                        idstore: 'idstffin',
                        valueFieldcb: 'iddatosnomenclador',
                        displayFieldcb: 'denominacionnom'
                    },
                    {
                        type: 'string',
                        dataIndex: 'obj'
                    },
                    {
                        type: 'string',
                        dataIndex: 'muestra'
                    },
                    {
                        type: 'string',
                        dataIndex: 'fecha'
                    }
                ]
            });

            // Selection Model del GridPanel de Obra
            smGpGestObra = new Ext.grid.RowSelectionModel({});
            self.store = stGpObra;
            self.sm = smGpGestObra;
            self.clicksToEdit = 2;
            self.frame = true;
            self.plugins = filtrosObra;
            self.loadMask = {
                store: stGpObra
            };
            self.bbar = new Ext.PagingToolbar({
                pageSize: 20,
                store: stGpObra,
                displayInfo: true,
                items: [btnLimpiar]
            });


            Ext.caracterizacionobra.gpObras.superclass.initComponent.call(this, arguments);

      },
        adicionarObra: function(add) {
            arrObras = [];
            //caso 1 modificar en el grid caso 2 add del arbol
            switch (add) {
                case 1:
                    if (gpObra.getStore().getModifiedRecords().length > 0) {
                        recmod = gpObra.getStore().getModifiedRecords();
                        arrObras = [];
                        for (var i = 0; i < recmod.length; i++) {
                            arrObras[i] = recmod[i].getChanges();
                            arrObras[i].idobra = recmod[i].data.idobra;
                        }
                    }

                    break;
                default:
                    if (identidadselected != null && is_leaf) {
                        arrObras.push({
                            ent: identidadselected
                        })
                    } else {
                        return 0;
                    }
                    break;
            }
            if (arrObras.length > 0) {
                Ext.getBody().mask(perfil.etiquetas.msgEspere);
                Ext.Ajax.request({
                    url: 'adicionarModificarObra',
                    params: {
                        obras: Ext.encode(arrObras)
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        if (responseData.codMsgA == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgAdicionado);
                            gpObra.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                        }
                    }
                });
            }
            return 0;
        },
        getRawValueProv: function(v) {
            st = cbFFin.store;
            var arrid = (v != null) ? v.split(",") : '';
            if (arrid[0] == 'Array') {
                var xarrid = new Array(1);
                xarrid[0] = '';
                arrid = xarrid;
            } else {
                var xarrid = new Array(1);
                xarrid[0] = arrid[0];
                arrid = xarrid;
            }
            var str = '';
            st = cmGpObras.getColumnById(cmGpObras.getColumnId(arguments[4])).editor.field.store;
            str += Ext.caracterizacionobra.dameValueField(st, arrid[0], 'iddatosnomenclador', 'denominacionnom');
            for (var j = 1; j < arrid.length; j++) {
                str += ', ' + Ext.caracterizacionobra.dameValueField(st, arrid[j], 'iddatosnomenclador', 'denominacionnom');
            }
            return str;
        },
        getRawValue: function(v) {
            st = cbFFin.store;
            var arrid = (v != null) ? v.split(",") : '';
            if (arrid[0] == 'Array') {
                var xarrid = new Array(1);
                xarrid[0] = '';
                arrid = xarrid;
            }
            var str = '';
            st = cmGpObras.getColumnById(cmGpObras.getColumnId(arguments[4])).editor.field.store;
            str += Ext.caracterizacionobra.dameValueField(st, arrid[0], 'iddatosnomenclador', 'denominacionnom');
            for (var j = 1; j < arrid.length; j++) {
                str += ', ' + Ext.caracterizacionobra.dameValueField(st, arrid[j], 'iddatosnomenclador', 'denominacionnom');
            }
            return str;
        },
        eliminarObra: function() {
            mostrarMensaje(2, perfil.etiquetas.msgConfDel, elimina);
            function elimina(btnPresionado) {
                if (gpObra.getSelectionModel().getSelections().length > 0) {
                    recmod = gpObra.getSelectionModel().getSelections();
                    arrObras = [];
                    for (var i = 0; i < recmod.length; i++)
                        arrObras[i] = recmod[i].data.idobra;
                    if (btnPresionado == 'ok') {
                        Ext.getBody().mask(perfil.etiquetas.msgEspere);
                        Ext.Ajax.request({
                            url: 'eliminarObra',
                            params: {
                                obras: Ext.encode(arrObras)
                            },
                            callback: function(options, success, response) {
                                Ext.getBody().unmask();
                                responseData = Ext.decode(response.responseText);
                                if (responseData.codMsgE == 1) {
                                    stGpObra.reload({
                                        params: {
                                            start: 0,
                                            limit: 20
                                        }
                                    });
                                    mostrarMensaje(1, perfil.etiquetas.msgEliminada)
                                }
                            }
                        });
                    }

                    return 0;
                } else {
                }
            }}
        ,
        getRawValueProv: function(v) {
            st = cbFFin.store;
            var arrid = (v != null) ? v.split(",") : '';
            if (arrid[0] == 'Array') {
                var xarrid = new Array(1);
                xarrid[0] = '';
                arrid = xarrid;
            } else {
                var xarrid = new Array(1);
                xarrid[0] = arrid[0];
                arrid = xarrid;
            }
            var str = '';
            st = cmGpObras.getColumnById(cmGpObras.getColumnId(arguments[4])).editor.field.store;
            str += Ext.caracterizacionobra.dameValueField(st, arrid[0], 'iddatosnomenclador', 'denominacionnom');
            for (var j = 1; j < arrid.length; j++) {
                str += ', ' + Ext.caracterizacionobra.dameValueField(st, arrid[j], 'iddatosnomenclador', 'denominacionnom');
            }
            return str;
        },
                getRawValue: function(v) {
            st = cbFFin.store;
            var arrid = (v != null) ? v.split(",") : '';
            if (arrid[0] == 'Array') {
                var xarrid = new Array(1);
                xarrid[0] = '';
                arrid = xarrid;
            }
            var str = '';
            st = cmGpObras.getColumnById(cmGpObras.getColumnId(arguments[4])).editor.field.store;
            str += Ext.caracterizacionobra.dameValueField(st, arrid[0], 'iddatosnomenclador', 'denominacionnom');
            for (var j = 1; j < arrid.length; j++) {
                str += ', ' + Ext.caracterizacionobra.dameValueField(st, arrid[j], 'iddatosnomenclador', 'denominacionnom');
            }
            return str;
        },
                eliminarObra: function() {
            mostrarMensaje(2, perfil.etiquetas.msgConfDel, elimina);
            function elimina(btnPresionado) {
                if (gpObra.getSelectionModel().getSelections().length > 0) {
                    recmod = gpObra.getSelectionModel().getSelections();
                    arrObras = [];
                    for (var i = 0; i < recmod.length; i++)
                        arrObras[i] = recmod[i].data.idobra;
                    if (btnPresionado == 'ok') {
                        Ext.getBody().mask(perfil.etiquetas.msgEspere);
                        Ext.Ajax.request({
                            url: 'eliminarObra',
                            params: {
                                obras: Ext.encode(arrObras)
                            },
                            callback: function(options, success, response) {
                                Ext.getBody().unmask();
                                responseData = Ext.decode(response.responseText);
                                if (responseData.codMsgE == 1) {
                                    stGpObra.reload({
                                        params: {
                                            start: 0,
                                            limit: 20
                                        }
                                    });
                                    mostrarMensaje(1, perfil.etiquetas.msgEliminada)
                                }
                            }
                        });
                    }
                }
            }
        }

    });

    //*********Inicio del TreePanel para las Entidades*********
    Ext.caracterizacionobra.tPEntidades = Ext.extend(Ext.tree.TreePanel, {
        autoScroll: true,
        height: 200,
        layout: 'fit',
        border: false,
        rootVisible: false,
        listeners: {
            click: function(n) {
                this.getSelectionModel().select(n);
                identidadselected = n.id;
                idEstructuraPadre = n.attributes.idEstructuraPadre;
                entidades_productoras = n.attributes.entidades_productoras;
                is_leaf = n.leaf;

                if (is_leaf) {

                    btnAdicionar.setDisabled(false);

                    gpObra.resumeEvents();
                } else {
                    btnAdicionar.setDisabled(true);
                    gpObra.suspendEvents();

                }
                gpObra.getStore().baseParams.identidad = identidadselected;
                gpObra.getStore().reload();

            }
        },
        initComponent: function() {
            var self = this;

            //Bara superior del Tree Panel
            self.tbar = [{
                    iconCls: 'icon-expand-all',
                    tooltip: perfil.etiquetas.lbExpandirEnt,
                    icon: perfil.dirImg + 'expand-all.gif',
                    handler: function() {
                        self.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: perfil.etiquetas.lbColapsarEnt,
                    icon: perfil.dirImg + 'collapse-all.gif',
                    handler: function() {
                        self.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: perfil.etiquetas.lbRefrescarEnt,
                    icon: perfil.dirImg + 'table_refresh.png',
                    handler: function() {
                        self.actualizarArbol(self);
                    }
                }, '-', {
                    xtype: 'textfield',
                    emptyText: perfil.etiquetas.lbFiltrarEnt,
                    width: 110,
                    id: 'idfiltroent',
                    listeners: {
                        specialkey: function(t, e) {
                            if (e.getKey() == '13') {
                                self.buscarNodo(self);
                            }
                        }
                    }
                }];



            self.root = new Ext.tree.AsyncTreeNode({
                text: perfil.etiquetas.lbEntidades,
                tipo: 0,
                id: '0'
            });

            self.loader = new Ext.tree.TreeLoader({
                dataUrl: 'cargarEntidades',
                preloadChildren: false,
                listeners: {
                    beforeload: function(tree, node, res) {
                        tree.baseParams.valor = Ext.getCmp('idfiltroent').getValue();
                        tree.baseParams.idEstructuraPadre = node.attributes.idEstructuraPadre;
                    }
                }
            });



            Ext.caracterizacionobra.tPEntidades.superclass.initComponent.call(this, arguments);
        },
        buscarNodo: function(arbol, valor) {


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


        },
        fnContextMenu: function(node, e) {
            //clik secundario
            node.select();
            identidadselected = node.id;
            idEstructuraPadre = node.attributes.idEstructuraPadre;
            entidades_productoras = node.attributes.entidades_productoras;

            todos = true;
            is_leaf = node.leaf;
            if (!node.leaf) {
                Ext.getCmp('btnCopiarNiveles').enable();
                Ext.getCmp('btnPegarNiveles').disable();
                Ext.getCmp('btnCopiarNiveles').hide();
                Ext.getCmp('btnPegarNiveles').hide();
            } else {
                Ext.getCmp('btnPegarNiveles').show();
                Ext.getCmp('btnCopiarNiveles').show();
            }
            if (identidadselected == identidadorigen) {
                Ext.getCmp('btnCopiarNiveles').enable();
                Ext.getCmp('btnPegarNiveles').disable();
            }
            if (esrector) {
                Ext.getCmp('btnCopiarNiveles').hide();
                Ext.getCmp('btnPegarNiveles').hide();
            }
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            c.showAt(e.getXY());
        },
        fnClick: function(n) {

            trEnt.getSelectionModel().select(n);
            identidadselected = n.id;
            idEstructuraPadre = n.attributes.idEstructuraPadre;
            entidades_productoras = n.attributes.entidades_productoras;
            is_leaf = n.leaf;

            if (is_leaf) {
                gpNivActividad.resumeEvents();
            } else {
                gpNivActividad.suspendEvents();
            }
            gpNivActividad.getStore().reload();
        }

    });

    //********* Fin del TreePanel para las Entidades*********


    //Ejemplo de Panel
    Ext.caracterizacionobra.MiPanel = Ext.extend(Ext.Panel, {
        layout: 'border',
        initComponent: function() {
            var self = this;

            btnAyuda = new Ext.Button({
                text: perfil.etiquetas.lbBtnAyuda,
                tooltip: perfil.etiquetas.lbBtnAyuda,
                id: 'btnAyuda',
                icon: perfil.dirImg + 'ayuda.png',
                iconCls: 'btn',
                handler: function() {
                }
            });


            self.tbar = ['->', {
                    icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'btn',
                    tooltip: 'Mostrar ayuda de la funcionalidad  <b>(Alt + H)</b>',
                    text: 'Ayuda',
                    handler: function(opcion) {
                        mostrarAyuda();
                    }
                }];

            gpObra = new Ext.caracterizacionobra.gpObras();
            tPEntidades = new Ext.caracterizacionobra.tPEntidades();



            self.items = [{
                    xtype: 'panel',
                    title: 'Entidades',
                    id: 'pMultiEnt',
                    region: 'west',
                    width: 220,
                    frame: false,
                    layout: 'fit',
                    collapsible: true,
                    titleCollapse: true,
                    split: true,
                    items: [tPEntidades]
                }, {
                    xtype: 'panel',
                    // title : 'Datos',
                    id: 'pDatos',
                    region: 'center',
                    frame: false,
                    layout: 'fit',
                    items: [gpObra]
                }];

            Ext.caracterizacionobra.MiPanel.superclass.initComponent.call(this, arguments);
        },
        //Crear otras funciones
        OtraFuncion: function() {
        }


    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii', //adicionar
            alt: true,
            fn: function() {
                gpObra.adicionarObra(1);
            }
        },
        {
            key: 'Hh',
            alt: true,
            fn: function() {
                mostrarAyuda();
            }

        },
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                limpiarFiltros();
            }


        }


    ]);


    //Mostrar el Panel en un Contenedor
    mpanel = new Ext.caracterizacionobra.MiPanel();
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [mpanel]
    });

    gpObra.getSelectionModel().on('rowselect', function(smodel, rowIndex, keepExisting, record) {
        btnEliminar.enable();
    }, self);


}
function mostrarAyuda(referencia, title) {
    var title = perfil.etiquetas.lbTituloAyudaGestionObras;
    var referencia = 'Gestión de Obras';//esto puede ser el id del boton o cualquier cosa 
    help.show(title, referencia);
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

