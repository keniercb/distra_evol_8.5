<?php

/**
 * Clase que maneja las variable globales
 *
 * @package    Logistica
 * @subpackage Utiles
 * @version    1.0
 * @author     Kenier Cumba Bueno
 */
class LogisticaGlobal implements ISingletonClass
{

    /**
     * Identifiacdor del subsistema inventario
     */
    const SUBSISTEMA_INV = 10,
        /**
         * Identifiacdor del subsistema facturacion
         */
        SUBSISTEMA_FAC = 13,
        /**
         * Identifiacdor del subsistema contenedores
         */
        SUBSISTEMA_CONTEN = 18,
        /**
         * Identifiacdor del subsistema activos fijos
         */
        SUBSISTEMA_AFT = 11,
        /**
         *
         */
        SUBSISTEMA_UH = 11,
        /**
         *
         */
        SUBSISTEMA_CONT = 4,
        /**
         * Identifiacdor del subsistema CRM
         */
        SUBSISTEMA_CRM = 300,
        /**
         * Identifiacdor del subsistema Transportacion
         */
        SUBSISTEMA_TRANSP = 100,
        /**
         * Identifiacdor del subsistema Produccion
         */
        SUBSISTEMA_PRODUCCION = 114,
        /**
         * Identifiacdor del subsistema patrimonio
         */
        SUBSISTEMA_PATRIMONIO = 22,
        /**
         * Identificador del subsistema datos maestros
         */
        SUBSISTEMA_MAESTRO = -1,
        /**
         * Identifiacdor del subsistema distribucion
         */
        SUBSISTEMA_DIST = 10,
        SUBSISTEMA_TALLERES = 113,
        SUBSISTEMA_RESERVA = 115,
        SUBSISTEMA_PLAN = 30,
        SUBSISTEMA_COMPRA = 15,
        SUBSISTEMA_CALIDADCOMBUSTIBLE = 17,
        SUBSISTEMA_COBROS = 6,
        SUBSISTEMA_FARMACIA = 121,
        /**
         * Direccion del codigo de logistica
         */
        DIR_LOGISTICA = 'logistica',
        /**
         * Direccion de planificacin
         */
        DIR_PLANIFICACION = 'planificacion',
        DIR_LOGISTICA_FAC = 'logistica/facturacion',
        DIR_LOGISTICA_AFT = 'logistica/activos_fijos',
        DIR_LOGISTICA_INV = 'logistica/inventario',
        DIR_LOGISTICA_RESR = 'logistica/reserva',
        /**
         *
         */
        TIPO_CLIENTE_CENTRO = 2,
        /**
         *
         */
        TIPO_CLIENTE_CLIENTE = 1,
        /**
         *
         */
        TIPO_CLIENTE_DEPOSITO = 3,
        /**
         *
         */
        TIPO_AREA_RESPONSABILIDAD = 4,
        /**
         *
         */
        MES_ENERO = 1,
        /**
         *
         */
        MES_FEBRERO = 2,
        /**
         *
         */
        MES_MARZO = 3,
        /**
         *
         */
        MES_ABRIL = 4,
        /**
         *
         */
        MES_MAYO = 5,
        /**
         *
         */
        MES_JUNIO = 6,
        /**
         *
         */
        MES_JULIO = 7,
        /**
         *
         */
        MES_AGOSTO = 8,
        /**
         *
         */
        MES_SEPTIEMBRE = 9,
        /**
         *
         */
        MES_OCTUBRE = 10,
        /**
         *
         */
        MES_NOVIEMBRE = 11,
        /**
         *
         */
        MES_DICIEMBRE = 12,
        /**
         *
         */    
        FACTOR_REDONDEO = 2,
        /**
         *
         */
        SIN_MES = -1;

    /**
     * Instancia para garantizar el acceso singleton a la clase
     *
     * @var LogisticaGlobal
     */
    private static $instance = null;
    /**
     * @var null
     */
    private $config;
    private $dirFile;
    /**
     * @var ReportServerTemplateContainer
     */
    private $rsContainer;
    /**
     * @var EnzonaTemplateContainer
     */
    private $eznContainer;

    /**
     * Constructor de la clase
     */
    private function __construct()
    {
        $this->dirFile = Zend_Registry::getInstance()->get('config')->dir_aplication . ''
            . DIRECTORY_SEPARATOR . 'logistica/utiles/comun/recursos/';
        $file = $this->dirFile.'log_config';
        $this->config = InitConfigLoader::__init()->load($file);
        $this->rsContainer = null;
        $this->eznContainer = null;
    }

    public function getConfig($key){
        return $this->config->$key;
    }

    /**
     * @return string
     */
    public function getDirFile()
    {
        return $this->dirFile;
    }



