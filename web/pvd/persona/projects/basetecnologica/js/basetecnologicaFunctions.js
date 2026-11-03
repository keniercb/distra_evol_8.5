Ext.ns("Ext.persona");
/**
 * Componente Es oficial
 */
Ext.persona.cmp113 = {
listeners:{

},
};
/**
 * Componente idfenotipo
 */
Ext.persona.cmp104 = {
listeners:{

},
};
/**
 * Componente idcontacto
 */
Ext.persona.cmp124 = {
listeners:{

},
};
/**
 * Componente idciudadaniap
 */
Ext.persona.cmp879 = {
listeners:{

},
};
/**
 * Componente Fecha
 */
Ext.persona.cmp1025 = {
listeners:{

},
};
/**
 * Componente Fecha de registro
 */
Ext.persona.cmp99 = {
listeners:{

},
};
/**
 * Componente iddatosnacimiento
 */
Ext.persona.cmp131 = {
listeners:{

},
};
/**
 * Componente Número
 */
Ext.persona.cmp93 = {
listeners:{

},
};
/**
 * Componente centrotrabajo
 */
Ext.persona.cmp1192 = {
listeners:{

},
};
/**
 * Componente idprovincia
 */
Ext.persona.cmp111 = {
listeners:{

},
};
/**
 * Componente idmunicipio
 */
Ext.persona.cmp141 = {
listeners:{

},
};
/**
 * Componente Folio
 */
Ext.persona.cmp137 = {
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1213 = {
listeners:{
focus:function(){  
  var date = new Date(Ext.getCmp('1196' + this.idpadre).getValue());
  //Definiedo el valor minimo al campo de fecha fin a partir del campo fecha inicio
  Ext.getCmp('1197'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idpersonamedio
 */
Ext.persona.cmp1214 = {
listeners:{

},
};
/**
 * Componente Fecha fin
 */
Ext.persona.cmp877 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('876' + this.idpadre).getValue());
  Ext.getCmp('877'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idestanciaexterior
 */
Ext.persona.cmp1051 = {
listeners:{

},
};
/**
 * Componente aptoperfil
 */
Ext.persona.cmp1386 = {
listeners:{

},
};
/**
 * Componente Fecha inicio
 */
Ext.persona.cmp881 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('882'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Asignación de medios
 */
Ext.persona.cmp1212 = {
columns:[
  {header: "Medio", width: 180, sortable: true, dataIndex: "dmedio"},
  {header: "Asignación", width: 180, sortable: true, dataIndex: "dasignacion"},  
  {header: "Serie", width: 100, sortable: true, dataIndex: "serie"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},  
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.dmedio = Ext.getCmp("1217" + this.idpadre).getRawValue();
  
  	values.idmedio = Ext.getCmp("1217" + this.idpadre).getValue();
  
  	values.dasignacion = Ext.getCmp("1215" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idpersonamedio)) {
        values.idpersonamedio = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            
            if (rec.get('idmedio') == values.idmedio && rec.get('idasignacion') == values.idasignacion) {
                index = 'duplicado';
                return false;
            }
        });
        switch (index) {
            case 'duplicado':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'Ya se ha registrado un medio con ese tipo de asignación',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
  
  	var records = this.gpGrid.getSelectionModel().getSelections();
   	var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el medio seleccionado?' : 
    '¿Está seguro que quiere eliminar los medios seleccionados?';
  
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {
                     var records = this.gpGrid.getSelectionModel().getSelections();
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idpersonamedio'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.dmedio = Ext.getCmp("1217" + this.idpadre).getRawValue();  
 	
    values.idmedio = Ext.getCmp("1217" + this.idpadre).getValue();  
  	values.dasignacion = Ext.getCmp("1215" + this.idpadre).getRawValue();
	
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idpersonamedio)) {
        values.idpersonamedio = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            
            if (rec.get('idmedio') == values.idmedio && rec.get('idasignacion') == values.idasignacion) {
                index = 'duplicado';
                return false;
            }
        });
        switch (index) {
            case 'duplicado':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'Ya se ha registrado un medio con ese tipo de asignación',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
       
         
      var record;
      
      
      
       Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idpersonamedio') == values.idpersonamedio) {                   
                   record = rec;
                   return false;
                 }
               });
      
       
        switch (index) {             
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                  console.info(values);
                  console.info(error);
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();
  //console.log(record);
//  record.data.dmedio=record.get('dmedio');
  //record.data.idmedio=record.get('idmedio');
  
  this.loadFormulario(record);
  
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
    }, this);
    
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modMediosPersona';
    } else
        if (this.arrDel.length > 0) {
            url = 'delMediosPersona';
        } else {
            url = 'addMediosPersona';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modMediosPersona':
                            msg = 'El(Los) medio(s) se ha(n) modificado satisfactoriamente.';
                            break;
                        case 'delMediosPersona':
                            msg = 'El(Los) medio(s) se ha(n) eliminado satisfactoriamente.';
                            break;
                        case 'addMediosPersona':
                            msg = 'El(Los) medio(s) se ha(n) adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getMediosByPerson",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idpersonamedio"},
          {name: "idasignacion"},
          {name: "idmedio"},
          {name: "dmedio"},
          {name: "dasignacion"},
          {name: "fdesde"},
          {name: "serie"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'fdesde', direction: "ASC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Medios" : "Medio"]})'
},
listeners:{

},
};
/**
 * Componente AFILIACIONES
 */
Ext.persona.cmp1027 = {

};
/**
 * Componente Observación
 */
Ext.persona.cmp1026 = {
listeners:{

},
};
/**
 * Componente Fecha de imposición
 */
