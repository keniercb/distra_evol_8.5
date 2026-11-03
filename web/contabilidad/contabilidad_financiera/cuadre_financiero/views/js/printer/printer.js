
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
	tampag:30,
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
	showdateFormat:'d/m/Y',
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
		
		if (this.useCustom.custom==false){ 
			varnumrecs = this.grid.store.getCount();
			var tdvalues = '';
			var incrementa = true;
			var desde = 0;
		    var hasta = this.tampag;
		    var resto = varnumrecs%this.tampag;
		    var ciclo = parseInt(varnumrecs/this.tampag);		    
		    if(varnumrecs < hasta)hasta = varnumrecs;		    
			while(incrementa){		
					var numcols = (this.grid.getColumnModel().getColumnCount());	
					tdvalues +='<BR><BR><BR>',					
					tdvalues +='<div>'+this.localeData.subTitle+'</div>',//TABLA CABEZA		
					//esto fijo 98%  yasser
					tdvalues += '<table width="98%" align="center" style="border-collapse: collapse; border: 1PX solid #000; border-right:none; border-left:none; border-bottom:none"><tr>';
					for(var i=0; i < numcols; i++){
						var test = this.grid.getColumnModel().config[i].id; 
						if (test=='numberer' || test=='checker'){ 
						}  else {
							if ( this.grid.getColumnModel().isHidden(i) ) { 
							
							} else { 
								if ( this.excludefields.indexOf('' + i + ',')>=0 ){ 
								
								} else { 
									tdvalues+= '<td style="border: none" valign="middle" align="' +  this.grid.getColumnModel().config[i].align + '" width="' +  this.grid.getColumnModel().config[i].anchor +'%" ><div class="header" style="font-size:12px;"><b>' + this.grid.getColumnModel().getColumnHeader(i) + '</b></div></td>'; 
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
											tdvalues+='<td valign="middle" style="font-size:11px; border: none" class="values" align="' +  this.grid.getColumnModel().config[numcolref].align + '">'; 
											if (this.usenameindex==false){ 
												valor = testrender.call(this,this.grid.store.getAt(i).data[this.grid.store.getAt(i).fields.items[jval].name])
												if(valor == 'Suma de control') b = true;
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
					tdvalues+='</table>';
					tdvalues+='<div>'+this.localeData.footerText+'</div>';//pie de pag
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
