<?php
/**
 * @name CargocomisionController - Clase controladora del nomenclador "Cargo para comisiones".
 * @extends ZendExt_Controller_Secure
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *      Ing. Orestes Rodríguez Lorenzo (olorenzo)
 *      Ing. Eddy Santana Navarro (esantana)
 * @date 19/10/2017
 * @modify 07/05/2018 by olorenzo
 * @version 1.0.1
 */

class CargocomisionController extends ZendExt_Controller_Secure
{
    private $model;

    function init()
    {
        parent::init();
        $this->model = new NomCargocomisionModel();
    }

    /**
     * @method cargocomision
     * @description Constructor de la clase
     * @author olorenzo
     * @date 19/10/2017
     * @modify 07/05/2018 by olorenzo
     *      - Iteración de la documentación.
     */
    function cargocomisionAction()
    {
        $this->render();
    }

    /**
     * @method getCargos
     * @description Obtiene el listado de los cargos para la gestión de las comisiones
     * @return Array - Arreglo con los datos de todos los cargos
     * @author esantana
     * @modify 07/05/2018 by olorenzo
     *      - Iteración de la documentación.
     *      - Reemplazo del objeto de la clase NomCargocomisionModel
     */
    function getCargosAction()
    {
        $arr = $this->model->getCargos(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar cargo para comision
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addCargoAction()
    {
        $obj = new NomCargocomisionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addCargo(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar cargo para comision
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateCargoAction()
    {
        $obj = new NomCargocomisionModel();
        $r = $obj->updateCargo(
            $this->_getParam('idcargocomision'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar cargo para comision
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteCargoAction()
    {
        $cargos = json_decode(stripslashes($this->_request->getPost('cargos')));
        $respuesta = true;
        $obj = new NomCargocomisionModel();
        foreach ($cargos as $p) {
            $r = $obj->deleteCargo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    private function _enviarNotificacionCorrecta()
    {
        echo "{success: 'true'}";
    }
}
