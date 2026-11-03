<?php

/**
 * SolicitudPagoRepository
 *
 * @package    Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright  UCID
 * @version    1.0
 */
class SeguimientoRepository extends BaseRepository
{
    public function __construct()
    {
        $filters = array(
            'equalIdSeguimiento' => array('statement' => 'ae.idarribo = ?'),
        );
        parent::__construct(
            'DatArriboEstado', 'ae', 'idarriboestado', $filters
        );
    }

//    public function getEstadoInicial($idproceso)
//    {
//        return Doctrine_Query::create()
//            ->select('ne.idestado')
//            ->from('NomEstado ne')
//            ->leftJoin(
//                'ne.NomTransicion nt ON ne.idestado = nt.idestadoinicial'
//            )
//            ->leftJoin('nt.NomProceso np')
//            ->where('ne.inicial = 1 and np.identificador =?', $idproceso)
//            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
//    }

    public function getEstados($filters)
    {
        $query = $this->getBasicDqlQuery()
            ->addSelect(
                ' ne.nombre as estado, su.nombreusuario as usuario, su.idpersona as idpersona, ne.icono as iconoestado '
            )
            ->leftJoin('ae.NomEstado ne')
            ->innerJoin('ae.SegUsuario su');
        $query = $this->getDqlQueryBuilder($query, $filters);
//            if($filters['equalIdSolicitudpago']){
//                $query->where('spe.idsolicitudpago = ?', $filters['equalIdSolicitudpago']);
//            }
        return $query->fetchArray();
    }

//    public function getEstadoTransicionesPermisos($idproceso, $idsrol,
//        $idestructura = null
//    ) {
//        $stringIdsRol = '(' . implode(",", $idsrol) . ')';
//
//        return Doctrine_Query::create()
//            ->select('ne.*, nt.*,rt.*')
//            ->from('NomEstado ne INDEXBY ne.idestado')
//            ->leftJoin(
//                'ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado'
//            )
//            ->leftJoin(
//                'nt.DatRolTransicion rt WITH rt.idrol IN ' . $stringIdsRol
//            )
//            ->leftJoin('nt.NomProceso np')
//            ->where(
//                'np.identificador =? AND nt.idestructura =?',
//                array($idproceso, $idestructura)
//            )
//            ->fetchArray();
//    }

//    public function modificarFechaFinEstadoCuliminado($fechafin, $idsolicitud)
//    {
//        Doctrine_Query::create()
//            ->update('SolicitudNegocioEstado')
//            ->set('fechafin', '?', $fechafin)
//            ->where('fechafin is null and idsolicitud =? ', $idsolicitud)
//            ->execute();
//    }
}