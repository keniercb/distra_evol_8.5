<?php

class DatAsistencia extends BaseDatAsistencia
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomCausa', array('local' => 'idcausa', 'foreign' => 'idcausa'));
        $this->hasOne('DatEstructuraasistencia', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatRegimentrabajo', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomTurnotrabajo', array('local' => 'idturnotrabajo', 'foreign' => 'idturnotrabajo'));
        $this->hasMany('DatAsistenciasesion', array('local' => 'idasistencia', 'foreign' => 'idasistencia'));
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatAsistencia')->execute();
        return $result->toArray();
    }

    public function Insert($arrDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        // Usar ON CONFLICT DO NOTHING para evitar excepción cuando ya existe registro
        // único sobre (idpersona, fecharegistro) (índice: dat_asistencia_idx)
        $sql = "INSERT INTO mod_regimentrabajo.dat_asistencia
                      (idpersona,
                      idcargo,
                      fechahoraentrada,
                      fechahorasalida,
                      fecharegistro,
                      idpersonacontrola,
                      idcausa,
                      hrsdescontadas,
                      idgrupodescanso,
                      idturnotrabajo,
                      hrstrabajadas)
                  VALUES " . implode(',', $arrDatos) . " ON CONFLICT ON CONSTRAINT dat_asistencia_idx DO NOTHING RETURNING idasistencia;";
        //print_r($sql);die;
        $idasistencia = $conn->fetchArray($sql);
        $conn->commit();
        return $idasistencia;
    }

    public function InsertAsistencia($arrDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        // $conn->beginTransaction();
        $sql = "INSERT INTO mod_regimentrabajo.dat_asistencia
                      (idpersona,
                      idcargo,
                      fechahoraentrada,
                      fechahorasalida,
                      fecharegistro,
                      idpersonacontrola,
                      horasextras,
                      idcausa,
                      hrsdescontadas,
                      idgrupodescanso,
                      idturnotrabajo,
                      hrstrabajadas,
                      estado)
                  VALUES " . implode(',', $arrDatos) . ";";
        //print_r($sql);die;
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        return $res->execute();
    }

    public function InsertFeriados($arrDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "INSERT INTO mod_regimentrabajo.dat_asistencia
                    (idpersona,
                    idcargo,
                     fechahoraentrada,
                     fechahorasalida,
                     fecharegistro,
                     fhabilitado,
                     hferiadas,
                     idpersonacontrola,
                     idcausa, hrsdescontadas,
                     idgrupodescanso,
                    idturnotrabajo,
                    hrstrabajadas)
                  VALUES " . implode(',', $arrDatos) . ";";
        return $conn->execute($sql);
    }

    public function InsertSesiones($arrDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "INSERT INTO mod_regimentrabajo.dat_asistenciasesion
                    (idasistencia,
                     idsesion,
                     fechahoraentrada,
                     fechahorasalida,
                     idcausa)
                  VALUES " . implode(',', $arrDatos) . ";";
        return $conn->execute($sql);
    }

    public function UpdateAsistencia($horainicio, $horafin, $idcausa, $descontar, $trabajadas, $idpersona, $fecha, $horasextras, $idpersonacontrola, $idpersonamodifica,$estado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "UPDATE mod_regimentrabajo.dat_asistencia
                      SET fechahoraentrada = CASE idpersona " . $horainicio . " END,
                          fechahorasalida = CASE idpersona " . $horafin . " END,
                          hrsdescontadas = CASE idpersona " . $descontar . " END,
                          hrstrabajadas = CASE idpersona " . $trabajadas . " END,
                          horasextras = CASE idpersona " . $horasextras . " END,
                          idpersonacontrola = CASE idpersona " . $idpersonacontrola . " END,
                          idpersonamodifica = CASE idpersona " . $idpersonamodifica . " END,
                          idcausa = CASE idpersona " . $idcausa . " END,
                          estado = CASE idpersona " . $estado . " END
                  WHERE idpersona = " . $idpersona . " AND fecharegistro = CAST('" . $fecha . "' AS date);";
        //print_r($sql);die;
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);

        return $res->execute();
    }

    public function ActualizarAsistencia($idasistupd, $idgrupodescanso)
    {
        $sql = "UPDATE
                  mod_regimentrabajo.dat_asistencia
                SET
                   idgrupodescanso = " . $idgrupodescanso . "
                WHERE
                  idasistencia IN (" . implode(',', $idasistupd) . ")";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        return true;
    }

    public function DelAsistenciaOnDatesByGrupoDescanso($dates, $idgrupodescanso)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM mod_regimentrabajo.dat_asistencia da
                     WHERE da.fecharegistro IN (" . implode(',', $dates) . ") AND
                     da.idgrupodescanso = " . $idgrupodescanso;
        return $conn->fetchAll($sql);
    }

    public function DelAsistenciaOnDatesByPersona($dates, $idpersonascargos)
    {
        try {
            if (count($idpersonascargos) > 0) {
                $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
                $idcargos = $this->getArrayColumn($idpersonascargos, 'idcargo');
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $sql = "DELETE FROM mod_regimentrabajo.dat_asistencia da
                     WHERE da.fecharegistro IN (" . implode(',', $dates) . ") AND
                     da.idpersona IN (" . implode(',', $idpersonas) . ") and da.idcargo IN (" . implode(',', $idcargos) . ")";
                return $conn->fetchAll($sql);
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

    public function DelAsistenciaByGrupoDescanso($idgrupodescanso, $year)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM mod_regimentrabajo.dat_asistencia da
                     WHERE da.idgrupodescanso = " . $idgrupodescanso . " and date_part('year', da.fecharegistro) = '$year'";
        return $conn->fetchAll($sql);
    }

    public function DelAsistenciaOnDatesByPerson($idpersona, $fecha)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM mod_regimentrabajo.dat_asistencia da
                     WHERE da.idpersona = " . $idpersona . " AND da.fecharegistro = cast('" . $fecha . "' AS DATE);";
        return $conn->fetchAll($sql);
    }

    public function OrderPersonasByCargo($personas, $limit, $start)
    {
        $idpersonas = array();
        foreach ($personas as $key => $value) {
            $idpersonas[] = $value['idpersona'];
        }
        $sql = "SELECT per.idpersona  AS idpersona, dsl.idcargo,
                nfs.orden AS orden, nfs.nivel AS nivel,
                (SELECT fila.nivel
                FROM mod_estructuracomp.nom_filaestruc fila 
                WHERE fila.idfila = dsl.idcargo ) AS nivelcargo,
                (SELECT fila.orden
                FROM mod_estructuracomp.nom_filaestruc fila 
                WHERE fila.idfila = dsl.idcargo ) AS ordencargo
                FROM mod_persona.dat_persona per 
                INNER JOIN mod_persona.dat_personaentidad perent ON per.idpersona = perent.idpersona AND ((perent.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= perent.fhasta OR perent.fhasta IS NULL)))
                INNER JOIN mod_persona.dat_situacionlaboral dsl ON perent.idpersonaentidad = dsl.idpersonaentidad AND dsl.estado = 0
                INNER JOIN mod_estructuracomp.nom_filaestruc nfs ON (dsl.idarea = nfs.idfila)
                WHERE per.idpersona IN (" . implode(',', $idpersonas) . ")                
                ORDER BY orden,nivel,ordencargo";
        if (is_numeric($limit)) {
            $sql = $sql . " limit " . $limit . " offset " . $start;
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        $result = array();
        foreach ($r as $a => $perordenadas) {
            foreach ($personas as $b => $persinorden) {
                if ($perordenadas['idpersona'] == $persinorden['idpersona']) {
                    $persinorden['nivelcargo'] = (int)$perordenadas['nivelcargo'];
                    $result[] = $persinorden;
                    unset($personas[$b]);
                }
            }
        }
        return $result;
    }

//    public function GetAllByRangoAndPersonas($fdesde, $fhasta, $idspersonas, $certificacion, $configSesiones)
//    {
//        $idpersonas = $this->getArrayColumn($idspersonas, 'idpersona');
//        $idcargos = $this->getArrayColumn($idspersonas, 'idcargo');
//        $cert = "";
//
//        if (is_numeric($certificacion)) {
//            if ($certificacion == 1)
//                $cert = " AND (m.certificado = $certificacion) ";
//        }
//
//        $sql = "SELECT DISTINCT m.idasistencia AS idasistencia, m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS  idcausa,
//			m.hrsdescontadas AS  hrsdescontadas, m.idpersona AS  idpersona, m.fechahorasalida AS  fechahorasalida, m.fecharegistro AS  fecharegistro,
//			m.observacion AS  observacion, m.idpadre AS  idpadre, m.horasextras AS  horasextras, m.fhabilitado AS  fhabilitado, m.hferiadas AS  hferiadas,
//			m.idpersonacontrola AS  idpersonacontrola, m.idpersonamodifica AS  idpersonamodifica,m2.denominacion AS denomcausa, m2.abreviatura AS abreviatura,  m2.idcategoria AS idcategoria,
//			 m2.afectasalario AS afectasalario,m2.color,m.certificado AS certificado,m.aprobado AS aprobado,m.hrstrabajadas,tt.horainicio, tt.horafin,tt.horaentradaps,
//			tt.horasalidaps,tt.horaentradass, tt.horasalidass,tt.otrodia,m.idgrupodescanso,td.idtipodedia,m.idcargo,
//			 (
//                SELECT td.trabajo FROM mod_regimentrabajo.conf_calendariopersona c
//                            INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
//                 WHERE c.fecha = m.fecharegistro AND c.idpersona = m.idpersona LIMIT 1
//                   ) AS trabajo,
//                   (
//                        SELECT td.feriado FROM mod_regimentrabajo.conf_calendariopersona c
//                                    INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
//                         WHERE c.fecha = m.fecharegistro AND c.idpersona = m.idpersona LIMIT 1
//                   ) AS feriado,
//                   (SELECT MAX(da.fecharegistro) FROM mod_regimentrabajo.dat_asistencia da
//                INNER JOIN  mod_regimentrabajo.conf_certificados cert ON (da.idcausa = cert.idcausa)
//                WHERE da.certificadocontinuado = 1 AND da.idpersona = m.idpersona
//                ) AS ultimocertcontinuado,
//                (SELECT MAX(da.fecharegistro) FROM mod_regimentrabajo.dat_asistencia da
//                INNER JOIN  mod_regimentrabajo.conf_certificados cert ON (da.idcausa = cert.idcausa)
//                WHERE da.certificadocontinuado = 0 AND da.idpersona = m.idpersona
//                ) AS ultimocertinicial
//                   ";// and c.idcargo = sl.idcargo
//
//        if ($configSesiones == 1) {
//            $sql .= ",
//                (SELECT to_char(fechahoraentrada, 'HH24:MI')
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahoraentradaps,
//                (SELECT to_char(fechahoraentrada, 'HH24:MI')
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahoraentradass,
//                (SELECT to_char(fechahorasalida, 'HH24:MI')
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahorasalidaps,
//                (SELECT to_char(fechahorasalida, 'HH24:MI')
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahorasalidass,
//                (SELECT hrsdescontadas
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as hrsdescontadasps,
//                (SELECT hrsdescontadas
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 1) as hrsdescontadasss,
//                (SELECT   horasextras
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as horasextrasps,
//                (SELECT horasextras
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 1) as horasextrasss,
//                (SELECT idcausa
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as idcausaps,
//                (SELECT idcausa
//                    FROM mod_regimentrabajo.dat_asistenciasesion
//                    WHERE idasistencia = m.idasistencia and idsesion = 1) as idcausass,
//                (SELECT c.denominacion
//                    FROM mod_regimentrabajo.dat_asistenciasesion s
//                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as denominacionps,
//                (SELECT c.denominacion
//                    FROM mod_regimentrabajo.dat_asistenciasesion s
//                    LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
//                    WHERE idasistencia = m.idasistencia and idsesion = 1) as denominacionss,
//                    (
//                     SELECT c.abreviatura
//                     FROM mod_regimentrabajo.dat_asistenciasesion s
//                          LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
//                     WHERE idasistencia = m.idasistencia and
//                       idsesion = 0
//                   ) as abreviaturaps,
//                   (
//                     SELECT c.abreviatura
//                     FROM mod_regimentrabajo.dat_asistenciasesion s
//                          LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
//                     WHERE idasistencia = m.idasistencia and
//                           idsesion = 1
//                   ) as abreviaturass,
//                (SELECT c.color
//                    FROM mod_regimentrabajo.dat_asistenciasesion s
//                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
//                    WHERE idasistencia = m.idasistencia and idsesion = 0) as colorps
//                ";
//        }
//
//        $sql .= "	 FROM mod_regimentrabajo.dat_asistencia m
//			 LEFT JOIN mod_regimentrabajo.nom_causa m2 ON (m.idcausa = m2.idcausa)
//			 left join mod_persona.dat_personaentidad pe on m.idpersona = pe.idpersona
//			 inner join mod_persona.dat_situacionlaboral sl on pe.idpersonaentidad = sl.idpersonaentidad and sl.estado = 0
//			 inner join mod_personaext.dat_regimentrabajo rt on m.idpersona = rt.idpersona AND rt.idcargo = m.idcargo
//			 left JOIN mod_regimentrabajo.conf_calendariopersona cal ON m.idpersona = cal.idpersona AND cal.fecha = m.fecharegistro
//			 INNER JOIN mod_regimentrabajo.nom_tipodedia td on cal.idtipodedia = td.idtipodedia
//             left JOIN mod_regimentrabajo.nom_turnotrabajo tt ON cal.idturnotrabajo = tt.idturnotrabajo
//			 WHERE ((m.fecharegistro >= cast('" . $fdesde . "' as date)
//			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
//			 AND m.fhasta is null AND m.fdesde is null " . $cert . " and m.idpersona in (" . implode(',', $idpersonas) . ")
//			 and m.idcargo in (" . implode(',', $idcargos) . ") and rt.idcargo = sl.idcargo)
//			 OR (m.fhasta is not null
//			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
//			 and m.fhasta >= cast('" . $fdesde . "' as date))
//			 or (m.fdesde <= cast('" . $fhasta . "' as date)
//			 and m.fdesde >= cast('" . $fdesde . "' as date))
//			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
//			 and m.fdesde <= cast('" . $fdesde . "' as date)))) " . $cert . " and m.idpersona in (" . implode(',', $idpersonas) . ")
//			 and m.idcargo in (" . implode(',', $idcargos) . ") and rt.idcargo = sl.idcargo))
//			 ";
//        $sql = $sql . " order by m.fecharegistro asc";
//        //print_r($sql);die;
//        $mg = Doctrine_Manager::getInstance();
//        $conn = $mg->getCurrentConnection();
//        $r = $conn->fetchAll($sql);
//        $result = array();
//        foreach ($r as $d) {
//            $result[$d['idpersona']][$d['idcargo']][] = $d;
//        }
//        return $result;
//    }

    public function GetAllByRangoAndPersonas($fdesde, $fhasta, $idspersonas, $certificacion, $configSesiones, $historico = null, $addCertificados = true)
    {
        $idpersonas = $this->getArrayColumn($idspersonas, 'idpersona');
        $idcargos = $this->getArrayColumn($idspersonas, 'idcargo');
        $cert = "";

        if (is_numeric($certificacion)) {
            if ($certificacion == 1)
                $cert = " AND (m.certificado = $certificacion) ";
        }

        $sql = "SELECT DISTINCT ON (m.fecharegistro, m.idpersona, m.idcargo, m.idgrupodescanso) m.idasistencia AS idasistencia, m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS  idcausa,
			m.hrsdescontadas AS  hrsdescontadas, m.idpersona AS  idpersona, m.fechahorasalida AS  fechahorasalida, m.fecharegistro AS  fecharegistro,
			m.observacion AS  observacion, m.idpadre AS  idpadre, m.horasextras AS  horasextras, m.fhabilitado AS  fhabilitado, m.hferiadas AS  hferiadas,
			m.idpersonacontrola AS  idpersonacontrola, m.idpersonamodifica AS  idpersonamodifica,m2.denominacion AS denomcausa, m2.abreviatura AS abreviatura,  m2.idcategoria AS idcategoria,
			 m2.afectasalario AS afectasalario,m2.color,m.certificado AS certificado,m.aprobado AS aprobado,m.hrstrabajadas,tt.horainicio, tt.horafin,tt.horaentradaps,
			tt.horasalidaps,tt.horaentradass, tt.horasalidass,tt.otrodia,tt.horarioalmuerzo,tt.tiempodescanso, m.idgrupodescanso,td.idtipodedia,m.idcargo,
			 td.trabajo AS trabajo, td.feriado AS feriado
                   ";// and c.idcargo = sl.idcargo
        /*
        (
                SELECT td.trabajo FROM mod_regimentrabajo.conf_calendariopersona c 
                            INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
                 WHERE c.fecha = m.fecharegistro AND c.idpersona = m.idpersona LIMIT 1
                   ) AS trabajo,
                   (
                        SELECT td.feriado FROM mod_regimentrabajo.conf_calendariopersona c 
                                    INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
                         WHERE c.fecha = m.fecharegistro AND c.idpersona = m.idpersona LIMIT 1
                   ) AS feriado
         */

        if($addCertificados){
            $sql.= ",
                   (SELECT MAX(da.fecharegistro) FROM mod_regimentrabajo.dat_asistencia da
                INNER JOIN  mod_regimentrabajo.conf_certificados cert ON (da.idcausa = cert.idcausa)
                WHERE da.certificadocontinuado = 1 AND da.idpersona = m.idpersona
                ) AS ultimocertcontinuado,
                (SELECT MAX(da.fecharegistro) FROM mod_regimentrabajo.dat_asistencia da
                INNER JOIN  mod_regimentrabajo.conf_certificados cert ON (da.idcausa = cert.idcausa)
                WHERE da.certificadocontinuado = 0 AND da.idpersona = m.idpersona
                ) AS ultimocertinicial";
        }

        if ($configSesiones == 1) {
            $sql .= ",
                (SELECT to_char(fechahoraentrada, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahoraentradaps,
                (SELECT to_char(fechahoraentrada, 'HH24:MI')     
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahoraentradass,
                (SELECT to_char(fechahorasalida, 'HH24:MI')  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahorasalidaps,
                (SELECT to_char(fechahorasalida, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahorasalidass,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as hrsdescontadasps,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as hrsdescontadasss,
                (SELECT   horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as horasextrasps,
                (SELECT horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as horasextrasss,
                (SELECT idcausa  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as idcausaps,
                (SELECT idcausa
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as idcausass,
                (SELECT c.denominacion
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as denominacionps,
                (SELECT c.denominacion
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as denominacionss,
                    (
                     SELECT c.abreviatura
                     FROM mod_regimentrabajo.dat_asistenciasesion s
                          LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                     WHERE idasistencia = m.idasistencia and
                       idsesion = 0
                   ) as abreviaturaps,
                   (
                     SELECT c.abreviatura
                     FROM mod_regimentrabajo.dat_asistenciasesion s
                          LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                     WHERE idasistencia = m.idasistencia and
                           idsesion = 1
                   ) as abreviaturass,
                (SELECT c.color
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as colorps
                ";
        }

        $sql .= "	 FROM mod_regimentrabajo.dat_asistencia m
			 LEFT JOIN mod_regimentrabajo.nom_causa m2 ON (m.idcausa = m2.idcausa)
			 left join mod_persona.dat_personaentidad pe on m.idpersona = pe.idpersona
			 inner join mod_persona.dat_situacionlaboral sl on pe.idpersonaentidad = sl.idpersonaentidad
			 inner join mod_personaext.dat_regimentrabajo rt on m.idpersona = rt.idpersona AND rt.idcargo = m.idcargo
			 left JOIN mod_regimentrabajo.conf_calendariopersona cal ON m.idpersona = cal.idpersona AND cal.fecha = m.fecharegistro 
			 INNER JOIN mod_regimentrabajo.nom_tipodedia td on cal.idtipodedia = td.idtipodedia
             left JOIN mod_regimentrabajo.nom_turnotrabajo tt ON cal.idturnotrabajo = tt.idturnotrabajo
			 WHERE ((m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null " . $cert . " and m.idpersona in (" . implode(',', $idpersonas) . ")
			 and rt.idcargo = sl.idcargo)
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date)))) " . $cert . " and m.idpersona in (" . implode(',', $idpersonas) . ")
			 and rt.idcargo = sl.idcargo))
			 ";
        if($historico == 1)
            $sql = $sql . " AND (sl.fhasta >= CAST('" . $fdesde . "' as date) and sl.fhasta <= CAST('" . $fhasta . "' as date)) and sl.estado != 0";
        $sql = $sql . " order by m.fecharegistro asc";
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        $result = array();
        foreach ($r as $d) {
            //$result[$d['idpersona']][$d['idcargo']][] = $d;
            $result[$d['idpersona']][] = $d;
        }
        return $result;
    }

    public function GetAllByMonthYearAndPersonBySesion($fdesde, $fhasta, $idpersona, $mes, $year, $limit, $start)
    {
        $sql = "SELECT m.idasistencia AS idasistencia, m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde,m.estado,
        m.fhasta AS fhasta, m.idcausa AS idcausa, m.hrsdescontadas AS hrsdescontadas, m.idpersona
         AS idpersona, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro, m.observacion
         AS observacion, m.horasextras AS horasextras, m.idpersonacontrola AS idpersonacontrola, m.idpersonamodifica AS idpersonamodifica
        , m2.idcausa AS idcausa, m2.denominacion AS causa, m2.color AS color,m2.afectasalario AS afectasalario,m.actualizado AS actualizado,
         EXTRACT(DAY FROM m.fecharegistro) AS dia, EXTRACT(MONTH FROM m.fecharegistro) AS mes,EXTRACT(YEAR FROM m.fecharegistro) AS year,
        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersona) AS nombreapellidos,
        doc.numero AS noidentidad,
         (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,m.idgrupodescanso 
        FROM mod_regimentrabajo.dat_asistencia m  
         LEFT JOIN mod_regimentrabajo.nom_causa m2 ON (m.idcausa = m2.idcausa)
         LEFT JOIN mod_persona.dat_docidentidad doc ON (m.idpersona = doc.idpersona AND doc.principal = 1 AND (doc.fhasta IS NULL OR doc.fhasta > CURRENT_DATE))
         INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.actual = 1         
         WHERE (m.fecharegistro >= cast('" . $fdesde . "' AS DATE)
			 AND m.fecharegistro <= cast('" . $fhasta . "' AS DATE)
			 AND m.fhasta IS NULL AND m.fdesde IS NULL AND m.idpersona = " . $idpersona . ")
			 OR (m.fhasta IS NOT NULL
			 AND m.fdesde IS NOT NULL AND((m.fhasta <= cast('" . $fhasta . "' AS DATE)
			 AND m.fhasta >= cast('" . $fdesde . "' AS DATE))
			 OR (m.fdesde <= cast('" . $fhasta . "' AS DATE)
			 AND m.fdesde >= cast('" . $fdesde . "' AS DATE))
			 OR ((m.fhasta >= cast('" . $fhasta . "' AS DATE)
			 AND m.fdesde <= cast('" . $fdesde . "' AS DATE)))) AND m.idpersona = " . $idpersona . ") 
			 ORDER BY m.fecharegistro DESC";
        if (is_numeric($limit)) {
            $sql = $sql . " limit " . $limit . " offset " . $start;
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);

        $result = array();

        $hoy = explode('/', date('d/m/Y'));
        $fdesdeF = explode('/', $fdesde);
        $fhastaF = explode('/', $fhasta);
        $fecha1 = date_create($fdesdeF[2] . '-' . $fdesdeF[1] . '-' . $fdesdeF[0]);
        $fecha2 = date_create($fhastaF[2] . '-' . $fhastaF[1] . '-' . $fhastaF[0]);
        while ($fecha1 <= $fecha2) {
            $dia = intval($fecha2->format("d"));
            $mes1 = intval($fecha2->format("m"));
            $anno = intval($fecha2->format("Y"));
            $fin = false;
            $time = strtotime($mes1 . '/' . $dia . '/' . $anno);
            $newformat = date('Y-m-d', $time);
            $iswend = $this->isWeekend($newformat);
            if ($iswend) {
                $fin = true;
            }

            $result[$dia] = array('idasistencia' => null, 'fechahoraentrada' => null, 'fdesde' => null, 'fhasta' => null,
                'idcausa' => null, 'hrsdescontadas' => null, 'idpersona' => null, 'fechahorasalida' => null, 'fecharegistro' => $dia . '/' . $mes1 . '/' . $anno,
                'observacion' => null, 'horasextras' => null, 'idpersonacontrola' => null, 'idpersonamodifica' => null,
                'causa' => null, 'color' => null, 'actualizado' => null, 'correo' => null, 'dia' => intval($fecha2->format("d")), 'mes' => intval($fecha2->format("m")),
                'year' => $fecha2->format("Y"), 'nombreapellidos' => $r[0]['nombreapellidos'], 'noidentidad' => $r[0]['noidentidad'], 'personacontrola' => null, 'personamodifica' => null,
                'certificado' => null, 'finsemana' => $fin
            );
            date_add($fecha2, date_interval_create_from_date_string('-1 days'));
            $FIT2 = explode('/', $fecha2->format('d/m/Y'));
            $fecha2 = date_create($FIT2[2] . '-' . $FIT2[1] . '-' . $FIT2[0]);
        }
        foreach ($r as $a) {
            if (empty($a['fdesde']) && empty($a['fhasta']) && $a['dia'] <= intval($fecha2->format("d"))) {
                $fin = false;
                $time = strtotime($a['mes'] . '/' . $a['dia'] . '/' . $a['year']);
                $newformat = date('Y-m-d', $time);
                $iswend = $this->isWeekend($newformat);
                if ($iswend) {
                    $fin = true;
                }
                $a['finsemana'] = $fin;
                $result[$a['dia']] = $a;
            }
        }

        //Poniendo las causas
        foreach ($r as $k => $c) {
            $fecha = $c['fecharegistro'];
            //$grupo = $c['idgrupodescanso'];
            $idpersona = $c['idpersona'];
            $horasdia = "SELECT conf.horas
                            FROM mod_regimentrabajo.conf_calendariopersona conf
                            WHERE conf.fecha = cast('" . $fecha . "' as date) and conf.idpersona = '$idpersona'";
            $mg1 = Doctrine_Manager::getInstance();
            $conn1 = $mg1->getCurrentConnection();
            $resp = $conn1->fetchAll($horasdia);
            $horasdia = explode(':', $resp[0]['horas']);
            if (!empty($c['idcausa']) && !empty($c['fdesde']) && !empty($c['fhasta'])) {
                $fdesdec = explode('/', $c['fdesde']);
                $fhastac = explode('/', $c['fhasta']);
                $fechac1 = date_create($fdesdec[2] . '-' . $fdesdec[1] . '-' . $fdesdec[0]);
                $fechac2 = date_create($fhastac[2] . '-' . $fhastac[1] . '-' . $fhastac[0]);
                while ($fechac1 <= $fechac2) {
                    if (intval($fechac1->format('m')) == intval($mes)) {
                        $result[intval($fechac1->format('d'))] = $c;
                        if (!empty($c['afectasalario']))
                            $result[intval($fechac1->format('d'))]['hrsdescontadas'] = $horasdia[0] . ':' . $horasdia[1];
                        else
                            $result[intval($fechac1->format('d'))]['hrsdescontadas'] = '';
                        $result[intval($fechac1->format('d'))]['dia'] = intval($fechac1->format('d'));
                        $result[intval($fechac1->format('d'))]['mes'] = intval($fechac1->format('m'));
                        $result[intval($fechac1->format('d'))]['year'] = intval($fechac1->format('Y'));

                        $fin = false;
                        $time = strtotime(intval($fechac1->format('m')) . '/' . intval($fechac1->format('d')) . '/' . $fechac1->format('Y'));
                        $newformat = date('Y-m-d', $time);
                        $iswend = $this->isWeekend($newformat);
                        if ($iswend) {
                            $fin = true;
                        }
                        $result[intval($fechac1->format('d'))]['finsemana'] = $fin;
                    }
                    date_add($fechac1, date_interval_create_from_date_string('1 days'));
                    $FIT3 = explode('/', $fechac1->format('d/m/Y'));
                    $fechac1 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
                }
            }
        }
        return $result;
    }

    public function GetAllByRangeAndPersonBySesion($fdesde, $fhasta, $idpersona, $mes, $year, $configSesiones)
    {
        $sql = "SELECT m.idasistencia AS idasistencia, m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde
        , m.fhasta AS fhasta, m.idcausa AS idcausa, m.hrsdescontadas AS hrsdescontadas, m.idpersona
         AS idpersona, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro, m.observacion
         AS observacion, m.horasextras AS horasextras, m.idpersonacontrola AS idpersonacontrola, m.idpersonamodifica AS idpersonamodifica
        , m2.idcausa AS idcausa, m2.denominacion AS causa, m2.color AS color,m2.afectasalario AS afectasalario,m.actualizado AS actualizado,
         EXTRACT(DAY FROM m.fecharegistro) AS dia, EXTRACT(MONTH FROM m.fecharegistro) AS mes,EXTRACT(YEAR FROM m.fecharegistro) AS year,
        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersona) AS nombreapellidos,
        doc.numero AS noidentidad,
         (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,m.idgrupodescanso,m.idturnotrabajo,ntt.otrodia";

        if ($configSesiones == 1) {
            $sql .= ",
                (SELECT to_char(fechahoraentrada, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahoraentradaps,
                (SELECT to_char(fechahoraentrada, 'HH24:MI')     
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahoraentradass,
                (SELECT to_char(fechahorasalida, 'HH24:MI')  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahorasalidaps,
                (SELECT to_char(fechahorasalida, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahorasalidass,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as hrsdescontadasps,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as hrsdescontadasss,
                (SELECT   horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as horasextrasps,
                (SELECT horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as horasextrasss,
                (SELECT idcausa  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as idcausaps,
                (SELECT idcausa
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as idcausass,
                (SELECT c.denominacion
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as denominacionps,
                (SELECT c.denominacion
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as denominacionss,
                (SELECT c.color
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as colorps,
                (SELECT c.color
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as colorss";
        }

        $sql .= " FROM mod_regimentrabajo.dat_asistencia m  
         LEFT JOIN mod_regimentrabajo.nom_causa m2 ON (m.idcausa = m2.idcausa)
         LEFT JOIN mod_persona.dat_docidentidad doc ON (m.idpersona = doc.idpersona and doc.principal = 1 and (doc.fhasta is null or doc.fhasta > CURRENT_DATE))
         inner join mod_personaext.dat_regimentrabajo drt on drt.idpersona = m.idpersona and drt.actual = 1
         inner JOIN mod_regimentrabajo.conf_calendariopersona cal ON m.idpersona = cal.idpersona AND cal.fecha = m.fecharegistro
         left JOIN mod_regimentrabajo.nom_turnotrabajo ntt ON cal.idturnotrabajo = ntt.idturnotrabajo
         WHERE (m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null and m.idpersona = " . $idpersona . ")
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date)))) and m.idpersona = " . $idpersona . ") 
			 ORDER BY m.fecharegistro desc";
//print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);

        $result = array();
        $fdesdeF = explode('/', $fdesde);
        $fhastaF = explode('/', $fhasta);
        $fecha1 = date_create($fdesdeF[2] . '-' . $fdesdeF[1] . '-' . $fdesdeF[0]);
        $fecha2 = date_create($fhastaF[2] . '-' . $fhastaF[1] . '-' . $fhastaF[0]);
        $fecha21 = date_create($fhastaF[2] . '-' . $fhastaF[1] . '-' . $fhastaF[0]);

        while ($fecha1 <= $fecha2) {
            $dia = intval($fecha2->format("d"));
            $mes1 = intval($fecha2->format("m"));
            $anno = intval($fecha2->format("Y"));
            $fin = false;
            $time = strtotime($mes1 . '/' . $dia . '/' . $anno);
            $newformat = date('Y-m-d', $time);
            $iswend = $this->isWeekend($newformat);
            if ($iswend) {
                $fin = true;
            }

            $result[$dia . $mes1] = array(
                'idasistencia' => null,
                'fechahoraentrada' => null,
                'fdesde' => null,
                'fhasta' => null,
                'idcausa' => null,
                'hrsdescontadas' => null,
                'idpersona' => null,
                'fechahorasalida' => null,
                'fecharegistro' => $fecha2->format("d") . '/' . $fecha2->format("m") . '/' . $fecha2->format("Y"),
                'observacion' => null,
                'horasextras' => null,
                'idpersonacontrola' => null,
                'idpersonamodifica' => null,
                'causa' => null,
                'color' => null,
                'actualizado' => null,
                'correo' => null,
                'dia' => intval($fecha2->format("d")),
                'mes' => intval($fecha2->format("m")),
                'year' => $fecha2->format("Y"),
                'nombreapellidos' => $r[0]['nombreapellidos'],
                'noidentidad' => $r[0]['noidentidad'],
                'personacontrola' => null, 'personamodifica' => null,
                'certificado' => null, 'finsemana' => $fin
            );
            date_add($fecha2, date_interval_create_from_date_string('-1 days'));
            $FIT4 = explode('/', $fecha2->format('d/m/Y'));
            $fecha2 = date_create($FIT4[2] . '-' . $FIT4[1] . '-' . $FIT4[0]);
        }
        foreach ($r as $a) {
            if (empty($a['fdesde']) && empty($a['fhasta']) && $a['dia'] <= intval($fecha21->format("d"))) {
                $fin = false;
                $time = strtotime($a['mes'] . '/' . $a['dia'] . '/' . $a['year']);
                $newformat = date('Y-m-d', $time);
                $iswend = $this->isWeekend($newformat);
                if ($iswend) {
                    $fin = true;
                }
                $a['finsemana'] = $fin;
                $result[$a['dia'] . $a['mes']] = $a;
            }
        }

        //Poniendo las causas
        foreach ($r as $k => $c) {
            $fecha = $c['fecharegistro'];
            //$grupo = $c['idgrupodescanso'];
            $idpersona = $c['idpersona'];
            $horasdia = "SELECT conf.horas
                            FROM mod_regimentrabajo.conf_calendariopersona conf
                            WHERE conf.fecha = cast('" . $fecha . "' as date) and conf.idpersona = '$idpersona'";
            $mg1 = Doctrine_Manager::getInstance();
            $conn1 = $mg1->getCurrentConnection();
            $resp = $conn1->fetchAll($horasdia);
            $horasdia = explode(':', $resp[0]['horas']);
            if (!empty($c['idcausa']) && !empty($c['fdesde']) && !empty($c['fhasta'])) {
                $fhast = explode('/', $fhasta);
                $ffinal = date_create($fhast[2] . '-' . $fhast[1] . '-' . $fhast[0]);

                $fdesdec = explode('/', $c['fdesde']);
                $fhastac = explode('/', $c['fhasta']);
                $fechac1 = date_create($fdesdec[2] . '-' . $fdesdec[1] . '-' . $fdesdec[0]);

                $fhastc = date_create($fhastac[2] . '-' . $fhastac[1] . '-' . $fhastac[0]);

                if ($fhastc < $ffinal) {
                    $fechac2 = $fhastc;
                } else {
                    $fechac2 = $ffinal;
                }

                while ($fechac1 <= $fechac2) {
                    $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))] = $c;
                    if (!empty($c['afectasalario']))
                        $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['hrsdescontadas'] = $horasdia[0] . ':' . $horasdia[1];
                    else
                        $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['hrsdescontadas'] = '';
                    $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['dia'] = intval($fechac1->format('d'));
                    $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['mes'] = intval($fechac1->format('m'));
                    $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['year'] = intval($fechac1->format('Y'));
                    $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['fecharegistro'] = $fechac1->format('d') . '/' . $fechac1->format('m') . '/' . $fechac1->format('Y');

                    $fin = false;
                    $time = strtotime(intval($fechac1->format('m')) . '/' . intval($fechac1->format('d')) . '/' . $fechac1->format('Y'));
                    $newformat = date('Y-m-d', $time);
                    $iswend = $this->isWeekend($newformat);
                    if ($iswend) {
                        $fin = true;
                    }
                    $result[intval($fechac1->format('d')) . intval($fechac1->format('m'))]['finsemana'] = $fin;
                    date_add($fechac1, date_interval_create_from_date_string('1 days'));
                    $FIT = explode('/', $fechac1->format('d/m/Y'));
                    $fechac1 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                }
            }
        }
        return $result;
    }

    public function isWeekend($date)
    {
        return (date('N', strtotime($date)) >= 6);
    }

    public function GetAllByMonthYearAndArrayPerson($fdesde, $fhasta, $idpersonas, $mes, $year, $limit, $start, $configSesiones)
    {
        $sql = "SELECT m.idasistencia AS idasistencia, m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde
        , m.fhasta AS fhasta, (CASE WHEN m.idcausa = -1 THEN -1 ELSE m.idcausa END) AS idcausa, m.hrsdescontadas AS hrsdescontadas,m.hrstrabajadas AS hrstrabajadas, m.idpersona
         AS idpersona, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro, m.observacion
         AS observacion, m.horasextras AS horasextras, m.idpersonacontrola AS idpersonacontrola, m.idpersonamodifica AS idpersonamodifica
        , (CASE WHEN m.idcausa = -1 THEN 'MULTIPLES CAUSAS' ELSE m2.denominacion END) AS causa, m2.color AS color, m2.afectasalario AS afectasalario, m.actualizado AS actualizado,m19.contacto AS correo,
         EXTRACT(DAY FROM m.fecharegistro) AS dia, EXTRACT(MONTH FROM m.fecharegistro) AS mes,EXTRACT(YEAR FROM m.fecharegistro) AS year,
        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersona) AS nombreapellidos,
        doc.numero AS noidentidad,
         (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,m.certificado AS certificado,m.idgrupodescanso,
        (
       		    SELECT td.trabajo FROM mod_regimentrabajo.conf_calendariopersona c 
            			INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
                    WHERE c.fecha = m.fecharegistro AND c.idpersona = m.idpersona
                    LIMIT 1
               ) AS trabajo,
               (
                    SELECT td.feriado FROM mod_regimentrabajo.conf_calendariopersona c 
                                INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
                    WHERE c.fecha = m.fecharegistro AND c.idpersona = m.idpersona
                    LIMIT 1
               ) AS feriado
                    ";// and c.idcargo = sl.idcargo

        if ($configSesiones == 1) {
            $sql .= ",
                (SELECT to_char(fechahoraentrada, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahoraentradaps,
                (SELECT to_char(fechahoraentrada, 'HH24:MI')     
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahoraentradass,
                (SELECT to_char(fechahorasalida, 'HH24:MI')  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as fechahorasalidaps,
                (SELECT to_char(fechahorasalida, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as fechahorasalidass,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as hrsdescontadasps,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as hrsdescontadasss,
                (SELECT   horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as horasextrasps,
                (SELECT horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as horasextrasss,
                (SELECT idcausa  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as idcausaps,
                (SELECT idcausa
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as idcausass,
                (SELECT c.denominacion
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as denominacionps,
                (SELECT c.denominacion
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as denominacionss,
                (SELECT c.color
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                      LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 0) as colorps,
                (SELECT c.color
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c on s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia and idsesion = 1) as colorss
                    ";
        }

        $sql .= "    FROM mod_regimentrabajo.dat_asistencia m 
         LEFT JOIN mod_regimentrabajo.nom_causa m2 ON (m.idcausa = m2.idcausa)
         LEFT JOIN mod_persona.dat_docidentidad doc ON (m.idpersona = doc.idpersona  AND doc.principal = 1)
         inner join mod_personaext.dat_regimentrabajo drt on drt.idpersona = m.idpersona and drt.actual = 1         
         LEFT JOIN mod_persona.dat_contacto m19 ON m.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
          WHERE (m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null and m.idpersona in (" . implode(',', $idpersonas) . "))
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date)))) and m.idpersona in (" . implode(',', $idpersonas) . ")) ORDER BY m.fecharegistro asc";

        if (is_numeric($limit)) {
            $sql = $sql . " limit " . $limit . " offset " . $start;
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        $result = array();
        $temp = array();

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        foreach ($r as $d) {
            $temp[$d['idpersona']][] = $d;
        }

        foreach ($temp as $key => $p) {
            $Fdesde = explode('/', $fdesde);
            $Fhasta = explode('/', $fhasta);
            $hoy = explode('/', date('d/m/Y'));
            $fecha1 = date_create($Fdesde[2] . '-' . $Fdesde[1] . '-' . $Fdesde[0]);
            $fecha2 = date_create($Fhasta[2] . '-' . $Fhasta[1] . '-' . $Fhasta[0]);
            $hoy1 = date_create($hoy[2] . '-' . $hoy[1] . '-' . $hoy[0]);

            while ($fecha1 <= $fecha2) {
                $mesanno = $this->getMes(intval($fecha1->format("m"))) . '-' . $fecha1->format("Y");
                $dia = intval($fecha1->format("d"));
                $result[$key]['asistencia'][$mesanno][$dia] = array('idasistencia' => null, 'fechahoraentrada' => null, 'fdesde' => null, 'fhasta' => null,
                    'idcausa' => $p[0]['idcausa'], 'hrsdescontadas' => null, 'idpersona' => null, 'fechahorasalida' => null, 'fecharegistro' => $fecha1->format("d") . '/' . $fecha1->format("m") . '/' . $fecha1->format("Y"),
                    'observacion' => null, 'horasextras' => null, 'idpersonacontrola' => null, 'idpersonamodifica' => null,
                    'causa' => null, 'color' => null, 'actualizado' => null, 'correo' => null, 'dia' => intval($fecha1->format("d")), 'mes' => intval($fecha1->format("m")),
                    'year' => $fecha1->format("Y"), 'nombreapellidos' => $p[0]['nombreapellidos'], 'noidentidad' => $p[0]['noidentidad'], 'personacontrola' => null, 'personamodifica' => null,
                    'certificado' => null, 'idgrupodescanso' => $p[0]['idgrupodescanso']
                );
                $result[$key]['nombreapellidos'] = $p[0]['nombreapellidos'];
                $result[$key]['noidentidad'] = $p[0]['noidentidad'];
                date_add($fecha1, date_interval_create_from_date_string('1 days'));
                $FIT1 = explode('/', $fecha1->format('d/m/Y'));
                $fecha1 = date_create($FIT1[2] . '-' . $FIT1[1] . '-' . $FIT1[0]);
            }

            //Poneindo la asistencia en el dia que coincide en el arreglo
            foreach ($p as $a) {
                $Fr = explode('/', $a['fecharegistro']);
                $Fregistro = date_create($Fr[2] . '-' . $Fr[1] . '-' . $Fr[0]);
                if (empty($a['fdesde']) && empty($a['fhasta']) && $Fregistro <= $fecha2)
                    $result[$key]['asistencia'][$this->getMes($a['mes']) . '-' . $a["year"]][$a['dia']] = $a;
            }

            $otrodia = false;
            //Poniendo las causas
            foreach ($p as $c) {
                $fecha = $c['fecharegistro'];
                $grupo = $c['idgrupodescanso'];
                $idpersona = $c['idpersona'];
                $horasdia = "SELECT conf.horas, ntt.otrodia,ntt.idturnotrabajo
                            FROM mod_regimentrabajo.conf_calendariopersona conf
                            INNER JOIN mod_regimentrabajo.nom_turnotrabajo ntt ON conf.idturnotrabajo = ntt.idturnotrabajo
                            WHERE conf.fecha = cast('" . $fecha . "' as date) and conf.idpersona = '$idpersona'";
                $mg1 = Doctrine_Manager::getInstance();
                $conn1 = $mg1->getCurrentConnection();
                $resp = $conn1->fetchAll($horasdia);
                //print_r($horasdia);die;
                $h = explode(':', $resp[0]['horas']);
                if ($resp[0]['otrodia'] == 1)
                    $otrodia = true;

                if (!empty($c['idcausa']) && !empty($c['fdesde']) && !empty($c['fhasta'])) {
                    $fdesdec = explode('/', $c['fdesde']);
                    $fhastac = explode('/', $c['fhasta']);
                    $fechac1 = date_create($fdesdec[2] . '-' . $fdesdec[1] . '-' . $fdesdec[0]);
                    $fechac2 = date_create($fhastac[2] . '-' . $fhastac[1] . '-' . $fhastac[0]);
                    while ($fechac1 <= $fechac2) {
                        if (array_key_exists($this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y'), $result[$key]['asistencia']) && array_key_exists(intval($fechac1->format('d')), $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')])) {
                            $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')][intval($fechac1->format('d'))] = $c;
                            $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')][intval($fechac1->format('d'))]['hrsdescontadas'] = $h[0] . ':' . $h[1];
                            $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')][intval($fechac1->format('d'))]['dia'] = intval($fechac1->format('d'));
                            $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')][intval($fechac1->format('d'))]['mes'] = intval($fechac1->format('m'));
                            $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')][intval($fechac1->format('d'))]['year'] = intval($fechac1->format('Y'));
                            $result[$key]['asistencia'][$this->getMes($fechac1->format('m')) . '-' . $fechac1->format('Y')][intval($fechac1->format('d'))]['otrodia'] = $resp[0]['otrodia'];
                        }
                        date_add($fechac1, date_interval_create_from_date_string('1 days'));
                        $FIT2 = explode('/', $fechac1->format('d/m/Y'));
                        $fechac1 = date_create($FIT2[2] . '-' . $FIT2[1] . '-' . $FIT2[0]);
                    }
                }
            }
            $result[$key]['otrodia'] = $otrodia;
        }
        return $result;
    }

    public function GetAllByDates($finicio, $ffin, $idpers)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT da.*,nc.abreviatura AS abreviatura,nc.idcausa AS idcausa,nc.idcategoria AS idcategoria,nc.afectasalario AS afectasalario,
                       (CASE WHEN dp.snombre IS NOT NULL THEN dp.nombre||' '|| dp.snombre||' '|| dp.papel ||' '||  dp.sapel
                                    ELSE dp.nombre||' '|| dp.papel||' '||  dp.sapel END) AS nombreapellidos
                    FROM mod_regimentrabajo.dat_asistencia da
                    LEFT JOIN mod_regimentrabajo.nom_causa nc ON (da.idcausa = nc.idcausa)
                    INNER JOIN mod_persona.dat_persona dp ON (dp.idpersona = da.idpersona)
                    WHERE (da.idpersona IN (" . implode(',', $idpers) . ") AND
                          ((da.fecharegistro >= cast ('" . $finicio . "' AS DATE) AND
                          da.fecharegistro <= cast ('" . $ffin . "' AS DATE)) OR
                          (da.fhasta IS NOT NULL AND
                          da.fdesde IS NOT NULL AND
                          (da.fecharegistro < cast ('" . $finicio . "' AS DATE) AND
                          da.fhasta >= cast ('" . $finicio . "' AS DATE)))))";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetAllByDatesByFdesde($finicio, $idpers)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT da.*,nc.abreviatura AS abreviatura,nc.idcausa AS idcausa,nc.idcategoria AS idcategoria,nc.afectasalario AS afectasalario,
                       (CASE WHEN dp.snombre IS NOT NULL THEN dp.nombre||' '|| dp.snombre||' '|| dp.papel ||' '||  dp.sapel
                                    ELSE dp.nombre||' '|| dp.papel||' '||  dp.sapel END) AS nombreapellidos
                    FROM mod_regimentrabajo.dat_asistencia da
                    LEFT JOIN mod_regimentrabajo.nom_causa nc ON (da.idcausa = nc.idcausa)
                    INNER JOIN mod_persona.dat_persona dp ON (dp.idpersona = da.idpersona)
                    WHERE (da.idpersona IN (" . implode(',', $idpers) . ") AND
                          ((da.fecharegistro >= cast ('" . $finicio . "' AS DATE)) OR
                          (da.fhasta IS NOT NULL AND
                          da.fdesde IS NOT NULL AND
                          (da.fecharegistro < cast ('" . $finicio . "' AS DATE) AND
                          da.fhasta >= cast ('" . $finicio . "' AS DATE)))))";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetAllByDatesWithSesions($finicio, $ffin, $idpers)
    {
        $sql = "
      SELECT m.idasistencia ,
           m.fechahoraentrada,
           m.fdesde,
           m.fhasta,
           m.idcausa ,
           m.hrsdescontadas,
           m.idpersona,
           m.fechahorasalida,
           m.fecharegistro,
           m.observacion,
           m.idpadre,
           m.horasextras,
           m.fhabilitado,
           m.hferiadas,
           m.idpersonacontrola,
           m.idpersonamodifica,
           m.certificado,
           m.idpersonacertifica,
           m2.abreviatura,
           m2.idcausa,
           m2.idcategoria,
           m2.afectasalario,
                (SELECT to_char(fechahoraentrada, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS fechahoraentradaps,
                (SELECT to_char(fechahoraentrada, 'HH24:MI')     
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS fechahoraentradass,
                (SELECT to_char(fechahorasalida, 'HH24:MI')  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS fechahorasalidaps,
                (SELECT to_char(fechahorasalida, 'HH24:MI')   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS fechahorasalidass,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS hrsdescontadasps,
                (SELECT hrsdescontadas   
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS hrsdescontadasss,
                (SELECT   horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS horasextrasps,
                (SELECT horasextras  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS horasextrasss,
                (SELECT idcausa  
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS idcausaps,
                (SELECT idcausa
                    FROM mod_regimentrabajo.dat_asistenciasesion 
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS idcausass,                
                (SELECT c.abreviatura
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c ON s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS abreviaturaps,
                (SELECT c.abreviatura
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c ON s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS abreviaturass,                
                (SELECT c.afectasalario
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c ON s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia AND idsesion = 0) AS afectasalariops,
                (SELECT c.afectasalario
                    FROM mod_regimentrabajo.dat_asistenciasesion s
                    LEFT JOIN mod_regimentrabajo.nom_causa c ON s.idcausa = c.idcausa
                    WHERE idasistencia = m.idasistencia AND idsesion = 1) AS afectasalarioss
    FROM mod_regimentrabajo.dat_asistencia m
         LEFT JOIN mod_regimentrabajo.nom_causa m2 ON (m.idcausa = m2.idcausa)
    WHERE (
    		m.idpersona IN (" . implode(',', $idpers) . ") AND
            (
              (
                m.fecharegistro >= cast ('" . $finicio . "' AS DATE) AND
                m.fecharegistro <= cast ('" . $ffin . "' AS DATE)
              ) OR
              (
                m.fhasta IS NOT NULL AND
              	m.fdesde IS NOT NULL AND
                (
                  (
                  	m.fdesde >= cast ('" . $finicio . "' AS DATE) AND
                    m.fdesde <= cast ('" . $ffin . "' AS DATE)
                  )
                  OR
                  (
                  	m.fhasta >= cast ('" . $finicio . "' AS DATE) AND
                 	m.fhasta <= cast ('" . $ffin . "' AS DATE)
                  )
                  OR
                  (
                  	m.fdesde < cast ('" . $finicio . "' AS DATE) AND
                 	m.fhasta > cast ('" . $ffin . "' AS DATE)
                  )           
              	)
              )
          	)
          )
        ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function DeleteIncidenciasPeriodo($idpersona, $fdesde, $fhasta)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->delete('DatAsistencia ')
                ->where("idpersona = " . $idpersona . " ")
                ->andWhere("((fdesde is not null AND fdesde  > cast('" . $fdesde . "' as date) AND fdesde <= cast('" . $fhasta . "' as date)) or (fdesde is null and fecharegistro > cast('" . $fdesde . "' as date) and fecharegistro <= cast('" . $fhasta . "' as date)))");
            //print_r($result->getSqlQuery());die;
            $result->execute();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function SelectIncidenciasPeriodo($idpersona, $fdesde, $fhasta)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT m.idasistencia AS m__idasistencia,(CASE
                          WHEN m3.snombre IS NOT NULL THEN m3.nombre || ' ' || m3.snombre || ' '
                           || m3.papel || ' ' || m3.sapel
                          ELSE m3.nombre || ' ' || m3.papel || ' ' || m3.sapel
                        END) AS nombreapellidos, m.fdesde, m.fhasta, nc.denominacion AS causa
                FROM mod_regimentrabajo.dat_asistencia m
                INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona
                LEFT JOIN mod_regimentrabajo.nom_causa nc ON (m.idcausa = nc.idcausa)
                WHERE (m.idpersona = " . $idpersona . " AND                      
                      ((m.fdesde IS NOT NULL AND
                      m.fdesde > cast ('" . $fdesde . "' AS DATE) AND
                      m.fdesde <= cast ('" . $fhasta . "' AS DATE)) OR
                      (m.fdesde IS NULL AND
                      m.fecharegistro > cast ('" . $fdesde . "' AS DATE) AND
                      m.fecharegistro <= cast ('" . $fhasta . "' AS DATE))))";

        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function DeleteIncidenciasByRange($idpersona, $fdesde, $fhasta)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->delete('DatAsistencia ')
                ->where("idpersona = " . $idpersona . " ")
                ->andWhere("((fdesde is not null AND fdesde  >= cast('" . $fdesde . "' as date) AND fdesde <= cast('" . $fhasta . "' as date)) or (fdesde is null and fecharegistro >= cast('" . $fdesde . "' as date) and fecharegistro <= cast('" . $fhasta . "' as date)))");
            //print_r($result->getSqlQuery());die;
            $result->execute();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function GetReporte($idpersonas, $fecha, $inicio, $limite)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('asis.idasistencia,asis.idpersona as idpersona, asis.idasistencia as idasistencia,
                                   asis.fechahoraentrada as fechahoraentrada,
                                   asis.fdesde as fdesde,asis.fhasta as fhasta,asis.idcausa as idcausa,
                                   asis.hrsdescontadas as hrsdescontadas, asis.fechahorasalida as fechahorasalida,
                                   asis.fecharegistro as fecharegistro, nc.denominacion as denominacion,
                                   nc.abreviatura as abreviaturacausa,nc.idcategoria as idcategoria,asis.observacion')
            ->from('DatAsistencia asis')
            ->leftJoin('asis.NomCausa nc')
            ->where("asis.idpersona in (" . implode(',', $idpersonas) . ")")
            ->andWhere("((asis.fecharegistro = cast('" . $fecha . "' as date)) OR ((asis.fdesde <= cast('" . $fecha . "' as date)) and (asis.fhasta >= cast('" . $fecha . "' as date))))");
        if (is_numeric($limite)) {
            $query->limit($limite)
                ->offset($inicio);
        }
        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'asis', 'per', 'InnerJoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
        $query->orderBy('dslab.idarea');
        return $result->execute()->toArray();
    }

    public function GetCantReporte($idpersonas, $fecha)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('asis.idasistencia')
            ->from('DatAsistencia asis')
            ->leftJoin('asis.NomCausa nc')
            ->where("asis.idpersona in (" . implode(',', $idpersonas) . ")")
            ->andWhere("((asis.fecharegistro = cast('" . $fecha . "' as date)) OR ((asis.fdesde <= cast('" . $fecha . "' as date)) and (asis.fhasta >= cast('" . $fecha . "' as date))))");

        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'asis', 'per', 'InnerJoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
        $query->orderBy('dslab.idarea');
        return $result->execute()->toArray();
    }

    public function getAsistByFechaWithSesion($idpersona, $fecharegistro)
    {
        $query = Doctrine_Query::create()
            ->select('a.*,s.*')
            ->from('DatAsistencia a')
            ->leftJoin('a.DatAsistenciasesion s on a.idasistencia = s.idasistencia')
            ->where("a.idpersona = " . $idpersona . " and a.fecharegistro = cast('" . $fecharegistro . "' as date)")
            ->orderBy('s.idsesion');
        return $query->execute()->toArray();
    }

    public function GetReporteAsist($idpersonas, $idcausa, $idturnotrabajo, $fecha, $inicio, $limite)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT m.idasistencia AS idasistencia, m.observacion AS observacion, m3.idpersona AS idpersona
                    , m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS idcausa,
                     m2.denominacion AS causa, m.hrsdescontadas AS hrsdescontadas, m.fechahorasalida AS fechahorasalida, 
                     m.fecharegistro AS fecharegistro, m2.denominacion, m2.abreviatura AS abreviaturacausa, m2.afectasalario, m.certificado,m.idpersonacertifica,
                    (SELECT (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacertifica) AS personacertifica,
                    (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m14.idcargo AS idcargo,m18.denominacion AS denomcargo
                    ,m11.identidad AS identidad, m12.idarea AS idarea, m5.numero AS numid                   
                    FROM mod_regimentrabajo.dat_asistencia m
                    LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa
                    INNER JOIN mod_persona.dat_persona m3 ON m.idpersona = m3.idpersona
                    LEFT JOIN mod_persona.dat_docidentidad m5 ON m3.idpersona = m5.idpersona AND m5.principal = 1
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad and m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0)
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.idcargo = m.idcargo AND drt.actual = 1
                    WHERE (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado IS NULL AND m.idpersona IN (" . implode(',', $idpersonas) . ") AND (m.fecharegistro = cast('" . $fecha . "' AS DATE)
                    OR (m.fdesde <= cast('" . $fecha . "' AS DATE) AND m.fhasta >= cast('" . $fecha . "' AS DATE))))";

        if (!empty($idcausa)) {
            $query .= "AND (m.idcausa in (" . implode(',', $idcausa) . ")) ";
        }
        if (!empty($idturnotrabajo)) {
            $query .= "AND (m.idturnotrabajo = $idturnotrabajo)";
        }
        $query = $query . " AND ((m11.fdesde <= now() AND (now() <= m11.fhasta OR m11.fhasta IS NULL)) 
            AND m12.estado = 0)";
        if (is_numeric($limite)) {
            $query = $query . " limit " . $limite . " offset " . $inicio;
        }
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetReporteAsistSincausa($idpersonas, $idturnotrabajo, $fecha)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT m.idasistencia AS idasistencia, m.observacion AS observacion, m3.idpersona AS idpersona
                    , m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS idcausa,
                     m2.denominacion AS causa, m.hrsdescontadas AS hrsdescontadas, m.fechahorasalida AS fechahorasalida, 
                     m.fecharegistro AS fecharegistro, m2.denominacion, m2.abreviatura AS abreviaturacausa, m.certificado,m.idpersonacertifica,
                    (SELECT (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,
                    (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m14.idcargo AS idcargo,m18.denominacion AS denomcargo
                    ,m11.identidad AS identidad, m12.idarea AS idarea, m5.numero AS numid                   
                    FROM mod_regimentrabajo.dat_asistencia m
                    LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa
                    INNER JOIN mod_persona.dat_persona m3 ON m.idpersona = m3.idpersona
                    LEFT JOIN mod_persona.dat_docidentidad m5 ON m3.idpersona = m5.idpersona
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad  and m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0)
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m3.idpersona AND drt.actual = 1
                    WHERE (m.idpersona IN (" . implode(',', $idpersonas) . ") AND (m.fecharegistro = cast('" . $fecha . "' AS DATE)
                    OR (m.fdesde <= cast('" . $fecha . "' AS DATE) AND m.fhasta >= cast('" . $fecha . "' AS DATE)))
                    AND m.idcausa IS NULL and m.fechahoraentrada is not null)";
        if (!empty($idturnotrabajo)) {
            $query .= "AND (m.idturnotrabajo = $idturnotrabajo)";
        }
        $query = $query . " AND ((m11.fdesde <= now() AND (now() <= m11.fhasta OR m11.fhasta IS NULL)) 
        AND m12.estado = 0)";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetPersonalFueraPlantilla($idestructura)
    {
        $query = new Doctrine_Query ();
        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'pers', 'per', 'InnerJoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion(
            $query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true
        );
        ZendExt_IoC_Inter::getInstance()->persona->addDQLRegimenTrabajo($query, 'pers', 'drt', 'leftJoin', true);
        $result = $query->select('pers.*,drt.idregimentrabajo as regimen,dpentd.*,dslab.*,drt.*,ddi.numero')
            ->from('DatPersona pers')
            ->leftJoin('pers.DatDocidentidad ddi')
            ->leftJoin('pers.DatRegimentrabajo drt')
            ->innerJoin('pers.DatPersonaentidad dpentd')
            ->innerJoin('dpentd.DatSituacionlaboral dslab')
            ->innerJoin('dslab.NomSituacion ns')
            ->where('dpentd.identidad =' . $idestructura . ' and ns.asociadocargo = 0');
        return $result->execute()->toArray();
    }

    public function getHorarioByPersona($idpersona, $fecha)
    {
        if (empty($fecha))
            $sql = "SELECT tt.horainicio, tt.horafin, (tt.horafin - tt.horainicio) as hlab, tt.tiempodescanso as tdescanso, rt.idgrupodescanso, 
                       rt.idregimentrabajo, nrt.tipofondotiempo, nrt.fondotiempo, tt.horaentradaps,tt.horasalidaps,tt.horaentradass,tt.horasalidass,
                       tt.toleranciaentrada,tt.toleranciasalida,tt.idturnotrabajo,tt.horarioalmuerzo,nrt.denominacion as regimen,ngd.denominacion as grupo, 
                       tt.denominacion as turno, tt.otrodia,tt.horas,cc.idtipodedia
            FROM mod_regimentrabajo.conf_calendariopersona cc
            INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt ON (cc.idturnotrabajo = tt.idturnotrabajo)
            INNER JOIN mod_personaext.dat_regimentrabajo rt	ON (cc.idpersona = rt.idpersona)
            INNER JOIN mod_regimentrabajo.nom_regimentrabajo nrt ON(rt.idregimentrabajo = nrt.idregimentrabajo)
            INNER JOIN mod_regimentrabajo.nom_grupodescanso ngd ON(rt.idgrupodescanso = ngd.idgrupodescanso)
            WHERE rt.actual = 1
            AND rt.idpersona = $idpersona";
        else
            $sql = "SELECT tt.horainicio, tt.horafin, (tt.horafin - tt.horainicio) as hlab, tt.tiempodescanso as tdescanso, rt.idgrupodescanso, 
                       rt.idregimentrabajo, nrt.tipofondotiempo, nrt.fondotiempo, tt.horaentradaps,tt.horasalidaps,tt.horaentradass,tt.horasalidass,
                       tt.toleranciaentrada,tt.toleranciasalida,tt.idturnotrabajo,tt.horarioalmuerzo,nrt.denominacion as regimen,ngd.denominacion as grupo, 
                       tt.denominacion as turno, tt.otrodia,tt.horas,cc.idtipodedia
            FROM mod_regimentrabajo.conf_calendariopersona cc
            INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt ON (cc.idturnotrabajo = tt.idturnotrabajo and cc.fecha = cast('" . $fecha . "' as date))
            INNER JOIN mod_personaext.dat_regimentrabajo rt	ON (cc.idpersona = rt.idpersona)
            INNER JOIN mod_regimentrabajo.nom_regimentrabajo nrt ON(rt.idregimentrabajo = nrt.idregimentrabajo)
            INNER JOIN mod_regimentrabajo.nom_grupodescanso ngd ON(rt.idgrupodescanso = ngd.idgrupodescanso)
            WHERE rt.actual = 1
            AND rt.idpersona = $idpersona";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql)[0];
    }

    public function getMovimiento($idpersona)
    {
        $sql = "select dm.*
                FROM  mod_rrhhmaestro.dat_movimientos dm
                WHERE dm.idpersona = $idpersona";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getControlador($idcargo)
    {
        $sql = "select dc.*
                FROM  mod_rrhhmaestro.dat_controlador dc
                WHERE dc.idcargo = $idcargo";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getControlado($idcargo)
    {
        $sql = "select dc.*
                FROM  mod_rrhhmaestro.dat_controlado dc
                WHERE dc.idcargo = $idcargo";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function GetAsistencia($idpersonas, $fdesde, $fhasta)
    {
        $sql = "SELECT da.fecharegistro,da.idpersona, da.idcausa,da.fdesde,da.fhasta,nc.abreviatura,
                (CASE WHEN ((SELECT td.trabajo FROM mod_regimentrabajo.conf_calendariopersona conf
                                  INNER JOIN mod_regimentrabajo.nom_tipodedia td ON conf.idtipodedia = td.idtipodedia
                                  WHERE conf.fecha = da.fecharegistro AND conf.idpersona = da.idpersona) = 1)
                    THEN (CASE WHEN (da.hrsdescontadas IS NOT NULL AND da.fdesde IS NULL AND da.fhasta IS NULL)
                            THEN (CASE WHEN cast(split_part(da.hrsdescontadas,':',2) AS NUMERIC) > 30
                                    THEN cf.horas - CAST(split_part(da.hrsdescontadas,':',1) AS NUMERIC) + 1
                                    ELSE cf.horas - CAST(split_part(da.hrsdescontadas,':',1) AS NUMERIC)
                                 END)
                            ELSE (CASE WHEN (da.fechahoraentrada IS NOT NULL AND da.fechahorasalida IS NOT NULL)
                                     THEN cf.horas
                                     ELSE (0)
                                  END)
                            END)
                    ELSE
                    (0)
                END) AS TRT,
                (CASE WHEN ((SELECT td.trabajo FROM mod_regimentrabajo.conf_calendariopersona conf
                                  INNER JOIN mod_regimentrabajo.nom_tipodedia td ON conf.idtipodedia = td.idtipodedia
                                  WHERE conf.fecha = da.fecharegistro AND conf.idpersona = da.idpersona) = 1)
                    THEN (CASE WHEN ((da.hrsdescontadas IS NOT NULL) AND (da.fdesde IS NULL AND da.fhasta IS NULL))
                            THEN
                                (CASE WHEN cast(split_part(da.hrsdescontadas,':',2) AS NUMERIC) > 30
                                THEN CAST(split_part(da.hrsdescontadas,':',1) AS NUMERIC) + 1
                                ELSE CAST(split_part(da.hrsdescontadas,':',1) AS NUMERIC)
                                END)
                            ELSE
                            (CASE WHEN (da.fdesde IS NOT NULL AND da.fhasta IS NOT NULL
                                AND (da.fdesde >= cast('" . $fdesde . "' AS DATE) AND da.fdesde <= cast('" . $fhasta . "' AS DATE))
                                AND (da.fhasta >= cast('" . $fdesde . "' AS DATE) AND da.fhasta <= cast('" . $fhasta . "'
                                AS DATE)))
                            THEN (CASE WHEN cast(split_part(da.hrsdescontadas,':',2) AS NUMERIC) > 30
                                    THEN CAST(split_part(da.hrsdescontadas,':',1) AS NUMERIC) + 1
                                    ELSE CAST(split_part(da.hrsdescontadas,':',1) AS NUMERIC)
                                 END)
                            ELSE
                               (CASE WHEN (da.fdesde >= cast('" . $fdesde . "' AS DATE) AND
                               da.fdesde <= cast('" . $fhasta . "' AS DATE))
                                   THEN (SELECT sum(conf.horas) FROM mod_regimentrabajo.conf_calendariopersona conf
                                          INNER JOIN mod_regimentrabajo.nom_tipodedia td ON conf.idtipodedia = td.idtipodedia
                                          WHERE conf.fecha >= da.fdesde AND conf.fecha <=  cast('" . $fhasta . "' AS DATE) AND td.trabajo = 1
                                        )
                                   ELSE (SELECT sum(conf.horas) FROM mod_regimentrabajo.conf_calendariopersona conf
                                          INNER JOIN mod_regimentrabajo.nom_tipodedia td ON conf.idtipodedia = td.idtipodedia
                                          WHERE conf.fecha >= cast('" . $fdesde . "' AS DATE) AND conf.fecha <= da.fhasta AND
                                          td.trabajo = 1
                                        )
                               END)
                            END)
                        END)
                    ELSE
                    (0)
                END) AS HP,
                (CASE WHEN da.horasextras IS NOT NULL
                    THEN (CASE WHEN cast(split_part(da.horasextras,':',2) AS NUMERIC) > 30
                                THEN CAST(split_part(da.horasextras,':',1) AS NUMERIC) + 1
                                ELSE CAST(split_part(da.horasextras,':',1) AS NUMERIC)
                                END)
                    ELSE (0)
                END) AS HE
            FROM mod_regimentrabajo.dat_asistencia da
            INNER JOIN mod_regimentrabajo.conf_calendariopersona cf ON da.idpersona = cf.idpersona  AND cf.fecha = da.fecharegistro
            LEFT JOIN mod_regimentrabajo.nom_causa nc ON nc.idcausa = da.idcausa
            WHERE da.fecharegistro >= cast('" . $fdesde . "' AS DATE)
            AND da.fecharegistro <= cast('" . $fhasta . "' AS DATE)
            AND da.idpersona IN (" . implode(',', $idpersonas) . ")
            ORDER BY da.fecharegistro";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function getAsistenciaByPersona($idpersona, $fecha)
    {
        $sql = "SELECT p.idpersona,(CASE WHEN p.snombre IS NOT NULL THEN p.nombre||' '|| p.snombre||' '|| p.papel ||' '||  p.sapel
                    ELSE p.nombre||' '|| p.papel||' '||  p.sapel END) AS nombreapellidos,a.fechahoraentrada,a.fechahorasalida,
                    c.denominacion,a.fdesde,a.fhasta,a.hrsdescontadas,a.horasextras,a.fecharegistro, a.idpersonacontrola AS idpersonacontrola, 
                    a.idpersonamodifica AS idpersonamodifica, a.idasistencia AS idasistencia, a.idcausa, doci.numero AS numid
                FROM mod_regimentrabajo.dat_asistencia a
                LEFT JOIN mod_regimentrabajo.nom_causa c ON a.idcausa = c.idcausa
                INNER JOIN mod_persona.dat_persona p ON a.idpersona = p.idpersona
                LEFT JOIN mod_persona.dat_docidentidad doci ON doci.idpersona = a.idpersona
                WHERE p.idpersona = " . $idpersona . " AND a.fecharegistro = CAST('" . $fecha . "' AS DATE)";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function GetReporteAsistRangoCargo($idpersonas, $idcargo, $fecha/*$fdesde, $fhasta*/)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT m.idasistencia AS idasistencia, m.observacion AS observacion, m.idpersona AS idpersona,m2.abreviatura AS abreviaturacausa
                    , m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS idcausa, m2.denominacion AS denominacion,
                    m2.afectasalario AS afectasalario,m.hrsdescontadas AS hrsdescontadas, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro,                                        
                    (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m14.idcargo AS idcargo,m18.denominacion AS denomcargo,
                    m11.identidad AS identidad, m12.idarea AS idarea,drt.idregimentrabajo,m.idgrupodescanso,m.idturnotrabajo,
                    (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica
                    FROM mod_regimentrabajo.dat_asistencia m
                    INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta IS NULL))) 
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo                    
                    LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa 
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.actual = 1 ";

        $where = "";

        if ($idpersonas != null && is_array($idpersonas) && count($idpersonas) > 0) {
            $where .= " WHERE (m.idpersona in (" . implode(',', $idpersonas) . ") ";
        }

        if ($idcargo != null && is_array($idcargo) && count($idcargo) > 0) {
            if (empty($where))
                $where .= " WHERE (";
            else
                $where .= " AND ";
            $where .= "m12.idcargo IN (" . implode(',', $idcargo) . ") ";
        }
        $where .= "AND ((m.fdesde is not null AND m.fhasta is not null AND m.fdesde <= cast('" . $fecha . "' as date) AND m.fhasta >= cast('" . $fecha . "' as date)) OR m.fecharegistro = cast('" . $fecha . "' as date))) ";
        $query .= $where . " ORDER BY m.fecharegistro asc";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetReporteAsistRangoByCargo($idcargo, $fdesde, $fhasta,$filtro = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT DISTINCT m.idasistencia AS idasistencia, m.observacion AS observacion, m.idpersona AS idpersona,m2.abreviatura AS abreviaturacausa
                    , m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS idcausa, m2.denominacion AS denominacion,
                    m2.afectasalario AS afectasalario,m.hrsdescontadas AS hrsdescontadas, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro,                                        
                    (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m5.numero AS numid,m14.idcargo AS idcargo,m18.denominacion AS denomcargo,
                    m11.identidad AS identidad, m12.idarea AS idarea,drt.idregimentrabajo,m.idgrupodescanso,m.idturnotrabajo,
                    (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacertifica) AS personacertifica
                    FROM mod_regimentrabajo.dat_asistencia m
                    INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona
                    LEFT JOIN mod_persona.dat_docidentidad m5 ON m3.idpersona = m5.idpersona AND m5.principal = 1
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad and m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo                    
                    LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa 
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.idcargo = m.idcargo and drt.actual = 1";

        $where = " WHERE ((m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo)
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date))))
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo))
             ";
        if (empty($filtro))
            $query .= $where . " ORDER BY m.fecharegistro asc";
        if (!empty($filtro))
            $query .= $where . " and (m3.nombre ilike '%$filtro%' or m3.snombre ilike '%$filtro%' or m3.papel ilike '%$filtro%' or m3.sapel ilike '%$filtro%') ORDER BY m.fecharegistro asc ";

        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetReporteAsistRangoCargoByFecha($idcargo, $fdesde, $fhasta)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT m.idasistencia AS idasistencia, m.observacion AS observacion, m.idpersona AS idpersona,m2.abreviatura AS abreviaturacausa
                    , m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS idcausa, m2.denominacion AS denominacion,
                    m2.afectasalario AS afectasalario,m.hrsdescontadas AS hrsdescontadas, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro,                                        
                    (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m14.idcargo AS idcargo,m18.denominacion AS denomcargo,
                    m11.identidad AS identidad, m12.idarea AS idarea,drt.idregimentrabajo,m.idgrupodescanso,m.idturnotrabajo,
                    (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacertifica) AS personacertifica
                    FROM mod_regimentrabajo.dat_asistencia m
                    INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta IS NULL))) 
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo                    
                    LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa 
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.actual = 1 AND drt.idcargo = m.idcargo ";

        $where = " WHERE (m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo)
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date))))
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo)";

        $query .= $where . " ORDER BY m.fecharegistro asc";
        $r = $conn->fetchAll($query);

        $result = array();
        foreach ($r as $d) {
            $result[$d['fecharegistro']][] = $d;
        }
        return $result;
    }

    public function GetReporteAsistFechaCargo($idcargo, $fecha,$filtro = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT m.idasistencia AS idasistencia, m.observacion AS observacion, m.idpersona AS idpersona,m2.abreviatura AS abreviaturacausa
                    , m.fechahoraentrada AS fechahoraentrada, m.fdesde AS fdesde, m.fhasta AS fhasta, m.idcausa AS idcausa, m2.denominacion AS denominacion,
                    m2.afectasalario AS afectasalario,m.hrsdescontadas AS hrsdescontadas, m.fechahorasalida AS fechahorasalida, m.fecharegistro AS fecharegistro,                                        
                    (CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m14.idcargo AS idcargo,m18.denominacion AS denomcargo,
                    m11.identidad AS identidad, m12.idarea AS idarea,drt.idregimentrabajo,m.idgrupodescanso,m.idturnotrabajo,
                    (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonacontrola) AS personacontrola,
                        (SELECT (CASE WHEN per.snombre IS NOT NULL THEN per.nombre ||' '||
                        per.snombre ||' '|| per.papel ||' '|| per.sapel ELSE per.nombre ||' '|| per.papel ||' '|| per.sapel
                        END) AS nombreapellidos FROM  mod_persona.dat_persona per 
                        WHERE per.idpersona = m.idpersonamodifica) AS personamodifica
                    FROM mod_regimentrabajo.dat_asistencia m
                    INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta IS NULL))) 
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo                    
                    LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa 
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.actual = 1 AND drt.idcargo = m.idcargo ";

        $where = " WHERE (m.fecharegistro = cast('" . $fecha . "' as date) and
			  m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo)";
        if (empty($filtro))
            $query .= $where . " ORDER BY m.fecharegistro asc";
        if (!empty($filtro))
            $query .= $where . " and (m3.nombre ilike '%$filtro%' or m3.snombre ilike '%$filtro%' or m3.papel ilike '%$filtro%' or m3.sapel ilike '%$filtro%') ORDER BY m.fecharegistro asc ";

        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetCubiertosXCargos($idcargos, $fecha)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT   count(m3.idpersona) AS cantidad            
                    FROM  mod_persona.dat_persona m3
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad and m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo                                     
                    WHERE (m12.idcargo IN (" . implode(',', $idcargos) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado IS NULL))
                    ";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetDatosPersonaFoto($idcargos, $filtro)
    {
        $dirwww = $_SERVER['DOCUMENT_ROOT'];
        $modulo_path = str_replace('web', 'apps', $dirwww) . '/pvd/persona/comun/recursos/json/' . 'staticlink.json';

        if (file_exists($modulo_path)) {
            if (is_readable($modulo_path)) {
                $staticlink = json_decode(file_get_contents($modulo_path));

            }
        }
        $sexos = ($staticlink->img_sexo) ? $staticlink->img_sexo : array();

        /*(CASE WHEN dfot.foto IS NOT NULL THEN encode(dfot.foto,'escape')
                       WHEN m3.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto*/
        //(CASE WHEN m3.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT distinct
                    m3.idpersona,(CASE WHEN m3.snombre is not null THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m5.numero as numid,m14.idcargo as       idcargo,m18.denominacion as denomcargo,
                    m11.identidad as identidad, m12.idarea as idarea,m19.contacto as correo,drt.idregimentrabajo,drt.idgrupodescanso,drt.idturnotrabajo,m3.sexo,
                    (CASE WHEN dfot.foto IS NOT NULL THEN encode(dfot.foto,'escape')
                       WHEN m3.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto                    
                    FROM mod_persona.dat_persona m3  
                    LEFT JOIN mod_persona.dat_docidentidad m5 ON m3.idpersona = m5.idpersona and m5.principal = 1
                    INNER JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta is null))) 
                    INNER JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    INNER JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    INNER JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_persona.dat_contacto m19 ON m3.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt on drt.idpersona = m3.idpersona and drt.actual = 1
                    LEFT JOIN mod_persona.dat_foto dfot on dfot.idpersona = m3.idpersona and dfot.principal = 1
                   ";
        if (empty($filtro))
            $query = $query . "WHERE m14.idcargo in (" . implode(',', $idcargos) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado is null) ";
        if (!empty($filtro))
            $query = $query . "WHERE m14.idcargo in (" . implode(',', $idcargos) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado is null) and (m3.nombre ilike '%$filtro%' or m3.snombre ilike '%$filtro%' or m3.papel ilike '%$filtro%' or m3.sapel ilike '%$filtro%') ";

        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetDatosPersonaReporte($idcargos, $filtro, $limit, $start, $fechdesde, $fechhasta, $sexo, $idregimentrabajo = null, $idgrupodescanso = null)
    {
        if (isset($fechdesde) && isset($fechhasta)) {
            $fondotiempo = " ,
                    CASE WHEN (rt.tipofondotiempo = 1)
                    THEN (
                        SELECT EXTRACT(HOUR FROM sum(cp.horas))
                        FROM
                          mod_regimentrabajo.conf_calendariopersona cp
                        WHERE
                          cp.idpersona = m3.idpersona  AND
                          cp.fecha >= CAST('" . $fechdesde . "' as date) AND
                          cp.fecha <= CAST('" . $fechhasta . "' as date) AND
                          (cp.idtipodedia = 3 OR (cp.idtipodedia = 1 AND
                                          cp.fecha IN (SELECT
                                                          f.fecha
                                                        FROM
                                                          mod_regimentrabajo.dat_diaferiadohabilitado f
                                                        WHERE
                                                          f.idpersona = cp.idpersona AND
                                                          f.fecha >= CAST('" . $fechdesde . "' as date) AND
                                                          f.fecha <= CAST('" . $fechhasta . "' as date)))))
                    ELSE rt.fondotiempo
                    END as FT ";
        } else {
            $fondotiempo = "";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT distinct
                    m3.idpersona,(CASE WHEN m3.snombre is not null THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m5.numero as numid,m14.idcargo as idcargo,m18.denominacion as denomcargo,
                    m11.identidad as identidad, m12.idarea as idarea,m19.contacto as correo,drt.idregimentrabajo,rt.denominacion regimentrabajo,drt.idgrupodescanso,
                    gd.denominacion as grupodescanso,drt.idcargo as idcargodrt,drt.fdesde as fdesdert, m12.ueb, m12.idtipocontrato, m12.fdesde as fdesdesituacionlab, m12.idsituacion
                    " . $fondotiempo . ", (select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = m12.idcargo limit 1) as ordenunico
                    FROM mod_persona.dat_persona m3
                    INNER JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    INNER JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad
                    LEFT JOIN mod_persona.dat_docidentidad m5 ON m3.idpersona = m5.idpersona and m5.principal = 1
                    INNER JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0)
                    INNER JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_persona.dat_contacto m19 ON m3.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt on drt.idpersona = m3.idpersona and drt.idcargo = m12.idcargo AND drt.actual = 1
                    LEFT JOIN mod_regimentrabajo.nom_regimentrabajo rt on drt.idregimentrabajo = rt.idregimentrabajo
                    LEFT JOIN mod_regimentrabajo.nom_grupodescanso gd on drt.idgrupodescanso = gd.idgrupodescanso
                    WHERE (m3.feliminado >= now() OR m3.feliminado is null) AND (m14.idcargo in (" . implode(',', $idcargos) . "))
                    AND (m11.fdesde <= now() AND (now() <= m11.fhasta OR m11.fhasta IS NULL)) AND m12.estado = 0";
        if (!empty($filtro))
            $query = $query . " and (m3.nombre ilike '%$filtro%' or m3.snombre ilike '%$filtro%' or m3.papel ilike '%$filtro%' or m3.sapel ilike '%$filtro%') ";
        if ($sexo != null)
            $query = $query . "AND (m3.sexo = " . $sexo . ") ";

        if ($idregimentrabajo != null)
            $query = $query . "AND (drt.idregimentrabajo = " . $idregimentrabajo . ") ";

        if ($idgrupodescanso != null)
            $query = $query . "AND (drt.idgrupodescanso = " . $idgrupodescanso . ") ";

        $query = $query . " ORDER BY ordenunico ASC";
        if (is_numeric($limit))
            $query = $query . " limit " . $limit . " offset " . $start;
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetDatosPersonaReporteAsistMensual($idcargos, $filtro, $limit, $start, $fechdesde, $fechhasta, $sexo, $idregimentrabajo = null, $idgrupodescanso = null, $historico = null)
    {
        if (isset($fechdesde) && isset($fechhasta)) {
            $fondotiempo = " ,
                    CASE WHEN (rt.tipofondotiempo = 1)
                    THEN (
                        SELECT EXTRACT(HOUR FROM sum(cp.horas))
                        FROM
                          mod_regimentrabajo.conf_calendariopersona cp
                        WHERE
                          cp.idpersona = m3.idpersona  AND
                          cp.idcargo = m14.idcargo and
                          cp.fecha >= TO_DATE('$fechdesde', 'DD/MM/YYYY') AND
                          cp.fecha <= TO_DATE('$fechhasta ', 'DD/MM/YYYY') AND
                          (cp.idtipodedia = 3 OR (cp.idtipodedia = 1 AND
                                          cp.fecha IN (SELECT
                                                          f.fecha
                                                        FROM
                                                          mod_regimentrabajo.dat_diaferiadohabilitado f
                                                        WHERE
                                                          f.idpersona = cp.idpersona AND
                                                          f.fecha >= TO_DATE('$fechdesde', 'DD/MM/YYYY') AND
                                                          f.fecha <= TO_DATE('$fechhasta ', 'DD/MM/YYYY')))))
                    ELSE rt.fondotiempo
                    END as FT ";
        } else {
            $fondotiempo = "";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT distinct
                    m3.idpersona,(CASE WHEN m3.snombre is not null THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m5.numero as numid,m14.idcargo as idcargo,m18.denominacion as denomcargo,
                    m11.identidad as identidad, m12.idarea as idarea,m19.contacto as correo,drt.idregimentrabajo,rt.denominacion regimentrabajo,drt.idgrupodescanso,
                    gd.denominacion as grupodescanso,drt.idcargo as idcargodrt,drt.fdesde as fdesdert, m12.ueb, m12.idtipocontrato, m12.fdesde as fdesdesituacionlab, m12.idsituacion
                    " . $fondotiempo . ", (select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = m12.idcargo limit 1) as ordenunico, (CASE WHEN m12.estado = 2 THEN 'Baja' when m12.estado = 1 THEN 'Movimiento' END) as estado, 
                    m12.fhasta as hasta
                    FROM mod_persona.dat_persona m3
                    INNER JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    INNER JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad 
                    LEFT JOIN mod_persona.dat_docidentidad m5 ON m3.idpersona = m5.idpersona and m5.principal = 1
                    INNER JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0)
                    INNER JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_persona.dat_contacto m19 ON m3.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt on drt.idpersona = m3.idpersona and drt.idcargo = m12.idcargo
                    LEFT JOIN mod_regimentrabajo.nom_regimentrabajo rt on drt.idregimentrabajo = rt.idregimentrabajo
                    LEFT JOIN mod_regimentrabajo.nom_grupodescanso gd on drt.idgrupodescanso = gd.idgrupodescanso
                    WHERE (m3.feliminado >= now() OR m3.feliminado is null) AND (m14.idcargo in (" . implode(',', $idcargos) . "))
                    ";
        if (!empty($filtro))
            $query = $query . " and (m3.nombre ilike '%$filtro%' or m3.snombre ilike '%$filtro%' or m3.papel ilike '%$filtro%' or m3.sapel ilike '%$filtro%') ";
        if ($sexo != null)
            $query = $query . "AND (m3.sexo = " . $sexo . ") ";

        if ($idregimentrabajo != null)
            $query = $query . "AND (drt.idregimentrabajo = " . $idregimentrabajo . ") ";

        if ($idgrupodescanso != null)
            $query = $query . "AND (drt.idgrupodescanso = " . $idgrupodescanso . ") ";
        if($historico == 1)
            $query = $query . "AND (m12.fhasta >= TO_DATE('$fechdesde', 'DD/MM/YYYY') and m12.fhasta <= TO_DATE('$fechhasta ', 'DD/MM/YYYY')) and m12.estado != 0 and (drt.fhasta is null or (drt.fhasta is not null and drt.fhasta > CAST ('" . $fechdesde . "' as date)))";
        else{
            $query = $query . "  AND drt.actual = 1 and (m11.fhasta IS NULL or m11.fhasta > TO_DATE('$fechdesde', 'DD/MM/YYYY')) 
            AND (m12.estado = 0 OR (m12.estado = 2 AND m12.fhasta > CAST ('" . $fechdesde . "' as date))) and m11.fdesde <= TO_DATE('$fechhasta ', 'DD/MM/YYYY')";
        }
        $query = $query . " ORDER BY ordenunico ASC";
        if (is_numeric($limit))
            $query = $query . " limit " . $limit . " offset " . $start;

        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function getdatospersona($idspersonas, $fdesde = null, $fhasta = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($fdesde != null && $fhasta != null) {
            $fondotiempo = " ,
                    CASE WHEN (rt.tipofondotiempo = 1) 
                    THEN (
                        SELECT EXTRACT(HOUR FROM sum(cp.horas))
                        FROM 
                          mod_regimentrabajo.conf_calendariopersona cp
                        WHERE
                          cp.idpersona = m3.idpersona AND 
                          cp.fecha >= CAST('" . $fdesde . "' as date) AND
                          cp.fecha <= CAST('" . $fhasta . "' as date) AND
                          (cp.idtipodedia = 3 OR (cp.idtipodedia = 1 AND 
                                          cp.fecha IN (SELECT   
                                                          f.fecha
                                                        FROM 
                                                          mod_regimentrabajo.dat_diaferiadohabilitado f
                                                        WHERE
                                                          f.idpersona = cp.idpersona AND 
                                                          f.fecha >= CAST('" . $fdesde . "' as date) AND
                                                          f.fecha <= CAST('" . $fhasta . "' as date))))) 
                    ELSE rt.fondotiempo
                    END as FT ";
        } else {
            $fondotiempo = "";
        }

        $query = "SELECT  m3.idpersona,(CASE WHEN m3.snombre is not null THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m3.nombre, m3.snombre, m3.papel,m3.sapel,m14.idcargo as idcargo,m18.denominacion as denomcargo,
                    m11.identidad as identidad, m12.idarea as idarea,doc.numero as noidentidad,m19.contacto as correo,m12.ueb,
                    drt.idregimentrabajo,drt.idgrupodescanso,drt.idturnotrabajo " . $fondotiempo . ", (select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = m12.idcargo limit 1) as ordenunico 
                    FROM  mod_persona.dat_persona m3
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta is null))) 
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_persona.dat_docidentidad doc ON (m3.idpersona = doc.idpersona) AND (doc.principal = 1)
                    LEFT JOIN mod_persona.dat_contacto m19 ON m3.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt on drt.idpersona = m3.idpersona and drt.actual = 1
                    LEFT JOIN mod_regimentrabajo.nom_regimentrabajo rt on drt.idregimentrabajo = rt.idregimentrabajo
                    WHERE (m3.idpersona IN (" . implode(',', $idspersonas) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado is null) AND m12.estado = 0) ORDER BY ordenunico ASC";
        $personas = $conn->fetchAll($query);
        return $personas;
    }
	
	    public function getdatospersonaAsistMens($idspersonas, $fdesde = null, $fhasta = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($fdesde != null && $fhasta != null) {
            $fondotiempo = " ,
                    CASE WHEN (rt.tipofondotiempo = 1) 
                    THEN (
                        SELECT EXTRACT(HOUR FROM sum(cp.horas))
                        FROM 
                          mod_regimentrabajo.conf_calendariopersona cp
                        WHERE
                          cp.idpersona = m3.idpersona AND 
                          cp.fecha >= CAST('" . $fdesde . "' as date) AND
                          cp.fecha <= CAST('" . $fhasta . "' as date) AND
                          (cp.idtipodedia = 3 OR (cp.idtipodedia = 1 AND 
                                          cp.fecha IN (SELECT   
                                                          f.fecha
                                                        FROM 
                                                          mod_regimentrabajo.dat_diaferiadohabilitado f
                                                        WHERE
                                                          f.idpersona = cp.idpersona AND 
                                                          f.fecha >= CAST('" . $fdesde . "' as date) AND
                                                          f.fecha <= CAST('" . $fhasta . "' as date))))) 
                    ELSE rt.fondotiempo
                    END as FT ";
        } else {
            $fondotiempo = "";
        }

        $query = "SELECT  m3.idpersona,(CASE WHEN m3.snombre is not null THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m3.nombre, m3.snombre, m3.papel,m3.sapel,m14.idcargo as idcargo,m18.denominacion as denomcargo,
                    m11.identidad as identidad, m12.idarea as idarea,doc.numero as noidentidad,m19.contacto as correo,m12.ueb,
                    drt.idregimentrabajo,drt.idgrupodescanso,drt.idturnotrabajo " . $fondotiempo . ", (select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = m12.idcargo limit 1) as ordenunico 
                    FROM  mod_persona.dat_persona m3
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona and (m11.fhasta IS NULL or m11.fhasta > CAST('" . $fdesde . "' as date))
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND (m12.estado = 0 OR (m12.estado = 2 AND m12.fhasta > CAST ('" . $fdesde . "' as date)))
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_persona.dat_docidentidad doc ON (m3.idpersona = doc.idpersona) AND (doc.principal = 1)
                    LEFT JOIN mod_persona.dat_contacto m19 ON m3.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt on drt.idpersona = m3.idpersona and drt.actual = 1
                    LEFT JOIN mod_regimentrabajo.nom_regimentrabajo rt on drt.idregimentrabajo = rt.idregimentrabajo
                    WHERE (m3.idpersona IN (" . implode(',', $idspersonas) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado is null)) ORDER BY ordenunico ASC";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function getdatospersonasincargo($idpersonas, $fdesde = null, $fhasta = null)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($fdesde != null && $fhasta != null) {
            $fondotiempo = " ,
                    CASE WHEN (rt.tipofondotiempo = 1) 
                    THEN (
                        SELECT EXTRACT(HOUR FROM sum(cp.horas))
                        FROM 
                          mod_regimentrabajo.conf_calendariopersona cp
                        WHERE
                          cp.idpersona = m3.idpersona AND cp.idcargo = m12.idcargo AND 
                          cp.fecha >= CAST('" . $fdesde . "' as date) AND
                          cp.fecha <= CAST('" . $fhasta . "' as date) AND
                          (cp.idtipodedia = 3 OR (cp.idtipodedia = 1 AND 
                                          cp.fecha IN (SELECT   
                                                          f.fecha
                                                        FROM 
                                                          mod_regimentrabajo.dat_diaferiadohabilitado f
                                                        WHERE
                                                          f.idpersona = cp.idpersona AND 
                                                          f.fecha >= CAST('" . $fdesde . "' as date) AND
                                                          f.fecha <= CAST('" . $fhasta . "' as date))))) 
                    ELSE rt.fondotiempo
                    END as FT ";
        } else {
            $fondotiempo = "";
        }

        $query = "SELECT  m3.idpersona,(CASE WHEN m3.snombre is not null THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m3.nombre, m3.snombre, m3.papel,m3.sapel,m14.idcargo as idcargo,m18.denominacion as denomcargo,
                    m11.identidad as identidad, m12.idarea as idarea,doc.numero as noidentidad,m19.contacto as correo,m12.ueb,
                    drt.idregimentrabajo,drt.idgrupodescanso,drt.idturnotrabajo " . $fondotiempo . ", (select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = m12.idcargo limit 1) as ordenunico 
                    FROM  mod_persona.dat_persona m3
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta is null))) 
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_persona.dat_docidentidad doc ON (m3.idpersona = doc.idpersona) AND (doc.principal = 1)
                    LEFT JOIN mod_persona.dat_contacto m19 ON m3.idpersona = m19.idpersona AND (m19.oficial = 1) AND (m19.idtipomediocontacto = 2)
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt on drt.idpersona = m3.idpersona and drt.actual = 1 and drt.idcargo = m12.idcargo
                    LEFT JOIN mod_regimentrabajo.nom_regimentrabajo rt on drt.idregimentrabajo = rt.idregimentrabajo
                    WHERE (m3.idpersona IN (" . implode(',', $idpersonas) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado is null)) ORDER BY ordenunico ASC";
        $personas = $conn->fetchAll($query);

        return $personas;
    }

    public function getAsistByArrIdasistFechaWithSesion($arrIdasistencia, $fecharegistro)
    {
        $query = Doctrine_Query::create()
            ->select('a.*,s.*')
            ->from('DatAsistencia a')
            ->leftJoin('a.DatAsistenciasesion s')
            ->where("a.fecharegistro = cast('" . $fecharegistro . "' as date) and a.idasistencia in (" . $arrIdasistencia . ") and a.idasistencia = s.idasistencia")
            ->orderBy('s.idsesion');

        return $query->execute();
    }

    public function Certificar($fdesde, $fhasta, $idsasistencia, $idpersonacertifica)
    {
        $q = Doctrine_Query::create()
            ->update('DatAsistencia da')
            ->set('da.certificado', '?', 1)
            ->set('da.idpersonacertifica', '?', $idpersonacertifica)
            ->where("da.fecharegistro >= cast('" . $fdesde . "' as date) and da.fecharegistro <= cast('" . $fhasta . "' as date) and da.fhasta is null and da.fdesde is null and da.idasistencia in (" . implode(',', $idsasistencia) . ")")
            ->orWhere("da.fhasta is not null and da.fdesde is not null and((da.fhasta <= cast('" . $fhasta . "' as date) and da.fhasta >= cast('" . $fdesde . "' as date))
                        or (da.fdesde <= cast('" . $fhasta . "' as date) and da.fdesde >= cast('" . $fdesde . "' as date)) or (
                        (da.fhasta >= cast('" . $fhasta . "' as date) and da.fdesde <= cast('" . $fdesde . "' as date)))) and da.idasistencia in (" . implode(',', $idsasistencia) . ")");
        //print_r($q->getSqlQuery());die;
        return $q->execute();
    }

    public function QuitarCertificacion($fdesde, $fhasta, $idpersonas, $idpersonacertifica)
    {
        $q = Doctrine_Query::create()
            ->update('DatAsistencia da')
            ->set('da.certificado', 0)
            ->set('da.idpersonacertifica', "null")
            ->where("da.fecharegistro >= cast('" . $fdesde . "' as date) and da.fecharegistro <= cast('" . $fhasta . "' as date) and da.fhasta is null and da.fdesde is null and da.idpersona in (" . implode(',', $idpersonas) . ")")
            ->orWhere("da.fhasta is not null and da.fdesde is not null and((da.fhasta <= cast('" . $fhasta . "' as date) and da.fhasta >= cast('" . $fdesde . "' as date))
                        or (da.fdesde <= cast('" . $fhasta . "' as date) and da.fdesde >= cast('" . $fdesde . "' as date)) or (
                        (da.fhasta >= cast('" . $fhasta . "' as date) and da.fdesde <= cast('" . $fdesde . "' as date))))")
            ->andWhere("da.idpersona in (" . implode(',', $idpersonas) . ")");
        return $q->execute();
       /* $sql = "UPDATE mod_regimentrabajo.dat_asistencia
                SET certificado = 0,
                    idpersonacertifica = NULL
                WHERE (fecharegistro >= cast ('" . $fdesde . "' AS DATE) AND
                      fecharegistro <= cast ('" . $fhasta . "' AS DATE) AND
                      fhasta IS NULL AND
                      fdesde IS NULL AND
                      idpersona IN (" . implode(',', $idpersonas) . ")) OR
                      (fhasta IS NOT NULL AND
                      fdesde IS NOT NULL AND
                      ((fhasta <= cast ('" . $fhasta . "' AS DATE) AND
                      fhasta >= cast ('" . $fdesde . "' AS DATE)) OR
                      (fdesde <= cast ('" . $fhasta . "' AS DATE) AND
                      fdesde >= cast ('" . $fdesde . "' AS DATE)) OR
                      ((fhasta >= cast ('" . $fhasta . "' AS DATE) AND
                      fdesde <= cast ('" . $fdesde . "' AS DATE))))) AND
                      idpersona IN (" . implode(',', $idpersonas) . ")";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        return true;*/
    }

    public function ChangePeriod($idasistencia)
    {
        $sql = "UPDATE 
          mod_regimentrabajo.dat_asistencia 
        SET   
          fhasta = NULL::DATE ,        
          fdesde = NULL::DATE         
        WHERE 
          idasistencia = " . $idasistencia;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        return true;
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'Enero';
        } else if ($mesnum == 2) {
            return 'Febrero';
        } else if ($mesnum == 3) {
            return 'Marzo';
        } else if ($mesnum == 4) {
            return 'Abril';
        } else if ($mesnum == 5) {
            return 'Mayo';
        } else if ($mesnum == 6) {
            return 'Junio';
        } else if ($mesnum == 7) {
            return 'Julio';
        } else if ($mesnum == 8) {
            return 'Agosto';
        } else if ($mesnum == 9) {
            return 'Septiembre';
        } else if ($mesnum == 10) {
            return 'Octubre';
        } else if ($mesnum == 11) {
            return 'Noviembre';
        } else if ($mesnum == 12) {
            return 'Diciembre';
        } else {
            return '';
        }
    }

    public function GetDiferenciaHoras($fdesde, $fhasta)
    {
        $sql = "
            SELECT (CASE
                      WHEN CAST (asis.fechahoraentrada AS TIME) > CAST (tt.horafin AS TIME) THEN CAST ('-'||(SELECT cc.horas
             FROM mod_regimentrabajo.conf_calendariopersona cc
             LEFT JOIN mod_personaext.dat_regimentrabajo tr ON tr.idpersona = cc.idpersona AND tr.actual = 1
             WHERE cc.fecha = CAST (asis.fecharegistro AS DATE) AND
                   cc.idpersona = tr.idpersona AND  
                   tr.idpersona = asis.idpersona AND                                                                                  
                   cc.idtipodedia = 3) AS INTERVAL)
                      ELSE (CASE
                              WHEN CAST (asis.fechahoraentrada AS TIME) < CAST (tt.horarioalmuerzo AS TIME) THEN (CAST (tt.horainicio AS TIME) -
                   (
                     SELECT CAST (da.fechahoraentrada AS TIME)
                     FROM mod_regimentrabajo.dat_asistencia da
                     WHERE da.fecharegistro = asis.fecharegistro AND
                           da.idpersona = asis.idpersona
                     LIMIT 1
                   ))
                              ELSE (CASE
                                      WHEN (CAST (asis.fechahoraentrada AS TIME) >= CAST (tt.horarioalmuerzo AS TIME) AND (CAST (asis.fechahoraentrada AS TIME) <=
                                        CAST ((CAST (tt.horarioalmuerzo AS INTERVAL) + CAST (tt.tiempodescanso AS INTERVAL)) AS TIME))) THEN (CAST (tt.horainicio
                                        AS TIME) - CAST (tt.horarioalmuerzo AS TIME))
                                      ELSE (CAST (tt.horainicio AS TIME) -((
                                                                             SELECT CAST (da.fechahoraentrada AS TIME)
                                                                             FROM mod_regimentrabajo.dat_asistencia da
                                                                             WHERE da.fecharegistro = asis.fecharegistro AND
                                                                                   da.idpersona = asis.idpersona
                                                                             LIMIT 1
                   ) - CAST (tt.tiempodescanso AS INTERVAL)))
                                    END)
                            END)
                    END) AS diferenciaentrada,
                   CASE
         WHEN (asis.fechahorasalida IS NULL OR cast(asis.fechahorasalida AS TIME) <= tt.horainicio) THEN (CAST ('-'||(SELECT cc.horas
             FROM mod_regimentrabajo.conf_calendariopersona cc
             LEFT JOIN mod_personaext.dat_regimentrabajo tr ON tr.idpersona = cc.idpersona AND tr.actual = 1
             WHERE cc.fecha = CAST (asis.fecharegistro AS DATE) AND
                   cc.idpersona = tr.idpersona AND  
                   tr.idpersona = asis.idpersona AND                                                                                  
                   cc.idtipodedia = 3) AS INTERVAL))
         ELSE (CASE
                 WHEN CAST (asis.fechahorasalida AS TIME) > CAST ((CAST (tt.horarioalmuerzo AS INTERVAL) + CAST (
                   tt.tiempodescanso AS INTERVAL)) AS TIME) THEN ((
                                                                         SELECT CAST (da.fechahorasalida AS TIME)
                                                                         FROM mod_regimentrabajo.dat_asistencia da
                                                                         WHERE da.fecharegistro = asis.fecharegistro AND
                                                                               da.idpersona = asis.idpersona
                                                                         LIMIT 1
       ) - CAST (tt.horafin AS TIME))
                 ELSE (CASE
                         WHEN (CAST (asis.fechahorasalida AS TIME) >= CAST (tt.horarioalmuerzo AS TIME) AND
                           CAST(asis.fechahorasalida AS TIME) <= CAST ((CAST (tt.horarioalmuerzo AS INTERVAL) + CAST (tt.tiempodescanso
                           AS INTERVAL)) AS TIME)) THEN (CAST ((CAST (tt.horarioalmuerzo AS INTERVAL) + CAST (
                           tt.tiempodescanso AS INTERVAL)) AS TIME) - CAST (tt.horafin AS TIME))
                         ELSE ((
                                 SELECT CAST (CAST(da.fechahorasalida AS TIME) AS INTERVAL)
                                 FROM mod_regimentrabajo.dat_asistencia da
                                 WHERE da.fecharegistro = asis.fecharegistro AND
                                       da.idpersona = asis.idpersona
                                 LIMIT 1
       ) -(CAST (tt.horafin AS INTERVAL) - CAST (tt.tiempodescanso AS INTERVAL)))
                       END)
               END)
       END AS diferenciasalida,
       CASE
         WHEN (asis.fdesde IS NOT NULL AND asis.fhasta IS NOT NULL) THEN (
                                                                           SELECT sum(cc.horas)
                                                                           FROM mod_regimentrabajo.conf_calendariopersona cc
                                                                           WHERE cc.fecha >= asis.fdesde AND
                                                                                 cc.fecha <= asis.fhasta AND
                                                                                 cc.idpersona = rt.idpersona AND
                                                                                 cc.idtipodedia = 3
       )
         ELSE NULL
       END AS tiempoperiodo,      
       (
       		SELECT td.trabajo FROM mod_regimentrabajo.conf_calendariopersona c 
            			INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
             WHERE c.fecha = asis.fecharegistro AND c.idpersona = rt.idpersona
       ) AS trabajo,
       (
       		SELECT td.feriado FROM mod_regimentrabajo.conf_calendariopersona c 
            			INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
             WHERE c.fecha = asis.fecharegistro AND c.idpersona = rt.idpersona
       ) AS feriado,
       (
       		SELECT c.horas FROM mod_regimentrabajo.conf_calendariopersona c 
             INNER JOIN mod_regimentrabajo.nom_tipodedia td ON c.idtipodedia = td.idtipodedia
             WHERE (td.trabajo = 1 OR (td.feriado = 1 AND   
             asis.fecharegistro IN (SELECT fh.fecha FROM mod_regimentrabajo.dat_diaferiadohabilitado fh WHERE fh.idpersona = asis.idpersona))) 
             AND c.idpersona = rt.idpersona AND  c.fecha = asis.fecharegistro
       ) AS horas,
                   asis.idasistencia,asis.idcausa,nc.afectasalario,
                   asis.fechahoraentrada,
                    asis.idpersona,
                   asis.fechahorasalida,asis.fecharegistro, rt.idgrupodescanso,
                   CASE WHEN CURRENT_DATE = asis.fecharegistro THEN 1 ELSE 0 END AS fechaactual
            FROM mod_regimentrabajo.dat_asistencia asis
                 INNER JOIN mod_personaext.dat_regimentrabajo rt ON asis.idpersona = rt.idpersona AND rt.fhasta IS NULL
                 INNER JOIN mod_regimentrabajo.conf_calendariopersona cal ON rt.idpersona = cal.idpersona AND (cal.fecha >= cast('" . $fdesde . "' AS DATE) AND  cal.fecha <= cast('" . $fhasta . "' AS DATE))
                 INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt ON cal.idturnotrabajo = tt.idturnotrabajo
                 LEFT JOIN mod_regimentrabajo.nom_causa nc ON nc.idcausa = asis.idcausa 
            WHERE asis.fecharegistro >= CAST ('" . $fdesde . "' AS DATE) AND
                  asis.fecharegistro <= CAST ('" . $fhasta . "' AS DATE)
        ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function ExecuteSQL($sqls)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        foreach ($sqls as $sql) {
            $conn->execute($sql);
        }
        $conn->commit();
        return true;
    }

    public function cantDiasLaborablesCausa($idpersona, $idcausa, $fdesde, $fhasta)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT 
                     distinct p.idpersona,
                     sum(cantlaborables)
                     FROM
                     (SELECT 
                      da.idasistencia,
                      da.fechahoraentrada,
                      da.idcausa,
                      da.fdesde,
                      da.fhasta, 
                      da.idpersona,
                      da.fechahorasalida,
                      da.fecharegistro,
                      (da.fhasta-da.fdesde)+1 as dias,
                      (SELECT 
                          count(cc.idcalendariopersona) as cantidad
                        FROM 
                          mod_regimentrabajo.conf_calendariopersona cc
                          inner join mod_regimentrabajo.nom_tipodedia td on cc.idtipodedia = td.idtipodedia and td.trabajo = 1 and td.feriado = 0
                        WHERE 
                            (
                                cc.fecha >= CASE WHEN da.fdesde < cast('" . $fdesde . "' as date) THEN cast('" . $fdesde . "' as date) ELSE da.fdesde END
                            and cc.fecha <= CASE WHEN da.fhasta > cast('" . $fhasta . "' as date) THEN cast('" . $fhasta . "' as date) ELSE da.fhasta END
                            )
                            or
                            (
                                cc.fecha = da.fecharegistro
                            )
                            ) as cantlaborables
                      
                    FROM 
                      mod_regimentrabajo.dat_asistencia da
                    WHERE 
                        da.idcausa = $idcausa
                        and (
                                (da.fdesde is null and da.fhasta is null and da.fecharegistro >= cast('" . $fdesde . "' as date) and da.fecharegistro <= cast('" . $fhasta . "' as date))
                                OR
                                (
                                    ((da.fdesde >=  cast('" . $fdesde . "' as date) and da.fdesde <= cast('" . $fhasta . "' as date))) 
                                    OR
                                    ((da.fhasta >=  cast('" . $fdesde . "' as date) and da.fhasta <= cast('" . $fhasta . "' as date))) 
                                    OR
                                    ((da.fdesde <=  cast('" . $fdesde . "' as date) and da.fhasta >= cast('" . $fhasta . "' as date)))
                                )    	
                            )
                            and idpersona = $idpersona) as p
                        group by p.idpersona";
        $personas = $conn->fetchAll($query);
        if (count($personas) == 0)
            $personas[0]['sum'] = 0;
        return $personas;
    }

    public function getCargosPorCatOcupacional($idcargos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT 
              dc.idcargo,
             cc.idcategocup,
             co.denominacion
            FROM 
              mod_estructuracomp.dat_cargo dc
              INNER JOIN mod_estructuracomp.dat_cargocivil cc ON cc.idcargo = dc.idcargo
              INNER JOIN mod_estructuracomp.nom_categocup co ON co.idcategocup = cc.idcategocup WHERE dc.idcargo IN (" . implode(',', $idcargos) . ") 
              ORDER BY co.denominacion";
        $cargos = $conn->fetchAll($query);
        $result = array();
        foreach ($cargos as $c) {
            $result[$c['idcategocup']]['denominacion'] = $c['denominacion'];
            $result[$c['idcategocup']]['cargos'][] = $c['idcargo'];
        }

        return $result;
    }

    public function getCargosPorCatOcup($idcategocup)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT 
              dc.idcargo            
            FROM 
              mod_estructuracomp.dat_cargo dc
              INNER JOIN mod_estructuracomp.dat_cargocivil cc ON cc.idcargo = dc.idcargo
              INNER JOIN mod_estructuracomp.nom_categocup co ON co.idcategocup = cc.idcategocup WHERE cc.idcategocup = $idcategocup
              order by co.denominacion";
        $cargos = $conn->fetchAll($query);

        return $cargos;
    }

    public function getCargosPorSexo($idcargos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT sl.idcargo,p.sexo
                    FROM  mod_persona.dat_persona p
                    INNER JOIN mod_persona.dat_personaentidad pe ON p.idpersona = pe.idpersona AND ((pe.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= pe.fhasta OR pe.fhasta IS NULL))) 
                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0 AND  sl.principal = 1             
                    WHERE sl.idcargo IN (" . implode(',', $idcargos) . ") AND p.feliminado IS NULL ORDER BY p.sexo";
        $cargos = $conn->fetchAll($query);
        $result = array();

        foreach ($cargos as $c) {
            if ($c['sexo'] == 0)
                $result[$c['sexo']]['denominacion'] = 'Femenino';
            else
                $result[$c['sexo']]['denominacion'] = 'Masculino';
            $result[$c['sexo']]['cargos'][] = $c['idcargo'];
        }
        return $result;
    }

    public function getCargosBySexo($sexo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT DISTINCT sl.idcargo, p.sexo
                    FROM  mod_persona.dat_persona p
                    inner JOIN mod_persona.dat_personaentidad pe ON p.idpersona = pe.idpersona AND ((pe.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= pe.fhasta OR pe.fhasta is null))) 
                    inner JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0 AND  sl.principal = 1             
                    WHERE p.sexo = $sexo and p.feliminado is null order by p.sexo";
        $result = $conn->fetchAll($query);
        return $result;
    }

    public function EliminarCausaFromAsistencia($idpersona)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        ////////////////Cuando tienes causa y entras por el sistema y le quitas la causa en el dia////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $qconcausa = "SELECT idasistencia, fhasta, fdesde, idpersonacontrola, idcausa FROM 
                          mod_regimentrabajo.dat_asistencia 
                        WHERE
                          idpersona = " . $idpersona . " 
                          AND idcausa IS NOT NULL
                          AND fdesde <=  cast('" . date('Y-m-d') . "' AS date) 
                          AND fhasta >= cast('" . date('Y-m-d') . "' AS date)
                       ";
        $concausa = $conn->fetchAll($qconcausa);


        //Si tiene causa de periodo, y esta causa no es puesta hoy, se le modifica la causa
        if (count($concausa) > 0) {

//            $regimen = "SELECT
//                              idpersona
//                             FROM
//                              mod_personaext.dat_regimentrabajo
//                             WHERE
//                             idpersona = " . $idpersona . " and actual = 1;";
//            $rRegimen = $conn->fetchAll($regimen);


            //if (count($rRegimen) > 0) {
            $Calendario = "SELECT
                                      idcalendariopersona,
                                      horas
                                    FROM
                                      mod_regimentrabajo.conf_calendariopersona
                                    WHERE
                                        idpersona = " . $idpersona . " AND fecha = cast('" . date('d/m/Y') . "' AS date) AND horas > '00:00'
                                      ;";
            $rCalendario = $conn->fetchAll($Calendario);
            // }

            $h = explode(':', $rCalendario[0]['horas']);

            $fdesde = DateTime::createFromFormat("d/m/Y", $concausa[0]['fdesde']);
            $hoy = DateTime::createFromFormat("d/m/Y", date("d/m/Y"));

            if ($fdesde < $hoy) {

                $hoycopiah = DateTime::createFromFormat("d/m/Y", $hoy->format('d/m/Y'));
                $fhastanew = $hoycopiah->modify("-1 day");
                $interval = $fdesde->diff($fhastanew);
                $dias = $interval->format('%a') + 1;
                $desc = (int)$h[0] * $dias . ':00';
                $descontadas = ($desc < 10) ? '0' . $desc : $desc;

                $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                      fhasta = now() - CAST('1 days' AS INTERVAL),
                                      hrsdescontadas = '" . $descontadas . "'
									  WHERE 
                                      idasistencia = " . $concausa[0]['idasistencia'];
                $resultado = $conn->prepare($AsistenciaUpdate);
                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($AsistenciaUpdate);
                $res->execute();

            }

            if ($fdesde == $hoy) {
                $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                       idcausa = NULL,
                                      fdesde = NULL,
                                      fhasta = NULL,                                                                       
									  idpersonacontrola = NULL,
									  hrsdescontadas = NULL 
                                    WHERE
                                      idasistencia = " . $concausa[0]['idasistencia'];
                $resultado = $conn->prepare($AsistenciaUpdate);
                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($AsistenciaUpdate);
                $res->execute();
            }

            $fhasta = DateTime::createFromFormat("d/m/Y", $concausa[0]['fhasta']);

            //Si es una causa que el fhasta es mayor que el dia de hoy, creo la misma causa a partir de mannana
            if ($fhasta > $hoy) {
                $hoycopia = DateTime::createFromFormat("d/m/Y", $hoy->format('d/m/Y'));
                $fdesdenew = $hoycopia->add(new DateInterval('P1D'));
                $interval = $fdesdenew->diff($fhasta);
                $dias = $interval->format('%a') + 1;
                $desc = (int)$h[0] * $dias . ':00';
                $descontadas = ($desc < 10) ? '0' . $desc : $desc;

                $AsistenciaInsert = "INSERT INTO
                                      mod_regimentrabajo.dat_asistencia
                                    (
                                      idcausa,
                                      fdesde,
                                      fhasta, 
                                      hrsdescontadas,                                
                                      idpersona,
                                      fecharegistro,
									  idpersonacontrola
                                    )
                                    VALUES (" . $concausa[0]['idcausa'] . ",now() + CAST('1 days' AS INTERVAL),   cast('" . date_format($fhasta, 'Y-m-d') . "' AS date),'" . $descontadas . "'," . $idpersona . ", now() + CAST('1 days' AS INTERVAL), " . $concausa[0]['idpersonacontrola'] . ");";

                $resultado = $conn->prepare($AsistenciaInsert);

                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($AsistenciaInsert);
                $res->execute();

            }
        }

        //Buscando si tiene una causa el dia de hoy que no es de rango
        $qcausahoy = "SELECT idasistencia FROM 
                          mod_regimentrabajo.dat_asistencia 
                        WHERE
                          idpersona = " . $idpersona . " 
                          AND idcausa IS NOT NULL
                          AND fecharegistro =  cast('" . date('Y-m-d') . "' AS date)";
        $causahoy = $conn->fetchAll($qcausahoy);


        if (count($causahoy) > 0) {
            $AsistenciaUpdate = "UPDATE
                                      mod_regimentrabajo.dat_asistencia
                                    SET
                                       idcausa = NULL,  
									  idpersonacontrola = NULL,
									  hrsdescontadas = NULL
                                    WHERE
                                      idasistencia = " . $causahoy[0]['idasistencia'];
            $resultado = $conn->prepare($AsistenciaUpdate);
            $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
            $res = $DBC->prepare($AsistenciaUpdate);
            $res->execute();

        }
        return $result['success'] = true;
    }

    public function getAsistenciabyCausa($causas, $idspersona, $grupos, $finicio, $ffin, $dias)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( '{" . implode(',', $causas) . "}','{" . implode(',', $idspersona) . "}','{" . implode(',', $grupos) . "}', TO_DATE('$finicio', 'DD/MM/YYYY'), TO_DATE('$ffin', 'DD/MM/YYYY'),'{" . implode(',', $dias) . "}');";
        $result = $conn->fetchAll($query);

        $r = array();
        foreach ($result as $d) {
            $r[$d['idpersona']][] = $d;
        }

        return $r;
    }

    public function getRegimenByPerson($idpersona)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $regimen = "SELECT *
                             FROM
                              mod_personaext.dat_regimentrabajo 
                             WHERE
                             idpersona = " . $idpersona . " AND actual = 1;";
        $rRegimen = $conn->fetchAll($regimen);

        return $rRegimen;
    }

    public function getAsistVacacionesByPersonANDDia($idpersona, $mes, $year)
    {
        $sql = "SELECT a.fdesde,a.fhasta, a.idasistencia AS idasistencia
                FROM mod_regimentrabajo.dat_asistencia a
                WHERE a.idpersona = " . $idpersona . " AND a.idcausa = 4 AND 
                EXTRACT(MONTH FROM a.fecharegistro) = " . $mes . " AND EXTRACT(YEAR FROM a.fecharegistro) = " . $year . ";";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getAsistVacacionesByPersonANDAnno($idspersona, $year)
    {
        $sql = "SELECT a.fdesde,a.fhasta, a.idasistencia AS idasistencia,a.idpersona
                FROM mod_regimentrabajo.dat_asistencia a
                WHERE a.idpersona IN (" . implode(',', $idspersona) . ") AND a.idcausa = 4
                AND EXTRACT(YEAR FROM a.fdesde) = " . $year . " order by a.fdesde;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getAsistVacacionesByPeriodo($fdesde, $fhasta, $idpersonas)
    {
        $sql = "SELECT m.*,m.idgrupodescanso
                FROM mod_regimentrabajo.dat_asistencia m
                LEFT JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.actual = 1
                WHERE (m.fhasta IS NOT NULL AND m.fdesde IS NOT NULL 
                  AND ((m.fhasta <= cast ('" . $fhasta . "' AS DATE) AND
                  m.fhasta >= cast ('" . $fdesde . "' AS DATE)) OR
                  (m.fdesde <= cast ('" . $fhasta . "' AS DATE) AND
                  m.fdesde >= cast ('" . $fdesde . "' AS DATE)) OR
                  ((m.fhasta >= cast ('" . $fhasta . "' AS DATE) AND
                  m.fdesde <= cast ('" . $fdesde . "' AS DATE)))) 
                  AND m.idpersona IN (" . implode(',', $idpersonas) . ") 
                  AND m.idcausa = 4);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        //print_r($sql);die;
        return $r;
    }

    public function CertificarAsist($idasistencia, $idpersonacertifica)
    {
        try {
            $sql = "UPDATE mod_regimentrabajo.dat_asistencia 
                  SET certificado = 1, idpersonacertifica = " . $idpersonacertifica . " 
                  WHERE idasistencia IN (" . implode(',', $idasistencia) . ")";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function AprobarAsist($idasistencia, $idpersonaaprueba)
    {
        try {
            $sql = "UPDATE mod_regimentrabajo.dat_asistencia 
                  SET aprobado = 1, idpersonaaprueba = " . $idpersonaaprueba . " 
                  WHERE idasistencia IN (" . implode(',', $idasistencia) . ")";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function QuitarCertificacionAsist($idasistencia)
    {
        try {
            $sql = "UPDATE mod_regimentrabajo.dat_asistencia 
                  SET certificado = 0, idpersonacertifica = 0 
                  WHERE idasistencia IN (" . implode(',', $idasistencia) . ")";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function EliminarAsistencia($idasistencia, $fecha)
    {
        try {
            $sql = "DELETE FROM 
                      mod_regimentrabajo.dat_asistencia 
                    WHERE idasistencia IN (" . implode(',', $idasistencia) . ") 
                    --AND fecharegistro = cast ('" . $fecha . "' AS DATE)";
            //print_r($sql);die;
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function deleteAsistencia($idasistencia)
    {
        try {
            $sql = "DELETE FROM 
                      mod_regimentrabajo.dat_asistencia 
                    WHERE idasistencia IN (" . implode(',', $idasistencia) . ")";
            //print_r($sql);die;
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function EliminarRegimen($idspersona)
    {
        try {
            $sql = "UPDATE 
                      mod_personaext.dat_regimentrabajo  
                    SET
                      actual = 0, fhasta = CURRENT_DATE
                    WHERE
                      actual = 1 AND idpersona IN (" . implode(',', $idspersona) . ")
                    ;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getControladorByIdPersonaOrCargo($idcargopersona, $idpersonacertifica)
    {
        $sql = "SELECT dc.*
                FROM mod_rrhhmaestro.dat_controlador dc                
                WHERE dc.idpersona = $idpersonacertifica OR dc.idcargo = $idcargopersona";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //print_r($sql);die;
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function ObtenerRegimenByCargo($idscargo)
    {
        try {
            $sql = "SELECT DISTINCT
                    m3.idpersona,(CASE WHEN m3.snombre IS NOT NULL THEN m3.nombre||' '|| m3.snombre||' '|| m3.papel||' '||  m3.sapel
                    ELSE m3.nombre||' '|| m3.papel||' '||  m3.sapel END) AS nombreapellidos,m14.idcargo AS idcargo,m18.denominacion AS denomcargo,
                    m11.identidad AS identidad, m12.idarea AS idarea,drt.idregimentrabajo,drt.idgrupodescanso,drt.idturnotrabajo
                    FROM mod_persona.dat_persona m3 
                    INNER JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= m11.fhasta OR m11.fhasta IS NULL))) 
                    INNER JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    INNER JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    INNER JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo
                    LEFT JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m3.idpersona AND drt.actual = 1
                    LEFT JOIN mod_regimentrabajo.nom_regimentrabajo rt ON drt.idregimentrabajo = rt.idregimentrabajo
                    WHERE m14.idcargo IN (" . implode(',', $idscargo) . ") AND (m3.feliminado >= CURRENT_DATE OR m3.feliminado IS NULL) 
                    ;";
            //print_r($sql);die;
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);
            //print_r($sql);die;
            $r = array();
            foreach ($result as $d) {
                $r[$d['idregimentrabajo']][] = $d;
            }
            return $r;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function deleteAsistenciasenBlanco()
    {
        try {
            $sql = "DELETE FROM mod_regimentrabajo.dat_asistencia
                     WHERE fechahoraentrada IS NULL 
                        AND idcausa IS NULL 
                        AND fechahorasalida IS NULL";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getArrayColumn($array, $columna)
    {
        $arr = array_map(function ($element) use ($columna) {
            return (!empty($element[$columna])) ? $element[$columna] : 0;
        }, $array);
        return $arr;
    }

    public function getVacacionesadelantadas($fdesde, $fhasta)
    {
        try {
            $sql = "SELECT  da.idpersona AS idpersona, da.hrsdescontadas
                    FROM 
                      mod_regimentrabajo.dat_asistencia da WHERE idcausa = 1000
                      AND fdesde >= cast ('" . $fdesde . "' AS DATE) AND fhasta <= cast ('" . $fhasta . "' AS DATE);";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();//print_r($sql);die;
            $r = $conn->fetchAll($sql);
            return $r;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getSituacionByIdCargo(
        $filtro, $cargos, $inicio, $limite, $fibaja, $ffbaja
    )
    {
        $sql = "SELECT       
       CASE
         WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' ||
          dp.nombre
         WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel ||
          ', ' || dp.nombre || ' ' || dp.snombre
         WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' '
          || dp.sapel || ', ' || dp.nombre
         ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' ||
          dp.snombre
       END AS nombreyapellidos,sl.*
            FROM mod_persona.dat_situacionlaboral AS sl
                 INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad =
                  pe.idpersonaentidad)
                 INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
            WHERE dp.feliminado IS NULL AND
                  sl.idcargo in (" . implode(',', $cargos) . ") AND
                  sl.fhasta >= '$fibaja' AND
                  sl.fhasta <= '$ffbaja' AND
                  sl.estado != 0";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function generarFechas ($desde, $hasta){
        /*while ($fecha1 <= $fecha2) {
                                        $f1 = explode('/', $fecha1->format('d/m/Y'));
                                        if (!array_key_exists($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]))
                                            array_push($conasist, $f1[0] . '/' . $f1[1] . '/' . $f1[2]);
                                        date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                        $fech6 = explode('/', $fecha1->format('d/m/Y'));
                                        $fecha1 = date_create($fech6[2] . '-' . $fech6[1] . '-' . $fech6[0]);
                                    }*/
        $sql = "select i::date from generate_series('{$desde}'::timestamp,'{$hasta}'::timestamp, '1 day'::interval) i";
        return Doctrine_Manager::connection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function UpdateAsistenciaByPerson($idasistupd, $horasdescontadas, $horastrabajadas, $fechahoraentradaMulticausa, $fechahorasalidaMulticausa, $idcausa, $fechahoraentrada, $fechahorasalida)
    {
        $idpersonacontrola = $_SESSION['Zeolides']['perfil']['idpersona'];

        $sql = '';

        if ($fechahoraentradaMulticausa) {
            $sql .= "fechahoraentrada_multicausa = '$fechahoraentradaMulticausa',";
        } else {
            $sql .= "fechahoraentrada_multicausa = null,";
        }
        if ($fechahorasalidaMulticausa) {
            $sql .= "fechahorasalida_multicausa = '$fechahorasalidaMulticausa',";
        } else {
            $sql .= "fechahorasalida_multicausa = null,";
        }

        if (/*$fechahoraentrada*/ false) {
            $sql .= "fechahoraentrada = '$fechahoraentrada',";
        } else {
            $sql .= "fechahoraentrada = null,";
        }
        if (/*$fechahorasalida*/ false) {
            $sql .= "fechahorasalida = '$fechahorasalida',";
        } else {
            $sql .= "fechahorasalida = null,";
        }

        if ($idcausa) {
            $sql .= "idcausa = $idcausa,";
        } else {
            $sql .= "idcausa = null,";
        }

        $sql = "UPDATE
                  mod_regimentrabajo.dat_asistencia
                SET
                   hrsdescontadas = '" . $horasdescontadas . "',
                   hrstrabajadas = '" . $horastrabajadas . "',
                   $sql
                   fdesde = null,
                   fhasta = null,
                   idpersonacontrola = $idpersonacontrola
                WHERE
                  idasistencia = " . $idasistupd;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        return true;
    }


    public function UpdateLimpiarAsistencia($idasistupd)
    {
        $sql = "UPDATE
                  mod_regimentrabajo.dat_asistencia
                SET
                   hrsdescontadas = null,
                   hrstrabajadas = '00:00:00',              
                   idcausa = null
                WHERE
                  idasistencia IN (" . implode(',', $idasistupd) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        return true;
    }

    public function getAsistenciaByPerson($idasistupd)
    {
        $sql = "SELECT *
                FROM 
                  mod_regimentrabajo.dat_asistencia 
                  where idasistencia = $idasistupd;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

}