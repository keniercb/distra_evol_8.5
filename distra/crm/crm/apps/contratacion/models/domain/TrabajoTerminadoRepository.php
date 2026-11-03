<?php

/**
 * SolicitudNegocioEstadoRepository
 *
 * @package    Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright  UCID
 * @version    1.0
 */
class TrabajoTerminadoRepository extends BaseRepository
{
    public function __construct()
    {
        $filters = array(
            'equalIdHito' => array('statement' => 'tt.idhito = ?'),
        );
        parent::__construct('DatHitoEstado', 'tt', 'idhitoestado', $filters);
    }

    public function getEstadoInicial($idproceso)
    {
        return Doctrine_Query::create()
            ->select('ne.idestado')
            ->from('NomEstado ne')
            ->leftJoin(
                'ne.NomTransicion nt ON ne.idestado = nt.idestadoinicial'
            )
            ->leftJoin('nt.NomProceso np')
            ->where('ne.inicial = 1 and np.identificador =?', $idproceso)
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function getEstados($filters)
    {
        $query = $this->getBasicDqlQuery()
            ->addSelect(
                ' ne.nombre as estado, su.nombreusuario as usuario, su.idpersona as idpersona, ne.icono as iconoestado ')
            ->leftJoin('tt.NomEstado ne')
            ->innerJoin('tt.SegUsuario su');
        $query = $this->getDqlQueryBuilder($query, $filters);
        return $query->fetchArray();
    }

    public function getEstadoTransicionesPermisos($idproceso, $idsrol,
        $idestructura = null
    ) {
        $stringIdsRol = '(' . implode(",", $idsrol) . ')';

        return Doctrine_Query::create()
            ->select('ne.*, nt.*,rt.*')
            ->from('NomEstado ne INDEXBY ne.idestado')
            ->leftJoin(
                'ne.NomTransicion nt ON nt.idestadoinicial = ne.idestado OR nt.idestadofinal = ne.idestado'
            )
            ->leftJoin(
                'nt.DatRolTransicion rt WITH rt.idrol IN ' . $stringIdsRol
            )
            ->leftJoin('nt.NomProceso np')
            ->where(
                'np.identificador =? AND nt.idestructura =?',
                array($idproceso, $idestructura)
            )
            ->fetchArray();
    }

    public function modificarFechaFinEstadoCuliminado($fechafin, $idsolicitud)
    {
        Doctrine_Query::create()
            ->update('SolicitudNegocioEstado')
            ->set('fechafin', '?', $fechafin)
            ->where('fechafin is null and idsolicitud =? ', $idsolicitud)
            ->execute();
    }
}