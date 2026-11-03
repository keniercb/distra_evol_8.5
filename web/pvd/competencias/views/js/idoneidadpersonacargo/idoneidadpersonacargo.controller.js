/*
 * Idoneidad de la persona en su cargo.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Idoneidadpersonacargo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Competencia.Idoneidadpersonacargo');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Competencia.Idoneidadpersonacargo.Controlador = {
    init: function (idioma, vista, modelo) {
        var personaselect, node, stp;
        modelo.stPersonasAll.load({params: {start: 0, limit: 15, query: vista.sfBuscarAll.getValue()}});
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stPersonas.baseParams.idcargo = null;
            modelo.stPersonas.baseParams = {idestructura: node.attributes.id};
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stPersonas.baseParams.idcargo = node.attributes.id;
                modelo.stPersonas.baseParams.idestructura =  null;
                vista.btnAdicionar.enable();
            } else {
                modelo.stPersonas.baseParams.idcargo = null;
                modelo.stPersonas.baseParams.idestructura =  node.attributes.id;
                vista.btnAdicionar.disable();
            }
            modelo.stPersonas.removeAll();
            modelo.stCompetencias.removeAll();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            personaselect = vista.gpPersonas.getSelectionModel().getSelected().data;
            if (stp[0].data.tipo == 1) {
                modelo.stCompetencias.baseParams.idcargo = personaselect.idcargo;
                modelo.stCompetencias.baseParams.idpersona = personaselect.idpersona;
                modelo.stCompetencias.load();
                vista.gpCompetencias.enable();
                vista.tcbCargos.setValue(personaselect.idcargo);
                vista.tcbCargos.setRawValue(personaselect.cargo);
            }
        });

        vista.gpPersonas2.getSelectionModel().on('rowselect', function () {
            vista.btnEliminar.enable();
        });

        modelo.stPersonas2.on('beforeload', function () {
            vista.btnEliminar.disable();
        });

        modelo.stPersonas.on('beforeload', function () {
            vista.gpCompetencias.disable();
            modelo.stCompetencias.removeAll();
        });

        modelo.stPersonas.on('load', function () {
            stp = modelo.stPersonas.getRange();
            if (stp[0].data.tipo == 1) {
                vista.gpCompetencias.expand();
                vista.gpCompetencias.show();
                Ext.getCmp('idoneidadcargo').enable();
            } else {
                vista.gpCompetencias.collapse();
                vista.gpCompetencias.hide();
                Ext.getCmp('idoneidadcargo').disable();
            }
            var noidoneo = false;
            modelo.stPersonas.each(function (rec) {
                if (rec.data.idoneo != '') {
                    if (rec.data.idoneo == 0 || rec.data.idoneo == 2) {
                        noidoneo = true;
                    }
                }
            });
            if (noidoneo == true) {
                mostrarMensaje(8, 'Existen trabajadores no id&oacute;neos en la estructura seleccionada.')
            }
        });

        modelo.stCompetencias.on('load', function () {
            if (modelo.stCompetencias.getCount() == 0) {
                mostrarMensaje(1, 'No hay resultados que mostrar.');
                vista.resultado.setText('No hay resultados que mostrar.');
            } else {
                var idoneo = true;
                modelo.stCompetencias.each(function(rec){
                    if (rec.data.idoneo == 2) {
                        idoneo = false;
                    }
                });
                if (idoneo == false) {
                    mostrarMensaje(1, 'El trabajador no es id&oacute;neo para el cargo.');
                    vista.resultado.setText('<marquee>\u2715 El trabajador no es idóneo para el cargo.</marquee>', false);
                } else {
                    mostrarMensaje(1, 'El trabajador es id&oacute;neo para el cargo.');
                    vista.resultado.setText('<marquee>\u2714 El trabajador es idóneo para el cargo.</marquee>', false);
                }
            }
        });

        vista.tcbCargos.tree.on('click', function (n) {
            if (n.attributes.idconcepto != 7) {
                mostrarMensaje(6, 'Debe seleccionar un cargo.');
                vista.tcbCargos.setRawValue('');
            } else {
                vista.tcbCargos.setRawValue(n.attributes.denominacion);
                modelo.stCompetencias.baseParams.idcargo = n.id;
                modelo.stCompetencias.baseParams.idpersona = personaselect.idpersona;
                modelo.stCompetencias.load();
                vista.gpCompetencias.enable();
            }
        });

        vista.tabPanel.on('tabchange', function () {
            if (vista.tabPanel.getActiveTab().id == 'idoneidadcargo') {
                modelo.stPersonas2.removeAll();
            } else {
                modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            }
        });

        vista.winAdd.on('hide', function () {
            vista.gpPersonasAll.getSelectionModel().clearSelections();
        });

        vista.btnAdicionar.on('click', function () {
            vista.winAdd.show();
        });

        vista.btnEliminar.on('click', function () {
            var sel = vista.gpPersonas2.getSelectionModel().getSelections();
            for (i = 0; i < sel.length; i++) {
                modelo.stPersonas2.remove(sel[i]);
            }
            if (modelo.stPersonas2.getCount() == 0) {
                modelo.stPersonas2.removeAll();
            }
        });

        vista.btnAceptar.on('click', function () {
            var pers = new Array();
            var sel = vista.gpPersonasAll.getSelectionModel().getSelections();
            for(p = 0; p < sel.length; p++) {
                pers.push(sel[p].data.idpersona);
            }
            Ext.getBody().mask('Cargando datos...');
            Ext.Ajax.request({
                url: 'getIdoneidad',
                params: {idcargo: node.id, personas: Ext.encode(pers)},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    for (s = 0; s < sel.length; s++) {
                        for (i = 0; i < responseData.length; i++) {
                            if (responseData[i]['idpersona'] == sel[s].data['idpersona']) {
                                sel[s].data['idoneo'] = responseData[i]['idoneo'];
                            }
                            modelo.stPersonas2.add(sel[i]);
                        }
                    }                    
                    vista.winAdd.hide();
                }
            });
        });

        Ext.getCmp('btnExportar1').on('click', function () {
            exportar();
        });

        Ext.getCmp('btnExportar').on('click', function () {
            exportarnoidoneo();
        });

        function exportar() {
            var params;
            params = Ext.urlEncode({
                tipo: stp[0].data.tipo,
                idestructura: node.id,
                idcargo: (node.attributes.idconcepto == 7)?node.id:null
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Resumen de idoneidad',
                width: 800,
                height: 500,
                id: 'winres',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                listeners: {
                    'beforeshow': function()
                    {
                        vista.gpCompetencias.enable();
                    },
                    'hide': function()
                    {
                        if (vista.gpPersonas.getSelectionModel().getSelected()) {
                            vista.gpCompetencias.enable();
                        } else {
                            vista.gpCompetencias.disable();
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
                        '/pvd/competencias/index.php/idoneidadpersonacargo/exportarResumen?' + params
                    }
                }
            }).show();
            Ext.getCmp('winres').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando resumen de idoneidad.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        }

        function exportarnoidoneo() {
            var params;
            params = Ext.urlEncode({
                tipo: stp[0].data.tipo,
                idestructura: node.id,
                idcargo: (node.attributes.idconcepto == 7)?node.id:null
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Listado de trabajadores no id&oacute;neos',
                width: 800,
                height: 500,
                id: 'winres',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                listeners: {
                    'beforeshow': function()
                    {
                        vista.gpCompetencias.enable();
                    },
                    'hide': function()
                    {
                        if (vista.gpPersonas.getSelectionModel().getSelected()) {
                            vista.gpCompetencias.enable();
                        } else {
                            vista.gpCompetencias.disable();
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
                        '/pvd/competencias/index.php/idoneidadpersonacargo/exportarNoidoneo?' + params
                    }
                }
            }).show();
            Ext.getCmp('winres').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando listado de trabajadores no id&oacute;neos.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        }

        vista.btnExportar2.on('click', function () {
            exportar2();
        });

        function exportar2() {
            var pers = modelo.stPersonas2.getRange();
            if (pers.length > 0) {
                var persons = new Array();
                for(p = 0; p < pers.length; p++) {
                    persons[p] = pers[p].data.idpersona;
                }
                var params;
                params = Ext.urlEncode({
                    idcargo: node.id,
                    datos: Ext.encode(persons)
                });
                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Resumen de idoneidad',
                    width: 800,
                    height: 500,
                    id: 'winres',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrain: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/competencias/index.php/idoneidadpersonacargo/exportarIdoneidadcargo?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winres').maximize();

                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando resumen de idoneidad.');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }; 
            }  else {
                mostrarMensaje(8, 'No existe informaci&oacute;n para exportar.');
            }         
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'ilbxe',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!vista.btnAdicionar.disabled){
                            vista.winAdd.show();
                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger1Click();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger2Click();
                        }
                        break;
                    }
                    case 69:{ //e para exportar
                        if (vista.tabPanel.getActiveTab().id == 'idoneidad') {
                            exportar();
                        } else {
                            exportar2();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    var sel = vista.gpPersonas2.getSelectionModel().getSelections();
                    for (i = 0; i < sel.length; i++) {
                        modelo.stPersonas2.remove(sel[i]);
                    }
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    var pers = new Array();
                    var sel = vista.gpPersonasAll.getSelectionModel().getSelections();
                    for(p = 0; p < sel.length; p++) {
                        pers.push(sel[p].data.idpersona);
                    }
                    Ext.Ajax.request({
                        url: 'getIdoneidad',
                        params: {idcargo: node.id, personas: Ext.encode(pers)},
                        callback: function () {
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            for (s = 0; s < sel.length; s++) {
                                for (i = 0; i < responseData.length; i++) {
                                    if (responseData[i]['idpersona'] == sel[s].data['idpersona']) {
                                        sel[s].data['idoneo'] = responseData[i]['idoneo'];
                                    }
                                    modelo.stPersonas2.add(sel[i]);
                                }
                            }
                            vista.winAdd.hide();
                        }
                    });
                }
            }
        }]);
    }
};
