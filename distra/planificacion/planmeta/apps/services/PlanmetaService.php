<?php

class PlanmetaService {

    public function initComponent() {
        return true;
    }

    public function actualizarPrecioIndicadores($indicadores, $configColumnas = array(), $rectora = false
    ) {
        return NomIndicador::actualizarPrecioIndicadoresService(
                        $indicadores, $configColumnas, $rectora
        );
    }

    public function obtenerPlanesDadoEntidad($identidades, $filtro
    ) {
        return DatModelo::obtenerPlanesDadoEntidad($identidades, $filtro);
    }

    public function obtenerActividadyNorma($nivel, $idactividad, $filtro, $start, $limit, $hijo
    ) {
        return NomActividad::obtenerActividadyNorma($nivel, $idactividad, $filtro, $start, $limit, $hijo);
    }

    public function actualizarIndicadores($indicadores) {
        return NomIndicador::actualizarIndicadoresService($indicadores);
    }

    /* public function adicionarActualizarIndicadores($indicadores, $configColumnas = array(), $rectora = false
      ) {
      return NomIndicador::adicionarActualizarIndicadores(
      $indicadores, $configColumnas, $rectora
      );
      } */

    public function actualizarActividades($actividades
    ) {
        return NomActividad::actualizarActividadesService($actividades);
    }

    public static function exportarindicadores() {
        //$dirRelApp = Zend_Registry::get('config')->uri_aplication;
        $dirController = '/planificacion/planmeta/index.php/exportarindicadores/exportarindicadores';
        header("Location: $dirController");
    }

    //obtiene un organo que satisface dado un id
    public function ObtenerDenomOACEporId($idorganosatisface) {
        return NomOrganosatisface::ObtenerDenomOACEporId($idorganosatisface);
    }

    //obtiene todos los organos que satisfacen
    public function obtenerOS() {
        return NomOrganosatisface::obtenerOS();
    }

    //obtiene todas las vias de adquisicion
    public function Obtener_via_adquisicion() {
        return NomViaadquisicion::Obtener_via_adquisicion();
    }

    //obtiene los datos de la via que especifica el id
    public function obtenerViaDadoId($idvia) {
        return NomViaadquisicion::obtenerViaDadoId($idvia);
    }

    //obtiene los modelos asociados a una estructura
    public function obtenerModelos($idEstructura) {
        return DatEntidadmodelo::servBP_getModeloAsocEntidad($idEstructura);
    }

    //obtiene los modelos asociados a una estructura
    public function obtenerCentrosDeBalance($arrayentidades) {
        return DatEntidaddatosnomenclador::getCentrosDeBalance($arrayentidades);
    }

    //obtiene los desgloses de actividades por fecha
    public function obtenerActividadesPorFecha($identidad, $fechaInicio, $fechaFin) {
        return DatNivelactividadporfecha::servicioObtenerActividadesPorFecha($identidad, $fechaInicio, $fechaFin);
    }

    public function obtenerIndicadoresPorFecha($identidad, $fechaInicio, $fechaFin) {
        return DatPlanificacionporfecha::servicioObtenerIndicadoresPorFecha($identidad, $fechaInicio, $fechaFin);
    }

//obtiene el iddatosnomenclador dado uridatosnomenclador
    public function obtenerDatosNomencladorUriDato($uridatonom) {
        return NomDatosnomenclador::getDatosNomPorUriDatosNom($uridatonom);
    }

    public function obtenerDatosNomencladorUriTipoNom($uritiponomenclador, $uridato = false, $excluir = false) {
        return NomDatosnomenclador::getDatosNomPorUriTipoNom($uritiponomenclador, $uridato, $excluir);
    }

    //servicio que permite obtener los datosnomencladores 
    //de un tipo de nomenclador dado excluyendo los elementos solicitados
    public function servObtenerDatosNomencladorUriTipoNomIdExcluir($uritiponomenclador, $excluir) {
        return NomDatosnomenclador::servObtenerDatosNomencladorUriTipoNomIdExcluir($uritiponomenclador, $excluir);
    }

    //obtiene el ejercicio de planificación actual
    public function obtenerEjercicioActual() {
        return NomEjercicioplanificacion::servicioObtenerEjercicioActual();
    }

    //obtiene el listado de ejercicios de planificación
    public function obtenerEjercicios($uriestado = false, $idejercicio = null) {
        return NomEjercicioplanificacion::servicioObtenerEjercicios($uriestado, $idejercicio);
    }

    //obtiene el listado de todos los ejercicios anteriores hasta el que este definido como actual (incluyéndolo)
    public function obtenerEjercicioActualYAnteriores($excluirActual = false) {
        return NomEjercicioplanificacion::servicioObtenerEjercicioActualYAnteriores($excluirActual);
    }

    //obtiene los modelos que corresponden al negocio especificado
    public function obtenerTipoModeloNegocio($negocio) {
        return NomTipomodelo::servicioObtenerTipoModelo($negocio);
    }

    //obtiene la entidad rectora
    public function obtenerEntidadRectora() {
        return DatEntidaddatosnomenclador::obtenerEntidadRectora();
    }

    //obtiene los datos del tipo de modelo
    public function obtenerDatosTipoModelo($idtipomodelo) {
        return NomTipomodelo::getDenominacionDadoIdTipoModelo($idtipomodelo);
    }

    //obtiene la configuración de los grid dinámicos
    public function obtenerConfiguracionGridInterfaces($idtipomodelo) {
        return DatPlanModel::GetGridInterfaces($idtipomodelo);
    }

    //obtiene el valor por defecto de datonomenclador
    public function obtenerDatonomencladorPorDefecto($idtiponomenclador) {
        return NomDatosnomenclador::obtenerDatosPrimero($idtiponomenclador);
    }

