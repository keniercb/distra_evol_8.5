Ext.onReady(onloadMessageBox);
var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('reconstruirsaldos', function(){cargarInterfaz();});

var global_printer = null;  // it has to be on the index page or the generator page  always
function printmygridGO(obj){  global_printer.printGrid(obj);} 
function printmygridGOcustom(obj){ global_printer.printCustom(obj);	}
var rv, rh, fp_tipopag,datosuser;

function cargarInterfaz()
{
   new Ext.Viewport({id:'viewport', 
             items:[new Ext.Panel({id:'panel', 
                             tbar:[new Ext.Button({id:'btnSaldo', text:'Reconstruir saldos', icon : perfil.dirImg + 'recuperaciones.png',iconCls : 'btn', handler: function(){Reconstruirsaldos();}}),
								   btnImprimir = new Ext.Button({hidden : true, id : 'btnimpr',icon : perfil.dirImg + 'imprimir.png', iconCls : 'btn', text : 'Imprimir', handler : function(){fImprimir();}})
								   ,'->',
								   new Ext.Button({ 
	id : 'btnAyu', 
	icon : perfil.dirImg + 'ayuda.png', 
	iconCls : 'btn', 
	tooltip: 'Ayuda', 
	//text:perfil.etiquetas.lbBtnAyuda, 
	text:'Ayuda',
	handler : function(){ 
		var title = 'Mostrar ayuda de la funcionalidad';
		var referencia = 'confin/CG/consistencia/reconstruirsaldo'; 
	 help.show(title,referencia);
	 }
	 }
                                   )]})
                    ]}); 
    Ext.MessageBox.hide();                                                             
}
var area = new Ext.form.TextArea({
	value:'',
	inputType:'text',
	readOnly: true
});
function onloadMask(message){
	message ? (lMask = new Ext.LoadMask(Ext.getBody(),{msg:message}), lMask.show()) 
			: lMask.hide();
}
function onloadMessageBox(){
       Ext.MessageBox.show({title: 'Por favor espere', msg: 'Cargando ...',width:300, progress:true, closable:false
           //, progressText: 'Inicializando...'
           });
       var f = function(v){ return function(){ var i = v/11; Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/); }; };
       for(var i = 1; i < 12; i++)
        setTimeout(f(i), i*500);
}                     

function Reconstruirsaldos(){
Ext.Msg.show({
	title:'Reconstruir saldos',
	msg: 'Este proceso reconstruye los saldos de las cuentas y centros de costos en el ejercicio contable. <br> &iquest;Est&aacute; seguro que desea efectuar la operaci&oacute;n?',
	buttons: Ext.Msg.OKCANCEL,      
	icon: Ext.MessageBox.QUESTION ,
	fn:function(btn, text){
	if (btn == 'ok'){
		area.setValue("");
		lMaskk = new Ext.LoadMask(Ext.getBody(),{msg:'Reconstruyendo saldos. La acci&oacute;n puede tardar varios segundos...'});
		lMaskk.show();
		 fCrearGrid(0,1);				

	}
	else
		mostrarMensaje(1, 'Operaci&oacute;n cancelada por el usuario.');
	} 
});
}

