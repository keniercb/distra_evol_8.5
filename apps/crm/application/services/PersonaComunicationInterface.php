<?php

/**
 * SeguridadComunicatorService
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema de seguridad.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina
 * @copyright (c) 2015, XETID
 * @version       1.0
 */
class PersonaComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getListadoPersonas($params)
    {
        try {
            return $this->integrator->pvd->getPrincipalesDatosPersona(
                null, $params['nombreapellidos'], $params['limit'], $params['start'], null,
                null, null
//                $params['idcargo'], $params['idestructura']
            );
        } catch (Exception $e) {
            return array();
        }
    }

    public function getPersona($idpersona, $idestructura)
    {
        try {
            if ($idpersona) {
                $result = $this->integrator->pvd->getPrincipalesDatosPersona(
                    $idpersona, null, null, null, $idestructura
                );
                return $result->data[0];
            }
            return array();
        } catch (Exception $e) {
            return array();
        }
    }

    public function getDatosContactoPersonas($idpersonas){
        try{
            $idpersonas = implode(',',$idpersonas);
            $query = "select dc.contacto from mod_persona.dat_contacto dc 
                      where dc.idpersona in ($idpersonas) AND dc.contacto like '%@%'";
            return $this->executeQuery($query);
        }catch (Exception $e){
            return array();
        }
    }

    private function executeQuery($query)
    {
        try{
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            return $conexion->fetchAll($query);
        }catch (Exception $e){
            throw $e;
        }
    }
}