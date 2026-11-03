<?php

class ComunpuntoventaModel extends DocumentoLogisticaModel
{
    private $_logisticaDoctrine, $_logisticaDoc, $_serviciosRecursosHumanos;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->_logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $this->_logisticaDoc = LogisticaDocumentosHelper::__init();
        $this->_serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();
        $objIddoc = $this->_logisticaDoc->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->iddoc = $objIddoc->iddoc;
        $relationsS[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatVentaproducto',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->_logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relationsS);
    }

    public function cargarAreas($params)
    {
        $facService = new FacturacionService();
        $query = Doctrine_Query::create()->select('da.*,da.nombre as nombretienda,inf.*,infcr.*')->from('DatAreaventa da')
            ->where('da.idestructuracomun = ?', array($this->global->Estructura->idestructura))
            ->leftJoin('da.DatInfoConexion inf')
            ->leftJoin('da.DatInfoConexioncr infcr');
        $query->addSelect("(SELECT COUNT(cj.idcaja) FROM DatCaja cj WHERE cj.idareaventa = da.idareaventa AND cj.idtiporegistradora IS NOT NULL) as contienecr");
        $this->doctrineHelper->addQueryLimits($query, $params);
        if ($params['cmbArea']) {
            $query->addWhere('da.activo = 1');
        }
        if ($params['tipo']) {
            $query->addWhere('inf.tipo = ?', array($params['tipo']));
        }
        $arrayDepositos = $query->orderBy('da.idareaventa')->fetchArray();
        $datos = Array();

        if ($params['addAll']) {
            array_push($datos, array('idareaventa' => -1, 'coddenominacion' => '--- MOSTRAR TODO ---'));
        }
        $cantidad = $query->count();
        foreach ($arrayDepositos as $index => &$deposito) {
            $deposito['tiendavirtual'] = 0;
            $deposito['idinfoconexion'] = $deposito['DatInfoConexion']['idinfoconexion'];
            $deposito['tipo'] = $deposito['DatInfoConexion']['tipo'];
            $deposito['url'] = $deposito['DatInfoConexion']['url'];
            $deposito['clave'] = $deposito['DatInfoConexion']['clave'];
            $deposito['usuarioez'] = $deposito['usuarioez'];
            $deposito['consumerkey'] = $deposito['DatInfoConexion']['consumerkey'];
            $deposito['consumersecret'] = $deposito['DatInfoConexion']['consumersecret'];
            $deposito['nombreconexion'] = $deposito['DatInfoConexion']['nombreconexion'];
            $deposito['codigotienda'] = $deposito['DatInfoConexion']['codigotienda'];
            $deposito['tiendavirtual'] = ($deposito['idinfoconexion']) ? 1 : 0;
            $deposito['modocatalogo'] = $deposito['DatInfoConexion']['modocatalogo'];

            $deposito['cr'] = $deposito['DatInfoConexioncr']['idinfoconexioncr'] ? 1 : 0;
            $deposito['urlapicr'] = $deposito['DatInfoConexioncr']['url'];
            $deposito['clavecr'] = $deposito['DatInfoConexioncr']['clave'];
            $deposito['keypublic'] = $deposito['DatInfoConexioncr']['keypublic'];
            $deposito['keysecret'] = $deposito['DatInfoConexioncr']['keysecret'];

            unset($deposito['DatInfoConexion']);
            unset($deposito['DatInfoConexioncr']);
            $estructura = $this->estructuraHelper->getEstructura($deposito['idestructuraop']);
            $deposito['coddenominacion'] = $estructura[0]->codigo ?
                $estructura[0]->codigo . ' - ' . $estructura[0]->text : $estructura[0]->text;
            if ($deposito['idcliente']) {
                $datoscliente = $this->configuracionHelper->getClientesProveedorByParams(
                    $deposito['idcliente'], null, null, null, null, null);
                $deposito['nombre'] = $datoscliente['datos'][0]['codigo'] . ' - ' . $datoscliente['datos'][0]['nombre'];
            } else {
                $deposito['nombre'] = null;
            }
            if ($deposito['idtipoprecio']) {
                $deposito['denominacionPrecio'] = $facService->getTipoPreciosCliente(array(), $deposito['idtipoprecio']);
            }
            if ($deposito['idtipoprecioagencia']) {
                $deposito['denominacionPrecioA'] = $facService->getTipoPreciosCliente(array(), $deposito['idtipoprecioagencia']);
            }
            if ($deposito['idmodopago']) {
                $deposito['modopago'] = Doctrine::getTable('NomModopago')->find($deposito['idmodopago'])->denominacion;
            }
            if ($deposito['idnomoperaciones']) {
                $datosOp = $facService->getOperaciones(array('idoperacion' => $deposito['idnomoperaciones']));
                $deposito['nombreoperacion'] = $datosOp[0]['nombreoperacion'];
            }
            if ($deposito['idnomoperaciondev']) {
                $datosOp = $facService->getOperaciones(array('idoperacion' => $deposito['idnomoperaciondev']));
                $deposito['nombreoperaciondev'] = $datosOp[0]['nombreoperacion'];
            }

            if (($params['criterio'] && strpos(
                        strtolower($deposito['coddenominacion']), strtolower($params['criterio'])))
                || (empty($params['criterio']))) {
                //$deposito['denominacion'] = $estructura[0]->text;
                //$this->cajasNecesariasPV($querycajasnecesarias, $deposito);
                array_push($datos, $deposito);
            } else {
                $cantidad--;
                unset($arrayDepositos[$index]);
            }
        }
        return array('cantidad' => $cantidad, 'datos' => $datos);
    }

    /**
     * @description Retorna los dias habiles de las areas
     * @param array $queryhabiles ,&$deposito
     */
    public function diasHabilesPV($queryhabiles, &$deposito)
    {
        foreach ($queryhabiles as &$dias) {
            if ($dias['idareaventa'] == $deposito['idareaventa']) {
                $deposito['diashabiles'] = $dias['diashabiles'];
                $deposito['idcliente'] = $dias['idcliente'];
            }
        }
    }

    /**
     * @description Retorna las cajas necesarias
     * @param array $querycajasnecesarias ,&$deposito
     */
    public function cajasNecesariasPV($querycajasnecesarias, &$deposito)
    {
        foreach ($querycajasnecesarias as &$cajas) {
            if ($cajas['idareaventa'] == $deposito['idareaventa']) {
                $deposito['idareacaja'] = $cajas['idareaventa'];
                $deposito['activocaja'] = $cajas['activo'];
            }
        }
    }

    /**
     * @description Retorna las cajas existentes en la entidad
     * @param array $params
     * @return array
     */
    public function getCajaAreaAll($params)
    {
        $query = Doctrine_Query::create()
            ->select(
                "dc.idcaja,dc.activo,(ntc.codigo||' - '||ntc.denominacion) AS coddenominacion,ntc.codigo,"
                . "ntc.denominacion AS tipocaja, ntc.idtipocaja AS idtipocaja, dc.modeloimpresion, dc.idmodeloimpresion,
                dc.idtiporegistradora, dc.modelocaja, dc.identificador, dc.ip"
            )
            ->from('DatCaja dc')
            ->innerJoin('dc.NomTipocaja ntc')
            ->innerJoin('ntc.DatTipocajaEntidad dtce');
        $this->addFiltrers($query, $params);
        /*print_r($params);die;
        echo $query->getSqlQuery();die;*/
        return [
            'cantidad' => $query->count(),
            'datos' => $this->concatenarAreaVenta($this->doctrineHelper->addQueryLimits($query, $params)->fetchArray())
        ];
    }

    /**
     * @description Concatena la denominación del área a la que pertenece cada producto
     * @param array $datos
     * @return array
     */
    protected function concatenarAreaVenta($datos)
    {
        foreach ($datos as &$caja) {
            $coddenominacion = $this->estructuraHelper->getEstructura($caja['idestructuraop']);
            $caja['area'] = $coddenominacion[0]->codigo . ' - ' . $coddenominacion[0]->denominacion;
            $caja['concat'] = $coddenominacion[0]->denominacion . ' - ' . $caja['tipocaja'];
        }
        return $datos;
    }

