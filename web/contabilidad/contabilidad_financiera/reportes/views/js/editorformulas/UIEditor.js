  Ext.QuickTips.init();
  trpGruposContenidosCuentas = new Ext.Cont.Class.GruposContenidosCuentas();
  trpClassconceptosFormulas = new Ext.Cont.ClassconceptosFormulas();
  trpGruposContenidosCuentas.on('initialize', function(arbolTipoConcepto) {
      trpClassconceptosFormulas.on('initialize', function(arbolConceptosFormulas) {
          new Ext.Viewport({
              items: new Ext.Confin.Configuracion.EditorFormula(arbolTipoConcepto, arbolConceptosFormulas)
          });
      });
  });