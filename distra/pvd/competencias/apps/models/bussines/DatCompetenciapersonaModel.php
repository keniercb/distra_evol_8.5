<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
  class DatCompetenciapersonaModel extends ZendExt_Model
  {
      public function geCompetenciasPersona($idpersona, $idcargo)
      {
          try {
              $dat = DatCompetenciapersona::geCompetenciasPersona($idpersona);
              foreach ($dat as $p=>$comp) {
                  $dat[$p]['valor'] = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                      $comp['idescala'], $comp['idvalor']
                  );
                  $dat[$p]['cargo'] = 0;
                  $dat[$p]['certificacionactiva'] = 0;
                  $certif = DatCertificacion::getCertificacionByPersona($comp['idcompetenciapersona']);
                  if ($certif) {
                      $dat[$p]['idcertificacion'] = $certif['idcertificacion'];
                      $dat[$p]['idpersonaevaluacion'] = $certif['idpersonaevaluacion'];
                      $dat[$p]['idaccionparticipante'] = $certif['idaccionparticipante'];
                      $dat[$p]['fdesdec'] = $certif['fdesde'];
                      $dat[$p]['fhastac'] = $certif['fhasta'];
                  } else {
                      $dat[$p]['idcertificacion'] = null;
                      $dat[$p]['idpersonaevaluacion'] = null;
                      $dat[$p]['idaccionparticipante'] = null;
                      $dat[$p]['fdesdec'] = null;
                      $dat[$p]['fhastac'] = null;
                  }
                  if (!empty($dat[$p]['idcertificacion'])) {
                      if (!empty($dat[$p]['idpersonaevaluacion'])) {
                          $pereval = DatCompetenciapersona::getDatosPersonaEvaluacion($dat[$p]['idpersonaevaluacion']);
                          $dat[$p]['proceso'] = $pereval[0]['proceso'];
                          $dat[$p]['periodo'] = $pereval[0]['periodo'];
                      }                     
                      
                      if (!empty($dat[$p]['fhastac'])) {
                          if (DatCompetenciapersonaModel::compararFechas(date('d/m/Y'), $dat[$p]['fhastac'])>0) {
                              $dat[$p]['certificacionactiva'] = 2;
                          } else {
                              $dat[$p]['certificacionactiva'] = 1;
                          }
                      } else {
                          $dat[$p]['certificacionactiva'] = 1;
                      }
                  }
                  if (!empty($idcargo)) {
                      $comcargo = DatCompetenciaCargo::dameCompetenciasCargo($idcargo);
                      foreach ($comcargo as $compc) {
                          if ($compc['idcompetencia']==$comp['idcompetencia']) {
                              $dat[$p]['cargo'] = 1;
                          }
                      }
                  }
              }
              return $dat;
          } catch (Exception $e) {
               return false;
          }
      }

      public function add($idpersona, $idcompetencia, $fdesde, $fhasta, $idvalorescala)
      {
          try {
              if (!empty($fdesde) && !empty($idvalorescala)) {
                  $obj = new DatCompetenciapersona();
                  $obj->idpersona = $idpersona;
                  $obj->idcompetencia = $idcompetencia;
                  $obj->fdesde = $fdesde;
                  $obj->fhasta = $fhasta;
                  $obj->idvalorescala = $idvalorescala;
                  $obj->save();
                  return true;
              } else {
                  return 2;
              }
          } catch (Exception $e) {
              return false;
          }
      }

      public function update($idcompetenciapersona, $fdesde, $fhasta, $idvalorescala)
      {
          try {
              $obj = DatCompetenciapersona::getById($idcompetenciapersona);
              $obj->fdesde = $fdesde;
              $obj->fhasta = $fhasta;
              $obj->idvalorescala = $idvalorescala;
              $obj->save();
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function delete($idcompetenciapersona)
      {
          try {
              $obj = DatCompetenciapersona::getById($idcompetenciapersona);
              $obj->delete();
              return true;
          } catch (Exception $e) {
              if ($e->GetCode() == 23503) {
                  return false;
              }
          }
      }

      private function compararFechas($primera, $segunda)
      {
          $valoresPrimera = explode("/", $primera);
          $valoresSegunda = explode("/", $segunda);
          $diaPrimera    = $valoresPrimera[0];
          $mesPrimera  = $valoresPrimera[1];
          $anyoPrimera   = $valoresPrimera[2];
          $diaSegunda   = $valoresSegunda[0];
          $mesSegunda = $valoresSegunda[1];
          $anyoSegunda  = $valoresSegunda[2];
          $diasPrimeraJuliano = gregoriantojd($mesPrimera, $diaPrimera, $anyoPrimera);
          $diasSegundaJuliano = gregoriantojd($mesSegunda, $diaSegunda, $anyoSegunda);
          if (!checkdate($mesPrimera, $diaPrimera, $anyoPrimera)) {
              // "La fecha ".$primera." no es válida";
              return 0;
          } else if (!checkdate($mesSegunda, $diaSegunda, $anyoSegunda)) {
              // "La fecha ".$segunda." no es válida";
              return 0;
          } else {
              return  $diasPrimeraJuliano - $diasSegundaJuliano;
          }
      }
  }