Ext.persona.cmp1017 = {
listeners:{
change:function(dt, newDate){
  //Fecha desde
  Ext.getCmp('1018'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente Fecha de eliminado
 */
Ext.persona.cmp100 = {
listeners:{

},
};
/**
 * Componente idprovincia
 */
Ext.persona.cmp140 = {
listeners:{

},
};
/**
 * Componente allegado
 */
Ext.persona.cmp1186 = {
listeners:{

},
};
/**
 * Componente idmunicipio
 */
Ext.persona.cmp112 = {
listeners:{

},
};
/**
 * Componente idestadosalud
 */
Ext.persona.cmp1064 = {
listeners:{

},
};
/**
 * Componente Fecha de rehabilitación
 */
Ext.persona.cmp1018 = {
listeners:{

},
};
/**
 * Componente Afiliaciones
 */
Ext.persona.cmp1039 = {
store:{
  type: "SimpleStore",
    fields: [
      {name: "idafiliacion"},
      {name: "denomorganizacion"},
    ]
},
listeners:{
render:function(cb){
  //Pasando el store del grid de Afiliaciones al combo
	cb.bindStore(Ext.getCmp("1029" + this.idpadre).gpGrid.getStore(), true);
},

},
};
/**
 * Componente idocupaciontiempoguerra
 */
Ext.persona.cmp1204 = {
listeners:{

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1057 = {
listeners:{

},
};
/**
 * Componente idafiliacion
 */
Ext.persona.cmp1030 = {
listeners:{

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1060 = {
listeners:{

},
};
/**
 * Componente Serie
 */
Ext.persona.cmp1007 = {
listeners:{

},
};
/**
 * Componente resumen
 */
Ext.persona.cmp1387 = {
listeners:{

},
};
/**
 * Componente idreclamacion
 */
Ext.persona.cmp1389 = {
listeners:{

},
};
/**
 * Componente idaseop
 */
Ext.persona.cmp1396 = {
listeners:{

},
};
/**
 * Componente idgradomilitar
 */
Ext.persona.cmp781 = {
listeners:{

},
};
/**
 * Componente ididiomap
 */
Ext.persona.cmp885 = {
listeners:{

},
};
/**
 * Componente idcondecoracionp
 */
Ext.persona.cmp1021 = {
listeners:{

},
};
/**
 * Componente RELACIONES EN EL EXTERIOR
 */
Ext.persona.cmp1042 = {

};
/**
 * Componente CONDECORACIONES Y SANCIONES
 */
Ext.persona.cmp1009 = {

};
/**
 * Componente Datos de salud
 */
Ext.persona.cmp1053 = {

};
/**
 * Componente Educación y formación
 */
Ext.persona.cmp1066 = {

};
/**
 * Componente idcategorizacion
 */
Ext.persona.cmp1087 = {
listeners:{

},
};
/**
 * Componente Fecha fin
 */
Ext.persona.cmp96 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('95' + this.idpadre).getValue());
  Ext.getCmp('96'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente conviven
 */
Ext.persona.cmp1187 = {
listeners:{

},
};
/**
 * Componente Fecha fin
 */
Ext.persona.cmp778 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('779' + this.idpadre).getValue());
  Ext.getCmp('778'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Cargo organización
 */
Ext.persona.cmp1037 = {
listeners:{

},
};
/**
 * Componente Segundo nombre
 */
Ext.persona.cmp62 = {
listeners:{

},
};
/**
 * Componente idpersona
 */
Ext.persona.cmp98 = {
listeners:{

},
};
/**
 * Componente idnacionalidadp
 */
Ext.persona.cmp874 = {
listeners:{

},
};
/**
 * Componente idpais
 */
Ext.persona.cmp1227 = {
store:{
  url: "getCountrys",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "contrys"
  },
  mapping: [
    {name: "idpais", mapping:"idpais"},
    {name: "pais", mapping:"nombrepais"}
  ],
  autoLoad:true
},
listeners:{

},
};
/**
 * Componente Fecha fin
 */
Ext.persona.cmp882 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('881' + this.idpadre).getValue());
  Ext.getCmp('882'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idsancionp
 */
Ext.persona.cmp1011 = {
listeners:{

},
};
/**
 * Componente Tipo de organización
 */
Ext.persona.cmp1031 = {
listeners:{
select:function(cb, rec){
  //ComboBox de Organización
  Ext.getCmp('1032'+this.idpadre).setRawValue('');
  Ext.getCmp('1032'+this.idpadre).store.clearFilter();
  Ext.getCmp('1032'+this.idpadre).store.filter('idtipoorganizacion', rec.get('idtipoorganizacion'), true);
},

},
};
/**
 * Componente idcargoorganizacionp
 */
Ext.persona.cmp1036 = {
listeners:{

},
};
/**
 * Componente idafeccion
 */
Ext.persona.cmp1056 = {
listeners:{

},
};
/**
 * Componente Fecha inicio
 */
Ext.persona.cmp779 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('778'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Tipo de categoría
 */
Ext.persona.cmp1088 = {
store:{
  url: "getTipoCategoriaCientificas",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idtipocategoria'},
        	{name: 'denominacion'},
        	{name: 'fdesde'},
        	{name: 'fhasta'},
        	{name: 'descripcion'}         
        ],
          autoLoad:true,
          
},
listeners:{
select:function(cb, rec){
  //ComboBox de Categoria
  Ext.getCmp('1089'+this.idpadre).setRawValue('');
  Ext.getCmp('1089'+this.idpadre).store.clearFilter();
  Ext.getCmp('1089'+this.idpadre).store.filter('idtipocategoria', rec.get('idtipocategoria'), true);
},

},
};
/**
 * Componente idcaracteristicasocial
 */
Ext.persona.cmp1152 = {
listeners:{

},
};
/**
 * Componente iddireccion
 */
Ext.persona.cmp110 = {
listeners:{

},
};
/**
 * Componente Nombre del padre
 */
Ext.persona.cmp134 = {
listeners:{

},
};
/**
 * Componente Anexo
 */
Ext.persona.cmp1006 = {
listeners:{

},
};
/**
 * Componente Fecha de salida
 */
Ext.persona.cmp1046 = {
listeners:{
change:function(dt, newDate){
  //Fecha de regreso
  Ext.getCmp('1047'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente idcategoriapersona
 */
Ext.persona.cmp1251 = {
listeners:{

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1090 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1091'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1091 = {
listeners:{
focus:function(){  
  var date = new Date(Ext.getCmp('1090' + this.idpadre).getValue());
  //Definiedo el valor minimo al campo de fecha fin a partir del campo fecha inicio
  Ext.getCmp('1091'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente serie
 */
Ext.persona.cmp1218 = {
listeners:{

},
};
/**
 * Componente Cargo
 */
Ext.persona.cmp1044 = {
listeners:{

},
};
/**
 * Componente Cargo
 */
Ext.persona.cmp1206 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1219 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1197'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Párrafo
 */
Ext.persona.cmp835 = {
listeners:{

},
};
/**
 * Componente DATOS BASICOS
 */
Ext.persona.cmp57 = {

};
/**
 * Componente idtallaje
 */
Ext.persona.cmp1143 = {
listeners:{

},
};
/**
 * Componente Principal
 */
Ext.persona.cmp1207 = {
listeners:{

},
};
/**
 * Componente Tipo estancia
 */
Ext.persona.cmp1049 = {
listeners:{

},
};
/**
 * Componente idcuentabancaria
 */
Ext.persona.cmp1120 = {
listeners:{

},
};
/**
 * Componente Motivo de sanción
 */
Ext.persona.cmp1016 = {
listeners:{

},
};
/**
 * Componente Estado de salud
 */
Ext.persona.cmp1062 = {
store:{
  type: "SimpleStore",
    fields: [
      {name: "estadosalud"},
      {name: "denomestadosalud"}
    ],
      data: [
        ["0", "Bueno"],
        ["1", "Regular"],
        ["2", "Malo"]
      ]
},
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1208 = {
listeners:{

},
};
/**
 * Componente fechareclamacion
 */
Ext.persona.cmp1391 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1398 = {
listeners:{

},
};
/**
 * Componente Tiempo de sanción
 */
Ext.persona.cmp1014 = {
listeners:{
blur:function(nf){
  if (nf.getValue() != '') {
    //Unidad de tiempo
    //Ext.getCmp('1014' + this.idpadre).markInvalid('Este campo es obligatorio');
    Ext.getCmp('1014' + this.idpadre).allowBlank = false;
    Ext.getCmp('1014' + this.idpadre).validate();
  } else {
    Ext.getCmp('1014' + this.idpadre).allowBlank = true;
    Ext.getCmp('1014' + this.idpadre).reset();
  } 
},

},
};
/**
 * Componente idparentesco
 */
Ext.persona.cmp1185 = {
listeners:{

},
};
/**
 * Componente Grupo sanguíneo
 */
Ext.persona.cmp1008 = {
listeners:{

},
};
/**
 * Componente Unidad tiempo
 */
Ext.persona.cmp1015 = {
store:{
  type: "SimpleStore",
    fields: [
      {name: "id"},
      {name: "unidadtiempo"}
    ],
      data: [
        ["0", "Días"],
        ["1", "Meses"],
        ["1", "Años"]
      ]
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1209 = {
listeners:{

},
};
/**
 * Componente Registro civil
 */
Ext.persona.cmp135 = {
listeners:{

},
};
/**
 * Componente Nivel organización
 */
Ext.persona.cmp1038 = {
listeners:{

},
};
/**
 * Componente Cuenta bancaria
 */
Ext.persona.cmp1119 = {
columns:[  
  {header: "Número de cuenta", width: 180, sortable: true, dataIndex: "numerocuenta"},
  {header: "Tipo de cuenta", width: 180, sortable: true, dataIndex: "denomtipocuentabancaria"},
  {header: "Banco", width: 180, sortable: true, dataIndex: "denombanco"},
  {header: "Moneda", width: 180, sortable: true, dataIndex: "denommoneda"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  
  //Obteniendo la denominacion de Tipo de cuenta seleccionado    
  values.denomtipocuentabancaria = (Ext.getCmp("1121" + this.idpadre)) 
                       ? Ext.getCmp("1121" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion del Banco seleccionado    
  values.denombanco = (Ext.getCmp("1122" + this.idpadre))
                       ? Ext.getCmp("1122" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion de la Moneda seleccionada
  values.denommoneda = (Ext.getCmp("1157" + this.idpadre))
                       ? Ext.getCmp("1157" + this.idpadre).getRawValue()
                                    : '';

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idcuentabancaria)) {//Si es vacio es porke estoy adicionando
    values.idcuentabancaria = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function (rec)
             {
               if(rec.get('numerocuenta') === values.numerocuenta){
                 index = 'cuenta';
                 return false;
               }
             });
    switch (index) {
      case 'cuenta':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La cuenta bancaria que quiere adicionar ya existe.',
          icon: 'warning'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cleanForm();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function(){
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la cuenta bancaria seleccionada?' : 
    '¿Está seguro que quiere eliminar las cuentas bancarias seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
                   {
                     if (btn == 'ok') {

                      
                       Ext.each(records, function (rec)
                                {
                                  if (!rec.data.add) {
                                    this.arrDel.push(rec.get('idcuentabancaria'));
                                  }
                                  this.gpGrid.getStore().remove(rec);
                                }, this);
                       this.gpGrid.getView().refresh();
                     }
                   }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar cuenta bancaria",
        ttBtnMod:"Modificar cuenta bancaria",
        ttBtnDel:"Eliminar cuenta bancaria",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  
  //Obteniendo la denominacion de Tipo de cuenta seleccionado    
  values.denomtipocuentabancaria = (Ext.getCmp("1121" + this.idpadre)) 
                       ? Ext.getCmp("1121" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion del Banco seleccionado    
  values.denombanco = (Ext.getCmp("1122" + this.idpadre)) 
                       ? Ext.getCmp("1122" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion de la Moneda seleccionada
  values.denommoneda = (Ext.getCmp("1157" + this.idpadre))
                       ? Ext.getCmp("1157" + this.idpadre).getRawValue()
                                    : '';
  
  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idcuentabancaria)) {//Si es vacio es porke estoy adicionando
    values.idcuentabancaria = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function (rec)
             {
               if(rec.get('numerocuenta') === values.numerocuenta){
                 index = 'cuenta';
                 return false;
               }
             });
    switch (index) {
      case 'cuenta':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La cuenta bancaria que quiere adicionar ya existe.',
          icon: 'warning'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }else {
    var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec)
             {
               if (rec.get('idcuentabancaria') === values.idcuentabancaria) {
                 record = rec; //Obtengo el record que se va a modificar
               } else
                 if(rec.get('numerocuenta') === values.numerocuenta){
                 index = 'cuenta';
                 return false;
               }
             });
    switch (index) {
      case 'cuenta':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La cuenta bancaria ya existe.',
          icon: 'warning'
        });
        break;
      default :
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
           {
             if (rec.data.add) {//Si es un record que se adiciono nuevo
               this.arrAdd.push(rec.data);
             } else {
               if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                 this.arrMod.push(rec.data);
               }
             }
           }, this);
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modCuentaBancaria';
  } else
    if (this.arrDel.length > 0) {
      url = 'delCuentaBancaria';
    } else {
      url = 'addCuentaBancaria';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg = '';
          switch (url) {
            case 'modCuentaBancaria':
              msg = 'La(s) cuenta(s) bancaria(s) ha(n) sido modificada(s) satisfactoriamente.';
              break;
            case 'delCuentaBancaria':
              msg = 'La(s) cuenta(s) bancaria(s) ha(n) sido eliminado(s) satisfactoriamente.';
              break;
            case 'addCuentaBancaria':
              msg = 'La(s) cuenta(s) bancaria(s) ha(n) sido adicionada(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getCuentaBancaria",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idcuentabancaria"},
          {name: "numerocuenta"},
          {name: "descripcion"},
          {name: "idbanco"},
          {name: "denombanco"},
          {name: "idtipocuentabancaria"},
          {name: "denomtipocuentabancaria"},
          {name: "idmoneda"},
          {name: "denommoneda"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Cuentas" : "Cuenta"]})'
},
listeners:{

},
};
/**
 * Componente Limitación
 */
Ext.persona.cmp1065 = {
listeners:{

},
};
/**
 * Componente Tratamiento
 */
Ext.persona.cmp1058 = {
listeners:{

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp54 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('55'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente idestructura
 */
Ext.persona.cmp66 = {
listeners:{

},
};
/**
 * Componente Moneda
 */
Ext.persona.cmp1157 = {
store:{
  url: "getMonedas",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idmoneda', mapping:'idmoneda', type:'int'},
          {name: 'denominacion', mapping:'nombremoneda', type:'string'},
          {name: 'codigo', mapping:'codigoiso', type:'string'},
          {name: 'idnommonedaentidad', mapping:'idnommonedaentidad', type:'int'}        
        ],
          autoLoad:true,
          
},
tpl:'<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{codigo}</div></tpl>',
listeners:{

},
};
/**
 * Componente idasignacion
 */
Ext.persona.cmp1215 = {
store:{
  url: "getAsignacion",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idasignacion'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1399 = {
listeners:{

},
};
/**
 * Componente idobservacion
 */
Ext.persona.cmp1210 = {
listeners:{

},
};
/**
 * Componente idservtransportacion
 */
Ext.persona.cmp7 = {
listeners:{

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp11 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('10' + this.idpadre).getValue());
  Ext.getCmp('11'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente observacion
 */
Ext.persona.cmp1211 = {
listeners:{

},
};
/**
 * Componente reclamacion
 */
Ext.persona.cmp1394 = {
listeners:{

},
};
/**
 * Componente idservalimentacion
 */
Ext.persona.cmp52 = {
listeners:{

},
};
/**
 * Componente idaseo
 */
Ext.persona.cmp1397 = {
listeners:{

},
};
/**
 * Componente fregistro
 */
Ext.persona.cmp1372 = {
listeners:{

},
};
/**
 * Componente Evento
 */
Ext.persona.cmp53 = {
store:{
  url: "obtenerEventosAlimentacion",
  autoLoad:true,
  type: "Store",
  reader: {
    type: "JsonReader"
  },
  mapping: [
    {name: "idevento"},
    {name: "evento"}
  ]
},
listeners:{

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp55 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('54' + this.idpadre).getValue());
  Ext.getCmp('55'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idservalojamiento
 */
Ext.persona.cmp24 = {
listeners:{

},
};
/**
 * Componente dnemdio
 */
Ext.persona.cmp1217 = {
store:{
  url: "getMedio",
    type: "Store",
       baseParams: {
           value: 1
        },
     reader: {
      type: "JsonReader",          
            root: "data"
      },
        mapping: [
         {name: 'idmedio'},
         {name: 'denominacion'},
         {name: 'fdesde'},
         {name: 'fhasta'},
         {name: 'descripcion'}        
      ],
         autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Peso corporal
 */
Ext.persona.cmp107 = {
listeners:{

},
};
/**
 * Componente nuevaplaza
 */
Ext.persona.cmp1392 = {
listeners:{

},
};
/**
 * Componente Estructura de alimentación
 */
Ext.persona.cmp65 = {
listeners:{

},
};
/**
 * Componente Estatura
 */
Ext.persona.cmp106 = {
listeners:{

},
};
/**
 * Componente Nombre de la madre
 */
Ext.persona.cmp133 = {
listeners:{

},
};
/**
 * Componente Tomo
 */
Ext.persona.cmp136 = {
listeners:{

},
};
/**
 * Componente Fecha fin
 */
Ext.persona.cmp115 = {
listeners:{
focus:function(){  
  var date = new Date(Ext.getCmp('114' + this.idpadre).getValue());
  //Definiedo el valor minimo al campo de fecha fin a partir del campo fecha inicio
  Ext.getCmp('115'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Tipo de cuenta bancaria
 */
Ext.persona.cmp1121 = {
listeners:{

},
};
/**
 * Componente Banco
 */
Ext.persona.cmp1122 = {
store:{
  url: "getBancos",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idbanco'},
          	{name: 'denominacion', mapping:'nombre'},
        	{name: 'codigo'},
        	{name: 'abreviatura'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Número de cuenta
 */
Ext.persona.cmp1123 = {
listeners:{

},
};
/**
 * Componente Viajes al extranjero
 */
Ext.persona.cmp1221 = {
columns:[ 
  {header: "Familiar", width:270, dataIndex: "nombre"},
  {header: "Fecha de salida",width:100, dataIndex: "fdesde"},
  {header: "Pais",width:130, dataIndex: "pais"}, 
   {header: "Parentesco",width:130, dataIndex: "parentesco"}
  
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.nombre = Ext.getCmp("1226" + this.idpadre).getRawValue();
    values.pais = Ext.getCmp("1227" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarviaje)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarviaje = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',                  
                  	msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();  
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
}
,
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el familiar o amigo seleccionado?' : 
    '¿Está seguro que quiere eliminar los familiares o amigos seleccionados?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idfamiliarviaje'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar familar",
        ttBtnMod:"Modificar familar",
        ttBtnDel:"Eliminar familar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
     values.nombre = Ext.getCmp("1226" + this.idpadre).getRawValue();
    values.pais = Ext.getCmp("1227" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarviaje)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarviaje = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('idfamiliarviaje') == values.idfamiliarviaje) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('idfamiliar') == values.idfamiliar) {
                    index = 'idfamiliar';
                }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarFamiliarViaje',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los datos han sido gestionados satisfactoriamente.');
          this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
        } else {
          mostrarMensaje(6, 'Error al procesar los datos.');
        }
      }.createDelegate(this)
    }, this);
  }
},
store:{
  url: "getFamiliarViajeByPesona",
  type: "Store",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idfamiliarviaje"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "idpais"},
    {name: "idfamiliar"},
    {name: "nombre"},
    {name: "pais"},
    {name: "fecha"},
     {name: "idparentesco"},
    {name: "parentesco"}
  ],
  sortInfo:{field: "nombre", direction: "ASC"}
},
listeners:{
render:function(cmp){
	Ext.getCmp('1226'+this.idpadre).store.baseParams.idpersona=Ext.getCmp(this.idpadre).persona.idpersona;
  Ext.getCmp('1226'+this.idpadre).store.load();
},

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1124 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1125'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1125 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1124' + this.idpadre).getValue());
  Ext.getCmp('1125'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp22 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('23'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Estructura política administrativa
 */
Ext.persona.cmp120 = {
clickNode:function(node, e){
  if (node.isLeaf()) {
    var text = node.parentNode.text + '-' + node.text;
    Ext.getCmp('111' + this.idpadre).setValue(node.parentNode.attributes.iddpt);
    Ext.getCmp('112' + this.idpadre).setValue(node.attributes.iddpt);
    this.setValue(text);
    this.collapse();
  }
},
treeConfig:{
  loader: {
    dataUrl: 'getTreeProvMuni',
    baseParams: {}
  },
  border: false,
  autoScroll: true,
  rootVisible: false,
  root: {
    animate: false,
    draggable: false,
    expanded: false
  }
},
listeners:{

},
};
/**
 * Componente Fecha de regreso
 */
Ext.persona.cmp1047 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1046' + this.idpadre).getValue());
  Ext.getCmp('1047'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idsuin
 */
Ext.persona.cmp1160 = {
listeners:{

},
};
/**
 * Componente Servicios
 */
Ext.persona.cmp1 = {

};
/**
 * Componente Motivo de condecoración
 */
Ext.persona.cmp1024 = {
listeners:{

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1040 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('1041'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1041 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1040' + this.idpadre).getValue());
  Ext.getCmp('1041'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Observación
 */
Ext.persona.cmp888 = {
listeners:{

},
};
/**
 * Componente Tipo de misión
 */
Ext.persona.cmp1052 = {
listeners:{
select:function(cb, rec){
  //ComboBox de Mision
  Ext.getCmp('1048'+this.idpadre).setRawValue('');
  Ext.getCmp('1048'+this.idpadre).store.clearFilter();
  Ext.getCmp('1048'+this.idpadre).store.filter('idtipomision', rec.get('idtipomision'), true);
},

},
};
/**
 * Componente Número de identidad
 */
Ext.persona.cmp4 = {
listeners:{
    render: function(field) {
        // always allow only digits
        field.maskRe = /[0-9]/;
        field.regex = /^[0-9]+$/;
        // optionally show a quick hint if non-digit typed
        field.invalidText = 'Solo se permiten números';
    }

},
};
/**
 * Componente idingreso
 */
Ext.persona.cmp1172 = {
listeners:{

},
};
/**
 * Componente idtrayectorialaboral
 */
Ext.persona.cmp1196 = {
listeners:{

},
};
/**
 * Componente idfamiliarviaje
 */
Ext.persona.cmp1225 = {
listeners:{

},
};
/**
 * Componente cuantia
 */
Ext.persona.cmp1175 = {
listeners:{

},
};
/**
 * Componente familiar
 */
Ext.persona.cmp1183 = {
onTrigger2Click:function ()
{
  var buscadorSuin = Ext.getCmp("1181" + this.idpadre).buscadorSuin;
  if (buscadorSuin) {
    buscadorSuin.show();
  }
},
listeners:{
render:function()
{
  this.triggers[0].hide();
},

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1174 = {
store:{
  url: "obtenerFamiliar",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "nombre"}
  ]
},
listeners:{

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1226 = {
store:{
  url: "obtenerFamiliar",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "nombre"}
  ]
},
listeners:{

},
};
/**
 * Componente numid
 */
Ext.persona.cmp1184 = {
listeners:{

},
};
/**
 * Componente Moneda
 */
Ext.persona.cmp1176 = {
store:{
  url: "getMonedas",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: 'idmoneda', mapping:'idmoneda', type:'int'},
    {name: 'denominacion', mapping:'nombremoneda', type:'string'},
    {name: 'codigo', mapping:'codigoiso', type:'string'},
    {name: 'idnommonedaentidad', mapping:'idnommonedaentidad', type:'int'}
  ],
  autoLoad:true
},
tpl:'<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{codigo}</div></tpl>',
listeners:{

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1182 = {
listeners:{

},
};
/**
 * Componente idsiun
 */
Ext.persona.cmp1188 = {
listeners:{

},
};
/**
 * Componente Principal
 */
Ext.persona.cmp94 = {
listeners:{

},
};
/**
 * Componente iddocidentidad
 */
Ext.persona.cmp97 = {
listeners:{

},
};
/**
 * Componente Color de la piel
 */
Ext.persona.cmp105 = {
listeners:{

},
};
/**
 * Componente Cargo
 */
Ext.persona.cmp1198 = {
listeners:{

},
};
/**
 * Componente idpais
 */
Ext.persona.cmp1239 = {
store:{
  url: "getCountrys",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "contrys"
  },
  mapping: [
    {name: "idpais", mapping:"idpais"},
    {name: "pais", mapping:"nombrepais"}
  ],
  autoLoad:true
},
listeners:{

},
};
/**
 * Componente idfamiliarresidente
 */
Ext.persona.cmp1237 = {
listeners:{

},
};
/**
 * Componente Grado militar
 */
Ext.persona.cmp780 = {
store:{
  url: "getNomMilitaryDegrees",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: "idgrado"},     
          {name: "denominacion"},
          {name: "abreviatura"},
          {name: "idicono"},
          {name: "icono"},
          {name: "icono_name"}
         
        ],
          autoLoad:true,
          
}
   ,
tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b>" class="x-combo-list-item"><img width="30" height="16" src="{icono}">  {denominacion}</div></tpl>'
,
listeners:{

},
};
/**
 * Componente Ingresos personales
 */
Ext.persona.cmp1171 = {
columns:[ 
  {header: "Tipo de ingreso",width:150 , dataIndex: "tipoingreso"},
  {header: "Familiar o amigo",width:280 , dataIndex: "familiar"},
  {header: "Cuantía", dataIndex: "cuantia"},
  {header: "Moneda", dataIndex: "moneda"}
],
aplicarHandler:function () {
  var values = this.fpFormulario.getForm().getValues();
  values.tipoingreso = Ext.getCmp("1173" + this.idpadre).getRawValue();
  values.familiar = Ext.getCmp("1174" + this.idpadre).getRawValue();
  values.moneda = Ext.getCmp("1176" + this.idpadre).getRawValue();
  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idingreso)) {
    values.idingreso = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function (rec) {
      if (rec.get('idtipoingreso') == values.idtipoingreso && rec.get('moneda') == values.moneda && (rec.get('familiar') == values.familiar && !Ext.isEmpty(values.familiar))) {
        index = 'ingreso';
        return false;
      }
    });
    switch (index) {
      case 'ingreso':
        mostrarMensaje(6, 'El ingreso que quiere adicionar ya existe.');
        break;
      default:
        try {
          store.add(new Ext.data.Record(values));
          this.cleanForm();
        } catch (error) {
          mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
        }
        break;
    }
  }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el ingreso seleccionado?' : 
    '¿Está seguro que quiere eliminar los ingresos seleccionados?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
                var records = this.gpGrid.getSelectionModel().getSelections();
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idingreso'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
guardarHandler:function () {
  console.info(Ext.getCmp("1172" + this.idpadre).getValue());
  var values = this.fpFormulario.getForm().getValues();
  values.tipoingreso = Ext.getCmp("1173" + this.idpadre).getRawValue();
  values.familiar = Ext.getCmp("1174" + this.idpadre).getRawValue();
  values.moneda = Ext.getCmp("1176" + this.idpadre).getRawValue();
  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idingreso)) {
    values.idingreso = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function (rec) {
      if (rec.get('idtipoingreso') == values.idtipoingreso && rec.get('moneda') == values.moneda && (rec.get('familiar') == values.familiar && !Ext.isEmpty(values.familiar))) {
        index = 'ingreso';
        return false;
      }
    });
    switch (index) {
      case 'ingreso':
        mostrarMensaje(6, 'El ingreso que quiere adicionar ya existe.');
        break;
      default:
        try {
          store.add(new Ext.data.Record(values));
          this.cancelarHandler();
        } catch (error) {
          mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
        }
        break;
    }
  } else {
    var record;
    Ext.each(store.getRange(), function (rec, i) {
      if (rec.get('idtipoingreso') == values.idtipoingreso) { //Si  es el que se va a modificar
        record = rec; //Obtengo el record que se va a modificar
      } else if (rec.get('idtipoingreso') == values.idtipoingreso) {
        index = 'ingreso';
      }
    });
    switch (index) {
      case 'ingreso':
        mostrarMensaje(6, 'El ingreso ya existe.');
        break;
      default:
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          mostrarMensaje(6, 'Ha ocurrido un error mientras se modificaba, contacte el administrador.');
        }
        break;
    }
  }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarIngreso',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
        } else {
          mostrarMensaje(6, dataResponse.mensaje);
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "obtenerIngreso",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idingreso"},
          {name: "idfamiliar"},
          {name: "familiar"},
          {name: "idtipoingreso"},
          {name: "tipoingreso"},
          {name: "cuantia"},
          {name: "idmoneda"},
          {name: "moneda"}
        ],
          sortInfo: {field: "tipoingreso", direction: "ASC"}
},
listeners:{
render:function(cmp){
	Ext.getCmp('1174'+this.idpadre).store.baseParams.idpersona=Ext.getCmp(this.idpadre).persona.idpersona;
  Ext.getCmp('1174'+this.idpadre).store.load();
},

},
};
/**
 * Componente DATOS LABORALES
 */
Ext.persona.cmp67 = {

};
/**
 * Componente Vía de aprendizaje
 */
Ext.persona.cmp887 = {
listeners:{

},
};
/**
 * Componente Tipo de sanción
 */
Ext.persona.cmp1012 = {
listeners:{
select:function(cb, rec){
  //ComboBox de Sanción
  Ext.getCmp('1013'+this.idpadre).setRawValue('');
  Ext.getCmp('1013'+this.idpadre).store.clearFilter();
  Ext.getCmp('1013'+this.idpadre).store.filter('idtiposancion', rec.get('idtiposancion'), true);
},

},
};
/**
 * Componente Fecha de nacimiento
 */
Ext.persona.cmp132 = {
listeners:{
render:function(dt, newDate){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente idorganizacion
 */
Ext.persona.cmp1190 = {
onTrigger1Click:function ()
{
	Ext.getCmp("1190" + this.idpadre).reset();
 
},
onTrigger2Click:function ()
{
  var winGrid = Ext.getCmp("1181" + this.idpadre).winGrid;
 
  	winGrid.show();
 
  
},
listeners:{

},
};
/**
 * Componente País
 */
Ext.persona.cmp1050 = {
store:{
  url: "getCountries",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "countries"
      },
        mapping: [
          {name: "idpais"},
          {name: "nombrepais"},
          {name: "siglas"}         
          
        ],
       	 autoLoad:true,
          
},
tpl:'<tpl for="."><div ext:qtip="{nombrepais}" class="x-combo-list-item"> <p>{nombrepais} ({siglas})</p></div></tpl>',
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1200 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1241 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1241'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente Area
 */
Ext.persona.cmp1331 = {
listeners:{

},
};
/**
 * Componente Estado de salud
 */
Ext.persona.cmp1061 = {
loadFn:function(idpersona){
  Ext.Ajax.request({
    url: 'getDatosSalud',
    params: {idpersona: idpersona},
    success: function (response, opt)
    {
      this.arrAdd = [];
      this.arrMod = [];
      var dataResponse = Ext.decode(response.responseText);
      if (dataResponse.data) {
        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
        if(this.getForm().findField('idaptitudfisica'))
        	this.getForm().findField('idaptitudfisica').setRawValue(dataResponse.data.denomaptitudfisica);
        if(this.getForm().findField('limitacion'))
        	this.getForm().findField('limitacion').setRawValue(dataResponse.data.limitacion);        
      }
    }.createDelegate(this)
  });
},
saveFn:function(){
  if (this.getForm().isValid() && this.getForm().isDirty()) {
    var values = this.getForm().getValues();
    if(Ext.isEmpty(values.idestadosalud)){
    	this.arrAdd = [values];
    }else{
    	this.arrMod = [values];
    }
  }
  return {
    arrAdd: this.arrAdd,
    arrMod: this.arrMod
  };
},
listeners:{

},
};
/**
 * Componente fnacimineto
 */
Ext.persona.cmp1191 = {
listeners:{

},
};
/**
 * Componente idpais
 */
Ext.persona.cmp1233 = {
store:{
  url: "getCountrys",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "contrys"
  },
  mapping: [
    {name: "idpais", mapping:"idpais"},
    {name: "pais", mapping:"nombrepais"}
  ],
  autoLoad:true
},
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1234 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1235'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1229 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1228' + this.idpadre).getValue());
  Ext.getCmp('1229'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1228 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1229'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente idfamiliarexterior
 */
Ext.persona.cmp1230 = {
listeners:{

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1231 = {
store:{
  url: "obtenerFamiliar",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "nombre"}
  ]
},
listeners:{

},
};
/**
 * Componente No. Orden
 */
Ext.persona.cmp834 = {
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1235 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1234' + this.idpadre).getValue());
  Ext.getCmp('1235'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Es oficial
 */
Ext.persona.cmp128 = {
listeners:{

},
};
/**
 * Componente Contacto
 */
Ext.persona.cmp127 = {
listeners:{

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1238 = {
store:{
  url: "obtenerFamiliar",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "nombre"}
  ]
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1242 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1241' + this.idpadre).getValue());
  Ext.getCmp('1242'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1244 = {
store:{
  url: "obtenerFamiliar",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "nombre"}
  ]
},
listeners:{

},
};
/**
 * Componente idfamiliarsancionado
 */
Ext.persona.cmp1243 = {
listeners:{

},
};
/**
 * Componente idmotivosancion
 */
Ext.persona.cmp1246 = {
listeners:{

},
};
/**
 * Componente idsancion
 */
Ext.persona.cmp1245 = {
store:{
  url: "getSancionesJudiciales",
  type: "Store",
    autoLoad:true,
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: "idsancion"},
    {name: "denominacion"}
  ]
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1248 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1247' + this.idpadre).getValue());
  Ext.getCmp('1248'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Residentes en el exterior
 */
Ext.persona.cmp1222 = {
columns:[ 
  {header: "Familiar", width:270, dataIndex: "nombre"},
  {header: "Parentesco",width:100, dataIndex: "parentesco"},
  {header: "Pais",width:130, dataIndex: "pais"}, 
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.nombre = Ext.getCmp("1231" + this.idpadre).getRawValue();
    values.pais = Ext.getCmp("1233" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarexterior)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarexterior = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',                  
                  	msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();  
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
}
,
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el familiar o amigo seleccionado?' : 
    '¿Está seguro que quiere eliminar los familiares o amigos seleccionados?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idfamiliarexterior'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar familar",
        ttBtnMod:"Modificar familar",
        ttBtnDel:"Eliminar familar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
     values.nombre = Ext.getCmp("1231" + this.idpadre).getRawValue();
    values.pais = Ext.getCmp("1233" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarexterior)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarexterior = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliarexterior':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('idfamiliarexterior') == values.idfamiliarexterior) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('idfamiliar') == values.idfamiliar) {
                    index = 'idfamiliar';
                }
        });
        switch (index) {
            case 'idfamiliarexterior':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestFamiliarResidente',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los datos han sido gestionados satisfactoriamente.');
          this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
        } else {
          mostrarMensaje(6, 'Error al procesar los datos.');
        }
      }.createDelegate(this)
    }, this);
  }
},
store:{
  url: "getFamiliarResidenteByPesona",
  type: "Store",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idfamiliarexterior"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "idpais"},
    {name: "idfamiliar"},
    {name: "idparentesco"},
    {name: "nombre"},
    {name: "pais"},
    {name: "parentesco"}  
  ],
  sortInfo:{field: "nombre", direction: "ASC"}
},
listeners:{
render:function(cmp){
	Ext.getCmp('1231'+this.idpadre).store.baseParams.idpersona=Ext.getCmp(this.idpadre).persona.idpersona;
  Ext.getCmp('1231'+this.idpadre).store.load();
},

},
};
/**
 * Componente De quien
 */
Ext.persona.cmp833 = {
listeners:{

},
};
/**
 * Componente Tipos de contacto
 */
Ext.persona.cmp125 = {
listeners:{
select:function(combo, record, index){
  Ext.getCmp("1236" + this.idpadre).enable();
  Ext.getCmp("1236" + this.idpadre).minLength=record.data.mincaracter;
  Ext.getCmp("1236" + this.idpadre).maxLength=record.data.maxcaracter;
  Ext.getCmp("1236" + this.idpadre).vtype=record.data.type;
  Ext.getCmp("1236" + this.idpadre).maxLengthText='El tamaño máximo requerido es '+record.data.maxcaracter+' caracteres.';
  Ext.getCmp("1236" + this.idpadre).minLengthText='El tamaño mínimo requerido es '+record.data.mincaracter+' caracteres.';
  Ext.getCmp("1236" + this.idpadre).render();


},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1085 = {
listeners:{
focus:function(){  
  var date = new Date(Ext.getCmp('1084' + this.idpadre).getValue());
  //Definiedo el valor minimo al campo de fecha fin a partir del campo fecha inicio
  Ext.getCmp('1085'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente idtipomediocontacto
 */
Ext.persona.cmp1236 = {
store:{
  url: "/pvd/persona/index.php/nomtipomediocontacto/getTypeContactMedium",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idtipomediocontacto'},
        {name: 'denominacion'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},
        {name: 'type'},
        {name: 'maxcaracter'},
        {name: 'mincaracter'}
        ],
        autoLoad:true,
          
},
listeners:{
select:function(combo, record, index){
  Ext.getCmp("127" + this.idpadre).enable();
  Ext.getCmp("127" + this.idpadre).minLength=record.data.mincaracter;
  Ext.getCmp("127" + this.idpadre).maxLength=record.data.maxcaracter;
  Ext.getCmp("127" + this.idpadre).vtype=record.data.type;
  Ext.getCmp("127" + this.idpadre).maxLengthText='El tamaño máximo requerido es '+record.data.maxcaracter+' caracteres.';
  Ext.getCmp("127" + this.idpadre).minLengthText='El tamaño mínimo requerido es '+record.data.mincaracter+' caracteres.';
  Ext.getCmp("127" + this.idpadre).render();


},

},
};
/**
 * Componente Trayectoria de cargos
 */
Ext.persona.cmp1035 = {
columns:[
  {header: "Cargo", width: 100, sortable: true, dataIndex: "denomcargoorganizacion"},
  {header: "Nivel en la organización", width: 100, sortable: true, dataIndex: "denomnivelorganizacion"},
  {header: "Afiliación", width: 100, sortable: true, dataIndex: "denomorganizacion"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion del cargo seleccionado
  values.denomcargoorganizacion = Ext.getCmp("1037" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del nivel seleccionado
  values.denomnivelorganizacion = Ext.getCmp("1038" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del Afiliaciones
  values.denomorganizacion = Ext.getCmp("1039" + this.idpadre).getRawValue();

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idcargoorganizacionp)) {//Si es vacio es porke estoy adicionando
    values.idcargoorganizacionp = Ext.id();
    values.add = true;
    if (values.historico == 1) { //El checkeo eso solo si el cargo es actual
      Ext.each(store.getRange(), function (rec)
      {
      	if (rec.get('historico') == 1 && rec.get('idcargoorganizacion') == values.idcargoorganizacion 
            && rec.get('idafiliacion') === values.idafiliacion) {
           index = 'cargo';
           return false;
        }
      });
    }
    if (index == -1) {
      try {
        store.add(new Ext.data.Record(values));
        this.cleanForm();
      } catch (error) {
        Ext.Notification.show({
          title: 'Error',
          msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
          icon: 'error'
        });
      }
    } else {
      Ext.Notification.show({
        title: 'Error',
        msg: 'La persona ya ocupa el cargo: '+values.denomcargoorganizacion+'.',
        icon: 'error'
      });
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function(idafiliacion){
  if (typeof idafiliacion != "object") {
    Ext.each(this.gpGrid.getStore().getRange(), function (rec)
    {
      if(rec.get('idafiliacion') === idafiliacion){        
        this.gpGrid.getStore().remove(rec);
      }
    }, this);
    this.gpGrid.getView().refresh();
    return;
  }
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el cargo seleccionado?' : 
    '¿Está seguro que quiere eliminar los cargos seleccionados?';
  mostrarMensaje(2, ask, function (btn)
  {
  	if (btn == 'ok') {
	   
        Ext.each(records, function (rec)
        {
        	if (!rec.data.add) {
            	this.arrDel.push(rec.get('idcargoorganizacionp'));
        	}
        	this.gpGrid.getStore().remove(rec);
    	}, this);
      	this.gpGrid.getView().refresh();
    }
  }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar trayectoria de cargos",
        ttBtnMod:"Modificar trayectoria de cargos",
        ttBtnDel:"Eliminar trayectoria de cargos",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion del cargo seleccionado
  values.denomcargoorganizacion = Ext.getCmp("1037" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del nivel seleccionado
  values.denomnivelorganizacion = Ext.getCmp("1038" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del Afiliaciones
  values.denomorganizacion = Ext.getCmp("1039" + this.idpadre).getRawValue();

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idcargoorganizacionp)) {//Si es vacio es porke estoy adicionando
    values.idcargoorganizacionp = Ext.id();
    values.add = true;
    if (values.historico == 1) { //El checkeo eso solo si el cargo es actual
      Ext.each(store.getRange(), function (rec)
      {
      	if (rec.get('historico') == 1 && rec.get('idcargoorganizacion') == values.idcargoorganizacion
            && rec.get('idafiliacion') === values.idafiliacion) {
           index = 'cargo';
           return false;
        }
      });
    }
    if (index == -1) {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch (error) {
        Ext.Notification.show({
          title: 'Error',
          msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
          icon: 'error'
        });
      }
    } else {
      Ext.Notification.show({
        title: 'Error',
        msg: 'La persona ya ocupa el cargo: '+values.denomcargoorganizacion+'.',
        icon: 'error'
      });
    }
  }else{
  	var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec)
             {
               if (rec.get('idcargoorganizacionp') != values.idcargoorganizacionp) { //Si no es el que se va a modificar
                 if (values.historico === 1 && rec.get('idcargoorganizacion') == values.idcargoorganizacion
                    && rec.get('idafiliacion') === values.idafiliacion){//El checkeo eso solo si la direccion es actual
                     index = 'cargo';
                     return false;
                 }
               } else {
                 record = rec; //Obtengo el record que se va a modificar
               }
             });
    if (index == -1) {
      try {
        for (var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch (error) {
        Ext.Notification.show({
          title: 'Error',
          msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
          icon: 'error'
        });
      }
    } else {
      Ext.Notification.show({
        title: 'Error',
        msg: 'La persona ya ocupa el cargo: '+values.denomcargoorganizacion+'.',
        icon: 'error'
      });
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function ()
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
  {
    if (rec.data.add) {//Si es un record que se adiciono nuevo
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
        this.arrMod.push(rec.data);
      }
    }
    pass = true;
  }, this);
  return {
    arrAdd:this.arrAdd,
    arrMod:this.arrMod,
    arrDel:this.arrDel,
  	};
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getCargosOrganizacion",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data",
      },
        mapping: [
          {name: "idcargoorganizacionp"},
          {name: "idafiliacion"},
          {name: "denomorganizacion"},
          {name: "idcargoorganizacion"},
          {name: "denomcargoorganizacion"},
          {name: "idnivelorganizacion"},
          {name: "denomnivelorganizacion"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Cargos" : "Cargo"]})'
},
listeners:{

},
};
/**
 * Componente Afiliaciones
 */
Ext.persona.cmp1029 = {
columns:[
  {header: "Tipo de organización", width: 100, sortable: true, dataIndex: "denomtipoorganizacion"},
  {header: "Organización", width: 120, sortable: true, dataIndex: "denomorganizacion"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de organizacción seleccionada
  values.denomtipoorganizacion = Ext.getCmp("1031" + this.idpadre) ? Ext.getCmp("1031" + this.idpadre).getRawValue(): '';
  //Obteniendo la denominacion de la organizacción seleccionada
  values.denomorganizacion = Ext.getCmp("1032" + this.idpadre).getRawValue();

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idafiliacion)) {//Si es vacio es porke estoy adicionando
    values.idafiliacion = Ext.id();
    values.add = true;
    if (values.historico == 1) { //El checkeo eso solo si la afiliación es actual
      Ext.each(store.getRange(), function (rec)
      {
      	if (rec.get('historico') == 1 && rec.get('idorganizacion') == values.idorganizacion) {
           index = 'organizacion';
           return false;
        }
      });
    }
    if (index == -1) {
      try {
        store.add(new Ext.data.Record(values));
        this.cleanForm();
      } catch (error) {
        Ext.Notification.show({
          title: 'Error',
          msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
          icon: 'error'
        });
      }
    } else {
      Ext.Notification.show({
        title: 'Error',
        msg: 'La persona ya pertenece a: '+values.denomorganizacion+'.',
        icon: 'error'
      });
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function(){
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la afiliaci&oacute;n seleccionada?' : 
    '¿Está seguro que quiere eliminar las afiliaciones seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
				//Grid Trayectoria de cargos    
  				var gpTrayectCargos = Ext.getCmp('1035'+this.idpadre);
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idafiliacion'));
                    }
                  	gpTrayectCargos.eliminarHandler.call(gpTrayectCargos, rec.get('idafiliacion'));
                    this.gpGrid.getStore().remove(rec);
                }, this);
                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar afiliaci&oacute;n",
        ttBtnMod:"Modificar afiliaci&oacute;n",
        ttBtnDel:"Eliminar afiliaci&oacute;n",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de organizacción seleccionada
  values.denomtipoorganizacion = Ext.getCmp("1031" + this.idpadre) ? Ext.getCmp("1031" + this.idpadre).getRawValue(): '';
  //Obteniendo la denominacion de la organizacción seleccionada
  values.denomorganizacion = Ext.getCmp("1032" + this.idpadre).getRawValue();

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idafiliacion)) {//Si es vacio es porke estoy adicionando
    values.idafiliacion = Ext.id();
    values.add = true;
    if (values.historico === 1) { //El checkeo eso solo si la afiliación es actual
      Ext.each(store.getRange(), function (rec)
      {
      	if (rec.get('historico') === 1 && rec.get('idorganizacion') == values.idorganizacion) {
           index = 'organizacion';
           return false;
        }
      });
    }
    if (index == -1) {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch (error) {
        Ext.Notification.show({
          title: 'Error',
          msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
          icon: 'error'
        });
      }
    } else {
      Ext.Notification.show({
        title: 'Error',
        msg: 'La persona ya pertenece a: '+values.denomorganizacion+'.',
        icon: 'error'
      });
    }
  }else{
  	var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec)
             {
               if (rec.get('idafiliacion') != values.idafiliacion) { //Si no es el que se va a modificar
                 if (values.historico === 1 && rec.get('idorganizacion') == values.idorganizacion) {//El checkeo eso solo si la direccion es actual
                     index = 'organizacion';
                     return false;
                 }
               } else {
                 record = rec; //Obtengo el record que se va a modificar
               }
             });
    if (index == -1) {
      try {
        for (var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch (error) {
        Ext.Notification.show({
          title: 'Error',
          msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
          icon: 'error'
        });
      }
    } else {
      Ext.Notification.show({
        title: 'Error',
        msg: 'La persona ya pertenece a la '+values.denomorganizacion+'.',
        icon: 'error'
      });
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function ()
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
  {
    if (rec.data.add) {//Si es un record que se adiciono nuevo
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
        this.arrMod.push(rec.data);
      }
    }
    pass = true;
  }, this);
  return {
    arrAdd:this.arrAdd,
    arrMod:this.arrMod,
    arrDel:this.arrDel,
  	};
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getAfiliaciones",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idafiliacion"},
          {name: "idorganizacion"},
          {name: "denomorganizacion"},
          {name: "idtipoorganizacion"},
          {name: "denomtipoorganizacion"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Afiliaciones" : "Afiliaci&oacute;n"]})'
},
listeners:{
selectionchange:function(sm){
  //Grid Trayectoria de cargos    
  var gpTrayectCargos = Ext.getCmp('1035'+this.idpadre);
  if (sm.getCount() == 1) {  	
  	gpTrayectCargos.gpGrid.getStore().filter('idafiliacion',sm.getSelected().get('idafiliacion'),true,true);
    gpTrayectCargos.setTitle(gpTrayectCargos.initialConfig.title + '-' + sm.getSelected().get('denomorganizacion'));
  }else{
    gpTrayectCargos.gpGrid.getStore().clearFilter();
    gpTrayectCargos.setTitle(gpTrayectCargos.initialConfig.title);
  }
},

},
};
/**
 * Componente Fecha de inicio
 */
Ext.persona.cmp95 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('96'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Condecoraciones
 */
Ext.persona.cmp1020 = {
columns:[
  {header: "Tipo de condecoración", width: 150, sortable: true, dataIndex: "denomtipocondecoracion"},
  {header: "Condecoración", width: 200, sortable: true, dataIndex: "denomcondecoracion"},  
  {header: "Motivo de condecoración", width: 250, sortable: true, dataIndex: "denommotivocondecoracion"},
  {header: "Fecha", width: 100, sortable: true, dataIndex: "fecha"}
],
adicionarHandler:function(){
  //Limpiando el combo Tipo de condecoración seleccionada
  if(Ext.getCmp("1022" + this.idpadre))
    Ext.getCmp("1022" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo de la condecoración seleccionada
  Ext.getCmp("1023" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo del motivo de condecoración seleccionado
  Ext.getCmp("1024" + this.idpadre).store.clearFilter(true);
},
aplicarHandler:function ()
{
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de condecoración seleccionada
  values.denomtipocondecoracion = Ext.getCmp("1022" + this.idpadre) ? Ext.getCmp("1022" + this.idpadre).getRawValue():'';
  //Obteniendo la denominacion de la condecoración seleccionada
  values.denomcondecoracion = Ext.getCmp("1023" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del motivo de condecoración seleccionado
  values.denommotivocondecoracion = Ext.getCmp("1024" + this.idpadre).getRawValue();

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idcondecoracionp)) {
    values.idcondecoracionp = Ext.id();
    values.add = true;
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch (error) {
      Ext.Notification.show({
        title: 'Error',
        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
        icon: 'error'
      });
    }
  }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la condecoración seleccionada?' : 
    '¿Está seguro que quiere eliminar las condecoraciones seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
    {
        if (btn == 'ok') {
          
          Ext.each(records, function (rec)
          {
            if (!rec.data.add) {
              this.arrDel.push(rec.get('idcondecoracionp'));
            }
            this.gpGrid.getStore().remove(rec);
          }, this);
          this.gpGrid.getView().refresh();
        }
    }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar condecoraci&oacute;n",
        ttBtnMod:"Modificar condecoraci&oacute;n",
        ttBtnDel:"Eliminar condecoraci&oacute;n",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de condecoración seleccionada
  values.denomtipocondecoracion = Ext.getCmp("1022" + this.idpadre) ? Ext.getCmp("1022" + this.idpadre).getRawValue():'';
  //Obteniendo la denominacion de la condecoración seleccionada
  values.denomcondecoracion = Ext.getCmp("1023" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del motivo de condecoración seleccionado
  values.denommotivocondecoracion = Ext.getCmp("1024" + this.idpadre).getRawValue();
  
  var store = this.gpGrid.getStore();
  
  if (Ext.isEmpty(values.idcondecoracionp)) {
    values.idcondecoracionp = Ext.id();
    values.add = true;    
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch (error) {
        Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador',
            icon: 'error'
          });
      }    
  } else {
      var record;
      Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idcondecoracionp') == values.idcondecoracionp) {                   
                   record = rec;
                   return false;
                 }
               });
      
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
            icon: 'error'
          });
        }
      
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  //Limpiando el combo Tipo de condecoración seleccionada
  if(Ext.getCmp("1022" + this.idpadre))
    Ext.getCmp("1022" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo de la condecoración seleccionada
  Ext.getCmp("1023" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo del motivo de condecoración seleccionado
  Ext.getCmp("1024" + this.idpadre).store.clearFilter(true);

  var record = this.gpGrid.getSelectionModel().getSelected();  
  this.loadFormulario(record);

},
saveFn:function (btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
  {
    if (rec.data.add) {//Si es un record que se adiciono nuevo
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
        this.arrMod.push(rec.data);
      }
    }
    pass = true;
  }, this);
  if (!pass && this.obligatorio) {
    Ext.Notification.show({
      title: 'Advertencia',
      msg: 'La persona debe tener una condecoración registrada',
      icon: 'warning'
    });
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modCondecoraciones';
  } else
    if (this.arrDel.length > 0) {
      url = 'delCondecoraciones';
    } else {
      url = 'addCondecoraciones';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg;
          switch (url) {
            case 'modCondecoraciones':
              msg = 'La(s) condecoración(es) ha(n) sido modificada(s) satisfactoriamente.';
              break;
            case 'delCondecoraciones':
              msg = 'La(s) condecoración(es) ha(n) sido eliminada(s) satisfactoriamente.';
              break;
            case 'addCondecoraciones':
              msg = 'La(s) condecoración(es) ha(n) sido adicionada(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getCondecoraciones",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idcondecoracionp"},
          {name: "idcondecoracion"},
          {name: "denomcondecoracion"},
          {name: "idmotivocondecoracion"},
          {name: "denommotivocondecoracion"},
          {name: "idtipocondecoracion"},
          {name: "denomtipocondecoracion"},
          {name: "observacion"},
          {name: "fecha"}
        ]
},
listeners:{
render:function(p){
  

},

},
};
/**
 * Componente Alimentación
 */
Ext.persona.cmp50 = {
columns:[
  {dataIndex: "historico", hidden:true, renderer: function(v){return (v == 0) ? 'Actual' : 'Hist&oacute;rico';}},
  {header: "Evento", width: 200, dataIndex: "evento"},
  {header: "Estructura de alimentaci&oacute;n", width: 255, dataIndex: "denomalimentacion"},
  {header: "Desde", width: 100, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, dataIndex: "fhasta"}
],
aplicarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.evento = Ext.getCmp("53" + this.idpadre).getRawValue();
  values.denomalimentacion = Ext.getCmp("65" + this.idpadre).getRawValue();
  values.historico = fnHistorico(values.fdesde, values.fhasta);
  values.add = true;
  var store = this.gpGrid.getStore();
  var control = 0;
  Ext.each(store.getRange(), function(rec){
    if(rec.get('idevento') == values.idevento && rec.get('historico') == 0) {
      control = 1;
      return false;
    }
  });
  if(control == 1) {
    mostrarMensaje(6, 'El servicio de alimentaci&oacute;n que quiere adicionar ya se encuentra activo para la persona.');
  } else {
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch(error){
      mostrarMensaje(4, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
  function fnHistorico(fi, ff){
    if(!Ext.isEmpty(ff)) {
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 0 : 1;
    }
    return 0;
  }
},
eliminarHandler:function()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el servicio de alimentaci&oacute;n seleccionado?' : 
    '¿Está seguro que quiere eliminar los servicios de alimentaci&oacute;n seleccionados?';
  mostrarMensaje(2, ask, function (btn) {
    if (btn == 'ok') {
      
      Ext.each(records, function (rec) {
        if (!rec.data.add) {
          this.arrDel.push(rec.get('idservalimentacion'));
        }
        this.gpGrid.getStore().remove(rec);
      }, this);
      this.gpGrid.getView().refresh();
    }
  }.createDelegate(this));
},
getLanguaje:function(idioma)
{
  var lang={};
  if(idioma==='es'){
    lang ={
      ttBtnAdd:"Adicionar servicio de alimentaci&oacute;n",
      ttBtnMod:"Modificar servicio de alimentaci&oacute;n",
      ttBtnDel:"Eliminar servicio de alimentaci&oacute;n",
      ttBtnSave:"Guardar datos y cerrar formulario",
      ttBtnApl:"Guardar datos y limpiar los campos",
      ttBtnCancel:"Cerrar formulario sin guardar los datos"
    }
  } else {
    lang = {}
  }
  return lang;
},
guardarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.evento = Ext.getCmp("53" + this.idpadre).getRawValue();
  values.historico = fnHistorico(values.fdesde, values.fhasta);
  values.denomalimentacion = Ext.getCmp("65" + this.idpadre).getRawValue();
 
  var store = this.gpGrid.getStore();
  var control = false;
  if(Ext.isEmpty(values.idservalimentacion)){
    values.idservalimentacion = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function(rec){
      if (rec.get('idevento') == values.idevento && rec.get('historico') == 0){
        control = true;
        return false;
      }
    });
    if(control){
      mostrarMensaje(6, 'El servicio de alimentaci&oacute;n que quiere adicionar ya se encuentra activo para la persona.');
    } else {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte con el administrador.');
      }
    }
  } else {
    var record;
    Ext.each(store.getRange(), function(rec) {
      if(rec.get('idservalimentacion') != values.idservalimentacion) {
        if (rec.get('idevento') == values.idevento && rec.get('historico') == 0) {
          control = true;
          return false;
        }
      } else {
        record = rec;
      }
    });
    if(control) {
      mostrarMensaje(6, 'El servicio de alimentaci&oacute;n ya se encuentra activo para la persona.');
    } else {
      try {
        for(var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte el administrador.');
      }
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
  function fnHistorico(fi, ff){
    if(!Ext.isEmpty(ff)) {
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 0 : 1;
    }
    return 0;
  }
},
loadFn:function(idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function(rec) {
    if(rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if(!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarServAlimentacion',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
        } else {
          mostrarMensaje(6, dataResponse.mensaje);
        }
      }.createDelegate(this)
    }, this);
  }
},
validateForm:function(){
  if(this.fpFormulario.getForm().isValid()) {
    return true;
  } else {
    return false;
  }
},
sm:{singleSelect: true},
store:{
  url: "obtenerServAlimentacionPorPersona",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "",
    root: "data"
  },
  mapping: [
    {name: "idservalimentacion"},
    {name: "idpersona"},
    {name: "idestructura"},
    {name: "denomalimentacion"},
    {name: "idestalimentacion"},    
    {name: "idevento"},
    {name: "evento"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "historico"}
  ],
  sortInfo: {field: 'historico', direction: "DESC"},
  groupField: 'historico'
},
view:{
  forceFit: true,
  type: 'GroupingView',
  startCollapsed: false,
  groupTextTpl: '{group}'
},
listeners:{

},
};
/**
 * Componente Tipo doc identificación
 */
Ext.persona.cmp92 = {
store:{
  url: "getDocIdentificacion",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idtipodocidentidad'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
select:function(combo, record, index){
  Ext.getCmp("93" + this.idpadre).enable();
  Ext.getCmp("93" + this.idpadre).minLength=record.data.mincaracter;
  Ext.getCmp("93" + this.idpadre).maxLength=record.data.maxcaracter;
  Ext.getCmp("93" + this.idpadre).vtype=record.data.type;
  Ext.getCmp("93" + this.idpadre).maxLengthText='El tamaño máximo requerido es '+record.data.maxcaracter+' caracteres.';
  Ext.getCmp("93" + this.idpadre).minLengthText='El tamaño mínimo requerido es '+record.data.mincaracter+' caracteres.';
  Ext.getCmp("93" + this.idpadre).render();


},

},
};
/**
 * Componente Fecha inicio
 */
Ext.persona.cmp876 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('877'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1084 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1085'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente idcategoria
 */
Ext.persona.cmp1250 = {
listeners:{

},
};
/**
 * Componente Categorías
 */
Ext.persona.cmp1083 = {
clickNode:function (node, e) {
        if (node.isLeaf()) {
            var text = node.text;
            this.setValue(text);
            this.fireEvent('selectNode', node);
            this.collapse();
            Ext.getCmp('1251' + this.idpadre).setValue(node.attributes.idcategoriapersona);
        }
    },
treeConfig:{loader: {
            dataUrl: '/pvd/persona/index.php/nomcategoriapersona/getCategorias'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Categorías de persona',
            animate: false,
            draggable: false,
            expanded: false
        }},
listeners:{

},
};
/**
 * Componente Segundo apellido
 */
Ext.persona.cmp64 = {
listeners:{

},
};
/**
 * Componente Familiares sancionados
 */
Ext.persona.cmp1224 = {
columns:[ 
  {header: "Familiar", width:270, dataIndex: "nombre"},
  {header: "Parentesco",width:100, dataIndex: "parentesco"},
  {header: "Sanción",width:200, dataIndex: "sancion"}, 
  {header: "Motivo sanción",width:200, dataIndex: "motivo"}, 
  {header: "Fecha inicio",width:100, dataIndex: "fdesde"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.nombre = Ext.getCmp("1244" + this.idpadre).getRawValue();
    values.sancion = Ext.getCmp("1246" + this.idpadre).getRawValue();
   values.motivo = Ext.getCmp("1246" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarsancionado)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarsancionado = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',                  
                  	msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();  
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el familiar o amigo seleccionado?' : 
    '¿Está seguro que quiere eliminar los familiares o amigos seleccionados?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idfamiliarsancionado'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar familar",
        ttBtnMod:"Modificar familar",
        ttBtnDel:"Eliminar familar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
       values.nombre = Ext.getCmp("1244" + this.idpadre).getRawValue();
    values.sancion = Ext.getCmp("1246" + this.idpadre).getRawValue();
   values.motivo = Ext.getCmp("1246" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarsancionado)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarsancionado = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('idfamiliarsancionado') == values.idfamiliarsancionado) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('idfamiliar') == values.idfamiliar) {
                    index = 'idfamiliar';
                }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestFamiliarSancionado',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los datos han sido gestionados satisfactoriamente.');
          this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
        } else {
          mostrarMensaje(6, 'Error al procesar los datos.');
        }
      }.createDelegate(this)
    }, this);
  }
},
store:{
  url: "getFamiliarSancionadoByPesona",
  type: "Store",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idfamiliarsancionado"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "idsancion"},
     {name: "sancion"},
    {name: "idfamiliar"},
    {name: "nombre"},
    {name: "idmotivosancion"},
    {name: "motivo"},
     {name: "idparentesco"},
    {name: "parentesco"},
     {name: "idpersona"}
  ],
  sortInfo:{field: "nombre", direction: "ASC"}
},
listeners:{
render:function(cmp){
	Ext.getCmp('1244'+this.idpadre).store.baseParams.idpersona=Ext.getCmp(this.idpadre).persona.idpersona;
  	Ext.getCmp('1244'+this.idpadre).store.load();
},

},
};
/**
 * Componente noalta
 */
Ext.persona.cmp1288 = {
listeners:{

},
};
/**
 * Componente Fecha de notificacion
 */
Ext.persona.cmp1290 = {
listeners:{

},
};
/**
 * Componente fbaja
 */
Ext.persona.cmp1287 = {
listeners:{

},
};
/**
 * Componente falta
 */
Ext.persona.cmp1286 = {
listeners:{

},
};
/**
 * Componente Ciudadanias
 */
Ext.persona.cmp880 = {
store:{
  url: "getCitizens",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idciudadania'},
          {name: 'denominacion'},
          {name: 'bandera'},          
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Aptitud física
 */
Ext.persona.cmp1063 = {
store:{
  url: "getAptitudesFisicas",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idaptitudfisica'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Familiares y amigos
 */
Ext.persona.cmp1181 = {
columns:[ 
  {header: "Familiar", width:270, dataIndex: "nombre"},
  {header: "No. Identidad",width:100, dataIndex: "numid"},
  {header: "Fecha de nacimiento",width:130, dataIndex: "fnacimineto"},
  {header: "Parentesco",width:150 , dataIndex: "parentesco"},
  {header: "Allegado", dataIndex: "allegado", renderer: function (val) {
    if (val == 1) {
      return "<center class='checked' style='width: 16px; height: 16px;'></center>";
    }else
    	return "";
  }},
  {header: "Conviven", dataIndex: "conviven", renderer: function (val)
   {
     if (val == 1) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }else
      	return "";
   }}
],
aplicarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.parentesco = Ext.getCmp("1185" + this.idpadre).getRawValue();
  values.allegado = Ext.getCmp("1186" + this.idpadre).getValue();
  values.conviven = Ext.getCmp("1187" + this.idpadre).getValue();
  var store = this.gpGrid.getStore();
  var control = 0;
  Ext.each(store.getRange(), function(rec){
    if(rec.data.nombre == values.nombre || (rec.data.numid == values.numid && !Ext.isEmpty(values.numid))) {
      control = 1;
      return false;
    }
  });
  if(control == 1) {
    mostrarMensaje(6, 'El familiar o amigo que quiere adicionar ya existe.');
  } else {
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch(error){
      mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
    }
  }
},
eliminarHandler:function()
{
  var msg = '';
  if(this.gpGrid.getSelectionModel().getCount() == 1)
    msg = '¿Está seguro que desea eliminar el familiar seleccionado?';
  else
    msg = '¿Está seguro que desea eliminar los familiares seleccionados?';
  mostrarMensaje(2, msg, function (btn) {
    if (btn == 'ok') {
      var records = this.gpGrid.getSelectionModel().getSelections();
      Ext.each(records, function (rec) {
        if (!rec.data.add) {
          this.arrDel.push(rec.get('idfamiliar'));
        }
        this.gpGrid.getStore().remove(rec);
      }, this);
      this.gpGrid.getView().refresh();
    }
  }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar familar",
        ttBtnMod:"Modificar familar",
        ttBtnDel:"Eliminar familar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  values.parentesco = Ext.getCmp("1185" + this.idpadre).getRawValue();
  values.allegado = Ext.getCmp("1186" + this.idpadre).getValue();
  values.conviven = Ext.getCmp("1187" + this.idpadre).getValue();
  var store = this.gpGrid.getStore();
  var control = false;
  if(Ext.isEmpty(values.idfamiliar)){
    values.idfamiliar = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function(rec){
      if (rec.data.nombre == values.nombre || (rec.data.numid == values.numid && !Ext.isEmpty(values.numid))) {
        control = true;
        return false;
      }
    });
    if(control){
      mostrarMensaje(6, 'El familiar o amigo que quiere adicionar ya existe.');
    } else {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte con el administrador.');
      }
    }
  } else {
    var record;
    Ext.each(store.getRange(), function(rec) {
      if(rec.data.idfamiliar != values.idfamiliar) {
        if (rec.data.nombre == values.nombre || (rec.data.numid == values.numid && !Ext.isEmpty(values.numid))) {
          control = true;
          return false;
        }
      } else {
        record = rec;
      }
    });
    if(control) {
      mostrarMensaje(6, 'El familiar o amigo ya existe.');
    } else {
      try {
        for(var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte el administrador.');
      }
    }
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarFamiliar',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
          this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
        } else {
          mostrarMensaje(6, 'Error al procesar los datos.');
        }
      }.createDelegate(this)
    }, this);
  }
},
store:{
  url: "obtenerFamiliar",
  type: "Store",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "nombre"},
    {name: "numid"},
    {name: "idparentesco"},
    {name: "parentesco"},
    {name: "allegado"},
    {name: "conviven"},
    {name: "idorganizacion"},
    {name: "fnacimineto"},
    {name: "centrotrabajo"},
    {name: "integracion"},
    {name: "idpersona"}
  ],
  sortInfo:{field: "nombre", direction: "ASC"}
},
listeners:{
render:function(p){
  if(!p.buscadorSuin){
    p.buscadorSuin = new Ext.Persona.BuscadorSUIN();
    p.buscadorSuin.on('rowselect', function(rec){
      //console.info(rec);
      var nombre = rec.get('nombre') + ' ' + rec.get('papel') + ' ' + rec.get('sapel');
      var formatFecha = rec.get('fechanacimiento').split('-');
      var fechanac=formatFecha[2]+'/'+formatFecha[1]+'/'+formatFecha[0];
      Ext.getCmp("1183" + this.idpadre).setValue(nombre);
      Ext.getCmp("1184" + this.idpadre).setValue(rec.get('numid'));
      Ext.getCmp("1191" + this.idpadre).setValue(fechanac);
      Ext.getCmp("1188" + this.idpadre).setValue(rec.get('idsuin'));
    },this)
    
  } 
  
 
    p.btnCancelWin = new Ext.Button({     
      iconCls: 'cancelar',
      text: 'Cancelar',              
      scope: p,
      handler: function () {
            p.winGrid.hide();
        }

    });
   var denominacion='';
   var arrId=[];

    p.btnAceptarWin = new Ext.Button({     
      iconCls: 'aceptar',
      text: 'Aceptar',             
      scope: p,
      handler: function () {
         var organiz = p.gplistado.getSelectionModel().getSelections();
      //console.info(organiz);
           var a = '';
           organiz.forEach(function (item, index, array) {
            // console.info(index);
             a += item.data.abreviatura;
             arrId.push(item.data.idorganizacion);
             if(index < organiz.length - 1){
              a += ',';
             }
          });
          Ext.getCmp("1190" + this.idpadre).setValue(arrId);
          Ext.getCmp("1190" + this.idpadre).setRawValue(a);
        
         //console.info(a);
       // Ext.each(organiz,function (v) {
         
          
       //   denominacion +=v.data.denominacion + ',';
     	//  arrId.push(v.data.idorganizacion);
     //   });
      //   Ext.getCmp("1190" + this.idpadre).setValue(arrId);
      //   Ext.getCmp("1190" + this.idpadre).setRawValue(denominacion);
       
        p.winGrid.hide();
        p.gplistado.getSelectionModel().clearSelections();
          denominacion='';
           arrId=[];
        }

    }); 
  
  
    p.stlistado = new Ext.data.Store({
            autoLoad:true,
            url: 'getOrganizaciones',
            reader: new Ext.data.JsonReader(
                {root: "data", totalProperty: "quantity"},
                [
                  {name: 'idorganizacion'},
                  {name: 'denominacion'},
                  {name: 'abreviatura'}
                
                ]
            )
        });
  
   	 var xg = Ext.grid;
  	
   	 var sm = new xg.CheckboxSelectionModel();
  
     p.gplistado = new Ext.grid.GridPanel({
            width: '100%',
            region: 'center',
            autoHeigth: true,
            store: p.stlistado,
            sm: sm,           
            columns: [sm,

                {
                    header: 'Organizaciones',
                    dataIndex: 'abreviatura',
                    width: 200
             
                }
                
            ]


        });

    p.winGrid = new Ext.Window({
      closeAction: 'hide',
      layout: 'fit',
      width:300,
      height:400,
      resizable: false,
      modal: true,
      items: [p.gplistado],
      buttons: [p.btnCancelWin, p.btnAceptarWin]
    });
  
  

  
  
  
  
},

},
};
/**
 * Componente Cargo
 */
Ext.persona.cmp1329 = {
onTrigger2Click:function ()
{
  var winEstructura = Ext.getCmp("1327" + this.idpadre).winEstructura;
 
  winEstructura.show();
 
  
},
listeners:{
render:function(){
	this.triggers[0].hide();
}
,

},
};
/**
 * Componente Organización
 */
Ext.persona.cmp1032 = {
store:{
  url: "getOrganizaciones",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idorganizacion'},
          {name: 'idtipoorganizacion'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1031'+this.idpadre).getValue()){
    cmp.store.filter('idtipoorganizacion', Ext.getCmp('1031'+this.idpadre).getValue(), true);
  }
   
},
select:function(cb, rec){
  //ComboBox de Tipo de Organización
  if(Ext.getCmp('1031'+this.idpadre))
  	Ext.getCmp('1031'+this.idpadre).setValue(rec.get('idtipoorganizacion'));
},

},
};
/**
 * Componente idnacionalidad
 */
Ext.persona.cmp1240 = {
store:{
  url: "getNacionalidades",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idnacionalidad'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Nacionalidades
 */
Ext.persona.cmp875 = {
store:{
  url: "getNacionalidades",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idnacionalidad'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Estructura política administrativa
 */
Ext.persona.cmp144 = {
clickNode:function(node, e){
  if (node.isLeaf()) {
    var text = node.parentNode.text + '-' + node.text;
    Ext.getCmp('140' + this.idpadre).setValue(node.parentNode.attributes.iddpt);
    Ext.getCmp('141' + this.idpadre).setValue(node.attributes.iddpt);
    this.setValue(text);
    this.collapse();
  }
  
     Ext.getCmp('142' + this.idpadre).enable();
     Ext.getCmp('142' + this.idpadre).store.load({
      params:{
        idmunicipio:node.attributes.iddpt,
        idpersona:Ext.getCmp(this.idpadre).persona.idpersona
      }
  	});
  
  
  
 
},
treeConfig:{
  loader: {
    dataUrl: 'getTreeProvMuni',
      baseParams:{
      }  
  },
    border: false,
      autoScroll: true,
        rootVisible: false,
          root: {
            text: 'Cuba',
              animate: false,
                draggable: false,
                  expanded: false
          },
           
},
listeners:{

},
};
/**
 * Componente Estancias en el exterior
 */
Ext.persona.cmp1043 = {
columns:[  
  {header: "Misiones", width: 180, sortable: true, dataIndex: "denommision"},
  {header: "Pa&iacute;s", width: 180, sortable: true, dataIndex: "denompais"},
  {header: "Tipo de misi&oacute;n", width: 180, sortable: true, dataIndex: "denomtipomision"},
  {header: "Fecha de salida", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Fecha de regreso", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de mision seleccionado    
  values.denomtipomision = (Ext.getCmp("1052" + this.idpadre)) 
                       ? Ext.getCmp("1052" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion de Tipo de estancia en el exterior selecionado
  values.denomtipoestanciaexterior = (Ext.getCmp("1049" + this.idpadre))
                       ? Ext.getCmp("1049" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion del país selecionado  
  values.denompais = Ext.getCmp("1050" + this.idpadre).getRawValue();
                                    
  //Obteniendo la denominacion de la mision selecionado
  values.denommision = Ext.getCmp("1048" + this.idpadre).getRawValue();

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idestanciaexterior)) {//Si es vacio es porke estoy adicionando
    values.idestanciaexterior = Ext.id();
    values.add = true;
    if (values.historico == 1) {
      Ext.each(store.getRange(), function (rec)
      {
        if(rec.get('historico') === 1){
          index = 'actual';
          return false;
        }
      });
    }
    switch (index) {
      case 'actual':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La persona actualmente est&aacute; en el exterior.',
          icon: 'warning'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cleanForm();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function(){
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la estancia seleccionada?' : 
    '¿Está seguro que quiere eliminar las estancias seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
                   {
                     if (btn == 'ok') {
                     
                       Ext.each(records, function (rec)
                                {
                                  if (!rec.data.add) {
                                    this.arrDel.push(rec.get('idestanciaexterior'));
                                  }
                                  this.gpGrid.getStore().remove(rec);
                                }, this);
                       this.gpGrid.getView().refresh();
                     }
                   }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar estancia en el exterior",
        ttBtnMod:"Modificar estancia en el exterior",
        ttBtnDel:"Eliminar estancia en el exterior",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de mision seleccionado    
  values.denomtipomision = (Ext.getCmp("1052" + this.idpadre)) 
                       ? Ext.getCmp("1052" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion de Tipo de estancia en el exterior selecionado
  values.denomtipoestanciaexterior = (Ext.getCmp("1049" + this.idpadre))
                       ? Ext.getCmp("1049" + this.idpadre).getRawValue()
                                    : '';
  //Obteniendo la denominacion del país selecionado  
  values.denompais = Ext.getCmp("1050" + this.idpadre).getRawValue();
                                    
  //Obteniendo la denominacion de la misión selecionado
  values.denommision = Ext.getCmp("1048" + this.idpadre).getRawValue();

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idestanciaexterior)) {//Si es vacio es porke estoy adicionando
    values.idestanciaexterior = Ext.id();
    values.add = true;
    if (values.historico == 1) {
      Ext.each(store.getRange(), function (rec)
      {
        if(rec.get('historico') === 1){
          index = 'actual';
          return false;
        }
      });
    }
    switch (index) {
      case 'actual':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La persona actualmente est&aacute; en el exterior.',
          icon: 'warning'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }else {
    var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec)
             {
               if (rec.get('idestanciaexterior') === values.idestanciaexterior) {
                 record = rec; //Obtengo el record que se va a modificar
               } else
                 if (values.historico === 1 && rec.get('historico') === 1) {
                   index = 'actual';
                   return false;
                 }
             });
    switch (index) {
      case 'actual':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La persona actualmente est&aacute; en el exterior.',
          icon: 'warning'
        });
        break;
      default :
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
           {
             if (rec.data.add) {//Si es un record que se adiciono nuevo
               this.arrAdd.push(rec.data);
             } else {
               if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                 this.arrMod.push(rec.data);
               }
             }
           }, this);
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modEstanciaExterior';
  } else
    if (this.arrDel.length > 0) {
      url = 'delEstanciaExterior';
    } else {
      url = 'addEstanciaExterior';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg = '';
          switch (url) {
            case 'modEstanciaExterior':
              msg = 'La(s) estancia(s) en el exterior ha(n) sido modificada(s) satisfactoriamente.';
              break;
            case 'delEstanciaExterior':
              msg = 'La(s) estancia(s) en el exterior ha(n) sido eliminada(s) satisfactoriamente.';
              break;
            case 'addEstanciaExterior':
              msg = 'La(s) estancia(s) en el exterior ha(n) sido adicionada(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getEstanciaExterior",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idestanciaexterior"},
          {name: "idtipoestanciaexterior"},
          {name: "denomtipoestanciaexterior"},
          {name: "idtipomision"},
          {name: "denomtipomision"},
          {name: "idmision"},
          {name: "denommision"},
          {name: "idpais"},
          {name: "denompais"},
          {name: "cargo"},
          {name: "observacion"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Misiones" : "Misi&oacute;n"]})'
},
listeners:{

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1033 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('1034'+this.idpadre).setMinValue(newDate);
  Ext.getCmp('1040'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  //dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1034 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('1041'+this.idpadre).setMaxValue(newDate);
},
focus:function(){
  var date = new Date(Ext.getCmp('1033' + this.idpadre).getValue());
  Ext.getCmp('1034'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente identidad
 */
Ext.persona.cmp1328 = {
listeners:{

},
};
/**
 * Componente Entidad
 */
Ext.persona.cmp1333 = {
listeners:{

},
};
/**
 * Componente Sanciones
 */
Ext.persona.cmp1013 = {
store:{
  url: "getSantions",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idsancion'},
          {name: 'idtiposancion'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1012'+this.idpadre).getValue()){
    cmp.store.filter('idtiposancion', Ext.getCmp('1012'+this.idpadre).getValue(), true);
  }
   
},
select:function(cb, rec){
  //ComboBox de Tipo de Sanción
  if(Ext.getCmp("1012" + this.idpadre))
  	Ext.getCmp('1012'+this.idpadre).setValue(rec.get('idtiposancion'));
  
  if(Ext.getCmp("1014" + this.idpadre))
    Ext.getCmp('1014'+this.idpadre).setValue(rec.get('tiemporehabilitacion'));
  
  if(Ext.getCmp("1015" + this.idpadre))
    Ext.getCmp('1015'+this.idpadre).setValue(rec.get('unidadtiempo'));
},

},
};
/**
 * Componente OTROS
 */
Ext.persona.cmp1118 = {

};
/**
 * Componente Observaciones
 */
Ext.persona.cmp1194 = {
columns:[ 
  {header: "Observaciones",width:400 , dataIndex: "observacion"},
  {header: "Fecha registro",width:100 , dataIndex: "fregistro"}
],
aplicarHandler:function () {
  var values = this.fpFormulario.getForm().getValues();
  var fecha = new Date();
  var month = fecha.getMonth()+1;
  var day = fecha.getDate();
  var year = fecha.getFullYear();
 
  values.fregistro=day + '/' + month + '/' + year;
  
  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idobservacion)) {
    values.idobservacion = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function (rec) {
      if (rec.get('observacion') == values.observacion) {
        index = 'observacion';
        return false;
      }
    });
    switch (index) {
      case 'observacion':
        mostrarMensaje(6, 'La observación que quiere adicionar ya existe.');
        break;
      default:
        try {
          store.add(new Ext.data.Record(values));
          this.cleanForm();
        } catch (error) {
          mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
        }
        break;
    }
  }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la observación seleccionada?' : 
    '¿Está seguro que quiere eliminar las observaciones seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
                var records = this.gpGrid.getSelectionModel().getSelections();
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idobservacion'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
guardarHandler:function () {
  var values = this.fpFormulario.getForm().getValues();
  var fecha = new Date();
  var month = fecha.getMonth()+1;
  var day = fecha.getDate();
  var year = fecha.getFullYear();
  values.fregistro=day + '/' + month + '/' + year;
  
  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idobservacion)) {
    values.idobservacion = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function (rec) {
      if (rec.get('observacion') == values.observacion) {
        index = 'observacion';
        return false;
      }
    });
    switch (index) {
      case 'observacion':
        mostrarMensaje(6, 'La observación que quiere adicionar ya existe.');
        break;
      default:
        try {
          store.add(new Ext.data.Record(values));
          this.cancelarHandler();
        } catch (error) {
          mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
        }
        break;
    }
  } else {
    var record;
    Ext.each(store.getRange(), function (rec, i) {
      if (rec.get('idobservacion') == values.idobservacion) { //Si  es el que se va a modificar
        record = rec; //Obtengo el record que se va a modificar
      } else if (rec.get('idobservacion') == values.idobservacion) {
        index = 'observacion';
      }
    });
    switch (index) {
      case 'observacion':
        mostrarMensaje(6, 'La observación ya existe.');
        break;
      default:
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          mostrarMensaje(6, 'Ha ocurrido un error mientras se modificaba, contacte el administrador.');
        }
        break;
    }
  }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestObservacion',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
        } else {
          mostrarMensaje(6, dataResponse.mensaje);
        }
      }.createDelegate(this)
    }, this);
  }
}

,
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getObservacion",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idobservacion"},
          {name: "observacion"},
          {name: "fregistro"}
        ]
},
listeners:{

},
};
/**
 * Componente Misiones
 */
Ext.persona.cmp1048 = {
store:{
  url: "getMisiones",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idmision'},
          {name: 'idtipomision'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1052'+this.idpadre).getValue()){
    cmp.store.filter('idtipomision', Ext.getCmp('1052'+this.idpadre).getValue(), true);
  }
   
},
select:function(cb, rec){
  //ComboBox de Tipo de Mision
  if (Ext.getCmp('1052'+this.idpadre))
  	Ext.getCmp('1052'+this.idpadre).setValue(rec.get('idtipomision'));
},

},
};
/**
 * Componente idestadoviviendap
 */
Ext.persona.cmp1308 = {
listeners:{

},
};
/**
 * Componente Tipo Doc. Identidad
 */
Ext.persona.cmp3 = {
store:{
  url: "getDocIdentificacion",
  type: "Store",
  baseParams: {value: 1},
  reader: {type: "JsonReader", root: "data"},
  mapping: [
    {name: 'idtipodocidentidad'},
    {name: 'denomTipoDocIdentidad'},
    {name: 'fdesde'},
    {name: 'fhasta'},
    {name: 'descripcion'}
  ],
  autoLoad: true
},
listeners:{
focus:function() {
  var values = Ext.getCmp(this.idpadre).persona;
  Ext.getCmp("3" + this.idpadre).setValue(values.idtipodocidentidad);
},
select:function(combo, record, index){	
  //Ext.getCmp("4" + this.idpadre).enable();
  // Ext.getCmp("4" + this.idpadre).minLength=record.data.mincaracter;
  // Ext.getCmp("4" + this.idpadre).maxLength=record.data.maxcaracter;
  var denom = (record.data.denomTipoDocIdentidad || '').toLowerCase();
  if (denom.indexOf('far') !== -1) {
    Ext.getCmp("4" + this.idpadre).minLength = 4;
    Ext.getCmp("4" + this.idpadre).maxLength = 6;
    Ext.getCmp("4" + this.idpadre).vtype=record.data.type;
    Ext.getCmp("4" + this.idpadre).maxLengthText='El tamaño máximo requerido es 4 caracteres.';
    Ext.getCmp("4" + this.idpadre).minLengthText='El tamaño mínimo requerido es 6 caracteres.';
    Ext.getCmp("4" + this.idpadre).render();
  } else if (denom.indexOf('identidad') !== -1) {
      // regular carnet de identidad 11 digits
    Ext.getCmp("4" + this.idpadre).minLength = 11;
    Ext.getCmp("4" + this.idpadre).maxLength = 11;
    Ext.getCmp("4" + this.idpadre).vtype=record.data.type;
    Ext.getCmp("4" + this.idpadre).maxLengthText='El tamaño máximo requerido es 11 caracteres.';
    Ext.getCmp("4" + this.idpadre).minLengthText='El tamaño mínimo requerido es 11 caracteres.';
    Ext.getCmp("4" + this.idpadre).render();
  } else {
      Ext.getCmp("4" + this.idpadre).minLength = 11;
      Ext.getCmp("4" + this.idpadre).maxLength = 11;
      Ext.getCmp("4" + this.idpadre).vtype=values.type;
      Ext.getCmp("4" + this.idpadre).maxLengthText='El tamaño máximo requerido es 11 caracteres.';
      Ext.getCmp("4" + this.idpadre).minLengthText='El tamaño mínimo requerido es 11 caracteres.';
      Ext.getCmp("4" + this.idpadre).render();
  }
}
,

},
};
/**
 * Componente idconvivencia
 */
Ext.persona.cmp1310 = {
store:{
  url: "getConvivencia",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idconvivencia'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'},
          {name: 'denomconvivencia'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente idarea
 */
Ext.persona.cmp1330 = {
listeners:{

},
};
/**
 * Componente idcargo
 */
Ext.persona.cmp1332 = {
listeners:{

},
};
/**
 * Componente idsituacion
 */
Ext.persona.cmp1334 = {
listeners:{

},
};
/**
 * Componente idsituacionlaboralp
 */
Ext.persona.cmp1336 = {
listeners:{

},
};
/**
 * Componente idestadovivienda
 */
Ext.persona.cmp1309 = {
store:{
  url: "getEstadoVivienda",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idestadovivienda'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'},
          {name: 'denomestado'},
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente activa
 */
Ext.persona.cmp1311 = {
listeners:{

},
};
/**
 * Componente activa
 */
Ext.persona.cmp1312 = {
listeners:{

},
};
/**
 * Componente Entidad
 */
Ext.persona.cmp1205 = {
listeners:{

},
};
/**
 * Componente País
 */
Ext.persona.cmp1193 = {
store:{
  url: "getCountrys",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: "contrys"
  },
  mapping: [
    {name: "idpais", mapping:"idpais"},
    {name: "pais", mapping:"nombrepais"}
  ],
  autoLoad:true
},
listeners:{
select:function(combo, rec, opt) {
  Ext.getCmp('120' + this.idpadre).enable(); 
  Ext.getCmp('120' + this.idpadre).setValue('');
  Ext.getCmp('120' + this.idpadre).treeConfig.loader.baseParams.idpais=rec.get('idpais');
  Ext.getCmp('120' + this.idpadre).onTrigger1Click();
},

},
};
/**
 * Componente Localidad
 */
Ext.persona.cmp142 = {
listeners:{

},
};
/**
 * Componente Color de los ojos
 */
Ext.persona.cmp102 = {
listeners:{

},
};
/**
 * Componente Color del pelo
 */
Ext.persona.cmp103 = {
listeners:{

},
};
/**
 * Componente resrehabilitacion
 */
Ext.persona.cmp1325 = {
listeners:{

},
};
/**
 * Componente Ciudadanías
 */
Ext.persona.cmp878 = {
columns:[  
  {header: "Ciudadanía",
   width: 180, 
   sortable: true,
   resizable:false, 
   dataIndex: "denomciudadania",
   renderer: function (value, meta, record) {
     return "<div class='flags_img " + record.get('bandera') + "' style='width: 16px; height: 16px;'><p style='margin-left: 20px; margin-top: 2px;'>" + value + "</p></div>";
   }
  },
  {header: "Desde", width: 100, sortable: true,resizable:false, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true,resizable:false, dataIndex: "fhasta"},
  {header: "Activa", hidden: true, sortable: true, dataIndex: "activa", renderer: function (v)
   {
     return (v == 1) ? 'Ciudadan&iacute;a activa' : 'Ciudadan&iacute;as pasivas';
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomciudadania = Ext.getCmp("880" + this.idpadre).getRawValue();
    values.bandera = Ext.getCmp("880" + this.idpadre).findRecord("idciudadania", values.idciudadania).get("bandera");
    values.activa = (Ext.getCmp("1312" + this.idpadre).checked) ? 1 : 0;
    
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idciudadaniap)) {//Si es vacio es porke estoy adicionando
        values.idciudadaniap = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idciudadania') == values.idciudadania) {
                index = 'ciudadadania';
                return false;
            }
        });
        switch (index) {
            case 'ciudadadania':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La ciudadanía que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la ciudadanía seleccionada?' : 
    '¿Está seguro que quiere eliminar las ciudadanías seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idciudadaniap'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar ciudadania",
        ttBtnMod:"Modificar ciudadania",
        ttBtnDel:"Eliminar ciudadania",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomciudadania = Ext.getCmp("880" + this.idpadre).getRawValue();
    values.bandera = Ext.getCmp("880" + this.idpadre).findRecord("idciudadania", values.idciudadania).get("bandera");
    values.activa = (Ext.getCmp("1312" + this.idpadre).checked) ? 1 : 0;

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idciudadaniap)) {//Si es vacio es porke estoy adicionando
        values.idciudadaniap = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idciudadania') == values.idciudadania) {
                index = 'ciudadadania';
                return false;
            }
        });
        switch (index) {
            case 'ciudadadania':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La ciudadanía que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('idciudadaniap') == values.idciudadaniap) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('idciudadania') == values.idciudadania) {
                    index = 'ciudadadania';
                }
        });
        switch (index) {
            case 'ciudadadania':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La ciudadanía ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn: function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'La persona debe tener alguna ciudadania registrada',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'modCiudadanias';
   } else
     if (this.arrDel.length > 0) {
       url = 'delCiudadanias';
     } else {
       url = 'addCiudadanias';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'modCiudadanias':
               msg = 'La(s) ciudadanía(s) ha(n) sido modificada(s) satisfactoriamente.';
               break;
             case 'delCiudadanias':
               msg = 'La(s) ciudadanía(s) ha(n) sido eliminada(s) satisfactoriamente.';
               break;
             case 'addCiudadanias':
               msg = 'La(s) ciudadanía(s) ha(n) sido adicionada(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
validateForm:function () {
  if (this.fpFormulario.getForm().isValid()) {
    return true;
  } else {
    return false;
  }
},
sm:{
  type:'RowSelectionModel',
  singleSelect: false
},
store:{
  url: "getCiudadanias",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
    mapping: [
      {name: "idciudadaniap"},
      {name: "idciudadania"},
      {name: "denomciudadania"},
      {name: "fdesde"},
      {name: "fhasta"},
      {name: "bandera"},
      {name: "activa"}
  ],
  sortInfo: {field: 'activa', direction: "DESC"},
  groupField: 'activa'
},
view:{
  type: 'GroupingView',
  groupTextTpl: '{group}'
},
listeners:{

},
};
/**
 * Componente Situacion
 */