    //obtiene las especialidades
    public function obtenerEspecialidades() {
        return DatActividadentidad::obtenerEspecialidadesAct();
    }

    //obtiene...
    public function listarTiposNomencladoresXEsp($idespecialidad) {
        return DatConftiponomesp::listarTiposNomencladoresXEsp($idespecialidad);
    }

    //obtiene las normas de una actividad dado el idejercicio, el idactividad, y los filtros en un arreglo
    public function ObtenerNormasSegunActividad($params) {
        return DatNormaModel::listarNormasPorActividad($params);
    }

//obtiene el valor de la planificacion
    public function listarDatosdePlan($identidad, $idmodelo, $start, $limit, $global) {
        return DatModeloModel::listarDatosdePlan($identidad, $idmodelo, $start, $limit, $global);
    }

    //obtiene el idactividadentidad
    public function obtenerIdActividadEntidad(
            $identidad, $idactividad, $idejercicio, $conAsocManual = false, $conAsocAuto = false, $conAsocProd = false
    ) {
        return DatActividadentidad::buscarXEjercicio(
                        $identidad, $idactividad, $idejercicio, $conAsocManual, $conAsocAuto, $conAsocProd
        );
    }

    // obtener el iddatonomenclador de la relacion especialidad-actividad
    public function obtenerIdDatosNomEspComp($resultSinindices = false) {
        return DatActespcomportamiento::obtenerIdDatosNom($resultSinindices);
    }

    // crear la asociación de actividad-entidad
    public function crearAsociacionActEnt($idactividad, $arrayIddatosnomenclador, $idespecialidadDemandante, $identidad, $idejercicio) {
        return DatActividadentidadModel::crearAsociacionActEnt($idactividad, $arrayIddatosnomenclador, $idespecialidadDemandante, $identidad, $idejercicio);
    }

    //Para insertar los NA automáticos
    public function actualizarAsociacionesNAAutomatico(
            $idactividadGeneradora, $identidad, $idespecialidadDemandante, $arrayIddatosnomenclador, $idejercicio
    ) {
        return DatActividadentidadModel::actualizarAsociacionesAutomaticas($idactividadGeneradora, $identidad, $idespecialidadDemandante, $arrayIddatosnomenclador, $idejercicio);
    }

    //obtener ejercicio dada denominacion ejercicio
    public function servicioObtenerEjercicioPorDenom($demonejercicio) {
        return NomEjercicioplanificacion::servicioObtenerEjercicioPorDenom($demonejercicio);
    }

    public function gestPermisos($params) {
        return DatDocumentoaprobacioModel::gestPermisos($params);
    }

    //Servicio para obtener los permisos de una funcionalidad,
    //en una entidad, en un ejercicio para el estado
    //que tiene definido el mismo
    public function obtenerPermisos($idfuncionalidad, $identidad, $idejercicio) {
        return DatControlpermiso::obtenerPermisosxEntidad($idfuncionalidad, $identidad, $idejercicio);
    }

    public function obtenerCBalanceByEntidad($identificador) {
        return DatEntidaddatosnomenclador::getIdEntidadByIdNomen($identificador);
    }

    public function servGetNomencladoresHijos($uripadre) {
        return NomNomenclador::servGetNomencladoresHijos($uripadre);
    }

    //Servicio para obtener un array de los identificadores 
    //de los hijos de un nomenclador deterinado dado su uri
    public function servGetIdNomencladoresHijos($uripadre) {
        return NomNomenclador::servGetIdNomencladoresHijos($uripadre);
    }

    public function servGetNomencladoresRama($uripadre, $excluirPadre) {
        return NomNomenclador::servGetNomencladoresRama($uripadre, $excluirPadre);
    }

    public function servGetNomencladoresById($arrayIdnomenclador) {
        return NomNomenclador::servGetNomencladoresById($arrayIdnomenclador);
    }

    public function servListarNomenclador($node, $idnomencladores) {
        return NomNomenclador::servListarNomenclador($node, $idnomencladores);
    }

    public function servListarNomencladorId($idnomenclador, $idnomencladores) {
        return NomNomenclador::servListarNomencladorId($idnomenclador, $idnomencladores);
    }

    public function servListarNomencladorByIdExcluir($idnomenclador, $idnomencladores) {
        return NomNomenclador::servListarNomencladorByIdExcluir($idnomenclador, $idnomencladores);
    }

    public function servGetNomencladoresByUri($uri) {
        return NomNomenclador::servGetNomencladoresByUri($uri);
    }
    public function servGetNomencladoresByUriIncluir($uri, $uriincluir) {
        return NomNomenclador::servGetNomencladoresByUriIncluir($uri, $uriincluir);
    }

    public function servGetNomencladoresByUriHijoByUriPadre($uriHijo, $uriPadre) {
        return NomNomenclador::servGetNomencladoresByUriHijoByUriPadre($uriHijo, $uriPadre);
    }

    public function servGetNomencladoresHojaFamilia($uri) {
        return NomNomenclador::servGetNomencladoresHojaFamilia($uri);
    }

    public function servObtenerMesesMenorMayor($idejercicio, $iddatosnomenclador, $posteriores) {
        return NomDatosnomenclador::obtenerMesesMenorMayor($idejercicio, $iddatosnomenclador, $posteriores);
    }

    public function servObtenerEntidadesHijasComun($identidad, $denom) {
        return DatActividadentidad::auxObtenerEntidadesHijasComun($identidad, $denom);
    }

    public function auxObtenerEntidadesTodas() {
        return DatActividadentidad::auxObtenerEntidadesTodas();
    }

}
