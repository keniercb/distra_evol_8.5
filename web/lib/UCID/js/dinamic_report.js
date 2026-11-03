

function DinamicReport(Server,Port,render)
{
	
	var scope=this;
	this.Port=(Port)?Port:"80";
	this.Server=(Server)?Server:"localhost";
	this.ReportIcon="http://"+this.Server+":"+this.Port+"/images/icons/report.ico";
	this.PrintIcon="http://"+this.Server+":"+this.Port+"/images/icons/imprimir.png";
	this.UpdateIcon="http://"+this.Server+":"+this.Port+"/images/icons/fam/table_refresh.png";
	this.DeleteIcon="http://"+this.Server+":"+this.Port+"/images/icons/fam/delete.gif";
	this.ActionUrl="http://"+this.Server+":"+this.Port+"/report_generator.php/report_viewer";
	this.ReportID=0;
	this.ReportWin=false;
	this.CategoryID=0;
	this.Parameters=[];
	this.Conditions=[];
	this.ReportName="";
	this.Format="HTML";
    this.Button=false;
	this.Marco=new Ext.Panel({layout:'accordion',width:'100%',height:this.getWindowSize().height+10 });
	var Scope=this;
	this.RenderTo=(render)?render:Ext.getBody().dom;

	this.Show=1;//Para que el visor muestre todo el reporte ademas de generarlo (solo lectura)
	this.OutSide=1;//Para que reconozca las peticiones desde otro entorno (solo lectura)
	this.Limit=20;
	this.defaulLogicalOperator='y';
	return this;
}
DinamicReport.prototype=
{
		
		setId:function(id)
		{
		  this.ReportID=id;
		},
		clear:function()
		{
		  this.Parameters=[];
		  this.Conditions=[];
		},
		loadFunction:function(SqlfunctionName,SqlSchema,SqlField,ValueField,IsNull)
		{
			//alert("/"+SqlfunctionName+"/"+SqlSchema+"/"+SqlField+"/"+ValueField+"/"+IsNull);
		   this.addParameter(SqlfunctionName,SqlField,SqlSchema,ValueField,IsNull);
		},
		showLog:function()
		{
			var scope=this;
		   var log=new Ext.Window({ title:"Informacion",autoScroll:true, width:300,height:500,html:scope.PrepareUrl().replace(/&/i,"<br/>"),maximizable:true,minimizable:true,resizable:false,renderTo:Ext.getBody().dom });
		   log.show();
		},
	    getWindowSize:function()
	    {
	    	 var winW = 600, winH = 600;

			if (parseInt(navigator.appVersion)>3) {
			 if (navigator.appName=="Netscape") {
			  winW = window.innerWidth;
			  winH = window.innerHeight;
			 }
			 if (navigator.appName.indexOf("Microsoft")!=-1) {
			  winW = document.body.offsetWidth;
			  winH = document.body.offsetHeight;
			 }
			}
			return {width:winW,height:winH};
	    },
		getActionUrl:function()
		{
		  return this.ActionUrl;
		},
		
		getId:function()
		{
		  return this.ReportID;
		},
		
		setCategoryID:function(categoryID)
		{
		  this.CategoryID=categoryID;
		},
		getCategoryID:function()
		{
		  return this.CategoryID;
		},
		setReportName:function(name)
		{
		  this.ReportName=name;
		},
		getReportName:function()
		{
		  return this.ReportName;
		},
		setParameters:function(params)
		{
		  this.Parameters=params;
		},
		getParameters:function()
		{
		  return this.Parameters;
		},
		setConditions:function(Conditions)
		{
		  this.Conditions=Conditions;
		},
		getConditions:function()
		{
		  return this.Conditions;
		},
		setDefaultLogicalOperator:function(operator)
		{
		  this.defaulLogicalOperator=operator;
		},
		getDefaultLogicalOperator:function()
		{
		 return this.defaulLogicalOperator;
		},
		setFormat:function(Format)
		{
		  this.Format=Format;
		},
		getFormat:function()
		{
		  return this.Format;
		},
		getOutSide:function()
		{
		  return this.OutSide;
		},
		getShow:function()
		{
		  return this.Show;
		},
		setLimit:function(Limit)
		{
		  this.Limit=Limit;
		},
		getLimit:function()
		{
		  return this.Limit;
		},
		getServer:function()
		{
		 return this.Server;
		},
		addParameter:function(SqlFunctionName,ParameterName,Schema,Value,IsNull)
		{
		   this.getParameters().push([SqlFunctionName,ParameterName,Schema,Value,IsNull]);
		},
		setButtonLoadAction:function(bt)
		{
		  this.Button=bt;
		},
		addCondition:function(OpenParentesis,RelacionalOperator,Value,ClosedParentesis,LogicalOperator,Schema,Table,Field,IsNull)
		{
		   
		   this.getConditions().push([OpenParentesis,RelacionalOperator,Value,ClosedParentesis,LogicalOperator,Field,Table,Schema,IsNull]);
		   if(this.getConditions().length==1)
		   {
		   	 this.getConditions()[0][4]='';
		   }
		   else 
		   this.getConditions()[0][4]=this.getDefaultLogicalOperator();
		   
		},
		addReport:function(title,description,url)
		{
		// Ext.Msg.alert("Info",this.PrepareUrl());
			var scope=this; 
		    
		    if(!this.ReportWin)
			 {
		     this.ReportWin=new Ext.Window({
			  width:"100%",
			  height:this.getWindowSize().height,
			  modal:true,
			  animateTarget:scope.Button,
			  monitorResize:true,
			  iconCls:"background: url("+scope.ReportIcon+") no-repeat !important;",
			  title:"Visor de Reportes",
			  minimizable:false,
			  x:0,
			  y:0,
			  renderTo:this.RenderTo,
			  items:[this.Marco],
			  maximizable:true
			  });
			
			this.ReportWin.on('close',function(){ 
					scope.ReportWin=false;
					scope.clear();
					scope.Marco=new Ext.Panel({layout:'accordion', width:'100%',height:scope.getWindowSize().height+10,tbar:['-'] });
				},this);
			}
			
		  this.ReportWin.show( this.Button );
		  var id=Math.random()*99999999;
		  var idIframe="id-report-panel-iframe-"+id;
		  var idReportPanel="id-report-panel-"+id;
		  var update=function(btn)
		  {
		     var iframetoReload=(document.getElementById(btn.idIFRAME))?document.getElementById(btn.idIFRAME):false;
		     if(iframetoReload)
		     {
		       iframetoReload.src=iframetoReload.src+"&rand="+Math.random()*999999;
		     }
		     
		  };
		  var imprimir=function(btn)
		  {
		     
		     if((document.getElementById(btn.idIFRAME))?document.getElementById(btn.idIFRAME):false)
			 {
			     var iframetoReload=(document.getElementById(btn.idIFRAME))?document.getElementById(btn.idIFRAME):false;
				 var initUri=btn.BaseUri+"&limit="+btn.Limit.value;
				 scope.Limit=btn.Limit.value;
			     if(iframetoReload)
			     {
			     //	window.screen
			       window.open(initUri+"&rand="+Math.random()*99999999) ;
			     }
			 }
			 return false;
		     
		  };
		//  var splin=
		  var limit = new Ext.form.TextField(
		    {
				  value: 20,
				  width:70,
				  owner:scope,
				  maskRe:/^[0-9]+$/,
				  disablekeyFilter:true,	  
				  emptyText:20,	 
				  allowBlank:false,
				  blankText:'Por defecto muestra las primeras 20 recuperaciones.',
				  listeners:
				  {
				    change:function(field, newValue, oldValue)
					{
				      if(!field.isValid())
				       field.setValue(oldValue);
				    // if(newValue == "");
				      //    field.setValue(0);
				    }
				
				  },
				  validateOnBlur:true,
				  validationDelay:250,
				  validationEvent:'keyup',
				  validator:function(val)
				  {
	  				  var exp=/^[0-9]+$/;
					  if(exp.test(val))
					  return true;
					  return 'Debe introducir un valor entero positivo.';
				  },
				  editable: true
		    });
		   var Delete=function(btn)
		  {
		  	  var panel=Ext.getCmp(btn.idPanel);
			  if(panel && scope.Marco)
			  {
		      scope.Marco.remove(panel);
		      if(scope.Marco.items.getCount()<=0)
		      scope.ReportWin.close();
		      else 
		      scope.Marco.items.item(0).expand();
			  }
		  };
		  var btnUpdate=new Ext.Button({Limit:limit, BaseUri:url, cls:"x-btn-text-icon", idIFRAME:idIframe,idPanel:idReportPanel, icon:scope.UpdateIcon, text:"Actualizar",handler:update });
		  var btnDelete=new Ext.Button({ Limit:limit,BaseUri:url,cls:"x-btn-text-icon" ,idIFRAME:idIframe,idPanel:idReportPanel,icon:scope.DeleteIcon,text:"Eliminar",handler:Delete });
		  var btnPrint=new Ext.Button({Limit:limit,BaseUri:url,cls:"x-btn-text-icon",idIFRAME:idIframe,idPanel:idReportPanel, icon:scope.PrintIcon,text:"Imprimir",handler:imprimir });
		  var initUri=url+"&limit="+limit.value;
		  var reporte=new Ext.Panel({
		  width:"100%",
		  frame:false,
		  wasExpanded:false,
		  btn:btnUpdate,
		  BaseUri:url,
		  Limit:limit,
		  tbar:['-',btnUpdate,'-',btnDelete,'-',btnPrint/*,'-','Limite: (0 = no limitar): ','-',limit,'-'*/],
		  id:idReportPanel,
		  listeners:
		  	{
		  		 expand:function(p)
		  			{ 
		  				if(reporte && !reporte.wasExpanded) 
		  				{ 
			  				reporte.wasExpanded=true;
			  				scope.autoShow(p);
		  				}
		  			}  
		  	},
		  height:this.ReportWin.getSize().height-1,
		  autoDestroy:true,
		  autoShow:true,
		  title:(description)?"<img src='"+scope.ReportIcon+"' width='15px' height='15px'  /> Reporte: "+description:"<img src='"+scope.ReportIcon+"' width='15px' height='15px'  />"+"Visor de Reportes",
		  collapsible:true,
		  collapsed:false,
		  html:"<iframe frameborder=1 scrolling='yes' id='"+idIframe+"' width='100%' height='500' src='"+url+"' ></iframe>"
		   });
		  
		  this.Marco.add(reporte);
		  this.Marco.doLayout();
		  this.autoShow(reporte);
		  //this.ReportWin.show();
		  
		
		},
		autoShow:function(p)
		{
		     if(p)
			 {
			     var iframetoReload=(document.getElementById(p.btn.idIFRAME))?document.getElementById(p.btn.idIFRAME):false;
			     if(iframetoReload)
			     {
			       iframetoReload.src=p.BaseUri+"&limit="+p.Limit+"&rand="+Math.random()*99999999;
			     }
			 }
		},
		PrepareUrl:function()
		{
		   var conditions=(this.getConditions().length>0)?"conditions="+Ext.encode(this.getConditions()):false;
		   var parameters=(this.getParameters().length>0)?"parameters="+Ext.encode(this.getParameters()):false;
		   var rand=Math.random()*999999999;
		   var uri='requestID='+rand+"&show="+this.getShow()+"&outside="+this.getOutSide()+"&exportar="+this.getFormat();
		   if(conditions)
		   uri+='&'+conditions;
		   if(parameters)
		   uri+="&"+parameters;
		   return this.getActionUrl()+"?"+uri;
		},
		OpenReportOnNewTab:function(title,description,url)
		{
		  this.setReportName(title);
		  window.open(url+"&reportName="+title+"&cantidad=100&servicio=true&category="+this.CategoryID);
		}
		,
		getReportById:function(id,title,description)
		{
		  var url=this.PrepareUrl()+'&report='+id;
		  //Ext.MessageBox.alert("url",url);
		  //this.addReport((title)?title:"",description,url);
		  this.OpenReportOnNewTab(title,description,url);
		}
		,
		getReport:function(title,description)
		{
		  //return this.getReportById()
		  var titulo=(title)?title:"";
		  this.setReportName(titulo);
		  var url=this.PrepareUrl()+'&category='+this.getCategoryID()+'&reportName='+this.getReportName();
		  this.addReport(titulo,description,url);
		  
		},
		showOnIframe:function(reportName,categoryName,title,description,withFilter,id)
		{
		  var r = reportName?'&report='+reportName:'';
		  var c = categoryName?'&category='+categoryName:'';
		  var f = '&withFilter='+withFilter;
		  var url=this.PrepareUrl()+c+r+f;
		  document.getElementById(id).src=url;
		},
		getViewer:function(reportName,categoryName,title,description,withFilter)
		{
			var r = reportName?'&report='+reportName:'';
			var c = categoryName?'&category='+categoryName:'';
			var f = '&withFilter='+withFilter;
			var url=this.PrepareUrl()+c+r+f;
			this.OpenReportOnNewTab(title,description,url);
		}
		
}
