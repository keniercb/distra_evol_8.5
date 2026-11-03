<?php
class DatEnmarcamientoviaa extends BaseDatEnmarcamientoviaa
{

    public function setUp()
    {
        parent::setUp();
    }

    public function select()
    {
        $consulta = "SELECT
                          v.idviaadquisicion,
						v.denominacion as denominacionviaadquisicion,
                         round(coalesce(enmv.enmarcamientovia,0),3) as enmarcamiento,
                         round(coalesce(enmv.enmarcamientodisponiblevia,0),3) as enmarcamientodisponible";
        return $consulta;
    }

    public function getViaAdq($params, $identpadreod, $limite)
    {
        $identod = DatEntidaddatosnomenclador::getEntDatNom(
            $params['identidad']
        );
        $identod = $identod[0]['identidaddatosnomenclador'];
        if (!$identpadreod) {
            $identpadreod = null;
        }
        $addWhere = "WHERE true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionviaadquisicion') {
                    $addWhere .= " AND upper(v.denominacion) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamientovia,0)  >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamientovia,0)  <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enmv.enmarcamientovia,0)  ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponiblevia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamientodisponiblevia,0) >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND coalesce(enmv.enmarcamientodisponiblevia,0) <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND coalesce(enmv.enmarcamientodisponiblevia,0) ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $select = self::select();
        $query
            = "$select,coalesce((select sum (p.enmarcamientodisponiblevia)
                       from mod_planificacion.dat_enmarcamientoviaa p
                       where p.idviaadquisicion = v.idviaadquisicion
                       and p.idenmarcamiento =  (select ep.idenmarcamientopadre from
    				   mod_planificacion.dat_enmarcamiento ep where ep.idenmarcamiento = ?
                       and ep.idenmarcamiento <> ep.idenmarcamientopadre)),0) as enmarcamientodisponiblepadre,
                       coalesce( (select sum(je.enmarcamientovia) from mod_planificacion.dat_enmarcamientoviaa je
                       where je.idenmarcamiento = ? ),0) as sumatotal from
    mod_planificacion.dat_enmarcamiento e inner join mod_planificacion.dat_enmarcamientoviaa enmv ON
    (e.idenmarcamiento = enmv.idenmarcamiento and enmv.idenmarcamiento = ?)
    right join mod_datosmaestros.nom_viaadquisicion v on
    (v.idviaadquisicion = enmv.idviaadquisicion) $addWhere  ORDER BY v.idviaadquisicion
     OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query,
            array($params['idenmarcamiento'], $params['idenmarcamiento'],
                  $params['idenmarcamiento'], $params['start'],
                  $params['limit'])
        );
        $result = $res->fetchAll();

        $queryenmmarc
            = "$select,coalesce((select sum (p.enmarcamientodisponiblevia)
               from mod_planificacion.dat_enmarcamientoviaa p
               where p.idviaadquisicion = v.idviaadquisicion
               and p.idenmarcamiento =  (select ep.idenmarcamientopadre from
    		   mod_planificacion.dat_enmarcamiento ep where ep.idenmarcamiento = ?
               and ep.idenmarcamiento <> ep.idenmarcamientopadre)),0) as enmarcamientodisponiblepadre
	from mod_planificacion.dat_enmarcamiento e
    inner join mod_planificacion.dat_enmarcamientoviaa enmv ON
    (e.idenmarcamiento = enmv.idenmarcamiento and enmv.idenmarcamiento = ?)
    right join mod_datosmaestros.nom_viaadquisicion v on
    (v.idviaadquisicion = enmv.idviaadquisicion) $addWhere ORDER BY v.idviaadquisicion  ";
        $resenm = $conn->execute(
            $queryenmmarc,
            array($params['idenmarcamiento'], $params['idenmarcamiento'])
        );
        $total = $resenm->fetchAll();
        $totalplan = 0;
        foreach ($total as$value) {
            $totalplan += $value['enmarcamiento'];
        }
        if ($limite == true) {
            return array('total'              => count($total),
                         'totalenmarcamiento' => number_format($totalplan, 3),
                         'data'               => $result);
        } else {
            return array('total'              => count($total),
                         'totalenmarcamiento' => number_format($totalplan, 3),
                         'data'               => $total);
        }
    }

    public function getViaAdqConsolidado($params, $limite)
    {

        $addWhere = "WHERE true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacionviaadquisicion') {
                    $addWhere .= " AND upper(s.denominacionviaadquisicion) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamiento') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND s.enmarcamiento >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND s.enmarcamiento  <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND s.enmarcamiento  ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientodisponiblevia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND s.enmarcamientodisponiblevia >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND s.enmarcamientodisponiblevia <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND s.enmarcamientodisponiblevia ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }


        if ($params['identidaddatosnomencladorcb'] == "") {
            $wher = "e.identidaddatosnomencladorod = "
                . $params['identidaddatosnomencladorod'] . "";
        } else {

            $wher = "e.identidaddatosnomencladorcb = "
                . $params['identidaddatosnomencladorcb'] . "";
        }

        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT s.* from (SELECT v.idviaadquisicion,v.denominacion as denominacionviaadquisicion,
              round(sum( coalesce(enmv.enmarcamientovia,0)),3) as enmarcamiento,
              round(sum (coalesce(enmv.enmarcamientodisponiblevia,0)),3) as enmarcamientodisponible,
              0 as enmarcamientodisponiblepadre FROM mod_datosmaestros.nom_viaadquisicion v
              left JOIN mod_planificacion.dat_enmarcamientoviaa enmv ON
              (v.idviaadquisicion = enmv.idviaadquisicion
              and enmv.idenmarcamiento in (select e.idenmarcamiento from mod_planificacion.dat_enmarcamiento e
              where " .$wher . " and e.idejercicio = " . $params['idejercicio'] . ") )
              group by v.idviaadquisicion,v.denominacion) as s $addWhere
			  ORDER BY s.idviaadquisicion OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query, array($params['start'], $params['limit'])
        );
        $result = $res->fetchAll();
        $queryvia
            = "SELECT s.* from (SELECT v.idviaadquisicion,v.denominacion as denominacionviaadquisicion,
               round(sum( coalesce(enmv.enmarcamientovia,0)),3) as enmarcamiento,
               round(sum (coalesce(enmv.enmarcamientodisponiblevia,0)),3) as enmarcamientodisponible,
               0 as enmarcamientodisponiblepadre FROM mod_datosmaestros.nom_viaadquisicion v
               left JOIN mod_planificacion.dat_enmarcamientoviaa enmv ON
               (v.idviaadquisicion = enmv.idviaadquisicion and enmv.idenmarcamiento
               in (select e.idenmarcamiento from mod_planificacion.dat_enmarcamiento e
               where " . $wher . " and e.idejercicio = " . $params['idejercicio'] . ") )
               group by v.idviaadquisicion,v.denominacion) as s $addWhere
			  ORDER BY s.idviaadquisicion";
        $resvia = $conn->execute($queryvia);
        $total = $resvia->fetchAll();
        $totalplan = 0;
        foreach ($total as $value) {
            $totalplan += $value['enmarcamiento'];
        }
        if ($limite == true) {
            return array('total'              => count($total),
                         'totalenmarcamiento' => number_format($totalplan, 3),
                         'data'               => $result);
        } else {
            return array('total'              => count($total),
                         'totalenmarcamiento' => number_format($totalplan, 3),
                         'data'               => $total);
        }
    }

    public function selectUno()
    {
        $consulta = "select esta.idfila,case when esta.idfila = esta.idpadre then null
                        when esta.idfila <> esta.idpadre then esta.idpadre
                        end as _parent,esta.lft as _lft,esta.rgt as _rgt,
                        ((esta.rgt-esta.lft) = 1) as _is_leaf,norg.denorgano,
                         edod.identidaddatosnomenclador as identidaddatosnomencladorod,
                         coalesce(enm.enmarcamiento,0) as enmarcamiento,
                         coalesce(enm.enmarcamientodisponible,0) as enmarcamientodisponible";
        return $consulta;
    }
    public function getCBTG($params, $identcb)
    {
        $conn = Doctrine_Manager::connection();
        $select = self::selectUno();
        $query
            = "$select,coalesce((select e.enmarcamientodisponible from
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
        $queryestruct
            = "select Count(esta.idfila) from (select distinct  h.idfila,h.idpadre,
h.lft,h.rgt,h.idnomeav from mod_estructuracomp.nom_filaestruc h where h.idpadre = ?
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
        $resestruct = $conn->execute(
            $queryestruct, array($params['idpadre'], $identcb,
                           $params['idejercicio'])
        );
        $result->total = $resestruct->fetchAll();
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

    public function actualizarVias($idenmarcamiento, $idvia, $enmarcamiento)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "UPDATE mod_planificacion.dat_enmarcamientoviaa SET enmarcamientovia = "
            . $enmarcamiento . "
            WHERE mod_planificacion.dat_enmarcamientoviaa.idenmarcamiento = "
            . $idenmarcamiento . "
            AND mod_planificacion.dat_enmarcamientoviaa.idviaadquisicion = "
            . $idvia . "";
        $res = $conn->execute($sql);
        return $res;
    }

    public function eliminarVias($idenmarcamiento, $idvia)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "DELETE FROM mod_planificacion.dat_enmarcamientoviaa
                WHERE mod_planificacion.dat_enmarcamientoviaa.idenmarcamiento = "
            . $idenmarcamiento . "
                AND mod_planificacion.dat_enmarcamientoviaa.idviaadquisicion = "
            . $idvia . "";
        $res = $conn->execute($sql);
        return $res;
    }

    public function verificarEnmarcamientoVia($params)
    {
        $identodpadre = DatEntidaddatosnomenclador::getEntDatNom(
            $params['identidadpadre']
        );
        if (count($identodpadre) == 0) {
            if ($params['enmarcamientocb'] >= $params['suma']) {
                return '24';
            } else {
                return '20';
            }
        } else {
            $entidadrectora = DatEntidaddatosnomenclador::getEntDatNom(
                $params['entidadrectora']
            );
            if ($identodpadre[0]['identidaddatosnomenclador']
                !== $entidadrectora[0]['identidaddatosnomenclador']
            ) {
                if (($params['enmarcamientomodificado']
                        <= ($params['enmarcamiento']
                            + $params['disponiblepadre'])
                        || $params['enmarcamientomodificado']
                        <= $params['enmarcamiento'])
                    && $params['enmarcamientocb'] >= $params['suma']
                ) {
                    return '24';
                } else {
                    return '20';
                }
            } else {
                if ($params['enmarcamientocb'] >= $params['suma']) {
                    return '24';
                } else {
                    return '20';
                }
            }
        }
    }

    public function groupby()
    {
        $consulta = "group by res.lft,res.rgt,res.idpadre,res.denominacionentidadpadre,
 res.idfila,res.denominacionentidad,res.identidaddatosnomencladorod,res.enmarcamientoplan,
 res.enmarcamientodisponible,res.idviaadquisicion,res.denominacionviaadquisicion,
 res.enmarcamientoreal";
        return $consulta;
    }

    public function getReporteViaAdq($params)
    {

        $addWhere = "WHERE true";
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
                if ($datos['field'] == 'denominacionviaadquisicion') {
                    $addWhere .= " AND upper(res.denominacionviaadquisicion) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos ['field'] == 'enmarcamientoplan') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND coalesce(res.enmarcamientoplan,0)  >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamientoplan < "
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamientoplan  ="
                            . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'enmarcamientoreal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= " AND res.enmarcamientoreal  >"
                            . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= " AND res.enmarcamientoreal  <"
                            . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= " AND res.enmarcamientoreal  ="
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
        $group = self::groupby();
        $query
            = "select res.* ,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia
from (select esta.lft,esta.rgt, esta.idpadre,(select norgpadre.denorgano
from mod_estructuracomp.nom_filaestruc h left join (select de.idestructura,
de.idnomeav, de.idorgano from mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) p on (p.idestructura = h.idfila
and h.idnomeav = p.idnomeav) left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = esta.idpadre) as denominacionentidadpadre,esta.idfila,
 norg.denorgano as denominacionentidad,
 edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(eviaa.enmarcamiento,0) as enmarcamientoplan,
 coalesce(eviaa.enmarcamientodisponible,0) as enmarcamientodisponible,
 eviaa.idviaadquisicion,nv.denominacion as denominacionviaadquisicion,
coalesce( (select sum(p.importe) as enmarcamientoreal
	from mod_planificacion.dat_planificacion p
	inner join mod_planificacion.dat_indicadorviaadquisicion indv on (indv.idindicador= p.idindicador)
	inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = p.identidadmodelo)
    where em.identidad = edod.identidad
	and indv.idviaadquisicion = eviaa.idviaadquisicion
	and p.idejercicio = eviaa.idejercicio),0)::numeric(19,6) as enmarcamientoreal
from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
from mod_estructuracomp.nom_filaestruc p, mod_estructuracomp.nom_filaestruc h
where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
left join (select de.idestructura , de.idnomeav, de.idorgano from
mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from
mod_estructuracomp.dat_estructuraop  eo ) o
on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
left join mod_estructuracomp.nom_organo norg
ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)
    left join mod_planificacion.dat_entidaddatosnomenclador edod
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamientoviaadquisicion eviaa 
    ON (edod.identidaddatosnomenclador = eviaa.identidaddatosnomencladorod
    and eviaa.idejercicio = ?) inner join mod_datosmaestros.nom_viaadquisicion nv
    on ( nv.idviaadquisicion = eviaa.idviaadquisicion))res 
