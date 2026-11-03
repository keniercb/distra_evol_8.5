<?php

class DatPlan extends BaseDatPlan {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatModelo', array('local' => 'idplan', 'foreign' => 'idplan')
        );
        $this->hasMany(
                'DatPlan', array('local' => 'idplan', 'foreign' => 'idpadre')
        );
    }

    public function GetTodos() {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlan')->execute();
        return $result->toArray();
    }

    public function cargarAgrupaciones() {
        $query = new Doctrine_Query();
        $result = $query->select("n.idplan,n.denominacion")->from('DatPlan n')
                ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 0, $inicio = 20) {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlan')->limit($limite = 0)->offset(
                        $inicio = 20
                )->execute();
        return $result->toArray();
    }

    public function getPlanesEntidadDesglose($node, $identidad, $parametros) {
        if ($node == 0) {
            $planes = DatModelo::getModelosPlanDesgloseTodos(
                            $identidad, $parametros
            );
            $idplanes = array();
            foreach ($planes as $value) {
                array_push($idplanes, $value['idplan']);
            }
            $entro = false;
            $idplanesAux = array();
            array_push($idplanesAux, $idplanes[0]);
            foreach ($idplanes as $value) {
                foreach ($idplanes as $v) {
                    if ($value != $v) {
                        foreach ($idplanesAux as $vv) {
                            if ($vv == $v) {
                                $entro = true;
                                break;
                            }
                        }
                        if ($entro == false) {
                            array_push($idplanesAux, $v);
                        }
                    }
                }
            }


            $queryAux = new Doctrine_Query();
            $resAux = $queryAux->select(
                            'd.idplan as id ,em.identidadmodelo as identidadmodelo,
                em.identidad as ident, m.idmodelo as idmodelo,d.identidad,
                d.denominacion,d.denominacion as text,d.codigo,d.descripcion,
                (( d.ordender - d.ordenizq) = 1) as leaf, 1 as tipo, '
                            . "'plan'" . ' as iconCls'
                    )
                    ->from('DatPlan d')
                    ->leftJoin('d.DatModelo m')
                    ->leftJoin('m.DatEntidadmodelo em')
                    ->whereIn('d.idplan', $idplanesAux)
                    ->execute()
                    ->toArray();

            return $resAux;
        }
    }

    public function getPlanesEntidad($identidad, $idejercicio, $identidades) {
        $conn = Doctrine_Manager::connection();
        $sql = "WITH planificado AS (
                    SELECT DISTINCT m.idplan
                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON (
                           em.identidadmodelo = p.identidadmodelo AND
                           p.idejercicio = $idejercicio)
                              INNER JOIN mod_planificacion.dat_modelo m ON(em.idmodelo=m.idmodelo)
                    WHERE em.identidad IN ($identidades))

                SELECT DISTINCT(p.idplan) as id,
                            p.idplan as idplan,
                            CASE
                                WHEN m.idplan is NULL THEN true
                                ELSE false
                              END as leaf,
                            p.identidad,
                            p.denominacion,
                            p.codigo,
                            p.descripcion,
                            1 as tipo,
                            'plan' as iconCls,
                              CASE
                             WHEN pl.idplan IS NOT NULL THEN 1
                             ELSE 0
                           END as planif
                      FROM mod_planificacion.dat_plan p
                      LEFT JOIN mod_planificacion.dat_modelo m ON(p.idplan=m.idplan)
                      LEFT JOIN mod_planificacion.dat_entidadmodelo em ON(m.idmodelo=em.idmodelo)
                      LEFT JOIN planificado pl ON m.idplan = pl.idplan
                      WHERE p.idplan = p.idpadre
                      AND (p.identidad = $identidad OR (em.identidad=$identidad))
                order by p.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function getPlanesEntidadNiv($identidad, $idejercicio, $identidades) {
        $conn = Doctrine_Manager::connection();
        $sql = " WITH cantdesg as ( SELECT DISTINCT m.idplan,
                       case
                         when SUM(des.nivelactivdesglosado) = 0 then 0
                         WHEN SUM(des.nivelactivdesglosado) =(ROUND(COALESCE(
                           aea.nivelactividadautomatico, 0), 4) + ROUND(COALESCE
                           (aem.nivelactividadmanual, 0), 4) + ROUND(COALESCE(
                           aep.nivelactividadproduccion, 0), 4) + ROUND(COALESCE
                           (ae.ajuste, 0), 4)) then 1
                         WHEN SUM(des.nivelactivdesglosado) > 0 then 2
                       end as desglosada
                FROM mod_planificacion.dat_desgloseentidadnivel des
                     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (
                       des.idactividadentidad = ae.idactividadentidad AND
                       ae.idejercicio = $idejercicio)
                     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                       ON (aem.idactividadentidad = ae.idactividadentidad)
                     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico
                       aea ON (aea.idactividadentidad = ae.idactividadentidad)
                     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion
                       aep ON (aep.idactividadentidad = ae.idactividadentidad)
                     INNER JOIN mod_planificacion.dat_actividadmodelo am ON
                       am.idactividad = ae.idactividad
                        INNER JOIN mod_planificacion.dat_modelo m ON(am.idmodelo=m.idmodelo)
                WHERE ae.identidad IN ($identidades) AND
                      (ae.idaprobacion = 3 OR
                      ae.idaprobacion = 4 OR
                      ae.idaprobacion = 5)
                GROUP BY des.idactividadentidad,
                         aea.nivelactividadautomatico,
                         aem.nivelactividadmanual,
                         aep.nivelactividadproduccion,
                         ae.ajuste,
                         m.idplan)
