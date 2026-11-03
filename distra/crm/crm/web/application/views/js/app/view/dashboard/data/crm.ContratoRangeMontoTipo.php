<?php
/**
 * Created by PhpStorm.
 * User: hero
 * time: 2/06/16
 * Time: 11:10
 */

function getRangeMonto($name, $period, $start, $end)
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

    $query = "SELECT COUNT(fechafirma) as clientquantity, 
	SUM(montototal) as clienttotalamount, 
	MIN(montototal) as clientminamount,
	AVG(montototal) as clientmeanamount, 
	MAX(montototal) as clientmaxamount,
	MIN(a.fechafirma) as clienttime,
	(EXTRACT(epoch FROM fechafirma) / EXTRACT(epoch FROM INTERVAL '$period'))::integer AS cluster
	FROM mod_crmcontratacion.dat_contrato a
	inner join mod_datosmaestros.nom_clientesproveedor b 
	on a.idclienteproveedor = b.idclientesproveedores 
	WHERE montototal > 0 AND b.nombre='$name' AND a.fechafirma IS NOT NULL $date
	GROUP BY cluster ORDER BY clienttime ASC";

    $result = pg_query($conn, $query);
    $clients = pg_fetch_all($result);

    $result = new \StdClass();
    $result->rows = $clients;
    $result->success = true;
    echo json_encode($result);
}

$type = isset($_POST['type']) ? $_POST['type'] : 'XETID';
$startDate = isset($_POST['initDate']) ? $_POST['initDate'] : false;
$endtDate = isset($_POST['endDate']) ? $_POST['endDate'] : false;
$period = isset($_POST['period']) ? $_POST['period'] : '6 month';

getRangeMonto($type, $period, $startDate, $endtDate);