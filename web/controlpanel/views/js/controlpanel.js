
/*----------------------------------------------------------------------------
 *--------------------------Expresiones Regulares-----------------------------*/
var esDirIp, tipos, puerto;
puerto = /^[0-9]+$/;
tipos = /^([a-zA-Z???????? ]+[a-zA-Z????????\d _.-]*)+$/;
esDirIp = /(^(2([0-4][0-9])|2(5[0-5]))|^([0-1]?[0-9]?[0-9]))\.(((2([0-4][0-9])|2(5[0-5]))|([0-1]?[0-9]?[0-9]))\.){2}((2([0-4][0-9])|2(5[0-5]))|([0-1]?[0-9]?[0-9]))$/;

var icon_dir = '../../../lib/ExtJS/temas/default/images/iconos/';
this.flag = [];

/**
 * Funcion para enviar datos del gridRepositorios
 *
 * */
function activar() {
    var reposActivos = new Array();
    var activos = new Array();
    reposActivos = checkColumn.getRows();
    for (var i = 0; i < reposActivos.length; i++) {
        activos[i] = reposActivos[i].data;
    }
    var encoded = Ext.encode(activos);
    cargarStoreXML(encoded);
    stcargarXML.removeAll();
    stcargarXML.load();
    //

}

var actionrow = new Ext.ux.grid.RowActions({
    //header:'Actions',
    keepSelection: true,
    // hidden : true,
    actions: [
        {
            iconCls: 'eliminar',
            tooltip: 'Eliminar'
        }
    ], callbacks: {

        'eliminar': function (grid, record, action, row, col) {
            /*  //console.log('cancelar');
             //console.log('row',row);

             //var models = grid.getStore().getRange();*/
            var models = grid.getStore().data.items[row];
            var estado  = models.data.ESTADO;
            if(estado == 'No instalado'){

            }else{
                mostrarMensaje(6,'El paquete seleccionado no se puede eliminar debido a que esta en uso.');
            }
            /* //console.log('grid',grid.getStore());
             //console.log(models)
             models.set('estado', models.json.estado);
             models.set('clasificacion', models.json.clasificacion);
             me.expander.collapseRow(row);
             models.reject();
             //Ext.getCmp('gpNoconformidades').getView().refresh();
             //console.log(grid.getStore().getModifiedRecords());
             if(grid.getStore().getModifiedRecords().length!=0)
             {
             Ext.getCmp('btnguardarcambios').setDisabled(false);
             //console.log('se mantienen los cambios');
             }
             else
             {
             Ext.getCmp('btnguardarcambios').setDisabled(true);
             //console.log('no hay mas cambios cambios');
             }*/


        }
    }
});

/**
 * carga store con los repositorios actuales
 * */
this.stcargarXMLRepo = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: 'cargarxmlRepositorio'

    }),
    reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id_grid_repo"
        },
        [
            {
                name: 'DIR'
            },
            {
                name: 'active',
                type: 'bool'
            }
        ])
});

/**
 * Crea store con los paquetes que contiene el repositorio local
 * */

this.stcargarAppsLocal = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: 'cargarAppLocal'

    }),
    reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id_combo_app"
        },
        [
            {name: 'NAME'
            },
            {name: 'ESTADO'
            },
            {name: 'VERSION'
            }
        ])
});
stcargarAppsLocal.load();

/**
 * Crea store con los paquetes que contienen todos los repositorios
 * */
this.stcargarXML = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: 'cargarxml',
        baseParams: {
            founded: 'default_value'
        }
    }),
    reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id"
        },
        [
            {name: 'NAME'
            },
            {name: 'ID'
            },
            {name: 'ESTADO'
            },
            {name: 'DENOMINACION'
            },
            {name: 'VERSIONINSTALADA'
            },
            {name: 'VERSION'
            },
            {name: 'URI'
            },
            {name: 'DEPENDENCIAS'
            },
            {name: 'DESCRIPCION'
            },
            {name: 'DESCRIPCIONPRINCIPAL'
            },
            {name: 'NAMEPAQUETE'
            },
            {name: 'LOGO'
            },
            {name: 'NAMEPRODUCT'
            },
            {name: 'AUTOR'
            }
        ])

});

var storeEstado = new Ext.data.SimpleStore({
    fields: ['name'],
    data : [['Instalado'],['No instalado'],['Desactualizado']]
});

/**
 * funcion cargar los datos en el grid que son recibidos de los repositorios
 * */
function cargarStoreXML(test) {
    Ext.Ajax.request({
        url: 'activarRepo',
        params: {founded: test},
        callback: function(options, success, response) {
            if (!success) {
                mostrarMensaje(1, menssage);
            }
        }
    });
}

/**
 * Botón buscar
 * */
var ayuda = new Ext.Button({
    text: 'Ayuda',
    id: 'ayuda',
    icon: icon_dir + 'ayuda.png',
    iconCls: 'btn',
    tooltip: 'Ayuda <b>(Alt+H)</b>',
    handler: function() {
        principalHelp();
    }
});
function principalHelp() {
    var title = 'Gestor de paquetes';
    var referencia = 'controlpanel';
    help.show(title, referencia);
}
var versionMayor = false;
var datos_actualizar;
var instalar = new Ext.Button({
    text: "<U>I</U>nstalar",
    id: 'instalar',
    disabled: true,
    icon: icon_dir + 'incluir.png',
    iconCls: 'btn',
    tooltip: 'Instalar paqute <b>(Ctrl+Shift+I)</b>',
    handler: function() {
        instalarPaquete();
    }
});
function revertirPaquete(){
    infoSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    if (!infoSelect) {
        Ext.MessageBox.alert('Información', 'Debe seleccionar un paquete.');
    }
    else {
        this.appname = infoSelect.data.NAME,
            this.appversion = infoSelect.data.VERSION,
            Ext.Ajax.request({
                url: 'comprobarUtlizacion',
                method: 'POST',
                params: {
                    metodo: 'revertir',
                    nameapp: this.appname,
                    appversion: this.appversion
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var conexion = responseData.conexion;
                    if (responseData.succes === true) {
                        var instalar = responseData.instalar;
                        var desinstalar = responseData.desinstalar;
                        var actualizar = responseData.actualizar;

                        cargarInterfaz(conexion, instalar,desinstalar,actualizar, 'revert');

                    } else {
                        var menssage = responseData.datos;
                        mostrarMensaje(6, menssage);

                    }

                }

            });

    }
}
function instalarPaquete() {
    infoSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    if (!infoSelect) {
        Ext.MessageBox.alert('Informaci&oacute;n', 'Debe seleccionar un elemento.');
    }
    else {
        this.appname = infoSelect.data.NAME,
            this.appversion = infoSelect.data.VERSION,
            Ext.Ajax.request({
                url: 'comprobarUtlizacion',
                method: 'POST',
                params: {
                    metodo: 'instalar',
                    nameapp: this.appname,
                    appversion: this.appversion
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var menssage = responseData.datos;
                    var conexion = responseData.conexion;

                    var instalar = responseData.instalar;
                    var desinstalar = responseData.desinstalar;
                    var actualizar = responseData.actualizar;
                    //console.log('cnx1', conexion);
                    if (responseData.succes == true) {
                        cargarInterfaz(conexion, instalar, desinstalar, actualizar, 'install');
                    } else {
                        mostrarMensaje(4, responseData.version, null, menssage)(conexion, menssage);
                    }

                }

            });
        this.instalar.disable();
    }
}
/**
 * Botón desintalar
 * */
var desintalar = new Ext.Button({
    text: "<U>D</U>esinstalar",
    disabled: true,
    icon: icon_dir + 'deshacer.png',
    iconCls: 'btn',
    tooltip: 'Desinstalar paquete <b>(Ctrl+Shift+D)</b>',
    id:'btoDesinstalar',
    handler: function() {
        desintalarPaquete();
    }
});
function desintalarPaquete() {
    infoSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    if (!infoSelect) {
        Ext.MessageBox.alert('Informaci&oacute;n', 'Debe seleccionar un elemento.');
    }
    else {

        this.appname = infoSelect.data.NAME,
        //this.appversion = infoSelect.data.VERSION,
        this.appversion = infoSelect.data.VERSIONINSTALADA,

            Ext.Ajax.request({
                url: 'comprobarUtlizacion',
                method: 'POST',
                params: {
                    metodo: 'desintalar',
                    nameapp: this.appname,
                    appversion: this.appversion
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var menssage = responseData.datos;
                    if (responseData.succes == true) {
                        cargarInterfaz(false, false, menssage, false, 'uninstall');

                    } else {
                        Ext.MessageBox.alert('Información', menssage);

                    }
                }
            });
    }
}
/*
*
* */
var winActualizarR;
var expanded11=false;
var expanded22=false;
var expanded33=false;

