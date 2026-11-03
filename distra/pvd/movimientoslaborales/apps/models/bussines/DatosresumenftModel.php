<?php

class DatosresumenftModel extends ZendExt_Model {

    public function DatosresumenftModel() {
        parent::ZendExt_Model();
    }

    public function getOrganos($idestructura) {
        $organos = array();
        $hijosEstructura = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
        $llave = 0;
        foreach ($hijosEstructura as $value) {
            if ($value->idconcepto != 7) {
                $organos[$llave]['denominacion'] = $value->text;
                $organos[$llave]['idestructura'] = $value->id;
                $organos[$llave]['estructurapadre'] = false;
                $llave++;
            }
        }
        $cargosImediatos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructuraInmediatos(
                $idestructura, true
        );
        if (!empty($cargosImediatos)) {
            $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
            $organos[$llave]['denominacion'] = $datosEstructura[0]->denominacion;
            $organos[$llave]['idestructura'] = $idestructura;
            $organos[$llave]['estructurapadre'] = true;
        }
        return $organos;
    }

    public function getDenominacionColumnas() {
        $denomColumnas = array();

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $sqlMotivoBaja = "SELECT mb.denominacion
                  FROM mod_fuerzatrabajo.nom_motivobaja AS mb
                  WHERE mb.fdesde <= now() AND (mb.fhasta >= now() OR mb.fhasta IS NULL)
                  ORDER BY mb.idmotivobaja;";
        $motivosBaja = $conn->fetchAll($sqlMotivoBaja);

        $sqlNivelEduc = "SELECT ne.denominacion
                  FROM mod_personaext.nom_niveleducacional AS ne
                  WHERE ne.fdesde <= now() AND (ne.fhasta >= now() OR ne.fhasta IS NULL)
                  ORDER BY ne.idniveleducacional;";
        $nivelesEduc = $conn->fetchAll($sqlNivelEduc);

        $sqlColorPiel = "SELECT cp.denominacion
                  FROM mod_persona.nom_colorpiel AS cp
                  WHERE cp.fdesde <= now() AND (cp.fhasta >= now() OR cp.fhasta IS NULL)
                  ORDER BY cp.idcolorpiel;";
        $coloresPiel = $conn->fetchAll($sqlColorPiel);

        $denomColumnas[] = 'Órganos y U.C';
        $denomColumnas[] = 'Total de Trabajadores';
        $denomColumnas[] = 'Hombres';
        $denomColumnas[] = 'Mujeres';
        $denomColumnas[] = 'PCC';
        $denomColumnas[] = 'UJC';
        $denomColumnas[] = 'Altas';
        $denomColumnas[] = 'Bajas';

        foreach ($motivosBaja as $key => $value) {
            $denomColumnas[] = $value['denominacion'];
        }

        $denomColumnas[] = 'Total de bajas';

        foreach ($nivelesEduc as $key => $value) {
            $denomColumnas[] = $value['denominacion'];
        }

        $denomColumnas[] = 'TOTAL';

        $denomColumnas[] = 'Edad no conocida';
        $denomColumnas[] = 'Menores de 15 años';
        $denomColumnas[] = 'Entre 15 y 16 años';
        $denomColumnas[] = 'Entre 17 y 19 años';
        $denomColumnas[] = 'Entre 20 y 29 años';
        $denomColumnas[] = 'Entre 30 y 39 años';
        $denomColumnas[] = 'Entre 40 y 59 años';
        $denomColumnas[] = 'Entre 60 y 64 años';
        $denomColumnas[] = 'Entre 65 y 69 años';
        $denomColumnas[] = 'Mayores de 70 años';

        $denomColumnas[] = 'TOTAL';

        foreach ($coloresPiel as $key => $value) {
            $denomColumnas[] = $value['denominacion'];
        }

        $denomColumnas[] = 'TOTAL';

        //$denomColumnas[] = 'Licencias de Maternidad';

        $result = array();
        $result['denominaciones'] = $denomColumnas;
        $result['totalmotivosbaja'] = count($motivosBaja);
        $result['totalniveleduc'] = count($nivelesEduc);
        $result['totalcolorespiel'] = count($coloresPiel);

        return $result;
    }

