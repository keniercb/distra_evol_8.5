<?php
class AnalisisFT
{
    public function obtenerTotalGenero($cargos, $fecha)
    {
        $sql = "SELECT dp.sexo, count(dp.sexo) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                WHERE dp.feliminado IS NULL";
        if (isset($fecha)) {
            $sql .= " AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta > '$fecha'))";
        } else {
            $sql .= " AND (dsl.estado = 0 AND (dsl.fhasta > now() OR dsl.fhasta IS NULL)
                     AND (dpe.fhasta IS NULL OR dpe.fhasta > now()))";
        }
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY dp.sexo";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalEdades($cargos, $fecha)
    {
        $sql = "SELECT date_part('year',age(ddn.fechanacimiento)) AS edad,
                count(dp.idpersona) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                LEFT JOIN mod_persona.dat_datosnacimiento AS ddn ON (dpe.idpersona = ddn.idpersona)
                WHERE dp.feliminado IS NULL";
        if (isset($fecha)) {
            $sql .= " AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta > '$fecha'))";
        } else {
            $sql .= " AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        }
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY edad";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalGeneroEdad($cargos)
    {
        $sql = "SELECT
                dp.sexo,
                date_part('year',age(ddn.fechanacimiento)) AS edad,
                count(dp.idpersona) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                LEFT JOIN mod_persona.dat_datosnacimiento AS ddn ON (dpe.idpersona = ddn.idpersona)
                WHERE dp.feliminado IS NULL AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY dp.sexo, edad";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalTipoContrato($cargos, $fecha)
    {
        $sql = "SELECT
                ntc.determinado,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato)
                WHERE dp.feliminado IS NULL";
        if (isset($fecha)) {
            $sql .= " AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta >= '$fecha'))";
        } else {
            $sql .= " AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        }
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY ntc.determinado";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalContrato($cargos, $fecha)
    {
        $sql = "SELECT
                ntc.denominacion,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato)
                WHERE dp.feliminado IS NULL";
        if (isset($fecha)) {
            $sql .= " AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta >= '$fecha'))";
        } else {
            $sql .= " AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        }
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY ntc.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalCategOcup($cargos, $fecha)
    {
        $sql = "SELECT
                nco.denominacion,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                INNER JOIN mod_estructuracomp.nom_filaestruc AS nfe ON (dsl.idcargo = nfe.idfila)
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (nfe.idfila = dc.idcargo AND dc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.dat_cargocivil AS dcc ON (dc.idcargo = dcc.idcargo AND dcc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_categocup AS nco ON (dcc.idcategocup = nco.idcategocup)
                WHERE dp.feliminado IS NULL";
        if (isset($fecha)) {
            $sql .= " AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta >= '$fecha'))";
        } else {
            $sql .= " AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        }
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY nco.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalProcSocial($cargos, $fecha)
    {
        $sql = "SELECT
        ps.denominacion,
        count(dsl.idsituacionlaboralp) AS cant
        FROM mod_persona.dat_situacionlaboral AS dsl
        INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
        INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
        INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
        INNER JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (dpe.idprocedenciasocial = ps.idprocedenciasocial)
        WHERE dp.feliminado IS NULL";
        if (isset($fecha)) {
            $sql .= " AND (dsl.estado = 0 OR (dsl.fhasta IS NULL OR dsl.fhasta >= '$fecha'))";
        } else {
            $sql .= " AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        }
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY ps.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalColorPiel($cargos) {
	$sql = "SELECT
		CASE WHEN (ncp.denominacion IS NULL) THEN 'NO REGISTRADO' ELSE ncp.denominacion END AS denominacion,
		count(DISTINCT dsl.idsituacionlaboralp) AS cant
		FROM mod_persona.dat_situacionlaboral AS dsl
		INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
		INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
        INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
		LEFT JOIN mod_persona.dat_fenotipo AS df ON (dp.idpersona = df.idpersona)
		LEFT JOIN mod_persona.nom_colorpiel AS ncp ON (df.idcolorpiel = ncp.idcolorpiel)
		WHERE dp.feliminado IS NULL AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY ncp.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalSitLab($cargos)
    {
        $sql = "SELECT
                ns.denominacion,
                ns.color,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_persona.nom_situacion AS ns ON (dsl.idsituacion = ns.idsituacion)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                WHERE dp.feliminado IS NULL AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY ns.denominacion, ns.color";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalProgLab($cargos)
    {
        $sql = "SELECT
                CASE WHEN pc.denominacion IS NULL THEN 'NO REGISTRADO' ELSE pc.denominacion END AS denominacion,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                LEFT JOIN mod_fuerzatrabajo.nom_programalaboral AS pc ON (dsl.idprogramalaboral = pc.idprogramalaboral)
                WHERE dp.feliminado IS NULL AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY pc.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalNivelEducacional($cargos)
    {
        $sql = "SELECT
                CASE WHEN nne.denominacion IS NULL THEN 'NO REGISTRADO' ELSE nne.denominacion END AS denominacion,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                LEFT JOIN mod_personaext.dat_niveleducacional AS dne ON (dp.idpersona = dne.idpersona)
                LEFT JOIN mod_personaext.nom_niveleducacional AS nne ON (dne.idniveleducacional = nne.idniveleducacional)
                WHERE dp.feliminado IS NULL AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY nne.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerTotalTitulo($cargos)
    {
        $sql = "SELECT
                CASE WHEN nt.denominacion IS NULL THEN 'NO REGISTRADO' ELSE nt.denominacion END AS denominacion,
                count(dsl.idsituacionlaboralp) AS cant
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
                LEFT JOIN mod_personaext.dat_niveleducacional AS dne ON (dp.idpersona = dne.idpersona)
                LEFT JOIN mod_personaext.nom_titulo AS nt ON (dne.idtitulo = nt.idtitulo)
                WHERE dp.feliminado IS NULL AND (dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > CURRENT_DATE))";
        if (count($cargos) > 0) {
            $sql = $sql." AND dsl.idcargo IN (".implode(',', $cargos).")";
        }
        $sql = $sql."GROUP BY nt.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCompartimentacionByIdusuario($idusuario)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT c.*
            FROM mod_rrhhmaestro.seg_usuariocompartimentacion c       
            WHERE c.idusuario = $idusuario";
        return $conn->fetchAll($sql);
    }
}
