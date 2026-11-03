<?php

/**
 * Created by PhpStorm.
 * User: kenier
 * Date: 27/10/16
 * Time: 13:08
 */
class ActivosEyCValidator
{

    /**
     * LogisticaEyCValidator constructor.
     */
    public function __construct()
    {
    }

    public function validarEliminar($arrayIdEstructura)
    {
        $tienemedios = self::existeEstructuraConMedios($arrayIdEstructura);
        if ($tienemedios) {
            throw new ZendExt_Exception('LOG_AFT_ELIM_ESTRUC_001');
        }
        return true;
    }

    public function validarMover($arrayIdEstructura){
        $tienemedios = self::existeEstructuraConMedios($arrayIdEstructura);
        if ($tienemedios) {
            throw new ZendExt_Exception('LOG_AFT_MOV_ESTRUC_001');
        }
        return true;
    }

    private function existeEstructuraConMedios($arrIdEstructura){

        if (!is_array($arrIdEstructura)) {
            $arrIdEstructura = array($arrIdEstructura);
        }
        $sqlIdEyC = implode(',', $arrIdEstructura);

        $sql = "SELECT p.idproducto, p.idestructuracomun, p.idestructura FROM mod_logistica.dat_producto p
                WHERE (p.idestructura in ({$sqlIdEyC})
                  or p.idestructuracomun in ({$sqlIdEyC}) )
                  and p.idproducto in (
                    select DISTINCT rn.idproducto from mod_logactivofijotangible.dat_registronumerico rn
                )";
        $conn = Zend_Registry::get('conexion');
        $estructura = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        if(count($estructura) > 0)
            return true;
        return false;
    }
}