    public function getValoresFila($idestructura, $fdesde, $fhasta, $estructurapadre = false) {
        $valoresFila = array();

        if ($estructurapadre) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructuraInmediatos($idestructura, true);
        } else {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        }
        if (count($cargos) > 0) {
            if ($estructurapadre) {
                $stringIdsCargos = $this->arrayToString($cargos);
            } else {
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
                $stringIdsCargos = $this->arrayToString($idcargos);
            }

            $datosPrincipales = $this->getDatosPrincipales($stringIdsCargos, $fdesde, $fhasta);

            $valoresFila['totaltrabajadores'] = $datosPrincipales[0]['totaltrabajadores'];
            $valoresFila['hombres'] = $datosPrincipales[0]['hombres'];
            $valoresFila['mujeres'] = $datosPrincipales[0]['mujeres'];
            $valoresFila['pcc'] = $datosPrincipales[0]['pcc'];
            $valoresFila['ujc'] = $datosPrincipales[0]['ujc'];
            $valoresFila['altas'] = $datosPrincipales[0]['altas'];
            $valoresFila['bajas'] = $datosPrincipales[0]['bajas'];

            $valoresFila['bajaspormotivos'] = $this->getBajasPorMotivos($stringIdsCargos, $fdesde, $fhasta);
            $valoresFila['escolaridad'] = $this->getEscolaridad($stringIdsCargos, $fdesde, $fhasta);

            $datosEdades = $this->getDatosEdades($stringIdsCargos, $fdesde, $fhasta);

            $valoresFila['edadnoconocida'] = $datosEdades[0]['edadnoconocida'];
            $valoresFila['menoresdequince'] = $datosEdades[0]['menoresdequince'];
            $valoresFila['entre15y16'] = $datosEdades[0]['entre15y16'];
            $valoresFila['entre17y19'] = $datosEdades[0]['entre17y19'];
            $valoresFila['entre20y29'] = $datosEdades[0]['entre20y29'];
            $valoresFila['entre30y39'] = $datosEdades[0]['entre30y39'];
            $valoresFila['entre40y59'] = $datosEdades[0]['entre40y59'];
            $valoresFila['entre60y64'] = $datosEdades[0]['entre60y64'];
            $valoresFila['entre65y69'] = $datosEdades[0]['entre65y69'];
            $valoresFila['mayoresdesetenta'] = $datosEdades[0]['mayoresdesetenta'];

            $totalEdades = 0;
            foreach ($datosEdades[0] as $valor) {
                $totalEdades += $valor;
            }
            if ($totalEdades == 0) {
                $totalEdades = "";
            }
            $valoresFila['totaledades'] = $totalEdades;

            $valoresFila['composicionetnica'] = $this->getComposicionEtnica($stringIdsCargos, $fdesde, $fhasta);
        } else {
            $valoresFila['totaltrabajadores'] = "";
            $valoresFila['hombres'] = "";
            $valoresFila['mujeres'] = "";
            $valoresFila['pcc'] = "";
            $valoresFila['ujc'] = "";
            $valoresFila['altas'] = "";
            $valoresFila['bajas'] = "";

            $valoresFila['bajaspormotivos'] = array();
            $valoresFila['escolaridad'] = array();

            $valoresFila['edadnoconocida'] = "";
            $valoresFila['menoresdequince'] = "";
            $valoresFila['entre15y16'] = "";
            $valoresFila['entre17y19'] = "";
            $valoresFila['entre20y29'] = "";
            $valoresFila['entre30y39'] = "";
            $valoresFila['entre40y59'] = "";
            $valoresFila['entre60y64'] = "";
            $valoresFila['entre65y69'] = "";
            $valoresFila['mayoresdesetenta'] = "";

            $valoresFila['totaledades'] = "";

            $valoresFila['composicionetnica'] = array();
        }

