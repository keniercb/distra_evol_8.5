<?php
class DatEnmarcamientoplan extends BaseDatEnmarcamientoplan
{

    public function setUp()
    {
        parent::setUp();
    }

    public function select()
    {
        $consulta = "SELECT em.identidad,p.codigo as codigoplan,p.denominacion as denominacionplan,
                    m.idmodelo,m.denominacion as denominacionmodelo,
                    edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                    round(coalesce(enmp.enmarcamiento,0),3) as enmarcamiento,
                    round(coalesce(enmp.enmarcamientodisponible,0),3) as enmarcamientodisponible";
        return $consulta;
    }

    public function selectUno()
    {
        $consulta = "SELECT em.identidad,
                    p.codigo as codigoplan,
                    p.denominacion as denominacionplan,
                    m.idmodelo,
                    m.denominacion as denominacionmodelo,
                    edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                    coalesce(enmp.enmarcamiento,0) as enmarcamiento,
                    coalesce(enmp.enmarcamientodisponible,0) as enmarcamientodisponible";
        return $consulta;
    }

    public function getPlanes($params, $identpadreod)
    {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionmodelo') {
                    $addWhere .= " AND upper(m.denominacion) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enmp.enmarcamiento,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enmp.enmarcamiento,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enmp.enmarcamiento,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enmp.enmarcamientodisponible,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enmp.enmarcamientodisponible,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enmp.enmarcamientodisponible,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $select = self::select();
        $query
            = "$select,
                    coalesce((select p.enmarcamientodisponible from mod_planificacion.dat_enmarcamientoplan p
                    where p.identidaddatosnomencladorod = ? and p.idmodelo = em.idmodelo
                    and p.idejercicio = ?),0) as enmarcamientodisponiblepadre
                    FROM mod_planificacion.dat_plan p
                    INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
                    INNER JOIN mod_planificacion.dat_entidadmodelo em ON (em.idmodelo = m.idmodelo)
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edod ON (edod.identidad = em.identidad)
                    AND (edod.iddatosnomenclador = 2) LEFT JOIN mod_planificacion.dat_enmarcamientoplan enmp
                    ON (edod.identidaddatosnomenclador = enmp.identidaddatosnomencladorod
                    and em.idmodelo = enmp.idmodelo and enmp.idejercicio = ?) WHERE
                    em.identidad = ? $addWhere ORDER BY em.identidad, p.codigo,  m.idmodelo
                    OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query, array($identpadreod, $params['idejercicio'],
                          $params['idejercicio'], $params['identidad'],
                          $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();
        $selectUno = self::selectUno();
        $queryAux
            = "$selectUno,
                    coalesce((select p.enmarcamientodisponible from mod_planificacion.dat_enmarcamientoplan p
                    where p.identidaddatosnomencladorod = ? and p.idmodelo = em.idmodelo
                    and p.idejercicio = ?),0) as enmarcamientodisponiblepadre
                    FROM mod_planificacion.dat_plan p
                    INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
                    INNER JOIN mod_planificacion.dat_entidadmodelo em ON (em.idmodelo = m.idmodelo)
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edod ON (edod.identidad = em.identidad)
                    AND (edod.iddatosnomenclador = 2)
                    LEFT JOIN mod_planificacion.dat_enmarcamientoplan enmp
                    ON (edod.identidaddatosnomenclador = enmp.identidaddatosnomencladorod
                    and em.idmodelo = enmp.idmodelo and enmp.idejercicio = ?)
                    WHERE em.identidad = ? $addWhere ORDER BY em.identidad,p.codigo,m.idmodelo";
        $resAux = $conn->execute(
            $queryAux, array($identpadreod, $params['idejercicio'],
                           $params['idejercicio'], $params['identidad'])
        );
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            $totalplan += $value['enmarcamiento'];
        }
        return array('total'              => count($total),
                     'totalenmarcamiento' => number_format($totalplan, 3),
                     'data'               => $result);
    }

