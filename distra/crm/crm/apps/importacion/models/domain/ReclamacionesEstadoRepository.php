<?php
/**
 * ReclamacionesEstadoRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class ReclamacionesEstadoRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalIdReclamacion'=> array('statement'=>'re.idreclamacion = ?'),
        );
        parent::__construct('ReclamacionEstado', 're', 'idreclamacionestado', $filters);
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
            ->leftJoin('re.NomEstado ne')
            ->innerJoin('re.SegUsuario su');
       // print_r($filters);die;
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

    public function modificarFechaFinEstadoCulmiminado($idreclamacion)
    {
        try {
            $instance = Doctrine::getTable('ReclamacionEstado')->findByDql(
                'idreclamacion=? and fechafin ISNULL', array($idreclamacion)
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