SELECT DISTINCT(p.idplan) as id,
                            p.idplan as idplan,
                            CASE
                                WHEN m.idplan is NULL THEN true
                                ELSE false
                              END as leaf,
                            p.denominacion,
                            p.codigo,
                            p.descripcion,
                            'plan' as iconCls,
                            min(COALESCE(d.desglosada, 0)) as desglosada
                      FROM mod_planificacion.dat_plan p
                      LEFT JOIN mod_planificacion.dat_modelo m ON(p.idplan=m.idplan)
                      LEFT JOIN mod_planificacion.dat_entidadmodelo em ON(m.idmodelo=em.idmodelo)
                         LEFT JOIN cantdesg d ON d.idplan = m.idplan
                      WHERE p.idplan = p.idpadre
                      AND em.identidad=$identidad
                      GROUP BY p.idplan,
                            m.idplan,
                            p.denominacion,
                            p.codigo,
                            p.descripcion
                        order by p.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function validarCodigo($codigo) {

        $query = Doctrine_Query:: create();
        return ($query->select('COUNT(a.idplan) as total')
                        ->from('DatPlan a')
                        ->where(" a.codigo = ?", $codigo)
                        ->execute()
                        ->getFirst()
                ->total > 0);
    }

    public function BuscarPlanes($parametros) {
        $query = new Doctrine_Query();
        //costruyo el filtro
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere("denominacion  LIKE '%$s%' ");
                    } elseif ($p == 'codigo') {
                        $query->addWhere("codigo  LIKE '%$s%' ");
                    }
                }
            }
        }
        $res = $query->select(
                        'd.idplan as id,d.idplan,d.denominacion,d.denominacion as text,
            d.codigo,d.descripcion,false as leaf, 2 as tipo'
                )->from('DatPlan d')->execute()->toArray();
        return $res;
    }

    public function idIndicadoresDeUnModelo($idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idindicador')->from('DatPlanificacion m')
                        ->innerJoin('m.DatModelo d')->where(
                        'd.idmodelo =?', $idmodelo
                )->execute()->toArray();

        return $res;
    }

    public function getPlanes($idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idplan')->from('DatModelo m')->where(
                        'd.idmodelo =?', $idmodelo
                )->execute()->toArray();

        return $res;
    }

    public function getPlanesPorEntidad($identidad) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'dp.idplan, dp.denominacion, dp.codigo, dp.descripcion, dp.version,
             dp.identidad, dp.idpadre, dp.ordender, dp.ordenizq'
                )
                ->from('DatPlan dp')
                ->where('dp.identidad =?', $identidad)
                ->execute()
                ->toArray();
        return $res;
    }

    public function getPlanesSinNada() {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'dp.idplan, dp.denominacion, dp.codigo, dp.descripcion,
            dp.version, dp.identidad, dp.idpadre, dp.ordender, dp.ordenizq'
                )
                ->from('DatPlan dp')
                ->execute()
                ->toArray();
        return $res;
    }

    /* public function TotalIndPlanModelo($idplan, $idmodelo)
      {
      $query = new Doctrine_Query();
      $res = $query->select(
      'ni.idindicador, ni.denominacion, ni.codigo, ni.idpadre,
      ni.ordenizq, ni.ordender, ni.estado, ni.idformato,
      ni.descripcion, ni.nivel, ni.idpais, ni.nivelarbol,
      ni.idaprobacion, ni.precio, ni.numeropieza, ni.flete,
      ni.contingencia, ni.idumedida, ni.idnaturaleza'
      )
      ->from(
      'NomIndicador ni, DatPlanificacion dpl, DatEntidadModelo dem, DatModelo dm, DatPlan dp'
      )
      ->where('ni.idindicador = dpl.idindicador')
      ->where('dpl.identidadmodelo = dem.identidadmodelo')
      ->where('dem.idmodelo = dm.idmodelo AND dm.idmodelo =?', $idmodelo)
      ->where('dm.idplan = dp.idplan AND dp.idplan =?', $idplan)
      ->execute()
      ->toArray();
      return $res;
      } */

    public function IndPlanModelo($idplan, $idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('dem.identidadmodelo')
                ->from('DatEntidadmodelo dem, DatModelo dm')
                ->where(
                        'dm.idmodelo =? AND dm.idplan =?', array($idmodelo, $idplan)
                )
                ->where('dem.idmodelo = dm.idmodelo AND dem.idmodelo =?', $idmodelo)
                ->execute()
                ->toArray();
        return $res;
    }

    /* public function TotalIndPlanModelo1($idplan, $idmodelo)
      {
      $query = new Doctrine_Query();
      $conn = Doctrine_Manager:: connection();
      $query
      = "SELECT ni.idindicador, ni.codigo, ni.denominacion, dpl.cantidad, dpl.precio , dpl.importe
      FROM mod_planificacion.nom_indicador ni
      INNER JOIN mod_planificacion.dat_planificacion dpl
      ON ni.idindicador = dpl.idindicador
      INNER JOIN (mod_planificacion.dat_entidadmodelo dem
      INNER JOIN (mod_planificacion.dat_modelo dm
      INNER JOIN mod_planificacion.dat_plan dp
      ON dm.idplan = dp.idplan AND dm.idplan = '$idplan')
      ON dem.idmodelo = dm.idmodelo AND dm.idmodelo = '$idmodelo')
      ON dpl.identidadmodelo = dem.identidadmodelo";
      $res = $conn->execute($query);
      $repeticiones = $res->fetchAll();
      return $repeticiones;
      } */

    public function ModelosPorPlan($idplan) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'dm.idmodelo, dm.denominacion, dm.fechaentrega, dm.identidad,
            dm.idplan, dm.idtipomodelo, dm.version, dm.descripcion'
                )
                ->from('DatModelo dm, DatPlan dp')
                ->where('dm.idplan = dp.idplan AND dp.idplan =?', $idplan)
                ->execute()
                ->toArray();
        return $res;
    }

    public function IndEntMod($identidadmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'dpl.idindicador, dpl.cantidad, dpl.precio, dpl.importe'
                )
                ->from('DatPlanificacion dpl')
                ->where('dpl.identidadmodelo =?', $identidadmodelo)
                ->execute()
                ->toArray();
        return $res;
    }

    public function buscarPlaneshijos($idplan) {
        $query = new Doctrine_Query();
        $res = $query->from('DatPlan p')
                        ->where('p.idpadre =? AND p.idplan <>?', array($idplan, $idplan))
                        ->execute()->count();
        return $res;
    }

    public function PlanesOtros($node, $identidad) {
        if ($node != 0) { //si abre un nodo
            $query = new Doctrine_Query();
            $res = $query->select(
                            'p.idplan as id,p.idplan,p.identidad,
                p.denominacion,p.denominacion as text,
                p.codigo,p.descripcion,false as leaf, 1 as tipo, '
                            . "'plan'" . ' as iconCls'
                    )
                    ->from('DatPlan p, p.DatModelo m, m.DatEntidadmodelo e')
                    ->where(
                            'e.identidad=? AND e.identidad<>m.identidad', $identidad
                    )//que sea  un plan de un modelo que no es creado por la entidad, pero sí asociado a ella
                    ->addWhere(
                            "p.idplan <> p.idpadre AND p.idpadre=?", $node
                    )//que no sea hoja
                    ->execute()
                    ->toArray();
            return $res;
        } else {
            $query = new Doctrine_Query();
            $res = $query->select(
                            'p.idplan as id,p.idplan,p.identidad,p.denominacion,
                p.denominacion as text,p.codigo,p.descripcion,
                false as leaf, 1 as tipo, '
                            . "'plan'" . ' as iconCls'
                    )
                    ->from('DatPlan p, p.DatModelo m, m.DatEntidadmodelo e')
                    ->where(
                            'e.identidad=? AND e.identidad<>m.identidad', $identidad
                    )
                    ->addWhere("p.idplan =p.idpadre")
                    ->execute()
                    ->toArray();
            return $res;
        }


        $query = new Doctrine_Query();
        $res = $query->select(
                        'p.idplan as id,p.idplan,p.identidad,p.denominacion,
            p.denominacion as text,p.codigo,p.descripcion,false as leaf,
            1 as tipo, '
                        . "'plan'" . ' as iconCls'
                )
                ->from('DatPlan p, p.DatModelo m, m.DatEntidadmodelo e')
                ->where('e.identidad=? AND e.identidad<>m.identidad', $identidad)
                ->execute()
                ->toArray();
        return $res;
    }

    public function IndPlanModeloEntidad($idplan, $idmodelo, $identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('dem.identidadmodelo')
                ->from('DatEntidadmodelo dem, DatModelo dm')
                ->where(
                        'dm.idmodelo =? AND dm.idplan =?', array($idmodelo, $idplan)
                )
                ->where(
                        'dem.idmodelo = dm.idmodelo AND dem.idmodelo =? AND dem.identidad =?', array($idmodelo, $identidad)
                )
                ->execute()
                ->toArray();
        return $res;
    }

    public function MuestraIndicador($idindicador) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'ni.codigo, ni.denominacion, ni.numeropieza, ni.ordender,
            ni.ordenizq, (( ordender - ordenizq) = 1) as _is_leaf'
                )
                ->from('NomIndicador ni')
                ->where('ni.idindicador =?', $idindicador)
                ->execute()
                ->toArray();
        return $res;
    }

    public function obtenerIdPlanXCodigo($codigo, $identidad) {
        $query = new Doctrine_Query();
        $res = $query->select('dp.idplan,dp.codigo')
                ->from('DatPlan dp')
                ->where(
                        'dp.codigo =? AND dp.identidad =?', array($codigo, $identidad)
                )
                ->execute()
                ->toArray();
        return $res;
    }

    public function comprobarColumnasDinamicas($params) {
        $concat = $params['codigotm'] . '_id' . $params['codigotm'];
        $tablaFrom = "mod_planificacionmeta.dat_" . $params['codigotm'];
        $tabla = "mod_planificacionmeta_dat_$concat";
        $llavePrimaria = 'id' . $params['codigotm'];
        $valorLlaveBuscar = $params['std']->idplanificacion;
        $INNERJOIN = "";
        $WHERE = "";

        foreach ($params['columnasDinamicas'] as $key => $column) {
            $INNERJOIN .= " INNER JOIN  mod_planificacion.nom_datosnomenclador nom{$key} ON (meta.{$column['denominacion']} = nom{$key}.iddatosnomenclador)";
            $WHERE .= " AND nom{$key}.uridatosnomenclador <> '-'";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "select meta.$llavePrimaria
        FROM $tablaFrom meta $INNERJOIN WHERE meta.idplanificacion = $valorLlaveBuscar $WHERE";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerColumnasDinamicas($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select cam.denominacion
FROM mod_metadata.dat_campo cam
WHERE cam.idtabla = {$params['idtabla']} AND cam.llaveprimaria <> 1 AND cam.denominacion != 'idplanificacion'";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}

//fin clase