function cargarInterfazActualizarRevert(pinstalar, pactualizar, pdesinstalar, conexion) {
    informations_Select = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    this.desc = informations_Select.data.DESCRIPCION,
        this.depend = informations_Select.data.DEPENDENCIAS
    var infoSelect = new Ext.form.FieldSet({
        title: 'Información',
        id: 'opcion',
        autoHeight: true
    });
    var instalaritem={
        columnWidth: 1,
        items: new Ext.form.FieldSet({
            autoScroll: true,
            layout: 'form',
            title: 'Aplicaciones a instalar',
            autoWidth: true,
            html: pinstalar,
            height: 80,
            width: 355,
            collapsed: true,
            collapsible: true,
            listeners: {
                expand: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded11=true;
                        var plus=40;
                        if(expanded11){
                            plus=plus+55;
                        }if(expanded22){
                            plus=plus+55;
                        }if(expanded33){
                            plus=plus+55;
                        }
                        var height=winActualizarR.height+plus;
                        winActualizarR.setSize(400,height);
                    }
                },
                collapse: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded11=false;
                        var plus=40;
                        if(expanded11){
                            plus=plus+55;
                        }if(expanded22){
                            plus=plus+55;
                        }if(expanded33){
                            plus=plus+55;
                        }
                        var height=winActualizarR.height+plus;                                ;
                        winActualizarR.setSize(400,height);
                    }
                }
            }
        })
    };
    var actualizaritem={
        columnWidth: 1,
        items: new Ext.form.FieldSet({
            autoScroll: true,
            layout: 'form',
            title: 'Aplicaciones a actualizar',
            autoWidth: true,
            html: pactualizar,
            height: 80,
            width: 355,
            collapsed: true,
            collapsible: true,
            listeners: {
                expand: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded22=true;
                        var plus=40;
                        if(expanded11){
                            plus=plus+55;
                        }if(expanded22){
                            plus=plus+55;
                        }if(expanded33){
                            plus=plus+55;
                        }
                        var height=winActualizarR.height+plus;
                        winActualizarR.setSize(400,height);
                    }
                },
                collapse: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded22=false;
                        var plus=40;
                        if(expanded11){
                            plus=plus+55;
                        }if(expanded22){
                            plus=plus+55;
                        }if(expanded33){
                            plus=plus+55;
                        }
                        var height=winActualizarR.height+plus;                                ;
                        winActualizarR.setSize(400,height);
                    }
                }
            }
        })
    };
    var desintalaritem={
        columnWidth: 1,
        items: new Ext.form.FieldSet({
            autoScroll: true,
            layout: 'form',
            title: 'Aplicaciones a desinstalar',
            autoWidth: true,
            html: pdesinstalar,
            height: 80,
            width: 355,
            collapsed: true,
            collapsible: true,
            listeners: {
                expand: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded33=true;
                        var plus=40;
                        if(expanded11){
                            plus=plus+55;
                        }if(expanded22){
                            plus=plus+55;
                        }if(expanded33){
                            plus=plus+55;
                        }
                        var height=winActualizarR.height+plus;
                        winActualizarR.setSize(400,height);
                    }
                },
                collapse: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded33=false;
                        var plus=40;
                        if(expanded11){
                            plus=plus+55;
                        }if(expanded22){
                            plus=plus+55;
                        }if(expanded33){
                            plus=plus+55;
                        }
                        var height=winActualizarR.height+plus;                                ;
                        winActualizarR.setSize(400,height);
                    }
                }
            }
        })
    };
    if(pinstalar!='Sin cambios<br />'){
        infoSelect.add(instalaritem);
    }
    if(pactualizar!='Sin cambios<br />'){
        infoSelect.add(actualizaritem);
    }
    if(pdesinstalar!='Sin cambios<br />'){
        infoSelect.add(desintalaritem);
    }
    if (!conexion) {

        var form_interfaz_actualziar = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'simple',
            frame: true,
            width: 400,
            height: 500,
            items: [infoSelect]
        });
    } else {
        var campos_bd = new Ext.form.FieldSet({
            title: 'Conexi&oacute;n de base de datos',
            id: 'datconexion',
            autoHeight: true,
            autoWidth: true,
            margin: 5,
            items: [
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        id: 'formConect',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Servidor',
                                name: 'servidor',
                                id: 'servidor',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                value: 'localhost',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Base datos',
                                name: 'basedatos',
                                id: 'basedatos',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                regex: tipos,
                                regexText: 'Este valos es incorrecto.',
                                value: 'zeolides',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Puerto',
                                id: 'puerto',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                maskRe: puerto,
                                regex: puerto,
                                value: '5432',
                                regexText: 'Solo números.',
                                anchor: '95%',
                                maxLength: 30

                            }]
                    },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'Usuario',
                                name: 'usuario',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                id: 'usuario',
                                value: 'postgres',
                                anchor: '95%',
                                maxLength: 30
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Contrase&ntilde;a',
                                name: 'password',
                                blankText: 'Este campo es requerido.',
                                inputType: 'password',
                                allowBlank: false,
                                id: 'password',
                                anchor: '95%',
                                value: 'postgres'
                            }]
                        }]
                }]

        });
        var form_interfaz_actualziar = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'simple',
            frame: true,
            width: 400,
            height: 200,
            items: [infoSelect, campos_bd]
        });


    }
    function winFormActualizarRevert() {
        winActualizarR = new Ext.Window({
            layout: 'fit',
            id: 'winActualizar',
            y: 100,
            width: 400,
            closable: true,
            draggable: true,
            modal: true,
            height: 300,
            resizable: false,
            title: 'Actualizar aplicación',
            buttons: [
                {
                    text: 'Cancelar',
                    tooltip: '',
                    icon: icon_dir + 'cancelar.png',
                    iconCls: 'btn',
                    handler: function() {
                        Ext.getCmp('winActualizar').destroy();
                    }
                },
                {
                    text: 'Aceptar',
                    tooltip: '',
                    icon: icon_dir + 'aceptar.png',
                    iconCls: 'btn',
                    handler: function() {
                        showResultadoActualizarRevert();
                    }
                }],
            keys:[
                {
                    key:'x',
                    alt:true,
                    handler:function(){
                        Ext.getCmp('winActualizar').destroy();
                    }
                },{
                    key:13,
                    alt:false,
                    ctrl:false,
                    shift:false,
                    handler:function(){
                        showResultadoActualizarRevert();
                    }
                }
            ]

        });
        winActualizarR.add(form_interfaz_actualziar);
        if (conexion) {
            winActualizarR.setHeight(340);
        } else {
            winActualizarR.setHeight(160);
        }
        winActualizarR.doLayout();
        winActualizarR.show();
    }
    winFormActualizarRevert();

}
    /**
 *Interfaz utilizada para instalar paquetes
 */
