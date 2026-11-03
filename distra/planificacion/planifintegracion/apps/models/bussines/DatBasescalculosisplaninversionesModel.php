<?php

class DatBasescalculosisplaninversionesModel extends DatBasescalculoModel
{

    public function exportarCalculoAExcelTotal($params)
    {

        $conn = Doctrine_Manager::connection();

        $params['entidades'] = implode(',', $params['entidades']);
        $params['idactividad'] = implode(',', $params['idactividad']);

        $sqltotal = "SELECT count (distinct alias.indicador)
                    FROM (SELECT i.idindicador AS indicador
                    FROM mod_planificacion.nom_actividad a
                    INNER JOIN mod_planificacion.dat_actividadentidad aen ON (a.idactividad = aen.idactividad)                    
                    INNER JOIN mod_planificacion.dat_norma nor ON (a.idactividad = nor.idactividad)
                    INNER JOIN mod_datosmaestros.nom_indicador i ON (nor.idindicador = i.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador)
                    LEFT OUTER JOIN mod_planificacion.dat_indicadormodelo im ON (i.idindicador = im.idindicador)
                    LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
                    WHERE aen.identidad in ({$params['entidades']}) AND
                    a.estado = 1 AND i.estado = 1 AND
                    ip.nivelplanif = 1 AND a.idactividad in({$params['idactividad']})
                    AND aen.idejercicio = {$params['idejercicio']}  AND
                    nor.idejercicio =  {$params['idejercicio']}
                   ) as alias";
        $temp = $conn->execute($sqltotal);
        $data->total = $temp->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total[0]['count'];
        return $data;
    }

