<?php
/**
 * @name EstructuraconceptoController - Clase controladora de la configuración de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfpersonaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function confpersonaAction()
    {
        $this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render();
    }

    function getCfgpersonaAction()
    {
        //Obteniendo el resultado y enviando a la vista
        $result = ConfPersonaModel::getCfgpersona();
        echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result)));
    }

    public function addConfAction()
    {
        $idepersona = $this->_request->getPost('idepersona');
        $aprueba = $this->_request->getPost('aprueba');
        $elabora = $this->_request->getPost('elabora');
        $model = new ConfPersonaModel();
        $model->addConf($idepersona, $aprueba, $elabora);
        $r->codigo = 1;
        $r->mensaje = 'La firma ha sido adicionada satisfactoriamente';
        echo json_encode($r);

    }

    public function updConfAction()
    {

        $idfirma = $this->_request->getPost('idfirma');
        $idepersona = $this->_request->getPost('idepersona');
        $aprueba = $this->_request->getPost('aprueba');
        $elabora = $this->_request->getPost('elabora');
        $model = new ConfPersonaModel();
        $resu=$model-> updConf($idfirma,$idepersona, $aprueba, $elabora);
        if($resu==1){
            $r->codigo = 1;
            $r->mensaje = 'La firma ha sido modificada satisfactoriamente';
        }else{
            $r->codigo = 3;
            $r->mensaje = 'La firma que desea modificar  esta en uso';
        }
        echo json_encode($r);
    }

    public function delConfAction()
    {
        $idfirma=json_decode(stripslashes($this->_request->getPost('idfirma')));
        $model = new ConfPersonaModel();
        $resu=$model->delConf($idfirma);
        if($resu==1){
            $r->codigo = 1;
            $r->mensaje = 'La(s) firma(s) ha(n) sido eliminda(s) satisfactoriamente';
        }else{
            $r->codigo = 3;
            $r->mensaje = 'La(s) firma(s)que desea eliminar esta(n) en uso';
        }
        echo json_encode($r);
    }

}