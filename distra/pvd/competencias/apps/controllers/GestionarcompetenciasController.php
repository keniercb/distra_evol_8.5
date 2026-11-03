<?php

  /**
   * @name GestionarCompetenciasController
   * @package   competencia.configuracion
   * @copyright XETID.
   * @author    Centro RRHH. División Gestión de Entidades. XETID.
   * @version   1.0
   */
  class GestionarCompetenciasController extends ZendExt_Controller_Secure
  {
      function init()
      {
          parent::init();
      }

      function gestionarcompetenciasAction()
      {
          $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
          $this->render();
      }

      ////*************  Mostrar ******** \\\\
      function mostrarCompetenciasAction()
      {
          $start        = $this->_getParam('start', 0);
          $limit        = $this->_getParam('limit', 15);
          $competencias = new NomCompetencia();
          $resultado    = $competencias::getCompetencias(false, $start, $limit);
          echo Zend_Json::encode($resultado);
      }

      function mostrarCompetenciasEstructuraAction()
      {
          $start        = $this->_getParam('start', 0);
          $limit        = $this->_getParam('limit', 15);
          $idestructura = (int)$this->_getParam('idestructura');
          $denominacion = $this->_getParam('denominacion');
          $competenciasE = new DatCompetencia();
          $resultado     = $competenciasE::getCompetenciasXEstructura($idestructura, $denominacion, $start, $limit);

          foreach ($resultado->datos as $r => $result) {
              $escala = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalasPorId($result['idescala']);
              $resultado->datos[$r]['escala'] = $escala->denominacion;
              $d = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                  $result['idescala'], $result['idvalorescala']
              );
              $resultado->datos[$r]['nivelrequerido'] = $d;
          }
          echo Zend_Json::encode($resultado);
      }

      function mostrarValorEscalaAction()
      {
          $idescala    = $this->_getParam('idescala');
          $valorEscala = ZendExt_IoC_Inter::getInstance()->maestro->getValoresByEscala($idescala);
          echo Zend_Json::encode($valorEscala);
      }

      function mostrarNivelesCompetenciaAction()
      {
          $start          = $this->_getParam('start', 0);
          $limit          = $this->_getParam('limit', 15);
          $idescala       = $this->_getParam('idescala');
          $iddcompetencia = $this->_getParam('iddcompetencia');
          $denominacion   = $this->_getParam('denominacion');
          $nivelC = new DatNivelCompetenciaModel();
          $resultado = $nivelC::mostrarNiveles($idescala, $iddcompetencia, $denominacion, $start, $limit);
          echo Zend_Json::encode($resultado);
      }

      function mostrarClasificacionCompetenciasAction()
      {
          $start     = $this->_getParam('start', 0);
          $limit     = $this->_getParam('limit', 15);
          $clasific  = new NomClasificaciondecompetencia();
          $resultado = $clasific::getClasificaciones(false, $start, $limit);
          echo Zend_Json::encode($resultado);
      }

      function mostrarEscalaAction()
      {
          $escalas = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalas();
          echo Zend_Json::encode($escalas);
      }

      function mostrarCompetenciasProcesosAction()
      {
          $start        = $this->_getParam('start', 0);
          $limit        = $this->_getParam('limit', 15);
          $denominacion = $this->_getParam('denominacion', '');
          $idestructura = $this->_getParam('idestructura');
          $competencias = new DatCompetencia();

          $resultado    = $competencias::getCompetenciasXProcesos($idestructura,$denominacion, $start, $limit);

          foreach ($resultado->datos as $r => $result) {
              $escala = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalasPorId($result['idescala']);
              $resultado->datos[$r]['escala'] = $escala->denominacion;
              $d = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                  $result['idescala'], $result['idvalorescala']
              );
              $resultado->datos[$r]['nivelrequerido'] = $d;
          }
          echo Zend_Json::encode($resultado);
      }

      function mostrarCompetenciasCargosAction()
      {
          $start        = $this->_getParam('start', 0);
          $limit        = $this->_getParam('limit', 15);
          $denominacion = $this->_getParam('denominacion');
          $idestructura = $this->_getParam('idestructura');
          $competencias = new DatCompetencia();
          $resultado = $competencias::getCompetenciasXCargos($idestructura,$denominacion, $start, $limit);
          foreach ($resultado->datos as $r => $result) {
              $escala = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalasPorId($result['idescala']);
              $resultado->datos[$r]['escala'] = $escala->denominacion;
              $nr = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                  $result['idescala'], $result['idvalorescala']
              );
              $resultado->datos[$r]['nivelrequerido'] = $nr;
          }
          echo Zend_Json::encode($resultado);
      }

      function mostrarProcesosAction()
      {
          $idestructura = $this->_getParam('idestructura');
          $procesos     = ZendExt_IoC_Inter::getInstance()->orgtrabajo->getProcesosByEstructura($idestructura);
          echo Zend_Json::encode($procesos);
      }

      ////*************  Insertar ******** \\\\
      function insertarCompetenciaAction()
      {
          $parametros                      = new stdClass();
          $parametros->fdesde              = $this->_request->getPost('fdesde');
          $parametros->fhasta              = $this->_request->getPost('fhasta');
          $parametros->idclasifcompetencia = $this->_request->getPost('idclasifcompetencia');
          $parametros->idcompetencia       = $this->_request->getPost('idcompetencia');
          $parametros->idvalorescala       = $this->_request->getPost('idvalorescala');
          $parametros->orden               = $this->_request->getPost('orden');
          $parametros->idestructura        = $this->_request->getPost('idestructura');
          $parametros->idproceso           = $this->_request->getPost('idproceso');
          $parametros->tipo                = $this->_request->getPost('tipo');

          $obj = new DatCompetenciaModel();
          $obj->insertarCompetencia($parametros);
          echo(json_encode(true));
      }

      function insertarNivelCompetenciaAction()
      {
          $parametros                      = new stdClass();
          $parametros->idvalor  = $this->_request->getPost('idvalorescala');
          $parametros->descripcion    = $this->_request->getPost('descripcion');
          $parametros->idescala       = $this->_request->getPost('idescala');
          $parametros->iddcompetencia = $this->_request->getPost('iddcompetencia');

          $obj = new DatNivelCompetenciaModel();

          $obj->insertarNivelCompetencia($parametros);
          echo(json_encode(true));
      }

    ////*************  Modificar ******** \\\\
      function modificarCompetenciaAction()
      {
          $parametros                      = new stdClass();
          $parametros->fdesde              = $this->_request->getPost('fdesde');
          $parametros->fhasta              = $this->_request->getPost('fhasta');
          $parametros->idclasifcompetencia = $this->_request->getPost('idclasifcompetencia');
          $parametros->idcompetencia       = $this->_request->getPost('idcompetencia');
          $parametros->idvalorescala       = $this->_request->getPost('idvalorescala');
          $parametros->orden               = $this->_request->getPost('orden');
          $parametros->idescala            = $this->_request->getPost('idescala');
          $parametros->idestructura        = $this->_request->getPost('idestructura');
          $parametros->iddcompetencia      = $this->_request->getPost('iddcompetencia');
          $parametros->idproceso           = $this->_request->getPost('idproceso');
          $parametros->tipo                = $this->_request->getPost('tipo');
          $parametros->idcompetenciaproc   = $this->_request->getPost('idcompetenciaproc');

          $obj = new DatCompetenciaModel();
          $obj->modificarCompetencia($parametros);
          echo(json_encode(true));
      }

      function modificarNivelCompetenciaAction()
      {
          $parametros                      = new stdClass();
          $parametros->idvalorescala      = $this->_request->getPost('idvalorescala');
          $parametros->descripcion        = $this->_request->getPost('descripcion');
          $parametros->idescala           = $this->_request->getPost('idescala');
          $parametros->iddcompetencia     = $this->_request->getPost('iddcompetencia');
          $parametros->idnivelcompetencia = $this->_request->getPost('idnivelcompetencia');

          $obj = new DatNivelCompetenciaModel();

          $obj->modificarNivelCompetencia($parametros);

          echo(json_encode(true));
      }

    ////*************  Eliminar ******** \\\\
      function eliminarCompetenciasAction()
      {
          $idCompetenciasEstruc = json_decode(stripslashes($this->_request->getPost('idCompetenciasEstruc')));
          $response             = true;
          $obj                  = new DatCompetenciaModel();
          foreach ($idCompetenciasEstruc as $id) {
              $e = $obj->eliminarCompetencia($id);
              if ($e == false) {
                  $response = false;
              }
          }
          echo json_encode($response);
      }

      function eliminarCompetenciasProcesosAction()
      {
          $idCompetenciasEstruc = json_decode(stripslashes($this->_request->getPost('idCompetenciasProcesos')));
          $response             = true;
          $obj                  = new DatCompetenciaModel();
          foreach ($idCompetenciasEstruc as $id) {
              $e = $obj->eliminarCompetenciasProcesos($id);
              if ($e == false) {
                  $response = false;
              }
          }
          echo json_encode($response);
      }

      function eliminarCompetenciasCargosAction()
      {
          $idCompetenciasEstruc = json_decode(stripslashes($this->_request->getPost('idCompetenciasCargos')));
          $response             = true;
          $obj                  = new DatCompetenciaModel();
          foreach ($idCompetenciasEstruc as $id) {
              $e = $obj->eliminarCompetenciasCargo($id);
              if ($e == false) {
                  $response = false;
              }
          }
          echo json_encode($response);
      }

      function eliminarNivelesCompetenciasAction()
      {
          $idNivelCompetencias = json_decode(stripslashes($this->_request->getPost('idNivelCompetencias')));
          $response            = true;
          $obj                 = new DatNivelCompetenciaModel();
          foreach ($idNivelCompetencias as $id) {
              $e = $obj->eliminarNivelCompetencia($id);
              if ($e == false) {
                  $response = false;
              }
          }
          echo json_encode($response);
      }
  }