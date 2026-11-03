/**
 * Interfaz para mostrar perfil de indicadores
 *
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD
 * @subpackage Evaluaciones
 */

Ext.ns('Ext.Evaluaciones');
Ext.Evaluaciones.CmpPlanillaEval = Ext.extend(Ext.Window, {
    layout: 'border',
   // title: 'Planilla evaluativa',
    modal: true,
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
            baseParams: {
                idrecurso: self.idpersona,
                idpersonaevaluacion: self.idpersonaevaluacion,
                idplanilla: self.idplanilla,
                idmodelo: self.idmodelo,
                /************************PARAMETROS NUEVOS****************************/
                personas: self.personas,
                idescala:self.idescala
            },
            editable: self.editable,
            persona: self.evaluado,
            /************************PARAMETROS NUEVOS****************************/
            idplanilla: self.idplanilla,
            idmodelo: self.idmodelo,
            personas: self.personas,
            idescala:self.idescala

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
        Ext.Evaluaciones.CmpPlanillaEval.superclass.initComponent.call(this);
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
                                mostrarMensaje(1, self.labels.lbMsgFinEval);
                                self.fireEvent('evaluacionConcluida');
                                self.close();
                                var rec = Ext.util.JSON.decode(r.responseText);
                                self.evaluado.set('estado', rec.estado);
                                self.evaluado.set('valor', rec.valor);
                            }
                        });
                    } else {
                        mostrarMensaje(6, 'Faltan indicadores por evaluar.');
                        self.btnTerminarEvaluar.focus();
                    }
                }
            });
        }
    }


});
