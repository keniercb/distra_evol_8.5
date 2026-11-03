<?php

/**
 * Nombre de la Clase: DatPersonaAntex
 * @comentario:
 * @author Ing.Yoan Uria Rodriguez
 */
class DatPersonaAntex extends DatPersona {

    public function BuscarPersonaPorParamAntex($params, $limite, $inicio, $idestructura, $iddominio, $permiso, $meta, $fonetica='') {
        $filtro = '';
        $filtro1 = '';
        $mfnt = new fnt();
        if ($params->numid != "") {
            $filtro .= " dp.numid ilike '%" . $params->numid . "%' and ";
            $filtro1 .= " dp1.numid ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->nombre);
                $filtro.= " chf.fnom = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.nombre ilike '%" . $params->nombre . "%' and ";
                $filtro1 .= "dp1.nombre ilike '%" . $params->nombre . "%' and ";
            }
        }
        if ($params->snombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->snombre);
                $filtro.= " chf.fsnom = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fsnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.snombre ilike '%" . $params->snombre . "%' and ";
                $filtro1 .= " dp1.snombre ilike '%" . $params->snombre . "%' and ";
            }
        }
        if ($params->primerapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->primerapellido);
                $filtro.= " chf.fpapel = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fpapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.papel ilike '%" . $params->primerapellido . "%' and ";
                $filtro1 .= " dp1.papel ilike '%" . $params->primerapellido . "%' and ";
            }
        }
        if ($params->segundoapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->segundoapellido);
                $filtro.= " chf.fsapel = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fsapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.sapel ilike '%" . $params->segundoapellido . "%' and ";
                $filtro1 .= "dp1.sapel ilike '%" . $params->segundoapellido . "%' and ";
            }
        }
        if ($params->idpersona != "") {
            $filtro .= " dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= " dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= " dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= " dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= " dpc.id_categoria = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= " dpc1.id_categoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= " dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= " dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }

        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                if($arrEntidades){
                    $in = "( ";
                    $i = 0;
                    foreach ($arrEntidades as $a) {
                        if ($i == 0)
                            $in = $in . $a['idestructura'];
                        else
                            $in = $in . ", " . $a['idestructura'];
                        $i++;
                    }
                    $in .= " )";
                    $filtro .= "doa.identidad in {$in} and ";
                    $filtro1 .= "doa.identidad in {$in} and ";
                }
            }
            else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
                $filtro1 .= "doa1.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
                $filtro1 .= "doa1.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";
                $filtro .= "doa.idcargo in {$in} and ";
                $filtro1 .= "doa1.idcargo in {$in} and ";
            }
        }

        $filtro.= " (dp.fechaeliminado is null)";
        $filtro1.= " (dp1.fechaeliminado is null)";

        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($permiso == 2) {
            $integratorIOC = ZendExt_IoC::getInstance();
            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosbyDominio($idestructura);

            $arrIDsCargos = array();

            foreach ($arrCargos as $i => $v) {
                $arrIDsCargos[] = $v->idcargo;
            }
            //print_r($arrIDsCargos);die;
            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            //print_r($arrEntidades);die;
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v) {
                $arrIDsEntidades[] = $v->identidad;
            }
            if ($arrIDsCargos) {
                $sql = "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                        dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                        dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                        FROM mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
                        INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                        LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                        LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                        LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                        LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                        left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                        LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                        WHERE ";
                $sql .= $filtro . " ) UNION ";
            }
            if ($arrIDsEntidades) {
                $sql .= "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                    dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                    dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                    LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                    WHERE ";
                $sql .= $filtro . " ) UNION  ";
            }
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= " ( select DISTINCT(dp1.idpersona), dp1.numid, dp1.nombre, dp1.snombre, dp1.papel, dp1.sapel, dp1.idsexo, dp1.idcategoriapersona,
                    dp1.idsituacionpersona, nsp1.denom as situacionpersona, dp1.idsituacionespecificapersona,date_part('year',age(dpn1.fechanacimiento)) as annos,
                    dpdi1.idpersonaidentidad, dpdi1.idtipodocidentidad, df1.idfoto, df1.extension, npc1.denom as categoriapersona, ntdi1.denom as tipodocidentidad
                    from mod_persona.dat_persona dp1
                    inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
                    inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
                    left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
                    left join mod_persona.dat_ocupacionactual doa1 on (doa1.idpersona = dp1.idpersona)
                    left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
                    left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona)
                    left join mod_persona.dat_personanacimiento dpn1 ON (dp1.idpersona = dpn1.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf1 ON (chf1.idpersona = dp1.idpersona)
                    where  {$filtro1} )";
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        elseif($permiso == 1) {
            $sql = "select DISTINCT dp.idpersona, dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona,
                date_part('year',age(dpn.fechanacimiento)) as annos, dpdi.idpersonaidentidad, dpdi.idtipodocidentidad,
                npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                from mod_persona.dat_persona dp
                inner join mod_persona.dat_personadocidentidad dpdi on (dpdi.idpersona = dp.idpersona  and dpdi.actual = 1 and dpdi.activo = 1)
                left join mod_persona.dat_ocupacionactual doa on (doa.idpersona = dp.idpersona)
                left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
                left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
                LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
		where ";
            $sql .= $filtro . " ";
            $sql .= " order by dp.nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }
        elseif($permiso > 3){
            $objCompartimentacion = new DatGrupo();
            $stSql = $objCompartimentacion->getByid($permiso);
            if($stSql){
                $stSql = json_decode($stSql['compartimentacion']);
                $sql = $stSql->select;
                $sql .= $stSql->from;
                $sql .= $stSql->where;
                $sql .= " limit {$limite} offset {$inicio} ";
                $resultado = $conn->fetchAll($sql);
                //print_r($resultado);die;
            }
        }else
            $resultado = array();
        return $resultado;
    }

    public function countBuscarPersonaPorParamAntex($params, $idestructura, $iddominio, $permiso, $meta) {
        $filtro = '';
        $filtro1 = '';
        if ($params->numid != "") {
            $filtro .= " dp.numid ilike '%" . $params->numid . "%' and ";
            $filtro1 .= " dp1.numid ilike '%" . $params->numid . "%' and ";
        }
        if ($params->nombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->nombre);
                $filtro.= " chf.fnom = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.nombre ilike '%" . $params->nombre . "%' and ";
                $filtro1 .= "dp1.nombre ilike '%" . $params->nombre . "%' and ";
            }
        }
        if ($params->snombre != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->snombre);
                $filtro.= " chf.fsnom = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fsnom = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.snombre ilike '%" . $params->snombre . "%' and ";
                $filtro1 .= " dp1.snombre ilike '%" . $params->snombre . "%' and ";
            }
        }
        if ($params->primerapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->primerapellido);
                $filtro.= " chf.fpapel = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fpapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= " dp.papel ilike '%" . $params->primerapellido . "%' and ";
                $filtro1 .= " dp1.papel ilike '%" . $params->primerapellido . "%' and ";
            }
        }
        if ($params->segundoapellido != "") {
            if ($fonetica != '') {
                $fonetica = $mfnt->Conversion($params->segundoapellido);
                $filtro.= " chf.fsapel = '" . $fonetica . "' and ";
                $filtro1.= " chf1.fsapel = '" . $fonetica . "' and ";
            } else {
                $filtro .= "dp.sapel ilike '%" . $params->segundoapellido . "%' and ";
                $filtro1 .= "dp1.sapel ilike '%" . $params->segundoapellido . "%' and ";
            }
        }
        if ($params->idpersona != "") {
            $filtro .= " dp.idpersona = '" . $params->idpersona . "' and ";
            $filtro1 .= " dp1.idpersona = '" . $params->idpersona . "' and ";
        }
        if ($params->idsexo != "") {
            $filtro .= " dp.idsexo = '" . $params->idsexo . "' and ";
            $filtro1 .= " dp1.idsexo = '" . $params->idsexo . "' and ";
        }
        if ($params->idcategoriapersona != "") {
            $filtro .= " dpc.id_categoria = '" . $params->idcategoriapersona . "' and ";
            $filtro1 .= " dpc1.id_categoria = '" . $params->idcategoriapersona . "' and ";
        }
        if ($params->tipoidentidad != "") {
            $filtro .= " dpdi.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
            $filtro1 .= " dpdi1.idtipodocidentidad = '" . $params->tipoidentidad . "' and ";
        }
        $in = "";
        if ($meta != null) {
            if ($params->tipoestructura == 1 or $params->tipoestructura == 2) {
                $arrEntidades = $meta->BuscarEntidadesXidestructura($params->idestructura);
                if($arrEntidades){
                    $in = "( ";
                    $i = 0;
                    foreach ($arrEntidades as $a) {
                        if ($i == 0)
                            $in = $in . $a['idestructura'];
                        else
                            $in = $in . ", " . $a['idestructura'];
                        $i++;
                    }
                    $in .= " )";
                    $filtro1 .= "doa1.identidad in {$in} and ";
                    $filtro .= "doa.identidad in {$in} and ";
                }
            }
            else if ($params->tipoestructura == 3) {
                $filtro .= "doa.identidad = {$params->idestructura} and ";
                $filtro1 .= "doa1.identidad = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 4 or $params->tipoestructura == 5) {
                $filtro .= "doa.idcargo = {$params->idestructura} and ";
                $filtro1 .= "doa1.idcargo = {$params->idestructura} and ";
            } else if ($params->tipoestructura == 9 or $params->tipoestructura == 10) {
                $arrCargos = $meta->BuscarCargosXidestructuraop($params->idestructura);
                $in = "( ";
                $i = 0;
                foreach ($arrCargos as $a) {
                    if ($i == 0)
                        $in = $in . $a['idcargo'];
                    else
                        $in = $in . ", " . $a['idcargo'];
                    $i++;
                }
                $in .= " )";
                $filtro .= "doa.idcargo in {$in} and ";
                $filtro1 .= "doa1.idcargo in {$in} and ";
            }
        }

        $filtro.= ' (dp.fechaeliminado is null )';
        $filtro1.= ' (dp1.fechaeliminado is null )';

        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($permiso == 2) {
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosbyDominio($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v->idcargo;

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v) {
                $arrIDsEntidades[] = $v->identidad;
            }
            $resultado1 = 0;
            if ($arrIDsCargos) {
                $sql = "SELECT count(DISTINCT(dp.idpersona)) as cantidad
                        FROM mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
                        INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                        LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                        LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                        LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                        LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                        left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                        LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                        WHERE ";
                $sql .= $filtro;
                $resultado1 = $conn->fetchAll($sql);
            }
            $resultado2 = 0;
            if ($arrIDsEntidades) {
                $sql = "SELECT count(DISTINCT(dp.idpersona)) as cantidad
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                    LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                    WHERE ";
                $sql .= $filtro;
                $resultado2 = $conn->fetchAll($sql);
            }

            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql = "SELECT count(DISTINCT(dp1.idpersona)) as cantidad
                    from mod_persona.dat_persona dp1
                    inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
                    inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
                    left join mod_persona.dat_ocupacionactual doa1 on (doa1.idpersona = dp1.idpersona)
                    left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
                    left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
                    left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona)
                    left join mod_persona.dat_personanacimiento dpn1 ON (dp1.idpersona = dpn1.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf1 ON (chf1.idpersona = dp1.idpersona)
                    where  {$filtro1} ";
            $resultado3 = $conn->fetchAll($sql);
            //die($sql);
            return $resultado1[0]['cantidad'] + $resultado2[0]['cantidad'] + $resultado3[0]['cantidad'];
        }//if($permiso == 2)
        elseif($permiso == 1) {
            $sql = "select count(DISTINCT(dp.idpersona)) as cantidad
                    from mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    left JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona)
                    left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
                    left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)

			where ";
            $sql .= $filtro . " ";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
            return $resultado[0]['cantidad'];
        }
        if ($permiso > 3){
            $objCompartimentacion = new DatGrupo();
            $stSql = $objCompartimentacion->getByid($permiso);
            if($stSql){
                $stSql = json_decode($stSql['compartimentacion']);
                $sql = " SELECT count(DISTINCT(ab0.idpersona)) as cantidad ";
                $sql .= $stSql->from;
                $sql .= $stSql->where;
                $resultado = $conn->fetchAll($sql);
                if (count($resultado) > 0)
                    return $resultado[0]['cantidad'];
                else
                    return $resultado = 0;
            }
        }else{
            return $resultado = 0;
        }
        return 0;
    }

    public function BuscadorAntex($inicio, $limite, $texto, $idestructura, $iddominio, $permiso, $fonetica='') {
        $where = '';
        $where1 = '';
        if ($fonetica == '') {
            if ($texto != '') {
                $arreglo = explode(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                        $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                    }
                }
            }
        }else {
            if ($texto != '') {
                $arreglo = explode(' ', $texto);
                $or = '';
                $mfnt = new fnt();
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        $fonetica = $mfnt->Conversion($arreglo[$i]);
                        if ($where != '') {
                            $or = 'or';
                        }
                        $where.= $or . " chf.fnom = '" . $fonetica . "' or chf.fpapel = '" . $fonetica . "' or chf.fsapel = '" . $fonetica . "' or chf.fsnom = '" . $fonetica . "' ";
                        $where1.= $or . " chf1.fnom = '" . $fonetica . "' or chf1.fpapel = '" . $fonetica . "' or chf1.fsapel = '" . $fonetica . "' or chf1.fsnom = '" . $fonetica . "' ";
                    }
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where != '')
            $where1 = '( ' . $where1 . ' )';

        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($permiso == 2) {
            $where.=($where != '') ? ' and (dp.fechaeliminado is null )' : ' dp.fechaeliminado is null ';
            $where1.=($where1 != '') ? ' and (dp1.fechaeliminado is null )' : ' dp1.fechaeliminado is null ';
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosbyDominio($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v->idcargo;

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v->identidad;

            if ($arrIDsCargos) {
                $sql = "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                        dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                        dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad,viaent.idviaentrada
                        FROM mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
                        INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                        LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                        LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                        LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                        LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                        left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                        LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                        WHERE ";
                $sql .= $where . " ) UNION ";
            }
            if ($arrIDsEntidades) {
                $sql .= "( SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                    dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                    dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, df.idfoto, df.extension, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    LEFT JOIN mod_persona.nom_categoriapersona npc ON (npc.idcategoriapersona = dp.idcategoriapersona)
                    LEFT JOIN mod_persona.nom_tipodocidentidad ntdi ON (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                    LEFT JOIN mod_persona.nom_situacionpersona nsp ON (nsp.idsituacionpersona = dp.idsituacionpersona)
                    LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                    left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                    WHERE ";
                $sql .= $where . " ) UNION  ";
            }
            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql .= " ( select DISTINCT(dp1.idpersona), dp1.numid, dp1.nombre, dp1.snombre, dp1.papel, dp1.sapel, dp1.idsexo, dp1.idcategoriapersona,
                    dp1.idsituacionpersona, nsp1.denom as situacionpersona, dp1.idsituacionespecificapersona, date_part('year',age(dpn1.fechanacimiento)) as annos,
                    dpdi1.idpersonaidentidad, dpdi1.idtipodocidentidad, df1.idfoto, df1.extension, npc1.denom as categoriapersona, ntdi1.denom as tipodocidentidad
                    from mod_persona.dat_persona dp1
                    inner join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
                    inner join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
                    left join mod_persona.nom_categoriapersona npc1 on (npc1.idcategoriapersona = dp1.idcategoriapersona)
                    left join mod_persona.nom_tipodocidentidad ntdi1 on (ntdi1.idtipodocidentidad = dpdi1.idtipodocidentidad)
                    left join mod_persona.nom_situacionpersona nsp1 on (nsp1.idsituacionpersona = dp1.idsituacionpersona)
                    left join mod_persona.dat_foto df1 on (df1.idpersona = dp1.idpersona)
                    left join mod_persona.dat_personanacimiento dpn1 ON (dp1.idpersona = dpn1.idpersona)
                    LEFT JOIN mod_persona.dat_chfonetica chf1 ON (chf1.idpersona = dp1.idpersona)
                    where  {$where1} )";
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }//if($permiso == 2)
        else if ($permiso == 1) {
            $where.=($where != '') ? ' and (dp.fechaeliminado is null )' : ' dp.fechaeliminado is null ';
            $sql = "SELECT DISTINCT(dp.idpersona), dp.numid, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.idsexo, dp.idcategoriapersona,
                dp.idsituacionpersona, nsp.denom as situacionpersona, dp.idsituacionespecificapersona, date_part('year',age(dpn.fechanacimiento)) as annos,
                dpdi.idpersonaidentidad, dpdi.idtipodocidentidad, npc.denom as categoriapersona, ntdi.denom as tipodocidentidad
                FROM mod_persona.dat_persona dp
                INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
                left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
                left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
                LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
                left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
                LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                WHERE  " . $where;
            $sql .= " order by nombre limit {$limite} offset {$inicio} ;";
            //die($sql);
            $resultado = $conn->fetchAll($sql);
        }
        else if ($permiso > 3){
            $objCompartimentacion = new DatGrupo();
            $stSql = $objCompartimentacion->getByid($permiso);
            if($stSql){
                $stSql = json_decode($stSql['compartimentacion']);
                $sql = $stSql->select;
                $sql .= $stSql->from;
                $sql .= $stSql->where;
                $alia = explode(" ", $stSql->from);
                $alia = $alia[3];
                $where = str_replace("dp.",$alia.".",$where);
                $sql .= ($where != '')? 'and '.$where:'';
                $sql .= " limit {$limite} offset {$inicio} ";
                $resultado = $conn->fetchAll($sql);
            }
        }else
            $resultado = array();
        return $resultado;
    }

    public function countBuscadorAntex($texto, $idestructura, $iddominio, $permiso, $fonetica) {
        $where = '';
        $where1 = '';
        if ($fonetica == '') {
            if ($texto != '') {
                $arreglo = explode(' ', $texto);
                $or = '';
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        if ($where != '')
                            $or = 'or';
                        $where .= $or . " dp.numid ilike '%$arreglo[$i]%' or dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                        $where1 .= $or . " dp1.numid ilike '%$arreglo[$i]%' or dp1.nombre ilike '%$arreglo[$i]%' or dp1.snombre ilike '%$arreglo[$i]%' or dp1.papel ilike '%$arreglo[$i]%' or dp1.sapel ilike '%$arreglo[$i]%' ";
                    }
                }
            }
        }else {
            if ($texto != '') {
                $arreglo = explode(' ', $texto);
                $or = '';
                $mfnt = new fnt();
                for ($i = 0; $i < count($arreglo); $i++) {
                    if ($arreglo[$i]) {
                        $fonetica = $mfnt->Conversion($arreglo[$i]);
                        if ($where != '') {
                            $or = 'or';
                        }
                        $where.= $or . " chf.fnom = '" . $fonetica . "' or chf.fpapel = '" . $fonetica . "' or chf.fsapel = '" . $fonetica . "' or chf.fsnom = '" . $fonetica . "' ";
                        $where1.= $or . " chf1.fnom = '" . $fonetica . "' or chf1.fpapel = '" . $fonetica . "' or chf1.fsapel = '" . $fonetica . "' or chf1.fsnom = '" . $fonetica . "' ";
                    }
                }
            }
        }
        if ($where != '')
            $where = '( ' . $where . ' )';
        if ($where != '')
            $where1 = '( ' . $where1 . ' )';


        $glob = ZendExt_GlobalConcept::getInstance();
        $idusuario = $glob->perfil->idusuario;

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if($permiso == 2) {
            $where.=($where != '') ? ' and (dp.fechaeliminado is null )' : ' dp.fechaeliminado is null ';
            $where1.=($where1 != '') ? ' and (dp1.fechaeliminado is null )' : ' dp1.fechaeliminado is null ';
            $integratorIOC = ZendExt_IoC::getInstance();

            //Busco todos los cargos que el usuario logueado tiene acceso por dominio
            $arrCargos = $integratorIOC->metadatos->BuscarCargosbyDominio($idestructura);
            $arrIDsCargos = array();
            foreach ($arrCargos as $i => $v)
                $arrIDsCargos[] = $v->idcargo;

            //Busco todas las entidades que el usuario logueado tiene acceso y que cuyo cargo esta vacio, es decir pendiente a nombremiento
            $arrEntidades = $integratorIOC->metadatos->BuscarEntidadbyDominio($idestructura);
            $arrIDsEntidades = array();
            foreach ($arrEntidades as $i => $v)
                $arrIDsEntidades[] = $v->identidad;
            $result1 = 0;
            if ($arrIDsCargos) {
                $abrirParentisis = '';
                $sql = " SELECT count(DISTINCT(dp.idpersona)) as cantidad
                        FROM mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.idcargo IN (" . implode(',', $arrIDsCargos) . "))
                        INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                        LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                        WHERE ";
                $sql .= $where;
                $result1 = $conn->fetchAll($sql);
            }
            $result2 = 0;
            if ($arrIDsEntidades) {
                $sql = "SELECT count(DISTINCT(dp.idpersona)) as cantidad
                    FROM mod_persona.dat_persona dp
                    INNER JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona AND doa.identidad IN (" . implode(',', $arrIDsEntidades) . ")  AND doa.idcargo is null)
                    INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
                    LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
                    WHERE ";
                $sql .= $where;
                $result2 = $conn->fetchAll($sql);
            }

            //Busco todas las personas que adiciono el usuario y que todavia no ha puesto en el cargo
            $sql = "select count(DISTINCT(dp1.idpersona)) as cantidad
                    from mod_persona.dat_persona dp1
                    INNER join mod_persona.dat_personadocidentidad dpdi1 on (dpdi1.idpersona = dp1.idpersona  and dpdi1.actual = 1 and dpdi1.activo = 1)
                    INNER join mod_persona.seg_personaaccesosindominio spasd1 on (spasd1.idpersonaacceso = dp1.idpersona and spasd1.idusuario = {$idusuario})
                    LEFT JOIN mod_persona.dat_chfonetica chf1 ON (chf1.idpersona = dp1.idpersona)
                    where  {$where1}";
            $result3 = $conn->fetchAll($sql);
            $resultado = $result1[0]['cantidad'] + $result2[0]['cantidad'] + $result3[0]['cantidad'];
        }//if($permiso == 2)
        else if($permiso == 1) {
            $where.=($where != '') ? ' and (dp.fechaeliminado is null )' : ' dp.fechaeliminado is null ';
            $sql = "SELECT count(DISTINCT(dp.idpersona)) as cantidad
            FROM mod_persona.dat_persona dp
            INNER JOIN mod_persona.dat_personadocidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.actual = 1 AND dpdi.activo = 1)
            left JOIN mod_persona.dat_ocupacionactual doa ON (doa.idpersona  = dp.idpersona)
            left join mod_persona.nom_categoriapersona npc on (npc.idcategoriapersona = dp.idcategoriapersona)
            left join mod_persona.nom_tipodocidentidad ntdi on (ntdi.idtipodocidentidad = dpdi.idtipodocidentidad)
            left join mod_persona.nom_situacionpersona nsp on (nsp.idsituacionpersona = dp.idsituacionpersona)
            LEFT JOIN mod_persona.dat_foto df ON (df.idpersona = dp.idpersona and df.activo = 1)
            left join mod_persona.dat_personanacimiento dpn ON (dp.idpersona = dpn.idpersona)
            LEFT JOIN mod_persona.dat_chfonetica chf ON (chf.idpersona = dp.idpersona)
            WHERE " . $where;
            $result = $conn->fetchAll($sql);

            if (count($result) > 0)
                $resultado = $result[0]['cantidad'];
            else
                $resultado = 0;
        }
        if ($permiso > 3){
            $objCompartimentacion = new DatGrupo();
            $stSql = $objCompartimentacion->getByid($permiso);
            if($stSql){
                $stSql = json_decode($stSql['compartimentacion']);
                $alia = explode(" ", $stSql->from);
                $alia = $alia[3];
                $sql = " SELECT count(DISTINCT(".$alia.".idpersona)) as cantidad ";
                $sql .= $stSql->from;
                $sql .= $stSql->where;
                $where = str_replace("dp.",$alia.".",$where);
                $sql .= ($where != '')? 'and '.$where:'';
                $resultado = $conn->fetchAll($sql);
                if (count($resultado) > 0)
                    return $resultado[0]['cantidad'];
                else
                    return $resultado = 0;
            }
        }else{
            $resultado = 0;
        }
        return $resultado;
    }
}

?>
