
  Ext.namespace('Ext.Confin.Configuracion');
  Ext.Confin.Configuracion.EditorFormula = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      etiquetas: new Object(),
      regexOperadores: /\+|\-|\*|\/|\=|\>|\</,
      arrayConcat: new Array(),
      arrayTipos: new Array(),
      arrayStr: new Array(),
      arrayID: new Array(),
      flagIgualdad: false,
      formulaStr: '',
      formulaID: '',
      contador: 0,
      posActualInicial: undefined,
      posActualFinal: undefined,
      constructor: function(arbolTipoConcepto, arbolConceptosFormulas) {
          var Browser = {
              IE: !!(window.attachEvent && !window.opera),
              Opera: !!window.opera,
              WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
              Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
              MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
          };
          Ext.QuickTips.init();
          Ext.Ajax.timeout = 6000000;
          scopeEditorFormula = this;
          Ext.Ajax.request({
              method: "POST",
              url: "/contabilidad/contabilidad_financiera/reportes/index.php/editorformulas/cargaretiquetas",
              params: {
                  vista: 'editorformulas'
              },
              callback: function(options, success, response) {
                  scopeEditorFormula.etiquetas = Ext.decode(response.responseText);
                  scopeEditorFormula.onloadMessageBox(scopeEditorFormula.etiquetas.lbEsperando, scopeEditorFormula.etiquetas.lbCargando);
                  scopeEditorFormula.asociarFormula(arbolTipoConcepto, arbolConceptosFormulas);
              }
          });
      },
      onloadMessageBox: function(agTtl, agMsg) {
          Ext.MessageBox.show({
              title: agTtl || scopeEditorFormula.etiquetas.lbEsperando,
              msg: agMsg || scopeEditorFormula.etiquetas.lbCargando,
              width: 300,
              progress: true,
              closable: false
          });
          var f = function(v) {
              return function() {
                  var i = v / 11;
                  Ext.MessageBox.updateProgress(i);
              };
          };
          for(var i = 1; i < 12; i++) {
              setTimeout(f(i), i * 500);
          }
      },
      asociarFormula: function(arbolTipoConcepto, arbolConceptosFormulas) {
          scopeEditorFormula.btnAdiccion = new Ext.Button({
              id: 'btnAdiccion',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/sumar.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtAdiccion,
              handler: function() {
                  scopeEditorFormula.Adiccion();
              }
          });
          scopeEditorFormula.btnSustraccion = new Ext.Button({
              id: 'btnSustraccion',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/restar.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtSustraccion,
              handler: function() {
                  scopeEditorFormula.Sustraccion();
              }
          });
          scopeEditorFormula.btnDivision = new Ext.Button({
              id: 'btnDivision',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/dividir.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtDivision,
              handler: function() {
                  scopeEditorFormula.Division();
              }
          });
          scopeEditorFormula.btnPor = new Ext.Button({
              id: 'btnPor',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/multiplicar.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtMultiplicacion,
              handler: function() {
                  scopeEditorFormula.Multiplicacion();
              }
          });
          scopeEditorFormula.btnPer = new Ext.Button({
              id: 'btnPer',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/porciento.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtPorCiento,
              handler: function() {
                  scopeEditorFormula.PorCiento();
              }
          });
          scopeEditorFormula.btnPot = new Ext.Button({
              id: 'btnPot',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/exponente.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtPorCiento,
              handler: function() {
                  scopeEditorFormula.Potencia();
              }
          });
          scopeEditorFormula.btnPar1 = new Ext.Button({
              id: 'btnPar1',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/parentesisA.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtParentesisA,
              handler: function() {
                  scopeEditorFormula.AbrirParentesis();
              }
          });
          scopeEditorFormula.btnPar2 = new Ext.Button({
              id: 'btnPar2',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/parentesisC.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtParentesisC,
              handler: function() {
                  scopeEditorFormula.CerrarParentesis();
              }
          });
          scopeEditorFormula.btncorA = new Ext.Button({
              id: 'btncor1',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/corcheteA.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtColcheteA,
              handler: function() {
                  scopeEditorFormula.AbrirColchete();
              }
          });
          scopeEditorFormula.btncorC = new Ext.Button({
              id: 'btncor2',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/corcheteC.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtColcheteC,
              handler: function() {
                  scopeEditorFormula.CerrarColchete();
              }
          });
          scopeEditorFormula.btnIgual = new Ext.Button({
              id: 'btnIgual',
              minWidth: 65,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/igual.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtIgualdad,
              handler: function() {
                  scopeEditorFormula.Igualdad();
              }
          });
          scopeEditorFormula.btnMayor = new Ext.Button({
              id: 'btnMayor',
              tooltip: scopeEditorFormula.etiquetas.lbTtMayor,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/mayor.png',
              minWidth: 30,
              handler: function() {
                  scopeEditorFormula.Mayor();
              }
          });
          scopeEditorFormula.btnMenor = new Ext.Button({
              id: 'btnMenor',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/menor.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtMenor,
              handler: function() {
                  scopeEditorFormula.Menor();
              }
          });
          scopeEditorFormula.btnNumeroCero = new Ext.Button({
              id: 'btnNumeroCero',
              tooltip: scopeEditorFormula.etiquetas.lbCero,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/cero.png',
              minWidth: 65,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "0");
              }
          });
          scopeEditorFormula.btnNumeroUno = new Ext.Button({
              id: 'btnNumeroUno',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/uno.png',
              tooltip: scopeEditorFormula.etiquetas.lbUno,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "1");
              }
          });
          scopeEditorFormula.btnNumeroDos = new Ext.Button({
              id: 'btnNumeroDos',
              tooltip: scopeEditorFormula.etiquetas.lbDos,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/dos.png',
              minWidth: 30,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "2");
              }
          });
          scopeEditorFormula.btnNumeroTres = new Ext.Button({
              id: 'btnNumeroTres',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/tres.png',
              tooltip: scopeEditorFormula.etiquetas.lbTres,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "3");
              }
          });
          scopeEditorFormula.btnNumeroCuatro = new Ext.Button({
              id: 'btnNumeroCuatro',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/cuatro.png',
              tooltip: scopeEditorFormula.etiquetas.lbCuatro,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "4");
              }
          });
          scopeEditorFormula.btnNumeroCinco = new Ext.Button({
              id: 'btnNumeroCinco',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/cinco.png',
              tooltip: scopeEditorFormula.etiquetas.lbCinco,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "5");
              }
          });
          scopeEditorFormula.btnNumeroSeis = new Ext.Button({
              id: 'btnNumeroSeis',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/seis.png',
              tooltip: scopeEditorFormula.etiquetas.lbSeis,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "6");
              }
          });
          scopeEditorFormula.btnNumeroSiete = new Ext.Button({
              id: 'btnNumeroSiete',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/siete.png',
              tooltip: scopeEditorFormula.etiquetas.lbSiete,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "7");
              }
          });
          scopeEditorFormula.btnNumeroOcho = new Ext.Button({
              id: 'btnNumeroOcho',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/ocho.png',
              tooltip: scopeEditorFormula.etiquetas.lbOcho,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "8");
              }
          });
          scopeEditorFormula.btnNumeroNueve = new Ext.Button({
              id: 'btnNumeroNueve',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/nueve.png',
              tooltip: scopeEditorFormula.etiquetas.lbNueve,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, "9");
              }
          });
          scopeEditorFormula.btnPtoFlotante = new Ext.Button({
              id: 'btnPtoFlotante',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/ptoflotante.png',
              tooltip: scopeEditorFormula.etiquetas.lbPtoFlotante,
              handler: function() {
                  scopeEditorFormula.EscribirNumero(undefined, ".");
              }
          });
          scopeEditorFormula.btnBorrar = new Ext.Button({
              id: 'btnBorrar',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/deshacer.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtDeshacer,
              handler: function() {
                  scopeEditorFormula.BorrarUltimo();
              }
          });
          scopeEditorFormula.btnSuprimir = new Ext.Button({
              id: 'btnSuprimir',
              minWidth: 30,
              iconCls: 'btn',
              icon: '/contabilidad/comun/images/limpiar.png',
              tooltip: scopeEditorFormula.etiquetas.lbTtSuprimir,
              handler: function() {
                  scopeEditorFormula.BorrarTodo();
              }
          });
          scopeEditorFormula.btnCancelarFormula = new Ext.Button({
              id: 'btnCancelarFormula',
              iconCls: 'cancelar',
              text: scopeEditorFormula.etiquetas.lbBtnCancelar,
              tooltip: scopeEditorFormula.etiquetas.lbTtCancelarFormula,
              handler: function() {
                  scopeEditorFormula.winFormCont.destroy();
                  scopeEditorFormula.BorrarTodo();
                  Ext.QuickTips.getQuickTip().unregister('input');
                  scopeConceptoContable.kmTeclasCalientes.enable();
              }
          });
          scopeEditorFormula.btnAceptarFormula = new Ext.Button({
              id: 'btnAceptarFormula',
              iconCls: 'aceptar',
              text: scopeEditorFormula.etiquetas.lbBtnAceptar,
              tooltip: scopeEditorFormula.etiquetas.lbTtAceptarFormula,
              handler: function() {
                  $tipoconceptofin = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().attributes['idtipoconceptofin'];
                  scopeEditorFormula.flagIgualdad = (Ext.getCmp('input').getValue().toString().match(/\=/) != null) ? true : false;
                  if(Ext.getCmp('input').isValid() && !scopeEditorFormula.flagIgualdad && $tipoconceptofin === '3') {
                      mostrarMensaje(1, scopeEditorFormula.etiquetas.lbInfoIgualdad);
                      return;
                  }
                  (scopeConceptoContable.nodoSeleccionado.attributes.configurado == false) ? scopeEditorFormula.AdicionarFormula() : scopeEditorFormula.ModificarFormula();
                  if(scopeConceptoContable.nodoSeleccionado.attributes.configurado == true && Ext.getCmp('input').getValue() == "" && !Ext.getCmp('input').isValid())
                      scopeEditorFormula.EliminarFormula();
              }
          });
          scopeEditorFormula.tfDenominacion = new Ext.form.TextField({
              fieldLabel: scopeEditorFormula.etiquetas.lbDenominacion,
              id: 'tfDenominacion',
              name: 'denominacion',
              anchor: '98%',
              readOnly: true
          });
          scopeEditorFormula.taFormula = new Ext.form.TextArea({
              id: 'input',
              fieldLabel: scopeEditorFormula.etiquetas.lbBtnFormula,
              maskRe: /^([[+-]?\d+([,.]\d+)??\/\s \(\)\[\]^%*-><.,=|\s]+ ?[a-zA-Z\s]*)+$/,
              blankText: scopeEditorFormula.etiquetas.lbCampoObligatorio,
              allowBlank: false,
              anchor: '99%',
              height: 60,
              grow: true,
              enableKeyEvents: true,
              validateOnBlur: true,
              selectOnFocus: false,
              validator: function() {
                  if(this.getValue().length > 0) {
                      if(parserGram.stack_Errors.length == 0 && scopeEditorFormula.ComprobarParseo()) {
                          Ext.getCmp('input').clearInvalid();
                          Ext.QuickTips.getQuickTip().unregister('input');
                          return true;
                      } else {
                          valid = parserGram.stack_Errors.pop();
                          Ext.getCmp('input').markInvalid(valid.message);
                          return valid.message;
                      }
                  } else {
                      Ext.getCmp('input').markInvalid(scopeEditorFormula.etiquetas.lbCampoObligatorio);
                      return scopeEditorFormula.etiquetas.lbCampoObligatorio;
                  }
              },
              listeners: {
                  keypress: function(t, e) {
                      var v = t.getValue(),
                              wc = 0, cc = v.length ? v.length : 0;
                      if(cc > 0) {
                          wc = v.match(/\n/g);
                          wc = wc ? wc.length : 0;
                      }
                      Ext.fly(scopeEditorFormula.charCount.getEl()).update(scopeEditorFormula.etiquetas.lbColumna + '<b>' + cc + '</b>');
                      var tecla = e.getKey();
                      scopeEditorFormula.GetSelectedText();
                      switch(tecla) {
                          case 32:
                              var antes = Ext.getCmp('input').getValue().substr(0, scopeEditorFormula.posActualFinal);
                              var despues = Ext.getCmp('input').getValue().substr(scopeEditorFormula.posActualFinal, Ext.getCmp('input').getValue().length);
                              Ext.getCmp('input').setValue(antes + ' ' + despues);
                              break;
                          case 37:
                              scopeEditorFormula.PorCiento();
                              break;
                          case 40:
                              scopeEditorFormula.AbrirParentesis();
                              break;
                          case 41:
                              scopeEditorFormula.CerrarParentesis();
                              break;
                          case 42:
                              scopeEditorFormula.Multiplicacion();
                              break;
                          case 43:
                              scopeEditorFormula.Adiccion();
                              break;
                          case 44:
                              scopeEditorFormula.EscribirNumero(undefined, ",");
                              break;
                          case 45:
                              scopeEditorFormula.Sustraccion();
                              break;
                          case 46:
                              scopeEditorFormula.BorrarTodo();
                              break;
                          case 47:
                              scopeEditorFormula.Division();
                              break;
                          case 48:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 49:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 50:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 51:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 52:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 53:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 54:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 55:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 56:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 57:
                              scopeEditorFormula.EscribirNumero(tecla);
                              break;
                          case 60:
                              scopeEditorFormula.Menor();
                              break;
                          case 61:
                              scopeEditorFormula.Igualdad();
                              break;
                          case 62:
                              scopeEditorFormula.Mayor();
                              break;
                          case 91:
                              scopeEditorFormula.AbrirColchete();
                              break;
                          case 93:
                              scopeEditorFormula.CerrarColchete();
                              break;
                          case 94:
                              scopeEditorFormula.Potencia();
                              break;
                          default:
                              e.stopEvent();
                      }
                      scopeEditorFormula.ComprobarParseo();
                  },
                  focus: function(t) {
                      scopeEditorFormula.GetSelectedText();
                      var p = document.getElementById('input');
                      p.onclick = scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                      p.ondblclick = scopeEditorFormula.GetSelectedTextToCursorPosition;
                      p.onmouseup = scopeEditorFormula.GetSelectedTextToCursorPosition;
                  }
              }
          });
          scopeEditorFormula.charCount = new Ext.form.Label({
              id: 'idcharCount',
              text: scopeEditorFormula.etiquetas.lbColumnaInicial,
              style: 'margin:0 0 0 20'
          });
          scopeEditorFormula.pnlOperadores = new Ext.Panel({
              id: 'idOperadores',
              title: scopeEditorFormula.etiquetas.lbOperadores,
              width: 160,
              frame: true,
              items: [{
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroSiete
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroOcho
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroNueve
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnDivision
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroCuatro
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroCinco
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroSeis
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnPor
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroUno
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroDos
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroTres
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnSustraccion
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnNumeroCero
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnPtoFlotante
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnIgual
                          }, {
                              style: 'margin:5 0 0 0',
                              layout: 'form',
                              items: scopeEditorFormula.btnAdiccion
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnIgual
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnPer
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnPot
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnBorrar
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnPar1
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btncorA
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnMenor
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 5 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnSuprimir
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnPar2
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btncorC
                          }, {
                              style: 'margin:5 0 0 5',
                              layout: 'form',
                              items: scopeEditorFormula.btnMayor
                          }]
                  }, {
                      layout: 'column',
                      items: [{
                              style: 'margin:5 0 5 30',
                              layout: 'form',
                              items: scopeEditorFormula.charCount
                          }]
                  }
              ]
          });
          scopeEditorFormula.fpFormula = new Ext.FormPanel({
              id: 'fpFormula',
              frame: true,
              layout: 'border',
              items: [{
                      region: 'center',
                      layout: 'fit',
                      anchor: '100%',
                      items: [{
                              style: 'margin: 2 0 0 15',
                              layout: 'form',
                              labelAlign: 'top',
                              items: [{
                                      layout: 'form',
                                      style: 'margin: 3 0 0 0',
                                      items: scopeEditorFormula.tfDenominacion
                                  }, {
                                      layout: 'column',
                                      items: [{
                                              columnWidth: .40, //43
                                              style: 'margin: 3 0 0 0',
                                              items: arbolTipoConcepto
                                          }, {
                                              columnWidth: .40, //42
                                              style: 'margin: 3 5 0 5',
                                              height: 450,
                                              items: arbolConceptosFormulas//trpConceptosFormulas
                                          }, {
                                              columnWidth: .16,
                                              style: 'margin: 3 0 0 5',
                                              items: scopeEditorFormula.pnlOperadores
                                          }]
                                  }],
                              listeners: {
                                  resize: function() {
                                      arbolTipoConcepto.setHeight(this.getSize().height - 60);
                                      arbolConceptosFormulas.setHeight(this.getSize().height - 60);
                                      this.doLayout();
                                  }
                              }
                          }]
                  }, {
                      labelAlign: 'top',
                      region: 'south',
                      items: [{
                              style: 'margin: 3 0 10 15',
                              layout: 'form',
                              items: [scopeEditorFormula.taFormula]
                          }]
                  }]
          });
          scopeEditorFormula.winFormCont = new Ext.Window({
              id: 'winFormCont',
              layout: 'fit',
              constrain: true,
              defaultButton: 0,
              onEsc: Ext.emptyFn,
              title: scopeEditorFormula.etiquetas.lbTtAdicionarFormula,
              buttons: [scopeEditorFormula.btnCancelarFormula, scopeEditorFormula.btnAceptarFormula],
              listeners: {
                  'destroy': function() {
                      scopeConceptoContable.kmTeclasCalientes.enable();
                  },
                  'close': function() {
                      scopeConceptoContable.kmTeclasCalientes.enable();
                  },
                  'hide': function() {
                      scopeConceptoContable.kmTeclasCalientes.enable();
                  }
              }
          });
          scopeEditorFormula.winFormCont.add(scopeEditorFormula.fpFormula);
          if(scopeConceptoContable.nodoSeleccionado != undefined) {
              if(!scopeFormulas.busyRequest && !scopeGruposCtas.busyRequest) {
                  Ext.MessageBox.hide();
              }
              scopeEditorFormula.winFormCont.show('', function() {
                  Ext.getCmp('tfDenominacion').setRawValue(scopeConceptoContable.nodoSeleccionado.attributes.text);
                  if(scopeConceptoContable.nodoSeleccionado.attributes.configurado == true) {
                      Ext.getCmp('input').focus(true);
                      scopeEditorFormula.winFormCont.setTitle(scopeEditorFormula.etiquetas.lbTtModificarFormula);
                      Ext.getCmp('input').setRawValue(scopeConceptoContable.nodoSeleccionado.attributes.formulam);
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.formulaID = scopeConceptoContable.nodoSeleccionado.attributes.formula;
                      scopeEditorFormula.formulaStr = scopeConceptoContable.nodoSeleccionado.attributes.formulad;
                      scopeEditorFormula.arrayConcat = scopeConceptoContable.nodoSeleccionado.attributes.formulac.toString().split(",");
                      scopeEditorFormula.arrayID = scopeConceptoContable.nodoSeleccionado.attributes.formula.toString().split(" ");
                      scopeEditorFormula.arrayStr = scopeConceptoContable.nodoSeleccionado.attributes.formulad.toString().split(scopeEditorFormula.regexOperadores);
                      if(typeof scopeConceptoContable.nodoSeleccionado.attributes.arryformula == 'object'){
                          var temp = new Array(),
                              temp1 = scopeConceptoContable.nodoSeleccionado.attributes.arryformula;
                          scopeEditorFormula.arrayTipos = new Array();
                          //Se guarda enel arreglo arrayTipos en el mismo roden en que
                          //se guardo en el arrayID que es el orden original de la formula
                          for (k in scopeEditorFormula.arrayID) {
                              for (j in temp1) {
                                  if (temp1[j]['valor'] == scopeEditorFormula.arrayID[k]) {
                                      scopeEditorFormula.arrayTipos.push(temp1[j]);
                                      break;
                                  }
                              }
                          }
                      }
                      NuevaformulaStr = scopeEditorFormula.formulaStr.toString().split(" ");
                      strArrayForm = new Array();
                      for(i = 0; i < NuevaformulaStr.length; i++) {
                          if(strArrayForm.length > 0 && strArrayForm[strArrayForm.length - 1].toString().match(scopeEditorFormula.regexOperadores) == null && (NuevaformulaStr[i].toString().match(scopeEditorFormula.regexOperadores) == null)) {
                              var vOut = strArrayForm.pop();
                              strArrayForm.push(vOut + " " + NuevaformulaStr[i].toString());
                          } else {
                              strArrayForm.push(NuevaformulaStr[i]);
                          }
                      }
                      scopeEditorFormula.formulaStr = strArrayForm.join(" ");
                  } else {
                      if(Ext.getCmp('input').getValue().length == 0) {
                          Ext.getCmp('input').markInvalid(scopeEditorFormula.etiquetas.lbCampoObligatorio);
                      }
                      Ext.getCmp('input').focus(false);
                      scopeEditorFormula.BorrarTodo();
                      scopeEditorFormula.winFormCont.setTitle(scopeEditorFormula.etiquetas.lbTtAdicionarFormula);
                  }
                  scopeEditorFormula.winFormCont.maximize();
                  scopeEditorFormula.winFormCont.doLayout();
                  //            lMask.hide();
              });
          } else {
              mostrarMensaje(1, scopeEditorFormula.etiquetas.lbSelConceptoOperaciones);
          }
          scopeEditorFormula.formPanelDropTarget = new Ext.dd.DropTarget(scopeEditorFormula.taFormula.getEl().dom, {
              ddGroup: 'treeDDGroup',
              notifyDrop: function(ddSource, e, data) {
                  var flagDrop = false;
                  var selectedTreeNode = ddSource.dragData.node; //data.node;
                  var pp = document.getElementById('input');
                  pp.onmouseup = function(e) {
                      if(selectedTreeNode.attributes.type == undefined) {
                          newValue = {
                              "idtipoconcepto": "4",
                              "idtipo": selectedTreeNode.attributes.DatConceptocontableestructura[0].NomFormula.idformula,
                              "valor": selectedTreeNode.attributes.DatConceptocontableestructura[0].NomFormula.idformula,
                              "descripcion": selectedTreeNode.attributes.descripcion,
                              "concat": selectedTreeNode.attributes.codigo
                          };
                      } else {
                          if(selectedTreeNode.attributes.type == 1) {//grupo
                              newValue = {
                                  "idtipoconcepto": selectedTreeNode.attributes.type,
                                  "idtipo": selectedTreeNode.attributes.idgrupo,
                                  "valor": selectedTreeNode.attributes.id,
                                  "descripcion": selectedTreeNode.attributes.descripcion,
                                  "concat": selectedTreeNode.attributes.concat
                              };
                          } else if(selectedTreeNode.attributes.type == 2) {//contenido
                              newValue = {
                                  "idtipoconcepto": selectedTreeNode.attributes.type,
                                  "idtipo": selectedTreeNode.attributes.idcontenidoe,
                                  "valor": selectedTreeNode.attributes.id,
                                  "descripcion": selectedTreeNode.attributes.descripcion,
                                  "concat": "[" + selectedTreeNode.attributes.concat + "]"
                              };
                          } else if(selectedTreeNode.attributes.type == 3) {//cuenta
                              newValue = {
                                  "idtipoconcepto": selectedTreeNode.attributes.type,
                                  "idtipo": selectedTreeNode.attributes.id,
                                  "valor": selectedTreeNode.attributes.id,
                                  "descripcion": selectedTreeNode.attributes.descripcion,
                                  "concat": selectedTreeNode.attributes.concat
                              };
                          }
                      }
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.InsertarValorCualquierPosicion(newValue, scopeEditorFormula.posActualFinal);
                      Ext.fly(scopeEditorFormula.charCount.getEl()).update(scopeEditorFormula.etiquetas.lbColumna + '<b>' + scopeEditorFormula.posActualFinal + '</b>');
                      flagDrop = true;
                  };
                  return flagDrop;
              }
          });
          arbolConceptosFormulas.addListener({
              dblclick: function(nodo, e) {
                  nodoSelAsociado = nodo;
                  if(nodo.id == 0) {
                      e.stopEvent();
                  } else {
                      scopeEditorFormula.GetSelectedText();
                      if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal && scopeEditorFormula.posActualFinal != 0) {
                          newValue = {
                              "idtipoconcepto": "4",
                              "idtipo": nodo.attributes.idformula,
                              "valor": nodo.attributes.idformula,
                              "descripcion": nodo.attributes.descripcion,
                              "concat": nodo.attributes.codigo
                          };
                          scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
                      } else {
                          //si esta vacio el campo formula agrego caracter sin espacio
                          if(Ext.getCmp('input').getValue().length == 0 && scopeEditorFormula.posActualFinal == 0) {
                              Ext.getCmp('input').setValue(nodo.attributes.codigo);
                              scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + nodo.attributes.idformula;
                              scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + nodo.attributes.descripcion;
                              scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                          } else {
                              var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                              //si lo que esta alante es caracter, '(', o signo se adiciona la cuenta con espacio
                              if(scopeEditorFormula.isOperador(caracter) || caracter == '(' || caracter == '[' || (caracter == '<' || caracter == '>' || caracter == '=')) {
                                  Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ' + nodo.attributes.codigo);
                                  scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + nodo.attributes.idformula;
                                  scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + nodo.attributes.descripcion;
                                  scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                              }
                          }
                          //Se adiciona el nodo como formula
                          scopeEditorFormula.arrayTipos.push({
                              "idtipoconcepto": "4",
                              "idtipo": nodo.attributes.idformula,
                              "valor": nodo.attributes.idformula,
                              "descripcion": nodo.attributes.descripcion,
                              "concat": nodo.attributes.codigo
                          });
                          scopeEditorFormula.arrayConcat.push(nodo.attributes.codigo);
                      }
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                  }
                  Ext.getCmp('input').focus(true);
                  scopeEditorFormula.GetSelectedTextToEnd(Ext.getCmp('input').getValue().length);
                  scopeEditorFormula.ComprobarParseo();
              },
              beforenodedrop: function(e) {
                  return false;
              }
          });
          arbolTipoConcepto.addListener({
              dblclick: function(nodo, e) {
                  if(nodo.id == 0) {
                      e.stopEvent();
                  } else {
                      scopeEditorFormula.GetSelectedText();
                      if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal && scopeEditorFormula.posActualFinal != 0) {
                          if(nodo.attributes.type == 1) {//grupo
                              newValue = {
                                  "idtipoconcepto": "1",
                                  "idtipo": nodo.attributes.idgrupo,
                                  "valor": nodo.attributes.id,
                                  "descripcion": nodo.attributes.descripcion,
                                  "concat": nodo.attributes.concat
                              };
                          } else if(nodo.attributes.type == 2) {//contenido
                              newValue = {
                                  "idtipoconcepto": "2",
                                  "idtipo": nodo.attributes.idcontenidoe,
                                  "valor": nodo.attributes.id,
                                  "descripcion": nodo.attributes.descripcion,
                                  "concat": "[" + nodo.attributes.concat + "]"
                              };
                          } else if(nodo.attributes.type == 3) {//cuenta
                              newValue = {
                                  "idtipoconcepto": "3",
                                  "idtipo": nodo.attributes.id,
                                  "valor": nodo.attributes.id,
                                  "descripcion": nodo.attributes.descripcion,
                                  "concat": nodo.attributes.concat
                              };
                          }
                          scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
                      } else {
                          //si esta vacio el campo formula agrego caracter sin espacio
                          if(Ext.getCmp('input').getValue().length == 0 && scopeEditorFormula.posActualFinal == 0) {
                              if(nodo.attributes.type == 1) {//grupo
                                  Ext.getCmp('input').setValue(nodo.attributes.concat);
                                  scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + nodo.attributes.idgrupo;
                                  scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + nodo.attributes.descripcion;
                              } else if(nodo.attributes.type == 2) {//contenido
                                  Ext.getCmp('input').setValue('[' + nodo.attributes.concat + ']');
                                  scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + nodo.attributes.idcontenidoe;
                                  scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + nodo.attributes.descripcion;
                              } else if(nodo.attributes.type == 3) {//cuenta
                                  Ext.getCmp('input').setValue(nodo.attributes.concat);
                                  scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + nodo.attributes.id;
                                  scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + nodo.attributes.descripcion;
                              }
                              scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                          } else {
                              var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                              //si lo que esta alante es caracter, '(', o signo se adiciona la cuenta con espacio
                              if(scopeEditorFormula.isOperador(caracter) || caracter == '(' || caracter == '[' || (caracter == '<' || caracter == '>' || caracter == '=')) {
                                  if(nodo.attributes.type == 1) {//grupo
                                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ' + nodo.attributes.concat);
                                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + nodo.attributes.idgrupo;
                                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + nodo.attributes.descripcion;
                                  } else if(nodo.attributes.type == 2) {//contenido
                                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' [' + nodo.attributes.concat + ']');
                                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + nodo.attributes.idcontenidoe;
                                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + nodo.attributes.descripcion;
                                  } else if(nodo.attributes.type == 3) {//cuenta
                                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ' + nodo.attributes.concat);
                                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + nodo.attributes.id;
                                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + nodo.attributes.descripcion;
                                  } else if(nodo.attributes.type == 4) {//formula
                                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ' + nodo.attributes.formula);
                                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + nodo.attributes.idformula;
                                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + nodo.attributes.descripcion;
                                  } else if(nodo.attributes.type == 5) {//operador
                                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ' + nodo.attributes.operador);
                                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + nodo.attributes.idoperador;
                                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + nodo.attributes.descripcion;
                                  }
                                  scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                              }
                          }
                          if(nodo.attributes.type == 1) {//grupo
                              scopeEditorFormula.arrayTipos.push({
                                  "idtipoconcepto": "1",
                                  "idtipo": nodo.attributes.idgrupo,
                                  "valor": nodo.attributes.id,
                                  "descripcion": nodo.attributes.descripcion,
                                  "concat": nodo.attributes.concat
                              });
                              scopeEditorFormula.arrayConcat.push(nodo.attributes.concat);
                          } else if(nodo.attributes.type == 2) {//contenido
                              scopeEditorFormula.arrayTipos.push({
                                  "idtipoconcepto": "2",
                                  "idtipo": nodo.attributes.idcontenidoe,
                                  "valor": nodo.attributes.id,
                                  "descripcion": nodo.attributes.descripcion,
                                  "concat": "[" + nodo.attributes.concat + "]"
                              });
                              scopeEditorFormula.arrayConcat.push(nodo.attributes.concat);
                          } else if(nodo.attributes.type == 3) {//cuenta
                              scopeEditorFormula.arrayTipos.push({
                                  "idtipoconcepto": "3",
                                  "idtipo": nodo.attributes.id,
                                  "valor": nodo.attributes.id,
                                  "descripcion": nodo.attributes.descripcion,
                                  "concat": nodo.attributes.concat
                              });
                              scopeEditorFormula.arrayConcat.push(nodo.attributes.concat);
                          }
                      }
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                  }
                  Ext.getCmp('input').focus(true);
                  scopeEditorFormula.GetSelectedTextToEnd(Ext.getCmp('input').getValue().length);
                  scopeEditorFormula.ComprobarParseo();
              },
              beforenodedrop: function(e) {
                  return false;
              }
          });
      },
      GetSelectedText: function() {
          var selText = "";
          if(window.getSelection) {                                                  // all browsers, except IE before version 9
              if(document.activeElement && (document.activeElement.tagName.toLowerCase() == "textarea" || document.activeElement.tagName.toLowerCase() == "input")) {
                  var text = document.activeElement.value;
                  selText = text.substring(document.activeElement.selectionStart, document.activeElement.selectionEnd);
                  scopeEditorFormula.posActualInicial = document.activeElement.selectionStart;
                  scopeEditorFormula.posActualFinal = document.activeElement.selectionEnd;
              } else {
                  var selRange = window.getSelection();
                  selText = selRange.toString();
              }
          } else {
              if(document.selection.createRange) {                                   // Internet Explorer
                  var range = document.selection.createRange();
                  selText = range.text;
              }
          }
          if(selText !== "") {
          }
      },
      GetSelectedTextToEnd: function(pos) {
          if(typeof document.selection != 'undefined' && document.selection) {         // Internet Explorer
              var tex = document.activeElement.value;
              document.activeElement.value = '';
              document.activeElement.focus();
              var str = document.selection.createRange();
              document.activeElement.value = tex;
              str.move("character", pos);
              str.moveEnd("character", 0);
              str.select();
              document.activeElement.focus();
          }
          else if(typeof document.activeElement.selectionStart != 'undefined') {       // all browsers, except IE before version 9
              document.activeElement.setSelectionRange(pos, pos);
              scopeEditorFormula.posActualInicial = pos;
              scopeEditorFormula.posActualFinal = pos;
              document.activeElement.focus();
          }
          Ext.fly(scopeEditorFormula.charCount.getEl()).update(scopeEditorFormula.etiquetas.lbColumna + '<b>' + scopeEditorFormula.posActualFinal + '</b>');
          Ext.getCmp('input').focus();
      },
      GetSelectedTextToCursorPosition: function() {

          if(window.getSelection) {  // all browsers, except IE before version 9
              if(document.activeElement && (document.activeElement.tagName.toLowerCase() == "textarea" || document.activeElement.tagName.toLowerCase() == "input")) {
                  selText = document.activeElement.value.substring(document.activeElement.selectionStart, document.activeElement.selectionEnd);
                  scopeEditorFormula.GetSelectedTextToEnd(document.activeElement.selectionEnd);
              }
          } else {  // Internet Explorer before version 9
              var textRange = document.selection.createRange();
              textRange.collapse(false);
              textRange.select();
          }
          Ext.fly(scopeEditorFormula.charCount.getEl()).update(scopeEditorFormula.etiquetas.lbColumna + '<b>' + document.activeElement.selectionEnd + '</b>');
      },
      Adiccion: function() {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().toString().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "+",
                      "valor": "+"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador o "("
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[') {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' +');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' +';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' +';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "+",
                          "valor": "+"
                      });
                      scopeEditorFormula.arrayConcat.push("+");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Sustraccion: function() {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "-",
                      "valor": "-"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[') {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' -');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' -';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' -';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "-",
                          "valor": "-"
                      });
                      scopeEditorFormula.arrayConcat.push("-");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Division: function() {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "/",
                      "valor": "/"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[') {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' /');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' /';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' /';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "/",
                          "valor": "/"
                      });
                      scopeEditorFormula.arrayConcat.push("/");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Multiplicacion: function() {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "*",
                      "valor": "*"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[') {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' *');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' *';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' *';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "*",
                          "valor": "*"
                      });
                      scopeEditorFormula.arrayConcat.push("*");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Igualdad: function() {
          //si esta vacio el campo formula no se agrega el caracter
          scopeEditorFormula.flagIgualdad = (Ext.getCmp('input').getValue().toString().match(/\=/) != null) ? true : false;
          if(!(Ext.getCmp('input').getValue().length == 0) && (scopeEditorFormula.flagIgualdad == false)) {

              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "=",
                      "valor": "="
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  //                var caracterAnterior=Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length-2);
                  if(!(caracter == '+' || caracter == '-' || caracter == '*' || caracter == '/' || caracter == '=' || caracter == '%' || caracter == '^') && (caracter != '(' && caracter != '[')) {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' =');
                      scopeEditorFormula.flagIgualdad = true;
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' =';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' =';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "=",
                          "valor": "="
                      });
                      scopeEditorFormula.arrayConcat.push("=");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  } else if((caracter == '>') || (caracter == '<')) {
                      //se agrega el operador sin el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + '=');
                      scopeEditorFormula.flagIgualdad = true;
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + '=';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + '=';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "=",
                          "valor": "="
                      });
                      scopeEditorFormula.arrayConcat.push("=");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      PorCiento: function() {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "%",
                      "valor": "%"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[') {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' %');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' %';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' %';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "%",
                          "valor": "%"
                      });
                      scopeEditorFormula.arrayConcat.push("%");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().toString().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Potencia: function() {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "^",
                      "valor": "^"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[') {
                      //se agrega el operador con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ^');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ^';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ^';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "^",
                          "valor": "^"
                      });
                      scopeEditorFormula.arrayConcat.push("^");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      AbrirParentesis: function() {
          scopeEditorFormula.GetSelectedText();
          //si realiza la validacion para el caso en que el campo formula este vacio
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "(",
                      "valor": "("
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {

                  //se valida que el ultimo caracter sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(caracter == '(' || caracter == '[' || scopeEditorFormula.isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=' && caracter != ']') {
                      //se agrega el parentesis con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' (');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' (';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' (';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "(",
                          "valor": "("
                      });
                      scopeEditorFormula.arrayConcat.push("(");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          } else {
              Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + '(');
              scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + '(';
              scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + '(';
              scopeEditorFormula.arrayTipos.push({
                  "idtipoconcepto": "5",
                  "idtipo": "(",
                  "valor": "("
              });
              scopeEditorFormula.arrayConcat.push("(");
              scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
              scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      CerrarParentesis: function() {
          scopeEditorFormula.GetSelectedText();
          //si realiza la validacion para el caso en que el campo formula este vacio
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": ")",
                      "valor": ")"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador ni signo de igualdad o abrir parentesis
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=' && caracter != '(' && caracter != '[') {
                      //se agrega el parentesis con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' )');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' )';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' )';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": ")",
                          "valor": ")"
                      });
                      scopeEditorFormula.arrayConcat.push(")");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      AbrirColchete: function() {
          scopeEditorFormula.GetSelectedText();
          //si realiza la validacion para el caso en que el campo formula este vacio
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "[",
                      "valor": "["
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter sea un operador
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(caracter == '(' || caracter == '[' || scopeEditorFormula.isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=' && caracter != ')') {
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' [');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' [';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' [';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "[",
                          "valor": "["
                      });
                      scopeEditorFormula.arrayConcat.push("[");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          } else {
              Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + '[');
              scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + '[';
              scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + '[';
              scopeEditorFormula.arrayTipos.push({
                  "idtipoconcepto": "5",
                  "idtipo": "[",
                  "valor": "["
              });
              scopeEditorFormula.arrayConcat.push("[");
              scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
              scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      CerrarColchete: function() {
          scopeEditorFormula.GetSelectedText();
          //si realiza la validacion para el caso en que el campo formula este vacio
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "]",
                      "valor": "]"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador ni signo de igualdad o abrir parentesis
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '>' && caracter != '<' && caracter != '=' && caracter != '(' && caracter != '[') {
                      //se agrega el parentesis con el espacio
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ]');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ]';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ]';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": "]",
                          "valor": "]"
                      });
                      scopeEditorFormula.arrayConcat.push("]");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Mayor: function() {
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": ">",
                      "valor": ">"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador, colchete abierto o parentesis abierto
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[' && caracter != '=') {
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' >');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' >';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' >';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": ">",
                          "valor": ">"
                      });
                      scopeEditorFormula.arrayConcat.push(">");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      Menor: function() {
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {
                  newValue = {
                      "idtipoconcepto": "5",
                      "idtipo": "<",
                      "valor": "<"
                  };
                  scopeEditorFormula.InsertarValorCualquierPosicion(newValue);
              } else if((Ext.getCmp('input').getValue().length) == scopeEditorFormula.posActualFinal) {
                  //se valida que el ultimo caracter no sea un operador, colchete abierto o parentesis abierto
                  var caracter = Ext.getCmp('input').getValue().charAt(Ext.getCmp('input').getValue().length - 1);
                  if(!scopeEditorFormula.isOperador(caracter) && caracter != '(' && caracter != '[' && caracter != '=') {
                      Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' <');
                      scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' <';
                      scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' <';
                      scopeEditorFormula.arrayTipos.push({
                          "idtipoconcepto": "5",
                          "idtipo": ">",
                          "valor": "<"
                      });
                      scopeEditorFormula.arrayConcat.push("<");
                      scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
                      scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
                  }
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      BorrarTodo: function() {
          scopeEditorFormula.taFormula.reset();
          scopeEditorFormula.arrayTipos = new Array();
          scopeEditorFormula.arrayConcat = new Array();
          scopeEditorFormula.contador = 0;
          scopeEditorFormula.formulaID = '';
          scopeEditorFormula.formulaStr = '';
          scopeEditorFormula.flagIgualdad = false;
          Ext.QuickTips.getQuickTip().unregister('input');
      },
      BorrarUltimo: function() {
          //almaceno temporalmente el valor del campo formula
          var formtmp = Ext.getCmp('input').getValue(),
              fid = scopeEditorFormula.formulaID,
              fs = scopeEditorFormula.formulaStr,
          //almacena la posicion hasta la cual se va a eliminar la cadena
              pos, posf, poss = 0;
              //ultimo elemento a eliminar
          if(scopeEditorFormula.arrayID.length ==1){
              return;
          }
          var last = scopeEditorFormula.arrayID.pop();
          //si el campo formula no esta vacio lo recorro de atras para alante
          if(formtmp.length != 0) {
              for(var i = formtmp.length - 1; i >= 0; i--) {
                  if(formtmp.charAt(i) == ' ') {
                      pos = i;
                      break;
                  }
              }
          }
          if(fid.length != 0) {
              for(var i = fid.length - 1; i >= 0; i--) {
                  if(fid.charAt(i) == ' ') {
                      posf = i;
                      break;
                  }
              }
          }
          if(fs.length != 0) {
              for(var i = fs.length - 1; i >= 0; i--) {
                  if(!scopeEditorFormula.isOperador(fs.charAt(i))) {
                      poss = i;
                      break;
                  }
              }
          }
          if(!scopeEditorFormula.isOperador(last) && !scopeEditorFormula.isOperadorAgrupacion(last)){
              var str = scopeEditorFormula.arrayStr.pop().trim();
              scopeEditorFormula.formulaStr = fs.substr(0, (scopeEditorFormula.formulaStr.length - str.length)-1);
          }else{
              scopeEditorFormula.formulaStr = fs.substr(0, poss);
          }
          //falta preguntar si la ultima posicion es espacio
          scopeEditorFormula.flagIgualdad = (formtmp.charAt(pos) == '=' || formtmp.length - 1 == ' =') ? false : false;
          Ext.getCmp('input').setValue(formtmp.substr(0, pos));
          scopeEditorFormula.formulaID = fid.substr(0, posf);
          scopeEditorFormula.arrayTipos.pop();
          scopeEditorFormula.arrayConcat.pop();
          scopeEditorFormula.GetSelectedTextToEnd(Ext.getCmp('input').getValue().toString().length);
      },
      ParentesisBalanceados: function() {
          var cadena = scopeEditorFormula.formulaID;
          var band = false;
          for(i = 0; i < cadena.length; i++) {
              if(cadena.charAt(i) == '(') {
                  scopeEditorFormula.contador++;
              } else if(cadena.charAt(i) == ')') {
                  scopeEditorFormula.contador--;
              }
          }
          (scopeEditorFormula.contador == 0) ? (band = true) : (band = false);
          return band;
      },
      ColchetesBalanceados: function() {
          var cadena = scopeEditorFormula.formulaID;
          var band = false;
          for(i = 0; i < cadena.length; i++) {
              if(cadena.charAt(i) == '[') {
                  scopeEditorFormula.contador++;
              } else if(cadena.charAt(i) == ']') {
                  scopeEditorFormula.contador--;
              }
          }
          (scopeEditorFormula.contador == 0) ? (band = true) : (band = false);
          return band;
      },
      ComprobarParseo: function() {
          var parseo = true;
          try {
              //                parserGram.parse(Ext.getCmp('input').getValue().toString());
              //                                parserGram.parse(scopeEditorFormula.formulaID);
              //                scanner = lexerGram.setCadena_entrada(Ext.getCmp('input').getValue().toString());
              //                scanner = lexerGram.Parsear();
              //                parser = parserGram.ParsearSintaxis(scopeEditorFormula.formulaID);
              if(Ext.getCmp('input').getValue().length > 0) {
                  parser = parserGram.ParsearSintaxis(Ext.getCmp('input').getValue().toString());
              } else {
                  Ext.getCmp('input').markInvalid(scopeEditorFormula.etiquetas.lbCampoObligatorio);
                  parseo = false;
              }
          } catch(error) {
              Ext.getCmp('input').markInvalid(error.message);
              Ext.QuickTips.getQuickTip().register({
                  target: 'input',
                  text: error,
                  cls: 'x-form-invalid-tip',
                  dismissDelay: 30000
              });
              parseo = false;
          }
          return parseo;
      },
      isOperador: function(oper) {
          if(oper == '+' || oper == '-' || oper == '*' || oper == '/' || oper == '=' || oper == '>' || oper == '<' || oper == '%' || oper == '^') {
              return true; //es operador
          } else {
              return false; //no es operador
          }
      },
      isOperadorAgrupacion: function(operA) {
          if(operA == '[' || operA == ']' || operA == '(' || operA == ')')
              return true; //es operador de agrupacion
          return false; //no es operador de agrupacion
      },
      isNumero: function(numero) {
          regexNumero = /^[+-]?\d+([,.]\d+)?$/
          if(regexNumero.test(numero) == true) {
              return true; //es un numero entero o real
          } else {
              return false; //no es un numero
          }
      },
      isFlotante: function(numero) {
          regexNumero = /^[+-]?\d+([,.]\d*)?$/
          if(regexNumero.test(numero) == true) {
              return true; //es un numero entero o real sin aun ser definifo e.g: 45,...
          } else {
              return false; //no es un numero
          }
      },
      InsertarValorCualquierPosicion: function(newValue, pos) {
          scopeEditorFormula.GetSelectedText();
          //si esta vacio el campo formula no se agrega el caracter
          if(!(Ext.getCmp('input').getValue().length == 0)) {//si no esta vacio el campo formula
              if(scopeEditorFormula.posActualInicial == scopeEditorFormula.posActualFinal && (Ext.getCmp('input').getValue().length) != scopeEditorFormula.posActualFinal) {//si esta posicionado en cualquier parte menos el final
                  antes = Ext.getCmp('input').getValue().substr(0, scopeEditorFormula.posActualFinal); //todo por delante de la posicion a insertar
                  despues = Ext.getCmp('input').getValue().substr(scopeEditorFormula.posActualFinal, Ext.getCmp('input').getValue().length); ////todo despues de la posicion a insertar
                  vAntes = antes.substring(antes.length - 1); //ultimo caracter por delante de la posicion a insertar
                  vDespues = despues.substring(0, 1); //primer caracter despues de la posicion a insertar
                  if(vAntes == "" || vAntes == " " || vDespues == " ") {
                      //actualizar formula de concat
                      arrayConcatsDespues = despues.toString().replace(/\s{2}/, " ");
                      arrayConcatsDespues = despues.toString().split(" ");
                      arrayConcatsAntes = antes.toString().replace(/\s{2}/, " ");
                      arrayConcatsAntes = antes.toString().split(" ");
                      if(vAntes == " ")
                          arrayConcatsAntes.pop(); //eliminar el espacio al final
                      if(vDespues == " ")
                          arrayConcatsDespues.shift(); //eliminar el espacio al principio
                      if(arrayConcatsAntes[0] == "" || arrayConcatsAntes[0] == " " || arrayConcatsAntes[0] == null) {
                          arrayConcatsAntes.shift();
                      }
                      (newValue.idtipoconcepto == 5) ? (arrayConcatsAntes.push(newValue.valor)) : (arrayConcatsAntes.push(newValue.concat));
                      posNuevoValorInsertado = arrayConcatsAntes.length - 1;
                      //actualiza el textarea scopeEditorFormula.taFormula
                      NuevaformulaConcat = arrayConcatsAntes.concat(arrayConcatsDespues);
                      arrayConcats = NuevaformulaConcat.toString().replace(/\s{2}/, " ");
                      arrayConcats = NuevaformulaConcat.join(" ");
                      arrayConcats = arrayConcats.toString().replace(/\s{2}/, " ");
                      Ext.getCmp('input').setValue(arrayConcats);
                      //actualizar formula de id
                      arrayformulaID = scopeEditorFormula.formulaID.toString().split(" ");
                      arrayformulaIDAntes = arrayformulaID.slice(0, posNuevoValorInsertado);
                      (newValue.idtipoconcepto == 5) ? (arrayformulaIDAntes.push(newValue.valor)) : (arrayformulaIDAntes.push(newValue.idtipo));
                      arrayformulaIDDespues = arrayformulaID.slice(posNuevoValorInsertado, scopeEditorFormula.formulaID.length);
                      NuevaformulaID = arrayformulaIDAntes.concat(arrayformulaIDDespues);
                      scopeEditorFormula.formulaID = NuevaformulaID.join(" ");
                      //actualizar los nodos de la formula scopeEditorFormula.arrayTipos
                      arrayTiposAntes = scopeEditorFormula.arrayTipos.slice(0, posNuevoValorInsertado);
                      arrayTiposAntes.push(newValue); //{ "idtipoconcepto":"5", "idtipo":"+", "valor":"+"}
                      arrayTiposDespues = scopeEditorFormula.arrayTipos.slice(posNuevoValorInsertado, scopeEditorFormula.formulaID.length);
                      scopeEditorFormula.arrayTipos = arrayTiposAntes.concat(arrayTiposDespues);
                      //actualizar formula descriptiva
                      NuevaformulaStr = scopeEditorFormula.formulaStr.toString().split(" ");
                      strArrayForm = new Array();
                      for(i = 0; i < NuevaformulaStr.length; i++) {
                          if(strArrayForm.length > 0 && strArrayForm[strArrayForm.length - 1].toString().match(scopeEditorFormula.regexOperadores) == null && (NuevaformulaStr[i].toString().match(scopeEditorFormula.regexOperadores) == null)) {
                              var vOut = strArrayForm.pop();
                              strArrayForm.push(vOut + " " + NuevaformulaStr[i].toString());
                          } else {
                              strArrayForm.push(NuevaformulaStr[i]);
                          }
                      }
                      strArrayFormAntes = strArrayForm.slice(0, posNuevoValorInsertado);
                      (newValue.idtipoconcepto == 5) ? (strArrayFormAntes.push(newValue.valor)) : (strArrayFormAntes.push(newValue.descripcion));
                      strArrayFormDespues = strArrayForm.slice(posNuevoValorInsertado, strArrayForm.length);
                      strArrayForm = strArrayFormAntes.concat(strArrayFormDespues);
                      scopeEditorFormula.formulaStr = strArrayForm.join(" ");
                  } else {
                      Ext.EventManager.on("input", 'keypress', function(e) {
                          e.stopEvent();
                      });
                  }
              } else if(pos == scopeEditorFormula.posActualFinal) {
                  Ext.getCmp('input').setValue(Ext.getCmp('input').getValue() + ' ' + newValue.concat);
                  scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + newValue.idtipo;
                  scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + newValue.descripcion;
                  scopeEditorFormula.arrayTipos.push({
                      "idtipoconcepto": newValue.idtipoconcepto,
                      "idtipo": newValue.idtipo,
                      "valor": newValue.valor,
                      "descripcion": newValue.descripcion,
                      "concat": newValue.concat
                  });
                  scopeEditorFormula.arrayConcat.push(newValue.concat);
              }
          }
          scopeEditorFormula.posActualFinal = Ext.getCmp('input').getValue().length;
          scopeEditorFormula.GetSelectedTextToEnd(scopeEditorFormula.posActualFinal);
      },
      EscribirNumero: function(tecla, btn) {
          var arrayFID = scopeEditorFormula.formulaID.toString().split(" ");
          var idAnterior = arrayFID[arrayFID.length - 1];
          var NuevaformulaStr = scopeEditorFormula.formulaStr.toString().split(" ");
          var strArrayForm = new Array();
          if(tecla == undefined || tecla == 'undefined') {
              numInput = btn;
          } else {
              numInput = String.fromCharCode(tecla);
          }
          for(i = 0; i < NuevaformulaStr.length; i++) {
              if(strArrayForm.length > 0 && strArrayForm[strArrayForm.length - 1].toString().match(scopeEditorFormula.regexOperadores) == null && (NuevaformulaStr[i].toString().match(scopeEditorFormula.regexOperadores) == null)) {
                  var vOut = strArrayForm.pop();
                  strArrayForm.push(vOut + " " + NuevaformulaStr[i].toString());
              } else {
                  strArrayForm.push(NuevaformulaStr[i]);
              }
          }
          if((scopeEditorFormula.isOperador(idAnterior) == false || scopeEditorFormula.isOperadorAgrupacion(idAnterior) == false) && Ext.getCmp('input').getValue().length > 0) {
              if(scopeEditorFormula.isNumero(idAnterior) || scopeEditorFormula.isFlotante(idAnterior)) {
                  var concatAnterior = scopeEditorFormula.arrayConcat.pop();
                  numero = concatAnterior.concat(numInput);
                  var idpAnterior = arrayFID.pop();
                  numeroID = idpAnterior.concat(numInput);
                  arrayFID.push(numeroID);
                  var strAnterior = strArrayForm.pop();
                  numeroStr = strAnterior.concat(numInput);
                  strArrayForm.push(numeroStr);
                  scopeEditorFormula.arrayTipos.pop();
              } else {
                  numero = numInput;
                  arrayFID.push(numInput);
                  strArrayForm.push(numInput);
              }
              scopeEditorFormula.arrayConcat.push(numero);
              Ext.getCmp('input').setValue(scopeEditorFormula.arrayConcat.join(" "));
              scopeEditorFormula.formulaID = arrayFID.join(" ");
              scopeEditorFormula.formulaStr = strArrayForm.join(" ");
              scopeEditorFormula.arrayTipos.push({
                  "idtipoconcepto": "6",
                  "idtipo": "6",
                  "concat": numero,
                  "descripcion": numero,
                  "valor": numero
              });
          } else {
              numero = numInput;
              scopeEditorFormula.arrayConcat.push(numero);
              Ext.getCmp('input').setValue(scopeEditorFormula.arrayConcat.join(" "));
              scopeEditorFormula.formulaID = scopeEditorFormula.formulaID + ' ' + numero;
              scopeEditorFormula.formulaStr = scopeEditorFormula.formulaStr + ' ' + numero;
              scopeEditorFormula.arrayTipos.push({
                  "idtipoconcepto": "6",
                  "idtipo": "6",
                  "concat": numero,
                  "descripcion": numero,
                  "valor": numero
              });
          }
      },
      AdicionarFormula: function() {
          nodoPadre = scopeConceptoContable.nodoSeleccionado.parentNode;
          scopeConceptoContable.recarga = false;
          if(scopeConceptoContable.nodoSeleccionado.attributes.configurado == false && (Ext.getCmp('input').getValue() != '' || Ext.getCmp('input').getValue().length > 0)) {
              if(scopeEditorFormula.ParentesisBalanceados()) {
                  if(scopeEditorFormula.ColchetesBalanceados()) {
                      if(Ext.getCmp('input').isValid()) {
                          Ext.getCmp('fpFormula').getForm().submit({
                              url: '/contabilidad/contabilidad_financiera/reportes/index.php/editorformulas/adicionarformula',
                              waitMsg: scopeEditorFormula.etiquetas.lbSaveData,
                              params: {
                                  formulamostrada: Ext.getCmp('input').getValue(),
                                  nomformula: scopeEditorFormula.formulaID,
                                  formulastr: scopeEditorFormula.formulaStr,
                                  codigo: scopeConceptoContable.nodoSeleccionado.attributes.codigo,
                                  idconceptocontableestructurae: scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontableestructurae,
                                  idestructurae: scopeConceptoContable.nodoSeleccionado.attributes.idestructurae,
                                  nodos: Ext.encode(scopeEditorFormula.arrayTipos),
                                  concats: Ext.encode(scopeEditorFormula.arrayConcat),
                                  isCuadreFinanciero: (Ext.getCmp('input').getValue().toString().match(/\=/) != null) ? true : false
                              },
                              failure: function(form, action) {
                                  responseData = Ext.decode(action.result.codMsg);
                                  switch(responseData) {
                                      case -1:
                                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbInfoAddFormula, function() {
                                              Ext.getCmp('input').reset();
                                              Ext.getCmp('tfDenominacion').reset();
                                              Ext.getCmp('fpFormula').getForm().reset();
                                              scopeEditorFormula.BorrarTodo();
                                              Ext.getCmp('winFormCont').destroy();
                                              scopeConceptoContable.clearDetails('apl');
                                          });
                                          break;
                                      case -2:
                                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbErrorAddFormula);
                                          break;
                                      default:
                                          mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                          break;
                                  }
                              }
                          });
                      } else {
                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbErrorCamposIncorrectos);
                      }
                  } else {
                      Ext.QuickTips.getQuickTip().register({
                          target: 'input',
                          text: scopeEditorFormula.etiquetas.lbErrorColchetesBal,
                          cls: 'x-form-invalid-tip',
                          dismissDelay: 10000
                      });
                  }
              } else {
                  Ext.QuickTips.getQuickTip().register({
                      target: 'input',
                      text: scopeEditorFormula.etiquetas.lbErrorParentesisBal,
                      cls: 'x-form-invalid-tip',
                      dismissDelay: 10000
                  });
              }
          } else {
              mostrarMensaje(1, scopeEditorFormula.etiquetas.lbErrorCamposIncorrectos);
          }
      },
      ModificarFormula: function() {
          NuevaformulaStr = scopeEditorFormula.formulaStr.toString().split(" ");
          strArrayForm = new Array();
          for(i = 0; i < NuevaformulaStr.length; i++) {
              if(strArrayForm.length > 0 && strArrayForm[strArrayForm.length - 1].toString().match(scopeEditorFormula.regexOperadores) == null && (NuevaformulaStr[i].toString().match(scopeEditorFormula.regexOperadores) == null)) {
                  var vOut = strArrayForm.pop();
                  strArrayForm.push(vOut + " " + NuevaformulaStr[i].toString());
              } else {
                  strArrayForm.push(NuevaformulaStr[i]);
              }
          }
          scopeEditorFormula.formulaStr = strArrayForm.join(" ");
          scopeEditorFormula.arrayID = arrayformulaID = scopeEditorFormula.formulaID.toString().split(" ");
          scopeEditorFormula.arrayStr = scopeEditorFormula.formulaStr.toString().split(scopeEditorFormula.regexOperadores);
          scopeEditorFormula.arrayTipos = scopeEditorFormula.arrayTipos || new Array();
          if(scopeEditorFormula.arrayConcat[0] == "" || scopeEditorFormula.arrayConcat[0] == " " || scopeEditorFormula.arrayConcat[0] == null) {
              scopeEditorFormula.arrayConcat.shift();
          }
          if(scopeEditorFormula.arrayTipos.length == 0){
              for(i = 0; i < scopeEditorFormula.arrayConcat.length; i++) {
                  scopeEditorFormula.arrayTipos.push({
                      "idtipoconcepto": ((scopeEditorFormula.arrayConcat[i].toString().match(scopeEditorFormula.regexOperadores)) ? "5" : "6"),
                      "idtipo": arrayformulaID[i],
                      "concat": scopeEditorFormula.arrayConcat[i],
                      "descripcion": strArrayForm[i],
                      "valor": scopeEditorFormula.arrayConcat[i]
                  });
              }
          }
          nodoPadre = scopeConceptoContable.nodoSeleccionado.parentNode;
          scopeConceptoContable.recarga = false;
          if(scopeConceptoContable.nodoSeleccionado.attributes.configurado && (scopeConceptoContable.nodoSeleccionado.attributes.formula != scopeEditorFormula.formulaID)) {
              if(scopeEditorFormula.ParentesisBalanceados()) {
                  if(scopeEditorFormula.ColchetesBalanceados()) {
                      if(Ext.getCmp('input').isValid()) {
                          Ext.getCmp('fpFormula').getForm().submit({
                              url: '/contabilidad/contabilidad_financiera/reportes/index.php/editorformulas/modificarformula',
                              waitMsg: scopeEditorFormula.etiquetas.lbSaveData,
                              params: {
                                  formulamostrada: Ext.encode(Ext.getCmp('input').getValue()),
                                  nomformula: Ext.encode(scopeEditorFormula.formulaID),
                                  formulastr: Ext.encode(scopeEditorFormula.formulaStr),
                                  idformula: (scopeConceptoContable.nodoSeleccionado.attributes.configurado == true) ? Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.idformula) : -1,
                                  codigo: Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.codigo),
                                  idconceptocontable: Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontable),
                                  idconceptocontableestructurae: Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontableestructurae),
                                  idestructurae: Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.idestructurae),
                                  nodos: Ext.encode(scopeEditorFormula.arrayTipos),
                                  concats: Ext.encode(scopeEditorFormula.arrayConcat)
                              },
                              failure: function(form, action) {
                                  responseData = Ext.decode(action.result.codMsg);
                                  switch(responseData) {
                                      case -1:
                                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbInfoModFormula, function() {
                                              Ext.getCmp('input').reset();
                                              Ext.getCmp('tfDenominacion').reset();
                                              scopeEditorFormula.winFormCont.destroy();
                                              scopeEditorFormula.BorrarTodo();
                                              scopeConceptoContable.clearDetails('apl');
                                          });
                                          break;
                                      case -2:
                                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbErrorModFormula);
                                          break;
                                      case -3:
                                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbNoEntidad);
                                          break;
                                      default:
                                          mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                          break;
                                  }

                              }
                          });
                      } else
                          mostrarMensaje(1, scopeEditorFormula.etiquetas.lbErrorCamposIncorrectos);
                  } else {
                      Ext.QuickTips.getQuickTip().register({
                          target: 'input',
                          text: scopeEditorFormula.etiquetas.lbErrorColchetesBal,
                          cls: 'x-form-invalid-tip',
                          dismissDelay: 10000
                      });
                  }
              } else {
                  Ext.QuickTips.getQuickTip().register({
                      target: 'input',
                      text: scopeEditorFormula.etiquetas.lbErrorParentesisBal,
                      cls: 'x-form-invalid-tip',
                      dismissDelay: 10000
                  });
              }
          } else {
              mostrarMensaje(1, scopeEditorFormula.etiquetas.lbInfoSinCambios, function() {
              });
          }
      },
      EliminarFormula: function() {
          nodoPadre = scopeConceptoContable.nodoSeleccionado.parentNode;
          scopeConceptoContable.recarga = false;
          function onbtnAceptar(btn) {
              if(btn == "ok") {
                  Ext.Ajax.request({
                      url: '/contabilidad/contabilidad_financiera/reportes/index.php/editorformulas/eliminarformula',
                      method: 'POST',
                      waitMsg: scopeEditorFormula.etiquetas.lbDelData,
                      params: {
                          idformula: Ext.encode((scopeConceptoContable.nodoSeleccionado.attributes.configurado == true) ? scopeConceptoContable.nodoSeleccionado.attributes.idformula : -1),
                          idconceptocontable: Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontable),
                          idconceptocontableestructurae: Ext.encode(scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontableestructurae)
                      },
                      callback: function(options, success, response) {
                          var respuesta = Ext.decode(response.responseText);
                          switch(respuesta.codMsg) {
                              case -1:
                                  mostrarMensaje(1, scopeEditorFormula.etiquetas.lbInfoDelFormula, function() {
                                      scopeEditorFormula.winFormCont.destroy();
                                      scopeEditorFormula.BorrarTodo();
                                      scopeConceptoContable.clearDetails('apl');
                                  });
                                  break;
                              case -2:
                                  mostrarMensaje(1, scopeEditorFormula.etiquetas.lbErrorDelFormula);
                                  break;
                              default:
                                  mostrarMensaje(respuesta.codMsg, respuesta.mensaje);
                                  break;
                          }
                      }
                  });
              }
          }

          mostrarMensaje(2, scopeEditorFormula.etiquetas.lbPromtDelFormula, onbtnAceptar);
      }
  });