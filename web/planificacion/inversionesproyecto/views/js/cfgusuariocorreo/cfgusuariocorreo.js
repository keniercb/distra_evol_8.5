var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('cfgusuariocorreo', cargarInterfaz);

function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    
    rolepersona = perfil.idrol;
    
    btnAdicionar = new Ext.Button({
        handler: function () {
            winFp();
        },
        tooltip: perfil.etiquetas.lbTtbtnAdd,
        disabled: false,
        id: 'btnAdd',
        iconCls: 'guardar'
    });
    btnProbarCorreo = new Ext.Button({
        handler: function () {
            winPrueba();
        },
        tooltip: 'Probar correo',
        disabled: false,
        id: 'btnProbarCorreo',
        iconCls: 'probar'
    });
    
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
        id: 'btnAyudaPlanFar',
        iconCls: 'ayuda'
    });

    // Store grid stGpGestCfg
    stGpGestCfg = new Ext.data.Store({
        url: 'existeArchivo',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stGpGestCfg.removeAll();
            },
            load: function () {


            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'existe'
            }]
                )
    });

    // Selection Model grid smGpGestCfg
    smGpGestCfg = new Ext.grid.RowSelectionModel({
        singleSelect: true,
    });

    // Grid gestion gpGestCfg
    gpGestCfg = new Ext.grid.GridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        region: 'center',
        layout: 'fit',
        disabled: false,
        title: perfil.etiquetas.lbgpGestCfg,
        listeners: {
        },
        store: stGpGestCfg,
        sm: smGpGestCfg,
        columns: [{
                id: 'expandir',
                header: 'Existe',
                tooltip: 'Existenca del archivo config_mailer.xml',
                sortable: true,
                dataIndex: 'existe',
                renderer: crearToolTip
            }],
        //md: menuConfigAtributo,
        loadMask: {
            store: stGpGestCfg
        }
    });

    panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'border',
        id: 'panelGeneral',
        autoWidth: true,
        height: 50,
        items: [gpGestCfg],
        tbar: [btnAdicionar,btnProbarCorreo, '->', btnAyuda]
    });

    // viewport de la plantilla
    vpPlanes711 = new Ext.Viewport({
        layout: 'fit',
        id: 'idvpPlanes711',
        items: [panelGeneral],
        listeners: {
            afterlayout: function (e) {
                claseMask();
            }
        }
    });

    panelGeneral.focus(true, 500);
    
    function winFp() {

        btnCancelarAdd = new Ext.Button({
            iconCls: 'cancelar',
            id: 'btnCancelarAdd',
            tooltip: 'Cancelar',
            text: 'Cancelar',
            handler: function () {
                ventanaCrud.destroy();
            }
        });

        btnAceptarAdd = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: false,
            id: 'btnAceptarAdd',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            handler: function () {
                if (pfinal.getForm().isValid()) {
                    AdicionarModificar();
                } else {
                    mostrarMensaje(2, 'Error en el formulario');
                }
            }
        });

    /**
     * host="correo.xetid.cu" port="25" user="planificacion@xetid.cu"
                nombre="planificacion"
                pwd="82834433583811093699 83963739955350785615 26676933834472399938 87783215948285534376 1522435234375"
     */
        host = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Host',
            emptyText: 'correo.cu',
            allowBlank: false,
            width: 200,
            anchor: '80%',
            hidden: false
        });

        port = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Puerto',
            emptyText: '##',
            allowBlank: false,
            width: 200,
            anchor: '80%',
            hidden: false
        });

        user = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Usuaro completo',
            emptyText: 'asde123@coreo.cu',
            allowBlank: true,
            maxLength: 50,
            maxText: 'El tama&#241;o m&#225;ximo requerido es de 50 caracteres.',
            regex: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            //regexText: 'La direcciÃ³n de correo no es vÃ¡lida.',
            regexText: 'Formato: usuario@dominio.ext',
            anchor: '95%'
        });


        nombre = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Noombre usuario',
            emptyText: 'usuario',
            allowBlank: false,
            width: 200,
            hidden: false
        });

        pwd1 = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Contraseña',
            allowBlank: false,
            width: 200,
            hidden: false
        });


        var h = 220;
        pfinal = new Ext.FormPanel({
            id: 'pfinal',
            frame: true,
            defaults:{labelAlign:'top'},
            items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: host
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: port
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: nombre
                    }, {
                        columnWidth:0.5,
                        layout: 'form',
                        items: user
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: pwd1
                    }]

                }]
        });
        ventanaCrud = null;
        ventanaCrud = new Ext.Window({
            title: 'Generar archivo config_mailer.xml',
            id: 'ventanaCrud',
            width: 525,
            constrain: true,
            layout: 'fit',
            height: h,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarAdd, btnAceptarAdd],
            items: [pfinal],
            listeners: {
                beforeshow: function () {
                }
            }
        });
        
        ventanaCrud.show();
    }
    
    function winPrueba() {

        btnCancelarAdd = new Ext.Button({
            iconCls: 'cancelar',
            //id: 'btnCancelarAdd',
            tooltip: 'Cancelar',
            text: 'Cancelar',
            handler: function () {
                ventanaCrud.destroy();
            }
        });

        btnAceptarAdd = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: false,
            //id: 'btnAceptarAdd',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            handler: function () {
                if (pfinal.getForm().isValid()) {
                    CorreoDePrueba();
                } else {
                    mostrarMensaje(2, 'Error en el formulario');
                }
            }
        });

    /**
     * host="correo.xetid.cu" port="25" user="planificacion@xetid.cu"
                nombre="planificacion"
                pwd="82834433583811093699 83963739955350785615 26676933834472399938 87783215948285534376 1522435234375"
     */
        user = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Usuaro completo',
            emptyText: 'asde123@coreo.cu',
            allowBlank: true,
            maxLength: 50,
            maxText: 'El tama&#241;o m&#225;ximo requerido es de 50 caracteres.',
            regex: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            //regexText: 'La direcciÃ³n de correo no es vÃ¡lida.',
            regexText: 'Formato: usuario@dominio.ext',
            width: 200,
        });
        Asunto = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Asunto',
            emptyText: 'Un asunto',
            allowBlank: false,
            width: 200,
            hidden: false
        });
        Contenido = new Ext.form.TextField({
            disabled: false,
            fieldLabel: 'Asunto',
            emptyText: 'un asunto',
            allowBlank: true,
            width: 200,
            hidden: false
        });
        

        var h = 250;
        pfinal = new Ext.FormPanel({
            id: 'pfinal',
            frame: true,
            defaults:{labelAlign:'top'},
            items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: user
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: Asunto
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: Contenido
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: btnAceptarAdd
                    }
                    
                ]

                }]
        });
        ventanaCrud = null;
        ventanaCrud = new Ext.Window({
            title: 'Enviar correo de prueba',
            //id: 'ventanaCrud',
            width: 400,
            constrain: true,
            layout: 'fit',
            height: h,
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarAdd],
            items: [pfinal],
            listeners: {
                beforeshow: function () {
                }
            }
        });
        
        ventanaCrud.show();
    }

    function AdicionarModificar() {

        //si los conceptos de compra son iguales
        //if()
        Ext.Ajax.request({
            url: 'generarArchivo',
            params: {
                host: host.getValue(),
                port: port.getValue(),
                nombre: nombre.getValue(),
                user: user.getValue(),
                pwd1: pwd1.getValue()
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'Se ha creado el archivo config_mailer.xml satisfactoriamente');
                    stGpGestCfg.reload();
                    ventanaCrud.destroy();
                }else {
                    var verboaccion = (accion == 1) ? 'adicionar' : 'modificar';
                    mostrarMensaje(2, 'error');
                }
            }
        });

    }
    function CorreoDePrueba() {
        mymask.show();
        Ext.Ajax.request({
            url: 'existeArchivo',
            params: {
                user: user.getValue(),
                asunto: Asunto.getValue(),
                contenido: Contenido.getValue(),
                test:1
            },
            callback: function(options, success, response) {
                 mymask.hide();
                responseData = Ext.decode(response.responseText);
                if(responseData.mensaje==true){
                    mostrarMensaje(1, ' El mensage fue enviado con éxito');
                }else{
                    mostrarMensaje(1, responseData.mensaje);
                }
                
            }
        });

    }

    //stGpGestCfg.load();
    
    function claseMask() {
        var claseMask = document.getElementsByClassName('ext-el-mask');
        var maskEstructura = claseMask.item(0);
        var maskDistribucion = claseMask.item(1);
        (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
        (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
    }

}// Endof cargarInterfaz

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}


