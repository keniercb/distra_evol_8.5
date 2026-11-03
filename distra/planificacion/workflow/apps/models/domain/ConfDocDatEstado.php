<?php

class ConfDocDatEstado extends BaseConfDocDatEstado
{
    public function setUp()
    {
        parent::setUp();

        $this->HasMany(
            'DatRestricciones',
            array('local' => 'idestado', 'foreign' => 'idestado')
        );
        $this->HasMany(
            'DatRestricciones',
            array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->HasMany(
            'ConfUsuarioConfDocDatEstado',
            array('local' => 'idestado', 'foreign' => 'idestado')
        );
        $this->hasOne(
            'ConfDoc', array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->hasOne(
            'DatEstado', array('local' => 'idestado', 'foreign' => 'idestado')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfDocDatEstado')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 1, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfDocDatEstado')->limit($limite = 1)->offset(
            $inicio = 10
        )->execute();
        return $result->toArray();
    }

    public function Actualizar($idestado, $idtdoc, $idautor, $valor)
    {
        $conn = Zend_Registry::get('conexion');
        $conn->execute(
            "UPDATE mod_flujotrabajo.conf_doc_dat_estado e SET inicial = 0
            WHERE e.idtipodoc = '$idtdoc'
            AND e.idautor = '$idautor'
            AND e.inicial = 1"
        );
        if ($valor == 1) {

            $conn->execute(
                "UPDATE mod_flujotrabajo.conf_doc_dat_estado e SET inicial = 1
                WHERE e.idtipodoc = '$idtdoc'
                AND e.idestado = '$idestado';"
            );
        }
    }

    public function ActualizarNotificacion($idestado, $idtdoc, $idautor, $valor)
    {
        $conn = Zend_Registry::get('conexion');
        $conn->execute(
            "UPDATE mod_flujotrabajo.conf_doc_dat_estado e
            SET notificacion = 0
            WHERE e.idtipodoc = '$idtdoc'
            AND e.idautor = '$idautor'
            AND e.notificacion = 1"
        );
        if ($valor == 1) {
            $conn->execute(
                "UPDATE mod_flujotrabajo.conf_doc_dat_estado e
                SET notificacion = 1
                WHERE e.idtipodoc = '$idtdoc'
                AND e.idestado = '$idestado';"
            );
        }
    }

    /*
     * Funcion para actualizar el control de cambio del estado
     */
    public function actualizarControl($parametros)
    {
        //print_r($parametros);die;
        $conn = Zend_Registry::get('conexion');
        $conn->execute(
            "UPDATE mod_flujotrabajo.conf_doc_dat_estado e
            SET generacontrol = 0
            WHERE e.idtipodoc = '$parametros->idtipodoc'
            AND e.idautor = '$parametros->idusuariosession'
            AND e.generacontrol = 1"
        );
        if ($parametros->valor == 1) {
            $conn->execute(
                "UPDATE mod_flujotrabajo.conf_doc_dat_estado e
                SET generacontrol = 1
                WHERE e.idtipodoc = '$parametros->idtipodoc'
                AND e.idestado = '$parametros->idestado';"
            );
        }
    }

    public function modificarControlCambio($params)
    {
        $conn = Doctrine_Manager:: connection();
        $cadenaA
            = "UPDATE mod_objetivos.dat_elementos SET controlcambio = 1
    	           WHERE mod_objetivos.dat_elementos.idtipoelemento = $params->idtipodoc
                       AND mod_objetivos.dat_elementos.idestadoaprob  IN ("
            . implode(",", $params->siguentes) . ")";
        if (isset($params->anteriores[0])) {
            $cadenaB
                = "UPDATE mod_objetivos.dat_elementos SET controlcambio = 0
    	           WHERE mod_objetivos.dat_elementos.idtipoelemento = $params->idtipodoc
                    AND mod_objetivos.dat_elementos.idestadoaprob  IN ("
                . implode(",", $params->anteriores) . ")";
            $conn->execute($cadenaB);
        }
        //print_r($cadenaA);die;
        $conn->execute($cadenaA);
        return true;
    }

    public function DocumentosConEstado($idestado)
    {
        $query = Doctrine_Query::create();
        $query->select('t.idtipodoc')
            ->from('ConfDocDatEstado t')
            ->where('t.idestado = ?', $idestado)
            ->execute();
        $doc = $query->fetchArray();
        return $doc;
    }

    public function ExisteDocumentosConEstado($idestado)
    {
        $query = Doctrine_Query::create();
        $query->select('count(t.idtipodoc)')
            ->from('ConfDocDatEstado t')
            ->where('t.idestado = ?', $idestado)
            ->execute();
        $doc = $query->fetchArray();
        return $doc[0]['count'] != 0;
    }

    public function VerificarAsociacionDocumentoEstado($idtipodoc, $idestado)
    {
        $connA = Doctrine_Manager:: connection();
        $query = Doctrine_Query::create();
        $query->select('*')
            ->from('ConfDocDatEstado t')
            ->where(
                't.idestado = ? and t.idtipodoc = ?',
                array($idestado, $idtipodoc)
            )
            ->execute();
        $resultado = $query->fetchArray();
        return $resultado;
    }


    public function generaControl($idestado, $idtipodoc, $idusuariosession)
    {
        $cadena
            = " SELECT e.generacontrol
                    FROM mod_flujotrabajo.conf_doc_dat_estado e
                    WHERE e.idtipodoc = $idtipodoc
                    AND e.idestado = $idestado
                    AND e.idautor = $idusuariosession ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultadofinal = $res->fetchAll();
        return $resultadofinal;
    }


}//fin clase



