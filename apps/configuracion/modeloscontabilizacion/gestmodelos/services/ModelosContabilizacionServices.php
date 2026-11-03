<?php

/**
 * Incluye todas las clases necesarias para gestionar la información
 * de los modelos de contabiliazación.
 */

$base_path = Zend_Registry::getInstance()->get('config')->dir_aplication . '/configuracion/modeloscontabilizacion/';

/* CAMPOS CONTABLES */
require_once $base_path . 'gestcamposcontables/models/domain/generated/BaseNomCamposContables.php';
require_once $base_path . 'gestcamposcontables/models/domain/NomCamposContables.php';

/* VALORES CONTABLES */
require_once $base_path . 'gestvalorescontables/models/domain/generated/BaseNomValoresContables.php';
require_once $base_path . 'gestvalorescontables/models/domain/NomValoresContables.php';

/* MODELOS CONTABLES */
require_once $base_path . 'gestmodelos/models/domain/generated/BaseDatAsientosContables.php';
require_once $base_path . 'gestmodelos/models/domain/generated/BaseNomModelosContabilizacion.php';
require_once $base_path . 'gestmodelos/models/domain/generated/BaseDatSustituciones.php';
require_once $base_path . 'gestmodelos/models/domain/DatAsientosContables.php';
require_once $base_path . 'gestmodelos/models/domain/DatSustituciones.php';
require_once $base_path . 'gestmodelos/models/domain/NomModelosContabilizacion.php';


class ModelosContabilizacionServices extends ZendExt_Model
{

    private $dir_app;

    public function __construct()
    {
//        $this->dir_app = Zend_Registry::get('config')->dir_aplication;
//        $this->includeDependences();
        parent::ZendExt_Model();
    }

    /**
     * Este servicio obtiene un Modelo de Contabilizacion por su identificador y contruye
     * la una salida interpretable para cualquier subsistema.
     *
     * @param int $idmodelo Identificador del modelo de contabilizacion
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array Datos a interpretar del modelo
     */
    public function obtenerModeloPorId($idmodelo)
    {
        if (!is_numeric($idmodelo)) {
            return -1;
        }

        $modelo = $this->getModelo($idmodelo);
        $result = $this->prepareData($modelo);
        return $result;
    }

    /**
     * Este servicio obtiene los Modelos de Contabilizacion por su estructura y subsistema.
     *
     * @param int $idstructura  Identificador de la estructura comun
     * @param int $idsubsistema Identificador del subsistema
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array | int  Modelos de contabilizacion o -1 si alguno de los parametros no son valores numericos
     */
    public function obtenerModeloPorSubsistema($idstructura, $idsubsistema)
    {
        if (!is_numeric($idstructura) || !is_numeric($idsubsistema)) {
            return -1;
        }

        return NomModelosContabilizacion::GetByCondition(
            'idsubsistema = ? AND idestructuracomun = ?', array($idsubsistema, $idstructura), true
        );
    }

    /**
     * Este servicio obtiene los Asientos de un Modelo de Contabilizacion
     *
     * @param int $idmodelo Identificador del modelo de contabilizacion
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array Asientos contables
     */
    public function obtenerAsientosModelo($idmodelo)
    {
        if (!is_numeric($idmodelo)) {
            return -1;
        }

        return DatAsientosContables::GetByCondition('idmodelo = ?', array($idmodelo), true);
    }

    /**
     * Este servicio obtiene las Sustituciones definidas para un Asiento determinado
     *
     * @param int $idAsiento Identificador del asiento contable
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array Sustituciones para la cuenta del asiento contable
     */
    public function obtenerSustituciones($idAsiento)
    {
        if (!is_numeric($idAsiento)) {
            return -1;
        }

        return DatSustituciones::GetByCondition(
            'idasiento = ?', array($idAsiento), true
        );
    }

    /************************/
    /* FUNCIONES AUXILIARES */
    /************************/