var winIns;
function cargarInterfaz(check, install, uninstall, update, scope) {

    informations_Select = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    this.desc = informations_Select.data.DESCRIPCION;
    this.depend = informations_Select.data.DEPENDENCIAS;
    this.name = informations_Select.data.NAME;
    this.logo = informations_Select.data.LOGO;

    var titleWindows = '';
    var textLabel = '';

    switch (scope) {
        case 'install':   //install
            titleWindows = 'Instalar paquete';
            textLabel = '¿Desea instalar el paquete '+ this.name + '?';

        break;
        case 'update':   //uninstall
            titleWindows = 'Actualizar paquete';
            textLabel = '¿Desea actualizar el paquete '+ this.name + '?';
        break;
        case 'revert':   //uninstall
            titleWindows = 'Revertir actualizaci&oacute;n';
            textLabel = '¿Desea revertir la actualización del paquete '+ this.name + '?';
        break;
        case 'uninstall':   //uninstall
            titleWindows = 'Desinstalar aplicaci&oacute;n';
            textLabel = '¿Desea desinstalar el paquete '+ this.name + '?';
        break;

    }

    //var tpl = new Ext.Template(style);
    //var detailPanel = Ext.getCmp('panelDesc');
    //Ext.getCmp('panelDesc').expand(true);
    //tpl.overwrite(detailPanel.body,e);
    var label =  new Ext.form.Label({
        text : textLabel
    });

    var infoSelect = new Ext.form.FieldSet({
        title: 'Informaci&oacute;n',
        id: 'opcion',
        //height: 210,
        height: (install == false) ? 240 : 310,
        layout:'column',
        items: [
            {
                xtype: 'panel',
                //title: "Logo",
                height: 80,
                layout: "absolute",
                columnWidth: (install == false) ? .35 : .20,
                html: "<img src='"+this.logo+"' width='60%' height='50%'>"

            },
            {   xtype: 'panel',
                columnWidth: (install == false) ? .65 : .44,
                id:'panelInstalar',
                //title:'Desea instalar el paquete'+ this.name + '?',
                height: 245,
                autoScroll: true,
                layout: 'absolute',
                items:[label,{
                    xtype: 'fieldset',
                    title: "Aplicaciones que se instalar&aacute;n",
                    id:'fielsetInstalar',
                    collapsible: true,
                    hidden : (install == false) ? true : false,
                    //height: 100,
                    width: 225,
                    autoHeight: true,
                    x:0,
                    y:(scope == 'revert') ? 25 : 20,
                    //layout: "absolute",
                    html: install,
                    listeners:{
                        'beforerender': function(){



                        }
                    }

                },{
                    xtype: 'fieldset',
                    title: "Aplicaciones que se desinstalar&aacute;n",
                    id:'fielsetDesinstalar',
                    collapsible: true,
                    hidden : (uninstall == false) ? true : false,
                    //height: 100,
                    width: 225,
                    autoHeight: true,
                    x:0,
                    y:20,
                    //layout: "absolute",
                    html: uninstall,
                    listeners:{
                        'beforerender': function(){
                            Ext.getCmp('fielsetDesinstalar').setPosition(0,Ext.getCmp('fielsetInstalar').getSize().height+ 30);


                        }
                    }

                },{
                    xtype: 'fieldset',
                    title: "Paquetes que se actualizar&aacute;n",
                    id:'fielsetActualizar',
                    //collapsed: true,
                    collapsible: true,
                    hidden : (update == false) ? true : false,
                    autoHeight: true,
                    width: 225,
                    //x: 0,
                    // y: 50,
                    html: update,
                    listeners:{
                        'beforerender': function(){

                            Ext.getCmp('fielsetActualizar').setPosition(0,Ext.getCmp('fielsetDesinstalar').getSize().height+Ext.getCmp('fielsetInstalar').getSize().height+40);

                        }
                    }

                },{
                    xtype: 'fieldset',
                    title: "Descripci&oacute;n",
                    id:'fielsetDescrip',
                    //collapsed: true,
                    //collapsible: true,
                    autoHeight: true,
                    width: 225,
                    //x: 0,
                   // y: 50,
                    html: this.desc,
                    listeners:{
                        'beforerender': function(){

                            Ext.getCmp('fielsetDescrip').setPosition(0,Ext.getCmp('fielsetDesinstalar').getSize().height+Ext.getCmp('fielsetInstalar').getSize().height+Ext.getCmp('fielsetActualizar').getSize().height+45);

                        }
                    }

                }]
            },

            {
                xtype: 'panel',
                columnWidth: .36,
                height: 280,
                layout: 'absolute',

                items: [{

                        //columnWidth: .5,
                    xtype: 'fieldset',
                    title:'  Conexi&oacute;n a base de datos',
                    hidden : (install == false) ? true : false,
                    layout: 'form',
                    height: 275,
                    x: 5,
                    y: 0,
                    id: 'formConect',
                    defaults: {
                        width: 200,
                        disabled : !check
                    },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Servidor',
                                name: 'servidor',
                                id: 'servidor',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                value: 'localhost',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Base datos',
                                name: 'basedatos',
                                id: 'basedatos',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                regex: tipos,
                                regexText: 'Este valos es incorrecto.',
                                value: 'zeolides',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Puerto',
                                id: 'puerto',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                maskRe: puerto,
                                regex: puerto,
                                value: '5432',
                                regexText: 'Solo números.',
                                anchor: '95%',
                                maxLength: 30

                            },{
                                xtype: 'textfield',
                                fieldLabel: 'Usuario',
                                name: 'usuario',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                id: 'usuario',
                                value: 'postgres',
                                anchor: '95%',
                                maxLength: 30
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Contrase&ntilde;a',
                                name: 'password',
                                blankText: 'Este campo es requerido.',
                                inputType: 'password',
                                allowBlank: false,
                                id: 'password',
                                anchor: '95%',
                                value: 'postgres'
                            }]

                }]
            },


        ]
    });
   /* if (check) {
        var campos_bd = new Ext.form.FieldSet({
            title: 'Conexi&oacute;n de base de datos',
            id: 'datconexion',
            autoHeight: true,
            autoWidth: true,
            margin: 5,
            items: [
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        id: 'formConect',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Servidor',
                                name: 'servidor',
                                id: 'servidor',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                value: 'localhost',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Base datos',
                                name: 'basedatos',
                                id: 'basedatos',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                regex: tipos,
                                regexText: 'Este valos es incorrecto.',
                                value: 'zeolides',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Puerto',
                                id: 'puerto',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                maskRe: puerto,
                                regex: puerto,
                                value: '5432',
                                regexText: 'Solo números.',
                                anchor: '95%',
                                maxLength: 30

                            }]
                    },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'Usuario',
                                name: 'usuario',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                id: 'usuario',
                                value: 'postgres',
                                anchor: '95%',
                                maxLength: 30
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Contrase&ntilde;a',
                                name: 'password',
                                blankText: 'Este campo es requerido.',
                                inputType: 'password',
                                allowBlank: false,
                                id: 'password',
                                anchor: '95%',
                                value: 'postgres'
                            }]
                        }]
                }]

        });
        var form_interfaz = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'simple',
            frame: true,
            width: 700,
            height: 220,
            items: [infoSelect, campos_bd]
        });
    } else {*/
        var form_interfaz = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'simple',
            frame: true,
            width: (install == false) ? 400 :615,
            height: (install == false) ? 200 : 245,
            items: [infoSelect]
        });
   // }


    function winForm() {
        winIns = new Ext.Window({
            layout: 'fit',
            id: 'winInst',
            //width: 100,
            height: (install == false) ? 320 : 390,
            closable: true,
            draggable: true,
            modal: true,
            resizable: false,
            title: titleWindows,
            buttons: [
                {
                    text: 'Cancelar',
                    icon: icon_dir + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: 'Cancelar <b>(Alt+X)</b>',
                    handler: function() {
                        Ext.getCmp('winInst').destroy();
                        Ext.getCmp('idPanelPrincipal').focus(true);
                    }
                },
                {
                    text: 'Aceptar',
                    icon: icon_dir + 'aceptar.png',
                    iconCls: 'btn',
                    tooltip: 'Aceptar <b>(Enter)</b>',
                    handler: function() {

                        switch (scope) {
                            case 'install':   //install
                                //console.log('instal');
                                if (check) {
                                    if ((Ext.getCmp('servidor').getValue() && Ext.getCmp('basedatos').getValue()
                                        && Ext.getCmp('usuario').getValue() && Ext.getCmp('password').getValue()
                                        && Ext.getCmp('puerto').getValue())) {
                                        showResultado();
                                    } else {
                                        mostrarMensaje(6, 'El(Los) campo(s) indicado(s) es (son) obligatorio(s).');
                                    }
                                } else {
                                    showResultado();
                                }

                            break;
                            case 'update':   //uninstall
                                //console.log('unpdate');
                                showResultadoActualizar();
                            break;
                            case 'revert':   //uninstall
                                //console.log('revert');
                                showResultadoActualizarRevert();
                            break;  //
                            case 'uninstall':   //showResultadoDesintalar
                                showResultadoDesintalar();
                            break;

                        }


                    }


                }], keys: [
                {
                    key:13,
                    alt:false,
                    ctrl:false,
                    shift:false,
                    scope: Ext.getCmp('winInst'),
                    handler:function(){
                        switch (scope) {
                            case 'install':   //install
                                //console.log('instal');
                                  if (check) {
                                 if ((Ext.getCmp('servidor').getValue() && Ext.getCmp('basedatos').getValue()
                                 && Ext.getCmp('usuario').getValue() && Ext.getCmp('password').getValue()
                                 && Ext.getCmp('puerto').getValue())) {
                                 showResultado();
                                 } else {
                                 mostrarMensaje(6, 'El(Los) campo(s) indicado(s) es (son) obligatorio(s).');
                                 }
                                 } else {
                                 showResultado();
                                 }

                            break;
                            case 'update':   //uninstall
                                //console.log('unpdate');
                            showResultadoActualizar();
                            break;
                            case 'revert':   //uninstall
                                //console.log('revert');
                                showResultadoActualizarRevert();
                            break;
                            case 'uninstall':   //showResultadoDesintalar

                                showResultadoDesintalar();
                            break;

                        }
                    }
                },{
                    key:'x',
                    alt:true,
                    ctrl:false,
                    shift:false,
                    handler:function(){
                        Ext.getCmp('winInst').destroy();
                    }
                }
            ]

        });

        winIns.add(form_interfaz);
       // winIns.doLayout();
        /*if (check) {
            winIns.setHeight(480);
        }else{
            winIns.setHeight(290);
        }*/
        winIns.show();
    }
    winForm();

    function showResultado() {
        if (check) {
            this.servidor_bd = Ext.getCmp('servidor').getValue();
            this.base_datos = Ext.getCmp('basedatos').getValue();
            this.usuario_bd = Ext.getCmp('usuario').getValue();
            this.password_bd = Ext.getCmp('password').getValue();
            this.puerto_bd = Ext.getCmp('puerto').getValue();
        } else {
            this.servidor_bd = '';
            this.base_datos = '';
            this.usuario_bd = '';
            this.password_bd = '';
            this.puerto_bd = '';
        }
        informSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
        this.urlapp = informSelect.data.URI,
            this.appname = informSelect.data.NAME,
            this.depends = informSelect.data.DEPENDENCIAS,
            this.vers = informSelect.data.VERSION,
            this.namePaquete = informSelect.data.NAMEPAQUETE,
            //this.datos = datos,
            Ext.getCmp('winInst').close();
        var progess = Ext.MessageBox.show({
            msg: 'Instalando su aplicación, por favor espere...',
            progressText: 'Instalando...',
            width: 350,
            wait: true
            //waitConfig: {interval: 5000}
        });
        Ext.Ajax.request({
            url: 'copiararchivo',
            method: 'POST',
            timeout: 90000,
            params: {
                name: this.appname,
                version:this.vers,
                servidor: this.servidor_bd,
                bd: this.base_datos,
                usuario: this.usuario_bd,
                password: this.password_bd,
                puerto: this.puerto_bd,
                nameCarpeta: this.namePaquete,
                baseDatos: !check

            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;
                if (responseData.succes == true) {
                    progess.hide();
                    stcargarXML.reload();
                    instalar.disable();
                    mostrarMensaje(1, menssage);
                } else {
                    progess.hide();
                    mostrarMensaje(6, menssage);
                }
            }
        });
    }

    function showResultadoActualizar() {

        informSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
        this.urlapp = informSelect.data.URI;
        this.appname = informSelect.data.NAME;
        this.depends = informSelect.data.DEPENDENCIAS;
        this.vers = informSelect.data.VERSION ;

        if (check) {
            this.servidor_bd = Ext.getCmp('servidor').getValue();
            this.base_datos = Ext.getCmp('basedatos').getValue();
            this.usuario_bd = Ext.getCmp('usuario').getValue();
            this.password_bd = Ext.getCmp('password').getValue();
            this.puerto_bd = Ext.getCmp('puerto').getValue();
        } else {
            this.servidor_bd = '';
            this.base_datos = '';
            this.usuario_bd = '';
            this.password_bd = '';
            this.puerto_bd = '';
        }
        Ext.getCmp('winInst').close();
        var progessAct = Ext.MessageBox.show({
            msg: 'Actualizando su aplicación, por favor espere...',
            progressText: 'Actualizando...',
            width: 350,
            wait: true
            //waitConfig: {interval: 20000}
        });
        Ext.Ajax.request({
            url: 'actualizar',
            method: 'POST',
            timeout:90000,
            params: {
                nameapp: this.appname,
                dependencias: this.depends,
                version: this.vers,
                servidor: this.servidor_bd,
                bd: this.base_datos,
                usuario: this.usuario_bd,
                password: this.password_bd,
                puerto: this.puerto_bd,
                baseDatos: check
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;

                if (responseData.succes == true) {
                    progessAct.hide();
                    stcargarXML.load();
                    actualizar.disable();
                    desintalar.disable();
                    mostrarMensaje(1, menssage);
                }
                else {
                    progessAct.hide();
                    mostrarMensaje(6, menssage);
                }
            }

        });


    }

    function showResultadoActualizarRevert() {

        informSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
        this.urlapp = informSelect.data.URI;
        this.appname = informSelect.data.NAME;
        this.depends = informSelect.data.DEPENDENCIAS;
        this.vers = informSelect.data.VERSION ;
        if (check) {
            this.servidor_bd = Ext.getCmp('servidor').getValue();
            this.base_datos = Ext.getCmp('basedatos').getValue();
            this.usuario_bd = Ext.getCmp('usuario').getValue();
            this.password_bd = Ext.getCmp('password').getValue();
            this.puerto_bd = Ext.getCmp('puerto').getValue();
        } else {
            this.servidor_bd = '';
            this.base_datos = '';
            this.usuario_bd = '';
            this.password_bd = '';
            this.puerto_bd = '';
        }
        Ext.getCmp('winInst').close();
        var progessAct = Ext.MessageBox.show({
            msg: 'Actualizando su aplicación, por favor espere...',
            progressText: 'Actualizando...',
            width: 350,
            wait: true
            //waitConfig: {interval: 20000}
        });
        Ext.Ajax.request({
            url: 'revert',
            method: 'POST',
            timeout: 90000,
            params: {
                nameapp: this.appname,
                dependencias: this.depends,
                version: this.vers,
                servidor: this.servidor_bd,
                bd: this.base_datos,
                usuario: this.usuario_bd,
                password: this.password_bd,
                puerto: this.puerto_bd,
                baseDatos: check
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;

                if (responseData.succes == true) {
                    progessAct.hide();
                    stcargarXML.load();
                    actualizar.disable();
                    desintalar.disable();
                    revert.disable();
                    mostrarMensaje(1, menssage);
                }
                else {
                    progessAct.hide();
                    mostrarMensaje(6, menssage);
                }
            }

        });


    }

    function showResultadoDesintalar() {
        informSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
        this.appname = informSelect.data.NAME;
        this.version = informSelect.data.VERSION;
        Ext.getCmp('winInst').close();
        var progessUniss = Ext.MessageBox.show({
            msg: 'Desinstalando su aplicaci&oacute;n, por favor espere...',
            progressText: 'Desinstalando...',
            width: 350,
            wait: true
            // waitConfig: {interval: 450}
        });
        Ext.Ajax.request({
            url: 'desinstalarapp',
            timeout: 90000,
            method: 'POST',
            params: {
                paquetes: uninstall
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.succes == true) {
                    progessUniss.hide();
                    mostrarMensaje(1, 'El paquete ha sido desinstalado satisfactoriamente.');
                    stcargarXML.load();
                    desintalar.disable();
                    actualizar.disable();
                }
                else {
                    progessUniss.hide();
                    mostrarMensaje(6, 'Imposible desinstalar el paquete.');
                    Ext.getCmp('winDesinst').destroy();
                }
            }
        });
    }

}

/**
 *Interfaz utilizada para desinstalar paquetes
 */
