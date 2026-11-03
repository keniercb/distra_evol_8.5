<?php

class ConfCalendariopersona extends BaseConfCalendariopersona
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTipodia', array('local' => 'idtipodedia', 'foreign' => 'idtipodedia'));
        $this->hasOne('NomTurnotrabajo', array('local' => 'idturnotrabajo', 'foreign' => 'idturnotrabajo'));


    }

    public function saveCalendarioPersona($filas)
    {//print_r($filas);die;
        try {
            if (count($filas) > 0) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                $sql = "INSERT INTO 
                          mod_regimentrabajo.conf_calendariopersona
                        (                      
                          fecha,
                          idturnotrabajo,
                          idpersona,
                          horas,
                          idtipodedia,
                          idcargo
                        )
                        VALUES " . implode(',', $filas);

                $conn->execute($sql);
                $conn->commit();
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
        return true;
    }

    public function getArrayColumn($array, $columna)
    {
        $arr = array_map(function ($element) use ($columna) {
            return (!empty($element[$columna])) ? $element[$columna] : 0;
        }, $array);
        return $arr;
    }

    public function getPersonasByIdgrupodescanso($idgrupodescanso)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT  
                      drt.idpersona, drt.idcargo as idcargodrt, m12.idcargo
                    FROM 
                      mod_personaext.dat_regimentrabajo drt
                      INNER JOIN mod_persona.dat_personaentidad m11 ON drt.idpersona = m11.idpersona AND ((m11.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= m11.fhasta OR m11.fhasta is null)))
                      INNER JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad AND m12.estado = 0
                    WHERE
                      drt.actual = 1 AND drt.idgrupodescanso = " . $idgrupodescanso . ";";

        return $conn->fetchAll($sql);
    }

    public function deleteByIdpersonasFechas($idpersonascargos, $dates)
    {
        try {
            if (count($idpersonascargos) > 0) {
//                $fechas = array();
//                foreach ($dates as $key => $fecha) {
//                    $fechas[$key] = "CAST('" . $fecha . "' as date)";
//                }
                
                $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
                $idcargos = $this->getArrayColumn($idpersonascargos, 'idcargo');
                $query = new Doctrine_Query ();
                $result = $query->delete()
                    ->from('ConfCalendariopersona x')
                    ->whereIn('x.idpersona', $idpersonas)
                    ->whereIn('x.idcargo', $idcargos)
                    ->andWhereIn('x.fecha', $dates)
                    ->execute();
//                $sql = "DELETE FROM
//                      mod_regimentrabajo.conf_calendariopersona
//                    WHERE idpersona IN (" . implode(',', $idpersonas) . ") and idcargo IN (" . implode(',', $idcargos) . ")
//                    and fecha IN (" . implode(',', $dates) . ")";

//                $mg = Doctrine_Manager::getInstance();
//                $conn = $mg->getCurrentConnection();
//                $conn->beginTransaction();
//                $r = $conn->execute($sql);
//                $conn->commit();
            }
            return true;
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

    public function delByIdpersonasFechas($idpersonascargos, $dates)
    {
       // try {
            if (count($idpersonascargos) > 0) {
//                $fechas = array();
//                foreach ($dates as $key => $fecha) {
//                    $fechas[$key] = "CAST('" . $fecha . "' as date)";
//                }
                $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
                $idcargos = $this->getArrayColumn($idpersonascargos, 'idcargo');
                $sql = "DELETE FROM
                      mod_regimentrabajo.conf_calendariopersona
                    WHERE idpersona IN (" . implode(',', $idpersonas) . ") and idcargo IN (" . implode(',', $idcargos) . ")
                    and fecha IN (" . implode(',', $dates) . ")";

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                $r = $conn->execute($sql);
                $conn->commit();
            }
            return true;
       /* } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }*/
    }

    public function deleteByIdpersonasFDesde($idpersonascargos, $fdesde)
    {
       // try {
            if (count($idpersonascargos) > 0) {
                $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
                $idcargos = $this->getArrayColumn($idpersonascargos, 'idcargodrt');
// Se regresa a la variante anterior a los ajustes par5a pluriempleo, debido a que se detecto que cuando la persona es movida de cargo y no es pluriempleo, se duplican los valores en asistencia y el fondo de tiempo, se debe analizar bien como diferenciar cuando la persona tiene dos cargos porqye es pluriempleo y cuando por movimiento para entonces hacer los ajustes y no borrar la configuracion del calendario de la persona.
//                $query = new Doctrine_Query ();
//                $result = $query->delete()
//                    ->from('ConfCalendariopersona x')
//                    ->whereIn('x.idpersona', $idpersonas)
//                    //->whereIn('x.idcargo', $idcargos)
//                    ->andWhere("x.fecha >= cast('" . $fdesde . "' as date)")
//                    ->execute();

                $sql = "DELETE FROM mod_regimentrabajo.conf_calendariopersona 
                WHERE (idpersona IN (" . implode(',', $idpersonas) . ") AND fecha >= cast('" . $fdesde . "' as date))";
                
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                $r = $conn->execute($sql);
                $conn->commit();
            }
            return true;
//        } catch (Exception $e) {
//            print_r($e->getMessage());
//            die;
//        }
    }

    public function deleteByIdpersonasFechasAndCargo($idpersonascargos, $dates)
    {
        try {
            if (count($idpersonascargos) > 0) {
                $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
                $idcargos = $this->getArrayColumn($idpersonascargos, 'idcargo');
                $query = new Doctrine_Query ();
                $result = $query->delete()
                    ->from('ConfCalendariopersona x')
                    ->whereIn('x.idpersona', $idpersonas)
                    ->whereIn('x.idcargo', $idcargos)
                    ->andWhereIn('x.fecha', $dates)
                    ->execute();
            }
            return true;
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

    public function DelByIdgrupodescansoYear($idpersonascargos, $year)
    {
        if (count($idpersonascargos)) {
            $idpersonas = $this->getArrayColumn($idpersonascargos, 'idpersona');
            $idcargos = $this->getArrayColumn($idpersonascargos, 'idcargodrt');
            $query = new Doctrine_Query ();
            $result = $query->delete()
                ->from('ConfCalendariopersona conf')
                ->where("conf.idpersona in (" . implode(',', $idpersonas) . ") and conf.idcargo in (" . implode(',', $idcargos) . ") and date_part('year', conf.fecha) = '" . $year . "'")
                ->execute();
        }
        return true;
    }

    public function deleteOnlyCalPersonaByIdpersYear($idpersona, $idgrupodescanso, $year)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM 
                  mod_regimentrabajo.conf_calendariopersona l
                WHERE 
                  l.fecha in (SELECT   
                                  cp.fecha  
                                FROM 
                                  mod_regimentrabajo.conf_calendariopersona cp
                                WHERE 
                                  cp.idpersona =  " . $idpersona . " AND 
                                  date_part('year', cp.fecha) = " . $year . " AND
                                  cp.fecha NOT IN (SELECT                       
                                                      c.fecha
                                                    FROM 
                                                      mod_regimentrabajo.conf_calendario c 
                                                    WHERE c.idgrupodescanso = " . $idgrupodescanso . " AND 
                                                          date_part('year', cp.fecha) = " . $year . " ))";
        //print_r($sql);die;
        return $conn->execute($sql);
    }

    public function getCalendarioByIdpersonas($idpersonas, $year, $idcargo)
    {
        /*$query = new Doctrine_Query ();
        $result = $query->select('conf.*, td.denominacion as dentipodia,td.color as color, tt.denominacion as turno')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td ')
            ->leftJoin('conf.NomTurnotrabajo tt')
            ->where("conf.idpersona in ('" . implode(',', $idpersonas) . "') AND date_part('year', conf.fecha) = " . $year . " ")
            ->execute()->toArray();*/

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT m.idcalendariopersona AS idcalendariopersona,
                m.fecha AS fecha,
                m.idtipodedia AS idtipodedia,
                m.idpersona AS idpersona,
                m.horas AS horas,
                m.idturnotrabajo AS idturnotrabajo,
                m2.denominacion AS dentipodia,
                m2.color,
                m3.denominacion AS turno
            FROM mod_regimentrabajo.conf_calendariopersona m
                INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia
                LEFT JOIN mod_regimentrabajo.nom_turnotrabajo m3 ON m.idturnotrabajo = m3.idturnotrabajo
            WHERE (m.idpersona in ('" . implode(',', $idpersonas) . "') AND
                DATE_PART('year', m.fecha) = $year) and m.idcargo = $idcargo";
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function getHorasCalendarioPersona($fdesde, $fhasta, $idpersona)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas),count(conf.idcalendariopersona)')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta . "' as date) and conf.idpersona = " . $idpersona . " and conf.idturnotrabajo is not null");// and td.trabajo = 1 and td.feriado = 0
        return $query->execute()->toArray();
    }

    static public function getHrsCalendarioPersona($fdesde, $fhasta, $idpersona, $idcargo = null)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas),count(conf.idcalendariopersona)')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta . "' as date) and conf.idpersona = " . $idpersona . " and conf.idturnotrabajo is not null");
        
        if ($idcargo) {
            $query->addWhere("conf.idcargo = $idcargo");
        }
        return $query->execute()->toArray();
    }

    public function getDiasCalendarioPersonaOficiales($fdesde, $fhasta, $idpersona)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas),count(conf.idcalendariopersona)')
            ->from('ConfCalendariopersona conf')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta . "' as date) and conf.idpersona = " . $idpersona . " ");
        return $query->execute()->toArray();
    }

    public function getHorasNoLabCalendarioPersona($fdesde, $fhasta, $idpersona)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas),count(conf.idcalendariopersona)')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta . "' as date) and conf.idpersona = " . $idpersona . " and td.idtipodedia = 4");
        $horasNoLaborables = $query->execute()->toArray();
        //print_r($horasNoLaborables);die;
        return $horasNoLaborables[0]['sum'] + $horasNoLaborables[0]['count'] * 8;
    }

    public function getCalendarioPersona($fdesde, $fhasta, $idpersona)
    {
        $sql = "SELECT m.*, m2.trabajo AS trabajo,m2.feriado AS feriado,m3.otrodia AS otrodia
                FROM mod_regimentrabajo.conf_calendariopersona m
                     INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia
                     LEFT JOIN mod_regimentrabajo.nom_turnotrabajo m3 ON m.idturnotrabajo = m3.idturnotrabajo
                WHERE m.fecha >= cast ('" . $fdesde . "' as date) AND
                      m.fecha <= cast ('" . $fhasta . "' as date) AND
                      m.idpersona = " . $idpersona . " ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getCalendarioPersonas($fdesde, $fhasta, $idpersonas)
    {
        $sql = "SELECT m.*, m2.trabajo AS trabajo,m2.feriado AS feriado,m3.otrodia AS otrodia
                FROM mod_regimentrabajo.conf_calendariopersona m
                     INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia
                     LEFT JOIN mod_regimentrabajo.nom_turnotrabajo m3 ON m.idturnotrabajo = m3.idturnotrabajo
                WHERE m.fecha >= cast ('" . $fdesde . "' as date) AND
                      m.fecha <= cast ('" . $fhasta . "' as date) AND
                      m.idpersona IN (" . implode(',', $idpersonas) . ")";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        $r = array();
        foreach ($datos as $d) {
            $r[$d['idpersona']][] = $d;
        }
        return $r;
    }

    public function getCalendarioPersonasByFdesde($fdesde, $idpersonas)
    {
        $sql = "SELECT m.*, m2.trabajo AS trabajo,m2.feriado AS feriado,m3.otrodia AS otrodia
                FROM mod_regimentrabajo.conf_calendariopersona m
                     INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia
                     LEFT JOIN mod_regimentrabajo.nom_turnotrabajo m3 ON m.idturnotrabajo = m3.idturnotrabajo
                WHERE m.fecha >= cast ('" . $fdesde . "' as date) AND
                      m.idpersona IN (" . implode(',', $idpersonas) . ")";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        $r = array();
        foreach ($datos as $d) {
            $r[$d['idpersona']][] = $d;
        }
        return $r;
    }

    public function getCalendarioPersonaTrabajo($fdesde, $fhasta, $idpersona)
    {
        $sql = "SELECT m.*, m2.trabajo AS trabajo,m2.feriado AS feriado,m3.otrodia AS otrodia
                FROM mod_regimentrabajo.conf_calendariopersona m
                     INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia
                     LEFT JOIN mod_regimentrabajo.nom_turnotrabajo m3 ON m.idturnotrabajo = m3.idturnotrabajo
                     left join mod_regimentrabajo.dat_diaferiadohabilitado m4 on m4.idpersona = m.idpersona and m4.fecha = m.fecha
                WHERE m.fecha BETWEEN '{$fdesde}'::date and '{$fhasta}'::date AND
                      m.idpersona = {$idpersona} AND (m2.trabajo = 1 OR (m2.feriado = 1 and  m4.iddiaferiadohabilitado is not null))
                      and  m.idturnotrabajo is not null;";
        //print_r($sql);die;
        /*m2.idtipodedia <> 12 AND m2.idtipodedia <> 8*/ //m2.feriado = 0
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getHrsFeriadasPersona($fdesde, $fhasta, $idpersona)
    {
        $sql = "select  sum(m.horas), count(m.idcalendariopersona) from mod_regimentrabajo.conf_calendariopersona m 
                INNER JOIN mod_regimentrabajo.nom_tipodedia nt ON m.idtipodedia = nt.idtipodedia 
                where m.idpersona = {$idpersona} and m.fecha BETWEEN '{$fdesde}'::date and '{$fhasta}'::date and nt.feriado = 1";
        /*$query = new Doctrine_Query ();
        $query->select('sum(conf.horas),count(conf.idcalendariopersona)')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where(
                "conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                "' as date) and conf.idpersona = " . $idpersona . " and td.feriado = 1"
            );
        return $query->execute()->toArray();*/
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function GetSumHorasDiasFeriadosHabByDateArrayAndPerson($idpersona, $fferhabsarray)
    {
        $query = Doctrine_Query::create()
            ->select('sum(ccal.horas)')
            ->from('ConfCalendariopersona ccal')
            ->where("ccal.fecha in (" . implode(',', $fferhabsarray) . ") and ccal.idpersona=" . $idpersona);
        return $query->execute()->toArray();
    }

    public function getCalendarioByPersonaandYear($idpersona, $anno)
    {
        /*$query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.idpersona = '$idpersona' and td.trabajo = 1 and  td.feriado = 0 and date_part('year', conf.fecha) = '$anno'");
        return $query->execute()->toArray();*/
        $sql = "select sum(horas) over() as thoras, cper.* from  mod_regimentrabajo.conf_calendariopersona cper
                join mod_regimentrabajo.nom_tipodedia td on cper.idtipodedia = td.idtipodedia 
                where td.trabajo = 1 and td.feriado = 0  and date_part('year',cper.fecha) = {$anno}
                and cper.idpersona = {$idpersona}";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getRecesoLab($fdesde, $fhasta, $idpersona)
    {
        /*$query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                "' as date) and conf.idpersona = " . $idpersona . " and td.idtipodedia = 13");
        return $query->execute()->toArray();*/
        $sql = "select sum(horas) over() as sum, * from  mod_regimentrabajo.conf_calendariopersona cper
                where cper.idtipodedia = 13 and cper.fecha BETWEEN '{$fdesde}'::date and '{$fhasta}'::date and cper.idpersona = {$idpersona}";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getHrsRecesoLabPersona($fdesde, $fhasta, $idpersona)
    {
        /*$query = new Doctrine_Query ();
        $query->select('sum(conf.horas)')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where(
                "conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                "' as date) and conf.idpersona = " . $idpersona . " and td.idtipodedia = 13"
            );
        return $query->execute()->toArray();*/
        $sql = "select sum(cper.horas) from  mod_regimentrabajo.conf_calendariopersona cper
                where cper.idtipodedia = 13 and cper.fecha BETWEEN '{$fdesde}'::date and '{$fhasta}'::date and cper.idpersona = {$idpersona}";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getDiasFeriadosBypersona($fdesde, $fhasta, $idpersona)
    {
        /*$query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                "' as date) and conf.idpersona = " . $idpersona . " and td.feriado = 1 and td.idtipodedia <> 12");
        return $query->execute()->toArray();*/

        $sql = "select cper.* from  mod_regimentrabajo.conf_calendariopersona cper
                INNER JOIN mod_regimentrabajo.nom_tipodedia td ON cper.idtipodedia = td.idtipodedia
                where cper.idtipodedia <> 12 and cper.fecha BETWEEN '{$fdesde}'::date and '{$fhasta}'::date and cper.idpersona = {$idpersona} and td.feriado = 1";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getDiasFeriadosByIdpersona($fdesde, $fhasta,$idspersona)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCalendariopersona conf')
            ->innerJoin('conf.NomTipodia td')
            ->where( "conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                "' as date) and conf.idpersona  in (" . implode(',', $idspersona) . ") and (td.feriado = 1) and idturnotrabajo is not null");
        return $query->execute()->toArray();
    }

    public function getFeriadoPersonaByFecha($idpersona,$fecha)
    {
        $sql = "SELECT 
                  c.*,tt.*
                FROM 
                  mod_regimentrabajo.conf_calendariopersona c
                LEFT JOIN mod_regimentrabajo.nom_turnotrabajo as tt ON (c.idturnotrabajo = tt.idturnotrabajo)
                  where c.fecha = cast('$fecha' as date) and c.idpersona = $idpersona and c.idtipodedia = 1;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        //print_r($sql);die;
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

}//fin clase 
?>