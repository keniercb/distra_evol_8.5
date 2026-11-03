<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Services
 * @copyright  XETID
 * @version    1.0
 */
class SubsistemasService extends ZendExt_Model {

    /**
     * Constructor de la clase
     */
    public function __construct() {
        parent::ZendExt_Model();
    }

    /**
     * Subsistemas
     *
     * @return NomSubsistema Retorna un nuevo subsistema
     */
    public static function SubSistemas() {
        return new NomSubsistema();
    }

    /**
     * Buscar subsistema por id
     *
     * @param int $idsubsistema Identificador de subsistema
     * @return array Retorna un arreglo con los datos del subsistema
     */
    public function BuscarSubsistemabyid($idsubsistema) {
        $array = NomSubsistema::buscarSubsistema($idsubsistema);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($array);
    }

    /**
     * Buscar estructura subsistema por id
     *
     * @param int $idestsubsist Identificador de estructura subsistema
     * @return array Retorna un arreglo con los datos de la estructura subsistema
     */
    public function BuscarEstSubSistPorId($idestsubsist) {
        $array = DatEstructurasubsist::BuscarSubsistemaEntidad($idestsubsist);
        if (empty($array)) {
            return -1;
        }
        return $array[0]['idsubsistema'];
    }

    /**
     * Buscar subsistema entidad
     *
     * @param int $idsubsistemaent Identificador de subsistema entidad
     * @return array Retorna un arreglo con los datos del subsistema entidad
     */
    public function BuscarSubsistemaEntidad($idsubsistemaent) {
        $array = DatEstructurasubsist::BuscarSubsistemaEntidad($idsubsistemaent);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($array);
    }

    /**
     * Buscar estado por id
     *
     * @param int $idestado
     * @return array Devuelve un arreglo con los datos del estado del subsistema
     */
    public function BuscarEstadobyid($idestado) {
        return NomEstadosubsistema::BuscarEstado($idestado);
    }

