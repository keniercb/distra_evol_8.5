<?php

class DatSituacionlaboral extends BaseDatSituacionlaboral {

    /**
     * Constructor
     */
    public function setUp() {
        parent:: setUp();
        $this->hasOne('NomSituacion', array('local' => 'idsituacion', 'foreign' => 'idsituacion'));
        $this->hasOne('NomMotivobaja', array('local' => 'idmotivo', 'foreign' => 'idmotivobaja'));
        $this->hasOne('NomMotivomovimiento', array('local' => 'idmotivo', 'foreign' => 'idmotivomovimiento'));
        $this->hasOne('NomTipocontrato', array('local' => 'idtipocontrato', 'foreign' => 'idtipocontrato'));
        $this->hasOne('DatPersonaentidad', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
        $this->hasOne('DatCargo', array('local' => 'idcargo', 'foreign' => 'idcargo'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $idpersonaentidad
     * @return Doctrine_Record
     */
    public function getById($idsitlaboralp) {
        return Doctrine::getTable('DatSituacionlaboral')->find($idsitlaboralp);
    }

    public function getSituacionLabById($id) {
        $query = "SELECT
                m.idespcargo , m.noalta , m.idarea , m.ueb, m.funciones 
                , m.principal , m.idtipocontrato , m.idpersonaentidad
                , m.fhasta , m.fdesde , m.idsituacion , m.idcargo
                , tc.denominacion as tipocontrato , m.idmotivo 
                , m.estado , m.idprogramalaboral, m.idmotivo as idmotivomovimiento
                , m.idmodalidadempleo  
                , ps.denominacion as procedencia
                , m.idsituacionlaboralp, m2.denominacion AS  situacion
                , m3.identidad AS identidad
                , m3.idprocedenciasocial AS idprocedenciasocial 
                , m4.denominacion as denominacion,m4.idprogramalaboral
                , tc.determinado,
                m6.denominacion as motivomovimiento
                , m5.denominacion as modalidadempleo
                FROM mod_persona.dat_situacionlaboral m
                INNER JOIN mod_persona.nom_situacion m2 ON m.idsituacion = m2.idsituacion
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato tc ON m.idtipocontrato = tc.idtipocontrato
                INNER JOIN mod_persona.dat_personaentidad m3 ON m.idpersonaentidad = m3.idpersonaentidad
                INNER JOIN mod_fuerzatrabajo.nom_procedenciasocial ps ON m3.idprocedenciasocial = ps.idprocedenciasocial
                LEFT JOIN mod_fuerzatrabajo.nom_programalaboral m4 ON m.idprogramalaboral=m4.idprogramalaboral
                LEFT JOIN mod_fuerzatrabajo.nom_modalidadempleo m5 ON m.idmodalidadempleo=m5.idmodalidadempleo
                LEFT JOIN mod_fuerzatrabajo.nom_motivomovimiento m6 ON m.idmotivo=m6.idmotivomovimiento
                WHERE (m.idsituacionlaboralp = $id)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($query);
    }

    public function getSituacionLabByIdOld($id) {
        $query = "SELECT
                m.idespcargo , m.noalta , m.idarea , m.ueb 
                , m.principal , m.idtipocontrato , m.idpersonaentidad
                , m.fhasta , m.fdesde , m.idsituacion , m.idcargo
                , tc.denominacion as tipocontrato , m.idmotivo 
                , m.estado , m.idprogramalaboral, m.idmodalidadempleo  
                , ps.denominacion as procedencia
                , m.idsituacionlaboralp, m2.denominacion AS  situacion
                , m3.identidad AS identidad
                , m3.idprocedenciasocial AS idprocedenciasocial 
                , m4.denominacion as denominacion,m4.idprogramalaboral
                , tc.determinado, m5.denominacion as modalidadempleo
                FROM mod_persona.dat_situacionlaboral m
                INNER JOIN mod_persona.nom_situacion m2 ON m.idsituacion = m2.idsituacion
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato tc ON m.idtipocontrato = tc.idtipocontrato
                INNER JOIN mod_persona.dat_personaentidad m3 ON m.idpersonaentidad = m3.idpersonaentidad
                INNER JOIN mod_fuerzatrabajo.nom_procedenciasocial ps ON m3.idprocedenciasocial = ps.idprocedenciasocial
                LEFT JOIN mod_fuerzatrabajo.nom_programalaboral m4 ON m.idprogramalaboral=m4.idprogramalaboral
                LEFT JOIN mod_fuerzatrabajo.nom_modalidadempleo m5 ON m.idmodalidadempleo=m5.idmodalidadempleo
                WHERE (m.idsituacionlaboralp = $id)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($query);
    }

    public function getMotivoBajaSituacionLabById($id, $estado) {
        $query = Doctrine_Query::create()
                ->select("m.denominacion as motivo")
                ->from('DatSituacionlaboral sl')
                ->where("sl.idsituacionlaboralp = '$id'");
        if ($estado == 1) {
            $query->innerJoin('sl.NomMotivomovimiento m');
        } else if ($estado == 2) {
            $query->innerJoin('sl.NomMotivobaja m');
        }
        return $query->execute()->toArray();
    }

    public function getSituacionByIdCargo($filtro, $identidad, $cargos, $inicio, $limite, $activo, $idconcepto, $fibaja, $ffbaja, $est, $mot, $filtros) {
        $addWhereFiltros = "";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'numid') {
                    $addWhereFiltros .= " AND a.{$datos['field']} LIKE '" . $datos['data']['value'] . "%'";
                } elseif ($datos['data']['type'] == 'string') {
                    $addWhereFiltros .= " AND upper(a.{$datos['field']}) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['data']['type'] == 'numeric') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $addWhereFiltros .= "AND a." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } elseif ($datos['data']['type'] == 'date') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltros .= "AND  a.{$datos['field']}::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltros .= "AND  a.{$datos['field']}::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltros .= "AND  a.{$datos['field']}::date='{$fecha}'";
                    }
                } else {
                    $addWhereFiltros .= " AND a.{$datos['field']} = {$datos['data']['value']}";
                }
            }
        }

        $sql = "SELECT a.*, 
                count(*) OVER() as total FROM (
                SELECT
                ns.denominacion as situacion,
                ps.idprocedenciasocial,
                ps.denominacion as procedencia,
                pe.identidad,
                pe.fdesde as faltaentidad,
                sl.idsituacionlaboralp,
                sl.idsituacion,
                sl.idtipocontrato,
                sl.fdesde,
                sl.fhasta,
                sl.idespcargo,
                date_part('day',sl.fhasta - now()) AS cantd,
                dp.idpersona,
                sl.ueb,
                sl.ueb as idueb,
                sl.idcargo,
                nc.denominacion AS cargo,
                dc.temporal,
                dcc.idcategocup AS idcategoria,
                ncateg.denominacion AS categoria,
                sl.noalta,
                sl.estado,
                CASE WHEN (sl.estado = 0 AND sl.fhasta < now()) THEN 1 ELSE 0 END AS vencido,
                sl.idarea as idarea,
                tc.denominacion as tipocontrato,
                ident.numero AS numid,
                tc.determinado,
                sl.principal,
                CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                    WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                    WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                    ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                    END AS nombreyapellidos,
                nfe.ordenunico AS orden
            FROM mod_persona.dat_situacionlaboral AS sl
            INNER JOIN mod_estructuracomp.nom_filaestruc AS nfe ON (sl.idcargo = nfe.idfila AND (nfe.fechafin IS NULL OR nfe.fechafin >= now()))
            INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (sl.idcargo = dc.idcargo AND dc.idproyecto = 0)
            INNER JOIN mod_estructuracomp.dat_cargocivil AS dcc ON (dc.idcargo = dcc.idcargo AND dcc.idproyecto = 0)
            INNER JOIN mod_estructuracomp.nom_categocup AS ncateg ON (dcc.idcategocup = ncateg.idcategocup)
            INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
            INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
            INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
            LEFT JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1 AND (ident.fhasta > now() OR ident.fhasta IS NULL))
            INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
            INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
            LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (pe.idprocedenciasocial = ps.idprocedenciasocial)
            WHERE dp.feliminado IS NULL ";

        if (count($cargos) > 0) {
            if (!empty($idconcepto)) {
                $sql .= " AND ((sl.idcargo is null AND pe.identidad = '$identidad')
                    OR sl.idcargo in (" . implode(',', $cargos) . "))";
            } else {
                $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
            }
        } else /* if (!empty($idconcepto)) */ {
            return;
//            $sql .= " AND pe.identidad = '$identidad'";
        }

        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
            or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%' or ns.denominacion ilike '%$filtro%' or tc.denominacion ilike '%$filtro%')";
        }
        if ($activo == 1) {
            $sql .= " AND (sl.estado = 0 OR sl.fhasta > now())";
        } else {
            if (!empty($fibaja)) {
                $sql .= " AND sl.fdesde >= '$fibaja'";
            }
            if (!empty($ffbaja)) {
                $sql .= " AND sl.fhasta <= '$ffbaja'";
            } else {
                $sql .= " AND sl.fhasta <= now()";
            }
            if (!empty($est)) {
                $sql .= " AND sl.estado = '$est'";
                if (!empty($mot)) {
                    $sql .= " AND sl.idmotivo = '$mot'";
                }
            } else {
                $sql .= " AND sl.estado != 0";
            }
        }
        $sql = $sql . " ORDER BY nfe.ordenunico, tc.determinado, sl.fdesde ASC) a WHERE TRUE $addWhereFiltros ";
        if (!empty($limite)) {
            $sql = $sql . " OFFSET $inicio LIMIT $limite ";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantSituacionByIdCargo(
            $filtro, $identidad, $cargos, $activo, $idconcepto, $fibaja, $ffbaja, $est, $mot
    ) {
        $sql = "SELECT
                sl.idsituacionlaboralp
                FROM mod_persona.dat_situacionlaboral AS sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad AS ident
                  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                WHERE dp.feliminado IS NULL";
        if (count($cargos) > 0) {
            if (!empty($idconcepto)) {
                $sql .= " AND ((sl.idcargo is null AND pe.identidad = '$identidad')
                    OR sl.idcargo in (" . implode(',', $cargos) . "))";
            } else {
                $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
            }
        } else /* if (!empty($idconcepto)) */ {
            return 0;
//            $sql .= " AND pe.identidad = '$identidad'";
        }

        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
            or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%' or ns.denominacion ilike '%$filtro%' or tc.denominacion ilike '%$filtro%')";
        }
        if ($activo == 1) {
            $sql .= " AND (sl.estado = 0 OR sl.fhasta > now())";
        } else {
            if (!empty($fibaja)) {
                $sql .= " AND sl.fdesde >= '$fibaja'";
            }
            if (!empty($ffbaja)) {
                $sql .= " AND sl.fhasta <= '$ffbaja'";
            } else {
                $sql .= " AND sl.fhasta <= now()";
            }
            if (!empty($est)) {
                $sql .= " AND sl.estado = '$est'";
                if (!empty($mot)) {
                    $sql .= " AND sl.idmotivo = '$mot'";
                }
            } else {
                $sql .= " AND sl.estado != 0";
            }
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function getPersonasSinSituacion($filtro, $start, $limit, $numid, $nombre, $papel, $sapel) {
        $sql = "SELECT
                dp.idpersona
              , sl.idcargo
              , ns.denominacion as situacion
              , ident.numero AS numid
              ,con.orden as orden
              , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                               WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                                THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                               WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                                THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                               ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                      END AS nombreyapellidos
              FROM mod_persona.dat_persona AS dp
              LEFT JOIN mod_persona.dat_docidentidad AS ident
                ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                  AND (ident.fhasta > now() OR ident.fhasta IS NULL))
              LEFT JOIN mod_persona.dat_personaentidad AS pe
                ON (dp.idpersona = pe.idpersona AND (pe.fhasta > now() OR pe.fhasta IS NULL))
              LEFT JOIN mod_persona.dat_situacionlaboral AS sl
                ON (pe.idpersonaentidad = sl.idpersonaentidad AND sl.principal = 1 AND sl.estado = 0
                  AND (sl.fhasta > now() OR sl.fhasta IS NULL))
              LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
              LEFT JOIN mod_estructuracomp.dat_estructura AS est ON (est.idestructura = dp.idestructura)
              LEFT JOIN mod_estructuracomp.nom_concepto AS con ON (con.idconcepto = est.idconcepto)
              WHERE dp.feliminado IS NULL AND sl.idsituacionlaboralp IS NULL";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%' or ns.denominacion ilike '%$filtro%')";
        }
        if ($numid) {
            $sql = $sql . " AND ident.numero ilike '%$numid%'";
        }
        if ($nombre) {
            $sql = $sql . " AND dp.nombre ilike '%$nombre%'";
        }
        if ($papel) {
            $sql = $sql . " AND dp.papel ilike '%$papel%'";
        }
        if ($sapel) {
            $sql = $sql . " AND dp.sapel ilike '%$sapel%'";
        }
        $sql = $sql . " OFFSET $start LIMIT $limit";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasSinSituacion($filtro, $numid, $nombre, $papel, $sapel) {
        $sql = "SELECT
                    dp.idpersona
                  FROM mod_persona.dat_persona AS dp
                  LEFT JOIN mod_persona.dat_docidentidad AS ident
                    ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                      AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                  LEFT JOIN mod_persona.dat_personaentidad AS pe
                    ON (dp.idpersona = pe.idpersona AND (pe.fhasta > now() OR pe.fhasta IS NULL))
                  LEFT JOIN mod_persona.dat_situacionlaboral AS sl
                    ON (pe.idpersonaentidad = sl.idpersonaentidad AND sl.principal = 1 AND sl.estado = 0
                      AND (sl.fhasta > now() OR sl.fhasta IS NULL))
                  LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                  WHERE dp.feliminado IS NULL AND sl.idsituacionlaboralp IS NULL";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%' or ns.denominacion ilike '%$filtro%')";
        }
        if ($numid) {
            $sql = $sql . " AND ident.numero ilike '%$numid%'";
        }
        if ($nombre) {
            $sql = $sql . " AND dp.nombre ilike '%$nombre%'";
        }
        if ($papel) {
            $sql = $sql . " AND dp.papel ilike '%$papel%'";
        }
        if ($sapel) {
            $sql = $sql . " AND dp.sapel ilike '%$sapel%'";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function getIdPlantillaByTipoContrato($idtipocontrato) {
        $sql = "SELECT pc.idplantilla
                FROM mod_fuerzatrabajo.nom_tipocontrato c
                INNER JOIN mod_fuerzatrabajo.dat_plantillatipocontrato pc ON (pc.idtipocontrato = c.idtipocontrato)
                WHERE pc.idtipocontrato = $idtipocontrato";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0]['idplantilla'];
    }

    public function deleteByIdPersonaEntidad($idpersonaentidad) {
        $query = Doctrine_Query::create()
                ->delete()
                ->from('DatSituacionlaboral sl')
                ->where("sl.idpersonaentidad = '$idpersonaentidad'");
        $query->execute();
    }

    public function existeConSitLaboralyEntidad($idpersona, $identidad, $idsituacion) {
        $query = Doctrine_Query::create()
                ->select("sl.idsituacionlaboralp, sl.idcargo, sl.idarea")
                ->from('DatSituacionlaboral sl')
                ->innerJoin('sl.DatPersonaentidad e')
                ->where(
                "sl.idsituacion = '$idsituacion' AND e.idpersona = '$idpersona' AND sl.estado = 0
                AND e.identidad = '$identidad' AND sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)"
        );
        return $query->execute()->toArray();
    }

    public function existeConOcupacionPrincipalEntidad($idpersona, $identidad) {
        $query = Doctrine_Query::create()
                ->select("sl.idsituacionlaboralp, sl.idcargo, sl.idarea")
                ->from('DatSituacionlaboral sl')
                ->innerJoin('sl.DatPersonaentidad e')
                ->where(
                "sl.principal = 1 AND e.idpersona = '$idpersona' AND sl.estado = 0
                AND e.identidad = '$identidad' AND sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)"
        );
        return $query->execute()->toArray();
    }

    public function obtenerCargoOficialPersona($idpersona, $principal) {
        $query = new Doctrine_Query();
        $result = $query->select('sl.*, pe.identidad as identidad, pe.idpersona as idpersona')
                ->from('DatSituacionlaboral sl')
                ->innerJoin('sl.DatPersonaentidad pe')
                ->where("pe.idpersona = ? and sl.principal = ? and sl.estado = ?", array($idpersona, $principal, 0))
                ->addWhere('sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getCantPersonaCargo($cargos, $determinado = 0) {
        $sql = "SELECT count(dsl.idsituacionlaboralp)
                FROM mod_persona.dat_situacionlaboral AS dsl
                INNER JOIN mod_persona.dat_personaentidad AS dpe 
                    ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc
                    ON (dsl.idtipocontrato = ntc.idtipocontrato)
                WHERE dp.feliminado IS NULL AND dsl.fdesde <= now() AND (dsl.fhasta > now() OR dsl.fhasta IS NULL)
                     AND (dpe.fhasta IS NULL OR dpe.fhasta > now())
                     AND dsl.estado = 0 AND dsl.idcargo in (" . implode(',', $cargos) . ")";
        if ($determinado == 1) {
            $sql .= " AND ntc.determinado = 1";
        } else if ($determinado == 0) {
            $sql .= " AND ntc.determinado = 0";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $res = $conn->fetchAll($sql);
        return $res[0]['count'];
    }

    public function getTrabajadoresPorCategoria($stringIdsCargos) {
        $sql = "SELECT  (SELECT nne.denominacion FROM mod_personaext.dat_niveleducacional AS dne 
                            INNER JOIN mod_personaext.nom_niveleducacional AS nne 
                                ON (nne.idniveleducacional = dne.idniveleducacional) 
                            WHERE dne.idpersona = dp.idpersona AND dne.fdesde = 
                                (SELECT MAX(dnie.fdesde) FROM mod_personaext.dat_niveleducacional AS dnie 
                                    WHERE dnie.idpersona = dp.idpersona) limit 1) AS niveleducacional,
	
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp
                         limit 1
                        )
                       ) as total,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND dp.sexo <> 1
                         limit 1
                        )
                       ) as totalmujer,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND ((date_part('year', age(dn.fechanacimiento)) > 65 AND dp.sexo = 1) 
                                    OR (date_part('year', age(dn.fechanacimiento)) > 60 AND dp.sexo <> 1))
                         limit 1
                        )
                       ) as mayoresedadlaboral,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND date_part('year', age(dn.fechanacimiento)) > 60 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as mayoresedadlaboralmujeres,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND date_part('year', age(dn.fechanacimiento)) < 17
                         limit 1
                        )
                       ) as menoresedadlaboral,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND date_part('year', age(dn.fechanacimiento)) < 17 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as menoresedadlaboralmujeres,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND mco.idcategoriareporte = 1
                         limit 1
                        )
                       ) as operarios,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND mco.idcategoriareporte = 1 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as operariosmujer,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 3
                         limit 1
                        )
                       ) as servicios,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND mco.idcategoriareporte = 3 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as serviciosmujer,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 4
                         limit 1
                        )
                       ) as tecnicos,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND mco.idcategoriareporte = 4 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as tecnicosmujer,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 2
                         limit 1
                        )
                       ) as administrativos,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND mco.idcategoriareporte = 2 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as administrativosmujer,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 5
                         limit 1
                        )
                       ) as directivos,
            SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                            where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                AND mco.idcategoriareporte = 5 AND dp.sexo <> 1
                         limit 1
                        )
                       ) as directivosmujer

            FROM mod_persona.dat_situacionlaboral AS sl

            INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
            INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
            LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)
            LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND idproyecto = 0)
            INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
            LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)

            WHERE (sl.idcargo IN ($stringIdsCargos) AND sl.estado = 0
                AND (sl.fhasta > now() OR sl.fhasta is null)) 

            GROUP BY niveleducacional";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getTrabajadoresPorCategoriaPorMunicipio($stringIdsCargos) {
        $sql = "SELECT (SELECT nom_dpt.denominacion
                    FROM 
                      mod_datosmaestros.nom_dpt, 
                      mod_datosmaestros.nom_nivelestructural, 
                      mod_datosmaestros.nom_conceptonivel
                    WHERE 
                      nom_dpt.idnivelestructural = nom_nivelestructural.idnivelestructural AND
                      nom_nivelestructural.idconceptonivel = nom_conceptonivel.idconceptonivel AND 
                      ordenizq <= (SELECT  ordenizq  FROM  mod_datosmaestros.nom_dpt WHERE iddpt= ndp.iddpt) AND 
                      ordender >=(SELECT  ordender  FROM  mod_datosmaestros.nom_dpt WHERE iddpt= ndp.iddpt) AND  
                      nom_conceptonivel.idconceptonivel= 14 LIMIT 1) as municipio,
                  
                (SELECT nom_dpt.codigo
                    FROM 
                      mod_datosmaestros.nom_dpt, 
                      mod_datosmaestros.nom_nivelestructural, 
                      mod_datosmaestros.nom_conceptonivel
                    WHERE 
                      nom_dpt.idnivelestructural = nom_nivelestructural.idnivelestructural AND
                      nom_nivelestructural.idconceptonivel = nom_conceptonivel.idconceptonivel AND 
                      ordenizq <= (SELECT  ordenizq  FROM  mod_datosmaestros.nom_dpt WHERE iddpt= ndp.iddpt) AND 
                      ordender >=(SELECT  ordender  FROM  mod_datosmaestros.nom_dpt WHERE iddpt= ndp.iddpt) AND  
                      nom_conceptonivel.idconceptonivel= 14 LIMIT 1) as codigodpa,

                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp
                             limit 1
                            )
                           ) as total,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND dp.sexo <> 1
                             limit 1
                            )
                           ) as totalmujer,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND ((date_part('year', age(dn.fechanacimiento)) > 65 AND dp.sexo = 1) 
                                        OR (date_part('year', age(dn.fechanacimiento)) > 60 AND dp.sexo <> 1))
                             limit 1
                            )
                           ) as mayoresedadlaboral,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND date_part('year', age(dn.fechanacimiento)) > 60 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as mayoresedadlaboralmujeres,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND date_part('year', age(dn.fechanacimiento)) < 17
                             limit 1
                            )
                           ) as menoresedadlaboral,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND date_part('year', age(dn.fechanacimiento)) < 17 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as menoresedadlaboralmujeres,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 1
                             limit 1
                            )
                           ) as operarios,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 1 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as operariosmujer,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 3
                             limit 1
                            )
                           ) as servicios,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 3 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as serviciosmujer,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 4
                             limit 1
                            )
                           ) as tecnicos,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 4 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as tecnicosmujer,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp AND mco.idcategoriareporte = 2
                             limit 1
                            )
                           ) as administrativos,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 2 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as administrativosmujer,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 5
                             limit 1
                            )
                           ) as directivos,
                SUM((select 1 from mod_persona.dat_situacionlaboral as dsl                     
                                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                                    AND mco.idcategoriareporte = 5 AND dp.sexo <> 1
                             limit 1
                            )
                           ) as directivosmujer

                FROM mod_persona.dat_situacionlaboral AS sl

                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)
                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)

                INNER JOIN mod_estructuracomp.dat_estructura AS es 
                    ON (es.idestructura = dpe.identidad AND es.idproyecto = 0)
                INNER JOIN mod_datosmaestros.nom_dpt AS ndp ON (ndp.iddpt = es.iddpt)

                INNER JOIN mod_datosmaestros.nom_nivelestructural AS nne 
                    ON (nne.idnivelestructural = ndp.idnivelestructural)
                INNER JOIN mod_datosmaestros.nom_conceptonivel AS ncn ON (ncn.idconceptonivel = nne.idconceptonivel)

                WHERE (sl.idcargo IN ($stringIdsCargos) AND sl.estado = 0
                    AND (sl.fhasta > now() OR sl.fhasta is null)) 

                GROUP BY municipio, ndp.iddpt";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /* public function getRegistroAltasBajas($cargos, $idconcepto, $fdesde, $fhasta, $altaobaja)
      {
      $sql = "SELECT
      sl.idsituacionlaboralp
      , pe.fdesde
      , pe.fhasta
      , pe.idpersonaentidad
      , sl.idarea
      , sl.noalta
      , sl.idcargo
      , sl.idmotivo
      , mb.denominacion as motivobaja
      , ps.denominacion as procedenciasocial
      , dp.idpersona
      , ident.numero AS numid
      , dptm.denominacion AS municipio
      , dptp.denominacion AS provincia
      , dd.direccion
      , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
      WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
      THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
      WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
      THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
      ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
      END AS nombreyapellidos
      FROM mod_persona.dat_situacionlaboral AS sl
      INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
      INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
      INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (tc.idtipocontrato = sl.idtipocontrato AND tc.determinado IN (0,1))
      LEFT JOIN mod_persona.dat_docidentidad AS ident
      ON (dp.idpersona = ident.idpersona AND ident.principal = 1
      AND (ident.fhasta > now() OR ident.fhasta IS NULL))
      LEFT JOIN mod_fuerzatrabajo.nom_motivobaja AS mb ON (mb.idmotivobaja = sl.idmotivo AND sl.estado = 2)
      LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (ps.idprocedenciasocial = pe.idprocedenciasocial)
      LEFT JOIN mod_persona.dat_direccion AS dd ON (dd.idpersona = dp.idpersona AND dd.oficial = 1 AND dd.fdesde <= now() AND (dd.fhasta > now() OR dd.fhasta IS NULL))
      LEFT JOIN mod_datosmaestros.nom_dpt AS dptm ON (dd.idmunicipio = dptm.iddpt)
      LEFT JOIN mod_datosmaestros.nom_dpt AS dptp ON (dd.idprovincia = dptp.iddpt)";

      if ($idconcepto == 1 || $idconcepto == 3 || $idconcepto == 4) {
      $sql .= " WHERE (sl.idcargo is null OR sl.idcargo in (" . implode(',', $cargos) . "))";//sl.estado = 0 AND OR sl.estado = 0
      } else {
      $sql .= " WHERE sl.idcargo in (" . implode(',', $cargos) . ")";
      }
      if ($altaobaja == 1) {//solo devolver altas
      if (!empty($fdesde)) {
      $sql .= " AND pe.fdesde >= '$fdesde'";
      }
      if (!empty($fhasta)) {
      $sql .= " AND pe.fdesde <= '$fhasta'";
      }
      if (empty($fdesde) && empty($fhasta)) {
      $sql .= " AND pe.fdesde <= now()";
      }
      $sql .= " AND (pe.fdesde = sl.fdesde AND sl.estado = 0 AND ps.denominacion IS NOT NULL)";

      } else if ($altaobaja == 2) {//solo devolver bajas
      if (!empty($fdesde)) {
      $sql .= " AND pe.fhasta >= '$fdesde'";
      }
      if (!empty($fhasta)) {
      $sql .= " AND pe.fhasta <= '$fhasta'";
      }
      if (empty($fdesde) && empty($fhasta)) {
      $sql .= " AND pe.fhasta <= now()";
      }
      $sql .= " AND (pe.fhasta = sl.fhasta AND sl.estado = 2 AND ps.denominacion IS NOT NULL)";
      }

      else if ($altaobaja == 3) {
      if(!empty($fdesde) && !empty($fhasta)){
      $sql .= " AND ((pe.fdesde >= '$fdesde' and pe.fdesde <= '$fhasta' ) /*and *//* OR (pe.fhasta >= '$fdesde' and pe.fhasta <= '$fhasta' and mb.denominacion is not null))";
      // }else if(!empty($fdesde) && empty($fhasta)){
      //     $sql .= " AND (pe.fdesde >= '$fdesde' OR pe.fhasta >= '$fdesde')";
      // }else if(empty($fdesde) && !empty($fhasta)){
      //     $sql .= " AND (pe.fhasta <= '$fhasta' OR pe.fdesde <= '$fhasta')";
      // }else if(empty($fdesde) && empty($fhasta)){
      //     $sql .= " AND (pe.fdesde <= now() OR pe.fhasta <= now())";
      }
      //$sql .= " and (sl.estado in (0,2))";

      //            if(!empty($fdesde)){
      //                $sql .= " AND (pe.fdesde >= '$fdesde' OR pe.fhasta >= '$fdesde')";
      //            }
      //            if(!empty($fhasta)){
      //                $sql .= " AND (pe.fhasta <= '$fhasta' OR pe.fdesde <= '$fhasta')";
      //            }
      //            $sql .= " and (sl.estado in (0,2))";
      }
      $dm = Doctrine_Manager::getInstance();
      $conn = $dm->getCurrentConnection();

      return $conn->fetchAll($sql);
      } */

