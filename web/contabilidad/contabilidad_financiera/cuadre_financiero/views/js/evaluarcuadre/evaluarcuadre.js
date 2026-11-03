  Ext.QuickTips.init();
  var perfil = window.parent.perfil;
  perfil.etiquetas = Object();
  UCID.portal.cargarEtiquetas('evaluarcuadre', function() {
      cargarInterfaz(perfil.etiquetas);
  });
  var global_printer = null;  // it has to be on the index page or the generator page  always
  function printmygridGO(obj) {
      global_printer.printGrid(obj);
  }
  function printmygridGOcustom(obj) {
      global_printer.printCustom(obj);
  }

  var pconc, stconc, sm, winEntidades, tabla_cabeza, tabla_pie, nombreEstructura;
  var fechaContable;//almacena la fecha actual contable del sistema
  var fechaReporte;//fecha fin para el reporte
  function cargarInterfaz(idioma) {

      var btnBuscar = new Ext.Button({
          disabled: true,
          id: 'btnBus',
          icon: perfil.dirImg + 'buscar.png',
          iconCls: 'btn',
          text: idioma.lbBuscar,
          handler: function() {
              Buscar();
          }
      });
      var btnImprimir = new Ext.Button({
          hidden: false,
          id: 'btnimpr',
          icon: perfil.dirImg + 'imprimir.png',
          iconCls: 'btn',
          text: idioma.lbImprimir,
          tooltip: idioma.ttImprimir,
          handler: function() {
              basic_printGrid();
          }
      });
      var btnCalcular = new Ext.Button({
          hidden: false,
          id: 'btnconc',
          icon: perfil.dirImg + 'calcular.png',
          iconCls: 'btn',
          text: idioma.lbCalcular,
          tooltip: idioma.ttCalcular,
          handler: function() {
              calcularSaldos();
          }
      });
      var btnVistaReporte = new Ext.Button({
          id: 'btnVistaReporte',
          tabIndex: 2,
          disabled: true,
          hidden: true,
          iconCls: 'btn',
          icon: perfil.dirImg + 'abrir.png',
          text: idioma.lbBtnVista,
          tooltip: idioma.lbTtReporte,
          handler: fObtenerDatosImprimirReporte
      });
      var btnayuda = new Ext.Button({
          icon: perfil.dirImg + 'ayuda.png',
          iconCls: 'btn',
          text: idioma.btnayuda,
          tooltip: idioma.ttayuda,
          handler: function() {

              var title = 'Mostrar ayuda de la funcionalidad';
              var referencia = 'confin/analisisE/cuadreF/evaluarC';
              help.show(title, referencia);


          }


      });
      var stperiodo = new Ext.data.Store({
          url: 'cargarperiodos',
          reader: new Ext.data.JsonReader({
              id: 'periodo'
          },
          [{
                  name: 'idperiodo'
              },
              {
                  name: 'nombre'
              }, {
                  name: 'fin'
              }])
      });
      var stejercicio = new Ext.data.Store({
          url: 'cargarejercicios',
          reader: new Ext.data.JsonReader({
              id: 'periodo'
          },
          [{
                  name: 'idejercicio'
              },
              {
                  name: 'nombre'
              }, {
                  name: 'fin'
              }])
      });
      stejercicio.load();
      var tfEntidad = new Ext.form.TextArea({
          fieldLabel: idioma.lbEntidad,
          emptyText: idioma.lbemptyentidad,
          name: 'entidad',
          id: 'entidad',
          anchor: '98%',
          disabled: true,
          height: 50,
          enableKeyEvents: true
      });
      var tfBuscarEnt = new Ext.form.TextField({
          name: 'buscar',
          id: 'buscar',
          anchor: '90%',
          enableKeyEvents: true
      });
      var cbPeriodo = new Ext.form.ComboBox({
          forceSelection: true,
          fieldLabel: idioma.lbPeriodo,
          emptyText: idioma.ttPeriodo,
          store: stperiodo,
          valueField: 'idperiodo',
          displayField: 'nombre',
          hiddenName: 'idperiodo',
          typeAhead: true,
          mode: 'local',
          triggerAction: 'all',
          selectOnFocus: true,
          enableKeyEvents: true,
          anchor: '98%'
      });
      var cbEjercicio = new Ext.form.ComboBox({
          fieldLabel: idioma.lbEjercicio,
          emptyText: idioma.ttEjercicio,
          forceSelection: true,
          store: stejercicio,
          valueField: 'idejercicio',
          displayField: 'nombre',
          hiddenName: 'idejercicio',
          typeAhead: true,
          mode: 'local',
          triggerAction: 'all',
          selectOnFocus: true,
          enableKeyEvents: true,
          anchor: '98%',
          listeners: {
              select: function(t, r) {
                  cbPeriodo.reset();
                  MostrarEtiquetas(idioma.msgLoadPeriodos + r.data.nombre + '...');
                  stperiodo.load({
                      params: {
                          idejercicio: r.data.idejercicio
                      },
                      callback: function() {
                          lMask.hide();
                      }
                  });
              }
          }
      });
      var dfHasta = new Ext.form.DateField({
          fieldLabel: idioma.lbFechaHasta,
          name: 'hastaintrv',
          id: 'dfHasta',
          format: 'd/m/Y',
          anchor: '98%'
      });
      var pdatos = new Ext.FormPanel({
          frame: true,
          border: false,
          height: 110,
          region: 'north',
          items: [{
                  xtype: 'fieldset',
                  autoHeight: true,
                  id: 'fsavanzado',
                  title: idioma.lbFiltroAvanzado,
                  collapsible: true,
                  anchor: '100%',
                  listeners: {
                      collapse: function(t) {
                          pdatos.setHeight(30);
                          pcentro.doLayout();
                      },
                      expand: function(t) {
                          pdatos.setHeight(110);
                          pcentro.doLayout();
                      }
                  },
                  items: [{
                          layout: 'column',
                          items: [{
                                  columnWidth: .3,
                                  layout: 'form',
                                  style: 'margin: 5 0 0 10',
                                  labelWidth: 50,
                                  items: [cbEjercicio, cbPeriodo]
                              }, {
                                  columnWidth: .2,
                                  layout: 'form',
                                  style: 'margin: 5 0 0 10',
                                  labelWidth: 40,
                                  items: [dfHasta]
                              }, {
                                  columnWidth: .5,
                                  layout: 'form',
                                  style: 'margin: 5 0 0 10',
                                  labelWidth: 50,
                                  items: [tfEntidad]
                              }]
                      }]
              }
          ]
      });
      storeGridc = new Ext.data.Store({
          url: 'cargarg',
          listeners: {
              load: function() {
              }
          },
          reader: new Ext.data.JsonReader({
              totalProperty: "cantidad_filas",
              root: "contenidos",
              id: "idcomp"
          }, [{
                  name: 'idcomprobante'
              }, {
                  name: 'formula',
                  mapping: 'formula'
              }, {
                  name: 'saldo_MI',
                  mapping: 'saldo_MI'
              }, {
                  name: 'saldo_MD',
                  mapping: 'saldo_MD'
              }, {
                  name: 'dif',
                  mapping: 'dif'
              }
          ])
      });
      var store = new Ext.data.SimpleStore({
          fields: [
              {
                  name: 'formula'
              },
              {
                  name: 'saldo_MI'
              },
              {
                  name: 'saldo_MD'
              },
              {
                  name: 'dif'
              }
          ]
      });
      sm = new Ext.grid.RowSelectionModel({
          singleSelect: true,
          listeners: {
              rowselect: function(smodel, rowIndex, record) {
                  Ext.getCmp('gpEvaluarCuadre').getView().addRowClass(rowIndex, "negrita");
              },
              rowdeselect: function(smodel, rowIndex, record) {
                  Ext.getCmp('gpEvaluarCuadre').getView().removeRowClass(rowIndex, "negrita");
              }
          }
      });
      gconc = new Ext.grid.EditorGridPanel({
          id: 'gpEvaluarCuadre',
          title: idioma.lbTitleCuadre,
          frame: true,
          autoExpandColumn: 'formula',
          region: 'center',
          store: store,
          sm: sm,
          stripeRows: true,
          layoutConfig: {
              forceFit: true
          },
          autoscroll: true,
          columns: [{
                  header: idioma.lbFormula,
                  align: 'left',
                  sortable: true,
                  id: 'formula',
                  dataIndex: 'formula'
              }, {
                  header: idioma.lbSaldoMI,
                  width: 230,
                  align: 'right',
                  sortable: true,
                  dataIndex: 'saldo_MI',
                  renderer: function(f) {
                      if(f == ' ') {
                          return '';
                      }
                      else {
                          with(Math)
                              x = eval(f);
                          if(x == 'NaN') {
                              return 0;
                          }
                          else {
                              return formatoMoneda(x);
                          }
                      }
                  }
              }, {
                  header: idioma.lbSaldoMD,
                  width: 230,
                  align: 'right',
                  sortable: true,
                  dataIndex: 'saldo_MD',
                  renderer: function(f) {
                      if(f == ' ') {
                          return '';
                      }
                      else {
                          with(Math)
                              x = eval(f);
                          if(x == 'NaN') {
                              return 0;
                          }
                          else {
                              return formatoMoneda(x);
                          }
                      }
                  }
              }, {
                  header: idioma.lbDiferencia,
                  align: 'right',
                  width: 230,
                  sortable: true,
                  dataIndex: 'dif',
                  id: 'dif',
                  renderer: function(f) {
                      if(f == ' ') {
                          return '';
                      }
                      else {
                          with(Math)
                              x = eval(f);
                          x = Math.round(x * 100) / 100;
                          if(x == 'NaN') {
                              return 0;
                          }
                          else {
                              return formatoMoneda(x);
                          }
                      }
                  }
              }]
      });
      var pcentro = new Ext.Panel({
          region: 'center',
          layout: 'border',
          frame: false,
          border: false,
          tbar: [btnCalcular, btnImprimir, btnVistaReporte, '->', btnayuda],
          items: [gconc, pdatos],
          keys: new Ext.KeyMap(Ext.getBody(), [
              {
                  key: 'h',
                  alt: true,
                  fn: function() {
                      var title = 'Mostrar ayuda de la funcionalidad';
                      var referencia = 'confin/analisisE/cuadreF/evaluarC';
                      help.show(title, referencia);
                  }
              },
              {
                  key: 'r',
                  alt: true,
                  fn: function() {
                      if(!Ext.getCmp('btnVistaReporte').disabled){
                          Ext.getCmp('btnVistaReporte').handler.call();
                      }
                  }
              }
          ])
      });
      new Ext.Viewport({
          layout: 'fit',
          items: pcentro
      });
      function esCadenaVacia(text) {
          for(i = 0; i < text.length; i++)
              if(text.charAt(i) != ' ')
                  return false;
          return true;
      }
      tfEntidad.on({
          keyup: function(t, e) {
              if(t.getValue().length == 0) {
                  btnBuscar.disable();
              } else if(t.getValue().length == 0){
                  btnBuscar.disable();
              }else if(t.getValue().length > 0 && !esCadenaVacia(t.getValue())){
                  btnBuscar.enable();
              }else if(t.getValue().length == 0){
                  btnBuscar.disable();
              }
          },
          keypress: function(t, e) {
              if(e.getKey() == 13 && t.getValue().length > 0 && !esCadenaVacia(t.getValue())){
                  Buscar();
              }else if(esCadenaVacia(t.getValue())){
                  t.setValue('');
              }
          }, 
          focus: function(t, e) {
              mostrarEntidades();
          }
      });
      function fObtenerDatosImprimirReporte() {
          Ext.Msg.wait(idioma.lbCargando, idioma.lbEsperando);
          Ext.Ajax.request({
              method: "POST",
              url: 'obtenerdatosreporte',
              callback: function(options, success, response) {
                  var responseData = Ext.decode(response.responseText);
                  Ext.Msg.hide();
                  if(responseData.datoCuerpo.length > 0) {
//                      Ext.getCmp('btnVistaReporte').enable();
                      fOpenWindowReport(responseData);
                  } else {
//                      Ext.getCmp('btnVistaReporte').disable();
                      mostrarMensaje(1, idioma.lbNoData);
                  }
              }
          });
      }
      function fOpenWindowReport(requestDataSources) {
          printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
              paperSize: "FOLIO",
              orientation: "Horizontal",
              reportType: "HTML"
          });
          printView.show();
      }
      function Buscar() {
          treeLoader.baseParams = {
              descripcion: tfBuscarEnt.getValue(),
              opcion: 'BSC'
          };
          treeLoader.load(nodopadre,
                  function(options, success, response) {
                      treeLoader.baseParams = {
                          opcion: 'CRG'
                      };
                      nodopadre.expand();
                      tfBuscarEnt.focus(true);
                      nodopadre.setText(idioma.lbFiltroEntidades);
                  });
      }
      function buscarEstructurae() {
          Ext.Ajax.request({
              url: 'obtenerestructurae',
              callback: function(options, success, response) {
                  responseData = Ext.decode(response.responseText);
                  idestructurae = responseData.idestructurae;
                  descripcion = responseData.descripcion;
                  nombreEstructura = descripcion;//almaceno el nombre de la estructura para el imprimir
                  nodopadre = new Ext.tree.AsyncTreeNode({
                      text: descripcion,
                      draggable: false,
                      id: idestructurae,
                      checked: true
                  })
                  treeLoader = new Ext.tree.TreeLoader({
                      baseParams: {
                          opcion: 'CRG'
                      },
                      dataUrl: 'cargararbolestructurae'
                  });
                  tpEstructurae = new Ext.tree.TreePanel({
                      autoScroll: true,
                      id: 'tpestructurae',
                      style: 'margin: 10 0 0 0',
                      enableDD: false,
                      border: false,
                      root: nodopadre,
                      margins: '2 2 2 2',
                      loader: treeLoader
                  });
                  pEntidades = new Ext.Panel({
                      frame: true,
                      labelWidth: 50,
                      tbar: [new Ext.Toolbar.TextItem(idioma.lbEntidad), tfBuscarEnt, '->', btnBuscar],
                      items: [tpEstructurae]
                  });
                  if(idestructurae && descripcion)
                      tfEntidad.enable();
              }
          });
      }
      buscarEstructurae();
      function mostrarEntidades() {
          chequeados = new Array();
          entselec = new Array();
          var texto = '';
          if(!winEntidades) {
              winEntidades = new Ext.Window({
                  modal: true,
                  resizable: false,
                  layout: 'fit',
                  closeAction: 'hide',
                  title: idioma.lbEntidades,
                  width: 400,
                  height: 400,
                  buttons: [{
                          text: idioma.btncancelar,
                          tooltip: idioma.ttcancelar,
                          icon: perfil.dirImg + 'cancelar.png',
                          iconCls: 'btn',
                          handler: function() {
                              winEntidades.hide();
                          }
                      }, {
                          text: idioma.btnaceptar,
                          tooltip: idioma.ttaceptar,
                          icon: perfil.dirImg + 'aceptar.png',
                          iconCls: 'btn',
                          handler: function() {
                              if(tpEstructurae.getChecked().length > 0) {
                                  chequeados = tpEstructurae.getChecked();
                                  for(var i = 0; i < chequeados.length; i++)
                                      entselec.push(chequeados[i]['id']);
                                  //stcuenta.reload({params:{entidades:Ext.encode(entselec)}});
                                  for(var j = 0; j < chequeados.length - 1; j++)
                                      texto += chequeados[j]['text'] + ', \n';
                                  texto += chequeados[chequeados.length - 1]['text'];
                              }
                              winEntidades.hide();
                              tfEntidad.reset();
                              //cbconcepto.reset();
                              tfEntidad.setValue(texto);
                              texto = '';
                          }
                      }]
              });
          }
          winEntidades.show();
          winEntidades.add(pEntidades);
          winEntidades.doLayout();
      }
      function MostrarEtiquetas(mensaje) {
          lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: mensaje
          });
          lMask.show();
      }
      function cargarFecha() {
          Ext.Ajax.request({
              url: 'cargarfecha',
              method: 'POST',
              callback: function(options, success, response) {
                  respData = Ext.decode(response.responseText);
                  if(respData != null) {
                      dfHasta.setValue(respData.fechacontable);
                      fechaContable = respData.fechacontable;
                      fechaReporte = respData.fechaserver;
                  }
              }
          });
      }
      cargarFecha();
      function calcularSaldos() {
          MostrarEtiquetas('Cargando...');
          var arrayTmp2 = new Array();
          if(!Ext.getCmp('entidad').getValue() == '') {//cojo las estructuras si las seleccionaron
              var nodosSelect = Ext.getCmp('tpestructurae').getChecked();
              for(var i = 0; i < nodosSelect.length; i++) {//almaceno id, text
                  var arrayTmp = new Array();
                  arrayTmp[0] = nodosSelect[i].id;
                  arrayTmp[1] = nodosSelect[i].text;
                  arrayTmp2[i] = arrayTmp;
              }
          }
          //si se selecciono la fecha se obtiene su valor
          if(Ext.getCmp('dfHasta').getValue() != '') {
              fechaReporte = Ext.getCmp('dfHasta').getRawValue();
          }
          Ext.Ajax.request({
              url: 'calcularcuadresfinancieros',
              method: 'POST',
              timeout: 3400000,
              callback: function(options, success, response) {
                  responseData = Ext.decode(response.responseText);
                  store.loadData(responseData);
                  lMask.hide();



              },
              params: {
                  fechafin: fechaReporte,
                  estructura: Ext.encode(arrayTmp2)
              }
          });
      }
      cbEjercicio.on('select', function(t, r) {
          fechaReporte = r.data.fin;
          Ext.getCmp('dfHasta').reset();
          cbPeriodo.reset();
      }, this);
      cbPeriodo.on('select', function(t, r) {
          fechaReporte = r.data.fin;
          Ext.getCmp('dfHasta').reset();
      }, this);
      function contex() {
          tabla_cabeza = '<table style="font-size:10px; solid #000" width="98%" align="center" cellpadding="0" cellspacing="0" cols="12">' +
                  '<tr>' +
                  '<td align="center" width="100%" colspan="6" style="font-size:14px;"><b>CUADRE DE LAS CUENTAS DEL BALANCE DE COMPROBACI&Oacute;N DE SALDOS</b></td>' +
                  '</tr>' +
                  '<tr>' +
                  '<td height="30" align="left" colspan="2" style="font-size:12px;"><b>ENTIDAD: ' + nombreEstructura + '</b></td>' +
                  '</tr>' +
                  '<tr>' +
                  '<td height="30" width="50%" align="left"style="font-size:12px;">' + '<b>Per&iacute;odo evaluado: </b>Hasta ' + fechaContable + '</td>' +
                  '<td height="30" width="50%" align="left"style="font-size:12px;">' + '<b>Fecha: </b>' + fechaReporte + '</td>' +
                  '</tr></table>';

          tabla_pie = '';
      }
      function basic_printGrid() {
          contex();
          global_printer = new Ext.grid.XPrinter({
              grid: gconc, // grid object
              pathPrinter: 'printer', // relative to where the Printer folder resides
              pdfEnable: true, // enables link PDF printing (only save as)
              hasrowAction: false,
              tampag: 40,
              localeData: {
                  Title: 'Cuadres financieros',
                  subTitle: tabla_cabeza,
                  footerText: tabla_pie,
                  pageNo: 'P&aacute;gina No.', //page label
                  printText: 'Imprimir',
                  closeText: 'Cerrar', //close window action label
                  pdfText: 'PDF'
              },
              useCustom: {// in this case you leave null values as we dont use a custom store and TPL
                  custom: false,
                  customStore: null,
                  columns: [],
                  alignCols: [],
                  pageToolbar: null,
                  useIt: false,
                  showIt: false,
                  location: 'bbar'
              },
              showdate: true, // show print date
              showdateFormat: 'd/m/Y H:i:s', //
              showFooter: true, // if the footer is shown on the pinting html
              styles: 'default' // wich style youre gonna use
          });
          global_printer.prepare(); // prepare the document
      }
  }
