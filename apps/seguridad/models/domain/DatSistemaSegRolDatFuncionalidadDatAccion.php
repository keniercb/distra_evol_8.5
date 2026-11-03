<?php

/**
 * Clase dominio DatSistemaSegRolDatFuncionalidadDatAccion.
 *
 * @package seguridad.
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSistemaSegRolDatFuncionalidadDatAccion 
extends BaseDatSistemaSegRolDatFuncionalidadDatAccion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccion', 
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasOne(
            'DatSistemaSegRolDatFuncionalidad', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasOne(
            'DatSistemaSegRolDatFuncionalidad', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->hasOne(
            'DatSistemaSegRolDatFuncionalidad', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasOne(
            'DatRecurso', 
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
    }

    static public function cargaraccionesquetiene(
        $idsistema, $idrol, $idfuncionalidad, $limit, $start
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('a.idaccion, a.denominacion,a.idfuncionalidad')
            ->from('DatAccion a,a.DatSistemaSegRolDatFuncionalidadDatAccion s')
            ->where(
                "s.idsistema = ? and s.idrol=? and s.idfuncionalidad=?",
                array($idsistema, $idrol, $idfuncionalidad)
            )
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static public function todaslasaccionesquetiene(
        $idsistema, $idrol, $idfuncionalidad
    )
    {
        $query = Doctrine_Query::create();
        $cantidad = $query->select('count(s.idaccion) cant')
            ->from('DatSistemaSegRolDatFuncionalidadDatAccion s')
            ->where(
                "s.idsistema = ?  and s.idrol = ? and s.idfuncionalidad = ?", 
                array($idsistema, $idrol, $idfuncionalidad)
            )
            ->execute();
        return $cantidad[0]->cant;
    }

    static public function cargaraccionesquenotiene(
        $idsistema, $idrol, $idfuncionalidad
    )
    {
        $query = Doctrine_Query::create();
        $acciones = $query->select('a.idaccion, a.idfuncionalidad')
            ->from('DatAccion a,a.DatSistemaSegRolDatFuncionalidadDatAccion s')
            ->where(
                "s.idsistema = ? and s.idrol=? and s.idfuncionalidad=?", 
                array($idsistema, $idrol, $idfuncionalidad)
            )
            ->execute();
        return $acciones;
    }

    static function eliminaraccion(
        $idsistema, $idfuncionalidad, $idrol, $arrayRecursos
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatSistemaSegRolDatFuncionalidadDatAccion r')
            ->where(
                "r.idsistema = ? and r.idfuncionalidad = ? and r.idrol = ?",
                array($idsistema, $idfuncionalidad, $idrol)
            )
            ->whereIn('r.idrecurso', $arrayRecursos)
            ->execute();
        return true;
    }

    static function eliminarAccionesAutorizadas(
        $arrayAccEliminar, $rolesDominio
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatSistemaSegRolDatFuncionalidadDatAccion r')
            ->whereIn('r.idaccion', $arrayAccEliminar)
            ->whereIn('r.idrol', $rolesDominio)
            ->execute();
        return true;
    }

    static function eliminarRecursosAutorizadas($arrayRecursosEl, $rolesDominio)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatSistemaSegRolDatFuncionalidadDatAccion r')
            ->whereIn('r.idaccion', $arrayRecursosEl)
            ->whereIn('r.idrol', $rolesDominio)
            ->execute();
    }

    static public function getAllRoleResourse($idrol)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            "f.referencia as url, a.denominacion as accion, a.idaccion,"
            . " f.idfuncionalidad, srf.idfuncionalidad, srfa.idfuncionalidad, "
            . "r.idrecurso, r.denominacion as srcDenominacion"
        )
            ->from('DatSistemaSegRolDatFuncionalidadDatAccion srfa')
            ->innerjoin(
                'srfa.DatSistemaSegRolDatFuncionalidad srf '
                . 'ON (srfa.idfuncionalidad = srf.idfuncionalidad)'
            )
            ->innerjoin(
                'srf.DatFuncionalidad f '
                . 'ON (srf.idfuncionalidad = f.idfuncionalidad)'
            )
            ->innerjoin('srfa.DatAccion a ON (srfa.idaccion = a.idaccion)')
            ->innerjoin('srfa.DatRecurso r ON (srfa.idrecurso = r.idrecurso)')
            ->where('srfa.idrol = ?', $idrol)
            ->execute(array(), Doctrine_Core::HYDRATE_ARRAY);
        return $datos;
    }

    static function obtenerRecursosAsignados($idrecurso)
    {
        $sql = "SELECT DISTINCT idfuncionalidad, idrol, idsistema
            FROM mod_seguridad.dat_sistemarolfuncionalidadaccion
            where idrecurso = $idrecurso;";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }

    static function eliminarPermisosRecursos(
        $idrecurso, $idfuncionalidad, $array
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaSegRolDatFuncionalidadDatAccion')
            ->where(
                'idrecurso = ? and idfuncionalidad = ?', 
                array($idrecurso, $idfuncionalidad)
            )
            ->whereIn('idaccion', $array)
            ->execute();
    }

    static function eliminarPermisosRecursosAcciones(
        $idrecurso, $array
    )
    {
        $arrayRecursos = DatSistemaSegRolDatFuncionalidadDatAccion::
        obtenerRecursosAsignados($idrecurso);
        $roleList = array();

        if (count($arrayRecursos) > 0) {
            foreach ($arrayRecursos as $key => $value) {
                if(!in_array($value['idrol'],$roleList)){
                    $roleList[] = $value['idrol'];
                }
            }
        }

        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaSegRolDatFuncionalidadDatAccion')
            ->where(
                'idrecurso = ? ',
                array($idrecurso)
            )
            ->whereIn('idaccion', $array)
            ->execute();

        /*actualizo la acl*/
        if(count($roleList) > 0){
            $securityConfig = new Zend_Config_Ini(
                Zend_Registry::get('config')->security_config, 'trace'
            );
            if ($securityConfig->background) {
                $taskRunner = new Amqp_Task_Mgr();
                $taskRunner->runTask('updateAcl', array($roleList, array()));
            } else {

                $sessionAclUpdateObj = new ZendExt_Session_Acl_Update();
                $sessionAclUpdateObj->init($roleList, array());
            }
        }

    }

    static function obtenerRecursosAutorizados($idfuncionalidad, $idrol){
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso, r.denominacion, r.abreviatura')
                ->from('DatRecurso r ')
                ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion srfa ON (srfa.idrecurso = r.idrecurso)')
                ->where('srfa.idrol = ? and srfa.idfuncionalidad = ?', array($idrol, $idfuncionalidad))
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    static function obtenerTodosRecursosAutorizados($idfuncionalidad, $arrayIdrol){
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso, r.denominacion, r.abreviatura')
            ->from('DatRecurso r ')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion srfa ON (srfa.idrecurso = r.idrecurso)')
            ->where('srfa.idfuncionalidad = ?', array($idfuncionalidad))
            ->whereIn('srfa.idrol', $arrayIdrol)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }
}