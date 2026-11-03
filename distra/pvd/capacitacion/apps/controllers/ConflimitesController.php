<?php
/**
 * @name ConflimitesController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConflimitesController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function conflimitesAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los límites
     * @return Arreglo con todas los límites
     * @author Yaricel Guerra Velazquez
     */
    function getLimitesAction()
    {
        $obj = new Conflimites();
        $arr = $obj->getLimites();
        echo Zend_Json::encode($arr);
    }

    /**
     * Modificar limites
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateLimiteAction()
    {
        $arraylimites = json_decode(stripslashes($this->_request->getPost('limites')));
        $obj = new ConflimitesModel();
        foreach ($arraylimites as $lim) {
            $r = $obj->updateLimite($lim->idlimite, $lim->valor);
        }
        echo Zend_Json::encode($r);
    }
}