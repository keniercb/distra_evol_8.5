/**
 * Interfaz para evaluar los recursos*
 * 
 * @author Tte. Ing. Javier Rodr�guez L�pez*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */
/*var tplDatosPersona = new Ext.XTemplate(
    '<table width="100%" ><tr>',
    '<td width="35%" class="row-title">No. identidad</td>',
    '<td width="35%" class="row-title">Nombre</td>',
    '<td width="30%" class="row-title">Segundo nombre</td>',
    '</tr><tr>',
    '<td width="35%" class="row-detail">{numid}</td>',
    '<td width="35%" class="row-detail">{nombre}</td>',
    '<td width="30%" class="row-detail">{snombre}</td>',
    '</tr><tr>',
    '<td width="35%" class="row-title">Primer apellido</td>',
    '<td width="35%" class="row-title">Segundo apellido</td>',
    '<td width="30%" class="row-title">Edad</td>',
    '</tr><tr>',
    '<td width="35%" class="row-detail">{papel}</td>',
    '<td width="35%" class="row-detail">{sapel}</td>',
    '<td width="30%" class="row-detail">{edad}</td>',
    '</tr><tr>',
    '<td width="35%" class="row-title">Sexo</td>',
    '<td width="35%" class="row-title">Cargo</td>',
    '<td width="30%" class="row-title">Categor&iacute;a</td>',
    '</tr><tr>',
    '<td width="35%" class="row-detail">{sexo}</td>',
    '<td width="35%" class="row-detail">{cargo}</td>',
    '<td width="30%" class="row-detail">{categoria}</td>',
    '</tr></table>'
    );
tplDatosPersona.compile();

var tplFoto = new Ext.XTemplate(
    '<div class="details">','<tpl for=".">',
    '<center><img src="{dirfoto}" height=120 width=120 style="cursor:pointer;border:1px solid 000" /></center><div class="details-info">',
    '</tpl>','</div>'
    );
tplFoto.compile();*/
 
