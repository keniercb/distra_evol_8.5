<?php

class DatEstructuraasistencia extends BaseDatEstructuraasistencia
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatAsistencia', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('DatRegimentrabajo', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @params $idpadre
     * @return Doctrine_Record
     */
    public function getById($idestructuraasistencia)
    {
        return Doctrine::getTable('DatEstructuraasistencia')->find($idestructuraasistencia);
    }

    public function getAllPersonas($idpadre)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('ea.idestructuraasistencia  as idestructuraasistencia, ea.idpersona,ea.idpadre')
                ->from('DatEstructuraasistencia ea');
            if ($idpadre == -1) {
                $query->where("ea.idestructuraasistencia = ea.idpadre and idpersona is not null");
            } else {
                $query->Where("ea.idestructuraasistencia <> ea.idpadre and ea.idpadre = " . $idpadre);
            }
            $query->orderBy('ea.idestructuraasistencia');
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function GetPersonasJustificadasORegistradas($fecha, $idpersonas, $ipersonacontrolador = -1,$sesiones)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = " with personas_relacionadas as (select idpersona, replace( (concat(nombre,' ',snombre,' ',papel,' ',sapel)), '  ', ' ' ) as nombre_completo from mod_persona.dat_persona)
                SELECT DISTINCT m.idasistencia as idasistencia,
                m.fechahoraentrada as fechahoraentrada,
                m.fdesde as fdesde,
                m.fhasta as fhasta,
                m.idcausa as idcausa,
                m.idpersona as idpersona,
                m.hrsdescontadas as hrsdescontadas,
                m.hrstrabajadas as hrstrabajadas,
                m.fechahorasalida as fechahorasalida,
                m.fecharegistro as fecharegistro,
                m.observacion as observacion,
                m2.denominacion as denominacion,
                m2.color as color,
                m2.tieneperiodo as tieneperiodo,
                m2.tieneentradasalida as tieneentradasalida,
                m2.abreviatura as abreviatura,
                m3.idsuin as idsuin,
                replace( (concat(m3.nombre,' ',m3.snombre,' ',m3.papel,' ',m3.sapel)), '  ', ' ' ) as nombreapellidos,
                m9.idpadre as idcategoria,
                m11.identidad as identidad,
                m12.idcargo as idcargo,
                m12.idarea as idarea,
                m23.idregimentrabajop as idregimentrabajop,
                m23.idregimentrabajo as idregimentrabajo,
                m23.idgrupodescanso as idgrupodescanso,
                m23.idturnotrabajo as idturnotrabajo,
                m.actualizado as actualizado,
                m.idpersonacontrola as idpersonacontrola,
                p_controla.nombre_completo as controlador,
                m.idpersonamodifica as idpersonamodifica,
                p_modifica.nombre_completo as personamodifica,
                m.horasextras as horasextras,
                m.idpersonacertifica as idpersonacertifica,
                p_certifica.nombre_completo as personacertifica,
                p_aprueba.nombre_completo as personaaprueba,
                m.aprobado as aprobado,
                m.certificado as certificado,
                ntt.otrodia,
                ntt.idturnotrabajo,
                td.idtipodedia,
                ntt.denominacion as denomturno,
                doc.numero as numid,
                m.certificadocontinuado,
                (select MAX(da.fecharegistro) from mod_regimentrabajo.dat_asistencia da
                inner join  mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                where da.certificadocontinuado = 1 and da.idpersona = m.idpersona
                ) as ultimocertcontinuado,
                (select MAX(da.fecharegistro) from mod_regimentrabajo.dat_asistencia da
                inner join  mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                where da.certificadocontinuado = 0 and da.idpersona = m.idpersona
                ) as ultimocertinicial, (select f.ordenunico from mod_estructuracomp.nom_filaestruc f WHERE f.idfila = m12.idcargo limit 1) as ordenunico
                ";

        if($sesiones == 1)
        {
            $query .= ",
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
        $query .= " FROM mod_regimentrabajo.dat_asistencia m
                LEFT JOIN mod_regimentrabajo.nom_causa m2 ON m.idcausa = m2.idcausa
                INNER JOIN mod_persona.dat_persona m3 ON m.idpersona = m3.idpersona
                LEFT JOIN mod_persona.dat_docidentidad doc ON (m.idpersona = doc.idpersona) AND (doc.principal = 1)
                LEFT JOIN mod_personaext.dat_categoria m8 ON m3.idpersona = m8.idpersona AND ((m8.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m8.fhasta OR m8.fhasta is null)) and m8.principal = 1)
                LEFT JOIN mod_personaext.nom_categoriapersona m9 ON m8.idcategoriapersona = m9.idcategoriapersona
                LEFT JOIN mod_personaext.dat_gradomilitar m10 ON m3.idpersona = m10.idpersona AND ((m10.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m10.fhasta OR m10.fhasta is null)))
                LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona AND ((m11.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m11.fhasta OR m11.fhasta is null)))
                LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                LEFT JOIN mod_personaext.dat_regimentrabajo m23 ON m.idpersona = m23.idpersona AND m23.actual = 1
                LEFT JOIN mod_regimentrabajo.conf_calendariopersona cal ON m.idpersona = cal.idpersona AND cal.fecha = CAST('" . $fecha . "' as date) and cal.idcargo = m12.idcargo
                LEFT JOIN mod_regimentrabajo.nom_turnotrabajo ntt ON cal.idturnotrabajo = ntt.idturnotrabajo
                INNER JOIN mod_regimentrabajo.nom_tipodedia td on cal.idtipodedia = td.idtipodedia
                LEFT JOIN personas_relacionadas p_controla on (p_controla.idpersona = m.idpersonacontrola)
                LEFT JOIN personas_relacionadas p_modifica on (p_modifica.idpersona = m.idpersonamodifica)
                LEFT JOIN personas_relacionadas p_certifica on (p_certifica.idpersona = m.idpersonacertifica)
                LEFT JOIN personas_relacionadas p_aprueba on (p_aprueba.idpersona = m.idpersonaaprueba)
                WHERE (m3.idpersona = ANY ('{" . implode(',', $idpersonas) . "}') AND m23.actual = 1 and
                (((m.fdesde is not null AND m.fhasta is not null AND m.fdesde <= cast('" . $fecha . "' as date) AND m.fhasta >= cast('" . $fecha . "' as date)))
                OR (m.fecharegistro = cast ('" . $fecha . "' as date))))
                order by ordenunico ASC";
        $personas = $conn->fetchAll($query);        
        return $personas;
    }

    public function getAsistPersBajasMov($fecha,$personacontrola)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT 
                     DISTINCT da.*,
                           (CASE
                              WHEN dp.snombre is not null THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
                              ELSE dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
                            END) AS nombreapellidos,       
                           (
                             select (case
                                       when per.snombre is not null then per.nombre || ' ' || per.snombre || ' ' || per.papel || ' ' || per.sapel
                                       else per.nombre || ' ' || per.papel || ' ' || per.sapel
                                     end) as nombreapellidos
                             from mod_persona.dat_persona per
                             where per.idpersona = da.idpersonacontrola
                           ) as controlador,
                           (
                             select (case
                                       when per.snombre is not null then per.nombre || ' ' || per.snombre || ' ' || per.papel || ' ' || per.sapel
                                       else per.nombre || ' ' || per.papel || ' ' || per.sapel
                                     end) as nombreapellidos
                             from mod_persona.dat_persona per
                             where per.idpersona = da.idpersonamodifica
                           ) as personamodifica,       
                           (
                             select (case
                                       when per.snombre is not null then per.nombre || ' ' || per.snombre || ' ' || per.papel || ' ' || per.sapel
                                       else per.nombre || ' ' || per.papel || ' ' || per.sapel
                                     end) as nombreapellidos
                             from mod_persona.dat_persona per
                             where per.idpersona = da.idpersonacertifica
                           ) as personacertifica,
                           (
                             select (case
                                       when per.snombre is not null then per.nombre || ' ' || per.snombre || ' ' || per.papel || ' ' || per.sapel
                                       else per.nombre || ' ' || per.papel || ' ' || per.sapel
                                     end) as nombreapellidos
                             from mod_persona.dat_persona per
                             where per.idpersona = da.idpersonaaprueba
                           ) as personaaprueba,       
                           (
                             select MAX(da.fecharegistro)
                             from mod_regimentrabajo.dat_asistencia da
                                  inner join mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                             where da.certificadocontinuado = 1 and
                                   da.idpersona = da.idpersona
                           ) as ultimocertcontinuado,
                           (
                             select MAX(da.fecharegistro)
                             from mod_regimentrabajo.dat_asistencia da
                                  inner join mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                             where da.certificadocontinuado = 0 and
                                   da.idpersona = da.idpersona
                           ) as ultimocertinicial,
                           (
                             select f.ordenunico
                             from mod_estructuracomp.nom_filaestruc f
                             WHERE f.idfila = da.idcargo
                             limit 1
                           ) as ordenunico,
                           (
                             select f.idpadre
                             from mod_estructuracomp.nom_filaestruc f
                             WHERE f.idfila = da.idcargo
                             limit 1
                           ) as idarea, c.denominacion AS denominacion, c.color AS color,
                            c.tieneperiodo AS tieneperiodo, c.tieneentradasalida AS tieneentradasalida, c.abreviatura AS abreviatura
                    FROM 
                      mod_regimentrabajo.dat_asistencia da
                      LEFT JOIN mod_regimentrabajo.nom_causa c ON da.idcausa = c.idcausa
                      inner join mod_persona.dat_persona dp on (da.idpersona = dp.idpersona)
                      inner join mod_persona.dat_personaentidad pe ON(da.idpersona = pe.idpersona)
                      inner join mod_persona.dat_situacionlaboral sl on(pe.idpersonaentidad = sl.idpersonaentidad)
                     WHERE ((da.idpersonacontrola = $personacontrola or da.idpersonamodifica = $personacontrola) 
                            and (sl.estado in (1,2) and sl.fhasta >= cast ('" . $fecha . "' as date)) and 
                          (((da.fdesde is not null AND
                          da.fhasta is not null AND
                          da.fdesde <= cast ('" . $fecha . "' as date) AND
                          da.fhasta >= cast ('" . $fecha . "' as date))) OR
                          (da.fecharegistro = cast ('" . $fecha . "' as date))))
                    order by ordenunico ASC";
        return $conn->fetchAll($sql);
    }

    public function getAllPersonasid($idpadre, $fecha, $buscarporfecha, $personsNotIn, $personasIn)
    {
        if ($idpadre == null) {
            return Array();
        }
        $query = Doctrine_Query::create()
            ->select('ea.idestructuraasistencia , ea.idpersona')
            ->from('DatEstructuraasistencia ea');
        if ($fecha == null && $buscarporfecha == null && $personsNotIn == null) {
            $query->addSelect('((
                    SELECT COUNT(w.idestructuraasistencia)
                    FROM DatEstructuraasistencia w
                    WHERE w.idpadre = ea.idestructuraasistencia and w.idestructuraasistencia <> w.idpadre) = 0) as leaf');
        }
        if ($buscarporfecha) {
            $query->addSelect('asis.idasistencia as idasistencia,asis.fechahoraentrada as fechahoraentrada,
                                   asis.fdesde as fdesde,asis.fhasta as fhasta,asis.idcausa as idcausa,
                                   asis.hrsdescontadas as hrsdescontadas, asis.fechahorasalida as fechahorasalida,
                                   asis.fecharegistro as fecharegistro, nc.denominacion as denominacion, nc.color as color, nc.tieneperiodo as tieneperiodo, nc.tieneentradasalida as tieneentradasalida,
                                   nc.abreviatura as abreviatura')
                ->leftJoin('ea.DatAsistencia asis')
                ->leftJoin('asis.NomCausa nc');
        }
        if (count($personasIn) > 0) {
            $query->where("ea.idpadre = " . $idpadre)
                ->orderBy('ea.idestructuraasistencia');
            $query->andWhere("ea.idpersona in (" . implode(',', $personasIn) . ")");
        } else {
            $query->where("ea.idpadre = " . $idpadre . " and ea.idestructuraasistencia <> " . $idpadre . " ")
                ->orderBy('ea.idestructuraasistencia');
        }

        if ($buscarporfecha)
            $query->andWhere("((asis.fdesde <= cast('" . $fecha . "' as date) and asis.fhasta >= cast('" . $fecha . "' as date)) or asis.fecharegistro = cast('" . $fecha . "' as date))");

        if (!$buscarporfecha && count($personsNotIn) > 0)
            $query->andWhere("ea.idpersona not in (" . implode(',', $personsNotIn) . ")");

        ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query, 'ea', 'per', 'InnerJoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
        ZendExt_IoC_Inter::getInstance()->persona->addDQLRegimenTrabajo($query, 'ea', 'drt', 'leftJoin', true);

        return $query->execute()->toArray();
    }

    public function getEstAsistById($idpersona)
    {
        $query = Doctrine_Query::create()
            ->select('ea.idestructuraasistencia')
            ->from('DatEstructuraasistencia ea')
            ->where("ea.idpersona = $idpersona");
        return $query->execute()
            ->toArray();
    }

    public function getEstAsistByIdCargo($idcargo)
    {
        try {
        $query = Doctrine_Query::create()
            ->select('ea.idestructuraasistencia')
            ->from('DatEstructuraasistencia ea')
            ->where("ea.idcargo = $idcargo");
        return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getHijosProfundidad($idestructuraasistencia)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select * FROM mod_regimentrabajo.f_obtenerhijos_recursivo(cast(" . $idestructuraasistencia . " as numeric));";
        return $conn->fetchAll($sql);
    }

    public function getPadresProfundidad($idestructuraasistencia)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select * FROM mod_regimentrabajo.f_obtenerpadre_recursivo(cast(" . $idestructuraasistencia . " as numeric));";
        return $conn->fetchAll($sql);
    }

    public function deleteEstructuraAsistenciaById($idestructuraasistencia)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('DatEstructuraasistencia ea')
            ->where('ea.idestructuraasistencia = ?', $idestructuraasistencia);
        return $queryObj->execute();
    }

    public static function getPadreByIdCargo($idcargo)
    {
        $sql = " select e.idcargo
                 from mod_regimentrabajo.dat_estructuraasistencia as e
                 where e.idestructuraasistencia in (select ea.idpadre  from mod_regimentrabajo
                 .dat_estructuraasistencia as ea where ea.idcargo = ".$idcargo.")";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function existe($idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ea.idpersona')
            ->from('DatEstructuraasistencia ea')
            ->where("ea.idpersona = '$idpersona'");
        return $queryObj->fetchArray();
    }

    public function getAllCargos()
    {
      $query = new Doctrine_Query ();
        $query->select('ea.idcargo')
            ->from('DatEstructuraasistencia ea');
        return $query->fetchArray();
    }

}
