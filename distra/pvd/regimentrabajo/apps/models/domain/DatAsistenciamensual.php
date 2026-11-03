<?php 
class DatAsistenciamensual extends BaseDatAsistenciamensual
 { 
   public function setUp() 
    {   parent::setUp(); 
    } 
 
  
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatAsistenciamensual')->execute (); 
          return $result->toArray();
    }

    public function getAsistMensualByPeriodoAndIdestruct($idestructura, $fdesde, $fhasta)
    {
        $sql = "SELECT *
                    FROM mod_regimentrabajo.dat_asistenciamensual 
                    WHERE idestructura = $idestructura AND fdesde = cast ('" . $fdesde . "' as date) and fhasta = cast ('" . $fhasta . "' as date);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function deleteAsistMensualByPeriodo($idestructura,$fdesde, $fhasta)
    {
        $sql = "DELETE FROM 
                    mod_regimentrabajo.dat_asistenciamensual
                    WHERE idestructura = $idestructura and fdesde = cast ('" . $fdesde . "' as date) and fhasta = cast ('" . $fhasta . "' as date);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        return true;
    }

    public function getArrayColumn($array, $columna)
    {
        $arr = array_map(function ($element) use ($columna) {
            return (!empty($element[$columna])) ? $element[$columna] : 0;
        }, $array);
        return $arr;
    }

    public function GetTotalTrabajadoresByPeriodo($idcargos, $fdesde, $fhasta)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT   count(m3.idpersona) AS cantidad            
                    FROM  mod_persona.dat_persona m3
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad and m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0) 
                    LEFT JOIN mod_estructuracomp.nom_cargo m18 ON m14.idnomcargo = m18.idnomcargo                                     
                    WHERE (m12.idcargo IN (" . implode(',', $idcargos) . ") AND (m3.feliminado >= LOCALTIMESTAMP(0) OR m3.feliminado IS NULL)
                    AND ((cast('" . $fdesde . "' as date) >= m11.fdesde and m11.fdesde <= cast('" . $fhasta . "' as date)) or (cast('" . $fdesde . "' as date) >= m11.fhasta and 
                        m11.fhasta <= cast('" . $fhasta . "' as date) OR 
                        (m11.fdesde <= cast('" .$fdesde. "' as date) AND m11.fhasta >= cast('" . $fhasta . "' as date)))))
                    ";//print_r($query);die;
        $personas = $conn->fetchAll($query);
        return $personas;
    }

    public function GetReporteAsistRangoByCargoAndCausa($idcargo, $fdesde, $fhasta, $idscausa = array())
    {
        if(!empty($idscausa)){
            $causas = " and m.idcausa in (" . implode(',', $idscausa) . ")";
        } else
            $causas = "";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT count(m.idasistencia) AS cantidad
                    FROM mod_regimentrabajo.dat_asistencia m
                    left JOIN mod_regimentrabajo.conf_calendariopersona cal ON m.idpersona = cal.idpersona AND cal.fecha = m.fecharegistro
                    INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona                    
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad and m12.estado = 0                    
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.idcargo = m.idcargo and drt.actual = 1";

        $where = " WHERE ((m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo " .$causas." )
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date))))
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo) " .$causas." )
             ";
        $query .= $where;
        //print_r($query);die;
        $personas = $conn->fetchAll($query);
        return $personas;
    }
 
   



}//fin clase 
?>


