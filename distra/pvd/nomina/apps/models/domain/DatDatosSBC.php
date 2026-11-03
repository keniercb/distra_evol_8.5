<?php

class DatDatosSBC extends BaseDatDatosSBC {

       public static function obtenerBaseDatDatosSBCDadoId($iddatossbc) {
        return Doctrine::getTable('DatDatosSBC')->find($iddatossbc);
    }
	
	   public static function obtenerTodos() {
        return Doctrine::getTable('DatDatosSBC')->findAll();
    }
	
	 public static function getforLimitAndStart($limite = 600, $inicio = 0, $textoabuscar) {
        if($textoabuscar=="" || $textoabuscar==null){
		  //Devolviendo el listado de datos de los sbc.
         return Doctrine_Query::create()
                ->from('DatDatosSBC')
			    ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
		}else{
		$sqlDatosPersona = "select  sbc.iddatossbc, sbc.sbct, sbc.idpersona, sbc.sbc1, sbc.sbc2, sbc.sbc3 from mod_nomina.dat_datossbc sbc
                   inner join mod_persona.dat_persona dp on(dp.idpersona = sbc.idpersona)		
		           where dp.nombre ilike '%".$textoabuscar."%' or dp.snombre ilike '%".$textoabuscar."%' 
				   or dp.papel ilike '%".$textoabuscar."%' or dp.sapel ilike '%".$textoabuscar."%';";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
		 $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
		 return $arrdatpersona;
		}
    }
	
	public static function getforLimitAndStartPlantilla($limite = 600, $inicio = 0) {
      
		  //Devolviendo el listado de datos de los sbc.
         return Doctrine_Query::create()
		        ->select('dsbc.*,na.denominacion as area')
                ->from('DatDatosSBC dsbc')
				->innerJoin('dsbc.NomAreas na')
			    ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
		
    }
	
	public static function getforIdarea($areas,$limite = 600, $inicio = 0, $textoabuscar) {
        if($textoabuscar=="" || $textoabuscar==null){
		  //Devolviendo el listado de datos de los sbc.
			$query = new Doctrine_Query ();
			$result = (($inicio != null) and ($limite != null))?
			$query->select('dsbc.*,na.denominacion as area')
                ->from('DatDatosSBC dsbc')
				->innerJoin('dsbc.NomAreas na')
				->where('dsbc.idarea = ?',array($areas))
			    ->limit($limite)
                ->offset($inicio)
                ->fetchArray():
				$query->select('dsbc.*,na.denominacion as area')
                ->from('DatDatosSBC dsbc')
				->innerJoin('dsbc.NomAreas na')
				->where('dsbc.idarea = ?',array($areas))
                ->fetchArray();
			return $result;
		}else{
		$sqlDatosPersona = "select  sbc.iddatossbc, sbc.sbct, sbc.idpersona, sbc.sbc1, sbc.sbc2, sbc.sbc3,na.denominacion as area,sbc.idarea as idarea from mod_nomina.dat_datossbc sbc
                   inner join mod_persona.dat_persona dp on(dp.idpersona = sbc.idpersona)	
				   inner join mod_nomina.nom_areas na on(na.idarea = sbc.idarea) 	
		           where dp.nombre ilike '%".$textoabuscar."%' or dp.snombre ilike '%".$textoabuscar."%' 
				   or dp.papel ilike '%".$textoabuscar."%' or dp.sapel ilike '%".$textoabuscar."%'and sbc.idarea = $areas ;";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
		 $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
		 return $arrdatpersona;
		}
    }
	
	public static function getTotalCountforLimitAndStart() {
        //Devolviendo el listado de datos de los sbc.
        return Doctrine_Query::create()
                ->select('count(sbc.iddatossbc) as cantidad')
                ->from('DatDatosSBC sbc')
			    ->fetchOne()
                ->cantidad;
    }
	
	public static function obtenerTodasArea() {
		$limitCadena = ($start != null and $limit != null)? "limit $start offset $limit": " ";
       	$sqlDatosArea = "select distinct (sbc.idarea), na.denominacion as area 
						   from mod_nomina.dat_datossbc as sbc
						   inner join mod_nomina.nom_areas as na on (sbc.idarea = na.idarea)" . $limitCadena;
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
		$arrarea = $conn->fetchAll($sqlDatosArea);
		return $arrarea;
    }

	public static function obtenerCantidadTodasArea(){
		$sqlCantidadArea = "select count(distinct (sbc.idarea))
		from mod_nomina.dat_datossbc as sbc
		inner join mod_nomina.nom_areas as na on (sbc.idarea = na.idarea)";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$cantarea = $conn->fetchOne($sqlCantidadArea);
		return $cantarea;
	}
}
