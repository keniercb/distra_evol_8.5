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
class SeguridadComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getFunctionalitiesUser()
    {
        return $this->integrator->seguridad->getFunctionalitiesUser(
            $this->global->Perfil->certificado,
            $this->global->Perfil->idusuario,
            $this->global->Estructura->idestructura
        );
    }

    public function getNonVisibleFunctionlatities($uri)
    {
        return $this->integrator->seguridad->obtenerFuncionalidadesNoVisibles(
            $uri
        );
    }

    public function getRoles()
    {
        $result = $this->integrator->seguridad->getTodosRoles();
        return $result;
    }

    public function getRolsByUser($idususario)
    {

        if (!is_numeric($idususario)) {
            return;
        }

        $result = $this->integrator->seguridad->getRolesbyUser($idususario);
        return $result;
    }

    public function getUsers($limit = 25, $start = 0, $nombre = null)
    {
        //TODO servicio que dé la cantidad de usuarios que cumple con el filtro
        $cant = $this->integrator->seguridad->cantidadUsuarios();
        $result = $this->integrator->seguridad->getUserList(
            $limit, $start, $nombre
        );
        return array('data' => $result['datos'], 'count' => $cant);
    }

    public function getUserNameById($idusuario)
    {
        return $this->integrator->seguridad->nombreUsuario($idusuario);
    }

    public function getFunctionalityByUrl($url)
    {
        try {
            $resultado = $this->integrator->seguridad->getMenuFuncionalidad(
                $url
            );
            return $resultado;
        } catch (Exception $e) {
            return array();
        }
    }

    public function getUserByRole($idrole)
    {
        try {
            return $this->integrator->seguridad->getUserListWithRole($idrole);
        } catch (Exception $e) {
            return array();
        }
    }

    public function getIdPersonsByUsers($idusers,$identity = null)
    {
        try {
            if($identity){
                $users = $this->getUsersInEntity($idusers,$identity);
                $idusers = [];
                foreach ($users as $u){
                    if(!in_array($u['nombreusuario'],$idusers)){
                        $idusers[] = $u['nombreusuario'];
                    }
                }
            }
            return $this->integrator->seguridad->getArrayIdPersonaByUsersName(
                $idusers
            );
        } catch (Exception $e) {
            return array();
        }
    }

    public function getUsersInEntity($idusers,$identity){
        try{
            $idusers = is_array($idusers) ? $idusers : [$idusers];
            $sql = "select su.idusuario,su.nombreusuario,su.iddominio,COALESCE (desop.denominacion, des.denominacion) as nombrearea 
                    from mod_seguridad.seg_usuario su 
                    inner join mod_estructuracomp.nom_filaestruc nfe on nfe.dominiofila[su.iddominio]=1::bit
                    LEFT JOIN mod_estructuracomp.dat_estructura des ON (nfe.idfila = des.idestructura and des.idproyecto = 0)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (nfe.idfila = desop.idestructuraop and desop.idproyecto = 0)
                    where su.nombreusuario IN('".implode("','",$idusers)."') and nfe.idfila = $identity";
            return $this->executeQuery($sql);
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