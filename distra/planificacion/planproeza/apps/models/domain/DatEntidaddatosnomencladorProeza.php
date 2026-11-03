<?php

class DatEntidaddatosnomencladorProeza extends DatEntidaddatosnomenclador {

    public function setUp() {
        parent::setUp();
    }

    public function listarComportamiento($parametros, $idsentidades) {
        $addHaving = "";
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'identidad') {
                    $idsentidades = $datos['data']['value'];
                } elseif ($datos['field'] == 'od') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.od) = 1";
                    else
                        $addHaving .= " AND sum(c.od) = 0";
                }elseif ($datos['field'] == 'cb') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.cb) = 1";
                    else
                        $addHaving .= " AND sum(c.cb) = 0";
                }elseif ($datos['field'] == 'ejecutor') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.ejecutor) = 1";
                    else
                        $addHaving .= " AND sum(c.ejecutor) = 0";
                }elseif ($datos['field'] == 'rector') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.rectorbalance) = 1";
                    else
                        $addHaving .= " AND sum(c.rectorbalance) = 0";
                }elseif ($datos['field'] == 'organoempresarial') {
                    if ($datos['data']['value'] == 'Sí')
                        $addHaving .= "AND sum(c.organoempresarial) = 1";
                    else
                        $addHaving .= " AND sum(c.organoempresarial) = 0";
                }
            }
        }
        $delimitando = "";
        if ($parametros['start'] != null && $parametros['limit']) {
            $delimitando = " LIMIT {$parametros['limit']} OFFSET {$parametros['start']} ";
        }
        $conn = Doctrine_Manager::connection();
        $query = "WITH comportamiento AS ( 
            SELECT f.idfila as identidad,
                    case when dn.uridatosnomenclador = 'organoconsumidor' then 1 
                        else 0 end as od,
                    case when dn.uridatosnomenclador = 'Centrodebalance' then 1
                        else 0 end as cb,
                    case when dn.uridatosnomenclador = 'ejecutor' then 1
                        else 0 end as ejecutor,
                    case when dn.uridatosnomenclador = 'rectorbalance' then 1
                        else 0 end as rectorbalance,
                    case when dn.uridatosnomenclador = 'organoempresarial' then 1
                        else 0 end as organoempresarial
            FROM mod_estructuracomp.nom_filaestruc f
                 LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador edn 
                 ON (f.idfila = edn.identidad)
                 LEFT JOIN mod_planificacion.nom_datosnomenclador dn 
                 ON edn.iddatosnomenclador = dn.iddatosnomenclador
            where f.idfila IN ($idsentidades))
       SELECT c.identidad,
              CASE WHEN sum(c.od) = 1 THEN TRUE ELSE FALSE END AS od,
              CASE WHEN sum(c.cb) = 1 THEN TRUE ELSE FALSE END AS cb,
              CASE WHEN sum(c.ejecutor) = 1 THEN TRUE ELSE FALSE END AS ejecutor,
              CASE WHEN sum(c.rectorbalance) = 1 THEN TRUE ELSE FALSE END AS rector,
              CASE WHEN sum(c.organoempresarial) = 1 THEN TRUE ELSE FALSE END AS organoempresarial,
              COUNT(*) OVER() AS total
       FROM comportamiento c                           
       GROUP BY c.identidad                           
       HAVING true $addHaving
       ORDER BY c.identidad $delimitando";
//        print_r($query);die;
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

}
