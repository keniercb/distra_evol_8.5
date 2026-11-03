<?php

  class ConfTipoPagoDependencia extends BaseConfTipoPagoDependencia
  {

    public function setUp()
    {
      parent::setUp();

    }

    public static function obtenerTodosTipoPagoDependencia()
    {

      //Devolviendo el listado de los tipos de reportes y certificaciones de arreglo.
      return Doctrine_Query::create()
        ->from('ConfTipoPagoDependencia')
        ->getCountSqlQuery();
    }

    public static function obtenerListadoTipoPagoDependencia($idtipopago, $inicio = 0, $limite = 10)
    {

      $sql = "SELECT
  ctpd.*,
  nom_tipopago.denominacion AS dependencia
FROM
  mod_nomina.conf_tipopagodependencia as ctpd,
  mod_nomina.nom_tipopago
WHERE
  ctpd.idtipopagodepencia = nom_tipopago.idtipopago AND
  ctpd.idtipopago = ?";


      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();

      return $conn->fetchAll($sql, array($idtipopago));
    }

    public static function obtenerCantidadTipoPagoDependencia($idtipopago)
    {

      $sql = "SELECT
 count(nom_tipopago.idtipopago)
FROM
  mod_nomina.conf_tipopagodependencia as ctpd,
  mod_nomina.nom_tipopago
WHERE
  ctpd.idtipopagodepencia = nom_tipopago.idtipopago AND
  ctpd.idtipopago = ?";


      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();

      return $conn->fetchAll($sql, array($idtipopago))[0]['count'];
    }

    public static function obtenerListadoTipoPagoDependenciaRestante($idtipopago, $inicio = 0, $limite = 20)
    {

      $sql = "SELECT
  tp.idtipopago,
  tp.denominacion AS dependencia
FROM
   mod_nomina.nom_tipopago as tp
WHERE
  tp.idtipopago not in (SELECT ctpd.idtipopagodepencia FROM  mod_nomina.conf_tipopagodependencia as ctpd WHERE ctpd.idtipopago=?)
   AND tp.idtipopago<>?";


      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();


      return $conn->fetchAll($sql, array($idtipopago,$idtipopago));
    }

    public static function obtenerCantidadTipoPagoDependenciaRestante($idtipopago)
    {

      $sql = "SELECT
 count(tp.idtipopago)
FROM
   mod_nomina.nom_tipopago as tp
WHERE
  tp.idtipopago not in (SELECT ctpd.idtipopago FROM  mod_nomina.conf_tipopagodependencia as ctpd WHERE ctpd.idtipopago=?)
  AND tp.idtipopago<>?";


      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();

      return $conn->fetchAll($sql, array($idtipopago,$idtipopago))[0]['count'];
    }

    public static function existeDependenciaPorTipoPago($idtipopago, $iddependencia)
    {
      $sql = "SELECT
  *
FROM
  mod_nomina.conf_tipopagodependencia
WHERE
  conf_tipopagodependencia.idtipopago = ? AND conf_tipopagodependencia.idtipopagodepencia=?;";

      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();
      return count($conn->fetchAll($sql, array($idtipopago, $iddependencia))) > 0;
    }
  }
