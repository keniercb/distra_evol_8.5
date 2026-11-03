/*	* Ext.grid.XPrinter 
 	* Impresion de reportes* 
 	* @author Henry Ernesto Bermúdez Pérez* 
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
	columnCountXpage:'',
	enableColCount:false,
	columnBeginSplit:'',
	hasrowAction:false, 
	usenameindex:false,
	//sumaryField:[{nombre:'',campo:''}],
	//totalSumary:[{nombre:'',campo:''}],
	tampag:30,
	localeData:{
		Title:'Title',
		subTitle:'Subtitle',
		footerText:'', 
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
		this.PrinterWindow = window.open( this.pathPrinter + "/printer.phtml?pdfgen=1&paper=l"  ,"PrinterWindow","width=" + this.wWidth + ",height=" + this.wHeight + ",resizable=1,scrollbars=1");			
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
		
		if (this.useCustom.custom==false){ 
			varnumrecs = this.grid.store.getCount();
			var tdvalues = '';
			var total_cadena = '';
			var incrementa = true;
			var desde = 0;
			var total = {};
		    var hasta = this.tampag;
		    var resto = varnumrecs%this.tampag;
		    var ciclo = parseInt(varnumrecs/this.tampag);
		    var nRoPagina = 0;
		    var scope = this;
		    if(varnumrecs < hasta)hasta = varnumrecs;
		    
		    function MuestraOcultaColGrid(start,limit,accion){
		    	for(var i =start;i< limit;i++){
		    		scope.grid.getColumnModel().setHidden(i,accion);
		    	}
		    }
		    
		    function GenraGridXCol(){
		    	var HTML="";
		    	var start = scope.columnBeginSplit;
		    	var cursor = start;
		    	var cant = scope.columnCountXpage;
		    	var limit = scope.grid.getColumnModel().getColumnCount();
		    	var vuelta = parseInt((limit-start)/cant);
		    	var resto1  = (limit-start)%cant;
		    	MuestraOcultaColGrid(start,limit,true);//si es true oculta 
		    	for(i = 0 ; i<vuelta;i++){
		    		MuestraOcultaColGrid(cursor,(cursor+cant),false);//muestra las columnas
		    		if(resto1==0 && (i+1)==vuelta)scope.enableColCount=true;
		    		HTML +=EjecutaGridFilas();
		    		cursor = cursor+cant;
		    		MuestraOcultaColGrid(start,cursor,true);//oculta las columnas anteriores
		    	}
		    	
		    	if(resto1!=0){
		    		MuestraOcultaColGrid(cursor,limit,false);
		    		scope.enableColCount=true;
		    		HTML +=EjecutaGridFilas();
		    		cursor = limit;
		    		
		    	}
		    	MuestraOcultaColGrid(start,limit,false);
		    	return HTML;
		    }
		    
		    function PicarGridPorFila(){
					nRoPagina ++; 
					var cadena = '';
					var subhtml="";
					var subtotal = {};
					var numcols = (scope.grid.getColumnModel().getColumnCount());	
					subhtml +='<BR><BR><BR>';
					subhtml+='<div style = "text-align:right;font-size:12px;">No. de página: '+nRoPagina+'</div>';
					subhtml +='<div>'+scope.localeData.subTitle+'</div>',//TABLA CABEZA		
					//subhtml +='<hr noshade="noshade" width="90%" align="center"/>',//rayita
					subhtml += '<table width="100%" align="center" border="1" cellspacing="0" cellpadding="0" style="border:solid 0.1pt; border-collapse:collapse;font-size:12pt; font-family:Arial;"><tr>'; 
					for(var i=0; i < numcols; i++){
						var test = scope.grid.getColumnModel().config[i].id; 
						if (test=='numberer' || test=='checker'){ 
						}  else {
							if ( scope.grid.getColumnModel().isHidden(i) ) { 
							
							} else { 
								if ( scope.excludefields.indexOf('' + i + ',')>=0 ){ 
								
								} else { 
									subhtml+= '<td style="border:thin 0.1pt;" valign="middle" align="' +  scope.grid.getColumnModel().config[i].align + '" ><div class="header" style="font-size:12px;"><b>' + scope.grid.getColumnModel().getColumnHeader(i) + '</b></div></td>'; 
								} 
							} 
						} 
					}
					subhtml+='</tr>';					
					
					for (var i=desde; i< hasta; i++){
						subhtml+='<tr>';
						var testcountfields=scope.grid.store.getAt(0).fields.length;  // just the initial record for field count 
						b= false;
						for (var jval=0; jval<testcountfields; jval++){
							if ( jval>(scope.grid.getColumnModel().config.length-1) ){		
							
							} else { 	
									var test = scope.grid.getColumnModel().config[0].id; 
									var test2= 0; 
									if (test=='numberer' || test=='checker'){ 
										var numcolref = jval + 1; 
										test2 = scope.grid.getColumnModel().config.length-1;										
									} else {  //no aditional columns
										var numcolref = jval; 
										test2 = scope.grid.getColumnModel().config.length;																														
									} 
									if (scope.hasrowAction){ 
										if (numcolref==testcountfields){ 
											if (scope.hasrowAction){ 
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
										tmpchkhidden = scope.grid.getColumnModel().isHidden(numcolref); 										
									} 
									if ( tmpchkhidden ) { 
										var test=11; 
									} else {
										if ( scope.excludefields.indexOf('' + numcolref + ',')>=0 ){ 
											// do nothing its excluded 
										} else { 
											var testrender = scope.grid.getColumnModel().getRenderer(numcolref); 
											if(scope.grid.getColumnModel().getColumnHeader(jval)=='C&oacute;digo')
											  subhtml+='<td style="border:thin 0.1pt; font-size:12pt;" valign="middle" class="values" align="' +  scope.grid.getColumnModel().config[numcolref].align + '">'; 
											else
											  if(scope.grid.getColumnModel().getColumnHeader(jval)=='Indicadores')
											    subhtml+='<td style="border:thin 0.1pt; font-size:12pt;" valign="middle" class="values" align="' +  scope.grid.getColumnModel().config[numcolref].align + '">'; 
                                            else
											   subhtml+='<td style="border:thin 0.1pt; font-size:12pt;" valign="middle" class="values" align="right"' +  scope.grid.getColumnModel().config[numcolref].align + '">'; 
											if (scope.usenameindex==false){
												valor = testrender.call(scope,scope.grid.store.getAt(i).data[scope.grid.store.getAt(i).fields.items[jval].name])
												if(valor == 'Suma de control') b = true;
												subhtml+=(b)?'<b>'+valor||'&nbsp;'+'</b>':valor||'&nbsp;'; 
											} else {
												subhtml+= testrender.call(scope,scope.grid.store.getAt(i).data[scope.grid.getColumnModel().config[numcolref].dataIndex]||'&nbsp;')
											} 
											subhtml+='</td>'; 
										} 
									} 
							} 
						} 
						subhtml+='</tr>';
						//if(nRoPagina>1){
							if(scope.sumaryField && !(varnumrecs < hasta)){
								if(typeof(scope.sumaryField) == 'object'){
									cadena = '<div><table style="border:solid 0.1pt; border-collapse:collapse;font-size:12pt; font-family:Arial;" width="100%" align="center" border="1" cellspacing="0" cellpadding="0">';
									for(h = 0; h < scope.sumaryField.length;h++){
										if(!subtotal[scope.sumaryField[h].campo]){
											subtotal[scope.sumaryField[h].campo] = parseFloat(scope.grid.store.getAt(i).data[scope.sumaryField[h].campo]);
										}
										else {
											subtotal[scope.sumaryField[h].campo] += parseFloat(scope.grid.store.getAt(i).data[scope.sumaryField[h].campo]);
										}
										cadena +='<tr><td style="border:thin 0.1pt; font-size:12pt;" width="950" align="right"  class="values" >'+scope.sumaryField[h].nombre+' :</td><td style="border:thin 0.1pt; font-size:12pt;" width="10%" align="right" class="values">'+(Math.round(subtotal[scope.sumaryField[h].campo]*100)/100).toFixed(2)+'</td></tr>';
									}
									cadena +='</table></div>';
								}
							}
						//}
					} 
					if((ciclo == 1 && resto==0) || ciclo == 0){
							if(scope.totalSumary && scope.enableColCount){
								if(typeof(scope.totalSumary) == 'object'){
									total_cadena = '<div><table style="border:solid 0.1pt; border-collapse:collapse;font-size:12pt; font-family:Arial;" width="100%" align="center" border="1" cellspacing="0" cellpadding="0">';
									for(h = 0; h < scope.totalSumary.length;h++){
											for(var d = 0;d< varnumrecs;d++){
												if(!total[scope.totalSumary[h].campo]){
													total[scope.totalSumary[h].campo] = 0;
												}
												total[scope.totalSumary[h].campo] += parseFloat(scope.grid.store.getAt(d).data[scope.totalSumary[h].campo]);
											}
											total_cadena +='<tr><td style="border:thin 0.1pt; font-size:12pt;" width="950" align="right"  class="values" >'+scope.totalSumary[h].nombre+' :</td><td style="border:thin 0.1pt; font-size:12pt;" width="10%" align="right" class="values">'+(Math.round(total[scope.totalSumary[h].campo]*100)/100).toFixed(2)+'</td></tr>';
										
									}
									total_cadena +='</table></div>';
								}
							}
							
						}
					subhtml+='</table>';
					subhtml+=cadena,//rayita
					
					subhtml += total_cadena;
					subhtml+='<div>'+scope.localeData.footerText+'</div>';//pie de pag
					subhtml+='<div style="page-break-after: always;"></div>';//pie de pag
		 		//desde = hasta;hasta +=scope.tampag;			
				ciclo--;
				if(ciclo == 0){
				  desde = varnumrecs-resto;  
				  hasta = varnumrecs;
				  if(resto==0)incrementa = false;
				}
				else 
				   if(ciclo == -1)
					incrementa = false;
				else{
				 desde = hasta;
				hasta+= scope.tampag;
				}
				return subhtml;
			}
			
			function EjecutaGridFilas(){
				var subhtml="";
				 total_cadena = '';
				 incrementa = true;
				 desde = 0;
				 total = {};
			     hasta = scope.tampag;
			     resto = varnumrecs%scope.tampag;
			     ciclo = parseInt(varnumrecs/scope.tampag);
			     if(varnumrecs < hasta)hasta = varnumrecs;
				while(incrementa){
					subhtml+=PicarGridPorFila();
				}
				return subhtml;
			}
			//while	
			if(this.columnCountXpage)tdvalues=GenraGridXCol();
			else {
				this.enableColCount=true;
				tdvalues=EjecutaGridFilas();
			}
		} 
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
