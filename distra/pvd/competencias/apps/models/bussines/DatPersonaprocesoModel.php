<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
  class DatPersonaprocesoModel extends ZendExt_Model
  {
      public function getPersonasByProceso($idproceso, $query, $start, $limit)
      {
          try {
              $datos = DatPersonaproceso::getPersonasByProceso($idproceso, $query, $start, $limit);
              foreach ($datos as $i=>$val) {
                  $datos[$i]['idoneo'] = ($val['idoneo'] == 1)?true:false;
                  $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($val['idcargo']);
                  $datos[$i]['cargo'] = $cargo[0]['denominacion'];
                  $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['identidad']);
                  $datos[$i]['entidad'] = $entidad[0]->denominacion;
                  $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idarea']);
                  $datos[$i]['area'] = $area[0]->denominacion;
                  $datos[$i]['entidad_area'] = $entidad[0]->denominacion . '->' . $area[0]->denominacion;
              }
              $dat->datos = $datos;
              $dat->cantidad = DatPersonaproceso::cantPersonasByProceso($idproceso, $query, $start, $limit);
              return $dat;
          } catch (Exception $e) {
               return false;
          }
      }

      public function add($idproceso, $idpersona)
      {
          try {
              $existe = $existe = DatPersonaproceso::existe($idproceso, $idpersona);
              if (count($existe) == 0) {
                  $obj = new DatPersonaproceso();
                  $obj->idproceso = $idproceso;
                  $obj->idpersona = $idpersona;
                  $obj->save();
                  $idoneidadactual = DatIdoneidad::existe($idpersona);
                  if (count($idoneidadactual) > 0) {
                      $objidoneidad = DatIdoneidad::getById($idoneidadactual[0]['ididoneidad']);
                      $objidoneidad->idoneo = 1;
                      $objidoneidad->save();
                  } else {
                      $objidoneidad = new DatIdoneidad();
                      $objidoneidad->idoneo = 1;
                      $objidoneidad->idpersona = $idpersona;
                      $objidoneidad->save();
                  }
                  return true;
              } else return 2;
          } catch (Exception $e) {
              return false;
          }
      }

      public function updateidoneidad($idpersonaproceso, $idoneo)
      {
          try {
              $obj = DatPersonaproceso::getById($idpersonaproceso);
              $obj->idoneo = $idoneo;
              $obj->save();
              $idoneidadactual = DatIdoneidad::existe($obj->idpersona);
              if (count($idoneidadactual) > 0) {
                  $objidoneidad = DatIdoneidad::getById($idoneidadactual[0]['ididoneidad']);
                  $objidoneidad->idoneo = $idoneo;
                  $objidoneidad->save();
              } else {
                  $objidoneidad = new DatIdoneidad();
                  $objidoneidad->idoneo = $idoneo;
                  $objidoneidad->idpersona = $obj->idpersona;
                  $objidoneidad->save();
              }
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function delete($idpersonaproceso)
      {
          try {
              $obj = DatPersonaproceso::getById($idpersonaproceso);
              $obj->delete();
              return true;
          } catch (Exception $e) {
              if ($e->GetCode() == 23503) {
                  return false;
              }
          }
      }
  }
