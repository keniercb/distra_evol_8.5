<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaModel extends ZendExt_Model
  {
      public function __construct()
      {
          parent::ZendExt_Model();
          $this->instance = new DatCompetencia();
      }

      public function getCompetenciaByPersonaCargo($idcargo, $idpersona)
      {
          try {
              $dat = DatCompetencia::getCompetenciaByPersonaCargo($idcargo, $idpersona);
              if (count($dat) > 0) {
                  foreach ($dat as $p=>$comp) {
                      if (!empty($comp['idvalorrequerido'])) {
                          $nivelrequerido = ZendExt_IoC_Inter::getInstance()->maestro->getValorByIdEscalaIdValor(
                              $comp['idescala'], $comp['idvalorrequerido']
                          );
                          $dat[$p]['nivelrequerido'] = $nivelrequerido->valor;
                      }
                      if (!empty($comp['idvalorcertificado'])) {
                          $nivelcertificado = ZendExt_IoC_Inter::getInstance()->maestro->getValorByIdEscalaIdValor(
                              $comp['idescala'], $comp['idvalorcertificado']
                          );
                          $dat[$p]['nivelcertificado'] = $nivelcertificado->valor;
                      }
                      if (!empty($comp['idvalorrequerido']) && !empty($comp['idvalorcertificado'])) {
                          $dat[$p]['tipo'] = $nivelrequerido->tipo;
                          $dat[$p]['pesor'] = $nivelrequerido->peso;
                          $dat[$p]['pesoc'] = $nivelcertificado->peso;
                          if ($dat[$p]['tipo'] == 1) {
                              $dat[$p]['idoneo'] = ($dat[$p]['pesoc'] >= $dat[$p]['pesor'])?1:2;
                          } else {
                              $dat[$p]['idoneo'] = ($dat[$p]['nivelcertificado'] >= $dat[$p]['nivelrequerido'])?1:2;
                          }
                      } else {
                          $dat[$p]['idoneo'] = 2;
                      }
                  }
                  return $dat;
              } else {
                  return array();
              }
          } catch (Exception $e) {
              return false;
          }
      }

      public function insertarCompetencia($parametros)
      {
          try {
              $obj                      = new DatCompetencia();
              $obj->idcompetencia       = $parametros->idcompetencia;
              $obj->idclasifcompetencia = $parametros->idclasifcompetencia;
              $obj->idvalorescala       = $parametros->idvalorescala;
              //$obj->orden               = $parametros->orden;
              $obj->fdesde              = $parametros->fdesde;
              $obj->fhasta              = $parametros->fhasta;
              $obj->save();
              $iddcompetencia = $obj->iddcompetencia;
              switch ($parametros->tipo) {
                  case 'estructura':
                      $idestructura = $parametros->idestructura;
                      $estructura        = new DatCompetenciaOrgModel();
                      $estructura->insertar($iddcompetencia, $idestructura);
                      break;
                  case 'proceso':
                      $idproceso = $parametros->idproceso;
                      $proceso     = new DatCompetenciaProcModel();
                      $proceso->insertar($iddcompetencia, $idproceso);
                      break;
                  case 'cargo':
                      $idcargo = $parametros->idestructura;
                      $cargo   = new DatCompetenciaCargoModel();
                      $cargo->insertar($iddcompetencia, $idcargo);
                      break;
              }
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function modificarCompetencia($parametros)
      {
//          try {
              $obj                      = DatCompetencia::getById($parametros->iddcompetencia);
              if ($obj->idcompetencia != $parametros->idcompetencia) {
                  DatNivelCompetenciaModel::eliminarNivelByCompetencia($parametros->iddcompetencia);
              }
              $obj->idcompetencia       = $parametros->idcompetencia;
              $obj->idclasifcompetencia = $parametros->idclasifcompetencia;
              $obj->idvalorescala       = $parametros->idvalorescala;
              $obj->fdesde              = $parametros->fdesde;
              $obj->fhasta              = $parametros->fhasta;
              $tipo                     = $parametros->tipo;
              $obj->save();
//              switch ($tipo) {
//                  case 'estructura':
//                      $idestructura      = $parametros->idestructura;
//                      $estructura        = new DatCompetenciaOrgModel();
//                      $estructura->modificar($parametros->iddcompetencia, $idestructura);
//                      break;
//                  case 'proceso':
//                      $idproceso       = $parametros->idproceso;
//                      $proceso         = new DatCompetenciaProcModel();
//                      $proceso->modificar($parametros->idcompetenciaproc, $idproceso);
//                      break;
//                  case 'cargo':
//                      $idcargo = $parametros->idcargo;
//                      $cargo   = new DatCompetenciaCargoModel();
//                      $cargo->modificar($parametros->iddcompetencia, $idcargo);
//                      break;
//              }
              return true;
//          }catch (Exception $e) {
//              return false;
//          }
      }

      public function eliminarCompetencia($iddcompetencia)
      {
          try {
              $query   = Doctrine_Query::create();
              $query->delete('idnivelcompetencia')
                  ->from('DatNivelCompetencia')
                  ->where("iddcompetencia = $iddcompetencia")
                  ->execute();
              $query->delete('idcompetenciaorg')
                  ->from('DatCompetenciaOrg')
                  ->where("iddcompetencia = $iddcompetencia"
                  )->execute();
              $result  = $query->delete('iddcompetencia')
                  ->from('DatCompetencia')
                  ->where("iddcompetencia= $iddcompetencia")
                  ->execute();
              return $result  ;
          } catch (Doctrine_Exception $ee) {
              return false;
          }
      }

      public function eliminarCompetenciasProcesos($iddcompetencia)
      {
          try {
              $query   = Doctrine_Query::create();
              $query->delete('idnivelcompetencia')
                  ->from('DatNivelCompetencia')
                  ->where("iddcompetencia = $iddcompetencia")
                  ->execute();
              $query->delete('idcompetenciaorg')
                  ->from('DatCompetenciaProc')
                  ->where("iddcompetencia = $iddcompetencia")
                  ->execute();
              $result  = $query->delete('iddcompetencia')
                  ->from('DatCompetencia')
                  ->where("iddcompetencia= $iddcompetencia")
                  ->execute();
              return $result  ;
          } catch (Doctrine_Exception $ee) {
              return false;
          }
      }

      public function eliminarCompetenciasCargo($iddcompetencia)
      {
          try {
              $query   = Doctrine_Query::create();
              $query->delete('idnivelcompetencia')
                  ->from('DatNivelCompetencia')
                  ->where("iddcompetencia = $iddcompetencia")
                  ->execute();
              $query->delete('idcompetenciaorg')
                  ->from('DatCompetenciaCargo')
                  ->where("iddcompetencia = $iddcompetencia")
                  ->execute();
              $result  = $query->delete('iddcompetencia')
                  ->from('DatCompetencia')
                  ->where("iddcompetencia= $iddcompetencia")
                  ->execute();
              return $result  ;
          } catch (Doctrine_Exception $ee) {
              return false;
          }
      }
  }
