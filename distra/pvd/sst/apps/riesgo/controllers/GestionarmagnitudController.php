<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 28/02/19
 * Time: 17:25
 */
class GestionarmagnitudController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionarmagnitudAction()
    {
        $this->render();
    }

    /**
     * Obtiene el listado de las configuraciones
     *
     * @return Arreglo con las configuraciones
     * @author Yaricel Guerra Velazquez
     */
    function getMagnitudAction()
    {
        $filtro = $this->_getParam('query');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = ConfMagnitudriesgoModel::getMagnitud($filtro, $limit, $start);
        echo Zend_Json::encode($datos);
    }

    /**
     * Adiciona configuracion
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Velazquez
     */
    function addMagnitudAction()
    {
        $modeloNegocio = new ConfMagnitudriesgoModel();
        $arr = $modeloNegocio->addMagnitud(
            $this->_getParam('denominacion'),
            $this->_getParam('idexpresionmatematica')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica configuraciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Velazquez
     */
    function modMagnitudAction()
    {
        $modeloNegocio = new ConfMagnitudriesgoModel();
        $arr = $modeloNegocio->modMagnitud(
            $this->_getParam('idmagnitudriesgo'),
            $this->_getParam('denominacion'),
            $this->_getParam('idexpresionmatematica')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina configuraciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Velazquez
     */
    function delMagnitudAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('magnitudes')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = ConfMagnitudriesgoModel::delMagnitud($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function actualizarOrdenAction()
    {
        try {
            $magnitudes = json_decode(stripslashes($this->_request->getPost('magnitudes')));
            $r = ConfMagnitudriesgoModel::actualizarOrden($magnitudes);
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }
}