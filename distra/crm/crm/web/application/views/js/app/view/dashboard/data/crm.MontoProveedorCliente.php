<?php
/**
 * Created by PhpStorm.
 * User: hero
 * Date: 2/06/16
 * Time: 11:10
 */

function getMontoProveedorCliente($time, $isClient=0, $top=0) {
    $query = "Select max(fechafirma) as time, 
    case when count(montototal) < 3 THEN 'extra small'
    when count(montototal) >= 3 and count(montototal) < 6 THEN 'small'
    when count(montototal) >= 6 and count(montototal) < 9 THEN 'medium'
    when count(montototal) >= 9 and count(montototal) < 12 THEN 'large'
    when count(montototal) >= 12 THEN 'extra large' end as size, 
    count(montototal) as quantity, avg(montototal) as mean, sum(montototal) as amount, client_name from (
	Select (CASE WHEN b.registrado = 0 THEN b.nombre else
	COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as client_name, a.montototal, a.idclienteproveedor, a.fechafirma
	from mod_crmcontratacion.dat_contrato as a
	inner join mod_datosmaestros.nom_clientesproveedor as b
	LEFT JOIN mod_estructuracomp.dat_estructura estru ON (b.idestructura = estru.idestructura and estru.idproyecto=0)
    LEFT JOIN mod_persona.dat_persona per ON (b.idpersona = per.idpersona)
	on a.idclienteproveedor=b.idclientesproveedores and a.cliente=$isClient
	) as c ";

	if($time) {
		$query .= "where fechafirma <= '$time' ";
	}

	$query .= "group by c.client_name ";
	
	if($top == 0) {
	  $query .= "order by amount desc limit 10 ";	
	}
	
	if($top == 1) {
	  $query .= "order by amount asc limit 10 ";	
	}

    $conn_string = "host=10.12.170.138 port=5432 dbname=distra-beta user=zeolides password=zeolides*2012.,";
    $conn = pg_connect($conn_string);
    $result = pg_query($conn, $query);
    $e = pg_fetch_all($result);
    $result = new \StdClass();
    $result->rows = $e;
    $result->success = true;
    echo json_encode($result);
}

/*
function getMontoProveedorClienteEstado($isClient=0) {
    $result = '{"rows":[{"quantity":"9","mean":"16993.000000000000","amount":"152937","client_name":"XETID"},{"quantity":"11","mean":"17383.454545454545","amount":"191218","client_name":"UIM"},{"quantity":"9","mean":"15453.888888888889","amount":"139085","client_name":"TRD Caribe"},{"quantity":"11","mean":"15650.000000000000","amount":"172150","client_name":"Unidad de Servicios del INRE"},{"quantity":"8","mean":"16492.250000000000","amount":"131938","client_name":"Gaviota SA"}],"success":true}
';
    echo $result;
}*/
getMontoProveedorCliente(
	isset($_POST['time'])?$_POST['time']:false,
	isset($_POST['isClient'])?$_POST['isClient']:0, 
	isset($_POST['top'])?$_POST['top']:0
);
