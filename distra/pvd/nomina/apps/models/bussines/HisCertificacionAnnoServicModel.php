<?php

class HisCertificacionAnnoServicModel extends ZendExt_Model {
	public function HisCertificacionAnnoServicModel()
	{
		parent::ZendExt_Model();
	}

	public function getPersonaentidadHis($identidad,$fecha)
	{
		$arrayPersonasHis = HisCertificacionAnnoServic::obtenerHisPersonasCertificadas($identidad,$fecha);
		return $arrayPersonasHis;
	}

	public function addPersonashistorico($datos)
	{
		foreach ($datos as $k => $valor)
		{
			if( $valor->idcertificacionannoservc != null)
			{
				$objCertif = Doctrine::getTable('ConfCertificacionAnnoServic')->find($valor->idcertificacionannoservc);
				$objPersonahistorico = new HisCertificacionAnnoServic();
				$objPersonahistorico->idpersona = $objCertif->idpersona;
				$objPersonahistorico->identidad = $objCertif->identidad;
				$objPersonahistorico->faltaentidad = $objCertif->faltaentidad;
				$objPersonahistorico->antuguedad = $objCertif->antuguedad;
				$objPersonahistorico->mesesservicio = $objCertif->mesesservicio;
				$objPersonahistorico->annosservc = $objCertif->annosservc;
				$objPersonahistorico->incremento = $objCertif->incremento;
				$objPersonahistorico->annosserventidad = $objCertif->annosserventidad;
				$objPersonahistorico->mesesserventidad = $objCertif->mesesserventidad;
				$objPersonahistorico->mesesserventidadincremental = $objCertif->mesesserventidadincremental;
				$objPersonahistorico->annosserventidadincremental = $objCertif->annosserventidadincremental;
				$objPersonahistorico->save();
			}

		}
	}

	public function  getPeriodoshistorico($identidad)
	{
		$arrayPeriodos = HisCertificacionAnnoServic::obtenerPeriodos($identidad);
		foreach ($arrayPeriodos as $i => $valor)
		{
			$fecha = explode('/',$arrayPeriodos[$i]['fecha']);
			$arrayPeriodos[$i]['anno'] = $fecha[2];

		}
		return $arrayPeriodos;
	}
}
