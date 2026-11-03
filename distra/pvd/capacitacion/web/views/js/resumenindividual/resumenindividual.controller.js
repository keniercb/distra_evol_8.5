/*
 *Resumen individual de capacitación.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Resumenindividual
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Resumenindividual');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Capacitacion.Resumenindividual.Controlador = {
    init: function (idioma, vista, modelo) {

        var accion, node, personaselect, necselect;
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stPersonas.baseParams.idcargo = '';
            modelo.stPersonas.baseParams = {idestructura: node.attributes.id};
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stPersonas.baseParams.idcargo = node.attributes.id;
            } else {
                modelo.stPersonas.baseParams.idestructura =  node.attributes.id;
            }
            modelo.stPersonas.removeAll();
            modelo.stAcciones.removeAll();
            vista.tabPanel.disable();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            personaselect = vista.gpPersonas.getSelectionModel().getSelected().data;
            modelo.stAcciones.baseParams.idpersona = personaselect.idpersona;
            modelo.stAccionesHist.baseParams.idpersona = personaselect.idpersona;
            vista.tabPanel.enable();
            vista.dfFInicioBuscar.reset();
            vista.dfFFinBuscar.reset();
            if (vista.tabPanel.getActiveTab().id == 'gpAccionesHist') {
                modelo.stAccionesHist.load({params: {start: 0, limit: 15}});
            } else {
                modelo.stAcciones.load({params: {start: 0, limit: 15}});
            }
        });

        modelo.stAcciones.on('beforeload', function () {
            modelo.stAcciones.removeAll();
            modelo.stPersonas.baseParams.fdesde = vista.dfFInicioBuscar.getRawValue();
            modelo.stPersonas.baseParams.fhasta = vista.dfFFinBuscar.getRawValue();
        });

        modelo.stAccionesHist.on('beforeload', function () {
            modelo.stAccionesHist.removeAll();
        });

        modelo.stPersonas.on('load', function () {
            vista.sfBuscar.enable();
        });

        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'gpAccionesHist') {
                modelo.stAccionesHist.load({params: {start: 0, limit: 15}});
            } else {
                modelo.stAcciones.load({params: {start: 0, limit: 15}});
            }
        });

        vista.btnExportar.on('click', function () {
            if (vista.dfFInicioBuscar.getValue() != '' && vista.dfFFinBuscar.getValue() != '') {
                exportarPlanCapacitInd();
            } else {
                mostrarMensaje(6, 'Debe definir un periodo para exportar el plan individual de capacitaci&oacute;n');
            }
        });

        function exportarPlanCapacitInd() {
            var params;
            params = Ext.urlEncode({
                idpersona: personaselect.idpersona,
                fdesde: vista.dfFInicioBuscar.getRawValue(),
                fhasta: vista.dfFFinBuscar.getRawValue()
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Plan individual de capacitación',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                listeners: {
                    'beforeshow': function()
                    {
                        vista.tabPanel.enable();
                    },
                    'hide': function()
                    {
                        if (vista.gpAcciones.getSelectionModel().getSelected().lenght > 0) {
                            vista.tabPanel.enable();
                        } else {
                            vista.tabPanel.disable();
                        }
                    }
                },
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/capacitacion/index.php/resumenindividual/generarPdfReportes?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando plan individual de capacitación.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        }


        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'lbe',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 76:{ //l para limpiar
                        if (!vista.btnLimpiar.disabled) {
                            vista.btnLimpiar.handler();
                        }
                        break;
                    }
                    /* case 72:{ //h para ayuda

                     break;
                     }*/
                    case 66:{ //b para buscar
                        if (!vista.btnBuscar.disabled) {
                            vista.btnBuscar.handler();
                        }
                        break;
                    }
                    case 69:{ //e para exportar
                        if (vista.dfFInicioBuscar.getValue() != '' && vista.dfFFinBuscar.getValue() != '') {
                            exportarPlanCapacitInd();
                        } else {
                            mostrarMensaje(6, 'Debe definir un periodo para exportar el plan individual de capacitaci&oacute;n');
                        }
                        break;
                    }
                }
            }
        }]);

    }
};
