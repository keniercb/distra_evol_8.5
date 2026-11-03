<?php

  /**
   * ReporteRepository
   *
   * @package Persistencia de datos.
   * @subpackage Interfaces Repositorios.
   * @copyright UCID
   * @version 1.0
   */
  class NomTipoFirma extends BaseNomTipoFirma
  {
    public function  __construct()
    {

    }

    /*public function getCountReportesInModules($idsmodule)
    {
      return $this->getBasicDqlQuery()
        ->whereIn('idmodulo', $idsmodule)
        ->count();
    }*/

    public function obtenerPorId($idNomDocFirma)
    {
      return Doctrine::getTable('NomTipoFirma')->find($idNomDocFirma);
    }

    public function dameTodos()
    {

      $queryObj = Doctrine_Query::create()
        ->select('d.*')
        ->from('NomTipoFirma d');
      print_r($queryObj->getSqlQuery());die;
      return $queryObj->fetchArray();
    }

    public function dameCantidadTodos()
    {

      $queryObj = Doctrine_Query::create()
        ->select('d.*')
        ->from('NomTipoFirma d');
      return $queryObj->fetchArray();

    }

  }