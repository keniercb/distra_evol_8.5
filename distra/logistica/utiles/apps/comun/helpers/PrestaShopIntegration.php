<?php
class PrestaShopIntegration extends ExternalStoreIntegrationModel
{
    private $storeURl, $storeKey, $debugTime, $docLogModel, $comunVenta;
    /***
     * @var PrestaShopWebservice
     */
    private $psWebService;
    /**
     * PrestaShopIntegration constructor.
     */
    public function __construct()
    {
        $this->docLogModel = new DocumentoLogisticaModel();
        $this->comunVenta = new ComunpuntoventaModel();
    }

    /**
     * @return mixed
     */
    public function getStoreURl()
    {
        return $this->storeURl;
    }

    /**
     * @return mixed
     */
    public function getStoreKey()
    {
        return $this->storeKey;
    }

    public function setStoreConfig($arrayConfig)
    {
        $this->storeURl = $arrayConfig['URL'];
        $this->storeKey = $arrayConfig['KEY'];
        $this->debugTime = $arrayConfig['DEBUG'];
    }


    /**
     * @return mixed
     */
    public function getDebugTime()
    {
        return $this->debugTime;
    }

    public function connect()
    {
        $this->psWebService = new PrestaShopWebservice($this->getStoreURl(), $this->getStoreKey(), $this->getDebugTime());
    }

    private function obtenerIdProducto($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "select p.idproducto from mod_logistica.dat_producto p 
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                where p.idestructura = {$params['idestructura']} and i.numeropieza = '{$params['referencia']}'";

        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $datos[0];
    }

    private function obtenerIdPadre($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "select dat.idreferencia from mod_logpuntoventa.dat_naturalezaagrupacion dat 
                where dat.idnaturalezaagrupacion = {$params['idpadre']}";

        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $datos[0];
    }

    private function obtenerProducto($params)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "select p.idproducto, p.idindicador, p.idumedida, 
                (p.cantidad 
                - coalesce((select sum(coalesce(pp.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idproducto = p.idproducto),0)
                - coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = p.idproducto and pt.estado = 2),0)) as existenciareal
                from mod_logistica.dat_producto p 
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                where p.idestructura = {$params['idestructura']} and i.numeropieza = '{$params['referencia']}' 
                and p.idproducto not in (select pi.idproducto from mod_logistica.dat_productoinactivo pi)
                group by p.idproducto
                /*having (p.cantidad 
                - coalesce((select sum(coalesce(pp.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idproducto = p.idproducto),0)
                - coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = p.idproducto and pt.estado = 2),0)) > 0*/";

        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function addOrdenesVenta($arrayDatos)
    {
        $name = $arrayDatos['nombreconexion'];
        $opt = array('resource' => 'orders');
        $opt['display'] = 'full';
        $opt['filter[current_state]'] = 2;
        $opt['filter[id_shop]'] = $name;
        $xml = $this->psWebService->get($opt);

        $datosOrden = $xml->children()->children();
        foreach ($datosOrden as $order) {
            //$order = $datosOrden[6];//borrar
            $order = (array) $order;

            $datosCliente = $this->buscarCliente($order['id_customer']);
            $datosCliente = (array) $datosCliente;
            $direccion = $this->buscarDireccion($order['id_address_invoice']);
            $direccion = (array) $direccion;
            $arrayDatos['numeroidentidad'] = $direccion['dni'];
            $arrayDatos['nombre'] = $direccion['firstname'] . ' ' . $direccion['lastname'];
            $telef = implode(array($direccion['phone'], $direccion['phone_mobile']), ',');
            $arrayDatos['telefono'] = $telef;
            $arrayDatos['direccion'] = $direccion['address1'];
            $arrayDatos['provincia'] = $direccion['city'];
            $municipio = $this->buscarMunicipios($direccion['id_state']);
            $municipio = (array) $municipio->name;
            $arrayDatos['municipio'] = $municipio['language'][0];
            $arrayDatos['correo'] = $datosCliente['email'];
            $arrayDatos['idexterno'] = $direccion['id_customer'];
            if ($order['id_address_invoice'] != $order['id_address_delivery']) {
                $direccion = $this->buscarDireccion($order['id_address_delivery']);
                $direccion = (array) $direccion;
                $arrayDatos['entrega']['numeroidentidad'] = $direccion['dni'];
                $arrayDatos['entrega']['nombre'] = $direccion['firstname'] . ' ' . $direccion['lastname'];
                $telef = implode(array($direccion['phone'], $direccion['phone_mobile']), ',');
                $arrayDatos['entrega']['telefono'] = $telef;
                $arrayDatos['entrega']['direccion'] = $direccion['address1'];
                $arrayDatos['entrega']['provincia'] = $direccion['city'];
                $municipio = $this->buscarMunicipios($direccion['id_state']);
                $municipio = (array) $municipio->name;
                $arrayDatos['entrega']['municipio'] = $municipio['language'][0];
                $arrayDatos['entrega']['correo'] = $datosCliente['email'];
                $arrayDatos['entrega']['idexterno'] = $direccion['id_customer'];
                $arrayDatos['entrega']['tipo'] = 1;
            }

            $movimientos['movimientos'] = array();

            $documento = $this->docLogModel->adicionarDocumento($arrayDatos);
            $documento->save();
            $this->docLogModel->adicionarClientes(
                $documento->iddocumento,
                array(array('idcliente' => $arrayDatos['idcliente'], 'tipocliente' => 1)),
                false
            );

            foreach ($order['associations']->order_rows->order_row as $pos => $producto) {
                $producto = (array) $producto;
                $producto['product_id'] = $this->obtenerIdProducto(array('idestructura' => $arrayDatos['idestructuracomun'], 'referencia' => $producto['product_reference']));
                $mov[0]['idproducto'] = $producto['product_id'];
                $mov[0]['cantidad'] = $producto['product_quantity'];
                $mov[0]['precio'] = $producto['product_price'];
                $mov[0]['importetotal'] = round($producto['product_price'] * $producto['product_quantity'], 2);
                $mov[0]['idmoneda'] = $arrayDatos['idmonedaventa'];
                $addMov = $this->docLogModel->getProductoModel()->adicionarMovimientos($documento->iddocumento, $mov, $arrayDatos['signo'], false);
                $movimientos['movimientos'][] = $addMov['movimientos'][0];
                $arrayDatos['productos'][$producto['product_id']] = $mov[0];
            }

            //$this->docLogModel->confirmarDocumento($documento->iddocumento);
            // From there you could, for example, use th resource ID to call the webservice to get its details
            $arrayDatos['noreturn'] = 1;
            $arrayDatos['idventas'] = $documento->iddocumento;
            $arrayDatos['nroventa'] = $documento->nrodoc;
            $arrayDatos['fechaventa'] = $documento->fechacontable;
            $arrayDatos['importe'] = $order['total_paid'];
            $arrayDatos['idpago'] = -3;
            $arrayDatos['vendedor'] = 'Tienda virtual';
            $arrayDatos['movimientos'] = $movimientos['movimientos'];

            $arrayDatos['datosorden']['idorden'] = $order['id'];
            $arrayDatos['datosorden']['nroorden'] = $order['reference'];
            //$arrayDatos['datosorden']['idcliente'] = $order['id_customer'];
            $arrayDatos['datosorden']['pago'] = $order['payment'];
            $arrayDatos['datosorden']['envio'] = $order['total_shipping'];
            $arrayDatos['datosorden']['estadoorden'] = 3; //$order['current_state'];
            $arrayDatos['datosorden']['fechaorden'] = $order['date_add'];
            $puntoventa = new TerminalpuntoventaModel();
            //$vendedor = $this->global->Perfil;
            $puntoventa->adicionarVenta($arrayDatos);
            $this->cambiarEstado($order['id'], 3);
        }
        return true;
    }

