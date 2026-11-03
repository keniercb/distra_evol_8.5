<?php

class ConfAsociacionCuentasContablesModel extends ZendExt_Model
{
    public function ConfAsociacionCuentasContablesModel()
    {
        parent::ZendExt_Model();
    }

    public function fnObtenerListadoAsociacionCuentas($identidad, $idtiponomina)
    {
        return ConfAsociacionCuentasContables::fnObtenerListadoAsociacionCuentas($identidad, $idtiponomina);
    }

    public function fnAdicionarAsociacionCuenta($identidad, $idtiponomina, $denominacion, $arrcuentasdeudoras, $arrcuentaacreedoras)
    {
        $obj = new ConfAsociacionCuentasContables();
        $obj->identidad = $identidad;
        $obj->idtiponomina = $idtiponomina;
        $obj->denominacion = $denominacion;
        $obj->cuentasdeudoras = serialize($arrcuentasdeudoras);
        $obj->cuentasacreedoras = serialize($arrcuentaacreedoras);
        $obj->save();
        return 'ok';
    }

    public function fnEliminarAsociacionCuenta($cuentaseliminarparam)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        foreach ($cuentaseliminarparam as $idasociacioncuentascont) {
            $sql = " delete from mod_nomina.conf_asociacioncuentascontables where idasociacioncuentascont = ?";
            $conn->fetchAll($sql, array($idasociacioncuentascont));
        }
        $conn->commit();
        return 'ok';
    }

    public function fnReplicarAsociacionCuentas($identidad, $arridentidades, $arridtiponominas)
    {

        $obj = new ConfAsociacionCuentasContables();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        //Obteniendo las asociaciones a replicar, por cada tipo de nomina, de la entidad actual
        $configasociaciones = $obj->fnObtenerConfAsociacionXIdEntidadyTipoNomina($identidad, $arridtiponominas);

        foreach ($arridentidades as $identidadrep) {//lista de entidades a las que se va a replicar
            $sqldelete = "DELETE FROM mod_nomina.conf_asociacioncuentascontables where identidad = ?";
            $conn->execute($sqldelete, array($identidadrep));

            foreach ($configasociaciones as $asociacion) {//lista de asociaciones que se van a crear por cada entidad
                $sql = "INSERT INTO mod_nomina.conf_asociacioncuentascontables(
                          identidad,
                          cuentasdeudoras,
                          cuentasacreedoras,
                          idtiponomina,
                          denominacion
                        )
                        VALUES (
                          {$identidadrep},
                          '{$asociacion['cuentasdeudoras']}',
                          '{$asociacion['cuentasacreedoras']}',
                          {$asociacion['idtiponomina']},
                          '{$asociacion['denominacion']}'
                        )";
                $conn->execute($sql);
            }
        }
        $conn->commit();
        return 'ok';
    }

}
