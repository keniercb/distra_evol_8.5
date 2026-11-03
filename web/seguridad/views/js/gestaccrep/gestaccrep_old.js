var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();


var auxiliar,formulario,accion,boton,stgpReportes,gpAcciones,gpReportes,fila,stgpParametros,idreporte,arrayreportesini = [],bandera = 0,bandera1 = 0,idfuncionalidad;
function cargarInterfaz()
{

    var btnaceptar=  new Ext.Button({
        icon:perfil.dirImg+'aceptar.png',
        iconCls:'btn',
        text:'Guardar cambios',
        handler:function(){
            adicionarrepacciones('btn');
        }
    });
    var btnAdicionar = new Ext.Button({
        id:'btnAgrAccion',
        icon:perfil.dirImg+'adicionar.png',
        iconCls:'btn',
        text:'Aceptar',
        handler:function(){
            winForm('Ins');
        }
    });
    ////------------ Arbol Acciones ------------////
    var arbolAcc = new Ext.tree.TreePanel({
        title:'Arbol de sistemas',
        collapsible:true,
        autoScroll:true,
        region:'west',
        split:true,
        width:'30%',
        loader: new Ext.tree.TreeLoader({
            dataUrl:'cargarsistfunc',
            listeners:{
                'beforeload':function(atreeloader, anode){
                    atreeloader.baseParams = {};
                    if(anode.attributes.idsistema)
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema
                }
            }

        })
    });
    ////------------ Crear nodo padre del arbol ------------////
    var padreArbolAcc = new Ext.tree.AsyncTreeNode({
        text:'Sistemas',
        expandable:false,
        expanded:true,
        frame:false,
        id:'0'
    });

    arbolAcc.setRootNode(padreArbolAcc);

    ////------------ Evento para habilitar botones ------------////
    arbolAcc.on('click', function (node, e){
        stgpAcciones.removeAll();
        if (node.isLeaf())
        {
            gpAcciones.enable();
            idfuncionalidad = node.attributes.idfuncionalidad;
            stgpAcciones.removeAll();
            stgpAcciones.load({
                params:{
                    start:0,
                    limit:15
                }
            });
            stgpReportes.removeAll();

        }
    }, this);




    ////------------ Seleccion model GridPanel Reportes ------------////
    sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect:false
    });
    bandera = 1;

    sm.on('rowdeselect', function (SelectionModel, rowIndex, record) {

        }, this);

    sm.on('rowselect', function (SelectionModel, rowIndex, record) {
        bandera1 = 1;
    }, this);

    ////------------ Seleccion model GridPanel Aciones ------------////
    smacc = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });
    smacc.on('beforerowselect', function (smodel, rowIndex, keepExisting, record)
    {
        accion = record.data.idaccion;
        gpReportes.enable();
        adicionarrepacciones();
        sm.clearSelections();
        stgpReportes.load();
    }, this);

    ////------------ Store GridPanel Acciones ------------////
    stgpAcciones =  new Ext.data.Store({
        url: 'cargargridacciones',
        listeners:{
            'beforeload':function(thisstore,objeto){
                objeto.params.idfuncionalidad = idfuncionalidad
            }
        },
        reader:new Ext.data.JsonReader(
        {
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id"
        },
        [
        {
            name:'idaccion',
            mapping:'idrecurso'
        },
        {
            name:'denominacion',
            mapping:'denominacion'
        },
        {
            name:'abreviatura',
            mapping:'abreviatura'
        }
        ])
    });

    ////------------ GridPanel Acciones ------------////
    gpAcciones = new Ext.grid.EditorGridPanel({
        title:'Acciones',
        frame:true,
        disabled:true,
        split:true,
        margins:'3 1 3 3',
        width:'30%',
        region:'center',
        autoExpandColumn:'exp',
        store : stgpAcciones,
        sm:smacc,
        columns: [
        {
            hidden: true,
            hideable: false,
            dataIndex: 'idaccion'
        },

        {
            header: 'Denominaci&oacute;n',
            width:150,
            dataIndex: 'denominacion'
        },

        {
            id:'exp',
            header: 'Abreviatura',
            width:150,
            dataIndex: 'abreviatura'
        }
        ],

        loadMask:{
            store:stgpAcciones
        },
        tbar:[
        new Ext.Toolbar.TextItem('Buscar'),
        funcionalidad = new Ext.form.TextField({
            width:150,
            id: 'accion'
        }),
        new Ext.menu.Separator(),
        new Ext.Button({
            icon:perfil.dirImg+'buscar.png',
            iconCls:'btn',
            text:'Buscar',
            handler:function(){
                buscarAcciones(funcionalidad.getValue());
            }
        })
        ],

        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            store: stgpAcciones,
            //displayInfo: true,
            displayMsg: 'Resultados {0} - {1} de {2}',
            emptyMsg: "Ning&uacute;n resultado para mostrar"
        })
    });

    ////------------ Store GridPanel Reportes ------------////

    stgpReportes =  new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'cargarreportes'
        }),
        reader:new Ext.data.JsonReader(
        {
            totalProperty: "count",
            root: "data",
            id: "id"
        },
        [
        {
            name:'id' ,
            mapping:'id'
        },

        {
            name:'title',
            mapping:'title'
        }
        ]),

        listeners:{
            'load':function(thisstore,store,objeto){
                cargarrepoasociados(store);
            }
        }

    });

    ////------------ GridPanel Reportes ------------////
    gpReportes = new Ext.grid.GridPanel({
        title:'Reportes',
        frame:true,
        margins:'3 3 3 1',
        width:'30%',
        split:true,
        disabled:true,
        region:'east',
        store:stgpReportes,
        autoExpandColumn:'exp',
        sm:sm,
        columns: [new Ext.grid.CheckboxSelectionModel(),
        {
            hidden: true,
            hideable: false,
            dataIndex: 'id'
        },

        {
            id:'exp',
            header:'Denominaci&oacute;n',
            width:150,
            dataIndex: 'title'
        },
        ],
        loadMask:{
            store:stgpReportes
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            store: stgpReportes,
            displayMsg: 'Resultados {0} - {1} de {2}',
            emptyMsg: "Ning&uacute;n resultado para mostrar"
        })

    });

    var stgpParametros = new Ext.data.SimpleStore({
        fields: [
        {
            name: 'name',
            mapping:'name'
        },

        {
            name: 'type',
            mapping:'type'
        },

        {
            name: 'defaultValue',
            mapping:'defaultValue'
        }
        ]
    });
    ////------------ GridPanel Parametros ------------////
    gpParametros = new Ext.grid.GridPanel({
        frame:true,
        margins:'3 3 3 1',
        region:'center',
        store:stgpParametros,
        autoExpandColumn:'exp',
        sm:sm,
        columns: [
        {
            header:'Nombre',
            dataIndex: 'name'
        },

        {
            id:'exp',
            header:'Tipo',
            width:150,
            dataIndex: 'type'
        },

        {
            header:'Valor por defecto',
            width:150,
            dataIndex: 'defaultValue'
        }
        ],
        loadMask:{
            store:stgpParametros
        }
    });
    var menu = new Ext.menu.Menu({
        id:'submenu',
        items: [{
            text:'Ver par&aacute;metros',
            scope: this,
            handler:function(){
                cargarParametros(gpReportes.getStore().getAt(fila).id);
                ventanaparametros();
                idreporte = gpReportes.getStore().getAt(fila).id;
            }
        }]
    });
    var formreporte = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        height:370,
        items: [{
            layout:'column',
            items:[{
                xtype:'textarea',
                name: 'descripcion',
                disabled:true,
                emptyText:'parametros: * valor:Valor por defecto',
                width:300,
                height:300,
                anchor:'100%'
            }]
        }]
    });

    gpReportes.on('rowcontextmenu', function(smodel, rowindex, comp)
    {
        fila = rowindex;
           			comp.stopEvent();
                 	menu.showAt(comp.getXY());
    },this);

    ////------------- Render  the window------------- ////
    var formulario = new Ext.Panel({
        layout:'border',
        items:[arbolAcc,gpAcciones,gpReportes],
        bbar:['->',btnaceptar]
    });
    ////------------- ViewPort -------------////
    var vpGestAccRep = new Ext.Viewport({
        layout:'fit',
        items:formulario

    })

    ////------------ Adicionar Acciones ------------////

    function adicionarrepacciones(btn)
    {
        boton = btn;
        var arrayreportesAdd = [];
        var arrayreportesElim = [];
        if(bandera1)
        {
            if(arrayreportesini.length > 0){
                arrayreportesElim = eliminarReportes(sm.getSelections(),arrayreportesini);
            }

            if(sm.getSelections().length > 0)
            {
                arrayreportesAdd = addReportes(sm.getSelections(),arrayreportesini);
            }

            if(arrayreportesAdd.length > 0 ||arrayreportesElim.length > 0)
            {

                //Ext.getBody().mask('Por favor espere....');
                Ext.Ajax.request({
                    url:'relacionaraccrep',
                    method:'POST',
                    waitMsg:'Adicionando acci&oacute;n...',
                    params:{
                        idaccion:smacc.getSelected().data.idaccion,
                        reportesAdd:Ext.encode(arrayreportesAdd),
                        reportesElim:Ext.encode(arrayreportesElim)
                    },
                    callback: function (options,success,response){
                        responseData = Ext.decode(response.responseText);
                        if(responseData.bien==1)
                        {
                            arrayreportesAdd = [];
                            arrayreportesElim = [];
                            arrayreportesini = [];
                            if(boton == 'btn'){
                                stgpAcciones.removeAll();
                                stgpReportes.removeAll();
                                gpAcciones.disable();
                                gpReportes.disable();
                                boton = 0;
                            }
                        }
                        if(responseData.bien==2)
                        {
                            arrayreportesAdd = [];
                            arrayreportesElim = [];
                            arrayreportesini = [];
                            if(boton == 'btn'){
                                stgpAcciones.removeAll();
                                stgpReportes.removeAll();
                                gpAcciones.disable();
                                gpReportes.disable();
                                boton = 0;
                            }
                        }
                    }
                });
            }
            else
            {
                if(btn)
                {
                    stgpAcciones.removeAll();
                    stgpReportes.removeAll();
                    gpAcciones.disable();
                    gpReportes.disable();
                }
                arrayreportesini = [];
                arrayreportesAdd = [];
                arrayreportesElim = [];
                return;
            }

        }
        else
        {
            arrayreportesini = [];
            arrayreportesAdd = [];
            arrayreportesElim = [];
            return;
        }
    }

    function cargarrepoasociados(store)
    {
        Ext.getBody().mask('Por favor espere....');
        Ext.Ajax.request({
            url: 'reportesasociadosarep',
            method:'POST',
            params:{
                idaccion:accion
            },
            callback: function (options,success,response){
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                var sm =  gpReportes. getSelectionModel();
                arreglo = [];
                if(bandera)
                {
                    for(i=0 ;i < responseData.datos.length; i++)
                    {
                        arrayreportesini.push(responseData.datos[i].idreporte);
                        for(j=0 ;j < store.length; j++)
                        {
                            if(responseData.datos[i].idreporte == store[j].id)
                            {
                                arreglo.push(j);
                            }
                        }
                    }
                    sm.selectRows(arreglo,true);
                    arreglo = [];
                }
                bandera = 1;
            }
        });
    }

    function eliminarReportes(reportes,arrayreportesini)
    {
        var arrayreportesElim = [];
        var estaenarray = 0;
        for(i=0 ;i < arrayreportesini.length; i++)
        {
            estaenarray = 0;
            for(j= 0 ;j < reportes.length; j++)
            {
                if(arrayreportesini[i] == reportes[j].id)
                {
                    estaenarray = 1;
                    break;
                }
            }
            if(estaenarray == 0)
            {
                arrayreportesElim.push(arrayreportesini[i]);
            }
        }
        return arrayreportesElim;
    }

    function addReportes(reportes,arrayreportesini)
    {
        var arrayreportesAdd = [];
        if(arrayreportesini.length == 0)
        {
            for(j=0 ;j < reportes.length; j++)
            {
                var datos = [];
                datos.push(reportes[j].id);
                datos.push(reportes[j].data.title);
                arrayreportesAdd.push(datos);
            }
        }
        else{
            for(i=0 ;i < reportes.length; i++)
            {
                var datos = [];
                var estaenarray = 0;
                for(h= 0 ;h < arrayreportesini.length; h++)
                {
                    if(reportes[i].id == arrayreportesini[h])
                    {
                        estaenarray = 1;
                        break;
                    }
                }
                if(estaenarray == 0)
                {
                    datos.push(reportes[i].id);
                    datos.push(reportes[i].data.title);
                    estaenarray = 0;
                    arrayreportesAdd.push(datos);
                    datos = [];
                }

            }
        }
        return arrayreportesAdd;
    }
    ////------------Ventana para cargar el arbol de estructuras-----------///////
    function ventanaparametros()
    {
        winParametros= new Ext.Window({
            modal: true,
            closeAction:'hide',
            layout:'fit',
            title:'Par&aacute;metros del reporte',
            width:400,
            height:300,
            resizable:false,
            buttons:[
            {
                icon:perfil.dirImg+'cancelar.png',
                iconCls:'btn',
                id:'estcan',
                text:'Cerrar',
                handler:function(){
                    winParametros.hide();
                }
            }]
        });

        winParametros.add(gpParametros);

        winParametros.doLayout();
        winParametros.show();
    }
    function cargarParametros(idreportebuscar)
    {
        Ext.getBody().mask('Por favor espere....');
        Ext.Ajax.request({
            url: 'buscarparametros',
            method:'POST',
            params:{
                idreporte:idreportebuscar
            },
            callback: function (options,success,response){
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                stgpParametros.loadData(responseData);
            }
        });

    }

    function buscarAcciones(abreviatura) {
        stgpAcciones.baseParams = {};
        stgpAcciones.baseParams.abreviatura = abreviatura;
        stgpAcciones.load({
            params:{
                start:0,
                limit:15
            }
        });
    }
}
Ext.onReady(OnExtLoad);
function OnExtLoad() {
    Ext.QuickTips.init();
    cargarInterfaz();
}