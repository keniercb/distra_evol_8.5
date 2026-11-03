<?php

/**
 * Esta clase gestiona la configuracion de Facturacion
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class ConfFacturacionModel extends BaseModel
{

    private $conffacturacion,
        $objDesgloce,
        $objDesgloceCP,
        $objCtgPrecioEntidad,
        $objMatrizPrecio,
        $objRecargos,
        $sContabilidad,
        $sConfGeneral,
        $maestroProducto,
        $objPuestoTrabajo,
        $objPuestoTrabajoRango,
        $slogiticaDoc,
        $objIddocFac,
        $idestructura, $_serviciosRecursosHumanos;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->conffacturacion = new ConfConfiguracionfactura();
        $this->objDesgloce = new DatCuentadesgloceprecio();
        $this->objDesgloceCP = new DatClientedesgloceprecio();
        $this->objCtgPrecioEntidad = new DatCategoriaprecioentidad();
        $this->objMatrizPrecio = new DatMatrizprecio();
        $this->objRecargos = new ConfRecargo();
        $this->objSecuenciaNumeroControl = new DatSecnrocontrolautomatico();
        $this->objSecuenciaControPuestoTrabajo = new DatSecnrocontropuestotrabajo();
        $this->objPuestoTrabajo = new NomPuestotrabajo();
        $this->objPuestoTrabajoRango = new DatPuestotrabajorango();
        $this->objSecuenciaFacturacion = new NomSecuenciafacturacion();
        $this->sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $this->maestroProducto = new MaestroProductoModel();
        $this->slogiticaDoc = LogisticaDocumentosHelper::__init();
        $this->idestructura = $this->global->Estructura->idestructura;
        $this->objIddocFac = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'facturaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
    }

    /**
     * Funcion que permite cargar la configuracion de Facturacion
     *
     * @param mixed $idestructuracomun El identificador de la estructura
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarConfiguracion($idestructuracomun)
    {
        /*$configuration = $this->conffacturacion->loadConfiguration(
            $idestructuracomun
        );
        return $configuration[0];*/
        $sql = "select c.*, array(SELECT idcuenta FROM mod_logfacturacion.conf_cuentafactura WHERE idestructuracomun = {$idestructuracomun}) AS idcuenta
                from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$idestructuracomun}";
        $aux = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $aux[0];
    }

    /**
     * Funcion que permite guardar la configuracion de Facturacion
     * para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function guardarConfiguracion($params)
    {
        if($params['operaciones']){
            $operaciones = json_decode($params['operaciones']);
            $collect = new Doctrine_Collection('DatOperacionsubsistema');
            foreach($operaciones as $i => $op){
                settype($op, 'array');
                $op['idestructura'] = $this->idestructura;
                if(!$op['idcondicionpago']) {
                    unset($op['idcondicionpago']);
                }
                if(!$op['cobropago']) {
                    $op['cobropago'] = 1;
                }
                if(!$op['comprobante']) {
                    $op['comprobante'] = 0;
                }
                if(!$op['vm']) {
                    $op['vm'] = 0;
                }
                if(!$op['pagoexterior']) {
                    $op['pagoexterior'] = 0;
                }
                if(!$op['preciocero']) {
                    $op['preciocero'] = -1;
                }
                if($op['idoperacionsubsistema']){
                    $collect[$i]->assignIdentifier($op['idoperacionsubsistema']);
                }
                $collect[$i]->synchronizeWithArray($op);
            }
            if(count($collect) > 0){
                $collect->save();
            }
        }
        if($params['panelMonedas'] && count($params['clientes']) > 0){
            $objMoneda = new DatClientemoneda();
            $objMoneda->addClienteMoneda($params['clientes'], $this->idestructura);
            $objRedondeo = new DatClienteredondeo();
            $objRedondeo->addClienteRedondeo($params['clientes'], $this->idestructura);
            $objMedia = new DatClientemedia();
            $objMedia->addClienteMedia($params['clientes'], $this->idestructura);
        }
        if($params['panelNaturalezamedia'] && count($params['naturalezas']) > 0){
            $objNat = new DatNaturalezamedia();
            $objNat->addNaturalezaMedia($params['naturalezas'], $this->idestructura);
        }
        if($params['panelSectormedia'] && count($params['naturalezas']) > 0){
            $objNatSec = new DatSectormedia();
            $objNatSec->addSectorMedia($params['naturalezas'], $this->idestructura);
        }
        if($params['pagos']){
            foreach($params['pagos'] as $pagos){
                //echo $pagos->idmoneda.'---'.$params['idestructuracomun'];die;
                $confpago = Doctrine::getTable('ConfPagoElectronico')
                    ->findByDql('idmoneda = ? and idestructura = ?', 
                        array($pagos->idmoneda, $params['idestructuracomun']));
                if($confpago[0]->idmoneda){
                    $consumerkey = "'".$pagos->consumerkey."'";
                    $consumersecret = "'".$pagos->consumersecret."'";
                    $codigoiso = "'".$pagos->codigoiso."'";
                    $sql = "UPDATE 
                                mod_logfacturacion.conf_pagoelectronico 
                            SET 
                                consumerkey = {$consumerkey},
                                consumersecret = {$consumersecret},
                                codigoiso = {$codigoiso}
                            WHERE 
                                idmoneda = {$pagos->idmoneda} and idestructura = {$params['idestructuracomun']}";
                    
                    Doctrine_Manager::connection()->execute($sql); 
                }else{
                    $confpago = new ConfPagoElectronico();
                    $confpago->idestructura = $params['idestructuracomun'];
                    $confpago->consumerkey = $pagos->consumerkey;
                    $confpago->consumersecret = $pagos->consumersecret;
                    $confpago->idmoneda = $pagos->idmoneda;
                    $confpago->codigoiso = $pagos->codigoiso;
                    $confpago->save();
                }
            }
        }
        if ($params['panelGeneral']) {
            $this->conffacturacion->addNewConfiguration($params);

        } else {
            if ($params['relacionador']) {
                $params['added'] = json_decode($params['added']);
                $params['deleted'] = json_decode($params['deleted']);
                return $this->objDesgloce->modifiedDesglosePrecio($params);
            } else {
                if ($params['relacionadorCP']) {
                    if($params['adicionadosTodos']){
                        $result = new stdClass();
                        $result->success = true;
                        $result->codigoMsg = 1;
                        $where = "";
                        if ($params['sectoradd'] && is_numeric($params['sectoradd'])) {
                            $where = " and nc.idsector = {$params['sectoradd']} ";
                        }
                        /*$sql = "INSERT INTO mod_logfacturacion.dat_clientedesgloseprecio(idcliente,idtipoprecioentidad)
                                (
                                  select nc.idclientesproveedores,(select idtipoprecioentidad from mod_logfacturacion.dat_tipoprecioentidad
                                  where idtipoprecio = {$params['idtipoprecio']} and idestructuracomun = {$params['idestructuracomun']} limit 1) 
                                  from mod_datosmaestros.nom_clientesproveedor nc 
                                  inner join mod_datosmaestros.dat_clienteproveedorentidad dp on dp.idclienteproveedor = nc.idclientesproveedores
                                  where dp.idestructuracomun = {$params['idestructuracomun']} and (nc.idtipo = 3 or nc.idtipo = 1) and dp.idclienteproveedor not in (
                                select idcliente from mod_logfacturacion.dat_clientedesgloseprecio
                                 where idtipoprecioentidad = (select idtipoprecioentidad from mod_logfacturacion.dat_tipoprecioentidad
                                  where idtipoprecio = {$params['idtipoprecio']} and idestructuracomun = {$params['idestructuracomun']} limit 1))
                                );";*/
                        $sql = "INSERT INTO mod_logfacturacion.dat_clientedesgloseprecio(idcliente,idtipoprecio)
                                (
                                  select nc.idclientesproveedores,{$params['idtipoprecio']} 
                                  from mod_datosmaestros.nom_clientesproveedor nc 
                                  where (nc.idtipo = 3 or nc.idtipo = 1) and nc.idclientesproveedores not in (
                                select idcliente from mod_logfacturacion.dat_clientedesgloseprecio
                                 where idtipoprecio = {$params['idtipoprecio']})$where
                                );";
                        Doctrine_Manager::connection()->execute($sql);        
                    } else if($params['eliminadosTodos']) {
                        $where = "";
                        if ($params['sectordel'] && is_numeric($params['sectordel'])) {
                            $where = " and idcliente in (select nc.idclientesproveedores from mod_datosmaestros.nom_clientesproveedor nc ".
                                "where nc.idsector = {$params['sectordel']}) ";
                        }
                        $sql = "delete from mod_logfacturacion.dat_clientedesgloseprecio 
                                where idtipoprecio = {$params['idtipoprecio']}$where;";
                        Doctrine_Manager::connection()->execute($sql);
                    } else {
                        $params['added'] = json_decode($params['added']);
                        $params['deleted'] = json_decode($params['deleted']);
                        $params['idestructura'] = $this->idestructura;
                        return $this->objDesgloceCP->modifiedDesgloseCliente($params);
                    }
                } else {
                    if ($params['panelMatrizPrecio']) {
                        $params['idestructuracomun'] = $this->getIdPadreMatriz()['idpadre'];
                        $this->objMatrizPrecio->modifiedMatrizPrecio($params);
                    }
                }
            }
        }
    }

    /**
     * Funcion que permite cargar los recargos segun la estructura
     *
     * @param mixed $idestructuracomun El identificador de la estructura
     *
     * @return array Retorna todos los recargos configurados para la estructura
     */
    public function cargarRecargos($params)
    {
        return $this->objRecargos->loadRecargos($params);
    }

    /**
     * Funcion que permite eliminar recargos de la estructura
     *
     * @param mixed $idrecargo El identificador del recargo a eliminar
     *
     * @return boolean Retorna true si fue un exito eliminar los recargos
     */
    public function eliminarRecargo($idrecargo)
    {
        return $this->objRecargos->deleteRecargoById($idrecargo);
    }

    /**
     * Funcion que permite obtener los distintos tipos de categorias de precio
     *
     * @param array $params Arreglo con los parametros necesarios
     *                      para obtener las categorias de precios definidad
     *
     * @return array Retorna las categorias de precio existentes en
     * la estructura y la cantidad total de estas
     */
    public function obtenerMatrizDesglosePrecios($params)
    {
        if ($params['tipoP']) {
            $params['result'] = $this->objDesgloce->getResultByIdtipoPrecio(
                $params
            );
            $datos = $this->conffacturacion->getCuentasByDesglosePrecio(
                $params
            );
            $this->obtenerMatrizDesglosePreciosAux($params, $datos);
        }
        return array(
            'datos' => ($datos['datos']) ? $datos['datos'] : [],
            'cantidad' => ($datos['cantidad']) ? $datos['cantidad'] : 0
        );
    }

    /**
     * Funcion que devuelve los tipos de documentos que utilizara el subsistema de Facturacion
     * 
     * @return array Retorna un arreglo con los tipos de documento
     */
    public function cargarTipoDocumentoSerie()
    {
        $objIddocFac = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'facturaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocNota = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'conduceLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocNotaC = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'creditoLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocNotaD = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'debitoLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $resultado = array();
        $aux = $this->sConfGeneral->DocumentosPorSubsistemaEntidad(
            13, $this->idestructura
        );
        foreach($aux as $i => &$value){
            if($value->iddoc == $objIddocFac->iddoc){
                $value->denominacion = $objIddocFac->denominacion;
                $resultado[] = $value;
            }else if($value->iddoc == $objIddocNota->iddoc){
                $value->denominacion = $objIddocNota->denominacion;
                $resultado[] = $value;
            }else if($value->iddoc == $objIddocNotaC->iddoc){
                $value->denominacion = $objIddocNotaC->denominacion;
                $resultado[] = $value;
            }else if($value->iddoc == $objIddocNotaD->iddoc){
                $value->denominacion = $objIddocNotaD->denominacion;
                $resultado[] = $value;
            }
        }
        return $resultado;
    }

    public function cargarSerieDocumento($params)
    {
        $this->deshabilitarSerieXFecha();
        $query = Doctrine_Query::create()->select('nsd.*, dsde.idseriedocentidad as idseriedocentidad')
            ->from('NomSerieDocumento nsd')
            ->innerJoin('nsd.DatSerieDocumentoEntidad dsde ')->orderBy('nsd.denominacion');
        if ($params['criterio']) {
            $query->addWhere(
                "lower(nsd.denominacion) ilike "
                . "lower('%{$params['criterio']}%')"
            );
        }
        if ($params['iddoc']) {
                $query->addWhere("nsd.iddoc = ?", array($params['iddoc']));
        }
        if ($params['estado']) {
            $query->addWhere("nsd.estado = ?", array($params['estado']));
        }
        if ($params['idestructuracomun']) {
            $query->addWhere("dsde.idestructuracomun = ?", array($params['idestructuracomun']));
        } else {
            $query->addWhere("dsde.idestructuracomun = ?", array($this->global->estructura->idestructura));
        }
        $series = $query->fetchArray();
        foreach ($series as &$value) {
            $tipodocumento = $this->sConfGeneral->getTipoDocumentoById($value['iddoc']);
            $value['tipodocumento'] = $tipodocumento->denominacion;
        }
        return array(
            'datos' => $series,
            'cantidad' => $query->count()
        );
    }

    public function actionsSerieDocumento($params)
    {
        $result = true;
        if ($params['actions'] === 'add' || $params['actions'] === 'mod') {
            if ($this->validarSerieDocumento($params) != 0) {
                return false;
            } else {
                $result = $this->actionsSerieDocumentoAux($params);
            }
        } else {
            $params['eliminados'] = Zend_Json_Decoder::decode($params['eliminados']);
            $factura = new FacturacionService();
            if ($factura->estaEnUsoSerie($params['eliminados']) == 1) {
                return false;
            }
                Doctrine_Query::create()
                    ->delete()
                    ->from('DatSerieDocumentoEntidad')
                    ->whereIn('idseriedocentidad', $params['eliminados'])
                    ->addWhere('idestructuracomun = ?', array($this->global->estructura->idestructura))
                    ->execute();

        }
        return $result;
    }

    public function actionsSerieDocumentoAux($params)
    {
        $serieDocumento = new NomSerieDocumento();
        if ($params['actions'] == 'mod') {
            $factura = new FacturacionService();
            if ($factura->estaEnUsoSerie($params['idseriedocentidad']) != 0) {
                return array('success'=> false, 'enuso'=> true);
            }
            $serieDocumento->assignIdentifier($params['idseriedocumento']);
        }
        $serieDocumento->synchronizeWithArray($params);
        $serieDocumento->DatSerieDocumentoEntidad->idestructuracomun = $params['idestructuracomun'];
        $serieDocumento->save();
        return true;
    }

    public function validarSerieDocumento($params)
    {
        return Doctrine_Query::create()
                ->from('NomSerieDocumento nsd')
                ->innerJoin('nsd.DatSerieDocumentoEntidad dsde ')
                ->where('nsd.denominacion = ? and dsde.idestructuracomun = ?', array(
                    $params['denominacion'], $this->idestructura)
                )
                ->count();
    }

    public function obtenerMatrizDesglosePreciosAux($params, &$datos)
    {
        foreach ($datos['datos'] as &$dat) {
            $check = $this->objDesgloce->checkIfExist(
                $dat['idcategoriaprecioentidad']
            );
            $dat['new'] = ($params['grid'] == "der" && $check > 0) ?
                '1' : ($params['grid'] == "izq") ? '0' : [];
        }
    }

    public function obtenerNomenclador($parametros)
    {
        if ($parametros['idtipopreciocl']) {
            $parametros['result'] = $this->objDesgloceCP->getResultByIdTipoprecio(
                $parametros
            );
            //$parametros['result'] = (count($parametros['result']) > 0) ? $parametros['result'] : array(-1);
            $parametros['result'] = (count($parametros['result']) > 0) ? $parametros['result'] : array();
            /*$datos = $this->conffacturacion->getTiposPrecio(
                $parametros
            );*/
            $datos = $this->getClientesTipoprecio(
                $parametros
            );
            $this->obtenerNomencladorAux($datos, $parametros);
        }
        return array(
            'datos' => ($datos['datos']) ? $datos['datos'] : [],
            'cantidad' => ($datos['cantidad']) ? $datos['cantidad'] : 0
        );
    }

    public function getClientesTipoprecio($params)
    {
        /*$params['start'] = (isset($params['start'])) ? $params['start'] : 0;
        $params['limit'] = (isset($params['limit'])) ? $params['limit'] : 25;*/
        if ($params['grid'] == "izq" && is_array($params['result'])) {
            $filtro = array('idclientesproveedores' => array('notin'=>1, 'ids'=> $params['result']));
            if(count($params['filtroBq']) > 0){
                $filtro['nombre'] = $params['filtroBq'];
                $filtro['codigo'] = $params['filtroBq'];
            }
            if ($params['idsector']) {
                $filtro['filter'] = array(
                    array('field'=>'idsector','data'=>array('type'=>'numeric', 'value'=>$params['idsector']))
                );
            }
            $clientes = $this->sConfGeneral->getClientesProveedorByParams(
                null, null, true, true, false, $filtro, $params['start'],
                $params['limit']
            );
        }
        if ($params['grid'] == 'der' && is_array($params['result'])) {
            $params['result'] = (count($params['result']) > 0) ? $params['result'] : array(-1);
            $filtro = array('idclientesproveedores' => $params['result']);
            if(count($params['filtroBq']) > 0){
                $filtro['nombre'] = $params['filtroBq'];
                $filtro['codigo'] = $params['filtroBq'];
            }
            if ($params['idsector']) {
                $filtro['filter'] = array(
                    array('field'=>'idsector','data'=>array('type'=>'numeric', 'value'=>$params['idsector']))
                );
            }
            $clientes = $this->sConfGeneral->getClientesProveedorByParams(
                null, null, true, true, false, $filtro, $params['start'],
                $params['limit']
            );
        }
        return $clientes;
    }

    public function obtenerNomencladorAux(&$datos, $parametros)
    {
        foreach ($datos['datos'] as &$dat) {
            $check = $this->objDesgloceCP->checkIfExist(
                $dat['idclientesproveedores'], $parametros['idtipopreciocl'], $this->idestructura
            );
            $dat['denominacion'] = $dat['codigo'].' '.$dat['nombre'];
            $dat['new'] = ($parametros['grid'] == "der" && count($check) > 0) ?
                '1' : ($parametros['grid'] == "izq") ? '0' : [];
        }
    }

    /**
     * Funcion que permite cargar el listado
     * segun el tipo de precio seleccionado
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para obtener la matriz
     *
     * @return array Retorna la matriz y el total de la matriz
     */
    public function obtenerMatrizPrecio($params)
    {        
        if ($params['idtipoprecio']) {
			$data = $this->conffacturacion->getAllProducts($params);
            $params['grid'] = 'der';
            $params['columns'] = 1;
            $params['tipoP'] = $params['idtipoprecio'];
            $params['conformarprecio'] = 1;
            $matriz = $this->obtenerMatrizPrecioAux($data, $params);
            return [
                'cantidad' => $data['cantidad'],
                'matriz' => (count($data['matriz']) > 0) ?
                    $matriz :
                    $data['matriz']];
        }
        return array(
        'cantidad' =>0,
        'datos' =>[],
        );
    }

    public function obtenerMatrizPrecioAux(&$data, $params)
    {
        $um = $this->configuracionHelper->listarUnidadesMedidaTodas();
        $umIndex = array();
        foreach ($um as $m){
            $umIndex[$m['idunidadmedida']] = $m;
        }
        foreach ($data['matriz'] as &$value) {
            //$ind = $this->maestroProducto->cargarGridNomenclador(array('idindicador' => $value['idindicador']));
            $result = $this->objMatrizPrecio->findMatrizPrecio(
                $value['idindicador'], $params
            );
            $filtrer = $this->obtenerFiltroPorColumnas($params, $result[0]);
            $value['idmatrizprecio'] = $result[0]['idmatrizprecio'];
            $value['configurado'] = -1;
            if (count($result)){
                $existe = Doctrine::getTable('DatMatrizpreciodualmonetaria')->findByDql('idmatrizprecio = ?', array($result[0]['idmatrizprecio']));
                if(count($existe)) {
                    $value['configurado'] = 1;
                }
            }
            $value['umedida'] = (count($result) > 0 && $result[0]['idumedida']) ? $umIndex[$result[0]['idumedida']]['abreviaturaunidadmedida'] : $value['umedida'];
            $value['text'] = $value['codigoproveedor'].' - '.$value['denominacion'];
            $pos = (
                $params['servicio'] === true ||
                $params['servicio'] === 'true'
                ) ? 'cobromateriales' : 'preciopromedio';
            $value[$pos] = ($result[0]['preciopromedio']) ? 1 : 0;
            $value['bi'] = ($result[0]['bi']) ? 1 : 0;
            $matriz[] = (empty($filtrer)) ?
                $value :
                array_merge($value, $filtrer);
        }
        return $matriz;
    }

    /**
     * Funcion que permite filtrar las columnas
     * para la matriz
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para obtener las columnas
     * @param mixed $result Arreglo con el idmatrizprecio
     *
     * @return array Retorna las columnas dinamicas
     */
    public function obtenerFiltroPorColumnas($params, $result)
    {
        $dynamic = $this->conffacturacion->getCuentasByDesglosePrecio(
            $params
        );
        foreach ($dynamic as $fields) {
            $fd = str_replace('.','',strtolower($fields['denominacion']));
            $desglose = $this->objMatrizPrecio->getDynamicFields(
                $result['idmatrizprecio'], $fields['idcuentadesgloseprecio']
            );
            $value[$fd] = $desglose;
        }
        return $value;
    }

    /**
     * Funcion que permite cargar las columnas dinamicas
     * segun el tipo de precio para la matriz seleccionada
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para cargar las columnas dinamicas
     *
     * @return array Retorna las columnas con sus datos
     */
    public function cargarColumnaSegunMatriz($params)
    {
        return $this->conffacturacion->getCuentasByDesglosePrecio($params);
    }

    /**
     * Funcion que permite cargar los datos
     * segun la seleccion realizada en la matriz
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para obtener la matriz
     *
     * @return array Retorna los datos segun la seleccion y la cantidad total
     */
    public function cargarDatosGridPorSeleccion($params)
    {
        $matrizprecio = $this->objMatrizPrecio->getDataToMatrizPrecio(
            $params
        );
        $indicadores = $this->maestroProducto->devolverProductosServicio(
            array('idservicio' => $params['identificador'])
        );
        $cobromateriales = 0.00;
        foreach ($indicadores['datos'] as &$ind) {
            $params['identificador'] = $ind['idindicador'];
            $datas = $this->objMatrizPrecio->getDataToMatrizPrecio(
                $params
            );
            if ($datas['cantidad'] != 0) {
                $cobromateriales += $datas['datos'][0]['DatMatrizpreciodualmonetaria'][0]['precioventa'];
            } else {
                $cobromateriales += $ind['precioventa'];
            }
        }
        foreach ($matrizprecio['datos'] as &$matrizp) {
            foreach($matrizp['DatMatrizpreciodualmonetaria'] as $index => $matrizDual){
                $matrizp['idmatrizpreciodualidadmonetaria'] = $matrizDual['idmatrizpreciodualidadmonetaria'];
                $matrizp['idmoneda'] = $matrizDual['idmoneda'];
                $matrizp['cobromateriales'] = $cobromateriales;
                $matrizp['precio'] = $matrizDual['precio'];
                $matrizp['precioventa'] = $matrizDual['precioventa'];
                $dPrecio = $matrizDual['DatPrecio'];
                $nuevasColumnas = $this->obtenerColumnasDinamicas(
                    $params, $dPrecio
                );
                if ($nuevasColumnas) {
                    $nuevaMatriz['datos'][] = array_merge(
                        $matrizp, $nuevasColumnas
                    );
                } else {
                    if ($matrizp['precio']) {
                        $nuevaMatriz['datos'][] = $matrizp;
                    }
                }
            }



            /*$matrizDual = $matrizp['DatMatrizpreciodualmonetaria'][0];
            $matrizp['idmatrizpreciodualidadmonetaria'] = $matrizDual['idmatrizpreciodualidadmonetaria'];
            $matrizp['idmoneda'] = $matrizDual['idmoneda'];
            $matrizp['cobromateriales'] = $cobromateriales;
            $matrizp['precio'] = $matrizDual['precio'];
            $matrizp['precioventa'] = $matrizDual['precioventa'];
            $dPrecio = $matrizDual['DatPrecio'];
            $nuevasColumnas = $this->obtenerColumnasDinamicas(
                    $params, $dPrecio
            );
            if ($nuevasColumnas) {
                $nuevaMatriz['datos'][] = array_merge(
                    $matrizp, $nuevasColumnas
                );
            } else {
                if ($matrizp['precio']) {
                    $nuevaMatriz['datos'][] = $matrizp;
                }
            }*/
        }
        $nuevaMatriz['cantidad'] = $matrizprecio['cantidad'];
        return $nuevaMatriz;
    }

    /**
     * Funcion filtro que permite cargar los datos
     * segun la seleccion realizada en la matriz
     *
     * @param array $params  Arreglo con los datos necesarios
     *                       para obtener la matriz
     * @param array $dPrecio Arreglo con los precios definidos
     *
     * @return array Retorna los datos segun la matriz
     */
    public function obtenerColumnasDinamicas($params, $dPrecio)
    {
        $filtrer['idestructuracomun'] = $params['idestructuracomun'];
        $filtrer['columns'] = 1;
        $filtrer['tipoP'] = $params['idtipoprecio'];
        foreach ($dPrecio as &$price) {
            $filtrer['desgloseprecio'] = $price['idcuentadesgloseprecio'];
            $dynamic = $this->conffacturacion->getCuentasByDesglosePrecio(
                $filtrer
            );
            $price['concepto'] = $dynamic[0]['concepto'];
            $fd = str_replace('.','',strtolower($dynamic[0]['denominacion']));
            $matriz[$fd] = $price['valor'];
        }
        return $matriz;
    }

    /**
     * Funcion que permite eliminar los datos
     * segun la seleccion realizada en la matriz
     *
     * @param array $params Arreglo con el idmatrizprecio
     *                      para ser eliminado de la tabla
     *
     * @return boolean Retorna si fue un exito eliminar los datos
     */
    public function eliminarDatosGridPorSeleccion($params)
    {
        foreach($params as $p){
            $this->objMatrizPrecio->deleteInTable(
                'DatMatrizpreciodualmonetaria', [$p]
            );
        }
        //Validar si se esta usando en Factura no se puede eliminar
        return true;
    }

    /**
     * Funcion que permite obtener la categoria y subcategoria en la matriz
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna arreglo con las categorias o subcategorias segun
     * los parametros
     */
    public function obtenerCategoriaSubcategoria($params)
    {
        return $this->conffacturacion->getCategoria($params);
    }

    /**
     * Funcion que permite adicionar/modificar/eliminar/obtener
     * los numero de  factura y de control
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna arreglo/vacio segun los parametros
     */
    public function crudNumeroControl($params)
    {
        $result = new stdClass();
        $result->success = true;
        $result->codigoMsg = 1;
        if ($params['actionModel'] == 'add' || $params['actionModel'] == 'up') {
            $this->numeroControlAux($params, $result);
        } else {
            if ($params['actionModel'] === 'del') {
                $this->crudNumeroControlAux($params, $result);
            }
        }
        $datos = $this->objSecuenciaNumeroControl->loadNumeroControl($params);
        $result->datos = $datos['datos'];
        $result->cantidad = $datos['cantidad'];
        return $result;
    }

    public function numeroControlAux($params, &$result)
    {
        if ($this->objSecuenciaNumeroControl->existsNumeroControl($params) === 0) {
            if ($params['actionModel'] === 'up') {
                $this->objSecuenciaNumeroControl->assignIdentifier($params['idsecuencianumerocontrol']);
                $factura = new FacturacionService();
                $params['nroscntrl'] = $factura->getNumerosControlEnF(
                    array('idestructura' => $params['idestructuracomun'])
                );
                if ($this->objSecuenciaNumeroControl->validateIfUseRango($params) !== 0) {
                    $result->success = false;
                    $result->codigoMsg = 3;
                    return;
                }
            }
            $this->objSecuenciaNumeroControl->synchronizeWithArray($params);
            $this->objSecuenciaNumeroControl->save();
        } else {
            $result->success = false;
            $result->codigoMsg = 3;
        }
    }

    public function crudNumeroControlAux($params, &$result)
    {
        $factura = new FacturacionService();
        $params['nroscntrl'] = $factura->getNumerosControlEnF(array('idestructura' => $params['idestructuracomun']));
        $params['idsecuencianumerocontrol'] = Zend_Json::decode($params['idsecuencianumerocontrol']);
        if ($this->objSecuenciaNumeroControl->validateIfUseRango($params) === 0) {
            foreach ($params['idsecuencianumerocontrol'] as $value) {
                $objSecuenciaNumeroControlRecord = Doctrine::getTable('DatSecnrocontrolautomatico')->find($value);
                if ($objSecuenciaNumeroControlRecord) {
                    $objSecuenciaNumeroControlRecord->delete();
                } else {
                    $result->success = false;
                    $result->codigoMsg = 1;
                }
            }
        } else {
            $result->success = false;
            $result->codigoMsg = 1;
        }
    }

    /**
     * Funcion que permite adicionar/modificar/eliminar/obtener
     * los numero de  control de las facturas generadas por sistema
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna arreglo/vacio segun los parametros
     */
    public function crudSecuenciaNumeroControl($params)
    {
        $result = new stdClass();
        $result->success = true;
        $result->codigoMsg = 1;
        if ($params['actionModel'] === 'add' || $params['actionModel'] === 'up') {
            $this->crudSecuenciaNumeroControlAux($params, $result);
        } else {
            if ($params['actionModel'] === 'del') {
                $this->secuenciaNumeroControl($params, $result);
            }
        }
        $datos = $this->objSecuenciaControPuestoTrabajo->loadSecuenciaNumeroControl($params);
        $result->datos = $datos['datos'];
        $result->cantidad = $datos['cantidad'];
        return $result;
    }

    public function secuenciaNumeroControl($params, &$result)
    {
        $factura = new FacturacionService();
        $params['nroscntrl'] = $factura->getNumerosControlEnF(array('idestructura' => $params['idestructuracomun']));
        $params['idsecuenciapuestotrabajo'] = Zend_Json::decode($params['idsecuenciapuestotrabajo']);
        if ($this->objSecuenciaControPuestoTrabajo->existsSecuenNroCtrl($params) === 0) {
            foreach ($params['idsecuenciapuestotrabajo'] as $value) {
                $objSecuenciaNumeroControlRecord = Doctrine::getTable('DatSecnrocontropuestotrabajo')->find($value);
                $objSecuenciaNumeroControlRecord->delete();
            }
        } else {
            $result->success = false;
            $result->codigoMsg = 1;
        }
    }

    public function crudSecuenciaNumeroControlAux($params, &$result)
    {
        if (
            $this->objSecuenciaControPuestoTrabajo->existsSecuenciaNumeroControl($params) === 0 &&
            $this->objSecuenciaNumeroControl->existsRangoNumeroControl($params) === 0
        ) {
            if ($params['actionModel'] === 'up') {
                $this->objSecuenciaControPuestoTrabajo->assignIdentifier($params['idsecuenciapuestotrabajo']);
            }
            $this->objSecuenciaControPuestoTrabajo->synchronizeWithArray($params);
            $this->objSecuenciaControPuestoTrabajo->save();
        } else {
            $result->success = false;
            $result->codigoMsg = 3;
        }
    }

    /**
     * Funcion que permite adicionar/modificar/eliminar/obtener
     * los puestos de trabajos
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna arreglo/vacio segun los parametros
     */
    public function crudPuestoTrabajo($params)
    {
        $result = new stdClass();
        $result->success = true;
        $result->codigoMsg = 1;
        if ($params['actionModel'] === 'add' || $params['actionModel'] === 'up') {
            $this->puestoTrabajoAux($params, $result);
        } else {
            if ($params['actionModel'] === 'del') {
                $this->crudPuestoTrabajoAux($params, $result);
            }
        }
        $datos = $this->objPuestoTrabajo->loadPuestoTrabajo($params);
        $result->datos = $datos['datos'];
        $result->cantidad = $datos['cantidad'];
        return $result;
    }

    public function puestoTrabajoAux($params, &$result)
    {
        if ($this->objPuestoTrabajo->existsPuestoTrabajo($params) === 0 || $params['actionModel'] === 'up') {
            if ($params['actionModel'] === 'up') {
                $this->objPuestoTrabajo->assignIdentifier($params['idpuestotrabajo']);
            }
            $this->objPuestoTrabajo->synchronizeWithArray($params);
            $this->objPuestoTrabajo->save();
        } else {
            $result->success = false;
            $result->codigoMsg = 3;
        }
    }

    public function crudPuestoTrabajoAux($params, &$result)
    {
        $params['idpuestotrabajo'] = Zend_Json::decode($params['idpuestotrabajo']);
        $factura = new FacturacionService();
        $params['nroscntrl'] = $factura->getNumerosControlEnF(array('idestructura' => $params['idestructuracomun']));
        if ($this->validateExistRangoInUso($params) === 0) {
            foreach ($params['idpuestotrabajo'] as $value) {
                $objSecuenciaNumeroControlRecord = Doctrine::getTable('NomPuestotrabajo')->find($value);
                $objSecuenciaNumeroControlRecord->DatSecnrocontropuestotrabajo->delete();
                $objSecuenciaNumeroControlRecord->delete();
            }
        } else {
            $result->success = false;
            $result->codigoMsg = 1;
            return;
        }
    }

    public function validateExistRangoInUso($params)
    {
        foreach ($params['nroscntrl'] as $nroscntrl) {
            $nroctrl = (int) str_replace('-', '', $nroscntrl['nrocontrol']);
            $query = Doctrine_Query::create()
                ->from('DatSecnrocontropuestotrabajo')
                ->where(
                    "{$nroctrl} BETWEEN CAST(REPLACE(nroinicio, '-', '') AS NUMERIC) "
                    . "AND CAST(REPLACE(nrofin, '-', '') AS NUMERIC)"
                )
                ->whereIn('idpuestotrabajo', $params['idpuestotrabajo'])
                ->count();
            if ($query) {
                return $query;
            }
        }
        return 0;
    }

    public function getClientes($parametros)
    {
        $filtro = array();
        if ($parametros['query']) {
            $filtro['nombre'] = $parametros['query'];
            $filtro['codigo'] = $parametros['query'];
        }
        
        $clientes = $this->sConfGeneral->getClientesProveedorByParams(
            null, $this->idestructura, true, true, false, $filtro, $parametros['start'],
            $parametros['limit']
        );
        return $clientes;
    }

    public function adicionarNumeroControl($params)
    {
        if($this->verificarExistencia($params)) {
            $obj = new DatRangonumerocontrol();
            if($params['actionModel'] == 'up'){
                $obj->assignIdentifier($params['idrango']);
            }
            $obj->synchronizeWithArray(
                [
                    'idestructuracomun' => $params['idestructuracomun'],
                    'nrocontrolinicial' => $params['nroinicio'],
                    'nrocontrolfinal' => $params['nrofin']
                ]
            );
            $obj->DatPuestotrabajorango[0]->idpuestotrabajo = $params['idpuestotrabajo'];
            $obj->save();
            return [
                'success' => true
            ];
        }
        return [
            'success' => false
        ];
    }

    public function verificarExistencia($params)
    {
        $nrocontrolinicial = (int) str_replace('-', '', $params['nroinicio']);
        $nrocontrolfinal = (int) str_replace('-', '', $params['nrofin']);
        $query = Doctrine_Query::create()
            ->from('DatRangonumerocontrol')
            ->where(
            "CAST(REPLACE(nrocontrolinicial, '-', '') as numeric) "
            ."BETWEEN {$nrocontrolinicial} AND {$nrocontrolfinal}"
        )->count();
        if($query != 0){
            return false;
        }
        return $this->verificarExistenciaAux($nrocontrolinicial, $nrocontrolfinal);
    }

    public function verificarExistenciaAux($numeroinicial, $numerofinal)
    {
        $query = Doctrine_Query::create()
            ->from('DatRangonumerocontrol')
            ->where(
                "CAST(REPLACE(nrocontrolfinal, '-', '') as numeric) "
                ."BETWEEN {$numeroinicial} AND {$numerofinal}"
            )->count();
        if($query != 0){
            return false;
        }
        return $this->verificarExistenciaAux2($numeroinicial, $numerofinal);
    }

    public function verificarExistenciaAux2($numeroinicial, $numerofinal)
    {
        $query = Doctrine_Query::create()
            ->from('DatRangonumerocontrol')
            ->where(
                "{$numeroinicial} BETWEEN CAST(REPLACE(nrocontrolinicial, '-', '') as numeric) "
                ."AND CAST(REPLACE(nrocontrolfinal, '-', '') as numeric)"
            )->count();
        if($query != 0){
            return false;
        }
        return $this->verificarExistenciaAux3($numerofinal);
    }

    public function verificarExistenciaAux3($numerofinal)
    {
        $query = Doctrine_Query::create()
            ->from('DatRangonumerocontrol')
            ->where(
                "{$numerofinal} BETWEEN CAST(REPLACE(nrocontrolinicial, '-', '') as numeric) "
                ."AND CAST(REPLACE(nrocontrolfinal, '-', '') as numeric)"
            )->count();
        if($query != 0){
            return false;
        }
        return true;
    }

    public function devolverRangos($params)
    {
        $rangocontrol = new DatRangonumerocontrol();
        return $rangocontrol->devolverRangos($params);
    }

    public function getOperaciones($parametros){
        $operaciones = $this->sConfGeneral->obtenerOperaciones(
            null, LogisticaGlobal::SUBSISTEMA_FAC, $this->objIddocFac->iddoc
        );
        $subsistemas = array('-2'=>'S/D', '-1'=>utf8_encode("Facturaci&oacute;n"), '10'=>'Inventario', '113'=>'Talleres', '11'=>'Activos fijos');
        $condicion = ServiciosConfiguracionGeneralHelper::__init();
        $datos = $condicion->obtenerCondicionesPago();
        $condiciones = array();
        foreach ($datos['data'] as $d) {
            $condiciones[$d['idterminodepago']] = $d;
        }
        foreach($operaciones as &$op){
            $aux = Doctrine::getTable('DatOperacionsubsistema')->findBySql(
                'idnomoperaciones = ? and idestructura = ?', array($op['idnomoperaciones'], $this->idestructura)
            );
            if(count($aux)>0){
                $op['idoperacionsubsistema'] = $aux[0]->idoperacionsubsistema;
                $op['cobropago'] = $aux[0]->cobropago;
                $op['comprobante'] = $aux[0]->comprobante;
                $op['vm'] = $aux[0]->vm;
                $op['pagoexterior'] = $aux[0]->pagoexterior;
                $op['idsubsistema'] = $aux[0]->idsubsistema;
                $op['preciocero'] = $aux[0]->preciocero;
                $op['subsistema'] = $subsistemas[$aux[0]->idsubsistema];//$this->getSubsistemas(array('idsubsistema'=>$aux[0]->idsubsistema))['denominacion'];
                $op['condicionpago'] = ($aux[0]->idcondicionpago) ? $condiciones[$aux[0]->idcondicionpago]['nombre'] : '';
            }
        }
        return $operaciones;
    }

    public function getSubsistemas($parametros = false){
        $factura = new FacturacionService();
        return $factura->getSubsistemas($parametros);
    }

    public function getMonedasEntidad($idestructura, $pagoelectronico = 0)
    {
        $config = $this->cargarConfiguracion($idestructura);

        if (/*$this->getConfMelfi() == -1 && !$config['multimoneda']*/false) {
            $monedaContable = (array) $this->sConfGeneral->obtenerMonedaContablePorEntidad(
                $idestructura
            );
            if ($monedaContable) {
                $monedaContable['contable'] = true;
                $arrayResult[] = $monedaContable;
            }
            $monedasAlternativas = (array) $this->sConfGeneral->obtenerMonedasAlternativasPorEntidad(
                $idestructura
            )['datos'];
            foreach($monedasAlternativas as $mon){
                if($mon['dualidad'] == 1){
                    $arrayResult[] = $mon;
                }
            }
        } else {
            $monedas = (array) $this->sConfGeneral->obtenerMonedasPorEntidad(
                $idestructura
            )['datos'];
            foreach($monedas as $mon){
                if($pagoelectronico){
                    $sql = "SELECT * FROM mod_logfacturacion.conf_pagoelectronico WHERE idestructura = {$idestructura} and idmoneda = {$mon['idmoneda']}";
                    $confpago = LogisticaDoctrineHelper::__init()->getConnection()->fetchAssoc($sql);
                    if(!empty($confpago[0])){
                        unset($confpago[0]['idmoneda']);    
                        unset($confpago[0]['codigoiso']);    
                        $mon = array_merge_recursive($mon, $confpago[0]);

                    }
                }

                $arrayResult[] = $mon;
            }           
        }
        return ($arrayResult) ? $arrayResult : array();
    }

    public function cargarTiposTasa(){
        return $this->sConfGeneral->getTipoTasas();
    }

    public function getCuentasBancarias()
    {
        
        $cuentas = $this->sContabilidad->getCuentasBancarias($this->idestructura);
        foreach ($cuentas as &$cuenta) {
            $cuenta['nrocuenta'] = $cuenta['nrocuenta'] . ' - ' . $cuenta['NomMoneda']['codigoiso'];
        }
        return $cuentas;
    }

    public function addClienteTipoprecioPorDefecto($parametros){
        try{
            $objTipoprecio = Doctrine::getTable('NomTipoprecio')->findByDql(
                " pordefecto=?",
                array(1)
            );
            $idtipoprecio = $objTipoprecio[0]->idtipoprecio;
            $desglose = new DatClientedesgloceprecio();
            $tipoprecioentidad = $desglose->getIdTipoPrecEntByParams($idtipoprecio);
            $tipo = $tipoprecioentidad[0]['idtipoprecioentidad'];
            $desglose->idtipoprecioentidad = $tipo;
            $desglose->idcliente = $parametros['idclientesproveedores'];
            $desglose->save();
            return true;
        }catch (Exception $e){
            return false;
        }
    }

    public function getTipoPrecio($parametros) {
        $params = array('idnom' => 'idtipoprecio', 'modelo' => 'NomTipoprecio');
        $objNomenclador = new NomencladoresLogService();
        $tipoPrecios = $objNomenclador->devolverTipoPrecio($params, true);
        if ($parametros && $parametros['idcliente']) {
            $obDesgPrecio = new DatClientedesgloceprecio();
            $preciosCliente = $obDesgPrecio->getResultByIdCliente(
                array(
                    'idestructuracomun' => $parametros['idestructura'],
                    'idcliente' => $parametros['idcliente']
                )
            );
            if(count($preciosCliente) == 0){
                $preciosCliente[] = -1;
            }
            $tipoPrecios['query']->andWhereIn(
                'm.idtipoprecio', $preciosCliente
            );
        }
        $tipoPrecios = $tipoPrecios['query']->fetchArray();
        return $tipoPrecios;
    }

    public function reproducirPrecios($params){
        $params['idnaturaleza'] = ($params['idnaturaleza']) ? $params['idnaturaleza'] : 'null';
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $monedaCont = $monedas->idmoneda;
        $monedaAlt = ($monedas->idmonedaalternativa) ? $monedas->idmonedaalternativa : -1;
        $aux1 = Doctrine::getTable('DatMatrizpreciodualmonetaria')->findByDql(
            'idmatrizprecio = ? and idmoneda = ?', array($params['idmatrizprecio'], $monedaCont)
        );
        $aux2 = Doctrine::getTable('DatMatrizpreciodualmonetaria')->findByDql(
            'idmatrizprecio = ? and idmoneda = ?', array($params['idmatrizprecio'], $monedaAlt)
        );
        $base1 = (count($aux1) > 0) ? $aux1[0]['idmatrizpreciodualidadmonetaria'] : -1;
        $base2 = (count($aux2) > 0) ? $aux2[0]['idmatrizpreciodualidadmonetaria'] : -1;

        $idpadrematriz = $this->getIdPadreMatriz()['idpadre'];
        Doctrine_Manager::connection()->execute(
            "select mod_logfacturacion.f_valoresmatrizprecio({$idpadrematriz},{$params['idtipoprecio']},{$monedaCont},{$monedaAlt},{$base1},{$base2},{$params['tipo']},{$params['idmatrizprecio']},{$params['idnaturaleza']})"
        );
        Doctrine_Manager::connection()->execute(
            "select mod_logfacturacion.f_valoresmatrizprecio2({$idpadrematriz},{$params['idtipoprecio']},{$monedaCont},{$monedaAlt},{$base1},{$base2},{$params['tipo']},{$params['idmatrizprecio']},{$params['idnaturaleza']})"
        );
        Doctrine_Manager::connection()->execute(
            "select mod_logfacturacion.f_valoresmatrizprecio3({$idpadrematriz},{$params['idtipoprecio']},{$monedaCont},{$monedaAlt},{$base1},{$base2},{$params['tipo']},{$params['idnaturaleza']})"
        );
        return true;
    }
    
    public function getPuertos(){
        return $this->estructuraHelper->obtenerPuertos();
    }
    
    public function getConfMelfi(){
        $dql = "select * from pg_tables where tablename='conf_melfi'";
        $dqlResult =LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($dql);
        if (count($dqlResult) > 0) {
            foreach ($dqlResult as $t) {
                if ($t['schemaname'] == 'mod_logfacturacion'){
                    $dql1 = "select * from mod_logfacturacion.conf_melfi limit 1";
                    $melfi =LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($dql1);
                    if (count($melfi) > 0){
                        if ($melfi[0]['melfi'] == 1) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        return -1;
                    }
                }
            }
        }
        return -1;
    }

    public function getClientesMonedas($parametros){
        //$parametros['idestructuracomun'] = $this->idestructura;
        $parametros['idtipopreciocl'] = $parametros['idtipoprecio'];
        $clientTipoPrecio = $this->objDesgloceCP->getResultByIdTipoprecio(
            $parametros
        );
        if(!count($clientTipoPrecio)) {
          $clientTipoPrecio = array(-1);
        }
        if($parametros['idtipoprecio'] != -1)
            $filtro =  array('idclientesproveedores'=>$clientTipoPrecio);
        if($parametros['criterio']){
            $filtro['nombre'] = $parametros['criterio'];
            $filtro['codigo'] = $parametros['criterio'];
        }
        $clientes = $this->sConfGeneral->getClientesProveedorByParams(
            null, null, true, true, false, $filtro, $parametros['start'],
            $parametros['limit']
        );
        foreach ($clientes['datos'] as &$c){
            $c['text'] = $c['codigo'].' '.$c['nombre'];
            /*$obj = Doctrine::getTable('DatClientemoneda')->findByDql(
                'idestructura = ? and idtipoprecio = ? and idcliente = ?',
                array($this->idestructura, $parametros['idtipoprecio'], $c['idclientesproveedores'])
            );*/
            $obj = Doctrine::getTable('DatClientemoneda')->findByDql(
                'idtipoprecio = ? and idcliente = ?',
                array($parametros['idtipoprecio'], $c['idclientesproveedores'])
            );
            /*$objR = Doctrine::getTable('DatClienteredondeo')->findByDql(
                'idestructura = ? and idtipoprecio = ? and idcliente = ?',
                array($this->idestructura, $parametros['idtipoprecio'], $c['idclientesproveedores'])
            );*/
            $objR = Doctrine::getTable('DatClienteredondeo')->findByDql(
                'idtipoprecio = ? and idcliente = ?',
                array($parametros['idtipoprecio'], $c['idclientesproveedores'])
            );
            $objM = Doctrine::getTable('DatClientemedia')->findByDql(
                'idtipoprecio = ? and idcliente = ?',
                array($parametros['idtipoprecio'], $c['idclientesproveedores'])
            );
            if(count($obj) > 0){
                $c['idclientemoneda'] = $obj[0]['idclientemoneda'];
                $c['idmoneda'] = $obj[0]['idmoneda'];
            }
            if(count($objR) > 0){
                $c['idclienteredondeo'] = $objR[0]['idclienteredondeo'];
                $c['redondear'] = ($objR[0]['redondear'] == 1) ? 1 : -1;
            }
            if(count($objM) > 0){
                $c['idclientemedia'] = $objM[0]['idclientemedia'];
                $c['media'] = $objM[0]['media'];
            }
        }
        return $clientes;
    }

    //reportes de ventas configuracion
    public function actionsReporteVenta($params){
        $reporte = new ConfReporteventa();
        if ($params['actions'] == 'add') {
            $reporte->synchronizeWithArray($params);
            $reporte->idestructuracomun = $this->idestructura;
        } else if ($params['actions'] == 'mod') {
            $reporte->assignIdentifier($params['idreporteventa']);
            $reporte->synchronizeWithArray($params);
        } else if ($params['actions'] == 'del') {
            return Doctrine_Query::create()->delete()->from('ConfReporteventa r')->whereIn('r.idreporteventa', json_decode($params['idreporteventa']))->execute();
        }
        $reporte->save();
    }

    public function getReportesVenta(){
        $query = Doctrine_Query::create()->from('ConfReporteventa r')/*->where('r.idestructuracomun = ?', array($this->idestructura))*/;
        $cantidad = $query->count();
        $datos = $query->orderBy('r.denominacion')->fetchArray();//poner los limites
        return array('datos'=>$datos, 'cantidad'=>$cantidad);
    }

    public function getListaConcepto($params){
        $util = json_decode($params['util']);
        $query = Doctrine_Query::create()->from($util->domain)->where('idreporteventa = ?', array($params['idreporteventa']));
        if (true) {//cambiarlo por una configuracion cuando se implemente
            $query->addWhere('idestructuracomun = ?', array($this->idestructura));
        }
        $data = $query->fetchArray();
        $ids = $this->objectHelper->extractValueFromArrayColumn($data, 'id'.$params['concepto']);
        $return = array('datos'=>array(), 'cantidad'=>0);
        switch ($params['concepto']) {
            case 'centrocosto':
                $result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                    $this->global->Estructura->idestructura, 0, 1000
                );
                $dataAux = array();
                foreach ($result as &$r) {
                    if(!in_array($r->idcentrogrupo, $ids)) {
                        $r = (array) $r;
                        $r['idcentrocosto'] = $r['idcentrogrupo'];
                        $r['denominacion'] = $r['text'];
                        $dataAux[] = $r;
                    }
                }
                $return = array('datos'=>$dataAux, 'cantidad'=>count($dataAux));
                break;
            case 'servicio':
                $conn = Zend_Registry::get('conexion');
                $selec = "Select ca.*, ca.idactividad as idservicio";
                $from = " FROM  mod_logtaller.conf_actividad ca
                left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad";
                $where = " Where dae.identidad = {$this->global->Estructura->idestructura} AND ca.idindicador is null";
                if(count($ids) > 0)
                    $where.= " AND ca.idactividad not in (".implode(',', $ids).")";
                $limit = "";
                if ($params['limit']) {
                    $limit.= " LIMIT {$params['limit']} ";
                }
                if ($params['start']) {
                    $limit.= "OFFSET {$params['start']} ";
                }
                $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec. $from. $where)
                    ->fetchAll(PDO::FETCH_ASSOC);

                $result = $conn->execute($selec.$from.$where. $limit)->fetchAll();

                $return = array('datos'=>$result, 'cantidad'=>$total);
                break;
            case 'deposito':
                $logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
                $filtro = count($ids) > 0 ? array('idestructura'=>$ids) : null;
                $depositos = $logistEstrucUbica->cargardepositos(null, null, $filtro,null,0,-1)['depositos'];
                foreach ($depositos as &$dep) {
                    $dep['denominacion'] = $dep['deposito'];
                }
                $return = array('datos'=>$depositos, 'cantidad'=>count($depositos));
                break;
            case 'operacion':
                $opeaciones = $this->getOperaciones();
                $opernew = array();
                foreach ($opeaciones as $op){
                    if (!in_array($op['idnomoperaciones'], $ids)){
                        $op['idoperacion'] = $op['idnomoperaciones'];
                        $opernew[] = $op;
                    }
                }
                $return = array('datos'=>$opernew, 'cantidad'=>count($opernew));
                break;
            case 'naturaleza':
                $params['dql'] = 1;
                $query = $this->sConfGeneral->obtenerDatosArbolNaturaleza($params);
                $query->addSelect('codigo')->whereNotIn('idnaturaleza', $ids);
                if($params['criterio']) {
                    $query->andWhere("(denominacion ilike '%{$params['criterio']}%' OR codigo ilike '%{$params['criterio']}%')");
                }
                $cantidad = $query->count();
                $query->offset($params['start'])->limit($params['limit']);
                $naturalezas = $query->fetchArray();
                $natnew = array();
                foreach ($naturalezas as &$nat){
                    //if (!in_array($nat['idnaturaleza'], $ids)){
                        $nat['denominacion'] = $nat['codigo'].' '.$nat['text'];
                        //$opernew[] = $nat;
                   // }
                }
                $return = array('datos'=>$naturalezas, 'cantidad'=>$cantidad);
                break;    
            default: break;
        }
        /*$query = Doctrine_Query::create();
        $cantidad = $query->count();
        $datos = $query->fetchArray();//poner los limites*/
        return $return;
    }

    public function getConceptoReporte($params){
        $util = json_decode($params['util']);
        $query = Doctrine_Query::create()->from($util->domain)->where('idreporteventa = ?', array($params['idreporteventa']));
        if (true) {//cambiarlo por una configuracion cuando se implemente
            $query->addWhere('idestructuracomun = ?', array($this->idestructura));
        }
        $data = $query->fetchArray();
        $ids = $this->objectHelper->extractValueFromArrayColumn($data, 'id'.$params['concepto']);
        $return = array('datos'=>array(), 'cantidad'=>0);
        switch ($params['concepto']) {
            case 'centrocosto':
                foreach ($data as &$d){
                    $result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                        $this->global->Estructura->idestructura, 0, 1000, null, array($d['idcentrocosto'])
                    );
                    $d['denominacion'] = $result[0]->text;
                }
                $return = array('datos'=>$data, 'cantidad'=>count($data));
                break;
            case 'servicio':
                if(count($ids) > 0){
                    $conn = Zend_Registry::get('conexion');
                    $selec = "Select ca.*, ds.*";
                    $from = " FROM  mod_logtaller.conf_actividad ca
                left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad 
                inner join mod_logfacturacion.dat_reporteservicio ds on ds.idservicio = ca.idactividad ";
                    $where = " Where dae.identidad = {$this->global->Estructura->idestructura} AND ca.idindicador is null";
                    $where .= " AND ds.idreporteventa = {$params['idreporteventa']}";
                    $limit = "";
                    if ($params['limit']) {
                        $limit.= " LIMIT {$params['limit']} ";
                    }
                    if ($params['start']) {
                        $limit.= "OFFSET {$params['start']} ";
                    }
                    $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec. $from. $where)
                        ->fetchAll(PDO::FETCH_ASSOC);

                    $result = $conn->execute($selec.$from.$where. $limit)->fetchAll();

                    $return = array('datos'=>$result, 'cantidad'=>count($total));
                }
                break;
            case 'deposito':
                $logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
                foreach ($data as &$d) {
                    $depositos = $logistEstrucUbica->cargardepositos($d['iddeposito'], null,null,null,0,-1)['depositos'];
                    $d['denominacion'] = $depositos[0]['deposito'];
                }
                $return = array('datos'=>$data, 'cantidad'=>count($data));
                break;
            case 'operacion':
                foreach ($data as &$d){
                    $operaciones = $this->sConfGeneral->obtenerOperaciones(
                        null, LogisticaGlobal::SUBSISTEMA_FAC, $this->objIddocFac->iddoc, $d['idoperacion']
                    );
                    $d['denominacion'] = $operaciones[0]['denominacion'];
                }
                $return = array('datos'=>$data, 'cantidad'=>count($data));
                break;
            case 'naturaleza':
                foreach ($data as &$d){
                    $params['dql'] = 1;
                    $params['idnaturaleza'] = $d['idnaturaleza'];
                    $query = $this->sConfGeneral->obtenerDatosArbolNaturaleza($params)->addSelect('codigo, codigocontable')->addWhere('idnaturaleza = ?', array($d['idnaturaleza']));
                    $naturaleza = $query->fetchArray();
                    $d['denominacion'] = $naturaleza[0]['codigo'];
                }
                $return = array('datos'=>$data, 'cantidad'=>count($data));
                break;
            default: break;
        }
        /*$query = Doctrine_Query::create();
        $cantidad = $query->count();
        $datos = $query->fetchArray();//poner los limites*/
        return $return;
    }

    public function actionsConcepto($params){
        if ($params['actions'] == 'add') {
            $ids = json_decode($params['ids']);
            $util = json_decode($params['util']);
            $collection = new Doctrine_Collection($util->domain);
            foreach ($ids as $id) {
                $obj = new $util->domain();
                if ($util->domain == 'ConfVendedor') {
                    $obj->$params['idconcepto'] = $id;
                    $obj->idestructuracomun = $this->idestructura;
                    $collection->add($obj);
                }else{
                    if($util->domain == 'DatReportedeposito') {
                      $obj->$params['idconcepto'] = $id;
                      $obj->idestructuracomun = $this->idestructura;
                      $obj->idreporteventa = $params['idreporteventa'];
                      $collection->add($obj);
                    } else {
                      $estructuras = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                        "select distinct conf.idestructuracomun from mod_logfacturacion.conf_configuracionfactura conf"
                      )->fetchAll(PDO::FETCH_COLUMN);
                      foreach($estructuras as $est) {
                        $existe = Doctrine::getTable($util->domain)->findByDql("{$params['idconcepto']} = ? and idestructuracomun = ? and idreporteventa = ?", array($id,$est,$params['idreporteventa']));
                        if (count($existe) == 0) {
                          $obj = new $util->domain();
                          $obj->$params['idconcepto'] = $id;
                          $obj->idestructuracomun = $est;
                          $obj->idreporteventa = $params['idreporteventa'];
                          $collection->add($obj);
                        }
                      }      
                    }
                }
            }
            try{
                $collection->save();
            }catch (Exception $e){
                if($e->getCode() == 23505)
                    throw new ZendExt_Exception('LOG_LB_FAC_005');
            }
        } else {
            $ids = json_decode($params['ids']);
            $util = json_decode($params['util']);
            if(count($ids) > 0){
                $query = Doctrine_Query::create()->delete()->from($util->domain)->whereIn("{$util->primaryKey}", $ids);
                //if($util->domain == 'ConfVendedor') {
                    $query->andWhere('idestructuracomun = ?', array($this->idestructura));
                //}
                $query->execute();
            }
        }
    }

    public function cargarPersonas($params = array())
    {
        $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            $params['idspersonas'], $params['criterio'], $params['limit'], $params['start'], array(), array(),
            $this->idestructura
        );
        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
    }

    public function getVendedores($params) {
        $ids = LogisticaDoctrineHelper::__init()->getConnection()->execute("
            select c.idpersona from mod_logfacturacion.conf_vendedor c where c.idestructuracomun = {$this->idestructura}
        ")
            ->fetchAll(PDO::FETCH_COLUMN);
        $params['idspersonas'] = (count($ids) > 0) ? $ids : array(-1);
        return $this->cargarPersonas($params);
    }

    public function obtenerClasificacion($params) {
        $objNomenclador = new NomencladoresLogService();
        return $objNomenclador->buscarEntidad($params);
    }
    
    public function getAgrupaciones($params){
        $conn = Zend_Registry::get('conexion');
        $selec = "Select distinct cr.agrupacion";
        $from = " FROM  mod_logfacturacion.conf_reporteventa cr";
        //$where = " Where cr.idestructuracomun = {$this->global->Estructura->idestructura}";
        $where = " Where lower(cr.agrupacion) <> lower('null') and cr.agrupacion is not null and cr.agrupacion <> ''";
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec. $from. $where)
            ->fetchAll(PDO::FETCH_ASSOC);
        $result = $conn->execute($selec.$from.$where. $limit)->fetchAll();
        return array('datos'=>$result, 'cantidad'=>count($result));
    }

    public function getIdPadreMatriz() {
        $dql = "select coalesce(idpadrematriz,{$this->global->Estructura->idestructura}) as idpadre, 
                coalesce(preciocentral,0) as preciocentral,
                coalesce(mediaproductos,1) as mediaproductos,
                coalesce(mediaservicios,1) as mediaservicios,
                coalesce(formula,1) as formula 
                from mod_logfacturacion.conf_configuracionfactura 
                where idestructuracomun = {$this->global->Estructura->idestructura}";
        $dqlResult = LogisticaDoctrineHelper::__init()->getConnection()->execute($dql)->fetchAll(PDO::FETCH_ASSOC);
        return $dqlResult[0];
    }

    public function addPrecioMatrizNaturaleza($parametros) {
        $collMP = new Doctrine_Collection('DatMatrizprecio');
        $sqlTP = "select DISTINCT dm.idtipoprecio from mod_logfacturacion.dat_matrizprecio dm ".
                    "where dm.idindicador in ( ".
                    "select dm1.idindicador from mod_logfacturacion.dat_matrizprecio dm1 ".
                    "inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm1.idindicador ".
                        "where ni.idnaturaleza = {$parametros['idnaturaleza']}".
                  ") and dm.preciopromedio = 1";
        $tiposPrecio = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlTP)->fetchAll(PDO::FETCH_COLUMN);
        foreach ($tiposPrecio as $tp) {
            $sqlMP = "select max(dm.idmatrizprecio) from mod_logfacturacion.dat_matrizprecio dm ".
                     "where dm.idindicador in ( ".
                     " select dm1.idindicador from mod_logfacturacion.dat_matrizprecio dm1 ".
                     "   inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm1.idindicador ".
                     "   where ni.idnaturaleza = {$parametros['idnaturaleza']} ".
                     ") and dm.preciopromedio = 1 and dm.idtipoprecio = {$tp}";
            $matrizCopia = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlMP)->fetchAll(PDO::FETCH_COLUMN);
            $dmp = Doctrine::getTable('DatMatrizprecio')->find($matrizCopia[0])->toArray();
            $newDmp = new DatMatrizprecio();
            unset($dmp['idmatrizprecio']);
            unset($dmp['idindicador']);
            $newDmp->synchronizeWithArray($dmp);
            $newDmp->idindicador = $parametros['idindicador'];
            $dmdm = Doctrine::getTable('DatMatrizpreciodualmonetaria')->findByDql('idmatrizprecio = ?', array($matrizCopia[0]));
            foreach ($dmdm as $matDual) {
                $matDual = $matDual->toArray();
                $newMatDual = new DatMatrizpreciodualmonetaria();
                $idmatrizdualaux = $matDual['idmatrizpreciodualidadmonetaria'];
                unset($matDual['idmatrizpreciodualidadmonetaria']);
                unset($matDual['idmatrizprecio']);
                $newMatDual->synchronizeWithArray($matDual);
                $dprecio = Doctrine::getTable('DatPrecio')->findByDql('idmatrizpreciodualidadmonetaria = ?', array($idmatrizdualaux));
                foreach ($dprecio as $dp) {
                    $dp = $dp->toArray();
                    $newDP = new DatPrecio();
                    unset($dp['idmatrizpreciodualidadmonetaria']);
                    unset($dp['idprecio']);
                    $newDP->synchronizeWithArray($dp);
                    $newMatDual->DatPrecio->add($newDP);
                }

                $newDmp->DatMatrizpreciodualmonetaria->add($newMatDual);
            }
            $collMP->add($newDmp);
        }
        return $collMP->save();
    }

    public function borrarPrecios($params){
        if ($params['idtipoprecio']) {
            $where = "";
            if ($params['idnaturaleza']) {
                $where = " and ni.idnaturaleza = {$params['idnaturaleza']} ";
            }
            $idpadrematriz = $this->getIdPadreMatriz()['idpadre'];
            Doctrine_Manager::connection()->execute(
                "delete from mod_logfacturacion.dat_matrizprecio dm where dm.idtipoprecio = {$params['idtipoprecio']} ".
                       "and dm.idestructuracomun = {$idpadrematriz} and dm.idindicador in (".
                       "select ni.idindicador from mod_datosmaestros.nom_indicador ni where ni.tipo = {$params['tipo']} ".
                       "{$where})"
            );
        }
        return true;
    }

    public function getSector() {
        $sql = "select ns.idsector, ns.denominacion from mod_crmcontratacion.nom_sector ns ORDER BY 2";
        return array('datos' => LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC));
    }

    public function getUltimaFecha(){
        $sql = "select max(f.fecha) as fecha from public.dat_controlactualizarprecios f";
        return LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizarPrecios($params) {
        if ($params['idnaturaleza']) {
            Doctrine_Manager::connection()->execute(
                "select mod_datosmaestros.f_actualizarpreciosbyparams(null, null, {$params['idnaturaleza']})"
            );
        }
        if ($params['idindicador']) {
            Doctrine_Manager::connection()->execute(
                "select mod_datosmaestros.f_actualizarpreciosbyparams({$params['idindicador']}, null, null)"
            );
        }
        if(!$params['idindicador'] && !$params['idnaturaleza']) {
            Doctrine_Manager::connection()->execute(
                "select mod_datosmaestros.f_actualizarpreciosbyparams(null, null, null)"
            );
        }
        return true;
    }

    public function sincronizarArray($datos, $params)
    {
        $campos = array(
            'codigoproveedor', 'precio', 'moneda'
        );
        $total = count($datos)-1;
        $productos = array();
        $sqlmoneda = "select idmoneda from mod_datosmaestros.nom_moneda where codigoiso = '{$datos[1][2]}'";
        $idmoneda = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlmoneda)->fetchAll(PDO::FETCH_ASSOC)[0]['idmoneda'];
        $noexiste = array();
        foreach ($datos as $index => $item) {
            if ($index > 0) {
                $idindicador = $this->existeIndicador($item[0]);
                if ($idindicador != -1) {
                    array_push($productos, array('idindicador'=>$idindicador,'precio'=>$item[1], 'idmoneda'=>$idmoneda));
                } else {
                  $noexiste[] = $item[0];
                }
            }
        }
        return array('productos' => $productos,'importados' => count($productos), 'total' => $total, 'error'=>1, 'noimportados' => implode(',',$noexiste));
    }

    public function importarFichero($datos, $params){
        $idestructura = $this->getIdPadreMatriz()['idpadre'];
        foreach ($datos['productos'] as $p) {
            $sqlMatriz = "select idmatrizprecio from mod_logfacturacion.dat_matrizprecio where idtipoprecio = {$params['idtipoprecio']}
                          and idindicador = {$p['idindicador']} and idestructuracomun = {$idestructura}";
            $matriz = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlMatriz)->fetchAll(PDO::FETCH_ASSOC);
            if (count($matriz) > 0) {
                $sqlMatrizDual = "select idmatrizprecio from mod_logfacturacion.dat_matrizpreciodualmonetaria 
                                  where idmatrizprecio = {$matriz[0]['idmatrizprecio']}";
                $matrizDual = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlMatrizDual)->fetchAll(PDO::FETCH_ASSOC);
                if (count($matrizDual) > 0) {
                    $sql = "update mod_logfacturacion.dat_matrizpreciodualmonetaria set precio = {$p['precio']}, precioventa = {$p['precio']},
                    idmoneda={$p['idmoneda']} where idmatrizprecio={$matriz[0]['idmatrizprecio']}";
                } else {
                    $sql = "INSERT INTO mod_logfacturacion.dat_matrizpreciodualmonetaria
                            ( idmoneda, idmatrizprecio, precioventa, precio )
                            VALUES ({$p['idmoneda']},{$matriz[0]['idmatrizprecio']},{$p['precio']}, {$p['precio']})";
                }
            } else {
                $sql = "with rows AS (INSERT INTO mod_logfacturacion.dat_matrizprecio
                ( idindicador, idestructuracomun, idtipoprecio ) 
                VALUES ( {$p['idindicador']}, {$idestructura}, {$params['idtipoprecio']} ) RETURNING idmatrizprecio)
                INSERT INTO mod_logfacturacion.dat_matrizpreciodualmonetaria
                            ( idmoneda, idmatrizprecio, precioventa, precio ) 
                select {$p['idmoneda']},idmatrizprecio,{$p['precio']}, {$p['precio']} from rows";
            }
            Doctrine_Manager::connection()->execute($sql);
        }
        return $datos;
    }

    public function existeIndicador($codigo = '-1') {
        $sql = "select idindicador from mod_datosmaestros.nom_indicador where numeropieza = regexp_replace('{$codigo}', E'[\\n\\r]+', '', 'g' )";
        $indicador = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return (count($indicador) > 0) ? $indicador[0] : -1;
    }

    public function cargarNaturalezaMedia($params) {
        $params['dql'] = 1;
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $dql = $this->sConfGeneral->obtenerDatosArbolNaturaleza($params);
        if ($params['criterio']) {
            $dql->addWhere("codigo ilike '%{$params['criterio']}%' or denominacion ilike '%{$params['criterio']}%'");
        }
        $total = $dql->count();
        $datos = $dql->offset($start)->limit($limit)->fetchArray();
        foreach ($datos as &$nat) {
            $sql = "select idnaturalezamedia, media from mod_logfacturacion.dat_naturalezamedia 
                    where idtipoprecio = {$params['idtipoprecio']} and idnaturaleza = {$nat['idnaturaleza']}";
            $aux = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            if (count($aux)) {
                $nat['idnaturalezamedia'] = $aux[0]['idnaturalezamedia'];
                $nat['media'] = $aux[0]['media'];
            }
        }
        return array('datos' => $datos, 'cantidad' => $total);
    }

    public function cargarSectorMedia($params) {
        $params['dql'] = 1;
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $dql = $this->sConfGeneral->obtenerDatosArbolNaturaleza($params);
        if ($params['criterio']) {
            $dql->addWhere("codigo ilike '%{$params['criterio']}%' or denominacion ilike '%{$params['criterio']}%'");
        }
        $total = $dql->count();
        $datos = $dql->offset($start)->limit($limit)->fetchArray();
        foreach ($datos as &$nat) {
            $sql = "select idsectormedia, media from mod_logfacturacion.dat_sectormedia
                    where idtipoprecio = {$params['idtipoprecio']} and idnaturaleza = {$nat['idnaturaleza']} 
                    and idsector = {$params['idsector']}";
            $aux = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            if (count($aux)) {
                $nat['idsectormedia'] = $aux[0]['idsectormedia'];
                $nat['media'] = $aux[0]['media'];
            }
        }
        return array('datos' => $datos, 'cantidad' => $total);
    }

    public function habilitarSeries($params) {
        $ids = implode(',', json_decode($params['ids']));
        $sql = "
            update mod_logfacturacion.nom_seriedocumento nsd
            set estado = {$params['estado']}
            where idseriedocumento in ({$ids})
        ";
        Doctrine_Manager::connection()->fetchAll($sql);
        return true;
    }

    public function deshabilitarSerieXFecha() {
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC);
        $sql = "
            update mod_logfacturacion.nom_seriedocumento nsd
            set estado = 0
            from mod_logfacturacion.dat_seriedocentidad sen
            where sen.idseriedocumento = nsd.idseriedocumento and sen.idestructuracomun = {$this->idestructura} 
            and nsd.fechafin < '{$fecha->fecha}' or nsd.fechainicio > '{$fecha->fecha}'
        ";
        Doctrine_Manager::connection()->fetchAll($sql);
    }

    public function getEstructuras() {
        $sql = "select distinct idestructuracomun from mod_logfacturacion.dat_matrizprecio 
               where idestructuracomun is not null";
        $aux = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);

        $estructurasR = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        $estructuras = array();
        foreach ($estructurasR as $e) {
            if (in_array($e->idestructura, $aux)) {
                array_push($estructuras, $e);
            }
        }

        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }
}
