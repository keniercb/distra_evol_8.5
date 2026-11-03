<?php
/**
 * Created by PhpStorm.
 * User: hero
 * time: 2/06/16
 * Time: 11:10
 */

function getMontoClients() {
    $query = "Select count(montototal) , type from (
	Select (CASE WHEN b.registrado = 0 THEN b.nombre else
	COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as type, a.montototal, a.idclienteproveedor
	from mod_crmcontratacion.dat_contrato as a
	inner join mod_datosmaestros.nom_clientesproveedor as b
	LEFT JOIN mod_estructuracomp.dat_estructura estru ON (b.idestructura = estru.idestructura and estru.idproyecto=0)
    LEFT JOIN mod_persona.dat_persona per ON (b.idpersona = per.idpersona)
	on a.idclienteproveedor=b.idclientesproveedores
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

getMontoClients();