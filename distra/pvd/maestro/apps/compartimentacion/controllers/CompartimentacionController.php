<?php
class CompartimentacionController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function compartimentacionAction()
    {
        $this->render();
    }

    function getCompartimentacionesAction()
    {
        $limit = $this->_getParam('limit');
        $start = $this->_getParam('start');
        $arr = Array();
        $arr = SegCompartimentacionModel::getCompartimentaciones($start, $limit);
        echo Zend_Json::encode($arr);
    }

    function getUsuariosAction()
    {
        $limit = $this->_getParam('limit');
        $start = $this->_getParam('start');
        $filtro = $this->_getParam('filtro');
        $arr = ZendExt_IoC::getInstance()->seguridad->getUserList($limit, $start, $filtro);
        $r['datos'] = $arr['datos'];
        $r['cantidad'] = $arr['cantidad_filas'];
        echo Zend_Json::encode($r);
    }

    function getCompartByUsuarioAction()
    {  
		$idusuario = $this->_getParam('idusuario');
        $arr = Array();
        $arr = SegUsuariocompartimentacionModel::getCompartimentacionesByUser($idusuario);
        echo Zend_Json::encode($arr);
    }

    function guardarConfiguracionAction()
    {
        $idusuario = $this->_getParam('idusuario');
        $pordefecto = ($this->_getParam('pordefecto')=='')?null:$this->_getParam('pordefecto');
        // $compartimentaciones = json_decode(stripslashes($this->_request->getPost('compartimentaciones')));
        $compartimentaciones = json_decode($this->_request->getPost('compartimentaciones'));
        // foreach ($compartimentaciones as $c) {
        //     $r = SegUsuariocompartimentacionModel::add($idusuario, $c, $pordefecto);
        // }
            $r = SegUsuariocompartimentacionModel::add($idusuario, $compartimentaciones, $pordefecto);
      
        echo(json_encode($r));
    }
}