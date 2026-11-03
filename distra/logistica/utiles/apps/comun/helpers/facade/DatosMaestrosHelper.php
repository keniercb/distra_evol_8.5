<?php

/**
 * Clase especializada en el trabajo con los servicios que se utilizan de
 * configuracion general
 *
 *
 */
class DatosMaestrosHelper extends ServiciosConfiguracionGeneralHelper {

    /**
     * Una instancia unica de ServiciosConfiguracionGeneralHelper
     *
     * @var ServiciosConfiguracionGeneralHelper
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
    private function __construct() {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Creates a new instance of class ServiciosConfiguracionGeneralHelper
     *
     * @return ServiciosConfiguracionGeneralHelper
     */
    public static function __init() {
        if (null === self::$instance) {
            self::$instance = new DatosMaestrosHelper;
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
    public function mostrarNomencladoresGenerales() {

        try {

            return $this->integrator->datosmaestros->mostrarNomencladoresGenerales();
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para obtner los tipos de tasas
     *
     * @param $filtro , $star, $limit
     *
     * @return array
     */
    public function getTipoTasas($filtro, $star, $limit) {
        try {
            return $this->integrator->datosmaestros->getTipoTasas($filtro, $star, $limit);
        }
        catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve las provincias o municipios
     * $id(cuando se pasa un id de una porvincia devuelve lso municipios), $idpais
     * se accede a traves de configuracion
     *
     * @return array
     */
    public function cargarEstruturadpa($id, $idpais) {

        try {
            return $this->integrator->datosmaestros->cargarEstruturadpa($id, $idpais);
        }
        catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve las tasas segun monedas y tipo de tasas
     * se accede a traves de parametros
     *
     * @param $idmonedaOrigen, $idmonedaDest, $idtipoTasa
     *
     * @return array
     */
    public function getTasaByMonedas($idmonedaOrigen, $idmonedaDest, $idtipoTasa) {

        try {
            return $this->integrator->datosmaestros->getTasaByMonedas($idmonedaOrigen, $idmonedaDest, $idtipoTasa);
        }
        catch (Exception $e) {
            return $e->getMessage();
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
    public function obtenerAllTasasByMoneda($idmonedaentidad) {

        try {
            return $this->integrator->datosmaestros->obtenerAllTasasByMoneda($idmonedaentidad);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para convertir de una moneda a otra, segun un tipo de tasa.
     * @param $idmonedaorigen, $idmonedadestino, $importeorigen
     * 
     *
     * @return double
     */
    public function convertirImporte($idmonedaorigen, $idmonedadestino, $idtipotasa, $importeorigen, $compraventa) {

        try {
            return $this->integrator->datosmaestros->convertirImporte($idmonedaorigen, $idmonedadestino, $idtipotasa, $importeorigen, $compraventa);
        }catch (Exception $e) {
            return $importeorigen;
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
    public function obtenerEjercicios($identidad) {

        try {
            return $this->integrator->datosmaestros->obtenerEjercicios($identidad);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para cerrar la carga inicial de los subsistema
     *
     * 
     * @params $identidad,$idsubsitema
     *
     * @return boolean
     */
    public function cierreCargaInicial($identidad, $idsubsitema) {

        try {
            return $this->integrator->datosmaestros->cierreP($identidad, $idsubsitema);
        }
        catch (Exception $e) {
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
    public function subsistemaAperturado($identidad, $idsubsitema) {

        try {
            return $this->integrator->datosmaestros->subsistemaAperturado($identidad, $idsubsitema);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * metodo que devuelve un objeto de la clase ComunImagenModel
     *
     * @return \ComunImagesModel
     */
    public function obtenerObjClassComunImangenModel() {
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
    public function ObtenerJSArbolNaturaleza() {

        try {
            return $this->integrator->datosmaestros->obtenerJSArbolNaturaleza();
        }
        catch (Exception $e) {
            
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
    public function dameQueryRootIndicador($query, $aliasRama, $aliasHoja, $tipoJoin) {

        try {
            return $this->integrator->datosmaestros->dameQueryRootIndicador($query, $aliasRama, $aliasHoja, $tipoJoin);
        }
        catch (Exception $e) {
            
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
    public function getNaturalezas($query) {

        try {
            return $this->integrator->datosmaestros->getNaturalezas($query);
        }
        catch (Exception $e) {
            
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
    public function obtenerUnidadMedidaDadoId($idumedida) {

        try {
            return $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId($idumedida);
        }
        catch (Exception $e) {
            
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
    public function getUMedidaIndicador($idindicador) {

        try {
            return $this->integrator->datosmaestros->getUMedidaIndicador($idindicador);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve todas las unidades de medidas
     *
     * se accede a traves de configuracion
     *
     * @return array
     */
    public function listarUnidadesMedidaTodas() {

        try {
            return $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        }
        catch (Exception $e) {
            
        }
    }

    public function listarUnidadesMedida($idMagnitud) {
        try {
            return $this->integrator->datosmaestros->listarUnidadesMedida($idMagnitud);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve todos los paises de una entidad
     *
     * se accede a traves de configuracion
     *
     * @return array
     */
    public function obtenerPaisesEntidad() {
        try {
            return $this->integrator->datosmaestros->obtenerPaises();
        }
        catch (Exception $e) {
            
        }
    }

    public function obtenerPaisXID($idpais) {

        try {
            return $this->integrator->datosmaestros->obtenerPais($idpais);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los js para la busqueda de elementos DPT
     *
     * se accede a traves de configuracion
     *
     * @return js
     */
    public function mostrarIUBuscarDPT() {

        try {
            return $this->integrator->datosmaestros->mostrarIUBuscarDPT();
        }
        catch (Exception $e) {
            
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
    public function obtenerDatosArbolNaturaleza($nodo) {

        try {
            return $this->integrator->datosmaestros->obtenerDatosArbolNaturaleza($nodo);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los datos de marca-modelo
     *
     * se accede a traves de parametros
     *
     * @return array
     */
    public function obtenerDatosArbolMarcaModelo($parametros) {

        try {
            return $this->integrator->datosmaestros->obtenerDatosArbolMarcaModelo($parametros);
        }
        catch (Exception $e) {
            
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
    public function buscarFormatosPorSubsist($idestructura = null, $idsubsistema) {

        try {
            return $this->integrator->datosmaestros->buscarFormatosPorSubsist(
                            ($idestructura == null) ? $this->varglobal->Estructura->idestructura :
                                    $idestructura, $idsubsistema
            );
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los formatos
     *
     * se accede a traves de parametros
     *
     * @return array
     */
    public function buscarFormato() {

        try {
            return $this->integrator->datosmaestros->buscarFormato();
        }
        catch (Exception $e) {
            
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
    public function buscarParteFormato($idformato) {

        try {
            return $this->integrator->datosmaestros->buscarParteFormato($idformato);
        }
        catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function buscarFormatoPorID($idFormato) {
        try {
            return $this->integrator->datosmaestros->buscarFormatoPorID($idFormato);
        }
        catch (Exception $e) {
            
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
    public function obtenerDatosArbolUM($idmagnitud) {

        try {
            return $this->integrator->datosmaestros->obtenerDatosArbolUM($idmagnitud);
        }
        catch (Exception $e) {
            
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
    public function obteneCualquierGrupoPorID($idpadre) {

        try {
            return $this->integrator->datosmaestros->obteneCualquierGrupoPorID($idpadre);
        }
        catch (Exception $e) {
            
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
    public function obteneCualquierGruposHijoPorID($idgruposubgrupo) {

        try {
            return $this->integrator->datosmaestros->obteneCualquierGruposHijoPorID($idgruposubgrupo);
        }
        catch (Exception $e) {
            
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
    public function obtenerMiPadre($idgruposubgrupo) {

        try {
            return $this->integrator->datosmaestros->obtenerMiPadre($idgruposubgrupo);
        }
        catch (Exception $e) {
            
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
    public function getDocumentosPorSubsistema($idsubsistema) {

        try {
            return $this->integrator->datosmaestros->documentosPorSubsistema($idsubsistema);
        }
        catch (Exception $e) {
            
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
    public function dameQueryJoinNomIndicadores($query, $aliastabla, $aliasrama, $aliashoja, $tipodejoin, $parametros) {

        try {
            return $this->integrator->datosmaestros->dameQueryJoinNomIndicadores(
                            $query, $aliastabla, $aliasrama, $aliashoja, $tipodejoin, $parametros
            );
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los js para la ver la ventana de indicadores
     *
     * se accede a traves de parametros
     *
     * @return js
     */
    public function obtenerJSVentanaIndicadores() {
        try {
            return $this->integrator->datosmaestros->obtenerJSVentanaIndicadores();
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve los js para mostrar los detalles de los indicadores
     *
     * se accede a traves de parametros
     *
     * @return js
     */
    public function getWinMostrarDetallesIndicador() {

        try {
            return $this->integrator->datosmaestros->getWinMostrarDetallesIndicador();
        }
        catch (Exception $e) {
            
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
    public function getTipoDocumentoById($iddocumento) {

        try {
            return $this->integrator->datosmaestros->tipoDocumentoById($iddocumento);
        }
        catch (Exception $e) {
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
    public function obtenerPeriodo($idperiodo) {

        try {
            return $this->integrator->datosmaestros->obtenerPeriodo($idperiodo);
        }
        catch (Exception $e) {
            
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
    public function obtenerPeriodos($idejercicio) {

        try {
            return $this->integrator->datosmaestros->obtenerPeriodos($idejercicio);
        }
        catch (Exception $e) {
            
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
    public function tipoDocumentoByAliasByIdestructutra($alias, $identidad, $subsistema) {
        try {
            return $this->integrator->datosmaestros->tipoDocumentoByAliasByIdestructutra(
                            $alias, $identidad, $subsistema
            );
        }
        catch (Exception $e) {
            $query = "select dp.iddoc, d.denominacion, d.abreviatura
                            from mod_datosmaestros.nom_docprim d
                            inner join mod_datosmaestros.dat_documentoprim dp on d.iddocumentos = dp.iddocumentos
                            inner join mod_datosmaestros.dat_estructurasubsist es on dp.idestructurasubsist = es.idestructurasubsist
                        where es.idsubsistema = {$subsistema} AND d.abreviatura = '{$alias}' AND es.idestructuracomun = {$identidad}";
            $arrayData = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($query);
            return LogisticaObjectHelper::__init()->getStdClassFromArray($arrayData[0]);
        }
    }

    public function getDocumentsByParams($alias) {

        try {
            return $this->integrator->datosmaestros->getDocumentsByParams($alias);
        }
        catch (Exception $e) {
            
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
    public function tipoDocumentoPorCategoriaByIdestructutra($alias, $identidad, $subsistema) {

        try {
            return $this->integrator->datosmaestros->tipoDocumentoPorCategoriaByIdestructutra(
                            $alias, $identidad, $subsistema
            );
        }
        catch (Exception $e) {
            
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
    public function documentosPorSubsistemaEntidad($idsubsistema, $idestructura, $filtro = array()) {

        try {
            return $this->integrator->datosmaestros->documentosPorSubsistemaEntidad(
                            $idsubsistema, $idestructura, $filtro
            );
        }
        catch (Exception $e) {
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
    public function getEjercicioActualSubsistema($idestructura, $idsubsistema) {

        try {
            return $this->integrator->datosmaestros->ejercicioActualSubsistema($idestructura, $idsubsistema);
        }
        catch (Exception $e) {
            return $e->getMessage();
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
    public function obtenerEjercicio($idejercicio, $idestructura = null) {

        try {
            return $this->integrator->datosmaestros->obtenerEjercicio($idejercicio, $idestructura);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve el periodo actual de un subsistema
     *
     * @param  $idestructura , $idsubsistema
     *
     * @return numeric
     */
    public function getPeriodoActualSubsistema($idestructura, $idsubsistema, $devolverdatos) {

        try {
            return $this->integrator->datosmaestros->periodoActualSubsistema(
                            $idestructura, $idsubsistema, $devolverdatos
            );
        }
        catch (Exception $e) {
            
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
    public function getPrimerPeriodo($idejercicio) {

        try {
            return $this->integrator->datosmaestros->primerPeriodo($idejercicio);
        }
        catch (Exception $e) {
            
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
    public function getFechaContableSubsistemaObj($idestructura, $idsubsistema) {

        try {
            return $this->integrator->datosmaestros->fechaContableSubsistemaObj($idestructura, $idsubsistema);
        }
        catch (Exception $e) {
            
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
    public function fechaContableSubsistema($idestructura, $idsubsistema) {

        try {
            return $this->integrator->datosmaestros->fechaContableSubsistema($idestructura, $idsubsistema);
        }
        catch (Exception $e) {
            
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
    public function Contabilizar($descripcion, $asientos, $idsubsistema, $idestructura, $idperiodo, $fecha) {

        try {
            return $this->integrator->datosmaestros->contabilizar(
                            $descripcion, $asientos, $idsubsistema, $idestructura, $idperiodo, $fecha
            );
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para obtener la moneda contable
     * se accede a traves de parametros
     *
     * @return stdClass
     */
    public function buscarMonedaContable() {

        try {
            return $this->integrator->datosmaestros->buscarMonedaContable();
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para obtener la moneda contable
     * se accede a traves de parametros
     * @params $numero,$idestructura
     *
     * @return array
     */
    public function buscarMoneda($numero, $idestructura) {

        try {
            return $this->integrator->datosmaestros->buscarMoneda($numero, $idestructura);
        }
        catch (Exception $e) {
            
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
    public function buscarIdMonedaEntidad($idmonedacontable, $idestructura) {

        try {
            return $this->integrator->datosmaestros->buscarIdMonedaEntidad($idmonedacontable, $idestructura);
        }
        catch (Exception $e) {
            
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
    public function calcImpMonBaseByEntidad($idmoneda, $importe, $idestructura) {

        try {
            return $this->integrator->datosmaestros->calcImpMonBaseByEntidad($idmoneda, $importe, $idestructura);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo para clcular el importe de cualquier moneda a la moneda contable
     *
     * @param $idnommonedaentidad , $importmonorig
     *
     * @return double
     */
    public function calcImpMonBase($idnommonedaentidad, $importmonorig) {

        try {
            return $this->integrator->datosmaestros->calcImpMonBase($idnommonedaentidad, $importmonorig);
        }
        catch (Exception $e) {
            
        }
    }

    public function obtenerCondicionesPago() {
        try {
            return $this->integrator->datosmaestros->obtenerCondicionesPago();
        }
        catch (Exception $e) {
            
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
    public function buscarTasaActual($idmoneda) {

        try {
            return $this->integrator->datosmaestros->buscarTasaActual($idmoneda);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve un objeto de la clase
     * se accede a traves de parametros
     *
     * @return obj
     */
    public function getInstanceClass() {

        try {
            return $this->integrator->datosmaestros->getInstanceClass();
        }
        catch (Exception $e) {
            
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
    public function obtenerEspecialidadPorId($idespecialidad) {

        try {
            return $this->integrator->datosmaestros->obtenerEspecialidadPorId($idespecialidad);
        }
        catch (Exception $e) {
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
    public function cerrarPeriodo($identidad, $idsubsitema) {

        try {
            return $this->integrator->datosmaestros->cerrarPeriodo($identidad, $idsubsitema);
        }
        catch (Exception $e) {
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
    public function cerrarEjercicio($identidad, $idsubsitema) {

        try {
            return $this->integrator->datosmaestros->cerrarEjercicio($identidad, $idsubsitema);
        }
        catch (Exception $e) {
            throw $e;
        }
    }

    /**
     *
     * @return type
     */
    public function obtenerEspecialidadesHojas() {
        try {
            return $this->integrator->datosmaestros->obtenerEspecialidadesHojas();
        }
        catch (Exception $e) {
            
        }
    }

    public function obtenerEspecialidades($parametros = array()) {
        $idusuario = isset($parametros['idusuario']) ? $parametros['idusuario'] :
                ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;
        $sql = "select distinct e.*,(select count('idusuarioespecialidad') > 0 "
                . "from mod_logistica.conf_usuarioespecialidad c "
                . "where c.idespecialidad = e.idespecialidad and c.idusuario ={$idusuario}) as selected "
                . "from mod_datosmaestros.nom_especialidad e ";
        $sqlCount = "select e.idespecialidad from mod_datosmaestros.nom_especialidad e ";
        $arrayWhere = array();
        array_push($arrayWhere, '(e.fechaini::date <= now() or e.fechaini is null)');
        array_push($arrayWhere, 'e.controlmaterial = 1');
        if (!isset($parametros['restringir']) || $parametros['restringir'] != 0) {
            $sql.= "inner join mod_logistica.conf_usuarioespecialidad ue "
                    . "on ue.idespecialidad = e.idespecialidad";
            $sqlCount.= "inner join mod_logistica.conf_usuarioespecialidad ue "
                    . "on ue.idespecialidad = e.idespecialidad";
            array_push($arrayWhere, "ue.idusuario = {$idusuario}");
        }
        if ($parametros['criterio']) {
            array_push($arrayWhere, "e.denespecialidad ilike '%{$parametros['criterio']}%'");
        }
        $sql.= " where " . implode(' and ', $arrayWhere);
        $sqlCount.= " where " . implode(' and ', $arrayWhere);
        $sql.= ' order by e.denespecialidad asc';
        if (isset($parametros['start'])) {
            $sql.= " offset {$parametros['start']} limit {$parametros['limit']}";
        }
        $_data = array(
            'cantidad' => LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlCount)->rowCount(),
            'datos' => LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql)
        );
        return isset($parametros['gridSearch']) ? $_data : $_data['datos'];
    }

    /* Metodo que devuelve si jna entidad solo tiene moneda contable
     * se accede a traves de parametros
     * @param identidad
     * @return boolean
     */

    public function soloMonedaCont($identidad) {

        try {
            return $this->integrator->datosmaestros->soloMonedaCont($identidad);
        }
        catch (Exception $e) {
            
        }
    }

    /* Metodo que devuelve si jna entidad solo tiene moneda contable
     * se accede a traves de parametros
     * @param idsucursal
     * @return stdClass
     */

    public function obtenerSucursalPorId($idsucursal) {

        try {
            return $this->integrator->datosmaestros->obtenerSucursalPorId($idsucursal);
        }
        catch (Exception $e) {
            
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
    public function monedaContableEntidad($identidad) {
        try {
            return $this->integrator->datosmaestros->monedaContableEntidad($identidad);
        }
        catch (Exception $e) {
            
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
    public function obtenerMonedaContablePorEntidad() {

        try {
            return $this->integrator->datosmaestros->buscarMonedaContable();
        }
        catch (Exception $e) {
            
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
    public function buscarMonedaAlternativa($identidad) {

        try {
            return $this->integrator->datosmaestros->buscarMonedaAlertnativa($identidad);
        }
        catch (Exception $e) {
            
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
    public function innerJoinDocumentoPrim($query, $aliasLocal, $aliasDocPrim = 'dp') {

        try {
            return $this->integrator->datosmaestros->innerJoinDocumentoPrim($query, $aliasLocal, $aliasDocPrim);
        }
        catch (Exception $e) {
            
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
    public function obtenerSubsistemasFnz($idestructura) {

        try {
            return $this->integrator->datosmaestros->obtenerSubsistemasFnz($idestructura);
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve todas las unidades de medidas
     * se accede a traves de parametros
     *
     * @return arbol
     */
    public function obtenerCategoriasUM() {

        try {
            return $this->integrator->datosmaestros->obtenerCategoriasUM();
        }
        catch (Exception $e) {
            
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
    public function existeMonedaAlertnativa($idestructura = null) {

        try {
            return $this->integrator->datosmaestros->existeMonedaAlertnativa(
                            ($idestructura == null) ? $this->global->Estructura->idestructura : $idestructura
            );
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que devuelve las unidades de medida
     * se accede a traves de parametros
     *
     * @return js
     */
    public function obtenerJSArbolUM() {

        try {
            return $this->integrator->datosmaestros->obtenerJSArbolUM();
        }
        catch (Exception $e) {
            
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
    public function getQueryJoinUnidadMedida($query, $aliastableinterna, $aliastablaum, $select, $tipojoin) {

        try {
            return $this->integrator->datosmaestros->getQueryJoinUnidadMedida(
                            $query, $aliastableinterna, $aliastablaum, $select, $tipojoin
            );
        }
        catch (Exception $e) {
            
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
    public function calcularImporteDadoMonedas($idmoneda, $suma, $idestructura, $exception) {

        try {
            return $this->integrator->datosmaestros->calcularImporteDadoMonedas(
                            $idmoneda, $suma, $idestructura, $exception
            );
        }
        catch (Exception $e) {
            
        }
    }

    /**
     * Metodo que convierte un importe de calquier moneda
     * a la moneda base
     * 
     *
     * @param $idmoneda(la del nomenclador) ,$importe, $idestructura
     *
     * @return numeric
     */
    public function calcularImporteMoneda($idmoneda, $importe, $idestructura) {

        try {
            return $this->integrator->datosmaestros->calcularImporteMoneda($idmoneda, $importe, $idestructura);
        }
        catch (Exception $e) {
            return $e->getMessage();
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
    public function getIndicadoresTreeConHojas($params) {

        try {
            return $this->integrator->datosmaestros->getIndicadoresTreeConHojas($params);
        }
        catch (Exception $e) {
            
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
    public function getArrIndicadoresDescendencia($idarbol, $ordenizq, $ordender, $naturalezas) {

        try {
            return $this->integrator->datosmaestros->getArrIndicadoresDescendencia(
                            $idarbol, $ordenizq, $ordender, $naturalezas
            );
        }
        catch (Exception $e) {
            
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
    public function getActFechContabSubsist($identidad, $idsubsistema) {

        try {
            return $this->integrator->datosmaestros->actFechContabSubsist($identidad, $idsubsistema);
        }
        catch (Exception $e) {
            
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
    public function obtenerNaturalezasAsociadasIndicador($start, $limit, $querywhere) {

        try {
            return $this->integrator->datosmaestros->obtenerNaturalezasAsociadasIndicador($start, $limit, $querywhere);
        }
        catch (Exception $e) {
            
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
    public function queryRootNomNaturaleza($query, $aliastabla) {
        try {
            return $this->integrator->datosmaestros->queryRootNomNaturaleza($query, $aliastabla);
        }
        catch (Exception $e) {
            
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
    public function innerJoinNomNaturaleza($query, $aliasinterno, $aliasexterno, $select) {
        try {
            return $this->integrator->datosmaestros->innerJoinNomNaturaleza(
                            $query, $aliasinterno, $aliasexterno, $select
            );
        }
        catch (Exception $e) {
            
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
    public function encuentraIdestructurasubsist($idsubsistema) {
        try {
            return $this->integrator->datosmaestros->encuentraIdestructurasubsist($idsubsistema);
        }
        catch (Exception $e) {
            
        }
    }

    public function ObtenerDocumentoPrimPorId($iddoc) {
        try {
            return $this->integrator->datosmaestros->obtenerDocumentoPrimPorId($iddoc);
        }
        catch (Exception $exc) {
            
        }
    }

    public function obtenerOperaciones(
    $idestructura, $idsubsitema = null, $iddoc = null, $idoperacion = null, $start, $limit, $filtro
    ) {
        try {
            return $this->integrator->datosmaestros->obtenerOperaciones(
                            $idestructura, $idsubsitema, $iddoc, $idoperacion, $start, $limit, $filtro
            );
        }
        catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function getOperacionesPorId($idoperacion) {
        try {
            return $this->integrator->datosmaestros->operacionesPorId($idoperacion);
        }
        catch (Exception $exc) {
            
        }
    }

    public function getModeloContabilizacion($idModelo) {
        try {
            return $this->integrator->datosmaestros->getModeloContab($idModelo);
        }
        catch (Exception $exc) {
            
        }
    }

    /* Devuelve los clientes y/o proveedores de acuerdo a los parametros. 
     * 
     * @param int  $idCliente    (array)Identificador del cliente y/o proveedor a buscar 
     * @param int  $idEstructura Identificador de la estructura comun 
     * @param bool $cliente      En caso que se quieran obtenere los cliente este parametros se pasa en true 
     * @param bool $proveedor    En caso que se quieran obtenere los proveedores este parametros se pasa en true 
     * @param bool $toArray      En caso que se quieran el resultado en forma de arreglo 
     * @param bool $filtros     Filtra por denominacion y codigo
     * @param int  $start        A partir de tupla se quiera obtener la respuesta 
     * @param int  $limit        Cantidad de elementos a obtener 
     * 
     * @return mixed|array|Doctrine_Record 
     */

    public function getClientesProveedorByParams($idCliente, $idEstructura, $cliente, $proveedor, $filtros, $start, $limit
    ) {
        try {
            if(!is_numeric($idCliente)){
                //$filtros['habilitado'] = 1;
            }
            return $this->integrator->datosmaestros->getClientesProveedorByParams(
                            $idCliente, $idEstructura, $cliente, $proveedor, $filtros, $start, $limit
            );
        }
        catch (Exception $exc) {
            return array(
                'datos' => array(
                    'nombre' => '-',
                    'codigo' => '-',
                    'idcliente' => null,
                )
            );
        }
    }

    public function getCuentasClienteProveedor($idcliente, $cobroPago = true) {
        try {
            return $this->integrator->datosmaestros->getCuentasClientesProveedor($idcliente);
        }
        catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function getJSNomMarcaModelo() {
        try {
            return $this->integrator->datosmaestros->obtenerJSArbolMarcaModelo();
        }
        catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function getJSAtributosDinamicos() {
        try {
            return $this->integrator->datosmaestros->getJSAtributosDinamicos();
        }
        catch (Exception $exc) {
            
        }
    }

    /**
     * Servicio para agrupaciones
     */
    public function getSJArbolAgrupaciones() {
        try {
            return $this->integrator->datosmaestros->getSJArbolAgrupaciones();
        }
        catch (Exception $exc) {
            
        }
    }

    /**
     * Servicio para obtener todas los modelos
     * params:$filtro
     * retunr: array
     */
    public function obtenerModelos($filtro) {
        try {
            return $this->integrator->datosmaestros->obtenerModelos($filtro);
        }
        catch (Exception $exc) {
            
        }
    }

    /**
     * Servicio para obtener todas las marcas
     * param: filtros
     * result: array
     */
    public function obtenerMarcas($filtros) {
        try {
            return $this->integrator->datosmaestros->obtenerMarcas($filtros);
        }
        catch (Exception $exc) {
            
        }
    }

    /**
     * Servicio que devuelve NomClienteproveedore como tabla root
     * para poder hacer innerjoin
     * param: $aliasLocal(alias de la tabla nomClienteProveedores)
     * result: query
     */
    public function getQuery($aliasLocal) {
        try {
            return $this->integrator->datosmaestros->getQuery($aliasLocal);
        }
        catch (Exception $exc) {
            
        }
    }

    /**
     * Servicio que devuelve los atributos dinamicos
     * de las agrupaciones dado los indicadores
     * $filtro: Los id de los indicadores
     */
    public function getAtributosAgrupacionIndicador($filtro) {
        try {
            return $this->integrator->datosmaestros->getAtributosAgrupacionIndicador($filtro);
        }
        catch (Exception $exc) {
            
        }
    }

    /*
     * Devulve el identificador del cliente 
     * si el usuario logeado es un cliente
     */

    public function getClienteProveedorByUser($idusuario) {
        try {
            return $this->integrator->datosmaestros->getClienteProveedorByUser($idusuario);
        }
        catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    /**
     * Servicio para realizar la seleccion con Operaciones
     * $dql: Doctrine_dql
     * $asLoc: alias local
     */
    public function addQuerySelectOperacion($dql, $asLoc) {
        try {
            return $this->integrator->datosmaestros->addQuerySelectOperacion($dql, $asLoc);
        }
        catch (Exception $exc) {
            
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
    public function addQueryJoinOperacion($dql, $asExt, $asLoc, $join) {
        try {
            return $this->integrator->datosmaestros->addQueryJoinOperacion($dql, $asExt, $asLoc, $join);
        }
        catch (Exception $exc) {
            
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
    public function getNaturalezasAsociadasIndicadores($start, $limit, $filtro) {
        try {
            return $this->integrator->datosmaestros->getNaturalezasAsociadasIndicadores($start, $limit, $filtro);
        }
        catch (Exception $exc) {
            die($exc);
        }
    }

    public function getObjEstructSubsisById($idEstructuraSubsist) {
        try {
            return $this->integrator->datosmaestros->getObjEstructSubsisById($idEstructuraSubsist);
        }
        catch (Exception $exc) {
            
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
    public function obtenerMonedasPorEntidad($identidad) {

        try {
            return $this->integrator->datosmaestros->obtenerMonedasPorEntidad($identidad);
        }
        catch (Exception $e) {
            
        }
    }

    public function getOrganismos($parametros) {

        try {
            return $this->integrator->datosmaestros->getOrganismos($parametros);
        }
        catch (Exception $e) {

        }
    }

}
