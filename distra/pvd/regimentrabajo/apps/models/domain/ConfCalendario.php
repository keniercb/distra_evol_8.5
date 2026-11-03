<?php
class ConfCalendario extends BaseConfCalendario
 { 
    public function setUp()
    {   parent::setUp(); 
         $this->hasOne('NomTipodia', array('local'=>'idtipodedia','foreign'=>'idtipodedia'));


    } 
 
    public function Buscar($idtipodocidentidad)
    { 
          $temp = $this->conn->getTable('ConfCalendario')->find($idtipodocidentidad); 
           return $temp->toArray(); 

    } 
 
    public function GetTodos()
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('ConfCalendario')->execute (); 
          return $result->toArray(); 

    } 
 
    public function GetPorLimite($idgrupodescanso, $year,$limit = null,$start = 0)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT x.*,DATE_PART('year', x.fecha),
                       y.denominacion as dentipodia,
                       y.color as color,      
                       tt.denominacion as turno,
                       asis.fecharegistro,
                       CASE WHEN asis.fecharegistro is not null THEN 1 ELSE 0 END as tieneasistencia
                FROM mod_regimentrabajo.conf_calendario x
                     LEFT JOIN mod_regimentrabajo.nom_turnotrabajo tt ON (x.idturnotrabajo = tt.idturnotrabajo)
                     INNER JOIN mod_regimentrabajo.nom_tipodedia y on x.idtipodedia = y.idtipodedia
                     left JOIN (
                                 SELECT distinct(da.fecharegistro)
                                 FROM mod_regimentrabajo.dat_asistencia da
                                      INNER JOIN mod_personaext.dat_regimentrabajo rt on da.idpersona = rt.idpersona
                                 WHERE rt.idgrupodescanso = 1
                            ) asis ON asis.fecharegistro = x.fecha
                WHERE x.idgrupodescanso = ". $idgrupodescanso . " and DATE_PART('year', x.fecha) = ". $year .";";

        if ($limit != null)
        {
            $sql.= " limit ".$limit." offset ".$start;
        }
        $result = $conn->fetchAll($sql);
