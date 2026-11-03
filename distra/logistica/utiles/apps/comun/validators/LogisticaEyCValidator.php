<?php

/**
 * Created by PhpStorm.
 * User: kenier
 * Date: 27/10/16
 * Time: 13:08
 */
class LogisticaEyCValidator
{

    /**
     * LogisticaEyCValidator constructor.
     */
    public function __construct()
    {
    }

    public function validarEliminar($arrayIdEstructura)
    {
        if (!is_array($arrayIdEstructura)) {
            $arrayIdEstructura = array($arrayIdEstructura);
        }
        $sqlIdEyC = implode(',', $arrayIdEstructura);
        $sql = "select count(distinct p.idestructura)
                    from mod_logistica.dat_producto p
                    where p.idestructura in(select  f.idfila
                    from mod_estructuracomp.nom_filaestruc f 
                    left join mod_estructuracomp.dat_estructura e on e.idestructura = f.idfila
                    left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila
                    where f.parent_path operator(public.<@) (select  parent_path
                    from mod_estructuracomp.nom_filaestruc where idfila={$sqlIdEyC}))";
        $estructura = Doctrine_Manager::connection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        if ($estructura[0] != 0) {
            throw new ZendExt_Exception('LOG_LB_GEN_001');
        }
        return true;
    }

}