    /**
     * @description Adiciona filtros a la consulta de las cajas existentes en la entidad
     * @param Doctrine_Query $query
     * @param array $params
     * @return object [Doctrine_Query]
     */
    public function addFiltrers(Doctrine_Query $query, $params)
    {
        $idestructura = $params['idestructura'] ? $params['idestructura'] : $this->global->Estructura->idestructura;
        //$query->addWhere('dtce.idestructuracomun = ?', array($idestructura));
        if ($params['start']) {
            $query->offset($params['start']);
        }
        if ($params['limit']) {
            $query->limit($params['limit']);
        }
        if ($params['activo']) {
            $query->addWhere('dc.activo = ?', [1]);
        }
        $this->filter($query, $params, $idestructura);
    }

    public function filter($query, $params, $idestructura)
    {
        if ($params['idusuario']) {
            $query->innerJoin("dc.DatCajausuario dcu")->addWhere('dcu.idusuario = ?', [$params['idusuario']]);
        }
        if ($params['areaVenta']) {
            $query->innerJoin('dc.DatAreaventa dav')
                ->addSelect(
                    "dav.idareaventa as idareaventa, dav.idestructuraop as idestructuraop, (SELECT "
                    . "COUNT(dcus.idcajausuario) FROM DatCajausuario dcus WHERE dcus.idcaja = dc.idcaja) as usuarios"
                )
                ->addWhere('dav.idestructuracomun = ?', array($idestructura));
        }
        if ($params['criterio']) {
            $query->addWhere(
                "lower(ntc.codigo) like lower('%{$params['criterio']}%') "
                . "or lower(ntc.denominacion) ilike "
                . "lower('%{$params['criterio']}%')"
            );
        }
    }

    /**
     * @description Retorna los productos del área
     * @param array $params
     * @return array
     */
    public function cargarProductos($parametros)
    {
        $parametros['criterio'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        $parametros['idnaturaleza'] = is_numeric($parametros['idnaturaleza']) ? $parametros['idnaturaleza'] : 'null';
        $parametros['idmarca'] = is_numeric($parametros['idmarca']) ? $parametros['idmarca'] : (($parametros['marca'] && is_numeric($parametros['marca'])) ? $parametros['marca'] : 'null');
        $parametros['idmodelo'] = is_numeric($parametros['idmodelo']) ? $parametros['idmodelo'] : (($parametros['modelo'] && is_numeric($parametros['modelo'])) ? $parametros['modelo'] : 'null');
        $parametros['condisponible'] = $parametros['condisponible'] ? 1 : 'null';
        $parametros['conexistencia'] = $parametros['conexistencia'] ? 1 : 'null';
        $parametros['criterioavan'] = $parametros['criterioavan'] ? $parametros['criterioavan'] : 'null';
        $parametros['idmonedaventa'] = $parametros['idmonedaventa'] ? $parametros['idmonedaventa'] : 'null';
        $parametros['idmonedacontable'] = $parametros['idmonedacontable'] ? $parametros['idmonedacontable'] : 'null';
        $parametros['idmonedaalternativa'] = $parametros['idmonedaalternativa'] ? $parametros['idmonedaalternativa'] : 'null';
        $parametros['start'] = $parametros['start'] ? $parametros['start'] : 'null';
        $parametros['limit'] = $parametros['limit'] ? $parametros['limit'] : 'null';
        $parametros['typesync'] = $parametros['typesync'] ? $parametros['typesync'] : 'null';
        $parametros['idnaturalezapadre'] = $parametros['idnaturalezapadre'] ? $parametros['idnaturalezapadre'] : 'null';
        $parametros['idproductos'] = 'null';
        if (isset($parametros['seleccionp'])) {
            $idproductos = implode(', ', json_decode($parametros['seleccionp']));
            $parametros['idproductos'] = "'{".$idproductos."}'";
        }
        $parametros['idnaturalezapadre'] = $parametros['idnaturalezapadre'] ? $parametros['idnaturalezapadre'] : 'null';
        /*if($parametros['criterio'] && count($parametros['criterio']) > 0){
            $parametros['codigo'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['codigoproveedor'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['denominacion'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        }*/
        $parametros['conprecio'] = ($parametros['configuracion']) ? 0 : 1;
        if (isset($parametros['con_precio']) || isset($parametros['sin_precio'])) {
            if (isset($parametros['con_precio']) && $parametros['con_precio'] == 1) {
                $parametros['conprecio'] = 1;
            } else if (isset($parametros['sin_precio']) && $parametros['sin_precio'] == 1) {
                $parametros['conprecio'] = 2;
            }
        }
        $fechacontable = "'" . $this->global->FechaContable->fecha . "'";
        if($parametros['idareaventa']){
            Doctrine_Manager::connection()
                        ->fetchAll("select * from mod_logpuntoventa.f_actualizarpreciosventa ({$parametros['idareaventa']},{$fechacontable})");
        }
        $datosprod['datos'] = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logpuntoventa.f_productosventa ({$parametros['idestructura']}, "
            . "{$parametros['idnaturaleza']}, {$parametros['condisponible']}, "
            . "{$parametros['conexistencia']}, {$parametros['criterio']}, "
            . "{$parametros['idmonedacontable']}, {$parametros['idmonedaalternativa']}, {$parametros['idmonedaventa']}, "
            . "{$parametros['idmarca']}, {$parametros['idmodelo']},{$parametros['limit']}, {$parametros['start']},"
            . "{$parametros['criterioavan']},{$parametros['typesync']},{$parametros['idnaturalezapadre']},{$parametros['conprecio']}, {$parametros['idproductos']} ) q"
        );
        if (!$parametros['typesync'] || $parametros['typesync'] == 'null') {
            $datosprod['cantidad'] = Doctrine_Manager::connection()->fetchAll(
                "select * from mod_logpuntoventa.f_productosventa ({$parametros['idestructura']}, "
                . "{$parametros['idnaturaleza']}, {$parametros['condisponible']}, "
                . "{$parametros['conexistencia']}, {$parametros['criterio']}, "
                . "{$parametros['idmonedacontable']}, {$parametros['idmonedaalternativa']}, {$parametros['idmonedaventa']}, "
                . "{$parametros['idmarca']}, {$parametros['idmodelo']},null, null,{$parametros['criterioavan']},"
                . "{$parametros['typesync']},{$parametros['idnaturalezapadre']},{$parametros['conprecio']}, {$parametros['idproductos']} ) q"
            )[0]['count'];
        }

        return $datosprod;
    }

    public function cargarServicios($parametros)
    {
        $parametros['criterio'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        $parametros['idnaturaleza'] = is_numeric($parametros['idnaturaleza']) ? $parametros['idnaturaleza'] : 'null';
        $parametros['criterioavan'] = $parametros['criterioavan'] ? $parametros['criterioavan'] : 'null';
        $parametros['idmonedaventa'] = $parametros['idmonedaventa'] ? $parametros['idmonedaventa'] : 'null';
        $parametros['idmonedacontable'] = $parametros['idmonedacontable'] ? $parametros['idmonedacontable'] : 'null';
        $parametros['start'] = $parametros['start'] ? $parametros['start'] : 'null';
        $parametros['limit'] = $parametros['limit'] ? $parametros['limit'] : 'null';
        $parametros['idnaturalezapadre'] = $parametros['idnaturalezapadre'] ? $parametros['idnaturalezapadre'] : 'null';
        $parametros['idservicios'] = 'null';
        if (isset($parametros['seleccions'])) {
            $idservicios = implode(', ', json_decode($parametros['seleccions']));
            $parametros['idservicios'] = "'{".$idservicios."}'";
        }
        /*if($parametros['criterio'] && count($parametros['criterio']) > 0){
            $parametros['codigo'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['codigoproveedor'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['denominacion'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        }*/
        $parametros['conprecio'] = ($parametros['conprecio']) ? 1 : 0;

        $datosprod = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logpuntoventa.f_serviciosventa ({$parametros['idareaventa']}, "
            . "{$parametros['idnaturaleza']}, "
            . "{$parametros['criterio']}, "
            . "{$parametros['idmonedacontable']}, {$parametros['idmonedaventa']}, "
            . "{$parametros['limit']}, {$parametros['start']},"
            . "{$parametros['criterioavan']},{$parametros['idnaturalezapadre']},{$parametros['conprecio']}, {$parametros['idservicios']} ) q"
        );

        return array('datos' => $datosprod, 'total' => count($datosprod) ? $datosprod[0]['count'] : 0, 'cantidad' => count($datosprod) ? $datosprod[0]['count'] : 0);
    }

    public function adicionarServicios($params)
    {
        $idMonedaContable = $params['idmonedacontable'];
        $datos = json_decode($params['datos']);
        $serviciosAdd = new Doctrine_Collection('DatServicioareaventa');
        foreach ($datos->servicios as &$serv) {
            $serv = (array)$serv;
            $objServ = new DatServicioareaventa();
            $serv['idmoneda'] = $idMonedaContable;
            $serv['precio'] = ($serv['precio']) ? $serv['precio'] : 0;
            $serv['fecha'] = date('d/m/Y');
            $serv['preciobase'] = ($serv['preciobase']) ? $serv['preciobase'] : 0;
            $serv['descripcionventa'] = ($serv['descripcionventa']) ? $serv['descripcionventa'] : substr($serv['denominacion'], 0, 25);
            $objServ->synchronizeWithArray($serv);
            $serviciosAdd->add($objServ);
        }
        if (count($serviciosAdd)) {
            $serviciosAdd->save();
        }
        return true;
    }

    public function eliminarServicios($params)
    {
        if (count($params['datos'])) {
            $servicios = implode(',', $params['datos']);
            $this->doctrineHelper->getConnection()->execute(
                "delete from mod_logpuntoventa.dat_servicioareaventa
                     where idservicio in ({$servicios})"
            );
        }
        return true;
    }

    public function eliminarOperarios($params)
    {
        if (count($params['datos'])) {
            $operarios = implode(',', $params['datos']);
            $this->doctrineHelper->getConnection()->execute(
                "delete from mod_logpuntoventa.dat_serviciopersona
                     where idserviciopersona in ({$operarios})"
            );
        }
        return true;
    }

    public function cargarOperarios($parametros)
    {
        $limit = "";
        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
        }
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select ps.idserviciopersona, ps.idservicio, ps.idpersona, 
            per.nombre || ' ' || coalesce(per.snombre, '') || ' ' || per.papel || ' ' || per.sapel as nombre, COUNT(*) OVER() as total
            from mod_logpuntoventa.dat_serviciopersona ps 
            inner join mod_persona.dat_persona per on per.idpersona = ps.idpersona 
            where ps.idservicio = {$parametros['idservicio']} {$limit}"
        );

        return array('datos' => $datos, 'total' => count($datos) ? $datos[0]['count'] : 0);
    }

