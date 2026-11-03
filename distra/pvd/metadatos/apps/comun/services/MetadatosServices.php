<?php

/**
 * Class MetadatosServices
 */
class MetadatosServices
{
    /**
     * @var null
     */
    private static $_instance = NULL;
    /**
     * @var null|ZendExt_IoC
     */
    private $_integrator;

    /**
     *
     */
    private function __construct()
    {
        $this->_integrator = ZendExt_IoC::getInstance();
    }

    /**
     * @return MetadatosServices|null
     */
    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * @return array|Exception
     */
    public function dameUIControllers()
    {
        try{

            /**COFIGURACION LINEA BASE RELEASE*/
            $arrayJS = [
                self::dameVentanaDPT()];

          $jsMedios = self::dameVentanaMedios();

          if (is_array($jsMedios)) {
              $arrayJS = array_merge($arrayJS, $jsMedios);
          } else {
              $arrayJS[] = $jsMedios;
          }
            return $arrayJS;
        } catch (Exception $ee){
            return $ee;
        }
    }

    /**
     * @return Exception
     */
    public function dameVentanaMapa()
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->representacion->DevolverJS();
        } catch (Exception $ee){
            return $ee;
        }
    }

    /**
     * @param      $idDPT
     * @param bool $completo
     *
     * @return array
     */
    public function dameRutaDPT($idDPT, $completo = TRUE)
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->datosmaestros->obtenerRutaDPT($idDPT, $completo);
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @param $idDPT
     *
     * @return array
     */
    public function dameDPT($idDPT)
    {
        try{
            $dpa = self::dameRutaDPT($idDPT, TRUE);
            $dpa = $dpa[(count($dpa)) - 1];
            return $dpa;
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @param $idEspecialidad
     *
     * @return array
     */
    public function dameEspecialidad($idEspecialidad)
    {
//        print_r('<pre>');
//        print_r($idEspecialidad);
//        die;

        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->datosmaestros->obtenerEspecialidadPorId($idEspecialidad);
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @param $medios
     *
     * @return array
     */
    public function dameDatosMedio($medios)
    {
        try{
            $mediosParam = [];
            if (is_array($medios)) {
                $mediosParam = $medios;
            } else {
                $mediosParam[] = $medios;
            }
            /** @noinspection PhpUndefinedFieldInspection */
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->logistica->getIndicadoresByParams(['idindicador' => $mediosParam], TRUE);
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @param $espId
     * @param $buscar
     * @param $filtro
     *
     * @return array
     */
    public function dameArbolEspecialidad($espId, $buscar, $filtro)
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            $datos = $this->_integrator->datosmaestros->obtenerArbolEspecialidad($espId, $buscar, $filtro);
            $result = [];
            foreach ($datos as $values) {
                $result [] = [
                    'abreviatura' => $values['abrevespecialidad'], 'denominacion' => $values['denespecialidad'],
                    'text' => $values['text'], 'id' => $values['id'], 'idpadre' => $values['idpadre'],
                    'leaf' => $values['leaf'], 'children' => $values['children']];
            }
            return $result;
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @return array
     */
    public function dameVentanaDPT()
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->datosmaestros->mostrarIUBuscarDPT();
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @return array
     */
    public function dameVentanaMedios()
    {
        try{

            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->logistica->getJsNomencladorProductos();
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @return array
     */
    public function damePaises()
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->datosmaestros->obtenerPaises([]);
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @param      $dominios
     * @param      $ref
     * @param      $recurso
     * @param bool $exclude
     * @param int  $lt
     * @param int  $st
     *
     * @return array
     */
    public function dameUsuariosPorFuncionalidad(
        $dominios, $ref, $recurso, $exclude = FALSE, $lt = 1000, $st = 0
    )
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->seguridad->usersByFuncionality($dominios, $ref, $recurso, $exclude, $lt, $st);
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * @param $idUsuario
     *
     * @return array
     */
    public function dameNombreUsuario($idUsuario)
    {
        try{
            /** @noinspection PhpUndefinedFieldInspection */
            return $this->_integrator->seguridad->nombreUsuario($idUsuario);
        } catch (Exception $ee){
            return [];
        }
    }

    /**
     * Dame los conceptos de nómina
     *
     * @param $idconcepto
     * @param $start
     * @param $limit
     * @param $busqueda
     *
     * @return array
     */
    public function dameConceptosNomina($idconcepto = null, $start = 0, $limit = 0, $busqueda = '')
    {
        try {
            $objectIntegrator = ZendExt_IoC::getInstance();
            $conceptos = $objectIntegrator->pvd->getConceptosPD($idconcepto, $start, $limit, $busqueda);

            return $conceptos;
        } catch (Exception $ee) {
            return array($ee->getMessage());
        }
    }

    public function dameElementoSalarial($arrayIdCargi, $arrayIdConceptos)
    {
        try {
            $objectIntegrator = ZendExt_IoC::getInstance();
            $elemento = $objectIntegrator->pvd->obtenerDatosPagosAdicionalesCargo($arrayIdCargi, $arrayIdConceptos);

            return $elemento;
        } catch (Exception $ee) {
            return array($ee->getMessage());
        }
    }

}