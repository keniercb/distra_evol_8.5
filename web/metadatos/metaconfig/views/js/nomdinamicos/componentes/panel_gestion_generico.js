/**
 * @Created with PhpStorm.
 * @Author: Roberto León Socarrás
 * @package Beta
 * @subpackage Wand
 * @Date: 3/3/16
 * @Version:1.0
 */
Ext.ns('Misitio.Panel_Gestion');
Misitio.Panel_Gestion.PanelGestionGenerico = function(self, fn) {
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

    var panel = null;


    myMask.show();
    Ext.Ajax.request({
        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
        method: 'POST',
        params: {
            metodo: 'cargarConfiguracion',
            identificadorconfiguracion: self.identificadorconfiguracion,
            identificadorentidad: self.identificadorentidad
        },
        callback: function (options, success, response) {
            var respuesta = Ext.decode(response.responseText);
            var panel = null;

            if (respuesta.success) {
                if (respuesta.datos.length != 0) {
                    var pos = 0;
                    while (!respuesta.datos[pos].primaria) {
                        pos++;
                    }

                    var configuracionMensajes = {
                        femenino: respuesta.datos[0].femenino,
                        numero: [respuesta.datos[0].singular, respuesta.datos[0].plural]
                    };

                    panel = new Misitio.Panel_Gestion.GestionGridPanel({
                        id: 'nomencladores' + self.id,
                        region: 'center',
                        anchoForm: respuesta.datos[0].anchoformulario,
                        nombre: respuesta.datos[0].nombrecomponente,
                        configuracionMensajes: configuracionMensajes,
                        collapsible: true,
                        animCollapse: true,
                        autoScroll: true,
                        tabla: respuesta.datos[0].nombretabla,
                        idtabla: respuesta.datos[pos].index,
                        configuracion: respuesta.datos
                    });
                    var configuracionPanel = {
                        configuracion: respuesta.datos,
                        configuracionMensajes: configuracionMensajes,
                        tabla: respuesta.datos[0].nombretabla,
                        idtabla: respuesta.datos[pos].index,
                        anchoForm: respuesta.datos[0].anchoformulario,
                        nombre: respuesta.datos[0].nombrecomponente
                    };

                    fn(panel, configuracionPanel);

                } else {
                    Ext.Msg.show({
                        title: 'Error',
                        msg: 'Configuración aún incompleta.',
                        buttons: Ext.Msg.OK,
                        animEl: 'elIda',
                        icon: Ext.MessageBox.ERROR
                    });
                }

                myMask.hide();
            } else {
                myMask.hide();
                var error = respuesta.error;

            }

        }
    });


};

