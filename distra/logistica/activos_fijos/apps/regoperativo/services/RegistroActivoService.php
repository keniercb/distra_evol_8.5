<?php

/**
 * Description of RegOperativoAFT
 *
 * @author Gerardo
 */
if (!class_exists('BaseModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')
        ->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RegistroActivoService extends LogisticaComponentService
{

    private $regOperativoModel;

    public function __construct()
    {
        parent::__construct();        
    }

    public function getJsRegistroOperativoAFT($controller = null)
    {
        $funcion = ServiciosSeguridadHelper::__init()
            ->getMenuFuncionalidad('/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/gestregoperativo');
        $str = "<script type='text/javascript'> var idFuncionalidadActivo = '{$funcion['idfuncionalidad']}'</script>";
        $arrayUrl = $this->getComponent('log.aft.regoperativo');
        array_push($arrayUrl, $str);
        return $arrayUrl;
    }

    public function devolverRegistrosEstructura($idAreaResp, $idIndicador)
    {
        $jsonCmp = JSONComponent::__init(true);
        $jsonCmp->loadDefinitionsFile('cmp.definitions');
        $jsonCmp->buildComponent('log.aft.regoperativo');
        $this->regOperativoModel = new RegistroActivoModel();
        $indicadores = new MaestroProductoModel();
        $idIndicador = $indicadores->getIdIndicadoresRama($idIndicador);
        $parametros = array('idindicador' => $idIndicador, 'idarearesp' => $idAreaResp);
        $dql = $this->regOperativoModel->getQueryDataVisualizarRegNumActivos($parametros);
        return $dql->fetchArray();
    }

}
