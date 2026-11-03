Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('aplicarmodelos', cargarInterfaz);

function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];

    var btnSelecPrEva = new Ext.Button({
        id:'btnSelecPrEva',
        text:    labels.lbBtnSelecPE,
        tooltip: labels.ttpBtnSeleccionar,
        iconCls: 'seleccion',
        handler: showWinEvaluados,
        prevTab:'btnAyuda',
        nextTab:'btnBuscar'
    });
   
    var btnAyuda = new Ext.Button({
        id:'btnAyuda',
        text: labels.lbBtnAyuda,
        tooltip: labels.ttBtnAyuda,
        iconCls:'ayuda',
        prevTab:'btnLimpiar',
        nextTab:'btnSelecPrEva',
        handler : function(){
            var title	= 'Ayuda del sistema de evaluaciones';
            var referencia	= 'evaluaciones/aplicarmodelos';
            help.show(title,referencia);
        }
    });

     var btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            id: "btnBuscar",      
            handler: showWinEstructura,
            nextTab: 'btnLimpiar',
            prevTab: 'btnSelecPrEva'
        });
    
    var btnLimpiar = new Ext.Button({
        id:'btnLimpiar',
        text: labels.lbBtnLimpiar,
        tooltip: labels.ttBtnLimpiar,
        iconCls:'limpiar',
        prevTab:'btnBuscar',
        nextTab:'btnAyuda',
        handler : function(){
            self.tfEstructura.reset();
            gpListProces.getStore().baseParams.idestructura = null;
            gpListProces.getStore().load({
                params:{
                    limit:8,
                    start:0
                }
            });
        }
    });

    var gpListProces = new Ext.components.Evaluaciones.gpListProcesEvaluativos({//grid mostrado en la ventana
        region:'center',
        title: labels.lbGpProcesoEval,
        labels: labels,
        pageSize: 8,
        margins: '5 5 5 5',
        width:400,
        height:400,
        listeners: {
            rowdblclick: function(grid, rowIndex, eventObj) {
                showWinEvaluados();
            }
        }
    });

    gpListProces.getStore().on('load', function(st, records, options){
        if(records.length>0){
            gpListProces.getSelectionModel().selectFirstRow();
            btnSelecPrEva.enable();
            btnSelecPrEva.focus();
        }else{
            btnSelecPrEva.disable();
            Ext.MessageBox.show({
                title: labels.lbInfo,
                msg: labels.msgNoData,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO,
                fn: function(){
                    btnLimpiar.focus();
                }
            });
        }
    });
    this.tfEstructura = new Ext.form.TextField({
        emptyText: labels.lbEmptySelectText,
        readOnly:true,
        width:250,
    });
    
    function showWinEstructura(){
        var panelBusEst = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            witdhDenom: 300,
            layout: 'border'
        });
        
        var btnCancelar = new Ext.Button({
            id:'btnCancelar',
            text:    labels.lbBtnCancelar,
            iconCls: 'cancelar',
            prevTab:'btnAceptar',
            nextTab:'btnAceptar',
            handler: function(){
                winPanel.close();
            }
            
        });
        var btnAceptar = new Ext.Button({
            id:'btnAceptar',
            text:    labels.lbBtnAceptar,
            iconCls: 'aceptar',
            nextTab:'btnCancelar',
            prevTab:'btnCancelar',
            handler: function(){
                var node = panelBusEst.getSeleccion();
                winPanel.close();
                self.tfEstructura.setValue(node.text);
                gpListProces.getStore().baseParams.idestructura = node.id;
                gpListProces.getStore().load({
                    params:{
                        limit:8,
                        start:0
                    }
                });
            }
        });
        var winPanel = new Ext.Window({
            title: self.labels.lbBtnWin,
            width:300,
            height:350,
            layout:'fit',
            modal:true,
            items:[panelBusEst],
            buttons:[btnCancelar,btnAceptar]
        });
        winPanel.show();
        panelBusEst.arbol.on('load', function(){
            btnAceptar.focus();
        })      
        winPanel.on('close', function(cmp){
            btnSelecPrEva.focus();
        });
    }
	
    
    var ventana = new Ext.Window({ //ventana para listar los procesos evaluativos
        title: labels.lbBtnVentana,
        tbar:['Entidad:',' ',self.tfEstructura,btnBuscar,btnLimpiar,'->',btnAyuda],
        layout:'border',
        closable:false,
        width: 650,
        height: 450,
        items:[gpListProces],
        buttons: [btnSelecPrEva]
    });
    ventana.show();	
    gpListProces.getStore().load({
        params:{
            limit:8,
            start:0
        }
    });//para cargar el grid

    function showWinEvaluados(){
        var selectedRecord = gpListProces.getSelectionModel().getSelected();
        var win = new Ext.PVD.Evaluaciones.Evaluar.WinAplicarModelos({
            labels: labels,
            title:'Estructura seleccionada: '+self.tfEstructura.getValue(),
            procesoEval: selectedRecord
        });
        win.show();
        win.maximize();
        win.on('close', function(cmp){
            btnSelecPrEva.focus();
        });
    }

};//Fin de CargarInterfaz
