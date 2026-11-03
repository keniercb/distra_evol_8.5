<?php

/**
 *  Esta clase gestiona las facturas emitidas
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class ReporteVentasModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getReportes()
    {
        $conn = Zend_Registry::get('conexion');
        $selec = "Select r.*";
        $from = " FROM  mod_logfacturacion.conf_reporteventa r";
        $where = " ";
        //$where = " Where  r.idestructuracomun = {$this->global->Estructura->idestructura}";
        $limit = "";
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec. $from. $where)
            ->fetchAll(PDO::FETCH_ASSOC);

        $result = $conn->execute($selec.$from.$where. " order by r.denominacion")->fetchAll();

        return array('datos'=>$result, 'cantidad'=>count($total));
    }

    public function getEstructuras() {
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }

    public function cargarProductosNaturaleza($params) {
        $conn = Zend_Registry::get('conexion');
        $operacion = "";
        if ($params['idoperacion']) {
            $operacion = " and dd.idoperacion in ({$params['idoperacion']}) ";
            $operacion1 = " and dd1.idoperacion in ({$params['idoperacion']}) ";
        }
        $selec = "select q.* from (select DISTINCT ni.idindicador, ni.codigo, ni.numeropieza
                ,ni.denominacion, nat.denominacion as naturaleza, nat.idnaturaleza, 
                (select array_to_string(array_agg(dff.nrofactura),', ') from mod_logfacturacion.dat_docfactura dff 
                where dff.idfactura in (
                select distinct dm1.iddocumento from mod_logistica.dat_producto dp1
                inner join mod_logistica.dat_movimiento dm1 on dm1.idproducto = dp1.idproducto
                inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
                inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dm1.iddocumento
                inner join mod_logfacturacion.dat_docfactura df1 on df1.idfactura = dd1.iddocumento
                inner join mod_datosmaestros.nom_naturaleza nat1 on nat1.idnaturaleza = ni1.idnaturaleza
                where dd1.estado = 4 and dd1.fechacontable >= '{$params['desde']}' and dd1.fechacontable <= '{$params['hasta']}'
                and dd1.idestructuracomun in ({$params['idestructura']}) {$operacion1} and ni1.idindicador = ni.idindicador
                )) as nrofacturas 
                from mod_logistica.dat_producto dp
                inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
                where dd.estado = 4 and dd.fechacontable >= '{$params['desde']}' and dd.fechacontable <= '{$params['hasta']}'
                and dd.idestructuracomun in ({$params['idestructura']}) {$operacion} and ni.idnaturaleza not in 
                (select drn.idnaturaleza from mod_logfacturacion.dat_reportenaturaleza drn where drn.idestructuracomun in ({$params['idestructura']}))
                union 
                select DISTINCT ni.idindicador, ni.codigo, ni.numeropieza
                ,ni.denominacion, nat.denominacion as naturaleza, nat.idnaturaleza, 
                (select array_to_string(array_agg(dff.nrofactura),', ') from mod_logfacturacion.dat_docfactura dff 
                where dff.idfactura in (
                select distinct dd1.iddocumento from mod_logfacturacion.dat_elementosfactura dp1
                inner join mod_logfacturacion.dat_prodservnomenclador dm1 on dm1.idelementofactura = dp1.idelementofactura
                inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dm1.idindicador
                inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dp1.idfactura
                inner join mod_logfacturacion.dat_docfactura df1 on df1.idfactura = dd1.iddocumento
                inner join mod_datosmaestros.nom_naturaleza nat1 on nat1.idnaturaleza = ni1.idnaturaleza
                where dd1.estado = 4 and dd1.fechacontable >= '{$params['desde']}' and dd1.fechacontable <= '{$params['hasta']}'
                and dd1.idestructuracomun in ({$params['idestructura']}) {$operacion1} and ni1.idindicador = ni.idindicador
                )) as nrofacturas from mod_logfacturacion.dat_elementosfactura dp
                inner join mod_logfacturacion.dat_prodservnomenclador dm on dm.idelementofactura = dp.idelementofactura
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm.idindicador
                inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.idfactura
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
                where dd.estado = 4 and dd.fechacontable >= '{$params['desde']}' and dd.fechacontable <= '{$params['hasta']}'
                and dd.idestructuracomun in ({$params['idestructura']}) {$operacion} and ni.idnaturaleza not in 
                (select drn.idnaturaleza from mod_logfacturacion.dat_reportenaturaleza drn where drn.idestructuracomun in ({$params['idestructura']}))) as q order by q.naturaleza";
        $limit = " offset 0 limit 30";
        if($params['limit']) {
            $limit = " offset {$params['start']} limit {$params['limit']}";
        }
        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec)
            ->fetchAll(PDO::FETCH_ASSOC);

        $result = $conn->execute($selec.$limit)->fetchAll(PDO::FETCH_ASSOC);
        foreach($result as &$r){
            $r['facturas'] = '<p><table style="color: #006400"><tr><td width="80"></td><td width="600"><p><b>Facturas</b></p></td>';
            $r['facturas'] .= '<tr><td width="80"></td><td width="600"><p>'.$r['nrofacturas'].'</p></td></tr>';
            $r['facturas'] .= '</table></p>';
        }

        return array('datos'=>$result, 'cantidad'=>count($total));
    }

    public function cargarProductosPrecios($params) {
        $start = ($params['start']) ?: 0;
        $limit = ($params['limit']) ?: 30;
        $prod = Doctrine_Manager::connection()->execute(
            "select *, count(*) OVER() as total from mod_logfacturacion.f_getproductosprecioventasector({$params['iddeposito']},null,{$params['idtipoprecio']},{$params['idmoneda']},{$this->global->Estructura->idestructura},{$params['idsector']}) offset {$start} limit {$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos'=>$prod, 'cantidad'=>$prod[0]['total']);
    }
}
