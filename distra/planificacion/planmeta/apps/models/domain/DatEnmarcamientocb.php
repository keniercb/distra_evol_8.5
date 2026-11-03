<?php
class DatEnmarcamientocb extends BaseDatEnmarcamientocb
{

    public function setUp()
    {
        parent::setUp();
    }

    public function select()
    {
        $consulta = "SELECT s.identidadatosnomencladorod,
                    edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                    edcb.iddatosnomenclador as iddatosnomencladorcb,
                    norg.denorgano as denominacioncb,
                    round(coalesce(s.enmarcamiento, 0),3) as enmarcamiento,
                    round(coalesce(s.enmarcamientodisponible, 0),3) as enmarcamientodisponible,
                    coalesce((select e.enmarcamientodisponible from mod_planificacion.dat_enmarcamientocb e
                    where e.identidaddatosnomencladorod = ?
                    and e.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador
                    and e.idejercicio = ?), 0) as enmarcamientodisponiblepadre";
        return $consulta;
    }

    public function selectUno()
    {
        $consulta = "SELECT s.identidadatosnomencladorod,
                         edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                         edcb.iddatosnomenclador as iddatosnomencladorcb,
                         norg.denorgano as denominacioncb,
                         coalesce(s.enmarcamiento,0) as enmarcamiento,
                         coalesce(s.enmarcamientodisponible,0) as enmarcamientodisponible ";
        return $consulta;
    }

