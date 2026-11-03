/**
 * Interfaz para evaluar los recursos
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Evaluaciones
 * @copyright UCID-ERP Cuba 12
 */

Ext.ns("Ext.PVD.Evaluaciones.Evaluar");
Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadores = Ext.extend(Ext.Window, {
    layout: 'border',

    initComponent: function () {
        var self = this;
        this.title = this.editable ? 'Evaluar persona' : 'Ver evaluación';

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: self.labels.lbBtnCancelar,
            tooltip: self.labels.ttpbtnCancelar,
            handler: function () {
                self.close();
            }
        });

        this.btnTerminarEvaluar = new Ext.Button({
            hidden: !self.editable,
            iconCls: 'guardar',
            text: self.labels.lbFinEvaluar,
            tooltip: self.labels.ttpbtnAceptar,
            handler: terminarEvaluacion
        });

        var gpRecomendaciones = new Ext.PVD.Evaluaciones.gpRecomendaciones({
            labels: self.labels,
            procesoEval: self.procesoEval,
            evaluado: self.evaluado,
            editable: self.editable,
            region: 'west',
            width: '50%',
            margins: '5 5 5 5'
        });

        var gpSennalamiento = new Ext.PVD.Evaluaciones.gpSennalamiento({
            labels: self.labels,
            procesoEval: self.procesoEval,
            evaluado: self.evaluado,
            editable: self.editable,
            region: 'center',
            width: '50%',
            margins: '5 5 5 0'
        });

        var objEval = new Ext.Evaluaciones.EvalTemplate({
            title: 'Evaluaci&oacuten',
            urlSave: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/guardarValorEvalIndicador',
            urlTemplate: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarPlanillaPerfil',
            baseParams: {
                idrecurso: self.idpersona,
                idpersonaevaluacion: self.idpersonaevaluacion,
                idplanilla: self.idplanilla,
                idmodelo: self.idmodelo,
                bol : 0,
                guardar : 0,
                parametro: 0
            },
            editable: self.editable,
            nocargar: self.nocargar,
            persona: self.evaluado
        });

        var mainTabPanel = new Ext.TabPanel({
            region: 'center',
            border: false,
            activeTab: 0,
            items: [objEval, {
                title: 'Recomendaciones y señalamientos',
                layout: 'border',
                id: 'tabRecSento' + self.id,
                disabled: true,
                items: [gpRecomendaciones, gpSennalamiento]
            }]
        });

        this.items = [mainTabPanel];
		this.keys=[
			{
				key:Ext.EventObject.ENTER,
				fn:function(){
					self.btnTerminarEvaluar.handler();
				}
			},{
				key:'x',
				alt:true,
				fn:function(){
					self.btnCancelar.handler();
				}
			}
		];
        this.buttons = [self.btnCancelar, self.btnTerminarEvaluar];
        Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadores.superclass.initComponent.call(this);
        this.on('show', function (cmp) {
            Ext.Ajax.request({
                url: 'exiteRecomendacionSenamientosPE',
                method: 'POST',
                params: {
                    iddefprocesoevaluativo: self.procesoEval.get('iddefprocesoevaluativo')
                },
                callback: function (options, success, response) {
                    var result = Ext.util.JSON.decode(response.responseText);
                    if (result) {
                        Ext.getCmp('tabRecSento' + self.id).enable();
                        gpRecomendaciones.getStore().load({
                            params: {
                                start: 0,
                                limit: 15
                            }
                        });
                        gpSennalamiento.getStore().load({
                            params: {
                                start: 0,
                                limit: 15
                            }
                        });
                    }
                }
            });
        });

        function terminarEvaluacion() {
            var stopinion = new Ext.data.SimpleStore({
                fields: ['idopinion','opinion'],
                data: [
                    [0,'Sin opinión'],
                    [1,'De acuerdo'],
                    [2,'En desacuerdo'],
                ]
            });

            var cbOpinion = new Ext.form.ComboBox({
                fieldLabel: 'Opinión del evaluado',
                labelSeparator: '',
                editable: true,
                store: stopinion,
                valueField: 'idopinion',
                displayField: 'opinion',
                hiddenName: 'idopinion',
                mode: 'local',
                triggerAction: 'all',
                readOnly: true,
                allowBlank: true,
                anchor: '90%',
                emptyText: 'Seleccione...',
                blankText:'Este campo es obligatorio'

            });
            var formOpinion = new Ext.form.FormPanel({
                width: 420,
                height: 180,
                frame: true,
                region: 'center',
                bodyStyle: 'padding: 5px 5px 0',
                border: false,
                labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
                labelAlign: 'top',
                items: [
                    cbOpinion
                ]

            });

            var opinion = '';

            var btnAceptopinion = new Ext.Button({
                id: 'btnAceptopinion',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
                iconCls: 'aceptar',
                handler: function () {
                    opinion = cbOpinion.getValue();
                    windopinion.destroy();
                    Ext.Ajax.request({
                        url: 'guardaropinion',
                        params: {
                            opinion: opinion,
                            idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion')

                        },
                        success: function (n) {
                            var responseData = Ext.decode(n.responseText);
                            if(responseData.codigo==1){
                                if(objEval.baseParams.bol == 1 && objEval.baseParams.guardar == 1 || objEval.baseParams.parametro==1){
                                    PVD.mostrarMascara('validInd', self.labels.lbMsgWait, self.labels.lbMskValidInd);
                                    Ext.Ajax.request({
                                        url: 'validarIndicadoresEvaldos',
                                        method: 'POST',
                                        params: {
                                            idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion'),
                                            idperiodo:self.idperiodo
                                        },
                                        callback: function (options, success, response) {
                                            var datos = Ext.util.JSON.decode(response.responseText);
                                            PVD.ocultarMascara('validInd');
                                            if (datos.success) {
                                                PVD.mostrarMascara('saveEvalFinal', self.labels.lbMsgWait, self.labels.lbMskSaveEvalFinal);
                                                Ext.Ajax.request({
                                                    url: 'guardarEvalFinal',
                                                    method: 'POST',
                                                    params: {
                                                        idpersona: self.idpersona,
                                                        idpersonaevaluacion: self.idpersonaevaluacion,
                                                        iddefprocesoevaluativo: self.iddefprocesoevaluativo
                                                    },
                                                    callback: function (o, s, r) {
                                                        PVD.ocultarMascara('saveEvalFinal');
                                                        Ext.MessageBox.show({
                                                            title: 'Información',
                                                            msg: self.labels.lbMsgFinEval,
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.INFO,
                                                            fn: function () {
                                                                self.fireEvent('evaluacionConcluida');
                                                                self.close();
                                                            }
                                                        });
                                                        var rec = Ext.util.JSON.decode(r.responseText);
                                                        self.evaluado.set('estado', rec.estado);
                                                        self.evaluado.set('valor', rec.valor);
                                                    }
                                                });
                                            } else {
                                                Ext.MessageBox.show({
                                                    title: 'Alerta',
                                                    msg: 'Faltan indicadores por evaluar.',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.WARNING,
                                                    fn: function () {
                                                        self.btnTerminarEvaluar.focus();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                else if(objEval.baseParams.bol == 1 && objEval.baseParams.guardar == 0 ){
                                    mostrarMensaje(2, 'Se modificaron los valores de los indicadores . Está seguro que quiere guardar la evaluacion anterior?', function (btn) {
                                        if (btn == "ok") {

                                            PVD.mostrarMascara('validInd', self.labels.lbMsgWait, self.labels.lbMskValidInd);
                                            Ext.Ajax.request({
                                                url: 'validarIndicadoresEvaldos',
                                                method: 'POST',
                                                params: {
                                                    idpersonaevaluacion: self.evaluado.get('idpersonaevaluacion'),
                                                    idperiodo:self.idperiodo
                                                },
                                                callback: function (options, success, response) {
                                                    var datos = Ext.util.JSON.decode(response.responseText);
                                                    PVD.ocultarMascara('validInd');
                                                    if (datos.success) {
                                                        PVD.mostrarMascara('saveEvalFinal', self.labels.lbMsgWait, self.labels.lbMskSaveEvalFinal);
                                                        Ext.Ajax.request({
                                                            url: 'guardarEvalFinal',
                                                            method: 'POST',
                                                            params: {
                                                                idpersona: self.idpersona,
                                                                idpersonaevaluacion: self.idpersonaevaluacion,
                                                                iddefprocesoevaluativo: self.iddefprocesoevaluativo
                                                            },
                                                            callback: function (o, s, r) {
                                                                PVD.ocultarMascara('saveEvalFinal');
                                                                Ext.MessageBox.show({
                                                                    title: 'Información',
                                                                    msg: self.labels.lbMsgFinEval,
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO,
                                                                    fn: function () {
                                                                        self.fireEvent('evaluacionConcluida');
                                                                        self.close();
                                                                    }
                                                                });
                                                                var rec = Ext.util.JSON.decode(r.responseText);
                                                                self.evaluado.set('estado', rec.estado);
                                                                self.evaluado.set('valor', rec.valor);
                                                            }
                                                        });
                                                    } else {
                                                        Ext.MessageBox.show({
                                                            title: 'Alerta',
                                                            msg: 'Faltan indicadores por evaluar.',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.WARNING,
                                                            fn: function () {
                                                                self.btnTerminarEvaluar.focus();
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        } else {
                                            self.btnTerminarEvaluar.focus();
                                        }
                                    });
                                }
                            }else{
                                Ext.MessageBox.show({
                                    title: 'Alerta',
                                    msg: 'No se modificó satisfactoriamente la opinión del evaluado.',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING,
                                    fn: function () {
                                        self.btnTerminarEvaluar.focus();
                                    }
                                });
                            }


                        }
                    });

                }
            });

            var btnCancelopinion = new Ext.Button({
                id: 'btnCancelopinion' ,
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
                iconCls: 'cancelar',
                handler: function () {
                    windopinion.destroy();
                }
            });
            var windopinion = new Ext.Window({
                title:'Formato del reporte',
                border: false,
                modal: true,
                width: 430,
                height:160,
                closable: true,
                resizable: false,
                closeAction: 'hide',
                items: [formOpinion],

                buttons: [btnCancelopinion,btnAceptopinion]
            });

            windopinion.show();



        }
    }
});