    public function getPlanesConsolidado($params)
    {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionmodelo') {
                    $addWhere .= " AND upper(s.denominacionmodelo) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND s.enmarcamiento >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND s.enmarcamiento <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND s.enmarcamiento ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND s.enmarcamientodisponible >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND s.enmarcamientodisponible <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND s.enmarcamientodisponible ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT s.* FROM( SELECT p.codigo as codigoplan,p.denominacion as denominacionplan,
                    m.idmodelo,m.denominacion as denominacionmodelo,
                    round(sum( coalesce(enmp.enmarcamiento,0)),3) as enmarcamiento,
                    round(sum (coalesce(enmp.enmarcamientodisponible,0)),3) as enmarcamientodisponible,
                    0 as enmarcamientodisponiblepadre FROM mod_planificacion.dat_plan p
                    INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
                    INNER JOIN mod_planificacion.dat_entidadmodelo em ON (em.idmodelo = m.idmodelo)
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edod ON (edod.identidad = em.identidad)
                    AND (edod.iddatosnomenclador = 2)
                    left JOIN mod_planificacion.dat_enmarcamientoplan enmp
                    ON (edod.identidaddatosnomenclador = enmp.identidaddatosnomencladorod
                    and em.idmodelo = enmp.idmodelo and enmp.idejercicio = ?)
                    WHERE em.identidad in (SELECT f.idfila
                    from mod_estructuracomp.nom_filaestruc f where f.idpadre = ?)
                    group by p.codigo,p.denominacion,m.idmodelo,m.denominacion
                    ORDER BY p.codigo,m.idmodelo) as s $addWhere OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query, array($params['idejercicio'], $params['identidad'],
                          $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();

        $queryAux
            = "SELECT s.* FROM( SELECT p.codigo as codigoplan,p.denominacion as denominacionplan,
                    m.idmodelo,m.denominacion as denominacionmodelo,
                   sum( coalesce(enmp.enmarcamiento,0)) as enmarcamiento,
                    sum (coalesce(enmp.enmarcamientodisponible,0)) as enmarcamientodisponible,
                    0 as enmarcamientodisponiblepadre FROM mod_planificacion.dat_plan p
                    INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
                    INNER JOIN mod_planificacion.dat_entidadmodelo em ON (em.idmodelo = m.idmodelo)
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edod
                    ON (edod.identidad = em.identidad)
                    AND (edod.iddatosnomenclador = 2)
                    left JOIN mod_planificacion.dat_enmarcamientoplan enmp
                    ON (edod.identidaddatosnomenclador = enmp.identidaddatosnomencladorod
                    and em.idmodelo = enmp.idmodelo and enmp.idejercicio = ?)
                    WHERE em.identidad in (SELECT f.idfila from mod_estructuracomp.nom_filaestruc f
                    where f.idpadre = ?) group by p.codigo,p.denominacion,m.idmodelo,m.denominacion
                    ORDER BY p.codigo, m.idmodelo) as s $addWhere";
        $resAux = $conn->execute(
            $queryAux, array($params['idejercicio'], $params['identidad'])
        );
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $k => $value) {
            $totalplan += $value['enmarcamiento'];
        }
        return array('total'              => count($total),
                     'totalenmarcamiento' => number_format($totalplan, 3),
                     'data'               => $result);
    }

    public function getViaAdq($params, $identpadreod)
    {
        $addWhere = "WHERE true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionviaadquisicion') {
                    $addWhere .= " AND upper(v.denominacion) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamiento,0)  >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamiento,0)  <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enmv.enmarcamiento,0)  ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamientodisponible,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamientodisponible,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enmv.enmarcamientodisponible,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT v.idviaadquisicion,v.denominacion as denominacionviaadquisicion,
                         enmv.identidaddatosnomencladorod as identidaddatosnomencladorod,
                         coalesce(enmv.enmarcamiento,0) as enmarcamiento,
                         coalesce(enmv.enmarcamientodisponible,0) as enmarcamientodisponible,
                         coalesce((select p.enmarcamientodisponible 
                         from mod_planificacion.dat_enmarcamientoviaadquisicion p
                         where p.identidaddatosnomencladorod = ?
                         and p.idviaadquisicion = v.idviaadquisicion
                         and p.idejercicio = ?),0) as enmarcamientodisponiblepadre
                  FROM mod_planificacion.nom_viaadquisicion v
                       left JOIN mod_planificacion.dat_enmarcamientoviaadquisicion enmv ON
                       (v.idviaadquisicion = enmv.idviaadquisicion 
                       and enmv.identidaddatosnomencladorod = ? and enmv.idejercicio = ?)
                 $addWhere ORDER BY v.idviaadquisicion OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query, array($identpadreod, $params['idejercicio'],
                          $params['identidad'], $params['idejercicio'],
                          $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();

        $queryAux
            = "SELECT v.idviaadquisicion,v.denominacion as denominacionviaadquisicion,
                         enmv.identidaddatosnomencladorod as identidaddatosnomencladorod,
                         coalesce(enmv.enmarcamiento,0) as enmarcamiento,
                         coalesce(enmv.enmarcamientodisponible,0) as enmarcamientodisponible,
                         coalesce((select p.enmarcamientodisponible 
                         from mod_planificacion.dat_enmarcamientoviaadquisicion p
                         where p.identidaddatosnomencladorod = ?
                         and p.idviaadquisicion = v.idviaadquisicion
                         and p.idejercicio = ?),0) as enmarcamientodisponiblepadre
                  FROM mod_planificacion.nom_viaadquisicion v
                       left JOIN mod_planificacion.dat_enmarcamientoviaadquisicion enmv ON
                       (v.idviaadquisicion = enmv.idviaadquisicion 
                       and enmv.identidaddatosnomencladorod = ? and enmv.idejercicio = ?)
                       $addWhere ORDER BY v.idviaadquisicion  ";
        $resAux = $conn->execute(
            $queryAux, array($identpadreod, $params['idejercicio'],
                           $params['identidad'], $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        return array('total' => count($total), 'data' => $result);
    }

    public function getCBTG($params, $identcb)
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "select esta.idfila,case when esta.idfila = esta.idpadre then null
                       when esta.idfila <> esta.idpadre then esta.idpadre
                        end as _parent,esta.lft as _lft,esta.rgt as _rgt,
                        ((esta.rgt-esta.lft) = 1) as _is_leaf,norg.denorgano,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         coalesce(enm.enmarcamiento,0) as enmarcamiento,
                         coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
                         coalesce((select e.enmarcamientodisponible from 
                         mod_planificacion.dat_enmarcamientocb e
                         where e.identidaddatosnomencladorod = (select distinct edod.identidaddatosnomenclador
                         from  mod_planificacion.dat_entidaddatosnomenclador edod
                         where edod.identidad = esta.idpadre and edod.iddatosnomenclador = 2)
                         and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb
                         and e.idejercicio = ?),0) as enmarcamientodisponiblepadre,
                         enm.identidaddatosnomencladorcb
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
                         from mod_estructuracomp.nom_filaestruc h order by h.lft) esta
                        left join (select de.idestructura , de.idnomeav, de.idorgano
                        from mod_estructuracomp.dat_estructura de
                        union select eo.idestructura , eo.idnomeav, eo.idorgano
                        from mod_estructuracomp.dat_estructuraop  eo ) o on 
                        (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
                        left join mod_estructuracomp.nom_organo norg ON
                        (norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on 
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                        inner join  mod_planificacion.dat_enmarcamientocb enm ON 
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod    
                        and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?)
                        order by esta.lft OFFSET ? LIMIT ?";
        $result->data = $conn->execute(
            $query, array($params['idejercicio'], $identcb,
                          $params['idejercicio'], $params['start'],
                          $params['limit'])
        )->fetchAll(PDO::FETCH_NAMED);

        $queryAux
            = "select Count(esta.idfila) from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
               from mod_estructuracomp.nom_filaestruc h where h.idpadre = ?
                        order by h.lft) esta
                        left join (select de.idestructura , de.idnomeav, de.idorgano
                        from mod_estructuracomp.dat_estructura de
                        union select eo.idestructura , eo.idnomeav, eo.idorgano
                        from mod_estructuracomp.dat_estructuraop  eo ) o on 
                        (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
                        left join mod_estructuracomp.nom_organo norg ON
                        (norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on 
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                        left join  mod_planificacion.dat_enmarcamientocb enm ON 
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
                        and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?) ";
        $resAux = $conn->execute(
            $queryAux, array($params['idpadre'], $identcb,
                           $params['idejercicio'])
        );
        $result->total = $resAux->fetchAll();
        $result->total = $result->total[0][count];
        return $result;
    }

    public function obtenerEntidadRectora($identidad)
    {
        $query = new Doctrine_Query();
        $rectora = 'rectorbalance';
        $res = $query->select('d.identidad')
            ->from(' DatEntidaddatosnomenclador d  ')
            ->innerJoin(' d.NomDatosnomenclador ndn')
            ->where('ndn.uridatosnomenclador =?', $rectora)
            ->execute()->toArray();

        if ($res[0]['identidad'] == $identidad) {
            return true;
        }
        return false;
    }

    public function actualizarPlanes($identidadod, $idmodelo, $enmarcamiento,
        $idejercicio
    )
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "UPDATE mod_planificacion.dat_enmarcamientoplan SET enmarcamiento = "
            . $enmarcamiento . "
            WHERE mod_planificacion.dat_enmarcamientoplan.identidaddatosnomencladorod = "
            . $identidadod . "
                AND mod_planificacion.dat_enmarcamientoplan.idmodelo = "
            . $idmodelo . "
                 AND mod_planificacion.dat_enmarcamientoplan.idejercicio = "
            . $idejercicio;
        $resAux = $conn->execute($sql);
        return $resAux;
    }

    public function eliminarPlanes($identidadod, $idmodelo, $idejercicio)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "DELETE FROM mod_planificacion.dat_enmarcamientoplan
                WHERE mod_planificacion.dat_enmarcamientoplan.identidaddatosnomencladorod = "
            . $identidadod . "
                AND mod_planificacion.dat_enmarcamientoplan.idmodelo = "
            . $idmodelo . "
                AND mod_planificacion.dat_enmarcamientoplan.idejercicio = "
            . $idejercicio;
        $resAux = $conn->execute($sql);

        return $resAux;
    }

    public function verificarEnmarcamientoPlan($params)
    {
        $identodpadre = DatEntidaddatosnomenclador::getEntDatNom(
            $params['identidadpadre']
        );
        if (count($identodpadre) == 0) {
            return '24';
        } else {
            if ($params['enmarcamientomodificado'] <= ($params['enmarcamiento']
                    + $params['disponiblepadre'])
                || $params['enmarcamientomodificado']
                <= $params['enmarcamiento']
            ) {
                return '24';
            } else {
                return '20';
            }
        }
    }

    public function groupbyUno()
    {
        $consulta = "group by res.lft,res.rgt,res.idpadre,res.denominacionentidadpadre,
 res.idfila,res.denominacionentidad,res.identidaddatosnomencladorod,res.enmarcamientoplan,
 res.enmarcamientodisponible,res.idmodelo,res.denominacionplan,res.enmarcamientoreal";
        return $consulta;
    }

    public function groupbyDos()
    {
        $consulta = "group by res.lft,
 res.rgt,
 res.idpadre,
 res.denominacionentidadpadre,
 res.idfila,
 res.denominacionentidad,
 res.identidaddatosnomencladorod,
 res.enmarcamientoplan,
 res.enmarcamientodisponible,
 res.idmodelo,
 res.denominacionplan,
 res.enmarcamientoreal";
        return $consulta;
    }

    public function getReportePlanes($params)
    {
        $addWhere = "where true";
        $having = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionentidadpadre') {
                    $having .= " having upper(res.denominacionentidadpadre) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos['field'] == 'denominacionentidad') {
                    $addWhere .= " AND upper(res.denominacionentidad) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos['field'] == 'denominacionplan') {
                    $addWhere .= " AND upper(res.denominacionplan) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamientoplan') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(res.enmarcamientoplan,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(res.enmarcamientoplan,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(res.enmarcamientoplan,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientoreal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(res.enmarcamientoreal,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(res.enmarcamientoreal,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(res.enmarcamientoreal,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'diferencia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce((res.enmarcamientoplan - res.enmarcamientoreal),0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce((res.enmarcamientoplan - res.enmarcamientoreal),0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce((res.enmarcamientoplan - res.enmarcamientoreal),0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $group = self::groupbyUno();
        $query
            = "select res.*,(res.enmarcamientoplan - res.enmarcamientoreal) as diferencia
from (select esta.lft,esta.rgt, esta.idpadre,(select norgpadre.denorgano
from mod_estructuracomp.nom_filaestruc h left join (select de.idestructura,
de.idnomeav, de.idorgano from mod_estructuracomp.dat_estructura de
union select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) p on (p.idestructura = h.idfila
and h.idnomeav = p.idnomeav) left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = esta.idpadre) as denominacionentidadpadre,esta.idfila,
 norg.denorgano as denominacionentidad,edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(eplan.enmarcamiento,0) as enmarcamientoplan,
 coalesce(eplan.enmarcamientodisponible,0) as enmarcamientodisponible,
 eplan.idmodelo,dm.denominacion as denominacionplan,
coalesce( (coalesce( (select sum(p.importe)
	from mod_planificacion.dat_planificacion p
	inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = p.identidadmodelo)
	where em.identidad = edod.identidad	and em.idmodelo =  eplan.idmodelo
	and p.idejercicio = eplan.idejercicio),0)),0) as enmarcamientoreal
from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
left join (select de.idestructura , de.idnomeav, de.idorgano
from mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) o on (o.idestructura = esta.idfila
and esta.idnomeav = o.idnomeav)
left join mod_estructuracomp.nom_organo norg ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
left join mod_planificacion.dat_entidaddatosnomenclador edod
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamientoplan eplan
    ON (edod.identidaddatosnomenclador = eplan.identidaddatosnomencladorod
   and eplan.idejercicio = ?) --Parametro (ejercicio seleccionado)
    inner join mod_planificacion.dat_modelo dm on ( dm.idmodelo = eplan.idmodelo))res
