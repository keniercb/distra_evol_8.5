<?php
/**
 * PenalizacionEstadoRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class PenalizacionEstadoRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalIdPenalizacion'=> array('statement'=>'pe.idpenalidad = ?'),
        );
        parent::__construct('PenalizacionEstado', 'pe', 'idpenalidadestado', $filters);
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
            ->addSelect("ne.nombre as estado, su.nombreusuario as usuario, su.idpersona as idpersona, su.idpersona as idpersona, ne.icono as iconoestado")
            ->leftJoin('pe.NomEstado ne')
            ->innerJoin('pe.SegUsuario su');
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

    public function modificarFechaFinEstadoCulmiminado($idpenalidad)
    {
        try {
            $instance = Doctrine::getTable('PenalizacionEstado')->findByDql(
                'idpenalidad=? and fechafin ISNULL', array($idpenalidad)
            );
            if (count($instance)) {
                $instance = $instance[0];
                $instance->fechafin = date('d/m/Y');
                $instance->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

}