    /**
     * Buscar estructura subsistema
     *
     * @param int $identidad Identificador de entidad
     * @param int $idsubsist Identificador de subsistema
     * @return array Retorna un arreglo con los datos de la estructura subsistema
     */
    public function BuscarEstructuraSubsist($identidad, $idsubsist) {
        try {
            $array = DatEstructurasubsist::BuscarEstructuraSubsist($identidad, $idsubsist);
            $standard = new ZendExt_ClassStandard();
            return $standard->Object($array);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas estructura
     *
     * @param int $identidad Identificador de entidad
     * @return array Retorna un arreglo con los datos de subsistema estructura
     */
    public function buscarSubsistemasEstructura($identidad) {
        $array = DatEstructurasubsist::BuscarSubsistemasEstructura($identidad);
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($array);
    }

    /**
     * Obtener subsistema(s) que contabilice(n).
     * @param int $argIdEstruct Id estructura com&uacute;n.
     * @param int $argIdSubsist Id subsistema del nomenclador.
     * @return Array Arreglo de subsistema(s) que contabilice(n) dado el identificador de la entidad com&uacute;n.
     */
    public function buscarSubsistemasEstructuraContabilizan($argIdEstruct, $argIdSubsist) {
        $result = DatEstructurasubsist::buscarSubsistemasEstructuraContabilizan($argIdEstruct, $argIdSubsist);
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($result);
    }

    /**
     * Buscar subsistemas inactivos que contabilizan incluyendo los idsubsitemas pasados por parametro*
     * @param int   $identidad     Identificador de entidad
     * @param array $idsubsistemas Arreglo de idsubsitemas*
     * @return array Retorna un arreglo de objetos de tipo subsitema que esten activos
     */
    public function BuscarSubsistInactivosContab($argIdEstruct, $argIdSubsist) {
        $result = DatEstructurasubsist::BuscarSubsistInactivosContab($argIdEstruct, $argIdSubsist);
        return $result;
    }

    /**
     * Obtener subsistemas
     *
     * @return array Retorna un arreglo de objetos de tipo subsistema
     */
    public function ObtenerSubsistemas() {
        $array = NomSubsistema::ObtenerSubsistemas();
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($array);
    }

    /**
     * Obtener subsistema por la uri
     *
     * @param string $uri Dirección
     * @param int $identidad Identificador de entidad
     * @return array Retorna un arreglo con los datos del subsistema
     */
    public function obtenerSubsitemaURI($uri, $identidad) {
        $array = NomSubsistema::ObtenerSubsitemaURI($uri, $identidad);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($array);
    }

    /**
     * Buscar subsistemas por entidad
     *
     * @param int $identidad Identificador de entidad
     * @return array Retorna un arreglo de subsistemas
     */
    public function BuscarSubsistemasPorEntidad($identidad) {
        $array = DatEstructurasubsist::BuscarSubsistemasPorEntidad($identidad);
        if (!$array) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($array);
    }

    /**
     * Buscar subsistemas activos por entidad
     *
     * @param int $identidad Identificador de entidad
     * @return array Retorna un arreglo con los subsistemas que estan activos en una entidad
     */
    public function BuscarSubsistemasActivosPorEntidad($identidad) {
        $array = DatEstructurasubsist::BuscarSubsistemasActivosPorEntidad($identidad);
        if (!$array) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($array);
    }

    /**
     * Buscar estructura subsistema
     *
     * @param int $identidad Identificador de entidad
     * @param int $idsubsistemas Identificador de subsistemas
     * @return array Retorna un arreglo con los datos de estructura subsistema
     */
    public function BuscarEstructuraSubsit($identidad, $idsubsistemas) {
        if (!empty($idsubsistemas)) {
            $array = DatEstructurasubsist::buscarEstructuraSubsit($identidad, $idsubsistemas);
        } else {
            $array = DatEstructurasubsist::buscarSubsistemasPorEntidad($identidad);
        }
        if (!$array) {
            return array();
        }
        return $array;
    }

    /**
     * Bienvenida
     *
     */
    public function Bienvenida() {
        $dirCtrler = 'http://' . $_SERVER['HTTP_HOST'] . '/configuracion/subsistemas/index.php/bienvenida/bienvenida';
        header("Location: $dirCtrler");
    }

    /**
     * Cierre CI
     *
     * @param int $idestructura Identificador de estructura
     * @param int $idsubsistema Identificador de subsistema
     *
     */
    public function CierreCI($idestructura, $idsubsistema) {
        $estructurasubsist = DatEstructurasubsist::BuscarEstructuraSubsist($idestructura, $idsubsistema);
        DatEstructurasubsist::RealizarApertura($estructurasubsist[0]['idestructurasubsist'], 1);
    }

    /**
     * Finalizar
     *
     */
    public function Finalizar() {
        $dirCtrler = 'http://' . $_SERVER['HTTP_HOST'] . '/configuracion/subsistemas/index.php/bienvenida/finalizar';
        header("Location: $dirCtrler");
    }

    /**
     * Escribir bienvenida
     *
     */
    public function EscribirBienvenida($idestructura) {
        try {
            $idsubs = NomSubsistema::obtenerSubsistemas();
            $global = ZendExt_GlobalConcept::getInstance();
            $identidad = $idestructura ? $idestructura : $global->Estructura->idestructura;
            foreach ($idsubs as $idsub) {
                $existe = DatEstructurasubsist::BuscarEstructuraSubsist($identidad, $idsub['idsubsistema']);
                if (count($existe)) {
                    continue;
                }
                $subs = new DatEstructurasubsist();
                $subs->idestructuracomun = $identidad;
                $subs->idsubsistema = $idsub['idsubsistema'];
                ($idsub['cierra']) ? $subs->contabiliza = 1 : $subs->contabiliza = 0;
                $subs->idestado = 2;
                $subs->save();
                unset($subs);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Escribir cierre
     *
     */
    public function EscribirCierre($idestructura) {
        try {
            $subsistemas = DatEstructurasubsist::ObtenerSubsistemasCierran();
            $global = ZendExt_GlobalConcept::getInstance();
            $entidad = $idestructura ? $idestructura : $global->Estructura->idestructura;
            $integrator = ZendExt_IoC::getInstance();
            $ejercicio = $integrator->datosmaestros->primerEjercicio($entidad);
            foreach ($subsistemas as $subsistema) {
                $idsubs = DatEstructurasubsist::EncuentraIdEnt($entidad, $subsistema['idsubsistema']);
                $cierreest = $integrator->datosmaestros->buscarCierre($idsubs);
                if (empty($cierreest)) {
                    $periodo = $integrator->datosmaestros->primerPeriodo($ejercicio);
                    $integrator->datosmaestros->adicionarCierre($idsubs, $periodo, $ejercicio);
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Encuentra id
     *
     * @param int $id Identificador de entidad
     * @return int Retorna el identificador de estructura
     * @throws Exception $e
     */
    static public function EncuentraId($id, $idestructura) {
        try {
            $global = ZendExt_GlobalConcept::getInstance();
            $identidad = $idestructura ? $idestructura : $global->Estructura->idestructura;
            $idestruct = DatEstructurasubsist::EncuentraIdEnt($identidad, $id);
            return $idestruct;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Encuentra id por id estructura
     *
     * @param int $id Identificador de entidad
     * @param int $idestructura Identificador de estructura
     * @return int Retorna el identificador de estructura
     * @throws Exception $e
     */
    static public function EncuentraIdByIdestructura($id, $idestructura) {
        try {
            $idestruct = DatEstructurasubsist::EncuentraIdEnt($idestructura, $id);
            return $idestruct;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas contables
     *
     * @param int $idestructuracomun Identificador de estructura comùn
     * @return array Retorna un arreglo de objetos de subsistemas contables
     */
    public function ObtenerSubsistemasCont($idestructuracomun) {
        return NomSubsistema::ObtenerSubsistemasCont($idestructuracomun);
    }

    /**
     * Obtener subsistemas finanzas
     *
     * @param int $idestructuracomun Identificador de estructura comùn
     * @return boolean Retorna verdadero si se encuantra algun subsistema falso en otro caso
     */
    public function ObtenerSubsistemasFnz($idestructuracomun) {
        $var = NomSubsistema::ObtenerSubsistemasFnz($idestructuracomun);
        if ($var) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Subsistema de cierre
     *
     * @param int $entidad Identificador de entidad
     * @param int $subsistema Identificador de subsistema
     * @return boolean Retorna verdadero en caso de cerrar el subsistema falso en otro caso
     */
    public function subsistemadeCierre($entidad, $subsistema) {
        $sub = $this->BuscarEstructuraSubsist($entidad, $subsistema);
        if ($sub->cierre) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Subsistema Aperturado
     *
     * @param int $idestructura Identificador de estructura
     * @param int $idsubsistema Identificador de subsistema
     * @return object Retorna un objeto de tipo subsitema que se encuentre aperturado
     */
    public function subsistemaAperturado($idestructura, $idsubsistema) {
        $result = DatEstructurasubsist::SubsistemaAperturado($idestructura, $idsubsistema);
        if (!count($result)) {
            return 0;
        }
        return $result[0]['aperturado'];
    }

    /**
     * Realizar Apertura
     *
     * @param int $idestructura Identificador de estructura
     * @param int $idsubsistema Identificador de subsistema
     *
     */
    public function RealizarApertura($idestructura, $idsubsistema) {
        $estructurasubsist = DatEstructurasubsist::BuscarEstructuraSubsist($idestructura, $idsubsistema);
        DatEstructurasubsist::RealizarApertura($estructurasubsist[0]['idestructurasubsist'], 1);
    }

    /**
     * Verificar menu de subsistemas
     *
     * @param array $array Arreglo de menu
     * @param int $idestructura Identificador de estructura
     * @return array Retorna un arreglo de menu de subsistemas
     */
    public function VerificarMenuSubsistemas($array, $idestructura) {
        $flag = false;
        foreach ($array as $i => $menuuno) {
            if ($menuuno['text'] == 'Contabilidad y finanzas') {
                foreach ($menuuno['menu'] as $j => $menudos) {
                    if ($menudos['text'] == 'Cobros y pagos') {
                        $result = DatEstructurasubsist::subsistemaAperturado($idestructura, 6);
                        $flag = true;
                    } else {
                        if ($menudos['text'] == 'Banco') {
                            $result = DatEstructurasubsist::subsistemaAperturado($idestructura, 12);
                            $flag = true;
                        } else {
                            if ($menudos['text'] == 'Caja') {
                                $result = DatEstructurasubsist::subsistemaAperturado($idestructura, 14);
                                $flag = true;
                            }
                        }
                    }
                    if ($flag) {
                        $aperturado = $result[0]['aperturado'];
                        if ($aperturado) {
                            unset($primero);
                            unset($segundo);
                            foreach ($menudos['menu'] as $k => $menutres) {
                                if ($menutres['text'] == 'Carga inicial' || $menutres['text'] == 'Carga Inicial') {
                                    $primero = array_slice($array[$i]['menu'][$j]['menu'], 0, $k);
                                    $segundo = array_slice($array[$i]['menu'][$j]['menu'], $k + 1);
                                    $array[$i]['menu'][$j]['menu'] = array_merge($primero, $segundo);
                                }
                            }
                        } else {
                            unset($tercero);
                            unset($cuarto);
                            foreach ($menudos['menu'] as $k => $menutres) {
                                if (strstr($menutres['text'], 'Configu') || $menutres['text'] == 'Carga inicial' ||
                                        $menutres['text'] == 'Carga Inicial') {
                                    if ($menudos['text'] == 'Banco' && strstr($menutres['text'], 'Configu')) {
                                        foreach ($menutres['menu'] as $l => $menucuatro) {
                                            if ($menucuatro['text'] == 'Talonario') {
                                                array_splice($array[$i]['menu'][$j]['menu'][$k]['menu'], $l, 1);
                                                break;
                                            }
                                        }
                                    }
                                    if (!$tercero) {
                                        $tercero = array_slice($array[$i]['menu'][$j]['menu'], $k, 1);
                                    } else {
                                        $cuarto = array_slice($array[$i]['menu'][$j]['menu'], $k, 1);
                                    }
                                }
                            }
                            if (count($cuarto)) {
                                $array[$i]['menu'][$j]['menu'] = array_merge($tercero, $cuarto);
                            } else {
                                $array[$i]['menu'][$j]['menu'] = $tercero;
                            }
                        }
                        $flag = false;
                    }
                }
            }
        }
        return $array;
    }

    /**
     * Obtener subsistemas por fecha
     *
     * @return array Retorna un arreglo con los subsistemas por feha
     */
    public function obtenerSubsistemasFecha() {
        $array = NomSubsistema::obtenerSubsistemasFecha();
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($array);
    }

    /**
     * Obtener objeto estructura subsistema por id
     *
     * @param int $idEstructuraSubsistema Identificador de estructura subsistema
     * @return object Retorna un objeto de tipo estructura subsistema
     */
    public function getObjEstructSubsisById($idEstructuraSubsistema) {
        $stdClass = new ZendExt_ClassStandard();
        $estrucsubsist = DatEstructurasubsist::getObjEstructSubsisById($idEstructuraSubsistema);
        return $stdClass->Object($estrucsubsist);
    }

    /**
     * Obtener subsistemas precedentes
     *
     * @param int $idestructurasubsist Identificador de estructura subsistema
     * @return array Retorna un arreglo con los subsistemas precedentes
     */
    public function buscarSubsistemasPrecedentes($idsubsistema, $idestructura) {
        try {
            $instancia = $this->integrator->datosmaestros->buscarInstancia($idestructura, $idsubsistema);
            $precedentes = NomSubsistema::BuscarSubsistemasPrecedentes($instancia->idestructurasubsist);
            $result = array();
            foreach ($precedentes as $v) {
                $result[] = $this->integrator->datosmaestros->buscarInstancia($idestructura, $v['idsubsistema']);
            }
            return $result;
        } catch (Exception $e) {
            return array();
        }
    }

    public function validarCondicionesGeneralesAbrirPeriodo($idsubsistema, $idestructuracomun) {
        return ReabrirperiodocontableModel::servicio_validarCondicionesGeneralesAbrirPeriodo($idsubsistema, $idestructuracomun);
    }

    public function solicitarAbrirPeriodoPorSubsistema($idsubsistema, $idestructuracomun, $observacion) {
        return ReabrirperiodocontableModel::servicio_solicitarAbrirPeriodoPorSubsistema($idsubsistema, $idestructuracomun, $observacion);
    }

    public function cerrarPeriodoReabiertoPorSubsistema($idsubsistema, $idestructuracomun) {
        return ReabrirperiodocontableModel::servicio_cerrarPeriodoReabiertoPorSubsistema($idsubsistema, $idestructuracomun);
    }

}
