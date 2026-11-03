<?php

class MedClienteModel extends ZendExt_Model
{

    public function MedClienteModel()
    {
        parent::ZendExt_Model();
    }

    /*     * --------------Guardar un nuevo cliente a medir-------------------------------* */
    public function guardar($contrato, $iddocumento)
    {
        $medicion = new MedCliente();
        $medicion->idcontrato = $contrato->idcontrato;
        $medicion->idcliente = $contrato->idcliente;
        $medicion->save();
        $model = new DocMedClienteModel();
        $model->guardar($iddocumento, $medicion->idmedicioncliente);
        $params = Array();
        $params['idcliente'] = $contrato->idcliente;
        $params['idservicio'] = $contrato->idservicio;
        //$data = DocMedicion::getLastDocumentPreparated($params);        
        //$obj->fechamedicion = $data[0]['DocMedCliente'][0]['MedCliente']['fechamedicion'];
        //$obj->cantidad = $data[0]['DocMedCliente'][0]['MedCliente']['medicion'];
        $obj->idmedicioncliente = $medicion->idmedicioncliente;
        HisMedicionModel::guardar($obj);
        return $medicion->idmedicioncliente;
    }

    /* -------------Guardar varios clientes a medir--------- */
    public function guardarClientes($params, $iddocumento)
    {
        $idsmediciones = array();
        $cont = 0;
        foreach ($params['clientes'] as $contrato) {
            $exists = MedCliente::existsConsumidorById($iddocumento, $contrato->idcontrato, $contrato->idcliente);
            if (count($exists) == 0) {
                $contrato->idservicio = $params['idservicio'];
                $idsmediciones[] = $this->guardar($contrato, $iddocumento);
            } else {
                $cont++;
            }
        }
        return array($idsmediciones, $cont);
    }

    /*     * ---------------Modificar una Medicion  de un cliente----------------* */
    public function modificar($id, $datos)
    {
        try {
            $q = Doctrine_Query::create()
                ->update('MedCliente')
                ->set($datos)
                ->where("idmedicioncliente = ?", $id);
            return $q->execute();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    /*     * ------------Eliminar medicion de un cliente---------------------* */
    public function eliminarMedicionCliente($idmedicioncliente)
    {
        try {
            $q = Doctrine_Query::create()
                ->delete('MedCliente mc')
                ->whereIn("mc.idmedicioncliente", $idmedicioncliente);
            return $q->execute();
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function eliminarMedCliente($arrayIdMedCliente)
    {
        try {
            for ($i = 0; $i < count($arrayIdMedCliente); $i++) {
                $result = $this->eliminarMedicionCliente($arrayIdMedCliente[$i]);
                if (!$result) {
                    return false;
                }
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    /*     * ---------------Actualizar fecha de la ultima lectura(fecha en que se aprueba el documento)------* */
    public function actualizarFechaUltimaLectura($iddocumento)
    {
        try {
            $fecha = $this->global->FechaContable->fecha;
            $sql = "UPDATE mod_logfacturacion.dat_medidorcliente m  SET fechamedicion = '$fecha'" .
                "WHERE m.idmedicioncliente in (select m2.idmedicioncliente from " .
                "mod_logfacturacion.dat_docmedicioncliente m2 " . "WHERE m2.iddocumento = {$iddocumento});";
            $con = Doctrine_Manager::getInstance()
                ->connection();
            return $con->execute($sql);
        } catch (Exception $e) {
            return false;
        }
    }
}