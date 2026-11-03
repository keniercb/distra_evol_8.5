<?php

/**
 * EjerciciosController
 * Gestión y control de los <b>Ejercicios y Per&iacute;dos Contables</b>
 *
 * @author     Ing. Miguel Diaz Riveaux
 * @package    Configuración
 * @subpackage EjercicioPeríodo/Controllers
 * @copyright  XETID
 * @version    2.0
 * @internal   Version mejorada aun le falta, mejorar muchisisimo mas.
 */
class EjerciciosController extends ZendExt_Controller_Secure
{

    private $objEjercicioModel;
    private $objPeriodoModel;

    function init()
    {
        $this->objEjercicioModel = new EjerciciocontableModel();
        $this->objPeriodoModel = new PeriodocontableModel();
        parent::init();
    }

    function gestionarejercicioscargainicialAction()
    {
        $this->render();
    }

    /**
     * Accede al servicio fechaCinicial
     */
    public function FechaCinicialAction()
    {
        return $this->integrator->datosmaestros->fechaCinicial();
    }

    /**
     * Obtiene la próxima fecha inicio y fin de ejercicio
     *
     * @return array Fechas inicio y fin
     */
    public function buscarFechasAction()
    {
        $ejercicioant = DatEjerciciocontable::buscarEjercicio(
            array('idejercicio' => $this->_request->getPost('idejercicio'))
        );
        $inicio = $this->integrator->datosmaestros->proximaFecha($ejercicioant['datos'][0]['fin'], 1);
        list($ani, $mei, $dii) = split("-", $inicio);
        $inicio = "$dii/$mei/$ani";
        $fin = $ejercicioant['datos'][0]['fin'];
        if ($ejercicioant['datos'][0]['annonatural']) {
            list($anf, $mef, $dif) = split("-", $fin);
            $anf++;
            $fin = "$dif/$mef/$anf";
        } else {
            $diferencia = $this->integrator->datosmaestros->diferenciasFechas(
                $ejercicioant['datos'][0]['inicio'], $ejercicioant['datos'][0]['fin']
            );
            $diferencia = round($diferencia / 30);
            $fin = date('d/m/Y', mktime(0, 0, 0, $mei + $diferencia, 0, $ani));
        }
        echo (json_encode(array('inicio' => $inicio, 'fin' => $fin)));
    }

    function gestionarejerciciosAction()
    {
        if (!$this->global->Estructura->idestructura) {
            throw new ZendExt_Exception('CONF116');
        } else {
            /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
            $this->render();
        }
    }

    /**
     * Obtiene todos los ejercicios contables
     *
     * @return array Arreglo de cantidad de elementos y los datos
     */
    public function cargarejercicioscAction()
    {
        try {
            $elementos = DatEjerciciocontable::EjerciciosC(
                array('idestructuracomun' => $this->global->Estructura->idestructura)
            );
            if (!empty($elementos)) {
                foreach ($elementos as $i => $elm) {
                    $elementos[$i]['antecesor'] = $elm['idejercicio'];
                    unset($elementos[$i]['idejercicio']);
                    unset($elementos[$i]['inicio']);
                    unset($elementos[$i]['fin']);
                    unset($elementos[$i]['version']);
                    unset($elementos[$i]['idestructuracomun']);
                    unset($elementos[$i]['annonatural']);
                }
            }

            $el = array('cant' => count($elementos), 'datos' => $elementos);
            echo (json_encode($el));
            return;
        } catch (Doctrine_Exception $error) {
            throw new ZendExt_Exception('CONF114', $error);
        }
    }

    /**
     * Obtiene todos los ejercicios dependiendo de los criterios de búsqueda
     *
     * @return array Arreglo de cantidad de elementos y los datos
     */
    function obtenerejerciciosAction()
    {
        //var_dump($this->integrator->datosmaestros->getDocumentsByParams(array('abreviatura'=> 'cambiocuenta')));
        try {
            $condiciones = $this->_request->getPost();
            $start = ($condiciones['start']) ? $condiciones['start'] : 0;
            $limit = ($condiciones['limit']) ? $condiciones['limit'] : 20;
            $ejercicios = null;
            if ($condiciones['filtro']) {
                $ejercicios = DatEjerciciocontable::buscarEjerciciosContablesPorNombre(
                    $condiciones['filtro'], $start, $limit
                );
            } elseif ($filter = $_REQUEST["filter"]) {
                $filter = $_REQUEST["filter"];
                $ejercicios = DatEjerciciocontable::buscarEjerciciosContables($filter, $start, $limit);
            } else {
                $ejercicios = DatEjerciciocontable::obtenerEjerciciosContables(
                    /*$condiciones['idestructuracomun'], */$start, $limit
                );
            }
            echo (json_encode($ejercicios));
            return;
        } catch (Exception $error) {
            return $error->getMessage();
        }
    }

    /**
     * Inserta un ejercicio y en el caso de ser natural también inserta los períodos correspondientes
     *
     * @return code Código de respuesta
     */
    public function insertarejercicioAction()
    {
        //$idEntidadComun = $this->global->Estructura->idestructura;
        $ultimoEjercicio = DatEjerciciocontable::ultimoEjercicioContable();
        $idEjercicioAnterior = ($ultimoEjercicio == 0) ? 0 : $ultimoEjercicio->idejercicio;
        list($annoActual, $nombre, $annoAnterior) = $this->verificarAnho($ultimoEjercicio, $idEjercicioAnterior);
        $finEjercicio = $annoActual . '-' . '12-31';
        $inicioEjercicio = $annoActual . '-' . '01-01';
        $objDatEjercicioContable = $this->inicializarDatEjercicioContable(
            $nombre, $finEjercicio, $inicioEjercicio, $annoAnterior
        );
        $yaExisteNomEjecicio = DatEjercicioContable::YaExisteNomEjercicioInsrt($objDatEjercicioContable);
        if ($yaExisteNomEjecicio == true) {
            echo("{'codMsg':-6}");
            return;
        }
        if (self::fechaInicioMayor($objDatEjercicioContable->inicio, $objDatEjercicioContable->fin)) {
            echo("{'codMsg':-8}");
            return;
        }
        if (self::verificarIntervalosFechaEjercicio(
            null, $objDatEjercicioContable->inicio, $objDatEjercicioContable->fin
        )
        ) {
            echo("{'codMsg':-7}");
            return;
        }
        $yaExisteEjecicio = DatEjercicioContable::YaExisteEjercicioFechasInsert($objDatEjercicioContable);
        if ($yaExisteEjecicio == true) {
            echo("{'codMsg':-5}");
            return;
        }
        $commitEjercicio = $this->objEjercicioModel->insertarDatEjerciciocontable($objDatEjercicioContable);
        if ($commitEjercicio) {
            $objDatPeriodoContable = $this->inicializarDatPeriodoContable($annoActual, $objDatEjercicioContable);
            $code = $this->insertarPeriodoEjercicioNatural($objDatPeriodoContable);
        } else {
            if ($this->_request->getPost('anonatural') == 1) {
                $code = $this->proximo($this->_request->getPost('proximo'));
                echo("{'codMsg':$code}");
                return;
            }
            $code =  -4;
        }
        echo("{'codMsg':$code}");
        return;
    }