    /**
     * Funcion que obtiene un Modelo de Contabilizacion por su identificador
     *
     * @param int $idmodelo Identificador del modelo de contabilizacion
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @throws Doctrine_Exception
     * @return array Datos a interpretar del modelo
     */
    private function getModelo($idmodelo)
    {
        try {
            $query = Doctrine_Query:: create();
            $data = $query->from('DatAsientosContables a')
                ->leftJoin('a.NomCamposContables c')
                ->innerJoin('a.NomValoresContables v')
                ->leftJoin('a.DatSustituciones s')
                ->leftJoin('s.NomValoresContables v1')
                ->where("a.idmodelo = ?", array($idmodelo))
                ->execute()
                ->toArray(true);

            return $data;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion que contruye a partir de los datos de un modelo contable
     * una salida que pueda ser interpretable para cualquier subsistema.
     *
     * @param array $arrayAsientos Asientos contables del modelo de contabilizacion
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array Datos a interpretar del modelo
     */
    private function prepareData($arrayAsientos)
    {
        $data = array();
        foreach ($arrayAsientos as $asiento) {
            $addcuenta = true;
            $newAsiento = array(
                'idmodelo'      => $asiento['idmodelo'],
                'creditodebito' => $asiento['creditodebito'],
                'tipocuenta'    => $asiento['tipocuenta'] == 1 ? 'dinamica' : 'fija',
                /* se pone el valor que aparece indice 'cuenta' sin importar si apunta 
                 * a una cuenta fija o a un a dinamica mediante un campo contable,
                 */
                'cuenta'        => $asiento['cuenta']
            );

            /* Si posee una cuenta dinamica se sobre escribe el valor del 
             * indice 'cuenta' por el valor de la refencia a la que apunta el campo
             */
            if (!empty($asiento['NomCamposContables'])) {
                $this->loadCuentas($asiento['NomCamposContables'], $newAsiento);
            }

            if ($asiento['tipocuenta'] == 2 && !$this->existCuenta($asiento['cuenta'])) {
                $addcuenta = false;
            }


            /* Si tiene sustituciones definidas */
            if (!empty($asiento['DatSustituciones'])) {
                $this->loadSustitutions($asiento['DatSustituciones'], $newAsiento);
            }

            /* Si tiene valores contables definidos */
            if (!empty($asiento['NomValoresContables'])) {
                $valor = $this->getValorContable($asiento['NomValoresContables']);
                $newAsiento['valor'] = $valor;
                $newAsiento['valor']['porciento'] = $asiento['porciento'];
            }

            if ($addcuenta) {
                $data[] = $newAsiento;
            }
        }

        return $data;
    }

    /**
     * Funcion auxiliar que se encarga de contruir la refencia a la cuenta del asiento contable.
     *
     * @param array $campoContable Arreglo con la configuracion definida para la cuenta o campo contable
     * @param array $asiento       Asiento contable
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return void
     */
    private function loadCuentas($campoContable, &$asiento)
    {
        if ($campoContable['tipo'] == 1 || $campoContable['tipo'] == 3 || $campoContable['tipo'] == 5) {

            $ref = explode('.', $campoContable['referencia']);
            $tipo
                = $campoContable['tipo'] == 5 ? 'variable' : ($campoContable['tipo'] == 1 ? 'campo' : 'funcionalidad');
            $key1 = $campoContable['tipo'] == 5 ? 'nomenclador' : ($campoContable['tipo'] == 1 ? 'modelo' : 'clase');
            $key2 = $campoContable['tipo'] == 5 ? 'valor' : ($campoContable['tipo'] == 1 ? 'campo' : 'metodo');

            $cuenta = array('tipo' => $tipo, $key1 => $ref[0], $key2 => $ref[1], 'ruta' => $campoContable['ruta']);
            $asiento['cuenta'] = $cuenta;
        } elseif ($campoContable['tipo'] == 6) {
            $cuenta = array('tipo' => 'refestatica', 'valor' => $campoContable['referencia']);
            $asiento['cuenta'] = $cuenta;
        }
    }

    /**
     * Funcion auxiliar que se encarga de contruir la refencia a las sustituciones en la cuenta del asiento contable.
     *
     * @param array $sustitutions Arreglo con la configuracion definida para las sustituciones en la cuenta
     * @param array $asiento      Asiento contable
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return void
     */
    private function loadSustitutions($sustitutions, &$asiento)
    {
        foreach ($sustitutions as $value) {
            $parteFormato = $this->integrator->datosmaestros->obtenerParteFormatoPorId($value['idnivelsustitucion']);

            $sustitution = array(
                'parteformato' => $value['idnivelsustitucion'],
                'nivel'        => !empty($parteFormato) ? $parteFormato[0]->nivel : $value['idnivelsustitucion'],
            );

            if ($value['tipoorigen'] == -1 && !empty($value['NomValoresContables'])) { // si es un valor dinamico
                $valorContable = $this->getValorContable($value['NomValoresContables']);
                $sustitution = array_merge($sustitution, $valorContable);
            } else {
                /* Si es un elemento x el que se puede aperturar las cuentas */
                /* esto es para determinar el nomenclador fuente de origen de los datos */
                $pattern = '/[\s\S]\(array\((\d+),[^,]+,(\w+),(?:[^,]+,){3}[^,]+,(\w+),?/i';
                preg_match_all($pattern, $value['referencia'], $matches, PREG_SET_ORDER);

                if (!empty($matches[0][2])) {
                    $sustitution['tipoorigen'] = $matches[0][2];
                    $sustitution['nomenclador'] = $matches[0][2];
                }
                $concept = '';

                if ($matches[0][2] && $matches[0][3]) {
                    $concept = $matches[0][3] . '.' . $matches[0][2];
                }
                $valores = $this->getSustitutionValues($value, $concept);
                $sustitution = array_merge($sustitution, $valores);
            }
            $asiento['sustituciones'][] = $sustitution;
        }
        $asiento['sustituciones'] = $this->sort_by_nivel($asiento['sustituciones']);
    }

    /**
     * Funcion auxiliar que se encarga de contruir la refencia al valor o importe del asiento contable.
     *
     * @param array $valorcontable Arreglo con la configuracion definida para el valor contable
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array Referencia al valor o importe del asiento contable
     */
    private function getValorContable($valorcontable)
    {
        $valor = array();
        switch ($valorcontable['tipo']) {
            case 1:
            case 2:
                $ref = explode('.', $valorcontable['referencia']);
                $tipo = $valorcontable['tipo'] == 1 ? 'tb_field' : 'function';
                $key1 = $valorcontable['tipo'] == 1 ? 'doctrineClass' : 'class';
                $key2 = $valorcontable['tipo'] == 1 ? 'campo' : 'metodo';
                $valor['tipo'] = $tipo;
                $valor[$key1] = !empty($ref[0]) ? $ref[0] : null;
                $valor[$key2] = !empty($ref[1]) ? $ref[1] : null;
                $valor['ruta'] = $valorcontable['ruta'];
                break;
            case 3:
                $valor['tipo'] = 'cuenta';
                $valor['idcuenta'] = $valorcontable['referencia'];
                /* aqui se puede llmar a un servicio que obtenga la cuenta por el id */
                break;
            case 5:
                $ref = explode('.', $valorcontable['referencia']);
                $valor['tipo'] = 'variable';
                $valor['valor'] = !empty($ref[1]) ? (strpos($ref[1], ',') === false ? $ref[1] : explode(',', $ref[1]))
                    : null;
                $valor['clase'] = !empty($ref[0]) ? $ref[0] : null;
                $valor['ruta'] = $valorcontable['ruta'];
                break;
            case 6:
                $valor['tipo'] = 'refestatica';
                $valor['valor'] = $valorcontable['referencia'];
                break;
            default:
                break;
        }
        return $valor;
    }

    /**
     * Funcion auxiliar que se encarga de contruir la refencia al valor por el que se realiza la sustituciÃ³n en un
     * nivel de la cuenta del asiento contable.
     *
     * @param array  $sustParams Arreglo con la configuracion definida para el valor de la sustitucion a realizar
     * @param string $concept    Texto con la concatenacion del esquema y la tabla unidos por punto
     *
     * @author  ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @version '1.0'
     * @return array Referencia al valor de la sustituciÃ³n
     */
    private function getSustitutionValues($sustParams, $concept = null)
    {
        $valores = array();
        $referencia = explode('.', $sustParams['referencia']);
        $cantArray = substr_count($referencia[0], 'array');
        $idestructura = $this->global->Estructura->idestructura;

        $valores['fuentesustitucion'] = !empty($referencia[1]) ? $referencia[1] : -1;
        $valores['identificador'] = !empty($referencia[2]) ? $referencia[2] : -1;
        $excluir = array('mod_nomina.conf_personacdgocontable');
        $incluircond = array('mod_contabilidadcosto.nom_centrocosto', 'mod_contabilidadcosto.nom_elementogasto');

        if (!in_array($concept, $excluir)) {
            //Agregar condicion en llamada al servicio
            if (in_array($concept, $incluircond)) {
                $cond = ",array(),array(";
                $cond .= '"idestructuracomun = ' . $idestructura . '"';
                $cond .= ")),";
                $referencia[0] = str_replace('),', $cond, $referencia[0]);
            }
            $eval = eval('return ' . $referencia[0] . ';');
            /* Si el eval devuelve un resultado distinto a FALSE (en este caso ocurrio un error) */
            if ($eval && count($eval['data'])) {
                $valores['valores'] = $eval['data'];
            }
        }

        return $valores;
    }

    private function sort_by_nivel($array)
    {
        $n = count($array);
        for ($i = 1; $i < count($array); $i++) {
            for ($j = 0; $j < $n - $i; $j++) {
                if ($array[$j]['nivel'] > $array[$j + 1]['nivel']) {
                    $k = $array[$j + 1];
                    $array[$j + 1] = $array[$j];
                    $array[$j] = $k;
                }
            }
        }
        return $array;
    }

    private function existCuenta($idcuenta)
    {
        try {
            $cuenta = $this->integrator->contabilidad->obtenerCuentaPorId($idcuenta);
            if($cuenta){
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Incluye todas las clases necesarias para gestionar la información
     * de los modelos de contabiliazación.
     *
     * @version v1.0
     * @return void.
     * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     */
//    private function includeDependences()
//    {
//        $base_path = $this->dir_app . '/configuracion/modeloscontabilizacion/';
//        /* CAMPOS CONTABLES */
//        require_once $base_path . 'gestcamposcontables/models/domain/generated/BaseNomCamposContables.php';
//        require_once $base_path . 'gestcamposcontables/models/domain/NomCamposContables.php';
//
//        /* VALORES CONTABLES */
//        require_once $base_path . 'gestvalorescontables/models/domain/generated/BaseNomValoresContables.php';
//        require_once $base_path . 'gestvalorescontables/models/domain/NomValoresContables.php';
//
//        /* MODELOS CONTABLES */
//        require_once $base_path . 'gestmodelos/models/domain/generated/BaseDatAsientosContables.php';
//        require_once $base_path . 'gestmodelos/models/domain/generated/BaseNomModelosContabilizacion.php';
//        require_once $base_path . 'gestmodelos/models/domain/generated/BaseDatSustituciones.php';
//        require_once $base_path . 'gestmodelos/models/domain/DatAsientosContables.php';
//        require_once $base_path . 'gestmodelos/models/domain/DatSustituciones.php';
//        require_once $base_path . 'gestmodelos/models/domain/NomModelosContabilizacion.php';
//    }

}
