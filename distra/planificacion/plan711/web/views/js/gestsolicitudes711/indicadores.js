/**
 * Created by madrid on 03/04/2017.
 */

var winAddNormaPlanes, filtrosindicadoresPlanes, stGpAddNormaPlanes, checkColumnAddNormaPlanes, apl = false, offset = 0;

function crearIUAddIndicadores() {//Inicio de declaracion

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    var stCmbUMPlanes = new Ext.data.Store({
        url: 'cargarunidadmedida',
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

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtrosindicadoresPlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idumedidaindicadores',
                urlcb: 'cargarunidadmedida',
                mode: 'remote',
                idstore: 'idstumedidaindicadores',
                valueFieldcb: 'idunidadmedida',
                st: stCmbUMPlanes,
                displayFieldcb: 'denominacionunidadmedida',
                autoload: false
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                /*temporal arreglar el listar para que liste centros de balance*/
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'idcbcentrobalancenorma',
                urlcb: 'listarCentroBalance',
                idstore: 'idstcentrobalancenorma',
                valueFieldcb: 'identidaddatosnomenclador',
                displayFieldcb: 'centrobalance'
            }, {
                type: 'listado',
                dataIndex: 'viaadquisicion',
                idcombo: 'idviaadquisicionc',
                urlcb: 'cargarviaadquision',
                mode: 'remote',
                idstore: 'idStViaInd',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                autoload: false
            }
        ]
    });


    checkColumnAddNormaPlanes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function() {
                if (!checkColumnAddNormaPlanes.hasSelection()) {
                    Ext.getCmp('btnaceptaraddnormaPlanes').disable();
                    Ext.getCmp('btnaplicaraddnormaPlanes').disable();
                } else {
                    Ext.getCmp('btnaceptaraddnormaPlanes').enable();
                    Ext.getCmp('btnaplicaraddnormaPlanes').enable();
                }
            },
            rowdeselect: function() {
                cmGpAddNormaPlanes.setColumnHeader(0, '');
                cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
            }
        }

    });

    var cmGpAddNormaPlanes = new Ext.grid.ColumnModel([
        checkColumnAddNormaPlanes, {
            id: 'mscolumn',
            header: 'Código',
            width: 100,
            sortable: false,
            dataIndex: 'codigo'
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            id: 'umedida',
            header: 'UnidadMedida',
            sortable: true,
            dataIndex: 'umedida'
        }, {
            id: 'precio',
            header: 'Precio',
            width: 80,
            sortable: true,
            dataIndex: 'precio'
        }, {
            header: 'Num Pieza',
            width: 120,
            sortable: true,
            dataIndex: 'numeropieza'
        }
        /*, {
            id: 'centrobalance',
            header: perfil.etiquetas.lbCentroBalance,
            sortable: true,
            dataIndex: 'centrobalance'
        }, {
            id: 'via',
            header: perfil.etiquetas.lbViaAdquisicion,
            sortable: true,
            dataIndex: 'viaadquisicion'
        }*/
    ]);

    var smGpAddNormaPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    stGpAddNormaPlanes = new Ext.data.Store({
        url: 'listarIndicadores',
        listeners: {
            load: function() {
                //siexisteIndEnModeloFiltradoPlanes();
            },
            beforeload: function() {
                setTituloFiltrar();
                this.baseParams.start = offset;
                //this.baseParams.identidadmodelo = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.identidadmodelo;
                //this.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                //this.baseParams.tipoplan = tpBasePlanes.getSelectionModel().getSelectedNode().attributes.tipoplan;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'estado'
            }, {
                name: 'idformato'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'centrobalance'
            }, {
                name: 'precio'
            }, {
                name: 'umedida'
            }, {
                name: 'numeropieza'
            }, {
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'viaadquisicion'
            }])
    });

    var cmUidMedPlanes = new Ext.form.ComboBox({
        store: stCmbUMPlanes,
        width: 100,
        fieldLabel: perfil.etiquetas.lbUnidadMedida,
        emptyText: perfil.etiquetas.lbSeleccione,
        valueField: 'idunidadmedida',
        displayField: 'nombreum',
        id: 'cmUidMed',
        mode: 'remote',
        //editable:false,
        anchor: '95%',
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                habilitaBusqueda(true);
            }
        }
    });

    var cbEspecialidadNormaPlanes = new Ext.form.ComboBox({
        id: 'cbEspecialidadNorma',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: new Ext.data.Store({
            url: 'listarEspecialidades',
            reader: new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'data'
            }, [{
                    name: 'idespecialidad'
                }, {
                    name: 'denespecialidad'
                }]),
            listeners: {
                load: function(x, y, z) {
                }
            }
        }),
        valueField: 'idespecialidad',
        displayField: 'denespecialidad',
        mode: 'remote',
        editable: false,
        triggerAction: 'all',
        width: 120,
        fieldLabel: 'Especialidad',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                habilitaBusqueda(true);
            }
        }
    });

    var gpAddNormaPlanes = new Ext.grid.GridPanel({
        store: stGpAddNormaPlanes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        cm: cmGpAddNormaPlanes,
        sm: checkColumnAddNormaPlanes,
        autoExpandColumn: 'expandir',
        region: 'center',
        plugins: filtrosindicadoresPlanes,
        id: 'gpAddNorma',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptAddInd',
            store: stGpAddNormaPlanes,
            displayInfo: true,
            items: [{
                    xtype: 'tbseparator'
                }, {
                    iconCls: 'limpiar',
                    tooltip: "Limpiar",
                    id: 'btntodos',
                    handler: function() {
                        filtrosindicadoresPlanes.clearFilters();
                        stGpAddNormaPlanes.reload();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offset = e.start;
                }
            }
        })
    });

    winAddNormaPlanes = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 950,
        layout: 'fit',
        items: gpAddNormaPlanes,
        height: 500,
        title: perfil.etiquetas.lbAdicionarIndicador,
        listeners: {
            show: function() {
                stCmbUMPlanes.load();
                stGpAddNormaPlanes.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            },
            hide: function() {
                // filtrosindicadores.clearFilters();
            }
        },
        buttons: [{
                id: 'idcancelPlanes',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: 'Cancelar',
                handler: function() {
                    if (apl == true) {
                        //stGpGestModeloPlanes.reload();
                        apl = false;
                    }
                    winAddNormaPlanes.hide();
                    checkColumnAddNormaPlanes.clearSelections();
                    cmGpAddNormaPlanes.setColumnHeader(0, '');
                    cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');

                }
            }, {
                disabled: true,
                id: 'btnaplicaraddnormaPlanes',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.msgGuardarSinCerrar,
                text: 'Aplicar',
                handler: function() {
                    apl = true;
                    adicionarIndicadores();
                    checkColumnAddNormaPlanes.clearSelections();
                    cmGpAddNormaPlanes.setColumnHeader(0, '');
                    cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }, {
                disabled: true,
                id: 'btnaceptaraddnormaPlanes',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: 'Aceptar',
                handler: function() {
                    adicionarIndicadores();
                    winAddNormaPlanes.hide();
                    checkColumnAddNormaPlanes.clearSelections();
                    cmGpAddNormaPlanes.setColumnHeader(0, '');
                    cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }]
    });

    winAddNormaPlanes.show();

}//Fin de Declaracion


