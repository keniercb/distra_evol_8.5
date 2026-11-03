  /**
   * Componente comun con escuchas de eventos para arboles. Se crea un menu de contexto o se adiciona un item si ya existe el menu.
   * Ejemplo para su uso:
   * Via 1: new Ext.Cont.TreePanelListeners.CmpListeners(trpArbolCuentas); //crea un menu de contexto, con el item Actualizar
   * Via 2: new Ext.Cont.TreePanelListeners.CmpListeners(trpArbolCuentas, cmMenuOperaciones); //adiciona el item Actualizar al menu cmMenuOperaciones
   * OJO: Deben incluir siempre la etiqueta lbActualizar en el JSON del cual se hace la llamada, por defecto se carga en espanol.
   *
   * @author Ing. Miguel Diaz Riveaux.
   * @package ERP Cuba.
   * @subpackage Contabilidad y Finanzas.
   * @copyright XETID.
   * @version 1.0
   */
  Ext.namespace('Ext.Cont.TreePanelListeners');
  Ext.Cont.TreePanelListeners.CmpListeners = Ext.extend(Ext.Component, {
      constructor: function(xTreePanel, xContextMenu) {
          Ext.QuickTips.init();
          scopeTreePanelListener = this;
          Ext.Cont.TreePanelListeners.CmpListeners.superclass.constructor.call(this);
          this.initEvents(xTreePanel, xContextMenu);
      },
      initEvents: function(xtreepanel, xContextMenu) {
          if(xtreepanel) {
              if(xContextMenu) {
                  scopeTreePanelListener.xcontextMenu = new Ext.menu.Item({
                      id: 'xcontextMenu',
                      iconCls: 'actualizar',
                      text: 'Actualizar',
                      handler: function() {
                          scopeTreePanelListener.refreshTree(xtreepanel, xtreepanel.getRootNode(), false, xtreepanel.getSelectionModel().getSelectedNode().getPath());
                      }
                  });
                  xContextMenu.addMenuItem(scopeTreePanelListener.xcontextMenu);
              } else {
                  xtreepanel.on({
                      contextmenu: function(n, e) {
                          scopeTreePanelListener.contextMenu = new Ext.menu.Menu({
                              items: [{
                                      id: 'xcontextMenu',
                                      iconCls: 'actualizar',
                                      text: 'Actualizar',
                                      handler: function() {
                                          scopeTreePanelListener.refreshTree(xtreepanel, xtreepanel.getRootNode(), false, n.getPath());
                                      }
                                  }]
                          });
                          scopeTreePanelListener.contextMenu.showAt(e.getXY());
                      }
                  });
              }
          }
      },
      refreshTree: function(xtree, xnode, xfather, xpath) {
          xtree.body.mask('Cargando...', 'x-mask-loading');
          nodeSel = ( xnode.leaf && xfather ) ? xnode.parentNode : xnode;
          xtree.getLoader().load(nodeSel, function() {
              if(xpath.length > 0)
                  xtree.expandPath(xpath);
              else
                  nodeSel.expand();
              xtree.body.unmask();
          });
      }

  });
