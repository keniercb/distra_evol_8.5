/**
 * Created by elysium on 26/09/16.
 */
Ext.define('CRM.plugins.ResaltarFiltrosPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias:'plugin.resaltarfiltroplugin',
    color: 'yellow', //color del resaltado
    columnFilters:true, //si true marca los filtros que se hagan desde las columnas
    extraParams:true,  //si true es que el plugin va a detectar atributos pasados al store como extraparams como filtros (no incluye a los de las columnas)
    init: function(panel){
        var self=this;
        self.panel=panel;
        // console.info('Inicializado ResaltarFiltrosPlugin', panel)
        /** COMO USAR
         -Atributo opcional: columnFilters
         si true marca los filtros que se hagan desde las columnas
         -Atributo opcional: extraParams
         si true es que el plugin va a detectar atributos pasados al store como extraparams como filtros (no incluye a los de las columnas)
         -Atributo opcional: color
         se puede especificar el color con el que se van a marcar todas las coincidencias, por defecto amarillo
         (a no ser que se especifique en un campo especifico otro color)
         - Atributo opcional: campos
         para especificar filtros que no esten entre las columnas
         Formato que debe tener el atributo campos: Array
         Cada posicion puede ser:
         -String: Si el itemId del campo de busqueda coincide con el dataIndex de la columna del grid que se quiere colorear.
         -Object: Si el itemId del campo  de busqueda no coincide con el dataIndex de la columna, o se quieren colorear mas de una columns.
         parametros del Object:
         +itemId(Obligatorio): itemId del campo donde se introdujo el criterio de busqueda.
         +dataIndex(Opcional): dataIndex de la columna que quieres colorear como string o array de columnas que quieres colorear.
         Si no se especifica se colorearan todas las columnas
         +color(Opcional): Si quieres que coloree de un color especifico. Por defecto yellow.
         * */

        // panel.on('afterrender', function(obj){
        //     var col=panel.columns[0];
        // });
        if(panel.xtypesChain.indexOf('treepanel')!=-1) {
            panel.getStore().on('load', function (store, nodo, records, success) {
                // console.info('load plugin filtros tree:',  store.filters.length )//, store.filters.length, self.campos, records)
                if (success) {
                    if (self.campos.length>0 && store.filters.items.length > 0) {
                        var root = panel.getRootNode();
                        self.busquedas = self.obtenertributosDeBusqueda();
                        root.cascadeBy(function (nodo) {
                            if(!nodo.isRoot()){
                                self.colorearSeleccionado(self.busquedas, nodo);
                            }
                        });
                    }
                }
            });
            panel.on('itemexpand', function (expandNodo) {
                // console.info('itemexpand', expandNodo)
                if (self.campos.length>0 && panel.store.filters.items.length > 0) {
                    expandNodo.cascadeBy(function (nodo) {
                        self.colorearSeleccionado(self.busquedas, nodo);
                    });
                }
            })
            panel.on('itemcollapse', function (nodo) {
                // console.info('itemcollapse', nodo)
                if (self.campos.length>0 && panel.store.filters.items.length > 0) {
                    self.colorearSeleccionado(self.busquedas, nodo);
                }
            })
        }
        else if(panel.xtypesChain.indexOf('grid')!=-1){
            // console.log('!esto es un grid')
            panel.on('columnschanged', function( ct){
                // console.log('columnschanged')
                self.realizarFiltrosColumnas();
            });
            panel.getStore().on('load', function (store, records, success) {
                // console.info('load plugin filtros grid:', store)//, store.filters.length, self.campos, records)
                if (success) {
                    if(records.length>0){
                        self.realizarFiltrosColumnas();
                        // console.log('store.filters:', store.filters.items.length, self.extraParams, self.campos.length)
                        // console.log('Keys:', Ext.Object.getKeys(store.proxy.extraParams))
                        if((store.filters.items.length>0 ||
                                (self.extraParams && Ext.Object.getKeys(store.proxy.extraParams).length>0))
                            && self.campos.length > 0){
                            self.busquedas = self.obtenertributosDeBusqueda();
                            // console.log('Busquedas campos:', self.busquedas)
                            if(self.busquedas.length>0)
                                for (var i in panel.getStore().data.items) {
                                    self.colorearSeleccionado(self.busquedas, panel.getStore().data.items[i]);
                                }
                        }
                    }
                }
            })

        }
        self.callParent(arguments);
    },
    obtenertributosDeBusqueda: function(){
        var self=this,
            busqueda=[],
            panel=this.panel;
        Ext.each(self.campos, function(valor){
            // var atributos = [], indexCol=[];
            if (tipoDato(valor) == 'string') {
                // atributos.push(valor);
                if(panel.down('#'+valor) && panel.down('#'+valor).getValue()!='')
                    busqueda.push({
                        'atributo': valor,
                        'valor':panel.down('#'+valor).getValue(),
                        'RegExp': new RegExp(panel.down('#'+valor).getValue(), 'gi'),
                        // 'campo':panel.down('#'+valor),
                        // 'indexCol':self.getIndicesAColorear(atributos),
                    });
            } else if (tipoDato(valor) == 'object') {
                // if(valor['dataIndex']){
                //     if (tipoDato(valor['dataIndex']) == 'array') {
                //         atributos=valor['dataIndex']
                //     }else{
                //         atributos.push(valor['dataIndex'])
                //     }
                // }else{
                //     Ext.each(panel.columns, function(col){
                //         atributos.push(col.dataIndex)
                //     });
                // }
                if(panel.down('#'+valor['itemId']) && panel.down('#'+valor['itemId']).getValue())
                    busqueda.push({
                        'atributo': valor['dataIndex'],
                        'valor': panel.down('#'+valor['itemId']).getValue(),
                        'RegExp': new RegExp(panel.down('#'+valor['itemId']).getValue(), 'gi'),
                        // 'campo': panel.down('#'+valor['itemId']),
                        // 'indexCol': self.getIndicesAColorear(atributos),
                        'color': valor['color']
                    })
            }
        });
        return busqueda;
    },
    realizarFiltrosColumnas:function(){
        var self=this,
            panel=self.panel,
            busquedas=[],
            activeFilters=[];
        if(self.columnFilters) {
            if (panel.filters)
                activeFilters = activeFilters.concat(panel.filters.getFilterData());
            if (panel.getComponent(0).filters)
                activeFilters = activeFilters.concat(panel.getComponent(0).filters.getFilterData());
            // console.log('panel.getComponent(0).filter:', panel.getComponent(0).filters)
            // console.log('activeFilters:', activeFilters)
            if (activeFilters.length > 0) {
                activeFilters.forEach(function (x) {
                    if(x.data.value!='')
                        busquedas.push({
                            'atributo': x.field,
                            'valor': x.data.value,
                            'RegExp': new RegExp(x.data.value, 'gi'),
                            // 'indexCol': self.getIndicesAColorear([x.field])
                        });
                });
                // console.log('busquedas columna', busquedas)
                if (busquedas.length > 0)
                    for (var i in panel.getStore().data.items) {
                        self.colorearSeleccionado(busquedas, panel.getStore().data.items[i]);
                    }
            }
        }
    },
    getIndicesAColorear:function(permitidos){
        var self=this,
            panel=self.panel,
            indexCol=[];
        console.info('Permitidos:', permitidos)
        if(panel.view.xtype=="gridview"){
            indexCol=self.findIndex(panel.columns, permitidos);
        }
        return indexCol;
    },
    findIndex: function(columns, permitidos, contCol){
        var self=this,
            indexCol=[];
            if(contCol===undefined)contCol=self.panel.selModel.$className=="Ext.selection.CheckboxModel"?1:0;
            // console.log('COLUMNS:', contCol, columns)
        Ext.each(columns, function(col){
            //console.log('col:', col)
            if(!col.hidden){
                if(permitidos.indexOf(col.dataIndex)!=-1){
                    // console.log('col:',col)
                    if(col.getOwnerHeaderCt()){
                        // console.log('aaa', col.getOwnerHeaderCt())
                        // console.log('col index:',col.getIndex())
                        indexCol.push(col.getIndex());
                    }else{
                        // console.log('col contindex:',contCol)
                        indexCol.push(contCol);    //?? revisar esto el else es necesario??
                    }
                }
                contCol+=1;
            }
        });
        return indexCol;
    },
    colorearSeleccionado:function(busquedas, nodo){
        // console.info('colorearSeleccionado', busquedas)
        var self=this,
            panel = this.panel;
        Ext.each(busquedas, function (actual) {
            if (actual['valor'] != '' && actual['valor'] != undefined) {
                var color = self.color;
                if(!actual['color'])actual['color']=color;
                if(panel.view.xtype=="gridview") {
                    // console.log('"gridview"')
                    try {
                        var td = Ext.fly(panel.view.getNode(nodo)).down('td');
                    } catch (e) {
                        var td = null;
                    }
                    if(td){
                        actual['indexCol']=self.findIndex(panel.columns, tipoDato(actual['atributo']) == 'array'?actual['atributo']:[actual['atributo']]);
                        self.colorearElemento(td, actual);
                    }
                }else {
                    // console.log('"lokedview"')
                    try {
                        var td = Ext.fly(panel.view.lockedView.getNode(nodo)).down('td');
                    } catch (e) {
                        var td = null;
                    }
                    // console.log('lockedView:', td)
                    if(td){
                        actual['indexCol']=self.findIndex(panel.lockedGrid.columns, tipoDato(actual['atributo']) == 'array'?actual['atributo']:[actual['atributo']]);
                        // console.log('actual:', actual)
                        self.colorearElemento(td, actual);
                    }
                    try {
                        var td = Ext.fly(panel.view.normalView.getNode(nodo)).down('td');
                    } catch (e) {
                        var td = null;
                    }
                    // console.log('normalView', td)
                    if(td){
                        // console.log(tipoDato(actual['atributo']) == 'array'?actual['atributo']:[actual['atributo']])
                        actual['indexCol']=self.findIndex(panel.normalGrid.columns, tipoDato(actual['atributo']) == 'array'?actual['atributo']:[actual['atributo']], 0);
                        // console.log('actual:', actual)


                        self.colorearElemento(td, actual);
                    }
                }
            }
        })
    },
    colorearElemento: function(td, actual){
        if(td)
            while (td) {
                if (actual['indexCol'].indexOf(td.dom.cellIndex) != -1) {
                    // console.log('column:', actual['indexCol'].indexOf(td.dom.cellIndex), '/',
                    //     td.dom.cellIndex,'/',td.down('.x-grid-cell-inner').dom.innerHTML,'/')
                        // td.dom,'/', td.down('.x-grid-cell-inner').dom)
                    var cell = td.down('.x-grid-cell-inner');
                    var matches = cell.dom.innerHTML.match(/<[^>]*>/gm); //'\x0f'
                    var cellHTML = cell.dom.innerHTML.replace(/<[^>]*>/gm, '\x0f');
                    cellHTML = cellHTML.replace(actual['RegExp'], function (m) {
                        return '<b style="background-color:' + actual['color'] + '">' + m + '</b>'
                    });
                    Ext.each(matches, function (match) {
                        cellHTML = cellHTML.replace('\x0f', match);
                    });
                    // actualizando la columna
                    cell.dom.innerHTML = cellHTML;
                    // td=null;
                }
                // else{
                td = td.next();
                // }
            }
    }

});

function tipoDato(obj) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
}
