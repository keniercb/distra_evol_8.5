<?php

class DatEnmarcamiento extends BaseDatEnmarcamiento {

    public function setUp() {
        parent::setUp();
    }

    public function select() {
        $consulta = "SELECT s.identidadatosnomencladorod,
                   s.idenmarcamiento,edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                    edcb.iddatosnomenclador as iddatosnomencladorcb,
                    norg.denominacion as denominacioncb,
                    round(coalesce(s.enmarcamiento, 0),3) as enmarcamiento,
                    round(coalesce(s.enmarcamientodisponible, 0),3) as enmarcamientodisponible,
                    coalesce((select e.enmarcamientodisponible from mod_planificacion.dat_enmarcamiento e
                     where e.identidaddatosnomencladorod = ?
                      and e.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador
                      and e.idejercicio = ?), 0) as enmarcamientodisponiblepadre";
        return $consulta;
    }

    public function selectUno() {
        $consulta = "select edod.identidaddatosnomenclador as identidadatosnomencladorod,
                            enm.identidaddatosnomencladorcb,enm.enmarcamiento as enmarcamiento,
                            enm.idenmarcamiento,enm.enmarcamientodisponible as enmarcamientodisponible,
                            edod.identidad,enm.identidaddatosnomencladorodpadre";
        return $consulta;
    }

    public function selectDos() {
        $consulta = "SELECT s.identidadatosnomencladorod,
                         edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                         edcb.iddatosnomenclador as iddatosnomencladorcb,
                         norg.denominacion as denominacioncb,coalesce(s.enmarcamiento,0) as enmarcamiento,
                         coalesce(s.enmarcamientodisponible,0) as enmarcamientodisponible ";
        return $consulta;
    }