var winDesinst;
function cargarInterfazDesinstalar(datos) {
    informations_Select = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    this.desc = informations_Select.data.DESCRIPCION
    this.depend = informations_Select.data.DEPENDENCIAS
    var infoSelect = new Ext.form.FieldSet({
        title: 'Información',
        id: 'opcion',
        autoHeight: true,
        items: [
            {
                columnWidth: 1,
                items: new Ext.form.FieldSet({
                    autoScroll: true,
                    layout: 'form',
                    title: 'Aplicaciones a desinstalar',
                    autoWidth: true,
                    html: datos,
                    id:'paquetesadesinstalar',
                    height: 170,
                    width: 355,
                    collapsed: false,
                    collapsible: true,
                    listeners: {
                        expand: {
                            element: this, //bind to the underlying body property on the panel
                            fn: function() {
                                var height=winDesinst.height;
                                winDesinst.setSize(400,height);
                            }
                        },
                        collapse: {
                            element: this, //bind to the underlying body property on the panel
                            fn: function() {
                                var height=winDesinst.height-145;
                                winDesinst.setSize(400,height);
                            }
                        }
                    }
                })
            }
        ]
    });
    var form_interfaz_desinstalar = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'simple',
        frame: true,
        width: 400,
        height: 200,
        items: [infoSelect]
    });

    function winFormDesintalr() {
        winDesinst = new Ext.Window({
            layout: 'fit',
            id: 'winDesinst',
            y: 100,
            width: 400,
            closable: true,
            draggable: true,
            modal: true,
            height: 300,
            resizable: false,
            title: 'Desinstalar paquete',
            buttons: [
                {
                    text: 'Cancelar',
                    icon: icon_dir + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: 'Cancelar <b>(Alt+X)</b>',
                    handler: function() {
                        Ext.getCmp('winDesinst').destroy();
                    }
                },
                {
                    text: 'Aceptar',
                    tooltip: 'Aceptar <b>(Enter)</b>',
                    icon: icon_dir + 'aceptar.png',
                    iconCls: 'btn',
                    handler: function() {
                        showResultadoDesintalar();

                    }
                }],
            keys: [
                {
                    key:'x',
                    alt:true,
                    handler:function(){

                        Ext.getCmp('winDesinst').destroy();
                    }
                },{
                    key:13,
                    alt:false,
                    ctrl:false,
                    shift:false,
                    handler:function(){
                        showResultadoDesintalar();

                    }
                }
            ]

        });
        winDesinst.add(form_interfaz_desinstalar);
        winDesinst.doLayout();
        winDesinst.show();


    }
    winFormDesintalr();
}

/*
 *Boton Actualizar
 *                */
this.actualizar = new Ext.Button({
    text: "Actuali<U>z</U>ar",
    disabled: true,
    icon: icon_dir + 'actualizar.png',
    iconCls: 'btn',
    tooltip: 'Actualizar aplicación <b>(Alt+Ctrl+Z)</b>',
    handler: function() {
        actualizarPaquete();
    }
});
function actualizarPaquete() {
    infoSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    if (!infoSelect) {
        Ext.MessageBox.alert('Información', 'Debe seleccionar un paquete.');
    }
    else {
        this.appname = infoSelect.data.NAME,
            this.appversion = infoSelect.data.VERSION,
            Ext.Ajax.request({
                url: 'comprobarUtlizacion',
                method: 'POST',
                params: {
                    metodo: 'actualizar',
                    nameapp: this.appname,
                    appversion: this.appversion
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var conexion = responseData.conexion;
                    if (responseData.succes === true) {
                        var instalar = responseData.instalar;
                        var desinstalar = responseData.desinstalar;
                        var actualizar = responseData.actualizar;
                        //cargarInterfazActualizar(instalar, actualizar, desinstalar, conexion);
                        cargarInterfaz(conexion,instalar, desinstalar, actualizar,'update');

                    } else {
                        var menssage = responseData.datos;
                        mostrarMensaje(6, menssage);
                    }

                }

            });

    }
}
function reInstApp() {
    infoSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    if (!infoSelect) {
        Ext.MessageBox.alert('Información', 'Debe seleccionar un paquete.');
    } else
    {

        Ext.MessageBox.show({
            title: 'Reinstalar',
            msg: 'Est&aacute; seguro que desea reinstalar el paquete?',
            buttons: Ext.MessageBox.YESNO,
            fn: showResultReinstalar,
            icon: Ext.MessageBox.QUESTION
        });

    }
}
function showResultReinstalar(btn) {
    if (btn == 'yes')
    {
        var progessR = Ext.MessageBox.show({
            msg: 'Reinstalando su aplicaci&oacute;n, por favor espere...',
            progressText: 'Reinstalando...',
            width: 350,
            wait: true
            // waitConfig: {interval: 450}
        });

        informSelect = Ext.getCmp('mygrid').getSelectionModel().getSelected();

        this.urlapp = informSelect.data.URI;
        this.appname = informSelect.data.NAME;
        this.depends = informSelect.data.DEPENDENCIAS;
        //this.vers = informSelect.data.VERSION;
        this.vers = infoSelect.data.VERSIONINSTALADA,

        Ext.Ajax.request({
            url: 'reInstalar',
            method: 'POST',
            timeout: 90000,
            params: {
                direccion: this.urlapp,
                nameapp: this.appname,
                dependencias: this.depends,
                version: this.vers
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;
                if (responseData.succes == true) {
                    progessR.hide();
                    stcargarXML.reload();
                    reinstalar.disable();
                    actualizar.disable();
                    desintalar.disable();
                    mostrarMensaje(1, menssage);
                }
                else {
                    progessR.hide();
                    mostrarMensaje(6, menssage);
                }
            }
        });
    }
    Ext.getCmp('idPanelPrincipal').focus(true);
}

/*
 *Boton Reinstalar
 *                 */
this.reinstalar = new Ext.Button({
    text: "<U>R</U>einstalar",
    disabled: true,
    icon: icon_dir + 'reevaluacion.png',
    tooltip: 'Reinstalar paquete <b>(Shift+Alt+R)</b>',
    iconCls: 'btn',
    handler: function() {
        reInstApp();
    }

});
this.revert = new Ext.Button({
    text: "Re<U>v</U>ertir actualizaci&oacute;n",
    disabled: true,
    icon: icon_dir + 'recuperaciones.png',
    tooltip: 'Revertir actualizaci&oacute;n <b>(Shift+Alt+V)</b>',
    iconCls: 'btn',
    handler: function() {
        revertirPaquete();
    }

});

function findApp() {

    Ext.getCmp('btlimpiarPack').setDisabled(false);
    var textFind = Ext.getCmp('tfBuscarGrid').getValue();
    var estado = Ext.getCmp('comboEstado').getValue();

    var cont = 0;
    if (Ext.getCmp('tf_buscar').isValid()) {
        stcargarXML.removeAll();
        var result = stcargarXML.load({params: {founded: textFind},
            callback: function(response) {
                if (response.length == 0) {
                    mostrarMensaje(7, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                }else{
                    stcargarXML.filter("ESTADO", estado);
                }
            }});
    } else {
        mostrarMensaje(7, 'Solo admite caracteres alfanuméricos.');
        Ext.getCmp('tfBuscarGrid').focus(true);
    }
}

var textFbuscar = new Ext.form.TextField({
    id: 'tf_buscar',
    xtype:'textfield',
    fieldLabel:"Nombre del paqueteAAA",
    allowBlank: true,
    maskRe: /^[áéíóúÁÉÍÓÚ/a-zA-Z0-9]*$/,
    regex: /^[áéíóúÁÉÍÓÚa/-zA-Z]*$/,
    regexText: 'Solo admite caracteres alfanuméricos',
    maxLength: 30
});


var buscar = new Ext.Button({
    text: "<U>B</U>uscar",
    icon: icon_dir + 'buscar.png',
    iconCls: 'btn',
    id: "idBuscar",
    tooltip: 'Buscar paquete <b>(Alt+B)</b>',
    handler: function() {
        findApp();
    }
});

/**
 * Interfaz actualizar paquete
 * */
var winActualizar;
var expanded1=false;
var expanded2=false;
var expanded3=false;

function cargarInterfazActualizar(pinstalar, pactualizar, pdesinstalar, conexion) {
    informations_Select = Ext.getCmp('mygrid').getSelectionModel().getSelected();
    this.desc = informations_Select.data.DESCRIPCION,
        this.depend = informations_Select.data.DEPENDENCIAS
    var infoSelect = new Ext.form.FieldSet({
        title: 'Información',
        id: 'opcion',
        autoHeight: true
    });
    var instalaritem={
        columnWidth: 1,
        items: new Ext.form.FieldSet({
            autoScroll: true,
            layout: 'form',
            title: 'Aplicaciones a instalar',
            autoWidth: true,
            html: pinstalar,
            height: 80,
            width: 355,
            collapsed: true,
            collapsible: true,
            listeners: {
                expand: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded1=true;
                        var plus=40;
                        if(expanded1){
                            plus=plus+55;
                        }if(expanded2){
                            plus=plus+55;
                        }if(expanded3){
                            plus=plus+55;
                        }
                        var height=winActualizar.height+plus;
                        winActualizar.setSize(400,height);
                    }
                },
                collapse: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded1=false;
                        var plus=40;
                        if(expanded1){
                            plus=plus+55;
                        }if(expanded2){
                            plus=plus+55;
                        }if(expanded3){
                            plus=plus+55;
                        }
                        var height=winActualizar.height+plus;                                ;
                        winActualizar.setSize(400,height);
                    }
                }
            }
        })
    };
    var actualizaritem={
        columnWidth: 1,
        items: new Ext.form.FieldSet({
            autoScroll: true,
            layout: 'form',
            title: 'Aplicaciones a actualizar',
            autoWidth: true,
            html: pactualizar,
            height: 80,
            width: 355,
            collapsed: true,
            collapsible: true,
            listeners: {
                expand: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded2=true;
                        var plus=40;
                        if(expanded1){
                            plus=plus+55;
                        }if(expanded2){
                            plus=plus+55;
                        }if(expanded3){
                            plus=plus+55;
                        }
                        var height=winActualizar.height+plus;
                        winActualizar.setSize(400,height);
                    }
                },
                collapse: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded2=false;
                        var plus=40;
                        if(expanded1){
                            plus=plus+55;
                        }if(expanded2){
                            plus=plus+55;
                        }if(expanded3){
                            plus=plus+55;
                        }
                        var height=winActualizar.height+plus;                                ;
                        winActualizar.setSize(400,height);
                    }
                }
            }
        })
    };
    var desintalaritem={
        columnWidth: 1,
        items: new Ext.form.FieldSet({
            autoScroll: true,
            layout: 'form',
            title: 'Aplicaciones a desinstalar',
            autoWidth: true,
            html: pdesinstalar,
            height: 80,
            width: 355,
            collapsed: true,
            collapsible: true,
            listeners: {
                expand: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded3=true;
                        var plus=40;
                        if(expanded1){
                            plus=plus+55;
                        }if(expanded2){
                            plus=plus+55;
                        }if(expanded3){
                            plus=plus+55;
                        }
                        var height=winActualizar.height+plus;
                        winActualizar.setSize(400,height);
                    }
                },
                collapse: {
                    element: this, //bind to the underlying body property on the panel
                    fn: function() {
                        expanded3=false;
                        var plus=40;
                        if(expanded1){
                            plus=plus+55;
                        }if(expanded2){
                            plus=plus+55;
                        }if(expanded3){
                            plus=plus+55;
                        }
                        var height=winActualizar.height+plus;                                ;
                        winActualizar.setSize(400,height);
                    }
                }
            }
        })
    };
    if(pinstalar!='Sin cambios<br />'){
        infoSelect.add(instalaritem);
    }
    if(pactualizar!='Sin cambios<br />'){
        infoSelect.add(actualizaritem);
    }
    if(pdesinstalar!='Sin cambios<br />'){
        infoSelect.add(desintalaritem);
    }
    if (!conexion) {

        var form_interfaz_actualziar = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'simple',
            frame: true,
            width: 400,
            height: 200,
            items: [infoSelect]
        });
    } else {
        var campos_bd = new Ext.form.FieldSet({
            title: 'Conexi&oacute;n de base de datos',
            id: 'datconexion',
            autoHeight: true,
            autoWidth: true,
            margin: 5,
            items: [
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        id: 'formConect',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Servidor',
                                name: 'servidor',
                                id: 'servidor',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                value: 'localhost',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Base datos',
                                name: 'basedatos',
                                id: 'basedatos',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                regex: tipos,
                                regexText: 'Este valos es incorrecto.',
                                value: 'zeolides',
                                anchor: '95%',
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Puerto',
                                id: 'puerto',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                maskRe: puerto,
                                regex: puerto,
                                value: '5432',
                                regexText: 'Solo números.',
                                anchor: '95%',
                                maxLength: 30

                            }]
                    },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'Usuario',
                                name: 'usuario',
                                allowBlank: false,
                                blankText: 'Este campo es requerido.',
                                id: 'usuario',
                                value: 'postgres',
                                anchor: '95%',
                                maxLength: 30
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Contrase&ntilde;a',
                                name: 'password',
                                blankText: 'Este campo es requerido.',
                                inputType: 'password',
                                allowBlank: false,
                                id: 'password',
                                anchor: '95%',
                                value: 'postgres'
                            }]
                        }]
                }]

        });
        var form_interfaz_actualziar = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'simple',
            frame: true,
            width: 400,
            height: 500,
            items: [infoSelect, campos_bd]
        });


    }
    function winFormActualizar() {
        winActualizar = new Ext.Window({
            layout: 'fit',
            id: 'winActualizar',
            y: 100,
            width: 400,
            closable: true,
            draggable: true,
            modal: true,
            height: 300,
            resizable: false,
            title: 'Actualizar aplicación',
            buttons: [
                {
                    text: 'Cancelar',
                    tooltip: '',
                    icon: icon_dir + 'cancelar.png',
                    iconCls: 'btn',
                    handler: function() {
                        Ext.getCmp('winActualizar').destroy();
                    }
                },
                {
                    text: 'Aceptar',
                    tooltip: '',
                    icon: icon_dir + 'aceptar.png',
                    iconCls: 'btn',
                    handler: function() {
                        showResultadoActualizar();
                    }
                }],
            keys:[
                {
                    key:'x',
                    alt:true,
                    handler:function(){
                        Ext.getCmp('winActualizar').destroy();
                    }
                },{
                    key:13,
                    alt:false,
                    ctrl:false,
                    shift:false,
                    handler:function(){
                        showResultadoActualizar();
                    }
                }
            ]

        });
        winActualizar.add(form_interfaz_actualziar);
        if (conexion) {
            winActualizar.setHeight(340);
        } else {
            winActualizar.setHeight(160);
        }
        winActualizar.doLayout();
        winActualizar.show();
    }
    winFormActualizar();

}

