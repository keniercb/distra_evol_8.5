<?php

class GuajiritosApiHelper extends ApiHelper implements ISingletonClass
{

    private static $instance = null;
    private $apiToken;
    private $apiURL;
    private $variablesModel, $docLogModel;
    private $proxy;
    private $proxyAuth;

    public function __construct()
    {
        $this->docLogModel = new DocumentoLogisticaModel();
        $this->setProxyConfig();

    }

    private function setProxyConfig() {
        $this->proxy = false;
        $this->proxyAuth = false;

        $proxySql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'PROXY_TV'";
        $proxyValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($proxySql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($proxyValue) > 0) {
            $this->proxy = str_replace('\'', '', $proxyValue[0]['valor']);
        }

        $proxyAuthSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'PROXY_TV_AUTH'";
        $proxyAuthValue = LogisticaDoctrineHelper::__init()->getConnection()->execute($proxyAuthSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($proxyAuthValue) > 0) {
            $this->proxyAuth = str_replace('\'', '', $proxyAuthValue[0]['valor']);
        }
    }
    /**
     * @return DistraApiHelper
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new GuajiritosApiHelper;
        }
        return self::$instance;
    }

    public function execute($url, $data, $header, $post = true, $method = 'POST', $debugInfo = false, $authorization = false)
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HEADER => true,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_URL => $url,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0
        ));

        if ($this->proxy) {
            curl_setopt_array($ch, array(
                CURLOPT_PROXY => $this->proxy
            ));

            if ($this->proxyAuth) {
                curl_setopt_array($ch, array(
                    CURLOPT_PROXYUSERPWD => $this->proxyAuth
                ));
            }
        }

        if ($data) {
            curl_setopt_array($ch, array(
                CURLOPT_POSTFIELDS => $data
            ));
        }

        if ($post !== false && $method === 'POST') {
            curl_setopt_array($ch, array(
                CURLOPT_POST => true
            ));
        }
        if ($method === 'GET') {
            if ($authorization) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Authorization: ' . $authorization
                ));
            }
            curl_setopt_array($ch, array(
                CURLOPT_HTTPGET => true
            ));
        }
        if ($method === 'GET' && $data) {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        if ($method === 'PATCH') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        }
        if ($debugInfo) {
            echo "URL: $url\n";
            echo "Method: $method\n";
            echo "Headers:\n";
            print_r($header);
            echo "Body:\n";
            print_r($data);
        }
        $apiResponse = curl_exec($ch);
        if ($apiResponse === false) {
            die('Request Error:' . curl_error($ch));
        }
        $apiResponseInfo = curl_getinfo($ch);
        if ($debugInfo) {
            print_r($apiResponseInfo);
            die;
        }
        $pos = $apiResponseInfo['header_size'];
        /*stripos($apiResponse, '{');
        //$pos = stripos($apiResponse, '{');
        //$apiResponseHeader = trim(substr($apiResponse, 0, $pos));
        //$apiResponseBody  = $apiResponse;
        */
        $apiResponseBody = substr($apiResponse, $pos);
        curl_close($ch);
        return json_decode($apiResponseBody, true);
    }

    public function setApiUrl($newUrl)
    {
        $this->apiURL = $newUrl;
    }

    public function setToken($token)
    {
        $this->apiToken = $token;
    }

    public function authenticate($user, $password)
    {
        /*$header = array(
            'Content-type: application/json',
            'Accept: application/json, text/plain'
        );
        $ch = curl_init();
        curl_setopt_array($ch, array(
            // set url, timeouts, encoding headers etc.
            CURLOPT_URL => $this->apiURL . '/auth/login',
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_HTTPGET => true
            // ...
        ));

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization: Basic ' . base64_encode($user.':'.$password)
        ));

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        print_r($info);die;*/

        $auth = 'Basic '.base64_encode($user.':'.$password);

        $header = array(
            'Content-type: application/json',
            'Accept: application/json, text/plain'
        );

        $tokenData = $this->execute($this->apiURL . '/auth/login', false, $header, false, 'GET', false, $auth);
        $this->apiToken = $tokenData['data']['Authorization'];
        return $this->apiToken;
    }

    public function getCategory($params, $token) {
        $header = array(
            'Accept: application/json',
            'Authorization: ' . $token
        );
        $data = $this->execute($this->apiURL . '/category', array(), $header, false, 'GET');
        //print_r($data);die;
        return $data['data'];
    }

    public function getCategoryBy($id, $token) {
        $header = array(
            'Accept: application/json',
            'Authorization: ' . $token
        );
        $data = $this->execute($this->apiURL . '/category/'.$id, array(), $header, false, 'GET');
        //print_r($data);die;
        return $data['data'];
    }

    public function getBussines($params, $token) {
        $header = array(
            'Accept: application/json',
            'Authorization: ' . $token
        );
        $data = $this->execute($this->apiURL . '/public-business', array(), $header, false, 'GET');
        //$send = json_encode(array('status'=>'blockPayment', 'id'=>'1'));
        //$data = $this->execute($this->apiURL . '/business/1', $send, $header, false, 'PATCH');
        //var_dump($data);die;
        return $data['data'];
    }

    public function addSection($params, $token) {
        $categoriesId = $this->getNaturalezasSincronizadas($params);
        $sections = $this->getSection($token);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );

        if (count($sections)) {
            //print_r($sections);die;
        } else {
            //{"title":"Section de prueba", "categoriesIds":[1,2], "quantity":25}
            $sendData = array('title'=>'Productos', 'categoriesIds'=>$categoriesId, 'quantity'=>20);
            //print_r(json_encode($sendData));die;
            $resp = $this->execute($this->apiURL . '/distra-sync/section', json_encode($sendData), $header);
        }
        return true;
    }

    public function getSection($token) {
        $header = array(
            'Accept: application/json',
            'Authorization: ' . $token
        );
        $data = $this->execute($this->apiURL . '/section', array(), $header, false, 'GET');
        return $data['data'];
    }

    public function getProductoByCode($producto, $token) {
        $header = array(
            'Accept: application/json',
            'Authorization: ' . $token
        );
        $data = $this->execute($this->apiURL . '/product/index-one/'.urlencode($producto['referencia']), array(), $header, false, 'GET');
        return $data;
    }

    public function migrarCategorias($categories, $params) {
        //print_r($categories);die;
        $token = $this->authenticate($params['usuario'], $params['password']);
        //$this->getCategory(array(), $token);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );
        $cachePadres = array();
        foreach ($categories as $c) {
            $existe = false;
            if ($c['idreferencia']) {
                $existe = $this->getCategoryBy($c['idreferencia'], $token);
            }
            if (!$existe) {
                $nameCategory = array('es' => $c['denominacion'], 'en' => null);
                $sendCategory = array('name' => $nameCategory, 'showInNavBar' => 'true', 'showInFiltersBar' => 'true', 'ParentCategoryId' => ($c['idpadre'] != 0) ? $c['idreferenciapadre'] : null, 'tags' => array($c['denominacion']), 'image' => null);

                $resp = $this->execute($this->apiURL . '/category', json_encode($sendCategory), $header);
                $cachePadres[$c['id']] = array('idpadre' => (int) $resp['data']['id'], 'agrupacion' => ($c['idpadre']) ? 0 : 1);
            } else {
                //modificacion
            }
        }
        foreach ($cachePadres as $index => $value) {
            if ($value['agrupacion']) {
                $sqlIdreferencia = "update mod_logpuntoventa.dat_areaventaagrupacion
                            set idreferencia = {$value['idpadre']} where idagrupacion = {$index} 
                            and idareaventa = {$params['idareaventa']}";
            } else {
                $sqlIdreferencia = "update mod_logpuntoventa.dat_areaventanaturaleza
                            set idreferencia = {$value['idpadre']} where idnaturaleza = {$index}
                            and idareaventa = {$params['idareaventa']}";
            }
            Doctrine_Manager::connection()->fetchAll($sqlIdreferencia);
        }
        return true;
    }

    public function actualizarImagen($params, $token) {
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );
        $sendImage = array('image'=>$params['image'], 'isMain'=>true);
        $data = $this->execute($this->apiURL . '/product/'.$params['id'].'/image', json_encode($sendImage), $header);
        return $data;
    }

    public function migrarProductos($params) {
        $documento = $this->docLogModel->adicionarDocumento($params['documento']);
        $documento->save();
        $this->docLogModel->adicionarClientes(
            $documento->iddocumento,
            array(array('idcliente' => $params['documento']['idcliente'], 'tipocliente' => 1)),
            false
        );
        $token = $this->authenticate($params['usuario'], $params['password']);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );
        $bussinesCode = $params['codigotienda'];
        $productos = $params['datos'];
        foreach ($productos as $p) {
            $exist = $this->getProductoByCode($p, $token);
            if (!isset($exist['errors'])) {
                $idreferencia = $exist['id'];
                $dataBrand = array('code'=>$p['referencia'], 'name'=> $p['denominacion'],'description'=>strlen($p['descripcion']) ? $p['descripcion'] : $p['denominacion']);
                $dataPrices = array('min'=> 1, 'max'=> 10000, 'price'=> (double)$p['precioventa']);
                $dataAux = array('CategoryId'=> $p['idcategoriapadre'], 'currency'=>$p['monedaventa'], 'code'=> $p['referencia'], 'market'=>'international',
                    'description'=> strlen($p['descripcion']) ? $p['descripcion'] : $p['denominacion'],
                    'prices'=>array($dataPrices),
                    'Brand'=> $dataBrand,
                    'name'=>$p['denominacion']);

                $dataProduct = array(
                    'quantity' => (double)$p['disponible'], 'overwrite' => false, 'bussinesCode'=>$bussinesCode, 'cost'=>(double)$p['precioventa'],
                    'Product' => $dataAux
                );
                $sendProduct = array('data' => array($dataProduct));
                $resp = $this->execute($this->apiURL . '/distra-sync', json_encode($sendProduct), $header);
                //$this->actualizarImagen(array('id'=>$idreferencia, 'image'=>$p['imagen']), $token);
            } else {
                $dataBrand = array('code'=>$p['referencia'], 'name'=> $p['denominacion'],'description'=>strlen($p['descripcion']) ? $p['descripcion'] : $p['denominacion']);
                $dataPrices = array('min'=> 1, 'max'=> 10000, 'price'=> (double)$p['precioventa']);
                $dataAux = array('CategoryId'=> $p['idcategoriapadre'], 'currency'=>$p['monedaventa'], 'code'=> $p['referencia'], 'market'=>'international',
                    'description'=> strlen($p['descripcion']) ? $p['descripcion'] : $p['denominacion'],
                    'prices'=>array($dataPrices),
                    'Brand'=> $dataBrand,
                    'name'=>$p['denominacion']);

                $dataProduct = array(
                    'quantity' => (double)$p['disponible'], 'overwrite' => false, 'bussinesCode'=>$bussinesCode, 'cost'=>(double)$p['precioventa'],
                    'Product' => $dataAux
                );
                $sendProduct = array('data' => array($dataProduct));
                $resp = $this->execute($this->apiURL . '/distra-sync', json_encode($sendProduct), $header);
                $idreferencia = $resp['data'][0]['id'];
                $this->actualizarImagen(array('id'=>$idreferencia, 'image'=>$p['imagen']), $token);
                //print_r($resp);die;
            }
            if ($p['disponible'] > 0) {
                $conProd = true;
                $array['iddocumento'] = $documento->iddocumento;
                $array['idproducto'] = $p['idproducto'];
                $array['cantidad'] = $p['disponible'];
                $comprometida = new CantidadesComprometidasModel();
                $comprometida->insertarCantidadComprometida($array);
            }
        }
        $this->addSection($params, $token);
        if (isset($conProd)) {
            $this->docLogModel->confirmarDocumento($documento->iddocumento);
            $this->docLogModel->aprobarDocumento($documento->iddocumento);
        } else {
            $documento->delete();
        }
        return true;
    }

    private function getIdStateByReferencia($id) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT pm.id_state FROM mod_logpuntoventa.dat_provinciamunicipio pm where pm.idreferencia = {$id} limit 1";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($datos)) {
            return $datos[0]['id_state'];
        }
        return -1;
    }

    public function addPedidosTienda($params) {
        $token = $this->authenticate($params['usuario'], $params['password']);
        //$this->getBussines(array(), $token);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );
        $bussinesCode = $params['codigotienda'];
        $sqlDelete = "delete from mod_logpuntoventa.dat_pedidotienda where estado = 2 and idareaventa = {$params['idareaventa']}";
        Doctrine_Manager::connection()->fetchAll(
            $sqlDelete
        );

        $queryParams = [
            'order' => '-createdAt',
            'businessCode' => $bussinesCode,
            'filter[$and][status][$like]' => 'confirmed'
        ];
        $url = $this->apiURL . '/admin/payment?' . http_build_query($queryParams);

        $datosOrden = $this->execute($url, false, $header, false, 'GET');
        try {
            foreach ($datosOrden['data'] as $order) {
                $referenciaMunicipio = $order['Municipality']['id'];
                $idmunicipio = $this->getIdStateByReferencia($referenciaMunicipio);
                $nombreBeneficiario = $order['name'].' '.$order['lastName'];
                $fechaPedido = substr($order['createdAt'], 0, 10);
                $sql = "INSERT INTO 
                      mod_logpuntoventa.dat_pedidotienda
                    (
                      nropedido,beneficiario,dirbeneficiario,remitente,dirremitente,fechapedido,estado,idestructuracomun,
                      codigoregion,idareaventa,cibeneficiario,ciremitente,telbeneficiario,telremitente,idusuario,idreferencia,
                      metodopago,idtransaccion,idopcomercio,iso_municipio,municipio,id_state,comision
                    )
                    VALUES (
                      '{$order['order']}','{$nombreBeneficiario}','{$order['address2']}','{$nombreBeneficiario}',
                      '{$order['address2']}','{$fechaPedido}',2,{$params['idestructuracomun']},1,
                      {$params['idareaventa']},'{$order['dni']}','{$order['dni']}','{$order['phone']}','{$order['phone']}',
                      {$params['idusuario']},{$order['id']},'{$order['paymentType']}','','',
                      '','',{$idmunicipio},null
                    ) returning idpedidotienda";
                $idpedido = Doctrine_Manager::connection()->fetchAll(
                    $sql
                );
                foreach ($order['PaymentItems'] as $pos => &$producto) {
                    $recardableElements = '-1';
                    $datProdAux = $this->obtenerProducto(
                        array(
                            'idestructura' => $params['idestructuraop'],
                            'referencia' => $producto['Product']['code']
                        )
                    );
                    $cantidaPedida = $cantidadReal = $producto['quantity'];
                    $producto['price'] = $producto['price']/$cantidaPedida;//Quitar si mandan desde la api el precio
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
                      '{$producto['Product']['code']}',
                      {$datProd['idindicador']},
                      {$datProd['idproducto']},
                      {$cant},
                      {$cantidadReal},
                      round({$producto['price']},2),
                      round({$producto['price']}*{$cant},2),
                      {$datProd['idumedida']},
                      0,
                      0,
                      {$producto['price']},
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
            }
        } catch (Exception $e) {
            print_r($e->getMessage());die;
        }
        return true;
    }

    public function cambiarEstado($params, $idorder, $estado) {
        //distra-sync/payment
        $token = $this->authenticate($params['usuario'], $params['password']);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );
        $sendData = array('paymentIds'=>$idorder, 'status'=>$estado);

        $resp = $this->execute($this->apiURL . '/distra-sync/payment', json_encode($sendData), $header, false, 'PATCH');
        if (!isset($resp['errors'])) {
            return true;
        }
        return false;
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
                where p.idestructura = {$params['idestructura']} and (i.numeropieza = '{$params['referencia']}' or i.codigo = '{$params['referencia']}') 
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

    public function getNaturalezasSincronizadas($params) {
        $naturalezas = "select dv.idreferencia
                        from mod_logpuntoventa.dat_areaventanaturaleza dv
                        inner join mod_logpuntoventa.dat_naturalezaventa ntv on ntv.idnaturaleza = dv.idnaturaleza
                        inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = dv.idnaturaleza
                        where dv.idareaventa = {$params['idareaventa']} and nat.estado = 1 and dv.idreferencia is not null
                        group by nat.idnaturaleza,nat.codigo, nat.denominacion, ntv.idpadre,dv.enviado,dv.idreferencia
                        having (case when nat.idnaturaleza = nat.idpadre then 1 else 0 end) = 1";
        $agrupacion = "select ava.idreferencia
                         from mod_logpuntoventa.dat_naturalezaagrupacion ag
                         inner join mod_logpuntoventa.dat_areaventaagrupacion ava on ava.idagrupacion = ag.idnaturalezaagrupacion
                         where ava.idareaventa = {$params['idareaventa']} and ava.idreferencia is not null";

        $sql = "select t.* from ( $naturalezas union $agrupacion) as t where t.idreferencia is not null";
        return Doctrine_Manager::connection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
    }

    public function setModoCatalogo($params, $conectionName) {
        $token = $this->authenticate($params['usuario'], $params['password']);
        //$this->getCategory(array(), $token);
        $header = array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Authorization: ' . $token
        );
        $status = !$params['modocatalogo'] ? 'approved' : 'blockPayment';
        $sendData = array('status'=>$status, 'id'=>'1');

        $resp = $this->execute($this->apiURL . '/business/1', json_encode($sendData), $header, false, 'PATCH');
        return true;
    }

}