function fCrearGrid()
{
    onloadMask('Espere por favor...');
    stGpDatosComprobante = new Ext.data.Store({url: 'obtenerComprobanteSinAsentar', autoLoad:true,
                            listeners:{'load':function(store, records, options)
                                              {
                                                 if(store.getCount() > 0)
                                                 {
                                                     mensaje = 'Existen comprobantes sin asentar.';
													 mostrarMensaje(1, 'Existen comprobantes sin asentar.');
													 cmGpDatos = new Ext.grid.ColumnModel([{width:30, dataIndex: 'numerocomprobante', align:'left'}, {id:'expandir', dataIndex: 'descripcion', align:'left'}, {width:20, dataIndex: 'estado', align:'left'}]);
                                                     cmGpDatos.headers = [[{header: 'Comprobantes sin asentar', colspan:3}], [{align:'left', sortable: true, header: 'N&uacute;mero'}, {align:'left', id:'expandir', sortable: true, header: 'Descripci&oacute;n'}, {align:'left', sortable: true, header: 'Estado'}]];                        
                                                     fLayoutGrid(stGpDatosComprobante, cmGpDatos);
                                                 }else
                                                 {
                                                    btnImprimir.show();
													cmGpDatos = new Ext.grid.ColumnModel([{width:40, dataIndex: 'codigo', align:'left'}, {id:'expandir', dataIndex: 'descripcion', align:'left'}, {width:30, dataIndex: 'naturaleza', align:'left'}, {width:30, dataIndex: 'saldo', align:'right'}]);
                                                    cmGpDatos.headers = [[{header: 'Cuenta', colspan:4}], [{align:'left', sortable: true, header: 'C&oacute;digo'}, {align:'left', id:'expandir', sortable: true, header: 'Descripci&oacute;n'}, {align:'left', sortable: true, header: 'Naturaleza'}, {align:'right', sortable: true, header: 'Importe'}]];                          
                                                              
                                                 
                                                    stGpDatos = new Ext.data.Store({url: 'operacionReconstruir', autoLoad:true, 
                                                                            listeners:{'load':function(store, records, options){
                                                                                    mensaje = 'Acci&oacute;n realizada satisfactoriamente.';
                                                                                    if(store.getCount() > 0)
                                                                                    fLayoutGrid(stGpDatos, cmGpDatos);
                                                                                    else
                                                                                    {
                                                                                         mensaje = 'No se produjo resultado para esta acci&oacute;n.';
                                                                                         onloadMask();   
                                                                                         if(Ext.getCmp('gpDatos')) 
                                                                                         {
                                                                                            Ext.getCmp('viewport').destroy();
                                                                                            cargarInterfaz();
                                                                                         } 
                                                                                    }
																					btnImprimir.hide();
                                                                                    mostrarMensaje(1, mensaje);
                                                                                }},
                                                                            reader: new Ext.data.JsonReader({root:'root', totalProperty:'totalProperty'}, [{name:'codigo'}, {name:'descripcion'}, {name:'naturaleza'}, {name:'saldo'}])});
                                                }
                                              }
                                       },
                            reader: new Ext.data.JsonReader({root:'root', totalProperty:'totalProperty'}, [{name:'numerocomprobante'}, {name:'descripcion'}, {name:'estado', mapping:'NomEstadocomprobante.descripcion'}])});
}

function fLayoutGrid(stGpDatos, cmGpDatos)
{
  onloadMask();   
  if(!Ext.getCmp('gpDatos'))
  Ext.getCmp('panel').add(gpDatos = new Ext.grid.GridPanel({autoExpandColumn:'expandir', autoScroll:true, viewConfig :{forceFit :true}, renderTo: 'panel', id:'gpDatos', layout:'fit', autoHeigth:true, iconCls:'icon-grid', cm: cmGpDatos, store: stGpDatos, sm: new Ext.grid.RowSelectionModel({singleSelect:false}), plugins: new Ext.ux.plugins.XGrid()/*, bbar:new Ext.PagingToolbar({pageSize: 20, store: stGpDatos, displayInfo: true, displayMsg: 'Datos {0} - {1} of {2}', emptyMsg: 'No existen resultados'})*/}));
  else
  Ext.getCmp('gpDatos').reconfigure(stGpDatos, cmGpDatos);
}