/**
 * Interfaz añadir paquete al repositorio personal
 * */
var winNewPackage;
var aux = 'No tiene';
var winDpends = new Ext.Window({
    layout: 'fit',
    title: 'Dependencias',
    width: 300,
    height: 150,
    draggable: true,
    modal: true,
    closeAction: 'hide',
    plain: true,
    items: [
        {xtype: 'textarea',
            id: 'listDpends',
            allowBlank: true,
            readOnly: true,
            value: aux,
            height: 50,
            anchor: '100%'
        }
    ],
    buttons: [{
        text: 'Cerrar',
        icon: '../../../lib/ExtJS/temas/default/images/iconos/cancelar.png',
        iconCls: 'btn',
        handler: function() {
            winDpends.hide();
        }
    }]
});
var toolbarDepend = new Ext.Toolbar({
    id: 'idtoolbarDepend',
    items: [
        {
            xtype: 'combo',
            id: 'adddepends',
            autoScroll: true,
            store: stcargarXML,
            height: 50,
            width: 185,
            editable: false,
            anchor: '50%',
            displayField: 'ID',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione dependencias...',
            selectOnFocus: true,
            listeners: {
                select: {
                    fn: function() {
                        if (Ext.getCmp('adddepends').lastSelectionText != null && Ext.getCmp('adddepends').lastSelectionText != '')
                        {
                            Ext.getCmp('btaddep').setDisabled(false);

                            if (aux == 'No tiene') {
                                Ext.getCmp('btquitdep').setDisabled(true);
                            }
                        }
                    }
                }
            }
        },
        {
            xtype: 'button',
            id: 'btaddep',
            icon: '../../../lib/ExtJS/temas/default/images/iconos/adicionar.png',
            iconCls: 'btn',
            text: 'Ad<U>i</U>cionar',
            disabled: true,
            tooltip: 'Ad<U>i</U>cionar dependencia <b>(Alt+I)</b>',
            handler: function() {
                adddependencia();
            }
        },
        {
            xtype: 'button',
            id: 'btquitdep',
            icon: '../../../lib/ExtJS/temas/default/images/iconos/eliminar.png',
            iconCls: 'btn',
            text: 'Eliminar',
            tooltip: 'Eliminar dependencia <b>(Del)</b>',
            disabled: true,
            handler: function() {
                eliminarDepend();
            }
        }
    ]
});
var winAddDpends = new Ext.Window({
    layout: 'fit',
    id: 'winAddDpends',
    autoWidth: true,
    height: 150,
    draggable: true,
    modal: true,
    title: 'Gestionar dependencias',
    closeAction: 'hide',
    plain: true,
    keyMapGroup: true,
    tbar: [toolbarDepend],
    items: [
        {
            xtype: 'textarea',
            id: 'deszxcp1',
            readOnly: true,
            allowBlank: true,
            value: Ext.getCmp('listDpends').getValue(),
            height: 50,
            width: 290,
            anchor: '100%'
        }
    ],
    buttons: [{
        text: 'Cancelar',
        icon: icon_dir + 'cancelar.png',
        iconCls: 'btn',
        tooltip: 'Cancelar <b>(Alt+X)</b>',
        handler: function() {
            cancelarGestDepend();
        }
    }, {
        text: 'Aceptar',
        icon: icon_dir + 'aceptar.png',
        iconCls: 'btn',
        tooltip: 'Aceptar<b> (Enter)</b>',
        handler: function() {
            aceptarGestDepend();
        }
    }],
    keys: [
        {
            key: 13,
            alt: false,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                aceptarGestDepend();
            }
        }, {
            key: 'x',
            alt: true,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                cancelarGestDepend();
            }
        }, {
            key: 'i',
            alt: false,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                adddependencia();
            }
        }, {
            key: 46,
            alt: false,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                eliminarDepend();
            }
        }

    ]


});
function eliminarDepend() {
    if (Ext.getCmp('deszxcp1').getValue() == 'No tiene') {
        mostrarMensaje(6, "La dependencia seleccionada no se puede eliminar debido a que no ha sido adicionada.")
    } else {

        if (Ext.getCmp('adddepends').lastSelectionText)
        {
            Ext.MessageBox.show({
                title: 'Eliminar dependencia',
                msg: 'Está seguro que quiere eliminar la dependencia seleccionada.',
                buttons: Ext.Msg.OKCANCEL,
                fn: eliminarDependencia,
                icon: Ext.MessageBox.QUESTION
            });

        } else {

            mostrarMensaje(6, "Debe seleccionar alguna dependencia de la lista.");
        }


    }
}
function cancelarGestDepend() {
    Ext.getCmp('adddepends').reset();
    aux = Ext.getCmp('listDpends').getValue();
    Ext.getCmp('deszxcp1').setValue(aux);
    winAddDpends.hide();
}
function aceptarGestDepend() {
    Ext.getCmp('listDpends').setValue(Ext.getCmp('deszxcp1').getValue());
    Ext.getCmp('adddepends').reset();
    winAddDpends.hide();
}
;
function adddependencia() {
    var control = 0;

    if (Ext.getCmp('adddepends').lastSelectionText != null && Ext.getCmp('adddepends').lastSelectionText != '')
    {

        var contro_arr = aux.split(', ');
        for (i = 0; i < contro_arr.length; i++)
        {
            if (Ext.getCmp('adddepends').lastSelectionText == contro_arr[i])
            {
                control = 1;
            }
        }
        if (control != 1)
        {
            if (aux == 'No tiene')
            {
                aux = Ext.getCmp('adddepends').lastSelectionText;
            } else
            {
                aux = aux + ', ' + Ext.getCmp('adddepends').lastSelectionText;

            }
            Ext.getCmp('deszxcp1').setValue(aux);
            mostrarMensaje(7, 'La dependencia ha sido adicionada satisfactoriamente.');
        } else
        {
            mostrarMensaje(6, "La dependencia que quiere adicionar ya existe.")
        }

    } else
    {
        mostrarMensaje(6, "Debe seleccionar alguna dependencia de la lista.");
    }

    if (aux != 'No tiene') {
        Ext.getCmp('btquitdep').setDisabled(false);
    } else {
        Ext.getCmp('btquitdep').setDisabled(true);
    }

}
function eliminarDependencia(option) {
    if (option === 'ok') {
        var arr = Ext.getCmp('deszxcp1').getValue().split(', ');
        var band;
        for (i = 0; i < arr.length; i++)
        {
            if (Ext.getCmp('adddepends').lastSelectionText == arr[i])
            {
                arr[i] = arr[arr.length - 1];
                band = 1;
            }
        }
        if (band == 1)
        {
            aux = 'No tiene';
            for (i = 0; i < arr.length - 1; i++)
            {
                if (aux == 'No tiene')
                {
                    aux = arr[i];
                } else
                {
                    aux = aux + ', ' + arr[i];
                }
            }
            Ext.getCmp('deszxcp1').setValue(aux);
            mostrarMensaje(1, "La dependencia ha sido eliminada satisfactoriamente.");
        } else {
            mostrarMensaje(6, "La dependencia seleccionada no se puede eliminar debido a que no ha sido adicionada.");
        }


        if (aux == 'No tiene') {
            Ext.getCmp('btquitdep').setDisabled(true);
        } else {
            Ext.getCmp('btquitdep').setDisabled(false);
        }
    }

}
function cargarInterfazNewPackage() {
    var infoSelect = new Ext.form.FieldSet({
        title: 'Parámetros del paquete',
        id: 'opcion',
        autoHeight: true,
        items: [
            {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: "Frase secreta",
                id: 'password',
                allowBlank: false,
                anchor: '100%'
            },
            new Ext.form.FileUploadField({
                fieldLabel: 'Archivo',
                name: 'fileUpload',
                id: 'fileUpload',
                allowBlank: false,
                autoSize: true,
                anchor: '100%'
            })
        ]
    });

    var form_interfaz_NewPackage = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'simple',
        frame: true,
        fileUpload: true,
        autoHeight: true,
        width: 400,
        items: [infoSelect],
        buttonAlign: 'right',
        buttons: [{
            text: 'Cancelar',
            icon: icon_dir + 'cancelar.png',
            iconCls: 'btn',
            tooltip: 'Cancelar <b>(Alt+X)</b>',
            handler: function() {
                cancelarAddPaquete();
            }
        }, {
            text: 'Aceptar',
            icon: icon_dir + 'aceptar.png',
            iconCls: 'btn',
            tooltip: 'Aceptar <b>(Enter)</b>',
            handler: function() {
                adicionarPaqute();
            }
        }],
        keys: [
            {
                key: 13,
                alt: false,
                ctrl: false,
                shift: false,
                handler: function(k, e) {
                    adicionarPaqute();
                }
            }, {
                key: 'x',
                alt: true,
                ctrl: false,
                shift: false,
                handler: function(k, e) {
                    cancelarAddPaquete();
                }
            }
        ]
    });
    function cancelarAddPaquete() {
        Ext.getCmp('winNewPackage').destroy();
        form_interfaz_NewPackage.getForm().reset();
    }
    function encryptRSA(text) {
        var key = RSA.getPublicKey(document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    }
    function adicionarPaqute() {
        var fileuploader, password;
        password = Ext.getCmp('password');
        fileuploader = Ext.getCmp('fileUpload');

        if (fileuploader.getValue() != '' && password.getValue() != '') {
            if (Ext.getCmp('simple').form.isValid()) {
                this.password = password.getValue();
                Ext.getCmp('winNewPackage').hide();
                var progess = Ext.MessageBox.show({
                    msg: 'Agregando paquete, por favor espere...',
                    progressText: 'Agregando...',
                    width: 350,
                    wait: true
                });
                form_interfaz_NewPackage.getForm().submit({
                    url: 'uploadArchivo',
                    params: {
                        password: encryptRSA(this.password)
                    },
                    failure: function(form_interfaz_NewPackage, action) {
                        var msg = action.result.datos;
                        var succes = action.result.succes;
                        if (succes === true)
                        {
                            Ext.getCmp('winNewPackage').destroy();
                            progess.hide();
                            stcargarXML.reload();
                            stcargarAppsLocal.load();
                            /* Ext.MessageBox.show({
                             title: 'Información',
                             msg: action.result.datos,
                             closable: false,
                             buttons: Ext.MessageBox.OK,
                             icon: Ext.MessageBox.INFO
                             });*/
                            mostrarMensaje(1, msg);
                        } else
                        {
                            progess.hide();
                            Ext.getCmp('winNewPackage').show();
                            /* Ext.MessageBox.show({
                             title: 'Error',
                             msg: action.result.datos,
                             closable: false,
                             buttons: Ext.MessageBox.OK,
                             icon: Ext.MessageBox.ERROR
                             });*/
                            mostrarMensaje(6, msg);
                        }
                    }
                });
            } else {
                /* Ext.MessageBox.alert('Información', 'Existen campos incorrectos.');*/
                mostrarMensaje(6, 'Existen campos incorrectos.');
            }

        } else {
            if (nombres.getValue() == '') {
                nombres.focus(true);
            } else if (brebedescripcion.getValue() == '') {
                brebedescripcion.focus(true);
            } else if (versions.getValue() == '') {
                versions.focus(true);
            } else if (descripcion.getValue(true) == '') {
                descripcion.focus(true);
            } else {
                fileuploader.focus(true);
            }
        }

        /*if (Ext.getCmp('listDpends').getValue() && Ext.getCmp('descp').getValue() && Ext.getCmp('b_drescrip').getValue() &&
         Ext.getCmp('version').getValue() && Ext.getCmp('nombre').getValue() && Ext.getCmp('fileUpload').getValue()) {


         }
         else {
         //mostrarMensaje(6,'Debe llenar todos los campos necesarios.');

         }*/
    }
    function winFormNewPackage() {
        winNewPackage = new Ext.Window({
            layout: 'fit',
            id: 'winNewPackage',
            y: 100,
            width: 470,
            closable: true,
            draggable: true,
            modal: true,
            autoHeight: true,
            resizable: false,
            title: 'Adicionar paquetes'
        });
        winNewPackage.add(form_interfaz_NewPackage);
        winNewPackage.doLayout();
        winNewPackage.show();
    }
    winFormNewPackage();
}