    public function adicionarOperarios($params) {
        $datos = json_decode($params['ids']);
        $personasAdd = new Doctrine_Collection('DatServiciopersona');
        foreach ($datos as &$p) {
            $obj = new DatServiciopersona();
            $obj->idpersona = $p;
            $obj->idservicio = $params['idservicio'];
            $personasAdd->add($obj);
        }
        if (count($personasAdd)) {
            $personasAdd->save();
        }
        return true;
    }

    public function cargarPersonas($params = array())
    {
        $params['idspersonas'] = ($params['idspersonas']) ? $params['idspersonas'] : array();
        $params['criterio'] = ($params['criterio']) ? $params['criterio'] : null;
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $personas = $this->_serviciosRecursosHumanos->getPrincipalesDatosPersona(
            null, $params['criterio'], $params['limit'], $params['start'], array(), array(),
            $this->global->estructura->idestructura
        );
        return array("datos" => ($personas->data) ? $personas->data : array(), "cantidad" => $personas->quantity);
    }

    /**
     * @description Calcula el precio de los productos según la moneda contable
     * @param array $productos
     * @param array $params
     * @return array
     */
    private function calcularPrecioSegunMonedaContable($productos, $params)
    {
        if (!$params['idtipoprecio'] || !$params['idmoneda']) {
            $confAreaventa = Doctrine::getTable('DatAreaventa')->find($params['idareaventa']);
            $confAreaventa = $confAreaventa->toArray();
        } else {
            $confAreaventa = $params;
        }
        //problemas en las tasas y productos ver eso

        $serviciosParametros = ServiciosConfiguracionGeneralHelper::__init();
        $servicioInventario = new ConfiguracioninventarioService();
        $confInv = $servicioInventario->devolverConfiguracion($this->global->estructura->idestructura);
        $facService = new FacturacionService();
        //print_r($confAreaventa);die;
        $in = ($params['idmonedacontable'] == $confAreaventa['idmoneda']) ? $params['idmonedacontable'] : $params['idmonedaalternativa'];
        foreach ($productos as &$prodLogistica) {
            $parametro = null;
            $parametro->idindicador = $prodLogistica['idindicador'];
            $parametro->idtipoprecio = $confAreaventa['idtipoprecio'];
            $precioprod = $facService->getPrecioVentaIndicador($parametro);
            /*$precio = $serviciosParametros->convertirImporte(
                $params['idmonedaalternativa'], $params['idmonedacontable'], $confInv['idtipotasa'],
                $prodLogistica['precioalternativo'], 0
            );*/
            if (count($precioprod['datos']) > 0) {
                //$firstKey = array_keys($precioprod['datos']);
                $preciobase = $precioprod['datos'][$in]['precioventa'];
                if ($preciobase > 0) {
                    $precioVenta = $serviciosParametros->convertirImporte(
                        $in, $confAreaventa['idmoneda'], $confInv['idtipotasa'], $preciobase, 0
                    );
                    $prodLogistica['precio'] = round(($precioVenta) ? $precioVenta : 0, 2);//round($prodLogistica['precio'] + (is_numeric($precio) ? $precio : 0), 2);
                    $prodLogistica['precioventa'] = $prodLogistica['precio'];
                }

                /*if ($params['precioCero'] == 0) {
                    unset($prodLogistica);
                }else{
                    $prodLogistica['precio'] = 0;
                    $prodLogistica['precioCUC'] = $prodLogistica['precio'];
                }  */
            } else {
                unset($prodLogistica);
            }
            //print_r($prodLogistica);die;

            /*$precioCUC = $serviciosParametros->convertirImporte(
                $params['idmonedacontable'], $params['idmonedaalternativa'], $confInv['idtipotasa'],
                $prodLogistica['precio'], 0
            );
            //problema con el cuc
            //$precioCUC = round(($prodLogistica['precio'] / 25), 2);
            // $prodLogistica['precioCUC'] = is_numeric($precioCUC) ? $precioCUC : 0;
            $prodLogistica['precioCUC'] = is_numeric(round($precioCUC, 2)) ? $precioCUC : 0;*/
        }
        return $productos;
    }

    /**
     * @description Si existe INVENTARIO, retorna los productos de los documentos de salida aprobados,
     * sino,los indicadores
     * @param array $params
     * @return array
     */
    public function cargarProductosEntrada($params)
    {
        if (!empty($params['existeInv'])) {
            $params['tipo'] = 2;
            $servProdInv = new DocumentosalidaService();
            return $servProdInv->devolverProductosDoc($params, false);
        } else {
            $maestroP = new MaestroProductoModel();
            return array(
                'cantidad' => $maestroP->cargarGridNomenclador($params, true)->addWhere('indh.precio > 0')->count(),
                'datos' => LogisticaDoctrineHelper::__init()->addQueryLimits($maestroP
                    ->cargarGridNomenclador($params, true)->addWhere('indh.precio > 0'), $params)->fetchArray()
            );
        }
        /* $maestroP = new MaestroProductoModel();
         return $maestroP->cargarGridNomenclador($params, true)->addWhere('indh.precio > 0');
         foreach ($maestroProducto->fetchArray() as  $p) {
             if (isset($p['precio'])) {
                 array_push($datosProducto, $p);
                 $cant++;
             }
         }
         // $maestroProductoM = array('cantidad' => $maestroProducto->count(),
         //'datos' => $maestroProducto->fetchArray());
         retu array('cantidad' => $cant, 'datos' => $datosProducto);
         return array_unique(array_merge($productos, $maestroProductoM));
         // return $maestroP->cargarGridNomenclador($params);*/
    }

