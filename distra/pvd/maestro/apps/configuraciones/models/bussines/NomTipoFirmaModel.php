<?php

/**
 * NomTipoFirmaModel
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class NomTipoFirmaModel
{
    private $_validator;

  public function __construct()
  {
  }

 /*   public function getFilters($idreporte)
    {
        return $this->_reportefilterRepository->getListReporteFilters(
            array('sort'=> 'orden ASC', 'equalIdReporte'=> $idreporte)
        );
    }*/

  public function dameTodos()
  {
    $sql = "SELECT idtipofirma, denominacion
  FROM mod_rrhhmaestro.nom_tipofirma;";
    $mg = Doctrine_Manager::getInstance();
    $conn = $mg->getCurrentConnection();
    $r = $conn->fetchAll($sql);
 // print_r($r);die;
    return $r;

  }

  public function dameCantidadTodos()
  {
    return NomTipoFirma::dameCantidadTodos();

  }
}