    public function getComportamientos($params, $identpadreod, $limite) {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacioncb') {
                    $addWhere .= " AND upper(norg.denominacion) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
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
        $query = "$select from ($selectUno
                    FROM mod_planificacion.dat_entidaddatosnomenclador edod
                    inner JOIN mod_planificacion.dat_enmarcamiento enm
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                    where edod.identidad = ? and enm.idejercicio = ? ) s
                    RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                    ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                    LEFT join mod_estructuracomp.nom_filaestruc f
                    on (f.idfila = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.dat_estructura de
                     ON(de.idestructura = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop eo
                     on (eo.idestructuraop = edcb.identidad)
                    LEFT JOIN mod_estructuracomp.nom_organo norg
                    ON( (norg.idorgano = de.idorgano AND norg.idconcepto = de.idconcepto) or
                    (norg.idorgano = eo.idorgano AND norg.idconcepto = eo.idconcepto) )
                    where edcb.iddatosnomenclador = 1 $addWhere order by
                    edcb . identidaddatosnomenclador OFFSET ? LIMIT ?";
        $res = $conn->execute(
                $query, array($identpadreod, $params['idejercicio'],
            $params['identidad'], $params['idejercicio'],
            $params['start'], $params['limit'])
        );

        $result = $res->fetchAll();
        $selectDos = self::selectDos();
        $queryAux = "$selectDos
                  FROM (SELECT edod.identidaddatosnomenclador as identidadatosnomencladorod,
                               enm.identidaddatosnomencladorcb,
                               enm.enmarcamiento as enmarcamiento,
                               enm.enmarcamientodisponible as enmarcamientodisponible
                        FROM mod_planificacion.dat_entidaddatosnomenclador edod  
                        INNER JOIN mod_planificacion.dat_enmarcamiento enm
                        ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                        WHERE edod.identidad = ?
                        and enm.idejercicio = ? ) s
                   RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                   ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                   LEFT join mod_estructuracomp.nom_filaestruc f
                   on (f.idfila = edcb.identidad)
                   LEFT JOIN mod_estructuracomp.dat_estructura de
                   ON(de.idestructura = edcb.identidad)
                   LEFT JOIN  mod_estructuracomp.dat_estructuraop  eo
                   on (eo.idestructuraop = edcb.identidad)
                   LEFT JOIN mod_estructuracomp.nom_organo norg
                   ON( (norg.idorgano = de.idorgano AND norg.idconcepto = de.idconcepto)
                   OR (norg.idorgano = eo.idorgano AND norg.idconcepto = eo.idconcepto))
                   WHERE edcb.iddatosnomenclador = 1 $addWhere ORDER BY edcb.identidaddatosnomenclador";
        $resAux = $conn->execute(
                $queryAux, array($params['identidad'], $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            $totalplan += $value['enmarcamiento'];
        }
        if ($limite == true) {
            return array('total' => count($total),
                'totalenmarcamiento' => number_format($totalplan, 3),
                'data' => $result);
        } else {
            return array('total' => count($total),
                'totalenmarcamiento' => number_format($totalplan, 3),
                'data' => $total);
        }
    }

    public function getComportamientosConsolidados($params) {
        $addWhere = "where true";
        $addWherecon = "where edcb.iddatosnomenclador = 1 and true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacioncb') {
                    $addWherecon .= " AND upper(norg.denominacion) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND res.enmarcamiento >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamiento <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamiento ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponible') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND res.enmarcamientodisponible >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamientodisponible <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamientodisponible ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT res.* from (SELECT edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                    edcb.iddatosnomenclador as iddatosnomencladorcb,norg.denominacion as denominacioncb,
                   round(sum( coalesce(s.enmarcamiento, 0)),3) as enmarcamiento,
                   round(sum( coalesce(s.enmarcamientodisponible, 0)),3) as enmarcamientodisponible,
                   0 as enmarcamientodisponiblepadre from
                    (select edod.identidaddatosnomenclador as identidadatosnomencladorod,
                     enm.identidaddatosnomencladorcb,enm.enmarcamiento as enmarcamiento,
                     enm.enmarcamientodisponible as enmarcamientodisponible,edod.identidad,
                    enm.identidaddatosnomencladorodpadre
                    FROM mod_planificacion.dat_entidaddatosnomenclador edod
                    inner JOIN mod_planificacion.dat_enmarcamiento enm
                     ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                    where edod.identidad in ( SELECT f.idfila
                    from mod_estructuracomp.nom_filaestruc f where f.idpadre = ?)
                    and enm.idejercicio = ? ) s
                    RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                    ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                    LEFT join mod_estructuracomp.nom_filaestruc f
                     on (f.idfila = edcb.identidad)LEFT JOIN mod_estructuracomp.dat_estructura de
                     ON(de.idestructura = edcb.identidad)LEFT JOIN mod_estructuracomp.dat_estructuraop eo
                     on (eo.idestructuraop = edcb.identidad)LEFT JOIN mod_estructuracomp.nom_organo norg
                    ON( (norg.idorgano = de.idorgano AND norg.idconcepto = de.idconcepto) or
                    (norg.idorgano = eo.idorgano AND norg.idconcepto = eo.idconcepto))
                    $addWherecon  group by edcb.identidaddatosnomenclador,edcb.iddatosnomenclador,
                    norg.denominacion order by edcb.identidaddatosnomenclador) as res
                    $addWhere OFFSET ? LIMIT ?";
        $res = $conn->execute(
                $query, array($params['identidad'], $params['idejercicio'],
            $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();

        $queryAux = "SELECT res.* from (SELECT edcb.identidaddatosnomenclador as identidaddatosnomencladorcb,
                    edcb.iddatosnomenclador as iddatosnomencladorcb,
                    norg.denominacion as denominacioncb,
                   sum( coalesce(s.enmarcamiento, 0)) as enmarcamiento,
                   sum( coalesce(s.enmarcamientodisponible, 0)) as enmarcamientodisponible,
                   0 as enmarcamientodisponiblepadre from
                    (select edod.identidaddatosnomenclador as identidadatosnomencladorod,
                    enm.identidaddatosnomencladorcb,enm.enmarcamiento as enmarcamiento,
                    enm.enmarcamientodisponible as enmarcamientodisponible,edod.identidad,
                    enm.identidaddatosnomencladorodpadre
                    FROM mod_planificacion.dat_entidaddatosnomenclador edod
                    inner JOIN mod_planificacion.dat_enmarcamiento enm
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod)
                    where edod.identidad in ( SELECT f.idfila
                    from mod_estructuracomp.nom_filaestruc f where f.idpadre = ?)
                    and enm.idejercicio = ? ) s
                    RIGHT JOIN mod_planificacion.dat_entidaddatosnomenclador edcb
                    ON (s.identidaddatosnomencladorcb = edcb.identidaddatosnomenclador)
                    LEFT join mod_estructuracomp.nom_filaestruc f
                    on (f.idfila = edcb.identidad)LEFT JOIN mod_estructuracomp.dat_estructura de
                    ON(de.idestructura = edcb.identidad)LEFT JOIN mod_estructuracomp.dat_estructuraop eo
                    on (eo.idestructuraop = edcb.identidad)LEFT JOIN mod_estructuracomp.nom_organo norg
                    ON( (norg.idorgano = de.idorgano AND norg.idconcepto = de.idconcepto) or
                    (norg.idorgano = eo.idorgano AND norg.idconcepto = eo.idconcepto))
                    $addWherecon group by edcb.identidaddatosnomenclador,edcb.iddatosnomenclador,
                    norg.denominacion order by edcb.identidaddatosnomenclador) as res $addWhere";
        $resAux = $conn->execute(
                $queryAux, array($params['identidad'], $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            $totalplan += $value['enmarcamiento'];
        }
        return array('total' => count($total),
            'totalenmarcamiento' => number_format($totalplan, 3),
            'data' => $result);
    }

    public function exportarCB($params, $identdatnom) {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos->field == 'denorgano') {
                    $addWhere .= " AND  norg.denominacion LIKE '" . strtoupper(
                                    $datos->data->value
                            ) . "'";
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
        $query = "select case when (select f.idfila from mod_estructuracomp.nom_filaestruc f
where f.idfila = f.idpadre and f.idfila = esta.idpadre) is not null then 1 else 0
end as raiz,(select norgpadre.denominacion from mod_estructuracomp.nom_filaestruc h
                    left join (select de.idestructura , de.idconcepto, de.idorgano
                    from mod_estructuracomp.dat_estructura de union
                    select eo.idestructuraop , eo.idconcepto, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) p 
                    on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)
                    left join mod_estructuracomp.nom_organo norgpadre 
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto        )
                    where h.idfila = esta.idpadre) as denorganopadre,norg.denominacion,
                    coalesce(enm.enmarcamiento,0) as enmarcamiento,
                    coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible
                    from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
                    from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
                    where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
                    left join (select de.idestructura , de.idconcepto, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructuraop , eo.idconcepto, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) o 
                    on (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto)
                    left join mod_estructuracomp.nom_organo norg 
                    ON( norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto)     
                    left join mod_planificacion.dat_entidaddatosnomenclador edod 
                    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                    inner join  mod_planificacion.dat_enmarcamiento enm 
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
    		        and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?)
                    $addWhere order by esta.lft";
        $res = $conn->execute(
                $query, array($identdatnom, $params['idejercicio'])
        );
        $result = $res->fetchAll();

        $queryAux = "select (select norgpadre.denominacion from mod_estructuracomp.nom_filaestruc h
                       left join (select de.idestructura , de.idconcepto, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructuraop , eo.idconcepto, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) p 
                    on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)
                    left join mod_estructuracomp.nom_organo norgpadre 
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto        )
                    where h.idfila = esta.idpadre) as denorganopadre,norg.denominacion,
                    coalesce(enm.enmarcamiento,0) as enmarcamiento,
                    coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible
                    from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
                    from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
                    where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
                    left join (select de.idestructura , de.idconcepto, de.idorgano
                    from mod_estructuracomp.dat_estructura de
                    union select eo.idestructuraop , eo.idconcepto, eo.idorgano
                    from mod_estructuracomp.dat_estructuraop  eo ) o 
                    on (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto)
                    left join mod_estructuracomp.nom_organo norg 
                    ON( norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto)     
                    left join mod_planificacion.dat_entidaddatosnomenclador edod 
                    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                    inner join  mod_planificacion.dat_enmarcamiento enm 
                    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
    		        and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?)
                    $addWhere order by esta.lft";
        $resAux = $conn->execute(
                $queryAux, array($identdatnom, $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        return array('total' => count($total), 'data' => $result);
    }

    public function selectCuatro() {
        $consulta = "select s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,
s.denorganopadre,s.denominacion,s.identidaddatosnomencladorod,sum(s.enmarcamiento) as enmarcamiento,
sum(s.enmarcamientodisponible) as enmarcamientodisponible";
        return $consulta;
    }

    public function groupBy() {
        $consulta = "group by s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,
s.denorganopadre,s.denominacion,s.identidaddatosnomencladorod order by s._lft";
        return $consulta;
    }

    public function exportarCBTGConsolidado($params) {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos->field == 'denorgano') {
                    $addWhere .= " AND  upper(s.denominacion) LIKE '" . strtoupper(
                                    $datos->data->value
                            ) . "'";
                }
                if ($datos->field == 'enmarcamiento') {
                    if ($datos->data->comparison == "gt") {
                        $addWhere .= " AND s.enmarcamiento >"
                                . $datos->data->value . "";
                    } elseif ($datos->data->comparison == "lt") {
                        $addWhere .= " AND s.enmarcamiento <"
                                . $datos->data->value . "";
                    } else {
                        $addWhere .= " AND s.enmarcamiento ="
                                . $datos->data->value . "";
                    }
                }
                if ($datos->field == 'enmarcamientodisponible') {
                    if ($datos->data->comparison == "gt") {
                        $addWhere .= " AND s.enmarcamientodisponible >"
                                . $datos->data->value . "";
                    } elseif ($datos->data->comparison == "lt") {
                        $addWhere .= " AND s.enmarcamientodisponible <"
                                . $datos->data->value . "";
                    } else {
                        $addWhere .= " AND s.enmarcamientodisponible ="
                                . $datos->data->value . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $select = self::selectCuatro();
        $groupby = self::groupBy();
        $query = "$select from (select esta.idfila,
                        case when enm.identidaddatosnomencladorodpadre <> -1 then 
                        esta.idpadre else null end as _parent,esta.lft as _lft,
                        esta.rgt as _rgt,((esta.rgt-esta.lft) = 1) as _is_leaf,
                        (select norgpadre.denominacion from mod_estructuracomp.nom_filaestruc h
                                 left join (select de.idestructura , de.idconcepto, de.idorgano 
                    from mod_estructuracomp.dat_estructura de 
                    union 
                    select eo.idestructuraop , eo.idconcepto, eo.idorgano 
                    from mod_estructuracomp.dat_estructuraop  eo ) p  
                    on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto) 
                    left join mod_estructuracomp.nom_organo norgpadre  
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto        ) 
                    where h.idfila = esta.idpadre) as denorganopadre,norg.denominacion,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod, 
                         coalesce(enm.enmarcamiento,0) as enmarcamiento, 
                         coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible, 
                         0 as enmarcamientodisponiblepadre 
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto 
                              from mod_estructuracomp.nom_filaestruc h order by h.lft) esta
                        left join (select de.idestructura , de.idconcepto, de.idorgano 
                        from mod_estructuracomp.dat_estructura de 
                        union select eo.idestructuraop , eo.idconcepto, eo.idorgano 
                        from mod_estructuracomp.dat_estructuraop  eo ) o on   
                        (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto) 
                        left join mod_estructuracomp.nom_organo norg ON 
                        (norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto) 
                         
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on   
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2) 
                        inner join  mod_planificacion.dat_enmarcamiento enm ON   
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod       
                        and enm.idejercicio = ? )order by esta.lft)s $addWhere $groupby";
        $result->data = $conn->execute($query, array($params['idejercicio']))
                ->fetchAll(PDO::FETCH_NAMED);
        return array('data' => $result->data);
    }

    public function selectCinco() {
        $consulta = "select esta.idfila,case when ? <> 0 then case
                     when esta.idfila = esta.idpadre then null
                     when esta.idfila <> esta.idpadre then esta.idpadre end
                     else null end as _parent,esta.lft as _lft,esta.rgt as _rgt";
        return $consulta;
    }

    public function getCBTG($params, $identcb) {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $addWhere .= " AND  norg.denominacion LIKE '" . strtoupper(
                                    $datos ['data'] ['value']
                            ) . "'";
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
        $select = self::selectCinco();
        $query = "$select ,((select count (e.idenmarcamiento) from mod_planificacion.dat_enmarcamiento e
                        where e.identidaddatosnomencladorodpadre = edod.identidaddatosnomenclador
                        and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb
                        and e.idejercicio = enm.idejercicio
                        ) = 0) as _is_leaf,
                         norg.denominacion, 
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod, 
                         round(coalesce(enm.enmarcamiento,0),3) as enmarcamiento, 
                         enm.idenmarcamiento,
                         round(coalesce(enm.enmarcamientodisponible,0),3) as enmarcamientodisponible, 
                         coalesce((select e.enmarcamientodisponible
                         from  mod_planificacion.dat_enmarcamiento e
                         where e.identidaddatosnomencladorod = (select distinct edod.identidaddatosnomenclador 
                         from  mod_planificacion.dat_entidaddatosnomenclador edod 
                         where edod.identidad = esta.idpadre and edod.iddatosnomenclador = 2) 
                         and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb 
                         and e.idejercicio = ?),0) as enmarcamientodisponiblepadre, 
                         enm.identidaddatosnomencladorcb 
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
                         from mod_estructuracomp.nom_filaestruc h where
                         case when ? <> 0 then h.idpadre = ? else h.idpadre = ?
                         end order by h.lft) esta
                        left join (select de.idestructura , de.idconcepto, de.idorgano 
                        from mod_estructuracomp.dat_estructura de 
                        union select eo.idestructuraop , eo.idconcepto, eo.idorgano 
                        from mod_estructuracomp.dat_estructuraop  eo ) o on  
                        (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto) 
                        left join mod_estructuracomp.nom_organo norg ON 
                        (norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto) 
                        
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on  
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2) 
                        inner join  mod_planificacion.dat_enmarcamiento enm ON  
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod     
                        and enm.identidaddatosnomencladorcb = ? 
                        and enm.idejercicio = ?) $addWhere order by esta.lft OFFSET ? LIMIT ?";
        $result->data = $conn->execute(
                        $query, array($params['idpadre'], $params['idejercicio'],
                    $params['idpadre'], $params['idpadre'],
                    $params['identidadrectora'], $identcb,
                    $params['idejercicio'], $params['start'],
                    $params['limit'])
                )->fetchAll(PDO::FETCH_NAMED);

        $queryAux = "$select,((select count (e.idenmarcamiento) from mod_planificacion.dat_enmarcamiento e
                        where e.identidaddatosnomencladorodpadre = edod.identidaddatosnomenclador
                        and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb
                        and e.idejercicio = enm.idejercicio ) = 0) as _is_leaf,norg.denominacion,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod, 
                         round(coalesce(enm.enmarcamiento,0),3) as enmarcamiento, 
                         enm.idenmarcamiento,
                         round(coalesce(enm.enmarcamientodisponible,0),3) as enmarcamientodisponible, 
                         coalesce((select e.enmarcamientodisponible
                         from  mod_planificacion.dat_enmarcamiento e
                         where e.identidaddatosnomencladorod = (select distinct edod.identidaddatosnomenclador 
                         from  mod_planificacion.dat_entidaddatosnomenclador edod 
                         where edod.identidad = esta.idpadre and edod.iddatosnomenclador = 2) 
                         and e.identidaddatosnomencladorcb = enm.identidaddatosnomencladorcb 
                         and e.idejercicio = ?),0) as enmarcamientodisponiblepadre, 
                         enm.identidaddatosnomencladorcb 
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto 
                         from mod_estructuracomp.nom_filaestruc h where case when ? <> 0 then
                         h.idpadre = ? else h.idpadre = ? end order by h.lft) esta
                                   
                        left join (select de.idestructura , de.idconcepto, de.idorgano 
                        from mod_estructuracomp.dat_estructura de 
                        union select eo.idestructuraop , eo.idconcepto, eo.idorgano 
                        from mod_estructuracomp.dat_estructuraop  eo ) o on  
                        (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto) 
                        left join mod_estructuracomp.nom_organo norg ON 
                        (norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto) 
                        
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on  
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2) 
                        inner join  mod_planificacion.dat_enmarcamiento enm ON  
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod     
                        and enm.identidaddatosnomencladorcb = ? and enm.idejercicio = ?)
                         $addWhere order by esta.lft";
        $resAux = $conn->execute(
                $queryAux, array($params['idpadre'], $params['idejercicio'],
            $params['idpadre'], $params['idpadre'],
            $params['identidadrectora'], $identcb,
            $params['idejercicio'])
        );
        $total = $resAux->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            if ($value['_parent'] == null) {
                $totalplan += $value['enmarcamiento'];
            }
        }
        return array('total' => count($total),
            'totalenmarcamiento' => number_format($totalplan, 3),
            'data' => $result->data);
    }

    public function selectSeis() {
        $consulta = "select s.idfila,s._parent,s._lft,s._rgt,(s._is_leaf = 0) as _is_leaf,
s.denominacion,s.identidaddatosnomencladorod,sum(s.enmarcamiento) as enmarcamiento,
sum(s.enmarcamientodisponible) as enmarcamientodisponible";
        return $consulta;
    }

    public function groupbyUno() {
        $consulta = "group by s.idfila,s._parent,s._lft,s._rgt,s._is_leaf,
s.denominacion,s.identidaddatosnomencladorod order by s._lft";
        return $consulta;
    }

    public function getCBTGConsolidado($params) {
        $addWhere = "where true";
        $addWherecon = "where true";

        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $addWherecon .= " AND  upper(norg.denominacion) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
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
        $select = self::selectSeis();
        $group = self::groupbyUno();
        $query = "$select from (select esta.idfila,
                       case when enm.identidaddatosnomencladorodpadre <> -1 then
                       esta.idpadre else null end as _parent,esta.lft as _lft,
                        esta.rgt as _rgt,
                        (select count (e.idenmarcamiento) from mod_planificacion.dat_enmarcamiento e 
                        where e.identidaddatosnomencladorodpadre = edod.identidaddatosnomenclador 
                        and e.idejercicio = enm.idejercicio
                        ) as _is_leaf,
                         norg.denominacion,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         coalesce(enm.enmarcamiento,0) as enmarcamiento,
                         coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
                         0 as enmarcamientodisponiblepadre
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
                              from mod_estructuracomp.nom_filaestruc h
                                   order by h.lft) esta
                                  
                        left join (select de.idestructura , de.idconcepto, de.idorgano
                        from mod_estructuracomp.dat_estructura de
                        union select eo.idestructuraop , eo.idconcepto, eo.idorgano
                        from mod_estructuracomp.dat_estructuraop  eo ) o on  
                        (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto)
                        left join mod_estructuracomp.nom_organo norg ON
                        (norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto)
                        
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on  
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                        inner join  mod_planificacion.dat_enmarcamiento enm ON  
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod      
                        and enm.idejercicio = ?) $addWherecon order by esta.lft OFFSET ? LIMIT ?)s
                        $addWhere $group";
        $result->data = $conn->execute(
                        $query, array($params['idejercicio'], $params['start'], $params['limit'])
                )->fetchAll(PDO::FETCH_NAMED);
        $group = self::groupbyUno();
        $select = self::selectSeis();
        $queryAux = "$select from (select esta.idfila,
                        case when enm.identidaddatosnomencladorodpadre <> -1 then
                        esta.idpadre else null end as _parent,esta.lft as _lft,
                        esta.rgt as _rgt,(select count (e.idenmarcamiento)
                        from mod_planificacion.dat_enmarcamiento e
                        where e.identidaddatosnomencladorodpadre = edod.identidaddatosnomenclador 
                        and e.idejercicio = enm.idejercicio ) as _is_leaf,norg.denominacion,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         coalesce(enm.enmarcamiento,0) as enmarcamiento,
                         coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
                         0 as enmarcamientodisponiblepadre
                         from (select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
                         from mod_estructuracomp.nom_filaestruc h order by h.lft) esta
                                  
                        left join (select de.idestructura , de.idconcepto, de.idorgano
                        from mod_estructuracomp.dat_estructura de
                        union select eo.idestructuraop , eo.idconcepto, eo.idorgano
                        from mod_estructuracomp.dat_estructuraop  eo ) o on  
                        (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto)
                        left join mod_estructuracomp.nom_organo norg ON
                        (norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto)
                        
                        left join mod_planificacion.dat_entidaddatosnomenclador edod on  
                        (edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                        inner join  mod_planificacion.dat_enmarcamiento enm ON  
                        (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod      
                        and enm.idejercicio = ?) $addWherecon order by esta.lft)s
                        $addWhere $group";

        $resAux = $conn->execute($queryAux, array($params['idejercicio']));
        $total = $resAux->fetchAll();
        return array('total' => count($total),
            'totalenmarcamiento' => number_format(
                    $result->data[0]['enmarcamientototal'], 3
            ), 'data' => $result->data);
    }

    public function obtenerEntidadRectora($identidad) {
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

    public function actualizarEnmarcamiento($identidadod, $identidaddatosnomencladorcb, $enmarcamiento, $idejercicio
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planificacion.dat_enmarcamiento SET enmarcamiento = "
                . $enmarcamiento . "
            WHERE mod_planificacion.dat_enmarcamiento.identidaddatosnomencladorod = "
                . $identidadod . "
                AND mod_planificacion.dat_enmarcamiento.identidaddatosnomencladorcb = "
                . $identidaddatosnomencladorcb . "
                 AND mod_planificacion.dat_enmarcamiento.idejercicio = "
                . $idejercicio;
        $resAux = $conn->execute($sql);
        return $resAux;
    }

    public function eliminarEnmarcamiento($identidadod, $identidaddatosnomencladorcb, $idejercicio
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_planificacion.dat_enmarcamiento
                WHERE mod_planificacion.dat_enmarcamiento.identidaddatosnomencladorod = "
                . $identidadod . "
                AND mod_planificacion.dat_enmarcamiento.identidaddatosnomencladorcb = "
                . $identidaddatosnomencladorcb . "
                AND mod_planificacion.dat_enmarcamiento.idejercicio = "
                . $idejercicio;
        $resAux = $conn->execute($sql);

        return $resAux;
    }

    public function verificarEnmarcamientoCB($params) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'd.enmarcamientodisponible as enmarcamientodisponiblepadre'
                        )
                        ->from('DatEnmarcamiento d')
                        ->where(
                                'd.identidaddatosnomencladorcb =? and
                                 d.identidaddatosnomencladorod = ? and
                                 d.idejercicio = ?', array($params['identidaddatosnomencladorcb'],
                            $params['identidadpadre'], $params['idejercicio'])
                        )->execute()->toArray();
        $entidadrectora = DatEntidaddatosnomenclador::getEntDatNom(
                        $params['entidadrectora']
        );
        if ($params['identidadpadre'] !== $entidadrectora[0]['identidaddatosnomenclador']
        ) {
            if ($params['enmarcamientomodificado'] <= ($params['enmarcamiento'] + $res[0]['enmarcamientodisponiblepadre']) || $params['enmarcamientomodificado'] <= $params['enmarcamiento']
            ) {
                return '24';
            } else {
                return '20';
            }
        } else {
            return '24';
        }
    }

    public function groupbyDos() {
        $consulta = "group by res.lft,res.rgt,res.idpadre,res.denominacionentidadpadre,
                    res.idfila,denominacionentidad,res.identidaddatosnomencladorod,
                    res.enmarcamientoplan,res.enmarcamientodisponible,
                    res.identidaddatosnomencladorcb,res.identidadcb,res.denominacioncb,
                    res.enmarcamientoreal,res.denominacionvia,res.enmarcamientoplanv,
                    res.enmarcamientorealv";
        return $consulta;
    }

    public function getReporteComportamientos($params) {
        $addWhere = "where true";
        $addWherecon = "where true";
        $having = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionentidadpadre') {
                    $having .= " having upper(res.denominacionentidadpadre) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
                }
                if ($datos['field'] == 'denominacionentidad') {
                    $addWhere .= " AND upper(res.denominacionentidad) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
                }
                if ($datos['field'] == 'denominacioncb') {
                    $addWherecon
                            .= " AND upper( (select norgpadre.denominacion
                                        from mod_estructuracomp.nom_filaestruc h
                                        left join (select de.idestructura , de.idconcepto, de.idorgano
                                        from mod_estructuracomp.dat_estructura de
                                                    union 
                                                    select eo.idestructuraop , eo.idconcepto, eo.idorgano
                                                    from mod_estructuracomp.dat_estructuraop  eo ) 
                                        p on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)
                            left join mod_estructuracomp.nom_organo norgpadre
                            ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto        )
                            where h.idfila = edcb.identidad)) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
                }
                if ($datos ['field'] == 'enmarcamientoplan') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWherecon .= " AND coalesce(enm.enmarcamiento,0) >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWherecon .= " AND coalesce(enm.enmarcamiento,0) <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWherecon .= " AND coalesce(enm.enmarcamiento,0) ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos['field'] == 'denominacionvia') {
                    $addWherecon .= " AND upper(nvia.denominacion) LIKE '"
                            . strtoupper($datos ['data'] ['value']) . "'";
                }
                if ($datos ['field'] == 'enmarcamientoplanv') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWherecon .= " AND enmvia.enmarcamientovia >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWherecon .= " AND enmvia.enmarcamientovia <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWherecon .= " AND enmvia.enmarcamientovia ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientoreal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND res.enmarcamientorealv >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamientorealv <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamientorealv ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientorealv') {
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
                if ($datos ['field'] == 'diferenciav') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND (res.enmarcamientoplanv - res.enmarcamientorealv) >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND (res.enmarcamientoplanv - res.enmarcamientorealv) <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND (res.enmarcamientoplanv - res.enmarcamientorealv) ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $groupby = self::groupbyDos();
        $query = "select res.* ,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia,
              (res.enmarcamientoplanv - res.enmarcamientorealv)as diferenciav
                from (select esta.lft,esta.rgt,esta.idpadre,
                (select norgpadre.denominacion as denorgano from mod_estructuracomp.nom_filaestruc h
                 left join (select de.idestructura,de.idconcepto, de.idorgano
                 from mod_estructuracomp.dat_estructura de union
                 select eo.idestructuraop,eo.idconcepto, eo.idorgano
                 from mod_estructuracomp.dat_estructuraop  eo ) p
                 on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)
                    left join mod_estructuracomp.nom_organo norgpadre
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto)
                    where h.idfila = esta.idpadre) as denominacionentidadpadre,
                    esta.idfila,norg.denominacion as denominacionentidad,
                     edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                     coalesce(enm.enmarcamiento,0) as enmarcamientoplan,
                     coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
                     enm.identidaddatosnomencladorcb,edcb.identidad as identidadcb,
                     (select norgpadre.denominacion as denorgano
                    from mod_estructuracomp.nom_filaestruc h
                    left join (select de.idestructura,de.idconcepto, de.idorgano
                    from mod_estructuracomp.dat_estructura de union
                    select eo.idestructuraop , eo.idconcepto, eo.idorgano from
                    mod_estructuracomp.dat_estructuraop  eo ) p
                    on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)

                    left join mod_estructuracomp.nom_organo norgpadre
                    ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto)
                    where h.idfila = edcb.identidad) as denominacioncb,

                    coalesce( (select sum(p.importe) as enmarcamientoreal
                    from mod_planificacion.dat_planificacion p
                    inner join mod_planificacion.dat_entidadmodelo em
                    on (em.identidadmodelo = p.identidadmodelo) where em.identidad = esta.idfila
                    and p.idcentrobalance =  enm.identidaddatosnomencladorcb and p.idejercicio = enm.idejercicio
                    ),0) as enmarcamientoreal,nvia.denominacion as denominacionvia,
                    enmvia.enmarcamientovia as enmarcamientoplanv,coalesce( (select sum(p.importe)
                            from mod_planificacion.dat_planificacion p
                            inner join mod_datosmaestros.dat_indicadorviaadquisicion indv
                             on (indv.idindicador= p.idindicador)
                            inner join mod_planificacion.dat_entidadmodelo em
                            on (em.identidadmodelo = p.identidadmodelo)
                        where em.identidad = esta.idfila
                        and p.idcentrobalance = enm.identidaddatosnomencladorcb
                            and indv.idviaadquisicion = nvia.idviaadquisicion
                            and p.idejercicio = enm.idejercicio),0)::numeric(19,3) as enmarcamientorealv
                    from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
                    from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
                    where h.lft BETWEEN p.lft and p.rgt and p.idpadre = ? order by h.lft) esta
                    left join (select de.idestructura , de.idconcepto, de.idorgano
                    from mod_estructuracomp.dat_estructura de union
                    select eo.idestructuraop , eo.idconcepto, eo.idorgano from
                    mod_estructuracomp.dat_estructuraop  eo ) o
                    on (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto)

                        left join mod_estructuracomp.nom_organo norg
                        ON( norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto        )

                        left join mod_planificacion.dat_entidaddatosnomenclador edod
                        on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
                        inner join  mod_planificacion.dat_enmarcamiento enm
                        ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
                        and enm.idejercicio = ?) --Parametro (ejercicio seleccionado)
                        inner join mod_planificacion.dat_entidaddatosnomenclador edcb
                        on ( edcb.identidaddatosnomenclador = enm.identidaddatosnomencladorcb)
                        inner join mod_planificacion.dat_enmarcamientoviaa  enmvia
                        on (enmvia.idenmarcamiento = enm.idenmarcamiento)
                        inner join mod_datosmaestros.nom_viaadquisicion nvia
                        on (nvia.idviaadquisicion = enmvia.idviaadquisicion)
                    $addWherecon) as res $addWhere $groupby $having
                    order by res.lft,res.rgt,res.identidaddatosnomencladorcb,
                    res.denominacionvia OFFSET ? LIMIT ?";
        $res = $conn->execute(
                $query, array($params['idestructura'], $params['idejercicio'],
            $params['start'], $params['limit'])
        );

        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $groupbyUno = self::groupbyTres();
        $queryAux = "select res.* ,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia,
