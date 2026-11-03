<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
  class DatIdoneidadModel extends ZendExt_Model
  {
      public function getPersonasByEstructura($idestructura, $query, $start, $limit, $noidon)
      {
          try {
              $idcargos = Array();
              $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
              if (count($cargos) > 0) {
                  foreach ($cargos as $h => $carg) {
                      $idcargos[$h] = $carg['idcargo'];
                  }
              }
              $datos = DatIdoneidad::getPersonasByCargos($idcargos, $query, $start, $limit, $noidon);
              foreach ($datos as $i=>$val) {
                  $datos[$i]['tipo'] = 2;
                  $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($val['idcargo']);
                  $datos[$i]['cargo'] = $cargo[0]['denominacion'];
                  $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['identidad']);
                  $datos[$i]['entidad'] = $entidad[0]->denominacion;
                  $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idarea']);
                  $datos[$i]['area'] = $area[0]->denominacion;
                  $datos[$i]['entidad_area'] = $entidad[0]->denominacion . '->' . $area[0]->denominacion;
              }
              $datos = DatIdoneidadModel::ordenarInfoByCargo($idcargos, $datos);
              $dat->datos = $datos;
              $dat->cantidad = DatIdoneidad::cantPersonasByCargos($idcargos, $query, $start, $limit, $noidon);
              return $dat;
          } catch (Exception $e) {
               return false;
          }
      }

      private function ordenarInfoByCargo(array $orden, array $datos)
      {
          $result = Array();
          $pos = count($datos);
          foreach ($orden as $val) {
              foreach ($datos as $obj) {
                  if ($val == $obj['idcargo']) {
                      array_push($result, $obj);
                      $result[count($result)-1]['orden'] = $pos;
                      $pos--;
                  }
              }
          }
          return $result;
      }
  }