Ext.persona.cmp1335 = {
clickNode:function(node, e){
  //if (node.isLeaf()) {
    var text = node.text;
    Ext.getCmp('1334' + this.idpadre).setValue(node.id);
    this.setValue(text);
    this.collapse();
  //}
},
treeConfig:{
  loader: {
    dataUrl: 'getSituacion'
  },
  border: false,
  autoScroll: true,
  rootVisible: false,
  root: {
  	text: 'Situación de la persona',
    animate: false,
    expanded: false
  }
},
listeners:{

},
};
/**
 * Componente resolucion
 */
Ext.persona.cmp1289 = {
listeners:{

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp1337 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('1338'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp1338 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('1337' + this.idpadre).getValue());
  Ext.getCmp('1338'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Principal
 */
Ext.persona.cmp1339 = {
listeners:{

},
};
/**
 * Componente idasignaciondefensa
 */
Ext.persona.cmp1345 = {
listeners:{

},
};
/**
 * Componente idsituaciondefensa
 */
Ext.persona.cmp1343 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1346 = {
listeners:{

},
};
/**
 * Componente idproceso
 */
Ext.persona.cmp1351 = {
store:{
  url: "getProcesos",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idproceso'},
          	{name: 'denominacion'}       
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1347 = {
listeners:{

},
};
/**
 * Componente idcargo
 */
Ext.persona.cmp1344 = {
listeners:{

},
};
/**
 * Componente Fecha inicio
 */
Ext.persona.cmp114 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('115'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Idiomas
 */
Ext.persona.cmp886 = {
store:{
  url: "getIdiomas",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'ididioma'},
          {name: 'denominacion'},
          {name: 'bandera'},          
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Datos de Preempleo
 */
Ext.persona.cmp1348 = {
columns:[
  {header: "Proceso de selección activo", width: 250, sortable: true, dataIndex: "denomproceso"},  
  {header: "Fuente de reclutamiento", width: 250, sortable: true, dataIndex: "denomvia"},
  {header: "Observaciones", width: 250, sortable: true, dataIndex: "observacion"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomproceso = Ext.getCmp("1351" + this.idpadre).getRawValue();
    values.denomvia = Ext.getCmp("1349" + this.idpadre).getRawValue();
  
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcandidato)) {
        values.idcandidato = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
  
  	var records = this.gpGrid.getSelectionModel().getSelections();
   	var ask = '¿Está seguro que quiere eliminar el proceso seleccionado?';
  
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {
                     var records = this.gpGrid.getSelectionModel().getSelections();
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idcandidato'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomproceso = Ext.getCmp("1351" + this.idpadre).getRawValue();
    values.denomvia = Ext.getCmp("1349" + this.idpadre).getRawValue();
	
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcandidato)) {
        values.idcandidato = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
      
      
      
      var record;
      
      
      
       Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idcandidato') == values.idcandidato) {                   
                   record = rec;
                   return false;
                 }
               });
      
       
        switch (index) {             
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                 
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();
  //console.log(record);
  
  this.loadFormulario(record);
  
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
    }, this);
    
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modProcesoActivo';
    } else
        if (this.arrDel.length > 0) {
            url = 'delProcesoActivo';
        } else {
            url = 'addProcesoActivo';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modProcesoActivo':
                            msg = 'El proceso se ha modificado satisfactoriamente.';
                            break;
                        case 'delProcesoActivo':
                            msg = 'El proceso se ha eliminado satisfactoriamente.';
                            break;
                        case 'addProcesoActivo':
                            msg = 'El proceso se ha adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getProcesoActivo",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idcandidato"},
          {name: "idproceso"},
          {name: "denomproceso"},
          {name: "idviareclutamiento"},
          {name: "denomvia"},
          {name: "observacion"}
            
        ]
          
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1369 = {
listeners:{

},
};
/**
 * Componente País
 */
Ext.persona.cmp139 = {
store:{
  url: "getCountrys",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "contrys"
      },
        mapping: [
          {name: "idpais", mapping:"idpais"},
          {name: "denominacion", mapping:"nombrepais"},
          
        ],
        autoLoad:true,         
},
listeners:{
select:function(combo, rec, opt){
  Ext.getCmp('144' + this.idpadre).enable();
  Ext.getCmp('144' + this.idpadre).setValue('');
  Ext.getCmp('144' + this.idpadre).treeConfig.loader.baseParams.idpais=rec.get('idpais');
  Ext.getCmp('144' + this.idpadre).onTrigger1Click();
},

},
};
/**
 * Componente Desde
 */
Ext.persona.cmp10 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('11'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente Hasta
 */
Ext.persona.cmp23 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('10' + this.idpadre).getValue());
  Ext.getCmp('22'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente Primer apellido
 */
Ext.persona.cmp63 = {
listeners:{

},
};
/**
 * Componente idcandidato
 */
Ext.persona.cmp1352 = {
listeners:{

},
};
/**
 * Componente idviareclutamiento
 */
Ext.persona.cmp1349 = {
store:{
  url: "getViasReclutamiento",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idviareclutamiento'},
          	{name: 'denominacion'}     
      ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente idcaracterizacion
 */
Ext.persona.cmp1376 = {
listeners:{

},
};
/**
 * Componente Norma
 */
Ext.persona.cmp1145 = {
store:{
  url: "getNorma",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idnorma'},         
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'},
          {name: 'idtalla'},
          {name: 'idprenda'}
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1144'+this.idpadre).getValue()){
    cmp.store.filter('idprenda', Ext.getCmp('1144'+this.idpadre).getValue(), true);
  }
   
},

},
};
/**
 * Componente Observación
 */
Ext.persona.cmp1045 = {
listeners:{

},
};
/**
 * Componente Padecimientos
 */
Ext.persona.cmp1059 = {
store:{
  url: "getPadecimientos",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idpadecimiento'},        
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Padecimientos
 */
Ext.persona.cmp1055 = {
columns:[
  {header: "Padecimientos", width: 200, sortable: true, dataIndex: "denompadecimiento"}, 
  {header: "Tratamiento", width: 400, sortable: true, dataIndex: "tratamiento"},  
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    //Obteniendo la denominacion del padecimiento seleccionado
    values.denompadecimiento = Ext.getCmp("1059" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idafeccion)) {
        values.idafeccion = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idpadecimiento') == values.idpadecimiento) {
                index = 'padecimiento';
                return false;
            }
        });
        switch (index) {
            case 'padecimiento':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El padecimiento <b>' + values.denompadecimiento + '</b> ya existe.',
                    icon: 'error'
                });
                break;
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
  	var records = this.gpGrid.getSelectionModel().getSelections();
   	var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el padecimiento seleccionado?' : 
    '¿Está seguro que quiere eliminar los padecimientos seleccionados?';
  
    mostrarMensaje(2, ask, function (btn)
    {
        if (btn == 'ok') {
            var records = this.gpGrid.getSelectionModel().getSelections();
            Ext.each(records, function (rec)
            {
                if (!rec.data.add) {
                    this.arrDel.push(rec.get('idafeccion'));
                }
                this.gpGrid.getStore().remove(rec);
            }, this);

            this.gpGrid.getView().refresh();
        }
    }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar padecimiento <b>(Alt + I)</b>",
        ttBtnMod:"Modificar padecimiento <b>(Alt + M)</b>",
        ttBtnDel:"Eliminar padecimiento <b>(DEL)</b>",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    //Obteniendo la denominacion del padecimiento seleccionado
    values.denompadecimiento = Ext.getCmp("1059" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idafeccion)) {
        values.idafeccion = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idpadecimiento') == values.idpadecimiento) {
                index = 'padecimiento';
                return false;
            }
        });
        switch (index) {
            case 'padecimiento':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El padecimiento <b>' + values.denompadecimiento + '</b> ya existe.',
                    icon: 'error'
                });
                break;
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idafeccion') != values.idafeccion) {
                if (rec.get('idpadecimiento') == values.idpadecimiento) {
                    index = 'padecimiento';
                    return false;
                }
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'padecimiento':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La afecci&oacute;n <b>' + values.denompadecimiento + '</b> ya existe.',
                    icon: 'error'
                });
                break;
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                        icon: 'error'
                    });
                }
                break
        }
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function ()
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
  {
    if (rec.data.add) {//Si es un record que se adiciono nuevo
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
        this.arrMod.push(rec.data);
      }
    }
    pass = true;
  }, this);
  return {
    arrAdd:this.arrAdd,
    arrMod:this.arrMod,
    arrDel:this.arrDel,
  	};
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getAfecciones",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idafeccion"},
          {name: "idpadecimiento"},
          {name: "denompadecimiento"},
          {name: "tratamiento"},
          {name: "fdesde"},
          {name: "fhasta"}
        ]
},
listeners:{

},
};
/**
 * Componente decision
 */