    /**
     * @description Retorna los productos vendidos
     * @param array $params
     * @return array
     */
    public function cargarProductosVendidos($params)
    {
        $params['asentado'] = true;
        $params['prodareas'] = true;
        $params['grid'] = true;
        $producto = new LogisticaProductoModel();
        $query = $producto->cargarProductos($params, true);
        $params['idproducto'] = 'p.idproducto';
        $dqlOne = $this->getSubQueryProductoDevuelto($params);
        $dqlTwo = $this->getSubQueryProductoDevuelto($params, 'dpd2');
        $query->innerJoin('p.DatVentaproducto dvp')
            ->addSelect(
                "(dvp.cantidad - COALESCE($dqlOne,0)) as cantidadvendida, "
                . "dvp.recargo as recargo, dvp.descuento as descuento"
            )
            ->addWhere("dvp.idventas = ?", array($params['idventas']))
            ->addWhere("(dvp.cantidad - COALESCE($dqlTwo,0)) > 0");
        $producto = $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray();
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->calcularPrecioSegunMonedaContable($producto, $params)
        );
    }

    /**
     * @description Retorna una subconsulta
     * @param array $params
     * @param string $alias
     * @return string
     */
    private function getSubQueryProductoDevuelto($params, $alias = 'dpd')
    {
        return "(SELECT COALESCE(SUM({$alias}.cantidaddevolver), 0) FROM DatProductoDevuelto {$alias} "
            . "INNER JOIN {$alias}.DatDevolucion {$alias}d WHERE {$alias}.idproducto = {$params['idproducto']} "
            . "AND {$alias}d.idventas = {$params['idventas']} AND {$alias}.iddevolucion = {$alias}d.iddevolucion)";
    }

    /**
     * @description Retorna las ventas realizadas por áreas
     * @param array $params
     * @param Doctrine_Query $dql
     * @return array
     */
    /*public function ventasRealizadas($params = array(), $dql = false)
    {

        $dqlOne = $this->getSubQueryVentas();
        $dqlTwo = $this->getSubQueryVentas('dvp2');
        $query = Doctrine_Query::create()
            ->select(
                "dv.estado as estado ,dv.idventas,dv.idpersona,dv.fechaventa,
                dv.fechaexpiracion,dv.importe,dv.nroventa,dav.idestructuraop"
                . " AS idestructuraop,dav.idareaventa AS idareaventa,$dqlOne as productos,
                dcu.idusuario as idusuario"
            )
            ->from('DatVenta dv')->innerJoin('dv.DatAreaventa dav')
            ->leftJoin('dav.DatCaja dc')->leftJoin('dc.DatCajausuario dcu')
            ->where('dav.idestructuracomun = ?', array($this->global->estructura->idestructura))
            ->andWhere('dv.estado = 2 or dv.estado = 1')->andWhere("$dqlTwo > 0")->orderBy('dav.idestructuraop')
            ->offset($params['start'])
            ->limit($params['limit']);
        $this->filtrersVentasRealizadas($query, $params);
        if ($dql) {
            return $query;
        }
        return [
            'cantidad' => $query->count(),
            'datos' => $this->concatenarAreaVenta($query->fetchArray())
        ];
    }*/

    /**
     * @description Retorna subconsulta con la cantidad de productos vendidos
     * @param string $alias
     * @return string
     */
    private function getSubQueryVentas($alias = 'dvp')
    {
        $filtros = array('idventas' => 'dv.idventas', 'idproducto' => "{$alias}.idproducto");
        $subDql = $this->getSubQueryProductoDevuelto($filtros, $alias . 'd2');
        return "(SELECT COUNT({$alias}.idventaproducto) FROM DatVentaproducto {$alias} "
            . "WHERE {$alias}.idventas = dv.idventas AND ({$alias}.cantidad - $subDql) > 0)";
    }

    /**
     * @description Adiciona filtros a las ventas realizadas
     * @param Doctrine_Query $query
     * @param array $params
     */
    /*private function filtrersVentasRealizadas(Doctrine_Query $query, $params)
    {
        if ($params['desde']) {
            $query->addWhere('dv.fechaventa >= ?', array($params['desde']));
        }
        if ($params['hasta']) {
            $query->addWhere('dv.fechaventa <= ?', array($params['hasta']));
        }
        if (!$params['desde'] && !$params['hasta']) {
            $query->addWhere(
                "(now() >= dv.fechaventa AND dv.fechaexpiracion IS NULL) "
                . "OR (now() >= dv.fechaventa AND now() <= dv.fechaexpiracion)"
            );
        }
        $this->filterRealizadas($query, $params);
    }*/

    /*private function filterRealizadas($query, $params)
    {
        if ($params['criterio']) {
            $criterio = is_numeric($params['criterio']) ? $params['criterio'] : 0;
            $query->addWhere("dv.nroventa = ?", array($criterio));
        }
		if ($params['idventacliente']) {
            $params['idventacliente'] = is_numeric($params['idventacliente']) ? $params['idventacliente'] : 0;
            $query->addWhere("dav.idcliente = ?", array($params['idventacliente']));
        }
        if ($params['idestructura']) {
            $query->addWhere('dav.idestructuraop = ?', array($params['idestructura']));
        }
        if ($params['ordenarcaja']) {
            $query->innerJoin('dav.DatCaja dc')->innerJoin('dc.NomTipocaja ntc')
                ->addSelect("dc.idcaja as idcaja, ntc.denominacion as denominacioncaja")
                ->orderBy('ntc.denominacion');
        }
    }*/

    /**
     * @description  filtros a los productos del terminal punto de venta(TPV)
     * @param Doctrine_Query $query
     * @param array $params
     */
    /*private function filtrersRecuperarProductosTpv($productos, $params)
    {
        $prodfechas = Array();
        foreach ($productos as &$prod) {
            $fecha = $this->fechaProductoDocumento($prod['idproducto']);
            $params['fecha'] = ($fecha[0]['fecha']) ? $fecha[0]['fecha'] : 'null';
            $params['fecha'] = str_replace('/', '-', $params['fecha']);
            settype($params['desde'], "string");
            settype($params['hasta'], "string");
            settype($params['fecha'], "string");
            array_push($prodfechas, $this->filterTPV($params, $prod));
        }
        return $prodfechas;
    }*/

    /*private function filterTPV($params,$prod)
    {
        //$prodfech = Array();
        if ((strtotime($params['fecha']) >= strtotime($params['desde']) &&
                strtotime($params['fecha']) <= strtotime($params['hasta'])) && $params['hasta'] && $params['desde']
        ) {
            $prod['fechavalida'] = $params['fecha'];
           // array_push($prodfech, $prod);
        }
        if (strtotime($params['desde']) <= strtotime($params['fecha']) && $params['hasta'] == null) {
            $prod['fechavalida'] = $params['fecha'];
           // array_push($prodfech, $prod);
        }
        if (strtotime($params['fecha']) <= strtotime($params['hasta']) && !$params['desde']) {
            $prod['fechavalida'] = $params['fecha'];
           // array_push($prodfech, $prod);
        }
        return $prod;
    }*/
    /**
     * @description Retorna TRUE si el usuario logueado en la entidad tiene asignada al menos una caja
     * @return boolean
     */
    public function existeUsuarioConCaja()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $idestructura = $this->global->estructura->idestructura;
        return Doctrine_Query::create()->from('DatAreaventa dav')->innerJoin('dav.DatCaja dc')
                ->innerJoin('dc.DatCajausuario dcu')->where(
                    'dcu.idusuario = ? AND dav.idestructuracomun = ?', array($idusuario, $idestructura)
                )->andWhere('dc.activo = 1')->count() > 0;
    }

    /**
     * @description Retorna los productos del terminal de productos de venta(productostpv)
     * @param array $params
     * @return array
     */
    /*public function cargarProductostpv($params)
    {
        if (!$params['idareas']) {
            $areas = Doctrine_Query::create()->select('idestructuraop')->from('DatAreaventa')
                ->where(
                    'idestructuracomun = ? and activo = 1 ',
                    array($this->global->Estructura->idestructura)
                )->fetchArray();
            $params['idestructura'] = $this->objectHelper->extractValueFromArrayColumn($areas, 'idestructuraop');
        }
        //$params['asentado'] = true;
        $params['prodareas'] = true;
        $producto = new LogisticaProductoModel();
        $querys = $producto->cargarProductos($params, true);
        $querys->addWhere('p.cantidad > 0');
        if ($params['precioCero']) {
            $querys->addWhere('p.precio > 0');
        }
        $querys->orderBy("p.idestructura");
        $productos = $this->doctrineHelper->addQueryLimits($querys, $params)->fetchArray();
        $productoscalculados = $this->calcularPrecioSegunMonedaContable($productos, $params);
        //fechas
        if ($params['desde'] != null && $params['hasta'] != null || $params['desde'] != null
            || $params['hasta'] != null
        ) {
            $fechaproducto = $this->filtrersRecuperarProductosTpv($productoscalculados, $params);
            $productoscalculados = $fechaproducto;
        }
        $concatenarArea = $this->concatenarAreaVenta($this->productosEntrados($productoscalculados, $params));
        $mpModel = new MaestroProductoModel();
        return array(
            'cantidad' => $querys->count(),
            'datos' => $mpModel->setLastLevel($concatenarArea)
        );
        return array('datos' => [], 'cantidad' => 0);
    }*/

    /*private function productosEntrados($productoscalculados, $params)
    {
        $cont = 0;
        $entradoarray = array();
        foreach ($productoscalculados as &$prod) {
            $cantprodvendidos = $this->cargarCantidadVendida($prod['idproducto']);
            $entradodesde = $this->mayorDocumentoProducto($prod['idproducto']);
            $prod['idestructuraop'] = $prod['idestructura'];
            $prod['cantprodvendidos'] = ($cantprodvendidos[0]['cantprodvendidos']) ?
                $cantprodvendidos[0]['cantprodvendidos'] : 0;
            if ($params['entradodesde'] == 1 && !$entradodesde[0]['nroentrada']) {
                $prod['nroentrada'] = 'Externo';
                $cont++;
                array_push($entradoarray, $prod);
            } else {
                if ($params['entradodesde'] == 2 && $entradodesde[0]['nroentrada']) {
                    $prod['nroentrada'] = ($entradodesde[0]['nroentrada']);
                    $cont++;
                    array_push($entradoarray, $prod);
                } else {
                    if (!$params['entradodesde']) {
                        $prod['nroentrada'] = ($entradodesde[0]['nroentrada']) ?
                            $entradodesde[0]['nroentrada'] : 'Externo';
                        $cont++;
                        array_push($entradoarray, $prod);
                    }
                }
            }
        }
        return $entradoarray;
    }*/

    /*private function cargarCantidadVendida($params)
    {
        return Doctrine_Query::create()->select('sum(vp.cantidad) as cantprodvendidos')
            ->from('DatVentaproducto vp')
            ->innerJoin('vp.DatVenta dv')
            ->innerJoin('dv.DatAreaventa dav')
            ->where('vp.idventas = dv.idventas and dv.idareaventa = dav.idareaventa and vp.idproducto = ?',
                array($params))->fetchArray();
    }*/
    //Devuelve el mayor documento de para ese producto
    /*private function  mayorDocumentoProducto($params)
    {
        return Doctrine_Query::create()->select('max(dt.nrodoc) as nroentrada')->from('DatDocumento dt')
            ->innerJoin('dt.DatMovimientos dm')
            ->where('dt.iddocumento = dm.iddocumento and dm.idproducto = ?', array($params))->fetchArray();
    }*/

    /*private function fechaProductoDocumento($params)
    {
        return Doctrine_Query::create()->select('dt.fechacontable as fecha')->from('DatDocumento dt')
            ->innerJoin('dt.DatMovimientos dm')
            ->where('dt.iddocumento = dm.iddocumento and dm.idproducto = ?', array($params))->fetchArray();
    }*/

    // $params['typesync'] = 1 sincronizar naturalezas
    // $params['typesync'] = 2 sincronizar importar ventas
    // $params['typesync'] = 3 confirmar y actualizar estados
    // $params['typesync'] = 4 anular estados y actualizar estados
    // $params['typesync'] = 5 sincronizar solo disponible
    // $params['typesync'] = 6 contabilizar y actualizar estados
    // $params['typesync'] = 7 actualizar estados entregado
    // $params['typesync'] = 9 sincronizar todos los productos con sus datos
    // $params['typesync'] = 10 sincronizar todos los productos a las cajas registradoras

    public function sincronizarDatos($params)
    {
        if ($params['documentos']) {
            $documentos = is_array($params['documentos']) ? implode(',', $params['documentos']) : array($params['documentos']);
            $respuesta = $this->doctrineHelper->getConnection()->execute(
                "SELECT p.*, infc.*, da.idareaventa FROM mod_logpuntoventa.dat_pedidodocumento p 
                 inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = p.idpedido
                 inner join mod_logpuntoventa.dat_areaventa da on da.idareaventa = pt.idareaventa
                 inner join mod_logpuntoventa.dat_infoconexion infc on infc.idinfoconexion = da.idinfoconexion
                 where p.iddocumento in ($documentos)"
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($respuesta)) {
                foreach ($respuesta as $r) {

                }
                $params['idareaventa'] = $respuesta[0]['idareaventa'];
                $params['idestructura'] = $respuesta[0]['idestructuracomun'];
                $params['idpedidotienda'] = $respuesta[0]['idpedido'];
            }
        }
        $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
            ->leftJoin('da.DatInfoConexion inf');
        if ($params['idareaventa']) {
            $query->where('da.idareaventa = ?', array($params['idareaventa']));
        } else {
            $query->where('da.idestructuraop = ?', array($params['idestructura']));
        }
        $infoConfig = $query->fetchArray();
        $infoConect = $infoConfig[0]['DatInfoConexion'];
        unset($infoConfig[0]['DatInfoConexion']);
        $params['idmonedaventa'] = $infoConfig[0]['idmoneda'];
        $params['tienda'] = $infoConect['nombreconexion'];
        $params = array_merge($params, $infoConfig[0]);
        $params['tipotienda'] = $infoConect['tipo'];
        if ($infoConect['tipo'] == "ps") {
            $factory = new ExternalIntegrationFactory($infoConect['tipo']);
            $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();
        } else if ($infoConect['tipo'] == "gjt") {
            $factory = new GuajiritosApiHelper();
            $factory->setApiUrl($infoConect['url']);
            $params['codigotienda'] = $infoConect['codigotienda'];
            $params['usuario'] = $infoConect['usuario_api'];
            $params['password'] = $infoConect['password_api'];
        }
        switch ($params['typesync']) {
            case 1 :
                return $this->sincronizarNaturalezas($params, $factory);
            case 2 :
                return $this->sincronizaVentas($params, $factory);
            case 3:
                return $this->actualizarDocumentos($params, $factory);
            case 4:
                return $this->actualizarDocumentos($params, $factory);
            case 5:
                return $this->sincronizarProductos($params, $factory, $infoConect['nombreconexion']);
            case 6:
                return $this->actualizarDocumentos($params, $factory);
            case 7:
                return $this->actualizarDocumentos($params, $factory);
            case 9:
                return $this->sincronizarProductos($params, $factory, $infoConect['nombreconexion']);
            case 11:
                return $this->sincronizarDepartamentos($params);
            default :
        }
    }

    public function sincronizarDepartamentos($params) {
        $referencias = $this->doctrineHelper->getConnection()->execute(
            "UPDATE mod_logpuntoventa.dat_naturalezaagrupacion ag
            SET idreferencia = a.row_number
            FROM (
                   SELECT na.idnaturalezaagrupacion, row_number() over ()
                   FROM mod_logpuntoventa.dat_naturalezaagrupacion na
                   ORDER BY na.idnaturalezaagrupacion ASC
                 ) a
            WHERE ag.idnaturalezaagrupacion = a.idnaturalezaagrupacion"
        )->fetchAll();

        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, case when c.idtiporegistradora = 1 then 'qpos' else 'apos' end as idtiporegistradora, 
                 c.modelocaja as modelo, c.ip, cr.url as urlapi, nag.idreferencia, nag.denominacion as agrupacion 
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            inner join mod_logpuntoventa.dat_areaventaagrupacion ag on ag.idareaventa = av.idareaventa
            inner join mod_logpuntoventa.dat_naturalezaagrupacion nag on nag.idnaturalezaagrupacion = ag.idagrupacion
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora is not null 
            "
        )->fetchAll(PDO::FETCH_ASSOC);
        $formatoApi = new stdClass();
        $departamentos = $this->getFormatoDptoEnvio($respuesta);
        $formatoApi = json_encode(array('datos' => $departamentos));
        //print_r($formatoApi);die;
        $this->tpvApiHelper->setApiUrl($respuesta[0]['urlapi']);
        try {
            $respuesta = $this->tpvApiHelper->exceuteCommand(TpvApiService::UPLOAD_DEP_COMMAND, $formatoApi);
            //conectarse con la api y enviar valores
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
        return true;
    }

    public function sincronizarProdCajas($params)
    {
        $params['conexistencia'] = 1;
        $params['conprecio'] = 1;
        $cajas = array();
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, case when c.idtiporegistradora = 1 then 'qpos' else 'apos' end as idtiporegistradora, 
             c.modelocaja as modelo, c.ip, cr.* 
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora is not null "
        )->fetchAll(PDO::FETCH_ASSOC);
        $formatoApi = new stdClass();
        $arrProductos = $this->cargarProductos($params);
        $servicios = $this->cargarServicios($params);
        $aux = array_merge($arrProductos['datos'], $servicios['datos']);
        $items = array();
        $prodAux = array();
        $servAux = array();
        foreach ($aux as $a) {
            $this->tpvApiHelper->setApiUrl($respuesta[0]['url']);//'http://10.12.24.38:10430'
            $description = ($a['descripcionventa']) ? $a['descripcionventa'] : substr($a['denominacion'], 0, 25);
            array_push($items, array(
                    'codigo' => $a['referencia'],
                    'id' => $a['indexauxiliar'],
                    'descripcionventa' => str_replace('"', '', $description),
                    'idnaturaleza' => $a['idcategoriapadre'],
                    'naturaleza' => $a['idcategoriapadre'],
                    'precio' => str_replace('.','',number_format(round($a['precioventa'],2),2, '','')),
                    'signo' => (isset($a['existencia']) ? ($a['existencia'] > 0 ? null : '-') : null)
                )
            );
            if (isset($a['idservicio'])) {
                array_push($servAux, $a['referencia']);
            } else {
                array_push($prodAux, $a['referencia']);
            }
        }
        $validar = $this->validarActualizarPlu($params, $prodAux, $servAux);
        if ($validar) {
            return $validar;
        }
        $cajas = $this->getFormatoProdServEnvio($respuesta, $items);
        $formatoApi = json_encode(array('datos' => $cajas));
        try {
            $respuesta = $this->tpvApiHelper->exceuteCommand(TpvApiService::UPLOAD_PLU_COMMAND, $formatoApi);
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
        return true;
    }

    public function validarActualizarPlu($params, $productos, $servicios) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, case when c.idtiporegistradora = 1 then 'qpos' else 'apos' end as modelo, c.ip,
             cr.url as urlapi
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora is not null "
        )->fetchAll(PDO::FETCH_ASSOC);

        $formatoApi = json_encode(array('datos' => $respuesta));
        $this->tpvApiHelper->setApiUrl($respuesta[0]['urlapi']);//'http://10.12.24.38:10430'

        try {
            $respuesta = $this->tpvApiHelper->exceuteCommand(TpvApiService::DOWNLOAD_PLU_TENDER_COMMAND, $formatoApi);
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
        $pedidos = array();
        if (isset($respuesta['data'])) {
            $arrayProd = (count($productos)) ? '{'.implode(',', $productos).'}' : '{}';
            $arrayServ = (count($servicios)) ? '{'.implode(',', $servicios).'}' : '{}';
            $fechaFacturacion = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
                LogisticaGlobal::SUBSISTEMA_FAC);
            $infoCajas = $respuesta['data'];

            foreach ($infoCajas as $info) {
                if (isset($info['code']) && $info['code'] == '000') {
                    $ventas = $info['info'];
                    $sqlExist = "select pt.idpedidotienda as existe from mod_logpuntoventa.dat_verificacionprecios pt
                                  where
                                  pt.idareaventa = ? and
                                  pt.identificador = ? and
                                  pt.idusuario = {$this->global->Perfil->idusuario} limit 1";
                    $count = Doctrine_Manager::connection()->fetchAll(
                        $sqlExist, array($params['idareaventa'], $info['identificador'])
                    );
                    if (!count($count)) {
                        $sql = "INSERT INTO
                          mod_logpuntoventa.dat_verificacionprecios
                        (
                          fechapedido,idestructuracomun,
                          idareaventa,idusuario,identificador,infoventa
                        )
                        VALUES (
                          '{$fechaFacturacion->fecha}',{$this->global->estructura->idestructura},
                          {$params['idareaventa']},{$this->global->Perfil->idusuario},'{$info['identificador']}',
                          $$'{$ventas}'$$
                        ) returning idpedidotienda";
                        $idpedidoAux = Doctrine_Manager::connection()->fetchAll(
                            $sql
                        );
                        $idpedido = $idpedidoAux[0]['idpedidotienda'];
                    } else {
                        $sql = "update
                          mod_logpuntoventa.dat_verificacionprecios
                          set infoventa = $$'{$ventas}'$$
                          where idpedidotienda = ?
                          ";
                        Doctrine_Manager::connection()->fetchAll(
                            $sql, array($count[0]['existe'])
                        );
                        $idpedido = $count[0]['existe'];
                    }
                    array_push($pedidos, $idpedido);
                    Doctrine_Manager::connection()->fetchAll(
                        "DELETE FROM mod_logpuntoventa.tmp_productosventasprecio where idpedidotienda = {$idpedido}"
                    );

                    Doctrine_Manager::connection()->fetchAll(
                        "SELECT * FROM mod_logpuntoventa.f_verificarproductoventa(
                                  {$idpedido}, '{$arrayProd}', '{$arrayServ}'
                                  )"
                    );
                }
            }
            if (count($pedidos)) {
                $error = $this->doctrineHelper->getConnection()->execute(
                    "select pe.idindicador from mod_logpuntoventa.tmp_productosventasprecio pe where pe.idpedidotienda in (".implode(',',$pedidos).")"
                )->fetchAll(PDO::FETCH_ASSOC);
                if (count($error)) {
                    return array('codErr'=>2, 'idpedidos' => $pedidos);
                }
            }
        }
        return false;
    }

    public function getProductosXml($params)
    {
        $sql = "select dp.idproducto, ni.denominacion, ni.numeropieza, nu.abreviaturaunidadmedida as um,
                dpv.precio, (dp.cantidad -(select coalesce(sum(cantidad),0)
                from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto) 
                - coalesce((select sum(coalesce(pp.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idproducto = dp.idproducto),0)
                - coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = dp.idproducto and pt.estado in (1,2)),0)) as cantidad from mod_logistica.dat_producto dp
                inner join mod_logpuntoventa.dat_productoareaventa dpv on dpv.idproducto = dp.idproducto
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                inner join mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida
                where dp.idestructura = {$params['idestructura']} and dpv.idareaventa = {$params['idareaventa']} and dpv.precio > 0 
                and (dp.cantidad -(select coalesce(sum(cantidad),0)
                from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto) 
                - coalesce((select sum(coalesce(pp.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idproducto = dp.idproducto),0)
                - coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = dp.idproducto and pt.estado in (1,2)),0)) > 0";
        $datos = Doctrine_Manager::connection()->fetchAll($sql);
        $total = count($datos);
        $fecha = date('d/m/Y');
        $xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>";
        $xml .= "<wsXML version=\"1.0\">";
        foreach ($datos as $index => $d) {
            $i = $index + 1;
            $description = str_replace('"', '', $d['denominacion']);
            $xml .= "<prod-exp Product-ID=\"{$d['numeropieza']}\" Prod-recno=\"{$d['numeropieza']}\" Description=\"{$description}\" synonym=\"{$d['numeropieza']}\" status-code=\"a\" unit-price=\"{$d['precio']}\" afs=\"{$d['cantidad']}\" unit-id=\"{$d['um']}\" log-action=\"c\" />";
        }
        $xml .= "<run-date date=\"{$fecha}\" />";
        $xml .= "<page-ctrl more-recs=\"no\" page-no=\"1\" rec-count=\"{$total}\" />";
        $xml .= "</wsXML>";
        return $xml;
    }

    public function getNombreFichero($params)
    {
        $sql = "select des.codigo from mod_estructuracomp.v_dametodasestructuras des 
                    where des.idestructura = {$this->global->Estructura->idestructura} limit 1";
        $entidad = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $codigo = $entidad[0];
        $sql = "select des.codigo from mod_estructuracomp.v_dametodasestructuras des 
                    where des.idestructura = {$params['idestructura']} limit 1";
        $deposito = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $codigoDep = $deposito[0];
        $fecha = str_replace('/', '', date('d/m/Y'));
        return 'productsE' . $codigo . 'AV' . $codigoDep . 'F' . $fecha . '.json';
    }

    public function getProductosJson($params)
    {
        $params['condisponible'] = 1;
        $params['typesync'] = 5;
        $sql = "select dp.idproducto, ni.idindicador, translate(nat.denominacion,'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ','aeiouAEIOUaeiouAEIOU') as categoria, 
                dpv.precio as precioventa, 
                dp.cantidad as existencia, (dp.cantidad -(select coalesce(sum(cantidad),0)
                from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) as disponible, 
                ni.numeropieza as codigoprod, upper(translate(coalesce(nih.descripcionventa,ni.denominacion),'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ','aeiouAEIOUaeiouAEIOU')) || ' (PC:' || dp.precio ||')' as descripcion,
                (substring(upper(translate(coalesce(nih.descripcionventa,ni.denominacion),'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜ','aeiouAEIOUaeiouAEIOU')),0,30)) as imprimir,
                upper(nu.abreviaturaunidadmedida) as um, coalesce(nih.codigobarra,ni.codigo) as codigobarra                  
                from mod_logistica.dat_producto dp
                inner join mod_logpuntoventa.dat_productoareaventa dpv on dpv.idproducto = dp.idproducto
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
                inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
                inner join mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida
                where dp.idestructura = {$params['idestructura']} and dpv.idareaventa = {$params['idareaventa']} and dpv.precio > 0 
                and dp.cantidad > 0";
        $datos = Doctrine_Manager::connection()->fetchAll($sql);
        $sql = "select disp.identificador from mod_integracion.dat_dispositivo disp where disp.idalmacen = {$params['idestructura']}";
        $identificador = Doctrine_Manager::connection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return array('identificador' => (count($identificador) ? $identificador[0] : 'Sin Identificador'), 'products' => $datos);
    }

    public function setModoCatalogo($params)
    {
        foreach ($params['datos'] as $tv) {
            $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
                ->leftJoin('da.DatInfoConexion inf');
            $query->where('da.idareaventa = ?', array($tv));
            $infoConfig = $query->fetchArray();
            if (count($infoConfig)) {
                $infoConect = $infoConfig[0]['DatInfoConexion'];
                unset($infoConfig[0]['DatInfoConexion']);
                if ($infoConect['tipo'] == 'ps') {
                    $params['idmonedaventa'] = $infoConfig[0]['idmoneda'];
                    $params = array_merge($params, $infoConfig[0]);

                    $factory = new ExternalIntegrationFactory($infoConect['tipo']);
                    $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();
                } else if ($infoConect['tipo'] == 'gjt'){
                    $factory = new GuajiritosApiHelper();
                    $factory->setApiUrl($infoConect['url']);
                    $params['codigotienda'] = $infoConect['codigotienda'];
                    $params['usuario'] = $infoConect['usuario_api'];
                    $params['password'] = $infoConect['password_api'];
                }
                $params['modocatalogo'] = ($infoConect['modocatalogo'] == 1) ? 0 : 1;
                $factory->setModoCatalogo($params, $infoConect['nombreconexion']);
                $obj = new DatInfoConexion();
                $obj->assignIdentifier($infoConect['idinfoconexion']);
                $obj->modocatalogo = ($infoConect['modocatalogo'] == 1) ? 0 : 1;
                $obj->save();
            }
        }
        return true;
    }

    private function sincronizaVentas($arrayDatos, $factory)
    {
        $idestructuracomun = $arrayDatos['idestructuracomun'];
        $arrayDatos['idestructuracomun'] = $arrayDatos['idestructura'];
        $arrayDatos['signo'] = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $arrayDatos['iddoc'] = $this->iddoc;
        $arrayDatos['idcomprobante'] = -1;
        $arrayDatos['nombreconexion'] = $nombreconexion;
        return $factory->addOrdenesVenta($arrayDatos);
    }

    private function sincronizarNaturalezas($params, $factory)
    {
        $arrNaturaleza = $this->devolverNaturalezasSincronizar($params);
        return $factory->migrarCategorias($arrNaturaleza, $params);
    }

    private function sincronizarProductos($params, $factory, $nombreconexion)
    {
        if ($params['typesync'] == 9) {
            unset($params['condisponible']);
            unset($params['conexistencia']);
        } else {
            $params['condisponible'] = 1;
        }
        //$params['criterio'] = "42100-05300-000ROE";
        unset($params['start']);
        unset($params['limit']);
        //$params['limit'] = 10;
        $objIddoc = $this->_logisticaDoc->devuelveIddocByIdEstructura(
            'transTiendaLog', $this->global->estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        if ($objIddoc->iddoc) {
            $arrProductos = $this->cargarProductos($params);
            if (count($arrProductos['datos']) > 0) {
                $arrProductos['nombreconexion'] = $nombreconexion;
                $arrProductos['codigotienda'] = $params['codigotienda'];
                $arrProductos['documento']['idestructuracomun'] = $params['idestructura'];
                $arrProductos['documento']['idcliente'] = $params['idcliente'];
                $arrProductos['documento']['iddoc'] = $objIddoc->iddoc;
                $arrProductos['usuario'] = $params['usuario'];
                $arrProductos['password'] = $params['password'];
                $arrProductos['idareaventa'] = $params['idareaventa'];
                return $factory->migrarProductos($arrProductos);
            } else return true;
        } else {
            throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_007');
        }
    }

    public function actualizarCantidadEnTienda($params)
    {
        $producto = new DatProductoareaventa();
        $producto->assignIdentifier($params['idproducto']);
        $producto->cantidadentienda = ($params['cantidad']) ? $params['cantidad'] : 0;
        $producto->save();
    }

    public function getTasasCambio()
    {
        $result = Doctrine_Query::create()
            ->select('n.*')
            ->from('NomTasacambio n')
            ->innerJoin('n.DatTasacambioEntidad dt')
            ->where('n.estado = 1 and dt.idestructuracomun = ?', array($this->global->Estructura->idestructura))
            ->fetchArray();
        return $result;
    }

    public function actualizarDocumentos($params, $factory)
    {
        if ($params['typesync'] == 6) {
            $objIddoc = $this->_logisticaDoc->devuelveIddocByIdEstructura(
                'transTiendaLog',
                ($params['idestructuracomun'] ? $params['idestructuracomun'] : $this->global->estructura->idestructura),
                LogisticaGlobal::SUBSISTEMA_INV
            );
            //print_r($objIddoc);
            $params['iddoc'] = $objIddoc->iddoc;
        }
        foreach ($params['documentos'] as $iddocumento) {
            $ventaOrden = Doctrine::getTable('DatVentaorden')->findByDql("idventas = {$iddocumento}");
            $envio = $ventaOrden[0]->envio;
            if ($params['typesync'] == 3) {
                /*
                * EL DOCUMENTO SE CONFIRMAR Y PASA A ESTAR EN PENDIENTE DE ENVIO(9)
                * PARA EL CASO DE LA ENTREGA A DOMICILIO
                * O A PENDIENTE DE RECOGIDA(13) PARA LA RECOGIDA EN TIENDA
                */
                $this->confirmarDocumento($iddocumento);
                $statusGjt = 'on-delivery';
                $idestado = ($envio > 0) ? 9 : 13;
                $ventaOrden[0]->exportado = -1;
            } elseif ($params['typesync'] == 4) {
                /*
                * EL DOCUMENTO PASA A PREPARACION EN PROCESO(3) PARA
                * CUANDO SE ANULE EL ESTADO Y PASA A ELABORACION
                */
                $this->anularEstadoDocumento($iddocumento);

                $statusGjt = 'processing-order';
                $idestado = 3;

            } elseif ($params['typesync'] == 6) {
                /*
                * EL DOCUMENTO SE CONTABILIZA Y PASA A ESTAR EN ENVIADO(4)
                * PARA EL CASO DE LA ENTREGA A DOMICILIO
                * O A ENTREGADO(5) PARA LA RECOGIDA EN TIENDA
                */
                $collMov = new Doctrine_Collection('DatMovimientos');
                $doc = Doctrine_Query::create()->select('m.idmovimiento as idmovimiento')
                    ->from('DatMovimientos m')->innerJoin('m.DatProductoLogistica p')->innerJoin('m.DatDocumento d')
                    ->where('m.iddocumento = ?', $iddocumento)
                    ->fetchArray();
                foreach ($doc as $mov) {
                    $mov = $this->producto->getMovimientoModel()->updatePrecioMovimientoSalida($mov['idmovimiento']);
                    if ($mov['record']) {
                        $collMov->add($mov['record']);
                    }
                }
                if (count($collMov)) {
                    $collMov->save();
                }
                $cronologia = $this->contabilizarDocumento($iddocumento);
                $this->producto->aprobarMovimientos($iddocumento, $cronologia, false);

                $statusGjt = 'delivered';
                $idestado = ($envio > 0) ? 4 : 5;

                $documento = Doctrine::getTable('DatDocumento')->find($iddocumento);
                $deposito = $this->estructuraHelper->obtenerEstructurasNoFormales(
                    false, $this->global->estructura->idestructura, array(), false, false, array($documento->idestructuracomun), -1
                );
                $estructuraOp = $deposito[0]['DatEstructuraop'];
                $depositoCodigo = $estructuraOp[0]['codigo'];
                $nroFactura = $documento->nrodoc . '.' . $depositoCodigo . '.' . $documento->anno;
                $ventas = Doctrine::getTable('DatVenta')->find($iddocumento);
                $ventas->nrofactura = $nroFactura;
                $ventas->save();
                $ventaOrden[0]->exportado = 0;
                if ($this->getOperacionComprobante($documento->idoperacion) == 1) {
                    $comp = $this->generarComprobante($iddocumento, LogisticaGlobal::SUBSISTEMA_FAC);
                    $resultado['comprobante'] = $comp[0];
                }
            } else {
                /*
                * EL DOCUMENTO PASA A ENTREGADO(5) PARA
                * CUANDO SE ENTREGA EN EL DOMICILIO Y SE ACTUALICE EL ESTADO
                */

                $statusGjt = 'delivered';
                $idestado = 5;
            }
            $respCambioEstado = true;
            if ($ventaOrden[0]->idreferencia) {
                if ($params['tipotienda'] == 'gjt') {
                    $respCambioEstado = $factory->cambiarEstado($params, array($ventaOrden[0]->idreferencia), $statusGjt);
                } else {
                    $factory->cambiarEstado($ventaOrden[0]->idreferencia, $idestado);
                }
            }
            $ventaOrden[0]->estadoorden = $idestado;
            $ventaOrden->save();
            if (isset($params['idpedidotienda']) && $respCambioEstado) {
                if ($params['typesync'] == 6) {
                    $params['iddoc'] = $documento->iddoc;
                    $params['documentos'] = "'{" . implode($params['documentos'], ',') . "}'";
                    self::actualizarCantidadComprometida($params);
                }
                $respuesta = Doctrine_Manager::connection()->fetchAll(
                    "update mod_logpuntoventa.dat_pedidotienda 
                             set estado = {$idestado} where idpedidotienda = {$params['idpedidotienda']}"
                );
            } else {
                if ($params['typesync'] == 6) {
                    $params['documentos'] = "'{" . implode($params['documentos'], ',') . "}'";
                    self::actualizarCantidadComprometida($params);
                }
            }

        }
        return array(
            'success' => true,
            'comprobante' => (isset($resultado) ? $resultado['comprobante'] : false)
        );
    }

    private function actualizarCantidadComprometida($parametros)
    {
        return Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logpuntoventa.f_actualizarcantidadcomprometida ({$parametros['iddoc']}, "
            . "{$parametros['documentos']} ) q");
    }

    public function getOperacionComprobante($idoperacion)
    {
        $aux = Doctrine::getTable('DatOperacionsubsistema')->findBySql(
            'idnomoperaciones = ? and idestructura = ?', array($idoperacion, $this->global->estructura->idestructura)
        );
        return $aux[0]['comprobante'];
    }

    public function enviarCajerosCaja($params)
    {
        $cajas = array();
        foreach ($params['datos'] as $area) {
            $respuesta = $this->doctrineHelper->getConnection()->execute(
                "select c.identificador, case when c.idtiporegistradora = 1 then 'qpos' else 'apos' end as idtiporegistradora, 
                 c.modelocaja as modelo, c.ip, p.nombre, cu.pin, cu.tipo, cr.url as urlapi--, cr.* 
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            inner join mod_logpuntoventa.dat_cajausuario cu on cu.idcaja = c.idcaja
            inner join mod_seguridad.seg_usuario us on us.idusuario = cu.idusuario
            inner join mod_persona.dat_persona p on p.idpersona = us.idpersona
            where c.idareaventa = {$area} and c.activo = 1 and c.idtiporegistradora is not null 
            and cu.pin is not null and cu.tipo is not null"
            )->fetchAll(PDO::FETCH_ASSOC);
            $formatoApi = new stdClass();
            $cajas = $this->getFormatoCajeroEnvio($respuesta);
        }
        $formatoApi = json_encode(array('datos' => $cajas));
        $this->tpvApiHelper->setApiUrl($respuesta[0]['urlapi']);
        try {
            $respuesta = $this->tpvApiHelper->exceuteCommand(TpvApiService::UPLOAD_CLERK_COMMAND, $formatoApi);
        //print_r($respuesta);die;
        //conectarse con la api y enviar valores
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
        return true;
    }

    public function getFormatoCajeroEnvio($datos)
    {
        $cajas = array();
        foreach ($datos as $d) {
            $pos = $this->inArray($cajas, $d['identificador'], 'identificador');
            if ($pos == -1) {
                $c = array('modelo' => $d['idtiporegistradora'], 'ip' => $d['ip'], 'identificador' => $d['identificador']);
                $c['cajeros'] = array();
                array_push($c['cajeros'], array('cajero' => $d['nombre'], 'pin' => LogisticaGlobal::__init()->rellenarCadena($d['pin'], 8, '0', 2), 'tipo' => $d['tipo']));
                array_push($cajas, $c);
            } else {
                array_push($cajas[$pos]['cajeros'], array('cajero' => $d['nombre'], 'pin' => LogisticaGlobal::__init()->rellenarCadena($d['pin'], 8, '0', 2), 'tipo' => $d['tipo']));
            }
        }
        return $cajas;
    }

    public function getFormatoDptoEnvio($datos)
    {
        $cajas = array();
        foreach ($datos as $d) {
            $pos = $this->inArray($cajas, $d['identificador'], 'identificador');
            if ($pos == -1) {
                $c = array('modelo' => $d['idtiporegistradora'], 'ip' => $d['ip'], 'identificador' => $d['identificador']);
                $c['departamentos'] = array();
                array_push($c['departamentos'], array('descripcion' => $d['agrupacion'], 'id' => $d['idreferencia']));
                array_push($cajas, $c);
            } else {
                array_push($cajas[$pos]['departamentos'], array('descripcion' => $d['agrupacion'], 'id' => $d['idreferencia']));
            }
        }
        return $cajas;
    }

    public function getFormatoProdServEnvio($datos, $items)
    {
        $cajas = array();
        foreach ($datos as $d) {
            $pos = $this->inArray($cajas, $d['identificador'], 'identificador');
            if ($pos == -1) {
                $c = array('modelo' => $d['idtiporegistradora'], 'ip' => $d['ip'], 'identificador' => $d['identificador']);
                $c['productos'] = $items;
                array_push($cajas, $c);
            } else {
                $cajas[$pos]['productos'] = $items;
            }
        }
        return $cajas;
    }

    private function inArray($array, $value, $index)
    {
        foreach ($array as $i => $a) {
            if ($a[$index] == $value) {
                return $i;
            }
        }
        return -1;
    }
}
