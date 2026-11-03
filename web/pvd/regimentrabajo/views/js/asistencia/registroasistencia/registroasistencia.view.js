Ext.ns('Pvd.ControlAsistencia.Registroasistencia');
//Vista del componente.
Pvd.ControlAsistencia.Registroasistencia.Vista = {

    init: function (idioma, modelo) {
        var fech = document.getElementById('fecha').getAttributeNode('value').value;
        this.fecha = new Date(fech.split('/')[2], fech.split('/')[1] - 1, fech.split('/')[0]);
        this.ultimoDia = new Date(this.fecha.getFullYear(),this.fecha.getMonth()+1,0);

        var f = this.fecha.format('d/m/Y');
        var explodeDate = f.split('/');
        this.fech = '01/' + explodeDate[1] + '/' + explodeDate[2];
        var self = this;
		this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});

        this.comboMeses = new Ext.form.ComboBox({
            id:'comboMeses',
            store: modelo.storeMeses,
            displayField:'denominacion',
            valueField:'idmes',
            typeAhead: true,
            mode: 'local',
            width:130,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            value:this.fecha.getMonth()+1
        });

        this.comboYear = new Ext.form.ComboBox({
            id:'comboYear',
            store: modelo.storeYear,
            displayField:'denominacion',
            valueField:'idyear',
            typeAhead: true,
            mode: 'local',
            width:100,
            forceSelection: true,
            triggerAction: 'all',
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:this.fecha.getFullYear()
        });

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
            value:  this.fech,
            invalidText: idioma.invalidTextFecha,
            maxValue: this.fecha.format('d/m/Y'),
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            listeners:{change: function(tf, n,o){
                cambio = 1;
                if(tf.isValid() && self.hasta.isValid() ){
                    self.btnBuscar.enable();
                }else{
                    self.btnBuscar.disable();
                }
            }}
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
            invalidText: idioma.invalidTextFecha,
            value: this.fecha.format('d/m/Y'),
            maxValue: this.fecha.format('d/m/Y'),
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            listeners:{change: function(tf, n,o){
                cambio = 2;
                if(self.desde.isValid() && tf.isValid() ){
                    self.btnBuscar.enable();
                }else{
                    self.btnBuscar.disable();
                }
            }}
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar',
            disabled: true,
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.btnRegistrarEntrada = new Ext.Button({
            id: 'btnRegistrarEntrada',
            text: 'Registrar entrada ',
            tooltip: idioma.lbbtnEntrada,
            //disabled: true,
            iconCls: 'entrada'
        });

        this.btnRegistrarSalida = new Ext.Button({
            id: 'btnRegistrarSalida',
            text: 'Registrar salida',
            tooltip: idioma.lbbtnSalida,
            disabled: true,
            iconCls: 'salida'
        });

        this.clock = new Ext.Toolbar.TextItem('');
        this.clock1 = new Ext.Toolbar.TextItem('');

        this.btnExportar = new Ext.Button({
            text: 'Exportar',
            tooltip: idioma.lbbtnExportar,
            disabled: false,
            iconCls: 'documentos'
        });

        this.btnGrafica = new Ext.Button({
            text: 'Gráfica',
            tooltip: 'Gráficar la asistencia',
            disabled: false,
            iconCls: 'graficar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaAsistencia',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        function formatDate(value, metaData, record, rowIndex, colIndex, store) {
            if (value) {
                if (record.data.finsemana == 1) {
                    meta.css = 'weekend';
                }
                if (record.get('presente') == 0) {
                    return (value instanceof Date) ? '<i><b>' + value.format('d/m/Y') + '</i></b>' : '<i><b>' + value + '</i></b>';
                } else {
                    return (value instanceof Date) ? value.format('d/m/Y') : value;
                }
            } else {
            }
        };

        function horas(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                if (record.data.finsemana == 1) {
                    meta.css = 'weekend';
                }
                var fh = val.split(' ');
                if (record.get('presente') == 0) {
                    if (fh.length > 1) {
                        var horacompleta = fh[1].split(':');
                        return '<i><b>' + horacompleta[0] + ':' + horacompleta[1] + '</b></i>';
                    }
                    else {
                        return '<i><b>' + val + '</b></i>';
                    }
                } else {
                    if (fh.length > 1) {
                        var horacompleta = fh[1].split(':');
                        return horacompleta[0] + ':' + horacompleta[1];
                    }
                    else {
                        return val;
                    }
                }
            }
            else {
            }
        }

        function combo(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                if (record.data.finsemana == 1) {
                    meta.css = 'weekend';
                }
                var valor = "";
                var color = '#ffffff';

                return '<span  style=" color:' + record.data.color + '"><b>' + record.data.causa + '</b></span>';
            }
            else
                return val;
        }

        function  controlador(val, metaData, record, rowIndex, colIndex, store) {
            if (record.data.finsemana == 1) {
                meta.css = 'weekend';
            }
            if (record.data.actualizado == 1) {
                val = 'Control de Acceso';
                return val;
            }else{
                return val;
            }
        }

        function  finSemana(val, metaData, record, rowIndex, colIndex, store) {
            console.info(record.data);
            if (record.data.finsemana == 1) {
                meta.css = 'weekend';
                return val;
            }
        }

        this.smResumen = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.ListadoResumen = new Ext.grid.GridPanel({
            id: 'listadoResumen',
            store: modelo.stListadoResumen,
            title:'Registro de la asistencia',
            loadMask: idioma.lbTitMsgActualizando,
            width: '60%',
            sm: this.smResumen,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                showGroupName:false,
                groupTextTpl: '{text}'
            }),
            columns: [
                {header: 'idpersona', width: 200, hidden: true, hideable: false, dataIndex: 'idpersona'},
                {header: 'Fecha de registro', width: 120, dataIndex: 'fecharegistro', renderer: finSemana},
                {header: 'Mes', width: 100,hidden: true, dataIndex: 'mes'},
                {header: 'Nombre y apellidos', width: 200, hidden: true, hideable: false,dataIndex: 'nombreapellidos'},
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
                {header: 'color', hidden: true, hideable: false, width: 100, dataIndex: 'color'},
                {header: 'Causa', width: 200, dataIndex: 'causa', renderer: combo},
                {header: 'Desde', width: 100, dataIndex: 'fdesde', editor: this.desde, renderer: formatDate},
                {header: 'Hasta', width: 100, dataIndex: 'fhasta', editor: this.hasta, renderer: formatDate},
                {header: 'fecharegistro', width: 100, dataIndex: 'fecharegistro', hidden: true, hideable: false},
                {
                    header: 'Horas descontadas',
                    width: 130,
                    dataIndex: 'hrsdescontadas',
                    renderer: finSemana
                },
                {header: 'Horas extras', width: 100, dataIndex: 'horasextras', renderer: finSemana},
                {header: 'idcontrolador', hidden: true, hideable: false, width: 80, dataIndex: 'idpersonacontrola'},
                {header: 'Controlado por', width: 180, dataIndex: 'personacontrola', renderer: controlador},
                {header: 'idmodifica', hidden: true, hideable: false, width: 80, dataIndex: 'idpersonamodifica'},
                {header: 'Modificada por', width: 180, dataIndex: 'personamodifica', renderer: finSemana},
                {header: 'Observación', width: 180, dataIndex: 'observacion', renderer: finSemana},
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stListadoResumen,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar"
            })
        });

        this.listadoAsistencia = new Ext.Panel({
            id: 'listadoAsistencia',
            layout: 'fit',
            margins: '0 0 0 0',
            tbar: [' Fecha inicio: ', this.desde,'-',' Fecha fin: ',this.hasta,'-', this.btnBuscar,this.btnLimpiar,'-',this.btnExportar,'-',this.btnGrafica,'-','->', this.btnAyuda],

        });

        //////////////////////////////////////////FICHA DE LA  PERSONA////////////////////////

        this.plantillaFoto = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<center><img src="{dirfoto}" height="50%" width="100%" style="border:1px solid 000" /></center><div class="details-info">',
            '</tpl>',
            '</div>'
        );
        this.plantillaFoto.compile();

        this.plantillaDatos = new Ext.XTemplate(
            '<table width="100%" border="0" align="center">',
            '<tr>',
            '<td width="9%" height="25" class="x-form-check-group-label Estilo4">' + 'Nombre y apellidos:' + '</td>',
            '<td width="22%"><span class="Estilo3">&nbsp;&nbsp;{nombreapellidos}</span></td>',

            '<td width="2%" height="25" class="x-form-check-group-label Estilo4">' + 'Cargo:' + '</td>',
            '<td width="29%"><span class="Estilo3">&nbsp;&nbsp;{denomcargo}</span></td>',

            '<td width="9%" height="25" class="x-form-check-group-label Estilo4">' + 'Régimen de trabajo:' + '</td>',
            '<td width="10%"><span class="Estilo3">&nbsp;&nbsp;{regimentrabajo}</span></td>',
            '</tr>',

            '<tr>',
            '<td height="25" class="x-form-check-group-label Estilo4">' + 'No. identificaci&oacute;n:' + '</td>',
            '<td width="370"><span class="Estilo3">&nbsp;&nbsp;{numid} </span></td>',

            '<td height="25" class="x-form-check-group-label Estilo4">' + 'Área:' + '</td>',
            '<td width="370"><span class="Estilo3">&nbsp;&nbsp;{denomarea} </span></td>',

            '<td height="25" class="x-form-check-group-label Estilo4">' + 'Grupo de trabajo:' + '</td>',
            '<td width="370"><span class="Estilo3">&nbsp;&nbsp;{grupodescanso} </span></td>',
            '</tr>',

            '<tr>',
            '<td height="25" class="x-form-check-group-label Estilo4">' + 'Sexo:' + '</td>',
            '<td width="200"><span class="Estilo3">&nbsp;&nbsp;{denomsexo}</span></td>',

            '<td height="25" class="x-form-check-group-label Estilo4">' + 'Entidad:' + '</td>',
            '<td width="200"><span class="Estilo3">&nbsp;&nbsp;{denomentidad}</span></td>',

            '<tr>',
            '<td height="1px" class="Estilo4">&nbsp;</td>',
            '<td>&nbsp;</td>',
            '</tr>',

            '</table>'
        );
        this.plantillaDatos.compile();

        this.pfoto = new Ext.Panel({
            width: '100%',
            height: '100%',
            border: true,
            layout: 'fit',
            frame: true,
            autoShow: true
        });

        this.pDatosPantilla = new Ext.Panel({
            html: '<p class="Estilo3">' + 'Cargando...' + '</p>'
        });

        this.pDatos = new Ext.Panel({
            id: 'panel',
            layout: 'fit',
            title:'Perfil de la persona',
            buttonAlign: 'center',
            margins: '0 0 0 0',
            frame: true,
            items: [{
                layout: 'column',
                border: false,
                items: [{
                    columnWidth: 0.10,
                    id: 'panelfoto',
                    bodyStyle: 'padding: 0px 0px 0px 15px',
                    layout: 'column',
                    height: 201,
                    border: true,
                    frame: false,
                    items: [{
                        layout: 'form',
                        width: '100%',
                        border: false,
                        frame: false,
                        items: [this.pfoto]
                    }]
                },
                    {
                        columnWidth: 0.01,
                        layout: 'form',
                        items: [{xtype: 'panel', height: 140, width: 3}]
                    },
                    {
                        xtype: 'fieldset',
                        id: 'fieldset',
                        columnWidth: .87,
                        bodyStyle: 'padding: 5px 0px 1px 5px',
                        width: '100%',
                        style: '-moz-border-radius:5px',
                        height: 135,
                        layout: 'column',
                        items: [this.pDatosPantilla]
                    }]
            }],
            buttons: [this.btnRegistrarEntrada,this.btnRegistrarSalida],
        });
        //////////////////////////////////////////////////FICHA DE LA PERSONA//////////////////////////////////////

        /////////////////////////////////////////////////GRAFICA//////////////////////////////////////////////////

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
            width:'100%',
            margins: '0 0 0 0',
            listeners:{
                render:function(){
                    this.plantilla.overwrite(this.panel.body,defecto);
                }.createDelegate(this)
            }
        });

        this.grafica = new Ext.components.HighchartPanel({
            id:'grafica',
            border : true,
            split:true,
            chartType:'column',
            chartDatas:{name:'sin datos',data:[['data',0]]},
            chartTitle:'Gráfica',
            chartCategories:['Causas de ausencia']
        });

        ////////////////////////////////////ventana para preguntar accion cuando la persona tiene causa//////////////////////////////////

        this.btnCancelAction = new Ext.Button({
            id: 'btnCancelAction',
            text: 'Cancelar',
            tooltip: 'Cancelar la acción y cerrar la ventana.',
            iconCls: 'cancelar'
        });

        this.btnRegCausa = new Ext.Button({
            id: 'btnRegCausa',
            text: 'Registrar asistencia',
            tooltip: 'Eliminar la causa solamente en el dia de hoy.',
            iconCls: 'eliminar'
        });

        this.btnDelCausa = new Ext.Button({
            id: 'btnDelCausa',
            text: 'Eliminar causa',
            tooltip: 'Eliminar la causa a partir del dia de hoy.',
            iconCls: 'eliminar'
        });


        this.winCambioCausa = new Ext.Window({
            title: 'Atención',
            closable: false,
            defaultButton: 'btnCancelAction',
            width    : 328,
            height   : 120,
            constrain: true,
            modal: true,
            resizable: false,
            closeAction: 'hide',
            plain: true,
            layout: 'fit',
            items: [{
                items:[this.pDatos],
                region:'north',
                layout:'fit',
                height:50,
                frame:true,
                border: false,
                html:'<p class="x-form-check-group-label Estilo4">Usted tiene una causa registrada el dia de hoy, por favor escoja la accion a realizar.</p>'
            }],
            buttons:[
                this.btnCancelAction,this.btnRegCausa,this.btnDelCausa
            ]
        });
        ////////////////////////////////////ventana para preguntar accion cuando la persona tiene causa//////////////////////////////////

        this.wingrafica = new Ext.Window({
            title: 'Gráfica',
            closable: true,
            width    : 800,
            height   : 550,
            constrain: true,
            modal: true,
            closeAction: 'hide',
            plain: true,
            layout: 'fit',
            items: this.grafica
        });
        /////////////////////////////////////////////////GRAFICA//////////////////////////////////////////////////

        this.vp = new Ext.Viewport({
            layout:'border',
            items:[{
                items:[this.pDatos],
                region:'north',
                layout:'fit',
                height:190,
                collapsible: true,
                frame:false,
                border: false,
            },{
                region: 'center',
                layout:'fit',
                border: false,
                items:[this.listadoAsistencia]
            }
            ]
        });


    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('registroasistencia', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.Registroasistencia.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.Registroasistencia.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.Registroasistencia.Controlador.init(idioma, vista, modelo);
});