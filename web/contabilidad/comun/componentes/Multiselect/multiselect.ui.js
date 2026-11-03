  Ext.namespace('Ext.aux');
  Ext.aux.UIMultiselect = Ext.extend(Ext.form.FormPanel, {
      mask: undefined,
      notification: undefined,
      constructor: function(scope)
      {
          scope.stLeftGrid = new Ext.data.Store({
              url: scope.url,
              reader: new Ext.data.JsonReader({
                  id: 'reader',
                  root: 'data'
              }, [{
                      name: scope.valueField
                  }, {
                      name: scope.displayField
                  }
              ])
          });

          scope.stRightGrid = new Ext.data.Store({
              reader: new Ext.data.JsonReader({
                  id: 'reader',
                  root: 'data'
              }, [{
                      name: scope.valueField
                  }, {
                      name: scope.displayField
                  }
              ])
          });
          scope.tfSearchLeftGrid = new Ext.form.TextField({
              emptyText: scope.etiquetas.lbBuscar + '...',
              id: 'tfSearchLeftGrid',
              enableKeyEvents: true,
              disabled: true
          });
          scope.tfSearchRightGrid = new Ext.form.TextField({
              emptyText: scope.etiquetas.lbBuscar + '...',
              id: 'tfSearchRightGrid',
              enableKeyEvents: true,
              disabled: true
          });
          scope.btnAgregarTodos = new Ext.Toolbar.Button({
              text: scope.etiquetas.lbAddAll,
              tooltip: scope.etiquetas.tooltipAddAll,
              iconCls: 'adicionar',
              style: 'margin:0 15 0 0',
              scope: scope
          });
          scope.btnRemoveTodos = new Ext.Toolbar.Button({
              text: scope.etiquetas.lbRemoveAll,
              tooltip: scope.etiquetas.tooltipRemoveAll,
              iconCls: 'eliminar',
              style: 'margin:0 15 0 0',
              scope: scope
          });
          scope.lbdisponibles = new Ext.Toolbar.TextItem({
              text: scope.etiquetas.lbCantDisponibles.replace('<#>', '0'),
              style: 'margin:0 0 0 20'
          });
          scope.lbseleccionados = new Ext.Toolbar.TextItem({
              text: scope.etiquetas.lbCantSeleccionados.replace('<#>', '0'),
              style: 'margin:0 0 0 20'
          });
          scope.smLeftGrid = new Ext.grid.RowSelectionModel({
              singleSelect: scope.singleSelect
          });
          scope.smRightGrid = new Ext.grid.RowSelectionModel({
              singleSelect: scope.singleSelect
          });
          scope.leftColModel = new Ext.grid.ColumnModel([
              {id: 'id', hidden: true, header: '', hideable: false, dataIndex: scope.valueField},
              {id: 'descripcion', header: '', sortable: true, dataIndex: scope.displayField},
              {hideable: false, menuDisabled: true, id: 'action', header: "", width: 8, align: 'center', renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                      return scope.createActionColumn(value, metadata, record, rowIndex, colIndex, store);
                  }}
          ]);
          scope.leftGrid = new Ext.grid.GridPanel({
              id: 'leftGrid',
              enableDragDrop: true,
              ddText: "{0} fila(s) seleccionada(s)",
              ddGroup: 'leftGridDDGroup',
              autoScroll: true,
              frame: false,
              region: 'center',
              loadMask: true,
              border: false,
              height: scope.height,
              //width: 500,
              width: Ext.lib.Dom.getViewWidth() / 2 - 10,
              sm: scope.smLeftGrid,
              store: scope.stLeftGrid,
              viewConfig: {
                  forceFit: true
              },
              cm: scope.leftColModel,
              tbar: scope.leftbar = new Ext.Toolbar({
                  items: [scope.tfSearchLeftGrid, '-', scope.lbdisponibles, '->', scope.btnAgregarTodos]
              })
          });
          scope.rightColModel = new Ext.grid.ColumnModel([
              {id: 'id', hidden: true, header: '', hideable: false, dataIndex: scope.valueField},
              {id: 'descripcion', header: '', sortable: true, dataIndex: scope.displayField},
              {hideable: false, menuDisabled: true, id: 'action', header: "", width: 8, align: 'center', renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                      return scope.createDelActionColumn(value, metadata, record, rowIndex, colIndex, store);
                  }}
          ]);
          scope.rightGrid = new Ext.grid.GridPanel({
              id: 'rightGrid',
              enableDragDrop: true,
              ddText: "{0} fila(s) seleccionada(s)",
              ddGroup: 'rightGridDDGroup',
              autoScroll: true,
              frame: false,
              region: 'east',
              border: false,
              //width: 500,
              width: Ext.lib.Dom.getViewWidth() / 2 - 10,
              height: scope.height,
              sm: scope.smRightGrid,
              store: scope.stRightGrid,
              viewConfig: {
                  forceFit: true
              },
              cm: scope.rightColModel,
              tbar: scope.rightbar = new Ext.Toolbar({
                  items: [scope.tfSearchRightGrid, '-', scope.lbseleccionados, '->', scope.btnRemoveTodos]
              })
          });
          /*-----------------------------------------------------------------------------------*/

          Ext.apply(this, {
              frame: true,
              border: false,
              //id: 'fpTraspDuo',
              layout: 'border',
              region: 'center',
              labelAlign: 'left',
              items: [scope.leftGrid]/*[{
               id: 'pDown',
               region: 'center',
               layout: 'border',
               style: 'margin:20 5 0 5',
               border: true,
               items: [{
               layout: 'fit',
               region: 'center',
               items: [scope.leftGrid]
               }, {
               layout: 'fit',
               region: 'east',
               style: 'margin:0 0 0 5',
               items: [scope.rightGrid]
               }]
               }]*/
          });
          return Ext.aux.UIMultiselect.superclass.constructor.call(this);
      },
      loadMask: function(msg)
      {
          this.mask = new Ext.LoadMask(this.body, {
              msg: msg
          });
          this.mask.show();
      },
      notifyEvent: function(animateTarget, title, msg)
      {
          this.notification = new Ext.ux.Notification(
                  {
                      animateTarget: animateTarget,
                      fnc: Ext.emptyFn,
                      iconbox: 1,
                      iconCls: "icon-waiting",
                      title: title,
                      html: msg
                  });
          this.notification.box();
      }
  });


