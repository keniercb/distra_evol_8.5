
/*	* Ext.grid.XPrinter 
 	* Impresion de reportes* 
 	* @author Yasser Linares Dominguez* 
 	* @package ERP Cuba* 
 	* @copyright UCID-ERP Cuba* 
 	* @version 1.0-1* 
*/
Ext.grid.XPrinter = function(config){
	Ext.apply(this,config);
	this.addEvents('afterPrint','closedPrintWindow');	
	Ext.grid.XPrinter.superclass.constructor.call(this);
}
 
Ext.reg('XPrinter',Ext.grid.XPrinter);
Ext.extend(Ext.grid.XPrinter , Ext.util.Observable,{	
	styles:'default',
	pathPrinter:'printer',
	pdfEnable:false,
	paperOrientation:'l',
	logoURL:'', 
	wWidth : 1020,
	wHeight: 700,
	excludefields:'',
	hasrowAction:false, 
	usenameindex:false,
	tampag:0,
	tamtabla:'98%',
	localeData:{
		Title:'Title',
		subTitle:'Subtitle',
		footerText:'Page footer', 
		pageNo:'Page #',
		printText:'Imprimir',
		closeText:'Cerrar',
		pdfText:''
		
	},
	useCustom:{ 
		custom:false,
		customStore: null, 
		customTPL: false, 
		TPL: null,  
		columns:[],
		alignCols:[],
		pageToolbar:null,
		useIt: false, 
		showIt: false, 
		location: 'bbar'
	},		
	showdate:true,
	showdateFormat:'d-m-Y',
	showFooter:true,
	footerText:'',
	renderers:null,	
	init: function(){;
		this.htmloutput='';
		this.flagdatachange=false; 
		this.flagrenderedPtool =false; 
	},
	prepare: function(){
		if (this.paperOrientation=='p' || this.paperOrientation=='l'){
		} else {
			this.paperOrientation='p'; 
		}		 
		this.PrinterWindow = window.open( this.pathPrinter + "/printer.phtml?pdfgen=1&paper=l"  ,"PrinterWindow","width=" + this.wWidth + ",height=" + this.wHeight + ",resizable=1,scrollbars=1, menubar=yes");			
	},
	getDatareport:function(){ 
		
		var datareport = {
			title: this.localeData.Title,
			subtitle: this.localeData.subTitle,			
			footer: this.localeData.footerText,
			currpage: this.localeData.pageNo,
			valuebody: '{valuebody}',
			pageno: '{pageno}',
			pdfprint: this.pdfEnable
		}
		var bodytpl=new Ext.XTemplate(				
			'<div>{valuebody}</div>'//pie de pag
		);		
		var ftext = bodytpl.applyTemplate(datareport);

		switch(reporte)
		{
		 case 'submayorGasto': {this.tampag = 13;}break;
		 case 'resumenGasto': {this.tampag = 21;}break;
		 case 'estadoC': {this.tampag = 22;}break;
		 case 'analisisingresos': {this.tampag = 30;}break;
		 case 'gastospresupuesto': {this.tampag = 27;}break;
		 case 'distribucionfinanciamiento': {this.tampag = 27;}break;
		 case 'situacionfondos': {this.tampag = 27;}break;
		 case 'estadoBseccionI': {this.tampag = 21;}break;
		 case 'estadoBseccionII': {this.tampag = 21;}break;
		 case 'anexo3': {this.tampag = 25;}break;
		 case 'anexo2': {this.tampag = 22;}break;
		 case 'submayorIngresoCta655': {this.tampag = 28;}break;
		 case 'submayorIngresoCta955': {this.tampag = 28;}break;
		 case 'submayorIngresoCta440': {this.tampag = 28;}break;
		 case 'submayorIngreso': {this.tampag = 15;}break;
		}
		
		if (this.useCustom.custom==false){ 
			varnumrecs = this.grid.store.getCount();
			var tdvalues = '';
			var incrementa = true;
			var desde = 0;
		    var hasta = this.tampag;
		    var resto = varnumrecs%this.tampag;
		    var ciclo = parseInt(varnumrecs/this.tampag);		    
		    if(varnumrecs < hasta)hasta = varnumrecs;	
            var j = 0; // para controlar cambio de pagina..
            var m = 0; // para iterar arrayBoolPartidas para colocar tabla de resumen de partidas en el submayor de gastos...			
			while(incrementa){	
                    var tabla_cabeza = '';					
                    if(reporte == 'submayorGasto')
                    {
                     tabla_cabeza = '<center><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td width="110" height="30" style="vertical-align:top; padding:3px 0 0 5px; border-bottom:none;"><b>MINFAR</b></td>';
					 tabla_cabeza += '<td align="center" style="vertical-align:bottom; border-bottom:none;"><b>SUBMAYOR DE GASTOS DEL PRESUPUESTO</b></td>';
					 tabla_cabeza += '<td width="130" rowspan="2" style="vertical-align:top; padding:3px 0 0 5px; border-bottom:none;"><b>No.</b></td></tr>';
					 tabla_cabeza += '<tr><td height="40" style="vertical-align:top; padding:0 0 0 5px; border-top:none; border-bottom:none;"><b>UM</b>: '+entidad+'</td>';
					 tabla_cabeza += '<td align="center" style="border-top:none; border-bottom:none; vertical-align:top; padding: 5px 0 0 0;"><b>SCF-52</b></td></tr></table>';
					 tabla_cabeza += '<table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
					 tabla_cabeza += '<td height="20" style="border-right:none; padding-left:5px;"><b>GRUPO PRESUPUESTARIO</b>: '+arrayCentroCosto[j]+'</td>';
					 tabla_cabeza += '<td style="border-left:none;"><b>CLASIFICACI&Oacute;N DEL GASTO</b>: '+clasificacionGasto+'</td></tr>';
					 tabla_cabeza += '<tr><td height="20" style="border-right:none; padding-left:5px;"><b>ESPECIALIDAD</b>: '+arrayEspecialidad[j]+'</td>';
					 tabla_cabeza += '<td style="border-left:none;"><b>PARTIDA DIRECTIVA</b>: Partida Directiva</td></tr>';
					 tabla_cabeza += '<tr><td height="20" colspan="2" style="padding-left:5px;"><b>PERIODO TERMINADO EN</b>: '+finPeriodo+'</td></tr>';
					 tabla_cabeza += '<tr><td height="10" colspan="2" style="border-bottom:none;">&nbsp;</td></tr></table>';
					 tabla_cabeza += '<table style="font-size:12px;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td height="35" align="center" colspan="2"><b>A&Ntilde;O</b> <br/> '+anno+'</td>';
					 tabla_cabeza += '<td width="43" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>CO</b></td>';
					 tabla_cabeza += '<td align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>DETALLE</b></td>';
					 tabla_cabeza += '<td width="110" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:3px;"><b>PRESUPUESTO <br/> APROBADO</b> </td>';
					 tabla_cabeza += '<td width="110" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:3px;"><b>GASTOS <br/> (REINTEGROS)</b> </td>';
					 tabla_cabeza += '<td width="100" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>SALDO</b></td>';
					 tabla_cabeza += '<td width="93" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>PARTIDA</b></td>';
					 tabla_cabeza += '<td width="40" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>H</b></td></tr>';
					 tabla_cabeza += '<tr><td align="center" width="34" style="border-bottom:none;"><b>D</b></td>';
					 tabla_cabeza += '<td align="center" width="34" style="border-bottom:none;"><b>M</b></td></tr></table></center>';
					}
                    if(reporte == 'resumenGasto')
                    {	
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td height="50" width="140" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>MINFAR</b></td>';
					 tabla_cabeza += '<td align="center" colspan="4"><b>RESUMEN DE GASTOS</b></td></tr><tr>';
					 tabla_cabeza += '<td rowspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+' </td>';
					 tabla_cabeza += '<td align="center" colspan="3" height="25"><b>PER&Iacute;ODO TERMINADO EN</b></td><td rowspan="3" align="center" style="border-bottom:none;"><b>UNIDAD DE MEDIDA <br>(PESOS Y CENTAVOS)</b></td>';
					 tabla_cabeza += '</tr><tr><td width="80" align="center"><b>D</b></td><td width="80" align="center"><b>M</b></td><td width="80" align="center"><b>A</b></td>';
					 tabla_cabeza += '</tr><tr><td align="center" style="border-bottom:none;">'+finPeriodoDia+'</td><td align="center" style="border-bottom:none;">'+finPeriodoMes+'</td>';
					 tabla_cabeza += '<td align="center" style="border-bottom:none;">'+finPeriodoAnno+'</td></tr></table>';
					 tabla_cabeza += '<table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td align="center" rowspan="2" style="border-bottom:none;"><b>GRUPO PRESUPUESTARIO</b></td><td height="45" align="center" colspan="2"><b>SALARIO</b></td>';
					 tabla_cabeza += '<td align="center" colspan="2"><b>OTROS GASTOS</b></td><td align="center" colspan="2"><b>CAPITAL</b></td></tr><tr>';
					 tabla_cabeza += '<td height="25" align="center" width="100" style="border-bottom:none;"><b>ACUMULADO</b></td><td height="25" align="center" width="100" style="border-bottom:none;"><b>MES ACTUAL</b></td>';
					 tabla_cabeza += '<td height="25" align="center" width="100" style="border-bottom:none;"><b>ACUMULADO</b></td><td height="25" align="center" width="100" style="border-bottom:none;"><b>MES ACTUAL</b></td>';
					 tabla_cabeza += '<td height="25" align="center" width="100" style="border-bottom:none;"><b>ACUMULADO</b></td><td height="25" align="center" width="100" style="border-bottom:none;"><b>MES ACTUAL</b></td></tr></table></center>';
                    } 	
                    if(reporte == 'estadoC')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td height="50" width="140" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>MINFAR</b></td>';
					 tabla_cabeza += '<td align="center" colspan="4"><b>ESTADO DE EJECUCI&Oacute;N DEL PRESUPUESTO POR GRUPOS PRESUPUESTARIOS <br> SICF-ESTADO C</b></td></tr><tr>';
					 tabla_cabeza += '<td rowspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+' </td>';
					 tabla_cabeza += '<td align="center" colspan="3" height="25"><b>PER&Iacute;ODO TERMINADO EN</b></td><td rowspan="3" align="center" style="border-bottom:none;"><b>UNIDAD DE MEDIDA <br>(PESOS Y CENTAVOS)</b></td>';
					 tabla_cabeza += '</tr><tr><td width="80" align="center"><b>D</b></td><td width="80" align="center"><b>M</b></td><td width="80" align="center"><b>A</b></td>';
					 tabla_cabeza += '</tr><tr><td align="center" style="border-bottom:none;">'+finPeriodoDia+'</td><td align="center" style="border-bottom:none;">'+finPeriodoMes+'</td><td align="center" style="border-bottom:none;">'+finPeriodoAnno+'</td>';
					 tabla_cabeza += '</tr></table><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td height="45" align="center" style="border-bottom:none;"><b>GRUPO PRESUPUESTARIO</b></td><td width="150" align="center" style="border-bottom:none;"><b>SALARIO</b></td>';
					 tabla_cabeza += '<td width="150" align="center" style="border-bottom:none;"><b>OTROS GASTOS</b></td><td width="150" align="center" style="border-bottom:none;"><b>CAPITAL</b></td>';
					 tabla_cabeza += '<td width="150" align="center" style="border-bottom:none;"><b>TOTAL</b></td></tr></table></center>';
					}	
                    if(reporte == 'analisisingresos')	
                    {
					 tabla_cabeza = '<center><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr><td colspan="5" align="center" height="40"><b>ANALISIS DE LOS INGRESOS</b></td></tr>';
					 tabla_cabeza += '<tr><td colspan="5" align="center" height="25"><b>FECHA: DESDE</b> '+inicioPeriodo+'&nbsp;&nbsp;<b>HASTA</b> '+finPeriodo+' </td></tr><tr><td align="center" width="245" height="40" style="border-bottom:none;"><b>C&Oacute;DIGO</b></td>';
					 tabla_cabeza += '<td align="center" height="40" style="border-bottom:none;"><b>ESPECIALIDAD</b></td><td align="center" width="150" height="40" style="border-bottom:none;"><b>TRANSFERIDO</b></td><td align="center" width="150" height="40" style="border-bottom:none;"><b>RECIBIDO</b></td>';
					 tabla_cabeza += '<td align="center" width="150" height="40" style="border-bottom:none;"><b>PENDIENTE DE <br/>TRANSFERIR</b></td></tr></table></center>';
					}
                    if(reporte == 'distribucionfinanciamiento')	
                    {
					 tabla_cabeza = '<center><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr><td colspan="4" align="center" height="40"><b>DISTRIBUCION DE FINANCIAMIENTO POR UNIDADES</b></td></tr>';
					 tabla_cabeza += '<tr><td colspan="4" height="25" style="padding-left:3px;"><b>UM: </b>'+um+'&nbsp;&nbsp;&nbsp;&nbsp;<b>Nombre:</b> '+umdenominacion+' </td></tr><tr>';
					 tabla_cabeza += '<td colspan="4" height="25" style="padding-left:3px;"><b>Per&iacute;odo: </b> '+inicioPeriodo+' - '+finPeriodo+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Fecha:</b> '+fechaActualCompleta+' </td></tr>';
					 tabla_cabeza += '<tr><td colspan="4" height="25" style="padding-left:3px;"><b>Concepto: </b> '+clasificacionGasto+'</td></tr>';
					 tabla_cabeza += '<tr><td align="center" height="40" style="border-bottom:none;"><b>UM</b></td><td align="center" width="200" height="40" style="border-bottom:none;"><b>PRESUPUESTO<br>DISTRIBUIDO</b></td>';
					 tabla_cabeza += '<td align="center" width="200" height="40" style="border-bottom:none;"><b>FINANCIAMIENTO<br>DISTRIBUIDO</b></td><td align="center" width="200" height="40" style="border-bottom:none;"><b>FINANCIAMIENTO<br>PENDIENTE</b></td></tr></table></center>';
					}	
					if(reporte == 'gastospresupuesto')	
                    {
					 tabla_cabeza = '<center><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td colspan="7" align="center" height="40"><b>GASTOS DEL PRESUPUESTO POR GRUPOS PRESUPUESTARIOS Y ESPECIALIDADES</b></td></tr>';
					 tabla_cabeza += '<tr><td colspan="7" height="25" style="padding-left:3px;"><b>UM: </b> '+um+'&nbsp;&nbsp;&nbsp;&nbsp;<b>Nombre:</b> '+umdenominacion+' </td></tr>';
					 tabla_cabeza += '<tr><td colspan="7" height="25" style="padding-left:3px;"><b>Per&iacute;odo: </b> '+inicioPeriodo+' - '+finPeriodo+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Fecha:</b> '+fechaActualCompleta+' </td></tr>';
					 tabla_cabeza += '<tr><td align="center" height="40" style="border-bottom:none;"><b>GRUPO<br>PRESUPUESTARIO</b></td><td align="center" width="120" height="40" style="border-bottom:none;"><b>ESPECIALIDAD</b></td>';
					 tabla_cabeza += '<td align="center" width="90" height="40" style="border-bottom:none;"><b>TIPO<br>GASTO</b></td><td align="center" width="90" height="40" style="border-bottom:none;"><b>PARTIDA</b></td>';
					 tabla_cabeza += '<td align="center" width="160" height="40" style="border-bottom:none;"><b>ASIGNADO</b></td><td align="center" width="160" height="40" style="border-bottom:none;"><b>GASTADO</b></td>';
					 tabla_cabeza += '<td align="center" width="160" height="40" style="border-bottom:none;"><b>SALDO</b></td></tr></table></center>';
					}
					if(reporte == 'situacionfondos')	
                    {
					 tabla_cabeza = '<center><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr><td colspan="6" align="center" height="40"><b>DISTRIBUCION DE FINANCIAMIENTO POR UNIDADES</b></td></tr>';
					 tabla_cabeza += '<tr><td colspan="6" height="25" style="padding-left:3px;"><b>UM: </b>'+um+'&nbsp;&nbsp;&nbsp;&nbsp;<b>Nombre:</b> '+umdenominacion+' </td></tr><tr>';
					 tabla_cabeza += '<td colspan="6" height="25" style="padding-left:3px;"><b>Per&iacute;odo: </b> '+inicioPeriodo+' - '+finPeriodo+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Fecha:</b> '+fechaActualCompleta+' </td></tr>';
					 tabla_cabeza += '<tr><td colspan="6" height="25" style="padding-left:3px;"><b>Concepto: </b> '+clasificacionGasto+'</td></tr>';
					 tabla_cabeza += '<tr><td align="center" height="40" style="border-bottom:none;"><b>FECHA</b></td><td align="center" width="60" height="40" style="border-bottom:none;"><b>CO</b></td>';
					 tabla_cabeza += '<td align="center" width="190" height="40" style="border-bottom:none;"><b>PRESUPUESTO</b></td><td align="center" width="190" height="40" style="border-bottom:none;"><b>FINANCIAMIENTO<br>A&Ntilde;O ACTUAL</b></td>';
					 tabla_cabeza += '<td align="center" width="190" height="40" style="border-bottom:none;"><b>FINANCIAMIENTO<br>A&Ntilde;O ANTERIOR</b></td><td align="center" width="190" height="40" style="border-bottom:none;"><b>SALDO</b></td></tr></table></center>';
					}
                    if(reporte == 'estadoBseccionI')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
                     tabla_cabeza += '<tr><td height="50" width="140" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>MINFAR</b></td>';
                     tabla_cabeza += '<td align="center" colspan="4"><b>ESTADO DE EJECUCI&Oacute;N DEL PRESUPUESTO APROBADO <br> SICF-ESTADO B SECCI&Oacute;N I</b></td></tr><tr>';
                     tabla_cabeza += '<td rowspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+' </td>';
                     tabla_cabeza += '<td align="center" colspan="3" height="25"><b>PER&Iacute;ODO TERMINADO EN</b></td><td rowspan="3" align="center" style="border-bottom:none;"><b>UNIDAD DE MEDIDA <br>(PESOS Y CENTAVOS)</b></td>';
                     tabla_cabeza += '</tr><tr><td width="80" align="center"><b>D</b></td><td width="80" align="center"><b>M</b></td><td width="80" align="center"><b>A</b></td></tr>';
                     tabla_cabeza += '<tr><td align="center" style="border-bottom:none;">'+finPeriodoDia+'</td><td align="center" style="border-bottom:none;">'+finPeriodoMes+'</td><td align="center" style="border-bottom:none;">'+finPeriodoAnno+'</td></tr>';
                     tabla_cabeza += '</table><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
                     tabla_cabeza += '<td  width="100" align="center" style="border-bottom:none;"><b>C&Oacute;DIGO</b></td><td align="center" style="border-bottom:none;"><b>DENOMINACI&Oacute;N</b></td>';
                     tabla_cabeza += '<td width="120"  align="center" style="border-bottom:none;"><b>PRESUPUESTO <br> APROBADO</b></td><td width="120"  align="center" style="border-bottom:none;"><b>RECURSOS <br> FINANCIEROS <br> (INGRESOS) <br> TRANSFERIDOS</b></td>';
                     tabla_cabeza += '<td  width="50"  align="center" style="border-bottom:none;"><b>%</b></td><td width="120"  align="center" style="border-bottom:none;"><b>SALDO</b></td></tr></table></center>';
					}	
                    if(reporte == 'estadoBseccionII')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
                     tabla_cabeza += '<tr><td height="50" width="140" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>MINFAR</b></td>';
                     tabla_cabeza += '<td align="center" colspan="4"><b>ESTADO DE EJECUCI&Oacute;N DEL PRESUPUESTO APROBADO <br> SICF-ESTADO B SECCI&Oacute;N II Y III</b></td></tr><tr>';
                     tabla_cabeza += '<td rowspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+' </td>';
                     tabla_cabeza += '<td align="center" colspan="3" height="25"><b>PER&Iacute;ODO TERMINADO EN</b></td><td rowspan="3" align="center" style="border-bottom:none;"><b>UNIDAD DE MEDIDA <br>(PESOS Y CENTAVOS)</b></td>';
                     tabla_cabeza += '</tr><tr><td width="80" align="center"><b>D</b></td><td width="80" align="center"><b>M</b></td><td width="80" align="center"><b>A</b></td></tr>';
                     tabla_cabeza += '<tr><td align="center" style="border-bottom:none;">'+finPeriodoDia+'</td><td align="center" style="border-bottom:none;">'+finPeriodoMes+'</td><td align="center" style="border-bottom:none;">'+finPeriodoAnno+'</td></tr>';
                     tabla_cabeza += '</table><table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
                     tabla_cabeza += '<td  width="100" align="center" style="border-bottom:none;"><b>C&Oacute;DIGO</b></td><td align="center" style="border-bottom:none;"><b>DENOMINACI&Oacute;N</b></td>';
                     tabla_cabeza += '<td width="120"  align="center" style="border-bottom:none;"><b>PRESUPUESTO <br> APROBADO</b></td><td width="120"  align="center" style="border-bottom:none;"><b>RECURSOS <br> FINANCIEROS <br> (INGRESOS) <br> TRANSFERIDOS</b></td>';
                     tabla_cabeza += '<td  width="50"  align="center" style="border-bottom:none;"><b>%</b></td><td width="120"  align="center" style="border-bottom:none;"><b>SALDO</b></td></tr></table></center>';
					}
                    if(reporte == 'anexo3')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
                     tabla_cabeza += '<tr><td height="50" width="140" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>MINFAR</b></td><td align="center" colspan="4"><b>SOLICITUD DE FINANCIAMIENTO <br> SICF - ANEXO No.3</b></td></tr>';
					 tabla_cabeza += '<tr><td rowspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+' </td><td align="center" colspan="3" height="25"><b>PER&Iacute;ODO TERMINADO EN</b></td>';
					 tabla_cabeza += '<td rowspan="3" align="center" style="border-bottom:none;"><b>UNIDAD DE MEDIDA <br>(PESOS Y CENTAVOS)</b></td></tr><tr><td width="80" align="center"><b>D</b></td>';
					 tabla_cabeza += '<td width="80" align="center"><b>M</b></td><td width="80" align="center"><b>A</b></td></tr><tr><td align="center" style="border-bottom:none;">'+finPeriodoDia+'</td>';
					 tabla_cabeza += '<td align="center" style="border-bottom:none;">'+finPeriodoMes+'</td><td align="center" style="border-bottom:none;">'+finPeriodoAnno+'</td></tr></table>';
					 tabla_cabeza += '<table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr><td width="60" align="center" style="border-bottom:none;"><b>UNIDAD</b></td>';
					 tabla_cabeza += '<td width="140" align="center" style="border-bottom:none;"><b>DESTINOS</b></td><td width="120" align="center" style="border-bottom:none;"><b>PRESUPUESTO<br>AJUSTADO</b></td>';
					 tabla_cabeza += '<td width="120" align="center" style="border-bottom:none;"><b>GASTOS<br>DEVENGADOS<br>RESGISTRADOS</b></td><td width="120" align="center" style="border-bottom:none;"><b>PAGOS<br>ANTICIPADOS</b></td>';
					 tabla_cabeza += '<td width="120" align="center" style="border-bottom:none;"><b>PAGOS<br>ESTIMADOS</b></td><td width="120" align="center" style="border-bottom:none;"><b>SITUADO<br>HASTA LA<br>FECHA</b></td>';
					 tabla_cabeza += '<td align="center" style="border-bottom:none;"><b>SOLICITUD DE<br>FINANCIAMIENTO</b></td></tr></table></center>';
					}	
				    if(reporte == 'anexo2')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
                     tabla_cabeza += '<tr><td height="50" width="140" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>MINFAR</b></td><td align="center" colspan="4"><b>SOLICITUD DE FINANCIAMIENTO <br> SICF - ANEXO No.3</b></td></tr>';
					 tabla_cabeza += '<tr><td rowspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+' </td><td align="center" colspan="3" height="25"><b>PER&Iacute;ODO TERMINADO EN</b></td>';
					 tabla_cabeza += '<td rowspan="3" align="center" style="border-bottom:none;"><b>UNIDAD DE MEDIDA <br>(PESOS Y CENTAVOS)</b></td></tr><tr><td width="80" align="center"><b>D</b></td>';
					 tabla_cabeza += '<td width="80" align="center"><b>M</b></td><td width="80" align="center"><b>A</b></td></tr><tr><td align="center" style="border-bottom:none;">'+finPeriodoDia+'</td>';
					 tabla_cabeza += '<td align="center" style="border-bottom:none;">'+finPeriodoMes+'</td><td align="center" style="border-bottom:none;">'+finPeriodoAnno+'</td></tr></table>';
					 tabla_cabeza += '<table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td width="40" align="center" rowspan="2" style="border-bottom:none;"><b>No.</b></td><td align="center" rowspan="2" style="border-bottom:none;"><b>DENOMINACI&Oacute;N</b></td>';
					 tabla_cabeza += '<td height="45" align="center" colspan="2"><b>SALARIOS</b></td><td align="center" colspan="2"><b>OTROS GASTOS</b></td><td align="center" colspan="2"><b>GASTOS DE CAPITAL</b></td></tr>';
					 tabla_cabeza += '<tr><td height="30" align="center" width="80" style=" padding-top:2px;border-bottom:none;"><b>A&Ntilde;O<br>ANTERIOR</b></td><td height="30" align="center" width="80" style=" padding-top:2px; border-bottom:none;"><b>A&Ntilde;0<br> ACTUAL</b></td>';
					 tabla_cabeza += '<td height="30" align="center" width="80" style=" padding-top:2px;border-bottom:none;"><b>A&Ntilde;O<br>ANTERIOR</b></td><td height="30" align="center" width="80" style=" padding-top:2px; border-bottom:none;"><b>A&Ntilde;0<br> ACTUAL</b></td>';
					 tabla_cabeza += '<td height="30" align="center" width="80" style=" padding-top:2px;border-bottom:none;"><b>A&Ntilde;O<br>ANTERIOR</b></td><td height="30" align="center" width="80" style=" padding-top:2px; border-bottom:none;"><b>A&Ntilde;0<br> ACTUAL</b></td></tr></table></center>';
					}	
                    if(reporte == 'submayorIngresoCta655')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td width="120" height="25" style="vertical-align:top; padding: 3px 0px 0px 5px; border-bottom:none;"><b>MINFAR</b></td>';
                     tabla_cabeza += '<td align="center" rowspan="2" height="45" style="border-bottom:none;"><b>SUBMAYOR DE RECURSOS FINANCIEROS (INGRESOS) <br/> TRANSFERIDOS  CUENTA 655<br/> SCF-53 </b></td>';
                     tabla_cabeza += '<td width="110" rowspan="2" style="vertical-align:top; border-bottom:none; padding: 3px 0px 0px 5px;"><b>No.</b></td></tr>';
                     tabla_cabeza += '<tr><td height="40" style="vertical-align:top; padding: 0px 0px 0px 5px; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+'</td></tr></table>';
                     tabla_cabeza += '<table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
                     tabla_cabeza += '<td height="25" colspan="3" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>C&Oacute;DIGO DE LA ESPECIALIDAD</b></td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>DENOMINACI&Oacute;N</b></td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>PRESUPUESTO APROBADO</b></td></tr>';
					 tabla_cabeza += '<tr><td height="25" colspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none;">'+arrayEspecCod[j]+'&nbsp;</td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none;">'+arrayEspecDesc[j]+'&nbsp;</td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none;">'+arrayEspecPA[j]+'&nbsp;</td></tr><tr>';
					 tabla_cabeza += '<td width="80" height="30" align="center" style="border-bottom:none;"><b>FECHA</b></td><td width="60" height="30" align="center" style="border-bottom:none;"><b>CO</b></td>';
					 tabla_cabeza += '<td height="30" align="center" style="border-bottom:none;"><b>DETALLE</b></td><td width="110" height="30" align="center" style="border-bottom:none;"><b>DEBE</b></td>';
					 tabla_cabeza += '<td width="110" height="30" align="center" style="border-bottom:none;"><b>HABER</b></td><td width="110" height="30" align="center" style="border-bottom:none;"><b>SALDO</b></td>';
					 tabla_cabeza += '<td width="110" height="30" align="center" style="border-bottom:none;"><b>C&Oacute;DIGOS</b></td></tr></table> </center>';
					}		 
                    if(reporte == 'submayorIngresoCta955')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td width="120" height="25" style="vertical-align:top; padding: 3px 0px 0px 5px; border-bottom:none;"><b>MINFAR</b></td>';
                     tabla_cabeza += '<td align="center" rowspan="2" height="45" style="border-bottom:none;"><b>SUBMAYOR DE RECURSOS FINANCIEROS (INGRESOS) <br/> COBRADOS Y TRANSFERIDOS  CUENTA 955<br/> SCF-53 </b></td>';
                     tabla_cabeza += '<td width="110" rowspan="2" style="vertical-align:top; border-bottom:none; padding: 3px 0px 0px 5px;"><b>No.</b></td></tr>';
                     tabla_cabeza += '<tr><td height="40" style="vertical-align:top; padding: 0px 0px 0px 5px; border-top:none; border-bottom:none;"><b>UM:</b> '+entidad+'</td></tr></table>';
                     tabla_cabeza += '<table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
                     tabla_cabeza += '<td height="25" colspan="3" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>C&Oacute;DIGO DE LA ESPECIALIDAD</b></td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>DENOMINACI&Oacute;N</b></td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 3px 0px 0px 5px; vertical-align:top; border-bottom:none;"><b>PRESUPUESTO APROBADO</b></td></tr>';
					 tabla_cabeza += '<tr><td height="25" colspan="3" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none;">'+arrayEspecCod[j]+'&nbsp;</td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none;">'+arrayEspecDesc[j]+'&nbsp;</td>';
					 tabla_cabeza += '<td height="25" colspan="2" style="padding: 0px 0px 0px 5px; vertical-align:top; border-top:none;">'+arrayEspecPA[j]+'&nbsp;</td></tr><tr>';
					 tabla_cabeza += '<td width="80" height="30" align="center" style="border-bottom:none;"><b>FECHA</b></td><td width="60" height="30" align="center" style="border-bottom:none;"><b>CO</b></td>';
					 tabla_cabeza += '<td height="30" align="center" style="border-bottom:none;"><b>DETALLE</b></td><td width="110" height="30" align="center" style="border-bottom:none;"><b>DEBE</b></td>';
					 tabla_cabeza += '<td width="110" height="30" align="center" style="border-bottom:none;"><b>HABER</b></td><td width="110" height="30" align="center" style="border-bottom:none;"><b>SALDO</b></td>';
					 tabla_cabeza += '<td width="110" height="30" align="center" style="border-bottom:none;"><b>C&Oacute;DIGOS</b></td></tr></table> </center>';
					}
                    if(reporte == 'submayorIngresoCta440')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td width="120" height="25" style="vertical-align:top; padding: 3px 0px 0px 5px; border-bottom:none;"><b>MINFAR</b></td>';
					 tabla_cabeza += '<td align="center" rowspan="2" height="45" style="border-bottom:none;"><b>SUBMAYOR DE RECURSOS FINANCIEROS (INGRESOS) <br/> RECIBIDOS Y TRANSFERIDOS  CUENTA 440 <br/> SCF-53 </b></td>';
					 tabla_cabeza += '<td width="110" rowspan="2" style="vertical-align:top; border-bottom:none; padding: 3px 0px 0px 5px;"><b>No.</b></td></tr>';
					 tabla_cabeza += '<tr><td height="40" style="vertical-align:top; padding: 0px 0px 0px 5px; border-top:none; border-bottom:none;"><b>UM:</b> Unidad Militar</td></tr></table>';
					 tabla_cabeza += '<table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td height="25" style="padding-left:5px; border-right:none;" width="300"><b>ESPECIALIDAD:</b> '+arrayEspecDesc[j]+' </td><td height="25" style="padding-left:5px; border-left:none;" width="300"><b>C&Oacute;DIGO:</b> '+arrayEspecCod[j]+'</td>';
					 tabla_cabeza += '<td rowspan="2" style="padding: 3px 0px 0px 5px; border-bottom:none; vertical-align:top;"><b>PRESUPUESTO APROBADO</b> <br/> <br/> '+arrayEspecPA[j]+' &nbsp;AA </td></tr><tr>';
					 tabla_cabeza += '<td height="25" style="padding-left:5px; border-right:none; border-bottom:none;" width="300"><b>C&Oacute;DIGO DE INGRESO:</b> '+arrayIngCod[j]+'</td>';
					 tabla_cabeza += '<td height="25" style="padding-left:5px; border-left:none; border-bottom:none;" width="300"><b>DENOMINACI&Oacute;N:</b> '+arrayIngDesc[j]+'</td></tr></table>';
					 tabla_cabeza += '<table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
					 tabla_cabeza += '<td rowspan="2" align="center" width="110" style="border-bottom:none;"><b>FECHA</b></td><td rowspan="2" align="center" width="60" style="border-bottom:none;"><b>CO <br/> R.G</b> </td>';
					 tabla_cabeza += '<td rowspan="2" align="center" width="300" style="border-bottom:none;"><b>DETALLE</b></td><td colspan="3" align="center"><b>INGRESOS COBRADOS Y TRANSFERIDOS</b> </td>';
					 tabla_cabeza += '<td colspan="2" rowspan="2" align="center" width="110" style="border-bottom:none;"><b>UNIDADES</b></td></tr><tr><td align="center" width="110" style="border-bottom:none;"><b>DEBE <br /> (TRANSFERIDOS) </b> </td>';
					 tabla_cabeza += '<td align="center" width="110" style="border-bottom:none;"> <b> HABER <br/> (RECIBIDOS) </b> </td><td align="center" width="110" style="border-bottom:none;"><b>SALDO</b></td></tr></table></center>';
					}
					if(reporte == 'submayorIngreso')
                    {
					 tabla_cabeza = '<center><table style="font-family:Times New Roman, Times, serif; font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					 tabla_cabeza += '<tr><td width="120" height="25" style="vertical-align:top; padding: 3px 0px 0px 5px; border-bottom:none;"><b>MINFAR</b></td>';
					 tabla_cabeza += '<td align="center" rowspan="2" height="45"><b>SUBMAYOR DE RECURSOS FINANCIEROS (INGRESOS) <br /> COBRADOS Y TRANSFERIDOS<br />SCF-53</b></td>';
					 tabla_cabeza += '<td width="110" rowspan="2" style="vertical-align:top; padding: 3px 0px 0px 5px;"><b>No.</b></td></tr><tr>';
					 tabla_cabeza += '<td height="40" style="vertical-align:top; padding: 0px 0px 0px 5px; border-top:none;"><b>UM:</b> '+entidad+'</td></tr><tr>';
					 tabla_cabeza += '<td colspan="3" height="25" style="padding-left:5px;"><b>C&Oacute;DIGO Y DENOMINACI&Oacute;N DE LA ESPECIALIDAD:</b> '+arrayEspecialidad[j]+'</td></tr><tr>';
					 tabla_cabeza += '<td colspan="3" height="25" style="padding-left:5px; border-bottom:none;"><b>PER&Iacute;ODO TERMINADO EN:</b> '+finPeriodo+'</td></tr></table>';
					 tabla_cabeza += '<table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr><td height="35" align="center" colspan="2"><b>A&Ntilde;O</b> <br/> '+anno+'</td>';
					 tabla_cabeza += '<td width="53" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>CO</b></td>';
					 tabla_cabeza += '<td align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>DETALLE</b></td>';
					 tabla_cabeza += '<td width="110" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:3px;"><b>PRESUPUESTO <br/> APROBADO</b> </td>';
					 tabla_cabeza += '<td width="110" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>TRANSFERIDO</b> </td>';
					 tabla_cabeza += '<td width="110" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>COBRADO</b></td>';
					 tabla_cabeza += '<td width="110" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>SALDO</b></td>';
					 tabla_cabeza += '<td width="115" align="center" rowspan="2" style="border-bottom:none; vertical-align:bottom; padding-bottom:13px;"><b>C&Oacute;DIGO</b></td></tr>';
					 tabla_cabeza += '<tr><td align="center" width="34" style="border-bottom:none;"><b>D</b></td><td align="center" width="34" style="border-bottom:none;"><b>M</b></td></tr></table></center>';
					}
					var numcols = (this.grid.getColumnModel().getColumnCount());	
					tdvalues +='<BR><BR><BR>',
                    tdvalues +='<div>'+this.localeData.subTitle+'</div>',//TABLA CABEZA VACIA				
					tdvalues +='<div>'+tabla_cabeza+'</div>',//TABLA CABEZA DE LOS REPORTES							
					//esto fijo 98%  yasser
					tdvalues += '<table border="1" cellpadding="0" cellspacing="0" width="95%" align="center" style="border-top:none;"><tr>'; 
					for(var i=0; i < numcols; i++){
						var test = this.grid.getColumnModel().config[i].id; 
						if (test=='numberer' || test=='checker'){ 
						}  else {
							if ( this.grid.getColumnModel().isHidden(i) ) { 
							
							} else { 
								if ( this.excludefields.indexOf('' + i + ',')>=0 ){ 
								
								} else { 
									tdvalues+= '<td style="border-top:none; border-bottom:1px solid #000;" valign="middle" align="center" width="' +  this.grid.getColumnModel().config[i].anchor +'" ><div class="header" style="font-size:12px;"><b>' + this.grid.getColumnModel().getColumnHeader(i) + '</b></div></td>'; 
								} 
							} 
						} 
					}
					tdvalues+='</tr>';					
					
					for (var i=desde; i< hasta; i++){
						tdvalues+='<tr>';
						var testcountfields=this.grid.store.getAt(0).fields.length;  // just the initial record for field count 
						b= false;
						for (var jval=0; jval<testcountfields; jval++){
							if ( jval>(this.grid.getColumnModel().config.length-1) ){		
							
							} else { 	
									var test = this.grid.getColumnModel().config[0].id; 
									var test2= 0; 
									if (test=='numberer' || test=='checker'){ 
										var numcolref = jval + 1; 
										test2 = this.grid.getColumnModel().config.length-1;										
									} else {  //no aditional columns
										var numcolref = jval; 
										test2 = this.grid.getColumnModel().config.length;																														
									} 
									if (this.hasrowAction){ 
										if (numcolref==testcountfields){ 
											if (this.hasrowAction){ 
											} else { 
												break; 
											} 
										} 
									} else { 
										var test=11; 
									} 
									var tmpchkhidden = false;
									if ( numcolref>(test2) ){		
										tmpchkhidden =true;
									} else {
										tmpchkhidden = this.grid.getColumnModel().isHidden(numcolref); 										
									} 
									if ( tmpchkhidden ) { 
										var test=11; 
									} else {
										if ( this.excludefields.indexOf('' + numcolref + ',')>=0 ){ 
											// do nothing its excluded 
										} else { 
											var testrender = this.grid.getColumnModel().getRenderer(numcolref); 
											tdvalues+='<td valign="middle" style="padding:0 3px 0 3px; font-size:12px; border-top:none; border-bottom:none;" class="values" align="' +  this.grid.getColumnModel().config[numcolref].align + '">'; 
											if (this.usenameindex==false){ 
												valor = testrender.call(this,this.grid.store.getAt(i).data[this.grid.store.getAt(i).fields.items[jval].name])
												if(valor == 'Suma de Control' || valor == 'Suma Acumulada' || valor == 'TOTAL' || valor == 'TOTAL GASTOS' || valor == 'TOTAL GASTOS CORRIENTES' || valor == 'TOTAL GASTOS CAPITAL') 
											    b = true; 
												tdvalues+=(b)?'<b>'+valor||'&nbsp;'+'</b>':valor||'&nbsp;'; 
											} else { 
												tdvalues+= testrender.call(this,this.grid.store.getAt(i).data[this.grid.getColumnModel().config[numcolref].dataIndex]||'&nbsp;')
											} 
											tdvalues+='</td>'; 
										} 
									} 
							} 
						} 
						tdvalues+='</tr>';	
					} 
					var tabla_pie = '';
					if(reporte == 'submayorGasto') // pie de pagina del submayor de gastos para todas las hojas
					{
					 if(arrayBoolPartidas[m] == true)
					 {
					   tabla_pie = '<center><table border="0" cellpadding="0" cellspacing="0" width="95%"><tr><td height="25"></td></tr></table>';
					   tabla_pie += '<table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					   tabla_pie += '<tr><td height="30" align="center" colspan="2" style="padding-left:5px;"><b>SUBMAYOR DE GASTOS DEL PRESUPUESTO (SCF-52) - RESUMEN POR PARTIDA</b></td></tr>';
					   tabla_pie += '<tr><td height="20" style="border-right:none; padding-left:5px;"><b>GRUPO PRESUPUESTARIO</b>: '+arrayCentroCosto[j]+'</td>';
					   tabla_pie += '<td style="border-left:none;"><b>CLASIFICACI&Oacute;N DEL GASTO</b>: '+clasificacionGasto+'</td></tr>';
					   tabla_pie += '<tr><td height="20" colspan="2" style="border-bottom:none; padding-left:5px;"><b>ESPECIALIDAD</b>: '+arrayEspecialidad[j]+'</td></tr></table>';
					   tabla_pie += '<table style="font-size:12px;" border="1" cellpadding="0" cellspacing="0" width="95%">';
					   tabla_pie += '<tr><td height="20" align="center" width="110" style="border-bottom:none;"><b>PARTIDA</b></td><td align="center" style="border-bottom:none;"><b>OBJETO DEL GASTO</b></td>';
					   tabla_pie += '<td align="center" width="200" style="border-bottom:none;"><b>IMPORTE</b></td><td align="center" width="40" style="border-bottom:none;"><b>H</b></td></tr></table></center>';
					   tabla_pie += '<center><table border="1" cellpadding="0" cellspacing="0" width="95%" style="font-family:Times New Roman, Times, serif; font-size:12px;">';
                       if(resumenPartidas[j]) 
					   {
                        for(var k = 0; k < resumenPartidas[j].length; k++)
					    {
					     if(k == resumenPartidas[j].length - 1)
						 {
						  tabla_pie += '<tr><td height="20" align="center" width="110" style="border-top:none;">&nbsp;</td><td style="padding:0 3px 0 3px; border-top:none;"><b>'+resumenPartidas[j][k]['objetogasto']+'&nbsp;</b></td>';
					      tabla_pie += '<td align="right" width="197" style="border-top:none; padding:0 3px 0 0;"><b>'+resumenPartidas[j][k]['saldogasto']+'</b></td><td align="center" width="40" style="border-top:none;">'+resumenPartidas[j][k]['canthomb']+'&nbsp;</td></tr>';
						 }
						 else
						 {
					      tabla_pie += '<tr><td height="20" align="center" width="110" style="border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['partida']+'</td><td style="padding:0 3px 0 3px; border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['objetogasto']+'&nbsp;</td>';
					      tabla_pie += '<td align="right" width="197" style="border-top:none; border-bottom:none; padding:0 3px 0 0">'+resumenPartidas[j][k]['saldogasto']+'</td><td align="center" width="40" style="border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['canthomb']+'&nbsp;</td></tr>';
					     }
					    }
					    tabla_pie += '</table></center>';
					    if(b)j++;
					   }
					  }
					  m++;
					}
					
					if(reporte == 'submayorIngresoCta655' || reporte == 'submayorIngresoCta955' || reporte == 'submayorIngresoCta440') //  cambio de especialidades para los submayores de ingresos
					{
					 j++;
					}

					if(reporte == 'submayorIngreso' )
					{
					 tabla_pie ='<center><table border="0" cellpadding="0" cellspacing="0" width="95%"><tr><td height="25"></td></tr></table>';
                     tabla_pie +='<table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
					 tabla_pie +='<td height="30" align="center" colspan="2" style="padding-left:5px;"><b>SUBMAYOR DE RECURSOS FINANCIEROS (INGRESOS) COBRADOS Y TRANSFERIDOS-RESUMEN C&Oacute;DIGOS</b></td></tr>';
					 tabla_pie +='<td colspan="3" height="25" style="padding-left:5px;"><b>C&Oacute;DIGO Y DENOMINACI&Oacute;N DE LA ESPECIALIDAD:</b> '+arrayEspecialidad[j]+'</td></tr>';
					 tabla_pie +='<tr><td colspan="3" height="25" style="padding-left:5px; border-bottom:none;"><b>PER&Iacute;ODO TERMINADO EN:</b> '+finPeriodo+'</td></tr></table>';
					 tabla_pie +='<table style="font-size:12px; border-bottom:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
					 tabla_pie +='<td height="20" align="center" width="120" style="border-bottom:none;"><b>C&Oacute;DIGO</b></td><td align="center" style="border-bottom:none;"><b>CONCEPTO</b></td>';
					 tabla_pie +='<td align="center" width="110" style="border-bottom:none;"><b>PRESUPUESTO <br> APROBADO</b></td><td align="center" width="110" style="border-bottom:none;"><b>TRANSFERIDO</b></td>';
					 tabla_pie +='<td align="center" width="110" style="border-bottom:none;"><b>COBRADO</b></td><td align="center" width="110" style="border-bottom:none;"><b>SALDO</b></td></tr></table></center>';
					 tabla_pie += '<center><table border="1" cellpadding="0" cellspacing="0" width="95%" style="font-family:Times New Roman, Times, serif; font-size:12px;">';
					 if(resumenPartidas[j])
					   {
					    tabla_pie +='<td height="20" align="center" width="120" style="border-bottom:none;">'+resumenPartidas[j][0]['coding']+'&nbsp;</td><td align="left" style="padding-left:3px; border-bottom:none;">'+resumenPartidas[j][0]['ingreso']+'</td>';
					      tabla_pie +='<td align="center" width="110" style="border-bottom:none;">'+resumenPartidas[j][0]['presupaprob']+'&nbsp;</td><td align="center" width="110" style="border-bottom:none;">'+resumenPartidas[j][0]['transferido']+'&nbsp;</td>';
					      tabla_pie +='<td align="center" width="110" style="border-bottom:none;">'+resumenPartidas[j][0]['cobrado']+'&nbsp;</td><td align="right" width="107" style="padding-right:3px; border-bottom:none;">'+resumenPartidas[j][0]['saldoing']+'&nbsp;</td></tr>';for(var k = 1; k < resumenPartidas[j].length; k++)
					    {
					     if(k == resumenPartidas[j].length - 1)
						 {
						  tabla_pie +='<td height="20" align="center" width="120" style="border-top:none;"><b>'+resumenPartidas[j][k]['coding']+'&nbsp;</b></td><td align="left" style="padding-left:3px; border-top:none;"><b>'+resumenPartidas[j][k]['ingreso']+'</b></td>';
					      tabla_pie +='<td align="center" width="110" style="border-top:none;"><b>'+resumenPartidas[j][k]['presupaprob']+'&nbsp;</b></td><td align="center" width="110" style="border-top:none;"><b>'+resumenPartidas[j][k]['transferido']+'&nbsp;</b></td>';
					      tabla_pie +='<td align="center" width="110" style="border-top:none;"><b>'+resumenPartidas[j][k]['cobrado']+'&nbsp;</b></td><td align="right" width="107" style="padding-right:3px; border-top:none;"><b>'+resumenPartidas[j][k]['saldoing']+'&nbsp;</b></td></tr>';
					     }
						 else
						 {
						  tabla_pie +='<td height="20" align="center" width="120" style="border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['coding']+'&nbsp;</td><td align="left" style="padding-left:3px; border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['ingreso']+'</td>';
					      tabla_pie +='<td align="center" width="110" style="border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['presupaprob']+'&nbsp;</td><td align="center" width="110" style="border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['transferido']+'&nbsp;</td>';
					      tabla_pie +='<td align="center" width="110" style="border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['cobrado']+'&nbsp;</td><td align="right" width="107" style="padding-right:3px; border-top:none; border-bottom:none;">'+resumenPartidas[j][k]['saldoing']+'</td></tr>';
					     }
						}
					    tabla_pie += '</table></center>';
					    /*if(b)*/j++;
					   }
					}
					
					if(reporte == 'resumenGasto' || reporte == 'estadoC' || reporte == 'estadoBseccionI' || reporte == 'estadoBseccionII' || reporte == 'anexo3' || reporte == 'anexo2')
					{
					 tabla_pie ='<center><table style="font-size:12px; border-top:none;" border="1" cellpadding="0" cellspacing="0" width="95%"><tr>';
                     tabla_pie +='<td align="center" height="45" style="padding:3px 0 0 0; border-top:none;" colspan="2"><b>CERTIFICAMOS QUE LOS DATOS CONTENIDOS EN ESTE ESTADO SE CORRESPONDE CON LAS ANOTACIONES CONTABLES</b></td>';
                     tabla_pie +='<td align="center" width="230" style="border-top:none; vertical-align:top; padding: 15px 0 0 0;" rowspan="3"> <b>APROBADO <br/> JEFE UNIDAD <br/> MILITAR</b></td>';
                     tabla_pie +='<td style="border-top:none;" align="center" colspan="3"><b>FECHA</b></td></tr><tr>';
                     tabla_pie +='<td style="padding: 3px 0 0 5px; border-bottom:none; vertical-align:top;"><b>CONFECCIONADO POR </b></td>';
                     tabla_pie +='<td align="center" style="padding: 3px 0 0 0; vertical-align:top;" rowspan="2"><b>JEFE &Oacute;RGANO <br/> ECONOM&Iacute;A / FINANZAS </b></td>';
                     tabla_pie +='<td align="center" width="40"><b>D</b></td><td align="center" width="40"><b>M</b></td><td align="center" width="40"><b>A</b></td>';
                     tabla_pie +='</tr><tr><td style="padding: 0 0 0 5px; border-top:none; vertical-align:top;" height="35" >'+usuario+' </td>';
                     tabla_pie +='<td align="center">'+fechaActualDia+'</td><td align="center">'+fechaActualMes+'</td><td align="center">'+fechaActualAnno+'</td></tr></table></center>';
					}
					tdvalues+='</table>';
					tdvalues+='<div>'+this.localeData.footerText+'</div>';//pie de pag
					tdvalues+='<div>'+tabla_pie+'</div>',//TABLA PIE DE LOS REPORTES
					tdvalues+='<div style="page-break-after: always;"></div>';//pie de pag
				ciclo--;
				if(ciclo == 0)
				{
				  desde = varnumrecs-resto;  
				  hasta = varnumrecs;
				}
				else if(ciclo == -1)incrementa = false;
				else
				{
				 desde = hasta;hasta+= this.tampag;
				}
		 }//while	
		} 
		//tdvalues+='<div width="100%" style="padding:5px; text-align:center;"><form><input type="button" value="Imprimir" onclick="window.print()"/></form></div>'
		var datareportb = {			
			valuebody:tdvalues
		}			
		var bodytplb= new Ext.XTemplate(ftext); 
		var ftextb = bodytplb.applyTemplate(datareportb);		
		return ftextb;		
	}, 
	printGrid:function(OBJ){ //no se puede borrar
		this.pageOBJ = OBJ; 
		var mydatatoprint = this.getDatareport();		
		OBJ.document.title=this.localeData.Title;
		if (this.useCustom.custom){
			var checkcount = this.useCustom.customStore.getCount();  
			if (checkcount< this.useCustom.pageToolbar.pageSize){ 
			
			} else { 
				this.useCustom.pageToolbar.render(OBJ.document.body);
				this.flagrenderedPtool =true; 
			} 
		}
		Ext.get(OBJ.document.body).insertHtml('beforeEnd', '<div id="reportcontent">' +  mydatatoprint + '</div>', false);
		this.flagdatachange=true;
	}
	
});
