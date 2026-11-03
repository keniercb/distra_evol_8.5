function cargarInterfaz()
{
    Ext.Ajax.timeout = 1000000000;

    //componente para el manejo de los mensajes de errores de texto regido
    ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    BarraProgresoPermisos = new BarraEstado();

    btnAdicionar = new Ext.Button({
        id: 'btnAgr',
        //icon: perfil.dirImg + 'adicionar.png', 
        iconCls: 'adicionar',
        text: 'Adicionar',
        handler: function() {


        },
        tooltip: 'Adicionar permisos',
        key: {
            alt: true ,
            key: 'I'
        },
        scope: this
    });
    btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnMod',
        //icon: perfil.dirImg + 'modificar.png',
        iconCls: 'modificar',
        text: 'Modificar',
        handler: function() {


        },
        tooltip: 'Modificar permisos',
        key: {
            alt: true ,
            key: 'M'
        },
        scope: this
    });
    btnEliminar = new Ext.Button({
        disabled: true,
        id: 'btnEli',
        //icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'eliminar',
        text: 'Eliminar',
        handler: function() {

        },
        tooltip: 'Eliminar permisos',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    //mapear la funcionalidad con la funcionalidad del xml
    var rdItegrar = Ext.data.Record.create([
        {name: 'nombre'},
        {name: 'integrado'}
    ]);
    //store que carga el xml
    var stIntegrar = new Ext.data.Store({
        url: 'cargarintegracion',
        reader:
            new Ext.data.XmlReader({record: "person"}, rdItegrar)});
    stIntegrar.load();
    console.debug(stIntegrar.data)
    //grid de Integrar
    var gpIntegrar = new Ext.grid.GridPanel({
        store: stIntegrar, //le asignamos la fuente de datos
        columns: [ //creamos las columnas
            new Ext.grid.RowNumberer(), //numeramos las filas
            {header:'Funcionalidad', dataIndex:'nombre',sortable: true},
            {header:'Integrado', dataIndex:'integrado',sortable: true},
        ],
        border: false, //le quitamos el borde
        stripeRows: true //le asignamos rayas a las filas
    });
    var plIntegrar = new Ext.Panel({
        id: 'panelintegrar',
        layout: 'fit',
        tbar: ['-',btnAdicionar,'-',btnModificar,'-',btnEliminar],
        usarKeymap:true,
        botonesKeymap: [btnAdicionar,btnModificar,btnEliminar],
        items: [gpIntegrar]

    });
    var vpIntegrar = new Ext.Viewport({
        layout: 'fit',
        //tbar:[btnAyuda],
        items: [plIntegrar]
    });
}

cargarInterfaz();