    public function exportarCalculoAExcel($params)
    {

        $conn = Doctrine_Manager::connection();

        $params['entidades'] = implode(',', $params['entidades']);
        $params['idactividad'] = implode(',', $params['idactividad']);

        $sql = "SELECT
                distinct alias.indicador,
                alias.denominacion,
                alias.precio,
                alias.preciodivisa,
                alias.codigo,
                alias.entidad,
                alias.um,
                alias.abrevum,    
                alias.denominacionmod,
                round( SUM( alias.cant *  ((alias.nivelprod+alias.nivelauto+alias.nivelmanual+alias.nivelinversion+alias.nivelproyecto)) ) ,6) as  necesidadredondeada,
                round( SUM( alias.cant *  ((alias.nivelprod+alias.nivelauto+alias.nivelmanual+alias.nivelinversion+alias.nivelproyecto)) ) * alias.precio,6)  as  importe
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
          COALESCE(aee.nivelactividadelemento,0) AS nivelproyecto,
          nor.cantplanif*nor.cantbase AS cant,
          aen.identidad as entidad,
          i.idumedida as um,
          um.abreviaturaunidadmedida as abrevum,
          mod.denominacion as denominacionmod,
          aen.ajuste,          
          COALESCE(SUM(aei.plan), 0) AS nivelinversion
          FROM mod_planificacion.nom_actividad a
          INNER JOIN mod_planificacion.dat_actividadentidad aen ON (a.idactividad = aen.idactividad)
          LEFT OUTER JOIN mod_planificacion.dat_actividadmodelo amod ON (amod.idactividad = aen.idactividad)
          LEFT OUTER JOIN mod_planificacion.dat_modelo mod ON (amod.idmodelo  = mod.idmodelo )
          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico niva ON (aen.idactividadentidad = niva.idactividadentidad)
          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual nivm ON (aen.idactividadentidad = nivm.idactividadentidad)
          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion nivp ON (aen.idactividadentidad = nivp.idactividadentidad)
          LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (aei.idactividadentidad = aen.idactividadentidad AND aei.idejercicio = {$params['idejercicio']})
          LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (aee.idactividadentidad = aen.idactividadentidad)
          INNER JOIN mod_planificacion.dat_norma nor ON (a.idactividad = nor.idactividad)
          INNER JOIN mod_datosmaestros.nom_indicador i ON (nor.idindicador = i.idindicador)
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador)
	  LEFT OUTER JOIN mod_planificacion.dat_indicadormodelo im ON (i.idindicador = im.idindicador)
	  LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
          WHERE aen.identidad in ({$params['entidades']}) AND
          a.estado = 1 AND i.estado = 1 AND
          ip.nivelplanif = 1 AND a.idactividad in({$params['idactividad']})
          AND aen.idejercicio = {$params['idejercicio']}  AND
          nor.idejercicio =  {$params['idejercicio']}
          GROUP BY i.idindicador,
                ip.precio,
                ip.preciodivisa,
                nivp.nivelactividadproduccion,
                niva.nivelactividadautomatico,
                nivm.nivelactividadmanual,
                aee.nivelactividadelemento,
                nor.cantplanif,
                nor.cantbase, a.idactividad, aen.identidad,
          i.idumedida,
          um.abreviaturaunidadmedida,
          mod.denominacion,
          aen.ajuste
          OFFSET {$params['start']}
          LIMIT  {$params['limit']}


                ) as alias

        GROUP BY alias.entidad,
         alias.indicador,
         alias.denominacionmod,
         alias. precio,
         alias.codigo,
         alias.denominacion,
         alias.preciodivisa,
         alias.denominacion,
         alias.um,
         alias.abrevum";
        $temp = $conn->execute($sql);
        $data->data = $temp->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function exportarCalculoAExcelImporte($params)
    {

        $conn = Doctrine_Manager::connection();

        $params['entidades'] = implode(',', $params['entidades']);
        $params['idactividad'] = implode(',', $params['idactividad']);


        $sqlimporte = "SELECT
                       round( SUM( alias.cant * ((alias.nivelprod+alias.nivelauto+alias.nivelmanual+alias.nivelinversion+alias.nivelproyecto)) * alias.precio) ,3) as importe
  FROM (SELECT
          i.idindicador AS indicador,
          COALESCE(nivp.nivelactividadproduccion,0) AS nivelprod,
          COALESCE(niva.nivelactividadautomatico,0) AS nivelauto,
          ip.precio AS precio,
          COALESCE(nivm.nivelactividadmanual,0) AS nivelmanual,
          COALESCE(aee.nivelactividadelemento,0) AS nivelproyecto,
          nor.cantplanif*nor.cantbase AS cant,
          COALESCE(SUM(aei.plan), 0) AS nivelinversion
          FROM mod_planificacion.nom_actividad a
          INNER JOIN mod_planificacion.dat_actividadentidad aen ON (a.idactividad = aen.idactividad)
          LEFT OUTER JOIN mod_planificacion.dat_actividadmodelo amod ON (amod.idactividad = aen.idactividad)
          LEFT OUTER JOIN mod_planificacion.dat_modelo mod ON (amod.idmodelo  = mod.idmodelo )
          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadautomatico niva ON (aen.idactividadentidad = niva.idactividadentidad)
          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadmanual nivm ON (aen.idactividadentidad = nivm.idactividadentidad)
          LEFT OUTER JOIN mod_planificacion.dat_actividadentidadproduccion nivp ON (aen.idactividadentidad = nivp.idactividadentidad)
          LEFT JOIN  mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (aei.idactividadentidad = aen.idactividadentidad AND aei.idejercicio = {$params['idejercicio']})
          LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (aee.idactividadentidad = aen.idactividadentidad)
          INNER JOIN mod_planificacion.dat_norma nor ON (a.idactividad = nor.idactividad)
          INNER JOIN mod_datosmaestros.nom_indicador i ON (nor.idindicador = i.idindicador)
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador)
	  LEFT OUTER JOIN mod_planificacion.dat_indicadormodelo im ON (i.idindicador = im.idindicador)
	  LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
          WHERE
          aen.identidad in ({$params['entidades']}) AND
          a.estado = 1 AND i.estado = 1 AND
          ip.nivelplanif = 1 AND a.idactividad in({$params['idactividad']})
          AND aen.idejercicio = {$params['idejercicio']}  AND
	  nor.idejercicio =  {$params['idejercicio']}
	  GROUP BY i.idindicador,
                ip.precio,
                ip.preciodivisa,
                nivp.nivelactividadproduccion,
                niva.nivelactividadautomatico,
                nivm.nivelactividadmanual,
                aee.nivelactividadelemento,
                nor.cantplanif,
                nor.cantbase
	  ) as alias";

        $temp = $conn->execute($sqlimporte);
        $data->importe = $temp->fetchAll(PDO::FETCH_ASSOC);
        $data->importe = $data->importe[0]['importe'];

        return $data;
    }

    public function generarBaseDeCalculoDeUnaEntidad($arrayParaleloentesp, $idtipocalc, $idejercicio)
    {
        $strarrayentidades = implode(',', $arrayParaleloentesp['identidad']);
        $strarrayentidades = "{" . $strarrayentidades . "}";
        $strarrayespecialidades = implode(',', $arrayParaleloentesp['idespecialidad']);
        $strarrayespecialidades = "{" . $strarrayespecialidades . "}";
        $arrayParametros = array();
        $conn = Doctrine_Manager::connection();
        if ($idtipocalc == 1) {
            $arrayParametros[0] = $strarrayentidades;
            $arrayParametros[1] = $idejercicio;
            $arrayParametros[2] = $strarrayespecialidades;
            $query = "select * from mod_planifintegracion.f_basedeplan10sisplaninv(?,?,?)";
        } else {
            $arrayParametros[0] = $strarrayentidades;
            $arrayParametros[1] = $idejercicio;
            $query = "select * from mod_planifintegracion.f_basedeplansalidasinmodelosisplaninv(?,?)";
        }

        $res = $conn->execute($query, $arrayParametros);
        $resultUno = $res->fetchAll();
        if ($idtipocalc == 1) {
            $query = "select * from mod_planifintegracion.f_basedeplan11sisplaninv(?,?,?)";
        } else {
            $query = "select * from mod_planifintegracion.f_basedeplansalidaconmodelosisplaninv(?,?)";
        }
        $res = $conn->execute($query, $arrayParametros);
        $resultDos = $res->fetchAll();
        if ($idtipocalc == 1) {
            return ($resultUno[0]['f_basedeplan10sisplaninv'] || $resultDos[0]['f_basedeplan11sisplaninv']);
        } else {
            return ($resultUno[0]['f_basedeplansalidasinmodelosisplaninv'] || $resultDos[0]['f_basedeplansalidaconmodelosisplaninv']);
        }
    }

}
