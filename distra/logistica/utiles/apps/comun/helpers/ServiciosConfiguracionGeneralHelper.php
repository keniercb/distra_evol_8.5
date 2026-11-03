<?php

/**
 * Clase especializada en el trabajo con los servicios que se utilizan de
 * configuracion general
 *
 *
 */
class ServiciosConfiguracionGeneralHelper implements ISingletonClass
{

    /**
     * Una instancia unica de ServiciosConfiguracionGeneralHelper
     *
     * @var ServiciosConfiguracionGeneralHelper
     */
    private static $instance = null;
    private $iniConfig = null;

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;
    private $facade = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
        $this->proxyFacade();
    }

    /**
     * Creates a new instance of class ServiciosConfiguracionGeneralHelper
     *
     * @return ServiciosConfiguracionGeneralHelper
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ServiciosConfiguracionGeneralHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve los nomencladores generales
     *
     * se accede a traves de configuracion
     *
     * @return js
     */
    public function mostrarNomencladoresGenerales()
    {

        try {
            return $this->facade->mostrarNomencladoresGenerales();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para convertir de una moneda a otra, segun un tipo de tasa.
     * @param $idmonedaorigen , $idmonedadestino, $importeorigen, $idtipotasa, $compraventa(0 no tiene en cuenta en
     * la formula ni la compra ni la venta de la conversion, 1 se utiliza la
     * venta y 2 la compra)
     * @return double
     */
    public function convertirImporte($idmonedaorigen, $idmonedadestino, $idtipotasa, $importeorigen, $compraventa)
    {

        try {
            return $this->facade->convertirImporte($idmonedaorigen, $idmonedadestino, $idtipotasa, $importeorigen,
                $compraventa);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo para obtner los tipos de tasas
     * @param $filtro , $star, $limit
     *
     * @return array
     */
    public function getTipoTasas($filtro = array(), $star = null, $limit = null)
    {

        try {
            return $this->facade->getTipoTasas($filtro, $star, $limit);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * M
     *
     * se accede a traves de parametros
     * @params $idSubsistema, $nomObjeto
     *
     * @return array
     */
    public function obtenerObjetoPorSubsistTipo($idSubsistema, $nomObjeto)
    {

        try {
            return $this->facade->obtenerObjetoPorSubsistTipo($idSubsistema, $nomObjeto);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuele todos los ejercicios de una entidad
     *
     * se accede a traves de parametros
     * @params $identidad
     *
     * @return array
     */
    public function obtenerEjercicios($identidad)
    {

        try {
            return $this->facade->obtenerEjercicios($identidad);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuele todas las tasas de una moneda
     *
     *
     * @params $idmonedaentidad
     *
     * @return array
     */
    public function obtenerAllTasasByMoneda($idmonedaentidad)
    {

        try {
            return $this->facade->obtenerAllTasasByMoneda($idmonedaentidad);
        } catch (Exception $e) {

        }
    }

    /**
     * metodo que devuelve un objeto de la clase ComunImagenModel
     *
     * @return \ComunImagesModel
     */
    public function obtenerObjClassComunImangenModel()
    {
        $objClas = new ComunImagesModel();
        return $objClas;
    }

    /**
     * metodo para obtener los js de Naturaleza
     *
     * se accede a traves de parametros
     * @params $idSubsistema, $nomObjeto
     *
     * @return array
     */
    public function ObtenerJSArbolNaturaleza()
    {

        try {
            return $this->facade->obtenerJSArbolNaturaleza();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para unirse con indicador como root
     *
     * se accede a traves de parametros
     * @params $query, $aliasRama,$aliasHoja,$tipoJoin
     *
     * @return Doctrine_query
     */
    public function dameQueryRootIndicador($query, $aliasRama, $aliasHoja, $tipoJoin)
    {

        try {
            return $this->facade->dameQueryRootIndicador($query, $aliasRama, $aliasHoja, $tipoJoin);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que obtiene las denominaciones de las naturalezas
     *
     * se accede a traves de parametros
     * @params $query
     *
     * @return array
     */
    public function getNaturalezas($query)
    {

        try {
            return $this->facade->getNaturalezas($query);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de la unidad de medida segun su id
     *
     * se accede a traves de configuracion
     *
     * @param $idumedida
     *
     * @return array
     */
    public function obtenerUnidadMedidaDadoId($idumedida)
    {

        try {
            return $this->facade->obtenerUnidadMedidaDadoId($idumedida);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la cantidad de datos que existen en DatConeversionum
     *
     * se accede a traves de parametro
     *
     * @return numeric
     */
    public function existeConversionenDatConversion()
    {

        try {
            return $this->facade->existeConversion();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el factor de conversion base dado un idumedida
     *
     * se accede a traves de parametro
     *
     * @return numeric
     */
    public function obtenerFactorBaseDadoidUmedida($idumedida)
    {

        try {
            return $this->facade->obtenerFactorBaseDadoidUmedida($idumedida);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la unidad de medida de un indicador
     *
     * se accede a traves de parametros
     *
     * @param $idindicador
     *
     * @return array
     */
    public function getUMedidaIndicador($idindicador)
    {

        try {
            return $this->facade->getUMedidaIndicador($idindicador);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve un objeto DatConversionum
     *
     * se accede a traves de parametros
     *
     * @param
     *
     * @return stdClass
     */
    public function obtenerObjetoDatConversionum()
    {

        try {
            return $this->facade->obtenerObjetoDatConversionum();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite salvar datos en la tabla DatConversionum
     *
     * se accede a traves de parametros
     *
     * @param $datos (arreglo de datos para salvar)
     *
     * @return boolean
     */
    public function salvarDatosDatConversionum($datos)
    {

        try {
            return $this->facade->salvarDatosDatConversionum($datos);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite obtener los datos de la tabla conversionum
     *
     * se accede a traves de parametros
     *
     * @param $parametros (arreglo de datos para el filtro el idindicador, start, limit)
     *
     * @return array
     */
    public function obtenerTodosDatosDatConversion($parametros)
    {

        try {
            return $this->facade->obtenerTodosDatosDatConversion($parametros);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite eliminar una conversion
     *
     * se accede a traves de parametros
     *
     * @param idconversion
     *
     * @return boolean
     */
    public function eliminarDatosDatConversion($idvoncersion)
    {

        try {
            return $this->facade->eliminarDatosDatConversion($idvoncersion);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todas las unidades de medidas
     *
     * se accede a traves de configuracion
     *
     * @return array
     */
    public function listarUnidadesMedidaTodas()
    {

        try {
            return $this->facade->listarUnidadesMedidaTodas();
        } catch (Exception $e) {

        }
    }

    public function listarUnidadesMedida($idMagnitud)
    {
        try {
            return $this->facade->listarUnidadesMedida($idMagnitud);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todos los paises de una entidad
     *
     * se accede a traves de configuracion
     *
     * @return array
     */
    public function obtenerPaisesEntidad($idestructura = null)
    {

        try {
            return $this->facade->obtenerPaisesEntidad();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de un pais segun su id
     *
     * se accede a traves de parametros
     *
     * @return array
     */
    public function obtenerPaisXID($idpais)
    {

        try {
            return $this->facade->obtenerPaisXID($idpais);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los js para la busqueda de elementos DPT
     *
     * se accede a traves de configuracion
     *
     * @return js
     */
    public function mostrarIUBuscarDPT()
    {

        try {
            return $this->facade->mostrarIUBuscarDPT();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las provincias o municipios
     *$id(cuando se pasa un id de una porvincia devuelve lso municipios), $idpais
     * se accede a traves de configuracion
     *
     * @return array
     */
    public function cargarEstruturadpa($id, $idpais)
    {

        try {
            return $this->facade->cargarEstruturadpa($id, $idpais);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las operaciones por subsistemas
     *
     * se accede a traves de parametros
     *
     * @param idsubsistema
     *
     * @return stdClass
     */
    public function getOperacionSubsistEnt($idsubsistema, $entidad)
    {
        try {
            return $this->facade->operacionSubsistEnt($idsubsistema, $entidad);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de la unidad de medida segun su id
     *
     * se accede a traves de parametros
     *
     * @param $idumedida
     *
     * @return array
     */
    public function obtenerUnidadMedidaPorId($idumedida)
    {

        try {
            return $this->facade->obtenerUnidadMedidaDadoId($idumedida);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de la unidad de medida segun su id
     *
     * se accede a traves de parametros
     *
     * @param $idumedida
     *
     * @return array
     */
    public function obtenerUMedidasConfIndicador($param)
    {

        try {

            return $this->facade->obtenerUMedidasConfIndicador($param);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de las operaciones segun su id
     *
     * se accede a traves de parametros
     *
     * @param idoperacion
     *
     * @return stdClass
     */
    public function getOperacionesPorId($idoperacion)
    {

        try {
            return $this->facade->getOperacionesPorId($idoperacion);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para realizar inner join con DatOperacion
     *
     * se accede a traves de parametros
     *
     * @param query (consulta),aliasinterno,aliasExterno
     *
     * @return Doctrine_query
     */
    public function getInnerJoinDatOperacion($query, $aliasinterno, $aliasExterno)
    {
        try {
            return $this->facade->InnerJoinDatOperacion($query, $aliasinterno, $aliasExterno, 1);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de la naturaleza de un nodo
     *
     * se accede a traves de parametros
     *
     * @param nodo
     *
     * @return array
     */
    public function obtenerDatosArbolNaturaleza($nodo)
    {

        try {
            return $this->facade->obtenerDatosArbolNaturaleza($nodo);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de marca-modelo
     *
     * se accede a traves de parametros
     *
     * @return array
     */
    public function obtenerDatosArbolMarcaModelo($parametros)
    {

        try {
            return $this->facade->obtenerDatosArbolMarcaModelo($parametros);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los los formatos por subsistemas
     *
     * se accede a traves de parametros
     *
     * @param idestructura ,idsubsistema
     *
     * @return stdClass
     */
    public function buscarFormatosPorSubsist($idestructura = null, $idsubsistema)
    {

        try {
            return $this->facade->buscarFormatosPorSubsist(
                ($idestructura == null) ? $this->varglobal->Estructura->idestructura :
                    $idestructura, $idsubsistema
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los formatos
     *
     * se accede a traves de parametros
     *
     * @return array
     */
    public function buscarFormato()
    {

        try {
            return $this->facade->BuscarFormato();
        } catch (Exception $e) {

        }
    }

    public function buscarFormatoPorID($idFormato)
    {
        try {
            return $this->facade->buscarFormatoPorID($idFormato);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las partes de un formato
     *
     * se accede a traves de parametros
     *
     * @param idformato
     *
     * @return stdClass
     */
    public function buscarParteFormato($idformato)
    {

        try {
            return $this->facade->buscarParteFormato($idformato);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve un arbol de las unidad de medida
     *
     * se accede a traves de parametros
     *
     * @param idmagnitud
     *
     * @return array
     */
    public function obtenerDatosArbolUM($idmagnitud)
    {

        try {
            return $this->facade->obtenerDatosArbolUM($idmagnitud);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las operaciones
     *
     * se accede a traves de parametros
     *
     * @param $araidoperacion
     *
     * @return stdClass
     */
    public function obtOperacionesPorIds($araidoperacion)
    {

        try {
            return $this->facade->obtOperacionesPorIds($araidoperacion);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los grupos segun el id
     *
     * se accede a traves de parametros
     *
     * @param idpadre
     *
     * @return stdClass
     */
    public function obteneCualquierGrupoPorID($idpadre)
    {

        try {
            return $this->facade->obteneCualquierGrupoPorID($idpadre);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los grupos de hijos segun el id
     *
     * se accede a traves de parametros
     *
     * @param idgruposubgrupo
     *
     * @return array
     */
    public function obteneCualquierGruposHijoPorID($idgruposubgrupo)
    {

        try {
            return $this->facade->obteneCualquierGruposHijoPorID($idgruposubgrupo);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos del padre
     *
     * se accede a traves de parametros
     *
     * @param idgruposubgrupo
     *
     * @return array
     */
    public function obtenerMiPadre($idgruposubgrupo)
    {

        try {
            return $this->facade->obtenerMiPadre($idgruposubgrupo);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los tipos de documentos por subsistema
     *
     * se accede a traves de parametros
     *
     * @param idsubsistema
     *
     * @return array
     */
    public function getDocumentosPorSubsistema($idsubsistema)
    {

        try {
            return $this->facade->getDocumentosPorSubsistema($idsubsistema);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los tipos de operaciones por documento
     *
     * se accede a traves de parametros
     *
     * @param iddoc
     *
     * @return array
     */
    public function getTipoOperacDoc($iddoc)
    {

        try {
            return $this->facade->getTipoOperacDoc($iddoc);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los grupos por hojas
     *
     * se accede a traves de parametros
     *
     * @param parametros (contiene start, limit, query)
     *
     * @return array
     */
    public function obtenerGruposHojas($parametros)
    {

        try {
            return $this->facade->obtenerGruposHojas($parametros);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los indicadores a traves de cominicarse
     * con otra tabla
     * se accede a traves de parametros
     *
     * @param $query , $aliastabla, $aliasrama, $aliashoja, $tipodejoin,
     *               $parametros
     *
     * @return array
     */
    public function dameQueryJoinNomIndicadores($query, $aliastabla, $aliasrama, $aliashoja, $tipodejoin, $parametros)
    {

        try {
            return $this->facade->dameQueryJoinNomIndicadores(
                $query, $aliastabla, $aliasrama, $aliashoja, $tipodejoin, $parametros
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los js para la ver la ventana de indicadores
     *
     * se accede a traves de parametros
     *
     * @return js
     */
    public function obtenerJSVentanaIndicadores()
    {
        try {
            return $this->facade->obtenerJSVentanaIndicadores();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los js para mostrar los detalles de los indicadores
     *
     * se accede a traves de parametros
     *
     * @return js
     */
    public function getWinMostrarDetallesIndicador()
    {

        try {
            return $this->facade->getWinMostrarDetallesIndicador();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve tipos de documentos por iddoc
     *
     * se accede a traves de parametros
     *
     * @param iddoc
     *
     * @return stdClass
     */
    public function getTipoDocumentoById($iddoc)
    {

        try {
            return $this->facade->getTipoDocumentoById($iddoc);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los datos del periodo segun su id
     *
     * se accede a traves de parametros
     *
     * @param idperiodo
     *
     * @return stdClass
     */
    public function obtenerPeriodo($idperiodo)
    {

        try {
            return $this->facade->obtenerPeriodo($idperiodo);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los periodos de un ejercicio
     *
     * se accede a traves de parametros
     *
     * @param idperiodo
     *
     * @return stdClass
     */
    public function obtenerPeriodos($idejercicio)
    {

        try {
            return $this->facade->ObtenerPeriodos($idejercicio);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos del tipo de documeto
     * para una estructura y un subsistema especifico
     *
     * se accede a traves de parametros
     *
     * @param $alias , $identidad, $subsistema
     *
     * @return array
     */
    public function tipoDocumentoByAliasByIdestructutra($alias, $identidad, $subsistema)
    {

        try {
            return $this->facade->tipoDocumentoByAliasByIdestructutra($alias, $identidad, $subsistema);
        } catch (Exception $e) {

        }
    }

    public function getDocumentsByParams($alias)
    {

        try {
            return $this->facade->getDocumentsByParams($alias);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos del tipo de documeto por categoria
     * para una estructura y un subsistema especifico
     *
     * se accede a traves de parametros
     *
     * @param $alias , $identidad, $subsistema
     *
     * @return array
     */
    public function tipoDocumentoPorCategoriaByIdestructutra($alias, $identidad, $subsistema)
    {

        try {
            return $this->facade->tipoDocumentoPorCategoriaByIdestructutra(
                $alias, $identidad, $subsistema
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los tipo de documentos
     *
     * se accede a traves de parametros
     *
     * @param $idsubsistema ,$idestructura,$filtro(los parametros son opcionales)
     *
     * @return array
     */
    public function documentosPorSubsistemaEntidad($idsubsistema, $idestructura, $filtro = array())
    {

        try {
            return $this->facade->documentosPorSubsistemaEntidad($idsubsistema, $idestructura, $filtro);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que para obtener el ejercicio de un subsistema
     * se accede a traves de parametros
     *
     * @param  $identidad , $subsistema
     *
     * @return array
     */
    public function getEjercicioActualSubsistema($idestructura, $idsubsistema)
    {

        try {
            return $this->facade->getEjercicioActualSubsistema($idestructura, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo  para obtener los datos de un ejercicio
     * se accede a traves de parametros
     *
     * @param $idejercicio , $idestructura
     *
     * @return stdClass
     */
    public function obtenerEjercicio($idejercicio, $idestructura = null)
    {

        try {
            return $this->facade->obtenerEjercicio($idejercicio, $idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el periodo actual de un subsistema
     *
     * @param  $idestructura , $idsubsistema, $devolverdatos
     *
     * @return numeric
     */
    public function getPeriodoActualSubsistema($idestructura, $idsubsistema, $devolverdatos)
    {

        try {
            return $this->facade->getPeriodoActualSubsistema($idestructura, $idsubsistema, $devolverdatos);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el primer periodo de un ejercicio
     * se accede a traves de parametros
     *
     * @param idejercicio
     *
     * @return array
     */
    public function getPrimerPeriodo($idejercicio)
    {

        try {
            return $this->facade->primerPeriodo($idejercicio);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la fecha contable de un subsistema
     * se accede a traves de parametros
     *
     * @param $idestructura , $idsubsistema
     *
     * @return stdClass
     */
    public function getFechaContableSubsistemaObj($idestructura, $idsubsistema)
    {

        try {
            return $this->facade->getFechaContableSubsistemaObj($idestructura, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la fecha contable de un subsistema
     * se accede a traves de parametros
     *
     * @param $idestructura , $idsubsistema
     *
     * @return stdClass
     */
    public function getFechaContableSubsistema($idestructura, $idsubsistema)
    {

        try {
            return $this->facade->fechaContableSubsistema($idestructura, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para contabilizar
     * se accede a traves de parametros
     *
     * @param  $descripcion , $asientos, $idsubsistema, $idestructura, $idperiodo, $fecha
     *
     * @return array
     */
    public function Contabilizar($descripcion, $asientos, $idsubsistema, $idestructura, $idperiodo, $fecha)
    {

        try {
            return $this->facade->contabilizar(
                $descripcion, $asientos, $idsubsistema, $idestructura, $idperiodo, $fecha
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para obtener la cuenta por operacion
     * se accede a traves de parametros
     *
     * @param  idoperacion
     *
     * @return numeric
     */
    public function getCuentaPorOperacion($idoperacion)
    {

        try {
            return $this->facade->cuentaPorOperacion($idoperacion);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para obtener la moneda contable
     * se accede a traves de parametros
     *
     * @return stdClass
     */
    public function buscarMonedaContable()
    {

        try {
            return $this->facade->buscarMonedaContable();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para obtener la moneda contable
     * se accede a traves de parametros
     * @params $numero,$idestructura
     *
     * @return array
     */
    public function buscarMoneda($numero, $idestructura)
    {

        try {
            return $this->facade->buscarMoneda($numero, $idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para obtener el id de la moneda de una entidad
     * se accede a traves de parametros
     *
     * @param $idmonedacontable , $idestructura
     *
     * @return numeric
     */
    public function buscarIdMonedaEntidad($idmonedacontable, $idestructura)
    {

        try {
            return $this->facade->buscarIdMonedaEntidad($idmonedacontable, $idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para clcular el importe de la moneda base por entidad
     * se accede a traves de parametros
     *
     * @param $idmoneda , $importe, $idestructura
     *
     * @return numeric
     */
    public function calcImpMonBaseByEntidad($idmoneda, $importe, $idestructura)
    {

        try {
            return $this->facade->calcImpMonBaseByEntidad($idmoneda, $importe, $idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para convertir un importe de cualquier moneda a
     * la moneda base
     *
     * @param $idnommonedaentidad , $importmonorig
     *
     * @return double
     */
    public function calcImpMonBase($idnommonedaentidad, $importmonorig)
    {

        try {
            return $this->facade->calcImpMonBase($idnommonedaentidad, $importmonorig);
        } catch (Exception $e) {

        }
    }

    /**
     * @return mixed
     */
    public function obtenerCondicionesPago()
    {
        try {
            return $this->facade->obtenerCondicionesPago();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para buscar la tasa actual
     * se accede a traves de parametros
     *
     * @param $idmoneda
     *
     * @return stdClass
     */
    public function buscarTasaActual($idmoneda)
    {

        try {
            return $this->facade->buscarTasaActual($idmoneda);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve un objeto de la clase
     * se accede a traves de parametros
     *
     * @return obj
     */
    public function getInstanceClass()
    {

        try {
            return $this->facade->getInstanceClass();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de la especialidad segun su id
     * se accede a traves de parametros
     *
     * @param idespecialidad
     *
     * @return stdClass
     */
    public function obtenerEspecialidadPorId($idespecialidad)
    {

        try {
            return $this->facade->obtenerEspecialidadPorId($idespecialidad);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Metodo que cierra el periodo de un subsistema
     * se accede a traves de parametros
     *
     * @param $identidad , $idsubsitema
     *
     * @return Boolean
     */
    public function cerrarPeriodo($identidad, $idsubsitema)
    {
        try {
            return $this->facade->cerrarPeriodo($identidad, $idsubsitema);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Metodo que cierra el ejercicio de un subsistema
     * se accede a traves de parametros
     *
     * @param $identidad , $idsubsitema
     *
     * @return Boolean
     */
    public function cerrarEjercicio($identidad, $idsubsitema)
    {

        try {
            return $this->facade->cerrarEjercicio($identidad, $idsubsitema);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Metodo que cierra la carga inicial de los subsistema
     *
     *
     * @param $identidad , $idsubsitema
     *
     * @return Boolean
     */
    public function cierreCargaInicial($identidad, $idsubsitema)
    {

        try {
            return $this->facade->cierreCargaInicial($identidad, $idsubsitema);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo para obtener si un subsistema esta en carga inicial o no
     * 0 es que se encuentra en carga inicial y 1 que ya cerro
     *
     * @param $identidad , $idsubsitema
     *
     * @return Boolean
     */
    public function subsistemaAperturado($identidad, $idsubsitema)
    {

        try {
            return $this->facade->subsistemaAperturado($identidad, $idsubsitema);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que cuenta los tipos de operaciones a los documentos de
     * un subsistema
     * se accede a traves de parametros
     *
     * @param $aliasDoc , $idestructura, $idsubsistema
     *
     * @return Numeric
     */
    public function countTipoOperacionesDoc($aliasDoc, $idestructura, $idsubsistema)
    {

        try {
            return $this->facade->countTipoOperacionesDoc($aliasDoc, $idestructura, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los tipos de operaciones a los documentos de
     * un subsistema
     * se accede a traves de parametros
     *
     * @param $aliasDoc , $idestructura, $idsubsistema
     *
     * @return array
     */
    public function getTipoOperacionesDoc($aliasDoc, $idestructura, $idsubsistema)
    {

        try {
            return $this->facade->getTipoOperacionesDoc($aliasDoc, $idestructura, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     *
     * @return type
     */
    public function ObtenerEspecialidadesHojas()
    {
        try {
            return $this->facade->obtenerEspecialidadesHojas();
        } catch (Exception $e) {

        }
    }

    public function obtenerEspecialidades($parametros)
    {
        try {
            return $this->facade->obtenerEspecialidades($parametros);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los tipos de operaciones por el numero del
     * subsistema
     * se accede a traves de parametros
     *
     * @param $numerosub , $idestructura, $idsubsistema
     *
     * @return array
     */
    public function obtOperPorIdN($numerosub, $idestructura, $idsubsistema)
    {

        try {
            return $this->facade->obtOperPorIdN($numerosub, $idestructura, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /* Metodo que devuelve si jna entidad solo tiene moneda contable
     * se accede a traves de parametros
     * @param identidad
     * @return boolean
     */

    public function soloMonedaCont($identidad)
    {

        try {
            return $this->facade->soloMonedaCont($identidad);
        } catch (Exception $e) {

        }
    }

    /* Metodo que devuelve si jna entidad solo tiene moneda contable
     * se accede a traves de parametros
     * @param idsucursal
     * @return stdClass
     */

    public function obtenerSucursalPorId($idsucursal)
    {

        try {
            return $this->facade->obtenerSucursalPorId($idsucursal);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las moneda contable de una entidad
     * se accede a traves de parametros
     *
     * @param identidad
     *
     * @return stdClass
     */
    public function monedaContableEntidad($identidad)
    {

        try {
            return $this->facade->monedaContableEntidad($identidad);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las tasas segun monedas y tipo de tasas
     * se accede a traves de parametros
     *
     * @param $idmonedaOrigen , $idmonedaDest, $idtipoTasa
     *
     * @return array
     */
    public function getTasaByMonedas($idmonedaOrigen, $idmonedaDest, $idtipoTasa)
    {

        try {
            return $this->facade->getTasaByMonedas($idmonedaOrigen, $idmonedaDest, $idtipoTasa);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve las moneda contable de una entidad
     * se accede a traves de parametros
     *
     * @param identidad
     *
     * @return array
     */
    public function obtenerMonedaContablePorEntidad($identidad)
    {

        try {
            return $this->facade->obtenerMonedaContablePorEntidad();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todas las monedas de una entidad
     * se accede a traves de datosmaestro
     *
     * @param identidad
     *
     * @return array
     */
    public function obtenerMonedasPorEntidad($identidad)
    {

        try {
            return $this->facade->obtenerMonedasPorEntidad($identidad);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las moneda alternativa de una entidad
     * se accede a traves de parametros
     *
     * @param identidad
     *
     * @return array
     */
    public function obtenerMonedasAlternativasPorEntidad($identidad)
    {

        try {

            return $this->facade->buscarMonedaAlternativa($identidad);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite unirse con documentos primario
     * se accede a traves de parametros
     *
     * @param $query (un objeto de Doctrine_query), $aliastablatuya
     *
     * @return Doctrine_query
     */
    public function innerJoinDocumentoPrim($query, $aliasLocal, $aliasDocPrim = 'dp')
    {

        try {
            return $this->facade->innerJoinDocumentoPrim($query, $aliasLocal, $aliasDocPrim);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo verifica si existe el subsistema finanzas en una entidad
     * se accede a traves de parametros
     *
     * @param $idestructura
     *
     * @return boolean
     */
    public function obtenerSubsistemasFnz($idestructura)
    {

        try {
            return $this->facade->obtenerSubsistemasFnz($idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todas las unidades de medidas
     * se accede a traves de parametros
     *
     * @return arbol
     */
    public function obtenerCategoriasUM()
    {

        try {
            return $this->facade->obtenerCategoriasUM();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que verifica si exite una moneda alternativa para una entidad
     * se accede a traves de parametros
     *
     * @param $idestructura
     *
     * @return Boolean
     */
    public function existeMonedaAlertnativa($idestructura = null)
    {

        try {
            return $this->facade->existeMonedaAlertnativa(
                ($idestructura == null) ? $this->global->Estructura->idestructura : $idestructura
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los banco de un cliente
     * se accede a traves de parametros
     *
     * @param $idcliente , $idestructura
     *
     * @return array
     */
    public function obtenerBancosporCliente($idcliente, $idestructura)
    {

        try {
            return $this->facade->obtenerBancosporCliente(
                $idcliente, $idestructura
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los clientes segun la denominacion de un cliente
     * se accede a traves de parametros
     *
     * @param $idestructura , $filtro(contiene la denominacion, start,limit)
     *
     * @return array
     */
    public function obtenerClientesByDenom($idestructura, $filtro)
    {

        try {
            return $this->facade->obtenerClientesByDenom($idestructura, $filtro);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de un cliente segun idestructuracliente
     * se accede a traves de parametros
     *
     * @param $idestructura , $filtro(contiene la denominacion, start,limit)
     *
     * @return array
     */
    public function getCliente($idestructuracliente)
    {

        try {
            return $this->facade->obtenerCliente($idestructuracliente);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los clientes
     * se accede a traves de parametros
     *
     * @param $idestructura , $start,$limit, $filtro(no obligatorio)
     *
     * @return array
     */
    public function obtenerClientes($idestructura, $start, $limit, $filtro)
    {

        try {
            return $this->facade->obtenerClientes($idestructura, $start, $limit, $filtro);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los proveedores segun la denominacion
     * se accede a traves de parametros
     *
     * @param $idestructura , $filtro(contiene la denominacion, start,limit)
     *
     * @return array
     */
    public function obtenerProveedoresByDenom($idestructura, $filtro = null)
    {

        try {
            return $this->facade->obtenerProveedoresByDenom($idestructura, $filtro);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve todos los proveeedores
     * se accede a traves de parametros
     *
     * @param $idestructura , $filtro(contiene la denominacion, start,limit)
     *
     * @return array
     */
    public function ObtenerProveedores($idestructura, $limit = null, $star = null, $filtro = null)
    {

        try {
            return $this->facade->obtenerProveedores($idestructura, $limit, $star, $filtro);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve las unidades de medida
     * se accede a traves de parametros
     *
     * @return js
     */
    public function obtenerJSArbolUM()
    {

        try {
            return $this->facade->obtenerJSArbolUM();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite unirse con la tabla unidad de medida
     * se accede a traves de parametros
     *
     * @param $query , $aliastabletuya, $aliastablaum, $select, $tipojoin
     *
     * @return Doctrine_query
     */
    public function getQueryJoinUnidadMedida($query, $aliastableinterna, $aliastablaum, $select, $tipojoin)
    {

        try {
            return $this->facade->getQueryJoinUnidadMedida(
                $query, $aliastableinterna, $aliastablaum, $select, $tipojoin
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite obtener las cuentas controladas por un objeto
     * se accede a traves de parametros
     *
     * @param $objoperacioncontable ,$idsubsistema,$idestructura
     *
     * @return stdClass
     */
    public function cuentasContrPorNomObjeto($objoperacioncontable, $idsubsistema, $idestructura)
    {

        try {
            return $this->facade->cuentasContrPorNomObjeto(
                $objoperacioncontable, $idsubsistema, $idestructura
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite unirse con la tabla operacion
     * se accede a traves de parametros
     *
     * @param $query , $aliastabla
     *
     * @return Doctrine_query
     */
    public function queryRootDatOpercionCont($query, $aliastabla)
    {

        try {
            return $this->facade->queryRootDatOpercionCont($query, $aliastabla);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que calcula el importe de monedas
     * se accede a traves de parametros
     *
     * @param $idmoneda ,$suma, $idestructura
     *
     * @return numeric
     */
    public function calcularImporteDadoMonedas($idmoneda, $suma, $idestructura, $exception)
    {

        try {
            return $this->facade->calcularImporteDadoMonedas($idmoneda, $suma, $idestructura, $exception);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que convierte de calquier moneda
     * a la moneda base
     *
     *
     * @param $idmoneda (la del nomenclador) ,$importe, $idestructura
     *
     * @return numeric
     */
    public function calcularImporteMoneda($idmoneda, $importe, $idestructura)
    {

        try {
            return $this->facade->calcularImporteMoneda($idmoneda, $importe, $idestructura);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve las poperaciones por concepto
     * se accede a traves de parametros
     *
     * @param $identidad ,$idsubsistema
     *
     * @return array
     */
    public function obtenerIdsOperacionesPorConcepto($identidad, $idsubsistema)
    {

        try {
            return $this->facade->obtenerIdsOperacionesPorConcepto($identidad, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los indicadores que son hojas
     * se accede a traves de parametros
     *
     * @param $param ()
     *
     * @return array
     */
    public function getIndicadoresTreeConHojas($params)
    {

        try {
            return $this->facade->getIndicadoresTreeConHojas($params);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los indicadores en decendencia
     * se accede a traves de parametros
     *
     * @param $idarbol , $ordenizq, $ordender, $naturalezas
     *
     * @return array
     */
    public function getArrIndicadoresDescendencia($idarbol, $ordenizq, $ordender, $naturalezas)
    {

        try {
            return $this->facade->getArrIndicadoresDescendencia(
                $idarbol, $ordenizq, $ordender, $naturalezas
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la fecha de un subsistema
     * se accede a traves de parametros
     *
     * @param $identidad , $idsubsistema
     *
     * @return Date
     */
    public function getActFechContabSubsist($identidad, $idsubsistema)
    {

        try {
            return $this->facade->getActFechContabSubsist($identidad, $idsubsistema);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la contabilidad adicional
     * se accede a traves de parametros
     *
     * @param $idoperacion
     *
     * @return stdClass
     */
    public function obtContabAdicional($idoperacion)
    {

        try {
            return $this->facade->obtContabAdicional($idoperacion);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la naturaleza de un indicador
     * se accede a traves de parametros
     *
     * @param $start , $limit,$querywhere
     *
     * @return array
     */
    public function obtenerNaturalezasAsociadasIndicador($start, $limit, $querywhere)
    {

        try {
            return $this->facade->obtenerNaturalezasAsociadasIndicador($start, $limit, $querywhere);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite unirse con la tbala naturaleza como root
     * se accede a traves de parametros
     *
     * @param $query , $aliastabla
     *
     * @return Doctrine_query
     */
    public function queryRootNomNaturaleza($query, $aliastabla)
    {
        try {
            return $this->facade->queryRootNomNaturaleza($query, $aliastabla);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que permite unirse con la tbala naturaleza
     * se accede a traves de parametros
     *
     * @param $query ,$aliasinterno,$aliasexterno,$select
     *
     * @return Doctrine_query
     */
    public function innerJoinNomNaturaleza($query, $aliasinterno, $aliasexterno, $select)
    {
        try {
            return $this->facade->innerJoinNomNaturaleza(
                $query, $aliasinterno, $aliasexterno, $select
            );
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve la estrucutra de un subsistema
     * se accede a traves de subsistemas
     *
     * @param $idsubsistema
     *
     * @return numeric
     */
    public function encuentraIdestructurasubsist($idsubsistema)
    {
        try {
            return $this->facade->encuentraIdestructurasubsist($idsubsistema);
        } catch (Exception $e) {

        }
    }

    public function obtenerDocumentoPrimPorId($iddoc)
    {
        try {
            return $this->facade->obtenerDocumentoPrimPorId($iddoc);
        } catch (Exception $exc) {

        }
    }

    /**
     * metodo para obtener las operaciones: segun la entidad, dado un iddoc, los datos de una operacion en especifico
     * @param type $idestructura (obligatorio)
     * @param type $idsubsitema
     * @param type $iddoc
     * @param type $idoperacion
     * @param type $start
     * @param type $limit
     * @param type $filtro
     * @return stdClass
     */
    public function obtenerOperaciones(
        $idestructura, $idsubsitema = null, $iddoc = null, $idoperacion = null, $start = null, $limit = null, $filtro = null
    )
    {
        try {
            return $this->facade->obtenerOperaciones(
                $idestructura, $idsubsitema, $iddoc, $idoperacion, $start, $limit, $filtro
            );
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    /* Devuelve los clientes y/o proveedores de acuerdo a los parametros. 
     * 
     * @param int  $idCliente    Identificador del cliente y/o proveedor a buscar 
     * @param int  $idEstructura Identificador de la estructura comun 
     * @param bool $toArray      En caso que se quieran el resultado en forma de arreglo 
     * @param bool $cliente      En caso que se quieran obtenere los cliente este parametros se pasa en true 
     * @param bool $proveedor    En caso que se quieran obtenere los proveedores este parametros se pasa en true 
     *
     * @param array $filtros     Filtra por nombre o codigo
     * @param int  $start        A partir de tupla se quiera obtener la respuesta 
     * @param int  $limit        Cantidad de elementos a obtener 
     * 
     * @return mixed|array|Doctrine_Record 
     */

    public function getClientesProveedorByParams($idCliente = null, $idEstructura = null, $toArray = false,
                                                 $cliente = false, $proveedor = false, $filtros = null, $start = 0, $limit
    )
    {
        try {
            return $this->facade->getClientesProveedorByParams(
                $idCliente, $idEstructura, $cliente, $proveedor, $filtros, $start, $limit
            );
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    /**
     * @param $idcliente
     * @param bool $cobroPago
     * @return string
     */
    public function getCuentasClienteProveedor($idcliente, $cobroPago = true)
    {
        try {
            return $this->facade->getCuentasClienteProveedor($idcliente, $cobroPago);
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    /*
     * Devulve el identificador del cliente 
     * si el usuario logeado es un cliente
     * param idusuario(identificador del usuario logeado)
     * result numeric
     */

    public function getClienteProveedorByUser($idusuario)
    {
        try {
            return $this->facade->getClienteProveedorByUser($idusuario);
        } catch (Exception $exc) {

        }
    }

    public function proxyFacade()
    {
        $file = Zend_Registry::getInstance()->get('config')->dir_aplication . ''
            . DIRECTORY_SEPARATOR . '/logistica/utiles/comun/recursos/interfaces';
        $this->iniConfig = InitConfigLoader::__init()->load($file);
        switch ($this->iniConfig->version_configuracion) {
            case 'datosmaestros':
                $this->facade = DatosMaestrosHelper::__init();
                break;
            default:
                $this->facade = ParametrosHelper::__init();
                break;
        }
    }

    public function devolverClienteById($idCliente)
    {
        return LogisticaDoctrineHelper::__init()
            ->getConnection()->fetchAll(
                "select ncp.* from mod_datosmaestros.nom_clientesproveedor ncp
                            where ncp.idclientesproveedores = {$idCliente}"
            );
    }

    public function getModeloContabilizacion($idModelo)
    {
        try {
            return $this->facade->getModeloContabilizacion($idModelo);
        } catch (Exception $exc) {

        }
    }

    public function getJSNomMarcaModelo()
    {
        try {
            return $this->facade->getJSNomMarcaModelo();
        } catch (Exception $exc) {

        }
    }

    public function getJSAtributosDinamicos()
    {
        try {
            return $this->facade->getJSAtributosDinamicos();
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio para obtener todas los modelos
     * params:$filtro
     * retunr: array
     */
    public function obtenerModelos($filtro)
    {
        try {
            return $this->facade->obtenerModelos($filtro);
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio para obtener todas las marcas
     * param: filtros
     * result: array
     */
    public function obtenerMarcas($filtros)
    {
        try {
            return $this->facade->obtenerMarcas($filtros);
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio para agrupaciones
     */
    public function getSJArbolAgrupaciones()
    {
        try {
            return $this->facade->getSJArbolAgrupaciones();
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio que devuelve NomClienteproveedore como tabla root
     * para poder hacer innerjoin
     */
    public function getQuery($aliasLocal)
    {
        try {
            return $this->facade->getQuery($aliasLocal);
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio que devuelve los atributos dinamicos
     * de las agrupaciones dado los indicadores
     * $filtro: Los id de los indicadores
     */
    public function getAtributosAgrupacionIndicador($filtro)
    {
        try {
            return $this->facade->getAtributosAgrupacionIndicador($filtro);
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio para realizar la seleccion con Operaciones
     * $dql: Doctrine_dql
     * $asLoc: alias local
     */
    public function addQuerySelectOperacion($dql, $asLoc)
    {
        try {
            return $this->facade->addQuerySelectOperacion($dql, $asLoc);
        } catch (Exception $exc) {

        }
    }

    /**
     * Servicio para realizar la union con Operaciones
     * $dql: Doctrine_dql
     * $asExt: alias externo
     * $asLoc: alias local
     * $join: tipo de join
     *
     */
    public function addQueryJoinOperacion($dql, $asExt, $asLoc, $join)
    {
        try {
            return $this->facade->addQueryJoinOperacion($dql, $asExt, $asLoc, $join);
        } catch (Exception $exc) {

        }
    }

    /*
     * Servicio que devuelve las naturalezas que estan asociadas a algun indicador
     * $filtro: Filtro que se desea pasar
     * $start: offset
     * $limit: limit
     */

    public function getNaturalezasAsociadasIndicadores($start, $limit, $filtro)
    {
        try {
            return $this->facade->getNaturalezasAsociadasIndicadores($start, $limit, $filtro);
        } catch (Exception $exc) {

        }
    }

    /**
     *
     * @param type $idEstructuraSubsist
     * @return type
     */
    public function getObjEstructSubsisById($idEstructuraSubsist)
    {
        try {
            return $this->facade->getObjEstructSubsisById($idEstructuraSubsist);
        } catch (Exception $exc) {

        }
    }

    public function getOrganismos($params) {
        return $this->facade->getOrganismos($params);
    }

}
