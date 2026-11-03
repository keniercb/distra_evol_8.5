<?php

/**
 * Clase especializada en el trabajo con los servicios que se
 * utilizan de planificacion
 *
 *
 */
class ServiciosPlanificacionHelper implements ISingletonClass
{

    /**
     * Una instancia unica de ServiciosPlanificacionHelper
     *
     * @var ServiciosPlanificacionHelper
     */
    private static $instance = null;

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
     * Creates a new instance of class ServiciosPlanificacionHelper
     *
     * @return ServiciosPlanificacionHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosPlanificacionHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los servicios dado un arreglo
     * se accede desde planificacion
     *
     * @param idservicio arreglo de ids
     *
     * @return array
     */
    public function obtenerServiciosDadoArrayIds($idservicio)
    {

        try {
            return $this->integrator->planificacion->obtenerServiciosDadoArrayIds($idservicio);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las actividades de un nivel, y normadas si es necesario
     * se accede desde planificacion
     *
     * @param $nivel (un numeric que puede ser 3(padre) o 4(hijas))
     *               $idactividad (esto puede ser o un array de idactividad o un numero simple)
     *               $filtro(denominacion,codigo)
     *               ejemplo como poner el filtro (array['denominacion'=>'maricet', 'codigo'=>'11222'])
     *               $start,$limit
     *               $hijo(1 si quieres lo hijos de una actividad especifica y cero por defecto)
     *
     * @return array
     */
    public function obtenerActividadyNorma($nivel, $idactividad, $filtro, $start, $limit, $hijo)
    {

        try {
            return $this->integrator->planificacion->obtenerActividadyNorma(
                $nivel, $idactividad, $filtro, $start, $limit, $hijo
            );

        } catch (Exception $e) {
            $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los indicadores dado un id de servicio
     * se accede desde planificacion
     *
     * @param idservicio arreglo de ids
     *
     * @return array
     */
    public function obtenerIndicadoresDadoIdServicio($idservicio)
    {

        try {
            return $this->integrator->planificacion->obtenerIndicadoresDadoIdServicio($idservicio);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todos los servicios
     * se accede desde planificacion
     *
     * @param $bandera ,$limit,$start,$denominacion
     *
     * @return array
     */
    public function obtenerServicios($bandera, $limit, $start, $denominacion)
    {

        try {
            return $this->integrator->planificacion->obtenerServicios($bandera, $limit, $start, $denominacion);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las actividades que se encuentran normadas
     * se accede desde planificacion
     *
     * @param $parametros (que contiene el start y limit)
     *
     * @return array
     */
    public function listarActividadesNormadas($parametros)
    {

        try {
            return $this->integrator->planificacion->listarActividadesNormadas($parametros);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las actividades que se encuentran normadas
     * dado un arreglo de ids
     * se accede desde planificacion
     *
     * @param $idsactiv (arreglo de ids de actividades)
     *
     * @return array
     */
    public function obtenerActivNormadasByIdsActiv($idsactiv)
    {

        try {
            return $this->integrator->planificacion->obtenerActividadesNormadasByArrayIdActividad($idsactiv);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el js de contratacion
     * se accede desde contratacion
     *
     * @return js de contrato
     */
    public function getJsGridContrato()
    {

        try {
            return $this->integrator->contratacion->getJsGridContrato();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos del contrato segun su id
     * se accede desde contratacion
     *
     * @param idcontrato
     *
     * @return array
     */
    public function obtenerContratosXIdcontrato($idcontrato)
    {

        try {
            return $this->integrator->contratacion->obtenerContratosXIdcontrato($idcontrato);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos del contrato
     * se accede desde contratacion
     *
     * @param parametrosContrato stdClass que tiene el id de contrato
     *
     * @return array
     */
    public function obtenerDatosContrato($parametrosContrato)
    {

        try {
            return $this->integrator->contratacion->obtenerDatosContrato($parametrosContrato);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de los clientes segun sus ids
     * se accede desde contratacion
     *
     * @param idscliente arreglo de ids
     *
     * @return array
     */
    public function obtenerDatosClientes($idscliente)
    {

        try {
            return $this->integrator->contratacion->obtenerDatosClientes($idscliente);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el listado de cliente y proveedores
     * se accede desde contratacion
     *
     * @param
     *
     * @return array
     */
    public function listarClientesProveedores()
    {

        try {
            return $this->integrator->contratacion->ListarClientesProveedores(1); //Buscar que significa el 1
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los contratos de un cliente
     * se accede desde contratacion
     *
     * @param idcliente
     *
     * @return array
     */
    public function obtenerContratosXIdcliente($idcliente)
    {

        try {
            return $this->integrator->contratacion->obtenerContratosXIdcliente($idcliente);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el js del componente cliente
     * se accede desde contratacion
     *
     * @return js
     */
    public function getJsCmpClientes()
    {

        try {
            return $this->integrator->contratacion->getJsCmpClientes();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la direccion de entrega del contrato especificado
     * se accede desde contratacion
     *
     * @param idcontrato
     *
     * @return string
     */
    public function obtenerDirEntregaXidContrato($idcontrato)
    {

        try {
            return $this->integrator->contratacion->obtenerDirEntregaXidContrato($idcontrato);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los productos de una actividad segun un  contrato
     * se accede desde contratacion
     *
     * @param $idcontrato , $arrayProductos(arreglo de ids de producots)
     *
     * @return array
     */
    public function obtenerProductosActContrato($idcontrato, $arrayProductos)
    {

        try {
            return $this->integrator->contratacion->obtenerProductosActContrato($idcontrato, $arrayProductos);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todos los contratos
     * se accede desde contratacion
     *
     * @return array
     */
    public function obtenerNomencladorContrato()
    {

        try {
            return $this->integrator->contratacion->obtenerNomencladorContrato();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de los servicios de un contrato
     * se accede desde contratacion
     *
     * @param (arreglo que contiene start, limit, idcontrato)
     *
     * @return array
     */
    public function obtenerDatosServiciosContratados($params)
    {

        try {
            return $this->integrator->contratacion->ObtenerDatosServiciosContratados($params);
        } catch (Exception $e) {

        }
    }

    /**
     *
     * @param type $params
     *
     * @return type
     */
    public function obtenerPlanesDadoEntidad($idestructura)
    {
        try {
            return $this->integrator->planificacion->obtenerPlanesDadoEntidad($idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     *
     * @param type $params
     *
     * @return type
     */
    public function obtenerCentrosDeBalance($idestructura, $idEspecialidad = null) {
        try {
            return $this->integrator->planificacion->obtenerCentrosDeBalance($idestructura, $idespecilidad);
        }
        catch (Exception $e) {
            return array();
        }
    }

    /**
     *
     * @param type $params
     *
     * @return type
     */
    public function obtenerModelos($idestructura = array())
    {
        try {
            $arrayFiltro=array();
           // print_r( $this->integrator->planificacion->obtenerPlanesDadoEntidad($idestructura, 0, 0, 0));die;
           // $idestructura = !is_array($idestructura) ? array($idestructura) : $idestructura;
            return $this->integrator->planificacion->obtenerPlanesDadoEntidad($idestructura, $arrayFiltro);
           // return $this->integrator->planificacion->obtenerPlanesDadoEntidad($idestructura, 0, 0, 0);
        } catch (Exception $e) {
            return array();
        }
    }

    /**
     *
     * @param type $params
     *
     * @return type
     */
    public function obtenerActivosxCarta($params = array())
    {
        try {
            return $this->integrator->planificacion->obtenerActivosxCarta($params);
        } catch (Exception $e) {
            return array();
        }
    }
    /**
     *
     * @param type $alias
     * @param type $query
     *
     * @return type
     */
    public function obtenerIndicadorSalidaxCarta($alias,$query)
    {
        try {
            return $this->integrator->planificacion->obtenerIndicadorSalidaxCarta($alias,$query);
        } catch (Exception $e) {
            return array();
        }
    }
    /**
    *
    * @param type $idestructura
    *
    * @return type
    */
    public function Productos711DadoEntidad(
        $idestructura,$arrayIdsolicitud711,$anno = null,$denominacion = null,$numeropieza = null,$codigo = null,
        $denominacionunidadmedida = null,$abreviaturaunidadmedida = null,$nosolicitud = null,$idumedida = null
    )
    {
        try {
            return $this->integrator->plan711->Productos711DadoEntidad(
                $idestructura,$arrayIdsolicitud711,$anno,$denominacion,$numeropieza,$codigo,
                $denominacionunidadmedida,$abreviaturaunidadmedida,$nosolicitud,$idumedida
            );
        } catch (Exception $e) {
            print_r($e->getMessage());die;
        }
    }

    public function Solicitudes711DadoEntidad($idestructura, $anno = null, $descripcion = null, $nosolicitud = null, $start = 0, $limit = 30)
    {
        try {
            return $this->integrator->plan711->Solicitudes711DadoEntidad($idestructura, $anno, $descripcion, $nosolicitud, $start, $limit);
        } catch (Exception $e) {
            print_r($e->getMessage());die;
        }
    }

    public function ActualizarSolicitudes711($idsolicitud, $idindicadores)
    {
        try {
            return $this->integrator->plan711->ActualizarSolicitudes711($idsolicitud, $idindicadores);
        } catch (Exception $e) {
            print_r($e->getMessage());die;
        }
    }
}

