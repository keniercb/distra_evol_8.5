<?php

class DocMedClienteModel extends ZendExt_Model
{

    public function DocMedClienteModel()
    {
        parent::ZendExt_Model();
    }

    /*     * ----------------------Guardar clientes de un documento-------------* */
    public function guardar($iddocumento, $idmedicioncliente)
    {
        $obj = new DocMedCliente();
        $obj->iddocumento = $iddocumento;
        $obj->idmedicioncliente = $idmedicioncliente;
        $obj->save();
        return true;
    }

    /*     * ---------------Modificar un Medicion  de documento----------------* */
    public static function modificar($datos, $cantidad)
    {
        try {
            $q = Doctrine_Query::create()
                ->update('DocMedCliente')
                ->set('cantidad', $cantidad)
                ->where("iddocumento = ? and idmedicioncliente = ?", $datos);
            return $q->execute();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    /*     * ---------------Actualizar un conjunto de mediciones --------------* */
    public function actualizar($medicion)
    {
        $medcliente = new MedClienteModel();
        $datosMedCliente['medicion'] = $medicion->medicion;
        $datosMedCliente['fechamedicion'] = $this->global->FechaContable->fecha;
        $this->modificar(array($medicion->iddocumento, $medicion->idmedicioncliente), $medicion->cantidad);
        $medcliente->modificar($medicion->idmedicioncliente, $datosMedCliente);
        $hismedicion = Doctrine::getTable('HisMedicion')
            ->findByDql(
                'idmedicioncliente = ' . $medicion->idmedicioncliente
            );
        $hismedicion[0]->fechamedicion = $datosMedCliente['fechamedicion'];
        $hismedicion[0]->consumo = $medicion->medicion;
        $hismedicion->save();
        return true;
    }

    /*     * --------------------Listar las lecturas de un documento -----------------------* */
    public function listar($params)
    {
        $result = array();
        $datos = DocMedCliente::listar($params);
        if ($params['confirmar']) {
            return $datos;
        }
        $key = 0;
        foreach ($datos['datos'] as $fila) {
            $data = HisMedicion::getFechaUltimaLectura($fila['MedCliente']['idcontrato'], $fila['idmedicioncliente']);
            //$data = HisMedicion::getDataByIdmedicionCliente($fila['idmedicioncliente']);
            $contratos = $this->integrator->contratacion->obtenerContratosXIdcontrato(
                array($fila['MedCliente']['idcontrato'])
            );
            $contrato = $contratos['resultado'][0];
            if ((!$params['cliente'] || mb_stristr($contrato['cliente'], $params['cliente']) !== false) &&
                (!$params['codigo'] || mb_stristr(
                        $contrato['codigocliente'], $params['codigo']
                    ) !== false)
            ) {
                if (($params['codigocontrato']) && ($params['codigocliente'])) {
                    if ((strpos($contrato['codigocontrato'], $params['codigocontrato']) != null) && (strpos(
                                $contrato['codigocliente'], $params['codigocliente']
                            ) != null)
                    ) {
                        $array = $this->auxiliarListarConsumidores($result, $key, $fila, $contrato, $params, $data);
                        $result = $array[0];
                        $key = $array[1];
                    }
                } else {
                    if (($params['codigocontrato'])) {
                        if ((strpos($contrato['codigocontrato'], $params['codigocontrato']) != null)) {
                            $array =
                                $this->auxiliarListarConsumidores($result, $key, $fila, $contrato, $params, $data);
                            $result = $array[0];
                            $key = $array[1];
                        }
                    } else {
                        if (($params['codigocliente'])) {
                            if ((strpos($contrato['codigocliente'], $params['codigocliente']) != null)) {
                                $array = $this->auxiliarListarConsumidores(
                                    $result, $key, $fila, $contrato, $params, $data
                                );
                                $result = $array[0];
                                $key = $array[1];
                            }
                        } else {
                            $array =
                                $this->auxiliarListarConsumidores($result, $key, $fila, $contrato, $params, $data);
                            $result = $array[0];
                            $key = $array[1];
                        }
                    }
                }
            }
        }
        return array('cantidad' => $datos['cantidad'], 'datos' => $result);
    }

    public function auxiliarListarConsumidores($result, $key, $fila, $contrato, $params, $data)
    {
        $result[$key]['codigocliente'] = $contrato['codigocliente'];
        $result[$key]['cliente'] = $contrato['cliente'];
        $result[$key]['iddocumento'] = $fila['iddocumento'];
        $result[$key]['idmedicioncliente'] = $fila['idmedicioncliente'];
        $result[$key]['cantidad'] = $fila['cantidad'];
        $result[$key]['importe'] = $fila['importe'];
        $precio = $this->obtenerPrecio($params['idindicador']);
        $result[$key]['precioventa'] = ($precio['precioventa']) ? $precio['precioventa'] : 0;
        $result[$key]['preciopromedio'] = ($precio['preciopromedio']) ? $precio['preciopromedio'] : 0;
        $result[$key]['idcontrato'] = $fila['MedCliente']['idcontrato'];
        $result[$key]['fechamedicion'] = ($data[0]['fechamedicion']) ? $data[0]['fechamedicion'] : '-';
        $result[$key]['medicion'] = ($data[0]['consumo']) ? $data[0]['consumo'] : 0;
        $result[$key]['nuevalectura'] = ($params['idestado'] != 3) ? $fila['MedCliente']['medicion'] : 0;
        $result[$key]['tipocontrato'] = $contrato['tipocontrato'];
        $result[$key]['codigocontrato'] = $contrato['codigocontrato'];
        $result[$key]['numerocontrato'] = $contrato['numerocontrato'];
        $key++;
        return array($result, $key);
    }

    /*     * ----------Obtener precio , tipoprecio -------------------------------------* */
    public function obtenerPrecio($idindicador)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('mpm.precioventa, p.preciopromedio')
                ->from('DatProducto p')
                ->leftJoin('p.DatMatrizprecio mp')
                ->leftJoin('mp.DatMatrizpreciodualmonetaria mpm')
                ->where('p.idprod =?', $idindicador);
            $result = $query->fetchArray();
            return $result;
            /*
              $sql = "SELECT mpm.precioventa, p.preciopromedio
              FROM mod_inventario.dat_producto p
              left join mod_logfacturacion.dat_matrizprecio mp on p.idprod = mp.idindicador
              left join mod_logfacturacion.dat_matrizpreciodualmonetaria mpm on mp.idmatrizprecio = mpm.idmatrizprecio
              where p.idprod = {$idindicador};";
              $con = Doctrine_Manager::getInstance()->connection();

              return $con->fetchRow($sql); */
        } catch (Exception $e) {
            return false;
        }
    }