    public function getComportamientos($params, $identpadreod)
    {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacioncb') {
                    $addWhere .= " AND upper(norg.denorgano) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(s.enmarcamiento, 0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(s.enmarcamiento, 0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(s.enmarcamiento, 0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(s.enmarcamientodisponible, 0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(s.enmarcamientodisponible, 0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(s.enmarcamientodisponible, 0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $select = self::select();
        $selectUno = self::selectUno();
        $conn = Doctrine_Manager::connection();
        $query
            = "$select from
                    (select edod.identidaddatosnomenclador as identidadatosnomencladorod,
                     enm.identidaddatosnomencladorcb,enm.enmarcamiento as enmarcamiento,
                     enm.enmarcamientodisponible as enmarcamientodisponible,edod.identidad,
                     enm.identidaddatosnomencladorodpadre
                    FROM mod_planificacion.dat_entidaddatosnomenclador edod
                    inner JOIN mod_planificacion.dat_enmarcamientocb enm
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                    where edod.identidad = ? and enm.idejercicio = ? ) s
                    RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                    ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                    LEFT join mod_estructuracomp.nom_filaestruc f
                    on (f.idfila = edcb.identidad) LEFT JOIN mod_estructuracomp.dat_estructura de
                    ON(de.idestructura = edcb.identidad) LEFT JOIN mod_estructuracomp.dat_estructuraop eo
                    on (eo.idestructura = edcb.identidad) LEFT JOIN mod_estructuracomp.nom_organo norg
                    ON( (norg.idorgano = de.idorgano AND norg.idnomeav = de.idnomeav) or
                    (norg.idorgano = eo.idorgano AND norg.idnomeav = eo.idnomeav) )
                    where edcb.iddatosnomenclador = 1 $addWhere order by
                    edcb . identidaddatosnomenclador OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query, array($identpadreod, $params['idejercicio'],
                          $params['identidad'], $params['idejercicio'],
                          $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();

        $queryAux
            = "$selectUno
                  FROM (SELECT edod.identidaddatosnomenclador as identidadatosnomencladorod,
                  enm.identidaddatosnomencladorcb,enm.enmarcamiento as enmarcamiento,
                  enm.enmarcamientodisponible as enmarcamientodisponible
                        FROM mod_planificacion.dat_entidaddatosnomenclador edod  
                        INNER JOIN mod_planificacion.dat_enmarcamientocb enm
                        ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                        WHERE edod.identidad = ? and enm.idejercicio = ? ) s
                   RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                   ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                   LEFT join mod_estructuracomp.nom_filaestruc f
                   on (f.idfila = edcb.identidad)
                   LEFT JOIN mod_estructuracomp.dat_estructura de
                   ON(de.idestructura = edcb.identidad)
                   LEFT JOIN  mod_estructuracomp.dat_estructuraop  eo
                   on (eo.idestructura = edcb.identidad)
                   LEFT JOIN mod_estructuracomp.nom_organo norg
                   ON( (norg.idorgano = de.idorgano AND norg.idnomeav = de.idnomeav)
                   OR (norg.idorgano = eo.idorgano AND norg.idnomeav = eo.idnomeav))
                   WHERE edcb.iddatosnomenclador = 1 $addWhere
                   ORDER BY edcb.identidaddatosnomenclador";
        $resAux = $conn->execute(
            $queryAux, array($params['identidad'], $params['idejercicio'])
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

    public function getComportamientosConsolidados($params)
    {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacioncb') {
                    $addWhere .= " AND upper(denorgano) LIKE '%" . strtoupper(
                        $datos ['data'] ['value']
                    ) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND enmarcamiento >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND enmarcamiento <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND enmarcamiento ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND enmarcamientodisponible >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND enmarcamientodisponible <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND enmarcamientodisponible ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT res.* from (SELECT edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                    edcb.iddatosnomenclador as iddatosnomencladorcb,norg.denorgano as denominacioncb,
                   round(sum( coalesce(s.enmarcamiento, 0)),3) as enmarcamiento,
                   round(sum( coalesce(s.enmarcamientodisponible, 0)),3) as enmarcamientodisponible,
                   0 as enmarcamientodisponiblepadre from
                    (select edod.identidaddatosnomenclador as identidadatosnomencladorod,
                    enm.identidaddatosnomencladorcb,enm.enmarcamiento as enmarcamiento,
                    enm.enmarcamientodisponible as enmarcamientodisponible,edod.identidad,
                    enm.identidaddatosnomencladorodpadre
                    FROM mod_planificacion.dat_entidaddatosnomenclador edod
                    inner JOIN mod_planificacion.dat_enmarcamientocb enm
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                    where edod.identidad in ( SELECT f.idfila
                    from mod_estructuracomp.nom_filaestruc f where f.idpadre = ?)
                    and enm.idejercicio = ? ) s
                    RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                     ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                    LEFT join mod_estructuracomp.nom_filaestruc f
                    on (f.idfila = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.dat_estructura de
                    ON(de.idestructura = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop eo
                    on (eo.idestructura = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.nom_organo norg
                    ON( (norg.idorgano = de.idorgano AND norg.idnomeav = de.idnomeav) or
                    (norg.idorgano = eo.idorgano AND norg.idnomeav = eo.idnomeav) )
                    where edcb.iddatosnomenclador = 1 group by edcb.identidaddatosnomenclador,
                    edcb.iddatosnomenclador,norg.denorgano order by
                    edcb.identidaddatosnomenclador) as res $addWhere OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query, array($params['identidad'], $params['idejercicio'],
                          $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();

        $queryAux
            = "SELECT res.* from (SELECT edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                    edcb.iddatosnomenclador as iddatosnomencladorcb,
                    norg.denorgano as denominacioncb,sum(coalesce(s.enmarcamiento,0)) as enmarcamiento,
                   sum( coalesce(s.enmarcamientodisponible, 0)) as enmarcamientodisponible,
                   0 as enmarcamientodisponiblepadre from
                    (select edod.identidaddatosnomenclador as identidadatosnomencladorod,
                    enm.identidaddatosnomencladorcb, enm.enmarcamiento as enmarcamiento,
                    enm.enmarcamientodisponible as enmarcamientodisponible,edod.identidad,
                    enm.identidaddatosnomencladorodpadre
                    FROM mod_planificacion.dat_entidaddatosnomenclador edod
                    inner JOIN mod_planificacion.dat_enmarcamientocb enm
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                    where edod.identidad in ( SELECT f.idfila
                    from mod_estructuracomp.nom_filaestruc f where f.idpadre = ?)
                    and enm.idejercicio = ? ) s
                    RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                    ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                    LEFT join mod_estructuracomp.nom_filaestruc f on (f.idfila = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.dat_estructura de
                    ON(de.idestructura = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop eo
                    on (eo.idestructura = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.nom_organo norg
                     ON( (norg.idorgano = de.idorgano AND norg.idnomeav = de.idnomeav) or
                    (norg.idorgano = eo.idorgano AND norg.idnomeav = eo.idnomeav) )
                    where edcb.iddatosnomenclador = 1 group by edcb.identidaddatosnomenclador,
                    edcb.iddatosnomenclador,norg.denorgano order by
                    edcb.identidaddatosnomenclador) as res $addWhere";
        $resAux = $conn->execute(
            $queryAux, array($params['identidad'], $params['idejercicio'])
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

    public function exportarCB($params, $identdatnom)
    {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos->field == 'denorgano') {
                    $addWhere .= " AND  norg.denorgano LIKE '%" . strtoupper(
                        $datos->data->value
                    ) . "%'";
                }
                if ($datos->field == 'enmarcamiento') {
                    if ($datos->data->comparison == "gt") {
                        $addWhere .= " AND coalesce(enm.enmarcamiento,0) >"
                            . $datos->data->value . "";
                    } elseif ($datos->data->comparison == "lt") {
                        $addWhere .= " AND coalesce(enm.enmarcamiento,0) <"
                            . $datos->data->value . "";
                    } else {
                        $addWhere .= " AND coalesce(enm.enmarcamiento,0) ="
                            . $datos->data->value . "";
                    }
                }
                if ($datos->field == 'enmarcamientodisponible') {
                    if ($datos->data->comparison == "gt") {
                        $addWhere .= " AND coalesce(enm.enmarcamientodisponible,0) >"
                            . $datos->data->value . "";
                    } elseif ($datos->data->comparison == "lt") {
                        $addWhere .= " AND coalesce(enm.enmarcamientodisponible,0) <"
                            . $datos->data->value . "";
                    } else {
                        $addWhere .= " AND coalesce(enm.enmarcamientodisponible,0) ="
                            . $datos->data->value . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query
            = "select case when (select f.idfila
from mod_estructuracomp.nom_filaestruc f where f.idfila = f.idpadre
and f.idfila = esta.idpadre) is not null then 1 else 0 end as raiz,
(select norgpadre.denorgano from mod_estructuracomp.nom_filaestruc h
                    left join (select de.idestructura , de.idnomeav, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructura , eo.idnomeav, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) p 
                    on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
                    left join mod_estructuracomp.nom_organo norgpadre 
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
                    where h.idfila = esta.idpadre) as denorganopadre,norg.denorgano,
                    coalesce(enm.enmarcamiento,0) as enmarcamiento,
                    coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible
                    from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
                    from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
                    where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
                    left join (select de.idestructura , de.idnomeav, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructura , eo.idnomeav, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) o 
                    on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
                    left join mod_estructuracomp.nom_organo norg 
                    ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)     
                    left join mod_planificacion.dat_entidaddatosnomenclador edod 
                    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                    inner join  mod_planificacion.dat_enmarcamientocb enm 
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
    		        and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?)
                    $addWhere order by esta.lft OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query,
            array($identdatnom, $params['idejercicio'], $params['start'],
                  $params['limit'])
        );
        $result = $res->fetchAll();

        $queryAux
            = "select (select norgpadre.denorgano from mod_estructuracomp.nom_filaestruc h
                    left join (select de.idestructura , de.idnomeav, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructura , eo.idnomeav, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) p 
                    on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
                    left join mod_estructuracomp.nom_organo norgpadre 
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav        )
                    where h.idfila = esta.idpadre) as denorganopadre, norg.denorgano,
                    coalesce(enm.enmarcamiento,0) as enmarcamiento,
                    coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible
                    from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
                    from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
                    where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
                    left join (select de.idestructura , de.idnomeav, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructura , eo.idnomeav, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) o 
                    on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
                    left join mod_estructuracomp.nom_organo norg 
                    ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)     
                    left join mod_planificacion.dat_entidaddatosnomenclador edod 
                    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                    inner join  mod_planificacion.dat_enmarcamientocb enm 
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
    		       and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?)
                    $addWhere order by esta.lft";
        $resAux = $conn->execute(
            $queryAux, array($identdatnom, $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        return array('total' => count($total), 'data' => $result);
    }

    public function selectDos()
    {
        $consulta = "select esta.idfila,case when ? <> 0 then case
               when esta.idfila = esta.idpadre then null
               when esta.idfila <> esta.idpadre then esta.idpadre end else null
               end as _parent,esta.lft as _lft,esta.rgt as _rgt,
                        ((esta.rgt-esta.lft) = 1) as _is_leaf,
                         norg.denorgano,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         round(coalesce(enm.enmarcamiento,0),3) as enmarcamiento";
        return $consulta;
    }

    public function selectTres()
    {
        $consulta = "select esta.idfila,

                        case when ? <> 0 then
                                      case
                                      when esta.idfila = esta.idpadre then null
                                      when esta.idfila <> esta.idpadre then esta.idpadre
                                  end
                                     else
                                     null
                                     end as _parent,
                        esta.lft as _lft,
                        esta.rgt as _rgt,
                        ((esta.rgt-esta.lft) = 1) as _is_leaf,
                         norg.denorgano,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         round(coalesce(enm.enmarcamiento,0),3) as enmarcamiento";
        return $consulta;
    }

    public function getCBTG($params, $identcb)
    {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'denorgano') {
                    $addWhere .= " AND  norg.denorgano LIKE '%" . strtoupper(
                        $datos ['data'] ['value']
                    ) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enm.enmarcamiento,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enm.enmarcamiento,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enm.enmarcamiento,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enm.enmarcamientodisponible,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enm.enmarcamientodisponible,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enm.enmarcamientodisponible,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $select = self::selectDos();
        $selectUno = self::selectTres();
        $query
            = "$select,round(coalesce(enm.enmarcamientodisponible,0),3) as enmarcamientodisponible,
               coalesce((select e.enmarcamientodisponible from mod_planificacion.dat_enmarcamientocb e
                         where e.identidaddatosnomencladorod = (select distinct edod.identidaddatosnomenclador 
                         from  mod_planificacion.dat_entidaddatosnomenclador edod 
                         where edod.identidad = esta.idpadre and edod.iddatosnomenclador = 2) 
                         and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb 
                         and e.idejercicio = ?),0) as enmarcamientodisponiblepadre, 
                         enm.identidaddatosnomencladorcb 
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav 
                         from mod_estructuracomp.nom_filaestruc h where
                         case when ? <> 0 then h.idpadre = ? else h.idpadre = 900000235
                         end order by h.lft) esta
                                   
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
                        $addWhere order by esta.lft OFFSET ? LIMIT ?";
        $result->data = $conn->execute(
            $query, array($params['idpadre'], $params['idejercicio'],
                          $params['idpadre'], $params['idpadre'], $identcb,
                          $params['idejercicio'], $params['start'],
                          $params['limit'])
        )->fetchAll(PDO::FETCH_NAMED);

        $queryAux
            = "$selectUno,round(coalesce(enm.enmarcamientodisponible,0),3) as enmarcamientodisponible,
               coalesce((select e.enmarcamientodisponible from mod_planificacion.dat_enmarcamientocb e
                         where e.identidaddatosnomencladorod = (select distinct edod.identidaddatosnomenclador 
                         from  mod_planificacion.dat_entidaddatosnomenclador edod 
                         where edod.identidad = esta.idpadre and edod.iddatosnomenclador = 2) 
                         and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb 
                         and e.idejercicio = ?),0) as enmarcamientodisponiblepadre, 
                         enm.identidaddatosnomencladorcb 
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav 
                         from mod_estructuracomp.nom_filaestruc h where case when ? <> 0 then
                         h.idpadre = ? else h.idpadre = 900000235 end order by h.lft) esta
                                   
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
                        $addWhere order by esta.lft";
        $resAux = $conn->execute(
            $queryAux, array($params['idpadre'], $params['idejercicio'],
                           $params['idpadre'], $params['idpadre'], $identcb,
                           $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            if ($value['_parent'] == null) {
                $totalplan += $value['enmarcamiento'];
            }
        }
        return array('total'              => count($total),
                     'totalenmarcamiento' => number_format($totalplan, 3),
                     'data'               => $result->data);
    }

    public function getCBTGConsolidado($params)
    {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'denorgano') {
                    $addWhere .= " AND  upper(denorgano) LIKE '%" . strtoupper(
                        $datos ['data'] ['value']
                    ) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND enmarcamiento >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND enmarcamiento <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND enmarcamiento ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND enmarcamientodisponible >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND enmarcamientodisponible <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND enmarcamientodisponible ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query
            = "select res.* FROM( select s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,
s.denorgano,s.identidaddatosnomencladorod,round(sum(s.enmarcamiento),3) as enmarcamiento,
round(sum(s.enmarcamientodisponible),3) as enmarcamientodisponible from (select esta.idfila,
case when enm.identidaddatosnomencladorodpadre <> -1 then esta.idpadre else null
end as _parent,esta.lft as _lft,esta.rgt as _rgt,((esta.rgt-esta.lft) = 1) as _is_leaf,
norg.denorgano,edod.identidaddatosnomenclador as identidaddatosnomencladorod,
coalesce(enm.enmarcamiento,0) as enmarcamiento,coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
0 as enmarcamientodisponiblepadre from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
from mod_estructuracomp.nom_filaestruc h where case when ? <> 0 then h.idpadre = ?
else h.idpadre = 900000235 end order by h.lft) esta
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
                        and enm.idejercicio = ?) order by esta.lft)s
group by s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,s.denorgano,s.identidaddatosnomencladorod
order by s._lft) as res $addWhere OFFSET ? LIMIT ?";
        $result->data = $conn->execute(
            $query, array($params['idpadre'], $params['idpadre'],
                          $params['idejercicio'], $params['start'],
                          $params['limit'])
        )->fetchAll(PDO::FETCH_NAMED);

        $queryAux
            = "select res.* FROM( select s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,
s.denorgano,s.identidaddatosnomencladorod,sum(s.enmarcamiento) as enmarcamiento,
sum(s.enmarcamientodisponible) as enmarcamientodisponible from(select esta.idfila,
case when enm.identidaddatosnomencladorodpadre <> -1 then esta.idpadre else null
end as _parent,esta.lft as _lft,esta.rgt as _rgt,((esta.rgt-esta.lft) = 1) as _is_leaf,
norg.denorgano,edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         coalesce(enm.enmarcamiento,0) as enmarcamiento,
                         coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
                         0 as enmarcamientodisponiblepadre
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
                        and enm.idejercicio = ?)order by esta.lft)s
group by s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,s.denorgano,s.identidaddatosnomencladorod
order by s._lft) as res $addWhere";
        $resAux = $conn->execute($queryAux, array($params['idejercicio']));
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            if ($value['_parent'] == null) {
                $totalplan += $value['enmarcamiento'];
            }
        };
        return array('total'              => count($total),
                     'totalenmarcamiento' => number_format($totalplan, 3),
                     'data'               => $result->data);
    }

    public function obtenerEntidadRectora($identidad)
    {
        $query = new Doctrine_Query();
        $rectora = 'rectorbalance';
        $res = $query->select('d.identidad')
            ->from(' DatEntidaddatosnomenclador d  ')
            ->innerJoin(' d.NomDatosnomenclador ndn')
            ->where('ndn.uridatosnomenclador =?', $rectora)->execute()->toArray();
        if ($res[0]['identidad'] == $identidad) {
            return true;
        }
        return false;
    }

    public function actualizarEnmarcamiento($identidadod,
        $identidaddatosnomencladorcb, $enmarcamiento, $idejercicio
    )
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "UPDATE mod_planificacion.dat_enmarcamientocb SET enmarcamiento = "
            . $enmarcamiento . "
            WHERE mod_planificacion.dat_enmarcamientocb.identidaddatosnomencladorod = "
            . $identidadod . "
                AND mod_planificacion.dat_enmarcamientocb.identidaddatosnomencladorcb = "
            . $identidaddatosnomencladorcb . "
                 AND mod_planificacion.dat_enmarcamientocb.idejercicio = "
            . $idejercicio;
        $resAux = $conn->execute($sql);
        return $resAux;
    }

    public function eliminarEnmarcamiento($identidadod,
        $identidaddatosnomencladorcb, $idejercicio
    )
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "DELETE FROM mod_planificacion.dat_enmarcamientocb
                WHERE mod_planificacion.dat_enmarcamientocb.identidaddatosnomencladorod = "
            . $identidadod . "
                AND mod_planificacion.dat_enmarcamientocb.identidaddatosnomencladorcb = "
            . $identidaddatosnomencladorcb . "
                AND mod_planificacion.dat_enmarcamientocb.idejercicio = "
            . $idejercicio;
        $resAux = $conn->execute($sql);

        return $resAux;
    }

    public function verificarEnmarcamientoCB($params)
    {
        $query = new Doctrine_Query();
        $res = $query->select(
            'd.enmarcamientodisponible as enmarcamientodisponiblepadre'
        )
            ->from('DatEnmarcamientocb d')
            ->where(
                'd.identidaddatosnomencladorcb =? and
                                 d.identidaddatosnomencladorod = ? and
                                 d.idejercicio = ?',
                array($params['identidaddatosnomencladorcb'],
                      $params['identidadpadre'], $params['idejercicio'])
            )->execute()->toArray();
        if ($params['enmarcamientomodificado'] <= ($params['enmarcamiento']
                + $res[0]['enmarcamientodisponiblepadre'])
            || $params['enmarcamientomodificado'] <= $params['enmarcamiento']
        ) {
            return '24';
        } else {
            return '20';
        }
    }

    public function groupBy()
    {
        $consulta = "group by res.denominacionentidadpadre,res.enmarcamientoplan,
res.enmarcamientoreal,res.lft,res.rgt,res.idpadre,res.idfila,res.identidaddatosnomencladorcb,
res.denominacionentidad,res.identidaddatosnomencladorod,res.enmarcamientodisponible,
res.identidadcb,res.denominacioncb";
        return $consulta;
    }

    public function groupbyUno()
    {
    $consulta = "group by res.denominacionentidadpadre,res.enmarcamientoplan,
res.enmarcamientoreal,res.lft,res.idpadre,res.idfila,res.rgt,res.identidaddatosnomencladorcb,
res.denominacionentidad,res.identidaddatosnomencladorod,res.enmarcamientodisponible,
res.identidadcb,res.denominacioncb";
        return $consulta;
    }

    public function getReporteComportamientos($params)
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
                if ($datos['field'] == 'denominacioncb') {
                    $addWhere .= " AND upper(res.denominacioncb) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamientoplan') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND res.enmarcamientoplan >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamientoplan <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamientoplan ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientoreal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND res.enmarcamientoreal >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamientoreal <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamientoreal ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'diferencia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND (res.enmarcamientoplan - res.enmarcamientoreal) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND (res.enmarcamientoplan - res.enmarcamientoreal) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND (res.enmarcamientoplan - res.enmarcamientoreal) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $group = self::groupBy();
        $query
            = "select res.* ,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia
		from (select esta.lft,esta.rgt, esta.idpadre,(select norgpadre.denorgano
from mod_estructuracomp.nom_filaestruc h left join (select de.idestructura,
de.idnomeav,de.idorgano from mod_estructuracomp.dat_estructura de
union select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) p on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = esta.idpadre) as denominacionentidadpadre,
esta.idfila,norg.denorgano as denominacionentidad,
 edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(enm.enmarcamiento,0) as enmarcamientoplan,
 coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
 enm.identidaddatosnomencladorcb,edcb.identidad as identidadcb,
 (select norgpadre.denorgano from mod_estructuracomp.nom_filaestruc h
left join (select de.idestructura , de.idnomeav, de.idorgano
from mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) p
on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = edcb.identidad) as denominacioncb,coalesce((select sum(p.importe) as enmarcamientoreal
from mod_planificacion.dat_planificacion p inner join mod_planificacion.dat_entidadmodelo em
on (em.identidadmodelo = p.identidadmodelo) where em.identidad = esta.idfila
and p.idcentrobalance =  enm.identidaddatosnomencladorcb
and p.idejercicio = enm.idejercicio),0) as enmarcamientoreal
from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
from mod_estructuracomp.nom_filaestruc p, mod_estructuracomp.nom_filaestruc h
where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
left join (select de.idestructura , de.idnomeav, de.idorgano
from mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) o on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
left join mod_estructuracomp.nom_organo norg ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
   left join mod_planificacion.dat_entidaddatosnomenclador edod
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamientocb enm
    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
     and enm.idejercicio = ?)
    inner join mod_planificacion.dat_entidaddatosnomenclador edcb
    on ( edcb.identidaddatosnomenclador = enm.identidaddatosnomencladorcb)) as res
