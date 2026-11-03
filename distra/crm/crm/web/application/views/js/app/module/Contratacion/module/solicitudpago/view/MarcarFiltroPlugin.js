/**
 * Created by elysium on 26/09/16.
 */
Ext.define('SolicitudPago.view.MarcarFiltroPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias:'plugin.marcarfiltroplugin',
    color: 'yellow',
    columnFilters:false,
    extraParams:false,
    init: function(panel){
        var self=this;
        self.panel=panel;
        // console.info('Inicializado MarcarFiltroPlugin', panel)
        // console.info('paneln',  panel)
        /** COMO USAR
        -Atributo opcional: color
         se puede especificar el color con el que se van a marcar todas las coincidencias,
         (a no ser que se especifique en un campo especifico otro color)
        - Atributo obligatorio: campos
         Formato que debe tener el atributo campos:
         Array
         Cada posicion puede ser:
         -String: Si el itemId del campo coincide con el dataIndex de la columna del grid que se quiere colorear.
         -Object: Si el itemId del campo no coincide con el dataIndex de la columna, o se quieren colorear mas de una columns.
            parametros del Object:
               +itemId(Obligatorio): itemId del campo donde se introdujo el criterio de busqueda.
               +dataIndex(Opcional): dataIndex de la columna que quieres colorear como string o array de columnas que quieres colorear.
                Si no se especifica se colorearan todas las columnas
               +color(Opcional): Si quieres que coloree de un color especifico. Por defecto yellow.
        * */

        // if (self.campos.length>0)
        //     self.busquedas = obtenertributosDeBusqueda();
        // console.log('Busquedas', self.busquedas)
        panel.on('afterrender', function(obj){
            var col=panel.columns[0];
            // console.log('PLUGIN->getOwnerHeaderCt:',panel.columns[0].getOwnerHeaderCt(),panel);
            // console.info('FILA dataindex:',col.dataIndex,
            // //     ',hidden:', col.hidden,
            // //     ',isHidden:', col.isHidden(),
            //     ', getOwnerHeaderCt:',col.getOwnerHeaderCt(),
            // //     ', activeItem:',col.activeItem,
            //     ', ownerCt:',col.ownerCt
            // //     // ',isHideable:', col.isHideable(),
            // //     // ',isVisible:', col.isVisible(),
            // //     // ',isVisible deep:', col.isVisible(true),
            // //     // ',isDisabledp:', col.isDisabled()
            // )
            self.headerColumns={};
            panel.columns.forEach(function(x){
                self.headerColumns[x.dataIndex]=x.getOwnerHeaderCt();
            })
            // if (self.campos && self.campos.length>0)
            //     self.busquedas = self.obtenertributosDeBusqueda();
            // console.log('Busquedas', self.busquedas)
        });
        // if(self.campos){
            if(panel.xtypesChain.indexOf('treepanel')!=-1) {
                panel.getStore().on('load', function (store, nodo, records, success) {
                    // console.info('load plugin filtros tree:',  store.filters.length )//, store.filters.length, self.campos, records)
                    if (success) {
                        if (self.campos.length>0 && store.filters.items.length > 0) {
                            var root = panel.getRootNode();
                            // if(!self.busquedas)
                            self.busquedas = self.obtenertributosDeBusqueda();
                            // console.log('busquedas', self.busquedas)
                            root.cascadeBy(function (nodo) {
                                // console.log('nodo', nodo.get('text'), nodo)
                                if(!nodo.isRoot()){
                                    self.colorearSeleccionado(self.busquedas, nodo);
                                }
                            });
                            // panel.getView().markDirty=true;
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
                            // console.log('cant filters:', store.filters.items.length)
                            // console.log('filters:', store.filters.items)
                            // console.log('filterspanel:', panel.filters)

                            // if(panel.filters && self.columnFilters){
                            self.realizarFiltrosColumnas();
                                // marcarFiltrosColumnas:function(){}
                            // }
                            // console.log('store.filters:', store.filters.items.length, self.extraParams, self.campos.length)
                            // console.log('Keys:', Ext.Object.getKeys(store.proxy.extraParams))
                            if((store.filters.items.length>0 ||
                               (self.extraParams && Ext.Object.getKeys(store.proxy.extraParams).length>0))
                                && self.campos.length > 0){
                                // if(!self.busquedas)
                                self.busquedas = self.obtenertributosDeBusqueda();
                                // console.log('Busquedas', self.busquedas)
                                for (var i in panel.getStore().data.items) {
                                    self.colorearSeleccionado(self.busquedas, panel.getStore().data.items[i]);
                                }
                            }

                            // if (self.campos.length > 0 && store.filters.items.length > 0) {
                            //     if(!self.busquedas)
                            //         self.busquedas = self.obtenertributosDeBusqueda();
                            //     console.log('Busquedas', self.busquedas)
                            //     for (var i in panel.getStore().data.items) {
                            //         self.colorearSeleccionado(self.busquedas, panel.getStore().data.items[i]);
                            //     }
                            //     if(panel.selModel)
                            //         panel.selModel.select(0);
                            // }
                        }

                    }
                })

        }
        // }
        // panel.getStore().on('load',self.onTreePanelFunction);
        self.callParent(arguments);

    },
    realizarFiltrosColumnas:function(){
        var self=this, panel=self.panel;
        if(panel.filters && self.columnFilters) {
            panel.filters.filters.items.forEach(function (x) {
                // console.log('caso gridfilters:', x.active, '-', x.dataIndex)
                //  && self.campos.indexOf(x.dataIndex)!=-1
                if (x.active && x.inputItem && Ext.isFunction(x.inputItem.getValue)) {
                    var busquedas = {
                        'atributo': x.dataIndex,
                        'valor': x.inputItem.getValue(),
                        'indexCol': self.getIndicesAColorear([x.dataIndex]),
                    };
                    // console.log('busquedas', busquedas)
                    for (var i in panel.getStore().data.items) {
                        self.colorearSeleccionado(busquedas, panel.getStore().data.items[i]);
                    }
                }
            });
        }
    },
    getIndicesAColorear:function(permitidos){
        var self=this,
            panel=self.panel,
            indexCol=[],
            contCol=panel.selModel.$className=="Ext.selection.CheckboxModel"?1:0;
        // console.info('permitidos:', permitidos)
        Ext.each(panel.columns, function(col){
            // console.info('FILA dataindex:',col.dataIndex,'->#',contCol,
            // //     ',hidden:', col.hidden,
            // //     ',isHidden:', col.isHidden(),
            //     ', getOwnerHeaderCt:',col.getOwnerHeaderCt(),
            // //     // ', activeItem:',col.activeItem,
            //     ', ownerCt:',col.ownerCt
            // //     // ', getOwnerHeaderCt guardado:',self.headerColumns[col.dataIndex],
            // //     // ', getOwnerHeaderCt guardado index:',self.headerColumns[col.dataIndex].getHeaderIndex(col)
            // //     // ',isHideable:', col.isHideable(),
            // //     // ',isVisible:', col.isVisible(),
            // //     // ',isVisible deep:', col.isVisible(true),
            // //     // ',isDisabledp:', col.isDisabled()
            // )
            if(!col.hidden){
                // console.info('FILA VISIBLE dataindex:',col.dataIndex,'->#',contCol)
                if(permitidos.indexOf(col.dataIndex)!=-1){
                    // console.log('col:',col)
                    // console.log('col getOwnerHeaderCt:',col.getOwnerHeaderCt())
                    // console.log('col index visible:',col.getVisibleIndex())
                    // console.log('col index:',col.getIndex())
                    // console.log('col contCol:',contCol)
                    if(col.getOwnerHeaderCt()){
                        // console.log('col index:',col.getIndex(),contCol)
                        indexCol.push(col.getIndex());
                    }
                    // else{
                    indexCol.push(contCol);
                    // }
                }
                contCol+=1;
            }
        });
        // console.info('indexCol:',indexCol)
        return indexCol;
    },
    colorearSeleccionado:function(busquedas, nodo){
        // console.info('colorearSeleccionado', busquedas, nodo, this,this.panel)
        var panel = this.panel;
        var self=this;
            Ext.each(busquedas, function (actual) {
                // console.info('colorearSeleccionado:', actual['itemId'], panel.down('#' + actual['itemId']))
                if (actual['valor'] != '' && actual['valor'] != undefined) {
                    // console.info('ALLa vamos', actual)
                    var color = self.color;
                    if(actual['color'])color=actual['color'];
                    var searchRegExp = new RegExp(actual['valor'], 'gi');
                    // console.log('fly:', Ext.fly(panel.view.getNode(nodo)))
                    try {
                        var td = Ext.fly(panel.view.getNode(nodo)).down('td');
                    }catch(e){
                        var td=null;
                    }
                    // console.log('td', td)
                    while (td) {
                        // console.log('index:',actual['indexCol'],td.dom.cellIndex);
                        if (actual['indexCol'].indexOf(td.dom.cellIndex) != -1) {
                            var cell = td.down('.x-grid-cell-inner');
                            // console.log('cell', cell)
                            var matches = cell.dom.innerHTML.match(/<[^>]*>/gm); //'\x0f'
                            // console.log('cell.dom.innerHTML', cell.dom.innerHTML)
                            // console.log('matches', matches)
                            var cellHTML = cell.dom.innerHTML.replace(/<[^>]*>/gm, '\x0f');
                            // console.log('cellHTML', cellHTML)
                            cellHTML = cellHTML.replace(searchRegExp, function (m) {
                                console.log('m',m)
                                // Ext.fly(td).setStyle('background-color', '#edf6fd');
                                // panel.getView().setEstiloCss('found_filtrando');
                                return '<b style="background-color:' + color + '">' + m + '</b>'
                            });
                            // console.log(cellHTML)
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

                    // }
                    // }
                }
            })
        },
    obtenertributosDeBusqueda: function(){
        var self=this,
            busqueda=[],
            // atributos=[],
            panel=this.panel;
        // console.log('self.campos', self.campos)
        Ext.each(self.campos, function(valor){
            var atributos = [], indexCol=[];
            if (tipoDato(valor) == 'string') {
                atributos.push(valor);
                Ext.each(panel.columns, function(col){
                    if(atributos.indexOf(col.dataIndex)!=-1)
                        indexCol.push(col.getIndex())
                });
                // console.log('campo;',panel.down('#'+valor))
                // console.log('valor campo;',panel.down('#'+valor).getValue())
                if(panel.down('#'+valor))
                    busqueda.push({
                        'atributo': valor,
                        'valor':panel.down('#'+valor).getValue(),
                        'campo':panel.down('#'+valor),
                        'indexCol':indexCol
                    });
                // atributo = self.campos[i];
                // itemId = self.campos[i];
            } else if (tipoDato(valor) == 'object') {
                // console.info(valor)
                if(valor['dataIndex']){
                    if (tipoDato(valor['dataIndex']) == 'array') {
                        atributos=valor['dataIndex']
                    }else{
                        atributos.push(valor['dataIndex'])
                    }
                    // self.getIndicesAColorear(atributos);
                    // Ext.each(panel.columns, function(col){
                    //     if(atributos.indexOf(col.dataIndex)!=-1)
                    //         indexCol.push(col.getIndex())
                    // });
                }else{
                    Ext.each(panel.columns, function(col){
                        atributos.push(col.dataIndex)
                    });
                }
                // console.log('itemId;',valor['itemId'])
                // console.log('campo;',panel.down('#'+valor['itemId']))
                // console.log('valor campo;',panel.down('#'+valor['itemId']).getValue())
                if(panel.down('#'+valor['itemId']))
                    busqueda.push({
                        'atributo': valor['dataIndex'],
                        'valor': panel.down('#'+valor['itemId']).getValue(),
                        'campo': panel.down('#'+valor['itemId']),
                        'indexCol': self.getIndicesAColorear(atributos),
                        'color': valor['color']
                    })
            }
        });
        return busqueda;
    }
});

// function marcarCoincidente(objetivo, segmento, color){
//     if (color==null)
//         color='yellow';
//     var searchRegExp = new RegExp(segmento, 'gi');
//     if(searchRegExp.test(objetivo))
//         return objetivo.replace(searchRegExp, function(m){return '<b style="background-color:'+color+'">'+m+'</b>'})
//     return objetivo;
// }
function tipoDato(obj) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
}

function marcarCoincidente(actual, nodo, panel){
    var searchRegExp = new RegExp(panel.down('#' + actual['itemId']).getValue(), 'gi');
    var td = Ext.fly(panel.view.getNode(nodo)).down('td');
    // console.log('td', td)
    while (td) {
        // console.log(actual['indexCol'].indexOf(td.dom.cellIndex))
        if (actual['indexCol'].indexOf(td.dom.cellIndex) != -1) {
            var cell = td.down('.x-grid-cell-inner');
            // console.log('cell', cell)
            var matches = cell.dom.innerHTML.match(/<[^>]*>/gm); //'\x0f'
            // console.log('matches', matches)
            var cellHTML = cell.dom.innerHTML.replace(/<[^>]*>/gm, '\x0f');
            // console.log('cellHTML', cellHTML)
            var indices
            cellHTML = cellHTML.replace(searchRegExp, function (m) {
                // console.log('m',m)
                return '<b style="background-color:' + color + '">' + m + '</b>'
            });
            // console.log(cellHTML)
            Ext.each(matches, function (match) {
                cellHTML = cellHTML.replace('\x0f', match);
            });
            // actualizando la columna
            cell.dom.innerHTML = cellHTML;
        }
        td = td.next();
    }
}