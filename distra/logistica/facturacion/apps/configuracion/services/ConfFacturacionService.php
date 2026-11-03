<?php

/**
 * Clase service para brindar servicios a los sistemas
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfFacturacionService  extends LogisticaComponentService
{
    private $_dualidadMonedas;
    private $_confModel;

    public function __construct()
    {
        parent::__construct();
        $this->_dualidadMonedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $this->_confModel = new ConfFacturacionModel();
    }

    /**
     * Funcion para cargar los js dinamicamente
     * en la phtml de la configuracion general
     *
     * @return content Retorna el contenido de la phtml de Facturacion
     */
    public function getJsConfigfacturacion()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/facturacion/facturacion/'
            . 'configuracion/views/scripts/conffacturacion/'
            . 'conffacturacion.phtml';

        return file_get_contents($dirPhtml);
    }

    public function addSelectPrecioMatrizIndicador($p){
        $and = $and1 = $order = $order1 = "";
        if($this->_confModel->getConfMelfi() == 1){
            $monedas = ServiciosConfiguracionGeneralHelper::__init()->obtenerMonedasPorEntidad(
                $p['idestructura']
            );
            foreach ($monedas['datos'] as $m){
                $iso = strtolower($m['codigoiso']);
                $aliasDMP = 'dmp'.$iso;
                $aliasDMP1 = 'dmp1'.$iso;
                $aliasDMP2 = 'dmp2'.$iso;
                $aliasDMPDM = 'dmpdm'.$iso;
                if($p['idorigen'] && $p['iddestino'] && $p['fechavigencia']){
                    $and = " AND {$aliasDMP}.idorigen = {$p['idorigen']} AND {$aliasDMP}.iddestino = {$p['iddestino']}".
                        " AND {$aliasDMP}.fechavigencia <= (SELECT MIN({$aliasDMP1}.fechavigencia) FROM DatMatrizprecio {$aliasDMP1} WHERE {$aliasDMP1}.fechavigencia >= '{$p['fechavigencia']}') ".
                        " AND {$aliasDMP}.fechavigencia >= (SELECT MAX({$aliasDMP2}.fechavigencia) FROM DatMatrizprecio {$aliasDMP2} WHERE {$aliasDMP2}.fechavigencia <= '{$p['fechavigencia']}') ";
                    $order = " ORDER BY {$aliasDMP}.fechavigencia DESC LIMIT 1 ";
                }
                $p['query']->addSelect(
                    "COALESCE((SELECT COALESCE({$aliasDMPDM}.precioventa, 0) FROM DatMatrizpreciodualmonetaria {$aliasDMPDM} "
                    ."INNER JOIN {$aliasDMPDM}.DatMatrizprecio {$aliasDMP} WHERE ({$aliasDMPDM}.idmoneda = {$m['idmoneda']} "
                    ."AND {$aliasDMP}.idestructuracomun = {$p['idestructura']} "
                    ."AND {$aliasDMP}.idtipoprecio = {$p['idtipoprecio']} {$and} AND {$aliasDMP}.idindicador = ind.idindicador) {$order} ),0) as precio".$iso
                );
            }
        } else {
            $p['query']->addSelect(
                "COALESCE((SELECT COALESCE(dmpdm.precioventa, 0) FROM DatMatrizpreciodualmonetaria dmpdm "
                ."INNER JOIN dmpdm.DatMatrizprecio dmp WHERE (dmpdm.idmoneda = {$this->_dualidadMonedas->idmoneda} "
                ."AND dmp.idestructuracomun = {$p['idestructura']} "
                ."AND dmp.idtipoprecio = {$p['idtipoprecio']} {$and} AND dmp.idindicador = ind.idindicador) {$order} ),0) as precio"
            );
            if($this->_dualidadMonedas->idmonedaalternativa){
                $p['query']->addSelect(
                    "COALESCE((SELECT COALESCE(dmpdm1.precioventa, 0) FROM DatMatrizpreciodualmonetaria dmpdm1 "
                    ."INNER JOIN dmpdm1.DatMatrizprecio dmp1 WHERE (dmpdm1.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa} "
                    ."AND dmp1.idestructuracomun = {$p['idestructura']} "
                    ."AND dmp1.idtipoprecio = {$p['idtipoprecio']} {$and1} AND dmp1.idindicador = ind.idindicador) {$order1} ),0) as preciodivisa"
                );
            }
        }

        return array('dql'=>$p['query']);
    }

    public function getTipoPrecio($parametros) {
        return $this->_confModel->getTipoPrecio($parametros);
    }

    public function addClienteTipoprecioPorDefecto($parametros) {
        return $this->_confModel->addClienteTipoprecioPorDefecto($parametros);
    }

    /*
     * array[tipoP] tipo de precio
     * array[columns] 1
     * array[grid] der
     * array[idestructuracomun]
     * */
    public function getColumnasSegunMatriz($parametros){
        return $this->_confModel->cargarColumnaSegunMatriz($parametros);
    }

    /*
     * array[identificador] idindicador
     * array[idtipoprecio]
     * array[idorigen]
     * array[iddestino]
     * array[fecha]
     * array[idestructuracomun]
     * */
    public function cargarDatosGridPorSeleccion($parametros){
        return $this->_confModel->cargarDatosGridPorSeleccion($parametros);
    }

    public function addPrecioMatrizNaturaleza($parametros) {
        return $this->_confModel->addPrecioMatrizNaturaleza($parametros);
    }
}
