<?php

/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   movimientoslaborales.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ReportcaractController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();

    }

    function reportcaractAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    /**
     * @method getListaAnalisis
     * Devuelve la lista de análisis a mostrar en el menú.
     * @return Array - Arreglo con los elementos a mostrar en el menú.
     * @author Orestes Rodríguez Lorenzo.
     */

    function reporteAction()
    {
        $f = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReportcaractModel();
        $result = $model->reporte($f[0]->value);
        echo json_encode($result);
    }


}