(res.enmarcamientoplanv - res.enmarcamientorealv)as diferenciav from(select
esta.lft,esta.rgt,esta.idpadre,(select norgpadre.denominacion as denorgano
from mod_estructuracomp.nom_filaestruc h
left join (select de.idestructura , de.idconcepto, de.idorgano
from mod_estructuracomp.dat_estructura de union
select eo.idestructuraop , eo.idconcepto, eo.idorgano
from mod_estructuracomp.dat_estructuraop  eo ) p
on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)

left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto )
where h.idfila = esta.idpadre) as denominacionentidadpadre,
esta.idfila, norg.denominacion as denominacionentidad,
 edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(enm.enmarcamiento,0) as enmarcamientoplan,
 coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible,
 enm.identidaddatosnomencladorcb, edcb.identidad as identidadcb,
 (select norgpadre.denominacion as denorgano
from mod_estructuracomp.nom_filaestruc h
left join (select de.idestructura , de.idconcepto, de.idorgano
from mod_estructuracomp.dat_estructura de union
select eo.idestructuraop , eo.idconcepto, eo.idorgano
from  mod_estructuracomp.dat_estructuraop  eo ) p
on (p.idestructura = h.idfila and h.idconcepto = p.idconcepto)

left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idconcepto = p.idconcepto)
where h.idfila = edcb.identidad) as denominacioncb ,