//    public function getRegistroAltasBajas($cargos, $idconcepto, $fdesde, $fhasta, $altaobaja)
//    {
//        $sql = "SELECT
//            sl.idsituacionlaboralp
//          , pe.fdesde
//          , pe.fhasta
//          , pe.idpersonaentidad
//          , sl.idarea
//          , sl.noalta
//          , sl.idcargo
//          , sl.idmotivo
//          , mb.denominacion as motivobaja
//          , ps.denominacion as procedenciasocial
//          , dp.idpersona
//          , ident.numero AS numid
//          , dptm.denominacion AS municipio
//          , dptp.denominacion AS provincia
//          , dd.direccion
//          , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
//                           WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
//                            THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
//                           WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
//                            THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
//                           ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
//                  END AS nombreyapellidos
//          FROM mod_persona.dat_situacionlaboral AS sl
//          INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
//          INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
//          INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (tc.idtipocontrato = sl.idtipocontrato AND tc.determinado IN (0,1))
//          LEFT JOIN mod_persona.dat_docidentidad AS ident
//            ON (dp.idpersona = ident.idpersona AND ident.principal = 1
//              AND (ident.fhasta > now() OR ident.fhasta IS NULL))
//          LEFT JOIN mod_fuerzatrabajo.nom_motivobaja AS mb ON (mb.idmotivobaja = sl.idmotivo AND sl.estado = 2)
//          LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (ps.idprocedenciasocial = pe.idprocedenciasocial)
//          LEFT JOIN mod_persona.dat_direccion AS dd ON (dd.idpersona = dp.idpersona AND dd.oficial = 1 AND dd.fdesde <= now() AND (dd.fhasta > now() OR dd.fhasta IS NULL))
//          LEFT JOIN mod_datosmaestros.nom_dpt AS dptm ON (dd.idmunicipio = dptm.iddpt)
//          LEFT JOIN mod_datosmaestros.nom_dpt AS dptp ON (dd.idprovincia = dptp.iddpt)";
//
//        if ($idconcepto == 1 || $idconcepto == 3 || $idconcepto == 4) {
//            $sql .= " WHERE sl.estado = 0 OR sl.estado = 0 AND (sl.idcargo is null OR sl.idcargo in (" . implode(',', $cargos) . "))";
//        } else {
//            $sql .= " WHERE sl.idcargo in (" . implode(',', $cargos) . ")";
//        }
//        if ($altaobaja == 1) {//solo devolver altas
//            if (!empty($fdesde)) {
//                $sql .= " AND pe.fdesde >= '$fdesde'";
//            }
//            if (!empty($fhasta)) {
//                    $sql .= " AND pe.fdesde <= '$fhasta'";
//            }
//            if (empty($fdesde) && empty($fhasta)) {
//                $sql .= " AND pe.fdesde <= now()";
//            }
//            $sql .= " AND pe.fdesde = sl.fdesde";
//        } else if ($altaobaja == 2) {//solo devolver bajas
//            if (!empty($fdesde)) {
//                $sql .= " AND pe.fhasta >= '$fdesde'";
//            }
//            if (!empty($fhasta)) {
//                $sql .= " AND pe.fhasta <= '$fhasta'";
//            }
//            if (empty($fdesde) && empty($fhasta)) {
//                $sql .= " AND pe.fhasta <= now()";
//            }
//            $sql .= " AND pe.fhasta = sl.fhasta AND sl.estado = 2";
//        } else if (!empty($fdesde)) {
//            $sql .= " AND (pe.fdesde >= '$fdesde' OR pe.fhasta >= '$fdesde')";
//        } else if (!empty($fhasta)) {
//            $sql .= " AND (pe.fdesde <= '$fhasta' OR pe.fhasta <= '$fhasta')";
//        } else {
//            $sql .= " AND (pe.fdesde <= now() OR pe.fhasta <= now())";
//        }
//        $dm = Doctrine_Manager::getInstance();
//        $conn = $dm->getCurrentConnection();
//        return $conn->fetchAll($sql);
//    }+++

    public function getRegistroAltas($cargos, $idconcepto) {
        $sql = "SELECT
                    sl.idsituacionlaboralp
                  , sl.fdesde
                  , sl.fhasta
                  , sl.noalta
                  , sl.idcargo
                  , sl.idarea
                  , sl.ueb
                  , pe.identidad
                  , tc.determinado
                  , dp.idpersona
                  , ident.numero AS numid
                  , CASE WHEN dp.sexo = 0 THEN 'F' ELSE 'M' END AS denomsexo
                  , CASE WHEN dp.snombre is not null THEN dp.nombre||' '|| dp.snombre||' '|| dp.papel||' '|| dp.sapel
                  ELSE dp.nombre||' '|| dp.papel||' '|| dp.sapel END as nombreapellidos
                  FROM mod_persona.dat_situacionlaboral AS sl
                  INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                  INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                  LEFT JOIN mod_persona.dat_docidentidad AS ident
                    ON (dp.idpersona = ident.idpersona AND ident.idtipodocidentidad = 1
                    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                  LEFT JOIN mod_fuerzatrabajo.nom_motivobaja AS mb ON (mb.idmotivobaja = sl.idmotivo)
                  INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (tc.idtipocontrato = sl.idtipocontrato AND tc.determinado IN (0,1))
                  WHERE dp.feliminado IS NULL AND sl.estado = 0 AND sl.fdesde <= now() AND (now() <= sl.fhasta OR sl.fhasta is 
                  null)";

        if ($idconcepto == 1 || $idconcepto == 3 || $idconcepto == 4) {
            $sql .= " AND (sl.idcargo is null OR sl.idcargo in (" . implode(',', $cargos) . "))";
        } else {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function setEstadoCndidato($idcandidato) {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "UPDATE mod_seleccion.dat_candidato SET contratado = 1 WHERE idcandidato = $idcandidato";
        $conn->fetchAll($sql);
    }

    public function existePersonaCargoMismaNaturaleza($idpersona, $idcargo) {
        $sql = "SELECT sl.idcargo, sl.idarea
                FROM mod_persona.dat_situacionlaboral sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (sl.idcargo = dc.idcargo)
                INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dc.idnomcargo)
                WHERE (sl.fhasta is null OR sl.fhasta > now() AND sl.estado = 0) AND pe.idpersona = $idpersona
                  AND nc.idnomcargo IN (SELECT nc.idnomcargo
                    FROM  mod_estructuracomp.dat_cargo AS dc
                    INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dc.idnomcargo)
                    WHERE dc.idcargo = $idcargo)";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getTrayectoriaLaboralPersona($idpersona) {
        $query = new Doctrine_Query();
        $result = $query->select('sl.*, pe.identidad as identidad, pe.idpersona as idpersona')
                ->from('DatSituacionlaboral sl')
                ->innerJoin('sl.DatPersonaentidad pe')
                ->where("pe.idpersona = ?", $idpersona)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getAbrevNivelPrep($nivel) {
        $sql = "SELECT n.abreviatura as abreviatura FROM mod_estructuracomp.nom_preparacion AS n
                WHERE n.denominacion = '$nivel'";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0]['abreviatura'];
    }

    public function getSitLabByPersonaEntidad($idpersonaentidad) {
        $query = new Doctrine_Query();
        $result = $query->select('sl.*')
                ->from('DatSituacionlaboral sl')
                ->where("sl.idpersonaentidad = '$idpersonaentidad' AND sl.estado = 0 AND (now() < sl.fhasta OR sl.fhasta is null)")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getEspecializacionesByCargo($idcargo) {
        $sql = "SELECT h.idespcargo as id, h.* FROM mod_rrhhmaestro.conf_espcargo AS h
                INNER JOIN mod_estructuracomp.dat_cargo AS c ON (c.idnomcargo = h.idcargo)
                WHERE c.idcargo = $idcargo";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /**
     * @method getTotalPorSituacion - Devuelve el total de trabajadores por situación laboral dada una estructura.
     * @params $idestructura - Identificador de la estrutra.
     * @return Array - Arreglo con los totales de trabajadores por situación laboral.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getTotalPorSituacion($idestructura) {
        $sql = "SELECT 'Distribución de trabajadores por situación laboral' AS agrupador, 0 AS tipo,
          ns.denominacion AS indicador,
          count(dpe.idpersona) AS cantidad
          FROM mod_persona.dat_situacionlaboral AS dsl
          INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = dsl.idpersonaentidad)
          INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
          INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS ntc ON (dsl.idtipocontrato = ntc.idtipocontrato AND ntc.determinado IN (0,1))
          RIGHT JOIN mod_persona.nom_situacion AS ns ON (ns.idsituacion = dsl.idsituacion)
          WHERE dp.feliminado IS NULL AND dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > now())
          AND (dpe.fhasta IS NULL OR dpe.fhasta > now())";
        if (!empty($idestructura)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $idcargos = Array();
            foreach ($cargos as $key => $value) {
                array_push($idcargos, $value['idcargo']);
            }
            $sql .= " AND dsl.idcargo in (" . implode(',', $idcargos) . ")";
        }
        $sql = $sql . " GROUP BY ns.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /**
     * @method getTotalPorContrato - Devuelve el total de trabajadores por tipos de contrato dada una estructura.
     * @params $idestructura - Identificador de la estrutra.
     * @return Array - Arreglo con los totales de trabajadores por tipos de contrato.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getTotalPorContrato($idestructura) {
        $sql = "SELECT
          'Distribución de trabajadores por tipos de contrato' AS agrupador,
          nt.determinado AS tipo,
          nt.denominacion AS indicador,
          count(dpe.idpersona) AS cantidad
          FROM mod_persona.dat_situacionlaboral AS dsl
          INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = dsl.idpersonaentidad)
          INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona)
          RIGHT JOIN mod_fuerzatrabajo.nom_tipocontrato AS nt ON (nt.idtipocontrato = dsl.idtipocontrato)
          WHERE dp.feliminado IS NULL AND dsl.estado = 0 AND (dsl.fhasta IS NULL OR dsl.fhasta > now())
          AND (dpe.fhasta IS NULL OR dpe.fhasta > now())";
        if (!empty($idestructura)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $idcargos = Array();
            foreach ($cargos as $key => $value) {
                array_push($idcargos, $value['idcargo']);
            }
            $sql .= " AND dsl.idcargo in (" . implode(',', $idcargos) . ")";
        }
        $sql = $sql . " GROUP BY nt.denominacion, nt.determinado";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getSituacionLabPorPersonaEntidadCargos($idpersona, $rcargcomp) {
        $sql = "SELECT
                    dpe.idpersonaentidad,
                    dpe.identidad,
                    dsl.idarea,
                    dsl.idsituacionlaboralp,
                    dsl.idcargo,
                    dsl.fdesde,
                    dsl.fhasta,
                    nc.idnomcargo,
                    nc.denominacion
                FROM mod_persona.dat_personaentidad AS dpe
                INNER JOIN mod_persona.dat_situacionlaboral AS dsl
                    ON (dpe.idpersonaentidad = dsl.idpersonaentidad
                    AND dsl.estado = 0 AND (dsl.fhasta > now() OR dsl.fhasta IS NULL))
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (dsl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
                WHERE idpersona = $idpersona AND dsl.idcargo in ($rcargcomp)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getSituacionLabPorPersonaEntidad($identidad, $idpersona) {
        $sql = "SELECT
                    dpe.idpersonaentidad,
                    dpe.identidad,
                    dsl.idarea,
                    dsl.idsituacionlaboralp,
                    dsl.idcargo,
                    dsl.fdesde,
                    dsl.fhasta,
                    nc.idnomcargo,
                    nc.denominacion
                FROM mod_persona.dat_personaentidad AS dpe
                INNER JOIN mod_persona.dat_situacionlaboral AS dsl
                    ON (dpe.idpersonaentidad = dsl.idpersonaentidad
                    AND dsl.estado = 0 AND (dsl.fhasta > now() OR dsl.fhasta IS NULL))
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (dsl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
                WHERE idpersona = $idpersona";
        if (isset($identidad)) {
            $sql .= " AND identidad = $identidad";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getElaborado($identidad) {
        $sql = "SELECT cf.idpersona as idpersona, cf.idpersona, cf.elabora as elabora,
                CASE WHEN dp.snombre is not null THEN dp.nombre||' '|| dp.snombre||' '|| dp.papel||' '|| dp.sapel
                ELSE dp.nombre||' '|| dp.papel||' '|| dp.sapel END as nombreapellidos
                     FROM mod_rrhhmaestro.conf_firma as cf
                     	LEFT JOIN mod_persona.dat_persona AS dp ON (cf.idpersona = dp.idpersona)
                       WHERE cf.identidad = $identidad and cf.elabora=1";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getAprobado($identidad) {
        $sql = "SELECT cf.idpersona as idpersona, cf.idpersona, cf.aprueba as aprueba,
                CASE WHEN dp.snombre is not null THEN dp.nombre||' '|| dp.snombre||' '|| dp.papel||' '|| dp.sapel
                ELSE dp.nombre||' '|| dp.papel||' '|| dp.sapel END as nombreapellidos
                     FROM mod_rrhhmaestro.conf_firma as cf
                     	LEFT JOIN mod_persona.dat_persona AS dp ON (cf.idpersona = dp.idpersona)
                       WHERE cf.identidad = $identidad and cf.aprueba=1";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajas($id) {
        $sql = "SELECT m.*,e.denominacion as denom
                   FROM mod_persona.dat_situacionlaboral m
                   INNER JOIN mod_estructuracomp.dat_estructuraop AS e ON(m.idarea=e.idestructuraop)
                   WHERE estado=2 and m.idarea=$id";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajasportipo($id, $motivo) {
        $sql = "SELECT m.*,e.denominacion as denom
                   FROM mod_persona.dat_situacionlaboral m
                   INNER JOIN mod_estructuracomp.dat_estructuraop AS e ON(m.idarea=e.idestructuraop)
                   INNER JOIN mod_fuerzatrabajo.nom_motivobaja as mb on (m.idmotivo = mb.idmotivobaja)
                   WHERE estado=2 and m.idarea=$id and mb.idmotivobaja = $motivo";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajasportipoymes($mes, $motivo, $estructura) {
        $sql = " select count (sit.idsituacionlaboralp) as per
                    from
                    mod_persona.dat_persona as p
                    INNER JOIN mod_persona.dat_personaentidad as pe 
                        ON (pe.idpersona = p.idpersona and pe.fhasta is not null)
                    INNER JOIN mod_persona.dat_situacionlaboral as sit 
                        on (sit.idpersonaentidad = pe.idpersonaentidad)
                    INNER JOIN mod_fuerzatrabajo.nom_motivobaja as mb on (sit.idmotivo = mb.idmotivobaja)
                    where sit.estado = 2 and (select extract(month from pe.fhasta)) = $mes 
                        and mb.idmotivobaja = $motivo and pe.identidad = $estructura 
                        and (select extract(year from pe.fhasta)) = (select extract(year from now()::date))

                    group by pe.fhasta
                     ";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getContratosIndet($id) {
        $sql = "SELECT m.*,t.*
                   FROM mod_persona.dat_situacionlaboral m
                   INNER JOIN mod_estructuracomp.dat_estructuraop AS e ON(m.idarea=e.idestructuraop)
                   INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS t ON(m.idtipocontrato=t.idtipocontrato)
                   WHERE t.determinado=0 and m.idarea=$id ";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    static public function getContratosIndeterPorMeses($id, $mes, $anno) {
        $sql = "SELECT m.*,t.*
                FROM mod_persona.dat_situacionlaboral m
                INNER JOIN mod_estructuracomp.dat_estructuraop AS e ON(m.idarea=e.idestructuraop)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS t ON(m.idtipocontrato=t.idtipocontrato)
                WHERE  t.determinado=0 and m.idarea=$id 
                and extract(year from m.fdesde) = $anno
                and extract(month from m.fdesde)<$mes 
                and (m.fhasta is null or (extract(month from m.fhasta)>=$mes) and extract(year from m.fhasta) = $anno)";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getdenominacionmotivobajas() {
        $sql = " select mb.denominacion from mod_fuerzatrabajo.nom_motivobaja as mb";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajasporFecha($id, $mes, $ano) {
        $sql = "SELECT
        m.*,
              e.denominacion as denom,
              b.fluctuacion
       FROM mod_persona.dat_situacionlaboral m
            INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = m.idpersonaentidad and m.fhasta = dpe.fhasta)
            INNER JOIN mod_estructuracomp.dat_estructuraop AS e ON (m.idarea = e.idestructuraop)
            INNER JOIN mod_fuerzatrabajo.nom_motivobaja AS b ON (m.idmotivo = b.idmotivobaja)
         WHERE m.idarea = $id and
          extract(year from m.fhasta)= $ano ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajasTodas($id, $mes, $ano) {
        $sql = "SELECT m.*,e.denominacion as denom,b.fluctuacion
                   FROM mod_persona.dat_situacionlaboral m
                   INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersonaentidad = m.idpersonaentidad and m.fhasta = dpe.fhasta)
                   INNER JOIN mod_estructuracomp.dat_estructuraop AS e ON(m.idarea=e.idestructuraop)
                   INNER JOIN mod_fuerzatrabajo.nom_motivobaja AS b ON(m.idmotivo=b.idmotivobaja)
                   WHERE estado=2 and m.idarea=$id and /*extract(month from m.fhasta)<$mes and*/
                   extract(year from m.fhasta)=$ano";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getSitConProblemas($entidades) {
        $condentidad = '';
        if (count($entidades) > 0) {
            $condentidad = " AND sl.idarea in (" . implode(',', $entidades) . ")";
        }
        //print_r($condentidad);die;
        $sql = "(with areas_activas as (select * from mod_estructuracomp.v_get_estructuras)
	, cargos_activos as (select * from mod_estructuracomp.v_get_cargos)
SELECT
                    ns.denominacion as situacion
                  , 'Persona eliminada' as problema
                  , pe.identidad
                  , sl.idsituacionlaboralp
                  , sl.idtipocontrato
                  , sl.fdesde
                  , sl.fhasta
                  , dp.idpersona
                  , sl.idcargo
                  , dcg.denominacion as cargo
                  , sl.idarea as idarea
				  , aact.denominacion as area
                  , tc.denominacion as tipocontrato
                  , ident.numero AS numid
                  , concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) AS nombreyapellidos
                  FROM mod_persona.dat_situacionlaboral AS sl
                  INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                  INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                  INNER JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1)
                  INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                  INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                  LEFT JOIN cargos_activos as dcg on (sl.idcargo = dcg.idcargo)
                  LEFT JOIN areas_activas as aact on (sl.idarea = aact.idestructura)
				  WHERE dp.feliminado is not null AND sl.estado = 0 
                    AND (sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null))
				 	".$condentidad.")
                  UNION
(
with  areas_activas as (select * from mod_estructuracomp.v_get_estructuras)
	, areas_eliminadas as (select * from mod_estructuracomp.v_get_estructuras_eliminadas)
	, cargos_activos as (select * from mod_estructuracomp.v_get_cargos)
    , cargos_eliminados as (select * from mod_estructuracomp.v_get_cargos_eliminados)
SELECT
                    ns.denominacion as situacion
                  , 'Área eliminada de la estructura' as problema
                  , pe.identidad
                  , sl.idsituacionlaboralp
                  , sl.idtipocontrato
                  , sl.fdesde
                  , sl.fhasta
                  , dp.idpersona
                  , sl.idcargo
                  , CASE WHEN (dcg.denominacion IS NULL) THEN celim.denominacion ELSE dcg.denominacion END as cargo
                  , sl.idarea as idarea
				  , aelim.denominacion as area
                  , tc.denominacion as tipocontrato
                  , ident.numero AS numid
                  , concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) AS nombreyapellidos
                FROM mod_persona.dat_situacionlaboral AS sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                INNER JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1)
                INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                INNER JOIN areas_eliminadas as aelim ON (sl.idarea = aelim.idestructura)
                LEFT JOIN cargos_activos as dcg on (sl.idcargo = dcg.idcargo)
                LEFT JOIN cargos_eliminados as celim on (sl.idcargo = celim.idcargo)
				LEFT JOIN areas_activas as aact on (sl.idarea = aact.idestructura)
				WHERE (sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)) 
					AND aact.idestructura is null
".$condentidad.") 
                UNION
(
with areas_activas as (select * from mod_estructuracomp.v_get_estructuras)
	, areas_eliminadas as (select * from mod_estructuracomp.v_get_estructuras_eliminadas)
	, cargos_activos as (select * from mod_estructuracomp.v_get_cargos)
    , cargos_eliminados as (select * from mod_estructuracomp.v_get_cargos_eliminados)
SELECT
                 	ns.denominacion as situacion
                    , 'Cargo eliminado' as problema
                    , pe.identidad
                    , sl.idsituacionlaboralp
                    , sl.idtipocontrato
                    , sl.fdesde
                    , sl.fhasta
                    , dp.idpersona
                    , sl.idcargo
                    , celim.denominacion as cargo
                    , sl.idarea as idarea
					, CASE WHEN (aact.denominacion IS NULL) THEN aelim.denominacion ELSE aact.denominacion END as area
                    , tc.denominacion as tipocontrato
                    , ident.numero AS numid
                    , concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) AS nombreyapellidos
                FROM mod_persona.dat_situacionlaboral AS sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                INNER JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1)
                INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                INNER JOIN cargos_eliminados as celim ON (sl.idcargo=celim.idcargo)
                LEFT JOIN areas_eliminadas as aelim ON (sl.idarea = aelim.idestructura)
                LEFT JOIN cargos_activos as dcg on (sl.idcargo = dcg.idcargo)
 				LEFT JOIN areas_activas as aact on (sl.idarea = aact.idestructura)
				WHERE sl.estado = 0 
					AND (sl.fdesde <= now()::date AND (sl.fhasta > now()::date OR sl.fhasta is null)) 
                	AND dcg.idcargo IS NULL
