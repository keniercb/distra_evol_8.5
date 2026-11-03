
  Ext.namespace('Ext.Cont.UIconceptosFormulas');
  Ext.Cont.UIconceptosFormulas = Ext.extend(Ext.tree.TreePanel, {
      mask: undefined,
      notification: undefined,
      constructor: function(scopeFormulas) {
          Ext.apply(this, {
              layout: 'fit',
              id: 'tpconform',
              rootVisible: true,
              containerScroll: true,
              autoScroll: true,
              ddScroll: true,
              lines: true,
              trackMouseOver: true,
              shadow: true,
              animate: true,
              enableDD: true,
              ddGroup: 'treeDDGroup',
              loader: scopeFormulas.tlConceptosFormulas = new Ext.tree.TreeLoader({
                  dataUrl: scopeFormulas.url + 'obtenerconceptosformulas'
              }),
              root: scopeFormulas.rnConceptosFormulas = new Ext.tree.AsyncTreeNode({
                  id: '0',
                  expanded: true,
                  draggable: false,
                  text: scopeFormulas.etiquetas.lbRootText,
                  icon: scopeFormulas.perfil.dirImg + 'organigrama/empty.gif',
                  iconCls: scopeFormulas.perfil.dirImg + 'organigrama/empty.gif'
              }),
              contextMenu: scopeFormulas.cmConceptosFormulas = new Ext.menu.Menu({
                  id: 'id-contextMenu2',
                  items: [{
                          iconCls: 'actualizar',
                          text: scopeFormulas.etiquetas.lbActualizar,
                          listeners: {
                              click: function() {
                                  var tree = Ext.getCmp('tpconform');
                                  tree.body.mask(scopeFormulas.perfil.etiquetas.lbCargando, 'x-mask-loading');
                                  tree.root.collapse(true, false);
                                  tree.root.reload(function() {
                                      tree.body.unmask();
                                  });
                              }
                          }
                      }]
              }),
              tbar: scopeFormulas.tbConceptosFormulas = new Ext.Toolbar({
                  items: [scopeFormulas.sfBuscarConceptosFormulas = new Ext.Cont.SearchField({
                          id: 'sfBuscarConceptosFormulas',
                          regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                          maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                          searchTooltip: scopeFormulas.etiquetas.lbTtSearch,
                          emptyText: scopeFormulas.etiquetas.lbCriterioBusq
                      })]
              })
          });
          return Ext.Cont.UIconceptosFormulas.superclass.constructor.call(this);
      },
      loadMask: function(msg) {
          this.mask = new Ext.LoadMask(this.body, {
              msg: msg || scopeFormulas.etiquetas.lbCargando
          });
          this.mask.show();
      }
      /*,
       aqui va ... : function(animateTarget, title, msg, icon, time, callback) {
       var notification = new Ext.Cont.Notification({
       animateTarget: animateTarget,
       fnc: ( callback ) ? callback : Ext.emptyFn,
       iconbox: icon,
       iconCls: "icon-waiting",
       title: title,
       html: msg,
       hideDelay: ( time ) ? time : 5000
       });
       notification.box();
       }*/
  });
