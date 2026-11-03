Ext.namespace('Ext.Cont.Class');
  Ext.Cont.Class.GruposCtas = Ext.extend(Ext.util.Observable, {
      url: '/contabilidad/contabilidad_financiera/cuentacontable/index.php/gruposctas/',
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: window.parent.UCID.portal.perfil.etiquetas,
      tpGruposCtas: undefined,
    hasSearch: false,
    busyRequest: false,
    constructor: function() {
        this.addEvents('initialize');
          scopeGruposCtas = this;
        Ext.Ajax.request({
            method: "POST",
            url: this.url + "cargaretiquetas",
            callback: function(options, success, response) {
                if (!document.getElementById('Notification')) {
                      scopeGruposCtas.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
                }
                  Ext.Cont.Class.GruposCtas.superclass.constructor(this);
                  scopeGruposCtas.etiquetas = Ext.decode(response.responseText);
                  scopeGruposCtas.tpGruposCtas = new Ext.Cont.Class.UI.TreePanel(scopeGruposCtas);
                  scopeGruposCtas.initializeEvents();
                  scopeGruposCtas.initializeFunctions();
                  scopeGruposCtas.fireEvent('initialize', scopeGruposCtas.tpGruposCtas);
            }
        });
    },
    loadJs: function(jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    initializeEvents: function() {
          scopeGruposCtas.tpGruposCtas.on({
            afterlayout: function(c) {
                  Ext.getCmp('sfBuscarGruposCtas').setWidth(scopeGruposCtas.tbGruposCtas.el.getWidth() - 4);
            },
            contextmenu: function(node, e) {
                node.select();
                var c = node.getOwnerTree().contextMenu;
                c.contextNode = node;
                c.showAt(e.getXY());
            }
        });

          scopeGruposCtas.tlGruposCtas.on({
            beforeLoad: function(object, node, callback) {
                  scopeGruposCtas.tpGruposCtas.body.mask(scopeGruposCtas.etiquetas.lbCargandoConceptos, 'x-mask-loading');
                this.baseParams.type = node.attributes.type;
                  scopeGruposCtas.busyRequest = true;
                callback = function() {
                      scopeGruposCtas.tpGruposCtas.body.unmask();
                };
            },
            load: function(tree, node, response) {
                  scopeGruposCtas.tpGruposCtas.body.mask(scopeGruposCtas.etiquetas.lbCargandoConceptos, 'x-mask-loading');
                  scopeGruposCtas.busyRequest = false;
                this.baseParams = {};
                  if(!scopeGruposCtas.rnGruposCtas.hasChildNodes()) {
                      mostrarMensaje(1, scopeGruposCtas.etiquetas.MsgInformacionSinResultado);
                      //scopeGruposCtas.tpGruposCtas.aqui va ..(scopeGruposCtas.tpGruposCtas.el.dom, scopeGruposCtas.etiquetas.titleMsgInformacion, scopeGruposCtas.etiquetas.MsgInformacionSinResultado, 1, 3000);
                }
                if (response) {
                      scopeGruposCtas.tpGruposCtas.body.unmask();
                }
            }
        });

//          Ext.getCmp('sfBuscarGruposCtas').on({
//              specialkey: function(f, e) {
//                  if(e.getKey() == e.ENTER) {
//                      Ext.getCmp('sfBuscarGruposCtas').fnOnSearch.call();
//                  }
//              }
//          });

    },
    initializeFunctions: function() {
          Ext.getCmp('sfBuscarGruposCtas').fnOnClear = function() {
              if(!scopeGruposCtas.busyRequest)
                  scopeGruposCtas.fnCargarGruposCtas();
        };
          Ext.getCmp('sfBuscarGruposCtas').fnOnSearch = function() {
              if(!scopeGruposCtas.busyRequest)
                  scopeGruposCtas.fnBuscarGruposCtas(Ext.getCmp('sfBuscarGruposCtas').getRawValue());
        };

          this.fnBuscarGruposCtas = function(filter) {
              scopeGruposCtas.tlGruposCtas.baseParams.filter = filter;
              scopeGruposCtas.fnCargarGruposCtas();
        };

          this.fnCargarGruposCtas = function() {
              scopeGruposCtas.tpGruposCtas.loadMask(scopeGruposCtas.etiquetas.msgFiltrando);
              scopeGruposCtas.tlGruposCtas.load(scopeGruposCtas.rnGruposCtas, function() {
                  scopeGruposCtas.tpGruposCtas.mask.hide();
                  scopeGruposCtas.rnGruposCtas.expand();
                  Ext.getCmp('sfBuscarGruposCtas').focus(true);
            });
        };
    }
});

