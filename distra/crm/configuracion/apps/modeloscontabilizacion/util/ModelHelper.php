<?php

if (!class_exists('ModelHelper')) {

    /**
     * Clase que implementa las funcionalidades neceserias para evaluar los
     * modelos de contabiliazación.
     * 
     * @package ERP Cuba.
     * @version v1.0
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @copyright (c) 2014, XETID.
     */
    class ModelHelper
    {

        private $dir_app;
        private $idmodelo;
        private $config;
        private $integrator;
        private $params;
        private $initialParams;

        public function __construct($idmodelo, $params)
        {
            $this->idmodelo = $idmodelo;
            $this->params = $params;
            $this->initialParams = $params;
            $this->config = array();
            $this->dir_app = Zend_Registry::get('config')->dir_aplication;
            $this->integrator = ZendExt_IoC::getInstance();

//            $o = new ReflectionMethod('ModelHelper', 'transform');
//            $params = $o->getParameters();
//            print_r($params[1]->isArray() ? 'TRUE' : 'FALSE');die;
//            $i = new ReflectionParameter('transform', $parameter);
//            $i->isDefaultValueConstant();
            /* Incluir las dependencias de la clase  */
            $this->includeDependences();
            $this->getDataModelo();
//            $this->formatingConfig();
        }

        /**
         * Incluye todas las clases necesarias para gestionar la información
         * de los modelos de contabiliazación.
         * 
         * @version v1.0
         * @return void.
         * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
         */
        private function includeDependences()
        {
            $base_path = $this->dir_app . '/configuracion/modeloscontabilizacion/';

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
        }

        /**
         * Obtiene toda la configuración del modelo de contabilización.
         * 
         * @version v1.0
         * @return int|array Arreglo con la configuración del modelo de 
         * contabilización o -1 si no existe configuración alguna para el modelo.
         * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
         */
        private function getDataModelo()
        {
            try {
                $query = Doctrine_Query :: create();
                $data = $query->from('DatAsientosContables a')
                        ->leftJoin('a.NomCamposContables c')
                        ->innerJoin('a.NomValoresContables v')
                        ->leftJoin('a.DatSustituciones s')
                        ->leftJoin('s.NomValoresContables v1')
                        ->where("a.idmodelo = ?", array($this->idmodelo))
                        ->execute()
                        ->toArray(true);

                $lenght = count($data);

                if ($lenght) {
                    $this->config = $data;
                }

                return $lenght ? $data : -1;
            } catch (Doctrine_Exception $e) {
                throw $e;
            }
        }

        /**
         * Reformatea la config a una salida entendible para los subsitemas.
         * 
         * @version v1.0
         * @return void
         * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
         */
        private function formatingConfig()
        {
            
        }

        /**
         * Método de acceso al atributo que contiene los datos de configuracion 
         * del modelo.
         * 
         * @version v1.0
         * @return array Arreglo con los datos del modelo
         * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
         */
        public function getConfig()
        {
            return $this->config;
        }

        public function evalModel()
        {
            /* Si tiene configuracion definida */
            print_r($this->config);
            die;
            if (!empty($this->config)) {
                $pases = array();
                foreach ($this->config as $asiento) {
                    $pases[] = $this->transform($asiento);
                }
            } else {
                throw new MCException('El modelo seleccionado no posee ninguna configuraci&oacute;n', 01);
            }
        }

        private function transform($asiento)
        {
            $converted = array();
            if (!empty($asiento)) {
                /* Paso No.1 Obtener la cuenta */
                $cuenta = ($asiento['tipocuenta'] == 2) ?
                        $this->getCuenta($asiento['cuenta']) : $this->getCuenta($asiento['NomCamposContables']);
            }
        }

        /*         * *************************** */
        /* DETERMINACION DE LA CUENTA */
        /*         * *************************** */

        private function getCuenta($cuenta)
        {
            if (empty($cuenta)) {
                throw new MCException('El valor de la cuenta no puede ser vacío', 02);
            } elseif (is_array($cuenta)) {
                if (!empty($cuenta['referencia']) && !empty($cuenta['tipo'])) {
                    return $this->getDynamicAccount($cuenta);
                } else {
                    throw new MCException('La referencia para la cuenta din&aacute;mica \''
                    . $cuenta['nombre'] . '\' no es v&aacute;lida.', 06);
                }
            } elseif (is_numeric($cuenta)) {
                return $this->getAccountById($cuenta);
            } else {
                throw new MCException('Valor de cuenta no permitido', 03);
            }
        }

        private function getAccountById($id)
        {
            $cuenta = $this->integrator->contabilidad->ObtenerCuentasPorId(array($id));
            if (empty($cuenta)) {
                throw new MCException("La cuenta '{$cuenta}' no ha podido ser encontrada", 04);
            } else {
                return $cuenta[0];
            }
        }

        private function getDynamicAccount($campoContable)
        {
            $campoContable['tipo'] = 3;
            // desde un CLASIFICADOR
            if ($campoContable['tipo'] == 1) {
                throw new MCException('NO IMPLEMENTADO.', -1);
            }
            // desde un METODO
            elseif ($campoContable['tipo'] == 3) {
                $campoContable['referencia'] = 'ClasificadoresModel.test';
                $ref = explode('.', $campoContable['referencia']);

                if (!class_exists($ref[0])) {
                    throw new MCException('Referencia a clase inexistente.', 07);
                }
                $clase = $ref[0];
                try {
                    $reflection = new ReflectionMethod($clase, $ref[1]);
                } catch (ReflectionException $exc) {
                    throw $exc;
                }

                $params = $this->params[0];
                $response = $this->executeMethod($reflection, $params, $clase);
                print_r($response);
                die;
                /* Eliminando el parametro que ya se utilizo */
                $this->params = array_shift($this->params);
            }
            // un codigo PHP
            else {
                throw new MCException('NO IMPLEMENTADO.', -1);
            }
        }

        /*         * ******************************* */
        /* FIN DETERMINACION DE LA CUENTA */
        /*         * ******************************* */

        private function executeMethod($reflection, $params, $class = NULL)
        {
//            $o = new ReflectionMethod('ModelHelper', 'transform');
//            $params = $o->getParameters();
//            print_r($params[1]->isArray() ? 'TRUE' : 'FALSE');die;
//            $i = new ReflectionParameter('transform', $parameter);
//            $i->isDefaultValueConstant();
            $params = is_array($params) ? $params : array($params);
            $res = $reflection->invokeArgs(new $class(), $params);
            return $res;
        }

    }

}

class MCException extends Exception
{

    function __construct($message, $code, $previous)
    {
        parent::__construct($message, $code, $previous);
        $this->code = 'MC' . $code;
    }

}