coalesce( (select sum(p.importe) as enmarcamientoreal
        from mod_planificacion.dat_planificacion p
        inner join mod_planificacion.dat_entidadmodelo em
        on (em.identidadmodelo = p.identidadmodelo)
        where em.identidad = esta.idfila
        and p.idcentrobalance =  enm.identidaddatosnomencladorcb
        and p.idejercicio = enm.idejercicio),0) as enmarcamientoreal,
    nvia.denominacion as denominacionvia,enmvia.enmarcamientovia as enmarcamientoplanv,
    coalesce( (select sum(p.importe) from mod_planificacion.dat_planificacion p
	inner join mod_datosmaestros.dat_indicadorviaadquisicion indv
	on (indv.idindicador= p.idindicador)
	inner join mod_planificacion.dat_entidadmodelo em
	on (em.identidadmodelo = p.identidadmodelo) where em.identidad = esta.idfila
    and p.idcentrobalance = enm.identidaddatosnomencladorcb
	and indv.idviaadquisicion = nvia.idviaadquisicion
	and p.idejercicio = enm.idejercicio),0)::numeric(19,3) as enmarcamientorealv
from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idconcepto
from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
where h.lft BETWEEN p.lft and p.rgt and p.idpadre = ? order by h.lft) esta
left join (select de.idestructura , de.idconcepto, de.idorgano
from mod_estructuracomp.dat_estructura de union select eo.idestructuraop,
eo.idconcepto, eo.idorgano from mod_estructuracomp.dat_estructuraop  eo ) o
on (o.idestructura = esta.idfila and esta.idconcepto = o.idconcepto)
    left join mod_estructuracomp.nom_organo norg
    ON( norg.idorgano = o.idorgano AND norg.idconcepto = o.idconcepto)
    
    left join mod_planificacion.dat_entidaddatosnomenclador edod
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamiento enm
    ON (edod.identidaddatosnomenclador = enm.identidaddatosnomencladorod
    and enm.idejercicio = ?) inner join mod_planificacion.dat_entidaddatosnomenclador edcb
    on ( edcb.identidaddatosnomenclador = enm.identidaddatosnomencladorcb)
    inner join mod_planificacion.dat_enmarcamientoviaa  enmvia
    on (enmvia.idenmarcamiento = enm.idenmarcamiento)
    inner join mod_datosmaestros.nom_viaadquisicion nvia
    on (nvia.idviaadquisicion = enmvia.idviaadquisicion) $addWherecon) as res $addWhere
    $groupbyUno $having order by res.lft,res.rgt,res.identidaddatosnomencladorcb,