    /**
     * Comprueba que la fecha inicio no exceda la fecha fin
     *
     * @param date $inicio Fecha inicio
     * @param date $fin Fecha fin
     *
     * @return bool
     */
    private function fechaInicioMayor($inicio, $fin)
    {
        list($dInicio, $mInicio, $aInicio) = explode('/', $inicio);
        list($dFin, $mFin, $aFin) = explode('/', $fin);

        return mktime(0, 0, 0, $mInicio, $dInicio, $aInicio) > mktime(0, 0, 0, $mFin, $dFin, $aFin);
    }

    /**
     * Inserta un grupo de período pertenecientes a un ejercicio natural
     *
     * @param object $objDatPeriodoContable
     *
     * @return int Código de respuesta
     */
    private function insertarPeriodoEjercicioNatural($objDatPeriodoContable)
    {
        $code = 0;
        if ($this->objPeriodoModel->insertarPeriodoContEjercicioNat($objDatPeriodoContable)) {
            $code = -1;
            return $code;
        }
        return $code;
    }

    /**
     * Verifica la existencia del campo próximo
     *
     * @return int Código de respuesta
     */
    private function proximo($proximo)
    {
        if (!$proximo) {
            $code = -2;
            return $code;
        } else {
            $code = -3;
            return $code;
        }
    }

    /**
     * Inicializa un arreglo de objetos DatPeriodoContable
     *
     * @param int $annoActual Año actual
     * @param array $objDatEjercicioContable Arreglo de objetos DatPeriodoContable
     *
     * @return array $objDatPeriodoContable Arreglo de objetos de DatPeriodoContable
     */
    private function inicializarDatPeriodoContable($annoActual, $objDatEjercicioContable)
    {
        $objDatPeriodoContable = array();
        if ($this->_request->getPost('anonatural')) {
            $m = $this->_request->getPost();
            $idejercicio = $objDatEjercicioContable->idejercicio;
            $meses = array('01' => $m['enero'], '02' => $m['febrero'], '03' => $m['marzo'], '04' => $m['abril'],
                           '05' => $m['mayo'], '06' => $m['junio'],
                           '07' => $m['julio'], '08' => $m['agosto'], '09' => $m['septiembre'],
                           '10' => $m['octubre'], '11' => $m['noviembre'], '12' => $m['diciembre'],
                           '13' => 'Periodo de cierrre');
            for ($i = 0; $i < 12; $i++) {
                $mktime = mktime(0, 0, 0, $i, 0, $annoActual);
                $objDatPeriodoContable[] = $this->crearPeriodoContable($annoActual, $meses, $mktime, $idejercicio);
                if ($i == 1) {
                    $objDatPeriodoContable[] = $this->crearPeriodoContable(
                        $annoActual, $meses, $mktime, $idejercicio, true
                    );
                }
            }
            return $objDatPeriodoContable;
        }
        return $objDatPeriodoContable;
    }

    private function crearPeriodoContable($annoActual, $meses, $mktime, $idejercicio, $cierre = false)
    {
        $datperiodo = new DatPeriodocontable;
        $ffin = $annoActual . '-' . strftime("%m", $mktime) . '-' . strftime("%d", $mktime);
        $finicio = $annoActual . '-' . strftime("%m", $mktime) . '-' . '1';
        $datperiodo->nombre = $meses[strftime("%m", $mktime)];
        if ($cierre) {
            $finicio = $ffin;
            $datperiodo->nombre = $meses['13'];
        }
        $datperiodo->inicio = $finicio;
        $datperiodo->fin = $ffin;
        $datperiodo->idejercicio = $idejercicio;
        $datperiodo->version = 0;
        return $datperiodo;
    }

    /**
     * Inicializa el objeto DatEjercicioContable
     *
     * @param string $nombre nombre de ejercicio
     * @param date $finEjercicio Fecha fin
     * @param date $inicioEjercicio Fecha inicio
     * @param int $annoAnterior Año anterior
     *
     * @return DatEjerciciocontable $objDatEjercicioContable objeto DatEjercicioContable
     */
    private function inicializarDatEjercicioContable($nombre, $finEjercicio, $inicioEjercicio, $annoAnterior)
    {
        $objDatEjercicioContable = new DatEjerciciocontable();
        $objDatEjercicioContable->nombre = $nombre;
        $objDatEjercicioContable->fin = (!$this->_request->getPost('anonatural')) ? $this->_request->getPost('fechaf')
            : $finEjercicio;
        $objDatEjercicioContable->inicio = (!$this->_request->getPost('anonatural')) ? $this->_request->getPost('feci')
            : $inicioEjercicio;
        $objDatEjercicioContable->annonatural = ($this->_request->getPost('anonatural')) ? 1 : '0';
        $objDatEjercicioContable->antecesor = $annoAnterior;
        $objDatEjercicioContable->version = 0;
        return $objDatEjercicioContable;
    }

