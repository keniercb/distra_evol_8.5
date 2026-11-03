<?php
/**
 * @name EscalaController
 * @package   maestro.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class EscalaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function escalaAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las escalas
     * @return Arreglo con todas las escalas
     * @author Yaricel Guerra Velazquez
     */
    function getEscalasAction()
    {
        $modeloNegocio = new ConfEscalaModel();
        $arr = $modeloNegocio->getEscalas(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de los valores cualitativos
     * @return Arreglo con todas los valores cualitativos
     * @author Yaricel Guerra Velazquez
     */
    function getValoresCualitativosAction()
    {
        $modeloNegocio = new DatEscalacualitativaModel();
        $arr = $modeloNegocio->getValoresCualitativos(
            $this->_getParam('idescala'),
            $this->_getParam('denominacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de los valores cualitativos o numéricos de la escala
     * @return Arreglo con todas los valores cualitativos u numéricos
     * @author Yaricel Guerra Velazquez
     */
    function getValoresEscalaAction()
    {
        $modeloNegocio = new ConfEscalaModel();
        $arr = $modeloNegocio->getValoresByEscala(
            $this->_getParam('idescala'),
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar escala
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addEscalaAction()
    {
        $obj = new ConfEscalaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $r = $obj->addEscala(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('tipo')
            );
            echo Zend_Json::encode($r);
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar escala
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateEscalaAction()
    {
        $obj = new ConfEscalaModel();
        $r = $obj->updateEscala(
            $this->_getParam('idescala'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('tipo')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar escala
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteEscalaAction()
    {
        $escalas = json_decode(stripslashes($this->_request->getPost('escalas')));
        $respuesta = true;
        $obj = new ConfEscalaModel();
        foreach ($escalas as $p) {
            $r = $obj->deleteEscala($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adicionar valor a escala
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addValorEscalaAction()
    {
        if ($this->_getParam('tipo') == 1) {
            $parametros = $this->_request->getParams();
            $valores = json_decode($parametros['valores']);
            foreach ($valores as $v) {
                $objcualit = new DatEscalacualitativaModel();
                $r = $objcualit->addEscala(
                    $this->_getParam('idescala'),
                    $v->idvalorcualitativo,
                    $v->peso
                );
            }
        } else {
            $objnum = new DatEscalanumericaModel();
            $r = $objnum->addEscala(
                $this->_getParam('idescala'),
                $this->_getParam('vinicial'),
                $this->_getParam('vfinal'),
                $this->_getParam('paso')
            );
        }
        echo json_encode($r);
    }

 /**
 * Eliminar valor a escala
 * @return Mensaje informando el resultado de la operación
 * @author Yaricel Guerra Velazquez
 */
    public function deleteValorEscalaAction()
    {
        $valores = json_decode(stripslashes($this->_request->getPost('valores')));
        $respuesta = true;
        $obj =  null;
        if ($this->_getParam('tipo') == 1) {
            $obj = new DatEscalacualitativaModel();
        } else {
            $obj = new DatEscalanumericaModel();
        }
        foreach ($valores as $p) {
            $r = $obj->deleteEscala($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Actualizar peso del valor a escala
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updatePesoAction()
    {
        $valores = json_decode(stripslashes($this->_request->getPost('valores')));
        $respuesta = true;
        $obj = new DatEscalacualitativaModel();
        foreach ($valores as $p) {
            $r = $obj->updatePeso($p->idescalacualitativa, $p->peso);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}