<?php

/**
 * Description of MaestroProductoService
 *
 * @author kenier
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MaestroProductoService extends LogisticaComponentService
{

    private $maestroProductoModel, $jsonComponent;

    public function __construct()
    {
        parent::__construct();
        /*parent::ZendExt_Model();
        $this->jsonComponent = JSONComponent::__init();
        $this->jsonComponent->loadDefinitionsFile('srv.definitions');
        $component = $this->jsonComponent->getComponent('log.lb.maestroproductos');
        $this->jsonComponent->loadComponent('log.lb.maestroproductos');
        $this->jsonComponent->buildDependencies($component);
        $this->jsonComponent->getComponentRequiredFiles($component, true);
        $this->jsonComponent->loadPath();*/

        $this->maestroProductoModel = new MaestroProductoModel;
    }

    public function devolverIndicadoresByParams($parametros = array(), $idAsKey = 0, $treeGrid = 0)
    {
        $parametros['grid'] = true;
        return $this->maestroProductoModel->cargarGridNomenclador($parametros, false, $treeGrid == 0, $idAsKey != 0);
//        if ($idAsKey == 0) {
//            return $datos;
//        }
//        $arrayData = array();
//        foreach ($datos['datos'] as $indicador) {
//            $arrayData[$indicador['idindicador']] = $indicador;
//        }
//        return $arrayData;
    }

    public function getJsNomencladorProductos($controller = null)
    {
        return $this->getComponent('log.lb.nomproductos');
    }

    public function getInstanceModelo()
    {
        return new MaestroProductoModel;
    }


    /**
     * Motodo de grupo y subgrupo
     *
     * @param type $idgruposubgrupo
     *
     * @return array
     * maricet 15/09
     */
    public function obteneCualquierGruposHijoPorID($idgruposubgrupo)
    {
        $objetoGrupoSub = new NomGruposubgrupoModel();
        return $objetoGrupoSub->obteneCualquierGruposHijoPorID($idgruposubgrupo);
    }

    /**
     * Motodo de grupo y subgrupo
     *
     * @param type $idgruposubgrupo
     *
     * @return array
     */
    public function obteneCualquierGrupoPorID($idgruposubgrupo)
    {
        $objetoGrupoSub = new NomGruposubgrupoModel();
        return $objetoGrupoSub->obteneCualquierGrupoPorID($idgruposubgrupo);
    }

    public function obtenerPadreGrupoById($idgrupohijo)
    {
        $objGrupo = new NomGruposubgrupo();
        return $objGrupo->obtenerMiPadre($idgrupohijo);
    }
    public function obtenerGruposHojas($parametros)
    {
        $objGrupo = new NomGruposubgrupohoja();
        return $objGrupo->obtenerGruposHojas($parametros);
    }

    public function getInstanceModeloGrupoHoja()
    {
        return new NomGruposubgrupohoja();
    }
    
    /**
     * Devuelve el factor de conversion de un indicador a una unidad de medida.
     * @param array $filtro
     * @return array
     * @throws LogisticaException Excepcion que se lanza de no existir el factor de conversion.
     */
    public function getFactorConversion($filtro)
    {
        return $this->maestroProductoModel->getFactorConversion($filtro);
    }
    
    /**
     * Devuelve los factores de conversion de un indicador.
     * @param array $filtro
     * @return array
     */
    public function getFactoresConversionByIndicador($filtro)
    {
        return $this->maestroProductoModel->cargarFactorConversion($filtro);
    }

    /**
     * Devuelve los hijos y los padres de ese indicador.
     * @param idindicador, minmax
     * @return array
     */
    public function getIdIndicadoresRamaByIndicador($idIndicador,$miniMax=false)
    {
        return $this->maestroProductoModel->getIdIndicadoresRama($idIndicador, $miniMax);
    }
    
    public function cargarGridNomenclador($parametros = array(), $asQuery = false, $treeGrid = false, $indexById = false, $reInitrelations = false)
    {
        return $this->maestroProductoModel->cargarGridNomenclador($parametros, $asQuery, $treeGrid, $indexById, $reInitrelations);
    }

    public function getAtributosDinamicos($idindicador){
        return $this->maestroProductoModel->getAtributosDinamicos($idindicador);
    }

    public function addIndicadorExterno ($params) {
        return $this->maestroProductoModel->addIndicadorExterno($params);
    }
    
    public function eliminarIndicadorCliente($idcliente, $indicadores) {
        return $this->maestroProductoModel->eliminarIndicadorCliente($idcliente, $indicadores);
    }

    public function adicionarNodoClasificador ($params) {
        return $this->maestroProductoModel->adicionarNodoClasificador($params);
    }

}