    /*     * -----------Obtener clientes de un documento---------------------* */
    public function obtenerClientesXiddocumento($iddocumento, $idestructuracomun = null, $params)
    {
        $filtro = "";
        if ($idestructuracomun) {
            $filtro = " AND cpm.idestructuracomun = $idestructuracomun";
        }
        if ($idscontratos) {
            $filtro .= " AND m.idcontrato in ({$idscontratos})";
        }
        if ($params['accion'] == 'dc') {
            $filtro .= " and m.idcliente in ({$params['clientes']})";
        }
        $sql = "SELECT m.idcontrato, m.idcliente, m2.cantidad, md.idservicio, cpm.idoperacion as idoperServicio
                FROM mod_logfacturacion.dat_medidorcliente m 
                INNER JOIN mod_logfacturacion.dat_docmedicioncliente m2 ON m.idmedicioncliente = m2.idmedicioncliente 
                INNER JOIN mod_logfacturacion.dat_docmedicion md on md.iddocumento = m2.iddocumento
                INNER JOIN mod_logfacturacion.conf_productosmedidor cpm on md.idservicio = cpm.idservicio
                WHERE m2.iddocumento = $iddocumento $filtro";
        $conn = Zend_Registry::get('conexion');
        $a = $conn->execute($sql);
        return $a->fetchAll(PDO::FETCH_ASSOC);
    }

    /*     * ---------------Eliminar medicion de cliente-----------------------* */
    public function eliminarDocumentoMedicion($idmedicioncliente)
    {
        try {
            $q = Doctrine_Query::create()
                ->delete('DocMedCliente dmc')
                ->whereIn(
                    "dmc.idmedicioncliente", $idmedicioncliente
                );
            return $q->execute();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function eliminarDocMedicion($arrayIdMedCliente)
    {
        try {
            for ($i = 0; $i < count($arrayIdMedCliente); $i++) {
                $result = $this->eliminarDocumentoMedicion($arrayIdMedCliente[$i]);
                if (!$result) {
                    return false;
                }
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }
}