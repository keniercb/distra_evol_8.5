<?php
class DatResponsableModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

	public function getRespByTecnica($idprocesotecnica)
    {
		$datos = DatResponsable::getRespByTecnica($idprocesotecnica);
		$personas = Array();
		if ($datos) {
			$r = 0;
			foreach ($datos as $value) {
				$datospers = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($value['idpersona']),null,null,null,null,null);
				if ($datospers->quantity > 0) {
					$personas[$r]['idcomisionpersona'] = $value['idcomisionpersona'];
					$personas[$r]['idpersona'] = $value['idpersona'];
					$personas[$r]['numid'] = $datospers->data[0]['numid'];
					$personas[$r]['nombreyapellidos'] = $datospers->data[0]['nombreapellidos'];
					$personas[$r]['cargocomision'] = $value['cargocomision'];
                    $personas[$r]['comision'] = $value['comision'];
					$r++;
				}
			}	
		}		
		$resp->datos = $personas;
		return $resp;
    }	
	
}