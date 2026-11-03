<?php

  /**
   * Controlador de firmas de documentos.
   *
   * @package Presentación.
   * @subpackage Controlador.
   * @copyright UCID
   * @version 1.0
   */
  class ConfFirmaDocumentoModel
  {


    public function __construct()
    {
    }


    public function dameTodos()
    {
      return NomDocumentoFirma::dameTodos();

    }

    public function dameCantidadTodos()
    {
      return NomDocumentoFirma::dameCantidadTodos();

    }

    public function Eliminar($idc)
    {
      try {
        $o = Doctrine::getTable('ConfFirmaDocumento')->find($idc);

        $o->delete();
        return 1;
      } catch (Exception $e) {

        if ($e->getCode() == 23503) //Code for foreignKeyViolation
          return 0;

      }
    }

    public function adicionar($iddocumentofirma, $idtipofirma, $idpersona, $identidad, $orden)
    {


        if (!ConfFirmaDocumento::estaDuplicado($iddocumentofirma, $idtipofirma, $idpersona, $identidad)) {

          //Se crea el objeto del area.
          $objDoc = new ConfFirmaDocumento();

          //Insertando los datos del area.
          $objDoc->iddocumentofirma = $iddocumentofirma;
          $objDoc->idtipofirma      = $idtipofirma;
          $objDoc->idpersona        = $idpersona;
          $objDoc->identidad        = $identidad;
          $objDoc->orden            = $orden;

          //Guardando los datos.

          $objDoc->save();
          return 1;
        } else {
          return 3;
        }

    }
    public function actualizar($idfirmadocumento,$iddocumentofirma, $idtipofirma, $idpersona,
                                $identidad, $orden)
    {


        if (!ConfFirmaDocumento::estaDuplicado($iddocumentofirma, $idtipofirma, $idpersona,
          $identidad,$idfirmadocumento)) {

          //Se crea el objeto del area.
          $objDoc =  ConfFirmaDocumento::obtenerPorId($idfirmadocumento);

          //Insertando los datos del area.
          $objDoc->iddocumentofirma = $iddocumentofirma;
          $objDoc->idtipofirma      = $idtipofirma;
          $objDoc->idpersona        = $idpersona;
          $objDoc->identidad        = $identidad;
          $objDoc->orden            = $orden;

          //Guardando los datos.

          $objDoc->save();
          return 1;
        } else {
          return 3;
        }

    }

    static public function getPieFirmaDocumentoXIdEntidad($identidad, $iddocumento)
    {
      $sql  = "SELECT
  fd.idfirmadocumento,
  tf.denominacion AS tipofirma,
  fd.orden,
  p.idpersona,
  tf.idtipofirma,
  (p.nombre||' '||p.papel||' '||p.sapel) as persona
FROM
  mod_rrhhmaestro.conf_firmadocumento fd INNER JOIN
  mod_rrhhmaestro.nom_tipofirma tf ON(fd.idtipofirma = tf.idtipofirma) LEFT JOIN
  mod_persona.dat_persona p ON (fd.idpersona = p.idpersona)
WHERE
  fd.iddocumentofirma = $iddocumento AND
  fd.identidad = $identidad; ";
      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();
      $r    = $conn->fetchAll($sql);
      return $r;
    }

  }