/**
 * Interfaz eliminar paquete del repositorio personal
 * */
var winDeletePackage;
this.checkPaquete = new Ext.grid.CheckboxSelectionModel({
    singleSelect: true
});
function interfazDletePackage() {
    var gridPaquetesReport = new Ext.grid.GridPanel({
        store: stcargarAppsLocal,
        id: 'gridURLPaquete',
        width: 300,
        autoScroll: true,
        height: 100,
        autoExpandColumn: 'expandir',
        cm: new Ext.grid.ColumnModel([
            {
                id: 'repositorio',
                "header": "Paquete",
                "width": 200,
                "sortable": true,
                "dataIndex": "NAME",
                "triStateSort": false
            },
            {id: 'expandir',
                "header": "Versión",
                "width": 50,
                "sortable": true,
                "dataIndex": "VERSION",
                "triStateSort": false
            }
        ]),
        sm: checkPaquete,
        listeners: {
            'rowclick': function() {
                Ext.getCmp('eliminarPack').enable();
            }
        }
    });
    var textFbuscarPaquete = new Ext.form.TextField({
        id: 'tf_buscar_Paquete',
        allowBlank: true,
        blankText: 'Este campo es obligatorio.',
        maskRe: /^[áéíóúÁÉÍÓÚa-zA-Z0-9]$/,
        regex: /^([áéíóúÁÉÍÓÚa-zA-Z]|([áéíóúÁÉÍÓÚa-zA-Z][áéíóúÁÉÍÓÚa-zA-Z0-9]))+$/,
        regexText: 'Solo admite caracteres alfanuméricos.',
        "width": 280
    });

    var buscar_paquete = new Ext.Button({
        text: "",
        tooltip: 'Buscar paquete <b>(Alt+B)</b>',
        id: 'buscar_paq',
        icon: icon_dir + 'buscar.png',
        iconCls: 'btn',
        handler: function() {
            buscarPaquete();
        }

    });
    function buscarPaquete() {
        var textFind = textFbuscarPaquete.getValue();

        if (textFind != '')
        {
            stcargarAppsLocal.removeAll();
            stcargarAppsLocal.load({params: {founded: textFind}});

        } else
        {
            stcargarAppsLocal.load();
        }
        textFbuscarPaquete.focus();
        Ext.getCmp('eliminarPack').setDisabled(true);
    }
    var toolbarPaquete = new Ext.Toolbar({
        items: [
            textFbuscarPaquete, buscar_paquete
        ]
    });
    var field_paquete = new Ext.form.FieldSet({
        title: 'Repositorio local',
        id: 'field_paq',
        autoHeight: true,
        width: 300,
        items: [gridPaquetesReport]
    });
    var form_interfaz_elim_paquete = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'repositorio',
        frame: true,
        autoWidth: true,
        autoHeight: true,
        items: [field_paquete]
    });
    function winFormeletePackage() {
        winDeletePackage = new Ext.Window({
            layout: 'fit',
            id: 'winDeletePackage',
            y: 100,
            autoWidth: true,
            closable: true,
            draggable: true,
            modal: true,
            autoHeight: true,
            resizable: false,
            tbar: [toolbarPaquete],
            title: 'Eliminar paquetes',
            buttons: [
                {
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    icon: icon_dir + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip:'Cancelar <b>(Alt+X)</b>',
                    handler: function() {
                        stcargarAppsLocal.load();
                        winDeletePackage.destroy();
                    }
                },
                {
                    text: 'Aceptar ',
                    icon: icon_dir + 'aceptar.png',
                    id: 'eliminarPack',
                    disabled: true,
                    iconCls: 'btn',
                    tooltip: 'Aceptar <b>(Enter)</b>',
                    handler: function() {
                        aceptarEliminarPaquete();
                    }
                }
            ],
            keys: [
                {
                    key:13,
                    alt:false,
                    ctrl:false,
                    shift:false,
                    handler:function(k,e){
                        aceptarEliminarPaquete();
                    }
                },
                {
                    key:'x',
                    alt:true,
                    ctrl:false,
                    shift:false,
                    handler:function(k,e){
                        stcargarAppsLocal.load();
                        winDeletePackage.destroy();
                    }
                },{
                    key:'b',
                    alt:true,
                    ctrl:false,
                    shift:false,
                    handler:function(k, e){
                        buscarPaquete();
                    }
                }
            ]


        });
        winDeletePackage.add(form_interfaz_elim_paquete);
        winDeletePackage.doLayout();
        winDeletePackage.show();
    }
    function aceptarEliminarPaquete() {
        if (Ext.getCmp('gridURLPaquete').getSelectionModel().getSelected() != null)
        {

            Ext.MessageBox.show({
                title: 'Eliminar paquete',
                msg: '¿Est&aacute seguro que quiere eliminar el paquete seleccionado?',
                buttons: Ext.Msg.OKCANCEL,
                fn: showResultEliminarPauqte,
                icon: Ext.MessageBox.QUESTION
            });

        }

    }
    function showResultEliminarPauqte(btn) {
        if (btn == 'ok')
        {
            this.name = Ext.getCmp('gridURLPaquete').getSelectionModel().getSelected().data.NAME
            this.version = Ext.getCmp('gridURLPaquete').getSelectionModel().getSelected().data.VERSION
            var progess = Ext.MessageBox.show({
                msg: 'Eliminado el paquete, por favor espere...',
                progressText: 'Eliminando...',
                width: 350,
                wait: true
                // waitConfig: {interval: 450}
            });
            Ext.Ajax.request({
                url: 'eliminarAppRepositorio',
                method: 'POST',
                params: {
                    version: this.version,
                    nombre: this.name
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var menssage = responseData.datos;
                    if (responseData.succes == true) {
                        progess.hide();
                        Ext.getCmp('tf_buscar_Paquete').reset();
                        stcargarAppsLocal.removeAll();
                        stcargarXML.removeAll();
                        stcargarXML.reload();
                        stcargarAppsLocal.load();
                        mostrarMensaje(7, menssage);
                        Ext.getCmp('eliminarPack').setDisabled(true);
                    }
                    else {
                        progess.hide();
                        mostrarMensaje(6, menssage);
                    }
                }

            });
        }
    }
    ;
    winFormeletePackage();
}

/**
 * Interfaz configurar repositorio
 * */
var winRepositorio;


this.GridReposm = new Ext.grid.RowSelectionModel({
    singleSelect: false
});

var checkColumn = new Ext.ux.CheckColumn({
    header: 'Activado',
    width: 60,
    align: 'center',
    dataIndex: 'active'

});

checkColumn.on('beforecheked', function(c, index, record, t) {

    if (t.checked) {
        record.set('active', '0');

    } else {
        record.set('active', '1');

    }
});

checkColumn.on('click', function(c, index, record, t) {
    var btnAp = Ext.getCmp('aplicarRepo');
    var btnAc = Ext.getCmp('aceptarRepo');

    btnAp.enable();
    btnAc.enable();

});