res.denominacionvia";
        $resAux = $conn->execute(
                $queryAux, array($params['idestructura'], $params['idejercicio'])
        );

        $total = $resAux->fetchAll(PDO::FETCH_ASSOC);

        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $totalplan = 0;
        $totalreal = 0;
        $totaldiferencia = 0;
        $totalplanv = 0;
        $totalrealv = 0;
        $totaldiferenciav = 0;
        $entidadpadre = -1;
        $entidad = -1;
        $cb = -1;
        foreach ($total as $value) {
            if ($value['idpadre'] == $identrectora[0]['identidad']) {
                if ($entidadpadre != $value['idpadre'] || $entidad != $value['idfila'] || $cb != $value['identidaddatosnomencladorcb']
                ) {
                    $totalplan += $value['enmarcamientoplan'];
                    $totalreal += $value['enmarcamientoreal'];
                    $totaldiferencia += $value['diferencia'];
                }
                $totalplanv += $value['enmarcamientoplanv'];
                $totalrealv += $value['enmarcamientorealv'];
                $totaldiferenciav += $value['diferenciav'];
            }
            $entidadpadre = $value['idpadre'];
            $entidad = $value['idfila'];
            $cb = $value['identidaddatosnomencladorcb'];
        }
        return array('total' => count($total),
            'totalplan' => number_format($totalplan, 3),
            'totalplanv' => number_format($totalplanv, 3),
            'totaldiferencia' => number_format($totaldiferencia, 3),
            'totaldiferenciav' => number_format($totaldiferenciav, 3),
            'totalreal' => number_format($totalreal, 3),
            'totalrealv' => number_format($totalrealv, 3),
            'data' => $result);
    }

    public function groupbyTres() {
        $consulta = " group by res.lft,res.rgt,res.denominacionentidadpadre,
                    res.idfila,denominacionentidad,res.identidaddatosnomencladorod,
                    res.enmarcamientoplan,res.enmarcamientodisponible,
                    res.identidaddatosnomencladorcb,res.identidadcb,
                    res.denominacioncb,res.enmarcamientoreal,res.denominacionvia,
                    res.enmarcamientoplanv,res.enmarcamientorealv,res.idpadre";
        return $consulta;
    }

    public function getEntidadDadoComportamiento($idcomportamiento) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT distinct d.identidad
                    FROM mod_planificacion.dat_entidaddatosnomenclador d
                    INNER JOIN mod_planificacion.dat_enmarcamientocb  cb
                    ON d.identidaddatosnomenclador = cb.identidaddatosnomencladorcb 
                    WHERE d.iddatosnomenclador = ?";
        $data = $conn->execute($query, array($idcomportamiento))
                ->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}
