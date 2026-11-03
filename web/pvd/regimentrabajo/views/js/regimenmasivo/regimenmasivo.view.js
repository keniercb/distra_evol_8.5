Ext.ns('Pvd.ControlAsistencia.RegimenMasivo');
//Vista del componente.
Pvd.ControlAsistencia.RegimenMasivo.Vista = {
    
   init: function(idioma, modelo) {
           var self = this;

       this.btnAyuda = new Ext.Button({
           id:'btnAyudaRTDMasivo',
           text: idioma.btnAyuda,
           iconCls:'ayuda',
           disabled: false,
           tooltip:idioma.lbBtnAyuda
       });
	
	      this.estructura = new Ext.estructura.panel.PanelEstructura({
            region: 'center',
            split:true,
              margins: '5 0 5 5',
              cmargins: '5 5 5 5',
              width: '25%',
			//Otros parametros
              inicial : perfil.idestructuracomun // codigo|id, Indica a partir de que estructura debe abrir el arbol
        });
      this.estructura.tree.enableDD = true;

       //textfield para el buscar
       this.tfbuscar = new Ext.form.TextField({
           id:'tfbuscar',
           allowBlank : true,
           emptyText: idioma.lbMsgcriterioBuscar,
           minLength: 3,
           maxLength: 60,
           enableKeyEvents: true,
           maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
           width:150,
           name : 'tfbuscador'
       });

       this.cbregimenbusq = new Ext.form.ComboBox({
           store: modelo.storeRegimenTrabajoBusq,
           fieldLabel: idioma.cbregimen,
           displayField: 'denominacion',
           typeAhead: true,
           mode: 'local',
           width:150,
           enableKeyEvents: true,
           emptyText: 'Seleccione...',
           forceSelection: true,
           triggerAction: 'all',
           selectOnFocus: true,
           valueField: 'idregimentrabajo',
           name: 'idregimentrabajo',
           hiddenname: 'idregimentrabajo'
       });

       this.cbgrupobusq = new Ext.form.ComboBox({
           store: modelo.storeGrupoTrabajoBusq,
           fieldLabel: idioma.cbgrupo,
           displayField: 'denominacion',
           typeAhead: true,
           mode: 'local',
           enableKeyEvents: true,
           emptyText: 'Seleccione...',
           width:150,
           forceSelection: true,
           triggerAction: 'all',
           selectOnFocus: true,
           valueField: 'idgrupodescanso',
           name: 'idgrupodescanso',
           hiddenname: 'idgrupodescanso'
       });

       //Boton para Buscar.
       this.btnBuscar = new Ext.Button({
           id: 'btnBuscar',
           text: idioma.lbBtnBuscar,
           tooltip: idioma.textToolTipBusPersona,
           iconCls: 'buscar'
       });

       //Boton para limpiar.
       this.btnLimpiar = new Ext.Button({
           id: 'btnLimpiar',
           text: idioma.lbBtnLimpiar,
           tooltip: idioma.textToolTipLimpiar,
           iconCls: 'limpiar'
       });

       this.btnEliminar = new Ext.Button({
           id: 'btnEliminar',
           text: 'Eliminar',
           tooltip: 'Eliminar el régimen a la persona',
           iconCls: 'borrar',
           hidden:false,
           disabled: true
       });

       this.agrupador = new Ext.form.ComboBox({
           id:'agrupador',
           store: modelo.storeagrupador,
           displayField:'denominacion',
           valueField:'idagrupador',
           typeAhead: true,
           mode: 'local',
           width:150,
           forceSelection: true,
           triggerAction: 'all',
           emptyText:'Seleccione...',
           selectOnFocus:true,
           value:1,
       });

       this.btnExportar = new Ext.Button({
           id: 'btnExportar',
           text: 'Exportar',
           iconCls: 'exportar'
       });

       function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
           if(record.get('idregimentrabajo') && record.get('idcargo') == record.get('idcargodrt')){
               return '<span style="color:#278c22;">' + val + '</span>';
           }else
           {
               return val;
           }

       }

       var smPersona = new Ext.grid.CheckboxSelectionModel({
           singleSelect:false,
           listeners: {

           }
       });

	
	this.listado = new Ext.grid.GridPanel({
            id:'listadoPersonas123',
            store: modelo.fuenteDatosListado,
			loadMask: {msg: idioma.lbMsgmasklistado},
			sm: smPersona,
            stripeRows: true,
            viewConfig: {
                forceFit: true,
                getRowClass: function (rec, ind) {
                }
            },
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                enableGroupingMenu:false,
                enableNoGroups:false,
                showGroupName:false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
			height: 527,
            columns: [smPersona,
                {header: 'idpersona', width:100,hidden:true, dataIndex: 'idpersona',id:'idpersona'},
                {header: 'Nombre y apellidos',  width:200, dataIndex: 'nombreapellidos', renderer: ActivarColores},
                {header: 'Cargo', width:250, dataIndex: 'denomcargo', renderer: ActivarColores},
                {header: 'Área', width:250,hidden:true, dataIndex: 'denomentidadarea'},
                {header: 'idregimentrabajo', width:100,hidden:true, dataIndex: 'idregimentrabajo'},
                {header: 'Régimen de trabajo',  width:200, dataIndex: 'regimentrabajo', renderer: ActivarColores},
                {header: 'idgrupodescanso', width:100,hidden:true, dataIndex: 'idgrupodescanso'},
                {header: 'Grupo de trabajo',  width:200, dataIndex: 'grupotrabajo', renderer: ActivarColores},
                {header: 'Fecha inicio',  width:200, dataIndex: 'fdesdert', renderer: ActivarColores},
                {header: 'idcargo',  width:200,hidden:true, dataIndex: 'idcargo', renderer: ActivarColores},
                {header: 'path', width: 110, hidden:true,dataIndex: 'path'},
                {header: 'orden', width: 110, hidden:true,dataIndex: 'orden'},
                {header: 'ordencargo', width: 110, hidden:true,dataIndex: 'ordencargo'},
                {header: 'agrupador',width:150,hidden:true, dataIndex: 'agrupador'}
            ],
        tbar: [
            this.tfbuscar, '', 'Régimen:',this.cbregimenbusq, '','Grupo:', this.cbgrupobusq, '',
            this.btnBuscar,
            this.btnLimpiar,'-', this.btnEliminar,'-',this.btnExportar,'-','->',
            this.btnAyuda
        ]
        });

       this.cbregimen = new Ext.form.ComboBox({
           store: modelo.storeRegimenTrabajo,
           fieldLabel: idioma.cbregimen,
           displayField:'denominacion',
           blankText: idioma.lbCampoVacio,
           allowBlank : false,
           typeAhead: true,
           mode: 'local',
           anchor: '70%',
           enableKeyEvents:true,
           emptyText: 'Seleccione...',
           forceSelection: true,
           triggerAction: 'all',
           selectOnFocus:true,
           valueField:'idregimentrabajo',
           name:'idregimentrabajo',
           hiddenname:'idregimentrabajo'
       });

       this.cbgrupo = new Ext.form.ComboBox({
           store: modelo.storeGrupoTrabajo,
           fieldLabel: idioma.cbgrupo,
           displayField:'denominacion',
           blankText: idioma.lbCampoVacio,
           allowBlank : false,
           typeAhead: true,
           mode: 'local',
           enableKeyEvents:true,
           emptyText: 'Seleccione...',
           anchor: '70%',
           forceSelection: true,
           triggerAction: 'all',
           selectOnFocus:true,
           valueField:'idgrupodescanso',
           name:'idgrupodescanso',
           hiddenname:'idgrupodescanso'
       });

       this.cbturno = new Ext.form.ComboBox({
           store: modelo.storeTurnoTrabajo,
           fieldLabel: idioma.cbturno,
           displayField:'denominacion',
           blankText: idioma.lbCampoVacio,
           allowBlank : false,
           typeAhead: true,
           mode: 'local',
           enableKeyEvents:true,
           emptyText: 'Seleccione...',
           anchor: '70%',
           forceSelection: true,
           triggerAction: 'all',
           selectOnFocus:true,
           valueField:'idturnotrabajo',
           name:'idturnotrabajo',
           hiddenname:'idturnotrabajo'

       });

       var fecha = new Date();
      // var date = new Date();
      // if(date.format('d/m/Y') <= '15/'+date.format('m')+'/'+date.format('Y')
        //        && date.format('d/m/Y') >= '01/'+date.format('m')+'/'+date.format('Y')){
        //   var year = (date.format('m') == '01')?date.format('Y')-1:date.format('Y');
       //    var mes = (date.format('m') == '01')?'12':date.format('m')-1;
        //   var minValue = '01/'+mes+'/'+year;
     // }else if(date.format('d/m/Y') >= '15/'+date.format('m')+'/'+date.format('Y')
       //         && date.format('d/m/Y') <= date.getDaysInMonth(date.format('Y'), date.format('m'))+'/'+date.format('m')+'/'+date.format('Y')){
      //     var minValue = '01/'+date.format('m')+'/'+date.format('Y');
      // }

       this.dfFInicio = new Ext.form.DateField({
           id: 'dfFInicio',
           fieldLabel: 'Fecha inicio',
           name: 'fdesde',
           hiddenname:'fdesde',
           value: fecha.format('d/m/Y'),
          // value: date.format('d/m/Y'),
           //minValue: minValue,
           anchor:'70%',
           format:'d/m/Y',
           editable:false,
           readOnly : false,
           enableKeyEvents:true,
           invalidText: idioma.invalidTextFecha,
           vtype:'daterange',
           emptyText: idioma.lbEmptyTextFecha,
           blankText: idioma.lbCampoVacio,
           allowBlank : false,
           listeners:{change: function(tf, n,o){cambio = 1;}}
       });

       this.btnGuardar = new Ext.Button({
           id: 'btnGuardar',
           text: idioma.lbBtnGuardar,
           tooltip: idioma.textToolTipGuardar,
           iconCls: 'guardar'
       });

       this.formularioGestion = new Ext.FormPanel({
           labelAlign: 'top',
           frame:true,
           bodyStyle:'padding:5px 5px 0',
           items: [{
               layout: 'column',
               items: [
                   {
                       columnWidth:0.33,
                       layout: 'form',
                       items: [this.cbregimen]
                   },
                   {
                       columnWidth:0.33,
                       layout: 'form',
                       items: [this.cbgrupo]
                   },
                   {
                       columnWidth:0.33,
                       layout: 'form',
                       items: [this.dfFInicio]
                   }
               ]
           }],
           buttons: [this.btnGuardar]
       });


      this.vp = new Ext.Viewport({
           layout:'border',
           items:[{
                   items:[this.estructura],
                   title:idioma.lbTitPanelEst,
                   region:'west',
                   layout:'fit',
                   width: '25%',
                   collapsible: true,
                   frame:false,
                    border: false,
               },{
                   region: 'center',
                   layout:'border',
                   border: false,
                   items:[{
                       title: idioma.lbTitPanelPersonas,
                       region: 'center',
                       layout:'fit',
                       margins: '0 0 0 0',
                       items:[this.listado]
                   },{
                       region:'south',
                       id:'panelsur',
                       split:true,
                       height: 150,
                       layout:'fit',
                       collapsible: true,
                       collapsed: true,
                       title: idioma.cbregimen,
                       margins: '0 0 0 0',
                       items: this.formularioGestion
                   }]
               }
           ]
       });
}
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('regimenmasivo', function(perfil, idioma){

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.RegimenMasivo.Modelo;
    modelo.init();
	
    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.RegimenMasivo.Vista;
    vista.init(idioma, modelo);
    
    //Inicializar controlador.
    Pvd.ControlAsistencia.RegimenMasivo.Controlador.init(idioma, vista, modelo);
	
});