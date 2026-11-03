Ext.ns('LOG.inv.rotacionlote');

LOG.inv.rotacionlote.View = Ext.extend(LOG.util.UITemplate, {

    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscarLotes;
        this.textBusquedaSimple = config.idioma.fdLotes;
        this.modoSeleccion = 2;
        //this.autoSelect = false;
        this.urlBusquedaGridPrincipal = 'cargarRotaciones';
        LOG.inv.rotacionlote.View.superclass.constructor.call(this, config);
        //this.modelo = new LOG.util.Model({idioma:this.idioma});
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            dataIndex: 'idrotacionlote',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtiporotacion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'datos',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddestino',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idorigen',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'observaciones',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbNroRotacion,
            dataIndex: 'nrorotacionlote',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbFechaRotacion,
            dataIndex: 'fecharotacionlote',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbTipoRotacion,
            autoExpand: true,
            dataIndex: 'tiporotacionlote',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbAreaOrigen,
            autoExpand: true,
            dataIndex: 'areaorigen',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbAreaDestino,
            autoExpand: true,
            dataIndex: 'areadestino',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbCantProductos,
            autoExpand: true,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbEstado,
            autoExpand: true,
            dataIndex: 'estado',
            default: true,
            renderer: function(v, _mD, _r) {
                if(v == 1)
                    return 'Elaboraci\xf3n';
                if(v==3)
                    return 'Rotado';
                // return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.lbUsuario,
            autoExpand: true,
            dataIndex: 'usuario',
            default: true
        });
    },
    view:function () {
        var _this = this;
        this.getPanelBusqueda().setColumns(2);
        /*this.addFilterComponent(new LOG.util.Prototipos.inputTexto({
                fieldLabel: _this.idioma.lbNroRotacion,
                cls: 'form-control',
                name:'nrorotacion'
            })
        );
        this.addFilterComponent(new LOG.util.Prototipos.inputTexto({
                fieldLabel: _this.idioma.lbCantProductos,
                cls: 'form-control',
                name:'cantproductos'
            })
        );
        this.addFilterComponent(new Ext.form.DateField({
                //anchor: '98%',
                fieldLabel: _this.idioma.lbFechaRotacion,
                //readOnly: true,
                format: 'd/m/Y',
                cls: 'form-control',
                name: 'fecha'/!*,
            emptyText: scope._this.idioma.lbCbVacio*!/
            })
        );
        this.addFilterComponent(new LOG.util.ComboBox({
                url: 'cargartiporotacion',
                autoLoad: true,
                cls:'form-control',
                emptyText:_this.idioma.tvacio,
                baseParams:{
                    modelo: 'NomActividadcontenedor',
                    idnom: 'idactividadcontenedor',
                    nomen:'1'
                },
                displayField: 'codigodenominacion',
                valueField: 'idactividadcontenedor',
                anchor: '90%',
                hiddenName:'idactividadcontenedor',
                fieldLabel:_this.idioma.lbTipoRotacion
            })
        );
        this.addFilterComponent(new LOG.util.ComboBox({
                url: 'cargartiporotacion',
                autoLoad: true,
                cls: 'form-control',
                emptyText:_this.idioma.tvacio,
                baseParams: {
                    modelo: 'NomActividadcontenedor',
                    idnom: 'idactividadcontenedor',
                    nomen: '1'
                },
                displayField: 'codigodenominacion',
                valueField: 'idactividadcontenedor',
                anchor: '90%',
                hiddenName: 'idactividadcontenedor',
                fieldLabel:_this.idioma.lbAreaOrigen
            })
        );
        this.addFilterComponent(new LOG.util.ComboBox({
                url: 'cargartiporotacion',
                autoLoad: true,
                cls: 'form-control',
                emptyText:_this.idioma.tvacio,
                baseParams: {
                    modelo: 'NomActividadcontenedor',
                    idnom: 'idactividadcontenedor',
                    nomen: '1'
                },
                displayField: 'codigodenominacion',
                valueField: 'idactividadcontenedor',
                anchor: '90%',
                hiddenName: 'idactividadcontenedor',
                fieldLabel:_this.idioma.lbAreaDestino
            })
        );

        this.addFilterComponent(new LOG.util.ComboBox({
                url: 'cargartiporotacion',
                autoLoad: true,
                cls: 'form-control',
                emptyText:_this.idioma.tvacio,
                baseParams: {
                    modelo: 'NomActividadcontenedor',
                    idnom: 'idactividadcontenedor',
                    nomen: '1'
                },
                displayField: 'codigodenominacion',
                valueField: 'idactividadcontenedor',
                anchor: '90%',
                hiddenName: 'idactividadcontenedor',
                fieldLabel:_this.idioma.lbEstado
            })
        );*/
        return LOG.inv.rotacionlote.View.superclass.view.call(this);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            text: _this.idioma.lbBtnNuevo,
            tooltip: _this.idioma.ttBtnNuevo,
            disabled:false,
            handler: function() {
                _this.mostrarWinRotacionLote();

            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.addToolbarButton(this.btnNuevo);
        this.btnAbrir = LOG.util.Prototipos.botonAbrir({
            text: _this.idioma.lbBtnAbrir,
            tooltip: _this.idioma.ttBtnNuevo,
            disabled:true,
            handler: function() {
                _this.mostrarWinRotacionLote(_this.getSmPrincipal().getSelected());

            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.addToolbarButton(this.btnAbrir);
        this.btnEliminar = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.ttBtnEliminar,
            disabled:true,
            handler: function() {
                _this.eliminarRotacion();

            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.addToolbarButton(this.btnEliminar);
        this.btnRotar = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnRotar,
            tooltip:_this.idioma.ttBtnRotar,
            iconCls: 'cambiar',
            disabled:true/*,
            key: {
                alt: true,
                ctrl: true,
                shift: false,
                key: 'I'
            }*/,
            handler: function() {
                _this.rotarLotes();
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.addToolbarButton(this.btnRotar);
        this.btnImprimir = LOG.util.UIManager.createBtn({
            text: "Imprimir modelo",
            tooltip: _this.idioma.ttBtnImprimir,
            iconCls: 'imprimir',
            disabled:true,
            handler: function() {
                if (_this.getSmPrincipal().hasSelection()) {
                    LOG.inv.rotacionlote.fnImprimirRotaciones(_this.getSmPrincipal().getSelected().data.idrotacionlote, _this.idioma);
                }
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.addToolbarButton(this.btnImprimir);
    },
    render:function () {
        var _this = this;
        var vista = LOG.inv.rotacionlote.View.superclass.render.call(this);
        var fecha = new Ext.form.DateField({
            width: 170,
            fieldLabel: _this.idioma.lbFechaRotacion,
            //readOnly: true,
            format: 'd/m/Y',
            cls: 'form-control',
            name: 'fecha',
            emptyText: _this.idioma.ttBusFecha
        });
        this.gridFilter.btnLimpiar.handler = function() {
            var scope = _this.gridFilter;
            if (scope.btnLimpiar.disabled) {
                return;
            }
            // scope.tfBusqueda.setValue('');
            fecha.reset();
            scope.store.initBaseParams.fecha = "";
            fecha.blur();
            var params = {};
            Ext.apply(params, scope.store.limitParams);
            params.criterio = '';
            params.filtrado = false;
            scope.store.filtrado = false;
            scope.store.reload({
                params: params
            });
        };
        this.gridFilter.btnFiltar.handler = function() {
            var scope = _this.gridFilter;
            if (scope.btnFiltar.disabled) {
                return;
            }
            if (fecha.isDirty()) {
                if (fecha.isValid()) {
                    var params = {};
                    scope.store.initBaseParams.filtrado = true;
                    if (fecha.getValue()) {
                        scope.store.initBaseParams.fecha = fecha.getValue().format('d/m/Y');
                    }

                    Ext.apply(params, scope.store.initBaseParams);
                    Ext.apply(params, scope.store.limitParams);

                    scope.store.load({
                        params: params
                    });
                }
            }

        };
        this.gridFilter.tfBusqueda.setVisible(false);
        this.getGridPrincipal().getTopToolbar().insert(2, fecha);
        this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function (e) {
           if(e=='selectionchange')
           {
               _this.habDeshabButons();
           }
        });


        return vista;

    },
    habDeshabButons:function(){
      let _this = this;
      if(_this.getSmPrincipal().hasSelection())
      {
          _this.btnAbrir.enable();
          if(_this.getSmPrincipal().getSelected().data.estado == 3)
          {
              _this.btnEliminar.disable();
              _this.btnRotar.disable();
              _this.btnImprimir.enable();
          }else if(_this.getSmPrincipal().getSelected().data.estado == 1){
              _this.btnEliminar.enable();
              _this.btnRotar.enable();
              _this.btnImprimir.disable();
          }else{
              _this.btnEliminar.disable();
              _this.btnRotar.disable();
              _this.btnImprimir.disable();
          }
      }else{
          _this.btnAbrir.disable();
          _this.btnEliminar.disable();
          _this.btnRotar.disable();
          _this.btnImprimir.disable();
      }
    },
    onGridDobleClick:function(){
        this.mostrarWinRotacionLote(this.getSmPrincipal().getSelected());
    },
    mostrarWinRotacionLote:function (record) {
        var _this = this;
        var winAdd = new LOG.inv.rotacionlote.winAddRotacionLote({
            idioma:_this.idioma,
            height:_this.getVistaPrincipal().getHeight(),
            width:_this.getVistaPrincipal().getWidth(),
            _parent:_this,
            record:(record)?record.data:{}
        });
        winAdd.show();
    },
    eliminarRotacion:function(scope, fn, fnscope, el, idrotacion){
        let _this = scope || this;
        mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar la rotaci\xf3n de lotes seleccionada\x3f", function (btn) {
            if(btn == 'ok')
            {

                $.ajax({
                    url: 'eliminarRotacion',
                    method:'POST',
                    dataType:'json',
                    beforeSend:function () {
                        let indice = el || Ext.getBody();
                        _this.mask = new Ext.LoadMask(indice, {msg: "Eliminando datos..."}, {msgCls: 'mask-css'});
                        _this.mask.show();

                    },
                    success:function (resp, estatus, xhr) {
                        _this.mask.hide();
                        if (resp.success) {
                            var mensaje ="La rotaci\xf3n de lotes ha sido eliminada satisfactoriamente.";
                            mostrarMensaje(1, mensaje);
                            _this.getStorePrincipal().reload();
                            if(fn instanceof Function){
                                fn.call(fnscope);
                            }
                        }else {
                            mostrarMensaje(3, "Ocurri\xf3 un error eliminando datos.");
                        }
                    },
                    error:function (resp, estatus, xhr) {
                        mostrarMensaje(3, "Ocurri\xf3 un error eliminando datos.");
                    },
                    data:{
                        idrotacionlote:idrotacion || _this.getSmPrincipal().getSelected().data.idrotacionlote
                    }
                });
            }
        });
    },
    rotarLotes:function () {
        let _this = this;
        LOG.inv.rotacionlote.fnRotarLote(_this.getSmPrincipal().getSelected().data.idrotacionlote, this, function () {
            _this.getStorePrincipal().reload();
        }, Ext.getBody());
    }
});