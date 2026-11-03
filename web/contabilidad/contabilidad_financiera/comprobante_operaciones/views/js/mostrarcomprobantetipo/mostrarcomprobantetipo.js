  if(window.parent.parent.UCID.portal.perfil)
      var perfil = window.parent.parent.UCID.portal.perfil;
  else
      perfil = {};
  perfil.etiquetas = Object();

  Ext.QuickTips.init();

  var comprobante = window.params.co;
  var opcion = window.params.opcion;
  var motivo = window.params.motivo;
  var lMaskcontabilizando = new Ext.LoadMask(Ext.getBody(), {
      msg: 'Contabilizando ...'
  });
  var lMaskcancelando = new Ext.LoadMask(Ext.getBody(), {
      msg: 'Cancelando ...'
  });
  var lMaskcargando = new Ext.LoadMask(Ext.getBody(), {
      msg: 'Cargando ...'
  });

  cargarInterfaz();

  function cargarMascara(mensaje) {
      mascara = new Ext.LoadMask(Ext.getBody(), {
          msg: mensaje + '...'
      });
      mascara.show();
  }

  function mostrarMensaje(mensaje) {
      Ext.MessageBox.buttonText.ok = "Aceptar";
      Ext.Msg.show
              ({
                  buttons: Ext.Msg.OK,
                  msg: mensaje
              });
  }

