/**
 * Created 
 */

//funciones renders
function crearToolTipPlanes(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function AprobacionPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == 1)
        return 'No';
    else if (value == 2)
        return 'Si';
    else
        return 'Rector';
}

function CantidadPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}

function cambiarTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosgpModeloPlanes.getFiltrosActivos() == undefined || filtrosgpModeloPlanes.getFiltrosActivos().length == 0) {
        pModeloPlanes.setTitle(perfil.etiquetas.titModelos);
    } else {
        for (i = 0; i < filtrosgpModeloPlanes.getFiltrosActivos().length; i++) {
            var numberCol = columnasDinamicasgpModeloPlanes.findColumnIndex(filtrosgpModeloPlanes.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosgpModeloPlanes.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += columnasDinamicasgpModeloPlanes.getColumnHeader(numberCol) + sep;
        }
        pModeloPlanes.setTitle('Detalles del plan ' + '<i>- Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}




