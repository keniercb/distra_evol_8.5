Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.panelCargarImagenes = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var _this = this;
        //_this.frame = true;
        _this.border = false;
        _this.region = config.region;
        _this.idioma = config.idioma;
        _this.anchor = '100%';
        _this.autoScroll = true;
        _this.bodyBorder = false;
        _this.layout = 'border';
        _this.arregloImagenesVisor = new Array();
        Ext.apply(this, config);
        LOG.inv.submayor.panelCargarImagenes.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        var _this = this;
        _this.idnewimg = 0;
        this.stImagenes = new Ext.data.JsonStore({
            root: 'datos',
            fields: ['src', 'idimagen'],
            listeners: {
                'add': function(store, records, index) {
                    if (records[0].data.idimagen && records[0].data.idimagen != "") {
                        _this.arregloImagenesVisor.push(records[0].data.idimagen);
                    }
                }
            }
        });
        if (_this.imagenesIndicador) {
            for (var i = 0; i < _this.imagenesIndicador.length; i++) {
                _this.stImagenes.insert(0, new _this.stImagenes.recordType({
                    idimagen: _this.imagenesIndicador[i]['idimagen'],
                    src: _this.imagenesIndicador[i]['src']
                }));
            }
        }
        this.btnMaximizarImg = LOG.util.UIManager.createBtn({
            text: 'Maximizar',
            tooltip: 'Maximizar imagen',
            iconCls: 'buscar',
            handler: function() {
                if (_this.dvImagenes.getSelectedNodes() && _this.dvImagenes.getSelectedNodes()[0]) {
                    _this.xVisorImagenes(_this.dvImagenes.getSelectedNodes()[0].getAttribute("idtem"));
                }
                else {
                    mostrarMensaje(1, "Debe seleccionar una imagen.");
                }
            }, 
             controlFn: function(b, _caller) {
                b.disable();
                    LOG.util.UIManager.encadenaFn(_caller, 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                           
                            console.debug(this.getSelectionCount());
                            if (this.getSelectionCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'maximixar');
                
            }
            
        });
        
        this.pBotonesImg = LOG.util.UIManager.initPanel({
            region: 'south',
            layout: 'column',
            baseCls: 'x-toolbar',
            height: 28,
            items: [
                {
                    columnWidth: .0,
                    items: [this.btnMaximizarImg]
                }
            ]
        });
        this.dvImagenes = new Ext.DataView({
            region: 'center',
            multiSelect: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            store: this.stImagenes,
            tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div idtem="{idimagen}" class="thumb-wrap" id="{name}">',
                    '<div class="thumb" width=100 height=100><img src="{src}" id="{idimagen}" /></div>',
                    '<span class="x-editable">{shortName}</span></div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'),
            listeners: {
                'dblclick': function(view, index, node, e) {
                    _this.xVisorImagenes(node.getAttribute("idtem"));
                }
            }

        });
        this.pImagenes = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'border',
            autoScroll: true,
            style: "background: white; font: 11px Arial, Helvetica, sans-serif;",
            items: [this.dvImagenes]
        });
        _this.items = [this.pImagenes,this.pBotonesImg];
        _this.on(
               'render',function(){
                    _this.btnMaximizarImg.controlFn.createDelegate(_this,[_this.btnMaximizarImg, _this.dvImagenes]).call();
               } 
        );
        LOG.inv.submayor.panelCargarImagenes.superclass.initComponent.call(this);
    },
    xVisorImagenes: function(idimagen) {
        var arrDimensionInicial = new Array();
        arrDimensionInicial[0] = 960;
        arrDimensionInicial[1] = 550;
        var _this = this;
        var idImgSelec = idimagen;
        var imagenBase;
        var escalaRedim = 10;
        var elemClonado = clonarImagen(document.getElementById(idimagen));
        if (arrDimensionInicial) {
            if (arrDimensionInicial.length == 2) {
                elemClonado.setWidth(arrDimensionInicial[0]);
                elemClonado.setHeight(arrDimensionInicial[1]);
            }
        }
        var div_visor_imagenes = document.createElement('div');
        div_visor_imagenes.setAttribute('class', 'ext-el-mask');
        document.body.appendChild(div_visor_imagenes);
        var leftInicial = 54;
        var leftSeparacion = 4;
        var left = botonesMenu(leftInicial, '/configuracion/comun/views/images/', 'cerrar', function() {
            cerrarvisorImagenes();
        });
        left = botonesMenu(left, '/configuracion/comun/views/images/', 'alante', function() {
            intercambiarImagen('->');
        });
        botonesMenu(left, '/configuracion/comun/views/images/', 'atras', function() {
            intercambiarImagen('<-');
        });
        document.body.insertBefore(elemClonado.dom, document.body.firstChild);
        elemClonado.center();
        elemClonado.show(true);
        adicionarEventos(elemClonado);

        function botonesMenu(_left, _src, name, onclick) {

            var btnMenu = document.createElement('img');
            btnMenu.id = '__btn_' + _left;
            btnMenu.setAttribute('src', _src + name + '.png');
            btnMenu.setAttribute('name', name);
            btnMenu.setAttribute('class', '_btn_Menu_');
            btnMenu.style.left = _left + "%";
            if (typeof (onclick) == 'function') {
                btnMenu.onclick = onclick;
            }
            btnMenu.onmouseover = function() {
                document.getElementById(btnMenu.id).setAttribute('src', _src + btnMenu.name + 2 + '.png');
            };
            btnMenu.onmouseout = function() {
                document.getElementById(btnMenu.id).setAttribute('src', _src + btnMenu.name + '.png');
            };
            document.body.appendChild(btnMenu);
            return parseInt(btnMenu.style.left.split('%')[0]) - leftSeparacion;
        }

        function intercambiarImagen(direccion) {

            if (direccion == '->') {
                for (var i = _this.arregloImagenesVisor.length - 1; i >= 0; i--) {
                    if (_this.arregloImagenesVisor[i] == idImgSelec) {
                        var pos = i - 1;
                        idImgSelec = (typeof (_this.arregloImagenesVisor[pos]) != 'undefined') ? _this.arregloImagenesVisor[pos] : _this.arregloImagenesVisor[_this.arregloImagenesVisor.length - 1];
                        break;
                    }
                }
            } else {
                for (var i = 0; i < _this.arregloImagenesVisor.length; i++) {

                    if (_this.arregloImagenesVisor[i] == idImgSelec) {
                        idImgSelec = (typeof (_this.arregloImagenesVisor[i + 1]) != 'undefined') ? _this.arregloImagenesVisor[i + 1] : _this.arregloImagenesVisor[0];
                        break;
                    }
                }
            }
            var padre = imagenBase.parentNode;
            padre.removeChild(imagenBase);
            var elemClon = clonarImagen(document.getElementById(idImgSelec));
            if (arrDimensionInicial) {
                if (arrDimensionInicial.length == 2) {
                    elemClon.setWidth(arrDimensionInicial[0]);
                    elemClon.setHeight(arrDimensionInicial[1]);
                }
            }
            elemClon.hide();
            elemClon.center();
            elemClon.show(true);
            adicionarEventos(elemClon);
        }

        function clonarImagen(imagen) {
            imagenBase = imagen.cloneNode(true);
            imagenBase.removeAttribute("onclick");
            imagenBase.removeAttribute("onDblClick");
            imagenBase.id = '__imagen_';
            imagenBase.setAttribute('class', '__imagen_');
            document.body.appendChild(imagenBase);
            var custom = new Ext.Resizable('__imagen_', {
                minHeight: 100,
                animate: true
            });
            var elem = custom.getEl();
            return elem;
        }

        function aumentarImagen() {
            var _width = elemClonado.getWidth();
            var _height = elemClonado.getHeight();
            elemClonado.setWidth(_width + porcentuarImagen(elemClonado, _width));
            elemClonado.setHeight(_height + porcentuarImagen(elemClonado, _height));
            elemClonado.center();
        }

        function disminuirImagen() {
            var _widthMin = elemClonado.getWidth() - porcentuarImagen(elemClonado, elemClonado.getWidth());
            if (_widthMin > 300) {
                var _height = elemClonado.getHeight();

                elemClonado.setWidth(_widthMin);
                elemClonado.setHeight(_height - porcentuarImagen(elemClonado, _height));
                elemClonado.center();
            }
        }

        function porcentuarImagen(elemento, total) {
            return escalaRedim * total / 100;
        }

        function adicionarEventos(elemento) {
            elemento.addListener('mousewheel', function(event) {
                if (event.getWheelDelta() > 0) {
                    aumentarImagen();
                } else {
                    disminuirImagen();
                }
            });
        }

        function cerrarvisorImagenes() {
            var padre = imagenBase.parentNode;
            padre.removeChild(imagenBase);

            padre = div_visor_imagenes.parentNode;
            padre.removeChild(div_visor_imagenes);

            for (var i = left; i <= leftInicial; i += leftSeparacion) {
                var hijo = document.getElementById('__btn_' + i);
                var padre = hijo.parentNode;
                padre.removeChild(hijo);
            }
            elemClonado.hide(true);
        }
        document.onkeyup = function(e) {
            if (e.which == 39) {
                intercambiarImagen('->');
            }
            else if (e.which == 37) {
                intercambiarImagen('<-');
            }
            else if (e.which == 27) { //scape
                cerrarvisorImagenes();
            }
            else if (e.which == 38) { //arriba
                aumentarImagen();
            }
            else if (e.which == 40) { //abajo
                disminuirImagen();
            }
        };
    }
});