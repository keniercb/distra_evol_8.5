  Ext.onReady(onloadMessageBox);
  var perfil = window.parent.UCID.portal.perfil;
  UCID.portal.cargarEtiquetas('verificarsaldonaturaleza', function() {
      cargarInterfaz();
  });
  function cargarInterfaz() {

      new Ext.KeyMap(Ext.getBody(), [
          {
              key: 'h',
              alt: true,
              fn: function() {
                  help.show('Mostrar ayuda de la funcionalidad', 'confin/CG/AC/verificarsaldonaturaleza');
              }
          }
      ]);

      new Ext.Viewport({id: 'viewport',
          items: [new Ext.Panel({id: 'panel',
                  tbar: [{id: 'menu', minWidth: 38, iconCls: 'mostrar', text: 'Verificar', tooltip: 'Verificar saldos',
                          menu: [{text: 'Cuentas con saldos contrarios a su naturaleza', tooltip: 'Existencia de cuentas con saldos contrarios a su naturaleza', checked: false, group: 'theme', checkHandler: function(CheckItem, checked) {
                                      if(checked)
                                          fCrearGrid(1);
                                  }},
                              {text: 'Saldos contrarios a la naturaleza de los centros de costo en las cuentas asociadas', tooltip: 'Saldos contrarios a la naturaleza de los centros de costo en las cuentas asociadas', checked: false, group: 'theme', checkHandler: function(CheckItem, checked) {
                                      if(checked)
                                          fCrearGrid(2);
                                  }},
                              {text: 'Saldos contrarios a la naturaleza de los elementos del gasto asociados a los centros y cuentas', tooltip: 'Saldos contrarios a la naturaleza de los elementos del gasto asociados a los centros y cuentas', checked: false, group: 'theme', checkHandler: function(CheckItem, checked) {
                                      if(checked)
                                          fCrearGrid(3);
                                  }}
                          ]
                      },
//                      btnImprimir = new Ext.Button({hidden: true, id: 'btnimpr', tooltip: 'Mostrar vista reporte <b>(Alt+R)</b>', iconCls: 'vistareporte', text: 'Vista reporte', handler: function() {fImprimir();}}),
                      '->',
                      btnAyuda = new Ext.Button({
                          id: 'btnAyu',
                          iconCls: 'ayuda',
                          tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
                          text: 'Ayuda',
                          handler: function() {
                              var title = 'Mostrar ayuda de la funcionalidad';
                              var referencia = 'confin/CG/AC/verificarsaldonaturaleza';
                              help.show(title, referencia);
                          }
                      })
                  ]
              })
          ]});
      Ext.MessageBox.hide();
  }
  function onloadMask(message) {
      message ? (lMask = new Ext.LoadMask(Ext.getBody(), {msg: message}), lMask.show())
              : lMask.hide();
  }
  function onloadMessageBox() {
      Ext.MessageBox.show({title: 'Por favor espere...', msg: 'Cargando...', width: 300, progress: true, closable: false
                  //, progressText: 'Inicializando...'
      });
      var f = function(v) {
          return function() {
              var i = v / 11;
              Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
          };
      };
      for(var i = 1; i < 12; i++)
          setTimeout(f(i), i * 500);
  }
  function fCrearGrid(opcion) {
      onloadMask('Cargando...');
//      stGpDatosComprobante = new Ext.data.Store({url: 'obtenerComprobanteSinAsentar', autoLoad: true,
//          listeners: {'load': function(store, records, options)
//              {
//                  if(store.getCount() > 0)
//                  {
//                      cmGpDatos = new Ext.grid.ColumnModel([{width: 30, sortable: true, dataIndex: 'numerocomprobante', align: 'left'}, {id: 'expandir', sortable: true, dataIndex: 'descripcion', align: 'left'}, {width: 20, sortable: true, dataIndex: 'estado', align: 'left'}]);
//                      cmGpDatos.headers = [[{header: 'Comprobantes sin asentar', colspan: 3}], [{align: 'left', sortable: true, header: 'N&uacute;mero'}, {align: 'left', id: 'expandir', sortable: true, header: 'Descripci&oacute;n'}, {align: 'left', sortable: true, header: 'Estado'}]];
//                      fLayoutGrid(stGpDatosComprobante, cmGpDatos);
//                  } else
//                  {
      switch(opcion)
      {
          case 2:
              {
//                                  btnImprimir.show();
                  cmGpDatos = new Ext.grid.ColumnModel([{width: 40, dataIndex: 'codigo', align: 'left'}, {id: 'expandir', dataIndex: 'descripcion', align: 'left'}, {width: 40, dataIndex: 'codigocentro', align: 'left'}, {dataIndex: 'descripcioncentro', align: 'left'}, {width: 40, dataIndex: 'importe', align: 'right'}]);
                  cmGpDatos.headers = [[{header: 'Cuenta', colspan: 2}, {header: 'Centro de Costo', colspan: 3}], [{align: 'left', sortable: true, header: 'C&oacute;digo'}, {align: 'left', id: 'expandir', sortable: true, header: 'Descripci&oacute;n'}, {align: 'left', sortable: true, header: 'C&oacute;digo'}, {align: 'left', sortable: true, header: 'Descripci&oacute;n'}, {align: 'right', sortable: true, header: 'Saldo'}]];
              }
              break;
          case 3:
              {
//                                  btnImprimir.show();
                  cmGpDatos = new Ext.grid.ColumnModel([{width: 40, dataIndex: 'codigo', align: 'left'}, {id: 'expandir', dataIndex: 'descripcion', align: 'left'}, {dataIndex: 'codigocentro', align: 'left'}, {dataIndex: 'descripcioncentro', align: 'left'}, {dataIndex: 'codigoelemento', align: 'left'}, {dataIndex: 'descripcionelemento', align: 'left'}, {width: 40, dataIndex: 'importe', align: 'right'}]);
                  cmGpDatos.headers = [[{header: 'Cuenta', colspan: 2}, {header: 'Centro de Costo', colspan: 2}, {header: 'Elemento del gasto', colspan: 3}], [{align: 'left', sortable: true, header: 'C&oacute;digo'}, {align: 'left', id: 'expandir', sortable: true, header: 'Descripci&oacute;n'}, {align: 'left', sortable: true, header: 'C&oacute;digo'}, {align: 'left', sortable: true, header: 'Descripci&oacute;n'}, {align: 'left', sortable: true, header: 'C&oacute;digo'}, {align: 'left', sortable: true, header: 'Descripci&oacute;n'}, {align: 'right', sortable: true, header: 'Saldo'}]];
              }
              break;
          default:
              {
//                                  btnImprimir.show();
                  cmGpDatos = new Ext.grid.ColumnModel([{width: 40, dataIndex: 'codigo', align: 'left'}, {id: 'expandir', dataIndex: 'descripcion', align: 'left'}, {width: 30, dataIndex: 'naturaleza', align: 'left'}, {width: 30, dataIndex: 'importe', align: 'right'}]);
                  cmGpDatos.headers = [[{header: 'Cuenta', colspan: 4}], [{align: 'left', sortable: true, header: 'C&oacute;digo'}, {align: 'left', id: 'expandir', sortable: true, header: 'Descripci&oacute;n'}, {align: 'left', sortable: true, header: 'Naturaleza'}, {align: 'right', sortable: true, header: 'Saldo'}]];
              }
      }
      stGpDatos = new Ext.data.Store({url: 'obtenerDatos', autoLoad: true, baseParams: {opcion: opcion},
          listeners: {'load': function(store, records, options) {
                  if(store.getCount() > 0)
                      fLayoutGrid(stGpDatos, cmGpDatos);
                  else
                  {
                      onloadMask();
                      if(Ext.getCmp('gpDatos'))
                      {
                          Ext.getCmp('viewport').destroy();
                          cargarInterfaz();
                      }
                      switch(opcion)
                      {
                          case 1:
                              {
                                  mensaje = 'No existen cuentas con saldos contrarios a su naturaleza.';
                              }
                              break;
                          case 2:
                              {
                                  mensaje = 'No existen saldos contrarios a la naturaleza de los centros de costo en las cuentas asociadas.';
                              }
                              break;
                          default:
                              {
                                  mensaje = 'No existen saldos contrarios a la naturaleza de los elementos del gasto asociados a los centros y cuentas.';
                              }
                      }
//                                      btnImprimir.hide();
                      mostrarMensaje(1, mensaje, function() {
                      });

                  }
              }},
          reader: new Ext.data.JsonReader({root: 'root', totalProperty: 'totalProperty'}, [{name: 'codigo'}, {name: 'descripcion'}, {name: 'naturaleza'}, {name: 'codigocentro'}, {name: 'descripcioncentro'}, {name: 'codigoelemento'}, {name: 'descripcionelemento'}, {name: 'importe'}])});
//                  }
//              }
//          },
//          reader: new Ext.data.JsonReader({root: 'root', totalProperty: 'totalProperty'}, [{name: 'numerocomprobante'}, {name: 'descripcion'}, {name: 'estado', mapping: 'NomEstadocomprobante.descripcion'}])});
  }
  function fLayoutGrid(stGpDatos, cmGpDatos) {
      onloadMask();
      if(!Ext.getCmp('gpDatos'))
          Ext.getCmp('panel').add(gpDatos = new Ext.grid.GridPanel({autoExpandColumn: 'expandir', autoScroll: true, viewConfig: {forceFit: true}, renderTo: 'panel', id: 'gpDatos', layout: 'fit', autoHeigth: true, iconCls: 'icon-grid', cm: cmGpDatos, store: stGpDatos, sm: new Ext.grid.RowSelectionModel({singleSelect: false, listeners: {
                      rowselect: function(selectioModel, rowIndex, record) {
                          Ext.getCmp('gpDatos').getView().addRowClass(rowIndex, "negrita");
                      },
                      rowdeselect: function(selectioModel, rowIndex, record) {
                          Ext.getCmp('gpDatos').getView().removeRowClass(rowIndex, "negrita");
                      }
                  }}), plugins: new Ext.ux.plugins.XGrid()/*, bbar:new Ext.PagingToolbar({pageSize: 20, store: stGpDatos, displayInfo: true, displayMsg: 'Datos {0} - {1} of {2}', emptyMsg: 'No existen resultados'})*/}));
      else
          Ext.getCmp('gpDatos').reconfigure(stGpDatos, cmGpDatos);
  }