$addWhere $group $having order by res.lft,res.rgt,res.idviaadquisicion OFFSET ? LIMIT ?";
        $res = $conn->execute(
            $query,
            array($params['idejercicio'], $params['start'], $params['limit'])
        );
        $result = $res->fetchAll();

        $queryfila
            = "select res.* ,(res.enmarcamientoplan - res.enmarcamientoreal)as diferencia
from (select esta.lft,esta.rgt,esta.idpadre,(select norgpadre.denorgano
from mod_estructuracomp.nom_filaestruc h left join (select de.idestructura,
de.idnomeav,de.idorgano from mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from mod_estructuracomp.dat_estructuraop  eo) p
on (p.idestructura = h.idfila and h.idnomeav = p.idnomeav) left join mod_estructuracomp.nom_organo norgpadre
ON( norgpadre.idorgano = p.idorgano AND norgpadre.idnomeav = p.idnomeav)
where h.idfila = esta.idpadre) as denominacionentidadpadre,esta.idfila,norg.denorgano as denominacionentidad,
 edod.identidaddatosnomenclador as identidaddatosnomencladorod,
 coalesce(eviaa.enmarcamiento,0) as enmarcamientoplan,
 coalesce(eviaa.enmarcamientodisponible,0) as enmarcamientodisponible,
 eviaa.idviaadquisicion,nv.denominacion as denominacionviaadquisicion,
coalesce( (select sum(p.importe) as enmarcamientoreal
	from mod_planificacion.dat_planificacion p
	inner join mod_planificacion.dat_indicadorviaadquisicion indv
	on (indv.idindicador= p.idindicador)
	inner join mod_planificacion.dat_entidadmodelo em
	on (em.identidadmodelo = p.identidadmodelo) where
	em.identidad = edod.identidad and indv.idviaadquisicion = eviaa.idviaadquisicion
	and p.idejercicio = eviaa.idejercicio),0)::numeric(19,6) as enmarcamientoreal
from(select distinct  h.idfila,h.idpadre,h.lft,h.rgt,h.idnomeav
from mod_estructuracomp.nom_filaestruc p,mod_estructuracomp.nom_filaestruc h
where h.lft BETWEEN p.lft and p.rgt order by h.lft) esta
left join (select de.idestructura , de.idnomeav, de.idorgano
from mod_estructuracomp.dat_estructura de union
select eo.idestructura , eo.idnomeav, eo.idorgano from mod_estructuracomp.dat_estructuraop  eo) o
on (o.idestructura = esta.idfila and esta.idnomeav = o.idnomeav)
    left join mod_estructuracomp.nom_organo norg 
    ON( norg.idorgano = o.idorgano AND norg.idnomeav = o.idnomeav)    
    left join mod_planificacion.dat_entidaddatosnomenclador edod 
    on ( edod.identidad = esta.idfila and edod.iddatosnomenclador = 2)
    inner join  mod_planificacion.dat_enmarcamientoviaadquisicion eviaa 
    ON (edod.identidaddatosnomenclador = eviaa.identidaddatosnomencladorod
    and eviaa.idejercicio = ?) inner join mod_datosmaestros.nom_viaadquisicion nv
    on ( nv.idviaadquisicion = eviaa.idviaadquisicion))res
$addWhere $group $having order by res.lft,res.rgt,res.idviaadquisicion";
        $resfila = $conn->execute($queryfila, array($params['idejercicio']));
        $total = $resfila->fetchAll();
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $totalplan = 0;
        $totalreal = 0;
        $totaldiferencia = 0;
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