    public function addPedidosTienda($arrayDatos)
    {

        $name = $arrayDatos['nombreconexion'];
        $optId = array('resource' => 'shops');
        $optId['display'] = 'full';
        $optId['filter[name]'] = $name;
        $xmlId = $this->psWebService->get($optId);
        $resourcesId = $xmlId->children()->children();
        $idshop = $resourcesId->shop->id;
        $idshop = (array) $idshop;
        $opt = array('resource' => 'orders');
        $opt['display'] = 'full';
        $opt['filter[current_state]'] = 2;
        $opt['filter[id_shop]'] = $idshop[0];
        $xml = $this->psWebService->get($opt);

        $datosOrden = $xml->children()->children();
        $arrayOrderInsert = array();
        $flag = true;
        $sqlDelete = "delete from mod_logpuntoventa.dat_pedidotienda where estado = 2 and idareaventa = {$arrayDatos['idareaventa']}";
        Doctrine_Manager::connection()->fetchAll(
            $sqlDelete
        );
        try {
        foreach ($datosOrden as $order) {
            $flag = true;
            $order = (array) $order;
            $datosCliente = $this->buscarCliente($order['id_customer'], $idshop[0]);
            $datosCliente = (array) $datosCliente;
            $direccion = $this->buscarDireccion($order['id_address_invoice']);
            $direccion = (array) $direccion;
            $arrayDatos['numeroidentidad'] = $direccion['dni'];
            $arrayDatos['nombre'] = str_replace('\'', '\'||chr(39)||\'', $direccion['firstname']) . ' ' . str_replace('\'', '\'||chr(39)||\'', $direccion['lastname']);
            $telef = implode(',',array($direccion['phone'], $direccion['phone_mobile']));
            $arrayDatos['telefono'] = $telef;
            $arrayDatos['direccion'] = $direccion['address1'];
            $arrayDatos['provincia'] = $direccion['city'];
            $municipio = $this->buscarMunicipios($direccion['id_state']);
            $municipio = (array) $municipio;
            $arrayDatos['municipio'] = $municipio['name'];
            $arrayDatos['iso_municipio'] = $municipio['iso_code'];
            $arrayDatos['id_state'] = $direccion['id_state'];
            $arrayDatos['correo'] = $datosCliente['email'];
            $arrayDatos['idexterno'] = $direccion['id_customer'];
            $arrayDatos['metodopago'] = isset($order['payment']) ? $order['payment'] : null;
            $arrayDatos['idtransaccion'] = isset($order['id_transaction']) ? $order['id_transaction'] : null;
            if ($order['id_address_invoice'] != $order['id_address_delivery']) {
                $direccion = $this->buscarDireccion($order['id_address_delivery']);
                $direccion = (array) $direccion;
                $arrayDatos['entrega']['numeroidentidad'] = $direccion['dni'];
                $arrayDatos['entrega']['nombre'] = str_replace('\'', '\'||chr(39)||\'', $direccion['firstname']) . ' ' . str_replace('\'', '\'||chr(39)||\'', $direccion['lastname']);
                $telef = implode(',', array($direccion['phone'], $direccion['phone_mobile']));
                $arrayDatos['entrega']['telefono'] = $telef;
                $arrayDatos['entrega']['direccion'] = $direccion['address1'];
                $arrayDatos['entrega']['provincia'] = $direccion['city'];
                $municipio = $this->buscarMunicipios($direccion['id_state']);
                $municipio = (array) $municipio->name;
                $arrayDatos['entrega']['municipio'] = $municipio['language'][0];
                $arrayDatos['entrega']['correo'] = $datosCliente['email'];
                $arrayDatos['entrega']['idexterno'] = $direccion['id_customer'];
                $arrayDatos['entrega']['tipo'] = 1;
            }
            $direccion['address1'] = str_replace('\'', '\'||chr(39)||\'', $direccion['address1']);
            $direccion['address2'] = str_replace('\'', '\'||chr(39)||\'', $direccion['address2']);
            $direccion['address2'] = (strlen($direccion['address2']) > 1) ? $direccion['address2'] : $direccion['address1'];
            $idopcomercio = $this->getIdOpComercio($order['reference']);
            $arrayDatos['comisionbanco'] = ($arrayDatos['comisionbanco']) ? $arrayDatos['comisionbanco'] : 0;
            $sql = "INSERT INTO 
                      mod_logpuntoventa.dat_pedidotienda
                    (
                      nropedido,beneficiario,dirbeneficiario,remitente,dirremitente,fechapedido,estado,idestructuracomun,
                      codigoregion,idareaventa,cibeneficiario,ciremitente,telbeneficiario,telremitente,idusuario,idreferencia,
                      metodopago,idtransaccion,idopcomercio,iso_municipio,municipio,id_state,comision
                    )
                    VALUES (
                      '{$order['reference']}','{$arrayDatos['nombre']}','{$direccion['address2']}','{$arrayDatos['nombre']}',
                      '{$direccion['address1']}','{$order['date_add']}',2,{$arrayDatos['idestructuracomun']},1,
                      {$arrayDatos['idareaventa']},'{$arrayDatos['numeroidentidad']}','{$arrayDatos['numeroidentidad']}','{$telef}','{$telef}',
                      {$arrayDatos['idusuario']},{$order['id']},'{$arrayDatos['metodopago']}','{$arrayDatos['idtransaccion']}','{$idopcomercio}',
                      '{$arrayDatos['iso_municipio']}','{$arrayDatos['municipio']}',{$arrayDatos['id_state']},{$arrayDatos['comisionbanco']}
                    ) returning idpedidotienda";
            $idpedido = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            $idCart = ($arrayDatos['recordable']) ? $order['id_cart'] : false;
            foreach ($order['associations']->order_rows->order_row as $pos => $producto) {
                $producto = (array) $producto;
                $recardableElements = '-1';
                if (is_numeric($idCart)) {
                    $recardableElements = $this->getRecordableElementsByProduct($idCart, $producto['product_id']);
                    $recardableElements = json_encode($recardableElements);
                }
                $datProdAux = $this->obtenerProducto(
                    array(
                        'idestructura' => $arrayDatos['idestructuraop'],
                        'referencia' => $producto['product_reference']
                    )
                );
                $cantidaPedida = $cantidadReal = $producto['product_quantity'];
                foreach ($datProdAux as $datProd) {
                    $cant = ($cantidaPedida <= $datProd['existenciareal']) ? $cantidaPedida : $datProd['existenciareal'];
                    if ($cant < 0) {
                        $cant = 0;
                    }
                    $cantidaPedida -= $cant;
                    $producto['product_id'] = $datProd['idproducto'];
                    $producto['product_idind'] = $datProd['idindicador'];
                    $sqlProd = "INSERT INTO 
                      mod_logpuntoventa.dat_pedidoproducto
                    (
                      idpedidotienda,
                      codreferencia,
                      idindicador,
                      idproducto,
                      cantidad,
                      cantidadreal,
                      precio,
                      importe,
                      idumedida,
                      enproceso,
                      procesado,
                      preciounitario,
                      recordable
                    )
                    VALUES (
                      {$idpedido[0]['idpedidotienda']},
                      '{$producto['product_reference']}',
                      {$datProd['idindicador']},
                      {$datProd['idproducto']},
                      {$cant},
                      {$cantidadReal},
                      round({$producto['unit_price_tax_incl']},2),
                      round({$producto['unit_price_tax_incl']}*{$cant},2),
                      {$datProd['idumedida']},
                      0,
                      0,
                      {$producto['product_price']},
                      '{$recardableElements}'
                    )";
                    Doctrine_Manager::connection()->fetchAll(
                        $sqlProd
                    );
                }
                if ($cantidaPedida != 0) {
                    $flag = false;
                }
            }
            if ($flag) {
                array_push($arrayOrderInsert, $order['id']);
            }
        }
        }catch(Exception $e) {
          print_r($e->getMessage());die;
        }
        /*foreach ($arrayOrderInsert as $order) {
            $this->cambiarEstado($order,3);
        }*/
        return true;
    }