//        print_r($result);die('asasasa');
        return $result;

    }

    public function SumHrsFeriadasByDates($dates,$idgrupodescanso)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT 
                  sum(horas)
                FROM 
                  mod_regimentrabajo.conf_calendario 
                  where idgrupodescanso = ".$idgrupodescanso." and fecha in (".implode(',',$dates).")";

        $result = $conn->fetchAll($sql);
        return $result;

    }

    public function GetCantPorLimite($idgrupodescanso, $year)
    {
          $query = new Doctrine_Query ();
         $result = $query->from('ConfCalendario')
              ->where('idgrupodescanso = ?',array($idgrupodescanso))
              ->count();
          return $result;
    }

    public function GetAllFind($criterio)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('ConfCalendario td')
              ->where("td.denominacion ilike '%".$criterio."%'")
              ->execute ();

          return $result->toArray();
    }

    public function GetByLimitFind($criterio,$limit,$start)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('ConfCalendario')
              ->where("td.denominacion ilike '%".$criterio."%'")
              ->limit($limit)->offset($start)->execute ();
          return $result->toArray();
    }

    public function DelFechasGrupoExisten($idgrupodescanso,$fechas)
    {
       try
       {
           $dates = array();
           foreach($fechas as $key => $fecha)
           {
               $dates[$key] = "'".$fechas[$key]."'";
           }
           $query = new Doctrine_Query ();
           $result = $query->delete()
               ->from('ConfCalendario x')
               ->addWhere('x.idgrupodescanso = ?',$idgrupodescanso)
               ->whereIn('x.fecha',$dates)
               ->execute();
           return true;
       }
       catch (Exception $e)
       {
           throw $e;
       }
    }

    public function DelFechasGrupos($idgrupos,$fechas)
    {
        try
        {
            $query = new Doctrine_Query ();
            $result = $query->delete()
                ->from('ConfCalendario x')
                ->whereIn('x.idgrupodescanso',$idgrupos)
                ->whereIn('x.fecha',$fechas)
                ->execute();
            return true;
        }
        catch (Exception $e)
        {
            throw $e;
        }
    }

    public function HrsByDateRange($fdesde,$fhasta,$idgrupo)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas)')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.fecha <= cast('".$fhasta."' as date) and conf.idgrupodescanso = ".$idgrupo." and td.trabajo = 1 and td.feriado = 0");
        return $query->execute()->toArray();
    }
	
    public function HrsByDateRangeLabFer($fdesde,$fhasta,$idgrupo)
    {
		        $sql = "SELECT SUM(m.horas) AS sum
				FROM mod_regimentrabajo.conf_calendario m 
				INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia 
				WHERE (m.fecha >= cast('".$fdesde."' as date) AND m.fecha <= cast('".$fhasta."' as date) 
				AND m.idgrupodescanso = ".$idgrupo." AND m2.trabajo = 1) OR (m.fecha >= cast('".$fdesde."' as date) AND m.fecha <= cast('".$fhasta."' as date) 
				AND m.idgrupodescanso = ".$idgrupo." AND m2.feriado = 1)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
		//print_r($sql);die;
        return $datos;
    }

    public function CalendarioByDateRange($fdesde,$fhasta,$idgrupo,$getLaborables)
    {
        $addLaborables = "";
        if($getLaborables)
        {
            $addLaborables = " and td.trabajo = 1";
        }

        $query = new Doctrine_Query ();
        $query->select('conf.*')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.fecha <= cast('".$fhasta."' as date) and conf.idgrupodescanso = ".$idgrupo.$addLaborables);//and td.trabajo = 1
        return $query->execute()->toArray();
    }

    public function getCalendarioByFdesde($fdesde,$idgrupo,$getLaborables)
    {
        $addLaborables = "";
        if($getLaborables)
        {
            $addLaborables = " and td.trabajo = 1";
        }

        $query = new Doctrine_Query ();
        $query->select('conf.*')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.idgrupodescanso = ".$idgrupo.$addLaborables);//and td.trabajo = 1
       // print_r($query->getSqlQuery());die;
        return $query->execute()->toArray();
    }

    public function CalendarioByDateRangeTrabajo($fdesde,$fhasta,$idgrupo)
    {
        $query = new Doctrine_Query ();
        $query->select('conf.*,td.trabajo as trabajo,td.feriado as feriado')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.fecha <= cast('".$fhasta."' as date) and conf.idgrupodescanso = ".$idgrupo." and td.trabajo = 1 and td.feriado = 0  and conf.idturnotrabajo is not null");//and td.trabajo = 1
        return $query->execute()->toArray();
    }

    public function CalendarioByDateRangeandGrupo($fdesde,$fhasta,$idgrupo)
    {
        $query = new Doctrine_Query ();
        $query->select('conf.*,td.trabajo as trabajo,td.feriado as feriado')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.fecha <= cast('".$fhasta."' as date) and conf.idgrupodescanso = ".$idgrupo."");//and td.trabajo = 1
        return $query->execute()->toArray();
    }

    public function getCalendarioByFecha($fecha,$grupodescanso)
    {
        $sql = "SELECT m.idcalendario AS idcalendario,
                   m.fecha AS fecha,
                   m.descripcion AS descripcion,
                   m.idtipodedia AS idtipodedia,
                   m.horas AS horas,
                   m.idgrupodescanso AS idgrupodescanso,
                   m.idturnotrabajo AS idturnotrabajo,
                   m2.trabajo AS trabajo,
                   m2.feriado AS feriado,
                   m3.otrodia AS otrodia
            FROM mod_regimentrabajo.conf_calendario m
                 INNER JOIN mod_regimentrabajo.nom_tipodedia m2 ON m.idtipodedia = m2.idtipodedia
                 LEFT JOIN mod_regimentrabajo.nom_turnotrabajo m3 ON m.idturnotrabajo = m3.idturnotrabajo
            WHERE (m.fecha = CAST ('".$fecha."' as date) AND
                  m.idgrupodescanso = ".$grupodescanso.")";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getCalendarioByGrupo($idgrupodescanso)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCalendario conf')
            ->where("conf.idgrupodescanso = '$idgrupodescanso'");
        return $query->execute()->toArray();
    }

    public function getCalendarioByGrupoandYear($idgrupodescanso,$anno)
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.idgrupodescanso = '$idgrupodescanso' and td.trabajo = 1 and  td.feriado = 0 and date_part('year', conf.fecha) = '$anno'");
        return $query->execute()->toArray();
    }

    public function DelByIdgrupodescanso($idgrupodescanso,$year)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfCalendario conf')
            ->where("conf.idgrupodescanso = '$idgrupodescanso' and date_part('year', conf.fecha) = '$year'")
            ->execute();
        return true;
    }

    public function getConfiguracionDelAnno($fdesde,$fhasta)
    {
        $sql = "SELECT
			  rt.idregimentrabajo,
			  cc.idgrupodescanso,
			  gd.denominacion AS dengrupodescanso,
			  rt.denominacion AS denregimentrabajo,
			  cc.fecha,
			  td.abreviatura as abreviatura,
			  date_part('year', cc.fecha) AS year,
			  date_part('month', cc.fecha) AS mes,
			  date_part('day', cc.fecha) AS dia,
			  cc.horas,
			  rt.tipofondotiempo,
			  rt.fondotiempo
			FROM mod_regimentrabajo.conf_calendario AS cc
			INNER JOIN mod_regimentrabajo.nom_grupodescanso AS gd ON (cc.idgrupodescanso = gd.idgrupodescanso)
			INNER JOIN mod_regimentrabajo.nom_regimentrabajo AS rt ON (gd.idregimentrabajo = rt.idregimentrabajo)
			INNER JOIN mod_regimentrabajo.nom_tipodedia AS td ON (td.idtipodedia = cc.idtipodedia)
			WHERE /*date_part('year', cc.fecha) = date_part('year', now()) and */cc.fecha >= cast('".$fdesde."' as date) and cc.fecha <= cast('".$fhasta."' as date)
			ORDER BY mes,rt.idregimentrabajo, cc.idgrupodescanso, cc.fecha";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $datos = $conn->fetchAll($sql);      
        return $datos;
    }
    
    public function HrsFeriadasByDateRange($fdesde, $fhasta, $idgrupo)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas)')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where(
                "conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                "' as date) and conf.idgrupodescanso = " . $idgrupo . " and td.feriado = 1"
            );
        return $query->execute()->toArray();
    }

    public function getDiasFeriadosHabilitadosFecha($idpersona,$fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()
                               ->select('dfa.iddiaferiadohabilitado')
                               ->from('DatDiaferiadohabilitado dfa')
                               ->where( "dfa.fecha >= cast('" . $fdesde . "' as date) and dfa.fecha <= cast('" . $fhasta .
                                        "' as date) and dfa.idpersona = " . $idpersona . "");
        return $query->execute()->toArray();
    }

    public function getDiasFeriadosBygrupo($fdesde, $fhasta,$grupodescanso)
    {
        $query = Doctrine_Query::create()
                               ->select('conf.*')
                               ->from('ConfCalendario conf')
                               ->innerJoin('conf.NomTipodia td')
                               ->where( "conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                                        "' as date) and conf.idgrupodescanso = " . $grupodescanso . " and td.feriado = 1");
        return $query->execute()->toArray();
    }

    public function getDiasFeriados($fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()
                               ->select('conf.*')
                               ->from('ConfCalendario conf')
                               ->innerJoin('conf.NomTipodia td')
                               ->where( "conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta .
                                        "' as date) and td.feriado = 1 and idturnotrabajo is not null");
        return $query->execute()->toArray();
    }

    public function getDiasFeriadosHabilitados($idspersona)
    {
        $query = Doctrine_Query::create()
                               ->select('dfa.iddiaferiadohabilitado')
                               ->from('DatDiaferiadohabilitado dfa')
                               ->Where("dfa.idpersona in (".implode(',',$idspersona).")");
        return $query->execute()->toArray();
    }

    public function delDiasFeriadosHabiles($idspersona,$fechas)
    {
        try
        {
            $query = new Doctrine_Query ();
            $result = $query->delete()
                            ->from('DatDiaferiadohabilitado dfa')
                            ->Where("dfa.idpersona in (".implode(',',$idspersona).")")
                            ->addWhere("dfa.fecha in (".implode(',',$fechas).")")
                            ->execute();
            return true;
        }
        catch (Exception $e)
        {
            throw $e;
        }
    }

    public function Insert($arrDatos)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "insert into mod_regimentrabajo.dat_diaferiadohabilitado
                      (fecha,idpersona,horas)
                  VALUES ".implode(',',$arrDatos).";";
        return $conn->execute($sql);
    }

    public function GetSumHorasDiasFeriadosHabByDateArrayAndGroup($idgrupodescanso,$fferhabsarray)
    {
        $query = Doctrine_Query::create()
               ->select('sum(ccal.horas)')
               ->from('ConfCalendario ccal')
               ->where("ccal.fecha in (".implode(',',$fferhabsarray).") and ccal.idgrupodescanso=" . $idgrupodescanso);
        return $query->execute()->toArray();
    }

    public function HrsNoLaborablesByDateRange($fdesde,$fhasta)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas)')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.fecha <= cast('".$fhasta."' as date) and conf.idgrupodescanso = 3 and td.trabajo != 1 and td.feriado != 1 and conf.horas is not null");

        $horasNoLaborables = $query->execute()->toArray();
        $query->select('count(conf.idcalendario)')
            ->from('ConfCalendario conf')
            ->innerJoin('conf.NomTipodia td')
            ->where("conf.fecha >= cast('".$fdesde."' as date) and conf.fecha <= cast('".$fhasta."' as date) and conf.idgrupodescanso = 3 and td.trabajo != 1 and td.feriado != 1 and conf.horas is null");
        $diasNoLaborables = $query->execute()->toArray();

        return $horasNoLaborables[0]['sum'] + $diasNoLaborables[0]['count'] * 8;

    }

    public function insertPlanifMasiva($filas)
    {
       try{
           $mg = Doctrine_Manager::getInstance();
           $conn = $mg->getCurrentConnection();
           $conn->beginTransaction();
           $sql = "INSERT INTO 
                  mod_regimentrabajo.conf_calendario
                ( 
                  fecha,
                  idtipodedia,
                  idgrupodescanso,
                  horas,
                  idturnotrabajo
                )
                VALUES ".implode(',', $filas);

           $conn->execute($sql);
           $conn->commit();
       }
       catch (Exception $e)
       {
           print_r($e->getMessage());die;
       }
        return true;

    }

    public function getHrsCalendario($fdesde, $fhasta, $idgrupo)
    {
        $query = new Doctrine_Query ();
        $query->select('sum(conf.horas), count(conf.horas)')
            ->from('ConfCalendario conf')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta . "' as date) and conf.idgrupodescanso = " . $idgrupo . " and conf.idturnotrabajo is not null");
        return $query->execute()->toArray();
    }

    public function getDiasLaborablesPeriodo($fdesde, $fhasta, $idgrupo)
    {
        $query = new Doctrine_Query ();
        $query->select('count(conf.horas)')
            ->from('ConfCalendario conf')
            ->where("conf.fecha >= cast('" . $fdesde . "' as date) and conf.fecha <= cast('" . $fhasta . "' as date) and conf.idgrupodescanso = " . $idgrupo . " and conf.idturnotrabajo is not null");
        return $query->execute()->toArray();
    }


}//fin clase 
?>