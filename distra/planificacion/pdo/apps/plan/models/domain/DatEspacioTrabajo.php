<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Domain
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class DatEspacioTrabajo extends BaseDatDocEspacioTrabajo
{

    public function setUp()
    {
        parent::setUp();
    }

    public function ExisteArea($param) {
        $conn =  Doctrine_Manager::connection();
        $sql = "SELECT idespaciotrabajo, idareagestor, idproceso, tipoproceso
                FROM mod_planificacion.dat_espaciotrabajo
                WHERE
                  dat_espaciotrabajo.idproceso = {$param['idproceso']} and dat_espaciotrabajo.tipoproceso = '{$param['tipoproceso']}'";
        //  print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        
        return $datos;
    }
    public function SalvarArea($param, $idespacio) {
        $conn =  Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planificacion.dat_espaciotrabajo(
                    idareagestor, idproceso, tipoproceso)
                VALUES ('$idespacio', {$param['idproceso']}, '{$param['tipoproceso']}'); ";
        //  print_r($sql);die;
        $conn->execute($sql);
        return 1;
    }
}
