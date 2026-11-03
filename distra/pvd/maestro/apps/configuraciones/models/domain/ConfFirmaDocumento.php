<?php

  /**
   * ReporteFiltroTexto
   *
   * @package Domain.
   * @subpackage Entity.
   * @copyright UCID
   * @version 1.0
   */
  class ConfFirmaDocumento extends BaseConfFirmaDocumento
  {
    public function setUp()
    {
      // $this->hasOne('ReporteFiltro', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
    }

    public static function obtenerPorId($id)
    {
      return Doctrine::getTable('ConfFirmaDocumento')->find($id);
    }

    public function estaDuplicado($iddocumentofirma, $idtipofirma, $idpersona, $identidad,
                                  $idfirmadocumento = false)
    {
      if (!$idfirmadocumento) {
        $sql  = "SELECT
  fd.idfirmadocumento,
  tf.denominacion AS tipofirma,
  fd.orden,
  (p.nombre||' '||p.papel||' '||p.sapel) as persona
FROM
  mod_rrhhmaestro.conf_firmadocumento fd INNER JOIN
  mod_rrhhmaestro.nom_tipofirma tf ON(fd.idtipofirma = tf.idtipofirma) LEFT JOIN
  mod_persona.dat_persona p ON (fd.idpersona = p.idpersona)
WHERE
  fd.iddocumentofirma = $iddocumentofirma AND
  fd.idtipofirma = $idtipofirma AND
  p.idpersona = $idpersona AND
  fd.identidad =$identidad ;  ";
      }else{
        $sql  = "SELECT
  fd.idfirmadocumento,
  tf.denominacion AS tipofirma,
  fd.orden,
  (p.nombre||' '||p.papel||' '||p.sapel) as persona
FROM
  mod_rrhhmaestro.conf_firmadocumento fd INNER JOIN
  mod_rrhhmaestro.nom_tipofirma tf ON(fd.idtipofirma = tf.idtipofirma) LEFT JOIN
  mod_persona.dat_persona p ON (fd.idpersona = p.idpersona)
WHERE
  fd.iddocumentofirma = $iddocumentofirma AND
  fd.idtipofirma = $idtipofirma AND
  p.idpersona = $idpersona AND
  fd.identidad =$identidad AND fd.idfirmadocumento<>$idfirmadocumento;  ";
      }
//print_r($sql);die;
      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();
      $r    = $conn->fetchAll($sql);

      return count($r) > 0;
    }




  }