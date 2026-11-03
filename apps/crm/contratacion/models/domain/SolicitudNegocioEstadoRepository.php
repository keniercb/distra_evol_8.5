<?php
/**
 * SolicitudNegocioEstadoRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class SolicitudNegocioEstadoRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalIdSolicitud'=> array('statement'=>'se.idsolicitud = ?'),
        );
        parent::__construct('SolicitudNegocioEstado', 'se', 'idsolicitudestado', $filters);
    }

    public function getEstadoInicial($idproceso)
    {
        return Doctrine_Query::create()
                ->select('ne.idestado')
                ->from('NomEstado ne')
                ->leftJoin('ne.NomTransicion nt ON ne.idestado = nt.idestadoinicial')
                ->leftJoin('nt.NomProceso np')
                ->where('ne.inicial = 1 and np.identificador =?', $idproceso)
                ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function getEstados($filters)
    {
//        $query = $this->getBasicDqlQuery()
//            ->addSelect("ne.nombre as estado, su.nombreusuario as usuario, su.idpersona as idpersona, ne.icono as iconoestado")
//            ->leftJoin('se.NomEstado ne')
//            ->innerJoin('se.SegUsuario su');
//
//        $query = $this->getDqlQueryBuilder($query, $filters);
//
//        return $query->fetchArray();

        return Doctrine_Query::create()
            ->select('se.*, ne.nombre as estado, su.nombreusuario as usuario, 
                            su.idpersona as idpersona, ne.icono as iconoestado')
            ->from('SolicitudNegocioEstado se')
            ->leftJoin('se.NomEstado ne ON se.idestado = ne.idestado')
            ->innerJoin('se.SegUsuario su ON se.idusuario = su.idusuario')
            ->where('se.idsolicitud = '.$filters['equalIdSolicitud'])
            ->orderBy('se.idsolicitudestado')
            ->fetchArray();
    }

    public function getEstadoTransicionesPermisos($idproceso, $idsrol, $idestructura=null)
    {
        $stringIdsRol = '('.implode(",", $idsrol).')';

        return Doctrine_Query::create()
            ->select('ne.*, nt.*,rt.*')
            ->from('NomEstado ne INDEXBY ne.idestado')
            ->leftJoin('ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado')
            ->leftJoin('nt.DatRolTransicion rt WITH rt.idrol IN '.$stringIdsRol)
            ->leftJoin('nt.NomProceso np')
            ->where('np.identificador =? AND nt.idestructura =?', array($idproceso, $idestructura))
            ->fetchArray();
    }

    public function modificarFechaFinEstadoCuliminado($fechafin, $idsolicitud)
    {
         Doctrine_Query::create()
            ->update('SolicitudNegocioEstado')
            ->set('fechafin', '?', $fechafin)
            ->where('fechafin is null and idsolicitud =? ', $idsolicitud)->execute();
    }

    public function obtenerUltimoEstado($idsolicitud)
    {
        $result=Doctrine_Query::create()
            ->select('*')
            ->from('SolicitudNegocioEstado')
            ->where('fechafin is NULL and idsolicitud =? ', $idsolicitud)->fetchArray();
        return count($result)?$result[0]:null;
    }

    public function actualizarRolesObligatorios($rolesobligatorios, $idsolicitud)
    {
        Doctrine_Query::create()
            ->update('SolicitudNegocioEstado')
            ->set('rolesobligatorios', '?', $rolesobligatorios)
            ->where('fechafin is NULL AND idsolicitud =? ', $idsolicitud)->execute();
    }
}