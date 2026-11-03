<?php

/**
 * Controlador para gestionar los conceptos de percepciones y descuentos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomConceptoPercepcionDescuentoModel
 * @uses NomTarifaModel
 * @uses NomConceptoPDTarifaModel
 * @uses NomVariableAuxiliarFormulaModel
 * @uses ConfReportesCertificacionesModel
 * @uses ConfVariablesReportesCertificacionesModel
 * @copyright UCID
 * @version 1.0
 */
class NomconceptopercepciondescuentoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init ()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los conceptos de percepciones y descuentos.
     */
    public function nomconceptopercepciondescuentoAction ()
    {
        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los conceptos.
     */
    public function obtenerListadoConceptosPDAction ()
    {
        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el listado de conceptos.
        $arrConcepto = $modeloNegocioConcepto->obtenerListadoConceptosPD(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 20),
            $this->_getParam('criterio')
        );

        //Obteniendo la cantidad total de conceptos.
        $cantTotalConcepto = $modeloNegocioConcepto->obtenerCantidadTotalConceptosPD($this->_getParam('criterio'));

        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrConcepto, 'cantidad' => $cantTotalConcepto));
    }

    /**
     * Accion utilizada para obtener los tipos de conceptos.
     */
    public function obtenerTiposConceptosPDAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo de tipos de conceptos.
        $arrTipoConcepto = $modeloNegocioConcepto->obtenerArregloTiposConceptosPD();

        //Imprimiendo el arreglo de tipos de conceptos.
        echo Zend_Json::encode(array('datos' => $arrTipoConcepto));
    }

    /**
     * Accion para adicionar un concepto de percepción y descuento.
     */
    public function adicionarConceptoPercepcionDescuentoAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Insertando los datos del concepto de percepción y descuento.
        $result = $modeloNegocioConcepto->adicionarConceptoPercepcionDescuento(
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('esdescuento'),
            $this->_getParam('idformula'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idtipoconcepto')
        );
        if($result){
            //Devolviendo una notificación de que todo ocurrió correctamente.
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'0','msg':'" . "La denominación o abreviatura del concepto que desea adicionar ya existe." . "'}";

        }

    }

    /**
     * Accion para modificar un concepto de percepción y descuento.
     */
    public function modificarConceptoPercepcionDescuentoAction ()
    {
        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Modificando los datos del concepto de percepción y descuento.
        $result = $modeloNegocioConcepto->modificarConceptoPercepcionDescuento(
            $this->_getParam('idconcepto'),
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('esdescuento'),
            $this->_getParam('idformula'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idtipoconcepto')
        );

        if($result){
            //Devolviendo una notificación de que todo ocurrió correctamente.
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'0','msg':'" . "La denominación o abreviatura del concepto que desea modificar ya existe." . "'}";
        }
    }

    /**
     * Accion para eliminar un concepto de percepción y descuento.
     */
    public function eliminarConceptoPercepcionDescuentoAction ()
    {

        $idconcepto = $this->_getParam('idconcepto');
        //Obteniendo la entidad actual
        $identidad= $this->global->Estructura->idestructura;
        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();
        //Creando el modelo de negocio de Conceptos Generales de Nomina
        $modeloConceptoGenerales = new ConfConceptosGeneralesNomina();
        
        $arrayindicadores = $modeloConceptoGenerales->obtenerIndicadoresExpresionesConceptosGenerales($identidad);
        $bool = 1;
        
        //Validando si el concepto se utiliza en alguna expresion matematica
        foreach($arrayindicadores as $i => $indicador){
            $idindicador = explode('_',$indicador['idindicador']);
            $idindicador = $idindicador[count($idindicador)-1];
            if($idconcepto == $idindicador){
                $bool = 2 ;   
            }
         }
         if($bool != 2){
            //Eliminando el concepto de percepción y descuento.
            $bool = $modeloNegocioConcepto->eliminarConceptoPercepcionDescuento($idconcepto);
         }
          
        if($bool == 2){
            echo "{'codigo':'3'}";
        }else{
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para listar las tarifas asociadas al concepto especificado.
     */
    public function obtenerListadoTarifaConceptoAction ()
    {

        //Creando el modelo de negocio de gestion de tarifas de conceptos.
        $modeloNegocioTarifaConcepto = new NomConceptoPDTarifaModel();

        //Obteniendo el listado de tarifas de conceptos.
        $arrTarifaConcepto = $modeloNegocioTarifaConcepto->obtenerListadoTarifaConcepto(
            $this->_getParam('idconceptopd', 0)
        );

        //Imprimiendo el listado de tarifas de conceptos.
        echo Zend_Json::encode(array('datos' => $arrTarifaConcepto, 'cantidad' => count($arrTarifaConcepto)));
    }

    /**
     * Accion utilizada para obtener las tarifas.
     */
    public function obtenerTarifasAction ()
    {

        //Creando el modelo de negocio de gestion de tarifas.
        $modeloNegocioTarifa = new NomTarifaModel();

        //Obteniendo el arreglo de tarifas.
        $arrTarifas = $modeloNegocioTarifa->obtenerListadoTodasTarifa();

        //Imprimiendo el arreglo de tarifas.
        echo Zend_Json::encode(array('datos' => $arrTarifas));
    }

    /**
     * Accion utilizada para obtener las formas de cálculo.
     */
    public function obtenerFormasCalculoAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo de formas de cálculo.
        $arrFormCalc = $modeloNegocioConcepto->obtenerArregloFormasCalculo(
            $this->_getParam('tipo')
        );

        //Imprimiendo el arreglo de formas de cálculo.
        echo Zend_Json::encode(array('datos' => $arrFormCalc));
    }

    /**
     * Accion para adicionar una tarifa asociada a un concepto.
     */
    public function adicionarTarifaConceptoAction ()
    {

        //Creando el modelo de negocio de tarifas de conceptos.
        $modeloNegocioTarifaConcepto = new NomConceptoPDTarifaModel();

        //Insertando los datos de tarifas de conceptos.
        $modeloNegocioTarifaConcepto->adicionarTarifaConcepto(
            $this->_getParam('idtarifa'),
            $this->_getParam('idformacalculo'),
            $this->_getParam('idformula'),
            $this->_getParam('importe'),
            $this->_getParam('lugaresdecimales'),
            $this->_getParam('idconcepto')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar una tarifa asociada a un concepto.
     */
    public function modificarTarifaConceptoAction ()
    {

        //Creando el modelo de negocio de tarifas de conceptos.
        $modeloNegocioTarifaConcepto = new NomConceptoPDTarifaModel();

        //Modificando los datos de tarifas de conceptos.
        $modeloNegocioTarifaConcepto->modificarTarifaConcepto(
            $this->_getParam('idtarifaconcepto'),
            $this->_getParam('idtarifa'),
            $this->_getParam('idformacalculo'),
            $this->_getParam('idformula'),
            $this->_getParam('importe'),
            $this->_getParam('lugaresdecimales'),
            $this->_getParam('idconcepto')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar una tarifa asociada a un concepto.
     */
    public function eliminarTarifaConceptoAction ()
    {

        //Creando el modelo de negocio de tarifas de conceptos.
        $modeloNegocioTarifaConcepto = new NomConceptoPDTarifaModel();

        //Eliminando los datos de tarifas de conceptos.
        $bool = $modeloNegocioTarifaConcepto->eliminarTarifaConcepto(
            $this->_getParam('idtarifaconcepto')
        );

        if($bool == 2){
            echo "{'codigo':'3'}";
        }else{
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para listar las variables auxiliares.
     */
    public function obtenerListadoVariablesAuxiliaresFormulaAction ()
    {

        //Creando el modelo de negocio de variables auxiliares.
        $modeloNegocioVarAux = new NomVariableAuxiliarFormulaModel();

        //Obteniendo el listado de variable auxiliares.
        $arrVarAux = $modeloNegocioVarAux->obtenerListadoVariablesAuxiliares(
            $this->_getParam('idconceptopd', 0)
        );

        //Imprimiendo el listado de variable auxiliares.
        echo Zend_Json::encode(array('datos' => $arrVarAux, 'cantidad' => count($arrVarAux)));
    }

    /**
     * Accion utilizada para obtener las formas de entrada.
     */
    public function obtenerFormasEntradaAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo de formas de entrada.
        $arrFormaEntr = $modeloNegocioConcepto->obtenerArregloFormasEntrada(
            $this->_getParam('tipo')
        );

        //Imprimiendo el arreglo de formas de entrada.
        echo Zend_Json::encode(array('datos' => $arrFormaEntr));
    }

    /**
     * Accion utilizada para obtener los conceptos generales de la retribución monetaria.
     */
    public function obtenerIndicadoresFormulaAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVariablesG = new NomVariableGlobalModel();

        //Obteniendo el arreglo de conceptos de la retribución monetaria.
        $arrCRM = $modeloNegocioConceptoRM->obtenerTodosConceptosRM();

        //Obteniendo el arreglo de variables globales.
        $arrVG = $modeloNegocioVariablesG->obtenerTodasVariablesGlobales();


        $arrR = array();
        foreach($arrCRM as $k => $v) {
            $arrR[] = array('idindicador' => 'CRM_' . $v['idconceptorm'], 'indicador' => $v['denominacion'], 'tipo' => 'Concepto RM');
        }

        foreach($arrVG as $k => $v) {
            $arrR[] = array('idindicador' => 'VG_' . $v['idvariableglobal'], 'indicador' => $v['denominacion'], 'tipo' => 'Variable global');
        }
        //$this->datosModelo->conceptos = $arrR;
        $arrR[] = array('idindicador' => 'SPC', 'indicador' => 'Sueldo por cargo', 'tipo' => 'Sueldo por cargo');
        $arrR[] = array('idindicador' => 'RET_0', 'indicador' => 'Retenciones', 'tipo' => 'Retenciones');
        $arrR[] = array('idindicador' => 'VAC_0', 'indicador' => 'Vacaciones', 'tipo' => 'Vacaciones');
        //Imprimiendo el arreglo de indicadores.
        echo Zend_Json::encode($arrR);
    }

    /**
     * Accion utilizada para obtener los tipos de reporte.
     */
    public function obtenerTiposReportesAction ()
    {

        //Creando el modelo de negocio de gestion de tipos de reportes.
        $modeloReporte = new ConfReportesCertificacionesModel();

        //Obteniendo el arreglo de tipos de reportes.
        $arrReporte = $modeloReporte->obtenerArregloTiposReportes();

        //Imprimiendo el arreglo de tipos de reportes.
        echo Zend_Json::encode(array('datos' => $arrReporte));
    }

    /**
     * Accion utilizada para obtener las variables de un tipo de reporte.
     */
    public function obtenerVariablesTipoReporteAction ()
    {

        //Creando el modelo de negocio de gestion de variables de tipos de reporte.
        $modeloNegocioVarReporte = new ConfVariablesReportesCertificacionesModel();

        //Obteniendo el arreglo de variables de tipos de reporte.
        $arrVarReporte = $modeloNegocioVarReporte->obtenerVariablesDadoIdReporte(
            $this->_getParam('idreporte')
        );

        //Imprimiendo el arreglo de variables de tipos de reporte.
        echo Zend_Json::encode(array('datos' => $arrVarReporte));
    }

    /**
     * Accion para adicionar una variable auxiliar.
     */
    public function adicionarVariableAuxiliarFormulaAction ()
    {

        //Creando el modelo de negocio de variables auxiliares.
        $modeloNegocioVarAux = new NomVariableAuxiliarFormulaModel();

        //Insertando los datos de variables auxiliares.
        $modeloNegocioVarAux->adicionarVariableAuxiliarFormula(
            $this->_getParam('denomvariable'),
            $this->_getParam('idformaentrada'),
            $this->_getParam('idtiporeporte'),
            $this->_getParam('idvarreporte'),
            $this->_getParam('idconcepto')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar una variable auxiliar.
     */
    public function modificarVariableAuxiliarFormulaAction ()
    {

        //Creando el modelo de negocio de variables auxiliares.
        $modeloNegocioVarAux = new NomVariableAuxiliarFormulaModel();

        //Modificando los datos de variables auxiliares.
        $modeloNegocioVarAux->modificarVariableAuxiliarFormula(
            $this->_getParam('idvariableauxiliar'),
            $this->_getParam('denomvariable'),
            $this->_getParam('idformaentrada'),
            $this->_getParam('idtiporeporte'),
            $this->_getParam('idvarreporte'),
            $this->_getParam('idconcepto')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar una variable auxiliar.
     */
    public function eliminarVariableAuxiliarFormulaAction ()
    {

        //Creando el modelo de negocio de variables auxiliares.
        $modeloNegocioVarAux = new NomVariableAuxiliarFormulaModel();

        //Eliminando los datos de variables auxiliares.
        $bool = $modeloNegocioVarAux->eliminarVariableAuxiliarFormula(
            $this->_getParam('idvariableauxiliar')
        );

        if($bool == 2){
            echo "{'codigo':'3'}";
        }else{
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para listar las estructuras escalares.
     */
    public function obtenerListadoEstructurasEscalaresAction ()
    {

        //Creando el modelo de negocio de estructura escalar.
        $modeloNegocioEstEsc = new NomEstructuraEscalarModel();

        //Obteniendo el listado de estructuras escalares.
        $arrEstEsc = $modeloNegocioEstEsc->obtenerListadoEstructurasEscalares(
            $this->_getParam('idtarifaconcepto', 0)
        );

        //Imprimiendo el listado de estructuras escalares.
        echo Zend_Json::encode(array('datos' => $arrEstEsc, 'cantidad' => count($arrEstEsc)));
    }

    /**
     * Accion utilizada para obtener los tipos de campo.
     */
    public function obtenerTiposCampoAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo de tipos de campos.
        $arrTipoCampo = $modeloNegocioConcepto->obtenerArregloTiposCampos();

        //Imprimiendo el arreglo de tipos de campos.
        echo Zend_Json::encode(array('datos' => $arrTipoCampo));
    }

    /**
     * Accion utilizada para obtener el listado de nomencladores.
     */
    public function obtenerNomencladoresAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo de nomencladores.
        $arrNom = $modeloNegocioConcepto->obtenerArregloNomencladores();

        //Imprimiendo el arreglo de nomencladores.
        echo Zend_Json::encode(array('datos' => $arrNom));
    }

    /**
     * Accion para adicionar una estructura escalar.
     */
    public function adicionarEstructuraEscalarAction ()
    {

        //Creando el modelo de negocio de estructura escalar.
        $modeloNegocioEstEsc = new NomEstructuraEscalarModel();
        //Insertando los datos de estructuras escalares.
        $modeloNegocioEstEsc->adicionarEstructuraEscalar(
            $this->_getParam('denomestruc'),
            $this->_getParam('idtipocampo'),
            $this->_getParam('idnomenclador'),
            $this->_getParam('nivel'),
            $this->_getParam('idformaentrada'),
            $this->_getParam('idtiporeporte'),
            $this->_getParam('idvarreporte'),
            $this->_getParam('idtarifaconcepto'),
            $this->_getParam('lugaresdecimales')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar una estructura escalar.
     */
    public function modificarEstructuraEscalarAction ()
    {

        //Creando el modelo de negocio de estructura escalar.
        $modeloNegocioEstEsc = new NomEstructuraEscalarModel();

        //Modificando los datos de estructuras escalares.
        $modeloNegocioEstEsc->modificarEstructuraEscalar(
            $this->_getParam('idestrucesc'),
            $this->_getParam('denomestruc'),
            $this->_getParam('idtipocampo'),
            $this->_getParam('idnomenclador'),
            $this->_getParam('nivel'),
            $this->_getParam('idformaentrada'),
            $this->_getParam('idtiporeporte'),
            $this->_getParam('idvarreporte'),
            $this->_getParam('idtarifaconcepto')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar una estructura escalar.
     */
    public function eliminarEstructuraEscalarAction ()
    {

        //Creando el modelo de negocio de estructura escalar.
        $modeloNegocioEstEsc = new NomEstructuraEscalarModel();

        //Eliminando los datos de estructuras escalares.
        $bool = $modeloNegocioEstEsc->eliminarEstructuraEscalar(
            $this->_getParam('idestrucesc')
        );

        if($bool == 2){
            echo "{'codigo':'3'}";
        }else{
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para obtener el listado de operadores de comparación.
     */
    public function obtenerOperadoresComparacionAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo de operadores de comparación.
        $arrOperad = $modeloNegocioConcepto->obtenerArregloOperadoresComparacion();

        //Imprimiendo el arreglo de operadores de comparación.
        echo Zend_Json::encode(array('datos' => $arrOperad));
    }

    /**
     * Accion utilizada para listar las estructuras escalares adyacentes.
     */
    public function obtenerListadoEstructurasEscalaresAdyacentesAction ()
    {

        //Creando el modelo de negocio de estructura escalar adyacente.
        $modeloNegocioAdyac = new NomDependenciaEstructuraEscalarModel();

        //Obteniendo el listado de estructuras escalares adyacentes.
        $arrAdyacente = $modeloNegocioAdyac->obtenerListadoDependenciasEstructurasEscalares(
            $this->_getParam('idestructescalar', 0)
        );

        //Imprimiendo el listado de estructuras escalares adyacentes.
        echo Zend_Json::encode(array('datos' => $arrAdyacente, 'cantidad' => count($arrAdyacente)));
    }

    /**
     * Accion para adicionar una estructura escalar adyacente.
     */
    public function adicionarEstructuraEscalarAdyacenteAction ()
    {

        //Creando el modelo de negocio de estructura escalar adyacente.
        $modeloNegocioAdyac = new NomDependenciaEstructuraEscalarModel();

        //Insertando los datos de estructuras escalares adyacentes.
        $modeloNegocioAdyac->adicionarDependenciaEstructuraEscalar(
            $this->_getParam('idestrucesc'),
            $this->_getParam('idadyacente'),
            $this->_getParam('idconceptopdtarifa')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar una estructura escalar adyacente.
     */
    public function eliminarEstructuraEscalarAdyacenteAction ()
    {

        //Creando el modelo de negocio de estructura escalar adyacente.
        $modeloNegocioAdyac = new NomDependenciaEstructuraEscalarModel();

        //Eliminando los datos de estructuras adyacentes.
        $modeloNegocioAdyac->eliminarDependenciaEstructuraEscalar(
            $this->_getParam('idestadyacente')
        );

        echo "{'codigo':'1'}";
    }

    /**
     * Acción para obtener el listado de escalas de la tarifa del concepto.
     */
    public function obtenerListadoEscalasTarifaAction ()
    {
        //Creando el modelo de negocio de gestion de escalas de tarifa de concepto.
        $modeloNegocioEscTarif = new NomEscalaTarifaModel();

        //Obteniendo el arreglo del nomenclador especificado.
        $arrEscTar = $modeloNegocioEscTarif->obtenerListadoEscalasTarifaConcepto(
            $this->_getParam('idtarifaconcepto'),
            $this->_getParam('idescalatarifa')
        );

        //Imprimiendo el listado de estructuras escalares.
        echo Zend_Json::encode(array('datos' => $arrEscTar, 'cantidad' => count($arrEscTar)));
    }

    /**
     * Acción para obtener el arreglo del nomenclador especificado.
     */
    public function obtenerValoresNomencladorDadoIdAction ()
    {

        //Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();

        //Obteniendo el arreglo del nomenclador especificado.
        $arrNomEsp = $modeloNegocioConcepto->obtenerArregloValoresNomencladorReferencia(
            $this->_getParam('idnomenclador')
        );

        //Imprimiendo el arreglo del nomenclador especificado.
        echo Zend_Json::encode(array('datos' => $arrNomEsp));
    }

    /**
     * Acción para adicionar una escala.
     */
    public function adicionarEscalaTarifaAction ()
    {

        //Creando el modelo de negocio de escala de taria.
        $modeloNegocioEsc = new NomEscalaTarifaModel();

        //Insertando los datos de escalas.
        $modeloNegocioEsc->adicionarEscalaTarifa(
            $this->_getParam('idoperador'),
            $this->_getParam('valorinicial'),
            $this->_getParam('valorfinal'),
            $this->_getParam('formacalculo'),
            $this->_getParam('importe'),
            $this->_getParam('idformula', 0),
            $this->_getParam('idtarifaconcepto'),
            $this->_getParam('idestrucesc'),
            $this->_getParam('valorescala'),
            $this->_getParam('idpadre')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Acción para modificar una escala.
     */
    public function modificarEscalaTarifaAction ()
    {

        //Creando el modelo de negocio de escala de taria.
        $modeloNegocioEsc = new NomEscalaTarifaModel();

        //Insertando los datos de escalas.
        $modeloNegocioEsc->modificarEscalaTarifa(
            $this->_getParam('idescala'),
            $this->_getParam('idoperador'),
            $this->_getParam('valorinicial'),
            $this->_getParam('valorfinal'),
            $this->_getParam('formacalculo'),
            $this->_getParam('importe'),
            $this->_getParam('idformula', 0),
            $this->_getParam('idtarifaconcepto'),
            $this->_getParam('idestrucesc'),
            $this->_getParam('valorescala')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Acción para eliminar una escala.
     */
    public function eliminarEscalaTarifaAction ()
    {

        //Creando el modelo de negocio de escala de taria.
        $modeloNegocioEsc = new NomEscalaTarifaModel();

        //Eliminando los datos de escalas.
        $bool = $modeloNegocioEsc->eliminarEscalaTarifa(
            $this->_getParam('idescala')
        );

        if($bool == 2){
            echo "{'codigo':'3'}";
        }else{
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }
}