Ext.persona.cmp1390 = {
store:{
    type: "SimpleStore",
      fields: [
              'iddecision', 'denominacion'
                
            ],
            data: [
                [0,'Sin lugar'],
                [1,'Lugar']]
          
},
listeners:{

},
};
/**
 * Componente Coeficiente intelectual
 */
Ext.persona.cmp1377 = {
listeners:{

},
};
/**
 * Componente Forma de preparación
 */
Ext.persona.cmp71 = {
clickNode:function(node, e){
  if (node.isLeaf()) {
    var text = node.text;
    Ext.getCmp('79' + this.idpadre).setValue(node.id);
    this.setValue(text);
    this.collapse();
  }
},
treeConfig:{
        loader: {
            dataUrl: '/pvd/persona/index.php/nommodoformacion/getModoFormacion'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Modo de formacion de la persona',
            animate: false,
            draggable: false,
            expanded: false
        }
    },
listeners:{

},
};
/**
 * Componente Módulo de Aseo
 */
Ext.persona.cmp1395 = {
columns:[
  {header: "Aseo", width: 200, sortable: true, dataIndex: "denomaseo"},  
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomaseo = Ext.getCmp("1397" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idaseop)) {
        values.idaseop = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
  
  var records = this.gpGrid.getSelectionModel().getSelections();
  var ask = '¿Está seguro que quiere eliminar el aseo seleccionado?';
  if (records.length > 1) {
    var ask = '¿Está seguro que quiere eliminar los aseos seleccionados?';
  } 
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {
                     var records = this.gpGrid.getSelectionModel().getSelections();
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idaseop'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();	
    values.denomaseo = Ext.getCmp("1397" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;

    if (Ext.isEmpty(values.idaseop)) {
        values.idaseop = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
      
      
      
      var record;
      
      
      
       Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idaseop') == values.idaseop) {                   
                   record = rec;
                   return false;
                 }
               });
      
       
        switch (index) {             
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();  
  this.loadFormulario(record);
  
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
    }, this);
    
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modAseop';
    } else
        if (this.arrDel.length > 0) {
            url = 'deltAseop';
        } else {
            url = 'addAseop';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modAseop':
                            msg = 'El aseo se ha modificado satisfactoriamente.';
                            break;
                        case 'deltAseop':
                            msg = 'El aseo se ha eliminado satisfactoriamente.';
                            break;
                        case 'addAseop':
                            msg = 'El aseo se ha adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getAseop",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idaseop"},
          {name: "idaseo"},
          {name: "denomaseo"},
          {name: "fdesde"},
          {name: "idpersona"},
          {name: "fhasta"}       
        ]
          
},
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp75 = {
listeners:{
change:function(dt, newDate){
  Ext.getCmp('76'+this.idpadre).setMinValue(newDate);
},
render:function(dt){
  dt.setMaxValue(new Date());
},

},
};
/**
 * Componente idmodoformacion
 */
Ext.persona.cmp79 = {
listeners:{

},
};
/**
 * Componente Tipo de preparación
 */
Ext.persona.cmp73 = {
clickNode:function (node, e) {
        if (node.isLeaf()) {
            var text = node.text;
            this.setValue(text);
          	Ext.getCmp('80'+this.idpadre).setValue(node.id);
            this.fireEvent('selectNode', node);
            this.collapse();
        }
    },
treeConfig:{
        loader: {
            dataUrl: '/pvd/persona/index.php/nomtipoformacion/getTipoFormacion'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Tipo de preparación',
            animate: false,
            draggable: false,
            expanded: false
        }
    },
listeners:{

},
};
/**
 * Componente ideducacion
 */
Ext.persona.cmp69 = {
listeners:{

},
};
/**
 * Componente idtitulo
 */
Ext.persona.cmp1341 = {
store:{
  url: "getTitulo",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idtitulo'},         
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Nivel educacional
 */
Ext.persona.cmp1285 = {
store:{
  url: "getEducationalLevel",
    type: "Store",    
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idniveleducacional'},
        	{name: 'denominacion'},
        	{name: 'fdesde'},
        	{name: 'fhasta'},
        	{name: 'descripcion'}         
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente idniveleducacionalp
 */
Ext.persona.cmp1281 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1282 = {
listeners:{

},
};
/**
 * Componente idtipoingreso
 */
Ext.persona.cmp1173 = {
listeners:{

},
};
/**
 * Componente numeroacuerdo
 */
Ext.persona.cmp1393 = {
listeners:{

},
};
/**
 * Componente Datos de familiares
 */
Ext.persona.cmp1354 = {
columns:[ 
  {header: "Familiar", width:270, dataIndex: "nombre"},
   {header: "Parentesco",width:150 , dataIndex: "parentesco"},
  {header: "Allegado", dataIndex: "allegado", renderer: function (val) {
    if (val == 1) {
      return "<center class='checked' style='width: 16px; height: 16px;'></center>";
    }else
    	return "";
  }},
  {header: "Conviven", dataIndex: "conviven", renderer: function (val)
   {
     if (val == 1) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }else
      	return "";
   }},
   {header: "Observaciones",width:250 , dataIndex: "observaciones"},
],
aplicarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.parentesco = Ext.getCmp("1356" + this.idpadre).getRawValue();
  values.allegado = Ext.getCmp("1357" + this.idpadre).getValue();
  values.conviven = Ext.getCmp("1358" + this.idpadre).getValue();
  var store = this.gpGrid.getStore();
  var control = 0;
  Ext.each(store.getRange(), function(rec){
    if(rec.data.nombre == values.nombre) {
      control = 1;
      return false;
    }
  });
  if(control == 1) {
    mostrarMensaje(6, 'El familiar o amigo que quiere adicionar ya existe.');
  } else {
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch(error){
      mostrarMensaje(6, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
    }
  }
},
eliminarHandler:function()
{
  var msg = '';
  if(this.gpGrid.getSelectionModel().getCount() == 1)
    msg = '¿Está seguro que desea eliminar el familiar seleccionado?';
  else
    msg = '¿Está seguro que desea eliminar los familiares seleccionados?';
  mostrarMensaje(2, msg, function (btn) {
    if (btn == 'ok') {
      var records = this.gpGrid.getSelectionModel().getSelections();
      Ext.each(records, function (rec) {
        if (!rec.data.add) {
          this.arrDel.push(rec.get('idfamiliar'));
        }
        this.gpGrid.getStore().remove(rec);
      }, this);
      this.gpGrid.getView().refresh();
    }
  }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar familar",
        ttBtnMod:"Modificar familar",
        ttBtnDel:"Eliminar familar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  values.parentesco = Ext.getCmp("1356" + this.idpadre).getRawValue();
  values.allegado = Ext.getCmp("1357" + this.idpadre).getValue();
  values.conviven = Ext.getCmp("1358" + this.idpadre).getValue();
  var store = this.gpGrid.getStore();
  var control = false;
  if(Ext.isEmpty(values.idfamiliar)){
    values.idfamiliar = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function(rec){
      if (rec.data.nombre == values.nombre) {
        control = true;
        return false;
      }
    });
    if(control){
      mostrarMensaje(6, 'El familiar que quiere adicionar ya existe.');
    } else {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte con el administrador.');
      }
    }
  } else {
    var record;
    Ext.each(store.getRange(), function(rec) {
      if(rec.data.nombre != values.nombre) {
        if (rec.data.nombre == values.nombre) {
          control = true;
          return false;
        }
      } else {
        record = rec;
      }
    });
    if(control) {
      mostrarMensaje(6, 'El familiar ya existe.');
    } else {
      try {
        for(var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte el administrador.');
      }
    }
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarFamiliarcc',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
          this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
        } else {
          mostrarMensaje(6, 'Error al procesar los datos.');
        }
      }.createDelegate(this)
    }, this);
  }
},
store:{
  url: "obtenerFamiliarcc",
  type: "Store",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idfamiliar"},
    {name: "idpersona"},
    {name: "nombre"},
    {name: "idparentesco"},
    {name: "parentesco"},
    {name: "allegado"},
    {name: "conviven"},
    {name: "observaciones"}
   
  ],
  sortInfo:{field: "idfamiliar", direction: "ASC"}
},
listeners:{

},
};
/**
 * Componente idtipoformacion
 */
Ext.persona.cmp80 = {
listeners:{

},
};
/**
 * Componente Estructura de alojamiento
 */
Ext.persona.cmp21 = {
clickNode:function (node, e) {
  if (node.isLeaf()) {
    var root = Ext.getCmp('21' + this.idpadre).tree.root.id;
    var n = node;
    var ruta = '';
    while(n.id != root) {
      if(ruta != '')
        ruta = ruta + ' -> ' + n.text;
      else
        ruta = n.text;
      n = n.parentNode;
    }
    console.info(ruta);
    Ext.getCmp('21' + this.idpadre).setValue(node.id);
    Ext.getCmp('21' + this.idpadre).setRawValue(ruta);    
    this.collapse();
    this.fireEvent('selectNode', node);
  }
},
treeConfig:{loader: {
            dataUrl: '/pvd/persona/index.php/nomestructalojamiento/getEstructAlojamiento'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Estructura de alojamiento',
            animate: false,
            draggable: false,
            expanded: false
        }},
listeners:{

},
};
/**
 * Componente Nombre
 */
Ext.persona.cmp1355 = {
listeners:{

},
};
/**
 * Componente Apariencia
 */
Ext.persona.cmp1380 = {
listeners:{

},
};
/**
 * Componente Estructura de transporte
 */
Ext.persona.cmp8 = {
clickNode:function (node, e) {
  if (node.isLeaf()) {
    var root = Ext.getCmp('8' + this.idpadre).tree.root.id;
    var n = node;
    var ruta = '';
    while(n.id != root) {
      if(ruta != '')
        ruta = ruta + ' -> ' + n.text;
      else
        ruta = n.text;
      n = n.parentNode;
    }
    Ext.getCmp('8' + this.idpadre).setValue(node.id);
    Ext.getCmp('8' + this.idpadre).setRawValue(ruta);
    console.info(ruta);
    this.fireEvent('selectNode', node);
    this.collapse();
  }
},
treeConfig:{loader: {
            dataUrl: '/pvd/persona/index.php/nomestructransportacion/getEstrucTransportacion'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Estructura de transportación',
            animate: false,
            draggable: false,
            expanded: false
        }},
listeners:{

},
};
/**
 * Componente idparentesco
 */
Ext.persona.cmp1356 = {
listeners:{

},
};
/**
 * Componente Expresión verbal
 */
Ext.persona.cmp1381 = {
listeners:{

},
};
/**
 * Componente Motivación
 */
Ext.persona.cmp1382 = {
listeners:{

},
};
/**
 * Componente idpersona
 */
Ext.persona.cmp1361 = {
listeners:{

},
};
/**
 * Componente idfamiliar
 */
Ext.persona.cmp1360 = {
listeners:{

},
};
/**
 * Componente allegado
 */
Ext.persona.cmp1357 = {
listeners:{

},
};
/**
 * Componente Condecoración
 */
Ext.persona.cmp1023 = {
store:{
  url: "getCondecorations",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idcondecoracion'},
          {name: 'idtipocondecoracion'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1022'+this.idpadre).getValue()){
    cmp.store.filter('idtipocondecoracion', Ext.getCmp('1022'+this.idpadre).getValue(), true);
  }
   
},
select:function(cb, rec){
  //ComboBox de Tipo de Condecoración
  Ext.getCmp('1022'+this.idpadre).setValue(rec.get('idtipocondecoracion'));
},

},
};
/**
 * Componente Categorías
 */
Ext.persona.cmp1089 = {
store:{
  url: "getCategoriasCientificas",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idcategoria'},
          {name: 'idtipocategoria'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1088'+this.idpadre).getValue()){
    cmp.store.filter('idtipocategoria', Ext.getCmp('1088'+this.idpadre).getValue(), true);
  }
   
},
select:function(cb, rec){
  //ComboBox de Tipo de categoria
  if(Ext.getCmp('1088'+this.idpadre))
  	Ext.getCmp('1088'+this.idpadre).setValue(rec.get('idtipocategoria'));
},

},
};
/**
 * Componente Prendas
 */
Ext.persona.cmp1144 = {
listeners:{
select:function(cb, rec){
  //ComboBox de Prenda
 if(Ext.getCmp('1144'+this.idpadre)){
   Ext.getCmp('1145'+this.idpadre).clearValue();
   Ext.getCmp('1146'+this.idpadre).clearValue();
   
 }  
},

},
};
/**
 * Componente conviven
 */
Ext.persona.cmp1358 = {
listeners:{

},
};
/**
 * Componente Perfiles afines
 */
Ext.persona.cmp1383 = {
listeners:{

},
};
/**
 * Componente Experiencia laboral
 */
Ext.persona.cmp1384 = {
listeners:{

},
};
/**
 * Componente Experiencia en la actividad
 */
Ext.persona.cmp1385 = {
listeners:{

},
};
/**
 * Componente Tipo de Condecoración
 */
Ext.persona.cmp1022 = {
store:{
  url: "getTipoCondecoraciones",
    type: "Store",
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idtipocondecoracion'},
        	{name: 'denominacion'},
        	{name: 'fdesde'},
        	{name: 'fhasta'},
        	{name: 'descripcion'}         
        ],
          autoLoad:true,
          
},
listeners:{
select:function(cb, rec){
  //ComboBox de Condecoración
 if(Ext.getCmp('1023'+this.idpadre)){
  //Ext.getCmp('1023'+this.idpadre).expand();
   Ext.getCmp('1023'+this.idpadre).clearValue();
   Ext.getCmp('1023'+this.idpadre).store.clearFilter(true);
   Ext.getCmp('1023'+this.idpadre).store.filter('idtipocondecoracion', rec.get('idtipocondecoracion'), true);
 }  
},

},
};
/**
 * Componente idsitexcepcional
 */
Ext.persona.cmp1365 = {
listeners:{

},
};
/**
 * Componente idcargoexcep
 */
Ext.persona.cmp1367 = {
listeners:{

},
};
/**
 * Componente idsituacexcep
 */
Ext.persona.cmp1366 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1368 = {
listeners:{

},
};
/**
 * Componente fdesde
 */
Ext.persona.cmp1247 = {
listeners:{
change:function(dt, newDate){
  //Definiedo el valor minimo al campo de fecha fin
  Ext.getCmp('1247'+this.idpadre).setMinValue(newDate);
},

},
};
/**
 * Componente Talla
 */
Ext.persona.cmp1146 = {
store:{
  url: "getSize",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idtalla'},         
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'},
          {name: 'idnorma'},
          {name: 'idprenda'}
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1144'+this.idpadre).getValue()){
    cmp.store.filter('idprenda', Ext.getCmp('1144'+this.idpadre).getValue());
  }
   
},

},
};
/**
 * Componente Grados militares
 */
Ext.persona.cmp777 = {
columns:[
  {header: "Imagen", width: 50, sortable: true, 
   dataIndex: "icongrado",
   renderer: function (value, meta, record) {
     return '<center><img ext:qtip="<b>' + record.get('denomgrado') + '</b>" style="height: 16px;cursor: pointer" src="' + value + '" /></center>'     
   }
  },
  {header: "Grado militar", width: 200, sortable: true, dataIndex: "denomgrado"},
  {header: "No. Orden", width: 50, sortable: true, dataIndex: "numorden"},
  {header: "De quién", width: 150, sortable: true, dataIndex: "dequien"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de grado seleccionado
  var cbGrado = Ext.getCmp("780" + this.idpadre);
  values.denomgrado = cbGrado.getRawValue();
  
  //Obteniendo la imagen del grado seleccionado
  values.icongrado = cbGrado.findRecord(cbGrado.valueField, cbGrado.getValue()).get('icono');
  
  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idgradomilitar)) {//Si es vacio es porke estoy adicionando
    values.idgradomilitar = Ext.id();
    values.add = true;
    if (values.historico == 1) {
      Ext.each(store.getRange(), function (rec)
      {
      	if (rec.get('historico') === 1 && rec.get('idgrado') == values.idgrado) {
           index = 'grado';
           return false;
        }
        if(rec.get('historico') === 1){
          index = 'actual';
          return false;
        }
      });
    }
    switch (index) {
      case 'actual':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La persona ya esta nombrada en grado.',
          icon: 'warning'
        });
        break;
      case 'grado':
        Ext.Notification.show({
          title: 'Error',
          //msg: 'La persona ya est&aacute nombrada en el grado de: '+values.denomgrado+'.',
          msg: 'El grado militar que quiere adicionar ya existe.',
          icon: 'error'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cleanForm();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function(){
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el grado seleccionado?' : 
    '¿Está seguro que quiere eliminar los grados seleccionados?';
	mostrarMensaje(2, ask, function (btn)
                   {
                     if (btn == 'ok') {

                       var records = this.gpGrid.getSelectionModel().getSelections();
                       Ext.each(records, function (rec)
                                {
                                  if (!rec.data.add) {
                                    this.arrDel.push(rec.get('idgradomilitar'));
                                  }
                                  this.gpGrid.getStore().remove(rec);
                                }, this);
                       this.gpGrid.getView().refresh();
                     }
                   }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar grado militar",
        ttBtnMod:"Modificar grado militar",
        ttBtnDel:"Eliminar grado militar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de grado seleccionado
  var cbGrado = Ext.getCmp("780" + this.idpadre);
  values.denomgrado = cbGrado.getRawValue();
  
  //Obteniendo la imagen del grado seleccionado
  values.icongrado = cbGrado.findRecord(cbGrado.valueField, cbGrado.getValue()).get('icono');

  values.historico = isActual(values.fdesde, values.fhasta);

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idgradomilitar)) {//Si es vacio es porke estoy adicionando
    values.idgradomilitar = Ext.id();
    values.add = true;
    if (values.historico == 1) {
      Ext.each(store.getRange(), function (rec)
      {
      	if (rec.get('historico') === 1 && rec.get('idgrado') == values.idgrado) {
           index = 'grado';
           return false;
        }
        if(rec.get('historico') === 1){
          index = 'actual';
          return false;
        }
      });
    }
    switch (index) {
      case 'actual':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La persona ya esta nombrada en grado.',
          icon: 'warning'
        });
        break;
      case 'grado':
        Ext.Notification.show({
          title: 'Error',
          msg: 'El grado militar que quiere adicionar ya existe.',
          icon: 'error'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  } else {
    var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec)
             {
               if (rec.get('idgradomilitar') === values.idgradomilitar) {
                 	record = rec; //Obtengo el record que se va a modificar
               } else if (values.historico === 1 && rec.get('historico') == 1) {
                   index = 'actual';
                   return false;
                   if (rec.get('idgrado') == values.idgrado) {
                   index = 'grado';
                   return false;
              }
               }              
             });
    switch (index) {
      case 'actual':
        Ext.Notification.show({
          title: 'Aviso',
          msg: 'La persona ya tiene una situaci&oacute;n actual.',
          icon: 'warning'
        });
        break;
        case 'grado':
          Ext.Notification.show({
            title: 'Error',
            msg: 'El grado militar ya existe.',
            icon: 'error'
          });
          break;
      default :
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  var pass = false;
  Ext.each(store.getRange(), function (rec)
           {
             if (rec.data.add) {//Si es un record que se adiciono nuevo
               this.arrAdd.push(rec.data);
             } else {
               if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                 this.arrMod.push(rec.data);
               }
             }             
               pass = true;
           }, this);
  if (!pass && this.obligatorio) {
    Ext.Notification.show({
      title: 'Advertencia',
      msg: 'La persona debe estar nombrado en cargo',
      icon: 'warning'
    });
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modGradosMilitares';
  } else
    if (this.arrDel.length > 0) {
      url = 'delGradosMilitares';
    } else {
      url = 'addGradosMilitares';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg = '';
          switch (url) {
            case 'modGradosMilitares':
              msg = 'El(Los) grado(s) militar(es) ha(n) sido modificado(s) satisfactoriamente.';
              break;
            case 'delGradosMilitares':
              msg = 'El(Los) grado(s) militar(es) ha(n) sido eliminado(s) satisfactoriamente.';
              break;
            case 'addGradosMilitares':
              msg = 'El(Los) grado(s) militar(es) ha(n) sido adicionado(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getGradosMilitares",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idgradomilitar"},
          {name: "icongrado"},
          {name: "idgrado"},
          {name: "denomgrado"},
          {name: "dequien"},
          {name: "numorden"},
          {name: "parrafo"},
          {name: "anexo"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
        listeners: {
            load: function (st)
            {
                var pRec = st.find('historico', '1', false)
                var pGrado = Ext.getCmp("738" + st.idpadre);
              	if(pGrado){
                  if (pRec != -1) {
                      var rec = st.getAt(pRec);
                      pGrado.actualizarImagen.call(pGrado, rec.get('icongrado'), rec.get('denomgrado'), rec.get('fdesde'));
                  } else {
                      var imgNUll = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAA8CAYAAACtrX6oAAAACXBIWXMAABcSAAAXEgFnn9JSAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAADslJREFUeNrsXX1wVNd1/5373u7qYxHoCwtiGQfHEFdYqg0YU09xCVBKNWOY+KOuEc0kjo0pFNttNSEOJDJjUcOk9UcyZhpPAvbI8QzOxJikdhSQhUkIxsioriSkYORIgIEABls2q1XYd0//eB+7Wnbfu29Xwomzd2ZH+879ePed3z2/e+55966ImZFLn90kcirIAZxLOYBzKQdwLuUAzqUcwLmUAziXcgDnAM6lHMC5lAM4lz79pKcS5pUsFAAIQLpAdWJe8ndY14nfvdpwy0/+61YOim2my0OW+ZymbLJeOI3MS79eOkL0XLP0BNiybEqSeXUuUSZS1EOK9rwYJF1dJClQhYm82lKtk8nzZHLvTPWhBLDuMrLS3YzTjNx09dO1kW4EU5rBBo867NGG2yBmBQZI13+4yNmjPfZo143RYioAaz6U4JeSvQBLpWBy6QsUwFBhAfIA2WuqgAe4bgD5oWgvFh3KlKLhASopUBh8zlEqf6FooemswmtAsCJocBnAKjpiHz4FqdK+7lOeS5klL6sfyfsoA8wec44XbajMpVBo3+8c7TUP+53nvFjML8ikyCYqThZ7efhec7CX4nkUR6sKRaku21QcqEz6r+JUcpYWrjpv+7LgwChQisrD+lUujyLV8WW+50gMfGRrwX/qO/Q+C8+QfSTLw8nKJKLjNucOSxMqSrVnnnxo5sQJpRN/2dJ2cN36H/XZMiklrfrXp9965smHZgLAoZ6+k/PnTp9+4uQHJ/75oScPnDz1gdHYcO+k+XOnT9/V+vbb32r4YT8A2LLicWOuPHd+4P2W3QfbvtXww/6kskcBsC37ZUvbweppkydeN3XSjO7f9rctvmvtbwDQK9sem50kw5b//sb1M26cMqPt4OG2ry7f2OmDlpEBpfuJ3IFSbZvNK1n4xQzCkH7Xr5fMLVeML9Z++87zO/JCwckAwMzRzc/uuOtrX1n0pC0bGrrYGwoFrrHziSjPln/3qW0rH6m/Z7st+2jgwh5mluPGhv8m+Rk//OiT3WOLCm9OLPvMD15pXPNv//iKLUsq/6u9+zp/VPt3N2+xZT97dd/X/mrWX9xeWjq21pZtbfrFXQ+sfqLDZQ6FwqBXdRwvmXuj55q7VQC+fhTCbJ5htx9vXTvry7f99bNdXV04deoU5s2bh+jQH97LCwUnd3V1AQCqqqqQ+L2lpQUVFRWoqqrC+Q8/eaN4XPjWlpYWVFdXo7y8HAAQiUSwb98+nDx5EhMmTMDs2bNRUFAAAEgse6T3/R984ZrP3Z8oa2pqwsKFC1FeXo6BjyPtRWMKbmhqakJdXZ1zHYlEsHPnTixevBifXBh8p6xyybLLoa9UKXquuSM5oJGOou1P0HK67I+e5m8goY5XuUCqNquuu3oGALS3t2P+/Pno6uqCbbnt7e1ob29H8veXXnoJS5YsQSQSQfG48K227PTp0wCAvr4+1NTU4MCBAwCAAwcOoKamBmfOnEFy2fLycdOTZcuWLcO6desAAEVjCm6wZYnXO3fuxBNPPIG+vj6EC/NrWl/7rzvS6MRNb+lk9ieYQqanuAdUAA6k6KCuAG5AAdS0AyIWMzQAEEJgxYoVWL16NSKRCGyZECLl9wULFqCxsTH+UCL+WPfeey+2b9+ONWvWoK6uDmvWrMGjjz6Kffv2XVKWmSlZFggEIITAjh07hskS04svvohNmzZh27ZtAICrJ1XcnAbYZIPRFQBPpXu3esoAu1mcG2hu+XbHtFTlDEMKW8Fz5szB3XffjRdeeMEVYF3XsWrVKhw9etSxUl3XQUTo7+/HxIkTUVVVBSnZidHec889uO2224aVBQApWSTLioqKsH79emzevBlnz551ZHY6dOgQZs6ciZtuugkdHR2IRCKYUFH6t/d9tXayywDXs9ClV1u+LNjPzQIe1pxINcFU9WwL1nUduq5j6dKlaG5uRk9PjyNLzAeAUCgEIQQaGxtRX1+PSCTiyAYHB1FRUWENCgrt2bMH9fX1qK+vx5YtW4bVBwBpGCJZVlZWhrKyMqxevRobN250ZHbatWsXJk2ahJ6eHkydOhVtbW0AgJXLl/wDIEMAB0fQUAJpdKmnA9gt0KHi+am+JFB5AcCGNC3YpsCCggL8x4YNePzxxzFv3jwUhsOXUGRhYSE0IXDVVVfh4YcfxubNmx3ZlZWV6D1yBIODg8jPz8e0adMwoaIC/f39+PXevcPqm8CNqwYAIxZzZFeMHw8AWLRoEfbv349dO3c6ssHBQexubUV1TQ06OzsBANtffhlz5sxBxRUl1WAjD6QZAHEGIdGMHS1VJyvg4WAFk0aS29+AyrU0TAsOBYMIBYMAgGunTMHf19bi9ddfd2SJ+eHCQgjNjMssXrwYAwMDOH7sGISmIT8/H0vr6rB161acP38eJSUlKCsvx0cDAwgXFgIA5s6di10tLYhGowCA3t5eDAwM4NopUwAA4y0wAeDBBx/Eq6+95sjeeustLK2rQ0NDg/MZU1SEEydOYNzY8OQfb/1OLViGAA4k6S2YRgeZMmbAr5MVdKGEgEt+NhQUtCk6GAohGAo5namtrUVlZaUjS8wvLCyEpsUDbytWrICu647s9ttvx9SpU/H0U0/hgeXLsaGxEVJKfP2++wAAs2bNQllZGdatXYsHli/Hyz/9KR5LcNhKS0ud78XFxbjjjjsc2e7WVtxyyy0AgOPHTx0GgIULF2KvxQ5Tr628PommgwqU65Wve9RVCnTcCX97hEYkBPidR/6p+pv/vnRdouztg53/N/3GadVedX9/+uzZCxciQ5M/f9XnbNnpMx+cGV9eWp6uTndP7+HrvnjNlFR5x46f6qu8suJq+7r3vf5j10yeVJmq7NFjJ/vXfvs/f/78lu+uTJQ/1/Tz5+5ftWkXUTAGEobFrp5vgLJ5GRI91/yTYTHnhoaGSwo9trHpLy1P1/6IBO838Vp45KfLS2zbyXtjz8FzF2ND7w0ODn7Y3X2k7/ubn9+79tubDs2++YaicLgwdLC9s3fD499rvRCJfth16PDRQ92HT+i6jpbXf9X9pQV3Nnd0dJ+eddMNpaWlxWPePdL3/gMrv/mLX+9t6yktKUY4XBDKz8vLi0aHhrp7jvzuhRdfefPLd96/OzwmPBAOF9LYojFhXdf1U78/e6LtYGdHw/qnW2fOuH5iSfHYse8e+d37K//lkTde3v5q9403VheXlhQXHentP06C+J13ut9dsGjZ9jf3vz3U0dnz3sDHF85Eo3/4+Gf/07p35YMb3iTSQBAACQGQSNKZSNBBsk61FPlaClyG1V/7jWUdKhb8lTSTu9uOBSjEoN33ZLGhMQ8FWUbzIYcKWEbDzBfzwVIHOGE6IQNEEiwdZ5DBOsBEIAmQjPeDYiAyzO/CMD8AIEW8Tc0AIIlEDNBiZttGgDkWAqQOljrDCJoNCgOABKw2SVh7oFgDs3WtGUR6hETeBYj8iBDBKETwIiAyYTk/cX2Knmt+TsWLDirEnFXexarSjykjaGAKAKQDpIOEBibNvIZmVSMABhhsWgQTQAY5FkHCbN8GjzSwtRGN7BHPFAfEXCABxGCOgWQMEDLuGBEBpBNIG65otodWHGBnZyUbAEuAY4CUDAaBhSkjL116vUDw9bLBzzJpJGPSadolQUCAIXSQTuAYiHQGDGZIBrNmWg0xAAaTAEGaliEZlibNPCYTSMEg0gBiArGJvxTMQrN1bVIoJEABM8JBEiCdzHoAhGTTYm1Q7T1rBHLwJhBJghDmmCDbGboIIGANppgLKwLeG/TcXvhQJgBf7pfrAhA6hE6QBhEFTMWSQcSSQdKyTJKWShkgCRIGmCWIhWkhTBZL22BJa/xYMgGCZMv6GSQSB5kGEIFIADqb+QCxFlcmSQ2Q1rYmcsqYfdFiAEmCYJAmABFIAERkuONjxN8HB33MCar07Lb9Fo5FQGgCQpMUBAQxMRmAzmBpMEvdnDstCzbLSyIyElonMIPBmgOgCbp9WzJxERwHSMiEbpBp9sIsTGSYwLER91ukyRhm+9K+B4EkhGZZqSZBGoGERuYUQyZlk8prQ5UdpeksPiML9hNdyY7KBWmQmhBExESSpR4DpAAxEUsJSIrPY0zm8kPEry0LJmbjUl3YtJ3cXyHj9U0MyaF3YSQPaoIUYENL9FWtqcBiC5PWSQgmaAQIzaJ+cbl3lLgBrLqZ3OsUgJf3nVCPCBACAoAkQRBEQjLAkk1wmJkFWQAzGES2hSZ3gdm+W3ylYDtebBUmDGcDTuorMZFgAkl2PHSAIdm0YkcNbPeDnL7YlioEBCVYesYM6GdezoqiR3vLlOkQC5BprQJgy5VhBlH87I1pZQTH0Rk2bJidWZUcauYknXIcaE4VL2bTMbffLVkWzAwi5rhOiUFkO3hImnJsIDR8CvvB/CyT/GwJddu+45EvkpwuE0nTYx3WJ/fd/ZeWxfDlkwOwGP6MnNA22fcYfh9KedBMIu1eZ+E5V7r4JeyxnHLbXz0qc/AIbkUZ9ePLIkPfIlWftcu9PSfbOTjViFM5s+q1FEpnvSqvHVV2HKquM/3Gef2czFA9uaByCgMKddM+mxdFA+pHLhWDGcqjU+Vk4GjVpVGysEwOpWV1z2woOptjGoC/M6/ZnjTINqDgxQTZnP7P9DmVnsnLi3ZztPwc7kpHyV6LdVZQltdhc1agT5Ulodd5J5W6gPfhOq+DceyxdFICWEdmP3egQunwGBgjQYuq55XJZ10VCvVLpao6UmlD2YsOZUhp2Thfn2b6tPsxavcfiQPgfuOl/EegBL9reD/5frx8v89HfmMSI7EO9qtEwui9UclkaaXixKiEDlXnX5UAULaOqyfAFwEUZOjFqfyGlh9vdaQOa6usx30pL0u2GY2z0IOqAP8vgFv/RObFP7szvy7pN6oAPwtgFoAwvPdgZRpSy3a3iOr+Lz+e+mgk1R9zy3YF8bGFmxLAfQC+DmCVBXQB1H6qz2vd5mcNqLJhAPD/E4KZTCkqP/ril86zeZGTmC4A2A/gewD6Lymc+79Jn+2U+7XZHMC5lAM4l/5o0/8PANFRkLXHXUOtAAAAAElFTkSuQmCC";
                      pGrado.actualizarImagen.call(pGrado, imgNUll, 'Sin grado', '');
                  }
              	}
            }
        },
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: true,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Grados" : "Grado"]})'
},
listeners:{

},
};
/**
 * Componente Categorías de la persona
 */
Ext.persona.cmp1080 = {
columns:[
  {header: "Categor&iacute;a", width: 220, sortable: true, dataIndex: "denominacion"},  
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion del tipo de categoria selecionada

    values.denomcategoria = Ext.getCmp("1083" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcategoria)) {
        values.idcategoria = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcategoria') == values.idcategoria) {
                index = 'categoria';
                return false;
            }
        });

        switch (index) {
            case 'categoria':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La categor&iacute;a que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la categoría seleccionada?' : 
    '¿Está seguro que quiere eliminar las categorías seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
               
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idcategoria'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar categoría de la persona",
        ttBtnMod:"Modificar categoría de la persona",
        ttBtnDel:"Eliminar categoría de la persona",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomcategoria = Ext.getCmp("1083" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcategoria)) {
        values.idcategoria = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcategoria') == values.idcategoria) {
                index = 'categoria';
                return false;
            }
        });

        switch (index) {
            case 'categoria':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La categor&iacute;a que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcategoriapersona') != values.idcategoriapersona) {                
                if (rec.get('idcategoria') == values.idcategoria) {
                	index = 'categoria';
                	return false;
            	}
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'categoria':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La categor&iacute;a ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona) {
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'La persona debe tener alguna categor&iacute;a registrada',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'modCategoriasPersona';
   } else
     if (this.arrDel.length > 0) {
       url = 'delCategoriasPersona';
     } else {
       url = 'addCategoriasPersona';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'modCategoriasPersona':
               msg = 'La(s) categoría(s) ha(n) sido eliminada(s) satisfactoriamente.';
               break;
             case 'delCategoriasPersona':
               msg = 'La(s) categoría(s) ha(n) sido eliminada(s) satisfactoriamente.';
               break;
             case 'addCategoriasPersona':
               msg = 'La(s) categoría(s) ha(n) sido adicionada(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getCategoriasByPersona",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idcategoriapersona"},
          {name: "idcategoria"},
          {name: "denomcategoria"},
          {name: "idtipocategoria"},
          {name: "denominacion"},
          {name: "fdesde"},
          {name: "fhasta"}
        ]
},
listeners:{

},
};
/**
 * Componente Caracterización general
 */