    public function descargarProdMantenimiento($arrayDatos)
    {
        $name = $arrayDatos['nombreconexion'];
        $optId = array('resource' => 'shops');
        $optId['display'] = 'full';
        $optId['filter[name]'] = $name;
        $xmlId = $this->psWebService->get($optId);
        $resourcesId = $xmlId->children()->children();
        $idshop = $resourcesId->shop->id;
        $idshop = (array) $idshop;
        $opt = array('resource' => 'products');
        $opt['display'] = 'full';
        $opt['filter[id_shop_default]'] = $idshop[0];
        $xml = $this->psWebService->get($opt);

        $datosProductos = $xml->children()->children();
        $flag = true;
        $sqlDelete = "delete from mod_logpuntoventa.temp_mantenimiento where idareaventa = {$arrayDatos['idareaventa']}";
        Doctrine_Manager::connection()->fetchAll(
            $sqlDelete
        );
        try {
            foreach ($datosProductos as $p) {
                $flag = true;
                $p = (array)$p;
                $opt1 = array('resource' => 'stock_availables');
                $opt1['display'] = 'full';
                $idStock = (array) $p['associations']->stock_availables->stock_available->id;
                $opt1['filter[id]'] = $idStock[0];
                $xml1 = $this->psWebService->get($opt1);
                $resources = $xml1->children()->children();
                $cantidad = $resources->stock_available->quantity;

                $sql = "INSERT INTO 
                      mod_logpuntoventa.temp_mantenimiento
                    (
                      numeropieza,cantidad,idareaventa
                    )
                    VALUES (
                      '{$p['reference']}','$cantidad',{$arrayDatos['idareaventa']}
                    )";
                Doctrine_Manager::connection()->fetchAll(
                    $sql
                );
            }
        }catch(Exception $e) {
            print_r($e->getMessage());die;
        }
        /*foreach ($arrayOrderInsert as $order) {
            $this->cambiarEstado($order,3);
        }*/
        return true;
    }