    /**
     * Asigna los datos que correspondan con un año natural
     *
     * @param object $ultimoEjercicio Objeto que contiene una instancia del último ejercicio
     * @param int $idEjercicioAnterior Identificador de ejercicio
     *
     * @return array arreglo con los datos $annoActual, $nombre, $annoAnterior
     */
    private function verificarAnho($ultimoEjercicio, $idEjercicioAnterior)
    {
        if ($this->_request->getPost('anonatural')) {
            $tmp = explode("/", $ultimoEjercicio->fin);
            $annoUlt = $tmp[2];
            if (!empty($ultimoEjercicio)) {
                $annoActual = $annoUlt + 1;
                $nombre = $annoActual;
                $annoAnterior = $ultimoEjercicio->idejercicio;
                return array($annoActual, $nombre, $annoAnterior);
            } else {
                $annoActual = date('Y');
                $nombre = date('Y');
                $annoAnterior = 0;
                return array($annoActual, $nombre, $annoAnterior);
            }
        } else {
            $annoActual = $this->_request->getPost('nombre');
            $nombre = $this->_request->getPost('nombre');
            $annoAnterior = $idEjercicioAnterior;
            return array($annoActual, $nombre, $annoAnterior);
        }
    }

    /**
     * Modifica un ejercicio
     *
     * @return code Código de respuesta
     */
    public function modificarejercicioAction()
    {
        $idEjercicio = $this->_request->getPost('idejercicio');
        $inicioEjer = $this->_request->getPost('dfDesde');
        list($dInicio, $mInicio, $aInicio) = explode('/', $inicioEjer); //fecha inicio del Ejericio contable a modificar
        $finEjer = $this->_request->getPost('dfHasta');
        list($dFin, $mFin, $aFin) = explode('/', $finEjer); //fecha fin del Ejericio contable a modificar
        $mayor = (mktime(0, 0, 0, $mInicio, $dInicio, $aInicio) == mktime(0, 0, 0, $mFin, $dFin, $aFin)) ? 1
            : 0; //comparo las fechas
        if ($mayor == 1) {
            echo("{'codMsg':-7}");
            return;
        }
        if (self::fechaInicioMayor($inicioEjer, $finEjer)) {
            echo("{'codMsg':-8}");
            return;
        }
        $objPeriodoContable = new DatPeriodocontable();
        $objDatEjercicio = new DatEjerciciocontable();
        //Obteniendo primer periodo
        $primerPeriodoDadoEjer = $objPeriodoContable->primerPeriodoObjeto($idEjercicio);
        $primerPeriodo = false;
        if (count($primerPeriodoDadoEjer) != 0) {
            $primerPeriodo = true;
        }
        list($dPrimeroInicio, $mPrimeroInicio, $aPrimeroInicio) = explode('/', $primerPeriodoDadoEjer['InicioMin']);
        //Obteniendo el Ejercicio que le sigue al que se pretende modificar
        $ejercicioSiguiente = $objDatEjercicio->FechaEjercicioSiguiente($idEjercicio, $inicioEjer);
        $siguienteEjercicio = false;
        if ($ejercicioSiguiente) {
            $siguienteEjercicio = true;
        }
        list($dSiguienteFin, $mSiguienteFin, $aSiguienteFin) = explode('/', $ejercicioSiguiente[0]['fin']);
        //list($d32, $m32, $a32) = explode('/', $periodoSiguiente[0]['fin']);
        //Obteniendo ultimo periodo
        $ultimoPeriodoDadoEjer = $objPeriodoContable->ultimoPeriodoObjeto($idEjercicio);
        $ultimoPeriodo = false;
        if (count($ultimoPeriodoDadoEjer != 0)) {
            $ultimoPeriodo = true;
        }
        list($dPrimeroFin, $mPrimeroFin, $aPrimeroFin) = explode('/', $ultimoPeriodoDadoEjer['finMax']);
        //Obteniendo el Ejercicio anterior al que se pretende modificar
        $ejercicioAnterior = $objDatEjercicio->FechaEjercicioAnterior($idEjercicio, $finEjer);
        $anteriorEjercicio = false;
        if ($ejercicioAnterior) {
            $anteriorEjercicio = true;
        }
        list($dAnteriorFin, $mdAnteriorFin, $adAnteriorFin) = explode('/', $ejercicioAnterior[0]['fin']);
        //list($d42, $m42, $a42) = explode('/', $periodoAnterior[0]['inicio']);

        //validando que la fecha de inicio del Ejercicio a modificar sea menor o igual que la de fin del primer
        //periodo y mayor que la fecha fin del Ejercicio anterior
        if ((!$primerPeriodo || !$anteriorEjercicio)
            || (mktime(0, 0, 0, $mInicio, $dInicio, $aInicio) <= mktime(
                    0, 0, 0, $mPrimeroInicio, $dPrimeroInicio, $aPrimeroInicio
                )
                && mktime(0, 0, 0, $mInicio, $dInicio, $aInicio) >= mktime(
                    0, 0, 0, $mdAnteriorFin, $dAnteriorFin, $adAnteriorFin
                ))
        ) {
            //validando que la fecha fin del Ejercicio a modificar sea mayor o igual que la fecha inicio del ultimo
            //periodo y menor o igual que la fecha inicio del Ejercicio siguiente
            if ((!$ultimoPeriodo || !$siguienteEjercicio)
                || (mktime(0, 0, 0, $mFin, $dFin, $aFin) >= mktime(0, 0, 0, $mPrimeroFin, $dPrimeroFin, $aPrimeroFin)
                    && mktime(0, 0, 0, $mFin, $dFin, $aFin) <= mktime(
                        0, 0, 0, $mSiguienteFin, $dSiguienteFin, $aSiguienteFin
                    ))
            ) {
                //a modificar ejercicio y realizar validaciones standares
                $objDatEjercicioContable = Doctrine::getTable('DatEjerciciocontable')->find($idEjercicio);
                $objDatEjercicioContable->nombre = $this->_request->getPost('nombre');
                $objDatEjercicioContable->idejercicio = $idEjercicio;
                $objDatEjercicioContable->version = $this->_request->getPost('version');
                $objDatEjercicioContable->inicio = $this->_request->getPost('dfDesde');
                $objDatEjercicioContable->fin = $this->_request->getPost('dfHasta');
                $yaExisteNomEjecicio = DatEjercicioContable::YaExisteNomEjercicio($objDatEjercicioContable);
                if ($yaExisteNomEjecicio == true) {
                    echo("{'codMsg':-2}");
                    return;
                }
                $yaExisteEjecicio = DatEjercicioContable::YaExisteEjercicioFechas($objDatEjercicioContable);
                if ($yaExisteEjecicio == true) {
                    echo("{'codMsg':-3}");
                    return;
                }
                if ($this->objEjercicioModel->modificarDatEjerciciocontable($objDatEjercicioContable)) {
                    echo("{'codMsg':-1}");
                } else {
                    echo("{'codMsg':-4}");
                    return;
                }
            } else {
                echo("{'codMsg': -5}"); //la fecha fin del ejercicio se encuentra dentro de un periodo contable.
                return;
            }
        } else {
            echo("{'codMsg': -6}"); //la fecha inicio del ejercicio se encuentra dentro de un periodo contable.
            return;
        }

    }

