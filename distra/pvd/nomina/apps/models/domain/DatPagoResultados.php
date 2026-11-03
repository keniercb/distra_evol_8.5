<?php

class DatPagoResultados extends BaseDatPagoResultados {

       public static function obtenerDatPagoResultadosDadoId($idpagoresultado) {
        return Doctrine::getTable('DatPagoResultados')->find($idpagoresultado);
    }
	
	   public static function obtenerTodos() {
        return Doctrine::getTable('DatPagoResultados')->findAll();
    }
	
	 public static function getforLimitAndStart($limite = 600, $inicio = 0, $textoabuscar) {
        if($textoabuscar=="" || $textoabuscar==null){
		  //Devolviendo el listado de datos de los sbc.
         return Doctrine_Query::create()
                ->from('DatPagoResultados')
			    ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
		}else{
		$sqlDatosPersona = "select  sbc.idpagoresultado, sbc.sbct, sbc.idpersona, sbc.sbctcpd, sbc.evalarea, sbc.evalindividual 
		                    , sbc.cpd, sbc.ctrt, sbc.ids, sbc.idpersona
					from mod_nomina.dat_pagoresultado sbc
                   inner join mod_persona.dat_persona dp on(dp.idpersona = sbc.idpersona)		
		           where dp.nombre ilike '%".$textoabuscar."%' or dp.snombre ilike '%".$textoabuscar."%' 
				   or dp.papel ilike '%".$textoabuscar."%' or dp.sapel ilike '%".$textoabuscar."%';";
				   $mg = Doctrine_Manager::getInstance();
				   $conn = $mg->getCurrentConnection();
		 $arrdatpersona = $conn->fetchAll($sqlDatosPersona);
		 return $arrdatpersona;
		}
    }
	
	 public static function getTotalCountforLimitAndStart() {
        //Devolviendo el listado de datos de los sbc.
        return Doctrine_Query::create()
                ->select('count(sbc.idpagoresultado) as cantidad')
                ->from('DatPagoResultados sbc')
			    ->fetchOne()
                ->cantidad;
    }
}
