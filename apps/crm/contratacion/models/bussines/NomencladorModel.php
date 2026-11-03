<?php

/**
 *
 *
 * @author         Ing. Rodain Terrer Molina
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class NomencladorModel extends ZendExt_Model
{
    public $_estructura;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_estructura = new EstructuraComunicationInterface();
    }

    public function getAreas($params)
    {
        $area = new DatArea();
//        $idestructura = $this->global->Estructura->idestructura;
        $idpadre = $params['node'] ? $params['node'] : 0;
        //print_r($this->_estructura->getEstructura($idpadre));die;
        return $this->_estructura->getEstructura($idpadre);
    }

    public function obtenerPaises()
    {
        $arrayPaises = $this->integrator->datosmaestros->obtenerPaises();
        echo json_encode(
            array('datos'    => $arrayPaises, 'idProperty' => 'idpais',
                  'metaData' => array('idProperty' => 'idpais'))
        );
    }

    public function insertarAreas($params)
    {
        try {
            $ids = json_decode($params['nombre']);
            $areas = new Doctrine_Collection('DatArea');
            foreach ($ids as $id) {
                $area = new DatArea();
                $area->idestructura = $id;
                $areas->add($area);
            }
            $areas->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function insertarPersonaParametros($params)
    {
        try {
            $ids = json_decode($params['nombre']);
            $persona = new Doctrine_Collection('DatPersonaParametro');
            foreach ($ids as $id) {
                $existe=Doctrine::getTable('DatPersonaParametro')->findByDql('idpersona=?', array($id));
                if(count($existe)==0) {
                    $area = new DatPersonaParametro();
                    $area->idpersona = $id;
                    $persona->add($area);
                }
            }
            $persona->save();
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function guardarHerencia($params){
        try {
            if($this->global->Perfil->idestructuracomun!=$params['idestructura']) {
                $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
                $transiciones = $conexionActual->fetchAll(
                    "SELECT * FROM mod_crmcontratacion.nom_transicion WHERE 
                               idestructura=" . $params['idestructura'] . ' AND 
                               idproceso IN (' . $params['idprocesos'] . ')');
                if(count($transiciones)>0) {
                    foreach ($transiciones as $tra) {
                        $nuevaTra = new NomTransicion();
                        $nuevaTra->idestructura = $this->global->Perfil->idestructuracomun;
                        $nuevaTra->idestadoinicial = $tra['idestadoinicial'];
                        $nuevaTra->idestadofinal = $tra['idestadofinal'];
                        $nuevaTra->fechafin = $tra['fechafin'];
                        $nuevaTra->descripcion = $tra['descripcion'];
                        $nuevaTra->idproceso = $tra['idproceso'];
                        $nuevaTra->fechainicio = date('d-m-Y');
                        $nuevaTra->save();
                        $roltransiciones = Doctrine::getTable('DatRolTransicion')
                            ->findBy('idtransicion', $tra['idtransicion']);
                        foreach ($roltransiciones as $roltra) {
                            $nuevaRolTra = new DatRolTransicion();
                            $nuevaRolTra->idtransicion = $nuevaTra->idtransicion;
                            $nuevaRolTra->idrol = $roltra['idrol'];
                            $nuevaRolTra->save();
                        }
                    }
                    return array('success' => true, 'code'=>1);
                }else{
                    return array('success' => true, 'code'=>2);
                }
            }else{
                return array('success' => true, 'code'=>3);
            }
        }catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }

    }

    public function getEstructuras($params){
        $estructursCI=new EstructuraComunicationInterface();
        $result=$estructursCI->getEstructura($params['node']);
        return $result;
    }

    public function cargarCorreos($params){
        try{
            $respuesta=array();
            if($params['idtransicion'])
                $respuesta=NomTransicion::obtenerDatosSiguientesRolesObligatorios(array('idtransicion'=>$params['idtransicion']));
            if($params['idproceso'])
                $respuesta=NomTransicion::obtenerDatosInicialRolesObligatorios(array('idproceso'=>$params['idproceso']));
//            $respuesta=array_unique($respuesta);

//            $respuesta = $conexionActual->fetchAll("
//                SELECT u.nombreusuario, u.email FORM mod_seguridad.seg_usuario u
//                WHERE u.email IS NOT NULL AND
//            ");
            return array('success' => true, 'data' => $respuesta);
        }catch (Exception $e){
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

//    public function cargarCorreos($params){
////        $datosrolesobligatorios=NomTransicion::obtenerRolesObligatorios($params);
//        try {
//            $respuesta = array();
//            if ($params['roles']) {
//                $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
//                $respuesta = $conexionActual->fetchAll(
//                    "SELECT u.nombreusuario, c.contacto as correo, eur.idrol, r.denominacion as rol,
//                                p.nombre||' '||p.papel||' '||p.sapel  as persona
//                            FROM mod_seguridad.dat_entidadusuariorol eur
//                            LEFT JOIN mod_seguridad.seg_rol r ON eur.idrol=r.idrol
//                            LEFT JOIN mod_seguridad.seg_usuario u ON (u.idusuario=eur.idusuario)
//                            LEFT JOIN mod_persona.dat_persona p ON (p.idpersona=u.idpersona)
//                            LEFT JOIN mod_persona.dat_contacto c ON (c.idpersona=p.idpersona)
//                            WHERE eur.idrol IN (" . implode(',', json_decode($params['roles'])) . ")
//                            AND c.oficial=1 AND c.idtipomediocontacto=2 ORDER BY rol"
//                );
//            }
////        $respuesta=array_merge($respuesta, $contactos);
//            return array('success' => true, 'data' => $respuesta);
//        }catch (Exception $e){
//            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
//                'success' => false);
//        }
//    }
}
