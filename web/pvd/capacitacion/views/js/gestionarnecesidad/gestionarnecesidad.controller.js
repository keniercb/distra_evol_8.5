/*
 * Gestionar necesidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarnecesidad
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionarnecesidad');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Capacitacion.Gestionarnecesidad.Controlador = {
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
            modelo.stNecesidades.removeAll();
            vista.tabPanel.disable();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            personaselect = vista.gpPersonas.getSelectionModel().getSelected().data;
            modelo.stNecesidades.baseParams.idpersona = personaselect.idpersona;
            modelo.stNecesidadesHist.baseParams.idpersona = personaselect.idpersona;
            vista.tabPanel.enable();
            if (vista.tabPanel.getActiveTab().id == 'gpNecesidadesHist') {
                modelo.stNecesidadesHist.load({params: {start: 0, limit: 15}});
            } else {
                modelo.stNecesidades.load({params: {start: 0, limit: 15}});
            }
            vista.btnAdicionar.enable();
            vista.btnVer.enable();
            Ext.getCmp('idrepind').enable();
        });

        vista.gpNecesidades.getSelectionModel().on('rowselect', function () {
            necselect = vista.gpNecesidades.getSelectionModel().getSelected().data;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
        });

        modelo.stNecesidades.on('load', function () {
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
        });

        modelo.stPersonas.on('load', function () {
            vista.sfBuscar.enable();
            Ext.getCmp('idrepind').disable();
        });

        modelo.stPersonas.on('beforeload', function(st){
            var cargartodo = (vista.chbMostrarTodas.checked == true)?1:0;
            st.baseParams.cargartodo = cargartodo;
        });

        vista.tabPanel.on('tabchange', function(){
            if (vista.tabPanel.getActiveTab().id == 'gpNecesidadesHist') {
                modelo.stNecesidadesHist.load({params: {start: 0, limit: 15}});
            } else {
                modelo.stNecesidades.load({params: {start: 0, limit: 15}});
            }
        });

        vista.chbMostrarTodas.on('check', function(){
            modelo.stPersonas.load({params:{start:0, limit:15}});
        });

        vista.btnEliminar.on('click', function () {
            eliminar()
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            vista.ventanaGestion.setTitle('Adicionar necesidad de capacitaci&oacute;n');
            vista.formularioGestion.getForm().reset();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            vista.ventanaGestion.setTitle('Modificar necesidad de capacitaci&oacute;n');
            vista.formularioGestion.getForm().loadRecord(vista.gpNecesidades.getSelectionModel().getSelected());
            vista.cbTipoNec.setRawValue(necselect.necesidad);
            vista.cbModoFormacion.setRawValue(necselect.modoformacion);
        });

        vista.btnVer.on('click', function () {
            modelo.stCompetencias.baseParams.idcargo = personaselect.idcargo;
            modelo.stCompetencias.baseParams.idpersona = personaselect.idpersona;
            modelo.stCompetencias.load();
            vista.winComp.show();
        });

        modelo.stCompetencias.on('load', function () {
            if (modelo.stCompetencias.getCount() == 0) {
                vista.resultado.setText('No hay resultados que mostrar.');
            } else {
                var idoneo = true;
                modelo.stCompetencias.each(function(rec){
                    if (rec.data.idoneo == 2) {
                        idoneo = false;
                    }
                });
                if (idoneo == false) {
                    vista.resultado.setText('\u2715 El trabajador no es idoneo para el cargo.');
                } else {
                    vista.resultado.setText('\u2714 El trabajador es idoneo para el cargo.');
                }
            }
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos('ACP');
        });

        vista.btnAplicar.on('click', function () {
            guardarDatos('APL');
        });

        vista.btnCancelar.on('click', function () {
            vista.ventanaGestion.hide();
        });

        vista.ventanaGestion.on('beforeshow', function () {
            modelo.stTipoNec.load();
            modelo.stModoFormacion.load();
        });

        vista.btnGrafica.on('click', function () {
            graficar();
        });

        function graficar()
        {
            Ext.getBody().mask('Cargando datos...');
            Ext.Ajax.request({
                url: 'getNecesidadesGrafica',
                params: {
                    idestructura: vista.tpEstructura.tree.getSelectionModel().getSelectedNode().id
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData) {
                        this.pchar = new Ext.components.HighchartPanel({
                            border: true,
                            layout: 'fit',
                            region: 'center',
                            width: '50%',
                            chartConfig: {
                                chart: {type: 'column'},
                                title: {text: 'Resumen de necesidades de capacitación'},
                                xAxis: {
                                    categories: responseData.categorias,
                                    labels: {rotation: -45, align: 'right'}
                                },
                                yAxis: {min: 0, title: {text: 'Cantidad de necesidades'}},
                                tooltip: {
                                    headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
                                    pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:11px">{series.name}: </td>' +
                                    '<td style="padding:0;font-size:11px"><b>{point.y}</b></td></tr>',
                                    footerFormat: '</table>',
                                    shared: true,
                                    useHTML: true
                                },
                                plotOptions: {
                                    column: {
                                        pointPadding: 0.2,
                                        borderWidth: 0
                                    }
                                },
                                series: responseData.series
                            }
                        });
                        var self = this;
                        //Ventana para la gráfica
                        this.winGrafica = new Ext.Window({
                            layout: 'fit',
                            constrain: true,
                            title: 'Graficar resumen de necesidades',
                            modal: true,
                            closeAction: 'destroy',
                            resizable: false,
                            listeners: {
                                close: function () {
                                    self.winGrafica.destroy();
                                    vista.tabPanel.disable();
                                },
                                show: function () {
                                    vista.tabPanel.enable();
                                }
                            }
                        });
                        this.winGrafica.add(this.pchar);
                        this.winGrafica.show();
                        this.winGrafica.maximize();
                    } else {
                        mostrarMensaje(6, 'Error');
                    }
                }
            });
        }

        function guardarDatos(btnpress)
        {
            if(vista.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addNecesidad' : 'updateNecesidad'),
                    params: {
                        iddnecesidad: accion == 'add' ? -1 : necselect.iddnecesidad,
                        idnecesidad: vista.cbTipoNec.getValue(),
                        descripcion: vista.taDescripcion.getValue(),
                        idpersona: personaselect.idpersona,
                        fecha: vista.dfFecha.getRawValue(),
                        idmodoformacion: vista.cbModoFormacion.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, 'La necesidad de capacitaci&oacute;n ha sido modificada satisfactoriamente.');
                            }else{
                                mostrarMensaje(1, 'La necesidad de capacitaci&oacute;n ha sido adicionada satisfactoriamente.');
                            }
                            if (btnpress == 'ACP')
                            {
                                vista.ventanaGestion.hide();
                            }
                            vista.formularioGestion.getForm().reset();
                            modelo.stNecesidades.removeAll();
                            modelo.stNecesidades.reload();
                        } else {
                            mostrarMensaje(6,'La necesidad que desea adicionar ya existe');
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = vista.gpNecesidades.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.iddnecesidad);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la necesidad seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar la necesidad seleccionada?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos...');
                    Ext.Ajax.request({
                        url: 'deleteNecesidad',
                        params: {idsnecesidad: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La necesidad seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las necesidades seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La necesidad ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las necesidades han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stNecesidades.removeAll();
                            modelo.stNecesidades.reload();
                        }
                    });
                }
            });
        }


        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlbxdr',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!vista.btnAdicionar.disabled){
                            accion = 'add';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.show();
                            vista.ventanaGestion.setTitle('Adicionar necesidad de capacitaci&oacute;n');
                            vista.formularioGestion.getForm().reset();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            vista.ventanaGestion.show();
                            vista.btnAplicar.hide();
                            vista.ventanaGestion.setTitle('Modificar necesidad de capacitaci&oacute;n');
                            vista.formularioGestion.getForm().loadRecord(vista.gpNecesidades.getSelectionModel().getSelected());
                            vista.cbTipoNec.setRawValue(necselect.necesidad);
                            vista.cbModoFormacion.setRawValue(necselect.modoformacion);
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
                    case 88:{ //x para cancelar
                        if (!vista.btnCancelar.disabled) {
                            vista.ventanaGestion.hide();
                        }
                        break;
                    }
                    case 68:{ //d para ver
                        if (!vista.btnVer.disabled) {
                            modelo.stCompetencias.baseParams.idcargo = personaselect.idcargo;
                            modelo.stCompetencias.baseParams.idpersona = personaselect.idpersona;
                            modelo.stCompetencias.load();
                            vista.winComp.show();
                        }
                        break;
                    }
                    case 82:{ //r para graficar
                        if (!vista.btnGrafica.disabled) {
                            graficar();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    eliminar()
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    guardarDatos('ACP');
                }
            }
        },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                //stopEvent: true,
                fn: function () {
                    if (!vista.btnAplicar.disabled) {
                        guardarDatos('APL');
                    }
                }
            }]);
    }
};