        return $valoresFila;
    }

    private function arrayToString($array) {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }

    public function getDatosPrincipales($stringIdsCargos, $fdesde, $fhasta) {
        $fdesde = date('Y-m-d', strtotime($fdesde));
        $fhasta = date('Y-m-d', strtotime($fhasta));

        $sql = "SELECT  
	SUM((select 1 
            from mod_persona.dat_situacionlaboral as dsl where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND (sl.estado = 0 
                    OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
            limit 1 ) ) as totaltrabajadores, 
	SUM((select 1 
            from mod_persona.dat_situacionlaboral as dsl where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND (sl.estado = 0 
                    OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
                AND dp.sexo = 1 limit 1 ) ) as hombres, 
	SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (sl.estado = 0 OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') 
                        OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
                    AND dp.sexo <> 1 limit 1 ) ) as mujeres,
	SUM((select 1 
            from mod_persona.dat_situacionlaboral as dsl where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND (sl.estado = 0 
                    OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
                AND org.denominacion = 'PCC' 
                AND af.fdesde <= now() AND (af.fhasta > now() OR af.fhasta is null) limit 1 ) ) as pcc,
	SUM((select 1 
            from mod_persona.dat_situacionlaboral as dsl where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND (sl.estado = 0 
                    OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
                AND org.denominacion = 'UJC' AND af.fdesde <= now() 
                AND (af.fhasta > now() OR af.fhasta is null) limit 1 ) ) as ujc,
        SUM((select 1 
            from mod_persona.dat_situacionlaboral as dsl 
            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND sl.estado = 0 AND sl.fdesde >= '$fdesde' AND sl.fdesde <= '$fhasta' limit 1 ) ) as altas,
        SUM((select 1 
            from mod_persona.dat_situacionlaboral as dsl 
            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND sl.estado = 2 AND sl.fhasta is not null 
                AND sl.fhasta >= '$fdesde' AND sl.fhasta <= '$fhasta' limit 1 ) ) as bajas 

	FROM mod_persona.dat_situacionlaboral AS sl 

	INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
	INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
	LEFT JOIN mod_personaext.dat_afiliacion AS af ON (af.idpersona = dpe.idpersona)
	LEFT JOIN mod_personaext.nom_organizacion AS org ON (org.idorganizacion = af.idorganizacion) 

        WHERE (sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.fdesde <= '$fhasta' ) ";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajasPorMotivos($stringIdsCargos, $fdesde, $fhasta) {
        $fdesde = date('Y-m-d', strtotime($fdesde));
        $fhasta = date('Y-m-d', strtotime($fhasta));

        $sql = "SELECT nmb.denominacion, (SELECT count(sl.idsituacionlaboralp) 
                    FROM mod_persona.dat_situacionlaboral AS sl 
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
                    INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                    WHERE sl.idmotivo = nmb.idmotivobaja AND sl.principal = 1 AND sl.estado = 2 
                        AND sl.fhasta >= '$fdesde'  AND sl.fhasta <= '$fhasta' AND sl.fdesde <= '$fhasta' 
                        AND sl.idcargo IN ($stringIdsCargos)
                ) as cantidad

        FROM mod_fuerzatrabajo.nom_motivobaja as nmb
        WHERE nmb.fdesde <= now() AND (nmb.fhasta >= now() OR nmb.fhasta IS NULL)
        ORDER BY nmb.idmotivobaja";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        return $conn->fetchAll($sql);
    }

    public function getEscolaridad($stringIdsCargos, $fdesde, $fhasta) {
        $fdesde = date('Y-m-d', strtotime($fdesde));
        $fhasta = date('Y-m-d', strtotime($fhasta));

        /* $sql = "SELECT ne.denominacion, (SELECT count(sl.idsituacionlaboralp)
          FROM mod_persona.dat_situacionlaboral AS sl
          INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
          INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
          LEFT JOIN mod_personaext.dat_niveleducacional AS dne
          ON (dne.idpersona = dp.idpersona
          AND dne.fdesde =
          (SELECT MAX(dnie.fdesde)
          FROM mod_personaext.dat_niveleducacional AS dnie
          WHERE dnie.idpersona = dp.idpersona))
          WHERE dne.idniveleducacional = ne.idniveleducacional AND sl.principal = 1
          AND sl.fdesde <= '$fhasta'
          AND (sl.estado = 0 OR (sl.estado = 1 AND sl.fhasta >= '$fdesde')
          OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
          AND sl.idcargo IN ($stringIdsCargos)
          ) as cantidad

          FROM mod_personaext.nom_niveleducacional AS ne

          WHERE ne.fdesde <= now() AND (ne.fhasta >= now() OR ne.fhasta IS NULL)

          ORDER BY ne.idniveleducacional"; */

        $sql = "SELECT * from mod_persona.f_cantidad_por_niveleducacional('{" . $stringIdsCargos . "}', '$fdesde','$fhasta');";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        //var_dump($sql);die;

        return $conn->fetchAll($sql);
    }

    public function getDatosEdades($stringIdsCargos, $fdesde, $fhasta) {
        $fdesde = date('Y-m-d', strtotime($fdesde));
        $fhasta = date('Y-m-d', strtotime($fhasta));

        $sql = "SELECT 
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND dn.fechanacimiento is null limit 1 )) as edadnoconocida,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) < 15) limit 1 )) as menoresdequince,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) = 15 
                        OR date_part('year', age(dn.fechanacimiento)) = 16) limit 1 )) as entre15y16,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                AND (date_part('year', age(dn.fechanacimiento)) >= 17 
                    AND date_part('year', age(dn.fechanacimiento)) <= 19) limit 1 )) as entre17y19,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 20 
                        AND date_part('year', age(dn.fechanacimiento)) <= 29) limit 1 )) as entre20y29,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 30 
                        AND date_part('year', age(dn.fechanacimiento)) <= 39) limit 1 )) as entre30y39,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 40 
                        AND date_part('year', age(dn.fechanacimiento)) <= 59) limit 1 )) as entre40y59,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 60 
                        AND date_part('year', age(dn.fechanacimiento)) <= 64) limit 1 )) as entre60y64,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 65 
                        AND date_part('year', age(dn.fechanacimiento)) <= 69) limit 1 )) as entre65y69,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 70) limit 1 )) as mayoresdesetenta
	
	FROM mod_persona.dat_situacionlaboral AS sl 

	INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
	INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null) 
	LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)

	WHERE (sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.fdesde <= '$fhasta' 
            AND (sl.estado = 0 OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') 
                OR (sl.estado = 2 AND sl.fhasta >= '$fdesde')))";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        //var_dump($sql);die;

        return $conn->fetchAll($sql);
    }

    public function getComposicionEtnica($stringIdsCargos, $fdesde, $fhasta) {
        $fdesde = date('Y-m-d', strtotime($fdesde));
        $fhasta = date('Y-m-d', strtotime($fhasta));

        $sql = "SELECT cp.denominacion, (SELECT count(sl.idsituacionlaboralp) 
                    FROM mod_persona.dat_situacionlaboral AS sl 
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
                    INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                    LEFT JOIN mod_persona.dat_fenotipo AS df ON (df.idpersona = dp.idpersona)
                    WHERE df.idcolorpiel = cp.idcolorpiel AND sl.principal = 1 AND sl.fdesde <= '$fhasta' 
                            AND (sl.estado = 0 OR (sl.estado = 1 AND sl.fhasta >= '$fdesde') 
                                OR (sl.estado = 2 AND sl.fhasta >= '$fdesde'))
                            AND sl.idcargo IN ($stringIdsCargos)
            ) as cantidad

	FROM mod_persona.nom_colorpiel AS cp

	WHERE cp.fdesde <= now() AND (cp.fhasta >= now() OR cp.fhasta IS NULL)

	ORDER BY cp.idcolorpiel";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        //var_dump($sql);die;

        return $conn->fetchAll($sql);
    }

}
