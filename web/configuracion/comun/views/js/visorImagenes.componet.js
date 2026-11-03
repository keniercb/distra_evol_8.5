/**
 * @autor Jorge Luis Cuellar
 * @version 1.0
 */
function visorImagenes(arrVisor, idimagen) {

    var _url_comun_views = 'configuracion/comun/views/';
    var idImgSeleccionada = idimagen;

    // Copia de la imagen a presentar
    var __imagen_;

    // Escala (%) para aumentar/disminuir la imagen
    var __escala = 10;

    // Creo la copia de la imagen a presentar
    var elemento = cloneImg(document.getElementById(idimagen));

    // Creo el fondo que bloquea la pantalla
    var div_visor_imagenes = document.createElement('div');
    div_visor_imagenes.setAttribute('class', 'ext-el-mask');

    // Adiciona ambos al body
    document.body.appendChild(div_visor_imagenes);

    var leftInicial = 54;
    var leftSeparacion = 4;

    var left = _btn_Menu(leftInicial, '/configuracion/comun/views/images/', 'cerrar', function () {
        cerrar_visor();
    });

    left = _btn_Menu(left, '/configuracion/comun/views/images/', 'alante', function () {
        cambiarImg('->');
    });
    _btn_Menu(left, '/configuracion/comun/views/images/', 'atras', function () {
        cambiarImg('<-');
    });

    document.body.insertBefore(elemento.dom, document.body.firstChild);

    elemento.center();
    elemento.show(true);
    add_scroll_event(elemento);

    function _btn_Menu(_left, _src, name, onclick) {

        var __btn_Menu_ = document.createElement('img');
        __btn_Menu_.id = '__btn_' + _left;
        __btn_Menu_.setAttribute('src', _src + name + '.png');
        __btn_Menu_.setAttribute('name', name);
        __btn_Menu_.setAttribute('class', '_btn_Menu_');
        __btn_Menu_.style.left = _left + "%";

        if (typeof(onclick) == 'function') {
            __btn_Menu_.onclick = onclick;
        }

        __btn_Menu_.onmouseover = function () {
            document.getElementById(__btn_Menu_.id).setAttribute('src', _src + __btn_Menu_.name + 2 + '.png');
        }

        __btn_Menu_.onmouseout = function () {
            document.getElementById(__btn_Menu_.id).setAttribute('src', _src + __btn_Menu_.name + '.png');
        }

        document.body.appendChild(__btn_Menu_);
        return parseInt(__btn_Menu_.style.left.split('%')[0]) - leftSeparacion;
    }

    function cambiarImg(direccion) {

        if (direccion == '->') {
            for (var i = arrVisor.length - 1; i >= 0; i --) {

                if (arrVisor[i] == idImgSeleccionada) {
                    var pos = i - 1;
                    idImgSeleccionada = (typeof(arrVisor[pos]) != 'undefined') ? arrVisor[pos] : arrVisor[arrVisor.length - 1];
                    break;
                }
            }
        } else {
            for (var i = 0; i < arrVisor.length; i ++) {

                if (arrVisor[i] == idImgSeleccionada) {
                    idImgSeleccionada = (typeof(arrVisor[i + 1]) != 'undefined') ? arrVisor[i + 1] : arrVisor[0];
                    break;
                }
            }
        }

        var padre = __imagen_.parentNode;
        padre.removeChild(__imagen_);

        var elemento = cloneImg(document.getElementById(idImgSeleccionada));

        elemento.hide();
        elemento.center();
        elemento.show(true);
        add_scroll_event(elemento);
    }

    function cloneImg(imagen) {
        __imagen_ = imagen.cloneNode(true);
        __imagen_.removeAttribute("onclick");
        __imagen_.removeAttribute("onDblClick");
        __imagen_.id = '__imagen_';
        __imagen_.setAttribute('class', '__imagen_');

        document.body.appendChild(__imagen_);

        var custom = new Ext.Resizable('__imagen_', {
            minHeight: 100,
            animate: true
        });
        var elemento = custom.getEl();

        return elemento;
    }

    function aumentar_IMG() {
        var _width = elemento.getWidth();
        var _height = elemento.getHeight();

        elemento.setWidth(_width + porciento(elemento, _width));
        elemento.setHeight(_height + porciento(elemento, _height));
        elemento.center();
    }

    function disminuir_IMG() {
        var _widthMin = elemento.getWidth() - porciento(elemento, elemento.getWidth());

        if (_widthMin > 300) {
            var _height = elemento.getHeight();

            elemento.setWidth(_widthMin);
            elemento.setHeight(_height - porciento(elemento, _height));
            elemento.center();
        }
    }

    function porciento(elemento, total) {
        return __escala * total / 100;
    }

    function add_scroll_event(elemento) {
        elemento.addListener('mousewheel', function (event) {
            if (event.getWheelDelta() > 0) {
                aumentar_IMG();
            } else {
                disminuir_IMG();
            }
        });
    }

    function cerrar_visor() {
        var padre = __imagen_.parentNode;
        padre.removeChild(__imagen_);

        padre = div_visor_imagenes.parentNode;
        padre.removeChild(div_visor_imagenes);

        for (var i = left; i <= leftInicial; i += leftSeparacion) {
            var hijo = document.getElementById('__btn_' + i);
            var padre = hijo.parentNode;
            padre.removeChild(hijo);
        }
        elemento.hide(true);
    }

    /**
     *  Manejar eventos a nivel pagina
     **/
    document.onkeyup = function (e) {

        // (39) ->
        if (e.which == 39) {
            cambiarImg('->');
        }
        // (37) ->
        else if (e.which == 37) {
            cambiarImg('<-');
        }
        // (27) scape
        else if (e.which == 27) {
            cerrar_visor();
        }
        // (38) arriba
        else if (e.which == 38) {
            aumentar_IMG();
        }
        // (40) abajo
        else if (e.which == 40) {
            disminuir_IMG();
        }
    }
}