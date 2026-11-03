<?php

  /**
   * ReporteFiltroTexto
   *
   * @package Domain.
   * @subpackage Entity.
   * @copyright UCID
   * @version 1.0
   */
  class NomDocumentoFirma extends BaseNomDocumentoFirma
  {
    public function setUp()
    {
      $this->hasOne('ReporteFiltro', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
    }

    public function formatFilterValues($values)
    {
      return array(
        'longitudminima' => ($values['longitudminima']) ? $values['longitudminima'] : null,
        'longitudmaxima' => $values['longitudmaxima'],
      );
    }


    public function obtenerPorId($idNomDocFirma)
    {
      return Doctrine::getTable('NomDocumentoFirma')->find($idNomDocFirma);
    }

    public function dameTodos()
    {

      $queryObj = Doctrine_Query::create()
        ->select('d.*')
        ->from('NomDocumentoFirma d');
      return $queryObj->fetchArray();
    }

    public function dameCantidadTodos()
    {

      $queryObj = Doctrine_Query::create()
        ->select('d.*')
        ->from('NomDocumentoFirma d');
      return $queryObj->fetchArray();

    }



  }