<?php

//require_once __DIR__ . '/../../planmeta/models/bussines/DatBasescalculoModel.php';

class DatBasescalculoproduccionesModel extends DatBasescalculoModel {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function generarBaseDeCalculoDeUnaEntidad($arrayParaleloentesp, $idtipocalc, $idejercicio) {

        $strarrayentidades = "";
        $strarrayespecialidades = "";
        foreach ($arrayParaleloentesp['identidad'] as $key => $value) {
            if ($value)
                if ($strarrayentidades == "") {
                    $strarrayentidades = $arrayParaleloentesp['identidad'][$key];
                    $strarrayespecialidades = $arrayParaleloentesp['idespecialidad'][$key];
                } else {
                    $strarrayentidades = $strarrayentidades . ',' . $arrayParaleloentesp['identidad'][$key];
                    $strarrayespecialidades = $strarrayespecialidades . ',' . $arrayParaleloentesp['idespecialidad'][$key];
                }
        }

        //$strarrayentidades = implode(',', $arrayParaleloentesp['identidad']);
        $strarrayentidades = "{" . $strarrayentidades . "}";
        //$strarrayespecialidades = implode(',', $arrayParaleloentesp['idespecialidad']);
        $strarrayespecialidades = "{" . $strarrayespecialidades . "}";

        $arrayParametros = array();
        $conn = Doctrine_Manager::connection();
        if ($idtipocalc == 1) {
            $arrayParametros[0] = $strarrayentidades;
            $arrayParametros[1] = $idejercicio;
            $arrayParametros[2] = $strarrayespecialidades;
            $query = "select * from mod_spouam.f_basedeplan10(?,?,?)";
        } else {
            $arrayParametros[0] = $strarrayentidades;
            $arrayParametros[1] = $idejercicio;
            $arrayParametros[2] = $strarrayespecialidades;
            $query = "select * from mod_spouam.f_basedeplansalidasinmodelo(?,?,?)";
        }
        $res = $conn->execute($query, $arrayParametros);
        $resultUno = $res->fetchAll();
        if ($idtipocalc == 1) {
            $query = "select * from mod_spouam.f_basedeplan11(?,?,?)";
        } else {
            $query = "select * from mod_spouam.f_basedeplansalidaconmodelo(?,?,?)";
        }
        $res = $conn->execute($query, $arrayParametros);
        $resultDos = $res->fetchAll();
        if ($idtipocalc == 1) {
            return ($resultUno[0]['f_basedeplan10'] || $resultDos[0]['f_basedeplan11']);
        } else {
            return ($resultUno[0]['f_basedeplansalidasinmodelo'] || $resultDos[0]['f_basedeplansalidaconmodelo']);
        }
    }

    public function exportarCalculoAExcel($params) {
        $conn = Doctrine_Manager::connection();
        $params['entidades'] = implode(',', $params['entidades']);
        $params['idactividad'] = implode(',', $params['idactividad']);
        $sql = "SELECT distinct alias.indicador,
                                    alias.denominacion,
                                    alias.precio,
                                    alias.preciodivisa,
                                    alias.codigo,
                                    alias.um,
                                    alias.abrevum,
                                    alias.denominacionmod,
                                    round(SUM(alias.cant *((alias.nivelprod + alias.nivelauto +
                                      alias.nivelmanual + alias.nivelactividadct + alias.ajuste))), 6) as
                                      necesidadredondeada,
                                    round(SUM(alias.cant *((alias.nivelprod + alias.nivelauto +
                                      alias.nivelmanual + alias.nivelactividadct + alias.ajuste))) *
                                      alias.precio, 6) as importe,
                                    round(SUM(((alias.nivelprod + alias.nivelauto + alias.nivelmanual +
                                      alias.nivelactividadct + alias.ajuste))), 6) as nivelactividad,
                                    alias.denomactividad,
                                    alias.codactividad
                  FROM (SELECT
                          i.idindicador AS indicador,
                          i.codigo AS codigo,
                          i.denominacion as denominacion,
                          ip.precio AS precio,
                          ip.preciodivisa as preciodivisa,
                          a.idactividad AS actividad,
                          COALESCE(nivp.nivelactividadproduccion,0) AS nivelprod,
                          COALESCE(niva.nivelactividadautomatico,0) AS nivelauto,
                          COALESCE(nivm.nivelactividadmanual,0) AS nivelmanual,
                          COALESCE(SUM(aect.nivelactividadproduccion), 0) AS nivelactividadct,
                          nor.cantplanif*nor.cantbase AS cant,
                          i.idumedida as um,
                          um.abreviaturaunidadmedida as abrevum,
                          mod.denominacion as denominacionmod,
                          aen.ajuste,
                          a.denominacion as denomactividad,
                          a.codigo as codactividad,
                          nivm.nivelactividadmanual
                        FROM
                          mod_planificacion.nom_actividad a
                          INNER JOIN mod_planificacion.dat_actividadentidad aen ON (a.idactividad = aen.idactividad)
                          LEFT OUTER JOIN mod_planificacion.dat_actividadmodelo amod ON (amod.idactividad = aen.idactividad)
                          LEFT OUTER JOIN mod_planificacion.dat_modelo mod ON (amod.idmodelo  = mod.idmodelo )
                          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico niva ON (aen.idactividadentidad = niva.idactividadentidad)
                          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual nivm ON (aen.idactividadentidad = nivm.idactividadentidad)
                          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion nivp ON (aen.idactividadentidad = nivp.idactividadentidad)
                            LEFT JOIN mod_spouam.dat_actividadentidadprodcartatec aect ON (aect.idactividadentidad = aen.idactividadentidad)
                          INNER JOIN mod_planificacion.dat_norma nor ON (a.idactividad = nor.idactividad)
                          INNER JOIN mod_datosmaestros.nom_indicador i ON (nor.idindicador = i.idindicador)
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador)
                         LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
                        WHERE
                          aen.identidad in ({$params['entidades']}) AND
                          a.estado = 1 AND
                          i.estado = 1 AND
                          ip.nivelplanif = 1 AND
                          a.idactividad in({$params['idactividad']})
                          AND aen.idejercicio = {$params['idejercicio']}  AND
                          nor.idejercicio =  {$params['idejercicio']}
                          GROUP BY i.idindicador,
                                            i.codigo,
                                            i.denominacion,
                                            ip.precio,
                                            ip.preciodivisa,
                                            a.idactividad,
                                            nivp.nivelactividadproduccion,
                                            niva.nivelactividadautomatico,
                                            nivm.nivelactividadmanual,
                                            i.idumedida,
                                            um.abreviaturaunidadmedida,
                                            mod.denominacion,
                                            aen.ajuste,
                                            a.denominacion,
                                            a.codigo,
                                            nivm.nivelactividadmanual,
                                            nor.cantplanif,
                                            nor.cantbase
                          ) as alias

                        GROUP BY
                         alias.indicador,
                         alias.denominacionmod,
                         alias. precio,
                         alias.codigo,
                         alias.denominacion,
                         alias.preciodivisa,
                         alias.denominacion,
                         alias.um,
                         alias.abrevum,
                         alias.abrevum,
                         alias.denomactividad,
                         alias.codactividad
                         ORDER BY alias.codactividad ";
        $temp = $conn->execute($sql);
        $data->data = $temp->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