    /**
     * Elimina uno o varios Ejercicios
     *
     * @return int Retorna "-1" si se elimino satisfactoriamente, en otro caso,
     * el codigo correspondiente a la interruccion
     * @author Ing. Lisvany Alonso Martinez
     */
    public function eliminarejercicioAction()
    {
        $idEjercicio = $this->_request->getPost('idejercicio');
        if (strpos($this->_request->getPost('idejercicio'), ',')) {
            $arrayIdEjercicios = explode(",", $idEjercicio);
            foreach ($arrayIdEjercicios as $idejercicio) {
                $periodosDel = $this->eliminarPeriodosPorIdEjercicio($idejercicio);
                if ($periodosDel) {
                    echo("{'codMsg':-4}");
                    return;
                }
                $objDatEjerciciocontable = Doctrine::getTable('DatEjerciciocontable')->find($idejercicio);
                if ($this->objEjercicioModel->eliminarDatEjerciciocontable($objDatEjerciciocontable) === '-4') {
                    echo("{'codMsg':-4}");
                    return;
                }
            }
            echo("{'codMsg':-2}");
            return;
        } else {
            $periodosDel = $this->eliminarPeriodosPorIdEjercicio($idEjercicio);
            if ($periodosDel) {
                echo("{'codMsg':-4}");
                return;
            }
            $objDatEjerciciocontable = Doctrine::getTable('DatEjerciciocontable')->find($idEjercicio);
            if ($this->objEjercicioModel->eliminarDatEjerciciocontable($objDatEjerciciocontable) === '-4') {
                echo("{'codMsg':-4}");
                return;
            } else {
                echo("{'codMsg':-1}");
                return;
            }
        }

    }