$addWhere $group $having order by res.lft,res.rgt,res.idmodelo OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query,
            array($params['idejercicio'], $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();
        $groupUno = self::groupbyUno();
        $queryAux
            = "select res.*,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia from (
select esta.lft,esta.rgt, esta.idpadre,(select norgpadre.denorgano
from mod_estructuracomp.nom_filaestruc h left join (select de.idestructura , de.idnomeav, de.idorgano
from mod_estructuracomp.dat_estructura de union select eo.idestructura , eo.idnomeav, eo.idorgano
from mod_estructuracomp.dat_estructuraop  eo ) p on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav        )
where h.idfila = esta.idpadre) as denominacionentidadpadre,esta.idfila,
 norg.denorgano as denominacionentidad,edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(eplan.enmarcamiento,0) as enmarcamientoplan,
 coalesce(eplan.enmarcamientodisponible,0) as enmarcamientodisponible,
 eplan.idmodelo,dm.denominacion as denominacionplan,coalesce( (coalesce( (select sum(p.importe)
	from mod_planificacion.dat_planificacion p
	inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = p.identidadmodelo)
	where em.identidad = edod.identidad and em.idmodelo =  eplan.idmodelo
	and p.idejercicio = eplan.idejercicio),0)),0) as enmarcamientoreal