var GriRepodcm = new Ext.grid.ColumnModel([
    checkColumn,
    {
        id: 'id_repo',
        header: 'Repositorios',
        dataIndex: 'DIR',
        width: 298,
        editor: new Ext.form.TextField({
            allowBlank: false
        })
    }

]);
var ctrl = false;
stcargarXMLRepo.load();
var ptbTablas = new Ext.PagingToolbar({
    store:stcargarXML,
    pageSize: 20
});
var gridPrincipal = new Ext.grid.GridPanel({
    store: stcargarXML,
    id: 'mygrid',
    tbar:[
        'Nombre del paquete:',
        {
            xtype:'textfield',
            id: 'tfBuscarGrid',
            name: 'tfBuscarGrid',
            allowBlank: true,
            maskRe: /^[áéíóúÁÉÍÓÚ/a-zA-Z0-9]*$/,
            regex: /^[áéíóúÁÉÍÓÚa/-zA-Z]*$/,
            regexText: 'Solo admite caracteres alfanuméricos'
            //maxLength: 30
        },' ',
        'Estado:',
        {
            xtype:'combo',
            name: 'comboEstado',
            id: 'comboEstado',
            emptyText: 'Seleccione',
            displayField:'name',
            width: 150,
            store: storeEstado,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            readOnly : true,
            listeners: {
              'change': function(){
                  Ext.getCmp('btlimpiarPack').setDisabled(false);
              }
            }
        },
        buscar,
        {
            xtype: 'button',
            id: 'btlimpiarPack',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar<b>(Alt+L)</b>',
            disabled: true,
            handler: function() {
                Ext.getCmp('tfBuscarGrid').reset();
                Ext.getCmp('comboEstado').reset();
                Ext.getCmp('btlimpiarPack').setDisabled('true');
                stcargarXML.load();

            }
        }
    ],
    // plugins: [actionrow],
    autoExpandColumn: 'expandir',
    width: '100%',
    columns: [
        {
            id: 'paquete',
            header: "Paquetes",
            width: 160,
            sortable: true,
            dataIndex: "NAME",
            triStateSort: false
        },
        {
            header: "Estado",
            width: 100,
            sortable: true,
            dataIndex: "ESTADO",
            triStateSort: false
        },
        {
            header: "Versión instalada",
            width: 100,
            sortable: true,
            dataIndex: "VERSIONINSTALADA",
            triStateSort: false
        },
        {
            header: "Versión del paquete",
            width: 110,
            sortable: true,
            dataIndex: "VERSION",
            triStateSort: false
        },
        {
            id: 'expandir',
            header: "Descripción",
            autoWidth: true,
            sortable: true,
            dataIndex: "DESCRIPCION",
            triStateSort: false
        }
        //,actionrow
    ],
    autoHeight: true,
    border: false,
    listeners: {
        'click': function(e) {
            if (Ext.getCmp('mygrid').getSelectionModel().getSelected() != null) {

                var selected = Ext.getCmp('mygrid').getSelectionModel().getSelected();

                var nombre = selected.json.NAMEPRODUCT;
                var descrip = selected.json.DESCRIPCION;
                var depend = selected.json.DEPENDENCIAS;
                var logo = selected.json.LOGO;
                var autor = selected.json.AUTOR;
                var verssion = selected.json.VERSION;
                var chech = selected.json.ESTADO;

                var cadena = '';
                if(depend != null){
                    dependencia = depend.split('\n');
                    for(var i = 0; i <  dependencia.length; i++){
                        cadena +='<li style="list-style: none;">'+dependencia[i]+'</li>';
                    }
                }


                var style = '<style>' +
                    'p#logo { text-align: center; padding : 10 0 0 0px; }' +
                    '.acercade{    font-size: 1.1em;} ' +
                    '.txtprincipal{' +
                    ' text-align: center;' +
                    'font: bold 2.3em "Droid Sans",arial,sans-serif;' +
                    'color: rgb(0, 155, 194);' +
                    'text-shadow: 1px 1px 2px rgba(185, 185, 185, 0.84);' +
                    '' +

                    '}' +

                    '</style>' +
                    '<section id="infoApp">' +
                    '<div style="border-bottom: solid 1px #eeeeee; box-shadow: 1px 1px 4px rgba(198, 198, 198, 0.44); text-align: center; padding-bottom: 10px; padding-top: 10px ">' +
                    '<tpl if="this.logoContain(logo) == false">' +
                    ' <img style="width: 50%;" src=' + logo + '>' +
                    '</tpl>' +
                    '</p>' +
                    '<h1 style="font-size:  1.4em;" class="txtPrincipal">' + nombre + ' </h1>' +//---------------Nombre-------------------
                    '<h5 style="font-size:  1.2em;color: rgb(0, 155, 194);" class="">Versión: ' + verssion + ' </h5>' +//------------Versión-----------------
                    '</div>' +
                    '<div class = "acercade" style="margin-bottom:20px;height:100%;overflow:auto; padding: 10px 5px 5px 5px;text-align: center; background-color: rgba(240, 240, 240, 0.18)">' +//-------------Container----------------
                    '<h5>Descripción:</h5>' +//------------------Desarrollado------------ -----
                    '<label >' + descrip + '</label>' +//------------------Desarrollado------------ -----
                    '<h5>Desarrollado por:</h5>' +//------------------Desarrollado------------ -----
                    '<label >' + autor + '</label>' +//------------------Desarrollado------------ -----
                    '<h5 style="margin-top:10px">Dependencias:</h5>' +//------------------Dependencias------------
                    '<ul>' + cadena +
                    '</ul>' +//-----------------------------------End Dependencias -----------
                    '</br>' +
                    '</div>' +//------------------------------------End Container-----------
                    '<footer style=" bottom:0; position:absolute;width: 100%; height:15;text-align: center;background-color:rgb(0, 155, 194);color: white ">' +//------------------------------------Footer-----------
                    '<h5>2011-2015 © Copyright XETID </h5>' +//------------------------------------Footer-----------
                    '</footer>' +//------------------------------------End Footer-----------
                    '</section>';

                var tpl = new Ext.Template(style);
                var detailPanel = Ext.getCmp('panelDesc');
                Ext.getCmp('panelDesc').expand(true);
                tpl.overwrite(detailPanel.body,e);

                if (chech == 'Instalado')
                {
                    instalar.disable();
                    desintalar.enable();
                    reinstalar.enable();
                    actualizar.disable();
                    revert.enable();

                }
                if (chech == 'No instalado')
                {
                    desintalar.disable();
                    instalar.enable();
                    reinstalar.disable();
                    actualizar.disable();
                    revert.disable();

                }
                if (chech == 'Desactualizado') {
                    actualizar.enable();
                    desintalar.enable();
                    instalar.disable();
                    reinstalar.enable();
                    revert.enable();
                }

            }

        }
    }
});

var panelPrincipal = new Ext.Panel({
    xtype: "panel",
    region: "center",
    id: 'idPanelPrincipal',
    tbar: [
        instalar,
        '-', desintalar,
        '-', actualizar,
        '-', reinstalar,
        '-', revert,
        '->', ayuda

    ],
    keys: [
        {
            key: 'b',
            alt: true,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                findApp();
            }
        }, {
            key: 'h',
            alt: true,
            ctrl: false,
            shift: false,
            handler: function(k, e) {
                principalHelp();
            }
        }, {
            key: 'i',
            alt: false,
            ctrl: true,
            shift: true,
            handler: function(k, e) {
                if(!instalar.isDisable()){
                    instalarPaquete();
                }

            }
        }, {
            key: 'd',
            alt: false,
            ctrl: true,
            shift: true,
            handler: function(k, e) {

                if(!desintalar.isDisable()){
                    desintalarPaquete();
                }

            }
        }, {
            key: 'r',
            alt: true,
            ctrl: false,
            shift: true,
            handler: function(k, e) {
                if(!reinstalar.isDisable()){
                    reInstApp();
                }

            }
        }, {
            key: 'z',
            alt: true,
            ctrl: true,
            shift: false,
            handler: function(k, e) {
                if(!actualizar.isDisable()){
                    actualizarPaquete();
                }

            }
        }
    ],
    layout: "anchor",
    items: [gridPrincipal],
    bbar:ptbTablas
});
var panelInferior = new Ext.Panel({
    xtype       : "panel",
    id          : 'panelDesc',
    collapsible : true,
    collapsed   : true,
    region      : "east",
    title       : "Descripción",
    layout      : "absolute",
    html: "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>",
    width       : 300,
    margins     : '3 0 3 3',
    cmargins    : '3 3 3 3'
});
var myMask = new Ext.LoadMask(Ext.getBody(), {
    msg: "Cargando datos, por favor espere...",
    store: stcargarXML
});
var arbolAccLoader = new Ext.tree.TreeLoader({
    dataUrl: 'cargarxmlRepositorio'
});