".$condentidad.")
                UNION
(
with areas_activas as (select * from mod_estructuracomp.v_get_estructuras)
	, cargos_activos as (select * from mod_estructuracomp.v_get_cargos)
SELECT
                      ns.denominacion as situacion
                    , 'Entidad eliminada' as problema
                    , pe.identidad
                    , sl.idsituacionlaboralp
                    , sl.idtipocontrato
                    , sl.fdesde
                    , sl.fhasta
                    , dp.idpersona
                    , sl.idcargo
                    , dcg.denominacion as cargo
                    , sl.idarea as idarea
					, aact.denominacion as area
                    , tc.denominacion as tipocontrato
                    , ident.numero AS numid
                    , concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) AS nombreyapellidos
                FROM mod_persona.dat_situacionlaboral AS sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                INNER JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1)
                INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                LEFT JOIN cargos_activos as dcg on (sl.idcargo = dcg.idcargo)
				LEFT JOIN areas_activas as aact on (pe.identidad = aact.idestructura)
                WHERE sl.estado = 0
					AND (sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)) 
                	AND aact.idestructura IS NULL
".$condentidad.")
                UNION
(with areas_activas as (select * from mod_estructuracomp.v_get_estructuras)
	, cargos_activos as (select * from mod_estructuracomp.v_get_cargos)
SELECT
                 ns.denominacion as situacion
                    , 'Plantilla superada ' 
						||'(Cargos Disponibles: '||dcg.cantidad
						||' / Ocupados: ' ||dcg.cantidadreal
						||'). Solución: Actualizar completamiento de la plantilla.' as problema
                    , pe.identidad
                    , sl.idsituacionlaboralp
                    , sl.idtipocontrato
                    , sl.fdesde
                    , sl.fhasta
                    , dp.idpersona
                    , sl.idcargo
					, dcg.denominacion as cargo
                    , sl.idarea as idarea
					, aact.denominacion as area
                    , tc.denominacion as tipocontrato
                    , ident.numero AS numid
                    , concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) AS nombreyapellidos
                FROM mod_persona.dat_situacionlaboral AS sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                INNER JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1)
                INNER JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato and tc.determinado = 0)
				INNER JOIN cargos_activos as dcg on (sl.idcargo = dcg.idcargo)
 				INNER JOIN areas_activas as aact on (sl.idarea = aact.idestructura)
                WHERE (sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)) 
                	AND sl.estado = 0 
                    AND dcg.cantidadreal > dcg.cantidad