    /**
     * Elimina todos los periodos pertenecientes a un Ejercicio
     *
     * @param int $idejercicio Identificador de Ejerciccio
     *
     * @return bool Retorna 'true' si los elimina, falso si estan siendo utilizados
     * @author Ing. Lisvany Alonso Martinez
     */
    private function eliminarPeriodosPorIdEjercicio($idejercicio)
    {
        $start = 0;
        $limit = null;
        $elementos = DatPeriodocontable::getPeriodos(array('idejercicio' => $idejercicio), $limit, $start);
        if ($elementos['cant'] != 0) {
            $objDatPeriodocontable = array();
            foreach ($elementos['datos'] as $i) {
                $objDatPeriodocontable[$i] = $elementos[$i]['idperiodo'];
            }
            if ($this->objPeriodoModel->eliminarVariosPeriodosContable($objDatPeriodocontable) === '-4') {
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * Obtiene un ejercicio dado su ID
     *
     * @return array Arreglo de ejercicio
     */
    public function cargarformejercicioAction()
    {
        $ejercicio = DatEjerciciocontable::buscarEjercicio(
            array('idejercicio' => $this->_request->getPost('idejercicio'))
        );
        echo(json_encode(array('ejercicio' => $ejercicio['datos'])));
        return;
    }

    /**
     * Verifica las fechas de ejercicio
     *
     * @return code Código de respuesta
     */
    public function verifdatejercAction()
    {
        $idejercicio = $this->_request->getPost('idejercicio');
        $inicioEjer = $this->_request->getPost('inicio');
        $finEjer = $this->_request->getPost('fin');
        $ejercicio = DatEjerciciocontable::buscarEjercicio(array('idejercicio' => $idejercicio));
        if ($ejercicio['datos'][0]['nombre'] == $this->_request->getPost('nombre')
            && $ejercicio['datos'][0]['inicio'] == $inicioEjer
            && $ejercicio['datos'][0]['fin'] == $finEjer
        ) {
            echo("{'retorno': '-1'}");
            return;
        }
        if (self::verificarIntervalosFechaEjercicio($idejercicio, $inicioEjer, $finEjer)) {
            echo("{'retorno': '-2'}");
            return;
        }
        list($edInicio, $emInicio, $eaInicio) = explode('/', $inicioEjer);
        list($edFin, $emFin, $eaFin) = explode('/', $finEjer);

        $objDatEjercicio = new DatEjerciciocontable();
        $ejercicioSiguiente = $objDatEjercicio->FechaEjercicioSiguiente($idejercicio, $ejercicio['datos'][0]['inicio']);
        list($edSiguenteInicio, $emSiguenteInicio, $eaSiguenteInicio) = explode('/', $ejercicioSiguiente[0]['inicio']);
        $ejercicioAnterior = $objDatEjercicio->FechaEjercicioAnterior($idejercicio, $ejercicio['datos'][0]['fin']);
        list($edAnteriorFin, $emAnteriorFin, $eaAnteriorFin) = explode('/', $ejercicioAnterior[0]['fin']);

        /*$objPeriodoContable = new DatPeriodocontable();
        $primerPeriodoDadoEjer = $objPeriodoContable->primerPeriodoObjeto($idejercicio);
        list($pd1, $pm1, $pa1) = explode('/', $primerPeriodoDadoEjer['InicioMin']);
        $ultimoPeriodoDadoEjer = $objPeriodoContable->ultimoPeriodoObjeto($idejercicio);
        list($pd2, $pm2, $pa2) = explode('/', $ultimoPeriodoDadoEjer['finMax']);*/
        if ($this->verificarDatosEjercicioPenultimoRetorno(
            $idejercicio, $emInicio, $edInicio, $eaInicio, $emSiguenteInicio, $edSiguenteInicio, $eaSiguenteInicio,
            $emAnteriorFin, $edAnteriorFin, $eaAnteriorFin, $emFin, $edFin, $eaFin
        )
        ) {
            echo("{'retorno': '-3'}");
            return;
        }
        echo("{'retorno': '0'}");
        return;
    }

    /**
     * Verifica que el ejercicio contenga algún período, adem\xE1s comprobar las fechas inicio y fin
     *
     * @param int $idejercicio Identificador de Ejercicio
     * @param int $emInicio Mes inicio ejercicio actual
     * @param int $edInicio Día inicio ejercicio actual
     * @param int $eaInicio Año inicio ejercicio actual
     * @param int $emSiguenteInicio Mes Inicio ejercicio siguiente
     * @param int $edSiguenteInicio Día inicio ejercicio siguiente
     * @param int $eaSiguenteInicio Año inicio ejercicio siguiente
     * @param int $emAnteriorFin Mes fin ejercicio anterior
     * @param int $edAnteriorFin Día fin ejercicio anterior
     * @param int $eaAnteriorFin Año fin ejercicio anterior
     * @param int $emFin Mes fin ejercicio actual
     * @param int $edFin Día fin ejercicio actual
     * @param int $eaFin Año fin ejercicio actual
     *
     * @return bool
     */
    private function verificarDatosEjercicioPenultimoRetorno(
        $idejercicio, $emInicio, $edInicio, $eaInicio, $emSiguenteInicio, $edSiguenteInicio, $eaSiguenteInicio,
        $emAnteriorFin, $edAnteriorFin, $eaAnteriorFin, $emFin, $edFin, $eaFin
    )
    {
        return DatPeriodocontable::HayPeriodo($idejercicio)
            && (mktime(0, 0, 0, $emInicio, $edInicio, $eaInicio) > mktime(
                0, 0, 0, $emSiguenteInicio, $edSiguenteInicio, $eaSiguenteInicio
                )
                || mktime(0, 0, 0, $emInicio, $edInicio, $eaInicio) < mktime(
                    0, 0, 0, $emAnteriorFin, $edAnteriorFin, $eaAnteriorFin
                )
                || mktime(0, 0, 0, $emFin, $edFin, $eaFin) > mktime(
                    0, 0, 0, $emSiguenteInicio, $edSiguenteInicio, $eaSiguenteInicio
                )
                || mktime(0, 0, 0, $emFin, $edFin, $eaFin) < mktime(
                    0, 0, 0, $emAnteriorFin, $edAnteriorFin, $eaAnteriorFin
                ));
    }

    /**
     * Verifica que un intervalo fecha ejercicio no contenga a los que ya estan definidos
     *
     * @param int  $idejercicio Identificador de Ejercicio
     * @param date $fechaInicio Fecha inicio del Ejercicio
     * @param date $fechaFin    Fecha fin del Ejercicio
     *
     * @return bool Retorna 'true' cuando el intervalo contiene las fechas inicio y fin de otro ejercicio
     * @author Ing. Lisvany Alonso Martinez
     */
    private function verificarIntervalosFechaEjercicio($idejercicio, $fechaInicio, $fechaFin)
    {
        $fechasEjercicios = DatEjerciciocontable::getFechaEjercicios($idejercicio);
        return self::verificarIntervalosFecha($fechasEjercicios, $fechaInicio, $fechaFin);
    }

    /**
     * Obtiene el último ejercicio
     *
     * @return mixed Arreglo de ejercicio o código de respuesta "-2"
     */
    public function obtenerultimoejercicioAction()
    {
        $ultimoEjercicio = DatEjerciciocontable::ultimoEjercicioContable(/*$this->global->Estructura->idestructura*/);
        if ($ultimoEjercicio) {
            echo json_encode($ultimoEjercicio->toArray());
        } else {
            echo("{'codMsg':-2}");
        }
    }

    /**
     * Obtiene los períodos de acuerdo con los criterios de búsqueda
     *
     * @return array Arreglo de períodos
     */
    public function obtenerperiodosAction()
    {
        try {
            $start = $this->_request->getPost('start');
            $limit = $this->_request->getPost('limit');
            $elementos = null;
            if ($filter = $_REQUEST["filter"]) {
                $filter = $_REQUEST["filter"];
                $elementos = DatPeriodocontable::buscarPeriodosContables(
                    $this->_request->getPost('idejercicio'), $filter, $start, $limit
                );
            } else {
                $elementos = DatPeriodocontable::getPeriodos(
                    array('idejercicio' => $this->_request->getPost('idejercicio')), $limit, $start
                );
            }
            /* $apertura = null;
             $cierre = null;
             if ($elementos['cant'] > 2) {
                 reset($elementos);
                 $aux = array();
                 foreach ($elementos['datos'] as $i => $valor)
                     if ($elementos['datos'][$i]['nombre'] == 'Apertura de Ejercicio') {
                         $apertura = $elementos['datos'][$i];
                     } elseif ($elementos['datos'][$i]['nombre'] == 'Cierre de Ejercicio') {
                         $cierre = $elementos['datos'][$i];
                     } else
                         $aux[] = $elementos['datos'][$i];
                 array_unshift($aux, $apertura);
                 array_push($aux, $cierre);
                 $pos = 0;
                 foreach ($aux as $k => $val) {
                     $pos++;
                     $elementos['datos'][$k] = $aux[$k];
                 }
                 for ($pos + 1; $pos < count($elementos['datos']); $pos++)
                     array_pop($elementos);
             }*/
            echo (json_encode($elementos));
            return;

        } catch (Doctrine_Exception $error) {
            throw new ZendExt_Exception('CONF115', $error);
        }
    }

    /**
     * Inserta un período
     *
     * @return code Código de respuesta
     */
    public function insertarperiodoAction()
    {
        $objDatPeriodocontable = new DatPeriodocontable();
        $objDatPeriodocontable->idejercicio = $this->_request->getPost('idejercicio');
        $objDatPeriodocontable->nombre = $this->_request->getPost('nombre');
        $objDatPeriodocontable->inicio = $this->_request->getPost('inicio');
        $objDatPeriodocontable->fin = $this->_request->getPost('fin');
        $objDatPeriodocontable->version = 0;
        if (DatPeriodocontable::ExistNomPeriodo($objDatPeriodocontable)) {
            echo("{'codMsg':-2}");
            return;
        }
        if (self::fechaInicioMayor($objDatPeriodocontable->inicio, $objDatPeriodocontable->fin)) {
            echo("{'codMsg':-6}");
            return;
        }
        if (!DatEjerciciocontable::esValidoPeriodoContable($objDatPeriodocontable)) {
            echo("{'codMsg':-4}");
            return;
        }
        if (self::verificarIntervalosFechaPeriodo(
            null, $objDatPeriodocontable->idejercicio, $objDatPeriodocontable->inicio, $objDatPeriodocontable->fin
        )
        ) {
            echo("{'codMsg':-5}");
            return;
        }
        if (DatPeriodocontable::yaExisteRangoPeriodoContable($objDatPeriodocontable)) {
            echo("{'codMsg':-3}");
            return;
        }
        if ($this->objPeriodoModel->insertarPeriodoContable($objDatPeriodocontable)) {
            echo("{'codMsg':-1}");
            return;
        }
    }

    /**
     * Modifica un período
     *
     * @return code Código de respuesta
     */
    public function modificarperiodoAction()
    {
        $version = $this->_request->getPost('version');
        $idperiodo = $this->_request->getPost('idperiodo');
        $objDatPeriodocontable = Doctrine::getTable('DatPeriodocontable')->find($this->_request->getPost('idperiodo'));
        $objDatPeriodocontable->idperiodo = $idperiodo;
        $objDatPeriodocontable->nombre = $this->_request->getPost('nombre');
        $objDatPeriodocontable->inicio = $this->_request->getPost('inicio');
        $objDatPeriodocontable->fin = $this->_request->getPost('fin');
        if ($objDatPeriodocontable->version != $version) {
            throw new ZendExt_Exception('CONF07');
        } else {
            $objDatPeriodocontable->version = $version;
        }
        if (self::fechaInicioMayor($objDatPeriodocontable->inicio, $objDatPeriodocontable->fin)) {
            echo("{'codMsg':-6}");
            return;
        }
        $code = $this->verificarModPeriodo($objDatPeriodocontable);
        if ($code != 0) {
            echo("{'codMsg':$code}");
            return;
        }
        if (self::verificarIntervalosFechaPeriodo(
            $objDatPeriodocontable->idperiodo, $objDatPeriodocontable->idejercicio, $objDatPeriodocontable->inicio,
            $objDatPeriodocontable->fin
        )
        ) {
            echo("{'codMsg':-5}");
            return;
        }
        if ($this->objPeriodoModel->modificarPeriodocontable($objDatPeriodocontable)) {
            $objDatEjercicioContable = Doctrine::getTable('DatEjerciciocontable')->find(
                $this->_request->getPost('idejercicio')
            );
            if ($objDatEjercicioContable->annonatural == 1) {
                EjerciciocontableModel::desNaturalizarAnno($objDatEjercicioContable);
            }
            echo("{'codMsg':-1}");
            return;
        }

    }

    /**
     * Efectúa las verificaciones correspondientes para la modificación de un período
     *
     * @param $objDatPeriodocontable
     *
     * @return int
     */
    private function verificarModPeriodo($objDatPeriodocontable)
    {
        $code = 0;
        if (DatPeriodocontable::verificar($objDatPeriodocontable)) {
            $code = -4;
        }
        if (DatPeriodocontable::yaExistePeriodoContable($objDatPeriodocontable)) {
            $code = -2;
        }
        if (!DatEjerciciocontable::esValidoPeriodoContable($objDatPeriodocontable)) {
            $code = -3;
            return $code;
        }
        return $code;
    }

    /**
     * Verifica que un intervalo fecha período no contenga a los que ya estan definidos
     *
     * @param int  $idperiodo Identificador de Periodo
     * @param int  $idejercicio Identificador de Ejercicio
     * @param date $fechaInicio Fecha inicio del Periodo
     * @param date $fechaFin    Fecha fin del Periodo
     *
     * @return bool Retorna 'true' cuando el intervalo contiene las fechas inicio y fin de otro ejercicio
     * @author Ing. Lisvany Alonso Martinez
     */
    private function verificarIntervalosFechaPeriodo($idperiodo, $idejercicio, $fechaInicio, $fechaFin)
    {
        $fechasPeriodos = DatPeriodocontable::getFechaPeriodos($idperiodo, $idejercicio);
        return self::verificarIntervalosFecha($fechasPeriodos, $fechaInicio, $fechaFin);
    }

    /**
     * Verifica que un intervalo no contenga a los ya definidos
     *
     * @param array @fechas      Arreglo de fechas
     * @param date  $fechaInicio Fecha inicio
     * @param date  $fechaFin    Fecha fin
     *
     * @return bool Retorna 'true' cuando el intervalo contiene las fechas inicio y fin de otro
     * @author Ing. Lisvany Alonso Martinez
     */
    private function verificarIntervalosFecha($fechas, $fechaInicio, $fechaFin)
    {
        list($dInicioI, $mInicioI, $aInicioI) = explode('/', $fechaInicio);
        list($dFinI, $mFinI, $aFinI) = explode('/', $fechaFin);
        $cont = count($fechas);
        $kInicio = -1;
        $kFin = -1;
        for ($k = 0; $k < $cont; $k++) {
            list($dInicio, $mInicio, $aInicio) = explode('/', $fechas[$k]['inicio']);
            list($dFin, $mFin, $aFin) = explode('/', $fechas[$k]['fin']);
            if ($k == 0
                && (mktime(0, 0, 0, $mInicio, $dInicio, $aInicio)) > (mktime(0, 0, 0, $mInicioI, $dInicioI, $aInicioI))
                && (mktime(0, 0, 0, $mFin, $dFin, $aFin)) < (mktime(0, 0, 0, $mFinI, $dFinI, $aFinI))
            ) {
                return true;
            }
            if ($k == $cont - 1 && (mktime(0, 0, 0, $mFin, $dFin, $aFin)) < (mktime(0, 0, 0, $mFinI, $dFinI, $aFinI))
                && (mktime(0, 0, 0, $mInicio, $dInicio, $aInicio)) > (mktime(0, 0, 0, $mInicioI, $dInicioI, $aInicioI))
            ) {
                return true;
            }
            if ($k + 1 < $cont) {
                list($kInicio, $kFin) = $this->instruccionInternaIntervaloFecha(
                    $fechas, $k, $mInicio, $dInicio, $aInicio, $mInicioI, $dInicioI, $aInicioI, $mFin, $dFin, $aFin,
                    $mFinI, $dFinI, $aFinI, $kInicio, $kFin
                );
            }
        }
        if ($kInicio != $kFin) {
            return true;
        }
        return false;
    }


    /**
     * Verifica que la fecha inicio y fin esten contenidas en los intervalos fechas
     *
     * @param array $fechas Arreglo de fechas
     * @param int $k Índice de recorrido del arreglo $fechas
     * @param int $mInicio Mes Inicio
     * @param int $dInicio Día Inicio
     * @param int $aInicio Año Inicio
     * @param int $mInicioI Mes Inicio Inicial
     * @param int $dInicioI Día Inicio Inicial
     * @param int $aInicioI Año Inicio Inicial
     * @param int $mFin Mes Fin
     * @param int $dFin Día Fin
     * @param int $aFin Año Fin
     * @param int $mFinI Mes Fin Inicial
     * @param int $dFinI Día Fin Inicial
     * @param int $aFinI Año Fin Inicial
     * @param int $kInicio Índice de verificación de la fecha inicio
     * @param int $kFin Índice de verificación de la fecha fin
     *
     * @return array
     */
    private function instruccionInternaIntervaloFecha(
        $fechas, $k, $mInicio, $dInicio, $aInicio, $mInicioI, $dInicioI, $aInicioI, $mFin, $dFin, $aFin, $mFinI, $dFinI,
        $aFinI, $kInicio, $kFin
    )
    {
        list($dSiguienteInicio, $mSiguienteInicio, $aSiguienteInicio) = explode('/', $fechas[$k + 1]['inicio']);
        if ((mktime(0, 0, 0, $mInicio, $dInicio, $aInicio)) <= (mktime(
            0, 0, 0, $mInicioI, $dInicioI, $aInicioI
        ))
            && (mktime(0, 0, 0, $mInicioI, $dInicioI, $aInicioI)) <= (mktime(
                0, 0, 0, $mSiguienteInicio, $dSiguienteInicio, $aSiguienteInicio
            ))
        ) {
            $kInicio = $k;
        }
        list($dSiguienteFin, $mSiguienteFin, $aSiguienteFin) = explode('/', $fechas[$k + 1]['fin']);
        if ((mktime(0, 0, 0, $mFin, $dFin, $aFin)) <= (mktime(0, 0, 0, $mFinI, $dFinI, $aFinI))
            && (mktime(0, 0, 0, $mFinI, $dFinI, $aFinI)) <= (mktime(
                0, 0, 0, $mSiguienteFin, $dSiguienteFin, $aSiguienteFin
            ))
        ) {
            $kFin = $k;
            return array($kInicio, $kFin);
        }
        return array($kInicio, $kFin);
    }

    /**
     * Elimina uno o varios períodos
     *
     * @return code Código de respuesta
     */
    public function eliminarperiodoAction()
    {
        $pIdPeriodo = $this->_request->getPost('idperiodo');
        $pAnnoNatural = $this->_request->getPost('annonatural');
        $pIdEjercicio = $this->_request->getPost('idejercicio');
        if (strpos($pIdPeriodo, ',')) {
            if ($this->objPeriodoModel->eliminarVariosPeriodosContable($pIdPeriodo) === '-4') {
                echo("{'codMsg':-4}");
                return;
            } else {
                if ($pAnnoNatural == '1') {
                    $objDatEjerciciocontable = Doctrine::getTable('DatEjerciciocontable')->find($pIdEjercicio);
                    $this->objEjercicioModel->desNaturalizarAnno($objDatEjerciciocontable);
                }
                echo("{'codMsg':-2}");
                return;
            }
        } else {
            $objDatPeriodocontable = Doctrine::getTable('DatPeriodocontable')->find($pIdPeriodo);
            if ($this->objPeriodoModel->eliminarPeriodocontable($objDatPeriodocontable) === '-4') {
                echo("{'codMsg':-4}");
                return;
            } else {
                if ($pAnnoNatural == '1') {
                    $objDatEjerciciocontable = Doctrine::getTable('DatEjerciciocontable')->find($pIdEjercicio);
                    $this->objEjercicioModel->desNaturalizarAnno($objDatEjerciciocontable);
                }
                echo("{'codMsg':-1}");
                return;
            }
        }
    }

    /**
     * Obtiene un ejercicio dado su ID
     *
     * @return array Arreglo de ejercicio
     */
    public function cargarformperiodosAction()
    {
        $ejercicio = DatEjerciciocontable::buscarEjercicio(
            array('idejercicio' => $this->_request->getPost('idejercicio'))
        );
        echo(json_encode(array('ejercicio' => $ejercicio['datos'])));
        return;
    }

    public function verifdatperAction()
    {
        $periodo = DatPeriodocontable::buscarPeriodo(array('idperiodo' => $this->_request->getPost('idperiodo')));
        if ($periodo['datos'][0]['nombre'] == $this->_request->getPost('nombre')
            && $periodo['datos'][0]['inicio'] == $this->_request->getPost('inicio')
            && $periodo['datos'][0]['fin'] == $this->_request->getPost('fin')
        ) {
            echo("{'retorno': '1'}");
            return;
        }
        echo("{'retorno': '0'}");
        return;
    }

    /**
     * Obtiene todos los intervalos fecha de Ejercicio, para la validación de las fechas inicio y fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    public function intervalosFechaUtilizadosEjercicioAction()
    {
        $ejercicios = DatEjerciciocontable::getFechaEjercicios($this->_request->getPost('idejercicio'));
        echo json_encode(self::disableDates($ejercicios));
        return;
    }

    /**
     * Obtiene todos los intervalos fecha, para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function disableDates($dates)
    {
        if (count($dates) > 0) {
            $disableDates = array();
            foreach ($dates as $date) {
                list($dInicio, $mInicio, $yInicio) = explode('/', $date['inicio']);
                list($dFin, $mFin, $yFin) = explode('/', $date['fin']);
                if (($yInicio == $yFin)) {
                    $disableDates = self::disableDatesForOneYear(
                        $disableDates, $dInicio, $mInicio, $yInicio, $dFin, $mFin, $yFin
                    );
                } else {
                    $disableDates = self::disableDatesForMoreToYear(
                        $disableDates, $dInicio, $mInicio, $yInicio, $dFin, $mFin, $yFin
                    );
                }
            }
            return array("retorno" => $disableDates);
        }
        return array("retorno" => null);
    }

    /**
     * Obtiene todos los intervalos fecha para el período de un año, para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dInicio Día fecha inicio
     * @param int $mInicio Mes fecha inicio
     * @param int $yInicio Año fecha inicio
     * @param int $dFin Día fecha fin
     * @param int $mFin Mes fecha fin
     * @param int $yFin Año fecha fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function disableDatesForOneYear($disableDates, $dInicio, $mInicio, $yInicio, $dFin, $mFin, $yFin)
    {
        if ((($dInicio == 01) && ($mInicio == 01)) && (($dFin == 31) && ($mFin == 12))) {
            array_push($disableDates, "../../$yInicio");
        } else {
            $disableDates = self::leftYear($disableDates, $dInicio, $mInicio, $yInicio, $dFin, $mFin, $yFin);
        }
        return $disableDates;
    }

    /**
     * Obtiene todos los intervalos fecha para cuando el período es m\xE1s de un año,
     * para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dInicio Día fecha inicio
     * @param int $mInicio Mes fecha inicio
     * @param int $yInicio Año fecha inicio
     * @param int $dFin Día fecha fin
     * @param int $mFin Mes fecha fin
     * @param int $yFin Año fecha fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function disableDatesForMoreToYear($disableDates, $dInicio, $mInicio, $yInicio, $dFin, $mFin, $yFin)
    {
        for ($j = $yInicio; $j <= $yFin; $j++) {
            if ($j == $yInicio) {
                $disableDates = self::firstYear($disableDates, $dInicio, $mInicio, $yInicio);
            } elseif (($j == $yFin)) {
                $disableDates = self::lastYear($disableDates, $dFin, $mFin, $yFin);
            } else {
                array_push($disableDates, "../../" . sprintf("%04s", $j));
            }
        }
        return $disableDates;
    }

    /**
     * Obtiene todos los intervalos fecha para el primer año, cuando se trata de varios,
     * utilizado para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dInicio Día fecha inicio
     * @param int $mInicio Mes fecha inicio
     * @param int $yInicio Año fecha inicio
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function firstYear($disableDates, $dInicio, $mInicio, $yInicio)
    {
        if ((($dInicio == 01) && ($mInicio == 01))) {
            array_push($disableDates, "../../$yInicio");
        } else {
            for ($i = $mInicio; $i <= 12; $i++) {
                if (($i == $mInicio) && ($dInicio != 01)) {
                    $disableDates = self::dayToUp($disableDates, $dInicio, $mInicio, $yInicio);
                } else {
                    array_push($disableDates, "../" . sprintf("%02s", $i) . "/$yInicio");
                }
            }
        }
        return $disableDates;
    }

    /**
     * Obtiene todos los intervalos fecha para el último año, cuando se trata de varios,
     * utilizado para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dFin Día fecha fin
     * @param int $mFin Mes fecha fin
     * @param int $yFin Año fecha fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function lastYear($disableDates, $dFin, $mFin, $yFin)
    {
        if ((($dFin == 01) && ($mFin == 01))) {
            array_push($disableDates, "../../$yFin");
        } else {
            for ($i = 01; $i <= $mFin; $i++) {
                if (($i == $mFin) && ($dFin != self::cantDiasPorMes($mFin, $yFin))) {
                    $disableDates = self::dayToBack($disableDates, $dFin, $mFin, $yFin);
                } else {
                    array_push($disableDates, "../" . sprintf("%02s", $i) . "/$yFin");
                }
            }
        }
        return $disableDates;
    }

    /**
     * Obtiene todos los intervalos fecha para cuando el período es menor de un año,
     * para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dInicio Día fecha inicio
     * @param int $mInicio Mes fecha inicio
     * @param int $yInicio Año fecha inicio
     * @param int $dFin Día fecha fin
     * @param int $mFin Mes fecha fin
     * @param int $yFin Año fecha fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function leftYear($disableDates, $dInicio, $mInicio, $yInicio, $dFin, $mFin, $yFin)
    {
        for ($i = $mInicio; $i <= $mFin; $i++) {
            if (($i == $mInicio) && ($dInicio != 01)) {
                $disableDates = self::dayToUp($disableDates, $dInicio, $mInicio, $yInicio);
            } elseif (($i == $mFin) && ($dFin != self::cantDiasPorMes($mFin, $yFin))) {
                $disableDates = self::dayToBack($disableDates, $dFin, $mFin, $yFin);
            } else {
                array_push($disableDates, "../" . sprintf("%02s", $i) . "/$yInicio");
            }
        }
        return $disableDates;
    }

    /**
     * Obtiene todos los intervalos fecha para los días finales de un mes dado,
     * para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dInicio Día fecha inicio
     * @param int $mInicio Mes fecha inicio
     * @param int $yInicio Año fecha inicio
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function dayToUp($disableDates, $dInicio, $mInicio, $yInicio)
    {
        $cant = self::cantDiasPorMes($mInicio, $yInicio);
        for ($k = $dInicio; $k <= $cant; $k++) {
            array_push($disableDates, sprintf("%02s", $k) . "/$mInicio/$yInicio");
        }
        return $disableDates;
    }

    /**
     * Obtiene todos los intervalos fecha para los primeros días de un mes dado,
     * para la validación de las fechas inicio y fin
     *
     * @param array $dates Arreglo de fechas
     * @param int $dFin Día fecha fin
     * @param int $mFin Mes fecha fin
     * @param int $yFin Año fecha fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    private function dayToBack($disableDates, $dFin, $mFin, $yFin)
    {
        for ($k = 01; $k <= $dFin; $k++) {
            array_push($disableDates, sprintf("%02s", $k) . "/$mFin/$yFin");
        }
        return $disableDates;
    }

    /**
     * Obtiene la cantidad de dias asociados a un mes
     *
     * @param int $m Mes
     * @param int $y Año
     *
     * @return int Cantidad de dias
     * @author Ing. Lisvany Alonso Martinez
     */
    private function cantDiasPorMes($m, $y)
    {
        if (is_callable("cal_days_in_month")) {
            return cal_days_in_month(CAL_GREGORIAN, $m, $y);
        } else {
            return date("d", mktime(0, 0, 0, $m + 1, 0, $y));
        }
    }

    /**
     * Obtiene todos los intervalos fecha de Período, para la validación de las fechas inicio y fin
     *
     * @return array $disableDates Arreglo en formato Disables Dates de js para la restricción de intervalos fecha
     * @author Ing. Lisvany Alonso Martinez
     */
    public function intervalosFechaUtilizadosPeriodoAction()
    {
        $periodos = DatPeriodocontable::getFechaPeriodos(
            $this->_request->getPost('idperiodo'), $this->_request->getPost('idejercicio')
        );
        echo json_encode(self::disableDates($periodos));
        return;
    }


}