    public function ajustarProdMantenimiento($arrayDatos) {
        $name = $arrayDatos['nombreconexion'];
        $optId = array('resource' => 'shops');
        $optId['display'] = 'full';
        $optId['filter[name]'] = $name;
        $xmlId = $this->psWebService->get($optId);
        $resourcesId = $xmlId->children()->children();
        $idshop = $resourcesId->shop->id;
        $idshop = (array) $idshop;
        if (count($arrayDatos['references'])) {
            $ajustados = array();
            foreach ($arrayDatos['references'] as $p) {
                $p = (array) $p;
                try {
                    $opt = array('resource' => 'products');
                    $opt['display'] = 'full';
                    $opt['filter[id_shop_default]'] = $idshop[0];
                    $opt['filter[reference]'] = $p['numeropieza'];
                    $xml = $this->psWebService->get($opt);
                    $resources = $xml->children()->children();

                    $opt = array('resource' => 'products');
                    $opt['id'] = (int)$resources->product->id;

                    $xml = $this->psWebService->get($opt);
                    $resources = $xml->children()->children();
                    unset($resources->manufacturer_name);
                    unset($resources->quantity);
                    unset($resources->max_quantity_whit_combination);

                    $opt['putXml'] = $xml->asXML();

                    $xml = $this->psWebService->edit($opt);
                    $p['disponible'] = $p['diftienda'];

                    $this->set_product_quantity($xml->product, $p, $idshop, true);
                    array_push($ajustados, array($p['numeropieza'], $p['diftienda']));
                } catch (Exception $e) {
                    print_r($xml);die;
                }
            }

            foreach ($ajustados as $index => $value) {
                $sqlIdreferencia = "update mod_logpuntoventa.temp_mantenimiento
                            set ajustado = 1, cantidad = CAST(cantidad as numeric) + {$value[1]} where numeropieza = '{$value[0]}' 
                            and idareaventa = {$arrayDatos['idareaventa']}";

                Doctrine_Manager::connection()->fetchAll($sqlIdreferencia);
            }
        }
        return true;
    }
    /**
     * @param $idorden
     * @param int $idestado Cancelado por defecto
     **/
    public function cambiarEstado($idorden, $idestado)
    {
        $opt = array('resource' => 'order_histories?schema=blank');
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        $resources->id_order = $idorden;
        $resources->id_order_state = $idestado;
        $opt = ['resource' => 'order_histories', 'postXml' => $xml->asXML()];
        return $this->psWebService->add($opt);
    }

    public function devolverPedido($idorden, $productos)
    {
        $opt = array('resource' => "orders?display=full&filter[id]={$idorden}");
        $xml = $this->psWebService->get($opt);
        $order = $xml->children()->children();
        $opt = array('resource' => "order_details?display=full&filter[id_order]={$idorden}");
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        $importeDev = 0;
        $productId = array();
        foreach ($resources as $p) {
            $idshop = $p->id_shop;
            $aux = (array)$p;
            if ($productos[$aux['product_reference']]) {
                $productId[$aux['id']] = array(
                    'precio' => $productos[$aux['product_reference']]['precio'],
                    'cantidad' => $productos[$aux['product_reference']]['devolver']
                );
                $cantidaddev = $p->product_quantity_refunded + $productos[$aux['product_reference']]['devolver'];
                if ($p->product_quantity >= $cantidaddev) {
                    $importeDev += round($productos[$aux['product_reference']]['precio'] * $productos[$aux['product_reference']]['devolver'], 2);
                    $this->updateRefunded($p->id, $productos[$aux['product_reference']], $idshop);
                }
            }
        }
        //order slip
        $xml1 = $this->psWebService->get(array('url' => $this->storeURl . "/api/order_slip?schema=blank"));
        $resources1 = $xml1->children()->children();
        $resources1->conversion_rate = 1.000000;
        $resources1->partial = 0;
        $resources1->order_slip_type = 1;
        $resources1->id_order = $idorden;
        unset($resources1->id);

        $resources1->id_customer = $order[0]->id_customer;
        $resources1->total_products_tax_excl = $importeDev;
        $resources1->total_products_tax_incl = $importeDev;
        $resources1->total_shipping_tax_excl = 0;
        $resources1->total_shipping_tax_incl = 0;
        $resources1->amount = $importeDev;
        $resources1->shipping_cost = 0;
        $resources1->shipping_cost_amount = 0;
        unset($resources1->associations->order_slip_details);
        $resources1->associations->addChild('order_slip_details');
        foreach ($productId as $index => $p) {
            $importeProd = round($p['cantidad'] * $p['precio'], 2);
            $detail = $resources1->associations->order_slip_details->addChild('order_slip_detail');
            $detail->addChild('id_order_detail', $index);
            $detail->addChild('product_quantity', $p['cantidad']);
            $detail->addChild('amount_tax_excl', $importeProd);
            $detail->addChild('amount_tax_incl', $importeProd);

            $detail->addChild('unit_price_tax_excl', $p['precio']);
            $detail->addChild('unit_price_tax_incl', $p['precio']);
            $detail->addChild('total_price_tax_excl', $importeProd);
            $detail->addChild('total_price_tax_incl', $importeProd);
        }

        $opt1 = array('resource' => 'order_slip');
        $opt1['postXml'] = $xml1->asXML();
        $xml1 = $this->psWebService->add($opt1);
        $id_orderslip = (int)$xml1->order_slip->id;
        $this->cambiarEstado($idorden, 7);
        return $id_orderslip;
    }

    public function updateRefunded($id, $producto, $idshop)
    {
        $opt = array('resource' => 'order_details');
        $opt['id'] = $id;
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        $resources->product_quantity_refunded = $resources->product_quantity_refunded + $producto['devolver'];
        $opt['putXml'] = $xml->asXML();
        $xml = $this->psWebService->edit($opt);
        return $xml;
    }

    public function updateSlipDetail($id, $id_orderslip, $producto, $importe, $pos)
    {
        $opt = array('resource' => 'order_slip');
        $opt['id'] = $id_orderslip;
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        /*$resources->associations->order_slip_details->order_slip_detail[$pos]->id_order_detail = $id;
        $resources->associations->order_slip_details->order_slip_detail[$pos]->product_quantity = $producto['cantidad'];
        $resources->associations->order_slip_details->order_slip_detail[$pos]->amount_tax_excl = $importe;
        $resources->associations->order_slip_details->order_slip_detail[$pos]->amount_tax_incl = $importe;

        $resources->associations->order_slip_details->order_slip_detail[$pos]->unit_price_tax_excl = $producto['precio'];
        $resources->associations->order_slip_details->order_slip_detail[$pos]->unit_price_tax_incl = $producto['precio'];
        $resources->associations->order_slip_details->order_slip_detail[$pos]->total_price_tax_excl = $importe;
        $resources->associations->order_slip_details->order_slip_detail[$pos]->total_price_tax_incl = $importe;*/
        //print_r($resources);die;


        $opt['postXml'] = $xml->asXML();
        //print_r($opt['postXml']);die;
        $xml = $this->psWebService->add($opt);
        return $xml;
    }

    public function devolverPedidoImporte($idorden, $importe)
    {
    }

    public function buscarDireccion($id_adress)
    {
        $opt = array('resource' => 'addresses');
        $opt['display'] = 'full';
        $opt['filter[id]'] = $id_adress;
        $xml = $this->psWebService->get($opt);
        return $xml->addresses->address;
    }

