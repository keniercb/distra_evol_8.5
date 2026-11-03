Ext.ns('Pvd.ControlAsistencia.DiasFeriadosHabilitados');
//Vista del componente.
Pvd.ControlAsistencia.DiasFeriadosHabilitados.Vista = {
    
   init: function(idioma, modelo) {
           var self = this;

       this.btnAyuda = new Ext.Button({
           id:'btnAyudaRTDMasivo',
           text: idioma.btnAyuda,
           iconCls:'ayuda',
           disabled: false,
           tooltip:idioma.lbBtnAyuda
       });

       /*** GRID LISTADO DE REGIMEN Y GRUPOS DE TRABAJO Y DESCANSO ***/
           //selectionmodel del grid principal
       this.smgridGruposRegimen = new Ext.grid.CheckboxSelectionModel({
           singleSelect:true,
           listeners: {

           }
       });

       //grid de grupos por regimen de trabajo
       this.gridGruposRegimen = new Ext.grid.GridPanel({
           region:'center',
           title:idioma.gpTitle,
           id:'gridGruposRegimen',
           sm: this.smgridGruposRegimen,
           store: modelo.storeGruposRegimen,
           columns: [this.smgridGruposRegimen,
               { header: "idgrupodescanso", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idgrupodescanso'},
               { header: "idregimentrabajo", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idregimentrabajo'},
               { header: "Denominaci&oacute;n", width: 150, menuDisabled:true, dataIndex: 'denominacion'},
               { header: "R&eacute;gimen de trabajo: ",  hidden:true, width: 300, menuDisabled:true, dataIndex: 'denregimentrabajo'},
           ],
           height: 300,
           width: 300,
           view: new Ext.grid.GroupingView({
               forceFit:true,
               groupTextTpl: '{group}'
           }),
           loadMask:{msg :idioma.lbMsgmasklistado}
       });

       //textfield para el buscar
       this.tfbuscar = new Ext.form.TextField({
           id:'tfbuscar',
           allowBlank : true,
           emptyText: idioma.lbMsgcriterioBuscar,
           minLength: 3,
           maxLength: 60,
           enableKeyEvents: true,
           maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
           width:200,
           name : 'tfbuscador'
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

       this.smpersona = new Ext.grid.CheckboxSelectionModel({
           singleSelect:false,
           listeners: {

           }
       });


       this.listado = new Ext.grid.GridPanel({
           id:'listadoPersonas123',
           store: modelo.fuenteDatosListado,
           loadMask: {msg: idioma.lbMsgmasklistado},
           title: 'Listado de personas',
           height: 600,
           disabled:true,
           view     : new Ext.grid.GroupingView({
               forceFit     : true,
               groupTextTpl : '{group}'
           }),
           sm: this.smpersona,
           columns: [ this.smpersona,
               {header: 'No registro', width:200,hidden : true, dataIndex: 'idpersona'},
               {header: 'Cargo', width:200, dataIndex: 'denomcargo'},
               {header: 'Nombre y apellidos',  width:200, dataIndex: 'nombreapellidos'},
               {header: 'Entidad',  width:300,hidden:true, dataIndex: 'entidad'},
               {header: 'Area',  width:300,hidden:true, dataIndex: 'area'}
           ], tbar: [
               this.tfbuscar,'',
               this.btnBuscar,
               this.btnLimpiar,
               '->',this.btnAyuda
           ]
       });

       this.smdiasferiados = new Ext.grid.CheckboxSelectionModel({
           singleSelect:false,
           listeners: {

           }
       });

       //Botón para guardar la configuración
       this.btnHabilitar = new Ext.Button({
           id       : 'btnGuardarDiaFeriado',
           iconCls  : 'habilitar',
           text     : 'Habilitar',
           tooltip  : idioma.textToolTipHabilitar,
           disabled : true
       });

       //Botón para guardar la configuración
       this.btnDesabilitar = new Ext.Button({
           id       : 'btnGuardarDiaFeriado',
           iconCls  : 'deshabilitar',
           text     : 'Deshabilitar',
           tooltip  : idioma.textToolTipDesabilitar,
           disabled : true
       });

       function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
           if(record.get('iddiaferiadohabilitado')!=0){
               return '<span style="color:#008000;">' + val + '</span>';
           }else
           {
               return val;
           }
       }

       this.cbHoras = new Ext.form.TimeField({
           id: 'cbHoras',
           anchor: '60%',
           fieldLabel  : 'Horas',
           name: 'hora',
           hiddenname:'hora',
           emptyText: 'Seleccione...',
           format: 'H:i',
           minValue: '00:00',
           enableKeyEvents: true,
           maxValue: '23:59',
           value:'08:00',
           invalidText: 'El formato de la hora es hora:minutos (24 horas)'
       });

       this.listadodiashabiles = new Ext.grid.EditorGridPanel({
           title: 'Listado de dias feriados',
           height: 400,
           sm: this.smdiasferiados,
           disabled:true,
           store: modelo.storeDiasFeriados,
           loadMask: {msg: idioma.lbMsgmasklistado},
           columns: [this.smdiasferiados,
               {header: 'iddiaferiadohabilitado',  width:200, hidden : true,dataIndex: 'iddiaferiadohabilitado'},
               {header: 'idpersona',  width:200, hidden : true,dataIndex: 'idpersona'},
               {header: 'Fecha',  width:150, dataIndex: 'fecha',renderer: ActivarColores},
               //{header: 'Horas a trabajar',  width:150, dataIndex: 'horas',renderer: ActivarColores, editor:this.cbHoras},
               {header: 'Habilitado',  width:150, dataIndex: 'habilitado',renderer: ActivarColores}
           ],
           tbar:[this.btnHabilitar,this.btnDesabilitar]
       });

      this.vp = new Ext.Viewport({
          layout: 'fit',
          items: [
              {
                  layout:'border',
                  margins:'0 0 0 0',
                 // tbar:[/*this.btnHabilitar,this.btnDesabilitar,*/'->',this.btnAyuda],
                  items:[{
                      items:[this.gridGruposRegimen],
                      region:'west',
                      layout:'fit',
                      width: '30%',
                      collapsible: true,
                      frame:false,
                      border: false,
                  },{
                      region: 'center',
                      layout:'border',
                      border: false,
                      items:[{
                          region: 'center',
                          layout:'fit',
                          margins: '0 0 0 0',
                          items:[this.listado]
                      },{
                          region:'south',
                          id:'panelsur',
                          split:true,
                          height: 250,
                          layout:'fit',
                          collapsible: true,
                          collapsed: false,
                          margins: '0 0 0 0',
                          items: this.listadodiashabiles
                      }]
                   }
                  ]
              }
          ]
       });
}
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('diasferiadoshabilitados', function(perfil, idioma){

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.DiasFeriadosHabilitados.Modelo;
    modelo.init();
	
    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.DiasFeriadosHabilitados.Vista;
    vista.init(idioma, modelo);
    
    //Inicializar controlador.
    Pvd.ControlAsistencia.DiasFeriadosHabilitados.Controlador.init(idioma, vista, modelo);
	
});