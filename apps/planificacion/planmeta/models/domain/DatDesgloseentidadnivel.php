<?php

class DatDesgloseentidadnivel extends BaseDatDesgloseentidadnivel {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatActividadentidad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasMany(
                'DAtDesglosedatosnomenclador', array('local' => 'iddesgloseentidadnivel',
            'foreign' => 'iddesgloseentidadnivel')
        );
    }

    public function select() {
        $consulta = "SELECT dn.iddesgloseentidadnivel,
       ROUND(dn.nivelactivdesglosado, 4) as nivelactivdesglosado,
       dd.iddesglosetiponomenclador,
       tn.denominacion as tiponomenclador,
       tn.uritiponomenclador as uritiponomenclador,
       dd.iddatosnomenclador,
       dnom.denominacion";
        return $consulta;
    }

    public function listarDesgloseNivelesActividad($parametros) {

        $select = self::select();
        $conn = Doctrine_Manager::connection();
        $sql = "$select FROM mod_planificacion.dat_desgloseentidadnivel dn
  INNER JOIN mod_planificacion.dat_desglosedatosnomenclador dd
  ON (dn.iddesgloseentidadnivel = dd.iddesgloseentidadnivel)
  INNER JOIN mod_planificacion.nom_datosnomenclador dnom
  on (dnom.iddatosnomenclador = dd.iddatosnomenclador)
  INNER JOIN mod_planificacion.dat_desglosetiponomenclador dtnom
  on (dtnom.iddesglosetiponomenclador = dd.iddesglosetiponomenclador)
  INNER JOIN mod_planificacion.nom_tiponomenclador tn
  on(tn.idtiponomenclador = dtnom.idtiponomenclador)
WHERE dn.idactividadentidad = {$parametros['idactividadentidad']}
{$parametros['where']}
   ORDER by dn.iddesgloseentidadnivel
   OFFSET {$parametros['start']}
    LIMIT {$parametros['limit']}";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function listarDesgloses($params) {

        $conn = Doctrine_Manager::connection();
        $sql = "
       SELECT dn.iddesgloseentidadnivel,
                ROUND(dn.nivelactivdesglosado, 4) as nivelactivdesglosado,  
                tn.uritiponomenclador as uritiponomenclador,
                dd.iddatosnomenclador,
                dn.idusuario,
                dn.fecha
       FROM mod_planificacion.dat_desgloseentidadnivel dn
        INNER JOIN mod_planificacion.dat_desglosedatosnomenclador dd
            ON (dn.iddesgloseentidadnivel = dd.iddesgloseentidadnivel)       
        INNER JOIN mod_planificacion.dat_desglosetiponomenclador dtnom
            ON (dtnom.iddesglosetiponomenclador = dd.iddesglosetiponomenclador)
        INNER JOIN mod_planificacion.nom_tiponomenclador tn
            ON(tn.idtiponomenclador = dtnom.idtiponomenclador)
       WHERE dn.idactividadentidad = {$params['idactividadentidad']}
            {$params['where']}
       ORDER by dn.iddesgloseentidadnivel
       OFFSET {$params['start']}
       LIMIT {$params['limit']}";      
//        print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function totalDesgloseNivelesActividad($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "select count(dn.iddesgloseentidadnivel) FROM mod_planificacion.dat_desgloseentidadnivel dn  
WHERE dn.idactividadentidad = {$parametros['idactividadentidad']} {$parametros['where']}";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $arrayResult;
    }

    public function eliminarDesglose($parametros) {
        if ($parametros['iddesglose'] != null) {
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_desgloseentidadnivel dn
                WHERE dn.idactividadentidad = {$parametros['idactividadentidad']} and iddesgloseentidadnivel={$parametros['iddesglose']}";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }
        return 1;
    }

    public function eliminarDesgloses($idmodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE
                        FROM mod_planificacion.dat_desgloseentidadnivel
                        WHERE idactividadentidad IN (
                                                      SELECT ae.idactividadentidad
                                                      FROM mod_planificacion.dat_actividadmodelo am
                                                           INNER JOIN
                                                             mod_planificacion.dat_actividadentidad ae
                                                             ON am.idactividad = ae.idactividad
                                                      WHERE idmodelo = {$idmodelo}
                              );";
        $conn->execute($sql);
        return 1;
    }

    public function eliminarDesglosesxActividad($idactividad) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_planificacion.dat_desgloseentidadnivel
                    WHERE idactividadentidad IN (
                                                  SELECT DISTINCT ae.idactividadentidad
                                                  FROM mod_planificacion.dat_actividadentidad ae
                                                  WHERE ae.idactividad = $idactividad);";
        $conn->execute($sql);
        return 1;
    }

    public function eliminarDesgloseVarios($parametros) {
        if ($parametros['iddesglose'] != null) {
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_desgloseentidadnivel dn
                WHERE dn.idactividadentidad = {$parametros['idactividadentidad']} AND
                      iddesgloseentidadnivel IN ({$parametros['iddesglose']})";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }
        return 1;
    }

    public function eliminarDesgloseTodos($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_planificacion.dat_desgloseentidadnivel dn
                WHERE dn.idactividadentidad = {$parametros['idactividadentidad']}";
        $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return 1;
    }

    /* public function tieneActdesglosada($identidad, $idmodelo, $idejercicio)
      {
      $conn = Doctrine_Manager::connection();

      $sql
      = "SELECT ae.idactividad FROM mod_planificacion.dat_actividadentidad ae
      INNER JOIN mod_planificacion.dat_actividadmodelo am ON (ae.idactividad = am.idactividad  AND am.idmodelo = {$idmodelo})
      INNER JOIN mod_planificacion.dat_desgloseentidadnivel den on (ae.idactividadentidad = den.idactividadentidad  AND den.idejercicio={$idejercicio})
      WHERE ae.identidad =  {$identidad}
      AND ae.idejercicio={$idejercicio} limit 1"
      ;
      $respuesta = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
      if (count($respuesta) > 0) {
      return true;
      } else {
      return false;
      }
      } */

    public function tieneActdesglosada($identidad, $idmodelo, $idejercicio) {

        $conn = Doctrine_Manager::connection();
        $sqldesglosadas = "
      WITH cantdesg AS
      (SELECT SUM(des.nivelactivdesglosado) as desglose, des.idactividadentidad
      FROM mod_planificacion.dat_desgloseentidadnivel des
      GROUP BY des.idactividadentidad)

      SELECT COUNT(DISTINCT ae.idactividadentidad)
      FROM mod_planificacion.dat_actividadentidad ae
      INNER JOIN mod_planificacion.nom_actividad a ON (ae.idactividad = a.idactividad)
      INNER JOIN mod_planificacion.dat_actividadmodelo am ON (ae.idactividad = am.idactividad)
      INNER JOIN mod_planificacion.dat_norma n ON (n.idactividad = ae.idactividad AND n.idejercicio ={$idejercicio})
      INNER JOIN mod_datosmaestros.nom_indicador i ON (n.idindicador = i.idindicador)
      LEFT OUTER JOIN mod_datosmaestros.dat_indicadormodelo im ON (im.idindicador = i.idindicador)
      INNER JOIN mod_planificacion.dat_desgloseentidadnivel desn ON(ae.idactividadentidad = desn.idactividadentidad and desn.idejercicio ={$idejercicio})
      LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON(aem.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON(aea.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON( aep.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN cantdesg c ON ae.idactividadentidad = c.idactividadentidad

      WHERE ae.identidad =  {$identidad}
      AND (am.idmodelo = {$idmodelo} OR im.idmodelo={$idmodelo})
      AND ae.idejercicio={$idejercicio}
      AND (ae.idaprobacion = 3 OR ae.idaprobacion = 4 OR ae.idaprobacion = 5)
      AND c.desglose =(COALESCE(aea.nivelactividadautomatico, 0) +
      COALESCE(aem.nivelactividadmanual, 0) +
      COALESCE(aep.nivelactividadproduccion, 0) +
      ROUND(COALESCE(ae.ajuste, 0),4))
      limit 1";
        $desglosadas = $conn->execute($sqldesglosadas)->fetchAll(PDO::FETCH_ASSOC);


        if ($desglosadas[0]['count'] >= 1) {

            return true;
        } else {
            return false;
        }
    }

    /* Para MINFAR no borrar
      public function tieneActdesglosada($identidad, $idmodelo, $idejercicio) {

      $conn = Doctrine_Manager::connection();
      $sqldesglosadas = "
      WITH cantdesg AS
      (SELECT COALESCE(SUM(des.nivelactivdesglosado), 0) as desglose,
      des.idactividadentidad
      FROM mod_planificacion.dat_desgloseentidadnivel des
      GROUP BY des.idactividadentidad)

      SELECT  min(x.desglosada) as desglosada
      FROM (
      SELECT
      case

      WHEN c.desglose =(COALESCE(aea.nivelactividadautomatico, 0) +
      COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
      aep.nivelactividadproduccion, 0) + ROUND(COALESCE(ae.ajuste, 0
      ), 4)) then 1
      ELSE 0
      end as desglosada
      FROM mod_planificacion.dat_actividadentidad ae
      INNER JOIN mod_planificacion.nom_actividad a ON (ae.idactividad =
      a.idactividad)
      INNER JOIN mod_planificacion.dat_actividadmodelo am ON (
      ae.idactividad = am.idactividad)
      INNER JOIN mod_planificacion.dat_norma n ON (n.idactividad =
      ae.idactividad AND n.idejercicio = {$idejercicio})
      INNER JOIN mod_datosmaestros.nom_indicador i ON (n.idindicador =
      i.idindicador)
      LEFT OUTER JOIN mod_datosmaestros.dat_indicadormodelo im ON (
      im.idindicador = i.idindicador)
      LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
      aem.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
      aea.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
      aep.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN cantdesg c ON ae.idactividadentidad = c.idactividadentidad
      WHERE ae.identidad = {$identidad}
      AND (am.idmodelo = {$idmodelo} OR im.idmodelo={$idmodelo})
      AND
      ae.idejercicio = {$idejercicio} AND
      (ae.idaprobacion = 3 OR
      ae.idaprobacion = 4 OR
      ae.idaprobacion = 5) AND
      ROUND((COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(
      aem.nivelactividadmanual, 0) + COALESCE(
      aep.nivelactividadproduccion, 0) + COALESCE(ae.ajuste, 0)), 4) > 0
      group by a.denominacion,
      aea.nivelactividadautomatico,
      aem.nivelactividadmanual,
      aep.nivelactividadproduccion,
      ae.ajuste,
      c.desglose
      ) x";
      $desglosadas = $conn->execute($sqldesglosadas)->fetchAll(PDO::FETCH_ASSOC);

      if ($desglosadas[0]['desglosada'] == 1) {
      return true;
      } else {
      return false;
      }
      } */

    public static function validarExistenciaDatos($idejercicio, $entidades) {
        //Devolviendo la cantidad.
        return Doctrine_Query::create()->select(
                                'COUNT(den.iddesgloseentidadnivel ) AS cantidad'
                        )
                        ->from('DatDesgloseentidadnivel den')
                        ->innerjoin('den.DatActividadentidad ae WITH den.idactividadentidad = ae.idactividadentidad')
                        ->whereIn('ae.identidad', $entidades)
                        ->addWhere('den.idejercicio=?', $idejercicio)
                        ->fetchOne()->cantidad;
    }

}