    public function buscarMunicipios($id_state)
    {
        /*try
        {*/
        $opt = array('resource' => 'states');
        $opt['display'] = 'full';
        $opt['filter[id]'] = $id_state;
        $xml = $this->psWebService->get($opt);

        /*}    
        catch (PrestaShopWebserviceException $e)
        {
            $trace = $e->getTrace();
            if ($trace[0]['args'][0] == 404) echo 'Bad ID';
            else if ($trace[0]['args'][0] == 401) echo 'Bad auth key';
            else echo 'Other error<br />'.$e->getMessage();
        }*/

        return $xml->states->state;
    }

    public function buscarCliente($id_customer, $idshop = false)
    {
        /*try
        {*/
        $opt = array('resource' => 'customers');
        $opt['display'] = 'full';
        $opt['filter[id]'] = $id_customer;
        if ($idshop) {
          $opt['filter[id_shop]'] = $idshop;
        }
        $xml = $this->psWebService->get($opt);

        /*}
    
        catch (PrestaShopWebserviceException $e)
        {
            $trace = $e->getTrace();
            if ($trace[0]['args'][0] == 404) echo 'Bad ID';
            else if ($trace[0]['args'][0] == 401) echo 'Bad auth key';
            else echo 'Other error<br />'.$e->getMessage();
        }*/

        return $xml->customers->customer;
    }

    public function migrarCategorias($arrayCategory, $params)
    {
        $cachePadres = array();
        $opt = array('resource' => 'shops');
        $opt['display'] = 'full';
        $opt['filter[name]'] = $params['tienda'];
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        $idshop = $resources->shop->id;
        foreach ($arrayCategory as $item) {
            $existe = false;
            if ($item['idreferencia']) {
                $existe = $this->buscarCategoria($item['idreferencia'], false, $idshop);
            } else {
                $existe = $this->buscarCategoria($item['id'], 1, $idshop);
            }
            if ($existe) {
                $this->actualizarCategoria($existe, $item, $idshop, $cachePadres);
                $cachePadres[$item['id']] = array('idpadre' => (int) $existe, 'agrupacion' => ($item['idpadre']) ? 0 : 1);
            } else {
                try {
                    if (strlen($item['denominacion']) > 1) {
                        $xml = $this->psWebService->get(array('url' => $this->storeURl . '/api/categories?schema=blank'));
                        $resources = $xml->children()->children();
                        unset($resources->id);
                        unset($resources->id_shop_default);
                        unset($resources->position);
                        unset($resources->date_add);
                        unset($resources->date_upd);


                        unset($resources->level_depth);
                        unset($resources->nb_products_recursive);
                        unset($resources->is_root_category);
                        unset($resources->description);
                        unset($resources->meta_title);
                        unset($resources->meta_description);
                        unset($resources->meta_keywords);
                        unset($resources->associations);
                        unset($resources->active);

                        $resources->active = 1;
                        if ($item['idpadre']) {
                            $resources->id_parent = ($item['idreferenciapadre'])
                                ? $item['idreferenciapadre']
                                : $cachePadres[$item['idpadre']]['idpadre']; //$this->obtenerIdPadre($item);
                        } else {
                            $resources->id_parent = 2;
                        }
                        $resources->name->language[0][0] = $item['denominacion'];
                        $resources->link_rewrite->language[0][0] = $item['id'];

                        /*$resources->name->language[0][0] = $item['denominacion'];
                        $resources->description->language[0][0] = $item['descripcion'];
                        $resources->link_rewriten->language[0][0] = $item['denominacion'];
                        $resources->active = 1;
                        $resources->id_parent = ($item['idpadre'] ? $item['idpadre'] : 2);*/
                        //$resources->id = $item['id'];
                        $resources->id_shop_default = $idshop;
                        //$resources->is_root_category = ($item['idpadre'] != '')?1:0;
                        //$resources->date_add = now();
                        //$resources->id_shop_default = 1;
                        $resources->is_root_category = 0;
                        $opt = array('resource' => 'categories');
                        $opt['postXml'] = $xml->asXML();
                        $xml = $this->psWebService->add($opt);
                        $cachePadres[$item['id']] = array('idpadre' => (int) $xml->category->id, 'agrupacion' => ($item['idpadre']) ? 0 : 1);
                        if ($item['idpadre'] == 0) {
                            /*$sqlIdreferencia = "update mod_logpuntoventa.dat_naturalezaagrupacion
                            set idreferencia = {$xml->category->id} where idnaturalezaagrupacion = {$item['id']}";*/
                        } else {
                            /*$sqlIdreferencia = "update mod_logpuntoventa.dat_areaventanaturaleza
                            set idreferencia = {$xml->category->id} where idnaturaleza = {$item['id']}
                            and idareaventa = {$item['idareaventa']}";*/
                        }
                        //$datos = Zend_Registry::get('conexion')->prepare($sqlIdreferencia)->execute();

                    }
                } catch (PrestaShopWebserviceException $e) {
                    // Here we are dealing with errors
                    print_r($item['denominacion'] . ' ' . $cachePadres[$item['idpadre']]);
                    die;
                }
            }
        }
        foreach ($cachePadres as $index => $value) {
            if ($value['agrupacion']) {
                $sqlIdreferencia = "update mod_logpuntoventa.dat_areaventaagrupacion
                            set idreferencia = {$value['idpadre']} where idagrupacion = {$index} 
                            and idareaventa = {$arrayCategory[0]['idareaventa']}";
            } else {
                $sqlIdreferencia = "update mod_logpuntoventa.dat_areaventanaturaleza
                            set idreferencia = {$value['idpadre']} where idnaturaleza = {$index}
                            and idareaventa = {$arrayCategory[0]['idareaventa']}";
            }
            Doctrine_Manager::connection()->fetchAll($sqlIdreferencia);
        }
    }

    public function getCategoriaSuperior($idcategoria)
    {
        $array = array();
        $sql = "select ag.idreferencia from mod_logpuntoventa.dat_naturalezaagrupacion ag 
                inner join mod_logpuntoventa.dat_naturalezaventa vnt on vnt.idpadre = ag.idnaturalezaagrupacion
               where vnt.idnaturaleza = {$idcategoria}";
        $array = Doctrine_Manager::connection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $array[0];
    }

