Ext.ns('Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia');
Ext.QuickTips.init();
var variablesGlobales = {};
//Modelo de la vista del componente Nomencladores de nóminas.
Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {

        //Loader del tree de conceptos.
        this.loaderArbolConceptos = new Ext.tree.TreeLoader({
            url: 'cargarArbolNomencladores',
        });
    }
};

//Vista del componente Nomencladores de nóminas.
Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.RegimenTrabajo.Nomencladores.Nomencladores.Modelo).
     */
    init: function (perfil, idioma, modelo) {

        //Nodo raíz del árbol de conceptos.
        this.nodoRaiz = new Ext.tree.AsyncTreeNode({
            id  : 'root',
            text: 'Conceptos',
        });

        //Arbol donde se listan los conceptos.
        this.arbolConceptos = new Ext.tree.TreePanel({
            title      : idioma.lbTitleArbolConceptos,
            region     : 'west',
            collapsible: true,
            autoScroll : true,
            split      : true,
            border     : false,
            //frame: true,
            rootVisible: false,
            width      : '20%',
            loader     : modelo.loaderArbolConceptos,
            root       : this.nodoRaiz,
        });

        //TabPanel contenedor de los conceptos.
        this.tabPanelConceptos = new Ext.TabPanel({
            id             : 'idtabpanelconceptos',
            region         : 'center',
            enableTabScroll: true,
            defaults       : {
                autoScroll: true
            },
            resizeTabs     : true,
            width          : '100%',
            minTabWidth    : 115,
            tabWidth       : 320,
            resizeTabs     : true,
            frame          : true,

        });

        //Vista general.
        new Ext.Viewport({
            layout: 'border',
            items : [this.arbolConceptos, this.tabPanelConceptos]
        });

    }
};

//Controlador de la vista del componente Nomencladores de nóminas.
Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.RegimenTrabajo.Nomencladores.Nomencladores.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.RegimenTrabajo.Nomencladores.Nomencladores.Modelo)
     */
    init: function (idioma, vista, modelo) {
        /**
         *Variables globales
         */
        var variables = {
            nodomarcado: -1,
        };

        /**
         *Remover el tabpanel que se cierra
         */
        vista.tabPanelConceptos.on('remove', function (cont, comp) {
            var nodo = comp.id.substring(0, comp.id.lastIndexOf('1000'));
            vista.arbolConceptos.getNodeById(nodo).getUI().removeClass('concepto-marcado');
        }, this);

        /**
         *Evento de seleccionar un concepto en el tree de conceptos
         */
        vista.arbolConceptos.on('click', function (node, e) {

            //Desmarcar el concepto seleccionado
            if (variables.nodomarcado != -1 && variables.nodomarcado != node.id) {
                vista.arbolConceptos.getNodeById(variables.nodomarcado).getUI().removeClass('concepto-marcado');
            }
            //Incluir el js del nomenclador creado.
            PVD.IncluirJSUnaVez(node.attributes.src + '.js');

            //Incluir el js de etiquetas del nomenclador creado.
            var dir_abs = (node.attributes.src).substring(0, (node.attributes.src).lastIndexOf('/'));

            PVD.IncluirJSUnaVez(dir_abs + '/etiquetas.js');
            variables.nodomarcado = node.id;
        }.createSequence(function (node, e) {
                var i = window.setInterval(function () {
                    //Obtener la variables global
                    var varGlob = eval('variablesGlobales.' + node.attributes.referencia + '_js');
                    if (varGlob == 1) {
                        //Crear el tab en dependencia del nomenclador seleccionado
                        if (document.getElementById(node.id + '1000') == null && node.attributes.leaf == true) {
                            var clase = eval(node.attributes.clase + '.Panel');
                            var idioma = eval(node.attributes.clase + '.idioma');
                            var objClase = new clase({
                                idioma: idioma,
                                perfil: variablesGlobales.perfil
                            });
                            vista.tabPanelConceptos.add({
                                title    : node.text,
                                id       : node.id + '1000',
                                tabTip   : node.text,
                                height   : '100%',
                                closable : true,
                                layout   : 'fit',
                                items    : [objClase],
                                listeners: {
                                    activate  : function (p) {
                                        p.doLayout();
                                        p.getComponent(0).keyMap.enable();
                                    },
                                    deactivate: function (p) {
                                        p.getComponent(0).keyMap.disable();
                                    }
                                }
                            });
                        }
                        //Activar el tab creado
                        vista.tabPanelConceptos.activate(node.id + '1000');
                        window.clearInterval(i);
                        return;
                    }
                }, 100);
            }), this);

        /**
         *Evento de cambiar de tab y cambiar el cls del concepto
         */
        vista.tabPanelConceptos.on('tabchange', function (tabpanel, newtab) {
            var nodo = newtab.id.substring(0, newtab.id.lastIndexOf('1000'));
            vista.arbolConceptos.getNodeById(variables.nodomarcado).getUI().removeClass('concepto-marcado');
            variables.nodomarcado = nodo;
            vista.arbolConceptos.getNodeById(nodo).getUI().addClass('concepto-marcado');
        }, this);
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('nomencladoresasistencia', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    variablesGlobales.perfil = arguments[0];

    //Inicializando el modelo
    var modelo = Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.RegimenTrabajo.Nomencladores.NomencladoresAsistencia.Controlador.init(idioma, vista, modelo);
});