$addWhere $group $having order by res.lft,res.rgt,res.identidaddatosnomencladorcb OFFSET ? LIMIT ?";

        $res = $conn->execute(
            $query,
            array($params['idejercicio'], $params['start'], $params['limit'])
        );
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $groupUno = self::groupbyUno();
        $queryAux
            = "select res.* ,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia
		from (select esta.lft,esta.rgt, esta.idpadre,(select norgpadre.denorgano
from mod_estructuracomp.nom_filaestruc h left join (select de.idestructura , de.idnomeav, de.idorgano
from mod_estructuracomp.dat_estructura de union select eo.idestructura , eo.idnomeav, eo.idorgano
from mod_estructuracomp.dat_estructuraop  eo ) p on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = esta.idpadre) as denominacionentidadpadre,esta.idfila,
 norg.denorgano as denominacionentidad,edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(enm.enmarcamiento,0) as enmarcamientoplan,
 coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
 enm.identidaddatosnomencladorcb,edcb.identidad as identidadcb,
 (select norgpadre.denorgano from mod_estructuracomp.nom_filaestruc h
left join (select de.idestructura , de.idnomeav, de.idorgano from
mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) p on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav)
left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = edcb.identidad) as denominacioncb,coalesce( (select sum(p.importe) as enmarcamientoreal
from mod_planificacion.dat_planificacion p inner join mod_planificacion.dat_entidadmodelo em
on (em.identidadmodelo = p.identidadmodelo) where em.identidad = esta.idfila
and p.idcentrobalance =  enm.identidaddatosnomencladorcb and p.idejercicio = enm.idejercicio),0) as enmarcamientoreal
from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav from mod_estructuracomp.nom_filaestruc p,
mod_estructuracomp.nom_filaestruc h where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
left join (select de.idestructura , de.idnomeav, de.idorgano from
mod_estructuracomp.dat_estructura de union select eo.idestructura , eo.idnomeav, eo.idorgano
from mod_estructuracomp.dat_estructuraop  eo ) o on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
left join mod_estructuracomp.nom_organo norg ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
    
    left join mod_planificacion.dat_entidaddatosnomenclador edod
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamientocb enm
    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
    and enm.idejercicio = ?)
    inner join mod_planificacion.dat_entidaddatosnomenclador edcb
    on ( edcb.identidaddatosnomenclador = enm.identidaddatosnomencladorcb)) as res
$addWhere $groupUno $having order by res.lft,res.rgt,res.identidaddatosnomencladorcb";
        $resAux = $conn->execute($queryAux, array($params['idejercicio']));
        $total = $resAux->fetchAll(PDO::FETCH_ASSOC);

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

    public function getEntidadDadoComportamiento($idcomportamiento)
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT distinct d.identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador d
                    INNER JOIN mod_planificacion.dat_enmarcamientocb  cb
                    ON d.identidaddatosnomenclador = cb.identidaddatosnomencladorcb 
                    WHERE d.iddatosnomenclador = ?";
        $data = $conn->execute($query, array($idcomportamiento))
            ->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}