function adicionarIndicadores() {
    var indicadoresPlanes = new Array();
    prodindmaestros = [];
    contind=1;
    if (checkColumnAddNormaPlanes.hasSelection())
        auxL = checkColumnAddNormaPlanes.getSelections().length;
        for (var i = 0; i < auxL; i++) {
                prodindmaestros.push([
                    checkColumnAddNormaPlanes.getSelections()[i].id,
                    checkColumnAddNormaPlanes.getSelections()[i].data.codigo,
                    checkColumnAddNormaPlanes.getSelections()[i].data.denominacion,
                    checkColumnAddNormaPlanes.getSelections()[i].data.precio,
                    checkColumnAddNormaPlanes.getSelections()[i].data.umedida,
                    checkColumnAddNormaPlanes.getSelections()[i].data.numeropieza
                ]);
                contind++;
        }
    SeleccionProductos();
}
function recargarindplanes() {
    stGpGestModeloPlanes.reload()
}
function setTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadoresPlanes.getFiltrosActivos() == undefined || filtrosindicadoresPlanes.getFiltrosActivos().length == 0) {
        winAddNormaPlanes.setTitle(perfil.etiquetas.lbAdicionarIndicador);
    } else {
        for (i = 0; i < filtrosindicadoresPlanes.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "codigo") {//
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "precio") {//
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "umedida") {//
                aux = perfil.etiquetas.lbUnidadMedida;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumPieza;
            } else if (filtrosindicadoresPlanes.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            }
            if (i == filtrosindicadoresPlanes.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        winAddNormaPlanes.setTitle(perfil.etiquetas.lbAdicionarIndicador + ' / ' + perfil.etiquetas.lbFiltradoPor + filtrado_por);
        filtrado_por = "";
    }
}

