Ext.namespace('Ext.aux');
Ext.aux.Multiselect = Ext.extend(Ext.Component, {
    constructor: function(params)
    {
        var scope = this;
        /**
         * Define el url de la controladora
         */
        scope.baseUrl = '-1';

        /**
         * Define el metodo del cual se obtienen la informacion a cargar
         */
        scope.url = '-1';

        /**
         * Define el store se cargara automaticamente
         */
        scope.autoLoad = false;
        /**
         * Define el se permitira seleccion multiple en el grid de la Izquierda
         */
        scope.singleSelect = false;

        /**
         * Define el campo que sera utilizado como id de la fila. Este campo estara oculto
         */
        scope.valueField = 'id';
        /**
         * Define el campo que se mostrar en el grid
         */
        scope.displayField = 'descripcion';

        scope.height = 300;
        scope.perfil = window.parent.perfil;

        scope.etiquetas = {
            "lbAddAll": "Agregar todos",
            "lbAdd": "Agregar seleccionados",
            "tooltipAddAll": "Selecionar todos los elementos disponibles",
            "lbRemoveAll": "Remover todos",
            "lbRemove": "Remover seleccionados",
            "tooltipRemoveAll": "Resetear la selecci&oacute;n",
            "lbCantDisponibles": "<#> disponibles",
            "lbCantSeleccionados": "<#> seleccionados",
            "lbBuscar": "Buscar"
        };


        /*scope.stLeftGrid = new Ext.data.JsonStore({
         url: (scope.baseUrl !== '-1') ? scope.baseUrl + scope.url : scope.url,
         autoLoad: scope.autoLoad,
         root: 'data',
         //totalProperty: "total",
         fields: [
         {
         name: scope.valueField
         }, {
         name: scope.displayField
         }
         ]
         });*/

        /*scope.stRightGrid = new Ext.data.JsonStore({
         root: 'data',
         //totalProperty: "total",
         fields: [
         {
         name: scope.valueField
         }, {
         name: scope.displayField
         }
         ]
         });*/

        Ext.apply(this, params || {});
        /*this.addEvents('initialize');
         scope.addEvents('checkchange');
         scope.addEvents('click');
         scope.addEvents('dblclick');*/
        //scope.addEvents('load');

//        if (!document.getElementById('Notification'))
//            scope.loadJs("/contabilidad/contabilidad_financiera/componentes/Notification/js/Ext.Cont.Notification", 'Notification');

        scope.view = new Ext.aux.UIMultiselect(scope); // creando la interfaz
        scope.initializeEvents(scope);
        scope.initializeFunctions(scope);

        if (scope.autoLoad) {
            scope.load();
        }
        return Ext.aux.Multiselect.superclass.constructor.call(this);
    },
    initializeEvents: function(scope)
    {
        scope.view.on({
            afterlayout: function(component, layout) {
                //scope.view.setWidth(scope.view.ownerCt.getSize().width);
            }
        });
        scope.smLeftGrid.on({
            rowselect: function(sm, rowIndex, record) {
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAdd);
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.hasSelection()) {
                    scope.btnAgregarTodos.setText(scope.etiquetas.lbAdd);
                } else {
                    scope.btnAgregarTodos.setText(scope.etiquetas.lbAddAll);
                }
            }
        });
        scope.smRightGrid.on({
            rowselect: function(sm, rowIndex, record) {
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemove);
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.hasSelection()) {
                    scope.btnRemoveTodos.setText(scope.etiquetas.lbRemove);
                } else {
                    scope.btnRemoveTodos.setText(scope.etiquetas.lbRemoveAll);
                }
            }
        });
        scope.stLeftGrid.on({
            load: function(store, records, options) {
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', store.getCount());
                scope.tfSearchLeftGrid.setDisabled(records.length === 0);

                /* PARA EL DD */
                /*scope.rightGridDropTargetEl = scope.rightGrid.getView().el.dom.childNodes[0].childNodes[1];
                scope.rightGridDropTarget = new Ext.dd.DropTarget(scope.rightGridDropTargetEl, {
                    ddGroup: 'leftGridDDGroup',
                    copy: true,
                    notifyDrop: function(ddSource, e, data) {
                        function addRow(record, index, allItems) {
                            var foundItem = scope.stRightGrid.find('idderechouobligacion', record.json.idderechouobligacion);

                            if (foundItem == -1) {
                                scope.stRightGrid.add(record);
                                //scope.stLeftGrid.sort('name', 'ASC');
                                ddSource.grid.store.remove(record);
                            }
                        }
                        // Loop through the selections
                        Ext.each(ddSource.dragData.selections, addRow);
                        return(true);
                    }
                });

                scope.leftGridDropTargetEL = scope.leftGrid.getView().el.dom.childNodes[0].childNodes[1];
                scope.leftGridDropTarget = new Ext.dd.DropTarget(scope.leftGridDropTargetEL, {
                    ddGroup: 'rightGridDDGroup', //rightGridDDGroup
                    copy: true,
                    notifyDrop: function(ddSource, e, data) {

                        function addRow(record, index, allItems) {
                            var foundItem = scope.stLeftGrid.find('idderechouobligacion', record.json.idderechouobligacion);
                            if (foundItem == -1) {
                                scope.stLeftGrid.add(record);
                                //scope.stLeftGrid.sort('name', 'ASC');
                                ddSource.grid.store.remove(record);
                            }
                        }
                        Ext.each(ddSource.dragData.selections, addRow);
                        return(true);
                    }
                });*/
                /* FIN PARA EL DD */
            },
            add: function(store, records, index) {
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', store.getCount());
                scope.tfSearchLeftGrid.setDisabled(store.getCount() === 0);
            },
            remove: function(store, record, index) {
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', store.getCount());
                scope.tfSearchLeftGrid.setDisabled(store.getCount() === 0);
            }
        });

        scope.stRightGrid.on({
            add: function(store, records, index) {
                scope.lbseleccionados.el.textContent = scope.etiquetas.lbCantSeleccionados.replace('<#>', store.getCount());
                scope.btnTraspAceptar.setDisabled(false);
                scope.tfSearchRightGrid.setDisabled(store.getCount() === 0);
            },
            remove: function(store, record, index) {
                scope.lbseleccionados.el.textContent = scope.etiquetas.lbCantSeleccionados.replace('<#>', store.getCount());
                scope.tfSearchRightGrid.setDisabled(store.getCount() === 0);
                scope.btnTraspAceptar.setDisabled(store.getCount() === 0);
            }
        });

        this.tfSearchLeftGrid.on({
            keyup: function(field, event) {
                var pattern = this.getValue().toLowerCase();
                scope.stLeftGrid.filter(scope.displayField, pattern, true, false);
                /*scope.stLeftGrid.filterBy(function(record, id) {
                 return (record.get(scope.displayField).toString().toLowerCase().indexOf(pattern) !== -1);
                 });*/
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', scope.stLeftGrid.getCount());
            }
        });
        this.tfSearchRightGrid.on({
            keyup: function(field, event) {
                var pattern = this.getValue().toLowerCase();
                scope.stRightGrid.filter(scope.displayField, pattern, true, false);
                /*scope.stRightGrid.filterBy(function(record, id) {
                 return (record.get(scope.displayField).toString().toLowerCase().indexOf(pattern) !== -1);
                 });*/
                scope.lbseleccionados.el.textContent = scope.etiquetas.lbCantSeleccionados.replace('<#>', scope.stRightGrid.getCount());
            }
        });

        this.btnAgregarTodos.on('click', function(component) {
            scope.fAddDuoTrasp();
        });

        this.btnRemoveTodos.on('click', function(component) {
            scope.fDelDuoTrasp();
        });

    },
    initializeFunctions: function(scope)
    {
        this.load = function(options) {
            (options) ? scope.stLeftGrid.load(options) : scope.stLeftGrid.load();
            /*var p = (params) ? params : {};
            Ext.Ajax.request({
                method: "POST",
                url:scope.url,
                //params: p,
                callback: function(options, success, response)
                {
                    var responseData = Ext.decode(response.responseText);
                    scope.stLeftGrid.loadData(responseData);
                }
            });*/
        };
        this.reset = function() {
            scope.stRightGrid.removeAll();
            scope.stLeftGrid.removeAll();
        };
        this.createActionColumn = function(value, metadata, record, rowIndex, colIndex, store) {
            var id = record.get(scope.valueField).toString();
            return "<img class ='addRec' src='" + scope.perfil.dirImg + 'adicionar.png' + "' alt='Agregar' onclick='scope.fAddDuoTrasp(" + id + ")'/>";
        };

        this.createDelActionColumn = function(value, metadata, record, rowIndex, colIndex, store) {
            var id = record.get(scope.valueField).toString();
            return "<img class ='addRec' src='" + scope.perfil.dirImg + 'eliminar.png' + "' alt='Agregar' onclick='scope.fDelDuoTrasp(" + id + ")'/>";
        };
        this.fAddDuoTrasp = function(id) {
            if (id) {
                indexActual = scope.stLeftGrid.find(scope.valueField, id);
                var newRecord = scope.stLeftGrid.getAt(indexActual);
                scope.stLeftGrid.remove(newRecord);
                scope.stRightGrid.add([newRecord]);
            } else {
                var array = scope.smLeftGrid.hasSelection() ? scope.smLeftGrid.getSelections() : scope.stLeftGrid.getRange(0, scope.stLeftGrid.getCount() - 1);
                scope.stRightGrid.add(array);
                for (var i = 0; i < array.length; i++) {
                    scope.stLeftGrid.remove(array[i]);
                }
            }
            if (scope.smLeftGrid.hasSelection()) {
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAdd);
            } else {
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAddAll);
            }
        };
        this.fDelDuoTrasp = function(id) {
            if (id) {
                indexActual = scope.stRightGrid.find(scope.valueField, id);
                var newRecord = scope.stRightGrid.getAt(indexActual);
                scope.stRightGrid.remove(newRecord);
                scope.stLeftGrid.add([newRecord]);
            } else {
                var array = scope.smRightGrid.hasSelection() ? scope.smRightGrid.getSelections() : scope.stRightGrid.getRange(0, scope.stRightGrid.getCount() - 1);
                scope.stLeftGrid.add(array);
                for (var i = 0; i < array.length; i++) {
                    scope.stRightGrid.remove(array[i]);
                }
            }
            if (scope.smRightGrid.hasSelection()) {
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemove);
            } else {
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemoveAll);
            }
        };
    },
    loadJs: function(jsSrc, id)
    {
        if (jsSrc != null)
        {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadCss: function(css)
    {
        var tag = document.createElement("style");
        tag.type = "text/css";
        if (tag.styleSheet)
            tag.styleSheet.cssText = css;
        else
            tag.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(tag);
    }
});

