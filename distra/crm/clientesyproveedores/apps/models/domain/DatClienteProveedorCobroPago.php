<?php

/**
 * Created by PhpStorm.
 * User: alberto
 * Date: 01/03/2016
 * Time: 2:16
 */
class DatClienteProveedorCobroPago extends BaseDatClienteProveedorCobroPago
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomClienteproveedor', array('local'   => 'idclienteproveedor',
                                         'foreign' => 'idclienteproveedores')
        );
        parent::setUp();
    }

    public function getCuentasbyClienteProveedor($idcliente, $idestrucura, $cobrospagos = null,$moneda = null,$cuenta = null)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();

        $andwhere = "";
        if ($cobrospagos != null) {
            if(!is_array($cobrospagos)) {
                $andwhere .= " AND cpcp.clasificacion =" . $cobrospagos;
            }
            else {
                $in = '(' . implode(',', $cobrospagos) . ')';
                $andwhere .= " AND cpcp.clasificacion IN " . $in;
            }
        }
        if($moneda!= null){
            $andwhere .= " AND cpcp.idmoneda =" . $moneda;
        }
        if($cuenta!=null){
            $andwhere .= " AND cpcp.idcuenta =" . $cuenta;
        }
        $query = "SELECT cpcp.idclienteproveedorcobropago,cpcp.idcuenta,ncu.concatcta||' '||ncu.descripcion as nombrecuenta,
                cpcp.clasificacion as idclasificacion,nt.idterminodepago,nt.nombre as nombreterminodepago,nt.plazo,
                cpcp.idmoneda,nm.codigoiso,cpcp.idclienteproveedor, 
                oe.idnomoperaciones as idoperacionesentidad, o.denominacion as nombreoperacion
                FROM mod_datosmaestros.dat_clienteproveedorcobropago cpcp
                LEFT JOIN mod_contabilidad.nom_cuenta ncu ON (cpcp.idcuenta = ncu.idcuenta)
                LEFT JOIN mod_datosmaestros.nom_moneda nm ON (cpcp.idmoneda = nm.idmoneda)
                LEFT JOIN mod_datosmaestros.nom_terminosdepago nt ON (cpcp.idterminodepago = nt.idterminodepago)
                LEFT JOIN mod_datosmaestros.dat_operacionesentidad oe ON (oe.idoperacionesentidad = cpcp.idoperacionentidad)
                LEFT JOIN mod_datosmaestros.nom_operacion o ON (oe.idnomoperaciones = o.idnomoperaciones)
                WHERE cpcp.idclienteproveedor=$idcliente and cpcp.idestructura = $idestrucura $andwhere;";
        $result = $conexionActual->fetchAll($query);
        return $result;
    }

    static function deleteFromArray($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatClienteProveedorCobroPago')
            ->whereIn('idclienteproveedorcobropago', $array)
            ->execute();
    }
} 