function exportarIndicadoresEnmarc() {
    var win = window.open('exportar?identidad=' + identidadselectedPlanes + '&idejercicio=' + cbEjercicioPlanes.getValue()
            + '&entidad=' + denom_ent);
}

function ImportarProd(tipoaccion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            ventanaCrudProdImp.destroy();
        }
    });
    btnDescargarP = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnDescargarP',
        disabled: false,
        tooltip: 'Descargar plantilla para importar',
        text: 'Plantilla',
        handler: function () {
            if(tipoaccion==1){
                window.open('../../views/plantillas/Ind-Importados.xls');
            }
            if(tipoaccion==2){
                window.open('../../views/plantillas/Ind-ImportadosNumP.xls');
            }
            if(tipoaccion==3){
                window.open('../../views/plantillas/Ind-PreciosNumP.xls');
            }
        }
    });

    btnAceptarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinalP.getForm().isValid()) {
                mymask.show();
                pfinalP.getForm().submit(
                    {
                        url: 'importarfichero',
                        timeout: 1800000, //milisegundos = 30 min
                        method: 'POST',
                        params: {
                            idconcepto: 2,
                            tipoaccion: tipoaccion
                        },
                        failure: function (form, action) {
                            if (action.result.cod == 1 ) {
                                insertar=[];
                                excel=action.result.data.excel;
                                insertar=action.result.data.insertar;
                                if(tipoaccion!= 3) {
                                        if (insertar.length > 0) {
                                            AgregaProductosImportados(insertar);
                                        }
                                }else{
                                    ActualizarPreciosImportados(insertar);
                                }
                                if(excel>0){
                                    var win = window.open('Exportar711?solodescripcion= '+3+'&tipaaccion= '+tipoaccion);
                                }
                                mymask.hide();
                                ventanaCrudProdImp.destroy();
                            }else{
                                mostrarMensaje(3, 'Ha ocurrido un problema al importar');
                            }

                        }
                    }
                );

            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    Explicar = new Ext.form.Label({
        text: 'Nota: Solo se podran actualizar los precios de productos que posean número de piezas, de otra forma pueden existir errores.',
        hidden: true
    });

    pfinalP = new Ext.FormPanel({
        id: 'pfinalP',
        frame: true,
        fileUpload: true,
        defaults: {labelAlign: 'top'},
        items: [{
            columnWidth: 1,
            layout: 'form',
            items: [{
                        xtype: 'fileuploadfield',
                        fieldLabel: 'Archivo seleccionado',
                        id: 'form-file',
                        emptyText: 'Seleccione',
                        name: 'file',
                        anchor: '95%',
                        width: 200,
                        buttonCfg: {
                            text: '',
                            anchor: '95%',
                            iconCls: 'buscar'
                        },
                        allowBlank: false
                    }]

        }, btnDescargarP,Explicar
    ]
    });
    ventanaCrudProdImp = null;
    ventanaCrudProdImp = new Ext.Window({
        title: 'Importar excel de productos',
        id: 'ventanaCrudProdImp',
        width: 425,
        constrain: true,
        layout: 'fit',
        height: 200,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAceptarAdd],
        items: [pfinalP],
        listeners: {
            beforeshow: function () {
            }
        }
    });
    if(tipoaccion==3){
        Explicar.show();
    }
    ventanaCrudProdImp.show();
}