//impresionvc
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth()+1;
var anno = fecha.getFullYear();
var tabla_cabeza,tabla_pie;
var datosuser;
function contex(){
 tabla_cabeza = '<table style="font-size:10px; border:1px solid #000" width="98%"  border="0"  cellpadding="0" align="center" cellspacing="0">' +
				'<tr>'+
					'<td width="150" rowspan="3" valign="top" style="font-size:10px;"><p><br/>\xa0\xa0</p><br/>\xa0\xa0\xa0\xa0\xa0\xa0 ENTIDAD:</br></br>'+ perfil.entidad +'</td>' +
					'<td width="650" rowspan="3" align="center" style="font-size:10px;"><p>RECONSTRUCCI&Oacute;N DE SALDOS</p>' +
						//'<p>NOMBRE DE LA CUENTA</p>' +
						//'<p>' + '</p>' +
					'</td>' +
					//'<td width="98" height="34"align="left" style="font-size:10px;">No:</td>' +
				'</tr>' +
				//'<tr>' +
					//'<td height="27" align="LEFT" style="font-size:10px;">CODIGO</td>' +
				//'</tr>' +
				'<tr>' +
					'<td height="36" align="LEFT" valign="top" style="font-size:10px;">'+'&nbsp;</td>' +
				'</tr></table>';

 tabla_pie = '<table style="font-size:10px; border:1px solid #000" width="98%" align="center" cellpadding="0" cellspacing="0" cols="12">' +
			   	'<tr>'+
			  		'<td colspan="6" width="100%" align="center" valign="top">\xa0\xa0 CERTIFICAMOS QUE LOS  DATOS CONTENIDOS EN ESTE ESTADO SE CORRESPONDEN CON LAS ANOTACIONES CONTABLES</td>' +
			  	'</tr>'+
				'<tr>'+
			  		'<td colspan="3" width="75%" valign="top">&nbsp;</td>' +
					'<td colspan="3" width="25%" align="center">FECHA<br>&nbsp;</td>' +
			  	'</tr>'+
				'<tr>'+
			  		'<td width="30%" align="center" valign="top">CONFECCIONADO POR: <br>&nbsp;</td>' +
					'<td width="30%" align="center" valign="top">JEFE ORGANO ECONOMIA / FINANZAS<br></td>' +
					'<td width="30%" align="center" valign="top">&nbsp;</td>' +
					'<td width="3%"  align="right" valign="top">D</td>' +
					'<td width="3%"  align="right" valign="top">M</td>' +
					'<td width="3%"  align="right" valign="top">A</td>'+
			  	'</tr>'+
				'<tr>' +
					'<td width="30%" align="center" valign="top">' + datosuser +'&nbsp;</td>' +
			  		'<td width="30%" align="center" valign="top">&nbsp;</td>' +
					'<td width="30%" align="center" valign="top">&nbsp;</td>' +
					'<td width="3%"  align="right" valign="top">' + dia +'&nbsp;</td>' +
					'<td width="3%"  align="right" valign="top">' + mes + '&nbsp;</td>' +
					'<td width="3%"  align="right" valign="top">' + anno + '&nbsp;</td>'+
			 	'</tr>' +
			 '</table>';		
}

/*function cargarDatos()
{

	}
	});
}*/

var gpDatos;
function fImprimir()
{
	Ext.Ajax.request({
	url : 'datosusuario',
	//params : {id : window.params.idcmp},
	callback : function(options, success, response) {
		responseData = Ext.decode(response.responseText);
		datosuser = responseData.user;
		contex();
		    global_printer = new Ext.grid.XPrinter({
			grid:gpDatos,  // grid object
			pathPrinter:'printer',  	 // relative to where the Printer folder resides
			logoURL: perfil.dirImg+'cedrux.png', // relative to the html files where it goes the base printing
			pdfEnable: true,  // enables link PDF printing (only save as)
			hasrowAction:false,
			localeData:{
				Title:'Reconstruir Saldos',
				subTitle:tabla_cabeza,
				footerText:tabla_pie,
				pageNo:'P&aacute;gina No.',	//page label
				printText:'Imprimir',  //print document action label
				closeText:'Cerrar',  //close window action label
				pdfText:'PDF'},
			    useCustom:{  // in this case you leave null values as we dont use a custom store and TPL
				custom:false,
				customStore:null,
				columns:[],
				alignCols:[],
				pageToolbar:null,
				useIt: false,
				showIt: false,
				location: 'bbar'
			},
			showdate:true,// show print date 
			showdateFormat:'Y-F-d H:i:s', //
			showFooter:true,  // if the footer is shown on the pinting html
			styles:'default' // wich style youre gonna use
		});
		global_printer.prepare(); // prepare the document
		}
		});
}