<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
  class DatProcesoModel extends ZendExt_Model
  {
      public function getProcesos($idestructura, $query, $start, $limit)
      {
          try {
              $hijosest =  ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);
              $estructuras = array($idestructura);
              foreach ($hijosest as $est) {
                  array_push($estructuras, $est->id);
              }
              $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
              foreach ($entidades as $e) {
                  array_push($estructuras, $e->idfila);
              }
              $datos = DatProceso::getProcesos($estructuras, $query, $start, $limit);
              foreach ($datos as $i=>$val) {
                  $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idestructura']);
                  $datos[$i]['estructura'] = $estructura[0]->denominacion;
                  $datos[$i]['comision'] = DatProceso::getDenomComisiones($val['idcomision']);
              }
              $dat->datos = $datos;
              $dat->cantidad = DatProceso::cantProcesos($estructuras, $query, $start, $limit);
              return $dat;
          } catch (Exception $e) {
               return false;
          }
      }

      public function add($denominacion, $fdesde, $fhasta, $idcomision, $idestructura)
      {
          try {
              $existe = $existe = DatProceso::existe($denominacion);
              if (count($existe) == 0) {
                  $obj = new DatProceso();
                  $obj->denominacion = $denominacion;
                  $obj->fdesde = $fdesde;
                  $obj->fhasta = $fhasta;
                  $obj->idcomision = $idcomision;
                  $obj->idestructura = $idestructura;
                  $obj->save();
                  return true;
              } else return 2;
          } catch (Exception $e) {
              return false;
          }
      }

      public function update($idproceso, $denominacion, $fdesde, $fhasta, $idcomision)
      {
          try {
              $existe = $existe = DatProceso::existe($denominacion);
              if (count($existe) == 0 || $existe[0]['idproceso'] == $idproceso) {
                  $obj = DatProceso::getById($idproceso);
                  $obj->denominacion = $denominacion;
                  $obj->fdesde = $fdesde;
                  $obj->fhasta = $fhasta;
                  $obj->idcomision = $idcomision;
                  $obj->save();
                  return true;
              } else {
                  return 2;
              }
          } catch (Exception $e) {
              return false;
          }
      }

      public function delete($idproceso)
      {
          try {
              $obj = DatProceso::getById($idproceso);
              $obj->delete();
              return true;
          } catch (Exception $e) {
              if ($e->GetCode() == 23503) {
                  return false;
              }
          }
      }
  }