Ext.persona.cmp1370 = {
gSecurity:function(){
  var resp = true;
  if(Ext.isEmpty(this.getForm().getValues().idcaracterizacion)){
    if(parseInt(this.segAction[0]) === 1){ //Si puede adicionar
      resp = false;
    }
  }else{
  	if(parseInt(this.segAction[1]) === 1){//Si puede modificar
      resp = false;
    }
  }
  if(resp)
    Ext.getCmp("1370" + this.idpadre).getForm().reset();
  return resp;
},
loadFn:function(idpersona){
  Ext.Ajax.request({
    url: 'getDatosPsicometricos',
    params: {idpersona: idpersona},
    success: function (response, opt)
    {
      var dataResponse = Ext.decode(response.responseText);
      if (dataResponse.data.length != 0) {
        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
        this.getForm().findField('coeficiente').setRawValue(dataResponse.data.coeficiente);
        this.getForm().findField('expresion').setRawValue(dataResponse.data.expresion);
        this.getForm().findField('apariencia').setRawValue(dataResponse.data.apariencia);
        this.getForm().findField('motivacion').setRawValue(dataResponse.data.motivacion);
        this.getForm().findField('perfil').setValue(dataResponse.data.perfil);
        this.getForm().findField('explaboral').setRawValue(dataResponse.data.explaboral);
        this.getForm().findField('expactividad').setRawValue(dataResponse.data.expactividad);
        this.getForm().findField('aptoperfil').setValue(dataResponse.data.aptoperfil);
        this.getForm().findField('resumen').setValue(dataResponse.data.resumen);
        
      }
    }.createDelegate(this)
  });
},
saveFn:function (btnPress, close)
{
  var values=this.getForm().getValues();
  console.info(values);
  values.perfil = values.perfil == "on" ? 1 : 0; 
  values.aptoperfil = values.aptoperfil == "on" ? 1 : 0; 
  
 
 if(Ext.getCmp("1370" + this.idpadre).gSecurity())return; //Si devuelve TRUE es porque tiene permisos para realizar la gestion correspondiente
    
  if (this.getForm().isValid() && this.getForm().isDirty()) {     
        var url = (Ext.isEmpty(this.getForm().getValues().idcaracterizacion)) ? 'addDatosPsicometricos' : 'modDatosPsicometricos';
    
        Ext.sendAjax.request({
            url: url,
            params: values,
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                  if(close == true) {
                    Ext.getCmp("1370" + this.idpadre).ownerCt.ownerCt.removeConcept(Ext.getCmp("1370" + this.idpadre), true);
                  } else
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        if (dataResponse.data) {
                            this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
                          	this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
                        	this.getForm().findField('coeficiente').setRawValue(dataResponse.data.coeficiente);
                        	this.getForm().findField('expresion').setRawValue(dataResponse.data.expresion);
                        	this.getForm().findField('apariencia').setRawValue(dataResponse.data.apariencia);
                        	this.getForm().findField('motivacion').setRawValue(dataResponse.data.motivacion);
                         	this.getForm().findField('perfil').setRawValue(dataResponse.data.perfil);
                         	this.getForm().findField('explaboral').setRawValue(dataResponse.data.explaboral);
                         	this.getForm().findField('expactividad').setRawValue(dataResponse.data.expactividad);
                            this.getForm().findField('aptoperfil').setRawValue(dataResponse.data.aptoperfil);
                            this.getForm().findField('resumen').setRawValue(dataResponse.data.resumen);
                        }
                    }
                    var msg = '';
                    switch (url) {
                        case 'addDatosPsicometricos':
                            msg = 'Los datos psicométricos se han adicionado satisfactoriamente.';
                            break;
                        case 'modDatosPsicometricos':
                            msg = 'Los datos psicométricos se han modificado satisfactoriamente.';
                            break;
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }

            }.createDelegate(this)
        }, this);
    }
},
listeners:{

},
};
/**
 * Componente Evaluación
 */
Ext.persona.cmp1305 = {
columns:[
  {header: "Período evaluativo", width: 300, sortable: true, dataIndex: "denominacion"},
  {header: "Evaluación", width: 180, sortable: true, dataIndex: "valor"},
  {header: "Proceso", width: 180, sortable: true, dataIndex: "proceso",hidden:true}
],
isDirty:function(){
	return false;
},
loadFn:function (idpersona)
{
  this.loadGridStore({idpersona: idpersona});
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getEvaluaciones",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idpreprocesoevaluativo"},
    {name: "denominacion"},
    {name: "valor"},
    {name: "proceso"}
  ],
  sortInfo: {field: 'proceso', direction: "DESC"},
  groupField: 'proceso'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Procesos" : "Proceso"]})'
},
listeners:{

},
};
/**
 * Componente Nacionalidades
 */
Ext.persona.cmp873 = {
columns:[  
  {header: "Nacionalidad",
   width: 180, 
   sortable: true,
   resizable:false, 
   dataIndex: "denomnacionalidad",
   renderer: function (value, meta, record) {
     return "<div class='flags_img " + record.get('bandera') + "' style='width: 16px; height: 16px;'><p style='margin-left: 20px; margin-top: 2px;'>" + value + "</p></div>";
   }
  },
  {header: "Desde", width: 100, sortable: true,resizable:false, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true,resizable:false, dataIndex: "fhasta"},
  {header: "Activa", hidden: true, sortable: true, dataIndex: "activa", renderer: function (v)
   {
     return (v == 1) ? 'Nacionalidad activa' : 'Nacionalidades pasivas';
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomnacionalidad = Ext.getCmp("875" + this.idpadre).getRawValue();
    values.bandera = Ext.getCmp("875" + this.idpadre).findRecord("idnacionalidad", values.idnacionalidad).get("bandera");
    values.activa = (Ext.getCmp("1311" + this.idpadre).checked) ? 1 : 0;

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idnacionalidadp)) {//Si es vacio es porke estoy adicionando
        values.idnacionalidadp = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idnacionalidad') == values.idnacionalidad) {
                index = 'Nacionalidad';
                return false;
            }
        });
        switch (index) {
            case 'Nacionalidad':
                Ext.Notification.show({
                    title: 'Error',
                    //msg: 'Ya existe una nacionalidad con esta denominaci&oacute;n: <b>' + values.denomnacionalidad + '</b>.',
                  	msg: 'La nacionalidad que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la nacionalidad seleccionada?' : 
    '¿Está seguro que quiere eliminar las nacionalidades seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idnacionalidadp'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar nacionalidad",
        ttBtnMod:"Modificar nacionalidad",
        ttBtnDel:"Eliminar nacionalidad",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomnacionalidad = Ext.getCmp("875" + this.idpadre).getRawValue();
    values.bandera = Ext.getCmp("875" + this.idpadre).findRecord("idnacionalidad", values.idnacionalidad).get("bandera");
    values.activa = (Ext.getCmp("1311" + this.idpadre).checked) ? 1 : 0;

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idnacionalidadp)) {//Si es vacio es porke estoy adicionando
        values.idnacionalidadp = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idnacionalidad') == values.idnacionalidad) {
                index = 'Nacionalidad';
                return false;
            }
        });
        switch (index) {
            case 'Nacionalidad':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La nacionalidad que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('idnacionalidadp') == values.idnacionalidadp) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('idnacionalidad') == values.idnacionalidad) {
                    index = 'Nacionalidad';
                }
        });
        switch (index) {
            case 'Nacionalidad':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La nacionalidad ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn: function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'La persona debe tener alguna nacionalidad registrada',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'changeNationalitys';
   } else
     if (this.arrDel.length > 0) {
       url = 'removeNationalitys';
     } else {
       url = 'addNationalitys';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'changeNationalitys':
               msg = 'La(s) nacionalidad(es) ha(n) sido modificada(s) satisfactoriamente.';
               break;
             case 'removeNationalitys':
               msg = 'La(s) nacionalidad(es) ha(n) sido eliminada(s) satisfactoriamente.';
               break;
             case 'addNationalitys':
               msg = 'La(s) nacionalidad(es) ha(n) sido adicionada(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
validateForm:function () {
  if (this.fpFormulario.getForm().isValid()) {
    return true;
  } else {
    return false;
  }
},
sm:{
  type:'RowSelectionModel',
  singleSelect: false
},
store:{
  url: "getNationalityByIdperson",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idnacionalidadp"},
    {name: "idnacionalidad"},
    {name: "denomnacionalidad"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "bandera"},
    {name: "activa"}
  ],
  sortInfo: {field: 'activa', direction: "DESC"},
  groupField: 'activa'
},
view:{
  type: 'GroupingView',
  groupTextTpl: '{group}'
},
listeners:{

},
};
/**
 * Componente idcargojefe
 */
Ext.persona.cmp1291 = {
store:{
  url: "getFormEnteringJefe",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          	{name: 'idcargopropuesto'},
        	{name: 'idcargopropuesto'},
        	{name: 'cargopropuesto'},
        	{name: 'fdesde'},
        	{name: 'fhasta '},
        	{name: 'descripcion'}      
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente Documentos de identificación
 */
Ext.persona.cmp91 = {
columns:[
  {header: "Tipo de identificación", width: 220, sortable: true, dataIndex: "denomtipodocidentidad"},
  {header: "Número", width: 180, sortable: true, dataIndex: "numero"},
  {header: "Principal", width: 60, sortable: true, dataIndex: "principal", renderer: function (val, metadata)
   {
     if (val == true) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }
     return '';
   }},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     if(isNaN(v)){
     return 'Nuevo';
   }else{
    return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomtipodocidentidad = Ext.getCmp("92" + this.idpadre).getRawValue();
  
	values.historico = isActual(values.fdesde, values.fhasta);
    values.principal = values.principal == "on" ? true : false;

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.iddocidentidad)) {
        values.iddocidentidad = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('principal') == true && values.principal != false && rec.get('historico') == 1 && values.historico == 1) {
                index = 'principal';
                return false;
            }
            if (rec.get('idtipodocidentidad') == values.idtipodocidentidad && rec.get('historico') == 1 && values.historico == 1) {
                index = 'Tipo doc identidad';
                return false;
            }
          	if (!Ext.isEmpty(rec.get('fhasta')) && rec.get('idtipodocidentidad') == values.idtipodocidentidad) {
              	if (isActual(rec.get('fdesde'), rec.get('fhasta'), values.fdesde) == 1 || (!Ext.isEmpty(values.fhasta) && isActual(rec.get('fdesde'), rec.get('fhasta'), values.fhasta) == 1)) {
              		index = 'Cruce de fechas';
              		return false;
            	}
          	}
        });

        switch (index) {
            case 'principal':
               
            	Ext.Notification.show({
                       title: 'Error',
                  msg: 'La persona posee registrado un documento de identidad como principal.',
                  icon: 'error'
                    });
                break;
            case 'Tipo doc identidad':
              
            Ext.Notification.show({
                      title: 'Error',
                  msg: 'El documento de indentificación que quiere adicionar ya existe.',
                  icon: 'error'
                    });
                break;  
            case 'Cruce de fechas':
              
            Ext.Notification.show({
                      title: 'Error',
                  msg: 'Verifique las fechas, no pueden encontrarse en el intervalo de otro documento del mismo tipo.',
                  icon: 'error'
                    });
                break;  
            case 'Cruce de fechas':
              Ext.Notification.show({
                      title: 'Error',
                  msg: 'Verifique las fechas, no pueden encontrarse en el intervalo de otro documento del mismo tipo.',
                  icon: 'error'
                    });
                break;  
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                  
                   Ext.Notification.show({
                     title: 'Error',
                      msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                      icon: 'error'
                    });
                 
                }
                break;
        }
    }
  
   store.clearGrouping();
   store.groupBy('historico', true);
  
   function isActual(fi, ff, fa)
   {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      if (Ext.isEmpty(fa)) {
         var date = new Date();
      	 date = date.format('d/m/Y');
      } else {
         date = fa;
      }     
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function ()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
    var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el documento de identificación seleccionado?' : 
    '¿Está seguro que quiere eliminar los documentos de identificación seleccionados?';
     
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
               
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('iddocidentidad'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar documento de identificación",
        ttBtnMod:"Modificar documento de identificación",
        ttBtnDel:"Eliminar documento de identificación",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomtipodocidentidad = Ext.getCmp("92" + this.idpadre).getRawValue();

    values.principal = values.principal == "on" ? true : false;
  	values.historico = isActual(values.fdesde, values.fhasta);

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.iddocidentidad)) {
        values.iddocidentidad = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('principal') == true && values.principal != false && rec.get('historico') == 1 && values.historico == 1) {
                index = 'principal';
                return false;
            }
            if (rec.get('idtipodocidentidad') == values.idtipodocidentidad && rec.get('historico') == 1 && values.historico == 1) {
                index = 'Tipo doc identidad';
                return false;
            }
          	if (!Ext.isEmpty(rec.get('fhasta')) && rec.get('idtipodocidentidad') == values.idtipodocidentidad) {
              	if (isActual(rec.get('fdesde'), rec.get('fhasta'), values.fdesde) == 1 || (!Ext.isEmpty(values.fhasta) && isActual(rec.get('fdesde'), rec.get('fhasta'), values.fhasta) == 1)) {
              		index = 'Cruce de fechas';
              		return false;
            	}
          	}
          	
        });

        switch (index) {
            case 'principal':
             
            Ext.Notification.show({
                      title: 'Error',
                      msg: 'La persona posee registrado un documento de identidad como principal.',
                      icon: 'error'
                    });
        
                break;
            case 'Tipo doc identidad':
              
             Ext.Notification.show({
                      title: 'Error',
                      msg: 'El documento de indentificación que quiere adicionar ya existe.',
                      icon: 'error'
                    });
                break;
            case 'Cruce de fechas':
              Ext.Notification.show({
                      title: 'Error',
                  msg: 'Verifique las fechas, no pueden encontrarse en el intervalo de otro documento del mismo tipo.',
                  icon: 'error'
                    });
                break;  
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    
                     Ext.Notification.show({
                      title: 'Error',
                      msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                      icon: 'error'
                    });
                 
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('iddocidentidad') != values.iddocidentidad) {              
                if (rec.get('principal') == true && values.principal != false && rec.get('historico') == 1 && values.historico == 1) {
                    index = 'principal';
                    return false;
                }
                if (rec.get('idtipodocidentidad') == values.idtipodocidentidad && rec.get('historico') == 1 && values.historico == 1) {
                    index = 'Tipo doc identidad';
                    return false;
                }
                if (!Ext.isEmpty(rec.get('fhasta')) && rec.get('idtipodocidentidad') == values.idtipodocidentidad) {
              		if (isActual(rec.get('fdesde'), rec.get('fhasta'), values.fdesde) == 1 || (!Ext.isEmpty(values.fhasta) && isActual(rec.get('fdesde'), rec.get('fhasta'), values.fhasta) == 1)) {
              			index = 'Cruce de fechas';
              			return false;
            		}
          		}
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'principal':
              	 
             Ext.Notification.show({
                    title: 'Error',
                      msg: 'La persona posee registrado un documento de identidad como principal.',
                      icon: 'error'
                    });
          
                break;
            case 'Tipo doc identidad':
             	 
              Ext.Notification.show({
                    title: 'Error',
                      msg: 'El documento de indentificación ya existe.',
                      icon: 'error'
                    });
                break;
            case 'Cruce de fechas':
              Ext.Notification.show({
                      title: 'Error',
                  msg: 'Verifique las fechas, no pueden encontrarse en el intervalo de otro documento del mismo tipo.',
                  icon: 'error'
                    });
                break;  
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    
                    Ext.Notification.show({
                    title: 'Error',
                      msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                      icon: 'error'
                    });
                }
                break;
        }
    }
  
   store.clearGrouping();
   store.groupBy('historico', true);
  
   function isActual(fi, ff, fa)
   {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      if (Ext.isEmpty(fa)) {
         var date = new Date();
      	 date = date.format('d/m/Y');
      } else {
         date = fa;
      }     
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
}
,
helpHandler:function()
{
var title = 'Ayuda de Tipos de nodos';
var referencia = 'RH/Registro/Clientes/principal';
help.show(title, referencia);
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
    var record=this.gpGrid.getSelectionModel().getSelected();
  	Ext.getCmp("93" + this.idpadre).enable();
    Ext.getCmp("93" + this.idpadre).minLength=record.data.mincaracter;
    Ext.getCmp("93" + this.idpadre).maxLength=record.data.maxcaracter;
    Ext.getCmp("93" + this.idpadre).vtype=record.data.type;
    Ext.getCmp("93" + this.idpadre).maxLengthText='El tamaño máximo permitido es de '+record.data.maxcaracter+' caracteres.';
    Ext.getCmp("93" + this.idpadre).minLengthText='El tamaño mínimo permitido es de '+record.data.mincaracter+' caracteres.';
    Ext.getCmp("93" + this.idpadre).render();

},
saveFn:function (btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
           {
             if (rec.data.add) {//Si es un record que se adiciono nuevo
               this.arrAdd.push(rec.data);
             } else {
               if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                 this.arrMod.push(rec.data);
               }
             }
             if (rec.get('principal') == true) {
               pass = true;
             }
           }, this);
  if (!pass && this.obligatorio) {
      notification({
        title: 'Error',
        msg: 'La persona debe tener un tipo de documento como principal.',
        icon: 'error'
      });  
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0) {
    url = 'modDocIdentidad';
  } else
    if (this.arrDel.length > 0) {
      url = 'delDocIdentidad';
    } else {
      url = 'addDocIdentidad';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg;
          switch (url) {
            case 'modDocIdentidad':
              msg = 'El(Los) documento(s) de identificación  ha(n) sido modificado satisfactoriamente.';
              break;
            case 'delDocIdentidad':
              msg = 'El(Los) documento(s) de identificación  ha(n) sido eliminado satisfactoriamente.';
              break;
            case 'addDocIdentidad':
              msg = 'El(Los) documento(s) de identificación ha(n) sido adicionado(s) satisfactoriamente.';
              break
          }         
            notification({
              title: 'Informaci&oacute;n',
              msg: msg,
              icon: 'ok'
          	}); 
        } else {
          switch (dataResponse.codigo) {
            default :
             notification({
                title: 'Error',
                msg: 'H ocurrido un error durante la transacción.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getDocIdentidad",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "iddocidentidad"},
    {name: "idtipodocidentidad"},
    {name: "denomtipodocidentidad"},
    {name: "numero"},
    {name: "principal"},
    {name: "type"},
    {name: "maxcaracter"},
    {name: "mincaracter"},
    {name: "serie"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "historico"}
  ],
  sortInfo: {field: 'historico', direction: "DESC"},
  groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Documentos de identificaci&oacute;n" : "Documento de identificaci&oacute;n"]})'
},
listeners:{

},
};
/**
 * Componente Familiares y amigos
 */
Ext.persona.cmp1180 = {

};
/**
 * Componente Afiliaciones
 */
Ext.persona.cmp1028 = {
isDirty:function(idpersona){
  //Grid de afiliaciones
  //Grid de Trayectoria de cargos
  return Ext.getCmp("1029" + this.idpadre).isDirty() && Ext.getCmp("1035" + this.idpadre).isDirty();
}
  ,
loadFn:function(idpersona){
  //Grid de afiliaciones
  Ext.getCmp("1029" + this.idpadre).loadGridStore({idpersona: idpersona});
  //Grid de Trayectoria de cargos
  Ext.getCmp("1035" + this.idpadre).loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress)
{
  //Grid de afiliaciones
  var arrAfil = Ext.getCmp("1029" + this.idpadre).saveFn();
  //Grid de Trayectoria de cargos
  var arrCargos = Ext.getCmp("1035" + this.idpadre).saveFn();
  Ext.each(arrAfil.arrAdd, function (rec)
           {
             if (rec.add) {
               rec.DatCargoorganizacion = new Array();
               Ext.each(arrCargos.arrAdd, function (v, i)
                        {
                          if (v.idafiliacion === rec.idafiliacion) {
                            rec.DatCargoorganizacion.push(v);
                            arrCargos.arrAdd.splice(i, 1);
                          }
                        }, this);
             }
           }, this);

  var url = '';
  if (arrAfil.arrMod.length > 0 || (arrAfil.arrDel.length > 0 && arrAfil.arrAdd.length > 0) ||
      arrCargos.arrMod.length > 0 || (arrCargos.arrDel.length > 0 && arrCargos.arrAdd.length > 0)) {
    url = 'modAfiliaciones';
  } else
    if (arrAfil.arrDel.length > 0 || arrCargos.arrDel.length > 0) {
      url = 'delAfiliaciones';
    } else {
      url = 'addAfiliaciones';
    }

  if (arrAfil.arrAdd.length > 0 || arrAfil.arrMod.length > 0 || arrAfil.arrDel.length > 0 ||
      arrCargos.arrAdd.length > 0 || arrCargos.arrMod.length > 0 || arrCargos.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAfil: Ext.encode(arrAfil),
        arrCargos: Ext.encode(arrCargos),
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          var msg;
          switch (url) {
            case 'modAfiliaciones':
              msg = 'La(s) afiliación(es) ha(n) sido modificada(s) satisfactoriamente.';
              break;
            case 'delAfiliaciones':
              msg = 'La(s) afiliación(es) ha(n) sido eliminada(s) satisfactoriamente.';
              break;
            case 'addAfiliaciones':
              msg = 'La(s) afiliación(es) ha(n) sido adicionada(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
listeners:{
expand:function(cmp){
	cmp.doLayout();
},
resize:function(){
	//Grid Trayectoria de cargos
  Ext.getCmp('1035'+this.idpadre).setWidth('50%');
},

},
};
/**
 * Componente Transportación
 */
Ext.persona.cmp6 = {
columns:[
  {dataIndex: "historico", hidden:true, renderer: function(v){return (v == 0) ? 'Actual' : 'Hist&oacute;rico';}},
  {header: "Estructura de transportación", width: 255, dataIndex: "ruta"},
  {header: "Desde", width: 100, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, dataIndex: "fhasta"}
],
aplicarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.historico = fnHistorico(values.fdesde, values.fhasta);
  values.denomtransportacion = Ext.getCmp("8" + this.idpadre).getRawValue();
  values.ruta = Ext.getCmp("8" + this.idpadre).getRawValue();
  values.idestructuratransportacion = Ext.getCmp("8" + this.idpadre).getValue();
  values.add = true;
  var store = this.gpGrid.getStore();
  var control = 0;
  Ext.each(store.getRange(), function(rec){
    if(rec.get('idestructuratransportacion') == values.idestructuratransportacion && rec.get('historico') == 0) {
      control = 1;
      return false;
    }
  });
  if(control == 1) {
    mostrarMensaje(6, 'El servicio de transportaci&oacute;n que quiere adicionar ya se encuentra activo para la persona.');
  } else {
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch(error){
      mostrarMensaje(4, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
  function fnHistorico(fi, ff){
    if(!Ext.isEmpty(ff)) {
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 0 : 1;
    }
    return 0;
  }
},
eliminarHandler:function()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el servicio de transportaci&oacute;n seleccionado?' : 
    '¿Está seguro que quiere eliminar los servicios de transportaci&oacute;n seleccionado?';
  mostrarMensaje(2, ask, function (btn) {
    if (btn == 'ok') {
     
      Ext.each(records, function (rec) {
        if (!rec.data.add) {
          this.arrDel.push(rec.get('idservtransportacion'));
        }
        this.gpGrid.getStore().remove(rec);
      }, this);
      this.gpGrid.getView().refresh();
    }
  }.createDelegate(this));
},
getLanguaje:function(idioma)
{
  var lang={};
  if(idioma==='es'){
    lang ={
      ttBtnAdd:"Adicionar servicio de transportaci&oacute;n",
      ttBtnMod:"Modificar servicio de transportaci&oacute;n",
      ttBtnDel:"Eliminar servicio de transportaci&oacute;n",
      ttBtnSave:"Guardar datos y cerrar formulario",
      ttBtnApl:"Guardar datos y limpiar los campos",
      ttBtnCancel:"Cerrar formulario sin guardar los datos"
    }
  } else {
    lang = {}
  }
  return lang;
},
guardarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.historico = fnHistorico(values.fdesde, values.fhasta);
  values.denomtransportacion = Ext.getCmp("8" + this.idpadre).getRawValue();
  values.ruta = Ext.getCmp("8" + this.idpadre).getRawValue();
  values.idestructuratransportacion = Ext.getCmp("8" + this.idpadre).getValue();
  
 
  var store = this.gpGrid.getStore();
  var control = false;
  if(Ext.isEmpty(values.idservtransportacion)){
    values.idservtransportacion = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function(rec){
      if (rec.get('idestructuratransportacion') == values.idestructuratransportacion && rec.get('historico') == 0){
        control = true;
        return false;
      }
    });
    if(control){
      mostrarMensaje(6, 'El servicio de transportaci&oacute;n que quiere adicionar ya se encuentra activo para la persona.');
    } else {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte con el administrador.');
      }
    }
  } else {
    var reco= this.gpGrid.getSelectionModel().getSelected();  
    var record;
    Ext.each(store.getRange(), function(rec) {
      
      if(isNaN(values.idestructuratransportacion)){
            values.idestructuratransportacion=reco.get('idestructuratransportacion');
          }
      
      
      if(rec.get('idservtransportacion') != values.idservtransportacion) {
        if (rec.get('idestructuratransportacion') == values.idestructuratransportacion && rec.get('historico') == 0) {
          control = true;
          return false;
        }
      } else {
        record = rec;
      }
      
      
    });
    
    if(control) {
      mostrarMensaje(6, 'El servicio de transportaci&oacute;n ya se encuentra activo para la persona.');
    } else {
      try {
        for(var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte el administrador.');
      }
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
  function fnHistorico(fi, ff){
    if(!Ext.isEmpty(ff)) {
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 0 : 1;
    }
    return 0;
  }
},
loadFn:function(idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){  
  var record = this.gpGrid.getSelectionModel().getSelected();  
  this.loadFormulario(record);

},
saveFn:function(btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function(rec) {
    if(rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if(!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarServTransportacion',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
        } else {
          mostrarMensaje(6, dataResponse.mensaje);
        }
      }.createDelegate(this)
    }, this);
  }
},
validateForm:function(){
  if(this.fpFormulario.getForm().isValid()) {
    return true;
  } else {
    return false;
  }
},
sm:{singleSelect: true},
store:{
  url: "obtenerServTransportacionPorPersona",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "",
    root: "data"
  },
  mapping: [
    {name: "idservtransportacion"},
    {name: "idpersona"},   
    {name: "denomtransportacion"},
    {name: "idestructuratransportacion"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "historico"},
    {name:	"ruta"}
  ],
  sortInfo: {field: 'historico', direction: "DESC"},
  groupField: 'historico'
},
view:{
  forceFit: true,
  type: 'GroupingView',
  startCollapsed: false,
  groupTextTpl: '{group}'
},
listeners:{

},
};
/**
 * Componente Alojamiento
 */
Ext.persona.cmp19 = {
columns:[
  {dataIndex: "historico", hidden:true, renderer: function(v){return (v == 0) ? 'Actual' : 'Hist&oacute;rico';}},
  {header: "Estructura de alojamiento", width: 255, dataIndex: "denomalojamiento"},
  {header: "Desde", width: 100, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, dataIndex: "fhasta"}
],
aplicarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.historico = fnHistorico(values.fdesde, values.fhasta);
  values.denomalojamiento = Ext.getCmp("21" + this.idpadre).getRawValue();
  values.idestructuraalojamiento = Ext.getCmp("21" + this.idpadre).getValue();
  values.add = true;
  var store = this.gpGrid.getStore();
  var control = 0;
  Ext.each(store.getRange(), function(rec){
    if(rec.get('idestructuraalojamiento') == values.idestructuraalojamiento && rec.get('historico') == 0) {
      control = 1;
      return false;
    }
  });
  if(control == 1) {
    mostrarMensaje(6, 'El servicio de alojamiento que quiere adicionar ya se encuentra activo para la persona.');
  } else {
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch(error){
      mostrarMensaje(4, 'Ha ocurrido un error mientras se guardaba, contacte el administrador.');
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
  function fnHistorico(fi, ff){
    if(!Ext.isEmpty(ff)) {
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 0 : 1;
    }
    return 0;
  }
},
eliminarHandler:function()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el servicio de alojamiento seleccionado?' : 
    '¿Está seguro que quiere eliminar los servicios de alojamiento seleccionados?';
  mostrarMensaje(2, ask, function (btn) {
    if (btn == 'ok') {
      
      Ext.each(records, function (rec) {
        if (!rec.data.add) {
          this.arrDel.push(rec.get('idservalojamiento'));
        }
        this.gpGrid.getStore().remove(rec);
      }, this);
      this.gpGrid.getView().refresh();
    }
  }.createDelegate(this));
},
getLanguaje:function(idioma)
{
  var lang={};
  if(idioma==='es'){
    lang ={
      ttBtnAdd:"Adicionar servicio de alojamiento",
      ttBtnMod:"Modificar servicio de alojamiento",
      ttBtnDel:"Eliminar servicio de alojamiento",
      ttBtnSave:"Guardar datos y cerrar formulario",
      ttBtnApl:"Guardar datos y limpiar los campos",
      ttBtnCancel:"Cerrar formulario sin guardar los datos"
    }
  } else {
    lang = {}
  }
  return lang;
},
guardarHandler:function()
{
  var values = this.fpFormulario.getForm().getValues();
  values.historico = fnHistorico(values.fdesde, values.fhasta);
  values.denomalojamiento = Ext.getCmp("21" + this.idpadre).getRawValue();
  values.idestructuraalojamiento = Ext.getCmp("21" + this.idpadre).getValue();
  var store = this.gpGrid.getStore();
  var control = false;
  if(Ext.isEmpty(values.idservalojamiento)){
    values.idservalojamiento = Ext.id();
    values.add = true;
    Ext.each(store.getRange(), function(rec){
      if (rec.get('idestructuraalojamiento') == values.idestructuraalojamiento && rec.get('historico') == 0){
        control = true;
        return false;
      }
    });
    if(control){
      mostrarMensaje(6, 'El servicio de alojamiento que quiere adicionar ya se encuentra activo para la persona.');
    } else {
      try {
        store.add(new Ext.data.Record(values));
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte con el administrador.');
      }
    }
  } else {
    var reco= this.gpGrid.getSelectionModel().getSelected();  
    var record;
    Ext.each(store.getRange(), function(rec) {
      
      
       if(isNaN(values.idestructuraalojamiento)){
            values.idestructuraalojamiento=reco.get('idestructuraalojamiento');
          }
      
      if(rec.get('idservalojamiento') != values.idservalojamiento) {
        if (rec.get('idestructura') == values.idestructura && rec.get('historico') == 0) {
          control = true;
          return false;
        }
      } else {
        record = rec;
      }
    });
    if(control) {
      mostrarMensaje(6, 'El servicio de alojamiento ya se encuentra activo para la persona.');
    } else {
      try {
        for(var p in values) {
          if (values[p] != record.get(p)) {
            record.set(p, values[p]);
          }
        }
        this.cancelarHandler();
      } catch(error) {
        mostrarMensaje(6, 'Ha ocurrido un error, contacte el administrador.');
      }
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
  function fnHistorico(fi, ff){
    if(!Ext.isEmpty(ff)) {
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 0 : 1;
    }
    return 0;
  }
},
loadFn:function(idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function(rec) {
    if(rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if(!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestionarServAlojamiento',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los cambios han sido aplicados satisfactoriamente');
        } else {
          mostrarMensaje(6, dataResponse.mensaje);
        }
      }.createDelegate(this)
    }, this);
  }
},
validateForm:function(){
  if(this.fpFormulario.getForm().isValid()) {
    return true;
  } else {
    return false;
  }
},
sm:{singleSelect: true},
store:{
  url: "obtenerServAlojamientoPorPersona",
  type: "GroupingStore",
  reader: {
    type: "JsonReader",
    totalProperty: "",
    root: "data"
  },
  mapping: [
    {name: "idservalojamiento"},
    {name: "idpersona"},
    {name: "idestructura"},
    {name: "denomalojamiento"},
    {name: "idestructuraalojamiento"},
    {name: "fdesde"},
    {name: "historico"}
    
  ],
  sortInfo: {field: 'historico', direction: "DESC"},
  groupField: 'historico'
},
view:{
  forceFit: true,
  type: 'GroupingView',
  startCollapsed: false,
  groupTextTpl: '{group}'
},
listeners:{

},
};
/**
 * Componente Datos fenotípicos
 */
Ext.persona.cmp101 = {
gSecurity:function(){
  var resp = true;
  if(Ext.isEmpty(this.getForm().getValues().idfenotipo)){
    if(parseInt(this.segAction[0]) === 1){ //Si puede adicionar
      resp = false;
    }
  }else{
  	if(parseInt(this.segAction[1]) === 1){//Si puede modificar
      resp = false;
    }
  }
  if(resp)
    Ext.getCmp("101" + this.idpadre).getForm().reset();
  return resp;
},
loadFn:function(idpersona){
  Ext.Ajax.request({
    url: 'getDatosFenotipicos',
    params: {idpersona: idpersona},
    success: function (response, opt)
    {
      var dataResponse = Ext.decode(response.responseText);
      if (dataResponse.data.length != 0) {
        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
        this.getForm().findField('idcolorojos').setRawValue(dataResponse.data.ojos);
        this.getForm().findField('idcolorpiel').setRawValue(dataResponse.data.piel);
        this.getForm().findField('idcolorpelo').setRawValue(dataResponse.data.pelo);
        this.getForm().findField('idgruposanguineo').setRawValue(dataResponse.data.gruposanguineo);
      }
    }.createDelegate(this)
  });
},
saveFn:function (btnPress, close)
{
  //if(Ext.getCmp("101" + this.idpadre).gSecurity())return; //Si devuelve TRUE es porque tiene permisos para realizar la gestion correspondiente
    
  if (this.getForm().isValid() && this.getForm().isDirty()) {      
        var url = (Ext.isEmpty(this.getForm().getValues().idfenotipo)) ? 'addDatosFenotipicos' : 'modDatosFenotipicos';
        Ext.sendAjax.request({
            url: url,
            params: this.getForm().getValues(),
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                  if(close == true) {
                    Ext.getCmp("101" + this.idpadre).ownerCt.ownerCt.removeConcept(Ext.getCmp("101" + this.idpadre), true);
                  } else
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        if (dataResponse.data) {
                            this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
                            this.getForm().findField('idcolorojos').setRawValue(dataResponse.data.ojos);
                            this.getForm().findField('idcolorpiel').setRawValue(dataResponse.data.piel);
                            this.getForm().findField('idcolorpelo').setRawValue(dataResponse.data.pelo);
                            this.getForm().findField('idgruposanguineo').setRawValue(dataResponse.data.gruposanguineo);
                        }
                    }
                    var msg = '';
                    switch (url) {
                        case 'addDatosFenotipicos':
                            msg = 'Los datos fenotipicos se ha adicionado satisfactoriamente.';
                            break;
                        case 'modDatosFenotipicos':
                            msg = 'Los datos fenotipicos se ha modificado satisfactoriamente.';
                            break;
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }

            }.createDelegate(this)
        }, this);
    }
},
listeners:{

},
};
/**
 * Componente Datos de contacto
 */