Ext.ns('Misitio.Funciones');
Misitio.Funciones.VentanaConceptos = function (parametros) {

    var identificadorconfiguracion = parametros.identificadorconfiguracion;
    var variables = {
        nodomarcado: -1
    };

    //Nodo raíz del árbol de configuraciones.
    var nodoRaiz = new Ext.tree.AsyncTreeNode({
        id: 'rootConceptos' + parametros.id,
        text: 'Nomencladores',
        expanded: true
    });

    var loaderArbolConcepto = new Ext.tree.TreeLoader({
        id: 'loaderArbolConcepto' + parametros.id,
        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
        baseParams: {
            metodo: 'cargarConceptos',
            identificadorconfiguracion: identificadorconfiguracion
        }
    });


    //Arbol donde se listan las configuraciones
    var arbolConcepto = new Ext.tree.TreePanel({
        id: 'ArbolConcepto' + parametros.id,
        title: '',
        region: 'west',
        collapsible: true,
        autoScroll: true,
        split: true,
        border: false,
        //frame: true,
        rootVisible: true,
        width: '100%',
        loader: loaderArbolConcepto,

    });
    arbolConcepto.setRootNode(nodoRaiz);
    //arbolConcepto.expandAll();


    //Panel de configuraciones
    var pConceptos = new Ext.Panel({
        id: 'pConceptos' + parametros.id,
        title: 'Listado de nomencladores',
        region: 'west',
        layout: 'fit',
        width: screen.width * 0.20,
        height: '100%',
        collapsible: true,
        split: true,
        items: [arbolConcepto]
    });

    //TabPanel
    var tabPanelConceptos = new Ext.TabPanel({
        id: 'tabPanelConceptos' + parametros.id,
        region: 'center',
        margins: '0 0 0 0',
        height: '100%',
        width: '80%',
        layoutOnTabChange: true,
        defaults: {
            autoScroll: true
        },
        activeTab: 0,
        enableTabScroll: true,
        items: [{
            title: 'Inicio',
            id: 'inicio' + parametros.id,
            layout: 'fit',
            tabTip: 'Inicio',
            cls: 'menureporte-principalTab',
            html: '<div class="info-container"><div class="info"><p>Por favor seleccione uno o varios elementos del men&uacute.</p><hr/></div></div>'
        }],


    });


    var pPrincipal = new Ext.Panel({
        id: 'pPrincipalConceptos' + parametros.id,
        layout: 'border',
        collapsible: true,
        split: true,
        items: [pConceptos, tabPanelConceptos]
    });


    var pConceptosGenericos = null;
    arbolConcepto.on('click', function (node, e) {
        variables.nodomarcado = node.id;
        cargarConfiguracion(node);
    });


    function cargarConfiguracion(node) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

        var respuesta = new Array();

        if (document.getElementById('config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id) == null && node.attributes.leaf == true) {

            myMask.show();
         console.log(node.attributes.configuracion);

           /* Misitio.Panel_Gestion.PanelGestionGenerico({
                id: 'config' + parametros.identificadorconfiguracion + node.attributes.identificadorentidad,
                identificadorconfiguracion: parametros.identificadorconfiguracion,
                identificadorentidad: node.attributes.identificadorentidad
            }, function (panel, config) {
                tabPanelConceptos.add({
                    title: node.text,
                    id: 'config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id,
                    tabTip: node.attributes.descripcion,
                    autoScroll: true,
                    idpanel: panel.id,

                    height: '100%',
                    closable: true,
                    layout: 'fit',
                    items: [panel],
                    listeners: {
                        activate: function (p) {
                            p.doLayout();
                        }
                        , beforedestroy: function (p) {
                            Ext.getCmp(p.idpanel).ventanaGestion.destroy();
                        }
                    }
                });



                tabPanelConceptos.activate('config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id);
                myMask.hide();

            });*/
            var pos = 0;
            while (!node.attributes.configuracion[pos].primaria) {
                pos++;
            }

            var configuracionMensajes = {
                femenino: node.attributes.configuracion[0].femenino,
                numero: [node.attributes.configuracion[0].singular, node.attributes.configuracion[0].plural]
            };

             var panel = new Misitio.Panel_Gestion.GestionGridPanel({
                id: 'concepto' + node.attributes.configuracion[pos].index,
                region: 'center',
                anchoForm: node.attributes.configuracion[0].anchoformulario,
                nombre: node.attributes.configuracion[0].nombrecomponente,
                configuracionMensajes: configuracionMensajes,
                collapsible: true,
                animCollapse: true,
                autoScroll: true,
                tabla: node.attributes.configuracion[0].nombretabla,
                idtabla: node.attributes.configuracion[pos].index,
                configuracion: node.attributes.configuracion
            });

            tabPanelConceptos.add({
                title: node.text,
                id: 'config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id,
                tabTip: node.attributes.descripcion,
                autoScroll: true,
                idpanel: panel.id,

                height: '100%',
                closable: true,
                layout: 'fit',
                items: [panel],
                listeners: {
                    activate: function (p) {
                        p.doLayout();
                    }
                    , beforedestroy: function (p) {
                        Ext.getCmp(p.idpanel).ventanaGestion.destroy();
                    }
                }
            });



            tabPanelConceptos.activate('config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id);
            myMask.hide();

        } else {
            tabPanelConceptos.activate('config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id);
        }


    }

    return pPrincipal;
};

Misitio.Funciones.VentanaMaestroDetalle = function (parametros) {

    var identificadorconfiguracion = parametros.identificadorconfiguracion;
    var variables = {
        nodomarcado: -1
    };

    //Nodo raíz del árbol de configuraciones.
    var nodoRaiz = new Ext.tree.AsyncTreeNode({
        id: 'rootMaestroDetalle' + parametros.id,
        text: 'Conceptos maestro-detalle',
        expanded: true
    });

    var loaderArbolConcepto = new Ext.tree.TreeLoader({
        id: 'loaderArbolMaestro-detalle' + parametros.id,
        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
        baseParams: {
            metodo: 'cargarMaestroDetalles',
            identificadorconfiguracion: identificadorconfiguracion
        }
    });


    //Arbol donde se listan las configuraciones
    var arbolConcepto = new Ext.tree.TreePanel({
        id: 'ArbolMaestroDetalle' + parametros.id,
        title: '',
        region: 'west',
        collapsible: true,
        autoScroll: true,
        split: true,
        border: false,
        //frame: true,
        rootVisible: true,
        width: '100%',
        loader: loaderArbolConcepto,

    });
    arbolConcepto.setRootNode(nodoRaiz);
    //arbolConcepto.expandAll();


    //Panel de configuraciones
    var pConceptos = new Ext.Panel({
        id: 'pConceptosMaestroDetalles' + parametros.id,
        title: 'Listado de nomencladores maestro-detalle',
        region: 'west',
        layout: 'fit',
        width: screen.width * 0.20,
        height: '100%',
        collapsible: true,
        split: true,
        items: [arbolConcepto]
    });

    //TabPanel
    var tabPanelConceptos = new Ext.TabPanel({
        id: 'tabPanelMaestroDetalles' + parametros.id,
        region: 'center',
        margins: '0 0 0 0',
        height: '100%',
        width: '80%',
        layoutOnTabChange: true,
        defaults: {
            autoScroll: true
        },
        activeTab: 0,
        enableTabScroll: true,
        items: [{
            title: 'Inicio',
            id: 'inicioMaestroDetalles' + parametros.id,
            layout: 'fit',
            tabTip: 'Inicio',
            cls: 'menureporte-principalTab',
            html: '<div class="info-container"><div class="info"><p>Por favor seleccione uno o varios elementos del men&uacute.</p><hr/></div></div>'
        }],


    });


    var pPrincipal = new Ext.Panel({
        id: 'pPrincipalMaestroDetalles' + parametros.id,
        layout: 'border',
        collapsible: true,
        split: true,
        items: [pConceptos, tabPanelConceptos]
    });


    var pConceptosGenericos = null;
    arbolConcepto.on('click', function (node, e) {
        variables.nodomarcado = node.id;
        cargarConfiguracion(node);
    });


    function cargarConfiguracion(node) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

        var respuesta = new Array();

        if (document.getElementById('config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id) == null && node.attributes.leaf == true) {

            myMask.show();


            Misitio.Funciones.PanelMaestroDetalle({
                id: 'configMD' + parametros.identificadorconfiguracion + node.attributes.identificador,
                configMaestro:{
                    identificadorconfiguracion:node.attributes.idconfiguracion,
                    identificadorentidad:node.attributes.identidadmaestro,
                } , configDetalles:{
                    identificadorconfiguracion:node.attributes.idconfiguracion,
                    identificadorentidad:node.attributes.identidaddetalle,
                } ,
                columnaMaestro:node.attributes.idatributomaestro,
                columnaDetalle:node.attributes.idatributodetalle
            }, function (panel) {
                tabPanelConceptos.add({
                    title: node.text,
                    id: 'configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id,
                    tabTip: node.attributes.descripcion,
                    autoScroll: true,
                    idpanel: panel.id,
                    height: '100%',
                    closable: true,
                    layout: 'fit',
                    items: [panel],
                    listeners: {
                        activate: function (p) {
                            p.doLayout();
                        }
                        , beforedestroy: function (p) {
                            Ext.getCmp(panel.panelMaestro.items.items[0].id).ventanaGestion.destroy();
                            Ext.getCmp(panel.panelDetalle.id).ventanaGestion.destroy();
                        }
                    }
                });



                tabPanelConceptos.activate('configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id);
                myMask.hide();

            });
            /*var pos = 0;
            while (!node.attributes.configuracion[pos].primaria) {
                pos++;
            }

            var configuracionMensajes = {
                femenino: node.attributes.configuracion[0].femenino,
                numero: [node.attributes.configuracion[0].singular, node.attributes.configuracion[0].plural]
            };

             var panel = new Misitio.Panel_Gestion.GestionGridPanel({
                id: 'concepto' + node.attributes.configuracion[pos].index,
                region: 'center',
                anchoForm: node.attributes.configuracion[0].anchoformulario,
                nombre: node.attributes.configuracion[0].nombrecomponente,
                configuracionMensajes: configuracionMensajes,
                collapsible: true,
                animCollapse: true,
                autoScroll: true,
                tabla: node.attributes.configuracion[0].nombretabla,
                idtabla: node.attributes.configuracion[pos].index,
                configuracion: node.attributes.configuracion
            });

            tabPanelConceptos.add({
                title: node.text,
                id: 'config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id,
                tabTip: node.attributes.descripcion,
                autoScroll: true,
                idpanel: panel.id,

                height: '100%',
                closable: true,
                layout: 'fit',
                items: [panel],
                listeners: {
                    activate: function (p) {
                        p.doLayout();
                    }
                    , beforedestroy: function (p) {
                        Ext.getCmp(p.idpanel).ventanaGestion.destroy();
                    }
                }
            });



            tabPanelConceptos.activate('config' + node.attributes.identificadorentidad + parametros.identificadorconfiguracion + parametros.id);
            myMask.hide();*/

        } else {
            tabPanelConceptos.activate('configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id);
        }


    }

    return pPrincipal;
};

Misitio.Funciones.VentanaMaestroDetalleOptimizada = function (parametros) {

    var identificadorconfiguracion = parametros.identificadorconfiguracion;
    var variables = {
        nodomarcado: -1
    };

    //Nodo raíz del árbol de configuraciones.
    var nodoRaiz = new Ext.tree.AsyncTreeNode({
        id: 'rootMaestroDetalle' + parametros.id,
        text: 'Conceptos maestro-detalle',
        expanded: true
    });

    var loaderArbolConcepto = new Ext.tree.TreeLoader({
        id: 'loaderArbolMaestro-detalle' + parametros.id,
        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
        baseParams: {
            metodo: 'cargarMaestroDetalles',
            identificadorconfiguracion: identificadorconfiguracion
        }
    });


    //Arbol donde se listan las configuraciones
    var arbolConcepto = new Ext.tree.TreePanel({
        id: 'ArbolMaestroDetalle' + parametros.id,
        title: '',
        region: 'west',
        collapsible: true,
        autoScroll: true,
        split: true,
        border: false,
        //frame: true,
        rootVisible: true,
        width: '100%',
        loader: loaderArbolConcepto,

    });
    arbolConcepto.setRootNode(nodoRaiz);
    //arbolConcepto.expandAll();


    //Panel de configuraciones
    var pConceptos = new Ext.Panel({
        id: 'pConceptosMaestroDetalles' + parametros.id,
        title: 'Listado de nomencladores maestro-detalle',
        region: 'west',
        layout: 'fit',
        width: screen.width * 0.20,
        height: '100%',
        collapsible: true,
        split: true,
        items: [arbolConcepto]
    });

    //TabPanel
    var tabPanelConceptos = new Ext.TabPanel({
        id: 'tabPanelMaestroDetalles' + parametros.id,
        region: 'center',
        margins: '0 0 0 0',
        height: '100%',
        width: '80%',
        layoutOnTabChange: true,
        defaults: {
            autoScroll: true
        },
        activeTab: 0,
        enableTabScroll: true,
        items: [{
            title: 'Inicio',
            id: 'inicioMaestroDetalles' + parametros.id,
            layout: 'fit',
            tabTip: 'Inicio',
            cls: 'menureporte-principalTab',
            html: '<div class="info-container"><div class="info"><p>Por favor seleccione uno o varios elementos del men&uacute.</p><hr/></div></div>'
        }],


    });


    var pPrincipal = new Ext.Panel({
        id: 'pPrincipalMaestroDetalles' + parametros.id,
        layout: 'border',
        collapsible: true,
        split: true,
        items: [pConceptos, tabPanelConceptos]
    });


    var pConceptosGenericos = null;
    arbolConcepto.on('click', function (node, e) {
        variables.nodomarcado = node.id;
        cargarConfiguracion(node);
    });


    function cargarConfiguracion(node) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

        var respuesta = new Array();

        if (document.getElementById('configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id) == null && node.attributes.leaf == true) {
//console.log(node);
            myMask.show();

            var pos = 0;
            while (!node.attributes.configuracionmaestro[pos].primaria) {
                pos++;
            }

            var configuracionMensajes = {
                femenino: node.attributes.configuracionmaestro[0].femenino,
                numero: [node.attributes.configuracionmaestro[0].singular, node.attributes.configuracionmaestro[0].plural]
            };

            var panelMaestroN = new Misitio.Panel_Gestion.GestionGridPanel({
                id: 'pMaestro' + node.attributes.configuracionmaestro[pos].index+ node.attributes.identificador,
                anchoForm: node.attributes.configuracionmaestro[0].anchoformulario,
                nombre: node.attributes.configuracionmaestro[0].nombrecomponente,
                configuracionMensajes: configuracionMensajes,

                collapsible: true,
                animCollapse: true,
                autoScroll: true,
                tabla: node.attributes.configuracionmaestro[0].nombretabla,
                idtabla: node.attributes.configuracionmaestro[pos].index,
                configuracion: node.attributes.configuracionmaestro
            });


            var panelMaestro = new Ext.Panel({
                id: 'pMaestro' + node.id,
                layout: 'fit',
                region: 'center',
                width: '60%',
                collapsible: true,
                split: true,
                items: [panelMaestroN]
            });

            var pos = 0;
            while (!node.attributes.configuraciondetalle[pos].primaria) {
                pos++;
            }

            var configuracionMensajes = {
                femenino: node.attributes.configuraciondetalle[0].femenino,
                numero: [node.attributes.configuraciondetalle[0].singular, node.attributes.configuraciondetalle[0].plural]
            };

            var panelDetalles = new Misitio.Panel_Gestion.GestionGridPanelDetalle({
                id: 'pDetalles' + node.id+ node.attributes.identificador,
                anchoForm: node.attributes.configuraciondetalle[0].anchoformulario,
                nombre: node.attributes.configuraciondetalle[0].nombrecomponente,
                region: 'east',
                width: '50%',
                columnaDetalle: node.attributes.idatributodetalle,
                configuracionMensajes: configuracionMensajes,
                collapsible: true,
                animCollapse: true,
                autoCargar: false,
                autoScroll: true,
                tabla: node.attributes.configuraciondetalle[0].nombretabla,
                idtabla: node.attributes.configuraciondetalle[pos].index,
                configuracion: node.attributes.configuraciondetalle
            });



            panelDetalles.btnAdicionar.disable();



            var panel = new Misitio.Panel_Gestion.GestionPanelMaestroDetalle({
                id: 'pPrincipalConceptosMD' + node.id+ node.attributes.identificador,
                collapsible: true,
                columnaMaestro: node.attributes.idatributomaestro,
                columnaDetalle: node.attributes.idatributodetalle,
                panelDetalle: panelDetalles,
                panelMaestro: panelMaestro,
                split: true
            });


            tabPanelConceptos.add({
                title: node.text,
                id: 'configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id,
                tabTip: node.attributes.descripcion,
                autoScroll: true,
                idpanel: panel.id,
                height: '100%',
                closable: true,
                layout: 'fit',
                items: [panel],
                listeners: {
                    activate: function (p) {
                        p.doLayout();
                    }
                    , beforedestroy: function (p) {
                        Ext.getCmp(panel.panelMaestro.items.items[0].id).ventanaGestion.destroy();
                        Ext.getCmp(panel.panelDetalle.id).ventanaGestion.destroy();
                    }
                }
            });



            tabPanelConceptos.activate('configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id);
            myMask.hide();


        } else {
            tabPanelConceptos.activate('configMD' + node.attributes.identificador + parametros.identificadorconfiguracion + parametros.id);
        }


    }

    return pPrincipal;
};

Misitio.Funciones.PanelMaestroDetalle = function (parametros, funcion) {


    var self = this;


    Misitio.Panel_Gestion.PanelGestionGenerico({
        id: 'idmaestro' + parametros.id,
        identificadorconfiguracion: parametros.configMaestro.identificadorconfiguracion,
        identificadorentidad: parametros.configMaestro.identificadorentidad
    }, function (panel, config) {
        var panelMaestro = new Ext.Panel({
            id: 'pMaestro' + parametros.id,
            layout: 'fit',
            region: 'center',
            width: '60%',
            collapsible: true,
            split: true,
            items: [panel]
        });

        Misitio.Panel_Gestion.PanelGestionGenerico({
            id: 'iddetalle' + parametros.id,
            identificadorconfiguracion: parametros.configDetalles.identificadorconfiguracion,
            identificadorentidad: parametros.configDetalles.identificadorentidad
        }, function (panel, config) {
            var panelDetalles = new Misitio.Panel_Gestion.GestionGridPanelDetalle({
                nombre: config.nombre,
                configuracionMensajes: config.configuracionMensajes,
                id: 'pDetalles' + parametros.id,
                region: 'east',
                width: '50%',
                anchoForm: config.anchoForm,
                columnaDetalle: parametros.columnaDetalle,
                autoCargar: false,
                collapsible: true,
                animCollapse: true,
                split: true,
                autoScroll: true,
                tabla: config.tabla,
                idtabla: config.idtabla,
                configuracion: config.configuracion
            });

            panelDetalles.btnAdicionar.disable();



            var pPrincipal = new Misitio.Panel_Gestion.GestionPanelMaestroDetalle({
                id: 'pPrincipalConceptosMD' + parametros.id,
                collapsible: true,
                columnaMaestro: parametros.columnaMaestro,
                columnaDetalle: parametros.columnaDetalle,
                panelDetalle: panelDetalles,
                panelMaestro: panelMaestro,
                split: true
            });

            funcion(pPrincipal);

        });

    });


};

Misitio.Funciones.PanelMaestroDetalleMultiple = function (parametros, fn) {


    var identificadorconfiguracion = parametros.identificadorconfiguracion;
    var variables = {
        nodomarcado: -1
    };
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

    var panel = null;


    myMask.show();
    Ext.Ajax.request({
        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
        method: 'POST',
        params: {
            metodo: 'cargarConfigMD',
            identificadormd: identificadorconfiguracion
        },
        callback: function (options, success, response) {
            var respuesta = Ext.decode(response.responseText);
            var panel = null;

            if (respuesta.length > 0) {

                Misitio.Panel_Gestion.PanelGestionGenerico({
                    id: 'panelMaestro' + parametros.identificadorconfiguracion + respuesta[0].id,
                    identificadorconfiguracion: respuesta[0].configuracion,
                    identificadorentidad: respuesta[0].identidadmaestro
                }, function (panelMaestro, config) {

                    //Nodo raíz del árbol de configuraciones.
                    var nodoRaiz = new Ext.tree.AsyncTreeNode({
                        id: 'rootConceptos' + parametros.id,
                        text: 'Conceptos',
                        expanded: true
                    });

                    var loaderArbolConcepto = new Ext.tree.TreeLoader({
                        id: 'loaderArbolConcepto' + parametros.id,
                        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                        baseParams: {
                            metodo: 'cargarConfigMD',
                            identificadormd: identificadorconfiguracion
                        }
                    });


                    //Arbol donde se listan las configuraciones
                    var arbolConcepto = new Ext.tree.TreePanel({
                        id: 'ArbolConcepto' + parametros.id,
                        title: '',
                        region: 'west',
                        collapsible: true,
                        autoScroll: true,
                        split: true,
                        border: false,
                        //frame: true,
                        rootVisible: true,
                        width: '100%',
                        loader: loaderArbolConcepto,

                    });
                    arbolConcepto.setRootNode(nodoRaiz);
                    //arbolConcepto.expandAll();


                    //Panel de configuraciones
                    var pConceptos = new Ext.Panel({
                        id: 'pConceptos' + parametros.id,
                        title: 'Listado de nomencladores',
                        region: 'west',
                        layout: 'fit',
                        width: screen.width * 0.20,
                        height: '100%',
                        collapsible: true,
                        split: true,
                        items: [arbolConcepto]
                    });


                    var nominalConcept = {
                        title: 'Panel maestro detalle',
                        status: 'init',
                        region: 'center',
                        xtype: 'portal',
                        items: [
                            {
                                columnWidth: 1,
                                title: 'Maestro',
                                id: 'config' + respuesta[0].id,
                                autoScroll: true,
                                height: 300,
                                layout: 'fit',
                                items: [panelMaestro]
                            }, {
                                columnWidth: 1
                            }
                        ],
                        persona: {},
                        accion: 'ADD'
                    };
                    //TabPanel
                    var tabPanelConceptos = new Ext.components.NominalConcept(nominalConcept);


                    var pPrincipal = new Misitio.Panel_Gestion.GestionPanelMaestroDetalleMultiple({
                        id: 'pPrincipalConceptos' + parametros.id,
                        pConceptos: pConceptos,
                        tabPanelConceptos: tabPanelConceptos,
                        columnaMaestro: respuesta[0].idatributomaestro,
                        collapsible: true,
                        split: true
                    });


                    var pConceptosGenericos = null;
                    arbolConcepto.on('click', function (node, e) {
                        variables.nodomarcado = node.id;
                        cargarConfiguracion(node);
                    });


                    function cargarConfiguracion(node) {
                        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

                        var respuesta1 = new Array();

                        if (document.getElementById('panelMDMultiple' + parametros.identificadorconfiguracion + node.attributes.id + node.attributes.identidadmaestro) == null && node.attributes.leaf == true) {

                            myMask.show();


                            Misitio.Panel_Gestion.PanelGestionGenerico({
                                id: 'panelMDMultiple' + parametros.identificadorconfiguracion + node.attributes.id,
                                identificadorconfiguracion: node.attributes.configuracion,
                                identificadorentidad: node.attributes.identidaddetalle
                            }, function (panel, config) {

                                var panelDetalles = new Misitio.Panel_Gestion.GestionGridPanelDetalle({
                                    nombre: config.nombre,
                                    configuracionMensajes: config.configuracionMensajes,
                                    id: 'pDetalles' + node.attributes.id,
                                    region: 'center',
                                    width: screen.width * 0.5,
                                    anchoForm: config.anchoForm,
                                    columnaDetalle: node.attributes.idatributodetalle,
                                    autoCargar: false,
                                    collapsible: true,
                                    animCollapse: true,
                                    split: true,
                                    autoScroll: true,
                                    tabla: config.tabla,
                                    idtabla: config.idtabla,
                                    configuracion: config.configuracion
                                });

                                var tools = [{
                                    id: 'close',
                                    handler: function (e, target, panel) {
                                        panel.ownerCt.remove(panel, true);
                                    }
                                }];

                                tabPanelConceptos.addConcept({
                                    title: node.text,
                                    id: 'panelMDMultiple' + parametros.identificadorconfiguracion + node.attributes.id + node.attributes.identidadmaestro,
                                    tabTip: node.attributes.descripcion,
                                    autoScroll: true,
                                    idpanel: panelDetalles.id,
                                    height: 300,
                                    tools: tools,
                                    layout: 'fit',
                                    items: [panelDetalles],
                                    listeners: {
                                        activate: function (p) {
                                            p.doLayout();
                                        }
                                        ,add: function (_this,p) {
                                            p.doLayout();
                                            panelDetalles.valorcolumnaDetalle= panelMaestro.csm.getSelected().data[respuesta[0].idatributomaestro];
                                            panelDetalles.cargarElementos(panelDetalles);
                                        }
                                        , beforedestroy: function (p) {
                                            Ext.getCmp(p.idpanel).ventanaGestion.destroy();
                                        }
                                    }
                                });

                                document.location.href = '#' + tabPanelConceptos.id;
                                myMask.hide();

                            });

                        } else {
                            document.location.href = '#' + 'panelMDMultiple' + parametros.identificadorconfiguracion + node.attributes.id + node.attributes.identidadmaestro;
                        }


                    }


                    fn(pPrincipal);

                });

            }
            myMask.hide();

        }
    });


};

Misitio.Funciones.VentanaDetalles = function (parametros) {

    var panel = new Misitio.Panel.PanelDetalles(
        {
            collapsible    : true
            , animCollapse : true
            , autoScroll   : true
            , configuracion: parametros.configuracion
            , id           : 'Misitio.Panel.PanelDetalles' + parametros.id
        });


    var ventanaDetalles = new Ext.Window({
        //title: '',
        id         : parametros.id + 'ventanaDetalles',
        modal      : true,
        autoScroll : true,
       // height     : screen.height * 0.70,
        autoHeight:true,
        width      : 340,
        closable   : true,
        resizable  : false,
        constrain  : true,
        minimizable: true,
        layout     : 'fit',
        items      : [panel]
    });

    ventanaDetalles.show();
    // ventanaImagen.maximize();
    return ventanaDetalles;

};