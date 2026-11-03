<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
  class DatCertificacionModel extends ZendExt_Model
  {
      public function getCertificacionByPersona($idcompetenciapersona)
      {
          try {
              $dat = DatCertificacion::getCertificacionByPersona($idcompetenciapersona);
              return $dat;
          } catch (Exception $e) {
               return false;
          }
      }

      public function add($idcompetenciapersona, $fdesde, $fhasta, $idpersonaevaluacion, $idaccionparticipante)
      {
          try {
              if (isset($idpersonaevaluacion) || isset($idaccionparticipante)) {
                  $obj = new DatCertificacion();
                  $obj->idcompetenciapersona = $idcompetenciapersona;
                  $obj->fdesde = $fdesde;
                  $obj->fhasta = $fhasta;
                  $obj->idpersonaevaluacion = $idpersonaevaluacion;
                  $obj->idaccionparticipante = $idaccionparticipante;
                  $obj->save();
                  return true;
              } else {
                  return 2;
              }
          } catch (Exception $e) {
              return false;
          }
      }

      public function update($idcertificacion, $fdesde, $fhasta, $idpersonaevaluacion, $idaccionparticipante)
      {
          try {
              if (isset($idpersonaevaluacion) || isset($idaccionparticipante)) {
                  $obj = DatCertificacion::getById($idcertificacion);
                  $obj->fdesde = $fdesde;
                  $obj->fhasta = $fhasta;
                  $obj->idpersonaevaluacion = $idpersonaevaluacion;
                  $obj->idaccionparticipante = $idaccionparticipante;
                  $obj->save();
                  return true;
              } else {
                  return 2;
              }              
          } catch (Exception $e) {
              return false;
          }
      }

      public function delete($idcertificacion)
      {
          try {
              $obj = DatCertificacion::getById($idcertificacion);
              $obj->delete();
              return true;
          } catch (Exception $e) {
              if ($e->GetCode() == 23503) {
                  return false;
              }
          }
      }
  }
