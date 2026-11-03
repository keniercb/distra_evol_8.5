<?php

class PyeService
{
    private $fuente;
    private $conn;
    private $pIntegrator;
    private $integrator;

    public function __construct()
    {
        $this->pIntegrator = ZendExt_IoC_Inter::getInstance();
        $this->integrator = ZendExt_IoC::getInstance();
        $dmInstance = Doctrine_Manager::getInstance();
        $this->conn = $dmInstance->getCurrentConnection();
    }

    public function PyeService()
    {
        $pI = new ZendExt_IoC_Inter();
    }

    /**
     * Servicio que implementa el retornpo de js de extensiones
     *
     * @author rygarcia
     * @return direccion de un js
     */
    function extensionesPLAN()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/extensiones/extensionesIntegracion.phtml';
        return file_get_contents($dir_phtml);
    }

    /**
     *
     * Servicio que implementa el retornpo los js de los elementos comunes de prospectiva
     * @author ammejias
     * @return direccion de un js
     */
    function pyeComun()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/pyecomun/integracioncomun.phtml';
        return file_get_contents($dir_phtml);
    }

    /**
     *
     * Servicio que implementa el retorno de los js de los elementos fmpeir de pye
     * @author Ing Rubier Sorio Pazos
     * @return direccion de un js
     */
    function fmpeirComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/fmpeir/fmpeirComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    /**
     *
     * Servicio que implementa el retorno de los js de los elementos fmpeir de pye
     * @author Ing Rubier Sorio Pazos
     * @return direccion de un js
     */
    function fmepeirmatrizComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/fmpeirmatriz/fmepeirmatrizComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function curvaconflictoComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/curvaconflicto/curvaconflictoComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function causaefectoComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/causaefecto/causaefectoComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function impactocruzadoComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/impactocruzado/impactocruzadoComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function matrizrelacionesComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/matrizrelaciones/matrizrelacionesComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function matrizdofaComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/matrizdofa/matrizdofaComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function gestioncriterios()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/gestioncriterios/gestioncriterios.phtml';
        return file_get_contents($dir_phtml);
    }

    function mapComponent()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/map/mapComponent.phtml';
        return file_get_contents($dir_phtml);
    }

    function ganttComponet()
    {
        $dir_apps = Zend_Registry::getInstance()->config->dir_aplication;
        $dir_phtml = $dir_apps . '/planificacion/herramientasintegracion/views/scripts/gantt/ganttComponet.phtml';
        return file_get_contents($dir_phtml);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @param $estudioModel : Clase modelo para obtener los datos
     * @param $idProyecto : Identificador del proyecto al que pertenece la situación actual
     * @return mixed
     */
    function getEstudioByProyecto($estudioModel, $idProyecto)
    {
        return PyecomunModel::getEstudioByProyecto($estudioModel, $idProyecto);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @param $sujetoFila : Denominación del sujeto que corresponde a la variable fila de la matriz de impacto cruzado
     * @param $sujetoColumna : Denominación del sujeto que corresponde a la variable columna de la matriz de impacto cruzado
     * @param $idProyecto : Identificador del proyecto asociado a la situación actual
     * @return mixed
     */
    function getSujetosImpacto($sujetoFila, $sujetoColumna, $idProyecto)
    {
        return PyecomunModel::getSujetosImpacto($sujetoFila, $sujetoColumna, $idProyecto);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @param $tabla : Tabla que contiene los datos a obtener
     * @return mixed
     */
    function getNomenclador($tabla)
    {
        return PyecomunModel::getNomenclador($tabla);
    }

    function getResultadosProyecto($idproyecto)
    {
        $proyecto = DatEstudiomatrizdanalisispoliticoModel::getProyectoProyectoMap($idproyecto);
        $fuerzas = DatEstudiomatrizdanalisispoliticoModel::obtenerDatosMatriz($proyecto[0]['idestudiomatrizdanalisispolitico']);
        $resultado = DatEstudiomatrizdanalisispoliticoModel::generarResultado($fuerzas, $proyecto[0]['idestudiomatrizdanalisispolitico']);
        $factinstitucional = 'Factible';
        $facthecho = 'Factible';
        $estabilidad = 'Estable';
        $solidez = 'Hay concenso';
        foreach ($resultado['result']['factibilidadinstitucional'] as $factibilidadinstitucional) {
            if ($factibilidadinstitucional['vim']) {
                if ($factibilidadinstitucional['fuerzasatrazar'] && count($factibilidadinstitucional['fuerzasatrazar']) > 0) {
                    $factinstitucional = 'Factible, pero requiere transacción';
                } else {
                    $factinstitucional = 'No es factible';
                    break;
                }
            }
        }
        foreach ($resultado['result']['factibilidadhecho'] as $factibilidadhecho) {
            if ($factibilidadhecho['vim']) {
                if ($factibilidadhecho['fuerzasatrazar'] && count($factibilidadhecho['fuerzasatrazar']) > 0) {
                    $facthecho = 'Factible, pero requiere transacción';
                } else {
                    $facthecho = 'No es factible';
                    break;
                }
            }
        }
        foreach ($resultado['result']['estabilidad'] as $testestabilidad) {
            if ($testestabilidad['ncm']) {
                if ($testestabilidad['fuerzascompulsion'] && count($testestabilidad['fuerzascompulsion']) > 0) {
                    $estabilidad = 'Estable, pero requiere compulsión';
                } else {
                    $estabilidad = 'No es estable';
                    break;
                }
            }
        }
        foreach ($resultado['result']['solidez'] as $testsolidez) {
            if ($testsolidez['solidez'] <= 0) {
                $solidez = 'No hay concenso';
            }
        }
        return array('factinstitucional' => $factinstitucional, 'facthecho' => $facthecho, 'estabilidad' => $estabilidad, 'solidez' => $solidez);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Reyner Labrada Sablon
     * @param $idProyecto : Id del proyecto de la matriz
     * @return mixed
     */
    public function getMatrixTexts($idProyecto)
    {
        try {
            return DatEstudiomatrizrelacionModel::getMatrixTexts($idProyecto);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function updateText($idText, $value)
    {
        try {
            return DatEstudiomatrizrelacionModel::updateText($idText, $value);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function deleteText($idText)
    {
        try {
            return DatEstudiomatrizrelacionModel::deleteText($idText);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausasByEstudio
     * @param $idEstudio : Identificador del estudio
     * @param $estudio : Tipo de estudio
     * @param $start : Inicio de la selecciona de datos
     * @param $limit : Cantidad de elementos a seleccionar
     * @return mixed
     */
    public function getCausasByEstudio($idEstudio, $estudio, $start, $limit)
    {
        $causas = array();
        if ($estudio == 'estudiocausaefecto')
            $causas = DatCausaModel::getCausasByEstudio($idEstudio, $start, $limit);
        elseif ($estudio == 'estudiomatrizimpacto')
            $causas = DatEstudiomatrizimpactocruzadoModel::getCausasByEstudio($idEstudio, $start, $limit);
        return $causas;
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausaDenominacion
     * @param $estudio :Estudio asociado
     * @param $idEstudio :Identificador del estudio
     * @param $idCausa : Identificador de la causa
     * @return mixed
     */
    public function getCausaDenominacion($estudio, $idEstudio, $idCausa)
    {
        if ($estudio == 'dece') {
            return DatCausaModel::getCausaDenominacion($idCausa);
        } else return DatEstudiomatrizimpactocruzadoModel::getCausaDenominacion($idEstudio, $idCausa);
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getDatosGraficoflujo
     * @param $idEstudio :identificador del estudio
     * @param $variables :Arreglo con los identificadores de las variables
     * @return array
     */
    public function getDatosGraficoflujo($idEstudio, $variables)
    {
        return DatEstudiomatrizimpactocruzadoModel::obtenerdatosgraficoflujo($idEstudio, $variables);
    }

    public function saveProyecto($objeto, $concepto)
    {
        $model = new DatProyectoModel();
        $_response = $model->saveProyecto($objeto, $concepto);
        return $_response;
    }

    //Se utiliza para crear las herramientas por proyectos dependiendo del tipo de herramienta que sea.
    public function getMatrizXproyecto($idproyectoplanificacion, $denominacion, $columnas, $filas, $datos, $tipoconcepto)
    {
        try {
//            $datos = '[{"column":"Involucrado1","row":"Actividad2","value":"X"},{"column":"Involucrado3","row":"Actividad2","value":"X"}]';
            $datos1 = array();
            $datos1['cells'] = $datos;
            $a = new PlanificacionintegracionModel();
            $nomenclador = $this->pIntegrator->planificacion->obtenerDatosNomencladorUriDato($tipoconcepto);
            $iddatosnomenclador = $nomenclador[0]['iddatosnomenclador'];
            $matrices = $a->getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador);
            if ($matrices && $matrices[0]['idestudioherramienta']) {
                echo json_encode(array('idproyecto' => $matrices[0]['idestudioherramienta'], 'datos' => $datos1, 'filas' => $filas, 'columnas' => $columnas));
                return;
            } else {
                $concepto = array('concepto' => 'DatEstudiomatrizrelacion', 'campoid' => 'idestudiomatrizrelacion', 'nativo' => false);
                $objeto = array('add' => array(array('idproyecto' => '', 'denominacion' => 'Matriz' . $denominacion, 'descripcion' => '', 'fechaini' => '', 'fechafin' => '')), 'del' => array(), 'mod' => array());
                foreach ($columnas as $obj) {
                    $columna['denominacion'] = $obj['denominacion'];
                    $columna['descripcion'] = ($obj['descripcion']) ? $obj['descripcion'] : $obj['denominacion'];
                    $columna['fila'] = false;
                    $filas_columnas[] = $columna;
                }
                foreach ($filas as $obj1) {
                    $fila['denominacion'] = $obj1['denominacion'];
                    $fila['descripcion'] = ($obj1['descripcion']) ? $obj1['descripcion'] : $obj1['denominacion'];
                    $fila['fila'] = true;
                    $filas_columnas[] = $fila;
                }
                $proyecto = $this->saveProyecto($objeto, $concepto);
                $insert = $a->saveMatricesPlanificacion($idproyectoplanificacion, $proyecto['idproyecto'], 'idestudioherramienta', $iddatosnomenclador);
                $datos['idestudiomatrizrelacion'] = $proyecto['idproyecto'];
                $datos['idproyecto'] = $idproyectoplanificacion;
                if ($insert) {
                    echo json_encode(array('filas_columnas' => $filas_columnas, 'idproyecto' => $proyecto['idproyecto'], 'datos' => $datos1, 'filas' => $filas, 'columnas' => $columnas));
                    return;
                } else {
                    echo json_encode(array('success' => false, 'codMsg' => 4));
                    return;
                }
            }
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    //Actualizar Modificar datos de la matriz.
    public function insertUpdateDatosMatriz($idproyectoplanificacion, $datos, $tipoconcepto)
    {

        $datos = Zend_Json_Decoder::decode($datos);
        $datos['cells'] = $datos;
        $a = new PlanificacionintegracionModel();
        $modelo = new DatEstudiomatrizrelacionModel();
        $nomenclador = $this->pIntegrator->planificacion->obtenerDatosNomencladorUriDato($tipoconcepto);
        $iddatosnomenclador = $nomenclador[0]['iddatosnomenclador'];
        $matrices = $a->getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador);
        if (!empty($datos)) {
            $arreglo = $modelo->getConfig($matrices[0]['idestudioherramienta']);
            foreach ($datos['cells'] as $key => $value) {
                foreach ($arreglo['columns'] as $key1 => $value1) {
                    if ($value['column'] == $value1['denominacion']) {
                        $datos['cells'][$key]['column'] = $arreglo['columns'][$key1]['idcolumnafila'];
                    }
                }
                foreach ($arreglo['rows'] as $key1 => $value1) {
                    if ($value['row'] == $value1['denominacion']) {
                        $datos['cells'][$key]['row'] = $arreglo['rows'][$key1]['idcolumnafila'];
                    }
                }
                if ($value['hibrida']) {
                    if ($value['value']) {
                        $cadena = '{"new":{"new-0":"' . $value['value'] . '"}}';
                        $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                    } else if ($value['value'] == '') {
                        $cadena = '{}';
                        $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                    }
                } else {
                    if ($value['value'] == 'X') {
                        $cadena = '{"new":{"new-0":"X"}}';
                        $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                    } else if ($value['value'] == '') {
                        $cadena = '{}';
                        $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                    }
                }
                $datos['cells'][$key]['value'] = $cadena;
            }
            $datos['idestudiomatrizrelacion'] = $arreglo['config']['idestudiomatrizrelacion'];
            $datos['idproyecto'] = $arreglo['config']['idproyecto'];
            $insert = $modelo->saveCells($datos);
            if ($insert) {
//                echo json_encode(array('idproyecto' => $idproyectoplanificacion, 'idestudiomatrizrelacion' => $matrices[0]["idestudioherramienta"], 'datos' => $datos, 'data' => $insert));
                return;
            } else {
                echo json_encode(array('success' => false, 'codMsg' => 4));
                return;
            }
        }
    }

    public function existeMatrizRecursoXproyecto($idproyectoplanificacion, $tipoconcepto)
    {
        $modelo = new DatEstudiomatrizrelacionModel();
        $a = new PlanificacionintegracionModel();
        $nomenclador = $this->pIntegrator->planificacion->obtenerDatosNomencladorUriDato($tipoconcepto);
        $iddatosnomenclador = $nomenclador[0]['iddatosnomenclador'];
        $matrices = $a->getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador);
        $arreglo = $modelo->getConfig($matrices[0]['idestudioherramienta']);
        if ($arreglo['config']['idestudiomatrizrelacion'])
            return true;
        else
            return false;

    }

    //Insertar Actualizar Eliminar  columnas y filas de la matriz.
    public function insertUpdateDeleteColumnsRowsMatriz($idproyectoplanificacion, $datos = array(), $accion, $tipoconcepto)
    {

//        $datos = '{"denomold":"Prueba","denominacion":"Prueba1","descripcion":"","fila":false}';
        $datos = Zend_Json_Decoder::decode($datos);
        $a = new PlanificacionintegracionModel();
        $modelo = new DatEstudiomatrizrelacionModel();
        $nomenclador = $this->pIntegrator->planificacion->obtenerDatosNomencladorUriDato($tipoconcepto);
        $iddatosnomenclador = $nomenclador[0]['iddatosnomenclador'];
        $matrices = $a->getMatricesPlanificacion($idproyectoplanificacion, $iddatosnomenclador);
        $arreglo = $modelo->getConfig($matrices[0]['idestudioherramienta']);
        $datos['idestudiomatrizrelacion'] = $arreglo['config']['idestudiomatrizrelacion'];
        $datos['idproyecto'] = $arreglo['config']['idproyecto'];
        if ($accion == 'upd') {
            if ($datos['fila']) {
                foreach ($arreglo['rows'] as $value) {
                    if ($datos['denomold'] == $value['denominacion']) {
                        $datos['idcolumnrow'] = $value['idcolumnafila'];
                    }
                }

            } else {
                foreach ($arreglo['columns'] as $value) {
                    if ($datos['denomold'] == $value['denominacion']) {
                        $datos['idcolumnrow'] = $value['idcolumnafila'];
                    }
                }
            }
            try {
                $res = $modelo->updateColumnRow($datos);
            } catch (Exception $exc) {
                echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
            }


        } else if ($accion == 'ins') {
            try {
                $res = $modelo->insertColumnRow($datos);
            } catch (Exception $exc) {
                echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
            }
        } else {
            if ($datos['fila']) {
                foreach ($arreglo['rows'] as $value) {
                    if ($datos['denominacion'] == $value['denominacion']) {
                        $datos['idcolumnrow'] = $value['idcolumnafila'];
                    }
                }

            } else {
                foreach ($arreglo['columns'] as $value) {
                    if ($datos['denominacion'] == $value['denominacion']) {
                        $datos['idcolumnrow'] = $value['idcolumnafila'];
                    }
                }
            }
            try {
                $res = $modelo->deleteColumnRow($datos);
            } catch (Exception $exc) {
                echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
            }

        }

    }


}
