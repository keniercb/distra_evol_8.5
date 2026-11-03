/**
 * Created by juventus on 30/05/2018.
 */

function crearToolTip(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return val;
}

function crearToolTipNro(v, m) {
    m.attr = 'ext:qtip="' + separadorDeMiles(v) + '"';
    return separadorDeMiles(v);
}

function separadorDeMiles(nStr) {
    nStr += '';
    ds = nStr.replace(/,/g, '');
    nStr = ds;
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function renderAprobacion(val, m) {
    if (val == 3) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + etiqueta.lbRector + '"';
        m.css = 'icondistra-true verde';
    } else if (val == 5) {
        m.attr = 'ext:qtip="' + etiqueta.lbAjuste + '"';
        m.css = 'icondistra-true azul';
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderDesglosada(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + etiqueta.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else if (val == 2) {
        m.attr = 'ext:qtip="' + etiqueta.lbParcial + '"';
        m.css = 'icondistra-true amarillo';
    } else {
        m.attr = 'ext:qtip="' + etiqueta.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}

function renderEspecialidad(value, m) {
    for (i in stEspecialidadesTodas.data.items)
        if (stEspecialidadesTodas.data.items[i].data.idespecialidad == value) {
            m.attr = 'ext:qtip="' + stEspecialidadesTodas.data.items[i].data.denespecialidad + '"';
            return stEspecialidadesTodas.data.items[i].data.denespecialidad;
        }
    m.attr = 'ext:qtip="' + value + '"';
    return '-';
}

function renderComportamiento(value, m) {
    for (i in stComportamientos.data.items)
        if (stComportamientos.data.items[i].data.iddatosnomenclador == value) {
            m.attr = 'ext:qtip="' + stComportamientos.data.items[i].data.denominacion + '"';
            return stComportamientos.data.items[i].data.denominacion;
        }
    m.attr = 'ext:qtip="' + value + '"';
    return '-';
}

function renderModelo(value, m) {
    for (i in stModelos.data.items) {
        if (stModelos.data.items[i].data) {
            if (stModelos.data.items[i].data.idmodelo == value) {
                m.attr = 'ext:qtip="' + stModelos.data.items[i].data.denominacion + '"';
                return stModelos.data.items[i].data.denominacion;
            }
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return '-';
}

function cambiarTituloFiltrar(gridPanel, filtro, etiquetaF) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiquetaF);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta.lbFiltradoPorNiv + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function cambiarTituloFiltrarDesglose() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosDesgloses.getFiltrosActivos() == undefined || filtrosDesgloses.getFiltrosActivos().length == 0) {
        pgridDesgloses.setTitle(etiqueta.lbDesgloses);        
    } else {        
        for (i = 0; i < filtrosDesgloses.getFiltrosActivos().length; i++) {
            var numberCol = cmDesgloses.findColumnIndex(filtrosDesgloses.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosDesgloses.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += cmDesgloses.getColumnHeader(numberCol) + sep;
        }
        pgridDesgloses.setTitle(etiqueta.lbDesgloses + "<i> " + etiqueta.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function accionbtnLimpiarDesgloses() {
    filtrosDesgloses.clearFilters();
}
function getRawValue(v, cmb, g, c) {
    var arrid = (v != null) ? v.split(",") : '';

    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
    }
    return str;
}
