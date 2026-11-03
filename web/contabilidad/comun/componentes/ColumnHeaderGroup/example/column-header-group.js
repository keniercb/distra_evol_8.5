  Ext.onReady(function () {
      var estructura = {
          2014: ['CUP', 'CUC'],
          2015: ['CUP', 'CUC', 'USD']
      },
      meses = ['Enero', 'Febrero'], fields = [], columns = [], data = [], AnnoGroupRow = [], MesGroupRow = [];
      /*
       * Example method that generates:
       * 1) The column configuration for the grid
       * 2) The column grouping configuration
       * 3) The data for the store
       * 4) The fields for the store
       */
      function generateConfig() {
          var arr, numMeses = meses.length;
          iterate(estructura, function (annos, monedas) {
              AnnoGroupRow.push({
                  header: annos,
                  align: 'center',
                  colspan: monedas.length * numMeses
              });
              Ext.each(monedas, function (moneda) {
                  MesGroupRow.push({
                      header: moneda,
                      colspan: numMeses,
                      align: 'center'
                  });
                  Ext.each(meses, function (mes) {
                      fields.push({
                          type: 'int',
                          name: moneda + mes
                      });
                      columns.push({
                          dataIndex: moneda + mes,
                          header: mes,
                          align: 'right',
                          renderer: Ext.util.Format.usMoney
                      });
                  });
                  arr = [];
                  for(var i = 0; i < 20; ++i) {
                      arr.push((Math.floor(Math.random() * 11) + 1) * 100000);
                  }
                  data.push(arr);
              });
          });
      }
      /* Run method to generate columns, fields, row grouping*/
      generateConfig();

      /*
       * continentGroupRow at this point is:
       * [
       *     {header: 'Asia', colspan: 4, align: 'center'},
       *     {header: 'Europe', colspan: 6, align: 'center'}
       * ]
       *
       * cityGroupRow at this point is:
       * [
       *     {header: 'Beijing', colspan: 2, align: 'center'},
       *     {header: 'Tokyo', colspan: 2, align: 'center'},
       *     {header: 'Berlin', colspan: 2, align: 'center'},
       *     {header: 'London', colspan: 2, align: 'center'},
       *     {header: 'Paris', colspan: 2, align: 'center'}
       * ]
       */
      var group = new Ext.Cont.ColumnHeaderGroup({
          rows: [AnnoGroupRow, MesGroupRow]
      });

      /*
       * fields at this point is:
       * [
       *     {type: 'int', name: 'BeijingProductX'},
       *     {type: 'int', name: 'BeijingProductY'},
       *     {type: 'int', name: 'TokyoProductX'},
       *     {type: 'int', name: 'TokyoProductY'},
       *     {type: 'int', name: 'BerlinProductX'},
       *     {type: 'int', name: 'BerlinProductY'},
       *     {type: 'int', name: 'LondonProductX'},
       *     {type: 'int', name: 'LondonProductY'},
       *     {type: 'int', name: 'ParisProductX'},
       *     {type: 'int', name: 'ParisProductY'}
       * ]
       *
       * columns at this point is:
       * [
       *     {dataIndex: 'BeijingProductX', header: 'ProductX'},
       *     {dataIndex: 'BeijingProductY', header: 'ProductY'},
       *     {dataIndex: 'TokyoProductX', header: 'ProductX'},
       *     {dataIndex: 'TokyoProductY', header: 'ProductY'},
       *     {dataIndex: 'BerlinProductX', header: 'ProductX'},
       *     {dataIndex: 'BerlinProductY', header: 'ProductY'},
       *     {dataIndex: 'LondonProductX', header: 'ProductX'},
       *     {dataIndex: 'LondonProductY', header: 'ProductY'},
       *     {dataIndex: 'ParisProductX', header: 'ProductX'},
       *     {dataIndex: 'ParisProductY', header: 'ProductY'}
       * ]
       */
      var grid = new Ext.grid.GridPanel({
          renderTo: 'column-group-grid',
          title: 'Estado resultado comparativo',
          width: 1000,
          height: 400,
          store: new Ext.data.SimpleStore({
              fields: fields,
              data: data
          }),
          columns: columns,
          viewConfig: {
              forceFit: true
          },
          plugins: group
      });

      function isIterable(v) {
          //check for array or arguments
          if(Ext.isArray(v) || v.callee) {
              return true;
          }
          //check for node list type
          if(/NodeList|HTMLCollection/.test(toString.call(v))) {
              return true;
          }
          //NodeList has an item and length property
          //IXMLDOMNodeList has nextNode method, needs to be checked first.
          return ((typeof v.nextNode != 'undefined' || v.item) && Ext.isNumber(v.length));
      }
      /**
       * Iterates either the elements in an array, or each of the properties in an object.
       * <b>Note</b>: If you are only iterating arrays, it is better to call Ext.each.
       * @param {Object/Array} object The object or array to be iterated
       * @param {Function} fn The function to be called for each iteration.
       * The iteration will stop if the supplied function returns false, or
       * all array elements / object properties have been covered. The signature
       * varies depending on the type of object being interated:
       * <div class="mdetail-params"><ul>
       * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
       * <div class="sub-desc">
       * When iterating an array, the supplied function is called with each item.</div></li>
       * <li>Objects : <tt>(String key, Object value, Object)</tt>
       * <div class="sub-desc">
       * When iterating an object, the supplied function is called with each key-value pair in
       * the object, and the iterated object</div></li>
       * </ul></div>
       * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed. Defaults to
       * the <code>object</code> being iterated.
       */
      function iterate(obj, fn, scope) {
          if(Ext.isEmpty(obj)) {
              return;
          }
          if(isIterable(obj)) {
              Ext.each(obj, fn, scope);
              return;
          } else if(typeof obj == 'object') {
              for(var prop in obj) {
                  if(obj.hasOwnProperty(prop)) {
                      if(fn.call(scope || obj, prop, obj[prop], obj) === false) {
                          return;
                      }
                  }
              }
          }
      }
  });