var arbolAcc = new Ext.tree.TreePanel({
    //title:'TreePanel',
    //collapsible:true,
    tbar: [{
        xtype: 'textfield',
        width: 150,
        id: 'tftreeBusquedad',
        name: 'tftreeBusquedad'
       },
        {
            xtype: 'button',
            id: 'btbuscarRepo',
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar repositorio <b>(Alt+B)</b>',
            handler: function() {
                var filtro = Ext.getCmp('tftreeBusquedad').getValue();
                filterTree.filter(filtro);
                Ext.getCmp('btlimpiarRepo').setDisabled(false);

            }
        },{
            xtype: 'button',
            id: 'btlimpiarRepo',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar<b>(Alt+L)</b>',
            disabled: true,
            handler: function() {
                filterTree.clear();
                Ext.getCmp('tftreeBusquedad').reset();
                Ext.getCmp('btlimpiarRepo').setDisabled(true);
            }
        }

    ],
    autoScroll: true,
    id: 'arbolAcc',
    //region:'east',

    split: true,
    width: '100%',
    loader:arbolAccLoader,
    listeners: {
        'checkchange': function (node, checked) {
            var style = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>";
            var tpl = new Ext.Template(style);
            var detailPanel = Ext.getCmp('panelDesc');
            Ext.getCmp('panelDesc').collapse(false);
            tpl.overwrite(detailPanel.body);
            var raiz = Ext.getCmp('arbolAcc').getRootNode();
            activarRepositorios(raiz);
        },
        'click':function (node, event){
            nodeClick =  node;
            if(node.attributes.text != "Repositorios de paquetes"){
                var altM = new Ext.KeyMap(arbolAcc.getEl(), {
                    alt:true,
                    key: 'm', // or Ext.EventObject.ENTER
                    fn: function(){
                        ventanaAgregarRepo(false);
                    }

                });

                var del = new Ext.KeyMap(arbolAcc.getEl(), {
                    key: Ext.EventObject.DELETE,
                    fn: function(){
                        eliminarRepositorio();
                    }

                });

                if (node.attributes.DIR != 'Repositorio local') {
                    Ext.getCmp('btelminarRepo').enable();
                    Ext.getCmp('btmodificarRepo').enable();
                } else {
                    Ext.getCmp('btelminarRepo').setDisabled(true);
                }
            }else{
                Ext.getCmp('btelminarRepo').setDisabled(true);
            }
        },
        'render': function(){
            filterTree = new Ext.tree.TreeFilter(arbolAcc,{
                autoClear:false
            });
            var altB = new Ext.KeyMap(arbolAcc.getEl(), {
                alt:true,
                key: 'b', // or Ext.EventObject.ENTER
                fn: function(){
                    var filtro = Ext.getCmp('tftreeBusquedad').getValue();
                    filterTree.filter(filtro);
                    Ext.getCmp('btlimpiarRepo').setDisabled(false);
                }

            });
            var altL = new Ext.KeyMap(arbolAcc.getEl(), {
                alt:true,
                key: 'l', // or Ext.EventObject.ENTER
                fn: function(){
                    filterTree.clear();
                    Ext.getCmp('tftreeBusquedad').reset();
                    Ext.getCmp('btlimpiarRepo').setDisabled(true);
                }

            });
            var altI = new Ext.KeyMap(Ext.getBody(), {
                alt:true,
                key: 'i', // or Ext.EventObject.ENTER
                fn: function(){
                    ventanaAgregarRepo(true);
                }

            });


        }
    }

});
function activarRepositorios(node){
    var activos = new Array();
    var nodes = node.childNodes;
    var length = nodes.length;
    for(var i = 0; i < length; i++ ){
        nodes[i].attributes.active = nodes[i].attributes.checked;
        activos[i] = nodes[i].attributes;
    }
    var encoded = Ext.encode(activos);
    cargarStoreXML(encoded);
    stcargarXML.removeAll();
    stcargarXML.load();

}
function eliminarRepositorio() {
    url = Ext.getCmp('arbolAcc').getSelectionModel().selNode.attributes;
    if (url != null) {
        var url_repo = url.DIR;
        if (url_repo == 'Repositorio local') {
            Ext.MessageBox.alert('Información', 'El repositorio local solo puede ser activado/desactivado');
        }
        else {
            Ext.MessageBox.show({
                title: 'Eliminar repositorio',
                msg: '¿Est&aacute seguro que quiere eliminar el repositorio seleccionado?',
                buttons: Ext.Msg.OKCANCEL,
                fn: showResultRepo,
                icon: Ext.MessageBox.QUESTION
            })
        }

    }
}
function showResultRepo(btn) {
    if (btn == 'ok')
    {
        url = Ext.getCmp('arbolAcc').getSelectionModel().selNode.attributes;
        this.url_repo = url.DIR;
        this.active = url.checked;
        var progess = Ext.MessageBox.show({
            msg: 'Eliminado el repositorio, por favor espere...',
            progressText: 'Eliminando...',
            width: 350,
            wait: true
            // waitConfig: {interval: 450}
        });
        Ext.Ajax.request({
            url: 'eliminarRepositorio',
            method: 'POST',
            params: {
                url: this.url_repo,
                active: this.active
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;
                if (responseData.succes == true) {
                    progess.hide();
                    stcargarXMLRepo.removeAll();
                    stcargarXMLRepo.load();
                    this.stcargarXML.reload();
                    arbolAccLoader.load(padreArbolAcc);
                    mostrarMensaje(1,menssage);

                }
                else {
                    progess.hide();
                    mostrarMensaje(6, menssage);
                }
            }});
        Ext.getCmp('btelminarRepo').setDisabled(true);
    }
}

////------------ Crear nodo padre del arbol ------------////
var padreArbolAcc = new Ext.tree.AsyncTreeNode({
    text: 'Repositorios de paquetes',
    expandable: true,
    id: '0'
});

function isRepoExist(nodePadre,dirnueva){
    var nodes = nodePadre.childNodes;
    for(var i = 0; i < nodes.length; i++){
        if(nodes[i].attributes.DIR == dirnueva){
            return true;
        }
    }
    return false;
}
arbolAcc.setRootNode(this.padreArbolAcc);
arbolAcc.getRootNode().expand();
function aceptarAddRepo(opcion ,bandera) {

    Ext.getCmp('btmodificarRepo').setDisabled(true);

    this.oldDirection = "";
    this.oldDenominacion ="";
    this.activate = "";
    if(!bandera){
        this.oldDirection = nodeClick.attributes.DIR;
        this.oldDenominacion = nodeClick.attributes.text;
        this.activate = nodeClick.attributes.active;
    }
    this.direction = Ext.getCmp('url').getValue();
    this.denominacion = Ext.getCmp('denominacion').getValue();
    var node = Ext.getCmp('arbolAcc').getRootNode();
    console.log(bandera);
    if (Ext.getCmp('url').getValue() && Ext.getCmp('denominacion').getValue())
    {

       // if(!isRepoExist(node,this.direction) ){
            var progessRepo = Ext.MessageBox.show({
                msg: 'Configurando su repositorio, por favor espere...',
                progressText: 'Configurando...',
                width: 350,
                wait: true
                // waitConfig: {interval: 20000}
            });
            Ext.Ajax.request({
                url: (bandera) ? 'configurar' : 'ModifyRepositories',
                method: 'POST',
                params: {
                    direccion:  this.direction,
                    denominacion: this.denominacion,
                    active:this.activate,
                    oldDireccion: (bandera) ? '' : this.oldDirection,
                    oldDenominacion:(bandera) ? '' :this.oldDenominacion
                },
                callback: function(options, success, response) {
                    progessRepo.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData != null) {
                        var msg = responseData.datos;
                        if (responseData.succes == true) {
                            progessRepo.hide();
                            stcargarXMLRepo.reload();
                            responseData.datos;
                            arbolAccLoader.load(padreArbolAcc);
                            mostrarMensaje(1, msg);
                            if(opcion == 'Aceptar'){
                                Ext.getCmp('addRepo').close();
                            }
                        }
                        else {
                            progessRepo.hide();
                            mostrarMensaje(6, msg);
                        }
                    } else {
                        mostrarMensaje(6, 'No existe un repositorio con esta direcci&oacute;n.');
                    }
                }
            });
      /*  }else{
            mostrarMensaje(6, 'El repositorio que desea adicionar ya existe.');
        }*/

    } else
    {
        mostrarMensaje(6, 'los campos no puede estar vac&iacute;o.');
    }
}

function ventanaAgregarRepo(bandera) {
    var win = Ext.getCmp('addRepo');
    if(!win){

        var campo_text_url = new Ext.form.FieldSet({
            title: 'Dirección del nuevo repositorio',
            id: 'dir_repo',
            height: 200,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Denominación',
                name: 'denominacion',
                allowBlank: false,
                blankText: 'Este campo es requerido.',
                id: 'denominacion',
                anchor: '95%',
                value:(bandera ? '' : nodeClick.attributes.text)
            },{
                xtype: 'textfield',
                fieldLabel: 'Dirección URL',
                name: 'url',
                allowBlank: false,
                blankText: 'Este campo es requerido.',
                id: 'url',
                emptyText: 'Dirección URL del nuevo repositorio',
                anchor: '95%',
                value:(bandera ? '' : nodeClick.attributes.DIR)
            }
            ]
        });
        var form_interfaz_add_repositorio = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'repositorio',
            frame: true,
            width: 400,
            height: 200,
            items: [campo_text_url]
        });
        var ventanaAddRepositorio = new Ext.Window({
            layout: 'fit',
            id: 'addRepo',
            //y: 100,
            width: 400,
            closable: true,
            draggable: true,
            modal: true,
            height: 200,
            resizable: false,
           // closeAction :'destroy',
           // plain       : true,
            title: (bandera) ? 'Adicionar repositorio' : 'Modificar repositorio',
            keyMapGroup: false,
            items: [
                form_interfaz_add_repositorio
            ],
            buttons: [
                {
                    icon: '../../../lib/ExtJS/temas/default/images/iconos/cancelar.png',
                    iconCls: 'btn',
                    text: 'Cancelar',
                    tooltip: 'Cancelar <b>(Alt+X)</b>',
                    handler: function() {
                        Ext.getCmp('btmodificarRepo').setDisabled(true);
                        Ext.getCmp('btelminarRepo').setDisabled(true);
                        Ext.getCmp('addRepo').destroy();
                    }
                },{
                    icon: '../../../lib/ExtJS/temas/default/images/iconos/aplicar.png',
                    iconCls: 'btn',
                    text: 'Aplicar',
                    hidden : (bandera) ? false : true,
                    tooltip: 'Aplicar <b>(Alt+P)</b>',
                    handler: function() {

                        aceptarAddRepo('Aplicar', bandera);
                    }
                },
                {
                    icon: '../../../lib/ExtJS/temas/default/images/iconos/aceptar.png',
                    iconCls: 'btn',
                    text: 'Aceptar',
                    tooltip: 'Aceptar <b>(Enter)</b>',
                    handler: function() {

                        aceptarAddRepo('Aceptar', bandera);

                    }
                }],
            keys: [
                {
                    key: 'x',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        Ext.getCmp('btmodificarRepo').setDisabled(true);
                        Ext.getCmp('addRepo').destroy();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        aceptarAddRepo('Aplicar');
                    }
                },{
                    key: 13,
                    alt: false,
                    ctrl: false,
                    shift: false,
                    handler: function(k, e) {
                        aceptarAddRepo('Aceptar');
                    }
                }
            ]
        });

        ventanaAddRepositorio.show();
    }





}
var panelRepositorio = new Ext.Panel({
    title       : 'Gestionar repositorios',
    region      : 'west',
    split       : true,
    width       : 300,
    collapsible : true,
    margins     : '3 0 3 3',
    cmargins    : '3 3 3 3',
    layout      : 'fit',
    tbar: [
        {
            xtype: 'button',
            id: 'btquitdep',
            icon: '../../../lib/ExtJS/temas/default/images/iconos/adicionar.png',
            iconCls: 'btn',
            text: 'Ad<U>i</U>cionar',
            tooltip: 'Adicionar repositorio <b>(Alt+I)</b>',
            handler: function() {
                ventanaAgregarRepo(true);
            }},
        {
            xtype: 'button',
            id: 'btmodificarRepo',
            icon: '../../../lib/ExtJS/temas/default/images/iconos/modificar.png',
            iconCls: 'btn',
            text: 'Modificar',
            tooltip: 'Modificar repositorio <b>(modificar)</b>',
            disabled: true,
            handler: function() {
                ventanaAgregarRepo(false);
            }
        },{
            xtype: 'button',
            id: 'btelminarRepo',
            icon: '../../../lib/ExtJS/temas/default/images/iconos/eliminar.png',
            iconCls: 'btn',
            text: 'Eliminar',
            tooltip: 'Eliminar repositorio <b>(DEL)</b>',
            disabled: true,
            handler: function() {
                eliminarRepositorio();
            }
        }],
    items: [arbolAcc]
});
myMask.show();
stcargarXML.load();
function controlapnelViewPort(config) {
    config = config ? config : {};
    Ext.apply(config, {
        id: 'id-controlpanel',
        layout: 'border',
        autoScroll: true,
        autowidth: true,
        items: [panelPrincipal,panelRepositorio,panelInferior]
    });
    Ext.Viewport.call(this, config);
    return this;
}
controlapnelViewPort.prototype = new Ext.Viewport;
controlapnelViewPort.appInit = function() {
    Ext.QuickTips.init();
    if (!controlapnelViewPort.instance) {
        var appInitial = new controlapnelViewPort();
    }
}
Ext.onReady(controlapnelViewPort.appInit);