// para cuando la fecha viene en otro formato 'Y-m-d'... alejandro 11/08/11
  function formatoFecha(valor) {
      var respuesta = valor;
      fd = new Array();
      fd = valor.split('-');
      if(fd.length > 1) {
          fd.reverse();
          respuesta = fd.join('/');
      }
      return respuesta;
  }

  function cargarInterfaz()
  {
      lMaskcargando.show();

      var tf_descripcion = new Ext.form.TextField({
          id: 'tf_descripcion',
//        disabled:true,
//	disabledClass:'disabled',
          fieldLabel: 'Descripci&oacute;n',
          selectOnFocus: true,
          width: '100%'
      });

      var tfDetalle = new Ext.form.TextField({
          id: 'tfDetalle',
//        disabled:true,
//	disabledClass:'disabled',
          fieldLabel: 'Detalle',
          selectOnFocus: true,
          allowBlank: false,
          maxLength: 100,
          width: 650
      });

      var tf_fecha_emision = new Ext.form.TextField({
          id: 'tf_fecha_emision',
          disabled: true,
          disabledClass: 'disabled',
          hideLabel: true,
          style: 'text-align:right;',
          width: 110
      });

      var lf_total_debe = new Ext.form.Label({
          id: 'tf_total_debe',
          text: ' ',
          style: 'font-weight:bold;',
          width: 98
      });

      var lf_total_haber = new Ext.form.Label({
          id: 'tf_total_haber',
          text: ' ',
          style: 'font-weight:bold;',
          width: 98
      });

      var tf_total_debe = new Ext.form.TextField({
          id: 'tf_total_debe',
          disabled: true,
          disabledClass: 'disabled',
          hideLabel: true,
          style: 'text-align:right;',
          width: 98
      });

      var tf_total_haber = new Ext.form.TextField({
          id: 'tf_total_haber',
          disabled: true,
          disabledClass: 'disabled',
          hideLabel: true,
          style: 'text-align:right;',
          width: 98
      });

      var dffechacontabiliza = new Ext.form.DateField({
          fieldLabel: perfil.etiquetas.fechaaddm,
          allowBlank: false,
          disabledClass: 'disabled-component',
          selectOnFocus: true,
          readOnly: false,
          editable: false,
          name: 'fecha',
          width: 95,
          format: 'd/m/Y',
          disabled: false // CAMBIAR CUANDO SE VAYA A PASAR PARA EL COMPLEJO MILITAR
      });

//    dffechacontabiliza.on('change', function (){
//        comprobante[0].fechaPInicio = dffechacontabiliza.getRawValue();
//    });

      var s_pases = new Ext.data.JsonStore({
          fields: [
              {name: 'idcuenta'},
              {name: 'documento'},
              {name: 'cuenta'},
              {name: 'subcuenta'},
              {name: 'concepto'},
              {name: 'analisis'},
              {name: 'parcial'},
              {name: 'debe'},
              {name: 'haber'}
          ]
      });

      s_pases.on('load', function(t, r, o) {
          w_comprobante.show(Ext.getBody(), function() {
              w_comprobante.on('maximize', function() {
                  w_comprobante.doLayout(true);
                  lMaskcargando.hide();
              })
              this.maximize();
          });

      });


      var sm_pases = new Ext.grid.RowSelectionModel({});

      var cm_pases = new Ext.grid.ColumnModel(
              [{id: 'idcuenta', hidden: true, dataIndex: 'cuenta'},
                  {id: 'documento', header: "No. Documento", align: 'center', width: 85, resizable: true, dataIndex: 'documento'},
                  {id: 'cuenta', header: "Cuenta", width: 50, align: 'center', resizable: true, dataIndex: 'cuenta'},
                  {id: 'subcuenta', header: "Subcuenta", width: 65, align: 'center', resizable: true, dataIndex: 'subcuenta'},
                  {id: 'concepto', header: "Concepto", width: 305, resizable: true, dataIndex: 'concepto'},
                  {id: 'analisis', header: "An&aacute;lisis", width: 130, align: 'right', resizable: true, dataIndex: 'analisis'},
                  {id: 'parcial', header: "Parcial", width: 100, align: 'right', resizable: true, dataIndex: 'parcial'},
                  {id: 'debe', header: "Debe", width: 100, align: 'right', resizable: true, dataIndex: 'debe'},
                  {id: 'haber', header: "Haber", width: 100, align: 'right', resizable: true, dataIndex: 'haber'}
              ]);

      var gp_pases = new Ext.grid.GridPanel({
          autoScroll: true,
          layout: 'fit',
          cm: cm_pases,
          frame: false,
          border: false,
          region: 'center',
          autoExpandColumn: 'concepto',
          sm: sm_pases,
          store: s_pases,
//        tbar: [' ',' ','Detalle',' ',tfDetalle,'->','Fecha de Emisi&oacute;n',' ',' ',' ',' ',dffechacontabiliza],
//        tbar: [' ',' ','Detalle',' ',tfDetalle,'->','Fecha de Emisi&oacute;n',' ',' ',' ',' ',tf_fecha_emision],
          width: '100%'
      });

      var pdesc = new Ext.Panel({
          labelAlign: 'left',
          region: 'north',
          layout: 'form',
          //height : 35,
          autoHeight: true,
          frame: true,
          border: false,
          items: [tf_descripcion],
          bbar: [' ', ' ', 'Detalle', ' ', tfDetalle, '->', 'Fecha de Emisi&oacute;n', ' ', ' ', ' ', ' ', dffechacontabiliza]
                  //        tbar: [' ',' ','Descripci&oacute;n',' ',tf_descripcion]
      });

      var w_comprobante = new Ext.Window({
          id: 'w_comprobante',
          //autoHeight: true,
          width: '100%',
          border: false,
          closable: false,
          constrain: true,
          plain: true,
          closeAction: 'hide',
          layout: 'border',
//        tbar: [' ',' ','Descripci&oacute;n',' ',tf_descripcion],
          items: [pdesc, gp_pases],
          //        items: [pdesc, gp_pases],
          bbar: ['->', 'Suma de Control', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', lf_total_debe,
              new Ext.Toolbar.TextItem("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"),
              new Ext.Toolbar.TextItem("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"),
              lf_total_haber, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//        bbar: ['->','Suma de Control',' ',' ',' ',' ',' ',' ',' ',tf_total_debe,' ',tf_total_haber,' ',' ',' ',' ',' ',' ',' ',' '],
          modal: true,
          buttons: [
              {
                  id: 'b_cerrar',
                  handler: function() {
                      window.parent.Ext.getCmp('idcomprobante').close();
                  },
                  iconCls: 'cancelar',
                  text: 'Cerrar'
              },
              {
                  id: 'b_contabilizar',
                  handler: function() {
                      function funcion(btn) {
                          if(btn == 'ok') {
                              window.parent.descripcion_comprobante = tf_descripcion.getValue().toUpperCase();
                              window.parent.contabilizar = true;
                              window.parent.detalle = tfDetalle.getValue().toUpperCase();
                              window.parent.fecha_comprobante = dffechacontabiliza.getRawValue();
                              window.parent.Ext.getCmp('idcomprobante').close();
                              //Ext.getCmp('b_contabilizar').disable();
                          }

                      }
                      Ext.Msg.show({
                          buttons: Ext.Msg.OKCANCEL,
                          fn: funcion,
                          icon: Ext.MessageBox.QUESTION,
                          msg: 'Esta operaci&oacute;n generar&aacute; asientos contables.' + '<br>' + String.fromCharCode(191) + 'Est&aacute; seguro que desea crear el comprobante con la fecha ' + dffechacontabiliza.getRawValue() + ' ?',
//                    msg:'Esta operaci&oacute;n generar&aacute; asientos contables.' + '<br>' + String.fromCharCode(191) + 'Est&aacute; seguro que desea crear el comprobante con la fecha ' + tf_fecha_emision.getValue() + ' ?',
                          title: 'Confirmar'
                      });
                  },
                  hidden: true,
                  iconCls: 'contabilidad',
                  text: 'Contabilizar'
              },
              {
                  id: 'b_cancelar',
                  handler: function() {
                      function funcion(btn) {
                          if(btn == 'ok') {
                              window.parent.descripcion_comprobante = tf_descripcion.getValue().toUpperCase();
                              window.parent.detalle = tfDetalle.getValue().toUpperCase();
                              window.parent.fecha_comprobante = dffechacontabiliza.getRawValue();
                              window.parent.cancelar = true;
                              window.parent.Ext.getCmp('idcomprobante').close();
                          }

                      }
                      Ext.Msg.show({
                          buttons: Ext.Msg.OKCANCEL,
                          fn: funcion,
                          icon: Ext.MessageBox.QUESTION,
                          msg: 'Esta operaci&oacute;n generar&aacute; asientos contables.' + '<br>' + String.fromCharCode(191) + 'Est&aacute; seguro que desea crear el comprobante con la fecha ' + dffechacontabiliza.getRawValue() + ' ?',
//                    msg:'Esta operaci&oacute;n generar&aacute; asientos contables.' + String.fromCharCode(191) + 'Est&aacute; seguro que desea crear el comprobante con la fecha ' + tf_fecha_emision.getValue() + ' ?',
//                    msg:'Esta operaci&oacute;n generar&aacute; asientos contables.' + String.fromCharCode(191) + 'Est&aacute; seguro que desea continuar?',
                          title: 'Confirmar'
                      });
                  },
                  hidden: true,
                  icon: perfil.dirImg + 'contabilidad.png',
                  iconCls: 'btn',
                  text: 'Cancelar'
              }
          ]
      });

      Ext.Ajax.request({
          url: 'obtenerDatos',
          method: 'POST',
          params: {
              datos: Ext.encode(comprobante),
              opcion: opcion
          },
          callback: function(options, success, response)
          {
              responseData = Ext.decode(response.responseText);
              s_pases.loadData(responseData.datos);
              //la descripcion varia segun la operacion que se realiza... alejandro 17/08/11
              var arrayDocumentos = new Array();

              function textInArray(list, text) {
                  for(var i = 0; i < list.length; i ++)
                      if(list[i] == text)
                          return true;
                  return false;
              }

              var descripcion = ((opcion == 0) ? 'Contabilizando ' : 'Cancelando ') + comprobante[0].denominacion
              descripcion += (comprobante.length == 1) ? ' ' : 's ';

              var listDetalles = new Array();

              for(i = 0; i < comprobante.length; i++) {
                  if(!textInArray(arrayDocumentos, comprobante[i].numero)) {
                      arrayDocumentos.push(comprobante[i].numero);
                      descripcion += (i == 0) ? comprobante[i].numero : ', ' + comprobante[i].numero;
                      if(opcion == 0) {
                          if(!textInArray(listDetalles, comprobante[i].descripcion))
                              listDetalles.push(comprobante[i].descripcion);
                      }
                  }
              }

              if(opcion == 1) {
                  descripcion += ' por ' + motivo.toLowerCase();
                  Ext.getCmp('b_cancelar').show();
              }
              else
                  Ext.getCmp('b_contabilizar').show();

              tf_descripcion.setValue(descripcion);
              tfDetalle.setValue((opcion == 1) ? motivo : listDetalles.join(", "));

//            tf_fecha_emision.setValue(formatoFecha(comprobante[0].fecha.substring(0,10)));
              dffechacontabiliza.setValue(comprobante[0].fecha);
              dffechacontabiliza.setMinValue(comprobante[0].fechaPInicio);

              lf_total_debe.setText(responseData.debeTotal);
              lf_total_haber.setText(responseData.haberTotal);
//            tf_total_debe.setValue(responseData.debeTotal);
//            tf_total_haber.setValue(responseData.haberTotal);
              //Ext.getCmp('b_contabilizar').enable();
          }
      });
  }



