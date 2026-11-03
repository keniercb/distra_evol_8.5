Ext.ns('Pvd.ControlAsistencia.ParteDiario');
//Vista del componente.
Pvd.ControlAsistencia.ParteDiario.Vista = {

    init: function (idioma, modelo) {

        this.fecha = new Date();
        var scope=this;
        var hora;
        var minutos;
        var segundos;
        hora = this.fecha.getHours();
        minutos = this.fecha.getMinutes();
        segundos = this.fecha.getSeconds();
        this.horareporte = hora + ':' + minutos + ':' + segundos

        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});

        this.fechaBuscar = new Ext.form.DateField({
            id: 'fechabusc',
            name: 'fechabusc',
            labelSeparator: ':',
            format: 'd/m/Y',
            readOnly: true,
            width: 100,
            allowBlank: false,
            maxValue: this.fecha.format('d/m/Y'),
            value: this.fecha.format('d/m/Y'),
            editable:true
        });

         this.filtro = new Ext.form.TextField({
            id: 'filtro',
            name: 'filtro',
            hiddenname: 'filtro',
            emptyText: 'Criterio a buscar...',
             prevTab: 'btnAceptar',
            nextTab: 'fechainicio',
            regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc]*)+$/,
            anchor: '96%',
            allowBlank: true
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscarNominal,
            iconCls: 'buscar'
        });

        this.btnBuscarNominal = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.btnExportarNominal = new  Ext.Button({
            text: idioma.btnExportar,
            tooltip: idioma.lbbtnExportar,
            iconCls: 'exportar'
        });

        this.btnBuscarCausa = new Ext.Button({
            id: 'btnBuscarCausa',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        var _self = this;


        this.btnExportarEstadistico = new Ext.Button({
            text: idioma.btnExportar,
            tooltip: idioma.lbbtnExportar,
            iconCls: 'exportar'
        });

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaPartDiario',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        //panel de estructura
        this.EstructuraTree = new Ext.estructura.panel.PanelEstructura({
            id:'EstructuraTree',
            region: 'north',
            split:true,
            margins: '0 0 0 0',
            border:false,
            //Otros parametros
            inicial : perfil.idestructuracomun,//codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            checker: [3,5]//true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });

        this.treeCausales = new Ext.tree.TreePanel({
            height: 300,
            width : '100%',
            region:'center',
            id:'treeCausales',
            border: false,
            rootVisible:false,
            layout: 'fit',
            animate:true,
            singleExpand:false,
            autoScroll:true,
            root: new Ext.tree.AsyncTreeNode({
                text:'Causas',
                id: 'root'
            })
        });

        function formatDate(value,metaData, record, rowIndex, colIndex, store) {
            if(value){
                    return (value instanceof Date) ? value.format('d/m/Y') : value;
            }else{

            }

        };

        function horas(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                var fh = val.split(' ');
                    if (fh.length > 1) {
                        var horacompleta = fh[1].split(':');
                        return horacompleta[0] + ':' + horacompleta[1];
                    }
                    else {
                        return val;
                    }
            }
            else {

            }
        }

        this.smListado = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando..."});



        this.Listado = new Ext.grid.GridPanel({
            id:'listado',
            title: ' ',
            store: modelo.stListado,
            region: 'center',
            loadMask: {msg: 'Cargando...'},
            width:'60%',
            sm: this.smListado,
            stripeRows: true,
            columns: [//new Ext.grid.RowNumberer(),r: 'idpersona', width :100,hidden:true,hideable:false, dataIndex: 'idpersona'},
                {header: 'Nombres y Apellidos', width: 200, dataIndex: 'nombreapellidos'},
                {header: 'Grado militar, categoría y llamado', width: 200, dataIndex: 'gradocategoriallamado'},
                {header: 'Entidad - UM', width: 150,hidden:false, dataIndex: 'denomentidad'},
                {header: 'Cargo', width: 150,hidden:false, dataIndex: 'denomcargo'},
                {header: 'Fecha', width: 150,hidden:false, dataIndex: 'fecharegistro'},
                {header: 'Causa y lugar de destino',width:150, dataIndex: 'causa'},
                {header: 'Observaciones',width:200, dataIndex: 'observacion'},
            ],
            tbar:['-',this.filtro,'-',this.btnBuscarNominal,this.btnLimpiar,'-',this.btnExportarNominal,'-']
        });

        this.panellistado = new Ext.Panel({
            region: 'center',
            layout:'fit',
            margins: '0 0 0 0',
            items:[this.Listado]
        });

        this.plantilla = new Ext.XTemplate(
            '<div >',
            '<tpl for=".">',
            '<p><center><b>Reporte</b></center></p>',
            '<p><b>Presentes:</b> {presentes}<br/>',
            '<b>Ausentes:</b> {ausentes}</p><br/>',
            '</tpl>',
            '</div>'
        );
        this.plantilla.compile();
        var defecto = {
            presentes:'x',
            ausentes:'y'
        };

        this.panel = new Ext.Panel({
            id: 'panel',
           layout: 'fit',
            frame:true,
            region:'west',
            width:200,
            margins: '0 0 0 0',
            listeners:{
                render:function(){
                    this.plantilla.overwrite(this.panel.body,defecto);
                }.createDelegate(this)
            }
        });



        this.graficanominal = new Ext.components.HighchartPanel({
            id:'graficanominal',
            border : true,
            split:true,
            tbar:['frafica'],
            layout : 'fit',
            chartConfig : {
                chart       : {type : 'pie'},
                title       : {text : 'Reporte de ausencias'},
                plotOptions : {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        showInLegend: true
                    }
                },
                series : [{name : 'Cantidad', data : [['Cargando Datos...', 0]]}]
            }
        });

        this.panelgraficanominal = new Ext.Panel({
            title: 'Gráfica',
            layout:'fit',
            region: 'east',
            width:'30%',
            margins: '0 0 0 0',
            collapsible: true,
            items:[this.graficanominal]
        });


        this.graficaestadistico = new Ext.components.HighchartPanel({
            id:'graficaestadistico',
            border : true,
            split:true,
            tbar:['frafica'],
            layout : 'fit',
            chartConfig : {
                chart       : {type : 'pie'},
                title       : {text : 'Reporte de ausencias'},
                plotOptions : {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        showInLegend: true
                    }
                },
                series : [{name : 'Cantidad', data : [['Cargando Datos...', 0]]}]
            }
        });

        this.panelgraficaestadistico = new Ext.Panel({
            title: 'Gráfica',
            layout:'fit',
            region: 'east',
            width:'28%',
            margins: '0 0 0 0',
            collapsible: true,
            collapsed: true,
            items:[this.graficaestadistico]
        });

        this.panelgrid = new Ext.Panel({
            layout:'fit',
            region: 'center',
            width:'100%',
            heigth:500,
            margins: '0 0 0 0',
            collapsible: false,
        });

        this.btnCerrar = new Ext.Button({
            id:'btnCerrar',
            iconCls:'cerrar',
            text:'Cerrar'
        });

        this.panelCenterNominal = new Ext.Panel({
            region  : 'center',
            border  : false,
            disabled: false,
            layout  : 'border',
            items   : [this.Listado,this.panelgraficanominal]
        });

        this.winReporteNominal = new Ext.Window({
            title:'Reporte Nominal',
            layout:'fit',
            closable:true,
            resizable:false,
            closeAction: 'hide',
            items:[this.panelCenterNominal],
            modal: true,
            buttons: [this.btnCerrar]

        });

        this.panelCenter = new Ext.Panel({
            region  : 'center',
            border  : false,
            disabled: false,
            layout  : 'border',
            items   : [this.panelgrid,this.panelgraficaestadistico],
            tbar:['-','Fecha:',this.fechaBuscar,'-', this.btnBuscar,this.btnExportarEstadistico,'->', this.btnAyuda]
        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            tooltip:idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:idioma.lbBtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:idioma.lbBtnAceptar,
            tooltip:idioma.lbBtnAcep,
            disabled: true
        });



        this.winSelecCausas = new Ext.Window({
            title:'Causales',
            layout:'fit',
            width : 450,
            height : 450,
            closable:true,
            resizable:false,
            closeAction: 'hide',
            modal: true,
            buttons: [this.btnCancelar, this.btnAceptar]

        });

        this.vp = new Ext.Viewport({
            layout:'border',
            items: [{
                region:'west',
                width:'28%',
                margins:'0 0 0 0',
                collapsible: true,
                collapseMode:'mini',
                split:true,
                border:false,
                layout:'border',
                items:[
                    {
                        title:'Estructura',
                        region:'center',
                        layout:'fit',
                        items:[this.EstructuraTree]
                    },
                    {
                        title:idioma.lbCausas,
                        region:'south',
                        layout:'fit',
                        height:250,
                        collapsible:true,
                        items:[this.treeCausales]
                    }
                ]
            },
                this.panelCenter
            ]
        });


    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('partediario', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.ParteDiario.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.ParteDiario.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.ParteDiario.Controlador.init(idioma, vista, modelo);

});