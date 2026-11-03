var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('distribucionplanfar', cargarAccionesDist);
var objciPlanes = {};
objciPlanes.acciones = [];

var cmCodigoVent, jrStCodCCV;

/*Estos son los objetos del Grid de los indicadores */
var treePlanSelect, cbEjercicioPlanes, offsetGpGestModeloPlanes = 0;
var identidadselectedPlanes = 0;
//Importar
var winImpPlanes = null, offsetdin = 0, fpbuscarPlanes;
var estadoTreePlanes = true, estadoGridInd = true, estadoPanelInd = true;
//Ajustar
var importInicialPlanes, importFinalPlanes;
var importeInPlanes = 0, importAjuPlanes = 0, importeFiPlanes = 0;

//Hacia arriba revisar las variables que no se estan utilizando y borrarlas
//variables auxialiares mias
var plan, empimp, cc, ff, monto = 0, idejer, rolepersona, idplan711, band, textomotivo, recursos;



function cargarAccionesDist() {

    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url, function () {
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'gpMontoTotalDist') {
                recursos = 1;
                break;
            }
        }
        cargarInterfazSolicitud();
    });
}

function cargarInterfazSolicitud() {
    rolepersona = perfil.idrol;
    //mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    //carga de datos por defecto

    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
                root: "data",
                id: "iddatos"
            }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
        )
    });

    btnAyudaDistribucion = new Ext.Button({
        id: 'btnAyudaDistribFAR',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
    });

    btnGuardarDist = new Ext.Button({
        handler: function () {
            if(band==1){
                MotivoModif();
            }else{
                GuardarDistribucion();
            }
        },
        tooltip: 'Guardar distribución',
        disabled: true,
        id: 'btnGuardarDist',
        iconCls: 'guardar',
        //hidden: true,
    });

    btnVerModificaciones = new Ext.Toolbar.Button({
        iconCls: 'ver',
        tabIndex: 11,
        tooltip: 'Ver modificaciones',
        id: 'btnVerModificaciones',
        disabled: false,
        handler: function () {
            winModificaciones();
        }
    });
    
    btnAdicionarCredito = new Ext.Button({
        handler: function () {
            AdicionarCredito();
        },
        tooltip: 'Adicionar credito financiero',
        disabled: false,
        id: 'btnAdicionarCredito',
        iconCls: 'adicionar'
    });

    cbEmpresasImp = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                pEstructuras.enable();
                pMontoTotalDist.enable();
                pPlanificacion.enable();
                stMontoTotalDist.reload();
                if (identidadselectedPlanes != 0 && identidadselectedPlanes != null && identidadselectedPlanes != 'undefined') {
                    pDistribucion.enable();
                    stDistribucion.reload();
                }

            }
        }
    });

    montototal = new Ext.form.Label({
        id: 'idmontototal',
        text: '0.00'
    });
    montototalreal = new Ext.form.Label({
        id: 'idmontototalreal',
        text: '0.00'
    });

    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
            name: 'idejercicio'
        }, {
            name: 'ejercicio'
        }, {
            name: 'idestado'
        }, {
            name: 'uridatosnomenclador'
        }]),
        listeners: {
            load: function (t) {
                //cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                //idejer = t.reader.jsonData.idejercicioactual.idejercicio;
            }
        }
    });

    cmDistribucionTotal = new Ext.grid.ColumnModel([
        {
            header: 'Planificación',
            tooltip: 'Planificación',
            dataIndex: 'denominacion',
            id: 'expandir',
            width: 100,
            align: 'left'
        },{
            header: 'UM',
            tooltip: 'Unidad de medida',
            dataIndex: 'um',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: 'Cantidad',
            tooltip: 'Cantidad',
            dataIndex: 'cantidad',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: 'Precio',
            tooltip: 'Precio',
            dataIndex: 'precio',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas
        },{
            header: 'Monto',
            tooltip: 'Monto',
            dataIndex: 'monto',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas
        },{
            header: 'Cantidad real',
            tooltip: 'Cantidad real planificada',
            dataIndex: 'cantidadreal',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: 'Monto real',
            tooltip: 'Monto real planificado',
            dataIndex: 'montoreal',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas
        }
    ]);

    cmDistribucion = new Ext.grid.ColumnModel([
        {
            header: 'Planificación',
            tooltip: 'Planificación',
            dataIndex: 'denominacion',
            id: 'expandir',
            width: 100,
            align: 'left'
        },{
            header: 'UM',
            tooltip: 'Unidad de medida',
            dataIndex: 'um',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
                header: 'Cantidad',
                tooltip: 'Cantidad',
                dataIndex: 'cantidad',
                width: 100,
                align: 'rigth',
                renderer: crearToolTip,
                editor: new Ext.form.NumberField({
                    allowNegative: true,
                    decimalPrecision: 6,
                    allowBlank: false,
                    maxLength: 19
                })
            },{
                header: 'Precio',
                tooltip: 'Precio',
                dataIndex: 'precio',
                width: 100,
                align: 'rigth',
                renderer: RenderaddCommas,
                editor: new Ext.form.TextField({
                    allowNegative: true,
                    regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                    allowBlank: false,
                    maxLength: 30,
                    listeners: {
                        change : function ( me, nv, ov )  {
                            me.setValue(addCommas(nv));
                        }
                    }
                })
            },{
                header: 'Monto',
                tooltip: 'Monto',
                dataIndex: 'monto',
                width: 100,
                align: 'rigth',
                renderer: RenderaddCommas,
                editor: new Ext.form.TextField({
                    allowNegative: true,
                    regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                    allowBlank: false,
                    maxLength: 30,
                    listeners: {
                        change : function ( me, nv, ov )  {
                            me.setValue(addCommas(nv));
                        }
                    }
                })
            }
    ]);

    cbEjercicioPlanes = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        width: 150,
        disabled: false,
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                cbEmpresasImp.enable();
                idejer = rec.data.idejercicio;
                if (cbEmpresasImp.getValue() != '') {
                    //stMontoTotalDist.reload();
                    if (identidadselectedPlanes != 0 && identidadselectedPlanes != null && identidadselectedPlanes != 'undefined') {
                        stDistribucion.reload();
                    }
                }
                console.log(rec.json.idplan711);
                idplan711= rec.json.idplan711;
            }
        }
    });

    //store del grid de Distribucion a distribuir 
    stDistribucion = new Ext.data.Store({
        url: 'listarDistribucion',
        reader: new Ext.data.JsonReader({
            //id: 'iddatoscodigo',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'iddatoscodigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'um'
            }, {
                name: 'precio'
            }, {
                name: 'monto'
            }, {
                name: 'idproducto711'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stDistribucion.baseParams.start = 0;
                stDistribucion.baseParams.identidad = identidadselectedPlanes;
                stDistribucion.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stDistribucion.baseParams.idempimp = cbEmpresasImp.getValue();
                stDistribucion.baseParams.idplan711 = idplan711;
            },
            load: function (str, rec, obj){
                band=str.reader.jsonData.band;
                listaanterior = rec;
            }
        }
    });

    //store del grid de monto total para ver la distribucion 
    stMontoTotalDist = new Ext.data.Store({
        url: 'listarMontoDisponible',
        reader: new Ext.data.JsonReader({
            //id: 'iddatoscodigo',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'iddatoscodigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'um'
            }, {
                name: 'precio'
            }, {
                name: 'monto'
            }, {
                name: 'idproducto711'
            }, {
                name: 'montoreal'
            }, {
                name: 'cantidadreal'
            }]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stMontoTotalDist.baseParams.start = 0;
                //stMontoTotalDist.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stMontoTotalDist.baseParams.idejercicio = idejer;
                stMontoTotalDist.baseParams.idempimp = cbEmpresasImp.getValue();
                stMontoTotalDist.baseParams.idplan711 = idplan711;
            },
            load: function (st, record, obj) {
                montototal.setText(addCommas(st.reader.jsonData.montototaldisponible));
                montototalreal.setText(addCommas(st.reader.jsonData.montototalreal));
            }
        }
    });

    smDistribucion = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    
    smDistribucionTotal = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    gpDistribucion = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stDistribucion,
        sm: smDistribucion,
        autoExpandColumn: 'expandir',
        cm: cmDistribucion,
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            getRowClass: function (record) {
                var css = '';
                if (record.data.idproducto711==null) {
                        css = 'codigosnegritos';
                }
                return css;
            }
        },
        loadMask: {
            msg: 'Cargando la planificación...'
        },
        listeners: {
            afteredit: function (e) {
                btnGuardarDist.enable();
                if ((e.field == "cantidad" && e.record.data.cantidad != null && e.record.data.precio != null )||
                        (e.field == "precio" && e.record.data.precio != null && e.record.data.cantidad != null)) {
                        valor = (parseFloat(e.record.data.cantidad) * parseFloat(e.record.data.precio)).toFixed(6);
                        smDistribucion.selectRow(e.row);
                        smDistribucion.getSelected().data.monto = valor;
                        smDistribucion.getSelected().commit();
                        smDistribucion.selectNext();
                }
            },
            beforeedit: function (object) {
                if ((object.field == "cantidad" && object.record.data.cantidad == null)||(object.field == "precio")||
                        (object.field == "monto" && object.record.data.cantidad != null && object.record.data.precio != null)) {
                    object.cancel = true;
                } else {
                    object.cancel = false;
                }
            },
            
        }
    });


    gpMontoTotalDist = new Ext.grid.GridPanel({
        frame: true,
        stripeRows: true,
        store: stMontoTotalDist,
        sm: smDistribucionTotal,
        enable: true,
        //hidden: true,
        id: 'gpMontoTotalDist',
        autoExpandColumn: 'expandir',
        cm: cmDistribucionTotal,
        //disabled: true,
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            getRowClass: function (record) {
                var css = '';
                if (record.data.idproducto711==null) {
                        css = 'codigosnegritos';
                }
                return css;
            }
        },
        loadMask: {
            msg: 'Cargando la planificación...'
        },
        listeners: {}
    });

    //panel para mostrar la distribucion que se realiza
    pPlanificacion = new Ext.Panel({
        layout: 'fit',
        region: 'center',
        frame: true,
        tbar: [btnGuardarDist, '-', btnVerModificaciones],
        title: 'Distribución a realizar para una empresa: ',
        //margins: '3 3 3 3',
        width: 500,
        height: 300,
        items: gpDistribucion
    });

    pDistribucion = new Ext.Panel({
        id: 'pDistribucion',
        title: perfil.etiquetas.titModelos,
        split: true,
        disabled: true,
        region: 'center',
        layout: 'border',
        items: [pPlanificacion]
    });

    pMontoTotalDist = new Ext.Panel({
        layout: 'fit',
        region: 'east',
        frame: true,
        disabled: true,
        //hidden: true,
        id: 'pMontoTotalDist',
        title: 'Disponibilidad de lo planificado',
        //margins: '3 3 3 3',
        width: '40%',
        //width: 500,
        //height: 300,
        tbar: ['->', 'Monto total disponible: ', montototal,'-','Monto total planificado: ', montototalreal],
        items: gpMontoTotalDist
    });
    //****************panel de solicitudes*******************
    pDistribucionTodas = new Ext.Panel({
        region: 'center',
        layout: 'border',
        items: [pDistribucion]
    });
    //****************************entidades********************************
    tpEstructuraPlanes = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 500

    });
    tpEstructuraPlanes.btnBuscar.setText("");
    tpEstructuraPlanes.btnLimpiar.setText("");
    tpEstructuraPlanes = tpEstructuraPlanes.items.items[0];
    tpEstructuraPlanes.getRootNode().expand();
    tpEstructuraPlanes.addListener('click', function (n) {
        if (n.text != 'Estructuras' && n.attributes.nivel != 0) {
            /*if (n.attributes.idorgano == 10016) {
                identidadselectedPlanes = 0;
                stDistribucion.removeAll();
                pDistribucion.disable();
                mostrarMensaje(1, 'La entidad seleccionada no pertenece al plan FAR');
                claseMask();                
            } else {*/
                tpEstructuraPlanes.getSelectionModel().select(n);
                cbEjercicioPlanes.enable();
                identidadselectedPlanes = n.id;
                hojaPlanes = n.leaf;
                denom_ent = n.text;
                stDistribucion.reload();
                pDistribucion.enable();
                pPlanificacion.enable();
                stMontoTotalDist.reload();
                cbEmpresasImp.enable();
                cbEjercicioPlanes.enable();
                pPlanificacion.setTitle('Distribución a realizar para: ' + denom_ent)
            //}
        } 
    });

    pEstructuras = new Ext.Panel({
        title: 'Entidades',
        layout: 'fit',
        region: 'west',
        //width: 250,
        width: '20%',
        disabled: true,
        collapsible: true,
        split: true,
        items: [tpEstructuraPlanes]
    });
    pEntPlan = new Ext.Panel({
        layout: 'border',
        region: 'west',
        width: 500,
        items: [pEstructuras]
    });
    //****************panel principal*******************
    pGeneral= null;
    if (recursos != 1) {
        pGeneral = new Ext.Panel({
            layout: 'border',
            tbar: ['Plan: ', cbEjercicioPlanes, '-', 'Empresa importadora: ', cbEmpresasImp, '-', '->', btnAyudaDistribucion],
            items: [pEstructuras, pDistribucion]
        });
        btnGuardarDist.hide();
    } else {
        pGeneral = new Ext.Panel({
            layout: 'border',
            tbar: ['Plan: ', cbEjercicioPlanes, '-', 'Empresa importadora: ', cbEmpresasImp, '-', '->', btnAyudaDistribucion],
            items: [pEstructuras, pDistribucion, pMontoTotalDist]
        });
    }