    public function migrarProductos($arrayItems)
    {
        try {
            $documento = $this->docLogModel->adicionarDocumento($arrayItems['documento']);
            $documento->save();
            $this->docLogModel->adicionarClientes(
                $documento->iddocumento,
                array(array('idcliente' => $arrayItems['documento']['idcliente'], 'tipocliente' => 1)),
                false
            );
            $name = $arrayItems['nombreconexion'];
            $opt = array('resource' => 'shops');
            $opt['display'] = 'full';
            $opt['filter[name]']= $name;
            $xml = $this->psWebService->get($opt);
            $resources = $xml->children()->children();

            $idshop = $resources->shop->id;
            $id_category = $resources->shop->id_category;
            $idshop = (array) $idshop;
            $arrayItems = $arrayItems['datos'];
            foreach ($arrayItems as $item) {
                $item['id_category_default'] = $id_category;
                $existe = $this->buscarProducto($item['referencia']);
                if ($existe) {
                    $this->actualizarProducto($existe, $item, $idshop);
                } else {
                    $this->addProducto($item, $idshop);
                }
                if ($item['disponible'] > 0) {
                    $conProd = true;
                    $array['iddocumento'] = $documento->iddocumento;
                    $array['idproducto'] = $item['idproducto'];
                    $array['cantidad'] = $item['disponible'];
                    $comprometida = new CantidadesComprometidasModel();
                    $comprometida->insertarCantidadComprometida($array);
                }
            }
            if (isset($conProd)) {
                $this->docLogModel->confirmarDocumento($documento->iddocumento);
                $this->docLogModel->aprobarDocumento($documento->iddocumento);
            } else {
                $documento->delete();
            }
            return true;
        } catch (Exception $e) {
            print_r($xml);
            die;
        }
    }

    public function addProducto($item, $idshop)
    {
        // se llama al webservice para crear el producto
        $opt = array('resource' => 'products');
        $xml = $this->psWebService->get(array('url' => $this->storeURl . '/api/products?schema=blank'));
        $resources = $xml->children()->children();

        unset($resources->position_in_category);
        unset($resources->manufacturer_name);
        unset($resources->max_quantity_whit_combination);

        //$resources->id = $item['idproducto'];
        $resources->price = $item['precio'];
        $resources->reference = $item['referencia'];
        //$resources->ean13 = $ean13;
        $resources->unity = $item['umedida'];
        $resources->active = '1';
        $resources->show_price = 1;
        $resources->available_for_order = 1;
        //$resources->visibility = 'both';
        //$resources->state  = 1;
        $resources->id_category_default = $item['id_category_default'];

        $resources->name->language[0][0] = $item['denominacion'];
        $resources->description->language[0][0] = $item['descripcion'];
        $resources->description_short->language[0][0] = $item['descripcionventa'];
        //$resources->associations = '';
        //por cada categoria hay que poner esto
        $resources->associations->categories->category->id = "'" . $item['idcategoriapadre'] . "'"; //"'".$producto['idnaturaleza']."'";
        if ($item['idcategoriapadre']) {
            $resources->associations->categories->addChild('category')->addChild('id', $item['idcategoriapadre']);
        }

        $opt['postXml'] = $xml->asXML();
        try {
            $xml = $this->psWebService->add($opt);
        } catch (Exception $e) {
            print_r($xml);
            die;
        }
        $id_producto = (int)$xml->product->id;
        //actualizar el idexterno en la tabla dat_productoventa
        //poniendo cantidad
        $this->set_product_quantity($xml->product, $item, $idshop);
        if ($item['imagen'] && $id_producto) {
            $this->addNewImage($id_producto, $id_producto, $item['imagen']);
        }
        //poniendo imagen
        // $this->addNewImage($id_producto,$item['referencia']);
    }

    public function actualizarProducto($id, $producto, $idshop)
    {
        $opt = array('resource' => 'products');
        $opt['id'] = $id;
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        if ($resources->associations->images->image) {
            unset($producto['imagen']);
        }
        $idcategory = $resources->associations->categories->category->id;
        unset($resources->position_in_category);
        unset($resources->manufacturer_name);
        unset($resources->quantity);
        unset($resources->type);
        unset($resources->associations);
        unset($resources->max_quantity_whit_combination);
        //$resources->id = $producto['idproducto'];
        $resources->price = $producto['precio'];
        //$resources->reference = $item['referencia'];
        //$resources->ean13 = $ean13;
        $resources->unity = $producto['umedida'];
        $resources->active = '1';
        $resources->show_price = 1;
        $resources->available_for_order = 1;
        //$resources->visibility = 'both';
        //$resources->state  = 1;
        $resources->id_category_default = $producto['id_category_default'];

        $resources->name->language[0][0] = $producto['denominacion'];
        $resources->description->language[0][0] = $producto['descripcion'];
        $resources->description_short->language[0][0] = $producto['descripcionventa'];
        //    $resources->associations = '';
        //por cada categoria hay que poner esto
        $resources->associations->categories->category->id = "'" . $producto['idcategoriapadre'] . "'";
        if ($producto['idcategoriapadre']/* && !$idcategory*/) {
            $idcategoriaSuperior = $this->getCategoriaSuperior($producto['idnaturaleza']);
            if ($idcategoriaSuperior) {
                $resources->associations->categories->addChild('category')->addChild('id', $idcategoriaSuperior);
            }
            $resources->associations->categories->addChild('category')->addChild('id', $producto['idcategoriapadre']);
        } /*else {
            $resources->associations->categories->addChild('category')->addChild('id', $idcategory);
        }*/
        //print_r((array) $resources);die;

        $opt['putXml'] = $xml->asXML();
        $xml = $this->psWebService->edit($opt);
        $this->set_product_quantity($xml->product, $producto, $idshop, 1);
        $id_producto = (int)$xml->product->id;
        if ($producto['imagen'] && $id_producto) {
            $this->addNewImage($id_producto, $id_producto, $producto['imagen'], 1);
        }

        return $xml;
    }
    // se llama al webservice para poner la cantidad al producto
    public  function stock_availables($item, $quantity)
    {
        //$quantity = 200;
        //$opt = array('resource' => 'products');

        $stock = (array) $item;
        $opt = array('resource' => 'stock_availables');
        $opt['display'] = 'full';
        $opt['filter[id]'] = $stock['id'];
        //$opt['filter[id_shop]']= $idshop;
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        //print_r($resources);
        $resources->stock_available->quantity += (int)$quantity;
        return $resources->stock_available->quantity;
        //print_r($resources->stock_available->quantity);die;
    }

