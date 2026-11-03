Ext.ns('Pvd.ControlAsistencia.ReporteDiario');
//Vista del componente.
Pvd.ControlAsistencia.ReporteDiario.Vista = {

    init: function (idioma, modelo) {

        var fech = document.getElementById('fecha').getAttributeNode('value').value;
		this.fecha = new Date(fech.split('/')[2], fech.split('/')[1] - 1, fech.split('/')[0])
        var scope=this;
        var hora;
        var minutos;
        var segundos;
        hora = this.fecha.getHours();
        minutos = this.fecha.getMinutes();
        segundos = this.fecha.getSeconds();
        this.horareporte = hora + ':' + minutos + ':' + segundos

        this.fechaBuscar = new Ext.form.DateField({
            id: 'fecha',
            name: 'fecha',
            labelSeparator: ':',
            format: 'd/m/Y',
            readOnly: true,
            width: 100,
            allowBlank: false,
            maxValue: this.fecha.format('d/m/Y'),
            value: this.fecha.format('d/m/Y')
        });

        this.btnBuscar = new Ext.Button({
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

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: idioma.btnExportar,
            tooltip: idioma.lbbtnExportar,
            iconCls: 'exportar'
        });       

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaPartFecha',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        //panel de estructura
        this.EstructuraTree = new Ext.estructura.panel.PanelEstructura({
            id:'EstructuraTree',
            region: 'center',
            split:true,
            margins: '0 0 0 0',
            border:false,
            //Otros parametros
            inicial : perfil.idestructuracomun,//codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            //checker: true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });

        this.panelestructura = new Ext.Panel({
            items:[this.EstructuraTree],
            title:'Estructura',
            region:'west',
            layout:'fit',
            width: 350,
            collapsible: true,
            frame:false,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0'
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
            store: modelo.stListado,
            loadMask: {msg: 'Cargando...'},
            width:'60%',
            sm: this.smListado,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                groupByText:' ',
                    groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width:100,hidden:true,hideable:false, dataIndex: 'idpersona'},
                {header: 'Causa', hidden:true,width:100, dataIndex: 'causa'},
                {header: 'No. identidad', width: 100, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 200, dataIndex: 'nombreapellidos'},
                {header: 'idarea', width:100,hidden:true,hideable:false, dataIndex: 'idarea'},
                {header: 'Cargo', width: 250, dataIndex: 'denomcargo'},
                {header: 'Área', width: 250, dataIndex: 'denomarea'},
                {
                    header: 'Hora de entrada',
                    width: 100,
                    dataIndex: 'fechahoraentrada',
                    editor: this.horaentrada,
                    renderer: horas
                },
                {
                    header: 'Hora de salida',
                    width: 100,
                    dataIndex: 'fechahorasalida',
                    editor: this.horasalida,
                    renderer: horas
                },
                {header: 'Desde',  width: 100, dataIndex: 'fdesde', editor: this.desde, renderer: formatDate},
                {header: 'Hasta', width: 100, dataIndex: 'fhasta', editor: this.hasta, renderer: formatDate},
                {header: 'fecharegistro', width: 100, dataIndex: 'fecharegistro', hidden: true, hideable: false},
                {header: 'Horas descontadas', width: 110, dataIndex: 'hrsdescontadas'},
                {header: 'Horas extras', width: 100, dataIndex: 'horasextras'}
            ],
            tbar: ['Fecha:',this.fechaBuscar,this.btnBuscar,'','-',this.btnLimpiar,'','-',this.btnExportar,'->',this.btnAyuda

            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stListado,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar"
            })

        }); 

        this.panellistado = new Ext.Panel({
            title: 'Listado de personas',
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



        this.grafica = new Ext.components.HighchartPanel({
            id:'graficaReporteDiario',
            border : true,
            split:true,
            chartType:'column',
            chartDatas:{name:'sin datos',data:[['data',0]]},
            chartTitle:'Gráfica',
            chartCategories:['Causas de ausencia']
        });


        this.panelgrafica = new Ext.Panel({
            title: 'Gráfica',
            layout:'fit',
            region: 'east',
            width:'25%',
            margins: '0 0 0 0',
            collapsible: true,
            collapsed: true,
            items:[this.grafica]
        });

        this.vp = new Ext.Viewport({
            layout   : 'border',
            items:[this.panelestructura, this.panellistado, this.panelgrafica]           
        });


    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('reportediario', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.ReporteDiario.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.ReporteDiario.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.ReporteDiario.Controlador.init(idioma, vista, modelo);

});