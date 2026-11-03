Ext.ns('Pvd.Evaluaciones');
Ext.QuickTips.init();
Pvd.Evaluaciones.cmpGpListPersona = new Ext.extend(Ext.grid.GridPanel, {
    iconCls: 'icon-grid',
    autoscroll: true,    
    initComponent: function () {
        this.loadMask = {msg: 'Cargando...'};
        var self = this;
		
        this.store = new Ext.data.Store({
            url: this.url,
            baseParams: this.params,
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
            }, [
                {name: 'idpersona'},
                {name: 'foto'},				
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},				
                {name: 'evaluacion'},				
                {name: 'color'}
            ])
        });
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: {
                    fn: function (sm) {
                        if (sm.hasSelection()) {
                            Ext.getCmp('menuImprimir').enable();
                            var selectedRec = sm.getSelections();
                            if (selectedRec.length > 1) {
                                Ext.getCmp('menuImprimir').setText('Imprimir la evaluaci&oacute;n de las personas seleccionadas');
                            }
                            else {
                                Ext.getCmp('menuImprimir').setText('Imprimir la evaluaci&oacute;n de la persona seleccionada');
                            }
                        } else {
                            Ext.getCmp('menuImprimir').disable();
                        }
                    }
                }
            }

        });
        this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            this.sm,
            { header: 'Foto', dataIndex: 'foto', sortable: false, renderer: this.showFoto, width: 75},
            //{ header: 'No. identidad', dataIndex: 'numid', sortable: true},							
            { header: 'Nombre', dataIndex: 'nombre', sortable: true},
            { header: 'Segundo nombre', dataIndex: 'snombre', sortable: true},
            { header: '1er Apellido', dataIndex: 'papel', sortable: true},
            { header: '2do Apellido', dataIndex: 'sapel', sortable: true},
            { header: 'Evaluación', dataIndex: 'evaluacion', sortable: true, renderer: color}			
        ]);

        function color(val, metadata, record) {
            if(val){
                if (record.get('color')) {
                    return "<div style='height:15px;color:" + record.get('color') + "'><b>" + val + "</b></div>";
                }
                return  "<b>" + val + "</b>";
            }else{
                return '';
            }
        };        
		
        this.tfBuscar = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });
		
		
        this.btnVerEvaluacion = new Ext.Button({
            id: this.id + 'btnVerEvaluacion',
            text: 'Ver evaluaci&oacute;n',
            tooltip: 'Ver evaluaci&oacute;n',
            iconCls: 'ver',
            handler: this.verEvaluacion
        });

        this.btnExportar = new Ext.Button({
            id: this.id + 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar',
            handler: function () {				
                var win = new Ext.components.winReporte({
                    params: {
                        url: 'obtenerReporte',
                        tiporeporte: 'listpersona',
                        columns: this.getHeader(),
                        params: this.params
                    }
                });
                win.show();
            }.createDelegate(this)
        });
		
		this.btnReportar = new Ext.Button({
            id: this.id + 'btnExportar',
            text: 'Reporte',
            tooltip: 'Reporte',
            iconCls: 'exportar',
            handler: function () {
			window.open('http://' + window.location.host + '/pvd/evaluaciones/procesoevaluativo/index.php/resumenprocesoevaluativo/obtenerReporteP?params=' +
            Ext.encode(self.params) +
            '&idestructuranodo=' + self.params.idestructuranodo +
            '&idperiodoproceso=' + self.params.idperiodoproceso +
            '&idestadodesarrollo=' + self.params.idestadodesarrollo +
		    '&nocolumna=' + self.params.nocolumna +
            '&valorinicial=' + self.params.valorinicial +
            '&valorfinal=' + self.params.valorfinal +
			'&query=' + self.params.query +
            '&tiporeporte=' + 'listpersona');
                /*var win = new Ext.components.winReporte({
                    params: {
                        url: 'obtenerReporteP',
                        tiporeporte: 'listpersona',
                        columns: this.getHeader(),
                        params: this.params
                    }
                });
                win.show();
            }.createDelegate(this)*/
		}
        });
        
        this.btnImprimir = new Ext.Toolbar.MenuButton({
            text: 'Imprimir',
            tooltip: 'Imprimir la evaluaci&oacute;n de todas las personas',
            iconCls: 'imprimir',
            menu: {
                items: [
                {
                    text: 'Imprimir la evaluaci&oacute;n de las personas seleccionadas',
                    iconCls: 'imprimir',
                    id: 'menuImprimir',
                    //disabled: self.getSelectionModel().getSelections() > 0 ? false : true,
                    handler: function () {
                        var arrRec = self.getSelectionModel().getSelections();
                        var arrIdPers = new Array();
                        Ext.each(arrRec, function (rec) {
                            arrIdPers.push(rec.get('idpersona'));
                        });
                        self.imprimirPersonas(arrIdPers);
                    }
                }
            ]
            },
            handler: function () {
                var arrRec = self.getStore().data.items;
                var arrIdPers = new Array();
                for (var i = 0; i < arrRec.length; i++) {
                    arrIdPers.push(arrRec[i].data.idpersona);
                }
                self.imprimirPersonas(arrIdPers);
            }
        });

        this.tbar = [this.btnExportar,this.btnReportar,this.btnImprimir , this.tfBuscar];//this.btnVerEvaluacion,

        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            pageSize: 15
        });
        Pvd.Evaluaciones.cmpGpListPersona.superclass.initComponent.call(this);
        this.on('render', function () {
            this.store.load({
                params: {
                    limit: 15,
                    start: 0
                }
            });
        }, this);
    },

    /*imprimirPersonas: function (pArrIdPers) {
        var arrIdPers = pArrIdPers ? pArrIdPers : new Array();
        PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte de evaluaciones');
        var iframe = document.createElement("iframe");

        iframe.src = document.location.protocol + '//' + document.location.host +
            '/pvd/evaluaciones/procesoevaluativo/index.php/resumenprocesoevaluativo/printEval?idperiodoproceso=' +
            this.params.idperiodoproceso +
            '&idestructura=' + this.params.idestructuranodo +
            '&fechainicio=' + this.params.fechainicio +
            '&fechafin=' + this.params.fechafin +
            '&arridpersona=' + Ext.encode(arrIdPers);

        iframe.style.display = 'none';
        iframe.onload = function () {
            PVD.ocultarMascara('rep01');
        }
        document.body.appendChild(iframe);
    },*/

   imprimirPersonas: function (pArrIdPers)
    {

    var arrIdPers = pArrIdPers ? pArrIdPers : new Array();
    var params = Ext.urlEncode({
        idperiodoproceso: this.params.idperiodoproceso,
        idestructura : this.params.idestructuranodo,
        fechainicio: this.params.fechainicio,
        fechafin: this.params.fechafin,
        arridpersona: Ext.encode(arrIdPers)
    });

    var idIframeResolucion = Ext.id();
    new Ext.Window({
        title: 'Resumen',
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
                    '/pvd/evaluaciones/procesoevaluativo/index.php/resumenprocesoevaluativo/printEval?' + params
            }
        }
    }).show();
    PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando la evaluación en formato PDF.');
    document.getElementById(idIframeResolucion).onload = function () {
        PVD.ocultarMascara('rep01');
    }
},

    showFoto: function (val, meta, record) {
		
                var srcImg = 'data:image/png;base64,' + record.get('foto');
                return html = '<table width="90%" border="0" cellspacing="0" cellpadding="1" style="text-align: center;' +
                    ' font-size: 11px">' + '<tr>' + '<td>' + '<table width="100%" border="0" cellspacing="0" cellpadding="4">' + '<tr>' + '<td width="10%" style="text-align: center; ' +
                    'vertical-align: top">' + '<img src="' + srcImg + '" width="70" height="70" border="0" style="padding-right: 4px;padding-bottom: 3px">' + '</td>' + '</tr>' + '</table>' + '</td>' + '</tr></table>';
       
    },
    getHeader: function () {
        var arrHeader = new Array();		
        var cant = this.getColumnModel().getColumnCount();		
        for (var i = 1; i < cant; i++) {
            arrHeader[i] = this.getColumnModel().getColumnHeader(i);
        }
        return arrHeader;
    },

    verEvaluacion: function () {
//        var win = new Ext.PVD.Evaluaciones.Evaluar.WinEvaluarTreeIndicadores({
////            labels: this.labels,
//            procesoEval: this.params.procesoEval,
//            evaluado: this.getSelectionModel().getSelected(),
//            editable: false
//        });
//        win.show();
//        win.maximize();
    }
});