    // se llama al webservice para poner la cantidad al producto
    public  function set_product_quantity($product, $datosprod, $idshop, $update)
    {
        $quantity = $datosprod['disponible'];
        //$quantity = 200;
        //$opt = array('resource' => 'products');
        foreach ($product->associations->stock_availables->stock_available as $item) {
            if ($update) {
                $quantity = $this->stock_availables($item, $quantity);
            }
            $opt = array('url' => $this->storeURl . '/api/stock_availables?schema=blank');
            $xml = $this->psWebService->get($opt);
            $resources = $xml->children()->children();
            $resources->id = $item->id;
            $resources->id_product  = $product->id;
            $resources->quantity = (int)$quantity;
            $resources->id_shop = (int)$idshop[0];
            $resources->out_of_stock = 0;
            $resources->depends_on_stock = 0;
            $resources->id_product_attribute = $item->id_product_attribute;
            $xml = $this->psWebService->edit(array(
                'resource'  =>  'stock_availables',
                'putXml'    =>  $xml->asXML(),
                'id'        =>  $item->id
            ));
            $params['cantidad'] = (float)$quantity;
            $params['idproducto'] = $datosprod['idproducto'];
            $this->comunVenta->actualizarCantidadEnTienda($params);
        }
    }

    public function getIdOpComercio($referencia)
    {
        $opt = array('url' => $this->storeURl . "/api/order_payments?filter[order_reference]={$referencia}&display=full");
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        if ($resources->order_payment->transaction_id) {
            return $resources->order_payment->transaction_id;
        }
        return '';
    }

    public function buscarProducto($referencia)
    {
        //$referencia='42100-05300-000ROE';
        $opt = array('resource' => 'products');
        $opt['display'] = 'full';
        $opt['filter[reference]'] = $referencia;
        $xml = $this->psWebService->get($opt);
        return $xml->products->product->id;
    }

    public function buscarCategoria($id, $link = false, $idshop)
    {
        $opt = array('resource' => 'categories');
        $opt['display'] = 'full';
        $idshop = (array) $idshop;
        $opt['filter[id_shop_default]'] = $idshop[0];
        if ($link) {
            $opt['filter[link_rewrite]'] = $id;
        } else {
            $opt['filter[id]'] = $id;
        }
        $xml = $this->psWebService->get($opt);
        return $xml->categories->category->id;
    }

    public function actualizarCategoria($id, $categoria, $idshop, $cachePadres = array())
    {
        $idshop = (array) $idshop;
        $opt = array('resource' => 'categories');
        $opt['id'] = $id;
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        //unset($resources->id_parent);
        if ($categoria['idreferenciapadre']) {
            if ($categoria['idpadre']) {
                $resources->id_parent = ($categoria['idreferenciapadre'])
                    ? $categoria['idreferenciapadre']
                    : $cachePadres[$categoria['idpadre']]['idpadre']; //$this->obtenerIdPadre($item);
            } else {
                $resources->id_parent = 2;
            }
        }
        //$resources->name->language[0][0] = $categoria['denominacion'];
        /*$resources->id = $id;
        $resources->id = $id;*/
        /*unset($resources->id);
        unset($resources->position);
        unset($resources->date_add);
        unset($resources->date_upd);


        unset($resources->level_depth);
        unset($resources->nb_products_recursive);
        unset($resources->is_root_category);
        unset($resources->description);
        unset($resources->meta_title);
        unset($resources->meta_description);
        unset($resources->meta_keywords);
        unset($resources->associations);
        unset($resources->active);*/
        unset($resources->level_depth);
        unset($resources->nb_products_recursive);
        $resources->active = 1;
        $resources->name->language[0][0] = $categoria['denominacion'];
        //$resources->link_rewrite->language[0][0] = $id;

        $resources->id_shop_default = $idshop;
        $resources->is_root_category = 0;
        $opt['putXml'] = $xml->asXML();
        //print_r($opt);die;
        $xml = $this->psWebService->edit($opt);
        return $xml;
    }

    private function crearImgTempServidor($image_name, $imagen, $dirImg)
    {
        $dirSeparator = '/';
        list($tipo, $base64Img) = explode(';', $imagen);
        list(, $base64Img) = explode(',', $base64Img);
        list(, $tipo) = explode('/', $tipo);
        mkdir($dirImg);
        $fichero = $dirImg . $dirSeparator . $image_name . '.' . $tipo;
        if (!file_exists($fichero)) {
            $base64Img = base64_decode($base64Img);
            file_put_contents($fichero, $base64Img);
        }
        return $image_name . '.' . $tipo;
    }

    private function deleteImgTempServidor($image_path, $dirImg = false)
    {
        /*if($dirImg){
            rmdir($dirImg);
        }*/
        return unlink($image_path);
    }

