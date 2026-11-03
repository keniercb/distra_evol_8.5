<?php

/**
 * Componente para gestionar las fechas de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Fecha/Controller
 * @copyright  XETID
 * @version    1.0
 */
class GestionarfechaController extends ZendExt_Controller_Secure
{

    /**
     * Constuctor de la clase
     */
    function init()
    {
        $this->fechaModel = new FechaModel();
        parent::init();
    }

    /**
     * Gestionar fecha
     * 
     */
    function gestionarfechaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $ejercicios = $this->integrator->datosmaestros->obtenerEjercicios($idestructura);
        if (empty($ejercicios)) {
            $this->exception = new ZendExt_Exception('CONF118');
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->exception->getIdException());
            $flashMessenger->addMessage($this->exception->getDescription());
            $flashMessenger->addMessage($this->exception->getMessage());
            $this->render('info');
        } else {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($idestructura);
            if (count($subsistemas)) {
                $this->render();
            } else {
                $this->exception = new ZendExt_Exception('CONF150');
                $flashMessenger = $this->_helper->_flashMessenger;
                $flashMessenger->addMessage($this->exception->getIdException());
                $flashMessenger->addMessage($this->exception->getDescription());
                $flashMessenger->addMessage($this->exception->getMessage());
                $this->render('info');
            }
        }
    }

    /**
     * Gestionar excepción controladora
     * 
     */
    public function getexcepcioncontroladaAction()
    {
        $dataException = $this->_helper->_flashMessenger->getMessages();
        echo ("{detalles: '$dataException[1]', 'message': '$dataException[2]'}");
    }

    /**
     * Gestionar la carga inicial de la fecha
     */
    function gestionarfechacargainicialAction()
    {
        $this->render();
    }

    /**
     * Cargar fechas
     *  
     */
    public function cargarfechasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->_request->getPost('idestructura');
        $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
        $fechasSubSistemas = $this->fechaModel->FormarArregGrid($idestructura , $limit, $start);
        echo (json_encode($fechasSubSistemas));
        return;
    }

    /**
     * Pasar fecha de autom\xE1tica a manual
     * 
     */
    public function pasarautomaticamanualAction()
    {
        $fech = new FechaContModel();
        if (strpos($this->_request->getPost('idfecha'), ',')) {
            $elementos = split(",", $this->_request->getPost('idfecha'));
            foreach ($elementos as $i => $elem) {
                $i++;
                $fecham = new stdClass();
                $fecham->idfecha = $elem;
                $fecham->incremento = $this->_request->getPost('incremento');
                $fech->ActualizarFecha($fecham);
                unset($fecham);
            }
        } else {
            $fecham = new stdClass();
            $fecham->idfecha = $this->_request->getPost('idfecha');
            $fecham->incremento = $this->_request->getPost('incremento');
            $fech->ActualizarFecha($fecham);
        }
        if (strpos($this->_request->getPost('idfecha'), ',')) {
            echo("{'codMsg':-2}");
        } else {
            echo("{'codMsg':-1}");
            return;
        }
    }

    /**
     * Pasar fecha
     * 
     * @throws Exception $ee
     */
    public function pasarfechaAction()
    {
        try
        {
            $fechaModel = new FechaModel();
            $pDataFecha = json_decode($this->_request->getPost('dataset'));
            $pIdFecha = $pDataFecha->idfecha;
            $pVersion = $pDataFecha->version;
            $objFechaContable = Doctrine::getTable('DatFechaconf')->find($pIdFecha);
            $objFechaContable->version = $pVersion;
            $fecha = $objFechaContable->fecha;
            
            // $fechaActual = DateTime::createFromFormat("d/m/Y", $fecha);
            $fechaSgte = DateTime::createFromFormat("d/m/Y", $fecha);
            $fechaSgte = $fechaSgte->modify('+1 day');

            $cierreDeObjFecha = $this->integrator->datosmaestros->buscarObjCierre($pDataFecha->idestructurasubsisti);
            $periodoDeEjerCierre = $this->integrator->datosmaestros->obtenerPeriodo($cierreDeObjFecha->idperiodoactual);
            $fechaFinPeriodo = DateTime::createFromFormat("d/m/Y", $periodoDeEjerCierre->fin1);
            $mayor = $fechaSgte > $fechaFinPeriodo;

            if ($mayor) {
                $objEstructuraSubsist = $this->integrator
                        ->datosmaestros->getObjEstructSubsisById($pDataFecha->idestructurasubsisti);
                $identidad = $objEstructuraSubsist->idestructuracomun;
                $idsubsistema = $objEstructuraSubsist->idsubsistema;
                $objperiodoSgte = $this->integrator->datosmaestros
                        ->periodoSiguiente($cierreDeObjFecha->idperiodoactual);
                if ($objperiodoSgte->idperiodo) {
                    $this->integrator->datosmaestros->asignarEjercicioPeriodo(
                            $identidad, $idsubsistema, $cierreDeObjFecha->idejercicioactual, $objperiodoSgte->idperiodo
                    );
                } else {
                    $ejercicioSgte = $this->integrator->datosmaestros->ejercicioSiguiente(
                            $cierreDeObjFecha->idejercicioactual
                    );
                    if ($ejercicioSgte) {
                        $primerPeriodoEjrCierre = $this->integrator->datosmaestros->primerPeriodo($ejercicioSgte);
                        $this->integrator->datosmaestros->asignarEjercicioPeriodo(
                                $identidad, $idsubsistema, $ejercicioSgte, $primerPeriodoEjrCierre
                        );
                    } else {
                        echo("{'codMsg':-6}");
                        return;
                    }
                }
            }
            if ($fechaModel->pasarFechaSgte($objFechaContable, $fechaSgte->format('d/m/Y'))) {
                echo("{'codMsg':-1}");
                return;
            }
        }
        catch (Exception $ee)
        {
            if ($ee->getIdException() === 'CONFC008') {
                $mensaje = $ee->getMessage();
                $descripcion = $ee->getDescription();
                echo("{'codMsg':3, 'mensaje':'$mensaje</br>$descripcion'}");
            } else {
                throw new ZendExt_Exception($ee->getIdException());
            }
        }
    }

    /**
     * Cargar fecha
     * 
     * @throws ZendExt_Exception $ee 
     */
    function cargarfechaAction()
    {
        try
        {
            $fecha = new DatFechaconf();
            //$idsubsistema = $this->global->Subsistema->idsubsistema;
            //$identidad = $this->global->Estructura->idestructura;
            //$estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            $datos = $fecha->BuscarFecha(1);
            $r = $datos[0]['fecha'];
            $m = explode('-', $r);
            $r = $m[2] . '/' . $m[1] . '/' . $m[0];
            $datos[0]['fecha'] = $r;
            $result = array('datos' => $datos);
            echo (json_encode($result));
        }
        catch (ZendExt_Exception $ee)
        {
            throw new ZendExt_Exception('CONF001', $ee);
        }
    }

    /**
     * Cargar subsistemas
     *  
     */
    public function cargarSubsistemasAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
        $arraySubSistema = $this->integrator->datosmaestros->buscarSubsistemasPorEntidad($idestructura);
        if (empty($arraySubSistema)) {
            throw new ZendExt_Exception('CONF117');
        } else {
            $result = $this->fechaModel->getSubSistemasByEntidad($idestructura);
            echo (json_encode(array('datos' => $result)));
        }
    }

    /**
     * Cargar ejercicios
     * 
     */
    public function cargarEjerciciosAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
        $ejercicios = $this->integrator->datosmaestros->obtenerEjercicios($idestructura);
        if (empty($ejercicios))
            throw new ZendExt_Exception('CONF118');
        echo (json_encode(array('datos' => $ejercicios)));
    }

    /**
     * Cargar periodos
     * 
     */
    public function cargarPeriodosAction()
    {
        $pIdEjercicio = $this->_request->getPost('idejercicio');
        $periodos = $this->integrator->datosmaestros->obtenerPeriodos($pIdEjercicio);
        if (empty($periodos))
            throw new ZendExt_Exception('CONF119');
        echo (json_encode(array('datos' => $periodos)));
    }

    /**
     * Buscar fechas
     * 
     */
    public function buscarFechasAction()
    {
        $periodo = $this->integrator->datosmaestros->obtenerPeriodo($this->_request->getPost('idperiodo'));
        if (empty($periodo))
            throw new ZendExt_Exception('CONF119');
        echo (json_encode(array('inicio' => $periodo->inicio, 'fin' => $periodo->fin)));
    }

    /**
     * Insertar fecha
     * 
     * @throws Exception $ee 
     */
    public function insertarfechaAction()
    {
        try
        {
            $fecha = new DatFechaconf();
            $fecha->fecha = $this->_request->getPost('desde');
            $fecha->fechasist = date("d-m-Y");
            $fecha->idestructurasubsist = $this->_request->getPost('idestructurasubsisti');
            $fecha->incremento = ($this->_request->getPost('comportamiento') == 'Manual') ? 2 : 1;
            $fecha->precedencia = $this->fechaModel->ObtenerMaxPrecedencia() + 1;
            $fecha->version = 0;
            $busq = $fecha->TodaslasFechas(array($fecha->idestructurasubsist));

            if(!$fecha->fecha){
                echo("{'codMsg':-3}");
                return;
            }

            if (count($busq) == 0) {
                $this->fechaModel->InsertarFecha($fecha);
                $periodo = $this->_request->getPost('idperiodo');
                $ejercicio = $this->_request->getPost('idejercicio');
                $this->integrator->datosmaestros->adicionarCierre($fecha->idestructurasubsist,$periodo,$ejercicio);
                echo("{'codMsg':-1}");
                return;
            } else {
                echo("{'codMsg':-2}");
                return;
            }
        }
        catch (Exception $ee)
        {
            throw $ee;
        }
    }

    /**
     * Cargar datos modificar fecha
     * 
     * @throws Exception $ee 
     */
    public function cargarDatosModfAction()
    {
        try
        {
            $id = $this->_request->getPost('idestructurasubsisti');
            $var = $this->integrator->datosmaestros->buscarObjCierre($id);
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $ejercicio = $this->integrator->datosmaestros->obtenerEjercicio($var->idejercicioactual, $idestructura);
            $periodo = $this->integrator->datosmaestros->obtenerPeriodo($var->idperiodoactual);
            echo (json_encode(array('Ejercicio' => $ejercicio, 'Periodo' => $periodo)));
        }
        catch (Exception $ee)
        {
            throw $ee;
        }
    }

    /**
     * Modificar fecha
     * 
     * @throws Exception $ee 
     */
    public function modificarfechaAction()
    {
        try
        {
            $fecha = Doctrine::getTable('DatFechaconf')->find($this->_request->getPost('idfecha'));
            $fecha->fecha = $this->_request->getPost('desde');
            $fecha->incremento = $this->_request->getPost('idcomport');
            $instance = $this->integrator->datosmaestros->getObjEstructSubsisById($fecha->idestructurasubsist);
            $aperturado = $this->integrator->datosmaestros->subsistemaAperturado(
                $instance->idestructuracomun, $instance->idsubsistema
            );
            if(!$aperturado){
                $this->fechaModel->InsertarFecha($fecha);
                $this->integrator->datosmaestros->modificarCierre(
                    $fecha->idestructurasubsist, $this->_request->getPost('idperiodo'),
                    $this->_request->getPost('idejercicio')
                );
                echo("{'codMsg':-1}");
                return;
            }
            echo("{'codMsg':-2}");
            return;
        }
        catch (Exception $ee)
        {
            throw $ee;
        }
    }

    /**
     * Cierre
     * 
     */
    public function cierreAction()
    {
        $this->integrator->datosmaestros->cierreCinicial($this->_request->getPost('idestructura'));
        echo "{'succes':1}";
    }

    /**
     * Cargar combo
     * 
     */
    public function cargarcombocomportAction()
    {
        $result = array(
            array(
                'idcomport' => '1', 'Comportamiento' => 'Automático'
            ), array('idcomport' => 2, 'Comportamiento' => "Manual")
        );
        echo (json_encode(array('datos' => $result)));
    }

    /**
     * Obtener arbol
     * 
     */
    public function obtenerarbolAction()
    {
        if ($this->global->EstructuraEconomica->idestructurae) {
            $agIdEstructurae = $this->global->EstructuraEconomica->idestructurae;
            $arbolEstructuraEconomica = array();
            $agIdestructuraePadre = $this->integrator->contabilidad_financiera
                    ->ObtenerEstructuraPadre($agIdEstructurae);
            if ($this->_request->getPost('node') == '0') {
                $idestructura = $this->_request->getPost('idestructura');
                $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
                $arbolEstructuraEconomica[] = array('id' => $this->global->EstructuraEconomica->idestructurae,
                    'text' => $this->global->EstructuraEconomica->descripcion,
                    'idestructuracomun' => $idestructura);
                $id = $agIdestructuraePadre[0]['idestructuraepadre'];
            } else {
                $id = $this->_request->getPost('node');
                $arbolEstructuraEconomica = $this->integrator->contabilidad_financiera
                        ->ObtenerArbolEstructuraEconomica($id, $agIdEstructurae);
            }
            echo (json_encode($arbolEstructuraEconomica));
        } else {
            $err = array('codMsg' => '1', 'mensaje' => 'Debe configurar la estructura económica');
            echo (json_encode($err));
        }
        return;
    }

    /**
     * Cargar fechas 1
     * 
     */
    public function cargarfechas1Action()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->_request->getPost('idestructura');
        if (isset($idestructura)) {
            $fechar = $this->fechaModel->FormarArregGrid1($idestructura, $limit, $start);
        } else {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $fechar = $this->fechaModel->FormarArregGrid1($idestructura, $limit, $start);
        }
        echo json_encode($fechar);
    }

}
