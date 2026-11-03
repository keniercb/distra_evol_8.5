Ext.ns("Ext.erp");
Ext.erp.configuraciondelcodigo = Ext.extend(LOG.util.Panel, {
  constructor: function (config) {
    var _this = this;
    this.frame = true;
    this.doFocus = true;
    this.layout = "border";
    var cmpBalanceo = new Ext.erp.configuraciondelcodigoCmp({
      busquedaAvanzada: false,
      idioma: {},
    });
    cmpBalanceo.init();
    let cmp = cmpBalanceo.view();
    _this.items = [cmp];
    Ext.erp.configuraciondelcodigo.superclass.constructor.call(_this, config);
   
  },
  
});

Ext.erp.configuraciondelcodigoCmp = Ext.extend(LOG.util.UITemplate, {  
  autoSelect: false,
  autoLoad: false,
  parametros: undefined,
  constructor: function (config) {
    this.formaVisualizacion = "panel";
    this.modoSeleccion = 2;
    this.gridEditable = true;
    this.busquedaBasica = false;
    this.panelBotonesVisible = true;
    this.autoShow = false;
    this.concepto = config.idioma.lbconcepto;
    this.urlBusquedaGridPrincipal = "getcargarcodigodeoperaciones";
    this.autoLoad = true;
    this.dirController =
      "/logistica/distribucion/configuracion/index.php/configuraciondelcodigo";
    this.parametros = {
      start: 0,
      limit: 30,
    };
    this.postActions = config.postActions;
    Ext.erp.configuraciondelcodigoCmp.superclass.constructor.call(this, config);
    
  },
  initDefaultColumns: function () {
    var _this = this;

    this.addGridColumn({
      header: "Denominación ",
      dataIndex: "denominacion",
      width: 300,
      align: "center",
      type: "",
     
    });
    var _this = this;
    var editorCodigo = new LOG.util.ComboBox({
      name : 'codigooperacion' ,
      autoLoad: true,
       url : '/logistica/distribucion/configuracion/index.php/configuraciondelcodigo/getcargarcodigo',
      displayField : 'codigooperacion',
      valueField : 'codigooperacion',
      queryParam:'criterio',
      mode:'remote',
      minChars:1,
      resizable:true,
      listeners:{
        select:function(combo,rec){
        
    var entSelecionadas = _this
    .getGridPrincipal()
    .getSelectionModel()
    .getSelections();
     var idnomoperaciones = entSelecionadas[0].json.idnomoperaciones
     Ext.MessageBox.wait( "Por favor espere...");
        //console.log(codigocm );
        Ext.Ajax.request({
          url: '/logistica/distribucion/configuracion/index.php/configuraciondelcodigo/actualizarcodigo',
          method: 'POST',
          params:{
            idnomoperaciones: idnomoperaciones,
            codigooperacion: rec.data.codigooperacion
          }, 
          callback: function (options, success, response) {
              Ext.MessageBox.hide();
              var rd = Ext.decode(response.responseText);
              if (rd.codigoMsg == 1) {
                  mostrarMensaje(1, "El codigo a sido modificado satisfactoriamente..");
                  _this.getStorePrincipal().load();//griPrincipal.getStore().load();
              }  else if (rd.codigoMsg == 3) {
                  mostrarMensaje(3, "El codigo no sufrio ningun cambio.");
              } 
             
          }
      });  
    _this.getGridPrincipal().getView().refresh();
          }
      }
  });
 editorCodigo.store.on({
      'load': function (st) {
              if (_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.codigooperacion) {
                editorCodigo.setValue(_this.getSmPrincipal().getSelected().data.codigooperacion);
              }
      }
  });

    this.addGridColumn({
      header: "Código de la operación",
      dataIndex: "codigooperacion",
      id: 'codigooperacion',
      width: 180,
      default: true,
      align: 'center',
      editable:true,
      editor: editorCodigo,
    });
      
    this.addGridColumn({ dataIndex: "denominacion" });
    this.addGridColumn({ dataIndex: "codigooperacion" });
  },

  initDefaultButtons: function () { 
    var _this = this;
    _this.addToolbarButton(
      LOG.util.Prototipos.botonEliminar({
        hidden: false,
        disabled: false,
        handler: function() {
          mostrarMensaje(2, "Está seguro que desea eliminar el(los) códigos seleccionado(s)", function(btn) {
              if (btn == 'ok') {

                  Ext.MessageBox.wait( "Por favor espere...");
                  var entSelecionadas = _this
                  .getGridPrincipal()
                  .getSelectionModel()
                  .getSelections();
                   var idnomoperaciones = entSelecionadas[0].json.idnomoperaciones
                  Ext.Ajax.request({
                      url: '/logistica/distribucion/configuracion/index.php/configuraciondelcodigo/eliminarcodigo',
                      method: 'POST',
                      params: {

                         idnomoperaciones: idnomoperaciones,
                         codigooperacion:_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.codigooperacion
                      },
                      callback: function(options, success, response) {
                          Ext.MessageBox.hide();
                          var rd = Ext.decode(response.responseText);
                          if (rd.codigoMsg == 1) {
                              mostrarMensaje(1,"Los datos fueron eliminados sastifactoriamente");
                              _this.getStorePrincipal().load();
                          } else if  (rd.codigoMsg == 2)  {
                               mostrarMensaje(2,"Los datos no fueron eliminados");
                           }
                      }
                  });
              }
          })
      }
      })
    );
   
    
  },
  
  init: function () {
    var _this = this;
    Ext.erp.configuraciondelcodigoCmp.superclass.init.call(this);
   
    LOG.util.UIManager.apply(this.getVistaPrincipal(), {
      onShow: function () {
        LOG.util.UIManager.apply(
          _this.getStorePrincipal().initBaseParams,
          _this.parametros
        );
        _this.onShowHandler();
      },
      aceptarFn: function (aplicar) {
        if (typeof _this.doAction == "function") {
          _this.doAction
            .createDelegate(_this, [
              _this.getStorePrincipal().getModifiedRecords(),
              aplicar,
            ])
            .call();
        }
      },
    });

    this.panelGrid = LOG.util.UIManager.initFocusPanel({
      region: "center",
      layout: "border",
    });
    
  },
  onShowHandler: function () {
    LOG.util.UIManager.apply(
      this.getStorePrincipal().initBaseParams,
      this.parametros
    );
    this.getStorePrincipal().reload();
  },

 

  postSalvar: function (r, a, _idselecc) {
    this.postActions();
  },
  
});




