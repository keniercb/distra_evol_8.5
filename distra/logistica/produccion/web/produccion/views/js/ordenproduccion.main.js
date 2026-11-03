UCID.portal.cargarAcciones(window.frameElement.id, function () {
     

var orden = new LOG.produccion.ordenproduccion.View({
    acciones: acciones_reportes,
    busquedaAvanzada: true,
    idioma: LOG.util.UIManager.apply(LOG.produccion.ordenproduccion.Idioma, LOG.util.Idioma)
});

orden.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
    columnas : 3,
    firmas: [
        'solicitadopor',
        'aprobadopor',
        'recibido'
    ]
}));

orden.init();
orden.getPanelBusqueda().setColumns(1);

var cls = LOG.util.UIManager.initColumnForm({
    columnas: 2
});

orden.addFilterComponent(new LOG.util.ComboBox({
    fieldLabel: orden.idioma.lbCbEstado,
    hiddenName: 'estado',
    valueField: 'idestado',
    displayField: 'estado',
    triggerAction: 'all',
    editable: false,
    mode: 'local',
    store: new Ext.data.SimpleStore({
        fields: ['idestado', 'estado'],
        data: [
            [1, LOG.lb.documento.Estado[1]],
            [2, LOG.lb.documento.Estado[2]],
            [3, LOG.lb.documento.Estado[3]],
            [5, LOG.lb.documento.Estado[5]],
            [7, LOG.lb.documento.Estado[7]],
            [9, LOG.lb.documento.Estado[9]]
           

        ]
    })
}));

cls.addComponent(new LOG.util.ComboBox({
            url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
            valueField:'idnomconcepto',
            hiddenName: 'idnomconcepto',
            displayField:'denominacion',
            baseParams:{
                modelo: 'NomConcepto',
                idnom: 'idnomconcepto',
            },
            fieldLabel: 'Concepto',
            emptyText: 'Seleccione',            
            autoLoad: true,
            pageSize: 20,
            campo: true,
            mode: 'local',
            forceSelection: true
        }));

        
cls.addComponent(new LOG.util.ComboBox({
        name: 'idcartatecnologica',
              fieldLabel: 'Carta tecnológica',
              hiddenName: 'idcartatecnologica',
              displayField: 'denominacionindicador',
              valueField: 'idcartatecindustrial',
              autoLoad: true,
              pageSize: 20,
              //allowBlank: false,
              editable:false,
              campo: true,
              itemSelector: 'div.search-item',
              tpl:new Ext.XTemplate(
                  '<tpl for="."><div class="search-item">',
                  '{denominacionindicador}: ({denominacion})',
                  '</div></tpl>'
              ),
              mode: 'local',
              baseParams: {
              },
              otherFields:[
                  'denominacion',
                  'idindicadorsalida',
              ],
              url:'/logistica/produccion/maestros/configuracion/index.php/configuracionprod/cargaractividades',
              initStore: function () {
                  var storeFields = [
                      {name: this.valueField},
                      {name: this.displayField},
                  ];
                  if (typeof this.otherFields != 'undefined') {
                      storeFields = storeFields.concat(this.otherFields);
                  }
  
                  return this.store || new Ext.data.Store({
                      url: this.url,
                      autoLoad: this.autoLoad,
                      baseParams: this.baseParams,
                      reader: new Ext.data.JsonReader({
                          root: 'datos',
                          totalProperty: 'total',
                          idProperty: this.valueField
                      }, storeFields)
                  })
              }
          })),
cls.addComponent(new LOG.lb.documento.ComboUsuarios({
    fieldLabel: orden.idioma.lbCbCreadoPor,
    campo: 'idusuario',
    alias: 'aperturaLog',
    subsistema: 10,
    hiddenName: 'idusuario'
}));
cls.addComponent(new LOG.lb.documento.ComboUsuarios({
    fieldLabel: orden.idioma.lbCbAprobadoPor,
    campo: 'aprobadopor',
    alias: 'aperturaLog',
    subsistema: 10,
    hiddenName: 'aprobadopor'
}));

/*cls.addComponent(new LOG.lb.documento.ComboUsuarios({
    fieldLabel: idioma.lbCbCerradoPor,
    campo: 'cerradopor',
    alias: 'aperturaLog',
    subsistema: 10,
    hiddenName: 'cerradopor'
}));
*/
cls.addComponent(new Ext.form.Checkbox({
    boxLabel:'Con desagregación',
    name: 'desagregado',
    hideLabel: false,
    height: 40,
    /*listeners: {
        check: function(_checkbox, checked) {
            _checkbox.setRawValue(checked == true ? 1 : 0);  
            _checkbox.setValue(checked == true ? 1 : 0);  
        }
    }*/
    listeners: {
        check: function(cmp, checked) {
            if (checked) {
                cmp.checked = true;
                orden.panelBusquedaAvanzada.parametros.desagregado = true;
            } else {
                orden.panelBusquedaAvanzada.parametros.desagregado = false;
            }
        }
    }
})); 
cls.addComponent(new Ext.form.Checkbox({
    boxLabel:'Con desviación',
    name: 'desviacion',
    hideLabel: false,
    height: 40,
    listeners: {
        check: function(cmp, checked) {
            if (checked) {
                cmp.checked = true;
                orden.panelBusquedaAvanzada.parametros.desviacion = true;
            } else {
                orden.panelBusquedaAvanzada.parametros.desviacion = false;
            }
        }
    }
   /* listeners: {
        check: function(_checkbox, checked) {
            _checkbox.setRawValue(checked == true ? 1 : 0);  
            _checkbox.setValue(checked == true ? 1 : 0);  
        }
    }*/
    /*listeners: {
        'check': function(cmp, checked) {
            if (checked) {
                Ext.cmp('iddesviacion').value = 1;
            } else {
               console.info('gg')
            }
        }
    } */   
})); 


orden.addFilterComponent(cls);
console.info(cls)
var clsFecha = LOG.util.UIManager.initColumnForm({
    columnas: 2
});

clsFecha.addComponent(new Ext.form.DateField({
    fieldLabel: orden.idioma.lbDfDesde,
    name: 'desde',
    xtype: 'datefield',
    vtype: 'daterange',
    id: 'desde',
    endDateField: 'hasta',
    editable: false
}));
clsFecha.addComponent(new Ext.form.DateField({
    fieldLabel: orden.idioma.lbDfHasta,
    name: 'hasta',
    xtype: 'datefield',
    vtype: 'daterange',
    id: 'hasta',
    startDateField: 'desde',
    editable: false
}));

orden.addFilterComponent(new Ext.form.FieldSet({
    title: orden.idioma.lbFsRangoFecha,
    items: [clsFecha]
}));
orden.view();
});

