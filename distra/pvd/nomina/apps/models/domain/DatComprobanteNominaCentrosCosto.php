<?php

  class DatComprobanteNominaCentrosCosto extends BaseDatComprobanteCentrosCosto
  {

    public function setUp()
    {
      parent::setUp();

    }

    public static function obtenerObjComprobanteCC($idcomprobantenominacentrocosto) {
          return Doctrine::getTable('DatComprobanteNominaCentrosCosto')->find($idcomprobantenominacentrocosto);
    }

    public function obtenerComprobanteCentrosCostoxElaborarPagos($idelaborarpagos)
    {
      return Doctrine_Query::create()
        ->select('*')
        ->from('DatComprobanteNominaCentrosCosto')
        ->where('idelaborarpagos = ?', array($idelaborarpagos))
        ->fetchArray();
    }

    public function eliminarComprobanteCentrosCostoxElaborarPagos($idelaborarpagos)
    {
          return Doctrine_Query::create()
              ->delete('*')
              ->from('DatComprobanteNominaCentrosCosto')
              ->where('idelaborarpagos = ?', array($idelaborarpagos))
              ->fetchArray();
    }



  }
