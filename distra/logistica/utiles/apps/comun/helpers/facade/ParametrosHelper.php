<?php

/**
 * Clase especializada en el trabajo con los servicios que se utilizan de
 * configuracion general
 *
 *
 */
class ParametrosHelper implements ISingletonClass
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
     * Creates a new instance of class ServiciosConfiguracionGeneralHelper
     *
     * @return ServiciosConfiguracionGeneralHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new ParametrosHelper;
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
            return $this->integrator->configuracion->mostrarNomencladoresGenerales();
        } catch (Exception $e) {

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
            return $this->integrator->parametros->ObtenerObjetoPorSubsistTipo($idSubsistema, $nomObjeto);
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
            return $this->integrator->parametros->ObtenerEjercicios($identidad);
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
            return $this->integrator->parametros->ObtenerJSArbolNaturaleza();
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
            return $this->integrator->parametros->dameQueryRootIndicador($query, $aliasRama, $aliasHoja, $tipoJoin);
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
            return $this->integrator->parametros->getNaturalezas($query);
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
            return $this->integrator->parametros->obtenerUnidadMedidaDadoId($idumedida);
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
            return $this->integrator->parametros->existeConversion();
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
            return $this->integrator->parametros->obtenerFactorBaseDadoidUmedida($idumedida);
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
            return $this->integrator->parametros->getUMedidaIndicador($idindicador);
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
            return $this->integrator->parametros->ObtenerObjetoDatConversionum();
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
            return $this->integrator->parametros->salvarDatosDatConversionum($datos);
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
            return $this->integrator->parametros->obtenerTodosDatosDatConversion($parametros);
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
            return $this->integrator->parametros->eliminarDatosDatConversion($idvoncersion);
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
            return $this->integrator->configuracion->listarUnidadesMedidaTodas();
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
    public function obtenerPaisesEntidad($idestructura)
    {

        try {
            return $this->integrator->parametros->ObtenerPaisesEntidad($idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve los datos de un pai segun su id
     *
     * se accede a traves de parametros
     *
     * @return array
     */
    public function obtenerPaisXID($idpais)
    {

        try {
            return $this->integrator->parametros->ObtenerPais($idpais);
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
            return $this->integrator->configuracion->mostrarIUBuscarDPT();
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
            return $this->integrator->parametros->OperacionSubsistEnt($idsubsistema, $entidad);
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
            $um = $this->integrator->parametros->ObtenerUnidadMedidaPorId($idumedida);
            return $um[0];
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

            return $this->integrator->parametros->obtenerUMedidasConfIndicador($param);
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
            return $this->integrator->parametros->OperacionesPorId($idoperacion);
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
            return $this->integrator->parametros->InnerJoinDatOperacion($query, $aliasinterno, $aliasExterno, 1);
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
            return $this->integrator->parametros->ObtenerDatosArbolNaturaleza($nodo);
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
    public function obtenerDatosArbolMarcaModelo()
    {

        try {
            return $this->integrator->parametros->ObtenerDatosArbolMarcaModelo();
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
            return $this->integrator->parametros->BuscarFormatosPorSubsist(
                ($idestructura == null)
                    ? $this->varglobal->Estructura->idestructura
                    :
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
            return $this->integrator->parametros->BuscarFormato();
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
            return $this->integrator->parametros->BuscarParteFormato($idformato);
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
            return $this->integrator->parametros->ObtenerDatosArbolUM($idmagnitud);
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
            return $this->integrator->parametros->ObtOperacionesPorIds($araidoperacion);
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
            return $this->integrator->parametros->ObteneCualquierGrupoPorID($idpadre);
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
            return $this->integrator->parametros->ObteneCualquierGruposHijoPorID($idgruposubgrupo);
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
            return $this->integrator->parametros->ObtenerMiPadre($idgruposubgrupo);
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
            return $this->integrator->parametros->DocumentosPorSubsistema($idsubsistema);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->TipoOperacDoc($iddoc);
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
            return $this->integrator->parametros->ObtenerGruposHojas($parametros);
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
            return $this->integrator->parametros->dameQueryJoinNomIndicadores(
                $query, $aliastabla, $aliasrama,
                $aliashoja, $tipodejoin, $parametros
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
            return $this->integrator->parametros->ObtenerJSVentanaIndicadores();
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
            return $this->integrator->parametros->getWinMostrarDetallesIndicador();
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve tipos de documentos por iddoc
     *
     * se accede a traves de parametros
     *
     * @param iddocumento
     *
     * @return stdClass
     */
    public function getTipoDocumentoById($iddocumento)
    {

        try {
            return $this->integrator->parametros->TipoDocumentoById($iddocumento);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->ObtenerPeriodo($idperiodo);
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
            return $this->integrator->parametros->ObtenerPeriodos($idejercicio);
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
            return $this->integrator->parametros->TipoDocumentoByAliasByIdestructutra($alias, $identidad, $subsistema);
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
            return $this->integrator->parametros->TipoDocumentoPorCategoriaByIdestructutra(
                $alias, $identidad,
                $subsistema
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
            return $this->integrator->parametros->DocumentosPorSubsistemaEntidad($idsubsistema, $idestructura, $filtro);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->EjercicioActualSubsistema($idestructura, $idsubsistema);
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
            return $this->integrator->parametros->ObtenerEjercicio($idejercicio, $idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo que devuelve el periodo actual de un subsistema
     *
     * @param  $idestructura , $idsubsistema, $mostrardatos
     *
     * @return numeric
     */
    public function getPeriodoActualSubsistema($idestructura, $idsubsistema, $mostrardatos)
    {

        try {
            return $this->integrator->parametros->PeriodoActualSubsistema($idestructura, $idsubsistema, $mostrardatos);
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
            return $this->integrator->parametros->PrimerPeriodo($idejercicio);
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
    public function fechaContableSubsistemaObj($idestructura, $idsubsistema)
    {

        try {
            return $this->integrator->parametros->FechaContableSubsistemaObj($idestructura, $idsubsistema);
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
            return $this->integrator->parametros->FechaContableSubsistema($idestructura, $idsubsistema);
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
            return $this->integrator->parametros->Contabilizar(
                $descripcion, $asientos, $idsubsistema, $idestructura,
                $idperiodo, $fecha
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
            return $this->integrator->parametros->CuentaPorOperacion($idoperacion);
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
            return $this->integrator->parametros->BuscarMonedaContable();
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
            return $this->integrator->parametros->BuscarMoneda($numero, $idestructura);
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
            return $this->integrator->parametros->BuscarIdMonedaEntidad($idmonedacontable, $idestructura);
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
            return $this->integrator->parametros->CalcImpMonBaseByEntidad($idmoneda, $importe, $idestructura);
        } catch (Exception $e) {

        }
    }

    /**
     * Metodo para clcular el importe de la moneda base
     * se accede a traves de parametros
     *
     * @param $idnommonedaentidad , $importmonorig
     *
     * @return double
     */
    public function calcImpMonBase($idnommonedaentidad, $importmonorig)
    {

        try {
            return $this->integrator->parametros->CalcImpMonBase($idmoneda, $importe, $idestructura);
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
            return $this->integrator->parametros->BuscarTasaActual($idmoneda);
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
            return $this->integrator->parametros->getInstanceClass();
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
            return $this->integrator->parametros->ObtenerEspecialidadPorId($idespecialidad);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->CerrarPeriodo($identidad, $idsubsitema);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->CerrarEjercicio($identidad, $idsubsitema);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->CountTipoOperacionesDoc($aliasDoc, $idestructura, $idsubsistema);
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
            return $this->integrator->parametros->TipoOperacionesDoc($aliasDoc, $idestructura, $idsubsistema);
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
            return $this->integrator->parametros->ObtenerEspecialidadesHojas();
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
            return $this->integrator->parametros->ObtOperPorIdN($numerosub, $idestructura, $idsubsistema);
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
            return $this->integrator->parametros->SoloMonedaCont($identidad);
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
            return $this->integrator->parametros->ObtenerSucursalPorId($idsucursal);
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
            return $this->integrator->parametros->MonedaContableEntidad($identidad);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->ObtenerMonedaContablePorEntidad($identidad);
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
            return $this->integrator->parametros->ObtenerMonedasAlternativasPorEntidad($identidad);
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
            return $this->integrator->parametros->InnerJoinDocumentoPrim($query, $aliasLocal, $aliasDocPrim);
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
            return $this->integrator->parametros->ObtenerSubsistemasFnz($idestructura);
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
            return $this->integrator->parametros->ObtenerCategoriasUM();
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
            return $this->integrator->parametros->ExisteMonedaAlertnativa(
                ($idestructura == null) ? $this->global->Estructura->idestructura
                    : $idestructura
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
            return $this->integrator->parametros->ObtenerBancosporCliente(
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
            return $this->integrator->parametros->ObtenerClientesByDenom($idestructura, $filtro);
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
            return $this->integrator->parametros->ObtenerClientes($idestructura, $start, $limit, $filtro);
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
            return $this->integrator->parametros->ObtenerProveedoresByDenom($idestructura, $filtro);
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
            return $this->integrator->parametros->ObtenerProveedores($idestructura, $limit, $star, $filtro);
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
            return $this->integrator->parametros->ObtenerJSArbolUM();
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
            return $this->integrator->parametros->getQueryJoinUnidadMedida(
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
            return $this->integrator->parametros->CuentasContrPorNomObjeto(
                $objoperacioncontable, $idsubsistema,
                $idestructura
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
            return $this->integrator->parametros->QueryRootDatOpercionCont($query, $aliastabla);
        } catch (Exception $e) {

        }
    }
     /**
     * Metodo para obtner los tipos de tasas
     *@param $filtro, $star, $limit
     * 
     *@return array
     */
    public function getTipoTasas($filtro, $star, $limit)
    {

        try {
            return $this->integrator->parametros->getTipoTasas($filtro, $star, $limit);
        } catch (Exception $e) {
            return $e->getMessage();
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
    public function calcularImporteDadoMonedas($idmoneda, $suma, $idestructura)
    {

        try {
            return $this->integrator->parametros->CalcularImporteDadoMonedas($idmoneda, $suma, $idestructura);
        } catch (Exception $e) {

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
            return $this->integrator->parametros->ObtenerIdsOperacionesPorConcepto($identidad, $idsubsistema);
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
            return $this->integrator->parametros->getIndicadoresTreeConHojas($params);
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
            return $this->integrator->parametros->getArrIndicadoresDescendencia(
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
            return $this->integrator->parametros->ActFechContabSubsist($identidad, $idsubsistema);
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
            return $this->integrator->parametros->ObtContabAdicional($idoperacion);
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
            return $this->integrator->parametros->ObtenerNaturalezasAsociadasIndicador($start, $limit, $querywhere);
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
            return $this->integrator->parametros->QueryRootNomNaturaleza($query, $aliastabla);
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
            return $this->integrator->parametros->InnerJoinNomNaturaleza(
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
            return $this->integrator->subsistemas->EncuentraIdestructurasubsist($idsubsistema);
        } catch (Exception $e) {

        }
    }

    public function ObtenerDocumentoPrimPorId($iddoc)
    {
        try {
            return $this->integrator->parametros->ObtenerDocumentoPrimPorId($iddoc);
        } catch (Exception $exc) {

        }
    }

    public function listarUnidadesMedida($idMagnitud)
    {
        try {
            return $this->integrator->configuracion->listarUnidadesMedida($idMagnitud);
        } catch (Exception $e) {

        }

    }

}
