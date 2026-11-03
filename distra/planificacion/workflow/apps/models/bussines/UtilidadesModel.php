<?php

class UtilidadesModel extends ZendExt_Model
{
    function UtilidadesModel()
    {
        parent::ZendExt_Model();
        $this->model[] = new DatTransicion();//0
        $this->model[] = new DatTransicionModel();//1
        $this->model[] = new ConfUsuarioConfDocDatEstado();//2
        //$this->model[] = new DatCondicion();//3
        $this->model[] = new DatTransicionConfUsuario();//4
        //$this->model[] = new TempAprobacion();//5
        $this->model[] = new TempAprobacionModel();
    }

    public function EliminarTrans($idtrans)
    {
        $estadoviejos = $this->model[0]->DameEstados($idtrans);
        $canti = $this->model[0]->DameCantTrans(
            $estadoviejos[0]['idestadoinicial']
        );
        $cantf = $this->model[0]->DameCantTrans(
            $estadoviejos[0]['idestadofinal']
        );
        if ($canti == 1) {
            $this->model[2]->EliminarUserTDocEstadoTrans(
                $estadoviejos[0]['idestadoinicial']
            );
        }
        if ($cantf == 1) {
            $this->model[2]->EliminarUserTDocEstadoTrans(
                $estadoviejos[0]['idestadofinal']
            );
        }
        $dattransicion = Doctrine::getTable('DatTransicion')->find($idtrans);
        $this->model[1]->Eliminar($dattransicion);
    }

    public function EjecutarWorkflow(
        $idusuario, $idestadoinicial, $idestadofinal, $idtipodoc, $obj
    )
    {
        if ($idtipodoc == 0) {
            $tipodoc = " AND t.tipodocplan = 1 ";
        }
        if ($idtipodoc == 1) {
            $tipodoc = " AND t.tipodocobjetivo = 1 ";
        }
        if ($idtipodoc == 3) {
            $tipodoc = " AND t.tipodocactividad = 1 ";
        }
        $existetransicion = DatTransicion::verificarAccesoTransicion(
            $idusuario, $idestadoinicial, $idestadofinal, $tipodoc
        );        
        if ($existetransicion[0]['idtransicion']) {
            $idtransicion = $existetransicion[0]['idtransicion'];
            $chequearprecond = $this->chequearPreCondiciones();
            $chequearpostcond = $this->chequearPostCondiciones(
                $idestadoinicial, $idusuario
            );
            if ($chequearprecond == 1 && $chequearpostcond == 1) {
                $respuesta = 1;
            }
        } else {
            $respuesta = 3;
        }
        return $respuesta;
    }

    public function Precondiciones($idtrans, $obj, $idsub)
    {
        //Establecer el modulo de donde se va a cargar los servicios
        $modulo = '';
        $arryErrores = Array();
        switch ($idsub) {
            case 15: {
                $modulo = 'planificacion';
                }
                break;
            default: {
            $modulo = 'configuracion';
                }
        }
        $servicios = $this->model[3]->GetCondicionesPrePos($idtrans, 0);
        foreach ($servicios as $row) {
            if (!$this->integrator->$modulo->$row['condicion']($obj)) {
                $arryErrores[] = array('msg' =>
                                           'Fall&oacute; la pre-condici&oacute;n '
                                           . $row['condicion']);
            }
        }
        if (count($arryErrores) > 0) {
            return $arryErrores;
        } else {
            return true;
        }
    }

    public function Poscondiciones(
        $idtdoc, $idestadoi, $idestadof, $iduser, $obj, $idsub
    )
    {
        //Establecer el modulo de donde se va a cargar los servicios
        $modulo = '';
        $arryErrores = Array();
        switch ($idsub) {
            case 15: {
                $modulo = 'planificacion';
                }
                break;
            default: {
            $modulo = 'configuracion';
                }
        }
        $transicion = $this->model[0]->TransicionId(
            $idtdoc, $idestadoi, $idestadof, $iduser
        );
        $idtrans = $transicion[0]['idtransicion'];
        if (!empty ($idtrans)) {
            $servicios = $this->model[3]->GetCondicionesPrePos($idtrans, 1);
            foreach ($servicios as $row) {
                if (!$this->integrator->$modulo->$row['condicion']($obj)) {
                    $arryErrores[] = array('msg' =>
                                               'Fall&oacute; la pos-condici&oacute;n '
                                               . $row['condicion']);
                }
            }
            if (count($arryErrores) > 0) {
                return array('tipo' => 2, 'msg' => $arryErrores);
            } else {
                return array('tipo' => 1,
                             'msg'  => 'Las pos-condiciones se ejecutaron correctamente.');
            }
        } else {
            return array('tipo' => 2,
                         'msg'  => 'La transici&oacute;n seleccionada no existe.');
        }
    }

    public function EliminarUserTemp($user, $idtrans, $idtipodoc)
    {
        $usertemp = $this->model[5]->UsuariosSimultaneos($idtrans);
        if (count($usertemp) > 0) {
            foreach ($usertemp as $variable) {
                $flag = false;
                foreach ($user as $row) {
                    if ($variable['idusuario'] == $row) {
                        $flag = true;
                    }
                }
                if ($flag == false) {
                    $this->model[5]->EliminarTempUser(
                        $variable['idusuario'], $idtipodoc, $idtrans
                    );
                }
            }
        }
    }

    public function chequearPreCondiciones()
    {
        $respuesta = 1;
        return $respuesta;
    }

    public function chequearPostCondiciones($idestado, $idusuario)
    {
        //para esta version de FT solo existe una sola post-condicion
        $procede = 1;
        $arrayobjpostconacceso = Doctrine::getTable('DatPostconacceso')
            ->findByDql("idestado = $idestado ");
        if (isset($arrayobjpostconacceso[0]->idpostconacceso)
            && $arrayobjpostconacceso[0]->idpostconacceso != null
            && $arrayobjpostconacceso[0]->idpostconacceso != ''
        ) {
            $procede = 0;
            foreach ($arrayobjpostconacceso as $objpostconacceso) {
                if ($objpostconacceso->idusuario == $idusuario AND
                    $objpostconacceso->modificar == 1
                ) {
                    $procede = 1;
                }
            }
        }
        return $procede;
    }


}