".$condentidad.")";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getTotaltrabajadores($idarea, $fdesde) {
        $sql = " SELECT count(pe.idpersona)
                  FROM mod_persona.dat_personaentidad AS pe
                  INNER JOIN mod_persona.dat_situacionlaboral AS sl USING (idpersonaentidad)
                  WHERE (
                         sl.estado = 0
                         AND
                         sl.idarea=$idarea
                         AND
                         (pe.fdesde<=cast('$fdesde' as date))
                         AND
                         ((pe.fhasta IS NULL) OR (pe.fhasta >cast('$fdesde' as date)))
                         )
                         AND
                         (sl.idtipocontrato=2)
                         AND
                         (
                   (sl.fdesde <=cast('$fdesde' as date) AND sl.fhasta IS NULL)
                    OR
                   (sl.fdesde <=cast('$fdesde' as date) AND sl.fhasta >cast('$fdesde' as date))
                      );";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCantAltasByMes($finicio, $ffin, $cargos) {
        $sql = "SELECT count(pe.idpersonaentidad) AS cant, date_part('month',pe.fdesde) AS mes
                , date_part('year',pe.fdesde) AS year
                FROM mod_persona.dat_personaentidad pe
                INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND pe.fdesde = sl.fdesde)";

        if (!empty($finicio) && !empty($ffin)) {
            $sql = $sql . " WHERE '$finicio' <= pe.fdesde AND '$ffin' >= pe.fdesde";
        } else {
            $sql = $sql . " WHERE date_part('year',pe.fdesde) = date_part('year',now())";
        }
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $sql = $sql . ' GROUP BY year, mes ORDER BY year, mes';

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getAltasByMes($finicio, $ffin, $cargos) {
        $sql = "SELECT
                 ns.denominacion as situacion
                 , sl.idsituacionlaboralp, sl.fdesde
                 , sl.fdesde
                 , sl.fhasta
                 , sl.idarea
                 , sl.idcargo
                 , sl.idmotivo
                 , mb.denominacion as motivobaja
                 ,(select dop.denominacion from mod_estructuracomp.dat_estructuraop dop WHERE dop.idestructuraop = sl.idarea limit 1) as denomarea
                 ,(select de.denominacion from mod_estructuracomp.dat_estructura de WHERE de.idestructura = pe.identidad limit 1) as denomentidad
                 ,(select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = sl.idcargo limit 1) as ordenunico       
                 , tc.denominacion as tipocontrato
                 , nc.denominacion as cargo  /*se quito el alias a la variable cargo ... Dayana*/
                 , ns.denominacion as motivo
                 , dp.idpersona
                 , ident.numero AS numid
                 , date_part('month',sl.fdesde) AS mes
                 , date_part('year',sl.fdesde) AS year
                 , date_part('month',sl.fdesde) || '/' || date_part('year',sl.fdesde) as m_a
                 , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                       WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                        THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                       WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                        THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                       ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                        END AS nombreyapellidos
                 , ps.denominacion as procedenciasocial
                 , dd.direccion
                 , dptm.denominacion AS municipio
                 , dptp.denominacion AS provincia
                     FROM mod_persona.dat_personaentidad AS pe
                     LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (pe.idprocedenciasocial = ps.idprocedenciasocial)
                     INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND pe.fdesde = sl.fdesde)
                     LEFT JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                     INNER JOIN mod_estructuracomp.dat_cargo dc ON (sl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                     INNER JOIN mod_estructuracomp.nom_cargo nc ON (dc.idnomcargo = nc.idnomcargo)
                     LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                     LEFT JOIN mod_persona.dat_direccion AS dd ON (dd.idpersona = dp.idpersona AND dd.oficial = 1 AND dd.fdesde <= now() AND (dd.fhasta > now() OR dd.fhasta IS NULL))
                     LEFT JOIN mod_datosmaestros.nom_dpt AS dptm ON (dd.idmunicipio = dptm.iddpt)
                     LEFT JOIN mod_datosmaestros.nom_dpt AS dptp ON (dd.idprovincia = dptp.iddpt)
                     LEFT JOIN mod_fuerzatrabajo.nom_motivobaja AS mb ON (mb.idmotivobaja = sl.idmotivo AND sl.estado = 2)
                     LEFT JOIN mod_persona.dat_docidentidad AS ident
                       ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                         AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                     LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)";

        if (!empty($finicio) && !empty($ffin)) {
            $sql = $sql . " WHERE '$finicio' <= sl.fdesde AND '$ffin' >= sl.fdesde";
        } else {
            $sql = $sql . " WHERE date_part('year',sl.fdesde) = date_part('year',now())";
        }
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $sql = $sql . ' ORDER BY ordenunico ASC, year, mes DESC'; //print_r($sql);die;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getBajasByMes($finicio, $ffin, $cargos) {
        $sql = "SELECT
                 ns.denominacion as situacion
                 , sl.idsituacionlaboralp, sl.fdesde
                 , sl.fhasta
                 , sl.idarea
                 , sl.idcargo
                 , sl.idmotivo
                 , mb.denominacion as motivobaja
                 ,(select dop.denominacion from mod_estructuracomp.dat_estructuraop dop WHERE dop.idestructuraop = sl.idarea limit 1) as denomarea
                 ,(select de.denominacion from mod_estructuracomp.dat_estructura de WHERE de.idestructura = pe.identidad limit 1) as denomentidad
                 ,(select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = sl.idcargo limit 1) as ordenunico       
                 , tc.denominacion as tipocontrato
                 , dmb.denominacion as motivo
                 , nc.denominacion as cargo
                 , dp.idpersona
                 , ident.numero AS numid
                 , date_part('month',sl.fhasta) AS mes
                 , date_part('year',sl.fhasta) AS year
                 , date_part('month',sl.fhasta) || '/' || date_part('year',sl.fdesde) as m_a
                 , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                       WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                        THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                       WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                        THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                       ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
              END AS nombreyapellidos
                 , ps.denominacion as procedenciasocial
                 , dd.direccion
                 , dptm.denominacion AS municipio
                 , dptp.denominacion AS provincia
                     FROM mod_persona.dat_personaentidad AS pe
                     LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps ON (pe.idprocedenciasocial = ps.idprocedenciasocial)
                     INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
                     INNER JOIN mod_estructuracomp.dat_cargo dc ON (sl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                     INNER JOIN mod_estructuracomp.nom_cargo nc ON (dc.idnomcargo = nc.idnomcargo)
                     LEFT JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                     LEFT JOIN mod_fuerzatrabajo.nom_motivobaja dmb ON (sl.idmotivo = dmb.idmotivobaja)
                     LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                     LEFT JOIN mod_persona.dat_direccion AS dd ON (dd.idpersona = dp.idpersona AND dd.oficial = 1 AND dd.fdesde <= now() AND (dd.fhasta > now() OR dd.fhasta IS NULL))
                     LEFT JOIN mod_datosmaestros.nom_dpt AS dptm ON (dd.idmunicipio = dptm.iddpt)
                     LEFT JOIN mod_datosmaestros.nom_dpt AS dptp ON (dd.idprovincia = dptp.iddpt)
                     LEFT JOIN mod_fuerzatrabajo.nom_motivobaja AS mb ON (mb.idmotivobaja = sl.idmotivo AND sl.estado = 2)
                     LEFT JOIN mod_persona.dat_docidentidad AS ident
                       ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                         AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                     LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion) 
                     WHERE sl.estado = 2 AND sl.fhasta = pe.fhasta";

        if (!empty($finicio) && !empty($ffin)) {
            $sql = $sql . " AND '$finicio' <= sl.fhasta AND '$ffin' >= sl.fhasta";
        } else {
            $sql = $sql . " AND date_part('year',sl.fhasta) = date_part('year',now()) AND sl.fhasta <= now()";
        }
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $sql = $sql . ' ORDER BY ordenunico ASC, year, mes DESC';
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getMovByMes($finicio, $ffin, $cargos) {
        $sql = "SELECT
                    ns.denominacion as situacion
                  , sl.idsituacionlaboralp, sl.fdesde
                  , sl.fhasta
                  , sl.idarea
                  ,(select dop.denominacion from mod_estructuracomp.dat_estructuraop dop WHERE dop.idestructuraop = sl.idarea limit 1) as denomarea
                  ,(select de.denominacion from mod_estructuracomp.dat_estructura de WHERE de.idestructura = pe.identidad limit 1) as denomentidad
                  ,(select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = sl.idcargo limit 1) as ordenunico       
                  , tc.denominacion as tipocontrato
                  , dmm.denominacion as motivo
                  , nc.denominacion as cargo
                  , dp.idpersona
                  , ident.numero AS numid
                  , date_part('month',sl.fhasta) AS mes
                  , date_part('year',sl.fhasta) AS year
                  , date_part('month',sl.fhasta) || '/' || date_part('year',sl.fdesde) as m_a
                  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                                   WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                                    THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                                   WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                                    THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                                   ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
                          END AS nombreyapellidos
                  FROM mod_persona.dat_situacionlaboral AS sl
                  INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
                  LEFT JOIN mod_fuerzatrabajo.nom_motivomovimiento dmm ON (sl.idmotivo = dmm.idmotivomovimiento)
                  INNER JOIN mod_estructuracomp.dat_cargo dc ON (sl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                  INNER JOIN mod_estructuracomp.nom_cargo nc ON (dc.idnomcargo = nc.idnomcargo)
                  INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                  LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                  LEFT JOIN mod_persona.dat_docidentidad AS ident
                    ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                      AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                  LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion) WHERE sl.estado = 1";

        if (!empty($finicio) && !empty($ffin)) {
            $sql = $sql . " AND '$finicio' <= sl.fhasta AND '$ffin' >= sl.fhasta";
        } else {
            $sql = $sql . " AND date_part('year',sl.fhasta) = date_part('year',now()) AND sl.fhasta <= now()";
        }
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $sql = $sql . ' ORDER BY ordenunico ASC, year, mes DESC';
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCantBajasByMes($finicio, $ffin, $cargos) {
        $sql = "SELECT count(idsituacionlaboralp) AS cant, date_part('month',sl.fhasta) AS mes
                  , date_part('year',sl.fhasta) AS year
                FROM mod_persona.dat_situacionlaboral sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                WHERE sl.estado = 2 AND sl.fhasta = pe.fhasta";
        if (!empty($finicio) && !empty($ffin)) {
            $sql = $sql . " AND '$finicio' <= sl.fhasta AND '$ffin' >= sl.fhasta";
        } else {
            $sql = $sql . " AND date_part('year',sl.fhasta) = date_part('year',now()) AND sl.fhasta <= now()";
        }
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $sql = $sql . ' GROUP BY year, mes ORDER BY year, mes';
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCantMovByMes($finicio, $ffin, $cargos) {
        $sql = "SELECT count(idsituacionlaboralp) AS cant, date_part('month',sl.fhasta) AS mes
                , date_part('year',sl.fhasta) AS year
                FROM mod_persona.dat_situacionlaboral sl
                WHERE sl.estado = 1";
        if (!empty($finicio) && !empty($ffin)) {
            $sql = $sql . " AND '$finicio' <= sl.fhasta AND '$ffin' >= sl.fhasta";
        } else {
            $sql = $sql . " AND date_part('year',sl.fhasta) = date_part('year',now()) AND sl.fhasta <= now()";
        }
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $sql = $sql . ' GROUP BY year, mes ORDER BY year, mes';
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function updateUEB($ueb, $idscargo) {
        if (!empty($ueb)) {
            $sql = "UPDATE mod_persona.dat_situacionlaboral 
                    SET ueb = $ueb WHERE (idcargo IN (" . implode(',', $idscargo) . "))";
        } else {
            $sql = "UPDATE mod_persona.dat_situacionlaboral 
                    SET ueb = null WHERE (idcargo IN (" . implode(',', $idscargo) . "))";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->execute($sql);
    }

    public function deleteSL($idsituacionlaboralp) {
        $sql = "DELETE FROM mod_persona.dat_situacionlaboral sl WHERE sl.idsituacionlaboralp = '$idsituacionlaboralp'";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->execute($sql);
    }

    public function getCatOcup($cuadro) {
        $sql = "SELECT *
                FROM mod_estructuracomp.nom_categocup";
        if ($cuadro == 1) {
            $sql = "SELECT idcategocup
                FROM mod_rrhhmaestro.conf_mapeocategocup
                WHERE idcategoriareporte = 5";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getReportCuad($cargos, $idscategocup, $decisorios, $idfacultado, $finicio, $ffin, $act) {
        if ($act == 1) {
            $inc = "date_part('year',age(dsl.fdesde)) AS tiempoa,date_part('month',age(dsl.fdesde)) AS tiempom";
        } else {
            $inc = "date_part('year',age(dsl.fhasta, dsl.fdesde)) AS tiempoa,date_part('month',age(dsl.fhasta, dsl.fdesde)) AS tiempom";
        }
        $sql = "SELECT dsl.fdesde as fnombr, dsl.fhasta as fmov, dsl.idarea, dc.decisorio,
        nc.denominacion as cargo, nco.denominacion as categocup, nco.abreviatura as coabrev, dc.cantidadreal,
        ncp.denominacion as colorpiel, ddn.fechanacimiento, dsl.idcargo, ident.numero AS numid,
        date_part('year',age(ddn.fechanacimiento)) AS edad, ncf.denominacion as facultado," . $inc . ",
        CASE WHEN dp.sexo = 0 THEN 'F' ELSE 'M' END AS sexo, dp.idpersona, dc.cantidad, dsl.noalta,
        CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN  dp.nombre || ' ' || dp.papel
        WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
        THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
        WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
        THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
        ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
        END AS nombreyapellidos, dmm.denominacion as mm, dmb.denominacion as mb
        FROM mod_persona.dat_situacionlaboral dsl
        INNER JOIN mod_estructuracomp.dat_cargo dc ON (dsl.idcargo = dc.idcargo AND dc.idproyecto = 0)
        INNER JOIN mod_estructuracomp.nom_cargo nc ON (dc.idnomcargo = nc.idnomcargo)
        INNER JOIN mod_estructuracomp.dat_cargocivil dcc ON (dc.idcargo = dcc.idcargo AND dcc.idproyecto = 0)
        INNER JOIN mod_estructuracomp.nom_categocup nco ON (dcc.idcategocup = nco.idcategocup)
        INNER JOIN mod_estructuracomp.nom_cargo ncf ON (dc.idfacultado = ncf.idnomcargo)
        INNER JOIN mod_persona.dat_personaentidad dpe ON (dsl.idpersonaentidad = dpe.idpersonaentidad)
        INNER JOIN mod_persona.dat_persona dp ON (dpe.idpersona = dp.idpersona)
        LEFT JOIN mod_persona.dat_fenotipo df ON (dp.idpersona = df.idpersona)
        LEFT JOIN mod_persona.nom_colorpiel ncp ON (df.idcolorpiel = ncp.idcolorpiel)
        LEFT JOIN mod_persona.dat_datosnacimiento ddn ON (dp.idpersona = ddn.idpersona)
        LEFT JOIN mod_fuerzatrabajo.nom_motivomovimiento dmm ON (dsl.idmotivo = dmm.idmotivomovimiento)
        LEFT JOIN mod_fuerzatrabajo.nom_motivobaja dmb ON (dsl.idmotivo = dmb.idmotivobaja)
		LEFT JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                      AND (ident.fhasta > now() OR ident.fhasta IS NULL))";
        if ($act == 1) {
            $sql = $sql . " WHERE dsl.estado = 0 AND dsl.fhasta IS NULL";
        } else {
            $sql = $sql . " WHERE dsl.estado <> 0";
        }
        if (count($cargos) > 0) {
            $sql .= " AND dsl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if (!empty($finicio)) {
            $sql = $sql . " AND '$finicio' <= dsl.fdesde";
        }
        if (!empty($ffin)) {
            $sql = $sql . " AND '$ffin' >= dsl.fhasta";
        } else if ($act != 1) {
            $sql .= " AND dsl.fhasta < now()";
        }
        if (count($idscategocup) > 0) {
            $sql = $sql . " AND dcc.idcategocup in (" . implode(',', $idscategocup) . ")";
        }
        if (!empty($decisorios)) {
            $sql = $sql . " AND dc.decisorio = '$decisorios'";
        }
        if (!empty($idfacultado)) {
            $sql = $sql . " AND dc.idfacultado = '$idfacultado'";
        }
        $sql = $sql . ' ORDER BY idarea';
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCargosFacultados() {
        /* $sql = "SELECT DISTINCT nc.idnomcargo AS idcargo, 
          nc.denominacion as denominacion
          FROM mod_estructuracomp.nom_cargo AS nc
          WHERE nc.facultado = 1"; */
        $sql = "SELECT idcargofacultado AS idcargo, denominacion FROM mod_estructuracomp.nom_cargofacultado";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function getSituacionByPersonaEntidad($idpersona, $idsCargos) {
        $sql = "SELECT
                sl.idcargo
              , nc.denominacion
              FROM mod_persona.dat_situacionlaboral AS sl
              INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)	
              INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (sl.idcargo = dc.idcargo)
              INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)			
              WHERE pe.idpersona = $idpersona AND (sl.estado = 0 OR (sl.estado = 2 AND sl.fhasta > now()))
                AND sl.idcargo IN (" . implode(',', $idsCargos) . ")";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerPersonasActivas($filtro, $start, $limit, $numid, $nombre, $papel, $sapel, $encargo) {
        $sql = "SELECT DISTINCT
				  dp.idpersona, sl.idsituacionlaboralp
				, sl.idcargo
				, sl.idarea
				, sl.fdesde
				, sl.fhasta
				, pe.identidad
				, ns.denominacion as situacion
				, tc.denominacion as tipocontrato
				, ident.numero AS numid
				, pe.idprocedenciasocial
				, con.orden as orden
				, ps.denominacion as procedencia
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_persona.dat_persona AS dp
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_personaentidad AS pe
				  ON (dp.idpersona = pe.idpersona AND (pe.fhasta > now() OR pe.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_situacionlaboral AS sl
				  ON (pe.idpersonaentidad = sl.idpersonaentidad AND sl.principal = 1
				    AND (sl.fhasta > now() OR sl.fhasta IS NULL))
				LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
				LEFT JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (sl.idtipocontrato = tc.idtipocontrato)
				LEFT JOIN mod_fuerzatrabajo.nom_procedenciasocial AS ps  ON (pe.idprocedenciasocial = ps.idprocedenciasocial)
				LEFT JOIN mod_estructuracomp.dat_estructura AS est ON (est.idestructura = dp.idestructura)
				LEFT JOIN mod_estructuracomp.nom_concepto AS con ON (con.idconcepto = est.idconcepto)
				WHERE dp.feliminado is null";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%' or ns.denominacion ilike '%$filtro%')";
        }
        if ($numid) {
            $sql = $sql . " AND ident.numero ilike '%$numid%'";
        }
        if ($nombre) {
            $sql = $sql . " AND dp.nombre ilike '%$nombre%'";
        }
        if ($papel) {
            $sql = $sql . " AND dp.papel ilike '%$papel%'";
        }
        if ($sapel) {
            $sql = $sql . " AND dp.sapel ilike '%$sapel%'";
        }
        if ($encargo == 1) {
            $sql = $sql . " AND sl.idsituacionlaboralp IS NOT NULL";
        }
        $sql = $sql . " ORDER BY sl.idarea OFFSET $start LIMIT $limit";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasActivas($filtro, $numid, $nombre, $papel, $sapel, $encargo) {
        $sql = "SELECT
				  dp.idpersona, sl.idsituacionlaboralp
				FROM mod_persona.dat_persona AS dp
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_personaentidad AS pe
				  ON (dp.idpersona = pe.idpersona AND (pe.fhasta > now() OR pe.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_situacionlaboral AS sl
				  ON (pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0 AND (sl.fhasta > now() OR sl.fhasta IS NULL))
				LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
				WHERE dp.feliminado is null";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%' or ns.denominacion ilike '%$filtro%')";
        }
        if ($numid) {
            $sql = $sql . " AND ident.numero ilike '%$numid%'";
        }
        if ($nombre) {
            $sql = $sql . " AND dp.nombre ilike '%$nombre%'";
        }
        if ($papel) {
            $sql = $sql . " AND dp.papel ilike '%$papel%'";
        }
        if ($sapel) {
            $sql = $sql . " AND dp.sapel ilike '%$sapel%'";
        }
        if ($encargo == 1) {
            $sql = $sql . " AND sl.idsituacionlaboralp IS NOT NULL";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function getSituacioneslabDesactualizadas($cargos) {
        $sql = "with max_cambio as ( 
                select 
                max(idcambiosescalaspersonacargoconceptospd) as idcambiosescalaspersonacargoconceptospd, idpersona, idcargo
                    from mod_nomina.dat_cambiosescalaspersonacargoconceptospd group by idpersona, idcargo)

                SELECT sl.idsituacionlaboralp, pe.identidad, pe.idpersona, sl.fhasta, sl.ueb, sl.idcargo, dmn.*
                FROM mod_persona.dat_situacionlaboral AS sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                inner join max_cambio as mc on (mc.idpersona = pe.idpersona)
                INNER JOIN mod_fuerzatrabajo.dat_movnomina AS dmn ON (sl.idsituacionlaboralp = dmn.idsituacionlaboralactual)            
                WHERE 
                sl.estado = 0 
                AND sl.idcargo = mc.idcargo";
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getNivelPreparacionByCargo($idcargo) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT np.*
                FROM mod_estructuracomp.dat_cargo dc
                INNER JOIN mod_estructuracomp.nom_preparacion AS np ON (np.idpreparacion = dc.idpreparacion)
                WHERE dc.idcargo = $idcargo";
        return $conn->fetchAll($sql);
    }

}
