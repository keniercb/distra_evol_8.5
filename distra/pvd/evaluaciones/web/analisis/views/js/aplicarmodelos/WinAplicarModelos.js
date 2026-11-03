/**
 * Interfaz para evaluar los recursos*
 *
 * @author Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 */

Ext.ns("Ext.PVD.Evaluaciones.Evaluar");
Ext.PVD.Evaluaciones.Evaluar.WinAplicarModelos = Ext.extend(Ext.Window,{
    layout:'border',
    initComponent: function(){
        var self = this;

        this.btnPerfil = new Ext.Button({
            id:'btnPerfil',
            text:self.labels.lbBtnPerfil,
            tooltip:self.labels.ttpBtnPerfil,
            iconCls:'btn',
            icon:perfil.dirImg+'informe.png',
			disabled:true,
            handler: PerfilIndicadores,
            nextTab: 'inputNombrePC',
            prevTab: 'btnLimpiarPersPerfil',
        });

        this.textFieldPersCom = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'inputNombrePC',
            anchor: '95%',
            fieldLabel: labels.lbDenominacion,
            emptyText: labels.lbEmptyTextBuscar,
            nextTab: 'btnBuscarPersPerfil',
            prevTab: 'btnPerfil',
            listeners: {
                specialkey: function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        if (!Ext.isEmpty(this.getValue())) {
                            self.btnBuscarPersPerfil.handler();
                            }
                        }
                    }
                },
        });

        this.btnBuscarPersPerfil = new Ext.Button({
            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'btn',
            id: "btnBuscarPersPerfil",
            //tooltip: etiquetas.ttipbtn_Buscar,
            text: labels.lbBtnBuscarPersPerfil,
            tooltip: labels.lbToolTipBuscarPersPerfil,
            handler: function() {
                self.stPersonas.load({
                    params: {
                        filtro: Ext.getCmp('inputNombrePC').getValue(),
                        limit: 15,
                        start: 0
                    },
                    callback: function() {
                        //gpPerComision.getSelectionModel().selectFirstRow();
                        //textFieldPersCom.reset();
                    }
                });
            },
            nextTab: 'btnLimpiarPersPerfil',
            prevTab: 'inputNombrePC',
        });

        this.btnLimpiarPersPerfil = new Ext.Button({            
            id: 'btnLimpiarPersPerfil',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            text: labels.lbBtnLimpiar,
            tooltip: labels.lbToolTipLimpiar,
                handler: function() {
                     Ext.getCmp('inputNombrePC').reset();
                },
            nextTab: 'btnPerfil',
            prevTab: 'btnBuscarPersPerfil',
    });

        this.btnAplicarModelo = new Ext.Button({
		    id:'btnAplicarModelo',
            text:labels.lbBtnAplicarModelo,
            tooltip:labels.ttpBtnAplicarModelo,
            icon: perfil.dirImg+'aplicar.png',
            disabled:true,
            iconCls: 'btn',
            handler: AplicarModelo
        });

        this.btnExportar = new Ext.Button({
		    id:'btnExportar',
            text:self.labels.lbBtnExportar,
            tooltip:self.labels.ttpBtnExportar,
            icon: perfil.dirImg+'exportar.png',
            iconCls: 'btn',
            disabled:true,
            handler: function(){                
                if(self.stResultados.getCount() > 0){
                    var winExportarDatos = new Ext.PVD.Evaluaciones.Evaluar.WinExportarDatos ({
                        labels:self.labels,
                        idmodelo: self.cbModelos.getValue(),
                        idpreprocesoevaluativo: self.procesoEval.get('idpreprocesoevaluativo'),
                        denominacionproceso: self.procesoEval.get('denom')
                    });
					winExportarDatos.show();				
				}
            }
        });

        this.btnGuardar = new Ext.Button({
		    id:'btnGuardar',
            text:self.labels.lbBtnGuardar ,
            tooltip:self.labels.ttpBtnGuardar,
            icon: perfil.dirImg+'guardar.png',
            iconCls: 'btn',
            disabled:true,
            handler: guardarResultadoEval
        });
        
        this.btnOrganigrama = new Ext.Button({
		    id:'btnOrganigrama',
            text:labels.lbBtnOrganigrama,
            tooltip:labels.ttpBtnOrganigrama,
            disabled:true,
            iconCls :'organigrama',
            //handler: 
			prevTab:'btnExportar',
			nextTab:'cbModelos',
        });

        this.stModelos = new Ext.data.Store({
            url: 'getModelosPorPlanilla',
            reader:new Ext.data.JsonReader({
                root: 'datos'
            },[{
                name: 'idmodelo'
            },{
                name: 'denom'
            },{
                name: 'descripcion'
            }])
        });
        this.cbModelos = new Ext.form.ComboBox({
		    id:'cbModelos',
            store: self.stModelos,
            mode: 'local',
            displayField:'denom',
            valueField:'idmodelo',
            forceSelection: true,
            emptyText: self.labels.lbEmptySelectText,
            selectOnFocus:true,
            extendField: 'descripcion',
            msgTarget : 'qtip',
            enableQtip : true,
            typeAhead: true,
            triggerAction: 'all',
            width:250,
			nextTab:'btnAplicarModelo',
			prevTab:'btnOrganigrama',
            listeners:{
                select: function(combo, record, index){
                    self.btnAplicarModelo.enable();
                    PVD.mostrarMascara('loadresultados', self.labels.lbMsgWait, self.labels.lbMsgLoadindResultados);
                    Ext.Ajax.request({
                        url: 'cargarmodelosmatematicos',
                        method: 'POST',
                        params: {
                            idmodelo: record.get('idmodelo'),
                            idpreprocesoevaluativo: self.procesoEval.get('idpreprocesoevaluativo')
                        },
                        callback : function(options, success, response) {
                            var result = Ext.util.JSON.decode(response.responseText);
                            self.stResultados.loadData(result);
                            PVD.ocultarMascara('loadresultados');
                            self.btnAplicarModelo.focus();
                        }
                    });
                }
            }
        });

        this.pFichaProcesoEval = new Ext.PVD.Evaluaciones.FichaProcesoEval({
            proceso: self.procesoEval,
            margins:'5 5 5 5'
        });

        this.stPersonas = new Ext.data.GroupingStore({
            url:'getEvaluadosPE',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            },[
            {
                name: 'idpersona'
            },

            {
                name: 'numid'
            },

            {
                name: 'nombre'
            },

            {
                name: 'snombre'
            },

            {
                name: 'papel'
            },

            {
                name: 'sapel'
            },

            {
                name: 'sexo'
            },

            {
                name: 'edad'
            },

            {
                name: 'categoria'
            },

            {
                name: 'cargo'
            },

            {
                name: 'entidad'
            },

            {
                name: 'estado'
            },

            {
                name: 'idpersonaevaluacion'
            },

            {
                name: 'idfoto'
            },

            {
                name: 'extension'
            },

            {
                name: 'idplanilla'
            }
            ]),
            listeners:{
                load: function(st, records, options){
                    if(records.length > 0){
                        self.gpPersonas.getSelectionModel().selectFirstRow();
                        self.btnPerfil.focus();
                    }else{
                        Ext.MessageBox.show({
                            title: self.labels.lbInfo,
                            msg: self.labels.msgNoData,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            fn: function(){
                                self.btnPerfil.focus();
                            }
                        });
                    }
                }
            }
        });

        this.stResultados = new Ext.data.GroupingStore({
            url:'getEvaluadosPE',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            },[
            {
                name: 'idpersona'
            },

            {
                name: 'numid'
            },

            {
                name: 'nombre'
            },

            {
                name: 'snombre'
            },

            {
                name: 'papel'
            },

            {
                name: 'sapel'
            },

            {
                name: 'sexo'
            },

            {
                name: 'edad'
            },

            {
                name: 'categoria'
            },

            {
                name: 'cargo'
            },

            {
                name: 'entidad'
            },

            {
                name: 'estado'
            },

            {
                name: 'idpersonaevaluacion'
            },

            {
                name: 'idfoto'
            },

            {
                name: 'extension'
            },

            {
                name: 'idplanilla'
            },
            {
                name: 'resultado'
            }
            ]),
            listeners:{
                load: function(st, records, options){
                    if(records.length > 0){
                        self.gpResultados.getSelectionModel().selectFirstRow();
                        self.btnExportar.enable();
                        self.btnGuardar.enable();
                        self.btnOrganigrama.enable();
                    }else{
                        Ext.MessageBox.show({
                            title: self.labels.lbInfo,
                            msg: self.labels.msgNoData,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            fn: function(){
                                self.btnAplicarModelo.focus();
                            }
                        });
                    }
                }
            }
        });
         var kmIindicadorTexto = [{
        key: 'p',
        alt:true,
        fn: function(){
           PerfilIndicadores();
        }
    },{
        key: 'b',
        alt:true,
        fn: function(){
           self.btnBuscarPersPerfil.handler();
        }
    },{
        key: 'l',
        alt: true,
        fn: function() {
           self.btnLimpiarPersPerfil.handler();
        }
    }];

        var smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners:{
                selectionchange: function(sm){
                    if(sm.hasSelection()){
                        var flag = true;
                        var arrRecords = smPersonas.getSelections();
                        Ext.each(arrRecords, function(record){
                            if(record.get('estado') == 2){//*** No evaluado
                                flag = false;
                            }
                        }, this);
                        if(flag){
                            self.btnPerfil.enable();
                        }else{
                            self.btnPerfil.disable();
                        }
                        
                    }else{
                        self.btnPerfil.disable();
                    }
                }
            }
        });

        this.gpPersonas = new Ext.grid.GridPanel({//grid panel para mostrar las personas
            title: self.labels.lbGpPersonas,
            tabTip:self.labels.lbPanelListPersonas,
            store: self.stPersonas,
			keys:kmIindicadorTexto,
            loadMask:{
                msg: self.labels.lbGridLoadMask
            },
            tbar:[self.btnPerfil, self.textFieldPersCom, self.btnBuscarPersPerfil, self.btnLimpiarPersPerfil],
            columns: [smPersonas,
            {
                header: "CI",
                width: 95,
                sortable: true,
                dataIndex: 'numid'
            },

            {
                header: "Nombre",
                width: 110,
                sortable: true,
                dataIndex: 'nombre'
            },

            {
                header: "Segundo nombre",
                width: 110,
                sortable: true,
                dataIndex: 'snombre'
            },

            {
                header: "Primer apellido",
                width: 110,
                sortable: true,
                dataIndex: 'papel'
            },

            {
                header: "Segundo apellido",
                width: 110,
                sortable: true,
                dataIndex: 'sapel'
            },

            {
                id:'expandir',
                header: "Cargo",
                width: 120,
                sortable: true,
                dataIndex: 'cargo'
            },

            {
                header: "Estado",
                width: 100,
                sortable: true,
                dataIndex: 'estado',
                renderer:self.showStatus
            }],
            bbar: new Ext.PagingToolbar({
                pageSize:15,
                displayInfo:true,
                store: self.stPersonas,
                displayMsg: self.labels.lbDisplayMsg,
                emptyMsg: self.labels.lbEmptyMsg
            }),
            sm: smPersonas
        });
		 var kmIndicador = [{
			key: 'g',
			alt:true,
			fn: function(){
			   guardarResultadoEval();
        }
    },{
			key: 'e',
			alt:true,
			fn: function(){
			   self.btnExportar.handler();
        }
	}
    ];
        this.gpResultados = new Ext.grid.GridPanel({//grid panel para moestrar las personas
            title: self.labels.lbGpResultados,
            tabTip:self.labels.lbPanelResultados,
            store: self.stResultados,
			keys:kmIndicador,
            loadMask:{
                msg: self.labels.lbGridLoadMask
            },
            tbar:['Modelos:',' ',self.cbModelos,self.btnAplicarModelo,self.btnGuardar,self.btnExportar/*self.btnOrganigrama*/],
            columns: [
            {
                header: "CI",
                width: 95,
                sortable: true,
                dataIndex: 'numid'
            },
            {
                header: "Nombre",
                width: 110,
                sortable: true,
                dataIndex: 'nombre'
            },
            {
                header: "Segundo nombre",
                width: 110,
                sortable: true,
                dataIndex: 'snombre'
            },
            {
                header: "Primer apellido",
                width: 110,
                sortable: true,
                dataIndex: 'papel'
            },
            {
                header: "Segundo apellido",
                width: 110,
                sortable: true,
                dataIndex: 'sapel'
            },
            {
                id:'expandir',
                header: "Cargo",
                width: 120,
                sortable: true,
                dataIndex: 'cargo'
            },
            {
                header: "Estado",
                width: 100,
                sortable: true,
                dataIndex: 'estado',
                renderer:self.showStatus
            },
            {
                header: "Evaluaci&oacute;n",
                width: 130,
                sortable: true,
                dataIndex: 'resultado'
            }],
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true,
                listeners:{
                    rowselect: function(sm, rowIndex, record){

                    }
                }
            })
        });		
        this.tbPanelListado = new Ext.TabPanel({
            activeTab: 0,
            region: 'center',
            margins: '0 5 5 5',
			items: [self.gpPersonas,self.gpResultados]
        });

        this.items = [this.pFichaProcesoEval,this.tbPanelListado];
        Ext.PVD.Evaluaciones.Evaluar.WinAplicarModelos.superclass.initComponent.call(this);
        this.on('render', function(cmp){
            self.stPersonas.baseParams.idpreprocesoevaluativo = self.procesoEval.get('idpreprocesoevaluativo');
            self.stPersonas.baseParams.idplanilla = self.procesoEval.get('idplanilla');
            self.stPersonas.load({
                params:{
                    start:0,
                    limit:15
                }
            });
            self.stModelos.load({
                params:{
                    idplanilla: self.procesoEval.get('idplanilla')
                }
            });
        });

        function PerfilIndicadores(){
            var arrRecPersonas = self.gpPersonas.getSelectionModel().getSelections();
            var win = new Ext.PVD.Evaluaciones.Analisis.PerfilIndicadores({
                labels: labels,
                personas: arrRecPersonas,
                idplanilla: self.procesoEval.get('idplanilla')
            });
            win.show();
            win.maximize();
            win.on('close', function(cmp){
                self.btnPerfil.focus();
            });
        }

        function AplicarModelo(){
            var idmodelo = self.cbModelos.getValue();
            PVD.mostrarMascara('aplicmodelo', self.labels.lbMsgWait, self.labels.lbMsgAplicModelMat);
            Ext.Ajax.request({
                url: 'aplicarmodelosmatematicos',
                method: 'POST',
                params: {
                    idmodelo: idmodelo,
                    idpreprocesoevaluativo: self.procesoEval.get('idpreprocesoevaluativo')
                },
                callback : function(options, success, response) {
                    var result = Ext.util.JSON.decode(response.responseText);
                    self.stResultados.loadData(result);
                    PVD.ocultarMascara('aplicmodelo');
                    self.btnAplicarModelo.focus();
                }
            });
        }

        function guardarResultadoEval(){
            var records = self.stResultados.getRange();
            var totalRecords = self.stResultados.getCount();
            var arrPersonaEvalResult = new Array();
            var i = 0;
            if(totalRecords > 0){
                while(i<totalRecords){
                    flag = true;
                    var varAux = {
                        idpersonaevaluacion: records[i].get('idpersonaevaluacion'),
                        resultado: records[i].get('resultado')
                    }
                    arrPersonaEvalResult[i++] = varAux;
                }
                PVD.mostrarMascara('aplicmodelo', self.labels.lbMsgWait, self.labels.lbMaskSaveResultEval);
                Ext.Ajax.request({
                    url: 'guardarResultadoEvalModelo',
                    method: 'POST',
                    params: {
                        idmodelo: self.cbModelos.getValue(),
                        idpreprocesoevaluativo: self.procesoEval.get('idpreprocesoevaluativo'),
                        arrPersonaEvalResult: Ext.encode(arrPersonaEvalResult)
                    },
                    callback : function(options, success, response) {
                        var result = Ext.util.JSON.decode(response.responseText);
                        PVD.ocultarMascara('aplicmodelo');
                        if(result.success){
                            Ext.MessageBox.show({
                                title: self.labels.lbInfo,
                                msg: self.labels.lbMsgDataSaved,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function(){
                                    self.btnAplicarModelo.focus();
                                }
                            });
                        }
                    }
                });
            }
        }
    },
    showStatus: function(val){
        if(val == "1"){
            return '<span style="color:blue;">Evaluado</span>';
        }else if(val == "2"){
            return '<span style="color:green;">No evaluado</span>';
        }
        else if(val == "3"){
            return '<span style="color:brown;">En reclamaci&oacute;n</span>';
        }
        return '<span style="color:red;">Vac&oacute;o</span>';
    }

});
