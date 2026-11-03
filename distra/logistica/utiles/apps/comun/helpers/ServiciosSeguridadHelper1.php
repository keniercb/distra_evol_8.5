<?php

/**
 * Clase especializada en el trabajo con los servicios
 *  que se utilizan de seguridad
 *
 *
 */
class ServiciosSeguridadHelper implements ISingletonClass
{

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Una instancia unica de ServiciosSeguridadHelper
     *
     * @var ServiciosSeguridadHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class ServiciosSeguridadHelper
     *
     * @return ServiciosSeguridadHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosSeguridadHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los datos de los usuarios
     *
     * @param array
     *
     * @return array
     */
    public function getUsersProfile($arridusuario)
    {

        try {
            return $this->integrator->seguridad->getUsersProfile($arridusuario, $this->varglobal->Perfil->certificado);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los datos de las estructuras no formales
     *
     * @param certificado de seguridad, numeroConcepto existente en estrucutra
     *
     * @return array
     */
    public function obtenerEstructurasNoFormales($certificado, $numeroConcepto=8)
    {
        try {
            return $this->integrator->seguridad->ObtenerEstructurasNoFormales($certificado, $numeroConcepto);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    /**
     * Metodo que devuelve los datos de las estructuras formales
     *
     * @param ver que parametro recibe
     *
     * @return array
     */
    public function obtenerEstructurasFormales($certificado)
    {
        try {
            return $this->integrator->seguridad->ObtenerEstructurasFormales($certificado);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Obtener todos los usuarios de seguridad que tengan asociado persona
     *
     * @param start , limit
     *
     * @return array
     */
    public function obtenerTodosUsuarios($limit, $start)
    {

        try {
            return $this->integrator->seguridad->obtenertodoslosusuarios($limit, $start);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    
      /**
     * Obtener todos los usuarios de seguridad
     * @return array
     */
    public function obtenerAllUsuarios($limit, $start)
    {

        try {
            return $this->integrator->seguridad->obtenerTodosUsuarios($limit, $start);
        } catch (Exception $e) {
          return   $e->getMessage();
        }
    }
      /**
     * Obtener todos los usuarios de seguridad de un dominio
     * @return array
     */
    public function listadoUsuariosCompartimentados()
    {

        try {
            return $this->integrator->seguridad->listadoUsuariosCompartimentados(
                $this->varglobal->Perfil->iddominio,$this->varglobal->Perfil->idusuario);
        } catch (Exception $e) {
          return   $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve el nombre del usuario segun su id
     *
     * @param numeric
     *
     * @return string
     */
    public function getNombreUsuario($idusuario)
    {

        try {
            return $this->integrator->seguridad->nombreUsuario($idusuario);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getUsersNameById($arrayId)
    {
        try {
            return $this->integrator->seguridad->getUsersNameById($arrayId);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function loadUserRolByEntidad($certificado, $idestructuracomun)
    {
        try {
            return $this->integrator->seguridad->LoadUserRolByEntidad($certificado, $idestructuracomun);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /*
     * Metodo para obtener la cantidad de usarios total
     * @return entero
     */
    public function cantObtenerTodosLosUsuarios()
    {
        try {
            return $this->integrator->seguridad->cantobtenertodoslosusuarios();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /*
     * Metodo para obtener los nombre de los usuarios
     * @param idsusuarios(arreglo de identificadores d eusarios)
     * @return array
     */
    public function obtenerNombresUsuarios($idsusarios)
    {
        try {
            return $this->integrator->seguridad->obtenerNombresUsuarios($idsusarios);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    /**
     * 
     * @param type $referencia
     * @return type
     */
    public function getMenuFuncionalidad($referencia)
    {
        try {
            return $this->integrator->seguridad->getMenuFuncionalidad($referencia);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getEntidadesByRolUsuario(){
        $global = ZendExt_GlobalConcept::getInstance();
        $idrol = $global->Perfil->idrol;
        $idusuario = $global->Perfil->idusuario;
        $sql = "select e.identidad, e.identidad as idestructura, e.idrol,e.idusuario " .
            "from mod_seguridad.dat_entidadusuariorol e where e.idusuario = {$idusuario} and e.idrol = {$idrol}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $datos = $this->integrator->metadatos->obtenerListadoEntidadesUsuarioRol($datos);
        $entidades = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($datos[0]['acceso'], 'idfila');
        $entidades =  LogisticaObjectHelper::__init()->extractValueFromArrayColumn(
            $this->integrator->metadatos->ObtenerDatosEstructuraPorArrayID($entidades),'0');
        foreach ($entidades as $pos=>$entidad){
            if($entidad->idtipo != 3){
                unset($entidades[$pos]);
            }
        }
        return array_values($entidades);
    }


}
