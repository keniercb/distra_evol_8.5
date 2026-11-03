<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Controller
 * @copyright  XETID
 * @version    1.0
 */
class GestionarentidadController extends ZendExt_Controller_Secure
{

    private $r = null;

    /**
     * Gestionar entidad
     *
     */
    function gestionarentidadAction()
    {
        $this->render();
    }
    /**
     * Gestionar entidad carga inicial
     *
     * @throws Exception $e
     */
    //dasfsafas
    function gestionarentidadcargainicialAction()
    {
        try {
            $idsubsistemas = NomSubsistema::ObtenerSubsistemasCierran(); //array(6,4,7);
            $global = ZendExt_GlobalConcept::getInstance();
            $entidad = $global->Estructura->idestructura;
            $integrator = ZendExt_IoC::getInstance();
            $ejercicio = $integrator->parametros->primerEjercicio($entidad);
            foreach ($idsubsistemas as $idsubsistema) { //for($i=0;$i<3;$i++)
                $idsub = DatEstructurasubsist::EncuentraIdEnt($entidad, $idsubsistema['idsubsistema']);
                $cierreest = $integrator->parametros->buscarCierre($idsub);
                //;
                if (!$cierreest) {
                    $periodo = $integrator->parametros->PrimerPeriodo($ejercicio);
                    $integrator->parametros->AdicionarCierre((string)$idsub, $periodo, $ejercicio);
                }
            }
            //die("yeah");
        } catch (Exception $e) {
            throw $e;
        }
        //die("yeah")
        $this->render();
    }

    /**
     * Constructor de la clase
     *
     */
    function init()
    {
        parent::init();
    }

    /**
     * Cargar subsistemas
     *
     * @throws ZendException $ee
     */
    public function cargarsubsAction()
    {
        try {
            $x = $this->global->Estructura->idestructura;
            $start = $this->_request->getPost("start");
            $limit = $this->_request->getPost("limit");
            $cant = DatEstructurasubsist::CantSubs($x);
            $subs = DatEstructurasubsist::GetPorLimite($x, $limit, $start);
            if (count($subs)) {
                $usersArr = array();
                $i = 0;
                foreach ($subs as $s) {
                    $usersArr[$i]['idsubsistema'] = $s['idsubsistema'];
                    $subsistema = NomSubsistema::buscarSubsistema($s['idsubsistema']);
                    //$subsistema  = Doctrine::getTable('NomSubsistema')->find($s['idsubsistema']);
                    $usersArr[$i]['idsubsistematext'] = $subsistema[0]['denominacion'];
                    $estado = Doctrine::getTable('NomEstadosubsistema')->find($s['idestado']);

                    $usersArr[$i]['idestadotext'] = $estado['estado'];
                    $usersArr[$i]['idestado'] = $s['idestado'];
                    $usersArr[$i]['idestructurasubsist'] = $s['idestructurasubsist'];

                    $usersArr[$i]['idestructuracomun'] = $s['idestructuracomun'];
                    //servicio de javier
                    if ($this->integrator->parametros->buscarCierre($usersArr[$i]['idestructurasubsist']) == 1) {
                        $usersArr[$i]['checked'] = 1;
                        $usersArr[$i]['cierremod'] = 1;
                    } else {
                        $usersArr[$i]['checked'] = 0;
                        $usersArr[$i]['cierremod'] = 0;
                    }
                    $i++;
                }
                echo json_encode(array('cantidad_filas' => $cant, 'subsistema' => $usersArr));
            } else {
                echo json_encode(array('cantidad_filas' => 0, 'subsistema' => array()));
            }
        } catch (ZendException $ee) {
            throw $ee;
        }
    }

    /**
     * Cargar Modelo
     *
     * @throws Zend_Exception $ee
     */
    public function cargarmodAction()
    {
        try {
            $idest = $this->_request->getPost('idestructurasubsist');
            $subsistema = Doctrine::getTable('DatEstructurasubsist')->find($idest);
            $array = array();
            $array['idsubsistema'] = $subsistema['idsubsistema'];
            $array['idestado'] = $subsistema['idestado'];
            $subs = Doctrine::getTable('NomSubsistema')->find($subsistema['idsubsistema']);
            $array['idsubsistematext'] = $subs['denominacion'];
            $estado = Doctrine::getTable('NomEstadosubsistema')->find($subsistema['idestado']);
            $array['idestadotext'] = $estado['estado'];
            $array['idestructurasubsist'] = $subsistema['idestructurasubsist'];
            $array['idestructuracomun'] = $subsistema['idestructuracomun'];
            $array['cierremod'] = 1;
            $this->r = $array['cierremod'];
            echo json_encode(array('subsistema' => array($array)));
        } catch (Zend_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Cargar estados
     *
     */
    public function cargarestadosAction()
    {
        $estados = NomEstadosubsistema::BuscarEstados();
        $array = array();
        $i = 0;
        foreach ($estados as $e) {
            $array[$i]['idestado'] = $e['idestado'];
            $array[$i]['idestadotext'] = $e['estado'];
            $i++;
        }
        echo json_encode(array('estado' => $array));
    }

    /**
     * Chequear
     *
     */
    public function checkAction()
    {

        $id = $this->_request->getPost('idestructurasubsist');
        echo json_encode($this->integrator->parametros->buscarCierre($id));
    }

    /**
     * Modificar
     *
     * @throws ZendExt_Exception $e
     */
    public function modificarAction()
    {
        $id = $this->_request->getPost('idestructurasubsist');
        $subsistema = Doctrine::getTable('DatEstructurasubsist')->find($id);
        if ($this->_request->getPost('idestado')) {
            $subsistema['idestado'] = $this->_request->getPost('idestado');
        }
        if (($this->_request->getPost('cierremod')) == 'on') {
            $prueba = 1;
        } else {
            $prueba = 0;
        }
        $idesctructura = $this->_request->getPost('idestructuracomun');
        $integrator = ZendExt_IoC::getInstance();
        try {
            $periodo = $integrator->parametros->PeriodoActualSubsistema(
                $idesctructura, 4
            ); //$this->global->Periodo->periodoactual;
            $ejercicio = $integrator->parametros->EjercicioActualSubsistema(
                $idesctructura, 4
            ); //$this->global->Ejercicio->idejercicioactual;
            if ($prueba == 1) {
                $integrator->parametros->adicionarCierre($id, $periodo, $ejercicio);
            } else {
                $integrator->parametros->eliminarCierre($id);
            }
            $subsistema->save();
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
        $this->showMessage("Datos modificados satisactoriamente");
    }

    /**
     * Prueba
     *
     */
    public function pruebaAction()
    {
        $this->integrator->parametros->fechaCinicial();
    }

    /**
     * Cierre
     *
     */
    public function cierreAction()
    {
        $this->integrator->parametros->cierreCinicial($this->_request->getPost('idestructura'));
    }

}