Ext.persona.cmp123 = {
columns:[
  {header: "Tipo contacto", width: 150, sortable: true, dataIndex: "denomtipocontacto"},
  {header: "Medio de contacto", width: 150, sortable: true, dataIndex: "denomtipomediocontacto"},
  {header: "Contacto", width: 220, sortable: true, dataIndex: "contacto"},
  {header: "Principal", width: 60, sortable: true, dataIndex: "oficial", renderer: function (val)
   {
     if (val == true) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }
     return '';
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomtipocontacto = Ext.getCmp("125" + this.idpadre).getRawValue();

    values.denomtipomediocontacto = Ext.getCmp("1236" + this.idpadre).getRawValue();

    values.oficial = values.oficial == "on" ? true : false;

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcontacto)) {
        values.idcontacto = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idtipomediocontacto') == values.idtipomediocontacto && rec.get('oficial') == values.oficial) {
                index = 'oficial';
                return false;
            }
            if (rec.get('contacto') == values.contacto) {
                index = 'contacto';
                return false;
            }
        });
        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'Ya se ha registrado este medio de contacto como principal.',
                    icon: 'error'
                });
                break;
            case 'contacto':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El contacto que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el conctacto seleccionado?' : 
    '¿Está seguro que quiere eliminar los conctactos seleccionados?';
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {                  
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idcontacto'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar dato de contacto",
        ttBtnMod:"Modificar dato de contacto",
        ttBtnDel:"Eliminar dato de contacto",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomtipocontacto = Ext.getCmp("125" + this.idpadre).getRawValue();

    values.denomtipomediocontacto = Ext.getCmp("1236" + this.idpadre).getRawValue();

    values.oficial = values.oficial == "on" ? true : false;

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcontacto)) {
        values.idcontacto = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
           if (rec.get('idtipomediocontacto') == values.idtipomediocontacto && rec.get('oficial') == values.oficial) {
                index = 'oficial';
                return false;
            }
            if (rec.get('contacto') == values.contacto) {
                index = 'contacto';
                return false;
            }
        });
        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'Ya se ha registrado este medio de contacto como principal.',
                    icon: 'error'
                });
                break;
            case 'contacto':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El contacto que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcontacto') != values.idcontacto) {
               if (rec.get('idtipomediocontacto') == values.idtipomediocontacto && rec.get('oficial') == values.oficial) {
                    index = 'oficial';
                    return false;
                }
                if (rec.get('contacto') == values.contacto) {
                    index = 'contacto';
                    return false;
                }
            } else {
                record = rec;
            }
        });

        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'Ya se ha registrado este medio de contacto como principal.',
                    icon: 'error'
                });
                break;
            case 'contacto':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El contacto ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
        if (rec.get('oficial') == true) {
            pass = true;
        }
    }, this);
    if (!pass && this.obligatorio) {
        Ext.Notification.show({
            title: 'Advertencia',
            msg: 'La persona debe tener un contacto como principal',
            icon: 'warning'
        });
        return false;
    }
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modContactos';
    } else
        if (this.arrDel.length > 0) {
            url = 'delContactos';
        } else {
            url = 'addContactos';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modContactos':
                            msg = 'El(Los) contacto(s) ha(n) sido modificado(s) satisfactoriamente.';
                            break;
                        case 'delContactos':
                            msg = 'El(Los) contacto(s) ha(n) sido eliminado(s) satisfactoriamente.';
                            break;
                        case 'addContactos':
                            msg = 'El(Los) contacto(s) ha(n) sido adicionado(s) satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: 'RowSelectionModel',
    singleSelect: false
},
store:{
  url: "getContactos",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idcontacto"},
          {name: "contacto"},
          {name: "oficial"},
          {name: "idtipomediocontacto"},
          {name: "denomtipomediocontacto"},
          {name: "idtipocontacto"},
          {name: "denomtipocontacto"},
        ]
},
listeners:{

},
};
/**
 * Componente Estado de salud
 */
Ext.persona.cmp1054 = {
isDirty:function(idpersona){
  //Grid de Padecimientos
  //Formulario de estado de salud
  return Ext.getCmp("1055" + this.idpadre).isDirty() && Ext.getCmp("1061" + this.idpadre).isDirty();
},
loadFn:function(idpersona){
  //Grid de afecciones
  Ext.getCmp("1055" + this.idpadre).loadFn(idpersona);
  //Formulario de estado de salud
  Ext.getCmp("1061" + this.idpadre).loadFn(idpersona);
},
saveFn:function (btnPress)
{
  //Grid de afecciones
  var arrAfec = Ext.getCmp("1055" + this.idpadre).saveFn();
  //Formulario de estados de salud
  var dataForm = Ext.getCmp("1061" + this.idpadre).saveFn();
  
  var url = '';
  if (arrAfec.arrMod.length > 0 || (arrAfec.arrDel.length > 0 && arrAfec.arrAdd.length > 0) ||
      dataForm.arrMod.length > 0) {
    url = 'modAllDatosSalud';
  } else
    if (arrAfec.arrDel.length > 0) {
      url = 'delAllDatosSalud';
    } else {
      url = 'addAllDatosSalud';
    }

  if (arrAfec.arrAdd.length > 0 || arrAfec.arrMod.length > 0 || arrAfec.arrDel.length > 0 ||
      dataForm.arrAdd.length > 0 || dataForm.arrMod.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAfec: Ext.encode(arrAfec),
        dataForm: Ext.encode(dataForm),
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          var msg;
          switch (url) {
            case 'modAllDatosSalud':
              msg = 'El(Los) dato(s) de salud ha(n) sido modificado(s) satisfactoriamente.';
              break;
            case 'delAllDatosSalud':
              msg = 'El(Los) dato(s) de salud ha(n) sido eliminado(s) satisfactoriamente.';
              break;
            case 'addAllDatosSalud':
              msg = 'El(Los) dato(s) de salud ha(n) sido adicionado(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transacción.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
listeners:{
expand:function(cmp){
	cmp.doLayout();
},

},
};
/**
 * Componente Categorías científicas
 */
Ext.persona.cmp1086 = {
columns:[
  {header: "Tipo de categoría", width: 220, sortable: true, dataIndex: "denomtipocategoria"},
  {header: "Categor&iacute;a", width: 220, sortable: true, dataIndex: "denomcategoria"},  
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion del tipo de categoria selecionada
    values.denomtipocategoria = Ext.getCmp("1088" + this.idpadre) ? Ext.getCmp("1088" + this.idpadre).getRawValue():'';

    values.denomcategoria = Ext.getCmp("1089" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcategorizacion)) {
        values.idcategorizacion = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcategoria') == values.idcategoria) {
                index = 'categoria';
                return false;
            }
        });

        switch (index) {
            case 'categoria':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La categoría científica que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la categor&iacute;a seleccionada?' : 
    '¿Está seguro que quiere eliminar las categor&iacute;as seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {                
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idcategorizacion'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar categoría científica",
        ttBtnMod:"Modificar categoría científica",
        ttBtnDel:"Eliminar categoría científica",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion del tipo de categoria selecionada
    values.denomtipocategoria = Ext.getCmp("1088" + this.idpadre) ? Ext.getCmp("1088" + this.idpadre).getRawValue():'';

    values.denomcategoria = Ext.getCmp("1089" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idcategorizacion)) {
        values.idcategorizacion = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcategoria') == values.idcategoria) {
                index = 'categoria';
                return false;
            }
        });

        switch (index) {
            case 'categoria':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La categoría científica que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idcategorizacion') != values.idcategorizacion) {                
                if (rec.get('idcategoria') == values.idcategoria) {
                	index = 'categoria';
                	return false;
            	}
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'categoria':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La categoría científica ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona) {
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'La categoría científica que quiere adicionar ya existe.',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'modCategoriasCientificasPersona';
   } else
     if (this.arrDel.length > 0) {
       url = 'delCategoriasCientificasPersona';
     } else {
       url = 'addCategoriasCientificasPersona';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'modCategoriasCientificasPersona':
               msg = 'La(s) categoría(s) científica(s) ha(n) sido modificada(s) satisfactoriamente.';
               break;
             case 'delCategoriasCientificasPersona':
               msg = 'La(s) categoría(s) científica(s) ha(n) sido eliminada(s) satisfactoriamente.';
               break;
             case 'addCategoriasCientificasPersona':
               msg = 'La(s) categoría(s) científica(s) ha(n) sido adicionada(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getCategoriasCientificasByPersona",
    type: "Store",
      baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idcategorizacion"},
          {name: "idcategoria"},
          {name: "denomcategoria"},
          {name: "idtipocategoria"},
          {name: "denomtipocategoria"},
          {name: "fdesde"},
          {name: "fhasta"}
        ]
},
listeners:{

},
};
/**
 * Componente Datos de tallaje
 */
Ext.persona.cmp1142 = {
columns:[
  {header: "Prenda", width: 220, sortable: true, dataIndex: "denomprenda"},
  {header: "Norma", width: 220, sortable: true, dataIndex: "denomnorma"},  
  {header: "Talla", width: 100, sortable: true, dataIndex: "denomtalla"} 
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion de la talla selecionada
    values.denomtalla = Ext.getCmp("1146" + this.idpadre).getRawValue();
	//Obteniendo la denominacion de la prenda selecionada
    values.denomprenda = Ext.getCmp("1144" + this.idpadre).getRawValue();
  	//Obteniendo la denominacion de la norma selecionada
    values.denomnorma = Ext.getCmp("1145" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idtallaje)) {
        values.idtallaje = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idprenda') == values.idprenda) {
                index = 'prenda';
                return false;
            }
        });

        switch (index) {
            case 'prenda':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El dato de tallaje que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){  
  	var records = this.gpGrid.getSelectionModel().getSelections();
   	var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el dato de tallaje seleccionado?' : 
    '¿Está seguro que quiere eliminar los datos de tallaje seleccionados?';
  
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {

                var records = this.gpGrid.getSelectionModel().getSelections();
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idtallaje'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);
                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar datos de tallaje",
        ttBtnMod:"Modificar datos de tallaje",
        ttBtnDel:"Eliminar datos de tallaje",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion de la talla selecionada
    values.denomtalla = Ext.getCmp("1146" + this.idpadre).getRawValue();
	//Obteniendo la denominacion de la prenda selecionada
    values.denomprenda = Ext.getCmp("1144" + this.idpadre).getRawValue();
  	//Obteniendo la denominacion de la norma selecionada
    values.denomnorma = Ext.getCmp("1145" + this.idpadre).getRawValue();

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idtallaje)) {
        values.idtallaje = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idprenda') == values.idprenda) {
                index = 'prenda';
                return false;
            }
        });

        switch (index) {
            case 'prenda':
                Ext.Notification.show({
                    title: 'Error',
                    //msg: 'La prenda <b>' + values.denomprenda + '</b> ya se ha registrado.',
                  	msg: 'El dato de tallaje que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idtallaje') != values.idtallaje) {                
                if (rec.get('idprenda') == values.idprenda) {
                	index = 'prenda';
                	return false;
            	}
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'prenda':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El dato de tallaje ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'La persona debe tener alg&uacute;n dato de tallaje registrado',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'modTallaje';
   } else
     if (this.arrDel.length > 0) {
       url = 'delTallaje';
     } else {
       url = 'addTallaje';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'modTallaje':
               msg = 'El(Los) dato(s) de tallaje(s) ha(n) sido modificado(s) satisfactoriamente.';
               break;
             case 'delTallaje':
               msg = 'El(Los) dato(s) de tallaje(s) ha(n) sido eliminado(s) satisfactoriamente.';
               break;
             case 'addTallaje':
               msg = 'El(Los) dato(s) de tallaje(s) ha(n) sido adicionado(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getTallaje",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idtallaje"},
          {name: "idprenda"},
          {name: "denomprenda"},
          {name: "idnorma"},
          {name: "denomnorma"},
          {name: "idtalla"},
          {name: "denomtalla"}
        ]
},
listeners:{

},
};
/**
 * Componente Relaciones con extranjeros
 */
Ext.persona.cmp1223 = {
columns:[ 
  {header: "Familiar", width:270, dataIndex: "nombre"},
  {header: "Nacionalidad",width:100, dataIndex: "nacionalidad"
  , renderer: function (value, meta, record) {
     return "<div class='flags_img " + record.get('bandera') + "' style='width: 16px; height: 16px;'><p style='margin-left: 20px; margin-top: 2px;'>" + value + "</p></div>";
   }},
  {header: "Pais",width:130, dataIndex: "pais"},
  {header: "Parentesco",width:130, dataIndex: "parentesco"}, 
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.nombre = Ext.getCmp("1238" + this.idpadre).getRawValue();
    values.pais = Ext.getCmp("1240" + this.idpadre).getRawValue();
   values.nacionalidad = Ext.getCmp("1240" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarresidente)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarresidente = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliar':
                Ext.Notification.show({
                    title: 'Error',                  
                  	msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();  
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la relaci&oacute;n seleccionada?' : 
    '¿Está seguro que quiere eliminar las relaciones seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idfamiliarresidente'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar familar",
        ttBtnMod:"Modificar familar",
        ttBtnDel:"Eliminar familar",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
     values.nombre = Ext.getCmp("1238" + this.idpadre).getRawValue();
    values.pais = Ext.getCmp("1239" + this.idpadre).getRawValue();
  values.nacionalidad = Ext.getCmp("1240" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.idfamiliarresidente)) {//Si es vacio es porke estoy adicionando
        values.idfamiliarresidente = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idfamiliar') == values.idfamiliar) {
                index = 'idfamiliar';
                return false;
            }
        });
        switch (index) {
            case 'idfamiliarresidente':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('idfamiliarresidente') == values.idfamiliarresidente) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('idfamiliar') == values.idfamiliar) {
                    index = 'idfamiliar';
                }
        });
        switch (index) {
            case 'idfamiliarresidente':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El familiar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec) {
    if (rec.data.add) {
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {
        this.arrMod.push(rec.data);
      }
    }
  }, this);
  if(this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: 'gestFamiliarRelaciones',
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification) {
        var dataResponse = Ext.decode(response.responseText);
        if(dataResponse.success) {
          if(btnPress === 'APLICAR') {
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          mostrarMensaje(1, 'Los datos han sido gestionados satisfactoriamente.');
          this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
        } else {
         mostrarMensaje(6, 'Error al procesar los datos.');
        }
      }.createDelegate(this)
    }, this);
  }
},
store:{
  url: "getFamiliarRelacionesByPesona",
  type: "Store",
  reader: {
    type: "JsonReader",
    totalProperty: "quantity",
    root: "data"
  },
  mapping: [
    {name: "idfamiliarresidente"},
    {name: "fdesde"},
    {name: "fhasta"},
    {name: "idpais"},
    {name: "idfamiliar"},
    {name: "nombre"},
    {name: "pais"},
    {name: "idnacionalidad"},
    {name: "nacionalidad"},
    {name: "bandera"},
     {name: "idparentesco"},
    {name: "parentesco"}
  ],
  sortInfo:{field: "nombre", direction: "ASC"}
},
listeners:{
render:function(cmp){
	Ext.getCmp('1238'+this.idpadre).store.baseParams.idpersona=Ext.getCmp(this.idpadre).persona.idpersona;
  Ext.getCmp('1238'+this.idpadre).store.load();
},

},
};
/**
 * Componente Estado de vivienda
 */
Ext.persona.cmp1307 = {
loadFn:function(idpersona){
  Ext.Ajax.request({
    url: 'getEstadoViviendaByPersona',
    params: {idpersona: idpersona},
    success: function (response, opt)
    {
      var dataResponse = Ext.decode(response.responseText);
    
      if (dataResponse.data.length != 0) {
        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data[0]));
        this.getForm().findField('idestadovivienda').setRawValue(dataResponse.data[0].denomestado);
        this.getForm().findField('idconvivencia').setRawValue(dataResponse.data[0].denomconvivencia);
      }
    }.createDelegate(this)
  });
},
saveFn:function (btnPress)
{
  
  if (this.getForm().isValid() && this.getForm().isDirty()) {      
        var url = (Ext.isEmpty(this.getForm().getValues().idestadoviviendap)) ? 'addEstadoVivienda' : 'modEstadoVivienda';
        Ext.sendAjax.request({
            url: url,
            params: this.getForm().getValues(),
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        if (dataResponse.data) {
                            this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
                            this.getForm().findField('idestadovivienda').setRawValue(dataResponse.data.denomestado);
                            this.getForm().findField('idconvivencia').setRawValue(dataResponse.data.denomconvivencia);
                        }
                    }
                    var msg = '';
                    switch (url) {
                        case 'addEstadoVivienda':
                            msg = 'El estado de la vivienda se ha adicionado satisfactoriamente.';
                            break;
                        case 'modEstadoVivienda':
                            msg = 'El estado de la vivienda se ha modificado satisfactoriamente.';
                            break;
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }

            }.createDelegate(this)
        }, this);
    }
},
listeners:{

},
};
/**
 * Componente Dirección
 */
Ext.persona.cmp116 = {
listeners:{

},
};
/**
 * Componente Descripción
 */
Ext.persona.cmp1126 = {
listeners:{

},
};
/**
 * Componente observacion
 */
Ext.persona.cmp1350 = {
listeners:{

},
};
/**
 * Componente Observación
 */
Ext.persona.cmp1019 = {
listeners:{

},
};
/**
 * Componente observacion
 */
Ext.persona.cmp1359 = {
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp76 = {
listeners:{
focus:function(){
  var date = new Date(Ext.getCmp('75' + this.idpadre).getValue());
  Ext.getCmp('76'+this.idpadre).setMinValue(date.format('d/m/Y'));
},

},
};
/**
 * Componente jubilado
 */
Ext.persona.cmp1404 = {
listeners:{

},
};
/**
 * Componente Curso
 */
Ext.persona.cmp74 = {
store:{
  url: "getCurses",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
           
      },
        mapping: [
          {name: 'idcurso'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{

},
};
/**
 * Componente resultado
 */
Ext.persona.cmp77 = {
listeners:{

},
};
/**
 * Componente Tipo centro de estudio
 */
Ext.persona.cmp1405 = {
listeners:{
select:function(cb, rec){
  //ComboBox de Centro de estudio
  Ext.getCmp('72'+this.idpadre).setRawValue('');
  Ext.getCmp('72'+this.idpadre).store.clearFilter();
  Ext.getCmp('72'+this.idpadre).store.filter('idcentroestudio', rec.get('idcentroestudio'), true);
},

},
};
/**
 * Componente Centro de estudio
 */
Ext.persona.cmp72 = {
store:{
  url: "getCentroEstudios",
    type: "Store",
       baseParams: {
            value: 1
        },
      reader: {
        type: "JsonReader",          
            root: "data"
      },
        mapping: [
          {name: 'idcentroestudio'},
          {name: 'idtipocentroestudio'},
          {name: 'denominacion'},
          {name: 'fdesde'},
          {name: 'fhasta'},
          {name: 'descripcion'}        
        ],
          autoLoad:true,
          
},
listeners:{
expand:function (cmp) {
 
  if(Ext.getCmp('1405'+this.idpadre).getValue()){
    cmp.store.filter('idtipocentroestudio', Ext.getCmp('1405'+this.idpadre).getValue(), true);
  }
   
},
select:function(cb, rec){
  //ComboBox de Tipo de Centro de estudio
  if(Ext.getCmp('1405'+this.idpadre))
  	Ext.getCmp('1405'+this.idpadre).setValue(rec.get('idtipocentroestudio'));
},

},
};
/**
 * Componente Reserva
 */
Ext.persona.cmp1304 = {
columns:[ 
  {header: "Entidad",width:350 , dataIndex: "entidad"},
  {header: "Área",width:300 , dataIndex: "area"},
  {header: "Cargo",width:300 , dataIndex: "cargo"},
  {header: "Sustituto",width:50 , dataIndex: "reserva", renderer: function (val, metadata) {
    if (val == 2) {
      return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
    } else {
      return '<span style="color: #aa0710;">' + '&#08416;' + '</span>';
    }
  }},
  {header: "Preparación",width:50 , dataIndex: "preparacion", renderer: function (val, metadata) {
    if(val == '1'){
      return "SI";
    } else if(val == '0'){
      return "NO";
    }
  }},
  {header: "Listo",width:50 , dataIndex: "listo", renderer: function (val, metadata) {
    if(val == '1'){
      return "SI";
    } else if(val == '0'){
      return "NO";
    }
  }},
  {header: "Desde",width:100 , dataIndex: "fdesde"},
  {header: "Hasta",width:100 , dataIndex: "fhasta"}
],
isDirty:function(){
	return false;
},
loadFn:function (idpersona)
{
  this.loadGridStore({idpersona: idpersona});
},
store:{
  url: "getReserva",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idreserva"},
          {name: "entidad"},
          {name: "area"},
          {name: "cargo"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "fregistro"},
          {name: "reserva"},
          {name: "preparacion"},
          {name: "observacion"},
          {name: "listo"}
        ]
},
listeners:{

},
};
/**
 * Componente Situacion en la defensa
 */
Ext.persona.cmp1342 = {
columns:[
  {header: "Asignación en la defensa", width: 200, sortable: true, dataIndex: "denomasigdefensa"},  
  {header: "Cargo", width: 200, sortable: true, dataIndex: "denomcargo"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomasigdefensa = Ext.getCmp("1345" + this.idpadre).getRawValue();
    values.denomcargo = Ext.getCmp("1344" + this.idpadre).getRawValue();
  
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idsituaciondefensa)) {
        values.idsituaciondefensa = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
  
  var records = this.gpGrid.getSelectionModel().getSelections();
  var ask = '¿Está seguro que quiere eliminar la situación seleccionada?';
  if (records.length > 1) {
    var ask = '¿Está seguro que quiere eliminar las situaciones seleccionadas?';
  } 
  
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {
                     var records = this.gpGrid.getSelectionModel().getSelections();
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idsituaciondefensa'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.denomasigdefensa = Ext.getCmp("1345" + this.idpadre).getRawValue();
    values.denomcargo = Ext.getCmp("1344" + this.idpadre).getRawValue();
	
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idsituaciondefensa)) {
        values.idsituaciondefensa = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
      
      
      
      var record;
      
      
      
       Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idsituaciondefensa') == values.idsituaciondefensa) {                   
                   record = rec;
                   return false;
                 }
               });
      
       
        switch (index) {             
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                  console.info(values);
                  console.info(error);
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();
  //console.log(record);
  
  this.loadFormulario(record);
  
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
    }, this);
    
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modSituacionDefensa';
    } else
        if (this.arrDel.length > 0) {
            url = 'delSituacionDefensa';
        } else {
            url = 'addSituacionDefensa';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modSituacionDefensa':
                            msg = 'La situación en la defensa se ha modificado satisfactoriamente.';
                            break;
                        case 'delSituacionDefensa':
                            msg = 'La situación en la defensa se ha eliminado satisfactoriamente.';
                            break;
                        case 'addSituacionDefensa':
                            msg = 'La situación en la defensa se ha adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getSituacionDefensa",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idsituaciondefensa"},
          {name: "idasignaciondefensa"},
          {name: "idcargodefensa"},
          {name: "denomcargo"},
          {name: "denomasigdefensa"},
          {name: "fdesde"},       
          {name: "fhasta"}         
        ]
          
}
,
listeners:{

},
};
/**
 * Componente Situaciones excepcionales
 */
Ext.persona.cmp1362 = {
columns:[
  {header: "Estructura situación excepcional", width: 200, sortable: true, dataIndex: "situacexcep"},  
  {header: "Cargo situación excepcional", width: 200, sortable: true, dataIndex: "cargoexcep"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.situacexcep = Ext.getCmp("1366" + this.idpadre).getRawValue();
    values.cargoexcep= Ext.getCmp("1367" + this.idpadre).getRawValue();
  
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idsitexcepcional)) {
        values.idsitexcepcional = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
  
  var records = this.gpGrid.getSelectionModel().getSelections();
  var ask = '¿Está seguro que quiere eliminar la situación seleccionada?';
  if (records.length > 1) {
    var ask = '¿Está seguro que quiere eliminar las situaciones seleccionadas?';
  } 
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {
                     var records = this.gpGrid.getSelectionModel().getSelections();
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idsitexcepcional'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.situacexcep = Ext.getCmp("1366" + this.idpadre).getRawValue();
    values.cargoexcep = Ext.getCmp("1367" + this.idpadre).getRawValue();
	
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idsitexcepcional)) {
        values.idsitexcepcional = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
      
      
      
      var record;
      
      
      
       Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idsitexcepcional') == values.idsitexcepcional) {                   
                   record = rec;
                   return false;
                 }
               });
      
       
        switch (index) {             
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();  
  this.loadFormulario(record);
  
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
    }, this);
    
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modSituacExcep';
    } else
        if (this.arrDel.length > 0) {
            url = 'delSituacExcep';
        } else {
            url = 'addSituacExcep';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modSituacExcep':
                            msg = 'La situación excepcional se ha modificado satisfactoriamente.';
                            break;
                        case 'delSituacExcep':
                            msg = 'La situación excepcional se ha eliminado satisfactoriamente.';
                            break;
                        case 'addSituacExcep':
                            msg = 'La situación excepcional se ha adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getSituacExcep",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idsitexcepcional"},
          {name: "idsituacexcep"},
          {name: "idcargoexcep"},
          {name: "situacexcep"},
          {name: "cargoexcep"},
          {name: "fdesde"},       
          {name: "fhasta"}         
        ]
          
},
listeners:{

},
};
/**
 * Componente Reclamacion
 */
