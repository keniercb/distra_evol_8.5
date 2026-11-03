<?php
/**
 * Created by PhpStorm.
 * User: hero
 * Date: 2/06/16
 * Time: 11:10
 */

function getMontoTipo() {
    $query = "Select count(idcontrato), type from (
	Select b.denominacion as type, a.idcontrato
	from mod_crmcontratacion.dat_contrato as a 
	inner join mod_crmcontratacion.dat_tipocontrato as b
	on a.idtipocontrato=b.idtipocontrato
	) as c
group by c.type";

    $conn_string = "host=10.12.170.138 port=5432 dbname=distra-beta user=zeolides password=zeolides*2012.,";
    $conn = pg_connect($conn_string);
    $result = pg_query($conn, $query);
    $e = pg_fetch_all($result);
    $result = new \StdClass();
    $result->rows = $e;
    $result->success = true;
    echo json_encode($result);
}


//function getMontoTipo() {
//    $result = '{"rows":[{"count":"15","type":"AGENCIA"},{"count":"23","type":"Tipos de Contratos"},{"count":"13","type":"COMPRAVENTA"},{"count":"13","type":"PRESTACI\u00d3N DE SERVICIOS"},{"count":"12","type":"PERMUTA"},{"count":"25","type":"Contrato Marco"}],"success":true}';
//    echo $result;
//}
getMontoTipo();