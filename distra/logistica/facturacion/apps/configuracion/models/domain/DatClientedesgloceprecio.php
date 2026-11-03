<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatClientedesgloceprecio extends BaseDatClientedesgloceprecio
{

    public function setUp()
    {
        parent::Setup();
        $this->hasOne(
            'DatTipoprecioEntidad',
            array(
                'local'   => 'idtipoprecioentidad',
                'foreign' => 'idtipoprecioentidad'
            )
        );
    }

    /**
     * Funcion que permite obtener los distintos tipos
     * de idcategoriaprecioentidad que existen
     *
     * @param array $params Arreglo con los parametros necesarios
     *                      para obtener las categorias de precios definidos
     *
     * @return array Retorna un arreglo con los idcategoriaprecioentidad
     */
    public function getResultByIdTipoprecio($params)
    {
        $conn = Doctrine_Manager:: connection();
        $and = "";
        if ($params['moneda']) {
            /*if ($params['moneda'] != -1) {
               $and = " and dcp.idcliente in (select dcm.idcliente from mod_logfacturacion.dat_clientemoneda dcm where dcm.idtipoprecio = {$params['idtipopreciocl']} and dcm.idmoneda = {$params['moneda']} and dcm.idestructura = {$params['idestructuracomun']}) "; 
            } else {
               $and = " and dcp.idcliente not in (select dcm.idcliente from mod_logfacturacion.dat_clientemoneda dcm where dcm.idtipoprecio = {$params['idtipopreciocl']} and dcm.idestructura = {$params['idestructuracomun']}) ";
            }*/
            if ($params['moneda'] != -1) {
                $and .= " and dcp.idcliente in (select dcm.idcliente from mod_logfacturacion.dat_clientemoneda dcm where dcm.idtipoprecio = {$params['idtipopreciocl']} and dcm.idmoneda = {$params['moneda']}) ";
            } else {
                $and .= " and dcp.idcliente not in (select dcm.idcliente from mod_logfacturacion.dat_clientemoneda dcm where dcm.idtipoprecio = {$params['idtipopreciocl']}) ";
            }
        }
        if ($params['texto']) {
            if ($params['texto'] != -1) {
                $and .= " and dcp.idcliente in (select dcr.idcliente from mod_logfacturacion.dat_clienteredondeo dcr where dcr.idtipoprecio = {$params['idtipopreciocl']} and dcr.redondear = 1) ";
            } else {
                $and .= " and dcp.idcliente not in (select dcr.idcliente from mod_logfacturacion.dat_clienteredondeo dcr where dcr.idtipoprecio = {$params['idtipopreciocl']}) ";
            }
        }
        /*$sql
            = "Select dcp.idcliente from mod_logfacturacion.dat_clientedesgloseprecio dcp
                inner join mod_logfacturacion.dat_tipoprecioentidad dpe
                on dpe.idtipoprecioentidad = dcp.idtipoprecioentidad
                where dpe.idestructuracomun = {$params['idestructuracomun']} "
            . "and dpe.idtipoprecio = {$params['idtipopreciocl']} {$and}";*/
        $sql
            = "Select distinct dcp.idcliente from mod_logfacturacion.dat_clientedesgloseprecio dcp
                where dcp.idtipoprecio = {$params['idtipopreciocl']} {$and}";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $datos;
    }

    public function getResultByIdCliente($params)
    {
        $conn = Doctrine_Manager:: connection();
        /*$sql = "Select dpe.idtipoprecio from mod_logfacturacion.dat_clientedesgloseprecio dcp
                inner join mod_logfacturacion.dat_tipoprecioentidad dpe
                on dpe.idtipoprecioentidad = dcp.idtipoprecioentidad
                where dpe.idestructuracomun = {$params['idestructuracomun']} " .
            "and dcp.idcliente = {$params['idcliente']}";*/
        $sql = "Select dcp.idtipoprecio from mod_logfacturacion.dat_clientedesgloseprecio dcp
                where dcp.idcliente = {$params['idcliente']}";
        $datos = $conn->execute($sql)
            ->fetchAll(PDO::FETCH_COLUMN);
        return $datos;
    }

    public function checkIfExist($idcliente, $idtipoprecio, $idestructura)
    {
        return Doctrine_Query::create()
            //->select('dcdp.idmoneda as idmoneda')
            ->from('DatClientedesgloceprecio dcdp')
            ->innerJoin('dcdp.DatTipoprecioEntidad dcpe')
            ->where(
                'dcdp.idcliente = ? and dcpe.idtipoprecio = ? and dcpe.idestructuracomun = ?', array($idcliente, $idtipoprecio, $idestructura)
            )
            ->fetchArray();
    }

    public function modifiedDesgloseCliente($params)
    {
        $result = new stdClass();
        $result->success = true;
        $result->codigoMsg = 1;
        if ($params['added']) {
            self::addDesgloseCliente($params);
        }
        if ($params['deleted']) {
            /*$tipoprecioentidad = $this->getIdTipoPrecEntByParams($params['idtipoprecio'], $params['idestructura']);
            $tipo = $tipoprecioentidad[0]['idtipoprecioentidad'];*/
            /*$datas = $this->getClientedesgloceprecioByIdTipo(
                $params['deleted'], $tipo
            );*/
            $datas = $this->getClientedesgloceprecioByIdTipo(
                $params['deleted'], $params['idtipoprecio']
            );
            $colleccion = new Doctrine_Collection('DatClientedesgloceprecio');
            foreach ($datas as $value) {
                $obj = new DatClientedesgloceprecio();
                $obj->assignIdentifier($value);
                $colleccion->add($obj);
            }
            $colleccion->delete();
        }
        return $result;
    }

    public function addDesgloseCliente($params)
    {
        $collection = new Doctrine_Collection('DatClientedesgloceprecio');
        foreach ($params['added'] as $value) {
            $desglose = new DatClientedesgloceprecio();
			/*$tipoprecioentidad = self::getIdTipoPrecEntByParams($params['idtipoprecio'],$params['idestructuracomun']);
            $tipo = $tipoprecioentidad[0]['idtipoprecioentidad'];
            $desglose->idtipoprecioentidad = $tipo;*/
            $desglose->idtipoprecio = $params['idtipoprecio'];
            $desglose->idcliente = $value;
            $collection->add($desglose);
        }
        $collection->save();
    }

    public function getIdTipoPrecEntByParams($idtipoprecio,$idestructuracomun)
    {
        $objNomenclador = new NomencladoresLogService();
        $params = array();
        $params['modelo'] = 'DatTipoprecioEntidad';
        $params['idnom'] = 'idtipoprecioentidad';
        $query = $objNomenclador->devolverTipoPrecio($params, true);
        return $query['query']->addWhere(
            'm.idtipoprecio =? and m.idestructuracomun =?', array($idtipoprecio,$idestructuracomun)
        )
            ->fetchArray();
    }

    public function getClientedesgloceprecioByIdTipo($arr, $idtipoprecio)
    {
        return Doctrine_Query::create()
            ->select(
                 'dcdp.idclientedesgloseprecio'
            )
            ->from('DatClientedesgloceprecio dcdp')
            //->where('dcdp.idtipoprecioentidad = ?', array($idtipoprecioentidad))
            ->where('dcdp.idtipoprecio = ?', array($idtipoprecio))
            ->andWhereIn(
                'dcdp.idcliente', $arr
            )
            ->fetchArray();
    }

    public function existsClienteDesglosePrecio($value)
    {
        $result = Doctrine_Query::create()
            ->select('dp.idcliente , dp.idclientedesgloseprecio as idclientedesgloseprecio')
            ->from('DatClientedesgloceprecio dp')
            ->where('dp.idclientedesgloseprecio=?', array($value))
            ->fetchArray();
        return $result;
    }

}