//                    pGeneral = new Ext.Panel({
//                        layout: 'border',
//                        tbar: ['Plan: ', cbEjercicioPlanes, '-', 'Empresa importadora: ', cbEmpresasImp, '-', '->', btnAyudaDistribucion],
//                        items: [pEstructuras, pDistribucion, pMontoTotalDist]
//                    });
    //******************viewport*****************
    myViewPlanes = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral],
        listeners: {
            afterlayout: function (e) {
                claseMask();
            }
        }
    });                    

        function claseMask() {
            var claseMask = document.getElementsByClassName('ext-el-mask');
            var maskEstructura = claseMask.item(0);
            var maskDistribucion = claseMask.item(1);
            (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
            (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
        }
        
    }


function GuardarDistribucion() {
        var modif = gpDistribucion.getStore().data.items;
        var distribuc = [];
        for (var i = 0, max = modif.length; i < max; i++) {
            distribuc.push(modif[i].data);
        }
        
        var anterior = gpDistribucion.getStore().reader.jsonData.data;
        var listaanterior = [];
        for (var i = 0, max = anterior.length; i < max; i++) {
            listaanterior.push([anterior[i].monto, anterior[i].iddatoscodigo, anterior[i].idproducto711]);
        }
        var modiftotal = gpMontoTotalDist.getStore().data.items;
        var distribuctotal = [];
        for (var i = 0, max = modiftotal.length; i < max; i++) {
            distribuctotal.push(modiftotal[i].data);
        }
        bandera=false;
                
        denominacionerrorea ="";
        for (var i = 0, max = distribuc.length; i < max; i++) {
            for (var j = 0; j < distribuctotal.length; j++) {
                for (var t = 0; t < listaanterior.length; t++) {
                    if(distribuctotal[j].iddatoscodigo == distribuc[i].iddatoscodigo && distribuctotal[j].idproducto711 == distribuc[i].idproducto711 
                            && distribuctotal[j].iddatoscodigo == listaanterior[t][1]  && distribuctotal[j].idproducto711 == listaanterior[t][2]){
                        if((parseFloat(distribuc[i].monto)-parseFloat(listaanterior[t][0])) > parseFloat(distribuctotal[j].monto)){
                            bandera=true;
                            denominacionerrorea =distribuctotal[j].denominacion;
                        }
                    }
                }
            }
        }
        if(bandera==false){
            mymask.show();
            Ext.Ajax.request({
                url: 'adicionarModificarDistr',
                params: {
                    idejercicio: cbEjercicioPlanes.getValue(),
                    idplan711: idplan711,
                    distribuc: Ext.encode(distribuc),
                    idempimp: cbEmpresasImp.getValue(),
                    identidad: identidadselectedPlanes,
                    textomotivo: textomotivo
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La distribución se ha realizado satisfactoriamente');
                        stDistribucion.reload();
                        stMontoTotalDist.reload();
                    } else {
                        mostrarMensaje(2, 'Ha ocurrido un error en la operación');
                    }
                }
            });
        }else{
            mostrarMensaje(2, 'El monto distribuido en el parámetro de planificación '+denominacionerrorea+' es mayor al disponible');
        }    
}

function addCommas(nStr) {
    nStr+='';
    ds=nStr.replace(/,/g,'');
    nStr = ds; 
    var x = nStr.split('.'); 
    var x1 = x[0]; 
    var x2 = x.length > 1 ? '.' + x[1] : ''; 
    var rgx = /(\d+)(\d{3})/; 
    while (rgx.test(x1)) { 
      x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
    }
    return x1 + x2; 
} 
function RenderaddCommas(nStr, m) {
    nStr+='';
    ds=nStr.replace(/,/g,'');
    nStr = ds; 
    var x = nStr.split('.'); 
    var x1 = x[0]; 
    var x2 = x.length > 1 ? '.' + x[1] : ''; 
    var rgx = /(\d+)(\d{3})/; 
    while (rgx.test(x1)) { 
      x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
    }
    salida=((x1 + x2)=='null')?'':(x1 + x2);
    console.log(salida);
    m.attr = 'ext:qtip="' + salida + '"';
    return salida; 
}