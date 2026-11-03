Ext.ns('Pvd.Nomina.Configuracion.General');
Ext.QuickTips.init();
var variablesGlobales = {};
//Controlador de la vista del componente Configurar periodos de pagos.
Pvd.Nomina.Configuracion.General.Controlador = {
    init: function (idioma, vista, modelo) {
        /**
         *Variables globales
         */
        var variables = {
            nodomarcado: -1
        };

        /**
         *Remover el tabpanel que se cierra
         */
        vista.tabPanel.on('remove', function (cont, comp) {
            var nodo = comp.id.substring(0, comp.id.lastIndexOf('1000'));
            vista.arbolConfiguraciones.getNodeById(nodo).getUI().removeClass('concepto-marcado');
        }, this);

        /**
         *Evento de seleccionar una configuracion en el tree de conceptos
         */
        vista.arbolConfiguraciones.on('click', function (node, e) {
            //Desmarcar el concepto seleccionado
            if (variables.nodomarcado != -1 && variables.nodomarcado != node.id) {
                vista.arbolConfiguraciones.getNodeById(variables.nodomarcado).getUI().removeClass('concepto-marcado');
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
                //console.info(varGlob);
                if (varGlob == 1) {
                    //Crear el tab en dependencia del nomenclador seleccionado
                    if (document.getElementById(node.id + '1000') == null && node.attributes.leaf == true) {
                        var clase = eval(node.attributes.clase + '.Panel');
                        var idioma = eval(node.attributes.clase + '.idioma');
                        var objClase = new clase({
                            idioma: idioma,
                            perfil: variablesGlobales.perfil
                        });
                        vista.tabPanel.add({
                            title: node.text,
                            id: node.id + '1000',
                            tabTip: node.text,
                            height: '100%',
                            closable: true,
                            layout: 'fit',
                            items: [objClase],
                            listeners: {
                                activate: function (p) {
                                    p.doLayout();
                                    //p.getComponent(0).keyMap.enable();
                                },
                                deactivate: function (p) {
                                    //p.getComponent(0).keyMap.disable();
                                }
                            }
                        });
                    }
                    //Activar el tab creado
                    vista.tabPanel.activate(node.id + '1000');
                    window.clearInterval(i);
                    return;
                }
            }, 100);
        }), this);

        /**
         *Evento de cambiar de tab y cambiar el cls del concepto
         */
        vista.tabPanel.on('tabchange', function (tabpanel, newtab) {
            var nodo = newtab.id.substring(0, newtab.id.lastIndexOf('1000'));
            vista.arbolConfiguraciones.getNodeById(variables.nodomarcado).getUI().removeClass('concepto-marcado');
            variables.nodomarcado = nodo;
            vista.arbolConfiguraciones.getNodeById(nodo).getUI().addClass('concepto-marcado');
        }, this);
    }
};