Ext.persona.cmp1388 = {
columns:[
  {header: "No. acuerdo", width: 100, sortable: true, dataIndex: "numeroacuerdo"},  
  {header: "Fecha acuerdo", width: 100, sortable: true, dataIndex: "fechaacuerdo"},
  {header: "Decisión", width: 200, sortable: true, dataIndex: "decision"},
  {header: "Plaza a ocupar", width: 200, sortable: true, dataIndex: "nuevaplaza"},
  {header: "Reclamación", width: 200, sortable: true, dataIndex: "reclamacion"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.decision = Ext.getCmp("1390" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idreclamacion)) {
        values.idreclamacion = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function(){
  
  var records = this.gpGrid.getSelectionModel().getSelections();
  var ask = '¿Está seguro que quiere eliminar la reclamación seleccionada?';
  if (records.length > 1) {
    var ask = '¿Está seguro que quiere eliminar las reclamaciones seleccionadas?';
  } 
  mostrarMensaje(2, ask, function (btn)
                 {
                   if (btn == 'ok') {
                     var records = this.gpGrid.getSelectionModel().getSelections();
                     Ext.each(records, function (rec)
                              {
                                if (!rec.data.add) {
                                  this.arrDel.push(rec.get('idreclamacion'));
                                }
                                this.gpGrid.getStore().remove(rec);
                              }, this);

                     this.gpGrid.getView().refresh();
                   }
                 }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();	
    values.decision = Ext.getCmp("1390" + this.idpadre).getRawValue();
    var store = this.gpGrid.getStore();
    var index = -1;

    if (Ext.isEmpty(values.idreclamacion)) {
        values.idreclamacion = Ext.id();
        values.add = true;
       
        switch (index) {
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
      
      
      
      var record;
      
      
      
       Ext.each(store.getRange(), function (rec)
               {
                 if (rec.get('idreclamacion') == values.idreclamacion) {                   
                   record = rec;
                   return false;
                 }
               });
      
       
        switch (index) {             
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();  
  this.loadFormulario(record);
  
},
saveFn:function (btnPress)
{
    var store = this.gpGrid.getStore();
    var self = this;
    var pass = false;
    this.arrAdd = [];
    this.arrMod = [];
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
    }, this);
    
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modReclamacion';
    } else
        if (this.arrDel.length > 0) {
            url = 'delReclamacion';
        } else {
            url = 'addReclamacion';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg;
                    switch (url) {
                        case 'modReclamacion':
                            msg = 'La reclamación se ha modificado satisfactoriamente.';
                            break;
                        case 'delReclamacion':
                            msg = 'La reclamaciónl se ha eliminado satisfactoriamente.';
                            break;
                        case 'addReclamacion':
                            msg = 'La reclamación se ha adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getReclamacion",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idreclamacion"},
          {name: "fechaacuerdo"},
          {name: "numeroacuerdo"},
          {name: "decision"},
          {name: "decision"},
          {name: "reclamacion"},
          {name: "nuevaplaza"},       
          {name: "idpersona"}         
        ]
          
},
listeners:{

},
};
/**
 * Componente Direcciones
 */
Ext.persona.cmp109 = {
columns:[
  {header: "Pa&iacute;s", width: 120, sortable: true, dataIndex: "pais"},
  {header: "Provincia", width: 180, sortable: true, dataIndex: "denomprov"},
  {header: "Municipio", width: 180, sortable: true, dataIndex: "denommunic"},
  {header: "Direcci&oacute;n", width: 250, sortable: true, dataIndex: "direccion"},
  {header: "Principal", width: 55, sortable: true, dataIndex: "oficial", renderer: function (val)
   {
     if (val == true) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }
     return '';
   }},
  {header: "Desde", width: 85, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 85, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function ()
{
  var values = this.fpFormulario.getForm().getValues();
  values.oficial = values.oficial == "on" ? true : false;
  values.pais = Ext.getCmp("1193" + this.idpadre).getRawValue();
  var prov_mun = values.denomprovmun.split('-');

    values.denomprov = prov_mun[0] || '';

    values.denommunic = prov_mun[1] || '';

    values.historico = isActual(values.fdesde, values.fhasta);

    var store = this.gpGrid.getStore();

    var index = -1;
  
  console.info(values);

    if (Ext.isEmpty(values.iddireccion)) {//Si es vacio es porke estoy adicionando
        values.iddireccion = Ext.id();
        values.add = true;
        if (values.historico != 0) { //El checkeo eso solo si la direccion es actual
            Ext.each(store.getRange(), function (rec)
            {
                if (rec.get('oficial') == true && values.oficial != false && rec.get('historico') == 1) {
                    index = 'oficial';
                    return false;
                }
              	if (rec.get('idprovincia') == values.idprovincia && rec.get('idmunicipio') == values.idmunicipio && 
                    rec.get('direccion') == values.direccion && rec.get('fdesde') == values.fdesde && rec.get('fhasta') == values.fhasta) {
                    index = 'direccion';
                    return false;
                }              
            });
        }
        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La persona ya tiene una dirección actual como principal.',
                    icon: 'error'
                });
                break;
            case 'direccion':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La dirección que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
    store.clearGrouping();
    store.groupBy('historico', true);

    function isActual(fi, ff)
    {
        if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
            var date = new Date();
            date = date.format('d/m/Y');
            var arrfi = fi.split('/');
            var arrff = ff.split('/');
            var arrfa = date.split('/');
            var fi = arrfi[2] + arrfi[1] + arrfi[0];
            var ff = arrff[2] + arrff[1] + arrff[0];
            var fa = arrfa[2] + arrfa[1] + arrfa[0];
            fi = parseInt(fi);
            ff = parseInt(ff);
            fa = parseInt(fa);
            return (fi <= fa && fa <= ff) ? 1 : 0;
            //1->Actual  0->Historico
        }
        return 1;
    }
},
eliminarHandler:function(){
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la dirección seleccionada?' : 
    '¿Está seguro que quiere eliminar las direcciones seleccionadas?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {

                
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('iddireccion'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);
                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar dirección",
        ttBtnMod:"Modificar dirección",
        ttBtnDel:"Eliminar dirección",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
  var values = this.fpFormulario.getForm().getValues();
  values.oficial = values.oficial == "on" ? true : false;
  values.pais = Ext.getCmp("1193" + this.idpadre).getRawValue();
  var prov_mun = values.denomprovmun.split('-');
  values.denomprov = prov_mun[0] || '';
  values.denommunic = prov_mun[1] || '';
  values.historico = isActual(values.fdesde, values.fhasta);
  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.iddireccion)) {//Si es vacio es porke estoy adicionando
    values.iddireccion = Ext.id();
    values.add = true;
    if (values.historico != 0) {//El checkeo eso solo si la direccion es actual
      Ext.each(store.getRange(), function (rec){
        if (rec.get('oficial') == true && values.oficial != false && rec.get('historico') == 1) {
          index = 'oficial';
          return false;
        }
        if (rec.get('idprovincia') == values.idprovincia && rec.get('idmunicipio') == values.idmunicipio && 
            rec.get('direccion') == values.direccion && rec.get('fdesde') == values.fdesde && rec.get('fhasta') == values.fhasta) {
          index = 'direccion';
          return false;
        }
      });
    }
    switch (index) {
      case 'oficial':
        Ext.Notification.show({
          title: 'Error',
          msg: 'La persona ya tiene una dirección actual como principal.',
          icon: 'error'
        });
        break;
      case 'direccion':
        Ext.Notification.show({
          title: 'Error',
          msg: 'La dirección que quiere adicionar ya existe.',
          icon: 'error'
        });
        break;
      default :
        try {
          store.add(new Ext.data.Record(values));
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  } else {
    var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec) {
      if (rec.get('iddireccion') != values.iddireccion) { //Si no es el que se va a modificar
        if (values.historico != 0) {//El checkeo eso solo si la direccion es actual
          if (rec.get('oficial') == true && values.oficial != false && rec.get('historico') == 1) {
            index = 'oficial';
            return false;
          }
        }
      } else {
        record = rec;//Obtengo el record que se va a modificar
      }
      if (rec.get('idprovincia') == values.idprovincia && rec.get('idmunicipio') == values.idmunicipio && 
          rec.get('direccion') == values.direccion && rec.get('fdesde') == values.fdesde && rec.get('fhasta') == values.fhasta) {
        index = 'direccion';
        return false;
      }
    });
    switch (index) {
      case 'oficial':
        Ext.Notification.show({
          title: 'Error',
          msg: 'La persona ya tiene una dirección actual como principal.',
          icon: 'error'
        });
        break;
      case 'direccion':
        Ext.Notification.show({
          title: 'Error',
          msg: 'La dirección ya existe.',
          icon: 'error'
        });
        break;
      default :
        try {
          for (var p in values) {
            if (values[p] != record.get(p)) {
              record.set(p, values[p]);
            }
          }
          this.cancelarHandler();
        } catch (error) {
          Ext.Notification.show({
            title: 'Error',
            msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
            icon: 'error'
          });
        }
        break;
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);
 

  function isActual(fi, ff) {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  var record = this.gpGrid.getSelectionModel().getSelected();
  
  Ext.getCmp('120' + this.idpadre).treeConfig.loader.baseParams.idpais=record.get('idpais');
  Ext.getCmp('120' + this.idpadre).onTrigger1Click();
    
  Ext.getCmp('120' + this.idpadre).enable();
  record.data.denomprovmun = record.get('denomprov') + '-' + record.get('denommunic');
  this.loadFormulario(record);
},
saveFn:function (btnPress)
{
    var self = this;
    var store = this.gpGrid.getStore();
    this.arrAdd = [];
    this.arrMod = [];
    var pass = false;
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
        if (rec.get('historico') == 1 && rec.get('oficial') == true && !pass) {
            pass = true;
        }
    }, this);
    if (!pass && this.obligatorio) {
        Ext.Notification.show({
            title: 'Advertencia',
            msg: 'La persona ya tiene una dirección actual como principal.',
            icon: 'warning'
        });
        return false;
    }
    var url = '';
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modDirecciones';
    } else
        if (this.arrDel.length > 0) {
            url = 'delDirecciones';
        } else {
            url = 'addDirecciones';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg = '';
                    switch (url) {
                        case 'modDirecciones':
                            msg = 'La(s) dirección(es) ha(n) sido modificada(s) satisfactoriamente.';
                            break;
                        case 'delDirecciones':
                            msg = 'La(s) dirección(es) ha(n) sido eliminada(s) satisfactoriamente.';
                            break;
                        case 'addDirecciones':
                            msg = 'La(s) dirección(es) ha(n) sido adicionada(s) satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getDirecciones",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "iddireccion"},
          {name: "idpais"},
          {name: "pais"},
          {name: "idprovincia"},
          {name: "denomprov"},
          {name: "idmunicipio"},
          {name: "denommunic"},
          {name: "direccion"},
          {name: "oficial"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    //startCollapsed: true,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Direcciones" : "Direcci&oacute;n"]})'
},
listeners:{

},
};
/**
 * Componente Datos de nacimiento
 */
Ext.persona.cmp129 = {
loadFn:function(idpersona){
  Ext.Ajax.request({
    url: 'getBirthdataByIdPerson',
    params: {idpersona: idpersona},
    success: function (response, opt)
    {
      var dataResponse = Ext.decode(response.responseText);
      if (dataResponse.data) {
         Ext.getCmp('144' + this.idpadre).enable();
        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
        if(this.getForm().findField('idpais')){
          	this.getForm().findField('idpais').setRawValue(dataResponse.data.denompais);
          	Ext.getCmp('144' + this.idpadre).treeConfig.loader.baseParams.idpais=dataResponse.data.idpais;
  			Ext.getCmp('144' + this.idpadre).onTrigger1Click();
        }
        if(this.getForm().findField('denomprovmuni')){
          this.getForm().findField('denomprovmuni').setRawValue(dataResponse.data.denomprovmuni);
        }
      }
    }.createDelegate(this)
  });
},
saveFn:function (btnPress)
{
    if (this.getForm().isValid() && this.getForm().isDirty()) {
        var url = (Ext.isEmpty(this.getForm().getValues().iddatosnacimiento)) ? 'addBirthdata' : 'changeBirthdata';
        Ext.sendAjax.request({
            url: url,
            params: this.getForm().getValues(),
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
                    }
                    var msg = (url === 'addBirthdata')
                        ? 'Los datos de nacimiento han sido adicionados satisfactoriamente.'
                        : 'Los datos de nacimento han sido modificados satisfactoriamente.';
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default:
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'ok'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
listeners:{
render:function(){
	Ext.getCmp("132" + this.idpadre).focus(true,200);
},

},
};
/**
 * Componente Ocupación en tiempo de guerra
 */
Ext.persona.cmp1203 = {
columns:[
  {header: "Entidad", width: 180, sortable: true, dataIndex: "entidad"},
  {header: "Cargo", width: 180, sortable: true, dataIndex: "cargo"}, 
  {header: "Principal", width: 60, sortable: true, dataIndex: "oficial", renderer: function (val)
   {
     if (val == true) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }
     return '';
   }},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();   
	
  	values.oficial = values.oficial == "on" ? true : false;
  
    values.historico = isActual(values.fdesde, values.fhasta);

    var store = this.gpGrid.getStore();

    var index = -1;
	
    if (Ext.isEmpty(values.idocupaciontiempoguerra)) {//Si es vacio es porke estoy adicionando
        values.idocupaciontiempoguerra = Ext.id();
        values.add = true;
        if (values.historico != 0) { //El checkeo eso solo si la direccion es actual
            Ext.each(store.getRange(), function (rec)
            {
                if (rec.get('oficial') == true && values.oficial != false && rec.get('historico') == 1) {
                    index = 'oficial';
                    return false;
                }
            });
        }
        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La persona ya tiene un cargo actual como oficial.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
    store.clearGrouping();
    store.groupBy('historico', true);

    function isActual(fi, ff)
    {
        if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
            var date = new Date();
            date = date.format('d/m/Y');
            var arrfi = fi.split('/');
            var arrff = ff.split('/');
            var arrfa = date.split('/');
            var fi = arrfi[2] + arrfi[1] + arrfi[0];
            var ff = arrff[2] + arrff[1] + arrff[0];
            var fa = arrfa[2] + arrfa[1] + arrfa[0];
            fi = parseInt(fi);
            ff = parseInt(ff);
            fa = parseInt(fa);
            return (fi <= fa && fa <= ff) ? 1 : 0;
            //1->Actual  0->Historico
        }
        return 1;
    }
},
eliminarHandler:function(){
  	var records = this.gpGrid.getSelectionModel().getSelections();
  	var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el cargo seleccionado?' : 
    '¿Está seguro que quiere eliminar los cargos seleccionados?';
  
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {

                var records = this.gpGrid.getSelectionModel().getSelections();
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idocupaciontiempoguerra'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);
                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.oficial = values.oficial == "on" ? true : false;


    values.historico = isActual(values.fdesde, values.fhasta);

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idocupaciontiempoguerra)) {//Si es vacio es porke estoy adicionando
        values.idocupaciontiempoguerra = Ext.id();
        values.add = true;
        if (values.historico != 0) { //El checkeo eso solo si la direccion es actual
            Ext.each(store.getRange(), function (rec)
            {
                if (rec.get('oficial') == true && values.oficial != false && rec.get('historico') == 1) {
                    index = 'oficial';
                    return false;
                }
            });
        }
        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La persona ya tiene un cargo actual como oficial.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idocupaciontiempoguerra') != values.idocupaciontiempoguerra) { //Si no es el que se va a modificar
                if (values.historico != 0) {//El checkeo eso solo si la direccion es actual
                    if (rec.get('oficial') == true && values.oficial != false
                        && rec.get('historico') == 1) {
                        index = 'oficial';
                        return false;
                    }
                }
            } else {
                record = rec; //Obtengo el record que se va a modificar
            }
        });
        switch (index) {
            case 'oficial':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'La persona ya tiene cargo actual como oficial.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
    store.clearGrouping();
    store.groupBy('historico', true);

    function isActual(fi, ff)
    {
        if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
            var date = new Date();
            date = date.format('d/m/Y');
            var arrfi = fi.split('/');
            var arrff = ff.split('/');
            var arrfa = date.split('/');
            var fi = arrfi[2] + arrfi[1] + arrfi[0];
            var ff = arrff[2] + arrff[1] + arrff[0];
            var fa = arrfa[2] + arrfa[1] + arrfa[0];
            fi = parseInt(fi);
            ff = parseInt(ff);
            fa = parseInt(fa);
            return (fi <= fa && fa <= ff) ? 1 : 0;
            //1->Actual  0->Historico
        }
        return 1;
    }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress)
{
    var self = this;
    var store = this.gpGrid.getStore();
    this.arrAdd = [];
    this.arrMod = [];
    var pass = false;
    Ext.each(store.getRange(), function (rec)
    {
        if (rec.data.add) {//Si es un record que se adiciono nuevo
            this.arrAdd.push(rec.data);
        } else {
            if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                this.arrMod.push(rec.data);
            }
        }
        if (rec.get('historico') == 1 && rec.get('oficial') == true && !pass) {
            pass = true;
        }
    }, this);
    if (!pass && this.obligatorio) {
        Ext.Notification.show({
            title: 'Advertencia',
            msg: 'La persona debe tener un cargo actual como oficial',
            icon: 'warning'
        });
        return false;
    }
    var url = '';
    if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
        url = 'modCargosGuerra';
    } else
        if (this.arrDel.length > 0) {
            url = 'delCargosGuerra';
        } else {
            url = 'addCargosGuerra';
        }
    if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
        Ext.sendAjax.request({
            url: url,
            params: {
                arrAdd: Ext.encode(self.arrAdd),
                arrMod: Ext.encode(self.arrMod),
                arrDel: Ext.encode(self.arrDel)
            },
            success: function (response, opt, notification)
            {
                var dataResponse = Ext.decode(response.responseText);
                if (dataResponse.success) {
                  //console.info(dataResponse.success);
                    if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
                        this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
                    }
                    this.arrAdd = [];
                    this.arrMod = [];
                    this.arrDel = [];
                    var msg = '';
                    switch (url) {
                        case 'modCargosGuerra':
                            msg = 'Lo(s) cargo(s) se ha(n) modificado satisfactoriamente.';
                            break;
                        case 'delCargosGuerra':
                            msg = 'Lo(s) cargo(s) se ha(n) eliminado satisfactoriamente.';
                            break;
                        case 'addCargosGuerra':
                            msg = 'Lo(s) cargo(s) se ha(n) adicionado satisfactoriamente.';
                            break
                    }
                    notification({
                        title: 'Informaci&oacute;n',
                        msg: msg,
                        icon: 'ok'
                    });
                } else {
                    switch (dataResponse.codigo) {
                        default :
                            notification({
                                title: 'Error',
                                msg: 'Ha ocurrido un error durante la transaccion.',
                                icon: 'error'
                            });
                            break;
                    }
                }
            }.createDelegate(this)
        }, this);
    }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getCargosGuerra",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idocupaciontiempoguerra"},
          {name: "entidad"},
          {name: "cargo"},
          {name: "fdesde"},
          {name: "fhasta"},     
          {name: "oficial"},
          {name: "historico"}
        ],
          sortInfo: {field: 'fhasta', direction: "ASC"},
            groupField: 'historico'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Cargos" : "Cargo"]})'
},
listeners:{

},
};
/**
 * Componente Ocupación actual
 */
Ext.persona.cmp1327 = {
columns:[
  {header: "Entidad", width: 350,hidden: true,sortable: true, dataIndex: "entidad"},
  {header: "Área", width: 350,sortable: true, dataIndex: "denomarea"},
  {header: "Cargo", width: 250,sortable: true, dataIndex: "denomcargo"},
  {header: "Situación laboral", width: 150, sortable: true, dataIndex: "situacionlaboral"},
  {header: "Principal", width: 60, sortable: true, dataIndex: "principal", renderer: function (val, metadata)
   {
     if (val == true) {
       return "<center class='checked' style='width: 16px; height: 16px;'></center>";
     }
     return '';
   }},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     if(isNaN(v)){
     return 'Nuevo';
   }else{
    return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }
   }}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();  

    values.principal = values.principal == "on" ? true : false;

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idsituacionlaboralp)) {
        values.idsituacionlaboralp = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('principal') == true && values.principal != false) {
                index = 'principal';
                return false;
            }
          if (rec.get('idcargo') == values.idcargo) {
                index = 'cargo';
                return false;
            }
        });

        switch (index) {
            case 'principal':
               
            	Ext.Notification.show({
                       title: 'Error',
                  msg: 'La persona posee registrado un cargo como principal.',
                  icon: 'error'
                    });
                break;
            case 'cargo':
              
            Ext.Notification.show({
                      title: 'Error',
                  msg: 'El cargo que quiere adicionar ya existe.',
                  icon: 'error'
                    });
                break;            
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                  
                   Ext.Notification.show({
                     title: 'Error',
                      msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                      icon: 'error'
                    });
                 
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
    var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el cargo seleccionado?' : 
    '¿Está seguro que quiere eliminar los cargos seleccionados?';
     
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
               
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idsituacionlaboralp'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar cargo",
        ttBtnMod:"Modificar cargo",
        ttBtnDel:"Eliminar cargo",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();

    values.principal = values.principal == "on" ? true : false;

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idsituacionlaboralp)) {
        values.idsituacionlaboralp = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('principal') == true && values.principal != false) {
                index = 'principal';
                return false;
            }
          
          if (rec.get('idcargo') == values.idcargo) {
                index = 'cargo';
                return false;
            }
        });

        switch (index) {
            case 'principal':
             
            Ext.Notification.show({
                      title: 'Error',
                      msg: 'La persona posee registrado un cargo como principal.',
                      icon: 'error'
                    });
        
                break;
            
            case 'cargo':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El cargo que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
           
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    
                     Ext.Notification.show({
                      title: 'Error',
                      msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                      icon: 'error'
                    });
                 
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idsituacionlaboralp') != values.idsituacionlaboralp) {
                if (rec.get('principal') == true && values.principal != false) {
                    index = 'principal';
                    return false;
                }
              if (rec.get('idcargo') == values.idcargo) {
                    index = 'cargo';
                    return false;
                }
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'principal':              	 
             Ext.Notification.show({
                    title: 'Error',
                      msg: 'La persona posee registrado un cargo como principal.',
                      icon: 'error'
                    });
          
                break;
            
            case 'cargo':             	 
              Ext.Notification.show({
                    title: 'Error',
                      msg: 'El cargo ya existe.',
                      icon: 'error'
                    });
                break;
            
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    
                    Ext.Notification.show({
                    title: 'Error',
                      msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                      icon: 'error'
                    });
                }
                break;
        }
    }
},
helpHandler:function()
{
var title = 'Ayuda de Tipos de nodos';
var referencia = 'RH/Registro/Clientes/principal';
help.show(title, referencia);
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
           {
             if (rec.data.add) {//Si es un record que se adiciono nuevo
               this.arrAdd.push(rec.data);
             } else {
               if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                 this.arrMod.push(rec.data);
               }
             }
             if (rec.get('principal') == true) {
               pass = true;
             }
           }, this);
  if (!pass && this.obligatorio) {
      notification({
        title: 'Error',
        msg: 'La persona debe tener un cargo como principal.',
        icon: 'error'
      });  
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0) {
    url = 'setAlta';
  } else
    if (this.arrDel.length > 0) {
      url = 'darBaja';
    } else {
      url = 'darAlta';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg;
          switch (url) {
            case 'setAlta':
              msg = 'El(Los) cargo(s) ha(n) sido modificado satisfactoriamente.';
              break;
            case 'darBaja':
              msg = 'El(Los) cargo(s) ha(n) sido eliminado satisfactoriamente.';
              break;
           	case 'darAlta':
              msg = 'El(Los) cargo(s) ha(n) sido adicionado(s) satisfactoriamente.';
              break
          }         
            notification({
              title: 'Informaci&oacute;n',
              msg: msg,
              icon: 'ok'
          	}); 
        } else {
          switch (dataResponse.codigo) {
            default :
             notification({
                title: 'Error',
                msg: 'H ocurrido un error durante la transacción.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getCargosByPersona",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idsituacionlaboralp"},
          {name: "idpersona"},
          {name: "denomcargo"},
          {name: "idcargo"},
          {name: "denomarea"},
          {name: "idarea"},
          {name: "entidad"},
          {name: "identidad"},
          {name: "idsituacion"},
          {name: "situacionlaboral"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "principal"},
          {name: "historico"},
        ],
  sortInfo: {field: 'entidad', direction: "DESC"},
  groupField: 'entidad'
},
view:{
  type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Cargos" : "Cargo"]})'
},
listeners:{
render:function(p){  

 p.btnCancelWin = new Ext.Button({     
      iconCls: 'cancelar',
      text: 'Cancelar',              
      scope: p,
      handler: function () {
            p.winEstructura.hide();
        }

    });

    p.btnAceptarWin = new Ext.Button({     
      iconCls: 'aceptar',
      text: 'Aceptar',
      disabled:true,
      scope: p,
      handler: function () {
        var node = p.pEstructura.tree.getSelectionModel().getSelectedNode();
        var nodo = node.text.split('<');
        var entidad = getEntidad(node);
        var area = getArea(node);
        Ext.getCmp("1329" + this.idpadre).setRawValue(nodo[0]);
        Ext.getCmp("1332" + this.idpadre).setValue(node.id);
        Ext.getCmp("1333" + this.idpadre).setRawValue(entidad);
        Ext.getCmp("1331" + this.idpadre).setRawValue(area);
        
        p.winEstructura.hide();
        }

    });
  
  function getEntidad(node){
    if(node.attributes.idconcepto == 3 || node.attributes.idconcepto == 2 || node.attributes.idconcepto == 4)
      return node.attributes.text;
    if(node.parentNode)
      return getEntidad(node.parentNode);  
    
  } 
  
  function getArea(node){    
    if(node.attributes.idconcepto == 5 || node.attributes.idconcepto == 4)
      return node.attributes.text;
    if(node.parentNode)
      return getArea(node.parentNode);  
    
  }
  
  
    p.pEstructura= new Ext.estructura.panel.PanelEstructura({
      title: 'Estructura',
      //inicial : perfil.idestructuracomun
    });
  
  p.pEstructura.on('dameseleccion', function (obj, data) {
    if(data.attributes.idconcepto == 7){
      p.btnAceptarWin.enable();
    }else{
      p.btnAceptarWin.disable();
    }
        
 }.createDelegate(this));

  

    p.winEstructura = new Ext.Window({
      title: 'Estructura',
      closeAction: 'hide',
      layout: 'fit',
      resizable: false,
      modal: true,
      items: [p.pEstructura],
      buttons: [p.btnCancelWin, p.btnAceptarWin]
    });

},

},
};
/**
 * Componente Idiomas
 */
Ext.persona.cmp884 = {
columns:[  
  {header: "Idioma",
   width: 180, 
   sortable: true,
   resizable:false, 
   dataIndex: "denomidioma",
   renderer: function (value, meta, record) {
    
     return "<div class='flags_img " + record.get('bandera') + "' style='width: 18px; height: 18px;'><p style='margin-left: 30px; margin-top: 2px;'>" + value + "</p></div>";
   }
  },
  {header: "Vía de aprendizaje", width: 100, sortable: true,resizable:false, dataIndex: "denomformaadquirir"},
  {header: "Observaci&oacute;n", width: 300, sortable: true,resizable:false, dataIndex: "observacion"},
  
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomidioma = Ext.getCmp("886" + this.idpadre).getRawValue();
    values.denomformaadquirir = Ext.getCmp("887" + this.idpadre).getRawValue();
    values.bandera = Ext.getCmp("886" + this.idpadre).findRecord("ididioma", values.ididioma).get("bandera");

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.ididiomap)) {//Si es vacio es porke estoy adicionando
        values.ididiomap = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('ididioma') == values.ididioma) {
                index = 'idioma';
                return false;
            }
        });
        switch (index) {
            case 'idioma':
                Ext.Notification.show({
                    title: 'Error',
                    //msg: 'La persona ya sabe ' + values.denomidioma + '</b>.',
                  	msg: 'El idioma que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();  
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el idioma seleccionado?' : 
    '¿Está seguro que quiere eliminar los idiomas seleccionados?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {
              
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('ididiomap'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar idioma",
        ttBtnMod:"Modificar idioma",
        ttBtnDel:"Eliminar idioma",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    values.denomidioma = Ext.getCmp("886" + this.idpadre).getRawValue();
    values.denomformaadquirir = Ext.getCmp("887" + this.idpadre).getRawValue();
    values.bandera = Ext.getCmp("886" + this.idpadre).findRecord("ididioma", values.ididioma).get("bandera");

    var store = this.gpGrid.getStore();
    var index = -1;
    if (Ext.isEmpty(values.ididiomap)) {//Si es vacio es porke estoy adicionando
        values.ididiomap = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('ididioma') == values.ididioma) {
                index = 'idioma';
                return false;
            }
        });
        switch (index) {
            case 'idioma':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El idioma que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        //Iteracion para validar la modificacion y obtener el record a modificar
        Ext.each(store.getRange(), function (rec, i)
        {
            if (rec.get('ididiomap') == values.ididiomap) { //Si  es el que se va a modificar
                record = rec; //Obtengo el record que se va a modificar
            } else
                if (rec.get('ididioma') == values.ididioma) {
                    index = 'ciudadadania';
                }
        });
        switch (index) {
            case 'ciudadadania':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El idioma ya existe.',
                    icon: 'error'
                });
                break
            default:
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona) {
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn: function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'La persona debe tener alguna idioma registrada',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'changeLanguages';
   } else
     if (this.arrDel.length > 0) {
       url = 'removeLanguages';
     } else {
       url = 'addLanguages';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'changeLanguages':
               msg = '¨El(Los) idioma(s) ha(n) sido modificado(s) satisfactoriamente.';
               break;
             case 'removeLanguages':
               msg = 'El(Los) idioma(s) ha(n) sido eliminado(s) satisfactoriamente.';
               break;
             case 'addLanguages':
               msg = 'El(Los) idioma(s) ha(n) sido adicionado(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
validateForm:function () {
  if (this.fpFormulario.getForm().isValid()) {
    return true;
  } else {
    return false;
  }
},
sm:{  type:'RowSelectionModel',  singleSelect: false},
store:{
  url: "getLanguageByIdperson",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "ididiomap"},
          {name: "ididioma"},
          {name: "idformaadquiriridioma"},
          {name:"observacion"},
          {name: "denomidioma"},
          {name: "denomformaadquirir"},          
          {name: "bandera"}
        ]
},
listeners:{

},
};
/**
 * Componente Observaciones
 */
Ext.persona.cmp1155 = {
listeners:{

},
};
/**
 * Componente Formulario de datos básicos
 */
Ext.persona.cmp60 = {
listeners:{
clientvalidation:function(form,valid){
  
  if (form.getForm().isDirty() && valid || Ext.getCmp('59'+this.idpadre).isDirty()) {
      //Ext.getCmp('btnAplicarPers').enable();
      //Ext.getCmp('btnAceptSavePers').enable();
    } else {
      //Ext.getCmp('btnAplicarPers').disable();
      //Ext.getCmp('btnAceptSavePers').disable();
    }
},

},
};
/**
 * Componente Estado civil
 */
Ext.persona.cmp1148 = {
listeners:{

},
};
/**
 * Componente Estatificación social
 */
Ext.persona.cmp1149 = {
listeners:{

},
};
/**
 * Componente Alia o sobrenombre
 */
Ext.persona.cmp1151 = {
listeners:{

},
};
/**
 * Componente Nivel educacional
 */
Ext.persona.cmp1280 = {
columns:[
  {header: "Nivel educacional", width: 100, sortable: true, dataIndex: "niveleducacional"},
  {header: "T&iacute;tulo", width: 100, sortable: true, dataIndex: "titulo"},  
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"}
],
aplicarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion del nivel educacional
    values.niveleducacional = Ext.getCmp("1285" + this.idpadre).getRawValue();
    values.titulo = Ext.getCmp("1341" + this.idpadre).getRawValue();


    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idniveleducacionalp)) {
        values.idniveleducacionalp = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idniveleducacionalp') == values.idniveleducacionalp) {
                index = 'nivel';
                return false;
            }
        });

        switch (index) {
            case 'nivel':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El nivel educacional que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cleanForm();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
eliminarHandler:function ()
{
   var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el nivel educacional seleccionado?' : 
    '¿Está seguro que quiere eliminar los niveles educacionales seleccionados?';
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {                
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idniveleducacionalp'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
	//Obteniendo la denominacion del tipo de categoria selecionada
    values.niveleducacional = Ext.getCmp("1285" + this.idpadre).getRawValue();
    values.titulo = Ext.getCmp("1341" + this.idpadre).getRawValue();
  

    var store = this.gpGrid.getStore();

    var index = -1;

    if (Ext.isEmpty(values.idniveleducacionalp)) {
        values.idniveleducacionalp = Ext.id();
        values.add = true;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idniveleducacionalp') == values.idniveleducacionalp) {
                index = 'nivel';
                return false;
            }
        });

        switch (index) {
            case 'nivel':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El nivel educacional  que quiere adicionar ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    store.add(new Ext.data.Record(values));
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
                        icon: 'error'
                    });
                }
                break;
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idniveleducacionalp') != values.idniveleducacionalp) {                
                if (rec.get('idniveleducacional') == values.idniveleducacional) {
                	index = 'nivel';
                	return false;
            	}
            } else {
                record = rec;
            }
        });
        switch (index) {
            case 'nivel':
                Ext.Notification.show({
                    title: 'Error',
                    msg: 'El nivel educacional ya existe.',
                    icon: 'error'
                });
                break;
            default :
                try {
                    for (var p in values) {
                        if (values[p] != record.get(p)) {
                            record.set(p, values[p]);
                        }
                    }
                    this.cancelarHandler();
                } catch (error) {
                    Ext.Notification.show({
                        title: 'Error',
                        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                        icon: 'error'
                    });
                }
                break;
        }
    }
},
loadFn:function (idpersona) {
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function (btnPress) {
   var self = this;
   var store = this.gpGrid.getStore();
   var pass = false;
   this.arrAdd = [];
   this.arrMod = [];
   Ext.each(store.getRange(), function (rec)
            {
              if (rec.data.add) {//Si es un record que se adiciono nuevo
                this.arrAdd.push(rec.data);
              } else {
                if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                  this.arrMod.push(rec.data);
                }
              }
              pass = true;
            }, this);
   if (!pass && this.obligatorio) {
     Ext.Notification.show({
       title: 'Advertencia',
       msg: 'El nivel educacional que quiere adicionar ya existe.',
       icon: 'warning'
     });
     return false;
   }
   var url = '';
   if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
     url = 'modNiveleducacional';
   } else
     if (this.arrDel.length > 0) {
       url = 'delNiveleducacional';
     } else {
       url = 'addNiveleducacional';
     }
   if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
     Ext.sendAjax.request({
       url: url,
       params: {
         arrAdd: Ext.encode(self.arrAdd),
         arrMod: Ext.encode(self.arrMod),
         arrDel: Ext.encode(self.arrDel)
       },
       success: function (response, opt, notification)
       {
         var dataResponse = Ext.decode(response.responseText);
         if (dataResponse.success) {
           if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
             this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
           }
           this.arrAdd = [];
           this.arrMod = [];
           this.arrDel = [];
           var msg;
           switch (url) {
             case 'modNiveleducacional':
               msg = 'El(Los) nivel(es) educacional(es) ha(n) sido modificado(s) satisfactoriamente.';
               break;
             case 'delNiveleducacional':
               msg = 'El(Los) nivel(es) educacional(es) ha(n) sido eliminado(s) satisfactoriamente.';
               break;
             case 'addNiveleducacional':
               msg = 'El(Los) nivel(es) educacional(es) ha(n) sido adicionado(s) satisfactoriamente.';
               break
           }
           notification({
             title: 'Informaci&oacute;n',
             msg: msg,
             icon: 'ok'
           });
         } else {
           switch (dataResponse.codigo) {
             case 23503:
               notification({
                 title: 'Error',
                 msg: 'No se puede eliminar debido a que est&aacute; en uso.',
                 icon: 'error'
               });
               break;
             default :
               notification({
                 title: 'Error',
                 msg: 'Ha ocurrido un error durante la transaccion.',
                 icon: 'error'
               });
               break;
           }
         }
       }.createDelegate(this)
     }, this);
   }
 },
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getNiveleducacional",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idniveleducacionalp"},
          {name: "idniveleducacional"},
          {name: "niveleducacional"},
          {name: "fdesde"},
          {name: "titulo"},
          {name: "idtitulo"}
        ]
},
listeners:{

},
};
/**
 * Componente Foto de la persona
 */
Ext.persona.cmp59 = {
listeners:{

},
};
/**
 * Componente Disposición
 */
Ext.persona.cmp1406 = {
store:{
  url: "obtenerDisposiciones",
  type: "Store",
  baseParams: {
    value: 1
  },
  reader: {
    type: "JsonReader",
    root: "data"
  },
  mapping: [
    {name: 'iddisposicion'},
    {name: 'denominacion'},
    {name: 'descripcion'},
  ],
  autoLoad:true
},
listeners:{
select:function(comp){
  if (!Ext.getCmp("1404" + this.idpadre).checked) {
     comp.reset();
  }
},

},
};
/**
 * Componente Sexo
 */
Ext.persona.cmp70 = {
store:{
  type: "SimpleStore",
    fields: [
      {name: "sexo"},
      {name: "denomsexo"},
      {name: "css"}
    ],
      data: [
        ["1", "Masculino", "male"],
        ["0", "Femenino", "female"]
      ]
},
tpl:'<tpl for="."><div ext:qtip="{denomsexo}" class="x-combo-list-item"><img width="16" height="16" src="../../../../views/images/persona/{css}.png">  {denomsexo}</div></tpl>',
listeners:{
select:function (cb)
{
  Ext.getCmp("59" + this.idpadre).setSexoImgDefault.call(Ext.getCmp("59" + this.idpadre),cb.getValue());
},

},
};
/**
 * Componente Datos Sociales
 */
