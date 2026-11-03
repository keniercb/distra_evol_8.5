
  Ext.namespace('Ext.Confin.Configuracion');
  Ext.Confin.Configuracion.ConceptosContables = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      etiquetas: new Object(),
      recarga: true,
      nodoSeleccionado: undefined,
      /**
       * Constructor del componente Conceptos contables.
       * @property
       * @type Function
       */
      constructor: function() {
          Ext.QuickTips.init();
          Ext.Ajax.timeout = 6000000;
          scopeConceptoContable = this;
          Ext.Ajax.request({
              method: "POST",
              url: "cargaretiquetas",
              params: {
                  vista: 'gestionarconceptoscontables'
              },
              callback: function(options, success, response) {
                  scopeConceptoContable.etiquetas = Ext.decode(response.responseText);
                  scopeConceptoContable.onloadMessageBox(scopeConceptoContable.etiquetas.lbEsperando, scopeConceptoContable.etiquetas.lbCargando);
                  scopeConceptoContable.cargarInterfaz(scopeConceptoContable.perfil, scopeConceptoContable.etiquetas);
              }
          });
      },
      /**
       * Muestra un Ext.MessageBox con el mensaje y t&iacute;tulo indicado.
       * @property agTtl T&iacute;tulo a mostrar en el encabezado de la ventana.
       * @property agMsg Mensaje a mostrar en el cuerpo de la ventana.
       * @type Function
       */
      onloadMessageBox: function(agTtl, agMsg) {
          Ext.MessageBox.show({
              title: agTtl || scopeConceptoContable.etiquetas.lbEsperando,
              msg: agMsg || scopeConceptoContable.etiquetas.lbCargando,
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
      /**
       * Muestra una m&aacute;scara con el mensaje indicado.
       * @property agMsg Mensaje a mostrar en el cuerpo de la m&aacute;scara.
       * @type Function
       */
      loadMask: function(agMsg) {
          scopeConceptoContable.lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: agMsg || scopeConceptoContable.etiquetas.lbCargando
          });
          scopeConceptoContable.lMask.show();
      },
      hide: function() {
          scopeConceptoContable.lMask.hide();
      },
      /**
       * Obtener un n&uacute;mero entero aleatorio.
       * @property
       * @return {int} N&uacute;mero entero aleatorio.
       * @type Function
       */
      getRandomNumber: function() {
          var min = 1;
          var max = 1000;
          //var rand = Math.floor(Math.random()*(max-(min-1))) + min;
          var rand = Math.round(Math.random() * (max - min) + min);
          return rand;
      },
      /**
       * Mostrar la interfaz principal del componente.
       * @property perfil Perfil del marco de trabajo.
       * @property etiquetas Etiquetas del componente.
       * @type Function
       */
      cargarInterfaz: function(perfil, etiquetas) {
          scopeConceptoContable.btnAdicionar = new Ext.Button({
              tabIndex: 1,
              disabled: true,
              id: 'btnAdicionar',
              iconCls: 'adicionar',
              text: scopeConceptoContable.etiquetas.lbBtnAdicionar,
              tooltip: scopeConceptoContable.etiquetas.lbTtAdicionar,
              handler: function() {
                  scopeConceptoContable.kmTeclasCalientes.disable();
                  scopeConceptoContable.winFpRegConceptoContable('Ins');
                  Ext.getCmp('tfCodigo').setValue(scopeConceptoContable.getRandomNumber());
              }
          });
          scopeConceptoContable.btnEliminar = new Ext.Button({
              tabIndex: 3,
              disabled: true,
              id: 'btnEliminar',
              iconCls: 'eliminar',
              text: scopeConceptoContable.etiquetas.lbBtnEliminar,
              tooltip: scopeConceptoContable.etiquetas.lbTtEliminar,
              handler: function() {
                  scopeConceptoContable.kmTeclasCalientes.disable();
                  scopeConceptoContable.eliminarConceptoContable(scopeConceptoContable.nodoSeleccionado);
              }
          });
          scopeConceptoContable.btnModificar = new Ext.Button({
              tabIndex: 2,
              id: 'btnModificar',
              iconCls: 'modificar',
              text: scopeConceptoContable.etiquetas.lbBtnModificar,
              tooltip: scopeConceptoContable.etiquetas.lbTtModificar,
              disabled: true,
              handler: function() {
                  scopeConceptoContable.kmTeclasCalientes.disable();
                  scopeConceptoContable.winFpRegConceptoContable('Mod');
              }
          });
          scopeConceptoContable.btnAyuda = new Ext.Button({
              tabIndex: 5,
              id: 'btnHelpConfConceptoContable',
              iconCls: 'ayuda',
              text: scopeConceptoContable.etiquetas.lbBtnAyuda,
              tooltip: scopeConceptoContable.etiquetas.lbTtAyuda
          });

          scopeConceptoContable.contextMenu = new Ext.menu.Menu({
              id: 'contextMenu',
              items: [
                  {
                      iconCls: 'x-menu-item-icon',
                      icon: scopeConceptoContable.perfil.dirImg + 'adicionar.png',
                      text: scopeConceptoContable.etiquetas.lbTtAdicionar,
                      disabled: true,
                      handler: function() {
                          scopeConceptoContable.kmTeclasCalientes.disable();
                          scopeConceptoContable.winFpRegConceptoContable('Ins');
                      }
                  },
                  {
                      iconCls: 'x-menu-item-icon',
                      icon: scopeConceptoContable.perfil.dirImg + 'modificar.png',
                      text: scopeConceptoContable.etiquetas.lbTtModificar,
                      disabled: true,
                      handler: function() {
                          scopeConceptoContable.kmTeclasCalientes.disable();
                          scopeConceptoContable.winFpRegConceptoContable('Mod');
                      }
                  },
                  {
                      iconCls: 'x-menu-item-icon',
                      icon: scopeConceptoContable.perfil.dirImg + 'eliminar.png',
                      text: scopeConceptoContable.etiquetas.lbTtEliminar,
                      disabled: true,
                      handler: function() {
                          scopeConceptoContable.kmTeclasCalientes.disable();
                          scopeConceptoContable.eliminarConceptoContable();
                      }
                  },
                  {
                      iconCls: 'x-menu-item-icon',
                      icon: scopeConceptoContable.perfil.dirImg + 'formula.png',
                      text: scopeConceptoContable.etiquetas.lbTtFormula,
                      disabled: true,
                      handler: function() {
                          scopeConceptoContable.kmTeclasCalientes.disable();
                          objTree = new Ext.Cont.Class.GruposCtas();
						  Ext.getBody().mask('Inicializando datos...');
                          objTree.on('initialize', function(arbolTipoConcepto) {
							  objTreef = new Ext.Cont.ClassconceptosFormulas();
                              objTreef.on('initialize', function(arbolConceptosFormulas) {
								  Ext.getBody().unmask();
                                  new Ext.Confin.Configuracion.EditorFormula(arbolTipoConcepto, arbolConceptosFormulas);
                              });
                          });
                      }
                  },
                  {
                      iconCls: 'x-menu-item-icon',
                      icon: scopeConceptoContable.perfil.dirImg + 'actualizar.png',
                      text: scopeConceptoContable.etiquetas.lbTtActualizar,
                      listeners: {
                          click: function() {
                              scopeConceptoContable.kmTeclasCalientes.disable();
                              scopeConceptoContable.clearDetails();
                              //                        var tree = Ext.getCmp('trpConceptosContables');
                              //                        tree.body.mask(scopeConceptoContable.etiquetas.lbCargando, 'x-mask-loading');
                              //                        tree.root.reload();
                              //                        tree.root.collapse(true, false);
                              //                        setTimeout(function() {
                              //                            tree.body.unmask();
                              //                        }, 1000);
                              var xTree = Ext.getCmp('trpConceptosContables');
                              var xnode = xTree.getRootNode();
                              var xfather = false;
                              var xpath = scopeConceptoContable.nodoSeleccionado.getPath();
                              xTree.body.mask(scopeConceptoContable.etiquetas.lbCargando, 'x-mask-loading');
                              var xNodeSel = (xnode.leaf && xfather) ? xnode.parentNode : xnode;
                              xTree.getLoader().load(xNodeSel, function() {
                                  if(xpath.length > 0)
                                      xTree.expandPath(xpath);
                                  else
                                      xNodeSel.expand();
                                  xTree.body.unmask();
                              });

                          }
                      }
                  }
              ]
          });

          scopeConceptoContable.btnFormula = new Ext.Button({
              tabIndex: 4,
              id: 'btnFormula',
              iconCls: 'formula',
              text: scopeConceptoContable.etiquetas.lbBtnFormula,
              tooltip: scopeConceptoContable.etiquetas.lbTtFormula,
              disabled: true,
              handler: function() {
				  Ext.getBody().mask('Inicializando datos...');
                  scopeConceptoContable.kmTeclasCalientes.disable();
                  objTree = new Ext.Cont.Class.GruposCtas();                  
                  objTree.on('initialize', function(arbolTipoConcepto) {
					  objTreef = new Ext.Cont.ClassconceptosFormulas();
                      objTreef.on('initialize', function(arbolConceptosFormulas) {
						  Ext.getBody().unmask();
                          new Ext.Confin.Configuracion.EditorFormula(arbolTipoConcepto, arbolConceptosFormulas);
                      });
                  });
              }
          });

          scopeConceptoContable.stTipoConceptoFin = new Ext.data.Store({
              url: 'loadDataTipoConceptoFin',
              autoLoad: true,
              reader: new Ext.data.JsonReader({
                  root: 'datos'
              }, [{
                      name: 'idtipoconceptofin'
                  }, {
                      name: 'denominacion'
                  }
              ])
          });

          scopeConceptoContable.cbTipoConceptoFin = new Ext.form.ComboBox({
              tabIndex: 6,
              id: 'cbTipoConceptoFin',
              name: 'cbTipoConceptoFin',
              fieldLabel: scopeConceptoContable.etiquetas.lbTipoConcepto,
              emptyText: scopeConceptoContable.etiquetas.lbSeleccione,
              loadingText: scopeConceptoContable.etiquetas.lbCargando,
              store: scopeConceptoContable.stTipoConceptoFin,
              valueField: 'idtipoconceptofin',
              displayField: 'denominacion',
              disabledClass: 'disabled-component',
              anchor: '99%',
              resizable: true,
              typeAhead: true,
              editable: false,
              triggerAction: 'all',
              mode: 'local',
              allowBlank: false,
              enableKeyEvents: true,
              value: 1
          });

          scopeConceptoContable.tfTipoConceptoFin = new Ext.form.TextField({
              fieldLabel: scopeConceptoContable.etiquetas.lbTipoConcepto,
              emptyText: scopeConceptoContable.etiquetas.lbTipoConcepto,
              id: 'tfTipoConceptoFin',
              anchor: '95%',
              name: 'tfTipoConceptoFin',
              readOnly: true,
              editable: false
          });

          scopeConceptoContable.tfNombre = new Ext.form.TextField({
              fieldLabel: scopeConceptoContable.etiquetas.lbAbreviatura,
              emptyText: scopeConceptoContable.etiquetas.lbAbreviatura,
              id: 'tfNombre',
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*)+$/,
              regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*)+$/,
              anchor: '95%',
              maxLength: 100,
			  regexText: scopeConceptoContable.etiquetas.lbAlphaNum,
              invalidText: scopeConceptoContable.etiquetas.lbAlphaNum,
              readOnly: true,
              editable: false
          });
          scopeConceptoContable.tfCodigo = new Ext.form.TextField({
              fieldLabel: scopeConceptoContable.etiquetas.lbCodigo,
              emptyText: scopeConceptoContable.etiquetas.lbCodigo,
              id: 'tfCodigo',
              tabIndex: 7,
              allowBlank: false,
              blankText: scopeConceptoContable.etiquetas.lbCampoObligatorio,
              maskRe: /^0{0,2}?\d{1,10}$/,
              regex: /^\d{1,10}$/,
              allowNegative: false,
              selectOnFocus: true,
              enableKeyEvents: true,
              regexText: scopeConceptoContable.etiquetas.lbCodigoRegex,
              name: 'codigo',
              anchor: '99%',
              minLength: 1,
              maxLength: 10,
              maxLengthText: scopeConceptoContable.etiquetas.lbMaxLengthNum,
              minLengthText: scopeConceptoContable.etiquetas.lbMinLengthNum
          });
          scopeConceptoContable.tfCodigo2 = new Ext.form.TextField({
              fieldLabel: scopeConceptoContable.etiquetas.lbCodigo,
              emptyText: scopeConceptoContable.etiquetas.lbCodigo,
              id: 'tfCodigo2',
              maskRe: /^\d*$/,
              regex: /^\d*$/,
              allowNegative: false,
              anchor: '95%',
              name: 'codigo',
              readOnly: true,
              editable: false
          });
          scopeConceptoContable.taFormulaCC = new Ext.form.TextArea({
              id: 'taFormulaCC',
              readOnly: true,
              editable: false,
              fieldLabel: scopeConceptoContable.etiquetas.lbFormulaDescriptiva,
              emptyText: scopeConceptoContable.etiquetas.lbFormulaDescriptiva,
              anchor: '95%',
              height: 150,
              //grow: true,
              //growMax: 170,
              selectOnFocus: true
          });
          scopeConceptoContable.taFormulaID = new Ext.form.TextArea({
              id: 'taFormulaID',
              readOnly: true,
              editable: false,
              fieldLabel: scopeConceptoContable.etiquetas.lbFormulaContable,
              emptyText: scopeConceptoContable.etiquetas.lbFormulaContable,
              anchor: '95%',
              height: 100,
              //grow: true,
              //growMax: 170,
              selectOnFocus: true
          });
          scopeConceptoContable.taDescripcion = new Ext.form.TextArea({
              fieldLabel: scopeConceptoContable.etiquetas.lbDescripcion,
              emptyText: scopeConceptoContable.etiquetas.lbDescripcion,
              id: 'taDescripcion',
              name: 'taDescripcion',
              tabIndex: 9,
              enableKeyEvents: true,
              allowBlank: false,
              blankText: scopeConceptoContable.etiquetas.lbCampoObligatorio,
              regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]*)+$/,
              regexText: scopeConceptoContable.etiquetas.lbAlphaNum,
              anchor: '99%',
              minLength: 1,
              maxLength: 255,
              minLengthText: scopeConceptoContable.etiquetas.lbMinLengthText,
              maxLengthText: scopeConceptoContable.etiquetas.lbMaxLengthText
          });
          scopeConceptoContable.taDescripcion3 = new Ext.form.TextArea({
              fieldLabel: scopeConceptoContable.etiquetas.lbDescripcion,
              emptyText: 'Descripción',
              id: 'taDescripcion3',
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]*)+$/,
              regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
              anchor: '95%',
              maxLength: 255,
              readOnly: true,
              editable: false
          });
          scopeConceptoContable.taDescripcion4 = new Ext.form.TextArea({
              fieldLabel: scopeConceptoContable.etiquetas.lbDescripcion,
              emptyText: scopeConceptoContable.etiquetas.lbDescripcion,
              id: 'taDescripcion4',
              allowBlank: false,
              blankText: scopeConceptoContable.etiquetas.lbCampoObligatorio,
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\.\#\+\,]*)+$/,
              regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+$/,
              anchor: '95%',
              enableKeyEvents: true,
              maxLength: 255,
              readOnly: true,
              editable: false
          });
          scopeConceptoContable.tfNombre2 = new Ext.form.TextField({
              fieldLabel: scopeConceptoContable.etiquetas.lbAbreviatura,
              emptyText: scopeConceptoContable.etiquetas.lbAbreviatura,
              id: 'tfNombre2',
              name: 'tfNombre2',
              anchor: '99%',
              tabIndex: 8,
              enableKeyEvents: true,
              allowBlank: false,
              blankText: scopeConceptoContable.etiquetas.lbCampoObligatorio,
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\-{1}\.{1}\/{1}]+?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]*)+$/,
              regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
              regexText: scopeConceptoContable.etiquetas.lbAlphaNum,
              invalidText: scopeConceptoContable.etiquetas.lbAlphaNum,
              minLength: 1,
              maxLength: 100,
              minLengthText: scopeConceptoContable.etiquetas.lbMinLengthText,
              maxLengthText: scopeConceptoContable.etiquetas.lbMaxLengthText
          });
          scopeConceptoContable.tfCodigo.on({
              keyup: function(t, e) {
                  if(t.getValue().length == 0) {
                      Ext.getCmp('btnAplicarAdd').disable();
                      Ext.getCmp('btnAceptarAdd').disable();
                  } else if(t.getValue().length > 0 && scopeConceptoContable.tfNombre2.getValue().length > 0 && scopeConceptoContable.taDescripcion.getValue().length > 0) {
                      Ext.getCmp('btnAplicarAdd').enable();
                      Ext.getCmp('btnAceptarAdd').enable();
                  }
              }
          });
          scopeConceptoContable.tfNombre2.on({
              keyup: function(t, e) {
                  if(t.getValue().length == 0) {
                      Ext.getCmp('btnAplicarAdd').disable();
                      Ext.getCmp('btnAceptarAdd').disable();
                  } else if(t.getValue().length > 0 && scopeConceptoContable.tfCodigo.getValue().length > 0 && scopeConceptoContable.taDescripcion.getValue().length > 0) {
                      Ext.getCmp('btnAplicarAdd').enable();
                      Ext.getCmp('btnAceptarAdd').enable();
                  }
              }
          });
          scopeConceptoContable.taDescripcion.on({
              keyup: function(t, e) {
                  if(t.getValue().length == 0) {
                      Ext.getCmp('btnAplicarAdd').disable();
                      Ext.getCmp('btnAceptarAdd').disable();
                  } else if(t.getValue().length > 0 && scopeConceptoContable.tfNombre2.getValue().length > 0 && scopeConceptoContable.tfCodigo.getValue().length > 0) {
                      Ext.getCmp('btnAplicarAdd').enable();
                      Ext.getCmp('btnAceptarAdd').enable();
                  }
              }
          });
          scopeConceptoContable.trpConceptosC = new Ext.tree.TreePanel({
              id: 'trpConceptosContables',
              region: 'center',
              width: '35%',
              lines: true,
              shadow: true,
              animate: true,
              autoShow: true,
              boxReady: true,
              enableDD: false,
              autoScroll: true,
              singleExpand: false,
              trackMouseOver: true,
              selModel: new Ext.tree.DefaultSelectionModel(),
              listeners: {
                  click: function(node, e) {
                      scopeConceptoContable.nodoSeleccionado = node;
                      window.nodoSeleccionado = node;
                      scopeConceptoContable.fillDetails(node);
                      if(node.id == 0) {
                          Ext.getCmp('btnAdicionar').enable();
                          Ext.getCmp('btnAdicionar').focus();
                          Ext.getCmp('btnModificar').disable();
                          Ext.getCmp('btnEliminar').disable();
                          Ext.getCmp('btnFormula').disable();
                          //scopeConceptoContable.contextMenu.items.items[0].enable();//Adicionar
                          //scopeConceptoContable.contextMenu.items.items[1].disable();//Modificar
                          //scopeConceptoContable.contextMenu.items.items[2].disable();//Eliminar
                          //scopeConceptoContable.contextMenu.items.items[3].disable();//Formula
                      } else {
                          if(node.attributes.idtipoconceptofin === '4' || node.attributes.idtipoconceptofin === '5') {
                              Ext.getCmp('btnAdicionar').enable();
                              Ext.getCmp('btnModificar').enable();
                              Ext.getCmp('btnEliminar').enable();
                              Ext.getCmp('btnFormula').disable();
                              //scopeConceptoContable.contextMenu.items.items[0].enable();
                              //scopeConceptoContable.contextMenu.items.items[1].enable();
                              //scopeConceptoContable.contextMenu.items.items[2].enable();
                              //scopeConceptoContable.contextMenu.items.items[3].disable();
                          } else {
                              Ext.getCmp('btnAdicionar').disable();
                              Ext.getCmp('btnModificar').enable();
                              Ext.getCmp('btnEliminar').enable();
                              Ext.getCmp('btnFormula').enable();
                              //scopeConceptoContable.contextMenu.items.items[0].disable();
                              //scopeConceptoContable.contextMenu.items.items[1].enable();
                              //scopeConceptoContable.contextMenu.items.items[2].enable();
                              //scopeConceptoContable.contextMenu.items.items[3].enable();
                          }

                      }
                      if(!Ext.getCmp('btnAdicionar').disabled) {
                          Ext.getCmp('btnAdicionar').focus();
                      }
                  },
                  contextmenu: scopeConceptoContable.getTreeContextMenuHandler
              },
              /***   Insertando Nodo Raiz   ***/
              root: new Ext.tree.AsyncTreeNode({
                  text: scopeConceptoContable.etiquetas.lbTreeRoot,
                  draggable: false,
                  expanded: true,
                  id: '0'
              }),
              loader: new Ext.tree.TreeLoader({
                  id: 'tlConceptosC',
                  baseParams: {
                      codigo: '',
                      nombre: ''
                  },
                  dataUrl: 'cargarconceptoscontables',
                  listeners: {
                      beforeLoad: function(treeLoader, node) {
                          if(Ext.getCmp('trpConceptosContables').getRootNode().id == node.id) {
                              Ext.getCmp('trpConceptosContables').getRootNode().getUI().hide();
                          }
                          if(!Ext.getCmp('btnAdicionar').disabled) {
                              Ext.getCmp('btnAdicionar').focus();
                          }
                      },
                      load: function(This, node, response) {
                          if(scopeConceptoContable.recarga)
                              Ext.MessageBox.hide();
                          if(Ext.getCmp('trpConceptosContables').getRootNode().id == node.id) {
                              if(!Ext.getCmp('trpConceptosContables').getRootNode().hasChildNodes()) {
                                  Ext.getCmp('trpConceptosContables').getRootNode().getUI().show();
                              } else {
                                  Ext.getCmp('trpConceptosContables').getRootNode().getUI().show();
                                  if(Ext.getCmp('trpConceptosContables').getLoader().baseParams.opcion != 1) {
                                      Ext.getCmp('trpConceptosContables').getLoader().baseParams = {opcion: 1};
                                  }
                              }
                              Ext.getCmp('btnAdicionar').enable();
                              Ext.getCmp('trpConceptosContables').getRootNode().select();
                          }
                          if(node.hasChildNodes()) {
                              var nodoshijos = node.childNodes;
                              var length = nodoshijos.length;
                              for(var i = 0; i < length; i++) {
                                  if(nodoshijos[i].attributes.configurado == true) {
                                      nodoshijos[i].getUI().addClass('letrazul');
                                  }
                              }
                          }
                          if(!Ext.getCmp('btnAdicionar').disabled) {
                              Ext.getCmp('btnAdicionar').focus();
                          }
                      }
                  }
              })
          });
          scopeConceptoContable.fpConceptoContable = new Ext.FormPanel({
              labelAlign: 'top',
              frame: true,
              autoHeight: true,
              id: 'fpConceptoContable',
              items: [{
                      style: 'margin: 5 0 0 10',
                      layout: 'column',
                      anchor: '100%',
                      items: [{
                              columnWidth: .99,
                              anchor: '99%',
                              layout: 'form',
                              items: [scopeConceptoContable.cbTipoConceptoFin, scopeConceptoContable.tfCodigo, scopeConceptoContable.tfNombre2, scopeConceptoContable.taDescripcion]
                          }]
                  }]
          });
          scopeConceptoContable.fpDetalles = new Ext.FormPanel({
              id: 'fpDetallesInfoNode',
              labelAlign: 'top',
              split: true,
              frame: false,
              autoHeight: true,
              layout: 'form',
              items: [scopeConceptoContable.tfTipoConceptoFin, scopeConceptoContable.tfCodigo2, scopeConceptoContable.tfNombre, scopeConceptoContable.taDescripcion3, scopeConceptoContable.taFormulaCC, scopeConceptoContable.taFormulaID]
          });
          scopeConceptoContable.pRight = new Ext.Panel({
              width: '55%',
              region: 'east',
              frame: true,
              autoScroll: true,
              collapsible: true,
              animCollapse: true,
              hideCollapseTool: true,
              title: scopeConceptoContable.etiquetas.lbTtDetallesCC,
              items: scopeConceptoContable.fpDetalles,
              bodyStyle: 'margin: 0 0 0 15'
          });
          scopeConceptoContable.pMain = new Ext.Panel({
              layout: 'border',
              items: [scopeConceptoContable.trpConceptosC, scopeConceptoContable.pRight],
              keys: scopeConceptoContable.kmTeclasCalientes = new Ext.KeyMap(Ext.getBody(), [{
                      key: 'i',
                      alt: true,
                      fn: function() {
                          if(!scopeConceptoContable.btnAdicionar.disabled)
                              scopeConceptoContable.btnAdicionar.handler.call();
                      }
                  }, {
                      key: 'm',
                      alt: true,
                      fn: function() {
                          if(!scopeConceptoContable.btnModificar.disabled)
                              scopeConceptoContable.btnModificar.handler.call();
                      }
                  }, {
                      key: 'f',
                      alt: true,
                      fn: function() {
                          if(!scopeConceptoContable.btnFormula.disabled)
                              scopeConceptoContable.btnFormula.handler.call();
                      }
                  }, {
                      key: 'h',
                      alt: true,
                      fn: function() {
                          if(!scopeConceptoContable.btnAyuda.hidden)
                              scopeConceptoContable.btnAyuda.handler.call();
                      }
                  }, {
                      key: Ext.EventObject.DELETE,
                      fn: function() {
                          if(!scopeConceptoContable.btnEliminar.disabled)
                              scopeConceptoContable.btnEliminar.handler.call();
                      }
                  }, {
                      key: 'o',
                      alt: true,
                      fn: function() {
                          if(!scopeConceptoContable.mnOperaciones.hidden)
                              scopeConceptoContable.mnOperaciones.handler.call();
                      }
                  }]),
              tbar: [scopeConceptoContable.btnAdicionar, scopeConceptoContable.btnModificar, scopeConceptoContable.btnEliminar, scopeConceptoContable.btnFormula, '->', scopeConceptoContable.btnAyuda],
              listeners: {
                  render: function() {
                      Ext.getCmp('btnAdicionar').focus();
                  }
              }
          });
          scopeConceptoContable.vpMostrar = new Ext.Viewport({
              id: 'vpMostrar',
              layout: 'fit',
              items: scopeConceptoContable.pMain
          });
          scopeConceptoContable.pRight.collapse(true);
      },
      /**
       * Resetear campos con los valores del nodo seleccionado.
       * @property node Nodo seleccionado.
       * @type Function
       */
      fillDetails: function(node) {
          if(node.id == 0) {
              Ext.getCmp('btnAdicionar').enable();
              Ext.getCmp('btnEliminar').disable();
              Ext.getCmp('btnModificar').disable();
              Ext.getCmp('fpDetallesInfoNode').disable();
              scopeConceptoContable.pRight.collapse(true);
          } else {
              Ext.getCmp('fpDetallesInfoNode').enable();
              scopeConceptoContable.tfTipoConceptoFin.setValue(node.attributes['tipoconceptofin']);
              scopeConceptoContable.tfCodigo2.setValue(node.attributes['codigo']);
              scopeConceptoContable.tfNombre.setValue(node.attributes['abreviatura']);
              scopeConceptoContable.taDescripcion3.setValue(node.attributes['descripcion']);
              if(node.attributes.configurado) {
                  scopeConceptoContable.taFormulaCC.setValue(node.attributes.formulad);
                  scopeConceptoContable.taFormulaID.setValue(node.attributes.formulam);
              } else {
                  scopeConceptoContable.taFormulaCC.setValue(scopeConceptoContable.etiquetas.lbNoConfigurado);
                  scopeConceptoContable.taFormulaID.setValue(scopeConceptoContable.etiquetas.lbNoConfigurado);
              }
              scopeConceptoContable.pRight.expand(true);
          }
      },
      /**
       * Limpiar campos despues de aplicar o aceptar los cambios realizados.
       * @property apl Variable que indica si se aplica o acepta los cambios.
       * @type Function
       */
      clearDetails: function(apl) {
          scopeConceptoContable.tfCodigo2.reset();
          scopeConceptoContable.tfNombre.reset();
          scopeConceptoContable.taDescripcion3.reset();
          scopeConceptoContable.taFormulaCC.reset();
          scopeConceptoContable.taFormulaID.reset();
          Ext.getCmp('btnAdicionar').enable();
          Ext.getCmp('btnModificar').disable();
          Ext.getCmp('btnEliminar').disable();
          Ext.getCmp('btnFormula').disable();
          scopeConceptoContable.contextMenu.items.items[0].enable();//Adicionar
          scopeConceptoContable.contextMenu.items.items[1].disable();//Modificar
          scopeConceptoContable.contextMenu.items.items[2].disable();//Eliminar
          scopeConceptoContable.contextMenu.items.items[3].disable();//Asociar
          if(apl) {
              var nodoPadre = scopeConceptoContable.nodoSeleccionado.parentNode;
              scopeConceptoContable.pRight.collapse(true);
              Ext.getCmp('trpConceptosContables').getLoader().load(nodoPadre, function() {
                  nodoPadre.expand();
              });
          }
      },
      /**
       * Adicionar un nuevo concepto contable.
       * @property
       * @type Function
       */
      adicionarConceptoContable: function(apl) {
          scopeConceptoContable.recarga = false;
          if(Ext.getCmp('fpConceptoContable').getForm().isValid() && !(scopeConceptoContable.taDescripcion.getValue() === ' ')) {
              Ext.getCmp('fpConceptoContable').getForm().submit({
                  url: 'adicionarconceptocontable',
                  waitMsg: scopeConceptoContable.etiquetas.lbSaveData,
                  params: {
                      descripcion: scopeConceptoContable.taDescripcion.getValue(),
                      abreviatura: scopeConceptoContable.tfNombre2.getValue(),
                      codigo: scopeConceptoContable.tfCodigo.getValue(),
                      idtipoconceptofin: scopeConceptoContable.cbTipoConceptoFin.getValue(),
                      //idconceptocontablepadre: (scopeConceptoContable.nodoSeleccionado.attributes.id == 0) ? null : scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontable,
                      idconceptocontablepadre: null,
                      nivel: scopeConceptoContable.getNivel()
                  },
                  failure: function(form, action) {
                      responseData = Ext.decode(action.result.codMsg);
                      switch(responseData) {
                          case -1:
                              {
                                  scopeConceptoContable.nodoSeleccionado = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode();
                                  mostrarMensaje(1, scopeConceptoContable.etiquetas.lbInfoAddConcepto);
                                  scopeConceptoContable.nodoSeleccionado.leaf = false;
                                  Ext.getCmp('trpConceptosContables').getLoader().load(scopeConceptoContable.nodoSeleccionado, function() {
                                      Ext.getCmp('trpConceptosContables').expandPath(scopeConceptoContable.nodoSeleccionado.getPath());
                                  });
                                  scopeConceptoContable.clearDetails();
                                  scopeConceptoContable.pRight.collapse(true);
                                  Ext.getCmp('tfCodigo').setValue(scopeConceptoContable.getRandomNumber());
                                  if(!apl) {
                                      Ext.getCmp('winAddConceptoContable').hide();
                                  } else {
                                      scopeConceptoContable.tfNombre2.reset();
                                      scopeConceptoContable.taDescripcion.reset();
                                  }
                              }
                              break;
                          case -2:
                              {
                                  mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorAddConcepto);
                              }
                              break;
                          case -3:
                              {
                                  mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorCamposIncorrectos, Ext.emptyFn());
                              }
                              break;
                          case -4:
                              {
                                  mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorAddConcepto, Ext.emptyFn());
                              }
                              break;
                          default:
                              mostrarMensaje(action.result.codMsg, action.result.mensaje);
                              break;
                      }
                  }
              });
          } else {
              mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorCamposIncorrectos, Ext.emptyFn());
          }
      },
      /**
       * Modificar el concepto contable seleccionado.
       * @property
       * @type Function
       */
      modificarConceptoContable: function() {
          nivel = scopeConceptoContable.getNivel();
          var nodoPadre = scopeConceptoContable.nodoSeleccionado.parentNode;
          scopeConceptoContable.recarga = false;
          if(scopeConceptoContable.nodoSeleccionado.attributes.abreviatura != scopeConceptoContable.tfNombre2.getValue() || scopeConceptoContable.nodoSeleccionado.attributes.codigo != scopeConceptoContable.tfCodigo.getValue() || scopeConceptoContable.nodoSeleccionado.attributes.descripcion != scopeConceptoContable.taDescripcion.getValue() || scopeConceptoContable.nodoSeleccionado.attributes.idtipoconceptofin != scopeConceptoContable.cbTipoConceptoFin.getValue()) {
              if(Ext.getCmp('fpConceptoContable').getForm().isValid() && !(scopeConceptoContable.taDescripcion.getValue() === ' ')) {
                  Ext.getCmp('fpConceptoContable').getForm().submit({
                      url: 'modificarconceptocontable',
                      waitMsg: scopeConceptoContable.etiquetas.lbSaveData,
                      params: {
                          descripcion: scopeConceptoContable.taDescripcion.getValue(),
                          abreviatura: scopeConceptoContable.tfNombre2.getValue(),
                          codigo: scopeConceptoContable.tfCodigo.getValue(),
                          idconceptocontable: scopeConceptoContable.nodoSeleccionado.attributes.idconceptocontable,
                          idtipoconceptofin: scopeConceptoContable.cbTipoConceptoFin.getValue(),
                          idestructurae: scopeConceptoContable.nodoSeleccionado.attributes.idestructurae,
                          configurado: (scopeConceptoContable.nodoSeleccionado.attributes.configurado == true) ? 1 : -1,
                          modificarCod: (scopeConceptoContable.nodoSeleccionado.attributes.codigo != scopeConceptoContable.tfCodigo.getValue()) ? 1 : -1
                      },
                      failure: function(form, action) {
                          responseData = Ext.decode(action.result.codMsg);
                          switch(responseData) {
                              case -1:
                                  {
                                      mostrarMensaje(1, scopeConceptoContable.etiquetas.lbInfoModConcepto);
                                      scopeConceptoContable.clearDetails();
                                      scopeConceptoContable.pRight.collapse(true);
                                      Ext.getCmp('trpConceptosContables').getLoader().load(nodoPadre, function() {
                                          nodoPadre.expand();
                                      });
                                      Ext.getCmp('winModConceptoContable').hide();
                                  }
                                  break;
                              case -2:
                                  {
                                      mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorAddConcepto, Ext.emptyFn());
                                  }
                                  break;
                              case -3:
                                  {
                                      mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorCamposIncorrectos, Ext.emptyFn());
                                  }
                                  break;
                              case -4:
                                  {
                                      mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorModConceptoFormula, Ext.emptyFn());
                                  }
                                  break;
                              default:
                                  mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                  break;
                          }


                      }
                  });

              } else {
                  mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorCamposIncorrectos, Ext.emptyFn());
              }
          } else {
              mostrarMensaje(1, scopeConceptoContable.etiquetas.lbNoChanges, function() {
                  Ext.getCmp('btnAceptarMod').focus();
              });
          }
      },
      /**
       * Eliminar el concepto contable seleccionado.
       * @property
       * @type Function
       */
      eliminarConceptoContable: function() {
          scopeConceptoContable.recarga = false;
          var nodoPadre = scopeConceptoContable.nodoSeleccionado.parentNode;
          var nodoHijoSel = scopeConceptoContable.nodoSeleccionado;
          if(Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode()) {
              var nodoDel = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().id;
              var configuradoNodoDel = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().attributes['configurado'];
              var idformulaNodoDel = (configuradoNodoDel) ? (Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().attributes['idformula']) : -1;
              var nodoDelEntidad = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().attributes.idconceptocontableestructurae;
              var entidadNodoDel = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().attributes['idestructurae'];

              function onbtnAcepto(btn) {
                  if(btn == "ok") {
                      Ext.Msg.wait("Eliminando datos del estado financiero", "Por favor espere...");
                      Ext.Ajax.request({
                          url: 'eliminarconceptocontable',
                          method: 'POST',
                          waitMsg: scopeConceptoContable.etiquetas.lbDelData,
                          params: {
                              idconceptocontable: Ext.encode(nodoDel),
                              idconceptocontableestructurae: Ext.encode(nodoDelEntidad),
                              idformula: Ext.encode(idformulaNodoDel),
                              configurado: Ext.encode(configuradoNodoDel),
                              idestructurae: Ext.encode(entidadNodoDel)
                          },
                          callback: function(options, success, response) {
                              responseData = Ext.decode(response.responseText);
                              Ext.Msg.hide();
                              scopeConceptoContable.kmTeclasCalientes.enable();
                              switch(responseData.codMsg) {
                                  case -1:
                                      {
                                          mostrarMensaje(1, scopeConceptoContable.etiquetas.lbInfoDelConcepto)
                                          scopeConceptoContable.clearDetails();
                                          scopeConceptoContable.pRight.collapse(true);
                                          Ext.getCmp('trpConceptosContables').getLoader().load(nodoPadre, function() {
                                              nodoPadre.expand();
                                          });
                                      }
                                      break;
                                  case -2:
                                      {
                                          mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorDelConcepto);
                                      }
                                      break;
                                  case -3:
                                      {
                                          mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorDelConceptoUso);
                                      }
                                      break;
                                  case -4:
                                      {
                                          mostrarMensaje(1, scopeConceptoContable.etiquetas.lbErrorDelConceptoUso);
                                      }
                                      break;
                                  default:
                                      mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                      break;
                              }
                          }
                      });
                  } else {
                      scopeConceptoContable.kmTeclasCalientes.enable();
                  }

              }

              if(nodoHijoSel.attributes.configurado) {
                  mostrarMensaje(2, scopeConceptoContable.etiquetas.lbPromtDelConceptoFormula, onbtnAcepto);
              } else {
                  mostrarMensaje(2, scopeConceptoContable.etiquetas.lbPromtDelConcepto, onbtnAcepto);
              }
          } else
              mostrarMensaje(1, scopeConceptoContable.etiquetas.lbInfoSelConcepto, Ext.emptyFn());
      },
      /**
       * Verificar si han cambiado los datos del formulario con respecto a los datos de un record del selectionmodel.
       * @property idForm Id del formulario.
       * @property smodel smodel SelectionModel de records.
       * @property decimalPrecision Precision decimal con que trabajar&aacute; los datos numericos. Por defecto 2.
       * @type Function
       */
      isDirtyForm: function(idForm, smodel, decimalPrecision) {
          var objValuesForm = Ext.getCmp(idForm).getForm().getValues(false);
          var smodelData = Ext.getCmp('trpConceptosContables').getSelectionModel().getSelectedNode().attributes;
          decimalPrecision = decimalPrecision || 2;
          var arrValuesForm = new Array();
          for(var name in objValuesForm) {
              arrValuesForm[name] = objValuesForm[name];
          }

          var arrValuesRecord = new Array();
          for(var valueRecord in smodelData) {
              arrValuesRecord[valueRecord] = smodelData[valueRecord];
          }

          for(var propValuesForm in arrValuesForm) {
              for(var propValuesRecord in arrValuesRecord) {
                  if(propValuesForm == propValuesRecord) {
                      var valuef = arrValuesForm[propValuesForm];
                      var valuer = arrValuesRecord[propValuesRecord];
                      if((!isNaN(valuef)) && !isNaN(valuer)) {
                          if(parseFloat(valuef).toFixed(decimalPrecision) != parseFloat(valuer).toFixed(decimalPrecision)) {
                              return true;
                          }
                          if(parseInt(valuef, 10) != (parseInt(valuer, 10))) {
                              return true;
                          }
                      }
                      else {
                          if(valuef != valuer) {
                              return true;
                          }
                      }
                  }
              }
          }
          return false;
      },
      /**
       * Muestra la ventana para adicionar o modificar un concepto contable.
       * @property opcion Ins o Mod para adicionar o modificar respectivamente.
       * @type Function
       */
      winFpRegConceptoContable: function(opcion) {
          Ext.getCmp('tfCodigo').setValue(scopeConceptoContable.getRandomNumber());
          switch(opcion) {
              case 'Ins':
                  {
                      if(!scopeConceptoContable.winAdicionarCC) {
                          scopeConceptoContable.winAdicionarCC = new Ext.Window({
                              modal: true,
                              id: 'winAddConceptoContable',
                              closeAction: 'hide',
                              layout: 'fit',
                              title: scopeConceptoContable.etiquetas.lbTtlAdicionar,
                              width: 550,
                              autoHeight: true,
                              constrain: true,
                              autoValidate: false,
                              defaultButton: 0,
                              keys: new Ext.KeyMap(Ext.getBody(), [{
                                      key: Ext.EventObject.ENTER,
                                      fn: function() {
                                          Ext.getCmp('btnAceptarAdd').handler.call();
                                      },
                                      scope: scopeConceptoContable.winAdicionarCC
                                  }, {
                                      key: Ext.EventObject.TAB, //TAB
                                      fn: function() {
                                          if(document.activeElement.tabIndex == 12)
                                              Ext.getCmp('cbTipoConceptoFin').focus(true, 10);
                                      }
                                  }, {
                                      key: Ext.EventObject.TAB, //SHIFT+TAB
                                      shift: true,
                                      fn: function() {
                                          if(document.activeElement.tabIndex == 6)
                                              Ext.getCmp('btnAceptarAdd').focus();
                                      }
                                  }], "keydown"),
                              listeners: {
                                  render: function() {
                                      Ext.getCmp('tfNombre2').focus(false, 100);
                                  },
                                  show: function() {
                                      Ext.getCmp('tfNombre2').focus(false, 100);
                                  },
                                  hide: function() {
                                      Ext.getCmp('btnAdicionar').focus();
                                      scopeConceptoContable.kmTeclasCalientes.enable();
                                  }
                              },
                              buttons: [{
                                      tabIndex: 10,
                                      id: 'btnCancelarAdd',
                                      iconCls: 'cancelar',
                                      text: scopeConceptoContable.etiquetas.lbBtnCancelar,
                                      tooltip: scopeConceptoContable.etiquetas.lbTtCancelar,
                                      handler: function() {
                                          scopeConceptoContable.winAdicionarCC.hide();
                                      }
                                  }, {
                                      tabIndex: 11,
                                      id: 'btnAplicarAdd',
                                      disabled: true,
                                      iconCls: 'aplicar',
                                      text: scopeConceptoContable.etiquetas.lbBtnAplicar,
                                      tooltip: scopeConceptoContable.etiquetas.lbTtAplicar,
                                      handler: function() {
                                          scopeConceptoContable.adicionarConceptoContable('apl');

                                      }
                                  }, {
                                      tabIndex: 12,
                                      id: 'btnAceptarAdd',
                                      disabled: true,
                                      iconCls: 'aceptar',
                                      text: scopeConceptoContable.etiquetas.lbBtnAceptar,
                                      tooltip: scopeConceptoContable.etiquetas.lbTtAceptar,
                                      handler: function() {
                                          scopeConceptoContable.adicionarConceptoContable();
                                      }
                                  }]
                          });
                      }
                      scopeConceptoContable.fpConceptoContable.getForm().reset();
                      scopeConceptoContable.winAdicionarCC.show();
                      scopeConceptoContable.winAdicionarCC.add(scopeConceptoContable.fpConceptoContable);
                      scopeConceptoContable.winAdicionarCC.doLayout();
                      scopeConceptoContable.winAdicionarCC.center();
                  }
                  break;
              case 'Mod':
                  {
                      if(!scopeConceptoContable.winModificarCC) {
                          scopeConceptoContable.winModificarCC = new Ext.Window({
                              modal: true,
                              id: 'winModConceptoContable',
                              closeAction: 'hide',
                              layout: 'fit',
                              title: scopeConceptoContable.etiquetas.lbTtlModificar,
                              width: 550,
                              autoHeight: true,
                              constrain: true,
                              autoValidate: false,
                              defaultButton: 0,
                              keys: new Ext.KeyMap(Ext.getBody(), [{
                                      key: Ext.EventObject.ENTER,
                                      fn: function() {
                                          Ext.getCmp('btnAceptarMod').handler.call();
                                      },
                                      scope: scopeConceptoContable.winModificarCC
                                  }, {
                                      key: Ext.EventObject.TAB, //TAB
                                      fn: function() {
                                          if(document.activeElement.tabIndex == 11)
                                              Ext.getCmp('cbTipoConceptoFin').focus(true, 10);
                                      }
                                  }, {
                                      key: Ext.EventObject.TAB, //SHIFT+TAB
                                      shift: true,
                                      fn: function() {
                                          if(document.activeElement.tabIndex == 6)
                                              Ext.getCmp('btnAceptarMod').focus();
                                      }
                                  }], "keydown"),
                              listeners: {
                                  hide: function() {
                                      Ext.getCmp('btnAdicionar').focus();
                                      scopeConceptoContable.kmTeclasCalientes.enable();
                                  }
                              },
                              buttons: [{
                                      tabIndex: 10,
                                      iconCls: 'cancelar',
                                      text: scopeConceptoContable.etiquetas.lbBtnCancelar,
                                      tooltip: scopeConceptoContable.etiquetas.lbTtCancelar,
                                      handler: function() {
                                          scopeConceptoContable.winModificarCC.hide();
                                      }
                                  }, {
                                      tabIndex: 11,
                                      id: 'btnAceptarMod',
                                      iconCls: 'aceptar',
                                      text: scopeConceptoContable.etiquetas.lbBtnAceptar,
                                      tooltip: scopeConceptoContable.etiquetas.lbTtAceptar,
                                      handler: function() {
                                          scopeConceptoContable.modificarConceptoContable();
                                      }
                                  }]
                          });
                      }
                      scopeConceptoContable.fpConceptoContable.getForm().reset();
                      scopeConceptoContable.winModificarCC.show();
                      scopeConceptoContable.winModificarCC.add(scopeConceptoContable.fpConceptoContable);
                      scopeConceptoContable.winModificarCC.doLayout();
                      scopeConceptoContable.winModificarCC.center();
                      scopeConceptoContable.fpConceptoContable.getForm().loadRecord(scopeConceptoContable.getNodeInfo());
                  }
                  break;
          }
      },
      /**
       * Obtener el nivel del nodo seleccionado en el &aacute;rbol.
       * @property
       * @return {int} Nivel del nodo seleccionado.
       * @type Function
       */
      getNivel: function() {
		  if(typeof scopeConceptoContable.nodoSeleccionado == 'undefined')
				return 1;
          var idcc = scopeConceptoContable.nodoSeleccionado.attributes.id;
          var idnodocc = Ext.getCmp('trpConceptosContables').getNodeById(idcc);
          if(idnodocc.attributes.id == Ext.getCmp('trpConceptosContables').getRootNode().id) {
              return 1;
          } else {
              return parseInt(idnodocc.attributes.nivel) + 1;
          }
      },
      /**
       * Muestra el men&uacute; de contexto sobre el nodo seleccionado en el &aacute;rbol.
       * @property
       * @type Function
       */
      getTreeContextMenuHandler: function(node) {
          node.select();
          scopeConceptoContable.contextMenu.show(node.ui.getAnchor());
      },
      /**
       * Obtener un record con la informaci&oacute;n del nodo seleccionado en el &aacute;rbol.
       * @property
       * @return {Ext.data.Record} Record con los datos del nodo seleccionado.
       * @type Function
       */
      getNodeInfo: function() {
          return new Ext.data.Record({
              codigo: scopeConceptoContable.nodoSeleccionado.attributes.codigo,
              tfNombre2: scopeConceptoContable.nodoSeleccionado.attributes.abreviatura,
              taDescripcion: scopeConceptoContable.nodoSeleccionado.attributes.descripcion,
              cbTipoConceptoFin: scopeConceptoContable.nodoSeleccionado.attributes.idtipoconceptofin
          });

      }
  });
  new Ext.Confin.Configuracion.ConceptosContables();