/**
 * Interfaz para seleccionar la persona y la planilla con que se ve a evaluar *
 * 
 * @author Tte. Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */

Ext.ns("Ext.PVD.Evaluaciones.Evaluar");
Ext.PVD.Evaluaciones.Evaluar.WinSelectEvaluadoPlanilla = Ext.extend(Ext.Window,{
	layout:'border',
	modal: true,
	initComponent: function(){
		var self = this;
		
		var recordEvaluado = new Ext.data.Record.create( 
			{name: 'idpersonaevalfueraproceso'},
			{name: 'idrecurso'},
			{name: 'numid'},
			{name: 'nombre'},
			{name: 'snombre'},
			{name: 'papel'},
			{name: 'sapel'},
			{name: 'sexo'},
			{name: 'edad'},
			{name: 'categoria'},
			{name: 'cargo'},
			{name: 'entidad'},
			{name: 'idfoto'},
			{name: 'extension'},
			{name: 'idplanilla'},
			{name: 'fechaevaluacion'}
		);
		
		this.btnAceptar = new Ext.Button({
			text:self.labels.lbBtnAceptar,
			tooltip:self.labels.ttpBtnAceptarStartEval,
			iconCls:'aceptar',
			handler: evaluar
		});
		this.btnCancelar = new Ext.Button({
			text:self.labels.lbBtnCancelar,
			tooltip:self.labels.ttpBtnCancelar,
			iconCls:'cancelar',
			handler: function(){self.close();}
		});
		//Lista las personas
		var gpBuscarPersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
			id: 'panelBusPer',
			region:'west',
			margins:'5 0 5 5',
			width:'50%',
			border:true,
			title:self.labels.lbGpPersonas,
			singleSelect: true,
			height:580,
		});
		//Lista las planillas evaluativas
		var gpPlanillas = new Ext.components.Evaluaciones.CmpListPlanillasActivas({
			region:'center',
			labels: self.labels,
			margins:'5 5 5 5',
			width:'50%'
		});
		
		
		this.items = [gpBuscarPersona, gpPlanillas];
		this.buttons = [self.btnCancelar,self.btnAceptar];
		Ext.PVD.Evaluaciones.Evaluar.WinSelectEvaluadoPlanilla.superclass.initComponent.call(this);
		
		function evaluar(){
			if(gpBuscarPersona.smpersonas.hasSelection()  && gpPlanillas.chSelModel.hasSelection()){
				PVD.mostrarMascara('addingEvaldo', self.labels.lbMsgWait, self.labels.lbMskAddEvaldo);
				Ext.Ajax.request({
					url: 'addEvaldoFueraProceso',
					method:'POST',
					params: {
						idpersona: gpBuscarPersona.smpersonas.getSelected().get('idpersona'),
						idplanilla: gpPlanillas.chSelModel.getSelected().get('idplanilla')
					},
					callback: function (options,success,response){
						PVD.ocultarMascara('addingEvaldo');
						var responseData = Ext.decode(response.responseText);
						var evaluado = new recordEvaluado(responseData.datos);
						
						var win = new Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadoresFP({
							labels: self.labels,
							evaluado: evaluado,
							editable:true
						});
						win.show();
						win.maximize();
						self.close();
					}
				});
			}
		}  
		
	}
});
