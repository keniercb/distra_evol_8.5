
  Ext.namespace('Ext.Cont.ClassconceptosFormulas');
  Ext.Cont.ClassconceptosFormulas = Ext.extend(Ext.util.Observable, {
      url: '/contabilidad/contabilidad_financiera/reportes/index.php/conceptosformulas/',
      perfil: window.parent.UCID.portal.perfil,
      etiquetas: window.parent.UCID.portal.perfil.etiquetas,
      tpConceptosFormulas: undefined,
      hasSearch: false,
      busyRequest: false,
      constructor: function() {
          this.addEvents('initialize');
          scopeFormulas = this;
          Ext.Ajax.request({
              method: "POST",
              url: this.url + "cargaretiquetas",
              callback: function(options, success, response) {
                  if(!document.getElementById('Notification')) {
                      scopeFormulas.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
                  }
                  Ext.Cont.ClassconceptosFormulas.superclass.constructor(this);
                  scopeFormulas.etiquetas = Ext.decode(response.responseText);
                  scopeFormulas.tpConceptosFormulas = new Ext.Cont.UIconceptosFormulas(scopeFormulas);
                  scopeFormulas.initializeEvents();
                  scopeFormulas.initializeFunctions();
                  scopeFormulas.fireEvent('initialize', scopeFormulas.tpConceptosFormulas);
              }
          });

      },
      loadJs: function(jsSrc, id) {
          if(jsSrc != null) {
              var tagScript = document.createElement("script");
              tagScript.setAttribute("type", "text/javascript");
              tagScript.setAttribute("id", id);
              tagScript.setAttribute("src", jsSrc + ".js");
              document.getElementsByTagName("body")[0].appendChild(tagScript);
          }
      },
      initializeEvents: function() {
          scopeFormulas.tpConceptosFormulas.on({
              afterlayout: function(c) {
                  Ext.getCmp('sfBuscarConceptosFormulas').setWidth(scopeFormulas.tbConceptosFormulas.el.getWidth() - 4);
              },
              contextmenu: function(node, e) {
                  node.select();
                  var c = node.getOwnerTree().contextMenu;
                  c.contextNode = node;
                  c.showAt(e.getXY());
              }
          });

          scopeFormulas.tlConceptosFormulas.on({
              beforeLoad: function(object, node, callback) {
                  scopeFormulas.tpConceptosFormulas.body.mask(scopeFormulas.etiquetas.lbCargando, 'x-mask-loading');
                  scopeFormulas.busyRequest = true;
                  if(scopeFormulas.rnConceptosFormulas.id == node.id)
                      scopeFormulas.rnConceptosFormulas.getUI().hide();
                  if(node.attributes.tipo) {
                      this.baseParams.tipo = node.attributes.tipo;
                  } else {
                      this.baseParams.tipo = false;
                  }
                  callback = function() {
                      Ext.getCmp('tpconform').body.unmask();
                  };
              },
              load: function(tree, node, response) {
                  scopeFormulas.tpConceptosFormulas.body.mask(scopeFormulas.etiquetas.lbCargando, 'x-mask-loading');
                  scopeFormulas.busyRequest = false;
                  this.baseParams = {};
                  if(scopeFormulas.rnConceptosFormulas.id == node.id) {
                      if(!scopeFormulas.rnConceptosFormulas.hasChildNodes()) {
                          mostrarMensaje(1, scopeFormulas.etiquetas.lbNoResults);
                          //scopeFormulas.tpConceptosFormulas.aqui va el ...(scopeFormulas.tpConceptosFormulas.el.dom, scopeFormulas.etiquetas.lbTtlInfo, scopeFormulas.etiquetas.lbNoResults, 1, 3000);
                          scopeFormulas.rnConceptosFormulas.getUI().show();
                      } else {
                          scopeFormulas.rnConceptosFormulas.getUI().show();
                          if(this.baseParams.opcion != 1)
                              this.baseParams = {
                                  opcion: 1
                              };
                      }
                  }
                  if(response)
                      Ext.getCmp('tpconform').body.unmask();
              }
          });
      },
      initializeFunctions: function() {
          Ext.getCmp('sfBuscarConceptosFormulas').fnOnClear = function() {
              if(!scopeFormulas.busyRequest)
                  scopeFormulas.fnCargarConceptosFormulas();
          };
          Ext.getCmp('sfBuscarConceptosFormulas').fnOnSearch = function() {
              if(!scopeFormulas.busyRequest)
                  scopeFormulas.fnBuscarConceptosFormulas(Ext.getCmp('sfBuscarConceptosFormulas').getRawValue());
          };

          this.fnBuscarConceptosFormulas = function(filter) {
              scopeFormulas.tlConceptosFormulas.baseParams.filter = filter;
              scopeFormulas.fnCargarConceptosFormulas();
          };

          this.fnCargarConceptosFormulas = function() {
              scopeFormulas.tpConceptosFormulas.loadMask(scopeFormulas.etiquetas.lbFiltrando);
              scopeFormulas.tlConceptosFormulas.load(scopeFormulas.rnConceptosFormulas, function() {
                  scopeFormulas.tpConceptosFormulas.mask.hide();
                  scopeFormulas.rnConceptosFormulas.expand();
                  Ext.getCmp('sfBuscarConceptosFormulas').focus(true);
              });
          };
      }
  });

