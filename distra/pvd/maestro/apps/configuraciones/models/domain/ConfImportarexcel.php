<?php

  /**
   * @name ConfImportarexcel - Clase del dominio para la configuracion de importar excel.
   * @package   maestro.configuraciones
   * @copyright XETID.
   * @author    Centro RRHH. División Gestión de Entidades. XETID.
   * @version   1.0
   */
  class ConfImportarexcel extends BaseConfImportarexcel
  {
    public function setUp()
    {
      parent:: setUp();
      $this->hasOne('NomDominio', array('local' => 'iddominio', 'foreign' => 'iddominio'));
      $this->hasMany('ConfImportarcamposexcel', array('local' => 'idimportarexcel', 'foreign' => 'idimportarexcel'));
    }

    public function obtenerPorId($idimportarexcel)
    {
      return Doctrine::getTable('ConfImportarexcel')->find($idimportarexcel);
    }

    public function existeConfImportarExcel($iddominio, $identidad, $idelemento)
    {
      $queryObj = Doctrine_Query::create()
        ->select('i.*')
        ->from('ConfImportarexcel i')
        ->where("i.iddominio = '$iddominio' AND i.identidad = '$identidad' AND i.idelemento = '$idelemento'");

      return $queryObj->fetchArray();
    }
    public function guardarConfImportarExcel($iddominio, $identidad, $idelemento,$arraycamposmodificados,$arraycamposmodificados)
    {
      $queryObj = Doctrine_Query::create()
        ->select('i.*')
        ->from('ConfImportarexcel i')
        ->where("i.iddominio = '$iddominio' AND i.identidad = '$identidad' AND i.idelemento = '$idelemento'");

      return $queryObj->fetchArray();
    }

    public function obtenerConfImportarExcel($idimportarexcel, $idelemento)
    {
      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();
      if (!$idimportarexcel) {
        $sql = "SELECT
 cvrc.idvariablesconfreportescertificaciones as idcampo,
  cvrc.denominacion,
  split_part(cice.columnafila , ':', 1 )as columna,
  split_part(cice.columnafila , ':', 2 ) as fila
FROM
mod_nomina.conf_variablestiporeportescertificaciones cvrc LEFT JOIN
mod_rrhhmaestro.conf_importarcamposexcel cice ON(cvrc.idvariablesconfreportescertificaciones=cice.idcampo AND cice.idimportarexcel = -1)
 WHERE
 cvrc.idconfreportescertificaciones = ?";
        $r   = $conn->fetchAll($sql, array($idelemento));
      } else {
        $sql = "SELECT
 cvrc.idvariablesconfreportescertificaciones as idcampo,
  cvrc.denominacion,
  split_part(cice.columnafila , ':', 1 )as columna,
  split_part(cice.columnafila , ':', 2 ) as fila
FROM
mod_nomina.conf_variablestiporeportescertificaciones cvrc LEFT JOIN
mod_rrhhmaestro.conf_importarcamposexcel cice ON(cvrc.idvariablesconfreportescertificaciones=cice.idcampo AND cice.idimportarexcel = ?)
 WHERE
 cvrc.idconfreportescertificaciones = ?";
        $r   = $conn->fetchAll($sql, array($idimportarexcel, $idelemento));
      }



      return $r;
    }

    public function obtenerElementos($idmodulo)
    {
      if ($idmodulo) {
        $sql  = "SELECT idconfreportescertificaciones as idelemento, denominacion
          FROM mod_nomina.conf_tiporeportescertificaciones;";
        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r    = $conn->fetchAll($sql);
        return $r;
      }

    }
  }
