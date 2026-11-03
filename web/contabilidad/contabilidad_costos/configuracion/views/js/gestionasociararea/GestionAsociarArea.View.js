  Ext.ns('Costo.Procesos.Asociacion.Area');
  Costo.Procesos.Asociacion.Area.View = {
      init: function(perfil, etiquetas, model) {

          /****************Gestionar CCNAE******************/
          this.btnAdicionarCCNAE = new Ext.Button({
              id: 'btnAdic',
              disabled: true,
              iconCls: 'adicionar',
              tooltip: etiquetas.tooltipAdd1,
              text: etiquetas.labelBtnAdd
          });
          this.btnEliminarCCNAE = new Ext.Button({
              disabled: true,
              id: 'btnElim',
              iconCls: 'eliminar',
              tooltip: etiquetas.tooltipDel,
              text: etiquetas.labelBtnDel
          });
          this.btnAyuda = new Ext.Button({
              id: 'btnHelpAsocArea',
              iconCls: 'ayuda',
              tooltip: etiquetas.tooltipBtnAyuda,
              text: etiquetas.lbtnAyuda
          });
          this.smCentrosNae = new Ext.grid.CheckboxSelectionModel({
              singleSelect: false
          });
          this.gridCCNAE = new Ext.grid.GridPanel({
              store: model.stcentronivel,
              sm: this.smCentrosNae,
              loadMask: true,
              frame: true,
              stripeRows: true,
              border: false,
              disabled: true,
              autoExpandColumn: 'descripcion',
              viewConfig: {forceFit: true},
              columns: [
                  this.smCentrosNae,
                  {
                      id: 'idcentro',
                      hidden: true,
                      hideable: false,
                      sortable: true,
                      header: etiquetas.headerId,
                      dataIndex: 'idcentro'
                  }, {
                      id: 'codigo',
                      sortable: true,
                      width: 150,
                      header: etiquetas.headerCode,
                      dataIndex: 'codigo'
                  }, {
                      id: 'descripcion',
                      sortable: true,
                      header: etiquetas.headerDescription,
                      dataIndex: 'text'
                  }],
              tbar: this.searchaCentro = new Ext.Cont.SearchField({
                  validationEvent: false,
                  validateOnBlur: false,
                  width: 350,
                  selectOnFocus: true,
                  searchTooltip: etiquetas.tooltipSearchEnter,
                  regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                  maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                  maxLength: 255,
                  fnOnSearch: function() {
                      this.hasSearch = true;
                      model.stcentronivel.baseParams.filtro = this.getValue();
                      model.stcentronivel.load();
                  },
                  fnOnClear: function() {
                      this.hasSearch = false;
                      model.stcentronivel.baseParams = {};
                      model.stcentronivel.load();
                  }
              }),
              bbar: new Ext.Cont.PagingToolbar({
                  pageSize: 20,
                  displayInfo: true,
                  displayMsg: etiquetas.displayMsg,
                  emptyMsg: etiquetas.emptyMsg,
                  tabIndex: 314,
                  store: model.stcentronivel
              })
          });

          // ***************para el panel cuenta**********************************
          this.btnAdicionarArea = new Ext.Button({
              id: 'btnAdicArea',
              iconCls: 'adicionar',
              tooltip: etiquetas.tooltipAdd,
              text: etiquetas.labelBtnAdd
          });

          this.btnHeredar = new Ext.Button({
              id: 'btnHered',
              iconCls: 'heredar',
              tooltip: etiquetas.tooltipHeredar,
              text: etiquetas.labelBtnHeredar
          });

          this.smAreas = new Ext.grid.RowSelectionModel({
              singleSelect: false
          });
          this.gridAreas = new Ext.grid.GridPanel({
              store: model.storeAreas,
              sm: this.smAreas,
              loadMask: true,
              frame: true,
              stripeRows: true,
              border: false,
              autoExpandColumn: 'descripcion',
              viewConfig: {forceFit: true},
              columns: [
                  {
                      id: 'idarea',
                      hidden: true,
                      hideable: false,
                      sortable: true,
                      header: etiquetas.headerId,
                      dataIndex: 'idarea'
                  }, {
                      id: 'descripcion',
                      sortable: true,
                      header: etiquetas.headerAreas,
                      dataIndex: 'descripcion'
                  }],
              tbar: this.searchaAsoc = new Ext.Cont.SearchField({
                  validationEvent: false,
                  validateOnBlur: false,
                  width: 350,
                  selectOnFocus: true,
                  searchTooltip: etiquetas.tooltipSearchEnter,
                  regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                  maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                  maxLength: 255,
                  fnOnSearch: function() {
                      this.hasSearch = true;
                      model.storeAreas.baseParams.filtro = this.getValue();
                      model.storeAreas.load();
                  },
                  fnOnClear: function() {
                      this.hasSearch = false;
                      model.storeAreas.baseParams = {};
                      model.storeAreas.load();
                  }
              }),
              bbar: new Ext.Cont.PagingToolbar({
                  pageSize: 20,
                  displayInfo: true,
                  displayMsg: etiquetas.displayMsg,
                  emptyMsg: etiquetas.emptyMsg,
                  tabIndex: 314,
                  store: model.storeAreas
              })
          });

          this.pCentros = new Ext.Panel({
              region: 'south',
              collapsed: true,
              collapsible: true,
              title: etiquetas.titlePanel2,
              height: 350,
              margins: '0 3 0 3',
              layout: 'border',
              tbar: [this.btnAdicionarCCNAE, this.btnEliminarCCNAE],
              items: [{
                      region: 'center',
                      layout: 'fit',
                      margins: '0 3 0 0',
                      width: '50%',
                      items: this.gridCCNAE
                  }]
          });

          //****Panel Superior: Asociacion******
          this.panel = new Ext.Panel({
              region: 'center',
              height: 100,
              layout: 'border',
              tbar: [this.btnAdicionarArea, this.btnHeredar, '->', this.btnAyuda],
              items: [{
                      layout: 'fit',
                      region: 'center',
                      margins: '3 3 3 3',
                      items: this.gridAreas
                  }, this.pCentros]
          });

          new Ext.Viewport({
              layout: 'border',
              items: [this.panel]
          });
      },
      CreateWindows: function(model, tipo, etiquetas, tipo1) {
          this.type = tipo;
          this.btnCancelar = new Ext.Button({
              id: 'btnCanc',
              iconCls: 'cancelar',
              tooltip: etiquetas.tooltipBtnCancelar,
              text: etiquetas.labelBtnCancelar
          });
          this.btnAceptar = new Ext.Button({
              id: 'btnAcep',
              disabled: true,
              iconCls: 'aceptar',
              tooltip: etiquetas.tooltipBtnAceptar,
              text: etiquetas.labelBtnAceptar
          });
          this.btnAplicar = new Ext.Button({
              id: 'btnApl',
              disabled: true,
              iconCls: 'aplicar',
              tooltip: etiquetas.tooltipBtnAplicar,
              text: etiquetas.labelBtnAplicar
          });

          //***************Los grid de la ventana winGestAsocia*******************
          this.tLoader = new Ext.tree.TreeLoader({
              url: "cargarAreaResponsabilidad"
          });

          this.rootNode = new Ext.tree.AsyncTreeNode({
              text: etiquetas.rootTextTreePanelAR,
              draggable: false,
              id: '0',
              type: 0,
              expanded: true,
              icon: perfil.dirImg + 'organigrama/empty.gif',
              iconCls: perfil.dirImg + 'organigrama/empty.gif'
          });

          this.treePanelAreas = new Ext.tree.TreePanel({
              layout: 'fit',
              id: 'tpAR',
              rootVisible: true,
              containerScroll: true,
              autoScroll: true,
              ddScroll: true,
              lines: true,
              trackMouseOver: true,
              bodyStyle: 'background-color:#fff;',
              shadow: true,
              animate: true,
              enableDD: false,
              loader: this.tLoader,
              root: this.rootNode
          });

          /** Componente Centro de Costos - NAE */
          this.CCANE = new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
              id: 'ccnae',
              loadHelpersFiles: false,
              typeSelection: 1
          });

          this.pArea = new Ext.Panel({
              title: etiquetas.titlePanel3,
              region: 'west',
              layout: 'fit',
              id: 'idarea',
              items: [this.treePanelAreas]
          });

          this.pCentro = new Ext.Panel({
              title: etiquetas.titlePanel4,
              region: 'center',
              layout: 'fit',
              id: 'idCentro',
              items: [{}]
          });

          //******************Ventana asociar*******************************
          this.winGestAsocia = new Ext.Window({
              title: (tipo1 == 1) ? etiquetas.titleWindows : etiquetas.titleWindowsCentros,
              closeAction: 'close',
              width: '100%',
              height: screen.height - 180,
              layout: 'border',
              constrain: true,
              defaultButton: 0,
              items: (tipo == 1) ? [this.pArea, this.pCentro] : [this.pCentro],
              buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
              listeners: (tipo == 1) ? {
                  resize: function() {
                      Ext.getCmp('idarea').setWidth('50%');
                      Ext.getCmp('idCentro').setWidth('50%');
                  }
              } : {
                  resize: function() {
                      Ext.getCmp('idCentro').setWidth('100%');
                  }
              }

          });

      },
      createWindowsExtend: function(etiquetas) {
          this.btnCancelarExtend = new Ext.Button({
              id: 'btnCancelarExtend',
              iconCls: 'cancelar',
              tooltip: etiquetas.tooltipBtnCancelar,
              text: etiquetas.labelBtnCancelar
          });
          this.btnAceptarExtend = new Ext.Button({
              id: 'btnAceptarExtend',
              disabled: true,
              iconCls: 'aceptar',
              tooltip: etiquetas.tooltipBtnAceptar,
              text: etiquetas.labelBtnAceptar
          });
          this.btnAplicarExtend = new Ext.Button({
              id: 'btnApl',
              disabled: true,
              iconCls: 'aplicar',
              tooltip: etiquetas.tooltipBtnAplicar,
              text: etiquetas.labelBtnAplicar
          });

          //loader de tree talonario
          this.tlAsocPorAreas = new Ext.tree.TreeLoader({
              url: 'getTreeAsociaciones'
          });

          //nodo raiz del tree asociaciones
          this.rootNodeAsocPorAreas = new Ext.tree.AsyncTreeNode({
              text: etiquetas.rootTextTreeHeredar,
              draggable: false,
              id: '0',
              type: 0,
              expanded: true,
              icon: perfil.dirImg + 'organigrama/empty.gif',
              iconCls: perfil.dirImg + 'organigrama/empty.gif'
          });
          this.sfBuscar = new this.SearchField();
          this.toolbar = new Ext.Toolbar({
              items: [this.sfBuscar]
          });

          //tree asocioaciones
          this.tpAsocPorAreas = new Ext.tree.TreePanel({
              autoScroll: true,
              border: false,
              rootVisible: true,
              root: this.rootNodeAsocPorAreas,
              loader: this.tlAsocPorAreas,
              lines: true,
              trackMouseOver: true,
              shadow: true,
              animate: true,
              tbar: this.toolbar
          });

          this.menu = new Ext.menu.Menu({
              floating: false,
              shadow: true,
              hideBorders: true
          });

          this.miMarcar = new Ext.menu.Item({
              text: etiquetas.titleMarcar,
              iconCls: 'siguiente'
          });

          this.miDesmarcar = new Ext.menu.Item({
              text: etiquetas.titleDesmarcar,
              iconCls: 'anterior'
          });

          this.ventanaExtend = new Ext.Window({
              title: etiquetas.titleWindowsSearchHeredar,
              id: 'ventanaExtend',
              modal: true,
              resizable: false,
              layout: 'fit',
              closeAction: 'close',
              constrain: true,
              defaultButton: 0,
              items: [this.tpAsocPorAreas],
              buttons: [this.btnCancelarExtend, this.btnAplicarExtend, this.btnAceptarExtend]
          });
      },
      SearchField: Ext.extend(Ext.form.TwinTriggerField, {
          validationEvent: false,
          validateOnBlur: false,
          selectOnFocus: true,
          id: 'myedit',
          trigger1Class: 'x-form-clear-trigger',
          trigger2Class: 'x-form-search-trigger',
          hideTrigger1: true
      })
  };
//Inicializando la vista.
  Ext.QuickTips.init();
  var perfil = window.parent.perfil
  perfil.etiquetas = Object();
//var etiquetas = Object();

  Ext.Ajax.request({
      method: "POST",
      url: "cargaretiquetas",
      callback: function(options, success, response) {
          var etiquetas = Ext.decode(response.responseText);
          //Inicializar el modelo
          var model = Costo.Procesos.Asociacion.Area.Model;
          model.init();

          //Inicializar la vista.
          var view = Costo.Procesos.Asociacion.Area.View;
          view.init(perfil, etiquetas, model);

          //Inicializar controlador.
          var controller = Costo.Procesos.Asociacion.Area.Controller;
          controller.init(perfil, etiquetas, view, model);
      }
  });
