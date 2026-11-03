/*
 * Componente para gestinar los niveles estructurales .
 * 
 * @package configsecodena 
 * @copyright UCID Cuba 
 * @author Livan A Capote Valdes 
 * @version 1.0-0
 */
if (!perfil)
    perfil = window.parent.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gestnivelestructural', cargarInterfaz);
var etiquetasEst = {};
Ext.QuickTips.init();
function cargarInterfaz(perfil, etiquetas) {
    etiquetasEst = etiquetas;
    var idconceptoestructural = (window.parent.idconceptoestructural)
        ? window.parent.idconceptoestructural
        : "";

    actionValidate.validate();

    var isOpenW = false;
    var grid_estructura; // usada para crear grid

    var sm_estructura;

    var apl = false;

    var col_estructura, denominacion, st_estructura, url_tablas, sm_relaciones, col_relaciones,
        st_relaciones, idtabla, title, base, Nro_fila, bt_AdicionarEav, bt_ModificarEav, winKeyMap;
    var action = 'adicionar';

    var rf_estructura = "Tablas"; // guarda parate de la url

    var grid_relaciones; // usada para crear grid

    var row = -1;

    var rf_relaciones = "conexiones";


    var rec, recRe, rowLevelElementIndex = null;


    var idtablaDoubleClickItem = null;

    var grid_habilitado = false;

    var bt_EliminarEav, bt_GestionarCampos, wn_FormEst, wn_GdCampos, fm_Tablas;
    var keysPressed = new Object();
    a = {
        A: '', I: ''
    };
//    document.onkeydown = document.onkeyup=(function(e) {
//        e = e || event;
//         switch (e.keyCode){
//             case 65:
//                 keysPressed["A"] = e.type=="keydown";
//                 break;
//             case 73:
//                 keysPressed["I"]= e.type=="keydown";
//                 break;
//         }
//         
////        if (e.keyCode == 65 || e.keyCode == 73) {
////            keysPressed["" + e.keyCode + ""] = e.type=="keydown";
////        }
//    });

//    document.onkeyup= (function(e) {
//        
//        e = e || event;
//        if (e.keyCode == 65 || e.keyCode == 73) {
//            keysPressed["" + e.keyCode + ""] = false;
//        }
//    });

    map_ne = new Ext.KeyMap(document, [
        {
            key: 'i',
            alt: true,
            fn: function () {
                var btn = bt_AdicionarEav;
                if (isOpenW == false && !btn.hidden) {
                    btn.handler.call();

                }
            }

        },
        {
            key: 'i',
            ctrl: true,
            fn: function () {
                var btn = bt_AdicionarRe;
                if (isOpenW == false && grid_relaciones.disabled == false && !btn.hidden)
                    btn.handler.call();
            }
        }, {
            key: 'm',
            alt: true,
            fn: function () {
                var btn = bt_ModificarEav;
                if (isOpenW == false && !btn.hidden) {
                    if (sm_estructura.hasSelection())
                        btn.handler.call();

                }
            }
        }, {
            key: Ext.EventObject.DELETE,
            fn: function () {
                var btn = bt_EliminarEav;
                if (isOpenW == false && Ext.EventObject.ctrlKey != 1 && !btn.hidden) {
                    if (sm_estructura.hasSelection())
                        btn.handler.call();

                }
            }
        }, {
            key: Ext.EventObject.DELETE,
            ctrl: true,
            fn: function () {
                var btn = bt_EliminarRe;
                if (isOpenW == false && !grid_relaciones.disabled && !btn.disabled && !btn.hidden)
                    btn.handler.call();
            }

        }/*,
        {
            key: "h",
            alt: true,
            fn: function () {
                cargarAyuda();
            }
        }*/

    ]);
    // los
    /*----------------------------------------------------------------------------*/

    /*--------------------------El ProgressBar------------------------------------*/
    var pbLoad = new Ext.ProgressBar({
        text: etiquetasEst.msgCargando,
        id: 'pbar2',
        cls: 'custom'
    });
    /*----------------------------------------------------------------------------*/
    /*-----------------La ventana  que tiene el ProgressBar-----------------------*/
    var wnLoad = new Ext.Window({
        title: etiquetasEst.msgCargando,
        layout: 'fit',
        width: 300,
        height: 50,
        closable: false,
        constrain:true,
        resizable: false,
        modal: true,
        items: [pbLoad],
        closeAction: 'hide',
        listeners: {
            show: function () {
                pbLoad.text = 'Cargando...';// perfil.etiquetas.lbPbLoad;
                pbLoad.wait({
                    interval: 200,
                    increment: 15,
                    fn: function () {
                    }
                });

            },
            hide: function () {
                pbLoad.reset();
            }
        }
    });
    /*----------------------------------------------------------------------------*/
    /*------------------------Declaración de los botones--------------------------*/
    var btAyuda = new Ext.Button({
        iconCls: 'ayuda',
        id: 'btnAyudaNivelEstructural',
        text: etiquetasEst.btnAyuda,
        tooltip: etiquetasEst.toolAyuda
        /*disabled: false,
        nextTab: 'btnAdicionarEav'
        handler: function () {
            Ext.getCmp(bntAyudaDPA).handler().call();
        }*/
    });

    bt_AdicionarEav = new Ext.Button({
        text: etiquetasEst.btnAdd,
        hidden: false,
        tooltip: etiquetasEst.toolAdicionar,
        id: 'btnAdicionarEav',
        iconCls: 'adicionar',
        handler: function () {
            if (!isOpenW) {
                isOpenW = true;
                var mask = new Ext.LoadMask(Ext.getBody(), {
                    msg: etiquetasEst.msgCargando
                });
                mask.show();
                Ext.Ajax.request({
                    url: '/configuracion/divisionpolitica/index.php/gestnivelestructural/getConceptonivel',
                    method: 'POST',
                    callback: function (options, success, response) {
                        mask.hide();
                        if (Ext.decode(response.responseText).cantidad_filas == 0) {
//                        notifyEvent(grid_estructura.el.dom, etiquetasEst.lbTtlInformacion, etiquetasEst.msgNoResultsNivelEstructurales, 1, 3000);
                            mostrarMensaje(1, etiquetasEst.msgNoResultsNivelEstructurales);
                        }
                        else {
                            Onbt_AdicionarEavClick();
                            Ext.getCmp('fechafin').reset();
                            Ext.getCmp('fechafin').setMinValue(Ext.getCmp('fechaini').getValue());
                            Ext.getCmp('fechafin').validate();
                        }


                    }
                });
            }
        }
    });

    bt_ModificarEav = new Ext.Button({
        text: etiquetasEst.btnMod,
        tooltip: etiquetasEst.toolMod,
        id: 'btnModificarEav',
        disabled: true,
        hidden: false,
        iconCls: 'modificar',
        handler: function () {
            isOpenW = true;
            Onbt_ModificarEavClick();
        }

    });

    bt_EliminarEav = new Ext.Button({
        id: 'btnEliminarEav',
        hidden: false,
        tooltip: etiquetasEst.toolElim,
        text: etiquetasEst.btnDel,
        disabled: true,
        iconCls: 'eliminar',
        handler: function () {
            isOpenW = true;
            Onbt_EliminarEav();
        }

    });

    /*
     * bt_GestionarCampos = new Ext.Button( { text :'Gestionar campos',
     * hidden:false, iconCls :'btn', icon :perfil.dirImg + 'visualizar.png', id
     * :'btnGestionarcamposEav', disabled :true, handler :Onbt_Gestionarcampos
     * });
     */
    /*----------------------------------------------------------------------------*/
    /*-------------------------Para el reader del store---------------------------*/
    var rc_ = [{
        name: 'denominacion'
    }, {
        name: 'concepto',
        type: 'bool'
    }, {
        name: 'externa'
    }, {
        name: 'root',
        type: 'bool'
    }, {
        name: 'id'
    }, {
        name: 'fechaini'
    }, {
        name: 'fechafin'
    }, {
        name: 'idconceptonivel',
        mapping: 'idconceptonivel'
    }, {
        name: 'raiz'
    }];

    /*----------------------------------------------------------------------------*/
    /*----------Declaración de los componentes del Grid de estructuras------------*/

    sm_estructura = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: On_RowClickEst,
            rowdeselect: On_RowDeselectEst
        }
    });

    st_estructura = new Ext.data.Store({
        url: rf_estructura,
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'id',
            totalProperty: 'cant'
        }, rc_),
        listeners: {
            beforeload: function () {
                st_estructura.baseParams.idconceptoestructural= idconceptoestructural
            },
            load: function () {
                if (st_estructura.getTotalCount() == 0)
                    mostrarMensaje(1, etiquetasEst.msgNoDatos);
            }
        }
    });
    col_estructura = [{
        hidden: true,
        hideable: false,
        dataIndex: 'id'
    }, {
        header: etiquetasEst.lbDenominacionnivel,
        dataIndex: 'denominacion',
        id: 'expandir'
    }, {
        header: etiquetasEst.lbraiz,
        width: 100,
        dataIndex: 'raiz',
        renderer: change
    }];
    /*----------------------------------------------------------------------------*/
    /*----------------------Declaración del GRID DE ESTRCUTURAS-------------------*/
    grid_estructura = new Ext.grid.GridPanel({
        ddGroup: 'secondGridDDGroup',
        split: true,
        border: false,
        id: 'grid_estructuraR',
        minWidth: 300,
        width: 600,
        viewConfig: {forceFit:true},
        stripeRows: true,
        ddText: etiquetasEst.lbDragAndDropSelectedText,
        store: st_estructura,
        region: 'west',
        columns: col_estructura,
        enableDragDrop: true,
        sm: sm_estructura,
        autoExpandColumn: 'expandir',
        title: etiquetasEst.titNiveles,
        loadMask: {
            msg: etiquetasEst.msgCargando,
            store: st_estructura
        },
        tbar: [bt_AdicionarEav, bt_ModificarEav, bt_EliminarEav],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: st_estructura,
            grid:this,
            displayInfo: true
        }),
        listeners: {
            rowdblclick: On_RowdbClick
        }
    });
    /*----------------------------------------------------------------------------*/
    /*----------------------------Mando a cargar el store-------------------------*/
    st_estructura.load({
        defaultSortable: true,
        /*params: {
            start: 0,
            limit: 20
        }*/
    });
    /*----------------------------------------------------------------------------*/
    /*---------------------Declaración de Funciones Privadas----------------------*/

    /*----------------------------------------------------------------------------*/
    /*-------------------Declaración de Función para adicionar--------------------*/

    function Onbt_AdicionarEavClick(btn) {
        params = null;
        url_tablas = "insertar" + rf_estructura;
        title = etiquetasEst.titAddNivel;
        apl = false;
        action = 'adicionar';
        mostrarWin_FormEst(apl);
    }

    /*----------------------------------------------------------------------------*/
    /*-------------------Declaración de Función para modificar--------------------*/
    function Onbt_ModificarEavClick(btn) {
        url_tablas = "modificar" + rf_estructura;
        action = 'modificar';
        params = {
            idtabla: idtabla
        }
        title = etiquetasEst.titModNivel;
        apl = true;
        mostrarWin_FormEst(apl);
    }

    /*----------------------------------------------------------------------------*/
    /*--------------------Declaración de Función para eliminar--------------------*/
    function Onbt_EliminarEav(btn) {
        if (!idtablaDoubleClickItem)
            idtablaDoubleClickItem = idtabla;

        mostrarMensaje(2, etiquetasEst.msgSeguroElim, elimina)
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                /*Secodena.mostrarMascara('maskEliminar', etiquetasEst.msgEspere,
                 etiquetasEst.msgElimDatosNivel);*/
                Ext.Msg.wait(etiquetasEst.msgElimDatosNivel, etiquetasEst.msgEspere);
                Ext.Ajax.request({
                    url: 'eliminartabla',
                    method: 'POST',
                    params: {
//                        idtabla: idtabla
                        idtabla: idtablaDoubleClickItem
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
//                        Secodena.ocultarMascara('maskEliminar');
                        Ext.Msg.hide();

                        if (responseData.cod == 1) {
                            mostrarMensaje(1, etiquetasEst.msgElimNivelSatisfactoriamente);
                            st_estructura.load();
                            sm_estructura.clearSelections();
                            SetEstadoBotonesTbarGridEst();
                            st_relaciones.baseParams.idtabla = null;
//                                st_relaciones.load();
                            grid_relaciones.setTitle(etiquetasEst.titRelaciones);
                            grid_relaciones.disable();
                            bt_AdicionarEav.focus();
                        }
                        else
                            mostrarMensaje(1, etiquetasEst.msgNivelEstructuralDelEnUso);
                    }
                });
            } else {
                bt_AdicionarEav.focus();
            }
            idtablaDoubleClickItem = null;
            isOpenW = false;
        }
    }

    /*----------------------------------------------------------------------------*/
    /*--Declaración de Función para gestionar campos con metadatos no esta en uso--*/
    function Onbt_Gestionarcampos(btn) {
        mostrarWin_GdCampos();

    }

    /*----------------------------------------------------------------------------*/

    //marcar el nivel que está seleccionado (ernesto).
    var fnChangeStyle2Record = function (recIndex, apply, fns) {
        if (!fns) {
            fns = [[{
                methodName: 'removeClass',
                params: 'nivel-selected'
            }], [{
                methodName: 'addClass',
                params: 'nivel-selected'
            }/*,{
             methodName: 'addClassOnClick',
             params: 'nivel-selected'
             },{
             methodName: 'addClassOnOver',
             params: 'nivel-selected'
             }*/
            ]];
        }
        rec = Ext.get(grid_estructura.getView().getRow(recIndex));
        if (rec) {
            Ext.each(fns[apply], function (o) {
                rec[o['methodName']](o.params);
            });
        }
        else {
            rowLevelElementIndex = null;
        }
    };

    grid_estructura.getStore().addListener('load', function () {
        st_relaciones.baseParams.idtabla = null;
        st_relaciones.reload();
        grid_relaciones.setTitle(etiquetasEst.titRelaciones);
        grid_relaciones.disable();
    });

    /*---Declaración de Función para activar el otro grid cuando se de dobleclik--*/
    function On_RowdbClick(Grid, rowIndex, e) {
        if (row == -1) {
            Ext.getCmp('grid_estructuraR').getView().addRowClass(rowIndex, 'FilaVerde');
        }
        else {
            if (row != rowIndex) {
                Ext.getCmp('grid_estructuraR').getView().removeRowClass(row, 'FilaVerde');
                Ext.getCmp('grid_estructuraR').getView().addRowClass(rowIndex, 'FilaVerde');
            }
            else {
                Ext.getCmp('grid_estructuraR').getView().addRowClass(rowIndex, 'FilaVerde');
            }
        }
        row = rowIndex;
//        scope.smGestionarDuo = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
//            id: 'smGestionarDuo',
//            width: 30,
//            sortable: true,
//            listeners: {
//                rowselect: function(smodel, rowIndex, record) {
//                    scope.RowClick(smodel, rowIndex, record);
//                    Ext.getCmp('gpGestionarDuo').getView().addRowClass(rowIndex, "negrita");
//                },
//                rowdeselect: function(smodel, rowIndex, record) {
//                    scope.RowClick(smodel, rowIndex, record);
//                    Ext.getCmp('gpGestionarDuo').getView().removeRowClass(rowIndex, "negrita");
//                }
//            }
//        });


        Nro_fila = rowIndex;
        grid_habilitado = true;
        grid_relaciones.enable();
        grid_estructura.enableDragDrop.prototype = true;

        idtabla = sm_estructura.getSelected().get('id');
        denominacion = sm_estructura.getSelected().get('denominacion');
        idtablaDoubleClickItem = sm_estructura.getSelected().get('id');

        st_relaciones.baseParams = {
            idtabla: idtabla
        };
        st_relaciones.load({
            params: {
                start: 0,
                limit: 20
            }
        });
        //marcar el nivel que está seleccionado y cambiar el título de relaciones (ernesto).

        rec = grid_estructura.getStore().getAt(rowIndex);
        conceptName = rec.data.denominacion;
        rowElIndex = rowIndex;//grid_estructura.getView().getRow(rowIndex);
        grid_relaciones.setTitle(etiquetasEst.titRelaciones + ' ' + etiquetasEst.lbOf + ' ' + conceptName);
        if (rowLevelElementIndex !== rowElIndex) {
            if (rowLevelElementIndex !== null)
                fnChangeStyle2Record(rowLevelElementIndex, 0);
            fnChangeStyle2Record(rowElIndex, 1);
            rowLevelElementIndex = rowElIndex;
        }
        SetEstadoBotonesTbarGridEst();
        SetEstadoBotonesTbarGridRe();
    }

    /*----------------------------------------------------------------------------*/

    function On_RowClickEst(sm, indiceFila, record) {

        SetEstadoBotonesTbarGridEst();
        idtabla = sm_estructura.getSelected().get('id');
        rec = record;

    }

    function On_RowDeselectEst() {
        SetEstadoBotonesTbarGridEst();
        idtabla = null;
        rec = null;
    }

    /*----------------------------------------------------------------------------*/
    /*-----Declaración de Función para activar o desactivar botones del grid------*/

    function SetEstadoBotonesTbarGridEst() {
        if (sm_estructura.hasSelection()) {
            bt_ModificarEav.enable();
            bt_EliminarEav.enable();
            if (sm_estructura.getSelected().data.raiz == 0) {
                bt_AdicionarRe.enable();
            }
        } else {
            bt_ModificarEav.disable();
            bt_EliminarEav.disable();
            bt_AdicionarRe.disable();
        }
    }

    /*----------------------------------------------------------------------------*/
    /*----Declaración de Función que es utilizada por la validación de fechas-----*/

    function change(val) {
        return (val == "1") ? etiquetasEst.lbYesNo.yes : etiquetasEst.lbYesNo.no;
    }

    function agregarfila(record, index, allItems) {
        if (record.data) {
            var foundItem = st_estructura.find('nombre', record.data.nombre);
            if (foundItem == -1) {
                st_estructura.add(record);
                InsertaEav(record);
                st_estructura.sort('nombre', 'ASC');
                // ddSource.grid.store.remove(record);
            }
        }
    }

    function InsertaEav(recor) {
        params = {
            idtabla: idtabla,
            idrelacion: recor.data.id
        };
        Ext.Ajax.request({
            url: 'insertar' + rf_relaciones,
            method: 'POST',
            params: params,
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (rf_relaciones == 'conexiones' && responseData.codMsgg == -1) {
                    mostrarMensaje(1, etiquetasEst.msgRelacionIns);
                    st_relaciones.load();
                    sm_estructura.clearSelections();
                }
                else {
                    mostrarMensaje(responseData.codMsgg, etiquetasEst.msgNoInsRelacion);
                    st_relaciones.load();
                    sm_estructura.clearSelections();
                }

                //sm_estructura.selectRow(Nro_fila);
                // SetEstadoBotonesTbarGrid();
            }
        });
    }

    var parametros = {
        idconceptoestructural: idconceptoestructural
    };
    /*----------------------------------------------------------------------------*/
    /*-Declaración de la función para mostrar la ventana de adicionar y modificar-*/
    function mostrarWin_FormEst(apl) {
        /*----------------------------------------------------------------------------*/
        /*------------------------Componentes del formulario--------------------------*/
        var chk_boxConcepto = new Ext.form.Checkbox({
            boxLabel: 'Concepto',
            hideLabel: true,
            name: 'concepto'

        });
        var cheq = false;
        var chk_boxRaiz = new Ext.form.Checkbox({
            boxLabel: etiquetasEst.lbRoot,
            hideLabel: true,
            //inputValue: true,
            id: 'idboxraiz',
            name: 'root',
            listeners: {
                /*render: function (v) {
                 if (apl) {
                 if (grid_estructura.getSelectionModel().getSelected().data.raiz)
                 v.setValue(grid_estructura.getSelectionModel().getSelected().data.raiz);
                 }
                 else {
                 v.setValue(false);
                 }
                 cheq = v.checked;
                 },*/ check: checkWindow
            }

        });

        var fechaini = new Ext.form.DateField({
            fieldLabel: etiquetasEst.lbFechaInicio,
            anchor: '95%',
            name: 'fechaini',
            allowBlank: false,
            endDateField: 'fechafin',
            value: new Date(),
            maskRe: /[\d\/]/,
            enableKeyEvents: true,
            invalidText: etiquetasEst.toolFormato,
            maxText: etiquetasEst.lbmsg20,
            vtype: 'daterange',
            id: 'fechaini',
            format: 'd/m/Y',
            parseDate: function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6
                || v.length == 8 || v.length == 10) && (Date
                    .parseDate(v, 'd/m/y') || Date
                    .parseDate(v, 'd/m/Y')));
            },
            listeners: {
                change: checkWindow,
                keyup: checkWindow
            }
        });
        var fechaf = new Ext.form.DateField({
            fieldLabel: etiquetasEst.lbFechaFin,
            anchor: '95%',
            name: 'fechafin',
            id: 'fechafin',
            maskRe: /[\d\/]/,
            startDateField: 'fechaini',
            invalidText: etiquetasEst.toolFormato,
            minText: etiquetasEst.lbmsg21,
            vtype: 'daterange',
            format: 'd/m/Y',
            enableKeyEvents: true,
            readOnly: false,
            parseDate: function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6
                || v.length == 8 || v.length == 10) && (Date
                    .parseDate(v, 'd/m/y') || Date
                    .parseDate(v, 'd/m/Y')));
            },
            listeners: {
                change: checkWindow,
                keyup: checkWindow
            }

        });

        var fs_chkcol1 = {
            xtype: 'fieldset',
            title: etiquetasEst.lbCheckIfItIs,
            //width : 200,
            anchor: '90%',
            autoHeight: true,
            items: [chk_boxRaiz]
        };

        var fs_chkcol2 = {
            xtype: 'fieldset',
            title: etiquetasEst.lbDates,
            autoHeight: true,
            width: 200,
            items: [fechaini, fechaf]
        };

        /*----------------------------------------------------------------------------*/
        /*---------Declaracion del store para cargar el nomenclador de niveles--------*/
        var stConceptonivel = new Ext.data.Store({
            url: 'getConceptonivel',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "root",
                id: "idconceptonivel"
            }, [{
                name: 'idconceptonivel'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
        });
        /*----------------------------------------------------------------------------*/
        /*-------------------------Mando a cargar el store----------------------------*/

        /*----------------------------------------------------------------------------*/
        /*--------------------Declaración de las columnas del store-------------------*/

        var cmbConceptoNivel = new Ext.form.ComboBox({
            name: 'idconceptonivel',
            id: 'cbidconceptonivel',
            editable: true,
            emptyText: etiquetasEst.lbSeleccione,
            fieldLabel: etiquetasEst.lbDenominacionnivel,
            triggerAction: 'all',
            forceSelection: true,
            allowBlank: false,
            anchor: '90%',
            valueField: 'idconceptonivel',
            displayField: 'denominacion',
            hiddenName: 'idconceptonivel',
            store: stConceptonivel,
            mode: 'local',
            typeAhead: true,
            enableKeyEvents: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b><p><tpl if="descripcion">{descripcion}.</tpl></p> " class="x-combo-list-item">{denominacion}</div></tpl>'

        });

        cmbConceptoNivel.on(
            {
                select: checkWindow
            }
        );
        var colf_tabla_1 = {
            columnWidth: .5,
            labelAlign: 'top',
            layout: 'form',
            items: [cmbConceptoNivel, fs_chkcol1]
        };

        var colf_tabla_2 = {
            columnWidth: .5,
            labelAlign: 'top',
            layout: 'form',
            items: [fs_chkcol2]
        };
        mask_nivel = new Ext.LoadMask(Ext.getBody(), {
            msg: etiquetasEst.msgCargando
        });
        mask_nivel.show();
        Ext.Ajax.request({
            url: 'obtenerDatosadicionales',
            success: function (resp, obj) {
                res = resp.responseText;
                eval("var oRes=" + res);
                var items = creaArrayItems(oRes);
                if (items.length > 0) {
                    var fieldSetotrosdatos = new Ext.form.FieldSet({
                        title: etiquetasEst.lbOtrosdatos,
                        anchor: '100%',
                        id: 'fieldSetotrosdatos',
                        autoHeight: true,
                        items: {
                            layout: 'column',
                            items: items
                        }
                    });
                } else {
                    var fieldSetotrosdatos = new Ext.form.FieldSet({
                        title: etiquetasEst.lbOtrosdatos,
                        anchor: '100%',
                        hidden: true,
                        id: 'fieldSetotrosdatos',
                        autoHeight: true
                    });
                }
                if (!winKeyMap) {
                    winKeyMap = new Ext.KeyMap(Ext.getBody(), [
                        {
                            key: Ext.EventObject.ENTER,
                            fn: function () {
                                if (isOpenW && !Ext.getCmp('idbtnAceptarAdd').disabled) {
                                    Ext.getCmp('idbtnAceptarAdd').handler.call();
                                }
                            }
                        }/*, {
                         key: "p",
                         alt: true,
                         ctrl: true,
                         fn: function () {
                         if (action == 'adicionar' && isOpenW && !Ext.getCmp('idbtnAplicarAdd').disabled) {
                         Ext.getCmp('idbtnAplicarAdd').handler.call();
                         }
                         }
                         }, {
                         key: "x",
                         alt: true,
                         fn: function () {
                         if (isOpenW) {
                         winKeyMap.disable();
                         Ext.getCmp('idbtnCancelarAdd').handler.call();
                         }
                         }
                         }*/
                    ]);
                } else {
                    winKeyMap.enable();
                }

                /*----------------------------------------------------------------------------*/
                /*-----------------------Declaración del formulario general-------------------*/
                fm_Tablas = new Ext.form.FormPanel({
                    frame: true,
                    id: 'idfm_Tablas',
                    autoHeight: true,
                    border: 'false',
                    items: [{
                        layout: 'column',
                        items: [colf_tabla_1, colf_tabla_2]
                    }, fieldSetotrosdatos]
                });
                wn_FormEst = new Ext.Window({
                    title: 'Titulo',
                    layout: 'fit',
                    width: 500,
                    x: 15,
                    y: 150,
                    constrain:true,
                    autoHeight: true,
                    bodyStyle: 'padding:5px;',
                    defaultButton: 'idbtnCancelarAdd',
                    items: fm_Tablas,
                    closeAction: 'close',
                    listeners: {
                        close: function () {
                            isOpenW = false;
                            bt_AdicionarEav.focus();
                            map_ne.enable();
                        },
                        beforeshow: function () {
                            stConceptonivel.load({
                                callback: function () {
                                    if (apl) {
                                        var record = grid_estructura.getSelectionModel().getSelected();
                                        if (record.data.raiz == '1') {
                                            record.data.root = true;
                                        } else {
                                            record.data.root = false;
                                        }
                                        fm_Tablas.getForm().loadRecord(record);
                                    }
                                    mask_nivel.hide();
                                }
                            });
                            map_ne.disable();
                        },
                        show: function () {
                            wn_FormEst.center();
                            wn_FormEst.focus();
                        }
                    },
                    modal: true,
                    buttons: [{
                        text: etiquetasEst.btnCancelar,
                        id: 'idbtnCancelarAdd',
                        tooltip: etiquetasEst.toolCancelar,
                        iconCls: 'cancelar',
                        handler: function () {
                            OnCancelarClick();
                        }
                    }, {
                        text: etiquetasEst.btnAplicar,
                        tooltip: etiquetasEst.toolAplicar,
                        iconCls: 'aplicar',
                        id: 'idbtnAplicarAdd',
                        disabled: true,
                        hidden: apl,
                        handler: function () {
                            OnAceptarClick(false);
                        }
                    }, {
                        text: etiquetasEst.btnAceptar,
                        tooltip: etiquetasEst.toolAceptar,
                        iconCls: 'aceptar',
                        disabled: true,
                        id: 'idbtnAceptarAdd',
                        handler: function () {
                            OnAceptarClick(true)
                        }
                    }]
                });
                if (apl)
                    fm_Tablas.getForm().loadRecord(rec);
                wn_FormEst.setTitle(title);
                wn_FormEst.show(this);

            },
            params: parametros
        })

    }

    Ext.apply(Ext.form.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.startDateField
                && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
                    .getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            } else if (field.endDateField
                && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
                    .getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });
    function onWnFormEAVhide() {
        fm_Tablas.getForm().reset();
    }

    /*----------------------------------------------------------------------------*/
    /*-----------------Función que cierra la ventana resetea el formulario--------*/
    function OnCancelarClick(btn) {
        fm_Tablas.getForm().reset();
        wn_FormEst.close();
        isOpenW = false;
    }

    /*----------------------------------------------------------------------------*/
    /*--Declaración de la función para enviar el formulario de nivel estructural--*/
    function OnAceptarClick(apl) {
        sbmt_EnviarfmTablas(apl);
    }

    function Validar_Seleccion() {
        if (!chk_boxExterna.getValue() && !chk_boxInterna.getValue()) {
            Ext.Msg.show({
                title: 'Mensaje de Error',
                msg: etiquetasEst.msgDebe,
                buttons: (Ext.Msg.OK),
                animEl: document.body,
                icon: Ext.MessageBox.ERROR
            })
            return true;
        }

        return false;
    }

    /*function cargarAyuda() {
        var title = 'Mostrar ayuda de la funcionalidad';
        var referencia = 'CG/dpa/relaciones_estructurales';
        help.show(title, referencia);
    }*/

    /*----------------------------------------------------------------------------*/
    /*---------------Declaración de la función que envia el formulario------------*/
    function sbmt_EnviarfmTablas(apl) {

        var concepto = {
            idconceptoestructural: idconceptoestructural,
            idnivelestructural: (sm_estructura.hasSelection()) ? sm_estructura.getSelected().id : ''
        };
        if (fm_Tablas.getForm().isValid()) {
            fm_Tablas.getForm().submit({
                url: url_tablas,
                params: concepto,
                failure: function (form, action) {
                    if (action.result.codMsgg != 42) {
                        if (apl) {
                            isOpenW = false;
                            wn_FormEst.close();
                        } else {
                            fm_Tablas.getForm().reset();
                            Ext.getCmp('fechaini').setMaxValue(null);
                            Ext.getCmp('fechaini').validate();
                        }
                        if (action.result.codMsgg == 2) {
                            mostrarMensaje(1, etiquetasEst.msgModNivelSatisfactoriamente);
                            bt_AdicionarEav.focus();
                            map_ne.enable();
                            st_estructura.load();
                            sm_estructura.clearSelections();
                        }
                        if (action.result.codMsgg == 1) {
                            mostrarMensaje(1, etiquetasEst.msgAddNivelSatisfactoriamente);
                            bt_AdicionarEav.focus();
                            map_ne.enable();
                            st_estructura.load();
                            sm_estructura.clearSelections();
                        }
                    } else {
                        if (action.result.codMsgg == 42) {
                            sms = "";
                            if (url_tablas == 'insertarTablas') {
                                mostrarMensaje(1, etiquetasEst.msgExisteNivel);
                                bt_AdicionarEav.focus();
                            }
                            else {
                                if (url_tablas == 'modificarTablas') {
                                    mostrarMensaje(1, etiquetasEst.msgExisteNivel);
                                    bt_AdicionarEav.focus();
                                }
                            }
                        }
                    }
                    winKeyMap.enable();
                },
                waitMsg: etiquetasEst.waitmsgGuardandoNivel
            })

        }
        else {
            mostrarMensaje(1, etiquetasEst.textVerifiqueNuevamente);
        }

    }

    /*----------------------------------------------------------------------------*/
    /*-----------Declaración de los componentes del egundo grid de relaciones-----*/

    /*----------------------------------------------------------------------------*/
    /*-----------Declaración de los botones del grid de relaciones----------------*/
    var bt_AdicionarRe = new Ext.Button({
        text: etiquetasEst.btnAddRelacion,
        id: 'btnAdicionarRe',
        tooltip: etiquetasEst.toolAddRelacion,
        iconCls: 'adicionar',
        hidden: false,
        disabled: true,
        handler: function () {
            isOpenW = true;///variable para verificar cuando una ventana esta abierta(teclas calientes)
            Onbt_AdicionarRe();
        }
    });

    var bt_EliminarRe = new Ext.Button({
        id: 'btnEliminarRe',
        tooltip: etiquetasEst.toolElimrelacion,
        text: etiquetasEst.btnDel,
        disabled: true,
        hidden: false,
        iconCls: 'eliminar',
        handler: function () {
            isOpenW = true;
            Onbt_EliminarRe();
        }
    });
    col_relaciones = [{
        header: etiquetasEst.lbDenomRelacion,
        dataIndex: 'denominacion',
        id: 'expandir'
    }];

    sm_relaciones = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: On_RowClickRe,
            rowdeselect: On_RowDeselectRe
        }
    });
    st_relaciones = new Ext.data.Store({
        url: "buscar" + rf_relaciones,
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idnomeav',
            totalProperty: 'cant'
        }, rc_)
    });
    /*----------------------------------------------------------------------------*/
    /*-----------------------Declaración del grid de relaciones-------------------*/
    grid_relaciones = new Ext.grid.GridPanel({
        ddGroup: 'firstGridDDGroup',
        split: true,
        border: false,
        ddText: etiquetasEst.lbDragAndDropSelectedText,
        store: st_relaciones,
        width: 300,
        viewConfig: {forceFit:true},
        minWidth: 250,
        columns: col_relaciones,
        enableDragDrop: true,
        stripeRows: true,
        loadMask: {
            msg: etiquetasEst.msgCargando
        },
        autoExpandColumn: 'expandir',
        disabled: true,
        disabledClass: 'panel-disabled-class-without-zindex',
        sm: sm_relaciones,
        region: 'center',
        title: etiquetasEst.titRelaciones,
        tbar: [bt_AdicionarRe, bt_EliminarRe],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: st_relaciones,
            grid:this,
            displayInfo: true
        })
    });
    /*----------------------------------------------------------------------------*/
    /*------------Declaración de la función para adicionar una relación-----------*/

    function Onbt_AdicionarRe() {
        recor = rec;
        agregarfilare(recor);
        SetEstadoBotonesTbarGridRe();
        isOpenW = false; ///variable para verificar cuando una ventana esta abierta(teclas calientes)
    }

    /*----------------------------------------------------------------------------*/
    /*--------Declaración de la función para revisar el estado de los botones-----*/
    function On_RowClickRe(sm, indiceFila, record) {
        recRe = record;
        SetEstadoBotonesTbarGridRe();
    }

    function On_RowDeselectRe() {
        recRe = null;
        SetEstadoBotonesTbarGridRe();
    }

    /*----------------------------------------------------------------------------*/
    /*--------Declaración de la función para revisar el estado de los botones-----*/

    function SetEstadoBotonesTbarGridRe() {
        if (sm_relaciones.getCount() > 0 && sm_relaciones.hasSelection()) {
            bt_EliminarRe.enable();
        } else {
            bt_EliminarRe.disable();
        }
    }

    /*----------------------------------------------------------------------------*/
    /*------------Declaración de la función para eliminar una relación-----------*/

    function Onbt_EliminarRe() {
        var elimina = function (btnPresionado) {
            if (btnPresionado == 'ok') {

                Ext.Msg.wait(etiquetasEst.waitmsgEliminandoRelacion, etiquetasEst.msgPorFavorEspere);
                Ext.Ajax.request({
                    url: 'eliminar' + rf_relaciones,
                    method: 'POST',
                    params: {
                        idtabla: idtablaDoubleClickItem,
                        idrelacion: recRe.data.id
                    },
                    callback: function (options, success, response) {
                        Ext.Msg.hide();
                        responseData = Ext.decode(response.responseText);
                        st_relaciones.reload({
                            callback: function () {
                                if (responseData.cod == 1
                                    || responseData.cod == 23) {
                                    sm_relaciones.clearSelections();
                                    SetEstadoBotonesTbarGridRe();
                                    mostrarMensaje(1, etiquetasEst.msgRelacionElimSatisf);
                                    map_ne.enable();
                                    bt_AdicionarEav.focus();
                                }
                            }
                        });
                    }

                });
            } else {
                bt_AdicionarRe.focus();
            }
            isOpenW = false;///...variable para verificar cuando una ventana esta abierta(teclas calientes)...///

        }
        if (!sm_relaciones.getSelected())
            mostrarMensaje(1, etiquetasEst.msgDebeSelecionarNivelElim);
        else {
            mostrarMensaje(2, etiquetasEst.msgSeguroElimRelacion, elimina);
        }
    }

    /*----------------------------------------------------------------------------*/
    /*--------------------------Declaración del ViewPort--------------------------*/
    var panelContenedor = new Ext.Panel({
        layout: 'border',
        region: 'center',
        tbar: ['->', btAyuda],
        items: [grid_estructura, grid_relaciones]
    });
    vp_GestionEav = new Ext.Viewport({
        layout: 'border',
        items: [panelContenedor],
        listeners: {
            afterlayout: function () {
                bt_AdicionarEav.focus();
            }
        }
    });

    var secondGridDropTargetEl = grid_relaciones.getView().el.dom.childNodes[0].childNodes[1]

    var destGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
        ddGroup: 'secondGridDDGroup',
        copy: false,
        notifyDrop: function (ddSource, e, data) {
            Ext.each(ddSource.dragData.selections, agregarfilare);
            return (true);
        }
    });

    function agregarfilare(record, index, allItems) {
        if (record.data) {
            var foundItem = st_relaciones.find('id', record.data.id);
            if (record.data.denominacion != denominacion) {
                if (sm_estructura.getSelected().data.raiz == 1) {
                    //esto nunca debe pasar
                    mostrarMensaje(1, "No puede insertar");
                } else if (grid_habilitado) {
                    if (foundItem == -1) {
                        st_relaciones.add(record);
                        sm_estructura.clearSelections();
                        sm_estructura.selectRow(Nro_fila);
                        InsertaEav(record);
                        st_relaciones.sort('nombre', 'ASC');
                    } else {
                        mostrarMensaje(1, etiquetasEst.msgRelacionExiste);
                    }
                }
            }
            else {
                mostrarMensaje(1, etiquetasEst.msgSeleccioneLarelacion);
            }
        }
        else {
            mostrarMensaje(1, etiquetasEst.msgSeleccioneLarelacion);
        }
    }

    function notifyEvent(animateTarget, title, msg, icon, time, callback) {
        var notification = new Ext.Cont.Notification({
            animateTarget: animateTarget,
            fnc: (callback) ? callback : Ext.emptyFn,
            iconbox: icon,
            iconCls: "icon-waiting",
            title: title,
            html: msg,
            hideDelay: (time) ? time : 5000
        });
        notification.box();
    }

    function checkWindow() {
        if (fm_Tablas.getForm().isValid()) {
            if (action == 'modificar' && changedForm()) {
                Ext.getCmp('idbtnAceptarAdd').enable();
            } else if (action == 'adicionar') {
                Ext.getCmp('idbtnAplicarAdd').enable();
                Ext.getCmp('idbtnAceptarAdd').enable();
            } else {
                Ext.getCmp('idbtnAceptarAdd').disable();
            }
        } else {
            if (action == 'adicionar') {
                Ext.getCmp('idbtnAplicarAdd').disable();
            }
            Ext.getCmp('idbtnAceptarAdd').disable();

        }
    }

    function changedForm() {
        var newValues = fm_Tablas.getForm().getValues();
        newValues.root=Ext.getCmp('idboxraiz').getValue();
        var oldValues = sm_estructura.getSelected().data;
        var changed = false;
        for (k in newValues) {
            if ((!Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k])) || (!Ext.isEmpty(newValues[k]) && Ext.isEmpty(oldValues[k])) || (Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k]))) {
                if (newValues[k] != oldValues[k]) {
                    changed = true;
                    break;
                }
            }
        }
        return changed;
    }

}
