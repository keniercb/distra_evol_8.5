  Ext.namespace('Ext.Cont.Class.UI');
  Ext.Cont.Class.UI.TreePanel = Ext.extend(Ext.tree.TreePanel, {
      mask: undefined,
      notification: undefined,
      constructor: function(scopeUIGruposCtas)
      {
          Ext.apply(this, {
              layout: 'fit',
              id: 'tpGruposCtas',
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
              loader: scopeUIGruposCtas.tlGruposCtas = new Ext.tree.TreeLoader({
                  dataUrl: scopeUIGruposCtas.url + "loadDataComponent"
              }),
              root: scopeUIGruposCtas.rnGruposCtas = new Ext.tree.AsyncTreeNode({
                  text: scopeUIGruposCtas.etiquetas.rootText,
                  draggable: false,
                  id: '0',
                  type: 0,
                  expanded: true,
                  icon: scopeUIGruposCtas.perfil.dirImg + 'organigrama/empty.gif',
                  iconCls: scopeUIGruposCtas.perfil.dirImg + 'organigrama/empty.gif'
              }),
              contextMenu: scopeUIGruposCtas.cmGruposCtas = new Ext.menu.Menu({
                  id: 'id-contextMenu1',
                  items: [
                      {
                          iconCls: 'x-menu-item-icon',
                          icon: scopeUIGruposCtas.perfil.dirImg + 'actualizar.png',
                          text: scopeUIGruposCtas.etiquetas.lbActualizar,
                          listeners: {
                              click: function() {
                                  var tree = Ext.getCmp('tpGruposCtas');
                                  tree.body.mask(scopeUIGruposCtas.etiquetas.lbCargando, 'x-mask-loading');
                                  tree.root.collapse(true, false);
                                  tree.root.reload(function() {
                                      tree.body.unmask();
                                  });
                              }
                          }
                      }
                  ]
              }),
              tbar: scopeUIGruposCtas.tbGruposCtas = new Ext.Toolbar({
                  items: [scopeUIGruposCtas.sfBuscarGruposCtas = new Ext.Cont.SearchField({
                          id: 'sfBuscarGruposCtas',
                          regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                          maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                          searchTooltip: scopeUIGruposCtas.etiquetas.lbTtSearch,
                          emptyText: scopeUIGruposCtas.etiquetas.lbCriterioBusq
                      })]
              })
          });
          return Ext.Cont.Class.UI.TreePanel.superclass.constructor.call(this);
      },
      loadMask: function(msg) {
          this.mask = new Ext.LoadMask(this.body, {
              msg: msg
          });
          this.mask.show();
      }
  });


