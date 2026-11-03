<?php

  /**
   * @name ConfPieFirmaController - Clase controladora de la configuración de firmas.
   * @package   maestro.configuraciones
   * @copyright XETID.
   * @author    Centro RRHH. División Gestión de Entidades. XETID.
   * @version   1.0
   */
  class ConfpiefirmaController extends ZendExt_Controller_Secure
   {
    public $objModel;
    public $arrayPago;

    function init()
    {
      $this->objModel = new NomDocumentoFirmaModel();
      parent::init();
    }

    function confpiefirmaAction()
    {
      $this->render();
    }

    function obtenerDocFirmaAction()
    {
      $objModel = new NomDocumentoFirmaModel();
      //$identidad = $this->_request->getPost('identidad');
      $datos    = $objModel->dameTodos();
      $cantidad = count($datos);
      // print_r($cantidad);die;
      echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => $cantidad));

    }

    public function obtenerConfFirmaAction()
    {
      $objModel    = new ConfFirmaDocumentoModel();
      $identidad   = $this->_request->getPost('identidad');
      $iddocumento = $this->_request->getPost('iddocumento');
     // $datos    = $objModel->getPieFirmaDocumentoXIdEntidad(100000532, 1);
     $datos    = $objModel->getPieFirmaDocumentoXIdEntidad($identidad,$iddocumento);
      $cantidad = count($datos);//print_r($datos);die;
      echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => $cantidad));

    }

    public function obtenerTipoFirmaAction()
    {
      $objModel = new NomTipoFirmaModel();
      //$identidad = $this->_request->getPost('identidad');
      $datos = $objModel->dameTodos();
      //print_r($datos);die;
      $cantidad = count($datos);
      echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => $cantidad));


    }

    public function adicionarConfFirmaAction()
    {
      $iddocumentofirma = $this->_request->getPost('iddocumentofirma');
      $idtipofirma = $this->_request->getPost('idtipofirma');
      $idpersona = $this->_request->getPost('idpersona');
      $identidad = $this->_request->getPost('identidad');
      $orden = $this->_request->getPost('orden');


      $objModel = new ConfFirmaDocumentoModel();
      $result= $objModel->adicionar($iddocumentofirma,$idtipofirma,$idpersona,$identidad,$orden);

      $succes=($result==1)?true:false;
      echo Zend_Json::encode(array('success' => $succes, 'codigo' => $result));

    }

    public function actualizarConfFirmaAction()
    {

      $idfirmadocumento = $this->_request->getPost('idfirmadocumento');
      $iddocumentofirma = $this->_request->getPost('iddocumentofirma');
      $idtipofirma = $this->_request->getPost('idtipofirma');
      $idpersona = $this->_request->getPost('idpersona');
      $identidad = $this->_request->getPost('identidad');
      $orden = $this->_request->getPost('orden');


      $objModel = new ConfFirmaDocumentoModel();
      $result= $objModel->actualizar($idfirmadocumento,$iddocumentofirma,$idtipofirma,$idpersona,
        $identidad,$orden);

      $succes=($result==1)?true:false;
      echo Zend_Json::encode(array('success' => $succes, 'codigo' => $result));

    }


    public function eliminarConfFirmaAction()
    {
      $idconfdocumento = $this->_request->getPost('idconfdocumento');
      $objModel = new ConfFirmaDocumentoModel();
      $result= $objModel->Eliminar($idconfdocumento);
      $succes=($result==1)?true:false;
      echo Zend_Json::encode(array('success' => $succes, 'codigo' => $result));

    }

  }