//UCID.portal.cargarEtiquetas('genfichero', cargarInterfaz);

function cargarCompilarExtension(){
    var treeroles = new Ext.tree.TreePanel({
        region: "center",
        title: "Roles",
        autoScroll: true,
        margins: "2 0 2 2",
        tbar: new Ext.Toolbar({
            items:[
                {
                    text:perfil.etiquetas.lbBtnAdicionar/*"Adicionar"*/,
                    tooltip: perfil.etiquetas.textToolTipAdicionarRol,
                    iconCls: "adicionar",
                    handler: function(){
                        windowAdicionar.show();
                    }
                },
                {
                    text:perfil.etiquetas.lbBtnEliminar/*"Eliminar"*/,
                    tooltip: perfil.etiquetas.textToolTipEliminarRol,
                    iconCls: "eliminar",
                    handler: function(){
                        treeroles.getSelectionModel().selNode.remove();
                    }
                },
                {
                    text:"Compilar",
                    tooltip: perfil.etiquetas.textToolTipCompilar,
                    iconCls: "configuracion",
                    handler: function(){
                        compilar();
                    }
                }
            ]
        }),
        root: {
            text: "Roles",
            expanded: true
        },
        loader: new Ext.tree.TreeLoader({
            url: "../genfichero/rolesactivos"
        })
    });
    var panelderecho = new Ext.Panel({
        region: "east",
        width: "45%",
        bodyStyle: 'background-color: #DFE8F6; padding: 0px',
        margins: "2 2 2 2",
        //title: "panel derecho",
        html: "<div style=' position: absolute; top: 20%; left: 20%; transform: translate(-12%, -10%); text-align: justify ; '>" +
        "<img src='/seguridad/views/imgs/zeolides.png' style='width: 98%; height: 20%; margin: 2px 2px 30px 2px;' /> <br>" +
                  "<span>" +
                  "El uso de esta extensión permite tener un mayor nivel de seguridad en la base de datos" +
                  " del sistema, ya que para el funcionamiento de la aplicación el usuario no necesita conocer" +
                  " las claves de los roles de la base de datos." +
               "</span>" +
        "</div>"
    });
    var vista = new Ext.Window({
        title:perfil.etiquetas.lbWinCompilarEx,
        layout: "border",
        width: 500,
        height: 350,
        closeAction: "hide",
        renderTo: Ext.getBody(),
        modal: true,
        items:[
            treeroles,
            panelderecho
        ],
        buttons:[
            {
                iconCls: "cancelar",
                text:perfil.etiquetas.lbBtnCancelar/*"Cancelar"*/,
                tooltip:perfil.etiquetas.tooltipCancelarVen,
                handler: function(){
                    vista.hide();
                }
            }
        ]
    });
    var windowAdicionar = new Ext.Window({
        title:perfil.etiquetas.lbWinAdicionarR,
        layout: "fit",
        height: 115,
        width: 315,
        closeAction: "hide",
        modal: true,
        items:[
            this.form = {
                layout: "form",
                bodyStyle:'background-color: transparent; padding: 10px',
                border: false,
                items: [
                    new Ext.form.TextField({
                        id: "nombrerol",
                        fieldLabel: "Nombre"
                    })
                ]
            }
        ],
        buttons:[
            {
                text: "Aceptar",
                iconCls: "aceptar",
                tooltip: perfil.etiquetas.tooltipAceptarVen,
                handler: function(){
                    if(anadirRol()){
                        Ext.getCmp("nombrerol").reset();
                        windowAdicionar.hide();
                    }else{
                        mostrarMensaje(8,perfil.etiquetas.textToolTipExisteRol);
                    }
                }
            },{
                text: "Aplicar",
                iconCls: "aplicar",
                tooltip: perfil.etiquetas.tooltipAplicarVen,
                handler: function(){
                    if(anadirRol()){
                        Ext.getCmp("nombrerol").reset();
                    }else{
                        mostrarMensaje(8,perfil.etiquetas.textToolTipExisteRol);
                    }

                }
            },{
                text: "Cancelar",
                iconCls: "cancelar",
                tooltip: perfil.etiquetas.tooltipCancelarVen,
                handler: function(){
                    windowAdicionar.hide();
                }
            }

        ]
    });
    function compilar(){
        var roles = treeroles.getChecked();
        var loginroles = new Array();
        for(var i = 0 ; i< roles.length;i++){
            loginroles.push(roles[i].text);
        }
        window.open("../genfichero/compilarextension?loginroles="+Ext.util.JSON.encode(loginroles));
    }
    function anadirRol(){
        var text = Ext.getCmp("nombrerol").getValue();
        var nodes = treeroles.getRootNode().childNodes;
        for(var i = 0;i<nodes.length;i++){
            if(nodes[i].text == text)
                return false;
        }
        treeroles.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            checked: true
        }));
        return true;
    }
    return vista;
}