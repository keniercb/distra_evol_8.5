<?php

/**
 * Created by JetBrains PhpStorm.
 * User: maricet
 * Date: 5/09/14
 * Time: 3:52
 * Clase que contiene todos los metodos necesarios para el
 * trabajo con estructuraubicacion
 */
class LogisticaEstructuraUbicHelper implements ISingletonClass
{

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;
    private $serviciosEstructComposicion;
    private $serviciosConfigGenral;
    private $serviciosSeguridad;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {

        $this->serviciosConfigGenral = ServiciosConfiguracionGeneralHelper::__init();
        $this->serviciosEstructComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->serviciosSeguridad = ServiciosSeguridadHelper::__init();
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Una instancia unica de LogisticaEstructuraUbicHelper
     *
     * @var LogisticaEstructuraUbicHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class LogisticaEstructuraUbicHelper
     *
     * @return LogisticaEstructuraUbicHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaEstructuraUbicHelper;
        }
        return self::$instance;
    }

    /**
     * Verifica si existen estrucutras no formales
     */
    function verificardepositos()
    {

        $depositos = $this->serviciosEstructComposicion->obtenerEstructurasNoFormales();
        return (count($depositos) != 0) ? true : false;
    }

    function cargardepositos($iddeposito = null, $arrDepositos = array(), $filtro = null, $limit = null, $start = null,
        $tipo = null, $seguridad = true, $caso = 1)
    {
        $idEstructura = $this->varglobal->Estructura->idestructura;
      //  $idsubsistema =  $this->global->Subsistema->idsubsistema;
        $fechaSubsist = $this->integrator->datosmaestros->fechaContableSubsistema($idEstructura, 10);
      
        if (isset($fechasist) && !$filtro) {
            $index = 0;
            $area = $this->serviciosEstructComposicion->getAreasPorId($iddeposito);
            $datos[$index]['iddeposito'] = $iddeposito;
            $datos[$index]['deposito'] = $area[0]['denominacion'];
        } else {
            $idestructura = null;
            if ($seguridad) {
                $idestructura = $this->varglobal->Estructura->idestructura;
            }
            $arraIdsDeposit = null;
            if (isset($iddeposito)) {
                $arraIdsDeposit = array($iddeposito);
            } else {
                $arraIdsDeposit = $this->serviciosSeguridad
                    ->obtenerEstructurasNoFormales($this->varglobal->Perfil->certificado, $tipo == 0 ? 5 : 8);
            }
            if (!empty($arraIdsDeposit)) {
                $depositos = $this->serviciosEstructComposicion->obtenerEstructurasNoFormales(
                    false, $idestructura, $filtro, $limit, $start, $arraIdsDeposit, $tipo
                );
                if (!empty($arrDepositos)) {
                    $depositos = array_intersect($depositos, $arrDepositos);
                }
            }
            $datos = array();
            $estadosDep = Doctrine_Query::create()->select('e.iddeposito,e.estado')
                    ->from("DatEstadoalmacen e INDEXBY e.iddeposito")->fetchArray();
                $fechaDep = Doctrine_Query::create()->select('e.iddeposito,e.fecha')
                ->from("DatEstadoalmacen e INDEXBY e.iddeposito")->fetchArray();

                $cuadrediarioDep = Doctrine_Query::create()->select('cd.idcierrediario,cd.estado,cd.iddeposito')
                ->from("DatHiscuadrediario cd INDEXBY cd.idcierrediario")->fetchArray();
                
  
                foreach ($depositos as $index => &$r) {
                
                    $estado = array_key_exists($r['idfila'], $estadosDep) ? 'Cerrado' : 'Nuevo';
                    $idEstado = array_key_exists($r['idfila'], $estadosDep) ? 3 : 1;
                    $color = array_key_exists($r['idfila'], $estadosDep) ? 'red' : 'blue';

                    if (array_key_exists($r['idfila'],$fechaDep)) {
                        $fecha = ($fechaDep[$r['idfila']]['fecha']) ? $fechaDep[$r['idfila']]['fecha']:$fechaSubsist;
                    }

                    
                  
                    foreach ($cuadrediarioDep as $key => $value) {
                        if ($r['idfila'] == $value['iddeposito'] && $value['estado'] == 1) {
                            $r['cuadrediario'] = 1;
                            break;
                        }        
                    }

                    if ($estadosDep[$r['idfila']]['estado'] == 1 && $r['cuadrediario'] == 1) {
                        $estado = 'En cuadre diario';
                        $color = 'black';
                        $idEstado = 2;
                    }
                    else{
                        if($estadosDep[$r['idfila']]['estado'] == 1){
                            $estado = 'Abierto';
                            $color = 'black';
                            $idEstado = 2;
                        }
                      
                    }
                    $incluir = true;
                    if ($caso == 1 && $idEstado == 3) {//Recepcion y apertura 
                        $incluir = false;
                    } elseif ($caso == 2 && $idEstado == 1) {//Submayor
                        $incluir = false;
                    } elseif ($caso == 3 && $idEstado != 2) {//Procesos de inventario
                        $incluir = false;
                    }
              
                    if ($incluir) {
                        $uxiliar = ($r['DatEstructuraop'][0]['codigo']) ? $r['DatEstructuraop'][0]['codigo'] . ' ' : '';
                        array_push($datos,
                            array(
                            'iddeposito' => $r['idfila'],
                            'id' => $r['idfila'],
                            'deposito' => $uxiliar . $r['text'],
                            'codigo' => $uxiliar,
                            'text' => $r['text'],
                            'leaf' => true,
                            'denestado' => $estado,
                            'estado' => $idEstado,
                            'color' => $color,
                            'fecha' => $fecha,
                            'cuadrediario' => $r['cuadrediario']
                            )
                        );
                    }
                }
            
            }
           
        return array('depositos' => $datos);
    }

    /**
     * @author Javier Glez
     *         Para cargar los depositos un poco mas rapido
     */
    function depositos()
    {
        $certificado = $this->global->Perfil->certificado;
        $depositos = $this->serviciosSeguridad->obtenerEstructurasNoFormales($certificado);
        $datos = '';
        foreach ($depositos as $r) {
            if (empty($datos)) {
                $datos = $r;
            } else {
                $datos .= ',' . $r;
            }
        }

        return $datos;
    }

    public function BuscarHijoPorSubordinacion()
    {
        $entidad = $this->global->Estructura->idestructura;
        //$hijos = $this->integrator->metadatos->BuscarHijoPorSubordinacion($entidad, 2);
        return ($hijos[0]) ? $hijos[0]->idestructura : $entidad;
    }

    public function BuscarPadrePorSubordinacion()
    {
        $entidad = $this->global->Estructura->idestructura;
        // $hijos = $this->integrator->metadatos->BuscarPadrePorSubordinacion($entidad, 2);
        return ($hijos[0]) ? $hijos[0]->idestructura : $entidad;
    }

    public function esDireccion()
    {
        return ($this->global->Estructura->idestructura != $this->BuscarHijoPorSubordinacion()) ? 1 : 0;
    }

}
