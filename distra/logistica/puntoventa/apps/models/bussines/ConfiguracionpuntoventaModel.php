<?php

class ConfiguracionpuntoventaModel extends ComunpuntoventaModel
{
    private $_serviciosConfiguracionGeneral;
    public function __construct()
    {
        parent::__construct();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        /*$relations[] = array('cardinalidad' => 'many', 'relation' => 'NomNaturaleza',
    'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'));
    $this->logisticaDoctrine->tryInyectRelactions(new DatAreaventaNaturaleza(), $relations);*/
    }

    public function cargarGridPrincipal($params)
    {
        if($params['areaCaja']){
            return $this->cargarAreaCaja($params);
        } else if($params['cajero']){
            return $this->cargarCajero($params);
        } else if($params['operacionesCaja']){
            $params['activa'] = true;
            return $this->cargarAreaCaja($params);
        } else {
            return $this->cargarAreasGrid($params);
        }
        //return ($params['areaCaja']) ? $this->cargarAreaCaja($params) : $this->cargarAreasGrid($params);
    }

    private function cargarAreasGrid($params)
    {
        return parent::cargarAreas($params);
    }

    public function cargarAreas($params)
    {
        if ($params['cmbArea']) {
            $params['start'] = 0;
            $params['limit'] = 1000;
            return parent::cargarAreas($params);
        }
        $start = $params['start'] ? $params['start'] : 0;
        $limit = $params['limit'] ? $params['limit'] : 30;
        $query = Doctrine_Query::create()->select('idestructuraop')->from('DatAreaventa')
            ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura))->fetchArray();
        $arraIdsDeposit = $this->objectHelper->extractValueFromArrayColumn($query, 'idestructuraop');
        if (count($arraIdsDeposit) > 0) {
            $filtro = array('criterio' => $params['criterio'], 'idestructura' => $arraIdsDeposit);
        } else {
            $filtro = $params['criterio'];
        }
        $areas = $this->estructuraHelper->obtenerEstructurasNoFormales(
            $this->global->perfil->iddominio, $this->global->estructura->idestructura, $filtro, $limit, $start
        );
        foreach ($areas as &$area) {
            $area['coddenominacion'] = $area['DatEstructuraop'][0]['codigo'] . ' - ' . $area['text'];
            $area['denominacion'] = $area['text'];
            $area['idestructuraop'] = $area['DatEstructuraop'][0]['idestructuraop'];
        }
        $total = count(
            $this->estructuraHelper->obtenerEstructurasNoFormales(
                $this->global->perfil->iddominio, $this->global->estructura->idestructura, $filtro
            )
        );
        return array('datos' => $areas, 'cantidad' => $total);
    }

    public function adicionarAreaCaja($params)
    {
        if ($params['areaVenta']) {
            $this->adicionarAreaVenta($params);
        } else {
            if ($params['cajaArea']) {
                $this->adicionarCajaArea($params);
            } else {
                $this->adicionarCajero($params);
            }
        }
        return true;
        /*if ($params['areaVenta']) {
            $this->adicionarAreaVenta($params);
        } else {
            if ($params['cajaArea']) {
                $this->adicionarCajaArea($params);
            }
        }
        return true;*/
    }

    public function diasHabiles($params)
    {
        $areaventa = new DatAreaventa();
        $areaventa->assignIdentifier($params['idareaventa']);
        if ($params['adicional']) {
            $areaventa->nombre = $params['nombre'];
            $areaventa->telefono = $params['telefono'];
            $areaventa->correo = $params['correo'];
            $areaventa->direccion = $params['direccion'];
            $areaventa->tipoventa = $params['tipoventa'];
        } else {
            $areaventa->diashabiles = ($params['diashabiles']) ? $params['diashabiles'] : 0;
            $areaventa->idcliente = ($params['idcliente']) ? $params['idcliente'] : null;
            $areaventa->idtipoprecio = ($params['idtipoprecio']) ? $params['idtipoprecio'] : null;
            $areaventa->idtipoprecioagencia = ($params['idtipoprecioagencia']) ? $params['idtipoprecioagencia'] : null;
            $areaventa->idmoneda = ($params['idmoneda']) ? $params['idmoneda'] : null;
            $areaventa->idmodopago = ($params['idmodopago']) ? $params['idmodopago'] : null;
            $areaventa->idnomoperaciones = ($params['idnomoperaciones']) ? $params['idnomoperaciones'] : null;
            $areaventa->idnomoperaciondev = ($params['idnomoperaciondev']) ? $params['idnomoperaciondev'] : null;
            $areaventa->usuarioez = ($params['usuarioez']) ? $params['usuarioez'] : null;
            $areaventa->comisionbanco = ($params['comisionbanco']) ? $params['comisionbanco'] : null;
            $areaventa->idcondicionpago = ($params['idcondicionpago']) ? $params['idcondicionpago'] : null;
            $areaventa->denominacionpago = ($params['denominacionpago']) ? $params['denominacionpago'] : null;
            $areaventa->noobligatorio = ($params['noobligatorio'] == 1) ? $params['noobligatorio'] : 0;
        }
        $areaventa->save();
        return true;
    }

    public function adicionarAreaVenta($params)
    {
        $areaCollection = new Doctrine_Collection('DatAreaventa');
        foreach ($params['datos'] as $value) {
            $datArea = new DatAreaventa();
            $datArea->synchronizeWithArray($value);
            $areaCollection->add($datArea);
        }
        $areaCollection->save();
    }

    public function adicionarCajaArea($params)
    {
        $cajaArea = new DatCaja();
        if ($params['datos']['idcaja']) {
            $cajaArea->assignIdentifier($params['datos']['idcaja']);
        }
        $cajaArea->synchronizeWithArray($params['datos']);
        $this->adicionarUsersCaja($params, $cajaArea);
    }

    public function adicionarUsersCaja($params, $cajaArea)
    {
        if ($params['datos']['action']) {
            $this->clearTableUser($params['datos']);
        }
        foreach ($params['datos']['idusuarios'] as &$value) {
            $value['idusuario'] = $value['idusuario'] ? $value['idusuario'] : $value['idUsuario'];
            $cajaUsuario = new DatCajausuario();
            $cajaUsuario->synchronizeWithArray($value);
            $cajaArea->DatCajausuario->add($cajaUsuario);
        }

        try {
            $cajaArea->save();
        } catch (Exception $e) {
            if ($e->getCode() == 23505) {
                throw new LogisticaException('LOG_LB_PUNTOVENTA_009');
            }
        }
    }

    public function clearTableUser($params)
    {
        return Doctrine_Query::create()->delete('DatCajausuario')->where('idcaja = ?', [$params['idcaja']])->execute();
    }

    public function cargarUsuarios($params)
    {
        $total = 0;
        $usuarios = array();
        $datos = $this->obtenerUsuariosParaRelacionar($params);
        foreach ($datos['datos'] as &$user) {
            if ($params['grid'] != 'der') {
                $this->getUsuarioByGridIzq($params, $user, $usuarios, $total);
            } else {
                $user['nombreusuario'] = $this->seguridadHelper->getNombreUsuario($user['idusuario']);
                $usuarios[] = $user;
                $total++;
            }
            //gabriel esto no funciona
            /*  if ($params['grid'] == 'izq'){
        return array('cantidad' => $datos['cantidad_filas'], 'datos' => $usuarios);
        }*/
        }
        return array('cantidad' => $total, 'datos' => $usuarios);
    }

    private function obtenerUsuariosParaRelacionar(&$params)
    {
        if ($params['grid'] != 'der') {
            return $this->seguridadHelper->obtenerAllUsuarios(10000/*$params['limit']*/, $params['start']);
        }
        return $this->getUser($params);
    }

    private function getUsuarioByGridIzq($params, &$user, &$usuarios, &$total)
    {
        $existUser = $this->existsUser($user['idUsuario'], $params['idcaja'], $params['idareaventa']);
        if (!$existUser) {
            $usuarios[] = $user;
            $total++;
        }
    }

    public function getUser($params)
    {
        $query = Doctrine_Query::create()->from('DatCajausuario cu')
            ->innerJoin('cu.DatCaja dc');
        if ($params['idcaja']) {
            $query->addWhere('cu.idcaja = ?', array($params['idcaja']));
        }
        if ($params['idareaventa']) {
            $query->addWhere('dc.idareaventa = ?', array($params['idareaventa']));
        }
        return ($params['user']) ? $query->fetchArray() : [
            'cantidad' => $query->count(),
            'datos' => $query->fetchArray(),
        ];
    }

    public function existsUser($user, $idcaja, $idareaventa)
    {
        return Doctrine_Query::create()->from('DatCajausuario cu')
            ->innerJoin('cu.DatCaja dc')
            ->where('cu.idusuario = ? and cu.idcaja = ? and dc.idareaventa = ?', array($user, $idcaja, $idareaventa))->count() > 0;
    }