    /**
     * Metodo que devuelve la
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaGlobal;
        }
        return self::$instance;
    }

    public static  function __reset(){
        self::$instance = null;
    }

    public function getMesAnterior($mes = LogisticaGlobal::SIN_MES)
    {
        switch ($mes) {
            case LogisticaGlobal::MES_ENERO:
                return LogisticaGlobal::SIN_MES;
            case LogisticaGlobal::MES_FEBRERO:
                return LogisticaGlobal::MES_ENERO;
            case LogisticaGlobal::MES_MARZO:
                return LogisticaGlobal::MES_FEBRERO;
            case LogisticaGlobal::MES_ABRIL:
                return LogisticaGlobal::MES_MARZO;
            case LogisticaGlobal::MES_MAYO:
                return LogisticaGlobal::MES_ABRIL;
            case LogisticaGlobal::MES_JUNIO:
                return LogisticaGlobal::MES_MAYO;
            case LogisticaGlobal::MES_JULIO:
                return LogisticaGlobal::MES_JUNIO;
            case LogisticaGlobal::MES_AGOSTO:
                return LogisticaGlobal::MES_JULIO;
            case LogisticaGlobal::MES_SEPTIEMBRE:
                return LogisticaGlobal::MES_AGOSTO;
            case LogisticaGlobal::MES_OCTUBRE:
                return LogisticaGlobal::MES_SEPTIEMBRE;
            case LogisticaGlobal::MES_NOVIEMBRE:
                return LogisticaGlobal::MES_OCTUBRE;
            case LogisticaGlobal::MES_DICIEMBRE:
                return LogisticaGlobal::MES_NOVIEMBRE;
            default:
                return LogisticaGlobal::SIN_MES;
        }
    }

    public function getMesSiguiente($mes = LogisticaGlobal::SIN_MES)
    {
        switch ($mes) {
            case LogisticaGlobal::MES_ENERO:
                return LogisticaGlobal::MES_FEBRERO;
            case LogisticaGlobal::MES_FEBRERO:
                return LogisticaGlobal::MES_MARZO;
            case LogisticaGlobal::MES_MARZO:
                return LogisticaGlobal::MES_ABRIL;
            case LogisticaGlobal::MES_ABRIL:
                return LogisticaGlobal::MES_MAYO;
            case LogisticaGlobal::MES_MAYO:
                return LogisticaGlobal::MES_JUNIO;
            case LogisticaGlobal::MES_JUNIO:
                return LogisticaGlobal::MES_JULIO;
            case LogisticaGlobal::MES_JULIO:
                return LogisticaGlobal::MES_AGOSTO;
            case LogisticaGlobal::MES_AGOSTO:
                return LogisticaGlobal::MES_SEPTIEMBRE;
            case LogisticaGlobal::MES_SEPTIEMBRE:
                return LogisticaGlobal::MES_OCTUBRE;
            case LogisticaGlobal::MES_OCTUBRE:
                return LogisticaGlobal::MES_NOVIEMBRE;
            case LogisticaGlobal::MES_NOVIEMBRE:
                return LogisticaGlobal::MES_DICIEMBRE;
            case LogisticaGlobal::MES_DICIEMBRE:
                return LogisticaGlobal::SIN_MES;
            default:
                return LogisticaGlobal::SIN_MES;
        }
    }

    public function getMesActual()
    {
        $mes = date('n');
        return $mes;
    }

    public function test($param)
    {
        $mes = LogisticaGlobal::MES_ENERO;
        while ($mes != LogisticaGlobal::SIN_MES) {
            /**
             * Pongo mi codigo aqui con el mes
             */
            $mes = LogisticaGlobal::__init()->getMesSiguiente($mes);
        }
    }

    public function getHelperInstance($name)
    {
        switch ($name) {
            /**
             * Helpers de integracion con sistemas externos
             */
            case 'configuracionHelper':
                return ServiciosConfiguracionGeneralHelper::__init();
            case 'seguridadHelper':
                return ServiciosSeguridadHelper::__init();
            case 'rrhhHelper':
                return ServiciosRecursosHumanosHelper::__init();
            case 'contabilidadHelper':
                return ServiciosContabilidadFinanzasHelper::__init();
            case 'estructuraHelper':
                return ServiciosEstructuraComposicionHelper::__init();
            case 'ayudaHelper':
                return ServiciosAyudaHelper::__init();
            case 'planificacionHelper':
                return ServiciosPlanificacionHelper::__init();
            /**
             * Helpers de integracion con sistemas externos
             */
            case 'doctrineHelper':
                return LogisticaDoctrineHelper::__init();
            case 'objectHelper':
                return LogisticaObjectHelper::__init();
            case 'documentosHelper':
                return LogisticaDocumentosHelper::__init();
            case 'imagenHelper':
                return LogisticaImagenHelper::__init();
            case 'pkiHelper':
                return ServiciosPKIHelper::__init();
            case 'crmHelper':
                return ServiciosCrmHelper::__init();
            case 'facturacionHelper':
                return ServiciosFacturacionHelper::__init();
            case 'tpvApiHelper':
                return TpvApiService::__init();
            default:
                return null;
        }
    }

    /**
     * @return ReportServerTemplateContainer
     */
    public function getRSContainer(){
        if(is_null($this->rsContainer)){
            JSONComponent::__init()->initComponent('log.lb.rs', true, false);
            JSONComponent::__init()->loadPath();
            $this->rsContainer = new ReportServerTemplateContainer();
        }
        return $this->rsContainer;
    }

    /**
     * @return EnzonaTemplateContainer
     */
    public function getEznContainer()
    {
        if(is_null($this->rsContainer)){
            JSONComponent::__init()->initComponent('log.lb.ezn', true, false);
            JSONComponent::__init()->loadPath();
            $this->eznContainer = new EnzonaTemplateContainer();
        }
        return $this->eznContainer;
    }


    public function __get($name)
    {
        if (stripos($name, 'Helper') == -1) {
            if (isset($this->$name)) {
                return $this->$name;
            }
        } else {
            return LogisticaGlobal::__init()->getHelperInstance($name);
        }
    }

    public function estaAperturadoSubsistema($idSubsistema)
    {
        $apps = Zend_Registry::getInstance()->get('config')->dir_aplication . '' . DIRECTORY_SEPARATOR;

        $identidad = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;

        $sql = "select (count(*) <> 0) as existe from mod_datosmaestros.dat_estructurasubsist es "
            . "where es.idsubsistema = {$idSubsistema} and idestructuracomun = {$identidad} and es.idestado <> 0";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return $datos[0]['existe'] && (is_dir($apps . '' . $this->getDirSubsistema($idSubsistema)));
    }

    /*     * *
     * Funcion que rellena una cadena con caracteres hasta completar con una
     */

    public function rellenarCadena($cadena, $longitud, $caracter = '0', $direccion = 1)
    {
        if (strlen($cadena) >= $longitud) {
            return $cadena;
        }
        $numChar = $longitud - strlen($cadena);
        $concat = '';
        for ($i = 0; $i < $numChar; $i++) {
            $concat .= $caracter;
        }
        return $direccion == 1 ? ($cadena . '' . $concat) : ($concat . '' . $cadena);
    }

    /**
     *
     * @param type $idSubsistema
     *
     * @return type
     */
    public function getDirSubsistema($idSubsistema)
    {
        switch ($idSubsistema) {
            case LogisticaGlobal::SUBSISTEMA_AFT:
                return LogisticaGlobal::DIR_LOGISTICA_AFT;
            case LogisticaGlobal::SUBSISTEMA_INV:
                return LogisticaGlobal::DIR_LOGISTICA_INV;
            case LogisticaGlobal::SUBSISTEMA_FAC:
                return LogisticaGlobal::DIR_LOGISTICA_FAC;
            case LogisticaGlobal::SUBSISTEMA_PLAN:
                return LogisticaGlobal::DIR_PLANIFICACION;
            default:
                return LogisticaGlobal::DIR_LOGISTICA;
        }
    }

    public function getMonedaEntidad()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $monedas = $this->configuracionHelper->monedaContableEntidad($global->Estructura->idestructura);
        $array = array(
            'idmoneda' => null
        );
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $array['idmonedaalternativa'] = $value['idmoneda'];
                $array['codigoisoalt'] = $value['codigoiso'];
            } else {
                $array['idmoneda'] = $value['idmoneda'];
                $array['codigoiso'] = $value['codigoiso'];
            }
        }
        $stdClassMoneda = new stdClass();
        LogisticaObjectHelper::__init()->synchronize($stdClassMoneda, $array);
        return $stdClassMoneda;
    }

    public function getJSAtributosDinamicos()
    {
        return array("<script type=\"text/javascript\" "
            . "src=\"/configuracion/nomdinamicos/views/js/atributosdinamicos/gridAtribDinamicos.component.js\"></script>",
            "<script type=\"text/javascript\" "
            . "src=\"/configuracion/nomdinamicos/views/js/atributosdinamicos/gridAtribDinamicos.component.js\"></script>");

    }

    function __set($name, $value)
    {
        if (stripos($name, 'Helper') == -1) {
            if (isset($this->$name)) {
                $this->$name = $value;
            }
        }
    }

    /**
     * @deprecated Sera eliminado en la proxima actualizacion
     * @param $n
     * @return int|mixed
     */
    function redondearMultiploCinco($n){
        return LogisticaObjectHelper::__init()->_roundToFive($n);
    }
}
