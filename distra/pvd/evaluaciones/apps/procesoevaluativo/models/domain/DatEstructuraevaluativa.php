<?php
class DatEstructuraevaluativa extends BaseDatEstructuraevaluativa
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEvalpreprocesoevaluativo',
            array('local' => 'idpreprocesoevaluativo', 'foreign' => 'idpreprocesoevaluativo')
        );
        $this->hasMany(
            'DatEstructurapersona',
            array('local' => 'idestructuraevaluativa', 'foreign' => 'idestructuraevaluativa')
        );
        $this->hasMany(
            'DatEstructuraevaluativa',
            array('local' => 'idpadre', 'foreign' => 'idestructuraevaluativa')
        );
    }

    public function find($idestructuraevaluativa)
    {
        return Doctrine::getTable('DatEstructuraevaluativa')->find($idestructuraevaluativa);
    }

    public function getEstructuraevaluativa($idpreprocesoevaluativo, $idestructura, $idpadre)
    {
        $queryObj = Doctrine_Query::create()
            ->select('idestructuraevaluativa, idpadre, idpreprocesoevaluativo, idestructura')
            ->from('DatEstructuraevaluativa')
            ->where('idpreprocesoevaluativo = ?', $idpreprocesoevaluativo);

        if ($idestructura) {
            $queryObj->addWhere('idestructura = ?', $idestructura);
        }

        if ($idpadre) {
            $queryObj->addWhere('idpadre = ?', $idpadre);
        }

        return $queryObj->fetchArray();
    }

    public function getAll($idpreprocesoevaluativo,$idpadre)
    {		
        $queryObj = Doctrine_Query::create()
            ->select('idestructuraevaluativa, idpadre, idpreprocesoevaluativo, idestructura')
            ->from('DatEstructuraevaluativa')
            ->where('idpreprocesoevaluativo = ?', $idpreprocesoevaluativo);

        if (empty($idpadre)) {
            $queryObj->addWhere('idpadre is null');
        } else {
            $queryObj->addWhere('idpadre = ?', $idpadre);
        }
       
        return $queryObj->fetchArray();
    }
	public function tieneEstructuraM($idpreprocesoevaluativo)
    {
	  
	   $sql = "SELECT COUNT(e.idestructuraevaluativa)
            FROM mod_evaluaciones.dat_estructuraevaluativa e            
            WHERE e.idpreprocesoevaluativo = {$idpreprocesoevaluativo}";       

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchOne($sql); 
         	 	
        return $result;
        
    }
	    public function getPersonas($idpreprocesoevaluativo, $idestructura)
    {
		
        $query = Doctrine_Manager::getInstance();       
       
        $sql = "SELECT est.idestructuraevaluativa, def.idprocesoplanilla, def.idmodelo, def.iddefprocesoevaluativo,estp.idpersona,estp.nopersona,
		        def.idplanilla, pla.denom as planilla, pla.descripcion as descripcion
            FROM mod_evaluaciones.dat_estructuraevaluativa est
            INNER JOIN  mod_evaluaciones.dat_estructurapersona estp ON(est.idestructuraevaluativa = estp.idestructuraevaluativa)
            INNER JOIN  mod_evaluaciones.dat_evaldefprocesoplanillas def ON(estp.idprocesoplanilla = def.idprocesoplanilla)
			INNER JOIN  mod_evaluaciones.dat_evalplanillasevaluativas pla ON(def.idplanilla = pla.idplanilla)
            WHERE est.idpreprocesoevaluativo = {$idpreprocesoevaluativo} AND est.idestructura = {$idestructura}";

        $personas = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($personas as &$persona) {
            $data = array();
            switch ($persona['nopersona']) {
                case 1:
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($evaluado['idpersona']);
                    $ruta = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($evaluado['idpersona']));
                    if (!empty($estruc)) {
                        $data['foto'] = $estruc[0]->icon;
                        $persona['icon'] = $estruc[0]->icon;
                        $persona['nombre'] = $estruc[0]->text;
                        $data['nombreapellidos'] = $ruta[0]['rutaDenominacion'];
                    }
                    break;
                default:
                    $personaserv = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($persona['idpersona']);					
					$data['foto'] = $personaserv->data[0]['foto'] ? 'data:image/png;base64,' . $personaserv->data[0]['foto'] : null;
                    $data['nombreapellidos'] = $personaserv->data[0]['nombreapellidos'];
                    $persona['numid'] = $personaserv->data[0]['numid'];
                    $persona['nombre'] = $personaserv->data[0]['nombre'];
                    $persona['snombre'] = $personaserv->data[0]['snombre'];
                    $persona['papel'] = $personaserv->data[0]['papel'];
                    $persona['sapel'] = $personaserv->data[0]['sapel'];
                    $persona['sexo'] = $personaserv->data[0]['sexo'];
                    $persona['denomsexo'] = $personaserv->data[0]['denomsexo'];
					$persona['cargo'] = $personaserv->data[0]['denomcargo'];
					$persona['idcargo'] = $personaserv->data[0]['idcargo'];
                   /* if (!empty($persona->data[0]['idcargo'])) {
                        $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo']);
                        $evaluado['cargo'] = $datosCargo[0]['denominacion'];
                    }*/
                    break;
            }
            $persona['foto'] = $data['foto'];
            $persona['nombrecompleto'] = $data['nombreapellidos'];

        }return $personas;
    }

}
