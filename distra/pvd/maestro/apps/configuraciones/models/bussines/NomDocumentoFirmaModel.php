<?php

  /**
   * ReporteWebService
   *
   * @package Domain.
   * @subpackage Domain services.
   * @copyright UCID
   * @version 1.0
   */
  class NomDocumentoFirmaModel
  {
    public function __construct()
    {
    }

    public function getReportDataFromJasperServer($resource, $format, $filters)
    {
      $handler = curl_init($this->getUrl($resource, $format, $filters));
      curl_setopt($handler, CURLOPT_RETURNTRANSFER, TRUE);
      $response = curl_exec($handler);
      curl_close($handler);
      return $response;
    }


    public function dameTodos()
    {
      return NomDocumentoFirma::dameTodos();

    }

    public function dameCantidadTodos()
    {
      return NomDocumentoFirma::dameCantidadTodos();

    }
    public function Eliminar($idc){
      try {
        $o = Doctrine::getTable('SegCompartimentacionNomina')->find($idc);
        $o->delete();
        return 1;
      }catch (Exception $e){
        if($e->getCode() == 23503)//Code for foreignKeyViolation
          return 0;

      }
    }



  }