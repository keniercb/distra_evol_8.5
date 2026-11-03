/**
 * Interfaz para evaluar los recursos*
 *
 * @author Tte. Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */

Ext.ns('Ext.PVD.Evaluaciones.Evaluar');
Ext.PVD.Evaluaciones.Evaluar.WinEvaluarXProcesoEvalrec = Ext.extend(Ext.Window, {
    layout: 'border',
    initComponent: function () {
        var self = this;

        this.title = 'Reclamaciones en el periodo: ' + this.procesoEval.get('denominacion');
          
        this.btnResponder = new Ext.Button({
        id: 'responder',
        text: "Responder reclamaci&oacuten",
        tooltip: "Responder reclamaci&oacuten",
        disabled: true,
        iconCls: 'modificar',
        handler: function () {
		
            var objWinResponder = new Ext.components.Evaluaciones.WinResponder({
                labels: labels,
                title: 'Responder Reclamaci&oacuten',
				store: self.sm.getSelected().store,
				idreclamacion: self.sm.getSelected().get('idreclamacion'),
                idpersona: self.sm.getSelected().get('idpersona'),
                idpersonaevaluacion: self.sm.getSelected().get('idpersonaevaluacion'),
				idpersonaevaluador: self.sm.getSelected().get('idpersonaevaluador')                
            });
			objWinResponder.show();
                //objWinResponder.maximize();
                objWinResponder.on('close', function () {
                    self.cmpEvaluados.getSelectionModel().clearSelections();
                }, this);
         }
    });		  

         
        this.btnImprimir = new Ext.Toolbar.MenuButton({
            text: 'Imprimir',
            tooltip: 'Imprimir evaluaci&oacuten',
            iconCls: 'imprimir',           
            /*menu: {
                items: [
                    {
                        text: 'Imprimir las personas seleccionas en la reclamaci&oacuten',//this.labels.lbBtnPrintSelectedPersona,
                        iconCls: 'imprimir',
                        id: 'menuImprimir',
                        handler: function () {
                            var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();                            
                            var arrIdPers = new Array();
                            Ext.each(arrRec, function (procesoEval) {
                                if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                                    arrIdPers.push(procesoEval.get('idpersona'));
                                }
                            });
                            if (arrIdPers.length > 0) {
                                imprimirEvaluados(arrIdPers);
                            } else {
                                mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                            }
                        }
                    }
                ]
            },*/
            handler: function () {
				var arrRec = self.cmpEvaluados.getSelectionModel().getSelections();                            
                            var arrIdPers = new Array();
                            Ext.each(arrRec, function (procesoEval) {
                                if (procesoEval.get('estado') == 1 || procesoEval.get('estado') == 2) {
                                    arrIdPers.push(procesoEval.get('idpersona'));
                                }
                            });
                            if (arrIdPers.length > 0) {
                                imprimirEvaluados(arrIdPers);
                            } else {
                                mostrarMensaje(3, 'Solo se pueden imprimir la evaluaciones de las personas con estado de <b>Evaluado</b> o <b>En reclamaci&oacute;n</b>');
                            }
               // imprimirEvaluados();
            }
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaReclamacion',
            text: labels.lbBtnAyuda,
            tooltip: labels.ttpBtnAyuda,
            iconCls: 'ayuda',
            handler: function () {
                var title = 'Ayuda del sistema de evaluaciones';
                var referencia = 'evaluaciones/evaluar';
                help.show(title, referencia);
            }
        });

        
		 		
        this.stEvaluados = new Ext.data.Store({
            autoLoad: true,
            remoteSort: true,
            url: 'getEvaluadosPE',
            listeners: {
                beforeexpandnode: function (st, record) {
                    st.baseParams.idpersonaevaluador = record.get('idpersona');
                },
                beforeload: function (st, options) {
                    st.baseParams.idperiodoproceso = self.idperiodo;
                    //Validacion para que no expanda los nodos hijos
                    if (st.active_node && st.active_node.data._is_leaf) {
                        return false;
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                    id: 'idpersona',
                    root: 'datos',
                    total: 'cantidad',
                    successProperty: 'success'
                },
                [
                    {
                        name: 'idpersona'
                    },
                    {
                        name: 'idpersonaevaluacion'
                    },
                    {
                        name: 'numid'
                    },
                    {
                        name: 'sexo'
                    },
                    {
                        name: 'nombrecompleto'
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
                        name: 'foto'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: '_parent'
                    },
                    {
                        name: '_is_leaf'
                    },
                    {
                        name: 'deacuerdo'
                    },
                    {
                        name: 'hareclamado'
                    },
                    {
                        name: 'opinionevaluado'
                    },
                    {
                        name: 'idcausanoevaluado'
                    },
                    {
                        name: 'fechaevaluado'
                    },
                    {
                        name: 'valor'
                    },
                    {
                        name: 'idestadodesarrollo'
                    },
                    {
                        name: 'estadodesarrollo'
                    },
                    {
                        name: 'colorestadodes'
                    },
                    {
                        name: 'idescala'
                    },
                    {
                        name: 'idplanilla'
                    },
                    {
                        name: 'idmodelo'
                    },
                    {
                        name: 'idpersonaevaluador'
                    },
                    {
                        name: 'cargo'
                    }
                    ,
                    {
                        name: 'fecha'
                    },
                    {
                        name: 'tiemporespuesta'
                    },
                    {
                        name: 'tiemporeclamacion'
                    },
                    {
                        name: 'procede'
                    }
                    ,
                    {
                        name: 'respuesta'
                    },
					{
                        name: 'opinion'
                    }
					,
					{
                        name: 'idreclamacion'
                    }
                ]
            )
        });

         // row expander
        this.expander = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Reclamaci&oacuten:</b> {opinion}</p><br>',
            '<p><b>Respuesta:</b> {respuesta}</p>'
        )
    });
		
		 this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
			
		this.cmpEvaluados = new Ext.grid.GridPanel({
            region: 'center',
            margins: '5 5 5 5',
            autoExpandColumn: 'cargo' + self.id,
            master_column_id: 'nombrecompleto' + self.id,
            title: 'Listado de reclamaciones',
            root_title: 'Reclamaciones',
            stripeRows: true,
			plugins: self.expander,
            viewConfig: {
                forcefit: true
            },
            loadMask: {
                msg: 'Cargando...'
            },
            sm:self.sm,
            store: this.stEvaluados,
            columns: [self.expander,
                
                {
                    header: 'No. identidad',
                    tooltip: 'No. de identidad de la persona',
                    width: 110,
                    dataIndex: 'numid'
                },{
                    id: 'nombrecompleto' + self.id,
                    header: 'Nombre',
                    tooltip: 'Nombre de la persona',
                    width: 250,
                    dataIndex: 'nombrecompleto',
                    renderer: this.showName
                },
				
                {
                    header: 'Sexo',
                    tooltip: 'Sexo de la persona',
                    width: 40,
                    dataIndex: 'sexo',
                    renderer: this.showSexo
                },
                {
                    id: 'cargo' + self.id,
                    header: 'Cargo',
                    tooltip: 'Cargo actual de la persona',
                    width: 60,
                    dataIndex: 'cargo'
                },
                {
                    header: 'Evaluación',
                    tooltip: 'Resultado de la evaluación',
                    width: 150,
                    dataIndex: 'valor',
                    renderer: this.showEvalColor
                },
                {
                    header: 'Fecha Rec',
                    tooltip: 'Fecha reclamaci&oacuten',
                    width: 100,
                    dataIndex: 'fecha'
                  
                }
                ,
                {
                    header: 'Tiempo Resp',
                    tooltip: 'Tiempo respuesta',
                    width: 120,
                    dataIndex: 'tiemporespuesta',
                    renderer: this.showRespuesta
                },
                {
                    header: 'Procede',
                    tooltip: 'Procede la reclamaci&oacuten',
                    width: 100,
                    dataIndex: 'procede',
                    renderer: this.showProcede
                }/*,
                {
                    header: 'Respuesta',
                    tooltip: 'Respuesta de la reclamacion',
                    width: 80,
                    dataIndex: 'respuesta',
                   // renderer: this.showEvalColor
                }*/
            ]
        });

        
        var qtip = null;

        this.cmpEvaluados.on('mouseover', function (e) {
            var t = e.getTarget();
            var v = this.getView();
            var rowIndex = v.findRowIndex(t);

            if (rowIndex !== false) {
                var rec = this.getStore().getAt(rowIndex);
                
                var imgSexo = "<div class='" + (rec.get('sexo') == 1 ? 'male' : 'female') + "' style='width: 16px; height: 16px;'></div>";

                var srcImg = 'data:image/png;base64,' + rec.get('foto');
                var html = '<table width="90%" border="0" cellspacing="0" cellpadding="1" style="text-align: center;' +
                    ' font-size: 11px">' + '<tr>' + '<td>' + '<table width="100%" border="0" cellspacing="0" cellpadding="4">' + '<tr>' + '<td width="10%" style="text-align: center; ' +
                    'vertical-align: top">' + '<img src="' + srcImg + '" width="70" height="70" border="0" style="padding-right: 4px;padding-bottom: 3px">' + '</td>' + '<td style="vertical-align: top;' +
                    ' font: normal 11.5px arial, tahoma, helvetica, sans-serif;"><b>' + rec.get('nombrecompleto') + '</b><br /><b>' + 'Sexo:</b> ' + imgSexo + '</br>' + '<b>' + 'Evaluación:</b> ' + (rec.get('valor') || '') + '</br>' +
                    '</td>' + '</tr>' + '</table>' + '</td>' + '</tr></table>';

               
                qtip = new Ext.ToolTip({
                    target: t,
                    autoWidth: true,
                    maxWidth: 800,
                    minWidth: 500,
                    html: html,
                    trackMouse: true
                });
                
            }
        }, this.cmpEvaluados);

		
        this.cmpEvaluados.getSelectionModel().on('selectionchange', function (sm) {            
            if (sm.hasSelection()) {
              self.btnResponder.enable();
            } else {
               self.btnResponder.disable();
            }
        }, this);
		
		
        this.tbar = [this.btnResponder, this.btnImprimir, '->', this.btnAyuda];
        this.items = [this.cmpEvaluados];
        Ext.PVD.Evaluaciones.Evaluar.WinEvaluarXProcesoEvalrec.superclass.initComponent.call(this);

        
        function imprimirEvaluados(pArrIdPers) {
            var arrIdPers = pArrIdPers ? pArrIdPers : new Array();
            
            var params = Ext.urlEncode({
                idperiodoproceso: self.procesoEval.get('idperiodoproceso'),
                idpreprocesoevaluativo: self.procesoEval.get('_parent'),
                fechainicio: self.procesoEval.data.fechainicio,
                fechafin: self.procesoEval.data.fechafin,
                arridpersona: Ext.encode(arrIdPers)
            });

            var idIframeResolucion = Ext.id();
            new Ext.Window({
                title: 'Evaluación',
                width: 800,
                height: 500,
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframeResolucion,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/printEval?' + params
                    }
                }
            }).show();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando la evaluación en formato PDF.');
            document.getElementById(idIframeResolucion).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

     },     
    showName: function (val, meta, record) {

        return "<div class='user' style='width: 16px; height: 16px;'><p style='margin-left: 20px; margin-top: 2px;'>" +
        val + "</p></div>";
    },
    showSexo: function (value, meta, record) {
        var icon = value == 1 ? 'male' : 'female';
        return "<div class='" + icon + "' style='width: 16px; height: 16px;'></div>";
    },
    showStatus: function (val) {
        if (val == '1') {
            return '<span style="color:green;">Evaluado</span>';
        }
        else if (val == '2') {
            return '<span style="color:brown;">En reclamaci&oacute;n</span>';
        }
        else if (val == '3') {
            return '<span style="color:blue;">No evaluado</span>';
        }
        return '<span style="color:red;">Por evaluar</span>';
    },
    showEvalColor: function (val, m, record) {
        if (val) {
            if (record.get('color')) {
                return '<span style="color:' + record.get('color') + '"><b>' + val + '</b></span>';
            }
            return '<b>' + val + '<b>';
        } else {
            return '';
        }
    },
    showProcede: function (val) {      
           if(val=='0')
        return '<span style="color:green;">En espera</span>';
          if(val=='1')
        return '<span style="color:blue;">Procede</span>';
        if(val=='2')
        return '<span style="color:red;">No Procede</span>';
    },
     showRespuesta: function (val,m,record) {
        var tiempoactual = new Date();		
           if(tiempoactual<record.data.tiemporespuesta){
			   var tiempo=record.data.tiemporespuesta-tiempoactual;
        return '<span style="color:black;"><b>'+'Quedan ' + tiempo +' dias'+'</b></span>';
	       }
	       if(tiempoactual=record.data.tiemporespuesta){			   
        return '<span style="color:blue;"><b>'+'Ultimo dia'+'</b></span>';
	       }
	       if(tiempoactual>record.data.tiemporespuesta){
			   var tiempo=record.data.tiemporeclamacion-record.data.tiemporespuesta;
        return '<span style="color:red;"><b>'+'Atrasada '+tiempo+' dias'+'</b></span>';
	       }
    },
    showProcedet: function (val,m,record) {		    
       return '<span style="color:blue;"><b>'+record.data.tiemporeclamacion+' dias'+'</b></span>';
    },
    showEstadoDesarrollo: function (val, m, record) {
        if (val) {
            if (record.get('colorestadodes')) {
                return '<span style="color:' + record.get('colorestadodes') + '"><b>' + val + '</b></span>';
            }
            return '<b>' + val + '<b>';
        } else {
            return '';
        }
    }

});