from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
    from mod_estructuracomp.nom_filaestruc p, mod_estructuracomp.nom_filaestruc h
    where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
    left join (select de.idestructura,de.idnomeav,de.idorgano
    from mod_estructuracomp.dat_estructura de union
    select eo.idestructura,eo.idnomeav,eo.idorgano
    from mod_estructuracomp.dat_estructuraop  eo ) o
    on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
   left join mod_estructuracomp.nom_organo norg ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
    left join mod_planificacion.dat_entidaddatosnomenclador edod
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamientoplan eplan
    ON (edod.identidaddatosnomenclador = eplan.identidaddatosnomencladorod
    and eplan.idejercicio = ?)
    inner join mod_planificacion.dat_modelo dm on ( dm.idmodelo = eplan.idmodelo))res
$addWhere $having $groupUno order by res.lft,res.rgt,res.idmodelo";
        $resAux = $conn->execute($queryAux, array($params['idejercicio']));
        $total = $resAux->fetchAll();
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $totalplan = 0; $totalreal = 0; $totaldiferencia = 0;
        foreach ($total as $value) {
            if ($value['idpadre'] == $identrectora[0]['identidad']) {
                $totalplan += $value['enmarcamientoplan'];
                $totalreal += $value['enmarcamientoreal'];
                $totaldiferencia += $value['diferencia'];
            }
        }
        return array('total'           => count($total),
                     'totalplan'       => number_format($totalplan, 3),
                     'totaldiferencia' => number_format($totaldiferencia, 3),
                     'totalreal'       => number_format($totalreal, 3),
                     'data'            => $result);
    }

}