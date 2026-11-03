<?php

  /**
   * @name ImportarexcelController - Clase controladora de la configuración de importar excel.
   * @package   maestro.configuraciones
   * @copyright XETID.
   * @author    Centro RRHH. División Gestión de Entidades. XETID.
   * @version   1.0
   */
  class ImportarexcelController extends ZendExt_Controller_Secure
  {
    function init()
    {
      parent::init();
    }

    function importarexcelAction()
    {
      $this->render();
    }

    public function obtenerModulosAction()
    {
      $objModel = new ConfImportarexcelModel(); /*
      $identidad   = $this->_request->getPost('identidad');
      $iddocumento = $this->_request->getPost('iddocumento');
      // $datos    = $objModel->getPieFirmaDocumentoXIdEntidad(100000532, 1);*/
      $datos    = $objModel->obtenerModulos();
      $cantidad = count($datos);
      //print_r($datos);die;
      echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => $cantidad));

    }

    public function obtenerElementosAction()
    {
      $idmodulo = $this->_request->getPost('idmodulo');

      if ($idmodulo == 4) {
        $objRC = new ConfImportarexcelModel();
        $datos = $objRC->obtenerElementos($idmodulo);
      }
      $cantidad = count($datos);
      echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => $cantidad));
    }

    public function obtenerConfiguracionAction()
    {
      $identidad  = $this->_request->getPost('identidad');
      $iddominio  = $this->_request->getPost('iddominio');
      $idelemento = $this->_request->getPost('idelemento');

      if ($iddominio == 4) {
        $datos              = array();
        $datosStore         = array();
        $objModel           = new ConfImportarexcelModel();
        $datosimportarexcel = $objModel->existeConfImportarExcel($iddominio, $identidad, $idelemento);

        $idimportarexcel                 = $datosimportarexcel[0]['idimportarexcel'];
        $datosCampos                     = $objModel->obtenerConfImportarExcel($idimportarexcel, $idelemento);
        $datosStore['cant']              = count($datosCampos);
        $datosStore['datos']             = $datosCampos;
        $datos['elementosconfiguracion'] = $datosimportarexcel;
        $datos['listadocampos']          = $datosStore;
        //print_r($datos);die;
      }


      echo Zend_Json::encode(array('datos' => $datos, 'codigo' => 1));

    }

    public function guardarConfiguracionAction()
    {
      $identidad                   = $this->_request->getPost('identidad');
      $iddominio                   = $this->_request->getPost('iddominio');
      $idelemento                  = $this->_request->getPost('idelemento');
      $arraycamposmodificados      = Zend_Json::decode(stripslashes($this->_request->getPost('arraycamposmodificados')));
      $arrayelementosconfiguracion = Zend_Json::decode(stripslashes($this->_request->getPost('arrayelementosconfiguracion')));

      if ($iddominio == 4) {
        $datos              = array();
        $datosStore         = array();
        $objModel           = new ConfImportarexcelModel();
        $datosimportarexcel = $objModel->guardarConfImportarExcel($iddominio, $identidad, $idelemento, $arraycamposmodificados, $arrayelementosconfiguracion);
      }
      echo Zend_Json::encode(array('succes' => true, 'codigo' => $datosimportarexcel));

    }

  }