//caja
    public function cargarAreaCaja($params)
    {
        $params['areaVenta'] = true;
        return $this->getCajaAreaAll($params);
    }

    public function eliminarAreaCaja($params)
    {
        /*if ($params['areaVenta']) {
            return $this->deleteArea($params);
        }
        $this->deleteInCaja($params['datos']);
        return true;*/
        if ($params['areaVenta']) {
            return $this->deleteArea($params);
        } else if ($params['areaCajero']) {
            $this->deleteCajero($params['datos']);
        }
        $this->deleteInCaja($params['datos']);
        return true;
    }

    public function deleteArea($params)
    {
        if ($this->comprobarSiAreaEstaEnUso($params)) {
            Doctrine_Query::create()->delete()->from('DatAreaventa')->whereIn('idareaventa', $params['datos'])
                ->addWhere('activo = 0')->execute();
            return array('success' => true);
        }
        return array('success' => false);
    }

    private function comprobarSiAreaEstaEnUso($params)
    {
        $existeCajaAsociada = Doctrine_Query::create()->from('DatCaja')->whereIn('idareaventa', $params['datos'])
            ->count();
        $existeVentaAsociada = Doctrine_Query::create()->from('DatVenta')->whereIn('idareaventa', $params['datos'])
            ->count();
        if ($existeCajaAsociada || $existeVentaAsociada) {
            $this->activarAreaCaja(array('class' => 'DatAreaventa', 'activo' => 0));
            return false;
        }
        return true;
    }

    public function deleteInCaja($params)
    {
        return Doctrine_Query::create()->delete()->from('DatCaja')->whereIn('idcaja', $params)->execute();
    }

    public function activarAreaCaja($params)
    {
        $puntodeventaService = new PuntodeventaService();
        $collection = new Doctrine_Collection($params['class']);
        foreach ($params['datos'] as $value) {
            $areaVenta = Doctrine::getTable($params['class'])->find($value);
            if ($params['activo'] == 0 && $params['class'] == 'DatAreaventa') {
                $areaVenta->diashabiles = 0;
            }
            $areaVenta['activo'] = $params['activo'];
            $collection->add($areaVenta);
        }
        if ($params['class'] == 'DatCaja') {
            $idusuarios = $this->obtenerTodosUsuariosCaja($params['datos']);
            if (count($idusuarios) > 0) {
                foreach ($idusuarios as $user) {
                    $idusers[] = $user['idusuario'];
                }
                $puntodeventaService->cerrarSesionServicio($idusers);
            }
        }
        $collection->save();
        return true;
    }

    private function obtenerTodosUsuariosCaja($idcaja)
    {
        return Doctrine_Query::create()->select('idusuario')->from('DatCajausuario')
            ->whereIn('idcaja', $idcaja)->fetchArray();
    }

    public function adicionarProductosgrid($params)
    {
        if ($params['cambiarPrecioTPV'] == 1) {
            return $this->cambiarPrecioProducto($params);
        } else {
            if ($params['revaluarPrecioTPV'] == 1) {
                return $this->reevaluarPrecioProducto($params);
            }
        }

        return $this->adicionarProductos($params);
    }

    public function adicionarProductos($params)
    {
        $productoCollection = new Doctrine_Collection('DatProductoLogistica');
        foreach ($params['datos'] as &$value) {
            $datProducto = $this->existProducto($params['idestructura'], $value['idindicador']);
            if ($datProducto == 0) {
                $producto = new DatProductoLogistica();
                //no se puede quitar gabriel
                $value['cronologia'] = 2;
                $producto->synchronizeWithArray($value);
                $productoCollection->add($producto);
            } else {
                return false;
            }
        }
        $productoCollection->save();
        return true;
    }

    public function existProducto($idestructura, $idindicador)
    {
        return Doctrine_Query::create()->from('DatProductoLogistica')
            ->where('idestructura = ? and idindicador = ?', array($idestructura, $idindicador))->count();
    }

    public function cambiarPrecioProducto($params)
    {
        $producto = new DatProductoLogistica();
        $producto->assignIdentifier($params['idproducto']);
        if ($params['cambiarPrecioAlternativo'] == 1) {
            $producto->precioalternativo = 0;
        }
        $producto->precio = $params['precionuevo'];
        $producto->save();
        $motivo = new DatMotivocambioprecio();
        $motivo->synchronizeWithArray($params);
        $motivo->save();
        return true;
    }

    public function reevaluarPrecioProducto($params)
    {
        $productos = $this->listaproducto($params['idstructure']);
        if ($params['paratodos'] == 'true') {
            $collectionreevaluarproducto = new Doctrine_Collection('DatProductoLogistica');
            foreach ($productos as &$prod) {
                $reevaluarproducto = new DatProductoLogistica();
                $reevaluarproducto->assignIdentifier($prod['idproducto']);
                if ($params['operacion'] == 1) {
                    $reevaluarproducto->precio += ($prod['precio'] * $params['valorporcentual']) / 100;
                } else {
                    $reevaluarproducto->precio -= ($prod['precio'] * $params['valorporcentual']) / 100;
                }
                $collectionreevaluarproducto->add($reevaluarproducto);
            }
            $collectionreevaluarproducto->save();
        } else {
            foreach ($productos as &$product) {
                if ($params['idproducto'] == $product['idproducto']) {
                    $reevaluarunproducto = new DatProductoLogistica();
                    $reevaluarunproducto->assignIdentifier($params['idproducto']);
                    if ($params['operacion'] == 1) {
                        $reevaluarunproducto->precio += ($product['precio'] * $params['valorporcentual']) / 100;
                    } else {
                        $reevaluarunproducto->precio -= ($product['precio'] * $params['valorporcentual']) / 100;
                    }
                }
            }
            $reevaluarunproducto->save();
        }
        return true;
    }

    private function listaproducto($idestructura)
    {
        return Doctrine_Query::create()->select('d.idproducto,d.precio')->from('DatProductoLogistica d')
            ->where('d.precio > 0 and d.cantidad > 0 and idestructura = ?', array($idestructura))->fetchArray();
    }

    public function getClientes($parametros)
    {
        $filtro = array();
        if ($parametros['query']) {
            $filtro['nombre'] = $parametros['query'];
            $filtro['codigo'] = $parametros['query'];
        }
        $idcliente = null;
        $clientes = $this->configuracionHelper->getClientesProveedorByParams(
            $idcliente, $this->global->Estructura->idestructura, true, true, false, $filtro, $parametros['start'], $parametros['limit']
        );
        $conn = Doctrine_Manager::connection();
        foreach ($clientes['datos'] as &$c) {
            $result = $conn->fetchAll(
                "SELECT (c.nombre || ' ' ||c.numeroidentidad) as nombre, c.idcontacto
                      FROM mod_datosmaestros.nom_contacto c
                      inner join mod_crmclienteproveedor.dat_facultad f on f.idcontacto = c.idcontacto
                      WHERE c.idclientesproveedores={$c['idclientesproveedores']} and f.idtipofacultad = 2 ORDER BY c.idcontacto;"
            );
            $c['contactos'] = $result;
            $c['nombre'] = $c['codigo'] . ' ' . $c['nombre'];
        }
        return $clientes;
    }

    public function getModosPago()
    {
        $result['datos'] = Doctrine_Query::create()
            ->select('n.idmodopago,n.codigo,n.denominacion as modopago,
                        n.fechainicio,n.fechafin,n.estado,n.recargodescuento,n.porcentual,n.valor')
            ->from('NomModopago n')
            ->where('n.estado = 1')
            ->fetchArray();
        return $result;
    }

    public function guardarInfoConexion($params)
    {
        if ($params['eliminar']) {
            Doctrine_Query::create()->delete('DatInfoConexion')->where('idinfoconexion = ?', array($params['idinfoconexion']))->execute();
            return true;
        }
        if (isset($params['apicr'])) {
            $sql = "SELECT idareaventa, da.idinfoconexioncr FROM mod_logpuntoventa.dat_areaventa da
                inner join mod_logpuntoventa.dat_infoconexioncr inf on inf.idinfoconexioncr = da.idinfoconexioncr
                where inf.url = '{$params['url']}'
                and da.idareaventa <> {$params['idareaventa']}";

            $enUso = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            $datAreaVenta = Doctrine::getTable('DatAreaventa')->find($params['idareaventa']);
            $idconexold = $datAreaVenta->idinfoconexioncr;

            if ($enUso[0]) {
                $datAreaVenta->idinfoconexioncr = $enUso[0]['idinfoconexioncr'];
            } else {
                if (!$idconexold) {
                    $newConexion = new DatInfoConexioncr();
                    $newConexion->synchronizeWithArray($params);
                    $newConexion->save();
                } else {
                    $objCxn = Doctrine::getTable('DatInfoConexioncr')->find($idconexold);
                    $objCxn->assignIdentifier($idconexold);
                    $objCxn->synchronizeWithArray($params);
                    $objCxn->save();
                }

                $datAreaVenta->idinfoconexioncr = ($newConexion['idinfoconexioncr']) ? $newConexion['idinfoconexioncr'] : $objCxn->idinfoconexioncr;
            }


            $datAreaVenta->save();

        } else {
            $sql = "SELECT idareaventa FROM mod_logpuntoventa.dat_areaventa da
                inner join mod_logpuntoventa.dat_infoconexion inf on inf.idinfoconexion = da.idinfoconexion
                where inf.tipo = '{$params['tipo']}' and inf.url = '{$params['url']}' and inf.clave = '{$params['clave']}'
                and da.idareaventa <> {$params['idareaventa']}";
            $enUso = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            if ($enUso[0]) {
                throw new LogisticaException('LOG_LB_PUNTOVENTA_004');
            }

            $idconexold = 0;
            if ($params['tipo'] == 'ps') {
                $datAreaVenta = Doctrine::getTable('DatAreaventa')->find($params['idareaventa']);
                $idconexold = $datAreaVenta->idinfoconexion;
                //$conexion = Doctrine::getTable('DatInfoConexion')->findByDql("url = '{$params['url']}' and clave = '{$params['clave']}'");

                if (!$idconexold) {
                    $newConexion = new DatInfoConexion();
                    $newConexion->synchronizeWithArray($params);
                    $newConexion->save();
                    $idnewconexion = $newConexion['idinfoconexion'];
                } else {
                    $objCxn = Doctrine::getTable('DatInfoConexion')->find($idconexold);
                    $objCxn->assignIdentifier($idconexold);
                    $objCxn->synchronizeWithArray($params);
                    $objCxn->save();
                }
                $datAreaVenta->idinfoconexion = ($newConexion['idinfoconexion']) ? $newConexion['idinfoconexion'] : $objCxn->idinfoconexion;
                $datAreaVenta->save();
                /*if ($idconexold != 0 && $idconexold != $datAreaVenta->idinfoconexion) {
                    Doctrine_Query::create()->delete()->from('DatInfoConexion inf')
                        ->where("inf.idinfoconexion = {$idconexold} and inf.idinfoconexion NOT IN (SELECT da.idinfoconexion
                            FROM DatAreaVenta da WHERE da.idinfoconexion = {$idconexold})")
                        ->execute();
                }*/
            } else {
                $datAreaVenta = Doctrine::getTable('DatAreaventa')->find($params['idareaventa']);
                if ($datAreaVenta->idinfoconexion)
                    $idconexold = $datAreaVenta->idinfoconexion;
                else{
                    $conexion = Doctrine::getTable('DatInfoConexion')->findByDql("url = '{$params['url']}'");
                    if (count($conexion)) {
                        $idconexold = $conexion[0]['idinfoconexion'];
                    }
                }
                if (!$idconexold) {
                    $newConexion = new DatInfoConexion();
                    $newConexion->synchronizeWithArray($params);
                    $newConexion->save();
                    $idnewconexion = $newConexion['idinfoconexion'];
                } else {
                    $objCxn = Doctrine::getTable('DatInfoConexion')->find($idconexold);
                    $objCxn->assignIdentifier($idconexold);
                    $objCxn->synchronizeWithArray($params);
                    $objCxn->save();
                }
                $datAreaVenta->idinfoconexion = ($newConexion['idinfoconexion']) ? $newConexion['idinfoconexion'] : $objCxn->idinfoconexion;
                $datAreaVenta->save();
            }
            $sqlInsert = "INSERT INTO mod_logpuntoventa.dat_centroentregaalmacen (idareaventa,idestructura,iddeposito) VALUES ";
            $sqlInsertValues = array();
            $sqlInsertCorriente = "INSERT INTO mod_logpuntoventa.dat_areaventacorriente (idareaventa,iddeposito) VALUES ";
            $sqlInsertValuesCorriente = array();
            $sqlInsertMun = "INSERT INTO mod_logpuntoventa.dat_almacenregion (idestructura,id_state, idareaventa) VALUES ";
            $sqlInsertValuesMun = array();
            foreach ($params['almacen'] as $confAlm) {
                if ($confAlm->activo == 1) {
                    $existe = $this->doctrineHelper->getConnection()->execute("
                           select count(idcentroentregaalmacen) from mod_logpuntoventa.dat_centroentregaalmacen
                           where idareaventa = {$params['idareaventa']} and idestructura = {$confAlm->idcentroentrega}
                           and iddeposito = {$confAlm->iddeposito}
                ")->fetchAll(PDO::FETCH_COLUMN);
                    if ($existe[0] == 0) {
                        array_push(
                            $sqlInsertValues,
                            "({$params['idareaventa']},{$confAlm->idcentroentrega},{$confAlm->iddeposito})"
                        );
                    }
                } else {
                    $this->doctrineHelper->getConnection()->execute(
                        "delete from mod_logpuntoventa.dat_centroentregaalmacen
                     where idareaventa = {$params['idareaventa']} and idestructura = {$confAlm->idcentroentrega}
                     and iddeposito = {$confAlm->iddeposito}"
                    );
                }
            }
            foreach ($params['corriente'] as $confAlmC) {
                if ($confAlmC->activo == 1) {
                    $existeC = $this->doctrineHelper->getConnection()->execute("
                           select count(idareacorriente) from mod_logpuntoventa.dat_areaventacorriente
                           where idareaventa = {$params['idareaventa']} and iddeposito = {$confAlmC->iddeposito}
                ")->fetchAll(PDO::FETCH_COLUMN);
                    if ($existeC[0] == 0) {
                        array_push(
                            $sqlInsertValuesCorriente,
                            "({$params['idareaventa']},{$confAlmC->iddeposito})"
                        );
                    }
                } else {
                    $this->doctrineHelper->getConnection()->execute(
                        "delete from mod_logpuntoventa.dat_areaventacorriente
                     where idareaventa = {$params['idareaventa']} and iddeposito = {$confAlmC->iddeposito}"
                    );
                }
            }
            foreach ($params['municipios'] as $confAlmM) {
                if ($confAlmM->activo == 1) {
                    $existe = $this->doctrineHelper->getConnection()->execute("
                           select count(id_state) from mod_logpuntoventa.dat_almacenregion
                           where idestructura = {$confAlmM->idestructura} and id_state = {$confAlmM->idmunicipio}
                           and idareaventa = {$params['idareaventa']}
                ")->fetchAll(PDO::FETCH_COLUMN);
                    if ($existe[0] == 0) {
                        array_push(
                            $sqlInsertValuesMun,
                            "({$confAlmM->idestructura},{$confAlmM->idmunicipio},{$params['idareaventa']})"
                        );
                    }
                } else {
                    $this->doctrineHelper->getConnection()->execute(
                        "delete from mod_logpuntoventa.dat_almacenregion
                     where idestructura = {$confAlmM->idestructura} and id_state = {$confAlmM->idmunicipio} and idareaventa = {$params['idareaventa']}"
                    );
                }
            }
            if (count($sqlInsertValues)) {
                $this->doctrineHelper->getConnection()->execute(
                    $sqlInsert . implode(',', $sqlInsertValues)
                );
            }
            if (count($sqlInsertValuesCorriente)) {
                $this->doctrineHelper->getConnection()->execute(
                    $sqlInsertCorriente . implode(',', $sqlInsertValuesCorriente)
                );
            }
            if (count($sqlInsertValuesMun)) {
                $this->doctrineHelper->getConnection()->execute(
                    $sqlInsertMun . implode(',', $sqlInsertValuesMun)
                );
            }
        }
        return true;

    }

    public function cargarNaturalezas($params, $obj)
    {
        if ($params['idareaventa']) {
            $idareaventa = $params['idareaventa'];
            if (!$params['typesync']) {
                $campo = ($params['agrupacion']) ? 'idagrupacion' : 'idnaturaleza';
                $tabla = ($params['agrupacion']) ? 'mod_logpuntoventa.dat_areaventaagrupacion' : 'mod_logpuntoventa.dat_areaventanaturaleza';
                $conn = Zend_Registry::get('conexion');
                $query = "(SELECT {$campo} FROM {$tabla}
                WHERE (idareaventa = {$idareaventa} AND idreferencia IS NOT null))";
                $arrNat = $conn->fetchColumn($query);
                $inEnviado = implode($arrNat, ',');
            }
        }

        $orderBy = "denominacion asc";
        $all = ($params['onlyadd']) ? false : true;
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        if ($params['agrupacion']) {
            $query = Doctrine_Query::create()->select('*')->from('DatNaturalezaAgrupacion');
            if ($params['idareaventa']) {
                if ($params['typesync'] > 0) {
                    $query->addWhere("idnaturalezaagrupacion IN (SELECT av.idagrupacion FROM DatAreaventaAgrupacion av WHERE av.idareaventa = {$idareaventa} and av.idreferencia is null)");
                } else {
                    $query->addSelect("(CASE WHEN (idnaturalezaagrupacion IN (SELECT av.idagrupacion FROM DatAreaventaAgrupacion av WHERE av.idareaventa = {$idareaventa} )) THEN 1 ELSE 0 END) as activo");
                    if ($inEnviado) {
                        $query->addSelect("(CASE WHEN (idnaturalezaagrupacion IN ({$inEnviado})) THEN 1 ELSE 0 END) as enviado");
                    }
                }
            }
        } else {
            $params['dql'] = 1;
            $query = $obj->obtenerDatosArbolNaturaleza($params);
            $query->addSelect("coalesce(codigo,'')||'-'||denominacion as denominacion");
            if ($params['criterio']) {
                $query->addWhere("denominacion ILIKE '%{$params['criterio']}%' ");
            }
            if ($params['idareaventa']) {
                $all = false;
                if ($params['typesync'] > 0) {
                    $query->addWhere("idnaturaleza IN (SELECT av.idnaturaleza FROM DatAreaventaNaturaleza av WHERE av.idareaventa = {$idareaventa} and av.idreferencia is null)");
                } else {
                    $query->addSelect("(CASE WHEN (idnaturaleza IN (SELECT av.idnaturaleza FROM DatAreaventaNaturaleza av WHERE av.idareaventa = {$idareaventa} )) THEN 1 ELSE 0 END) as activo");
                    if ($inEnviado) {
                        $query->addSelect("(CASE WHEN (idnaturaleza IN ({$inEnviado})) THEN 1 ELSE 0 END) as enviado");
                    }
                    $orderBy = "activo desc,codigo asc";
                }
            }
            if ($params['idpadre']) {
                $all = false;
                $idpadre = $params['idpadre'];
                $wherePadre = "WHERE nat.idpadre = {$idpadre}";
            }
            if ($all) {
                $query->addWhere("idnaturaleza NOT IN (SELECT n.idnaturaleza FROM DatNaturalezaVenta n Where idpadre = {$params['idpadreAdd']})");
            } else {
                $query->addWhere("idnaturaleza IN (SELECT nat.idnaturaleza FROM DatNaturalezaVenta nat $wherePadre)");
            }
        }

        $conn = Zend_Registry::get('conexion');
        $tiempos = "(SELECT dte.idnaturaleza,dte.idtiempolimite as idtiempogarantia,
        dte.limitecantidad||'-'||nt.denominacion  as limventa
        FROM mod_logpuntoventa.dat_naturalezaventa dte INNER JOIN mod_logpuntoventa.nom_tiempo nt
        ON dte.idtiempolimite=nt.idtiempo)";

        $alltiempos = $conn->fetchAll($tiempos);
        $conn = Zend_Registry::get('conexion');
        $denominacionTiempos = "(SELECT nt.denominacion as denominacion,dte.idnaturaleza,dte.idtiempogarantia as idtiempogarantia
        FROM mod_logpuntoventa.dat_naturalezaventa dte INNER JOIN mod_logpuntoventa.nom_tiempo nt
        ON dte.idtiempogarantia=nt.idtiempo)";
        $alldenominacionTiempos = $conn->fetchAll($denominacionTiempos);

        return array('cantidad' => $query->count(), 'datos' => $query->offset($start)->limit($limit)->orderBy("{$orderBy}")->fetchArray(),
            'tiempos' => $alltiempos, 'denominacionTiempos' => $alldenominacionTiempos);
    }

    public function devolverNaturalezasSincronizar($params)
    {
        $naturalezas = "select nat.idnaturaleza as id,nat.codigo, nat.denominacion, ntv.idpadre, '' as descripcion,dv.enviado,
                        {$params['idareaventa']} as idareaventa, dv.idreferencia, (
                          select ava1.idreferencia from mod_logpuntoventa.dat_naturalezaagrupacion ag1
                          inner join mod_logpuntoventa.dat_areaventaagrupacion ava1 on ava1.idagrupacion = ag1.idnaturalezaagrupacion
                          where ag1.idnaturalezaagrupacion = ntv.idpadre and ava1.idareaventa = {$params['idareaventa']} limit 1
                        ) as idreferenciapadre
                        from mod_logpuntoventa.dat_areaventanaturaleza dv
                        inner join mod_logpuntoventa.dat_naturalezaventa ntv on ntv.idnaturaleza = dv.idnaturaleza
                        inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = dv.idnaturaleza
                        where dv.idareaventa = {$params['idareaventa']} and nat.estado = 1 and dv.idreferencia is null
                        group by nat.idnaturaleza,nat.codigo, nat.denominacion, ntv.idpadre,dv.enviado,dv.idreferencia
                        having (case when nat.idnaturaleza = nat.idpadre then 1 else 0 end) = 1";
        $agrupacion = "select ag.idnaturalezaagrupacion as id,'' as codigo, ag.denominacion,0 as idpadre, coalesce(ag.descripcion,''),
                        ag.enviado, {$params['idareaventa']} as idareaventa, ava.idreferencia, 2 as idreferenciapadre
                         from mod_logpuntoventa.dat_naturalezaagrupacion ag
                         inner join mod_logpuntoventa.dat_areaventaagrupacion ava on ava.idagrupacion = ag.idnaturalezaagrupacion
                         where ava.idareaventa = {$params['idareaventa']} and ava.idreferencia is null";

        if (!$params['tpv']) {
            $sql = "select t.* from ( $naturalezas union $agrupacion) as t where t.idreferencia is null order by t.idpadre, t.denominacion";
            return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $agrupacion .= " order by ag.denominacion";
            $listAgrupacion = $this->doctrineHelper->getConnection()->execute($agrupacion)->fetchAll(PDO::FETCH_ASSOC);
            $naturalezas .= " order by nat.denominacion";
            $listNaturalezas = $this->doctrineHelper->getConnection()->execute($naturalezas)->fetchAll(PDO::FETCH_ASSOC);
            return array_merge($listAgrupacion, $listNaturalezas);
        }

    }

    public function adicionarNaturaleza($params, $obj)
    {
        if ($params['datos']) {
            $arrNatCollection = new Doctrine_Collection('DatNaturalezaVenta');
            foreach ($params['datos'] as $value) {
                $natura = new DatNaturalezaVenta();
                $natura->synchronizeWithArray($value);
                $natura->idpadre = $params['idpadre'];
                $arrNatCollection->add($natura);
            }
            $arrNatCollection->save();
        } else {
            $natura = new DatNaturalezaAgrupacion();
            $natura->synchronizeWithArray($params);
            $natura->save();
        }

        return true;
    }

    public function activarNaturaleza($params)
    {
        if ($params['datos'] && $params['activo']) {
            $arrNatCollection = new Doctrine_Collection('DatAreaventaNaturaleza');
            foreach ($params['datos'] as $value) {
                $natura = new DatAreaventaNaturaleza();
                $natura->synchronizeWithArray($value);
                $natura->idareaventa = $params['idareaventa'];
                $arrNatCollection->add($natura);
            }
            $arrNatCollection->save();
        } elseif ($params['datos'] && !$params['activo']) {
            foreach ($params['datos'] as $value) {
                $arrNat[] = $value['idnaturaleza'];
            }
            return Doctrine_Query::create()->delete('DatAreaventaNaturaleza')->whereIn('idnaturaleza', $arrNat)
                ->addWhere('idareaventa = ?', array($params['idareaventa']))->execute();
        }

        return true;
    }

    public function activarAgrupacion($params)
    {
        if ($params['datos'] && $params['activo']) {
            $arrNatCollection = new Doctrine_Collection('DatAreaventaAgrupacion');
            foreach ($params['datos'] as $value) {
                $natura = new DatAreaventaAgrupacion();
                $natura->synchronizeWithArray($value);
                $natura->idareaventa = $params['idareaventa'];
                $arrNatCollection->add($natura);
            }
            $arrNatCollection->save();
        } elseif ($params['datos'] && !$params['activo']) {
            foreach ($params['datos'] as $value) {
                $arrNat[] = $value['idagrupacion'];
            }
            return Doctrine_Query::create()->delete('DatAreaventaAgrupacion')->whereIn('idagrupacion', $arrNat)
                ->addWhere('idareaventa = ?', array($params['idareaventa']))->execute();
        }

        return true;
    }

    public function actualizarPrecios($params)
    {
        $fechacontable = "'" . $this->global->FechaContable->fecha . "'";

        if ($params['idareaventa'] != null) {
            $datos['success'] = Doctrine_Manager::connection()->fetchAll("select * from
                    mod_logpuntoventa.f_actualizarpreciosventa ({$params['idareaventa']},{$fechacontable})");
            return $datos;
        } else {
            $sql = "select av.idareaventa from mod_logpuntoventa.dat_areaventa av
            inner join mod_logpuntoventa.dat_caja c on c.idareaventa = av.idareaventa
            where av.idestructuracomun = {$this->global->Estructura->idestructura}";
            $datosArea = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            foreach ($datosArea as $params) {
                $datos['success'] = Doctrine_Manager::connection()->fetchAll("select * from
                    mod_logpuntoventa.f_actualizarpreciosventa ({$params['idareaventa']},{$fechacontable})");
            }
            return $datos['success'] = true;
        }
    }

    public function guardarTiemposCantidads($params)
    {
        $arrDatNaturalezaVenta = new Doctrine_Collection('DatNaturalezaVenta');

        foreach ($params['idnaturaleza'] as $n) {

            $idn = $n['idnaturaleza'];
            $existidnat = Doctrine_Manager::connection()->fetchAll(
                "select * from mod_logpuntoventa.dat_naturalezaventa where idnaturaleza={$idn}");

            if (empty($existidnat)) {
                $naturalezaVenta = new DatNaturalezaVenta();
                $naturalezaVenta->idtiempogarantia = ($n['idtiempogarantia'])?$n['idtiempogarantia']:null;
                $naturalezaVenta->limitecantidad = ($n['cantidaddiaslimventa'])?$n['cantidaddiaslimventa']:null;
                $naturalezaVenta->idtiempolimite = ($n['idtiempo'])?$n['idtiempo']:null;
                $naturalezaVenta->idnaturaleza = $idn;
                $arrDatNaturalezaVenta->add($naturalezaVenta);
                $arrDatNaturalezaVenta->save();
            } else {
                $query = Doctrine_Query::create();
                $query->update('DatNaturalezaVenta dte');
                if ($params['cantidaddiaslimventa']) {
                    $query->set("dte.limitecantidad", $params['cantidaddiaslimventa']);
                }
                if ($params['idtiempo']) {
                    $query->set("dte.idtiempolimite", $params['idtiempo']);
                }
                if ($params['idtiempogarantia']) {
                    $query->set("dte.idtiempogarantia", $params['idtiempogarantia']);
                }
                $query->where("dte.idnaturaleza = ?", $idn)->execute();
            }
        }

        return true;
    }

    public function cargarTiemposCantidads($params)
    {
        $conn = Zend_Registry::get('conexion');
        $query = "(SELECT dte.idtiempogarantia as idtiempo,dte.limitecantidad as cantidaddiaslimventa,dte.idtiempolimite as idtiempogarantia,
            dte.limitecantidad||'-'||nt.denominacion  as limventa
            FROM mod_logpuntoventa.dat_naturalezaventa dte INNER JOIN mod_logpuntoventa.nom_tiempo nt
            ON dte.idtiempolimite=nt.idtiempo
            WHERE idnaturaleza = {$params['idnaturaleza']})";

        $data = $conn->fetchAll($query);

        return array('datos' => $data);
    }

    public function eliminarTiemposCantidads($params)
    {
        foreach ($params['idnaturaleza'] as $p) {
            Doctrine_Query::create()->update('DatNaturalezaVenta')
                    ->set('idtiempogarantia','NULL')
                    ->set('limitecantidad','NULL')
                    ->set('idtiempolimite','NULL')
                    ->where('idnaturaleza = ?', [$p['idnaturaleza']])->execute();
        }

        return true;

    }

    public function asociarAreaCaja($idestructura)
    {
        return Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logpuntoventa.f_relacionarareaventacaja($idestructura) q"
        );
    }

    public function aplicarConfiguracion($params)
    {
        if (isset($params['apicr'])) {
            $sql = "with s as (
            select * from mod_logpuntoventa.dat_areaventa where idareaventa = {$params['idareaventa']}
            )
            UPDATE mod_logpuntoventa.dat_areaventa ar
            SET
              idinfoconexioncr = s.idinfoconexioncr
            from s
            WHERE
              ar.idareaventa in (select distinct av.idareaventa from mod_logpuntoventa.dat_areaventa av
              inner join mod_logpuntoventa.dat_caja cj on cj.idareaventa = av.idareaventa
            where cj.idtiporegistradora is not null and cj.idtiporegistradora <> 0 and
            av.idinfoconexioncr is null and av.idestructuracomun = {$params['idestructura']})";
        } else {
            $sql = "with s as (
            select * from mod_logpuntoventa.dat_areaventa where idareaventa = {$params['idareaventa']}
            )
            UPDATE mod_logpuntoventa.dat_areaventa av
            SET
              idcliente = s.idcliente,
              idmodopago = s.idmodopago,
              idtipoprecio = s.idtipoprecio,
              idmoneda = s.idmoneda,
              idnomoperaciones = s.idnomoperaciones,
              idnomoperaciondev = s.idnomoperaciondev
            from s
            WHERE
              av.idareaventa in (select idareaventa from mod_logpuntoventa.dat_areaventa
            where idcliente is null and idmodopago is null
            and idtipoprecio is null and idmoneda is null
            and idnomoperaciones is null and idestructuracomun = {$params['idestructura']})";
        }
        $this->doctrineHelper->getConnection()->fetchAll($sql);
        return true;
    }

    public function asociarUsuarioACaja($params)
    {
        $sql = "INSERT INTO mod_logpuntoventa.dat_cajausuario(idcaja,idusuario)
                select c.idcaja,{$params['idusuario']} from mod_logpuntoventa.dat_caja c
                where c.idcaja in ({$params['datos']})
                and c.idcaja not in (select idcaja from mod_logpuntoventa.dat_cajausuario where idusuario = {$params['idusuario']});";
        $this->doctrineHelper->getConnection()->fetchAll($sql);
        return true;
    }

    public function cargarConceptos($params)
    {
        $respuesta = array();
        switch ($params['concepto']) {
            case 'estructura':
                $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
                foreach ($estructuras as &$est) {
                    $activo = $this->doctrineHelper->getConnection()->execute("
                              select count(idcentroentregaalmacen) from mod_logpuntoventa.dat_centroentregaalmacen
                              where idareaventa = {$params['idareaventa']} and idestructura = {$est->idestructura}
                              ")->fetchAll(PDO::FETCH_COLUMN);
                    $est->activo = ($activo[0] > 0) ? 1 : 0;
                }
                $respuesta = array('datos' => $estructuras, 'cantidad' => count($estructuras));
                break;
            case 'deposito':
                $corriente = ($params['idestructura'] == -1) ? true : false;
                $params['idestructura'] = ($params['idestructura'] == -1) ? $this->global->Estructura->idestructura : $params['idestructura'];
                $filtro = $params['criterio'];
                $almacenes = $this->estructuraHelper->obtenerEstructurasNoFormales(
                    $this->global->perfil->iddominio, $params['idestructura'], $filtro, $params['limit'], $params['start']
                );
                foreach ($almacenes as &$almacen) {
                    $almacen['denominacion'] = $almacen['DatEstructuraop'][0]['codigo'] . ' - ' . $almacen['text'];
                    $almacen['iddeposito'] = $almacen['DatEstructuraop'][0]['idestructuraop'];
                    if ($corriente) {
                        $activo = $this->doctrineHelper->getConnection()->execute("
                              select count(idareacorriente) from mod_logpuntoventa.dat_areaventacorriente
                              where idareaventa = {$params['idareaventa']} and iddeposito = {$almacen['iddeposito']}
                              ")->fetchAll(PDO::FETCH_COLUMN);
                    } else {
                        $activo = $this->doctrineHelper->getConnection()->execute("
                              select count(idcentroentregaalmacen) from mod_logpuntoventa.dat_centroentregaalmacen
                              where idareaventa = {$params['idareaventa']} and idestructura = {$params['idestructura']}
                              and iddeposito = {$almacen['iddeposito']}
                              ")->fetchAll(PDO::FETCH_COLUMN);
                    }
                    $almacen['activo'] = ($activo[0] > 0) ? 1 : 0;
                }
                $total = count(
                    $this->estructuraHelper->obtenerEstructurasNoFormales(
                        $this->global->perfil->iddominio, $params['idestructura'], $filtro
                    )
                );
                $respuesta = array('datos' => $almacenes, 'cantidad' => $total);
                break;
            case 'municipio':
                $where = ($params['otradenominacion']) ? " and p.provincia = '{$params['otradenominacion']}' " : "";
                $municipios = $this->doctrineHelper->getConnection()->execute("
                              select p.id_state as idmunicipio, p.provincia as otradenominacion, p.municipio as denominacion,
                              (case when reg.idestructura is not null then 1 else 0 end) as activo
                               from mod_logpuntoventa.dat_provinciamunicipio p
                               left join mod_logpuntoventa.dat_almacenregion reg on reg.id_state = p.id_state and reg.idestructura = {$params['iddeposito']} and reg.idareaventa = {$params['idareaventa']}
                               /*where p.id_state not in (
                                select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                                where ar.idestructura <> {$params['iddeposito']} and ar.idareaventa = {$params['idareaventa']}
                               )*/ {$where}
                               order by p.provincia, p.municipio
                              ")->fetchAll(PDO::FETCH_ASSOC);
                $respuesta = array('datos' => $municipios, 'cantidad' => count($municipios));
                break;
        }
        return $respuesta;
    }

    public function eliminarNaturaleza($params)
    {
        $naturalezasArray = array();
        if (count($params['datos']) && $params['idpadre']) {
            foreach ($params['datos'] as $nat) {
                array_push($naturalezasArray, $nat['idnaturaleza']);
            }
            $naturalezas = implode(',', $naturalezasArray);
            $this->doctrineHelper->getConnection()->execute(
                "delete from mod_logpuntoventa.dat_naturalezaventa
                     where idnaturaleza in ({$naturalezas}) and idpadre = {$params['idpadre']}"
            );
        }
        return true;
    }

    public function obtenerProvincias()
    {
        $provincias = $this->doctrineHelper->getConnection()->execute("
                              select distinct p.provincia as otradenominacion
                               from mod_logpuntoventa.dat_provinciamunicipio p
                              ")->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $provincias);
    }

    public function cargarCondicionPago($idcliente)
    {
        $datos = $this->_serviciosConfiguracionGeneral->getClientesProveedorByParams($idcliente);
        $result = array();
        foreach ($datos['datos'][0]['cobrospagos'] as $dat) {
            if ($dat['idclasificacion'] == 1) {
                array_push($result, array("idcondicionpago" => $dat['idterminodepago'], "denominacion" => $dat['nombreterminodepago']));
            }
        }
        return array('datos' => $result, 'cantidad' => count($result));
    }

    public function cargarCajero($params)
    {
        $params['cajero'] = true;
        return $this->getCajeroAll($params);
    }

    public function getCajeroAll($params)  {
        $query = Doctrine_Query::create()->select('*')->from('DatCajero dc');
        $this->doctrineHelper->addQueryLimits($query, $params);
        if($params['criterio']) {
            $query->addWhere(" lower(cast(dc.idcajero as varchar)) like lower('%{$params['criterio']}%') "
                . "or lower(dc.denominacion) ilike lower('%{$params['criterio']}%')");
        }
        $query->addWhere('dc.idestructuracomun = ?', array($this->global->Estructura->idestructura));
        $result  =$query->fetchArray();
        $cantidad = $query->count();

        return [
            'cantidad' => $cantidad,
            'datos' => $result
        ];
    }

    public function adicionarCajero($params)
    {
        $cajero = new DatCajero();
        $params['datos']['idestructuracomun'] = $this->global->Estructura->idestructura;
        if ($params['datos']['idcajero']) {
            $cajero->assignIdentifier($params['datos']['idcajero']);
        }
        $cajero->synchronizeWithArray($params['datos']);
        $cajero->save();
    }

    public function deleteCajero($params)
    {
        return Doctrine_Query::create()->delete()->from('DatCajero')->whereIn('idcajero', $params)->execute();
    }

    public function getCajasEntidad($idestructura)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select ntp.denominacion as caja, ntp.idtipocaja
                from mod_logpuntoventa.nom_tipocaja ntp
                inner join mod_logpuntoventa.dat_tipocajaoentidad dtce ON dtce.idtipocaja = ntp.idtipocaja
                where dtce.idestructuracomun = {$idestructura}";
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $nompos = new NomPos();
        return $nompos->buscar($obj, $arrIdsInsertados, $returnobj = false);
    }

    public function insertarNomenclador($array, $returnobj = false)
    {
        $nompos = new NomPos();
        return $nompos->insertarNomenclador($array, $returnobj = false);
    }

    public function modificarNomenclador($array, $returnobj = false)
    {
        $nompos = new NomPos();
        return $nompos->modificarNomenclador($array, $returnobj = false);
    }

    public function habilitarDesabiltarEntidad($array)
    {
        $nompos = new NomPos();
        return $nompos->habilitarDesabiltarEntidad($array, $this->global->Estructura->idestructura);
    }

    public function eliminarNomenclador($array, $modificar)
    {
        $nompos = new NomPos();
        return $nompos->eliminarNomenclador($array, $modificar);
    }

    public function activarNomenclador($array)
    {
        $nompos = new NomPos();
        return $nompos->activarNomenclador($array);
    }

    public function cargarProductoError($params) {
        $resultError = Doctrine_Manager::connection()->execute("
          SELECT pe.*, ni.denominacion as denominacionproducto, ni.numeropieza as codigoproducto, nih.codigobarra
            FROM mod_logpuntoventa.tmp_productosventasprecio pe
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = pe.idindicador
            inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
            where pe.idpedidotienda in (".implode(',', $params['idpedidos']).")
        ")->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $resultError, 'total' => count($resultError));
    }

    public function cargarLotesProducto($params) {
        //COUNT(*) OVER() as total
        $result = Doctrine_Manager::connection()->execute("
            select  ppl.idprecioslotes, l.idlote, l.numero as nrolote, ppl.precioventa from mod_logpuntoventa.dat_productolote ppl
            inner join mod_logistica.dat_lote l on l.idlote = ppl.idlote
            inner join mod_logpuntoventa.dat_preciolotes pl on pl.idprecioslotes = ppl.idprecioslotes
            where l.idproducto = {$params['idproducto']}
        ")->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $result, 'total' => (count($result) ? $result[0]['total'] : 0));
    }

    public function modificarPreciosLotes($lotes) {
        foreach ($lotes as $l) {
            $contar = "select distinct pl.idlote from mod_logpuntoventa.dat_productolote pl 
                      where pl.idprecioslotes = {$l->idprecioslotes}";
            $lotes = Doctrine_Manager::connection()->execute($contar)->fetchAll(PDO::FETCH_COLUMN);
            if (count($lotes) == 1) {
                $sql = "update mod_logpuntoventa.dat_preciolotes
                          set precioventa = {$l->precioventa}, preciobase = {$l->precioventa}
                          where idprecioslotes = ?
                          ";
                Doctrine_Manager::connection()->fetchAll(
                    $sql, array($l->idprecioslotes)
                );
                $sql = "update mod_logpuntoventa.dat_productolote
                          set precioventa = {$l->precioventa}, preciobase = {$l->precioventa}
                          where idprecioslotes = ?
                          ";
                Doctrine_Manager::connection()->fetchAll(
                    $sql, array($l->idprecioslotes)
                );
            } else {
                Doctrine_Manager::connection()->fetchAll(
                    "delete from mod_logpuntoventa.dat_productolote where idprecioslotes = ? and idlote = ?", array($l->idprecioslotes, $l->idlote)
                );
                Doctrine_Manager::connection()->fetchAll(
                    "with precioslotes AS (
                        INSERT INTO 
                          mod_logpuntoventa.dat_preciolotes
                        (
                          preciobase,
                          precioventa,
                          fecha,
                          idproducto
                        )
                        VALUES (
                          {$l->precioventa},
                          {$l->precioventa},
                          now(),
                          (select pl.idproducto from mod_logistica.dat_lote pl where pl.idlote = {$l->idlote} limit 1)
                        ) returning idprecioslotes, idproducto
                    ) INSERT INTO 
                      mod_logpuntoventa.dat_productolote
                    (
                      idlote,
                      idproducto,
                      preciobase,
                      precioventa,
                      fecha,
                      idprecioslotes
                    )
                    select {$l->idlote}, idproducto, {$l->precioventa}, {$l->precioventa}, now(), idprecioslotes from precioslotes;"
                );
            }
        }
        return array('success' => true);
    }
}