    // se sube la imagen por curl
    public function addNewImage($product_id, $image_name, $imagen, $update = 0)
    {
        //$product_id = 1000446767;
        //$image_name = '1000446767.jpg';
        $this->_objLogImg = LogisticaImagenHelper::__init();
        $dirImg = $this->_objLogImg->getTmpDirIMG();
        $image_name = $this->crearImgTempServidor($image_name, $imagen, $dirImg);
        //echo '<pre>';
        //print_r($dirImg);

        $url = $this->storeURl . '/api/images/products/' . $product_id;
        //para actualizar imagen poner "/{$imageID}/?ps_method=PUT" al final de la url
        //$image_path1 = 'E:/TRABAJO/Repos/DistraSASA/web/logistica/utiles/tmpimg/'.$image_name;
        $image_path = $dirImg . '/' . $image_name;
        $curlFile = new CURLFile($image_path, 'image/jpg', $image_name);
        $curlChannel = curl_init();
        curl_setopt($curlChannel, CURLOPT_URL, $url);
        curl_setopt($curlChannel, CURLOPT_POST, true);
        curl_setopt($curlChannel, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curlChannel, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curlChannel, CURLOPT_USERPWD, $this->storeKey . ':');
        curl_setopt($curlChannel, CURLOPT_POSTFIELDS, ['image' => $curlFile]);
        //curl_setopt($curlChannel, CURLOPT_POSTFIELDS, array('image' => '@'.$image_path));
        curl_setopt($curlChannel, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($curlChannel);
        $info = curl_getinfo($curlChannel);
        curl_close($curlChannel);
        return $this->deleteImgTempServidor($image_path, $dirImg);
        /*switch ($info['http_code']) {
            case 200:
                return $response;
            default:
                throw new Exception($response, $info['http_code']);
                break;
        }*/
    }

    public function setModoCatalogo($params, $conectionName)
    {
        $name = $conectionName;
        $optId = array('resource' => 'shops');
        $optId['display'] = 'full';
        $optId['filter[name]'] = $name;
        $xmlId = $this->psWebService->get($optId);
        $resourcesId = $xmlId->children()->children();
        $idshop = $resourcesId->shop->id;
        $idshop = (array) $idshop;

        $optAux = array('resource' => 'configurations');
        $optAux['filter[name]'] = 'PS_CATALOG_MODE';
        $optAux['filter[id_shop]'] = $idshop[0];
        $optAux['display'] = 'full';
        $xmlAux = $this->psWebService->get($optAux);
        $resAux = $xmlAux->children()->children();
        $opt = array('url' => $this->storeURl . '/api/configurations?schema=blank');
        $xml = $this->psWebService->get($opt);
        $resources = $xml->children()->children();
        $resources->value = $params['modocatalogo'];
        $resources->name = 'PS_CATALOG_MODE';
        $resources->id_shop = $idshop[0];
        if ($resAux) {
            $resources->id = $resAux->configuration->id;
            try {

                $xml = $this->psWebService->edit(array(
                    'resource'  =>  'configurations',
                    'putXml'    =>  $xml->asXML(),
                    'id'        =>  $resources->id
                ));
            } catch (Exception $e) {
                print_r($xml);
                die;
            }
        } else {
            try {

                $xml = $this->psWebService->add(array(
                    'resource'  =>  'configurations',
                    'postXml'    =>  $xml->asXML()
                ));
            } catch (Exception $e) {
                print_r($xml);
                die;
            }
        }

        $optAux1 = array('resource' => 'configurations');
        $optAux1['filter[name]'] = 'PS_CCCJS_VERSION';
        $optAux1['display'] = 'full';
        $xmlAux1 = $this->psWebService->get($optAux1);
        $resAux1 = $xmlAux1->children()->children();

        $opt2 = array('url' => $this->storeURl . '/api/configurations?schema=blank');
        $xml2 = $this->psWebService->get($opt2);
        $resources2 = $xml2->children()->children();

        $resources2->name = 'PS_CCCJS_VERSION';
        $resources2->id_shop = $idshop[0];
        $existe = false;
        $value = 0;//PS_CCCCSS_VERSION
        $valueAux = 0;
        foreach ($resAux1 as $r) {
            if ($r->id_shop == $idshop[0]) {
                $existe = $r->id;
                $value = (int)$r->value;
            } else if (!$r->id_shop) {
                $valueAux = (int)$r->value;
            }
        }
        $resources2->value = ($value != 0) ? (int)$value + 1 : $valueAux + 1;
        if ($existe) {
            $resources2->id = $existe;
            try {

                $xml2 = $this->psWebService->edit(array(
                    'resource'  =>  'configurations',
                    'putXml'    =>  $xml2->asXML(),
                    'id'        =>  $resources2->id
                ));
            } catch (Exception $e) {
                print_r($xml2);
                die;
            }
        } else {
            try {

                $xml2 = $this->psWebService->add(array(
                    'resource'  =>  'configurations',
                    'postXml'    =>  $xml2->asXML()
                ));
            } catch (Exception $e) {
                print_r($xml2);
                die;
            }
        }

        $optAux2 = array('resource' => 'configurations');
        $optAux2['filter[name]'] = 'PS_CCCCSS_VERSION';
        $optAux2['display'] = 'full';
        $xmlAux2 = $this->psWebService->get($optAux2);
        $resAux2 = $xmlAux2->children()->children();

        $opt3 = array('url' => $this->storeURl . '/api/configurations?schema=blank');
        $xml3 = $this->psWebService->get($opt3);
        $resources3 = $xml3->children()->children();

        $resources3->name = 'PS_CCCCSS_VERSION';
        $resources3->id_shop = $idshop[0];
        $existe1 = false;
        foreach ($resAux2 as $r) {
            if ($r->id_shop == $idshop[0]) {
                $existe1 = $r->id;
            }
        }
        $resources3->value = ($value != 0) ? (int)$value + 1 : $valueAux + 1;
        if ($existe1) {
            $resources3->id = $existe1;
            try {

                $xml3 = $this->psWebService->edit(array(
                    'resource'  =>  'configurations',
                    'putXml'    =>  $xml3->asXML(),
                    'id'        =>  $resources3->id
                ));
            } catch (Exception $e) {
                print_r($xml3);
                die;
            }
        } else {
            try {

                $xml3 = $this->psWebService->add(array(
                    'resource'  =>  'configurations',
                    'postXml'    =>  $xml3->asXML()
                ));
            } catch (Exception $e) {
                print_r($xml3);
                die;
            }
        }

        return $xml;
    }

    public function getRecordableElementsByProduct($id_cart, $product_id)
    {
        $opt = array('url' => $this->storeURl . "/api/customizations?filter[id_product]={$product_id}&filter[id_cart]={$id_cart}&display=full");
        $xml = $this->psWebService->get($opt);
        $result = $xml->children()->children();
        if (count($result)) {
            $customizations = $result[0];
            $customizations = (array) $customizations;
            $objArray = array();
            foreach ($customizations['associations']->customized_data_text_fields->customized_data_text_field as $customization) {
                $customization = (array) $customization;
                $obj = new stdClass();
                $obj->id = $customization['id_customization_field'];
                $obj->value = $customization['value'];
                $obj->label = $this->getRecordableElementLabelByID($product_id, $customization['id_customization_field']);
                array_push($objArray, $obj);
            }
            return $objArray;
        }
        return '-1';
    }

    public function getRecordableElementLabelByID($product_id, $id)
    {
        $opt = array('url' => $this->storeURl . "/api/product_customization_fields?filter[id_product]={$product_id}&filter[id]={$id}&display=full");
        $xml = $this->psWebService->get($opt);
        $result = $xml->children()->children();
        if (count($result)) {
            $customizations = $result[0];
            $customizations = (array) $customizations;
            return $customizations['name'];
        }
        return '';
    }
}
