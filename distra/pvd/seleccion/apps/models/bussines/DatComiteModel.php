<?php
class DatComiteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

	/**
	 * Función para obtener los comités con personas asociadas.
     * @param $limit, $start
     * @return array
     */
    public function getComite($limit, $start)
    {
		$datoscomite = DatComite::getComitesConPersonas($limit, $start);
		$datos = Array();		
		foreach ($datoscomite as $r => $value) {
			$datos[$r]['idcomite'] = $value['idcomite'];
			$datos[$r]['estructura'] = $value['estructura'];
			if ($value['estructura'] == 1) {
				$comite = ZendExt_IoC::getInstance()->metadatos->DameEstructura($value['idcomite']);
				$datos[$r]['denominacion'] = $comite[0]->denominacion;
			} else {
				$comite = NomComite::getDenomByIdComite($value['idcomite']);
				$datos[$r]['denominacion'] = $comite[0]['denominacion'];
			}			
		}	
		$resp->datos = $datos;
		$resp->cantidad = DatComite::cantComitesConPersonas();
		return $resp;
    }
	
	public function getPersonasByProceso($idproceso)
    {
		$datoscomite = DatProcesocomite::getComitesByIdProceso($idproceso);		
		$personas = Array();
		if ($datoscomite) {					
			foreach ($datoscomite as $r => $value) {
				$personas[$r]['idcomite'] = $value['idcomite'];
				$personas[$r]['idcomitep'] = $value['idcomitep'];
				$personas[$r]['estructura'] = $value['estructura'];
				$personas[$r]['idpersona'] = $value['idpersona'];
				$datospers = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array($value['idpersona']),null,null,null,null,null);
				$personas[$r]['numid'] = $datospers->data[0]['numid'];
				$personas[$r]['nombre'] = $datospers->data[0]['nombre'];
				$personas[$r]['snombre'] = $datospers->data[0]['snombre'];
				$personas[$r]['papel'] = $datospers->data[0]['papel'];
				$personas[$r]['sapel'] = $datospers->data[0]['sapel'];
				$idcargo = $datospers->data[0]['idcargo'];				
				$carg = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargo);
				$personas[$r]['cargo'] = ($carg[0]['denominacion'])?$carg[0]['denominacion']:'No asignado';
				if ($value['estructura'] == 1) {
					$comite = ZendExt_IoC::getInstance()->metadatos->DameEstructura($value['idcomite']);
					$personas[$r]['comite'] = $comite[0]->denominacion;
				} else {
					$comite = NomComite::getDenomByIdComite($value['idcomite']);
					$personas[$r]['comite'] = $comite[0]['denominacion'];
				}			
			}	
		}		
		$resp->datos = $personas;
		return $resp;
    }
	
	/**
	 * Función para obtener un árbol dado un id.
     * @param $id
     * @return array
     */
    public function getEstructura($id)
    {
		return ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
    }
	
	/**
	 * Función para obtener el id de la raiz del árbol configurada para el concepto.
     * @param $id
     * @return array
     */
	public function getEstructuraConcepto()
    {
		$query = new Doctrine_Query();
		$sql = 'SELECT idestructura FROM mod_personaproyecto.conf_conceptoestructura WHERE idconfiguracion = 7';
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
        return $result[0][idestructura];
    }
	
	/**
	 * Función para obtener las personas dado el comité.
     * @param $idcomite
     * @param $estructura (0-> Si utiliza el nomenclador, 1-> Utiliza Estructura y Composición)
     * @return array
     */
	public function getPersonaComite($idcomite, $estructura, $limit, $start, $filtro)
	{
		try {
			$r = DatComite::getPersByComite($idcomite, $estructura, $limit, $start, $filtro);
			foreach($r AS $k => $v) {
				//imagen para el género de la persona
				if($r[$k][sexo] == 1){
					$r[$k][sexo] = '<center><img src="/pvd/seleccion/views/images/male.png" /></center>';
				} else {
					$r[$k][sexo] = '<center><img src="/pvd/seleccion/views/images/female.png" /></center>';
				}
			}
			$total = DatComite::getCantPersByComite($idcomite, $estructura, $filtro)[0]['count'];
			$res[data] = $r;
			$res[total] = $total;
			return $res;
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	public function addPersonaComite($arrPers, $idcomite, $estructura)
	{
		try {
			foreach($arrPers as $k => $v) {
				$dcomite = new DatComite();
				$dcomite->idcomite = $idcomite;
				$dcomite->estructura = $estructura;
				$dcomite->idpersona = $v;
				$dcomite->save();
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function delPersonaComite($arr)
	{
		try {
			foreach ($arr as $k => $v) {
				$dcomite = DatComite::getById($v);
				$dcomite -> delete();
			}
			return true;
		} catch (Exception $e) {
            if($e->GetCode() == 23503){
                return false;
            }
		}
	}
}