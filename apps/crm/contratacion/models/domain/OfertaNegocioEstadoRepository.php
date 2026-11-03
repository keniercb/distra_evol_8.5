<?php
/**
 * OfertaNegocioEstadoRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class OfertaNegocioEstadoRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalIdOferta'=> array('statement'=>'oe.idoferta = ?'),
        );
        parent::__construct('OfertaNegocioEstado', 'oe', 'idofertaestado', $filters);
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
        $query = $this->getBasicDqlQuery()
            ->addSelect("ne.nombre as estado, su.nombreusuario as usuario, 
            su.idpersona as idpersona, ne.icono AS iconoestado")
            ->leftJoin('oe.NomEstado ne')
            ->innerJoin('oe.SegUsuario su');;

        $query = $this->getDqlQueryBuilder($query, $filters);

        return $query->fetchArray();
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

    public function modificarFechaFinEstadoCuliminado($fechafin, $idoferta)
    {
         Doctrine_Query::create()
            ->update('OfertaNegocioEstado')
            ->set('fechafin', '?', $fechafin)
            ->where('fechafin is null and idoferta =? ', $idoferta)->execute();
    }

    public function obtenerUltimoEstado($idoferta)
    {
        $result=Doctrine_Query::create()
            ->select('*')
            ->from('OfertaNegocioEstado')
            ->where('fechafin is NULL and idoferta =? ', $idoferta)->fetchArray();
        return count($result)?$result[0]:null;
    }

    public function actualizarRolesObligatorios($rolesobligatorios, $idoferta)
    {
        Doctrine_Query::create()
            ->update('OfertaNegocioEstado')
            ->set('rolesobligatorios', '?', $rolesobligatorios)
            ->where('fechafin is NULL AND idoferta =? ', $idoferta)->execute();
    }
}