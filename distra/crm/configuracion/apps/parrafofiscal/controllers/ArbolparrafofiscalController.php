<?php
/**
 * Clase controladora para cargar \xE1rbol de P\xE1rrafo Fiscal
 * 
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */

class ArbolparrafofiscalController extends ZendExt_Controller_Secure
{
/**
 * Inicializa la clase
 */
    function init()
    {
        parent::init();
        $this->model = new ParrafofiscalModel();
    }
/**
 * Inicializa la vista     
 */
    function arbolparrafofiscalAction()
    {
        $this->render();
    }
/**
 * Carga el \xE1rbol de p\xE1rrafos fiscales
 */
    function cargararbolAction()
    {
        $result = $this->model->devolverarbol(
            'mod_datosmaestros.nom_parrafofiscal',
            $this->_request->getPost('node')
        );
        if ($result != 0 && $result != 1 && $result != 2) {
            echo(json_encode($result));
        }
    }

}
