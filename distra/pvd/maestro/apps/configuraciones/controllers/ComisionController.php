<?php
/**
 * @name ComisionController
 * @package   maestro.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ComisionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function comisionAction()
    {
    }
    
    /**
     * Obtiene el listado de las comisiones
     * @return Arreglo con todas las comisións
     * @author Yaricel Guerra Velazquez
     */
    function getComisionesAction()
    {
        $modeloNegocio = new DatComisionModel();
        $arr = $modeloNegocio->getComisiones(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de miembros dada una comisión
     * @return Arreglo con todos los miembros de una comisión
     * @author Yaricel Guerra Velazquez
     */
    function getMiembrosByComisionAction()
    {
        $modeloNegocio = new DatComisionmiembroModel();
        $arr = $modeloNegocio->getMiembrosByidcomision(
            $this->_getParam('idcomision'),
            $this->_getParam('query'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    function getDominiosAction()
    {
        $arr = NomDominioModel::obtenerDominios();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Velázquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            $filtro,
            null,
            null,
            $start,
            $limit,
            1
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de cargos de las comisiones
     * @return Arreglo con los cargos de las comisiones
     * @author Yaricel Guerra Velázquez
     */
    function getCargosComisionesAction()
    {
        $modeloNegocio = new NomCargocomision();
        $datos = $modeloNegocio->getCargosActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Adicionar comisiones
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addComisionAction()
    {
        $dominios = explode(',', $this->_request->getPost('dominios'));
        $obj = new DatComisionModel();
        $r = $obj->add(
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $dominios
        );
        echo Zend_Json::encode($r);           
    }

    /**
     * Modificar comisión
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateComisionAction()
    {
        $dominios = explode(',', $this->_request->getPost('dominios'));
        $obj = new DatComisionModel();
        $r = $obj->update(
            $this->_getParam('idcomision'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $dominios
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar comisión
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteComisionAction()
    {
        $comisiones = json_decode(stripslashes($this->_request->getPost('comisiones')));
        $respuesta = true;
        $obj = new DatComisionModel();
        foreach ($comisiones as $p) {
            $r = $obj->delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adicionar miembros a comisión
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addMiembroAction()
    {
            $parametros = $this->_request->getParams();
            $valores = json_decode($parametros['miembros']);
            foreach ($valores as $v) {
                $obj= new DatComisionmiembroModel();
                $r = $obj->add(
                    $this->_getParam('idcomision'),
                    $v->idpersona,
                    $v->idcargocomision,
                    $v->fdesd,
                    $v->fhast
                );
            }

        echo json_encode($r);
    }

    /**
     * Modificar miembros de comisión
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function modMiembroAction()
    {
        $obj= new DatComisionmiembroModel();
        $r = $obj->update(
            $this->_getParam('idcomisionpersona'),
            $this->_getParam('idcargocomision'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo json_encode($r);
    }

 /**
 * Eliminar valor a comisión
 * @return Mensaje informando el resultado de la operación
 * @author Yaricel Guerra Velazquez
 */
    public function deleteMiembroAction()
    {
        $valores = json_decode(stripslashes($this->_request->getPost('valores')));
        $respuesta = true;
        $obj = new DatComisionmiembroModel();
        foreach ($valores as $p) {
            $r = $obj->delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}