//  var global_printer = null;  // it has to be on the index page or the generator page  always
//  function printmygridGO(obj) {
//      global_printer.printGrid(obj);
//  }
//  function printmygridGOcustom(obj) {
//      global_printer.printCustom(obj);
//  }
//  var rv, rh, fp_tipopag, datosuser;
//  var fecha = new Date();
//  var dia = fecha.getDate();
//  var mes = fecha.getMonth() + 1;
//  var anno = fecha.getFullYear();
//  var tabla_cabeza, tabla_pie;
//  var datosuser;
//  function contex() {
//      tabla_cabeza = '<table style="font-size:10px; border:1px solid #000" width="90%"  border="0"  cellpadding="0" align="center" cellspacing="0">' +
//              '<tr>' +
//              '<td width="150" rowspan="3" valign="top" style="font-size:10px;"><p><br/>\xa0\xa0</p><br/>\xa0\xa0\xa0\xa0\xa0\xa0 ENTIDAD:</br></br>' + perfil.entidad + '</td>' +
//              '<td width="650" rowspan="3" align="center" style="font-size:10px;"><p>Cuenta con Saldos Contrarios a su Naturaleza</p>' +
//              //'<p>NOMBRE DE LA CUENTA</p>' +
//              //'<p>' + '</p>' +
//              '</td>' +
//              //'<td width="98" height="34"align="left" style="font-size:10px;">No:</td>' +
//              '</tr>' +
//              //'<tr>' +
//              //'<td height="27" align="LEFT" style="font-size:10px;">CODIGO</td>' +
//              //'</tr>' +
//              '<tr>' +
//              '<td height="36" align="LEFT" valign="top" style="font-size:10px;">' + '&nbsp;</td>' +
//              '</tr></table>';
//
//      tabla_pie = '<table style="font-size:10px; border:1px solid #000" width="90%" align="center" cellpadding="0" cellspacing="0" cols="12">' +
//              '<tr>' +
//              '<td colspan="6" width="100%" align="center" valign="top">\xa0\xa0 CERTIFICAMOS QUE LOS  DATOS CONTENIDOS EN ESTE ESTADO SE CORRESPONDEN CON LAS ANOTACIONES CONTABLES</td>' +
//              '</tr>' +
//              '<tr>' +
//              '<td colspan="3" width="75%" valign="top">&nbsp;</td>' +
//              '<td colspan="3" width="25%" align="center">FECHA<br>&nbsp;</td>' +
//              '</tr>' +
//              '<tr>' +
//              '<td width="30%" align="center" valign="top">CONFECCIONADO POR: <br>&nbsp;</td>' +
//              '<td width="30%" align="center" valign="top">JEFE ORGANO ECONOMIA / FINANZAS<br></td>' +
//              '<td width="30%" align="center" valign="top">&nbsp;</td>' +
//              '<td width="3%"  align="right" valign="top">D</td>' +
//              '<td width="3%"  align="right" valign="top">M</td>' +
//              '<td width="3%"  align="right" valign="top">A</td>' +
//              '</tr>' +
//              '<tr>' +
//              '<td width="30%" align="center" valign="top">' + datosuser + '&nbsp;</td>' +
//              '<td width="30%" align="center" valign="top">&nbsp;</td>' +
//              '<td width="30%" align="center" valign="top">&nbsp;</td>' +
//              '<td width="3%"  align="right" valign="top">' + dia + '&nbsp;</td>' +
//              '<td width="3%"  align="right" valign="top">' + mes + '&nbsp;</td>' +
//              '<td width="3%"  align="right" valign="top">' + anno + '&nbsp;</td>' +
//              '</tr>' +
//              '</table>';
//  }
//  var gpDatos;
//  function fImprimir() {
//      Ext.Ajax.request({
//          url: 'datosusuario',
//          //params : {id : window.params.idcmp},
//          callback: function(options, success, response) {
//              var responseData = Ext.decode(response.responseText);
//              datosuser = responseData.user;
//              contex();
//              global_printer = new Ext.grid.XPrinter({
//                  grid: gpDatos, // grid object
//                  pathPrinter: 'printer', // relative to where the Printer folder resides
//                  logoURL: perfil.dirImg + 'cedrux.png', // relative to the html files where it goes the base printing
//                  pdfEnable: true, // enables link PDF printing (only save as)
//                  hasrowAction: false,
//                  localeData: {
//                      Title: 'Reconstruir Saldos',
//                      subTitle: tabla_cabeza,
//                      footerText: tabla_pie,
//                      pageNo: 'P&aacute;gina No.', //page label
//                      printText: 'Imprimir', //print document action label
//                      closeText: 'Cerrar', //close window action label
//                      pdfText: 'PDF'},
//                  useCustom: {// in this case you leave null values as we dont use a custom store and TPL
//                      custom: false,
//                      customStore: null,
//                      columns: [],
//                      alignCols: [],
//                      pageToolbar: null,
//                      useIt: false,
//                      showIt: false,
//                      location: 'bbar'
//                  },
//                  showdate: true, // show print date
//                  showdateFormat: 'd/m/Y', //
//                  showFooter: true, // if the footer is shown on the pinting html
//                  styles: 'default' // wich style youre gonna use
//              });
//              global_printer.prepare(); // prepare the document
//          }
//      });
//  }