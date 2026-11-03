<?php
/**
 * Created by PhpStorm.
 * User: hero
 * time: 2/06/16
 * Time: 11:10
 */

function getMontoTipo($type, $start, $end)
{
    $conn_string = "host=10.12.170.138 port=5432 dbname=distra-beta user=zeolides password=zeolides*2012.,";
    $conn = pg_connect($conn_string);

    $date = array();

    if ($start) {
        $date[] = "fechafirma >= '$start'";
    }

    if ($end) {
        $date[] = "fechafirma <= '$end'";
    }

    if (count($date) > 0) {
        $date = 'AND ' . implode(' AND ', $date);
    } else {
        $date = '';
    }

    $query = "SELECT  a.numero as clientnumber, 
	a.denominacionclienteproveedor as clientname, 
	EXTRACT(epoch FROM a.fechafirma)*1000 as clienttime,
	a.montototal as clientamount
	FROM mod_crmcontratacion.dat_contrato a
	inner join mod_crmcontratacion.dat_tipocontrato as c
	on a.idtipocontrato=c.idtipocontrato
	WHERE denominacion='$type' AND a.cliente=1 AND a.fechafirma IS NOT NULL $date
	ORDER BY a.fechafirma";

    $result = pg_query($conn, $query);
    $clients = pg_fetch_all($result);
    if(count($clients)== 0)
        $clients = array();

    $query = "SELECT  a.numero as providernumber, 
	denominacionclienteproveedor as providername, 
	EXTRACT(epoch FROM a.fechafirma)*1000 as providertime,
	a.montototal as provideramount
	FROM mod_crmcontratacion.dat_contrato a
	inner join mod_crmcontratacion.dat_tipocontrato as c
	on a.idtipocontrato=c.idtipocontrato
	WHERE denominacion='$type' AND a.cliente=0 AND a.fechafirma IS NOT NULL $date
	ORDER BY a.fechafirma";

    $result = pg_query($conn, $query);
    $providers = pg_fetch_all($result);
    if(count($providers)== 0)
        $providers = array();

    $fn = function ($c, $p) {
        if (!is_array($c)) {
            $c = array(
                "clientnumber" => "",
                "clientname" => "",
                "clienttime" => null,
                "clientamount" => null
            );
        }
        if (!is_array($p)) {
            $p = array(
                "providernumber" => "",
                "providername" => "",
                "providertime" => null,
                "provideramount" => null
            );
        }
        return array_merge($c, $p);
    };

    $merged = array_map($fn, $clients, $providers);

    $result = new \StdClass();
    $result->rows = $merged;
    $result->success = true;
    echo json_encode($result);
}

$type = isset($_POST['type']) ? $_POST['type'] : false;
$startDate = isset($_POST['initDate']) ? $_POST['initDate'] : false;
$endtDate = isset($_POST['endDate']) ? $_POST['endDate'] : false;

getMontoTipo($type, $startDate, $endtDate);