Ext.persona.cmp1147 = {
gSecurity:function() {
  var respuesta = true;
  if (Ext.isEmpty(this.getForm().getValues().idcaracteristicasocial)) {
    if (parseInt(this.segAction[0]) === 1) {
      respuesta = false;
    }
  } else {
    if (parseInt(this.segAction[1]) === 1) {
      respuesta = false;
    }
  }
  if (respuesta) {
    Ext.getCmp("1147" + this.idpadre).getForm().reset();
  }
  return respuesta;
},
loadFn:function(idpersona){
  Ext.Ajax.request({
    url: 'getDatosSociales',
    params: {idpersona: idpersona},
    success: function (response, opt)
    {
      var dataResponse = Ext.decode(response.responseText);
      if (dataResponse.data) {
        this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
        this.getForm().findField('idestadocivil').setRawValue(dataResponse.data.estadocivil);
        this.getForm().findField('idestratificacionsocial').setRawValue(dataResponse.data.estratificaionsocial);
        this.getForm().findField('iddisposicion').setRawValue(dataResponse.data.disposicion);
        this.getForm().findField('jubilado').setValue(dataResponse.data.jubilado);
      }
    }.createDelegate(this)
  });
},
saveFn:function(btnPress) {
  if (Ext.getCmp("1147" + this.idpadre).gSecurity()) {
    return;
  };
  if (this.getForm().isValid() && this.getForm().isDirty()) {
    var url = (Ext.isEmpty(this.getForm().getValues().idcaracteristicasocial)) ? 'addDatosSociales' : 'modDatosSociales';
    var values = this.getForm().getValues();
    values.jubilado = (Ext.getCmp("1404" + this.idpadre).checked) ? 1 : 0;
    Ext.sendAjax.request({
      url: url,
      params: values,
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') {
            if (dataResponse.data) {
              this.getForm().loadRecord(new Ext.data.Record(dataResponse.data));
              this.getForm().findField('idestadocivil').setRawValue(dataResponse.data.estadocivil);
              this.getForm().findField('idestratificacionsocial').setRawValue(dataResponse.data.estratificaionsocial);
              this.getForm().findField('iddisposicion').setRawValue(dataResponse.data.disposicion);
              this.getForm().findField('jubilado').setValue(dataResponse.data.jubilado);
            }
          }
          var msg = '';
          switch (url) {
            case 'addDatosSociales':
              msg = 'Los datos sociales han  sido adicionados satisfactoriamente.';
              break;
            case 'modDatosSociales':
              msg = 'Los datos sociales se ha modificado satisfactoriamente.';
              break;
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }

      }.createDelegate(this)
    }, this);
  }
},
listeners:{

},
};
/**
 * Componente fhasta
 */
Ext.persona.cmp1201 = {
listeners:{

},
};
/**
 * Componente observacion
 */
Ext.persona.cmp1202 = {
listeners:{

},
};
/**
 * Componente categoriaocup
 */
Ext.persona.cmp1407 = {
store:{
  url: "obtenerCategOcupacional",
  type: "Store",
  reader: {
    type: "JsonReader",
    root: ""
  },
  mapping: [
    {name: 'categocup'}
  ],
  autoLoad:true
},
listeners:{

},
};
/**
 * Componente motivobaja
 */
Ext.persona.cmp1199 = {
clickNode:function (node, e) {
        if (node.isLeaf()) {
            var text = node.text;
            this.setValue(text);
            this.fireEvent('selectNode', node);
            this.collapse();
            Ext.getCmp('1199' + this.idpadre).setValue(node.attributes.id);
        }
    },
treeConfig:
{loader: {
            dataUrl: '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/getMotivosMovimiento'
        },
        border: false,
        autoScroll: true,
        rootVisible: false,
        root: {
            text: 'Motivos de movimiento',
            animate: false,
            draggable: false,
            expanded: false
        }},
listeners:{

},
};
/**
 * Componente Área/Entidad/Organismo
 */
Ext.persona.cmp1197 = {
store:{
  url: "getEntidad",
    autoLoad:true,
   // baseParams:{idpersona:Ext.getCmp('1195' + this.idpadre).idpersona},
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "orgentidad"}
        ]
},
listeners:{
select:function(combo,record,num){
  
 // Ext.Ajax.request({
	//	url:'getDenomEntidad' ,
	//	params: {
	//		orgentidad: record.data.orgentidad
  //  },
//callback: function () {

  //  },
//success: function (r) {
	//var responseData = Ext.decode(r.responseText);
	
  //  }
///});
  
 // console.info(record);
 // if (cmp.rendered && Ext.getCmp("60" + this.idpadre).rendered && Ext.getCmp("59" + this.idpadre).rendered) {
   // cmp.collapse();
    //cmp.expand(true);
  //}
},

},
};
/**
 * Componente Trayectoria laboral
 */
Ext.persona.cmp1195 = {
columns:[
  {header: "Entidad", width: 180, sortable: true, dataIndex: "orgentidad"},
  {header: "Fecha Alta", width: 180,hidden: true, sortable: true, dataIndex: "falta"},
  {header: "Fecha Baja", width: 180,hidden: true, sortable: true, dataIndex: "fbaja"},
  {header: "Cargo", width: 180, sortable: true, dataIndex: "cargo"},
  {header: "Categoría ocupacional", width: 150, sortable: true, dataIndex: "categocup"},
  {header: "No. alta/Resolución/Orden", width: 180, sortable: true, dataIndex: "noalta"},   
  {header: "Motivo de baja o movimiento", width: 200, sortable: true, dataIndex: "denominacion"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Tiempo de servicio", width: 150, sortable: true, renderer: function(value, metadata, record) {
    var tyear = "";
    var yearDenom = (record.data.tiempoa == 1) ? " año " : " años ";
    if (record.data.tiempoa > 0) {
      tyear = record.data.tiempoa + yearDenom;
    }
    
    var tmon = "";
    var monDenom = (record.data.tiempom == 1) ? " mes " : " meses ";
    if (record.data.tiempom > 0) {
      tmon = record.data.tiempom + monDenom;
    }
    
    var tday = "";
    var dayDenom = (record.data.tiempod == 1) ? " día " : " días ";
    if (record.data.tiempod > 0) {
      tday = record.data.tiempod + dayDenom;
    }
    return tyear + tmon + tday;
  }}
],
aplicarHandler:function ()
{
  var values = this.fpFormulario.getForm().getValues();
  
   values.motivobaja=Ext.getCmp('1199' + this.idpadre).getValue();
 
 if(!Ext.isEmpty(values.orgentidad) || !Ext.isEmpty(values.cargo)){
	var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idtrayectorialaboral)){
    values.idtrayectorialaboral = Ext.id();
    values.add = true;
   
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch (error) {
      Ext.Notification.show({
        title: 'Error',
        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
        icon: 'error'
      });
    }
  }
 }else{
  Ext.Notification.show({
        title: 'Error',
        msg: 'Debe especificar el campo Área/Entidad/Organismo o el Cargo',
        icon: 'error'
      });
 }
 
  
},
eliminarHandler:function(){
  	var records = this.gpGrid.getSelectionModel().getSelections();
  	var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la trayectoria laboral seleccionada?' : 
    '¿Está seguro que quiere eliminar las trayectorias laborales seleccionadas?';
  
	mostrarMensaje(2, ask, function (btn)
        {
            if (btn == 'ok') {

                var records = this.gpGrid.getSelectionModel().getSelections();
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idtrayectorialaboral'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);
                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
}
,
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
 
 
   values.motivobaja=Ext.getCmp('1199' + this.idpadre).getValue();
 
  
	if(!Ext.isEmpty(values.orgentidad) || !Ext.isEmpty(values.cargo)){
     
    var store = this.gpGrid.getStore();

    if (Ext.isEmpty(values.idtrayectorialaboral)) {
       
         values.idtrayectorialaboral = Ext.id();
         values.add = true;
        try {
            store.add(new Ext.data.Record(values));
            this.cancelarHandler();
        } catch (error) {
            Ext.Notification.show({
                title: 'Error',
                msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador',
                icon: 'error'
            });
        }
    } else {
      
       
        var record;
        Ext.each(store.getRange(), function (rec)
        {
         
          if(isNaN(values.motivobaja)){
            values.motivobaja=rec.get('motivobaja');
          }
         
          
            if (rec.get('idtrayectorialaboral') == values.idtrayectorialaboral) {
                record = rec;
                return false;
            }
        });

        try {
            for (var p in values) {
                if (values[p] != record.get(p)) {
                    record.set(p, values[p]);
                }
            }
            this.cancelarHandler();
        } catch (error) {
            Ext.Notification.show({
                title: 'Error',
                msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                icon: 'error'
            });
        }

    }
 }else{
  Ext.Notification.show({
        title: 'Error',
        msg: 'Debe especificar el campo Área/Entidad/Organismo o el Cargo',
        icon: 'error'
      });
 }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){  
  var record = this.gpGrid.getSelectionModel().getSelected();  
  this.loadFormulario(record);

},
saveFn:function (btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
  {
   // console.info(rec.data);
    if (rec.data.add) {//Si es un record que se adiciono nuevo
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
        this.arrMod.push(rec.data);
      }
    }
    pass = true;
  }, this);
  if (!pass && this.obligatorio) {
    Ext.Notification.show({
      title: 'Advertencia',
      msg: 'La persona debe tener un cargo registrado',
      icon: 'warning'
    });
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modTrayectoriaLaboral';
  } else
    if (this.arrDel.length > 0) {
      url = 'delTrayectoriaLaboral';
    } else {
      url = 'addTrayectoriaLaboral';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        //console.info(dataResponse.success);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg;
          switch (url) {
            case 'modTrayectoriaLaboral':
              msg = 'Los datos se han modificado satisfactoriamente.';
              break;
            case 'delTrayectoriaLaboral':
              msg = 'Los datos se han eliminado satisfactoriamente.';
              break;
            case 'addTrayectoriaLaboral':
              msg = 'Los datos se han adicionado satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getTrayectoriaLaboralByPersona",
   // type: "GroupingStore",
    type: "Store",
      remoteSort: true,
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idtrayectorialaboral"},
          {name: "idpersona"},
          {name: "orgentidad"},
          {name: "cargo"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "denominacion"},
          {name: "observacion"},
          {name: "falta"},
          {name: "fbaja"},
          {name: "noalta"},
          {name: "motivobaja"},
          {name: "tiempoa"},
          {name: "tiempom"},
          {name: "tiempod"},
          {name: "categocup"}
        ],
         /* sortInfo: {field: 'orgentidad', direction: "DESC"},
          groupField: 'orgentidad'*/
}
,
view:{/*
 type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{text}  Fecha Alta:{[values.rs[0].data.falta]} Fecha Baja:{[values.rs[0].data.fbaja]}'
     */  
}
,
listeners:{

},
};
/**
 * Componente Estudios concluidos
 */
Ext.persona.cmp68 = {
columns:[ 
  {header: "Tipo de formación", width: 200, sortable: true, dataIndex: "denomtipoformacion"},
  {header: "Forma de la preparación", width: 200, sortable: true, dataIndex: "denommodoformacion"},
  {header: "Curso", width: 150, sortable: true, dataIndex: "curso"},
  {header: "Desde", width: 100, sortable: true, dataIndex: "fdesde"},
  {header: "Hasta", width: 100, sortable: true, dataIndex: "fhasta"},
  {header: "Tipo de centro de estudio", width: 200, sortable: true, dataIndex: "tipocentroestudio"},    
  {header: "Centro de estudio", width: 200, sortable: true, dataIndex: "denomcentroestudio"},    
  /*{header: "Hist&oacute;rico", hidden: true, sortable: true, dataIndex: "historico", renderer: function (v)
   {
     return (v == 1) ? 'Actual' : 'Hist&oacute;rico';
   }}*/
],
aplicarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  
  values.denomtipoformacion = Ext.getCmp("73" + this.idpadre) ? Ext.getCmp("73" + this.idpadre).getRawValue():'';
  
  values.denommodoformacion = Ext.getCmp("71" + this.idpadre) ? Ext.getCmp("71" + this.idpadre).getRawValue():''; 

  values.denomcentroestudio = Ext.getCmp("72" + this.idpadre).getRawValue();  
  
  values.tipocentroestudio = Ext.getCmp("1405" + this.idpadre).getRawValue();  
  
  values.curso = Ext.getCmp("74" + this.idpadre).getRawValue();  
  

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.ideducacion)) {//Si es vacio es porke estoy adicionando
    values.ideducacion = Ext.id();
    values.add = true;
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch (error) {
      Ext.Notification.show({
        title: 'Error',
        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
        icon: 'error'
      });
    }
  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
eliminarHandler:function(){
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar el estudio seleccionado?' : 
    '¿Está seguro que quiere eliminar los estudios seleccionados?';
	mostrarMensaje(2, ask, function (btn)
                   {
                     if (btn == 'ok') {

                       
                       Ext.each(records, function (rec)
                                {
                                  if (!rec.data.add) {
                                    this.arrDel.push(rec.get('ideducacion'));
                                  }
                                  this.gpGrid.getStore().remove(rec);
                                }, this);
                       this.gpGrid.getView().refresh();
                     }
                   }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar datos de estudio",
        ttBtnMod:"Modificar datos de estudio",
        ttBtnDel:"Eliminar datos de estudio",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function(){
  var values = this.fpFormulario.getForm().getValues();
  
  values.denomtipoformacion = Ext.getCmp("73" + this.idpadre) ? Ext.getCmp("73" + this.idpadre).getRawValue():'';
  
  values.denommodoformacion = Ext.getCmp("71" + this.idpadre) ? Ext.getCmp("71" + this.idpadre).getRawValue():''; 
  
  values.denomcentroestudio = Ext.getCmp("72" + this.idpadre).getRawValue();  
  
  values.tipocentroestudio = Ext.getCmp("1405" + this.idpadre).getRawValue();
   
  values.curso = Ext.getCmp("74" + this.idpadre).getRawValue();  

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.ideducacion)) {//Si es vacio es porke estoy adicionando
    values.ideducacion = Ext.id();
    values.add = true;
    try {
      store.add(new Ext.data.Record(values));
      this.cancelarHandler();
    } catch (error) {
      Ext.Notification.show({
        title: 'Error',
        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
        icon: 'error'
      });
    }
  }else {
    var record;
    //Iteracion para validar la modificacion y obtener el record a modificar
    Ext.each(store.getRange(), function (rec)
    {
      if (rec.get('ideducacion') === values.ideducacion) {
        record = rec; //Obtengo el record que se va a modificar
        return false;
      }
    });
    
    try {
      for (var p in values) {
        if (values[p] != record.get(p)) {
          record.set(p, values[p]);
        }
      }
      this.cancelarHandler();
    } catch (error) {
      Ext.Notification.show({
        title: 'Error',
        msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador.',
        icon: 'error'
      });
    }

  }
  store.clearGrouping();
  store.groupBy('historico', true);

  function isActual(fi, ff)
  {
    if (!Ext.isEmpty(ff)) {//Si la fecha fin es ditinto de vacio
      var date = new Date();
      date = date.format('d/m/Y');
      var arrfi = fi.split('/');
      var arrff = ff.split('/');
      var arrfa = date.split('/');
      var fi = arrfi[2] + arrfi[1] + arrfi[0];
      var ff = arrff[2] + arrff[1] + arrff[0];
      var fa = arrfa[2] + arrfa[1] + arrfa[0];
      fi = parseInt(fi);
      ff = parseInt(ff);
      fa = parseInt(fa);
      return (fi <= fa && fa <= ff) ? 1 : 0;
      //1->Actual  0->Historico
    }
    return 1;
  }
},
loadFn:function(idpersona){
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
saveFn:function(btnPress){
  var self = this;
  var store = this.gpGrid.getStore();
  this.arrAdd = [];
  this.arrMod = [];
  var pass = false;
  Ext.each(store.getRange(), function (rec)
           {
             if (rec.data.add) {//Si es un record que se adiciono nuevo
               this.arrAdd.push(rec.data);
             } else {
               if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
                 this.arrMod.push(rec.data);
               }
             }             
               pass = true;
           }, this);
  if (!pass && this.obligatorio) {
    Ext.Notification.show({
      title: 'Advertencia',
      msg: 'El dato de estudio que quiere adicionar ya existe.',
      icon: 'warning'
    });
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modDatosEducacionales';
  } else
    if (this.arrDel.length > 0) {
      url = 'delDatosEducacionales';
    } else {
      url = 'addDatosEducacionales';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg = '';
          switch (url) {
            case 'modDatosEducacionales':
              msg = 'El(Los) dato(s) de estudio(s) ha(n) sido modificado(s) satisfactoriamente.';
              break;
            case 'delDatosEducacionales':
              msg = 'El(Los) dato(s) de estudio(s) ha(n) sido eliminado(s) satisfactoriamente.';
              break;
            case 'addDatosEducacionales':
              msg = 'El(Los) dato(s) de estudio(s) ha(n) sido adicionado(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "RowSelectionModel",
  singleSelect: false
},
store:{
  url: "getDatosEducacionales",
    type: "GroupingStore",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "ideducacion"},
          {name: "idtipoformacion"},
          {name: "denomtipoformacion"},
          {name: "idmodoformacion"},
          {name: "denommodoformacion"},
          {name: "idtipocentroestudio"},
          {name: "tipocentroestudio"},
          {name: "idcentroestudio"},
          {name: "denomcentroestudio"},
          {name: "idcurso"},
          {name: "curso"},
          {name: "resultado"},
          {name: "fdesde"},
          {name: "fhasta"},
          {name: "historico"}
        ],
          sortInfo: {field: 'historico', direction: "DESC"},
            groupField: 'historico'
},
view:{
  /*type: 'GroupingView',
    startCollapsed: false,
      groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Registros" : "Registro"]})'*/
},
listeners:{

},
};
/**
 * Componente Sanciones
 */
Ext.persona.cmp1010 = {
columns:[
  {header: "Tipo de sanción", width: 100, sortable: true, dataIndex: "denomtiposancion"},
  {header: "Sanción", width: 180, sortable: true, dataIndex: "denomsancion"},  
  {header: "Motivo de sanción", width: 280, sortable: true, dataIndex: "denommotivosancion"},
  {header: "Fecha de imposición", width: 100, sortable: true, dataIndex: "fimposicion"},
  {header: "Fecha de notificación", width: 100, sortable: true, dataIndex: "fnotificacion"},
  {header: "Fecha de rehabilitación", width: 100, sortable: true, dataIndex: "frehabilitacion"}
],
adicionarHandler:function(){
  //Limpiando el combo Tipo de sanción seleccionada
  if(Ext.getCmp("1012" + this.idpadre))
  	Ext.getCmp("1012" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo de la sanción seleccionada
  Ext.getCmp("1013" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo del motivo de sanción seleccionado
  Ext.getCmp("1016" + this.idpadre).store.clearFilter(true);
},
aplicarHandler:function ()
{
  var values = this.fpFormulario.getForm().getValues();
  //Obteniendo la denominacion de Tipo de sanción seleccionada
  values.denomtiposancion = (Ext.getCmp("1012" + this.idpadre))?Ext.getCmp("1012" + this.idpadre).getRawValue():'';
  //Obteniendo la denominacion de la sanción seleccionada
  values.denomsancion = Ext.getCmp("1013" + this.idpadre).getRawValue();
  //Obteniendo la denominacion del motivo de sanción seleccionado
  values.denommotivosancion = Ext.getCmp("1016" + this.idpadre).getRawValue();
  values.idcargofacultado = Ext.getCmp("1291" + this.idpadre).getValue();
  
  if(Ext.isEmpty(values.tiemposancion)){
  	values.unidadtiempo = '';
  }

  var store = this.gpGrid.getStore();
  var index = -1;
  if (Ext.isEmpty(values.idsancionp)){
    values.idsancionp = Ext.id();
    values.add = true;
    try {
      store.add(new Ext.data.Record(values));
      this.cleanForm();
    } catch (error) {
      Ext.Notification.show({
        title: 'Error',
        msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador.',
        icon: 'error'
      });
    }
  }
},
eliminarHandler:function ()
{
  var records = this.gpGrid.getSelectionModel().getSelections();
   var ask = (records.length == 1) ? '¿Está seguro que quiere eliminar la sanción seleccionada?' : 
    '¿Está seguro que quiere eliminar las sanciones seleccionadas?';
	mostrarMensaje(2,ask, function (btn)
        {
            if (btn == 'ok') {
                var records = this.gpGrid.getSelectionModel().getSelections();
                Ext.each(records, function (rec)
                {
                    if (!rec.data.add) {
                        this.arrDel.push(rec.get('idsancionp'));
                    }
                    this.gpGrid.getStore().remove(rec);
                }, this);

                this.gpGrid.getView().refresh();
            }
        }.createDelegate(this));
},
getLanguaje:function(idioma){
  var lang={};
 if(idioma==='es'){
     lang ={
        ttBtnAdd:"Adicionar sanci&oacute;n",
        ttBtnMod:"Modificar sanci&oacute;n",
        ttBtnDel:"Eliminar sanci&oacute;n",
        ttBtnSave:"Guardar datos y cerrar formulario",
        ttBtnApl:"Guardar datos y limpiar los campos",
        ttBtnCancel:"Cerrar formulario sin guardar los datos"      

      }  	
    }else{
     lang = {
        
      }  	
      
    }
  return lang;
	
},
guardarHandler:function ()
{
    var values = this.fpFormulario.getForm().getValues();
    //Obteniendo la denominacion de Tipo de sanción seleccionada
    values.denomtiposancion = (Ext.getCmp("1012" + this.idpadre)) ? Ext.getCmp("1012" + this.idpadre).getRawValue() : '';
    //Obteniendo la denominacion de la sanción seleccionada
    values.denomsancion = Ext.getCmp("1013" + this.idpadre).getRawValue();
    //Obteniendo la denominacion del motivo de sanción seleccionado
    values.denommotivosancion = Ext.getCmp("1016" + this.idpadre).getRawValue();
    values.idcargofacultado = Ext.getCmp("1291" + this.idpadre).getValue();

    if (Ext.isEmpty(values.tiemposancion)) {
        values.unidadtiempo = '';
    }

    var store = this.gpGrid.getStore();

    if (Ext.isEmpty(values.idsancionp)) {
        values.idsancionp = Ext.id();
        values.add = true;
        try {
            store.add(new Ext.data.Record(values));
            this.cancelarHandler();
        } catch (error) {
            Ext.Notification.show({
                title: 'Error',
                msg: 'Ha ocurrido un error mientras se guardaba, contacte el administrador',
                icon: 'error'
            });
        }
    } else {
        var record;
        Ext.each(store.getRange(), function (rec)
        {
            if (rec.get('idsancionp') == values.idsancionp) {
                record = rec;
                return false;
            }
        });

        try {
            for (var p in values) {
                if (values[p] != record.get(p)) {
                    record.set(p, values[p]);
                }
            }
            this.cancelarHandler();
        } catch (error) {
            Ext.Notification.show({
                title: 'Error',
                msg: 'Ha ocurrido un error mientras se modificaba, contacte el administrador',
                icon: 'error'
            });
        }

    }
},
loadFn:function (idpersona)
{
  this.arrAdd = [];
  this.arrMod = [];
  this.arrDel = [];
  this.loadGridStore({idpersona: idpersona});
},
modificarHandler:function(){
  //Limpiando el combo Tipo de sanción seleccionada
  if(Ext.getCmp("1012" + this.idpadre))
  	Ext.getCmp("1012" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo de la sanción seleccionada
  Ext.getCmp("1013" + this.idpadre).store.clearFilter(true);
  //Limpiando el combo del motivo de sanción seleccionado
  Ext.getCmp("1016" + this.idpadre).store.clearFilter(true);

  var record = this.gpGrid.getSelectionModel().getSelected();
  this.loadFormulario(record);

},
saveFn:function (btnPress)
{
  var store = this.gpGrid.getStore();
  var self = this;
  var pass = false;
  this.arrAdd = [];
  this.arrMod = [];
  Ext.each(store.getRange(), function (rec)
  {
    if (rec.data.add) {//Si es un record que se adiciono nuevo
      this.arrAdd.push(rec.data);
    } else {
      if (!Ext.isEmpty(rec.modified)) {//Si el record fue modificado
        this.arrMod.push(rec.data);
      }
    }
    pass = true;
  }, this);
  if (!pass && this.obligatorio) {
    Ext.Notification.show({
      title: 'Advertencia',
      msg: 'La persona debe tener una sanción registrada',
      icon: 'warning'
    });
    return false;
  }
  var url = '';
  if (this.arrMod.length > 0 || (this.arrDel.length > 0 && this.arrAdd.length > 0)) {
    url = 'modSanciones';
  } else
    if (this.arrDel.length > 0) {
      url = 'delSanciones';
    } else {
      url = 'addSanciones';
    }
  if (this.arrAdd.length > 0 || this.arrMod.length > 0 || this.arrDel.length > 0) {
    Ext.sendAjax.request({
      url: url,
      params: {
        arrAdd: Ext.encode(self.arrAdd),
        arrMod: Ext.encode(self.arrMod),
        arrDel: Ext.encode(self.arrDel)
      },
      success: function (response, opt, notification)
      {
        var dataResponse = Ext.decode(response.responseText);
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') { //Si el boton que ejecuto la funcion fue aplicar
            this.loadFn(Ext.getCmp(this.idpadre).persona.idpersona);
          }
          this.arrAdd = [];
          this.arrMod = [];
          this.arrDel = [];
          var msg;
          switch (url) {
            case 'modSanciones':
              msg = 'La(s) sanción(es) ha(n) sido modificada(s) satisfactoriamente.';
              break;
            case 'delSanciones':
              msg = 'La(s) sanción(es) ha(n) sido eliminada(s) satisfactoriamente.';
              break;
            case 'addSanciones':
              msg = 'La(s) sanción(es) ha(n) sido adicionada(s) satisfactoriamente.';
              break
          }
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
sm:{
  type: "CheckboxSelectionModel",
  singleSelect: false
},
store:{
  url: "getSanciones",
    type: "Store",
      reader: {
        type: "JsonReader",
          totalProperty: "quantity",
            root: "data"
      },
        mapping: [
          {name: "idsancionp"},
          {name: "idtiposancion"},
          {name: "denomtiposancion"},
          {name: "idsancion"},
          {name: "denomsancion"},
          {name: "idmotivosancion"},
          {name: "denommotivosancion"},
          {name: "tiemposancion"},
          {name: "unidadtiempo"},
          {name: "fimposicion"},
          {name: "frehabilitacion"},
          {name: "observacion"},
          {name: "fnotificacion"},
          {name: "resolucion"},
          {name: "denominacion"},
          {name: "idcargofacultado"},
          {name: "resrehabilitacion"},
          {name: "cargopropuesto"},
          {name: "idcargopropuesto"}
        ]
},
listeners:{

},
};
/**
 * Componente Datos primarios
 */
Ext.persona.cmp58 = {
gSecurity:function() {
  var resp = true;
  switch(Ext.getCmp(this.idpadre).accion) {
    case 'ADD':
      if(parseInt(this.segAction[0]) === 1){ //Si puede adicionar
        resp = false;
      }
      break;
    case 'MOD':
      if(parseInt(this.segAction[1]) === 1){//Si puede modificar
        resp = false;
      }
      break;
  }
  if(resp)
    Ext.getCmp("60" + this.idpadre).getForm().reset();
  return resp;
},
isDirty:function() {
  return Ext.getCmp("60" + this.idpadre).getForm().isDirty();
},
loadFn:function (record) {
  var values = Ext.getCmp(this.idpadre).persona;
  values.sexo = (values.sexo === 'Femenino' || values.sexo === '0') ? 0 : 1;
  Ext.getCmp("60" + this.idpadre).getForm().loadRecord(new Ext.data.Record(values));
  Ext.getCmp("3" + this.idpadre).setValue(values.idtipodocidentidad);
  Ext.getCmp("3" + this.idpadre).setRawValue(values.denomTipoDocIdentidad);
  var denom = (values.denomTipoDocIdentidad || '').toLowerCase();
  if (denom.indexOf('far') !== -1) {
      Ext.getCmp("4" + this.idpadre).minLength = 4;
      Ext.getCmp("4" + this.idpadre).maxLength = 6;
      Ext.getCmp("4" + this.idpadre).vtype=values.type;
      Ext.getCmp("4" + this.idpadre).maxLengthText='El tamaño máximo requerido es 4 caracteres.';
      Ext.getCmp("4" + this.idpadre).minLengthText='El tamaño mínimo requerido es 6 caracteres.';
      Ext.getCmp("4" + this.idpadre).render();
  } else if (denom.indexOf('identidad') !== -1) {
      Ext.getCmp("4" + this.idpadre).minLength = 11;
      Ext.getCmp("4" + this.idpadre).maxLength = 11;
      Ext.getCmp("4" + this.idpadre).vtype=values.type;
      Ext.getCmp("4" + this.idpadre).maxLengthText='El tamaño máximo requerido es 11 caracteres.';
      Ext.getCmp("4" + this.idpadre).minLengthText='El tamaño mínimo requerido es 11 caracteres.';
      Ext.getCmp("4" + this.idpadre).render();
  } else {
      Ext.getCmp("4" + this.idpadre).minLength = 11;
      Ext.getCmp("4" + this.idpadre).maxLength = 11;
      Ext.getCmp("4" + this.idpadre).vtype=values.type;
      Ext.getCmp("4" + this.idpadre).maxLengthText='El tamaño máximo requerido es 11 caracteres.';
      Ext.getCmp("4" + this.idpadre).minLengthText='El tamaño mínimo requerido es 11 caracteres.';
      Ext.getCmp("4" + this.idpadre).render();
  }

  var pFoto = Ext.getCmp("59" + this.idpadre);
  if (!Ext.isEmpty(values.foto)) {
    pFoto.setImgPrincipal.call(pFoto, 'data:image/jpg;base64,' + values.foto);
  } else {
    pFoto.setSexoImgDefault.call(pFoto, values.sexo);
  }
  pFoto.setPersona.call(pFoto, values.idpersona);
},
saveFn:function(btnPress){
  var persona={};
  if(Ext.getCmp("58" + this.idpadre).gSecurity())return; //Si devuelve TRUE es porque tiene permisos para realizar la gestion correspondiente
  
  this.concept = "principal";
  var accion = Ext.getCmp(this.idpadre).accion;
  var pFoto = Ext.getCmp("59" + this.idpadre)    
   if (Ext.getCmp("60" + this.idpadre).getForm().isValid() || pFoto.isDirty.call(pFoto)) {  
    Ext.sendAjax.request({
      url: accion == "ADD" ? 'addPerson' : 'modPerson',
      params: {
        persona: Ext.encode(Ext.getCmp("60" + this.idpadre).getForm().getValues()),
        fotos: Ext.encode(Ext.getCmp("59" + this.idpadre).saveFn.call(Ext.getCmp("59" + this.idpadre))),
        fotoPrincipal:Ext.getCmp("59" + this.idpadre).fotoPrincipal,
        datos:Ext.encode(this.datos)
        
      },
      success: function (response, opt, notification)
      {        
        var dataResponse = Ext.decode(response.responseText);
       
        if (dataResponse.success) {
          if (btnPress === 'APLICAR') {
            Ext.getCmp(this.idpadre).fireEvent("changeStatus", dataResponse.datos);
            
          }
         this.loadFn(dataResponse.datos);
          var msg = (accion == 'ADD')
          ? 'La datos de la persona han sido adicionados satisfactoriamente.'
          : 'La datos de la persona han sido modificados satisfactoriamente.';
          notification({
            title: 'Informaci&oacute;n',
            msg: msg,
            icon: 'ok'
          });
        } else {
          switch (dataResponse.codigo) {
            case 5:
              notification({
                title: 'Error',
                msg: 'Ya existe una persona con este número.',
                icon: 'error'
              });
              break;  
            default :
              notification({
                title: 'Error',
                msg: 'Ha ocurrido un error durante la transaccion.',
                icon: 'error'
              });
              break;
          }
        }
      }.createDelegate(this)
    }, this);
  }
},
listeners:{
expand:function (cmp) {
  if (cmp.rendered) {
    cmp.doLayout();
  }
},
render:function(p) {
  p.datos = new Array();
  let self = this;
  var accionTab = Ext.getCmp(p.idpadre).accion;
  if(!p.buscadorfuc) {
    p.buscadorfuc = new Ext.Persona.BuscadorFUC();
    if(accionTab == 'ADD' && p.fdatos == 1) {
      p.buscadorfuc.show();
    }
    p.buscadorfuc.btnAceptarFUC.setHandler(function () {
      let persona = p.buscadorfuc.gridResultado.getSelectionModel().getSelected().data;
      Ext.getCmp("61" + self.idpadre).setValue(persona.primer_nombre);
      Ext.getCmp("62" + self.idpadre).setValue(persona.segundo_nombre);
      Ext.getCmp("63" + self.idpadre).setValue(persona.primer_apellido);
      Ext.getCmp("64" + self.idpadre).setValue(persona.segundo_apellido);
      Ext.getCmp("70" + self.idpadre).setValue((persona.sexo == 'M') ? 1 : 0);
      Ext.getCmp("3" + self.idpadre).setValue(1);
      Ext.getCmp("4" + self.idpadre).setValue(persona.identidad_numero);
      Ext.getCmp("1160" + self.idpadre).setValue(persona.id);
      Ext.getCmp('btnAplicarPers').enable();
      Ext.getCmp('btnAceptSavePers').enable();
      p.buscadorfuc.hide();
    });
  }
  Ext.getCmp("61" + this.idpadre).focus(true,200); 
},
resize:function(cmp){
  if (cmp.rendered && Ext.getCmp("60" + this.idpadre).rendered && Ext.getCmp("59" + this.idpadre).rendered) {
    cmp.collapse();
    cmp.expand(true);
  }
},

},
};
/**
 * Componente Nombre
 */
Ext.persona.cmp61 = {
onTrigger2Click:function () {
  /*var buscadorSuin = Ext.getCmp("58" + this.idpadre).buscadorSuin;
  if(buscadorSuin){
    buscadorSuin.show();
  }*/
  var fuc = Ext.getCmp("58" + this.idpadre).buscadorfuc;
  if(fuc){
    fuc.show();
  }
},
listeners:{
render:function () {
  this.triggers[0].hide();
  //Verifica si emplea fuente de datos para el registro.
  if(this.fdatos==1){
    this.triggers[1].show();
  }else{
    this.triggers[1].hide();
  }
},

},
};
