<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
  class DatPersonarecomendacionModel extends ZendExt_Model
  {
      public function getRecomendaciones($idpersonaproceso, $start, $limit)
      {
          try {
              $dat->datos = DatPersonarecomendacion::getRecomendaciones($idpersonaproceso, $start, $limit);
              $dat->cantidad = DatPersonarecomendacion::cantRecomendaciones($idpersonaproceso, $start, $limit);
              return $dat;
          } catch (Exception $e) {
               return false;
          }
      }

      public function add($idpersonaproceso, $recomendacion)
      {
          try {
              $obj = new DatPersonarecomendacion();
              $obj->idpersonaproceso = $idpersonaproceso;
              $obj->recomendacion = $recomendacion;
              $obj->save();
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function update($idpersonarecomendacion, $idpersonaproceso, $recomendacion)
      {
          try {
              $obj = DatPersonarecomendacion::getById($idpersonarecomendacion);
              $obj->idpersonaproceso = $idpersonaproceso;
              $obj->recomendacion = $recomendacion;
              $obj->save();
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function delete($idpersonarecomendacion)
      {
          try {
              $obj = DatPersonarecomendacion::getById($idpersonarecomendacion);
              $obj->delete();
              return true;
          } catch (Exception $e) {
              if ($e->GetCode() == 23503) {
                  return false;
              }
          }
      }
  }