function AgregaProductosImportados(arreglo){
    //console.log(arreglo);
    prod =[];
    auxL= gpProductos1.getStore().data.items.length;
    valortotal=0;
    for (var i = 0; i < auxL; i++) {
        prod.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip,
            gpProductos1.getStore().data.items[i].data.descripcion,
            gpProductos1.getStore().data.items[i].data.urlimagen,
            gpProductos1.getStore().data.items[i].data.nombreimag,
            gpProductos1.getStore().data.items[i].data.unidadmedida,
            gpProductos1.getStore().data.items[i].data.numeropieza
        ]);
        valortotal += parseFloat(''+gpProductos1.getStore().data.items[i].data.valor);
    }

    for (i = 0; i < arreglo.length; i++) {
        valor = arreglo[i]['precio']*arreglo[i]['cantidad'];
        valortotal += valor;
        prod.push([
            arreglo[i]['idindicador'],
            arreglo[i]['codigo'],
            arreglo[i]['denominacion'],
            arreglo[i]['precio'],
            arreglo[i]['cantidad'],
            valor,
            null,
            null,
            null,
            null,
            arreglo[i]['umedida'],
            arreglo[i]['descripcion'],
            null,
            null,
            null,
            arreglo[i]['numeropieza']
        ]);
    }
    suministro.setValue(addCommas(parseFloat(valortotal).toFixed(6)));
    valorporciento = porcientodeGastos.getValue() / 100;
    otrog = (parseFloat(valortotal) * parseFloat(valorporciento)).toFixed(6);
    otrosgastos.setValue(addCommas(otrog));
    totalg = parseFloat(parseFloat(otrog) + parseFloat(valortotal)).toFixed(6);
    totalgeneral.setValue(addCommas(totalg));
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
}

function ActualizarPreciosImportados(arreglo){
    //console.log(arreglo);
    prod =[];
    auxL= gpProductos1.getStore().data.items.length;
    valortotal=0;
    for (var i = 0; i < auxL; i++) {
        band=false;
        valor = 0;
        for (j = 0; j < arreglo.length; j++) {
            if(arreglo[j]['idindicador']==gpProductos1.getStore().data.items[i].data.idproducto711){
                valor = arreglo[j]['precio']*gpProductos1.getStore().data.items[i].data.cantidad;
                prod.push([
                    gpProductos1.getStore().data.items[i].data.idproducto711,
                    gpProductos1.getStore().data.items[i].data.codigocup,
                    gpProductos1.getStore().data.items[i].data.suministro,
                    arreglo[j]['precio'],
                    gpProductos1.getStore().data.items[i].data.cantidad,
                    valor+'',
                    gpProductos1.getStore().data.items[i].data.trimestre1,
                    gpProductos1.getStore().data.items[i].data.trimestre2,
                    gpProductos1.getStore().data.items[i].data.trimestre3,
                    gpProductos1.getStore().data.items[i].data.trimestre4,
                    gpProductos1.getStore().data.items[i].data.descrip,
                    gpProductos1.getStore().data.items[i].data.descripcion,
                    gpProductos1.getStore().data.items[i].data.urlimagen,
                    gpProductos1.getStore().data.items[i].data.nombreimag,
                    gpProductos1.getStore().data.items[i].data.unidadmedida,
                    gpProductos1.getStore().data.items[i].data.numeropieza                    
                ]);
                console.log(valor);
                console.log(prod);
                valortotal += parseFloat(valor);
                band=true;
            }
        }
        if(band==false){
            prod.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip,
            gpProductos1.getStore().data.items[i].data.descripcion,
            gpProductos1.getStore().data.items[i].data.urlimagen,
            gpProductos1.getStore().data.items[i].data.nombreimag,
            gpProductos1.getStore().data.items[i].data.unidadmedida,
            gpProductos1.getStore().data.items[i].data.numeropieza   
        ]);
        valortotal += parseFloat(''+gpProductos1.getStore().data.items[i].data.valor);
        }
    }
    console.log(valortotal);
    totalgeneral.setValue(addCommas(valortotal.toFixed(6)));
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
}