Ext.ns("Ext.PVD.Evaluaciones.Evaluar");
Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadoresFP = Ext.extend(Ext.Window,{
    layout:'border',
    title:'Evaluar persona',
    initComponent: function(){
		console.info('asdasd');
        var self = this;
        var btnGuardar = new Ext.Button({
            disabled:true,
            iconCls:'guardar',
            text:self.labels.lbBtnGuardar, 
            tooltip:self.labels.ttpBtnGuardar, 
            handler: guardarValorIndicador
        });
        this.btnCancelar = new Ext.Button({
            iconCls:'cancelar',
            text:self.labels.lbBtnCancelar, 
            tooltip:self.labels.ttpBtnCancelar, 
            handler: function(){
                self.close();
            }
        });
        this.btnTerminarEvaluar = new Ext.Button({
            iconCls:'aceptar',
            text:self.labels.lbFinEvaluar, 
			tooltip:self.labels.ttpFinEvaluar,
            handler: terminarEvaluacion
        });
		
        var stEscala = new Ext.data.Store({
            url: 'cargarEscala',
            reader:new Ext.data.JsonReader({	    
                root: "datos",
                totalProperty: "cantidad",
                id: "idestado" 
            },[
            {
                name: 'idescala'
            },

            {
                name: 'denom'
            }			
            ])
        });
        var cbEscala = new Ext.form.ComboBox({
            store: stEscala,
            fieldLabel:self.labels.lbcbEscala,
            valueField : 'idescala',
            hiddenName : 'idescala',
            editable:false,		   
            allowBlank:false,
            displayField:'denom',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText:'Seleccione',
            selectOnFocus:true,
            anchor:'50%',
            disabled:true,
        });
		
        var taAyuda = new Ext.form.TextArea({
            fieldLabel: self.labels.lbtaAyuda,
            readOnly: true,
            anchor: '100%',
            height:80,
        });
		
        var taComplementoTextual = new Ext.form.TextArea({
            fieldLabel: self.labels.lbtaCompltoText,
            disabled:true,
            anchor:'100%',
            height:80,
        })
		
        var fpEvalIndicador = new Ext.FormPanel({
            layout: 'form',
            region:'center',
            buttons:[btnGuardar],
            border:false,
            bodyStyle:'padding:10 10 10 10',
            margins:'5 5 5 5',
            labelAlign: 'top',
            frame:true,
            defaultType: 'textfield',
            items: [cbEscala,taComplementoTextual,taAyuda]
        });
        var pAux = new Ext.Panel({
            title:self.labels.lbfpEvalIndicador, 
            items:[fpEvalIndicador], 
            layout:'border', 
            region:'center', 
            height:300
        });
		
        var pFoto = new Ext.Panel({
            width: 120,
            height: 120,
            border: true,
            autoShow: true,
            region:'center',
        });
        pFoto.on('render', function(cmp){
            cmp.setHeight(120);
        });
		
        var pDetails = new Ext.Panel({
            autoShow:true,
            columnWidth:1.0,
            layout:'fit',
            border:false
        });
		
        var pDatosPersona = new Ext.Panel({
            layout: 'form',
            frame : true,
            region: 'north',
            margins:'0 0 5 0',
            labelAlign: 'top',
            height:155,
            bodyStyle : 'padding: 2px 0px 0px 2px',
            width: '100%',
            items: [{
                layout: 'column',
                anchor: '100%',
                border: false,
                items: [{
                    columnWidth: 0.24,
                    id: 'padrefoto',
                    layout: 'border',
                    height: 135,
                    frame: true,
                    style: '-moz-border-radius:5px',
                    items: [pFoto]
                },{
                    columnWidth: 0.01, 
                    layout: 'form', 
                    items:[{
                        xtype: 'panel',
                        height: 140,
                        width:0.05
                    }]		
                },{
                    xtype: 'fieldset',
                    id: 'fieldsetAsociar',
                    columnWidth : .75,
                    bodyStyle : 'padding: 5px 5px 5px 5px',
                    height:155,
                    layout: 'column',				
                    items:[pDetails]
                }]
            }]
        });
        //Parche para que se vea la foto
        pDatosPersona.on('render', function(cmp){
            cmp.setHeight(155);
        });
		
        var pCentral = new Ext.Panel({
            region:'center',
            width:'60%',
            layout:'border',
            border:false,
            margins: '5 5 5 5',
            items: [pDatosPersona,pAux]
        });
		
        var tpIndicadores = new Ext.PVD.Evaluaciones.CmpPlanillaEvaluativa({
            region:'west',
            width:'40%',
            margins: '5 0 5 5',
            idpersona: self.evaluado.get('idpersona'),
            idpersonaevalfueraproceso: self.evaluado.get('idpersonaevalfueraproceso'),
            idplanilla: self.evaluado.get('idplanilla'),
            fechaevaluacion:self.evaluado.get('fechaevaluacion'),
            editable:self.editable,
            listeners:{
                click:function(nodo,event){
                    var myMask = new Ext.LoadMask(pAux.body, {
                        msg:self.labels.lbGridLoadMask
                    });
                    taAyuda.setValue(nodo.attributes.ayuda);				
                    taComplementoTextual.reset();
                    if(nodo.isLeaf()){
                        myMask.show();
                        cbEscala.reset();
                        cbEscala.clearValue();
                        if(nodo.attributes.idescala != null){
                            stEscala.load({
                                params:{
                                    idindicador:nodo.id
                                }
                            });
                            cbEscala.enable();	
                            if(nodo.attributes.idvalor != null){
                                stEscala.on('load', function(st, records, options){
                                    cbEscala.setValue(nodo.attributes.idvalor);
                                    myMask.hide();
                                });
                            }else{
                                stEscala.on('load', function(st, records, options){
                                    cbEscala.clearValue();
                                    myMask.hide();
                                });
                            }
                        }else{
                            cbEscala.disable();
                        }
                        if(nodo.attributes.complementotextual){
                            taComplementoTextual.enable();
                            taComplementoTextual.setValue(nodo.attributes.valorComplementotextual);
                        }else{
                            taComplementoTextual.disable();
                        }
                        if(self.editable){
                            btnGuardar.enable();
                        }
                    }else{
                        disableCmps();
                    }
                }
            }
        });
		tpIndicadores.on('evalindchange',function(rec){
			console.info(rec);
		});
		
        this.items = [tpIndicadores,pCentral];
        this.buttons = [self.btnCancelar,self.btnTerminarEvaluar];
        Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadoresFP.superclass.initComponent.call(this);
        this.on('show', function(cmp){
            var dirFoto = null;
            if(self.evaluado.get('idfoto')){
                dirFoto = '../../views/images/personas/'+self.evaluado.get('idfoto')+self.evaluado.get('extension');
            }
            else{
                dirFoto = '../../views/images/personas/no-body.jpg';
            }
            tplFoto.overwrite(pFoto.body, {
                dirfoto: dirFoto
            });
            pFoto.body.slideIn('l', {
                easing: 'easeOut', 
                duration: .5
            });
            tplDatosPersona.overwrite(pDetails.body, {
                numid: self.evaluado.get('numid'),
                nombre: self.evaluado.get('nombre'),
                snombre: self.evaluado.get('snombre')||'',
                papel: self.evaluado.get('papel'),
                sapel: self.evaluado.get('sapel'),
                cargo: self.evaluado.get('cargo'),
                sexo: self.evaluado.get('sexo'),
                categoria: self.evaluado.get('categoria'),
                edad: self.evaluado.get('edad'),
            });
			
            if(!self.editable){
                self.btnTerminarEvaluar.hide();
                btnGuardar.hide();
            }
        });
		
        function disableCmps(){
            cbEscala.disable();
            taComplementoTextual.disable();
            btnGuardar.disable();
        }
		
        function guardarValorIndicador(){
            if(fpEvalIndicador.getForm().isValid()){
                PVD.mostrarMascara('saveEval', self.labels.lbMsgWait, self.labels.lbMskSaveEvalInd);
                var complementotextual = taComplementoTextual.getValue();
                var idvalor = cbEscala.getValue();
                var indicador = tpIndicadores.getSelectionModel().getSelectedNode();
                Ext.Ajax.request({
                    url: 'guardarValorEvalIndicador',
                    method:'POST',
                    params: {
                        idindicadorevaluacion: indicador.attributes.idindicadorevaluacion,
                        idindicadorevalfueraproceso: indicador.attributes.idindicadorevalfueraproceso,
                        idvalor: idvalor,
                        complementotextual: complementotextual
                    },
                    callback: function (options,success,response){
                        var node = tpIndicadores.getSelectionModel().getSelectedNode();
                        tpIndicadores.getLoader().load(node.parentNode);
                        fpEvalIndicador.getForm().reset();
                        PVD.ocultarMascara('saveEval');
                        Ext.MessageBox.show({
                            title: 'Informaci&oacute;n',
                            msg: 'La evaluaci&oacute;n de guard&oacute; correctamente',
                            buttons: Ext.MessageBox.OK, 
                            icon: Ext.MessageBox.INFO,
                            fn: function(){
                                disableCmps();
                            }
                        });
                    }
                });
            }
        }
		
        function terminarEvaluacion(){
            PVD.mostrarMascara('validInd', self.labels.lbMsgWait, self.labels.lbMskValidInd);
            Ext.Ajax.request({
                url: 'validarIndicadoresEvaldos',
                method:'POST',
                params: {
                    idpersonaevalfueraproceso: self.evaluado.get('idpersonaevalfueraproceso')
                },
                callback: function (options,success,response){
                    var datos = Ext.util.JSON.decode(response.responseText);
                    PVD.ocultarMascara('validInd');
                    if(datos.success){
                        PVD.mostrarMascara('saveEvalFinal', self.labels.lbMsgWait, self.labels.lbMskSaveEvalFinal);
                        Ext.Ajax.request({
                            url: 'guardarEvalFinal',
                            method:'POST',
                            params: {
                                idpersonaevalfueraproceso: self.evaluado.get('idpersonaevalfueraproceso'),
                                fechaevaluacion: tpIndicadores.dfFechaevaluacion.getRawValue()                                                     
                            },
                            callback: function (options,success,response){
                                PVD.ocultarMascara('saveEvalFinal');
                                mostrarMensaje(1,self.labels.lbMsgFinEval);
                                self.fireEvent('evaluacionConcluida');
                                self.close();
                            }
                        });
                    }else{
                        Ext.MessageBox.show({
                            title:'Alerta', 
                            msg:"Faltan indicadores por evaluar.", 
                            buttons:Ext.MessageBox.OK, 
                            icon:Ext.MessageBox.WARNING, 
                            fn:function(){
                                self.btnTerminarEvaluar.focus();
                            }
                        });
                    }
                }
            });
			
        }
		
    }
});
