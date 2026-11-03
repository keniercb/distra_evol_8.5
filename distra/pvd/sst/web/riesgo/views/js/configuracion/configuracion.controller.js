/**
* @name configuracion.controller - Controlador de la vista de la interfaz.
* @package   Pvd.Sst.Riesgo
* @uses      Pvd.Sst.Riesgo.Configuracion
* @copyright XETID.
* @author    Centro RRHH. División Gestión de Entidades. XETID.
*            Eddy Santana Navarro
* @version   1.0
*/
Ext.ns('Pvd.Sst.Riesgo.Configuracion');
Pvd.Sst.Riesgo.Configuracion.Controlador = {
    init: function(idioma, vista, modelo) {
        var itemTab = new Array(); //Inicializando arreglos de elementos del TabPanel
        //Evento click en el menú
        vista.tpMenu.on('click', function(n){
            if (n.isLeaf()) {
                if (!Ext.isEmpty(n)) {
                    var nodeUI = n.ui;
                    nodeUI.checked = true;
                    nodeUI.checkbox.checked = true;
                    nodeUI.checkbox.defaultChecked = true;
                    n.attributes.checked = true;
                    cargarPanel(n);
                }
            }
        });

        vista.tabPanel.on('remove', function(container, cmp){
            vista.tpMenu.getNodeById(cmp.id).getUI().toggleCheck(false);
        });

        vista.tpMenu.on('checkchange', function(node, ch){
            if (ch == true) {
                cargarPanel(node);
            }  else {
                vista.tabPanel.remove(node.id);
            }
        });

        /**
         * @method cargarPanel - Carga el panel dado un elemento seleccionado en el menú.
         * @param node - Nodo seleccionado en el menú(TreePanel).
         */
        function cargarPanel(node){
            if(!vista.tabPanel.getItem(node.id)) {
                if (node.id == 'riesgo') {
                    var pRiesgo = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Riesgo({idioma:idioma});
                    vista.tabPanel.add(pRiesgo);
                    itemTab.push(node.id);
                    pRiesgo.doLayout();
                }
                if (node.id == 'probabilidad') {
                    var pProbabilidad = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Probabilidad({idioma:idioma});
                    vista.tabPanel.add(pProbabilidad);
                    itemTab.push(node.id);
                    pProbabilidad.doLayout();
                }
                if (node.id == 'nivelriesgo') {
                    var pNivelriesgo = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.NivelRiesgo({idioma:idioma});
                    vista.tabPanel.add(pNivelriesgo);
                    itemTab.push(node.id);
                    pNivelriesgo.doLayout();
                }
                if (node.id == 'frecuencia') {
                    var pFrecuencia = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Frecuencia({idioma:idioma});
                    vista.tabPanel.add(pFrecuencia);
                    itemTab.push(node.id);
                    pFrecuencia.doLayout();
                }
                if (node.id == 'recurso') {
                    var pRecurso = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Recurso({idioma:idioma});
                    vista.tabPanel.add(pRecurso);
                    itemTab.push(node.id);
                    pRecurso.doLayout();
                }
                if (node.id == 'evento') {
                    var pEvento = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Evento({idioma:idioma});
                    vista.tabPanel.add(pEvento);
                    itemTab.push(node.id);
                    pEvento.doLayout();
                }
                if (node.id == 'clasifequipo') {
                    var pClas = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.ClasifEquipo({idioma: idioma});
                    vista.tabPanel.add(pClas);
                    itemTab.push(node.id);
                    pClas.doLayout();
                }
                if (node.id == 'tipoinspeccion') {
                    var pTipoInsp = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Tipoinspeccion({idioma: idioma});
                    vista.tabPanel.add(pTipoInsp);
                    itemTab.push(node.id);
                    pTipoInsp.doLayout();
                }
                if (node.id == 'peligro') {
                    var pPeli = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Peligro({idioma: idioma});
                    vista.tabPanel.add(pPeli);
                    itemTab.push(node.id);
                    pPeli.doLayout();
                }
                if (node.id == 'consecuencia') {
                    var pConsec = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Consecuencia({idioma: idioma});
                    vista.tabPanel.add(pConsec);
                    itemTab.push(node.id);
                    pConsec.doLayout();
                }
                if (node.id == 'sistema') {
                    var pSist = new Pvd.Sst.Riesgo.Configuracion.Nomencladores.Sistema({idioma: idioma});
                    vista.tabPanel.add(pSist);
                    itemTab.push(node.id);
                    pSist.doLayout();
                }
                if (node.id == 'magnitud') {
                    var pMag = new Pvd.Sst.Riesgo.Configuracion.MagnitudRiesgo({idioma: idioma});
                    vista.tabPanel.add(pMag);
                    itemTab.push(node.id);
                    pMag.doLayout();
                }
                if (node.id == 'grado') {
                    var hfIdExpresionMatematica = new Ext.form.Hidden();
                    var tfFormula = new Ext.form.TextField({
                        readOnly: true,
                        hideLabel: true,
                        name: 'formula',
                        anchor: '100%',
                        allowBlank: false,
                        emptyText: 'Fórmula matemática',
                        listeners: {
                            show: function (cmp) {
                                cmp.setWidth('100%');
                            }
                        }
                    });

                    var btnBuscarFormula = new Ext.Button({
                        text: 'Buscar',
                        iconCls: 'buscar',
                        tooltip: 'Buscar f&oacute;rmula matem&aacute;tica',
                        style: 'margin: 8 0 0 0',
                        handler: function () {
                            var arrIndicadores = new Array();
                            arrIndicadores = [
                                [1, 'Exposición'], [2, 'Consecuencia'], [3, 'Probabilidad']
                            ];

                            var objExp = new Ext.pvd.persona.formula.winEditorExpresionesEvalSel({
                                hideFieldDenom: false,
                                indicadores: arrIndicadores,
                                width: 1300,
                                mostrarCondicionales: true,
                                idexpresionmatematica: hfIdExpresionMatematica.getValue() || -1
                            });

                            objExp.show();
                            objExp.on('expresionsalvada', function (data) {
                                hfIdExpresionMatematica.setValue(data.idexpresionmatematica);
                                tfFormula.setValue(data.denom);
                                Ext.Ajax.request({
                                    url: '/pvd/sst/riesgo/index.php/gestionargrado/addGrado',
                                    method: 'POST',
                                    params: {
                                        idexpresionmatematica: data.idexpresionmatematica
                                    },
                                    callback: function (options, success, response) {
                                        responseData = Ext.decode(response.responseText);
                                        PVD.ocultarMascara('idmskmodify');
                                        mostrarMensaje(1, 'La configuración se ha adicionado satisfactoriamente.');
                                    }
                                });
                                objExp.close();
                            });

                        }
                    });

                    this.formGeneral = new Ext.form.FormPanel({
                        layout: 'fit',
                        height: 800,
                        border: false,
                        frame: true,
                        region: 'center',
                        labelAlign: 'top',
                        items: [
                            {
                                layout: 'column',
                                items: [
                                    {
                                        columnWidth: 1,
                                        style: 'margin:20 0 0 5',
                                        layout: 'form',
                                        html: '<b>Insertar una fórmula matemática a la configuración.</b>'
                                    },
                                    {
                                        columnWidth: .40,
                                        style: 'margin:0 0 0 5',
                                        layout: 'form',
                                        items: [tfFormula]
                                    }, {
                                        columnWidth: .20,
                                        style: 'margin:-5 0 0 5',
                                        layout: 'form',
                                        items: [btnBuscarFormula]
                                    }

                                ]
                            }
                        ]
                    });

                    var panelCentral = new Ext.Panel({
                        layout: 'border',
                        title: 'Configurar grado de peligrosidad',
                        region: 'center',
                        id: 'grado',
                        height: '100%',
                        closable: true,
                        iconCls: '',
                        items: [this.formGeneral]
                    });

                    vista.tabPanel.add(panelCentral);
                    itemTab.push(node.id);
                    panelCentral.doLayout();
                    Ext.Ajax.request({
                        url: '/pvd/sst/riesgo/index.php/gestionargrado/getGrado',
                        params: {},
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.length > 0) {
                                hfIdExpresionMatematica.setValue(responseData[0].idexpresionmatematica);
                                tfFormula.setValue(responseData[0].denomformula);
                            }
                        }
                    });
                }
            }
            vista.tabPanel.setActiveTab(node.id);
        }
    }
};