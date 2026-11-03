/**
 * Interfaz para recojer la opinion del evaluado*
 *
 * @author Tte. Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */

Ext.ns("Ext.PVD.Evaluaciones.Evaluar");
Ext.PVD.Evaluaciones.Evaluar.WinOpinionEvaluado = Ext.extend(Ext.Window, {
    layout: 'border',
    region: 'center',
    frame: true,
    modal: true,
    closable: true,
    resizable: false,
    width: 300,
    height: 250,
    initComponent: function () {
        var self = this;
        this.deacuerdoRadio = new Ext.form.Radio({
            checked: true,
            labelSeparator: '',
            boxLabel: labels.lbDeacuerdo,
            name: 'acuerdo',
            inputValue: 'deacuerdo'
        });
        this.desacuerdoRadio = new Ext.form.Radio({
            labelSeparator: '',
            boxLabel: labels.lbDesacuerdo,
            name: 'acuerdo',
            inputValue: 'desacuerdo'
        });
        this.taMotivoDesacuerdo = new Ext.form.TextArea({
            fieldLabel: labels.lbMotivoDesacuerdo,
            name: 'opinion',
            disabled: true,
            anchor: '99%',
            height: '60%',
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
            regex: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            regexText: labels.MsgAlert,
            maxLength: 250
        });
        this.desacuerdoRadio.on('check', function () {
            self.taMotivoDesacuerdo.reset();
            if (self.deacuerdoRadio.getValue()) {
                self.taMotivoDesacuerdo.disable();
            }
            else{
                self.taMotivoDesacuerdo.enable();
            }
        }, this);

        this.form = new Ext.FormPanel({
            layout: 'form',
            cls: 'x-toolbar',
            labelAlign: 'top',
            region: 'center',
            width: '95%',
            height: '98%',
            frame: true,
            border: false,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.deacuerdoRadio]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.desacuerdoRadio]
                        }
                    ]
                },
                this.taMotivoDesacuerdo
            ]

        });
        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: labels.lbBtnCancelar,
            tooltip: labels.ttpbtnCancelar,
            handler: function () {
                self.close();
                self.parent.btnEvaluar.focus();
            }
        });
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: labels.lbBtnAceptar,
            tooltip: labels.ttpbtnAceptar,
            handler: function () {
                PVD.mostrarMascara('idmskmodify', 'Por favor espere', 'Guardando datos del evaluado');
                self.form.getForm().submit({
                    url: 'agregarOpinion',
                    method:'POST',
                    params: {
                        idpersonaevaluacion: self.recEval.get('idpersonaevaluacion'),
                        //opinion: self.taMotivoDesacuerdo.getValue(),
                        //reclama: self.desacuerdoRadio.getValue()== true ? 1:0,
                        //noreclama: self.deacuerdoRadio.getValue() ==true ? 1:2
                    },
                    success: function(form, action){
                        PVD.ocultarMascara('idmskmodify');
                        if (action.result.modificado == true) {
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'La opini&oacute;n ha sido adicionada satisfactoriamente.',
                                time: 3
                            });
                            self.close();
                            self.parent.stEvaluados.reload();
                        }
                        else {
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'La opini&oacute;n no se ha podido adicionar.',
                                time: 3
                            });
                            self.close();
                        }
                    }
                });
            }
        });
        this.items = [this.form];
		this.keys=[
			{
				key:Ext.EventObject.ENTER,
				fn:function(){
					self.btnAceptar.handler();
				}
			},{
				key:'x',
				alt:true,
				fn:function(){
					self.btnCancelar.handler();
				}
			}
		];
        this.buttons = [self.btnCancelar, self.btnAceptar];
        Ext.PVD.Evaluaciones.Evaluar.WinOpinionEvaluado.superclass.initComponent.call(this);
    }
});
